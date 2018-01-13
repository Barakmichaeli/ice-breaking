$(function () {
    waitOpponent(function () {
        $(".introduce").fadeIn("slow");
    });
});

$(".btn-start").click(function () {
    $(".introduce").fadeOut("slow");
    waitOpponent();
});

//question form - send question
$(".btn-submit").click(function (e) {
    //We send our question and wait for result
    console.log("submit form");
    e.preventDefault();

    var question = $("#question").val();
    var answer_a = $("#answer_a").val();
    var answer_b = $("#answer-b").val();
    var answer_c = $("#answer-c").val();

    var data = {
        question: question,
        a: answer_a,
        b: answer_b,
        c: answer_c
    };

    $.post("../api/sendquestion", {data: data})
        .done(function () {
            $(".questions-form").fadeOut("slow");
            waitForResult();
        }).fail(function () {
        alert("error");
        //error connect send the data to the server
//            $(".btn-submit").trigger("click");
    });
});

$(".input-url").val(window.location);

$(".btn-info").click(function () {
    $(".input-url").select();
    document.execCommand("copy");
});

$(".btn-answer").click(function () {
    $(this).parent().toggle('slow');
    var answerAnimation;

    if ($(this).attr("id") == ans) {
        answerAnimation = $(".goodcouple");
        answerAnimation.fadeIn("slow");
    } else {
        answerAnimation = $(".badcouple");
        answerAnimation.fadeIn("slow");
    }
    setTimeout(function () {
        answerAnimation.fadeOut('2000', function () {
            $(".questions-form").fadeIn("slow");
        });
    }, 4000);
});


var questions = [
    "Where do i study?",
    "Where was my first kiss?",
    "What is my middle name?"
];

var questionNum = 0;

$(".btn-generate").click(function () {
    questionNum = questionNum % 3;
    $("#question").val(questions[questionNum]);
    questionNum++;
});

function waitOpponent(callback) {
    $(".loading").toggle("slow");

    var interval = setInterval(function () {
        console.log("ajax call");
        $.get("../api/connection")
            .done(function (data) {
                clearInterval(interval);
                if (data['question']) { //server decide who ask and who wait for question
                    $(".loading").fadeOut("slow"); //immediatly stop
                    $(".questions-form").fadeIn("slow");
                } else {
                    waitForQuestion(function () {
                        $(".loading").fadeOut("slow");
                    });
                }
            })
            .fail(function () {
                //block after some attemps?
//                    alert("fail");
            });
    }, 5000);
}

var ans = 0;

function waitForQuestion(callback) {
    console.log("wait for question");
    var interval = setInterval(function () {
        //ajax calls for question
        $.get("../api/question")
            .done(function (data) {
                callback();
                clearInterval(interval);
                $(".answers-form h1").text(data['question']);
                $(".answers-form #1").text(data['answer_a']);
                $(".answers-form #2").text(data['answer_b']);
                $(".answers-form #3").text(data['answer_c']);
                ans = data['correct_answer'];
                $(".answers-form").toggle("slow");
            })
            .fail(function () {
                //block until timeout?
            });
    }, 5000);
}

function waitForResult(callback) {

    $(".loading").toggle("slow"); // change?

    var interval = setInterval(function () {
        $.get("../api/result")
            .done(function (data) {
                $(".loading").toggle("slow"); // change?
                if (data['result']) {
                    $(".goodcouple").fadeIn("slow");
                    clearInterval(interval);
                    waitForQuestion(function () {
                        $(".goodcouple").fadeOut("slow");
                    });
                }
                else {
                    $(".badcouple").fadeIn("slow");
                    clearInterval(interval);
                    console.log("bad answer by date");
                    waitForQuestion(function () {
                        $(".badcouple").fadeOut("slow");
                    });
                }
            });
    }, 3000);
}
