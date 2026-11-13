import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { clientIp, createRateLimiter } from "@/lib/rateLimit";
import { parseSoireeCardQuery, soireeDateLabel } from "@/lib/soireeCard";

/**
 * Image de soirée (PNG) : story 1080×1920 ou carré 1080×1080, que le lieu publie lui-même.
 * Fabriquée ici plutôt que dans le navigateur : rendu identique sur tous les téléphones.
 * Aucun pseudo de joueur : nom du lieu, date, joueurs, jeux, prochaine soirée.
 */
export const runtime = "nodejs";

// Large exprès : l'aperçu se refabrique à chaque correction du gérant (nom, prochaine soirée, format).
// La limite ne vise que les boucles automatiques.
const limited = createRateLimiter(150, 60_000);

const COPY = {
  fr: {
    eyebrow: "SOIRÉE JEUX",
    players: (n: number) => (n > 1 ? "joueurs" : "joueur"),
    sub: "sur leur téléphone, toute la soirée",
    next: "ON REMET ÇA",
    hint: "Un téléphone suffit pour jouer.",
  },
  en: {
    eyebrow: "GAME NIGHT",
    players: (n: number) => (n > 1 ? "players" : "player"),
    sub: "on their phones, all night long",
    next: "NEXT ONE",
    hint: "All you need is your phone.",
  },
};

const INK = "#ffffff";
const RED = "#ff2453";
const MUTED = "rgba(255,243,246,0.76)";
const FAINT = "rgba(255,243,246,0.55)";
const LINE = "rgba(255,255,255,0.16)";

let assets: Promise<{ archivo: Buffer; figtree: Buffer; figtreeBold: Buffer; logo: string }> | undefined;
function loadAssets() {
  assets ??= (async () => {
    const dir = join(process.cwd(), "src", "assets");
    const [archivo, figtree, figtreeBold, logo] = await Promise.all([
      readFile(join(dir, "fonts", "Archivo-ExpandedBlack.ttf")),
      readFile(join(dir, "fonts", "Figtree-SemiBold.ttf")),
      readFile(join(dir, "fonts", "Figtree-ExtraBold.ttf")),
      readFile(join(dir, "unboared-logo-420.png")),
    ]);
    return { archivo, figtree, figtreeBold, logo: `data:image/png;base64,${logo.toString("base64")}` };
  })();
  // Un échec de lecture ne doit pas rester en mémoire : la requête suivante réessaie.
  assets.catch(() => (assets = undefined));
  return assets;
}

/** Taille du nom selon sa longueur : un nom long reste sur deux lignes. */
function nameSize(name: string, story: boolean): number {
  const n = name.length;
  if (story) return n <= 12 ? 136 : n <= 20 ? 112 : n <= 30 ? 90 : 74;
  return n <= 14 ? 92 : n <= 24 ? 74 : n <= 32 ? 58 : 48;
}

export async function GET(request: Request) {
  if (limited(clientIp(request))) {
    return new Response("Too many requests", { status: 429, headers: { "Retry-After": "10" } });
  }
  const parsed = parseSoireeCardQuery(new URL(request.url).searchParams);
  if (!parsed) return new Response("Bad request", { status: 400 });
  const { card, format, locale } = parsed;
  const c = COPY[locale];
  const story = format === "story";
  const k = story ? 1 : 0.66;
  const px = (n: number) => Math.round(n * k);

  let a;
  try {
    a = await loadAssets();
  } catch (err) {
    console.error("[soiree-card] polices ou logo illisibles", err);
    return new Response("Unavailable", { status: 503 });
  }

  const digits = String(card.players).length;
  const heroSize = story ? (digits <= 2 ? 350 : digits === 3 ? 250 : 200) : digits <= 2 ? 240 : digits === 3 ? 180 : 150;

  try {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            padding: story ? "150px 84px 110px" : "72px 72px 60px",
            backgroundColor: "#0a0608",
            backgroundImage:
              "radial-gradient(circle at 88% 4%, rgba(255,36,83,0.44) 0%, rgba(255,36,83,0) 46%), radial-gradient(circle at 0% 100%, rgba(255,36,83,0.24) 0%, rgba(255,36,83,0) 42%)",
            color: INK,
            fontFamily: "Figtree",
          }}
        >
          <div style={{ display: "flex" }}>
            <div
              style={{
                display: "flex",
                padding: `${px(16)}px ${px(28)}px`,
                borderRadius: 999,
                backgroundColor: RED,
                color: "#1c040c",
                fontSize: px(30),
                fontWeight: 800,
                letterSpacing: px(4),
              }}
            >
              {c.eyebrow}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              marginTop: px(54),
              fontFamily: "Archivo",
              fontSize: nameSize(card.name, story),
              lineHeight: 0.98,
              letterSpacing: -2,
              wordBreak: "break-word",
            }}
          >
            {card.name}
          </div>
          <div style={{ display: "flex", marginTop: px(26), fontSize: px(44), color: MUTED }}>
            {soireeDateLabel(card.date, locale)}
          </div>

          <div style={{ display: "flex", flexGrow: 1 }} />

          <div style={{ display: "flex", alignItems: "flex-end" }}>
            <div
              style={{
                display: "flex",
                fontFamily: "Archivo",
                fontSize: heroSize,
                lineHeight: 0.8,
                letterSpacing: -6,
                color: RED,
              }}
            >
              {String(card.players)}
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                flex: 1,
                marginLeft: px(36),
                paddingBottom: px(10),
              }}
            >
              <div style={{ display: "flex", fontFamily: "Archivo", fontSize: px(66), lineHeight: 1 }}>
                {c.players(card.players)}
              </div>
              <div style={{ display: "flex", marginTop: px(12), fontSize: px(36), lineHeight: 1.15, color: MUTED }}>
                {c.sub}
              </div>
            </div>
          </div>

          {card.games.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", marginTop: px(58) }}>
              {card.games.map((g, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    marginRight: px(16),
                    marginBottom: px(16),
                    padding: `${px(15)}px ${px(30)}px`,
                    borderRadius: 999,
                    border: `2px solid ${LINE}`,
                    backgroundColor: "rgba(255,255,255,0.06)",
                    fontSize: px(36),
                    fontWeight: 800,
                  }}
                >
                  {g}
                </div>
              ))}
            </div>
          )}

          {card.next ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                marginTop: px(44),
                padding: `${px(38)}px ${px(44)}px`,
                borderRadius: px(28),
                backgroundColor: INK,
                color: "#14070c",
              }}
            >
              <div style={{ display: "flex", fontSize: px(28), fontWeight: 800, letterSpacing: px(4), color: "#c4123b" }}>
                {c.next}
              </div>
              <div
                style={{
                  display: "flex",
                  marginTop: px(12),
                  fontFamily: "Archivo",
                  fontSize: px(card.next.length <= 26 ? 60 : 48),
                  lineHeight: 1.02,
                  letterSpacing: -1,
                  wordBreak: "break-word",
                }}
              >
                {card.next}
              </div>
              {story && (
                <div style={{ display: "flex", marginTop: 14, fontSize: 34, color: "#4a3a40" }}>{c.hint}</div>
              )}
            </div>
          ) : (
            <div style={{ display: "flex", marginTop: px(40), fontSize: px(38), color: MUTED }}>{c.hint}</div>
          )}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: px(54),
              fontSize: px(28),
              color: FAINT,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={a.logo} alt="" width={px(128)} height={px(44)} />
            <div style={{ display: "flex" }}>unboared.com</div>
          </div>
        </div>
      ),
      {
        width: 1080,
        height: story ? 1920 : 1080,
        fonts: [
          { name: "Archivo", data: a.archivo, weight: 900, style: "normal" },
          { name: "Figtree", data: a.figtree, weight: 600, style: "normal" },
          { name: "Figtree", data: a.figtreeBold, weight: 800, style: "normal" },
        ],
        headers: {
          "Cache-Control": "public, max-age=3600",
          "Content-Disposition": `inline; filename="soiree-unboared-${card.date}-${format}.png"`,
          "X-Robots-Tag": "noindex",
        },
      }
    );
  } catch (err) {
    console.error("[soiree-card] rendu impossible", err);
    return new Response("Unavailable", { status: 503 });
  }
}
