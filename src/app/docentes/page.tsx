"use client";

import React, { useEffect, useRef, useState } from "react";
// import { trackWorldEntry } from "@/lib/tracking"; // Descomentar en entorno real

/* ============================================================
   PALETA — SAFENET (idéntica al mundo familias y al home)
   ============================================================ */
const C = {
  white: "#FFFFFF",
  bgSoft: "#F8FAFC",
  blueSoft: "#EEF6FB",
  sectionBlue: "#E5EBFA",
  blueLight: "#DDF3FA",
  blue: "#0B5CFF",
  blueDark: "#061538",
  blueDeep: "#102A43",
  textMute: "#5B6B7A",
  line: "#D8E3EC",
  warm: "#FF8A5B",
  alert: "#E63946",
};

/* ============================================================
   ICONOS SVG
   ============================================================ */
type IconProps = { size?: number; color?: string; strokeWidth?: number };

const IconShield = ({ size = 22, color = C.blue, strokeWidth = 2 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="M9 12l2 2 4-4" />
  </svg>
);

const IconBook = ({ size = 22, color = C.blue, strokeWidth = 2 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
);

const IconUsers = ({ size = 22, color = C.blue, strokeWidth = 2 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const IconCompass = ({ size = 22, color = C.blue, strokeWidth = 2 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <circle cx="12" cy="12" r="10" />
    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
  </svg>
);

const IconHeart = ({ size = 22, color = C.blue, strokeWidth = 2 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const IconArrowRight = ({ size = 14, color = "currentColor", strokeWidth = 2.4 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const IconCopy = ({ size = 14, color = "currentColor", strokeWidth = 2 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

const IconCheck = ({ size = 14, color = "currentColor", strokeWidth = 2.6 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const IconExternal = ({ size = 12, color = "currentColor", strokeWidth = 2.2 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

const IconDownload = ({ size = 18, color = C.white, strokeWidth = 2 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

const IconAlert = ({ size = 20, color = C.warm, strokeWidth = 2 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const IconX = ({ size = 16, color = "currentColor", strokeWidth = 2.4 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

/* ============================================================
   NAVBAR
   ============================================================ */
function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 16);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeMenu = () => setOpen(false);

  return (
    <header className={`site-nav ${scrolled ? "is-scrolled" : ""}`}>
      <nav className="nav-inner" aria-label="Navegación principal">
        <a href="/" className="nav-logo" onClick={closeMenu}>
          SAFENET
        </a>

        <div className="nav-links" aria-label="Secciones del mundo docentes">
          <a href="/" className="nav-link">Inicio</a>
          <a href="#escuela" className="nav-link">Escuela</a>
          <a href="#recursos" className="nav-link">Recursos</a>
          <a href="#protocolo" className="nav-link">Protocolo</a>
        </div>

        <a href="#recursos" className="nav-cta">
          Guía docente
        </a>

        <button
          type="button"
          className="nav-burger"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
          onClick={() => setOpen((current) => !current)}
        >
          <span /><span /><span />
        </button>
      </nav>

      {open && (
        <div className="nav-mobile">
          <a href="/" onClick={closeMenu}>Inicio</a>
          <a href="#escuela" onClick={closeMenu}>Escuela</a>
          <a href="#recursos" onClick={closeMenu}>Recursos</a>
          <a href="#protocolo" onClick={closeMenu}>Protocolo</a>
          <a href="#recursos" className="nav-cta-mobile" onClick={closeMenu}>
            Guía docente
          </a>
        </div>
      )}
    </header>
  );
}

/* ============================================================
   PÁGINA PRINCIPAL
   ============================================================ */
export default function DocentesPage() {
  /* useEffect(() => { trackWorldEntry("docentes"); }, []); */

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  /* ---------- DATOS ---------- */

  const kitDocente = [
    { num: "01", title: "Prevención", text: "Anticipar señales y construir ciudadanía digital antes de la crisis." },
    { num: "02", title: "Aula", text: "Recursos y dinámicas listas para llevar al aula con cualquier grupo." },
    { num: "03", title: "Criterio", text: "Lineamientos institucionales para sostener un abordaje serio." },
    { num: "04", title: "Acompañar", text: "Escuchar, contener y activar el protocolo sin investigar solo." },
  ];

  const razonesEscuela = [
    {
      num: "01",
      title: "Espacio de confianza",
      text: "La escuela es, muchas veces, el primer o único lugar seguro donde un estudiante puede dar señales de alerta o pedir ayuda frente a un abuso digital.",
    },
    {
      num: "02",
      title: "Prevención no es alarmar",
      text: "Se trata de educar. Construir ciudadanía digital, fomentar el pensamiento crítico y enseñar sobre privacidad sin usar el miedo como recurso.",
    },
    {
      num: "03",
      title: "Criterio institucional",
      text: "El docente no actúa solo. Trabajar el tema desde la escuela permite activar protocolos y redes de contención de forma articulada.",
    },
  ];

  const comoUsar = [
    {
      fase: "Mundo Niños",
      nivel: "Primaria",
      tipo: "Juego exploratorio",
      desc: "Uso de metáforas visuales. Exploración guiada para identificar qué es un 'secreto malo' y quién es un adulto de confianza.",
      url: "/ninos",
    },
    {
      fase: "Mundo Adolescentes",
      nivel: "Secundaria",
      tipo: "Simulación y debate",
      desc: "Simulación de interfaces reales. Toma de decisiones ante situaciones de exposición, presión y contacto con desconocidos.",
      url: "/adolescentes",
    },
  ];

  const tonoCriterios = [
    "No usar el miedo: el objetivo es entrenar criterio, no asustar.",
    "No culpar nunca a la víctima por confiar o por compartir.",
    "No pedir relatos personales en clase: trabajar con casos hipotéticos.",
    "Abrir preguntas en lugar de cerrar respuestas únicas.",
    "Construir confianza para que pedir ayuda no se asocie con castigo.",
  ];

  const decalogo = [
    { num: "01", text: "Es fundamental el trabajo de la comunidad educativa para prevenir el grooming. La visibilización temprana puede evitar que se agrave la situación, evitar abusos y que se sumen víctimas." },
    { num: "02", text: "Trabajar con los niños, niñas y adolescentes la noción de privacidad y exposición en Internet." },
    { num: "03", text: "Trabajar con los niños, niñas y adolescentes sobre las nociones de lo privado y lo público, los vínculos y las formas de interacción online y offline." },
    { num: "04", text: "La escuela debe promover que los niños, niñas y adolescentes adquieran herramientas que les permitan hacer un uso responsable de internet, trabajando la importancia de configurar opciones de privacidad." },
    { num: "05", text: "Trabajar sobre la importancia de valorar y respetar la intimidad propia y la ajena, la exposición del cuerpo en las redes sociales y las prácticas basadas en estereotipos de género." },
    { num: "06", text: "Promover el diálogo y la reflexión crítica acerca de las formas de vincularnos, tanto en internet como fuera de este espacio." },
    { num: "07", text: "Promover el diálogo con los niños, niñas y adolescentes acerca de los consumos en internet, las interacciones que tienen y los modos en los que pueden evitar situaciones de riesgo." },
    { num: "08", text: "Trabajar para que los niños, niñas y adolescentes conozcan sus derechos y responsabilidades, fortaleciendo la convivencia digital." },
    { num: "09", text: "La comunidad educativa debe brindar espacios de diálogo donde se promueva el debate sobre las formas de relacionarnos tanto en las redes como fuera de ellas." },
    { num: "10", text: "El grooming es un delito. Si el docente toma conocimiento o sospecha de una situación así debe informar al equipo de conducción de la escuela, contener al niño, niña o adolescente y en ningún caso minimizar o exponer lo que ocurre. Se aconseja comunicarse con la familia, acompañarla, brindarle herramientas para que pueda hacer frente a la situación y hacer un seguimiento de la problemática." },
  ];

  const recursosBiblioteca = [
    {
      cat: "Guía pedagógica",
      title: "Desafíos para la construcción de una ciudadanía digital",
      desc: "No se limita a definir grooming: incluye el lugar de la escuela, enfoque de trabajo, factores de riesgo y orientaciones para la intervención.",
      fuente: "Min. de Educación / Argentina.gob.ar",
      url: "https://www.argentina.gob.ar/educacion/progresar/progresar-es-para-vos/aprende/ciudadania-digital",
      cta: "Abrir recurso",
      featured: true,
    },
    {
      cat: "Guía integral",
      title: "Guía de sensibilización sobre convivencia digital",
      desc: "Trabaja huella digital, ciberbullying, sexting, grooming, responsabilidad escolar, rol del adulto, denuncias y ciudadanía digital.",
      fuente: "UNICEF Argentina y Faro Digital",
      url: "https://www.unicef.org/argentina/informes/guia-de-sensibilizacion-sobre-convivencia-digital",
      cta: "Abrir recurso",
      featured: false,
    },
    {
      cat: "Material de sensibilización",
      title: "Convivencia Digital en la Adolescencia",
      desc: "Propone 10 acciones individuales y colectivas para prevenir la violencia digital, con ideas para campañas y charlas.",
      fuente: "Min. Público Tutelar CABA + UNICEF",
      url: "https://www.unicef.org/argentina/media/26526/file/GUIA%20de%20Convivencia%20Digital%20en%20la%20Adolescencia.pdf.pdf",
      cta: "Abrir recurso",
      featured: false,
    },
    {
      cat: "Artículo educativo",
      title: "Cuidados y seguridad al utilizar redes sociales",
      desc: "Trabaja sobre Instagram y TikTok: cuentas falsas, mensajes de desconocidos, privacidad y su vínculo con riesgos como el grooming.",
      fuente: "Educ.ar / Secretaría de Educación",
      url: "https://www.educ.ar/buscador?q=Cuidados+y+seguridad+al+utilizar+redes+sociales",
      cta: "Abrir recurso",
      featured: true,
    },
    {
      cat: "Libro electrónico",
      title: "Conflictos 3.0: malentendidos en las redes",
      desc: "Propone trabajar la convivencia digital como parte de la convivencia escolar y pensar qué desafíos traen las redes en la escuela.",
      fuente: "Educ.ar / Programa de Convivencia Escolar",
      url: "https://www.educ.ar/recursos/158336/conflictos-3-0-malentendidos-en-la-redes",
      cta: "Abrir recurso",
      featured: false,
    },
    {
      cat: "Guía de acompañamiento",
      title: "Acompañamiento a las adolescencias en entornos digitales",
      desc: "Incluye privacidad en redes, señales para identificar posibles situaciones de grooming y una mirada centrada en el cuidado y el diálogo.",
      fuente: "SENAF + Faro Digital",
      url: "https://farodigital.org/guia-de-acompanamiento-de-adolescencias-en-entornos-digitales/",
      cta: "Abrir recurso",
      featured: false,
    },
    {
      cat: "Telefilm documental",
      title: "Grooming",
      desc: "Telefilm que mezcla ficción, documental y videodanza para abordar el acoso sexual en medios digitales. Ideal como disparador en clase.",
      fuente: "Canal Encuentro + UNICEF Argentina",
      url: "https://www.unicef.org/argentina/comunicados-prensa/canal-encuentro-estrena-grooming",
      cta: "Ver video",
      featured: false,
    },
    {
      cat: "Campaña de concientización",
      title: "Campaña prevención Grooming - PDI",
      desc: "Video de campaña de la Policía de Investigaciones (PDI) para la prevención del grooming, orientado a concientizar a niños, adolescentes y adultos sobre los riesgos del acoso sexual en línea.",
      fuente: "PDI",
      url: "https://www.youtube.com/watch?v=c1dEKmA8vVw",
      cta: "Ver video",
      featured: false,
    },
    {
      cat: "Campaña de concientización",
      title: "#ElGroomingEsUnDelito",
      desc: "Video de la campaña de UNICEF Argentina junto a Movistar para concientizar sobre el grooming: qué es, por qué es un delito y cómo proteger a niños y adolescentes en entornos digitales.",
      fuente: "UNICEF Argentina + Movistar",
      url: "https://www.youtube.com/watch?v=LxfcvzgKmUs",
      cta: "Ver video",
      featured: true,
    },
  ];

  const protocoloPasos = [
    { step: "01", title: "Escuchar y contener", text: "Recibir la situación con seriedad, sin minimizar. No forzar detalles ni interrogar." },
    { step: "02", title: "Registrar sin exponer", text: "Evitar intervenciones públicas. Manejar la información con estricta reserva y registrar lo relevante." },
    { step: "03", title: "Preservar evidencia", text: "Indicar no borrar chats ni perfiles, pero no manipular los dispositivos del estudiante." },
    { step: "04", title: "Activar canales institucionales", text: "Avisar a dirección/gabinete siguiendo el protocolo de la escuela. No actuar solo." },
  ];

  const criteriosBasicos = [
    "No contactar al presunto agresor bajo ninguna circunstancia.",
    "No revictimizar pidiendo que el estudiante repita su historia múltiples veces.",
    "No prometer confidencialidad absoluta: ante riesgo de vida o integridad, el adulto debe intervenir.",
    "Derivar la contención psicológica a profesionales habilitados, no sostenerla a solas.",
  ];

  /* ---------- HANDLERS ---------- */

  const copyToClipboard = (text: string, idx: number) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.top = "-1000px";
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand("copy");
      setCopiedIndex(idx);
      setToastMessage("Enlace copiado al portapapeles");
      window.setTimeout(() => setCopiedIndex(null), 2000);
      window.setTimeout(() => setToastMessage(null), 2400);
    } catch (err) {
      console.error("Error al copiar", err);
    }
    document.body.removeChild(textArea);
  };

  const handleDownloadClick = () => {
    setToastMessage("Generando guía rápida...");
    window.setTimeout(() => {
      setToastMessage("Descarga simulada completada");
      window.setTimeout(() => setToastMessage(null), 2400);
    }, 1400);
  };

  /* ---------- EFECTOS ---------- */

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("active");
        });
      },
      { threshold: 0.12 }
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  /* ============================================================
     RENDER
     ============================================================ */

  return (
    <main className="docentes-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Space+Grotesk:wght@500;600;700;800;900&display=swap');

        html { scroll-behavior: smooth; }
        body { margin: 0; background: ${C.bgSoft}; -webkit-font-smoothing: antialiased; }
        * { box-sizing: border-box; }

        .docentes-page {
          min-height: 100vh;
          color: ${C.blueDeep};
          background: ${C.bgSoft};
          font-family: 'Inter', sans-serif;
          overflow-x: hidden;
          position: relative;
        }

        .docentes-page a { color: inherit; }

        .spotlight-light {
          position: fixed;
          inset: 0;
          z-index: 1;
          pointer-events: none;
          background: radial-gradient(circle 520px at var(--x) var(--y), rgba(11, 92, 255, 0.035), transparent 72%);
        }

        .page-layer { position: relative; z-index: 2; }

        /* ---------- NAVBAR ---------- */
        .site-nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 80;
          background: rgba(255,255,255,0.94);
          backdrop-filter: blur(18px);
          transition: box-shadow .25s ease, background .25s ease;
        }
        .site-nav.is-scrolled {
          background: rgba(255,255,255,0.98);
          box-shadow: 0 10px 30px -24px rgba(6,21,56,.24);
        }
        .nav-inner {
          width: min(1280px, calc(100% - 64px));
          height: 58px;
          margin: 0 auto;
          display: flex; align-items: center; justify-content: space-between;
          gap: 32px;
        }
        .nav-logo {
          font-family: 'Space Grotesk', 'Inter', sans-serif;
          font-size: 22px; line-height: 1; color: ${C.blueDark};
          font-weight: 700; letter-spacing: 1.6px;
          text-decoration: none; white-space: nowrap;
        }
        .nav-links {
          display: flex; align-items: center; justify-content: center;
          gap: 36px; flex: 1;
        }
        .nav-link {
          position: relative;
          font-size: 13.5px; font-weight: 700;
          color: ${C.blueDeep}; text-decoration: none;
          transition: color .2s ease;
        }
        .nav-link::after {
          content: ""; position: absolute;
          left: 0; bottom: -7px; width: 0; height: 2px;
          background: ${C.blue}; border-radius: 999px;
          transition: width .25s ease;
        }
        .nav-link:hover { color: ${C.blue}; }
        .nav-link:hover::after { width: 100%; }

        .nav-cta, .nav-cta-mobile, .btn-primary {
          display: inline-flex; align-items: center; justify-content: center;
          gap: 10px;
          background: ${C.blue}; color: ${C.white} !important;
          border: 1px solid ${C.blue};
          text-decoration: none; text-transform: uppercase;
          font-size: 12px; font-weight: 800; letter-spacing: 1.4px;
          border-radius: 999px;
          box-shadow: 0 8px 22px rgba(11,92,255,.22);
          transition: transform .25s ease, box-shadow .25s ease, background .25s ease;
          white-space: nowrap;
        }
        .nav-cta { padding: 12px 22px; }
        .nav-cta:hover, .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 14px 30px rgba(11,92,255,.28);
        }

        .nav-burger {
          display: none; width: 42px; height: 42px;
          border: 1px solid ${C.line}; border-radius: 999px;
          background: ${C.white}; cursor: pointer; padding: 0;
        }
        .nav-burger span {
          display: block; width: 18px; height: 2px; margin: 4px auto;
          border-radius: 999px; background: ${C.blueDark};
        }
        .nav-mobile { display: none; width: min(1280px, calc(100% - 48px)); margin: 0 auto; padding: 10px 0 22px; }
        .nav-mobile a {
          display: block; padding: 13px 0;
          color: ${C.blueDeep}; text-decoration: none; font-weight: 700;
        }
        .nav-cta-mobile { margin-top: 14px; padding: 14px 22px !important; color: ${C.white} !important; }

        /* ---------- LAYOUT BASE ---------- */
        .grid-frame {
          width: min(1280px, calc(100% - 64px));
          max-width: 1200px;
          margin: 0 auto;
          position: relative;
        }
        .section-pad { padding: 92px 0; }
        .section-pad-sm { padding: 72px 0; }

        .eyebrow {
          display: inline-flex; align-items: center; gap: 10px;
          color: ${C.blue}; text-transform: uppercase;
          font-size: 12px; font-weight: 800; letter-spacing: 2.1px;
          margin-bottom: 22px;
        }
        .eyebrow::before { content: ""; width: 28px; height: 1px; background: currentColor; }

        .title-xl, .title-lg, .title-md {
          font-family: 'Space Grotesk', 'Inter', sans-serif;
          color: ${C.blueDark}; text-transform: uppercase; margin: 0;
        }
        .title-xl { font-size: clamp(42px, 5vw, 74px); line-height: 1.02; letter-spacing: -2.2px; font-weight: 700; }
        .title-lg { font-size: clamp(30px, 3.4vw, 48px); line-height: 1.05; letter-spacing: -1.4px; font-weight: 700; }
        .title-md { font-size: clamp(22px, 2.3vw, 32px); line-height: 1.12; letter-spacing: -0.8px; font-weight: 700; }
        .accent { color: ${C.blue}; }

        .lead {
          color: ${C.blueDeep}; font-size: 16px; line-height: 1.72;
          margin: 0; max-width: 660px; font-weight: 500;
        }
        .muted { color: ${C.textMute}; font-size: 14.5px; line-height: 1.65; margin: 0; font-weight: 500; }

        .btn-row { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; }
        .btn-primary { padding: 15px 26px; }
        .btn-secondary {
          display: inline-flex; align-items: center; justify-content: center; gap: 10px;
          border: 1px solid ${C.line}; background: ${C.white};
          color: ${C.blueDark}; text-decoration: none; text-transform: uppercase;
          font-size: 12px; font-weight: 800; letter-spacing: 1.4px;
          border-radius: 999px; padding: 15px 24px;
          transition: transform .25s ease, border-color .25s ease, color .25s ease, box-shadow .25s ease;
        }
        .btn-secondary:hover {
          transform: translateY(-2px);
          border-color: rgba(11,92,255,.36);
          color: ${C.blue};
          box-shadow: 0 12px 28px -22px rgba(6,21,56,.3);
        }

        .reveal { opacity: 0; transform: translateY(26px); transition: opacity .85s cubic-bezier(.16,1,.3,1), transform .85s cubic-bezier(.16,1,.3,1); }
        .reveal.active { opacity: 1; transform: translateY(0); }
        .delay-100 { transition-delay: 100ms; }
        .delay-200 { transition-delay: 200ms; }
        .delay-300 { transition-delay: 300ms; }
        .delay-400 { transition-delay: 400ms; }

        /* ---------- HERO ---------- */
        .hero { position: relative; padding: 128px 0 88px; background: ${C.white}; overflow: hidden; }
        .hero-inner {
          width: min(1280px, calc(100% - 64px));
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(420px, .92fr);
          gap: 72px;
          align-items: center;
          position: relative; z-index: 2;
        }
        .hero-copy { max-width: 680px; }
        .hero .lead { margin-top: 28px; margin-bottom: 34px; max-width: 560px; }
        .hero-note {
          margin-top: 26px;
          display: inline-flex; align-items: flex-start; gap: 10px;
          max-width: 520px;
          padding: 14px 16px;
          border: 1px solid ${C.line}; border-radius: 16px; background: ${C.white};
          color: ${C.textMute};
          font-size: 12px; line-height: 1.55; font-weight: 800; letter-spacing: .6px;
          text-transform: uppercase;
          box-shadow: 0 16px 40px -30px rgba(6,21,56,.26);
        }
        .hero-note svg { flex: 0 0 auto; margin-top: 2px; }

        .kit-panel {
          position: relative;
          padding: 28px;
          border-radius: 28px;
          background: ${C.white};
          border: 1px solid ${C.line};
          box-shadow: 0 28px 70px -46px rgba(6,21,56,.42);
          overflow: hidden;
        }
        .kit-panel::before {
          content: ""; position: absolute;
          left: 28px; right: 28px; top: 0;
          height: 3px; border-radius: 0 0 999px 999px;
          background: ${C.blue};
        }
        .kit-head {
          display: flex; align-items: center; justify-content: space-between;
          gap: 20px; margin-bottom: 22px;
        }
        .kit-kicker { color: ${C.blue}; text-transform: uppercase; font-size: 10.5px; font-weight: 900; letter-spacing: 1.6px; margin-bottom: 6px; }
        .kit-title { font-family: 'Space Grotesk', 'Inter', sans-serif; color: ${C.blueDark}; font-size: 20px; line-height: 1.05; font-weight: 700; margin: 0; text-transform: uppercase; letter-spacing: -.45px; }
        .kit-status {
          display: inline-flex; align-items: center; justify-content: center;
          width: 54px; height: 54px; flex: 0 0 auto;
          border-radius: 18px;
          background: ${C.blueSoft}; border: 1px solid ${C.line};
        }
        .kit-grid {
          display: grid; grid-template-columns: 1fr 1fr; gap: 12px;
        }
        .kit-cell {
          padding: 16px;
          border: 1px solid ${C.line}; border-radius: 18px;
          background: ${C.white};
        }
        .kit-cell-num {
          display: inline-flex; width: 30px; height: 30px;
          align-items: center; justify-content: center;
          border-radius: 9px; background: ${C.blue}; color: ${C.white};
          font-size: 10px; font-weight: 900; letter-spacing: .9px;
          margin-bottom: 12px;
        }
        .kit-cell h3 { margin: 0 0 4px; color: ${C.blueDark}; font-size: 13.5px; font-weight: 850; letter-spacing: .1px; text-transform: uppercase; font-family: 'Space Grotesk', 'Inter', sans-serif; }
        .kit-cell p { margin: 0; color: ${C.textMute}; font-size: 12.5px; line-height: 1.45; font-weight: 500; }

        /* ---------- PANEL EDITORIAL AZUL (Rol de la escuela & Protocolo) ---------- */
        .editorial-section { background: ${C.white}; padding: 18px 0; }
        .editorial-panel {
          position: relative; overflow: hidden;
          border: 1px solid rgba(255,255,255,.22);
          border-radius: 30px;
          background:
            radial-gradient(circle at 14% 10%, rgba(255,255,255,.18), transparent 34%),
            linear-gradient(135deg, #005BFF 0%, #0746D8 48%, #061538 100%);
          padding: 58px;
          box-shadow: 0 34px 86px -58px rgba(6,21,56,.56);
        }
        .editorial-panel::before {
          content: ""; position: absolute; inset: 0;
          pointer-events: none;
          background: radial-gradient(circle at 82% 22%, rgba(255,255,255,.16), transparent 28%);
        }
        .editorial-panel > * { position: relative; z-index: 2; }
        .editorial-panel .eyebrow { color: ${C.white}; }
        .editorial-panel .eyebrow::before { background: rgba(255,255,255,.82); }

        .editorial-head {
          display: grid;
          grid-template-columns: minmax(0, 1.05fr) minmax(320px, .72fr);
          gap: 56px; align-items: end; margin-bottom: 34px;
        }
        .editorial-head .title-lg {
          max-width: 760px;
          font-size: clamp(32px, 3.7vw, 54px);
          line-height: 1.04; letter-spacing: -1.7px;
          color: ${C.white};
        }

        .editorial-key-card {
          padding: 24px; border-radius: 24px;
          background: rgba(255,255,255,.12);
          border: 1px solid rgba(255,255,255,.22);
          box-shadow: 0 24px 54px -44px rgba(0,0,0,.45);
          backdrop-filter: blur(14px);
        }
        .editorial-key-label {
          display: block; margin-bottom: 12px;
          color: rgba(255,255,255,.78);
          font-size: 11px; line-height: 1; font-weight: 900;
          letter-spacing: 1.9px; text-transform: uppercase;
        }
        .editorial-key-title {
          margin: 0 0 14px;
          font-family: 'Space Grotesk', 'Inter', sans-serif;
          color: ${C.white};
          font-size: 20px; line-height: 1.08; font-weight: 700;
          letter-spacing: -.35px; text-transform: uppercase;
        }
        .editorial-description {
          color: rgba(255,255,255,.92);
          font-size: 15.5px; line-height: 1.76; font-weight: 600;
          max-width: 500px; margin: 0;
        }

        .editorial-cards {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 18px;
        }
        .editorial-cards.cards-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
        .editorial-card {
          position: relative;
          min-height: 270px;
          padding: 26px;
          border: 1px solid rgba(216, 227, 236, .95);
          border-radius: 24px;
          background: ${C.white};
          box-shadow: 0 22px 54px -42px rgba(6,21,56,.52);
          transition: transform .25s ease, box-shadow .25s ease, border-color .25s ease;
        }
        .editorial-card:hover {
          transform: translateY(-3px);
          border-color: rgba(11,92,255,.24);
          box-shadow: 0 28px 62px -42px rgba(6,21,56,.58);
        }
        .editorial-card-num {
          display: inline-flex; margin-bottom: 24px;
          color: ${C.blue};
          font-family: 'Space Grotesk', 'Inter', sans-serif;
          font-size: 12px; font-weight: 800; letter-spacing: 1.7px;
        }
        .editorial-card-title {
          margin: 0 0 13px;
          font-family: 'Space Grotesk', 'Inter', sans-serif;
          color: ${C.blueDark};
          text-transform: uppercase;
          font-size: 17px; line-height: 1.18;
          letter-spacing: -.15px; font-weight: 700;
        }
        .editorial-card-text {
          margin: 0; color: ${C.textMute};
          font-size: 14px; line-height: 1.66; font-weight: 550;
        }

        /* ---------- CÓMO USAR SAFENET ---------- */
        .usar-section { background: ${C.white}; }
        .usar-header {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(320px, 520px);
          gap: 48px; align-items: end;
          margin-bottom: 44px;
        }
        .usar-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 22px;
        }
        .usar-card {
          position: relative;
          padding: 36px;
          background: ${C.white};
          border: 1px solid ${C.line};
          border-radius: 24px;
          box-shadow: 0 22px 54px -42px rgba(6,21,56,.32);
          display: flex; flex-direction: column;
          transition: transform .25s ease, box-shadow .25s ease, border-color .25s ease;
        }
        .usar-card:hover {
          transform: translateY(-4px);
          border-color: rgba(11,92,255,.24);
          box-shadow: 0 32px 70px -42px rgba(6,21,56,.42);
        }
        .usar-card-head {
          display: flex; align-items: center; justify-content: space-between;
          gap: 16px; margin-bottom: 22px;
        }
        .usar-level {
          display: inline-flex; align-items: center;
          padding: 6px 12px; border-radius: 999px;
          background: ${C.blueSoft};
          color: ${C.blue};
          font-size: 11px; font-weight: 900; letter-spacing: 1.4px;
          text-transform: uppercase;
        }
        .usar-tipo {
          color: ${C.textMute};
          font-size: 11px; font-weight: 800; letter-spacing: 1.3px;
          text-transform: uppercase;
        }
        .usar-card h3 {
          margin: 0 0 14px;
          font-family: 'Space Grotesk', 'Inter', sans-serif;
          color: ${C.blueDark};
          font-size: 24px; line-height: 1.1;
          letter-spacing: -.5px; font-weight: 700;
          text-transform: uppercase;
        }
        .usar-card p {
          margin: 0 0 28px;
          color: ${C.textMute};
          font-size: 15px; line-height: 1.65; font-weight: 500;
          flex-grow: 1;
        }
        .usar-card-cta {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 13px 22px; border-radius: 999px;
          background: ${C.white}; color: ${C.white};
          text-decoration: none;
          font-size: 11.5px; font-weight: 900; letter-spacing: 1.4px;
          text-transform: uppercase;
          align-self: flex-start;
          transition: transform .25s ease, background .25s ease;
        }
        .usar-card-cta:hover {
          background: ${C.blue};
          transform: translateY(-2px);
        }

        /* ---------- TONO DE LA CLASE ---------- */
        .tono-section { background: ${C.sectionBlue}; }
        .tono-card {
          background: ${C.white};
          border: 1px solid ${C.line};
          border-radius: 28px;
          padding: 56px;
          box-shadow: 0 30px 70px -50px rgba(6,21,56,.32);
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(320px, .9fr);
          gap: 48px;
          align-items: start;
        }
        .tono-card h2 { margin-bottom: 22px; }
        .tono-list { list-style: none; padding: 0; margin: 26px 0 0; display: flex; flex-direction: column; gap: 12px; }
        .tono-item {
          display: flex; align-items: flex-start; gap: 14px;
          padding: 14px 18px;
          background: ${C.bgSoft};
          border: 1px solid ${C.line};
          border-radius: 14px;
          color: ${C.blueDark};
          font-size: 14.5px; line-height: 1.55; font-weight: 600;
        }
        .tono-bullet {
          flex: 0 0 auto; width: 7px; height: 7px;
          border-radius: 50%; background: ${C.blue};
          margin-top: 8px;
        }
        .tono-idea {
          padding: 30px;
          border-radius: 22px;
          background: linear-gradient(135deg, #0746D8 0%, #061538 100%);
          color: ${C.white};
          box-shadow: 0 28px 64px -42px rgba(6,21,56,.55);
          position: relative; overflow: hidden;
        }
        .tono-idea::before {
          content: ""; position: absolute; inset: 0; pointer-events: none;
          background: radial-gradient(circle at 80% 0%, rgba(255,255,255,.18), transparent 50%);
        }
        .tono-idea > * { position: relative; z-index: 2; }
        .tono-idea-label {
          display: block; margin-bottom: 12px;
          color: rgba(255,255,255,.78);
          font-size: 11px; font-weight: 900; letter-spacing: 1.9px;
          text-transform: uppercase;
        }
        .tono-idea h3 {
          margin: 0 0 14px;
          font-family: 'Space Grotesk', 'Inter', sans-serif;
          color: ${C.white}; font-size: 22px; line-height: 1.15;
          letter-spacing: -.4px; font-weight: 700; text-transform: uppercase;
        }
        .tono-idea p { margin: 0; color: rgba(255,255,255,.92); font-size: 15px; line-height: 1.7; font-weight: 600; }

        /* ---------- DECÁLOGO ---------- */
        .decalogo-section { background: ${C.sectionBlue}; }
        .decalogo-header { max-width: 760px; margin-bottom: 44px; }
        .decalogo-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 18px;
        }
        .decalogo-item {
          position: relative;
          background: ${C.white};
          border: 1px solid ${C.line};
          border-radius: 22px;
          padding: 28px 30px;
          display: grid;
          grid-template-columns: auto 1fr;
          gap: 24px;
          align-items: start;
          box-shadow: 0 18px 50px -42px rgba(6,21,56,.36);
          transition: transform .25s ease, box-shadow .25s ease, border-color .25s ease;
        }
        .decalogo-item:hover {
          transform: translateY(-3px);
          border-color: rgba(11,92,255,.24);
          box-shadow: 0 26px 62px -42px rgba(6,21,56,.48);
        }
        .decalogo-num {
          font-family: 'Space Grotesk', 'Inter', sans-serif;
          color: ${C.blue};
          font-size: 38px; font-weight: 800;
          line-height: 1; letter-spacing: -1.4px;
          min-width: 56px;
        }
        .decalogo-text {
          margin: 0;
          color: ${C.blueDark};
          font-size: 14.5px; line-height: 1.62; font-weight: 500;
        }

        /* ---------- RECURSOS ---------- */
        .recursos-section { background: ${C.white}; }
        .recursos-header {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(320px, 520px);
          gap: 48px;
          align-items: end;
          margin-bottom: 44px;
        }
        .recursos-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }
        .recurso-card {
          position: relative;
          padding: 30px 32px;
          background: ${C.white};
          border: 1px solid ${C.line};
          border-radius: 22px;
          box-shadow: 0 18px 50px -42px rgba(6,21,56,.32);
          display: flex; flex-direction: column;
          transition: transform .25s ease, box-shadow .25s ease, border-color .25s ease;
        }
        .recurso-card:hover {
          transform: translateY(-3px);
          border-color: rgba(11,92,255,.22);
          box-shadow: 0 28px 62px -42px rgba(6,21,56,.42);
        }
        .recurso-card.is-featured {
          border-color: rgba(11,92,255,.32);
          background: linear-gradient(180deg, rgba(11,92,255,.04) 0%, rgba(11,92,255,0) 60%), ${C.white};
        }
        .recurso-card.is-featured::before {
          content: ""; position: absolute;
          left: 32px; right: 32px; top: 0;
          height: 3px; border-radius: 0 0 999px 999px;
          background: ${C.blue};
        }
        .recurso-cat {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 6px 12px; border-radius: 999px;
          background: ${C.blueSoft}; color: ${C.blue};
          font-size: 10.5px; font-weight: 900; letter-spacing: 1.3px;
          text-transform: uppercase;
          align-self: flex-start;
          margin-bottom: 18px;
        }
        .recurso-card h3 {
          margin: 0 0 12px;
          font-family: 'Space Grotesk', 'Inter', sans-serif;
          color: ${C.blueDark};
          font-size: 18px; line-height: 1.22;
          letter-spacing: -.2px; font-weight: 700;
          text-transform: uppercase;
        }
        .recurso-card p {
          margin: 0 0 22px;
          color: ${C.textMute};
          font-size: 14px; line-height: 1.6; font-weight: 500;
          flex-grow: 1;
        }
        .recurso-fuente {
          display: flex; align-items: center; gap: 8px;
          padding-top: 18px;
          border-top: 1px solid ${C.line};
          margin-bottom: 16px;
          color: ${C.textMute};
          font-size: 11.5px; font-weight: 700; letter-spacing: .3px;
        }
        .recurso-fuente strong { color: ${C.blueDark}; font-weight: 800; }
        .recurso-actions {
          display: flex; align-items: center; justify-content: space-between;
          gap: 12px; flex-wrap: wrap;
        }
        .btn-copy {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 9px 14px; border-radius: 999px;
          background: ${C.white};
          border: 1px solid ${C.line};
          color: ${C.textMute};
          font-size: 11px; font-weight: 800; letter-spacing: 1.1px;
          text-transform: uppercase;
          cursor: pointer; font-family: 'Inter', sans-serif;
          transition: all .2s ease;
        }
        .btn-copy:hover { color: ${C.blue}; border-color: rgba(11,92,255,.32); }
        .btn-copy.is-copied {
          background: ${C.blue}; border-color: ${C.blue}; color: ${C.white};
        }
        .recurso-open {
          display: inline-flex; align-items: center; gap: 8px;
          color: ${C.blue};
          font-size: 11.5px; font-weight: 900; letter-spacing: 1.3px;
          text-transform: uppercase;
          text-decoration: none;
          transition: gap .25s ease;
        }
        .recurso-open:hover { gap: 12px; }

        /* ---------- LO QUE NO SE DEBE HACER ---------- */
        .nohacer-section { background: ${C.white}; }
        .nohacer-card {
          background: ${C.bgSoft};
          border: 1px solid ${C.line};
          border-left: 4px solid ${C.warm};
          border-radius: 22px;
          padding: 44px 48px;
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(280px, .7fr);
          gap: 44px;
          align-items: center;
          box-shadow: 0 24px 60px -50px rgba(6,21,56,.32);
        }
        .nohacer-head {
          display: flex; align-items: center; gap: 12px;
          margin-bottom: 12px;
          color: ${C.warm};
          font-size: 11.5px; font-weight: 900; letter-spacing: 1.6px;
          text-transform: uppercase;
        }
        .nohacer-list { list-style: none; padding: 0; margin: 22px 0 0; display: flex; flex-direction: column; gap: 12px; }
        .nohacer-item {
          display: flex; align-items: flex-start; gap: 14px;
          padding: 16px 20px;
          border: 1px solid ${C.line};
          border-radius: 14px;
          background: ${C.white};
        }
        .nohacer-x {
          flex: 0 0 auto;
          width: 26px; height: 26px;
          border-radius: 8px;
          background: rgba(255,138,91,.12);
          color: ${C.warm};
          display: inline-flex; align-items: center; justify-content: center;
          margin-top: 1px;
        }
        .nohacer-item p {
          margin: 0;
          color: ${C.blueDark};
          font-size: 14.5px; line-height: 1.55; font-weight: 600;
        }
        .nohacer-quote {
          padding: 30px;
          border-radius: 20px;
          background: ${C.white};
          border: 1px solid ${C.line};
          color: ${C.blueDeep};
          font-size: 15px; line-height: 1.7; font-weight: 600;
          font-style: italic;
          position: relative;
        }
        .nohacer-quote::before {
          content: ""; position: absolute;
          left: 0; top: 24px; bottom: 24px;
          width: 3px; background: ${C.warm}; border-radius: 0 999px 999px 0;
        }

        /* ---------- FOOTER ---------- */
        .footer {
          background: linear-gradient(180deg, #0B1F4D 0%, #061538 100%);
          padding: 54px 0 30px;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
        }
        .footer-inner {
          width: min(1280px, calc(100% - 64px));
          max-width: 1200px; margin: 0 auto;
        }
        .footer-top {
          display: flex; justify-content: space-between; gap: 36px;
          align-items: flex-start; padding-bottom: 34px;
        }
        .footer-brand {
          font-family: 'Space Grotesk', 'Inter', sans-serif;
          font-size: 24px; color: ${C.white};
          font-weight: 700; letter-spacing: 1.7px;
          margin-bottom: 10px;
        }
        .footer-text {
          max-width: 420px; color: rgba(255,255,255,.68);
          font-size: 14px; line-height: 1.6; font-weight: 500; margin: 0;
        }
        .footer-links {
          display: flex; gap: 24px; flex-wrap: wrap; justify-content: flex-end;
        }
        .footer-links a {
          color: rgba(255,255,255,.85); text-decoration: none;
          text-transform: uppercase;
          font-size: 12px; font-weight: 900; letter-spacing: 1.3px;
          transition: color .2s ease;
        }
        .footer-links a:hover { color: ${C.white}; }
        .footer-bottom {
          display: flex; justify-content: space-between; gap: 20px; flex-wrap: wrap;
          padding-top: 26px;
          border-top: 1px solid rgba(255,255,255,.08);
          color: rgba(255,255,255,.55);
          font-size: 12.5px; font-weight: 600;
        }

        /* ---------- FAB & TOAST ---------- */
        .fab-btn {
          position: fixed; bottom: 28px; right: 28px; z-index: 90;
          display: inline-flex; align-items: center; gap: 10px;
          padding: 14px 22px;
          background: ${C.blue}; color: ${C.white};
          border: none; border-radius: 999px;
          font-family: 'Inter', sans-serif;
          font-size: 12px; font-weight: 800; letter-spacing: 1.3px;
          text-transform: uppercase;
          cursor: pointer;
          box-shadow: 0 18px 38px -14px rgba(11,92,255,.5);
          transition: transform .25s ease, box-shadow .25s ease;
        }
        .fab-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 24px 44px -14px rgba(11,92,255,.6);
        }

        .toast {
          position: fixed; left: 50%; transform: translateX(-50%);
          bottom: ${toastMessage ? "32px" : "-100px"};
          background: ${C.blueDark}; color: ${C.white};
          padding: 14px 22px; border-radius: 14px;
          font-size: 13px; font-weight: 700; letter-spacing: .2px;
          box-shadow: 0 22px 50px -16px rgba(6,21,56,.5);
          z-index: 200;
          display: inline-flex; align-items: center; gap: 10px;
          transition: bottom .35s cubic-bezier(.16,1,.3,1);
          border: 1px solid rgba(255,255,255,.12);
        }

        /* ---------- RESPONSIVE ---------- */
        @media (max-width: 1100px) {
          .hero-inner { grid-template-columns: 1fr; gap: 56px; }
          .editorial-head { grid-template-columns: 1fr; gap: 22px; align-items: start; }
          .editorial-panel { padding: 44px; }
          .editorial-cards { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .editorial-cards.cards-4 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .usar-header, .recursos-header { grid-template-columns: 1fr; gap: 22px; align-items: start; }
          .tono-card { grid-template-columns: 1fr; padding: 44px; gap: 32px; }
          .decalogo-grid { grid-template-columns: 1fr; }
          .nohacer-card { grid-template-columns: 1fr; gap: 32px; padding: 36px; }
        }

        @media (max-width: 880px) {
          .nav-inner { width: min(1280px, calc(100% - 48px)); height: 62px; }
          .nav-links, .nav-cta { display: none; }
          .nav-burger { display: block; }
          .nav-mobile { display: block; }
          .hero { padding-top: 112px; }
          .hero-inner, .grid-frame, .footer-inner {
            width: min(100% - 48px, 1280px);
          }
          .section-pad { padding: 72px 0; }
          .section-pad-sm { padding: 60px 0; }
          .editorial-panel { padding: 38px 28px; border-radius: 24px; }
          .footer-top { flex-direction: column; }
          .footer-links { justify-content: flex-start; }
          .usar-grid, .recursos-grid { grid-template-columns: 1fr; }
        }

        @media (max-width: 640px) {
          .title-xl { font-size: clamp(38px, 12vw, 54px); letter-spacing: -1.5px; }
          .hero-inner, .grid-frame, .footer-inner { width: min(100% - 32px, 1280px); }
          .hero { padding: 100px 0 58px; }
          .hero-inner { gap: 46px; }
          .section-pad { padding: 58px 0; }
          .section-pad-sm { padding: 52px 0; }
          .editorial-section { padding: 8px 0; }
          .editorial-panel { padding: 32px 20px; border-radius: 22px; }
          .editorial-head { margin-bottom: 26px; }
          .editorial-key-card { padding: 20px; border-radius: 20px; }
          .editorial-cards { grid-template-columns: 1fr; gap: 14px; }
          .editorial-cards.cards-4 { grid-template-columns: 1fr; }
          .editorial-card { padding: 22px; border-radius: 20px; }
          .kit-panel { padding: 22px; border-radius: 24px; }
          .kit-grid { grid-template-columns: 1fr; }
          .btn-row { flex-direction: column; align-items: stretch; }
          .btn-primary, .btn-secondary { width: 100%; }
          .tono-card { padding: 32px 24px; border-radius: 22px; }
          .decalogo-item { padding: 22px 24px; gap: 16px; }
          .decalogo-num { font-size: 30px; min-width: 42px; }
          .recurso-card { padding: 26px 24px; }
          .recurso-actions { flex-direction: column; align-items: stretch; }
          .recurso-open { justify-content: center; }
          .btn-copy { justify-content: center; }
          .nohacer-card { padding: 28px 24px; }
          .footer-bottom { flex-direction: column; }
          .fab-btn { right: 16px; bottom: 16px; padding: 12px 18px; font-size: 11px; }
        }
      `}</style>

      {/* Spotlight global */}
      <div
        className="spotlight-light"
        style={{ ["--x" as any]: `${mousePos.x}px`, ["--y" as any]: `${mousePos.y}px` } as React.CSSProperties}
      />

      <div className="page-layer">
        <Navbar />

        {/* ============================================================
            1. HERO
            ============================================================ */}
        <section className="hero" id="inicio">
          <div className="hero-inner">
            <div className="hero-copy reveal">
              <span className="eyebrow">Mundo docentes</span>
              <h1 className="title-xl">
                Recursos para prevenir el <span className="accent">grooming</span> desde el aula
              </h1>
              <p className="lead">
                SAFENET acompaña a docentes e instituciones con materiales,
                orientaciones pedagógicas y un protocolo claro para abordar el
                grooming con criterio, prevención y trabajo en red.
              </p>
              <div className="btn-row">
                <a href="#recursos" className="btn-primary">
                  Explorar recursos
                </a>
                <a href="#aula" className="btn-secondary">
                  Cómo usar SAFENET
                </a>
              </div>
              <div className="hero-note">
                <IconShield size={18} color={C.blue} />
                <span>
                  EL DOCENTE NO INVESTIGA SOLO: ACOMPAÑA, REGISTRA Y ACTIVA EL
                  PROTOCOLO INSTITUCIONAL.
                </span>
              </div>
            </div>

            <aside className="kit-panel reveal delay-100" aria-label="Kit docente SAFENET">
              <div className="kit-head">
                <div>
                  <div className="kit-kicker">Kit docente</div>
                  <h2 className="kit-title">Aula segura</h2>
                </div>
                <div className="kit-status">
                  <IconBook size={24} color={C.blue} />
                </div>
              </div>

              <div className="kit-grid">
                {kitDocente.map((item) => (
                  <div key={item.num} className="kit-cell">
                    <span className="kit-cell-num">{item.num}</span>
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </section>

        {/* ============================================================
            2. EL ROL CLAVE DE LA ESCUELA (panel azul editorial)
            ============================================================ */}
        <section className="editorial-section" id="escuela">
          <div className="grid-frame">
            <div className="editorial-panel reveal">
              <div className="editorial-head">
                <div>
                  <span className="eyebrow">Fundamentación pedagógica</span>
                  <h2 className="title-lg">
                    El rol clave de la escuela
                  </h2>
                </div>
                <div className="editorial-key-card">
                  <span className="editorial-key-label">La premisa</span>
                  <h3 className="editorial-key-title">Educar, no alarmar.</h3>
                  <p className="editorial-description">
                    La escuela trabaja la prevención desde la construcción de
                    ciudadanía digital, fortaleciendo la palabra del estudiante y
                    sosteniendo un abordaje institucional, nunca individual.
                  </p>
                </div>
              </div>

              <div className="editorial-cards">
                {razonesEscuela.map((item, index) => (
                  <article
                    key={item.num}
                    className={`editorial-card reveal delay-${index * 100}`}
                  >
                    <span className="editorial-card-num">{item.num}</span>
                    <h3 className="editorial-card-title">{item.title}</h3>
                    <p className="editorial-card-text">{item.text}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
            3. CÓMO USAR SAFENET EN EL AULA
            ============================================================ */}
        <section className="usar-section section-pad" id="aula">
          <div className="grid-frame">
            <div className="usar-header reveal">
              <div>
                <span className="eyebrow">Implementación</span>
                <h2 className="title-lg">
                  Cómo usar SAFENET en el aula
                </h2>
              </div>
              <p className="lead">
                Dos experiencias diseñadas según nivel educativo. Cada mundo
                propone una entrada distinta al tema, lista para abrir clase y
                generar conversación.
              </p>
            </div>

            <div className="usar-grid">
              {comoUsar.map((item, index) => (
                <article
                  key={item.url}
                  className={`usar-card reveal delay-${index * 100}`}
                >
                  <div className="usar-card-head">
                    <span className="usar-level">{item.nivel}</span>
                    <span className="usar-tipo">{item.tipo}</span>
                  </div>
                  <h3>{item.fase}</h3>
                  <p>{item.desc}</p>
                  <a href={item.url} className="usar-card-cta">
                    Entrar al mundo
                    <IconArrowRight size={13} color={C.white} />
                  </a>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================================
            4. EL TONO DE LA CLASE
            ============================================================ */}
        <section className="tono-section section-pad-sm" id="tono">
          <div className="grid-frame">
            <div className="tono-card reveal">
              <div>
                <span className="eyebrow">Pautas de abordaje</span>
                <h2 className="title-lg">El tono de la clase</h2>
                <p className="lead">
                  Hablar de grooming no es asustar: es empoderar. Adaptar el
                  lenguaje a la edad del grupo, evitar lo escabroso y construir
                  un clima donde pedir ayuda no se asocie con vergüenza ni
                  castigo.
                </p>

                <ul className="tono-list" aria-label="Criterios de comunicación">
                  {tonoCriterios.map((criterio) => (
                    <li key={criterio} className="tono-item">
                      <span className="tono-bullet" aria-hidden />
                      <span>{criterio}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <aside className="tono-idea" aria-label="Idea clave">
                <span className="tono-idea-label">Idea clave</span>
                <h3>Trabajar siempre con casos hipotéticos.</h3>
                <p>
                  Nunca pidas a los estudiantes que compartan experiencias
                  personales de acoso frente a la clase. El trabajo áulico debe
                  basarse en situaciones simuladas, como las que propone
                  SAFENET.
                </p>
              </aside>
            </div>
          </div>
        </section>

        {/* ============================================================
            5. DECÁLOGO PARA LA COMUNIDAD EDUCATIVA
            ============================================================ */}
        <section className="decalogo-section section-pad" id="decalogo">
          <div className="grid-frame">
            <div className="decalogo-header reveal">
              <span className="eyebrow">Marco de acción</span>
              <h2 className="title-lg">
                Decálogo para la comunidad educativa
              </h2>
              <p className="lead" style={{ marginTop: 20 }}>
                Diez principios fundamentales para la prevención, concientización
                y abordaje del grooming desde el entorno escolar.
              </p>
            </div>

            <div className="decalogo-grid">
              {decalogo.map((item, index) => (
                <article
                  key={item.num}
                  className={`decalogo-item reveal delay-${(index % 4) * 100}`}
                >
                  <span className="decalogo-num">{item.num}</span>
                  <p className="decalogo-text">{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================================
            6. RECURSOS OFICIALES Y ENLACES ÚTILES
            ============================================================ */}
        <section className="recursos-section section-pad" id="recursos">
          <div className="grid-frame">
            <div className="recursos-header reveal">
              <div>
                <span className="eyebrow">Biblioteca docente</span>
                <h2 className="title-lg">
                  Recursos oficiales y enlaces útiles
                </h2>
              </div>
              <p className="lead">
                Selección curada de guías, materiales y campañas institucionales
                para profundizar la prevención del grooming y trabajar la
                ciudadanía digital en el aula.
              </p>
            </div>

            <div className="recursos-grid">
              {recursosBiblioteca.map((recurso, idx) => (
                <article
                  key={recurso.url + idx}
                  className={`recurso-card ${recurso.featured ? "is-featured" : ""} reveal delay-${(idx % 4) * 100}`}
                >
                  <span className="recurso-cat">
                    <IconBook size={12} color={C.blue} strokeWidth={2.2} />
                    {recurso.cat}
                  </span>
                  <h3>{recurso.title}</h3>
                  <p>{recurso.desc}</p>

                  <div className="recurso-fuente">
                    Fuente:&nbsp;<strong>{recurso.fuente}</strong>
                  </div>

                  <div className="recurso-actions">
                    <button
                      type="button"
                      className={`btn-copy ${copiedIndex === idx ? "is-copied" : ""}`}
                      onClick={() => copyToClipboard(recurso.url, idx)}
                      aria-label="Copiar enlace del recurso"
                    >
                      {copiedIndex === idx ? (
                        <>
                          <IconCheck size={13} color={C.white} />
                          Copiado
                        </>
                      ) : (
                        <>
                          <IconCopy size={13} color="currentColor" />
                          Copiar enlace
                        </>
                      )}
                    </button>
                    <a
                      href={recurso.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="recurso-open"
                    >
                      {recurso.cta}
                      <IconExternal size={12} color={C.blue} />
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================================
            7. PROTOCOLO DOCENTE (panel azul editorial)
            ============================================================ */}
        <section className="editorial-section" id="protocolo">
          <div className="grid-frame">
            <div className="editorial-panel reveal">
              <div className="editorial-head">
                <div>
                  <span className="eyebrow">Protocolo docente</span>
                  <h2 className="title-lg">
                    Qué hacer ante una sospecha o relato
                  </h2>
                </div>
                <div className="editorial-key-card">
                  <span className="editorial-key-label">Idea principal</span>
                  <h3 className="editorial-key-title">El docente acompaña, no investiga.</h3>
                  <p className="editorial-description">
                    Ante una sospecha o relato, la responsabilidad es activar el
                    protocolo institucional y preservar evidencia. La
                    investigación corresponde a otros equipos especializados.
                  </p>
                </div>
              </div>

              <div className="editorial-cards cards-4">
                {protocoloPasos.map((paso, index) => (
                  <article
                    key={paso.step}
                    className={`editorial-card reveal delay-${index * 100}`}
                  >
                    <span className="editorial-card-num">{paso.step}</span>
                    <h3 className="editorial-card-title">{paso.title}</h3>
                    <p className="editorial-card-text">{paso.text}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
            8. LO QUE NO SE DEBE HACER
            ============================================================ */}
        <section className="nohacer-section section-pad-sm" id="limites">
          <div className="grid-frame">
            <div className="nohacer-card reveal">
              <div>
                <div className="nohacer-head">
                  <IconAlert size={18} color={C.warm} strokeWidth={2.2} />
                  Límites institucionales
                </div>
                <h2 className="title-md">Lo que no se debe hacer</h2>
                <p className="lead" style={{ marginTop: 14 }}>
                  Cuatro criterios que sostienen el cuidado de la víctima, la
                  preservación de la evidencia y la integridad del proceso
                  institucional.
                </p>

                <ul className="nohacer-list" aria-label="Criterios de lo que no se debe hacer">
                  {criteriosBasicos.map((criterio) => (
                    <li key={criterio} className="nohacer-item">
                      <span className="nohacer-x" aria-hidden>
                        <IconX size={14} color={C.warm} />
                      </span>
                      <p>{criterio}</p>
                    </li>
                  ))}
                </ul>
              </div>

              <aside className="nohacer-quote">
                El abordaje debe ser siempre institucional. La protección del
                estudiante y la preservación de la evidencia son prioridades
                absolutas por sobre la investigación individual.
              </aside>
            </div>
          </div>
        </section>

        {/* ============================================================
            9. FOOTER
            ============================================================ */}
        <footer className="footer">
          <div className="footer-inner">
            <div className="footer-top">
              <div>
                <div className="footer-brand">SAFENET</div>
                <p className="footer-text">
                  Plataforma educativa de prevención del grooming. Mundo docentes:
                  recursos, criterios pedagógicos y protocolo institucional para
                  trabajar en el aula.
                </p>
              </div>

              <div className="footer-links">
                <a href="/">Volver al inicio</a>
                <a href="#escuela">Escuela</a>
                <a href="#recursos">Recursos</a>
                <a href="#protocolo">Protocolo</a>
              </div>
            </div>

            <div className="footer-bottom">
              <span>© 2026 SAFENET</span>
              <span>Trabajo Final de Grado · Licenciatura en Ciberseguridad</span>
            </div>
          </div>
        </footer>
      </div>

      {/* FAB de descarga de guía rápida */}
      <button
        type="button"
        className="fab-btn"
        onClick={handleDownloadClick}
        aria-label="Descargar guía rápida"
      >
        <IconDownload size={16} color={C.white} />
        Guía rápida
      </button>

      {/* Toast institucional */}
      <div className="toast" role="status" aria-live="polite">
        <IconCheck size={14} color={C.white} />
        <span>{toastMessage}</span>
      </div>
    </main>
  );
}