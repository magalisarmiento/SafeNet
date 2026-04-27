"use client";

import React, { useEffect, useRef, useState } from 'react';
import { trackWorldEntry } from "@/lib/tracking";

export default function DocentesPage() {
  useEffect(() => {
    trackWorldEntry("docentes");
  }, []);

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const groomingStages = [
    {
      title: "Selección de la víctima",
      text: "Observa perfiles, intereses, vulnerabilidades o necesidad de atención en entornos digitales.",
    },
    {
      title: "Primer contacto",
      text: "Se acerca con un perfil falso o con una identidad adaptada a los gustos y lenguaje del estudiante.",
    },
    {
      title: "Construcción de confianza",
      text: "Genera cercanía, afinidad y conversaciones frecuentes para volverse una figura confiable o un 'amigo'.",
    },
    {
      title: "Aislamiento",
      text: "Empieza a pedir secreto, exclusividad o privacidad en la relación digital, alejándolo de su entorno.",
    },
    {
      title: "Pedido de contenido o información",
      text: "Solicita fotos, datos personales, videollamadas o material de carácter íntimo progresivamente.",
    },
    {
      title: "Manipulación o chantaje",
      text: "Usa el miedo, la presión o amenazas de publicar el contenido para sostener el vínculo y escalar el abuso.",
    },
  ];

  // --- NUEVA DATA PARA LA SECCIÓN "HERRAMIENTAS PARA EL AULA" ---
  const activityTypes = [
    {
      title: "Debate guiado",
      description: "Espacios de diálogo estructurado sobre dilemas de privacidad y límites digitales.",
      icon: <path strokeLinecap="round" strokeLinejoin="round" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
    },
    {
      title: "Análisis de casos",
      description: "Estudio de situaciones reales o ficticias para identificar patrones de riesgo.",
      icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    },
    {
      title: "Simulación de chats",
      description: "Ejercicios prácticos de toma de decisiones frente a contactos desconocidos.",
      icon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
    },
    {
      title: "Detección de perfiles",
      description: "Auditoría de cuentas para aprender a verificar identidades y privacidad.",
      icon: <path strokeLinecap="round" strokeLinejoin="round" d="M10 21h7a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v11m0 5l4.879-4.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242z" />
    }
  ];

  const workFormats = [
    {
      title: "Reflexión escrita",
      icon: <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
    },
    {
      title: "Tablero colaborativo",
      icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
    },
    {
      title: "Presentación",
      icon: <path strokeLinecap="round" strokeLinejoin="round" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
    },
    {
      title: "Dinámica grupal",
      icon: <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    }
  ];

  const concreteExamples = [
    "Analizar una conversación simulada en WhatsApp para detectar señales tempranas de manipulación y grooming.",
    "Debatir en grupos qué decisiones tomar frente a un escenario ficticio donde un contacto online pide mantener un secreto.",
    "Construir de forma colaborativa un 'Decálogo de Seguridad Digital' con reglas aplicables para el entorno del aula."
  ];
  // ------------------------------------------------------------------

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

  // Colors & Styles consistent with Home but adapted for Docentes
  const mainBlue = "#74B3CE";
  const darkBlueAlt = "#5A99B4";
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
    const particleCount = 45; 
    const maxDistance = 160;

    class Particle {
      x: number; y: number; vx: number; vy: number; radius: number; isThreat: boolean;
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.25;
        this.vy = (Math.random() - 0.5) * 0.25;
        this.isThreat = Math.random() > 0.98;
        this.radius = this.isThreat ? 2.5 : 1.0; 
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
        ctx.fillStyle = this.isThreat ? "rgba(255, 60, 80, 0.5)" : "rgba(116, 179, 206, 0.5)";
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
            ctx.strokeStyle = `rgba(116, 179, 206, ${(1 - dist/maxDistance) * 0.1})`;
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
    <main style={{ 
      background: "radial-gradient(circle at top, #10304F 0%, #0B2340 42%, #07182D 100%)", 
      color: "#FFFFFF", 
      fontFamily: "'Altone', sans-serif", 
      minHeight: "100vh", 
      position: "relative" 
    }}>
      <style>
        {`
          @import url('https://fonts.cdnfonts.com/css/lemon-milk');
          @import url('https://fonts.cdnfonts.com/css/altone');
          html { scroll-behavior: smooth; }
          .spotlight-overlay {
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
            pointer-events: none; z-index: 10;
            background: radial-gradient(circle 500px at var(--x) var(--y), rgba(116, 179, 206, 0.03), transparent 70%);
          }
          .btn-primary {
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          }
          .btn-primary:hover {
            background: ${darkBlueAlt} !important;
            transform: translateY(-3px) scale(1.02);
            box-shadow: 0 10px 20px rgba(116, 179, 206, 0.3) !important;
          }
          .highlight-white-glow {
            color: #FFFFFF;
            text-shadow: 0 0 6px rgba(255,255,255,0.4);
          }
          .card-glass {
            background: rgba(255, 255, 255, 0.03);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(116, 179, 206, 0.2);
            transition: all 0.4s ease;
          }
          .card-glass:hover {
            border-color: rgba(116, 179, 206, 0.5);
            box-shadow: 0 15px 30px rgba(0,0,0,0.3), 0 0 15px rgba(116, 179, 206, 0.08);
            transform: translateY(-3px);
          }

          /* --- ESTILOS DE LÍNEA DE TIEMPO (PREVIOS) --- */
          .timeline-wrapper {
            position: relative;
            max-width: 1000px;
            margin: 0 auto;
            padding: 40px 0;
          }
          .timeline-line {
            position: absolute;
            left: 28px;
            top: 0;
            bottom: 0;
            width: 2px;
            background: linear-gradient(to bottom, rgba(116,179,206,0.8), rgba(116,179,206,0.05));
            z-index: 0;
          }
          .timeline-step {
            position: relative;
            display: flex;
            align-items: flex-start;
            margin-bottom: 40px;
            z-index: 1;
          }
          .timeline-node {
            flex-shrink: 0;
            width: 58px;
            height: 58px;
            border-radius: 50%;
            background: #0B2340;
            border: 2px solid ${mainBlue};
            display: flex;
            align-items: center;
            justify-content: center;
            color: #FFFFFF;
            font-family: 'LEMON MILK', sans-serif;
            font-size: 18px;
            font-weight: bold;
            box-shadow: 0 0 15px rgba(116, 179, 206, 0.15);
            z-index: 2;
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          }
          .timeline-content {
            flex-grow: 1;
            margin-left: 30px;
            position: relative;
          }
          .timeline-connector { display: none; }
          .timeline-arrow { display: none; }
          
          .timeline-step:hover .timeline-node {
            transform: scale(1.15);
            background: ${mainBlue};
            color: #051024;
            box-shadow: 0 0 25px rgba(116, 179, 206, 0.5);
          }
          .timeline-step:hover .timeline-content {
            border-color: rgba(116, 179, 206, 0.4);
            background: rgba(16, 48, 79, 0.4);
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
          }

          @media (min-width: 768px) {
            .timeline-line { left: 50%; transform: translateX(-50%); }
            .timeline-step { justify-content: space-between; margin-bottom: 60px; }
            .timeline-node { position: absolute; left: 50%; transform: translateX(-50%); }
            .timeline-content { width: 43%; flex-grow: 0; margin-left: 0; }
            .timeline-step:nth-child(odd) { justify-content: flex-start; }
            .timeline-step:nth-child(even) { justify-content: flex-end; }
            .timeline-connector {
              display: block; position: absolute; top: 29px; width: 7%; height: 2px; z-index: 0;
            }
            .timeline-step:nth-child(odd) .timeline-connector { right: 43%; background: linear-gradient(270deg, rgba(116,179,206,0.6), transparent); }
            .timeline-step:nth-child(even) .timeline-connector { left: 43%; background: linear-gradient(90deg, rgba(116,179,206,0.6), transparent); }
            .timeline-arrow {
              display: flex; position: absolute; left: 50%; transform: translateX(-50%);
              top: calc(100% + 20px); color: rgba(116, 179, 206, 0.6); z-index: 1;
              animation: floatArrow 2s infinite ease-in-out;
            }
            .timeline-step:nth-child(odd):hover .timeline-content { transform: translateY(-3px) translateX(-6px); }
            .timeline-step:nth-child(even):hover .timeline-content { transform: translateY(-3px) translateX(6px); }
          }
          @keyframes floatArrow {
            0%, 100% { transform: translate(-50%, 0); }
            50% { transform: translate(-50%, 5px); }
          }

          /* --- NUEVOS ESTILOS PARA LA SECCIÓN AULA --- */
          .tool-card {
            background: rgba(16, 48, 79, 0.3);
            border: 1px solid rgba(116, 179, 206, 0.15);
            border-radius: 20px;
            padding: 28px;
            transition: all 0.3s ease;
            display: flex;
            flex-direction: column;
            gap: 16px;
          }
          .tool-card:hover {
            background: rgba(16, 48, 79, 0.6);
            border-color: ${mainBlue};
            transform: translateY(-4px);
            box-shadow: 0 10px 25px rgba(0,0,0,0.3), 0 0 15px rgba(116, 179, 206, 0.1);
          }
          .tool-icon-wrapper {
            width: 48px;
            height: 48px;
            border-radius: 12px;
            background: rgba(116, 179, 206, 0.1);
            color: ${mainBlue};
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
          }
          .tool-card:hover .tool-icon-wrapper {
            background: ${mainBlue};
            color: #051024;
            transform: scale(1.1);
          }
          
          .format-card {
            display: flex;
            align-items: center;
            gap: 16px;
            padding: 20px;
            border-radius: 16px;
            background: rgba(255, 255, 255, 0.02);
            border: 1px solid rgba(255, 255, 255, 0.08);
            transition: all 0.3s ease;
          }
          .format-card:hover {
            border-color: rgba(116, 179, 206, 0.4);
            background: rgba(116, 179, 206, 0.05);
            transform: translateX(4px);
          }
          .example-card {
            position: relative;
            padding: 24px 24px 24px 50px;
            border-radius: 16px;
            background: linear-gradient(90deg, rgba(16, 48, 79, 0.5) 0%, rgba(116, 179, 206, 0.05) 100%);
            border-left: 4px solid ${mainBlue};
            transition: all 0.3s ease;
          }
          .example-card::before {
            content: '→';
            position: absolute;
            left: 20px;
            top: 24px;
            color: ${mainBlue};
            font-weight: bold;
            font-size: 18px;
            line-height: 1.6;
          }
          .example-card:hover {
            background: linear-gradient(90deg, rgba(16, 48, 79, 0.8) 0%, rgba(116, 179, 206, 0.1) 100%);
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
          }
        `}
      </style>

      {/* BACKGROUND ELEMENTS */}
      <div className="spotlight-overlay" style={{ '--x': `${mousePos.x}px`, '--y': `${mousePos.y}px` } as React.CSSProperties} />
      <canvas ref={canvasRef} style={{ position: "fixed", top: 0, left: 0, zIndex: 0, pointerEvents: "none", opacity: 0.6 }} />
      <div style={{ height: "6px", background: brandGradient, position: "relative", zIndex: 51 }} />

      {/* HEADER */}
      <header style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(7, 24, 45, 0.75)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(116, 179, 206, 0.15)" }}>
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
        <div style={{ maxWidth: "1200px", margin: "0 auto", background: "rgba(16, 48, 79, 0.25)", border: "1px solid rgba(116, 179, 206, 0.25)", borderRadius: "30px", backdropFilter: "blur(12px)", padding: "100px 32px", textAlign: "center" }}>
          <div style={{ fontFamily: "'Altone', sans-serif", display: "inline-flex", padding: "8px 20px", borderRadius: "999px", background: "rgba(116, 179, 206, 0.1)", border: `1px solid rgba(116, 179, 206, 0.3)`, color: mainBlue, fontSize: "12px", fontWeight: 700, letterSpacing: "1.2px", textTransform: "uppercase", marginBottom: "28px" }}>
            Recursos para Instituciones
          </div>
          <h1 style={{ fontFamily: "'LEMON MILK', sans-serif", fontSize: "clamp(36px, 4.5vw, 64px)", lineHeight: 1.15, color: "#FFFFFF", margin: "0 auto 32px", maxWidth: "1000px" }}>
            RECURSOS PARA PREVENIR Y <span style={{ color: mainBlue }}>ACTUAR</span> DESDE EL AULA
          </h1>
          <p style={{ fontSize: "18px", lineHeight: 1.8, color: "#FFFFFF", maxWidth: "760px", margin: "0 auto 42px" }}>
            Estrategias pedagógicas y criterios de actuación institucional diseñados para
            abordar el grooming desde una perspectiva profesional y segura.
          </p>
          <div style={{ display: "flex", gap: "20px", justifyContent: "center" }}>
            <a href="#etapas" className="btn-primary" style={{ fontFamily: "'LEMON MILK', sans-serif", padding: "18px 32px", borderRadius: "14px", textDecoration: "none", background: mainBlue, color: "#FFFFFF", fontSize: "14px", fontWeight: "bold", textTransform: "uppercase", boxShadow: `0 8px 20px rgba(116, 179, 206, 0.25)` }}>
              Ver proceso
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
          <div style={{ borderLeft: "2px solid #74B3CE", paddingLeft: "24px" }}>
            <div style={{ fontSize: "11px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "1.2px", marginBottom: "8px", color: mainBlue }}>01. Rol Institucional</div>
            <h2 style={{ fontFamily: "'LEMON MILK', sans-serif", fontSize: "36px", color: "#FFFFFF", margin: 0 }}>La escuela como primer espacio de detección</h2>
          </div>
          <div style={{ padding: "32px", borderRadius: "24px", background: "rgba(116, 179, 206, 0.05)", border: "1px solid rgba(116, 179, 206, 0.15)" }}>
            <p style={{ fontSize: "17px", lineHeight: 1.8, color: "#FFFFFF", margin: 0 }}>
              El entorno educativo es clave para trabajar la prevención. A través de la 
              <span className="highlight-white-glow" style={{ fontWeight: 600 }}> educación sexual integral (ESI) </span> 
              y la alfabetización digital, brindamos herramientas para identificar riesgos 
              y fortalecer el vínculo con adultos de confianza.
            </p>
          </div>
        </div>
      </section>

      {/* ETAPAS DEL GROOMING SECTION */}
      <section id="etapas" style={{ padding: "100px 20px", position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "80px" }}>
            <div style={{ fontFamily: "'LEMON MILK', sans-serif", display: "inline-flex", padding: "12px 24px", borderRadius: "14px", background: "rgba(116, 179, 206, 0.1)", border: "1px solid rgba(116, 179, 206, 0.3)", color: mainBlue, fontSize: "13px", fontWeight: "bold", textTransform: "uppercase", marginBottom: "20px" }}>
              Proceso de escalada
            </div>
            <h2 style={{ fontFamily: "'LEMON MILK', sans-serif", fontSize: "42px", color: "#FFFFFF" }}>Cómo escala el grooming</h2>
            <p style={{ color: "#FFFFFF", marginTop: "16px", fontSize: "18px", maxWidth: "700px", margin: "16px auto 0", lineHeight: 1.6 }}>
              Comprender el proceso ayuda a detectar señales tempranas y actuar antes de que la situación avance.
            </p>
          </div>

          <div className="timeline-wrapper">
            <div className="timeline-line"></div>
            {groomingStages.map((stage, idx) => (
              <div key={idx} className="timeline-step">
                <div className="timeline-connector"></div>
                <div className="timeline-node">0{idx + 1}</div>
                <div className="timeline-content card-glass" style={{ padding: "32px", borderRadius: "20px" }}>
                  <h3 style={{ fontFamily: "'LEMON MILK', sans-serif", fontSize: "20px", color: "#FFFFFF", marginBottom: "12px", letterSpacing: "0.5px" }}>{stage.title}</h3>
                  <p style={{ fontSize: "16px", lineHeight: 1.6, color: "#FFFFFF", margin: 0 }}>{stage.text}</p>
                </div>
                {idx < groomingStages.length - 1 && (
                  <div className="timeline-arrow">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="7 10 12 15 17 10"></polyline>
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NUEVA SECCIÓN: HERRAMIENTAS PARA EL AULA */}
      <section id="aula" style={{ padding: "100px 20px", position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          
          <div style={{ marginBottom: "60px" }}>
            <div style={{ fontFamily: "'LEMON MILK', sans-serif", display: "inline-flex", padding: "16px 28px", borderRadius: "14px", background: "rgba(116, 179, 206, 0.15)", border: "1px solid rgba(116, 179, 206, 0.3)", color: "#FFFFFF", fontSize: "14px", fontWeight: "bold", textTransform: "uppercase", marginBottom: "20px" }}>
              Aplicación en el aula
            </div>
            <h2 style={{ fontFamily: "'LEMON MILK', sans-serif", fontSize: "42px", color: "#FFFFFF" }}>Herramientas pedagógicas</h2>
            <p style={{ color: "#FFFFFF", marginTop: "16px", fontSize: "18px", maxWidth: "800px", lineHeight: 1.6 }}>
              Opciones prácticas y formatos de trabajo diseñados para abordar la prevención digital de manera estructurada, segura y participativa.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "80px" }}>
            
            {/* BLOQUE 1: Tipos de actividades */}
            <div>
              <h3 style={{ fontFamily: "'LEMON MILK', sans-serif", fontSize: "22px", color: mainBlue, marginBottom: "30px", borderBottom: `1px solid rgba(116, 179, 206, 0.2)`, paddingBottom: "16px" }}>
                1. Tipos de dinámicas
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "24px" }}>
                {activityTypes.map((activity, idx) => (
                  <div key={idx} className="tool-card">
                    <div className="tool-icon-wrapper">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        {activity.icon}
                      </svg>
                    </div>
                    <div>
                      <h4 style={{ fontFamily: "'LEMON MILK', sans-serif", fontSize: "18px", color: "#FFFFFF", marginBottom: "12px" }}>{activity.title}</h4>
                      <p style={{ fontSize: "15px", lineHeight: 1.6, color: "#FFFFFF", margin: 0 }}>{activity.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* BLOQUE 2: Formatos de trabajo */}
            <div>
              <h3 style={{ fontFamily: "'LEMON MILK', sans-serif", fontSize: "22px", color: mainBlue, marginBottom: "30px", borderBottom: `1px solid rgba(116, 179, 206, 0.2)`, paddingBottom: "16px" }}>
                2. Formatos de implementación
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "20px" }}>
                {workFormats.map((format, idx) => (
                  <div key={idx} className="format-card">
                    <div style={{ color: mainBlue, display: "flex", alignItems: "center" }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        {format.icon}
                      </svg>
                    </div>
                    <span style={{ fontSize: "16px", fontWeight: 600, color: "#FFFFFF", letterSpacing: "0.5px" }}>{format.title}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* BLOQUE 3: Ejemplos Concretos */}
            <div>
              <h3 style={{ fontFamily: "'LEMON MILK', sans-serif", fontSize: "22px", color: mainBlue, marginBottom: "30px", borderBottom: `1px solid rgba(116, 179, 206, 0.2)`, paddingBottom: "16px" }}>
                3. Ejemplos concretos para llevar al aula
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {concreteExamples.map((example, idx) => (
                  <div key={idx} className="example-card">
                    <p style={{ fontSize: "16px", lineHeight: 1.6, color: "#FFFFFF", margin: 0 }}>
                      {example}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* PROTOCOLO SECTION */}
      <section id="protocolo" style={{ padding: "80px 20px", position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "60px" }}>
            <h2 style={{ fontFamily: "'LEMON MILK', sans-serif", fontSize: "36px", color: "#FFFFFF" }}>Protocolo de acción inmediata</h2>
            <p style={{ color: "#FFFFFF", marginTop: "10px", fontSize: "18px" }}>Pasos fundamentales ante una sospecha o denuncia concreta en la institución.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "20px" }}>
            {protocolSteps.map((step, idx) => (
              <div key={step.title} style={{ padding: "32px", borderRadius: "24px", background: "rgba(16, 48, 79, 0.4)", border: "1px solid rgba(116, 179, 206, 0.2)" }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "rgba(116, 179, 206, 0.15)", border: "1px solid rgba(116, 179, 206, 0.3)", color: mainBlue, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'LEMON MILK', sans-serif", fontSize: "18px", marginBottom: "20px", fontWeight: "bold" }}>{idx + 1}</div>
                <h3 style={{ fontFamily: "'LEMON MILK', sans-serif", fontSize: "18px", marginBottom: "12px", color: "#FFFFFF" }}>{step.title}</h3>
                <p style={{ fontSize: "15px", lineHeight: 1.6, color: "#FFFFFF" }}>{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MARCO LEGAL SECTION */}
      <section id="marco-legal" style={{ padding: "100px 20px", position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ background: "rgba(11, 35, 64, 0.85)", borderRadius: "32px", padding: "60px", backdropFilter: "blur(20px)", border: "1px solid rgba(116, 179, 206, 0.25)" }}>
            <div style={{ fontSize: "13px", fontWeight: 800, letterSpacing: "1.4px", textTransform: "uppercase", color: mainBlue, marginBottom: "16px" }}>Aspectos Legales</div>
            <h2 style={{ fontFamily: "'LEMON MILK', sans-serif", fontSize: "38px", color: "#FFFFFF", marginBottom: "40px" }}>Criterios de abordaje institucional</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px" }}>
              {legalPoints.map((point, idx) => (
                <div key={idx} style={{ display: "flex", gap: "16px", padding: "24px", borderRadius: "18px", background: "rgba(255, 255, 255, 0.02)", border: "1px solid rgba(116, 179, 206, 0.15)" }}>
                  <div style={{ color: mainBlue, fontSize: "20px" }}>•</div>
                  <p style={{ color: "#FFFFFF", fontSize: "15px", lineHeight: 1.6, margin: 0 }}>{point}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: "#07182D", borderTop: "1px solid rgba(116, 179, 206, 0.15)", padding: "40px 20px", position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "20px" }}>
          <div style={{ fontFamily: "'LEMON MILK', sans-serif", fontSize: "22px", fontWeight: "bold", color: "#FFFFFF", letterSpacing: "1.5px" }}>SAFENET</div>
          <div style={{ display: "flex", gap: "26px" }}>
            <a href="/" style={{ textDecoration: "none", color: "#FFFFFF", fontSize: "15px", transition: "color 0.3s" }}>Inicio</a>
            <a href="#aula" style={{ textDecoration: "none", color: "#FFFFFF", fontSize: "15px", transition: "color 0.3s" }}>Recursos</a>
            <a href="#protocolo" style={{ textDecoration: "none", color: "#FFFFFF", fontSize: "15px", transition: "color 0.3s" }}>Protocolo</a>
          </div>
          <div style={{ fontSize: "14px", color: "#FFFFFF" }}>TFG · Licenciatura en Ciberseguridad · 2026</div>
        </div>
      </footer>
    </main>
  );
}