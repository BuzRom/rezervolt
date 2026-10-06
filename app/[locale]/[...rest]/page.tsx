import { notFound } from "next/navigation";

// Unknown paths under a locale (e.g. /uk/foo) match no route and would fall through to Next's bare
// global 404. Catching them here renders the localized `[locale]/not-found.tsx` inside the layout.
export default function CatchAll() {
  notFound();
}
