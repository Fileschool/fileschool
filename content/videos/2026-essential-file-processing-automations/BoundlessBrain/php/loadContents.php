<?php
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
    header("Content-Type: application/json");

    include "connection.php";

    if(!isset($_GET['course_id'])) {
        echo json_encode(["error" => "Course ID is missing"]);
        exit;
    }

    $courseId = intval($_GET['course_id']);

    if($conn) {

        $query = "
            SELECT *
            FROM content
            WHERE course_id = ?
        ";

        $params = array($courseId);
        $result = sqlsrv_query($conn, $query, $params);

        if($result === false) {
            echo json_encode(["error" => "Failed to load course"]);
        }
        else {
            $data = [];
            while ($row = sqlsrv_fetch_array($result, SQLSRV_FETCH_ASSOC)) {
                if ($row['created_at'] instanceof DateTime) {
                    $row['created_at'] = $row['created_at']->format('Y-m-d H:i:s');
                }
                $data[] = $row;
            }
            echo json_encode($data);
        }
        sqlsrv_close($conn);
    }
    else {
        sqlsrv_close($conn);
        echo json_encode(["error" => "Connection unsuccessful"]);
        die(print_r(sqlsrv_errors(), true));
    }
?>
