"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import {
  Film,
  Clock,
  Zap,
  Music,
  Brain,
  BookOpen,
  Gamepad2,
  MapPin,
  Users,
  Check,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Mail,
  Star,
  Tv2,
  QrCode,
  Trophy,
} from "lucide-react";
import { URLS } from "@/lib/constants";
import PasswordGate from "./PasswordGate";

const SIGNUP_CINEO = `${URLS.signup}?coupon=CINEO`;

const SOCIAL_LOGOS = [
  { name: "Accor Arena", logo: "/images/clients/accor-arena.png" },
  { name: "Zenith de Strasbourg", logo: "/images/clients/zenith-strasbourg.png" },
  { name: "Ninkasi", logo: "/images/clients/ninkasi.png" },
  { name: "Buffalo Grill", logo: "/images/clients/buffalo-grill.png" },
  { name: "Groupe ADP", logo: "/images/clients/groupe-adp.png" },
];

/* ─────────────────────── MINIMAL HEADER ─────────────────────── */

function MinimalHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 ${
        scrolled
          ? "bg-bg/80 backdrop-blur-xl border-b border-border/50"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="/fr" className="flex items-center">
          <Image
            src="/images/logos/unboared-logo.png"
            alt="Unboared"
            width={140}
            height={36}
            className="h-7 w-auto"
          />
        </a>
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline text-text-dim text-sm">
            Offre partenaire
          </span>
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-semibold tracking-wide">
            CINEO
          </span>
        </div>
      </div>
    </header>
  );
}

/* ─────────────────────── HERO ─────────────────────── */

function CineoHero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const bgOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center overflow-hidden pt-20 pb-16"
    >
      {/* Background */}
      <motion.div style={{ opacity: bgOpacity }} className="absolute inset-0 mesh-gradient" />
      <div className="absolute inset-0 dot-grid opacity-[0.03]" />

      {/* Floating orbs */}
      <motion.div
        animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/5 blur-3xl"
      />
      <motion.div
        animate={{ y: [0, 15, 0], x: [0, -10, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-accent/5 blur-3xl"
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left — Copy */}
          <div>
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
              className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 backdrop-blur-sm px-5 py-2.5 text-sm text-accent font-medium mb-8"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
              </span>
              Offre exclusive adherents CINEO
            </motion.div>

            {/* Headline */}
            <motion.h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.08] mb-6">
              <motion.span
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 80, damping: 20, delay: 0.1 }}
                className="block"
              >
                Transformez vos halls
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 80, damping: 20, delay: 0.2 }}
                className="block bg-gradient-to-r from-primary via-primary-hover to-accent bg-clip-text text-transparent"
              >
                en espaces d&apos;animation
              </motion.span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 80, damping: 20, delay: 0.35 }}
              className="text-lg md:text-xl text-text-muted max-w-xl mb-10 leading-relaxed"
            >
              Blind test, quiz, jeux d&apos;arcade... Vos spectateurs scannent
              un QR code et jouent depuis leur telephone. Cle en main, sans
              materiel supplementaire.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 80, damping: 20, delay: 0.5 }}
              className="flex flex-col sm:flex-row items-start gap-4 mb-6"
            >
              <motion.a
                href="#pricing"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-accent text-white font-bold text-lg glow-accent transition-shadow duration-300"
              >
                Decouvrir l&apos;offre CINEO
                <ArrowRight className="w-5 h-5" />
              </motion.a>
              <motion.a
                href={URLS.demo}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center px-8 py-4 rounded-2xl border border-border-light text-text hover:bg-bg-card/80 transition-all duration-200"
              >
                Voir la demo
              </motion.a>
            </motion.div>

            {/* Trust line */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-sm text-text-dim"
            >
              Sans engagement &middot; Essai gratuit 14 jours &middot; Sans
              carte bancaire
            </motion.p>
          </div>

          {/* Right — Hero video */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: "spring", stiffness: 60, damping: 20, delay: 0.4 }}
            className="relative flex justify-center"
          >
            <div className="relative">
              <div className="absolute -inset-8 bg-gradient-to-br from-primary/20 via-transparent to-accent/15 rounded-3xl blur-2xl" />
              <div className="relative rounded-2xl overflow-hidden border border-border-light/50 shadow-2xl shadow-black/50 w-fit mx-auto">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="block max-h-[340px] sm:max-h-[460px] lg:max-h-[560px] max-w-[220px] sm:max-w-[280px] lg:max-w-[300px] w-auto h-auto"
                >
                  <source src="/videos/hero.mp4" type="video/mp4" />
                  <source src="/videos/hero.webm" type="video/webm" />
                </video>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────── VALUE PROPOSITION ─────────────────────── */

const VALUE_PROPS = [
  {
    icon: Film,
    title: "Diversifiez au-dela de la projection",
    desc: "Proposez une experience interactive qui attire une clientele variee : soirees a theme, avant-premieres animees, evenements prives.",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: Clock,
    title: "Rentabilisez les temps creux",
    desc: "Activez vos halls entre les seances et lors des jours de faible affluence. Transformez l'attente en moment de jeu collectif.",
    color: "text-accent",
    bg: "bg-accent/10",
  },
  {
    icon: Zap,
    title: "Solution cle en main",
    desc: "Aucun materiel supplementaire. Un ecran, un navigateur, c'est pret. Vos spectateurs jouent depuis leur telephone via QR code.",
    color: "text-success",
    bg: "bg-success/10",
  },
];

function CineoValueProp() {
  return (
    <section className="py-24 px-6 relative">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-primary/3 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 80, damping: 20 }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Pourquoi Unboared pour votre cinema ?
          </h2>
          <p className="text-text-muted text-lg max-w-xl mx-auto">
            Une solution d&apos;animation pensee pour les lieux qui accueillent
            du public.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {VALUE_PROPS.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{
                type: "spring",
                stiffness: 80,
                damping: 20,
                delay: i * 0.1,
              }}
              className="bg-bg-card border border-border rounded-2xl p-7 hover:border-border-light transition-colors group"
            >
              <div
                className={`w-12 h-12 rounded-xl ${item.bg} flex items-center justify-center mb-5`}
              >
                <item.icon className={`w-6 h-6 ${item.color}`} />
              </div>
              <h3 className="text-lg font-bold mb-3">{item.title}</h3>
              <p className="text-text-muted text-sm leading-relaxed">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────── FEATURES ─────────────────────── */

const FEATURES = [
  {
    icon: Music,
    title: "Blind Test Musical",
    desc: "Playlists generees par IA sur n'importe quel theme. Musiques de films, annees 80, pop actuelle...",
    color: "text-accent",
    bg: "bg-accent/10",
    badge: "IA",
  },
  {
    icon: Brain,
    title: "Quiz Interactif",
    desc: "Des quiz sur tous les themes : culture cine, actualite, culture generale. Creez vos propres quiz personnalises.",
    color: "text-primary",
    bg: "bg-primary/10",
    badge: null,
  },
  {
    icon: BookOpen,
    title: "Petit Bac",
    desc: "Le classique reinvente en multijoueur sur grand ecran. Categories personnalisables.",
    color: "text-success",
    bg: "bg-success/10",
    badge: null,
  },
  {
    icon: MapPin,
    title: "Geoloc",
    desc: "Devinez ou se trouvent les lieux sur une carte. Themes par pays, villes, monuments. Un des jeux les plus populaires.",
    color: "text-[#20abf3]",
    bg: "bg-[#20abf3]/10",
    badge: null,
  },
  {
    icon: Gamepad2,
    title: "Jeux d'Arcade",
    desc: "Une bibliotheque de mini-jeux multijoueurs : action, adresse, reflexes. Le telephone devient la manette.",
    color: "text-[#e9bc0c]",
    bg: "bg-[#e9bc0c]/10",
    badge: null,
  },
  {
    icon: Users,
    title: "Jusqu'a 500 joueurs",
    desc: "Toute la salle peut jouer en meme temps. Chaque spectateur participe depuis son smartphone.",
    color: "text-primary",
    bg: "bg-primary/10",
    badge: null,
  },
];

function CineoFeatures() {
  return (
    <section className="py-24 px-6 border-t border-border">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 80, damping: 20 }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Un catalogue de jeux pour tous les publics
          </h2>
          <p className="text-text-muted text-lg max-w-xl mx-auto">
            Des experiences interactives variees, de 2 a 500 joueurs.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{
                type: "spring",
                stiffness: 80,
                damping: 20,
                delay: i * 0.08,
              }}
              className="bg-bg-card border border-border rounded-2xl p-6 hover:border-border-light transition-colors relative overflow-hidden group"
            >
              {/* Hover glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="relative">
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={`w-10 h-10 rounded-lg ${f.bg} flex items-center justify-center`}
                  >
                    <f.icon className={`w-5 h-5 ${f.color}`} />
                  </div>
                  {f.badge && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-wider">
                      <Sparkles className="w-3 h-3" />
                      {f.badge}
                    </span>
                  )}
                </div>
                <h3 className="font-bold mb-2">{f.title}</h3>
                <p className="text-text-muted text-sm leading-relaxed">
                  {f.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────── SOCIAL PROOF ─────────────────────── */

function CountUpNumber({
  value,
  prefix = "",
  suffix = "",
}: {
  value: number;
  prefix?: string;
  suffix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) setStarted(true);
      },
      { threshold: 0.5 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    const duration = 2000;
    const t0 = performance.now();
    function tick(now: number) {
      const p = Math.min((now - t0) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 4);
      setCount(Math.round(eased * value));
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }, [started, value]);

  return (
    <span ref={ref}>
      {prefix}
      {count.toLocaleString("fr-FR")}
      {suffix}
    </span>
  );
}

function CineoHowItWorks() {
  const steps = [
    { icon: Tv2, title: "Branchez", desc: "Connectez un PC a votre ecran via HDMI et ouvrez Unboared dans le navigateur." },
    { icon: QrCode, title: "Lancez", desc: "Choisissez un jeu dans le catalogue. Un QR code apparait a l'ecran." },
    { icon: Trophy, title: "Jouez !", desc: "Vos spectateurs scannent le QR code et jouent depuis leur telephone. C'est parti !" },
  ];

  return (
    <section className="py-24 px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 80, damping: 20 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Pret en 3 etapes
          </h2>
          <p className="text-text-muted text-lg">
            Aucune competence technique requise
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="grid gap-10">
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ type: "spring", stiffness: 80, damping: 20, delay: i * 0.12 }}
                className="flex gap-5"
              >
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <step.icon className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono text-text-dim">0{i + 1}</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-text-muted leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ type: "spring", stiffness: 60, damping: 20, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="absolute -inset-4 bg-gradient-to-br from-primary/15 via-transparent to-accent/10 rounded-3xl blur-2xl" />
            <div className="relative rounded-2xl overflow-hidden border border-border-light/50 shadow-2xl shadow-black/50">
              <Image
                src="/images/photos/bar-ninkasi-soiree.webp"
                alt="Soiree Unboared en bar"
                width={600}
                height={600}
                className="w-full aspect-square object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-bg/60 via-transparent to-transparent" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────── SOCIAL PROOF ─────────────────────── */

function CineoSocialProof() {
  const stats = [
    { value: 1000, prefix: "+", suffix: "", label: "etablissements" },
    { value: 110, prefix: "+", suffix: "k", label: "joueurs" },
    { value: 500, prefix: "", suffix: "k", label: "parties jouees" },
  ];

  const testimonials = [
    {
      quote: "Superbes soirees, retours clients enormes. Je vous remercie pour l'acces a la solution qui m'a permis de me rendre compte du succes de la solution.",
      author: "Laurent Angelini",
      company: "Les Coulisses",
      photo: "/images/testimonials/laurent-angelini.png",
    },
    {
      quote: "Chouettes soirees, chouette feeling tous ensemble. C'est le feu. Utilise pour chaque animation Top Music au Zenith de Strasbourg.",
      author: "Erwan Le Guilloux",
      company: "Top Music",
      photo: "/images/testimonials/erwan-le-guilloux.png",
    },
  ];

  return (
    <section className="py-24 px-6 border-t border-border relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-accent/3 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 80, damping: 20 }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ils nous font confiance
          </h2>
          <p className="text-text-muted text-lg">
            Des lieux d&apos;envergure nationale animent deja avec Unboared.
          </p>
        </motion.div>

        {/* Logo grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 80, damping: 20, delay: 0.1 }}
          className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 mb-16"
        >
          {SOCIAL_LOGOS.map((client) => (
            <div
              key={client.name}
              className="flex items-center justify-center h-12"
            >
              <Image
                src={client.logo}
                alt={client.name}
                width={120}
                height={48}
                className="h-8 sm:h-10 w-auto object-contain grayscale opacity-50 hover:opacity-90 hover:grayscale-0 transition-all duration-500"
              />
            </div>
          ))}
        </motion.div>

        {/* Real testimonials */}
        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-16">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.author}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ type: "spring", stiffness: 80, damping: 20, delay: i * 0.12 }}
              className="bg-bg-card border border-border rounded-2xl p-6 hover:border-border-light transition-colors"
            >
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: 5 }).map((_, si) => (
                  <Star key={si} className="w-4 h-4 fill-accent text-accent" />
                ))}
              </div>
              <p className="text-text-muted leading-relaxed mb-5 text-sm italic">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <Image
                  src={t.photo}
                  alt={t.author}
                  width={48}
                  height={48}
                  className="rounded-full object-cover w-12 h-12 border border-border-light"
                />
                <div>
                  <p className="font-semibold text-sm">{t.author}</p>
                  <p className="text-text-dim text-xs">{t.company}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 sm:gap-8 max-w-3xl mx-auto">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                type: "spring",
                stiffness: 80,
                damping: 20,
                delay: 0.2 + i * 0.1,
              }}
              className="text-center"
            >
              <div className="text-2xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                <CountUpNumber
                  value={stat.value}
                  prefix={stat.prefix}
                  suffix={stat.suffix}
                />
              </div>
              <p className="text-sm text-text-muted mt-2">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────── PRICING ─────────────────────── */

const COMMON_FEATURES = [
  "Acces a tous les jeux du catalogue",
  "Blind test avec playlists generees par IA",
  "Quiz personnalisables",
  "Joueurs illimites",
  "Personnalisation des jeux",
  "Support par email prioritaire",
  "14 jours d'essai gratuit",
  "Sans engagement",
];

function CineoPricing() {
  const currentCount = 0;

  return (
    <section id="pricing" className="py-24 px-6 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 80, damping: 20 }}
          className="text-center mb-5"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Un tarif preferentiel pour le reseau CINEO
          </h2>
          <p className="text-text-muted text-lg max-w-xl mx-auto">
            Plus vous etes nombreux, moins c&apos;est cher.
          </p>
        </motion.div>

        {/* Collective progress */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 80, damping: 20, delay: 0.1 }}
          className="max-w-lg mx-auto mb-14"
        >
          <div className="bg-bg-card/60 border border-border rounded-2xl p-5">
            <div className="flex items-center justify-between text-sm mb-3">
              <span className="text-text-muted flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-success" />
                Progression collective
              </span>
              <span className="font-semibold text-text">
                {currentCount}/30 cinemas
              </span>
            </div>
            <div className="h-3 rounded-full bg-border/50 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${(currentCount / 30) * 100}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
                className="h-full rounded-full bg-gradient-to-r from-accent to-primary"
              />
            </div>
            <p className="text-xs text-text-dim mt-2.5 text-center">
              {currentCount === 0
                ? "Soyez parmi les premiers a rejoindre l'offre CINEO"
                : `Encore ${30 - currentCount} cinemas pour debloquer le tarif volume a 39\u20AC/mois`}
            </p>
          </div>
        </motion.div>

        {/* Pricing cards */}
        <div className="grid md:grid-cols-2 gap-6 items-start">
          {/* Preferential tier */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ type: "spring", stiffness: 80, damping: 20 }}
            className="bg-bg/50 border border-border rounded-3xl p-8 relative"
          >
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 inline-flex items-center px-4 py-1.5 rounded-full bg-accent/10 border border-accent/30 text-accent text-sm font-medium whitespace-nowrap">
              Offre CINEO
            </div>

            <div className="text-center mt-4 mb-8">
              <p className="text-xs text-text-dim uppercase tracking-widest mb-1">
                Tarif Preferentiel
              </p>
              <h3 className="text-2xl font-bold mb-4">
                Jusqu&apos;a 29 cinemas
              </h3>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-5xl md:text-6xl font-bold">45</span>
                <span className="text-xl font-semibold text-text-muted">
                  &euro;
                </span>
                <span className="text-text-muted">/mois HT</span>
              </div>
              <p className="text-text-dim text-sm mt-2">
                par cinema &middot; au lieu de 49&euro;
              </p>
            </div>

            <ul className="space-y-3 mb-8">
              {COMMON_FEATURES.map((feature) => (
                <li key={feature} className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-success flex-shrink-0" />
                  <span className="text-text-muted text-sm">{feature}</span>
                </li>
              ))}
            </ul>

            <motion.a
              href={SIGNUP_CINEO}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="block w-full text-center px-8 py-4 rounded-xl border border-border text-text font-semibold text-lg hover:border-border-light hover:bg-bg-card/50 transition-all duration-200"
            >
              Essai gratuit 14 jours
            </motion.a>

            <p className="text-center text-sm text-text-dim mt-4">
              Sans carte bancaire
            </p>
          </motion.div>

          {/* Volume tier */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{
              type: "spring",
              stiffness: 80,
              damping: 20,
              delay: 0.1,
            }}
            className="bg-bg border-2 border-primary/30 rounded-3xl p-8 relative shadow-2xl shadow-primary/10"
          >
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 inline-flex items-center px-4 py-1.5 rounded-full bg-success/10 border border-success/30 text-success text-sm font-medium whitespace-nowrap">
              Meilleur tarif
            </div>

            <div className="text-center mt-4 mb-4">
              <p className="text-xs text-text-dim uppercase tracking-widest mb-1">
                Tarif Volume
              </p>
              <h3 className="text-2xl font-bold mb-4">
                Des 30 cinemas adherents
              </h3>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-5xl md:text-6xl font-bold">39</span>
                <span className="text-xl font-semibold text-text-muted">
                  &euro;
                </span>
                <span className="text-text-muted">/mois HT</span>
              </div>
              <p className="text-text-dim text-sm mt-2">par cinema</p>
            </div>

            {/* Savings pill */}
            <div className="flex justify-center mb-6">
              <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-success/10 border border-success/20 text-success text-sm font-medium">
                <Sparkles className="w-3.5 h-3.5" />
                Economisez 120&euro;/an par cinema
              </span>
            </div>

            <ul className="space-y-3 mb-8">
              {[...COMMON_FEATURES, "Interlocuteur dedie reseau CINEO"].map(
                (feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-success flex-shrink-0" />
                    <span className="text-text-muted text-sm">{feature}</span>
                  </li>
                )
              )}
            </ul>

            <motion.a
              href={SIGNUP_CINEO}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="block w-full text-center px-8 py-4 rounded-xl bg-accent text-white font-bold text-lg glow-accent transition-shadow duration-300"
            >
              Essai gratuit 14 jours
            </motion.a>

            <p className="text-center text-sm text-text-dim mt-4">
              Sans carte bancaire
            </p>
          </motion.div>
        </div>

        {/* Collective note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-center text-sm text-text-dim mt-8 max-w-lg mx-auto"
        >
          Lorsque 30 cinemas CINEO seront abonnes, tous les adherents
          basculeront automatiquement au tarif volume de 39&euro;/mois.
        </motion.p>
      </div>
    </section>
  );
}

/* ─────────────────────── CTA ─────────────────────── */

function CineoCta() {
  return (
    <section className="py-32 px-6 relative overflow-hidden border-t border-border">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 mesh-gradient opacity-60" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/8 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-accent/6 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ type: "spring", stiffness: 70, damping: 20 }}
        className="relative max-w-3xl mx-auto text-center"
      >
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 80, damping: 20, delay: 0.1 }}
          className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4 leading-[1.05]"
        >
          Pret a animer{" "}
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            vos cinemas
          </span>{" "}
          ?
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 80, damping: 20, delay: 0.2 }}
          className="text-text-muted text-lg md:text-xl mb-10 max-w-xl mx-auto"
        >
          Rejoignez le reseau CINEO sur Unboared. Essai gratuit, sans
          engagement.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 80, damping: 20, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6"
        >
          <motion.a
            href={SIGNUP_CINEO}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-accent text-white font-bold text-lg glow-accent transition-shadow duration-300"
          >
            Creer mon compte CINEO
            <ArrowRight className="w-5 h-5" />
          </motion.a>
          <motion.a
            href={URLS.contact}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl border border-border-light text-text hover:bg-bg-card/80 transition-all duration-200"
          >
            <Mail className="w-5 h-5" />
            Nous contacter
          </motion.a>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-sm text-text-dim"
        >
          Essai gratuit 14 jours &middot; Sans carte bancaire &middot; Sans
          engagement
        </motion.p>
      </motion.div>
    </section>
  );
}

/* ─────────────────────── MINIMAL FOOTER ─────────────────────── */

function MinimalFooter() {
  return (
    <footer className="py-8 px-6 border-t border-border">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Image
            src="/images/logos/unboared-picto.png"
            alt="Unboared"
            width={28}
            height={28}
            className="h-6 w-6"
          />
          <span className="text-text-dim text-sm">
            &copy; {new Date().getFullYear()} Unboared
          </span>
        </div>
        <div className="flex items-center gap-6 text-sm text-text-dim">
          <a
            href="/fr/terms-of-use"
            className="hover:text-text-muted transition-colors"
          >
            Conditions d&apos;utilisation
          </a>
          <a
            href="/fr/privacy-policy"
            className="hover:text-text-muted transition-colors"
          >
            Politique de confidentialite
          </a>
        </div>
      </div>
    </footer>
  );
}

/* ─────────────────────── MAIN EXPORT ─────────────────────── */

export default function CineoLanding() {
  return (
    <PasswordGate>
      <MinimalHeader />
      <main className="flex-1">
        <CineoHero />
        <CineoSocialProof />
        <CineoValueProp />
        <CineoHowItWorks />
        <CineoFeatures />
        <CineoPricing />
        <CineoCta />
      </main>
      <MinimalFooter />
    </PasswordGate>
  );
}
