"use client";

import React, { useEffect, useState } from "react";
// import { trackWorldEntry } from "@/lib/tracking"; // Descomentar en entorno real

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
  alert: "#E63946",
};

type IconProps = {
  size?: number;
  color?: string;
  strokeWidth?: number;
};

const IconShield = ({
  size = 22,
  color = C.blue,
  strokeWidth = 2,
}: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="M9 12l2 2 4-4" />
  </svg>
);


const IconEyeOff = ({
  size = 22,
  color = C.blue,
  strokeWidth = 2,
}: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20C5 20 2 12 2 12a18.35 18.35 0 0 1 5.06-5.94" />
    <path d="M9.9 4.24A10.45 10.45 0 0 1 12 4c7 0 10 8 10 8a18.5 18.5 0 0 1-2.16 3.19" />
    <path d="M14.12 14.12A3 3 0 0 1 9.88 9.88" />
    <path d="M1 1l22 22" />
  </svg>
);

const IconClock = ({
  size = 22,
  color = C.blue,
  strokeWidth = 2,
}: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const IconUsers = ({
  size = 22,
  color = C.blue,
  strokeWidth = 2,
}: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const IconMessage = ({
  size = 22,
  color = C.blue,
  strokeWidth = 2,
}: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    <path d="M8 9h8" />
    <path d="M8 13h5" />
  </svg>
);

const IconMonitor = ({
  size = 22,
  color = C.blue,
  strokeWidth = 2,
}: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <rect x="2" y="3" width="20" height="14" rx="2" />
    <path d="M8 21h8" />
    <path d="M12 17v4" />
  </svg>
);

const IconDownloadBlock = ({
  size = 22,
  color = C.blue,
  strokeWidth = 2,
}: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
    <line x1="3" y1="3" x2="21" y2="21" stroke={C.alert} />
  </svg>
);

const IconPhone = ({
  size = 22,
  color = C.white,
  strokeWidth = 2,
}: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.91.35 1.8.7 2.65a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.43-1.27a2 2 0 0 1 2.11-.45c.85.35 1.74.58 2.65.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const IconCheck = ({
  size = 18,
  color = C.blue,
  strokeWidth = 2.4,
}: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const IconQuote = ({ size = 28, color = C.blue }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path d="M10 11H6.5C6.5 8.5 8 7 10 7V5C7 5 4.5 7.5 4.5 11V18H10V11ZM19.5 11H16C16 8.5 17.5 7 19.5 7V5C16.5 5 14 7.5 14 11V18H19.5V11Z" />
  </svg>
);

const IconCheckCircle = ({ size = 20, color = C.blue }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);

const IconUsersOutline = ({ size = 32, color = C.blueDark }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>
);

const IconStar = ({ size = 12, color = C.white }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
  </svg>
);

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

        <div className="nav-links" aria-label="Secciones del mundo familias">
          <a href="/" className="nav-link">
            Inicio
          </a>
          <a href="#senales" className="nav-link">
            Señales
          </a>
          <a href="#prevencion" className="nav-link">
            Prevención
          </a>
          <a href="#protocolo" className="nav-link">
            Protocolo
          </a>
        </div>

        <a href="#asistencia" className="nav-cta">
          Ayuda 137
        </a>

        <button
          type="button"
          className="nav-burger"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
          onClick={() => setOpen((current) => !current)}
        >
          <span />
          <span />
          <span />
        </button>
      </nav>

      {open && (
        <div className="nav-mobile">
          <a href="/" onClick={closeMenu}>
            Inicio
          </a>
          <a href="#senales" onClick={closeMenu}>
            Señales
          </a>
          <a href="#prevencion" onClick={closeMenu}>
            Prevención
          </a>
          <a href="#protocolo" onClick={closeMenu}>
            Protocolo
          </a>
          <a href="#asistencia" className="nav-cta-mobile" onClick={closeMenu}>
            Ayuda 137
          </a>
        </div>
      )}
    </header>
  );
}

export default function FamiliasPage() {
  /* useEffect(() => {
    trackWorldEntry("familias");
  }, []); */

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const contextoFamilia = [
    {
      num: "01",
      title: "El peligro invisible",
      text: "El grooming no empieza con amenazas, empieza con confianza. Para acercarse a los chicos, los acosadores usan formas naturales, perfiles falsos y falsos intereses comunes.",
    },
    {
      num: "02",
      title: "Disponibilidad vs. Control",
      text: "Tu disponibilidad para escuchar sin juzgar es más importante que cualquier control parental o software de rastreo.",
    },
    {
      num: "03",
      title: "El objetivo: Aislamiento",
      text: "El acosador buscará siempre alejar a la víctima de su entorno familiar. Mantener el diálogo abierto rompe su principal herramienta de manipulación.",
    },
  ];

  const keySignals = [
    {
      title: "OCULTA LA PANTALLA",
      description:
        "Cambia de ventana, apaga el celular o gira la pantalla cuando te acercás. Sucede de forma automática, sin explicación.",
      tag: "CONDUCTA",
    },
    {
      title: "MÁS TIEMPO ONLINE",
      description:
        "Aumenta el uso de dispositivos de noche o madrugada. Se pone ansioso o irritable si se le pide que se desconecte.",
      tag: "RUTINA",
    },
    {
      title: "CONTACTOS SIN EXPLICACIÓN",
      description:
        "Menciona un amigo online que no sabe cómo conoció, o recibe regalos, dinero o créditos de juegos de un desconocido.",
      tag: "VÍNCULOS",
    },
    {
      title: "CAMBIOS DE CONDUCTA",
      description:
        "Tristeza o enojo repentino post-uso del celular. Evita hablar, se aleja de la familia o deja actividades que antes disfrutaba.",
      tag: "ESTADO EMOCIONAL",
    },
  ];

  const pactoCompromisos = [
    {
      num: "01",
      text: "Si algo incomoda, se puede contar.",
    },
    {
      num: "02",
      text: "Las fotos privadas no se comparten.",
    },
    {
      num: "03",
      text: "Los contactos nuevos se conversan.",
    },
    {
      num: "04",
      text: "Pedir ayuda nunca trae castigo.",
    },
  ];

  const pactoFamilia = [
    {
      num: "01",
      title: "Hablar sin miedo",
      text: "Creamos un espacio de confianza donde pueden contar lo que les pasa, sin vergüenza ni temor a ser castigados.",
    },
    {
      num: "02",
      title: "Privacidad y exposición",
      text: "Respetamos la privacidad propia y la de los demás. Las fotos y datos personales no se comparten sin consentimiento.",
    },
    {
      num: "03",
      title: "Contactos nuevos",
      text: "Conversamos antes de aceptar o interactuar con personas que no conocemos en la vida real.",
    },
    {
      num: "04",
      title: "Pedir ayuda",
      text: "Si algo incomoda, confunde o asusta, pedir ayuda es siempre la mejor opción. Estamos para acompañar.",
    },
  ];

  const bestPracticesUpdated = [
    {
      num: "01",
      keyword: "DIÁLOGO",
      title: "Hablá antes de que pase algo",
      text: "Preguntá con quién habla, qué juega, qué ve. El diálogo normaliza la conversación y abre canales de confianza.",
      isKey: false,
    },
    {
      num: "02",
      keyword: "PRIVACIDAD",
      title: "Revisá la privacidad",
      text: "Asegurate de que los perfiles sociales y juegos estén en modo privado. Revisá quiénes pueden ver su ubicación.",
      isKey: false,
    },
    {
      num: "03",
      keyword: "ACUERDOS",
      title: "Acuerdos, no prohibiciones",
      text: "Horarios de uso y reglas claras. Los acuerdos construyen confianza; las prohibiciones generan secretos.",
      isKey: true,
    },
    {
      num: "04",
      keyword: "VERIFICACIÓN",
      title: "La regla del desconocido",
      text: "Dejar claro que un contacto en internet sigue siendo desconocido aunque lleven semanas hablando. La confianza no reemplaza la verificación.",
      isKey: false,
    },
  ];

  const checklistItems = [
    "Averiguá y comprendé qué redes sociales o juegos usa.",
    "Revisá periódicamente con quién interactúa online.",
    "Explicá que no todo en internet es real: identidad, edad, fotos y vínculos.",
    "Establecé como regla no aceptar solicitudes de desconocidos.",
    "Configurá la privacidad de las cuentas juntos.",
    "Supervisá el uso de dispositivos ubicándolos en áreas comunes.",
    "Evitá el uso de cámaras web con personas no conocidas físicamente.",
    "Mantené una actitud receptiva si te cuentan algo que les incomodó.",
  ];

  type HeroCase = {
    tag: string;
    source: string;
    context?: string;
    title: string;
    description?: string;
    url: string;
  };

  const heroCases: HeroCase[] = [
    {
      tag: "Redes sociales",
      source: "La Nota SJ",
      context: "Caso judicial",
      title:
        "Se hacía pasar por una mujer en redes para captar menores y fue condenado por grooming",
      description:
        "Un caso que muestra cómo una identidad falsa puede ser usada para iniciar vínculos de confianza con menores.",
      url: "https://lanotasj.com.ar/se-hacia-pasar-por-una-mujer-en-redes-para-captar-menores-y-fue-condenado-por-grooming/",
    },
    {
      tag: "Captación y engaño",
      source: "La Nación",
      title:
        "Desde la cárcel de Sierra Chica hacía falsas propuestas de trabajo a adolescentes",
      url: "https://www.lanacion.com.ar/seguridad/desde-la-carcel-de-sierra-chica-hacia-falsas-propuestas-de-trabajo-a-adolescentes-las-sometia-a-nid29042026/",
    },
    {
      tag: "Clubes deportivos",
      source: "TyC Sports",
      title: "Independiente denunció tres casos de grooming en las Inferiores",
      url: "https://www.tycsports.com/independiente/independiente-denuncio-tres-casos-de-grooming-en-las-inferiores-id731106.html",
    },
    {
      tag: "Videojuegos",
      source: "Unidiversidad",
      title:
        "Casos de grooming en plataformas de videojuegos: menos bloqueo y más educación",
      url: "https://www.unidiversidad.com.ar/casos-de-grooming-en-plataformas-de-videojuegos-menos-bloqueo-y-mas-educacion",
    },
  ];

  const actionSteps = [
    {
      step: "01",
      title: "Escuchar sin reaccionar negativamente",
      text: "Mantener la calma es lo principal. Tu hijo/a es víctima. No culpes, no retes, no quites el dispositivo. Necesitan sentir contención.",
      highlight: false,
    },
    {
      step: "02",
      title: "No borrar evidencia",
      text: "Es el error más común. Chats, fotos, audios, perfiles y URLs son evidencia legal. Borrarlos anula la posibilidad de investigar.",
      highlight: true,
    },
    {
      step: "03",
      title: "Capturar y documentar todo",
      text: "Hacé capturas de pantalla, guardá nombres de usuario y URLs. Hacelo antes de bloquear al acosador para no perder el rastro.",
      highlight: true,
    },
    {
      step: "04",
      title: "Denunciar de inmediato",
      text: "Comunicate con las autoridades. No confrontes al acosador ni interactúes desde la cuenta del menor. El tiempo es clave.",
      highlight: true,
    },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("active");
        });
      },
      { threshold: 0.12 }
    );

    document
      .querySelectorAll(".reveal")
      .forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePos({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <main className="familias-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Space+Grotesk:wght@500;600;700;800;900&display=swap');

        html {
          scroll-behavior: smooth;
        }

        body {
          margin: 0;
          background: ${C.bgSoft};
          -webkit-font-smoothing: antialiased;
        }

        * {
          box-sizing: border-box;
        }

        .familias-page {
          min-height: 100vh;
          color: ${C.blueDeep};
          background: ${C.bgSoft};
          font-family: 'Inter', sans-serif;
          overflow-x: hidden;
          position: relative;
        }

        .familias-page a {
          color: inherit;
        }

        .spotlight-light {
          position: fixed;
          inset: 0;
          z-index: 1;
          pointer-events: none;
          background: radial-gradient(circle 520px at var(--x) var(--y), rgba(11, 92, 255, 0.035), transparent 72%);
        }

        .page-layer {
          position: relative;
          z-index: 2;
        }

        .site-nav {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 80;
          background: rgba(255,255,255,0.94);
          backdrop-filter: blur(18px);
          border-bottom: none !important;
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
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 32px;
        }

        .nav-logo {
          font-family: 'Space Grotesk', 'Inter', sans-serif;
          font-size: 22px;
          line-height: 1;
          color: ${C.blueDark};
          font-weight: 700;
          letter-spacing: 1.6px;
          text-decoration: none;
          white-space: nowrap;
        }

        .nav-links {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 36px;
          flex: 1;
        }

        .nav-link {
          position: relative;
          font-size: 13.5px;
          font-weight: 700;
          color: ${C.blueDeep};
          text-decoration: none;
          transition: color .2s ease;
        }

        .nav-link::after {
          content: "";
          position: absolute;
          left: 0;
          right: auto;
          bottom: -7px;
          width: 0;
          height: 2px;
          background: ${C.blue};
          border-radius: 999px;
          transition: width .25s ease;
        }

        .nav-link:hover {
          color: ${C.blue};
        }

        .nav-link:hover::after {
          width: 100%;
        }

        .nav-cta,
        .nav-cta-mobile,
        .btn-primary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          background: ${C.blue};
          color: ${C.white} !important;
          border: 1px solid ${C.blue};
          text-decoration: none;
          text-transform: uppercase;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 1.4px;
          border-radius: 999px;
          box-shadow: 0 8px 22px rgba(11,92,255,.22);
          transition: transform .25s ease, box-shadow .25s ease, background .25s ease;
          white-space: nowrap;
        }

        .nav-cta {
          padding: 12px 22px;
        }

        .nav-cta:hover,
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 14px 30px rgba(11,92,255,.28);
        }

        .nav-burger {
          display: none;
          width: 42px;
          height: 42px;
          border: 1px solid ${C.line};
          border-radius: 999px;
          background: ${C.white};
          cursor: pointer;
          padding: 0;
        }

        .nav-burger span {
          display: block;
          width: 18px;
          height: 2px;
          margin: 4px auto;
          border-radius: 999px;
          background: ${C.blueDark};
        }

        .nav-mobile {
          display: none;
          width: min(1280px, calc(100% - 48px));
          margin: 0 auto;
          padding: 10px 0 22px;
        }

        .nav-mobile a {
          display: block;
          padding: 13px 0;
          color: ${C.blueDeep};
          text-decoration: none;
          font-weight: 700;
        }

        .nav-cta-mobile {
          margin-top: 14px;
          padding: 14px 22px !important;
          color: ${C.white} !important;
        }

        .section-shell,
        .grid-frame {
          width: min(1280px, calc(100% - 64px));
          max-width: 1200px;
          margin: 0 auto;
          position: relative;
          border-left: none !important;
          border-right: none !important;
          border-top: none !important;
          border-bottom: none !important;
          background: transparent;
        }

        .border-bottom,
        .border-top,
        .border-b-grid,
        .border-t-grid {
          border: none !important;
        }

        .section-pad {
          padding: 92px 40px;
        }

        .section-pad-sm {
          padding: 72px 40px;
        }

        .eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          color: ${C.blue};
          text-transform: uppercase;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 2.1px;
          margin-bottom: 22px;
        }

        .eyebrow::before {
          content: "";
          width: 28px;
          height: 1px;
          background: currentColor;
        }

        .title-xl,
        .title-lg,
        .title-md,
        .card-title {
          font-family: 'Space Grotesk', 'Inter', sans-serif;
          color: ${C.blueDark};
          text-transform: uppercase;
          margin: 0;
        }

        .title-xl {
          font-size: clamp(42px, 5vw, 74px);
          line-height: 1.02;
          letter-spacing: -2.2px;
          font-weight: 700;
        }

        .title-lg {
          font-size: clamp(30px, 3.4vw, 48px);
          line-height: 1.05;
          letter-spacing: -1.4px;
          font-weight: 700;
        }

        .title-md {
          font-size: clamp(22px, 2.3vw, 32px);
          line-height: 1.12;
          letter-spacing: -0.8px;
          font-weight: 700;
        }

        .accent {
          color: ${C.blue};
        }

        .lead {
          color: ${C.blueDeep};
          font-size: 16px;
          line-height: 1.72;
          margin: 0;
          max-width: 660px;
          font-weight: 500;
        }

        .muted {
          color: ${C.textMute};
          font-size: 14.5px;
          line-height: 1.65;
          margin: 0;
          font-weight: 500;
        }

        .btn-row {
          display: flex;
          align-items: center;
          gap: 14px;
          flex-wrap: wrap;
        }

        .btn-primary {
          padding: 15px 26px;
        }

        .btn-secondary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          border: 1px solid ${C.line};
          background: ${C.white};
          color: ${C.blueDark};
          text-decoration: none;
          text-transform: uppercase;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 1.4px;
          border-radius: 999px;
          padding: 15px 24px;
          transition: transform .25s ease, border-color .25s ease, color .25s ease, box-shadow .25s ease;
        }

        .btn-secondary:hover {
          transform: translateY(-2px);
          border-color: rgba(11,92,255,.36);
          color: ${C.blue};
          box-shadow: 0 12px 28px -22px rgba(6,21,56,.3);
        }

        .reveal {
          opacity: 0;
          transform: translateY(26px);
          transition: opacity .85s cubic-bezier(.16,1,.3,1), transform .85s cubic-bezier(.16,1,.3,1);
        }

        .reveal.active {
          opacity: 1;
          transform: translateY(0);
        }

        .delay-100 {
          transition-delay: 100ms;
        }

        .delay-200 {
          transition-delay: 200ms;
        }

        .delay-300 {
          transition-delay: 300ms;
        }

        .delay-400 {
          transition-delay: 400ms;
        }

        .hero {
          position: relative;
          padding: 128px 0 88px;
          background: ${C.white};
          overflow: hidden;
        }

        .hero-inner {
          width: min(1280px, calc(100% - 64px));
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(420px, .92fr);
          gap: 72px;
          align-items: center;
          position: relative;
          z-index: 2;
        }

        .hero-copy {
          max-width: 680px;
        }

        .hero .lead {
          margin-top: 28px;
          margin-bottom: 34px;
          max-width: 560px;
        }

        .hero-note {
          margin-top: 26px;
          display: inline-flex;
          align-items: flex-start;
          gap: 10px;
          max-width: 520px;
          padding: 14px 16px;
          border: 1px solid ${C.line};
          border-radius: 16px;
          background: ${C.white};
          color: ${C.textMute};
          font-size: 12px;
          line-height: 1.55;
          font-weight: 800;
          letter-spacing: .6px;
          text-transform: uppercase;
          box-shadow: 0 16px 40px -30px rgba(6,21,56,.26);
        }

        .hero-note svg {
          flex: 0 0 auto;
          margin-top: 2px;
        }

        /* --- HERO RADAR PANEL --- */
        .hero-radar-panel {
          position: relative;
          width: 100%;
          max-width: 620px;
          align-self: flex-start;
          display: flex;
          flex-direction: column;
        }

        .radar-shell {
          display: flex;
          flex-direction: column;
          background: ${C.white};
          border: 1px solid rgba(216, 227, 236, 0.95);
          border-radius: 24px;
          padding: 24px 28px 22px;
          box-shadow: 0 20px 56px rgba(6,21,56,.07);
        }

        .radar-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
        }

        .radar-title-wrap {
          display: flex;
          align-items: center;
          gap: 10px;
          min-width: 0;
        }

        .radar-line {
          width: 32px;
          height: 2px;
          background: ${C.blue};
          flex-shrink: 0;
        }

        .radar-kicker {
          color: ${C.blue};
          text-transform: uppercase;
          letter-spacing: 0.18em;
          font-weight: 800;
          font-size: 11px;
          line-height: 1;
          white-space: nowrap;
        }

        .radar-news-label {
          text-transform: uppercase;
          letter-spacing: 0.16em;
          color: ${C.textMute};
          font-weight: 700;
          font-size: 10.5px;
          white-space: nowrap;
          flex-shrink: 0;
        }

        .radar-intro {
          color: ${C.textMute};
          font-size: 13px;
          line-height: 1.5;
          margin: 12px 0 0;
          max-width: 100%;
          font-weight: 500;
        }

        .radar-featured-card {
          display: block;
          margin-top: 14px;
          padding: 20px 22px 18px;
          border-radius: 18px;
          background:
            radial-gradient(circle at 8% 0%, rgba(255,255,255,.14), transparent 38%),
            linear-gradient(135deg, #005BFF 0%, #0746D8 52%, #061538 100%);
          border: 1px solid rgba(255,255,255,.18);
          box-shadow: 0 18px 48px -20px rgba(6,21,56,.42);
          text-decoration: none;
          color: inherit;
          transition: transform .2s ease, box-shadow .2s ease, border-color .2s ease;
          position: relative;
          overflow: hidden;
        }

        .radar-featured-card::before {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: radial-gradient(circle at 86% 12%, rgba(255,255,255,.13), transparent 32%);
        }

        .radar-featured-card > * {
          position: relative;
          z-index: 1;
        }

        .radar-featured-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 24px 56px -20px rgba(6,21,56,.50);
          border-color: rgba(255,255,255,.28);
        }

        .radar-featured-card .radar-tag {
          background: rgba(255,255,255,.18);
          color: #ffffff;
        }

        .radar-featured-card .radar-source {
          color: rgba(255,255,255,.72);
        }

        .radar-featured-card .radar-sep {
          color: rgba(255,255,255,.38);
        }

        .radar-featured-card .radar-context {
          color: rgba(255,255,255,.72);
        }

        .radar-featured-card .radar-featured-title {
          color: #ffffff;
        }

        .radar-featured-card .radar-featured-description {
          color: rgba(255,255,255,.86);
        }

        .radar-featured-card .radar-cta {
          color: rgba(255,255,255,.9);
          letter-spacing: 0.12em;
        }

        .radar-meta {
          display: flex;
          align-items: center;
          gap: 6px;
          flex-wrap: wrap;
          margin-bottom: 8px;
        }

        .radar-tag {
          display: inline-flex;
          align-items: center;
          padding: 2px 8px;
          border-radius: 999px;
          background: rgba(11,92,255,.1);
          color: ${C.blue};
          font-size: 9.5px;
          font-weight: 900;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .radar-source {
          color: ${C.textMute};
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.01em;
        }

        .radar-sep {
          color: ${C.line};
          font-size: 11px;
          font-weight: 400;
          user-select: none;
        }

        .radar-context {
          color: ${C.textMute};
          font-size: 11px;
          font-weight: 600;
        }

        .radar-featured-title {
          font-family: 'Space Grotesk', 'Inter', sans-serif;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: ${C.blueDark};
          font-size: clamp(14px, 1.25vw, 17px);
          line-height: 1.28;
          font-weight: 900;
          margin: 0;
        }

        .radar-featured-description {
          color: ${C.textMute};
          font-size: 12.5px;
          line-height: 1.45;
          margin: 8px 0 0;
          font-weight: 500;
        }

        .radar-cta {
          display: inline-block;
          margin-top: 10px;
          color: ${C.blue};
          font-size: 10.5px;
          font-weight: 900;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .radar-list {
          margin-top: 4px;
          display: flex;
          flex-direction: column;
        }

        .radar-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          padding: 11px 0;
          border-top: 1px solid rgba(216, 227, 236, 0.95);
          text-decoration: none;
          color: inherit;
          transition: border-color .18s ease;
        }

        .radar-row:hover {
          border-top-color: rgba(11,92,255,.18);
        }

        .radar-row-content {
          display: flex;
          flex-direction: column;
          gap: 4px;
          min-width: 0;
          flex: 1;
        }

        .radar-row-meta {
          display: flex;
          align-items: center;
          gap: 6px;
          flex-wrap: wrap;
        }

        .radar-row-title {
          font-family: 'Space Grotesk', 'Inter', sans-serif;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          color: ${C.blueDark};
          font-weight: 900;
          font-size: 12.5px;
          line-height: 1.32;
          margin: 0;
        }

        .radar-arrow {
          color: ${C.blue};
          font-size: 17px;
          flex-shrink: 0;
          line-height: 1;
          transition: transform .18s ease;
        }

        .radar-row:hover .radar-arrow {
          transform: translateX(4px);
        }
        /* --- FIN HERO RADAR PANEL --- */

        .family-panel {
          position: relative;
          min-height: 520px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0;
          isolation: isolate;
        }

        .family-panel::before {
          content: "";
          position: absolute;
          width: 420px;
          height: 420px;
          border-radius: 50%;
          background: transparent;
          filter: none;
          z-index: 0;
        }

        .panel-card-main {
          position: relative;
          z-index: 2;
          width: min(100%, 430px);
          background: rgba(255,255,255,.94);
          border: 1px solid ${C.line};
          border-radius: 28px;
          padding: 26px;
          box-shadow: 0 28px 70px -46px rgba(6,21,56,.42);
          overflow: hidden;
        }

        .panel-card-main::before {
          content: "";
          position: absolute;
          left: 26px;
          right: 26px;
          top: 0;
          height: 3px;
          border-radius: 0 0 999px 999px;
          background: ${C.blue};
        }

        .panel-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          padding-bottom: 22px;
          margin-bottom: 22px;
        }

        .panel-kicker {
          color: ${C.blue};
          text-transform: uppercase;
          font-size: 10.5px;
          font-weight: 900;
          letter-spacing: 1.6px;
          margin-bottom: 8px;
        }

        .panel-title {
          font-family: 'Space Grotesk', 'Inter', sans-serif;
          color: ${C.blueDark};
          font-size: 20px;
          line-height: 1.05;
          font-weight: 700;
          margin: 0;
          text-transform: uppercase;
          letter-spacing: -.45px;
        }

        .panel-status {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 54px;
          height: 54px;
          flex: 0 0 auto;
          border-radius: 18px;
          background: ${C.blueSoft};
          border: 1px solid ${C.line};
        }

        .family-steps {
          display: grid;
          gap: 12px;
        }

        .family-step {
          display: grid;
          grid-template-columns: auto 1fr;
          gap: 12px;
          align-items: flex-start;
          padding: 16px;
          border: 1px solid ${C.line};
          border-radius: 18px;
          background: ${C.white};
        }

        .family-step-number {
          display: inline-flex;
          width: 32px;
          height: 32px;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
          background: ${C.blue};
          color: ${C.white};
          font-size: 11px;
          font-weight: 900;
          letter-spacing: .9px;
        }

        .family-step h3 {
          margin: 0 0 4px;
          color: ${C.blueDark};
          font-size: 14px;
          font-weight: 850;
          letter-spacing: .1px;
        }

        .family-step p {
          margin: 0;
          color: ${C.textMute};
          font-size: 13px;
          line-height: 1.45;
          font-weight: 500;
        }

        .context-section {
          background: ${C.white};
          padding: 18px 0;
        }

        .context-panel {
          position: relative;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,.22);
          border-radius: 30px;
          background:
            radial-gradient(circle at 14% 10%, rgba(255,255,255,.18), transparent 34%),
            linear-gradient(135deg, #005BFF 0%, #0746D8 48%, #061538 100%);
          padding: 58px;
          box-shadow: 0 34px 86px -58px rgba(6,21,56,.56);
        }

        .context-panel::before {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: radial-gradient(circle at 82% 22%, rgba(255,255,255,.16), transparent 28%);
        }

        .context-panel > * {
          position: relative;
          z-index: 2;
        }

        .context-panel .eyebrow {
          color: ${C.white};
        }

        .context-panel .eyebrow::before {
          background: rgba(255,255,255,.82);
        }

        .context-editorial {
          display: grid;
          grid-template-columns: minmax(0, 1.05fr) minmax(320px, .72fr);
          gap: 56px;
          align-items: end;
          margin-bottom: 34px;
        }

        .context-editorial .title-lg {
          max-width: 760px;
          font-size: clamp(32px, 3.7vw, 54px);
          line-height: 1.04;
          letter-spacing: -1.7px;
          color: ${C.white};
        }

        .context-key-card {
          padding: 24px;
          border-radius: 24px;
          background: rgba(255,255,255,.12);
          border: 1px solid rgba(255,255,255,.22);
          box-shadow: 0 24px 54px -44px rgba(0,0,0,.45);
          backdrop-filter: blur(14px);
        }

        .context-key-label {
          display: block;
          margin-bottom: 12px;
          color: rgba(255,255,255,.78);
          font-size: 11px;
          line-height: 1;
          font-weight: 900;
          letter-spacing: 1.9px;
          text-transform: uppercase;
        }

        .context-key-title {
          margin: 0 0 14px;
          font-family: 'Space Grotesk', 'Inter', sans-serif;
          color: ${C.white};
          font-size: 20px;
          line-height: 1.08;
          font-weight: 700;
          letter-spacing: -.35px;
          text-transform: uppercase;
        }

        .context-description {
          color: rgba(255,255,255,.92);
          font-size: 15.5px;
          line-height: 1.76;
          font-weight: 600;
          max-width: 500px;
          margin: 0;
        }

        .context-cards {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 18px;
        }

        .context-card-soft {
          position: relative;
          min-height: 270px;
          padding: 26px;
          border: 1px solid rgba(216, 227, 236, .95);
          border-radius: 24px;
          background: ${C.white};
          box-shadow: 0 22px 54px -42px rgba(6,21,56,.52);
          transition: transform .25s ease, box-shadow .25s ease, border-color .25s ease;
        }

        .context-card-soft:hover {
          transform: translateY(-3px);
          border-color: rgba(11,92,255,.24);
          box-shadow: 0 28px 62px -42px rgba(6,21,56,.58);
        }

        .context-card-top {
          display: flex;
          align-items: center;
          margin-bottom: 24px;
        }

        .context-num {
          display: inline-flex;
          color: ${C.blue};
          font-family: 'Space Grotesk', 'Inter', sans-serif;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 1.7px;
        }

        .context-title {
          margin: 0 0 13px;
          font-family: 'Space Grotesk', 'Inter', sans-serif;
          color: ${C.blueDark};
          text-transform: uppercase;
          font-size: 17px;
          line-height: 1.18;
          letter-spacing: -.15px;
          font-weight: 700;
        }

        .context-text {
          margin: 0;
          color: ${C.textMute};
          font-size: 14px;
          line-height: 1.66;
          font-weight: 550;
        }

        .section-header {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(320px, 520px);
          gap: 48px;
          align-items: end;
          padding-bottom: 38px;
          border: none !important;
        }

        .card-title {
          font-size: 18px;
          line-height: 1.18;
          letter-spacing: -.2px;
          font-weight: 700;
          margin-bottom: 12px;
        }

        .case-section {
          background: ${C.sectionBlue};
        }

        .case-grid {
          display: grid;
          grid-template-columns: minmax(0, .9fr) minmax(380px, 1fr);
          gap: 54px;
          align-items: center;
        }

        .case-alert {
          margin-top: 26px;
          padding: 18px 20px;
          border-left: 3px solid ${C.alert};
          border-radius: 0 16px 16px 0;
          background: rgba(255,255,255,.72);
          color: ${C.blueDark};
          font-size: 14.5px;
          line-height: 1.55;
          font-weight: 700;
        }

        .video-card {
          background: ${C.white};
          border: 1px solid ${C.line};
          border-radius: 26px;
          padding: 22px;
          box-shadow: 0 28px 70px -50px rgba(6,21,56,.45);
          overflow: hidden;
        }

        .video-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          padding-bottom: 16px;
          margin-bottom: 16px;
          color: ${C.textMute};
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 1.1px;
          text-transform: uppercase;
        }

        .video-header-right {
          color: ${C.blue};
        }

        .ig-container {
          position: relative;
          width: 100%;
          min-height: 540px;
          overflow: hidden;
          border-radius: 18px;
          background: ${C.bgSoft};
          border: 1px solid ${C.line};
        }

        .ig-iframe {
          display: block;
          width: 100%;
          height: 540px;
          border: none;
          border-radius: 18px;
          background: ${C.white};
        }

        .ig-fallback {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          margin-top: 14px;
          padding: 13px 18px;
          border-radius: 999px;
          background: ${C.blueSoft};
          border: 1px solid ${C.line};
          text-align: center;
          font-size: 12px;
          line-height: 1.2;
          font-weight: 900;
          letter-spacing: 1.1px;
          text-transform: uppercase;
          color: ${C.blue};
          text-decoration: none;
          transition: transform .25s ease, border-color .25s ease, background .25s ease;
        }

        .ig-fallback:hover {
          transform: translateY(-2px);
          border-color: rgba(11,92,255,.28);
          background: ${C.white};
        }

        /* --- SECCIÓN HUELLA DIGITAL FAMILIAR --- */
        .footprint-section {
          background: ${C.white};
        }

        .footprint-callout {
          margin-top: 26px;
          padding: 18px 22px 18px 20px;
          border-left: 3px solid ${C.blue};
          border-radius: 0 16px 16px 0;
          background: ${C.blueSoft};
          color: ${C.blueDark};
          font-size: 14.5px;
          line-height: 1.58;
          font-weight: 700;
        }

        .footprint-bullets {
          margin-top: 24px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .footprint-bullet-item {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 14px 18px;
          border: 1px solid ${C.line};
          border-radius: 14px;
          background: ${C.bgSoft};
          transition: border-color .2s ease, background .2s ease;
        }

        .footprint-bullet-item:hover {
          border-color: rgba(11,92,255,.22);
          background: ${C.white};
        }

        .footprint-bullet-num {
          font-family: 'Space Grotesk', 'Inter', sans-serif;
          color: ${C.blue};
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 1.2px;
          min-width: 26px;
          line-height: 1;
        }

        .footprint-bullet-divider {
          width: 1px;
          height: 18px;
          background: ${C.line};
          flex-shrink: 0;
        }

        .footprint-bullet-text {
          color: ${C.blueDark};
          font-size: 14px;
          font-weight: 700;
          line-height: 1.4;
        }
        /* --- FIN HUELLA DIGITAL FAMILIAR --- */

        .signals-section {
          background: ${C.white};
          position: relative;
          overflow: hidden;
        }

        .signals-header {
          display: grid;
          grid-template-columns: minmax(0, 1.15fr) minmax(420px, 0.85fr);
          gap: 48px;
          align-items: center;
          padding-bottom: 56px;
          border: none !important;
        }

        .signals-main-title {
          font-family: 'Space Grotesk', 'Inter', sans-serif;
          color: ${C.blueDark};
          font-size: clamp(38px, 4.5vw, 62px);
          line-height: 1.05;
          letter-spacing: -1.8px;
          font-weight: 700;
          text-transform: uppercase;
          margin: 0;
        }

        .signal-callout {
          position: relative;
          margin: 0;
          padding: 32px 38px 32px 42px;
          border-radius: 16px;
          background: ${C.bgSoft};
          border: 1px solid rgba(11,92,255,.1);
          box-shadow: 0 16px 36px -16px rgba(11,92,255,.12);
        }

        .signal-callout::before {
          content: "";
          position: absolute;
          left: 0;
          top: 28px;
          bottom: 28px;
          width: 3px;
          background: ${C.blue};
        }

        .signal-callout p {
          margin: 0;
          color: ${C.blueDark};
          font-size: 16px;
          line-height: 1.6;
          font-weight: 600;
        }

        .signals-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }

        .signal-card {
          position: relative;
          padding: 36px 28px;
          min-height: 330px;
          border-radius: 16px;
          background: #0B5CFF;
          box-shadow: 0 24px 54px -20px rgba(6,21,56,.25);
          color: ${C.white};
          display: flex;
          flex-direction: column;
          transition: transform .25s ease, box-shadow .25s ease;
        }

        .signal-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 32px 64px -20px rgba(6,21,56,.35);
        }

        .signal-card-line {
          width: 24px;
          height: 2px;
          background: rgba(255,255,255,.7);
          margin-bottom: 22px;
        }

        .signal-tag {
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 1.5px;
          color: ${C.white};
          text-transform: uppercase;
          margin-bottom: 16px;
          display: block;
        }

        .signal-card-title {
          font-family: 'Space Grotesk', 'Inter', sans-serif;
          color: ${C.white};
          font-size: 22px;
          line-height: 1.15;
          letter-spacing: -.4px;
          font-weight: 700;
          text-transform: uppercase;
          margin: 0 0 24px 0;
        }

        .signal-divider {
          width: 100%;
          height: 1px;
          background: rgba(255,255,255,.25);
          margin-bottom: 24px;
        }

        .signal-desc {
          margin: 0;
          color: rgba(255,255,255,.95);
          font-size: 14.5px;
          line-height: 1.55;
          font-weight: 500;
        }

        /* --- SECCIÓN PACTO FAMILIAR --- */
        .rules-section {
          background: ${C.sectionBlue}; 
          padding: 64px 0;
          position: relative;
        }

        .rules-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 32px;
          width: min(1440px, calc(100% - 64px));
          max-width: 1320px;
          margin: 0 auto;
          align-items: start; 
        }

        .family-pact-card {
          background: #FFFFFF;
          border-radius: 20px;
          padding: 38px 32px;
          box-shadow: 0 10px 30px -10px rgba(6, 21, 56, 0.05);
          position: relative;
          overflow: hidden;
        }

        .family-pact-card::before {
          content: "";
          position: absolute;
          top: 0; 
          left: 0; 
          right: 0;
          height: 6px;
          background: #0B5CFF; 
        }

        .pact-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 7px 14px;
          border: 1px solid #BFE7F5;
          border-radius: 999px;
          color: #0B5CFF;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 1px;
          text-transform: uppercase;
          margin-bottom: 18px;
        }

        .pact-title {
          font-family: 'Space Grotesk', 'Inter', sans-serif;
          font-size: clamp(28px, 3vw, 38px);
          line-height: 1.05;
          font-weight: 800;
          color: #061538;
          letter-spacing: -1px;
          margin: 0 0 14px;
          text-transform: uppercase;
        }

        .pact-intro {
          font-size: 15px;
          line-height: 1.5;
          font-weight: 600;
          color: #061538;
          margin: 0 0 22px;
          max-width: 520px;
        }

        .pact-agreement-box {
          background: #F7FAFC;
          border: 1px solid #E2E8F0;
          border-radius: 16px;
          padding: 18px 24px;
        }

        .agreement-heading {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 14px;
        }

        .agreement-heading::before,
        .agreement-heading::after {
          content: "";
          flex: 1;
          height: 1px;
          background: #D8E3EC;
        }

        .agreement-heading strong {
          font-size: 11.5px;
          color: #5B6B7A;
          letter-spacing: 2px;
          text-transform: uppercase;
          font-weight: 800;
        }

        .agreement-list {
          display: flex;
          flex-direction: column;
        }

        .agreement-item {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 9px 0;
          border-bottom: 1px solid #E2E8F0;
        }

        .agreement-item:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }

        .agreement-item:first-child {
          padding-top: 0;
        }

        .agreement-num {
          font-family: 'Space Grotesk', 'Inter', sans-serif;
          color: #0B5CFF;
          font-size: 20px;
          font-weight: 800;
          line-height: 1;
          min-width: 28px;
        }

        .agreement-dash {
          color: #94A3B8;
          font-weight: 400;
        }

        .agreement-text {
          color: #061538;
          font-size: 14px;
          font-weight: 700;
        }

        .pact-details-container {
          background: #FFFFFF;
          border-radius: 20px;
          box-shadow: 0 10px 30px -10px rgba(6, 21, 56, 0.05);
          border: 1px solid rgba(216, 227, 236, 0.6);
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .pact-detail-row {
          display: flex;
          align-items: stretch;
          gap: 20px;
          padding: 18px 26px;
          border-bottom: 1px solid #E2E8F0;
        }
        
        .pact-detail-row:last-child {
          border-bottom: none;
        }

        .detail-num {
          font-family: 'Space Grotesk', 'Inter', sans-serif;
          color: #0B5CFF;
          font-size: 40px;
          font-weight: 800;
          line-height: 1;
          width: 52px;
          text-align: center;
          flex-shrink: 0;
          letter-spacing: -1.5px;
          display: flex;
          align-items: flex-start;
          padding-top: 2px;
        }

        .detail-line {
          width: 1px;
          height: auto;
          background: #E2E8F0;
          flex-shrink: 0;
        }

        .detail-content {
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .detail-content h3 {
          font-size: 16px;
          color: #061538;
          font-weight: 800;
          margin: 0 0 6px 0;
        }

        .detail-content p {
          font-size: 13.5px;
          color: #5B6B7A;
          line-height: 1.5;
          font-weight: 500;
          margin: 0;
        }

        .pact-footer {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 20px;
          margin-top: 32px;
        }

        .pact-footer-line {
          width: clamp(40px, 12vw, 120px);
          height: 1px;
          background: rgba(16, 42, 67, 0.16);
        }

        .pact-footer-inner {
          display: flex;
          align-items: center;
          gap: 12px;
          color: rgba(16, 42, 67, 0.8);
          font-size: 14px;
          font-weight: 600;
        }

        .pact-footer-inner strong {
          color: #0B5CFF;
          font-weight: 800;
        }

        /* --- NUEVA SECCIÓN: PREVENCIÓN ACTIVA --- */
        .prevention-section-new {
          background: #FFFFFF;
          padding: 100px 0;
          position: relative;
        }

        .prevention-grid-new {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(420px, 1.05fr);
          gap: 56px;
          width: min(1440px, calc(100% - 64px));
          max-width: 1360px;
          margin: 0 auto;
          align-items: start;
        }

        .prevention-left-col {
          display: flex;
          flex-direction: column;
        }

        .prevention-quote {
          background: #F4F8FB;
          border-radius: 16px;
          padding: 24px 32px;
          display: flex;
          gap: 20px;
          align-items: center;
          margin: 32px 0;
        }

        .prevention-quote p {
          margin: 0;
          color: #061538;
          font-size: 16px;
          line-height: 1.5;
          font-weight: 700;
        }

        .practice-cards-wrapper {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .pract-card-row {
          position: relative;
          display: flex;
          align-items: stretch;
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 16px;
          padding: 24px 28px;
          box-shadow: 0 4px 24px rgba(6, 21, 56, 0.04);
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }

        .pract-card-row:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 32px -12px rgba(6, 21, 56, 0.1);
        }

        .pract-card-row.is-key {
          border: 2px solid #0B5CFF;
          box-shadow: 0 12px 32px -12px rgba(11, 92, 255, 0.15);
        }

        .idea-clave-tab {
          position: absolute;
          left: -32px;
          top: 50%;
          transform: translateY(-50%);
          background: #0B5CFF;
          color: #FFFFFF;
          width: 32px;
          height: 80%;
          border-radius: 8px 0 0 8px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          text-align: center;
        }

        .idea-clave-tab-text {
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 1px;
          writing-mode: vertical-rl;
          text-orientation: mixed;
          transform: rotate(180deg);
          text-transform: uppercase;
        }

        .pract-num-col {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-width: 64px;
        }

        .pract-num-val {
          font-family: 'Space Grotesk', 'Inter', sans-serif;
          font-size: 40px;
          font-weight: 800;
          color: #0B5CFF;
          line-height: 1;
        }

        .pract-keyword {
          font-size: 10px;
          font-weight: 800;
          color: #0B5CFF;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-top: 6px;
        }

        .pract-divider {
          width: 1px;
          background: #E2E8F0;
          margin: 0 24px;
        }

        .pract-content {
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .pract-content h3 {
          font-size: 17px;
          color: #061538;
          font-weight: 800;
          margin: 0 0 6px 0;
        }

        .pract-content p {
          font-size: 14.5px;
          color: #5B6B7A;
          line-height: 1.55;
          font-weight: 500;
          margin: 0;
        }

        /* Right Panel: Checklist */
        .supervision-panel {
          position: relative;
          background: #FFFFFF;
          border-radius: 20px;
          border: 1px solid rgba(216, 227, 236, 0.8);
          box-shadow: 0 16px 48px -16px rgba(6, 21, 56, 0.08);
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .supervision-panel::before {
          content: "";
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 6px;
          background: #0B5CFF;
        }

        .supervision-header {
          padding: 40px 40px 24px;
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .supervision-header-icon {
          width: 56px;
          height: 56px;
          background: #EEF6FB;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .supervision-header-text h3 {
          font-family: 'Space Grotesk', 'Inter', sans-serif;
          font-size: 22px;
          color: #061538;
          font-weight: 800;
          text-transform: uppercase;
          margin: 0 0 6px 0;
        }

        .supervision-header-text p {
          font-size: 14px;
          color: #5B6B7A;
          font-weight: 500;
          margin: 0;
        }

        .supervision-list {
          padding: 0 40px 32px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .supervision-item {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          padding: 16px 20px;
          border: 1px solid #E2E8F0;
          border-radius: 12px;
          background: #FFFFFF;
        }

        .supervision-item p {
          font-size: 14px;
          color: #061538;
          line-height: 1.5;
          font-weight: 600;
          margin: 0;
          padding-top: 2px;
        }

        .supervision-footer {
          background: #F8FAFC;
          padding: 24px 40px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          border-top: 1px solid #E2E8F0;
        }

        .supervision-footer-text {
          border-left: 3px solid #0B5CFF;
          padding-left: 16px;
          font-size: 14px;
          color: #061538;
          font-weight: 700;
          line-height: 1.45;
        }

        /* --- FIN SECCIÓN PREVENCIÓN ACTIVA --- */


        .protocol-section {
          background: ${C.white};
          padding: 18px 0;
        }

        .protocol-panel {
          position: relative;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,.22);
          border-radius: 30px;
          background:
            radial-gradient(circle at 14% 10%, rgba(255,255,255,.18), transparent 34%),
            linear-gradient(135deg, #005BFF 0%, #0746D8 48%, #061538 100%);
          padding: 58px;
          box-shadow: 0 34px 86px -58px rgba(6,21,56,.56);
        }

        .protocol-panel::before {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: radial-gradient(circle at 82% 22%, rgba(255,255,255,.16), transparent 28%);
        }

        .protocol-panel > * {
          position: relative;
          z-index: 2;
        }

        .protocol-panel .eyebrow {
          color: ${C.white};
        }

        .protocol-panel .eyebrow::before {
          background: rgba(255,255,255,.82);
        }

        .protocol-editorial {
          display: grid;
          grid-template-columns: minmax(0, 1.05fr) minmax(320px, .72fr);
          gap: 56px;
          align-items: end;
          margin-bottom: 34px;
        }

        .protocol-editorial .title-lg {
          max-width: 760px;
          font-size: clamp(32px, 3.7vw, 54px);
          line-height: 1.04;
          letter-spacing: -1.7px;
          color: ${C.white};
        }

        .protocol-key-card {
          padding: 24px;
          border-radius: 24px;
          background: rgba(255,255,255,.12);
          border: 1px solid rgba(255,255,255,.22);
          box-shadow: 0 24px 54px -44px rgba(0,0,0,.45);
          backdrop-filter: blur(14px);
        }

        .protocol-key-label {
          display: block;
          margin-bottom: 12px;
          color: rgba(255,255,255,.78);
          font-size: 11px;
          line-height: 1;
          font-weight: 900;
          letter-spacing: 1.9px;
          text-transform: uppercase;
        }

        .protocol-key-title {
          margin: 0 0 14px;
          font-family: 'Space Grotesk', 'Inter', sans-serif;
          color: ${C.white};
          font-size: 20px;
          line-height: 1.08;
          font-weight: 700;
          letter-spacing: -.35px;
          text-transform: uppercase;
        }

        .protocol-description {
          color: rgba(255,255,255,.92);
          font-size: 15.5px;
          line-height: 1.76;
          font-weight: 600;
          max-width: 500px;
          margin: 0;
        }

        .protocol-cards {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 18px;
        }

        .protocol-card-soft {
          position: relative;
          min-height: 270px;
          padding: 26px;
          border: 1px solid rgba(216, 227, 236, .95);
          border-radius: 24px;
          background: ${C.white};
          box-shadow: 0 22px 54px -42px rgba(6,21,56,.52);
          transition: transform .25s ease, box-shadow .25s ease, border-color .25s ease;
        }

        .protocol-card-soft:hover {
          transform: translateY(-3px);
          border-color: rgba(11,92,255,.24);
          box-shadow: 0 28px 62px -42px rgba(6,21,56,.58);
        }

        .protocol-card-soft.is-critical:hover {
          border-color: rgba(230,57,70,.28);
        }

        .protocol-card-top {
          display: flex;
          align-items: center;
          margin-bottom: 24px;
        }

        .protocol-num {
          display: inline-flex;
          color: ${C.blue};
          font-family: 'Space Grotesk', 'Inter', sans-serif;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 1.7px;
        }

        .protocol-card-soft.is-critical .protocol-num {
          color: ${C.alert};
        }

        .protocol-title {
          margin: 0 0 13px;
          font-family: 'Space Grotesk', 'Inter', sans-serif;
          color: ${C.blueDark};
          text-transform: uppercase;
          font-size: 17px;
          line-height: 1.18;
          letter-spacing: -.15px;
          font-weight: 700;
        }

        .protocol-text {
          margin: 0;
          color: ${C.textMute};
          font-size: 14px;
          line-height: 1.66;
          font-weight: 550;
        }

        .assistance-section {
          background: ${C.white};
        }

        .assistance-card {
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          gap: 32px;
          align-items: center;
          padding: 36px;
          border: 1px solid rgba(230,57,70,.34);
          border-radius: 28px;
          background: ${C.white};
          box-shadow: 0 24px 62px -50px rgba(6,21,56,.42);
        }

        .assistance-lines {
          display: grid;
          gap: 10px;
          margin-top: 18px;
        }

        .assistance-line {
          display: flex;
          align-items: center;
          gap: 10px;
          color: ${C.blueDeep};
          font-size: 15px;
          line-height: 1.5;
          font-weight: 700;
        }

        .assistance-line span {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 112px;
          padding: 7px 10px;
          border-radius: 999px;
          background: rgba(230,57,70,.08);
          color: ${C.alert};
          font-size: 12px;
          letter-spacing: 1px;
          text-transform: uppercase;
          font-weight: 900;
        }

        .btn-alert {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          background: ${C.alert};
          color: ${C.white};
          text-decoration: none;
          text-transform: uppercase;
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 1.4px;
          border-radius: 999px;
          padding: 16px 28px;
          box-shadow: 0 12px 26px rgba(230,57,70,.2);
          transition: transform .25s ease, box-shadow .25s ease;
          white-space: nowrap;
        }

        .btn-alert:hover {
          transform: translateY(-2px);
          box-shadow: 0 18px 32px rgba(230,57,70,.28);
        }

        .footer {
          background: linear-gradient(180deg, #0B1F4D 0%, #061538 100%);
          border: none !important;
          padding: 54px 0 30px;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
        }

        .footer-inner {
          width: min(1280px, calc(100% - 64px));
          max-width: 1200px;
          margin: 0 auto;
        }

        .footer-top {
          display: flex;
          justify-content: space-between;
          gap: 36px;
          align-items: flex-start;
          padding-bottom: 34px;
          border: none !important;
        }

        .footer-brand {
          font-family: 'Space Grotesk', 'Inter', sans-serif;
          font-size: 24px;
          color: ${C.white};
          font-weight: 700;
          letter-spacing: 1.7px;
          margin-bottom: 10px;
        }

        .footer-text {
          max-width: 420px;
          color: rgba(255, 255, 255, 255);
          font-size: 14px;
          line-height: 1.6;
          font-weight: 500;
          margin: 0;
        }

        .footer-links {
          display: flex;
          gap: 24px;
          flex-wrap: wrap;
          justify-content: flex-end;
        }

        .footer-links a {
          color: rgba(255, 255, 255, 0.85);
          text-decoration: none;
          text-transform: uppercase;
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 1.3px;
          transition: color .2s ease;
        }

        .footer-links a:hover {
          color: ${C.white};
        }

        .footer-bottom {
          display: flex;
          justify-content: space-between;
          gap: 20px;
          flex-wrap: wrap;
          padding-top: 26px;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          color: rgba(255, 255, 255, 0.55);
          font-size: 12.5px;
          font-weight: 600;
        }

        @media (max-width: 1200px) {
          .rules-grid {
            grid-template-columns: 1fr;
            max-width: 800px;
          }
        }

        @media (max-width: 1100px) {
          .hero-inner,
          .case-grid,
          .prevention-grid-new {
            grid-template-columns: 1fr;
          }

          .prevention-grid-new {
            max-width: 800px;
          }

          .family-panel {
            min-height: auto;
            padding: 0;
          }

          .section-header,
          .signals-header {
            grid-template-columns: 1fr;
            gap: 32px;
            align-items: start;
          }

          .signals-main-title {
            font-size: clamp(34px, 6vw, 48px);
          }

          .signal-callout {
            max-width: 100%;
          }

          .context-panel {
            padding: 44px;
          }

          .context-editorial {
            grid-template-columns: 1fr;
            gap: 22px;
            align-items: start;
          }

          .context-key-card {
            max-width: 720px;
          }

          .context-description {
            max-width: 720px;
          }

          .context-cards {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }

          .context-card-soft {
            padding: 24px;
            min-height: 300px;
          }

          .signals-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .protocol-panel {
            padding: 44px;
          }

          .protocol-editorial {
            grid-template-columns: 1fr;
            gap: 22px;
            align-items: start;
          }

          .protocol-key-card {
            max-width: 720px;
          }

          .protocol-description {
            max-width: 720px;
          }

          .protocol-cards {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .protocol-card-soft {
            padding: 24px;
            min-height: 280px;
          }
        }

        @media (max-width: 880px) {
          .nav-inner {
            width: min(1280px, calc(100% - 48px));
            height: 62px;
          }

          .nav-links,
          .nav-cta {
            display: none;
          }

          .nav-burger {
            display: block;
          }

          .nav-mobile {
            display: block;
          }

          .hero {
            padding-top: 112px;
          }

          .hero-inner,
          .section-shell,
          .grid-frame,
          .footer-inner {
            width: min(100% - 48px, 1280px);
          }

          .section-pad {
            padding: 72px 28px;
          }

          .section-pad-sm {
            padding: 60px 28px;
          }

          .context-panel {
            padding: 38px 28px;
            border-radius: 24px;
          }

          .context-cards {
            grid-template-columns: 1fr 1fr;
          }

          .protocol-panel {
            padding: 38px 28px;
            border-radius: 24px;
          }

          .protocol-cards {
            grid-template-columns: 1fr 1fr;
          }

          .assistance-card {
            grid-template-columns: 1fr;
          }

          .btn-alert {
            justify-self: flex-start;
          }

          .footer-top {
            flex-direction: column;
          }

          .footer-links {
            justify-content: flex-start;
          }
        }

        @media (max-width: 768px) {
          .family-pact-card {
            padding: 28px 22px;
          }
          .pact-title {
            font-size: 28px;
          }
          .pact-agreement-box {
            padding: 16px 16px;
          }
          .agreement-item {
            gap: 12px;
            padding: 8px 0;
          }
          .pact-detail-row {
            padding: 16px 22px;
            gap: 18px;
          }
          .detail-num {
            font-size: 32px;
            width: 44px;
          }

          /* Ajuste mobile tab clave */
          .pract-card-row.is-key {
            padding-left: 36px;
          }
          .idea-clave-tab {
            left: -12px;
            width: 28px;
          }
          .idea-clave-tab-text {
            font-size: 8px;
          }
        }

        @media (max-width: 640px) {
          .title-xl {
            font-size: clamp(38px, 12vw, 54px);
            letter-spacing: -1.5px;
          }

          .hero-inner,
          .section-shell,
          .grid-frame,
          .footer-inner {
            width: min(100% - 32px, 1280px);
          }

          .hero {
            padding: 100px 0 58px;
          }

          .hero-inner {
            gap: 46px;
          }

          .section-pad {
            padding: 58px 20px;
          }

          .section-pad-sm {
            padding: 52px 20px;
          }

          .context-section {
            padding: 8px 0;
          }

          .context-panel {
            padding: 32px 20px;
            border-radius: 22px;
          }

          .context-editorial {
            margin-bottom: 26px;
          }

          .context-key-card {
            padding: 20px;
            border-radius: 20px;
          }

          .context-cards {
            grid-template-columns: 1fr;
            gap: 14px;
          }

          .context-card-soft {
            padding: 22px;
            border-radius: 20px;
          }

          .panel-card-main {
            padding: 22px;
            border-radius: 24px;
          }

          .panel-top {
            align-items: flex-start;
          }

          .btn-row {
            flex-direction: column;
            align-items: stretch;
          }

          .btn-primary,
          .btn-secondary,
          .btn-alert {
            width: 100%;
          }

          .signals-grid {
            grid-template-columns: 1fr;
          }

          .signal-card {
            min-height: auto;
          }

          .protocol-section {
            padding: 8px 0;
          }

          .protocol-panel {
            padding: 32px 20px;
            border-radius: 22px;
          }

          .protocol-editorial {
            margin-bottom: 26px;
          }

          .protocol-key-card {
            padding: 20px;
            border-radius: 20px;
          }

          .protocol-cards {
            grid-template-columns: 1fr;
            gap: 14px;
          }

          .protocol-card-soft {
            padding: 22px;
            border-radius: 20px;
            min-height: auto;
          }

          /* Adaptación Pacto Mobile */
          .rules-grid {
            gap: 20px;
          }

          .family-pact-card {
            padding: 28px 20px;
          }

          .pact-title {
            font-size: clamp(28px, 9vw, 36px);
            letter-spacing: -1px;
          }

          .pact-intro {
            font-size: 14.5px;
            margin-bottom: 24px;
          }

          .agreement-num {
            font-size: 20px;
            min-width: 26px;
          }

          .agreement-dash {
            display: none;
          }

          .agreement-text {
            font-size: 14px;
          }

          .pact-detail-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
            padding: 20px 18px;
          }

          .detail-line {
            display: none;
          }

          .detail-num {
            text-align: left;
            width: auto;
            font-size: 32px;
            padding-top: 0;
          }

          .pact-footer {
            flex-direction: column;
            text-align: center;
            margin-top: 24px;
          }

          .pact-footer-line {
            display: none;
          }

          /* Prevencion Mobile */
          .prevention-section-new {
            padding: 64px 0;
          }

          .prevention-quote {
            flex-direction: column;
            align-items: flex-start;
            padding: 20px 24px;
            gap: 16px;
          }

          .pract-card-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
            padding: 24px;
          }

          .pract-card-row.is-key {
            padding-left: 24px; 
          }

          .pract-num-col {
            flex-direction: row;
            align-items: baseline;
            gap: 12px;
          }

          .pract-keyword {
            margin-top: 0;
          }

          .pract-divider {
            display: none;
          }

          .idea-clave-tab {
            top: -12px;
            left: 20px;
            transform: none;
            width: auto;
            height: auto;
            flex-direction: row;
            border-radius: 6px;
            padding: 4px 10px;
          }

          .idea-clave-tab-text {
            writing-mode: horizontal-tb;
            transform: none;
          }

          .supervision-header {
            padding: 28px 24px 20px;
          }

          .supervision-list {
            padding: 0 24px 28px;
          }

          .supervision-footer {
            padding: 24px;
            flex-direction: column;
            align-items: flex-start;
          }

          .hero-radar-panel {
            max-width: 100%;
          }

          .radar-shell {
            padding: 18px 20px 16px;
            border-radius: 18px;
          }

          .radar-header {
            flex-wrap: wrap;
            gap: 6px;
          }

          .radar-featured-title {
            font-size: 14px;
          }

          .radar-featured-description {
            font-size: 12px;
          }

          .radar-row-title {
            font-size: 12px;
          }

          .ig-container {
            min-height: 500px;
          }

          .ig-iframe {
            height: 500px;
          }

          .assistance-card {
            padding: 26px 22px;
          }

          .assistance-line {
            align-items: flex-start;
            flex-direction: column;
            gap: 8px;
          }

          .footer-bottom {
            flex-direction: column;
          }
        }
      `}</style>

      <div
        className="spotlight-light"
        style={
          {
            "--x": `${mousePos.x}px`,
            "--y": `${mousePos.y}px`,
          } as React.CSSProperties
        }
      />

      <div className="page-layer">
        <Navbar />

        <section className="hero" id="inicio">
          <div className="hero-inner">
            <div className="hero-copy reveal">
              <span className="eyebrow">Mundo familias</span>
              <h1 className="title-xl">
                Cuidá a tus hijos del <span className="accent">grooming</span> sin
                romper la confianza
              </h1>
              <p className="lead">
                Una guía clara para reconocer señales tempranas, acompañar sin
                juzgar y actuar a tiempo ante situaciones de riesgo digital.
              </p>
              <div className="btn-row">
                <a href="#senales" className="btn-primary">
                  Ver señales de alerta
                </a>
                <a href="#protocolo" className="btn-secondary">
                  Qué hacer ante un caso
                </a>
              </div>
              <div className="hero-note">
                <IconShield size={18} color={C.blue} />
                <span>
                  LA PREVENCIÓN FAMILIAR NO SE BASA EN VIGILAR TODO: SE BASA EN
                  CONSTRUIR CONFIANZA ANTES DE QUE APAREZCA UNA SITUACIÓN
                  CRÍTICA.
                </span>
              </div>
            </div>

            <div
              className="hero-radar-panel reveal delay-100"
              aria-label="Radar de casos reales de grooming en los medios"
            >
              <div className="radar-shell">
                <div className="radar-header">
                  <div className="radar-title-wrap">
                    <div className="radar-line" aria-hidden />
                    <span className="radar-kicker">Radar de casos reales</span>
                  </div>
                  <span className="radar-news-label">En las noticias</span>
                </div>

                <p className="radar-intro">
                  Titulares recientes que muestran cómo el grooming aparece en
                  redes, videojuegos, clubes y otros espacios cotidianos.
                </p>

                <a
                  href={heroCases[0].url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="radar-featured-card"
                  aria-label={`Leer nota destacada: ${heroCases[0].title} — ${heroCases[0].source}`}
                >
                  <div className="radar-meta">
                    <span className="radar-tag">{heroCases[0].tag}</span>
                    <span className="radar-source">{heroCases[0].source}</span>
                    {heroCases[0].context && (
                      <>
                        <span className="radar-sep" aria-hidden>·</span>
                        <span className="radar-context">{heroCases[0].context}</span>
                      </>
                    )}
                  </div>
                  <h2 className="radar-featured-title">{heroCases[0].title}</h2>
                  {heroCases[0].description && (
                    <p className="radar-featured-description">{heroCases[0].description}</p>
                  )}
                  <span className="radar-cta">Leer nota completa →</span>
                </a>

                <div className="radar-list">
                  {heroCases.slice(1).map((item: HeroCase, i: number) => (
                    <a
                      key={i}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="radar-row"
                      aria-label={`Leer nota: ${item.title} — ${item.source}`}
                    >
                      <div className="radar-row-content">
                        <div className="radar-row-meta">
                          <span className="radar-tag">{item.tag}</span>
                          <span className="radar-source">{item.source}</span>
                        </div>
                        <p className="radar-row-title">{item.title}</p>
                      </div>
                      <span className="radar-arrow" aria-hidden>→</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="context-section border-bottom" id="contexto">
          <div className="grid-frame">
            <div className="context-panel reveal">
              <div className="context-editorial">
                <div>
                  <span className="eyebrow">Contexto familiar</span>
                  <h2 className="title-lg">
                    El vínculo de confianza también es una medida de seguridad
                  </h2>
                </div>

                <div className="context-key-card">
                  <span className="context-key-label">La clave</span>
                  <h3 className="context-key-title">Acompañar sin invadir.</h3>
                  <p className="context-description">
                    El objetivo no es generar miedo ni controlar cada interacción,
                    sino entender cómo opera el engaño para sostener conversaciones
                    abiertas y detectar cambios a tiempo.
                  </p>
                </div>
              </div>

              <div className="context-cards">
                {contextoFamilia.map((item, index) => (
                  <article
                    key={item.title}
                    className={`context-card-soft reveal delay-${index * 100}`}
                  >
                    <div className="context-card-top">
                      <span className="context-num">{item.num}</span>
                    </div>
                    <h3 className="context-title">{item.title}</h3>
                    <p className="context-text">{item.text}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="case-section border-bottom">
          <div className="grid-frame section-pad">
            <div className="case-grid">
              <div className="reveal">
                <span className="eyebrow">Caso real</span>
                <h2 className="title-lg">
                  Cuando una señal parece pequeña, también hay que prestar atención
                </h2>
                <p className="lead" style={{ marginTop: 20 }}>
                  Este video permite observar cómo ciertas situaciones digitales
                  pueden parecer aisladas o inofensivas, pero funcionan como señales
                  para abrir una conversación en familia. La clave no es reaccionar
                  con miedo, sino mirar, escuchar y acompañar a tiempo.
                </p>
                <div className="case-alert">
                  Un contenido real puede ser una oportunidad para hablar en casa:
                  preguntar sin juzgar, validar lo que sienten los chicos y reforzar
                  que pedir ayuda nunca debe asociarse con castigo.
                </div>
              </div>

              <div className="video-card reveal delay-100">
                <div className="video-header">
                  <span>Caso real</span>
                  <span className="video-header-right">Video educativo</span>
                </div>
                <div className="ig-container">
                  <iframe
                    src="https://www.instagram.com/reel/DX2d0c1DuZv/embed"
                    title="Reel educativo sobre grooming"
                    width="100%"
                    height="540"
                    allowFullScreen
                    loading="lazy"
                    className="ig-iframe"
                  />
                </div>
                <a
                  href="https://www.instagram.com/reel/DX2d0c1DuZv/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ig-fallback"
                >
                  Abrir reel en Instagram
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="footprint-section border-bottom">
          <div className="grid-frame section-pad">
            <div className="case-grid">
              <div className="reveal">
                <span className="eyebrow">Huella digital familiar</span>
                <h2 className="title-lg">
                  Lo que compartimos también puede exponerlos
                </h2>
                <p className="lead" style={{ marginTop: 20 }}>
                  Muchas veces las familias publican fotos, rutinas, uniformes,
                  lugares o actividades de sus hijos sin imaginar que esa información
                  puede ser usada por personas malintencionadas para acercarse con
                  más facilidad.
                </p>
                <div className="footprint-callout">
                  Publicar no siempre es peligroso, pero sí requiere criterio:
                  cada dato visible puede ayudar a construir una falsa cercanía.
                </div>
                <div className="footprint-bullets">
                  <div className="footprint-bullet-item">
                    <span className="footprint-bullet-num">01</span>
                    <span className="footprint-bullet-divider" aria-hidden />
                    <span className="footprint-bullet-text">No publiques rutinas completas</span>
                  </div>
                  <div className="footprint-bullet-item">
                    <span className="footprint-bullet-num">02</span>
                    <span className="footprint-bullet-divider" aria-hidden />
                    <span className="footprint-bullet-text">Evitá mostrar escuela, club o ubicación</span>
                  </div>
                  <div className="footprint-bullet-item">
                    <span className="footprint-bullet-num">03</span>
                    <span className="footprint-bullet-divider" aria-hidden />
                    <span className="footprint-bullet-text">Pedí consentimiento antes de subir fotos</span>
                  </div>
                </div>
              </div>

              <div className="video-card reveal delay-100">
                <div className="video-header">
                  <span>Huella digital</span>
                  <span className="video-header-right">Video educativo</span>
                </div>
                <div className="ig-container">
                  <iframe
                    src="https://www.instagram.com/reel/DYkyYZMSmqL/embed"
                    title="Reel educativo sobre huella digital familiar"
                    width="100%"
                    height="540"
                    allowFullScreen
                    loading="lazy"
                    className="ig-iframe"
                  />
                </div>
                <a
                  href="https://www.instagram.com/reel/DYkyYZMSmqL/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ig-fallback"
                >
                  Abrir reel en Instagram
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="signals-section border-bottom" id="senales">
          <div className="grid-frame section-pad-sm">
            <div className="signals-header reveal">
              <div>
                <span className="eyebrow">SEÑALES DE RIESGO</span>
                <h2 className="signals-main-title">
                  EL RIESGO EMPIEZA ANTES DE QUE PAREZCA PELIGROSO
                </h2>
              </div>
              <div className="signal-callout-wrapper">
                <div className="signal-callout">
                  <p>
                    Ninguna señal aislada confirma una situación de grooming, pero
                    la combinación de varias exige atención, conversación y acción
                    responsable.
                  </p>
                </div>
              </div>
            </div>

            <div className="signals-grid">
              {keySignals.map((signal, index) => (
                <article
                  key={signal.title}
                  className={`signal-card reveal delay-${index * 100}`}
                >
                  <div className="signal-card-line" aria-hidden></div>
                  <span className="signal-tag">{signal.tag}</span>
                  <h3 className="signal-card-title">{signal.title}</h3>
                  <div className="signal-divider" aria-hidden></div>
                  <p className="signal-desc">{signal.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="rules-section border-bottom" id="infografia">
          <div className="rules-grid">
            <article className="family-pact-card reveal">
              <span className="pact-badge">
                <IconShield size={14} color={C.blue} strokeWidth={2.5} />
                Prevención en casa
              </span>
              <h2 className="pact-title">
                Un pacto familiar<br />
                para cuidar<br />
                sin invadir
              </h2>
              <p className="pact-intro">
                La prevención no empieza con prohibiciones. Empieza cuando los
                chicos saben que pueden hablar sin miedo a ser castigados.
              </p>

              <div className="pact-agreement-box" aria-label="Nuestro acuerdo familiar">
                <div className="agreement-heading">
                  <strong>Nuestro acuerdo</strong>
                </div>
                <div className="agreement-list">
                  {pactoCompromisos.map((compromiso) => (
                    <div key={compromiso.num} className="agreement-item">
                      <span className="agreement-num">{compromiso.num}</span>
                      <span className="agreement-dash">—</span>
                      <span className="agreement-text">{compromiso.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </article>

            <div className="pact-details-container reveal delay-100" aria-label="Explicación del pacto familiar">
              {pactoFamilia.map((item, index) => (
                <article key={item.num} className="pact-detail-row">
                  <span className="detail-num">{item.num}</span>
                  <span className="detail-line" aria-hidden />
                  <div className="detail-content">
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="pact-footer reveal delay-200">
            <div className="pact-footer-line" aria-hidden />
            <div className="pact-footer-inner">
              <IconShield size={16} color={C.blue} strokeWidth={2.5} />
              <span>
                Un pacto no es control. Es <strong>cuidado mutuo.</strong> Construyamos <strong>redes seguras</strong> en familia.
              </span>
            </div>
            <div className="pact-footer-line" aria-hidden />
          </div>
        </section>

        <section className="prevention-section-new border-bottom" id="prevencion">
          <div className="prevention-grid-new">
            <div className="prevention-left-col reveal">
              <span className="eyebrow">Prevención activa</span>
              <h2 className="title-lg">Buenas prácticas en el hogar</h2>
              <p className="lead" style={{ marginTop: 20 }}>
                La prevención no depende de una única charla. Se construye con
                acuerdos claros, presencia adulta y conversaciones que no
                aparezcan solo cuando hay un problema.
              </p>

              <div className="prevention-quote">
                <IconQuote size={32} color={C.blue} />
                <p>
                  La prevención no depende de controlar todo, sino de estar
                  presentes antes de que el problema aparezca.
                </p>
              </div>

              <div className="practice-cards-wrapper">
                {bestPracticesUpdated.map((practice, index) => (
                  <article
                    key={practice.title}
                    className={`pract-card-row ${practice.isKey ? "is-key" : ""} reveal delay-${index * 100}`}
                  >
                    {practice.isKey && (
                      <div className="idea-clave-tab" aria-hidden>
                        <IconStar />
                        <span className="idea-clave-tab-text">Idea Clave</span>
                      </div>
                    )}
                    
                    <div className="pract-num-col">
                      <span className="pract-num-val">{practice.num}</span>
                      <span className="pract-keyword">{practice.keyword}</span>
                    </div>
                    
                    <div className="pract-divider" aria-hidden />
                    
                    <div className="pract-content">
                      <h3>{practice.title}</h3>
                      <p>{practice.text}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <aside className="supervision-panel reveal delay-100">
              <div className="supervision-header">
                <div className="supervision-header-icon">
                  <IconShield size={26} color={C.blue} strokeWidth={2} />
                </div>
                <div className="supervision-header-text">
                  <h3>Checklist de supervisión</h3>
                  <p>Acciones concretas para acompañar sin invadir.</p>
                </div>
              </div>

              <div className="supervision-list">
                {checklistItems.map((item, index) => (
                  <div key={index} className="supervision-item">
                    <IconCheckCircle size={22} color={C.blue} />
                    <p>{item}</p>
                  </div>
                ))}
              </div>

              <div className="supervision-footer">
                <div className="supervision-footer-text">
                  La supervisión más efectiva no nace del control,
                  <br /> sino de la conversación.
                </div>
                <IconUsersOutline size={38} color={C.blueDark} />
              </div>
            </aside>
          </div>
        </section>

        <section className="protocol-section border-bottom" id="protocolo">
          <div className="grid-frame">
            <div className="protocol-panel reveal">
              <div className="protocol-editorial">
                <div>
                  <span className="eyebrow">Protocolo de acción</span>
                  <h2 className="title-lg">
                    Qué hacer ante un caso real
                  </h2>
                </div>

                <div className="protocol-key-card">
                  <span className="protocol-key-label">Orden de acción</span>
                  <h3 className="protocol-key-title">Proteger sin improvisar.</h3>
                  <p className="protocol-description">
                    Si descubrís o sospechás una situación de grooming, el orden
                    de los pasos es crítico para proteger al menor y preservar
                    la evidencia legal.
                  </p>
                </div>
              </div>

              <div className="protocol-cards">
                {actionSteps.map((item, index) => (
                  <article
                    key={item.step}
                    className={`protocol-card-soft ${item.highlight ? "is-critical" : ""} reveal delay-${index * 100}`}
                  >
                    <div className="protocol-card-top">
                      <span className="protocol-num">{item.step}</span>
                    </div>
                    <h3 className="protocol-title">{item.title}</h3>
                    <p className="protocol-text">{item.text}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="assistance-section" id="asistencia">
          <div className="grid-frame section-pad-sm">
            <div className="assistance-card reveal">
              <div>
                <span className="eyebrow" style={{ color: C.alert }}>
                  Asistencia y denuncia
                </span>
                <h2 className="title-md">Canales oficiales para pedir ayuda</h2>
                <p className="lead" style={{ marginTop: 14 }}>
                  Ante una sospecha o situación concreta, no confrontes al acosador
                  ni borres evidencia. Pedí asistencia y denunciá por canales
                  oficiales.
                </p>
                <div className="assistance-lines">
                  <div className="assistance-line">
                    <span>Línea 137</span> Gratuita, confidencial y disponible las 24
                    horas.
                  </div>
                  <div className="assistance-line">
                    <span>0800-222-1717</span> Brigada de Delitos contra Niños,
                    Niñas y Adolescentes.
                  </div>
                </div>
              </div>

              <a href="tel:137" className="btn-alert">
                <IconPhone size={18} color={C.white} /> Llamar al 137
              </a>
            </div>
          </div>
        </section>

        <footer className="footer">
          <div className="footer-inner">
            <div className="footer-top">
              <div>
                <div className="footer-brand">SAFENET</div>
                <p className="footer-text">
                  Plataforma educativa de prevención del grooming. Mundo familias:
                  acompañamiento, señales tempranas, prevención activa y protocolo de
                  acción responsable.
                </p>
              </div>

              <div className="footer-links">
                <a href="/">Volver al inicio</a>
                <a href="#senales">Señales</a>
                <a href="#prevencion">Prevención</a>
                <a href="#protocolo">Protocolo</a>
              </div>
            </div>

            <div className="footer-bottom">
              <span>© 2026 SAFENET</span>
              <span>
                Trabajo Final de Grado · Licenciatura en Ciberseguridad
              </span>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}