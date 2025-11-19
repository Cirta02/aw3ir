export class MeteoItem {
    id?: number;
    name?: string;
    weather: any;

    constructor() {
        this.weather = null;
    }
}