/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Las fotos del catalogo son de relleno. Al reemplazarlas por archivos
    // propios en /public, este bloque se puede borrar entero.
    remotePatterns: [{ protocol: 'https', hostname: 'picsum.photos' }],
  },
};

export default nextConfig;
