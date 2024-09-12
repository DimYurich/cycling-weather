import { LatLon } from './useLatLon';
import { SWRResponse }  from 'swr'
import useSWR from 'swr'
import { cyclingHours } from './cyclingHours'

const prepareWeatherApi = (latlon: LatLon | undefined, date: string): () => string | null => {
    if (latlon == undefined || latlon.latitude == undefined || latlon.longitude == undefined) {
        return () => null
    }
    return () => `https://api.open-meteo.com/v1/forecast?latitude=${latlon.latitude}&longitude=${latlon.longitude}`+
    `&hourly=apparent_temperature,precipitation_probability,cloud_cover,wind_speed_10m&temperature_unit=fahrenheit`+
    `&wind_speed_unit=mph&timezone=America%2FLos_Angeles&start_date=${date}&end_date=${date}`
}
export interface HourlyCityWeather {
    temperature_f: number;
    windSpeed_mph: number;
    rainProbability: number;
    cloud_cover: number;
}

export type CityWeather = HourlyCityWeather[]

export const useWeather = (latlon: LatLon | undefined, date: Date, fetcher: (_: string) => Promise<any>): SWRResponse<CityWeather, Error, boolean> => {
    const openMeteoDate: string = date.toLocaleDateString('en-CA') // To be compatible with open-meteo API
    const urlFunc = prepareWeatherApi(latlon, openMeteoDate)
    const result = useSWR(urlFunc, fetcher)

    if (!result.data || result.isLoading || result.error) {
        return result
    }
    
    console.log(urlFunc())
    //console.log(result)
    const apparent_temperature = result.data.hourly.apparent_temperature;
    const wind_speed_10m = result.data.hourly.wind_speed_10m
    const precipitation_probability = result.data.hourly.precipitation_probability
    const cloud_cover = result.data.hourly.cloud_cover
    const weather = cyclingHours.map(hour => {
        const hourlyCityWeather: HourlyCityWeather = {
            temperature_f: apparent_temperature[hour],
            windSpeed_mph: wind_speed_10m[hour],
            rainProbability: precipitation_probability[hour],
            cloud_cover: cloud_cover[hour]
        }
        return hourlyCityWeather
    })
    return { data: weather, error: result.error, isLoading: result.isLoading, mutate: result.mutate, isValidating: result.isValidating }
}
