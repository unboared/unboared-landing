import { redirectToLocalized } from "@/lib/localeRedirect";

// Adresse sans langue enregistrée dans Stripe (case « j'accepte » du paiement).
export function GET(request: Request) {
  return redirectToLocalized(request, "/terms-of-use");
}
