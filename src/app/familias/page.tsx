"use client";

import React, { useEffect, useRef, useState } from 'react';
// import { trackWorldEntry } from "@/lib/tracking"; // Descomentar en entorno real

export default function FamiliasPage() {
  /* useEffect(() => {
    trackWorldEntry("familias");
  }, []); */

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // --- DATOS DEL CONTENIDO ESTRUCTURADO ---

  const contextoFamilia = [
    {
      num: "01",
      title: "El peligro invisible",
      text: "El grooming no empieza con amenazas, empieza con confianza. Para acercarse a los chicos, los acosadores usan formas naturales, perfiles falsos y falsos intereses comunes."
    },
    {
      num: "02",
      title: "Disponibilidad vs. Control",
      text: "Tu disponibilidad para escuchar sin juzgar es más importante que cualquier control parental o software de rastreo."
    },
    {
      num: "03",
      title: "El objetivo: Aislamiento",
      text: "El acosador buscará siempre alejar a la víctima de su entorno familiar. Mantener el diálogo abierto rompe su principal herramienta de manipulación."
    }
  ];

  const keySignals = [
    {
      title: "Oculta la pantalla",
      description: "Cambia de ventana, apaga el celular o gira la pantalla cuando te acercás. Sucede de forma automática, sin explicación.",
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/><line x1="3" y1="3" x2="21" y2="21" stroke="#E63946" strokeWidth="2" /></svg>
    },
    {
      title: "Más tiempo online",
      description: "Aumenta el uso de dispositivos de noche o madrugada. Se pone ansioso o irritable si se le pide que se desconecte.",
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
    },
    {
      title: "Contactos sin explicación",
      description: "Menciona un 'amigo' online que no sabe cómo conoció, o recibe regalos, dinero o créditos de juegos de un desconocido.",
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
    },
    {
      title: "Cambios de conducta",
      description: "Tristeza o enojo repentino post-uso del celular. Evita hablar, se aleja de la familia o deja actividades que antes disfrutaba.",
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/><line x1="12" y1="8" x2="12" y2="15" stroke="#E63946"/><line x1="9" y1="11" x2="15" y2="14" stroke="#E63946"/></svg>
    }
  ];

  // NUEVO: Datos para la infografía estilo póster
  const infografiaReglas = [
    {
      title: "Supervisá con quién habla en línea",
      text: "Involucrate en sus espacios digitales. Jugá con ellos o preguntales quiénes son sus contactos virtuales.",
      icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/><circle cx="12" cy="10" r="3"/></svg>,
      highlight: false
    },
    {
      title: "NO PERMITAS que compartan fotos o ubicación",
      text: "Una vez que una imagen o dato geográfico se envía, se pierde el control para siempre.",
      icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/><line x1="2" y1="2" x2="22" y2="22" stroke="#E63946"/></svg>,
      highlight: true
    },
    {
      title: "Hablen sobre los peligros de Internet",
      text: "Explicá, sin generar pánico, que no todos los perfiles de redes sociales y videojuegos son personas reales.",
      icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
      highlight: false
    },
    {
      title: "GENERÁ CONFIANZA",
      text: "Que sepan que, pase lo que pase, siempre pueden contarte todo sin miedo a ser castigados o que les quiten el celular.",
      icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z"/></svg>,
      highlight: false
    }
  ];

  const bestPractices = [
    {
      title: "Hablá antes de que pase algo",
      text: "Preguntá con quién habla, qué juega, qué ve. El diálogo normaliza la conversación y abre canales de confianza."
    },
    {
      title: "Revisá la privacidad",
      text: "Asegurate de que los perfiles sociales y juegos estén en modo privado. Revisá quiénes pueden ver su ubicación."
    },
    {
      title: "Acuerdos, no prohibiciones",
      text: "Horarios de uso y reglas claras. Los acuerdos construyen confianza; las prohibiciones generan secretos."
    },
    {
      title: "La regla del desconocido",
      text: "Dejar claro que un contacto en internet sigue siendo desconocido aunque lleven semanas hablando. La confianza no reemplaza la verificación."
    }
  ];

  const preventionTips = [
    "Averiguá y comprendé qué redes sociales o juegos usa.",
    "Revisá periódicamente con quién interactúa online.",
    "Explicá que no todo en internet es real (identidad, edad, fotos).",
    "Establecé como regla no aceptar solicitudes de desconocidos.",
    "Configurá la privacidad de las cuentas juntos.",
    "Supervisá el uso de dispositivos ubicándolos en áreas comunes.",
    "Evitá el uso de cámaras web con personas no conocidas físicamente.",
    "Mantené una actitud receptiva si te cuentan algo que les incomodó."
  ];

  const actionSteps = [
    {
      step: "01",
      title: "Escuchar sin reaccionar negativamente",
      text: "Mantener la calma es lo principal. Tu hijo/a es víctima. No culpes, no retes, no quites el dispositivo. Necesitan sentir contención.",
      highlight: false
    },
    {
      step: "02",
      title: "NO BORRAR NINGUNA EVIDENCIA",
      text: "Es el error más común. Chats, fotos, audios, perfiles y URLs son evidencia legal. Borrarlos anula la posibilidad de investigar.",
      highlight: true
    },
    {
      step: "03",
      title: "CAPTURAR Y DOCUMENTAR TODO",
      text: "Hacé capturas de pantalla, guardá nombres de usuario y URLs. Hacelo antes de bloquear al acosador para no perder el rastro.",
      highlight: true
    },
    {
      step: "04",
      title: "DENUNCIAR DE INMEDIATO",
      text: "Comunicarte con las autoridades. No confrontes al acosador ni interactúes desde la cuenta del menor. El tiempo es clave.",
      highlight: true
    }
  ];

  // Variables de Color (Adaptadas a Familias pero en estructura técnica Docentes)
  const colors = {
    bg: "#F8FAFC",              // Fondo principal claro
    bgAlt: "#EEF6FB",           // Fondo alternativo
    textMain: "#0A2540",        // Azul muy oscuro (Textos fuertes y títulos)
    textSec: "#4A6278",         // Gris azulado
    brandBlue: "#74B3CE",       // Celeste Familias (Acentos y header)
    brandDark: "#5A99B4",       // Azul intermedio
    accentLight: "#EAF4F8",     // Celeste muy suave
    line: "#D8E3EC",            // Líneas divisorias (Grilla)
    alert: "#E63946",           // Rojo alerta
    protocolBg: "#0B192C",      // Fondo oscuro para bloque de protocolo
  };

  // Observador de Scroll para animaciones "Reveal"
  useEffect(() => {
    const observerOptions = { root: null, rootMargin: '0px', threshold: 0.1 };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, observerOptions);

    const elements = document.querySelectorAll('.reveal');
    elements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  // Efecto del Mouse y Canvas (Adaptado a paleta más limpia)
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
    const particleCount = 40; 
    const maxDistance = 140;

    class Particle {
      x: number; y: number; vx: number; vy: number; radius: number; isThreat: boolean;
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.2;
        this.vy = (Math.random() - 0.5) * 0.2;
        this.isThreat = Math.random() > 0.95;
        this.radius = this.isThreat ? 2 : 1.5;
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
        ctx.fillStyle = this.isThreat ? "rgba(230, 57, 70, 0.4)" : "rgba(116, 179, 206, 0.4)"; 
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) particles.push(new Particle());

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach(p => { p.update(); p.draw(); });
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
    <main style={{ 
      backgroundColor: colors.bg, 
      color: colors.textMain, 
      fontFamily: "'Altone', sans-serif", 
      minHeight: "100vh", 
      position: "relative",
      overflowX: "hidden"
    }}>
      <style>
        {`
          @import url('https://fonts.cdnfonts.com/css/lemon-milk');
          @import url('https://fonts.cdnfonts.com/css/altone');
          
          html { scroll-behavior: smooth; }
          
          /* Tipografía */
          .font-display { font-family: 'LEMON MILK', sans-serif; text-transform: uppercase; }
          .font-body { font-family: 'Altone', sans-serif; }
          
          /* Animaciones Reveal */
          .reveal {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.8s ease-out, transform 0.8s ease-out;
          }
          .reveal.active {
            opacity: 1;
            transform: translateY(0);
          }
          .delay-100 { transition-delay: 100ms; }
          .delay-200 { transition-delay: 200ms; }
          .delay-300 { transition-delay: 300ms; }

          /* Grilla Técnica Blueprint (Heredada de Docentes) */
          .grid-frame {
            border-left: 1px solid ${colors.line};
            border-right: 1px solid ${colors.line};
            max-width: 1200px;
            margin: 0 auto;
            position: relative;
          }
          
          .border-b-grid { border-bottom: 1px solid ${colors.line}; }
          .border-t-grid { border-top: 1px solid ${colors.line}; }
          
          /* Botones y CTAs */
          .btn-solid {
            background: ${colors.textMain};
            color: #FFFFFF;
            padding: 16px 32px;
            text-transform: uppercase;
            font-family: 'LEMON MILK', sans-serif;
            font-size: 13px;
            font-weight: bold;
            letter-spacing: 1px;
            transition: all 0.3s ease;
            display: inline-flex;
            align-items: center;
            border-radius: 4px;
            text-decoration: none;
          }
          .btn-solid:hover {
            background: ${colors.brandDark};
            transform: translateY(-2px);
          }

          .btn-outline {
            border: 1px solid ${colors.textMain};
            color: ${colors.textMain};
            background: transparent;
            padding: 16px 32px;
            text-transform: uppercase;
            font-family: 'LEMON MILK', sans-serif;
            font-size: 13px;
            letter-spacing: 1px;
            transition: all 0.3s ease;
            display: inline-flex;
            align-items: center;
            border-radius: 4px;
            text-decoration: none;
          }
          .btn-outline:hover {
            background: ${colors.textMain};
            color: #FFFFFF;
          }

          /* Módulos de contenido */
          .module-card {
            padding: 40px;
            transition: all 0.3s ease;
            background: transparent;
            position: relative;
          }
          .module-card:hover {
            background: #FFFFFF;
            z-index: 2;
          }

          /* Etiquetas Técnicas */
          .tech-label {
            font-family: monospace;
            font-size: 12px;
            letter-spacing: 1.5px;
            text-transform: uppercase;
            color: ${colors.textSec};
            display: block;
            margin-bottom: 16px;
            opacity: 0.9;
          }

          /* Spotlight */
          .spotlight-light {
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
            pointer-events: none; z-index: 10;
            background: radial-gradient(circle 600px at var(--x) var(--y), rgba(116, 179, 206, 0.08), transparent 80%);
          }

          /* Header Nav Links */
          .header-link {
            text-decoration: none;
            color: #FFFFFF;
            font-size: 13px;
            font-weight: bold;
            transition: opacity 0.3s;
            text-transform: uppercase;
          }
          .header-link:hover { opacity: 0.8; }

          .header-btn {
            text-decoration: none;
            color: ${colors.brandBlue};
            background: #FFFFFF;
            padding: 10px 24px;
            border-radius: 30px;
            font-size: 13px;
            font-weight: bold;
            transition: transform 0.3s;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .header-btn:hover { transform: translateY(-2px); }

          /* Layout Utilities */
          .grid-2 { display: grid; grid-template-columns: 1fr; }
          .grid-4 { display: grid; grid-template-columns: 1fr; }
          @media (min-width: 768px) {
            .grid-2 { grid-template-columns: 1fr 1fr; }
            .grid-4 { grid-template-columns: repeat(2, 1fr); }
            .border-r-md { border-right: 1px solid ${colors.line}; }
          }
          @media (min-width: 1024px) {
            .grid-4 { grid-template-columns: repeat(4, 1fr); }
          }

          /* Chat UI Técnico */
          .chat-box {
            border: 1px solid ${colors.line};
            background: #FFFFFF;
            border-radius: 4px;
            font-family: monospace;
            padding: 24px;
            display: flex;
            flex-direction: column;
            gap: 16px;
          }
          .chat-msg {
            padding: 12px 16px;
            border-radius: 4px;
            max-width: 85%;
            font-size: 14px;
            line-height: 1.5;
            font-family: 'Altone', sans-serif;
          }
          .msg-alert {
            background: #FFF5F6;
            border-left: 3px solid ${colors.alert};
            align-self: flex-start;
          }
          .msg-neutral {
            background: ${colors.bgAlt};
            border-right: 3px solid ${colors.brandBlue};
            align-self: flex-end;
          }
        `}
      </style>

      {/* BACKGROUND ELEMENTS */}
      <div className="spotlight-light" style={{ '--x': `${mousePos.x}px`, '--y': `${mousePos.y}px` } as React.CSSProperties} />
      <canvas ref={canvasRef} style={{ position: "fixed", top: 0, left: 0, zIndex: 0, pointerEvents: "none", opacity: 0.8 }} />

      {/* HEADER / NAVBAR */}
      <header style={{ position: "sticky", top: 0, zIndex: 50, background: colors.brandBlue, boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
        <nav className="grid-frame" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: "80px", padding: "0 24px", borderLeft: "none", borderRight: "none" }}>
          <a href="/" className="font-display" style={{ textDecoration: "none", color: "#FFFFFF", fontSize: "22px", fontWeight: "bold", letterSpacing: "1.5px" }}>
            SAFENET
          </a>
          <div style={{ display: "flex", gap: "32px", alignItems: "center" }}>
            <a href="#riesgo" className="font-display header-link">Riesgos</a>
            <a href="#prevencion" className="font-display header-link">Prevención</a>
            <a href="#protocolo" className="font-display header-link">Denunciar</a>
            <a href="#protocolo" className="font-display header-btn">Ayuda 137</a>
          </div>
        </nav>
      </header>

      {/* CONTENEDOR PRINCIPAL GRILLA */}
      <div className="grid-frame">

        {/* 1. HERO SECTION CON VIDEO */}
        <section className="border-b-grid reveal" style={{ position: "relative", zIndex: 1, padding: "80px 24px" }}>
          <div className="grid-2" style={{ gap: "60px", alignItems: "center" }}>
            
            {/* Columna Texto */}
            <div>
              <span className="tech-label" style={{ marginBottom: "24px" }}>[ SEC. 01 ] — GUÍA PARA FAMILIAS</span>
              <h1 className="font-display" style={{ fontSize: "clamp(32px, 4vw, 56px)", lineHeight: 1.15, color: colors.textMain, margin: "0 0 32px" }}>
                Acompañar es el primer paso para <span style={{ color: colors.brandBlue }}>proteger</span>
              </h1>
              <p className="font-body" style={{ fontSize: "16px", lineHeight: 1.6, color: colors.textSec, margin: "0 0 40px", maxWidth: "500px" }}>
                El grooming comienza con conversaciones que parecen normales. Entender la dinámica del engaño, reconocer las señales tempranas y establecer canales de confianza son las herramientas más efectivas del entorno familiar.
              </p>
              <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", alignItems: "flex-start" }}>
                <a href="#infografia" className="btn-solid">Ver Reglas de Oro</a>
                <a href="#protocolo" className="btn-outline">Protocolo de Acción</a>
              </div>
            </div>

            {/* Columna Video (Instagram Reel) */}
            <div style={{ display: "flex", justifyContent: "center", position: "relative" }}>
              {/* Elementos decorativos técnicos para enmarcar el video */}
              <div style={{ position: "absolute", top: "-15px", left: "calc(50% - 175px)", width: "30px", height: "30px", borderTop: `2px solid ${colors.brandBlue}`, borderLeft: `2px solid ${colors.brandBlue}`, zIndex: 0 }}></div>
              <div style={{ position: "absolute", bottom: "-15px", right: "calc(50% - 175px)", width: "30px", height: "30px", borderBottom: `2px solid ${colors.brandBlue}`, borderRight: `2px solid ${colors.brandBlue}`, zIndex: 0 }}></div>
              
              {/* Contenedor del Iframe */}
              <div style={{ 
                width: "100%", 
                maxWidth: "340px", 
                height: "600px", 
                background: "#FFFFFF", 
                borderRadius: "16px", 
                overflow: "hidden", 
                border: `1px solid ${colors.line}`,
                boxShadow: "0 25px 50px rgba(10, 37, 64, 0.15)",
                position: "relative",
                zIndex: 2
              }}>
                <iframe 
                  src="https://www.instagram.com/reel/DX2d0c1DuZv/embed/" 
                  width="100%" 
                  height="100%" 
                  frameBorder="0" 
                  scrolling="no" 
                  allowTransparency={true}
                  allow="encrypted-media"
                  style={{ border: "none", background: "white", display: "block" }}
                  title="Video sobre prevención del Grooming"
                ></iframe>
              </div>
            </div>

          </div>
        </section>

        {/* 2 & 3. CONTEXTO Y ROL FAMILIAR */}
        <section className="border-b-grid grid-2 reveal" style={{ position: "relative", zIndex: 1 }}>
          {/* Columna Izquierda: Dinámica */}
          <div className="border-r-md" style={{ padding: "60px 24px", background: colors.bgAlt }}>
            <span className="tech-label">[ SEC. 02 ] — DINÁMICA DEL ENGAÑO</span>
            <h2 className="font-display" style={{ fontSize: "24px", margin: "0 0 24px", letterSpacing: "1px" }}>El Problema</h2>
            <p className="font-body" style={{ fontSize: "16px", lineHeight: 1.7, color: colors.textSec, margin: "0 0 24px" }}>
              Para acercarse a chicos y chicas, los acosadores utilizan tácticas que simulan naturalidad. Estudian perfiles, identifican gustos y crean cuentas diseñadas para generar una falsa empatía.
            </p>
            <p className="font-body" style={{ fontSize: "16px", lineHeight: 1.7, color: colors.textMain, fontWeight: 600, margin: 0 }}>
              Nunca empieza con una amenaza. Empieza con la construcción meticulosa de una relación de confianza para lograr el aislamiento.
            </p>
          </div>

          {/* Columna Derecha: Rol Familiar */}
          <div style={{ padding: "60px 24px" }}>
            <span className="tech-label">[ SEC. 03 ] — EL ROL DEL ADULTO</span>
            <h2 className="font-display" style={{ fontSize: "24px", margin: "0 0 32px", letterSpacing: "1px" }}>Presencia Activa</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
              {contextoFamilia.map((item, idx) => (
                <div key={idx} className={`reveal delay-${(idx + 1) * 100}`} style={{ display: "flex", gap: "20px" }}>
                  <div className="font-display" style={{ fontSize: "16px", color: colors.brandBlue, marginTop: "2px" }}>{item.num}</div>
                  <div>
                    <h3 className="font-display" style={{ fontSize: "14px", margin: "0 0 8px", letterSpacing: "0.5px" }}>{item.title}</h3>
                    <p className="font-body" style={{ fontSize: "15px", lineHeight: 1.6, color: colors.textSec, margin: 0 }}>{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. CASO DE ESTUDIO / CHAT */}
        <section className="border-b-grid grid-2 reveal" style={{ position: "relative", zIndex: 1 }}>
          <div className="border-r-md" style={{ padding: "80px 24px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <span className="tech-label" style={{ color: colors.alert }}>[ SEC. 04 ] — REGISTRO DE CASO</span>
            <h2 className="font-display" style={{ fontSize: "28px", margin: "0 0 24px", letterSpacing: "1px" }}>Así empieza en la realidad</h2>
            <p className="font-body" style={{ fontSize: "16px", lineHeight: 1.7, color: colors.textSec, margin: "0 0 24px" }}>
              El acosador ("Groomer") ingresa a través de juegos online o redes sociales. El proceso es gradual y está calculado para no levantar sospechas iniciales.
            </p>
            <div style={{ borderLeft: `3px solid ${colors.alert}`, paddingLeft: "16px" }}>
              <p className="font-body" style={{ fontSize: "15px", lineHeight: 1.6, color: colors.textMain, fontWeight: "bold", margin: 0 }}>
                La solicitud de "guardar el secreto" es una de las primeras banderas rojas comprobables. Aparece temprano, antes de que la situación escale a extorsión.
              </p>
            </div>
          </div>

          {/* UI CHAT TÉCNICO */}
          <div style={{ padding: "60px 24px", background: "#FFFFFF" }}>
            <div className="chat-box">
              <div style={{ fontSize: "12px", color: colors.textSec, borderBottom: `1px solid ${colors.line}`, paddingBottom: "12px", marginBottom: "8px", display: "flex", justifyContent: "space-between" }}>
                <span>ID_ENTIDAD: Gamer_Pro_14</span>
                <span style={{ color: colors.alert }}>ESTADO: RIESGO DETECTADO</span>
              </div>
              
              <div className="chat-msg msg-alert">
                <span style={{ fontSize: "11px", fontWeight: "bold", color: colors.alert, display: "block", marginBottom: "4px", fontFamily: "monospace" }}>&gt; Gamer_Pro_14</span>
                Hola, vi que jugás muy bien. Podemos hacer equipo, te paso todos los trucos que sé.
              </div>
              
              <div className="chat-msg msg-neutral">
                <span style={{ fontSize: "11px", fontWeight: "bold", color: colors.brandBlue, display: "block", marginBottom: "4px", fontFamily: "monospace" }}>&gt; Usuario_Menor</span>
                Dale, me cuesta mucho pasar este nivel.
              </div>
              
              <div className="chat-msg msg-alert">
                <span style={{ fontSize: "11px", fontWeight: "bold", color: colors.alert, display: "block", marginBottom: "4px", fontFamily: "monospace" }}>&gt; Gamer_Pro_14</span>
                Sos la única persona con la que me divierto jugando. Mandame una foto tuya para saber con quién hablo, pero no le cuentes a nadie. Es nuestro secreto.
              </div>

              <div style={{ marginTop: "16px", padding: "12px", background: "rgba(230,57,70,0.05)", border: `1px dashed ${colors.alert}`, fontSize: "12px", color: colors.alert, display: "flex", gap: "12px", alignItems: "center" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                <span><strong>ANÁLISIS:</strong> Pedir fotos + solicitud de secreto = Señal directa de Grooming.</span>
              </div>
            </div>
          </div>
        </section>

        {/* 5. INDICADORES DE RIESGO */}
        <section id="riesgo" className="border-b-grid reveal" style={{ position: "relative", zIndex: 1, backgroundColor: colors.bgAlt }}>
          <div style={{ padding: "80px 24px", borderBottom: `1px solid ${colors.line}` }}>
            <span className="tech-label">[ SEC. 05 ] — INDICADORES DE RIESGO</span>
            <h2 className="font-display" style={{ fontSize: "36px", margin: "0", letterSpacing: "1px" }}>Señales de Alerta</h2>
            <p className="font-body" style={{ fontSize: "16px", color: colors.textSec, marginTop: "16px", maxWidth: "700px", lineHeight: 1.6 }}>
              Cambios sutiles en la conducta que requieren atención. Ninguna señal aislada define una situación por sí misma, pero la combinación de varias exige intervención.
            </p>
          </div>
          <div className="grid-4">
            {keySignals.map((signal, idx) => (
              <div key={idx} className={`module-card reveal delay-${idx * 100}`} style={{ borderRight: idx !== 3 ? `1px solid ${colors.line}` : 'none', borderBottom: `1px solid ${colors.line}`, display: "flex", flexDirection: "column" }}>
                <div style={{ marginBottom: "20px", color: colors.textMain }}>
                  {signal.icon}
                </div>
                <h3 className="font-display" style={{ fontSize: "15px", margin: "0 0 12px", color: colors.textMain }}>{signal.title}</h3>
                <p className="font-body" style={{ fontSize: "14px", lineHeight: 1.6, color: colors.textSec, margin: 0 }}>
                  {signal.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 6. NUEVA SECCIÓN: INFOGRAFÍA / REGLAS DE ORO */}
        <section id="infografia" className="border-b-grid reveal" style={{ position: "relative", zIndex: 1, backgroundColor: "#FFFFFF" }}>
          <div className="grid-2">
            
            {/* Izquierda: Título tipo Póster */}
            <div className="border-r-md" style={{ background: colors.brandBlue, color: "#FFFFFF", padding: "80px 40px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <span className="font-display" style={{ background: colors.alert, color: "#FFF", padding: "8px 16px", fontSize: "12px", fontWeight: "bold", borderRadius: "100px", alignSelf: "flex-start", marginBottom: "32px", letterSpacing: "0.5px" }}>
                La Seguridad Somos Todos
              </span>
              <h2 className="font-display" style={{ fontSize: "clamp(32px, 4vw, 48px)", lineHeight: 1.1, marginBottom: "24px" }}>
                Cuidá a tus hijos del grooming
              </h2>
              <p className="font-body" style={{ fontSize: "18px", opacity: 0.9, lineHeight: 1.6, maxWidth: "400px" }}>
                El grooming es real y puede empezar silenciosamente en videojuegos online, chats o redes sociales.
              </p>

              {/* Ilustración abstracta representativa (Reemplazo conceptual del niño con auriculares) */}
              <div style={{ marginTop: "40px", opacity: 0.8 }}>
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="6" width="20" height="12" rx="2" ry="2"/>
                  <path d="M12 12h.01"/>
                  <path d="M17 12h.01"/>
                  <path d="M7 12h.01"/>
                  <path d="M12 18v3"/>
                  <path d="M8 21h8"/>
                </svg>
              </div>
            </div>

            {/* Derecha: Puntos de Acción tipo Checklist visual */}
            <div style={{ padding: "40px 24px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <span className="tech-label" style={{ marginBottom: "32px" }}>[ SEC. 06 ] — GUÍA VISUAL DE REGLAS DE ORO</span>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {infografiaReglas.map((regla, idx) => (
                  <div key={idx} className={`reveal delay-${idx * 100}`} style={{ display: "flex", alignItems: "center", gap: "20px", padding: "20px", border: regla.highlight ? `2px solid ${colors.alert}` : `1px solid ${colors.line}`, borderRadius: "8px", background: regla.highlight ? "rgba(230, 57, 70, 0.04)" : "#FFFFFF" }}>
                    <div style={{ flexShrink: 0, width: "56px", height: "56px", borderRadius: "50%", background: regla.highlight ? colors.alert : "rgba(116, 179, 206, 0.15)", color: regla.highlight ? "#FFFFFF" : colors.brandBlue, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {regla.icon}
                    </div>
                    <div>
                      <h3 className="font-display" style={{ fontSize: "14px", color: regla.highlight ? colors.alert : colors.textMain, margin: "0 0 6px", letterSpacing: "0.5px" }}>
                        {regla.title}
                      </h3>
                      <p className="font-body" style={{ fontSize: "14px", color: colors.textSec, margin: 0, lineHeight: 1.5 }}>
                        {regla.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>

        {/* 7. PREVENCIÓN ACTIVA */}
        <section id="prevencion" className="border-b-grid reveal" style={{ position: "relative", zIndex: 1, padding: "80px 24px" }}>
          <span className="tech-label">[ SEC. 07 ] — PREVENCIÓN ACTIVA</span>
          <div className="grid-2" style={{ gap: "60px" }}>
            
            {/* Hábitos */}
            <div>
              <h2 className="font-display" style={{ fontSize: "28px", margin: "0 0 32px", letterSpacing: "1px" }}>Buenas Prácticas en el Hogar</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                {bestPractices.map((practice, idx) => (
                  <div key={idx} style={{ paddingLeft: "20px", borderLeft: `2px solid ${colors.brandBlue}` }}>
                    <h3 className="font-body" style={{ fontSize: "16px", fontWeight: "bold", color: colors.textMain, margin: "0 0 8px" }}>{practice.title}</h3>
                    <p className="font-body" style={{ fontSize: "15px", lineHeight: 1.6, color: colors.textSec, margin: 0 }}>{practice.text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Configuración */}
            <div>
              <h2 className="font-display" style={{ fontSize: "28px", margin: "0 0 32px", letterSpacing: "1px", color: "transparent" }}>::</h2> {/* Espaciador visual */}
              <div style={{ background: "#FFFFFF", border: `1px solid ${colors.line}`, padding: "32px", borderRadius: "4px" }}>
                <div className="tech-label" style={{ marginBottom: "20px" }}>Checklist de Supervisión Extendida</div>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "16px" }}>
                  {preventionTips.map((tip, idx) => (
                    <li key={idx} style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={colors.brandBlue} strokeWidth="2" style={{ flexShrink: 0, marginTop: "2px" }}><polyline points="20 6 9 17 4 12"></polyline></svg>
                      <span className="font-body" style={{ fontSize: "14px", color: colors.textSec, lineHeight: 1.5 }}>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

          </div>
        </section>

        {/* 8. PROTOCOLO DE ACCIÓN */}
        <section id="protocolo" className="border-b-grid reveal" style={{ position: "relative", zIndex: 1, backgroundColor: colors.protocolBg, color: "#FFFFFF" }}>
          <div style={{ padding: "80px 24px", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
            <span className="tech-label" style={{ color: colors.accentLight, opacity: 0.7 }}>[ SEC. 08 ] — PROTOCOLO DE RESPUESTA</span>
            <h2 className="font-display" style={{ fontSize: "36px", margin: "0", letterSpacing: "1px", color: "#FFFFFF" }}>Qué hacer ante un caso real</h2>
            <p className="font-body" style={{ fontSize: "16px", color: "rgba(255,255,255,0.7)", marginTop: "16px", maxWidth: "700px", lineHeight: 1.6 }}>
              Si descubrís o sospechás una situación de grooming, el orden de los pasos es crítico para proteger al menor y preservar la evidencia legal.
            </p>
          </div>

          <div className="grid-4">
            {actionSteps.map((step, idx) => (
              <div key={idx} className={`module-card reveal delay-${idx * 100}`} style={{ borderRight: idx !== 3 ? '1px solid rgba(255,255,255,0.1)' : 'none', borderBottom: '1px solid rgba(255,255,255,0.1)', background: step.highlight ? 'rgba(230, 57, 70, 0.05)' : 'transparent' }}>
                <div className="font-display" style={{ fontSize: "24px", color: step.highlight ? colors.alert : colors.brandBlue, marginBottom: "16px" }}>{step.step}</div>
                <h3 className="font-display" style={{ fontSize: "15px", margin: "0 0 12px", color: step.highlight ? colors.alert : "#FFFFFF" }}>{step.title}</h3>
                <p className="font-body" style={{ fontSize: "14px", lineHeight: 1.6, color: "rgba(255,255,255,0.7)", margin: 0 }}>
                  {step.text}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 9. DENUNCIA Y AYUDA */}
        <section className="reveal" style={{ padding: "80px 24px", position: "relative", zIndex: 1, backgroundColor: "#FFFFFF" }}>
          <div style={{ border: `1px solid ${colors.alert}`, borderRadius: "4px", padding: "40px", display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "32px", background: "rgba(230, 57, 70, 0.02)" }}>
            <div>
              <span className="tech-label" style={{ color: colors.alert, marginBottom: "8px" }}>[ SEC. 09 ] — CANALES OFICIALES</span>
              <h2 className="font-display" style={{ fontSize: "28px", color: colors.textMain, margin: "0 0 12px" }}>Asistencia y Denuncia</h2>
              <p className="font-body" style={{ fontSize: "15px", color: colors.textSec, margin: 0, maxWidth: "600px", lineHeight: 1.6 }}>
                Línea 137 — gratuita, confidencial, disponible las 24 horas en todo el país.<br/>
                También podés llamar al <strong>0800-222-1717</strong> (Brigada de Delitos contra Niños, Niñas y Adolescentes).
              </p>
            </div>
            <a href="tel:137" className="font-display" style={{ display: "inline-flex", alignItems: "center", gap: "12px", background: colors.alert, color: "#FFFFFF", padding: "16px 32px", textDecoration: "none", fontWeight: "bold", letterSpacing: "1px", borderRadius: "4px" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
              Llamar al 137
            </a>
          </div>
        </section>

      </div> {/* Fin Grid Frame */}

      {/* FOOTER */}
      <footer className="reveal" style={{ background: colors.bg, padding: "60px 24px", position: "relative", zIndex: 1, borderTop: `1px solid ${colors.line}` }}>
        <div className="grid-frame" style={{ border: "none", display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "40px" }}>
          <div>
            <div className="font-display" style={{ fontSize: "28px", fontWeight: "bold", color: colors.textMain, letterSpacing: "1.5px", marginBottom: "8px" }}>SAFENET</div>
            <div className="font-body" style={{ fontSize: "13px", color: colors.textSec, letterSpacing: "0.5px" }}>PLATAFORMA EDUCATIVA DE PREVENCIÓN DIGITAL</div>
          </div>
          
          <div style={{ display: "flex", gap: "32px", alignItems: "center" }}>
            <a href="/" className="font-body" style={{ textDecoration: "none", color: colors.textMain, fontSize: "14px", transition: "color 0.3s", fontWeight: "bold" }}
              onMouseOver={(e) => e.currentTarget.style.color = colors.brandBlue}
              onMouseOut={(e) => e.currentTarget.style.color = colors.textMain}
            >
              ← Volver al Inicio
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