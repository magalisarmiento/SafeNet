"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";

/* ============================================================
   PALETA — SAFENET
   ============================================================ */
const C = {
  white:        "#FFFFFF",
  bgSoft:       "#F8FAFC",
  celeste:      "#e5ebfa",
  celesteMid:   "#0B5CFF",
  blue:         "#0B5CFF",
  blueDark:     "#061538",
  blueDeep:     "#102A43",
  textMute:     "#5B6B7A",
  line:         "#D8E3EC",
};

/* ============================================================
   ICONOS SVG
   ============================================================ */
const IconShield = ({ size = 16, color = C.blue }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="M9 12l2 2 4-4" /></svg>
);
const IconHeart = ({ size = 16, color = C.blue }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" /></svg>
);
const IconLock = ({ size = 16, color = C.blue }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
);
const IconQuestion = ({ size = 16, color = C.blue }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
);
const IconArrowSwitch = ({ size = 16, color = C.blue }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="17 1 21 5 17 9" /><path d="M3 11V9a4 4 0 0 1 4-4h14" /><polyline points="7 23 3 19 7 15" /><path d="M21 13v2a4 4 0 0 1-4 4H3" /></svg>
);
const IconArrowRight = ({ size = 14, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
);

const PlusMark = ({ top, left, right, bottom, size = 14, opacity = 0.5 }: any) => (
  <span aria-hidden style={{ position: "absolute", top, left, right, bottom, width: size, height: size, opacity, color: C.celesteMid, pointerEvents: "none" }}>
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
  </span>
);


/* ============================================================
   NAVBAR
   ============================================================ */
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const sy = window.scrollY;
      setScrolled(sy > 20);
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(h > 0 ? Math.min(sy / h, 1) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="nav-inner">
        <a href="/" className="nav-logo">SAFENET</a>
        <div className="nav-links">
          <a href="#mundos" className="nav-link">Mundos</a>
          <a href="#senales" className="nav-link">Señales</a>
          <a href="#proyecto" className="nav-link">Proyecto</a>
        </div>
        <a href="#mundos" className="nav-cta">
          Explorar la plataforma
        </a>
        <button
          className="nav-burger"
          aria-label="Abrir menú"
          onClick={() => setOpen((v) => !v)}
        >
          <span /><span /><span />
        </button>
      </div>
      {open && (
        <div className="nav-mobile">
          <a href="#mundos" onClick={() => setOpen(false)}>Mundos</a>
          <a href="#senales" onClick={() => setOpen(false)}>Señales</a>
          <a href="#proyecto" onClick={() => setOpen(false)}>Proyecto</a>
          <a href="#mundos" className="nav-cta-mobile" onClick={() => setOpen(false)}>
            Explorar la plataforma
          </a>
        </div>
      )}
      <div className="nav-progress" aria-hidden>
        <div className="nav-progress-bar" style={{ transform: `scaleX(${progress})` }} />
      </div>
    </nav>
  );
}

/* ============================================================
   SECUENCIA DE CHAT Y ALERTAS
   ============================================================ */
type AlertType = { title: string; text: string; icon: React.ReactNode; side: "left" | "right"; isRisk?: boolean };
type MessageType = { id: string; text: string | null; sender: "left" | "right" | null; delay: number; alert?: AlertType };

const CHAT_SEQUENCE: MessageType[] = [
  { id: "s0", text: null, sender: null, delay: 500 },
  { id: "s1", text: "Holaa, vi tu partida. ¡Jugás re bien! jaja", sender: "left", delay: 1800 },
  { id: "s2", text: "sii, me costó un montón pasar ese nivel 😅", sender: "right", delay: 2400 },
  { 
    id: "s3", text: "Yo me trabé ahí. Sos re pro posta, ojalá jugara como vos", sender: "left", delay: 3000,
    alert: { title: "Halago excesivo", text: "Busca generar una conexión de confianza rápida y desmedida.", icon: <IconHeart size={12} color={C.blue} />, side: "left" } 
  },
  { id: "s4", text: "jaja gracias! es práctica nomás", sender: "right", delay: 2000 },
  { 
    id: "s5", text: "¿A qué hora te conectás a jugar? ¿Tus viejos te dejan estar hasta tarde?", sender: "left", delay: 3200,
    alert: { title: "Pregunta personal temprana", text: "Indaga sobre límites familiares para buscar momentos sin supervisión.", icon: <IconQuestion size={12} color={C.blue} />, side: "right" } 
  },
  { id: "s6", text: "depende, a la noche un rato a veces", sender: "right", delay: 2600 },
  { 
    id: "s7", text: "Qué bueno. Che, pasame tu WhatsApp, por acá el chat anda re mal", sender: "left", delay: 3200,
    alert: { title: "Cambio a canal privado", text: "Quiere llevar la charla a un entorno privado y más difícil de rastrear.", icon: <IconArrowSwitch size={12} color={C.blue} />, side: "right" } 
  },
  { id: "s8", text: "mm no sé, no le paso mi nro a gente que no conozco", sender: "right", delay: 2800 },
  { 
    id: "s9", text: "Dale no pasa nada. Queda entre nosotros, es nuestro secreto 😉", sender: "left", delay: 3200,
    alert: { title: "Pedido de secreto", text: "Intenta aislarte y evitar que pidas consejo a un adulto de confianza.", icon: <IconLock size={12} color={C.blue} />, side: "left" } 
  },
  { 
    id: "s10", text: null, sender: null, delay: 2000,
    alert: { isRisk: true, title: "Nivel de riesgo", text: "Detectamos 4 señales de alerta consecutivas en esta conversación.", icon: <IconShield size={12} color={C.white} />, side: "left" } 
  }
];

/* ============================================================
   MOTOR DOUBLE CHECK (Lógico + Visual)
   ============================================================ */
type ActiveAlert = {
  id: string;
  msgId: string;
  alert: AlertType;
  top: number;       // Card Y
  msgY: number;      // Message Y (para el conector)
  opacity: number;
};

function useSimulationEngine() {
  const [step, setStep] = useState(0);
  const [activeAlerts, setActiveAlerts] = useState<ActiveAlert[]>([]);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const phoneRef = useRef<HTMLDivElement>(null);
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const messagesRef = useRef<(HTMLDivElement | null)[]>([]);

  // Constantes de Layout
  const ALERT_HEIGHT = 90; 
  const GAP_Y = 16;
  const MSG_ANIMATION_TIME = 450; // Ms antes de disparar el check visual

  // 1. Avance Automático
  useEffect(() => {
    if (step >= CHAT_SEQUENCE.length - 1) {
      const timer = setTimeout(() => {
        setStep(0);
        setActiveAlerts([]);
      }, 10000);
      return () => clearTimeout(timer);
    }
    const nextDelay = CHAT_SEQUENCE[step + 1]?.delay || 2000;
    const timer = setTimeout(() => setStep((s) => s + 1), nextDelay);
    return () => clearTimeout(timer);
  }, [step]);

  // 2. Double Check Engine: Evalúa colisiones en el DOM real
  const evaluateAlertLayout = useCallback(() => {
    const msgData = CHAT_SEQUENCE[step];
    if (!msgData || !msgData.alert) return;

    // CHECK LÓGICO: ¿Ya existe?
    if (activeAlerts.some(a => a.msgId === msgData.id)) return;

    const msgEl = messagesRef.current[step];
    const containerEl = containerRef.current;
    if (!msgEl || !containerEl) return;

    // CHECK VISUAL: Mediciones DOM
    const msgRect = msgEl.getBoundingClientRect();
    const containerRect = containerEl.getBoundingClientRect();
    
    // Coordenada Y central del mensaje (relativo al hero container)
    const exactMsgY = (msgRect.top - containerRect.top) + (msgRect.height / 2);
    
    // Posición ideal inicial para la tarjeta (centrada con el mensaje)
    let idealCardTop = exactMsgY - (ALERT_HEIGHT / 2);

    // Detección de Colisiones (Double Check Layout)
    setActiveAlerts(prev => {
      const sameSide = prev.filter(a => a.alert.side === msgData.alert!.side);
      const lastPlaced = sameSide[sameSide.length - 1];

      if (lastPlaced) {
        const lastBottomEdge = lastPlaced.top + ALERT_HEIGHT + GAP_Y;
        if (idealCardTop < lastBottomEdge) {
          idealCardTop = lastBottomEdge; // Empujar hacia abajo si hay colisión
        }
      }

      return [...prev, {
        id: `alert-${msgData.id}`,
        msgId: msgData.id,
        alert: msgData.alert!,
        top: idealCardTop,
        msgY: exactMsgY,
        opacity: 1
      }];
    });
  }, [step, activeAlerts]);

  // Disparar evaluación después de que el mensaje se anima
  useEffect(() => {
    const msgData = CHAT_SEQUENCE[step];
    if (msgData?.alert) {
      const timer = setTimeout(() => {
        evaluateAlertLayout();
      }, MSG_ANIMATION_TIME);
      return () => clearTimeout(timer);
    }
  }, [step, evaluateAlertLayout]);

  // 3. Scroll Sync: Actualiza las líneas SVG si el usuario (o el auto-scroll) mueve el chat
  const handleChatScroll = useCallback(() => {
    setActiveAlerts(prev => prev.map(item => {
      const msgIndex = CHAT_SEQUENCE.findIndex(m => m.id === item.msgId);
      const msgEl = messagesRef.current[msgIndex];
      const containerEl = containerRef.current;
      if (!msgEl || !containerEl) return item;

      const msgRect = msgEl.getBoundingClientRect();
      const containerRect = containerEl.getBoundingClientRect();
      const newMsgY = (msgRect.top - containerRect.top) + (msgRect.height / 2);
      
      return { ...item, msgY: newMsgY };
    }));
  }, []);

  // Auto-scroll trigger
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [step]);

  return {
    step,
    activeAlerts,
    containerRef,
    phoneRef,
    chatScrollRef,
    messagesRef,
    handleChatScroll
  };
}

/* ============================================================
   MODAL DE AYUDA
   ============================================================ */
function HelpModal({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="help-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="help-modal-title"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="help-modal">
        <div className="help-modal-header">
          <h2 className="help-modal-title" id="help-modal-title">¿Necesitás ayuda?</h2>
          <button className="help-close-button" onClick={onClose} aria-label="Cerrar panel de ayuda">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
        </div>

        <div className="help-modal-content">
          <p className="help-intro">
            Si vos o alguien que conocés está atravesando una situación de grooming, no estás solo/a. Guardá la evidencia, no borres conversaciones y pedí ayuda a una persona adulta de confianza o a un canal especializado.
          </p>

          <div className="help-resources">
            <div className="help-resource-card">
              <p className="hrc-name">Línea 137</p>
              <p className="hrc-desc">Asistencia y acompañamiento ante situaciones de violencia sexual, familiar o grooming.</p>
              <div className="hrc-contacts">
                <a href="tel:137" className="hrc-link" aria-label="Llamar a la Línea 137">📞 137</a>
                <a href="https://wa.me/5491131331000" target="_blank" rel="noopener noreferrer" className="hrc-link" aria-label="WhatsApp Línea 137">WhatsApp +54 9 11 3133-1000</a>
              </div>
            </div>

            <div className="help-resource-card">
              <p className="hrc-name">Línea 102</p>
              <p className="hrc-desc">Servicio gratuito y confidencial de atención para niñas, niños y adolescentes.</p>
              <div className="hrc-contacts">
                <a href="tel:102" className="hrc-link" aria-label="Llamar a la Línea 102">📞 102</a>
              </div>
            </div>

            <div className="help-resource-card">
              <p className="hrc-name">Grooming Argentina</p>
              <p className="hrc-desc">Organización especializada en prevención y abordaje del grooming.</p>
              <div className="hrc-contacts">
                <a href="https://groomingarg.org/" target="_blank" rel="noopener noreferrer" className="hrc-link" aria-label="Sitio web de Grooming Argentina">groomingarg.org</a>
                <a href="mailto:contacto@groomingarg.org" className="hrc-link" aria-label="Email Grooming Argentina">contacto@groomingarg.org</a>
                <a href="https://wa.me/5491124811722" target="_blank" rel="noopener noreferrer" className="hrc-link" aria-label="WhatsApp Grooming Argentina">WhatsApp +54 9 11 2481-1722</a>
              </div>
            </div>
          </div>

          <div className="help-emergency">
            <strong>Si hay una emergencia o riesgo inmediato,</strong> contactá a los servicios de emergencia (911) o a una persona adulta de confianza.
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   PÁGINA PRINCIPAL
   ============================================================ */
export default function App() {
  const [helpOpen, setHelpOpen] = useState(false);

  const {
    step,
    activeAlerts,
    containerRef,
    phoneRef,
    chatScrollRef,
    messagesRef,
    handleChatScroll
  } = useSimulationEngine();

  // Scroll genérico para animaciones Reveal
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("active"); }),
      { threshold: 0.12 }
    );
    document.querySelectorAll(".reveal").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const isTyping = step < CHAT_SEQUENCE.length - 1 && CHAT_SEQUENCE[step + 1].sender === "left" && CHAT_SEQUENCE[step + 1].text !== null;

  return (
    <main className="safenet-main">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Space+Grotesk:wght@500;600;700&display=swap');
        html { scroll-behavior: smooth; }
        body { margin: 0; background: ${C.white}; -webkit-font-smoothing: antialiased; }
        .safenet-main { min-height: 100vh; color: ${C.blueDeep}; font-family: 'Inter', sans-serif; overflow-x: hidden; }
        .reveal { opacity: 0; transform: translateY(24px); transition: opacity .9s cubic-bezier(.16,1,.3,1), transform .9s cubic-bezier(.16,1,.3,1); }
        .reveal.active { opacity: 1; transform: translateY(0); }

        /* HERO LAYOUT */
        .hero { position: relative; padding: 140px 32px 100px; background: ${C.white}; overflow: hidden; }
        .hero-inner { max-width: 1280px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1.05fr; gap: 60px; align-items: center; position: relative; z-index: 2; }
        .hero-left { position: relative; z-index: 2; }
        .eyebrow { display: inline-block; font-size: 12px; font-weight: 700; letter-spacing: 2.2px; text-transform: uppercase; color: ${C.blue}; margin-bottom: 28px; }
        .hero-title { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: clamp(40px, 5.4vw, 76px); line-height: 1.02; letter-spacing: -2px; color: ${C.blueDark}; margin: 0 0 28px; text-transform: uppercase; }
        .hero-title .accent { color: ${C.blue}; }
        .hero-desc { font-size: 17px; line-height: 1.65; color: ${C.blueDark}; max-width: 540px; margin: 0 0 36px; font-weight: 400; }
        .btn { display: inline-flex; align-items: center; justify-content: center; gap: 10px; padding: 16px 28px; border-radius: 100px; font-size: 12.5px; font-weight: 700; letter-spacing: 1.4px; text-transform: uppercase; text-decoration: none; border: none; cursor: pointer; transition: all .3s cubic-bezier(.16,1,.3,1); }
        .btn-primary { background: ${C.blue}; color: ${C.white}; box-shadow: 0 6px 18px rgba(11,92,255,0.22); }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 12px 28px rgba(11,92,255,0.32); }

        /* MOTOR VISUAL Y COMPONENTES DEL CHAT */
        .hero-right { position: relative; height: 740px; display: flex; align-items: center; justify-content: center; }
        
        .phone { position: relative; width: 300px; height: 620px; background: #0a0a0a; border-radius: 44px; padding: 8px; box-shadow: 0 0 0 2px #1a1a1a, 0 30px 60px -20px rgba(11,21,56,0.35); z-index: 10; animation: sn-float 6s ease-in-out infinite; }
        @keyframes sn-float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        
        .phone-screen { width: 100%; height: 100%; background: ${C.white}; border-radius: 36px; overflow: hidden; display: flex; flex-direction: column; position: relative; }
        .phone-header { display: flex; align-items: center; justify-content: space-between; padding: 16px 14px 10px; border-bottom: 1px solid #eee; background: ${C.white}; z-index: 2; }
        .ph-user { display: flex; align-items: center; gap: 10px; }
        
        /* AVATAR ACTUALIZADO */
        .ph-avatar { width: 34px; height: 34px; position: relative; border-radius: 50%; }
        .ph-avatar img { width: 100%; height: 100%; border-radius: 50%; object-fit: cover; background: ${C.celesteMid}; display: block; }
        .ph-avatar::after { content: ""; position: absolute; bottom: -2px; right: -2px; width: 10px; height: 10px; border-radius: 50%; background: #22c55e; border: 2px solid ${C.white}; z-index: 2; }
        
        .ph-name { font-size: 13.5px; font-weight: 700; color: #111; line-height: 1.1; }
        .ph-online { font-size: 10.5px; color: ${C.textMute}; font-weight: 500; }
        
        .phone-chat { flex: 1; padding: 14px 12px; display: flex; flex-direction: column; gap: 10px; overflow-y: auto; scroll-behavior: smooth; z-index: 1; scrollbar-width: none; }
        .phone-chat::-webkit-scrollbar { display: none; }
        
        .chat-row { display: flex; align-items: flex-end; gap: 6px; max-width: 85%; opacity: 0; }
        .chat-row.left { align-self: flex-start; }
        .chat-row.right { align-self: flex-end; flex-direction: row-reverse; }
        @keyframes fadeUpIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .chat-row.animate-in { animation: fadeUpIn 0.4s cubic-bezier(0.16,1,0.3,1) forwards; }
        
        /* AVATAR CHAT ACTUALIZADO */
        .chat-avatar { width: 22px; height: 22px; border-radius: 50%; object-fit: cover; background: ${C.celesteMid}; flex-shrink: 0; display: block; }
        
        .chat-bubble { padding: 9px 14px; border-radius: 18px; font-size: 12.5px; line-height: 1.4; font-weight: 500; position: relative; }
        .chat-row.left .chat-bubble { background: #F1F3F4; color: #111; border-bottom-left-radius: 4px; }
        .chat-row.right .chat-bubble { background: ${C.blue}; color: ${C.white}; border-bottom-right-radius: 4px; }
        
        .chat-typing { align-self: flex-start; display: inline-flex; align-items: center; gap: 4px; padding: 12px 16px; background: #F1F3F4; border-radius: 18px; border-bottom-left-radius: 4px; margin-left: 28px; opacity: 0; animation: fadeUpIn 0.3s forwards; }
        .chat-typing span { width: 5px; height: 5px; border-radius: 50%; background: #6B7280; animation: typing 1.2s infinite; }
        .chat-typing span:nth-child(2) { animation-delay: .15s; }
        .chat-typing span:nth-child(3) { animation-delay: .3s; }
        @keyframes typing { 0%, 80%, 100% { transform: translateY(0); opacity: 0.4; } 40% { transform: translateY(-3px); opacity: 1; } }

        /* TARJETAS DINÁMICAS */
        @keyframes sn-scale-in { from { opacity: 0; transform: scale(0.9) translateY(10px); } to { opacity: 1; transform: scale(1) translateY(0); } }
        .alert-card {
          position: absolute; background: ${C.white}; border: 1px solid ${C.line}; border-radius: 12px; padding: 14px; width: 200px; z-index: 12;
          box-shadow: 0 14px 28px -10px rgba(11,21,56,0.18);
          animation: sn-scale-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          transition: top 0.4s cubic-bezier(0.16,1,.3,1);
        }
        .alert-card.ac-risk { background: ${C.blueDark}; border-color: ${C.blue}; color: ${C.white}; }
        .alert-card.ac-risk .ac-title { color: ${C.white}; }
        .alert-card.ac-risk .ac-text { color: rgba(255,255,255,0.8); }
        .alert-card.ac-risk .ac-icon { background: rgba(11,92,255,0.2); }
        
        .alert-card.left { right: calc(50% + 150px + 30px); }
        .alert-card.right { left: calc(50% + 150px + 30px); }
        
        .ac-head { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
        .ac-icon { width: 26px; height: 26px; background: ${C.celeste}; border-radius: 6px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .ac-title { font-size: 11px; font-weight: 700; letter-spacing: 0.8px; color: ${C.blueDeep}; text-transform: uppercase; line-height: 1.2; }
        .ac-text { font-size: 12px; color: ${C.textMute}; line-height: 1.45; font-weight: 500; }
        
        /* CONECTORES SVG */
        .connectors-layer { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; z-index: 5; }
        .svg-connector { fill: none; stroke: ${C.blue}; stroke-width: 1.5; stroke-dasharray: 4 4; stroke-dashoffset: 20; animation: sn-dash-draw 0.8s linear forwards; }
        @keyframes sn-dash-draw { to { stroke-dashoffset: 0; } }
        .svg-dot { fill: ${C.blue}; opacity: 0; animation: fadeUpIn 0.3s forwards 0.4s; }

        @media (max-width: 1024px) {
          .hero-inner { grid-template-columns: 1fr; text-align: center; }
          .hero-left { text-align: center; }
          .hero-right { height: 600px; }
          .alert-card, .connectors-layer { display: none; }
        }

        /* NAVBAR MOBILE CSS */
        .navbar { position: fixed; top: 0; left: 0; right: 0; z-index: 100; background: ${C.white}; border-bottom: 1px solid ${C.line}; transition: box-shadow .3s ease; }
        .navbar.scrolled { box-shadow: 0 4px 18px -10px rgba(11,21,56,0.12); }
        .nav-progress { position: absolute; left: 0; right: 0; bottom: -1px; height: 2px; background: transparent; overflow: hidden; pointer-events: none; }
        .nav-progress-bar { width: 100%; height: 100%; background: linear-gradient(90deg, ${C.blue} 0%, ${C.celesteMid} 100%); transform-origin: left center; transform: scaleX(0); transition: transform .15s linear; }
        .nav-inner { max-width: 1280px; margin: 0 auto; padding: 18px 32px; display: flex; align-items: center; justify-content: space-between; gap: 32px; }
        .nav-logo { font-family: 'Space Grotesk', 'Inter', sans-serif; font-weight: 700; font-size: 22px; color: ${C.blueDark}; letter-spacing: 1.5px; text-decoration: none; }
        .nav-links { display: flex; gap: 36px; }
        .nav-link { font-size: 14px; font-weight: 600; color: ${C.blueDeep}; text-decoration: none; transition: color .2s ease; position: relative; }
        .nav-link::after { content: ""; position: absolute; bottom: -4px; left: 0; width: 0; height: 2px; background: ${C.blue}; transition: width .25s ease; }
        .nav-link:hover { color: ${C.blue}; }
        .nav-link:hover::after { width: 100%; }
        .nav-cta { background: ${C.blue}; color: ${C.white}; padding: 12px 22px; border-radius: 100px; font-size: 12px; font-weight: 700; letter-spacing: 1.4px; text-transform: uppercase; text-decoration: none; transition: transform .25s ease, box-shadow .25s ease; box-shadow: 0 4px 14px rgba(11,92,255,0.18); }
        .nav-cta:hover { transform: translateY(-1px); box-shadow: 0 8px 22px rgba(11,92,255,0.28); }
        .nav-burger { display: none; background: transparent; border: 0; cursor: pointer; padding: 8px; }
        .nav-burger span { display: block; width: 22px; height: 2px; background: ${C.blueDark}; margin: 4px 0; border-radius: 2px; }
        .nav-mobile { display: none; }
        @media (max-width: 880px) {
          .nav-links, .nav-cta { display: none; }
          .nav-burger { display: block; }
          .nav-mobile { display: flex; flex-direction: column; gap: 8px; padding: 16px 32px 24px; background: ${C.white}; border-top: 1px solid ${C.line}; }
          .nav-mobile a { padding: 12px 0; font-size: 15px; font-weight: 600; color: ${C.blueDeep}; text-decoration: none; border-bottom: 1px solid ${C.line}; }
          .nav-cta-mobile { background: ${C.blue} !important; color: ${C.white} !important; border-radius: 100px; padding: 14px 22px !important; text-align: center; font-weight: 700 !important; font-size: 12px !important; margin-top: 8px; }
        }

        /* ESTADÍSTICAS */
        .stats { background: ${C.celeste}; padding: 72px 32px; position: relative; overflow: hidden; }
        .stats-inner { max-width: 1240px; margin: 0 auto; position: relative; }
        .stats-header { display: grid; grid-template-columns: 1.1fr 1fr; gap: 48px; align-items: end; margin-bottom: 36px; }
        .stats-title { font-family: 'Space Grotesk', 'Inter', sans-serif; font-size: clamp(26px, 3vw, 40px); font-weight: 700; color: ${C.blueDark}; letter-spacing: -1.4px; line-height: 1.06; margin: 10px 0 0; text-transform: uppercase; }
        .stats-title .accent { color: ${C.blue}; }
        .stats-lead { font-size: 14.5px; line-height: 1.6; color: ${C.blueDeep}; font-weight: 500; max-width: 440px; margin: 0; padding-bottom: 4px; }
        .stats-panel { position: relative; background: ${C.white}; border: 1px solid ${C.line}; border-radius: 14px; padding: 36px 40px 18px; box-shadow: 0 10px 30px -22px rgba(11,21,56,0.14); overflow: hidden; }
        .stats-panel::before { content: ""; position: absolute; top: 0; left: 40px; right: 40px; height: 2px; background: ${C.blue}; border-radius: 0 0 2px 2px; }
        .stats-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 0; }
        .stat-item { padding: 0 32px; position: relative; }
        .stat-item:first-child { padding-left: 0; }
        .stat-item:last-child { padding-right: 0; }
        .stat-item + .stat-item::before { content: ""; position: absolute; left: 0; top: 12%; bottom: 12%; width: 1px; background: ${C.line}; }
        .stat-head { display: flex; align-items: center; gap: 10px; margin-bottom: 14px; }
        .stat-index { font-size: 10.5px; font-weight: 700; color: ${C.blue}; letter-spacing: 1.6px; font-family: 'Space Grotesk', 'Inter', sans-serif; }
        .stat-dot { width: 5px; height: 5px; border-radius: 50%; background: ${C.celesteMid}; }
        .stat-tag { font-size: 10px; font-weight: 700; letter-spacing: 1.3px; color: ${C.textMute}; text-transform: uppercase; }
        .stat-number { font-family: 'Space Grotesk', 'Inter', sans-serif; font-weight: 700; font-size: clamp(30px, 3.4vw, 46px); line-height: 1; color: ${C.blueDark}; margin: 0 0 14px; letter-spacing: -1.5px; }
        .stat-text { font-size: 13.5px; line-height: 1.55; color: ${C.textMute}; font-weight: 500; margin: 0; max-width: 280px; }
        .stats-panel-footer { display: flex; align-items: center; justify-content: space-between; gap: 20px; margin-top: 32px; padding-top: 16px; border-top: 1px solid ${C.line}; }
        .stats-source-label { display: inline-flex; align-items: center; gap: 10px; font-size: 11px; color: ${C.textMute}; letter-spacing: 1.4px; text-transform: uppercase; font-weight: 700; }
        .stats-source-label::before { content: ""; width: 20px; height: 1px; background: ${C.blue}; }
        .stats-source-text { font-size: 12px; color: ${C.blueDeep}; font-weight: 600; letter-spacing: 0.2px; }
        @media (max-width: 1024px) {
          .stats-header { grid-template-columns: 1fr; gap: 18px; margin-bottom: 28px; align-items: start; }
          .stats-panel { padding: 32px 32px 16px; }
          .stats-panel::before { left: 32px; right: 32px; }
        }
        @media (max-width: 760px) {
          .stats { padding: 56px 24px; }
          .stats-panel { padding: 28px 24px 16px; border-radius: 12px; }
          .stats-panel::before { left: 24px; right: 24px; }
          .stats-grid { grid-template-columns: 1fr; gap: 0; }
          .stat-item { padding: 24px 0; }
          .stat-item:first-child { padding-top: 0; }
          .stat-item:last-child { padding-bottom: 0; }
          .stat-item + .stat-item { border-top: 1px solid ${C.line}; }
          .stat-item + .stat-item::before { display: none; }
          .stat-text { max-width: 100%; }
          .stats-panel-footer { flex-direction: column; align-items: flex-start; gap: 10px; }
        }

        /* METODOLOGIA / RECORRIDO */
        .methodology { padding: 80px 32px 84px; background: ${C.bgSoft}; position: relative; }
        .meth-inner { max-width: 1280px; margin: 0 auto; }
        .meth-header { text-align: center; margin-bottom: 48px; }
        .meth-title { font-family: 'Space Grotesk', 'Inter', sans-serif; font-size: clamp(28px, 3.5vw, 44px); font-weight: 700; color: ${C.blueDark}; letter-spacing: -1.2px; line-height: 1.1; margin: 10px 0 16px; text-transform: uppercase; }
        .meth-sub { font-size: 15px; color: ${C.blue}; max-width: 600px; margin: 0 auto; line-height: 1.65; font-weight: 500; }
        .meth-track { position: relative; display: grid; grid-template-columns: repeat(4, 1fr); gap: 32px; margin-bottom: 40px; }
        .meth-track::before { content: ""; position: absolute; top: 24px; left: 8%; right: 8%; height: 0; border-top: 2px dashed ${C.line}; z-index: 0; transform: scaleX(0); transform-origin: left center; transition: transform 1.2s cubic-bezier(.16,1,.3,1) .25s; }
        .meth-track.active::before { transform: scaleX(1); }
        .meth-step { position: relative; z-index: 1; transition: transform .35s cubic-bezier(.16,1,.3,1); }
        .meth-step:hover { transform: translateY(-4px); }
        .meth-num { display: inline-flex; align-items: center; justify-content: center; width: 48px; height: 48px; border-radius: 50%; background: ${C.white}; color: ${C.blue}; border: 2px solid ${C.celesteMid}; font-weight: 700; font-size: 15px; letter-spacing: 1px; margin-bottom: 20px; font-family: 'Space Grotesk', 'Inter', sans-serif; transition: all .35s ease; }
        .meth-step:hover .meth-num { transform: scale(1.05); box-shadow: 0 8px 20px -8px rgba(11,92,255,0.4); border-color: ${C.blue}; background: ${C.blue}; color: ${C.white}; }
        .meth-card-title { font-family: 'Space Grotesk', 'Inter', sans-serif; font-size: 16px; font-weight: 700; color: ${C.blueDark}; margin: 0 0 10px; text-transform: uppercase; }
        .meth-card-text { font-size: 13.5px; line-height: 1.6; color: ${C.textMute}; font-weight: 500; margin: 0; }
        .meth-banner { margin-top: 24px; background: ${C.white}; border: 1px solid ${C.line}; border-left: 4px solid ${C.blue}; border-radius: 12px; padding: 24px 32px; display: grid; grid-template-columns: 1fr auto; gap: 24px; align-items: center; box-shadow: 0 10px 30px -20px rgba(11,21,56,0.08); }
        .mb-title { font-family: 'Space Grotesk', 'Inter', sans-serif; font-size: 16px; font-weight: 700; color: ${C.blueDark}; margin: 0 0 6px; text-transform: uppercase; }
        .mb-title .accent { color: ${C.blue}; }
        .mb-text { font-size: 14px; color: ${C.textMute}; margin: 0; line-height: 1.6; }
        @media (max-width: 960px) {
          .meth-track { grid-template-columns: 1fr 1fr; gap: 40px; }
          .meth-track::before { display: none; }
          .meth-banner { grid-template-columns: 1fr; text-align: center; border-left: 1px solid ${C.line}; border-top: 4px solid ${C.blue}; }
        }
        @media (max-width: 560px) { .meth-track { grid-template-columns: 1fr; gap: 32px; } }

        /* MUNDOS */
        .worlds { padding: 110px 32px; background: ${C.white}; position: relative; overflow: hidden; }
        .worlds-inner { max-width: 1280px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1.2fr; gap: 80px; align-items: start; }
        .worlds-title { font-family: 'Space Grotesk', 'Inter', sans-serif; font-size: clamp(34px, 4.6vw, 60px); font-weight: 700; color: ${C.blueDark}; letter-spacing: -2px; line-height: 1.02; margin: 14px 0 14px; text-transform: uppercase; }
        .worlds-title .accent { color: ${C.blue}; }
        @media (max-width: 560px) { .worlds-title { letter-spacing: -1.2px; } }
        .worlds-underline { width: 90px; height: 3px; background: ${C.blue}; margin: 18px 0 28px; }
        .worlds-desc { font-size: 16px; line-height: 1.65; color: ${C.blueDark}; margin: 0 0 16px; max-width: 400px; }
        .worlds-list { display: flex; flex-direction: column; }
        .world-row { display: grid; grid-template-columns: 60px 1fr auto; gap: 24px; align-items: center; padding: 28px 0; border-top: 1px solid ${C.line}; text-decoration: none; transition: background .35s ease, padding .35s ease; position: relative; }
        .world-row:last-child { border-bottom: 1px solid ${C.line}; }
        .world-row:hover { background: linear-gradient(90deg, ${C.celeste} 0%, transparent 100%); padding-left: 16px; padding-right: 16px; }
        .wr-num { font-family: 'Space Grotesk', 'Inter', sans-serif; font-size: 28px; font-weight: 700; color: ${C.blue}; letter-spacing: -1px; transition: transform .35s cubic-bezier(.16,1,.3,1); }
        .world-row:hover .wr-num { transform: translateX(4px); }
        .wr-content { display: flex; flex-direction: column; gap: 6px; }
        .wr-title { font-size: 18px; font-weight: 800; color: ${C.blueDark}; letter-spacing: 1px; text-transform: uppercase; }
        .wr-desc { font-size: 14px; color: ${C.textMute}; line-height: 1.55; font-weight: 500; max-width: 460px; }
        .wr-cta { display: inline-flex; align-items: center; gap: 8px; padding: 10px 22px; border: 1.5px solid ${C.blue}; border-radius: 100px; color: ${C.blue}; font-size: 11px; font-weight: 700; letter-spacing: 1.6px; text-transform: uppercase; transition: all .25s ease; background: ${C.white}; flex-shrink: 0; }
        .wr-cta::after { content: "→"; display: inline-block; transform: translateX(0); transition: transform .3s cubic-bezier(.16,1,.3,1); font-size: 13px; }
        .world-row:hover .wr-cta::after { transform: translateX(4px); }
        .world-row:hover .wr-cta { background: ${C.blue}; color: ${C.white}; }
        @media (max-width: 1024px) { .worlds-inner { grid-template-columns: 1fr; gap: 50px; } }
        @media (max-width: 700px) {
          .worlds { padding: 80px 24px; }
          .world-row { grid-template-columns: 50px 1fr; grid-template-areas: "num content" "cta cta"; gap: 14px; padding: 22px 0; }
          .wr-num { grid-area: num; align-self: start; }
          .wr-content { grid-area: content; }
          .wr-cta { grid-area: cta; justify-self: stretch; justify-content: center; }
        }

        /* SOBRE EL PROYECTO */
        .about { padding: 64px 32px; background: ${C.celeste}; position: relative; overflow: hidden; }
        .about-inner { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: 0.85fr 1.15fr; gap: 56px; align-items: center; position: relative; z-index: 2; }
        .about-photo-wrap { position: relative; background: ${C.white}; border: 1px solid ${C.line}; border-radius: 16px; padding: 14px; box-shadow: 0 18px 40px -22px rgba(11,21,56,0.18); }
        .about-photo-wrap::before { content: ""; position: absolute; left: -10px; top: 22px; bottom: 22px; width: 3px; background: ${C.blue}; border-radius: 2px; opacity: 0; transform: translateX(-6px); transition: opacity .6s ease .35s, transform .6s cubic-bezier(.16,1,.3,1) .35s; }
        .about-inner.active .about-photo-wrap::before { opacity: 1; transform: translateX(0); }
        .about-inner.active .about-photo-wrap { animation: sn-fade-left .8s cubic-bezier(.16,1,.3,1) both; }
        .about-inner.active .about-content > * { animation: sn-fade-up .7s cubic-bezier(.16,1,.3,1) both; }
        .about-inner.active .about-content > *:nth-child(1) { animation-delay: .15s; }
        .about-inner.active .about-content > *:nth-child(2) { animation-delay: .25s; }
        .about-inner.active .about-content > *:nth-child(3) { animation-delay: .35s; }
        .about-inner.active .about-content > *:nth-child(4) { animation-delay: .45s; }
        .about-photo { display: block; width: 100%; height: auto; aspect-ratio: 4 / 5; object-fit: cover; border-radius: 10px; background: ${C.bgSoft}; }
        .about-title { font-family: 'Space Grotesk', 'Inter', sans-serif; font-size: clamp(26px, 3vw, 40px); font-weight: 700; color: ${C.blueDark}; letter-spacing: -1.4px; line-height: 1.06; margin: 10px 0 18px; text-transform: uppercase; }
        .about-text { font-size: 15px; line-height: 1.65; color: ${C.blueDeep}; font-weight: 500; margin: 0 0 22px; }
        .about-quote { border-left: 3px solid ${C.blue}; padding: 16px 22px; background: ${C.white}; border-radius: 8px; font-family: 'Space Grotesk', 'Inter', sans-serif; font-size: clamp(15px, 1.4vw, 17px); font-weight: 600; color: ${C.blueDark}; line-height: 1.45; margin: 0; }
        @media (max-width: 900px) {
          .about { padding: 56px 24px; }
          .about-inner { grid-template-columns: 1fr; gap: 28px; align-items: start; }
          .about-photo-wrap { max-width: 340px; margin: 0 auto; width: 100%; }
        }

        /* BOTÓN FLOTANTE DE AYUDA */
        .help-floating-button { position: fixed; bottom: 28px; right: 28px; z-index: 200; display: inline-flex; align-items: center; gap: 9px; padding: 14px 22px; background: ${C.blue}; color: ${C.white}; border: none; border-radius: 100px; font-size: 13px; font-weight: 700; letter-spacing: 1.2px; text-transform: uppercase; cursor: pointer; box-shadow: 0 8px 24px rgba(11,92,255,0.32); transition: transform .25s cubic-bezier(.16,1,.3,1), box-shadow .25s ease; font-family: 'Inter', sans-serif; }
        .help-floating-button:hover { transform: translateY(-3px); box-shadow: 0 14px 32px rgba(11,92,255,0.42); }
        .help-floating-button:focus-visible { outline: 3px solid ${C.blue}; outline-offset: 4px; }
        @media (max-width: 560px) { .help-floating-button { bottom: 20px; right: 16px; padding: 12px 18px; font-size: 12px; gap: 7px; } }

        /* MODAL DE AYUDA */
        .help-modal-overlay { position: fixed; inset: 0; z-index: 300; background: rgba(6,21,56,0.55); backdrop-filter: blur(3px); display: flex; align-items: flex-end; justify-content: flex-end; padding: 28px; }
        @media (max-width: 560px) { .help-modal-overlay { align-items: flex-end; justify-content: stretch; padding: 0; } }
        .help-modal { background: ${C.white}; border-radius: 16px; width: 100%; max-width: 480px; max-height: 90vh; overflow-y: auto; box-shadow: 0 24px 60px -12px rgba(6,21,56,0.38); animation: sn-scale-in 0.35s cubic-bezier(0.16,1,0.3,1) forwards; scrollbar-width: thin; scrollbar-color: ${C.line} transparent; }
        @media (max-width: 560px) { .help-modal { border-radius: 20px 20px 0 0; max-width: 100%; max-height: 88vh; } }
        .help-modal-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; padding: 28px 28px 0; }
        .help-modal-title { font-family: 'Space Grotesk', 'Inter', sans-serif; font-size: 22px; font-weight: 700; color: ${C.blueDark}; letter-spacing: -0.6px; line-height: 1.1; margin: 0; }
        .help-close-button { flex-shrink: 0; width: 32px; height: 32px; border-radius: 50%; background: ${C.bgSoft}; border: 1px solid ${C.line}; cursor: pointer; display: flex; align-items: center; justify-content: center; color: ${C.textMute}; transition: background .2s ease, color .2s ease; margin-top: 2px; }
        .help-close-button:hover { background: ${C.celeste}; color: ${C.blueDark}; }
        .help-close-button:focus-visible { outline: 3px solid ${C.blue}; outline-offset: 3px; }
        .help-modal-content { padding: 16px 28px 28px; }
        .help-intro { font-size: 14px; line-height: 1.65; color: ${C.blueDeep}; font-weight: 500; margin: 12px 0 24px; }
        .help-resources { display: flex; flex-direction: column; gap: 12px; margin-bottom: 20px; }
        .help-resource-card { border: 1px solid ${C.line}; border-radius: 12px; padding: 18px 20px; position: relative; overflow: hidden; }
        .help-resource-card::before { content: ""; position: absolute; top: 0; left: 0; bottom: 0; width: 3px; background: ${C.blue}; border-radius: 0 2px 2px 0; }
        .hrc-name { font-family: 'Space Grotesk', 'Inter', sans-serif; font-size: 13.5px; font-weight: 700; color: ${C.blueDark}; letter-spacing: 0.4px; text-transform: uppercase; margin: 0 0 4px; }
        .hrc-desc { font-size: 12.5px; color: ${C.textMute}; font-weight: 500; line-height: 1.5; margin: 0 0 10px; }
        .hrc-contacts { display: flex; flex-wrap: wrap; gap: 8px; }
        .hrc-link { display: inline-flex; align-items: center; gap: 5px; font-size: 12px; font-weight: 700; color: ${C.blue}; text-decoration: none; background: ${C.celeste}; padding: 5px 11px; border-radius: 100px; letter-spacing: 0.3px; transition: background .2s ease; white-space: nowrap; }
        .hrc-link:hover { background: #d0dbf7; }
        .help-emergency { background: ${C.bgSoft}; border: 1px solid ${C.line}; border-radius: 10px; padding: 14px 18px; font-size: 12.5px; color: ${C.textMute}; line-height: 1.6; font-weight: 500; }
        .help-emergency strong { color: ${C.blueDeep}; font-weight: 700; }

        /* FOOTER */
        .footer { background: ${C.blueDark}; padding: 80px 32px 40px; color: ${C.white}; }
        .footer-inner { max-width: 1280px; margin: 0 auto; }
        .footer-top { display: grid; grid-template-columns: 1.5fr 1fr; gap: 60px; padding-bottom: 50px; border-bottom: 1px solid rgba(255,255,255,0.1); }
        .footer-brand-name { font-family: 'Space Grotesk', 'Inter', sans-serif; font-size: 24px; font-weight: 700; letter-spacing: 1.8px; margin-bottom: 14px; }
        .footer-tag { font-size: 14px; color: rgba(255,255,255,255); max-width: 340px; line-height: 1.6; }
        .footer-links { display: flex; flex-direction: column; gap: 14px; align-items: flex-start; }
        .footer-links a { color: ${C.white}; font-size: 13px; font-weight: 600; letter-spacing: 1.4px; text-transform: uppercase; text-decoration: none; opacity: 0.75; transition: opacity .2s ease; }
        .footer-links a:hover { opacity: 1; }
        .footer-bottom { padding-top: 32px; font-size: 12.5px; color: rgba(255,255,255,0.45); text-align: center; letter-spacing: 0.3px; display: flex; flex-direction: column; align-items: center; gap: 10px; }
        .footer-linkedin { color: rgba(255,255,255,0.55); font-size: 12.5px; text-decoration: none; letter-spacing: 0.3px; transition: color .2s ease; }
        .footer-linkedin:hover { color: ${C.white}; }
        @media (max-width: 700px) { .footer-top { grid-template-columns: 1fr; gap: 40px; } .footer { padding: 60px 24px 30px; } }
      `}</style>

      <Navbar />

      {/* ============================================================
          1. HERO
          ============================================================ */}
      <section className="hero">
        <div className="hero-orb o1" aria-hidden />
        <div className="hero-orb o2" aria-hidden />
        <PlusMark top={120} left={"6%"} size={16} opacity={0.45} />
        <PlusMark top={"22%"} left={"42%"} size={14} opacity={0.35} />
        <PlusMark top={"60%"} left={"4%"} size={14} opacity={0.35} />
        <PlusMark top={180} right={"3%"} size={16} opacity={0.4} />
        <PlusMark top={"68%"} right={"38%"} size={12} opacity={0.3} />

        <div className="hero-inner">
          <div className="hero-left reveal">
            <span className="eyebrow">Educación digital para prevenir el grooming</span>
            <h1 className="hero-title">
              Aprendé a reconocer el <span className="accent">grooming</span> antes de que sea tarde
            </h1>
            <p className="hero-desc">
              SafeNet transforma situaciones digitales reales en experiencias interactivas para que niños, adolescentes, familias y docentes aprendan a detectar señales de riesgo, actuar con criterio y pedir ayuda a tiempo.
            </p>
            <div className="hero-actions">
              <a href="#mundos" className="btn btn-primary">Explorar la plataforma</a>
            </div>
          </div>

          <div className="hero-right reveal" ref={containerRef}>
            
            {/* CAPA DE CONECTORES SVG */}
            <svg className="connectors-layer">
              {activeAlerts.map(item => {
                if (item.alert.isRisk) return null;
                const isLeft = item.alert.side === "left";
                const containerW = containerRef.current?.offsetWidth || 0;
                
                const cardX = isLeft ? (containerW / 2) - 180 : (containerW / 2) + 180;
                const cardY = item.top + 45; 
                
                const msgX = isLeft ? (containerW / 2) - 150 : (containerW / 2) + 150;
                const msgY = item.msgY;

                const cp1x = cardX + (isLeft ? 40 : -40);
                const cp2x = msgX + (isLeft ? -40 : 40);
                const pathD = `M ${cardX} ${cardY} C ${cp1x} ${cardY}, ${cp2x} ${msgY}, ${msgX} ${msgY}`;

                return (
                  <g key={`conn-${item.id}`}>
                    <path d={pathD} className="svg-connector" />
                    <circle cx={msgX + (isLeft ? 4 : -4)} cy={msgY} r="3.5" className="svg-dot" />
                    <circle cx={cardX + (isLeft ? -4 : 4)} cy={cardY} r="3.5" className="svg-dot" />
                  </g>
                );
              })}
            </svg>

            {/* TARJETAS RENDERIZADAS POR EL MOTOR */}
            {activeAlerts.map(item => (
              <div
                key={item.id}
                className={`alert-card ${item.alert.side} ${item.alert.isRisk ? 'ac-risk' : ''}`}
                style={{ top: item.top }}
              >
                <div className="ac-head">
                  <span className="ac-icon">{item.alert.icon}</span>
                  <span className="ac-title">{item.alert.title}</span>
                </div>
                <div className="ac-text">{item.alert.text}</div>
              </div>
            ))}

            {/* TELÉFONO */}
            <div className="phone" ref={phoneRef}>
              <div className="phone-screen">
                <div className="phone-header">
                  <div className="ph-user">
                    <div className="ph-avatar">
                      <img src="/avatar.png" alt="Avatar de jose_alvarez" />
                    </div>
                    <div>
                      <div className="ph-name">jose_alvarez</div>
                      <div className="ph-online">En línea</div>
                    </div>
                  </div>
                </div>
                
                {/* CHAT CONTAINER */}
                <div className="phone-chat" ref={chatScrollRef} onScroll={handleChatScroll}>
                  {CHAT_SEQUENCE.map((item, index) => {
                    if (index === 0 || index > step || !item.text) return null;
                    return (
                      <div 
                        key={item.id} 
                        className={`chat-row ${item.sender} animate-in`}
                        ref={el => { messagesRef.current[index] = el; }}
                      >
                        {item.sender === "left" && (
                          <img src="/avatar.png" alt="Avatar de jose_alvarez" className="chat-avatar" />
                        )}
                        <div className="chat-bubble">{item.text}</div>
                      </div>
                    );
                  })}
                  
                  {isTyping && (
                    <div className="chat-typing">
                      <span /><span /><span />
                    </div>
                  )}
                  {/* Anchor para scroll suave */}
                  <div style={{ height: 10, flexShrink: 0 }} />
                </div>

                {/* Input mock */}
                <div style={{ padding: "12px", borderTop: "1px solid #eee", background: C.white, display: "flex", gap: 8 }}>
                  <div style={{ flex: 1, background: "#F1F3F4", borderRadius: 100, height: 32, display: "flex", alignItems: "center", padding: "0 12px", fontSize: 12, color: "#9CA3AF" }}>Mensaje...</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ============================================================
          2. ESTADÍSTICAS
          ============================================================ */}
      <section id="senales" className="stats">
        <PlusMark top={64} left={"4%"} opacity={0.45} />
        <PlusMark top={"38%"} left={"2%"} opacity={0.3} />
        <PlusMark bottom={80} left={"6%"} opacity={0.4} />
        <PlusMark top={70} right={"5%"} opacity={0.45} />
        <PlusMark top={"50%"} right={"3%"} opacity={0.3} />
        <PlusMark bottom={60} right={"8%"} opacity={0.35} />

        <div className="stats-inner">
          <div className="stats-header reveal">
            <div>
              <span className="eyebrow">Por qué es urgente</span>
              <h2 className="stats-title">
                El riesgo empieza antes de que <span className="accent">parezca peligroso</span>
              </h2>
            </div>
            <p className="stats-lead">
              Los datos muestran que el riesgo no empieza cuando aparece una amenaza explícita, sino mucho antes: en el desconocimiento, la naturalización del contacto con desconocidos y la falta de herramientas para detectar señales tempranas.
            </p>
          </div>

          <div className="stats-panel reveal">
            <div className="stats-grid">
              <article className="stat-item">
                <div className="stat-head">
                  <span className="stat-index">01</span>
                  <span className="stat-dot" />
                  <span className="stat-tag">Desconocimiento</span>
                </div>
                <h3 className="stat-number">7 de cada 10</h3>
                <p className="stat-text">Niñas, niños y adolescentes no saben qué es el grooming, según el informe regional de Grooming LATAM 2024/2025.</p>
              </article>

              <article className="stat-item">
                <div className="stat-head">
                  <span className="stat-index">02</span>
                  <span className="stat-dot" />
                  <span className="stat-tag">Contacto</span>
                </div>
                <h3 className="stat-number">6 de cada 10</h3>
                <p className="stat-text">Mantuvieron conversaciones con desconocidos a través de redes sociales y/o juegos online.</p>
              </article>

              <article className="stat-item">
                <div className="stat-head">
                  <span className="stat-index">03</span>
                  <span className="stat-dot" />
                  <span className="stat-tag">Brecha digital</span>
                </div>
                <h3 className="stat-number">64,9%</h3>
                <p className="stat-text">Considera saber más de tecnología que sus padres o tutores. SafeNet parte de esa brecha: usar redes, apps o juegos no siempre significa saber reconocer riesgos, cuidar la privacidad o pedir ayuda a tiempo.</p>
              </article>
            </div>

            <div className="stats-panel-footer">
              <span className="stats-source-label">Fuente estadística</span>
              <span className="stats-source-text">
                <a
                  href="https://www.groomingarg.org/wp-content/uploads/2025/05/INFORME-2024-2025-GROOMING-LATAM.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "inherit", textDecoration: "underline", textUnderlineOffset: "3px" }}
                >
                  Informe Grooming LATAM 2024/2025
                </a>
                {" · "}Red Grooming LATAM / Grooming Argentina
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          3. UN RECORRIDO SIMPLE
          ============================================================ */}
      <section className="methodology">
        <PlusMark top={120} left={"3%"} opacity={0.4} />
        <PlusMark top={"50%"} right={"3%"} opacity={0.4} />
        <PlusMark bottom={120} left={"7%"} opacity={0.35} />

        <div className="meth-inner">
          <div className="meth-header reveal">
            <span className="eyebrow">Recorrido SafeNet</span>
            <h2 className="meth-title">Un recorrido simple para aprender a actuar</h2>
            <p className="meth-sub">
              Cuatro pasos cortos para reconocer señales de grooming, tomar decisiones seguras y aprender mediante experiencias interactivas.
            </p>
          </div>

          <div className="meth-track reveal">
            <div className="meth-step stagger" style={{ ['--d' as any]: '0ms' }}>
              <span className="meth-num">01</span>
              <div className="meth-card">
                <h4 className="meth-card-title">Reconocé señales</h4>
                <p className="meth-card-text">Identificá pistas visuales y de texto en perfiles, mensajes y conversaciones cotidianas.</p>
              </div>
            </div>
            
            <div className="meth-step stagger" style={{ ['--d' as any]: '120ms' }}>
              <span className="meth-num">02</span>
              <div className="meth-card">
                <h4 className="meth-card-title">Tomá decisiones</h4>
                <p className="meth-card-text">Elegí respuestas seguras frente a simulaciones inspiradas en redes sociales reales.</p>
              </div>
            </div>
            
            <div className="meth-step stagger" style={{ ['--d' as any]: '240ms' }}>
              <span className="meth-num">03</span>
              <div className="meth-card">
                <h4 className="meth-card-title">Recibí feedback</h4>
                <p className="meth-card-text">Entendé qué señales detectaste y por qué importan en cada situación de riesgo.</p>
              </div>
            </div>
            
            <div className="meth-step stagger" style={{ ['--d' as any]: '360ms' }}>
              <span className="meth-num">04</span>
              <div className="meth-card">
                <h4 className="meth-card-title">Aprendé a cuidarte</h4>
                <p className="meth-card-text">Construí criterio analítico para reconocer peligros digitales y pedir ayuda a tiempo.</p>
              </div>
            </div>
          </div>

          <div className="meth-banner reveal stagger" style={{ ['--d' as any]: '480ms' }}>
            <div>
              <p className="mb-title">SafeNet no busca asustar: <span className="accent">busca entrenar criterio.</span></p>
              <p className="mb-text">A través de ejemplos realistas, cada usuario aprende a detectar señales y responder de forma segura.</p>
            </div>
            <a href="#mundos" className="btn btn-dark">
              Explorar la plataforma <IconArrowRight size={14} color={C.white} />
            </a>
          </div>
        </div>
      </section>

      {/* ============================================================
          4. MUNDOS
          ============================================================ */}
      <section id="mundos" className="worlds">
        <PlusMark top={80} left={"30%"} opacity={0.4} />
        <PlusMark top={"40%"} left={"38%"} opacity={0.3} />
        <PlusMark bottom={120} left={"22%"} opacity={0.35} />
        <PlusMark top={140} right={"6%"} opacity={0.3} />

        <div className="worlds-inner">
          <div className="reveal">
            <span className="eyebrow">Espacios de aprendizaje</span>
            <h2 className="worlds-title">
              Elegí cómo querés aprender a <span className="accent">cuidarte</span>
            </h2>
            <div className="worlds-underline" />
            <p className="worlds-desc">SafeNet adapta cada experiencia según la edad, el rol y el contexto de quien la usa.</p>
            <p className="worlds-desc">Cada mundo propone una forma distinta de aprender: jugar, detectar señales, conversar o acompañar.</p>
          </div>

          <div className="worlds-list reveal">
            {[
              ["01", "Niños", "Aprender jugando, con decisiones simples, señales claras y situaciones pensadas para la edad.", "/ninos"],
              ["02", "Adolescentes", "Simulaciones realistas inspiradas en redes sociales, chats y perfiles digitales cotidianos.", "/adolescentes"],
              ["03", "Familias", "Herramientas para conversar, acompañar y actuar a tiempo frente a señales de alerta.", "/familias"],
              ["04", "Docentes", "Recursos para trabajar la prevención en el aula con criterio institucional y enfoque educativo.", "/docentes"],
            ].map(([num, title, desc, href]) => (
              <a href={href} className="world-row" key={title}>
                <span className="wr-num">{num}</span>
                <div className="wr-content">
                  <span className="wr-title">{title}</span>
                  <span className="wr-desc">{desc}</span>
                </div>
                <span className="wr-cta">Entrar</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          5. SOBRE EL PROYECTO
          ============================================================ */}
      <section id="proyecto" className="about">
        <PlusMark top={70} left={"4%"} opacity={0.4} />
        <PlusMark bottom={60} right={"6%"} opacity={0.4} />
        <PlusMark top={"50%"} right={"3%"} opacity={0.3} />

        <div className="about-inner reveal">
          <div className="about-photo-wrap">
            <img
              src="/foto_mia.png"
              alt="Autor del proyecto SafeNet"
              className="about-photo"
            />
          </div>
          <div className="about-content">
            <span className="eyebrow">Sobre el proyecto</span>
            <h2 className="about-title">UNA MOTIVACIÓN PERSONAL CON IMPACTO PREVENTIVO</h2>
            <p className="about-text">
              Soy Magalí Sarmiento, estudiante de la Licenciatura en Ciberseguridad y creadora de SAFENET.
            </p>
            <p className="about-text">
              Mi interés por el grooming no surgió de manera casual. Hace algunos años, durante una tesina del colegio secundario, investigué por primera vez esta problemática y desde entonces la entendí como una amenaza urgente, poco visibilizada y profundamente humana.
            </p>
            <p className="about-text">
              Con el tiempo, mi formación en Ciberseguridad reforzó esa mirada: proteger en el mundo digital no se trata solo de sistemas, redes o herramientas técnicas, sino también de cuidar a las personas, generar conciencia y prevenir riesgos reales.
            </p>
            <p className="about-text">
              SAFENET refleja esa forma de entender la ciberseguridad. No lo pienso únicamente como un proyecto académico, sino como una propuesta con sentido, capaz de unir mi recorrido, mi compromiso con la prevención y mi interés por construir soluciones que puedan ayudar a otros.
            </p>
            <p className="about-text">
              Su propósito es acercar información clara, experiencias interactivas y herramientas educativas para que niños, adolescentes, familias y docentes puedan reconocer señales de riesgo, tomar mejores decisiones y pedir ayuda a tiempo.
            </p>
          </div>
        </div>
      </section>

      {/* BOTÓN FLOTANTE DE AYUDA */}
      <button
        className="help-floating-button"
        onClick={() => setHelpOpen(true)}
        aria-label="Abrir panel de ayuda ante situaciones de grooming"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
        Necesito ayuda
      </button>

      {helpOpen && <HelpModal onClose={() => setHelpOpen(false)} />}

      {/* ============================================================
          6. FOOTER
          ============================================================ */}
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-top">
            <div>
              <div className="footer-brand-name">SAFENET</div>
              <p className="footer-tag">Plataforma educativa de prevención del grooming.</p>
            </div>
            <div className="footer-links">
              <a href="#mundos">Mundos</a>
              <a href="#senales">Señales</a>
              <a href="#proyecto">Proyecto</a>
            </div>
          </div>
          <div className="footer-bottom">
            © 2026 SAFENET. Trabajo Final de Grado · Licenciatura en Ciberseguridad
            <a
              href="https://www.linkedin.com/in/magalisarmientoo"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-linkedin"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="currentColor" style={{display:'inline-block',verticalAlign:'middle',marginRight:'6px'}}>
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              linkedin.com/in/magalisarmientoo
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}