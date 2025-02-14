chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get(['url'], function (result) {
    if (!result.url) {
      chrome.storage.sync.set({url: null});
    }
  });
});
