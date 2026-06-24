<?php
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
    header("Content-Type: application/json");

    include "connection.php";

    if ($conn) {

        $data = json_decode(file_get_contents("php://input"), true);

        if (!isset($data["print_id"])) {
            echo json_encode([
                "success" => false,
                "error" => "Print ID is missing"
            ]);
            sqlsrv_close($conn);
            exit;
        }

        $printId = intval($data['print_id']);

        if ($printId <= 0) {
            echo json_encode([
                "success" => false,
                "error" => "Invalid print ID"
            ]);
            sqlsrv_close($conn);
            exit;
        }

        $query = "
            DELETE FROM prints
            WHERE print_id = ?
        ";

        $params = array($printId);
        $result = sqlsrv_query($conn, $query, $params);

        if ($result === false) {
            echo json_encode([
                "success" => false,
                "error" => "Failed to delete print"
            ]);
            sqlsrv_close($conn);
            exit;
        }
        else {
            sqlsrv_close($conn);
            echo json_encode([
                "success" => true
            ]);
        }

    }
    else {
        echo json_encode([
            "success" => false,
            "error" => "Database connection failed"
        ]);
        exit;
    }
?>
