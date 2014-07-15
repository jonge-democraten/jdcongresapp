Een voorbeeld van een serverscript om de exports te verwerken

< ?php
    if ($_SERVER['REQUEST_METHOD'] == "POST") {
        
        $dataSent =  json_decode($_POST['data'], TRUE);
        
        $handle = new SQLite3('usercontent');
        
        $sql = $handle->prepare("INSERT INTO exports (ciphertext, iv, salt) VALUES (:ciphertext, :iv, :salt)");
        $sql->bindValue(':ciphertext', $dataSent['ciphertext']);
        $sql->bindValue(':iv', $dataSent['iv']);
        $sql->bindValue(':salt', $dataSent['salt']);
        
        $sql->execute();
        
        print $dataSent['iv'];
    }
    
    if ($_SERVER['REQUEST_METHOD'] == "GET") {
        $iv = $_GET['iv'];
        
        $handle = new SQLite3('usercontent');
        
        $sql = $handle->prepare("SELECT * FROM exports WHERE iv = :iv");
        $sql->bindValue(':iv', $iv);
        
        $result = $sql->execute();
        if ($row = $result->fetchArray(SQLITE3_ASSOC)) {
            print json_encode($row);
        }
    }
?>
