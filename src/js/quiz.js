;
window.onload = function() {

  var questionArea = document.getElementsByClassName('questions')[0];
  var answerArea = document.getElementsByClassName('answers')[0];
  var answerArray = new Array();
  var current;
  var currentQuestion = 0;

  //Cookies.remove('tza');

  function getCurrentQuestion() {
    if (Cookies.get('tza')) {
      var val = JSON.parse(Cookies.get('tza'));
      current = val.curr;
      answerArray = val.arr;
      console.log(current);
      console.log(answerArray);
    } else {
      current = 0;
    }
  }

  /**
   *
   * This function loads all the question into the questionArea
   * It grabs the current question based on the 'current'-variable
   *
   */
  function loadQuestion(curr) {

    //var question = questions[curr].questions

    questionArea.innerHTML = '';
    questionArea.innerHTML = "Question ?";
    //totalArea.innerHTML = (curr + 1) + ' / ' + total;

  }

  /**
   *
   */
  function getAnswersRestCall(curr) {
    var xhReq = new XMLHttpRequest();
    xhReq.open("GET", "http://localhost:8080/api/help-questions/level/" + curr, false);
    xhReq.send(null);
    var serverResponse = xhReq.responseText;

    //alert(serverResponse); // Shows "15"
    answers = JSON.parse(serverResponse);

    answers.forEach(function(answer) {
      console.log(answer.description);
    });

    return answers;
  }

  function getQuestionRestCall(curr) {
    var q = [true,false,false,true,true];
    return q[curr];
  }

  /**
   *
   * This function loads all the possible answers of the given question
   * It grabs the needed answer-array with the help of the current-variable
   * Every answer is added with an 'onclick'-function
   *
   */
  function loadAnswers(curr) {

    var question = getQuestionRestCall(currentQuestion);
    var answers = getAnswersRestCall(curr);
    console.log(currentQuestion)
    console.log(question);
    //check type
    if (question) {
      answerLogic();
    } else {
      checkBoxLogic();
    }
  }

  function answerLogic() {
    answerArea.innerHTML = '';

    for (var i = 0; i < answers.length; i += 1) {

      var createDiv = document.createElement('div'),
        text = document.createTextNode(answers[i].description);

      createDiv.appendChild(text);
      createDiv.addEventListener("click", checkAnswer(i, answers));

      answerArea.appendChild(createDiv);
    }
  }

  function checkBoxLogic() {
    answerArea.innerHTML = '';

    for (var i = 0; i < answers.length; i += 1) {

      console.log(answers);
      var createDiv = document.createElement('div');

      var checkbox = document.createElement('input');
      checkbox.type = "checkbox";
      checkbox.name = "name";
      checkbox.value = i + 1;
      checkbox.id = "checkbox-" + i;

      createDiv.appendChild(checkbox);

      var label = document.createElement('label')
      label.htmlFor = "id";
      label.appendChild(document.createTextNode(answers[i].description));
      //label.addEventListener("click", selectCheckBox(i));

      createDiv.appendChild(label);

      answerArea.appendChild(createDiv);


    }

    var createContinueDiv = document.createElement('div'),
      text = document.createTextNode("Continue");

    createContinueDiv.appendChild(text);
    createContinueDiv.addEventListener("click", checkCheckBox(answers[0].parent, answers.length));

    answerArea.appendChild(createContinueDiv);
  }

  function getValueCheckBox() {
    var valueToReturn = '';
    for (var i = 0; i < answers.length; i += 1) {
      var ele = document.getElementById("checkbox-" + i)
      if (ele.checked == true) {
        valueToReturn += ele.value;
      }
    }
    return valueToReturn;
  }

  function checkCheckBox(parent, answersLenght) {

    return function() {
      var valueCheck = getValueCheckBox(answersLenght);
      currentQuestion = currentQuestion + 1;

      var answers = getAnswersRestCall(parent);
      console.log(answers.length);
      if (answers.length > 0) {
        current += 1;

        answerArray.push(valueCheck);

        var tzaCookie = '{ "curr" : ' + parent + ', "arr" : [' + answerArray + '] }';

        //Set Cookie
        Cookies.set('tza', tzaCookie);

        loadQuestion(current);
        loadAnswers(parent);

      } else {
        theEnd(current);
      }
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

    return function() {

      var givenAnswer = i + 1;
      currentQuestion = currentQuestion + 1;

      //Check if there are more answeres
      var answers = getAnswersRestCall(arr[i].parent);
      console.log(answers.length);
      if (answers.length > 0) {
        current += 1;

        answerArray.push(i + 1);

        var tzaCookie = '{ "curr" : ' + arr[i].parent + ', "arr" : [' + answerArray + '] }';

        //Set Cookie
        Cookies.set('tza', tzaCookie);

        loadQuestion(current);
        loadAnswers(arr[i].parent);

      } else {
        theEnd(i);
      }

    };
  }

  function theEnd(i) {
    console.log('final');

    answerArray.push(i + 1);

    questionArea.innerHTML = 'Final';

    var final = '';
    console.log(answerArray);
    console.log(answerArray.length);
    for (var x = 0; x < answerArray.length; x += 1) {
      console.log(answerArray[x]);
      final = final.concat(answerArray[x] + ', ');
    }

    answerArea.innerHTML = '' + final;

    //Remove cookie
    Cookies.remove('tza');
  }

  //Check if the current value in the cookie is set
  getCurrentQuestion();

  // Start the quiz right away
  loadQuestion(current);
  loadAnswers(current);

};
