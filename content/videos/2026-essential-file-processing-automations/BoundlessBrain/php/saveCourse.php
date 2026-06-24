<?php
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
    header("Content-Type: application/json");
    
    include "connection.php";
    if($conn){

        $data = json_decode(file_get_contents('php://input'), true);
        if(isset($data["title"], $data["description"])) {
            $title = trim($data["title"]);
            $description = trim($data["description"]);

            if($title==="" || $description===""){
                echo json_encode([
                    "success" => false,
                    "error" => "Course details are required."
                ]);
                sqlsrv_close($conn);
                exit;
            }

            $query = "
                INSERT INTO course (course_title, course_description, created_at)
                OUTPUT INSERTED.course_id
                VALUES (?, ?, GETDATE())
            ";
            $params = array($title, $description);
            $result = sqlsrv_query($conn, $query, $params);
            if($result===false){
                echo json_encode([
                    "success" => false,
                    "error" => "Failed to save course"
                ]);
                sqlsrv_close($conn);
                exit;
            }
            else{
                $row = sqlsrv_fetch_array($result, SQLSRV_FETCH_ASSOC);
                sqlsrv_close($conn);
                echo json_encode([
                    "success" => true,
                    "course_id" => $row["course_id"]
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
