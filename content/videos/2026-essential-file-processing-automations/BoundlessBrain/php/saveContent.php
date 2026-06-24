<?php
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
    header("Content-Type: application/json");
    
    include "connection.php";
    if($conn){
        $data = json_decode(file_get_contents('php://input'), true);
        if(isset($data["course_id"], $data["title"], $data["description"], $data["file_handle"])) {
            $courseId = trim($data["course_id"]);
            $title = trim($data["title"]);
            $description = trim($data["description"]);
            $fileHandle = trim($data["file_handle"]);

            if($title==="" || $description==="" || $description===""){
                echo json_encode([
                    "success" => false,
                    "error" => "Course content details are required."
                ]);
                sqlsrv_close($conn);
                exit;
            }

            $query = "
                INSERT INTO content (course_id, content_title, content_description, file_handle, created_at)
                VALUES (?, ?, ?, ?, GETDATE())
            ";
            $params = array($courseId, $title, $description, $fileHandle);
            $result = sqlsrv_query($conn, $query, $params);
            if($result===false){
                echo json_encode([
                    "success" => false,
                    "error" => "Failed to save course content"
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
