window.onload = function() {

  var questionArea = document.getElementsByClassName('questions')[0];
  var imageArea = document.getElementsByClassName('image')[0];
  var explanationArea = document.getElementsByClassName('explanation')[0];
  var answerArea = document.getElementsByClassName('answers')[0];
  var checker = document.getElementsByClassName('checker')[0];
  var totalArea = document.getElementsByClassName('total')[0];
  var answerArray = new Array(Object.keys(questions).length);
  var current;

  //Cookies.remove('trivial');

  function getCurrentQuestion() {

    if (Cookies.get('trivial')) {
      var val = JSON.parse(Cookies.get('trivial'));
      current = val.curr;
      answerArray = val.arr;
    } else {
      current = 0;
      answerArray.fill(-1); // Initialize with -1
    }
  }

  /**
   *
   * This function loads all the question into the questionArea
   * It grabs the current question based on the 'current'-variable
   *
   */
  function loadQuestion(curr) {

    var question = questions[curr].question;
    var image = questions[curr].image;

    var total = Object.keys(questions).length;

    questionArea.innerHTML = '';
    questionArea.innerHTML = question;

    if (image != "") {
      imageArea.innerHTML = '';
      imageArea.innerHTML = '<img src="' + image + '" height="200" width="200" >';
    } else {
      imageArea.innerHTML = '';
    }

    totalArea.innerHTML = (curr + 1) + ' / ' + total;
  }

  /**
   *
   * This function loads all the possible answers of the given question
   * It grabs the needed answer-array with the help of the current-variable
   * Every answer is added with an 'onclick'-function
   *
   */
  function loadAnswers(curr) {

    var answers = questions[curr].choices;

    answerArea.innerHTML = '';

    for (var i = 0; i < answers.length; i += 1) {
      var createDiv = document.createElement('div'),
        text = document.createTextNode(answers[i]);

      createDiv.appendChild(text);
      createDiv.addEventListener("click", checkAnswer(i, answers));

      answerArea.appendChild(createDiv);
    }
  }

  /**
   *
   * This is the function that will run, when clicked on one of the answers
   * Check if givenAnswer is sams as the correct one
   * After this, check if it's the last question:
   * If it is: empty the answerArea and let them know it's done.
   *
   */
  function checkAnswer(i, arr) {

    if (current != 0) {
      playAudio('click');
    }

    return function() {

      var givenAnswer = i + 1;
      var correctAnswer = questions[current].correct;

      if (givenAnswer === correctAnswer) {
        answerArray[current] = 1;
      } else {
        answerArray[current] = 0;
      }

      if (current < Object.keys(questions).length - 1) {
        current += 1;

        var trivialCookie = '{ "curr" : ' + current + ', "arr" : [' + answerArray + '] }';

        //Set Cookie
        Cookies.set('trivial', trivialCookie);

        loadQuestion(current);
        loadAnswers(current);
        loadTotal(current);

      } else {

        questionArea.innerHTML = 'Final';
        explanationArea.innerHTML = '';
        imageArea.innerHTML = ''
        answerArea.innerHTML = '';

        loadTotal(current);

        finalSound();

        //Remove cookie
        Cookies.remove('trivial');

      }

    };
  }

  /**
   * show the explanation
   */
  function showExplanation() {

    var explanation = questions[current].explanation;


    console.log('before');
    setTimeout(function() {
      explanationArea.innerHTML = '';
      explanationArea.innerHTML = explanation;

    }, 600);
    explanationArea.innerHTML = '';
    console.log('after');
  }

  /**
   * This function adds a div element to the page
   * Used to see if it was correct or false
   */
  function addDefaultChecker(i) {

    var createDiv = document.createElement('div'),
      txt = document.createTextNode(i + 1);

    createDiv.setAttribute("id", "checker-" + (i + 1));
    createDiv.appendChild(txt);

    createDiv.className += 'empty';
    checker.appendChild(createDiv);

  }

  /**
   * update the checkers
   */
  function updateChecker(i, bool) {

    var checkerElement = document.getElementById("checker-" + (i + 1));

    if (bool == 1) {
      checkerElement.className = 'correct';
    } else if (bool == 0) {
      checkerElement.className = 'false';
    }
  }

  /**
   * Initialize checker with emtpy value
   */
  function initializeChecks() {
    var checkerElement = document.getElementById("checker-1");
    if (!checkerElement) {
      for (var i = 0; i < answerArray.length; i += 1) {
        addDefaultChecker(i);
      }
    }
  }

  /**
   * Load load and update the checkers
   */
  function loadCheckers() {
    for (var i = 0; i < answerArray.length; i += 1) {
      updateChecker(i, answerArray[i]);
    }
  }

  /**
   * Load the total
   */
  function loadTotal(current) {
    initializeChecks();
    loadCheckers();
  }

  /**
   * Help functio for the sound
   */
  function playAudio(name) {
    var audio = new Audio('assets/sound/' + name + '.mp3');
    audio.play();
  }

  /**
   * Final screen sound
   */
  function finalSound() {
    var score = 0;
    for (var i = 0; i < answerArray.length; i += 1) {
      score += answerArray[i];
    }

    playAudio('magic');

    //print the score with animation
    countUp(score*100);

    if (score == 0) {
      playAudio('fart');
    } else if (score < 5) {
      playAudio('scream');
    } else if (score > 5) {
      playAudio('applause');
    }
  }

  /**
   * Count up function for the final score
   */
  function countUp(count) {
    var div_by = 100,
      speed = Math.round(count / div_by),
      run_count = 1,
      int_speed = 24;

      var scoreArea = document.createElement('div');
      scoreArea.className += 'score-text';
      explanationArea.appendChild(scoreArea);
      scoreArea.innerHTML="Puntuació:";

      answerArea.className +=' score';

    var int = setInterval(function() {
      if (run_count < div_by) {
        answerArea.innerHTML=(speed * run_count);
        run_count++;
      } else if (parseInt(answerArea.textContent) < count) {
        var curr_count = parseInt(answerArea.textContent) + 1;
        answerArea.innerHTML=(curr_count);
      } else {
        clearInterval(int);
      }
    }, int_speed);
  }

  //Check if the current value in the cookie is set
  getCurrentQuestion();

  // Start the quiz right away
  loadQuestion(current);
  loadAnswers(current);
  loadTotal(current);

};
