// content-script.js
"use strict";

function getSelectionText() {
    var text = "";
    if (window.getSelection) {
        text = window.getSelection().toString();
    } else if (document.selection && document.selection.type !== "Control") {
        text = document.selection.createRange().text;
    }
    return text;
}

function iterateSelector(i) {
    if(i < options.length-1){
        return i+1;
    } else {
        return 0;
    }
}


browser.runtime.onMessage.addListener(request => {
    if (request['message'] === "click") {
        visible_box = visible_box === false;
        toggleTextBox(box, visible_box);
    } else if (request['message'] === "command") {
        if (visible_box === true) {
            const text = getSelectionText();
            if (text) {
                updateBoxContent(box, {0:"", 1:"", 2:""});
                toggleLoading(box, spinner, true)
                browser.runtime.sendMessage({"content": text}).then(
                    function(result) {
                        console.log(JSON.stringify(result));
                        toggleLoading(box, spinner, false)
                        updateBoxContent(box, result);
                    },
                    function (e) {
                        toggleLoading(box, spinner, false)
                        updateBoxContent(box, e, true)
                    }
                );
            } else {
                updateBoxContent(box, "hotkey was pressed without highlighted text", true)
            }
        } else {
            console.log("command pressed but not valid.")
        }
    }
});

var selection = 0;
var CURRENT_RESULT = {0:"", 1:"", 2:""};
var options = [0, 1, 2];
var visible_box = false;
var spinner = createSpinner();
var box = createTextBox(spinner);