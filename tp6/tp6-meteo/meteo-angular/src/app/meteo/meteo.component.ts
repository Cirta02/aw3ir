import { Component, OnInit } from '@angular/core';
import { MeteoItem } from '../meteo-item';
@Component({
  selector: 'app-meteo',
  standalone: false,
  templateUrl: './meteo.component.html',
  styleUrl: './meteo.component.css'
})
export class MeteoComponent implements OnInit {
  city: MeteoItem = {
    name: '',
    id: 0,
    weather: null
  };

  cityList: MeteoItem[] = [];

  constructor() { }

  ngOnInit() {
    this.loadCityList();
  }

  loadCityList() {
    const storedList = localStorage.getItem('cityList');
    if (storedList) {
      this.cityList = JSON.parse(storedList);
    }
  }

  saveCityList() {
    localStorage.setItem('cityList', JSON.stringify(this.cityList));
  }

  onSubmit() {
    if (this.city.name && this.city.name.length >= 3) {
      if (!this.isCityExist(this.city.name)) {
        const newCity = new MeteoItem();
        newCity.name = this.city.name;
        newCity.id = Date.now();

        this.cityList.push(newCity);
        this.saveCityList();
        this.city.name = '';
      } else {
        alert('Cette ville est déjà dans votre liste !');
      }
    }
  }

  isCityExist(cityName: string): boolean {
    return this.cityList.some(
      item => item.name?.toLowerCase() === cityName.toLowerCase()
    );
  }

  remove(city: MeteoItem) {
    this.cityList = this.cityList.filter(item => item.id !== city.id);
    this.saveCityList();
  }
}