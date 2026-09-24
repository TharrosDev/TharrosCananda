"use client";

import {
  type KeyboardEvent,
  type MouseEvent,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  ViewTransition,
} from "react";
import type { PDFDocumentProxy } from "pdfjs-dist";
import type { ContentsEntry } from "@/lib/report-sections";
import { canvasRatio, findPattern, nextZoom } from "@/lib/viewer";
import "./report-viewer.css";

type Props = {
  file: string;
  pages: number;
  title: string;
  contents?: ContentsEntry[];
  /** The page-1 image: shown while pdf.js draws, and the target the archive and home covers morph into. */
  cover?: string;
  slug?: string;
  /** Page size in PDF points; defaults to Letter. Supplied PDFs may be A4. */
  pageWidth?: number;
  pageHeight?: number;
};

const MAX_FIT_WIDTH = 900;
const MAX_FIT_WIDTH_FULLSCREEN = 1240;

type Fullscreen = false | "native" | "overlay";
const NO_MATCHES: Range[] = [];
// Custom Highlight API: paints find results over the transparent text layer without touching its DOM.
type HighlightRegistry = {
  set: (name: string, value: unknown) => void;
  delete: (name: string) => void;
};
const highlights = () =>
  typeof CSS !== "undefined" && "highlights" in CSS && typeof Highlight !== "undefined"
    ? (CSS as unknown as { highlights: HighlightRegistry }).highlights
    : null;

export function ReportViewer({
  file,
  pages,
  title,
  contents = [],
  cover,
  slug,
  pageWidth = 612,
  pageHeight = 792,
}: Props) {
  // The PDF's page size at 96 dpi, so sheets reserve the right space before rendering.
  const SHEET_WIDTH = (pageWidth * 96) / 72;
  const SHEET_HEIGHT = (pageHeight * 96) / 72;
  const rootRef = useRef<HTMLElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const sheetsRef = useRef<HTMLDivElement>(null);
  const [doc, setDoc] = useState<PDFDocumentProxy | null>(null);
  const [zoom, setZoom] = useState<number | "fit">("fit");
  const [width, setWidth] = useState(0);
  const [failed, setFailed] = useState(false);
  // Loading is derived: the sheets are current once the last completed render matches the requested one.
  const [renderedKey, setRenderedKey] = useState("");
  const [current, setCurrent] = useState(1);
  const [pageInput, setPageInput] = useState("1");
  const [fullscreen, setFullscreen] = useState<Fullscreen>(false);
  const [section, setSection] = useState(-1);
  const [contentsOpen, setContentsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [found, setMatches] = useState<Range[]>([]);
  const [matchIndex, setMatchIndex] = useState(0);
  const anchor = useRef<{ page: number; offset: number } | null>(null);
  // A link from an archive match opens the report at its page with the word already found:
  // #page=2&search=term, the same fragment a browser's own PDF viewer understands.
  const jumpTo = useRef<{ page: number; search: string } | null>(null);
  const holdAnchor = useRef(false);

  // "Fit width" follows the space beside the contents, phones and full screen included.
  useEffect(() => {
    const el = mainRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const maxFit = fullscreen ? MAX_FIT_WIDTH_FULLSCREEN : MAX_FIT_WIDTH;
  const fitScale = Math.min(width || SHEET_WIDTH, maxFit) / SHEET_WIDTH;
  // Rounded so sub-pixel resizes do not trigger a re-render.
  const scale = Math.round((zoom === "fit" ? fitScale : zoom) * 100) / 100;
  const renderKey = `${file}@${scale}`;
  const rendering = renderedKey !== renderKey;
  // Matches only count while the text layers they point into are the current ones.
  const matches = findPattern(query) && !rendering && !failed ? found : NO_MATCHES;

  // One document (and one pdf.js worker) per file, destroyed when the file changes or the viewer unmounts.
  useEffect(() => {
    let loadingTask: { promise: Promise<PDFDocumentProxy>; destroy: () => Promise<void> } | null =
      null;
    let cancelled = false;
    (async () => {
      try {
        const pdfjs = await import("pdfjs-dist");
        if (cancelled) return;
        pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
        loadingTask = pdfjs.getDocument({ url: file });
        const loaded = await loadingTask.promise;
        if (cancelled) return;
        setDoc(loaded);
        const params = new URLSearchParams(window.location.hash.slice(1));
        const page = Number(params.get("page")) || 0;
        const raw = (params.get("search") ?? "").slice(0, 80);
        // A term too short to find is dropped, so the link still lands on its page.
        const search = findPattern(raw) ? raw : "";
        if (page || search) {
          jumpTo.current = { page: Math.min(Math.max(1, page || 1), pages), search };
          if (search) setQuery(search);
        }
      } catch {
        if (!cancelled) setFailed(true);
      }
    })();
    return () => {
      cancelled = true;
      setDoc(null);
      void loadingTask?.destroy();
    };
  }, [file, pages]);

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
          const sheet = sheetsRef.current?.querySelector<HTMLElement>(
            `.report-sheet[data-page="${n}"]`,
          );
          if (!sheet) continue;
          const viewport = page.getViewport({ scale: scale * (96 / 72) });
          const ratio = canvasRatio(viewport.width, viewport.height, window.devicePixelRatio);
          const canvas = document.createElement("canvas");
          canvas.setAttribute("aria-hidden", "true");
          canvas.width = Math.floor(viewport.width * ratio);
          canvas.height = Math.floor(viewport.height * ratio);
          canvas.style.width = `${viewport.width}px`;
          canvas.style.height = `${viewport.height}px`;
          const task = page.render({
            canvas,
            viewport,
            transform: ratio === 1 ? undefined : [ratio, 0, 0, ratio, 0, 0],
          });
          tasks.push(task);
          await task.promise;
          if (cancelled) return;
          const layer = document.createElement("div");
          layer.className = "textLayer";
          layer.style.setProperty("--total-scale-factor", String(viewport.scale));
          const textLayer = new pdfjs.TextLayer({
            textContentSource: page.streamTextContent(),
            container: layer,
            viewport,
          });
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

  // Full screen scrolls the viewer itself; otherwise the page scrolls.
  const scroller = useCallback(() => (fullscreen ? rootRef.current : null), [fullscreen]);
  /**
   * The reading line, measured where it will be after a scroll rather than where it is now: under the
   * site header (or the full-screen edge), plus the toolbar when it is sticky. Before the toolbar sticks,
   * its current position sits far down the page and would make every jump land short.
   */
  const readingLine = useCallback(() => {
    const edge = fullscreen
      ? (rootRef.current?.getBoundingClientRect().top ?? 0)
      : (document.querySelector(".site-header")?.getBoundingClientRect().bottom ?? 0);
    const toolbar = toolbarRef.current;
    const sticky =
      toolbar && getComputedStyle(toolbar).position === "sticky" ? toolbar.offsetHeight : 0;
    return Math.max(edge, 0) + sticky + 16;
  }, [fullscreen]);
  const scrollByY = useCallback(
    (delta: number, smooth = true) =>
      (scroller() ?? window).scrollBy({
        top: delta,
        // CSS scroll-behavior does not override an explicit JS behavior, so honour reduced motion here.
        behavior:
          smooth && !window.matchMedia("(prefers-reduced-motion: reduce)").matches
            ? "smooth"
            : "instant",
      }),
    [scroller],
  );

  // Page counter and current section both follow the reading line as the report scrolls.
  useEffect(() => {
    if (failed) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const sheets = sheetsRef.current?.querySelectorAll<HTMLElement>(".report-sheet");
      if (!sheets?.length) return;
      const line = readingLine() + 40;
      let page = 1;
      sheets.forEach((sheet, i) => {
        if (sheet.getBoundingClientRect().top <= line) page = i + 1;
      });
      setCurrent(page);
      // Where the reader is, as page + fraction, so a zoom or full-screen change can put them back.
      const rect = sheets[page - 1].getBoundingClientRect();
      if (!holdAnchor.current)
        anchor.current =
          rect.top <= line ? { page, offset: Math.min(1, (line - rect.top) / rect.height) } : null;
      const ys = contents.map((entry) => {
        const box = sheets[entry.page - 1]?.getBoundingClientRect();
        return box ? box.top + entry.top * box.height : Infinity;
      });
      let active = ys.findLastIndex((y) => y <= line);
      // Sections that start side by side (two columns) share a line: mark the first of them.
      while (active > 0 && Math.abs(ys[active - 1] - ys[active]) < 4) active -= 1;
      setSection(active);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const target = scroller() ?? window;
    target.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();
    return () => {
      target.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [contents, failed, readingLine, scroller, renderedKey]);

  const [shownPage, setShownPage] = useState(current);
  if (shownPage !== current) {
    setShownPage(current);
    setPageInput(String(current));
  }

  /** Scroll so a point `top` (0–1) of the way down page `page` sits on the reading line. */
  const scrollToPoint = useCallback(
    (page: number, top: number) => {
      const sheet = sheetsRef.current?.querySelector<HTMLElement>(
        `.report-sheet[data-page="${page}"]`,
      );
      if (!sheet) return;
      const rect = sheet.getBoundingClientRect();
      // A small lift so a heading lands with its first line clear of the toolbar.
      scrollByY(rect.top + Math.max(0, top * rect.height - 12) - readingLine());
    },
    [readingLine, scrollByY],
  );

  // A page-only link jumps once the pages are drawn; a search link waits for its matches (below).
  useEffect(() => {
    const target = jumpTo.current;
    if (!target || target.search || rendering || failed) return;
    jumpTo.current = null;
    scrollToPoint(target.page, 0);
  }, [rendering, failed, scrollToPoint]);

  function goTo(n: number) {
    const target = Math.min(Math.max(1, n || 1), pages);
    setCurrent(target);
    setPageInput(String(target));
    scrollToPoint(target, 0);
  }
  const zoomBy = (delta: number) => setZoom((z) => nextZoom(z === "fit" ? fitScale : z, delta));

  function openSection(event: MouseEvent, entry: ContentsEntry) {
    // Without a drawn viewer the link opens the PDF at that page instead.
    if (failed || !sheetsRef.current) return;
    event.preventDefault();
    setContentsOpen(false);
    scrollToPoint(entry.page, entry.top);
    sheetsRef.current.focus({ preventScroll: true });
  }

  // ---------- Full screen ----------
  useEffect(() => {
    const sync = () =>
      setFullscreen((state) =>
        document.fullscreenElement === rootRef.current
          ? "native"
          : state === "native"
            ? false
            : state,
      );
    document.addEventListener("fullscreenchange", sync);
    return () => document.removeEventListener("fullscreenchange", sync);
  }, []);
  // The overlay fallback (iPhone has no element full screen) locks the page behind it and closes on Escape.
  useEffect(() => {
    if (fullscreen !== "overlay") return;
    document.documentElement.setAttribute("data-viewer-overlay", "");
    const onKey = (event: globalThis.KeyboardEvent) =>
      event.key === "Escape" && setFullscreen(false);
    document.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.removeAttribute("data-viewer-overlay");
      document.removeEventListener("keydown", onKey);
    };
  }, [fullscreen]);
  // Zoom and full screen resize every sheet: put the reader back on the same point of the same page.
  // Runs before paint, after the sheets have their new size; the anchor is frozen while full screen switches scrollers.
  useLayoutEffect(() => {
    const target = anchor.current;
    const sheet =
      target &&
      sheetsRef.current?.querySelector<HTMLElement>(`.report-sheet[data-page="${target.page}"]`);
    if (target && sheet) {
      const rect = sheet.getBoundingClientRect();
      scrollByY(rect.top + target.offset * rect.height - (readingLine() + 40), false);
    }
    const frame = requestAnimationFrame(() => (holdAnchor.current = false));
    return () => cancelAnimationFrame(frame);
  }, [scale, fullscreen, readingLine, scrollByY]);

  async function toggleFullscreen() {
    holdAnchor.current = true;
    if (document.fullscreenElement) return void (await document.exitFullscreen().catch(() => {}));
    if (fullscreen === "overlay") return setFullscreen(false);
    const root = rootRef.current;
    if (root?.requestFullscreen && document.fullscreenEnabled) {
      try {
        await root.requestFullscreen({ navigationUI: "hide" });
        return;
      } catch {
        // Refused (iframe policy, user setting): fall through to the overlay.
      }
    }
    setFullscreen("overlay");
  }

  // ---------- Find in report ----------
  useEffect(() => {
    const registry = highlights();
    const pattern = findPattern(query);
    if (!pattern || rendering || failed) {
      registry?.delete("report-find");
      registry?.delete("report-find-current");
      return;
    }
    const timer = setTimeout(() => {
      const ranges: Range[] = [];
      sheetsRef.current
        ?.querySelectorAll<HTMLElement>(".report-sheet .textLayer")
        .forEach((layer) => {
          // One string per page, with each text node's start offset, so a match can span pdf.js spans.
          const nodes: { node: Text; start: number }[] = [];
          let text = "";
          const walker = document.createTreeWalker(layer, NodeFilter.SHOW_TEXT);
          for (let node = walker.nextNode(); node; node = walker.nextNode()) {
            nodes.push({ node: node as Text, start: text.length });
            text += node.textContent ?? "";
          }
          const locate = (offset: number) => {
            let i = nodes.length - 1;
            while (i > 0 && nodes[i].start > offset) i -= 1;
            return { node: nodes[i].node, offset: offset - nodes[i].start };
          };
          for (const match of text.matchAll(pattern)) {
            if (!match[0]) continue;
            const start = locate(match.index);
            const end = locate(match.index + match[0].length - 1);
            const range = document.createRange();
            range.setStart(start.node, start.offset);
            range.setEnd(end.node, end.offset + 1);
            ranges.push(range);
          }
        });
      // Opened from an archive match: start on the first match on that page.
      const target = jumpTo.current;
      jumpTo.current = null;
      const onPage = target
        ? ranges.findIndex((range) =>
            range.startContainer.parentElement?.closest(`[data-page="${target.page}"]`),
          )
        : 0;
      if (target && onPage === -1) scrollToPoint(target.page, 0);
      setMatches(ranges);
      setMatchIndex(Math.max(0, onPage));
      registry?.set("report-find", new Highlight(...ranges));
    }, 150);
    return () => clearTimeout(timer);
  }, [query, rendering, failed, renderKey, scrollToPoint]);

  const showMatch = useCallback(
    (index: number) => {
      const range = matches[index];
      if (!range) return;
      highlights()?.set("report-find-current", new Highlight(range));
      const rect = range.getBoundingClientRect();
      const view = scroller()?.getBoundingClientRect() ?? { top: 0, height: window.innerHeight };
      // Bring the match to a third of the way down the visible reading area.
      const line = readingLine();
      const target = line + (view.top + view.height - line) / 3;
      if (rect.top < line || rect.bottom > view.top + view.height) scrollByY(rect.top - target);
    },
    [matches, readingLine, scrollByY, scroller],
  );
  useEffect(() => {
    if (matches.length) showMatch(matchIndex);
    else highlights()?.delete("report-find-current");
  }, [matches, matchIndex, showMatch]);
  const stepMatch = (delta: number) =>
    matches.length && setMatchIndex((i) => (i + delta + matches.length) % matches.length);
  useEffect(
    () => () => {
      highlights()?.delete("report-find");
      highlights()?.delete("report-find-current");
    },
    [],
  );

  function onKeyDown(event: KeyboardEvent) {
    // Leave browser shortcuts (Ctrl/Cmd +, Alt combos) and typing in fields alone.
    if (
      event.ctrlKey ||
      event.metaKey ||
      event.altKey ||
      (event.target as HTMLElement).tagName === "INPUT"
    )
      return;
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
  const findStatus = !findPattern(query)
    ? ""
    : matches.length
      ? `${matchIndex + 1} of ${matches.length}`
      : rendering
        ? "Searching…"
        : "No matches";

  return (
    <section
      ref={rootRef}
      className="report-reader"
      aria-label={`${title}: PDF`}
      data-report-viewer
      data-fullscreen={fullscreen || undefined}
      data-loading={rendering && !failed ? "" : undefined}
      onKeyDown={onKeyDown}
    >
      {/* Without JavaScript there is nothing to draw: hide the empty sheets and inert controls. */}
      <noscript>
        <style>
          {
            ".report-viewer-sheets,.report-viewer-pages,.report-viewer-zoom,.report-viewer-find,.report-viewer-fullscreen,.report-contents-toggle{display:none!important}.report-contents-list{display:block!important}"
          }
        </style>
      </noscript>
      {/* Find-in-report colours. Turbopack's CSS parser rejects ::highlight() and warns on every build, so they live here. */}
      <style>
        {
          "::highlight(report-find){background-color:rgba(158,58,53,.22)}::highlight(report-find-current){background-color:rgba(47,111,174,.45)}"
        }
      </style>
      {contents.length > 0 && (
        <nav
          className="report-contents"
          aria-labelledby="report-contents-heading"
          data-open={contentsOpen || undefined}
        >
          <h2 id="report-contents-heading" className="report-contents-heading">
            Contents
          </h2>
          <button
            type="button"
            className="report-contents-toggle"
            aria-expanded={contentsOpen}
            aria-controls="report-contents-list"
            onClick={() => setContentsOpen((open) => !open)}
          >
            Contents <span aria-hidden="true">{contentsOpen ? "−" : "+"}</span>
          </button>
          <ol className="report-contents-list" id="report-contents-list">
            {contents.map((entry, i) => (
              <li key={`${entry.page}-${entry.top}-${entry.title}`}>
                <a
                  href={`${file}#page=${entry.page}`}
                  aria-current={i === section ? "location" : undefined}
                  onClick={(event) => openSection(event, entry)}
                >
                  <span className="report-contents-title">{entry.title}</span>
                  <span className="report-contents-page">p. {entry.page}</span>
                </a>
              </li>
            ))}
          </ol>
        </nav>
      )}
      <div className="report-viewer" ref={mainRef}>
        <div
          className="report-viewer-toolbar"
          role="toolbar"
          aria-label="PDF controls"
          ref={toolbarRef}
        >
          <form
            className="report-viewer-pages"
            onSubmit={(event) => {
              event.preventDefault();
              goTo(Number(pageInput));
            }}
          >
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
          <form
            className="report-viewer-find"
            role="search"
            onSubmit={(event) => event.preventDefault()}
          >
            <input
              type="search"
              aria-label="Find in report"
              placeholder="Find in report"
              value={query}
              maxLength={80}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  stepMatch(event.shiftKey ? -1 : 1);
                } else if (event.key === "Escape" && query) {
                  event.stopPropagation();
                  setQuery("");
                }
              }}
            />
            <span className="report-viewer-find-status" role="status">
              {findStatus}
            </span>
            <button
              type="button"
              onClick={() => stepMatch(-1)}
              disabled={matches.length < 2}
              aria-label="Previous match"
            >
              ↑
            </button>
            <button
              type="button"
              onClick={() => stepMatch(1)}
              disabled={matches.length < 2}
              aria-label="Next match"
            >
              ↓
            </button>
          </form>
          <div className="report-viewer-zoom">
            <button type="button" onClick={() => zoomBy(-0.1)} aria-label="Zoom out">
              −
            </button>
            <output aria-live="polite">{Math.round(scale * 100)}%</output>
            <button type="button" onClick={() => zoomBy(0.1)} aria-label="Zoom in">
              +
            </button>
            <button
              type="button"
              onClick={() => setZoom("fit")}
              aria-pressed={zoom === "fit"}
              aria-label="Fit width"
            >
              Fit<span className="report-viewer-fit-extra"> width</span>
            </button>
          </div>
          <button
            type="button"
            className="report-viewer-fullscreen"
            onClick={toggleFullscreen}
            aria-pressed={Boolean(fullscreen)}
          >
            {fullscreen ? "Exit full screen" : "Full screen"}
          </button>
          {download}
        </div>
        {failed ? (
          <div className="report-viewer-error" role="alert">
            <p>The PDF could not be displayed.</p>
            {download}
          </div>
        ) : (
          <div
            className="report-viewer-sheets"
            ref={sheetsRef}
            tabIndex={0}
            role="region"
            aria-label="Report pages"
          >
            {Array.from({ length: pages }, (_, i) => {
              const sheet = (
                <div
                  key={i}
                  className="report-sheet"
                  data-page={i + 1}
                  style={{
                    width: SHEET_WIDTH * scale,
                    height: SHEET_HEIGHT * scale,
                    // pdf.js draws over it; until then page 1 is its own cover image.
                    backgroundImage: i === 0 && cover ? `url(${cover})` : undefined,
                  }}
                />
              );
              return i === 0 && slug ? (
                <ViewTransition key={i} name={`cover-${slug}`} share="cover">
                  {sheet}
                </ViewTransition>
              ) : (
                sheet
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
