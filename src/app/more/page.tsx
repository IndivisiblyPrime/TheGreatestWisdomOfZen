import { redirect } from "next/navigation"

// /more has been renamed to /acquire — redirect old links.
export default function MorePage() {
  redirect("/acquire")
}
