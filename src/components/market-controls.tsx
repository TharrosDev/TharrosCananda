"use client";

import { useRouter } from "next/navigation";
import { type FormEvent, useState, useTransition } from "react";
import { track } from "@/lib/analytics";
import { marketHref, ranges } from "@/lib/statcan";
import type { TradeOption } from "@/types/official-data";

type Selection = { flow: string; commodity: string; range: number };
type Props = Selection & { commodities: TradeOption[] };

/**
 * A GET form, so every view is a shareable URL. Changes apply immediately and the current figures stay on
 * screen while the next series loads; the inputs stay enabled so keyboard focus is never lost.
 */
export function MarketControls({ flow, commodity, range, commodities }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [value, setValue] = useState<Selection>({ flow, commodity, range });
  // Follow the URL when it changes from elsewhere (group links, back/forward). Next applies the latest
  // navigation, so rapid changes settle on the visitor's final selection.
  const [synced, setSynced] = useState({ flow, commodity, range });
  if (synced.flow !== flow || synced.commodity !== commodity || synced.range !== range) {
    setSynced({ flow, commodity, range });
    setValue({ flow, commodity, range });
  }

  function change(patch: Partial<Selection>) {
    const next = { ...value, ...patch };
    setValue(next);
    const href = marketHref(next);
    track("market_explorer_completed", { flow: next.flow, commodity: next.commodity, range: String(next.range) });
    startTransition(() => router.replace(href, { scroll: false }));
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    change({});
  }

  return (
    <form className="official-explorer-controls market-controls" action="/market-explorer" method="get" onSubmit={submit} aria-busy={pending}>
      <fieldset className="market-control">
        <legend>Trade flow</legend>
        <div className="segmented">
          {[["imports", "Imports"], ["exports", "Exports"]].map(([option, label]) => (
            <label key={option}><input type="radio" name="flow" value={option} checked={value.flow === option} onChange={() => change({ flow: option })} /><span>{label}</span></label>
          ))}
        </div>
      </fieldset>
      <label className="market-control">
        <span>Commodity group</span>
        <select name="commodity" value={value.commodity} onChange={(event) => change({ commodity: event.target.value })}>
          {commodities.map((option) => <option key={option.id} value={option.id}>{option.label}</option>)}
        </select>
        <small>Groups follow Statistics Canada&apos;s NAPCS classification.</small>
      </label>
      <fieldset className="market-control">
        <legend>Period shown</legend>
        <div className="segmented">
          {ranges.map((option) => (
            <label key={option}><input type="radio" name="range" value={option} checked={value.range === option} onChange={() => change({ range: option })} /><span>{option / 12} {option === 12 ? "year" : "years"}</span></label>
          ))}
        </div>
      </fieldset>
      <p className="market-control-status" role="status">{pending ? "Loading the selected Statistics Canada series…" : ""}</p>
    </form>
  );
}
