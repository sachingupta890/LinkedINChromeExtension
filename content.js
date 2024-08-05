function executeScraping(searchQuery) {
  if (!searchQuery) {
    alert("No search query provided.");
    return;
  }

  // Navigate to the LinkedIn search page for the given query
  let url = `https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(
    searchQuery
  )}`;
  window.location.href = url;

  window.onload = function () {
    const data = [];
    const desiredUserCount = 40;
    let userCount = 0;

    function scrapePage() {
      const results = document.querySelectorAll(
        ".reusable-search__result-container"
      );

      results.forEach((result) => {
        if (userCount >= desiredUserCount) return;

        // Adjusted selectors based on the provided structure
        const nameElement = result.querySelector(
          ".entity-result__title-text a span[aria-hidden='true']"
        );
        const titleElement = result.querySelector(
          ".entity-result__primary-subtitle"
        );
        const locationElement = result.querySelector(
          ".entity-result__secondary-subtitle"
        );

        const name = nameElement ? nameElement.innerText : null;
        const title = titleElement ? titleElement.innerText : null;
        const location = locationElement ? locationElement.innerText : null;

        if (name && title && location) {
          data.push({ name, title, location });
          userCount++;
        }
      });

      // Scroll down and load more results if available
      window.scrollTo(0, document.body.scrollHeight);
      setTimeout(() => {
        const nextButton = document.querySelector(
          "button.artdeco-pagination__button--next"
        );
        if (nextButton && userCount < desiredUserCount) {
          nextButton.click();
          setTimeout(scrapePage, 2000); // Wait for the new page to load
        } else {
          exportCSV(data);
        }
      }, 2000);
    }

    // Start scraping the page after load
    scrapePage();
  };
}

function exportCSV(data) {
  if (data.length === 0) {
    alert("No data found to export.");
    return;
  }

  const csvRows = [];
  const headers = ["Name", "Title", "Location"];
  csvRows.push(headers.join(","));

  data.forEach((row) => {
    csvRows.push([row.name, row.title, row.location].join(","));
  });

  const csvString = csvRows.join("\n");
  const blob = new Blob([csvString], { type: "text/csv" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "linkedin_users.csv";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  URL.revokeObjectURL(url);

  alert("CSV file has been downloaded successfully.");
}
