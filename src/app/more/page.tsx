import { permanentRedirect } from "next/navigation"

// /more has been renamed to /acquire — redirect old links. Permanent (308), not
// redirect()'s 307, so search engines transfer it to /acquire instead of keeping /more.
export default function MorePage() {
  permanentRedirect("/acquire")
}
