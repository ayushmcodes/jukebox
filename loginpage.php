<?php
error_reporting(E_ERROR | E_PARSE);
$con=mysqli_connect('localhost','root','');

if(!$con)
{
    die();
}
else
{
    /*echo "Connection made";*/
}

if(isset($_POST['username_']) && isset($_POST['emailid_']) && isset($_POST['password_']))
{
    $username=$_POST['username_'];
    $emailid=$_POST['emailid_'];
    $password=$_POST['password_'];

    
    $sql="INSERT INTO `accounts`.`accounts` (`id`,`username`, `email`, `password`) VALUES (NULL,'$username', '$emailid', '$password');";

    if($con->query($sql)==true)
    {
        /*echo "Account Created";
        echo $sql;*/
        echo 1; /*account created*/
    }
    else
    {
        /*echo "Account Creation Failed";
        echo $con->error;*/   
    }
}
else if(isset($_POST['username_']) && isset($_POST['password_']))
{
    $username=$_POST['username_'];
    $password=$_POST['password_'];
    

    $selec=mysqli_select_db($con,'accounts');
    $res=$con->query("SELECT * FROM `accounts` WHERE `username` LIKE '$username'");
    if(!($res))
    echo -2; /*no such username*/
    else
    {
        $row=$res->fetch_array();
        if($row[3]==$password)
        {
            echo 0; /*login in*/
        }
        else
        {
            echo -1; /*wrong password*/
        }
    }
}
else if(isset($_POST['username_'])) 
{
    $con=mysqli_connect('localhost','root','');
    $username=$_POST['username_'];
    $res=$con->query("SELECT * FROM `accounts` WHERE id = '".$username."'");
    $row=$res->fetch_array();
    $id=$row[0];
    echo "<script>console.log('Debug Objects: " . $id . "' );</script>";
    $sql="DELETE FROM `accounts` WHERE `accounts`.`id` = '$id';";
    if($con->query($sql))
    {
        echo 999;/*Account Deleted*/
    }
    else
    {
        echo 999;/*Account Deletion Fail*/
    }
}
?>