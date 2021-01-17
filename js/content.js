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

function createTextBox(loading_elm) {
    var height = '50px';
    var button_width = '50px';
    var box = document.createElement('div');
    box.style.position = 'fixed';
    box.style.bottom = '100px';
    box.style.left = '30px';
    box.style.width = '90%';
    box.style.height = height;
    box.style.opacity = '0.80';
    box.style.zIndex = '99999';

    var area = document.createElement('textarea');
    area.style.position = 'absolute';
    area.style.width = '95%';
    area.style.height = height;
    area.style.left = '0px';
    area.style.background = 'lightblue';
    area.style.opacity = 'parent';
    area.readOnly = true;

    var button = document.createElement('button');
    button.id = 'button';
    button.style.position = 'absolute';
    button.style.height = height;
    button.style.width = button_width;
    button.style.color = 'black';
    button.style.opacity = 'parent';
    button.style.right = '20px';

    button.onclick =function () {
        console.log(selection);
        selection = iterateSelector(selection);
        if (visible_box === true) {
            updateBoxContent(box);
        }
    };

    box.appendChild(area);
    box.appendChild(button);
    box.appendChild(loading_elm);
    return box;
}

function createSpinner() {
    const height = "20px"
    const width = "20px"
    var spinner = document.createElement('div');
    spinner.style.border = "16px solid #f3f3f3";
    spinner.style.position = 'absolute';
    spinner.style.height = height;
    spinner.style.width = width;
    spinner.style.borderTop = "16px solid #3498db";
    spinner.style.borderRadius = "50%";
    spinner.animate([
        {transform: 'rotate(0deg)'},
        {transform: 'rotate(360deg)'}
    ], {duration: 1000, iterations: Infinity});
    spinner.style.visibility = "hidden";
    return spinner
}

function toggleTextBox(box, status) {
    if (status === false) {
        document.body.removeChild(box);
    } else {
        document.body.appendChild(box);
    }
}

function toggleLoading(box, spinner, status) {
    if (status === false) {
        spinner.style.visibility = "hidden";
    } else {
        spinner.style.visibility = "visible";
    }
}


function updateBoxContent(box, value, err) {
    if(err == null) {
        if (value != null) {
            CURRENT_RESULT = value;
        }
        box.children[0].innerText = CURRENT_RESULT[selection];
    } else {
        box.children[0].innerText = JSON.stringify(value);
    }
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