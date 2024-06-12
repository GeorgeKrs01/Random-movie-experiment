function fetchMovieData() {
  const apiKey = "";
  const movieIds = getRandomInt(2000); // Example movie ID
  const url = `https://api.themoviedb.org/3/movie/${movieIds}?api_key=${apiKey}`;

  fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }
      return response.json();
    })
    .then((data) => {
      console.log(data);
      let title = data.title;
      let poster_path = data.poster_path;
      let description = data.tagline;
      let genres = data.genres;
      let languages = data.spoken_languages;
      let popularity = data.popularity;
      let votes = data.vote_average;
      let date = data.release_date;
      console.log(genres);
      console.log("Title: " + title);
      console.log("Date: " + date);
      console.log("Poster: " + poster_path);
      console.log(languages);
      console.log("Popularity: " + popularity);
      console.log("Votes: " + votes);

      // Update image URLs in the cards
      const cardImages = document.querySelectorAll(".card-img-top");
      cardImages.forEach((img) => {
        img.src = `https://image.tmdb.org/t/p/w500/${poster_path}`;
        img.alt = title + " Poster";
      });

      // Update titles in the cards
      const cardTitles = document.querySelectorAll(".card-title");
      cardTitles.forEach((titleElement) => {
        titleElement.textContent = title;
      });
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
    });

  function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

  console.log(getRandomInt(2000));
}
