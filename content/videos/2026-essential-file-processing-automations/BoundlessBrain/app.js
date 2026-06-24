let activeCourseId = null;

/* SCREEN HELPERS */
function hideAllScreens() {
    document.querySelectorAll('main section').forEach(s => s.classList.add('d-none'));
}

function showScreen(id) {
    hideAllScreens();
    document.getElementById(id).classList.remove('d-none');
}

/* INITIAL */
showScreen('welcomeScreen');
renderCourseList();

/* COURSES */
function showAddCourse() {
    showScreen('addCourseScreen');
}

function cancelAddCourse() {
    fetch('php/loadCourses.php')
    .then(res => res.json())
    .then(data => {
        if(data.length === 0) {
            showScreen('welcomeScreen');
        }
        else {
            loadCourse(data[0].course_id);
        }
    });
}

function saveCourse() {
    const title = courseTitleInput.value.trim();
    const desc = courseDescInput.value.trim();

    if(!title) {
        alert('Course title required');
        return;
    }

    fetch('php/saveCourse.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            title: title,
            description: desc
        })
    })
    .then(res => res.json())
    .then(data => {
        if (!data.success) throw new Error();

        renderCourseList();
        loadCourse(data.course_id);
    })
    .catch(() => alert('Failed to save course'));
}

function renderCourseList() {
    const courseListEl = document.getElementById('courseList');

    // Clear existing list
    courseListEl.innerHTML = '';

    fetch('php/loadCourses.php')
    .then(res => {
        if(!res.ok) {
            throw new Error('Failed to load courses');
        }
        return res.json();
    })
    .then(data => {
        data.forEach(course => {
            const li = document.createElement('li');
            li.textContent = course.course_title;
            li.onclick = () => loadCourse(course.course_id);
            courseListEl.appendChild(li);
        });
    })
    .catch(error => {
        console.error('Error loading courses:', error);
    });
}

function loadCourse(courseId) {
    activeCourseId = courseId;

    fetch(`php/loadCourse.php?id=${courseId}`)
    .then(res => res.json())
    .then(course => {
        courseTitle.textContent = course.course_title;
        courseDescription.textContent = course.course_description;

        renderContentList(courseId);
        showScreen('courseViewScreen');
    })
    .catch(err => console.error(err));
}

/* CONTENT */
function renderContentList(courseId) {
    contentList.innerHTML = '';

    fetch(`php/loadContents.php?course_id=${courseId}`)
    .then(res => res.json())
    .then(contents => {
        contents.forEach(c => {
            const li = document.createElement('li');
            li.innerHTML = `<a href="#" onclick="loadContentDetails(${courseId}, ${c.content_id})">${c.content_title}</a>`;
            contentList.appendChild(li);
        });
    })
    .catch(err => console.error(err));
}

function showAddContent() {
    fetch(`php/loadCourse.php?id=${activeCourseId}`)
    .then(res => res.json())
    .then(course => {
        addContentCourseTitle.textContent = course.course_title;
        showScreen('addContentScreen');
    });
}

function cancelAddContent() {
    loadCourse(activeCourseId);
}

const filestackClient = filestack.init(window.APP_CONFIG.FILESTACK_KEY);
let selectedFile = null;

const CONFIG = {
    key: window.APP_CONFIG.FILESTACK_KEY,
    workflowId: 'yourWorkflowID'
}

const pickerOptions = {
    maxFiles: 1,
    uploadInBackground: false,
    accept: ['image/*'],
    fromSources: ['local_file_system', 'googledrive', 'unsplash'],

    onUploadDone: (res) => {
        const rawHandle = res.filesUploaded[0].handle;
        startWorkflow(rawHandle);
    }
};


document.getElementById('uploadBtn').addEventListener('click', () => {
    filestackClient.picker(pickerOptions).open();
});

function startWorkflow(originalHandle) {
    fetch('php/runWorkflow.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ handle: originalHandle })
    })
    .then(res => res.json())
    .then(data => {
        if (!data.jobid) throw new Error('No job ID');
        pollWorkflowResult(data.jobid);
    })
    .catch(console.error);
}

function pollWorkflowResult(jobId) {
    fetch(`php/getWorkflowResult.php?job=${jobId}`)
        .then(res => res.json())
        .then(data => {
            if(data.status === 'Finished') {
                selectedFile = {
                    file_handle: data.handle
                };
                showProcessedPreview(data.handle);
            }
            else {
                setTimeout(() => pollWorkflowResult(jobId), 3000);
            }
        })
        .catch(console.error);
}

function showProcessedPreview(handle) {
    const preview = document.getElementById('filePreview');
    const url = `https://cdn.filestackcontent.com/${handle}`;

    preview.innerHTML = `
        <img src="${url}" class="img-fluid rounded mt-2" />
        <div class="alert alert-success mt-2">
            File processed and secured ✓
        </div>
    `;
}


async function saveContent() {
    const title = contentTitleInput.value.trim();
    const desc = contentDescInput.value.trim();

    if(!title) {
        alert('Content title required');
        return;
    }

    if(!selectedFile) {
        alert('Please upload a file first');
        return;
    }

    fetch('php/saveContent.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            course_id: activeCourseId,
            title: title,
            description: desc,
            file_handle: selectedFile.file_handle
        })
    })
    .then(res => res.json())
    .then(data => {
        if(!data.success) throw new Error();
        selectedFile = null;
        document.getElementById('filePreview').innerHTML = '';
        loadCourse(activeCourseId);
    })
    .catch(() => alert('Failed to save content'));
}

function loadContentDetails(courseId, contentId) {
    activeCourseId = courseId;
    contentParams = {
        courseId: courseId,
        contentId: contentId
    };
    const paramString = new URLSearchParams(contentParams).toString();
    fetch(`php/loadContentDetails.php?${paramString}`)
    .then(res => res.json())
    .then(course => {
        courseTitle1.textContent = course.course_title;
        contentTitle.textContent = course.content_title;
        contentDescription.textContent = course.content_description;
        const dateObject = new Date(course.created_at.date.replace(' ', 'T'));
        createdAt.textContent = dateObject.toISOString().slice(0, 19);

        const attachment = document.getElementById('attachment');
        const url = `https://cdn.filestackcontent.com/${course.file_handle}`;

        attachment.innerHTML = `
            <img src="${url}" class="img-fluid rounded mt-2" />
        `;

        showScreen('contentDetailsViewScreen');
    })
    .catch(err => console.error(err));
}

document.getElementById('btnBackToCourse').addEventListener('click', () => {
    loadCourse(activeCourseId);
});