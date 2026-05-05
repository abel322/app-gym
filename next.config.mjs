
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
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'edb-63323.hosting.com',
            },
            {
                protocol: 'https',
                hostname: 'v2.exercisedb.io',
            },
        ],
    },
};

export default nextConfig;