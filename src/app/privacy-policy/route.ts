import type { NextRequest } from "next/server";
import { redirectToLocalized } from "@/lib/localeRedirect";

// Adresse sans langue enregistrée dans Stripe (case « j'accepte » du paiement).
export function GET(request: NextRequest) {
  return redirectToLocalized(request, "/privacy-policy");
}
