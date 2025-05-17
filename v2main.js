function fetchMovieData() {
  const apiKey = "1bf593f34376b412e19619f40b226759";
  const errorIds = []; // Array to store IDs that give errors

  // Generate three different random movie IDs
  const movieIds = [getRandomInt(2000), getRandomInt(2000), getRandomInt(2000)];
  console.log(movieIds);
  // Define the URLs for the API calls
  const urls = movieIds.map(
    (id) => `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}`
  );

  // Fetch data for each URL
  Promise.all(
    urls.map((url, index) =>
      fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (!response.ok) {
            errorIds.push(movieIds[index]); // Store the ID that gave an error
            throw new Error(
              "Network response was not ok " + response.statusText
            );
          }
          return response.json();
        })
        .catch((error) => {
          console.error("There was a problem with the fetch operation:", error);
          // Retry fetching data if there was an error
          return fetch(url, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }).then((response) => {
            if (!response.ok) {
              errorIds.push(movieIds[index]); // Store the ID that gave an error
              throw new Error(
                "Network response was not ok " + response.statusText
              );
            }
            return response.json();
          });
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

          // Update the respective card with fetched data
          document.querySelector(
            `#card${index + 1} .card-img-top`
          ).src = `https://image.tmdb.org/t/p/w500/${poster_path}`;
          document.querySelector(`#card${index + 1} .card-img-top`).alt =
            title + " Poster";
          document.querySelector(`#card${index + 1} .card-title`).textContent =
            title;
          document.querySelector(`#card${index + 1} .card-text`).textContent =
            description;
          document.querySelector(`#card${index + 1} .card-votes`).textContent =
            "Average Rating: " + votes + " / 10";
        }
      });
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
      console.log("Error IDs:", errorIds); // Log the array of error IDs
    });

  function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }
}

// Call fetchMovieData on button click
document
  .getElementById("fetchButton")
  .addEventListener("click", fetchMovieData);
