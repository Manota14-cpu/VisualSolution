"use client";

/* ============================================================
   Puente entre el catálogo y el formulario.
   Cuando alguien pide consultar por un proyecto, el visor avisa por
   acá y Contacto precarga el mensaje. Es un evento y no un contexto
   de React porque las dos secciones no comparten arbol y no vale la
   pena envolver la pagina entera para esto.
   ============================================================ */

const EVENT = "vs:consultar";

export function askAbout(projectTitle: string) {
  window.dispatchEvent(new CustomEvent<string>(EVENT, { detail: projectTitle }));
}

export function onAskAbout(fn: (projectTitle: string) => void) {
  const handler = (e: Event) => fn((e as CustomEvent<string>).detail);
  window.addEventListener(EVENT, handler);
  return () => window.removeEventListener(EVENT, handler);
}
