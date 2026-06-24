// initialize Froala Editor with the specific options
document.addEventListener("DOMContentLoaded", function() {
    new FroalaEditor('#froala-editor', {
        filestackOptions: {
            filestackAPI: filestackAPIKey,
            uploadToFilestackOnly: true,
            pickerOptions: {
                accept: ['image/*'],
                fromSources: ['local_file_system']
            }
        },
        toolbarButtons: {
            'moreRich': {
                'buttons': ['openFilePickerImageOnly', 'insertLink', 'insertTable', 'emoticons', 'specialCharacters', 'insertHR'],
                'buttonsVisible': 3
            },
            'moreText': {
                'buttons': ['bold', 'italic', 'underline', 'fontFamily', 'fontSize', 'textColor', 'backgroundColor', 'clearFormatting']
            },
            'moreParagraph': {
                'buttons': ['alignLeft', 'alignCenter', 'formatOLSimple', 'alignRight', 'alignJustify', 'formatOL', 'formatUL', 'paragraphFormat', 'paragraphStyle', 'lineHeight', 'outdent', 'indent', 'quote']
            },
            'moreMisc': {
                'buttons': ['undo', 'redo', 'fullscreen', 'selectAll', 'html', 'help'],
                'align': 'right',
                'buttonsVisible': 2
            }
        },
        events: {
            // for updating the editor's contents (which we'll need to store in the back end)
            'contentChanged': function () {
                editorContents = this.html.get();
            },
            'filestack.uploadedToFilestack': function (response) {
                console.log("Callback is triggered for upload to Filestack");

                // just some UI/design stuff
                document.getElementById('postcardResult').innerHTML = '<div class="d-flex justify-content-center mt-3"><div class="spinner-border text-primary text-center" role="status"><span class="visually-hidden"></span></div></div><p class="text-center mt-3">Processing your postcard. Please wait...</p>';
                new bootstrap.Modal(document.querySelector("#postcardModal")).show();
                document.getElementById('postcardModalFooter').classList.add('d-none');

                // check the contents of the Filestack upload response
                console.log(response);

                // Start processing the image (Filestack URL)
                checkSFW(response.filesUploaded[0].url);
            },
            'filestack.filestackPickerOpened': function (response) {
                console.log("Callback is triggered for picker opened");
            },
            'filestack.filestackPickerClosed': function (response) {
                console.log("Callback is triggered for picker closed");
            },
            'filestack.uploadFailedToFilestack': function (response) {
                console.log(response);
            },
        },
        heightMin: 400,
        heightMax: 1000
    });
});

// check whether the file is safe for work or not
async function checkSFW(fileUrl) {
    const sfwUrl = `https://cdn.filestackcontent.com/security=policy:${policy},signature:${signature}/sfw/${fileUrl}`;

    try {
        const response = await fetch(sfwUrl);
        const data = await response.json();
        if (data.sfw) {
            // move to the next set of processes if SFW
            await processPostcard(fileUrl);
        } else {
            document.getElementById('postcardResult').innerHTML = 'This file is NOT safe for work!';
        }
    } catch (error) {
        console.error('Error checking SFW status:', error);
    }
}

// crop the image to a 816x528 resolution and apply a Polaroid effect
async function applySmartCrop(fileUrl) {
    const smartCropUrl = `https://cdn.filestackcontent.com/smart_crop=width:816,height:528/polaroid/${fileUrl}`;
    try {
        const response = await fetch(smartCropUrl); // Perform smart cropping
        if (response.ok) {
            return smartCropUrl; // Return new URL after cropping
        } else {
            throw new Error('Error cropping image');
        }
    } catch (error) {
        console.error('Error applying smart crop:', error);
    }
}

var processedImageURL;
var regionName;
var temperature;
var weatherIcons;
var weatherDescriptions;
var editorText;
var postcardTitle;
var editorContents;

async function processPostcard(fileUrl) {
    try {
        // apply smart crop and Polaroid effects
        const croppedFileUrl = await applySmartCrop(fileUrl);

        // Insert the final image into the Froala editor
        const editor = FroalaEditor.INSTANCES[0];
        let currentContent = editor.html.get();

        // Update image within the editor
        const updatedContent = currentContent.replace(
            new RegExp(fileUrl, 'g'), // Replace all occurrences of the original URL
            croppedFileUrl
        );
        editor.html.set(updatedContent);
        editorContents = editor.html.get();

        // Store the cropped image URL
        processedImageURL = croppedFileUrl;

        // Define API URLs
        const ipStackURL = `https://api.ipstack.com/check?access_key=${ipStackKey}&fields=region_name`;
        const ipStackResponse = await fetch(ipStackURL).then(res => res.json());

        regionName = ipStackResponse.region_name;

        if(regionName) {
            // Fetch weather information from WeatherStack
            const weatherStackURL = `https://api.weatherstack.com/current?access_key=${weatherStackKey}&query=${regionName}`;
            const weatherStackResponse = await fetch(weatherStackURL).then(res => res.json());

            // Extract weather information
            temperature = weatherStackResponse.current?.temperature;
            weatherIcons = weatherStackResponse.current?.weather_icons[0];
            weatherDescriptions = weatherStackResponse.current?.weather_descriptions[0];
        }
        else {
            console.error("Region name not found");
        }
        document.getElementById('postcardResult').innerHTML = 'Postcard processed successfully!';
    }
    catch(error) {
        console.error('Error during postcard processing:', error);
        document.getElementById('postcardResult').innerHTML = error.message;
    }
    finally {
        document.getElementById('postcardModalFooter').classList.remove('d-none');
    }
}

// Save postcard to DB through fetch call
async function savePostcard() {
    editorText = extractContent(editorContents);
    postcardTitle = document.getElementById('postcardTitle').value;

    try {
        const response = await fetch('php/add-card.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                postcardTitle: postcardTitle,
                editorText: editorText,
                editorContents: editorContents,
                processedImageURL: processedImageURL,
                regionName: regionName,
                temperature: temperature,
                weatherIcons: weatherIcons,
                weatherDescriptions: weatherDescriptions
            })
        });

        const data = await response.json();
        if(data == '1') {
            document.getElementById('postcardResult').innerHTML = 'Postcard saved!';
            resetFields();
        }
        else if(data == '2') {
            document.getElementById('postcardResult').innerHTML = 'Please fill in all required information.';
        }
        else {
            document.getElementById('postcardResult').innerHTML = '';
            for(const obj of JSON.parse(data)) {
                const errorMsg = document.createElement("p");
                const textNode = document.createTextNode(obj);
                errorMsg.appendChild(textNode);
                document.getElementById('postcardResult').appendChild(errorMsg);
            }
        }

        new bootstrap.Modal(document.querySelector("#postcardModal")).show();
    } catch (error) {
        console.error('AJAX error: ', error);
    }
}

function resetFields() {
    document.getElementById('postcardTitle').value = '';
    document.getElementById('postcardResult').value = '';
    const editor = FroalaEditor.INSTANCES[0];
    editor.html.set('');
    editorText = '';
    editorContents = '';
    processedImageURL = '';
    regionName = '';
    temperature = '';
    weatherIcons = '';
    weatherDescriptions = '';
}

// Function for getting text from Froala Editor and returning only text content
function extractContent(s) {
    var span = document.createElement('span');
    span.innerHTML = s;
    return span.textContent || span.innerText;
};
