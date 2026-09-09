"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { Reveal, SplitHeading } from "@/components/motion/Reveal";
import { useMotionEnv } from "@/lib/motion";
import { onAskAbout, onAskForServices } from "@/lib/consult";
import { serviceOptions, site } from "@/lib/content";

type Fields = { nombre: string; email: string; servicio: string; mensaje: string };
type Errors = Partial<Record<keyof Fields, string>>;

const empty: Fields = { nombre: "", email: "", servicio: "", mensaje: "" };

function validate(v: Fields): Errors {
  const e: Errors = {};
  if (v.nombre.trim().length < 2) e.nombre = "Escribí tu nombre.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.trim()))
    e.email = "Revisá el correo, parece incompleto.";
  if (!v.servicio) e.servicio = "Elegí una opción.";
  if (v.mensaje.trim().length < 12) e.mensaje = "Contanos un poco más, con una línea alcanza.";
  return e;
}

export function Contact() {
  const [values, setValues] = useState<Fields>(empty);
  const [errors, setErrors] = useState<Errors>({});
  const [sending, setSending] = useState(false);
  const [ok, setOk] = useState(false);
  const [sent, setSent] = useState<string | null>(null);
  const [failed, setFailed] = useState("");
  const { reduce } = useMotionEnv();
  const mensajeRef = useRef<HTMLTextAreaElement>(null);

  /* Si alguien pidió consultar por un proyecto del catálogo, el mensaje
     llega precargado y el foco va al final del texto para que siga
     escribiendo sin borrar nada. No pisa lo que ya haya escrito. */
  useEffect(
    () =>
      onAskAbout((proyecto) => {
        setSent(null);
        setValues((v) => ({
          ...v,
          servicio: v.servicio || "Sitio web",
          mensaje: v.mensaje || `Quiero consultar por ${proyecto}. `,
        }));
        window.setTimeout(() => {
          const el = mensajeRef.current;
          if (!el) return;
          el.focus({ preventScroll: true });
          el.setSelectionRange(el.value.length, el.value.length);
        }, 900);
      }),
    []
  );

  /* Lo armado en el hero llega acá: si eligió uno solo, ese va al
     desplegable; si eligió varios, la opción combinada. El mensaje se
     escribe con la lista para que no tenga que repetirla. */
  useEffect(
    () =>
      onAskForServices((servicios) => {
        if (!servicios.length) return;
        setSent(null);
        const lista = servicios.map((s) => s.label).join(" + ");
        setValues((v) => ({
          ...v,
          servicio: servicios.length === 1 ? servicios[0].formValue : "Varias cosas a la vez",
          mensaje: v.mensaje || `Necesito: ${lista}. `,
        }));
        window.setTimeout(() => {
          const el = mensajeRef.current;
          if (!el) return;
          el.focus({ preventScroll: true });
          el.setSelectionRange(el.value.length, el.value.length);
        }, 900);
      }),
    []
  );

  const set = (k: keyof Fields) => (e: { target: { value: string } }) => {
    setValues((v) => ({ ...v, [k]: e.target.value }));
    if (errors[k]) setErrors((x) => ({ ...x, [k]: undefined }));
  };

  // el botón muta a tilde antes de que aparezca el panel
  const finish = (text: string) => {
    if (reduce) {
      setSent(text);
      return;
    }
    setOk(true);
    window.setTimeout(() => {
      setOk(false);
      setSent(text);
    }, 700);
  };

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setFailed("");
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length) return;

    /* Sin backend configurado arma un correo con los datos. Con
       site.formEndpoint cargado, pasa a ser un POST con JSON. */
    if (!site.formEndpoint) {
      const cuerpo = `Nombre: ${values.nombre}\nCorreo: ${values.email}\nServicio: ${values.servicio}\n\n${values.mensaje}`;
      window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(
        `Consulta de ${values.nombre}`
      )}&body=${encodeURIComponent(cuerpo)}`;
      finish(
        `Abrimos tu cliente de correo con el mensaje cargado. Si no se abrió solo, escribinos a ${site.email}.`
      );
      return;
    }

    setSending(true);
    try {
      const res = await fetch(site.formEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error(`respuesta ${res.status}`);
      finish("Recibimos tu mensaje. Te respondemos al correo que dejaste.");
    } catch {
      setFailed(`No pudimos enviar el mensaje. Probá de nuevo o escribinos a ${site.email}.`);
    } finally {
      setSending(false);
    }
  }

  return (
    <section className="bg-onyx py-20 md:py-28" id="contacto">
      <div className="mx-auto grid w-full max-w-[1200px] grid-cols-1 items-start gap-10 px-4 md:px-10 lg:grid-cols-[1fr_1.15fr] lg:gap-20">
        <Reveal>
          <SplitHeading
            text="Hablemos de tu proyecto."
            className="display display-md"
          />
          <p className="mt-4 max-w-[62ch] text-base leading-relaxed text-chalk/70">
            Contanos qué necesitás y te respondemos con una propuesta concreta: alcance, plazo y precio.
          </p>

          <dl className="mt-10 grid gap-6">
            <div>
              <dt className="label mb-2 block text-chalk/55">Correo</dt>
              <dd className="m-0">
                <a className="link" href={`mailto:${site.email}`}>
                  {site.email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="label mb-2 block text-chalk/55">Instagram</dt>
              <dd className="m-0">
                <a className="link" href={site.instagram.url} target="_blank" rel="noopener">
                  {site.instagram.handle}
                </a>
              </dd>
            </div>
            <div>
              <dt className="label mb-2 block text-chalk/55">Respuesta</dt>
              <dd className="m-0 text-base text-chalk/55">Contestamos todos los mensajes.</dd>
            </div>
          </dl>
        </Reveal>

        <Reveal delay={1}>
          {sent ? (
            <div className="rounded-cards bg-carbon p-8" role="status">
              <h3 className="display display-sm">Mensaje listo para enviar</h3>
              <p className="mt-2 max-w-[44ch] text-base leading-relaxed text-chalk/70">{sent}</p>
              <button
                className="btn btn-ghost mt-6"
                type="button"
                onClick={() => {
                  setValues(empty);
                  setSent(null);
                }}
              >
                Escribir otro mensaje
              </button>
            </div>
          ) : (
            <form className="grid gap-4 rounded-cards bg-carbon p-6" onSubmit={onSubmit} noValidate>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className={`grid gap-2 ${errors.nombre ? "has-error" : ""}`}>
                  <div className="fl">
                    <input
                      className="field-input"
                      id="nombre"
                      name="nombre"
                      type="text"
                      autoComplete="name"
                      placeholder="Cómo te llamás"
                      value={values.nombre}
                      onChange={set("nombre")}
                      aria-invalid={!!errors.nombre}
                      required
                    />
                    <label htmlFor="nombre">Nombre</label>
                  </div>
                  {errors.nombre && <p className="text-xs text-magenta">{errors.nombre}</p>}
                </div>

                <div className={`grid gap-2 ${errors.email ? "has-error" : ""}`}>
                  <div className="fl">
                    <input
                      className="field-input"
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      placeholder="nombre@empresa.com"
                      value={values.email}
                      onChange={set("email")}
                      aria-invalid={!!errors.email}
                      required
                    />
                    <label htmlFor="email">Correo</label>
                  </div>
                  {errors.email && <p className="text-xs text-magenta">{errors.email}</p>}
                </div>
              </div>

              <div className={`grid gap-2 ${errors.servicio ? "has-error" : ""}`}>
                <div className="fl is-select">
                  <select
                    className="field-input cursor-pointer appearance-none"
                    id="servicio"
                    name="servicio"
                    value={values.servicio}
                    onChange={set("servicio")}
                    aria-invalid={!!errors.servicio}
                    required
                    style={{
                      backgroundImage:
                        "linear-gradient(45deg,transparent 50%,#ffffff 50%),linear-gradient(135deg,#ffffff 50%,transparent 50%)",
                      backgroundPosition: "calc(100% - 18px) calc(50% + 5px), calc(100% - 13px) calc(50% + 5px)",
                      backgroundSize: "5px 5px, 5px 5px",
                      backgroundRepeat: "no-repeat",
                    }}
                  >
                    <option value="">Elegí una opción</option>
                    {serviceOptions.map((o) => (
                      <option key={o}>{o}</option>
                    ))}
                  </select>
                  <label htmlFor="servicio">Qué necesitás</label>
                </div>
                {errors.servicio && <p className="text-xs text-magenta">{errors.servicio}</p>}
              </div>

              <div className={`grid gap-2 ${errors.mensaje ? "has-error" : ""}`}>
                <div className="fl">
                  <textarea
                    ref={mensajeRef}
                    className="field-input resize-y leading-relaxed"
                    id="mensaje"
                    name="mensaje"
                    placeholder="Qué hace tu negocio, qué tenés hoy y para cuándo lo necesitás."
                    value={values.mensaje}
                    onChange={set("mensaje")}
                    aria-invalid={!!errors.mensaje}
                    required
                  />
                  <label htmlFor="mensaje">Sobre el proyecto</label>
                </div>
                <p className="text-xs text-chalk/55">
                  Con dos o tres líneas alcanza para armar una primera propuesta.
                </p>
                {errors.mensaje && <p className="text-xs text-magenta">{errors.mensaje}</p>}
              </div>

              {sending && (
                <div className="h-0.5 overflow-hidden rounded-sm bg-chalk/15" aria-hidden="true">
                  <i
                    className="animate-load block h-full w-[36%]"
                    style={{ background: "var(--color-magenta)" }}
                  />
                </div>
              )}

              <div className="mt-2 flex flex-col items-stretch justify-between gap-4 sm:flex-row sm:items-center">
                <p className="label text-chalk/55">Usamos estos datos solo para responderte.</p>
                <button className={`btn btn-solid ${ok ? "ok" : ""}`} type="submit" disabled={sending}>
                  <span className="send-label">{sending ? "Enviando" : "Enviar mensaje"}</span>
                  <span className="send-ok" aria-hidden="true">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M4.5 12.5l5 5 10-11"
                        stroke="#1f7a4d"
                        strokeWidth="2.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </button>
              </div>

              {failed && (
                <p className="text-xs text-magenta" role="alert">
                  {failed}
                </p>
              )}
            </form>
          )}
        </Reveal>
      </div>
    </section>
  );
}
