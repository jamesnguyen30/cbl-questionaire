const sql = require('../db/db.js')

const Response = function(newResponse){
    this.response = newResponse.response
}

Response.createTable = (result)=>{
    sql.query("create table responses(\
        id int not null auto_increment,\
        question_id int not null,\
        response varchar(100),\
        group_order smallint,\
        primary key(id),\
        foreign key (question_id) references questions(id) on delete cascade)", (err, res)=>{
            if(err){
                console.log('error :', err)
                result(err,null);
                return;
            } else {
                console.log("Success")
            }
       })
}

Response.insert = (newResponse, result)=>{
    sql.query("insert into responses set ?", 
    newResponse,
    (err,res)=>{
        if(err){
            console.log("error :", err)
            result(err,null)
            return;
        } else {
            result(null, {id: res.insertId, ...newResponse})
        }
    })
}

Response.select = (id, result)=>{
    sql.query("select * from responses where id=?", [id], (err, res)=>{
        if(err){
            console.log("error: ", err)
            result(err,null)
        } else {
            result(null, res)
        }
    })
}

Response.selectWithQuestionId = (questionId, result)=>{
    sql.query("select * from responses where question_id=? order by group_order",[questionId], (err, res)=>{
        if(err){
            console.log("error: ", err)
            result(err,null)
        } else {
            result(null, res)
        }
    })
}

Response.selectAll = (result)=>{
    sql.query("select * from responses", (err,res)=>{
        if(err){
            console.log("error :", err)
            result(err, null)
        } else {
            result(null, res)
        }
    })
}

Response.deleteByQuestionId = (questionId, result)=>{
    sql.query("delete from responses where question_id=?",[questionId], (err,res)=>{
        if(err){
            console.log("error :", err)
            result(err, null)
            return;
        } else {
            result(null, {message: "Delete success"})
            return;
        }
    })
}

Response.drop=(result)=>{
    sql.query('drop table responses;', (err,res)=>{
        if(err){
            console.log("error :", err)
            result(err, null)
            return;
        } else {
            result(null, {message: "Dropped table responses"})
            return;
        }
    })
}

module.exports = Response