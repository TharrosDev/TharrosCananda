"use client";

import { type KeyboardEvent, useEffect, useRef, useState } from "react";
import type { PDFDocumentProxy } from "pdfjs-dist";
import { canvasRatio, nextZoom } from "@/lib/viewer";
import "./report-viewer.css";

type Props = { file: string; pages: number; title: string };

// Letter at 96 dpi: the size the PDF was printed at, so sheets reserve the right space before rendering.
const SHEET_WIDTH = 816;
const SHEET_HEIGHT = 1056;
const MAX_FIT_WIDTH = 900;

export function ReportViewer({ file, pages, title }: Props) {
  const rootRef = useRef<HTMLElement>(null);
  const sheetsRef = useRef<HTMLDivElement>(null);
  const [doc, setDoc] = useState<PDFDocumentProxy | null>(null);
  const [zoom, setZoom] = useState<number | "fit">("fit");
  const [width, setWidth] = useState(0);
  const [failed, setFailed] = useState(false);
  // Loading is derived: the sheets are current once the last completed render matches the requested one.
  const [renderedKey, setRenderedKey] = useState("");
  const [current, setCurrent] = useState(1);
  const [pageInput, setPageInput] = useState("1");

  // "Fit width" follows the available space, phones included.
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const fitScale = Math.min(width || SHEET_WIDTH, MAX_FIT_WIDTH) / SHEET_WIDTH;
  // Rounded so sub-pixel resizes do not trigger a re-render.
  const scale = Math.round((zoom === "fit" ? fitScale : zoom) * 100) / 100;
  const rendering = renderedKey !== `${file}@${scale}`;

  // One document (and one pdf.js worker) per file, destroyed when the file changes or the viewer unmounts.
  useEffect(() => {
    let loadingTask: { promise: Promise<PDFDocumentProxy>; destroy: () => Promise<void> } | null = null;
    let cancelled = false;
    (async () => {
      try {
        const pdfjs = await import("pdfjs-dist");
        if (cancelled) return;
        pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
        loadingTask = pdfjs.getDocument({ url: file });
        const loaded = await loadingTask.promise;
        if (!cancelled) setDoc(loaded);
      } catch {
        if (!cancelled) setFailed(true);
      }
    })();
    return () => {
      cancelled = true;
      setDoc(null);
      void loadingTask?.destroy();
    };
  }, [file]);

  // Draw each page into a fresh off-screen canvas and text layer, then swap them in, so an
  // interrupted render never blanks a sheet or shares a canvas with the next render.
  const hasWidth = width > 0;
  useEffect(() => {
    if (!doc || !hasWidth) return;
    let cancelled = false;
    const tasks: { cancel: () => void }[] = [];
    (async () => {
      try {
        const pdfjs = await import("pdfjs-dist");
        // ponytail: renders every page up front; switch to IntersectionObserver-driven rendering past ~20 pages.
        for (let n = 1; n <= doc.numPages; n += 1) {
          const page = await doc.getPage(n);
          if (cancelled) return;
          const sheet = sheetsRef.current?.querySelector<HTMLElement>(`.report-sheet[data-page="${n}"]`);
          if (!sheet) continue;
          const viewport = page.getViewport({ scale: scale * (96 / 72) });
          const ratio = canvasRatio(viewport.width, viewport.height, window.devicePixelRatio);
          const canvas = document.createElement("canvas");
          canvas.setAttribute("aria-hidden", "true");
          canvas.width = Math.floor(viewport.width * ratio);
          canvas.height = Math.floor(viewport.height * ratio);
          canvas.style.width = `${viewport.width}px`;
          canvas.style.height = `${viewport.height}px`;
          const task = page.render({ canvas, viewport, transform: ratio === 1 ? undefined : [ratio, 0, 0, ratio, 0, 0] });
          tasks.push(task);
          await task.promise;
          if (cancelled) return;
          const layer = document.createElement("div");
          layer.className = "textLayer";
          layer.style.setProperty("--total-scale-factor", String(viewport.scale));
          const textLayer = new pdfjs.TextLayer({ textContentSource: page.streamTextContent(), container: layer, viewport });
          tasks.push(textLayer);
          await textLayer.render();
          if (cancelled) return;
          sheet.replaceChildren(canvas, layer);
        }
        if (!cancelled) setRenderedKey(`${file}@${scale}`);
      } catch (error) {
        if (!cancelled && (error as Error)?.name !== "RenderingCancelledException") setFailed(true);
      }
    })();
    return () => {
      cancelled = true;
      tasks.forEach((task) => task.cancel());
    };
  }, [doc, file, scale, hasWidth]);

  // The page counter follows the sheet in the middle of the viewport.
  useEffect(() => {
    const sheets = sheetsRef.current?.querySelectorAll<HTMLElement>(".report-sheet");
    if (!sheets?.length) return;
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && setCurrent(Number((entry.target as HTMLElement).dataset.page))),
      { rootMargin: "-45% 0px -45% 0px" },
    );
    sheets.forEach((sheet) => observer.observe(sheet));
    return () => observer.disconnect();
  }, [pages, failed]);

  const [shownPage, setShownPage] = useState(current);
  if (shownPage !== current) {
    setShownPage(current);
    setPageInput(String(current));
  }

  function goTo(n: number) {
    const target = Math.min(Math.max(1, n || 1), pages);
    setCurrent(target);
    setPageInput(String(target));
    sheetsRef.current?.querySelector(`.report-sheet[data-page="${target}"]`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  const zoomBy = (delta: number) => setZoom((z) => nextZoom(z === "fit" ? fitScale : z, delta));

  function onKeyDown(event: KeyboardEvent) {
    // Leave browser shortcuts (Ctrl/Cmd +, Alt combos) and typing in the page field alone.
    if (event.ctrlKey || event.metaKey || event.altKey || (event.target as HTMLElement).tagName === "INPUT") return;
    if (event.key === "PageDown" && current < pages) {
      event.preventDefault();
      goTo(current + 1);
    } else if (event.key === "PageUp" && current > 1) {
      event.preventDefault();
      goTo(current - 1);
    } else if (event.key === "+" || event.key === "=") zoomBy(0.1);
    else if (event.key === "-") zoomBy(-0.1);
  }

  const download = (
    <a className="report-viewer-download" href={file} download>
      Download PDF
    </a>
  );

  return (
    <section
      ref={rootRef}
      className="report-viewer"
      aria-label={`${title}: PDF`}
      data-report-viewer
      data-loading={rendering && !failed ? "" : undefined}
      onKeyDown={onKeyDown}
    >
      {/* Without JavaScript there is nothing to draw: hide the empty sheets and inert controls. */}
      <noscript>
        <style>{".report-viewer-sheets,.report-viewer-pages,.report-viewer-zoom{display:none!important}"}</style>
      </noscript>
      <div className="report-viewer-toolbar" role="toolbar" aria-label="PDF controls">
        <form className="report-viewer-pages" onSubmit={(event) => { event.preventDefault(); goTo(Number(pageInput)); }}>
          <label htmlFor="report-page">Page</label>
          <input
            id="report-page"
            inputMode="numeric"
            value={pageInput}
            onChange={(event) => setPageInput(event.target.value.replace(/\D/g, ""))}
            aria-describedby="report-page-total"
          />
          <span id="report-page-total">of {pages}</span>
        </form>
        <div className="report-viewer-zoom">
          <button type="button" onClick={() => zoomBy(-0.1)} aria-label="Zoom out">−</button>
          <output aria-live="polite">{Math.round(scale * 100)}%</output>
          <button type="button" onClick={() => zoomBy(0.1)} aria-label="Zoom in">+</button>
          <button type="button" onClick={() => setZoom("fit")} aria-pressed={zoom === "fit"}>Fit width</button>
        </div>
        {download}
      </div>
      {failed ? (
        <div className="report-viewer-error" role="alert">
          <p>The PDF could not be displayed.</p>
          {download}
        </div>
      ) : (
        <div className="report-viewer-sheets" ref={sheetsRef} tabIndex={0} role="region" aria-label="Report pages">
          {Array.from({ length: pages }, (_, i) => (
            <div key={i} className="report-sheet" data-page={i + 1} style={{ width: SHEET_WIDTH * scale, height: SHEET_HEIGHT * scale }} />
          ))}
        </div>
      )}
    </section>
  );
}
