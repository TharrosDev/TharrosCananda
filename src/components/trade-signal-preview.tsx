import Link from "next/link";
import { ArrowIcon } from "@/components/icons";
import { getCetaTradeSeries } from "@/lib/statcan";

const money=new Intl.NumberFormat("en-CA",{style:"currency",currency:"CAD",notation:"compact",maximumFractionDigits:1});
function periodLabel(value:string){
  const date=new Date(`${value.slice(0,10)}T00:00:00Z`);
  return Number.isNaN(date.getTime())?value:date.toLocaleDateString("en-CA",{year:"numeric",month:"short",timeZone:"UTC"});
}

export async function TradeSignalPreview(){
  const data=await getCetaTradeSeries({flow:"imports"}).catch(()=>null);
  const latest=data?.points.at(-1);
  return <div className="trade-preview">
    <div className="trade-preview-heading"><span>Official data</span><strong>Statistics Canada · CETA merchandise trade</strong></div>
    {latest&&data?<div className="trade-preview-value"><strong>{money.format(latest.valueCad)}</strong><span>{data.query.flow} · {periodLabel(latest.period)}</span><small>{data.query.commodity.label}</small></div>:<div className="trade-preview-value"><strong>Source unavailable</strong><span>No substitute values are shown.</span></div>}
    <Link href="/market-explorer">Open Canada–CETA market data <ArrowIcon/></Link>
  </div>;
}
