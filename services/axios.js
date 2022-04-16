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

const adapter = {
    get: url => instance.get(url),
    post: (url, body) => instance.post(url, body),
    put: (url, body) => instance.put(url, body),
    delete: url => instance.delete(url)
};

module.exports = adapter;
