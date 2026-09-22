"use client";

import { type KeyboardEvent, useEffect, useRef, useState } from "react";
import "./report-viewer.css";

type Props = { file: string; pages: number; title: string };

// Letter at 96 dpi: the size the PDF was printed at, so sheets reserve the right space before rendering.
const SHEET_WIDTH = 816;
const SHEET_HEIGHT = 1056;
const MAX_FIT_WIDTH = 900;

export function ReportViewer({ file, pages, title }: Props) {
  const rootRef = useRef<HTMLElement>(null);
  const sheetsRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState<number | "fit">("fit");
  const [width, setWidth] = useState(0);
  // Loading is derived: the sheets are current once the last completed render matches the requested one.
  const [renderedKey, setRenderedKey] = useState("");
  const [failed, setFailed] = useState(false);
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

  const scale = zoom === "fit" ? Math.min(width || SHEET_WIDTH, MAX_FIT_WIDTH) / SHEET_WIDTH : zoom;
  const renderKey = `${file}@${scale}`;
  const rendering = renderedKey !== renderKey;

  useEffect(() => {
    if (!width) return;
    let cancelled = false;
    const tasks: { cancel: () => void }[] = [];
    (async () => {
      try {
        const pdfjs = await import("pdfjs-dist");
        pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
        const doc = await pdfjs.getDocument({ url: file }).promise;
        // ponytail: renders every page up front; switch to IntersectionObserver-driven rendering past ~20 pages.
        for (let n = 1; n <= doc.numPages && !cancelled; n += 1) {
          const sheet = sheetsRef.current?.querySelector<HTMLElement>(`.report-sheet[data-page="${n}"]`);
          if (!sheet) continue;
          const page = await doc.getPage(n);
          const viewport = page.getViewport({ scale: scale * (96 / 72) });
          const ratio = window.devicePixelRatio || 1;
          const canvas = sheet.querySelector("canvas")!;
          canvas.width = Math.floor(viewport.width * ratio);
          canvas.height = Math.floor(viewport.height * ratio);
          canvas.style.width = `${viewport.width}px`;
          canvas.style.height = `${viewport.height}px`;
          const task = page.render({ canvas, viewport, transform: ratio === 1 ? undefined : [ratio, 0, 0, ratio, 0, 0] });
          tasks.push(task);
          await task.promise;
          const layer = sheet.querySelector<HTMLDivElement>(".textLayer")!;
          layer.replaceChildren();
          layer.style.setProperty("--total-scale-factor", String(viewport.scale));
          await new pdfjs.TextLayer({ textContentSource: page.streamTextContent(), container: layer, viewport }).render();
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
  }, [file, scale, width]);

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
    setPageInput(String(target));
    sheetsRef.current?.querySelector(`.report-sheet[data-page="${target}"]`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  const zoomBy = (delta: number) =>
    setZoom((z) => Math.min(2, Math.max(0.4, Math.round(((z === "fit" ? scale : z) + delta) * 10) / 10)));

  function onKeyDown(event: KeyboardEvent) {
    if ((event.target as HTMLElement).tagName === "INPUT") return;
    if (event.key === "PageDown") {
      event.preventDefault();
      goTo(current + 1);
    } else if (event.key === "PageUp") {
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
        <div className="report-viewer-sheets" ref={sheetsRef} tabIndex={0} aria-label="Report pages">
          {Array.from({ length: pages }, (_, i) => (
            <div key={i} className="report-sheet" data-page={i + 1} style={{ width: SHEET_WIDTH * scale, height: SHEET_HEIGHT * scale }}>
              <canvas aria-hidden="true" />
              <div className="textLayer" />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
