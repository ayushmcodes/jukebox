<?php
$server='localhost';
$username='root';
$password='';
    $con=mysqli_connect($server,$username,$password);
    $selec=mysqli_select_db($con,'music');
    if(!($con && $selec))
    {
        /*echo "Failed";*/
        die();
    }
    else
    {
        /*echo "Connection to database succeded";*/
    }

    if(isset($_POST['songId']))
    {
        $songId=$_POST["songId"];
        $res=$con->query("select * from music where `id`=$songId");
        $row=$res->fetch_array();
        if($res)
        {
            echo json_encode($row);
        }
        else
        echo "Row Selection Failed";
    }
?>