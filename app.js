const express = require('express');
const app = express();
const bodyParser = require('body-parser');
let expressValidator = require('express-validator');
const mustacheExpress = require('mustache-express');
const session = require('express-session');


app.engine('mustache', mustacheExpress());
app.set('views', './views');
app.set('view engine', 'mustache');
app.use(bodyParser.urlencoded({
  extended: false
}))
app.use(expressValidator({
  customValidators: {
    notDuplicate: function(currentGuess, alreadyGuessed) {
      return !alreadyGuessed.includes(currentGuess);
    }
  }
}));

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}))



let content = {
  charOptions: [{
      name: 'sql',
    },
    {
      name: 'mongoose',
    },
    {
      name: 'javascropt',
    },
    {
      name: 'react',
    },
    {
      name: 'functions',
    },
    {
      name: 'arrays',
    },
    {
      name: 'code',
    }
  ]
}

let roundDetails = {
  activeGame: true,
  word: 'Developer',
  letters: [],
  guessedLetters: [],
  numberOfGuesses: 8,
  correctGuess: true
}

// store the word in a session
// req.session.roundDetails = roundDetails;


app.get('/', function(req, res) {
  // generate random word
  let round = content.charOptions[Math.floor(Math.random() * content.charOptions.length)].name;
  roundDetails.word = round.toUpperCase();
  console.log('roundDetails.word', roundDetails.word);
  let word = roundDetails.word;
  let letters = roundDetails.letters;
  createLettersArray(word, letters);
  console.log('letters', letters);
  res.render('game', {
    roundDetails: roundDetails
  });
  console.log('the word this round is ' + round);
})

function createLettersArray(word, letters) {
  letters = word.split('').forEach((letter) => {
    letters.push({
      letter: letter,
      guessed: false
    })
  })
  console.log(letters);
  return letters;
}

app.post('/handler', function(req, res) {
  // letter can be uppercase or lowercase
  let guess = req.body.guess.toUpperCase();
  console.log('guess is ', guess);
  // if a user enters more than one letter generate invalid error message
  req.checkBody('guess', 'please enter one letter at a time').isByteLength({
    min: 1,
    max: 1
  });
  req.checkBody('guess', 'please enter letters only').isAlpha();
  req.checkBody('guess', 'please enter a letter').notEmpty();
  // display a message letting them know they already guessed that letter and ask them to try again
  console.log('guessedLetters', roundDetails.guessedLetters);

  req.checkBody('guess', 'you already guessed that letter').notDuplicate(roundDetails.guessedLetters);
  // form should be validated to make sure only one letter is sent
  let errors = req.validationErrors();
  // user is allowed 8 guesses
  if (errors) {
    // display error message on page
    res.render('game', {
      roundDetails: roundDetails,
      errors: errors
    });
  } else {
    // for loop to compare guess to letters array
    console.log(roundDetails.letters[1].letter);
    if (!roundDetails.guessedLetters.includes(guess)) {
      roundDetails.guessedLetters.push(guess);
    }
    roundDetails.correctGuess = false;
    for (var i = 0; i < roundDetails.letters.length; i++) {
      if (roundDetails.letters[i].letter === guess) {

        roundDetails.letters[i].guessed = true;
        roundDetails.correctGuess = true;
        console.log('what is happening', roundDetails.letters);
      }
    }

    if (roundDetails.correctGuess === false) {
      roundDetails.numberOfGuesses -= 1;
    }



    console.log('what are the roundDetails', roundDetails);
    roundDetails.activeGame = false;
    for (let i = 0; i < roundDetails.word.length; i++) {
      if (!roundDetails.guessedLetters.includes(roundDetails.word.charAt(i))) {
        roundDetails.activeGame = true;
      }
    }

    if (roundDetails.activeGame) {

      res.render('game', {
        roundDetails: roundDetails
      });
    } else {
      res.render('game', {
        roundDetails: roundDetails,
        win: 'You win!'
      });


    }

  }

})

function areAllFalse(element, index, array) {
  return element = false;
}


app.listen(3000, function() {
  console.log('you did it, or something');
})
