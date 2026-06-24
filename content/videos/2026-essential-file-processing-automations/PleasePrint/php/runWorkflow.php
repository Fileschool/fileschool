<?php
include "config.php";
header('Content-Type: application/json');

$input = json_decode(file_get_contents('php://input'), true);
$handle = $input['handle'] ?? null;

if(!$handle) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing handle']);
    exit;
}

$API_KEY = FILESTACK_API_KEY;
$POLICY = 'yourPolicy';
$SIGNATURE = 'yourSignature';
$WORKFLOW_ID = 'yourWorkflowID';

$url = "https://cdn.filestackcontent.com/security=p:$POLICY,s:$SIGNATURE/run_workflow=id:$WORKFLOW_ID/$handle";

$response = file_get_contents($url);
if($response === false) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to run workflow']);
    exit;
}

echo $response;
