"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { copyText } from "@/lib/clipboard";

const subscribe = () => () => {};
const clientSnapshot = () => true;
const serverSnapshot = () => false;

/** Email remains a plain mail link; clipboard controls are progressively enhanced. */
export function AboutContact({ email }: { email: string }) {
  const enhanced = useSyncExternalStore(subscribe, clientSnapshot, serverSnapshot);
  const [state, setState] = useState<"idle" | "copying" | "done" | "failed">("idle");
  const fallback = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (state === "failed") {
      fallback.current?.focus();
      fallback.current?.select();
    }
  }, [state]);

  async function copy() {
    setState("copying");
    setState((await copyText(email)) ? "done" : "failed");
  }

  return (
    <div className="about-contact">
      <a className="about-email" href={`mailto:${email}`}>
        {email}
      </a>
      <button
        className="about-copy"
        type="button"
        hidden={!enhanced}
        disabled={state === "copying"}
        onClick={copy}
      >
        {state === "copying" ? "Copying…" : "Copy email address"}
      </button>
      <p className="about-copy-status" role="status">
        {state === "done" && "Email address copied."}
        {state === "failed" && "Clipboard unavailable. Copy the selected address below."}
      </p>
      {state === "failed" && (
        <label className="about-email-fallback">
          Email address for manual copying
          <input
            ref={fallback}
            type="text"
            value={email}
            readOnly
            onFocus={(event) => event.currentTarget.select()}
          />
        </label>
      )}
    </div>
  );
}
