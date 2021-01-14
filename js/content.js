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

function createTextBox() {
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
    // document.body.appendChild(box);
    return box;
}

function toggleTextBox(box, status) {
    if (status === false) {
        document.body.removeChild(box);
    } else {
        document.body.appendChild(box);
    }
}

function updateBoxContent(box, value) {
    if (value != null){
        CURRENT_RESULT = value;
    }
    box.children[0].innerText = CURRENT_RESULT[selection];
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
                console.log("selected: " + text);
                updateBoxContent(box, {0:"", 1:"", 2:""});
                browser.runtime.sendMessage({"content": text}).then(
                    function(result) {
                        console.log(JSON.stringify(result));
                        // result = Object.values(result);
                        updateBoxContent(box, result);
                    },
                    function (e) {console.err(e)}
                );
            } else {
                console.log("hotkey was pressed without highlighted text")
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
var box = createTextBox();
