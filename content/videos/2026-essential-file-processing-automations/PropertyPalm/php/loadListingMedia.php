<?php
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
    header("Content-Type: application/json");

    include "connection.php";

    $listingId = $_GET['listing_id'] ?? null;
    if (!$listingId) {
        echo json_encode([]);
        exit;
    }

    if($conn) {

        $query = "
            SELECT file_handle, media_type
            FROM listing_media
            WHERE listing_id = ?
            ORDER BY created_at DESC
        ";

        $params = array($listingId);
        $result = sqlsrv_query($conn, $query, $params);

        if($result === false) {
            echo json_encode(["error" => "Failed to load listing media"]);
        }
        else {
            $media = [];

            while ($row = sqlsrv_fetch_array($result, SQLSRV_FETCH_ASSOC)) {
                $media[] = $row;
            }

            echo json_encode($media);
        }

        sqlsrv_close($conn);

    }
    else {
        sqlsrv_close($conn);
        echo json_encode(["error" => "Connection unsuccessful"]);
        die(print_r(sqlsrv_errors(), true));
    }
?>