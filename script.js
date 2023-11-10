// data needs to be fetch
var query = `
query ($genre: String) {
  Page {
    media (type: ANIME, genre: $genre) {
      id
      title {
        english
      }
      coverImage {
        large
      }
    }
  }
}
`;

function getRecommendations() {
const genrePreference = document.getElementById("genre").value;
const recommendations = document.getElementById("recommendations");

// Clearing the previous recommendations
recommendations.innerHTML = "";

//display loader while fetching data
loader.style.display = "block";

var variables = {
  genre: genrePreference,
};

// GraphQL API request configuration  (provided by anilist api)
var url = "https://graphql.anilist.co";
var options = {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  body: JSON.stringify({
    query: query,
    variables: variables,
  }),
};

//GraphQL API request
fetch(url, options).then(handleResponse).then(handleData).catch(handleError).finally(() => {
  // Hide the loader when data fetching is done
  loader.style.display = "none";
});;
}

//handleResponse function
function handleResponse(response) {
return response.json().then(function (json) {
  return response.ok ? json : Promise.reject(json);
});
}

function handleData(data) {
console.log(data);
const recommendations = document.getElementById("recommendations");
recommendations.innerHTML = "";


// Display recommendations
data.data.Page.media.forEach((anime) => {
  const li = document.createElement("li");
  const img = document.createElement("img");
  img.src = anime.coverImage.large;
  img.alt = `${anime.title.romaji} Poster`;
  

  const title = document.createElement("div");
  title.textContent = `${anime.title.english}`;
  title.style.color = "yellow";
  title.style.fontSize = "bold";
  title.style.fontFamily = "sans-serif";
  title.style.textAlign = "center";
  title.style.padding = "10px";
  title.style.margin = "10px";
  title.style.marginLeft = "auto";
  title.style.marginRight = "auto";

    li.appendChild(img);
    li.appendChild(title);
    li.addEventListener('click' , () => {
      window.location.href = `summary.html?id=${anime.id}`;
    })

  recommendations.appendChild(li);
});
}

function handleError(err) {
// handle error if any
alert("An error has occured");
console.log(err);
}

window.onload = getRecommendations;