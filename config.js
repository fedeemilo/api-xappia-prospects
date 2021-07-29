// ============================
//  Puerto
// ============================
process.env.PORT = process.env.PORT || 8000;

// ============================
//  Entorno
// ============================
process.env.NODE_ENV = process.env.NODE_ENV || "dev";

let baseUrl;

if (process.env.NODE_ENV === "dev") {
  baseUrl = `http://localhost:${process.env.PORT}`;
} else {
  baseUrl = "http://ec2-13-58-180-105.us-east-2.compute.amazonaws.com:8000";
}

// ============================
//  Globals
// ============================
process.env.BASE_URL = baseUrl;
