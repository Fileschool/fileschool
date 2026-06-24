<?php
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
    header("Content-Type: application/json");
    
    include "connection.php";
    if($conn){

        $data = json_decode(file_get_contents('php://input'), true);
        if(isset($data["print_name"], $data["quantity"], $data["file_handle"], $data["status"], $data["original_handle"])) {
            $printName = trim($data["print_name"]);
            $qty = trim($data["quantity"]);
            $fileHandle = trim($data["file_handle"]);
            $originalHandle = trim($data["original_handle"]);
            $status = trim($data["status"]);

            if($printName==="" || $qty<=0 || $fileHandle==="" || $status==="" || $originalHandle===""){
                echo json_encode([
                    "success" => false,
                    "error" => "All details are required."
                ]);
                sqlsrv_close($conn);
                exit;
            }

            $query = "
                INSERT INTO prints (print_name, quantity, status, file_handle, created_at, original_handle)
                VALUES (?, ?, ?, ?, GETDATE(), ?)
            ";
            $params = array($printName, $qty, $status, $fileHandle, $originalHandle);
            $result = sqlsrv_query($conn, $query, $params);
            if($result===false){
                echo json_encode([
                    "success" => false,
                    "error" => "Failed to save print"
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
