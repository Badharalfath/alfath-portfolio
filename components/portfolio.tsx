"use client";

import {
  AnimatePresence,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useSpring,
} from "motion/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
  type RefObject,
} from "react";
import {
  contact,
  credentials,
  education,
  portfolioDocuments,
  projects,
  skills,
  type PortfolioDocument,
  type Project,
} from "@/lib/content";

gsap.registerPlugin(ScrollTrigger);

const navItems = [
  ["About", "#about"],
  ["Skills", "#skills"],
  ["Work", "#work"],
  ["Education", "#education"],
  ["Contact", "#contact"],
] as const;

const aboutTimeline = [
  { years: "2018–2021", title: "Vocational School", detail: "SMK Medikacom" },
  { years: "2021–2026", title: "University", detail: "UNIKOM" },
  { years: "2025", title: "Internship", detail: "Web development practice" },
] as const;

type NavHref = (typeof navItems)[number][1];

type MotionPreference = {
  reducedMotion: boolean;
};

const MotionPreferenceContext = createContext<MotionPreference>({
  reducedMotion: false,
});
const fullMotionPreference: MotionPreference = { reducedMotion: false };

function useExperienceMotion() {
  return useContext(MotionPreferenceContext);
}

function prefersReducedMotion() {
  return document.documentElement.dataset.motion === "reduced";
}

function NavGlyph({ href }: { href: NavHref }) {
  const path =
    href === "#about" ? (
      <>
        <circle cx="12" cy="8" r="3" />
        <path d="M6.5 19c.7-3.1 2.5-4.7 5.5-4.7s4.8 1.6 5.5 4.7" />
      </>
    ) : href === "#skills" ? (
      <>
        <rect x="5" y="5" width="5" height="5" rx="1" />
        <rect x="14" y="5" width="5" height="5" rx="1" />
        <rect x="5" y="14" width="5" height="5" rx="1" />
        <rect x="14" y="14" width="5" height="5" rx="1" />
      </>
    ) : href === "#work" ? (
      <>
        <path d="M4.5 8.5h15v10h-15z" />
        <path d="M9 8.5V6h6v2.5M4.5 12h15" />
      </>
    ) : href === "#education" ? (
      <>
        <path d="m3.5 9 8.5-4 8.5 4-8.5 4z" />
        <path d="M7 11v5.2c3.3 2 6.7 2 10 0V11M20.5 9v6" />
      </>
    ) : (
      <>
        <path d="M4 6.5h16v11H4z" />
        <path d="m4.5 7 7.5 6 7.5-6" />
      </>
    );

  return (
    <svg
      className="nav-glyph"
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {path}
    </svg>
  );
}

function useNavIndicator({
  activeHref,
  axis,
  indicatorRef,
  layoutRef,
  reducedMotion,
}: {
  activeHref: NavHref;
  axis: "horizontal" | "vertical";
  indicatorRef: RefObject<HTMLSpanElement | null>;
  layoutRef: RefObject<HTMLDivElement | null>;
  reducedMotion: boolean;
}) {
  const readyRef = useRef(false);
  const animationRef = useRef<Animation | null>(null);
  const positionRef = useRef<{
    height: number;
    left: number;
    top: number;
    width: number;
  } | null>(null);

  useLayoutEffect(() => {
    const layout = layoutRef.current;
    const indicator = indicatorRef.current;
    const target = layout?.querySelector<HTMLElement>(
      `[data-nav-href="${activeHref}"]`,
    );
    if (!layout || !indicator || !target) return;

    const syncIndicator = (animate: boolean) => {
      const previous = positionRef.current;
      const next = {
        height: target.offsetHeight,
        left: target.offsetLeft,
        top: target.offsetTop,
        width: target.offsetWidth,
      };
      const previousPosition = previous ?? next;
      const targetTransform = `translate3d(${next.left}px, ${next.top}px, 0)`;

      animationRef.current?.cancel();
      indicator.style.width = `${next.width}px`;
      indicator.style.height = `${next.height}px`;
      indicator.style.transform = targetTransform;
      indicator.style.opacity = "1";

      if (animate && previous) {
        const middleLeft = (previous.left + next.left) / 2;
        const middleTop = (previous.top + next.top) / 2;
        const stretch =
          axis === "horizontal" ? "scaleX(1.24)" : "scaleY(1.52)";

        animationRef.current = indicator.animate(
          reducedMotion
            ? [
                { opacity: 0.36, transform: targetTransform },
                { opacity: 1, transform: targetTransform },
              ]
            : [
                {
                  borderRadius: "999px",
                  height: `${previousPosition.height}px`,
                  transform: `translate3d(${previousPosition.left}px, ${previousPosition.top}px, 0)`,
                  width: `${previousPosition.width}px`,
                },
                {
                  borderRadius: "40% 60% 56% 44% / 58% 42% 58% 42%",
                  transform: `translate3d(${middleLeft}px, ${middleTop}px, 0) ${stretch}`,
                  offset: 0.52,
                },
                {
                  borderRadius: "999px",
                  height: `${next.height}px`,
                  transform: targetTransform,
                  width: `${next.width}px`,
                },
              ],
          {
            duration: reducedMotion ? 220 : 640,
            easing: reducedMotion
              ? "ease-out"
              : "cubic-bezier(0.76, 0, 0.24, 1)",
          },
        );
      }

      positionRef.current = next;
    };

    syncIndicator(readyRef.current);
    readyRef.current = true;

    const handleResize = () => syncIndicator(false);
    window.addEventListener("resize", handleResize);

    return () => {
      animationRef.current?.cancel();
      window.removeEventListener("resize", handleResize);
    };
  }, [activeHref, axis, indicatorRef, layoutRef, reducedMotion]);
}

function CommandNavigation({
  inactive,
  activeHref,
  onNavigate,
}: {
  inactive: boolean;
  activeHref: NavHref;
  onNavigate: (href: string) => void;
}) {
  const { reducedMotion } = useExperienceMotion();
  const horizontalRef = useRef<HTMLDivElement>(null);
  const horizontalLayoutRef = useRef<HTMLDivElement>(null);
  const horizontalIndicatorRef = useRef<HTMLSpanElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const railLayoutRef = useRef<HTMLDivElement>(null);
  const railIndicatorRef = useRef<HTMLSpanElement>(null);
  const [railActive, setRailActive] = useState(false);
  const railActiveRef = useRef(false);

  useNavIndicator({
    activeHref,
    axis: "horizontal",
    indicatorRef: horizontalIndicatorRef,
    layoutRef: horizontalLayoutRef,
    reducedMotion,
  });
  useNavIndicator({
    activeHref,
    axis: "vertical",
    indicatorRef: railIndicatorRef,
    layoutRef: railLayoutRef,
    reducedMotion,
  });

  useLayoutEffect(() => {
    const horizontal = horizontalRef.current;
    const rail = railRef.current;
    const hero = document.querySelector<HTMLElement>("#top");
    if (!horizontal || !rail || !hero) return;

    const media = gsap.matchMedia();

    media.add("(min-width: 768px)", () => {
      gsap.set(horizontal, { autoAlpha: 1, yPercent: 0 });
      gsap.set(rail, {
        autoAlpha: 0,
        y: reducedMotion ? 0 : 20,
      });

      const timeline = gsap
        .timeline({ paused: true })
        .to(horizontal, {
          autoAlpha: 0,
          duration: reducedMotion ? 0.22 : 0.4,
          ease: reducedMotion ? "power1.out" : "power3.inOut",
          yPercent: reducedMotion ? 0 : -100,
        })
        .to(
          rail,
          {
            autoAlpha: 1,
            duration: reducedMotion ? 0.22 : 0.4,
            ease: reducedMotion ? "power1.out" : "power3.out",
            y: 0,
          },
          reducedMotion ? "-=0.12" : "-=0.18",
        );

      const updateRailState = (next: boolean) => {
        if (railActiveRef.current === next) return;
        railActiveRef.current = next;
        setRailActive(next);
      };

      const trigger = ScrollTrigger.create({
        trigger: hero,
        start: "bottom top",
        onEnter: () => {
          updateRailState(true);
          timeline.play();
        },
        onLeaveBack: () => {
          updateRailState(false);
          timeline.reverse();
        },
        onRefresh: (self) => {
          const pastHero = window.scrollY >= self.start;
          updateRailState(pastHero);
          timeline.progress(pastHero ? 1 : 0).pause();
        },
        refreshPriority: 55,
      });

      return () => {
        trigger.kill();
        timeline.kill();
      };
    });

    return () => media.revert();
  }, [reducedMotion]);

  const navigate = (href: string) => (event: ReactMouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    onNavigate(href);
  };

  return (
    <nav
      className="nav-experience"
      aria-label="Primary navigation"
      aria-hidden={inactive}
      inert={inactive}
    >
      <div
        ref={horizontalRef}
        className="nav-command"
        aria-hidden={railActive}
        inert={railActive}
      >
        <div ref={horizontalLayoutRef} className="nav-command__layout">
          <span
            ref={horizontalIndicatorRef}
            className="nav-command__active"
            aria-hidden="true"
          />

          <a
            className="nav-command__brand"
            href="#top"
            aria-label="Alfath, back to top"
            onClick={navigate("#top")}
          >
            <span className="nav-command__brand-mark">
              AP<span aria-hidden="true">.</span>
            </span>
          </a>

          {navItems.map(([label, href]) => {
            const active = href === activeHref;

            return (
              <a
                key={href}
                className={`nav-command__item${active ? " is-active" : ""}`}
                href={href}
                aria-label={`Go to ${label}`}
                aria-current={active ? "location" : undefined}
                data-nav-href={href}
                onClick={navigate(href)}
              >
                <NavGlyph href={href} />
                <span className="nav-command__label">{label}</span>
              </a>
            );
          })}
        </div>
      </div>

      <div
        ref={railRef}
        className="nav-rail"
        aria-hidden={!railActive}
        inert={!railActive}
      >
        <div ref={railLayoutRef} className="nav-rail__layout">
          <span
            ref={railIndicatorRef}
            className="nav-rail__active"
            aria-hidden="true"
          />

          <a
            className="nav-rail__brand"
            href="#top"
            aria-label="Alfath, back to top"
            onClick={navigate("#top")}
          >
            <span>AP</span>
          </a>

          {navItems.map(([label, href]) => {
            const active = href === activeHref;

            return (
              <a
                key={href}
                className={`nav-rail__item${active ? " is-active" : ""}`}
                href={href}
                aria-label={`Go to ${label}`}
                aria-current={active ? "location" : undefined}
                data-nav-href={href}
                data-motion-hover="rail"
                onClick={navigate(href)}
              >
                <NavGlyph href={href} />
                <span className="nav-rail__tooltip">{label}</span>
              </a>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

function MobileHeader({
  visible,
  activeHref,
  onNavigate,
}: {
  visible: boolean;
  activeHref: NavHref;
  onNavigate: (href: string) => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { reducedMotion } = useExperienceMotion();
  const headerRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLElement>(null);
  const previousOpenRef = useRef(false);
  const restoreFocusRef = useRef(true);

  useLayoutEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    if (menuOpen) {
      gsap.set(header, { clearProps: "transform" });
      return;
    }

    const tween = gsap.to(header, {
      y: visible ? 0 : -92,
      duration: reducedMotion ? 0 : 0.78,
      ease: reducedMotion ? "none" : "power3.inOut",
      overwrite: "auto",
    });

    return () => {
      tween.kill();
    };
  }, [menuOpen, reducedMotion, visible]);

  const focusDestination = (href: string) => {
    window.requestAnimationFrame(() => {
      const destination = document.querySelector<HTMLElement>(href);
      if (!destination) return;

      destination.tabIndex = -1;
      destination.focus({ preventScroll: true });
      destination.addEventListener(
        "blur",
        () => destination.removeAttribute("tabindex"),
        { once: true },
      );
    });
  };

  const navigateFromHeader = (href: string) => {
    const navigate = () => {
      onNavigate(href);
      focusDestination(href);
    };

    restoreFocusRef.current = false;

    if (!menuOpen) {
      navigate();
      return;
    }

    setMenuOpen(false);
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(navigate);
    });
  };

  useEffect(() => {
    if (!menuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const frame = window.requestAnimationFrame(() => {
      menuRef.current?.querySelector<HTMLAnchorElement>("a")?.focus();
    });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        restoreFocusRef.current = true;
        setMenuOpen(false);
        return;
      }

      if (event.key !== "Tab") return;

      const focusable = Array.from(
        headerRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled])',
        ) ?? [],
      ).filter((element) => !element.hasAttribute("inert"));
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      window.cancelAnimationFrame(frame);
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuOpen]);

  useEffect(() => {
    if (previousOpenRef.current && !menuOpen && restoreFocusRef.current) {
      window.requestAnimationFrame(() => toggleRef.current?.focus());
    }

    if (!menuOpen) restoreFocusRef.current = true;
    previousOpenRef.current = menuOpen;
  }, [menuOpen]);

  return (
    <header
      ref={headerRef}
      className="site-header shell"
      data-visible={visible || menuOpen}
      data-menu-open={menuOpen}
    >
      <a
        className="brand-mark"
        href="#top"
        aria-label="Alfath, back to top"
        data-motion-hover="link"
        onClick={(event) => {
          event.preventDefault();
          navigateFromHeader("#top");
        }}
      >
        AP<span aria-hidden="true">.</span>
      </a>

      <button
        ref={toggleRef}
        className="menu-toggle"
        type="button"
        aria-expanded={menuOpen}
        aria-controls="mobile-menu"
        onClick={() => {
          restoreFocusRef.current = true;
          setMenuOpen((open) => !open);
        }}
      >
        <span>{menuOpen ? "Close" : "Menu"}</span>
        <span className="menu-glyph" aria-hidden="true">
          {menuOpen ? "×" : "+"}
        </span>
      </button>

      <AnimatePresence>
        {menuOpen ? (
          <motion.nav
            ref={menuRef}
            id="mobile-menu"
            className="mobile-nav"
            aria-label="Mobile navigation"
            initial={
              reducedMotion
                ? { opacity: 0 }
                : { opacity: 0, y: -12 }
            }
            animate={
              reducedMotion
                ? { opacity: 1 }
                : { opacity: 1, y: 0 }
            }
            exit={
              reducedMotion
                ? { opacity: 0 }
                : { opacity: 0, y: -12 }
            }
            transition={{
              duration: reducedMotion ? 0.12 : 0.28,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {navItems.map(([label, href], index) => (
              <motion.a
                key={href}
                href={href}
                aria-current={activeHref === href ? "location" : undefined}
                onClick={(event) => {
                  event.preventDefault();
                  navigateFromHeader(href);
                }}
                initial={reducedMotion ? undefined : { x: -18, opacity: 0 }}
                animate={reducedMotion ? undefined : { x: 0, opacity: 1 }}
                transition={{
                  delay: reducedMotion ? 0 : 0.04 + index * 0.03,
                  duration: reducedMotion ? 0 : 0.2,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <span className="mobile-nav__glyph">
                  <NavGlyph href={href} />
                </span>
                <strong>{label}</strong>
              </motion.a>
            ))}
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </header>
  );
}

function MagneticLink({
  href,
  children,
  className = "",
  external = false,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  external?: boolean;
}) {
  const { reducedMotion } = useExperienceMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 260, damping: 18, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 260, damping: 18, mass: 0.4 });

  const handleMove = (event: ReactPointerEvent<HTMLAnchorElement>) => {
    if (reducedMotion || event.pointerType !== "mouse") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    x.set((event.clientX - bounds.left - bounds.width / 2) * 0.18);
    y.set((event.clientY - bounds.top - bounds.height / 2) * 0.18);
  };

  return (
    <motion.a
      className={className}
      href={href}
      style={{ x: springX, y: springY }}
      onPointerMove={handleMove}
      onPointerLeave={() => {
        if (reducedMotion) return;
        x.set(0);
        y.set(0);
      }}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
    >
      {children}
    </motion.a>
  );
}

function ProjectGrid({ onOpen }: { onOpen: (project: Project) => void }) {
  return (
    <section id="work" className="project-reel" aria-labelledby="work-title">
      <div className="reel-header shell">
        <p className="meta">Six projects · Select one for details</p>
        <h2 id="work-title">My projects</h2>
      </div>

      <div className="reel-track">
        {projects.map((project) => (
          <button
            key={project.number}
            className={`project-panel project-panel--${project.tone}`}
            type="button"
            aria-label={`Open project ${project.number}: ${project.title}`}
            onClick={() => onOpen(project)}
          >
            <span
              className="project-panel__motion"
              data-motion-hover="panel-content"
            >
              <span className="project-panel__top">
                <span className="meta">Case #{project.number}</span>
                <span className="project-open">Open ↗</span>
              </span>
              <strong>{project.title}</strong>
              <span className="project-panel__bottom">
                <span className="project-panel__summary">
                  {project.description}
                </span>
                <span className="project-tags" aria-label="Project topics">
                  {project.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </span>
              </span>
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}

function ProjectDialog({
  project,
  onClose,
}: {
  project: Project | null;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (!project) {
      if (dialog.open) dialog.close();
      return;
    }

    if (!dialog.open) dialog.showModal();

    const card = dialog.querySelector<HTMLElement>(".project-dialog__card");
    if (!card) return;

    const context = gsap.context(() => {
      const reducedMotion = prefersReducedMotion();
      const timeline = gsap.timeline({ defaults: { ease: "power4.out" } });

      timeline
        .fromTo(
          dialog,
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: reducedMotion ? 0.28 : 0.34 },
        )
        .fromTo(
          card,
          reducedMotion
            ? { scale: 0.985, autoAlpha: 0 }
            : { y: 48, scaleX: 0.96, scaleY: 0.9, rotation: -0.6, autoAlpha: 0 },
          reducedMotion
            ? { scale: 1, autoAlpha: 1, duration: 0.42, ease: "power2.out" }
            : {
              y: 0,
              scaleX: 1.018,
              scaleY: 0.99,
              rotation: 0,
              autoAlpha: 1,
              duration: 0.58,
            },
          0,
        )
        .fromTo(
          ".dialog-animate-item",
          reducedMotion ? { autoAlpha: 0.45 } : { y: 16, autoAlpha: 0.25 },
          reducedMotion
            ? { autoAlpha: 1, duration: 0.32, stagger: 0.025, ease: "power2.out" }
            : { y: 0, autoAlpha: 1, duration: 0.4, stagger: 0.055 },
          reducedMotion ? 0.08 : 0.16,
        );

      if (!reducedMotion) {
        timeline.to(
          card,
          { scaleX: 1, scaleY: 1, duration: 0.2, ease: "power2.out" },
          0.48,
        );
      }
    }, dialog);

    return () => context.revert();
  }, [project]);

  const closeDialog = () => {
    const dialog = dialogRef.current;
    const card = dialog?.querySelector<HTMLElement>(".project-dialog__card");
    if (!dialog?.open) return;

    if (!card) {
      dialog.close();
      return;
    }

    const reducedMotion = prefersReducedMotion();
    gsap.killTweensOf([dialog, card]);
    gsap
      .timeline({ onComplete: () => dialog.close() })
      .to(card, {
        y: reducedMotion ? 0 : 24,
        scale: reducedMotion ? 0.99 : 0.95,
        rotation: reducedMotion ? 0 : 0.4,
        autoAlpha: 0,
        duration: reducedMotion ? 0.24 : 0.3,
        ease: "power3.in",
      })
      .to(
        dialog,
        { autoAlpha: 0, duration: reducedMotion ? 0.22 : 0.28, ease: "power2.in" },
        0,
      );
  };

  return (
    <dialog
      ref={dialogRef}
      className="project-dialog"
      data-interactive-motion="true"
      aria-labelledby="dialog-title"
      onClose={onClose}
      onCancel={(event) => {
        event.preventDefault();
        closeDialog();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) closeDialog();
      }}
    >
      {project ? (
        <div className="project-dialog__card">
          <div className="dialog-topline dialog-animate-item">
            <span className="meta">Case #{project.number}</span>
            <button
              type="button"
              data-motion-hover="button"
              onClick={closeDialog}
              autoFocus
            >
              Close ×
            </button>
          </div>
          <h2 id="dialog-title" className="dialog-animate-item">
            {project.title}
          </h2>
          <p className="dialog-animate-item">{project.description}</p>
          <ul className="dialog-tags dialog-animate-item" aria-label="Project topics">
            {project.tags.map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>
          <MagneticLink
            className="button button--dark dialog-animate-item"
            href={`mailto:${contact.email}?subject=${encodeURIComponent(`Let's talk about ${project.title}`)}`}
          >
            Ask me about this project <span aria-hidden="true">↗</span>
          </MagneticLink>
        </div>
      ) : null}
    </dialog>
  );
}

function DocumentDialog({
  document,
  onClose,
}: {
  document: PortfolioDocument | null;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [viewerDocumentId, setViewerDocumentId] = useState<string | null>(null);
  const pdfViewerEnabled = document?.pdfViewerEnabled !== false;
  const viewPdf = document ? pdfViewerEnabled && viewerDocumentId === document.id : false;

  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (!document) {
      if (dialog.open) dialog.close();
      return;
    }

    if (!dialog.open) dialog.showModal();
  }, [document]);

  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    if (!document || !dialog?.open) return;

    const panel = dialog.querySelector<HTMLElement>(
      viewPdf ? ".pdf-viewer-card" : ".document-dialog__card",
    );
    if (!panel) return;

    const context = gsap.context(() => {
      const reducedMotion = prefersReducedMotion();
      const timeline = gsap.timeline({ defaults: { ease: "power4.out" } });

      timeline
        .fromTo(
          dialog,
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: reducedMotion ? 0.26 : 0.32 },
        )
        .fromTo(
          panel,
          reducedMotion
            ? { scale: 0.985, autoAlpha: 0 }
            : {
              y: viewPdf ? 28 : 44,
              scaleX: viewPdf ? 0.98 : 0.96,
              scaleY: viewPdf ? 0.97 : 0.91,
              rotation: viewPdf ? 0.25 : -0.5,
              autoAlpha: 0,
            },
          reducedMotion
            ? { scale: 1, autoAlpha: 1, duration: 0.4, ease: "power2.out" }
            : {
              y: 0,
              scaleX: 1.014,
              scaleY: 0.992,
              rotation: 0,
              autoAlpha: 1,
              duration: viewPdf ? 0.5 : 0.58,
            },
          0,
        );

      if (!viewPdf) {
        timeline.fromTo(
          ".document-animate-item",
          reducedMotion ? { autoAlpha: 0.45 } : { y: 14, autoAlpha: 0.3 },
          reducedMotion
            ? { autoAlpha: 1, duration: 0.3, stagger: 0.025, ease: "power2.out" }
            : { y: 0, autoAlpha: 1, duration: 0.38, stagger: 0.05 },
          reducedMotion ? 0.08 : 0.14,
        );
      }

      if (!reducedMotion) {
        timeline.to(
          panel,
          { scaleX: 1, scaleY: 1, duration: 0.18, ease: "power2.out" },
          viewPdf ? 0.42 : 0.48,
        );
      }
    }, dialog);

    return () => context.revert();
  }, [document, viewPdf]);

  const transitionView = (nextView: boolean) => {
    const dialog = dialogRef.current;
    const panel = dialog?.querySelector<HTMLElement>(
      viewPdf ? ".pdf-viewer-card" : ".document-dialog__card",
    );

    if (!panel) {
      setViewerDocumentId(nextView ? document?.id ?? null : null);
      return;
    }

    const reducedMotion = prefersReducedMotion();
    gsap.to(panel, {
      y: reducedMotion ? 0 : nextView ? -18 : 18,
      scale: reducedMotion ? 0.99 : 0.97,
      autoAlpha: 0,
      duration: reducedMotion ? 0.22 : 0.28,
      ease: "power3.in",
      onComplete: () => setViewerDocumentId(nextView ? document?.id ?? null : null),
    });
  };

  const closeDialog = () => {
    const dialog = dialogRef.current;
    const panel = dialog?.querySelector<HTMLElement>(
      viewPdf ? ".pdf-viewer-card" : ".document-dialog__card",
    );
    if (!dialog?.open) return;

    if (!panel) {
      dialog.close();
      return;
    }

    const reducedMotion = prefersReducedMotion();
    gsap.killTweensOf([dialog, panel]);
    gsap
      .timeline({ onComplete: () => dialog.close() })
      .to(panel, {
        y: reducedMotion ? 0 : 22,
        scale: reducedMotion ? 0.99 : 0.96,
        rotation: reducedMotion ? 0 : 0.35,
        autoAlpha: 0,
        duration: reducedMotion ? 0.24 : 0.3,
        ease: "power3.in",
      })
      .to(
        dialog,
        { autoAlpha: 0, duration: reducedMotion ? 0.22 : 0.28, ease: "power2.in" },
        0,
      );
  };

  return (
    <dialog
      ref={dialogRef}
      className={`document-dialog${viewPdf ? " document-dialog--viewer" : ""}`}
      data-interactive-motion="true"
      aria-labelledby="document-dialog-title"
      onClose={onClose}
      onCancel={(event) => {
        event.preventDefault();
        closeDialog();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) closeDialog();
      }}
    >
      {document ? (
        viewPdf ? (
          <div className="pdf-viewer-card">
            <div className="pdf-viewer-toolbar">
              <button
                type="button"
                data-motion-hover="link"
                onClick={() => transitionView(false)}
              >
                ← Details
              </button>
              <p id="document-dialog-title">{document.title}</p>
              <div>
                <a href={document.pdf} target="_blank" rel="noreferrer">
                  Open in new tab ↗
                </a>
                <button type="button" data-motion-hover="link" onClick={closeDialog}>
                  Close ×
                </button>
              </div>
            </div>
            <iframe
              className="pdf-frame"
              src={`${document.pdf}#view=FitH&toolbar=1`}
              title={`${document.title} PDF`}
            >
              <p>
                Your browser cannot display this PDF.{" "}
                <a href={document.pdf} target="_blank" rel="noreferrer">
                  Open the document in a new tab.
                </a>
              </p>
            </iframe>
          </div>
        ) : (
          <div className="document-dialog__card">
            <div className="dialog-topline document-animate-item">
              <span className="meta">Document details</span>
              <button
                type="button"
                data-motion-hover="button"
                onClick={closeDialog}
                autoFocus
              >
                Close ×
              </button>
            </div>
            <h2 id="document-dialog-title" className="document-animate-item">
              {document.title}
            </h2>
            <p className="document-summary document-animate-item">{document.summary}</p>
            <dl className="document-meta document-animate-item">
              <div>
                <dt>Issuer</dt>
                <dd>{document.issuer}</dd>
              </div>
              <div>
                <dt>Issued</dt>
                <dd>{document.issued}</dd>
              </div>
              <div>
                <dt>{document.identifierLabel}</dt>
                <dd>{document.identifier}</dd>
              </div>
              {document.secondary ? (
                <div>
                  <dt>Additional information</dt>
                  <dd>{document.secondary}</dd>
                </div>
              ) : null}
            </dl>
            {document.privacyNote ? (
              <p className="document-privacy-note document-animate-item">
                <strong>Privacy note:</strong> {document.privacyNote}
              </p>
            ) : null}
            {pdfViewerEnabled ? (
              <div className="document-actions document-animate-item">
                <button
                  className="button button--dark"
                  type="button"
                  data-motion-hover="button"
                  onClick={() => transitionView(true)}
                >
                  View PDF <span aria-hidden="true">↗</span>
                </button>
                <a
                  className="document-new-tab"
                  href={document.pdf}
                  target="_blank"
                  rel="noreferrer"
                >
                  Open directly in a new tab
                </a>
              </div>
            ) : null}
          </div>
        )
      ) : null}
    </dialog>
  );
}

export function Portfolio() {
  const rootRef = useRef<HTMLElement>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [activeDocument, setActiveDocument] = useState<PortfolioDocument | null>(null);
  const [activeSection, setActiveSection] = useState<NavHref>("#about");
  const [navVisible, setNavVisible] = useState(true);
  const navVisibleRef = useRef(true);
  const navHideThresholdRef = useRef(320);
  const scrollDirectionRef = useRef<"up" | "down">("up");
  const pointerNearNavRef = useRef(false);
  const navHideTimerRef = useRef<number | null>(null);
  const reducedMotion = false;
  const { scrollY, scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 32,
    mass: 0.22,
  });
  const progress = smoothProgress;

  useEffect(() => {
    document.documentElement.dataset.motion = "full";
    delete document.documentElement.dataset.motionMode;
  }, []);

  const clearNavHideTimer = useCallback(() => {
    if (navHideTimerRef.current === null) return;
    window.clearTimeout(navHideTimerRef.current);
    navHideTimerRef.current = null;
  }, []);

  const updateNavVisibility = useCallback((visible: boolean) => {
    if (navVisibleRef.current === visible) return;
    navVisibleRef.current = visible;
    setNavVisible(visible);
  }, []);

  useEffect(() => {
    const hero = rootRef.current?.querySelector<HTMLElement>("#top");
    if (!hero) return;

    const measure = () => {
      navHideThresholdRef.current = Math.max(320, hero.offsetHeight - 96);
    };
    const observer = new ResizeObserver(measure);

    measure();
    observer.observe(hero);

    return () => observer.disconnect();
  }, []);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? latest;
    const delta = latest - previous;

    clearNavHideTimer();

    if (latest <= navHideThresholdRef.current) {
      scrollDirectionRef.current = "up";
      updateNavVisibility(true);
      return;
    }

    if (Math.abs(delta) < 5) return;

    const direction = delta > 0 ? "down" : "up";
    scrollDirectionRef.current = direction;
    updateNavVisibility(pointerNearNavRef.current || direction === "up");
  });

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;

      const nearNav = event.clientY <= 104;
      pointerNearNavRef.current = nearNav;
      clearNavHideTimer();

      if (nearNav) {
        updateNavVisibility(true);
        return;
      }

      if (
        scrollDirectionRef.current === "down" &&
        scrollY.get() > navHideThresholdRef.current
      ) {
        navHideTimerRef.current = window.setTimeout(() => {
          updateNavVisibility(false);
          navHideTimerRef.current = null;
        }, 420);
      }
    };

    const handleFocusIn = (event: FocusEvent) => {
      const target = event.target;
      if (
        target instanceof Element &&
        target.closest(".nav-command, .site-header")
      ) {
        clearNavHideTimer();
        updateNavVisibility(true);
      }
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    document.addEventListener("focusin", handleFocusIn);

    return () => {
      clearNavHideTimer();
      window.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("focusin", handleFocusIn);
    };
  }, [clearNavHideTimer, scrollY, updateNavVisibility]);

  const scrollToSection = useCallback((href: string) => {
    const target = document.querySelector<HTMLElement>(href);
    if (!target) return;

    const scrollOffset =
      Number.parseFloat(
        window
          .getComputedStyle(document.documentElement)
          .getPropertyValue("--nav-scroll-offset"),
      ) || 84;
    const targetTop = Math.max(
      0,
      target.getBoundingClientRect().top +
        window.scrollY -
        (href === "#top" ? 0 : scrollOffset),
    );

    if (reducedMotion) {
      window.scrollTo({ top: targetTop, behavior: "auto" });
    } else if (lenisRef.current) {
      lenisRef.current.resize();
      lenisRef.current.scrollTo(targetTop, {
        duration: 1.6,
        easing: (time) => 0.5 - Math.cos(Math.PI * time) / 2,
        force: true,
      });
    } else {
      window.scrollTo({ top: targetTop, behavior: "smooth" });
    }

    window.history.replaceState(null, "", href);
  }, [reducedMotion]);

  useEffect(() => {
    const shouldReduceMotion = Boolean(reducedMotion);

    const lenis = new Lenis({
      anchors: false,
      duration: 1.4,
      smoothWheel: !shouldReduceMotion,
      wheelMultiplier: 0.9,
    });
    lenisRef.current = lenis;
    const update = (time: number) => lenis.raf(time * 1000);

    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.off("scroll", ScrollTrigger.update);
      gsap.ticker.remove(update);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [reducedMotion]);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const media = gsap.matchMedia();
    const select = gsap.utils.selector(root);

    media.add(
      {
        desktop: "(min-width: 901px)",
        compact: "(min-width: 768px) and (max-width: 900px)",
        mobile: "(max-width: 767px)",
      },
      (matchContext) => {
        const isDesktop = Boolean(matchContext.conditions?.desktop);
        const isMobile = Boolean(matchContext.conditions?.mobile);
        const travel = reducedMotion ? 0 : isMobile ? 0.55 : 1;
        const motionAngle =
          Number.parseFloat(
            window
              .getComputedStyle(document.documentElement)
              .getPropertyValue("--motion-angle"),
          ) || 12;
        const motionCut =
          Number.parseFloat(
            window
              .getComputedStyle(document.documentElement)
              .getPropertyValue("--motion-cut"),
          ) || 12;
        const fullClip = "polygon(0 0, 100% 0, 100% 100%, 0 100%)";
        const clipFromLeft = reducedMotion
          ? fullClip
          : `polygon(0 0, 0 0, ${motionCut}% 100%, 0 100%)`;
        const clipFromRight = reducedMotion
          ? fullClip
          : `polygon(100% 0, 100% 0, 100% 100%, ${100 - motionCut}% 100%)`;

      const heroEntrance = gsap.timeline({
        defaults: { ease: "power4.out" },
      });

      heroEntrance
        .from(select(".nav-command"), {
          autoAlpha: 0,
          duration: 0.42,
        })
        .from(select(".site-header > *"), {
          y: -18 * travel,
          autoAlpha: 0.25,
          duration: 0.48,
          stagger: 0.055,
        }, 0)
        .from(
          select(".hero__intro > *"),
          {
            y: 22 * travel,
            autoAlpha: 0.25,
            duration: 0.52,
            stagger: 0.08,
          },
          0.08,
        )
        .from(
          select(".hero-word__text"),
          {
            yPercent: 110 * travel,
            autoAlpha: reducedMotion ? 0.2 : 1,
            clipPath: reducedMotion
              ? "inset(0 0 0 0)"
              : "inset(0 0 100% 0)",
            duration: 0.78,
            stagger: 0.095,
            clearProps: "clipPath",
          },
          0.1,
        )
        .from(
          select(".hero__summary"),
          { y: 18 * travel, autoAlpha: 0.25, duration: 0.52 },
          0.42,
        )
        .from(
          select(".hero-portrait"),
          {
            x: 38 * travel,
            rotation: 1.5 * travel,
            autoAlpha: 0.25,
            duration: 0.68,
          },
          0.2,
        )
        .from(
          select(".hero__footer > *"),
          {
            y: 18 * travel,
            autoAlpha: 0.3,
            duration: 0.44,
            stagger: 0.08,
          },
          0.42,
        );

        const hero = select("#top")[0];
        const heroWords = select(".hero-word");
        const heroExit = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: hero,
            start: "top top",
            end: "bottom top",
            scrub: isMobile ? 0.45 : 0.72,
            invalidateOnRefresh: true,
            refreshPriority: 60,
          },
        });

        heroExit
          .to(
            heroWords,
            {
              xPercent: (index) =>
                (index % 2 === 0 ? -11 : 13) * travel,
              yPercent: (index) => (index - 1) * 5 * travel,
              skewX: (index) =>
                (index % 2 === 0 ? -1 : 1) *
                (motionAngle / 3) *
                travel,
              duration: 1,
            },
            0,
          )
          .to(
            select(".hero-portrait"),
            {
              yPercent: 24 * travel,
              scale: reducedMotion ? 1 : isMobile ? 0.985 : 0.96,
              duration: 1,
            },
            0,
          )
          .to(
            select(".hero__intro"),
            { y: -20 * travel, autoAlpha: 0.25, duration: 0.7 },
            0,
          )
          .to(
            select(".hero__summary"),
            { xPercent: -7 * travel, duration: 0.7 },
            0.18,
          )
          .to(
            select(".hero__footer"),
            { y: 24 * travel, autoAlpha: 0, duration: 0.5 },
            0.38,
          );

        const about = select("#about")[0];
        const aboutTimeline = select(".about-timeline")[0];
        const aboutScene = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: about,
            start: "top 84%",
            end: "bottom 46%",
            scrub: isMobile ? 0.5 : 0.78,
            invalidateOnRefresh: true,
            refreshPriority: 50,
          },
        });

        aboutScene
          .fromTo(
            aboutTimeline,
            { "--about-progress": 0 },
            { "--about-progress": 1, duration: 0.9 },
            0,
          )
          .fromTo(
            select("#about h2"),
            {
              xPercent: -9 * travel,
              autoAlpha: 0.22,
              clipPath: clipFromLeft,
            },
            {
              xPercent: 0,
              autoAlpha: 1,
              clipPath: fullClip,
              duration: 0.42,
            },
            0,
          )
          .fromTo(
            select(".about__copy > p"),
            {
              x: 42 * travel,
              autoAlpha: 0.22,
              clipPath: clipFromRight,
            },
            {
              x: 0,
              autoAlpha: 1,
              clipPath: fullClip,
              duration: 0.42,
              stagger: 0.14,
            },
            0.08,
          )
          .from(
            select(".about-timeline__stop"),
            {
              x: -28 * travel,
              y: 30 * travel,
              autoAlpha: 0.18,
              duration: 0.34,
              stagger: 0.16,
            },
            0.16,
          )
          .from(
            select(".about-timeline__tick"),
            {
              scaleX: 0,
              transformOrigin: "0 50%",
              duration: 0.24,
              stagger: 0.16,
            },
            0.2,
          )
          .from(
            select(".about__facts > div"),
            {
              y: 36 * travel,
              autoAlpha: 0.2,
              duration: 0.28,
              stagger: 0.1,
            },
            0.7,
          );

        const skillsSection = select("#skills")[0];
        const skillsScene = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: skillsSection,
            start: "top 84%",
            end: "bottom 38%",
            scrub: isMobile ? 0.5 : 0.82,
            invalidateOnRefresh: true,
            refreshPriority: 40,
          },
        });

        skillsScene
          .fromTo(
            select("#skills .section-heading h2"),
            {
              xPercent: -10 * travel,
              autoAlpha: 0.2,
              clipPath: clipFromLeft,
            },
            {
              xPercent: 0,
              autoAlpha: 1,
              clipPath: fullClip,
              duration: 0.35,
            },
            0,
          )
          .from(
            select("#skills .section-heading > p"),
            {
              x: 44 * travel,
              autoAlpha: 0.2,
              duration: 0.34,
            },
            0.05,
          )
          .fromTo(
            select(".skills__ticks"),
            { xPercent: 3 * travel, yPercent: -12 * travel },
            {
              xPercent: -3 * travel,
              yPercent: 14 * travel,
              duration: 1.2,
            },
            0,
          );

        const skillGroups = gsap.utils.toArray<HTMLElement>(
          ".skill-group",
          root,
        );
        skillGroups.forEach((group, index) => {
          const intro = group.querySelector(".skill-group__intro");
          const tags = group.querySelector(".skill-tags");
          const chips = group.querySelectorAll(".skill-tags > span");
          const position = 0.18 + index * 0.27;

          skillsScene
            .fromTo(
              intro,
              {
                x: -54 * travel,
                autoAlpha: 0.2,
                clipPath: clipFromLeft,
              },
              {
                x: 0,
                autoAlpha: 1,
                clipPath: fullClip,
                duration: 0.32,
              },
              position,
            );

          gsap
            .timeline({
              defaults: { ease: "power4.out" },
              scrollTrigger: {
                trigger: tags,
                start: "top 88%",
                once: true,
                refreshPriority: 39 - index,
              },
            })
            .from(chips, {
              x: 30 * travel,
              y: (chipIndex) =>
                (chipIndex % 2 === 0 ? 14 : -10) * travel,
              rotation: (chipIndex) =>
                (chipIndex % 2 === 0 ? -2 : 2) * travel,
              autoAlpha: reducedMotion ? 0.75 : 0.2,
              duration: 0.46,
              stagger: 0.04,
              clearProps: "transform,opacity,visibility",
            });
        });

        const work = select("#work")[0];
        const panels = gsap.utils.toArray<HTMLElement>(
          ".project-panel",
          root,
        );
        const panelParts = select(
          ".project-panel__top, .project-panel__motion > strong, .project-panel__bottom",
        );
        const desktopPanelX = [-52, 42, 48, -46, 0, 48];
        const desktopPanelY = [-24, -42, 18, 46, 52, 44];
        const panelRotation = [-0.29, 0.23, -0.2, 0.18, -0.15, 0.27].map(
          (ratio) => ratio * motionAngle,
        );
        const workScene = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: work,
            start: isDesktop && !reducedMotion ? "top top" : "top 86%",
            end:
              isDesktop && !reducedMotion ? "+=140%" : "bottom 42%",
            pin: isDesktop && !reducedMotion,
            anticipatePin: isDesktop && !reducedMotion ? 1 : 0,
            scrub: isDesktop && !reducedMotion ? 0.9 : 0.55,
            invalidateOnRefresh: true,
            refreshPriority: 30,
          },
        });

        workScene
          .from(
            select(".reel-header > *"),
            {
              y: 28 * travel,
              autoAlpha: 0.2,
              duration: 0.28,
              stagger: 0.06,
            },
            0,
          );

        gsap
          .timeline({
            defaults: { ease: "power4.out" },
            scrollTrigger: {
              trigger: work,
              start: "top 84%",
              once: true,
              refreshPriority: 29,
            },
          })
          .from(
            panels,
            {
              xPercent: (index) =>
                (isDesktop
                  ? desktopPanelX[index]
                  : index % 2 === 0
                    ? -9
                    : 9) * travel,
              yPercent: (index) =>
                (isDesktop ? desktopPanelY[index] : 20 + index * 3) * travel,
              rotation: (index) =>
                panelRotation[index] * (isMobile ? 0.35 : 1) * travel,
              scale: reducedMotion ? 1 : isDesktop ? 0.84 : 0.96,
              autoAlpha: 0.2,
              duration: 0.66,
              stagger: { amount: isDesktop ? 0.4 : 0.2, from: "edges" },
              clearProps: "transform,opacity,visibility",
            },
            0,
          )
          .from(
            panelParts,
            {
              y: 18 * travel,
              autoAlpha: 0.12,
              duration: 0.26,
              stagger: 0.018,
              clearProps: "transform,opacity,visibility",
            },
            0.24,
          );

        const educationSection = select("#education")[0];
        const educationBlock = select(".education-block")[0];
        const educationScene = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: educationSection,
            endTrigger: educationBlock,
            start: "top 84%",
            end: "bottom 44%",
            scrub: isMobile ? 0.5 : 0.8,
            invalidateOnRefresh: true,
            refreshPriority: 20,
          },
        });

        educationScene
          .fromTo(
            select(".journey__intro h2"),
            {
              xPercent: -10 * travel,
              autoAlpha: 0.2,
              clipPath: clipFromLeft,
            },
            {
              xPercent: 0,
              autoAlpha: 1,
              clipPath: fullClip,
              duration: 0.34,
            },
            0,
          )
          .from(
            select(".journey__intro > p"),
            { x: 48 * travel, autoAlpha: 0.2, duration: 0.32 },
            0.04,
          )
          .from(
            select(".education-block .subsection-heading > *"),
            {
              y: 24 * travel,
              autoAlpha: 0.2,
              duration: 0.26,
              stagger: 0.06,
            },
            0.2,
          )
          .from(
            select(".education-list__rule"),
            {
              scaleX: 0,
              transformOrigin: "0 50%",
              duration: 0.44,
            },
            0.28,
          );

        gsap
          .timeline({
            defaults: { ease: "power4.out" },
            scrollTrigger: {
              trigger: educationBlock,
              start: "top 86%",
              once: true,
              refreshPriority: 19,
            },
          })
          .from(
            select(".education-list > li"),
            {
              y: 46 * travel,
              rotationX: isMobile ? 0 : motionAngle * 0.58 * travel,
              transformPerspective: 900,
              transformOrigin: "50% 0",
              autoAlpha: 0.18,
              duration: 0.52,
              stagger: 0.16,
              clearProps: "transform,opacity,visibility",
            },
            0,
          );

        const credentialsBlock = select(".credentials-block")[0];
        const credentialsScene = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: credentialsBlock,
            start: "top 84%",
            end: "bottom 48%",
            scrub: isMobile ? 0.48 : 0.74,
            invalidateOnRefresh: true,
            refreshPriority: 15,
          },
        });

        credentialsScene
          .from(
            select(".credentials-block .subsection-heading > *"),
            {
              x: (index) => (index === 0 ? -34 : 34) * travel,
              duration: 0.28,
              stagger: 0.06,
            },
            0,
          );

        const credentialRows = gsap.utils.toArray<HTMLElement>(
          ".credential-list > li",
          root,
        );

        credentialRows.forEach((row, index) => {
          gsap.timeline({
            defaults: { ease: "power4.out" },
            scrollTrigger: {
              trigger: row,
              start: "top 90%",
              once: true,
              refreshPriority: 14 - index,
            },
          })
            .fromTo(
              row,
              {
                x: 44 * travel,
                skewX: motionAngle * 0.16 * travel,
              },
              {
                x: 0,
                skewX: 0,
                duration: 0.5,
                immediateRender: false,
                clearProps: "transform",
              },
              0,
            );
        });

        const contactSection = select("#contact")[0];
        const contactActions = select(".contact__actions")[0];
        const contactFooter = select(".contact footer")[0];
        const contactScene = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: contactSection,
            start: "top 88%",
            end: "bottom bottom",
            scrub: isMobile ? 0.5 : 0.82,
            invalidateOnRefresh: true,
            refreshPriority: 10,
          },
        });

        contactScene
          .from(
            select(".contact .meta"),
            { y: 22 * travel, duration: 0.22 },
            0,
          )
          .fromTo(
            select(".contact h2 span"),
            {
              xPercent: (index) =>
                (index === 0 ? -28 : 28) * travel,
              skewX: (index) =>
                (index === 0 ? -1 : 1) *
                motionAngle *
                0.42 *
                travel,
            },
            {
              xPercent: 0,
              skewX: 0,
              duration: 0.48,
              stagger: 0.08,
            },
            0.08,
          );

        gsap
          .timeline({
            defaults: { ease: "power4.out" },
            scrollTrigger: {
              trigger: contactActions,
              start: "top 90%",
              once: true,
              refreshPriority: 9,
            },
          })
          .fromTo(
            select(".contact__actions > *"),
            {
              y: 30 * travel,
            },
            {
              y: 0,
              duration: 0.46,
              stagger: 0.065,
              immediateRender: false,
              clearProps: "transform",
            },
            0,
          )
          .fromTo(
            contactFooter,
            {
              y: 28 * travel,
              "--contact-progress": 0,
            },
            {
              y: 0,
              "--contact-progress": 1,
              duration: 0.44,
              immediateRender: false,
              clearProps: "transform",
            },
            0.16,
          );
      },
    );

    let disposed = false;
    void document.fonts.ready.then(() => {
      if (!disposed) ScrollTrigger.refresh();
    });

    return () => {
      disposed = true;
      media.revert();
    };
  }, [reducedMotion]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    let frame = 0;

    const updateActiveSection = () => {
      frame = 0;
      const focusLine = window.innerHeight * 0.52;
      let nextHref: NavHref = navItems[0][1];
      let closestDistance = Number.POSITIVE_INFINITY;

      navItems.forEach(([, href]) => {
        const section = root.querySelector<HTMLElement>(href);
        if (!section) return;

        const bounds = section.getBoundingClientRect();
        const containsFocusLine =
          bounds.top <= focusLine && bounds.bottom >= focusLine;
        const distance = containsFocusLine
          ? 0
          : Math.min(
              Math.abs(bounds.top - focusLine),
              Math.abs(bounds.bottom - focusLine),
            );

        if (distance < closestDistance) {
          closestDistance = distance;
          nextHref = href;
        }
      });

      setActiveSection((current) =>
        current === nextHref ? current : nextHref,
      );
    };

    const queueUpdate = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(updateActiveSection);
    };

    updateActiveSection();
    window.addEventListener("scroll", queueUpdate, { passive: true });
    window.addEventListener("resize", queueUpdate, { passive: true });

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", queueUpdate);
      window.removeEventListener("resize", queueUpdate);
    };
  }, []);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || reducedMotion) return;

    const findTarget = (event: PointerEvent) => {
      const source = event.target;
      if (!(source instanceof Element)) return null;
      const target = source.closest<HTMLElement>("[data-motion-hover]");
      return target && root.contains(target) ? target : null;
    };

    const enter = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const target = findTarget(event);
      if (!target || (event.relatedTarget instanceof Node && target.contains(event.relatedTarget))) {
        return;
      }

      const mode = target.dataset.motionHover;
      const vars =
        mode === "panel-content"
          ? { y: -4, scale: 1.004 }
          : mode === "rail"
            ? { x: -4, scale: 1.04 }
            : mode === "row"
              ? { x: 10, scale: 1 }
              : { y: -3, scale: 1.015 };

      gsap.to(target, {
        ...vars,
        duration: 0.24,
        ease: "power3.out",
        overwrite: "auto",
      });
    };

    const leave = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const target = findTarget(event);
      if (!target || (event.relatedTarget instanceof Node && target.contains(event.relatedTarget))) {
        return;
      }

      gsap.to(target, {
        x: 0,
        y: 0,
        scale: 1,
        rotation: 0,
        duration: 0.22,
        ease: "power3.out",
        overwrite: "auto",
      });
    };

    root.addEventListener("pointerover", enter);
    root.addEventListener("pointerout", leave);

    return () => {
      root.removeEventListener("pointerover", enter);
      root.removeEventListener("pointerout", leave);
      gsap.killTweensOf(root.querySelectorAll("[data-motion-hover]"));
    };
  }, [reducedMotion]);

  return (
    <MotionPreferenceContext.Provider value={fullMotionPreference}>
      <main id="main-content" ref={rootRef}>
      <span className="page-progress" aria-hidden="true">
        <motion.span
          className="page-progress__fill"
          style={{ scaleX: progress }}
        />
      </span>

      <CommandNavigation
        inactive={Boolean(activeProject || activeDocument)}
        activeHref={activeSection}
        onNavigate={scrollToSection}
      />

      <section id="top" className="hero" aria-labelledby="hero-title">
        <MobileHeader
          visible={navVisible}
          activeHref={activeSection}
          onNavigate={scrollToSection}
        />
        <div className="hero__content shell">
          <div className="hero__intro">
            <p className="meta">Fresh graduate · Junior web developer</p>
          </div>

          <div className="hero__stage">
            <div className="hero__message">
              <h1 id="hero-title" aria-label="Hi, I’m Alfatih. Fresh graduate and web developer.">
                <span className="hero-line" aria-hidden="true">
                  <span className="hero-word">
                    <span className="hero-word__text">Hi, I’m</span>
                  </span>
                </span>
                <span className="hero-line hero-line--offset" aria-hidden="true">
                  <span className="hero-word">
                    <span className="hero-word__text">Alfatih.</span>
                  </span>
                </span>
                <span className="hero-line" aria-hidden="true">
                  <span className="hero-word">
                    <span className="hero-word__text">
                      Web <br className="hero-mobile-break" />
                      developer.
                    </span>
                  </span>
                </span>
              </h1>
              <p className="hero__summary">
                I’m a fresh <strong>Informatics Engineering graduate</strong> who
                enjoys building straightforward web apps and learning how each
                part works.
              </p>
            </div>

            <figure className="hero-portrait" aria-label="Portrait photo space">
              <div className="hero-portrait__frame">
                <span className="meta">Portrait space</span>
                <strong aria-hidden="true">
                  AP<span>.</span>
                </strong>
                <span className="hero-portrait__note">Casual photo coming soon</span>
              </div>
              <figcaption>
                <span>Alfatihnaman Badharija Putra Madvi</span>
                <span>Bandung, Indonesia</span>
              </figcaption>
            </figure>
          </div>

          <div className="hero__footer">
            <span className="meta">Open to junior web development roles</span>
            <a
              className="scroll-cue"
              href="#about"
              data-motion-hover="link"
              onClick={(event) => {
                event.preventDefault();
                scrollToSection("#about");
              }}
            >
              More about me <span aria-hidden="true">↓</span>
            </a>
          </div>
        </div>
      </section>

      <section id="about" className="about section-pad" aria-labelledby="about-title">
        <div className="shell about__layout">
          <div className="about__story">
            <h2 id="about-title">A little about me.</h2>
            <ol className="about-timeline" aria-label="My path into web development">
              {aboutTimeline.map((stop) => (
                <li className="about-timeline__stop" key={stop.title}>
                  <span className="about-timeline__tick" aria-hidden="true" />
                  <span className="meta">{stop.years}</span>
                  <strong>{stop.title}</strong>
                  <span>{stop.detail}</span>
                </li>
              ))}
            </ol>
          </div>
          <div className="about__copy">
            <p>
              I recently graduated in Informatics Engineering from UNIKOM. I started
              learning software development in SMK Medikacom, then kept building small
              projects through college and my internship.
            </p>
            <p>
              I’m comfortable working with front-end code, databases, APIs, and the basic
              flow behind a web application. I’m still early in my career, and I like
              learning by building and improving things one step at a time.
            </p>
          </div>
          <dl className="about__facts">
            <div>
              <dt>Current stage</dt>
              <dd>Fresh graduate</dd>
            </div>
            <div>
              <dt>What I build</dt>
              <dd>Web apps and interfaces</dd>
            </div>
            <div>
              <dt>How I work</dt>
              <dd>Learn, build, improve</dd>
            </div>
          </dl>
        </div>
      </section>

      <section id="skills" className="skills section-pad" aria-labelledby="skills-title">
        <div className="shell">
          <div className="section-heading">
            <h2 id="skills-title">What I work with.</h2>
            <p>
              I use these in coursework, personal projects, and internship work. I’m most
              comfortable with the web basics and keep improving through hands-on projects.
            </p>
          </div>

          <div className="skills__ticks" aria-hidden="true">
            {Array.from({ length: 24 }, (_, index) => (
              <span key={index}>+</span>
            ))}
          </div>

          <div className="skill-groups">
            {skills.map((skillGroup, groupIndex) => (
              <div className="skill-group" key={skillGroup.group}>
                <div className="skill-group__intro">
                  <h3>
                    <span className="meta">0{groupIndex + 1}</span>
                    {skillGroup.group}
                  </h3>
                  <p>{skillGroup.description}</p>
                </div>
                <div className="skill-tags">
                  {skillGroup.items.map((skill) => (
                    <span key={skill}>
                      <span className="skill-tag__label">{skill}</span>
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ProjectGrid onOpen={setActiveProject} />

      <section id="education" className="journey section-pad" aria-labelledby="education-title">
        <div className="shell">
          <div className="journey__intro">
            <h2 id="education-title">How I learned.</h2>
            <p>
              My education gave me the basics, and short courses helped me explore web
              development, networking, English, and cybersecurity.
            </p>
          </div>

          <div className="education-block">
            <div className="subsection-heading">
              <h3>Education</h3>
              <p>
                I started with software development in SMK Medikacom and continued with
                an Informatics Engineering degree.
              </p>
            </div>
            <div className="education-list-wrap">
              <span className="education-list__rule" aria-hidden="true" />
              <ol className="education-list">
                {education.map((item) => {
                  const linkedDocument = item.documentId
                    ? portfolioDocuments.find(
                        (document) => document.id === item.documentId,
                      )
                    : undefined;

                  return (
                    <li key={item.title}>
                      <span className="meta">{item.period}</span>
                      <h4>{item.title}</h4>
                      <p>{item.detail}</p>
                      {linkedDocument ? (
                        <button
                          className="document-trigger"
                          type="button"
                          data-motion-hover="link"
                          onClick={() => setActiveDocument(linkedDocument)}
                        >
                          Diploma details <span aria-hidden="true">↗</span>
                        </button>
                      ) : null}
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>

          <div className="credentials-block">
            <div className="subsection-heading">
              <h3>Credentials</h3>
              <p>Open a credential to see where and when I completed it.</p>
            </div>
            <ul className="credential-list">
              {credentials.map((credential) => (
                <li key={credential.id}>
                  <button
                    type="button"
                    data-motion-hover="row"
                    onClick={() => setActiveDocument(credential)}
                  >
                    <span>
                      <strong>{credential.title}</strong>
                      <small>{credential.issuer}</small>
                    </span>
                    <span className="credential-issued">{credential.issued}</span>
                    <span className="credential-open">
                      View details <span aria-hidden="true">↗</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section id="contact" className="contact section-pad" aria-labelledby="contact-title">
        <div className="shell contact__layout">
          <div>
            <p className="meta">Want to talk about a junior role or a project?</p>
            <h2 id="contact-title">
              <span>Let’s have a</span>
              <span>conversation.</span>
            </h2>
          </div>
          <div className="contact__actions">
            <MagneticLink className="button button--signal" href={`mailto:${contact.email}`}>
              Email me <span aria-hidden="true">↗</span>
            </MagneticLink>
            <MagneticLink className="button button--outline" href={contact.github} external>
              GitHub <span aria-hidden="true">↗</span>
            </MagneticLink>
            <MagneticLink className="button button--outline" href={contact.linkedin} external>
              LinkedIn <span aria-hidden="true">↗</span>
            </MagneticLink>
            <a
              className="contact-email"
              href={`mailto:${contact.email}`}
              data-motion-hover="link"
            >
              {contact.email}
            </a>
          </div>
          <footer>
            <span>Alfatihnaman Badharija Putra Madvi</span>
            <a
              href="#top"
              data-motion-hover="link"
              onClick={(event) => {
                event.preventDefault();
                scrollToSection("#top");
              }}
            >
              Back to top ↑
            </a>
          </footer>
        </div>
      </section>

      <ProjectDialog project={activeProject} onClose={() => setActiveProject(null)} />
      <DocumentDialog document={activeDocument} onClose={() => setActiveDocument(null)} />
      </main>
    </MotionPreferenceContext.Provider>
  );
}
