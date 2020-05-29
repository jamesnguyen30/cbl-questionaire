var mysql = require("mysql")

var local = false

if(local){
    var connection = mysql.createConnection({
        host:"localhost",
        user:"covid19-app",
        password:'nguyen',
        database: 'db'
    })
    connection.connect(function(err){
        if(err) throw err;
        else {
            console.log('database connected')
        }
    });
} else {

    var connection = mysql.createPool({
        host:"us-cdbr-east-05.cleardb.net",
        user:"bcb1a09ba77303",
        password:'80ae0d85',
        database: 'heroku_98f530cc3e6a4fb',
        port: 3306
    })
}




module.exports = connection

