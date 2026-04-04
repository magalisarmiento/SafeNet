"use client";

import React, { useEffect, useRef, useState } from 'react';

export default function DocentesPage() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const classroomActivities = [
    {
      level: "Nivel primario (9–12 años)",
      title: 'Juego de roles: "¿Bien o mal?"',
      description: "Identificación de situaciones de bienestar o incomodidad para trabajar la señal de alerta interna y el derecho a decir que no.",
      meta: "45 min · Grupal",
    },
    {
      level: "Nivel secundario (13–17 años)",
      title: "Análisis de chats ficticios",
      description: "Identificación de señales de alerta en grupos de debate. Análisis de toma de decisiones seguras en entornos reales.",
      meta: "60 min · Grupal",
    },
    {
      level: "Todas las edades",
      title: 'Taller de Deepfakes y Privacidad',
      description: "Reflexión sobre manipulación digital y circulación de imágenes. Qué conviene compartir y qué no.",
      meta: "45 min · Taller visual",
    },
    {
      level: "Nivel secundario",
      title: "Auditoría de Redes Sociales",
      description: "Revisión técnica de perfiles: configuración de privacidad, contactos permitidos e información visible.",
      meta: "40 min · Individual",
    },
  ];

  const protocolSteps = [
    {
      title: "Escuchar y registrar",
      text: "Recibir la situación con seriedad, sin minimizar. Registrar información básica y preservar evidencia disponible sin forzar detalles.",
    },
    {
      title: "No exponer al estudiante",
      text: "Evitar conversaciones públicas o intervenciones que aumenten la vergüenza, el miedo o la circulación de rumores en la institución.",
    },
    {
      title: "Activar referentes",
      text: "Dar aviso a las autoridades institucionales correspondientes según el protocolo escolar y el nivel educativo.",
    },
    {
      title: "Derivar y acompañar",
      text: "Buscar orientación formal profesional mientras se mantiene el acompañamiento pedagógico y emocional del estudiante.",
    },
  ];

  const legalPoints = [
    "El abordaje debe ser siempre institucional, no una responsabilidad individual del docente.",
    "La protección del estudiante y la preservación de evidencia son prioridades absolutas.",
    "La prevención incluye educación digital, privacidad, consentimiento y pedido de ayuda.",
    "Es vital contar con criterios claros para registrar y derivar situaciones de riesgo sin improvisar.",
  ];

  const navItems = [
    { label: "Inicio", href: "/" },
  ];

  // Colors & Styles consistent with Home
  const mainBlue = "#74B3CE";
  const darkBlueAlt = "#5A99B4";
  const alertRed = "#FF3C50";
  const brandGradient = `linear-gradient(90deg, #FFFFFF 0%, ${mainBlue} 55%, #FFFFFF 100%)`;

  // Effects
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
        ctx.fillStyle = this.isThreat ? "rgba(255, 60, 80, 0.7)" : "rgba(116, 179, 206, 0.4)";
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
  }, []);

  return (
    <main style={{ background: "#051024", color: "#FFFFFF", fontFamily: "'Altone', sans-serif", minHeight: "100vh", position: "relative" }}>
      <style>
        {`
          @import url('https://fonts.cdnfonts.com/css/lemon-milk');
          @import url('https://fonts.cdnfonts.com/css/altone');
          html { scroll-behavior: smooth; }
          .spotlight-overlay {
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
            pointer-events: none; z-index: 10;
            background: radial-gradient(circle 600px at var(--x) var(--y), rgba(116, 179, 206, 0.05), transparent 80%);
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
        `}
      </style>

      {/* BACKGROUND ELEMENTS */}
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
            <a href="#mundos" className="btn-primary" style={{ fontFamily: "'LEMON MILK', sans-serif", padding: "13px 22px", borderRadius: "14px", textDecoration: "none", background: mainBlue, color: "#FFFFFF", fontSize: "12px", fontWeight: "bold", textTransform: "uppercase" }}>Explorar espacios</a>
          </div>
        </nav>
      </header>

      {/* HERO SECTION */}
      <section style={{ padding: "80px 20px", position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", background: "rgba(10, 20, 40, 0.4)", border: "1px solid rgba(116, 179, 206, 0.2)", borderRadius: "30px", backdropFilter: "blur(12px)", padding: "100px 32px", textAlign: "center" }}>
          <div style={{ fontFamily: "'Altone', sans-serif", display: "inline-flex", padding: "8px 20px", borderRadius: "999px", background: "rgba(116, 179, 206, 0.1)", border: `1px solid rgba(116, 179, 206, 0.3)`, color: mainBlue, fontSize: "12px", fontWeight: 700, letterSpacing: "1.2px", textTransform: "uppercase", marginBottom: "28px" }}>
            Recursos para Instituciones
          </div>
          <h1 style={{ fontFamily: "'LEMON MILK', sans-serif", fontSize: "clamp(36px, 4.5vw, 64px)", lineHeight: 1.15, color: "#FFFFFF", margin: "0 auto 32px", maxWidth: "1000px" }}>
            RECURSOS PARA PREVENIR Y <span style={{ color: mainBlue }}>ACTUAR</span> DESDE EL AULA
          </h1>
          <p style={{ fontSize: "18px", lineHeight: 1.8, color: "#FFFFFF", maxWidth: "760px", margin: "0 auto 42px" }}>
            ESTRATEGIAS PEDAGÓGICAS Y CRITERIOS DE ACTUACIÓN INSTITUCIONAL DISEÑADOS PARA 
            ABORDAR EL GROOMING DESDE UNA PERSPECTIVA PROFESIONAL Y SEGURA.
          </p>
          <div style={{ display: "flex", gap: "20px", justifyContent: "center" }}>
            <a href="#aula" className="btn-primary" style={{ fontFamily: "'LEMON MILK', sans-serif", padding: "18px 32px", borderRadius: "14px", textDecoration: "none", background: mainBlue, color: "#FFFFFF", fontSize: "14px", fontWeight: "bold", textTransform: "uppercase", boxShadow: `0 8px 20px rgba(116, 179, 206, 0.3)` }}>
              Ver Actividades
            </a>
            <a href="#protocolo" style={{ fontFamily: "'LEMON MILK', sans-serif", padding: "18px 32px", borderRadius: "14px", textDecoration: "none", background: "rgba(255,255,255,0.05)", color: "#FFFFFF", fontSize: "14px", border: "1px solid rgba(255,255,255,0.2)", backdropFilter: "blur(5px)" }}>
              Acción de emergencia
            </a>
          </div>
        </div>
      </section>

      {/* CONTEXTO SECTION */}
      <section style={{ padding: "60px 20px", position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "grid", gridTemplateColumns: "0.8fr 1.2fr", gap: "60px", alignItems: "center" }}>
          <div style={{ borderLeft: "2px solid #FFFFFF", paddingLeft: "24px" }}>
            <div style={{ fontSize: "11px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "1.2px", marginBottom: "8px", color: mainBlue }}>01. Rol Institucional</div>
            <h2 style={{ fontFamily: "'LEMON MILK', sans-serif", fontSize: "36px", color: "#FFFFFF", margin: 0 }}>La escuela como primer espacio de detección</h2>
          </div>
          <div style={{ padding: "32px", borderRadius: "24px", background: "rgba(116, 179, 206, 0.05)", border: "1px solid rgba(116, 179, 206, 0.2)" }}>
            <p style={{ fontSize: "17px", lineHeight: 1.8, color: "#FFFFFF", margin: 0 }}>
              EL ENTORNO EDUCATIVO ES CLAVE PARA TRABAJAR LA PREVENCIÓN. A TRAVÉS DE LA 
              <span className="highlight-white-glow" style={{ fontWeight: 600 }}> EDUCACIÓN SEXUAL INTEGRAL (ESI) </span> 
              Y LA ALFABETIZACIÓN DIGITAL, BRINDAMOS HERRAMIENTAS PARA IDENTIFICAR RIESGOS 
              Y FORTALECER EL VÍNCULO CON ADULTOS DE CONFIANZA.
            </p>
          </div>
        </div>
      </section>

      {/* ACTIVIDADES SECTION */}
      <section id="aula" style={{ padding: "100px 20px", position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ marginBottom: "48px" }}>
            <div style={{ fontFamily: "'LEMON MILK', sans-serif", display: "inline-flex", padding: "18px 32px", borderRadius: "14px", background: mainBlue, color: "#FFFFFF", fontSize: "14px", fontWeight: "bold", textTransform: "uppercase", marginBottom: "20px", boxShadow: `0 8px 20px rgba(116, 179, 206, 0.3)` }}>Actividades en el aula</div>
            <h2 style={{ fontFamily: "'LEMON MILK', sans-serif", fontSize: "42px", color: "#FFFFFF" }}>Contenidos para trabajar con estudiantes</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "24px" }}>
            {classroomActivities.map(item => (
              <article key={item.title} className="card-glass" style={{ padding: "32px", borderRadius: "24px", display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: "320px" }}>
                <div>
                  <div style={{ fontSize: "12px", color: mainBlue, fontWeight: "bold", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "12px" }}>{item.level}</div>
                  <h3 style={{ fontFamily: "'LEMON MILK', sans-serif", fontSize: "20px", color: "#FFFFFF", marginBottom: "16px" }}>{item.title}</h3>
                  <p style={{ fontSize: "16px", lineHeight: 1.7, color: "#FFFFFF", marginBottom: "24px" }}>{item.description}</p>
                </div>
                <div style={{ fontSize: "14px", fontWeight: "bold", color: "#FFFFFF", borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "20px" }}>⏱ {item.meta}</div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* PROTOCOLO SECTION */}
      <section id="protocolo" style={{ padding: "80px 20px", position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "60px" }}>
            <h2 style={{ fontFamily: "'LEMON MILK', sans-serif", fontSize: "36px", color: "#FFFFFF" }}>Protocolo de acción inmediata</h2>
            <p style={{ color: "#FFFFFF", marginTop: "10px" }}>Pasos fundamentales ante una sospecha o denuncia concreta en la institución.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "20px" }}>
            {protocolSteps.map((step, idx) => (
              <div key={step.title} style={{ padding: "32px", borderRadius: "24px", background: "rgba(20, 30, 50, 0.5)", border: "1px solid rgba(255, 255, 255, 0.1)" }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: mainBlue, color: "#051024", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'LEMON MILK', sans-serif", fontSize: "18px", marginBottom: "20px", fontWeight: "bold" }}>{idx + 1}</div>
                <h3 className="highlight-white-glow" style={{ fontFamily: "'LEMON MILK', sans-serif", fontSize: "18px", marginBottom: "12px" }}>{step.title}</h3>
                <p style={{ fontSize: "15px", lineHeight: 1.6, color: "#FFFFFF" }}>{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MARCO LEGAL SECTION */}
      <section id="marco-legal" style={{ padding: "100px 20px", position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ background: "rgba(10, 20, 45, 0.8)", borderRadius: "32px", padding: "60px", backdropFilter: "blur(20px)", border: "1px solid rgba(116, 179, 206, 0.2)" }}>
            <div style={{ fontSize: "13px", fontWeight: 800, letterSpacing: "1.4px", textTransform: "uppercase", color: mainBlue, marginBottom: "16px" }}>Aspectos Legales</div>
            <h2 style={{ fontFamily: "'LEMON MILK', sans-serif", fontSize: "38px", color: "#FFFFFF", marginBottom: "40px" }}>Criterios de abordaje institucional</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px" }}>
              {legalPoints.map((point, idx) => (
                <div key={idx} style={{ display: "flex", gap: "16px", padding: "20px", borderRadius: "18px", background: "rgba(255, 255, 255, 0.03)", border: "1px solid rgba(255, 255, 255, 0.08)" }}>
                  <div style={{ color: mainBlue, fontSize: "20px" }}>•</div>
                  <p style={{ color: "#FFFFFF", fontSize: "15px", lineHeight: 1.6, margin: 0 }}>{point}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: "rgba(5, 12, 25, 0.9)", borderTop: "1px solid rgba(116, 179, 206, 0.1)", padding: "40px 20px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "20px" }}>
          <div style={{ fontFamily: "'LEMON MILK', sans-serif", fontSize: "22px", fontWeight: "bold", color: "#FFFFFF", letterSpacing: "1.5px" }}>SAFENET</div>
          <div style={{ display: "flex", gap: "26px" }}>
            <a href="/" style={{ textDecoration: "none", color: "#FFFFFF", fontSize: "15px" }}>Inicio</a>
            <a href="#aula" style={{ textDecoration: "none", color: "#FFFFFF", fontSize: "15px" }}>Recursos</a>
            <a href="#protocolo" style={{ textDecoration: "none", color: "#FFFFFF", fontSize: "15px" }}>Protocolo</a>
          </div>
          <div style={{ fontSize: "14px", color: "#FFFFFF" }}>TFG · Licenciatura en Ciberseguridad · 2026</div>
        </div>
      </footer>
    </main>
  );
}