// Copyright (c) 2011 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// Called when the user clicks on the browser action.
chrome.browserAction.onClicked.addListener(function(tab) {
  chrome.tabs.executeScript(
	  null, {code:"console.log('heythere'); document.body.style.background='red'"});
});

//chrome.tabs.onUpdatedaddListener(function(integer tabId, object changeInfo, Tab tab) {...});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo) {
//    if (changeInfo.status === 'complete') {
/*        chrome.tabs.executeScript(tabId, {
            code: ' if (document.body.innerText.indexOf("Cat") !=-1) {' +
                  '     alert("Cat not found!");' +
                  ' }' + 
				  'else {' +
				  '     alert("Cat found!");' + 
				  ' }'
        }); */
		chrome.tabs.executeScript(tabId, { file : "pageScript.js" });
 //   }
});

console.log("HEEERE");
