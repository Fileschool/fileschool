<?php
// PHP upload example
// Run after: composer require filestack/filestack-php

require_once 'vendor/autoload.php';

use Filestack\FilestackClient;
use Filestack\Filelink;

$API_KEY = "YOUR_API_KEY"; // Replace with your Filestack API key

// Upload a file
$client = new FilestackClient($API_KEY);
$filelink = $client->upload("/path/to/file.jpg");

echo "Uploaded URL: " . $filelink->url . PHP_EOL;
echo "Handle: " . $filelink->handle . PHP_EOL;

// Work with an existing filelink
$existingFilelink = new Filelink("YOUR_FILE_HANDLE", $API_KEY);

// Get metadata
$metadata = $client->getMetaData($existingFilelink->handle, ["filename", "size"]);
print_r($metadata);

// Download
$client->download($existingFilelink->handle, "/tmp/downloaded_file.jpg");

// Transform: circle crop then blur, then store result
$transformed = $existingFilelink->circle()->blur(["amount" => 10])->store();
echo "Transformed URL: " . $transformed->url . PHP_EOL;

// Intelligent Ingestion (must be enabled for your API key)
// $filelink = $client->upload("/path/to/largefile.mp4", ["intelligent" => true]);
