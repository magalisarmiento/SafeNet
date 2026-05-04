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
  | "screenshot_analysis";
type NavTab = "home" | "search" | "dm" | "profile";

/* ════════════════════════════════════════════════════════════
   CONSTANTES VISUALES
════════════════════════════════════════════════════════════ */
const ACCENT = "#74B3CE";
const ACCENT_DIM = "#5A99B4";
const BG_DARK = "#051024";
const GLASS_BG = "rgba(255,255,255,0.03)";
const GLASS_BORDER = "rgba(116,179,206,0.15)";
const BRAND_GRADIENT = `linear-gradient(90deg,#FFFFFF 0%,${ACCENT} 55%,#FFFFFF 100%)`;

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
   DATOS DE STORIES (imágenes + contenido educativo)
════════════════════════════════════════════════════════════ */
type StorySlide = {
  bg: string;
  emoji: string;
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
        bg: "linear-gradient(160deg,#0f2027,#203a43,#2c5364)",
        emoji: "🚨",
        title: "Señal #1: El halago inicial",
        body: "\"Sos diferente a los demás\" — Es la frase más usada. El groomer necesita que bajes la guardia primero.",
        tag: "RED FLAG",
        tagColor: "#FF8A95",
      },
      {
        bg: "linear-gradient(160deg,#1a1a2e,#16213e,#0f3460)",
        emoji: "🔒",
        title: "¿Cómo responder?",
        body: "Mantener distancia no es ser mala persona. Es protegerte. Podés no responder y está bien.",
        tag: "CONSEJO",
        tagColor: "#A9DFBF",
      },
    ],
  },
  {
    user: "juani",
    slides: [
      {
        bg: "linear-gradient(160deg,#2d1b69,#11998e,#38ef7d)",
        emoji: "📱",
        title: "\"Pasemos a Telegram\"",
        body: "Querer salir de la plataforma es una señal clásica. Elimina el rastro y desactiva los reportes.",
        tag: "ALERTA",
        tagColor: "#FFE08A",
      },
      {
        bg: "linear-gradient(160deg,#0d0d0d,#1a1a1a,#2d2d2d)",
        emoji: "✋",
        title: "Tu respuesta ideal",
        body: "\"Prefiero seguir hablando acá. Si no podés, no hay problema.\" — Sin explicaciones, sin culpa.",
        tag: "ACCIÓN SEGURA",
        tagColor: "#A9DFBF",
      },
    ],
  },
  {
    user: "sofi",
    slides: [
      {
        bg: "linear-gradient(160deg,#b92b27,#1565c0)",
        emoji: "🤫",
        title: "El pedido de secreto",
        body: "\"No le cuentes esto a nadie\" — Es aislamiento. El groomer necesita que no tengas a quién recurrir.",
        tag: "TÁCTICA DE GROOMING",
        tagColor: "#FF8A95",
      },
      {
        bg: "linear-gradient(160deg,#4b1248,#f10711)",
        emoji: "💬",
        title: "Contá lo que pasa",
        body: "Un adulto de confianza, un docente, una amiga. Contar lo que te incomoda no te hace débil. Te protege.",
        tag: "IMPORTANTE",
        tagColor: "#74B3CE",
      },
    ],
  },
  {
    user: "mateo",
    slides: [
      {
        bg: "linear-gradient(160deg,#134e5e,#71b280)",
        emoji: "👤",
        title: "Perfiles falsos: señales",
        body: "Miles de seguidores, pocas publicaciones, cuenta nueva, bio seductora. El ratio no miente.",
        tag: "DETECTOR",
        tagColor: "#FFE08A",
      },
    ],
  },
  {
    user: "lucas",
    slides: [
      {
        bg: "linear-gradient(160deg,#360033,#0b8793)",
        emoji: "❤️",
        title: "\"Sos mi refugio\"",
        body: "Dependencia emocional intensa con un desconocido es manipulación, no amor. El groomer construye eso a propósito.",
        tag: "MANIPULACIÓN",
        tagColor: "#FF8A95",
      },
      {
        bg: "linear-gradient(160deg,#0f0c29,#302b63,#24243e)",
        emoji: "🛡️",
        title: "Protegé tu energía",
        body: "No le debés tiempo ni explicaciones a nadie online. Bloquear y reportar es siempre una opción válida.",
        tag: "TU DERECHO",
        tagColor: "#A9DFBF",
      },
    ],
  },
  {
    user: "caro",
    slides: [
      {
        bg: "linear-gradient(160deg,#1f4037,#99f2c8)",
        emoji: "📸",
        title: "\"Mandame una foto\"",
        body: "\"Solo para verificar que sos real.\" Ninguna verificación legítima requiere fotos personales.",
        tag: "NUNCA",
        tagColor: "#FF8A95",
      },
    ],
  },
  {
    user: "edu",
    slides: [
      {
        bg: "linear-gradient(160deg,#005c97,#363795)",
        emoji: "📋",
        title: "¿Qué es el grooming?",
        body: "Es cuando un adulto usa internet para ganarse la confianza de un menor con el objetivo de abusar.",
        tag: "DEFINICIÓN",
        tagColor: "#74B3CE",
      },
      {
        bg: "linear-gradient(160deg,#1a1a2e,#16213e)",
        emoji: "📞",
        title: "Línea de ayuda",
        body: "En Argentina: 102 (Defensoría del Niño). Es gratuita, confidencial y disponible las 24hs.",
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
    name: "alex_reyes23",
    avatar: "",
    preview: "Ey, vi tus posts. Tenés un contenido muy bueno 👀",
    time: "2 min",
    unread: 5,
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
    preview: "Fundamental para adolescentes esto 🙌",
    time: "5 h",
    unread: 0,
    isStranger: false,
  },
];

/* ════════════════════════════════════════════════════════════
   UTILIDADES UI (módulos — lógica intacta)
════════════════════════════════════════════════════════════ */
function FeedbackBox({
  message,
  type,
}: {
  message: string;
  type: "success" | "danger" | "info" | "warn";
}) {
  const s = {
    success: {
      bg: "rgba(39,174,96,0.12)",
      border: "rgba(39,174,96,0.35)",
      color: "#A9DFBF",
    },
    danger: {
      bg: "rgba(255,60,80,0.12)",
      border: "rgba(255,60,80,0.35)",
      color: "#FF8A95",
    },
    info: {
      bg: "rgba(116,179,206,0.12)",
      border: "rgba(116,179,206,0.35)",
      color: "#A5D2E5",
    },
    warn: {
      bg: "rgba(255,200,0,0.1)",
      border: "rgba(255,200,0,0.3)",
      color: "#FFE08A",
    },
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
        background: "rgba(255,215,0,0.95)",
        color: "#051024",
        padding: "8px 16px",
        borderRadius: "8px",
        fontFamily: "'LEMON MILK',sans-serif",
        fontSize: "14px",
        fontWeight: "bold",
        animation: "xpPop 1.8s ease-out forwards",
        boxShadow: "0 5px 15px rgba(255,215,0,0.2)",
        border: "1px solid #FFF",
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
        <span style={{ color: "#FFFFFF", opacity: 0.7 }}>{label}</span>
        <span style={{ color }}>{pct}%</span>
      </div>
      <div
        style={{
          height: "5px",
          background: "rgba(255,255,255,0.07)",
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
   MÓDULO 1 — DM SIM (lógica 100% intacta)
════════════════════════════════════════════════════════════ */
const dmScript = [
  {
    from: "stranger",
    text: "Ey, vi tus posts. Tenés un contenido muy bueno, lo digo en serio.",
  },
  {
    from: "stranger",
    text: "Soy de Buenos Aires también. Qué raro que no nos sigamos antes, jaja.",
  },
  {
    from: "stranger",
    text: "Mira, no le cuentes a nadie esto, pero tengo acceso a una cuenta de influencer que podría repostear tu contenido. ¿Te interesa?",
  },
  {
    from: "stranger",
    text: "¿Podemos pasar a Telegram? Instagram me shadowbannea los mensajes. Te explico todo ahí.",
  },
  {
    from: "stranger",
    text: "Necesito una foto tuya para verificar que sos real antes de conectarte con mi contacto. Cualquier foto.",
  },
];
const dmChoices: Record<number, any[]> = {
  0: [
    {
      text: "Gracias, igual no conozco a quién seguís",
      isSafe: true,
      points: 20,
      consequence:
        "Respuesta neutra y con distancia. No compartiste info personal.",
      type: "info",
    },
    {
      text: "¿De verdad? ¿Qué te gustó más de mis posts?",
      isSafe: false,
      points: 0,
      consequence:
        "Al mostrar entusiasmo abrís la puerta a más interacción. El halago es la primera táctica de grooming.",
      type: "warn",
    },
  ],
  1: [
    {
      text: "¿Y cómo sabes que soy de Buenos Aires?",
      isSafe: true,
      points: 30,
      consequence:
        "Pregunta que incomoda al groomer. Buen instinto: ¿cómo obtuvieron esa info?",
      type: "success",
    },
    {
      text: "Sí, qué coincidencia. ¿De qué zona sos?",
      isSafe: false,
      points: 0,
      consequence:
        "Acabas de confirmar tu ubicación y abriste una conversación sobre datos personales.",
      type: "danger",
    },
  ],
  2: [
    {
      text: "Si es legítimo, que me contacte por DM acá nomás.",
      isSafe: true,
      points: 40,
      consequence:
        "Perfecto. No te dejás llevar por la urgencia ni por ofertas que suenan demasiado buenas.",
      type: "success",
    },
    {
      text: "¿Qué influencer? Me interesa mucho.",
      isSafe: false,
      points: 0,
      consequence:
        "Las ofertas tentadoras son anzuelos. El groomer usa tus ambiciones para mantenerte enganchado.",
      type: "danger",
    },
  ],
  3: [
    {
      text: "No, prefiero seguir hablando acá. Si no podés, no hay problema.",
      isSafe: true,
      points: 50,
      consequence:
        "Excelente. Salir de la plataforma es una señal de alarma clásica. Seguir acá te protege.",
      type: "success",
    },
    {
      text: "Dale, instalo Telegram ahora.",
      isSafe: false,
      points: 0,
      consequence:
        "Pasar a otra app elimina los registros y el sistema de reportes. Es una señal de alerta mayor.",
      type: "danger",
    },
  ],
  4: [
    {
      text: "Esto no tiene ningún sentido. Te voy a bloquear y reportar.",
      isSafe: true,
      points: 60,
      consequence:
        "Decisión correcta. Pedir una foto a un desconocido online no es verificación — es el inicio de algo peligroso.",
      type: "success",
    },
    {
      text: "Supongo que no hay problema con una foto de perfil...",
      isSafe: false,
      points: 0,
      consequence:
        'Una foto "inocente" puede ser el primer paso hacia escaladas más graves. El límite tiene que ser claro.',
      type: "danger",
    },
  ],
};

function DmSimModule({
  onComplete,
  onXp,
}: {
  onComplete: (pts: number) => void;
  onXp: (n: number) => void;
}) {
  const [history, setHistory] = useState<any[]>([
    { from: "stranger", text: dmScript[0].text },
  ]);
  const [step, setStep] = useState(0);
  const [pts, setPts] = useState(0);
  const [typing, setTyping] = useState(false);
  const [phase, setPhase] = useState<"playing" | "result">("playing");
  const [xpPop, setXpPop] = useState(0);
  const chatRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    chatRef.current?.scrollTo(0, chatRef.current.scrollHeight);
  }, [history, typing]);
  const handleChoice = (c: any) => {
    const newH = [
      ...history,
      { from: "player", text: c.text },
      { from: "system", text: c.consequence, stype: c.type },
    ];
    setHistory(newH);
    if (c.points > 0) {
      setPts((p) => p + c.points);
      setXpPop(c.points);
      onXp(c.points);
    }
    if (step + 1 >= Object.keys(dmChoices).length) {
      setTimeout(() => setPhase("result"), 1800);
      return;
    }
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setHistory((prev) => [...prev, { ...dmScript[step + 1] }]);
      setStep((p) => p + 1);
    }, 1600);
  };
  const totalPossible = Object.values(dmChoices).reduce(
    (acc, arr) => acc + Math.max(...arr.map((x: any) => x.points)),
    0,
  );
  if (phase === "result") {
    const pct = Math.round((pts / totalPossible) * 100);
    const verdict =
      pct >= 80
        ? {
            text: "Criterio digital muy alto. Reconociste todas las tácticas.",
            color: "#A9DFBF",
          }
        : pct >= 50
          ? {
              text: "Buen instinto en algunos señales. Hay señales que conviene reforzar.",
              color: "#FFE08A",
            }
          : {
              text: "Varias respuestas pusieron en riesgo tu seguridad. Vale la pena revisar las señales.",
              color: "#FF8A95",
            };
    return (
      <div style={{ textAlign: "center", padding: "10px 0" }}>
        <div
          style={{
            fontSize: "11px",
            textTransform: "uppercase",
            letterSpacing: "2px",
            color: ACCENT,
            marginBottom: "12px",
          }}
        >
          Conversación cerrada
        </div>
        <h3
          style={{
            fontFamily: "'LEMON MILK',sans-serif",
            fontSize: "22px",
            color: "#FFF",
            marginBottom: "8px",
          }}
        >
          {pts} / {totalPossible} pts
        </h3>
        <p
          style={{
            color: verdict.color,
            fontSize: "14px",
            lineHeight: 1.6,
            marginBottom: "24px",
            maxWidth: "380px",
            margin: "0 auto 24px",
          }}
        >
          {verdict.text}
        </p>
        <div
          style={{
            background: "rgba(116,179,206,0.08)",
            borderRadius: "14px",
            padding: "16px",
            marginBottom: "24px",
            textAlign: "left",
            border: "1px solid rgba(116,179,206,0.15)",
          }}
        >
          <div
            style={{
              fontSize: "11px",
              textTransform: "uppercase",
              letterSpacing: "1px",
              color: ACCENT,
              marginBottom: "10px",
            }}
          >
            Señales identificadas
          </div>
          {[
            "Halago inicial para bajar la guardia",
            "Mencionar ubicación para crear falsa cercanía",
            "Oferta irreal como anzuelo",
            "Solicitud de cambio de plataforma",
            'Pedido de foto para "verificar"',
          ].map((s, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                gap: "10px",
                alignItems: "flex-start",
                marginBottom: "8px",
              }}
            >
              <div
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  background: "#FF8A95",
                  marginTop: "5px",
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  fontSize: "13px",
                  color: "rgba(255,255,255,0.8)",
                  lineHeight: 1.5,
                }}
              >
                {s}
              </span>
            </div>
          ))}
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
            fontFamily: "'LEMON MILK',sans-serif",
            fontSize: "12px",
            fontWeight: "bold",
            cursor: "pointer",
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
          gap: "12px",
          padding: "12px 16px",
          background: "rgba(0,0,0,0.3)",
          borderRadius: "12px",
          marginBottom: "16px",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            background: "linear-gradient(135deg,#667eea,#764ba2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "14px",
            fontWeight: "bold",
            color: "#FFF",
            flexShrink: 0,
          }}
        >
          A
        </div>
        <div>
          <div style={{ fontSize: "13px", fontWeight: "bold", color: "#FFF" }}>
            alex_reyes23
          </div>
          <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)" }}>
            Activo hace 2 min
          </div>
        </div>
      </div>
      <ProgressBar
        label={`Mensaje ${step + 1} de ${Object.keys(dmChoices).length}`}
        current={step + 1}
        max={Object.keys(dmChoices).length}
        color={ACCENT}
      />
      <div
        ref={chatRef}
        style={{
          background: "rgba(0,0,0,0.35)",
          borderRadius: "14px",
          border: "1px solid rgba(255,255,255,0.05)",
          padding: "16px",
          maxHeight: "280px",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          marginBottom: "16px",
        }}
      >
        {history.map((m, i) => (
          <div key={i} style={{ animation: "slideUpIn 0.3s ease" }}>
            {m.from === "stranger" && (
              <div
                style={{ display: "flex", gap: "8px", alignItems: "flex-end" }}
              >
                <div
                  style={{
                    width: "26px",
                    height: "26px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg,#667eea,#764ba2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "10px",
                    fontWeight: "bold",
                    color: "#FFF",
                    flexShrink: 0,
                  }}
                >
                  A
                </div>
                <div
                  style={{
                    background: "rgba(116,179,206,0.1)",
                    border: "1px solid rgba(116,179,206,0.12)",
                    padding: "9px 13px",
                    borderRadius: "16px 16px 16px 3px",
                    fontSize: "13px",
                    color: "#FFF",
                    maxWidth: "82%",
                    lineHeight: 1.5,
                  }}
                >
                  {m.text}
                </div>
              </div>
            )}
            {m.from === "player" && (
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <div
                  style={{
                    background: "rgba(90,153,180,0.18)",
                    border: "1px solid rgba(90,153,180,0.2)",
                    padding: "9px 13px",
                    borderRadius: "16px 16px 3px 16px",
                    fontSize: "13px",
                    color: ACCENT,
                    maxWidth: "82%",
                    lineHeight: 1.5,
                  }}
                >
                  {m.text}
                </div>
              </div>
            )}
            {m.from === "system" && (
              <FeedbackBox message={m.text} type={m.stype} />
            )}
          </div>
        ))}
        {typing && (
          <div
            style={{
              paddingLeft: "38px",
              display: "flex",
              gap: "4px",
              alignItems: "center",
            }}
          >
            <span
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: ACCENT,
                animation: "typingDot 1s infinite 0s",
              }}
            />
            <span
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: ACCENT,
                animation: "typingDot 1s infinite 0.2s",
              }}
            />
            <span
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: ACCENT,
                animation: "typingDot 1s infinite 0.4s",
              }}
            />
          </div>
        )}
      </div>
      {!typing && (
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
            Responder
          </div>
          {dmChoices[step]?.map((c, i) => (
            <button
              suppressHydrationWarning
              key={i}
              onClick={() => handleChoice(c)}
              style={{
                padding: "11px 15px",
                borderRadius: "10px",
                textAlign: "left",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "rgba(255,255,255,0.85)",
                fontSize: "13px",
                cursor: "pointer",
                lineHeight: 1.4,
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.borderColor = "rgba(116,179,206,0.4)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")
              }
            >
              {c.text}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   MÓDULO 2 — DETECTOR DE PERFILES (lógica intacta)
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
            fontFamily: "'LEMON MILK',sans-serif",
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
            fontFamily: "'LEMON MILK',sans-serif",
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
              fontFamily: "'LEMON MILK',sans-serif",
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
   MÓDULO 3 — STORY PATH (lógica intacta)
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
    endMsg:
      "Mantuviste la distancia ante una situación ambigua. Eso requiere criterio.",
  },
  late_realization: {
    id: "late_realization",
    isEnd: true,
    endType: "ambiguous",
    text: "",
    endMsg:
      "Reconociste la señal, aunque tarde. El proceso de construcción de confianza fue gradual y funcionó un tiempo.",
  },
  ideal_end: {
    id: "ideal_end",
    isEnd: true,
    endType: "ideal",
    text: "",
    endMsg:
      "Detectaste señales desde el principio y actuaste. Este es el camino ideal.",
  },
  danger_end: {
    id: "danger_end",
    isEnd: true,
    endType: "risk",
    text: "",
    endMsg:
      "La persona fue creando una relacion de dependencia emocional gradualmente. Esta situación requería haber pedido ayuda antes.",
  },
  ambiguous_end: {
    id: "ambiguous_end",
    isEnd: true,
    endType: "ambiguous",
    text: "",
    endMsg:
      "Contarle a una amiga es mejor que guardar silencio, pero un adulto de confianza tiene más herramientas.",
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
            fontFamily: "'LEMON MILK',sans-serif",
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
   MÓDULO 4 — RED FLAGS (lógica intacta)
════════════════════════════════════════════════════════════ */
const redFlagMessages = [
  {
    id: "rf1",
    text: '"No le cuentes esto a nadie, es solo entre nosotros."',
    isFlag: true,
    explanation:
      "Pedir secreto es una de las tácticas principales de aislamiento.",
  },
  {
    id: "rf2",
    text: '"¿En qué barrio vivís? Es para ver si estamos cerca."',
    isFlag: true,
    explanation:
      "Pedir ubicación a un desconocido es una señal de alarma directa.",
  },
  {
    id: "rf3",
    text: '"Vi la peli que recomendaste. Tenías razón, estuvo buena."',
    isFlag: false,
    explanation:
      "Un comentario sobre contenido compartido, sin información personal ni presión.",
  },
  {
    id: "rf4",
    text: '"Sos la única persona que me entiende de verdad. No sé qué haría sin vos."',
    isFlag: true,
    explanation:
      "Crear dependencia emocional intensa con un desconocido es manipulacion.",
  },
  {
    id: "rf5",
    text: '"¿Podemos hablar por Telegram? Instagram me tiene bloqueado."',
    isFlag: true,
    explanation:
      "Querer salir de la plataforma elimina el rastro y el sistema de denuncia.",
  },
  {
    id: "rf6",
    text: '"¿Que música escuchas? Estoy armando una playlist."',
    isFlag: false,
    explanation:
      "Pregunta de preferencia casual sin intento de obtener datos personales.",
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
            fontFamily: "'LEMON MILK',sans-serif",
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
            fontFamily: "'LEMON MILK',sans-serif",
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
   MÓDULO 5 — SCREENSHOT (lógica intacta)
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
    explanation:
      "La combinación de halago + secreto + urgencia emocional es un patrón de grooming.",
  },
  {
    text: "Lo bloqueo sin decirle nada",
    correct: false,
    pts: 15,
    explanation:
      "Bloquear es válido, pero no alcanza. Esta conversación merece ser reportada y comentada.",
  },
  {
    text: "Hago captura, reporto y se lo muestro a alguien de confianza",
    correct: true,
    pts: 70,
    explanation:
      "Perfecto. Guardar evidencia, reportar y pedir ayuda es la respuesta más completa.",
  },
  {
    text: "Le pregunto por qué pide tanto secreto",
    correct: false,
    pts: 10,
    explanation:
      "Confrontar al groomer raramente cambia la situación y puede aumentar la presión.",
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
              background: "linear-gradient(135deg,#764ba2,#667eea)",
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
                background: "linear-gradient(135deg,#764ba2,#667eea)",
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
              fontFamily: "'LEMON MILK',sans-serif",
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
        background: "#EFEFEF",
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
        borderTop: "1px solid #EFEFEF",
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
            color: "#0095f6",
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
            color: "#C7C7C7",
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
   STORY VIEWER MODAL — NUEVO
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
  const slide = story.slides[slideIndex];
  const totalSlides = story.slides.length;

  const goNext = useCallback(() => {
    if (slideIndex < totalSlides - 1) {
      setSlideIndex((s) => s + 1);
      setProgress(0);
    } else if (storyIndex < stories.length - 1) {
      onSeen(storyIndex);
      setStoryIndex((s) => s + 1);
      setSlideIndex(0);
      setProgress(0);
    } else {
      onSeen(storyIndex);
      onClose();
    }
  }, [slideIndex, totalSlides, storyIndex, stories.length, onClose, onSeen]);

  const goPrev = useCallback(() => {
    if (slideIndex > 0) {
      setSlideIndex((s) => s - 1);
      setProgress(0);
    } else if (storyIndex > 0) {
      setStoryIndex((s) => s - 1);
      setSlideIndex(0);
      setProgress(0);
    }
  }, [slideIndex, storyIndex]);

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

  const user = USERS[story.user];

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 500,
        background: "rgba(0,0,0,0.95)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        animation: "fadeIn 0.2s ease",
      }}
      onClick={onClose}
    >
      {/* Story card */}
      <div
        style={{
          width: "100%",
          maxWidth: 390,
          height: "100%",
          maxHeight: 720,
          borderRadius: 20,
          overflow: "hidden",
          position: "relative",
          background: slide.bg,
          boxShadow: "0 30px 80px rgba(0,0,0,0.7)",
          animation: "modalIn 0.3s cubic-bezier(0.34,1.56,0.64,1)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Progress bars */}
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

        {/* Header */}
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
              border: "2px solid #FFF",
              overflow: "hidden",
              flexShrink: 0,
            }}
          >
            <img
              src={user.avatar}
              alt={user.handle}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#FFF" }}>
              {user.handle}
            </div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.65)" }}>
              hace 2 h
            </div>
          </div>
          <button
            suppressHydrationWarning
            onClick={onClose}
            style={{
              marginLeft: "auto",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#FFF",
              padding: 4,
              display: "flex",
            }}
          >
            <X size={22} strokeWidth={2} />
          </button>
        </div>

        {/* Content */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "80px 28px 100px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: 64,
              marginBottom: 24,
              filter: "drop-shadow(0 4px 16px rgba(0,0,0,0.3))",
              animation: "slideUpIn 0.4s ease",
            }}
          >
            {slide.emoji}
          </div>
          <div
            style={{
              display: "inline-block",
              padding: "5px 14px",
              borderRadius: 99,
              background: `${slide.tagColor}22`,
              border: `1px solid ${slide.tagColor}55`,
              color: slide.tagColor,
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: 1.5,
              textTransform: "uppercase",
              marginBottom: 18,
              animation: "slideUpIn 0.4s ease 0.05s both",
            }}
          >
            {slide.tag}
          </div>
          <div
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: "#FFF",
              lineHeight: 1.3,
              marginBottom: 16,
              animation: "slideUpIn 0.4s ease 0.1s both",
            }}
          >
            {slide.title}
          </div>
          <div
            style={{
              fontSize: 15,
              color: "rgba(255,255,255,0.82)",
              lineHeight: 1.65,
              animation: "slideUpIn 0.4s ease 0.15s both",
              maxWidth: 300,
            }}
          >
            {slide.body}
          </div>
        </div>

        {/* Tap zones */}
        <button
          suppressHydrationWarning
          onClick={goPrev}
          onMouseDown={() => setPaused(true)}
          onMouseUp={() => setPaused(false)}
          onTouchStart={() => setPaused(true)}
          onTouchEnd={() => setPaused(false)}
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: "40%",
            height: "100%",
            background: "none",
            border: "none",
            cursor: "pointer",
            zIndex: 5,
          }}
        />
        <button
          suppressHydrationWarning
          onClick={goNext}
          onMouseDown={() => setPaused(true)}
          onMouseUp={() => setPaused(false)}
          onTouchStart={() => setPaused(true)}
          onTouchEnd={() => setPaused(false)}
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            width: "60%",
            height: "100%",
            background: "none",
            border: "none",
            cursor: "pointer",
            zIndex: 5,
          }}
        />

        {/* Nav arrows hint */}
        {storyIndex > 0 && (
          <div
            style={{
              position: "absolute",
              left: -48,
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 20,
            }}
          >
            <button
              suppressHydrationWarning
              onClick={goPrev}
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.15)",
                border: "none",
                cursor: "pointer",
                color: "#FFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ChevronLeft size={18} />
            </button>
          </div>
        )}
        {storyIndex < stories.length - 1 && (
          <div
            style={{
              position: "absolute",
              right: -48,
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 20,
            }}
          >
            <button
              suppressHydrationWarning
              onClick={goNext}
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.15)",
                border: "none",
                cursor: "pointer",
                color: "#FFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   DM INBOX — NUEVO
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
      {/* Header */}
      <div
        style={{
          padding: "16px 16px 12px",
          borderBottom: "1px solid #EFEFEF",
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
            color: "#000",
          }}
        >
          <ArrowLeft size={22} strokeWidth={2} />
        </button>
        <div style={{ fontSize: 16, fontWeight: 700, color: "#000" }}>
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
              color: "#000",
            }}
          >
            <Search size={22} strokeWidth={1.8} />
          </button>
        </div>
      </div>

      {/* Search bar */}
      <div style={{ padding: "10px 16px" }}>
        <div
          style={{
            background: "#F2F2F2",
            borderRadius: 10,
            padding: "10px 14px",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <Search size={16} color="#8E8E8E" strokeWidth={2} />
          <span style={{ fontSize: 14, color: "#8E8E8E" }}>Buscar</span>
        </div>
      </div>

      {/* Conversations */}
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
            {/* Avatar */}
            <div style={{ position: "relative", flexShrink: 0 }}>
              {conv.avatar ? (
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: "50%",
                    overflow: "hidden",
                    border: conv.isStranger
                      ? "2px solid #FF8A95"
                      : "2px solid transparent",
                  }}
                >
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
                    background: "linear-gradient(135deg,#667eea,#764ba2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 20,
                    fontWeight: 700,
                    color: "#FFF",
                    border: "2px solid #FF8A95",
                  }}
                >
                  A
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
                    background: "#ed4956",
                    border: "2px solid #FFF",
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

            {/* Info */}
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
                    color: "#000",
                  }}
                >
                  {conv.name}
                </span>
                <span style={{ fontSize: 12, color: "#8E8E8E" }}>
                  {conv.time}
                </span>
              </div>
              <div
                style={{
                  fontSize: 13,
                  color: conv.unread > 0 ? "#000" : "#8E8E8E",
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
                    color: "#FF8A95",
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  <AlertTriangle size={11} strokeWidth={2.5} />
                  Solicitud de desconocido — tocá para revisar
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
   DM CHAT VIEW — NUEVO (envuelve DmSimModule con UI de chat)
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
      {/* Chat header */}
      <div
        style={{
          padding: "12px 16px",
          borderBottom: "1px solid #EFEFEF",
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
            color: "#000",
          }}
        >
          <ArrowLeft size={22} strokeWidth={2} />
        </button>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: "linear-gradient(135deg,#667eea,#764ba2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 14,
            fontWeight: 700,
            color: "#FFF",
            flexShrink: 0,
          }}
        >
          A
        </div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#000" }}>
            alex_reyes23
          </div>
          <div
            style={{
              fontSize: 12,
              color: "#8E8E8E",
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
              color: "#000",
            }}
          >
            <MoreHorizontal size={22} strokeWidth={1.8} />
          </button>
        </div>
      </div>

      {/* Solicitud banner */}
      <div
        style={{
          background: "#FFF9F9",
          borderBottom: "1px solid #FFE5E5",
          padding: "10px 16px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: 12,
            color: "#FF8A95",
            fontWeight: 600,
            marginBottom: 2,
          }}
        >
          Este usuario no te sigue · Solicitud de mensaje
        </div>
        <div style={{ fontSize: 11, color: "#8E8E8E" }}>
          Respondé con cuidado. Revisá las señales de riesgo.
        </div>
      </div>

      {/* Module content */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          background: "linear-gradient(180deg,#0d1117 0%,#051024 100%)",
          padding: "20px 16px",
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
   POST ONG (groomingargentina) — sin cambios
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
}: {
  time: string;
  imgSrc: string;
  imgAlt: string;
  likeCount: number;
  likedBy: string;
  caption: React.ReactNode;
  comments: { user: string; text: string }[];
  timestamp: string;
}) {
  return (
    <article className="ig-post">
      <div className="ig-post-header">
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            overflow: "hidden",
            position: "relative",
            flexShrink: 0,
          }}
        >
          <Image
            src="/grooming-arg.png"
            alt="Grooming Argentina"
            fill
            style={{ objectFit: "cover" }}
            sizes="32px"
          />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <span className="ig-post-username">groomingargentina</span>
            <BadgeCheck
              size={14}
              color="#0095f6"
              fill="rgba(0,149,246,0.1)"
              strokeWidth={2.5}
            />
            <span style={{ color: "#737373", fontSize: 14, margin: "0 3px" }}>
              •
            </span>
            <span
              style={{
                color: "#0095f6",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Seguir
            </span>
          </div>
          <div className="ig-post-sublabel">Argentina</div>
        </div>
        <MoreHorizontal size={20} color="#000" style={{ cursor: "pointer" }} />
      </div>
      <div
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "1/1",
          background: "#FAFAFA",
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
            color: "#000",
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
   POST VIDEO / REEL — sin cambios
──────────────────────────────────────────────────────────── */
function ReelPost({
  user,
  time,
  videoId,
  caption,
  likeCount,
  comments,
  timestamp,
}: {
  user: keyof typeof USERS;
  time: string;
  videoId: string;
  caption: React.ReactNode;
  likeCount: number;
  comments: { user: string; text: string }[];
  timestamp: string;
}) {
  const u = USERS[user];

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
        <MoreHorizontal size={20} color="#000" style={{ cursor: "pointer" }} />
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
            color: "#000",
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
   POST INTERACTIVO DE DECISIÓN RÁPIDA — sin cambios
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
        <MoreHorizontal size={20} color="#000" style={{ cursor: "pointer" }} />
      </div>

      {/* Visual panel */}
      <div
        style={{
          background: "#F7F7F7",
          borderTop: "1px solid #EFEFEF",
          borderBottom: "1px solid #EFEFEF",
          padding: "32px 24px",
        }}
      >
        <div
          style={{
            fontSize: 11,
            color: "#8E8E8E",
            textTransform: "uppercase",
            letterSpacing: 1.6,
            marginBottom: 12,
          }}
        >
          en este momento
        </div>
        <div
          style={{
            fontSize: 20,
            fontWeight: 700,
            color: "#000",
            lineHeight: 1.3,
            marginBottom: 10,
          }}
        >
          {question}
        </div>
        <div style={{ fontSize: 14, color: "#737373", lineHeight: 1.5 }}>
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
   POST DE EXPERIENCIA — sin cambios
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
          background: "#F7F7F7",
          padding: "20px 20px 16px",
          borderTop: "1px solid #EFEFEF",
          borderBottom: "1px solid #EFEFEF",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 14,
            paddingBottom: 10,
            borderBottom: "1px solid #E5E5E5",
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: "linear-gradient(135deg,#764ba2,#667eea)",
              flexShrink: 0,
            }}
          />
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#000" }}>
              alex_reyes23
            </div>
            <div style={{ fontSize: 11, color: "#ABABAB" }}>
              Solicitud de mensaje
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
          "Ey, vi tus posts. Tenés un contenido muy bueno 👀",
          "Soy de Buenos Aires también. Qué raro que no nos sigamos",
        ].map((t, i) => (
          <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
            <div
              style={{
                width: 24,
                height: 24,
                borderRadius: "50%",
                background: "linear-gradient(135deg,#764ba2,#667eea)",
                flexShrink: 0,
              }}
            />
            <div
              style={{
                background: "#E8E8E8",
                padding: "8px 12px",
                borderRadius: "18px 18px 18px 3px",
                fontSize: 13,
                color: "#000",
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
            color: "#FF3B30",
            fontWeight: 700,
            letterSpacing: 0.4,
          }}
        >
          nuevo mensaje · responder con cuidado
        </div>
      </div>
    ),
    profile: (
      <div
        style={{
          background: "#FAFAFA",
          padding: "20px",
          borderTop: "1px solid #EFEFEF",
          borderBottom: "1px solid #EFEFEF",
        }}
      >
        <div
          style={{
            background: "#FFF",
            border: "1px solid #DBDBDB",
            borderRadius: 8,
            padding: "16px",
            maxWidth: 340,
            margin: "0 auto",
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
                background: "linear-gradient(135deg,#f093fb,#f5576c)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 20,
                fontWeight: 700,
                color: "#FFF",
              }}
            >
              V
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 14, color: "#000" }}>
                valeria.foto_oficial
              </div>
              <div style={{ fontSize: 12, color: "#ABABAB" }}>
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
              borderBottom: "1px solid #EFEFEF",
            }}
          >
            {[
              ["3", "Posts"],
              ["12.4K", "Seguidores"],
              ["8", "Siguiendo"],
            ].map(([v, l]) => (
              <div key={l}>
                <div style={{ fontWeight: 700, fontSize: 16, color: "#000" }}>
                  {v}
                </div>
                <div style={{ fontSize: 11, color: "#ABABAB" }}>{l}</div>
              </div>
            ))}
          </div>
          <div
            style={{
              textAlign: "center",
              fontSize: 12,
              color: "#FF3B30",
              fontWeight: 700,
            }}
          >
            perfil reciente · revisar antes de aceptar
          </div>
        </div>
      </div>
    ),
    story: (
      <div
        style={{
          background: "linear-gradient(135deg,#1A1A2E,#16213E)",
          padding: "48px 32px",
          borderTop: "1px solid #EFEFEF",
          borderBottom: "1px solid #EFEFEF",
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: 52,
            height: 52,
            margin: "0 auto 16px",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.12)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <MessageCircle size={26} color="#FFF" strokeWidth={1.8} />
        </div>
        <div
          style={{
            fontSize: 20,
            fontWeight: 700,
            color: "#FFF",
            lineHeight: 1.3,
            marginBottom: 10,
          }}
        >
          Tu historia, tus decisiones
        </div>
        <div
          style={{
            fontSize: 13,
            color: "rgba(255,255,255,0.5)",
            lineHeight: 1.5,
          }}
        >
          Un escenario real. Cada elección tiene consecuencias.
        </div>
      </div>
    ),
    redflag: (
      <div
        style={{
          background: "#FFFBEB",
          padding: "32px 24px",
          borderTop: "1px solid #EFEFEF",
          borderBottom: "1px solid #EFEFEF",
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
                border: "1px solid #FDE68A",
                borderRadius: 8,
                padding: "12px 14px",
                fontSize: 13,
                color: "#000",
                lineHeight: 1.5,
                position: "relative",
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
                  background: "#EF4444",
                }}
              />
            </div>
          ))}
          <div
            style={{
              fontSize: 12,
              color: "#B45309",
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
        <MoreHorizontal size={20} color="#000" style={{ cursor: "pointer" }} />
      </div>

      {visuals[visualType]}

      <div className="ig-post-footer">
        <PostActionBar initialLikes={likeCount} />
        <div
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: "#000",
            marginBottom: 5,
          }}
        >
          {likeCount.toLocaleString("es-AR")} Me gusta
        </div>
        <div className="ig-post-caption">
          <b>{u.handle}</b>
          {headline} <span style={{ color: "#737373" }}>{subline}</span>
        </div>
        <button
          suppressHydrationWarning
          onClick={() => onStart(moduleId)}
          style={{
            width: "100%",
            padding: "11px 16px",
            marginBottom: 12,
            borderRadius: 8,
            background: ACCENT,
            color: "#FFF",
            border: "none",
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            transition: "opacity 0.15s",
            fontFamily: "inherit",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
        >
          {ctaLabel} <ChevronRight size={16} strokeWidth={2.5} />
        </button>
        <CommentInput />
      </div>
    </article>
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

  // Bottom nav (mobile)
  const [activeTab, setActiveTab] = useState<NavTab>("home");

  const handleXp = useCallback((n: number) => setXp((p) => p + n), []);
  const handleComplete = (id: ModuleId, pts: number) => {
    setCompletedModules((prev) => new Set([...prev, id]));
    setActiveModule(null);
    setShowDmChat(false);
  };
  const openModule = (id: ModuleId) => setActiveModule(id);

  const handleStorySeen = useCallback((i: number) => {
    setSeenStories((prev) => new Set([...prev, i]));
  }, []);

  const handleDmComplete = (pts: number) => {
    handleComplete("dm_sim", pts);
    setShowDmChat(false);
    setShowDmInbox(false);
  };

  const handleNavClick = (tab: NavTab) => {
    setActiveTab(tab);
    if (tab === "dm") {
      setShowDmInbox(true);
    }
  };

  return (
    <main
      style={{
        background: "#FAFAFA",
        color: "#000",
        minHeight: "100vh",
        fontFamily:
          "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif",
        position: "relative",
        overflowX: "hidden",
      }}
    >
      <style>{`
        @import url('https://fonts.cdnfonts.com/css/lemon-milk');
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap');
        * { box-sizing:border-box; margin:0; padding:0; }

        /* ── Módulos dark ── */
        @keyframes slideUpIn { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes xpPop { 0%{opacity:0;transform:translateY(0)} 20%{opacity:1;transform:translateY(-15px)} 100%{opacity:0;transform:translateY(-35px)} }
        @keyframes typingDot { 0%,100%{opacity:0.3;transform:scale(0.8)} 50%{opacity:1;transform:scale(1)} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes modalIn { from{opacity:0;transform:scale(0.96) translateY(16px)} to{opacity:1;transform:scale(1) translateY(0)} }
        @keyframes slideInFromRight { from{opacity:0;transform:translateX(32px)} to{opacity:1;transform:translateX(0)} }
        ::-webkit-scrollbar { width:4px; }
        ::-webkit-scrollbar-track { background:rgba(255,255,255,0.03); }
        ::-webkit-scrollbar-thumb { background:rgba(116,179,206,0.3); border-radius:99px; }

        /* ── IG Shell ── */
        .ig-shell {
          display:grid;
          grid-template-columns:244px 1fr 320px;
          min-height:100vh;
        }
        @media(max-width:1100px){ .ig-shell{grid-template-columns:72px 1fr} .ig-right{display:none!important} .ig-nav-label{display:none!important} }
        @media(max-width:768px){ .ig-shell{grid-template-columns:1fr} .ig-sidebar{display:none!important} .ig-feed-inner{padding-bottom:80px!important} }

        /* ── Sidebar ── */
        .ig-sidebar {
          border-right:1px solid #DBDBDB;
          padding:20px 12px;
          position:sticky;
          top:0; height:100vh;
          display:flex;
          flex-direction:column;
          background:#FFF;
          overflow-y:auto;
        }
        .ig-sidebar-logo { padding:14px 12px 28px; display:flex; align-items:center; gap:10px; }
        .ig-nav-item { display:flex; align-items:center; gap:16px; padding:12px; border-radius:8px; cursor:pointer; margin-bottom:2px; transition:background 0.15s; color:#000; user-select:none; }
        .ig-nav-item:hover { background:rgba(0,0,0,0.05); }
        .ig-nav-item.active .ig-nav-label { font-weight:700; }
        .ig-nav-label { font-size:16px; font-weight:400; color:#000; }

        /* ── Feed area ── */
        .ig-feed-area { overflow-y:auto; height:100vh; }
        .ig-feed-inner { max-width:470px; margin:0 auto; padding:24px 0 60px; }

        /* ── Stories ── */
        .ig-stories-bar { background:#FFF; border:1px solid #DBDBDB; border-radius:12px; padding:14px 16px; margin-bottom:20px; display:flex; gap:18px; overflow-x:auto; }
        .ig-stories-bar::-webkit-scrollbar { display:none; }
        .ig-story-wrap { display:flex; flex-direction:column; align-items:center; gap:5px; cursor:pointer; flex-shrink:0; }
        .ig-story-ring { width:66px; height:66px; border-radius:50%; padding:2.5px; background:linear-gradient(45deg,#74B3CE,#a8d4e8,#74B3CE); transition:transform 0.15s; }
        .ig-story-ring.seen { background:#DBDBDB; }
        .ig-story-ring:hover { transform:scale(1.06); }
        .ig-story-inner { width:100%; height:100%; border-radius:50%; border:2.5px solid #FFF; overflow:hidden; background:#FAFAFA; }
        .ig-story-inner img { width:100%; height:100%; object-fit:cover; display:block; }
        .ig-story-name { font-size:12px; color:#262626; font-weight:400; max-width:68px; text-align:center; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }

        /* ── Posts ── */
        .ig-post { background:#FFF; border:1px solid #DBDBDB; border-radius:12px; margin-bottom:20px; overflow:hidden; animation:fadeIn 0.4s ease both; }
        .ig-post:hover { box-shadow:0 18px 45px rgba(0,0,0,0.055); transform:translateY(-1px); transition:box-shadow 0.22s ease, transform 0.22s ease; }
        .tap-bounce { animation:likeBounce 0.26s cubic-bezier(0.34,1.56,0.64,1); }
        @keyframes likeBounce { 0%{transform:scale(1)} 45%{transform:scale(1.38)} 100%{transform:scale(1)} }
        .ig-post button:active { transform:scale(0.97); }
        .social-pill { border:1px solid #EFEFEF; background:#FAFAFA; color:#737373; border-radius:999px; padding:5px 9px; font-size:11px; font-weight:600; }

        .ig-post-header { display:flex; align-items:center; padding:10px 14px; gap:10px; }
        .ig-post-username { font-size:14px; font-weight:600; color:#000; line-height:1.2; }
        .ig-post-sublabel { font-size:12px; color:#737373; font-weight:400; line-height:1.2; }
        .ig-post-footer { padding:10px 14px 12px; }
        .ig-post-caption { font-size:14px; color:#000; line-height:1.5; margin-bottom:6px; word-break:break-word; }
        .ig-post-caption b { font-weight:600; margin-right:5px; }
        .ig-post-see-comments { font-size:14px; color:#737373; cursor:pointer; margin-bottom:4px; }
        .ig-post-comment-preview { font-size:14px; color:#000; margin-bottom:3px; line-height:1.4; }
        .ig-post-comment-preview b { font-weight:600; margin-right:5px; }
        .ig-post-timestamp { font-size:10px; color:#737373; text-transform:uppercase; letter-spacing:0.4px; margin-top:6px; margin-bottom:8px; }

        .back-home {
          position:fixed;
          top:18px;
          left:18px;
          z-index:50;
          width:38px;
          height:38px;
          border-radius:999px;
          background:rgba(255,255,255,0.92);
          border:1px solid #DBDBDB;
          display:flex;
          align-items:center;
          justify-content:center;
          color:#000;
          text-decoration:none;
          box-shadow:0 8px 24px rgba(0,0,0,0.08);
          transition:transform .15s ease, background .15s ease;
        }
        .back-home:hover { transform:translateY(-1px); background:#FFF; }
        @media(min-width:769px){ .back-home{display:none;} }
        .ig-reel-frame { position:relative; width:100%; aspect-ratio:9/16; background:#000; overflow:hidden; }
        .ig-reel-frame iframe { position:absolute; inset:0; width:100%; height:100%; border:0; }

        /* Decision post buttons */
        .ig-decision-btn { width:100%; padding:12px 16px; border-radius:8px; font-size:14px; font-weight:500; cursor:pointer; text-align:left; border:1px solid #DBDBDB; background:#FAFAFA; color:#000; transition:all 0.15s; font-family:inherit; }
        .ig-decision-btn:hover { background:#F0F0F0; border-color:#ABABAB; }
        .ig-decision-a:hover { background:#F0FFF4; border-color:#86EFAC !important; color:#15803D; }
        .ig-decision-b:hover { background:#FFF7ED; border-color:#FCA5A5 !important; color:#B91C1C; }

        /* ── Right panel ── */
        .ig-right { padding:32px 16px 32px 32px; position:sticky; top:0; height:100vh; overflow-y:auto; background:#FFF; border-left:1px solid #DBDBDB; }

        /* ── XP banner ── */
        .xp-banner {
          background:#FFF;
          border:1px solid #DBDBDB;
          border-radius:12px;
          padding:16px;
          margin-bottom:20px;
          display:flex;
          align-items:center;
          justify-content:space-between;
        }

        /* ── Module overlay ── */
        .module-overlay { position:fixed; inset:0; z-index:200; background:rgba(5,12,30,0.97); display:flex; align-items:center; justify-content:center; padding:20px; animation:fadeIn 0.25s ease; }
        .module-inner { max-width:560px; width:100%; max-height:90vh; overflow-y:auto; background:rgba(8,20,45,0.99); border:1px solid rgba(116,179,206,0.18); border-radius:24px; padding:36px; position:relative; animation:modalIn 0.35s cubic-bezier(0.34,1.56,0.64,1); }

        /* ── Bottom nav (mobile only) ── */
        .bottom-nav {
          display:none;
          position:fixed;
          bottom:0; left:0; right:0;
          height:64px;
          background:#FFF;
          border-top:1px solid #DBDBDB;
          z-index:100;
          align-items:center;
          justify-content:space-around;
          padding:0 8px;
        }
        @media(max-width:768px){ .bottom-nav{display:flex;} }
        .bottom-nav-item {
          display:flex;
          flex-direction:column;
          align-items:center;
          justify-content:center;
          gap:3px;
          padding:6px 16px;
          border-radius:10px;
          cursor:pointer;
          border:none;
          background:none;
          transition:opacity 0.15s;
          position:relative;
        }
        .bottom-nav-item:active { opacity:0.6; }
        .bottom-nav-label { font-size:10px; color:#737373; font-weight:500; }
        .bottom-nav-label.active { color:#000; font-weight:700; }

        /* DM badge */
        .dm-badge {
          position:absolute;
          top:4px; right:10px;
          width:16px; height:16px;
          border-radius:50%;
          background:#ed4956;
          border:2px solid #FFF;
          font-size:9px;
          font-weight:700;
          color:#FFF;
          display:flex; align-items:center; justify-content:center;
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
            background: BG_DARK,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 420,
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(116,179,206,0.25)",
              borderRadius: 20,
              padding: "48px 40px",
            }}
          >
            <div
              style={{
                fontSize: "11px",
                textTransform: "uppercase",
                letterSpacing: "2px",
                color: ACCENT,
                marginBottom: "8px",
              }}
            >
              Tu identidad
            </div>
            <h2
              style={{
                fontFamily: "'LEMON MILK',sans-serif",
                fontSize: "22px",
                color: "#FFF",
                marginBottom: "36px",
              }}
            >
              ¿Con qué nombre entrás?
            </h2>
            <div style={{ position: "relative", marginBottom: 16 }}>
              <span
                style={{
                  position: "absolute",
                  left: 16,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "rgba(255,255,255,0.3)",
                  fontSize: 16,
                }}
              >
                @
              </span>
              <input
                suppressHydrationWarning
                type="text"
                value={username}
                onChange={(e) =>
                  setUsername(
                    e.target.value
                      .toLowerCase()
                      .replace(/[^a-z0-9_]/g, "")
                      .slice(0, 20),
                  )
                }
                placeholder="tu_usuario"
                style={{
                  width: "100%",
                  padding: "16px 16px 16px 34px",
                  borderRadius: 12,
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(116,179,206,0.25)",
                  color: "#FFF",
                  outline: "none",
                  fontSize: 15,
                }}
              />
            </div>
            <button
              suppressHydrationWarning
              disabled={username.length < 3}
              onClick={() => setView("world")}
              style={{
                width: "100%",
                padding: 16,
                borderRadius: 12,
                background:
                  username.length >= 3 ? ACCENT : "rgba(255,255,255,0.06)",
                color: "#FFF",
                border: "none",
                fontFamily: "'LEMON MILK',sans-serif",
                fontSize: 13,
                fontWeight: "bold",
                opacity: username.length >= 3 ? 1 : 0.5,
                cursor: username.length >= 3 ? "pointer" : "not-allowed",
              }}
            >
              CONTINUAR
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
              <ShieldCheck size={24} color="#000" strokeWidth={2.5} />
              <span
                style={{
                  fontFamily: "'LEMON MILK',sans-serif",
                  fontSize: 16,
                  fontWeight: "bold",
                  color: "#000",
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
                    }
                  }}
                  style={{ position: "relative" }}
                >
                  <Icon
                    size={24}
                    strokeWidth={active ? 2.5 : 1.8}
                    color="#000"
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
                        background: "#ed4956",
                        border: "2px solid #FFF",
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
                    padding: "12px",
                    marginBottom: 8,
                    background: "rgba(116,179,206,0.08)",
                    borderRadius: 10,
                    border: "1px solid rgba(116,179,206,0.15)",
                  }}
                >
                  <div
                    style={{ fontSize: 11, color: "#737373", marginBottom: 4 }}
                  >
                    Sesión activa
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#000" }}>
                    @{username}
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      color: ACCENT_DIM,
                      fontWeight: 700,
                      marginTop: 4,
                    }}
                  >
                    {xp} XP
                  </div>
                </div>
              )}
              <div className="ig-nav-item">
                <Menu size={24} strokeWidth={1.8} color="#000" />
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
                    border: "1px solid #DBDBDB",
                    borderRadius: 3,
                    padding: "24px 20px",
                    marginBottom: 20,
                    textAlign: "center",
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
                      color: "#000",
                      marginBottom: 8,
                    }}
                  >
                    Bienvenido a Safenet
                  </div>
                  <div
                    style={{
                      fontSize: 14,
                      color: "#737373",
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
                      background: ACCENT,
                      color: "#FFF",
                      border: "none",
                      borderRadius: 8,
                      padding: "12px 24px",
                      fontSize: 14,
                      fontWeight: 600,
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      fontFamily: "inherit",
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
                    <div style={{ fontSize: 12, color: "#737373" }}>
                      Lecturas del feed
                    </div>
                    <div
                      style={{ fontSize: 16, fontWeight: 700, color: "#000" }}
                    >
                      {xp} XP · {completedModules.size}/5 señales
                    </div>
                  </div>
                  <div
                    style={{
                      flex: 1,
                      margin: "0 16px",
                      height: 6,
                      background: "#EFEFEF",
                      borderRadius: 99,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${Math.min(100, Math.round((completedModules.size / 5) * 100))}%`,
                        background: ACCENT,
                        borderRadius: 99,
                        transition: "width 0.8s ease",
                      }}
                    />
                  </div>
                  <div style={{ fontSize: 12, color: ACCENT, fontWeight: 700 }}>
                    {Math.round((completedModules.size / 5) * 100)}%
                  </div>
                </div>
              )}

              {/* ── STORIES — ahora interactivas ── */}
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

              {/* ═══════════════════════════════════════════
                  FEED POSTS — ORDEN INTERCALADO
              ═══════════════════════════════════════════ */}

              {/* 1. ONG — pantallas */}
              <OngPost
                time="3 h"
                imgSrc="/ime1.png"
                imgAlt="Las pantallas no son juguetes"
                likeCount={378}
                likedBy={USERS.sofi.handle}
                caption={
                  <>
                    <b>groomingargentina</b>El mal uso de la Inteligencia Artificial (IA) 
                    puede traducirse en nuevas formas de Bullying, Grooming o Abuso Cibernético.
                    <br />
                    <br />
                    El Deep Fake es una forma de violencia digital que sufren, 
                    en su mayoría, niñas y adolescentes. Parece real, pero es falso. Parece broma, pero es abuso.
                    <br />
                    <br />
                    #Grooming #Ciberseguridad #InfanciasDigitales #Deefakes
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
              />

              {/* 1B. REEL — video integrado */}
              <ReelPost
                user="juani"
                time="4 h"
                videoId="5eAW5BY7Xyc"
                likeCount={1487}
                caption={
                  <>
                    <b>{USERS.juani.handle}</b>
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

              {/* 2. EXPERIENCIA — DM Simulador */}
              <ExperiencePost
                moduleId="dm_sim"
                user="valen"
                time="5 h"
                headline="Te llegó una solicitud de mensaje."
                subline="Parece normal, pero algo no termina de cerrar."
                ctaLabel="Responder ahora"
                likeCount={912}
                visualType="chat"
                onStart={openModule}
              />

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

              {/* 4. ONG — deepfake */}
              <OngPost
                time="1 d"
                imgSrc="/ime2.png"
                imgAlt="Peligros de la IA"
                likeCount={214}
                likedBy={USERS.juani.handle}
                caption={
                  <>
                    <b>groomingargentina</b>La IA también se usa para hacerle
                    daño a menores.
                    <br />
                    <br />
                    El #Deepfake permite crear imágenes íntimás falsas pero
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

              {/* 5. EXPERIENCIA — Perfiles falsos */}
              <ExperiencePost
                moduleId="profile_detector"
                user="sofi"
                time="1 d"
                headline="Este perfil empezó a seguirte."
                subline="Antes de aceptar, miralo dos veces."
                ctaLabel="Abrir perfil"
                likeCount={654}
                visualType="profile"
                onStart={openModule}
              />

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

              {/* 11. EXPERIENCIA — Análisis de captura */}
              <ExperiencePost
                moduleId="screenshot_analysis"
                user="andrea"
                time="4 d"
                headline="Te mandaron una captura por privado."
                subline="La conversación escala rápido."
                ctaLabel="Ver conversación"
                likeCount={329}
                visualType="chat"
                onStart={openModule}
              />

              {/* Footer del feed */}
              <div
                style={{
                  textAlign: "center",
                  padding: "32px 0",
                  color: "#C7C7C7",
                  fontSize: 12,
                  borderTop: "1px solid #DBDBDB",
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
                      background: "#EFEFEF",
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
                      style={{ fontWeight: 600, fontSize: 14, color: "#000" }}
                    >
                      @{username}
                    </div>
                    <div style={{ fontSize: 14, color: "#737373" }}>
                      Perfil activo
                    </div>
                  </div>
                </div>
                {/* Progreso de módulos */}
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: "#737373",
                    marginBottom: 14,
                  }}
                >
                  Movimientos para revisar
                </div>
                {(
                  [
                    { id: "dm_sim", label: "Solicitud de mensaje" },
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
                      style={{ display: "flex", alignItems: "center", gap: 8 }}
                    >
                      <div
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          background: completedModules.has(m.id)
                            ? "#22C55E"
                            : "#DBDBDB",
                          flexShrink: 0,
                        }}
                      />
                      <span
                        style={{
                          fontSize: 14,
                          color: completedModules.has(m.id)
                            ? "#737373"
                            : "#000",
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
                      style={{ fontWeight: 600, fontSize: 14, color: "#000" }}
                    >
                      tu_usuario
                    </div>
                    <div style={{ fontSize: 14, color: "#737373" }}>
                      Tu Perfil
                    </div>
                  </div>
                  <button
                    suppressHydrationWarning
                    onClick={() => setView("setup")}
                    style={{
                      color: "#0095f6",
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
                    color: "#737373",
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
                      color: "#000",
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
                            color: "#000",
                          }}
                        >
                          {user.handle}
                        </div>
                        <div
                          style={{
                            fontSize: 12,
                            color: "#737373",
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
                        color: "#0095f6",
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
                color: "#C7C7C7",
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
              className="bottom-nav-item"
              onClick={() => handleNavClick(tab)}
            >
              <Icon
                size={24}
                strokeWidth={activeTab === tab ? 2.5 : 1.8}
                color={activeTab === tab ? "#000" : "#737373"}
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
          DM CHAT VIEW (envuelve DmSimModule)
      ══════════════════════════════════════════════════════ */}
      {showDmChat && (
        <DmChatView
          onComplete={handleDmComplete}
          onXp={handleXp}
          onBack={() => setShowDmChat(false)}
        />
      )}

      {/* ══════════════════════════════════════════════════════
          MODAL DE MÓDULOS (lógica intacta)
      ══════════════════════════════════════════════════════ */}
      {activeModule && (
        <div className="module-overlay">
          <div className="module-inner">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 24,
                paddingBottom: 20,
                borderBottom: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 11,
                    textTransform: "uppercase",
                    letterSpacing: 2,
                    color: ACCENT,
                    marginBottom: 6,
                  }}
                >
                  {
                    {
                      dm_sim: "Mensaje directo",
                      profile_detector: "Perfil",
                      story_path: "Historia",
                      red_flags: "Señales",
                      screenshot_analysis: "Captura",
                    }[activeModule]
                  }
                </div>
                <div
                  style={{
                    fontFamily: "'LEMON MILK',sans-serif",
                    fontSize: 16,
                    color: "#FFF",
                  }}
                >
                  {
                    {
                      dm_sim: "Seguí la conversación",
                      profile_detector: "¿Lo aceptarías?",
                      story_path: "Lo que harías después",
                      red_flags: "¿Te hace ruido?",
                      screenshot_analysis: "Qué responderías",
                    }[activeModule]
                  }
                </div>
              </div>
              <button
                suppressHydrationWarning
                onClick={() => setActiveModule(null)}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "rgba(255,255,255,0.5)",
                  fontSize: 14,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                  e.currentTarget.style.color = "#FFF";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                  e.currentTarget.style.color = "rgba(255,255,255,0.5)";
                }}
              >
                ✕
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