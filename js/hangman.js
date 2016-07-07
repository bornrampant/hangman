//doc ready
$(document).ready(function){
//confirm age
var confirmAge = confirm("18 and over only...");

//global variable
var wordlist = [],
    maxLives = 5,
    targetWord = '',
    data = [],
    guesses = [];
//image
function setImage(number) {
    $('#hangman_img').removeAttr("class").addClass("image" + number);
}
//cannot go past -- asynd -- json -- cannot trust wordlist

function loadWordList() {
    var word = '';
    $.ajax({
        url: 'assets/wordlist.json',
        async: false
    }).done(function(data) {
        for (word in data) {
            wordlist.push(data[word]);
        }
    }, 'json');
   console.log(data)
}
//new random word for global
function newWord() {
    targetWord = wordlist[Math.floor(Math.random() * wordlist.length)];
}

function renderWord() {
    var rdWord = '';

    for (var i = 0; i < targetWord.length; i++) {
        if (guesses.indexOf(targetWord[i].toLowerCase(), 0) == -1) {
            rdWord += '_';
        } else {
            rdWord += targetWord[i];
        }
    }   
    return rdWord;
}
//draw word: set value 
function drawWord() {
    while (targetWord == '') {
        newWord();
    }
    $('#targetWord').html(obfuscateWord());
}
// draw guess: sort do not allow previous
function drawGuesses() {
    guesses.sort();
    $('#previousGuesses').html(guesses.join(', '));
}
///clear guess
function cleanGuess() {
    var uniqueGuesses = [];
    $.each(guesses, function(index, element) {
        if (element.length > 0 && $.inArray(element, uniqueGuesses) == -1) {
            uniqueGuesses.push(element);
        }
    });
    guesses = uniqueGuesses;
}
//add guess 
function addGuess() {
    if (/^[a-zA-Z]*$/.test($('#guess').val()) && typeof $('#guess').val() !== "undefined") {
        guesses.push($('#guess').val().toLowerCase());
    }

    $('#guess').val('');
}
//Win or Lose?
function endGame(isWinner) {
    if (isWinner) {
        $('#endGameTitle').html('WINNER! You Rock... Man');
        $('#endGameContent').html('Your guess was ' + targetWord + ' in ' + guesses.length + ' attempts');
    } else {
        $('#endGameTitle').html('***LOSER***');
        $('#endGameContent').html('Bummer.  The word was ' + targetWord);
    }

    $('#endGameDialog').modal('toggle');
}
//lives left
function reviewLives() {
    var livesRemaining = maxLives,
            string = targetWord.toLowerCase();

    for (var i = 0; i < guesses.length; i++) {
        if (string.indexOf(guesses[i], 0) == -1) {
            livesRemaining--;
        }
    }

    if (livesRemaining <= 0) {
        setImage(0);
        endGameDialog(false);
        return;
    }

    setImage(maxLives - livesRemaining);
}

function checkIfWon() {
    if (obfuscateWord() == targetWord) {
        endGameDialog(true);
    }
}

// function resetGame() {
//     setImage(0);
//     targetWord = '';
//     guesses = [];
//     newWord();
// }

//update
function update() {
    addGuess();
    cleanGuess();
    drawWord();
    drawGuesses();
    reviewLives();
    checkIfWon();
}

$(document).ready(function() {
    loadWordList();
    drawWord();
    drawGuesses();
    $('#guess').attr('onkeyup', 'update();');
});
});