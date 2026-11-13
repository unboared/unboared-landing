"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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
  const [status, setStatus] = useState<Status>("loading");
  const [preview, setPreview] = useState<{ query: string; url: string } | null>(null);
  const [canShare, setCanShare] = useState(false);
  const [actionFailed, setActionFailed] = useState(false);
  // Le fichier est prêt AVANT le clic : sur iPhone, le partage doit partir dans le geste lui-même.
  const fileRef = useRef<File | null>(null);

  useEffect(() => {
    const card = readCard();
    setBase(card);
    if (card) setName(card.name);
    setCanShare(typeof navigator !== "undefined" && typeof navigator.share === "function" && typeof navigator.canShare === "function");
  }, []);

  const fileName = base ? `soiree-unboared-${base.date}-${format}.png` : "";

  const wanted = useMemo(() => {
    if (!base) return null;
    const n = cleanText(name, SOIREE_LIMITS.name);
    if (!n) return null;
    return soireeCardQuery({ ...base, name: n, next: cleanText(next, SOIREE_LIMITS.next) }, format, locale);
  }, [base, name, next, format, locale]);

  // Une seule fabrication par version de l'image, après un court délai de saisie :
  // elle sert à la fois d'aperçu et de fichier à partager ou télécharger.
  useEffect(() => {
    fileRef.current = null;
    setActionFailed(false);
    if (!wanted) return;
    setStatus("loading");
    const ctrl = new AbortController();
    let url: string | null = null;
    const id = setTimeout(async () => {
      try {
        const res = await fetch(`/api/soiree-card?${wanted}`, { signal: ctrl.signal });
        if (!res.ok) throw new Error(String(res.status));
        const blob = await res.blob();
        if (ctrl.signal.aborted) return;
        fileRef.current = new File([blob], fileName, { type: "image/png" });
        url = URL.createObjectURL(blob);
        setPreview({ query: wanted, url });
        setStatus("ready");
      } catch {
        if (!ctrl.signal.aborted) setStatus("error");
      }
    }, 450);
    return () => {
      clearTimeout(id);
      ctrl.abort();
      if (url) URL.revokeObjectURL(url);
    };
  }, [wanted, fileName]);

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

  const ready = status === "ready" && !!preview && preview.query === wanted;

  function download() {
    const file = fileRef.current;
    if (!file) return;
    setActionFailed(false);
    const url = URL.createObjectURL(file);
    const a = document.createElement("a");
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 10_000);
  }

  function share() {
    const file = fileRef.current;
    if (!file) return;
    setActionFailed(false);
    let shareable = false;
    try {
      shareable = navigator.canShare({ files: [file] });
    } catch {
      shareable = false;
    }
    if (!shareable) {
      download();
      return;
    }
    navigator.share({ files: [file] }).catch((err: unknown) => {
      const kind = err instanceof DOMException ? err.name : "";
      // Fermer la feuille de partage n'est pas une erreur ; un refus du navigateur → on propose le fichier.
      if (kind === "AbortError") return;
      if (kind === "NotAllowedError") download();
      else setActionFailed(true);
    });
  }

  const message =
    status === "error" ? t("error") : actionFailed ? t("actionError") : !ready && wanted ? t("loading") : "";

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
            <button type="button" className="btn btn-primary" onClick={share} disabled={!ready}>
              {t("share")}
            </button>
          )}
          <button type="button" className={canShare ? "btn btn-ghost" : "btn btn-primary"} onClick={download} disabled={!ready}>
            {t("download")}
          </button>
        </div>
        <p className="soiree-status" role="status">
          {message}
        </p>
      </div>

      <div className={`soiree-preview ${format}`}>
        {preview && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview.url} alt={t("previewAlt")} style={{ opacity: ready ? 1 : 0.5 }} />
        )}
      </div>
    </div>
  );
}
