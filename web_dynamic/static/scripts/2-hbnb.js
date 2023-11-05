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
});

