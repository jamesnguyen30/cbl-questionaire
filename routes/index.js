var express = require('express');
var router = express.Router();
var question = require("../models/question.js")
var response = require('../models/response.js')



router.get('/', async function(req, res, next) {

  var questions = []

  await new Promise(result=>{
   question.selectAll((err,data)=>{
    if(err){
      console.log("Error :", err)
      res.send("Error retrieving quesiton, check log")
      reject()
    }
    result(data)
    })
  }).then(async data=>{
    questions=  data
    console.log(questions)

  })
  
  var questionArray = []
  for(var i = 0;i<questions.length;i++){
    var element = questions[i]
    questionArray.push({
      id: element.id,
      question: element.question,
      question_type: element.question_type,
      responses: []
    })       

    await new Promise( (result)=>{
      response.selectWithQuestionId( element.id, (err,data)=>{
          if(err){
            console.log("error ", err)
          }
          var responses = []
          data.forEach(element=>{
            responses.push({id: element.id, response: element.response})
          })
          result(responses)
        })
      }).then(responses=>{
        questionArray[questionArray.length - 1].responses = responses
      })
    }
    console.log(questionArray)
    res.render("index", {questions: questionArray})
});

module.exports = router;
