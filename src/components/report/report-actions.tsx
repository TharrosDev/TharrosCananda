"use client";

import { useState } from "react";
import { CitationPanel } from "@/components/citation-panel";
import type { CitationInput } from "@/lib/citation";

type Props = { file: string; bytes: number; citation: CitationInput; url: string; title: string };

export function ReportActions({ file, bytes, citation, url, title }: Props) {
  const [linkState, setLinkState] = useState<"idle" | "copied" | "manual">("idle");

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setLinkState("copied");
    } catch {
      // Clipboard unavailable or denied: show the link so it can be copied by hand.
      setLinkState("manual");
    }
  }

  async function share() {
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        // Dismissed or unsupported target: fall back to copying.
      }
    }
    await copyLink();
  }

  return (
    <div className="report-actions">
      <a className="button-primary" href={file} download>
        Download PDF <small>{Math.round(bytes / 1024)} KB</small>
      </a>
      <details className="cite-popover report-cite">
        <summary>Cite</summary>
        <div className="cite-popover-body">
          <CitationPanel input={citation} />
        </div>
      </details>
      <button type="button" className="report-action" onClick={copyLink}>
        {linkState === "copied" ? "Link copied" : "Copy link"}
      </button>
      <button type="button" className="report-action" onClick={share}>
        Share
      </button>
      {linkState === "manual" && (
        <label className="report-link-field">
          <span>Report link</span>
          <input readOnly value={url} onFocus={(event) => event.currentTarget.select()} />
        </label>
      )}
      <span className="sr-only" role="status">
        {linkState === "copied" ? "Link copied" : ""}
      </span>
    </div>
  );
}
