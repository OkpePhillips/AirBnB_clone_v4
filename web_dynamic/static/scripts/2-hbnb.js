$(document).ready(function () {
    let selectedAmenities = [];
    $('.amenity-checkbox').change(function () {
        const amenityId = $(this).data('id');
        const amenityName = $(this).data('name');

        if (this.checked) {
            selectedAmenities.push(amenityName);
        } else {
            let index = selectedAmenities.indexOf(amenityName);
            if (index !== -1) {
                selectedAmenities.splice(index, 1);
            }
        }
        $('.amenities h4').text(selectedAmenities.join(', '));
    });
    function checkApiStatus() {
        $.get('http://0.0.0.0:5001/api/v1/status/', function (data) {
            if (data.status === 'OK') {
                $('#api_status').addClass('available');
            } else {
                $('#api_status').removeClass('available');
            }
        });
    }
    checkApiStatus();
    setInterval(checkApiStatus, 5000);
});
