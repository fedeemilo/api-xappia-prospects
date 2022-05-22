module.exports = {
    apps: [
        {
            name: "server-xappia",
            script: "./app.js",
            watch: true,
            env: {
                NODE_ENV: "production"
            }
        }
    ]
};
