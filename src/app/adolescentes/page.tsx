"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { trackWorldEntry } from "@/lib/tracking";

/* ════════════════════════════════════════════════════════════
   TIPOS
════════════════════════════════════════════════════════════ */
type View = 'intro' | 'setup' | 'world';
type ModuleId = 'dm_sim' | 'profile_detector' | 'story_path' | 'red_flags' | 'screenshot_analysis';

/* ════════════════════════════════════════════════════════════
   CONSTANTES VISUALES
════════════════════════════════════════════════════════════ */
const ACCENT = "#74B3CE";
const ACCENT_DIM = "#5A99B4";
const BG_DARK = "#051024";
const GLASS_BG = "rgba(255,255,255,0.03)";
const GLASS_BORDER = "rgba(116,179,206,0.15)";
const BRAND_GRADIENT = `linear-gradient(90deg, #FFFFFF 0%, ${ACCENT} 55%, #FFFFFF 100%)`;

/* ════════════════════════════════════════════════════════════
   PARTÍCULAS
════════════════════════════════════════════════════════════ */
const ParticleNetwork = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let w = window.innerWidth, h = window.innerHeight;
    canvas.width = w; canvas.height = h;
    const pts: any[] = [];
    for (let i = 0; i < 55; i++) pts.push({ x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - .5) * .4, vy: (Math.random() - .5) * .4 });
    const loop = () => {
      ctx.clearRect(0, 0, w, h);
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        ctx.beginPath(); ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(116,179,206,0.25)"; ctx.fill();
      });
      for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) {
        const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y, d = Math.sqrt(dx * dx + dy * dy);
        if (d < 140) { ctx.beginPath(); ctx.strokeStyle = `rgba(116,179,206,${0.08 * (1 - d / 140)})`; ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y); ctx.stroke(); }
      }
      requestAnimationFrame(loop);
    };
    loop();
    const onResize = () => { w = window.innerWidth; h = window.innerHeight; canvas.width = w; canvas.height = h; };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }} />;
};

/* ════════════════════════════════════════════════════════════
   UTILIDADES UI
════════════════════════════════════════════════════════════ */
function FeedbackBox({ message, type }: { message: string; type: 'success' | 'danger' | 'info' | 'warn' }) {
  const s = {
    success: { bg: 'rgba(39,174,96,0.12)', border: 'rgba(39,174,96,0.35)', color: '#A9DFBF' },
    danger:  { bg: 'rgba(255,60,80,0.12)',  border: 'rgba(255,60,80,0.35)',  color: '#FF8A95' },
    info:    { bg: 'rgba(116,179,206,0.12)', border: 'rgba(116,179,206,0.35)', color: '#A5D2E5' },
    warn:    { bg: 'rgba(255,200,0,0.1)',   border: 'rgba(255,200,0,0.3)',   color: '#FFE08A' },
  }[type];
  return (
    <div style={{ background: s.bg, border: `1px solid ${s.border}`, color: s.color, padding: '12px 16px', borderRadius: '10px', fontSize: '13px', lineHeight: 1.5, animation: 'slideUpIn 0.35s ease-out forwards', margin: '10px 0' }}>
      {message}
    </div>
  );
}

function XpPop({ amount, onDone }: { amount: number; onDone: () => void }) {
  useEffect(() => { const t = setTimeout(onDone, 1800); return () => clearTimeout(t); }, [onDone]);
  return (
    <div style={{ position: 'fixed', bottom: '100px', right: '40px', zIndex: 9999, background: 'rgba(255,215,0,0.95)', color: '#051024', padding: '8px 16px', borderRadius: '8px', fontFamily: "'LEMON MILK',sans-serif", fontSize: '14px', fontWeight: 'bold', animation: 'xpPop 1.8s ease-out forwards', boxShadow: '0 5px 15px rgba(255,215,0,0.2)', border: '1px solid #FFF' }}>
      +{amount} XP
    </div>
  );
}

function ProgressBar({ label, current, max, color }: { label: string; current: number; max: number; color: string }) {
  const pct = Math.min(100, Math.round((current / max) * 100));
  return (
    <div style={{ marginBottom: '14px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', fontWeight: 'bold', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '1px' }}>
        <span style={{ color: '#FFFFFF', opacity: .7 }}>{label}</span><span style={{ color }}>{pct}%</span>
      </div>
      <div style={{ height: '5px', background: 'rgba(255,255,255,0.07)', borderRadius: '99px', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: color, transition: 'width 0.7s ease', borderRadius: '99px' }} />
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   MÓDULO 1 — SIMULADOR DE DM REALISTA
════════════════════════════════════════════════════════════ */

const dmScript = [
  { from: 'stranger', name: 'alex_reyes23', text: 'Ey, vi tus posts. Tenés un contenido muy bueno, lo digo en serio.' },
  { from: 'stranger', name: 'alex_reyes23', text: 'Soy de Buenos Aires también. Qué raro que no nos sigamos antes, jaja.' },
  { from: 'stranger', name: 'alex_reyes23', text: 'Mira, no le cuentes a nadie esto, pero tengo acceso a una cuenta de influencer que podría repostear tu contenido. ¿Te interesa?' },
  { from: 'stranger', name: 'alex_reyes23', text: '¿Podemos pasar a Telegram? Instagram me shadowbannea los mensajes. Te explico todo ahí.' },
  { from: 'stranger', name: 'alex_reyes23', text: 'Necesito una foto tuya para verificar que sos real antes de conectarte con mi contacto. Cualquier foto.' },
];

const dmChoices: Record<number, any[]> = {
  0: [
    { text: 'Gracias, igual no conozco a quién seguís', isSafe: true, points: 20, consequence: 'Respuesta neutra y con distancia. No compartiste info personal.', type: 'info' },
    { text: '¿De verdad? ¿Qué te gustó más de mis posts?', isSafe: false, points: 0, consequence: 'Al mostrar entusiasmo abrís la puerta a más interacción. El halago es la primera táctica de grooming.', type: 'warn' },
  ],
  1: [
    { text: '¿Y cómo sabes que soy de Buenos Aires?', isSafe: true, points: 30, consequence: 'Pregunta que incomoda al groomer. Buen instinto: ¿cómo obtuvieron esa info?', type: 'success' },
    { text: 'Sí, qué coincidencia. ¿De qué zona sos?', isSafe: false, points: 0, consequence: 'Acabas de confirmar tu ubicación y abriste una conversación sobre datos personales.', type: 'danger' },
  ],
  2: [
    { text: 'Si es legítimo, que me contacte por DM acá nomás.', isSafe: true, points: 40, consequence: 'Perfecto. No te dejás llevar por la urgencia ni por ofertas que suenan demasiado buenas.', type: 'success' },
    { text: '¿Qué influencer? Me interesa mucho.', isSafe: false, points: 0, consequence: 'Las ofertas tentadoras son anzuelos. El groomer usa tus ambiciones para mantenerte enganchado.', type: 'danger' },
  ],
  3: [
    { text: 'No, prefiero seguir hablando acá. Si no podés, no hay problema.', isSafe: true, points: 50, consequence: 'Excelente. Salir de la plataforma es una señal de alarma clásica. Seguir acá te protege.', type: 'success' },
    { text: 'Dale, instalo Telegram ahora.', isSafe: false, points: 0, consequence: 'Pasar a otra app elimina los registros y el sistema de reportes. Es una señal de alerta mayor.', type: 'danger' },
  ],
  4: [
    { text: 'Esto no tiene ningún sentido. Te voy a bloquear y reportar.', isSafe: true, points: 60, consequence: 'Decisión correcta. Pedir una foto a un desconocido online no es verificacion — es el inicio de algo peligroso.', type: 'success' },
    { text: 'Supongo que no hay problema con una foto de perfil...', isSafe: false, points: 0, consequence: 'Una foto "inocente" puede ser el primer paso hacia escaladas más graves. El limite tiene que ser claro.', type: 'danger' },
  ],
};

function DmSimModule({ onComplete, onXp }: { onComplete: (pts: number) => void; onXp: (n: number) => void }) {
  const [history, setHistory] = useState<any[]>([{ from: 'stranger', name: 'alex_reyes23', text: dmScript[0].text }]);
  const [step, setStep] = useState(0);
  const [pts, setPts] = useState(0);
  const [typing, setTyping] = useState(false);
  const [phase, setPhase] = useState<'playing' | 'result'>('playing');
  const [xpPop, setXpPop] = useState(0);
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => { chatRef.current?.scrollTo(0, chatRef.current.scrollHeight); }, [history, typing]);

  const handleChoice = (c: any) => {
    const newH = [...history, { from: 'player', text: c.text }, { from: 'system', text: c.consequence, stype: c.type }];
    setHistory(newH);
    if (c.points > 0) { setPts(p => p + c.points); setXpPop(c.points); onXp(c.points); }
    if (step + 1 >= Object.keys(dmChoices).length) { setTimeout(() => setPhase('result'), 1800); return; }
    setTyping(true);
    setTimeout(() => { setTyping(false); setHistory(prev => [...prev, { ...dmScript[step + 1] }]); setStep(p => p + 1); }, 1600);
  };

  const totalPossible = Object.values(dmChoices).reduce((acc, arr) => acc + Math.max(...arr.map((x: any) => x.points)), 0);

  if (phase === 'result') {
    const pct = Math.round((pts / totalPossible) * 100);
    const verdict = pct >= 80 ? { text: 'Criterio digital muy alto. Reconociste todas las tácticas.', color: '#A9DFBF' }
      : pct >= 50 ? { text: 'Buen instinto en algunos momentos. Hay señales que conviene reforzar.', color: '#FFE08A' }
      : { text: 'Varias respuestas pusieron en riesgo tu seguridad. Vale la pena revisar las señales.', color: '#FF8A95' };
    return (
      <div style={{ textAlign: 'center', padding: '10px 0' }}>
        <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '2px', color: ACCENT, marginBottom: '12px' }}>Análisis completado</div>
        <h3 style={{ fontFamily: "'LEMON MILK',sans-serif", fontSize: '22px', color: '#FFF', marginBottom: '8px' }}>{pts} / {totalPossible} pts</h3>
        <p style={{ color: verdict.color, fontSize: '14px', lineHeight: 1.6, marginBottom: '24px', maxWidth: '380px', margin: '0 auto 24px' }}>{verdict.text}</p>
        <div style={{ background: 'rgba(116,179,206,0.08)', borderRadius: '14px', padding: '16px', marginBottom: '24px', textAlign: 'left', border: '1px solid rgba(116,179,206,0.15)' }}>
          <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', color: ACCENT, marginBottom: '10px' }}>Señales identificadas en esta conversacion</div>
          {['Halago inicial para bajar la guardia', 'Mencionar ubicacion para crear falsa cercania', 'Oferta irreal como anzuelo', 'Solicitud de cambio de plataforma', 'Pedido de foto para "verificar"'].map((s, i) => (
            <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', marginBottom: '8px' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#FF8A95', marginTop: '5px', flexShrink: 0 }} />
              <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)', lineHeight: 1.5 }}>{s}</span>
            </div>
          ))}
        </div>
        <button onClick={() => onComplete(pts)} style={{ padding: '14px 32px', borderRadius: '12px', background: ACCENT, color: '#FFF', border: 'none', fontFamily: "'LEMON MILK',sans-serif", fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}>RECLAMAR XP</button>
      </div>
    );
  }

  return (
    <div>
      {xpPop > 0 && <XpPop amount={xpPop} onDone={() => setXpPop(0)} />}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', background: 'rgba(0,0,0,0.3)', borderRadius: '12px', marginBottom: '16px', border: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, #667eea, #764ba2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 'bold', color: '#FFF', flexShrink: 0 }}>A</div>
        <div>
          <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#FFF' }}>alex_reyes23</div>
          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>Activo hace 2 min</div>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
          </div>
        </div>
      </div>

      <ProgressBar label={`Mensaje ${step + 1} de ${Object.keys(dmChoices).length}`} current={step + 1} max={Object.keys(dmChoices).length} color={ACCENT} />

      <div ref={chatRef} style={{ background: 'rgba(0,0,0,0.35)', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.05)', padding: '16px', maxHeight: '280px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px', scrollBehavior: 'smooth' }}>
        {history.map((m, i) => (
          <div key={i} style={{ animation: 'slideUpIn 0.3s ease' }}>
            {m.from === 'stranger' && (
              <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
                <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: 'linear-gradient(135deg, #667eea, #764ba2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 'bold', color: '#FFF', flexShrink: 0 }}>A</div>
                <div style={{ background: 'rgba(116,179,206,0.1)', border: '1px solid rgba(116,179,206,0.12)', padding: '9px 13px', borderRadius: '16px 16px 16px 3px', fontSize: '13px', color: '#FFF', maxWidth: '82%', lineHeight: 1.5 }}>{m.text}</div>
              </div>
            )}
            {m.from === 'player' && (
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <div style={{ background: 'rgba(90,153,180,0.18)', border: '1px solid rgba(90,153,180,0.2)', padding: '9px 13px', borderRadius: '16px 16px 3px 16px', fontSize: '13px', color: ACCENT, maxWidth: '82%', lineHeight: 1.5 }}>{m.text}</div>
              </div>
            )}
            {m.from === 'system' && <FeedbackBox message={m.text} type={m.stype} />}
          </div>
        ))}
        {typing && <div style={{ paddingLeft: '38px', display: 'flex', gap: '4px', alignItems: 'center' }}><span style={{ width: '6px', height: '6px', borderRadius: '50%', background: ACCENT, animation: 'typingDot 1s infinite 0s' }} /><span style={{ width: '6px', height: '6px', borderRadius: '50%', background: ACCENT, animation: 'typingDot 1s infinite 0.2s' }} /><span style={{ width: '6px', height: '6px', borderRadius: '50%', background: ACCENT, animation: 'typingDot 1s infinite 0.4s' }} /></div>}
      </div>

      {!typing && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px', color: 'rgba(255,255,255,0.35)', marginBottom: '4px' }}>Tu respuesta</div>
          {dmChoices[step]?.map((c, i) => (
            <button key={i} onClick={() => handleChoice(c)} style={{ padding: '11px 15px', borderRadius: '10px', textAlign: 'left', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.85)', fontSize: '13px', cursor: 'pointer', lineHeight: 1.4, transition: 'all 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(116,179,206,0.4)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}
            >{c.text}</button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   MÓDULO 2 — DETECTOR DE PERFILES FALSOS
════════════════════════════════════════════════════════════ */

const profiles = [
  {
    id: 'p1', username: 'valeria.foto_oficial', name: 'Valeria Moreno', bio: 'Modelo 🌟 | Viajes y lifestyle | Trabajo con marcas | DMs abiertos para collabs',
    followers: '12.4K', following: '8', posts: '3', verified: false, accountAge: 'Cuenta creada hace 2 semanas',
    pfpDesc: 'Foto de perfil con calidad perfecta, iluminación de estudio', avatar: '#E88',
    postCount: 3, redFlags: ['Cuenta con 12K seguidores pero solo 3 publicaciones', 'Creada hace apenas 2 semanas', 'Siguiendo solo 8 cuentas (ratio irreal)', 'Bio llena de palabras de atraccion', 'Foto de perfil demasiado perfecta (posible imagen de IA o modelo de stock)'],
    verdict: 'falso', verdictLabel: 'Perfil falso', verdictColor: '#FF8A95'
  },
  {
    id: 'p2', username: 'sofi_guzman_bsas', name: 'Sofía Guzmán', bio: 'Estudiante FADU | Música y diseño | Buenos Aires',
    followers: '342', following: '280', posts: '87', verified: false, accountAge: 'Cuenta desde 2022',
    pfpDesc: 'Foto de perfil grupal recortada, casual', avatar: '#68A',
    postCount: 87, redFlags: [],
    verdict: 'real', verdictLabel: 'Perfil autentico', verdictColor: '#A9DFBF'
  },
  {
    id: 'p3', username: 'martin_ok_gt', name: 'Martín', bio: 'Solo quiero conectar con gente buena onda. DM si querés hablar',
    followers: '1', following: '847', posts: '0', verified: false, accountAge: 'Cuenta creada hace 3 días',
    pfpDesc: 'Sin foto de perfil', avatar: '#777',
    postCount: 0, redFlags: ['Sin foto de perfil', 'Cero publicaciones', 'Siguiendo a 847 personas desde hace 3 días', '1 solo seguidor', 'Bio vaga con invitation a chatear en privado'],
    verdict: 'falso', verdictLabel: 'Perfil sospechoso', verdictColor: '#FFE08A'
  },
];

function ProfileDetectorModule({ onComplete, onXp }: { onComplete: (pts: number) => void; onXp: (n: number) => void }) {
  const [idx, setIdx] = useState(0);
  const [pts, setPts] = useState(0);
  const [chosen, setChosen] = useState<string | null>(null);
  const [xpPop, setXpPop] = useState(0);
  const [phase, setPhase] = useState<'playing' | 'result'>('playing');

  const p = profiles[idx];

  const handleVerdict = (v: 'real' | 'falso' | 'sospechoso') => {
    setChosen(v);
    const isCorrect = v === p.verdict || (v === 'sospechoso' && p.verdict === 'falso');
    const earned = isCorrect ? 40 : 0;
    if (earned > 0) { setPts(prev => prev + earned); setXpPop(earned); onXp(earned); }
  };

  const handleNext = () => {
    setChosen(null);
    if (idx + 1 >= profiles.length) { setPhase('result'); return; }
    setIdx(i => i + 1);
  };

  if (phase === 'result') return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '2px', color: ACCENT, marginBottom: '12px' }}>Entrenamiento completado</div>
      <h3 style={{ fontFamily: "'LEMON MILK',sans-serif", fontSize: '20px', color: '#FFF', marginBottom: '16px' }}>{pts} puntos</h3>
      <div style={{ background: 'rgba(116,179,206,0.08)', border: '1px solid rgba(116,179,206,0.15)', borderRadius: '14px', padding: '16px', marginBottom: '24px', textAlign: 'left' }}>
        <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', color: ACCENT, marginBottom: '10px' }}>Lo que aprendiste hoy</div>
        {['Una cuenta con muchos seguidores y pocas publicaciones puede haber comprado seguidores', 'La ratio seguidos/seguidores dice mucho sobre un perfil', 'Las fotos de IA o de stock se usan para crear identidades falsas', 'Una cuenta reciente con mucha actividad de seguimiento es sospechosa', 'La ausencia de contenido propio es una señal clave'].map((t, i) => (
          <div key={i} style={{ display: 'flex', gap: '10px', marginBottom: '8px' }}>
            <div style={{ width: '6px', height: '6px', background: ACCENT, borderRadius: '50%', marginTop: '5px', flexShrink: 0 }} />
            <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)', lineHeight: 1.5 }}>{t}</span>
          </div>
        ))}
      </div>
      <button onClick={() => onComplete(pts)} style={{ padding: '14px 32px', borderRadius: '12px', background: ACCENT, color: '#FFF', border: 'none', fontFamily: "'LEMON MILK',sans-serif", fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}>RECLAMAR XP</button>
    </div>
  );

  return (
    <div>
      {xpPop > 0 && <XpPop amount={xpPop} onDone={() => setXpPop(0)} />}
      <ProgressBar label={`Perfil ${idx + 1} de ${profiles.length}`} current={idx + 1} max={profiles.length} color={ACCENT} />

      <div style={{ background: 'rgba(0,0,0,0.4)', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.07)', marginBottom: '16px', overflow: 'hidden' }}>
        <div style={{ padding: '16px', display: 'flex', gap: '14px', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ width: '54px', height: '54px', borderRadius: '50%', background: `linear-gradient(135deg, ${p.avatar}, ${p.avatar}88)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: 'bold', color: '#FFF', border: `2px solid ${p.avatar}`, flexShrink: 0 }}>
            {p.name.charAt(0)}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
              <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#FFF' }}>{p.username}</span>
              {p.verified && <span style={{ color: '#4FC3F7', fontSize: '12px' }}>✓</span>}
            </div>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>{p.accountAge}</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', textAlign: 'center', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          {[['Publicaciones', p.posts], ['Seguidores', p.followers], ['Siguiendo', p.following]].map(([label, val]) => (
            <div key={label}>
              <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#FFF' }}>{val}</div>
              <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</div>
            </div>
          ))}
        </div>

        <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#FFF', marginBottom: '4px' }}>{p.name}</div>
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.5 }}>{p.bio}</div>
        </div>

        <div style={{ padding: '12px 16px 16px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '3px' }}>
          {Array.from({ length: Math.min(p.postCount, 6) }).map((_, i) => (
            <div key={i} style={{ aspectRatio: '1', borderRadius: '4px', background: `rgba(${parseInt(p.avatar.slice(1, 2), 16) * 17},${parseInt(p.avatar.slice(2, 3), 16) * 17},${parseInt(p.avatar.slice(3), 16) * 17},0.25)`, border: '1px solid rgba(255,255,255,0.04)' }} />
          ))}
          {p.postCount === 0 && <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '20px', color: 'rgba(255,255,255,0.3)', fontSize: '12px' }}>Sin publicaciones</div>}
        </div>
      </div>

      {!chosen ? (
        <div>
          <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', color: 'rgba(255,255,255,0.4)', marginBottom: '10px' }}>¿Como evaluás este perfil?</div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {[['real', 'Parece real', '#A9DFBF'], ['sospechoso', 'Algo raro', '#FFE08A'], ['falso', 'Es falso', '#FF8A95']].map(([val, label, color]) => (
              <button key={val} onClick={() => handleVerdict(val as any)} style={{ flex: 1, padding: '12px 8px', borderRadius: '10px', background: 'rgba(255,255,255,0.03)', border: `1px solid ${color}33`, color, fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', textTransform: 'uppercase', letterSpacing: '0.5px' }}
                onMouseEnter={e => (e.currentTarget.style.background = `${color}18`)}
                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
              >{label}</button>
            ))}
          </div>
        </div>
      ) : (
        <div style={{ animation: 'slideUpIn 0.4s ease' }}>
          <div style={{ background: chosen === p.verdict || (chosen === 'sospechoso' && p.verdict === 'falso') ? 'rgba(39,174,96,0.1)' : 'rgba(255,60,80,0.1)', border: `1px solid ${chosen === p.verdict || (chosen === 'sospechoso' && p.verdict === 'falso') ? 'rgba(39,174,96,0.3)' : 'rgba(255,60,80,0.3)'}`, borderRadius: '12px', padding: '14px', marginBottom: '12px' }}>
            <div style={{ fontSize: '12px', fontWeight: 'bold', color: chosen === p.verdict || (chosen === 'sospechoso' && p.verdict === 'falso') ? '#A9DFBF' : '#FF8A95', marginBottom: '8px' }}>
              {chosen === p.verdict || (chosen === 'sospechoso' && p.verdict === 'falso') ? 'Correcto — ' : 'No exactamente — '}{p.verdictLabel}
            </div>
            {p.redFlags.length > 0 ? (
              <div>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '1px' }}>Señales detectables</div>
                {p.redFlags.map((r, i) => <div key={i} style={{ fontSize: '12px', color: 'rgba(255,255,255,0.75)', marginBottom: '5px', paddingLeft: '10px', borderLeft: '2px solid rgba(255,80,80,0.4)', lineHeight: 1.4 }}>{r}</div>)}
              </div>
            ) : (
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', margin: 0, lineHeight: 1.5 }}>Este perfil muestra comportamiento autentico: seguidores/seguidos balanceados, historial de publicaciones, bio concreta y cuenta con antiguedad.</p>
            )}
          </div>
          <button onClick={handleNext} style={{ width: '100%', padding: '12px', borderRadius: '10px', background: ACCENT, color: '#FFF', border: 'none', fontFamily: "'LEMON MILK',sans-serif", fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}>{idx + 1 < profiles.length ? 'SIGUIENTE PERFIL' : 'VER RESULTADOS'}</button>
        </div>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   MÓDULO 3 — ELEGÍ TU CAMINO
════════════════════════════════════════════════════════════ */

type StoryNode = {
  id: string;
  text: string;
  tension?: number;
  options?: { text: string; next: string; safe: boolean; pts: number }[];
  isEnd?: boolean;
  endType?: 'safe' | 'risk' | 'ideal' | 'ambiguous';
  endMsg?: string;
};

const storyNodes: Record<string, StoryNode> = {
  'start': {
    id: 'start', tension: 1,
    text: 'Un chico que no conocés en persona empieza a comentar todos tus videos de TikTok. Sus comentarios son amables, inteligentes. Hoy te escribió por privado por primera vez: "Vi todos tus videos. Sos diferente a los demás. ¿Hablamos?"',
    options: [
      { text: 'Le respondo, me parece inofensivo', next: 'respond_yes', safe: false, pts: 0 },
      { text: 'Lo ignoro por ahora', next: 'ignore', safe: true, pts: 20 },
      { text: 'Le digo que no conozco gente por redes', next: 'respond_no', safe: true, pts: 30 },
    ]
  },
  'respond_yes': {
    id: 'respond_yes', tension: 2,
    text: 'Empiezan a hablar. Es agradable, parece entenderte. Después de unos días dice: "Con vos puedo hablar de cualquier cosa. Mis amigos no me entienden como vos." Y te pide que no le cuentes a nadie de su situación.',
    options: [
      { text: 'Me parece normal, la gente tiene problemas', next: 'trust_building', safe: false, pts: 0 },
      { text: 'Ese pedido de secreto me incomoda', next: 'notice_secret', safe: true, pts: 25 },
    ]
  },
  'ignore': {
    id: 'ignore', tension: 1,
    text: 'Decidís ignorarlo. Pero a los días te manda otro mensaje: "Sé que me leíste. No quería incomodarte. Solo quería decirte que tus videos me ayudaron mucho. Gracias." Ahora te genera dudas.',
    options: [
      { text: 'Quizás fui demasiado fría, le contesto', next: 'respond_yes', safe: false, pts: 0 },
      { text: 'Mantengo la distancia, sin responder', next: 'stay_safe', safe: true, pts: 40 },
    ]
  },
  'respond_no': {
    id: 'respond_no', tension: 1,
    text: 'Le decís que no solés hablar con gente que no conocés en persona. Responde: "Te entiendo, está bien. Pero a veces es más fácil hablar con alguien que no te juzga." Parece razonable.',
    options: [
      { text: 'Tiene razón. Quizás está bien hablar', next: 'respond_yes', safe: false, pts: 0 },
      { text: 'Mantengo mi postura y lo reporto', next: 'ideal_end', safe: true, pts: 60 },
    ]
  },
  'trust_building': {
    id: 'trust_building', tension: 3,
    text: 'Pasan semanas. La persona te dice que vos sos "su refugio". Un día pregunta: "¿Podemos pasar a WhatsApp? Acá me parece que alguien más lee los mensajes." La situación se siente rara, pero ya lo conocés bastante.',
    options: [
      { text: 'Le doy mi numero. Ya confío en él', next: 'danger_end', safe: false, pts: 0 },
      { text: 'Me niego. Algo no está bien', next: 'late_realization', safe: true, pts: 20 },
    ]
  },
  'notice_secret': {
    id: 'notice_secret', tension: 2,
    text: 'Identificás que el pedido de secreto es una señal rara. Decidís contarle a alguien de confianza lo que está pasando.',
    options: [
      { text: 'Le cuento a un adulto de confianza', next: 'ideal_end', safe: true, pts: 60 },
      { text: 'Le cuento a mi mejor amiga pero no a un adulto', next: 'ambiguous_end', safe: false, pts: 20 },
    ]
  },
  'stay_safe': {
    id: 'stay_safe', isEnd: true, endType: 'safe',
    text: '',
    endMsg: 'Mantuviste la distancia ante una situacion ambigua. Eso requiere criterio. No toda interaccion amable en redes es segura, y detectar incomodidad temprano es una habilidad clave.'
  },
  'late_realization': {
    id: 'late_realization', isEnd: true, endType: 'ambiguous',
    text: '',
    endMsg: 'Reconociste la señal, aunque tarde. El proceso de construccion de confianza fue gradual y funcionó un tiempo. Identificar el momento en que cruzó un límite es importante para el futuro.'
  },
  'ideal_end': {
    id: 'ideal_end', isEnd: true, endType: 'ideal',
    text: '',
    endMsg: 'Detectaste señales desde el principio y actuaste. Mantener límites claros y contar con alguien de confianza es exactamente lo correcto. Este es el camino ideal.'
  },
  'danger_end': {
    id: 'danger_end', isEnd: true, endType: 'risk',
    text: '',
    endMsg: 'La persona fue creando una relacion de dependencia emocional gradualmente. Pasar a otra plataforma es una señal de alarma mayor: elimina el rastro y el reporte. Esta situacion requería haber pedido ayuda antes.'
  },
  'ambiguous_end': {
    id: 'ambiguous_end', isEnd: true, endType: 'ambiguous',
    text: '',
    endMsg: 'Contarle a una amiga es mejor que guardar silencio, pero un adulto de confianza tiene más herramientas para ayudarte. No siempre alcanza con manejar estas situaciones entre pares.'
  },
};

const tensionColors: Record<number, string> = { 1: '#A9DFBF', 2: '#FFE08A', 3: '#FF8A95' };
const endColors: Record<string, string> = { ideal: '#A9DFBF', safe: '#74B3CE', ambiguous: '#FFE08A', risk: '#FF8A95' };
const endLabels: Record<string, string> = { ideal: 'Final ideal', safe: 'Final seguro', ambiguous: 'Final ambiguo', risk: 'Final de riesgo' };

function StoryPathModule({ onComplete, onXp }: { onComplete: (pts: number) => void; onXp: (n: number) => void }) {
  const [nodeId, setNodeId] = useState('start');
  const [pts, setPts] = useState(0);
  const [history, setHistory] = useState<string[]>(['start']);
  const [xpPop, setXpPop] = useState(0);

  const node = storyNodes[nodeId];

  const handleOption = (opt: { text: string; next: string; safe: boolean; pts: number }) => {
    if (opt.pts > 0) { setPts(p => p + opt.pts); setXpPop(opt.pts); onXp(opt.pts); }
    setHistory(h => [...h, opt.next]);
    setNodeId(opt.next);
  };

  if (node.isEnd) {
    const type = node.endType!;
    return (
      <div style={{ textAlign: 'center', animation: 'slideUpIn 0.5s ease' }}>
        <div style={{ display: 'inline-block', padding: '6px 14px', borderRadius: '99px', background: `${endColors[type]}18`, border: `1px solid ${endColors[type]}40`, color: endColors[type], fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>{endLabels[type]}</div>
        <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.85)', lineHeight: 1.7, maxWidth: '380px', margin: '0 auto 16px', textAlign: 'left' }}>{node.endMsg}</p>
        <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginBottom: '8px' }}>Camino recorrido: {history.length} decisiones</div>
        <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#FFF', marginBottom: '20px' }}>{pts} pts</div>
        <button onClick={() => onComplete(pts)} style={{ padding: '14px 32px', borderRadius: '12px', background: ACCENT, color: '#FFF', border: 'none', fontFamily: "'LEMON MILK',sans-serif", fontSize: '12px', cursor: 'pointer', fontWeight: 'bold' }}>RECLAMAR XP</button>
      </div>
    );
  }

  return (
    <div>
      {xpPop > 0 && <XpPop amount={xpPop} onDone={() => setXpPop(0)} />}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
        <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px', color: 'rgba(255,255,255,0.4)' }}>Tension</div>
        {[1, 2, 3].map(n => <div key={n} style={{ width: '20px', height: '5px', borderRadius: '99px', background: n <= (node.tension ?? 1) ? tensionColors[node.tension ?? 1] : 'rgba(255,255,255,0.1)', transition: 'background 0.4s' }} />)}
      </div>
      <div style={{ background: 'rgba(0,0,0,0.35)', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.06)', padding: '18px', marginBottom: '16px' }}>
        <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.9)', lineHeight: 1.7, margin: 0 }}>{node.text}</p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px', color: 'rgba(255,255,255,0.35)', marginBottom: '4px' }}>¿Que decidis?</div>
        {node.options?.map((opt, i) => (
          <button key={i} onClick={() => handleOption(opt)} style={{ padding: '12px 15px', borderRadius: '10px', textAlign: 'left', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.85)', fontSize: '13px', lineHeight: 1.4, cursor: 'pointer', transition: 'all 0.2s' }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = GLASS_BORDER)}
            onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}
          >{opt.text}</button>
        ))}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   MÓDULO 4 — ANALIZÁ LAS RED FLAGS
════════════════════════════════════════════════════════════ */

const redFlagMessages = [
  { id: 'rf1', text: '"No le cuentes esto a nadie, es solo entre nosotros."', isFlag: true, explanation: 'Pedir secreto es una de las tacticas principales de aislamiento.' },
  { id: 'rf2', text: '"¿En qué barrio vivís? Es para ver si estamos cerca."', isFlag: true, explanation: 'Pedir ubicacion a un desconocido es una señal de alarma directa.' },
  { id: 'rf3', text: '"Vi la peli que recomendaste. Tenías razón, estuvo buena."', isFlag: false, explanation: 'Un comentario sobre contenido compartido, sin información personal ni presion.' },
  { id: 'rf4', text: '"Sos la única persona que me entiende de verdad. No sé qué haría sin vos."', isFlag: true, explanation: 'Crear dependencia emocional intensa con un desconocido es manipulacion.' },
  { id: 'rf5', text: '"¿Podemos hablar por Telegram? Instagram me tiene bloqueado."', isFlag: true, explanation: 'Querer salir de la plataforma elimina el rastro y el sistema de denuncia.' },
  { id: 'rf6', text: '"¿Que musica escuchas? Estoy armando una playlist."', isFlag: false, explanation: 'Pregunta de preferencia casual sin intento de obtener datos personales.' },
];

function RedFlagsModule({ onComplete, onXp }: { onComplete: (pts: number) => void; onXp: (n: number) => void }) {
  const [answered, setAnswered] = useState<Record<string, boolean | null>>({});
  const [feedback, setFeedback] = useState<Record<string, { correct: boolean; msg: string }>>({});
  const [pts, setPts] = useState(0);
  const [xpPop, setXpPop] = useState(0);
  const [phase, setPhase] = useState<'playing' | 'result'>('playing');

  const handleAnswer = (id: string, choice: boolean) => {
    if (answered[id] !== undefined) return;
    const msg_obj = redFlagMessages.find(m => m.id === id)!;
    const correct = choice === msg_obj.isFlag;
    const earned = correct ? 25 : 0;
    setAnswered(prev => ({ ...prev, [id]: choice }));
    setFeedback(prev => ({ ...prev, [id]: { correct, msg: msg_obj.explanation } }));
    if (earned > 0) { setPts(p => p + earned); setXpPop(earned); onXp(earned); }
    if (Object.keys(answered).length + 1 >= redFlagMessages.length) setTimeout(() => setPhase('result'), 800);
  };

  if (phase === 'result') return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '2px', color: ACCENT, marginBottom: '12px' }}>Analisis completado</div>
      <h3 style={{ fontFamily: "'LEMON MILK',sans-serif", fontSize: '20px', color: '#FFF', marginBottom: '20px' }}>{pts} / {redFlagMessages.length * 25} pts</h3>
      <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, marginBottom: '24px', maxWidth: '380px', margin: '0 auto 24px' }}>El grooming escala gradualmente. Reconocer estas frases en el momento es la defensa más poderosa.</p>
      <button onClick={() => onComplete(pts)} style={{ padding: '14px 32px', borderRadius: '12px', background: ACCENT, color: '#FFF', border: 'none', fontFamily: "'LEMON MILK',sans-serif", fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}>RECLAMAR XP</button>
    </div>
  );

  return (
    <div>
      {xpPop > 0 && <XpPop amount={xpPop} onDone={() => setXpPop(0)} />}
      <ProgressBar label={`${Object.keys(answered).length} de ${redFlagMessages.length} analizados`} current={Object.keys(answered).length} max={redFlagMessages.length} color={ACCENT} />
      <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '14px', lineHeight: 1.5 }}>
        Cada frase puede aparecer en un chat real. Decide si es una red flag o no.
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '340px', overflowY: 'auto', paddingRight: '4px' }}>
        {redFlagMessages.map(msg => {
          const ans = answered[msg.id];
          const fb = feedback[msg.id];
          return (
            <div key={msg.id} style={{ background: ans !== undefined ? (fb?.correct ? 'rgba(39,174,96,0.08)' : 'rgba(255,60,80,0.08)') : 'rgba(0,0,0,0.3)', border: `1px solid ${ans !== undefined ? (fb?.correct ? 'rgba(39,174,96,0.25)' : 'rgba(255,60,80,0.25)') : 'rgba(255,255,255,0.06)'}`, borderRadius: '12px', padding: '14px', transition: 'all 0.3s', animation: 'slideUpIn 0.3s ease' }}>
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.9)', margin: '0 0 10px', lineHeight: 1.5, fontStyle: 'italic' }}>{msg.text}</p>
              {ans === undefined ? (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => handleAnswer(msg.id, true)} style={{ flex: 1, padding: '8px', borderRadius: '8px', background: 'rgba(255,80,80,0.1)', border: '1px solid rgba(255,80,80,0.2)', color: '#FF8A95', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Red Flag</button>
                  <button onClick={() => handleAnswer(msg.id, false)} style={{ flex: 1, padding: '8px', borderRadius: '8px', background: 'rgba(116,179,206,0.1)', border: '1px solid rgba(116,179,206,0.2)', color: ACCENT, fontSize: '11px', fontWeight: 'bold', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Normal</button>
                </div>
              ) : (
                <div style={{ fontSize: '12px', color: fb?.correct ? '#A9DFBF' : '#FF8A95', lineHeight: 1.5 }}>
                  <span style={{ fontWeight: 'bold' }}>{fb?.correct ? 'Correcto. ' : 'No exactamente. '}</span>{fb?.msg}
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
   MÓDULO 5 — CAPTURA DE PANTALLA
════════════════════════════════════════════════════════════ */

const screenshotChat = [
  { from: 'them', text: 'Hola, te sigo hace tiempo. Tus posts son muy buenos.' },
  { from: 'them', text: 'Estoy pasando por un momento complicado y algo tuyo me ayudó.' },
  { from: 'them', text: 'No le cuento esto a nadie, pero con vos me siento cómodo.' },
  { from: 'them', text: '¿Podemos hablar más seguido? Sos especial.' },
  { from: 'them', text: 'No deberías contarle esto a nadie, podría malentenderse.' },
];

const screenshotOptions = [
  { text: 'Sigo hablando, parece genuino', correct: false, pts: 0, explanation: 'La combinacion de halago + secreto + urgencia emocional es un patrón de grooming. No importa que "parezca genuino".' },
  { text: 'Lo bloqueo sin decirle nada', correct: false, pts: 15, explanation: 'Bloquear es válido, pero no alcanza. Esta conversacion merece ser reportada y comentada con alguien de confianza.' },
  { text: 'Hago captura, reporto y se lo muestro a alguien de confianza', correct: true, pts: 70, explanation: 'Perfecto. Guardar evidencia, reportar dentro de la plataforma y pedir ayuda a un adulto es la respuesta mas completa.' },
  { text: 'Le pregunto por qué pide tanto secreto', correct: false, pts: 10, explanation: 'Confrontar al groomer raramente cambia la situacion y puede aumentar la presion. Es mejor no seguir interactuando.' },
];

function ScreenshotModule({ onComplete, onXp }: { onComplete: (pts: number) => void; onXp: (n: number) => void }) {
  const [chosen, setChosen] = useState<number | null>(null);
  const [xpPop, setXpPop] = useState(0);

  const handleChoice = (i: number) => {
    setChosen(i);
    const opt = screenshotOptions[i];
    if (opt.pts > 0) { setXpPop(opt.pts); onXp(opt.pts); }
  };

  return (
    <div>
      {xpPop > 0 && <XpPop amount={xpPop} onDone={() => setXpPop(0)} />}
      <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', color: 'rgba(255,255,255,0.4)', marginBottom: '12px' }}>Analizá esta conversacion completa</div>

      <div style={{ background: 'rgba(0,0,0,0.4)', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.06)', padding: '14px', marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingBottom: '10px', borderBottom: '1px solid rgba(255,255,255,0.05)', marginBottom: '4px' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(135deg, #764ba2, #667eea)', flexShrink: 0 }} />
          <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#FFF' }}>usuario_desconocido</span>
          <span style={{ marginLeft: 'auto', fontSize: '10px', color: 'rgba(255,255,255,0.3)' }}>hace 20 min</span>
        </div>
        {screenshotChat.map((m, i) => (
          <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'flex-end', animation: `slideUpIn 0.3s ease ${i * 0.1}s both` }}>
            <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'linear-gradient(135deg, #764ba2, #667eea)', flexShrink: 0 }} />
            <div style={{ background: 'rgba(116,179,206,0.09)', border: '1px solid rgba(116,179,206,0.1)', padding: '8px 12px', borderRadius: '14px 14px 14px 3px', fontSize: '12px', color: '#FFF', maxWidth: '85%', lineHeight: 1.5 }}>{m.text}</div>
          </div>
        ))}
      </div>

      {chosen === null ? (
        <div>
          <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', color: 'rgba(255,255,255,0.4)', marginBottom: '10px' }}>¿Que hacés?</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {screenshotOptions.map((opt, i) => (
              <button key={i} onClick={() => handleChoice(i)} style={{ padding: '12px 15px', borderRadius: '10px', textAlign: 'left', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.85)', fontSize: '13px', lineHeight: 1.4, cursor: 'pointer', transition: 'all 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = GLASS_BORDER)}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}
              >{opt.text}</button>
            ))}
          </div>
        </div>
      ) : (
        <div style={{ animation: 'slideUpIn 0.4s ease' }}>
          <FeedbackBox message={`${screenshotOptions[chosen].correct ? 'Respuesta correcta.' : 'No es la mejor opcion.'} ${screenshotOptions[chosen].explanation}`} type={screenshotOptions[chosen].correct ? 'success' : screenshotOptions[chosen].pts > 0 ? 'warn' : 'danger'} />
          <button onClick={() => onComplete(screenshotOptions[chosen].pts)} style={{ width: '100%', marginTop: '12px', padding: '14px', borderRadius: '12px', background: ACCENT, color: '#FFF', border: 'none', fontFamily: "'LEMON MILK',sans-serif", fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}>RECLAMAR XP</button>
        </div>
      )}
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

  const [view, setView] = useState<View>('intro');
  const [username, setUsername] = useState('');
  const [xp, setXp] = useState(0);
  const [activeModule, setActiveModule] = useState<ModuleId | null>(null);
  const [completedModules, setCompletedModules] = useState<Set<ModuleId>>(new Set());

  const handleXp = useCallback((n: number) => setXp(p => p + n), []);
  const handleComplete = (id: ModuleId, pts: number) => {
    setCompletedModules(prev => new Set([...prev, id]));
    setActiveModule(null);
  };

  const missions: { id: ModuleId; title: string; tag: string; desc: string; xp: number; icon: string }[] = [
    { id: 'dm_sim', title: 'DM Peligroso', tag: 'Simulador', desc: 'Un desconocido te escribe por privado. Reconocé sus tácticas antes de que sea tarde.', xp: 200, icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' },
    { id: 'profile_detector', title: 'Perfiles Falsos', tag: 'Detector', desc: 'Analizá perfiles de redes sociales y determiná cuáles son auténticos y cuáles son una trampa.', xp: 120, icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
    { id: 'story_path', title: 'Elegí tu Camino', tag: 'Historia', desc: 'Una situación en redes sociales evoluciona. Cada decisión que tomás cambia el resultado.', xp: 180, icon: 'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7' },
    { id: 'red_flags', title: 'Red Flag o No', tag: 'Análisis', desc: 'Fragmentos de conversaciones reales. Identificá cuáles contienen señales de alarma.', xp: 150, icon: 'M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9' },
    { id: 'screenshot_analysis', title: 'Qué harías vos', tag: 'Decisión', desc: 'Ves una conversación completa. ¿Cuál es la mejor respuesta ante lo que estás leyendo?', xp: 100, icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
  ];

  const totalXpPossible = missions.reduce((a, m) => a + m.xp, 0);

  return (
    <main style={{ background: BG_DARK, color: '#FFF', minHeight: '100vh', fontFamily: "'Altone',sans-serif", position: 'relative', overflowX: 'hidden' }}>
      <style>{`
        @import url('https://fonts.cdnfonts.com/css/lemon-milk');
        @import url('https://fonts.cdnfonts.com/css/altone');
        html { scroll-behavior: smooth; }
        * { box-sizing: border-box; }

        .btn-primary {
          transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          cursor: pointer;
        }
        .btn-primary:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 28px rgba(116,179,206,0.35) !important;
          opacity: 0.92;
        }
        .card-glass {
          background: ${GLASS_BG};
          backdrop-filter: blur(20px);
          border: 1px solid ${GLASS_BORDER};
          border-radius: 24px;
          transition: all 0.35s ease;
        }
        .card-glass:hover {
          border-color: ${ACCENT};
          box-shadow: 0 20px 40px rgba(0,0,0,0.5), 0 0 20px rgba(116,179,206,0.08);
        }
        .mission-card {
          background: rgba(255,255,255,0.025);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(116,179,206,0.12);
          border-radius: 22px;
          transition: all 0.3s ease;
          cursor: default;
        }
        .mission-card:hover {
          border-color: rgba(116,179,206,0.35);
          box-shadow: 0 16px 32px rgba(0,0,0,0.4), 0 0 14px rgba(116,179,206,0.07);
          transform: translateY(-2px);
        }
        .tag-pill {
          display: inline-flex;
          align-items: center;
          padding: 4px 10px;
          border-radius: 99px;
          background: rgba(116,179,206,0.1);
          border: 1px solid rgba(116,179,206,0.2);
          color: ${ACCENT};
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 1px;
          text-transform: uppercase;
        }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideUpIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes xpPop { 0% { opacity: 0; transform: translateY(0); } 20% { opacity: 1; transform: translateY(-15px); } 100% { opacity: 0; transform: translateY(-35px); } }
        @keyframes typingDot { 0%,100% { opacity: 0.3; transform: scale(0.8); } 50% { opacity: 1; transform: scale(1); } }
        @keyframes pulseGlow { 0%,100% { box-shadow: 0 0 0 0 rgba(116,179,206,0); } 50% { box-shadow: 0 0 0 8px rgba(116,179,206,0.08); } }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: rgba(255,255,255,0.03); }
        ::-webkit-scrollbar-thumb { background: rgba(116,179,206,0.3); border-radius: 99px; }
      `}</style>

      <ParticleNetwork />

      <div style={{ height: '5px', background: BRAND_GRADIENT, position: 'relative', zIndex: 51 }} />

      <header style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(5,18,43,0.75)', backdropFilter: 'blur(22px)', borderBottom: '1px solid rgba(116,179,206,0.1)' }}>
        <nav style={{ maxWidth: '1200px', margin: '0 auto', minHeight: '80px', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
          <a href="/" style={{ fontFamily: "'LEMON MILK',sans-serif", textDecoration: 'none', color: '#FFF', fontSize: '22px', fontWeight: 'bold', letterSpacing: '1px' }}>SAFENET</a>
          {view === 'world' ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(116,179,206,0.08)', padding: '6px 14px', borderRadius: '10px', border: '1px solid rgba(116,179,206,0.18)' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 6px rgba(74,222,128,0.6)' }} />
                <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#FFF' }}>@{username}</span>
              </div>
              <div style={{ background: ACCENT, color: '#051024', padding: '7px 14px', borderRadius: '8px', fontFamily: "'LEMON MILK',sans-serif", fontWeight: 'bold', fontSize: '11px', boxShadow: `0 0 14px rgba(116,179,206,0.3)` }}>{xp} XP</div>
            </div>
          ) : (
            <a href="/" style={{ fontFamily: "'LEMON MILK',sans-serif", textDecoration: 'none', color: '#FFF', fontSize: '11px', opacity: 0.5, letterSpacing: '1px' }}>SALIR</a>
          )}
        </nav>
      </header>

      <section style={{ padding: '80px 20px', position: 'relative', zIndex: 1 }}>
        {view === 'intro' && (
          <div style={{ maxWidth: '1100px', margin: '0 auto', animation: 'fadeIn 0.6s ease' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', alignItems: 'center', minHeight: '60vh' }}>
              <div>
                <div className="tag-pill" style={{ marginBottom: '28px' }}>Mundo Adolescentes</div>
                <h1 style={{ fontFamily: "'LEMON MILK',sans-serif", fontSize: 'clamp(32px,4.5vw,58px)', lineHeight: 1.05, color: '#FFF', marginBottom: '24px', letterSpacing: '-0.5px' }}>
                  EL GROOMING<br /><span style={{ color: ACCENT }}>EMPIEZA ASÍ.</span>
                </h1>
                <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.8, maxWidth: '460px', marginBottom: '36px' }}>
                  Conversaciones que parecen normales. Perfiles que parecen reales. Decisiones que parecen pequeñas. Entrenate para reconocer lo que no siempre es obvio.
                </p>
                <button onClick={() => setView('setup')} className="btn-primary" style={{ padding: '16px 30px', borderRadius: '12px', background: ACCENT, color: '#FFF', border: 'none', fontFamily: "'LEMON MILK',sans-serif", fontSize: '13px', fontWeight: 'bold', letterSpacing: '0.5px' }}>
                  ENTRAR AL MUNDO
                </button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {['Simulador de DM real', 'Detector de perfiles falsos', 'Historias interactivas', 'Analisis de conversaciones'].map((item, i) => (
                  <div key={i} className="card-glass" style={{ padding: '20px', borderRadius: '16px', animation: `fadeIn 0.6s ease ${0.1 * i}s both` }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(116,179,206,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.85)', lineHeight: 1.4, fontWeight: '500' }}>{item}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {view === 'setup' && (
          <div style={{ maxWidth: '520px', margin: '0 auto', animation: 'fadeIn 0.5s ease' }}>
            <div className="card-glass" style={{ padding: '48px 44px', border: '1px solid rgba(116,179,206,0.25)' }}>
              <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '2px', color: ACCENT, marginBottom: '8px' }}>Tu identidad</div>
              <h2 style={{ fontFamily: "'LEMON MILK',sans-serif", fontSize: '22px', color: '#FFF', marginBottom: '36px' }}>¿Con qué nombre entrás?</h2>
              <div style={{ marginBottom: '32px' }}>
                <label style={{ fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: '10px', letterSpacing: '1px' }}>Nombre de usuario</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)', fontSize: '16px' }}>@</span>
                  <input
                    type="text"
                    value={username}
                    onChange={e => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '').slice(0, 20))}
                    placeholder="tu_usuario"
                    style={{ width: '100%', padding: '16px 16px 16px 34px', borderRadius: '12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(116,179,206,0.25)', color: '#FFF', outline: 'none', fontSize: '15px', fontFamily: "'Altone',sans-serif" }}
                  />
                </div>
                {username.length > 0 && username.length < 3 && <div style={{ fontSize: '12px', color: 'rgba(255,140,140,0.8)', marginTop: '8px' }}>Mínimo 3 caracteres</div>}
              </div>
              <button
                disabled={username.length < 3}
                onClick={() => setView('world')}
                className="btn-primary"
                style={{ width: '100%', padding: '16px', borderRadius: '12px', background: username.length >= 3 ? ACCENT : 'rgba(255,255,255,0.06)', color: '#FFF', border: 'none', fontFamily: "'LEMON MILK',sans-serif", fontSize: '13px', fontWeight: 'bold', opacity: username.length >= 3 ? 1 : 0.5 }}
              >
                EMPEZAR
              </button>
            </div>
          </div>
        )}

        {view === 'world' && (
          <div style={{ maxWidth: '1200px', margin: '0 auto', animation: 'fadeIn 0.5s ease' }}>
            <div style={{ marginBottom: '48px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <div className="tag-pill" style={{ marginBottom: '12px' }}>Mundo Adolescentes</div>
                  <h2 style={{ fontFamily: "'LEMON MILK',sans-serif", fontSize: 'clamp(22px,3.5vw,38px)', color: '#FFF', margin: '0 0 8px 0' }}>
                    PANEL DE <span style={{ color: ACCENT }}>EXPERIENCIAS</span>
                  </h2>
                  <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.55)', margin: 0 }}>Bienvenido, @{username}. Elegí por dónde empezar.</p>
                </div>
                <div style={{ background: 'rgba(116,179,206,0.06)', border: '1px solid rgba(116,179,206,0.15)', borderRadius: '16px', padding: '16px 24px', minWidth: '180px' }}>
                  <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px', color: 'rgba(255,255,255,0.4)', marginBottom: '8px' }}>Progreso general</div>
                  <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#FFF', marginBottom: '4px' }}>{xp}<span style={{ fontSize: '14px', color: ACCENT, marginLeft: '4px' }}>xp</span></div>
                  <div style={{ height: '4px', background: 'rgba(255,255,255,0.07)', borderRadius: '99px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${Math.min(100, Math.round((xp / totalXpPossible) * 100))}%`, background: ACCENT, transition: 'width 0.8s ease', borderRadius: '99px' }} />
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
              {missions.map((m, i) => {
                const done = completedModules.has(m.id);
                return (
                  <article key={m.id} className="mission-card" style={{ padding: '32px', animation: `fadeIn 0.5s ease ${i * 0.07}s both`, borderLeft: done ? `3px solid ${ACCENT}` : undefined }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                      <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(116,179,206,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(116,179,206,0.15)' }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={m.icon} /></svg>
                      </div>
                      <span className="tag-pill">{m.tag}</span>
                    </div>
                    <h3 style={{ fontFamily: "'LEMON MILK',sans-serif", fontSize: '16px', color: '#FFF', marginBottom: '10px', letterSpacing: '0.3px' }}>{m.title}</h3>
                    <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, marginBottom: '28px' }}>{m.desc}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#FFD700' }} />
                        <span style={{ fontSize: '11px', color: '#FFD700', fontWeight: 'bold' }}>+{m.xp} XP</span>
                      </div>
                      <button
                        onClick={() => setActiveModule(m.id)}
                        className="btn-primary"
                        style={{ padding: '10px 20px', borderRadius: '9px', background: done ? 'rgba(116,179,206,0.12)' : ACCENT, color: '#FFF', border: done ? `1px solid ${ACCENT}` : 'none', fontFamily: "'LEMON MILK',sans-serif", fontSize: '11px', fontWeight: 'bold', letterSpacing: '0.5px' }}
                      >
                        {done ? 'REPETIR' : 'INICIAR'}
                      </button>
                    </div>
                    {done && (
                      <div style={{ marginTop: '14px', paddingTop: '14px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#4ade80' }} />
                        <span style={{ fontSize: '11px', color: 'rgba(74,222,128,0.8)' }}>Completado</span>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          </div>
        )}
      </section>

      {activeModule && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(5,12,30,0.97)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', animation: 'fadeIn 0.25s ease' }}>
          <div style={{ maxWidth: '560px', width: '100%', maxHeight: '90vh', overflowY: 'auto', background: 'rgba(8,20,45,0.99)', border: '1px solid rgba(116,179,206,0.18)', borderRadius: '24px', padding: '36px', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', paddingBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <div>
                <span className="tag-pill" style={{ marginBottom: '6px', display: 'inline-flex' }}>{missions.find(m => m.id === activeModule)?.tag}</span>
                <div style={{ fontFamily: "'LEMON MILK',sans-serif", fontSize: '16px', color: '#FFF' }}>{missions.find(m => m.id === activeModule)?.title}</div>
              </div>
              <button
                onClick={() => setActiveModule(null)}
                style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#FFF'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; }}
              >✕</button>
            </div>

            {activeModule === 'dm_sim' && <DmSimModule onComplete={pts => handleComplete('dm_sim', pts)} onXp={handleXp} />}
            {activeModule === 'profile_detector' && <ProfileDetectorModule onComplete={pts => handleComplete('profile_detector', pts)} onXp={handleXp} />}
            {activeModule === 'story_path' && <StoryPathModule onComplete={pts => handleComplete('story_path', pts)} onXp={handleXp} />}
            {activeModule === 'red_flags' && <RedFlagsModule onComplete={pts => handleComplete('red_flags', pts)} onXp={handleXp} />}
            {activeModule === 'screenshot_analysis' && <ScreenshotModule onComplete={pts => handleComplete('screenshot_analysis', pts)} onXp={handleXp} />}
          </div>
        </div>
      )}

      <footer style={{ background: 'rgba(5,12,25,0.9)', borderTop: '1px solid rgba(116,179,206,0.08)', padding: '36px 20px', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ fontFamily: "'LEMON MILK',sans-serif", fontSize: '18px', fontWeight: 'bold', color: '#FFF', opacity: 0.85 }}>SAFENET WORLD</div>
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)' }}>2026 · Prevención del grooming · Mundo Adolescentes</div>
        </div>
      </footer>
    </main>
  );
}