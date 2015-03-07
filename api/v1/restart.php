<?php
	// Include confi.php
	if($_SERVER['REQUEST_METHOD']=="GET") {
	include_once('confi.php');
	
	include_once('../../index.php');
	
	$json = array("status" => 0, "msg" => "User ID not define");
	
	@mysql_close($conn);
	onloadHandler();
	start();
    }
	
	/* Output header */
	header('Content-type: application/json');
	echo json_encode($json);