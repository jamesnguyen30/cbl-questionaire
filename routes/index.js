var express = require('express');
var router = express.Router();
var question = require("../models/question.js")
var response = require('../models/response.js')
var record = require('../models/record.js')

var questionData = []

function generateRandomNumber(){
  return Math.round(Math.random() * 100000000) 
}

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
            res.send("There's an error occured while loading for responses, check log for detail")
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
    questionData = questionArray
    res.render("index", {questions: questionArray})
});

router.post("/responseSubmit", (req,res,next)=>{
  console.log("subsmission ", req.body)
  console.log("user_id ",generateRandomNumber())
  console.log("question data ", questionData)

  var randomUserId = generateRandomNumber()

  for(var key of Object.keys(req.body)){
    console.log(key + " : " + req.body[key])
    var questionIndex = parseInt(key.split("_")[1])
    var question = questionData[questionIndex]
    var questionId = question.id

    if(Array.isArray(req.body[key])){
      req.body[key].forEach(responseStringIndex =>{
        var responseIndex = parseInt(responseStringIndex.split("_")[1])
        var responseId = question.responses[responseIndex].id 
        console.log(responseId)
        var newRecord = {
          question_id: questionId,
          response_id: responseId
        } 

        record.insert(newRecord,randomUserId, (err,result)=>{
          if(err){
            console.log("error :", err)
            return;
          } else {
            console.log("Insert record successfully")
          }
        })
      })
    } else {
      var responseIndex = parseInt(req.body[key].split("_")[1])
      var responseId = question.responses[responseIndex].id 
      console.log(responseId)
      var newRecord = {
        question_id: questionId,
        response_id: responseId
      } 

      record.insert(newRecord,randomUserId, (err,result)=>{
        if(err){
          console.log("error :", err)
          return;
        } else {
          console.log("Insert record successfully")
        }
      })
    }
  }
  res.redirect('/')
})


module.exports = router;
