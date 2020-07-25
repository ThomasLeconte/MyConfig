<?php

require(__DIR__."/../config/env.php");

class MySQL{

    private $host;
    private $dbname;
    private $user;
    private $password;
    private $connected;
    protected $bdd;

    public function __construct(){
        $json = json_decode(file_get_contents(CHEMINBDDJSON), true);
        
        $this->host = $json["host"];
        $this->dbname = $json["dbname"];
        $this->user = $json["user"];
        $this->password = $json["password"];

        try
        {
          $this->bdd = new PDO('mysql:host='.$this->host.';dbname='.$this->dbname.';charset=utf8', $this->user, $this->password);
          $this->connected = true;
        }
        catch(Exception $e)
        {
          die('Erreur : '.$e->getMessage());
        }
    }

    public function getNom(){
      return $this->dbname;
    }

    public function getBDD(){
      return $this->bdd;
    }

    public function checkToken($token){
      $cpt = 0;
      $reponse = $this->bdd->query("SELECT COUNT(id) FROM api_token WHERE token = '". $token."'");
      $cpt = $reponse->fetch();
      return intval($cpt["COUNT(id)"]);
    }
}

?>