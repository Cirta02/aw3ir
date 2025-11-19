import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MeteoService {

  // Remplacez par votre clé API OpenWeatherMap
  private apiKey = '9fa0f08b308656e46582ee56e308e8f9';
  private baseUrl = 'https://api.openweathermap.org/data/2.5';

  constructor() { }

  // Méthode pour obtenir la météo actuelle
  getCurrentWeather(cityName: string): Promise<any> {
    const url = `${this.baseUrl}/weather?q=${cityName}&units=metric&lang=fr&appid=${this.apiKey}`;

    return fetch(url)
      .then(response => response.json())
      .then(data => {
        if (data.cod === 200) {
          return Promise.resolve(data);
        } else {
          return Promise.reject(`Météo introuvable pour ${cityName} (${data.message})`);
        }
      })
      .catch(error => {
        return Promise.reject(`Erreur réseau: ${error}`);
      });
  }

  // Méthode pour obtenir les prévisions sur 5 jours
  getFiveDayForecast(cityName: string): Promise<any> {
    const url = `${this.baseUrl}/forecast?q=${cityName}&units=metric&lang=fr&appid=${this.apiKey}`;

    return fetch(url)
      .then(response => response.json())
      .then(data => {
        if (data.cod === '200') {
          return Promise.resolve(data);
        } else {
          return Promise.reject(`Prévisions introuvables pour ${cityName} (${data.message})`);
        }
      })
      .catch(error => {
        return Promise.reject(`Erreur réseau: ${error}`);
      });
  }
}