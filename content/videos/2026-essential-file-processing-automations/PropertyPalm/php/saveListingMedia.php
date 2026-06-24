<?php
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
    header("Content-Type: application/json");
    
    include "connection.php";
    if($conn){

        $data = json_decode(file_get_contents('php://input'), true);
        if(isset($data["listing_id"], $data["file_handle"])) {
            $listingId = trim($data['listing_id']) ?? null;
            $handle = trim($data['file_handle']) ?? null;

            if($listingId==="" || $handle===""){
                echo json_encode([
                    "success" => false,
                    "error" => "All details are required."
                ]);
                sqlsrv_close($conn);
                exit;
            }

            $mimetype = $data['mimetype'] ?? '';
            $mediaType = str_starts_with($mimetype, 'video/') ? 'video' : 'image';

            $query = "
                INSERT INTO listing_media (listing_id, file_handle, media_type, created_at)
                VALUES (?, ?, ?, GETDATE())
            ";
            $params = array($listingId, $handle, $mediaType);
            $result = sqlsrv_query($conn, $query, $params);
            if($result===false){
                echo json_encode([
                    "success" => false,
                    "error" => "Failed to save listing media"
                ]);
                sqlsrv_close($conn);
                exit;
            }
            else{
                $row = sqlsrv_fetch_array($result, SQLSRV_FETCH_ASSOC);
                sqlsrv_close($conn);
                echo json_encode([
                    "success" => true
                ]);
            }
        }
        else{
            echo json_encode([
                "success" => false,
                "error" => "Missing required fields"
            ]);
            sqlsrv_close($conn);
            exit;
        }
    }
    else{
        echo json_encode([
            "success" => false,
            "error" => "Database connection failed"
        ]);
        exit;
    }
?>
