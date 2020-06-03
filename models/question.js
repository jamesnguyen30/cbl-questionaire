const sql = require('../db/db.js')

const Question = function(newQuestion){
    this.question = newQuestion.question
    this.questiontype = newQuestion.questiontype
}

// Question.ifTableExists = (result)=>{
    // var isExists = false
    // sql.query("show tables like 'questions';", (err,res)=>{
        // if(err){
            // console.log('error :', err)
            // result(err,null)
            // isExists = false
        // } else {
            // console.log(res)
            // console.log(res.length)
            // if(res.length==0){
                // isExists = false
                // //table doesnt exist
            // } else {
                // console.log("here")
                // isExists = true
                // //table exists
            // }
        // }
    // })
    // return isExists
// }

Question.createTable = (result)=>{
    sql.query("create table questions\
    ( id int not null auto_increment,\
        question varchar(200) not null,\
        question_type smallint not null,\
        primary key(id)\
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

Question.insert = (newQuestion, result)=>{
    sql.query("insert into questions set question=?, question_type=? ", [newQuestion.question, newQuestion.question_type],
    (err, res)=>{
        if(err){
            console.log("error : ", err)
            result(err,null);
            return;
        } else {
            result(null, {id: res.insertId, ...newQuestion})
            return;
        }
    })
}

Question.select = (id, result)=>{
    sql.query("select * from questions where id=?", [id], (err, res)=>{
        if(err){
            console.log("error: ", err)
            result(err,null)
            return;
        } else {
            result(null, res[0])
            return;
        }
    })
}

Question.selectAll = (result)=>{
    sql.query("select * from questions", (err,res)=>{
        if(err){
            console.log("error :", err)
            result(err, null)
            return;
        } else {
            result(null, res)
            return;
        }
    })
}

Question.update = (id, updateData, result)=>{
    
    sql.query("update questions set ? where id=?", [updateData, id], (err,res)=>{
        if(err){
            console.log("error :", err)
            result(err, null)
            return;
        } else {
            result(null, res)
            return;
        }
    })
}

Question.delete = (questionId, result)=>{
    sql.query('delete from questions where id=?', [questionId], (err,res)=>{
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

Question.drop=()=>{
    sql.query('drop table questions;', (err,result)=>{
        if(err){
            console.log("error :", err)
            result(err, null)
            return;
        } else {
            result(null, {message: "Dropped table questions"})
            return;
        }
    })
}

module.exports = Question
