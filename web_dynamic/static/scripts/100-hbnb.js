$(document).ready(function () {
    let amenityIds = {}; // This will store the Amenity IDs
    let stateIds = {};
    let cityIds = {};

    $('.amenities input[type="checkbox"]').change(function () {
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

    function updateCheckedItems(element, stateIds, cityIds) {
      const itemId = element.data("id");
      const itemName = element.data("name");
    
      if (element.is(":checked")) {
        // Check if it's a state or city checkbox
        if (element.hasClass("statesList")) {
          // If the checkbox is checked, add the state ID to the stateIds dictionary
          stateIds[itemId] = itemName;
        } else if (element.hasClass("cityList")) {
          // If the checkbox is checked, add the city ID to the cityIds dictionary
          cityIds[itemId] = itemName;
        }
      } else {
        // If the checkbox is unchecked, remove the state or city ID from the respective dictionary
        if (stateIds[itemId]) {
          delete stateIds[itemId];
        } else if (cityIds[itemId]) {
          delete cityIds[itemId];
        }
      }
    
      // Merge both state and city items and update the h4 tag
      let mergedItems = Object.values({ ...stateIds, ...cityIds }).join(", ");
      $(".locations h4").text(mergedItems);
    }
    
    $('.statesList').change(function () {
      updateCheckedItems($(this), stateIds, cityIds);
    });
    
    $('.cityList').change(function () {
      updateCheckedItems($(this), stateIds, cityIds);
    });


    function loadPlaces(amenities = {}, stateIds = {}, citiesId = {}) {
      // Define the API endpoint
      let url = "http://0.0.0.0:5001/api/v1/places_search";
  
      // Define the request options
      let options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amenities: Object.keys(amenities), states: Object.keys(stateIds), cities: Object.keys(cityIds)}),
      };

      // Send the request
      fetch(url, options)
        .then((response) => response.json())
        .then((data) => {
          // Get the places section
          let placesSection = document.querySelector(".places");
  
          // Clear the places section
          placesSection.innerHTML = "";
  
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
                                  ${place.max_guest} Guest${place.max_guest != 1? "s" : ""}
                            </div>
                            <div class="number_rooms">
                                  ${place.number_rooms} Bedroom${place.number_rooms != 1 ? "s" : ""}
                            </div>
                            <div class="number_bathrooms">
                                  ${place.number_bathrooms} Bathroom${place.number_bathrooms != 1 ? "s" : ""}
                            </div>
                          </div>
                          <div class="description">${place.description}</div>
                    `;
  
            // Append the article to the places section
            placesSection.appendChild(article);
          });
        })
        .catch((error) => console.error("Error:", error));
    }
  
    // Load places with an empty string initially
    loadPlaces();
  
    $("button").on("click", function () {
      // Load places with the checked states, cities, amenities when the button is clicked
      loadPlaces(amenityIds, stateIds, cityIds);
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
  });
