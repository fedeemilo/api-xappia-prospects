const axios = require("axios");
require("../config");

const instance = axios.create({
    timeout: 2 * 60 * 1000,
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        username: "cw1kA5l0m0zVC7Bf6qYn",
        password: "gKwekUuVLpm7YWbXfHy0",
        dealer: "KAI"
    }
});

instance.interceptors.request.use(config => {
    config.headers["request-startTime"] = process.hrtime();
    return config;
});

instance.interceptors.response.use(response => {
    const start = response.config.headers["request-startTime"];
    const end = process.hrtime(start);
    const milliseconds = Math.round(end[0] * 1000 + end[1] / 1000000);
    response.headers["request-duration"] = milliseconds;
    return response;
});

const adapter = {
    get: url => instance.get(url),
    post: (url, body) => instance.post(url, body),
    put: (url, body) => instance.put(url, body),
    delete: url => instance.delete(url)
};

module.exports = adapter;
