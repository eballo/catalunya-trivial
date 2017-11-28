;
window.onload = function() {

  var questionArea = document.getElementsByClassName('questions')[0];
  var answerArea = document.getElementsByClassName('answers')[0];
  var answerArray = new Array();
  var currentQuestionID = 0;
  var currentQuestion = 0;

  Cookies.remove('tza');

  function getCurrentQuestion() {
    if (Cookies.get('tza')) {
      var val = JSON.parse(Cookies.get('tza'));
      currentQuestionID = val.curr;
      answerArray = val.arr;
      console.log(currentQuestionID);
      console.log(answerArray);
    } else {
      currentQuestionID = 0;
    }
  }

  /**
   *
   */
  function getQuestionRestCall(questionID) {
    var xhReq = new XMLHttpRequest();
    xhReq.open("GET", "http://localhost:8080/api/help-questions/" + questionID, false);
    xhReq.send(null);
    var serverResponse = xhReq.responseText;
    var question = null;

    if (xhReq.status == 200) {
      question = JSON.parse(serverResponse);
      console.log(question);
      var answers = question.helpAnswers
      answers.forEach(function(answers) {
        console.log(answers.answer);
      });
    }

    return question;
  }

  /**
   *
   * This function loads all the possible answers of the given question
   * It grabs the needed answer-array with the help of the current-variable
   * Every answer is added with an 'onclick'-function
   *
   */
  function loadQuestionAndAnswers(questionID) {

    var question = getQuestionRestCall(questionID);

    questionArea.innerHTML = '';
    questionArea.innerHTML = question.question;

    var answers = question.helpAnswers;

    console.log("Current Question : " + currentQuestion)
    console.log("question " + question.question);
    console.log("answers " + answers);

    //check type
    if (question.qType == 'normal') {
      answerLogic(question);
    } else {
      checkBoxLogic(question);
    }

  }

  function answerLogic(question) {
    console.log('answerLogic');
    answerArea.innerHTML = '';
    var answers = question.helpAnswers;

    for (var i = 0; i < answers.length; i += 1) {

      var createDiv = document.createElement('div'),
        text = document.createTextNode(answers[i].answer);

      createDiv.appendChild(text);
      createDiv.addEventListener("click", checkAnswer(i, answers));

      answerArea.appendChild(createDiv);
    }
  }

  function checkBoxLogic(question) {
    console.log('checkBoxLogic');

    answerArea.innerHTML = '';
    var answers = question.helpAnswers;

    for (var i = 0; i < answers.length; i += 1) {

      var createDiv = document.createElement('div');

      var checkbox = document.createElement('input');
      checkbox.type = "checkbox";
      checkbox.name = "name";
      checkbox.value = i + 1;
      checkbox.id = "checkbox-" + i;

      createDiv.appendChild(checkbox);

      var label = document.createElement('label')
      label.htmlFor = "id";
      label.appendChild(document.createTextNode(answers[i].answer));
      //label.addEventListener("click", selectCheckBox(i));

      createDiv.appendChild(label);

      answerArea.appendChild(createDiv);


    }

    var createContinueDiv = document.createElement('div'),
      text = document.createTextNode("Continue");

    createContinueDiv.appendChild(text);
    createContinueDiv.addEventListener("click", checkCheckBox(answers[0].parent, answers));

    answerArea.appendChild(createContinueDiv);
  }

  function getValueCheckBox(numAnswers) {
    console.log('getValueCheckBox');
    var valueToReturn = '';
    for (var i = 0; i < numAnswers; i += 1) {
      var ele = document.getElementById("checkbox-" + i)
      if (ele.checked == true) {
        valueToReturn += ele.value;
      }
    }
    return valueToReturn;
  }

  function checkCheckBox(parent, answersList) {
    console.log('checkCheckBox');
    return function() {
      var valueCheck = getValueCheckBox(answersList.length);
      currentQuestion = currentQuestion + 1;

      var question = getQuestionRestCall(parent);
      if (question) {
        var answers = question.helpAnswers;

        console.log(answers.length);
        if (answers.length > 0) {
          currentQuestionID += 1;

          answerArray.push(valueCheck);

          var tzaCookie = '{ "curr" : ' + parent + ', "arr" : [' + answerArray + '] }';

          //Set Cookie
          Cookies.set('tza', tzaCookie);

          loadQuestionAndAnswers(parent);

        }
      } else {
        answerArray.push(valueCheck);
        theEnd(currentQuestionID);
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
  function checkAnswer(i, answersList) {
    console.log('checkAnswer');

    return function() {

      var givenAnswer = i + 1;
      currentQuestion = currentQuestion + 1;

      //Check if there are more answeres
      var question = getQuestionRestCall(answersList[i].parent);

      if (question) {
        console.log(question);
        var answers = question.helpAnswers;

        console.log(answers.length);
        if (answers.length > 0) {
          currentQuestionID += 1;

          answerArray.push(i + 1);

          var tzaCookie = '{ "curr" : ' + answersList[i].parent + ', "arr" : [' + answerArray + '] }';

          //Set Cookie
          Cookies.set('tza', tzaCookie);

          loadQuestionAndAnswers(answersList[i].parent);
        }
      } else {
        answerArray.push(i + 1);
        theEnd(currentQuestionID);
      }

    };
  }

  function theEnd(i) {
    console.log('final');

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
  loadQuestionAndAnswers(currentQuestionID);

};
