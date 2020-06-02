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
        recorded_date datetime,\
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
    sql.query("insert into records set user_id =?, ?",[userId, newRecord],
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

Record.selectLimit=(start, step, result)=>{
    sql.query("select * from records limit ?,?",
    [start * step, step],
     (err,res)=>{
        if(err){
            console.log("error :", err)
            result(err, null)
        } else {
            result(null, res)
        }
    })
}

Record.countResponsesByMonth=(month,year, result)=>{
    sql.query("select count(user_id) as total, recorded_date as date from records\
    where month(recorded_date)=? and year(recorded_date)=?\
    group by day(recorded_date), recorded_date order by recorded_date;", [month,year],(err,res)=>{
        if(err){
            console.log("error :", err)
            result(err,null)
        } else {
            result(null, res)

        }
    })
}

module.exports = Record


