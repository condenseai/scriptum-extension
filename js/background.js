"use strict";

function onError(error) {
    console.error(`Error: ${error}`);
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

browser.runtime.onMessage.addListener((request) => {
    console.log(request['payload']);
    return Promise.resolve({"response": "hey from background"});
});