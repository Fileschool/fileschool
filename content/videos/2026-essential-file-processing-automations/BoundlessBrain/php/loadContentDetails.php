<?php
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
    header("Content-Type: application/json");

    include "connection.php";

    if(!isset($_GET['courseId']) || !isset($_GET['contentId'])) {
        echo json_encode(["error" => "Missing either course ID or content ID"]);
        exit;
    }

    $courseId = intval($_GET['courseId']);
    $contentId = intval($_GET['contentId']);

    if($conn) {

        $query = "
            SELECT
                b.course_title,
                content_title,
                content_description,
                file_handle,
                a.created_at
            FROM content a
            JOIN course b ON a.course_id = b.course_id
            WHERE a.course_id = ?
            AND content_id = ?
        ";

        $params = array($courseId, $contentId);
        $result = sqlsrv_query($conn, $query, $params);

        if($result === false) {
            echo json_encode(["error" => "Failed to load course content"]);
        }
        else {
            $row = sqlsrv_fetch_array($result, SQLSRV_FETCH_ASSOC);

            if($row) {
                echo json_encode($row);
            }
            else {
                echo json_encode(["error" => "Course content not found"]);
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
