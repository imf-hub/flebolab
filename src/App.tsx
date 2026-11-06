import { useState, useLayoutEffect, useRef, lazy, Suspense } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { MotionConfig, motion, AnimatePresence } from "motion/react";
import { assetUrl } from "./shared/assets";
import {
  Activity,
  ScanLine,
  Focus,
  Menu,
  X,
  BookOpen,
  ArrowUpRight,
  Github,
} from "lucide-react";
const Home = lazy(() => import("./pages/LaboratoryHome"));
export function Brand() {
  return (
    <Link to="/" className="brand" aria-label="FLEBO LAB inicio">
      <img
        className="imf-horizontal"
        src={assetUrl("/brand/imf-horizontal.png")}
        alt="Instituto Mexicano de Flebología"
        width="501"
        height="128"
      />
      <span className="product-brand">
        FLEBO<span className="brand-light">LAB</span>
        <small>LABORATORIOS INTERACTIVOS</small>
      </span>
    </Link>
  );
}
export const labInfo = [
  {
    path: "/flebotwin",
    name: "FleboTwin",
    tag: "HEMODINÁMICA",
    title: "Explora el mecanismo.",
    description: "Modelo venoso interactivo.",
    icon: Activity,
    color: "red",
    num: "01",
    features: "12 experimentos",
  },
  {
    path: "/flebodus",
    name: "FleboDUS",
    tag: "ECOGRAFÍA VENOSA",
    title: "Revisa el movimiento.",
    description: "Cine real y fundamentos Doppler.",
    icon: ScanLine,
    color: "teal",
    num: "02",
    features: "72 cines",
  },
  {
    path: "/flebovision",
    name: "FleboVision",
    tag: "OBSERVACIÓN CLÍNICA",
    title: "Observa el detalle.",
    description: "Fotografía, comparación y anotaciones.",
    icon: Focus,
    color: "gold",
    num: "03",
    features: "96 vistas",
  },
];
export default function App() {
  const [menu, setMenu] = useState(false),
    location = useLocation(),
    home = ["/", "/laboratorios"].includes(location.pathname);
  const isTwin = location.pathname.startsWith("/flebotwin");
  const headerRef = useRef<HTMLElement>(null);
  useLayoutEffect(() => {
    const header = headerRef.current;
    if (!header) return;
    const measure = () =>
      document.documentElement.style.setProperty(
        "--app-header-height",
        `${header.offsetHeight}px`,
      );
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(header);
    return () => observer.disconnect();
  }, []);
  return (
    <MotionConfig reducedMotion="user">
      <a
        href="#main-content"
        className="skip-link"
        onClick={(e) => {
          e.preventDefault();
          document.getElementById("main-content")?.focus();
        }}
      >
        Ir al contenido
      </a>
      <header className="site-header" ref={headerRef}>
        <div className="header-inner">
          <Brand />
          <nav
            className={menu ? "main-nav open" : "main-nav"}
            onClick={() => setMenu(false)}
          >
            {labInfo.map((l) => (
              <NavLink to={l.path} key={l.path}>
                <l.icon size={14} />
                {l.name}
              </NavLink>
            ))}
            <NavLink className="nav-reference" to="/bibliografia">
              <BookOpen size={14} />
              <span>Referencias</span>
            </NavLink>
          </nav>
          <button
            className="icon-button mobile-menu"
            aria-label={menu ? "Cerrar menú" : "Abrir menú"}
            onClick={() => setMenu(!menu)}
          >
            {menu ? <X /> : <Menu />}
          </button>
        </div>
      </header>
      <main
        id="main-content"
        className={isTwin ? "main-workbench" : ""}
        tabIndex={-1}
      >
        {home ? (
          <Suspense
            fallback={
              <div className="page-loading">
                <span className="loading-orbit" />
                Preparando los laboratorios…
              </div>
            }
          >
            <Home />
          </Suspense>
        ) : (
          <Outlet />
        )}
      </main>
      <footer className={`site-footer ${isTwin ? "workbench-footer" : ""}`}>
        <div className="container lab-footer">
          <div className="footer-institution">
            <img
              src={assetUrl("/brand/imf-sello.jpg")}
              alt="Sello del Instituto Mexicano de Flebología"
              width="1080"
              height="1080"
            />
            <span>
              <b>FLEBOLAB</b>
              <small>Instituto Mexicano de Flebología</small>
            </span>
          </div>
          <div>
            <Link to="/recorridos">Recorridos</Link>
            <Link to="/glosario">Glosario</Link>
            <Link to="/fuentes">Método</Link>
            <Link to="/creditos">Créditos</Link>
            <Link to="/guia">Ayuda</Link>
            <a
              href="https://github.com/imf-hub/flebolab"
              target="_blank"
              rel="noreferrer"
              aria-label="Código en GitHub"
            >
              <Github size={15} />
            </a>
          </div>
          <small>Educación médica · Unidades relativas</small>
        </div>
      </footer>
    </MotionConfig>
  );
}
