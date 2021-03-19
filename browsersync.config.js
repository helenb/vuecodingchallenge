const host = process.env.PROXY_HOST || 'localhost';
const port = process.env.PROXY_PORT || '8000';

module.exports = {
    proxy: {
        target: `${host}:${port}`,
        proxyOptions: {
            changeOrigin: false,
        },
    },
    serveStatic: [
        {
            route: '/static',
            dir: 'vuecodingchallenge/static_compiled',
        },
    ],
    files: 'vuecodingchallenge/static_compiled',
};
