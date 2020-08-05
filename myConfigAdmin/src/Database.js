const mysql = require('mysql');
const { app, BrowserWindow, ipcRenderer, dialog } = require('electron');

class Database{

    constructor(){
        this.bd = mysql.createConnection({
            host: "localhost",
            user: "root",
            password: "",
            database: "myconfig"
        });
    }

    insertIntoDatabase(products, productsType){
        this.bd.connect(function(err) {  
            if (err){
                throw err; 
            }else{
                console.log("Connected!");
            }
        });

        for(const product of products){
            var infos = '{"title": "'+product.name+'","link":"'+product.link+'","img":"'+product.image+'"}';
            var sql = "INSERT INTO api_component (comp_id, comp_info, comp_desc, comp_price, comp_type) VALUES (NULL, '"+infos+"', '"+product.desc+"', '"+product.price+"', "+productsType+")";
            this.bd.query(sql, function (err, result) {  
            if (err) throw err;  
            console.log("1 record inserted");  
            });
        }
        this.bd.end();
    }
}

module.exports = Database