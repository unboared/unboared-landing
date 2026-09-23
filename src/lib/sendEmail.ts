import { Resend, type CreateEmailOptions } from "resend";

// Lazily created: `new Resend()` throws at construction when RESEND_API_KEY is
// missing, which would crash the whole route module with an HTML 500 instead
// of a clean JSON error the forms can display.
let client: Resend | null = null;

/**
 * Send an email through Resend and report whether it really went out.
 *
 * The Resend SDK never throws on failure (invalid key, quota, network down…):
 * it resolves to `{ data: null, error }`. Ignoring that return value is how
 * contact requests used to vanish while the visitor saw "Message sent".
 * Every failure is logged with the `[email]` prefix (Vercel logs) and turned
 * into `false` so the caller can answer with a real error.
 */
export async function sendEmail(
  tag: string,
  options: CreateEmailOptions,
): Promise<boolean> {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.error(`[email:${tag}] RESEND_API_KEY missing — email not sent`);
      return false;
    }
    client ??= new Resend(process.env.RESEND_API_KEY);
    const { data, error } = await client.emails.send(options);
    if (error || !data?.id) {
      console.error(`[email:${tag}] Resend refused the email:`, error);
      return false;
    }
    return true;
  } catch (err) {
    console.error(`[email:${tag}] unexpected error:`, err);
    return false;
  }
}
