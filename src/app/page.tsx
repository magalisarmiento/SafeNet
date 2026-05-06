"use client";

import React, { useEffect, useRef, useState } from 'react';

// ============================================================
// PALETA DE COLORES
// ============================================================
const colors = {
  bgViewport: "#8AB8D0",      // Fondo interactivo exterior (Ahora Celeste)
  bgContent: "#FFFFFF",       // Fondo interior de la cuadrícula (Blanco)
  bgAlt: "#F8FAFC",           // Blanco/azulado suave para resaltar secciones en la grilla
  textMain: "#102A43",        // Azul oscuro para textos principales
  textSec: "#5B6B7A",         // Gris azulado para textos secundarios
  celeste: "#8AB8D0",         // Color de acento (Celeste)
  brandBlue: "#163A63",       // Hover de botones y acentos oscuros
  alert: "#FF3C50",           // Rojo alerta
  warning: "#F5C94A",         // Amarillo suave
  line: "#D8E3EC",            // Líneas sutiles de la cuadrícula
  white: "#FFFFFF"            // Blanco puro
};

// ============================================================
// COMPONENTE: GroomingCircle (Adaptado al fondo blanco)
// ============================================================

const GROOMING_STEPS = [
  { img: "/image1.png", label: "Elige víctima",    desc: "Estudia posibles víctimas online y elige a quien considera más vulnerable.", danger: false },
  { img: "/image2.png", label: "Agrega",           desc: "Comienza a seguir a la víctima en redes con un perfil falso adaptado a sus gustos.", danger: false },
  { img: "/image3.png", label: "Contacta",         desc: "Escribe un mensaje agradable para llamar la atención y comenzar a hablar.", danger: false },
  { img: "/image4.png", label: "Profundiza",       desc: "Busca acercamiento y comparte cosas privadas para afianzar la confianza mutua.", danger: false },
  { img: "/image5.png", label: "Intercambio",      desc: "A medida que la relación avanza comienza el intercambio de fotos e información íntima.", danger: false },
  { img: "/image6.png", label: "Mayor compromiso", desc: "Aparece el chantaje emocional para exigir contenido más íntimo.", danger: false },
  { img: "/image7.png", label: "Se descubre",      desc: "Si la víctima quiere salir, el groomer se descubre y comienza el chantaje.", danger: true },
  { img: "/image8.png", label: "Chantajea",        desc: "Amenaza con publicar conversaciones e imágenes si la víctima no obedece.", danger: true },
  { img: "/image9.png", label: "Abusa",            desc: "Ante el miedo, la víctima cede: envía material, acepta encuentros y sufre abuso.", danger: true },
];

function GroomingCircle() {
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [visible, setVisible]       = useState(false);
  const [isMounted, setIsMounted]   = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => { setIsMounted(true); }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.2 }
    );
    if (wrapRef.current) obs.observe(wrapRef.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (activeStep !== null) return;
    const id = setInterval(() => {
      setActiveStep((prev) => {
        if (prev === null) return 0;
        return (prev + 1) % GROOMING_STEPS.length;
      });
    }, 2500);
    const init = setTimeout(() => setActiveStep(0), 500);
    return () => { clearInterval(id); clearTimeout(init); };
  }, [activeStep]);

  const size       = 680;
  const cx         = size / 2;
  const cy         = size / 2;
  const r          = size * 0.38;
  const n          = GROOMING_STEPS.length;
  const startAngle = -Math.PI / 2;

  const active = activeStep !== null ? GROOMING_STEPS[activeStep] : null;

  return (
    <div ref={wrapRef} style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center", gap: "40px", width: "100%" }}>

      {/* ── DIAGRAMA ── */}
      <div style={{ position: "relative", width: "min(680px, 100%)", aspectRatio: "1", flexShrink: 0 }}>
        
        <div style={{
          position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
          width: "60%", height: "60%", borderRadius: "50%",
          background: `radial-gradient(circle, rgba(138, 184, 208, 0.3) 0%, transparent 70%)`,
          filter: "blur(30px)", pointerEvents: "none", zIndex: 0,
        }} />

        <svg viewBox={`0 0 ${size} ${size}`} style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 1 }}>
          <defs>
            <marker id="gArrowLight" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto">
              <path d="M1 1L9 5L1 9" fill="none" stroke={colors.brandBlue} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </marker>
            <marker id="gArrowRedLight" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto">
              <path d="M1 1L9 5L1 9" fill="none" stroke={colors.alert} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </marker>
          </defs>

          <circle cx={cx} cy={cy} r={r} fill="none" stroke={colors.line} strokeWidth="80" opacity="0.5" />
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(16,42,67,0.15)" strokeWidth="1" strokeDasharray="16 10" style={{ animation: "spin-orbit 28s linear infinite" }} />

          {isMounted && GROOMING_STEPS.map((_, i) => {
            const a1     = startAngle + (2 * Math.PI * i) / n;
            const a2     = startAngle + (2 * Math.PI * ((i + 1) % n)) / n;
            const pad    = 0.09;
            const x1     = cx + r * Math.cos(a1 + pad);
            const y1     = cy + r * Math.sin(a1 + pad);
            const x2     = cx + r * Math.cos(a2 - pad);
            const y2     = cy + r * Math.sin(a2 - pad);
            const isDanger = GROOMING_STEPS[i].danger;
            return (
              <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
                stroke={isDanger ? colors.alert : colors.brandBlue}
                strokeWidth="1.5" strokeDasharray={isDanger ? "none" : "5 4"}
                opacity="0.6"
                markerEnd={isDanger ? "url(#gArrowRedLight)" : "url(#gArrowLight)"}
              />
            );
          })}
        </svg>

        <div style={{
          position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
          width: "clamp(130px, 28%, 180px)", aspectRatio: "1", borderRadius: "50%",
          background: "#FFFFFF",
          border: `2px solid ${colors.line}`,
          boxShadow: "0 10px 30px rgba(16,42,67,0.05), inset 0 0 20px rgba(138, 184, 208, 0.05)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 2, animation: "pulse-center-node-light 4s ease-in-out infinite",
        }}>
          <img src="/image-central.png" alt="Figura central" style={{ width: "85%", height: "85%", objectFit: "contain" }}
            onError={(e) => { e.currentTarget.style.display = "none"; }}
          />
        </div>

        {GROOMING_STEPS.map((step, i) => {
          const angle  = startAngle + (2 * Math.PI * i) / n;
          const xPct   = 50 + 38 * Math.cos(angle);
          const yPct   = 50 + 38 * Math.sin(angle);
          const isActive = activeStep === i;

          return (
            <div key={i} className="grooming-step-node"
              style={{
                left: `${xPct}%`, top: `${yPct}%`,
                opacity: visible ? 1 : 0,
                transform: visible ? `translate(-50%,-50%) scale(${isActive ? 1.15 : 1})` : "translate(-50%,-50%) scale(0.5)",
                transition: `opacity 0.5s ease ${i * 0.06}s, transform 0.35s cubic-bezier(0.34,1.56,0.64,1)`,
                zIndex: isActive ? 10 : 3,
                position: "absolute"
              }}
              onMouseEnter={() => setActiveStep(i)}
            >
              {isActive && (
                <div style={{
                  position: "absolute", width: "calc(100% + 20px)", height: "calc(100% + 20px)",
                  top: "-10px", left: "-10px", borderRadius: "50%",
                  background: step.danger ? "radial-gradient(circle, rgba(255,60,80,0.15) 0%, transparent 70%)" : "radial-gradient(circle, rgba(138, 184, 208, 0.2) 0%, transparent 70%)",
                  animation: "halo-pulse 1.2s ease-in-out infinite", pointerEvents: "none",
                }} />
              )}

              <div className={`grooming-step-circle-light ${step.danger ? "danger" : ""} ${isActive ? "active" : ""}`}>
                <img src={step.img} alt={step.label} style={{ width: "70%", height: "70%", objectFit: "contain" }}
                  onError={(e) => { e.currentTarget.style.display = "none"; }}
                />
                <div className={`grooming-step-badge-light ${step.danger ? "danger" : ""}`}>{i + 1}</div>
              </div>

              <div className={`grooming-step-label-light ${step.danger ? "danger" : ""} ${isActive ? "active-label" : ""}`}>
                {step.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── PANEL LATERAL ── */}
      <div style={{
        width: "clamp(260px, 32%, 320px)", minHeight: "240px",
        background: "#FFFFFF",
        border: `1px solid ${active?.danger ? colors.alert : colors.line}`,
        borderRadius: "20px", padding: "28px 24px",
        transition: "border-color 0.4s ease", display: "flex", flexDirection: "column", gap: "16px",
        boxShadow: active?.danger ? "0 10px 30px rgba(255,60,80,0.1)" : "0 10px 30px rgba(16,42,67,0.06)",
        position: "relative", zIndex: 10
      }}>
        {active ? (
          <div className="reveal active">
            <div style={{ fontFamily: "'LEMON MILK', sans-serif", fontSize: "11px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: active.danger ? colors.alert : colors.celeste }}>
              Paso {(activeStep ?? 0) + 1} de {GROOMING_STEPS.length}
            </div>

            <div style={{ height: "4px", background: colors.line, borderRadius: "2px", overflow: "hidden", margin: "12px 0 20px" }}>
              <div style={{
                height: "100%", width: `${(((activeStep ?? 0) + 1) / GROOMING_STEPS.length) * 100}%`,
                background: active.danger ? colors.alert : colors.celeste,
                borderRadius: "2px", transition: "width 0.4s ease",
              }} />
            </div>

            <div style={{ fontFamily: "'LEMON MILK', sans-serif", fontSize: "20px", fontWeight: 700, color: active.danger ? colors.alert : colors.textMain, lineHeight: 1.2, marginBottom: "12px" }}>
              {active.label}
            </div>

            <p style={{ fontFamily: "'Altone', sans-serif", fontSize: "15px", lineHeight: 1.65, color: colors.textSec, margin: 0 }}>
              {active.desc}
            </p>

            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "24px" }}>
              {GROOMING_STEPS.map((s, i) => (
                <button key={i} onClick={() => setActiveStep(i)}
                  style={{
                    width: "8px", height: "8px", borderRadius: "50%", border: "none", cursor: "pointer",
                    background: activeStep === i ? (s.danger ? colors.alert : colors.celeste) : colors.line,
                    transition: "background 0.3s, transform 0.2s", transform: activeStep === i ? "scale(1.4)" : "scale(1)",
                  }}
                />
              ))}
            </div>
          </div>
        ) : (
          <div style={{ fontFamily: "'Altone', sans-serif", fontSize: "14px", color: colors.textSec, opacity: 0.8, margin: "auto", textAlign: "center" }}>
            Pasá el mouse sobre un paso para ver su descripción detallada.
          </div>
        )}
      </div>

    </div>
  );
}

// ============================================================
// PÁGINA PRINCIPAL
// ============================================================

export default function App() {
  const [mousePos, setMousePos]   = useState({ x: 0, y: 0 });
  const [chatState, setChatState] = useState({ visible: false, text: "", isTyping: false });
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const storyRef   = useRef(null);
  const [visibleBubbles, setVisibleBubbles] = useState<number[]>([]);

  // Eliminamos los "rows" fijos ya que utilizaremos flex-wrap para igualar el acomodo de la imagen
  const groomingBubbles = [
    { text: "Sos hermosa, ¿cómo estás?",                             cat: "contact" },
    { text: "Sos diferente a los demás, te lo juro.",                cat: "trust"   },
    { text: "¿Cuántos años tenés?",                                  cat: "contact" },
    { text: "No le cuentes a nadie, es nuestro secreto.",            cat: "secret"  },
    { text: "Te entiendo más que tu familia.",                       cat: "trust"   },
    { text: "Mandamé una foto, solo para mí.",                       cat: "contact" },
    { text: "Si me quisieras de verdad lo harías.",                  cat: "threat"  },
    { text: "¿Estás sola en casa?",                                  cat: "contact" },
    { text: "Sos la única persona que me entiende.",                 cat: "trust"   },
    { text: "Si se lo contás a alguien, publico todo.",              cat: "threat"  },
    { text: "¿Por qué no contestás? ¿Me estás ignorando?",           cat: "secret"  },
    { text: "Prométeme que esto queda entre nosotros.",              cat: "trust"   },
    { text: "Me caés muy bien, sos especial.",                       cat: "contact" },
    { text: "Bloqueame y lo paso al grupo del colegio.",             cat: "threat"  },
    { text: "Yo nunca te haría daño, confiá en mí.",                 cat: "trust"   },
    { text: "Hagamos videollamada, nadie se va a enterar.",          cat: "contact" },
  ];

  const worlds = [
    { title: "Niños (Primaria)",       desc: "Actividades guiadas para aprender a reconocer señales de riesgo y pedir ayuda a tiempo.",                 href: "/ninos"        },
    { title: "Adolescentes (Secundaria)", desc: "Simulaciones, decisiones y contenidos pensados para redes sociales y situaciones reales.",         href: "/adolescentes" },
    { title: "Familias",               desc: "Guías claras para acompañar, detectar señales de alerta y actuar frente a una situación concreta.",   href: "/familias"     },
    { title: "Docentes",               desc: "Recursos para trabajar la prevención desde el aula y fortalecer la intervención institucional.",      href: "/docentes"     },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("active"); }),
      { threshold: 0.15 }
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          groomingBubbles.forEach((_, i) => {
            setTimeout(() => setVisibleBubbles((prev) => [...prev, i]), i * 120);
          });
        }
      },
      { threshold: 0.25 }
    );
    if (storyRef.current) observer.observe(storyRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: any) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width  = window.innerWidth;
    let height = window.innerHeight;
    canvas.width  = width;
    canvas.height = height;

    const particles: any[] = [];
    const particleCount = Math.min(width / 20, 70); 
    const maxDistance   = 160;

    class Particle {
      x: number; y: number; vx: number; vy: number; isThreat: boolean; radius: number;
      constructor() {
        this.x        = Math.random() * width;
        this.y        = Math.random() * height;
        this.vx       = (Math.random() - 0.5) * 0.8;
        this.vy       = (Math.random() - 0.5) * 0.8;
        this.isThreat = Math.random() > 0.90; 
        this.radius   = this.isThreat ? 3 : 1.5;
      }
      update() {
        this.x += this.vx; this.y += this.vy;
        if (this.x < 0 || this.x > width)  this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
        
        const dx = mousePos.x - this.x, dy = mousePos.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) { this.x -= dx * 0.02; this.y -= dy * 0.02; }
      }
      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.isThreat ? "rgba(255, 60, 80, 0.8)" : "rgba(16, 42, 67, 0.4)";
        ctx.shadowBlur  = this.isThreat ? 15 : 0;
        ctx.shadowColor = "rgba(255, 60, 80, 1)";
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) particles.push(new Particle());

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
        for (let j = i + 1; j < particles.length; j++) {
          const dx   = particles[i].x - particles[j].x;
          const dy   = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDistance) {
            ctx.beginPath();
            const opacity = 1 - dist / maxDistance;
            const isThreatConn = particles[i].isThreat || particles[j].isThreat;
            ctx.strokeStyle = isThreatConn ? `rgba(255, 60, 80, ${opacity * 0.5})` : `rgba(16, 42, 67, ${opacity * 0.15})`;
            ctx.lineWidth = isThreatConn ? 1.5 : 1;
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
      width = window.innerWidth; height = window.innerHeight;
      canvas.width = width; canvas.height = height;
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [mousePos]);

  useEffect(() => {
    const sequence = async () => {
      await new Promise((r) => setTimeout(r, 4000));
      setChatState({ visible: true,  text: "", isTyping: true  });
      await new Promise((r) => setTimeout(r, 2000));
      setChatState({ visible: true,  text: "Hola, ¿cómo estás?", isTyping: false });
      await new Promise((r) => setTimeout(r, 3000));
      setChatState({ visible: true,  text: "", isTyping: true  });
      await new Promise((r) => setTimeout(r, 2500));
      setChatState({ visible: true,  text: "¿Cuántos años tenés?", isTyping: false });
      await new Promise((r) => setTimeout(r, 4000));
      setChatState({ visible: false, text: "", isTyping: false });
    };
    sequence();
  }, []);

  return (
    <main style={{ backgroundColor: colors.bgViewport, minHeight: "100vh", position: "relative", overflowX: "hidden" }}>
      
      <style>{`
        @import url('https://fonts.cdnfonts.com/css/lemon-milk');
        @import url('https://fonts.cdnfonts.com/css/altone');
        
        html { scroll-behavior: smooth; }
        
        .font-display { font-family: 'LEMON MILK', sans-serif; text-transform: uppercase; }
        .font-body { font-family: 'Altone', sans-serif; }
        
        .reveal { opacity: 0; transform: translateY(30px); transition: opacity 0.8s ease-out, transform 0.8s ease-out; }
        .reveal.active { opacity: 1; transform: translateY(0); }
        .delay-100 { transition-delay: 100ms; }
        .delay-200 { transition-delay: 200ms; }
        .delay-300 { transition-delay: 300ms; }

        .grid-frame {
          max-width: 1200px;
          margin: 0 auto;
          background-color: ${colors.bgContent};
          position: relative;
          z-index: 10;
          border-left: 1px solid ${colors.line};
          border-right: 1px solid ${colors.line};
          box-shadow: 0 0 50px rgba(0, 0, 0, 0.1);
          min-height: 100vh;
        }
        
        .border-b-grid { border-bottom: 1px solid ${colors.line}; }
        .border-r-md { border-right: 1px solid ${colors.line}; }
        
        .grid-2 { display: grid; grid-template-columns: 1fr; }
        @media (min-width: 768px) {
          .grid-2 { grid-template-columns: 1fr 1fr; }
        }

        .module-card {
          padding: 60px 40px; transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          position: relative; z-index: 1;
        }
        .module-card:hover {
          transform: translateY(-8px) scale(1.01);
          box-shadow: 0 15px 30px rgba(16, 42, 67, 0.08); z-index: 2; border-radius: 8px;
          border-color: transparent !important;
        }

        /* Colores Específicos para las Cards de Mundos unificados */
        .card-bg-0, .card-bg-3 { background: ${colors.white}; }
        .card-bg-0:hover, .card-bg-3:hover { background: ${colors.white}; }
        .card-bg-1, .card-bg-2 { background: ${colors.textMain}; }
        .card-bg-1:hover, .card-bg-2:hover { background: ${colors.brandBlue}; }

        .tech-label {
          font-family: monospace; font-size: 12px; letter-spacing: 1.5px; 
          text-transform: uppercase; color: ${colors.textSec}; display: block; 
          margin-bottom: 16px; opacity: 0.9;
        }

        /* ── NAVBAR PILL FLOTANTE ── */
        .nav-pill-container {
          position: fixed;
          top: 32px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 1000;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(12px);
          border-radius: 60px;
          padding: 8px;
          display: flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 20px 40px rgba(16, 42, 67, 0.08), 0 1px 3px rgba(0,0,0,0.05);
          border: 1px solid rgba(216, 227, 236, 0.8);
        }

        .nav-item {
          text-decoration: none;
          color: ${colors.textSec};
          font-family: 'Altone', sans-serif;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 1px;
          text-transform: uppercase;
          padding: 12px 24px;
          border-radius: 50px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          white-space: nowrap;
        }

        .nav-item:hover {
          color: ${colors.textMain};
          background: rgba(248, 250, 252, 0.8);
        }

        .nav-item.active {
          background: rgba(138, 184, 208, 0.15); /* Celeste suave basado en la paleta */
          color: ${colors.textMain};
          font-family: 'LEMON MILK', sans-serif;
          font-size: 13px;
          padding: 12px 28px;
        }

        .nav-item.active:hover {
          background: rgba(138, 184, 208, 0.25);
        }

        @media (max-width: 768px) {
          .nav-pill-container {
            top: 24px;
            padding: 6px;
            width: 92vw;
            max-width: 500px;
            justify-content: flex-start;
            overflow-x: auto;
            gap: 4px;
          }
          .nav-pill-container::-webkit-scrollbar {
             display: none;
          }
          .nav-item {
            padding: 10px 16px;
            font-size: 11px;
          }
          .nav-item.active {
            font-size: 11px;
            padding: 10px 20px;
          }
        }

        @keyframes slideInUp { from { opacity: 0; transform: translateY(20px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes fadeOut   { from { opacity: 1; transform: scale(1); } to { opacity: 0; transform: scale(0.95); pointer-events: none; } }
        .typing-dot { display: inline-block; width: 6px; height: 6px; background: currentColor; border-radius: 50%; animation: typing 1.4s infinite ease-in-out; margin: 0 2px; }
        .typing-dot:nth-child(1) { animation-delay: 0s; } .typing-dot:nth-child(2) { animation-delay: 0.2s; } .typing-dot:nth-child(3) { animation-delay: 0.4s; }
        @keyframes typing { 0%, 100% { transform: translateY(0); opacity: 0.5; } 50% { transform: translateY(-4px); opacity: 1; } }

        @keyframes pulse-center-node-light {
          0%, 100% { box-shadow: 0 0 0 0 rgba(138, 184, 208, 0.1), inset 0 0 10px rgba(138, 184, 208, 0.05); }
          50%      { box-shadow: 0 0 0 15px rgba(138, 184, 208, 0), inset 0 0 20px rgba(138, 184, 208, 0.1);  }
        }
        @keyframes spin-orbit { from { stroke-dashoffset: 0; } to { stroke-dashoffset: -1000; } }
        @keyframes halo-pulse { 0%, 100% { opacity: 0.4; transform: scale(1); } 50% { opacity: 1; transform: scale(1.08); } }

        .grooming-step-circle-light {
          width: 78px; height: 78px; border-radius: 50%; background: #FFFFFF;
          border: 2px solid ${colors.line}; display: flex; align-items: center; justify-content: center;
          transition: border-color 0.3s, box-shadow 0.3s, transform 0.3s;
          position: relative; flex-shrink: 0; overflow: hidden; box-shadow: 0 4px 16px rgba(16,42,67,0.05);
        }
        .grooming-step-circle-light.danger { border-color: ${colors.alert}; }
        .grooming-step-circle-light.active { border-color: ${colors.brandBlue} !important; box-shadow: 0 0 0 3px rgba(138, 184, 208, 0.2), 0 8px 20px rgba(16,42,67,0.1) !important; }
        .grooming-step-circle-light.danger.active { border-color: ${colors.alert} !important; box-shadow: 0 0 0 3px rgba(255,60,80,0.2), 0 8px 20px rgba(255,60,80,0.2) !important; }

        .grooming-step-badge-light {
          position: absolute; top: -5px; right: -5px; width: 22px; height: 22px; border-radius: 50%;
          background: ${colors.celeste}; font-size: 10px; font-weight: 700; color: #FFFFFF;
          display: flex; align-items: center; justify-content: center; border: 2px solid #FFFFFF; z-index: 1;
        }
        .grooming-step-badge-light.danger { background: ${colors.alert}; }

        .grooming-step-label-light {
          font-size: 9.5px; font-weight: 700; letter-spacing: 0.9px; text-transform: uppercase; text-align: center;
          color: ${colors.textSec}; line-height: 1.3; max-width: 100px; transition: color 0.3s;
        }
        .grooming-step-label-light.danger { color: ${colors.alert}; }
        .grooming-step-label-light.active-label { color: ${colors.brandBlue} !important; text-shadow: 0 0 10px rgba(138, 184, 208, 0.2); }
        .grooming-step-label-light.danger.active-label { color: ${colors.alert} !important; }

      `}</style>

      <canvas ref={canvasRef} style={{ position: "fixed", top: 0, left: 0, zIndex: 0, pointerEvents: "none", opacity: 0.9 }} />

      {/* NAVBAR PILL FLOTANTE */}
      <nav className="nav-pill-container">
        <a href="/" className="nav-item active">
          EL SAFENET
        </a>
        <a href="#mundos" className="nav-item">
          Explorar Plataforma
        </a>
        <a href="#alertas" className="nav-item">
          Ver Señales
        </a>
      </nav>

      <div style={{ position: "fixed", bottom: "30px", right: "30px", zIndex: 100, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "8px", pointerEvents: "none", animation: chatState.visible ? "slideInUp 0.5s cubic-bezier(0.175,0.885,0.32,1.275) forwards" : "fadeOut 0.5s ease forwards", opacity: 0 }}>
        <div style={{ fontSize: "11px", fontFamily: "'Altone', sans-serif", color: colors.alert, fontWeight: "bold", textTransform: "uppercase", letterSpacing: "1px", marginRight: "10px", textShadow: `0 0 10px rgba(255,60,80,0.5)` }}>
          Usuario Desconocido
        </div>
        <div style={{ background: "rgba(255,255,255,0.95)", backdropFilter: "blur(10px)", border: `1px solid ${colors.line}`, borderLeft: `3px solid ${colors.alert}`, padding: "14px 20px", borderRadius: "18px 18px 4px 18px", color: colors.textMain, fontFamily: "'Altone', sans-serif", fontSize: "14px", boxShadow: "0 10px 25px rgba(0, 0, 0, 0.3)", maxWidth: "250px" }}>
          {chatState.isTyping
            ? <div style={{ display: "flex", alignItems: "center", height: "20px" }}><span className="typing-dot"/><span className="typing-dot"/><span className="typing-dot"/></div>
            : <span>{chatState.text}</span>}
        </div>
      </div>

      <div className="grid-frame">

        {/* 1. HERO SECTION */}
        <section className="border-b-grid reveal" style={{ position: "relative", zIndex: 1, padding: "160px 24px 140px" }}>
          <span className="tech-label" style={{ marginBottom: "24px", display: "inline-block", background: colors.bgAlt, padding: "6px 12px", borderRadius: "4px" }}>[ SEC. 01 ] — PLATAFORMA DE PREVENCIÓN</span>
          <h1 className="font-display" style={{ fontSize: "clamp(36px, 5vw, 68px)", lineHeight: 1.15, color: colors.textMain, maxWidth: "1000px", margin: "0 0 40px" }}>
            El <span style={{ color: colors.celeste }}>grooming</span> evolucionó<br/>¿Estamos preparados?
          </h1>
          
          <div className="reveal delay-100">
            <p className="font-body" style={{ fontSize: "18px", lineHeight: 1.6, color: colors.textSec, margin: 0, maxWidth: "600px" }}>
             SAFENET ofrece una experiencia educativa e interactiva pensada para preparar a niños, adolescentes, familias y docentes frente a los riesgos del grooming, brindando herramientas concretas para reconocer señales, prevenir situaciones y actuar a tiempo.
            </p>
          </div>
        </section>

        {/* 2. VIDEO SECTION */}
        <section className="border-b-grid grid-2 reveal" style={{ position: "relative", zIndex: 1 }}>
          <div className="border-r-md" style={{ padding: "80px 24px", display: "flex", flexDirection: "column", justifyContent: "center", background: colors.bgAlt }}>
            <span className="tech-label">[ SEC. 02 ] — CONTEXTO</span>
            <h2 className="font-display" style={{ fontSize: "32px", margin: "0 0 24px", letterSpacing: "1px", color: colors.textMain }}>
              No es ficción,<br/>pasa todos los días.
            </h2>
            <p className="font-body" style={{ fontSize: "16px", lineHeight: 1.7, color: colors.textSec, margin: 0 }}>
              Un breve recurso audiovisual para introducir la problemática y comprender el alcance real de las interacciones digitales no supervisadas en la actualidad.
            </p>
          </div>

          <div style={{ padding: "60px 24px", display: "flex", alignItems: "center" }}>
            <div style={{ width: "100%", position: "relative", paddingTop: "56.25%", borderRadius: "8px", overflow: "hidden", border: `1px solid ${colors.line}`, boxShadow: "0 20px 40px rgba(16,42,67,0.08)" }}>
              <iframe src="https://www.youtube.com/embed/LxfcvzgKmUs" title="Video sobre grooming" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "0" }} />
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* 3. LLUVIA DE MENSAJES (ACTUALIZADA ESTILO DARK/IMAGEN) */}
        {/* ============================================================ */}
        <section id="alertas" ref={storyRef} className="reveal" style={{ padding: "100px 40px", position: "relative", zIndex: 1, backgroundColor: colors.textMain }}>
          <div style={{ textAlign: "left", marginBottom: "60px", maxWidth: "800px" }}>
            <span className="tech-label" style={{ display: "inline-block", color: colors.celeste, padding: "0", background: "transparent", letterSpacing: "2px", fontSize: "11px", marginBottom: "16px" }}>
              03 / PATRONES DE RIESGO
            </span>
            <h2 className="font-display" style={{ fontSize: "clamp(36px, 5vw, 64px)", margin: "0 0 24px", color: colors.white, lineHeight: 1.1 }}>
              TODO EMPIEZA CON<br/>UN <span style={{ color: colors.celeste }}>SIMPLE MENSAJE.</span>
            </h2>
            <p className="font-body" style={{ fontSize: "16px", color: "rgba(255,255,255,0.8)", lineHeight: 1.6, fontWeight: 400, maxWidth: "600px", margin: 0 }}>
              Técnicas documentadas de ingeniería social utilizadas para vulnerar la confianza de los menores. Reconocerlas anula su efectividad.
            </p>
          </div>

          <div style={{ position: "relative", width: "100%", display: "flex", flexWrap: "wrap", gap: "16px", justifyContent: "flex-start" }}>
            {groomingBubbles.map((bubble, j) => {
              const isVisible = visibleBubbles.includes(j);
              return (
                <div key={j} style={{
                  background: "transparent",
                  border: `1px solid rgba(138, 184, 208, 0.3)`, /* Borde sutil celeste */
                  padding: "16px 24px",
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? "translateY(0)" : "translateY(15px)",
                  transition: `all 0.5s cubic-bezier(0.34,1.4,0.64,1) ${j * 60}ms`,
                  cursor: "default"
                }}>
                  <span className="font-body" style={{ fontSize: "13px", fontWeight: 400, color: colors.white, lineHeight: 1.5, display: "block" }}>
                    {bubble.text}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        {/* 4. EXPLORAR ESPACIOS (MUNDOS) */}
        <section id="mundos" className="reveal" style={{ padding: 0, position: "relative", zIndex: 1, background: "linear-gradient(180deg, #EAF2F6 0%, #E1ECF2 100%)" }}>
          <div style={{ padding: "80px 24px 60px", borderBottom: `1px solid ${colors.line}`, background: colors.bgAlt }}>
            <span className="tech-label">[ SEC. 04 ] — PLATAFORMA</span>
            <h2 className="font-display" style={{ fontSize: "36px", margin: "0 0 16px", color: colors.textMain }}>
              Un recorrido para cada usuario
            </h2>
            <p className="font-body" style={{ fontSize: "16px", color: colors.textSec, maxWidth: "700px", lineHeight: 1.6, margin: 0 }}>
              La plataforma organiza sus contenidos según la edad y el rol de cada persona para que la prevención sea clara, pertinente y efectiva.
            </p>
          </div>

          <div className="grid-2">
            {worlds.map((world, idx) => {
              const isDarkCard = idx === 1 || idx === 2; // Identifica Adolescentes (1) y Familias (2)
              return (
                <div key={idx} className={`module-card card-bg-${idx} border-r-md border-b-grid reveal delay-${(idx % 2) * 100}`} style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                  <span className="tech-label" style={{ color: colors.celeste, margin: 0, fontWeight: "bold", marginBottom: "16px" }}>Módulo 0{idx + 1}</span>
                  <h3 className="font-display" style={{ fontSize: "24px", margin: "0 0 16px", color: isDarkCard ? colors.white : colors.textMain }}>{world.title}</h3>
                  <p className="font-body" style={{ fontSize: "16px", lineHeight: 1.7, color: isDarkCard ? "rgba(255,255,255,0.8)" : colors.textSec, margin: "0 0 32px", flexGrow: 1 }}>{world.desc}</p>
                  <a href={world.href} className="font-body" style={{ 
                      display: "inline-flex", alignItems: "center", gap: "8px", 
                      border: `1px solid ${isDarkCard ? 'rgba(138, 184, 208, 0.5)' : colors.celeste}`, 
                      color: isDarkCard ? colors.white : colors.textMain, 
                      padding: "10px 20px", fontSize: "13px", textTransform: "uppercase", 
                      letterSpacing: "1px", borderRadius: "4px", textDecoration: "none", 
                      fontWeight: "bold", transition: "all 0.3s ease", marginTop: "auto",
                      background: isDarkCard ? "transparent" : colors.white
                    }}
                    onMouseOver={(e) => { 
                      e.currentTarget.style.backgroundColor = isDarkCard ? 'rgba(138, 184, 208, 0.1)' : colors.celeste; 
                      e.currentTarget.style.color = '#FFFFFF'; 
                    }}
                    onMouseOut={(e) => { 
                      e.currentTarget.style.backgroundColor = isDarkCard ? "transparent" : colors.white; 
                      e.currentTarget.style.color = isDarkCard ? colors.white : colors.textMain; 
                    }}
                  >
                    Explorar Espacio
                  </a>
                </div>
              );
            })}
          </div>
        </section>

      </div>

      {/* FOOTER */}
      <footer className="reveal" style={{ background: colors.white, padding: "60px 24px", position: "relative", zIndex: 1, borderTop: `1px solid ${colors.line}` }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "40px" }}>
          <div>
            <div className="font-display" style={{ fontSize: "28px", fontWeight: "bold", color: colors.textMain, letterSpacing: "1.5px", marginBottom: "8px" }}>SAFENET</div>
            <div className="font-body" style={{ fontSize: "13px", color: colors.textSec, letterSpacing: "0.5px" }}>PLATAFORMA EDUCATIVA DE PREVENCIÓN DIGITAL</div>
          </div>
          
          <div style={{ display: "flex", gap: "32px", alignItems: "center" }}>
            <a href="#mundos" className="font-body" style={{ textDecoration: "none", color: colors.textMain, fontSize: "14px", transition: "color 0.3s", fontWeight: "bold" }}
              onMouseOver={(e) => e.currentTarget.style.color = colors.brandBlue}
              onMouseOut={(e) => e.currentTarget.style.color = colors.textMain}
            >
              Explorar Espacios
            </a>
            <a href="/docentes" className="font-body" style={{ textDecoration: "none", color: colors.textMain, fontSize: "14px", transition: "color 0.3s", fontWeight: "bold" }}
              onMouseOver={(e) => e.currentTarget.style.color = colors.brandBlue}
              onMouseOut={(e) => e.currentTarget.style.color = colors.textMain}
            >
              Guía Docentes
            </a>
          </div>

          <div style={{ width: "100%", height: "1px", background: colors.line, margin: "20px 0" }}></div>

          <div className="font-body" style={{ width: "100%", display: "flex", justifyContent: "space-between", fontSize: "13px", color: colors.textSec }}>
            <span>© 2026 SAFENET</span>
            <span>TFG · Licenciatura en Ciberseguridad</span>
          </div>
        </div>
      </footer>

    </main>
  );
}