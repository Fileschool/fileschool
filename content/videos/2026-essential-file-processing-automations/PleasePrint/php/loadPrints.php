<?php
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
    header("Content-Type: application/json");
    
    include "connection.php";
    if($conn){
        $query = "
            SELECT
                print_id,
                print_name,
                original_handle
            FROM prints
            ORDER BY created_at DESC
        ";
        $result = sqlsrv_query($conn, $query);
        if($result===false){
            echo json_encode(["error" => "Failed to load prints"]);
        }
        else{
            while($row = sqlsrv_fetch_array($result, SQLSRV_FETCH_ASSOC)){
                $data[] = $row;
            }
            if(isset($data)){
                echo json_encode($data);
            }
            else{
                echo json_encode([]);
            }
        }
        sqlsrv_close($conn);
    }
    else{
        sqlsrv_close($conn);
        echo "Connection unsuccessful.";
        die(print_r(sqlsrv_errors(), true));
    }
?>
