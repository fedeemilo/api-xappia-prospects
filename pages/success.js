const htmlSuccess = listLeads => `<!DOCTYPE html>
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
    <div class="alert alert-success positio-relative mt-2" style="bottom: -1rem" role="alert">
      Los Leads han sido enviados con éxito a Salesforce!
    </div>

    <div class="alert alert-secondary mt-n2">
      <h3>Lista de ID's de Leads enviados</h3>
      <hr />
      <p class="lead">${listLeads}</p>
    </div>
  </body>
</html>`;

module.exports = { htmlSuccess };
