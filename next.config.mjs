
/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        // Esto permite que el build termine incluso si hay errores de ESLint
        ignoreDuringBuilds: true,
    },
    typescript: {
        // Esto permite que el build termine incluso si hay errores de TypeScript
        ignoreBuildErrors: true,
    },
};

export default nextConfig;