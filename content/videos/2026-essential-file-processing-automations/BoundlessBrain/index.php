<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <title>BoundlessBrain - Where learning has no limits</title>

    <!-- Bootstrap -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">

    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,200..1000;1,200..1000&family=Roboto:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet">

    <!-- Filestack CSS-->
    <link rel="stylesheet" href="https://static.filestackapi.com/transforms-ui/2.x.x/transforms.css" />

    <link rel="stylesheet" href="styles.css">
</head>
<body>

<div class="d-flex app-container cStyle">

    <!-- SIDEBAR -->
    <aside class="sidebar p-4">
        <div class="logo mb-4 text-center">
            <img src="logo.png" alt="BoundlessBrain Logo" class="img-fluid">
        </div>

        <h6 class="mb-3 text-uppercase fw-semibold hStyle">My Courses</h6>

        <ul id="courseList" class="list-unstyled course-list"></ul>

        <button class="btn btnStyle1 w-100 mt-4" onclick="showAddCourse()">+ Add Course </button>
    </aside>

    <!-- MAIN CONTENT -->
    <main class="content-area p-5 flex-grow-1">

        <!-- WELCOME -->
        <section id="welcomeScreen">
            <h2 class="hStyle">Welcome to BoundlessBrain</h2>
            <p class="text-muted mt-2">
                Create a course to get started or view an existing course.
            </p>
        </section>

        <!-- ADD COURSE -->
        <section id="addCourseScreen" class="d-none">
            <h3 class="hStyle">Add Course</h3>

            <div class="mt-4">
                <label class="form-label">Course Title</label>
                <input id="courseTitleInput" class="form-control mb-3">

                <label class="form-label">Course Description</label>
                <textarea id="courseDescInput" class="form-control" rows="6"></textarea>
            </div>

            <div class="mt-4">
                <button class="btn btn-outline-secondary me-2" onclick="cancelAddCourse()">Cancel</button>
                <button class="btn btnStyle2" onclick="saveCourse()">Save</button>
            </div>
        </section>

        <!-- COURSE VIEW -->
        <section id="courseViewScreen" class="d-none">
            <h3 id="courseTitle" class="hStyle"></h3>
            <p id="courseDescription" class="text-muted mt-2"></p>

            <hr>

            <h5 class="hStyle">Course Contents</h5>
            <ul id="contentList" class="content-list mt-3"></ul>

            <button class="btn btnStyle2 mt-4" onclick="showAddContent()">Add Content</button>
        </section>

        <!-- ADD CONTENT -->
        <section id="addContentScreen" class="d-none">
            <h3 class="hStyle">Add Course Content</h3>
            <p class="text-muted" id="addContentCourseTitle"></p>

            <div class="mt-4">
                <label class="form-label">Title</label>
                <input id="contentTitleInput" class="form-control mb-3">

                <label class="form-label">Description</label>
                <textarea id="contentDescInput" class="form-control mb-3" rows="5"></textarea>

                <label class="form-label">Attachment</label><br>
                <button class="btn btnStyle3" id="uploadBtn">Upload</button>
                <div id="filePreview"></div>
            </div>
            <hr>

        <div class="mt-4">
                <button class="btn btn-outline-secondary me-2" onclick="cancelAddContent()">Cancel</button>
                <button class="btn btnStyle2" onclick="saveContent()">Save</button>
            </div>
        </section>

        <!-- CONTENT DETAILS VIEW -->
        <section id="contentDetailsViewScreen" class="d-none">
            <!--<h4 id="courseTitle1"></h4>
            <h3 id="contentTitle" class="text-muted mt-2"></h3>-->
            <h4 class="text-muted"><span id="courseTitle1"></span> > <span id="contentTitle" class="textColor1"></span></h4>
            <p class="small">Posted on <span id="createdAt"></span></p>
            <p id="contentDescription" class="text-muted mt-2"></p>
            <div id="attachment"></div>
            <button class="btn btnStyle2 mt-4" id="btnBackToCourse">Back to Course</button>
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

<!-- Filestack JS -->
<script src="https://static.filestackapi.com/filestack-js/3.x.x/filestack.min.js"></script>

<script src="app.js"></script>
</body>
</html>
