(function($){
    $.fn.quizGen = function( options ) {
    
        var opts = $.extend( {}, $.fn.quizGen.defaults, options );

        return this.each(function() {
    
            var elem = $( this );
            var quizData = null;
            var randomQarr = [];
	        var answerList =[];
            var myanswer;
            var correctAns = 0;
	        var quesNo = 1;

           // Get error if file path not set 
            if(opts.myQpath==''){
                elem.html('Error : File Path not set (myQpath: "yourfilename.json") !');
                return false;
            }

           // Load Questions
           $.getJSON( opts.myQpath , function(data) {
         		quizData = data.quiz;
            	configureData();
                console.log(randomQarr);
            });

            // Get Question on page load
            function configureData(){
                var exists = [],
                randomNumber,
                totalQuestions = opts.totalQust=="" ? quizData.length : opts.totalQust;
                for (var i = 0; i < totalQuestions; i++) {
                    do {
                        randomNumber = Math.floor(Math.random() * totalQuestions);
                    } while (exists[randomNumber]);
                        exists[randomNumber] = true;
                    randomQarr.push(randomNumber);
                }
                getQuestion(randomQarr[0]);
                
            }

            // Question Container
            function getQuestion(x){
               var optionlist =quizData[randomQarr[x]].options.length;
               var myoptions = "";
                for (var i = 0; i < optionlist; i++) {
                myoptions += `<div class="radio">
                                <label><input type="radio" name="optradio" class="qoption">${quizData[randomQarr[x]].options[i]}</label>
                             </div>`;
                };

                elem.html(`<div class="panel panel-primary">
                                <div class="panel-heading">
                                    <h3 class="panel-title">${quizData[randomQarr[x]].question}</h3>
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
                        getQuestion(quesNo++);
                   }else{
                       getResult();  
                   }
            })

           // Get answer
           elem.on('click','.qoption', function(){
               myanswer = $(this).parent().parent().index();
               console.log('index:'+ myanswer);
            })

            // Get Result
            function getResult(){
                correctAns;
                var totalQ = opts.totalQust=="" ? quizData.length : opts.totalQust;
                for (var i = 0; i < totalQ; i++) {
                    if(quizData[randomQarr[i]].answer == answerList[i]){
                          correctAns++;  
                    }
                }
                 elem.html(`Quiz Completed ! <Br> ${correctAns} / ${totalQ}`);
            }

        });
    
    };
    
    $.fn.quizGen.defaults = {
        myQpath : '',
        showGraph : true,
        showPreviousBtn : true,
        totalQust : null
    }

})(jQuery);
