var firebaseConfig = {
    apiKey: "AIzaSyBu9TX91Rn-TmSc1ggZM9jvLJ8A2V-Vxf0",
    authDomain: "words-to-video.firebaseapp.com",
    databaseURL: "https://words-to-video.firebaseio.com",
    projectId: "words-to-video",
    storageBucket: "words-to-video.appspot.com",
    messagingSenderId: "153429453725",
    appId: "1:153429453725:web:d087d82315e52db5"
  };

firebase.initializeApp(firebaseConfig);

var dataRef = firebase.database();
var valid = true;
var alertModal = $("#alertMessage");
var alertMessageWrapper = $('#alertMessageWrapper');

$(document).ready(function(){
    var word;
    
    // ..................................Code by Indima for words api..............................................

    var apiKey = "f631ef1902msh9f09d2e297d69a3p115d8ajsnfac73288f5c5";

    var queryURL = ""; 

    //This the input word 
    var queryWord = "";
    // var youTubeQuery;

    // This is the option user selects from the dropdown    
    var queryOption = "";
    var userName;
    function initSlick(target){
        $(target).slick({
            slidesToShow: 1,
            autoplay: false,
            autoplaySpeed: 3000,
            centerMode: true,
            adaptiveHeight: true,
            centerPadding: '50px',
            variableWidth: false,
        });
    }
    function returnRandomWord(array){
        var randomNum = Math.floor(Math.random()*array.length);
        return array[randomNum];
    }
    function scrollTo(target){
        var offsetTop = $(target).offset().top;
        // console.log(offsetTop);
        if (valid){
            $(window).scrollTop(offsetTop);
        }
    }
    function showModal(message){
        $("#errMessage").text(message);
        console.log($("#errMessage").text());
        // alertMessageWrapper.prepend(errMessage);


        alertModal.show();
        valid = false;
    }
    function wordCloudify(wordsArray){
        // debugger;
        // console.log(wordsArray);
        words=[];
        // console.log(typeof wordsArray);
        // console.log(wordsArray[0]);
        for (i=0;i<wordsArray.length;i++){
            if (wordsArray[i].definition){
                words.push(wordsArray[i].definition);
            } else {
                words.push(wordsArray[i]);
            }
            // console.log(wordsArray[i]);
            
        }
        // console.log(words);

        // console.log('words',words);
        var cloudObject = {
            type: 'wordcloud',
            options: {
                minLength: 4,
                ignore: [],
                rotate: true,
                words: [],
                minFontSize: 20
            }
        };
        function returnRandomNum(){
            var randomNum = Math.floor((Math.random() * 200) + 1);
            // console.log(randomNum);
            return randomNum.toString();
        }
        for (i=0;i<words.length;i++){
            word = {
                text: words[i],
                count: returnRandomNum()
            }
            cloudObject.options.words.push(word);
        }
        // console.log(cloudObject.options.words);
        zingchart.render({ 
            id: 'wordCloud', 
            data: cloudObject, 
            height: 700, 
            width: '100%' 
        });
    }
    function youTubify(searchTerm){
        console.log(searchTerm);
        if ($('#youtubebox').hasClass('slick-slider')) {
            $('#youtubebox').slick('unslick');
        }
        // var youTubeQuery;

            // console.log(wordsArray[i]);
            
        var queryURL= "https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=6&type=video&videoCaption=any&videoEmbeddable=true&key=AIzaSyA8Ci2U7JG9zWZU8BOZYIGXbonnlgDuqyc&q=" + searchTerm
        // $(".instructions").show();
        $.ajax({
            url: queryURL,
            method: "GET" 
    
        }).done(function(response){
            // console.log(response);
            
            var results = response.items;
            console.log(results);
            var videoIds = [];
    
            for (var i = 0; i < results.length; i++) {
                //div to hold video 
                console.log(results[i].snippet.title)
                videoIds.push({
                    id: results[i].id.videoId,
                    title: results[i].snippet.title,
                    img: results[i].snippet.thumbnails.high.url
                });
            }
            // console.log(videoIds);


            var youTubeWrapper;
            var playButton;
            var imageThumb;
            var title;
            var videoId;
            for (var i = 0; i < videoIds.length; i++) {
                videoId = videoIds[i].id;
                youTubeWrapper = $("<div>");
                playButton = $('<div>');
                imageThumb = $('<img>');
                title = $('<div>');
                title.addClass('video-title');
                title.text(videoIds[i].title);
                imageThumb.attr('src', videoIds[i].img);
                youTubeWrapper.addClass('youtube');
                youTubeWrapper.attr('data-id',videoId);
                playButton.addClass('play-button');
                youTubeWrapper.append(playButton);
                youTubeWrapper.append(imageThumb);
                youTubeWrapper.append(title);
                // var video = '<iframe width="560" height="315" src="https://www.youtube.com/embed/' + videoIds[i] + '" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>';
                // // console.log(videoIds[i]);
                // youTubeWrapper.html(video);
                // console.log(youTubeWrapper);
                $("#youtubebox").prepend(youTubeWrapper);
            }
            initSlick("#youtubebox");
        });
    }
    //..............................................................................
// Check to see if user has signed up:
    if (localStorage.getItem('wordCloudUser')){
        console.log('user exists');
        userName = localStorage.getItem('wordCloudUser');
        console.log(userName);
        $('#username-field').hide();
        $('#username').addClass('known');
        $('#username').val(userName);
    } else {
        console.log('user not found');
    }

    //.........................................................function for submit button.............................
    $(document).on("click","#submit",function(event){
        event.preventDefault();
      
        


        userName = $('#username').val().trim()  ;
        console.log($('#username').val().trim());
        if (!$('#username').hasClass('known')){
            userName = $('#username').val().trim();
        }
        localStorage.setItem('wordCloudUser',userName);
        queryWord = $("#searchTerm").val().trim();
        queryOption = $("#wordOption").find('option:selected').data("value");

        valid = validateInput(queryWord);

        if (valid === true){
            queryURL = "https://wordsapiv1.p.mashape.com/words/"+ queryWord + "/" + queryOption ;        
            $.ajax({
                url : queryURL,
                method : "GET",
                headers : {"X-Mashape-Key":apiKey},
                statusCode : {
                    404: function(){
                        showModal('Sorry, there were no search results for that word');
                    }
                }
            }).done(function(response){
            // console.log(results);
            // assign the array of words to a variable.
            if(queryOption === "rhymes"){
                // words for rhymes option has a neseted  object as all
                results = response[queryOption].all;  
                // console.log(results);
                wordCloudify(results);   
                youTubify(returnRandomWord(results));         
            }
            else {
                console.log(response);
                results = response[queryOption];
                console.log(results.length);
                if (results.length == 0){
                    showModal('Sorry, there were no results for that word.');
                } else {
                    wordCloudify(results);
                    youTubify(returnRandomWord(results));
                }
                // console.log(returnRandomWord(results));
            }
        });
        setTimeout(function(){
            scrollTo('#youtubebox');
        }, 1000);
        valid = true
    };

    // .............................................................................................................
    $(document).on('click','.youtube',function(){
        var iframe = $('<iframe>');
        var source = "https://www.youtube.com/embed/"+ $(this).attr('data-id') +"?rel=0&showinfo=0&autoplay=1";
        iframe.attr('src',source);
        $(this).html('');
        $(this).append(iframe);
    });

    // ...................................................................................................................

    function validateInput(inputTerm){
        // This function will validat   e the search term field for following conditions
        
        //Check if serch term is null
        
        var allowedLetters = /^[A-Za-z\s]+$/;
        var inputValid = allowedLetters.test(inputTerm);
        var multipleWords = inputTerm.indexOf(" ");

       

        // debugger;
        try{
            if (inputTerm === "") throw ("Seach word cannot be empty");
               
            if (inputValid === false) throw ("Alphabet characters only");
            
            if (multipleWords >0 ) throw ("Please enter a single word");
        } 
        catch(err) {
            // alert(err);
          
            // $("#errMessage").text(err);
            showModal(err);
            // console.log($("#errMessage").text());
            // alertMessageWrapper.prepend(errMessage);
            // alertModal.show();
            // valid = false;

               
            // $("#sumbit").data("target","#myModal");
        }

        return valid;
    }
// .............................................................................................................

    $(document).on("click",'.btnClose',function(){
        alertModal.hide();
        valid = true;
        $('#searchTerm').val('');
        $('#searchTerm').focus();
    });

});
});
