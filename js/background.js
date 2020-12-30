"use strict";

function onError(error) {
    console.error("error: " + error);
}

function sendMessageToTabs(tabs, message) {
    for (let tab of tabs) {
        browser.tabs.sendMessage(
            tab.id,
            message
        ).then(() => {
        }).catch(onError);
    }
}

browser.browserAction.onClicked.addListener(() => {
    browser.tabs.query({
        currentWindow: true,
        active: true
    }).then(function(tabs) {
        sendMessageToTabs(tabs, {"message":"click"})
    }).catch(onError);
});

browser.commands.onCommand.addListener(function(command) {
    if(command ==="generate") {
        browser.tabs.query({
            currentWindow: true,
            active: true
        }).then(function(tabs) {
            sendMessageToTabs(tabs, {"message":"command"})
        }).catch(onError);
    }
});

browser.runtime.onMessage.addListener(function(request) {
    console.log(request['payload']);
    return new Promise((resolve, reject) => {
        $.ajax({
            type: 'POST',
            url: 'http://localhost:5000/',
            data: JSON.stringify(request),
            contentType: "application/json",
            dataType: "json",
            success: (data) => resolve(data),
            error: (error) => reject(error)
        });
    });
});