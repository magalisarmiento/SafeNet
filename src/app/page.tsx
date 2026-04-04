"use client";

import React, { useEffect, useRef, useState } from 'react';

export default function Home() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [chatState, setChatState] = useState({ visible: false, text: "", isTyping: false });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Estados para la animación secuencial de la sección Storytelling
  const [storyState, setStoryState] = useState(0);
  const storyRef = useRef<HTMLElement>(null);

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
      const t2 = setTimeout(() => setStoryState(3), 1800); // Aparece la burbuja escribiendo
      return () => clearTimeout(t2);
    } else if (storyState === 3) {
      const t3 = setTimeout(() => setStoryState(4), 2500); // Se envía el mensaje
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
      description: "Simulaciones, decisiones y contenidos pensados para redes sociales, mensajería y situaciones reales.",
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

  const pillars = [
    { title: "Prevención", text: "Promover hábitos digitales seguros antes de que aparezca una situación de riesgo." },
    { title: "Concientización", text: "Brindar información clara para reconocer señales, entender el problema y actuar a tiempo." },
    { title: "Orientación", text: "Ofrecer recursos concretos para acompañar, intervenir y buscar ayuda cuando sea necesario." },
  ];

  const navItems = [
    { label: "Inicio", href: "/" },
  ];

  // Sistema de colores
  const mainBlue = "#74B3CE";
  const darkBlueAlt = "#5A99B4";
  const lightBlueBg = "rgba(116, 179, 206, 0.12)";
  const alertRed = "#FF3C50";
  
  // Gradientes
  const whiteGlowText = { color: "#FFFFFF", textShadow: "0 0 6px rgba(255,255,255,0.4)" };
  const brandGradient = `linear-gradient(90deg, #FFFFFF 0%, ${mainBlue} 55%, #FFFFFF 100%)`;
  const blueGradient = `linear-gradient(90deg, ${mainBlue} 0%, #A5D2E5 100%)`;

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
            animation: none; /* Detiene el idle pulse al interactuar */
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
            color: white; /* Adaptado al modo oscuro para mejor contraste con la red */
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
          .card-world:hover::before {
            opacity: 1;
            transform: scale(1);
          }
          .card-world h3 { color: white !important; }
          .card-world p { color: #FFFFFF !important; }

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
            background: rgba(255,255,255,0.7); border-radius: 50%;
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

          /* EFECTOS SECCIÓN GROOMING */
          .custom-blur {
            filter: blur(12px);
          }
          .is-visible.custom-blur {
            filter: blur(0px);
          }
          .highlight-white-glow {
            color: #FFFFFF;
            text-shadow: 0 0 6px rgba(255,255,255,0.4);
            font-weight: 600;
            transition: all 0.3s ease;
            position: relative;
            cursor: default;
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
          opacity: 0, // start hidden
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
          color: "white", fontFamily: "'Altone', sans-serif", fontSize: "14px",
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
            animation: "float-advanced 12s infinite ease-in-out", // Animación principal de flotación
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
              La concientización es el pilar
            </div>

            <h1
              className="reveal-on-scroll delay-200"
              style={{
                fontFamily: "'LEMON MILK', sans-serif", fontSize: "clamp(36px, 4.8vw, 68px)",
                lineHeight: 1.15, color: "#FFFFFF", margin: "0 auto 38px", maxWidth: "1100px",
                textShadow: "0 10px 30px rgba(0,0,0,0.5)",
              }}
            >
              Las nuevas tecnologías amplifican el <span style={{ color: mainBlue, position: "relative", display: "inline-block" }}>
                grooming
                <span style={{ position: "absolute", bottom: -5, left: 0, width: "100%", height: "4px", background: brandGradient, borderRadius: "2px" }} />
              </span>
            </h1>

            <p
              className="reveal-on-scroll delay-300"
              style={{
                fontFamily: "'Altone', sans-serif", letterSpacing: "0.5px", fontSize: "18px",
                lineHeight: 1.84, fontWeight: 300, color: "#FFFFFF",
                maxWidth: "740px", margin: "0 auto 42px",
              }}
            >
              UNA PLATAFORMA INMERSIVA CON RECORRIDOS ADAPTADOS PARA NIÑOS, ADOLESCENTES,
              FAMILIAS Y DOCENTES, PENSADA PARA INFORMAR, PREVENIR Y ACOMPAÑAR
              FRENTE A LAS AMENAZAS OCULTAS ONLINE.
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

      {/* SECCIÓN TRANSICIÓN STORYTELLING CON ANIMACIÓN SECUENCIAL */}
      <section ref={storyRef} style={{ padding: "80px 20px", textAlign: "center", position: "relative", zIndex: 1, minHeight: "400px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", width: "100%" }}>
            
            {/* Título progresivo */}
            <h2 style={{
                fontFamily: "'LEMON MILK', sans-serif", fontSize: "clamp(24px, 3vw, 36px)",
                color: "rgba(255,255,255,0.9)", margin: "0 0 20px"
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
                    color: storyState >= 2 ? alertRed : "transparent",
                    textShadow: storyState >= 2 ? `0 0 25px rgba(255, 60, 80, 0.4)` : "none",
                    transform: storyState >= 2 ? "scale(1)" : "scale(0.95)",
                    transition: "all 1s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                    display: "inline-block",
                    marginTop: "10px"
                }}>
                    MENSAJE..."
                </span>
            </h2>

            {/* Chat Simulado de Transición */}
            <div style={{
                display: "flex", flexDirection: "column", alignItems: "center",
                margin: "40px auto 30px", maxWidth: "320px",
                opacity: storyState >= 3 ? 1 : 0,
                transform: storyState >= 3 ? "translateY(0)" : "translateY(20px)",
                transition: "all 0.8s cubic-bezier(0.25, 0.8, 0.25, 1)",
                filter: storyState >= 3 ? "blur(0)" : "blur(10px)"
            }}>
                <div style={{
                    fontSize: "12px", fontFamily: "'Altone', sans-serif", color: alertRed,
                    fontWeight: "bold", textTransform: "uppercase", letterSpacing: "1px",
                    marginBottom: "10px", alignSelf: "flex-start", paddingLeft: "12px",
                    textShadow: `0 0 10px rgba(255, 60, 80, 0.4)`
                }}>
                    Desconocido
                </div>
                
                <div style={{
                    background: "rgba(15, 25, 45, 0.85)", backdropFilter: "blur(12px)",
                    border: `1px solid rgba(255,255,255,0.08)`, borderLeft: `3px solid ${alertRed}`,
                    padding: "16px 24px", borderRadius: "18px 18px 18px 4px",
                    color: "white", fontFamily: "'Altone', sans-serif", fontSize: "16px",
                    boxShadow: "0 15px 35px rgba(0,0,0,0.4), 0 0 20px rgba(255, 60, 80, 0.15)",
                    width: "100%", textAlign: "left"
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
                            No le cuentes a nadie, somos amigos
                        </span>
                    )}
                </div>
            </div>

            {/* Subtítulo Reflexivo Final */}
            <div style={{
                fontFamily: "'Altone', sans-serif", display: "inline-block", padding: "8px 20px",
                borderRadius: "999px", background: "rgba(255, 255, 255, 0.08)",
                border: `1px solid rgba(255, 255, 255, 0.3)`, color: "#FFFFFF",
                fontSize: "12px", fontWeight: 700, letterSpacing: "1.2px", textTransform: "uppercase",
                boxShadow: "0 0 20px rgba(255, 255, 255, 0.1)",
                marginTop: "20px",
                opacity: storyState >= 5 ? 1 : 0,
                transform: storyState >= 5 ? "translateY(0)" : "translateY(15px)",
                filter: storyState >= 5 ? "blur(0)" : "blur(5px)",
                transition: "all 1.2s ease"
            }}>
                El peligro en la red no siempre hace ruido. A veces se esconde en lo que parece normal.
            </div>
        </div>
      </section>

      {/* SECCIÓN: QUÉ ES EL GROOMING */}
      <section id="que-es" style={{ padding: "100px 20px", position: "relative", zIndex: 1 }}>
        <div style={{
            maxWidth: "1200px", margin: "0 auto", display: "flex", flexWrap: "wrap",
            gap: "70px", alignItems: "stretch"
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
                  color: "#FFF", margin: 0, maxWidth: "480px", letterSpacing: "0.5px",
                  textShadow: "0 10px 30px rgba(0,0,0,0.4)"
                }}
              >
                Reconocer el problema es el primer paso
              </h2>
            </div>
          </div>

          <div className="reveal-on-scroll custom-blur delay-300" style={{
              flex: "1.2 1 450px", display: "flex", flexDirection: "column", justifyContent: "center", height: "100%",
              padding: "40px 48px",
              position: "relative"
            }}
          >
            {/* CONTENIDO REDISEÑADO ESCANEABLE - MINIMALISTA */}
            <div style={{ display: "flex", flexDirection: "column", gap: "28px", position: "relative", zIndex: 1, marginTop: "16px" }}>
               
               {/* Bloque 1 */}
               <div style={{ borderLeft: "2px solid #FFFFFF", paddingLeft: "18px" }}>
                 <div style={{ fontSize: "11px", fontFamily: "'Altone', sans-serif", color: "#FFFFFF", textTransform: "uppercase", letterSpacing: "1.2px", marginBottom: "6px", fontWeight: "bold" }}>
                   01. El Concepto
                 </div>
                 <div style={{ fontSize: "17px", lineHeight: 1.6, color: "#FFFFFF" }}>
                   Forma de <span className="highlight-white-glow" style={{ fontSize: "14px" }}>VIOLENCIA DIGITAL</span> donde una persona adulta contacta a menores con fines sexuales.
                 </div>
               </div>

               {/* Bloque 2 */}
               <div style={{ borderLeft: "2px solid #FFFFFF", paddingLeft: "18px" }}>
                 <div style={{ fontSize: "11px", fontFamily: "'Altone', sans-serif", color: "#FFFFFF", textTransform: "uppercase", letterSpacing: "1.2px", marginBottom: "6px", fontWeight: "bold" }}>
                   02. Vectores de Contacto
                 </div>
                 <div style={{ fontSize: "17px", lineHeight: 1.6, color: "#FFFFFF" }}>
                   Se oculta en plataformas de confianza como <span className="highlight-white-glow" style={{ fontSize: "14px" }}>REDES SOCIALES, JUEGOS ONLINE Y CHATS</span>.
                 </div>
               </div>

               {/* Bloque 3 */}
               <div style={{ borderLeft: "2px solid #FFFFFF", paddingLeft: "18px" }}>
                 <div style={{ fontSize: "11px", fontFamily: "'Altone', sans-serif", color: "#FFFFFF", textTransform: "uppercase", letterSpacing: "1.2px", marginBottom: "6px", fontWeight: "bold" }}>
                   03. Defensa Activa
                 </div>
                 <div style={{ fontSize: "17px", lineHeight: 1.6, color: "#FFFFFF" }}>
                   La educación y las herramientas claras permiten identificar <span className="highlight-white-glow" style={{ fontSize: "14px" }}>SEÑALES DE ALERTA</span> para interceptar la amenaza a tiempo.
                 </div>
               </div>

            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN: NUESTRO ENFOQUE */}
      <section style={{ padding: "40px 20px 100px", position: "relative", zIndex: 1 }}>
        <div className="reveal-on-scroll" style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ maxWidth: "760px", marginBottom: "50px" }}>
            <h2 style={{ fontFamily: "'LEMON MILK', sans-serif", fontSize: "clamp(24px, 3vw, 36px)", color: "#FFF", margin: "0 0 16px" }}>
              Pilares de la plataforma
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px" }}>
            {pillars.map((pillar, idx) => (
              <article
                key={pillar.title}
                className={`reveal-on-scroll delay-${(idx + 1) * 100}`}
                style={{
                  background: "rgba(20, 30, 50, 0.5)", border: "1px solid rgba(255, 255, 255, 0.1)", 
                  borderRadius: "24px", padding: "24px 28px", backdropFilter: "blur(10px)",
                  transition: "transform 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = "translateY(-8px)";
                  e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.3)";
                  e.currentTarget.style.boxShadow = "0 20px 40px rgba(0,0,0,0.4), 0 0 20px rgba(255, 255, 255, 0.05)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <h3 className="highlight-white-glow" style={{ fontFamily: "'LEMON MILK', sans-serif", fontSize: "20px", margin: "0 0 16px" }}>
                  {pillar.title}
                </h3>
                <p style={{ fontSize: "16px", lineHeight: 1.6, color: "#FFFFFF", margin: 0 }}>
                  {pillar.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* SECCIÓN: RECORRIDOS ESPECÍFICOS */}
      <section id="mundos" style={{ padding: "100px 20px", position: "relative", zIndex: 1 }}>
        <div className="reveal-on-scroll" style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ maxWidth: "800px", marginBottom: "56px" }}>
            <h2 style={{ fontFamily: "'LEMON MILK', sans-serif", fontSize: "clamp(32px, 4.5vw, 54px)", color: "#FFFFFF", margin: "0 0 20px" }}>
              Un recorrido específico para cada usuario
            </h2>
            <p style={{ fontSize: "18px", lineHeight: 1.78, color: "#FFFFFF", margin: 0, maxWidth: "690px" }}>
              La plataforma organiza sus contenidos según la edad y el rol de
              cada persona para que la prevención sea más clara y efectiva. Entra al entorno que te corresponda.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "28px" }}>
            {worlds.map((world, idx) => (
              <article key={world.title} className={`card-world reveal-on-scroll delay-${(idx % 2 + 1) * 100}`} style={{ padding: "40px 36px", borderRadius: "28px" }}>
                <h3 style={{ fontFamily: "'LEMON MILK', sans-serif", fontSize: "24px", margin: "0 0 16px", maxWidth: "480px" }}>
                  {world.title}
                </h3>
                <p style={{ fontSize: "17px", lineHeight: 1.82, margin: "0 0 32px", maxWidth: "510px" }}>
                  {world.description}
                </p>
                <a href={world.href} className="btn-primary" style={{
                    fontFamily: "'LEMON MILK', sans-serif", display: "inline-flex", padding: "18px 32px", borderRadius: "14px",
                    textDecoration: "none", background: mainBlue, color: "#FFFFFF", fontSize: "14px", fontWeight: "bold",
                    textTransform: "uppercase",
                    boxShadow: `0 8px 20px rgba(116, 179, 206, 0.3)`,
                  }}>
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
                ¿Detectaste una amenaza en la red?
              </h2>
              <p style={{ fontSize: "18px", color: "#FFFFFF", margin: 0 }}>
                El grooming es un delito. Si necesitas ayuda o detectaste un comportamiento sospechoso, comunicate con la línea nacional gratuita y confidencial.
              </p>
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