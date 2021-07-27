const htmlError = error => `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <!-- Bootstrap -->
    <link
      href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css"
      rel="stylesheet"
      integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC"
      crossorigin="anonymous"
    />
    <title>API Xappia Prospects</title>
  </head>
  <body>
    <div class="d-flex flex-column justify-content-center align-items-center">
      <img src="/images/xappia.png" alt="xappia" style="width: 9%" />
    </div>
    <div class="p-2 mt-2 d-flex justify-content-between">
      <a href="/" style="font-size: 1.6rem; text-decoration: none">&#129044; Inicio</a>
      <a href="/leads-upload" class="btn btn-outline-success" role="button">Cargar nuevo excel</a>
    </div>
    <div class="alert alert-danger mt-3" role="alert">
        <h4 class="alert-heading">Ha habido un error!</h4>
        <p>${error.message}</p>
        <p>${error.help ? error.help : ""}</p>
        <hr>
        <p class="mb-0">Status del error: ${error.statusResponse}</p>
    </div>
  </body>
</html>`;

module.exports = { htmlError };
