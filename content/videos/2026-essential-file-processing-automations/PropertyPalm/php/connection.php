<?php
	// Replace this with your own server/DB connection details
    $serverName = "localhost";

    $connectionInfo = array("Database"=>"workflowsDemo");
    $conn = sqlsrv_connect($serverName, $connectionInfo);

	if ($conn === false) {
		echo "Connection could not be established. \n";
		die(print_r(sqlsrv_errors(), true));
	}
?>
