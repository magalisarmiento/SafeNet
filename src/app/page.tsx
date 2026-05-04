"use client";
 
import React, { useEffect, useRef, useState } from 'react';
 
// ============================================================
// COMPONENTE: GroomingCircle
// ============================================================
 
const GROOMING_STEPS: {
  img: string;
  label: string;
  desc: string;
  danger: boolean;
}[] = [
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
  const wrapRef = useRef<HTMLDivElement>(null);
 
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
  }, []);
 
  const size       = 680;
  const cx         = size / 2;
  const cy         = size / 2;
  const r          = size * 0.38;
  const n          = GROOMING_STEPS.length;
  const startAngle = -Math.PI / 2;
 
  const active = activeStep !== null ? GROOMING_STEPS[activeStep] : null;
 
  return (
    <div ref={wrapRef} style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center", gap: "32px", width: "100%" }}>
 
      {/* ── DIAGRAMA ── */}
      <div style={{ position: "relative", width: "min(680px, 92vw)", aspectRatio: "1", flexShrink: 0 }}>
 
        <div style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%,-50%)",
          width: "60%", height: "60%",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(116,179,206,0.15) 0%, transparent 70%)",
          filter: "blur(30px)",
          pointerEvents: "none", zIndex: 0,
        }} />
 
        <svg
          viewBox={`0 0 ${size} ${size}`}
          style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 1 }}
        >
          <defs>
            <marker id="gArrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto">
              <path d="M1 1L9 5L1 9" fill="none" stroke="rgba(116,179,206,0.8)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </marker>
            <marker id="gArrowRed" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto">
              <path d="M1 1L9 5L1 9" fill="none" stroke="rgba(255,60,80,0.9)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </marker>
          </defs>
 
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(116,179,206,0.15)" strokeWidth="80" />
 
          <circle
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke="rgba(116,179,206,0.3)"
            strokeWidth="1"
            strokeDasharray="16 10"
            style={{ animation: "spin-orbit 28s linear infinite" }}
          />
 
          {isMounted && GROOMING_STEPS.map((_, i) => {
            const a1     = startAngle + (2 * Math.PI * i) / n;
            const a2     = startAngle + (2 * Math.PI * ((i + 1) % n)) / n;
            const pad    = 0.09;
            const aStart = a1 + pad;
            const aEnd   = a2 - pad;
            const x1     = parseFloat((cx + r * Math.cos(aStart)).toFixed(3));
            const y1     = parseFloat((cy + r * Math.sin(aStart)).toFixed(3));
            const x2     = parseFloat((cx + r * Math.cos(aEnd)).toFixed(3));
            const y2     = parseFloat((cy + r * Math.sin(aEnd)).toFixed(3));
            const isDanger = GROOMING_STEPS[i].danger;
            return (
              <line
                key={i}
                x1={x1} y1={y1} x2={x2} y2={y2}
                stroke={isDanger ? "rgba(255,60,80,0.6)" : "rgba(116,179,206,0.5)"}
                strokeWidth="1.5"
                strokeDasharray={isDanger ? "none" : "5 4"}
                markerEnd={isDanger ? "url(#gArrowRed)" : "url(#gArrow)"}
              />
            );
          })}
        </svg>
 
        <div style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%,-50%)",
          width: "clamp(130px, 28%, 180px)", aspectRatio: "1",
          borderRadius: "50%",
          background: "rgba(8, 23, 46, 0.8)",
          backdropFilter: "blur(10px)",
          border: "2px solid rgba(116,179,206,0.4)",
          boxShadow: "0 0 40px rgba(116,179,206,0.2), inset 0 0 20px rgba(116,179,206,0.1)",
          display: "flex", alignItems: "center", justifyContent: "center",
          overflow: "hidden", zIndex: 2,
          animation: "pulse-center-node 4s ease-in-out infinite",
        }}>
          <img
            src="/image-central.png"
            alt="Figura central"
            style={{ width: "85%", height: "85%", objectFit: "contain" }}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = "none";
              const fb = e.currentTarget.nextElementSibling as HTMLElement | null;
              if (fb) fb.style.display = "flex";
            }}
          />
          <span style={{ display: "none", fontSize: "56px", alignItems: "center", justifyContent: "center", width: "100%", height: "100%" }}></span>
        </div>
 
        {GROOMING_STEPS.map((step, i) => {
          const angle  = startAngle + (2 * Math.PI * i) / n;
          const xPct   = parseFloat((50 + 38 * Math.cos(angle)).toFixed(4));
          const yPct   = parseFloat((50 + 38 * Math.sin(angle)).toFixed(4));
          const isActive = activeStep === i;
 
          return (
            <div
              key={i}
              className="grooming-step-node"
              style={{
                left: `${xPct}%`,
                top: `${yPct}%`,
                opacity: visible ? 1 : 0,
                transform: visible
                  ? `translate(-50%,-50%) scale(${isActive ? 1.15 : 1})`
                  : "translate(-50%,-50%) scale(0.5)",
                transition: `opacity 0.5s ease ${i * 0.06}s, transform 0.35s cubic-bezier(0.34,1.56,0.64,1)`,
                zIndex: isActive ? 10 : 3,
              }}
              onMouseEnter={() => setActiveStep(i)}
              onMouseLeave={() => setActiveStep(null)}
            >
              {isActive && (
                <div style={{
                  position: "absolute",
                  width: "calc(100% + 20px)", height: "calc(100% + 20px)",
                  top: "-10px", left: "-10px",
                  borderRadius: "50%",
                  background: step.danger
                    ? "radial-gradient(circle, rgba(255,60,80,0.3) 0%, transparent 70%)"
                    : "radial-gradient(circle, rgba(116,179,206,0.4) 0%, transparent 70%)",
                  animation: "halo-pulse 1.2s ease-in-out infinite",
                  pointerEvents: "none",
                }} />
              )}
 
              <div className={`grooming-step-circle${step.danger ? " danger" : ""}${isActive ? " active" : ""}`}>
                <img
                  src={step.img}
                  alt={step.label}
                  style={{ width: "74%", height: "74%", objectFit: "contain" }}
                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                />
                <div className={`grooming-step-badge${step.danger ? " danger" : ""}`}>{i + 1}</div>
              </div>
 
              <div className={`grooming-step-label${step.danger ? " danger" : ""}${isActive ? " active-label" : ""}`}>
                {step.label}
              </div>
            </div>
          );
        })}
      </div>
 
      {/* ── PANEL LATERAL ── */}
      <div style={{
        width: "clamp(240px, 28%, 300px)",
        minHeight: "200px",
        background: "rgba(11, 35, 64, 0.6)",
        border: `1px solid ${active?.danger ? "rgba(255,60,80,0.4)" : "rgba(116,179,206,0.3)"}`,
        borderRadius: "20px",
        padding: "28px 24px",
        backdropFilter: "blur(12px)",
        transition: "border-color 0.4s ease",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        boxShadow: active?.danger
          ? "0 10px 30px rgba(255,60,80,0.15)"
          : "0 10px 30px rgba(0,0,0,0.2)",
      }}>
        {active ? (
          <>
            <div style={{
              fontFamily: "'LEMON MILK', sans-serif",
              fontSize: "11px", fontWeight: 700,
              letterSpacing: "2px", textTransform: "uppercase",
              color: active.danger ? "#FF3C50" : "#74B3CE",
            }}>
              Paso {(activeStep ?? 0) + 1} de {GROOMING_STEPS.length}
            </div>
 
            <div style={{ height: "3px", background: "rgba(255,255,255,0.1)", borderRadius: "2px", overflow: "hidden" }}>
              <div style={{
                height: "100%",
                width: `${(((activeStep ?? 0) + 1) / GROOMING_STEPS.length) * 100}%`,
                background: active.danger
                  ? "linear-gradient(90deg,#FF3C50,#ff6b7a)"
                  : "linear-gradient(90deg,#74B3CE,#A8D4E8)",
                borderRadius: "2px",
                transition: "width 0.4s ease",
              }} />
            </div>
 
            <div style={{
              width: "72px", height: "72px", borderRadius: "50%",
              background: active.danger ? "rgba(255,60,80,0.1)" : "rgba(116,179,206,0.1)",
              border: `2px solid ${active.danger ? "rgba(255,60,80,0.4)" : "rgba(116,179,206,0.5)"}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              overflow: "hidden",
            }}>
              <img
                src={active.img}
                alt={active.label}
                style={{ width: "70%", height: "70%", objectFit: "contain" }}
              />
            </div>
 
            <div style={{
              fontFamily: "'LEMON MILK', sans-serif",
              fontSize: "18px", fontWeight: 700,
              color: active.danger ? "#FF3C50" : "#FFFFFF",
              lineHeight: 1.2,
            }}>
              {active.label}
            </div>
 
            <p style={{
              fontFamily: "'Altone', sans-serif",
              fontSize: "15px", lineHeight: 1.65,
              color: "#FFFFFF",
              margin: 0,
            }}>
              {active.desc}
            </p>
 
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginTop: "4px" }}>
              {GROOMING_STEPS.map((s, i) => (
                <button
                  key={i}
                  onClick={() => setActiveStep(i)}
                  style={{
                    width: "8px", height: "8px",
                    borderRadius: "50%",
                    border: "none",
                    cursor: "pointer",
                    background: activeStep === i
                      ? (s.danger ? "#FF3C50" : "#74B3CE")
                      : "rgba(255,255,255,0.2)",
                    padding: 0,
                    transition: "background 0.3s, transform 0.2s",
                    transform: activeStep === i ? "scale(1.4)" : "scale(1)",
                  }}
                />
              ))}
            </div>
          </>
        ) : (
          <div style={{ fontFamily: "'Altone', sans-serif", fontSize: "14px", color: "#FFFFFF", opacity: 0.6, margin: "auto" }}>
            Pasá el mouse sobre un paso para ver su descripción
          </div>
        )}
      </div>
 
    </div>
  );
}
 
// ============================================================
// PÁGINA PRINCIPAL
// ============================================================
 
export default function Home() {
  const [mousePos, setMousePos]   = useState({ x: 0, y: 0 });
  const [chatState, setChatState] = useState({ visible: false, text: "", isTyping: false });
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const storyRef = useRef<HTMLElement>(null);
  const [visibleBubbles, setVisibleBubbles] = useState<number[]>([]);
 
  const groomingBubbles: { text: string; cat: string; icon: string; row: number }[] = [
    { text: "Sos hermosa, ¿cómo estás?",                                cat: "contact", icon: "smile",    row: 0 },
    { text: "Sos diferente a los demás, te lo juro.",           cat: "trust",   icon: "people",   row: 0 },
    { text: "¿Cuántos años tenés?",                                cat: "contact", icon: "calendar", row: 0 },
    { text: "No le cuentes a nadie, es nuestro secreto.",       cat: "secret",  icon: "lock",     row: 0 },
    { text: "Te entiendo más que tu familia.",                   cat: "trust",   icon: "heart",    row: 1 },
    { text: "Mandamé una foto, solo para mí.",                    cat: "contact", icon: "camera",   row: 1 },
    { text: "Si me quisieras de verdad lo harías.",              cat: "threat",  icon: "heart2",   row: 1 },
    { text: "¿Estás sola en casa?",                                  cat: "contact", icon: "home",     row: 1 },
    { text: "Sos la única persona que me entiende.",              cat: "trust",   icon: "person",   row: 2 },
    { text: "Si se lo contás a alguien, publico todo.",          cat: "threat",  icon: "eye",      row: 2 },
    { text: "¿Por qué no contestás? ¿Me estás ignorando?",     cat: "secret",  icon: "question", row: 2 },
    { text: "Prométeme que esto queda entre nosotros.",           cat: "trust",   icon: "shield",   row: 3 },
    { text: "Me caés muy bien, sos especial.",              cat: "contact", icon: "smile",    row: 3 },
    { text: "Bloqueame y lo paso al grupo del colegio.",        cat: "threat",  icon: "people",   row: 3 },
    { text: "Yo nunca te haría daño, confiá en mí.",             cat: "trust",   icon: "heart",    row: 4 },
    { text: "Hagamos videollamada, nadie se va a enterar.",     cat: "contact", icon: "video",    row: 4 },
  ];
 
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("is-visible"); }),
      { threshold: 0.15, rootMargin: "0px 0px -50px 0px" }
    );
    document.querySelectorAll(".reveal-on-scroll").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
 
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          groomingBubbles.forEach((_, i) => {
            setTimeout(() => setVisibleBubbles((prev) => [...prev, i]), i * 180);
          });
        }
      },
      { threshold: 0.25 }
    );
    if (storyRef.current) observer.observe(storyRef.current);
    return () => observer.disconnect();
  }, []);
 
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);
 
  // Canvas Particles (Fixed and overlays everything subtly)
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
    const maxDistance   = 150;
 
    class Particle {
      x: number; y: number; vx: number; vy: number; radius: number; isThreat: boolean;
      constructor() {
        this.x        = Math.random() * width;
        this.y        = Math.random() * height;
        this.vx       = (Math.random() - 0.5) * 0.8;
        this.vy       = (Math.random() - 0.5) * 0.8;
        this.isThreat = Math.random() > 0.95;
        this.radius   = this.isThreat ? 3 : 1.5;
      }
      update() {
        this.x += this.vx; this.y += this.vy;
        if (this.x < 0 || this.x > width)  this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
        const dx = mousePos.x - this.x, dy = mousePos.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) { this.x -= dx * 0.02; this.y -= dy * 0.02; }
      }
      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.isThreat ? "rgba(255,60,80,0.8)" : "rgba(255,255,255,0.4)";
        ctx.shadowBlur  = this.isThreat ? 15 : 0;
        ctx.shadowColor = "rgba(255,60,80,1)";
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
            const isThreatConn = particles[i].isThreat || particles[j].isThreat;
            const opacity      = 1 - dist / maxDistance;
            ctx.strokeStyle = isThreatConn
              ? `rgba(255,60,80,${opacity * 0.5})`
              : `rgba(255,255,255,${opacity * 0.2})`;
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
      setChatState({ visible: true,  text: "",                    isTyping: true  });
      await new Promise((r) => setTimeout(r, 2000));
      setChatState({ visible: true,  text: "Hola, ¿cómo estás?",  isTyping: false });
      await new Promise((r) => setTimeout(r, 3000));
      setChatState({ visible: true,  text: "",                    isTyping: true  });
      await new Promise((r) => setTimeout(r, 2500));
      setChatState({ visible: true,  text: "¿Cuántos años tenés?", isTyping: false });
      await new Promise((r) => setTimeout(r, 4000));
      setChatState({ visible: false, text: "",                    isTyping: false });
    };
    sequence();
  }, []);
 
  const worlds = [
    { title: "Niños de 10 a 13 años",       description: "Actividades guiadas para aprender a reconocer señales de riesgo y pedir ayuda a tiempo.",                              href: "/ninos"        },
    { title: "Adolescentes de 14 a 17 años", description: "Simulaciones, decisiones y contenidos pensados para redes sociales, mensajería y situaciones reales.",                 href: "/adolescentes" },
    { title: "Familias",                     description: "Guías claras para acompañar, detectar señales de alerta y actuar mejor frente a una situación concreta.",              href: "/familias"     },
    { title: "Docentes e instituciones",     description: "Recursos para trabajar la prevención desde el aula y fortalecer la intervención institucional.",                        href: "/docentes"     },
  ];
 
  const navItems     = [{ label: "Inicio", href: "/" }];
  
  // Constantes de color para el Color Blocking
  const colorCeleste = "#74B3CE";
  const colorAzul    = "#0B2340";
  const alertRed     = "#FF3C50";
 
  return (
    <main style={{ fontFamily: "'Altone', sans-serif", color: "#FFFFFF", position: "relative", background: colorAzul }}>
 
      {/* ── ESTILOS GLOBALES ── */}
      <style>{`
        @import url('https://fonts.cdnfonts.com/css/lemon-milk');
        @import url('https://fonts.cdnfonts.com/css/altone');
 
        html { scroll-behavior: smooth; overflow-x: hidden; }
 
        .spotlight-overlay {
          position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
          pointer-events: none; z-index: 10;
          background: radial-gradient(circle 600px at var(--x) var(--y), rgba(255,255,255,0.06), transparent 80%);
          transition: background 0.1s ease;
        }
 
        .btn-celeste {
          background: #FFFFFF !important; color: ${colorCeleste} !important;
          transition: all 0.4s cubic-bezier(0.175,0.885,0.32,1.275) !important;
        }
        .btn-celeste:hover {
          background: #F0F0F0 !important; transform: translateY(-4px) scale(1.03) !important;
          box-shadow: 0 15px 30px rgba(0,0,0,0.1), 0 0 20px rgba(255,255,255,0.3) !important;
        }

        .btn-azul {
          background: ${colorCeleste} !important; color: #FFFFFF !important;
          transition: all 0.4s cubic-bezier(0.175,0.885,0.32,1.275) !important;
        }
        .btn-azul:hover {
          background: #5A99B4 !important; transform: translateY(-4px) scale(1.03) !important;
          box-shadow: 0 15px 30px rgba(116,179,206,0.3), 0 0 20px rgba(116,179,206,0.4) !important;
        }
 
        .reveal-on-scroll { opacity: 0; transform: translateY(40px); transition: opacity 0.9s cubic-bezier(0.25,0.8,0.25,1), transform 0.9s cubic-bezier(0.25,0.8,0.25,1); }
        .reveal-on-scroll.is-visible { opacity: 1; transform: translateY(0); }
        .delay-100 { transition-delay: 100ms; }
        .delay-200 { transition-delay: 200ms; }
        .delay-300 { transition-delay: 300ms; }
        .delay-400 { transition-delay: 400ms; }
 
        @keyframes float-advanced {
          0%, 100% { transform: translateY(0) rotate(0deg);       box-shadow: 0 30px 80px rgba(0,0,0,0.1), inset 0 0 40px rgba(255,255,255,0.2); }
          50%       { transform: translateY(-15px) rotate(0.5deg); box-shadow: 0 45px 90px rgba(0,0,0,0.15), inset 0 0 60px rgba(255,255,255,0.3); }
        }
 
        @keyframes slideInUp { from { opacity: 0; transform: translateY(20px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes fadeOut   { from { opacity: 1; transform: scale(1); } to { opacity: 0; transform: scale(0.95); pointer-events: none; } }
        .typing-dot { display: inline-block; width: 6px; height: 6px; background: currentColor; border-radius: 50%; animation: typing 1.4s infinite ease-in-out; margin: 0 2px; }
        .typing-dot:nth-child(1) { animation-delay: 0s;   }
        .typing-dot:nth-child(2) { animation-delay: 0.2s; }
        .typing-dot:nth-child(3) { animation-delay: 0.4s; }
        @keyframes typing { 0%, 100% { transform: translateY(0); opacity: 0.5; } 50% { transform: translateY(-4px); opacity: 1; } }
 
        @keyframes pulse-center-node {
          0%, 100% { box-shadow: 0 0 0 0 rgba(116,179,206,0.2),  inset 0 0 20px rgba(116,179,206,0.1); }
          50%       { box-shadow: 0 0 0 20px rgba(116,179,206,0), inset 0 0 30px rgba(116,179,206,0.2);  }
        }
        @keyframes spin-orbit {
          from { stroke-dashoffset: 0;     }
          to   { stroke-dashoffset: -1000; }
        }
        @keyframes halo-pulse {
          0%, 100% { opacity: 0.6; transform: scale(1);    }
          50%       { opacity: 1;   transform: scale(1.08); }
        }
 
        .grooming-step-node {
          position: absolute;
          display: flex; flex-direction: column; align-items: center; gap: 7px;
          cursor: pointer; width: 110px;
        }
 
        .grooming-step-circle {
          width: 78px; height: 78px; border-radius: 50%;
          background: rgba(8,23,46,0.9);
          backdrop-filter: blur(8px);
          border: 2px solid rgba(116,179,206,0.6);
          display: flex; align-items: center; justify-content: center;
          transition: border-color 0.3s, box-shadow 0.3s, transform 0.3s;
          position: relative; flex-shrink: 0; overflow: hidden;
          box-shadow: 0 4px 16px rgba(0,0,0,0.3);
        }
        .grooming-step-circle.danger {
          border-color: rgba(255,60,80,0.6);
        }
        .grooming-step-circle.active {
          border-color: #74B3CE !important;
          box-shadow: 0 0 0 3px rgba(116,179,206,0.4), 0 8px 28px rgba(0,0,0,0.4) !important;
        }
        .grooming-step-circle.danger.active {
          border-color: #FF3C50 !important;
          box-shadow: 0 0 0 3px rgba(255,60,80,0.4), 0 8px 28px rgba(0,0,0,0.4) !important;
        }
 
        .grooming-step-badge {
          position: absolute; top: -5px; right: -5px;
          width: 22px; height: 22px; border-radius: 50%;
          background: #74B3CE; font-size: 10px; font-weight: 700; color: #0B2340;
          display: flex; align-items: center; justify-content: center;
          border: 2px solid #0B2340; z-index: 1;
        }
        .grooming-step-badge.danger { background: #FF3C50; color: #fff; border-color: #0B2340; }
 
        .grooming-step-label {
          font-size: 9.5px; font-weight: 700; letter-spacing: 0.9px;
          text-transform: uppercase; text-align: center;
          color: #FFFFFF; line-height: 1.3; max-width: 100px;
          transition: color 0.3s;
        }
        .grooming-step-label.danger      { color: rgba(255,60,80,0.9); }
        .grooming-step-label.active-label { color: #FFFFFF !important; text-shadow: 0 0 10px rgba(255,255,255,0.3); }
        .grooming-step-label.danger.active-label { color: #FF3C50 !important; }
 
        .grooming-header-pill {
          display: inline-block;
          background: #74B3CE; color: #0B2340;
          font-family: 'LEMON MILK', sans-serif;
          font-size: clamp(11px,1.5vw,14px); font-weight: 700;
          letter-spacing: 1.5px; text-transform: uppercase;
          padding: 8px 28px; border-radius: 999px; margin-bottom: 18px;
        }
        .grooming-header-main {
          font-family: 'LEMON MILK', sans-serif;
          font-size: clamp(38px,6vw,72px); font-weight: 900;
          line-height: 1.05; letter-spacing: -0.5px;
          color: #FFFFFF; margin: 0 0 20px;
        }
        .grooming-header-main .hl { color: #74B3CE; display: inline-block; }
        .grooming-header-sub {
          font-family: 'Altone', sans-serif; font-size: 17px; line-height: 1.65;
          color: #FFFFFF; max-width: 540px; margin: 0 auto;
        }
        .grooming-divider { display: flex; align-items: center; justify-content: center; gap: 14px; margin: 24px auto 44px; max-width: 320px; }
        .grooming-divider-line { flex: 1; height: 1px; background: linear-gradient(90deg, transparent, rgba(116,179,206,0.6), transparent); }
        .grooming-divider-dot  { width: 6px; height: 6px; border-radius: 50%; background: #74B3CE; opacity: 0.9; }
      `}</style>
 
      {/* Spotlight */}
      <div className="spotlight-overlay" style={{ "--x": `${mousePos.x}px`, "--y": `${mousePos.y}px` } as React.CSSProperties} />
 
      {/* Canvas partículas (Puesto sobre todo con z-index alto para no ser tapado por los bloques) */}
      <canvas ref={canvasRef} style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", zIndex: 5, pointerEvents: "none", opacity: 0.6 }} />
 
      {/* Chat flotante */}
      <div style={{ position: "fixed", bottom: "30px", right: "30px", zIndex: 100, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "8px", pointerEvents: "none", animation: chatState.visible ? "slideInUp 0.5s cubic-bezier(0.175,0.885,0.32,1.275) forwards" : "fadeOut 0.5s ease forwards", opacity: 0 }}>
        <div style={{ fontSize: "11px", fontFamily: "'Altone', sans-serif", color: alertRed, fontWeight: "bold", textTransform: "uppercase", letterSpacing: "1px", textShadow: `0 0 10px ${alertRed}`, marginRight: "10px" }}>
          Usuario Desconocido
        </div>
        <div style={{ background: "rgba(255,255,255,0.9)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.5)", borderLeft: `3px solid ${alertRed}`, padding: "14px 20px", borderRadius: "18px 18px 4px 18px", color: "#333", fontFamily: "'Altone', sans-serif", fontSize: "14px", boxShadow: "0 10px 25px rgba(0,0,0,0.1), 0 0 15px rgba(255,60,80,0.15)", maxWidth: "250px" }}>
          {chatState.isTyping
            ? <div style={{ display: "flex", alignItems: "center", height: "20px" }}><span className="typing-dot"/><span className="typing-dot"/><span className="typing-dot"/></div>
            : <span>{chatState.text}</span>}
        </div>
      </div>
 
      {/* ── HEADER ── */}
      <header style={{ position: "sticky", top: 0, zIndex: 50, background: colorCeleste, borderBottom: "1px solid rgba(255,255,255,0.3)" }}>
        <nav style={{ maxWidth: "1200px", margin: "0 auto", minHeight: "86px", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "24px", flexWrap: "wrap" }}>
          <a href="/" style={{ fontFamily: "'LEMON MILK', sans-serif", textDecoration: "none", color: "#FFFFFF", fontSize: "24px", fontWeight: "bold", letterSpacing: "1px", textShadow: "0 0 15px rgba(255,255,255,0.5)" }}>
            SAFENET
          </a>
          <div style={{ display: "flex", alignItems: "center", gap: "32px", flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "32px", flexWrap: "wrap" }}>
              {navItems.map((item) => (
                <a key={item.label} href={item.href}
                  style={{ fontFamily: "'LEMON MILK', sans-serif", textDecoration: "none", color: "#FFFFFF", fontSize: "12px", letterSpacing: "0.5px", transition: "all 0.3s" }}
                  onMouseOver={(e) => { e.currentTarget.style.opacity = "0.7"; }}
                  onMouseOut={(e)  => { e.currentTarget.style.opacity = "1"; }}
                >
                  {item.label}
                </a>
              ))}
            </div>
            <a href="#mundos" className="btn-celeste" style={{ fontFamily: "'LEMON MILK', sans-serif", display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "18px 32px", borderRadius: "14px", textDecoration: "none", fontSize: "14px", fontWeight: "bold", textTransform: "uppercase" }}>
              Explorar espacios
            </a>
          </div>
        </nav>
      </header>
 
      {/* ── SECCIÓN 1: HERO (CELESTE) ── */}
      <section style={{ padding: "80px 20px 100px", position: "relative", zIndex: 1, background: colorCeleste }}>
        <div className="reveal-on-scroll" style={{ maxWidth: "1200px", margin: "0 auto", background: "rgba(255, 255, 255, 0.15)", border: "1px solid rgba(255,255,255,0.4)", borderRadius: "30px", overflow: "hidden", position: "relative", backdropFilter: "blur(15px)", animation: "float-advanced 12s infinite ease-in-out" }}>
          <div style={{ position: "absolute", top: "-100px", left: "50%", transform: "translateX(-50%)", width: "600px", height: "200px", background: "radial-gradient(ellipse, rgba(255,255,255,0.4) 0%, transparent 70%)", filter: "blur(50px)", pointerEvents: "none" }} />
          <div style={{ padding: "100px 32px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", justifyContent: "center", minHeight: "560px" }}>
            <div className="reveal-on-scroll delay-100" style={{ fontFamily: "'Altone', sans-serif", display: "inline-flex", padding: "8px 20px", borderRadius: "999px", background: "rgba(255,255,255,0.3)", border: "1px solid rgba(255,255,255,0.5)", color: colorAzul, fontSize: "12px", fontWeight: 700, letterSpacing: "1.2px", textTransform: "uppercase", marginBottom: "28px" }}>
              Más tecnología, mayor exposición, y más riesgos.
            </div>
            <h1 className="reveal-on-scroll delay-200" style={{ fontFamily: "'LEMON MILK', sans-serif", fontSize: "clamp(36px,4.8vw,68px)", lineHeight: 1.15, color: "#FFFFFF", margin: "0 auto 38px", maxWidth: "1100px", textShadow: "0 10px 30px rgba(0,0,0,0.1)" }}>
              El <span style={{ color: colorAzul, textShadow: "none" }}>grooming</span> evolucionó ¿Estamos preparados?
            </h1>
            <p className="reveal-on-scroll delay-300" style={{ fontFamily: "'Altone', sans-serif", letterSpacing: "0.5px", fontSize: "18px", lineHeight: 1.84, fontWeight: 500, color: "#FFFFFF", maxWidth: "740px", margin: "0 auto 42px" }}>
              SAFENET es una plataforma que simula entornos digitales reales para enseñar a reconocer, prevenir y actuar frente al grooming.
            </p>
            <div className="reveal-on-scroll delay-300" style={{ display: "flex", gap: "20px", flexWrap: "wrap", justifyContent: "center" }}>
              <a href="#mundos" className="btn-celeste" style={{ fontFamily: "'LEMON MILK', sans-serif", padding: "18px 32px", borderRadius: "14px", textDecoration: "none", fontSize: "14px", fontWeight: "bold", textTransform: "uppercase" }}>
                Conocer la plataforma
              </a>
              <a href="#que-es" style={{ fontFamily: "'LEMON MILK', sans-serif", padding: "18px 32px", borderRadius: "14px", textDecoration: "none", background: "rgba(255,255,255,0.15)", color: "#FFFFFF", fontSize: "14px", border: "1px solid rgba(255,255,255,0.4)", transition: "all 0.3s ease" }}
                onMouseOver={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.25)"; e.currentTarget.style.transform = "translateY(-3px)"; }}
                onMouseOut={(e)  => { e.currentTarget.style.background = "rgba(255,255,255,0.15)"; e.currentTarget.style.transform = "translateY(0)"; }}
              >
                El paso a paso del grooming
              </a>
            </div>
          </div>
        </div>
      </section>
 
      {/* ── SECCIÓN 2: VIDEO (AZUL OSCURO) ── */}
      <section id="video-impacto" className="reveal-on-scroll" style={{ padding: "90px 20px 100px", position: "relative", zIndex: 1, background: colorAzul }}>
        <div style={{ position: "absolute", top: "10%", left: "50%", transform: "translateX(-50%)", width: "720px", height: "420px", background: "rgba(116,179,206,0.1)", filter: "blur(80px)", borderRadius: "50%", pointerEvents: "none" }} />
        <div style={{ maxWidth: "980px", margin: "0 auto", position: "relative", zIndex: 2 }}>
          <div style={{ textAlign: "center", marginBottom: "34px" }}>
            <span style={{ fontFamily: "'LEMON MILK', sans-serif", display: "inline-flex", padding: "8px 18px", borderRadius: "999px", background: "rgba(116,179,206,0.1)", border: "1px solid rgba(116,179,206,0.3)", color: colorCeleste, fontSize: "11px", letterSpacing: "1.2px", textTransform: "uppercase", marginBottom: "18px" }}>
              Un video breve para introducir la problemática
            </span>
            <h2 style={{ fontFamily: "'LEMON MILK', sans-serif", fontSize: "clamp(26px,3vw,42px)", lineHeight: 1.2, color: "#FFFFFF", margin: "0 0 14px" }}>
              No es ficción, pasa todos los días.
            </h2>
          </div>
          <div style={{ position: "relative", width: "100%", paddingTop: "56.25%", borderRadius: "24px", overflow: "hidden", border: "1px solid rgba(116,179,206,0.3)", boxShadow: "0 30px 80px rgba(0,0,0,0.5), 0 0 40px rgba(116,179,206,0.1)", background: "rgba(11,35,64,0.5)" }}>
            <iframe src="https://www.youtube.com/embed/LxfcvzgKmUs" title="Video sobre grooming" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "0" }} />
          </div>
        </div>
      </section>
 
      {/* ── SECCIÓN 3: LLUVIA DE MENSAJES (CELESTE) ── */}
      <section ref={storyRef} style={{ padding: "80px 20px", position: "relative", zIndex: 1, overflow: "hidden", background: colorCeleste }}>
        
        {/* Puntos blancos decorativos de fondo */}
        {[{t:"8%",l:"5%"},{t:"15%",l:"18%"},{t:"22%",l:"88%"},{t:"35%",l:"72%"},{t:"55%",l:"92%"},{t:"70%",l:"3%"},{t:"80%",l:"60%"},{t:"12%",l:"50%"},{t:"45%",l:"30%"},{t:"60%",l:"80%"}].map((s,i)=>(
          <div key={i} style={{ position:"absolute", top:s.t, left:s.l, width: i%3===0?"6px":"4px", height: i%3===0?"6px":"4px", borderRadius:"50%", background:"rgba(255,255,255,0.4)", pointerEvents:"none", zIndex:0 }} />
        ))}
 
        <div style={{ textAlign: "center", marginBottom: "52px", position: "relative", zIndex: 2 }}>
          <div style={{ fontFamily: "'LEMON MILK', sans-serif", fontSize: "clamp(11px,1.4vw,13px)", fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase", color: colorAzul, marginBottom: "14px" }}>
            Así empieza
          </div>
          <h2 style={{ fontFamily: "'LEMON MILK', sans-serif", fontSize: "clamp(32px,5.5vw,72px)", color: "#FFFFFF", margin: "0 0 18px", lineHeight: 1.05, fontWeight: 900 }}>
            TODO EMPIEZA CON UN<br />
            <span style={{ color: colorAzul }}>SIMPLE MENSAJE</span>
          </h2>
          <p style={{ fontFamily: "'Altone', sans-serif", fontSize: "17px", color: "#FFFFFF", maxWidth: "540px", margin: "0 auto", lineHeight: 1.65 }}>
            Estos son los mensajes reales que usan los groomers para ganar confianza y manipular.
          </p>
        </div>
 
        <div style={{ position: "relative", zIndex: 2, maxWidth: "1140px", margin: "0 auto", padding: "0 16px", display: "flex", flexDirection: "column", gap: "14px" }}>
          {[0,1,2,3,4].map((row) => {
            const rowBubbles = groomingBubbles.filter(b => b.row === row);
            return (
              <div key={row} style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" }}>
                {rowBubbles.map((bubble, j) => {
                  const globalIdx = groomingBubbles.indexOf(bubble);
                  const isVisible = visibleBubbles.includes(globalIdx);
                  const catColors: Record<string, { bg: string; icon: string; dots: string }> = {
                    contact: { bg: "rgba(255,255,255,0.9)",  icon: colorCeleste, dots: colorCeleste },
                    trust:   { bg: "#7CC96A",  icon: "#FFFFFF", dots: "#FFFFFF" },
                    secret:  { bg: "#FFFFFF",  icon: "#333333", dots: "#999999" },
                    threat:  { bg: "rgba(255,255,255,0.9)",  icon: colorCeleste, dots: colorCeleste },
                  };
                  const colors = catColors[bubble.cat] || catColors.contact;
                  return (
                    <div
                      key={j}
                      style={{
                        background: colors.bg,
                        borderRadius: "20px",
                        padding: "14px 20px",
                        minWidth: "160px",
                        maxWidth: "320px",
                        flex: "1 1 160px",
                        boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
                        opacity: isVisible ? 1 : 0,
                        transform: isVisible ? "translateY(0) scale(1)" : "translateY(16px) scale(0.94)",
                        transition: `opacity 0.3s ease ${globalIdx * 150}ms, transform 0.38s cubic-bezier(0.34,1.4,0.64,1) ${globalIdx * 150}ms`,
                        cursor: "default",
                        userSelect: "none" as const,
                      }}
                    >
                      <span style={{ fontFamily: "'Altone', sans-serif", fontSize: "15px", fontWeight: 500, color: bubble.cat === "trust" ? "#FFFFFF" : "#333", lineHeight: 1.45, display: "block" }}>
                        {bubble.text}
                      </span>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </section>
 
      {/* ── SECCIÓN 4: GROOMING CIRCLE (AZUL OSCURO) ── */}
      <section id="que-es" style={{ padding: "100px 20px 80px", position: "relative", zIndex: 1, background: colorAzul }}>
        <div className="reveal-on-scroll" style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center" }}>
            <div className="grooming-header-pill" style={{ background: colorCeleste, color: colorAzul }}>El paso a paso</div>
            <h2 className="grooming-header-main" style={{ color: "#FFFFFF" }}>del <span className="hl" style={{ color: colorCeleste }}>GROOMING</span></h2>
            <div className="grooming-divider">
              <div className="grooming-divider-line" style={{ background: `linear-gradient(90deg, transparent, rgba(116,179,206,0.6), transparent)` }} />
              <div className="grooming-divider-dot" style={{ background: colorCeleste }} />
              <div className="grooming-divider-dot" style={{ width: 9, height: 9, opacity: 1, background: colorCeleste }} />
              <div className="grooming-divider-dot" style={{ background: colorCeleste }} />
              <div className="grooming-divider-line" style={{ background: `linear-gradient(90deg, transparent, rgba(116,179,206,0.6), transparent)` }} />
            </div>
            <p className="grooming-header-sub" style={{ color: "#FFFFFF" }}>
              El grooming es una forma de manipulación donde alguien se acerca con una identidad falsa para ganarse tu confianza. Ocurre en los espacios digitales que usás todos los días: Instagram, TikTok, Roblox y chats online.
            </p>
          </div>
 
          <div style={{ marginTop: "56px" }}>
            <GroomingCircle />
          </div>
        </div>
      </section>
 
      {/* ── SECCIÓN 5: RECORRIDOS ESPECÍFICOS (CELESTE) ── */}
      <section id="mundos" style={{ padding: "100px 20px", position: "relative", zIndex: 1, background: colorCeleste }}>
        <div className="reveal-on-scroll" style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "56px" }}>
            <h2 style={{ fontFamily: "'LEMON MILK', sans-serif", fontSize: "clamp(32px,4vw,52px)", color: "#FFFFFF", margin: "0 0 20px", letterSpacing: "1px" }}>
              Un recorrido específico para cada usuario
            </h2>
            <p style={{ fontSize: "18px", lineHeight: 1.7, color: "#FFFFFF", maxWidth: "780px", margin: "0 auto" }}>
              La plataforma organiza sus contenidos según la edad y el rol de cada persona para que la prevención sea más clara y efectiva. Entra al entorno que te corresponda.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(420px, 1fr))", gap: "32px" }}>
            {worlds.map((world, idx) => (
              <article key={world.title} className={`reveal-on-scroll delay-${(idx % 2 + 1) * 100}`} style={{ padding: "40px", borderRadius: "24px", background: "rgba(255,255,255,0.2)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.4)", display: "flex", flexDirection: "column", alignItems: "flex-start", transition: "all 0.3s ease" }}>
                <h3 style={{ fontFamily: "'LEMON MILK', sans-serif", fontSize: "22px", margin: "0 0 16px", color: "#FFFFFF", letterSpacing: "0.5px" }}>{world.title}</h3>
                <p style={{ fontSize: "16px", lineHeight: 1.8, margin: "0 0 32px", color: "#FFFFFF" }}>{world.description}</p>
                <a href={world.href} className="btn-celeste" style={{ fontFamily: "'LEMON MILK', sans-serif", display: "inline-flex", padding: "16px 32px", borderRadius: "12px", textDecoration: "none", fontSize: "13px", fontWeight: "bold", textTransform: "uppercase" }}>
                  Explorar espacio
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>
 
      {/* ── FOOTER (AZUL MUY OSCURO) ── */}
      <footer style={{ background: "#051024", borderTop: "1px solid rgba(116,179,206,0.2)", padding: "40px 20px", position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "20px", flexWrap: "wrap" }}>
          <div style={{ fontFamily: "'LEMON MILK', sans-serif", fontSize: "22px", fontWeight: "bold", color: "#FFFFFF", letterSpacing: "1.5px" }}>SAFENET</div>
          <div style={{ display: "flex", gap: "26px", flexWrap: "wrap" }}>
            {navItems.map((item) => (
              <a key={item.label} href={item.href} style={{ fontFamily: "'Altone', sans-serif", textDecoration: "none", fontSize: "15px", color: "#FFFFFF", transition: "color 0.3s" }}
                onMouseOver={(e) => e.currentTarget.style.color = colorCeleste}
                onMouseOut={(e)  => e.currentTarget.style.color = "#FFFFFF"}
              >
                {item.label}
              </a>
            ))}
          </div>
          <div style={{ fontFamily: "'Altone', sans-serif", fontSize: "14px", color: "#FFFFFF" }}>
            TFG · Licenciatura en Ciberseguridad · Magalí Sarmiento
          </div>
        </div>
      </footer>
 
    </main>
  );
}