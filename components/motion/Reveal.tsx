"use client";

/* ============================================================
   Revelado al entrar en viewport y titulares palabra por palabra.
   Un solo IntersectionObserver compartido por todos los elementos
   marcados, en vez de uno por componente.
   ============================================================ */

import { useEffect, useRef, type ElementType, type ReactNode } from "react";

let io: IntersectionObserver | null = null;

function observer() {
  if (io) return io;
  io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const el = entry.target as HTMLElement;
        el.classList.add("in");
        if (el.dataset.pulse !== undefined) el.classList.add("pulsed");
        io!.unobserve(el);
      }
    },
    { threshold: 0.15, rootMargin: "0px 0px -6% 0px" }
  );
  return io;
}

/** Marca un elemento para que entre al aparecer en pantalla. */
export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      el.classList.add("in");
      return;
    }
    const ob = observer();
    ob.observe(el);
    // red de seguridad: nada queda invisible si el observer no dispara
    const t = window.setTimeout(() => el.classList.add("in"), 1800);
    return () => {
      ob.unobserve(el);
      window.clearTimeout(t);
    };
  }, []);
  return ref;
}

type RevealProps = {
  as?: ElementType;
  className?: string;
  delay?: number;
  children?: ReactNode;
} & Record<string, unknown>;

export function Reveal({ as: Tag = "div", className = "", delay = 0, children, ...rest }: RevealProps) {
  const ref = useReveal<HTMLElement>();
  return (
    <Tag
      ref={ref}
      className={`rv ${className}`}
      style={delay ? ({ ["--i" as string]: delay } as React.CSSProperties) : undefined}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/* Titular partido en palabras dentro de una máscara. Cada palabra
   entra desplazada y desenfocada con un retardo escalonado: el ojo
   lee en el mismo orden en que el texto aparece.
   El texto va completo en el DOM desde el servidor, así que se indexa
   y se lee igual sin JavaScript. */
export function SplitHeading({
  as: Tag = "h2",
  text,
  className = "",
}: {
  as?: ElementType;
  text: string;
  className?: string;
}) {
  const ref = useReveal<HTMLElement>();
  const words = text.trim().split(/\s+/);
  return (
    <Tag ref={ref} className={`rv ${className}`}>
      {words.map((word, i) => (
        <span key={`${word}-${i}`}>
          <span className="w">
            <i style={{ ["--d" as string]: `${i * 45}ms` } as React.CSSProperties}>{word}</i>
          </span>
          {i < words.length - 1 ? " " : null}
        </span>
      ))}
    </Tag>
  );
}

/** Imagen que se revela con un barrido la primera vez que se ve. */
export function Wipe({ className = "", children }: { className?: string; children: ReactNode }) {
  const ref = useReveal<HTMLDivElement>();
  return (
    <div ref={ref} className={`wipe ${className}`}>
      {children}
    </div>
  );
}
