var mysql = require("mysql")

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

module.exports = connection

