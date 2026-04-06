"use client";

import React, { useEffect, useRef, useState } from 'react';

export default function FamiliasPage() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // 1. Observer para revelar elementos al scrollear (Animaciones)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -50px 0px" }
    );

    const elements = document.querySelectorAll('.reveal-on-scroll');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  // SEÑALES CLAVE — mejoradas con datos reales de las infografías
  const keySignals = [
    {
      title: "Oculta la pantalla",
      description: "Cambia de ventana, apaga el celular o gira la pantalla cuando te acercás. Sucede de forma automática, sin explicación.",
      icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/><line x1="3" y1="3" x2="21" y2="21" stroke="#FF3C50" strokeWidth="2" /></svg>
    },
    {
      title: "Más tiempo online",
      description: "Aumenta el uso de dispositivos, especialmente de noche o de madrugada. Se pone ansioso o irritable si se le pide que se desconecte.",
      icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
    },
    {
      title: "Contactos sin explicación",
      description: "Menciona un \"amigo\" online que no sabe cómo conoció, o recibe regalos, dinero o créditos de juegos de alguien desconocido.",
      icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
    },
    {
      title: "Cambios de conducta",
      description: "Tristeza, retraimiento o enojo repentinos, especialmente después de usar el celular. Evita hablar, se aleja del grupo familiar o deja actividades que antes disfrutaba.",
      icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/><line x1="12" y1="8" x2="12" y2="15" stroke="#FF3C50"/><line x1="9" y1="11" x2="15" y2="14" stroke="#FF3C50"/></svg>
    },
  ];

  // BUENAS PRÁCTICAS — reescritas con lógica accionable
  const bestPractices = [
    {
      title: "Hablá antes de que pase algo",
      text: "Preguntá con quién habla, qué juega, qué ve. El diálogo diario normaliza la conversación y abre canales de confianza para cuando tu hijo o hija lo necesite de verdad."
    },
    {
      title: "Revisá la configuración de privacidad",
      text: "Asegurate de que los perfiles sociales y de juegos estén en modo privado. Revisá quiénes pueden ver sus fotos, su ubicación y sus datos de contacto."
    },
    {
      title: "Establecé acuerdos, no prohibiciones",
      text: "Horarios de uso, espacios sin dispositivos y reglas claras sobre contactos online. Los acuerdos construyen confianza. Las prohibiciones generan secretos."
    },
    {
      title: "Enseñá la regla de los desconocidos online",
      text: "Dejar claro que un desconocido en internet sigue siendo un desconocido, aunque lleve semanas hablando con ellos. La confianza no reemplaza la verificación."
    },
  ];

  // NUEVO BLOQUE EDUCATIVO: TIPS DE PREVENCIÓN VISUAL
  const preventionTips = [
    {
      title: "Averiguá qué redes sociales usa",
      icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
    },
    {
      title: "Revisá con quién interactúa",
      icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
    },
    {
      title: "Explicá que no todo en internet es real",
      icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
    },
    {
      title: "No aceptar solicitudes de desconocidos",
      icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="23" y2="12"/><line x1="23" y1="8" x2="19" y2="12"/></svg>
    },
    {
      title: "Configurar la privacidad de las cuentas",
      icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
    },
    {
      title: "Supervisar el uso de dispositivos",
      icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
    },
    {
      title: "Evitar uso de cámara con desconocidos",
      icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2m5.66 0H14a2 2 0 0 1 2 2v3.34l1 1L23 7v10"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
    },
    {
      title: "Hablar abiertamente sobre lo que pasa online",
      icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
    }
  ];

  // CÓMO ACTUAR — protocolo revisado y más directo
  const actionSteps = [
    {
      title: "Escuchar sin reaccionar",
      text: "Mantener la calma es lo más importante. Tu hijo o hija es una víctima de manipulación. No culpes, no retes, no les quites el dispositivo. Necesitan sentir que acudir a vos fue la decisión correcta."
    },
    {
      title: "NO BORRAR NADA",
      text: "Es el error más común y el más dañino para la investigación. Chats, fotos, audios, nombres de usuario y URLs son evidencia legal. Borrarlos puede anular una denuncia.",
      highlight: true
    },
    {
      title: "CAPTURÁ LAS PRUEBAS",
      text: "Hacé capturas de pantalla de toda la conversación. Guardá los nombres de usuario, perfiles, fotos enviadas y cualquier URL. Hacelo antes de bloquear al acosador.",
      highlight: true
    },
    {
      title: "DENUNCIÁ DE INMEDIATO",
      text: "Comunicarte con las autoridades es el paso siguiente. No intentes confrontar al acosador ni borrarlo sin antes haber registrado todo. El tiempo importa.",
      highlight: true
    }
  ];

  const navItems = [
    { label: "Inicio", href: "/" },
  ];

  // Design Tokens
  const mainBlue = "#74B3CE";
  const darkBlueAlt = "#5A99B4";
  const alertRed = "#FF3C50";
  const brandGradient = `linear-gradient(90deg, #FFFFFF 0%, ${mainBlue} 55%, #FFFFFF 100%)`;

  // Background & Interaction logic
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

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
    const particleCount = 60;
    const maxDistance = 150;

    class Particle {
      x: number; y: number; vx: number; vy: number; radius: number; isThreat: boolean;
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.isThreat = Math.random() > 0.96;
        this.radius = this.isThreat ? 3 : 1.2;
      }
      update() {
        this.x += this.vx; this.y += this.vy;
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
      }
      draw() {
        if(!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.isThreat ? "rgba(255, 60, 80, 0.7)" : "rgba(116, 179, 206, 0.5)";
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) particles.push(new Particle());

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDistance) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(116, 179, 206, ${(1 - dist/maxDistance) * 0.15})`;
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

  return (
    <main style={{ background: "radial-gradient(circle at top, #0E2A4D 0%, #0A1F3A 40%, #06152B 100%)", color: "#FFFFFF", fontFamily: "'Altone', sans-serif", minHeight: "100vh", position: "relative", overflowX: "hidden" }}>
      <style>
        {`
          @import url('https://fonts.cdnfonts.com/css/lemon-milk');
          @import url('https://fonts.cdnfonts.com/css/altone');
          html { scroll-behavior: smooth; }
          .spotlight-overlay {
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
            pointer-events: none; z-index: 10;
            background: radial-gradient(circle 600px at var(--x) var(--y), rgba(116, 179, 206, 0.08), transparent 80%);
          }
          .btn-primary {
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          }
          .btn-primary:hover {
            background: ${darkBlueAlt} !important;
            transform: translateY(-4px) scale(1.03);
            box-shadow: 0 15px 30px rgba(116, 179, 206, 0.4) !important;
          }
          .highlight-white-glow {
            color: #FFFFFF;
            text-shadow: 0 0 6px rgba(255,255,255,0.4);
          }
          .card-glass {
            background: rgba(255, 255, 255, 0.03);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(116, 179, 206, 0.15);
            transition: all 0.4s ease;
          }
          .card-glass:hover {
            border-color: ${mainBlue};
            box-shadow: 0 20px 40px rgba(0,0,0,0.4), 0 0 20px rgba(116, 179, 206, 0.1);
            transform: translateY(-5px);
          }
          /* ANIMACIONES SCROLL REVEAL */
          .reveal-on-scroll {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.8s ease, transform 0.8s ease;
          }
          .reveal-on-scroll.is-visible {
            opacity: 1;
            transform: translateY(0);
          }
          .delay-100 { transition-delay: 100ms; }
          .delay-200 { transition-delay: 200ms; }
          .delay-300 { transition-delay: 300ms; }
          .delay-400 { transition-delay: 400ms; }

          /* BURBUJAS CHAT CASO REAL */
          .chat-bubble {
            padding: 12px 18px;
            border-radius: 18px;
            font-size: 14px;
            max-width: 85%;
            margin-bottom: 12px;
            position: relative;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
          }
          .chat-groomer {
            background: rgba(255, 60, 80, 0.15);
            border: 1px solid rgba(255, 60, 80, 0.3);
            border-bottom-left-radius: 4px;
            align-self: flex-start;
          }
          .chat-victim {
            background: rgba(116, 179, 206, 0.15);
            border: 1px solid rgba(116, 179, 206, 0.3);
            border-bottom-right-radius: 4px;
            align-self: flex-end;
          }
        `}
      </style>

      {/* DECORATIVE ELEMENTS */}
      <div className="spotlight-overlay" style={{ '--x': `${mousePos.x}px`, '--y': `${mousePos.y}px` } as React.CSSProperties} />
      <canvas ref={canvasRef} style={{ position: "fixed", top: 0, left: 0, zIndex: 0, pointerEvents: "none", opacity: 0.6 }} />
      <div style={{ height: "6px", background: brandGradient, position: "relative", zIndex: 51 }} />

      {/* HEADER */}
      <header style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(5, 18, 43, 0.7)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(116, 179, 206, 0.1)" }}>
        <nav style={{ maxWidth: "1200px", margin: "0 auto", minHeight: "86px", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <a href="/" style={{ fontFamily: "'LEMON MILK', sans-serif", textDecoration: "none", color: "#FFFFFF", fontSize: "24px", fontWeight: "bold" }}>SAFENET</a>
          <div style={{ display: "flex", alignItems: "center", gap: "32px" }}>
            {navItems.map(item => (
              <a key={item.label} href={item.href} style={{ fontFamily: "'LEMON MILK', sans-serif", textDecoration: "none", color: "#FFFFFF", fontSize: "12px", letterSpacing: "0.5px" }}>{item.label}</a>
            ))}
            <a href="#ayuda" className="btn-primary" style={{ fontFamily: "'LEMON MILK', sans-serif", padding: "13px 22px", borderRadius: "14px", textDecoration: "none", background: mainBlue, color: "#FFFFFF", fontSize: "12px", fontWeight: "bold", textTransform: "uppercase" }}>Explorar espacios</a>
          </div>
        </nav>
      </header>

      {/* HERO SECTION */}
      <section style={{ padding: "80px 20px 40px", position: "relative", zIndex: 1 }}>
        <div className="reveal-on-scroll" style={{ maxWidth: "1200px", margin: "0 auto", background: "rgba(10, 20, 40, 0.4)", border: "1px solid rgba(116, 179, 206, 0.2)", borderRadius: "30px", backdropFilter: "blur(12px)", padding: "100px 32px", textAlign: "center" }}>
          <div style={{ fontFamily: "'Altone', sans-serif", display: "inline-flex", padding: "8px 20px", borderRadius: "999px", background: "rgba(116, 179, 206, 0.1)", border: `1px solid rgba(116, 179, 206, 0.3)`, color: mainBlue, fontSize: "12px", fontWeight: 700, letterSpacing: "1.2px", textTransform: "uppercase", marginBottom: "28px" }}>
            Orientación para Familias
          </div>
          <h1 style={{ fontFamily: "'LEMON MILK', sans-serif", fontSize: "clamp(36px, 4.5vw, 64px)", lineHeight: 1.15, color: "#FFFFFF", margin: "0 auto 32px", maxWidth: "1000px" }}>
            ACOMPAÑAR ES EL PRIMER PASO PARA <span style={{ color: mainBlue }}>PROTEGER</span>
          </h1>
          <p style={{ fontSize: "18px", lineHeight: 1.8, color: "#FFFFFF", maxWidth: "760px", margin: "0 auto 42px" }}>
            El grooming comienza con conversaciones que parecen normales.<br />
            Aprendé a reconocer las señales, establecer confianza y actuar si ocurre.
          </p>
          <div style={{ display: "flex", gap: "20px", justifyContent: "center" }}>
            <a href="#alertas" className="btn-primary" style={{ fontFamily: "'LEMON MILK', sans-serif", padding: "18px 32px", borderRadius: "14px", textDecoration: "none", background: mainBlue, color: "#FFFFFF", fontSize: "14px", fontWeight: "bold", textTransform: "uppercase", boxShadow: `0 8px 20px rgba(116, 179, 206, 0.3)` }}>
              Ver Señales
            </a>
            <a href="#pasos" style={{ fontFamily: "'LEMON MILK', sans-serif", padding: "18px 32px", borderRadius: "14px", textDecoration: "none", background: "rgba(255,255,255,0.05)", color: "#FFFFFF", fontSize: "14px", border: "1px solid rgba(255,255,255,0.2)", backdropFilter: "blur(5px)" }}>
              Protocolo de acción
            </a>
          </div>
        </div>
      </section>

      {/* BLOQUE DE CONCIENCIA INICIAL (Imagen + Texto) */}
      <section style={{ padding: "40px 20px 20px", position: "relative", zIndex: 1 }}>
        <div className="reveal-on-scroll delay-100" style={{ maxWidth: "1200px", margin: "0 auto", background: "rgba(255, 255, 255, 0.02)", border: "1px solid rgba(255, 255, 255, 0.05)", borderRadius: "30px", padding: "40px", backdropFilter: "blur(10px)" }}>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "50px" }}>
            
            {/* Columna Imagen */}
            <div style={{ flex: "1 1 400px", position: "relative" }}>
              <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "90%", height: "90%", background: `radial-gradient(circle, ${mainBlue}33 0%, transparent 60%)`, filter: "blur(40px)", zIndex: 0 }} />
              <img 
                src="/illustrations/PADRES1.png" 
                alt="Comunicación familiar y protección" 
                style={{ width: "100%", height: "auto", borderRadius: "24px", position: "relative", zIndex: 1, boxShadow: "0 15px 35px rgba(0,0,0,0.3)" }} 
              />
            </div>

            {/* Columna Texto */}
            <div style={{ flex: "1 1 450px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <h2 style={{ fontFamily: "'LEMON MILK', sans-serif", fontSize: "clamp(24px, 3vw, 36px)", color: "#FFFFFF", lineHeight: 1.3, marginBottom: "20px" }}>
                Para acercarse a tus hijos, los acosadores usan las formas más naturales.
              </h2>
              <p style={{ fontSize: "18px", color: "#FFFFFF", lineHeight: 1.7, marginBottom: "32px" }}>
                Hablá con ellos antes de que otros lo hagan.
              </p>
              
              <div style={{ padding: "16px 24px", background: "rgba(116, 179, 206, 0.08)", borderLeft: `4px solid ${mainBlue}`, borderRadius: "0 12px 12px 0" }}>
                <p style={{ fontSize: "18px", fontWeight: "bold", color: "#FFFFFF", margin: 0, lineHeight: 1.5 }}>
                  El peligro está ahí aunque no lo veas.<br />
                  <span style={{ color: mainBlue, display: "inline-block", marginTop: "6px" }}>#ConectateSeguro</span>
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* FRASE DE IMPACTO 1 */}
      <section className="reveal-on-scroll delay-100" style={{ padding: "40px 20px", textAlign: "center", position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <h2 style={{ fontFamily: "'LEMON MILK', sans-serif", fontSize: "clamp(24px, 3vw, 36px)", color: "#FFFFFF", textShadow: `0 0 20px rgba(255,255,255,0.3)`, lineHeight: 1.4 }}>
            EL GROOMING NO EMPIEZA CON AMENAZAS. <br />
            <span style={{ color: mainBlue }}>EMPIEZA CON CONFIANZA.</span>
          </h2>
        </div>
      </section>

      {/* CASO REAL */}
      <section style={{ padding: "60px 20px", position: "relative", zIndex: 1 }}>
        <div className="reveal-on-scroll delay-200" style={{ maxWidth: "1200px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: "40px", alignItems: "center", background: "rgba(15, 25, 45, 0.6)", borderRadius: "24px", padding: "40px", border: "1px solid rgba(116, 179, 206, 0.2)" }}>
          <div>
            <div style={{ fontSize: "12px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "1.2px", marginBottom: "8px", color: alertRed }}>Caso de estudio</div>
            <h2 style={{ fontFamily: "'LEMON MILK', sans-serif", fontSize: "32px", color: "#FFFFFF", marginBottom: "20px" }}>Así empieza en la realidad</h2>
            <p style={{ fontSize: "16px", lineHeight: 1.7, color: "#FFFFFF", marginBottom: "16px" }}>
              El acosador estudia el perfil público de la víctima, identifica sus gustos y crea una cuenta falsa diseñada para generar empatía. El proceso es gradual, calculado y difícil de detectar desde afuera.
            </p>
            <p style={{ fontSize: "15px", lineHeight: 1.7, color: "#FFFFFF", borderLeft: `3px solid ${alertRed}`, paddingLeft: "16px" }}>
              La solicitud de "guardar el secreto" es una de las primeras señales concretas. Aparece temprano, antes de que la situación escale.
            </p>
          </div>

          <div style={{ background: "#0B1528", borderRadius: "20px", padding: "24px", border: "1px solid rgba(255,255,255,0.05)", display: "flex", flexDirection: "column" }}>
            {/* Chat header */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px", paddingBottom: "16px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "rgba(255,60,80,0.2)", border: "1px solid rgba(255,60,80,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={alertRed} strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </div>
              <div>
                <div style={{ fontSize: "13px", fontWeight: "bold", color: "#FFFFFF" }}>Gamer_Pro_14</div>
                <div style={{ fontSize: "11px", color: "#FFFFFF" }}>Activo hace 2 minutos</div>
              </div>
            </div>
            <div className="chat-bubble chat-groomer">
              <span style={{ fontWeight: "bold", color: alertRed, fontSize: "12px", display: "block", marginBottom: "4px" }}>Gamer_Pro_14</span>
              Hola, vi que jugás muy bien. Podemos hacer equipo, te paso todos los trucos que sé.
            </div>
            <div className="chat-bubble chat-victim">
              <span style={{ fontWeight: "bold", color: mainBlue, fontSize: "12px", display: "block", marginBottom: "4px" }}>Usuario (11 años)</span>
              Dale, me cuesta mucho pasar este nivel.
            </div>
            <div className="chat-bubble chat-groomer" style={{ marginTop: "10px" }}>
              <span style={{ fontWeight: "bold", color: alertRed, fontSize: "12px", display: "block", marginBottom: "4px" }}>Gamer_Pro_14</span>
              Sos la única persona con la que me divierto jugando. Mandame una foto tuya para saber con quién hablo, pero no le cuentes a nadie. Es nuestro secreto.
            </div>
            {/* Alerta inline */}
            <div style={{ marginTop: "14px", padding: "10px 14px", borderRadius: "10px", background: "rgba(255,60,80,0.08)", border: "1px solid rgba(255,60,80,0.2)", display: "flex", gap: "10px", alignItems: "flex-start" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={alertRed} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginTop: "1px", flexShrink: 0 }}><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              <span style={{ fontSize: "12px", color: "rgba(255,140,140,0.9)", lineHeight: 1.5 }}>Pedir fotos y solicitar secreto en el mismo mensaje es una señal de alarma directa.</span>
            </div>
          </div>
        </div>
      </section>

      {/* SEÑALES CLAVE */}
      <section id="alertas" style={{ padding: "80px 20px", position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div className="reveal-on-scroll" style={{ textAlign: "center", marginBottom: "50px" }}>
            <div style={{ fontFamily: "'LEMON MILK', sans-serif", display: "inline-flex", padding: "12px 24px", borderRadius: "14px", background: alertRed, color: "#FFFFFF", fontSize: "14px", fontWeight: "bold", textTransform: "uppercase", marginBottom: "20px", boxShadow: `0 8px 20px rgba(255, 60, 80, 0.3)` }}>
              Detectar a tiempo
            </div>
            <h2 style={{ fontFamily: "'LEMON MILK', sans-serif", fontSize: "clamp(32px, 4vw, 48px)", color: "#FFFFFF" }}>Señales Clave de Alerta</h2>
            <p style={{ color: "#FFFFFF", fontSize: "17px", marginTop: "12px", maxWidth: "600px", margin: "12px auto 0" }}>Cambios sutiles que requieren tu atención. Ninguna señal sola define una situación, pero la combinación de varias sí.</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "24px" }}>
            {keySignals.map((signal, idx) => (
              <article key={signal.title} className={`card-glass reveal-on-scroll delay-${(idx + 1) * 100}`} style={{ padding: "32px 24px", borderRadius: "24px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ background: "rgba(255, 255, 255, 0.05)", padding: "16px", borderRadius: "50%", marginBottom: "20px", color: mainBlue }}>
                  {signal.icon}
                </div>
                <h3 style={{ fontFamily: "'LEMON MILK', sans-serif", fontSize: "18px", color: "#FFFFFF", marginBottom: "12px" }}>{signal.title}</h3>
                <p style={{ fontSize: "15px", lineHeight: 1.6, color: "#FFFFFF", margin: 0 }}>{signal.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* FRASE DE IMPACTO 2 */}
      <section className="reveal-on-scroll" style={{ padding: "40px 20px", textAlign: "center", position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: "900px", margin: "0 auto", padding: "40px", borderTop: "1px solid rgba(255,255,255,0.1)", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
          <h2 style={{ fontFamily: "'LEMON MILK', sans-serif", fontSize: "clamp(18px, 2.2vw, 26px)", color: "#FFFFFF", fontWeight: "normal", letterSpacing: "0.5px", lineHeight: 1.5 }}>
            PUEDE ESTAR PASANDO AHORA MISMO CERCA TUYO.<br />
            <span style={{ color: mainBlue }}>TU DISPONIBILIDAD ES MÁS IMPORTANTE QUE CUALQUIER CONTROL PARENTAL.</span>
          </h2>
        </div>
      </section>

      {/* BUENAS PRÁCTICAS */}
      <section style={{ padding: "80px 20px", position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div className="reveal-on-scroll" style={{ marginBottom: "40px" }}>
            <h2 style={{ fontFamily: "'LEMON MILK', sans-serif", fontSize: "36px", color: "#FFFFFF", marginBottom: "10px" }}>Buenas Prácticas en el Hogar</h2>
            <p style={{ fontSize: "16px", color: "#FFFFFF", margin: 0 }}>Acciones concretas para construir un entorno digital más seguro.</p>
          </div>
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "20px" }}>
            {bestPractices.map((practice, idx) => (
              <div key={practice.title} className={`reveal-on-scroll delay-${idx * 100}`} style={{ padding: "24px", borderRadius: "16px", background: "rgba(116, 179, 206, 0.08)", borderLeft: `4px solid ${mainBlue}` }}>
                <h3 style={{ fontFamily: "'LEMON MILK', sans-serif", fontSize: "16px", color: "#FFFFFF", marginBottom: "10px" }}>{practice.title}</h3>
                <p style={{ fontSize: "15px", lineHeight: 1.6, color: "#FFFFFF", margin: 0 }}>{practice.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NUEVO BLOQUE: TIPS VISUALES DE PREVENCIÓN (De la infografía) */}
      <section style={{ padding: "80px 20px", position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div className="reveal-on-scroll" style={{ textAlign: "center", marginBottom: "50px" }}>
            <div style={{ fontFamily: "'LEMON MILK', sans-serif", display: "inline-flex", padding: "12px 24px", borderRadius: "14px", background: "rgba(116, 179, 206, 0.15)", color: mainBlue, fontSize: "14px", fontWeight: "bold", textTransform: "uppercase", marginBottom: "20px", border: `1px solid ${mainBlue}` }}>
              Prevención Activa
            </div>
            <h2 style={{ fontFamily: "'LEMON MILK', sans-serif", fontSize: "clamp(32px, 4vw, 48px)", color: "#FFFFFF" }}>Guía Rápida de Protección</h2>
            <p style={{ color: "#FFFFFF", fontSize: "17px", marginTop: "12px", maxWidth: "600px", margin: "12px auto 0" }}>Ocho acciones indispensables para reducir los riesgos en el mundo digital de los menores.</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "24px" }}>
            {preventionTips.map((tip, idx) => (
              <div key={idx} className={`card-glass reveal-on-scroll delay-${(idx % 4) * 100}`} style={{ padding: "26px 24px", borderRadius: "20px", display: "flex", alignItems: "flex-start", gap: "20px" }}>
                <div style={{ background: "rgba(116, 179, 206, 0.1)", padding: "12px", borderRadius: "14px", color: mainBlue, flexShrink: 0, border: "1px solid rgba(116, 179, 206, 0.2)" }}>
                  {tip.icon}
                </div>
                <div style={{ display: "flex", alignItems: "center", minHeight: "52px" }}>
                  <h3 style={{ fontFamily: "'Altone', sans-serif", fontSize: "16px", color: "#FFFFFF", margin: 0, lineHeight: 1.4, fontWeight: "bold" }}>
                    {tip.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CÓMO ACTUAR (Protocolo Visual) */}
      <section id="pasos" style={{ padding: "80px 20px", position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", background: "linear-gradient(180deg, rgba(20, 30, 50, 0.8) 0%, rgba(10, 15, 30, 0.9) 100%)", borderRadius: "32px", padding: "60px 40px", border: "1px solid rgba(255, 255, 255, 0.05)" }}>
          <div className="reveal-on-scroll" style={{ textAlign: "center", marginBottom: "60px" }}>
            <h2 style={{ fontFamily: "'LEMON MILK', sans-serif", fontSize: "clamp(32px, 4vw, 42px)", color: "#FFFFFF" }}>Protocolo de Acción</h2>
            <p style={{ color: "#FFFFFF", marginTop: "10px", fontSize: "17px" }}>Si descubrís o sospechás una situación de grooming, seguí estos pasos en orden.</p>
          </div>
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "30px" }}>
            {actionSteps.map((step, idx) => (
              <div key={idx} className={`reveal-on-scroll delay-${idx * 100}`} style={{ position: "relative", padding: "30px 24px", borderRadius: "20px", background: "rgba(0,0,0,0.3)", border: step.highlight ? `1px solid ${alertRed}` : "1px solid rgba(255,255,255,0.1)", textAlign: "center" }}>
                <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: step.highlight ? alertRed : mainBlue, color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'LEMON MILK', sans-serif", fontSize: "20px", fontWeight: "bold", margin: "0 auto 20px", boxShadow: step.highlight ? `0 0 20px rgba(255,60,80,0.4)` : 'none' }}>
                  {idx + 1}
                </div>
                <h3 style={{ fontFamily: "'LEMON MILK', sans-serif", fontSize: "17px", color: step.highlight ? alertRed : "#FFFFFF", marginBottom: "16px", letterSpacing: "0.5px" }}>
                  {step.title}
                </h3>
                <p style={{ fontSize: "15px", lineHeight: 1.6, color: "#FFFFFF", margin: 0 }}>
                  {step.text}
                </p>
              </div>
            ))}
          </div>

          {/* Nota legal al pie del protocolo */}
          <div className="reveal-on-scroll" style={{ marginTop: "48px", padding: "24px 28px", borderRadius: "16px", background: "rgba(255,60,80,0.07)", border: "1px solid rgba(255,60,80,0.2)", display: "flex", gap: "16px", alignItems: "flex-start" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={alertRed} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: "2px" }}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <div>
              <div style={{ fontFamily: "'LEMON MILK', sans-serif", fontSize: "13px", color: alertRed, marginBottom: "8px" }}>Marco legal</div>
              <p style={{ fontSize: "14px", lineHeight: 1.7, color: "#FFFFFF", margin: 0 }}>
                En Argentina, el grooming está tipificado en el <strong style={{ color: "#FFFFFF" }}>artículo 131 del Código Penal</strong>. La denuncia puede realizarse en cualquier comisaría o fiscalía del país. No es necesario contar con pruebas definitivas para iniciar el proceso: la sola sospecha habilita la denuncia.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* HELP SECTION */}
      <section id="ayuda" style={{ padding: "80px 20px 120px", position: "relative", zIndex: 1 }}>
        <div className="reveal-on-scroll" style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ background: "rgba(10, 20, 45, 0.8)", borderRadius: "32px", padding: "60px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "30px", flexWrap: "wrap", border: "1px solid rgba(255, 60, 80, 0.3)", position: "relative", overflow: "hidden", backdropFilter: "blur(20px)" }}>
            <div style={{ position: "absolute", bottom: "-50px", right: "10%", width: "400px", height: "400px", background: `radial-gradient(circle, rgba(255, 60, 80, 0.1) 0%, transparent 70%)`, filter: "blur(40px)", pointerEvents: "none" }} />
            
            <div style={{ maxWidth: "760px", position: "relative", zIndex: 1 }}>
              <div style={{ fontFamily: "'Altone', sans-serif", fontSize: "13px", fontWeight: 800, letterSpacing: "1.4px", textTransform: "uppercase", color: alertRed, marginBottom: "16px" }}>Denuncia y Ayuda Profesional</div>
              <h2 style={{ fontFamily: "'LEMON MILK', sans-serif", fontSize: "clamp(28px, 3.5vw, 42px)", color: "#FFFFFF", margin: "0 0 12px" }}>¿Necesitás denunciar un caso?</h2>
              <p style={{ fontSize: "17px", color: "#FFFFFF", margin: "0 0 16px", lineHeight: 1.7 }}>Línea 137 — gratuita, confidencial, disponible las 24 horas en todo el país. También podés escribir a <strong style={{ color: "#FFFFFF" }}>brigadaninas@jus.gov.ar</strong> o llamar al <strong style={{ color: "#FFFFFF" }}>0800-222-1717</strong> (Brigada de Delitos contra Niños, Niñas y Adolescentes).</p>
              <p style={{ fontSize: "14px", color: "#FFFFFF", margin: 0 }}>No confrontes al acosador. No borres los mensajes. Llamá primero.</p>
            </div>

            <a href="tel:137" className="btn-primary" style={{ fontFamily: "'LEMON MILK', sans-serif", display: "inline-flex", padding: "20px 40px", borderRadius: "16px", background: alertRed, color: "#FFFFFF", textDecoration: "none", fontSize: "16px", fontWeight: "bold", boxShadow: `0 15px 30px rgba(255, 60, 80, 0.3)`, position: "relative", zIndex: 1 }}>Llamar al 137</a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: "rgba(5, 12, 25, 0.9)", borderTop: "1px solid rgba(116, 179, 206, 0.1)", padding: "40px 20px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "20px" }}>
          <div style={{ fontFamily: "'LEMON MILK', sans-serif", fontSize: "22px", fontWeight: "bold", color: "#FFFFFF", letterSpacing: "1.5px" }}>SAFENET</div>
          <div style={{ display: "flex", gap: "26px" }}>
            <a href="/" style={{ textDecoration: "none", color: "#FFFFFF", fontSize: "15px" }}>Inicio</a>
            <a href="#alertas" style={{ textDecoration: "none", color: "#FFFFFF", fontSize: "15px" }}>Señales</a>
            <a href="#pasos" style={{ textDecoration: "none", color: "#FFFFFF", fontSize: "15px" }}>Protocolo</a>
          </div>
          <div style={{ fontSize: "14px", color: "#FFFFFF" }}>TFG · Licenciatura en Ciberseguridad · 2026</div>
        </div>
      </footer>
    </main>
  );
}