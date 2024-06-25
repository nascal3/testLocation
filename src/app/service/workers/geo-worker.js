self.addEventListener('message', function (e) {
  if (e.data === 'start') {
    if ("geolocation" in navigator && "watchPosition" in navigator.geolocation) {
      self.geoWatch = navigator.geolocation.watchPosition(
        function (position) {
          self.postMessage({
            type: 'location',
            data: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: position.coords.accuracy,
              altitude: position.coords.altitude,
              altitudeAccuracy: position.coords.altitudeAccuracy,
              heading: position.coords.heading,
              speed: position.coords.speed
            }
          });
        },
        function (error) {
          self.postMessage({
            type: 'error',
            data: error
          });
        },
        {
          enableHighAccuracy: true,
          timeout: 1000 * 60 * 60,
          maximumAge: 0
        }
      );
    } else {
      self.postMessage({
        type: 'error',
        data: { code: 0, message: 'Geolocation not available.' }
      });
    }
  } else if (e.data === 'stop') {
    if (typeof self.geoWatch === 'number') {
      navigator.geolocation.clearWatch(self.geoWatch);
      self.geoWatch = null;
    }
  }
});
