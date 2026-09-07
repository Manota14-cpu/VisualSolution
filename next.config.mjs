/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Las fotos del catalogo son de relleno. Al reemplazarlas por archivos
    // propios en /public, este bloque se puede borrar entero.
    //
    // Hacen falta los dos hosts: picsum.photos responde 302 hacia
    // fastly.picsum.photos, y el optimizador de Next sigue el redirect.
    // Si el destino final no esta permitido, aborta y la imagen queda vacia.
    remotePatterns: [
      { protocol: 'https', hostname: 'picsum.photos' },
      { protocol: 'https', hostname: 'fastly.picsum.photos' },
    ],
  },
};

export default nextConfig;
