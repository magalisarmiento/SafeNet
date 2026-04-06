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
   MODULES LOGIC (ORIGINAL)
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
    { text: '¡Hola! Soy GamerPro_X', isSafe: false, points: 0, consequence: 'No compartas tu nombre con desconocidos.', consequenceType: 'danger' },
    { text: 'Hola, prefiero no decirte mi nombre', isSafe: true, points: 30, consequence: '¡Excelente! Tu nombre es privado.', consequenceType: 'success' },
  ],
  1: [
    { text: '¡Qué copado, jugamos juntos!', isSafe: false, points: 0, consequence: 'Los desconocidos pueden mentir sobre su edad.', consequenceType: 'danger' },
    { text: 'No sé si sos quien decís ser...', isSafe: true, points: 30, consequence: '¡Muy inteligente! Desconfiar te protege.', consequenceType: 'success' },
  ],
  2: [
    { text: 'Sí, mi WhatsApp es...', isSafe: false, points: 0, consequence: '¡Nunca des tu teléfono a desconocidos!', consequenceType: 'danger' },
    { text: 'No, solo hablo dentro del juego', isSafe: true, points: 40, consequence: '¡Perfecto! Hablar solo en el juego es seguro.', consequenceType: 'success' },
  ],
  3: [
    { text: 'Ok, te mando una...', isSafe: false, points: 0, consequence: '¡Peligro! Nunca envíes fotos a desconocidos.', consequenceType: 'danger' },
    { text: 'No. Esto es raro. ¡Te bloqueo!', isSafe: true, points: 50, consequence: '¡Héroe! Bloquear es la mejor defensa.', consequenceType: 'success' },
  ],
  4: [
    { text: '¡Qué bueno! Te paso mi dirección', isSafe: false, points: 0, consequence: '¡Peligro máximo! Jamás des tu dirección.', consequenceType: 'danger' },
    { text: 'Algo está mal. Aviso a un adulto', isSafe: true, points: 50, consequence: '¡Perfecto! Pedí ayuda siempre que dudes.', consequenceType: 'success' },
  ],
};

const scenarios: any[] = [
  { id: 1, level: 1, situation: 'Un amigo te invita a un chat con adultos desconocidos. Dicen: "es un secreto nuestro". ¿Qué hacés?', options: [{ text: 'Me quedo a ver qué pasa', isSafe: false, points: 0, feedback: 'Los secretos con desconocidos son peligrosos.', feedbackType: 'danger' }, { text: 'Me salgo y aviso a mamá o papá', isSafe: true, points: 40, feedback: '¡Excelente! Contar lo que pasa te protege.', feedbackType: 'success' }, { text: 'Le pregunto a mi amigo si es seguro', isSafe: false, points: 15, feedback: 'Cuidado: tu amigo también puede estar engañado.', feedbackType: 'info' }] },
  { id: 2, level: 1, situation: 'Un desconocido te regala una skin si le mandás una foto tuya sonriendo. ¿Aceptás?', options: [{ text: 'Le mando la foto', isSafe: false, points: 0, feedback: 'Nunca mandes fotos a gente que no conocés.', feedbackType: 'danger' }, { text: 'Le digo que no y lo reporto', isSafe: true, points: 50, feedback: '¡Perfecto! Reportar protege a toda la comunidad.', feedbackType: 'success' }] },
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
    <div style={{ textAlign: 'center' }}>
      <h3 style={{ fontFamily: "'LEMON MILK', sans-serif", fontSize: '20px', color: '#74B3CE', marginBottom: '16px' }}>MISION COMPLETADA</h3>
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
   NUEVO MODULO 1: SOPA DE LETRAS
════════════════════════════════ */

const WORD_SEARCH_WORDS = ['GROOMING', 'SECRETO', 'AYUDA', 'BLOQUEAR', 'DENUNCIAR', 'CONFIANZA'];
const GRID_SIZE = 12;

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

  // Fill remaining with random letters
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

  const wordColors = ['#74B3CE', '#27ae60', '#FFD700', '#e74c3c', '#9b59b6', '#e67e22'];

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
        setLastFeedback({ text: `Encontraste: ${word} +${pts} XP`, type: 'success' });
        if (newFound.size === WORD_SEARCH_WORDS.length) {
          setTimeout(() => setPhase('result'), 1500);
        }
        return true;
      }
    }
    setLastFeedback({ text: 'Esa no es una palabra de la lista, sigue buscando.', type: 'info' });
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
    // Build straight line from first to current
    const dr = r - first[0];
    const dc = c - first[1];
    const len = Math.max(Math.abs(dr), Math.abs(dc));
    if (len === 0) { setSelectedCells([first]); return; }
    const stepR = len > 0 ? dr / len : 0;
    const stepC = len > 0 ? dc / len : 0;
    if (Math.abs(stepR) > 1 || Math.abs(stepC) > 1) return; // Not a straight line
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
      <h3 style={{ fontFamily: "'LEMON MILK', sans-serif", fontSize: '20px', color: '#74B3CE', marginBottom: '16px' }}>SOPA COMPLETADA</h3>
      <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#FFFFFF', marginBottom: '8px' }}>{foundWords.size * 30} XP</div>
      <p style={{ color: '#A5D2E5', marginBottom: '24px', fontSize: '14px' }}>Encontraste {foundWords.size} palabras clave</p>
      <button onClick={() => onComplete(foundWords.size * 30)} className="btn-game" style={{ padding: '16px 32px', borderRadius: '12px', background: '#74B3CE', color: '#FFFFFF', border: 'none', fontSize: '13px', fontWeight: 'bold' }}>RECLAMAR XP</button>
    </div>
  );

  return (
    <div>
      {showXp > 0 && <XpPop amount={showXp} onDone={() => setShowXp(0)} />}
      <MissionBar label="Palabras Encontradas" current={foundWords.size} max={WORD_SEARCH_WORDS.length} color="#74B3CE" />

      {lastFeedback && <FeedbackBox message={lastFeedback.text} type={lastFeedback.type} />}

      {/* Word list */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
        {WORD_SEARCH_WORDS.map((w, i) => (
          <span key={w} style={{
            padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold',
            fontFamily: "'LEMON MILK', sans-serif",
            background: foundWords.has(w) ? wordColors[i % wordColors.length] + '30' : 'rgba(255,255,255,0.05)',
            color: foundWords.has(w) ? wordColors[i % wordColors.length] : 'rgba(255,255,255,0.4)',
            textDecoration: foundWords.has(w) ? 'line-through' : 'none',
            border: `1px solid ${foundWords.has(w) ? wordColors[i % wordColors.length] + '60' : 'rgba(255,255,255,0.08)'}`,
            transition: 'all 0.3s ease'
          }}>{w}</span>
        ))}
      </div>

      {/* Grid */}
      <div
        onMouseLeave={handleCellEnd}
        onMouseUp={handleCellEnd}
        style={{ display: 'grid', gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`, gap: '2px', userSelect: 'none', cursor: 'crosshair' }}
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
                  borderRadius: '4px', fontSize: '11px', fontWeight: 'bold',
                  fontFamily: "'LEMON MILK', sans-serif",
                  background: isHighlighted ? hlColor + '30' : isSelected ? 'rgba(116,179,206,0.3)' : 'rgba(255,255,255,0.03)',
                  color: isHighlighted ? hlColor : isSelected ? '#74B3CE' : 'rgba(255,255,255,0.6)',
                  border: `1px solid ${isHighlighted ? hlColor + '50' : isSelected ? 'rgba(116,179,206,0.5)' : 'rgba(255,255,255,0.05)'}`,
                  transition: 'all 0.15s ease',
                  transform: isSelected ? 'scale(1.1)' : 'scale(1)',
                  cursor: 'crosshair',
                }}
              >
                {letter}
              </div>
            );
          })
        )}
      </div>
      <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', textAlign: 'center', marginTop: '12px' }}>
        ARRASTRÁ EL MOUSE PARA SELECCIONAR PALABRAS
      </p>
    </div>
  );
}

/* ════════════════════════════════
   NUEVO MODULO 2: CLASIFICAR
════════════════════════════════ */

const classifyCards = [
  { id: 1, text: 'Me pide una foto por privado', correct: 'danger', explanation: 'Pedir fotos es una señal de alerta grave.' },
  { id: 2, text: 'Juego con amigos de mi escuela', correct: 'safe', explanation: 'Jugar con conocidos de confianza es seguro.' },
  { id: 3, text: 'Un desconocido me habla por chat', correct: 'danger', explanation: 'Los desconocidos online pueden no ser quienes dicen ser.' },
  { id: 4, text: 'Le cuento un secreto solo a él', correct: 'danger', explanation: 'Los secretos con desconocidos son señal de grooming.' },
  { id: 5, text: 'Aviso a un adulto si algo me molesta', correct: 'safe', explanation: 'Siempre hay que contar a un adulto de confianza.' },
  { id: 6, text: 'Me pide que no cuente nada a mis padres', correct: 'danger', explanation: 'Pedir silencio a tus padres es una alarma roja.' },
  { id: 7, text: 'Bloqueo a quien me molesta', correct: 'safe', explanation: 'Bloquear es una herramienta de protección importante.' },
  { id: 8, text: 'Un adulto quiere ser mi amigo especial online', correct: 'danger', explanation: 'Un adulto que busca amistad especial con niños es sospechoso.' },
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

  const handleClassify = (choice: 'safe' | 'danger') => {
    if (feedback) return;
    const correct = choice === card.correct;
    const pts = correct ? 35 : 0;
    setFeedback({
      text: correct ? `Correcto. ${card.explanation}` : `Incorrecto. ${card.explanation}`,
      type: correct ? 'success' : 'danger',
      pts
    });
    if (pts > 0) { setScore(p => p + pts); setShowXp(pts); onXp(pts); }
    setAnimClass(correct ? 'card-correct' : 'card-wrong');

    setTimeout(() => {
      setFeedback(null);
      setAnimClass('');
      if (current + 1 >= remaining.length) setPhase('result');
      else setCurrent(p => p + 1);
    }, 2500);
  };

  if (phase === 'result') return (
    <div style={{ textAlign: 'center' }}>
      <h3 style={{ fontFamily: "'LEMON MILK', sans-serif", fontSize: '20px', color: '#74B3CE', marginBottom: '16px' }}>CLASIFICACION COMPLETA</h3>
      <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#FFFFFF', marginBottom: '8px' }}>{score} pts</div>
      <p style={{ color: '#A5D2E5', marginBottom: '24px', fontSize: '13px' }}>Clasificaste {remaining.length} situaciones</p>
      <button onClick={() => onComplete(score)} className="btn-game" style={{ padding: '16px 32px', borderRadius: '12px', background: '#74B3CE', color: '#FFFFFF', border: 'none', fontSize: '13px', fontWeight: 'bold' }}>RECLAMAR XP</button>
    </div>
  );

  return (
    <div>
      {showXp > 0 && <XpPop amount={showXp} onDone={() => setShowXp(0)} />}
      <MissionBar label="Tarjetas Clasificadas" current={current} max={remaining.length} color="#74B3CE" />

      {/* Card */}
      <div className={animClass} style={{
        background: 'rgba(255,255,255,0.05)', borderRadius: '20px', padding: '32px 24px',
        textAlign: 'center', marginBottom: '20px', border: '1px solid rgba(116,179,206,0.2)',
        minHeight: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center',
        animation: 'slideUpIn 0.4s ease', transition: 'all 0.3s ease'
      }}>
        <p style={{ fontSize: '17px', color: '#FFFFFF', lineHeight: 1.5, margin: 0, fontWeight: '500' }}>
          {card?.text}
        </p>
      </div>

      {feedback && <FeedbackBox message={feedback.text} type={feedback.type} />}

      {/* Classification buttons */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '16px' }}>
        <button
          onClick={() => handleClassify('safe')}
          disabled={!!feedback}
          className="btn-game"
          style={{
            padding: '20px 16px', borderRadius: '14px', fontSize: '13px', fontWeight: 'bold',
            background: 'rgba(39, 174, 96, 0.1)', border: '2px solid rgba(39,174,96,0.4)',
            color: '#A9DFBF', opacity: !!feedback ? 0.5 : 1,
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px'
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#27ae60" strokeWidth="2.5"><polyline points="20,6 9,17 4,12" /></svg>
          SEGURO
        </button>
        <button
          onClick={() => handleClassify('danger')}
          disabled={!!feedback}
          className="btn-game"
          style={{
            padding: '20px 16px', borderRadius: '14px', fontSize: '13px', fontWeight: 'bold',
            background: 'rgba(255, 60, 80, 0.1)', border: '2px solid rgba(255,60,80,0.4)',
            color: '#FF8A95', opacity: !!feedback ? 0.5 : 1,
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px'
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FF3C50" strokeWidth="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
          RIESGOSO
        </button>
      </div>
      <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', textAlign: 'center', marginTop: '12px' }}>
        TARJETA {current + 1} DE {remaining.length}
      </p>
    </div>
  );
}

/* ════════════════════════════════
   NUEVO MODULO 3: LABERINTO
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
    text: 'Estas jugando online y un desconocido te escribe: "Hola, eres muy bueno jugando. Podemos ser amigos".',
    choices: [
      { text: 'Le respondo y le doy mi nombre', next: 'gave_name', isSafe: false, feedback: 'Dar tu nombre real a desconocidos online es riesgoso.' },
      { text: 'No respondo y sigo jugando', next: 'ignored', isSafe: true, feedback: 'Ignorar a desconocidos es una decision inteligente.' },
    ]
  },
  gave_name: {
    id: 'gave_name',
    text: 'Ahora te pregunta: "Genial! Tengo 12 años igual que vos. Dame tu WhatsApp para coordinar partidas."',
    choices: [
      { text: 'Le paso mi numero', next: 'gave_phone', isSafe: false, feedback: 'Nunca compartas tu telefono con desconocidos online.' },
      { text: 'Me niego y corto la conversacion', next: 'cut_off', isSafe: true, feedback: 'Muy bien! Cortar el contacto fue lo correcto.' },
    ]
  },
  ignored: {
    id: 'ignored',
    text: 'Insiste varias veces. Dice: "No seas timido, solo quiero jugar. Te regalo items si me mandas una foto."',
    choices: [
      { text: 'Le mando una foto', next: 'gave_photo', isSafe: false, feedback: 'Las fotos a desconocidos son muy peligrosas.' },
      { text: 'Lo bloqueo y reporto inmediatamente', next: 'blocked', isSafe: true, feedback: 'Bloquear y reportar es exactamente lo que debes hacer.' },
    ]
  },
  gave_phone: {
    id: 'gave_phone',
    text: 'Ahora te pide que se encuentren en persona "para jugar juntos". Dice que sus padres no lo saben.',
    choices: [
      { text: 'Acepto encontrarme', next: 'bad_end', isSafe: false, feedback: 'Nunca te reunes con desconocidos de internet.' },
      { text: 'Me asusto y aviso a mis padres', next: 'told_parents', isSafe: true, feedback: 'Contarle a tus padres fue la decision correcta.' },
    ]
  },
  cut_off: {
    id: 'cut_off',
    text: 'Cortaste el contacto. Pero ahora aparece con otro usuario y sigue intentando hablar contigo.',
    choices: [
      { text: 'Lo reporto a la plataforma', next: 'reported', isSafe: true, feedback: 'Reportar ayuda a proteger a otros jugadores tambien.' },
      { text: 'Le respondo enojado', next: 'engaged', isSafe: false, feedback: 'Responder cualquier cosa mantiene el contacto activo.' },
    ]
  },
  gave_photo: {
    id: 'gave_photo',
    text: 'Usando tu foto, te amenaza: "Si no me mandas mas fotos, muestro esta a todos tu escuela."',
    choices: [
      { text: 'Cedo a la presion y mando mas', next: 'bad_end', isSafe: false, feedback: 'Nunca cedas ante chantajes, esto empeora la situacion.' },
      { text: 'Aviso inmediatamente a un adulto', next: 'good_end', isSafe: true, feedback: 'Contar esto a un adulto de confianza es fundamental.' },
    ]
  },
  blocked: {
    id: 'blocked',
    text: 'Lo bloqueaste y reportaste. Un moderador te agradece por el reporte. Avisas a tus padres sobre lo ocurrido.',
    isEnd: true, isGoodEnd: true
  },
  told_parents: {
    id: 'told_parents',
    text: 'Tus padres reportaron el caso. La policia identifico que era un adulto que se hacia pasar por nino. Tu accion ayudo a proteger a otros.',
    isEnd: true, isGoodEnd: true
  },
  reported: {
    id: 'reported',
    text: 'Tu reporte ayudo a que la plataforma bloqueara esa cuenta. Contaste a tus padres y todo quedo registrado.',
    isEnd: true, isGoodEnd: true
  },
  engaged: {
    id: 'engaged',
    text: 'Al responder enojado, el desconocido tiene mas informacion tuya. Ahora intenta encontrarte en persona. Busca ayuda de un adulto ya.',
    choices: [
      { text: 'Aviso ahora a mis padres', next: 'good_end', isSafe: true, feedback: 'Aunque tarde, contar a tus padres siempre es lo correcto.' },
    ]
  },
  bad_end: {
    id: 'bad_end',
    text: 'Las decisiones tomadas pusieron en riesgo tu seguridad. Recuerda: ante cualquier situacion incomoda online, siempre hay que contarselo a un adulto de confianza.',
    isEnd: true, isGoodEnd: false
  },
  good_end: {
    id: 'good_end',
    text: 'Contaste lo que paso a tus padres. Juntos reportaron el caso y obtuviste apoyo profesional. Tu valentia ayudo a que otros ninos estuvieran mas seguros.',
    isEnd: true, isGoodEnd: true
  },
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
      <div style={{
        width: '80px', height: '80px', borderRadius: '50%', margin: '0 auto 20px',
        background: node.isGoodEnd ? 'rgba(39,174,96,0.15)' : 'rgba(255,60,80,0.15)',
        border: `2px solid ${node.isGoodEnd ? 'rgba(39,174,96,0.5)' : 'rgba(255,60,80,0.5)'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        {node.isGoodEnd
          ? <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#27ae60" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          : <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#FF3C50" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
        }
      </div>
      <h3 style={{ fontFamily: "'LEMON MILK', sans-serif", fontSize: '16px', color: node.isGoodEnd ? '#27ae60' : '#FF3C50', marginBottom: '16px' }}>
        {node.isGoodEnd ? 'BUEN FINAL' : 'FIN ALTERNATIVO'}
      </h3>
      <p style={{ fontSize: '14px', color: '#FFFFFF', lineHeight: 1.6, marginBottom: '24px', opacity: 0.85 }}>{node.text}</p>
      <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#FFFFFF', marginBottom: '20px' }}>{score} pts</div>
      <button onClick={() => onComplete(score)} className="btn-game" style={{ padding: '16px 32px', borderRadius: '12px', background: '#74B3CE', color: '#FFFFFF', border: 'none', fontSize: '13px', fontWeight: 'bold' }}>RECLAMAR XP</button>
    </div>
  );

  return (
    <div>
      {showXp > 0 && <XpPop amount={showXp} onDone={() => setShowXp(0)} />}
      <MissionBar label="Progreso del Laberinto" current={depth} max={5} color="#74B3CE" />

      {/* Path indicator */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '16px', justifyContent: 'center' }}>
        {history.map((h, i) => (
          <div key={i} style={{
            width: '8px', height: '8px', borderRadius: '50%',
            background: i === history.length - 1 ? '#74B3CE' : 'rgba(116,179,206,0.3)',
            transition: 'all 0.3s ease'
          }} />
        ))}
      </div>

      <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '16px', padding: '24px', marginBottom: '20px', border: '1px solid rgba(255,255,255,0.08)', animation: 'slideUpIn 0.4s ease' }}>
        <p style={{ fontSize: '15px', color: '#FFFFFF', lineHeight: 1.7, margin: 0 }}>{node.text}</p>
      </div>

      {lastFeedback && <FeedbackBox message={lastFeedback.text} type={lastFeedback.type} />}

      {!lastFeedback && node.choices && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {node.choices.map((c, i) => (
            <button
              key={i}
              onClick={() => handleChoice(c)}
              className="btn-game"
              style={{ padding: '14px 18px', borderRadius: '12px', textAlign: 'left', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(116,179,206,0.15)', color: 'white', textTransform: 'none', fontSize: '14px', lineHeight: 1.4 }}
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
   NUEVO MODULO 4: CRUCIGRAMA
════════════════════════════════ */

type CrosswordClue = {
  id: number;
  direction: 'across' | 'down';
  clue: string;
  answer: string;
  row: number;
  col: number;
};

const crosswordClues: CrosswordClue[] = [
  { id: 1, direction: 'across', clue: 'Persona adulta que engana a ninos en internet haciendose pasar por amigo', answer: 'GROOMER', row: 0, col: 0 },
  { id: 2, direction: 'down', clue: 'Accion de impedir que alguien te contacte en una red social', answer: 'BLOQUEAR', row: 0, col: 4 },
  { id: 3, direction: 'across', clue: 'Lo que debes hacer si algo en internet te hace sentir incomodo', answer: 'AVISAR', row: 3, col: 1 },
  { id: 4, direction: 'down', clue: 'Adulto de confianza a quien debes contarle lo que pasa', answer: 'PADRE', row: 2, col: 0 },
  { id: 5, direction: 'across', clue: 'Informacion personal que no debes compartir online', answer: 'DATOS', row: 6, col: 2 },
];

// Build a simple crossword grid
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
  const inputRefs = useRef<Record<string, HTMLInputElement>>({});

  const cellKey = (r: number, c: number) => `${r},${c}`;

  const handleInput = (r: number, c: number, value: string) => {
    const key = cellKey(r, c);
    const newInputs = { ...userInputs, [key]: value.toUpperCase().slice(-1) };
    setUserInputs(newInputs);

    // Check each clue
    const newCompleted = new Set(completed);
    const newErrors = new Set(errors);
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
        setLastFeedback({ text: `Pista ${clue.id} correcta: ${clue.answer}`, type: 'success' });
      }
    }

    if (newXp > 0) { setShowXp(newXp); onXp(newXp); }
    setCompleted(newCompleted);

    if (newCompleted.size === crosswordClues.length) {
      setTimeout(() => setPhase('result'), 1500);
    }

    // Auto-advance focus
    const activeC = crosswordClues.find(c => c.id === activeClue);
    if (activeC) {
      const next = activeC.direction === 'across'
        ? cellKey(r, c + 1)
        : cellKey(r + 1, c);
      if (inputRefs.current[next]) inputRefs.current[next].focus();
    }
  };

  if (phase === 'result') return (
    <div style={{ textAlign: 'center' }}>
      <h3 style={{ fontFamily: "'LEMON MILK', sans-serif", fontSize: '20px', color: '#74B3CE', marginBottom: '16px' }}>CRUCIGRAMA COMPLETADO</h3>
      <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#FFFFFF', marginBottom: '8px' }}>{completed.size * 40} pts</div>
      <button onClick={() => onComplete(completed.size * 40)} className="btn-game" style={{ padding: '16px 32px', borderRadius: '12px', background: '#74B3CE', color: '#FFFFFF', border: 'none', fontSize: '13px', fontWeight: 'bold' }}>RECLAMAR XP</button>
    </div>
  );

  const rows = 9, cols = 10;

  return (
    <div>
      {showXp > 0 && <XpPop amount={showXp} onDone={() => setShowXp(0)} />}
      <MissionBar label="Palabras Completadas" current={completed.size} max={crosswordClues.length} color="#74B3CE" />

      {lastFeedback && <FeedbackBox message={lastFeedback.text} type={lastFeedback.type} />}

      {/* Crossword Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: '2px', marginBottom: '16px' }}>
        {Array(rows).fill(null).map((_, r) =>
          Array(cols).fill(null).map((_, c) => {
            const cell = grid[r][c];
            const isActive = cell.letter !== '';
            const key = cellKey(r, c);
            const isCompleted = cell.clueIds.some(id => completed.has(id));
            const clueStart = crosswordClues.find(cl =>
              cl.row === r && cl.col === c
            );

            if (!isActive) return (
              <div key={key} style={{ aspectRatio: '1', background: '#020810', borderRadius: '3px' }} />
            );

            return (
              <div key={key} style={{ position: 'relative', aspectRatio: '1' }}>
                {clueStart && (
                  <span style={{
                    position: 'absolute', top: '1px', left: '2px', fontSize: '6px',
                    color: '#74B3CE', fontWeight: 'bold', zIndex: 2, lineHeight: 1
                  }}>{clueStart.id}</span>
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
                    background: isCompleted ? 'rgba(39,174,96,0.2)' : 'rgba(255,255,255,0.05)',
                    border: `1px solid ${isCompleted ? 'rgba(39,174,96,0.5)' : 'rgba(116,179,206,0.2)'}`,
                    color: isCompleted ? '#A9DFBF' : '#FFFFFF',
                    fontSize: '12px', fontWeight: 'bold', fontFamily: "'LEMON MILK', sans-serif",
                    outline: 'none', cursor: 'text', borderRadius: '3px',
                    textTransform: 'uppercase', padding: 0, boxSizing: 'border-box',
                    transition: 'all 0.2s ease'
                  }}
                />
              </div>
            );
          })
        )}
      </div>

      {/* Clues */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        {(['across', 'down'] as const).map(dir => (
          <div key={dir}>
            <div style={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', color: '#74B3CE', marginBottom: '8px', letterSpacing: '1px' }}>{dir === 'across' ? 'HORIZONTAL' : 'VERTICAL'}</div>
            {crosswordClues.filter(c => c.direction === dir).map(clue => (
              <div key={clue.id} onClick={() => setActiveClue(clue.id)} style={{
                padding: '6px 10px', borderRadius: '8px', marginBottom: '4px', cursor: 'pointer',
                background: activeClue === clue.id ? 'rgba(116,179,206,0.1)' : 'transparent',
                border: `1px solid ${activeClue === clue.id ? 'rgba(116,179,206,0.3)' : 'transparent'}`,
                transition: 'all 0.2s ease'
              }}>
                <span style={{ fontSize: '10px', fontWeight: 'bold', color: completed.has(clue.id) ? '#27ae60' : '#74B3CE', marginRight: '6px' }}>{clue.id}.</span>
                <span style={{ fontSize: '11px', color: completed.has(clue.id) ? '#A9DFBF' : 'rgba(255,255,255,0.6)', textDecoration: completed.has(clue.id) ? 'line-through' : 'none' }}>{clue.clue}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ════════════════════════════════
   NUEVO MODULO 5: PAREJAS (MATCHING)
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
        // Correct match
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
        // Wrong match
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
      <h3 style={{ fontFamily: "'LEMON MILK', sans-serif", fontSize: '20px', color: '#74B3CE', marginBottom: '16px' }}>PAREJAS COMPLETAS</h3>
      <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#FFFFFF', marginBottom: '8px' }}>{score} pts</div>
      <p style={{ color: '#A5D2E5', marginBottom: '24px', fontSize: '13px' }}>Conectaste {matched.size} conceptos clave</p>
      <button onClick={() => onComplete(score)} className="btn-game" style={{ padding: '16px 32px', borderRadius: '12px', background: '#74B3CE', color: '#FFFFFF', border: 'none', fontSize: '13px', fontWeight: 'bold' }}>RECLAMAR XP</button>
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
      <MissionBar label="Parejas Encontradas" current={matched.size} max={matchingPairs.length} color="#74B3CE" />
      <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', textAlign: 'center', marginBottom: '16px' }}>
        SELECCIONA UN CONCEPTO Y LUEGO SU DEFINICION
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        {/* Concepts column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', color: '#74B3CE', textAlign: 'center', marginBottom: '4px', letterSpacing: '1px' }}>CONCEPTOS</div>
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
                  padding: '12px 10px', borderRadius: '10px', fontSize: '11px', fontWeight: 'bold',
                  fontFamily: "'LEMON MILK', sans-serif",
                  background: isMatched ? 'rgba(39,174,96,0.15)' : isSelected ? 'rgba(116,179,206,0.2)' : isWrongAnim ? 'rgba(255,60,80,0.15)' : 'rgba(255,255,255,0.03)',
                  border: `2px solid ${isMatched ? 'rgba(39,174,96,0.5)' : isSelected ? 'rgba(116,179,206,0.6)' : isWrongAnim ? 'rgba(255,60,80,0.5)' : 'rgba(255,255,255,0.08)'}`,
                  color: isMatched ? '#A9DFBF' : isSelected ? '#74B3CE' : '#FFFFFF',
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

        {/* Definitions column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', color: '#74B3CE', textAlign: 'center', marginBottom: '4px', letterSpacing: '1px' }}>DEFINICIONES</div>
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
                  padding: '12px 10px', borderRadius: '10px', fontSize: '10px',
                  background: isMatched ? 'rgba(39,174,96,0.15)' : isSelected ? 'rgba(116,179,206,0.2)' : isWrongAnim ? 'rgba(255,60,80,0.15)' : 'rgba(255,255,255,0.03)',
                  border: `2px solid ${isMatched ? 'rgba(39,174,96,0.5)' : isSelected ? 'rgba(116,179,206,0.6)' : isWrongAnim ? 'rgba(255,60,80,0.5)' : 'rgba(255,255,255,0.08)'}`,
                  color: isMatched ? '#A9DFBF' : isSelected ? '#74B3CE' : 'rgba(255,255,255,0.8)',
                  cursor: isMatched ? 'default' : 'pointer',
                  transition: 'all 0.25s ease',
                  transform: isSelected ? 'scale(1.03)' : 'scale(1)',
                  textAlign: 'center', lineHeight: 1.4,
                  animation: isWrongAnim ? 'shake 0.4s ease' : undefined,
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

  // Unlock system: each mission requires a certain number of previous completions
  const missions = [
    { id: 'chat', title: 'Mision 1: Chat Sospechoso', desc: 'Un desconocido te contacta en tu juego favorito. Detecta sus intenciones.', xp: 200, unlock: 0, icon: 'chat' },
    { id: 'decisions', title: 'Mision 2: Decisiones Reales', desc: 'Enfrenta situaciones del dia a dia y elige el camino mas seguro.', xp: 250, unlock: 0, icon: 'decisions' },
    { id: 'classify', title: 'Mision 3: Clasificar Situaciones', desc: 'Decide rapidamente cuales situaciones son seguras y cuales son riesgosas.', xp: 280, unlock: 1, icon: 'classify' },
    { id: 'maze', title: 'Mision 4: Laberinto de Decisiones', desc: 'Navega un laberinto de situaciones reales tomando las decisiones correctas.', xp: 320, unlock: 2, icon: 'maze' },
    { id: 'wordsearch', title: 'Mision 5: Sopa de Letras', desc: 'Encuentra las palabras clave sobre seguridad digital en la grilla.', xp: 180, unlock: 3, icon: 'wordsearch' },
    { id: 'crossword', title: 'Mision 6: Crucigrama Digital', desc: 'Completa el crucigrama con conceptos fundamentales sobre grooming.', xp: 200, unlock: 3, icon: 'crossword' },
    { id: 'matching', title: 'Mision 7: Conectar Conceptos', desc: 'Une cada concepto con su definicion correcta para reforzar lo aprendido.', xp: 150, unlock: 4, icon: 'matching' },
  ];

  const getMissionIcon = (icon: string) => {
    const icons: Record<string, React.ReactNode> = {
      chat: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={mainBlue} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>,
      decisions: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={mainBlue} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>,
      classify: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={mainBlue} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
      maze: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={mainBlue} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3h18v18H3V3z"/><path d="M9 3v6H3M15 3v12h6M9 15H3M15 15v6M9 9h6v6"/></svg>,
      wordsearch: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={mainBlue} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/><line x1="8" y1="11" x2="14" y2="11"/><line x1="11" y1="8" x2="11" y2="14"/></svg>,
      crossword: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={mainBlue} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v18M3 12h18"/></svg>,
      matching: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={mainBlue} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>,
    };
    return icons[icon] ?? icons.chat;
  };

  const totalXpPossible = missions.reduce((s, m) => s + m.xp, 0);

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
        .btn-primary {
          font-family: 'LEMON MILK', sans-serif;
          transition: all 0.3s ease;
          cursor: pointer;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .btn-primary:hover:not(:disabled) {
          opacity: 0.85;
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(116, 179, 206, 0.35) !important;
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
        .mission-locked {
          opacity: 0.4;
          filter: grayscale(0.6);
        }
        .mission-locked .btn-primary {
          background: rgba(255,255,255,0.08) !important;
          cursor: not-allowed;
        }
        @keyframes slideUpIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes xpPop { 0% { opacity: 0; transform: translateY(0); } 20% { opacity: 1; transform: translateY(-15px); } 100% { opacity: 0; transform: translateY(-35px); } }
        @keyframes typingDot { 0%, 100% { opacity: 0.3; } 50% { opacity: 1; } }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-6px); }
          75% { transform: translateX(6px); }
        }
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 10px rgba(116,179,206,0.2); }
          50% { box-shadow: 0 0 25px rgba(116,179,206,0.4); }
        }
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
        .card-correct { animation: pulseGlow 0.5s ease; border-color: rgba(39,174,96,0.5) !important; }
        .card-wrong { animation: shake 0.4s ease; border-color: rgba(255,60,80,0.5) !important; }
        .modal-scroll { overflow-y: auto; max-height: 90vh; }
        .modal-scroll::-webkit-scrollbar { width: 4px; }
        .modal-scroll::-webkit-scrollbar-track { background: rgba(255,255,255,0.03); }
        .modal-scroll::-webkit-scrollbar-thumb { background: rgba(116,179,206,0.3); border-radius: 2px; }
      `}</style>

      <ParticleNetwork />
      <div style={{ height: "6px", background: brandGradient, position: "relative", zIndex: 51 }} />

      {/* NAVIGATION */}
      <header style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(5, 18, 43, 0.7)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(116, 179, 206, 0.1)" }}>
        <nav style={{ maxWidth: "1200px", margin: "0 auto", minHeight: "86px", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <a href="/" style={{ fontFamily: "'LEMON MILK', sans-serif", textDecoration: "none", color: "#FFFFFF", fontSize: "24px", fontWeight: "bold" }}>SAFENET</a>
          {view === 'world' ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              {/* XP Progress bar */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '120px', height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '99px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${Math.min(100, (xp / totalXpPossible) * 100)}%`, background: mainBlue, transition: 'width 0.8s ease' }} />
                </div>
                <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>{completedModules.size}/{missions.length}</span>
              </div>
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
            <div style={{ fontFamily: "'Altone', sans-serif", display: "inline-flex", padding: "8px 20px", borderRadius: "999px", background: "rgba(116, 179, 206, 0.1)", border: `1px solid rgba(116, 179, 206, 0.3)`, color: mainBlue, fontSize: "12px", fontWeight: 700, letterSpacing: "1.2px", textTransform: "uppercase", marginBottom: "28px" }}>MUNDO DIGITAL NINOS</div>
            <h1 style={{ fontFamily: "'LEMON MILK', sans-serif", fontSize: "clamp(36px, 5vw, 64px)", lineHeight: 1.1, color: "#FFFFFF", marginBottom: "32px" }}>CONVERTITE EN UN <span style={{ color: mainBlue }}>GUARDIAN</span> DE LA RED</h1>
            <p style={{ fontSize: "18px", color: "#FFFFFF", maxWidth: "700px", margin: "0 auto 42px", lineHeight: 1.8 }}>Completa misiones, aprende a detectar senales de riesgo y gana puntos de experiencia mientras explorar el mundo digital de forma segura.</p>
            <button onClick={() => setView('setup')} className="btn-primary" style={{ fontFamily: "'LEMON MILK', sans-serif", padding: "18px 32px", borderRadius: "14px", textDecoration: "none", background: mainBlue, color: "#FFFFFF", fontSize: "14px", fontWeight: "bold", textTransform: "uppercase", boxShadow: `0 8px 20px rgba(116, 179, 206, 0.3)`, border: 'none' }}>ENTRAR AL MUNDO</button>
          </div>
        )}

        {view === 'setup' && (
          <div style={{ maxWidth: "640px", margin: "0 auto", background: "rgba(10, 20, 45, 0.8)", padding: "50px", borderRadius: "32px", border: "1px solid rgba(116, 179, 206, 0.3)", backdropFilter: 'blur(20px)' }}>
            <h2 style={{ fontFamily: "'LEMON MILK', sans-serif", fontSize: "24px", textAlign: "center", color: '#FFFFFF', marginBottom: "40px" }}>TU IDENTIDAD DIGITAL</h2>
            <div style={{ marginBottom: "32px" }}>
              <label style={{ fontSize: "11px", fontWeight: "bold", textTransform: "uppercase", color: mainBlue, display: "block", marginBottom: "12px", letterSpacing: '1px' }}>Nombre de Heroe</label>
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
            <button disabled={nickname.length < 3} onClick={() => setView('world')} className="btn-primary" style={{ width: "100%", padding: "18px", borderRadius: "14px", background: nickname.length >= 3 ? mainBlue : "rgba(255,255,255,0.05)", color: "#FFFFFF", border: 'none', fontSize: '14px', fontWeight: 'bold', textTransform: 'uppercase' }}>COMENZAR AVENTURA</button>
          </div>
        )}

        {view === 'world' && (
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <div style={{ marginBottom: "50px", display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '20px', flexWrap: 'wrap' }}>
              <div>
                <h2 style={{ fontFamily: "'LEMON MILK', sans-serif", fontSize: "clamp(24px, 4vw, 42px)", color: "#FFFFFF", margin: '0 0 8px 0' }}>PANEL DE <span style={{ color: mainBlue }}>MISIONES</span></h2>
                <p style={{ fontSize: "16px", color: "#FFFFFF", margin: 0, opacity: 0.7 }}>Bienvenido, guardian {nickname}.</p>
              </div>
              {/* Global progress */}
              <div style={{ background: 'rgba(116,179,206,0.05)', border: '1px solid rgba(116,179,206,0.15)', borderRadius: '16px', padding: '16px 24px', minWidth: '220px' }}>
                <div style={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', color: mainBlue, letterSpacing: '1px', marginBottom: '8px' }}>Progreso General</div>
                <div style={{ height: '8px', background: 'rgba(255,255,255,0.06)', borderRadius: '99px', overflow: 'hidden', marginBottom: '6px' }}>
                  <div style={{ height: '100%', width: `${Math.min(100, (completedModules.size / missions.length) * 100)}%`, background: `linear-gradient(90deg, ${mainBlue}, #A5D2E5)`, transition: 'width 0.8s ease' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>
                  <span>{completedModules.size} de {missions.length} misiones</span>
                  <span>{xp} XP</span>
                </div>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "24px" }}>
              {missions.map(m => {
                const isLocked = completedModules.size < m.unlock;
                const isCompleted = completedModules.has(m.id);
                return (
                  <article key={m.id} className={`card-glass ${isLocked ? 'mission-locked' : ''}`} style={{
                    padding: "36px", borderRadius: "28px", display: 'flex', flexDirection: 'column',
                    borderLeft: isCompleted ? `4px solid #27ae60` : isLocked ? '4px solid rgba(255,255,255,0.05)' : undefined,
                    position: 'relative', overflow: 'hidden'
                  }}>
                    {isCompleted && (
                      <div style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(39,174,96,0.15)', border: '1px solid rgba(39,174,96,0.3)', borderRadius: '6px', padding: '3px 10px', fontSize: '10px', fontWeight: 'bold', color: '#27ae60', fontFamily: "'LEMON MILK', sans-serif" }}>COMPLETADA</div>
                    )}
                    {isLocked && (
                      <div style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '3px 10px', fontSize: '10px', fontWeight: 'bold', color: 'rgba(255,255,255,0.3)', fontFamily: "'LEMON MILK', sans-serif" }}>BLOQUEADA</div>
                    )}
                    <div style={{ width: '52px', height: '52px', borderRadius: '16px', background: 'rgba(116,179,206,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', border: '1px solid rgba(116,179,206,0.15)' }}>
                      {getMissionIcon(m.icon)}
                    </div>
                    <h3 style={{ fontFamily: "'LEMON MILK', sans-serif", fontSize: "15px", color: "#FFFFFF", marginBottom: "12px", lineHeight: 1.3 }}>{m.title}</h3>
                    <p style={{ fontSize: "14px", color: "#FFFFFF", lineHeight: 1.6, marginBottom: "28px", opacity: 0.7, flexGrow: 1 }}>{m.desc}</p>
                    {isLocked && (
                      <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', marginBottom: '12px' }}>
                        Completa {m.unlock} mision{m.unlock !== 1 ? 'es' : ''} para desbloquear
                      </p>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ background: 'rgba(255,215,0,0.08)', padding: '5px 12px', borderRadius: '8px', border: '1px solid rgba(255,215,0,0.15)', color: '#FFD700', fontSize: '11px', fontWeight: 'bold' }}>RECOMPENSA: {m.xp} XP</div>
                      <button
                        onClick={() => !isLocked && setActiveModule(m.id)}
                        disabled={isLocked}
                        className="btn-primary"
                        style={{ padding: "11px 22px", borderRadius: "10px", background: isLocked ? 'rgba(255,255,255,0.05)' : mainBlue, color: "#FFFFFF", border: 'none', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', cursor: isLocked ? 'not-allowed' : 'pointer' }}
                      >
                        {isCompleted ? 'REPETIR' : isLocked ? 'BLOQUEADA' : 'JUGAR'}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        )}
      </section>

      {/* MODAL SYSTEM */}
      {activeModule && (
        <div style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(5, 12, 30, 0.96)", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
          <div className="card-glass modal-scroll" style={{ maxWidth: "580px", width: "100%", padding: "40px", position: 'relative', background: 'rgba(10, 25, 50, 0.98)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <button onClick={() => setActiveModule(null)} style={{ position: "absolute", top: "20px", right: "20px", background: "rgba(255,255,255,0.05)", border: "none", color: "white", fontSize: "16px", cursor: "pointer", width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>✕</button>

            {/* Module title */}
            <div style={{ marginBottom: '24px', paddingRight: '40px' }}>
              <h3 style={{ fontFamily: "'LEMON MILK', sans-serif", fontSize: '14px', color: mainBlue, margin: '0 0 4px 0', textTransform: 'uppercase', letterSpacing: '1px' }}>
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
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer style={{ background: "rgba(5, 12, 25, 0.9)", borderTop: "1px solid rgba(116, 179, 206, 0.1)", padding: "40px 20px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "20px" }}>
          <div style={{ fontFamily: "'LEMON MILK', sans-serif", fontSize: "20px", fontWeight: "bold", color: "#FFFFFF", opacity: 0.9 }}>SAFENET WORLD</div>
          <div style={{ fontSize: "13px", color: "#FFFFFF", opacity: 0.5 }}>2026 · DIVERTITE CON SEGURIDAD</div>
        </div>
      </footer>
    </main>
  );
}