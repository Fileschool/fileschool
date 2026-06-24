<?php
include "config.php";
header('Content-Type: application/json');

$jobId = $_GET['job'] ?? null;
if(!$jobId) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing job ID']);
    exit;
}

$API_KEY = FILESTACK_API_KEY;

// Generate these from your Filestack dashboard
$POLICY = 'yourPolicy';
$SIGNATURE = 'yourSignature';

$url = "https://cdn.filestackcontent.com/$API_KEY/security=p:$POLICY,s:$SIGNATURE/workflow_status=job_id:$jobId";

$response = file_get_contents($url);
if($response === false) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to fetch workflow status']);
    exit;
}

$data = json_decode($response, true);

if($data['status'] !== 'Finished') {
    echo json_encode([
        'status' => $data['status']
    ]);
    exit;
}

/**
 * Extract processed file URL
 */
$processedUrl = null;

foreach($data['results'] as $task) {
    if(isset($task['data']['url'])) {
        $processedUrl = $task['data']['url'];
        break;
    }
}

if(!$processedUrl) {
    http_response_code(500);
    echo json_encode(['error' => 'No processed file found']);
    exit;
}

/**
 * Convert URL → handle
 */
$parts = explode('/', parse_url($processedUrl, PHP_URL_PATH));
$handle = end($parts);

echo json_encode([
    'status' => 'Finished',
    'handle' => $handle
]);
