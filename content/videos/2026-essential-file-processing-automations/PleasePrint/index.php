<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>PleasePrint</title>

  <!-- Bootstrap -->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">

  <!-- Google Fonts -->
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&display=swap" rel="stylesheet">

  <!-- Filestack CSS -->
  <script src="https://static.filestackapi.com/filestack-js/3.x.x/filestack.min.js"></script>

  <link rel="stylesheet" href="styles.css">
</head>
<body>

<div class="container py-5">

  <!-- HEADER -->
  <div class="text-center mb-5">
    <img src="logo.png" class="mb-3 img-fluid">
      <p class="text-muted">
        Printing and delivering your designs and documents in a pleasant way
      </p>
  </div>

  <!-- HOME -->
  <section id="homeScreen">
    <div class="row g-4" id="printGrid">

      <!-- Add New Print -->
      <div class="col-md-3">
        <div class="print-card add-card" onclick="showAddPrint()">
          <div class="plus">+</div>
          <p>Add New Print</p>
        </div>
      </div>

    </div>
  </section>

  <!-- ADD PRINT -->
  <section id="addPrintScreen" class="d-none">
    <h4 class="mb-4">Add New Print</h4>

    <div class="mb-3">
      <label class="form-label">Print Name</label>
      <input id="printNameInput" class="form-control">
    </div>

    <div class="mb-3">
      <label class="form-label">Quantity</label>
      <input id="quantityInput" type="number" min="1" class="form-control">
    </div>

    <div class="upload-box mb-4" id="uploadBtn">Click here to upload your design</div>

    <div id="uploadStatus"></div>

    <div class="mt-4">
      <button class="btn btn-outline-secondary me-2" onclick="cancelAddPrint()">Cancel</button>
      <button class="btn gradient-btn" onclick="savePrint()">Save</button>
    </div>
  </section>

  <!-- PRINT DETAILS -->
  <section id="printDetailsScreen" class="d-none">
    <h4 id="detailName"></h4>

    <p class="text-muted">
      Quantity: <span id="detailQty"></span><br>
      Status:
      <span id="detailStatus" class="badge"></span><br>
      Created: <span id="detailDate"></span>
    </p>

    <div id="detailPreview" class="mt-4"></div>

    <div class="mt-4 d-flex gap-2">
        <button class="btn btn-outline-secondary" onclick="goBackHome()">
            Back
        </button>

        <button class="btn gradient-btn">
            Check Out
        </button>
    </div>

  </section>

</div>
<?php include 'php/config.php'; ?>

 <!-- Load API Key -->
<script>
    window.APP_CONFIG = {
        FILESTACK_KEY: "<?= FILESTACK_API_KEY ?>"
    };
</script>

<!-- Filestack -->
<script src="https://static.filestackapi.com/filestack-js/3.x.x/filestack.min.js"></script>
<script src="app.js"></script>
</body>
</html>
