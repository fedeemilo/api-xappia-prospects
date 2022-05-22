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
let baseApiToyota;
let baseUrlApiVolkswagen;

if (process.env.NODE_ENV === "dev") {
    baseUrl = `http://localhost:${process.env.PORT}`;
    baseUsername = "cw1kA5l0m0zVC7Bf6qYn";
    basePassword = "gKwekUuVLpm7YWbXfHy0";
    baseDealer = "KAI";
    baseApiToyota = "http://200.7.15.135:9201/dcx/api/leads";
    baseUrlApiVolkswagen =
        "https://qa-volkswagenargentina.cs16.force.com/services/apexrest/createNewLead";
} else {
    baseUrl = "http://ec2-13-58-180-105.us-east-2.compute.amazonaws.com:8000";
    baseUsername = "fGvova1i0J1nYiwXKgIY";
    basePassword = "o0dz2qd2nDnyI05TGS28";
    baseDealer = "KAI";
    baseApiToyota = "https://api.toyota.com.ar:9201/dcx/api/leads";
    baseUrlApiVolkswagen =
        "https://volkswagenargentina.force.com/services/apexrest/createNewLead";
}

// ============================
//  Globals
// ============================
process.env.BASE_URL = baseUrl;
process.env.BASE_USERNAME = baseUsername;
process.env.BASE_PASSWORD = basePassword;
process.env.BASE_DEALER = baseDealer;
process.env.BASE_API_TOYOTA = baseApiToyota;
process.env.BASE_API_VOLKSWAGEN = baseUrlApiVolkswagen;
