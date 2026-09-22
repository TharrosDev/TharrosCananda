import Link from "next/link";
import { ArrowIcon } from "@/components/icons";

export default function NotFound() {
  return <section className="not-found"><h1>Page not found.</h1><p>The page may have moved, or the address may be incomplete.</p><Link className="button-primary" href="/">Return home <ArrowIcon /></Link></section>;
}
