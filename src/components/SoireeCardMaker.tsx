"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import {
  SOIREE_LIMITS,
  SoireeCard,
  SoireeFormat,
  SoireeLocale,
  cleanText,
  decodeSoireeHash,
  soireeCardQuery,
} from "@/lib/soireeCard";

const STORE_KEY = "ub-soiree-card";

type Base = Omit<SoireeCard, "next">;
type Status = "loading" | "ready" | "error";

/** Lit le lien du bilan, le retire de la barre d'adresse et le garde le temps de l'onglet. */
function readCard(): Base | null {
  const fromHash = decodeSoireeHash(window.location.hash);
  if (fromHash) {
    try {
      sessionStorage.setItem(STORE_KEY, window.location.hash);
    } catch {
      /* stockage indisponible (navigation privée) : la page marche quand même */
    }
    history.replaceState(null, "", window.location.pathname);
    return fromHash;
  }
  try {
    return decodeSoireeHash(sessionStorage.getItem(STORE_KEY) || "");
  } catch {
    return null;
  }
}

export default function SoireeCardMaker({ locale }: { locale: SoireeLocale }) {
  const t = useTranslations("soiree");
  const [base, setBase] = useState<Base | null | undefined>(undefined);
  const [name, setName] = useState("");
  const [next, setNext] = useState("");
  const [format, setFormat] = useState<SoireeFormat>("story");
  const [query, setQuery] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("loading");
  const [canShare, setCanShare] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const card = readCard();
    setBase(card);
    if (card) setName(card.name);
    setCanShare(typeof navigator !== "undefined" && typeof navigator.share === "function" && typeof navigator.canShare === "function");
  }, []);

  const wanted = useMemo(() => {
    if (!base) return null;
    const n = cleanText(name, SOIREE_LIMITS.name);
    if (!n) return null;
    return soireeCardQuery({ ...base, name: n, next: cleanText(next, SOIREE_LIMITS.next) }, format, locale);
  }, [base, name, next, format, locale]);

  // L'aperçu suit la saisie avec un léger délai : pas une image par lettre tapée.
  useEffect(() => {
    if (!wanted) {
      setQuery(null);
      return;
    }
    const id = setTimeout(() => {
      setStatus("loading");
      setQuery(wanted);
    }, 450);
    return () => clearTimeout(id);
  }, [wanted]);

  if (base === undefined) return <p className="soiree-wait">{t("loading")}</p>;

  if (base === null) {
    return (
      <div className="soiree-empty">
        <h1>{t("emptyTitle")}</h1>
        <p>{t("emptyBody")}</p>
        <a className="btn btn-primary" href={`/${locale}`}>
          {t("emptyCta")}
        </a>
      </div>
    );
  }

  const src = query ? `/api/soiree-card?${query}` : null;
  const fileName = `soiree-unboared-${base.date}-${format}.png`;

  async function fetchFile(): Promise<File> {
    const res = await fetch(src as string);
    if (!res.ok) throw new Error(String(res.status));
    return new File([await res.blob()], fileName, { type: "image/png" });
  }

  async function download() {
    if (!src || busy) return;
    setBusy(true);
    try {
      const url = URL.createObjectURL(await fetchFile());
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 10_000);
    } catch {
      setStatus("error");
    } finally {
      setBusy(false);
    }
  }

  async function share() {
    if (!src || busy) return;
    setBusy(true);
    try {
      const file = await fetchFile();
      if (navigator.canShare({ files: [file] })) await navigator.share({ files: [file] });
      else await download();
    } catch (err) {
      // Fermer la feuille de partage n'est pas une erreur.
      if (!(err instanceof DOMException && err.name === "AbortError")) setStatus("error");
    } finally {
      setBusy(false);
    }
  }

  const ready = !!src && status === "ready" && query === wanted;

  return (
    <div className="soiree-grid">
      <div className="soiree-form">
        <h1>{t("title")}</h1>
        <p className="soiree-lead">{t("lead")}</p>

        <label className="soiree-field">
          <span>{t("nameLabel")}</span>
          <input
            type="text"
            value={name}
            maxLength={SOIREE_LIMITS.name}
            placeholder={t("namePlaceholder")}
            onChange={(e) => setName(e.target.value)}
            autoComplete="organization"
          />
        </label>

        <label className="soiree-field">
          <span>{t("nextLabel")}</span>
          <input
            type="text"
            value={next}
            maxLength={SOIREE_LIMITS.next}
            placeholder={t("nextPlaceholder")}
            onChange={(e) => setNext(e.target.value)}
          />
          <small>{t("nextHint")}</small>
        </label>

        <fieldset className="soiree-format">
          <legend>{t("formatLabel")}</legend>
          {(["story", "post"] as const).map((f) => (
            <button key={f} type="button" aria-pressed={format === f} onClick={() => setFormat(f)}>
              {t(f === "story" ? "formatStory" : "formatPost")}
            </button>
          ))}
        </fieldset>

        <div className="soiree-actions">
          {canShare && (
            <button type="button" className="btn btn-primary" onClick={share} disabled={!ready || busy}>
              {t("share")}
            </button>
          )}
          <button
            type="button"
            className={canShare ? "btn btn-ghost" : "btn btn-primary"}
            onClick={download}
            disabled={!ready || busy}
          >
            {t("download")}
          </button>
        </div>
        <p className="soiree-status" role="status">
          {status === "error" ? t("error") : !ready && src ? t("loading") : ""}
        </p>
      </div>

      <div className={`soiree-preview ${format}`}>
        {src && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={src}
            src={src}
            alt={t("previewAlt")}
            onLoad={() => setStatus("ready")}
            onError={() => setStatus("error")}
          />
        )}
      </div>
    </div>
  );
}
