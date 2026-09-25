"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { Check, Copy, Mail, MessagesSquare } from "lucide-react";
import { siInstagram, siWhatsapp } from "simple-icons";
import { Reveal, SplitHeading } from "@/components/motion/Reveal";
import { Eyebrow } from "@/components/site/Eyebrow";
import { Flecha } from "@/components/ui/Flecha";
import { useMotionEnv } from "@/lib/motion";
import { onAskAbout, onAskForServices } from "@/lib/consult";
import { serviceOptions, site, whatsappUrl } from "@/lib/content";
import { MetalFaz } from "@/components/brand/MetalRig";

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
  /* El último enlace de WhatsApp, para reabrirlo desde el panel si el
     navegador no dejó abrir la pestaña. */
  const [waUrl, setWaUrl] = useState<string | null>(null);
  const [failed, setFailed] = useState("");
  const { reduce } = useMotionEnv();
  const mensajeRef = useRef<HTMLTextAreaElement>(null);
  const [copiado, setCopiado] = useState(false);

  /* Copiar el correo: quien escribe desde otra cuenta o desde el
     teléfono no quiere que se abra el cliente de mail. */
  const copiarCorreo = async () => {
    try {
      await navigator.clipboard.writeText(site.email);
      setCopiado(true);
      window.setTimeout(() => setCopiado(false), 1800);
    } catch {
      /* sin permiso de portapapeles queda el enlace de siempre */
    }
  };

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

    /* Por WhatsApp: se abre un chat con el estudio y la consulta ya
       escrita; la persona sólo toca Enviar. Se abre acá, antes de
       cualquier await, porque el navegador sólo deja abrir una pestaña
       nueva como respuesta directa a un clic. Si igual la bloquea,
       WhatsApp se abre en esta misma pestaña. */
    if (site.whatsapp) {
      const texto = [
        `Hola, soy ${values.nombre.trim()}.`,
        `Me interesa: ${values.servicio}.`,
        "",
        values.mensaje.trim(),
        "",
        `Mi correo: ${values.email.trim()}`,
      ].join("\n");
      const url = whatsappUrl(texto);
      setWaUrl(url);
      const w = window.open(url, "_blank");
      if (w) w.opener = null;
      else window.location.href = url;
      finish("Te abrimos WhatsApp con tu consulta escrita. Sólo falta tocar Enviar ahí.");
      return;
    }

    /* Sin WhatsApp ni backend configurado arma un correo con los datos.
       Con site.formEndpoint cargado, pasa a ser un POST con JSON. */
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
    <section className="seccion" id="contacto" aria-labelledby="contacto-titulo">
      <div className="mx-auto grid w-full max-w-[1200px] grid-cols-1 items-start gap-12 px-4 md:px-10 lg:grid-cols-[1fr_1.15fr] lg:gap-20">
        <Reveal>
          <Eyebrow n="05">Contacto</Eyebrow>
          <SplitHeading
            id="contacto-titulo"
            text="Hablemos de tu proyecto."
            accent="tu proyecto."
            className="display display-md"
          />
          <p className="mt-8 max-w-[46ch] text-[17px] leading-relaxed text-azul/85">
            Contanos qué necesitás y te respondemos con una propuesta concreta: alcance, plazo y precio.
          </p>

          {/* Cada canal es una fila entera que se toca: el ícono dice qué
              es, la flecha adónde lleva. Antes eran enlaces sueltos de una
              línea, chicos para el dedo. */}
          <ul className="contacto-filas">
            <li className="contacto-fila">
              <span className="contacto-icono" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <path d={siWhatsapp.path} />
                </svg>
              </span>
              <span className="contacto-dato">
                <span className="label contacto-rotulo">WhatsApp</span>
                <a className="contacto-enlace" href={whatsappUrl()} target="_blank" rel="noopener noreferrer">
                  {site.whatsappVisible}
                  <span className="sr-only"> (se abre en una pestaña nueva)</span>
                </a>
              </span>
              <Flecha externa className="contacto-flecha" />
            </li>
            <li className="contacto-fila">
              <span className="contacto-icono" aria-hidden="true">
                <Mail size={18} strokeWidth={1.8} />
              </span>
              <span className="contacto-dato">
                <span className="label contacto-rotulo">Correo</span>
                <a className="contacto-enlace" href={`mailto:${site.email}`}>
                  {site.email}
                </a>
              </span>
              <button
                className={`contacto-copiar ${copiado ? "es-hecho" : ""}`}
                type="button"
                onClick={copiarCorreo}
                aria-label={copiado ? "Correo copiado" : "Copiar el correo"}
              >
                {copiado ? <Check size={15} strokeWidth={2.2} /> : <Copy size={15} strokeWidth={1.9} />}
                <span className="contacto-copiar-texto" aria-hidden="true">
                  {copiado ? "Copiado" : "Copiar"}
                </span>
              </button>
              <span className="sr-only" aria-live="polite">
                {copiado ? "Correo copiado" : ""}
              </span>
            </li>
            <li className="contacto-fila">
              <span className="contacto-icono" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <path d={siInstagram.path} />
                </svg>
              </span>
              <span className="contacto-dato">
                <span className="label contacto-rotulo">Instagram</span>
                <a className="contacto-enlace" href={site.instagram.url} target="_blank" rel="noopener">
                  {site.instagram.handle}
                  <span className="sr-only"> (se abre en una pestaña nueva)</span>
                </a>
              </span>
              <Flecha externa className="contacto-flecha" />
            </li>
            <li className="contacto-fila es-nota">
              <span className="contacto-icono" aria-hidden="true">
                <MessagesSquare size={18} strokeWidth={1.8} />
              </span>
              <span className="contacto-dato">
                <span className="label contacto-rotulo">Respuesta</span>
                <span className="contacto-valor">Contestamos todos los mensajes.</span>
              </span>
            </li>
          </ul>
        </Reveal>

        <Reveal delay={1}>
          {sent ? (
            <div className="superficie rounded-cards bg-papel p-6 sm:p-8" role="status">
              <h3 className="display display-sm">Mensaje listo para enviar</h3>
              <p className="mt-2 max-w-[44ch] text-base leading-relaxed text-azul/85">{sent}</p>
              {waUrl && (
                <p className="mt-3 text-sm text-azul/85">
                  ¿No se abrió?{" "}
                  <a className="link" href={waUrl} target="_blank" rel="noopener noreferrer">
                    Abrir WhatsApp de nuevo
                  </a>
                </p>
              )}
              <button
                className="btn btn-metal es-suave mt-6"
                type="button"
                onClick={() => {
                  setValues(empty);
                  setSent(null);
                  setWaUrl(null);
                }}
              >
                <MetalFaz />
                Escribir otro mensaje
              </button>
            </div>
          ) : (
            <form className="superficie es-alta grid gap-4 rounded-cards bg-papel p-5 sm:p-6 lg:p-8" onSubmit={onSubmit} noValidate>
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
                  {errors.nombre && <p className="text-xs text-error">{errors.nombre}</p>}
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
                  {errors.email && <p className="text-xs text-error">{errors.email}</p>}
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
                        "linear-gradient(45deg,transparent 50%,#0036A5 50%),linear-gradient(135deg,#0036A5 50%,transparent 50%)",
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
                {errors.servicio && <p className="text-xs text-error">{errors.servicio}</p>}
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
                <p className="text-xs text-azul/80">
                  Con dos o tres líneas alcanza para armar una primera propuesta.
                </p>
                {errors.mensaje && <p className="text-xs text-error">{errors.mensaje}</p>}
              </div>

              {sending && (
                <div className="h-0.5 overflow-hidden rounded-sm bg-azul/15" aria-hidden="true">
                  <i
                    className="animate-load block h-full w-[36%]"
                    style={{ background: "var(--color-azul-medio)" }}
                  />
                </div>
              )}

              <div className="mt-2 flex flex-col items-stretch justify-between gap-4 sm:flex-row sm:items-center">
                <p className="label max-w-[36ch] leading-snug text-azul/80">
                  {site.whatsapp ? "Se abre WhatsApp con tu consulta. Acá no guardamos nada." : "Usamos estos datos solo para responderte."}
                </p>
                {/* shrink-0: con la leyenda larga al lado, la fila lo achicaba
                    y el metal, que recorta lo que sobra, le comía la primera
                    letra ("nviar por WhatsApp"). */}
                <button className={`btn btn-metal shrink-0 ${ok ? "ok" : ""}`} type="submit" disabled={sending}>
                  <MetalFaz />
                  <span className="send-label">{sending ? "Enviando" : site.whatsapp ? "Enviar por WhatsApp" : "Enviar mensaje"}</span>
                  <span className="send-ok" aria-hidden="true">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M4.5 12.5l5 5 10-11"
                        stroke="#FFFFFF"
                        strokeWidth="2.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </button>
              </div>

              {failed && (
                <p className="text-xs text-error" role="alert">
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
