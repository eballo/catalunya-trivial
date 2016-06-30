window.onload = function () {
   
    var questionArea = document.getElementsByClassName('questions')[0];
    var imageArea    = document.getElementsByClassName('image')[0];
    var answerArea   = document.getElementsByClassName('answers')[0];
    var checker      = document.getElementsByClassName('checker')[0];
    var current      = 0;
      
  function loadQuestion(curr) {
  // This function loads all the question into the questionArea
  // It grabs the current question based on the 'current'-variable
  
    var question = questions[curr].question;
    var image = questions[curr].image;
    
    questionArea.innerHTML = '';
    questionArea.innerHTML = question;    
    
    if(image!= ""){
      imageArea.innerHTML = '';
        imageArea.innerHTML = '<img src="'+image+'" height="200" width="200" >';
    }else{
        imageArea.innerHTML = '';  
    }
  }
  
  function loadAnswers(curr) {
  // This function loads all the possible answers of the given question
  // It grabs the needed answer-array with the help of the current-variable
  // Every answer is added with an 'onclick'-function
  
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
  
  function checkAnswer(i, arr) {
    // This is the function that will run, when clicked on one of the answers
    // Check if givenAnswer is sams as the correct one
    // After this, check if it's the last question:
    // If it is: empty the answerArea and let them know it's done.
    
    return function () {
      var givenAnswer = i+1;
      var correctAnswer = questions[current].correct;
        
      if (givenAnswer === correctAnswer) {
        addChecker(true);             
      } else {
        addChecker(false);                        
      }
      
      if (current < Object.keys(questions).length -1) {
        current += 1;
        
        loadQuestion(current);
        loadAnswers(current);
      } else {
        questionArea.innerHTML = 'Final';
        imageArea.innerHTML = ''
        answerArea.innerHTML = '';
      }
                              
    };
  }
  
  function addChecker(bool) {
  // This function adds a div element to the page
  // Used to see if it was correct or false
  
    var createDiv = document.createElement('div'),
        txt       = document.createTextNode(current + 1);
    
    createDiv.appendChild(txt);
    
    if (bool) {
      
      createDiv.className += 'correct';
      checker.appendChild(createDiv);
    } else {
      createDiv.className += 'false';
      checker.appendChild(createDiv);
    }
  }
  
  
  // Start the quiz right away
  loadQuestion(current);
  loadAnswers(current);
  
};
