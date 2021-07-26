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
    <div class="p-1 mt-1">
      <a href="/" style="font-size: 1.6rem; text-decoration: none"
        >&#129044; Inicio</a
      >
    </div>
    <div class="alert alert-success mt-2" role="alert">
      Los Leads han sido enviados con éxito a Salesforce!
    </div>

    <div class="alert alert-secondary mt-2">
      <h3>Lista de ID's de Leads enviados</h3>
      <hr />
      <p class="lead">${listLeads}</p>
    </div>
  </body>
</html>`;

module.exports = { htmlSuccess };
