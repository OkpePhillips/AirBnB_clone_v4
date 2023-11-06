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

  $(".statesList").change(function () {
    updateCheckedItems($(this), stateIds, cityIds);
  });

  $(".cityList").change(function () {
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
      body: JSON.stringify({
        amenities: Object.keys(amenities),
        states: Object.keys(stateIds),
        cities: Object.keys(cityIds),
      }),
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
				  ${place.max_guest} Guest${place.max_guest != 1 ? "s" : ""}
				</div>
				<div class="number_rooms">
				  ${place.number_rooms} Bedroom${place.number_rooms != 1 ? "s" : ""}
				</div>
				<div class="number_bathrooms">
				  ${place.number_bathrooms} Bathroom${place.number_bathrooms != 1 ? "s" : ""}
				</div>
			  </div>
			  <div class="description">${place.description}</div> 
			  <div class="reviews"><div class="cap"><h2>Reviews <span class="toggle-reviews">show</span></h2></div></div>
			`;

          fetchReviews(place.id, article);
          // Append the article to the places section
          placesSection.appendChild(article);
        });
      })
      .catch((error) => console.error("Error:", error));
  }

  // Load places with an empty string initially
  loadPlaces();

  $("button").on("click", function () {
    // Load places with the checked amenities when the button is clicked
    loadPlaces(amenityIds);
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
function fetchReviews(placeId, article) {
  let url = `http://0.0.0.0:5001/api/v1/places/${placeId}/reviews`;
  // Get the span element
  let toggleReviewsSpan = article.querySelector(".reviews .toggle-reviews");

  // Add click event listener to the span
  toggleReviewsSpan.addEventListener("click", function () {
    // If the text is "show", fetch and display the reviews
    if (toggleReviewsSpan.textContent === "show") {
      toggleReviewsSpan.textContent = "hide";
      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          // data is an array of review objects

          // Get the h2 element of the reviews class in the article
          let reviewsH2 = article.querySelector(".reviews h2");

          // Get the text node of the h2 element
          let reviewsH2Text = reviewsH2.firstChild;

          // Update the text node with the number of reviews
          reviewsH2Text.nodeValue = `${data.length} Review${
            data.length != 1 ? "s" : ""
          } `;

          // Get the ul element of the reviews class in the article
          let reviewsUl = article.querySelector(".reviews ul");

          // If the ul element doesn't exist, create it
          if (!reviewsUl) {
            reviewsUl = document.createElement("ul");
            article.querySelector(".reviews").appendChild(reviewsUl);
          }

          // Loop through the reviews
          data.forEach((review) => {
            // Fetch the user details
            fetch(`http://0.0.0.0:5001/api/v1/users/${review.user_id}`)
              .then((response) => response.json())
              .then((user) => {
                // Create a li element for the review
                let reviewLi = document.createElement("li");

                var userDate = new Date(user.created_at);
                // Set the text of the li element to the review text
                reviewLi.innerHTML = `
				<p id="top_text">From ${user.first_name} ${user.last_name} on ${formatDate(
                  userDate
                )}</p>
				<p>${review.text}</p>
			  `;

                reviewLi.style.marginBottom = "10px";

                // Append the li element to the ul element
                reviewsUl.appendChild(reviewLi);
              })
              .catch((error) => console.error("Error:", error));
          });
        })
        .catch((error) => console.error("Error:", error));
    } else {
      // If the text is "hide", remove all review elements from the DOM
      let reviewsUl = article.querySelector(".reviews ul");
      while (reviewsUl.firstChild) {
        reviewsUl.removeChild(reviewsUl.firstChild);
      }

      // Change the text to "show"
      toggleReviewsSpan.textContent = "show";
    }
  });
}
function formatDate(date) {
  var monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  var day = date.getDate();
  var monthIndex = date.getMonth();
  var year = date.getFullYear();

  // Add suffix to day (st, nd, rd, th)
  var suffix = "";
  if (day > 3 && day < 21) suffix = "th";
  switch (day % 10) {
    case 1:
      suffix = "st";
      break;
    case 2:
      suffix = "nd";
      break;
    case 3:
      suffix = "rd";
      break;
    default:
      suffix = "th";
  }

  return day + suffix + " " + monthNames[monthIndex] + " " + year;
}
