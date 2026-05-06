"use client";

import React, { useEffect, useRef, useState } from 'react';
// import { trackWorldEntry } from "@/lib/tracking"; // Descomentar en tu entorno real

export default function DocentesPage() {
  /* useEffect(() => {
    trackWorldEntry("docentes");
  }, []);
  */

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Estados para UX mejorada
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // --- DATOS DEL CONTENIDO ESTRUCTURADO ---

  const razonesEscuela = [
    {
      num: "01",
      title: "Espacio de confianza",
      text: "La escuela es, muchas veces, el primer o único lugar seguro donde un estudiante puede dar señales de alerta o pedir ayuda frente a un abuso digital."
    },
    {
      num: "02",
      title: "Prevención no es alarmar",
      text: "Se trata de educar. Construir ciudadanía digital, fomentar el pensamiento crítico y enseñar sobre privacidad sin usar el miedo como recurso."
    },
    {
      num: "03",
      title: "Criterio institucional",
      text: "El docente no actúa solo. Trabajar el tema desde la escuela permite activar protocolos y redes de contención de forma articulada."
    }
  ];

  const comoUsar = [
    {
      fase: "Mundo Niños (Primaria)",
      desc: "Uso de metáforas visuales. Exploración guiada para identificar qué es un 'secreto malo' y quién es un adulto de confianza.",
      tipo: "Juego exploratorio",
      url: "/ninos" // Enlace corregido basado en el Home
    },
    {
      fase: "Mundo Adolescentes (Secundaria)",
      desc: "Simulación de interfaces reales. Toma de decisiones ante situaciones de exposición, presión y contacto con desconocidos.",
      tipo: "Simulación y debate",
      url: "/adolescentes" // Enlace corregido basado en el Home
    }
  ];

  // NUEVO: Decálogo para la comunidad educativa
  const decalogo = [
    { num: "01", text: "Es fundamental el trabajo de la comunidad educativa para prevenir el grooming. La visibilización temprana puede evitar que se agrave la situación, evitar abusos y que se sumen víctimas." },
    { num: "02", text: "Trabajar con los niños, niñas y adolescentes la noción de privacidad y exposición en Internet." },
    { num: "03", text: "Trabajar con los niños, niñas y adolescentes sobre las nociones de lo privado y lo público, los vínculos y las formas de interacción online y offline." },
    { num: "04", text: "La escuela debe promover que los niños, niñas y adolescentes adquieran herramientas que les permitan hacer un uso responsable de internet, trabajando la importancia de configurar opciones de privacidad." },
    { num: "05", text: "Trabajar sobre la importancia de valorar y respetar la intimidad propia y la ajena, la exposición del cuerpo en las redes sociales y las practices basadas en estereotipos de género." },
    { num: "06", text: "Promover el diálogo y la reflexión crítica acerca de las formas de vincularnos, tanto en internet como fuera de este espacio." },
    { num: "07", text: "Promover el diálogo con los niños, niñas y adolescentes acerca de los consumos en internet, las interacciones que tienen y los modos en los que pueden evitar." },
    { num: "08", text: "Trabajar para que los niños, niñas y adolescentes conozcan sus derechos y responsabilidades, fortaleciendo la convivencia digital." },
    { num: "09", text: "La comunidad educativa debe brindar espacios de diálogo donde se promueva el debate sobre las formas de relacionarnos tanto en las redes como fuera de ellas." },
    { num: "10", text: "El grooming es un delito. Si el docente toma conocimiento o sospecha de una situación así debe informar al equipo de conducción de la escuela, contener al niño, niña o adolescente y en ningún caso minimizar o exponer lo que ocurre. Se aconseja comunicarse con la familia, acompañarla, brindarle herramientas para que pueda hacer frente a la situación y hacer un seguimiento de la problemática." }
  ];

  // RECURSOS ACTUALIZADOS: Selección de materiales oficiales con tarjetas destacadas
  const recursosBiblioteca = [
    {
      cat: "Guía pedagógica",
      title: "Desafíos para la construcción de una ciudadanía digital",
      desc: "No se limita a definir grooming: incluye el lugar de la escuela, enfoque de trabajo, factores de riesgo y orientaciones para la intervención.",
      fuente: "Min. de Educación / Argentina.gob.ar",
      url: "https://www.argentina.gob.ar/educacion/convivencia-escolar",
      cta: "Abrir recurso",
      highlighted: true // Tarjeta en color azul
    },
    {
      cat: "Guía integral",
      title: "Guía de sensibilización sobre convivencia digital",
      desc: "Trabaja huella digital, ciberbullying, sexting, grooming, responsabilidad escolar, rol del adulto, denuncias y ciudadanía digital.",
      fuente: "UNICEF Argentina y Faro Digital",
      url: "https://www.unicef.org/argentina/informes/guia-de-sensibilizacion-sobre-convivencia-digital",
      cta: "Abrir recurso"
    },
    {
      cat: "Material de sensibilización",
      title: "Convivencia Digital en la Adolescencia",
      desc: "Propone 10 acciones individuales y colectivas para prevenir la violencia digital, con ideas para campañas y charlas.",
      fuente: "Min. Público Tutelar CABA + UNICEF",
      url: "https://mptutelar.gob.ar/convivencia-digital",
      cta: "Abrir recurso"
    },
    {
      cat: "Artículo educativo",
      title: "Cuidados y seguridad al utilizar redes sociales",
      desc: "Trabaja sobre Instagram y TikTok: cuentas falsas, mensajes de desconocidos, privacidad y su vínculo con riesgos como el grooming.",
      fuente: "Educ.ar / Secretaría de Educación",
      url: "https://www.educ.ar/recursos",
      cta: "Abrir recurso",
      highlighted: true // Tarjeta en color azul
    },
    {
      cat: "Libro electrónico",
      title: "Conflictos 3.0: malentendidos en la redes",
      desc: "Propone trabajar la convivencia digital como parte de la convivencia escolar y pensar qué desafíos traen las redes en la escuela.",
      fuente: "Educ.ar / Programa de Convivencia Escolar",
      url: "https://www.educ.ar/recursos",
      cta: "Abrir recurso",
      highlighted: true // Tarjeta en color azul
    },
    {
      cat: "Guía de acompañamiento",
      title: "Acompañamiento a las adolescencias en entornos digitales",
      desc: "Incluye privacidad en redes, señales para identificar posibles situaciones de grooming y una mirada centrada en el cuidado y el diálogo.",
      fuente: "SENAF + Faro Digital",
      url: "https://www.argentina.gob.ar/desarrollosocial/senaf",
      cta: "Abrir recurso"
    },
    {
      cat: "Telefilm documental",
      title: "Grooming",
      desc: "Telefilm que mezcla ficción, documental y videodanza para abordar el acoso sexual en medios digitales. Ideal como disparador en clase.",
      fuente: "Canal Encuentro + UNICEF Argentina",
      url: "https://www.youtube.com/@CanalEncuentro",
      cta: "Ver video"
    },
    {
      cat: "Campaña de concientización",
      title: "#ElGroomingEsUnDelito",
      desc: "Campaña para alertar sobre el riesgo al que están expuestos chicos y chicas en juegos online, reuniendo líneas de asesoramiento y denuncia.",
      fuente: "UNICEF Argentina",
      url: "https://www.unicef.org/argentina/campanas/el-grooming-es-un-delito",
      cta: "Abrir campaña",
      highlighted: true // Tarjeta en color azul
    }
  ];

  const protocoloPasos = [
    {
      step: "01",
      title: "Escuchar y contener",
      text: "Recibir la situación con seriedad, sin minimizar. No forzar detalles ni interrogar."
    },
    {
      step: "02",
      title: "No exponer al estudiante",
      text: "Evitar intervenciones públicas. Manejar la información con estricta reserva."
    },
    {
      step: "03",
      title: "Preservar evidencia",
      text: "Indicar no borrar chats ni perfiles, pero no manipular los dispositivos del estudiante."
    },
    {
      step: "04",
      title: "Activar canales institucionales",
      text: "Avisar a dirección/gabinete siguiendo el protocolo de la escuela. No actuar solo."
    }
  ];

  const criteriosBasicos = [
    "No contactar al presunto agresor bajo ninguna circunstancia.",
    "No revictimizar pidiendo que el estudiante repita su historia múltiples veces.",
    "No prometer confidencialidad absoluta (si hay riesgo de vida o integridad, el adulto debe intervenir).",
    "Derivar la contención psicológica a profesionales habilitados."
  ];

  // Variables de Color (Paleta Sugerida + Header Celeste)
  const colors = {
    bg: "#F8FAFC",              // Fondo principal
    bgAlt: "#EEF6FB",           // Fondo alternativo suave
    textMain: "#102A43",        // Azul oscuro principal (Títulos y textos fuertes)
    textSec: "#5B6B7A",         // Gris azulado (Texto secundario)
    brandBlue: "#163A63",       // Azul profundo secundario (Acentos de marca)
    brandDark: "#102A43",       // Azul oscuro (Usado para etiquetas técnicas)
    accentLight: "#BFE7F5",     // Celeste acento (Brillos y hovers sutiles)
    accentLighter: "#DDF3FA",   // Celeste claro (Fondos muy tenues)
    line: "#D8E3EC",            // Líneas / divisores
    alert: "#FF8A5B",           // Naranja suave (Reemplaza al rojo alerta, tono más amigable)
    warning: "#F5C94A",         // Amarillo suave (Acentos menores)
    headerBlue: "#7AB2CB"       // Celeste sólido para la barra de navegación
  };

  // Funciones UX
  const copyToClipboard = (text: string, idx: number) => {
    // Usamos un textarea temporal como fallback robusto para iframes
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      setCopiedIndex(idx);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Error al copiar', err);
    }
    document.body.removeChild(textArea);
  };

  const handleDownloadClick = () => {
    setToastMessage("Generando PDF de la guía rápida...");
    setTimeout(() => {
      setToastMessage("¡Descarga simulada completada!");
      setTimeout(() => setToastMessage(null), 3000);
    }, 2000);
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

  // Efecto del Mouse y Canvas
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
    const particleCount = 35; // Menos partículas para ser más sutil en fondo claro
    const maxDistance = 150;

    class Particle {
      x: number; y: number; vx: number; vy: number; radius: number;
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.15;
        this.vy = (Math.random() - 0.5) * 0.15;
        this.radius = Math.random() * 1.5;
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
        ctx.fillStyle = "rgba(22, 58, 99, 0.12)"; 
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
            ctx.strokeStyle = `rgba(22, 58, 99, ${(1 - dist/maxDistance) * 0.1})`;
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
          
          /* Tipografía con estructura preservada */
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

          /* Grilla Técnica Blueprint */
          .grid-frame {
            border-left: 1px solid ${colors.line};
            border-right: 1px solid ${colors.line};
            max-width: 1200px;
            margin: 0 auto;
            position: relative;
          }
          
          .border-b-grid { border-bottom: 1px solid ${colors.line}; }
          .border-t-grid { border-top: 1px solid ${colors.line}; }
          .border-r-grid { border-right: 1px solid ${colors.line}; }
          
          /* Botones y CTAs */
          .btn-solid {
            background: ${colors.textMain};
            color: ${colors.bg};
            padding: 16px 32px;
            text-transform: uppercase;
            font-family: 'LEMON MILK', sans-serif;
            font-size: 13px;
            font-weight: bold;
            letter-spacing: 1px;
            transition: all 0.3s ease;
            display: inline-flex;
            align-items: center;
            gap: 12px;
            border-radius: 4px;
            text-decoration: none;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          }
          .btn-solid:hover {
            background: ${colors.brandBlue};
            transform: translateY(-3px);
            box-shadow: 0 8px 15px rgba(0,0,0,0.15);
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
            gap: 12px;
            border-radius: 4px;
            text-decoration: none;
          }
          .btn-outline:hover {
            background: ${colors.textMain};
            color: ${colors.bg};
            transform: translateY(-3px);
          }

          /* Módulos Interactivos con efecto Hover elevado */
          .module-card {
            padding: 40px;
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            background: transparent;
            position: relative;
            z-index: 1;
          }
          .module-card:hover {
            background: #FFFFFF;
            transform: translateY(-8px) scale(1.01);
            box-shadow: 0 15px 30px rgba(16, 42, 67, 0.08);
            z-index: 2;
            border-radius: 8px;
          }

          /* Estilos específicos para tarjetas resaltadas en Azul */
          .module-card.highlighted-card {
            background-color: ${colors.textMain};
            border-color: ${colors.textMain};
          }
          .module-card.highlighted-card:hover {
            background-color: ${colors.brandBlue};
            box-shadow: 0 15px 30px rgba(16, 42, 67, 0.2);
          }

          /* Botón Secundario de Copiar */
          .btn-icon-copy {
            background: transparent;
            border: 1px solid ${colors.line};
            color: ${colors.textSec};
            padding: 6px 12px;
            border-radius: 4px;
            cursor: pointer;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            gap: 6px;
            font-size: 11px;
            font-family: 'Altone', sans-serif;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            font-weight: bold;
          }
          .btn-icon-copy:hover {
            background: ${colors.bgAlt};
            color: ${colors.brandBlue};
            border-color: ${colors.brandBlue};
          }
          .btn-icon-copy.copied {
            background: #E6F4EA;
            color: #1E8E3E;
            border-color: #1E8E3E;
          }

          /* Variante del botón copiar para tarjetas oscuras */
          .btn-icon-copy.btn-icon-dark {
            border-color: rgba(255, 255, 255, 0.3);
            color: #FFFFFF;
          }
          .btn-icon-copy.btn-icon-dark:hover {
            background: rgba(255, 255, 255, 0.1);
            border-color: #FFFFFF;
          }
          .btn-icon-copy.btn-icon-dark.copied {
            background: #1E8E3E;
            color: #FFFFFF;
            border-color: #1E8E3E;
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

          /* Spotlight invertido para fondo claro */
          .spotlight-light {
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
            pointer-events: none; z-index: 10;
            background: radial-gradient(circle 600px at var(--x) var(--y), rgba(191, 231, 245, 0.15), transparent 80%);
          }

          /* Estilos para nav links de cabecera */
          .header-link {
            text-decoration: none;
            color: #FFFFFF;
            font-size: 13px;
            font-weight: bold;
            transition: opacity 0.3s;
            text-transform: uppercase;
          }
          .header-link:hover {
            opacity: 0.8;
          }

          .header-btn {
            text-decoration: none;
            color: ${colors.headerBlue};
            background: #FFFFFF;
            padding: 10px 24px;
            border-radius: 30px;
            font-size: 13px;
            font-weight: bold;
            transition: transform 0.3s, box-shadow 0.3s;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .header-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          }

          /* Floating Action Button (FAB) */
          .fab-btn {
            position: fixed;
            bottom: 30px;
            right: 30px;
            background: ${colors.alert};
            color: white;
            border: none;
            border-radius: 50px;
            padding: 16px 24px;
            font-family: 'LEMON MILK', sans-serif;
            font-size: 12px;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 1px;
            cursor: pointer;
            box-shadow: 0 10px 25px rgba(255, 138, 91, 0.4);
            transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            z-index: 100;
            display: flex;
            align-items: center;
            gap: 10px;
          }
          .fab-btn:hover {
            transform: translateY(-5px) scale(1.05);
            box-shadow: 0 15px 35px rgba(255, 138, 91, 0.5);
            background: #ff7640;
          }

          /* Toast Notification */
          .toast-notification {
            position: fixed;
            bottom: ${toastMessage ? '30px' : '-100px'};
            left: 50%;
            transform: translateX(-50%);
            background: ${colors.textMain};
            color: white;
            padding: 16px 32px;
            border-radius: 8px;
            font-family: 'Altone', sans-serif;
            font-size: 14px;
            font-weight: 600;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            transition: bottom 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            z-index: 1000;
            display: flex;
            align-items: center;
            gap: 12px;
          }

          /* Utilities de layout */
          .grid-2 { display: grid; grid-template-columns: 1fr; }
          .grid-3 { display: grid; grid-template-columns: 1fr; }
          @media (min-width: 768px) {
            .grid-2 { grid-template-columns: 1fr 1fr; }
            .grid-3 { grid-template-columns: repeat(3, 1fr); }
            .border-r-md { border-right: 1px solid ${colors.line}; }
          }
        `}
      </style>

      {/* BACKGROUND ELEMENTS */}
      <div className="spotlight-light" style={{ '--x': `${mousePos.x}px`, '--y': `${mousePos.y}px` } as React.CSSProperties} />
      <canvas ref={canvasRef} style={{ position: "fixed", top: 0, left: 0, zIndex: 0, pointerEvents: "none", opacity: 0.8 }} />

      {/* HEADER / NAVBAR (ESTILO CELESTE SÓLIDO) */}
      <header style={{ position: "sticky", top: 0, zIndex: 50, background: colors.headerBlue, borderBottom: `none`, boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
        <nav className="grid-frame" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: "80px", padding: "0 24px", borderLeft: "none", borderRight: "none" }}>
          <a href="/" className="font-display" style={{ textDecoration: "none", color: "#FFFFFF", fontSize: "22px", fontWeight: "bold", letterSpacing: "1.5px" }}>
            SAFENET
          </a>
          <div style={{ display: "flex", gap: "32px", alignItems: "center" }}>
            <a href="#como-usar" className="font-display header-link">Implementación</a>
            <a href="#recursos" className="font-display header-link">Recursos</a>
            <a href="#protocolo" className="font-display header-btn">Protocolo</a>
          </div>
        </nav>
      </header>

      {/* CONTENEDOR PRINCIPAL GRILLA */}
      <div className="grid-frame">

        {/* 1. HERO SECTION */}
        <section className="border-b-grid reveal" style={{ position: "relative", zIndex: 1, padding: "100px 24px 120px" }}>
          <span className="tech-label" style={{ marginBottom: "24px" }}>[ SEC. 01 ] — GUÍA PARA INSTITUCIONES</span>
          <h1 className="font-display" style={{ fontSize: "clamp(32px, 5vw, 68px)", lineHeight: 1.15, color: colors.textMain, maxWidth: "1000px", margin: "0 0 40px" }}>
            Recursos para prevenir y trabajar el grooming <span style={{ color: colors.brandBlue }}>desde el aula</span>
          </h1>
          
          <div className="grid-2 reveal delay-100" style={{ gap: "40px" }}>
            <p className="font-body" style={{ fontSize: "16px", lineHeight: 1.6, color: colors.textSec, margin: 0, maxWidth: "500px" }}>
              SAFENET ofrece materiales, orientaciones y propuestas concretas para abordar la prevención digital de forma pedagógica, profesional y segura, acompañando el rol docente.
            </p>
            <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", alignItems: "flex-start" }}>
              <a href="#recursos" className="btn-solid">
                Explorar Recursos
              </a>
              <a href="#como-usar" className="btn-outline">Cómo usar SAFENET</a>
            </div>
          </div>
        </section>

        {/* 2 & 3. CONTEXTO Y ROL DE LA ESCUELA */}
        <section className="border-b-grid grid-2 reveal" style={{ position: "relative", zIndex: 1 }}>
          {/* Columna Izquierda: Qué es */}
          <div className="border-r-md" style={{ padding: "60px 24px", background: colors.bgAlt }}>
            <span className="tech-label">[ SEC. 02 ] — DEFINICIÓN</span>
            <h2 className="font-display" style={{ fontSize: "24px", margin: "0 0 24px", letterSpacing: "1px" }}>El Problema</h2>
            <p className="font-body" style={{ fontSize: "16px", lineHeight: 1.7, color: colors.textSec, margin: "0 0 24px" }}>
              El grooming es el acoso y abuso sexual a niños, niñas y adolescentes a través de medios digitales. Comienza con una fase de manipulación y construcción de falsa confianza, buscando aislar a la víctima.
            </p>
            <p className="font-body" style={{ fontSize: "16px", lineHeight: 1.7, color: colors.textMain, fontWeight: 600, margin: 0 }}>
              Entender sus lógicas operativas es el primer paso metodológico para detectarlo a tiempo en el entorno escolar.
            </p>
          </div>

          {/* Columna Derecha: Por qué en la escuela */}
          <div style={{ padding: "60px 24px" }}>
            <span className="tech-label">[ SEC. 03 ] — FUNDAMENTACIÓN PEDAGÓGICA</span>
            <h2 className="font-display" style={{ fontSize: "24px", margin: "0 0 32px", letterSpacing: "1px" }}>El Rol Clave de la Escuela</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
              {razonesEscuela.map((item, idx) => (
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

        {/* 4. ORIENTACIONES PEDAGÓGICAS */}
        <section className="border-b-grid reveal" style={{ position: "relative", zIndex: 1, padding: "80px 24px" }}>
          <div className="grid-2" style={{ gap: "60px" }}>
            <div>
              <span className="tech-label">[ SEC. 04 ] — PAUTAS DE ABORDAJE</span>
              <h2 className="font-display" style={{ fontSize: "28px", margin: "0 0 24px", letterSpacing: "1px" }}>El tono de la clase</h2>
              <p className="font-body" style={{ fontSize: "16px", lineHeight: 1.7, color: colors.textSec, margin: 0 }}>
                El objetivo de hablar de grooming no es asustar, sino empoderar. Es fundamental adaptar el lenguaje a la edad del grupo, evitando los detalles escabrosos o el morbo. 
                <br/><br/>
                La meta es que los estudiantes entiendan los mecanismos de engaño y sepan que, si algo les incomoda en internet, <strong style={{ color: colors.textMain }}>no es su culpa</strong> y pueden recurrir a un adulto.
              </p>
            </div>
            <div style={{ borderLeft: `1px solid ${colors.line}`, paddingLeft: "32px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <div className="font-body" style={{ fontSize: "18px", fontStyle: "italic", color: colors.textMain, lineHeight: 1.6, borderLeft: `4px solid ${colors.accentLight}`, paddingLeft: "20px" }}>
                "Nunca pidas a los estudiantes que compartan experiencias personales de acoso frente a la clase. El trabajo áulico debe basarse en situaciones hipotéticas o casos simulados, como los de SAFENET."
              </div>
            </div>
          </div>
        </section>

        {/* 5. DECÁLOGO PARA LA COMUNIDAD EDUCATIVA */}
        <section id="decalogo" className="border-b-grid reveal" style={{ position: "relative", zIndex: 1, backgroundColor: colors.bgAlt }}>
          <div style={{ padding: "80px 24px", borderBottom: `1px solid ${colors.line}` }}>
            <span className="tech-label">[ SEC. 05 ] — MARCO DE ACCIÓN</span>
            <h2 className="font-display" style={{ fontSize: "36px", margin: "0", letterSpacing: "1px" }}>Decálogo para la comunidad educativa</h2>
            <p className="font-body" style={{ fontSize: "16px", color: colors.textSec, marginTop: "16px", maxWidth: "700px", lineHeight: 1.6 }}>
              Diez principios fundamentales promovidos a nivel nacional para la prevención, concientización y abordaje del grooming desde el entorno escolar.
            </p>
          </div>
          <div className="grid-2">
            {decalogo.map((item, idx) => (
              <div key={idx} className={`module-card border-r-md border-b-grid reveal delay-${(idx % 2) * 100}`} style={{ display: "flex", gap: "24px", alignItems: "flex-start" }}>
                <div className="font-display" style={{ fontSize: "28px", color: colors.brandBlue, opacity: 0.8, lineHeight: 1 }}>{item.num}</div>
                <p className="font-body" style={{ fontSize: "15px", lineHeight: 1.6, color: colors.textMain, margin: 0 }}>
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 6. RECURSOS EXTERNOS PARA DOCENTES */}
        <section id="recursos" className="border-b-grid" style={{ position: "relative", zIndex: 1 }}>
          <div className="reveal" style={{ padding: "80px 24px", borderBottom: `1px solid ${colors.line}` }}>
            <span className="tech-label">[ SEC. 06 ] — BIBLIOTECA EXTERNA</span>
            <h2 className="font-display" style={{ fontSize: "36px", margin: "0", letterSpacing: "1px" }}>Recursos Oficiales y Enlaces Útiles</h2>
            <p className="font-body" style={{ fontSize: "16px", color: colors.textSec, marginTop: "16px", maxWidth: "700px", lineHeight: 1.6 }}>
              Selección curada de materiales, guías y portales institucionales para profundizar en la prevención del grooming y acompañar la construcción de ciudadanía digital desde el aula.
            </p>
          </div>

          <div className="grid-2">
            {recursosBiblioteca.map((recurso, idx) => {
              const isHighlighted = recurso.highlighted;
              return (
                <div key={idx} className={`module-card border-r-md border-b-grid reveal delay-${(idx % 2) * 100} ${isHighlighted ? 'highlighted-card' : ''}`} style={{ display: "flex", flexDirection: "column", gap: "16px", alignItems: "flex-start" }}>
                  <span className="tech-label" style={{ marginBottom: "0", fontSize: "11px", color: isHighlighted ? colors.accentLight : colors.brandBlue, fontWeight: "bold" }}>
                    {recurso.cat}
                  </span>
                  
                  <h3 className="font-display" style={{ fontSize: "18px", margin: "0", letterSpacing: "0.5px", color: isHighlighted ? "#FFFFFF" : colors.textMain }}>
                    {recurso.title}
                  </h3>
                  
                  <p className="font-body" style={{ fontSize: "15px", lineHeight: 1.6, color: isHighlighted ? "rgba(255, 255, 255, 0.8)" : colors.textSec, margin: 0, flexGrow: 1 }}>
                    {recurso.desc}
                  </p>
                  
                  <div style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "10px", marginTop: "12px", borderTop: `1px solid ${isHighlighted ? 'rgba(255, 255, 255, 0.1)' : colors.line}`, paddingTop: "20px" }}>
                    <span className="font-body" style={{ fontSize: "12px", color: isHighlighted ? "rgba(255, 255, 255, 0.6)" : colors.textSec, letterSpacing: "0.5px", textTransform: "uppercase" }}>
                      Fuente: <strong style={{ color: isHighlighted ? "#FFFFFF" : colors.textMain }}>{recurso.fuente}</strong>
                    </span>
                    
                    <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                      <button 
                        onClick={() => copyToClipboard(recurso.url, idx)}
                        className={`btn-icon-copy ${copiedIndex === idx ? 'copied' : ''} ${isHighlighted ? 'btn-icon-dark' : ''}`}
                        title="Copiar enlace"
                      >
                        {copiedIndex === idx ? (
                          <>✓ Copiado</>
                        ) : (
                          <>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                            Copiar
                          </>
                        )}
                      </button>
                      <a href={recurso.url} target="_blank" rel="noopener noreferrer" className="font-body" style={{ color: isHighlighted ? colors.accentLight : colors.brandBlue, fontSize: "13px", fontWeight: "bold", textDecoration: "none", textTransform: "uppercase", letterSpacing: "1px", display: "inline-flex", alignItems: "center", gap: "6px" }}
                        onMouseOver={(e) => e.currentTarget.style.color = colors.alert}
                        onMouseOut={(e) => e.currentTarget.style.color = isHighlighted ? colors.accentLight : colors.brandBlue}
                      >
                        {recurso.cta}
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Subsección: SAFENET en el aula (Ahora integrada al final de la biblioteca) */}
          <div id="como-usar" className="reveal" style={{ padding: "60px 24px", backgroundColor: colors.bgAlt }}>
            <h3 className="font-display" style={{ fontSize: "24px", margin: "0 0 12px", color: colors.textMain }}>Modelos de aplicación en clase</h3>
            <p className="font-body" style={{ fontSize: "16px", color: colors.textSec, margin: "0 0 40px" }}>
              Usa SAFENET en el aula y logra que los alumnos aprendan actuando.
            </p>
            <div className="grid-2" style={{ gap: "24px" }}>
              {comoUsar.map((item, idx) => (
                <div key={idx} className={`module-card reveal delay-${idx * 100}`} style={{ background: "#FFFFFF", border: `1px solid ${colors.line}`, padding: "32px", borderRadius: "8px" }}>
                  <div className="tech-label" style={{ color: colors.brandBlue }}>Módulo {idx + 1}</div>
                  <h4 className="font-display" style={{ fontSize: "20px", margin: "0 0 16px", letterSpacing: "0.5px" }}>{item.fase}</h4>
                  <p className="font-body" style={{ fontSize: "15px", lineHeight: 1.6, color: colors.textSec, margin: "0 0 24px", flexGrow: 1 }}>{item.desc}</p>
                  
                  {/* Botón interactivo actualizado */}
                  <a href={item.url} className="font-body" style={{ 
                      display: "inline-flex", alignItems: "center", gap: "6px", 
                      border: `1px solid ${colors.warning}`, color: colors.textMain, 
                      padding: "8px 16px", fontSize: "12px", textTransform: "uppercase", 
                      letterSpacing: "1px", borderRadius: "4px", textDecoration: "none", 
                      fontWeight: "bold", transition: "all 0.3s ease", marginTop: "auto"
                    }}
                    onMouseOver={(e) => { e.currentTarget.style.backgroundColor = colors.warning; e.currentTarget.style.color = '#FFFFFF'; }}
                    onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = colors.textMain; }}
                  >
                    {item.tipo}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 7 & 8. PROTOCOLO Y CRITERIOS */}
        <section id="protocolo" className="border-b-grid reveal" style={{ position: "relative", zIndex: 1, backgroundColor: colors.textMain, color: "#FFFFFF" }}>
          
          <div className="grid-2">
            {/* Protocolo de Acción */}
            <div className="border-r-md" style={{ padding: "80px 24px", borderColor: "rgba(216, 227, 236, 0.1)" }}>
              <span className="tech-label reveal delay-100" style={{ color: colors.accentLight }}>[ SEC. 07 ] — ACCIÓN INMEDIATA</span>
              <h2 className="font-display reveal delay-100" style={{ fontSize: "32px", margin: "0 0 40px", color: "#FFFFFF", letterSpacing: "1px" }}>Qué hacer ante una sospecha o relato</h2>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
                {protocoloPasos.map((paso, idx) => (
                  <div key={idx} className={`reveal delay-${(idx + 2) * 100}`} style={{ display: "flex", gap: "24px", padding: "24px 0", borderBottom: idx !== protocoloPasos.length -1 ? "1px solid rgba(216, 227, 236, 0.1)" : "none" }}>
                    <div className="font-display" style={{ fontSize: "20px", color: colors.accentLight }}>{paso.step}</div>
                    <div>
                      <h3 className="font-display" style={{ fontSize: "16px", color: "#FFFFFF", margin: "0 0 8px", letterSpacing: "0.5px" }}>{paso.title}</h3>
                      <p className="font-body" style={{ fontSize: "15px", lineHeight: 1.6, color: "#FFFFFF", margin: 0 }}>{paso.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Criterios Básicos / Límites */}
            <div style={{ padding: "80px 24px" }}>
              <span className="tech-label reveal delay-100" style={{ color: colors.accentLight }}>[ SEC. 08 ] — LÍMITES INSTITUCIONALES</span>
              <h2 className="font-display reveal delay-100" style={{ fontSize: "32px", margin: "0 0 40px", color: "#FFFFFF", letterSpacing: "1px" }}>Lo que NO se debe hacer</h2>
              
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "20px" }}>
                {criteriosBasicos.map((criterio, idx) => (
                  <li key={idx} className={`reveal delay-${(idx + 2) * 100}`} style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={colors.accentLight} strokeWidth="2" style={{ flexShrink: 0, marginTop: "2px" }}>
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                    <p className="font-body" style={{ fontSize: "16px", lineHeight: 1.6, color: "#FFFFFF", margin: 0 }}>{criterio}</p>
                  </li>
                ))}
              </ul>

              <div className="reveal delay-300" style={{ marginTop: "60px", padding: "24px", border: `1px solid rgba(255, 255, 255, 0.15)`, background: "rgba(255, 255, 255, 0.03)", borderRadius: "4px" }}>
                <p className="font-body" style={{ fontSize: "14px", lineHeight: 1.6, color: "#FFFFFF", margin: 0, fontStyle: "italic" }}>
                  "El abordaje debe ser siempre institucional. La protección del estudiante y la preservación de evidencia son prioridades absolutas por sobre la investigación individual."
                </p>
              </div>
            </div>
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

      {/* BOTÓN FLOTANTE (FAB) */}
      <button className="fab-btn" onClick={handleDownloadClick}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
          <polyline points="7 10 12 15 17 10"></polyline>
          <line x1="12" y1="15" x2="12" y2="3"></line>
        </svg>
        Descargar Guía Rápida
      </button>

      {/* TOAST DE NOTIFICACIÓN */}
      <div className="toast-notification">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={colors.accentLight} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
        {toastMessage}
      </div>

    </main>
  );
}