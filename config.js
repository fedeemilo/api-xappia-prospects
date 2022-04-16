// ============================
//  Puerto
// ============================
process.env.PORT = process.env.PORT || 8000;

// ============================
//  Entorno
// ============================
process.env.NODE_ENV = process.env.NODE_ENV || "dev";

let baseUrl;
let baseUsername;
let basePassword;
let baseDealer;

if (process.env.NODE_ENV === "dev") {
    baseUrl = `http://localhost:${process.env.PORT}`;
    baseUsername = "cw1kA5l0m0zVC7Bf6qYn";
    basePassword = "gKwekUuVLpm7YWbXfHy0";
    baseDealer = "Datero";
} else {
    baseUrl = "http://ec2-13-58-180-105.us-east-2.compute.amazonaws.com:8000";
    baseUsername = process.env.BASE_USERNAME;
    basePassword = process.env.BASE_PASSWORD;
    baseDealer = process.env.BASE_DEALER;
}

// ============================
//  Globals
// ============================
process.env.BASE_URL = baseUrl;
process.env.BASE_USERNAME = baseUsername;
process.env.BASE_PASSWORD = basePassword;
process.env.BASE_DEALER = baseDealer;
