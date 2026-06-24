# 2026 Essential File Processing Automations

## Overview

This project, showcased in a 2026 webinar, demonstrates using Filestack Workflows to automate different file processing tasks across 3 small-scale web applications. It highlights how to:

- Use Filestack **Workflows** to chain and run file processes.
- Check files for unsafe content, malware, and viruses
- Optimize, enhance, and standardize images and videos during upload
- Receive job results from Workflows via polling

## Features

- **BoundlessBrain**: An EdTech platform where users (instructors) can upload images along with course content.
- **PropertyPalm**: A startup web app where realtors can create a repository of their properties for sale and upload images and videos.
- **PleasePrint**: A print service application where users can submit images. The platform then makes the images print-ready and delivers them to users.
- **File Upload**: Users can upload different files through Filestack's file picker.
- **NSFW Check**: Check whether an image is safe for work or not.
- **Metadata Extraction**: Retrieve and display additional metadata like file size and format.
- **Virus Detection**: Check for any viruses or malware in the uploaded file.
- **Image Resize**: Define the image's new width and height.
- **Watermark**: Attach branding or other image elements to image uploads.
- **Storage Routing**: Decide where your files go once uploaded.
- **Video Convert**: Ensure that all video uploads are converted to MP4.
- **Convert to PDF**: Convert images into PDF for printing.

## Prerequisites

1. A Filestack account.
2. A valid Filestack API Key with access to Workflows and Webhooks.
3. A Filestack policy and signature
4. A basic understanding of HTML, JavaScript, CSS, and back-end scripting languages.

## How to Use

### 1. Clone the Repository

### 2. Replace Necessary Fields

For each project, open the "app.js", "config.php", "connection.php", "getWorkflowResult.php", and "runWorkflow.php" files and replace all fields with placeholder values, including the API key, policy, signature, and Workflow ID.

### 3. Create DB Tables

This project uses 5 simple tables across all 3 demos. Create similar fields based on the PHP files attached.

### 3. Run The Demo/s
