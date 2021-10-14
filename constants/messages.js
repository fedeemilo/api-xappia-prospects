const invalidUserMsg =
  "El usuario enviado en el header (username) no coincide con el registrado en la api";

const invalidUserHelp = "El concesionario debe de proveer el username";

const invalidPasswordMsg =
  "La contraseña enviada en el header (password) no coincide con el registrado en la api";

const invalidPasswordHelp = "El concesionario debe de proveer el password";

const noDealerMsg =
  "No se encontró el dealer o no fue especificado en el JSON enviado";

const noDealerHelp =
  "Debe ser el ID externo del concesionario, este es quien lo debe proveer y consta de 3 letras";

const invalidProviderMsg =
  "La fuente provider.name.value no está creada en Salesforce";

const invalidProviderHelp =
  "El concesionario debe de crear el registro fuente con el valor especificado en el JSON";

const noLastNameMsg =
  "El valor names[1].value no fue especificado en el JSON, o bien se envió vacío o nulo";

const inactiveUserMsg =
  "El propietario del Lead asignado se encuentra inactivo";

const inactiveUserHelp =
  "Comunicarse con el concesionario informando que existe un usuario inactivo en la regla de derivacion para ese origen";

module.exports = {
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
};
