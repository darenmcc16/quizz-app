'use strict';

const store = {
  // 5 or more questions are required
  slides: [{
      question: 'Start Quiz',
      button: ['start'],
      state: 'start',
    },
    {
      question: "What is George Costanza's father's first name?",
      answers: [
        'Paul',
        'Frank',
        'George',
        'Emmit'
      ],
      correctAnswer: 'Frank',
      button: ['Submit', 'Next'],
      feedback: ['Correct!', 'The correct answer was Frank'],
      state: 'question',
    },
    {
      question: 'Where does the show take place?',
      answers: [
        'Chicago',
        'Boston',
        'New York',
        'L.A.'
      ],
      correctAnswer: 'New York',
      button: ['Submit', 'Next'],
      feedback: ['Correct!', 'The correct answer was New York'],
      state: 'question',
    },
    {
      question: "What is George's alias in the show?",
      answers: [
        'Art Vandelay',
        'Larry David',
        'Mike Johnson',
        'Allen Robinson'
      ],
      correctAnswer: 'Art Vandelay',
      button: ['Submit', 'Next'],
      feedback: ['Correct!', 'The correct answer was Art Vandelay'],
      state: 'question',
    },
    {
      question: 'Elaine liked the big salad with ____.',
      answers: [
        'Carrots',
        'Lots of stuff',
        'Meat',
        'Water'
      ],
      correctAnswer: 'Lots of stuff',
      button: ['Submit', 'Next'],
      feedback: ['Correct!', 'The correct answer was Lots of Stuff'],
      state: 'question',
    },
    {
      question: 'Kramer rescued which talk show from the dumbster?',
      answers: [
        'The Tonight Show',
        'The Ed Sullivan Show',
        'The Late Show',
        'The Merv Griffen Show'
      ],
      correctAnswer: 'The Merv Griffen Show',
      button: ['Submit', 'Next'],
      feedback: ['Correct!', 'The correct answer was The Merv Griffen Show'],
      state: 'question',
    },
    {
      question: 'Quiz Finished!',
      button: ['restart quiz'],
      feedback: [],
      state: 'end',
    }
  ],
  hasAnswered: false,
  quizStarted: false,
  questionNumber: 0,
  score: 0,
};
let counter = 1;

function increaseQuestionCounter(){
  counter ++;
  $('.question-number').text(counter);
}

function slideStartTemplete(selection) {
  return `
  <h2 class=js-form-title>${selection.question}</h2>
  <button class="start-quiz" type="button">${selection.button}</button>
  <p class="hide"></p>`;
}

function slideTemplete(selection) {
  return `
  <form id="js-form-answer">
    <p class="question-number">Question: ${counter}/5</p>
    <p class="current-score"></p>
    <h2 class=js-form-title>${selection.question}</h2>
    <div class="js-answer-wrapper">
    <div class="answer-formatting">
      <input type="radio" name="answers" value="${selection.answers[0]}" required>
      ${selection.answers[0]}
    </div>
    <div class="answer-formatting">
      <input type="radio" name="answers" value="${selection.answers[1]}" required>
      ${selection.answers[1]}
    </div>
    <div class="answer-formatting">
      <input type="radio" name="answers"value="${selection.answers[2]}" required>
      ${selection.answers[2]}
    </div>
    <div class="answer-formatting">
      <input type="radio" name="answers" value="${selection.answers[3]}" required>
      ${selection.answers[3]}
    </div>
    </div>
    <button class="submit feedback" type="button">${selection.button[0]}</button>
    <p class="hide"></P>
  </form>
`;
}

function slideFinishTemplete(selection) {
  return `
  <h2 class="js-form-title">${selection.question}</h2>
  <button class="submit-restart" type="button">${selection.button}</button>
  <p class='finished-feedback'>You answered ${store.score} correct out of 5.</p>
  `
}

function updateQuestionAndScore(){
  let board = $(`
  <p>Question: <span class="queston-number">${counter}</span>/5</p>
  <p>Score: <span class="score">${score}</span></p>
  `);
  console.log(board);
}

function createTemplete(selection) {
  switch (selection.state) {
    case 'start':
      return slideStartTemplete(selection);
    case 'question':
      return slideTemplete(selection);
    case 'end':
      return slideFinishTemplete(selection);
  }
}

function currentQuestion() {
  let index = store.questionNumber;
  return index;
}

function updatedCurrentQuestion() {
  if (currentQuestion() < store.slides.length - 1) {
    store.questionNumber++;
  } else {
    store.questionNumber = 1;
  }
}

function currentScore() {
  return store.score++;
}

function resetScore() {
  return store.score = 0;
}

function resetQuiz() {
  return store.questionNumber = 1;
}

function questionCorrect(entry, correctAnswer) {
  if (entry === correctAnswer) {
    return true;
    console.log('correct');
  }
  else{
    return false;
  }
}


function render() {
  const slide = store.slides[currentQuestion()];
  const template = createTemplete(slide);
  $('main').html(template);
}

function startQuiz() {
  $('main').on('click', '.start-quiz', event => {
    event.preventDefault();
    console.log('start-quiz')
    store.quizStarted === true;
    updatedCurrentQuestion();
    render();
  });
}

function restartQuiz() {
  $('main').on('click', '.submit-restart', event => {
    event.preventDefault();
    console.log('submit-restart');
    counter = 1;
    resetScore();
    resetQuiz();
    render();
  });
}

function givePositiveFeedback(slide){
  $('.hide').text(slide.feedback[0]);
  $('.current-score').text("You answered " + store.score + " correct");
}

function giveNegativeFeedback(slide){
  $('.hide').text(slide.feedback[1]);
  $('.current-score').text("You answered " + store.score + " correct");
}

function giveQuestionFeedback(slide, selection){
  console.log(slide);
  console.log(selection);
  if (questionCorrect(selection, slide.correctAnswer)){
    currentScore();
    givePositiveFeedback(slide);
  }
  else{
    giveNegativeFeedback(slide);
  }
}

function toggleHasAnswered() {
  store.hasAnswered = !store.hasAnswered;
}

function checkIfAnswered(slide, selection) {
  console.log(selection);
  if (!store.hasAnswered) {
    giveQuestionFeedback(slide, selection);
    toggleHasAnswered();
  } else {
    toggleHasAnswered();
    render();
  }
}

function editSubmitClass(slide) {
  $('.submit').addClass('next');
  $('.submit').text(slide.button[1]);
  $('.submit').removeClass('submit');
}

function getFeedback() {
  $('main').on('click', '.submit', event => {
    event.preventDefault();
    let slide = store.slides[currentQuestion()];
    //let selection = $(this).closest("form").find('input[name="answers"]:checked').val();
    let selection = $('input[name="answers"]:checked').val();
    console.log(selection);
    checkIfAnswered(slide, selection);
    console.log(store.score);
    editSubmitClass(slide);
    console.log('button edit');
    toggleHasAnswered();
    console.log('has-answered')
  });
}

function editNextButtonClass(slide) {
  $('.next').addClass('submit');
  $('.next').text(slide.button[0]);
  $('.next').removeClass('next');
}

function nextQuestion() {
  //need to change submit-feedback trigger
  $('main').on('click', '.next', event => {
    event.preventDefault();
    console.log('submit');
    let userAnswer = $("input[name='answers']:checked").val();
    console.log(userAnswer);
    let slide = store.slides[currentQuestion()];
    updatedCurrentQuestion();
    editNextButtonClass(slide);
    console.log('next button class');
    increaseQuestionCounter();
    render();
  });
}

function main() {
  render();
  startQuiz();
  nextQuestion();
  restartQuiz();
  getFeedback();
}

$(main);




/**
 * 
 * Technical requirements:
 * 
 * Your app should include a render() function, that regenerates the view each time the store is updated. 
 * See your course material and access support for more details.
 *
 * NO additional HTML elements should be added to the index.html file.
 *
 * You may add attributes (classes, ids, etc) to the existing HTML elements, or link stylesheets or additional scripts if necessary
 *
 * SEE BELOW FOR THE CATEGORIES OF THE TYPES OF FUNCTIONS YOU WILL BE CREATING 👇
 * 
 */

/********** TEMPLATE GENERATION FUNCTIONS **********/

// These functions return HTML templates

/********** RENDER FUNCTION(S) **********/

// This function conditionally replaces the contents of the <main> tag based on the state of the store

/********** EVENT HANDLER FUNCTIONS **********/

// These functions handle events (submit, click, etc)