(function($){
    $.fn.quizGen = function( options ) {
    
        var opts = $.extend( {}, $.fn.quizGen.defaults, options );

        return this.each(function() {
    
            var elem = $( this );
            var quizData = null;
            var randomQarr = [];
	        var answerList = [];
            var myanswer;
            var correctAns = 0;
            var quesNo = 1;
            var remark;
            var totalpercent;
            var counter = opts.timeperQuestion*60;
            var interval;


           // Get error if file path not set 
            if(opts.myQpath == null){
                elem.html('Error : File Path not set (myQpath: "yourfilename.json") !');
                return false;
            }

           // Load Questions
           $.getJSON( opts.myQpath , function(data) {
         		quizData = data.quiz;
            	configureData();                
            });

            // Get Question on page load
            function configureData(){
                var exists = [],
                randomNumber,
                totalQuestions = quizData.length;
                for (var i = 0; i < totalQuestions; i++) {
                    do {
                        randomNumber = Math.floor(Math.random() * totalQuestions);
                    } while (exists[randomNumber]);
                        exists[randomNumber] = true;
                    randomQarr.push(randomNumber);
                }
                
                if(opts.totalQust!=null){
                    var removeq = randomQarr.length-opts.totalQust; 
                    randomQarr.splice(opts.totalQust, removeq);                  
                } 

                getQuestion(randomQarr[0]);
                
            }

            // Question Container
            function getQuestion(x){               
               var optionlist =quizData[x].options.length;
               var myoptions = "";
                for (var i = 0; i < optionlist; i++) {
                myoptions += `<div class="radio">
                                <label><input type="radio" name="optradio" class="qoption">${quizData[x].options[i]}</label>
                             </div>`;
                };

                elem.html(`<div class="panel panel-primary">
                                <div class="panel-heading">
                                    <h3 class="panel-title">${quizData[x].question} <span class="mycounter pull-right">00:00</span></h3>
                                </div>
                                <div class="panel-body">
                                     ${myoptions}
                                </div>
                            </div>
                            <button type="button" class="btn btn-primary pull-right next-question">Next</button>`);		
            }

            // Load Button
            if (opts.showPreviousBtn){
                elem.find('.next-question').before(`<button type="button" class="btn btn-primary pull-right m-r-15 prev-question">Previous</button>`) 
            }

            // Get next Question
            elem.on('click','.next-question', function(){
                   
                   var totalQ = randomQarr.length;

                   if($(".qoption").is(":checked")){
                       answerList.push(myanswer);
                   }else{
                       alert('Please select your answer');
                       return false;
                   }

                   if(quesNo!= totalQ){
                        getQuestion(randomQarr[quesNo++]);
                   }else{
                        getResult();  
                   }

                    if(opts.timeperQuestion!=null){

                        $('.qoption').removeAttr('disabled','disabled');
                        $('.radio').removeClass('disabled');

                        counter = opts.timeperQuestion*60;
                        clearInterval(interval);
                        perQTime();
                    }
                   opts.liveResult(answerList);
            })

           // Get answer
           elem.on('click','.qoption', function(){
               myanswer = $(this).parent().parent().index();               
            })

            // Get Result
            function getResult(){
                correctAns;
                var totalQ = randomQarr.length;
                for (var i = 0; i < totalQ; i++) {
                    if(quizData[randomQarr[i]].answer == answerList[i]){
                          correctAns++;  
                    }
                }

                totalpercent = correctAns/totalQ*100;

                if(totalpercent < 40){
                    remark= 'Need to work hard.';
                } else if(totalpercent >=40 && totalpercent<=50){
                    remark = 'Fair';
                } else if(totalpercent>50 && totalpercent<=70){
                    remark = 'Good';
                } else if(totalpercent>70 && totalpercent<=80){
                    remark = 'Good Job';
                } else if(totalpercent>80 && totalpercent<=95){
                    remark = 'Excellent';
                }else if(totalpercent>95){
                    remark = 'Great Job!';
                }
                
                elem.html(`<div class="result"> Quiz Completed ! <Br> ${correctAns} / ${totalQ} <br> Percentage :  ${totalpercent}% <br><br>${remark}<br> <button type="button" class="btn btn-primary restart-quiz">Restart Quiz</button> </div>`);
                console.log(remark);
            }

            // Time for perticular question
            function perQTime(){
                interval = setInterval(function() {
                    counter--;
                    $('.mycounter').html("00:"+counter);
                    if (counter == 0) {
                        clearInterval(interval);
                        $('.qoption').attr('disabled','disabled');
                        $('.radio').addClass('disabled');
                    }
                }, 1000);
            }

             elem.on('click','.restart-quiz', function(){
                configureData();                
             })

        });
    
    };
    
    $.fn.quizGen.defaults = {
        myQpath : null,
        totalQust : null,
        timeperQuestion: 2,
        liveResult : function(x){}
    }

})(jQuery);
