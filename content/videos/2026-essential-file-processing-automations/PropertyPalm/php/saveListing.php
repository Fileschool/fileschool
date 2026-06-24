<?php
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
    header("Content-Type: application/json");
    
    include "connection.php";
    if($conn){

        $data = json_decode(file_get_contents('php://input'), true);
        if(isset($data["name"], $data["address"], $data["type"])) {
            $name = trim($data["name"]);
            $address = trim($data["address"]);
            $type = trim($data["type"]);

            if($name==="" || $address==="" || $type===""){
                echo json_encode([
                    "success" => false,
                    "error" => "All details are required."
                ]);
                sqlsrv_close($conn);
                exit;
            }

            $query = "
                INSERT INTO listing (listing_name, address, property_type, created_at)
                OUTPUT INSERTED.listing_id
                VALUES (?, ?, ?, GETDATE())
            ";
            $params = array($name, $address, $type);
            $result = sqlsrv_query($conn, $query, $params);
            if($result===false){
                echo json_encode([
                    "success" => false,
                    "error" => "Failed to save listing"
                ]);
                sqlsrv_close($conn);
                exit;
            }
            else{
                $row = sqlsrv_fetch_array($result, SQLSRV_FETCH_ASSOC);
                sqlsrv_close($conn);
                echo json_encode([
                    "success" => true,
                    "listing_id" => $row["listing_id"]
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
