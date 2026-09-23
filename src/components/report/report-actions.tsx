"use client";

import { useState } from "react";
import { copyText } from "@/lib/clipboard";

type Props = { file: string; bytes: number; url: string; title: string };

export function ReportActions({ file, bytes, url, title }: Props) {
  const [linkState, setLinkState] = useState<"idle" | "copied" | "manual">("idle");

  async function copyLink() {
    // Clipboard unavailable or denied: show the link so it can be copied by hand.
    setLinkState((await copyText(url)) ? "copied" : "manual");
  }

  async function share() {
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ title, url });
        return;
      } catch (error) {
        // The visitor closed the share sheet: respect that, do not pop the copy fallback.
        if ((error as Error)?.name === "AbortError") return;
      }
    }
    await copyLink();
  }

  return (
    <div className="report-actions">
      <a className="button-primary" href={file} download>
        Download PDF <small>{Math.round(bytes / 1024)} KB</small>
      </a>
      {/* One citation panel on the page: the header action jumps to it. */}
      <a className="report-action" href="#cite">
        Cite
      </a>
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
