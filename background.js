chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "checkLinkedInPage") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      if (tab && tab.url && tab.url.startsWith("https://www.linkedin.com")) {
        sendResponse({ isLinkedInPage: true });
      } else {
        sendResponse({ isLinkedInPage: false });
      }
    });
    return true; // Indicates that the response is sent asynchronously
  } else if (message.action === "startScraping") {
    if (message.searchQuery) {
      fetch("http://localhost:3000/scrape", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ searchQuery: message.searchQuery }),
      })
        .then((response) => response.json())
        .then((data) => {
          chrome.storage.local.set({ scrapedData: data }, () => {
            sendResponse({ success: true });
          });
        })
        .catch((error) => {
          console.error("Error:", error);
          sendResponse({ error: "Failed to start scraping" });
        });
    } else {
      sendResponse({ error: "Search query missing in startScraping message." });
    }
    return true; // Indicates that the response is sent asynchronously
  }
});
