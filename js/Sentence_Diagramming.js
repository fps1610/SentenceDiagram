function hideSelectShowBoard() {
  //function created to handle the page update
  clearInterval(interval); // clears the time interval set by the function interval
  $(".classButtons, .selectList").remove(); //removes the elments with the classes  "classButtons" &"selectList"
  $(".labelBoard, #UIhelper").hide(); //removes the elments with the class  "labelBoard" & id "UIhelper"
  $("#Diagramming_Tool").show(); //shows the elemnt with id "Diagramming_Tool"
  $("#Diagramming_Tool").addClass("active"); // adds the class "active" to the element id "Diagramming_Tool"
  $(".hide").addClass("tip"); //adds the class "tip" to the elements with the class "hide"
  $(".draggable").appendTo("#board"); // all elements with the clas ""draggable" are appended to the element with the id board"
  $(".draggable").addClass("inside"); //adds the class "inside" to all elements with the class "draggable"
  $(".boardTitle>h2").text("Sentence Diagramming"); // changes the text of the h2 on the boardTitle element
  $(".instructions").text("Brilliant! Now let's diagram:"); // changes the text on the element with the class "instructions"
  $(".draggable").draggable({
    containment: "#board", //limits the position movement of elements with the class "draggable" to the area of the element with id "board"
    scroll: false,
    revert: "valid",
    drag: function () {
      $(".tipBoard").remove(); // removes the element with the class "tipBoard"once the any element is dragged
    },
  });
  $(".draggable").click(handleWordSelection); // once an element with the class ""draggable" is clicked it invokes a function

  $(".lines_bg").draggable({
    //uses jqury ui draggable to allow the elements with the class "lines_bg" to be dragged
    scroll: false, // does not allow element to be scrolled
    helper: "clone", // uses the helper to clone the elements
  });
  $("#board").droppable({
    //uses jqury ui droppable for enabling  elments to be dropped into the element with id "board"
    accept: ".lines_bg", // accepts elements with the class "lines_bg"
    drop: function (event, ui) {
      // function when elements are dropped
      var droppable = $(this); //var to hold the value of the  droppable element , the "board"
      var draggable = ui.draggable; // var to hold the info about the elelement being dragged
      $(".tipBoard").remove(); // removes the element wih the id "tipBoard" when drop occurs

      if (!draggable.hasClass("inside")) {
        // if the draggable element does not have the class inside
        let clonedItem = draggable.clone(); // it will be cloned
        clonedItem
          .appendTo(droppable) // the cloned element will be appendable to the droppable
          .addClass("inside") // the class "inside" will be added to prevent from further cloning
          .click(handleLineSelection) // once this element is clicked it calls the function "handleLineSelection"
          .draggable({ containment: "#board", scroll: false }); // limits the position movement of elements with the class "draggable" to the area of the element with id "board"

        if (clonedItem.hasClass("resize")) {
          // if the clonned item has the class "resize"
          clonedItem.addClass("oneThird"); // adds the class "onethird"
        }
      }
    },
  });

  function handleLineSelection(e) {
    e.preventDefault();
    var objSelected = $(this);
    objSelected.addClass("selected"); //add class "selected"to element that highlights it
    return false;
  }

  // when user clicks on a word, the word clicked gets a css style to highlight that it is selected

  function handleWordSelection(a) {
    a.preventDefault();
    var wordSelected = $(this);
    wordSelected.filter(".word").addClass("selected"); //add class "selected"to element that highlights it
    if (wordSelected.hasClass("selected")) {
      wordSelected.filter(".hide").addClass("noTransparency"); //add class "noTransparency "to element with class "hide" that avoid transparency it
    }

    return false;
  }

  // handles the desselection of elements when click is outside

  $("html").click(function (e) {
    //once any html is clicked
    var objSelected = $(".selected"); //the elments with the class "selected"
    objSelected.removeClass("selected"); // will have the class removed
  });
}

// Delete selected items on the board, lines only for preventing missing any words

function deleteSelected() {
  var lineSelected = $(".selected"); //var hold value of elemnts with the class "selected"
  if (lineSelected.hasClass("lines_bg")) {
    // if the element has also the clas ""lines_bg"

    lineSelected.remove(); //this element is removed
  }
}

function clearBoard() {
  //triggered once button clicked on html
  location.reload(); // it reloads the page to its initial state
}

// function triggered when user has selected an element on the board (it will be highlighted) and clicks on the "Rotate Word" Button

function rotateElement() {
  let selectedElements = $(".selected"); // var to holds info of what elements have the "selected" class active
  let onlyLines = selectedElements.filter(".lines_bg"); // filter elements with the class "lines_bg" only
  let onlyWords = selectedElements.filter(".word"); // filters elements with the class "word"only

  if (onlyWords.hasClass("rotate")) {
    // if onlywords have teh class rotate the class gets removed to avoid words rotating more than 45 degrees
    onlyWords.removeClass("rotate");
  } else {
    onlyWords.addClass("rotate");
  }

  /// handle line rotations, reference taken from https://css-tricks.com/get-value-of-css-rotation-through-javascript/

  onlyLines.each(function () {
    //selects each element of the onlylines selection
    let matrix = $(this).css("transform"); //transform the css

    if (matrix != "none") {
      var values = matrix.split("(")[1],
        values = values.split(")")[0],
        values = values.split(",");

      var a = values[0]; // 0.866025
      var b = values[1]; // 0.5
      var c = values[2]; // -0.5
      var d = values[3];
      var scale = Math.sqrt(a * a + b * b);

      // arc sin, convert from radians to degrees, round
      var sin = b / scale;
      // next line works for 30deg but not 130deg (returns 50);
      // var angle = Math.round(Math.asin(sin) * (180/Math.PI));
      var angle = Math.round(Math.atan2(b, a) * (180 / Math.PI));

      $(this).css("transform", `rotate(${angle + 45}deg)`);
    } else {
      $(this).addClass("rotate");
    }
  });
}

//Save Board As png function reference from  //https://jsfiddle.net/user2314737/z437nxaq/

$(function () {
  $("#btnSave").click(function () {
    // once element with id "btnSave" is clicked
    html2canvas(document.querySelector("#board"), {
      //the library html to canvas selects the element with id "board" and convert it to an image
      logging: true,
      letterRendering: 1,
      allowTaint: false,
      useCORS: true,
      onrendered: function (canvas) {
        canvas.toBlob(function (blob) {
          saveAs(blob, "My_Diagram.png"); // downloads the element as a png
        });
      },
    });
  });
});
