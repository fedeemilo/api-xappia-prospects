module.exports = {
    apps: [
        {
            name: "server-xappia",
            script: "./app.js",
            watch: true,
            env: {
                PORT: 8000,
                NODE_ENV: "development",
                XAPPIA_USERNAME: "fGvova1i0J1nYiwXKgIY",
                XAPPIA_PASSWORD: "o0dz2qd2nDnyI05TGS28",
                XAPPIA_API_TOYOTA: "http://200.7.15.135:9201/dcx/api/leads",
                XAPPIA_API_VOLKSWAGEN:
                    "https://qa-volkswagenargentina.cs16.force.com/services/apexrest/createNewLead",
                XAPPIA_DEALER: "KAI"
            },
            env_production: {
                PORT: 8000,
                NODE_ENV: "production",
                XAPPIA_USERNAME: "fGvova1i0J1nYiwXKgIY",
                XAPPIA_PASSWORD: "o0dz2qd2nDnyI05TGS28",
                XAPPIA_API_TOYOTA:
                    "https://api.toyota.com.ar:9201/dcx/api/leads",
                XAPPIA_API_VOLKSWAGEN:
                    "https://volkswagenargentina.force.com/services/apexrest/createNewLead",
                XAPPIA_DEALER: "KAI"
            }
        }
    ]
};
