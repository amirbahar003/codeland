/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        dangerouslyAllowLocalIP: true,

        remotePatterns: [
            {
                protocol: "https",
                hostname: "localhost",
                port: "7111",
                pathname: "/api/Files/**",
            },
        ],
    },
};

export default nextConfig;