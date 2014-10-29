/**
 * Background script responsible for injecting settings into
 * the content script.
 * 
 * @author Pawel Szczurko
 */

chrome.browserAction.onClicked.addListener(function(tab) { 
	chrome.storage.sync.get({
		random_data: true,
		mix_cases: false,
	    test_case: 1
	}, function(items) {
		var injectCode = 'var RETRIEVED_CASE_NUMBER ='+ (items.test_case - 1) +';';
		injectCode = injectCode + ' var MIX_CASES='+ items.mix_cases +';';
		injectCode = injectCode + ' var RANDOM_DATA='+ items.random_data +';';
		chrome.tabs.executeScript(tab.id, {
		    code: injectCode
		}, function() {
		    chrome.tabs.executeScript(tab.id, {file: 'content.js'});
		});    
	});
});