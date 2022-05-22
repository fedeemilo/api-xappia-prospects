const express = require("express");
const router = express.Router();
const path = require("path");
const {
    sendLead,
    toJsonLeadsToyota,
    uploadLead,
    toJsonLeadsVolkswagen
} = require("../controllers/controller.leads");
const { upload } = require("../services");

router.get("/", (req, res) => {
    res.render(path.join(__dirname, "..", "views/pages", "/index.ejs"));
});

/**
 * @swagger
 * /leads-send:
 *  post:
 *    description: Se envía un nuevo prospecto hacia el sistema de Salesforce
 *    parameters:
 *      - in: body
 *        name: lead
 *        description: Enviar lead a Salesforce
 *        schema:
 *          type: object
 *          required:
 *            - lastname
 *            - providerValue
 *          properties:
 *            comments:
 *              type: string
 *              default: ""
 *              description: Comentario del prospecto, texto libre
 *            interest:
 *              type: string
 *              default: null
 *              description: PLAN, USADO o CONVENCIONAL (default)
 *            email:
 *              type: string
 *              default: ""
 *              description: Email del prospecto, debe ser un email válido
 *            name:
 *              type: string
 *              default: ""
 *              description: Nombre del prospecto
 *            lastname:
 *              type: string
 *              default: ""
 *              description: Apellido del prospecto (No puede ir nulo)
 *            phones:
 *              type: array
 *              description: Línea/s fija o movil del prospecto
 *              items:
 *                type: string
 *                default: ""
 *                description: Línea fija o movil
 *            city:
 *              type: string
 *              default: ""
 *              description: Ciudad del prospecto
 *            country:
 *              type: string
 *              default: "Argentina"
 *              description: País del prospecto
 *            vehicles:
 *              type: array
 *              description: Vehículo/s de interés (se define marca, modelo e id externo del modelo)
 *              items:
 *                type: object
 *                properties:
 *                  make:
 *                    type: string
 *                    default: ""
 *                    description: Marca de interés del prospecto
 *                  model:
 *                    type: string
 *                    default: ""
 *                    description: Modelo de interés del prospecto
 *                  code:
 *                    type: string
 *                    default: ""
 *                    description: ID externo del modelo de Salesforce, definido por TASA.
 *            providerValue:
 *              type: string
 *              default: "Datero"
 *              description: Fuente del prospecto definida por el concesionario
 *            providerOrigin:
 *              type: string
 *              default: "Leads TPA"
 *              description: Fuente del prospecto definida por el cocesionario
 *
 *
 *    produces:
 *      - application/json
 *
 *    responses:
 *      '200':
 *        description: Devuelve el LeadId, que indica que el registro fue creado correctamente en Salesforce
 *        schema:
 *          properties:
 *            LeadId:
 *              type: string
 *              example: 00Q3i00000F0Ic0EAF
 *      '412':
 *        description: La fuente provider.name.value no está creada en Salesforce || No se encontró el dealer en el header
 *        schema:
 *          properties:
 *            Error (provider name):
 *              type: string
 *              example: Fuente no registrada
 *            Error (dealer):
 *              type: string
 *              example: no dealer specified
 *      '404':
 *          description: El usuario (username) del header no coincide con el registrado en la api || La contraseña (password) del header no coincide con la registrada en la api.
 *          schema:
 *            properties:
 *              Auth error (username):
 *                type: string
 *                example: invalid user
 *              Auth error (password):
 *                type: string
 *                example: invalid password
 *      '400':
 *        description: El valor names[1].value no fue especificado en el JSON || El propietario del Lead asignado se encuentra inactivo
 *        schema:
 *          properties:
 *            Error (last):
 *              type: string
 *              example: Faltan campos obligatorios [LastName]
 *            Error (origin):
 *              type: string
 *              example: operation performed with inactive user [xxxxxxxx] as owner of lead
 *
 */
router.post("/leads-send", sendLead);

/* Toyota */
router.get("/leads-upload", uploadLead);

router.post("/leads/toyota", upload.single("file"), toJsonLeadsToyota);

/* Volkswagen */
router.post("/leads/volkswagen", upload.single("file"), toJsonLeadsVolkswagen);

module.exports = router;
