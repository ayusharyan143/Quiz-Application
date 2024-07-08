const progressBar = document.querySelector(".progress-bar");
const progressText = document.querySelector(".progress-text");

const progress = (value) => {
    const percentage = (value / time ) * 100; 
    progressBar.style.width = `${percentage}%`;
    progressText.innerHTML = `${value}`;
};

let questions = [];
let time = 30; 
let score = 0; 
let currentQuestion, timer;

const startBtn = document.querySelector(".start");
const numQuestions = document.querySelector("#numofquestions");
const category = document.querySelector("#category");
const difficulty = document.querySelector("#difficulty");
const timePerQuestion = document.querySelector("#time");
const quiz = document.querySelector(".quiz");
const startScreen = document.querySelector(".start-screen");

const startQuiz = () => {
    const num = numQuestions.value;
    const cat = category.value;
    const diff = difficulty.value;
    const time = timePerQuestion.value;

    // API url
    const url = `https://opentdb.com/api.php?amount=${num}&category=${cat}&difficulty=${diff}&type=multiple`;
    
    

    fetch(url)
        .then((res) => res.json())
        .then((data) => {
            questions = data.results;
            console.log(questions);
            startScreen.classList.add('hide');
            quiz.classList.remove('hide');
            currentQuestion = 1 ; 
            showQuestion(questions[0]);
        });
};      

startBtn.addEventListener("click", startQuiz);

const submitBtn = document.querySelector(".submit");
const nextBtn = document.querySelector(".next");

const showQuestion = (question) => {
    const questionText = document.querySelector('.question');
    const answersWrapper = document.querySelector('.answer-wrapper');
    const questionNumber = document.querySelector('.number') ;


    questionText.innerHTML = question.question ; 


    // correct an wrong answers are separate lets mix them 
    const answers = [ ...question.incorrect_answers , question.correct_answer.toString() , ];


    // correct answer will be always at last 
    // lets shuffle the array 

    answers.sort(()=> Math.random() - 0.5 ) ;
    answersWrapper.innerHTML = "" ;
    answers.forEach((answer) => {
        answersWrapper.innerHTML += `
                <div class="answer">
                    <span class="text">${answer}</span>
                    <span class="checkbox">
                        <span class="icon">✓</span>
                    </span>
                </div>
        `;
    });

    questionNumber.innerHTML = `
        question <span class = "current" >${questions.indexOf(question)+1}</span>
        <span class = "total" >/${questions.length}</span>   
    `;


    // lets add event listner on answer 

    const answersDiv = document.querySelectorAll('.answer');
    answersDiv.forEach((answer) => {
        answer.addEventListener('click' , () => {

            // if answer not already submitted
            if( !answer.classList.contains('checked'))
            {
                // remove seelcted form other answer 
                answersDiv.forEach((answer)=>{
                    answer.classList.remove("selected");
                });

                // add selected on currently clicked 
                answer.classList.add("selected");

                // after ant answer is selected enable submit btn 
                submitBtn.disabled = false ; 
            }
        });
    });
 
    // after updating question start timer 
    time = timePerQuestion.value ; 
    startTimer(time);


};


const startTimer = (time) => {
    timer = setInterval(() => {
        
        if( time >= 0 )
        {
            // if timer is greater then zero it means time remaining
            // move progress 
            progress(time);
            time-- ; 
        }
        else 
        {
            // if time finishes meand less then 0 
            checkAnswer();
        }
    }, 1000);
};



submitBtn.addEventListener('click' , () => {
    checkAnswer();
});

const checkAnswer = () => {
    // firstclear interval when check answer triggerd 
    clearInterval(timer);


    const selectedAnswer = document.querySelector(".answer.selected");
    // any answer is selected 
    if( selectedAnswer )
    {
        const answer = selectedAnswer.querySelector(".text");
        if( answer.textContent === questions[currentQuestion - 1 ].correct_answer )
        {
            // if answer matched with current question correct answer 
            // increase score 

            score++ ; 
            selectedAnswer.classList.add("correct");
        }
        else
        {
            // if wrong selected 
            // add wrong class on selected but then also add correct on correct answer
            // correct added lets add wrong on selected 

            selectedAnswer.classList.add("wrong");
            
            const correctAnswer = document
                .querySelectorAll(".answer")
                .forEach((answer) => {
                    if( answer.querySelector(".text").innerHTML === questions[currentQuestion-1].correct_answer)
                    {
                        // only add correct class to correct answer 
                        answer.classList.add("correct");
                    }
                });
        }
    }


    // answer check will be also triggered when time reaches 0 
    // what if nothing seelcted and time finishes 
    // lets just add correct class on correct answer

    else
    {
        const correctAnswer = document
        .querySelectorAll(".answer")
        .forEach((answer) => {
            if( answer.querySelector(".text").innerHTML === questions[currentQuestion-1].correct_answer)
            {
                // only add correct class to correct answer 
                answer.classList.add("correct");
            }
        });
    }




    // lets block user to select further answers
    const answerDiv = document.querySelectorAll('.answer');
    answerDiv.forEach((answer) => {
        answer.classList.add('checked');

        // add checked class on all answer as we check for it when on click answer if its present do nothing.

        // also when checked lets dont add hover effect on checkBox
        
    });


    // after submit show btn to go to next question 
    submitBtn.style.display = 'none';
    nextBtn.style.display = 'block';

};


// on next btn click show next question 

nextBtn.addEventListener('click' , () => {
    nextQuestion();

    // also show submit btn on next question and hide next btn 
    nextBtn.style.display = 'none';
    submitBtn.style.display = 'block';
});


const nextQuestion = () => {
    // if there is remaining question 
    if( currentQuestion < questions.length )
    {
        currentQuestion++ ; 
        
        // show question 
        showQuestion( questions[currentQuestion-1]);
    }
    else 
    {
        // if no question remaining 
        showScore();
    }
};


const endScreen = document.querySelector('.end-screen');
const finalScore = document.querySelector('.final-score');
const totalScore = document.querySelector('.total-score');
  

const showScore = () => {
    endScreen.classList.remove("hide");
    quiz.classList.add("hide");
    finalScore.innerHTML = score ; 
    totalScore.innerHTML = `/${questions.length}`

};




// Restart Button 
const restartBtn = document.querySelector(".restart");
restartBtn.addEventListener('click' , () => {
    // reload page on click 
    window.location.reload(); 
});




