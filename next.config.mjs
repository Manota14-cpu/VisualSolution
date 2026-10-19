/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // 90 para las portadas del carrusel, que llevan texto; el resto sigue en 75.
    // Todas las imágenes son archivos propios en /public: no hay hosts
    // remotos permitidos.
    qualities: [75, 90],
  },
};

export default nextConfig;
