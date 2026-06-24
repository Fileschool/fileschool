<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <title>PropertyPalm</title>

    <!-- Bootstrap -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">

    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=EB+Garamond:wght@500&family=Oswald:wght@600&display=swap" rel="stylesheet">

    <!-- Filestack CSS -->
    <link rel="stylesheet" href="https://static.filestackapi.com/transforms-ui/3.x.x/transforms.css" />

    <link rel="stylesheet" href="styles.css">
</head>
<body>

<div class="d-flex app-container">

    <!-- SIDEBAR -->
    <aside class="sidebar p-4">
        <div class="logo text-center mb-4">
            <img src="logo.png" class="img-fluid">
        </div>

        <h4 class="hStyle mb-3">Your Listings</h4>
        <ul id="listingList" class="list-unstyled listing-list"></ul>

        <button class="btn btnStyle1 btn-lg w-100 mt-4" onclick="showAddListing()">Add Listing</button>
    </aside>

    <!-- MAIN -->
    <main class="content-area p-5 flex-grow-1">

        <!-- WELCOME -->
        <section id="welcomeScreen">
            <h3 class="hStyle">Welcome to PropertyPalm</h3>
            <p class="text-muted mt-2">
                Select a listing or add a new one to get started.
            </p>
        </section>

        <!-- ADD LISTING -->
        <section id="addListingScreen" class="d-none">
            <h3 class="hStyle">Add a Listing</h3>

            <div class="mt-4">
                <label class="form-label">Listing Name</label>
                <input id="listingNameInput" class="form-control mb-3">

                <label class="form-label">Address</label>
                <input id="addressInput" class="form-control mb-3">

                <label class="form-label">Property Type</label>
                <select id="propertyTypeInput" class="form-control">
                    <option value="">Select</option>
                    <option>House</option>
                    <option>Condo</option>
                    <option>Apartment</option>
                    <option>Commercial</option>
                    <option>Other</option>
                </select>
            </div>

            <div class="mt-5">
                <button class="btn btn-outline-secondary me-2" onclick="cancelAddListing()">Cancel</button>
                <button class="btn btnStyle2" onclick="saveListing()">Save</button>
            </div>
        </section>

        <!-- LISTING VIEW -->
        <section id="listingViewScreen" class="d-none">
            <h3 id="listingName" class="hStyle"></h3>
            <p class="text-muted"><span class="fw-bold">Address: </span><span id="listingAddress"></span></p>
            <p class="text-muted"><span class="fw-bold">Property Type: </span><span id="listingType"></span></p>

            <hr>

            <h5 class="hStyle">Media Gallery</h5>

            <div class="media-grid mt-3">
                <div class="media-card add-media" id="uploadBtn">
                    <span>+</span>
                    <small>Add Media</small>
                </div>

                <div id="mediaList" class="d-flex flex-wrap gap-3"></div>
            </div>
        </section>

    </main>
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
