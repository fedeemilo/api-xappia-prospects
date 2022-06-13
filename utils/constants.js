const ENV = {
    XAPPIA_USERNAME: process.env.XAPPIA_USERNAME,
    XAPPIA_PASSWORD: process.env.XAPPIA_PASSWORD,
    XAPPIA_API_TOYOTA: process.env.XAPPIA_API_TOYOTA,
    XAPPIA_API_VOLKSWAGEN: process.env.XAPPIA_API_VOLKSWAGEN
};

const API_OPTIONS = prospect => ({
    method: "post",
    body: JSON.stringify(prospect),
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        username: ENV.XAPPIA_USERNAME,
        password: ENV.XAPPIA_PASSWORD,
        dealer: "KAI"
    }
});

const TOYOTA_OPTIONS = dealer => ({
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        username: ENV.XAPPIA_USERNAME,
        password: ENV.XAPPIA_PASSWORD,
        dealer
    }
});

const TOYOTA_ERRORS = err => {
    const ERROR =
        err["Error"] || err["Auth error"] || err["message"] || "default";

    switch (ERROR) {
        case "invalid user":
        case "invalid password":
            return "❌ El nombre de usuario o contraseña es incorrecto.";
        case "Resource not found":
            return "❌ Ha ocurrido un error con el servidor";
        case "Fuente no registrada":
            return "❌ El código de Dealer proporcionado no es válido";
        default:
            return "❌ No se pudo enviar el lead. Inténtelo de nuevo.";
    }
};

const VOLKSWAGEN_ERRORS = err => {
    const ERROR = err[0]["message"] || "default";

    switch (ERROR) {
        case "Could not find a match for URL":
            return "❌ La URL de la API no es correcta";
        default:
            return "❌ Ha ocurrido un error en el envío de leads";
    }
};

module.exports = {
    ENV,
    API_OPTIONS,
    TOYOTA_OPTIONS,
    TOYOTA_ERRORS,
    VOLKSWAGEN_ERRORS
};
