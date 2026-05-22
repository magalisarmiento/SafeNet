"use client";

import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { trackWorldEntry } from "@/lib/tracking";

/* ============================================================
   PALETA — SAFENET (alineada con la home)
   ============================================================ */
const C = {
  white:    "#FFFFFF",
  bgSoft:   "#F8FAFC",
  celeste:  "#e5ebfa",
  blue:     "#0B5CFF",
  blueDark: "#061538",
  blueDeep: "#102A43",
  textMute: "#5B6B7A",
  line:     "#D8E3EC",
  success:  "#16A34A",
  successSoft: "#DCFCE7",
  danger:   "#DC2626",
  dangerSoft: "#FEE2E2",
  warning:  "#EA580C",
  warningSoft: "#FFEDD5",
  // micro acentos cálidos
  sun:      "#F5C451",
  peach:    "#F8B4A0",
  mint:     "#9BE5C7",
  lilac:    "#C7B8FF",
};

type Avatar = {
  id: string;
  name: string;
  accent: string;
  bg: string;
  img: string;
};

const avatars: Avatar[] = [
  { id: "a1", name: "Hiro",        accent: C.blueDark, bg: "rgba(11, 92, 255, 0.08)",  img: "/im1.png" },
  { id: "a2", name: "Honey Lemon", accent: C.blue,     bg: "rgba(229, 235, 250, 0.6)", img: "/im2.png" },
  { id: "a3", name: "Baymax",      accent: C.blueDeep, bg: "rgba(255, 255, 255, 0.9)", img: "/im3.png" },
  { id: "a4", name: "Wasabi",      accent: C.blue,     bg: "rgba(11, 92, 255, 0.06)",  img: "/im4.png" },
];

/* ============================================================
   DECORACIONES — PlusMark, Sparkle, Star, Blob
   ============================================================ */
const PlusMark = ({ top, left, right, bottom, size = 14, opacity = 0.45, anim }: any) => (
  <span aria-hidden className={anim ? 'float-slow' : ''} style={{ position: "absolute", top, left, right, bottom, width: size, height: size, opacity, color: C.blue, pointerEvents: "none" }}>
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
  </span>
);

const Sparkle = ({ top, left, right, bottom, size = 14, color = C.blue, opacity = 0.7, delay = 0 }: any) => (
  <span aria-hidden className="twinkle" style={{ position: 'absolute', top, left, right, bottom, width: size, height: size, opacity, pointerEvents: 'none', animationDelay: `${delay}s` }}>
    <svg viewBox="0 0 24 24" fill="none">
      <path d="M12 2 L13.5 10.5 L22 12 L13.5 13.5 L12 22 L10.5 13.5 L2 12 L10.5 10.5 Z" fill={color} />
    </svg>
  </span>
);

const Dot = ({ top, left, right, bottom, size = 8, color = C.blue, opacity = 0.5 }: any) => (
  <span aria-hidden style={{ position: 'absolute', top, left, right, bottom, width: size, height: size, borderRadius: '50%', background: color, opacity, pointerEvents: 'none' }} />
);

const Ring = ({ top, left, right, bottom, size = 60, color = C.blue, opacity = 0.18, weight = 1.5 }: any) => (
  <span aria-hidden className="float-slow" style={{ position: 'absolute', top, left, right, bottom, width: size, height: size, borderRadius: '50%', border: `${weight}px dashed ${color}`, opacity, pointerEvents: 'none' }} />
);

/* ============================================================
   PERSONAJES — Grandes Héroes (imágenes en /public)
   ============================================================ */

const HeroImg = ({ src, size = 110, alt = "Personaje" }: { src: string; size?: number; alt?: string }) => (
  <img
    src={src}
    alt={alt}
    style={{
      width: size,
      height: size,
      objectFit: 'contain',
      filter: 'drop-shadow(0 12px 22px rgba(6,21,56,0.18))',
      pointerEvents: 'none',
      userSelect: 'none',
    }}
    draggable={false}
  />
);

const KidGuardian = ({ size = 110 }: { size?: number }) => <HeroImg src="/ims1.png" size={size} alt="Hiro" />;
const KidExplorer = ({ size = 110 }: { size?: number }) => <HeroImg src="/ims2.png" size={size} alt="Honey Lemon" />;
const KidWaving   = ({ size = 110 }: { size?: number }) => <HeroImg src="/ims3.png" size={size} alt="Baymax" />;
const KidThinking = ({ size = 90  }: { size?: number }) => <HeroImg src="/ims4.png" size={size} alt="Wasabi" />;
const HeroExtra1  = ({ size = 110 }: { size?: number }) => <HeroImg src="/ims5.png" size={size} alt="Gogo" />;
const HeroExtra2  = ({ size = 110 }: { size?: number }) => <HeroImg src="/ims6.png" size={size} alt="Fred" />;

/* ── STYLIZED CHARACTER ICON / IMAGE RENDERER ── */
const CharacterVisual = ({ img, accent, size = 40 }: { img?: string; accent: string; size?: number }) => {
  if (img) {
    return (
      <div style={{ width: size, height: size, borderRadius: '50%', overflow: 'hidden', background: C.celeste, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${C.line}` }}>
        <img src={img} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="12" y="8" width="16" height="16" rx="4" fill={accent} fillOpacity="0.9" />
      <path d="M8 32C8 28.6863 10.6863 26 14 26H26C29.3137 26 32 28.6863 32 32V36H8V32Z" fill={accent} fillOpacity="0.7" />
      <circle cx="17" cy="14" r="1.5" fill="#FFFFFF" />
      <circle cx="23" cy="14" r="1.5" fill="#FFFFFF" />
    </svg>
  );
};

/* ============================================================
   FONDO ANIMADO LIGERO — partículas + blobs CSS
   ============================================================ */
const LightParticles = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const isMobile = width < 768;
    const PARTICLE_COUNT = isMobile ? 22 : 60;

    type P = { x: number; y: number; vx: number; vy: number; r: number; alpha: number; tone: 0 | 1 | 2 };
    const particles: P[] = [];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: Math.random() * 1.6 + 0.6,
        alpha: Math.random() * 0.35 + 0.15,
        tone: (Math.floor(Math.random() * 3) as 0 | 1 | 2),
      });
    }

    let mouse = { x: width / 2, y: height / 2 };
    let raf = 0;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // halos
      const grad = ctx.createRadialGradient(width * 0.8, height * 0.2, 0, width * 0.8, height * 0.2, Math.max(width, height) * 0.6);
      grad.addColorStop(0, 'rgba(229, 235, 250, 0.55)');
      grad.addColorStop(1, 'rgba(229, 235, 250, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      const grad2 = ctx.createRadialGradient(width * 0.15, height * 0.85, 0, width * 0.15, height * 0.85, Math.max(width, height) * 0.5);
      grad2.addColorStop(0, 'rgba(11, 92, 255, 0.05)');
      grad2.addColorStop(1, 'rgba(11, 92, 255, 0)');
      ctx.fillStyle = grad2;
      ctx.fillRect(0, 0, width, height);

      for (const p of particles) {
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 140) {
          p.vx += (dx / d) * 0.005;
          p.vy += (dy / d) * 0.005;
        }
        p.vx *= 0.985;
        p.vy *= 0.985;
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;
        if (p.y < -20) p.y = height + 20;
        if (p.y > height + 20) p.y = -20;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        const fill =
          p.tone === 0 ? `rgba(11, 92, 255, ${p.alpha})` :
          p.tone === 1 ? `rgba(102, 130, 200, ${p.alpha * 0.7})` :
                         `rgba(155, 229, 199, ${p.alpha * 0.7})`;
        ctx.fillStyle = fill;
        ctx.fill();
      }

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i], b = particles[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 110) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(11, 92, 255, ${0.08 * (1 - d / 110)})`;
            ctx.lineWidth = 1;
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    const handleMouse = (e: MouseEvent) => { mouse.x = e.clientX; mouse.y = e.clientY; };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouse);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouse);
    };
  }, []);

  return (
    <>
      <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }} />
      {/* Blobs animados de atmósfera */}
      <div aria-hidden className="bg-deco" style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        <span className="blob blob-1" />
        <span className="blob blob-2" />
        <span className="blob blob-3" />
      </div>
    </>
  );
};

/* ============================================================
   UI: FeedbackBox, XpPop, MissionBar, Badge
   ============================================================ */

function FeedbackBox({ message, type }: { message: string; type: 'success' | 'danger' | 'info' }) {
  const styles = {
    success: { bg: 'rgba(22, 163, 74, 0.08)', border: 'rgba(22, 163, 74, 0.30)', color: '#15803D' },
    danger:  { bg: 'rgba(234, 88, 12, 0.08)', border: 'rgba(234, 88, 12, 0.30)', color: '#C2410C' },
    info:    { bg: C.celeste, border: 'rgba(11, 92, 255, 0.25)', color: C.blueDark },
  };
  const s = styles[type];
  return (
    <div style={{
      background: s.bg, border: `1px solid ${s.border}`, color: s.color,
      padding: '12px 16px', borderRadius: '12px', fontSize: '13px', lineHeight: 1.5,
      animation: 'slideUpIn 0.4s ease-out forwards', margin: '10px 0', fontWeight: 500,
      fontFamily: "'Inter', sans-serif"
    }}>
      {message}
    </div>
  );
}

function XpPop({ amount, onDone }: { amount: number; onDone: () => void }) {
  useEffect(() => { const t = setTimeout(onDone, 1800); return () => clearTimeout(t); }, [onDone]);
  return (
    <div style={{
      position: 'fixed', bottom: '100px', right: '40px', zIndex: 9999,
      background: C.blue, color: C.white, padding: '10px 18px', borderRadius: '999px',
      fontFamily: "'Space Grotesk', 'Inter', sans-serif", fontSize: '14px', fontWeight: 700,
      boxShadow: '0 8px 22px rgba(11,92,255,0.35)', border: `1px solid ${C.blue}`,
      animation: 'xpPop 1.8s ease-out forwards', letterSpacing: '0.5px',
      display: 'inline-flex', alignItems: 'center', gap: 8
    }}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="#FFFFFF"><path d="M12 2 L14 9 L22 10 L16 15 L18 22 L12 18 L6 22 L8 15 L2 10 L10 9 Z"/></svg>
      +{amount} XP
    </div>
  );
}

function MissionBar({ label, current, max, color }: { label: string; current: number; max: number; color?: string }) {
  const pct = Math.min(100, Math.round((current / max) * 100));
  const fill = color ?? C.blue;
  return (
    <div style={{ marginBottom: '14px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10.5px', fontWeight: 700, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '1.4px', fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}>
        <span style={{ color: C.blueDark }}>{label}</span><span style={{ color: fill }}>{pct}%</span>
      </div>
      <div style={{ height: '10px', background: C.celeste, borderRadius: '99px', overflow: 'hidden', position: 'relative' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: `linear-gradient(90deg, ${C.blue}, #4A82FF)`, transition: 'width 0.8s cubic-bezier(.16,1,.3,1)', borderRadius: '99px', boxShadow: '0 0 12px rgba(11,92,255,0.35)' }} />
      </div>
    </div>
  );
}

function Badge({ children, tone = 'neutral', pulse = false }: { children: React.ReactNode; tone?: 'neutral' | 'success' | 'danger' | 'blue' | 'sun' | 'mint'; pulse?: boolean }) {
  const map = {
    neutral: { bg: C.celeste, color: C.blueDark, border: C.line },
    success: { bg: 'rgba(22,163,74,0.10)', color: '#15803D', border: 'rgba(22,163,74,0.3)' },
    danger:  { bg: 'rgba(234,88,12,0.10)', color: '#C2410C', border: 'rgba(234,88,12,0.3)' },
    blue:    { bg: 'rgba(11,92,255,0.10)', color: C.blue, border: 'rgba(11,92,255,0.3)' },
    sun:     { bg: 'rgba(245,196,81,0.18)', color: '#A6770D', border: 'rgba(245,196,81,0.45)' },
    mint:    { bg: 'rgba(155,229,199,0.20)', color: '#0F7A52', border: 'rgba(155,229,199,0.55)' },
  } as const;
  const s = map[tone];
  return (
    <span className={pulse ? 'badge-pulse' : ''} style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '4px 10px', borderRadius: '999px',
      background: s.bg, color: s.color, border: `1px solid ${s.border}`,
      fontSize: '10.5px', fontWeight: 700, letterSpacing: '1.3px',
      textTransform: 'uppercase', fontFamily: "'Space Grotesk', 'Inter', sans-serif"
    }}>{children}</span>
  );
}

/* ════════════════════════════════
   DATOS DE MÓDULOS (sin cambios)
════════════════════════════════ */

const chatScript = [
  { from: 'stranger', text: '¡Jugás re bien! Justo buscaba alguien para pasar este nivel.' },
  { from: 'stranger', text: 'A mí también me gusta este juego. Casi nadie de mi edad lo juega.' },
  { from: 'stranger', text: '¿Jugás siempre a esta hora? Yo me conecto casi todos los días.' },
  { from: 'stranger', text: 'Sos de las pocas personas copadas que conocí acá. ¿Cómo te llamás en la vida real?' },
  { from: 'stranger', text: 'Por acá el chat anda mal. ¿Tenés Discord o algún otro chat para hablar tranqui?' },
  { from: 'stranger', text: 'Lo nuestro es solo para jugar, no hace falta que le cuentes a nadie. Es nuestro secreto, ¿dale?' },
  { from: 'stranger', text: 'Mandame una foto tuya, así sé con quién juego. Te regalo skins si la mandás.' },
];

const chatChoices: Record<number, any[]> = {
  0: [
    { text: 'Gracias, ¡vos también! ¿De qué clan sos?', isSafe: true, points: 25, consequence: 'Buen comienzo: hablar del juego mantiene la charla en zona segura.', consequenceType: 'success' },
    { text: '¡Sí, soy GamerPro_X, encantado!', isSafe: false, points: 5, consequence: 'Cuidado: tu nombre de usuario también es un dato. Mejor mantenelo solo en el chat del juego.', consequenceType: 'info' },
  ],
  1: [
    { text: '¡Qué bueno, sumemos al equipo!', isSafe: true, points: 25, consequence: 'Está bien jugar juntos. Igual recordá: no sabés realmente quién está del otro lado.', consequenceType: 'success' },
    { text: '¿Cuántos años tenés? Yo tengo la misma edad.', isSafe: false, points: 5, consequence: 'Atención: muchos adultos mienten sobre su edad online para ganarse la confianza de chicos y chicas.', consequenceType: 'info' },
  ],
  2: [
    { text: 'Sí, casi siempre después de la escuela.', isSafe: false, points: 0, consequence: 'Tus horarios son un dato privado. Saber cuándo te conectás ayuda a otros a controlarte.', consequenceType: 'danger' },
    { text: 'Depende, no siempre. Prefiero no decirte cuándo me conecto.', isSafe: true, points: 35, consequence: '¡Muy bien! Tus horarios son parte de tu privacidad.', consequenceType: 'success' },
  ],
  3: [
    { text: 'Le digo mi apodo, pero no mi nombre real.', isSafe: false, points: 10, consequence: 'Mejor que nada, pero seguís dando información. Lo más seguro es mantenerse en el apodo del juego y no avanzar a datos personales.', consequenceType: 'info' },
    { text: 'Prefiero que no hablemos de cosas personales. Sigamos jugando.', isSafe: true, points: 40, consequence: '¡Excelente! Marcaste un límite claro y eso te cuida.', consequenceType: 'success' },
  ],
  4: [
    { text: 'Le paso mi Discord, parece buena onda.', isSafe: false, points: 0, consequence: 'Atención: cambiar de plataforma es una señal típica de grooming. Lleva la charla a un lugar sin moderación. Mejor seguir solo en el chat del juego.', consequenceType: 'danger' },
    { text: '¿Por qué querés hablar fuera del juego?', isSafe: true, points: 30, consequence: 'Buena pregunta: cuando alguien insiste en cambiar de plataforma sin un motivo claro, conviene desconfiar.', consequenceType: 'success' },
    { text: 'Te digo que solo hablo por el chat del juego.', isSafe: true, points: 45, consequence: '¡Muy bien! El chat del juego está moderado y es más seguro que un canal privado.', consequenceType: 'success' },
  ],
  5: [
    { text: 'Dale, no le cuento a nadie.', isSafe: false, points: 0, consequence: 'Pedir secreto es una señal de alerta importante: nadie que te quiera bien te pide que escondas cosas de tu familia.', consequenceType: 'danger' },
    { text: 'Si no puedo contarlo a mis padres, ya no me interesa.', isSafe: true, points: 50, consequence: '¡Perfecto! Si algo no se puede contar a un adulto de confianza, probablemente no es seguro.', consequenceType: 'success' },
  ],
  6: [
    { text: 'No mando nada. Lo bloqueo y se lo cuento a un adulto.', isSafe: true, points: 60, consequence: 'Muy buena decisión: bloquear corta el contacto y contarle a un adulto de confianza te ayuda a no estar solo con esto.', consequenceType: 'success' },
    { text: 'Le digo que no, pero seguimos hablando.', isSafe: false, points: 10, consequence: 'Estuvo bien decir que no. Pero si ya pidió foto y secreto, lo más seguro es cortar el contacto y avisar a un adulto.', consequenceType: 'info' },
    { text: 'Le mando la foto, total es solo de la cara.', isSafe: false, points: 0, consequence: 'Una foto puede usarse para presionarte después. Si algo te incomoda, no sigas: bloqueá y contale a un adulto de confianza.', consequenceType: 'danger' },
  ],
};

const scenarios: any[] = [
  {
    id: 1,
    situation: 'Un jugador que conociste hace una semana te ayuda mucho a pasar niveles y ahora te pide que sigan hablando por privado. ¿Qué hacés?',
    options: [
      { text: 'Acepto, total me cae bien.', points: 5, feedback: 'Cuidado: que alguien sea amable un rato no significa que lo conozcas. Hablar por privado saca la charla de la zona moderada del juego.', feedbackType: 'info' },
      { text: 'Le digo que prefiero seguir charlando en el chat del juego.', points: 40, feedback: '¡Muy bien! Mantener la conversación en el chat público es una buena forma de cuidarte sin cortar la amistad.', feedbackType: 'success' },
      { text: 'No respondo y se lo cuento a un adulto si insiste.', points: 35, feedback: 'Buena decisión: si alguien insiste con llevarte a un chat privado, contarlo a un adulto de confianza siempre ayuda.', feedbackType: 'success' },
    ],
  },
  {
    id: 2,
    situation: 'Alguien dice tener tu misma edad, pero nunca quiere mostrarse, ni con foto ni por cámara. ¿Qué pensás?',
    options: [
      { text: 'Le creo, capaz es tímido como yo.', points: 0, feedback: 'Atención: muchas personas adultas se hacen pasar por chicos de tu edad. Si alguien siempre evita mostrarse, conviene desconfiar.', feedbackType: 'danger' },
      { text: 'Le pregunto, pero igual sigo hablando como si nada.', points: 10, feedback: 'Está bien preguntar, pero si la respuesta no convence, lo más seguro es no compartir información personal.', feedbackType: 'info' },
      { text: 'Me cuido: no comparto datos hasta saber bien quién es, y lo charlo con un adulto.', points: 40, feedback: '¡Excelente! Frenar y consultar con un adulto antes de avanzar te protege.', feedbackType: 'success' },
    ],
  },
  {
    id: 3,
    situation: 'Un compañero de la escuela te suma a un grupo donde también hay personas mayores que no conocés. ¿Qué hacés?',
    options: [
      { text: 'Me quedo callado para no quedar mal con mi compañero.', points: 0, feedback: 'No tenés que aguantar algo que te incomoda para “quedar bien”. Tu seguridad importa más que la opinión del grupo.', feedbackType: 'danger' },
      { text: 'Salgo del grupo y se lo cuento a un adulto de confianza.', points: 45, feedback: '¡Muy bien! Salir y avisar es la mejor combinación cuando aparecen desconocidos mayores.', feedbackType: 'success' },
      { text: 'Me quedo, pero no escribo nada.', points: 10, feedback: 'Cuidarse de no escribir está bien, pero seguís expuesto. Mejor salir y avisar a un adulto.', feedbackType: 'info' },
    ],
  },
  {
    id: 4,
    situation: 'Un usuario te ofrece monedas o skins gratis a cambio de mantener una conversación “entre vos y él”. ¿Qué hacés?',
    options: [
      { text: 'Acepto, total es solo charlar.', points: 0, feedback: 'Los regalos pueden usarse para manipular. Si la condición es guardar secreto, es una señal de alerta clara.', feedbackType: 'danger' },
      { text: 'Le digo que no, no necesito regalos para hablar con alguien.', points: 45, feedback: '¡Muy bien! Nadie de confianza necesita pagarte para que charles con esa persona.', feedbackType: 'success' },
      { text: 'Acepto las skins, pero no hablo de nada personal.', points: 5, feedback: 'Aceptar el regalo abre la puerta. Lo más seguro es no entrar en ese intercambio.', feedbackType: 'info' },
    ],
  },
  {
    id: 5,
    situation: 'Alguien te pide una foto “normal”, solo de tu cara, para reconocerte en un grupo. ¿Qué hacés?',
    options: [
      { text: 'Le mando una foto, total se ve poco.', points: 0, feedback: 'Una foto, aunque parezca inocente, puede guardarse y usarse para presionarte después. Mejor no enviarla.', feedbackType: 'danger' },
      { text: 'Le digo que no comparto fotos con personas que no conozco en persona.', points: 45, feedback: '¡Excelente! Esa regla simple te protege en cualquier app.', feedbackType: 'success' },
      { text: 'Le mando un dibujo o avatar en vez de una foto real.', points: 25, feedback: 'Buena idea para mantener la privacidad. Igual, si la persona insiste mucho con una foto real, contale a un adulto.', feedbackType: 'success' },
    ],
  },
  {
    id: 6,
    situation: 'Una conversación te hizo sentir raro, pero no querés parecer exagerado al contarlo. ¿Qué hacés?',
    options: [
      { text: 'No digo nada, capaz es solo mi impresión.', points: 0, feedback: 'Si algo te incomodó, esa sensación es una señal importante. Pedir ayuda no es exagerar: es cuidarte.', feedbackType: 'danger' },
      { text: 'Le cuento a mi mamá, papá o un adulto de confianza lo que pasó.', points: 50, feedback: '¡Muy bien! Hablar lo que te incomoda casi siempre alivia y te ayuda a decidir mejor.', feedbackType: 'success' },
      { text: 'Lo hablo solo con un amigo de mi edad.', points: 15, feedback: 'Hablarlo está bien, pero un amigo también puede no saber qué hacer. Sumá a un adulto de confianza.', feedbackType: 'info' },
    ],
  },
  {
    id: 7,
    situation: 'Le dijiste a alguien que no querías seguir hablando, pero insiste y te escribe desde otro usuario. ¿Qué hacés?',
    options: [
      { text: 'Le respondo enojado para que pare.', points: 0, feedback: 'Responder, aunque sea enojado, mantiene el contacto. Mejor bloquear y reportar sin discutir.', feedbackType: 'danger' },
      { text: 'Bloqueo, reporto la cuenta y se lo cuento a un adulto.', points: 50, feedback: '¡Perfecto! Bloquear y reportar corta el contacto, y contarlo te asegura apoyo si vuelve a aparecer.', feedbackType: 'success' },
      { text: 'Lo bloqueo, pero no le cuento a nadie.', points: 25, feedback: 'Bloquear está muy bien. Avisar a un adulto suma una capa más de protección.', feedbackType: 'info' },
    ],
  },
  {
    id: 8,
    situation: 'Un usuario te dice: “Si contás algo de lo que hablamos, me voy a enojar y no te hablo más”. ¿Qué pensás?',
    options: [
      { text: 'Mejor me callo, no quiero perder a este amigo.', points: 0, feedback: 'Una persona que te amenaza con dejarte de hablar para que guardes secreto no es un amigo real. Es una señal típica de manipulación.', feedbackType: 'danger' },
      { text: 'Le cuento igual a un adulto: ningún chat vale más que mi seguridad.', points: 55, feedback: '¡Muy bien! Si para mantener una amistad tenés que ocultar cosas, no es una amistad sana.', feedbackType: 'success' },
      { text: 'Le digo que no me amenace y sigo hablando.', points: 10, feedback: 'Marcar el límite está bien, pero el patrón ya apareció. Contale a un adulto antes de que escale.', feedbackType: 'info' },
    ],
  },
];

/* ── CHAT MODULE ── */
function ChatModule({ onComplete, onXp }: any) {
  const [history, setHistory] = useState<any[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [phase, setPhase] = useState<'playing' | 'result'>('playing');
  const [showXp, setShowXp] = useState(0);
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (history.length === 0) setHistory([chatScript[0]]);
  }, []);

  useEffect(() => { if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight; }, [history, isTyping]);

  const handleChoice = (choice: any) => {
    const newHistory = [...history, { from: 'player', text: choice.text }];
    newHistory.push({ from: 'system', text: choice.consequence, type: choice.consequenceType });
    setHistory(newHistory);

    if (choice.points > 0) {
      setTotalPoints(p => p + choice.points);
      setShowXp(choice.points);
      onXp(choice.points);
    }

    if (currentStep + 1 >= Object.keys(chatChoices).length) {
      setTimeout(() => setPhase('result'), 2000);
      return;
    }

    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setHistory(prev => [...prev, chatScript[currentStep + 1]]);
      setCurrentStep(p => p + 1);
    }, 1500);
  };

  if (phase === 'result') return (
    <div style={{ textAlign: 'center', padding: '8px 0' }}>
      <div className="badge-pulse" style={{ width: 72, height: 72, margin: '0 auto 18px', borderRadius: '50%', background: C.celeste, border: `1px solid ${C.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke={C.blue} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="M9 12l2 2 4-4" /></svg>
      </div>
      <h3 style={{ fontFamily: "'Space Grotesk', 'Inter', sans-serif", fontSize: '20px', color: C.blueDark, marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '-0.5px' }}>¡Misión completada!</h3>
      <div style={{ fontSize: '40px', fontWeight: 700, color: C.blue, marginBottom: '24px', fontFamily: "'Space Grotesk', 'Inter', sans-serif", letterSpacing: '-1px' }}>{totalPoints} pts</div>
      <button onClick={() => onComplete(totalPoints)} className="btn-primary" style={{ padding: '14px 28px', borderRadius: '999px', fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', cursor: 'pointer' }}>Reclamar XP</button>
    </div>
  );

  return (
    <div>
      {showXp > 0 && <XpPop amount={showXp} onDone={() => setShowXp(0)} />}
      <MissionBar label="Seguridad del Chat" current={currentStep} max={chatScript.length} />
      <div ref={chatRef} style={{ background: C.bgSoft, borderRadius: "16px", border: `1px solid ${C.line}`, padding: "18px", marginBottom: "16px", maxHeight: "320px", overflowY: 'auto', display: "flex", flexDirection: "column", gap: "10px", backgroundImage: `radial-gradient(${C.celeste} 1px, transparent 1px)`, backgroundSize: '12px 12px' }}>
        {history.map((m, i) => (
          <div key={i} style={{ animation: 'slideUpIn 0.3s ease' }}>
            {m.from === 'stranger' && (
              <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
                <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: C.celeste, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${C.line}` }}>
                  <CharacterVisual accent={C.blueDark} size={20} />
                </div>
                <div style={{ background: C.white, border: `1px solid ${C.line}`, padding: "10px 14px", borderRadius: "14px 14px 14px 4px", fontSize: "14px", color: C.blueDark, maxWidth: '85%', lineHeight: 1.45, boxShadow: '0 2px 6px rgba(6,21,56,0.04)' }}>{m.text}</div>
              </div>
            )}
            {m.from === 'player' && (
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <div style={{ background: `linear-gradient(135deg, ${C.blue}, #4A82FF)`, padding: "10px 14px", borderRadius: "14px 14px 4px 14px", fontSize: "14px", color: C.white, maxWidth: '85%', lineHeight: 1.45, boxShadow: '0 6px 16px rgba(11,92,255,0.25)' }}>{m.text}</div>
              </div>
            )}
            {m.from === 'system' && (
              <FeedbackBox message={m.text} type={m.type} />
            )}
          </div>
        ))}
        {isTyping && <div style={{ color: C.blue, fontSize: '20px', paddingLeft: '40px', animation: 'typingDot 1s infinite', fontWeight: 700 }}>•••</div>}
      </div>
      {!isTyping && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {chatChoices[currentStep]?.map((c, i) => (
            <button key={i} onClick={() => handleChoice(c)} className="btn-option" style={{ padding: '14px 16px', borderRadius: '12px', textAlign: 'left', background: C.white, border: `1px solid ${C.line}`, color: C.blueDark, fontSize: '14px', fontWeight: 500, fontFamily: "'Inter', sans-serif", cursor: 'pointer', transition: 'all .25s ease' }}>{c.text}</button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── DECISIONS MODULE ── */
function DecisionsModule({ onComplete, onXp }: any) {
  const [idx, setIdx] = useState(0);
  const [pts, setPts] = useState(0);
  const [feedback, setFeedback] = useState<any>(null);
  const [showXp, setShowXp] = useState(0);

  const handleAnswer = (opt: any) => {
    setFeedback({ text: opt.feedback, type: opt.feedbackType });
    if (opt.points > 0) {
      setPts(p => p + opt.points);
      setShowXp(opt.points);
      onXp(opt.points);
    }
    setTimeout(() => {
      setFeedback(null);
      if (idx + 1 >= scenarios.length) onComplete(pts + (opt.points || 0));
      else setIdx(p => p + 1);
    }, 2800);
  };

  return (
    <div>
      {showXp > 0 && <XpPop amount={showXp} onDone={() => setShowXp(0)} />}
      <MissionBar label="Toma de Decisiones" current={idx} max={scenarios.length} />
      <div style={{ background: C.bgSoft, borderRadius: '16px', padding: '24px', marginBottom: '16px', border: `1px solid ${C.line}`, textAlign: 'center', position: 'relative' }}>
        <PlusMark top={10} left={10} size={12} opacity={0.3} />
        <PlusMark bottom={10} right={10} size={12} opacity={0.3} />
        <p style={{ fontSize: '15px', color: C.blueDark, lineHeight: 1.6, margin: 0, fontWeight: 500 }}>{scenarios[idx].situation}</p>
      </div>

      {feedback && <FeedbackBox message={feedback.text} type={feedback.type} />}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: feedback ? '10px' : '12px' }}>
        {scenarios[idx].options.map((o: any, i: number) => (
          <button key={i} onClick={() => handleAnswer(o)} disabled={!!feedback} className="btn-option" style={{ padding: '14px 16px', borderRadius: '12px', textAlign: 'left', background: C.white, border: `1px solid ${C.line}`, color: C.blueDark, fontSize: '14px', fontWeight: 500, opacity: !!feedback ? 0.55 : 1, cursor: !!feedback ? 'default' : 'pointer', transition: 'all .25s ease' }}>{o.text}</button>
        ))}
      </div>
    </div>
  );
}

/* ════════════════════════════════
   MODULO: SOPA DE LETRAS
════════════════════════════════ */

const WORD_SEARCH_WORDS = ['GROOMING', 'SECRETO', 'AYUDA', 'BLOQUEAR', 'DENUNCIAR', 'CONFIANZA'];
const GRID_SIZE = 12;

const WORD_DESCRIPTIONS: Record<string, string> = {
  GROOMING: 'Cuando una persona adulta intenta ganarse la confianza de un chico o chica en internet para manipularlo. Suele empezar con halagos y termina pidiendo secretos, fotos o encuentros.',
  SECRETO: 'Si alguien que conociste online te pide guardar secretos con tus padres o un adulto de confianza, es una señal de alerta importante.',
  AYUDA: 'Pedir ayuda a un adulto de confianza no es ser exagerado: es una forma inteligente de cuidarte cuando algo te incomoda.',
  BLOQUEAR: 'Bloquear sirve para cortar el contacto con alguien que te molesta o incomoda. No estás siendo malo: estás cuidando tu espacio.',
  DENUNCIAR: 'Reportar una cuenta en la plataforma ayuda a protegerte y también a que otros chicos no pasen por lo mismo.',
  CONFIANZA: 'La confianza online se construye con tiempo y cuidado. No todo el mundo es quien dice ser detrás de una pantalla.',
  PRIVACIDAD: 'Tu nombre, tu dirección, tu escuela, tu teléfono y tus horarios son privados. No tenés que compartirlos con desconocidos.',
  ADULTO: 'Un adulto de confianza puede ser tu mamá, papá, abuela, tío, una maestra. Siempre podés contarles si algo online te incomoda.',
};

function generateWordSearchGrid() {
  const grid: string[][] = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(''));
  const placed: { word: string; cells: [number, number][] }[] = [];

  const directions = [
    [0, 1], [1, 0], [1, 1], [0, -1], [-1, 0], [-1, -1], [1, -1], [-1, 1]
  ];

  for (const word of WORD_SEARCH_WORDS) {
    let placed_ok = false;
    let attempts = 0;
    while (!placed_ok && attempts < 200) {
      attempts++;
      const dir = directions[Math.floor(Math.random() * directions.length)];
      const row = Math.floor(Math.random() * GRID_SIZE);
      const col = Math.floor(Math.random() * GRID_SIZE);
      const cells: [number, number][] = [];
      let ok = true;
      for (let i = 0; i < word.length; i++) {
        const r = row + dir[0] * i;
        const c = col + dir[1] * i;
        if (r < 0 || r >= GRID_SIZE || c < 0 || c >= GRID_SIZE) { ok = false; break; }
        if (grid[r][c] !== '' && grid[r][c] !== word[i]) { ok = false; break; }
        cells.push([r, c]);
      }
      if (ok) {
        cells.forEach(([r, c], i) => { grid[r][c] = word[i]; });
        placed.push({ word, cells });
        placed_ok = true;
      }
    }
  }

  const letters = 'ABCDEFGHIJKLMNOPRSTUVWXYZ';
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (grid[r][c] === '') grid[r][c] = letters[Math.floor(Math.random() * letters.length)];
    }
  }
  return { grid, placed };
}

function WordSearchModule({ onComplete, onXp }: any) {
  const [gameData] = useState(() => generateWordSearchGrid());
  const [foundWords, setFoundWords] = useState<Set<string>>(new Set());
  const [selectedCells, setSelectedCells] = useState<[number, number][]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [highlightedCells, setHighlightedCells] = useState<Map<string, string>>(new Map());
  const [lastFeedback, setLastFeedback] = useState<{ text: string; type: 'success' | 'info' | 'danger' } | null>(null);
  const [showXp, setShowXp] = useState(0);
  const [phase, setPhase] = useState<'playing' | 'result'>('playing');

  const wordColors = [C.blue, '#16A34A', '#EA580C', '#8B5CF6', '#0EA5E9', '#DB2777'];

  const cellKey = (r: number, c: number) => `${r},${c}`;

  const checkSelection = useCallback((cells: [number, number][]) => {
    for (const { word, cells: wCells } of gameData.placed) {
      if (foundWords.has(word)) continue;
      const match = wCells.length === cells.length && wCells.every(([wr, wc], i) =>
        cells[i][0] === wr && cells[i][1] === wc
      ) || (wCells.length === cells.length && [...wCells].reverse().every(([wr, wc], i) =>
        cells[i][0] === wr && cells[i][1] === wc
      ));
      if (match) {
        const color = wordColors[foundWords.size % wordColors.length];
        const newMap = new Map(highlightedCells);
        wCells.forEach(([r, c]) => newMap.set(cellKey(r, c), color));
        setHighlightedCells(newMap);
        const newFound = new Set(foundWords);
        newFound.add(word);
        setFoundWords(newFound);
        const pts = 30;
        setShowXp(pts);
        onXp(pts);
        const def = WORD_DESCRIPTIONS[word] ?? '';
        setLastFeedback({ text: `¡Encontraste ${word}! +${pts} XP — ${def}`, type: 'success' });
        if (newFound.size === WORD_SEARCH_WORDS.length) {
          setTimeout(() => setPhase('result'), 1500);
        }
        return true;
      }
    }
    setLastFeedback({ text: 'Esa no es una palabra de la lista, seguí buscando.', type: 'info' });
    return false;
  }, [foundWords, gameData, highlightedCells, onXp]);

  const handleCellStart = (r: number, c: number) => {
    setIsDragging(true);
    setSelectedCells([[r, c]]);
    setLastFeedback(null);
  };

  const handleCellEnter = (r: number, c: number) => {
    if (!isDragging) return;
    const first = selectedCells[0];
    if (!first) return;
    const dr = r - first[0];
    const dc = c - first[1];
    const len = Math.max(Math.abs(dr), Math.abs(dc));
    if (len === 0) { setSelectedCells([first]); return; }
    const stepR = len > 0 ? dr / len : 0;
    const stepC = len > 0 ? dc / len : 0;
    if (Math.abs(stepR) > 1 || Math.abs(stepC) > 1) return;
    if (stepR !== Math.round(stepR) || stepC !== Math.round(stepC)) return;
    const newCells: [number, number][] = [];
    for (let i = 0; i <= len; i++) {
      newCells.push([first[0] + Math.round(stepR * i), first[1] + Math.round(stepC * i)]);
    }
    setSelectedCells(newCells);
  };

  const handleCellEnd = () => {
    if (isDragging && selectedCells.length > 1) checkSelection(selectedCells);
    setIsDragging(false);
    setSelectedCells([]);
  };

  if (phase === 'result') return (
    <div style={{ textAlign: 'center' }}>
      <h3 style={{ fontFamily: "'Space Grotesk', 'Inter', sans-serif", fontSize: '20px', color: C.blueDark, marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '-0.5px' }}>¡Sopa completada!</h3>
      <div style={{ fontSize: '40px', fontWeight: 700, color: C.blue, marginBottom: '8px', fontFamily: "'Space Grotesk', 'Inter', sans-serif", letterSpacing: '-1px' }}>{foundWords.size * 30} XP</div>
      <p style={{ color: C.textMute, marginBottom: '24px', fontSize: '14px' }}>Encontraste {foundWords.size} palabras clave</p>
      <button onClick={() => onComplete(foundWords.size * 30)} className="btn-primary" style={{ padding: '14px 28px', borderRadius: '999px', fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', cursor: 'pointer' }}>Reclamar XP</button>
    </div>
  );

  return (
    <div>
      {showXp > 0 && <XpPop amount={showXp} onDone={() => setShowXp(0)} />}
      <MissionBar label="Palabras Encontradas" current={foundWords.size} max={WORD_SEARCH_WORDS.length} />

      {lastFeedback && <FeedbackBox message={lastFeedback.text} type={lastFeedback.type} />}

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
        {WORD_SEARCH_WORDS.map((w, i) => (
          <span key={w} style={{
            padding: '5px 11px', borderRadius: '999px', fontSize: '10.5px', fontWeight: 700,
            fontFamily: "'Space Grotesk', 'Inter', sans-serif", letterSpacing: '1px',
            background: foundWords.has(w) ? wordColors[i % wordColors.length] + '18' : C.bgSoft,
            color: foundWords.has(w) ? wordColors[i % wordColors.length] : C.textMute,
            border: `1px solid ${foundWords.has(w) ? wordColors[i % wordColors.length] + '50' : C.line}`,
            transition: 'all 0.3s ease',
            textDecoration: foundWords.has(w) ? 'line-through' : 'none'
          }}>{w}</span>
        ))}
      </div>

      <div
        onMouseLeave={handleCellEnd}
        onMouseUp={handleCellEnd}
        style={{ display: 'grid', gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`, gap: '3px', userSelect: 'none', cursor: 'crosshair', background: C.bgSoft, padding: '10px', borderRadius: '14px', border: `1px solid ${C.line}` }}
      >
        {gameData.grid.map((row, r) =>
          row.map((letter, c) => {
            const isHighlighted = highlightedCells.has(cellKey(r, c));
            const isSelected = selectedCells.some(([sr, sc]) => sr === r && sc === c);
            const hlColor = highlightedCells.get(cellKey(r, c));
            return (
              <div
                key={`${r}-${c}`}
                onMouseDown={() => handleCellStart(r, c)}
                onMouseEnter={() => handleCellEnter(r, c)}
                style={{
                  width: '100%', aspectRatio: '1',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  borderRadius: '6px', fontSize: '12px', fontWeight: 700,
                  fontFamily: "'Space Grotesk', 'Inter', sans-serif",
                  background: isHighlighted ? (hlColor as string) + '20' : isSelected ? C.celeste : C.white,
                  color: isHighlighted ? hlColor : isSelected ? C.blue : C.blueDark,
                  border: `1px solid ${isHighlighted ? (hlColor as string) + '60' : isSelected ? C.blue : C.line}`,
                  transition: 'all 0.15s ease',
                  transform: isSelected ? 'scale(1.08)' : 'scale(1)',
                  cursor: 'crosshair',
                  boxShadow: isSelected ? '0 4px 12px rgba(11,92,255,0.25)' : 'none',
                }}
              >
                {letter}
              </div>
            );
          })
        )}
      </div>
      <p style={{ fontSize: '11px', color: C.textMute, textAlign: 'center', marginTop: '14px', fontWeight: 600, letterSpacing: '0.5px' }}>
        ✦ Arrastrá el mouse para seleccionar palabras
      </p>

      <div style={{ marginTop: '18px', background: C.bgSoft, border: `1px solid ${C.line}`, borderRadius: '14px', padding: '14px 16px' }}>
        <div style={{ fontSize: '10.5px', fontWeight: 700, textTransform: 'uppercase', color: C.blue, letterSpacing: '1.4px', marginBottom: '10px', fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}>
          Conceptos aprendidos
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {WORD_SEARCH_WORDS.map(w => {
            const found = foundWords.has(w);
            return (
              <div key={w} style={{
                opacity: found ? 1 : 0.45,
                padding: '8px 10px',
                borderRadius: '10px',
                background: found ? C.white : 'transparent',
                border: `1px solid ${found ? C.line : 'transparent'}`,
                transition: 'all 0.3s ease',
              }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: C.blueDark, fontFamily: "'Space Grotesk', 'Inter', sans-serif", letterSpacing: '0.5px', marginBottom: 3 }}>
                  {found ? w : '•••••'}
                </div>
                <div style={{ fontSize: '12px', color: C.textMute, lineHeight: 1.45, fontWeight: 500 }}>
                  {found ? WORD_DESCRIPTIONS[w] : 'Encontrá la palabra para revelar su significado.'}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════
   MODULO: CLASIFICAR
════════════════════════════════ */

type ClassifyChoice = 'safe' | 'caution' | 'danger';
const classifyCards: { id: number; text: string; correct: ClassifyChoice; explanation: string }[] = [
  { id: 1, text: 'Un jugador me pregunta en qué horario suelo conectarme.', correct: 'caution', explanation: 'Tus horarios son un dato privado: saber cuándo te conectás permite a alguien controlarte. Lo seguro es no compartirlos y, si insiste, contarlo a un adulto.' },
  { id: 2, text: 'Juego online con compañeros de mi escuela.', correct: 'safe', explanation: 'Jugar con personas que conocés en la vida real es una zona segura. Igual, cuidá siempre tus datos.' },
  { id: 3, text: 'Alguien me felicita todos los días y dice que soy su persona favorita del juego.', correct: 'caution', explanation: 'Los halagos exagerados son una técnica común de grooming: buscan ganarse tu confianza muy rápido. No es para asustarse, pero sí para estar atento.' },
  { id: 4, text: 'Una persona desconocida me pide que no le cuente a nadie que hablamos.', correct: 'danger', explanation: 'Pedirte que ocultes una conversación a tus padres o adultos es una señal de alerta clara. Contalo siempre a un adulto de confianza.' },
  { id: 5, text: 'Le cuento a mi mamá que un chat me hizo sentir raro.', correct: 'safe', explanation: 'Hablar lo que te incomoda con un adulto de confianza es una de las mejores formas de cuidarte.' },
  { id: 6, text: 'Un amigo de la escuela me invita a un grupo donde hay usuarios mayores que no conozco.', correct: 'caution', explanation: 'Aunque te invite un amigo, los grupos con desconocidos mayores son riesgosos. Lo más seguro es salir y avisar.' },
  { id: 7, text: 'Bloqueo y reporto a alguien que me molesta o me da miedo.', correct: 'safe', explanation: 'Bloquear no es ser malo: es proteger tu espacio. Reportar ayuda también a otros chicos.' },
  { id: 8, text: 'Alguien me ofrece monedas o skins si le paso mi usuario de otra red social.', correct: 'danger', explanation: 'Los regalos a cambio de datos o de cambiar de plataforma son una forma de manipulación. Decí que no y avisá a un adulto.' },
  { id: 9, text: 'Un usuario se enoja cuando no le respondo rápido.', correct: 'caution', explanation: 'Vos no le debés respuestas inmediatas a nadie online. Si alguien se enoja porque no respondés, esa presión ya es una señal para alejarte.' },
  { id: 10, text: 'Alguien me pide una foto “normal” para saber con quién juega.', correct: 'danger', explanation: 'Cualquier foto puede guardarse y usarse después para presionarte. No es necesario mostrarte para jugar con alguien online.' },
];

function ClassifyModule({ onComplete, onXp }: any) {
  const [remaining, setRemaining] = useState(classifyCards);
  const [current, setCurrent] = useState(0);
  const [feedback, setFeedback] = useState<any>(null);
  const [score, setScore] = useState(0);
  const [showXp, setShowXp] = useState(0);
  const [phase, setPhase] = useState<'playing' | 'result'>('playing');
  const [animClass, setAnimClass] = useState('');

  const card = remaining[current];

  const handleClassify = (choice: ClassifyChoice) => {
    if (feedback) return;
    const correct = choice === card.correct;
    // Casi-acierto: confundir "cuidado" con "riesgoso" o viceversa suma algo (señal detectada, intensidad equivocada)
    const nearMiss = !correct && ((choice === 'caution' && card.correct === 'danger') || (choice === 'danger' && card.correct === 'caution'));
    const pts = correct ? 35 : nearMiss ? 12 : 0;
    const labelMap: Record<ClassifyChoice, string> = { safe: 'Seguro', caution: 'Cuidado', danger: 'Riesgoso' };
    setFeedback({
      text: correct
        ? `Muy bien: era ${labelMap[card.correct]}. ${card.explanation}`
        : nearMiss
        ? `Casi: detectaste una señal, pero la intensidad era ${labelMap[card.correct]}. ${card.explanation}`
        : `Ojo: en realidad era ${labelMap[card.correct]}. ${card.explanation}`,
      type: correct ? 'success' : nearMiss ? 'info' : 'danger',
      pts
    });
    if (pts > 0) { setScore(p => p + pts); setShowXp(pts); onXp(pts); }
    setAnimClass(correct ? 'card-correct' : nearMiss ? '' : 'card-wrong');

    setTimeout(() => {
      setFeedback(null);
      setAnimClass('');
      if (current + 1 >= remaining.length) setPhase('result');
      else setCurrent(p => p + 1);
    }, 2500);
  };

  if (phase === 'result') return (
    <div style={{ textAlign: 'center' }}>
      <h3 style={{ fontFamily: "'Space Grotesk', 'Inter', sans-serif", fontSize: '20px', color: C.blueDark, marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '-0.5px' }}>¡Clasificación completa!</h3>
      <div style={{ fontSize: '40px', fontWeight: 700, color: C.blue, marginBottom: '8px', fontFamily: "'Space Grotesk', 'Inter', sans-serif", letterSpacing: '-1px' }}>{score} pts</div>
      <p style={{ color: C.textMute, marginBottom: '24px', fontSize: '13px' }}>Clasificaste {remaining.length} situaciones</p>
      <button onClick={() => onComplete(score)} className="btn-primary" style={{ padding: '14px 28px', borderRadius: '999px', fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', cursor: 'pointer' }}>Reclamar XP</button>
    </div>
  );

  return (
    <div>
      {showXp > 0 && <XpPop amount={showXp} onDone={() => setShowXp(0)} />}
      <MissionBar label="Tarjetas Clasificadas" current={current} max={remaining.length} />

      <div className={animClass} style={{
        background: C.white, borderRadius: '18px', padding: '32px 24px',
        textAlign: 'center', marginBottom: '16px', border: `1px solid ${C.line}`,
        minHeight: '130px', display: 'flex', alignItems: 'center', justifyContent: 'center',
        animation: 'slideUpIn 0.4s ease', transition: 'all 0.3s ease', boxShadow: '0 6px 18px rgba(6,21,56,0.05)', position: 'relative'
      }}>
        <Sparkle top={10} left={12} size={12} color={C.sun} opacity={0.5} delay={0.5} />
        <Sparkle top={14} right={14} size={10} color={C.blue} opacity={0.5} delay={1.1} />
        <p style={{ fontSize: '17px', color: C.blueDark, lineHeight: 1.5, margin: 0, fontWeight: 600 }}>
          {card?.text}
        </p>
      </div>

      {feedback && <FeedbackBox message={feedback.text} type={feedback.type} />}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginTop: '12px' }}>
        <button
          onClick={() => handleClassify('safe')}
          disabled={!!feedback}
          className="btn-classify"
          style={{
            padding: '16px 10px', borderRadius: '14px', fontSize: '11.5px', fontWeight: 700,
            background: 'rgba(22,163,74,0.08)', border: '1.5px solid rgba(22,163,74,0.35)',
            color: '#15803D', opacity: !!feedback ? 0.5 : 1, cursor: !!feedback ? 'default' : 'pointer',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
            fontFamily: "'Space Grotesk', 'Inter', sans-serif", letterSpacing: '1px',
            textTransform: 'uppercase', transition: 'all .25s ease'
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#15803D" strokeWidth="2.4"><polyline points="20,6 9,17 4,12" /></svg>
          Seguro
        </button>
        <button
          onClick={() => handleClassify('caution')}
          disabled={!!feedback}
          className="btn-classify"
          style={{
            padding: '16px 10px', borderRadius: '14px', fontSize: '11.5px', fontWeight: 700,
            background: 'rgba(245,196,81,0.18)', border: '1.5px solid rgba(245,196,81,0.45)',
            color: '#A6770D', opacity: !!feedback ? 0.5 : 1, cursor: !!feedback ? 'default' : 'pointer',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
            fontFamily: "'Space Grotesk', 'Inter', sans-serif", letterSpacing: '1px',
            textTransform: 'uppercase', transition: 'all .25s ease'
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#A6770D" strokeWidth="2.4"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><circle cx="12" cy="16" r="0.6" fill="#A6770D" /></svg>
          Cuidado
        </button>
        <button
          onClick={() => handleClassify('danger')}
          disabled={!!feedback}
          className="btn-classify"
          style={{
            padding: '16px 10px', borderRadius: '14px', fontSize: '11.5px', fontWeight: 700,
            background: 'rgba(234,88,12,0.08)', border: '1.5px solid rgba(234,88,12,0.35)',
            color: '#C2410C', opacity: !!feedback ? 0.5 : 1, cursor: !!feedback ? 'default' : 'pointer',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
            fontFamily: "'Space Grotesk', 'Inter', sans-serif", letterSpacing: '1px',
            textTransform: 'uppercase', transition: 'all .25s ease'
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C2410C" strokeWidth="2.4"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
          Riesgoso
        </button>
      </div>
      <p style={{ fontSize: '11px', color: C.textMute, textAlign: 'center', marginTop: '14px', fontWeight: 600, letterSpacing: '0.5px' }}>
        Tarjeta {current + 1} de {remaining.length}
      </p>
    </div>
  );
}

/* ════════════════════════════════
   MODULO: LABERINTO
════════════════════════════════ */

type MazeNode = {
  id: string;
  text: string;
  choices?: { text: string; next: string; isSafe: boolean; feedback: string }[];
  isEnd?: boolean;
  isGoodEnd?: boolean;
};

const mazeNodes: Record<string, MazeNode> = {
  start: {
    id: 'start',
    text: 'Estás jugando online y alguien que no conocés te escribe: "¡Jugás re bien! ¿Querés que armemos equipo?".',
    choices: [
      { text: 'Le contesto del juego, sin dar datos personales.', next: 'kept_in_game', isSafe: true, feedback: 'Buena decisión: jugar con alguien no te obliga a compartir información personal.' },
      { text: 'Le digo mi nombre real, parece buena onda.', next: 'gave_name', isSafe: false, feedback: 'Cuidado: tu nombre es un dato. No hace falta darlo para jugar. Todavía estás a tiempo de no compartir más.' },
    ]
  },
  kept_in_game: {
    id: 'kept_in_game',
    text: 'Después de varias partidas te dice: "Por acá el chat es lento, ¿tenés Discord o WhatsApp?".',
    choices: [
      { text: 'Le digo que prefiero seguir hablando solo por el chat del juego.', next: 'set_limit', isSafe: true, feedback: 'Muy bien: marcar el límite cuando alguien quiere cambiar de app es una señal de que estás atento.' },
      { text: 'Le paso mi usuario de otra app porque parece simpático.', next: 'switched_app', isSafe: false, feedback: 'Cambiar de plataforma aumenta el riesgo: los chats privados no tienen moderadores que protejan a chicos.' },
    ]
  },
  gave_name: {
    id: 'gave_name',
    text: 'Te pregunta: "¿En qué horario te conectás? Yo tengo tu edad, podemos jugar todos los días".',
    choices: [
      { text: 'Le paso mi horario y mi teléfono para coordinar.', next: 'gave_phone', isSafe: false, feedback: 'Atención: con tu nombre, horarios y teléfono ya tiene mucha información sobre vos. Pero todavía podés frenar.' },
      { text: 'Me freno: no quiero seguir compartiendo cosas. Le digo que prefiero solo jugar.', next: 'recovered', isSafe: true, feedback: '¡Muy bien! Equivocarse al principio no significa que sea tarde. Frenar a tiempo es una decisión inteligente.' },
    ]
  },
  switched_app: {
    id: 'switched_app',
    text: 'Ya en el chat privado te pide: "No le digas a nadie que hablamos por acá, es solo nuestro".',
    choices: [
      { text: 'Acepto, total es solo un chat.', next: 'gave_photo', isSafe: false, feedback: 'Pedir secreto es una señal de alerta importante. Si no podés contarlo a un adulto, no es seguro.' },
      { text: 'Bloqueo y le cuento a un adulto lo que pasó.', next: 'good_end', isSafe: true, feedback: '¡Excelente! Pedir secreto a tus padres siempre es una señal para frenar y avisar.' },
    ]
  },
  set_limit: {
    id: 'set_limit',
    text: 'Insiste con otro usuario nuevo y vuelve a hablarte como si nada.',
    choices: [
      { text: 'Lo bloqueo, lo reporto y se lo cuento a un adulto.', next: 'reported', isSafe: true, feedback: 'Decisión 10: bloquear corta el contacto, reportar protege a otros y avisar te asegura apoyo.' },
      { text: 'Le respondo enojado para que pare.', next: 'engaged', isSafe: false, feedback: 'Responder, aunque sea enojado, mantiene el contacto. Mejor bloquear sin discutir.' },
      { text: 'Lo bloqueo, pero no le digo a nadie.', next: 'blocked_silent', isSafe: false, feedback: 'Bloquear estuvo muy bien. Te falta sumar avisar a un adulto: no tenés que cargar con esto solo.' },
    ]
  },
  gave_phone: {
    id: 'gave_phone',
    text: 'Ahora te propone que se encuentren en persona "para jugar juntos en mi casa". Te pide que no le cuentes a tus padres.',
    choices: [
      { text: 'Acepto, total dice que tiene mi edad.', next: 'bad_end', isSafe: false, feedback: 'Nunca te encuentres en persona con alguien que conociste online sin tus padres. Es la línea más importante para cuidarte.' },
      { text: 'Me asusto, no voy, y le cuento todo a mi mamá o papá.', next: 'told_parents', isSafe: true, feedback: 'Aunque sentís miedo, hablar con tus padres es exactamente lo que corresponde. Ningún chat vale más que tu seguridad.' },
    ]
  },
  recovered: {
    id: 'recovered',
    text: 'La persona se enoja y empieza a presionarte: "Después de todo lo que te conté, ¿ahora me dejás de hablar?".',
    choices: [
      { text: 'Le cuento a un adulto lo que ya compartí y bloqueo la cuenta.', next: 'good_end', isSafe: true, feedback: 'Muy bien: si ya compartiste algo, contarlo a un adulto te ayuda a no estar solo con lo que pase después.' },
      { text: 'Le pido disculpas y le doy un dato más para que se le pase.', next: 'gave_photo', isSafe: false, feedback: 'No le debés disculpas a nadie por cuidarte. Esa presión emocional es una técnica de manipulación.' },
    ]
  },
  gave_photo: {
    id: 'gave_photo',
    text: 'Te amenaza: "Si no me seguís hablando o me mandás más fotos, le muestro esto a tu escuela".',
    choices: [
      { text: 'Cedo a la presión y mando lo que pide.', next: 'bad_end', isSafe: false, feedback: 'Cuando se cede a un chantaje, suelen pedir más. La salida no es darle lo que quiere, sino contarlo a un adulto.' },
      { text: 'Aviso inmediatamente a un adulto de confianza.', next: 'good_end', isSafe: true, feedback: 'Excelente: ningún error que hayas cometido es más grande que tu seguridad. Contarlo es lo que corta la situación.' },
    ]
  },
  blocked: { id: 'blocked', text: 'Bloqueaste, reportaste y le contaste a tu familia. Un moderador agradeció tu reporte. Estuviste atento a las señales y actuaste a tiempo.', isEnd: true, isGoodEnd: true },
  blocked_silent: { id: 'blocked_silent', text: 'Bloquear estuvo muy bien y cortó el contacto. Igual recordá: contarle a un adulto suma una capa más de protección, sobre todo si la persona vuelve a aparecer con otro usuario.', isEnd: true, isGoodEnd: true },
  told_parents: { id: 'told_parents', text: 'Tu familia reportó el caso. Detrás del perfil había un adulto haciéndose pasar por chico. Gracias a tu decisión de avisar, esa cuenta no podrá engañar a otros.', isEnd: true, isGoodEnd: true },
  reported: { id: 'reported', text: 'Tu reporte hizo que la plataforma bloqueara la cuenta. Le contaste a tu familia y quedó todo registrado. Cuidarte también es cuidar a otros chicos.', isEnd: true, isGoodEnd: true },
  engaged: {
    id: 'engaged',
    text: 'Al responder, la persona insiste cada vez más y empieza a presionarte. Todavía estás a tiempo de buscar ayuda.',
    choices: [
      { text: 'Aviso ahora a un adulto y bloqueo todo.', next: 'good_end', isSafe: true, feedback: 'Aunque hayas respondido antes, contarlo a un adulto siempre corta la situación. Nunca es tarde para pedir ayuda.' },
    ]
  },
  bad_end: { id: 'bad_end', text: 'Las decisiones tomadas escalaron el riesgo. Si esto te llegara a pasar de verdad: contarlo a un adulto de confianza siempre ayuda, incluso si ya pasó algo. Nunca es tarde para pedir ayuda.', isEnd: true, isGoodEnd: false },
  good_end: { id: 'good_end', text: 'Hablaste con un adulto de confianza. Juntos reportaron el caso y conseguiste apoyo. Pedir ayuda no es ser exagerado: es la forma más valiente de cuidarte.', isEnd: true, isGoodEnd: true },
};

function MazeModule({ onComplete, onXp }: any) {
  const [currentNode, setCurrentNode] = useState<string>('start');
  const [history, setHistory] = useState<string[]>(['start']);
  const [score, setScore] = useState(0);
  const [showXp, setShowXp] = useState(0);
  const [lastFeedback, setLastFeedback] = useState<{ text: string; type: 'success' | 'danger' } | null>(null);

  const node = mazeNodes[currentNode];

  const handleChoice = (choice: { text: string; next: string; isSafe: boolean; feedback: string }) => {
    const pts = choice.isSafe ? 40 : 0;
    setLastFeedback({ text: choice.feedback, type: choice.isSafe ? 'success' : 'danger' });
    if (pts > 0) { setScore(p => p + pts); setShowXp(pts); onXp(pts); }
    setTimeout(() => {
      setLastFeedback(null);
      setCurrentNode(choice.next);
      setHistory(prev => [...prev, choice.next]);
    }, 2200);
  };

  const depth = history.length - 1;

  if (node.isEnd) return (
    <div style={{ textAlign: 'center' }}>
      <div className="badge-pulse" style={{
        width: '78px', height: '78px', borderRadius: '50%', margin: '0 auto 18px',
        background: node.isGoodEnd ? 'rgba(22,163,74,0.10)' : 'rgba(234,88,12,0.10)',
        border: `1.5px solid ${node.isGoodEnd ? 'rgba(22,163,74,0.4)' : 'rgba(234,88,12,0.4)'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        {node.isGoodEnd
          ? <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#15803D" strokeWidth="2.2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="M9 12l2 2 4-4" /></svg>
          : <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#C2410C" strokeWidth="2.2"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>
        }
      </div>
      <h3 style={{ fontFamily: "'Space Grotesk', 'Inter', sans-serif", fontSize: '17px', color: node.isGoodEnd ? '#15803D' : '#C2410C', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '-0.3px' }}>
        {node.isGoodEnd ? '¡Buen final!' : 'Fin alternativo'}
      </h3>
      <p style={{ fontSize: '14px', color: C.blueDark, lineHeight: 1.6, marginBottom: '22px', fontWeight: 500 }}>{node.text}</p>
      <div style={{ fontSize: '30px', fontWeight: 700, color: C.blue, marginBottom: '18px', fontFamily: "'Space Grotesk', 'Inter', sans-serif", letterSpacing: '-1px' }}>{score} pts</div>
      <button onClick={() => onComplete(score)} className="btn-primary" style={{ padding: '14px 28px', borderRadius: '999px', fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', cursor: 'pointer' }}>Reclamar XP</button>
    </div>
  );

  return (
    <div>
      {showXp > 0 && <XpPop amount={showXp} onDone={() => setShowXp(0)} />}
      <MissionBar label="Progreso del Laberinto" current={depth} max={5} />

      <div style={{ display: 'flex', gap: '6px', marginBottom: '16px', justifyContent: 'center', alignItems: 'center' }}>
        {history.map((h, i) => (
          <React.Fragment key={i}>
            <div style={{
              width: '12px', height: '12px', borderRadius: '50%',
              background: i === history.length - 1 ? C.blue : C.celeste,
              border: `1.5px solid ${i === history.length - 1 ? C.blue : C.line}`,
              transition: 'all 0.3s ease',
              boxShadow: i === history.length - 1 ? '0 0 0 4px rgba(11,92,255,0.15)' : 'none'
            }} />
            {i < history.length - 1 && <span style={{ width: 14, height: 1.5, background: C.line, borderRadius: 2 }} />}
          </React.Fragment>
        ))}
      </div>

      <div style={{ background: C.white, borderRadius: '16px', padding: '24px', marginBottom: '16px', border: `1px solid ${C.line}`, animation: 'slideUpIn 0.4s ease', boxShadow: '0 6px 18px rgba(6,21,56,0.05)' }}>
        <p style={{ fontSize: '15px', color: C.blueDark, lineHeight: 1.65, margin: 0, fontWeight: 500 }}>{node.text}</p>
      </div>

      {lastFeedback && <FeedbackBox message={lastFeedback.text} type={lastFeedback.type} />}

      {!lastFeedback && node.choices && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {node.choices.map((c, i) => (
            <button
              key={i}
              onClick={() => handleChoice(c)}
              className="btn-option"
              style={{ padding: '14px 18px', borderRadius: '12px', textAlign: 'left', background: C.white, border: `1px solid ${C.line}`, color: C.blueDark, fontSize: '14px', lineHeight: 1.4, fontWeight: 500, cursor: 'pointer', transition: 'all .25s ease' }}
            >
              {c.text}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ════════════════════════════════
   MODULO: CRUCIGRAMA
════════════════════════════════ */

type CrosswordClue = {
  id: number;
  direction: 'across' | 'down';
  clue: string;
  hint: string;
  feedback: string;
  answer: string;
  row: number;
  col: number;
};

const crosswordClues: CrosswordClue[] = [
  {
    id: 1, direction: 'across', row: 0, col: 0, answer: 'GROOMER',
    clue: 'Persona adulta que se hace pasar por amigo en internet para manipular a chicos.',
    hint: 'Se gana la confianza poco a poco. Termina en “er” como “gamer”.',
    feedback: 'Muy bien: un groomer no siempre parece peligroso al principio. Suele empezar con halagos y construir confianza antes de pedir algo riesgoso.',
  },
  {
    id: 2, direction: 'down', row: 0, col: 4, answer: 'BLOQUEAR',
    clue: 'Acción que corta el contacto con alguien que te incomoda en internet.',
    hint: 'Está en casi todas las apps y sirve para que esa persona no pueda seguir escribiéndote.',
    feedback: 'Exacto: bloquear no es ser malo, es proteger tu espacio. Y si te incomodó, conviene también contarlo a un adulto.',
  },
  {
    id: 3, direction: 'across', row: 3, col: 1, answer: 'AVISAR',
    clue: 'Lo que conviene hacer cuando algo online te incomoda o te da miedo.',
    hint: 'No tenés que resolverlo solo. Podés contárselo a un adulto de confianza.',
    feedback: 'Perfecto: pedir ayuda a tiempo puede cortar una situación riesgosa antes de que crezca.',
  },
  {
    id: 4, direction: 'down', row: 2, col: 0, answer: 'PADRE',
    clue: 'Adulto de confianza con quien podés hablar si algo online te preocupa (también puede ser mamá, abuela o tutor).',
    hint: 'Si pensás en tu familia más cercana, suele ser una de las primeras personas a quien acudir.',
    feedback: 'Muy bien: hablar con un adulto de confianza no es exagerar. Te ayuda a no estar solo con lo que pasa.',
  },
  {
    id: 5, direction: 'across', row: 6, col: 2, answer: 'DATOS',
    clue: 'Información personal que no conviene compartir con desconocidos online.',
    hint: 'Puede incluir tu nombre completo, dirección, escuela, teléfono o ubicación.',
    feedback: 'Correcto: tus datos personales son parte de tu seguridad. Mantenerlos privados es una de las mejores formas de cuidarte.',
  },
];

function buildCrosswordGrid(clues: CrosswordClue[]) {
  const rows = 9, cols = 10;
  const grid: { letter: string; clueIds: number[]; row: number; col: number }[][] =
    Array(rows).fill(null).map((_, r) => Array(cols).fill(null).map((_, c) => ({ letter: '', clueIds: [], row: r, col: c })));

  for (const clue of clues) {
    for (let i = 0; i < clue.answer.length; i++) {
      const r = clue.direction === 'across' ? clue.row : clue.row + i;
      const c = clue.direction === 'across' ? clue.col + i : clue.col;
      if (r < rows && c < cols) {
        grid[r][c].letter = clue.answer[i];
        if (!grid[r][c].clueIds.includes(clue.id)) grid[r][c].clueIds.push(clue.id);
      }
    }
  }
  return grid;
}

function CrosswordModule({ onComplete, onXp }: any) {
  const grid = useMemo(() => buildCrosswordGrid(crosswordClues), []);
  const [userInputs, setUserInputs] = useState<Record<string, string>>({});
  const [completed, setCompleted] = useState<Set<number>>(new Set());
  const [errors, setErrors] = useState<Set<string>>(new Set());
  const [activeClue, setActiveClue] = useState<number | null>(1);
  const [showXp, setShowXp] = useState(0);
  const [phase, setPhase] = useState<'playing' | 'result'>('playing');
  const [lastFeedback, setLastFeedback] = useState<{ text: string; type: 'success' | 'danger' | 'info' } | null>(null);
  const [extraHints, setExtraHints] = useState<Set<number>>(new Set());
  const inputRefs = useRef<Record<string, HTMLInputElement>>({});

  const cellKey = (r: number, c: number) => `${r},${c}`;

  const handleInput = (r: number, c: number, value: string) => {
    const key = cellKey(r, c);
    const newInputs = { ...userInputs, [key]: value.toUpperCase().slice(-1) };
    setUserInputs(newInputs);

    const newCompleted = new Set(completed);
    let newXp = 0;

    for (const clue of crosswordClues) {
      if (newCompleted.has(clue.id)) continue;
      let allFilled = true;
      let allCorrect = true;
      for (let i = 0; i < clue.answer.length; i++) {
        const cr = clue.direction === 'across' ? clue.row : clue.row + i;
        const cc = clue.direction === 'across' ? clue.col + i : clue.col;
        const ck = cellKey(cr, cc);
        if (!newInputs[ck]) { allFilled = false; break; }
        if (newInputs[ck] !== clue.answer[i]) allCorrect = false;
      }
      if (allFilled && allCorrect && !newCompleted.has(clue.id)) {
        newCompleted.add(clue.id);
        newXp += 40;
        setLastFeedback({ text: `¡${clue.answer}! ${clue.feedback}`, type: 'success' });
      }
    }

    if (newXp > 0) { setShowXp(newXp); onXp(newXp); }
    setCompleted(newCompleted);

    if (newCompleted.size === crosswordClues.length) {
      setTimeout(() => setPhase('result'), 1500);
    }

    const activeC = crosswordClues.find(c => c.id === activeClue);
    if (activeC) {
      const next = activeC.direction === 'across' ? cellKey(r, c + 1) : cellKey(r + 1, c);
      if (inputRefs.current[next]) inputRefs.current[next].focus();
    }
  };

  if (phase === 'result') return (
    <div style={{ textAlign: 'center' }}>
      <h3 style={{ fontFamily: "'Space Grotesk', 'Inter', sans-serif", fontSize: '20px', color: C.blueDark, marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '-0.5px' }}>¡Crucigrama completado!</h3>
      <div style={{ fontSize: '40px', fontWeight: 700, color: C.blue, marginBottom: '16px', fontFamily: "'Space Grotesk', 'Inter', sans-serif", letterSpacing: '-1px' }}>{completed.size * 40} pts</div>
      <button onClick={() => onComplete(completed.size * 40)} className="btn-primary" style={{ padding: '14px 28px', borderRadius: '999px', fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', cursor: 'pointer' }}>Reclamar XP</button>
    </div>
  );

  const rows = 9, cols = 10;

  return (
    <div>
      {showXp > 0 && <XpPop amount={showXp} onDone={() => setShowXp(0)} />}
      <MissionBar label="Palabras Completadas" current={completed.size} max={crosswordClues.length} />

      {lastFeedback && <FeedbackBox message={lastFeedback.text} type={lastFeedback.type} />}

      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: '3px', marginBottom: '18px', background: C.bgSoft, padding: '10px', borderRadius: '14px', border: `1px solid ${C.line}` }}>
        {Array(rows).fill(null).map((_, r) =>
          Array(cols).fill(null).map((_, c) => {
            const cell = grid[r][c];
            const isActive = cell.letter !== '';
            const key = cellKey(r, c);
            const isCompleted = cell.clueIds.some(id => completed.has(id));
            const clueStart = crosswordClues.find(cl => cl.row === r && cl.col === c);

            if (!isActive) return (
              <div key={key} style={{ aspectRatio: '1', background: 'transparent', borderRadius: '4px' }} />
            );

            return (
              <div key={key} style={{ position: 'relative', aspectRatio: '1' }}>
                {clueStart && (
                  <span style={{ position: 'absolute', top: '2px', left: '3px', fontSize: '8px', color: C.blue, fontWeight: 700, zIndex: 2, lineHeight: 1, fontFamily: "'Space Grotesk', sans-serif" }}>{clueStart.id}</span>
                )}
                <input
                  ref={el => { if (el) inputRefs.current[key] = el; }}
                  maxLength={1}
                  value={userInputs[key] || ''}
                  onChange={e => handleInput(r, c, e.target.value)}
                  onFocus={() => {
                    const clue = crosswordClues.find(cl => cl.row === r && cl.col === c);
                    if (clue) setActiveClue(clue.id);
                  }}
                  style={{
                    width: '100%', height: '100%', textAlign: 'center',
                    background: isCompleted ? 'rgba(22,163,74,0.12)' : C.white,
                    border: `1px solid ${isCompleted ? 'rgba(22,163,74,0.5)' : C.line}`,
                    color: isCompleted ? '#15803D' : C.blueDark,
                    fontSize: '14px', fontWeight: 700, fontFamily: "'Space Grotesk', 'Inter', sans-serif",
                    outline: 'none', cursor: 'text', borderRadius: '6px',
                    textTransform: 'uppercase', padding: 0, boxSizing: 'border-box',
                    transition: 'all 0.2s ease'
                  }}
                />
              </div>
            );
          })
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        {(['across', 'down'] as const).map(dir => (
          <div key={dir}>
            <div style={{ fontSize: '10.5px', fontWeight: 700, textTransform: 'uppercase', color: C.blue, marginBottom: '10px', letterSpacing: '1.4px', fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}>{dir === 'across' ? 'Horizontal' : 'Vertical'}</div>
            {crosswordClues.filter(c => c.direction === dir).map(clue => {
              const isDone = completed.has(clue.id);
              const showExtra = extraHints.has(clue.id);
              return (
                <div key={clue.id} onClick={() => setActiveClue(clue.id)} style={{
                  padding: '8px 10px', borderRadius: '10px', marginBottom: '6px', cursor: 'pointer',
                  background: activeClue === clue.id ? C.celeste : 'transparent',
                  border: `1px solid ${activeClue === clue.id ? C.line : 'transparent'}`,
                  transition: 'all 0.2s ease'
                }}>
                  <div>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: isDone ? '#15803D' : C.blue, marginRight: '6px', fontFamily: "'Space Grotesk', sans-serif" }}>{clue.id}.</span>
                    <span style={{ fontSize: '12px', color: isDone ? '#15803D' : C.blueDark, fontWeight: 500, lineHeight: 1.45 }}>{clue.clue}</span>
                  </div>
                  {!isDone && (
                    <div style={{ marginTop: 6 }}>
                      {!showExtra ? (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setExtraHints(prev => {
                              const next = new Set(prev);
                              next.add(clue.id);
                              return next;
                            });
                          }}
                          style={{
                            background: 'transparent', border: `1px dashed ${C.blue}`, color: C.blue,
                            fontSize: '10.5px', fontWeight: 700, padding: '3px 9px', borderRadius: '999px',
                            cursor: 'pointer', fontFamily: "'Space Grotesk', 'Inter', sans-serif",
                            letterSpacing: '0.6px', textTransform: 'uppercase'
                          }}
                        >
                          Ver pista extra
                        </button>
                      ) : (
                        <div style={{ fontSize: '11.5px', color: C.textMute, fontStyle: 'italic', lineHeight: 1.45, fontWeight: 500, paddingLeft: 2 }}>
                          💡 {clue.hint}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ════════════════════════════════
   MODULO: PAREJAS
════════════════════════════════ */

const matchingPairs = [
  { id: 1, concept: 'GROOMING', definition: 'Manipulacion de adultos a ninos online' },
  { id: 2, concept: 'SECRETO', definition: 'Senal de alerta con desconocidos' },
  { id: 3, concept: 'BLOQUEAR', definition: 'Accion segura ante acoso' },
  { id: 4, concept: 'DENUNCIAR', definition: 'Reportar a la plataforma o policia' },
  { id: 5, concept: 'CONFIANZA', definition: 'Lo que solo se da a personas conocidas' },
  { id: 6, concept: 'PRIVACIDAD', definition: 'Tus datos personales son tuyos' },
];

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function MatchingModule({ onComplete, onXp }: any) {
  const concepts = useMemo(() => shuffle(matchingPairs.map(p => ({ ...p, side: 'concept' as const }))), []);
  const definitions = useMemo(() => shuffle(matchingPairs.map(p => ({ ...p, side: 'definition' as const }))), []);
  const [selectedConcept, setSelectedConcept] = useState<number | null>(null);
  const [selectedDefinition, setSelectedDefinition] = useState<number | null>(null);
  const [matched, setMatched] = useState<Set<number>>(new Set());
  const [wrong, setWrong] = useState<Set<string>>(new Set());
  const [score, setScore] = useState(0);
  const [showXp, setShowXp] = useState(0);
  const [phase, setPhase] = useState<'playing' | 'result'>('playing');

  useEffect(() => {
    if (selectedConcept !== null && selectedDefinition !== null) {
      if (selectedConcept === selectedDefinition) {
        const newMatched = new Set(matched);
        newMatched.add(selectedConcept);
        setMatched(newMatched);
        const pts = 25;
        setScore(p => p + pts);
        setShowXp(pts);
        onXp(pts);
        setSelectedConcept(null);
        setSelectedDefinition(null);
        if (newMatched.size === matchingPairs.length) {
          setTimeout(() => setPhase('result'), 800);
        }
      } else {
        const wrongKey = `${selectedConcept}-${selectedDefinition}`;
        setWrong(new Set([wrongKey]));
        setTimeout(() => {
          setWrong(new Set());
          setSelectedConcept(null);
          setSelectedDefinition(null);
        }, 700);
      }
    }
  }, [selectedConcept, selectedDefinition]);

  if (phase === 'result') return (
    <div style={{ textAlign: 'center' }}>
      <h3 style={{ fontFamily: "'Space Grotesk', 'Inter', sans-serif", fontSize: '20px', color: C.blueDark, marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '-0.5px' }}>¡Parejas completas!</h3>
      <div style={{ fontSize: '40px', fontWeight: 700, color: C.blue, marginBottom: '8px', fontFamily: "'Space Grotesk', 'Inter', sans-serif", letterSpacing: '-1px' }}>{score} pts</div>
      <p style={{ color: C.textMute, marginBottom: '24px', fontSize: '13px' }}>Conectaste {matched.size} conceptos clave</p>
      <button onClick={() => onComplete(score)} className="btn-primary" style={{ padding: '14px 28px', borderRadius: '999px', fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', cursor: 'pointer' }}>Reclamar XP</button>
    </div>
  );

  const isWrong = (id: number, side: 'concept' | 'definition') => {
    if (wrong.size === 0) return false;
    const [wc, wd] = [...wrong][0].split('-').map(Number);
    return (side === 'concept' && id === wc) || (side === 'definition' && id === wd);
  };

  return (
    <div>
      {showXp > 0 && <XpPop amount={showXp} onDone={() => setShowXp(0)} />}
      <MissionBar label="Parejas Encontradas" current={matched.size} max={matchingPairs.length} />
      <p style={{ fontSize: '12px', color: C.textMute, textAlign: 'center', marginBottom: '14px', fontWeight: 500 }}>
        Seleccioná un concepto y luego su definición
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ fontSize: '10.5px', fontWeight: 700, textTransform: 'uppercase', color: C.blue, textAlign: 'center', marginBottom: '4px', letterSpacing: '1.4px', fontFamily: "'Space Grotesk', sans-serif" }}>Conceptos</div>
          {concepts.map(p => {
            const isMatched = matched.has(p.id);
            const isSelected = selectedConcept === p.id;
            const isWrongAnim = isWrong(p.id, 'concept');
            return (
              <button
                key={p.id}
                onClick={() => !isMatched && setSelectedConcept(p.id)}
                disabled={isMatched}
                style={{
                  padding: '13px 10px', borderRadius: '12px', fontSize: '11.5px', fontWeight: 700,
                  fontFamily: "'Space Grotesk', 'Inter', sans-serif", letterSpacing: '0.5px',
                  background: isMatched ? 'rgba(22,163,74,0.10)' : isSelected ? C.celeste : isWrongAnim ? 'rgba(234,88,12,0.10)' : C.white,
                  border: `1.5px solid ${isMatched ? 'rgba(22,163,74,0.5)' : isSelected ? C.blue : isWrongAnim ? 'rgba(234,88,12,0.5)' : C.line}`,
                  color: isMatched ? '#15803D' : isSelected ? C.blue : isWrongAnim ? '#C2410C' : C.blueDark,
                  cursor: isMatched ? 'default' : 'pointer',
                  transition: 'all 0.25s ease',
                  transform: isSelected ? 'scale(1.03)' : 'scale(1)',
                  textAlign: 'center',
                  animation: isWrongAnim ? 'shake 0.4s ease' : undefined,
                }}
              >{p.concept}</button>
            );
          })}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ fontSize: '10.5px', fontWeight: 700, textTransform: 'uppercase', color: C.blue, textAlign: 'center', marginBottom: '4px', letterSpacing: '1.4px', fontFamily: "'Space Grotesk', sans-serif" }}>Definiciones</div>
          {definitions.map(p => {
            const isMatched = matched.has(p.id);
            const isSelected = selectedDefinition === p.id;
            const isWrongAnim = isWrong(p.id, 'definition');
            return (
              <button
                key={p.id}
                onClick={() => !isMatched && setSelectedDefinition(p.id)}
                disabled={isMatched}
                style={{
                  padding: '13px 10px', borderRadius: '12px', fontSize: '11.5px', fontWeight: 500,
                  background: isMatched ? 'rgba(22,163,74,0.10)' : isSelected ? C.celeste : isWrongAnim ? 'rgba(234,88,12,0.10)' : C.white,
                  border: `1.5px solid ${isMatched ? 'rgba(22,163,74,0.5)' : isSelected ? C.blue : isWrongAnim ? 'rgba(234,88,12,0.5)' : C.line}`,
                  color: isMatched ? '#15803D' : isSelected ? C.blue : isWrongAnim ? '#C2410C' : C.blueDark,
                  cursor: isMatched ? 'default' : 'pointer',
                  transition: 'all 0.25s ease',
                  transform: isSelected ? 'scale(1.03)' : 'scale(1)',
                  textAlign: 'center', lineHeight: 1.4,
                  animation: isWrongAnim ? 'shake 0.4s ease' : undefined,
                  fontFamily: "'Inter', sans-serif"
                }}
              >{p.definition}</button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════
   MODULO: QUIZ FINAL
════════════════════════════════ */

type QuizQuestion = {
  q: string;
  options: { text: string; correct: boolean; feedback: string }[];
  topic: string;
};

const finalQuiz: QuizQuestion[] = [
  {
    topic: 'Cambio de plataforma',
    q: 'Una persona que conociste en un juego te insiste con seguir hablando por otra app privada. ¿Qué conviene hacer?',
    options: [
      { text: 'Aceptar, total parece buena onda.', correct: false, feedback: 'Cambiar a una app sin moderadores aumenta el riesgo. Lo más seguro es mantenerse en el chat del juego.' },
      { text: 'Seguir hablando solo por el chat del juego y, si insiste, contarlo a un adulto.', correct: true, feedback: '¡Muy bien! Si alguien insiste mucho con sacarte de la zona moderada, es una señal típica de alerta.' },
      { text: 'Aceptar solo si me promete que es buena persona.', correct: false, feedback: 'Las promesas online no garantizan nada. Cualquiera puede prometer cualquier cosa detrás de una pantalla.' },
    ],
  },
  {
    topic: 'Secretos',
    q: '¿Por qué puede ser una señal de alerta que alguien online te pida guardar un secreto con tus padres?',
    options: [
      { text: 'Porque le da vergüenza que se enteren.', correct: false, feedback: 'Eso es una excusa común. Una persona sana no necesita esconderse de tus adultos para hablarte.' },
      { text: 'Porque puede estar intentando aislarte de tus adultos de confianza para manipularte.', correct: true, feedback: 'Exacto: separar al chico de su familia es una de las técnicas más típicas del grooming.' },
      { text: 'Porque los secretos son divertidos.', correct: false, feedback: 'Los secretos entre amigos de tu edad pueden ser inocentes. Pero pedir secreto a un chico es muy distinto y es una alerta.' },
    ],
  },
  {
    topic: 'Pedir ayuda',
    q: 'Si una conversación online te hace sentir incómodo, ¿cuál es una buena decisión?',
    options: [
      { text: 'Aguantar para no parecer exagerado.', correct: false, feedback: 'Pedir ayuda no es exagerar. Esa sensación de incomodidad es una señal importante para escuchar.' },
      { text: 'Borrar el chat y no contárselo a nadie.', correct: false, feedback: 'Borrar no protege. Si necesitás ayuda, contar lo que pasó es lo que realmente corta la situación.' },
      { text: 'Contárselo a un adulto de confianza, aunque parezca poco.', correct: true, feedback: '¡Muy bien! Hablarlo casi siempre alivia y te ayuda a decidir mejor.' },
    ],
  },
  {
    topic: 'Privacidad',
    q: '¿Cuál de estos datos NO conviene compartir con desconocidos online?',
    options: [
      { text: 'Mi nombre completo, dirección, escuela y horarios.', correct: true, feedback: 'Exacto: todos esos datos juntos te exponen mucho. Mantenelos privados.' },
      { text: 'Mi personaje favorito del juego.', correct: false, feedback: 'Hablar del juego en sí está bien. El problema son los datos que te identifican en la vida real.' },
      { text: 'Cuál es mi color favorito.', correct: false, feedback: 'Eso no es información sensible. Lo que hay que cuidar son los datos que permiten ubicarte o identificarte.' },
    ],
  },
  {
    topic: 'Bloquear',
    q: '¿Qué significa "bloquear" a alguien en una app o juego?',
    options: [
      { text: 'Insultar a esa persona.', correct: false, feedback: 'No, bloquear no es atacar a nadie. Es simplemente cortar el contacto.' },
      { text: 'Impedir que esa persona te siga escribiendo desde ese usuario.', correct: true, feedback: '¡Muy bien! Bloquear no es ser malo, es proteger tu espacio.' },
      { text: 'Eliminar para siempre la cuenta de esa persona.', correct: false, feedback: 'Bloquear no borra la cuenta; solo evita que esa persona te contacte a vos.' },
    ],
  },
  {
    topic: 'Regalos / manipulación',
    q: '¿Por qué un regalo online (monedas, skins) puede usarse para manipular?',
    options: [
      { text: 'Porque hace que te sientas en deuda y bajes la guardia.', correct: true, feedback: 'Exacto: muchas veces los regalos vienen con condiciones, como "no le cuentes a nadie" o "mandame una foto".' },
      { text: 'Porque los regalos son siempre malos.', correct: false, feedback: 'No, no son siempre malos. El problema aparece cuando el regalo viene con una condición.' },
      { text: 'Porque te hacen jugar mejor.', correct: false, feedback: 'El tema no es el juego: el tema es la condición que muchas veces se pide a cambio.' },
    ],
  },
  {
    topic: 'Arrepentirse a tiempo',
    q: 'Si ya compartiste algo (un dato, una foto) y después te arrepentís, ¿qué podés hacer?',
    options: [
      { text: 'Nada, ya es tarde.', correct: false, feedback: 'Nunca es tarde para pedir ayuda. Un adulto puede ayudarte a frenar la situación y a saber qué pasos seguir.' },
      { text: 'Seguir respondiendo para que no se enoje.', correct: false, feedback: 'Eso solo le da más poder. Lo que corta la situación es buscar apoyo de un adulto.' },
      { text: 'Contarlo a un adulto de confianza y bloquear a la persona.', correct: true, feedback: '¡Muy bien! Equivocarte no te hace responsable de lo que esa persona hace. Hablar es lo que corta el ciclo.' },
    ],
  },
  {
    topic: 'Adultos de confianza',
    q: '¿Quién puede ayudarte si una conversación online te preocupa?',
    options: [
      { text: 'Solo personas que conocí por internet.', correct: false, feedback: 'No: justo cuando algo online te preocupa, la ayuda tiene que venir de un adulto que conocés en la vida real.' },
      { text: 'Un adulto de confianza: mamá, papá, abuela, una maestra, un tutor.', correct: true, feedback: '¡Exacto! Estas personas pueden ayudarte sin retarte. Pedir ayuda es valiente, no exagerado.' },
      { text: 'Nadie, porque me van a retar.', correct: false, feedback: 'Un adulto de confianza está para cuidarte, no para retarte. Y aunque se preocupe, eso también es parte del cuidado.' },
    ],
  },
  {
    topic: 'Detectar señales',
    q: 'Empezás a chatear con alguien que te halaga todo el tiempo, dice que sos su persona favorita y te pregunta cosas personales. ¿Qué pensás?',
    options: [
      { text: 'Que conseguí un buen amigo.', correct: false, feedback: 'Cuidado: los halagos exagerados y rápidos son una técnica clásica de grooming para ganarse la confianza.' },
      { text: 'Que es una señal para frenar, no compartir datos y hablarlo con un adulto.', correct: true, feedback: '¡Muy bien! No significa que esa persona sea peligrosa seguro, pero sí que conviene estar atento.' },
      { text: 'Que voy a contarle todo para que me conozca mejor.', correct: false, feedback: 'Compartir muchos datos personales muy rápido es justo lo que la otra persona busca. Mejor ir despacio.' },
    ],
  },
  {
    topic: 'Bloquear y reportar',
    q: 'Bloqueás a alguien que te incomodaba, pero aparece con un usuario nuevo y vuelve a escribirte. ¿Qué hacés?',
    options: [
      { text: 'Le respondo enojado para que pare.', correct: false, feedback: 'Responder mantiene el contacto. Mejor no entrar al juego: bloquear y reportar.' },
      { text: 'Lo bloqueo de nuevo, lo reporto y le cuento a un adulto.', correct: true, feedback: '¡Muy bien! Cuando alguien insiste con cuentas nuevas, contarlo a un adulto es clave para no estar solo con eso.' },
      { text: 'Acepto hablar, total ya lo conozco.', correct: false, feedback: 'Que insista desde otro usuario es una señal de alerta más grande, no una excusa para hablarle.' },
    ],
  },
];

function FinalQuizModule({ onComplete, onXp }: any) {
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongTopics, setWrongTopics] = useState<string[]>([]);
  const [showXp, setShowXp] = useState(0);
  const [phase, setPhase] = useState<'playing' | 'result'>('playing');
  const [reviewing, setReviewing] = useState(false);

  const q = finalQuiz[idx];

  const handleAnswer = (i: number) => {
    if (selected !== null) return;
    setSelected(i);
    const isCorrect = q.options[i].correct;
    if (isCorrect) {
      setCorrectCount(p => p + 1);
      const pts = 30;
      setShowXp(pts);
      onXp(pts);
    } else {
      setWrongTopics(prev => prev.includes(q.topic) ? prev : [...prev, q.topic]);
    }
  };

  const handleNext = () => {
    setSelected(null);
    if (idx + 1 >= finalQuiz.length) setPhase('result');
    else setIdx(p => p + 1);
  };

  if (phase === 'result') {
    const total = finalQuiz.length;
    const pct = Math.round((correctCount / total) * 100);
    const level = pct >= 80 ? 'guardian' : pct >= 50 ? 'aprendiz' : 'practicando';
    const messages = {
      guardian: { title: '¡Excelente! Sos Guardián Digital ✦', body: 'Reconocés muy bien las señales y sabés qué hacer cuando algo incomoda. Seguí cuidándote y ayudando a tus amigos a hacer lo mismo.' },
      aprendiz: { title: 'Muy bien, aprendiste mucho.', body: 'Tenés clarísimas varias cosas importantes. Repasemos algunas señales para afinar todavía más tu radar.' },
      practicando: { title: 'Buen intento. Lo importante es seguir practicando.', body: 'Algunas cosas necesitan repaso. Si algo online te incomoda, lo más importante de todo: pedí ayuda a un adulto de confianza.' },
    } as const;
    const m = messages[level];

    if (reviewing) {
      return (
        <div>
          <h3 style={{ fontFamily: "'Space Grotesk', 'Inter', sans-serif", fontSize: '17px', color: C.blueDark, marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '-0.3px' }}>Lo más importante</h3>
          <ul style={{ paddingLeft: 18, margin: 0, color: C.blueDark, fontSize: 13.5, lineHeight: 1.7, fontWeight: 500 }}>
            <li>No compartas datos personales con desconocidos.</li>
            <li>Si alguien te pide secreto, es una señal de alerta.</li>
            <li>No tenés que responder para "quedar bien".</li>
            <li>Bloquear y reportar es cuidarte, no ser malo.</li>
            <li>Pedir ayuda a un adulto de confianza siempre está bien.</li>
            <li>Si algo te incomoda, escuchá esa señal.</li>
          </ul>
          <div style={{ display: 'flex', gap: 10, marginTop: 22, justifyContent: 'center' }}>
            <button onClick={() => setReviewing(false)} className="btn-secondary" style={{ padding: '12px 22px', borderRadius: '999px', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', cursor: 'pointer' }}>Volver</button>
            <button onClick={() => onComplete(correctCount * 30)} className="btn-primary" style={{ padding: '12px 22px', borderRadius: '999px', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', cursor: 'pointer' }}>Reclamar XP</button>
          </div>
        </div>
      );
    }

    return (
      <div style={{ textAlign: 'center' }}>
        <div className="badge-pulse" style={{ width: 76, height: 76, margin: '0 auto 18px', borderRadius: '50%', background: C.celeste, border: `1px solid ${C.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke={C.blue} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="M9 12l2 2 4-4" /></svg>
        </div>
        <h3 style={{ fontFamily: "'Space Grotesk', 'Inter', sans-serif", fontSize: '20px', color: C.blueDark, marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '-0.5px' }}>{m.title}</h3>
        <div style={{ fontSize: '40px', fontWeight: 700, color: C.blue, marginBottom: '6px', fontFamily: "'Space Grotesk', 'Inter', sans-serif", letterSpacing: '-1px' }}>{correctCount}/{total}</div>
        <p style={{ fontSize: 13, color: C.textMute, fontWeight: 600, marginTop: 0, marginBottom: 14 }}>{pct}% de respuestas correctas</p>
        <p style={{ fontSize: 14, color: C.blueDark, lineHeight: 1.6, marginBottom: 18, fontWeight: 500, maxWidth: 420, marginInline: 'auto' }}>{m.body}</p>

        {wrongTopics.length > 0 && (
          <div style={{ textAlign: 'left', background: C.bgSoft, border: `1px solid ${C.line}`, borderRadius: 14, padding: '12px 16px', marginBottom: 18 }}>
            <div style={{ fontSize: '10.5px', fontWeight: 700, textTransform: 'uppercase', color: C.blue, letterSpacing: '1.4px', marginBottom: 8, fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}>Conceptos a repasar</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {wrongTopics.map(t => (
                <span key={t} style={{ padding: '4px 10px', borderRadius: 999, background: C.white, border: `1px solid ${C.line}`, color: C.blueDark, fontSize: 11.5, fontWeight: 600 }}>{t}</span>
              ))}
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={() => setReviewing(true)} className="btn-secondary" style={{ padding: '12px 22px', borderRadius: '999px', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', cursor: 'pointer' }}>Repasar conceptos</button>
          <button onClick={() => onComplete(correctCount * 30)} className="btn-primary" style={{ padding: '12px 22px', borderRadius: '999px', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', cursor: 'pointer' }}>Reclamar XP</button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {showXp > 0 && <XpPop amount={showXp} onDone={() => setShowXp(0)} />}
      <MissionBar label="Quiz Final" current={idx} max={finalQuiz.length} />

      <div style={{ background: C.bgSoft, borderRadius: '16px', padding: '22px', marginBottom: '14px', border: `1px solid ${C.line}` }}>
        <div style={{ fontSize: '10.5px', fontWeight: 700, textTransform: 'uppercase', color: C.blue, letterSpacing: '1.4px', marginBottom: 8, fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}>
          Pregunta {idx + 1} de {finalQuiz.length} · {q.topic}
        </div>
        <p style={{ fontSize: '15px', color: C.blueDark, lineHeight: 1.55, margin: 0, fontWeight: 600 }}>{q.q}</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {q.options.map((opt, i) => {
          const isSelected = selected === i;
          const showState = selected !== null;
          const bg = showState
            ? (opt.correct ? 'rgba(22,163,74,0.10)' : (isSelected ? 'rgba(234,88,12,0.10)' : C.white))
            : C.white;
          const border = showState
            ? (opt.correct ? 'rgba(22,163,74,0.5)' : (isSelected ? 'rgba(234,88,12,0.5)' : C.line))
            : C.line;
          const color = showState
            ? (opt.correct ? '#15803D' : (isSelected ? '#C2410C' : C.blueDark))
            : C.blueDark;
          return (
            <button
              key={i}
              onClick={() => handleAnswer(i)}
              disabled={selected !== null}
              className="btn-option"
              style={{
                padding: '14px 16px', borderRadius: '12px', textAlign: 'left',
                background: bg, border: `1.5px solid ${border}`, color,
                fontSize: '14px', fontWeight: 500, cursor: selected !== null ? 'default' : 'pointer',
                fontFamily: "'Inter', sans-serif", transition: 'all .25s ease'
              }}
            >
              {opt.text}
            </button>
          );
        })}
      </div>

      {selected !== null && (
        <>
          <FeedbackBox
            message={q.options[selected].correct ? `¡Muy bien! ${q.options[selected].feedback}` : `Ojo: ${q.options[selected].feedback}`}
            type={q.options[selected].correct ? 'success' : 'danger'}
          />
          <div style={{ textAlign: 'center', marginTop: 6 }}>
            <button onClick={handleNext} className="btn-primary" style={{ padding: '12px 26px', borderRadius: '999px', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', cursor: 'pointer' }}>
              {idx + 1 >= finalQuiz.length ? 'Ver resultado' : 'Siguiente pregunta'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

/* ════════════════════════════════
   MAIN PAGE
════════════════════════════════ */
export default function NinosPage() {
  useEffect(() => {
    trackWorldEntry("ninos");
  }, []);

  const [view, setView] = useState<'intro' | 'setup' | 'world'>('intro');
  const [nickname, setNickname] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState("a1");
  const [xp, setXp] = useState(0);
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const [completedModules, setCompletedModules] = useState<Set<string>>(new Set());
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const activeAvatar = useMemo(() => avatars.find((a) => a.id === selectedAvatar) ?? avatars[0], [selectedAvatar]);

  const handleXp = useCallback((n: number) => setXp(p => p + n), []);
  const handleComplete = (id: string, pts: number) => {
    setCompletedModules(p => new Set([...p, id]));
    setActiveModule(null);
  };

  type MissionDef = {
    id: string; title: string; desc: string; xp: number; unlock: number; icon: string;
    type: string; difficulty: 1 | 2 | 3; duration: string;
  };
  const missions: MissionDef[] = [
    { id: 'chat', title: 'Misión 1 · Chat sospechoso', desc: 'Un desconocido te contacta en tu juego favorito. Detectá sus intenciones.', xp: 200, unlock: 0, icon: 'chat', type: 'Diálogo', difficulty: 1, duration: '5 min' },
    { id: 'decisions', title: 'Misión 2 · Decisiones reales', desc: 'Enfrentá situaciones del día a día y elegí el camino más seguro.', xp: 250, unlock: 0, icon: 'decisions', type: 'Elección', difficulty: 1, duration: '4 min' },
    { id: 'classify', title: 'Misión 3 · Clasificar situaciones', desc: 'Decidí rápido cuáles situaciones son seguras y cuáles son riesgosas.', xp: 280, unlock: 1, icon: 'classify', type: 'Reflejos', difficulty: 2, duration: '6 min' },
    { id: 'maze', title: 'Misión 4 · Laberinto de decisiones', desc: 'Navegá un laberinto de situaciones reales tomando las decisiones correctas.', xp: 320, unlock: 2, icon: 'maze', type: 'Aventura', difficulty: 3, duration: '8 min' },
    { id: 'wordsearch', title: 'Misión 5 · Sopa de letras', desc: 'Encontrá las palabras clave sobre seguridad digital en la grilla.', xp: 180, unlock: 3, icon: 'wordsearch', type: 'Búsqueda', difficulty: 1, duration: '5 min' },
    { id: 'crossword', title: 'Misión 6 · Crucigrama digital', desc: 'Completá el crucigrama con conceptos fundamentales sobre grooming.', xp: 200, unlock: 3, icon: 'crossword', type: 'Lógica', difficulty: 2, duration: '7 min' },
    { id: 'matching', title: 'Misión 7 · Conectar conceptos', desc: 'Uní cada concepto con su definición correcta para reforzar lo aprendido.', xp: 150, unlock: 4, icon: 'matching', type: 'Memoria', difficulty: 1, duration: '4 min' },
    { id: 'finalquiz', title: 'Misión final · ¿Qué aprendiste?', desc: 'Quiz final para repasar señales de grooming, privacidad, bloqueo y pedir ayuda. Se desbloquea al completar las misiones principales.', xp: 400, unlock: 6, icon: 'finalquiz', type: 'Quiz', difficulty: 3, duration: '8 min' },
  ];

  const getMissionIcon = (icon: string) => {
    const icons: Record<string, React.ReactNode> = {
      chat: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.blue} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>,
      decisions: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.blue} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" /></svg>,
      classify: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.blue} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>,
      maze: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.blue} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3h18v18H3V3z" /><path d="M9 3v6H3M15 3v12h6M9 15H3M15 15v6M9 9h6v6" /></svg>,
      wordsearch: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.blue} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /><line x1="8" y1="11" x2="14" y2="11" /><line x1="11" y1="8" x2="11" y2="14" /></svg>,
      crossword: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.blue} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v18M3 12h18" /></svg>,
      matching: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.blue} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" /></svg>,
      finalquiz: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.blue} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="M9 12l2 2 4-4" /></svg>,
    };
    return icons[icon] ?? icons.chat;
  };

  const totalXpPossible = missions.reduce((s, m) => s + m.xp, 0);

  const todayMission = missions.find(m => !completedModules.has(m.id) && completedModules.size >= m.unlock) ?? missions[0];

  return (
    <main style={{ background: C.white, color: C.blueDark, minHeight: "100vh", fontFamily: "'Inter', sans-serif", position: 'relative', overflowX: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Space+Grotesk:wght@500;600;700&display=swap');

        html { scroll-behavior: smooth; }
        a { text-decoration: none; }

        /* === Botones === */
        .btn-primary {
          font-family: 'Inter', sans-serif;
          background: linear-gradient(135deg, ${C.blue}, #4A82FF);
          color: ${C.white};
          border: none;
          box-shadow: 0 6px 18px rgba(11,92,255,0.22);
          transition: all 0.3s cubic-bezier(.16,1,.3,1);
          position: relative; overflow: hidden;
        }
        .btn-primary::after {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.25) 50%, transparent 70%);
          transform: translateX(-100%); transition: transform .6s ease;
        }
        .btn-primary:hover:not(:disabled) {
          transform: translateY(-3px);
          box-shadow: 0 14px 32px rgba(11,92,255,0.38);
        }
        .btn-primary:hover:not(:disabled)::after { transform: translateX(100%); }
        .btn-primary:active:not(:disabled) { transform: translateY(-1px); }
        .btn-secondary {
          font-family: 'Inter', sans-serif;
          background: ${C.white};
          color: ${C.blueDark};
          border: 1px solid ${C.line};
          transition: all 0.3s ease;
        }
        .btn-secondary:hover:not(:disabled) {
          background: ${C.bgSoft};
          border-color: ${C.blue};
          color: ${C.blue};
          transform: translateY(-2px);
        }
        .btn-option:hover:not(:disabled) {
          border-color: ${C.blue};
          background: ${C.bgSoft};
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(11,92,255,0.10);
        }
        .btn-classify:hover:not(:disabled) {
          transform: translateY(-3px) scale(1.02);
          box-shadow: 0 10px 24px rgba(6,21,56,0.10);
        }

        /* === Cards de misión === */
        .card-glass {
          background: ${C.white};
          border: 1px solid ${C.line};
          border-radius: 24px;
          transition: all 0.4s cubic-bezier(.16,1,.3,1);
          position: relative; overflow: hidden;
        }
        .card-glass::before {
          content: ''; position: absolute; top: -40px; right: -40px;
          width: 140px; height: 140px; border-radius: 50%;
          background: radial-gradient(circle, ${C.celeste} 0%, transparent 70%);
          opacity: 0; transition: opacity .4s ease;
        }
        .card-glass:hover {
          border-color: ${C.blue};
          box-shadow: 0 22px 44px rgba(6,21,56,0.10);
          transform: translateY(-6px);
        }
        .card-glass:hover::before { opacity: 1; }
        .card-glass:hover .mission-icon { transform: rotate(-6deg) scale(1.08); }
        .mission-icon { transition: transform .4s cubic-bezier(.16,1,.3,1); }
        .mission-locked { opacity: 0.68; }
        .mission-locked:hover { transform: none; border-color: ${C.line}; box-shadow: none; }
        .mission-locked .card-glass::before { opacity: 0; }

        /* === Avatares === */
        .avatar-card {
          border: 1.5px solid ${C.line};
          background: ${C.white};
          transition: all 0.3s ease;
        }
        .avatar-card:hover {
          border-color: ${C.blue};
          transform: translateY(-3px);
          box-shadow: 0 10px 22px rgba(11,92,255,0.12);
        }
        .avatar-card.selected {
          border-color: ${C.blue};
          background: ${C.celeste};
          box-shadow: 0 10px 22px rgba(11,92,255,0.20);
        }

        /* === Animaciones === */
        @keyframes slideUpIn { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes xpPop { 0% { opacity: 0; transform: translateY(0) scale(.8); } 20% { opacity: 1; transform: translateY(-12px) scale(1); } 100% { opacity: 0; transform: translateY(-32px) scale(.9); } }
        @keyframes typingDot { 0%, 100% { opacity: 0.3; } 50% { opacity: 1; } }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
        @keyframes floatSlow {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-18px) rotate(4deg); }
        }
        @keyframes bob {
          0%, 100% { transform: translateY(0) rotate(-2deg); }
          50% { transform: translateY(-8px) rotate(2deg); }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.4; transform: scale(1) rotate(0deg); }
          50% { opacity: 1; transform: scale(1.25) rotate(20deg); }
        }
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 0 rgba(22,163,74,0); }
          50% { box-shadow: 0 0 22px rgba(22,163,74,0.30); }
        }
        @keyframes badgePulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(11,92,255,0.45); }
          50% { box-shadow: 0 0 0 8px rgba(11,92,255,0); }
        }
        @keyframes waveArm {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-12deg); }
          75% { transform: rotate(8deg); }
        }
        @keyframes blobMove {
          0%, 100% { transform: translate(0,0) scale(1); }
          50% { transform: translate(20px,-15px) scale(1.08); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }

        .float { animation: float 5s ease-in-out infinite; }
        .float-slow { animation: floatSlow 8s ease-in-out infinite; }
        .bob { animation: bob 4s ease-in-out infinite; }
        .twinkle { animation: twinkle 3s ease-in-out infinite; }
        .badge-pulse { animation: badgePulse 2s ease-in-out infinite; }
        .wave-arm { animation: waveArm 2.4s ease-in-out infinite; transform-origin: 85px 70px; }
        .reveal { animation: fadeInUp .7s cubic-bezier(.16,1,.3,1) both; }

        .card-correct { animation: pulseGlow 0.6s ease; border-color: rgba(22,163,74,0.5) !important; }
        .card-wrong { animation: shake 0.4s ease; border-color: rgba(234,88,12,0.5) !important; }

        /* === Modal === */
        .modal-scroll { overflow-y: auto; max-height: 90vh; }
        .modal-scroll::-webkit-scrollbar { width: 6px; }
        .modal-scroll::-webkit-scrollbar-track { background: ${C.bgSoft}; }
        .modal-scroll::-webkit-scrollbar-thumb { background: ${C.line}; border-radius: 4px; }
        .modal-scroll::-webkit-scrollbar-thumb:hover { background: ${C.blue}; }

        /* === Inputs === */
        .sf-input {
          width: 100%;
          padding: 14px 16px;
          border-radius: 12px;
          background: ${C.white};
          border: 1px solid ${C.line};
          color: ${C.blueDark};
          outline: none;
          font-size: 15px;
          font-family: 'Inter', sans-serif;
          font-weight: 500;
          box-sizing: border-box;
          transition: all 0.25s ease;
        }
        .sf-input:focus {
          border-color: ${C.blue};
          box-shadow: 0 0 0 4px rgba(11,92,255,0.10);
        }

        /* === Hero === */
        .hero-grid {
          display: grid;
          grid-template-columns: 1.05fr 0.95fr;
          gap: 48px;
          align-items: center;
          position: relative;
        }
        @media (max-width: 960px) {
          .hero-grid { grid-template-columns: 1fr; gap: 36px; }
          .hero-visual { order: -1; }
          .hero-side-kid { display: none !important; }
        }

        .hero-title {
          font-family: 'Space Grotesk', 'Inter', sans-serif;
          font-weight: 700;
          font-size: clamp(32px, 4.6vw, 60px);
          line-height: 1.05;
          letter-spacing: -1.5px;
          color: ${C.blueDark};
          margin: 0 0 22px;
          text-transform: uppercase;
        }
        .hero-title em { font-style: normal; color: ${C.blue}; position: relative; }
        .hero-title em::after {
          content: ''; position: absolute; left: 0; right: 0; bottom: 4px; height: 8px;
          background: ${C.celeste}; z-index: -1; border-radius: 4px;
        }
        .eyebrow {
          display: inline-flex; align-items: center; gap: 8px;
          font-size: 11.5px; font-weight: 700;
          letter-spacing: 2px; text-transform: uppercase; color: ${C.blue};
          margin-bottom: 22px; font-family: 'Space Grotesk', 'Inter', sans-serif;
          padding: 6px 14px; background: ${C.celeste}; border: 1px solid rgba(11,92,255,0.18);
          border-radius: 999px;
        }
        .eyebrow::before {
          content: ''; width: 6px; height: 6px; border-radius: 50%;
          background: ${C.blue}; box-shadow: 0 0 0 4px rgba(11,92,255,0.15);
        }

        /* === Fondo deco === */
        .bg-deco .blob {
          position: absolute; border-radius: 50%;
          filter: blur(40px); opacity: 0.55;
        }
        .blob-1 { width: 380px; height: 380px; top: -100px; right: -80px; background: ${C.celeste}; animation: blobMove 18s ease-in-out infinite; }
        .blob-2 { width: 280px; height: 280px; bottom: -80px; left: -60px; background: rgba(155,229,199,0.35); animation: blobMove 22s ease-in-out infinite reverse; }
        .blob-3 { width: 220px; height: 220px; top: 40%; left: 50%; background: rgba(199,184,255,0.25); animation: blobMove 26s ease-in-out infinite; }

        /* === Sticker floating === */
        .sticker {
          background: ${C.white}; border: 1px solid ${C.line};
          border-radius: 14px; padding: 8px 12px;
          font-family: 'Space Grotesk', 'Inter', sans-serif;
          font-size: 11px; font-weight: 700; color: ${C.blueDark};
          box-shadow: 0 8px 22px rgba(6,21,56,0.10);
          display: inline-flex; align-items: center; gap: 6px;
          letter-spacing: 0.5px;
        }

        /* === Decoración hero kid === */
        .hero-side-kid {
          position: absolute;
          pointer-events: none;
          z-index: 1;
        }

        /* === Mission card details === */
        .diff-dot {
          width: 7px; height: 7px; border-radius: 50%;
          background: ${C.line}; transition: background .3s ease;
        }
        .diff-dot.on { background: ${C.blue}; }

        /* === Today mission strip === */
        .today-strip {
          background: linear-gradient(135deg, ${C.celeste} 0%, rgba(255,255,255,0.6) 100%);
          border: 1px solid ${C.line};
          border-radius: 22px;
          padding: 18px 22px;
          display: flex; align-items: center; gap: 18px;
          margin-bottom: 28px;
          position: relative; overflow: hidden;
        }
        .today-strip::before {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.5) 50%, transparent 70%);
          background-size: 200% 100%;
          animation: shimmer 5s linear infinite;
          pointer-events: none;
        }

        @media (max-width: 600px) {
          .today-strip { flex-direction: column; align-items: flex-start; gap: 12px; }
          .hero-side-deco { display: none !important; }
        }
      `}</style>

      <LightParticles />

      <div style={{ height: "4px", background: `linear-gradient(90deg, ${C.celeste} 0%, ${C.blue} 50%, ${C.celeste} 100%)`, position: "relative", zIndex: 51 }} />

      {/* === NAVBAR === */}
      <header style={{
        position: "sticky", top: 0, zIndex: 50,
        background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(8px)',
        borderBottom: `1px solid ${C.line}`,
        boxShadow: scrolled ? '0 4px 16px rgba(6,21,56,0.06)' : 'none',
        transition: 'box-shadow 0.3s ease'
      }}>
        <nav style={{ maxWidth: "1200px", margin: "0 auto", minHeight: "72px", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, fontFamily: "'Space Grotesk', 'Inter', sans-serif", color: C.blueDark, fontSize: "22px", fontWeight: 700, letterSpacing: '1.5px' }}>
            <span style={{ width: 28, height: 28, borderRadius: 8, background: C.blue, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(11,92,255,0.30)' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
            </span>
            SAFENET
          </a>

          {view === 'world' ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: C.bgSoft, padding: '6px 14px', borderRadius: '999px', border: `1px solid ${C.line}` }}>
                <CharacterVisual img={activeAvatar.img} accent={activeAvatar.accent} size={24} />
                <span style={{ fontWeight: 700, color: C.blueDark, fontSize: '13px', fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}>{nickname}</span>
              </div>
              <div className="badge-pulse" style={{ background: `linear-gradient(135deg, ${C.blue}, #4A82FF)`, color: C.white, padding: '8px 16px', borderRadius: '999px', fontWeight: 700, fontSize: '12px', fontFamily: "'Space Grotesk', 'Inter', sans-serif", letterSpacing: '0.5px', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="#FFFFFF"><path d="M12 2 L14 9 L22 10 L16 15 L18 22 L12 18 L6 22 L8 15 L2 10 L10 9 Z"/></svg>
                {xp} XP
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <a href="/" className="btn-secondary" style={{ padding: '10px 18px', borderRadius: '999px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>Salir</a>
              {view === 'intro' && (
                <button onClick={() => setView('setup')} className="btn-primary" style={{ padding: '10px 20px', borderRadius: '999px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}>Empezar</button>
              )}
            </div>
          )}
        </nav>
      </header>

      <section style={{ padding: "60px 20px 80px", position: 'relative', zIndex: 1 }}>

        {/* === VIEW: INTRO === */}
        {view === 'intro' && (
          <div style={{ position: 'relative', maxWidth: "1200px", margin: "0 auto" }} className="reveal">
            {/* Decoraciones flotantes */}
            <Sparkle top={10} left={'8%'} size={18} color={C.sun} delay={0} />
            <Sparkle top={80} right={'12%'} size={14} color={C.blue} delay={0.6} />
            <Sparkle bottom={40} left={'30%'} size={12} color={C.mint} delay={1.2} opacity={0.8} />
            <PlusMark top={140} right={40} size={18} anim />
            <PlusMark top={250} left={20} size={14} opacity={0.4} anim />
            <Ring top={'-20px'} right={'45%'} size={80} opacity={0.18} />
            <Dot top={60} left={'45%'} size={6} color={C.lilac} opacity={0.7} />

            <div className="hero-grid">
              {/* Columna izquierda: texto */}
              <div style={{ position: 'relative' }}>
                <span className="eyebrow">Aprender jugando</span>
                <h1 className="hero-title">
                  Explorá señales de riesgo en juegos y <em>chats online</em>
                </h1>
                <p style={{ fontSize: "17px", color: C.textMute, lineHeight: 1.65, maxWidth: '520px', marginBottom: '32px', fontWeight: 500 }}>
                  Un espacio pensado para chicos y chicas, con desafíos simples, decisiones guiadas y juegos interactivos para reconocer situaciones incómodas, pedir ayuda y actuar a tiempo.
                </p>

                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '36px' }}>
                  <button onClick={() => setView('setup')} className="btn-primary" style={{ padding: "14px 26px", borderRadius: "999px", fontSize: "14px", fontWeight: 700, textTransform: "uppercase", letterSpacing: '1px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 10 }}>
                    Empezar recorrido
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                  </button>
                  <a href="#misiones" className="btn-secondary" style={{ padding: "14px 24px", borderRadius: "999px", fontSize: "14px", fontWeight: 600, textTransform: "uppercase", letterSpacing: '0.8px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                    Ver misiones
                  </a>
                </div>

                <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                  {[
                    { num: '8', label: 'Misiones' },
                    { num: '+1900', label: 'XP totales' },
                    { num: '6', label: 'Temas clave' },
                  ].map((s, i) => (
                    <div key={i} style={{ minWidth: '90px' }}>
                      <div style={{ fontFamily: "'Space Grotesk', 'Inter', sans-serif", fontSize: '28px', fontWeight: 700, color: C.blueDark, letterSpacing: '-1px', lineHeight: 1 }}>{s.num}</div>
                      <div style={{ fontSize: '11px', color: C.textMute, fontWeight: 600, marginTop: 4, textTransform: 'uppercase', letterSpacing: '1px' }}>{s.label}</div>
                    </div>
                  ))}
                </div>

                {/* Personaje peek lado izquierdo desktop */}
                <div className="hero-side-kid bob hero-side-deco" style={{ left: '-130px', bottom: '-30px' }}>
                  <KidThinking size={140} />
                </div>
                {/* Otro héroe del equipo abajo */}
                <div className="hero-side-kid float hero-side-deco" style={{ left: '-60px', top: '-90px', animationDelay: '1.5s' }}>
                  <HeroExtra1 size={100} />
                </div>
              </div>

              {/* Columna derecha: panel visual */}
              <div className="hero-visual" style={{ position: 'relative' }}>
                <PlusMark top={-14} left={-14} size={16} anim />
                <PlusMark bottom={-12} right={-12} size={16} anim />
                <Sparkle top={-22} right={40} size={16} color={C.sun} delay={0.4} />
                <Sparkle bottom={-18} left={50} size={14} color={C.blue} delay={1.5} />

                {/* Kid guardian flotando */}
                <div className="float" style={{ position: 'absolute', top: '-70px', right: '-30px', zIndex: 3 }}>
                  <KidGuardian size={120} />
                </div>

                {/* Stickers flotantes */}
                <div className="float" style={{ position: 'absolute', top: '20px', left: '-80px', zIndex: 3, animationDelay: '1.2s' }}>
                  <div className="sticker">
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: C.success }} />
                    Zona segura
                  </div>
                </div>
                <div className="bob" style={{ position: 'absolute', bottom: '40px', left: '-70px', zIndex: 3 }}>
                  <div className="sticker" style={{ background: C.blue, color: C.white, borderColor: C.blue }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="#FFFFFF"><path d="M12 2 L14 9 L22 10 L16 15 L18 22 L12 18 L6 22 L8 15 L2 10 L10 9 Z"/></svg>
                    +30 XP
                  </div>
                </div>

                <div style={{
                  background: C.white,
                  border: `1px solid ${C.line}`,
                  borderRadius: '28px',
                  padding: '28px',
                  boxShadow: '0 24px 56px rgba(6,21,56,0.10)',
                  position: 'relative', overflow: 'hidden'
                }}>
                  <div aria-hidden style={{ position: 'absolute', top: -60, right: -60, width: 200, height: 200, borderRadius: '50%', background: C.celeste, opacity: 0.6, filter: 'blur(20px)' }} />

                  <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                      <Badge tone="blue" pulse>Tu progreso</Badge>
                      <Badge tone="success">Seguro</Badge>
                    </div>

                    <div style={{ background: C.bgSoft, borderRadius: '14px', padding: '14px', border: `1px solid ${C.line}`, marginBottom: '16px' }}>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', marginBottom: 8 }}>
                        <div style={{ width: 24, height: 24, borderRadius: '50%', background: C.celeste, border: `1px solid ${C.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <span style={{ width: 10, height: 10, borderRadius: '50%', background: C.blueDark }} />
                        </div>
                        <div style={{ background: C.white, border: `1px solid ${C.line}`, padding: '8px 12px', borderRadius: '12px 12px 12px 4px', fontSize: 12, color: C.blueDark, maxWidth: '70%' }}>¡Hola! ¿Cómo te llamás?</div>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <div style={{ background: `linear-gradient(135deg, ${C.blue}, #4A82FF)`, color: C.white, padding: '8px 12px', borderRadius: '12px 12px 4px 12px', fontSize: 12, maxWidth: '70%', fontWeight: 500, boxShadow: '0 4px 10px rgba(11,92,255,0.20)' }}>Prefiero no decirte mi nombre</div>
                      </div>
                    </div>

                    <div style={{ marginBottom: 14 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10.5, fontWeight: 700, color: C.blueDark, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '1.2px', fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}>
                        <span>Seguridad de chat</span><span style={{ color: C.blue }}>72%</span>
                      </div>
                      <div style={{ height: 8, background: C.celeste, borderRadius: 99, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: '72%', background: `linear-gradient(90deg, ${C.blue}, #4A82FF)`, borderRadius: 99, boxShadow: '0 0 12px rgba(11,92,255,0.35)' }} />
                      </div>
                    </div>
                    <div style={{ marginBottom: 18 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10.5, fontWeight: 700, color: C.blueDark, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '1.2px', fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}>
                        <span>Decisiones correctas</span><span style={{ color: C.blue }}>58%</span>
                      </div>
                      <div style={{ height: 8, background: C.celeste, borderRadius: 99, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: '58%', background: `linear-gradient(90deg, ${C.blue}, #4A82FF)`, borderRadius: 99 }} />
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      <Badge tone="blue">+30 XP</Badge>
                      <Badge tone="success">Bloquear</Badge>
                      <Badge tone="sun">Pedir ayuda</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* === VIEW: SETUP === */}
        {view === 'setup' && (
          <div style={{ maxWidth: "640px", margin: "0 auto", position: 'relative' }} className="reveal">
            {/* personaje al lado */}
            <div className="bob" style={{ position: 'absolute', top: -10, right: -140, display: 'block' }}>
              <KidWaving size={130} />
            </div>
            <Sparkle top={20} left={-30} size={16} color={C.sun} delay={0.3} />
            <Sparkle bottom={40} left={-50} size={12} color={C.blue} delay={1.0} />

            <div style={{ background: C.white, padding: "44px", borderRadius: "28px", border: `1px solid ${C.line}`, boxShadow: '0 24px 56px rgba(6,21,56,0.08)', position: 'relative', overflow: 'hidden' }}>
              <PlusMark top={16} right={16} size={14} anim />
              <PlusMark bottom={16} left={16} size={14} opacity={0.3} anim />
              <div aria-hidden style={{ position: 'absolute', top: -80, left: -80, width: 200, height: 200, borderRadius: '50%', background: C.celeste, opacity: 0.5, filter: 'blur(30px)' }} />

              <div style={{ position: 'relative', zIndex: 1 }}>
                <span className="eyebrow">Paso 1 · Tu héroe</span>
                <h2 style={{ fontFamily: "'Space Grotesk', 'Inter', sans-serif", fontSize: "28px", color: C.blueDark, margin: '0 0 10px', textTransform: 'uppercase', letterSpacing: '-1px', lineHeight: 1.1 }}>Tu identidad digital</h2>
                <p style={{ color: C.textMute, fontSize: 14, marginTop: 0, marginBottom: 28, fontWeight: 500 }}>Elegí un apodo y un personaje para empezar tu aventura.</p>

                <div style={{ marginBottom: "28px" }}>
                  <label style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: C.blue, display: "block", marginBottom: "10px", letterSpacing: '1.4px', fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}>Nombre de Héroe</label>
                  <input type="text" value={nickname} onChange={(e) => setNickname(e.target.value.slice(0, 12))} placeholder="Ej: Guardian_01" className="sf-input" />
                </div>

                <div style={{ marginBottom: "32px" }}>
                  <label style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: C.blue, display: "block", marginBottom: "14px", letterSpacing: '1.4px', fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}>Elegí tu personaje</label>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px" }}>
                    {avatars.map(av => (
                      <button key={av.id} onClick={() => setSelectedAvatar(av.id)} className={`avatar-card ${selectedAvatar === av.id ? 'selected' : ''}`} style={{ padding: "18px 8px", borderRadius: "16px", cursor: "pointer", display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                        <CharacterVisual img={av.img} accent={av.accent} size={46} />
                        <div style={{ fontSize: "10.5px", color: C.blueDark, fontWeight: 700, textTransform: 'uppercase', fontFamily: "'Space Grotesk', 'Inter', sans-serif", letterSpacing: '0.5px' }}>{av.name}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <button disabled={nickname.length < 3} onClick={() => setView('world')} className="btn-primary" style={{ width: "100%", padding: "16px", borderRadius: "999px", background: nickname.length >= 3 ? undefined : C.celeste, color: nickname.length >= 3 ? C.white : C.textMute, border: 'none', fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', cursor: nickname.length >= 3 ? 'pointer' : 'not-allowed', boxShadow: nickname.length >= 3 ? '0 6px 18px rgba(11,92,255,0.22)' : 'none' }}>
                  Comenzar aventura
                </button>
              </div>
            </div>
          </div>
        )}

        {/* === VIEW: WORLD === */}
        {view === 'world' && (
          <div style={{ maxWidth: "1200px", margin: "0 auto", position: 'relative' }} id="misiones" className="reveal">
            <Sparkle top={-10} right={30} size={14} color={C.sun} delay={0.3} />
            <PlusMark top={20} left={'40%'} size={14} opacity={0.3} anim />

            {/* Today mission strip */}
            <div className="today-strip">
              <div className="bob" style={{ flexShrink: 0 }}>
                <KidExplorer size={70} />
              </div>
              <div style={{ flex: 1, position: 'relative', zIndex: 1 }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <Badge tone="blue" pulse>Tu misión de hoy</Badge>
                </div>
                <div style={{ fontFamily: "'Space Grotesk', 'Inter', sans-serif", fontSize: 17, fontWeight: 700, color: C.blueDark, textTransform: 'uppercase', letterSpacing: '-0.3px', lineHeight: 1.2 }}>
                  {todayMission.title}
                </div>
                <div style={{ fontSize: 13, color: C.textMute, fontWeight: 500, marginTop: 4 }}>
                  {todayMission.desc}
                </div>
              </div>
              <button onClick={() => setActiveModule(todayMission.id)} className="btn-primary" style={{ padding: '12px 22px', borderRadius: '999px', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', cursor: 'pointer', whiteSpace: 'nowrap', position: 'relative', zIndex: 1 }}>
                Jugar ahora →
              </button>
            </div>

            <div style={{ marginBottom: "32px", display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '24px', flexWrap: 'wrap' }}>
              <div>
                <span className="eyebrow">Panel de misiones</span>
                <h2 style={{ fontFamily: "'Space Grotesk', 'Inter', sans-serif", fontSize: "clamp(28px, 4vw, 44px)", color: C.blueDark, margin: '0 0 8px 0', textTransform: 'uppercase', letterSpacing: '-1.2px', lineHeight: 1.05 }}>
                  Misiones <em style={{ fontStyle: 'normal', color: C.blue }}>disponibles</em>
                </h2>
                <p style={{ fontSize: "15px", color: C.textMute, margin: 0, fontWeight: 500 }}>Bienvenido, guardián <strong style={{ color: C.blueDark }}>{nickname}</strong>. Cada desafío te da más XP.</p>
              </div>
              <div style={{ background: C.white, border: `1px solid ${C.line}`, borderRadius: '20px', padding: '18px 22px', minWidth: '240px', boxShadow: '0 8px 22px rgba(6,21,56,0.05)' }}>
                <div style={{ fontSize: '10.5px', fontWeight: 700, textTransform: 'uppercase', color: C.blue, letterSpacing: '1.4px', marginBottom: '10px', fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}>Progreso general</div>
                <div style={{ height: '10px', background: C.celeste, borderRadius: '99px', overflow: 'hidden', marginBottom: '8px' }}>
                  <div style={{ height: '100%', width: `${Math.min(100, (completedModules.size / missions.length) * 100)}%`, background: `linear-gradient(90deg, ${C.blue}, #4A82FF)`, transition: 'width 0.8s ease', borderRadius: 99, boxShadow: '0 0 10px rgba(11,92,255,0.4)' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', color: C.blueDark, fontWeight: 600 }}>
                  <span>{completedModules.size} de {missions.length} misiones</span>
                  <span style={{ color: C.blue, fontWeight: 700, fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}>{xp} XP</span>
                </div>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "20px" }}>
              {missions.map((m, idx) => {
                const isLocked = completedModules.size < m.unlock;
                const isCompleted = completedModules.has(m.id);
                return (
                  <article key={m.id} className={`card-glass ${isLocked ? 'mission-locked' : ''}`} style={{
                    padding: "28px", borderRadius: "22px", display: 'flex', flexDirection: 'column',
                    borderLeft: isCompleted ? `4px solid ${C.success}` : isLocked ? `4px solid ${C.line}` : `4px solid ${C.blue}`,
                    animationDelay: `${idx * 0.05}s`,
                  }}>
                    {/* Top row: status badge */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                      <div className="mission-icon" style={{ width: '52px', height: '52px', borderRadius: '14px', background: isLocked ? C.bgSoft : C.celeste, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${C.line}`, position: 'relative' }}>
                        {getMissionIcon(m.icon)}
                        {!isLocked && !isCompleted && <Sparkle top={-6} right={-6} size={10} color={C.sun} delay={idx * 0.3} />}
                      </div>
                      {isCompleted && <Badge tone="success">✓ Lista</Badge>}
                      {isLocked && <Badge tone="neutral">🔒 Bloqueada</Badge>}
                      {!isLocked && !isCompleted && <Badge tone="blue">Nueva</Badge>}
                    </div>

                    <h3 style={{ fontFamily: "'Space Grotesk', 'Inter', sans-serif", fontSize: "15px", color: C.blueDark, marginBottom: "8px", lineHeight: 1.3, textTransform: 'uppercase', letterSpacing: '-0.3px', fontWeight: 700 }}>{m.title}</h3>
                    <p style={{ fontSize: "13.5px", color: C.textMute, lineHeight: 1.55, marginBottom: "18px", flexGrow: 1, fontWeight: 500 }}>{m.desc}</p>

                    {/* Meta info: type · difficulty · duration */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 18, fontSize: 11, color: C.textMute, fontWeight: 600 }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 9px', background: C.bgSoft, border: `1px solid ${C.line}`, borderRadius: 999, fontFamily: "'Space Grotesk', 'Inter', sans-serif", letterSpacing: '0.4px', textTransform: 'uppercase', fontSize: 10 }}>
                        {m.type}
                      </span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }} title={`Dificultad: ${m.difficulty}/3`}>
                        {[1, 2, 3].map(d => <span key={d} className={`diff-dot ${d <= m.difficulty ? 'on' : ''}`} />)}
                      </span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                        {m.duration}
                      </span>
                    </div>

                    {isLocked && (
                      <p style={{ fontSize: '11.5px', color: C.textMute, marginBottom: '14px', fontWeight: 500, fontStyle: 'italic' }}>
                        Completá {m.unlock} misió{m.unlock !== 1 ? 'nes' : 'n'} para desbloquear
                      </p>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, paddingTop: 12, borderTop: `1px dashed ${C.line}` }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(245,196,81,0.15)', padding: '6px 12px', borderRadius: '999px', border: '1px solid rgba(245,196,81,0.4)', color: '#A6770D', fontSize: '11px', fontWeight: 700, fontFamily: "'Space Grotesk', 'Inter', sans-serif", letterSpacing: '0.5px' }}>
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="#F5C451"><path d="M12 2 L14 9 L22 10 L16 15 L18 22 L12 18 L6 22 L8 15 L2 10 L10 9 Z"/></svg>
                        +{m.xp} XP
                      </span>
                      <button
                        onClick={() => !isLocked && setActiveModule(m.id)}
                        disabled={isLocked}
                        className={isLocked ? 'btn-secondary' : 'btn-primary'}
                        style={{ padding: "10px 22px", borderRadius: "999px", background: isLocked ? C.bgSoft : undefined, color: isLocked ? C.textMute : C.white, border: isLocked ? `1px solid ${C.line}` : 'none', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', cursor: isLocked ? 'not-allowed' : 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6 }}
                      >
                        {isCompleted ? 'Repetir' : isLocked ? 'Bloqueada' : 'Jugar'}
                        {!isLocked && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Frase final amigable con equipo de héroes */}
            <div style={{ marginTop: 48, textAlign: 'center', position: 'relative' }}>
              <div style={{ display: 'inline-flex', alignItems: 'flex-end', justifyContent: 'center', gap: 8, flexWrap: 'wrap' }}>
                <div className="bob"><KidGuardian size={80} /></div>
                <div className="float" style={{ animationDelay: '0.6s' }}><HeroExtra2 size={90} /></div>
                <div className="bob" style={{ animationDelay: '1.2s' }}><KidExplorer size={80} /></div>
              </div>
              <p style={{ marginTop: 14, fontFamily: "'Space Grotesk', 'Inter', sans-serif", fontSize: 15, color: C.blueDark, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Ganá XP aprendiendo a cuidarte ✦
              </p>
              <p style={{ fontSize: 13, color: C.textMute, fontWeight: 500, margin: '6px 0 0' }}>
                Cada misión es una herramienta más para protegerte online.
              </p>
            </div>
          </div>
        )}
      </section>

      {/* === MODAL === */}
      {activeModule && (
        <div style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(6, 21, 56, 0.55)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", animation: 'slideUpIn 0.3s ease' }}>
          <div className="modal-scroll" style={{ maxWidth: "580px", width: "100%", padding: "36px", position: 'relative', background: C.white, border: `1px solid ${C.line}`, borderRadius: '24px', boxShadow: '0 24px 60px rgba(6,21,56,0.20)' }}>
            <button onClick={() => setActiveModule(null)} style={{ position: "absolute", top: "16px", right: "16px", background: C.bgSoft, border: `1px solid ${C.line}`, color: C.blueDark, fontSize: "16px", cursor: "pointer", width: '34px', height: '34px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10, fontWeight: 700, transition: 'all .25s ease' }}>✕</button>

            <div style={{ marginBottom: '22px', paddingRight: '44px' }}>
              <span className="eyebrow" style={{ marginBottom: 8 }}>Misión activa</span>
              <h3 style={{ fontFamily: "'Space Grotesk', 'Inter', sans-serif", fontSize: '18px', color: C.blueDark, margin: 0, textTransform: 'uppercase', letterSpacing: '-0.3px', fontWeight: 700, lineHeight: 1.2 }}>
                {missions.find(m => m.id === activeModule)?.title}
              </h3>
            </div>

            {activeModule === 'chat' && <ChatModule onComplete={(pts: number) => handleComplete('chat', pts)} onXp={handleXp} />}
            {activeModule === 'decisions' && <DecisionsModule onComplete={(pts: number) => handleComplete('decisions', pts)} onXp={handleXp} />}
            {activeModule === 'wordsearch' && <WordSearchModule onComplete={(pts: number) => handleComplete('wordsearch', pts)} onXp={handleXp} />}
            {activeModule === 'classify' && <ClassifyModule onComplete={(pts: number) => handleComplete('classify', pts)} onXp={handleXp} />}
            {activeModule === 'maze' && <MazeModule onComplete={(pts: number) => handleComplete('maze', pts)} onXp={handleXp} />}
            {activeModule === 'crossword' && <CrosswordModule onComplete={(pts: number) => handleComplete('crossword', pts)} onXp={handleXp} />}
            {activeModule === 'matching' && <MatchingModule onComplete={(pts: number) => handleComplete('matching', pts)} onXp={handleXp} />}
            {activeModule === 'finalquiz' && <FinalQuizModule onComplete={(pts: number) => handleComplete('finalquiz', pts)} onXp={handleXp} />}
          </div>
        </div>
      )}

      {/* === FOOTER === */}
      <footer style={{ background: C.white, borderTop: `1px solid ${C.line}`, padding: "32px 20px", position: 'relative', zIndex: 10 }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontFamily: "'Space Grotesk', 'Inter', sans-serif", fontSize: "20px", fontWeight: 700, color: C.blueDark, letterSpacing: '1.5px' }}>
            <span style={{ width: 24, height: 24, borderRadius: 6, background: C.blue, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
            </span>
            SAFENET
          </div>
          <div style={{ fontSize: "12px", color: C.textMute, fontWeight: 500, letterSpacing: '0.5px' }}>© 2026 · Educación digital para chicos y chicas</div>
        </div>
      </footer>
    </main>
  );
}
