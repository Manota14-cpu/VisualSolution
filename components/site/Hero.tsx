import { Mark3D } from "@/components/brand/Mark3D";
import { hero, capabilities } from "@/lib/content";

/* El hero es el único lugar donde el sistema se rompe: color,
   desenfoque y escala al máximo. Debajo, la página vuelve a la
   superficie austera. */
export function Hero() {
  return (
    <section className="relative overflow-hidden pb-16 pt-28 text-center md:pb-24 md:pt-32" id="top">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(58% 46% at 50% 24%, rgba(139,92,246,.42), rgba(26,11,51,.22) 58%, transparent 78%)",
          }}
        />
        <span
          className="animate-drift-a absolute left-[-8vw] top-[16%] h-28 w-[74vw] rounded-full opacity-55 blur-[46px]"
          style={{ background: "linear-gradient(90deg,transparent,rgba(236,72,153,.85),transparent)" }}
        />
        <span
          className="animate-drift-b absolute right-[-10vw] top-[34%] h-24 w-[62vw] rounded-full opacity-55 blur-[46px]"
          style={{ background: "linear-gradient(90deg,transparent,rgba(139,92,246,.8),transparent)" }}
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to bottom,transparent 52%,#040506 100%)" }}
        />
      </div>

      <div className="relative mx-auto w-full max-w-[1200px] px-4 md:px-10">
        <Mark3D className="animate-rise relative mx-auto mb-4 grid aspect-video w-[min(340px,66vw)] place-items-center md:mb-6 md:w-[min(470px,74vw)]" />

        <h1
          className="animate-rise mx-auto max-w-[22ch] text-balance text-[clamp(34px,5.2vw,56px)] font-normal leading-[1.17] tracking-[.22px] text-white"
          style={{ animationDelay: ".12s" }}
        >
          {hero.headline}
        </h1>

        <p
          className="animate-rise mx-auto mt-6 max-w-[52ch] text-base leading-relaxed text-ash"
          style={{ animationDelay: ".22s" }}
        >
          {hero.sub}
        </p>

        <div className="animate-rise mt-8 flex flex-wrap justify-center gap-2" style={{ animationDelay: ".32s" }}>
          <a className="btn btn-solid mag" href="#contacto">
            <i className="diamond" aria-hidden="true" />
            {hero.primaryCta}
          </a>
          <a className="btn btn-ghost mag" href="#trabajos">
            {hero.secondaryCta}
          </a>
        </div>

        <p
          className="animate-rise mt-4 font-mono text-xs tracking-[.17px] text-smoke"
          style={{ animationDelay: ".42s" }}
        >
          {hero.meta.map((item, i) => (
            <span key={item}>
              <span className="px-2">{item}</span>
              {i < hero.meta.length - 1 && <span className="text-slate">|</span>}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}

/* Marquesina de capacidades. El contenido se duplica para el bucle
   infinito; la copia va oculta a lectores de pantalla. */
export function Marquee() {
  const strip = (hidden: boolean) => (
    <div
      className="flex shrink-0 items-center gap-8 pr-8 font-mono text-[13px] text-ash"
      aria-hidden={hidden || undefined}
    >
      {capabilities.map((cap, i) => (
        <span key={cap} className="contents">
          <span className="mq-word">{cap}</span>
          <span className={i % 2 === 0 ? "text-violet" : "text-pink"} aria-hidden="true">
            /
          </span>
        </span>
      ))}
    </div>
  );

  return (
    <div className="border-y border-hairline bg-card py-5">
      <div className="fade-x overflow-hidden">
        <div className="animate-marquee flex w-max">
          {strip(false)}
          {strip(true)}
        </div>
      </div>
    </div>
  );
}
