const sql = require('../db/db.js')

const Record = function(newRecord){
    this.questionId = newRecord.questionId 
    this.responseId = newRecord.responseId 
}

Record.createTable = (result)=>{
    sql.query("create table records(\
        id int not null auto_increment,\
        user_id int not null,\
        question_id int not null,\
        response_id int not null,\
        primary key(id),\
        foreign key (question_id) references questions(id),\
        foreign key (response_id) references responses(id)\
        )", (err, res)=>{
            if(err){
                console.log('error :', err)
                result(err,null);
                return;
            } else {
                console.log("Success")
            }
       })
}

Record.insert = (newRecord, userId, result)=>{
    sql.query("insert into records set user_id =?, question_id=?, response_id=?",[userId, newRecord.question_id, newRecord.response_id],
     (err,res)=>{
        if(err){
            console.log("error :", err)
            result(err, null)
            return;
        } else {
            result(null, {id: res.insertId, ...newRecord})
        }
    })
}

module.exports = Record


