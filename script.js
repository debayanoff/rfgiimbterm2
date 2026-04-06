const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

// --- Google Reviews API Integration ---
function loadGoogleReviews() {
  const request = {
    // Replace YOUR_PLACE_ID_HERE with your gym's official Google Place ID
    placeId: 'YOUR_PLACE_ID_HERE', 
    fields: ['reviews']
  };

  // Create a dummy element required by the Google Places service
  const dummyElement = document.createElement('div');
  const service = new google.maps.places.PlacesService(dummyElement);

  service.getDetails(request, (place, status) => {
    if (status === google.maps.places.PlacesServiceStatus.OK && place.reviews) {
      console.log("Reviews fetched successfully:", place.reviews);
      
      // Right now, this just logs the reviews to the browser console.
      // You can write logic here later to inject them into the HTML structure.
    } else {
      console.error("Failed to fetch Google reviews:", status);
    }
  });
}

// Call the function when the page finishes loading
window.onload = loadGoogleReviews;
