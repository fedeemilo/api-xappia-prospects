module.exports = {
    apps: [
        {
            name: "server-xappia",
            script: "./app.js",
            watch: true,
            env: {
                PORT: 8000,
                NODE_ENV: "production"
            }
            // env_production: {
            //     PORT: 8000,
            //     NODE_ENV: "production",
            //     XAPPIA_USERNAME: "fGvova1i0J1nYiwXKgIY",
            //     XAPPIA_PASSWORD: "o0dz2qd2nDnyI05TGS28"
            // }
        }
    ]
};
