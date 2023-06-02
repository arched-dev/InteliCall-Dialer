let api_endpoint_url = null;

chrome.storage.sync.get(['url'], function (result) {
    if (result.url) {
        api_endpoint_url = result.url;
        change_links();
    } else {
        add_warning();
    }
});

// Function to create a warning
function add_warning() {
    let toastHTML = document.createElement('div');
    toastHTML.className = 'toast-intelicall';
    toastHTML.innerHTML = '<span>No phone API reference added to your <strong>InteliCall</strong> chrome extension, without this you cannot click to dial... Please add to the extension and refresh the page.</span>' +
        '<button class="toast-close" style="position: absolute; top: 5px; right: 5px;">X</button>';
    document.body.appendChild(toastHTML);

    // Get the close button
    let closeButton = toastHTML.querySelector('.toast-close');

    // Add click event listener to the close button
    closeButton.addEventListener('click', function() {
        toastHTML.classList.remove('showme');
    });

    setTimeout(() => {
        toastHTML.classList.add('showme');
    }, 500);
}

function change_links() {
    let links_updated = 0
    let links = document.querySelectorAll('a[href^="tel:"]');
    if (links.length > 0 && api_endpoint_url) {
        links.forEach(link => {
            if (!link.hasAttribute("data-inteli")) {
                link.setAttribute("data-inteli", "");
                links_updated++
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    let tel = link.getAttribute('href').substring(4);
                    let newUrl = `https://${api_endpoint_url}${tel}`;
                    fetch(newUrl, {method: 'GET'})
                        .catch(error => console.error('Error:', error));
                });
            }
        });
    }
    return links_updated
}


const observer = new MutationObserver(function (mutationsList) {
    for (let mutation of mutationsList) {
        if (mutation.type === 'childList') {
            for (let node of mutation.addedNodes) {
                if (node.nodeName.toLowerCase() === 'a') {
                    change_links().then(() => {
                        console.log("updated links.")
                    });
                }
            }
        }
    }
});

window.addEventListener("load", () => {
    change_links()
})

const config = {
    attributes: false,
    childList: true,
    subtree: true
};

observer.observe(document, config);
