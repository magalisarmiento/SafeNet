"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { trackWorldEntry } from "@/lib/tracking";
import Image from "next/image";
import Link from "next/link";
import {
  ShieldCheck,
  ArrowLeft,
  MoreHorizontal,
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  BadgeCheck,
  Home,
  Search,
  Compass,
  User,
  PlusSquare,
  Menu,
  Smile,
  ArrowRight,
  AlertTriangle,
  ChevronRight,
  X,
  Check,
  ChevronLeft,
  UserPlus,
} from "lucide-react";

/* ════════════════════════════════════════════════════════════
   TIPOS
════════════════════════════════════════════════════════════ */
type View = "intro" | "setup" | "world";
type ModuleId =
  | "dm_sim"
  | "profile_detector"
  | "story_path"
  | "red_flags"
  | "screenshot_analysis"
  | "requests";
type NavTab = "home" | "search" | "dm" | "profile" | "requests";

/* ════════════════════════════════════════════════════════════
   PALETA SAFENET — RED SOCIAL
════════════════════════════════════════════════════════════ */
const C = {
  white: "#FFFFFF",
  bgSoft: "#F8FAFC",
  celeste: "#e5ebfa",
  blue: "#0B5CFF",
  blueHover: "#0a4fdc",
  blueDark: "#061538",
  blueDeep: "#102A43",
  textMute: "#5B6B7A",
  textSoft: "#7C8A99",
  line: "#D8E3EC",
  lineSoft: "#EEF2F7",
  success: "#16A34A",
  successSoft: "#DCFCE7",
  danger: "#DC2626",
  dangerSoft: "#FEE2E2",
  warning: "#EA580C",
  warningSoft: "#FFEDD5",
};
const ACCENT = C.blue;
const ACCENT_DIM = C.blueHover;
const BG_DARK = C.bgSoft;
const GLASS_BG = C.white;
const GLASS_BORDER = C.line;
const BRAND_GRADIENT = `linear-gradient(135deg,${C.blue} 0%,${C.blueDeep} 100%)`;
const FONT_DISPLAY = "'Space Grotesk',Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif";
const FONT_BODY = "Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";

/* ════════════════════════════════════════════════════════════
   USUARIOS CONSISTENTES
════════════════════════════════════════════════════════════ */
const USERS = {
  valen: { handle: "valen.raw", avatar: "https://i.pravatar.cc/100?img=47" },
  juani: { handle: "juanix.mp4", avatar: "https://i.pravatar.cc/100?img=12" },
  sofi: { handle: "sofi.jpeg", avatar: "https://i.pravatar.cc/100?img=45" },
  mateo: { handle: "mateo.ar_", avatar: "https://i.pravatar.cc/100?img=15" },
  lucas: { handle: "luu.cas", avatar: "https://i.pravatar.cc/100?img=8" },
  caro: { handle: "caro.dump", avatar: "https://i.pravatar.cc/100?img=44" },
  edu: { handle: "profe.eduardo", avatar: "https://i.pravatar.cc/100?img=53" },
  andrea: { handle: "andrea.ctrl", avatar: "https://i.pravatar.cc/100?img=49" },
  ia: { handle: "ia.enserio", avatar: "https://i.pravatar.cc/100?img=60" },
  carlos: { handle: "carlos.mira", avatar: "https://i.pravatar.cc/100?img=11" },
};

/* ════════════════════════════════════════════════════════════
   FUENTES EXTERNAS — metadata de entidades reales
════════════════════════════════════════════════════════════ */
const SOURCE_PROFILES = {
  groomingargentina: {
    username: "groomingargentina",
    subtitle: "Argentina",
    avatarSrc: "/grooming-arg.png",
    avatarAlt: "Grooming Argentina",
    avatarFallback: "GA",
    verified: true,
  },
  infobae: {
    username: "infobae",
    subtitle: "Medio digital · Video educativo",
    avatarSrc: "/logos/infobae.png",
    avatarAlt: "Infobae",
    avatarFallback: "I",
    verified: true,
  },
  incibe: {
    username: "incibe",
    subtitle: "Ciberseguridad · Prevención digital",
    avatarSrc: "/logos/incibe.png",
    avatarAlt: "INCIBE",
    avatarFallback: "IN",
    verified: true,
  },
  cybercouple: {
    username: "cybercouple",
    subtitle: "Creador digital · Seguridad online",
    avatarSrc: "/logos/cybercouple.png",
    avatarAlt: "Cybercouple",
    avatarFallback: "C",
    verified: false,
  },
  safenet: {
    username: "safenet.ayuda",
    subtitle: "Prevención digital · SAFENET",
    avatarSrc: "/logos/safenet.png",
    avatarAlt: "SAFENET",
    avatarFallback: "SN",
    verified: true,
  },
} as const;

type SourceKey = keyof typeof SOURCE_PROFILES;

/* ════════════════════════════════════════════════════════════
   DATOS DE STORIES
════════════════════════════════════════════════════════════ */
type StorySlide = {
  imageSrc: string;
  imageAlt: string;
  title: string;
  body: string;
  tag: string;
  tagColor: string;
};

type StoryData = {
  user: keyof typeof USERS;
  slides: StorySlide[];
};

const STORIES_DATA: StoryData[] = [
  {
    user: "valen",
    slides: [
      {
        imageSrc: "/stories/story-halago-inicial.jpg",
        imageAlt: "Celular con notificaciones en un escritorio",
        title: "Cuando el halago llega rápido",
        body: "Si alguien que no conocés intenta hacerte sentir especial desde el primer mensaje, frená. Puede ser una forma de bajar tu guardia.",
        tag: "RED FLAG",
        tagColor: "#FF8A95",
      },
      {
        imageSrc: "/stories/story-respuesta-segura.jpg",
        imageAlt: "Adolescente sosteniendo su celular",
        title: "No tenés que contestar",
        body: "Mantener distancia no te hace mala onda. Priorizar tu seguridad siempre está bien. Clavar el visto también es una respuesta válida.",
        tag: "CONSEJO",
        tagColor: "#A9DFBF",
      },
    ],
  },
  {
    user: "juani",
    slides: [
      {
        imageSrc: "/stories/story-telegram.jpg",
        imageAlt: "Pantalla de chat borrosa y notificaciones",
        title: "¿Por qué quiere ir a Telegram?",
        body: "Si alguien te pide salir de Insta para hablar por otra app, es alerta máxima. Buscan borrar el rastro y evitar que los reportes.",
        tag: "ALERTA",
        tagColor: "#FFE08A",
      },
      {
        imageSrc: "/stories/story-quedate-aca.jpg",
        imageAlt: "Manos escribiendo rápido en un celular",
        title: "Marcá la cancha",
        body: "\"Prefiero seguir hablando acá.\" Si la persona se enoja, insiste o te hace sentir culpa, ya sabés todo lo que necesitabas saber.",
        tag: "ACCIÓN SEGURA",
        tagColor: "#A9DFBF",
      },
    ],
  },
  {
    user: "sofi",
    slides: [
      {
        imageSrc: "/stories/story-secreto.jpg",
        imageAlt: "Adolescente con capucha caminando de espaldas",
        title: "El peso de un secreto",
        body: "\"Que quede entre nosotros\". Te hacen sentir especial para aislarte. Si te piden que no cuentes algo, es exactamente lo que tenés que hacer.",
        tag: "TÁCTICA",
        tagColor: "#FF8A95",
      },
      {
        imageSrc: "/stories/story-contar-adulto.jpg",
        imageAlt: "Dos personas conversando en un café",
        title: "Rompé el silencio",
        body: "Hablar no es traicionar a nadie. Contarle a un amigo o a un adulto de confianza es tu mejor escudo contra la manipulación.",
        tag: "IMPORTANTE",
        tagColor: "#74B3CE",
      },
    ],
  },
  {
    user: "mateo",
    slides: [
      {
        imageSrc: "/stories/story-perfil-falso.jpg",
        imageAlt: "Interfaz de red social difuminada",
        title: "Las matemáticas no mienten",
        body: "Miles de seguidores, tres fotos y cuenta nueva. No te dejes llevar por una biografía cool. Si los números no cierran, el perfil es falso.",
        tag: "DETECTOR",
        tagColor: "#FFE08A",
      },
    ],
  },
  {
    user: "lucas",
    slides: [
      {
        imageSrc: "/stories/story-manipulacion.jpg",
        imageAlt: "Silueta mirando por una ventana de noche",
        title: "El rescate emocional",
        body: "Si un desconocido online te dice rápido que sos \"la única persona que lo entiende\", está construyendo dependencia a propósito.",
        tag: "MANIPULACIÓN",
        tagColor: "#FF8A95",
      },
      {
        imageSrc: "/stories/story-bloquear-reportar.jpg",
        imageAlt: "Dedo a punto de tocar la pantalla del móvil",
        title: "Tu paz mental primero",
        body: "No le debés explicaciones ni tu tiempo a extraños. El botón de bloquear y reportar existe por una razón. Usalo sin culpa.",
        tag: "TU DERECHO",
        tagColor: "#A9DFBF",
      },
    ],
  },
  {
    user: "caro",
    slides: [
      {
        imageSrc: "/stories/story-foto-personal.jpg",
        imageAlt: "Cámara de celular enfocando",
        title: "La prueba de vida",
        body: "\"Mandame una foto para ver si sos real\". Ninguna persona real necesita fotos tuyas para hablar. Es el primer paso para pedir cosas peores.",
        tag: "NUNCA",
        tagColor: "#FF8A95",
      },
    ],
  },
  {
    user: "edu",
    slides: [
      {
        imageSrc: "/stories/story-grooming-definicion.jpg",
        imageAlt: "Personas caminando por la calle, estilo urbano",
        title: "Hablemos de Grooming",
        body: "Es cuando un adulto se hace pasar por un par online o se gana tu confianza para obtener contenido íntimo. Conocerlo es la clave para prevenirlo.",
        tag: "DEFINICIÓN",
        tagColor: "#74B3CE",
      },
      {
        imageSrc: "/stories/story-linea-ayuda.jpg",
        imageAlt: "Un teléfono en primer plano sobre una mesa",
        title: "No estás solo",
        body: "Si algo te incomoda, siempre hay alguien para escuchar. En Argentina podés llamar al 102 las 24 horas. Es gratis, anónimo y confidencial.",
        tag: "RECURSOS",
        tagColor: "#A9DFBF",
      },
    ],
  },
];

/* ════════════════════════════════════════════════════════════
   DATOS DEL DM INBOX
════════════════════════════════════════════════════════════ */
type DmConversation = {
  id: string;
  name: string;
  avatar: string;
  preview: string;
  time: string;
  unread: number;
  isStranger: boolean;
};

const DM_CONVERSATIONS: DmConversation[] = [
  {
    id: "stranger",
    name: "nicoo.raw",
    avatar: "https://i.pravatar.cc/150?img=11",
    preview: "Che, creo que te vi en recomendados.",
    time: "2 min",
    unread: 1,
    isStranger: true,
  },
  {
    id: "sofi",
    name: USERS.sofi.handle,
    avatar: USERS.sofi.avatar,
    preview: "Che, ¿viste el último post de groomingargentina?",
    time: "1 h",
    unread: 0,
    isStranger: false,
  },
  {
    id: "valen",
    name: USERS.valen.handle,
    avatar: USERS.valen.avatar,
    preview: "Lo comparto ✓✓",
    time: "3 h",
    unread: 0,
    isStranger: false,
  },
  {
    id: "caro",
    name: USERS.caro.handle,
    avatar: USERS.caro.avatar,
    preview: "Fundamental para adolescentes esto",
    time: "5 h",
    unread: 0,
    isStranger: false,
  },
];

/* ════════════════════════════════════════════════════════════
   DATOS DE SOLICITUDES DE SEGUIMIENTO (NUEVO)
════════════════════════════════════════════════════════════ */
const REQUEST_PROFILES = [
  {
    id: "req1",
    username: "sofi.martinez",
    name: "Sofía Martínez",
    type: "real",
    followers: 486,
    posts: 112,
    age: "Desde 2020",
    mutual: 5,
    followedBy: "valen.raw",
    bio: "17 | música, fotos y dump",
    activity: "Comentarios normales, publicaciones variadas, interacciones coherentes.",
    feedback: "Perfil coherente. Tiene historial, publicaciones variadas y contactos en común.",
    avatar: "https://i.pravatar.cc/150?img=43",
  },
  {
    id: "req2",
    username: "tomas.rivero",
    name: "Tomás Rivero",
    type: "real",
    followers: 623,
    posts: 89,
    age: "Desde 2021",
    mutual: 3,
    followedBy: "juanix.mp4",
    bio: "hockey, gym y alguna foto cada tanto",
    activity: "Perfil cotidiano, seguidores y publicaciones coherentes.",
    feedback: "No se observan señales claras de riesgo. Aun así, revisar antes de aceptar siempre es válido.",
    avatar: "https://i.pravatar.cc/150?img=11",
  },
  {
    id: "req3",
    username: "valen.ph",
    name: "Valentina",
    type: "suspicious",
    followers: "9.8K",
    posts: 4,
    age: "Hace 3 semanas",
    mutual: 0,
    bio: "contenido · lifestyle · collabs",
    activity: "Pocas publicaciones, comentarios genéricos, imagen muy producida, cuenta reciente.",
    feedback: "Perfil con señales inconsistentes: muchos seguidores, pocas publicaciones, cuenta reciente y sin vínculos reales en común.",
    avatar: "https://i.pravatar.cc/150?img=5",
  },
  {
    id: "req4",
    username: "mateo.digital",
    name: "Mateo",
    type: "suspicious",
    followers: 217,
    posts: 1,
    age: "Hace 5 días",
    mutual: 0,
    bio: "gaming, edits y música",
    activity: "Empezó a seguir muchas cuentas adolescentes en poco tiempo.",
    feedback: "La cuenta es nueva y no tiene historial. Es recomendable no aceptar sin verificar quién es.",
    avatar: "https://i.pravatar.cc/150?img=12",
  },
  {
    id: "req5",
    username: "casting.joven.ar",
    name: "Casting Joven Argentina",
    type: "risky",
    followers: "7.5K",
    posts: 6,
    age: "Hace 1 mes",
    mutual: 0,
    bio: "talentos · campañas · contenido digital",
    activity: "Invita a escribir por privado, promete visibilidad, no tiene datos verificables.",
    feedback: "Prometer exposición o beneficios a adolescentes por privado puede funcionar como anzuelo. No conviene aceptar ni continuar el contacto.",
    avatar: "https://i.pravatar.cc/150?img=32",
  },
];

/* ════════════════════════════════════════════════════════════
   UTILIDADES UI
════════════════════════════════════════════════════════════ */
function FeedbackBox({
  message,
  type,
}: {
  message: string;
  type: "success" | "danger" | "info" | "warn";
}) {
  const s = {
    success: { bg: C.successSoft, border: "#86EFAC", color: "#15803D" },
    danger: { bg: C.dangerSoft, border: "#FCA5A5", color: "#B91C1C" },
    info: { bg: C.celeste, border: "#c7d4f7", color: C.blueDark },
    warn: { bg: C.warningSoft, border: "#FDBA74", color: "#9A3412" },
  }[type];
  return (
    <div
      style={{
        background: s.bg,
        border: `1px solid ${s.border}`,
        color: s.color,
        padding: "12px 16px",
        borderRadius: "10px",
        fontSize: "13px",
        lineHeight: 1.5,
        animation: "slideUpIn 0.35s ease-out forwards",
        margin: "10px 0",
      }}
    >
      {message}
    </div>
  );
}

function XpPop({ amount, onDone }: { amount: number; onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 1800);
    return () => clearTimeout(t);
  }, [onDone]);
  return (
    <div
      style={{
        position: "fixed",
        bottom: "100px",
        right: "40px",
        zIndex: 9999,
        background: C.blue,
        color: C.white,
        padding: "10px 18px",
        borderRadius: "999px",
        fontFamily: FONT_DISPLAY,
        fontSize: "13px",
        fontWeight: 700,
        letterSpacing: 0.3,
        animation: "xpPop 1.8s ease-out forwards",
        boxShadow: "0 10px 28px rgba(11,92,255,0.32)",
      }}
    >
      +{amount} XP
    </div>
  );
}

function ProgressBar({
  label,
  current,
  max,
  color,
}: {
  label: string;
  current: number;
  max: number;
  color: string;
}) {
  const pct = Math.min(100, Math.round((current / max) * 100));
  return (
    <div style={{ marginBottom: "14px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: "10px",
          fontWeight: "bold",
          marginBottom: "6px",
          textTransform: "uppercase",
          letterSpacing: "1px",
        }}
      >
        <span style={{ color: C.textMute }}>{label}</span>
        <span style={{ color: C.blue }}>{pct}%</span>
      </div>
      <div
        style={{
          height: "6px",
          background: C.lineSoft,
          borderRadius: "99px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${pct}%`,
            background: color,
            transition: "width 0.7s ease",
            borderRadius: "99px",
          }}
        />
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   MÓDULO 1 — DM SIM (chat realista, estética SAFENET light)
════════════════════════════════════════════════════════════ */
type DmChoice = {
  text: string;
  isSafe: boolean;
  points: number;
  signal: string;
  level: "safe" | "warn" | "risk";
  feedback: string;
};

const dmScript = [
  { from: "stranger", text: "Che, creo que te vi en recomendados. ¿Vos subiste una historia del recital ayer?" },
  { from: "stranger", text: "Jajaja no, pero me salió tu perfil. Igual tenemos varios gustos parecidos." },
  { from: "stranger", text: "Posta tenés buen gusto. No mucha gente de acá sube cosas así." },
  { from: "stranger", text: "Yo suelo conectarme tarde. ¿Vos a qué hora estás más libre?" },
  { from: "stranger", text: "Me copa hablar con vos, sos re distinta a la gente que tengo en la lista jaja." },
  { from: "stranger", text: "Igual no le cuentes a nadie que te escribí, capaz flashean cualquiera." },
  { from: "stranger", text: "Por acá me da paja hablar. ¿Tenés WhatsApp o Telegram? O pasame tu otro perfil." },
  { from: "stranger", text: "Dale, mandame una foto normal así sé que sos vos posta." },
];

const dmChoices: Record<number, DmChoice[]> = {
  0: [
    { text: "Puede ser, pero primero decime de dónde me conocés.", isSafe: true, points: 25, signal: "Contacto iniciado por un desconocido.", level: "safe", feedback: "Bien. Pedir de dónde te conoce frena la conversación sin dar datos." },
    { text: "Jaja sí, fui. ¿Vos también?", isSafe: false, points: 0, signal: "Contacto iniciado por un desconocido.", level: "risk", feedback: "Cuidado. Confirmar que estuviste en un lugar le da contexto sobre tu vida." },
  ],
  1: [
    { text: "Ahh ok. No suelo hablar mucho con gente que no conozco.", isSafe: true, points: 25, signal: "Falsa cercanía construida desde el primer mensaje.", level: "safe", feedback: "Bien. Marcaste distancia sin ser agresiva. Eso es suficiente." },
    { text: "¿Qué gustos? Capaz tenemos cosas en común.", isSafe: false, points: 0, signal: "Falsa cercanía construida desde el primer mensaje.", level: "warn", feedback: "Ojo. La idea de “gustos en común” suele ser una excusa para sostener la charla." },
  ],
  2: [
    { text: "Gracias, igual prefiero seguir hablando por acá si es algo normal.", isSafe: true, points: 20, signal: "Halago sin contexto para bajar la guardia.", level: "warn", feedback: "Está bien. Un halago de alguien que no te conoce no significa nada concreto." },
    { text: "Jaja gracias, vos también parecés copado.", isSafe: false, points: 0, signal: "Halago sin contexto para bajar la guardia.", level: "risk", feedback: "El halago apurado es una técnica clásica para crear cercanía falsa." },
  ],
  3: [
    { text: "Prefiero no decir mis horarios.", isSafe: true, points: 25, signal: "Pregunta sobre rutina o disponibilidad.", level: "safe", feedback: "Muy bien. Tus horarios son información sobre tu rutina, no se comparten." },
    { text: "A la tarde suelo estar libre.", isSafe: false, points: 0, signal: "Pregunta sobre rutina o disponibilidad.", level: "risk", feedback: "Cuidado. Decir cuándo estás libre permite que alguien arme un patrón de tu rutina." },
  ],
  4: [
    { text: "No me copa que alguien que no conozco diga eso tan rápido.", isSafe: true, points: 25, signal: "Construcción acelerada de vínculo emocional.", level: "safe", feedback: "Bien. Cuando la cercanía se construye muy rápido, casi siempre hay una intención atrás." },
    { text: "Jaja gracias, vos también me caés bien.", isSafe: false, points: 0, signal: "Construcción acelerada de vínculo emocional.", level: "warn", feedback: "Ojo. Devolver cercanía a un desconocido refuerza el vínculo que está armando." },
  ],
  5: [
    { text: "Si tengo que esconder que me hablás, prefiero cortar acá.", isSafe: true, points: 30, signal: "Pedido de secreto.", level: "safe", feedback: "Perfecto. El pedido de secreto es una de las señales más fuertes de manipulación." },
    { text: "Tranqui, no digo nada.", isSafe: false, points: 0, signal: "Pedido de secreto.", level: "risk", feedback: "Aceptar el secreto te aísla. Es exactamente lo que busca." },
  ],
  6: [
    { text: "No paso mis datos. Si querés hablar, es por acá.", isSafe: true, points: 30, signal: "Intento de mover la conversación a otra app.", level: "safe", feedback: "Muy bien. Cambiar de app borra el rastro y saca el sistema de reporte." },
    { text: "Dale, pasame tu número.", isSafe: false, points: 0, signal: "Intento de mover la conversación a otra app.", level: "risk", feedback: "Salir de la plataforma reduce tu protección y le da acceso a un canal más privado." },
  ],
  7: [
    { text: "Esto me hace ruido. Prefiero cortar y mostrarle esto a alguien de confianza.", isSafe: true, points: 35, signal: "Pedido de foto a un desconocido.", level: "safe", feedback: "Excelente. Guardar la captura y hablarlo con alguien de confianza es la mejor respuesta." },
    { text: "Bueno, una foto normal no pasa nada.", isSafe: false, points: 0, signal: "Pedido de foto a un desconocido.", level: "risk", feedback: "Una foto “normal” es el primer paso para pedir cosas peores. Nunca se justifica." },
  ],
};

type DmHistoryItem =
  | { from: "stranger" | "player"; kind: "msg"; text: string; time: string }
  | { from: "system"; kind: "feedback"; level: "safe" | "warn" | "risk"; text: string };

const DM_FEEDBACK_STYLE: Record<"safe" | "warn" | "risk", { bg: string; color: string; border: string; label: string }> = {
  safe: { bg: "#DCFCE7", color: "#15803D", border: "#86EFAC", label: "Buena decisión" },
  warn: { bg: "#FFEDD5", color: "#9A3412", border: "#FDBA74", label: "Cuidado" },
  risk: { bg: "#FEE2E2", color: "#B91C1C", border: "#FCA5A5", label: "Alerta" },
};

function DmSimModule({
  onComplete,
  onXp,
}: {
  onComplete: (pts: number) => void;
  onXp: (n: number) => void;
}) {
  const nowTime = () => {
    const d = new Date();
    return `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
  };

  const [history, setHistory] = useState<DmHistoryItem[]>([
    { from: "stranger", kind: "msg", text: dmScript[0].text, time: nowTime() },
  ]);
  const [step, setStep] = useState(0);
  const [pts, setPts] = useState(0);
  const [choicesMade, setChoicesMade] = useState<boolean[]>([]);
  const [typing, setTyping] = useState(false);
  const [phase, setPhase] = useState<"playing" | "result">("playing");
  const [xpPop, setXpPop] = useState(0);
  const chatRef = useRef<HTMLDivElement>(null);
  const totalSteps = Object.keys(dmChoices).length;

  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: "smooth" });
  }, [history, typing]);

  const handleChoice = (c: DmChoice) => {
    setHistory((prev) => [
      ...prev,
      { from: "player", kind: "msg", text: c.text, time: nowTime() },
      { from: "system", kind: "feedback", level: c.level, text: c.feedback },
    ]);
    setChoicesMade((prev) => [...prev, c.isSafe]);

    if (c.points > 0) {
      setPts((p) => p + c.points);
      setXpPop(c.points);
      onXp(c.points);
    }

    if (step + 1 >= totalSteps) {
      setTimeout(() => setPhase("result"), 1400);
      return;
    }
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setHistory((prev) => [...prev, { from: "stranger", kind: "msg", text: dmScript[step + 1].text, time: nowTime() }]);
      setStep((p) => p + 1);
    }, 1800);
  };

  if (phase === "result") {
    const detectedCount = choicesMade.filter(Boolean).length;
    const maxPts = Object.values(dmChoices).reduce((acc, opts) => acc + Math.max(...opts.map((o) => o.points)), 0);
    return (
      <div style={{ padding: "4px 0", animation: "slideUpIn 0.3s ease" }}>
        <div style={{ textAlign: "center", marginBottom: 22 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 14px", borderRadius: 999, background: C.celeste, border: `1px solid #c7d4f7`, marginBottom: 14 }}>
            <ShieldCheck size={14} color={C.blue} strokeWidth={2.5} />
            <span style={{ fontSize: 11, fontWeight: 700, color: C.blue, letterSpacing: 1.2, textTransform: "uppercase" }}>Conversación finalizada</span>
          </div>
          <h3 style={{ fontFamily: FONT_DISPLAY, fontSize: 22, color: C.blueDark, marginBottom: 10, fontWeight: 700, letterSpacing: -0.4 }}>
            No empezó como una amenaza.
          </h3>
          <p style={{ color: C.textMute, fontSize: 14, lineHeight: 1.6, maxWidth: 400, margin: "0 auto" }}>
            Empezó como una charla normal y fue escalando paso a paso. Así trabaja el grooming: gradual, cercano, casi invisible.
          </p>
        </div>

        <div style={{ background: C.white, border: `1px solid ${C.line}`, borderRadius: 14, padding: 16, marginBottom: 16, boxShadow: "0 8px 22px rgba(6,21,56,0.04)" }}>
          <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 1.2, color: C.blue, marginBottom: 12, fontWeight: 700 }}>
            Señales detectadas · {detectedCount}/{totalSteps}
          </div>
          {Object.keys(dmChoices).map((key, i) => {
            const signal = dmChoices[Number(key)][0].signal;
            const isDetected = choicesMade[i];
            return (
              <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "8px 0", borderTop: i === 0 ? "none" : `1px solid ${C.lineSoft}` }}>
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: isDetected ? C.success : C.danger,
                    boxShadow: `0 0 0 3px ${isDetected ? "rgba(22,163,74,0.18)" : "rgba(220,38,38,0.18)"}`,
                    marginTop: 5,
                    flexShrink: 0,
                  }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, color: C.blueDark, fontWeight: 600, lineHeight: 1.4 }}>{signal}</div>
                  <div style={{ fontSize: 12, color: isDetected ? C.success : C.danger, fontWeight: 600, marginTop: 2 }}>
                    {isDetected ? "Detectada" : "No detectada"}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ background: C.celeste, border: `1px solid #c7d4f7`, borderRadius: 12, padding: "14px 16px", marginBottom: 18 }}>
          <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 1.2, color: C.blue, fontWeight: 700, marginBottom: 4 }}>Recomendación</div>
          <div style={{ fontSize: 13.5, color: C.blueDark, lineHeight: 1.5 }}>
            Guardá la conversación, no la borres, y mostrásela a alguien de confianza. Reportar y bloquear es válido en cualquier punto.
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <span style={{ fontSize: 13, color: C.textMute }}>Puntaje</span>
          <span style={{ fontFamily: FONT_DISPLAY, fontSize: 18, fontWeight: 700, color: C.blueDark }}>{pts} <span style={{ color: C.textSoft, fontSize: 13, fontWeight: 500 }}>/ {maxPts} XP</span></span>
        </div>

        <button
          suppressHydrationWarning
          onClick={() => onComplete(pts)}
          className="sf-btn sf-btn-primary sf-btn-block"
        >
          Volver a mensajes
        </button>
      </div>
    );
  }

  return (
    <div>
      {xpPop > 0 && <XpPop amount={xpPop} onDone={() => setXpPop(0)} />}

      {/* Header del chat */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "12px 14px",
          background: C.white,
          borderRadius: 14,
          marginBottom: 10,
          border: `1px solid ${C.line}`,
          boxShadow: "0 6px 16px rgba(6,21,56,0.04)",
        }}
      >
        <div style={{ position: "relative", flexShrink: 0 }}>
          <div style={{ width: 38, height: 38, borderRadius: "50%", overflow: "hidden", border: `2px solid ${C.line}` }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://i.pravatar.cc/150?img=11" alt="nicoo.raw" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
          <span
            style={{
              position: "absolute",
              bottom: 0,
              right: 0,
              width: 11,
              height: 11,
              borderRadius: "50%",
              background: C.success,
              border: `2px solid ${C.white}`,
            }}
          />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: C.blueDark }}>nicoo.raw</div>
          <div style={{ fontSize: 11.5, color: C.textMute, display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.success }} />
            Activo ahora
          </div>
        </div>
        <MoreHorizontal size={20} color={C.blueDeep} style={{ flexShrink: 0 }} />
      </div>

      {/* Banner de advertencia */}
      <div
        style={{
          background: C.dangerSoft,
          border: "1px solid #FCA5A5",
          color: "#B91C1C",
          padding: "10px 14px",
          borderRadius: 12,
          marginBottom: 12,
          display: "flex",
          alignItems: "flex-start",
          gap: 10,
        }}
      >
        <AlertTriangle size={16} strokeWidth={2.4} style={{ flexShrink: 0, marginTop: 2 }} />
        <div>
          <div style={{ fontSize: 12.5, fontWeight: 700, marginBottom: 2 }}>Este usuario no te sigue</div>
          <div style={{ fontSize: 11.5, color: "#7F1D1D", lineHeight: 1.45 }}>Respondé solo si te sentís cómodo. Es una simulación segura.</div>
        </div>
      </div>

      <div style={{ marginBottom: 12 }}>
        <ProgressBar
          label={`Mensaje ${step + 1} de ${totalSteps}`}
          current={step + 1}
          max={totalSteps}
          color={C.blue}
        />
      </div>

      {/* Área de chat */}
      <div
        ref={chatRef}
        style={{
          background: C.bgSoft,
          borderRadius: 18,
          border: `1px solid ${C.line}`,
          padding: "14px 14px 16px",
          maxHeight: 320,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 10,
          marginBottom: 14,
        }}
      >
        <div style={{ textAlign: "center", margin: "2px 0 6px" }}>
          <span style={{ fontSize: 10.5, color: C.textSoft, background: C.white, padding: "3px 10px", borderRadius: 999, border: `1px solid ${C.line}`, fontWeight: 600, letterSpacing: 0.4 }}>Hoy</span>
        </div>

        {history.map((m, i) => {
          if (m.kind === "feedback") {
            const s = DM_FEEDBACK_STYLE[m.level];
            return (
              <div
                key={i}
                style={{
                  background: s.bg,
                  border: `1px solid ${s.border}`,
                  color: s.color,
                  borderRadius: 12,
                  padding: "10px 12px",
                  fontSize: 12.5,
                  lineHeight: 1.5,
                  margin: "4px 6px",
                  animation: "slideUpIn 0.3s ease",
                }}
              >
                <div style={{ fontWeight: 700, fontSize: 11, textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 2 }}>{s.label}</div>
                {m.text}
              </div>
            );
          }
          if (m.from === "stranger") {
            return (
              <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-end", animation: "slideUpIn 0.3s ease" }}>
                <div style={{ width: 26, height: 26, borderRadius: "50%", overflow: "hidden", flexShrink: 0, border: `1px solid ${C.line}` }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="https://i.pravatar.cc/150?img=11" alt="nicoo.raw" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <div
                  style={{
                    background: "#F1F5F9",
                    border: `1px solid ${C.line}`,
                    color: C.blueDark,
                    padding: "10px 13px",
                    borderRadius: "18px 18px 18px 4px",
                    fontSize: 13.5,
                    maxWidth: "78%",
                    lineHeight: 1.5,
                    boxShadow: "0 2px 6px rgba(6,21,56,0.03)",
                  }}
                >
                  {m.text}
                  <div style={{ fontSize: 10, color: C.textSoft, marginTop: 4, fontWeight: 500 }}>{m.time}</div>
                </div>
              </div>
            );
          }
          return (
            <div key={i} style={{ display: "flex", justifyContent: "flex-end", animation: "slideUpIn 0.3s ease" }}>
              <div
                style={{
                  background: C.blue,
                  border: `1px solid ${C.blue}`,
                  color: C.white,
                  padding: "10px 13px",
                  borderRadius: "18px 18px 4px 18px",
                  fontSize: 13.5,
                  maxWidth: "78%",
                  lineHeight: 1.5,
                  boxShadow: "0 6px 14px rgba(11,92,255,0.22)",
                }}
              >
                {m.text}
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.78)", marginTop: 4, fontWeight: 500, display: "flex", alignItems: "center", gap: 4, justifyContent: "flex-end" }}>
                  {m.time}
                  <Check size={10} strokeWidth={3} />
                  <Check size={10} strokeWidth={3} style={{ marginLeft: -7 }} />
                </div>
              </div>
            </div>
          );
        })}

        {typing && (
          <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
            <div style={{ width: 26, height: 26, borderRadius: "50%", overflow: "hidden", flexShrink: 0, border: `1px solid ${C.line}` }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://i.pravatar.cc/150?img=11" alt="nicoo.raw" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <div
              style={{
                background: "#F1F5F9",
                border: `1px solid ${C.line}`,
                padding: "10px 14px",
                borderRadius: "18px 18px 18px 4px",
                display: "flex",
                gap: 4,
                alignItems: "center",
              }}
            >
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.textMute, animation: "typingDot 1s infinite 0s" }} />
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.textMute, animation: "typingDot 1s infinite 0.2s" }} />
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.textMute, animation: "typingDot 1s infinite 0.4s" }} />
            </div>
          </div>
        )}
      </div>

      {/* Opciones de respuesta */}
      {!typing && (
        <div>
          <div style={{ fontSize: 10.5, textTransform: "uppercase", letterSpacing: 1.2, color: C.textMute, marginBottom: 8, fontWeight: 700 }}>
            Responder
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 12 }}>
            {dmChoices[step]?.map((c, i) => (
              <button
                suppressHydrationWarning
                key={i}
                onClick={() => handleChoice(c)}
                style={{
                  padding: "14px 16px",
                  borderRadius: 14,
                  textAlign: "left",
                  background: C.white,
                  border: `1.5px solid ${C.line}`,
                  color: C.blueDark,
                  fontSize: 14,
                  fontWeight: 600,
                  lineHeight: 1.45,
                  cursor: "pointer",
                  transition: "background .18s ease, border-color .18s ease, color .18s ease, transform .18s ease, box-shadow .18s ease",
                  fontFamily: "inherit",
                  boxShadow: "0 4px 12px rgba(6,21,56,0.04)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = C.bgSoft;
                  e.currentTarget.style.borderColor = C.blue;
                  e.currentTarget.style.color = C.blue;
                  e.currentTarget.style.transform = "translateY(-1px)";
                  e.currentTarget.style.boxShadow = "0 8px 18px rgba(11,92,255,0.12)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = C.white;
                  e.currentTarget.style.borderColor = C.line;
                  e.currentTarget.style.color = C.blueDark;
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(6,21,56,0.04)";
                }}
              >
                {c.text}
              </button>
            ))}
          </div>

          {/* Input simulado */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 12px",
              background: C.bgSoft,
              border: `1px solid ${C.line}`,
              borderRadius: 999,
            }}
          >
            <Smile size={18} color={C.textSoft} strokeWidth={1.8} />
            <div style={{ flex: 1, fontSize: 13, color: C.textSoft, fontStyle: "italic" }}>Elegí una respuesta arriba…</div>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: C.lineSoft, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Send size={15} color={C.textSoft} strokeWidth={2} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   MÓDULO 2 — DETECTOR DE PERFILES
════════════════════════════════════════════════════════════ */
const profiles = [
  {
    id: "p1",
    username: "valeria.foto_oficial",
    name: "Valeria Moreno",
    bio: "Modelo 🌟 | Viajes y lifestyle | Trabajo con marcas | DMs abiertos para collabs",
    followers: "12.4K",
    following: "8",
    posts: "3",
    verified: false,
    accountAge: "Cuenta creada hace 2 semanas",
    avatar: "#E88",
    postCount: 3,
    redFlags: [
      "Cuenta con 12K seguidores pero solo 3 publicaciones",
      "Creada hace apenas 2 semanas",
      "Siguiendo solo 8 cuentas (ratio irreal)",
      "Bio llena de palabras de atracción",
      "Foto de perfil demasiado perfecta (posible imagen de IA o modelo de stock)",
    ],
    verdict: "falso",
    verdictLabel: "Perfil falso",
    verdictColor: "#FF8A95",
  },
  {
    id: "p2",
    username: "sofi_guzman_bsas",
    name: "Sofía Guzmán",
    bio: "Estudiante FADU | Música y diseño | Buenos Aires",
    followers: "342",
    following: "280",
    posts: "87",
    verified: false,
    accountAge: "Cuenta desde 2022",
    avatar: "#68A",
    postCount: 87,
    redFlags: [],
    verdict: "real",
    verdictLabel: "Perfil auténtico",
    verdictColor: "#A9DFBF",
  },
  {
    id: "p3",
    username: "martin_ok_gt",
    name: "Martín",
    bio: "Solo quiero conectar con gente buena onda. DM si querés hablar",
    followers: "1",
    following: "847",
    posts: "0",
    verified: false,
    accountAge: "Cuenta creada hace 3 días",
    avatar: "#777",
    postCount: 0,
    redFlags: [
      "Sin foto de perfil",
      "Cero publicaciones",
      "Siguiendo a 847 personas desde hace 3 días",
      "1 solo seguidor",
      "Bio vaga con invitación a chatear en privado",
    ],
    verdict: "falso",
    verdictLabel: "Perfil sospechoso",
    verdictColor: "#FFE08A",
  },
];

function ProfileDetectorModule({
  onComplete,
  onXp,
}: {
  onComplete: (pts: number) => void;
  onXp: (n: number) => void;
}) {
  const [idx, setIdx] = useState(0);
  const [pts, setPts] = useState(0);
  const [chosen, setChosen] = useState<string | null>(null);
  const [xpPop, setXpPop] = useState(0);
  const [phase, setPhase] = useState<"playing" | "result">("playing");
  const p = profiles[idx];
  
  const handleVerdict = (v: "real" | "falso" | "sospechoso") => {
    setChosen(v);
    const isCorrect =
      v === p.verdict || (v === "sospechoso" && p.verdict === "falso");
    const earned = isCorrect ? 40 : 0;
    if (earned > 0) {
      setPts((prev) => prev + earned);
      setXpPop(earned);
      onXp(earned);
    }
  };

  const handleNext = () => {
    setChosen(null);
    if (idx + 1 >= profiles.length) {
      setPhase("result");
      return;
    }
    setIdx((i) => i + 1);
  };

  if (phase === "result")
    return (
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            fontSize: "11px",
            textTransform: "uppercase",
            letterSpacing: "2px",
            color: ACCENT,
            marginBottom: "12px",
          }}
        >
          Recorrido completado
        </div>
        <h3
          style={{
            fontFamily: "'Space Grotesk',Inter,sans-serif",
            fontSize: "20px",
            color: "#FFF",
            marginBottom: "16px",
          }}
        >
          {pts} puntos
        </h3>
        <button
          suppressHydrationWarning
          onClick={() => onComplete(pts)}
          style={{
            padding: "14px 32px",
            borderRadius: "12px",
            background: ACCENT,
            color: "#FFF",
            border: "none",
            fontFamily: "'Space Grotesk',Inter,sans-serif",
            fontSize: "12px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          LISTO
        </button>
      </div>
    );
  return (
    <div>
      {xpPop > 0 && <XpPop amount={xpPop} onDone={() => setXpPop(0)} />}
      <ProgressBar
        label={`Perfil ${idx + 1} de ${profiles.length}`}
        current={idx + 1}
        max={profiles.length}
        color={ACCENT}
      />
      <div
        style={{
          background: "rgba(0,0,0,0.4)",
          borderRadius: "14px",
          border: "1px solid rgba(255,255,255,0.07)",
          marginBottom: "16px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "16px",
            display: "flex",
            gap: "14px",
            alignItems: "center",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <div
            style={{
              width: "54px",
              height: "54px",
              borderRadius: "50%",
              background: `linear-gradient(135deg,${p.avatar},${p.avatar}88)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "20px",
              fontWeight: "bold",
              color: "#FFF",
              border: `2px solid ${p.avatar}`,
              flexShrink: 0,
            }}
          >
            {p.name.charAt(0)}
          </div>
          <div style={{ flex: 1 }}>
            <div
              style={{ fontSize: "14px", fontWeight: "bold", color: "#FFF" }}
            >
              {p.username}
            </div>
            <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)" }}>
              {p.accountAge}
            </div>
          </div>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            textAlign: "center",
            padding: "12px 0",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          {[
            ["Publicaciones", p.posts],
            ["Seguidores", p.followers],
            ["Siguiendo", p.following],
          ].map(([label, val]) => (
            <div key={label}>
              <div
                style={{ fontSize: "16px", fontWeight: "bold", color: "#FFF" }}
              >
                {val}
              </div>
              <div
                style={{
                  fontSize: "10px",
                  color: "rgba(255,255,255,0.45)",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                {label}
              </div>
            </div>
          ))}
        </div>
        <div style={{ padding: "12px 16px" }}>
          <div
            style={{
              fontSize: "13px",
              fontWeight: "bold",
              color: "#FFF",
              marginBottom: "4px",
            }}
          >
            {p.name}
          </div>
          <div
            style={{
              fontSize: "12px",
              color: "rgba(255,255,255,0.7)",
              lineHeight: 1.5,
            }}
          >
            {p.bio}
          </div>
        </div>
      </div>
      {!chosen ? (
        <div>
          <div
            style={{
              fontSize: "11px",
              textTransform: "uppercase",
              letterSpacing: "1px",
              color: "rgba(255,255,255,0.4)",
              marginBottom: "10px",
            }}
          >
            ¿Cómo evaluás este perfil?
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            {[
              ["real", "Parece real", "#A9DFBF"],
              ["sospechoso", "Algo raro", "#FFE08A"],
              ["falso", "Es falso", "#FF8A95"],
            ].map(([val, label, color]) => (
              <button
                suppressHydrationWarning
                key={val}
                onClick={() => handleVerdict(val as any)}
                style={{
                  flex: 1,
                  padding: "12px 8px",
                  borderRadius: "10px",
                  background: "rgba(255,255,255,0.03)",
                  border: `1px solid ${color}33`,
                  color,
                  fontSize: "12px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = `${color}18`)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "rgba(255,255,255,0.03)")
                }
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div style={{ animation: "slideUpIn 0.4s ease" }}>
          <div
            style={{
              background:
                chosen === p.verdict ||
                (chosen === "sospechoso" && p.verdict === "falso")
                  ? "rgba(39,174,96,0.1)"
                  : "rgba(255,60,80,0.1)",
              border: `1px solid ${chosen === p.verdict || (chosen === "sospechoso" && p.verdict === "falso") ? "rgba(39,174,96,0.3)" : "rgba(255,60,80,0.3)"}`,
              borderRadius: "12px",
              padding: "14px",
              marginBottom: "12px",
            }}
          >
            <div
              style={{
                fontSize: "12px",
                fontWeight: "bold",
                color:
                  chosen === p.verdict ||
                  (chosen === "sospechoso" && p.verdict === "falso")
                    ? "#A9DFBF"
                    : "#FF8A95",
                marginBottom: "8px",
              }}
            >
              {chosen === p.verdict ||
              (chosen === "sospechoso" && p.verdict === "falso")
                ? "Correcto — "
                : "No exactamente — "}
              {p.verdictLabel}
            </div>
            {p.redFlags.length > 0 ? (
              <div>
                {p.redFlags.map((r, i) => (
                  <div
                    key={i}
                    style={{
                      fontSize: "12px",
                      color: "rgba(255,255,255,0.75)",
                      marginBottom: "5px",
                      paddingLeft: "10px",
                      borderLeft: "2px solid rgba(255,80,80,0.4)",
                      lineHeight: 1.4,
                    }}
                  >
                    {r}
                  </div>
                ))}
              </div>
            ) : (
              <p
                style={{
                  fontSize: "13px",
                  color: "rgba(255,255,255,0.7)",
                  margin: 0,
                  lineHeight: 1.5,
                }}
              >
                Este perfil muestra comportamiento auténtico.
              </p>
            )}
          </div>
          <button
            suppressHydrationWarning
            onClick={handleNext}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "10px",
              background: ACCENT,
              color: "#FFF",
              border: "none",
              fontFamily: "'Space Grotesk',Inter,sans-serif",
              fontSize: "11px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            {idx + 1 < profiles.length ? "SIGUIENTE PERFIL" : "VER RESULTADOS"}
          </button>
        </div>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   MÓDULO 3 — STORY PATH
════════════════════════════════════════════════════════════ */
type StoryNode = {
  id: string;
  text: string;
  tension?: number;
  options?: { text: string; next: string; safe: boolean; pts: number }[];
  isEnd?: boolean;
  endType?: "safe" | "risk" | "ideal" | "ambiguous";
  endMsg?: string;
};
const storyNodes: Record<string, StoryNode> = {
  start: {
    id: "start",
    tension: 1,
    text: 'Un chico que no conocés en persona empieza a comentar todos tus videos de TikTok. Sus comentarios son amables, inteligentes. Hoy te escribió por privado por primera vez: "Vi todos tus videos. Sos diferente a los demás. ¿Hablamos?"',
    options: [
      {
        text: "Le respondo, me parece inofensivo",
        next: "respond_yes",
        safe: false,
        pts: 0,
      },
      { text: "Lo ignoro por ahora", next: "ignore", safe: true, pts: 20 },
      {
        text: "Le digo que no conozco gente por redes",
        next: "respond_no",
        safe: true,
        pts: 30,
      },
    ],
  },
  respond_yes: {
    id: "respond_yes",
    tension: 2,
    text: 'Empiezan a hablar. Es agradable, parece entenderte. Después de unos días dice: "Con vos puedo hablar de cualquier cosa. Mis amigos no me entienden como vos." Y te pide que no le cuentes a nadie de su situación.',
    options: [
      {
        text: "Me parece normal, la gente tiene problemas",
        next: "trust_building",
        safe: false,
        pts: 0,
      },
      {
        text: "Ese pedido de secreto me incomoda",
        next: "notice_secret",
        safe: true,
        pts: 25,
      },
    ],
  },
  ignore: {
    id: "ignore",
    tension: 1,
    text: 'Decidís ignorarlo. Pero a los días te manda otro mensaje: "Sé que me leíste. No quería incomodarte. Solo quería decirte que tus videos me ayudaron mucho. Gracias." Ahora te genera dudas.',
    options: [
      {
        text: "Quizás fui demasiado fría, le contesto",
        next: "respond_yes",
        safe: false,
        pts: 0,
      },
      {
        text: "Mantengo la distancia, sin responder",
        next: "stay_safe",
        safe: true,
        pts: 40,
      },
    ],
  },
  respond_no: {
    id: "respond_no",
    tension: 1,
    text: 'Le decís que no solés hablar con gente que no conocés en persona. Responde: "Te entiendo, está bien. Pero a veces es más fácil hablar con alguien que no te juzga." Parece razonable.',
    options: [
      {
        text: "Tiene razón. Quizás está bien hablar",
        next: "respond_yes",
        safe: false,
        pts: 0,
      },
      {
        text: "Mantengo mi postura y lo reporto",
        next: "ideal_end",
        safe: true,
        pts: 60,
      },
    ],
  },
  trust_building: {
    id: "trust_building",
    tension: 3,
    text: 'Pasan semanas. La persona te dice que vos sos "su refugio". Un día pregunta: "¿Podemos pasar a WhatsApp? Acá me parece que alguien más lee los mensajes." La situación se siente rara, pero ya lo conocés bastante.',
    options: [
      {
        text: "Le doy mi número. Ya confío en él",
        next: "danger_end",
        safe: false,
        pts: 0,
      },
      {
        text: "Me niego. Algo no está bien",
        next: "late_realization",
        safe: true,
        pts: 20,
      },
    ],
  },
  notice_secret: {
    id: "notice_secret",
    tension: 2,
    text: "Identificás que el pedido de secreto es una señal rara. Decidís contarle a alguien de confianza lo que está pasando.",
    options: [
      {
        text: "Le cuento a un adulto de confianza",
        next: "ideal_end",
        safe: true,
        pts: 60,
      },
      {
        text: "Le cuento a mi mejor amiga pero no a un adulto",
        next: "ambiguous_end",
        safe: false,
        pts: 20,
      },
    ],
  },
  stay_safe: {
    id: "stay_safe",
    isEnd: true,
    endType: "safe",
    text: "",
    endMsg: "Mantuviste la distancia ante una situación ambigua. Eso requiere criterio.",
  },
  late_realization: {
    id: "late_realization",
    isEnd: true,
    endType: "ambiguous",
    text: "",
    endMsg: "Reconociste la señal, aunque tarde. El proceso de construcción de confianza fue gradual y funcionó un tiempo.",
  },
  ideal_end: {
    id: "ideal_end",
    isEnd: true,
    endType: "ideal",
    text: "",
    endMsg: "Detectaste señales desde el principio y actuaste. Este es el camino ideal.",
  },
  danger_end: {
    id: "danger_end",
    isEnd: true,
    endType: "risk",
    text: "",
    endMsg: "La persona fue creando una relación de dependencia emocional gradualmente. Esta situación requería haber pedido ayuda antes.",
  },
  ambiguous_end: {
    id: "ambiguous_end",
    isEnd: true,
    endType: "ambiguous",
    text: "",
    endMsg: "Contarle a una amiga es mejor que guardar silencio, pero un adulto de confianza tiene más herramientas.",
  },
};
const endColors: Record<string, string> = {
  ideal: "#A9DFBF",
  safe: "#74B3CE",
  ambiguous: "#FFE08A",
  risk: "#FF8A95",
};
const endLabels: Record<string, string> = {
  ideal: "Final ideal",
  safe: "Final seguro",
  ambiguous: "Final ambiguo",
  risk: "Final de riesgo",
};
const tensionColors: Record<number, string> = {
  1: "#A9DFBF",
  2: "#FFE08A",
  3: "#FF8A95",
};

function StoryPathModule({
  onComplete,
  onXp,
}: {
  onComplete: (pts: number) => void;
  onXp: (n: number) => void;
}) {
  const [nodeId, setNodeId] = useState("start");
  const [pts, setPts] = useState(0);
  const [history, setHistory] = useState<string[]>(["start"]);
  const [xpPop, setXpPop] = useState(0);
  const node = storyNodes[nodeId];
  
  const handleOption = (opt: {
    text: string;
    next: string;
    safe: boolean;
    pts: number;
  }) => {
    if (opt.pts > 0) {
      setPts((p) => p + opt.pts);
      setXpPop(opt.pts);
      onXp(opt.pts);
    }
    setHistory((h) => [...h, opt.next]);
    setNodeId(opt.next);
  };

  if (node.isEnd) {
    const type = node.endType!;
    return (
      <div style={{ textAlign: "center", animation: "slideUpIn 0.5s ease" }}>
        <div
          style={{
            display: "inline-block",
            padding: "6px 14px",
            borderRadius: "99px",
            background: `${endColors[type]}18`,
            border: `1px solid ${endColors[type]}40`,
            color: endColors[type],
            fontSize: "10px",
            fontWeight: "bold",
            textTransform: "uppercase",
            letterSpacing: "1px",
            marginBottom: "16px",
          }}
        >
          {endLabels[type]}
        </div>
        <p
          style={{
            fontSize: "14px",
            color: "rgba(255,255,255,0.85)",
            lineHeight: 1.7,
            maxWidth: "380px",
            margin: "0 auto 16px",
            textAlign: "left",
          }}
        >
          {node.endMsg}
        </p>
        <div
          style={{
            fontSize: "22px",
            fontWeight: "bold",
            color: "#FFF",
            marginBottom: "20px",
          }}
        >
          {pts} pts
        </div>
        <button
          suppressHydrationWarning
          onClick={() => onComplete(pts)}
          style={{
            padding: "14px 32px",
            borderRadius: "12px",
            background: ACCENT,
            color: "#FFF",
            border: "none",
            fontFamily: "'Space Grotesk',Inter,sans-serif",
            fontSize: "12px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          LISTO
        </button>
      </div>
    );
  }
  return (
    <div>
      {xpPop > 0 && <XpPop amount={xpPop} onDone={() => setXpPop(0)} />}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginBottom: "16px",
        }}
      >
        <div
          style={{
            fontSize: "10px",
            textTransform: "uppercase",
            letterSpacing: "1px",
            color: "rgba(255,255,255,0.4)",
          }}
        >
          Tensión
        </div>
        {[1, 2, 3].map((n) => (
          <div
            key={n}
            style={{
              width: "20px",
              height: "5px",
              borderRadius: "99px",
              background:
                n <= (node.tension ?? 1)
                  ? tensionColors[node.tension ?? 1]
                  : "rgba(255,255,255,0.1)",
              transition: "background 0.4s",
            }}
          />
        ))}
      </div>
      <div
        style={{
          background: "rgba(0,0,0,0.35)",
          borderRadius: "14px",
          border: "1px solid rgba(255,255,255,0.06)",
          padding: "18px",
          marginBottom: "16px",
        }}
      >
        <p
          style={{
            fontSize: "14px",
            color: "rgba(255,255,255,0.9)",
            lineHeight: 1.7,
            margin: 0,
          }}
        >
          {node.text}
        </p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <div
          style={{
            fontSize: "10px",
            textTransform: "uppercase",
            letterSpacing: "1px",
            color: "rgba(255,255,255,0.35)",
            marginBottom: "4px",
          }}
        >
          ¿Qué hacés?
        </div>
        {node.options?.map((opt, i) => (
          <button
            suppressHydrationWarning
            key={i}
            onClick={() => handleOption(opt)}
            style={{
              padding: "12px 15px",
              borderRadius: "10px",
              textAlign: "left",
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "rgba(255,255,255,0.85)",
              fontSize: "13px",
              lineHeight: 1.4,
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.borderColor = GLASS_BORDER)
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")
            }
          >
            {opt.text}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   MÓDULO 4 — RED FLAGS
════════════════════════════════════════════════════════════ */
const redFlagMessages = [
  {
    id: "rf1",
    text: '"No le cuentes esto a nadie, es solo entre nosotros."',
    isFlag: true,
    explanation: "Pedir secreto es una de las tácticas principales de aislamiento.",
  },
  {
    id: "rf2",
    text: '"¿En qué barrio vivís? Es para ver si estamos cerca."',
    isFlag: true,
    explanation: "Pedir ubicación a un desconocido es una señal de alarma directa.",
  },
  {
    id: "rf3",
    text: '"Vi la peli que recomendaste. Tenías razón, estuvo buena."',
    isFlag: false,
    explanation: "Un comentario sobre contenido compartido, sin información personal ni presión.",
  },
  {
    id: "rf4",
    text: '"Sos la única persona que me entiende de verdad. No sé qué haría sin vos."',
    isFlag: true,
    explanation: "Crear dependencia emocional intensa con un desconocido es manipulación.",
  },
  {
    id: "rf5",
    text: '"¿Podemos hablar por Telegram? Instagram me tiene bloqueado."',
    isFlag: true,
    explanation: "Querer salir de la plataforma elimina el rastro y el sistema de denuncia.",
  },
  {
    id: "rf6",
    text: '"¿Que música escuchas? Estoy armando una playlist."',
    isFlag: false,
    explanation: "Pregunta de preferencia casual sin intento de obtener datos personales.",
  },
];

function RedFlagsModule({
  onComplete,
  onXp,
}: {
  onComplete: (pts: number) => void;
  onXp: (n: number) => void;
}) {
  const [answered, setAnswered] = useState<Record<string, boolean | null>>({});
  const [feedback, setFeedback] = useState<
    Record<string, { correct: boolean; msg: string }>
  >({});
  const [pts, setPts] = useState(0);
  const [xpPop, setXpPop] = useState(0);
  const [phase, setPhase] = useState<"playing" | "result">("playing");
  
  const handleAnswer = (id: string, choice: boolean) => {
    if (answered[id] !== undefined) return;
    const msg_obj = redFlagMessages.find((m) => m.id === id)!;
    const correct = choice === msg_obj.isFlag;
    const earned = correct ? 25 : 0;
    setAnswered((prev) => ({ ...prev, [id]: choice }));
    setFeedback((prev) => ({
      ...prev,
      [id]: { correct, msg: msg_obj.explanation },
    }));
    if (earned > 0) {
      setPts((p) => p + earned);
      setXpPop(earned);
      onXp(earned);
    }
    if (Object.keys(answered).length + 1 >= redFlagMessages.length)
      setTimeout(() => setPhase("result"), 800);
  };

  if (phase === "result")
    return (
      <div style={{ textAlign: "center" }}>
        <h3
          style={{
            fontFamily: "'Space Grotesk',Inter,sans-serif",
            fontSize: "20px",
            color: "#FFF",
            marginBottom: "20px",
          }}
        >
          {pts} / {redFlagMessages.length * 25} pts
        </h3>
        <button
          suppressHydrationWarning
          onClick={() => onComplete(pts)}
          style={{
            padding: "14px 32px",
            borderRadius: "12px",
            background: ACCENT,
            color: "#FFF",
            border: "none",
            fontFamily: "'Space Grotesk',Inter,sans-serif",
            fontSize: "12px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          LISTO
        </button>
      </div>
    );
  return (
    <div>
      {xpPop > 0 && <XpPop amount={xpPop} onDone={() => setXpPop(0)} />}
      <ProgressBar
        label={`${Object.keys(answered).length} de ${redFlagMessages.length} analizados`}
        current={Object.keys(answered).length}
        max={redFlagMessages.length}
        color={ACCENT}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          maxHeight: "340px",
          overflowY: "auto",
          paddingRight: "4px",
        }}
      >
        {redFlagMessages.map((msg) => {
          const ans = answered[msg.id];
          const fb = feedback[msg.id];
          return (
            <div
              key={msg.id}
              style={{
                background:
                  ans !== undefined
                    ? fb?.correct
                      ? "rgba(39,174,96,0.08)"
                      : "rgba(255,60,80,0.08)"
                    : "rgba(0,0,0,0.3)",
                border: `1px solid ${ans !== undefined ? (fb?.correct ? "rgba(39,174,96,0.25)" : "rgba(255,60,80,0.25)") : "rgba(255,255,255,0.06)"}`,
                borderRadius: "12px",
                padding: "14px",
                transition: "all 0.3s",
              }}
            >
              <p
                style={{
                  fontSize: "13px",
                  color: "rgba(255,255,255,0.9)",
                  margin: "0 0 10px",
                  lineHeight: 1.5,
                  fontStyle: "italic",
                }}
              >
                {msg.text}
              </p>
              {ans === undefined ? (
                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    suppressHydrationWarning
                    onClick={() => handleAnswer(msg.id, true)}
                    style={{
                      flex: 1,
                      padding: "8px",
                      borderRadius: "8px",
                      background: "rgba(255,80,80,0.1)",
                      border: "1px solid rgba(255,80,80,0.2)",
                      color: "#FF8A95",
                      fontSize: "11px",
                      fontWeight: "bold",
                      cursor: "pointer",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    Me hace ruido
                  </button>
                  <button
                    suppressHydrationWarning
                    onClick={() => handleAnswer(msg.id, false)}
                    style={{
                      flex: 1,
                      padding: "8px",
                      borderRadius: "8px",
                      background: "rgba(116,179,206,0.1)",
                      border: "1px solid rgba(116,179,206,0.2)",
                      color: ACCENT,
                      fontSize: "11px",
                      fontWeight: "bold",
                      cursor: "pointer",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    Lo dejaría pasar
                  </button>
                </div>
              ) : (
                <div
                  style={{
                    fontSize: "12px",
                    color: fb?.correct ? "#A9DFBF" : "#FF8A95",
                    lineHeight: 1.5,
                  }}
                >
                  <span style={{ fontWeight: "bold" }}>
                    {fb?.correct ? "Correcto. " : "No exactamente. "}
                  </span>
                  {fb?.msg}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   MÓDULO 5 — SCREENSHOT
════════════════════════════════════════════════════════════ */
const screenshotChat = [
  {
    from: "them",
    text: "Hola, te sigo hace tiempo. Tus posts son muy buenos.",
  },
  {
    from: "them",
    text: "Estoy pasando por un momento complicado y algo tuyo me ayudó.",
  },
  {
    from: "them",
    text: "No le cuento esto a nadie, pero con vos me siento cómodo.",
  },
  { from: "them", text: "¿Podemos hablar más seguido? Sos especial." },
  {
    from: "them",
    text: "No deberías contarle esto a nadie, podría malentenderse.",
  },
];
const screenshotOptions = [
  {
    text: "Sigo hablando, parece genuino",
    correct: false,
    pts: 0,
    explanation: "La combinación de halago + secreto + urgencia emocional es un patrón de grooming.",
  },
  {
    text: "Lo bloqueo sin decirle nada",
    correct: false,
    pts: 15,
    explanation: "Bloquear es válido, pero no alcanza. Esta conversación merece ser reportada y comentada.",
  },
  {
    text: "Hago captura, reporto y se lo muestro a alguien de confianza",
    correct: true,
    pts: 70,
    explanation: "Perfecto. Guardar evidencia, reportar y pedir ayuda es la respuesta más completa.",
  },
  {
    text: "Le pregunto por qué pide tanto secreto",
    correct: false,
    pts: 10,
    explanation: "Confrontar al groomer raramente cambia la situación y puede aumentar la presión.",
  },
];

function ScreenshotModule({
  onComplete,
  onXp,
}: {
  onComplete: (pts: number) => void;
  onXp: (n: number) => void;
}) {
  const [chosen, setChosen] = useState<number | null>(null);
  const [xpPop, setXpPop] = useState(0);
  
  const handleChoice = (i: number) => {
    setChosen(i);
    const opt = screenshotOptions[i];
    if (opt.pts > 0) {
      setXpPop(opt.pts);
      onXp(opt.pts);
    }
  };

  return (
    <div>
      {xpPop > 0 && <XpPop amount={xpPop} onDone={() => setXpPop(0)} />}
      <div
        style={{
          background: "rgba(0,0,0,0.4)",
          borderRadius: "14px",
          border: "1px solid rgba(255,255,255,0.06)",
          padding: "14px",
          marginBottom: "16px",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            paddingBottom: "10px",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
            marginBottom: "4px",
          }}
        >
          <div
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "50%",
              background: "linear-gradient(135deg,#163A63,#5A99B4)",
              flexShrink: 0,
            }}
          />
          <span style={{ fontSize: "12px", fontWeight: "bold", color: "#FFF" }}>
            usuario_desconocido
          </span>
          <span
            style={{
              marginLeft: "auto",
              fontSize: "10px",
              color: "rgba(255,255,255,0.3)",
            }}
          >
            hace 20 min
          </span>
        </div>
        {screenshotChat.map((m, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              gap: "8px",
              alignItems: "flex-end",
              animation: `slideUpIn 0.3s ease ${i * 0.1}s both`,
            }}
          >
            <div
              style={{
                width: "22px",
                height: "22px",
                borderRadius: "50%",
                background: "linear-gradient(135deg,#163A63,#5A99B4)",
                flexShrink: 0,
              }}
            />
            <div
              style={{
                background: "rgba(116,179,206,0.09)",
                border: "1px solid rgba(116,179,206,0.1)",
                padding: "8px 12px",
                borderRadius: "14px 14px 14px 3px",
                fontSize: "12px",
                color: "#FFF",
                maxWidth: "85%",
                lineHeight: 1.5,
              }}
            >
              {m.text}
            </div>
          </div>
        ))}
      </div>
      {chosen === null ? (
        <div>
          <div
            style={{
              fontSize: "11px",
              textTransform: "uppercase",
              letterSpacing: "1px",
              color: "rgba(255,255,255,0.4)",
              marginBottom: "10px",
            }}
          >
            ¿Qué hacés?
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {screenshotOptions.map((opt, i) => (
              <button
                suppressHydrationWarning
                key={i}
                onClick={() => handleChoice(i)}
                style={{
                  padding: "12px 15px",
                  borderRadius: "10px",
                  textAlign: "left",
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "rgba(255,255,255,0.85)",
                  fontSize: "13px",
                  lineHeight: 1.4,
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.borderColor = GLASS_BORDER)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")
                }
              >
                {opt.text}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div style={{ animation: "slideUpIn 0.4s ease" }}>
          <FeedbackBox
            message={`${screenshotOptions[chosen].correct ? "Respuesta correcta." : "No es la mejor opción."} ${screenshotOptions[chosen].explanation}`}
            type={
              screenshotOptions[chosen].correct
                ? "success"
                : screenshotOptions[chosen].pts > 0
                  ? "warn"
                  : "danger"
            }
          />
          <button
            suppressHydrationWarning
            onClick={() => onComplete(screenshotOptions[chosen].pts)}
            style={{
              width: "100%",
              marginTop: "12px",
              padding: "14px",
              borderRadius: "12px",
              background: ACCENT,
              color: "#FFF",
              border: "none",
              fontFamily: "'Space Grotesk',Inter,sans-serif",
              fontSize: "12px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            LISTO
          </button>
        </div>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   COMPONENTES UI COMPARTIDOS DEL FEED
════════════════════════════════════════════════════════════ */
function Avatar({ src, size = 32 }: { src: string; size?: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        overflow: "hidden",
        flexShrink: 0,
        background: "#D8E3EC",
        boxShadow: "0 0 0 1px rgba(0,0,0,0.05)",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        width={size}
        height={size}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
        }}
      />
    </div>
  );
}

function PostActionBar({ initialLikes }: { initialLikes: number }) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [pulse, setPulse] = useState(false);
  const [count, setCount] = useState(initialLikes);
  
  const toggleLike = () => {
    const next = !liked;
    setLiked(next);
    setCount((c) => (next ? c + 1 : c - 1));
    setPulse(true);
    setTimeout(() => setPulse(false), 260);
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "6px 0 8px",
      }}
    >
      <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
        <button
          suppressHydrationWarning
          onClick={toggleLike}
          className={pulse ? "tap-bounce" : ""}
          aria-label={liked ? "Quitar me gusta" : "Me gusta"}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
            display: "flex",
            alignItems: "center",
            color: liked ? "#ed4956" : "#111",
            transition: "transform 0.15s cubic-bezier(0.175,0.885,0.32,1.275)",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.88)")}
          onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1.08)")}
        >
          <Heart
            size={23}
            fill={liked ? "#ed4956" : "none"}
            stroke={liked ? "#ed4956" : "currentColor"}
            strokeWidth={1.9}
          />
        </button>
        <button
          suppressHydrationWarning
          aria-label="Comentar"
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
            display: "flex",
            alignItems: "center",
            color: "#111",
            transition: "transform 0.15s",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.transform = "scale(1.08)")
          }
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          <MessageCircle size={23} strokeWidth={1.9} />
        </button>
        <button
          suppressHydrationWarning
          aria-label="Compartir"
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
            display: "flex",
            alignItems: "center",
            color: "#111",
            transition: "transform 0.15s",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.transform = "scale(1.08) rotate(-12deg)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.transform = "scale(1) rotate(0deg)")
          }
        >
          <Send size={23} strokeWidth={1.9} />
        </button>
      </div>
      <button
        suppressHydrationWarning
        onClick={() => setSaved((s) => !s)}
        aria-label={saved ? "Quitar guardado" : "Guardar"}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: 0,
          display: "flex",
          alignItems: "center",
          color: "#111",
          transition: "transform 0.15s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
      >
        <Bookmark size={23} fill={saved ? "#111" : "none"} strokeWidth={1.9} />
      </button>
    </div>
  );
}

function CommentInput() {
  const [val, setVal] = useState("");
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        borderTop: "1px solid #D8E3EC",
        paddingTop: "10px",
      }}
    >
      <Smile
        size={20}
        color="#8E8E8E"
        strokeWidth={1.5}
        style={{ flexShrink: 0 }}
      />
      <input
        suppressHydrationWarning
        type="text"
        value={val}
        onChange={(e) => setVal(e.target.value)}
        placeholder="Agregá un comentario…"
        style={{
          flex: 1,
          border: "none",
          outline: "none",
          fontSize: "14px",
          color: "#262626",
          background: "transparent",
        }}
      />
      {val.length > 0 ? (
        <button
          suppressHydrationWarning
          onClick={() => setVal("")}
          style={{
            color: ACCENT_DIM,
            fontWeight: 700,
            fontSize: "14px",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
          }}
        >
          Publicar
        </button>
      ) : (
        <span
          style={{
            color: "#9AA8B7",
            fontWeight: 600,
            fontSize: "14px",
            cursor: "default",
          }}
        >
          Publicar
        </span>
      )}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   STORY VIEWER MODAL
──────────────────────────────────────────────────────────── */
function StoryViewer({
  stories,
  startIndex,
  onClose,
  seenSet,
  onSeen,
}: {
  stories: StoryData[];
  startIndex: number;
  onClose: () => void;
  seenSet: Set<number>;
  onSeen: (i: number) => void;
}) {
  const [storyIndex, setStoryIndex] = useState(startIndex);
  const [slideIndex, setSlideIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const DURATION = 5000;

  const story = stories[storyIndex];
  const slide = story?.slides[slideIndex];
  const totalSlides = story?.slides.length || 0;

  const goNext = useCallback(() => {
    if (slideIndex < totalSlides - 1) {
      setSlideIndex(slideIndex + 1);
      setProgress(0);
    } else if (storyIndex < stories.length - 1) {
      onSeen(storyIndex);
      setStoryIndex(storyIndex + 1);
      setSlideIndex(0);
      setProgress(0);
    } else {
      onSeen(storyIndex);
      onClose();
    }
  }, [slideIndex, totalSlides, storyIndex, stories.length, onClose, onSeen]);

  const goPrev = useCallback(() => {
    if (slideIndex > 0) {
      setSlideIndex(slideIndex - 1);
      setProgress(0);
    } else if (storyIndex > 0) {
      const prevIdx = storyIndex - 1;
      setStoryIndex(prevIdx);
      setSlideIndex(stories[prevIdx].slides.length - 1);
      setProgress(0);
    }
  }, [slideIndex, storyIndex, stories]);

  useEffect(() => {
    onSeen(storyIndex);
  }, [storyIndex, onSeen]);

  useEffect(() => {
    setProgress(0);
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (paused) return;
    const step = 100 / (DURATION / 50);
    intervalRef.current = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          goNext();
          return 0;
        }
        return p + step;
      });
    }, 50);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [slideIndex, storyIndex, paused, goNext]);

  useEffect(() => {
    if (!story || !slide) {
      onClose();
    }
  }, [story, slide, onClose]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { e.preventDefault(); onClose(); }
      else if (e.key === "ArrowRight") goNext();
      else if (e.key === "ArrowLeft") goPrev();
    };
    document.addEventListener("keydown", handleKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose, goNext, goPrev]);

  if (!story || !slide) return null;

  const user = USERS[story.user];

  return (
    <div
      className="story-overlay"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <button
        type="button"
        className="story-close-btn"
        aria-label="Cerrar historia"
        onClick={(e) => { e.stopPropagation(); onClose(); }}
      >
        <X size={22} strokeWidth={2.2} />
      </button>
      <div
        className="story-viewer"
        onClick={(e) => e.stopPropagation()}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={slide.imageSrc}
          alt={slide.imageAlt}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            zIndex: 0,
          }}
        />

        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.2) 100%)",
            zIndex: 1,
          }}
        />

        <div
          style={{
            position: "absolute",
            top: 14,
            left: 12,
            right: 12,
            display: "flex",
            gap: 4,
            zIndex: 10,
          }}
        >
          {story.slides.map((_, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                height: 3,
                background: "rgba(255,255,255,0.3)",
                borderRadius: 99,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  background: "#FFF",
                  borderRadius: 99,
                  width:
                    i < slideIndex
                      ? "100%"
                      : i === slideIndex
                        ? `${progress}%`
                        : "0%",
                  transition: i === slideIndex ? "none" : "none",
                }}
              />
            </div>
          ))}
        </div>

        <div
          style={{
            position: "absolute",
            top: 30,
            left: 16,
            right: 16,
            display: "flex",
            alignItems: "center",
            gap: 10,
            zIndex: 10,
          }}
        >
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: "50%",
              border: "2px solid #FFFFFF",
              overflow: "hidden",
              flexShrink: 0,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={user.avatar}
              alt={user.handle}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#FFF", textShadow: "0 1px 3px rgba(0,0,0,0.5)" }}>
              {user.handle}
            </div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.8)", textShadow: "0 1px 3px rgba(0,0,0,0.5)" }}>
              hace 2 h
            </div>
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            padding: "80px 24px 40px",
            textAlign: "left",
            zIndex: 10,
          }}
        >
          <div
            style={{
              display: "inline-block",
              alignSelf: "flex-start",
              padding: "6px 12px",
              borderRadius: 6,
              background: slide.tagColor,
              color: "#111",
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: 0.5,
              textTransform: "uppercase",
              marginBottom: 16,
              animation: "slideUpIn 0.4s ease 0.05s both",
            }}
          >
            {slide.tag}
          </div>
          <div
            style={{
              fontSize: 26,
              fontWeight: 800,
              color: "#FFF",
              lineHeight: 1.2,
              marginBottom: 12,
              animation: "slideUpIn 0.4s ease 0.1s both",
            }}
          >
            {slide.title}
          </div>
          <div
            style={{
              fontSize: 16,
              color: "rgba(255,255,255,0.9)",
              lineHeight: 1.5,
              animation: "slideUpIn 0.4s ease 0.15s both",
              maxWidth: 320,
            }}
          >
            {slide.body}
          </div>
        </div>

        <button
          suppressHydrationWarning
          type="button"
          className="story-tap-zone story-tap-left"
          aria-label="Slide anterior"
          onClick={goPrev}
          onMouseDown={() => setPaused(true)}
          onMouseUp={() => setPaused(false)}
          onTouchStart={() => setPaused(true)}
          onTouchEnd={() => setPaused(false)}
        />
        <button
          suppressHydrationWarning
          type="button"
          className="story-tap-zone story-tap-right"
          aria-label="Slide siguiente"
          onClick={goNext}
          onMouseDown={() => setPaused(true)}
          onMouseUp={() => setPaused(false)}
          onTouchStart={() => setPaused(true)}
          onTouchEnd={() => setPaused(false)}
        />

        <button
          suppressHydrationWarning
          type="button"
          className="story-nav-btn story-nav-prev"
          aria-label="Story anterior"
          onClick={goPrev}
          style={{ visibility: storyIndex > 0 || slideIndex > 0 ? "visible" : "hidden" }}
        >
          <ChevronLeft size={20} strokeWidth={2.2} />
        </button>
        <button
          suppressHydrationWarning
          type="button"
          className="story-nav-btn story-nav-next"
          aria-label="Story siguiente"
          onClick={goNext}
        >
          <ChevronRight size={20} strokeWidth={2.2} />
        </button>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   DM INBOX
──────────────────────────────────────────────────────────── */
function DmInbox({
  onOpenStranger,
  onClose,
}: {
  onOpenStranger: () => void;
  onClose: () => void;
}) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 300,
        background: "#FFF",
        display: "flex",
        flexDirection: "column",
        animation: "slideInFromRight 0.28s cubic-bezier(0.4,0,0.2,1)",
        maxWidth: 480,
        marginLeft: "auto",
        boxShadow: "-8px 0 40px rgba(0,0,0,0.12)",
      }}
    >
      <div
        style={{
          padding: "16px 16px 12px",
          borderBottom: "1px solid #D8E3EC",
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <button
          suppressHydrationWarning
          onClick={onClose}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 4,
            display: "flex",
            color: "#061538",
          }}
        >
          <ArrowLeft size={22} strokeWidth={2} />
        </button>
        <div style={{ fontSize: 16, fontWeight: 700, color: "#061538" }}>
          Mensajes
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 16 }}>
          <button
            suppressHydrationWarning
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              display: "flex",
              color: "#061538",
            }}
          >
            <Search size={22} strokeWidth={1.8} />
          </button>
        </div>
      </div>

      <div style={{ padding: "10px 16px" }}>
        <div
          style={{
            background: "#EEF6FB",
            border: "1px solid #D8E3EC",
            borderRadius: 10,
            padding: "10px 14px",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <Search size={16} color="#5B6B7A" strokeWidth={2} />
          <span style={{ fontSize: 14, color: "#5B6B7A" }}>Buscar</span>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto" }}>
        {DM_CONVERSATIONS.map((conv) => (
          <div
            key={conv.id}
            onClick={conv.isStranger ? onOpenStranger : undefined}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              padding: "12px 16px",
              cursor: conv.isStranger ? "pointer" : "default",
              borderBottom: "1px solid #FAFAFA",
              transition: "background 0.15s",
              background: conv.isStranger ? "rgba(116,179,206,0.04)" : "#FFF",
            }}
            onMouseEnter={(e) => {
              if (conv.isStranger)
                (e.currentTarget as HTMLDivElement).style.background =
                  "rgba(116,179,206,0.08)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.background =
                conv.isStranger ? "rgba(116,179,206,0.04)" : "#FFF";
            }}
          >
            <div style={{ position: "relative", flexShrink: 0 }}>
              {conv.avatar ? (
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: "50%",
                    overflow: "hidden",
                    border: conv.isStranger
                      ? "2px solid #E94E5D"
                      : "2px solid transparent",
                    boxShadow: conv.isStranger
                      ? "0 0 0 3px rgba(233,78,93,0.12)"
                      : "none",
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={conv.avatar}
                    alt=""
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>
              ) : (
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg,#102A43,#74B3CE)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 20,
                    fontWeight: 700,
                    color: "#FFF",
                    border: "2px solid #E94E5D",
                  }}
                >
                  {conv.name.charAt(0).toUpperCase()}
                </div>
              )}
              {conv.unread > 0 && (
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    width: 18,
                    height: 18,
                    borderRadius: "50%",
                    background: "#E94E5D",
                    border: "2px solid #FFFFFF",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 10,
                    fontWeight: 700,
                    color: "#FFF",
                  }}
                >
                  {conv.unread}
                </div>
              )}
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 3,
                }}
              >
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: conv.unread > 0 ? 700 : 600,
                    color: "#061538",
                  }}
                >
                  {conv.name}
                </span>
                <span style={{ fontSize: 12, color: "#7C8A99" }}>
                  {conv.time}
                </span>
              </div>
              <div
                style={{
                  fontSize: 13,
                  color: conv.unread > 0 ? "#061538" : "#7C8A99",
                  fontWeight: conv.unread > 0 ? 500 : 400,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {conv.preview}
              </div>
              {conv.isStranger && (
                <div
                  style={{
                    marginTop: 4,
                    fontSize: 11,
                    color: "#E94E5D",
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    letterSpacing: 0.2,
                  }}
                >
                  <AlertTriangle size={11} strokeWidth={2.5} />
                  Solicitud de mensaje
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   DM CHAT VIEW
──────────────────────────────────────────────────────────── */
function DmChatView({
  onComplete,
  onXp,
  onBack,
}: {
  onComplete: (pts: number) => void;
  onXp: (n: number) => void;
  onBack: () => void;
}) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 400,
        background: "#FFF",
        display: "flex",
        flexDirection: "column",
        animation: "slideInFromRight 0.28s cubic-bezier(0.4,0,0.2,1)",
        maxWidth: 480,
        marginLeft: "auto",
        boxShadow: "-8px 0 40px rgba(0,0,0,0.12)",
      }}
    >
      <div
        style={{
          padding: "12px 16px",
          borderBottom: "1px solid #D8E3EC",
          display: "flex",
          alignItems: "center",
          gap: 12,
          background: "#FFF",
        }}
      >
        <button
          suppressHydrationWarning
          onClick={onBack}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 4,
            display: "flex",
            color: "#061538",
          }}
        >
          <ArrowLeft size={22} strokeWidth={2} />
        </button>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            overflow: "hidden",
            flexShrink: 0,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="https://i.pravatar.cc/150?img=11" alt="nicoo.raw" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#061538" }}>
            nicoo.raw
          </div>
          <div
            style={{
              fontSize: 12,
              color: "#5B6B7A",
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            <div
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: "#22C55E",
                boxShadow: "0 0 5px rgba(34,197,94,0.5)",
              }}
            />
            Activo ahora
          </div>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 12 }}>
          <button
            suppressHydrationWarning
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              display: "flex",
              color: "#061538",
            }}
          >
            <MoreHorizontal size={22} strokeWidth={1.8} />
          </button>
        </div>
      </div>

      <div
        style={{
          background: "#FBE5E8",
          borderBottom: "1px solid rgba(233,78,93,0.18)",
          padding: "10px 16px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: 12,
            color: "#E94E5D",
            fontWeight: 700,
            marginBottom: 2,
            letterSpacing: 0.2,
          }}
        >
          Este usuario no te sigue
        </div>
        <div style={{ fontSize: 11, color: "#7C8A99" }}>
          Respondé solo si te sentís cómodo.
        </div>
      </div>

      <div
        className="module-inner"
        style={{
          flex: 1,
          overflowY: "auto",
          background: C.bgSoft,
          padding: "20px 16px",
          border: "none",
          borderRadius: 0,
          maxWidth: "none",
          maxHeight: "none",
          boxShadow: "none",
          animation: "none",
        }}
      >
        <DmSimModule
          onComplete={(pts) => onComplete(pts)}
          onXp={onXp}
        />
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   REQUESTS VIEW — NUEVO (Módulo Solicitudes)
──────────────────────────────────────────────────────────── */
function RequestsView({
  onClose,
  onComplete,
  onXp,
  onAction,
}: {
  onClose: () => void;
  onComplete: (pts: number) => void;
  onXp: (n: number) => void;
  onAction: () => void;
}) {
  const [handled, setHandled] = useState<Record<string, { choice: string; isCorrect: boolean; msg: string }>>({});
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [reviewed, setReviewed] = useState<Record<string, boolean>>({});
  const [totalPoints, setTotalPoints] = useState(0);
  const [xpPop, setXpPop] = useState(0);

  const handleScoreXp = (amount: number) => {
    if (amount > 0) {
      setXpPop(amount);
      onXp(amount);
      setTotalPoints((prev) => prev + amount);
    }
  };

  const handleReview = (id: string) => {
    if (reviewed[id]) {
      setExpanded((p) => ({ ...p, [id]: !p[id] }));
      return;
    }
    
    setExpanded((p) => ({ ...p, [id]: true }));
    setReviewed((p) => ({ ...p, [id]: true }));
    
    const profile = REQUEST_PROFILES.find((p) => p.id === id);
    if (profile && profile.type !== "real") {
      handleScoreXp(15);
    }
  };

  const handleDecision = (id: string, action: "accept" | "reject") => {
    if (handled[id]) return;
    const profile = REQUEST_PROFILES.find((p) => p.id === id);
    if (!profile) return;

    let earned = 0;
    let isCorrect = false;
    let msg = profile.feedback;

    if (profile.type === "real") {
      if (action === "accept") {
        earned = 25;
        isCorrect = true;
      } else if (action === "reject") {
        earned = 5;
        isCorrect = true; 
      }
    } else {
      if (action === "accept") {
        earned = 0;
        isCorrect = false;
      } else if (action === "reject") {
        earned = reviewed[id] ? 10 : 25; 
        isCorrect = true;
      }
    }

    handleScoreXp(earned);
    setHandled((prev) => ({ ...prev, [id]: { choice: action, isCorrect, msg } }));
    onAction();
  };

  const completedCount = Object.keys(handled).length;
  const isFinished = completedCount === REQUEST_PROFILES.length;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 400,
        background: "#F8FAFC",
        display: "flex",
        flexDirection: "column",
        animation: "slideInFromRight 0.28s cubic-bezier(0.4,0,0.2,1)",
        maxWidth: 480,
        marginLeft: "auto",
        boxShadow: "-8px 0 40px rgba(0,0,0,0.12)",
      }}
    >
      {xpPop > 0 && <XpPop amount={xpPop} onDone={() => setXpPop(0)} />}

      <div
        style={{
          padding: "16px",
          borderBottom: "1px solid #D8E3EC",
          display: "flex",
          alignItems: "center",
          gap: 12,
          background: "#FFF",
        }}
      >
        <button
          suppressHydrationWarning
          onClick={onClose}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 4,
            display: "flex",
            color: "#061538",
          }}
        >
          <ArrowLeft size={22} strokeWidth={2} />
        </button>
        <div style={{ fontSize: 16, fontWeight: 700, color: "#061538" }}>
          Solicitudes
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "20px 16px" }}>
        {!isFinished && (
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#061538", letterSpacing: -0.2 }}>
              {REQUEST_PROFILES.length - completedCount} solicitudes pendientes
            </div>
            <div style={{ fontSize: 13, color: "#5B6B7A", marginTop: 4 }}>
              Cuentas que solicitaron seguirte.
            </div>
          </div>
        )}

        {isFinished ? (
          <div
            style={{
              background: "#FFF",
              border: "1px solid #D8E3EC",
              borderRadius: 14,
              padding: "32px 24px",
              textAlign: "center",
              animation: "slideUpIn 0.4s ease",
              marginTop: 20,
              boxShadow: "0 12px 32px rgba(6,21,56,0.06)",
            }}
          >
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                background: "rgba(116,179,206,0.14)",
                border: "1px solid rgba(116,179,206,0.28)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px",
              }}
            >
              <Check size={32} color={ACCENT} strokeWidth={2.5} />
            </div>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#061538", marginBottom: 8 }}>
              Revisión completada
            </div>
            <div style={{ fontSize: 14, color: "#102A43", marginBottom: 16, fontWeight: 500 }}>
              Detectaste {Object.values(handled).filter((h) => h.isCorrect).length} de {REQUEST_PROFILES.length} perfiles correctamente.
            </div>
            <p style={{ fontSize: 13, color: "#5B6B7A", lineHeight: 1.6, marginBottom: 24 }}>
              Revisar antes de aceptar también es una forma de cuidarte. En redes sociales, una solicitud puede ser el primer contacto de una situación de riesgo.
            </p>
            <button
              suppressHydrationWarning
              onClick={() => onComplete(totalPoints)}
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: 10,
                background: "#0B5CFF",
                color: "#FFF",
                border: "none",
                fontWeight: 700,
                fontSize: 14,
                cursor: "pointer",
                boxShadow: "0 8px 20px rgba(116,179,206,0.32)",
                letterSpacing: 0.2,
              }}
            >
              Volver al feed
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {REQUEST_PROFILES.map((p) => {
              const isHandled = handled[p.id];
              return (
                <div
                  key={p.id}
                  style={{
                    background: "#FFF",
                    border: "1px solid #D8E3EC",
                    borderRadius: 14,
                    padding: "16px",
                    animation: "fadeIn 0.3s ease",
                    boxShadow: "0 8px 22px rgba(6,21,56,0.04)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 12 }}>
                    <div style={{ width: 48, height: 48, borderRadius: "50%", overflow: "hidden", flexShrink: 0, border: "1px solid #D8E3EC" }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p.avatar} alt={p.username} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: 14, color: "#061538", display: "flex", justifyContent: "space-between" }}>
                        <span>{p.username}</span>
                      </div>
                      <div style={{ fontSize: 13, color: "#5B6B7A" }}>{p.name}</div>
                      <div style={{ fontSize: 13, color: "#102A43", marginTop: 4, lineHeight: 1.4 }}>{p.bio}</div>
                      <div style={{ fontSize: 12, color: "#7C8A99", marginTop: 6 }}>
                        {p.mutual > 0 && p.followedBy
                          ? `Seguido por ${p.followedBy} y ${p.mutual} personas más`
                          : "Sin seguidores en común"}
                      </div>
                    </div>
                  </div>

                  {/* Red social stats minimal */}
                  <div style={{ display: "flex", gap: 16, fontSize: 12, color: "#5B6B7A", marginBottom: 12, paddingBottom: 12, borderBottom: "1px solid #EEF2F7" }}>
                    <div><span style={{ fontWeight: 700, color: "#061538" }}>{p.followers}</span> seg.</div>
                    <div><span style={{ fontWeight: 700, color: "#061538" }}>{p.posts}</span> posts</div>
                  </div>

                  {expanded[p.id] && (
                    <div style={{ background: "#F8FAFC", border: "1px solid #EEF2F7", padding: "12px", borderRadius: 10, fontSize: 12, color: "#5B6B7A", marginBottom: 16, lineHeight: 1.5 }}>
                      <div style={{ marginBottom: 6 }}>
                        <span style={{ fontWeight: 700, color: "#061538" }}>En Instagram desde:</span> {p.age}
                      </div>
                      <div>
                        <span style={{ fontWeight: 700, color: "#061538" }}>Actividad:</span> {p.activity}
                      </div>
                    </div>
                  )}

                  {!isHandled ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button
                          suppressHydrationWarning
                          onClick={() => handleDecision(p.id, "accept")}
                          style={{
                            flex: 1,
                            padding: "10px 0",
                            borderRadius: 10,
                            background: "#0B5CFF",
                            color: "#FFF",
                            border: "none",
                            fontWeight: 700,
                            fontSize: 13,
                            cursor: "pointer",
                            boxShadow: "0 4px 12px rgba(116,179,206,0.28)",
                          }}
                        >
                          Aceptar
                        </button>
                        <button
                          suppressHydrationWarning
                          onClick={() => handleDecision(p.id, "reject")}
                          style={{
                            flex: 1,
                            padding: "10px 0",
                            borderRadius: 10,
                            background: "#EEF6FB",
                            color: "#061538",
                            border: "1px solid #D8E3EC",
                            fontWeight: 700,
                            fontSize: 13,
                            cursor: "pointer",
                          }}
                        >
                          Rechazar
                        </button>
                      </div>
                      <button
                        suppressHydrationWarning
                        onClick={() => handleReview(p.id)}
                        className="sf-btn sf-btn-ghost"
                        style={{ width: "100%", borderRadius: 10, padding: "10px 0", fontSize: 13 }}
                      >
                        {expanded[p.id] ? "Ocultar detalles" : "Revisar más"}
                      </button>
                    </div>
                  ) : (
                    <div
                      style={{
                        padding: "12px 14px",
                        background: isHandled.isCorrect ? "rgba(34,197,94,0.08)" : "rgba(233,78,93,0.08)",
                        borderLeft: `3px solid ${isHandled.isCorrect ? "#22C55E" : "#E94E5D"}`,
                        borderRadius: "0 10px 10px 0",
                        fontSize: 12,
                        color: "#102A43",
                        lineHeight: 1.5,
                        animation: "slideUpIn 0.3s ease",
                      }}
                    >
                      <span style={{ fontWeight: 700, color: isHandled.isCorrect ? "#15803D" : "#E94E5D", display: "block", marginBottom: 2, letterSpacing: 0.2 }}>
                        {isHandled.choice === "accept" ? "Aceptado" : "Rechazado"}
                      </span>
                      {isHandled.msg}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   POST ONG (groomingargentina)
──────────────────────────────────────────────────────────── */
function OngPost({
  time,
  imgSrc,
  imgAlt,
  likeCount,
  likedBy,
  caption,
  comments,
  timestamp,
  source = "groomingargentina",
}: {
  time: string;
  imgSrc: string;
  imgAlt: string;
  likeCount: number;
  likedBy: string;
  caption: React.ReactNode;
  comments: { user: string; text: string }[];
  timestamp: string;
  source?: SourceKey;
}) {
  const profile = SOURCE_PROFILES[source];
  return (
    <article className="ig-post">
      <div className="ig-post-header">
        <SourceAvatar sourceKey={source} size={32} />
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <span className="ig-post-username">{profile.username}</span>
            {profile.verified && (
              <BadgeCheck
                size={14}
                color="#0095f6"
                fill="rgba(0,149,246,0.1)"
                strokeWidth={2.5}
              />
            )}
            <span style={{ color: "#5B6B7A", fontSize: 14, margin: "0 3px" }}>•</span>
            <span style={{ color: ACCENT_DIM, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
              Seguir
            </span>
          </div>
          <div className="ig-post-sublabel">{profile.subtitle} · {time}</div>
        </div>
        <MoreHorizontal size={20} color="#061538" style={{ cursor: "pointer" }} />
      </div>
      <div
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "1/1",
          background: "#F8FAFC",
        }}
      >
        <Image
          src={imgSrc}
          alt={imgAlt}
          fill
          style={{ objectFit: "cover" }}
          sizes="(max-width:768px) 100vw, 470px"
        />
      </div>
      <div className="ig-post-footer">
        <PostActionBar initialLikes={likeCount} />
        <div
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: "#061538",
            marginBottom: 5,
          }}
        >
          {likeCount.toLocaleString("es-AR")} Me gusta
        </div>
        <div className="ig-post-caption">{caption}</div>
        {comments.length > 0 && (
          <div className="ig-post-see-comments">
            Ver los {comments.length} comentarios
          </div>
        )}
        {comments.map((c, i) => (
          <div key={i} className="ig-post-comment-preview">
            <b>{c.user}</b>
            {c.text}
          </div>
        ))}
        <div className="ig-post-timestamp">{timestamp}</div>
        <CommentInput />
      </div>
    </article>
  );
}

/* ────────────────────────────────────────────────────────────
   AVATAR DE FUENTE EXTERNA — logo con fallback de iniciales
──────────────────────────────────────────────────────────── */
function SourceAvatar({ sourceKey, size = 32 }: { sourceKey: SourceKey; size?: number }) {
  const profile = SOURCE_PROFILES[sourceKey];
  const [imgError, setImgError] = useState(false);

  if (!imgError) {
    return (
      <div
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          overflow: "hidden",
          flexShrink: 0,
          position: "relative",
          background: C.lineSoft,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={profile.avatarSrc}
          alt={profile.avatarAlt}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          onError={() => setImgError(true)}
        />
      </div>
    );
  }

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        flexShrink: 0,
        background: `linear-gradient(135deg,${C.blue} 0%,${C.blueDark} 100%)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: profile.avatarFallback.length > 1 ? 10 : 13,
        fontWeight: 800,
        color: "#FFF",
        letterSpacing: 0.5,
        border: `2px solid ${C.line}`,
      }}
    >
      {profile.avatarFallback}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   POST ONG con REEL embebido (Instagram)
──────────────────────────────────────────────────────────── */
function OngReelPost({
  time,
  reelUrl,
  reelEmbedUrl,
  reelTitle,
  likeCount,
  caption,
  comments,
  timestamp,
  fallbackText = "Si el reel no carga, podés verlo en Instagram.",
  fallbackCta = "Ver reel",
  source = "groomingargentina",
}: {
  time: string;
  reelUrl: string;
  reelEmbedUrl: string;
  reelTitle: string;
  likeCount: number;
  caption: React.ReactNode;
  comments: { user: string; text: string }[];
  timestamp: string;
  fallbackText?: string;
  fallbackCta?: string;
  source?: SourceKey;
}) {
  const profile = SOURCE_PROFILES[source];

  return (
    <article className="ig-post">
      <div className="ig-post-header">
        <SourceAvatar sourceKey={source} size={32} />
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <span className="ig-post-username">{profile.username}</span>
            {profile.verified && (
              <BadgeCheck
                size={14}
                color="#0095f6"
                fill="rgba(0,149,246,0.1)"
                strokeWidth={2.5}
              />
            )}
            <span style={{ color: "#5B6B7A", fontSize: 14, margin: "0 3px" }}>•</span>
            <span style={{ color: ACCENT_DIM, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Seguir</span>
          </div>
          <div className="ig-post-sublabel">{profile.subtitle} · {time}</div>
        </div>
        <MoreHorizontal size={20} color="#061538" style={{ cursor: "pointer" }} />
      </div>

      <div className="reel-embed-shell">
        <iframe
          src={reelEmbedUrl}
          title={reelTitle}
          loading="lazy"
          allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>

      <div className="reel-embed-fallback">
        <span>{fallbackText}</span>
        <a
          href={reelUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="sf-btn sf-btn-primary"
          style={{ fontSize: 12, padding: "8px 16px" }}
        >
          {fallbackCta}
        </a>
      </div>

      <div className="ig-post-footer">
        <PostActionBar initialLikes={likeCount} />
        <div style={{ fontSize: 14, fontWeight: 600, color: "#061538", marginBottom: 5 }}>
          {likeCount.toLocaleString("es-AR")} Me gusta
        </div>
        <div className="ig-post-caption">{caption}</div>
        {comments.length > 0 && (
          <div className="ig-post-see-comments">Ver los {comments.length} comentarios</div>
        )}
        {comments.map((c, i) => (
          <div key={i} className="ig-post-comment-preview">
            <b>{c.user}</b>
            {c.text}
          </div>
        ))}
        <div className="ig-post-timestamp">{timestamp}</div>
        <CommentInput />
      </div>
    </article>
  );
}

/* ────────────────────────────────────────────────────────────
   POST VIDEO / REEL
──────────────────────────────────────────────────────────── */
function ReelPost({
  user,
  time,
  videoId,
  caption,
  likeCount,
  comments,
  timestamp,
  externalSource,
}: {
  user: keyof typeof USERS;
  time: string;
  videoId: string;
  caption: React.ReactNode;
  likeCount: number;
  comments: { user: string; text: string }[];
  timestamp: string;
  externalSource?: SourceKey;
}) {
  const u = USERS[user];
  const profile = externalSource ? SOURCE_PROFILES[externalSource] : null;

  return (
    <article className="ig-post">
      <div className="ig-post-header">
        {profile ? (
          <SourceAvatar sourceKey={externalSource!} size={32} />
        ) : (
          <Avatar src={u.avatar} size={32} />
        )}
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <span className="ig-post-username">{profile ? profile.username : u.handle}</span>
            {profile?.verified && (
              <BadgeCheck size={14} color="#0095f6" fill="rgba(0,149,246,0.1)" strokeWidth={2.5} />
            )}
          </div>
          <div className="ig-post-sublabel">{profile ? `${profile.subtitle} · ${time}` : time}</div>
        </div>
        <MoreHorizontal size={20} color="#061538" style={{ cursor: "pointer" }} />
      </div>

      <div className="ig-reel-frame">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&playsinline=1`}
          title="Video corto SAFENET"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>

      <div className="ig-post-footer">
        <PostActionBar initialLikes={likeCount} />
        <div
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: "#061538",
            marginBottom: 5,
          }}
        >
          {likeCount.toLocaleString("es-AR")} Me gusta
        </div>
        <div className="ig-post-caption">{caption}</div>
        {comments.length > 0 && (
          <div className="ig-post-see-comments">
            Ver los {comments.length} comentarios
          </div>
        )}
        {comments.map((c, i) => (
          <div key={i} className="ig-post-comment-preview">
            <b>{c.user}</b>
            {c.text}
          </div>
        ))}
        <div className="ig-post-timestamp">{timestamp}</div>
        <CommentInput />
      </div>
    </article>
  );
}

/* ────────────────────────────────────────────────────────────
   POST INTERACTIVO DE DECISIÓN RÁPIDA
──────────────────────────────────────────────────────────── */
function DecisionPost({
  user,
  time,
  question,
  context,
  optA,
  optB,
  explanation,
}: {
  user: keyof typeof USERS;
  time: string;
  question: string;
  context: string;
  optA: string;
  optB: string;
  explanation: string;
}) {
  const u = USERS[user];
  const [choice, setChoice] = useState<"a" | "b" | null>(null);
  return (
    <article className="ig-post">
      <div className="ig-post-header">
        <Avatar src={u.avatar} size={32} />
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <span className="ig-post-username">{u.handle}</span>
          </div>
          <div className="ig-post-sublabel">{time}</div>
        </div>
        <MoreHorizontal size={20} color="#061538" style={{ cursor: "pointer" }} />
      </div>

      <div
        style={{
          background: "#EEF6FB",
          borderTop: "1px solid #D8E3EC",
          borderBottom: "1px solid #D8E3EC",
          padding: "32px 24px",
        }}
      >
        <div
          style={{
            fontSize: 11,
            color: "#5B6B7A",
            textTransform: "uppercase",
            letterSpacing: 1.6,
            marginBottom: 12,
            fontWeight: 700,
          }}
        >
          en este momento
        </div>
        <div
          style={{
            fontSize: 20,
            fontWeight: 700,
            color: "#061538",
            lineHeight: 1.3,
            marginBottom: 10,
          }}
        >
          {question}
        </div>
        <div style={{ fontSize: 14, color: "#5B6B7A", lineHeight: 1.5 }}>
          {context}
        </div>
      </div>

      <div className="ig-post-footer">
        <PostActionBar initialLikes={Math.floor(Math.random() * 900) + 100} />

        {choice === null ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
              marginBottom: 12,
            }}
          >
            <button
              suppressHydrationWarning
              onClick={() => setChoice("a")}
              className="ig-decision-btn ig-decision-a"
            >
              {optA}
            </button>
            <button
              suppressHydrationWarning
              onClick={() => setChoice("b")}
              className="ig-decision-btn ig-decision-b"
            >
              {optB}
            </button>
          </div>
        ) : (
          <div
            style={{
              background: choice === "a" ? "#F0FDF4" : "#FEF2F2",
              border: `1px solid ${choice === "a" ? "#86EFAC" : "#FCA5A5"}`,
              borderRadius: 8,
              padding: "12px 14px",
              marginBottom: 12,
              animation: "slideUpIn 0.3s ease",
            }}
          >
            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: choice === "a" ? "#15803D" : "#B91C1C",
                marginBottom: 4,
              }}
            >
              {choice === "a" ? "Buena lectura" : "Ojo con esta señal"}
            </div>
            <div style={{ fontSize: 13, color: "#374151", lineHeight: 1.5 }}>
              {explanation}
            </div>
          </div>
        )}

        <CommentInput />
      </div>
    </article>
  );
}

/* ────────────────────────────────────────────────────────────
   POST DE EXPERIENCIA
──────────────────────────────────────────────────────────── */
function ExperiencePost({
  moduleId,
  user,
  time,
  headline,
  subline,
  ctaLabel,
  likeCount,
  visualType,
  onStart,
}: {
  moduleId: ModuleId;
  user: keyof typeof USERS;
  time: string;
  headline: string;
  subline: string;
  ctaLabel: string;
  likeCount: number;
  visualType: "chat" | "profile" | "story" | "redflag";
  onStart: (id: ModuleId) => void;
}) {
  const u = USERS[user];
  const visuals: Record<string, React.ReactNode> = {
    chat: (
      <div
        style={{
          background: "#EEF6FB",
          padding: "20px 20px 16px",
          borderTop: "1px solid #D8E3EC",
          borderBottom: "1px solid #D8E3EC",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 14,
            paddingBottom: 10,
            borderBottom: "1px solid #D8E3EC",
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              overflow: "hidden",
              flexShrink: 0,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://i.pravatar.cc/150?img=11" alt="nicoo.raw" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#061538" }}>
              nicoo.raw
            </div>
            <div style={{ fontSize: 11, color: C.textSoft }}>
              ejemplo · simulación SAFENET
            </div>
          </div>
          <div
            style={{
              marginLeft: "auto",
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "#22C55E",
              boxShadow: "0 0 6px rgba(34,197,94,0.5)",
            }}
          />
        </div>
        {[
          "Che, creo que te vi en recomendados.",
          "¿Vos subiste una historia del recital ayer?",
        ].map((t, i) => (
          <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
            <div
              style={{
                width: 24,
                height: 24,
                borderRadius: "50%",
                overflow: "hidden",
                flexShrink: 0,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://i.pravatar.cc/150?img=11" alt="nicoo.raw" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <div
              style={{
                background: "#EEF6FB",
                padding: "8px 12px",
                borderRadius: "18px 18px 18px 3px",
                fontSize: 13,
                color: "#061538",
                maxWidth: "85%",
                lineHeight: 1.4,
              }}
            >
              {t}
            </div>
          </div>
        ))}
        <div
          style={{
            textAlign: "center",
            marginTop: 12,
            fontSize: 11,
            color: C.blue,
            fontWeight: 700,
            letterSpacing: 0.4,
            textTransform: "uppercase",
          }}
        >
          conversación de ejemplo · probá el simulador
        </div>
      </div>
    ),
    profile: (
      <div
        style={{
          background: "#F8FAFC",
          padding: "20px",
          borderTop: "1px solid #D8E3EC",
          borderBottom: "1px solid #D8E3EC",
        }}
      >
        <div
          style={{
            background: "#FFF",
            border: "1px solid #D8E3EC",
            borderRadius: 12,
            padding: "16px",
            maxWidth: 340,
            margin: "0 auto",
            boxShadow: "0 6px 18px rgba(6,21,56,0.04)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 12,
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                background: "linear-gradient(135deg,#102A43 0%,#74B3CE 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 20,
                fontWeight: 700,
                color: "#FFF",
                boxShadow: "0 6px 14px rgba(116,179,206,0.32)",
              }}
            >
              V
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 14, color: "#061538" }}>
                valeria.foto_oficial
              </div>
              <div style={{ fontSize: 12, color: "#7C8A99" }}>
                Creada hace 2 semanas
              </div>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              textAlign: "center",
              marginBottom: 12,
              paddingBottom: 12,
              borderBottom: "1px solid #D8E3EC",
            }}
          >
            {[
              ["3", "Posts"],
              ["12.4K", "Seguidores"],
              ["8", "Siguiendo"],
            ].map(([v, l]) => (
              <div key={l}>
                <div style={{ fontWeight: 700, fontSize: 16, color: "#061538" }}>
                  {v}
                </div>
                <div style={{ fontSize: 11, color: "#7C8A99" }}>{l}</div>
              </div>
            ))}
          </div>
          <div
            style={{
              textAlign: "center",
              fontSize: 11,
              color: C.blue,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: 0.6,
            }}
          >
            ejemplo · señales para entrenar el ojo
          </div>
        </div>
      </div>
    ),
    story: (
      <div
        style={{
          background: "linear-gradient(135deg,#061538 0%,#102A43 55%,#163A63 100%)",
          padding: "48px 32px",
          borderTop: "1px solid #D8E3EC",
          borderBottom: "1px solid #D8E3EC",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 20% 20%, rgba(116,179,206,0.18), transparent 40%), radial-gradient(circle at 80% 80%, rgba(191,231,245,0.12), transparent 40%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            width: 52,
            height: 52,
            margin: "0 auto 16px",
            borderRadius: "50%",
            background: "rgba(116,179,206,0.18)",
            border: "1px solid rgba(116,179,206,0.32)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          <MessageCircle size={26} color="#BFE7F5" strokeWidth={1.8} />
        </div>
        <div
          style={{
            fontSize: 20,
            fontWeight: 700,
            color: "#FFF",
            lineHeight: 1.3,
            marginBottom: 10,
            position: "relative",
          }}
        >
          Tu historia, tus decisiones
        </div>
        <div
          style={{
            fontSize: 13,
            color: "rgba(255,255,255,0.62)",
            lineHeight: 1.5,
            position: "relative",
          }}
        >
          Un escenario real. Cada elección tiene consecuencias.
        </div>
      </div>
    ),
    redflag: (
      <div
        style={{
          background: "#FFF7E6",
          padding: "32px 24px",
          borderTop: "1px solid #D8E3EC",
          borderBottom: "1px solid #D8E3EC",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[
            '"No le cuentes esto a nadie, es solo entre nosotros."',
            '"¿En qué barrio vivís? Es para ver si estamos cerca."',
          ].map((t, i) => (
            <div
              key={i}
              style={{
                background: "#FFF",
                border: "1px solid #F5D89C",
                borderRadius: 10,
                padding: "12px 14px",
                fontSize: 13,
                color: "#061538",
                lineHeight: 1.5,
                position: "relative",
                boxShadow: "0 4px 12px rgba(240,180,69,0.08)",
              }}
            >
              {t}
              <div
                style={{
                  position: "absolute",
                  top: 10,
                  right: 12,
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "#E94E5D",
                  boxShadow: "0 0 0 3px rgba(233,78,93,0.18)",
                }}
              />
            </div>
          ))}
          <div
            style={{
              fontSize: 12,
              color: "#A37210",
              fontWeight: 700,
              textAlign: "center",
            }}
          >
            ¿lo dejarías pasar o te hace ruido?
          </div>
        </div>
      </div>
    ),
  };

  return (
    <article className="ig-post">
      <div className="ig-post-header">
        <Avatar src={u.avatar} size={32} />
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <span className="ig-post-username">{u.handle}</span>
          </div>
          <div className="ig-post-sublabel">{time}</div>
        </div>
        <MoreHorizontal size={20} color="#061538" style={{ cursor: "pointer" }} />
      </div>

      {visuals[visualType]}

      <div className="ig-post-footer">
        <PostActionBar initialLikes={likeCount} />
        <div
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: "#061538",
            marginBottom: 5,
          }}
        >
          {likeCount.toLocaleString("es-AR")} Me gusta
        </div>
        <div className="ig-post-caption">
          <b>{u.handle}</b>
          {headline} <span style={{ color: "#5B6B7A" }}>{subline}</span>
        </div>
        <button
          suppressHydrationWarning
          onClick={() => onStart(moduleId)}
          style={{
            width: "100%",
            padding: "12px 16px",
            marginBottom: 12,
            borderRadius: 10,
            background: "#0B5CFF",
            color: "#FFF",
            border: "none",
            fontSize: 14,
            fontWeight: 700,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            transition: "transform 0.18s ease, box-shadow 0.18s ease",
            fontFamily: "inherit",
            boxShadow: "0 6px 16px rgba(116,179,206,0.32)",
            letterSpacing: 0.2,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-1px)";
            e.currentTarget.style.boxShadow =
              "0 10px 22px rgba(116,179,206,0.42)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow =
              "0 6px 16px rgba(116,179,206,0.32)";
          }}
        >
          {ctaLabel} <ChevronRight size={16} strokeWidth={2.5} />
        </button>
        <CommentInput />
      </div>
    </article>
  );
}

/* ════════════════════════════════════════════════════════════
   POSTS NUEVOS — contenido educativo del feed
════════════════════════════════════════════════════════════ */
function GradientVisual({
  from,
  to,
  icon,
  badge,
  title,
  sub,
}: {
  from: string;
  to: string;
  icon: React.ReactNode;
  badge: string;
  title: string;
  sub: string;
}) {
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: "1/1",
        background: `linear-gradient(135deg,${from} 0%,${to} 100%)`,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 26,
        color: C.white,
        overflow: "hidden",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 18% 18%, rgba(255,255,255,0.18), transparent 38%), radial-gradient(circle at 82% 82%, rgba(255,255,255,0.10), transparent 40%)",
        }}
      />
      <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 10 }}>
        <div
          style={{
            width: 38,
            height: 38,
            borderRadius: 12,
            background: "rgba(255,255,255,0.18)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "1px solid rgba(255,255,255,0.28)",
          }}
        >
          {icon}
        </div>
        <span
          style={{
            fontSize: 10.5,
            fontWeight: 800,
            letterSpacing: 1.4,
            textTransform: "uppercase",
            background: "rgba(255,255,255,0.18)",
            border: "1px solid rgba(255,255,255,0.28)",
            padding: "5px 10px",
            borderRadius: 999,
          }}
        >
          {badge}
        </span>
      </div>
      <div style={{ position: "relative" }}>
        <div
          style={{
            fontFamily: FONT_DISPLAY,
            fontSize: 26,
            fontWeight: 700,
            lineHeight: 1.18,
            marginBottom: 10,
            letterSpacing: -0.4,
          }}
        >
          {title}
        </div>
        <div style={{ fontSize: 14, lineHeight: 1.5, opacity: 0.92, maxWidth: 320 }}>
          {sub}
        </div>
      </div>
    </div>
  );
}

function FakeProfileReelPost() {
  const [reelError, setReelError] = useState(false);
  const reelUrl = "https://www.instagram.com/reel/DW7ADc8oTv_/";
  const profile = SOURCE_PROFILES.incibe;

  return (
    <article className="ig-post">
      <div className="ig-post-header">
        <SourceAvatar sourceKey="incibe" size={32} />
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <span className="ig-post-username">{profile.username}</span>
            {profile.verified && (
              <BadgeCheck size={14} color="#0095f6" fill="rgba(0,149,246,0.1)" strokeWidth={2.5} />
            )}
          </div>
          <div className="ig-post-sublabel">{profile.subtitle} · hace 2 h</div>
        </div>
        <MoreHorizontal size={20} color={C.blueDark} style={{ cursor: "pointer" }} />
      </div>

      {/* Área visual tipo Reel con fallback */}
      <div style={{ position: "relative", width: "100%", aspectRatio: "9/16", maxHeight: 480, overflow: "hidden", background: "#000" }}>
        {!reelError ? (
          <iframe
            src="https://www.instagram.com/reel/DW7ADc8oTv_/embed/"
            style={{ width: "100%", height: "100%", border: "none", display: "block" }}
            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture"
            onError={() => setReelError(true)}
            title="Reel: Perfiles falsos generados con IA"
          />
        ) : (
          /* Fallback visual cuando el embed no carga */
          <div
            style={{
              width: "100%",
              height: "100%",
              background: "linear-gradient(160deg,#0B1B3A 0%,#0B5CFF 60%,#061538 100%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: 28,
              color: C.white,
              textAlign: "center",
              position: "relative",
            }}
          >
            <div
              aria-hidden
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "radial-gradient(circle at 25% 20%, rgba(255,255,255,0.12), transparent 40%), radial-gradient(circle at 75% 80%, rgba(11,92,255,0.25), transparent 45%)",
              }}
            />
            {/* Icono de play */}
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.15)",
                border: "2px solid rgba(255,255,255,0.35)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 20,
                position: "relative",
              }}
            >
              <div
                style={{
                  width: 0,
                  height: 0,
                  borderTop: "12px solid transparent",
                  borderBottom: "12px solid transparent",
                  borderLeft: "20px solid #FFF",
                  marginLeft: 4,
                }}
              />
            </div>
            <div
              style={{
                fontSize: 10,
                fontWeight: 800,
                letterSpacing: 1.6,
                textTransform: "uppercase",
                background: "rgba(255,255,255,0.15)",
                border: "1px solid rgba(255,255,255,0.28)",
                padding: "5px 12px",
                borderRadius: 999,
                marginBottom: 18,
                position: "relative",
              }}
            >
              🚨 Reel · IA y perfiles falsos
            </div>
            <div
              style={{
                fontFamily: FONT_DISPLAY,
                fontSize: 22,
                fontWeight: 700,
                lineHeight: 1.22,
                marginBottom: 12,
                letterSpacing: -0.3,
                position: "relative",
              }}
            >
              Perfiles perfectos que podrían ser falsos
            </div>
            <div
              style={{
                fontSize: 13.5,
                lineHeight: 1.55,
                opacity: 0.88,
                maxWidth: 280,
                position: "relative",
              }}
            >
              La IA puede crear fotos y vidas que parecen reales, pero detrás puede haber un ciberdelincuente 😳
            </div>
          </div>
        )}

        {/* Badge "REEL" sobre el visual */}
        <div
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            background: "rgba(0,0,0,0.55)",
            color: "#FFF",
            fontSize: 10,
            fontWeight: 800,
            letterSpacing: 1.2,
            textTransform: "uppercase",
            padding: "4px 9px",
            borderRadius: 6,
            backdropFilter: "blur(4px)",
          }}
        >
          Reel
        </div>
      </div>

      <div className="ig-post-footer">
        <PostActionBar initialLikes={1284} />
        <div style={{ fontSize: 14, fontWeight: 600, color: C.blueDark, marginBottom: 5 }}>1.284 Me gusta</div>
        <div className="ig-post-caption">
          <b>groomingargentina</b>{" "}
          Perfiles perfectos que podrían ser falsos 🚨 La IA puede crear fotos y vidas que parecen reales, pero detrás puede haber un ciberdelincuente 😳.{" "}
          <span style={{ color: C.textMute }}>⚠️ Antes de interactuar, verifica todo y desconfía.</span>
        </div>

        {/* Botón para abrir el reel original */}
        <a
          href={reelUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            width: "100%",
            padding: "11px 16px",
            marginBottom: 12,
            borderRadius: 10,
            background: C.celeste,
            border: `1px solid #c7d4f7`,
            color: C.blue,
            fontSize: 13.5,
            fontWeight: 700,
            textDecoration: "none",
            transition: "background 0.18s ease",
            fontFamily: "inherit",
            boxSizing: "border-box",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#d4ddf8")}
          onMouseLeave={(e) => (e.currentTarget.style.background = C.celeste)}
        >
          Ver reel completo en Instagram <ChevronRight size={15} strokeWidth={2.5} />
        </a>

        <div className="ig-post-see-comments">Ver los 18 comentarios</div>
        <div className="ig-post-comment-preview"><b>{USERS.valen.handle}</b> me pasó exactamente eso, el perfil parecía real 😟</div>
        <div className="ig-post-comment-preview"><b>{USERS.mateo.handle}</b> la IA ya genera caras que no existen, cómo sabés</div>
        <div className="ig-post-timestamp">hace 2 horas</div>
        <CommentInput />
      </div>
    </article>
  );
}

function ResourcePost() {
  const profile = SOURCE_PROFILES.safenet;
  return (
    <article className="ig-post">
      <div className="ig-post-header">
        <SourceAvatar sourceKey="safenet" size={32} />
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <span className="ig-post-username">{profile.username}</span>
            <BadgeCheck size={14} color={C.blue} fill="rgba(11,92,255,0.12)" strokeWidth={2.5} />
          </div>
          <div className="ig-post-sublabel">{profile.subtitle}</div>
        </div>
        <MoreHorizontal size={20} color={C.blueDark} style={{ cursor: "pointer" }} />
      </div>
      <div
        style={{
          padding: "32px 26px",
          background: C.celeste,
          borderTop: `1px solid ${C.line}`,
          borderBottom: `1px solid ${C.line}`,
        }}
      >
        <div
          style={{
            background: C.white,
            borderRadius: 16,
            padding: "22px 22px",
            border: `1px solid ${C.line}`,
            boxShadow: "0 8px 22px rgba(6,21,56,0.06)",
          }}
        >
          <div style={{ fontSize: 11, fontWeight: 800, color: C.blue, letterSpacing: 1.4, textTransform: "uppercase", marginBottom: 8 }}>
            Línea de ayuda · 24 hs
          </div>
          <div style={{ fontFamily: FONT_DISPLAY, fontSize: 28, fontWeight: 700, color: C.blueDark, marginBottom: 6, letterSpacing: -0.6 }}>
            102
          </div>
          <div style={{ fontSize: 13.5, color: C.textMute, lineHeight: 1.55 }}>
            Si algo te incomoda, podés hablar. Es gratis, anónimo y confidencial. No tenés que tener todo claro para llamar.
          </div>
        </div>
      </div>
      <div className="ig-post-footer">
        <PostActionBar initialLikes={1834} />
        <div style={{ fontSize: 14, fontWeight: 600, color: C.blueDark, marginBottom: 5 }}>1.834 Me gusta</div>
        <div className="ig-post-caption">
          <b>safenet.ayuda</b>
          Pedir ayuda no es exagerar. Guardalo en favoritos por si lo necesitás o por si lo necesita alguien de tu grupo.
        </div>
        <div className="ig-post-timestamp">hace 12 horas</div>
        <CommentInput />
      </div>
    </article>
  );
}

function EmotionalPressurePost() {
  const alertPhrases = [
    "“Si no me contestás, me enojo.”",
    "“Pensé que eras mi amigo/a.”",
    "“No le cuentes a nadie.”",
    "“Si me querés, mandame una foto.”",
    "“Me hacés sentir mal si no hablás conmigo.”",
  ];
  return (
    <article className="ig-post">
      <div className="ig-post-header">
        <SourceAvatar sourceKey="safenet" size={32} />
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <span className="ig-post-username">{SOURCE_PROFILES.safenet.username}</span>
            <BadgeCheck size={14} color={C.blue} fill="rgba(11,92,255,0.12)" strokeWidth={2.5} />
          </div>
          <div className="ig-post-sublabel">hace 1 d</div>
        </div>
        <MoreHorizontal size={20} color={C.blueDark} style={{ cursor: "pointer" }} />
      </div>
      <div
        style={{
          position: "relative",
          width: "100%",
          background: `linear-gradient(160deg, ${C.celeste} 0%, #FFFFFF 70%)`,
          padding: "26px 24px 28px",
          borderTop: `1px solid ${C.line}`,
          borderBottom: `1px solid ${C.line}`,
          display: "flex",
          flexDirection: "column",
          gap: 18,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 10,
              background: C.white,
              border: `1px solid ${C.line}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              boxShadow: "0 4px 12px rgba(11,92,255,0.10)",
            }}
          >
            <AlertTriangle size={18} color={C.blue} strokeWidth={2.4} />
          </div>
          <span
            style={{
              fontSize: 10.5,
              fontWeight: 800,
              letterSpacing: 1.6,
              textTransform: "uppercase",
              color: C.blue,
              background: C.white,
              border: `1px solid ${C.line}`,
              padding: "5px 11px",
              borderRadius: 999,
            }}
          >
            Señal de alerta
          </span>
        </div>

        <div>
          <h3
            style={{
              fontFamily: FONT_DISPLAY,
              fontSize: 30,
              fontWeight: 800,
              color: C.blueDark,
              letterSpacing: -0.8,
              lineHeight: 1.05,
              margin: "0 0 8px",
              textTransform: "uppercase",
            }}
          >
            Presión emocional
          </h3>
          <p
            style={{
              fontSize: 14,
              color: C.textMute,
              lineHeight: 1.55,
              margin: 0,
              maxWidth: 420,
            }}
          >
            Cuando alguien te hace sentir culpa para que le respondas, eso no está bien.
          </p>
        </div>

        <div
          style={{
            background: C.white,
            border: `1px solid ${C.line}`,
            borderRadius: 14,
            padding: "14px 16px",
            boxShadow: "0 6px 16px rgba(6,21,56,0.05)",
          }}
        >
          <div
            style={{
              fontSize: 10.5,
              fontWeight: 800,
              letterSpacing: 1.4,
              textTransform: "uppercase",
              color: C.textMute,
              marginBottom: 10,
            }}
          >
            Frases que pueden estar manipulándote
          </div>
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            {alertPhrases.map((p, i) => (
              <li
                key={i}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 10,
                  fontSize: 13.5,
                  color: C.blueDark,
                  lineHeight: 1.45,
                  fontWeight: 500,
                }}
              >
                <span
                  aria-hidden
                  style={{
                    width: 3,
                    alignSelf: "stretch",
                    background: C.blue,
                    borderRadius: 2,
                    marginTop: 3,
                    marginBottom: 3,
                    flexShrink: 0,
                  }}
                />
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>

        <div
          style={{
            background: C.blueDark,
            color: C.white,
            borderRadius: 14,
            padding: "16px 18px",
          }}
        >
          <div
            style={{
              fontSize: 10.5,
              fontWeight: 800,
              letterSpacing: 1.6,
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.72)",
              marginBottom: 6,
            }}
          >
            Lo que es seguro saber
          </div>
          <div
            style={{
              fontSize: 14,
              lineHeight: 1.55,
              fontWeight: 500,
            }}
          >
            Una amistad segura no te obliga, no te apura y no te hace sentir miedo. Si alguien te presiona, pedí ayuda a un adulto de confianza.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            background: C.white,
            border: `1.5px solid ${C.blue}`,
            borderRadius: 12,
            padding: "12px 16px",
          }}
        >
          <ShieldCheck size={18} color={C.blue} strokeWidth={2.4} />
          <span
            style={{
              fontFamily: FONT_DISPLAY,
              fontSize: 14,
              fontWeight: 700,
              color: C.blueDark,
              letterSpacing: -0.1,
            }}
          >
            Frená, no respondas por miedo y contalo.
          </span>
        </div>
      </div>
      <div className="ig-post-footer">
        <PostActionBar initialLikes={1102} />
        <div style={{ fontSize: 14, fontWeight: 600, color: C.blueDark, marginBottom: 5 }}>1.102 Me gusta</div>
        <div className="ig-post-caption">
          <b>{USERS.lucas.handle}</b>
          Cuando alguien usa enojo o culpa para que respondas, no es amor. Es presión. Bloquear o clavar el visto siempre es una opción válida.
        </div>
        <div className="ig-post-see-comments">Ver los 5 comentarios</div>
        <div className="ig-post-comment-preview"><b>{USERS.sofi.handle}</b> no tengo por qué responder si no quiero</div>
        <div className="ig-post-comment-preview"><b>{USERS.andrea.handle}</b> esto deberían enseñarlo en el cole</div>
        <div className="ig-post-timestamp">hace 1 día</div>
        <CommentInput />
      </div>
    </article>
  );
}

function CarouselSignalsPost() {
  type Slide = {
    title: string;
    intro?: string;
    bullets?: string[];
  };
  const slides: Slide[] = [
    {
      title: "¿Sabés reconocer un perfil falso?",
      intro:
        "No todos los perfiles son verdaderos. Detrás de un perfil “perfecto” puede haber una identidad construida para manipular o generar confianza rápidamente.",
    },
    {
      title: "Posibles indicadores de una identidad digital falsa",
      bullets: [
        "Fotos demasiado perfectas, genéricas o poco naturales.",
        "Actividad reciente o incoherente: cuenta nueva con muchos seguidores o publicaciones de golpe.",
        "Ausencia de entorno social real: pocos comentarios, pocas interacciones o falta de vínculos visibles.",
      ],
    },
    {
      title: "Dialogá sobre perfiles falsos",
      bullets: [
        "No todo el que te habla es quien dice ser.",
        "Si alguien genera confianza demasiado rápido, prestá atención.",
        "Si no lo conocés en la vida real, no es alguien de confianza.",
        "No compartas fotos o datos personales con alguien que conociste en Internet.",
        "Si algo te incomoda o te hace dudar, hablalo con alguien de confianza.",
      ],
    },
  ];
  const [idx, setIdx] = useState(0);
  const slide = slides[idx];
  const profile = SOURCE_PROFILES.groomingargentina;
  return (
    <article className="ig-post">
      <div className="ig-post-header">
        <SourceAvatar sourceKey="groomingargentina" size={32} />
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <span className="ig-post-username">{profile.username}</span>
            {profile.verified && (
              <BadgeCheck
                size={14}
                color="#0095f6"
                fill="rgba(0,149,246,0.1)"
                strokeWidth={2.5}
              />
            )}
            <span style={{ color: "#5B6B7A", fontSize: 14, margin: "0 3px" }}>•</span>
            <span style={{ color: ACCENT_DIM, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
              Seguir
            </span>
          </div>
          <div className="ig-post-sublabel">{profile.subtitle}</div>
        </div>
        <MoreHorizontal size={20} color={C.blueDark} style={{ cursor: "pointer" }} />
      </div>
      <div
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "1/1",
          background: `linear-gradient(135deg,${C.celeste} 0%,#FFFFFF 100%)`,
          padding: 26,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span
            style={{
              fontSize: 10.5,
              fontWeight: 800,
              color: C.blue,
              background: C.white,
              padding: "5px 11px",
              borderRadius: 999,
              border: `1px solid ${C.line}`,
              letterSpacing: 1.4,
              textTransform: "uppercase",
            }}
          >
            Perfiles falsos · {idx + 1}/{slides.length}
          </span>
          <div style={{ display: "flex", gap: 4 }}>
            {slides.map((_, i) => (
              <div
                key={i}
                style={{
                  width: i === idx ? 18 : 6,
                  height: 6,
                  borderRadius: 99,
                  background: i === idx ? C.blue : C.line,
                  transition: "all .25s",
                }}
              />
            ))}
          </div>
        </div>
        <div style={{ marginTop: 12 }}>
          <div
            style={{
              fontFamily: FONT_DISPLAY,
              fontSize: 22,
              fontWeight: 700,
              color: C.blueDark,
              marginBottom: 12,
              letterSpacing: -0.4,
              lineHeight: 1.2,
              maxWidth: 380,
            }}
          >
            {slide.title}
          </div>
          {slide.intro && (
            <div
              style={{
                fontSize: 14,
                color: C.textMute,
                lineHeight: 1.55,
                maxWidth: 380,
              }}
            >
              {slide.intro}
            </div>
          )}
          {slide.bullets && (
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                display: "flex",
                flexDirection: "column",
                gap: 8,
                maxWidth: 380,
              }}
            >
              {slide.bullets.map((b, i) => (
                <li
                  key={i}
                  style={{
                    display: "flex",
                    gap: 10,
                    alignItems: "flex-start",
                    fontSize: 13.5,
                    color: C.blueDark,
                    lineHeight: 1.5,
                  }}
                >
                  <span
                    aria-hidden
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: C.blue,
                      flexShrink: 0,
                      marginTop: 7,
                    }}
                  />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        {idx > 0 && (
          <button
            suppressHydrationWarning
            onClick={() => setIdx(idx - 1)}
            aria-label="Anterior"
            style={{
              position: "absolute",
              left: 12,
              top: "50%",
              transform: "translateY(-50%)",
              width: 34,
              height: 34,
              borderRadius: "50%",
              background: C.white,
              border: `1px solid ${C.line}`,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 6px 14px rgba(6,21,56,0.10)",
            }}
          >
            <ChevronLeft size={18} color={C.blueDark} />
          </button>
        )}
        {idx < slides.length - 1 && (
          <button
            suppressHydrationWarning
            onClick={() => setIdx(idx + 1)}
            aria-label="Siguiente"
            style={{
              position: "absolute",
              right: 12,
              top: "50%",
              transform: "translateY(-50%)",
              width: 34,
              height: 34,
              borderRadius: "50%",
              background: C.white,
              border: `1px solid ${C.line}`,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 6px 14px rgba(6,21,56,0.10)",
            }}
          >
            <ChevronRight size={18} color={C.blueDark} />
          </button>
        )}
      </div>
      <div className="ig-post-footer">
        <PostActionBar initialLikes={2104} />
        <div style={{ fontSize: 14, fontWeight: 600, color: C.blueDark, marginBottom: 5 }}>2.104 Me gusta</div>
        <div className="ig-post-caption">
          <b>groomingargentina</b>
          Un perfil falso puede estar diseñado para generar confianza, manipular o engañar. Aprender a reconocer señales tempranas ayuda a cuidarse mejor en redes sociales.
        </div>
        <div className="ig-post-see-comments">Ver los 12 comentarios</div>
        <div className="ig-post-timestamp">hace 2 días</div>
        <CommentInput />
      </div>
    </article>
  );
}

/* ════════════════════════════════════════════════════════════
   SEMANA SAFENET — capa narrativa de 7 días
════════════════════════════════════════════════════════════ */
type WeekMission = {
  day: number;
  moduleId: ModuleId | null;
  title: string;
  mission: string;
};

const WEEK_MISSIONS: WeekMission[] = [
  { day: 1, moduleId: "requests", title: "Solicitud nueva", mission: "Revisá quién quiere seguirte antes de aceptar." },
  { day: 2, moduleId: "dm_sim", title: "Mensaje directo", mission: "Respondé sin dar datos personales ni salir de la app." },
  { day: 3, moduleId: "profile_detector", title: "Perfil sospechoso", mission: "Detectá inconsistencias antes de confiar." },
  { day: 4, moduleId: "story_path", title: "La conversación escala", mission: "Tomá decisiones seguras cuando aparece la presión emocional." },
  { day: 5, moduleId: "red_flags", title: "Mensajes que hacen ruido", mission: "Marcá señales de manipulación, secreto o insistencia." },
  { day: 6, moduleId: "screenshot_analysis", title: "Captura para analizar", mission: "Leé la conversación y elegí cómo actuar." },
  { day: 7, moduleId: null, title: "Informe SAFENET", mission: "Revisá tu recorrido, tus fortalezas y lo que podés reforzar." },
];

function getCurrentMission(completed: Set<ModuleId>): WeekMission {
  for (const m of WEEK_MISSIONS) {
    if (m.moduleId === null) return m;
    if (!completed.has(m.moduleId)) return m;
  }
  return WEEK_MISSIONS[WEEK_MISSIONS.length - 1];
}

function MissionBriefCard({
  mission,
  completedCount,
  onStart,
}: {
  mission: WeekMission;
  completedCount: number;
  onStart: () => void;
}) {
  const pct = Math.min(100, Math.round((completedCount / 6) * 100));
  const ctaLabel =
    mission.moduleId === null
      ? "Ver informe"
      : mission.moduleId === "requests"
      ? "Ver solicitudes"
      : mission.moduleId === "dm_sim"
      ? "Abrir mensajes"
      : "Empezar misión";
  return (
    <div
      style={{
        background: C.white,
        border: `1px solid ${C.line}`,
        borderRadius: 18,
        padding: "18px 18px 16px",
        marginBottom: 18,
        boxShadow: "0 10px 26px rgba(6,21,56,0.05)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(120% 100% at 100% 0%, rgba(11,92,255,0.10) 0%, transparent 55%)",
          pointerEvents: "none",
        }}
      />
      <div style={{ position: "relative" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "5px 11px",
              borderRadius: 999,
              background: C.celeste,
              border: `1px solid #c7d4f7`,
              color: C.blue,
              fontSize: 10.5,
              fontWeight: 700,
              letterSpacing: 1,
              textTransform: "uppercase",
            }}
          >
            <ShieldCheck size={12} strokeWidth={2.6} />
            Día {mission.day} de {WEEK_MISSIONS.length}
          </span>
          <span
            style={{
              fontSize: 10.5,
              color: C.textMute,
              fontWeight: 700,
              letterSpacing: 1,
              textTransform: "uppercase",
            }}
          >
            Semana SAFENET
          </span>
        </div>
        <h3
          style={{
            fontFamily: FONT_DISPLAY,
            fontSize: 19,
            fontWeight: 700,
            color: C.blueDark,
            margin: 0,
            letterSpacing: -0.3,
            lineHeight: 1.25,
          }}
        >
          {mission.title}
        </h3>
        <p
          style={{
            margin: "6px 0 14px",
            color: C.textMute,
            fontSize: 13.5,
            lineHeight: 1.55,
          }}
        >
          {mission.mission}
        </p>
        <div style={{ marginBottom: 14 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 10.5,
              fontWeight: 700,
              color: C.textMute,
              textTransform: "uppercase",
              letterSpacing: 1,
              marginBottom: 6,
            }}
          >
            <span>Progreso de la semana</span>
            <span style={{ color: C.blue }}>{completedCount}/6</span>
          </div>
          <div
            style={{
              height: 6,
              background: C.lineSoft,
              borderRadius: 99,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${pct}%`,
                background: BRAND_GRADIENT,
                borderRadius: 99,
                transition: "width 0.7s ease",
              }}
            />
          </div>
        </div>
        <button
          suppressHydrationWarning
          onClick={onStart}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "11px 18px",
            borderRadius: 12,
            background: C.blue,
            color: C.white,
            border: "none",
            fontFamily: FONT_DISPLAY,
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: 0.2,
            cursor: "pointer",
            boxShadow: "0 8px 18px rgba(11,92,255,0.28)",
            transition: "transform .18s ease, box-shadow .18s ease, background .18s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = C.blueHover;
            e.currentTarget.style.transform = "translateY(-1px)";
            e.currentTarget.style.boxShadow = "0 12px 24px rgba(11,92,255,0.32)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = C.blue;
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 8px 18px rgba(11,92,255,0.28)";
          }}
        >
          {ctaLabel}
          <ArrowRight size={15} strokeWidth={2.4} />
        </button>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   PÁGINA PRINCIPAL
════════════════════════════════════════════════════════════ */
export default function AdolescentesPage() {
  useEffect(() => {
    trackWorldEntry("adolescentes");
  }, []);

  const [view, setView] = useState<View>("world");
  const [username, setUsername] = useState("safenet_user");
  const [xp, setXp] = useState(0);
  const [activeModule, setActiveModule] = useState<ModuleId | null>(null);
  const [completedModules, setCompletedModules] = useState<Set<ModuleId>>(
    new Set(),
  );

  // Story state
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);
  const [seenStories, setSeenStories] = useState<Set<number>>(new Set());

  // DM state
  const [showDmInbox, setShowDmInbox] = useState(false);
  const [showDmChat, setShowDmChat] = useState(false);

  // Requests state
  const [showRequests, setShowRequests] = useState(false);
  const [requestsPending, setRequestsPending] = useState(5);

  // Bottom nav (mobile)
  const [activeTab, setActiveTab] = useState<NavTab>("home");

  const handleXp = useCallback((n: number) => setXp((p) => p + n), []);
  const handleComplete = (id: ModuleId, pts: number) => {
    setCompletedModules((prev) => new Set([...prev, id]));
    setActiveModule(null);
    setShowDmChat(false);
    setShowRequests(false);
  };
  const openModule = (id: ModuleId) => setActiveModule(id);

  const currentMission = getCurrentMission(completedModules);
  const openMission = () => {
    const id = currentMission.moduleId;
    if (id === "requests") {
      setActiveTab("requests");
      setShowRequests(true);
    } else if (id === "dm_sim") {
      setActiveTab("dm");
      setShowDmInbox(true);
    } else if (id) {
      setActiveModule(id);
    } else {
      setActiveTab("profile");
    }
  };

  const handleStorySeen = useCallback((i: number) => {
    setSeenStories((prev) => new Set([...prev, i]));
  }, []);

  const handleDmComplete = (pts: number) => {
    handleComplete("dm_sim", pts);
    setShowDmChat(false);
    setShowDmInbox(false);
  };

  const handleRequestsComplete = (pts: number) => {
    handleComplete("requests", pts);
    setShowRequests(false);
  };

  const handleNavClick = (tab: NavTab) => {
    setActiveTab(tab);
    if (tab === "dm") {
      setShowDmInbox(true);
    } else if (tab === "requests") {
      setShowRequests(true);
    }
  };

  return (
    <main
      style={{
        background: "#F8FAFC",
        color: "#061538",
        minHeight: "100vh",
        fontFamily:
          "Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif",
        position: "relative",
        overflowX: "hidden",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Space+Grotesk:wght@500;600;700&display=swap');
        * { box-sizing:border-box; margin:0; padding:0; }
        body, button, input, textarea { font-family:Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif; }
        .sf-display { font-family:'Space Grotesk',Inter,sans-serif; letter-spacing:-0.01em; }

        :root {
          --sf-blue-dark:#061538;
          --sf-blue-deep:#102A43;
          --sf-blue:#0B5CFF;
          --sf-blue-hover:#0a4fdc;
          --sf-celeste:#e5ebfa;
          --sf-celeste-strong:#c7d4f7;
          --sf-bg:#F8FAFC;
          --sf-bg-blue:#EEF2FF;
          --sf-line:#D8E3EC;
          --sf-line-soft:#EEF2F7;
          --sf-text-muted:#5B6B7A;
          --sf-text-soft:#7C8A99;
          --sf-white:#FFFFFF;
          --sf-danger:#DC2626;
          --sf-danger-soft:#FEE2E2;
          --sf-success:#16A34A;
          --sf-success-soft:#DCFCE7;
          --sf-warn:#EA580C;
          --sf-warn-soft:#FFEDD5;
          --sf-shadow-soft:0 12px 32px rgba(6,21,56,.06);
          --sf-shadow-card:0 18px 44px rgba(6,21,56,.055);
        }

        body { background:var(--sf-bg); }
        button, input { font-family:inherit; }

        /* ── Animaciones base ── */
        @keyframes slideUpIn { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes xpPop { 0%{opacity:0;transform:translateY(0)} 20%{opacity:1;transform:translateY(-15px)} 100%{opacity:0;transform:translateY(-35px)} }
        @keyframes typingDot { 0%,100%{opacity:0.3;transform:scale(0.8)} 50%{opacity:1;transform:scale(1)} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes modalIn { from{opacity:0;transform:scale(0.96) translateY(16px)} to{opacity:1;transform:scale(1) translateY(0)} }
        @keyframes slideInFromRight { from{opacity:0;transform:translateX(32px)} to{opacity:1;transform:translateX(0)} }
        @keyframes likeBounce { 0%{transform:scale(1)} 45%{transform:scale(1.38)} 100%{transform:scale(1)} }
        @keyframes softPulse { 0%,100%{box-shadow:0 0 0 0 rgba(116,179,206,.22)} 50%{box-shadow:0 0 0 8px rgba(116,179,206,0)} }

        ::selection { background:rgba(116,179,206,.28); color:var(--sf-blue-dark); }
        ::-webkit-scrollbar { width:6px; height:4px; }
        ::-webkit-scrollbar-track { background:rgba(216,227,236,0.25); }
        ::-webkit-scrollbar-thumb { background:rgba(116,179,206,0.45); border-radius:99px; }

        /* ── Shell tipo red social, con piel SAFENET ── */
        .ig-shell {
          display:grid;
          grid-template-columns:248px minmax(0,1fr) 324px;
          min-height:100vh;
          background:
            radial-gradient(circle at 18% 6%, rgba(116,179,206,.18), transparent 28%),
            radial-gradient(circle at 86% 18%, rgba(191,231,245,.28), transparent 24%),
            linear-gradient(180deg,#FFFFFF 0%,#F8FAFC 52%,#EEF6FB 100%);
          color:var(--sf-blue-dark);
        }
        @media(max-width:1100px){
          .ig-shell{grid-template-columns:76px 1fr}
          .ig-right{display:none!important}
          .ig-nav-label{display:none!important}
          .ig-sidebar-logo span{display:none!important}
          .ig-sidebar-logo{justify-content:center!important;padding-left:0!important;padding-right:0!important}
        }
        @media(max-width:768px){
          .ig-shell{grid-template-columns:1fr;background:linear-gradient(180deg,#FFFFFF 0%,#F8FAFC 46%,#EEF6FB 100%)}
          .ig-sidebar{display:none!important}
          .ig-feed-inner{padding:14px 12px 86px!important;max-width:520px!important}
          .ig-post,.ig-stories-bar,.xp-banner{border-radius:18px!important}
        }

        /* ── Sidebar ── */
        .ig-sidebar {
          border-right:1px solid rgba(216,227,236,.86);
          padding:18px 12px;
          position:sticky;
          top:0;
          height:100vh;
          display:flex;
          flex-direction:column;
          background:rgba(255,255,255,.86);
          backdrop-filter:blur(18px);
          overflow-y:auto;
          box-shadow:12px 0 36px rgba(6,21,56,.035);
        }
        .ig-sidebar-logo {
          padding:18px 14px 22px;
          display:flex;
          align-items:center;
          gap:11px;
          color:var(--sf-blue-dark)!important;
          border-radius:16px;
          text-decoration:none;
          position:relative;
        }
        .ig-sidebar-logo::after {
          content:"";
          position:absolute;
          left:14px;
          right:14px;
          bottom:8px;
          height:1px;
          background:linear-gradient(90deg,transparent,rgba(116,179,206,.32),transparent);
        }
        .ig-sidebar-logo svg {
          stroke:var(--sf-celeste)!important;
          filter:drop-shadow(0 6px 14px rgba(116,179,206,.28));
          transition:transform .25s ease;
        }
        .ig-sidebar-logo:hover svg { transform:rotate(-6deg) scale(1.05); }
        .ig-sidebar-logo span {
          color:var(--sf-blue-dark)!important;
          letter-spacing:1.2px;
          font-weight:700;
        }
        .ig-nav-item {
          display:flex;
          align-items:center;
          gap:15px;
          padding:12px 12px;
          border-radius:14px;
          cursor:pointer;
          margin-bottom:4px;
          transition:background .18s ease, color .18s ease, transform .18s ease, box-shadow .18s ease;
          color:var(--sf-blue-dark)!important;
          user-select:none;
          position:relative;
        }
        .ig-nav-item svg { stroke:var(--sf-blue-deep)!important; transition:stroke .18s ease, transform .18s ease; }
        .ig-nav-item:hover {
          background:rgba(238,246,251,.95)!important;
          transform:translateX(2px);
        }
        .ig-nav-item:hover svg { transform:scale(1.05); }
        .ig-nav-item.active {
          background:linear-gradient(135deg,rgba(116,179,206,.22),rgba(238,246,251,.98));
          box-shadow:inset 0 0 0 1px rgba(116,179,206,.22);
        }
        .ig-nav-item.active::before {
          content:"";
          position:absolute;
          left:-12px;
          top:50%;
          transform:translateY(-50%);
          width:3px;
          height:22px;
          border-radius:0 3px 3px 0;
          background:linear-gradient(180deg,var(--sf-blue-dark),var(--sf-celeste));
        }
        .ig-nav-item.active svg { stroke:var(--sf-celeste)!important; }
        .ig-nav-item.active .ig-nav-label { font-weight:800; color:var(--sf-blue-dark)!important; }
        .ig-nav-label { font-size:15px; font-weight:600; color:var(--sf-blue-deep)!important; }

        /* ── Feed area ── */
        .ig-feed-area {
          overflow-y:auto;
          height:100vh;
          scroll-behavior:smooth;
        }
        .ig-feed-inner {
          max-width:486px;
          margin:0 auto;
          padding:24px 8px 60px;
        }

        /* ── Stories ── */
        .ig-stories-bar {
          background:rgba(255,255,255,.94)!important;
          border:1px solid rgba(216,227,236,.92)!important;
          border-radius:18px!important;
          padding:16px 18px 14px;
          margin-bottom:18px;
          display:flex;
          gap:18px;
          overflow-x:auto;
          box-shadow:0 18px 44px rgba(6,21,56,.055);
          position:relative;
        }
        .ig-stories-bar::before {
          content:"";
          position:absolute;
          top:0; left:0; right:0;
          height:1px;
          background:linear-gradient(90deg,transparent,rgba(116,179,206,0.28),transparent);
          border-radius:18px 18px 0 0;
        }
        .ig-stories-bar::-webkit-scrollbar { display:none; }
        .ig-story-wrap {
          display:flex;
          flex-direction:column;
          align-items:center;
          gap:6px;
          cursor:pointer;
          flex-shrink:0;
        }
        .ig-story-ring {
          width:66px;
          height:66px;
          border-radius:50%;
          padding:2.6px;
          background:conic-gradient(from 145deg,var(--sf-blue-dark) 0%,var(--sf-celeste) 35%,var(--sf-celeste-soft) 60%,var(--sf-celeste) 80%,var(--sf-blue-dark) 100%);
          transition:transform .18s cubic-bezier(.34,1.56,.64,1), filter .18s ease;
          box-shadow:0 8px 22px rgba(116,179,206,.22);
        }
        .ig-story-ring.seen {
          background:#D8E3EC;
          box-shadow:none;
        }
        .ig-story-ring:hover { transform:scale(1.08); filter:saturate(1.08); }
        .ig-story-ring.seen:hover { filter:none; transform:scale(1.04); }
        .ig-story-inner {
          width:100%;
          height:100%;
          border-radius:50%;
          border:2.5px solid #FFF;
          overflow:hidden;
          background:#F8FAFC;
        }
        .ig-story-inner img { width:100%; height:100%; object-fit:cover; display:block; }
        .ig-story-name {
          font-size:11.5px;
          color:var(--sf-blue-deep)!important;
          font-weight:600;
          max-width:70px;
          text-align:center;
          overflow:hidden;
          text-overflow:ellipsis;
          white-space:nowrap;
        }

        /* ── Posts ── */
        .ig-post {
          background:rgba(255,255,255,.96)!important;
          border:1px solid rgba(216,227,236,.92)!important;
          border-radius:18px!important;
          margin-bottom:18px;
          overflow:hidden;
          animation:fadeIn .4s ease both;
          box-shadow:0 18px 48px rgba(6,21,56,.055);
          transition:box-shadow .22s ease, transform .22s ease, border-color .22s ease;
        }
        .ig-post:hover {
          box-shadow:0 24px 58px rgba(6,21,56,.085);
          transform:translateY(-1px);
          border-color:rgba(116,179,206,.36)!important;
        }
        .tap-bounce { animation:likeBounce .26s cubic-bezier(.34,1.56,.64,1); }
        .ig-post button:active { transform:scale(.98); }
        .ig-post-header {
          display:flex;
          align-items:center;
          padding:12px 14px;
          gap:10px;
          background:linear-gradient(180deg,rgba(255,255,255,.98),rgba(248,250,252,.72));
          border-bottom:1px solid rgba(216,227,236,.5);
        }
        .ig-post-header svg { stroke:var(--sf-blue-deep)!important; }
        .ig-post-username {
          font-size:14px;
          font-weight:800;
          color:var(--sf-blue-dark)!important;
          line-height:1.2;
          letter-spacing:-.01em;
        }
        .ig-post-sublabel {
          font-size:12px;
          color:var(--sf-text-muted)!important;
          font-weight:500;
          line-height:1.2;
        }
        .ig-post-footer { padding:11px 14px 13px; }
        .ig-post-footer svg { stroke:var(--sf-blue-dark)!important; }
        .ig-post-caption {
          font-size:14px;
          color:var(--sf-blue-dark)!important;
          line-height:1.52;
          margin-bottom:7px;
          word-break:break-word;
        }
        .ig-post-caption b { font-weight:800; margin-right:5px; color:var(--sf-blue-dark)!important; }
        .ig-post-caption span { color:var(--sf-text-muted)!important; }
        .ig-post-see-comments {
          font-size:13.5px;
          color:var(--sf-text-muted)!important;
          cursor:pointer;
          margin-bottom:4px;
        }
        .ig-post-comment-preview {
          font-size:13.5px;
          color:var(--sf-blue-dark)!important;
          margin-bottom:4px;
          line-height:1.42;
        }
        .ig-post-comment-preview b { font-weight:800; margin-right:5px; }
        .ig-post-timestamp {
          font-size:10px;
          color:#7C8A99!important;
          text-transform:uppercase;
          letter-spacing:.45px;
          margin-top:7px;
          margin-bottom:9px;
        }
        .social-pill {
          border:1px solid rgba(216,227,236,.95)!important;
          background:#F8FAFC!important;
          color:var(--sf-text-muted)!important;
          border-radius:999px;
          padding:5px 9px;
          font-size:11px;
          font-weight:700;
        }

        .back-home {
          position:fixed;
          top:16px;
          left:16px;
          z-index:50;
          width:40px;
          height:40px;
          border-radius:999px;
          background:rgba(255,255,255,.92)!important;
          border:1px solid rgba(216,227,236,.95)!important;
          display:flex;
          align-items:center;
          justify-content:center;
          color:var(--sf-blue-dark)!important;
          text-decoration:none;
          box-shadow:0 12px 30px rgba(6,21,56,.12);
          transition:transform .15s ease, background .15s ease;
          backdrop-filter:blur(12px);
        }
        .back-home svg { stroke:var(--sf-blue-dark)!important; }
        .back-home:hover { transform:translateY(-1px); background:#FFF!important; }
        @media(min-width:769px){ .back-home{display:none;} }

        .ig-reel-frame {
          position:relative;
          width:100%;
          aspect-ratio:9/16;
          background:#000;
          overflow:hidden;
        }
        .ig-reel-frame iframe { position:absolute; inset:0; width:100%; height:100%; border:0; }

        /* Embed reel de Instagram dentro de un post */
        .reel-embed-shell {
          width:100%;
          background:#F8FAFC;
          border-top:1px solid #D8E3EC;
          border-bottom:1px solid #D8E3EC;
          overflow:hidden;
          display:flex;
          justify-content:center;
        }
        .reel-embed-shell iframe {
          width:100%;
          max-width:420px;
          min-height:640px;
          border:0;
          display:block;
          background:#FFFFFF;
        }
        @media(max-width:520px){
          .reel-embed-shell iframe { min-height:560px; }
        }
        .reel-embed-fallback {
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:12px;
          padding:10px 14px;
          background:#F8FAFC;
          border-bottom:1px solid #D8E3EC;
          font-size:12px;
          color:#5B6B7A;
        }
        .reel-embed-fallback a { text-decoration:none; }
        @media(max-width:420px){
          .reel-embed-fallback { flex-direction:column; align-items:flex-start; }
        }

        /* Decision post buttons */
        .ig-decision-btn {
          width:100%;
          padding:13px 16px;
          border-radius:12px!important;
          font-size:14px;
          font-weight:700;
          cursor:pointer;
          text-align:left;
          border:1px solid rgba(216,227,236,.95)!important;
          background:#F8FAFC!important;
          color:var(--sf-blue-dark)!important;
          transition:all .18s ease;
          font-family:inherit;
        }
        .ig-decision-btn:hover {
          background:#EEF6FB!important;
          border-color:rgba(116,179,206,.55)!important;
          transform:translateY(-1px);
          box-shadow:0 6px 14px rgba(6,21,56,.06);
        }
        .ig-decision-a:hover { color:var(--sf-blue-deep)!important; border-color:rgba(34,197,94,.45)!important; background:rgba(34,197,94,.06)!important; }
        .ig-decision-b:hover { color:var(--sf-blue-deep)!important; border-color:rgba(233,78,93,.45)!important; background:rgba(233,78,93,.06)!important; }

        /* ── Right panel ── */
        .ig-right {
          padding:30px 18px 32px 28px;
          position:sticky;
          top:0;
          height:100vh;
          overflow-y:auto;
          background:rgba(255,255,255,.72)!important;
          border-left:1px solid rgba(216,227,236,.82)!important;
          backdrop-filter:blur(18px);
          box-shadow:-12px 0 36px rgba(6,21,56,.025);
        }
        .ig-right button { color:var(--sf-celeste)!important; }
        .ig-right [style*="color: #000"], .ig-right [style*="color:#000"] { color:var(--sf-blue-dark)!important; }
        .ig-right [style*="color: #737373"], .ig-right [style*="color:#737373"] { color:var(--sf-text-muted)!important; }

        /* ── XP banner ── */
        .xp-banner {
          background:linear-gradient(135deg,rgba(255,255,255,.96),rgba(238,246,251,.98))!important;
          border:1px solid rgba(116,179,206,.22)!important;
          border-radius:18px!important;
          padding:15px 16px;
          margin-bottom:18px;
          display:flex;
          align-items:center;
          justify-content:space-between;
          box-shadow:0 18px 44px rgba(6,21,56,.055);
        }
        .xp-banner [style*="color: #000"], .xp-banner [style*="color:#000"] { color:var(--sf-blue-dark)!important; }
        .xp-banner [style*="color: #737373"], .xp-banner [style*="color:#737373"] { color:var(--sf-text-muted)!important; }
        .xp-banner [style*="background: #EFEFEF"], .xp-banner [style*="background:#EFEFEF"] { background:#D8E3EC!important; }
        .xp-banner [style*="background: rgb"], .xp-banner [style*="background: #74B3CE"], .xp-banner [style*="background:#74B3CE"] { background:linear-gradient(90deg,var(--sf-blue-dark),var(--sf-celeste))!important; }

        /* ══ BOTONES SAFENET — clases reutilizables ══ */
        .sf-btn {
          display:inline-flex;
          align-items:center;
          justify-content:center;
          gap:8px;
          border-radius:999px;
          padding:10px 18px;
          font-family:Inter,sans-serif;
          font-weight:700;
          font-size:13px;
          line-height:1;
          cursor:pointer;
          transition:transform .18s ease, box-shadow .18s ease, background .18s ease, border-color .18s ease, color .18s ease;
          text-decoration:none;
          white-space:nowrap;
          letter-spacing:.2px;
        }
        .sf-btn:active { transform:scale(.97); }
        .sf-btn-primary {
          background:#0B5CFF;
          color:#FFFFFF;
          border:1px solid #0B5CFF;
          box-shadow:0 8px 22px rgba(11,92,255,.22);
        }
        .sf-btn-primary:hover { background:#084ee0; border-color:#084ee0; transform:translateY(-1px); box-shadow:0 12px 26px rgba(11,92,255,.32); }
        .sf-btn-secondary {
          background:#FFFFFF;
          color:#061538;
          border:1.5px solid #D8E3EC;
        }
        .sf-btn-secondary:hover { background:#F8FAFC; border-color:#0B5CFF; color:#0B5CFF; }
        .sf-btn-ghost {
          background:rgba(11,92,255,.08);
          color:#0B5CFF;
          border:1px solid rgba(11,92,255,.28);
        }
        .sf-btn-ghost:hover { background:rgba(11,92,255,.14); border-color:#0B5CFF; }
        .sf-btn-danger {
          background:rgba(220,38,38,.08);
          color:#B91C1C;
          border:1px solid rgba(220,38,38,.30);
        }
        .sf-btn-danger:hover { background:rgba(220,38,38,.14); border-color:#B91C1C; }
        .sf-btn-success {
          background:rgba(22,163,74,.10);
          color:#15803D;
          border:1px solid rgba(22,163,74,.32);
        }
        .sf-btn-success:hover { background:rgba(22,163,74,.18); border-color:#15803D; }
        .sf-btn-icon {
          width:40px;
          height:40px;
          padding:0;
          border-radius:999px;
          background:#FFFFFF;
          color:#061538;
          border:1px solid #D8E3EC;
          display:inline-flex;
          align-items:center;
          justify-content:center;
          cursor:pointer;
          transition:transform .18s ease, background .18s ease, border-color .18s ease;
        }
        .sf-btn-icon:hover { background:#F8FAFC; border-color:#0B5CFF; color:#0B5CFF; transform:translateY(-1px); }
        .sf-btn-disabled,
        .sf-btn[disabled],
        .sf-btn:disabled {
          background:#F1F5F9!important;
          color:#94A3B8!important;
          border:1px solid #D8E3EC!important;
          cursor:not-allowed!important;
          opacity:1!important;
          box-shadow:none!important;
          transform:none!important;
        }
        .sf-btn-block { width:100%; padding:13px 18px; font-size:14px; border-radius:14px; }
        .sf-link {
          background:transparent;
          border:none;
          color:#0B5CFF;
          font-weight:700;
          font-size:13px;
          cursor:pointer;
          padding:4px 6px;
          border-radius:8px;
          transition:background .15s ease;
        }
        .sf-link:hover { background:rgba(11,92,255,.08); }

        /* ══ STORY VIEWER (capa modal independiente) ══ */
        .story-overlay {
          position:fixed;
          inset:0;
          z-index:9999;
          background:rgba(6,21,56,.78);
          backdrop-filter:blur(10px);
          display:flex;
          align-items:center;
          justify-content:center;
          padding:24px;
          animation:fadeIn .2s ease;
        }
        .story-viewer {
          position:relative;
          width:min(420px,100%);
          height:min(760px,92vh);
          border-radius:28px;
          overflow:hidden;
          background:#061538;
          box-shadow:0 30px 80px rgba(0,0,0,.4);
          animation:modalIn .3s cubic-bezier(.34,1.56,.64,1);
        }
        .story-close-btn {
          position:absolute;
          top:14px;
          right:14px;
          z-index:10001;
          width:42px;
          height:42px;
          border-radius:999px;
          border:1.5px solid rgba(255,255,255,.42);
          background:rgba(6,21,56,.72);
          color:#FFFFFF;
          display:inline-flex;
          align-items:center;
          justify-content:center;
          cursor:pointer;
          backdrop-filter:blur(8px);
          transition:background .18s ease, transform .18s ease, border-color .18s ease;
        }
        .story-close-btn:hover { background:#0B5CFF; border-color:#FFFFFF; transform:scale(1.05); }
        .story-nav-btn {
          position:absolute;
          top:50%;
          transform:translateY(-50%);
          z-index:10000;
          width:40px;
          height:40px;
          border-radius:999px;
          background:rgba(6,21,56,.55);
          border:1.5px solid rgba(255,255,255,.32);
          color:#FFFFFF;
          display:inline-flex;
          align-items:center;
          justify-content:center;
          cursor:pointer;
          backdrop-filter:blur(8px);
          transition:background .18s ease, border-color .18s ease, transform .18s ease;
        }
        .story-nav-btn:hover { background:#0B5CFF; border-color:#FFFFFF; }
        .story-nav-prev { left:14px; }
        .story-nav-next { right:14px; }
        .story-tap-zone {
          position:absolute;
          top:80px;
          bottom:80px;
          width:38%;
          z-index:5;
          background:transparent;
          border:none;
          cursor:pointer;
        }
        .story-tap-left { left:0; }
        .story-tap-right { right:0; width:42%; }

        /* ── Module overlay ── */
        .module-overlay {
          position:fixed;
          inset:0;
          z-index:200;
          background:rgba(6,21,56,.42);
          display:flex;
          align-items:center;
          justify-content:center;
          padding:20px;
          animation:fadeIn .25s ease;
          backdrop-filter:blur(8px);
        }
        .module-inner {
          max-width:560px;
          width:100%;
          max-height:90vh;
          overflow-y:auto;
          background:#FFFFFF;
          border:1px solid var(--sf-line);
          border-radius:22px;
          padding:28px;
          position:relative;
          animation:modalIn .35s cubic-bezier(.34,1.56,.64,1);
          box-shadow:0 30px 90px rgba(6,21,56,.18);
          color:var(--sf-blue-dark);
        }
        .module-inner h3, .module-inner strong, .module-inner b { color:var(--sf-blue-dark); }
        /* Overrides para que los módulos legacy hereden estética light SAFENET */
        .module-inner [style*="color: #FFF"],
        .module-inner [style*="color:#FFF"],
        .module-inner [style*="color: #FFFFFF"],
        .module-inner [style*="color:#FFFFFF"] { color:var(--sf-blue-dark)!important; }
        .module-inner [style*="color: rgba(255,255,255"],
        .module-inner [style*="color:rgba(255,255,255"] { color:var(--sf-text-muted)!important; }
        .module-inner [style*="background: rgba(0,0,0"],
        .module-inner [style*="background:rgba(0,0,0"] { background:var(--sf-bg)!important; }
        .module-inner [style*="background: rgba(116,179,206,0.1"],
        .module-inner [style*="background:rgba(116,179,206,0.1"],
        .module-inner [style*="background: rgba(116,179,206,0.08"],
        .module-inner [style*="background:rgba(116,179,206,0.08"],
        .module-inner [style*="background: rgba(116,179,206,0.09"],
        .module-inner [style*="background:rgba(116,179,206,0.09"] { background:var(--sf-celeste)!important; }
        .module-inner [style*="background: rgba(255,255,255,0.03"],
        .module-inner [style*="background:rgba(255,255,255,0.03"],
        .module-inner [style*="background: rgba(255,255,255,0.04"],
        .module-inner [style*="background:rgba(255,255,255,0.04"],
        .module-inner [style*="background: rgba(255,255,255,0.05"],
        .module-inner [style*="background:rgba(255,255,255,0.05"] { background:#FFFFFF!important; }
        .module-inner [style*="background: rgba(90,153,180"],
        .module-inner [style*="background:rgba(90,153,180"] { background:var(--sf-blue)!important; color:#FFF!important; }
        .module-inner [style*="border: 1px solid rgba(255,255,255"],
        .module-inner [style*="border:1px solid rgba(255,255,255"],
        .module-inner [style*="border: 1px solid rgba(116,179,206,0.1"],
        .module-inner [style*="border:1px solid rgba(116,179,206,0.1"],
        .module-inner [style*="border: 1px solid rgba(116,179,206,0.12"],
        .module-inner [style*="border:1px solid rgba(116,179,206,0.12"],
        .module-inner [style*="border: 1px solid rgba(116,179,206,0.15"],
        .module-inner [style*="border:1px solid rgba(116,179,206,0.15"] { border-color:var(--sf-line)!important; }
        .module-inner button[style*="background: rgb"][style*="color: #FFF"],
        .module-inner button[style*="background:#74B3CE"] { background:var(--sf-blue)!important; color:#FFF!important; font-family:'Space Grotesk',Inter,sans-serif!important; }

        /* ── Mobile bottom nav ── */
        .bottom-nav {
          display:none;
          position:fixed;
          bottom:0;
          left:0;
          right:0;
          height:66px;
          background:rgba(255,255,255,.92)!important;
          border-top:1px solid rgba(216,227,236,.95)!important;
          z-index:100;
          align-items:center;
          justify-content:space-around;
          padding:0 8px max(0px,env(safe-area-inset-bottom));
          backdrop-filter:blur(18px);
          box-shadow:0 -14px 34px rgba(6,21,56,.08);
        }
        @media(max-width:768px){ .bottom-nav{display:flex;} }
        .bottom-nav-item {
          display:flex;
          flex-direction:column;
          align-items:center;
          justify-content:center;
          gap:3px;
          padding:6px 12px;
          border-radius:13px;
          cursor:pointer;
          border:none;
          background:none;
          transition:background .15s ease, opacity .15s ease, transform .15s ease;
          position:relative;
          color:var(--sf-blue-dark);
        }
        .bottom-nav-item::before {
          content:"";
          position:absolute;
          top:-1px;
          left:50%;
          transform:translateX(-50%) scaleX(0);
          width:22px;
          height:2px;
          border-radius:0 0 4px 4px;
          background:linear-gradient(90deg,var(--sf-blue-dark),var(--sf-celeste));
          transition:transform .22s ease;
        }
        .bottom-nav-item.active-tab::before { transform:translateX(-50%) scaleX(1); }
        .bottom-nav-item svg { stroke:var(--sf-blue-deep)!important; }
        .bottom-nav-item:hover { background:#EEF6FB; }
        .bottom-nav-item:active { opacity:.72; transform:scale(.98); }
        .bottom-nav-label { font-size:10px; color:var(--sf-text-muted)!important; font-weight:600; }
        .bottom-nav-label.active { color:var(--sf-blue-dark)!important; font-weight:800; }
        .bottom-nav-label.active + .dm-badge { animation:softPulse 1.8s ease infinite; }

        .dm-badge {
          position:absolute;
          top:4px;
          right:10px;
          width:16px;
          height:16px;
          border-radius:50%;
          background:var(--sf-danger)!important;
          border:2px solid #FFF!important;
          font-size:9px;
          font-weight:800;
          color:#FFF;
          display:flex;
          align-items:center;
          justify-content:center;
        }

        @media(max-width:520px){
          .ig-feed-inner{padding-left:10px!important;padding-right:10px!important;}
          .ig-stories-bar{margin-left:-2px;margin-right:-2px;}
          .ig-story-ring{width:62px;height:62px;}
          .module-inner{padding:24px 18px;border-radius:22px;}
        }
      `}</style>

      <Link href="/" className="back-home" aria-label="Volver al inicio">
        <ArrowLeft size={20} strokeWidth={2.2} />
      </Link>

      {/* ══════════════════════════════════════════════════════
          SETUP SCREEN
      ══════════════════════════════════════════════════════ */}
      {view === "setup" && (
        <div
          style={{
            minHeight: "100vh",
            background: `radial-gradient(circle at 18% 12%, ${C.celeste} 0%, transparent 38%), radial-gradient(circle at 82% 88%, #dfe7fb 0%, transparent 42%), ${C.bgSoft}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 440,
              background: C.white,
              border: `1px solid ${C.line}`,
              borderRadius: 22,
              padding: "44px 38px",
              boxShadow: "0 30px 80px rgba(6,21,56,0.10)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
              <ShieldCheck size={22} color={C.blue} strokeWidth={2.4} />
              <span style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 14, color: C.blueDark, letterSpacing: 0.4 }}>SAFENET</span>
            </div>
            <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 1.6, color: C.blue, marginBottom: 8, fontWeight: 700 }}>
              Tu identidad
            </div>
            <h2 style={{ fontFamily: FONT_DISPLAY, fontSize: 24, color: C.blueDark, marginBottom: 10, fontWeight: 700, lineHeight: 1.2 }}>
              ¿Con qué nombre entrás?
            </h2>
            <p style={{ fontSize: 13.5, color: C.textMute, marginBottom: 28, lineHeight: 1.5 }}>
              Creá tu usuario para entrar a la red social simulada de SAFENET. Es una simulación segura para entrenar tu ojo.
            </p>
            <div style={{ position: "relative", marginBottom: 16 }}>
              <span style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", color: C.textSoft, fontSize: 16, fontWeight: 600 }}>@</span>
              <input
                suppressHydrationWarning
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, "").slice(0, 20))}
                placeholder="tu_usuario"
                style={{
                  width: "100%",
                  padding: "15px 16px 15px 34px",
                  borderRadius: 12,
                  background: C.bgSoft,
                  border: `1px solid ${C.line}`,
                  color: C.blueDark,
                  outline: "none",
                  fontSize: 15,
                  fontWeight: 500,
                }}
              />
            </div>
            <button
              suppressHydrationWarning
              disabled={username.length < 3}
              onClick={() => setView("world")}
              style={{
                width: "100%",
                padding: 15,
                borderRadius: 12,
                background: username.length >= 3 ? C.blue : C.lineSoft,
                color: username.length >= 3 ? C.white : C.textSoft,
                border: "none",
                fontFamily: FONT_DISPLAY,
                fontSize: 14,
                fontWeight: 700,
                cursor: username.length >= 3 ? "pointer" : "not-allowed",
                boxShadow: username.length >= 3 ? "0 10px 24px rgba(11,92,255,0.22)" : "none",
                letterSpacing: 0.3,
                transition: "transform 0.18s ease, box-shadow 0.18s ease",
              }}
            >
              Entrar a la simulación
            </button>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════
          INSTAGRAM HYBRID FEED
      ══════════════════════════════════════════════════════ */}
      {(view === "intro" || view === "world") && (
        <div className="ig-shell">
          {/* ── Sidebar ── */}
          <aside className="ig-sidebar">
            <Link href="/" className="ig-sidebar-logo" style={{ textDecoration: "none" }} aria-label="Volver al inicio">
              <ShieldCheck size={24} color="#061538" strokeWidth={2.5} />
              <span
                style={{
                  fontFamily: "'Space Grotesk',Inter,sans-serif",
                  fontSize: 16,
                  fontWeight: "bold",
                  color: "#061538",
                }}
              >
                SAFENET
              </span>
            </Link>
            <nav style={{ display: "flex", flexDirection: "column", flex: 1 }}>
              {[
                { Icon: Home, label: "Inicio", tab: "home" as NavTab, active: activeTab === "home" },
                { Icon: Search, label: "Buscar", tab: "search" as NavTab },
                { Icon: Compass, label: "Explorar", tab: "search" as NavTab },
                {
                  Icon: MessageCircle,
                  label: "Mensajes",
                  tab: "dm" as NavTab,
                  badge: completedModules.has("dm_sim") ? 0 : 5,
                },
                {
                  Icon: UserPlus,
                  label: "Solicitudes",
                  tab: "requests" as NavTab,
                  badge: completedModules.has("requests") ? 0 : requestsPending,
                },
                { Icon: Heart, label: "Notificaciones", tab: "home" as NavTab },
                { Icon: PlusSquare, label: "Crear", tab: "home" as NavTab },
                { Icon: User, label: "Perfil", tab: "profile" as NavTab },
              ].map(({ Icon, label, tab, active, badge }) => (
                <div
                  key={label}
                  className={`ig-nav-item ${active ? "active" : ""}`}
                  onClick={() => {
                    if (label === "Mensajes") {
                      setShowDmInbox(true);
                      setActiveTab("dm");
                    } else if (label === "Solicitudes") {
                      setShowRequests(true);
                      setActiveTab("requests");
                    }
                  }}
                  style={{ position: "relative" }}
                >
                  <Icon
                    size={24}
                    strokeWidth={active ? 2.5 : 1.8}
                    color="#061538"
                  />
                  <span className="ig-nav-label">{label}</span>
                  {badge ? (
                    <div
                      style={{
                        position: "absolute",
                        top: 8,
                        left: 28,
                        width: 16,
                        height: 16,
                        borderRadius: "50%",
                        background: "#E94E5D",
                        border: "2px solid #FFFFFF",
                        fontSize: 9,
                        fontWeight: 700,
                        color: "#FFF",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {badge}
                    </div>
                  ) : null}
                </div>
              ))}
            </nav>
            <div style={{ marginTop: "auto" }}>
              {view === "world" && (
                <div
                  style={{
                    padding: "12px 14px",
                    marginBottom: 8,
                    background:
                      "linear-gradient(135deg,rgba(116,179,206,0.14) 0%,rgba(238,246,251,0.95) 100%)",
                    borderRadius: 12,
                    border: "1px solid rgba(116,179,206,0.22)",
                    boxShadow: "0 4px 14px rgba(116,179,206,0.08)",
                  }}
                >
                  <div
                    style={{
                      fontSize: 10,
                      color: "#5B6B7A",
                      marginBottom: 4,
                      fontWeight: 700,
                      letterSpacing: 1.1,
                      textTransform: "uppercase",
                    }}
                  >
                    Sesión activa
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#061538" }}>
                    @{username}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: ACCENT_DIM,
                      fontWeight: 800,
                      marginTop: 4,
                      letterSpacing: 0.3,
                    }}
                  >
                    {xp} XP
                  </div>
                </div>
              )}
              <div className="ig-nav-item">
                <Menu size={24} strokeWidth={1.8} color="#061538" />
                <span className="ig-nav-label">Más</span>
              </div>
            </div>
          </aside>

          {/* ── Feed ── */}
          <div className="ig-feed-area">
            <div className="ig-feed-inner">
              {/* Prompt de inicio si no hay username */}
              {view === "intro" && (
                <div
                  style={{
                    background: "#FFF",
                    border: "1px solid #D8E3EC",
                    borderRadius: 18,
                    padding: "28px 22px",
                    marginBottom: 20,
                    textAlign: "center",
                    boxShadow: "0 18px 44px rgba(6,21,56,0.055)",
                  }}
                >
                  <ShieldCheck
                    size={32}
                    color={ACCENT}
                    style={{ marginBottom: 12 }}
                  />
                  <div
                    style={{
                      fontSize: 16,
                      fontWeight: 700,
                      color: "#061538",
                      marginBottom: 8,
                    }}
                  >
                    Bienvenido a Safenet
                  </div>
                  <div
                    style={{
                      fontSize: 14,
                      color: "#5B6B7A",
                      marginBottom: 16,
                      lineHeight: 1.5,
                    }}
                  >
                    Un feed parecido al de todos los días.
                    <br />
                    La diferencia es que acá entrenás el ojo sin darte cuenta.
                  </div>
                  <button
                    suppressHydrationWarning
                    onClick={() => setView("setup")}
                    style={{
                      background:
                        "#0B5CFF",
                      color: "#FFF",
                      border: "none",
                      borderRadius: 10,
                      padding: "12px 26px",
                      fontSize: 14,
                      fontWeight: 700,
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      fontFamily: "inherit",
                      boxShadow: "0 8px 20px rgba(116,179,206,0.32)",
                      letterSpacing: 0.2,
                      transition: "transform 0.18s ease, box-shadow 0.18s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-1px)";
                      e.currentTarget.style.boxShadow =
                        "0 12px 26px rgba(116,179,206,0.42)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow =
                        "0 8px 20px rgba(116,179,206,0.32)";
                    }}
                  >
                    Continuar <ArrowRight size={16} />
                  </button>
                </div>
              )}

              {/* XP progress */}
              {view === "world" && (
                <div className="xp-banner">
                  <div>
                    <div
                      style={{
                        fontSize: 10.5,
                        color: "#5B6B7A",
                        fontWeight: 700,
                        letterSpacing: 1.2,
                        textTransform: "uppercase",
                        marginBottom: 2,
                      }}
                    >
                      Lecturas del feed
                    </div>
                    <div
                      style={{
                        fontSize: 16,
                        fontWeight: 800,
                        color: "#061538",
                        letterSpacing: -0.2,
                      }}
                    >
                      {xp} XP · {completedModules.size}/6 señales
                    </div>
                    <div
                      style={{
                        fontSize: 11.5,
                        color: "#5B6B7A",
                        fontStyle: "italic",
                        marginTop: 4,
                        lineHeight: 1.4,
                      }}
                    >
                      Tu radar digital se entrena con cada decisión.
                    </div>
                  </div>
                  <div
                    style={{
                      flex: 1,
                      margin: "0 16px",
                      height: 6,
                      background: "#D8E3EC",
                      borderRadius: 99,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${Math.min(100, Math.round((completedModules.size / 6) * 100))}%`,
                        background:
                          "linear-gradient(90deg,#102A43 0%,#74B3CE 100%)",
                        borderRadius: 99,
                        transition: "width 0.8s ease",
                      }}
                    />
                  </div>
                  <div style={{ fontSize: 12, color: "#5A99B4", fontWeight: 800, letterSpacing: 0.3 }}>
                    {Math.round((completedModules.size / 6) * 100)}%
                  </div>
                </div>
              )}

              {/* ── STORIES ── */}
              <div className="ig-stories-bar">
                {STORIES_DATA.map((story, i) => {
                  const user = USERS[story.user];
                  const seen = seenStories.has(i);
                  return (
                    <div
                      key={i}
                      className="ig-story-wrap"
                      onClick={() => setActiveStoryIndex(i)}
                    >
                      <div className={`ig-story-ring ${seen ? "seen" : ""}`}>
                        <div className="ig-story-inner">
                          <img src={user.avatar} alt={user.handle} />
                        </div>
                      </div>
                      <span className="ig-story-name">{user.handle}</span>
                    </div>
                  );
                })}
              </div>

              {/* ── MISIÓN DEL DÍA — Semana SAFENET ── */}
              <MissionBriefCard
                mission={currentMission}
                completedCount={completedModules.size}
                onStart={openMission}
              />

              {/* ═══════════════════════════════════════════
                  FEED POSTS — ORDEN INTERCALADO
              ═══════════════════════════════════════════ */}

              {/* 1. CYBERCOUPLE — TikTok deepfake */}
              <OngReelPost
                source="cybercouple"
                time="3 h"
                reelUrl="https://www.tiktok.com/@tecnologiaparami/video/7589051546172738836"
                reelEmbedUrl="https://www.tiktok.com/embed/v2/7589051546172738836"
                reelTitle="Video sobre deepfakes y violencia digital"
                likeCount={378}
                caption={
                  <>
                    <b>cybercouple</b>{" "}Los deepfakes también pueden usarse para manipular, engañar o ejercer violencia digital. Mirá este ejemplo y aprendé por qué es importante verificar antes de confiar.
                    <br />
                    <br />
                    El Deep Fake es una forma de violencia digital que sufren, en su mayoría, niñas y adolescentes. Parece real, pero es falso. Parece broma, pero es abuso.
                    <br />
                    <br />
                    #Grooming #Ciberseguridad #InfanciasDigitales #Deepfakes
                  </>
                }
                comments={[
                  {
                    user: USERS.andrea.handle,
                    text: " Fundamental acompañarlos en el mundo digital.",
                  },
                  { user: USERS.valen.handle, text: " Lo comparto." },
                ]}
                timestamp="36 semanas"
                fallbackText="Si el video no carga, podés verlo en TikTok."
                fallbackCta="Ver video en TikTok"
              />

              {/* 1B. INFOBAE — video integrado */}
              <ReelPost
                user="juani"
                externalSource="infobae"
                time="4 h"
                videoId="5eAW5BY7Xyc"
                likeCount={1487}
                caption={
                  <>
                    <b>infobae</b>{" "}
                    Esto parece un reel más, pero pasa todos los días: alguien se acerca, halaga, gana confianza y después pide algo que no debería pedir.
                  </>
                }
                comments={[
                  {
                    user: USERS.sofi.handle,
                    text: " Esto posta puede pasar sin que te des cuenta.",
                  },
                  {
                    user: USERS.valen.handle,
                    text: " El cambio de app siempre me hace ruido.",
                  },
                ]}
                timestamp="hace 4 horas"
              />

              {/* 2. POST EDUCATIVO — Perfiles falsos con IA */}
              <FakeProfileReelPost />

              {/* 3. DECISIÓN RÁPIDA */}
              <DecisionPost
                user="juani"
                time="7 h"
                question="¿Aceptarías esta solicitud de seguimiento?"
                context="Perfil creado hace 2 semanas. 12K seguidores, 3 publicaciones, siguiendo solo 8 cuentas."
                optA="No, me hace ruido"
                optB="Sí, lo acepto"
                explanation="Un ratio tan desproporcionado entre seguidores y seguidos, con tan pocas publicaciones y cuenta reciente, son señales clásicas de un perfil comprado o falso."
              />

              {/* 4. ONG — deepfake (reel embebido) */}
              <OngReelPost
                time="1 d"
                reelUrl="https://www.instagram.com/reel/DYDk0KiIYAU/"
                reelEmbedUrl="https://www.instagram.com/reel/DYDk0KiIYAU/embed"
                reelTitle="Reel de Grooming Argentina sobre deepfake"
                likeCount={214}
                caption={
                  <>
                    <b>groomingargentina</b>La IA también se usa para hacerle
                    daño a menores.
                    <br />
                    <br />
                    El #Deepfake permite crear imágenes íntimas falsas pero
                    hiperreales. El 90% están relacionados a contenido sexual.
                    Protejamos la huella digital de los más chicos.
                    <br />
                    <br />
                    #InteligenciaArtificial #SeguridadDigital
                  </>
                }
                comments={[
                  {
                    user: USERS.ia.handle,
                    text: " Hay que estar muy atentos en escuelas y casas.",
                  },
                  {
                    user: USERS.mateo.handle,
                    text: " No sabía que era tan grave este tema.",
                  },
                ]}
                timestamp="22 de agosto de 2025"
              />

              {/* 5. POST EDUCATIVO — Carrusel señales */}
              <CarouselSignalsPost />

              {/* 5C. POST EMOCIONAL — Presión */}
              <EmotionalPressurePost />

              {/* 6. DECISIÓN RÁPIDA */}
              <DecisionPost
                user="mateo"
                time="2 d"
                question="Te pide que no le cuentes nada a nadie sobre la conversación."
                context="Llevan una semana hablando. Dice que con vos puede hablar de todo. Hoy te pidió que fuera un secreto entre los dos."
                optA="Me hace ruido, no lo guardo en secreto"
                optB="Es normal, quiere privacidad"
                explanation="El pedido de secreto es una de las señales más claras de grooming. Es una táctica para aislarte de las personas que podrían ayudarte."
              />

              {/* 7. EXPERIENCIA — Historia interactiva */}
              <ExperiencePost
                moduleId="story_path"
                user="lucas"
                time="2 d"
                headline="Una conversación empezó bien… y cambió."
                subline="Cada respuesta mueve la historia."
                ctaLabel="Tocar historia"
                likeCount={1240}
                visualType="story"
                onStart={openModule}
              />

              {/* 8. ONG — amor/manipulación */}
              <OngPost
                time="2 d"
                imgSrc="/ime3.png"
                imgAlt="No siempre del otro lado está el amor"
                likeCount={1240}
                likedBy={USERS.caro.handle}
                caption={
                  <>
                    <b>groomingargentina</b>Alguien que te habla solo por
                    internet y dice que te quiere... puede ser una trampa.
                    <br />
                    <br />
                    Personas adultas se hacen pasar por adolescentes para ganar
                    confianza. Si alguien te pide secreto o material íntimo,
                    hablalo con un adulto.
                    <br />
                    <br />
                    #Grooming #RedFlag #SeguridadDigital
                  </>
                }
                comments={[
                  {
                    user: USERS.edu.handle,
                    text: " Esto debería hablarse en todos los colegios.",
                  },
                  {
                    user: USERS.carlos.handle,
                    text: " Muy importante compartir esto, gracias.",
                  },
                ]}
                timestamp="14 de febrero de 2025"
              />

              {/* 9. EXPERIENCIA — Me hace ruidos */}
              <ExperiencePost
                moduleId="red_flags"
                user="caro"
                time="3 d"
                headline="Mensajes que parecen tranqui, pero no tanto."
                subline="Marcá lo que te hace ruido."
                ctaLabel="Revisar mensajes"
                likeCount={487}
                visualType="redflag"
                onStart={openModule}
              />

              {/* 10. DECISIÓN RÁPIDA */}
              <DecisionPost
                user="edu"
                time="3 d"
                question="Te pide pasar la conversación a Telegram."
                context='"Instagram me shadowbannea los mensajes. Te explico todo por Telegram." ¿Seguís hablando ahí?'
                optA="No, sigo acá"
                optB="Dale, lo instalo ahora"
                explanation="Pedir cambiar de plataforma elimina el historial y los sistemás de reporte. Quedarte en la app donde empezó la conversación es lo correcto."
              />

              {/* 12. RECURSO — Línea de ayuda */}
              <ResourcePost />

              {/* Footer del feed */}
              <div
                style={{
                  textAlign: "center",
                  padding: "36px 0 20px",
                  color: "#9AA8B7",
                  fontSize: 11,
                  borderTop: "1px solid rgba(216,227,236,0.7)",
                  marginTop: 8,
                  letterSpacing: 1.2,
                  textTransform: "uppercase",
                  fontWeight: 600,
                }}
              >
                © 2026 SAFENET
              </div>
            </div>
          </div>

          {/* ── Panel Derecho ── */}
          <div className="ig-right">
            {view === "world" ? (
              <>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    marginBottom: 24,
                  }}
                >
                  <div
                   style={
                    {
                      width: 44,
                      height: 44,
                      borderRadius: "50%",
                      overflow: "hidden",
                      position: "relative",
                      flexShrink: 0,
                      background: "#D8E3EC",
                      }} > 
                    <Image
                    src="/safenet.png"
                    alt="Perfil de usuario"
                    fill
                    style={{ objectFit: "cover" }}
                    sizes="44px"
                    />
                    </div>
                  
                  <div style={{ flex: 1 }}>
                    <div
                      style={{ fontWeight: 600, fontSize: 14, color: "#061538" }}
                    >
                      @{username}
                    </div>
                    <div style={{ fontSize: 14, color: "#5B6B7A" }}>
                      Perfil activo
                    </div>
                  </div>
                </div>
                {/* Semana SAFENET — lista de 7 días */}
                <div
                  style={{
                    fontSize: 10.5,
                    fontWeight: 700,
                    color: "#5B6B7A",
                    marginBottom: 12,
                    letterSpacing: 1.2,
                    textTransform: "uppercase",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <span style={{ flex: "0 0 auto" }}>Semana SAFENET</span>
                  <span
                    aria-hidden
                    style={{
                      flex: 1,
                      height: 1,
                      background:
                        "linear-gradient(90deg,rgba(11,92,255,0.32),transparent)",
                    }}
                  />
                </div>
                <div style={{ marginBottom: 22 }}>
                  {WEEK_MISSIONS.map((m) => {
                    const isDone =
                      m.moduleId !== null && completedModules.has(m.moduleId);
                    const allDone = completedModules.size >= 6;
                    const isCurrent =
                      m.day === currentMission.day &&
                      !(m.moduleId === null && !allDone);
                    const isPending = !isDone && !isCurrent;
                    return (
                      <div
                        key={m.day}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          padding: "7px 10px",
                          marginBottom: 4,
                          borderRadius: 10,
                          background: isCurrent ? "#EEF2FF" : "transparent",
                          border: isCurrent
                            ? "1px solid #c7d4f7"
                            : "1px solid transparent",
                          opacity: isPending ? 0.55 : 1,
                          transition: "background .2s ease",
                        }}
                      >
                        <div
                          style={{
                            width: 22,
                            height: 22,
                            borderRadius: "50%",
                            background: isDone
                              ? "#22C55E"
                              : isCurrent
                              ? "#0B5CFF"
                              : "#EEF2F7",
                            color: isDone || isCurrent ? "#FFF" : "#7C8A99",
                            fontSize: 11,
                            fontWeight: 800,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                            boxShadow: isCurrent
                              ? "0 0 0 3px rgba(11,92,255,0.18)"
                              : isDone
                              ? "0 0 0 3px rgba(34,197,94,0.18)"
                              : "none",
                          }}
                        >
                          {isDone ? <Check size={12} strokeWidth={3} /> : m.day}
                        </div>
                        <span
                          style={{
                            fontSize: 13.5,
                            color: isDone
                              ? "#7C8A99"
                              : isCurrent
                              ? "#061538"
                              : "#5B6B7A",
                            fontWeight: isCurrent ? 700 : 600,
                            textDecoration: isDone ? "line-through" : "none",
                          }}
                        >
                          {m.title}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Progreso de módulos */}
                <div
                  style={{
                    fontSize: 10.5,
                    fontWeight: 700,
                    color: "#5B6B7A",
                    marginBottom: 14,
                    letterSpacing: 1.2,
                    textTransform: "uppercase",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <span style={{ flex: "0 0 auto" }}>Movimientos para revisar</span>
                  <span
                    aria-hidden
                    style={{
                      flex: 1,
                      height: 1,
                      background:
                        "linear-gradient(90deg,rgba(116,179,206,0.32),transparent)",
                    }}
                  />
                </div>
                {(
                  [
                    { id: "dm_sim", label: "Solicitud de mensaje" },
                    { id: "requests", label: "Solicitudes" },
                    { id: "profile_detector", label: "Perfil nuevo" },
                    { id: "story_path", label: "Historia pendiente" },
                    { id: "red_flags", label: "Mensajes raros" },
                    { id: "screenshot_analysis", label: "Captura compartida" },
                  ] as { id: ModuleId; label: string }[]
                ).map((m) => (
                  <div
                    key={m.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: 12,
                    }}
                  >
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 10 }}
                    >
                      <div
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          background: completedModules.has(m.id)
                            ? "#22C55E"
                            : "#D8E3EC",
                          boxShadow: completedModules.has(m.id)
                            ? "0 0 0 3px rgba(34,197,94,0.18)"
                            : "none",
                          flexShrink: 0,
                        }}
                      />
                      <span
                        style={{
                          fontSize: 14,
                          color: completedModules.has(m.id)
                            ? "#7C8A99"
                            : "#061538",
                          fontWeight: completedModules.has(m.id) ? 500 : 600,
                          textDecoration: completedModules.has(m.id)
                            ? "line-through"
                            : "none",
                        }}
                      >
                        {m.label}
                      </span>
                    </div>
                    {completedModules.has(m.id) && (
                      <Check size={14} color="#22C55E" strokeWidth={2.5} />
                    )}
                  </div>
                ))}
              </>
            ) : (
              <>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 24,
                  }}
                >
                  <div>
                    <div
                      style={{ fontWeight: 600, fontSize: 14, color: "#061538" }}
                    >
                      tu_usuario
                    </div>
                    <div style={{ fontSize: 14, color: "#5B6B7A" }}>
                      Tu Perfil
                    </div>
                  </div>
                  <button
                    suppressHydrationWarning
                    onClick={() => setView("setup")}
                    style={{
                      color: ACCENT_DIM,
                      fontWeight: 700,
                      fontSize: 12,
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    Cambiar
                  </button>
                </div>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: "#5B6B7A",
                    marginBottom: 16,
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <span>Sugerencias para vos</span>
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: "#061538",
                      cursor: "pointer",
                    }}
                  >
                    Ver todo
                  </span>
                </div>
                {[
                  {
                    user: USERS.sofi,
                    desc: `Seguido por ${USERS.valen.handle} + 3 más`,
                  },
                  { user: USERS.juani, desc: "Tips para adolescentes" },
                  {
                    user: USERS.mateo,
                    desc: `Seguido por ${USERS.caro.handle} + 1 más`,
                  },
                  {
                    user: USERS.edu,
                    desc: "Aprendiendo sobre seguridad digital",
                  },
                  { user: USERS.lucas, desc: "Sugerencia para ti" },
                ].map(({ user, desc }, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: 14,
                    }}
                  >
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 12 }}
                    >
                      <Avatar src={user.avatar} size={32} />
                      <div>
                        <div
                          style={{
                            fontWeight: 600,
                            fontSize: 14,
                            color: "#061538",
                          }}
                        >
                          {user.handle}
                        </div>
                        <div
                          style={{
                            fontSize: 12,
                            color: "#5B6B7A",
                            maxWidth: 160,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {desc}
                        </div>
                      </div>
                    </div>
                    <button
                      suppressHydrationWarning
                      style={{
                        color: ACCENT_DIM,
                        fontWeight: 700,
                        fontSize: 12,
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      Seguir
                    </button>
                  </div>
                ))}
              </>
            )}
            <div
              style={{
                marginTop: 24,
                fontSize: 11,
                color: "#9AA8B7",
                lineHeight: 1.8,
              }}
            >
              Información · Ayuda · Privacidad · Condiciones
              <br />© 2026 SAFENET
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════
          BOTTOM NAV (mobile)
      ══════════════════════════════════════════════════════ */}
      {(view === "intro" || view === "world") && (
        <nav className="bottom-nav">
          {(
            [
              { tab: "home" as NavTab, Icon: Home, label: "Inicio" },
              { tab: "search" as NavTab, Icon: Search, label: "Buscar" },
              {
                tab: "requests" as NavTab,
                Icon: UserPlus,
                label: "Solicitudes",
                badge: completedModules.has("requests") ? 0 : requestsPending,
              },
              {
                tab: "dm" as NavTab,
                Icon: MessageCircle,
                label: "Mensajes",
                badge: completedModules.has("dm_sim") ? 0 : 5,
              },
              { tab: "profile" as NavTab, Icon: User, label: "Perfil" },
            ] as {
              tab: NavTab;
              Icon: any;
              label: string;
              badge?: number;
            }[]
          ).map(({ tab, Icon, label, badge }) => (
            <button
              key={tab}
              suppressHydrationWarning
              className={`bottom-nav-item ${activeTab === tab ? "active-tab" : ""}`}
              onClick={() => handleNavClick(tab)}
            >
              <Icon
                size={24}
                strokeWidth={activeTab === tab ? 2.5 : 1.8}
                color={activeTab === tab ? "#061538" : "#5B6B7A"}
              />
              <span
                className={`bottom-nav-label ${activeTab === tab ? "active" : ""}`}
              >
                {label}
              </span>
              {badge ? <div className="dm-badge">{badge}</div> : null}
            </button>
          ))}
        </nav>
      )}

      {/* ══════════════════════════════════════════════════════
          STORY VIEWER MODAL
      ══════════════════════════════════════════════════════ */}
      {activeStoryIndex !== null && (
        <StoryViewer
          stories={STORIES_DATA}
          startIndex={activeStoryIndex}
          onClose={() => setActiveStoryIndex(null)}
          seenSet={seenStories}
          onSeen={handleStorySeen}
        />
      )}

      {/* ══════════════════════════════════════════════════════
          DM INBOX
      ══════════════════════════════════════════════════════ */}
      {showDmInbox && !showDmChat && (
        <DmInbox
          onOpenStranger={() => setShowDmChat(true)}
          onClose={() => {
            setShowDmInbox(false);
            setActiveTab("home");
          }}
        />
      )}

      {/* ══════════════════════════════════════════════════════
          DM CHAT VIEW
      ══════════════════════════════════════════════════════ */}
      {showDmChat && (
        <DmChatView
          onComplete={handleDmComplete}
          onXp={handleXp}
          onBack={() => setShowDmChat(false)}
        />
      )}

      {/* ══════════════════════════════════════════════════════
          REQUESTS VIEW
      ══════════════════════════════════════════════════════ */}
      {showRequests && (
        <RequestsView
          onClose={() => {
            setShowRequests(false);
            setActiveTab("home");
          }}
          onComplete={handleRequestsComplete}
          onXp={handleXp}
          onAction={() => setRequestsPending((p) => Math.max(0, p - 1))}
        />
      )}

      {/* ══════════════════════════════════════════════════════
          MODAL DE MÓDULOS 
      ══════════════════════════════════════════════════════ */}
      {activeModule && (
        <div className="module-overlay">
          <div className="module-inner">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 22,
                paddingBottom: 18,
                borderBottom: `1px solid ${C.lineSoft}`,
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 11,
                    textTransform: "uppercase",
                    letterSpacing: 1.6,
                    color: C.blue,
                    marginBottom: 6,
                    fontWeight: 700,
                  }}
                >
                  {
                    {
                      dm_sim: "Mensaje directo",
                      profile_detector: "Perfil",
                      story_path: "Historia",
                      red_flags: "Señales",
                      screenshot_analysis: "Captura",
                      requests: "Solicitudes",
                    }[activeModule]
                  }
                </div>
                <div
                  style={{
                    fontFamily: FONT_DISPLAY,
                    fontSize: 18,
                    color: C.blueDark,
                    fontWeight: 700,
                  }}
                >
                  {
                    {
                      dm_sim: "Seguí la conversación",
                      profile_detector: "¿Lo aceptarías?",
                      story_path: "Lo que harías después",
                      red_flags: "¿Te hace ruido?",
                      screenshot_analysis: "Qué responderías",
                      requests: "Revisión de seguimiento",
                    }[activeModule]
                  }
                </div>
              </div>
              <button
                suppressHydrationWarning
                onClick={() => setActiveModule(null)}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  background: C.bgSoft,
                  border: `1px solid ${C.line}`,
                  color: C.blueDark,
                  fontSize: 16,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = C.celeste;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = C.bgSoft;
                }}
              >
                <X size={18} strokeWidth={2.2} />
              </button>
            </div>
            {activeModule === "dm_sim" && (
              <DmSimModule
                onComplete={(pts) => handleComplete("dm_sim", pts)}
                onXp={handleXp}
              />
            )}
            {activeModule === "profile_detector" && (
              <ProfileDetectorModule
                onComplete={(pts) => handleComplete("profile_detector", pts)}
                onXp={handleXp}
              />
            )}
            {activeModule === "story_path" && (
              <StoryPathModule
                onComplete={(pts) => handleComplete("story_path", pts)}
                onXp={handleXp}
              />
            )}
            {activeModule === "red_flags" && (
              <RedFlagsModule
                onComplete={(pts) => handleComplete("red_flags", pts)}
                onXp={handleXp}
              />
            )}
            {activeModule === "screenshot_analysis" && (
              <ScreenshotModule
                onComplete={(pts) => handleComplete("screenshot_analysis", pts)}
                onXp={handleXp}
              />
            )}
          </div>
        </div>
      )}
    </main>
  );
}