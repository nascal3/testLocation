import {Component, OnInit} from "@angular/core";
import {JsonPipe} from "@angular/common";


@Component({
  standalone: true,
  selector: 'app-home',
  templateUrl: './home.component.html',
  imports: [
    JsonPipe
  ],
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {

  timeOut = 1000 * 60 * 60;
  highAccuracy = true;
  showCurrentPosition = false;
  locationTracked: {} = {};

  ngOnInit() {
    this.getLocation();
  }

  getLocation() {
    if ("geolocation" in navigator) {
      this.showCurrentPosition ? this.currentPosition(navigator) : this.trackPosition(navigator);
    } else {
      console.error( "Geolocation not available." );
    }
  }

  switchTracker() {
    this.showCurrentPosition =!this.showCurrentPosition;
    this.getLocation();
  }

  currentPosition(navigator: any) {
    navigator.geolocation.getCurrentPosition( this.setCurrentPosition.bind(this), this.positionError.bind(this), {
      enableHighAccuracy: this.highAccuracy,
      timeout: this.timeOut,
      maximumAge: 0
    });
  }

  trackPosition(navigator: any) {
    navigator.geolocation.watchPosition( this.setCurrentPosition.bind(this), this.positionError.bind(this), {
      enableHighAccuracy: this.highAccuracy,
      timeout: this.timeOut,
      maximumAge: 0
    });
  }

  setCurrentPosition( position: any ) {
    this.locationTracked = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      accuracy: position.coords.accuracy,
      altitude: position.coords.altitude,
      altitudeAccuracy: position.coords.altitudeAccuracy,
      heading: position.coords.heading,
      speed: position.coords.speed
    };
  }

  positionError( error: any ) {
    switch( error.code ) {
      case error.PERMISSION_DENIED:
        alert( "User denied the request for Geolocation." );
        break;
      case error.POSITION_UNAVAILABLE:
        alert( "Location information is unavailable." );
        break;
      case error.TIMEOUT:
        alert( "The request to get user location timed out." );
        break;
      case error.UNKNOWN_ERROR:
        alert( "An unknown error occurred." );
        break;
    }
  }
}
