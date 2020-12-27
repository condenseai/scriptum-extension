// content-script.js
"use strict";

function onError(error) {
    console.error(`Error: ${error}`);
}


function getSelectionText() {
    var text = "";
    if (window.getSelection) {
        text = window.getSelection().toString();
    } else if (document.selection && document.selection.type !== "Control") {
        text = document.selection.createRange().text;
    }
    return text;
}

function createTextBox(){
    var box = document.createElement('div');
    box.style.position = 'fixed';
    box.style.top = '100px';
    box.style.right = '10px';
    box.style.width = '200px';
    box.style.height = '100px';
    box.style.color = 'black';
    box.style.background = 'lightblue';
    box.style.padding = '20px';
    box.innerText = 'Hello world';
    // document.body.appendChild(box);
    return box;
}

function toggleTextBox(box, status){
    if(status === false){
        document.body.removeChild(box);
    } else {
        document.body.appendChild(box);
    }
}

function updateBoxContent(box, payload){
    var l = payload['response'];
    console.log(l);
    box.innerText = l;
}




browser.runtime.onMessage.addListener(request => {
    if(request['message'] === "click"){
        status = status === false;
        toggleTextBox(box, status);
    } else if(request['message'] === "command") {
        if(status === true){
            var text = getSelectionText();
            if(text) {
                console.log("selected: " + text);
                var sending = browser.runtime.sendMessage({"payload": text});

                sending.then((payload => {
                    updateBoxContent(box, payload);
                }), onError)
            } else {
                console.log("hotkey was pressed without highlighted text")
            }
        } else {
            console.log("command pressed but not valid.")
        }
    }});

var status = false;
var box = createTextBox();