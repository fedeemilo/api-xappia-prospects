const {
    invalidUserMsg,
    invalidPasswordMsg,
    noDealerMsg,
    noDealerHelp,
    invalidUserHelp,
    invalidPasswordHelp,
    invalidProviderMsg,
    invalidProviderHelp,
    noLastNameMsg,
    inactiveUserMsg,
    inactiveUserHelp
} = require("../constants/messages");

module.exports = (status, data, res, ok) => {
    /* Error 400 */
    if (status === 400) {
        if (data.Error === "Faltan campos obligatorios: [LastName]") {
            return res.json({
                ok,
                status,
                message: noLastNameMsg
            });
        }

        if (data.Error.contains("operation performed with inactive user")) {
            return res.json({
                ok,
                status,
                message: inactiveUserMsg,
                help: inactiveUserHelp
            });
        }
    }

    //   /* Error 404 */
    if (status === 404) {
        // Invalid user
        if (data["Auth error"] === "invalid user") {
            return res.json({
                ok,
                status,
                message: invalidUserMsg,
                help: invalidUserHelp
            });
        }

        // Invalid password
        if (data["Auth error"] === "invalid password") {
            return res.json({
                ok,
                status,
                message: invalidPasswordMsg,
                help: invalidPasswordHelp
            });
        }
    }

    /* Error 412 */
    if (status === 412) {
        if (data.Error === "no dealer specified") {
            return res.json({
                ok,
                status,
                message: noDealerMsg,
                help: noDealerHelp
            });
        }

        if (data.Error === "Fuente no registrada") {
            return res.json({
                ok,
                status,
                message: invalidProviderMsg,
                help: invalidProviderHelp
            });
        }
    }
};
