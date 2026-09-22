"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowIcon } from "@/components/icons";
import { TrendChart } from "@/components/trend-chart";
import { yearAgoChange } from "@/lib/trade-analysis";
import type { OfficialDatasetSearchResponse, TradeExplorerResponse, TradeFlow } from "@/types/official-data";

const money=new Intl.NumberFormat("en-CA",{style:"currency",currency:"CAD",notation:"compact",maximumFractionDigits:1});
function periodLabel(value:string){const date=new Date(`${value.slice(0,10)}T00:00:00Z`);return Number.isNaN(date.getTime())?value:date.toLocaleDateString("en-CA",{year:"numeric",month:"short",timeZone:"UTC"});}

export function LiveMarketExplorer({initialData=null}:{initialData?:TradeExplorerResponse|null}){
  const[flow,setFlow]=useState<TradeFlow>(initialData?.query.flow??"Imports");
  const[commodity,setCommodity]=useState(initialData?.query.commodity.id??"");
  const[data,setData]=useState<TradeExplorerResponse|null>(initialData);
  const[datasets,setDatasets]=useState<OfficialDatasetSearchResponse["results"]>([]);
  const[status,setStatus]=useState<"loading"|"ready"|"error">(initialData?"ready":"loading");
  const[datasetsStatus,setDatasetsStatus]=useState<"idle"|"loading"|"ready"|"error">("idle");
  const[message,setMessage]=useState("");
  const hydrated=useRef(Boolean(initialData));

  useEffect(()=>{
    if(hydrated.current){hydrated.current=false;return;}
    const controller=new AbortController();
    const params=new URLSearchParams({flow:flow.toLowerCase()});if(commodity)params.set("commodity",commodity);
    fetch(`/api/market-data/trade?${params}`,{signal:controller.signal}).then(async(response)=>{
      const body=await response.json();if(!response.ok)throw new Error(body.error||"Official data is unavailable.");
      const next=body as TradeExplorerResponse;setData(next);
      if(!commodity){hydrated.current=true;setCommodity(next.query.commodity.id);}
      setStatus("ready");
    }).catch((error)=>{
      if(error instanceof DOMException&&error.name==="AbortError")return;
      setStatus("error");setMessage(error instanceof Error?error.message:"Official data is unavailable.");
    });
    return()=>controller.abort();
  },[commodity,flow]);

  const selectedCommodityLabel=status==="ready"?data?.query.commodity.label??"":"";
  useEffect(()=>{
    if(!selectedCommodityLabel){setDatasets([]);setDatasetsStatus("idle");return;}
    const controller=new AbortController();setDatasetsStatus("loading");
    const query=`${selectedCommodityLabel} international trade`;
    fetch(`/api/open-data/search?q=${encodeURIComponent(query)}`,{signal:controller.signal}).then(async(response)=>{
      const payload=(await response.json()) as OfficialDatasetSearchResponse;
      if(!response.ok)throw new Error(payload.error||"Open Government search is unavailable.");
      setDatasets(payload.results);setDatasetsStatus("ready");
    }).catch((error)=>{
      if(error instanceof DOMException&&error.name==="AbortError")return;
      setDatasets([]);setDatasetsStatus("error");
    });
    return()=>controller.abort();
  },[selectedCommodityLabel]);

  const chartPoints=useMemo(()=>(data?.points??[]).map((point)=>({year:periodLabel(point.period),value:point.valueCad})),[data]);
  const latest=data?.points.at(-1);const annualChange=data?yearAgoChange(data.points):null;
  const sourceLabel=status==="ready"?"Live official source":status==="loading"?"Updating official source":"Official source unavailable";

  function beginChange(){setStatus("loading");setMessage("");setDatasetsStatus("idle");}
  function changeFlow(next:TradeFlow){if(next===flow)return;beginChange();setFlow(next);}
  function changeCommodity(next:string){if(next===commodity)return;beginChange();setCommodity(next);}

  return <section className="official-explorer" aria-labelledby="official-explorer-title" aria-busy={status==="loading"}>
    <div className="official-explorer-head"><div><span className={`data-status data-status-${status}`}>{sourceLabel}</span><h2 id="official-explorer-title">Canada–CETA merchandise trade</h2><p>Monthly customs-basis trade from Statistics Canada Table 12-10-0174-01.</p></div><a href="https://www150.statcan.gc.ca/t1/tbl1/en/tv.action?pid=1210017401" target="_blank" rel="noreferrer">Open source table <ArrowIcon/><span className="sr-only"> (opens in a new tab)</span></a></div>
    <div className="official-explorer-controls">
      <label><span>Trade flow</span><select value={flow} onChange={(event)=>changeFlow(event.target.value as TradeFlow)}><option>Imports</option><option>Exports</option></select></label>
      <label><span>Commodity group</span><select value={commodity} onChange={(event)=>changeCommodity(event.target.value)} disabled={!data}>{(data?.options.commodities??[]).map((option)=><option key={option.id} value={option.id}>{option.label}</option>)}</select><small>Options are derived from the current publisher metadata rather than a fixed Tharros list.</small></label>
    </div>
    {status==="error"&&<div className="official-data-error" role="alert"><strong>Statistics Canada data could not be loaded.</strong><p>{message} No cached demonstration or synthetic replacement is shown.</p></div>}
    {status==="loading"&&<p className="official-data-loading">{data?"Updating the selected Statistics Canada series…":"Loading Statistics Canada table metadata and current series…"}</p>}
    {status==="ready"&&data&&latest&&<>
      <div className="official-explorer-kpis"><div><span>Latest value</span><strong>{money.format(latest.valueCad)}</strong><small>{periodLabel(latest.period)}</small></div><div><span>12-month change</span><strong>{annualChange==null?"—":`${annualChange>=0?"+":""}${annualChange.toFixed(1)}%`}</strong><small>Exact same month one year earlier where available</small></div><div><span>Relationship</span><strong>CETA</strong><small>{data.query.agreement}</small></div></div>
      <div className="official-chart-panel"><div><h3>{data.query.flow}: {data.query.commodity.label}</h3><p>{data.seriesTitle}</p></div><TrendChart data={chartPoints} title={`${data.query.flow} under CETA: ${data.query.commodity.label}`} description={`Monthly Statistics Canada customs-basis values from ${chartPoints.at(0)?.year??"the first period"} to ${chartPoints.at(-1)?.year??"the latest period"}.`} caption="Monthly value in Canadian dollars" valueFormat="currency"/></div>
      <div className="official-provenance">
        <div><h3>Source and provenance</h3><dl><div><dt>Publisher</dt><dd>{data.source.publisher}</dd></div><div><dt>Table</dt><dd>{data.source.tableId}</dd></div><div><dt>Frequency</dt><dd>{data.source.frequency}</dd></div><div><dt>Basis</dt><dd>{data.source.basis}</dd></div><div><dt>Latest source release</dt><dd>{data.source.latestRelease?new Date(data.source.latestRelease).toLocaleString("en-CA",{timeZone:"America/Toronto"}):"Not supplied"}</dd></div><div><dt>Retrieved by Tharros</dt><dd>{new Date(data.source.retrievedAt).toLocaleString("en-CA",{timeZone:"America/Toronto"})}</dd></div></dl><p className="source-acknowledgement">Adapted from Statistics Canada, {data.source.title}, {periodLabel(latest.period)}. This does not constitute an endorsement by Statistics Canada of this product.</p><a href={data.source.licenceUrl} target="_blank" rel="noreferrer">Statistics Canada Open Licence <ArrowIcon/><span className="sr-only"> (opens in a new tab)</span></a></div>
        <div><h3>What this does not establish</h3><ul>{data.limitations.map((item)=><li key={item}>{item}</li>)}</ul></div>
      </div>
      <div className="official-dataset-register"><div><h3>Open Government dataset search</h3><p>A keyword search of the federal Open Government catalogue using the selected commodity. Results are discovery leads, not evidence for a Tharros conclusion.</p></div><div>
        {datasetsStatus==="loading"&&<p>Searching the federal dataset catalogue…</p>}
        {datasetsStatus==="error"&&<p>Open Government dataset search is temporarily unavailable.</p>}
        {datasetsStatus==="ready"&&datasets.length===0&&<p>No matching federal catalogue records were returned for this search.</p>}
        {datasetsStatus==="ready"&&datasets.map((dataset)=><a key={dataset.id} href={dataset.url} target="_blank" rel="noreferrer"><strong>{dataset.title}</strong><span>{dataset.publisher}</span><small>{dataset.formats.length?dataset.formats.join(" · "):"Open Government record"}</small><ArrowIcon/></a>)}
      </div></div>
    </>}
  </section>;
}
