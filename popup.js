document.getElementById("startScraping").addEventListener("click", function () {
  const searchQuery = document.getElementById("searchQuery").value;

  if (!searchQuery) {
    alert("Please enter a search query.");
    return;
  }

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length > 0) {
      chrome.runtime.sendMessage(
        { action: "checkLinkedInPage" },
        (response) => {
          if (response && response.isLinkedInPage) {
            chrome.runtime.sendMessage(
              { action: "startScraping", searchQuery: searchQuery },
              (response) => {
                if (response && response.error) {
                  alert(response.error);
                } else if (response && response.success) {
                  displayResults(response.data);
                } else {
                  alert("Unknown error occurred.");
                }
              }
            );
          } else {
            alert("This extension can only be used on LinkedIn pages.");
          }
        }
      );
    } else {
      alert("No active tab found.");
    }
  });
});

function displayResults(data) {
  const resultsDiv = document.createElement("div");
  resultsDiv.innerHTML = "<h4>Scraped Results:</h4>";

  if (Array.isArray(data) && data.length > 0) {
    data.forEach((item, index) => {
      const resultDiv = document.createElement("div");
      resultDiv.innerHTML = `<p>${index + 1}. ${item.name} - ${item.title} - ${
        item.location
      }</p>`;
      resultsDiv.appendChild(resultDiv);
    });
  } else {
    resultsDiv.innerHTML += "<p>No results found.</p>";
  }

  document.body.appendChild(resultsDiv);
}
