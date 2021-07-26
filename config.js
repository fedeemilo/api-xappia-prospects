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
  baseUrl = "https://api-xappia-prospects.herokuapp.com";
}

// ============================
//  Globals
// ============================
process.env.BASE_URL = baseUrl;
