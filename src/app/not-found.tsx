import Link from "next/link";
import { ArrowIcon } from "@/components/icons";

export default function NotFound() {
  return <section className="not-found"><h1>This market route does not exist.</h1><p>Error 404. The page may have moved, or the address may be incomplete.</p><Link className="button-primary" href="/">Return to Tharros Canada <ArrowIcon /></Link></section>;
}
