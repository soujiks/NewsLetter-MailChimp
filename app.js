//jshint esversion: 6

const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const https = require('https');

const app = express();
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

app.get('/', function (req, res) {
  res.sendFile(__dirname + "/signup.html");
})

app.post('/', function (req, res) {
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;
  const data = {
    members: [{
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName
      }
    }]
  }

  const jsonData = JSON.stringify(data);
  const url = "https://us20.api.mailchimp.com/3.0/lists/eaf5183db3";
  const option = {
    method: "POST",
    auth: "soujanya1:565ac9653366e78923007b3c4a00c29b-us20"
  }

  const request = https.request(url, option, function (response) {
  
  response.on("data", function (data) {
      var jsonParsed = JSON.parse(data);
      if(jsonParsed.error_count!=1){
        res.sendFile(__dirname+"/success.html");
      }else{
        res.sendFile(__dirname+"/failure.html");
      }
      
      console.log(jsonParsed.error_count);
      console.log(JSON.parse(data));
    })
  })
  request.write(jsonData);
  request.end();
  //console.log(firstName, lastName, email);
})

 app.post("/failure",function(req,res){
   res.redirect("/");
 })
app.listen(3000, function (req, res) {
  console.log('Example app listening at 3000');
})

//565ac9653366e78923007b3c4a00c29b-us20
// eaf5183db3