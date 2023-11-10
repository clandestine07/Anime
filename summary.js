var query = `
query ($id: Int) {
  Media (id: $id) {
    id
    title {
      english
    }
    description
    coverImage {
      large
    }
    averageScore
    characters {
      edges {
        node {
          name {
            full
          }
          image {
            large
          }
        }
      }
    }
  }
}
`;
document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const animeId = urlParams.get('id');
    fetchAnimeDetails(animeId);
});

function fetchAnimeDetails(animeId) {
    var variables = {
        id: parseInt(animeId),
    };

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

    fetch(url, options)
        .then(handleResponse)
        .then(handleAnimeDetails)
}

function handleResponse(response) {
    return response.json();
}

function handleAnimeDetails(data) {
    console.log(data);
    const animeDetailsContainer = document.getElementById("animeSummary");

    // Display anime title
    const title = document.createElement("h1");
    title.textContent = data.data.Media.title.english;
    title.style.color = "yellow";
    title.style.fontSize = "bold";
    title.style.fontFamily = "sans-serif";
    animeDetailsContainer.appendChild(title);

    // Display anime description
    const description = document.createElement("p");
    description.textContent = data.data.Media.description;
    description.style.backgroundColor = "peach"
    animeDetailsContainer.appendChild(description);

    // Display anime cover image
    const coverImage = document.createElement("img");
    coverImage.src = data.data.Media.coverImage.large;
    coverImage.alt = "Anime Cover Image";
    animeDetailsContainer.appendChild(coverImage);

    // Display the average rating
    const rating = document.createElement("div");
    rating.textContent = `Average Rating: ${data.data.Media.averageScore}`;
    rating.style.color = "#00def3";
    rating.style.marginTop = "10px";
    rating.style.textAlign = "center"; // Center the text
    animeDetailsContainer.appendChild(rating);

    const characterHeading = document.createElement("h1");
    characterHeading.textContent = "Characters";
    characterHeading.style.color = "yellow";
    characterHeading.style.fontSize = "bold";
    characterHeading.style.fontFamily = "sans-serif";
    characterHeading.style.textAlign = "center";
    characterHeading.style.padding = "10px";
    animeDetailsContainer.appendChild(characterHeading);

    // Display characters
    const charactersContainer = document.createElement("div");
    charactersContainer.className = "characters-container";
    
    data.data.Media.characters.edges.forEach((character) => {
        const characterDiv = document.createElement("div");
        characterDiv.className = "character";
      
        const characterImg = document.createElement("img");
        characterImg.src = character.node.image.large;
        characterImg.alt = `${character.node.name.full} Image`;
      
        const characterName = document.createElement("p");
        characterName.textContent = character.node.name.full;
      
        characterDiv.appendChild(characterImg);
        characterDiv.appendChild(characterName);
        charactersContainer.appendChild(characterDiv);
    });

    animeDetailsContainer.appendChild(charactersContainer);
}
