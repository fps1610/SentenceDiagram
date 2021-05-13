let interval = null; // interval for checking if all words are coloured set to null

$(document).ready(function () {
  // this function is called when document is loaded on browser
  $("#UIhelper").hide(); // hides the div with id UI Helper

  var timesViewed = localStorage.getItem("timesViewed"); //check cookies to check if this page has been viewd before
  if (timesViewed == null) {
    //in case the times video == null or 0
    localStorage.setItem("timesViewed", 1);

    // Show popup with wecoming information here, it won't be displayed on next visits
    $(".popupWrap").show();
  }
});

function howtolabel(button) {
  // handles the page navigation when button howtolabel is pressed
  closePopup();
  $(".activeMenu").removeClass("activeMenu");
  $(".How_to_Label").addClass("activeMenu");
  $(".active").removeClass("active");
  $($(button).attr("href")).addClass("active");
}
function howToDiagram(button) {
  // handles the page navigation when button hottodiagram is pressed
  closePopup();
  $(".activeMenu").removeClass("activeMenu");
  $(".How_to_Diagram").addClass("activeMenu");
  $(".active").removeClass("active");
  $($(button).attr("href")).addClass("active");
}

function closePopup() {
  //closes the welcoming popup whnever closesPopup is pressed
  $(".popupWrap").hide();
}

function buildPhrase(phrase) {
  //this function builds sentence that is selectded on the dropdown menu
  interval = setInterval(function () {
    //this function checks if all words have been coloured
    if ($(".coloured").length == $(".word").length) {
      //compares if the coloured words has same lenght as all the words in the sentenced
      hideSelectShowBoard(); // if number is the same, this function is called
    }
  }, 1000); // time set for function to  check arrays lenght every 1 second
  return phrase.map(function (word) {
    //returns with a map function separates the words in the sentence and creates buttons below the words with their correspondent functions & colours
    return `<span class="draggable word" data-colour="${word.colour}" data-word="${word.type}">  
        ${word.value}     <span style="background-color : ${word.colour} "class="hide">${word.type}</span>
        </span>`; // here all the values(type, colour and value) are extracted from the "JSON" object sentences and colour are extracted from
  });
}

function shuffle(arra1) {
  //this function shuffles the buttons positions to increase the challenge, otherwise each word and button would have the same position
  // this code is a refference from:  https://www.w3resource.com/javascript-exercises/javascript-array-exercise-17.php
  var ctr = arra1.length,
    temp,
    index;

  // While there are elements in the array
  while (ctr > 0) {
    // Pick a random index
    index = Math.floor(Math.random() * ctr);
    // Decrease ctr by 1
    ctr--;
    // And swap the last element with it
    temp = arra1[ctr];
    arra1[ctr] = arra1[index];
    arra1[index] = temp;
  }
  return arra1;
}

function buildClassificationButtons(phrase) {
  return shuffle(phrase).map(function (word) {
    return `
    <span class="classButtons" data-word="${word.type}" style="background-color: ${word.colour}">  
        ${word.type}     
        </span>`;
  });
}

// nested map function that selects first the array and then merge the words that are in the value key
let writeAll = //function that writes all sentences and builds the options on the select dropdown menu
  ["<option>Select here:</option>"] + // The first value is a tip to where to select the sentence
  sentences.all.map(function (phrase, index) {
    // map that selects and separate each array (each sentence)
    return `<option class="draggable" value="${index}">  
            ${phrase
              .map(function (word) {
                //map that selects each word in each object of the sentence and returns them all separating them with a backspace
                return `${word.value}`;
              })
              .join(" ")} 
  
          </option>`;
  });

$(function () {
  //creates selection dropdpwn menu with sentences
  $("#selectBox").html(
    `<div class="selectList"><select id="dropDownSelect">${writeAll}</select></div>`
  );
  // creates the spans elements inside the board div area

  $("#dropDownSelect").change(function () {
    //function that handles the sentence selection
    var selectedNo = $("#dropDownSelect").children("option:selected").val(); //var holding the order number corresponding to the selected sentence

    $("#sentenceArea").html(buildPhrase(sentences.all[selectedNo])); //calls the function to build the sentence based on the index number of the sentence selected and attaches it to the div with the id #sentenceArea
    $("#buttonsArea").html(
      buildClassificationButtons(sentences.all[selectedNo])
    ); //calls the function to build the label buttons based on the index number of the sentence selected and attaches it to the div with the id #buttonsArea
    $("#UIhelper, .labelBoard, .boardTitle").show(); // displays some help text, the board for labeling and the title

    $(".draggable").draggable({ revert: "invalid" }); //uses jqury ui draggable for enabling the drag funcionality for the  words through selecting elements with the class "draggable"
    $(function () {
      $(".classButtons").droppable({
        //uses jqury ui droppable for enabling draggable elments to be dropped into buttons through selecting elements with the class "classButtons"
        accept: function (d) {
          return d.data("word") == $(this).data("word"); //it only accespts words that have the same type(grammatical label) through checking it via the "data-word" attribute
        },
        drop: function (_, ui) {
          //when word is dropped and accepted
          var colourId = $(ui.draggable).data("colour"); // creats a var to hold the colour value of the dropped element
          $(ui.draggable).css("color", colourId); //changes the word colour for the colour value held in the var
          $(ui.draggable).draggable({ revert: "valid" }); // changes revert position to valid
          $(ui.draggable).addClass("coloured"); // this class is added to the word so, when all have being coloures the pages refreshes
          // if ($(":has(#draggable")) {
          //   draggable.draggable({ revert: "invalid" });
          // }
        },
      });
    });
  });
  // make each span dragable and contain its movement withing the board div
  // https://jqueryui.com/draggable/#constrain-movement
});

// https://jqueryui.com/droppable/
