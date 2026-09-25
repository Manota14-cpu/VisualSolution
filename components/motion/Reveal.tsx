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

/* Marca un elemento para que entre al aparecer en pantalla.
   Acepta un ref externo: hay elementos que ya usan su ref para otra cosa
   (la inclinación de las tarjetas, por ejemplo) y aun así llevan la clase
   .rv, que arranca en opacity:0. Si no se registran acá, quedan invisibles
   para siempre. */
export function useReveal<T extends HTMLElement>(external?: React.RefObject<T | null>) {
  const own = useRef<T>(null);
  const ref = external ?? own;
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
  }, [ref]);
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
  accent,
  className = "",
  id,
}: {
  as?: ElementType;
  text: string;
  /* Un tramo del mismo texto que se imprime en la segunda fuerza de la
     tinta. Es el remate de la frase: el ojo entra por el principio y se
     queda con el final. Tiene que ser un fragmento literal de text. */
  accent?: string;
  className?: string;
  id?: string;
}) {
  const ref = useReveal<HTMLElement>();
  const words = text.trim().split(/\s+/);
  const marca = accent ? accent.trim().split(/\s+/) : [];
  let desde = -1;
  for (let i = 0; marca.length && i <= words.length - marca.length; i++) {
    if (marca.every((m, j) => words[i + j] === m)) {
      desde = i;
      break;
    }
  }
  return (
    <Tag ref={ref} id={id} className={`rv ${className}`}>
      {words.map((word, i) => {
        const acento = desde >= 0 && i >= desde && i < desde + marca.length;
        return (
          <span key={`${word}-${i}`}>
            <span className={acento ? "w acento" : "w"}>
              <i style={{ ["--d" as string]: `${i * 55}ms` } as React.CSSProperties}>{word}</i>
            </span>
            {i < words.length - 1 ? " " : null}
          </span>
        );
      })}
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
