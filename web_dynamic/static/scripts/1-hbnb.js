#!/usr/bin/node
// Manipulating amenity tags using jquery
$(document).ready(function () {
    let selectedAmenities = [];
    $('.amenity-checkbox').change(function () {
        const amenityId = $(this).data('id');
        const amenityName = $(this).data('name');

        if (this.checked) {
            selectedAmenities.push(amenityName);
        } else {
            let index = selectedAmenities.indexOf(amenityId);
            if (index !== -1) {
                selectedAmenities.splice(index, 1);
            }
        }
        $('.amenities h4').text(selectedAmenities.join(', '));
    });
});
