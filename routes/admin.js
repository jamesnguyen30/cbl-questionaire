var express = require('express');
var router = express.Router();
var question = require("../models/question.js")
var response = require('../models/response.js')
var record = require('../models/record.js')


/* GET users listing. */
router.get('/login', function(req, res, next) {
  res.render('login-page', {});
});

router.get('/',(req,res,next)=>{
  question.selectAll((err,data)=>{
    var questionArray = []

    data.forEach(element => {
      console.log(element)
      questionArray.push({id: element.id, question: element.question, question_type: element.question_type})
    });
    console.log(questionArray)
    res.render("admin-questions", {data: questionArray})
  })
})

router.get('/newQuestion', (req,res,next)=>{
  res.render('new-question', {title: "Add new question", data: null})
})

router.get('/question/:questionId', (req,res,next)=>{
  question.select(req.params.questionId, (err,questionResult)=>{
    if(err){
      console.log("Error :", err)
      res.redirect("/admin/")
    }
    else{
      response.selectWithQuestionId(questionResult.id, (err,responseResult)=>{
        if(err){
          console.log("Error retrieving responses: ", err)
          res.redirect("/admin/")
        } else {
          console.log(responseResult)
          res.render('new-question', 
          {title: "Modify question", 
          question_id: questionResult.id, question: questionResult.question, responseArray: responseResult})
        }
      })
    }
  }) 
})

router.get("/summary", (req,res,next)=>{
  var now = new Date()
  //var now = new Date("04-01-2020")
  var currentMonth = now.getMonth()+1
  var month = now.toLocaleString('default', {month: 'long'})

  var currentYear = now.getFullYear()
  record.countResponsesByMonth(currentMonth,currentYear,(err,data)=>{
    if(err){
      console.log("error :", err)
      res.send("Error! Check log for detail")
    } else {
      var count = []
      var date = []
      data.forEach((record)=>{
        count.push(record.total) 
        date.push(record.date.getTime()) 
      })

      res.render("admin-summary", 
      { 
        label: month + " " + currentYear + " Monthly Responses",
        count:JSON.stringify(count), 
        date: JSON.stringify(date)})
    }
  })

})

router.post('/delete/:questionId', (req,res,next)=>{
  console.log('here')
  question.delete(req.params.questionId, (err, result)=>{
    if(err){
      console.log('error :', err)
      res.send('Error deleting')
    } else {
      //delete the question
      res.redirect("/admin")
    }
  })
})

router.post('/newQuestion', async (req,res,next)=>{
  console.log(req.body)

  var newQuestion = {
    question: req.body.question,
    //question_type: req.body.question_type
    question_type: req.body.question_type 
  }

  question.insert(newQuestion, (err,data)=>{
    if(err){
      console.log('error :', err)
    } else {
      
      var questionId = data.id
      var group_order = 0

      if(req.body.responseArray!=''){
        var responseArray = req.body.responseArray.split(",")

        responseArray.forEach(element=>{
          element = element.trim()

          if(element==""){
            return;
          }

          var newResponse = {
            response: element,
            question_id: questionId,
            group_order: group_order
          }

          group_order+=1

          response.insert(newResponse, (err,data)=>{
            if(err){
              console.log('error :', err)
              return;
            } else {
              console.log('Response insertion successful!')
            }
          })
        })
      }
      else {
        for(key in req.body){
          if(key.startsWith("response")){
            if(req.body[key]=="") 
              continue
            var newResponse = {
              response: req.body[key],
              question_id: questionId,
              group_order: group_order
            }

            group_order+=1

            response.insert(newResponse, (err,data)=>{
              if(err){
                console.log('error :', err)
                return;
              } else {
                console.log('Response insertion successful!')
              }
            })
          }
        }
      }

      res.redirect("/admin")
    }
  })
})

router.post('/authorize', function(req,res,next){
  console.log(req.body)
  var username = req.body.username
  var password = req.body.password

  if(username == "admin" && password == "admin"){
    //authorzied
    res.redirect("/admin/")
  } else {
    res.redirect("/admin/login")
  }
})


module.exports = router;
