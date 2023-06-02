// When the popup HTML has loaded
window.onload = function() {
  // Get the stored URL
  chrome.storage.sync.get(['url'], function(result) {
    if (result.url) {
      // If there is a stored URL, set it as the input's value
      document.getElementById('url').value = result.url;
    }
  });
};

document.getElementById('save').onclick = function() {
  var url = document.getElementById('url').value;
  chrome.storage.sync.set({'url': url}, function() {
    // Create new element
    var message = document.getElementById('saved');
    message.classList.add("visible")
    // Remove the message after 3 seconds
    setTimeout(function() {
      message.classList.remove("visible");
    }, 1500);
  });
};
