"use client";

import React, { useEffect, useRef, useState } from 'react';

export default function Home() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [chatState, setChatState] = useState({ visible: false, text: "", isTyping: false });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Estados para la animación secuencial de la sección Storytelling
  const [storyState, setStoryState] = useState(0);
  const storyRef = useRef<HTMLElement>(null);

  const simulationMessages = [
    { name: "Tomás_17", text: "No le cuentes a nadie, es nuestro secreto." },
    { name: "Mili_22", text: "Sos diferente a los demás, me caés re bien." },
    { name: "Alex.mp", text: "Si confiás en mí, mandame una foto." }
  ];

  // 1. Observer para revelar elementos al scrollear
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

  // Observer específico para la sección de Storytelling
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && storyState === 0) {
          setStoryState(1); // Inicia la secuencia
        }
      },
      { threshold: 0.6 } // Se activa cuando el 60% de la sección es visible
    );

    if (storyRef.current) observer.observe(storyRef.current);
    return () => observer.disconnect();
  }, [storyState]);

  // Secuencia de animación de Storytelling
  useEffect(() => {
    if (storyState === 1) {
      const t1 = setTimeout(() => setStoryState(2), 1500); // Pausa antes de "MENSAJE..."
      return () => clearTimeout(t1);
    } else if (storyState === 2) {
      const t2 = setTimeout(() => setStoryState(3), 1800); // Aparecen las burbujas escribiendo
      return () => clearTimeout(t2);
    } else if (storyState === 3) {
      const t3 = setTimeout(() => setStoryState(4), 2500); // Se envían los mensajes
      return () => clearTimeout(t3);
    } else if (storyState === 4) {
      const t4 = setTimeout(() => setStoryState(5), 1500); // Aparece el subtítulo final
      return () => clearTimeout(t4);
    }
  }, [storyState]);

  // 2. Efecto Spotlight (Seguimiento del mouse)
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // 3. Sistema de Red Interactiva y Amenaza Invisible (Canvas)
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
    const particleCount = Math.min(width / 20, 70); // Adaptable a pantalla
    const maxDistance = 150;

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      isThreat: boolean;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.8;
        this.vy = (Math.random() - 0.5) * 0.8;
        // 5% de probabilidad de ser una amenaza (rojo)
        this.isThreat = Math.random() > 0.95;
        this.radius = this.isThreat ? 3 : 1.5;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        // Rebote en bordes
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        // Interacción con mouse (repulsión suave)
        const dx = mousePos.x - this.x;
        const dy = mousePos.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          this.x -= dx * 0.02;
          this.y -= dy * 0.02;
        }
      }

      draw() {
        if(!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.isThreat ? "rgba(255, 60, 80, 0.8)" : "rgba(116, 179, 206, 0.6)";
        // Glow para la amenaza
        if (this.isThreat) {
            ctx.shadowBlur = 15;
            ctx.shadowColor = "rgba(255, 60, 80, 1)";
        } else {
            ctx.shadowBlur = 0;
        }
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();

        // Conexiones
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            ctx.beginPath();
            // Si alguno es amenaza, la línea se tiñe de advertencia sutil
            const isThreatConnection = particles[i].isThreat || particles[j].isThreat;
            const opacity = 1 - dist / maxDistance;
            ctx.strokeStyle = isThreatConnection 
              ? `rgba(255, 60, 80, ${opacity * 0.5})` 
              : `rgba(116, 179, 206, ${opacity * 0.2})`;
            ctx.lineWidth = isThreatConnection ? 1.5 : 1;
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
  }, [mousePos]);

  // 4. Simulador de Chat Flotante Global (Grooming simulado)
  useEffect(() => {
    const sequence = async () => {
      // Retraso inicial para no abrumar al entrar
      await new Promise(r => setTimeout(r, 4000));
      
      setChatState({ visible: true, text: "", isTyping: true });
      await new Promise(r => setTimeout(r, 2000));
      
      setChatState({ visible: true, text: "Hola, ¿cómo estás?", isTyping: false });
      await new Promise(r => setTimeout(r, 3000));
      
      setChatState({ visible: true, text: "", isTyping: true });
      await new Promise(r => setTimeout(r, 2500));
      
      setChatState({ visible: true, text: "¿Cuántos años tenés?", isTyping: false });
      await new Promise(r => setTimeout(r, 4000));
      
      // Desaparece
      setChatState({ visible: false, text: "", isTyping: false });
    };
    
    sequence();
  }, []);

  const worlds = [
    {
      title: "Niños de 10 a 13 años",
      description: "Actividades guiadas para aprender a reconocer señales de riesgo y pedir ayuda a tiempo.",
      href: "/ninos",
    },
    {
      title: "Adolescentes de 14 a 17 años",
      description: "Simulaciones, decisiones y contenidos pensados para redes sociales, mentajería y situaciones reales.",
      href: "/adolescentes",
    },
    {
      title: "Familias",
      description: "Guías claras para acompañar, detectar señales de alerta y actuar mejor frente a una situación concreta.",
      href: "/familias",
    },
    {
      title: "Docentes e instituciones",
      description: "Recursos para trabajar la prevención desde el aula y fortalecer la intervención institucional.",
      href: "/docentes",
    },
  ];

  // NUEVO MODELO ESTRATÉGICO P.O.C. (Ajuste Minimalista)
  const pocPillars = [
    {
      letter: "P",
      title: "PREVENCIÓN",
      text: "Anticiparse al riesgo promoviendo hábitos digitales seguros.",
    },
    {
      letter: "O",
      title: "OBSERVACIÓN",
      text: "Detectar señales tempranas en comportamientos y entornos digitales.",
    },
    {
      letter: "C",
      title: "CONTENCIÓN",
      text: "Acompañar, intervenir y actuar de forma segura ante situaciones de riesgo.",
    }
  ];

  const navItems = [
    { label: "Inicio", href: "/" },
  ];

  // Sistema de colores
  const mainBlue = "#74B3CE";
  const darkBlueAlt = "#5A99B4";
  const lightBlueBg = "rgba(116, 179, 206, 0.12)";
  const alertRed = "#FF3C50";
  const contrastBlue = "#0B2340"; // Nuevo color azul oscuro para máxima visibilidad en la sección Storytelling
  
  // Gradientes
  const brandGradient = `linear-gradient(90deg, #FFFFFF 0%, ${mainBlue} 55%, #FFFFFF 100%)`;

  return (
    <main
      style={{
        fontFamily: "'Altone', sans-serif",
        background: "#051024", // Fondo base más oscuro para que resalte la red
        color: "#FFFFFF", // Unificado a blanco puro
        position: "relative",
      }}
    >
      <style>
        {`
          @import url('https://fonts.cdnfonts.com/css/lemon-milk');
          @import url('https://fonts.cdnfonts.com/css/altone');
          
          html { scroll-behavior: smooth; overflow-x: hidden; }
          
          /* EFECTO SPOTLIGHT GLOBAL */
          .spotlight-overlay {
            position: fixed;
            top: 0; left: 0; width: 100vw; height: 100vh;
            pointer-events: none; z-index: 10;
            background: radial-gradient(circle 600px at var(--x) var(--y), rgba(116, 179, 206, 0.05), transparent 80%);
            transition: background 0.1s ease;
          }

          /* =========================================
             EFECTOS VISUALES & MICROINTERACCIONES
             ========================================= */
          .btn-primary {
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important;
            animation: idle-pulse 3s infinite alternate;
          }
          .btn-primary:hover { 
            background: ${darkBlueAlt} !important; 
            transform: translateY(-4px) scale(1.03) !important; 
            box-shadow: 0 15px 30px rgba(116, 179, 206, 0.5), 0 0 20px rgba(116, 179, 206, 0.6) !important;
            animation: none;
          }
          
          @keyframes idle-pulse {
            0% { box-shadow: 0 0 0 rgba(116, 179, 206, 0); }
            100% { box-shadow: 0 5px 25px rgba(116, 179, 206, 0.25); }
          }
          
          .card-world {
            transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important;
            position: relative;
            z-index: 1;
            overflow: hidden;
            background: linear-gradient(145deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%) !important;
            border: 1px solid rgba(116, 179, 206, 0.15) !important;
            backdrop-filter: blur(10px);
            color: #FFFFFF;
          }
          .card-world::before {
            content: '';
            position: absolute;
            top: -50%; left: -50%; width: 200%; height: 200%;
            background: radial-gradient(circle at center, rgba(116, 179, 206, 0.1), transparent 60%);
            opacity: 0;
            transition: opacity 0.5s, transform 0.5s;
            transform: scale(0.5);
            z-index: -1;
            pointer-events: none;
          }
          .card-world:hover { 
            border-color: ${mainBlue} !important; 
            transform: translateY(-8px); 
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3), 0 0 30px rgba(116, 179, 206, 0.15) !important;
          }

          /* =========================================
             NUEVO MODELO P.O.C. COMO FLUJO SISTÉMICO
             ========================================= */
          .poc-system-wrapper {
            position: relative;
            max-width: 1000px;
            margin: 40px auto 0;
            padding: 20px 0;
          }
          
          .poc-connection-line {
            position: absolute;
            background: rgba(116, 179, 206, 0.15); /* Línea base tenue */
            z-index: 0;
            overflow: hidden;
          }
          
          /* Glow animado que recorre la línea para sensación de proceso */
          .poc-line-glow {
            position: absolute;
            background: linear-gradient(90deg, transparent, ${mainBlue}, transparent);
            animation: scanLine 3.5s infinite linear;
          }

          .poc-nodes-grid {
            display: grid;
            gap: 40px;
            position: relative;
            z-index: 1;
          }

          .poc-node {
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          }

          /* El nodo circular con la letra */
          .poc-letter-circle {
            width: 72px;
            height: 72px;
            border-radius: 50%;
            background: #0B2340; /* Fondo oscuro sólido */
            border: 2px solid ${mainBlue};
            color: #FFFFFF;
            font-family: 'LEMON MILK', sans-serif;
            font-size: 28px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 24px;
            box-shadow: 0 0 15px rgba(116, 179, 206, 0.2);
            transition: all 0.4s ease;
            position: relative;
            z-index: 2;
          }

          /* La tarjeta de contenido colgando del nodo */
          .poc-card-content {
            background: rgba(12, 24, 44, 0.6);
            border: 1px solid rgba(116, 179, 206, 0.15);
            border-radius: 20px;
            padding: 36px 24px 28px;
            width: 100%;
            backdrop-filter: blur(12px);
            transition: all 0.4s ease;
            display: flex;
            flex-direction: column;
            align-items: center;
            position: relative;
          }

          /* Interacciones del nodo */
          .poc-node:hover {
            transform: translateY(-5px);
          }
          .poc-node:hover .poc-letter-circle {
            background: ${mainBlue};
            color: #051024;
            box-shadow: 0 0 30px rgba(116, 179, 206, 0.5);
            transform: scale(1.1);
          }
          .poc-node:hover .poc-card-content {
            border-color: rgba(116, 179, 206, 0.5);
            background: rgba(16, 32, 56, 0.9);
            box-shadow: 0 15px 35px rgba(0,0,0,0.4), 0 0 20px rgba(116, 179, 206, 0.1);
          }

          /* Diseño Responsivo del Flujo */
          @media (min-width: 768px) {
            .poc-nodes-grid {
              grid-template-columns: repeat(3, 1fr);
            }
            .poc-connection-line {
              top: 56px; /* Centrado verticalmente con el círculo de 72px (20px padding + 36px) */
              left: 15%;
              right: 15%;
              height: 2px;
            }
            .poc-line-glow {
              top: 0; left: 0; width: 30%; height: 100%;
            }
            @keyframes scanLine {
              0% { transform: translateX(-100%); }
              100% { transform: translateX(400%); }
            }
          }

          @media (max-width: 767px) {
            .poc-nodes-grid {
              display: flex;
              flex-direction: column;
              gap: 40px;
            }
            .poc-connection-line {
              top: 5%;
              bottom: 5%;
              left: 50%;
              transform: translateX(-50%);
              width: 2px;
            }
            .poc-line-glow {
              top: 0; left: 0; width: 100%; height: 30%;
              background: linear-gradient(180deg, transparent, ${mainBlue}, transparent);
              animation: scanLineVertical 3.5s infinite linear;
            }
            @keyframes scanLineVertical {
              0% { transform: translateY(-100%); }
              100% { transform: translateY(400%); }
            }
          }

          /* ANIMACIONES SCROLL REVEAL */
          .reveal-on-scroll {
            opacity: 0;
            transform: translateY(40px);
            transition: opacity 0.9s cubic-bezier(0.25, 0.8, 0.25, 1), transform 0.9s cubic-bezier(0.25, 0.8, 0.25, 1);
          }
          .reveal-on-scroll.is-visible {
            opacity: 1;
            transform: translateY(0);
          }
          .delay-100 { transition-delay: 100ms; }
          .delay-200 { transition-delay: 200ms; }
          .delay-300 { transition-delay: 300ms; }
          .delay-400 { transition-delay: 400ms; }

          /* ANIMACIONES KEYFRAMES */
          @keyframes float-advanced {
            0%, 100% { transform: translateY(0) rotate(0deg); box-shadow: 0 30px 80px rgba(0, 0, 0, 0.4), inset 0 0 40px rgba(116, 179, 206, 0.05); }
            50% { transform: translateY(-15px) rotate(0.5deg); box-shadow: 0 45px 90px rgba(0, 0, 0, 0.5), inset 0 0 60px rgba(116, 179, 206, 0.08); }
          }
          
          /* BURBUJAS DE FONDO / GLOBS */
          .bg-blob {
            position: absolute;
            border-radius: 50%;
            filter: blur(80px);
            opacity: 0.5;
            animation: float-blob 20s infinite alternate ease-in-out;
            pointer-events: none;
            z-index: 0;
          }
          @keyframes float-blob {
            0% { transform: translate(0, 0) scale(1); }
            33% { transform: translate(30px, -50px) scale(1.1); }
            66% { transform: translate(-20px, 20px) scale(0.9); }
            100% { transform: translate(0, 0) scale(1); }
          }

          /* CHAT ANIMATIONS */
          @keyframes slideInUp {
            from { opacity: 0; transform: translateY(20px) scale(0.95); }
            to { opacity: 1; transform: translateY(0) scale(1); }
          }
          @keyframes fadeOut {
            from { opacity: 1; transform: scale(1); }
            to { opacity: 0; transform: scale(0.95); pointer-events: none; }
          }
          .typing-dot {
            display: inline-block; width: 6px; height: 6px;
            background: currentColor; border-radius: 50%;
            animation: typing 1.4s infinite ease-in-out;
            margin: 0 2px;
          }
          .typing-dot:nth-child(1) { animation-delay: 0s; }
          .typing-dot:nth-child(2) { animation-delay: 0.2s; }
          .typing-dot:nth-child(3) { animation-delay: 0.4s; }
          @keyframes typing {
            0%, 100% { transform: translateY(0); opacity: 0.5; }
            50% { transform: translateY(-4px); opacity: 1; }
          }

          /* EFECTOS TIMELINE */
          .custom-blur { filter: blur(12px); }
          .is-visible.custom-blur { filter: blur(0px); }
          .timeline-step {
            transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          }
          .timeline-step:hover {
            transform: translateX(12px);
          }
        `}
      </style>

      {/* OVERLAY SPOTLIGHT CON MOUSE */}
      <div 
        className="spotlight-overlay" 
        style={{ '--x': `${mousePos.x}px`, '--y': `${mousePos.y}px` } as React.CSSProperties} 
      />

      {/* CANVAS GLOBAL: Red de conexiones y Amenaza invisible */}
      <canvas 
        ref={canvasRef}
        style={{
          position: "fixed",
          top: 0, left: 0, width: "100vw", height: "100vh",
          zIndex: 0, pointerEvents: "none", opacity: 0.8
        }}
      />

      {/* SIMULADOR DE CHAT GLOBAL (Grooming) */}
      <div
        style={{
          position: "fixed",
          bottom: "30px", right: "30px",
          zIndex: 100,
          display: "flex", flexDirection: "column", alignItems: "flex-end",
          gap: "8px", pointerEvents: "none",
          animation: chatState.visible ? "slideInUp 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards" : "fadeOut 0.5s ease forwards",
          opacity: 0,
        }}
      >
        <div style={{
          fontSize: "11px", fontFamily: "'Altone', sans-serif", color: alertRed,
          fontWeight: "bold", textTransform: "uppercase", letterSpacing: "1px",
          textShadow: `0 0 10px ${alertRed}`, marginRight: "10px"
        }}>
          Usuario Desconocido
        </div>
        
        <div style={{
          background: "rgba(15, 25, 45, 0.9)", backdropFilter: "blur(10px)",
          border: `1px solid rgba(255,255,255,0.1)`, borderLeft: `3px solid ${alertRed}`,
          padding: "14px 20px", borderRadius: "18px 18px 4px 18px",
          color: "#FFFFFF", fontFamily: "'Altone', sans-serif", fontSize: "14px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.5), 0 0 15px rgba(255, 60, 80, 0.15)",
          maxWidth: "250px",
        }}>
          {chatState.isTyping ? (
            <div style={{ display: "flex", alignItems: "center", height: "20px" }}>
              <span className="typing-dot" />
              <span className="typing-dot" />
              <span className="typing-dot" />
            </div>
          ) : (
            <span>{chatState.text}</span>
          )}
        </div>
      </div>

      {/* GLOB DE FONDO (Burbujeo) */}
      <div className="bg-blob" style={{ top: '10%', left: '-10%', width: '40vw', height: '40vw', background: lightBlueBg }} />
      <div className="bg-blob" style={{ top: '40%', right: '-15%', width: '50vw', height: '50vw', background: 'rgba(255, 255, 255, 0.03)', animationDelay: '-5s' }} />

      {/* Línea superior decorativa */}
      <div style={{ height: "6px", background: brandGradient, position: "relative", zIndex: 51 }} />

      <header
        style={{
          position: "sticky", top: 0, zIndex: 50,
          background: "rgba(5, 18, 43, 0.7)",
          backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(116, 179, 206, 0.1)",
        }}
      >
        <nav
          style={{
            maxWidth: "1200px", margin: "0 auto", minHeight: "86px", padding: "0 24px",
            display: "flex", alignItems: "center", justifyContent: "space-between", gap: "24px", flexWrap: "wrap",
          }}
        >
          <a
            href="/"
            style={{
              fontFamily: "'LEMON MILK', sans-serif", textDecoration: "none",
              color: "#FFFFFF", fontSize: "24px", fontWeight: "bold", letterSpacing: "1px",
              textShadow: `0 0 15px rgba(255,255,255,0.3)`
            }}
          >
            SAFENET
          </a>

          <div style={{ display: "flex", alignItems: "center", gap: "32px", flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "32px", flexWrap: "wrap" }}>
              {navItems.map((item) => (
                <a
                  key={item.label} href={item.href}
                  style={{
                    fontFamily: "'LEMON MILK', sans-serif", textDecoration: "none", color: "#FFFFFF",
                    fontSize: "12px", letterSpacing: "0.5px", transition: "all 0.3s"
                  }}
                  onMouseOver={(e) => { e.currentTarget.style.color = mainBlue; e.currentTarget.style.textShadow = `0 0 10px ${mainBlue}`; }}
                  onMouseOut={(e) => { e.currentTarget.style.color = "#FFFFFF"; e.currentTarget.style.textShadow = "none"; }}
                >
                  {item.label}
                </a>
              ))}
            </div>

            <a
              href="#mundos"
              className="btn-primary"
              style={{
                fontFamily: "'LEMON MILK', sans-serif", display: "inline-flex", alignItems: "center",
                justifyContent: "center", padding: "18px 32px", borderRadius: "14px", textDecoration: "none",
                background: mainBlue, color: "#FFFFFF", fontSize: "14px", fontWeight: "bold",
                textTransform: "uppercase",
                boxShadow: `0 8px 20px rgba(116, 179, 206, 0.3)`,
              }}
            >
              Explorar espacios
            </a>
          </div>
        </nav>
      </header>

      {/* SECCIÓN HERO */}
      <section style={{ padding: "80px 20px 100px", position: "relative", zIndex: 1 }}>
        <div
          className="reveal-on-scroll"
          style={{
            maxWidth: "1200px", margin: "0 auto",
            background: "rgba(10, 20, 40, 0.4)", border: "1px solid rgba(116, 179, 206, 0.2)",
            borderRadius: "30px", overflow: "hidden", position: "relative",
            backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
            animation: "float-advanced 12s infinite ease-in-out",
          }}
        >
          <div
            style={{
              position: "absolute", top: "-100px", left: "50%", transform: "translateX(-50%)",
              width: "600px", height: "200px", background: `radial-gradient(ellipse, rgba(116, 179, 206, 0.2) 0%, transparent 70%)`,
              filter: "blur(50px)", pointerEvents: "none",
            }}
          />

          <div
            style={{
              padding: "100px 32px", display: "flex", flexDirection: "column",
              alignItems: "center", textAlign: "center", justifyContent: "center", minHeight: "560px",
            }}
          >
            <div
              className="reveal-on-scroll delay-100"
              style={{
                fontFamily: "'Altone', sans-serif", display: "inline-flex", padding: "8px 20px",
                borderRadius: "999px", background: "rgba(116, 179, 206, 0.1)",
                border: `1px solid rgba(116, 179, 206, 0.3)`, color: mainBlue,
                fontSize: "12px", fontWeight: 700, letterSpacing: "1.2px", textTransform: "uppercase",
                marginBottom: "28px", boxShadow: "0 0 20px rgba(116, 179, 206, 0.1)",
              }}
            >
              Más tecnología. Más exposición. Más riesgo.
            </div>

            <h1
              className="reveal-on-scroll delay-200"
              style={{
                fontFamily: "'LEMON MILK', sans-serif", fontSize: "clamp(36px, 4.8vw, 68px)",
                lineHeight: 1.15, color: "#FFFFFF", margin: "0 auto 38px", maxWidth: "1100px",
                textShadow: "0 10px 30px rgba(0,0,0,0.5)",
              }}
            >
              El <span style={{ color: mainBlue }}>grooming</span> evolucionó ¿Estamos preparados?
            </h1>

            <p
              className="reveal-on-scroll delay-300"
              style={{
                fontFamily: "'Altone', sans-serif", letterSpacing: "0.5px", fontSize: "18px",
                lineHeight: 1.84, fontWeight: 300, color: "#FFFFFF",
                maxWidth: "740px", margin: "0 auto 42px",
              }}
            >
              SAFENET es una plataforma inmersiva que simula entornos digitales reales para enseñar a niños, adolescentes, familias y docentes a reconocer, prevenir y actuar frente al grooming, y protegerse en los espacios digitales que forman parte de su vida cotidiana.
            </p>

            <div className="reveal-on-scroll delay-300" style={{ display: "flex", gap: "20px", flexWrap: "wrap", justifyContent: "center" }}>
              <a href="#mundos" className="btn-primary" style={{
                  fontFamily: "'LEMON MILK', sans-serif", padding: "18px 32px", borderRadius: "14px",
                  textDecoration: "none", background: mainBlue, color: "#FFFFFF",
                  fontSize: "14px", fontWeight: "bold", textTransform: "uppercase",
                  boxShadow: `0 8px 20px rgba(116, 179, 206, 0.3)`,
                }}>
                Conocer la plataforma
              </a>
              <a href="#que-es" style={{
                  fontFamily: "'LEMON MILK', sans-serif", padding: "18px 32px", borderRadius: "14px",
                  textDecoration: "none", background: "rgba(255,255,255,0.05)", color: "#FFFFFF",
                  fontSize: "14px", border: "1px solid rgba(255,255,255,0.2)", backdropFilter: "blur(5px)",
                  transition: "all 0.3s ease",
                }}
                onMouseOver={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; e.currentTarget.style.transform = "translateY(-3px)"; }}
                onMouseOut={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.transform = "translateY(0)"; }}
              >
                ¿Qué es el grooming?
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* VIDEO YOUTUBE - IMPACTO */}
      <section
        id="video-impacto"
        className="reveal-on-scroll"
        style={{
          padding: "90px 20px 100px",
          position: "relative",
          zIndex: 1,
          background: "linear-gradient(180deg, #051024 0%, #071A34 50%, #051024 100%)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "10%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "720px",
            height: "420px",
            background: "rgba(116, 179, 206, 0.12)",
            filter: "blur(80px)",
            borderRadius: "50%",
            pointerEvents: "none",
          }}
        />

        <div style={{ maxWidth: "980px", margin: "0 auto", position: "relative", zIndex: 2 }}>
          <div style={{ textAlign: "center", marginBottom: "34px" }}>
            <span
              style={{
                fontFamily: "'LEMON MILK', sans-serif",
                display: "inline-flex",
                padding: "8px 18px",
                borderRadius: "999px",
                background: "rgba(116, 179, 206, 0.12)",
                border: `1px solid rgba(116, 179, 206, 0.35)`,
                color: mainBlue,
                fontSize: "11px",
                letterSpacing: "1.2px",
                textTransform: "uppercase",
                marginBottom: "18px",
              }}
            >
              Mirá el mensaje
            </span>

            <h2
              style={{
                fontFamily: "'LEMON MILK', sans-serif",
                fontSize: "clamp(26px, 3vw, 42px)",
                lineHeight: 1.2,
                color: "#FFFFFF",
                margin: "0 0 14px",
              }}
            > 
              No es ficción, pasa todos los días.
            </h2>

            <p
              style={{
                fontFamily: "'Altone', sans-serif",
                fontSize: "17px",
                lineHeight: 1.75,
                color: "rgba(255,255,255,0.82)",
                maxWidth: "680px",
                margin: "0 auto",
              }}
            >
              Un video breve para introducir la problemática:
            </p>
          </div>

          <div
            style={{
              position: "relative",
              width: "100%",
              paddingTop: "56.25%",
              borderRadius: "24px",
              overflow: "hidden",
              border: "1px solid rgba(116, 179, 206, 0.28)",
              boxShadow: "0 30px 80px rgba(0,0,0,0.45), 0 0 40px rgba(116, 179, 206, 0.18)",
              background: "rgba(255,255,255,0.04)",
            }}
          >
            <iframe
              src="https://www.youtube.com/embed/LxfcvzgKmUs"
              title="Video sobre grooming"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                border: "0",
              }}
            />
          </div>
        </div>
      </section>


      {/* SECCIÓN TRANSICIÓN STORYTELLING (ACTUALIZADA: ACENTO AZUL OSCURO PARA MÁXIMA VISIBILIDAD) */}
      <section 
        ref={storyRef} 
        style={{ 
          padding: "100px 20px", 
          textAlign: "center", 
          position: "relative", 
          zIndex: 1, 
          background: mainBlue, // Fondo azul sólido según la imagen
          minHeight: "500px", 
          display: "flex", 
          flexDirection: "column", 
          justifyContent: "center",
          transition: "background 1s ease"
        }}
      >
        <div style={{ maxWidth: "1100px", margin: "0 auto", width: "100%" }}>
            <h2 style={{
                fontFamily: "'LEMON MILK', sans-serif", 
                fontSize: "clamp(24px, 3.5vw, 42px)",
                color: "#FFFFFF", 
                margin: "0 0 30px",
                letterSpacing: "1px"
            }}>
                <span style={{
                    opacity: storyState >= 1 ? 1 : 0,
                    transform: storyState >= 1 ? "translateY(0)" : "translateY(15px)",
                    transition: "all 1s ease",
                    display: "inline-block"
                }}>
                    "TODO EMPIEZA CON UN SIMPLE
                </span>
                <br />
                <span style={{
                    opacity: storyState >= 2 ? 1 : 0,
                    color: contrastBlue, // Acento azul oscuro (reemplazando al rosa para mayor visibilidad)
                    transform: storyState >= 2 ? "scale(1)" : "scale(0.95)",
                    transition: "all 1s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                    display: "inline-block",
                    marginTop: "10px",
                    textShadow: "0 1px 15px rgba(255,255,255,0.2)"
                }}>
                    MENSAJE..."
                </span>
            </h2>

            <div style={{
                display: "flex", flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: "24px",
                margin: "50px auto 40px", maxWidth: "100%",
                opacity: storyState >= 3 ? 1 : 0,
                transform: storyState >= 3 ? "translateY(0)" : "translateY(20px)",
                transition: "all 0.8s ease"
            }}>
                {simulationMessages.map((msg, index) => (
                  <div key={index} style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", flex: "1 1 300px", maxWidth: "340px" }}>
                      <div style={{
                          fontSize: "11px", fontFamily: "'LEMON MILK', sans-serif", 
                          color: contrastBlue, // Nombres en azul oscuro para que resalten más
                          fontWeight: "bold", textTransform: "uppercase", letterSpacing: "1px",
                          marginBottom: "8px", paddingLeft: "10px",
                          textShadow: "0 1px 2px rgba(255,255,255,0.1)"
                      }}>
                          {msg.name}
                      </div>
                      
                      <div style={{
                          background: "rgba(255, 255, 255, 0.15)", // Burbuja clara translúcida según la imagen
                          backdropFilter: "blur(10px)",
                          borderLeft: `3px solid ${contrastBlue}`, // Borde lateral en azul oscuro
                          padding: "20px", borderRadius: "4px 20px 20px 20px",
                          color: "#FFFFFF", fontFamily: "'Altone', sans-serif", fontSize: "15px",
                          width: "100%", textAlign: "left", minHeight: "80px", display: "flex", alignItems: "center",
                          boxShadow: "0 10px 30px rgba(0,0,0,0.1)"
                      }}>
                          {storyState === 3 ? (
                              <div style={{ display: "flex", alignItems: "center", height: "24px" }}>
                                  <span className="typing-dot" />
                                  <span className="typing-dot" />
                                  <span className="typing-dot" />
                              </div>
                          ) : (
                              <span style={{ 
                                  opacity: storyState >= 4 ? 1 : 0, 
                                  transition: "opacity 0.4s ease" 
                              }}>
                                  {msg.text}
                              </span>
                          )}
                      </div>
                  </div>
                ))}
            </div>

            <div style={{
                fontFamily: "'Altone', sans-serif", display: "inline-block", padding: "10px 24px",
                borderRadius: "999px", background: "rgba(255, 255, 255, 0.2)",
                border: `1px solid rgba(255, 255, 255, 0.4)`, color: "#FFFFFF",
                fontSize: "13px", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase",
                marginTop: "30px",
                opacity: storyState >= 5 ? 1 : 0,
                transform: storyState >= 5 ? "translateY(0)" : "translateY(15px)",
                transition: "all 1s ease"
            }}>
                La confianza digital también puede ser manipulada.
            </div>
        </div>
      </section>

      {/* SECCIÓN: QUÉ ES EL GROOMING */}
      <section id="que-es" style={{ padding: "100px 20px", position: "relative", zIndex: 1 }}>
        <div style={{
            maxWidth: "1200px", margin: "0 auto", display: "flex", flexWrap: "wrap",
            gap: "70px", alignItems: "center"
          }}
        >
          <div style={{ flex: "0.8 1 350px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div>
              <div className="reveal-on-scroll custom-blur delay-100" style={{
                  fontFamily: "'LEMON MILK', sans-serif", display: "inline-flex", padding: "18px 32px",
                  borderRadius: "14px", background: mainBlue, color: "#FFFFFF", fontSize: "14px",
                  fontWeight: "bold", textTransform: "uppercase", marginBottom: "20px",
                  boxShadow: `0 8px 20px rgba(116, 179, 206, 0.3)`,
                }}
              >
                Entendiendo la amenaza
              </div>
              <h2 className="reveal-on-scroll custom-blur delay-200" style={{
                  fontFamily: "'LEMON MILK', sans-serif", fontSize: "clamp(30px, 3.8vw, 48px)", lineHeight: 1.25,
                  color: "#FFFFFF", margin: 0, maxWidth: "480px", letterSpacing: "0.5px",
                  textShadow: "0 10px 30px rgba(0,0,0,0.4)"
                }}
              >
                Cómo actúa el grooming
              </h2>
              <p className="reveal-on-scroll custom-blur delay-300" style={{
                  fontFamily: "'Altone', sans-serif", fontSize: "18px", lineHeight: 1.6,
                  color: "#FFFFFF", margin: "20px 0 0", maxWidth: "460px"
                }}
              >
                Ocurre en los espacios digitales que usás todos los días: Instagram, TikTok, Roblox y chats online.
              </p>
            </div>
          </div>

          <div className="reveal-on-scroll custom-blur delay-400" style={{
              flex: "1.2 1 450px", display: "flex", flexDirection: "column", position: "relative"
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", position: "relative", padding: "20px 0" }}>
              <div style={{ 
                  position: "absolute", left: "23px", top: "24px", bottom: "40px", width: "2px", 
                  background: `linear-gradient(to bottom, rgba(116, 179, 206, 0.3) 0%, rgba(116, 179, 206, 0.3) 60%, rgba(255, 60, 80, 0.6) 100%)`,
                  zIndex: 0 
              }} />

              {[
                { title: "CONTACTO", desc: "Inicia con un mensaje aparentemente inofensivo." },
                { title: "CONFIANZA", desc: "Busca generar cercanía y conexión emocional." },
                { title: "AISLAMIENTO", desc: "Intenta que la conversación sea privada o secreta." },
                { title: "PEDIDO", desc: "Solicita fotos, información o contenido íntimo." },
                { title: "PRESIÓN", desc: "Aparecen amenazas, manipulación o chantaje." }
              ].map((step, i, arr) => {
                const isLast = i === arr.length - 1;
                const stepColor = isLast ? alertRed : mainBlue;
                const glowColor = isLast ? "rgba(255, 60, 80, 0.4)" : "rgba(116, 179, 206, 0.4)";

                return (
                  <div key={i} className="timeline-step" style={{ 
                      display: "flex", gap: "28px", position: "relative", zIndex: 1, 
                      paddingBottom: isLast ? "0" : "36px" 
                  }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "48px", flexShrink: 0 }}>
                      <div style={{
                          width: "48px", height: "48px", borderRadius: "50%",
                          background: "rgba(5, 16, 36, 0.95)", border: `2px solid ${stepColor}`,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontFamily: "'LEMON MILK', sans-serif", fontSize: "16px", color: "#FFFFFF",
                          boxShadow: `0 0 15px ${glowColor}`, zIndex: 2
                      }}>
                        0{i + 1}
                      </div>
                    </div>

                    <div style={{ paddingTop: "12px", paddingBottom: "10px" }}>
                      <div style={{ 
                        fontSize: "20px", fontFamily: "'LEMON MILK', sans-serif", color: "#FFFFFF", 
                        marginBottom: "8px", letterSpacing: "0.5px", display: "flex", alignItems: "center", gap: "10px"
                      }}>
                        {step.title}
                        {isLast && <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: alertRed, display: "inline-block", boxShadow: `0 0 8px ${alertRed}` }} />}
                      </div>
                      <div style={{ 
                        fontSize: "17px", lineHeight: 1.6, color: "#FFFFFF", 
                        fontFamily: "'Altone', sans-serif" 
                      }}>
                        {step.desc}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN: ENFOQUE DE LA PLATAFORMA (MODELO P.O.C SISTÉMICO) */}
      <section style={{ padding: "80px 20px 120px", position: "relative", zIndex: 1 }}>
        <div className="reveal-on-scroll" style={{ maxWidth: "1200px", margin: "0 auto" }}>
          
          {/* Header de la sección */}
          <div style={{ textAlign: "center", marginBottom: "70px" }}>
            <div style={{
              fontFamily: "'Altone', sans-serif", fontSize: "13px", fontWeight: 800, letterSpacing: "1.4px",
              textTransform: "uppercase", color: mainBlue, marginBottom: "16px"
            }}>
              Modelo Estratégico
            </div>
            <h2 style={{ fontFamily: "'LEMON MILK', sans-serif", fontSize: "clamp(28px, 4vw, 42px)", color: "#FFFFFF", margin: "0 0 16px" }}>
              Enfoque de la plataforma
            </h2>
            <p style={{ fontFamily: "'Altone', sans-serif", fontSize: "18px", color: "#FFFFFF", maxWidth: "700px", margin: "0 auto", lineHeight: 1.6 }}>
              Un modelo integral para prevenir, detectar y actuar frente al grooming digital.
            </p>
          </div>

          <div className="poc-system-wrapper">
            {/* Línea conectora y su animación */}
            <div className="poc-connection-line">
              <div className="poc-line-glow"></div>
            </div>

            <div className="poc-nodes-grid">
              {pocPillars.map((pillar, idx) => (
                <div key={idx} className={`poc-node delay-${(idx + 1) * 100}`}>
                  
                  {/* Círculo central con la letra (Nodo funcional) */}
                  <div className="poc-letter-circle">
                    {pillar.letter}
                  </div>
                  
                  {/* Tarjeta de contenido debajo del nodo */}
                  <div className="poc-card-content">
                    <h3 style={{ fontFamily: "'LEMON MILK', sans-serif", fontSize: "20px", color: "#FFFFFF", marginBottom: "12px", letterSpacing: "0.5px" }}>
                      {pillar.title}
                    </h3>
                    <p style={{ fontFamily: "'Altone', sans-serif", fontSize: "15px", lineHeight: 1.6, color: "#FFFFFF", margin: 0 }}>
                      {pillar.text}
                    </p>
                  </div>

                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN: RECORRIDOS ESPECÍFICOS (ACTUALIZADA SEGÚN IMAGEN) */}
      <section 
        id="mundos" 
        style={{ 
          padding: "100px 20px", 
          position: "relative", 
          zIndex: 1, 
          background: mainBlue, // Fondo azul sólido para coherencia visual
          transition: "background 1s ease"
        }}
      >
        <div className="reveal-on-scroll" style={{ maxWidth: "1200px", margin: "0 auto" }}>
          {/* Header centrado según imagen */}
          <div style={{ textAlign: "center", marginBottom: "56px", maxWidth: "1000px", margin: "0 auto 56px" }}>
            <h2 style={{ 
                fontFamily: "'LEMON MILK', sans-serif", 
                fontSize: "clamp(32px, 4vw, 52px)", 
                color: "#FFFFFF", 
                margin: "0 0 20px",
                letterSpacing: "1px"
            }}>
              Un recorrido específico para cada usuario
            </h2>
            <p style={{ 
                fontSize: "18px", 
                lineHeight: 1.7, 
                color: "#FFFFFF", 
                margin: "0 auto", 
                maxWidth: "780px",
                opacity: 0.95
            }}>
              La plataforma organiza sus contenidos según la edad y el rol de
              cada persona para que la prevención sea más clara y efectiva. Entra al entorno que te corresponda.
            </p>
          </div>

          <div style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(auto-fit, minmax(420px, 1fr))", 
              gap: "32px" 
          }}>
            {worlds.map((world, idx) => (
              <article 
                key={world.title} 
                className={`reveal-on-scroll delay-${(idx % 2 + 1) * 100}`} 
                style={{ 
                  padding: "40px", 
                  borderRadius: "24px",
                  background: "rgba(255, 255, 255, 0.12)", // Efecto cristal claro
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  transition: "all 0.3s ease"
                }}
              >
                <h3 style={{ 
                    fontFamily: "'LEMON MILK', sans-serif", 
                    fontSize: "22px", 
                    margin: "0 0 16px", 
                    color: "#FFFFFF",
                    letterSpacing: "0.5px"
                }}>
                  {world.title}
                </h3>
                <p style={{ 
                    fontSize: "16px", 
                    lineHeight: 1.8, 
                    margin: "0 0 32px", 
                    color: "#FFFFFF",
                    opacity: 0.9
                }}>
                  {world.description}
                </p>
                <a 
                  href={world.href} 
                  style={{
                    fontFamily: "'LEMON MILK', sans-serif", 
                    display: "inline-flex", 
                    padding: "16px 32px", 
                    borderRadius: "12px",
                    textDecoration: "none", 
                    background: "#FFFFFF", // Botón blanco
                    color: mainBlue, // Texto azul
                    fontSize: "13px", 
                    fontWeight: "bold",
                    textTransform: "uppercase",
                    boxShadow: `0 10px 25px rgba(0, 0, 0, 0.1)`,
                    transition: "all 0.3s ease"
                  }}
                  onMouseOver={(e) => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 15px 30px rgba(0, 0, 0, 0.15)"; }}
                  onMouseOut={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 10px 25px rgba(0, 0, 0, 0.1)"; }}
                >
                  Explorar espacio
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* SECCIÓN: AYUDA Y ORIENTACIÓN */}
      <section style={{ padding: "100px 20px", position: "relative", zIndex: 1 }}>
        <div className="reveal-on-scroll" style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{
              background: "rgba(10, 20, 45, 0.8)", borderRadius: "32px", padding: "60px",
              display: "flex", alignItems: "center", justifyContent: "space-between", gap: "30px", flexWrap: "wrap",
              boxShadow: "0 30px 60px rgba(0, 0, 0, 0.5), inset 0 0 0 1px rgba(255, 60, 80, 0.3)", // Glow rojo de emergencia
              position: "relative", overflow: "hidden", backdropFilter: "blur(20px)"
            }}
          >
            <div style={{
              position: "absolute", bottom: "-50px", right: "10%", width: "400px", height: "400px",
              background: `radial-gradient(circle, rgba(255, 60, 80, 0.15) 0%, transparent 70%)`, filter: "blur(40px)", pointerEvents: "none"
            }} />

            <div style={{ maxWidth: "760px", position: "relative", zIndex: 1 }}>
              <div style={{
                  fontFamily: "'Altone', sans-serif", fontSize: "13px", fontWeight: 800, letterSpacing: "1.4px",
                  textTransform: "uppercase", color: alertRed, marginBottom: "16px", textShadow: `0 0 10px rgba(255, 60, 80, 0.3)`
                }}
              >
                Atención y Denuncia
              </div>
              <h2 style={{ fontFamily: "'LEMON MILK', sans-serif", fontSize: "clamp(28px, 3.5vw, 42px)", color: "#FFFFFF", margin: "0 0 16px" }}>
                ¿Sospechás de una situación de grooming?
              </h2>
              <p style={{ fontSize: "18px", color: "#FFFFFF", margin: 0, lineHeight: 1.6 }}>
                El grooming es un delito. Si detectás una situación sospechosa o necesitás ayuda, podés comunicarte de forma gratuita y confidencial.
              </p>

              {/* Nuevos Contactos Organizados */}
              <div style={{ marginTop: "32px", display: "flex", flexDirection: "column", gap: "24px", fontFamily: "'Altone', sans-serif" }}>
                <div>
                  <div style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "1.2px", color: alertRed, fontWeight: "bold", marginBottom: "6px" }}>Línea Nacional</div>
                  <div style={{ fontSize: "24px", fontWeight: "bold", color: "#FFFFFF" }}>137</div>
                </div>

                <div>
                  <div style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "1.2px", color: mainBlue, fontWeight: "bold", marginBottom: "6px" }}>Grooming Argentina</div>
                  <div style={{ fontSize: "18px", color: "#FFFFFF", fontWeight: 500, marginBottom: "4px" }}>+54 9 11 2481 1722</div>
                  <div style={{ fontSize: "16px", color: "#FFFFFF" }}>contacto@groomingarg.org</div>
                </div>
              </div>
            </div>

            <a href="tel:137" className="btn-primary" style={{
                fontFamily: "'LEMON MILK', sans-serif", display: "inline-flex", padding: "20px 40px", borderRadius: "16px",
                background: alertRed, color: "#FFFFFF", textDecoration: "none", fontSize: "16px", fontWeight: "bold",
                boxShadow: `0 15px 30px rgba(255, 60, 80, 0.3), 0 0 20px rgba(255, 60, 80, 0.4)`, position: "relative", zIndex: 1,
                border: "1px solid rgba(255,255,255,0.2)"
              }}
              onMouseOver={(e) => { e.currentTarget.style.background = "#E62E40"; e.currentTarget.style.transform = "scale(1.05)"; }}
              onMouseOut={(e) => { e.currentTarget.style.background = alertRed; e.currentTarget.style.transform = "scale(1)"; }}
            >
              Llamar al 137
            </a>
          </div>
        </div>
      </section>

      <footer style={{ background: "rgba(5, 12, 25, 0.9)", borderTop: "1px solid rgba(116, 179, 206, 0.1)", padding: "40px 20px", position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "20px", flexWrap: "wrap" }}>
          <div style={{ fontFamily: "'LEMON MILK', sans-serif", fontSize: "22px", fontWeight: "bold", color: "#FFFFFF", letterSpacing: "1.5px" }}>
            SAFENET
          </div>
          <div style={{ display: "flex", gap: "26px", flexWrap: "wrap" }}>
            {navItems.map((item) => (
              <a key={item.label} href={item.href} style={{ fontFamily: "'Altone', sans-serif", textDecoration: "none", fontSize: "15px", color: "#FFFFFF", transition: "color 0.3s" }}
                onMouseOver={(e) => e.currentTarget.style.color = mainBlue}
                onMouseOut={(e) => e.currentTarget.style.color = "#FFFFFF"}
              >
                {item.label}
              </a>
            ))}
          </div>
          <div style={{ fontFamily: "'Altone', sans-serif", fontSize: "14px", color: "#FFFFFF" }}>
            TFG · Licenciatura en Ciberseguridad · 2026
          </div>
        </div>
      </footer>
    </main>
  );
}