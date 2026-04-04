"use client";

import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';

type Avatar = {
  id: string;
  name: string;
  accent: string;
  bg: string;
};

const avatars: Avatar[] = [
  { id: "a1", name: "Guardia", accent: "#74B3CE", bg: "rgba(116, 179, 206, 0.15)" },
  { id: "a2", name: "Rayo",    accent: "#FFD700", bg: "rgba(255, 215, 0, 0.15)" },
  { id: "a3", name: "Nova",    accent: "#A5D2E5", bg: "rgba(165, 210, 229, 0.15)" },
  { id: "a4", name: "Turbo",   accent: "#FFFFFF", bg: "rgba(255, 255, 255, 0.1)" },
];

/* ── STYLIZED CHARACTER ICON ── */
const CharacterVisual = ({ accent, size = 40 }: { accent: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="12" y="8" width="16" height="16" rx="4" fill={accent} fillOpacity="0.9" />
    <path d="M8 32C8 28.6863 10.6863 26 14 26H26C29.3137 26 32 28.6863 32 32V36H8V32Z" fill={accent} fillOpacity="0.7" />
    <circle cx="17" cy="14" r="1.5" fill="#051024" />
    <circle cx="23" cy="14" r="1.5" fill="#051024" />
  </svg>
);

/* ── PARTICLE NETWORK ── */
const ParticleNetwork = () => {
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
    const particles: any[] = [];
    const count = 50;
    class Particle {
      x: number; y: number; vx: number; vy: number;
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
      }
      update() {
        this.x += this.vx; this.y += this.vy;
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
      }
      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(116, 179, 206, 0.3)";
        ctx.fill();
      }
    }
    for (let i = 0; i < count; i++) particles.push(new Particle());
    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach(p => { p.update(); p.draw(); });
      for (let i = 0; i < count; i++) {
        for (let j = i + 1; j < count; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(116, 179, 206, ${0.1 * (1 - dist / 150)})`;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(animate);
    };
    animate();
    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }} />;
};

/* ── REFINED UI COMPONENTS ── */

function FeedbackBox({ message, type }: { message: string; type: 'success' | 'danger' | 'info' }) {
  const styles = {
    success: { bg: 'rgba(39, 174, 96, 0.15)', border: 'rgba(39, 174, 96, 0.4)', color: '#A9DFBF' },
    danger: { bg: 'rgba(255, 60, 80, 0.15)', border: 'rgba(255, 60, 80, 0.4)', color: '#FF8A95' },
    info: { bg: 'rgba(116, 179, 206, 0.15)', border: 'rgba(116, 179, 206, 0.4)', color: '#A5D2E5' },
  };
  const s = styles[type];
  return (
    <div style={{
      background: s.bg, border: `1px solid ${s.border}`, color: s.color,
      padding: '10px 16px', borderRadius: '10px', fontSize: '13px', lineHeight: 1.4,
      animation: 'slideUpIn 0.4s ease-out forwards', margin: '10px 0'
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
      background: 'rgba(255, 215, 0, 0.95)', color: '#051024', padding: '8px 16px', borderRadius: '8px',
      fontFamily: "'Altone', sans-serif", fontSize: '14px', fontWeight: 'bold',
      boxShadow: '0 5px 15px rgba(255,215,0,0.2)', border: '1px solid #FFF',
      animation: 'xpPop 1.8s ease-out forwards',
    }}>+{amount} XP</div>
  );
}

function MissionBar({ label, current, max, color }: { label: string; current: number; max: number; color: string }) {
  const pct = Math.min(100, Math.round((current / max) * 100));
  return (
    <div style={{ marginBottom: '12px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', fontWeight: 'bold', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.8 }}>
        <span style={{ color: '#FFFFFF' }}>{label}</span><span style={{ color }}>{pct}%</span>
      </div>
      <div style={{ height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '99px', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: color, transition: 'width 0.8s ease' }} />
      </div>
    </div>
  );
}

/* ════════════════════════════════
   MODULES LOGIC
════════════════════════════════ */

const chatScript = [
  { from: 'stranger', text: '¡Hola! Vi que jugás muy bien. ¿Cómo te llamás?' },
  { from: 'stranger', text: 'Yo soy ProGamer99. Tengo 13 años igual que vos. Podemos ser equipo.' },
  { from: 'stranger', text: 'Oye, ¿tenés Discord o WhatsApp? Así coordinamos mejor las partidas.' },
  { from: 'stranger', text: 'Dale, te juro que soy buena onda. Solo necesito tu foto para ponerte en el equipo.' },
  { from: 'stranger', text: '¡Sos muy bueno! Te voy a regalar todas mis skins si me mandás tu dirección.' },
];

const chatChoices: Record<number, any[]> = {
  0: [
    { text: '¡Hola! Soy GamerPro_X', isSafe: false, points: 0, consequence: '⚠️ No compartas tu nombre con desconocidos.', consequenceType: 'danger' },
    { text: 'Hola, prefiero no decirte mi nombre', isSafe: true, points: 30, consequence: '✅ ¡Excelente! Tu nombre es privado.', consequenceType: 'success' },
  ],
  1: [
    { text: '¡Qué copado, jugamos juntos!', isSafe: false, points: 0, consequence: '⚠️ Los desconocidos pueden mentir sobre su edad.', consequenceType: 'danger' },
    { text: 'No sé si sos quien decís ser...', isSafe: true, points: 30, consequence: '🌟 ¡Muy inteligente! Desconfiar te protege.', consequenceType: 'success' },
  ],
  2: [
    { text: 'Sí, mi WhatsApp es...', isSafe: false, points: 0, consequence: '🚨 ¡Nunca des tu teléfono a desconocidos!', consequenceType: 'danger' },
    { text: 'No, solo hablo dentro del juego', isSafe: true, points: 40, consequence: '⭐ ¡Perfecto! Hablar solo en el juego es seguro.', consequenceType: 'success' },
  ],
  3: [
    { text: 'Ok, te mando una...', isSafe: false, points: 0, consequence: '🚨 ¡Peligro! Nunca envíes fotos a desconocidos.', consequenceType: 'danger' },
    { text: 'No. Esto es raro. ¡Te bloqueo! 🛡️', isSafe: true, points: 50, consequence: '🏆 ¡Héroe! Bloquear es la mejor defensa.', consequenceType: 'success' },
  ],
  4: [
    { text: '¡Qué bueno! Te paso mi dirección', isSafe: false, points: 0, consequence: '🚨 ¡Peligro máximo! Jamás des tu dirección.', consequenceType: 'danger' },
    { text: 'Algo está mal. Aviso a un adulto', isSafe: true, points: 50, consequence: '🏆 ¡Perfecto! Pedí ayuda siempre que dudes.', consequenceType: 'success' },
  ],
};

const scenarios: any[] = [
  { id: 1, level: 1, emoji: '💬', situation: 'Un amigo te invita a un chat con adultos desconocidos. Dicen: "es un secreto nuestro". ¿Qué hacés?', options: [{ text: 'Me quedo a ver qué pasa', isSafe: false, points: 0, feedback: '🚨 Los secretos con desconocidos son peligrosos.', feedbackType: 'danger' }, { text: 'Me salgo y aviso a mamá o papá', isSafe: true, points: 40, feedback: '🏆 ¡Excelente! Contar lo que pasa te protege.', feedbackType: 'success' }, { text: 'Le pregunto a mi amigo si es seguro', isSafe: false, points: 15, feedback: '⚠️ Cuidado: tu amigo también puede estar engañado.', feedbackType: 'info' }] },
  { id: 2, level: 1, emoji: '🎮', situation: 'Un desconocido te regala una skin si le mandás una foto tuya sonriendo. ¿Aceptás?', options: [{ text: 'Le mando la foto', isSafe: false, points: 0, feedback: '🚨 Nunca mandes fotos a gente que no conocés.', feedbackType: 'danger' }, { text: 'Le digo que no y lo reporto', isSafe: true, points: 50, feedback: '⭐ ¡Perfecto! Reportar protege a toda la comunidad.', feedbackType: 'success' }] },
];

/* ── MODULE UI REFACTOR ── */

function ChatModule({ onComplete, onXp }: any) {
  const [history, setHistory] = useState<any[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [phase, setPhase] = useState<'playing' | 'result'>('playing');
  const [showXp, setShowXp] = useState(0);
  const chatRef = useRef<HTMLDivElement>(null);

  // Initialize first message
  useEffect(() => {
    if (history.length === 0) setHistory([chatScript[0]]);
  }, []);

  useEffect(() => { if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight; }, [history, isTyping]);

  const handleChoice = (choice: any) => {
    // Add user message
    const newHistory = [...history, { from: 'player', text: choice.text }];
    // Add feedback as system message
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
    <div style={{ textAlign: 'center' }}>
      <h3 style={{ fontFamily: "'LEMON MILK', sans-serif", fontSize: '20px', color: '#74B3CE', marginBottom: '16px' }}>¡MISIÓN COMPLETADA!</h3>
      <div style={{ fontSize: '38px', fontWeight: 'bold', color: '#FFFFFF', marginBottom: '24px' }}>{totalPoints} pts</div>
      <button onClick={() => onComplete(totalPoints)} className="btn-game" style={{ padding: '16px 32px', borderRadius: '12px', background: '#74B3CE', color: '#FFFFFF', border: 'none', fontSize: '13px', fontWeight: 'bold' }}>RECLAMAR XP</button>
    </div>
  );

  return (
    <div>
      {showXp > 0 && <XpPop amount={showXp} onDone={() => setShowXp(0)} />}
      <MissionBar label="Seguridad del Chat" current={currentStep} max={5} color="#74B3CE" />
      <div ref={chatRef} style={{ background: "rgba(0,0,0,0.4)", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.05)", padding: "20px", marginBottom: "20px", maxHeight: "300px", overflowY: 'auto', display: "flex", flexDirection: "column", gap: "10px" }}>
        {history.map((m, i) => (
          <div key={i} style={{ animation: 'slideUpIn 0.3s ease' }}>
            {m.from === 'stranger' && (
              <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(116,179,206,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CharacterVisual accent="#74B3CE" size={20} />
                </div>
                <div style={{ background: "rgba(116, 179, 206, 0.12)", border: '1px solid rgba(116,179,206,0.1)', padding: "8px 12px", borderRadius: "14px 14px 14px 2px", fontSize: "14px", color: '#FFFFFF', maxWidth: '85%' }}>{m.text}</div>
              </div>
            )}
            {m.from === 'player' && (
               <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <div style={{ background: "rgba(255, 255, 255, 0.05)", border: '1px solid rgba(255,255,255,0.1)', padding: "8px 12px", borderRadius: "14px 14px 2px 14px", fontSize: "14px", color: '#74B3CE', maxWidth: '85%' }}>{m.text}</div>
               </div>
            )}
            {m.from === 'system' && (
              <FeedbackBox message={m.text} type={m.type} />
            )}
          </div>
        ))}
        {isTyping && <div style={{ color: '#74B3CE', fontSize: '18px', paddingLeft: '38px', animation: 'typingDot 1s infinite' }}>•••</div>}
      </div>
      {!isTyping && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {chatChoices[currentStep]?.map((c, i) => (
            <button key={i} onClick={() => handleChoice(c)} className="btn-game" style={{ padding: '12px 16px', borderRadius: '10px', textAlign: 'left', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', color: 'white', textTransform: 'none', fontSize: '13px' }}>{c.text}</button>
          ))}
        </div>
      )}
    </div>
  );
}

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
      <MissionBar label="Toma de Decisiones" current={idx} max={scenarios.length} color="#74B3CE" />
      <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '16px', padding: '24px', marginBottom: '20px', border: '1px solid rgba(255,255,255,0.08)', textAlign: 'center' }}>
        <p style={{ fontSize: '15px', color: '#FFFFFF', lineHeight: 1.6, margin: 0 }}>{scenarios[idx].situation}</p>
      </div>

      {feedback && <FeedbackBox message={feedback.text} type={feedback.type} />}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: feedback ? '10px' : '20px' }}>
        {scenarios[idx].options.map((o: any, i: number) => (
          <button key={i} onClick={() => handleAnswer(o)} disabled={!!feedback} className="btn-game" style={{ padding: '12px 16px', borderRadius: '10px', textAlign: 'left', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', color: 'white', textTransform: 'none', fontSize: '13px', opacity: !!feedback ? 0.5 : 1 }}>{o.text}</button>
        ))}
      </div>
    </div>
  );
}

/* ════════════════════════════════
   MAIN PAGE
════════════════════════════════ */
export default function NinosPage() {
  const [view, setView] = useState<'intro' | 'setup' | 'world'>('intro');
  const [nickname, setNickname] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState("a1");
  const [xp, setXp] = useState(0);
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const [completedModules, setCompletedModules] = useState<Set<string>>(new Set());

  const mainBlue = "#74B3CE";
  const darkBlueAlt = "#5A99B4";
  const brandGradient = `linear-gradient(90deg, #FFFFFF 0%, ${mainBlue} 55%, #FFFFFF 100%)`;
  const activeAvatar = useMemo(() => avatars.find((a) => a.id === selectedAvatar) ?? avatars[0], [selectedAvatar]);

  const handleXp = useCallback((n: number) => setXp(p => p + n), []);
  const handleComplete = (id: string, pts: number) => {
    setCompletedModules(p => new Set([...p, id]));
    setActiveModule(null);
  };

  const missions = [
    { id: 'chat', title: 'Misión 1: Chat Sospechoso', desc: 'Un desconocido te contacta en tu juego favorito. ¿Detectarás sus verdaderas intenciones?', xp: 200 },
    { id: 'decisions', title: 'Misión 2: Decisiones Reales', desc: 'Enfrenta situaciones del día a día y elige el camino más seguro para ganar XP.', xp: 250 },
    { id: 'security', title: 'Misión 3: Escudo Digital', desc: 'Configura tu perfil ideal protegiendo tus datos y tu privacidad de forma experta.', xp: 150 },
  ];

  return (
    <main style={{ background: "#051024", color: "#FFFFFF", minHeight: "100vh", fontFamily: "'Altone', sans-serif", position: 'relative', overflowX: 'hidden' }}>
      <style>{`
        @import url('https://fonts.cdnfonts.com/css/lemon-milk');
        @import url('https://fonts.cdnfonts.com/css/altone');
        html { scroll-behavior: smooth; }
        .btn-game {
          font-family: 'LEMON MILK', sans-serif;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          cursor: pointer;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .btn-game:hover:not(:disabled) {
          background: ${darkBlueAlt} !important;
          transform: translateY(-4px) scale(1.03);
          box-shadow: 0 15px 30px rgba(116, 179, 206, 0.4) !important;
        }
        .card-glass {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(116, 179, 206, 0.15);
          border-radius: 24px;
          transition: all 0.4s ease;
        }
        .card-glass:hover {
          border-color: ${mainBlue};
          box-shadow: 0 20px 40px rgba(0,0,0,0.5), 0 0 20px rgba(116, 179, 206, 0.1);
        }
        @keyframes slideUpIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes xpPop { 0% { opacity: 0; transform: translateY(0); } 20% { opacity: 1; transform: translateY(-15px); } 100% { opacity: 0; transform: translateY(-35px); } }
        @keyframes typingDot { 0%, 100% { opacity: 0.3; } 50% { opacity: 1; } }
        
        .avatar-card {
            border: 2px solid rgba(255,255,255,0.08);
            transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .avatar-card:hover {
            border-color: rgba(116, 179, 206, 0.4);
            transform: scale(1.05);
            background: rgba(116, 179, 206, 0.1);
        }
        .avatar-card.selected {
            border-color: #74B3CE;
            box-shadow: 0 0 20px rgba(116, 179, 206, 0.3);
            background: rgba(116, 179, 206, 0.2);
        }
      `}</style>

      <ParticleNetwork />
      <div style={{ height: "6px", background: brandGradient, position: "relative", zIndex: 51 }} />

      {/* NAVIGATION */}
      <header style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(5, 18, 43, 0.7)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(116, 179, 206, 0.1)" }}>
        <nav style={{ maxWidth: "1200px", margin: "0 auto", minHeight: "86px", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <a href="/" style={{ fontFamily: "'LEMON MILK', sans-serif", textDecoration: "none", color: "#FFFFFF", fontSize: "24px", fontWeight: "bold" }}>SAFENET</a>
          {view === 'world' ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(116,179,206,0.1)', padding: '6px 14px', borderRadius: '12px', border: '1px solid rgba(116,179,206,0.2)' }}>
                <CharacterVisual accent={activeAvatar.accent} size={24} />
                <span style={{ fontWeight: 'bold', color: '#FFFFFF', fontSize: '13px' }}>{nickname}</span>
              </div>
              <div style={{ background: mainBlue, color: '#051024', padding: '8px 16px', borderRadius: '10px', fontWeight: 'bold', fontSize: '11px', boxShadow: `0 0 15px rgba(116,179,206,0.3)` }}>{xp} XP</div>
            </div>
          ) : (
            <a href="/" style={{ fontFamily: "'LEMON MILK', sans-serif", textDecoration: "none", color: "#FFFFFF", fontSize: "12px", opacity: 0.7 }}>SALIR</a>
          )}
        </nav>
      </header>

      {/* VIEWS SECTION */}
      <section style={{ padding: "80px 20px", position: 'relative', zIndex: 1 }}>
        {view === 'intro' && (
          <div style={{ maxWidth: "1200px", margin: "0 auto", background: "rgba(10, 20, 40, 0.4)", border: "1px solid rgba(116, 179, 206, 0.2)", borderRadius: "30px", padding: "100px 32px", textAlign: "center", backdropFilter: 'blur(12px)' }}>
            <div style={{ fontFamily: "'Altone', sans-serif", display: "inline-flex", padding: "8px 20px", borderRadius: "999px", background: "rgba(116, 179, 206, 0.1)", border: `1px solid rgba(116, 179, 206, 0.3)`, color: mainBlue, fontSize: "12px", fontWeight: 700, letterSpacing: "1.2px", textTransform: "uppercase", marginBottom: "28px" }}>MUNDO DIGITAL NIÑOS</div>
            <h1 style={{ fontFamily: "'LEMON MILK', sans-serif", fontSize: "clamp(36px, 5vw, 64px)", lineHeight: 1.1, color: "#FFFFFF", marginBottom: "32px" }}>CONVIÉRTETE EN UN <span style={{ color: mainBlue }}>GUARDIÁN</span> DE LA RED</h1>
            <p style={{ fontSize: "18px", color: "#FFFFFF", maxWidth: "700px", margin: "0 auto 42px", lineHeight: 1.8 }}>Completa misiones, aprende a detectar señales de riesgo y gana puntos de experiencia mientras exploras el mundo digital de forma segura.</p>
            <button onClick={() => setView('setup')} className="btn-primary" style={{ fontFamily: "'LEMON MILK', sans-serif", padding: "18px 32px", borderRadius: "14px", textDecoration: "none", background: mainBlue, color: "#FFFFFF", fontSize: "14px", fontWeight: "bold", textTransform: "uppercase", boxShadow: `0 8px 20px rgba(116, 179, 206, 0.3)`, border: 'none' }}>ENTRAR AL MUNDO</button>
          </div>
        )}

        {view === 'setup' && (
          <div style={{ maxWidth: "640px", margin: "0 auto", background: "rgba(10, 20, 45, 0.8)", padding: "50px", borderRadius: "32px", border: "1px solid rgba(116, 179, 206, 0.3)", backdropFilter: 'blur(20px)' }}>
            <h2 style={{ fontFamily: "'LEMON MILK', sans-serif", fontSize: "24px", textAlign: "center", color: '#FFFFFF', marginBottom: "40px" }}>TU IDENTIDAD DIGITAL</h2>
            <div style={{ marginBottom: "32px" }}>
              <label style={{ fontSize: "11px", fontWeight: "bold", textTransform: "uppercase", color: mainBlue, display: "block", marginBottom: "12px", letterSpacing: '1px' }}>Nombre de Héroe</label>
              <input type="text" value={nickname} onChange={(e) => setNickname(e.target.value.slice(0, 12))} placeholder="Ej: Guardian_01" style={{ width: "100%", padding: "18px", borderRadius: "14px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(116,179,206,0.3)", color: "white", outline: "none", fontSize: "16px", boxSizing: 'border-box' }} />
            </div>
            <div style={{ marginBottom: "40px" }}>
              <label style={{ fontSize: "11px", fontWeight: "bold", textTransform: "uppercase", color: mainBlue, display: "block", marginBottom: "18px", letterSpacing: '1px' }}>Elige tu Personaje</label>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}>
                {avatars.map(av => (
                  <button key={av.id} onClick={() => setSelectedAvatar(av.id)} className={`avatar-card ${selectedAvatar === av.id ? 'selected' : ''}`} style={{ padding: "20px 10px", borderRadius: "18px", cursor: "pointer", background: 'rgba(255,255,255,0.03)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                    <CharacterVisual accent={av.accent} size={32} />
                    <div style={{ fontSize: "10px", color: "#FFF", fontWeight: "bold", textTransform: 'uppercase' }}>{av.name}</div>
                  </button>
                ))}
              </div>
            </div>
            <button disabled={nickname.length < 3} onClick={() => setView('world')} className="btn-primary" style={{ width: "100%", padding: "18px", borderRadius: "14px", background: nickname.length >= 3 ? mainBlue : "rgba(255,255,255,0.05)", color: "#FFFFFF", border: 'none', fontSize: '14px', fontWeight: 'bold', textTransform: 'uppercase' }}>¡COMENZAR AVENTURA!</button>
          </div>
        )}

        {view === 'world' && (
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <div style={{ marginBottom: "50px", display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '20px', flexWrap: 'wrap' }}>
              <div>
                <h2 style={{ fontFamily: "'LEMON MILK', sans-serif", fontSize: "clamp(24px, 4vw, 42px)", color: "#FFFFFF", margin: '0 0 8px 0' }}>PANEL DE <span style={{ color: mainBlue }}>MISIONES</span></h2>
                <p style={{ fontSize: "16px", color: "#FFFFFF", margin: 0, opacity: 0.7 }}>Bienvenido, guardián {nickname}.</p>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: "28px" }}>
              {missions.map(m => (
                <article key={m.id} className="card-glass" style={{ padding: "40px", borderRadius: "28px", display: 'flex', flexDirection: 'column', borderLeft: completedModules.has(m.id) ? `4px solid #27ae60` : undefined }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'rgba(116,179,206,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', border: '1px solid rgba(116,179,206,0.2)' }}>
                     <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={mainBlue} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                  </div>
                  <h3 style={{ fontFamily: "'LEMON MILK', sans-serif", fontSize: "18px", color: "#FFFFFF", marginBottom: "16px" }}>{m.title}</h3>
                  <p style={{ fontSize: "15px", color: "#FFFFFF", lineHeight: 1.6, marginBottom: "32px", opacity: 0.8 }}>{m.desc}</p>
                  <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ background: 'rgba(255,215,0,0.08)', padding: '6px 14px', borderRadius: '8px', border: '1px solid rgba(255,215,0,0.2)', color: '#FFD700', fontSize: '11px', fontWeight: 'bold' }}>RECOMPENSA: {m.xp} XP</div>
                    <button onClick={() => setActiveModule(m.id)} className="btn-primary" style={{ padding: "12px 24px", borderRadius: "10px", background: mainBlue, color: "#FFFFFF", border: 'none', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase' }}>{completedModules.has(m.id) ? 'REPETIR' : 'JUGAR'}</button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* MODAL SYSTEM */}
      {activeModule && (
        <div style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(5, 12, 30, 0.96)", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
          <div className="card-glass" style={{ maxWidth: "540px", width: "100%", padding: "40px", position: 'relative', background: 'rgba(10, 25, 50, 0.98)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <button onClick={() => setActiveModule(null)} style={{ position: "absolute", top: "20px", right: "20px", background: "rgba(255,255,255,0.05)", border: "none", color: "white", fontSize: "16px", cursor: "pointer", width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
            {activeModule === 'chat' && <ChatModule onComplete={(pts: number) => handleComplete('chat', pts)} onXp={handleXp} />}
            {activeModule === 'decisions' && <DecisionsModule onComplete={(pts: number) => handleComplete('decisions', pts)} onXp={handleXp} />}
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer style={{ background: "rgba(5, 12, 25, 0.9)", borderTop: "1px solid rgba(116, 179, 206, 0.1)", padding: "40px 20px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "20px" }}>
          <div style={{ fontFamily: "'LEMON MILK', sans-serif", fontSize: "20px", fontWeight: "bold", color: "#FFFFFF", opacity: 0.9 }}>SAFENET WORLD</div>
          <div style={{ fontSize: "13px", color: "#FFFFFF", opacity: 0.5 }}>2026 · DIVIÉRTETE CON SEGURIDAD</div>
        </div>
      </footer>
    </main>
  );
}