<?php

include(__DIR__."/MySQL.php");
class MyConfigDAO extends MySQL{

    public function __construct(){
        parent::__construct();
    }

    /*=================================*/
    /*===========UTILISATEUR===========*/
    /*=================================*/
    public function checkLogin($username, $password){
        $cpt = 0;
        $reponse = $this->bdd->query("SELECT COUNT(user_id) FROM user WHERE user_name = '". $username."' AND user_password = '". $password ."'");
        $cpt = $reponse->fetch();
        return intval($cpt["COUNT(user_id)"]);
    }
}

?>
