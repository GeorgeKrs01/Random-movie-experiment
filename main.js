document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("fetchButton");
  // .addEventListener("click", fetchMovieData);
  document
    .getElementById("saveButton")
    .addEventListener("click", saveFailedIdsToFile);
});

function fetchMovieData() {
  const apiKey = "1bf593f34376b412e19619f40b226759";

  // Generate three different random movie IDs
  const movieIds = [getRandomInt(2000), getRandomInt(2000), getRandomInt(2000)];
  console.log(movieIds);
  // Define the URLs for the API calls
  const urls = movieIds.map(
    (id) => `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}`
  );

  let failedIds = [];

  // Fetch data for each URL
  Promise.all(
    urls.map((url, index) =>
      fetchWithRetry(url, index)
        .then((response) => {
          if (!response.ok) {
            failedIds.push(movieIds[index]);
            throw new Error(
              "Network response was not ok " + response.statusText
            );
          }
          return response.json();
        })
        .catch((error) => {
          console.error("There was a problem with the fetch operation:", error);
          failedIds.push(movieIds[index]);
          return null; // Return null to continue Promise.all
        })
    )
  )
    .then((dataArray) => {
      dataArray.forEach((data, index) => {
        if (data) {
          let title = data.title;
          let poster_path = data.poster_path;
          let description = data.tagline;
          let votes = data.vote_average;
          let date = data.release_date;
          let year = date.substring(0, 4);

          // Update the respective card with fetched data
          const card = document.querySelector(`#card${index + 1}`);
          if (card) {
            card.querySelector(
              ".card-img-top"
            ).src = `https://image.tmdb.org/t/p/w500/${poster_path}`;
            card.querySelector(".card-img-top").alt = title + " Poster";
            card.querySelector(".card-title").textContent = title;
            card.querySelector(".card-text").textContent = description;
            card.querySelector(".card-text-year").textContent = "Year: " + year;
            card.querySelector(".card-votes").textContent =
              "Average Rating: " + votes.toFixed(1) + " / 10";
            card.querySelector(".btn").textContent = "Search it";

            // Update the href of the anchor tag to perform a Google search
            const anchor = card.querySelector(".btn");
            if (anchor) {
              anchor.href = `https://www.google.com/search?q=${encodeURIComponent(
                title + " " + year
              )}`;
            }
          }
        }
      });

      // Store failed IDs in local storage
      if (failedIds.length > 0) {
        const existingFailedIds =
          JSON.parse(localStorage.getItem("failedIds")) || [];
        localStorage.setItem(
          "failedIds",
          JSON.stringify([...existingFailedIds, ...failedIds])
        );
      }
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
    });

  function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }
}

function fetchWithRetry(url, index, retries = 3) {
  return fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
        fetchMovieData();
      }
      return response;
    })
    .catch((error) => {
      console.error(`Fetch error for index ${index}:`, error);
      if (retries > 0) {
        console.log(`Retrying... (${3 - retries + 1}/3)`);
        const newUrl = `https://api.themoviedb.org/3/movie/${getRandomInt(
          2000
        )}?api_key=1bf593f34376b412e19619f40b226759`;
        return fetchWithRetry(newUrl, index, retries - 1);
      } else {
        return null; // Return null if all retries fail
      }
    });
}

function saveFailedIdsToFile() {
  const failedIds = JSON.parse(localStorage.getItem("failedIds")) || [];
  if (failedIds.length === 0) {
    console.log("No failed IDs to save.");
    return;
  }

  const blob = new Blob([JSON.stringify(failedIds, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "failedIds.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  console.log("Failed IDs saved to failedIds.json");
}
