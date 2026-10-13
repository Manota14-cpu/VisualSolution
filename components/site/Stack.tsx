import {
  siMercadopago,
  siNextdotjs,
  siReact,
  siShopify,
  siThreedotjs,
  siVercel,
  siWoocommerce,
} from "simple-icons";

/* ============================================================
   CON QUÉ TRABAJAMOS
   Sólo herramientas que el propio sitio ya confirma: el stack de
   los trabajos del catálogo (Next.js, React, Three.js), las
   plataformas de la sección de tiendas (Shopify, WooCommerce,
   Mercado Pago) y dónde están publicados los proyectos (Vercel).
   Si se suma una, que sea porque se usó.

   Los logos van en la tinta del sitio y no en el color de cada
   marca: siete colores de otras empresas romperían la página. El
   nombre va escrito al lado, que es lo que se lee de verdad.
   Es un componente de servidor: los trazados llegan en el HTML y
   no suman nada al JavaScript.
   ============================================================ */

const herramientas = [siNextdotjs, siReact, siThreedotjs, siShopify, siWoocommerce, siMercadopago, siVercel];

export function Stack() {
  return (
    <section className="stack py-4 md:py-8" aria-labelledby="stack-titulo">
      <div className="mx-auto w-full max-w-[1200px] px-4 md:px-10">
        <h2 id="stack-titulo" className="label text-center text-azul/80">
          Con qué trabajamos
        </h2>
        <ul className="stack-logos superficie mt-6">
          {herramientas.map((h) => (
            <li key={h.slug} data-logo={h.slug}>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d={h.path} />
              </svg>
              <span>{h.title}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
