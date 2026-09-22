import { createHmac } from "node:crypto";
import { NextResponse } from "next/server";
import { honeypotField, maxBodyBytes, parseResearchRequest } from "@/lib/research-request";

export const runtime = "nodejs";
const deliveryFailure={message:"We couldn’t send your request right now. Your answers are still in the form.",code:"delivery_unavailable"} as const;

function intakeWebhook(){
  const value=process.env.RESEARCH_INTAKE_WEBHOOK_URL;
  if(!value)return null;
  try{const url=new URL(value);return url.protocol==="https:"?url:null;}catch{return null;}
}
function intakeSecret(){return process.env.RESEARCH_INTAKE_WEBHOOK_SECRET?.trim()||null;}

export async function POST(request:Request){
  const declaredLength=Number(request.headers.get("content-length")??0);
  if(declaredLength>maxBodyBytes)return NextResponse.json({message:"The request is too large."},{status:413,headers:{"Cache-Control":"no-store"}});
  const text=await request.text();
  if(new TextEncoder().encode(text).length>maxBodyBytes)return NextResponse.json({message:"The request is too large."},{status:413,headers:{"Cache-Control":"no-store"}});
  let body:unknown;
  try{body=JSON.parse(text);}catch{return NextResponse.json({message:"The request could not be read."},{status:400,headers:{"Cache-Control":"no-store"}});}
  const trap=(body as Record<string,unknown>|null)?.[honeypotField];
  if(typeof trap==="string"&&trap.trim())return NextResponse.json({ok:true},{status:201,headers:{"Cache-Control":"no-store"}});
  const parsed=parseResearchRequest(body);
  if(!parsed.ok)return NextResponse.json({message:"Review the highlighted fields and try again.",errors:parsed.errors},{status:422,headers:{"Cache-Control":"no-store"}});
  const webhook=intakeWebhook(); const secret=intakeSecret();
  if(!webhook||!secret){
    console.error("[research-request] Live intake requires valid RESEARCH_INTAKE_WEBHOOK_URL and RESEARCH_INTAKE_WEBHOOK_SECRET.");
    return NextResponse.json(deliveryFailure,{status:503,headers:{"Cache-Control":"no-store"}});
  }
  const timestamp=String(Date.now());
  const payload=JSON.stringify({...parsed.value,submittedAt:new Date().toISOString(),source:"tharros.ca"});
  const signature=createHmac("sha256",secret).update(`${timestamp}.${payload}`).digest("hex");
  try{
    const response=await fetch(webhook,{method:"POST",headers:{"Content-Type":"application/json","User-Agent":"TharrosCanada/1.0","X-Tharros-Timestamp":timestamp,"X-Tharros-Signature":`sha256=${signature}`},body:payload,signal:AbortSignal.timeout(8000),redirect:"error"});
    if(!response.ok)throw new Error(`Webhook returned ${response.status}`);
    return NextResponse.json({ok:true},{status:201,headers:{"Cache-Control":"no-store"}});
  }catch(error){
    console.error("[research-request] Delivery failed:",error instanceof Error?error.message:error);
    return NextResponse.json(deliveryFailure,{status:502,headers:{"Cache-Control":"no-store"}});
  }
}
