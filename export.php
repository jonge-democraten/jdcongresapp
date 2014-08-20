<?php
    require('dbconfig.php');
    $dbc = new mysqli($db['host'], $db['user'], $db['pass'], $db['name']);
    
    if ($_SERVER['REQUEST_METHOD'] == "POST") {
        
        $dataSent = json_decode($_POST['data'], TRUE);

        // Do not accept very large ciphertexts
        if (strlen($dataSent['ciphertext']) > 1000000) {
            die();
        }

        $ip = $_SERVER['REMOTE_ADDR'];

        // Count the number of currently stored exports for this IP
        $sql1 = $dbc->prepare("SELECT 1 FROM exports WHERE ipaddress = ?");
        $sql1->bind_param('s', $ip);
        $sql1->execute();
        $sql1->bind_result($dummy);
        $counter = 0;
        while ($sql1->fetch()) {
            $counter++;
        }
        $counter = max($counter - 3, 0);

        // Delete all but the most recent three exports for this IP
        $sql2 = $dbc->prepare("DELETE FROM exports WHERE ipaddress = ? ORDER BY timestamp LIMIT ?");
        $sql2->bind_param('si', $ip, $counter);
        $sql2->execute();

        // Count the total number of exports
        $sql3 = $dbc->prepare("SELECT 1 FROM exports");
        $sql3->execute();
        $sql3->bind_result($dummy);
        $counter = 0;
        while ($sql3->fetch()) {
            $counter++;
        }
        $counter = max($counter - 100, 0);
        
        // Delete all but the most recent 100 exports
        $sql4 = $dbc->prepare("DELETE FROM exports ORDER BY timestamp LIMIT ?");
        $sql4->bind_param('i', $counter);
        $sql4->execute();
        
        $stmt = $dbc->prepare("INSERT INTO exports (ciphertext, iv, salt, ipaddress) VALUES (?, ?, ?, ?)");
        $stmt->bind_param('ssss', $dataSent['ciphertext'], $dataSent['iv'], $dataSent['salt'], $_SERVER['REMOTE_ADDR']);
        $stmt->execute();
        
        print $dataSent['iv'];
    
    }
    
    if ($_SERVER['REQUEST_METHOD'] == "GET") {
        $iv = $_GET['iv'];
        
        $stmt = $dbc->prepare("SELECT * FROM exports WHERE iv = ?");
        $stmt->bind_param('s', $iv); 
        
        $stmt->execute();
        $stmt->bind_result($iv, $ipaddress, $timestamp, $salt, $ciphertext);
        $stmt->fetch();

        $row['iv'] = $iv;
        $row['salt'] = $salt;
        $row['ciphertext'] = $ciphertext;

        print json_encode($row);
        
    }

    $dbc->close();
?>
