<?php
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
    header("Content-Type: application/json");

    include "connection.php";

    if(!isset($_GET['id'])) {
        echo json_encode(["error" => "Listing ID is missing"]);
        exit;
    }

    $listingId = intval($_GET['id']);

    if($conn) {

        $query = "
            SELECT *
            FROM listing
            WHERE listing_id = ?
        ";

        $params = array($listingId);
        $result = sqlsrv_query($conn, $query, $params);

        if($result === false) {
            echo json_encode(["error" => "Failed to load listing"]);
        }
        else {
            $row = sqlsrv_fetch_array($result, SQLSRV_FETCH_ASSOC);

            if ($row) {
                echo json_encode($row);
            } else {
                echo json_encode(["error" => "Listing not found"]);
            }
        }

        sqlsrv_close($conn);

    }
    else {
        sqlsrv_close($conn);
        echo json_encode(["error" => "Connection unsuccessful"]);
        die(print_r(sqlsrv_errors(), true));
    }
?>
