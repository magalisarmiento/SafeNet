"use client";

import React, { useEffect, useRef, useState } from 'react';

export default function FamiliasPage() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const alerts = [
    {
      title: "Cambios de conducta",
      description: "Irritabilidad, aislamiento o ansiedad excesiva después de usar dispositivos electrónicos. Es vital observar si el ánimo cambia drásticamente al desconectarse.",
    },
    {
      title: "Secretismo digital",
      description: "Ocultar la pantalla al acercarse un adulto, cambiar de pestaña rápidamente o borrar historiales y mensajes de forma compulsiva sin razón aparente.",
    },
    {
      title: "Vínculos sospechosos",
      description: "Mención de nuevos 'amigos' online que parecen tener mucha influencia, piden confidencialidad o envían regalos/beneficios digitales constantes.",
    },
    {
      title: "Uso nocturno excesivo",
      description: "Permanecer conectado hasta altas horas de la madrugada de forma oculta, lo que suele ser un espacio propenso para interacciones sin supervisión.",
    },
  ];

  const steps = [
    {
      title: "Escucha activa y calma",
      text: "Crear un clima de confianza donde puedan contar lo que les pasa sin miedo a ser retados o a que les quiten el acceso a la tecnología.",
    },
    {
      title: "Validar y no juzgar",
      text: "Entender que ellos son las víctimas de una manipulación profesional. Evitar culparlos por las fotos enviadas o las conversaciones mantenidas.",
    },
    {
      title: "Preservar evidencia",
      text: "Ante una sospecha firme, guardar capturas de pantalla de perfiles y mensajes antes de bloquear al acosador para facilitar una denuncia legal.",
    },
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
    <main style={{ background: "#051024", color: "#FFFFFF", fontFamily: "'Altone', sans-serif", minHeight: "100vh", position: "relative", overflowX: "hidden" }}>
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
      <section style={{ padding: "80px 20px", position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", background: "rgba(10, 20, 40, 0.4)", border: "1px solid rgba(116, 179, 206, 0.2)", borderRadius: "30px", backdropFilter: "blur(12px)", padding: "100px 32px", textAlign: "center" }}>
          <div style={{ fontFamily: "'Altone', sans-serif", display: "inline-flex", padding: "8px 20px", borderRadius: "999px", background: "rgba(116, 179, 206, 0.1)", border: `1px solid rgba(116, 179, 206, 0.3)`, color: mainBlue, fontSize: "12px", fontWeight: 700, letterSpacing: "1.2px", textTransform: "uppercase", marginBottom: "28px" }}>
            Orientación para Familias
          </div>
          <h1 style={{ fontFamily: "'LEMON MILK', sans-serif", fontSize: "clamp(36px, 4.5vw, 64px)", lineHeight: 1.15, color: "#FFFFFF", margin: "0 auto 32px", maxWidth: "1000px" }}>
            ACOMPAÑAR ES EL PRIMER PASO PARA <span style={{ color: mainBlue }}>PROTEGER</span>
          </h1>
          <p style={{ fontSize: "18px", lineHeight: 1.8, color: "#FFFFFF", maxWidth: "760px", margin: "0 auto 42px" }}>
            APRENDÉ A DETECTAR SEÑALES DE ALERTA, ESTABLECER DIÁLOGOS SEGUROS Y 
            ACTUAR CON RESPONSABILIDAD FRENTE AL GROOMING DESDE EL HOGAR.
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

      {/* CONTEXT SECTION */}
      <section style={{ padding: "60px 20px", position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "grid", gridTemplateColumns: "0.8fr 1.2fr", gap: "60px", alignItems: "center" }}>
          <div style={{ borderLeft: "2px solid #FFFFFF", paddingLeft: "24px" }}>
            <div style={{ fontSize: "11px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "1.2px", marginBottom: "8px", color: mainBlue }}>01. El rol de la familia</div>
            <h2 style={{ fontFamily: "'LEMON MILK', sans-serif", fontSize: "36px", color: "#FFFFFF", margin: 0 }}>Un entorno de confianza digital</h2>
          </div>
          <div style={{ padding: "32px", borderRadius: "24px", background: "rgba(116, 179, 206, 0.05)", border: "1px solid rgba(116, 179, 206, 0.2)" }}>
            <p style={{ fontSize: "17px", lineHeight: 1.8, color: "#FFFFFF", margin: 0 }}>
              NUESTRA PRESENCIA ADULTA NO DEBE SER DE VIGILANCIA, SINO DE 
              <span className="highlight-white-glow" style={{ fontWeight: 600 }}> ACOMPAÑAMIENTO ACTIVO </span>. 
              EL OBJETIVO ES QUE LOS NIÑOS Y ADOLESCENTES SIENTAN QUE EL HOGAR ES UN LUGAR 
              SEGURO PARA HABLAR SOBRE LO QUE LES SUCEDE EN INTERNET SIN TEMOR A REPRESALIAS.
            </p>
          </div>
        </div>
      </section>

      {/* ALERTS SECTION */}
      <section id="alertas" style={{ padding: "100px 20px", position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ marginBottom: "48px" }}>
            <div style={{ fontFamily: "'LEMON MILK', sans-serif", display: "inline-flex", padding: "18px 32px", borderRadius: "14px", background: mainBlue, color: "#FFFFFF", fontSize: "14px", fontWeight: "bold", textTransform: "uppercase", marginBottom: "20px", boxShadow: `0 8px 20px rgba(116, 179, 206, 0.3)` }}>Detectar señales de alerta</div>
            <h2 style={{ fontFamily: "'LEMON MILK', sans-serif", fontSize: "42px", color: "#FFFFFF" }}>Comportamientos sospechosos</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "24px" }}>
            {alerts.map(item => (
              <article key={item.title} className="card-glass" style={{ padding: "32px", borderRadius: "24px", minHeight: "260px" }}>
                <h3 style={{ fontFamily: "'LEMON MILK', sans-serif", fontSize: "20px", color: "#FFFFFF", marginBottom: "16px" }}>{item.title}</h3>
                <p style={{ fontSize: "16px", lineHeight: 1.7, color: "#FFFFFF", margin: 0 }}>{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* STEPS SECTION */}
      <section id="pasos" style={{ padding: "80px 20px", position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "60px" }}>
            <h2 style={{ fontFamily: "'LEMON MILK', sans-serif", fontSize: "36px", color: "#FFFFFF" }}>Cómo actuar ante el riesgo</h2>
            <p style={{ color: "#FFFFFF", marginTop: "10px" }}>Protocolos de comunicación y seguridad para padres y cuidadores.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
            {steps.map((step, idx) => (
              <div key={step.title} style={{ padding: "32px", borderRadius: "24px", background: "rgba(20, 30, 50, 0.5)", border: "1px solid rgba(255, 255, 255, 0.1)" }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: mainBlue, color: "#051024", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'LEMON MILK', sans-serif", fontSize: "18px", marginBottom: "20px", fontWeight: "bold" }}>{idx + 1}</div>
                <h3 className="highlight-white-glow" style={{ fontFamily: "'LEMON MILK', sans-serif", fontSize: "18px", marginBottom: "12px" }}>{step.title}</h3>
                <p style={{ fontSize: "15px", lineHeight: 1.6, color: "#FFFFFF" }}>{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HELP SECTION */}
      <section id="ayuda" style={{ padding: "100px 20px", position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ background: "rgba(10, 20, 45, 0.8)", borderRadius: "32px", padding: "60px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "30px", flexWrap: "wrap", border: "1px solid rgba(255, 60, 80, 0.3)", position: "relative", overflow: "hidden", backdropFilter: "blur(20px)" }}>
            <div style={{ position: "absolute", bottom: "-50px", right: "10%", width: "400px", height: "400px", background: `radial-gradient(circle, rgba(255, 60, 80, 0.1) 0%, transparent 70%)`, filter: "blur(40px)", pointerEvents: "none" }} />
            
            <div style={{ maxWidth: "760px", position: "relative", zIndex: 1 }}>
              <div style={{ fontFamily: "'Altone', sans-serif", fontSize: "13px", fontWeight: 800, letterSpacing: "1.4px", textTransform: "uppercase", color: alertRed, marginBottom: "16px" }}>Denuncia y Ayuda Profesional</div>
              <h2 style={{ fontFamily: "'LEMON MILK', sans-serif", fontSize: "clamp(28px, 3.5vw, 42px)", color: "#FFFFFF", margin: "0 0 16px" }}>¿Necesitás denunciar un caso?</h2>
              <p style={{ fontSize: "18px", color: "#FFFFFF", margin: 0 }}>Si detectaste una situación concreta, comunicate con la Línea 137. Es gratuita, confidencial y está disponible las 24 horas en todo el país.</p>
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