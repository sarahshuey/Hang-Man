const express = require('express');
const mustacheexpress = require('mustache-express');
const bodyparser = require('body-parser');
const session = require('express-session');
const app = express();


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
// this is going to the index.mustache page
app.get('/',function(req,res){
  res.render('index')
})

app.listen(3000,function(){
console.log("you did it")
})
