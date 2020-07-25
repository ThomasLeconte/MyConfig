<?php

require(__DIR__.'/models/MyConfigDAO.php');
$cnx = new MyConfigDAO();

header('Content-Type: application/json');

$verifToken = false;
if(isset($_GET["token"]) && $_GET["token"] != ""){
    $cpt = $cnx->checkToken($_GET["token"]);
    if($cpt == 1){
        $verifToken = true;
    }else{
        $verifToken = false;
    }
}else{
    $verifToken = false;
}

if($verifToken){
    if(isset($_GET["username"]) && $_GET["username"] != "" && isset($_GET["password"]) && $_GET["password"] != ""){
        $verifLogin = false;
        $cptLogin = $cnx->checkLogin($_GET["username"], $_GET["password"]);
        $tab = array('connexion'=>false);
        if($cptLogin==1){
            $tab = array('connected'=>true);
            echo json_encode($tab);
        }else{
            echo json_encode($tab);
        }
    }
    
    /*========================*/
    /*=======MyCANTINE========*/
    /*========================*/
    if(isset($_GET["date"]) && $_GET["date"] != ""){
        //Id du repas
        $id = $cnx->getIdRepas($_GET["date"]);
        //ENTREE
        $entrees = $cnx->getLesEntrees($_GET["date"]);
        //echo json_encode($entrees);

        //PLAT
        $resistances = $cnx->getLesResistances($_GET["date"]);
        //echo json_encode($resistances);

        //ACCOMPAGNEMENT
        $accompagnements = $cnx->getLesAccompagnements($_GET["date"]);
        //echo json_encode($accompagnements);
        
        //LAITAGES
        $laitages = $cnx->getLesLaitages($_GET["date"]);
        //echo json_encode($laitages);

        //DESSERT
        $desserts = $cnx->getLesDesserts($_GET["date"]);
        //echo json_encode($desserts);

        $plat = array("idRepas"=>$id,
                      "entrees"=>$entrees,
                      "resistances"=>$resistances,
                      "accompagnements"=>$accompagnements,
                      "laitages"=>$laitages,
                      "desserts"=>$desserts);
        echo json_encode($plat);
    }
}



?>