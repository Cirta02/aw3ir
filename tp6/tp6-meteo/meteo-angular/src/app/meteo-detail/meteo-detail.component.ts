import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MeteoService } from '../services/meteo.service';
import { DatePipe } from '@angular/common';

interface ForecastDay {
  date: Date;
  forecasts: any[];
}

@Component({
  selector: 'app-meteo-detail',
  standalone: false,
  templateUrl: './meteo-detail.component.html',
  styleUrl: './meteo-detail.component.css'
})
export class MeteoDetailComponent implements OnInit {
  cityName: string = '';
  currentWeather: any = null;
  fiveDayForecast: any = null;
  loading: boolean = true;
  error: string = '';

  constructor(
    private route: ActivatedRoute,
    private meteoService: MeteoService,
    private datePipe: DatePipe
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.cityName = params.get('name') || '';
      if (this.cityName) {
        this.loadWeatherData();
      }
    });
  }

  loadWeatherData() {
    this.loading = true;
    this.error = '';

    // ⚠️ COMMENTEZ la ligne mock et DÉCOMMENTEZ l'API réelle ⚠️
    // this.mockWeatherData(); // ← COMMENTEZ CETTE LIGNE

    // DÉCOMMENTEZ CES LIGNES POUR L'API RÉELLE :
    this.meteoService.getCurrentWeather(this.cityName)
      .then(data => {
        this.currentWeather = data;
        return this.meteoService.getFiveDayForecast(this.cityName);
      })
      .then(forecastData => {
        this.fiveDayForecast = forecastData;
        this.loading = false;
      })
      .catch(error => {
        this.error = error;
        this.loading = false;
        console.error('Erreur:', error);
      });
  }

  // Méthode de test avec des données mock (à utiliser si vous n'avez pas de clé API)
  mockWeatherData() {
    this.currentWeather = {
      name: this.cityName,
      sys: {
        country: 'FR',
        sunrise: 1643689268,
        sunset: 1643725268
      },
      dt: Date.now() / 1000,
      weather: [{ icon: '01d', description: 'ciel dégagé' }],
      main: {
        temp: 22,
        feels_like: 23,
        humidity: 65,
        pressure: 1015,
        temp_max: 25,
        temp_min: 18
      },
      wind: { speed: 15 },
      coord: { lat: 48.8566, lon: 2.3522 }
    };

    this.fiveDayForecast = {
      list: [
        { dt: Date.now() / 1000 + 86400, weather: [{ icon: '01d', description: 'ensoleillé' }], main: { temp_max: 25, temp_min: 18 } },
        { dt: Date.now() / 1000 + 172800, weather: [{ icon: '02d', description: 'partiellement nuageux' }], main: { temp_max: 23, temp_min: 16 } },
        { dt: Date.now() / 1000 + 259200, weather: [{ icon: '10d', description: 'pluvieux' }], main: { temp_max: 20, temp_min: 14 } },
        { dt: Date.now() / 1000 + 345600, weather: [{ icon: '03d', description: 'nuageux' }], main: { temp_max: 19, temp_min: 13 } },
        { dt: Date.now() / 1000 + 432000, weather: [{ icon: '01d', description: 'ensoleillé' }], main: { temp_max: 22, temp_min: 15 } }
      ]
    };

    this.loading = false;
  }

  // Formater un timestamp en heure
  formatTime(timestamp: number): string {
    return this.datePipe.transform(timestamp * 1000, 'HH:mm') || '';
  }

  // Formater une date complète
  formatDate(timestamp: number): string {
    return this.datePipe.transform(timestamp * 1000, 'EEEE d MMMM yyyy, HH:mm') || '';
  }

  // Obtenir l'icône météo
  getWeatherIcon(iconCode: string): string {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  }

  // Grouper les prévisions par jour
  getGroupedForecasts(): ForecastDay[] {
    if (!this.fiveDayForecast || !this.fiveDayForecast.list) return [];

    const grouped: { [key: string]: ForecastDay } = {};

    this.fiveDayForecast.list.forEach((forecast: any) => {
      const date = new Date(forecast.dt * 1000);
      const day = date.toDateString();

      if (!grouped[day]) {
        grouped[day] = {
          date: date,
          forecasts: []
        };
      }

      grouped[day].forecasts.push(forecast);
    });

    return Object.values(grouped);
  }
}