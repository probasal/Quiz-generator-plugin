$(document).ready(function(){
   $('.quiz-container').quizGen({
        myQpath: "js/quiz.json",
        totalQust: 5,
        liveResult : function(data){
            getData(data);
        }
    });
    
    function getData(y){
        console.log(y);
    }
})
