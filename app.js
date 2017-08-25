const express = require('express');
const mustacheexpress = require('mustache-express');
const bodyparser = require('body-parser');
const session = require('express-session');
const app = express();
const wordlist = require('./Data/words')
const word = wordlist[Math.floor(Math.random() * wordlist.length)]
let display =[]


// this is looking for mustache code in my views folder
app.engine('mustache', mustacheexpress());
app.set('views','./views');
app.set('view engine','mustache');
// must do for session
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}))
// app.use(expressValidator());
// this is going to the index.mustache page
app.get('/',function(req, res){
  for (var i = 0; i < word.length; i++) {
    display.push("_ ")
  }
  res.render('index',{object: display})
})
app.get('/newgame',function(req ,res) {

res.render('done',{done: display})
})

app.post('/letterguessed',function(req ,res) {

res.render('index',{object: display})
})


app.listen(3000,function(){
console.log("you did it")
})
