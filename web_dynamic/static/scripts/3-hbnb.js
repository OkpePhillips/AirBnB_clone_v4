$(document).ready(function () {
  let amenityIds = {}; // This will store the Amenity IDs

  $('input[type="checkbox"]').on("change", function () {
    let amenityId = $(this).data("id");
    let amenityName = $(this).data("name");

    if ($(this).is(":checked")) {
      // If the checkbox is checked, add the Amenity ID to the dictionary
      amenityIds[amenityId] = amenityName;
    } else {
      // If the checkbox is unchecked, remove the Amenity ID from the dictionary
      delete amenityIds[amenityId];
    }

    // Update the h4 tag with the list of checked amenities
    let amenitiesList = Object.values(amenityIds).join(", ");
    $(".amenities h4").text(amenitiesList);
  });
  function checkApiStatus() {
    $.get("http://0.0.0.0:5001/api/v1/status/", function (data) {
      if (data.status === "OK") {
        $("#api_status").addClass("available");
      } else {
        $("#api_status").removeClass("available");
      }
    });
  }
  checkApiStatus();
  setInterval(checkApiStatus, 5000);
  // Define the API endpoint
  let url = "http://0.0.0.0:5001/api/v1/places_search";

  // Define the request options
  let options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}),
  };

  // Send the request
  fetch(url, options)
    .then((response) => response.json())
    .then((data) => {
      // Get the places section
      let placesSection = document.querySelector(".places");

      // Loop through the places
      data.forEach((place) => {
        // Create an article for the place
        let article = document.createElement("article");

        // Add the place details to the article
        article.innerHTML = `
        <div class="title_box">
          <h2>${place.name}</h2>
          <div class="price_by_night">$${place.price_by_night}</div>
        </div>
        <div class="information">
          <div class="max_guest">
            ${place.max_guest} Guest${place.max_guest != 1 ? "s" : ""}
          </div>
          <div class="number_rooms">
            ${place.number_rooms} Bedroom${place.number_rooms != 1 ? "s" : ""}
          </div>
          <div class="number_bathrooms">
            ${place.number_bathrooms} Bathroom${
          place.number_bathrooms != 1 ? "s" : ""
        }
          </div>
        </div>
        <div class="description">${place.description}</div>
      `;

        // Append the article to the places section
        placesSection.appendChild(article);
      });
    })
    .catch((error) => console.error("Error:", error));
});

