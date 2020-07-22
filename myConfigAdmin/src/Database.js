const mysql = require('mysql');

class Database{

    constructor(_host, _user, _password, _database){
        this.bd = mysql.createConnection({
            host: _host,
            user: _user,
            password: _password,
            database: _database
        });
    }

    insertIntoDatabase(products){
        this.bd.connect(function(err) {  
            if (err){
                throw err; 
            }else{
                console.log("Connected!");
            }
            
        });

        for(const product of products){
            var sql = "INSERT INTO component (comp_id, comp_info, comp_desc, comp_price, comp_type) VALUES (NULL, 'Ajeet Kumar', '"+product.name+"', '"+product.price+"', 1)";
            console.log(sql); 
            this.bd.query(sql, function (err, result) {  
            if (err) throw err;  
            console.log("1 record inserted");  
            });
        }
    }
}

module.exports = Database