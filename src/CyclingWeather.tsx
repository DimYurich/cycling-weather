import { fetchCourses, CourseDescriptionData } from "./CourseDescriptionData"
import { memo, useState, useEffect } from 'react';
import { Md5 } from 'ts-md5';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import AirIcon from '@mui/icons-material/Air';
import UmbrellaIcon from '@mui/icons-material/Umbrella';
import CloudIcon from '@mui/icons-material/Cloud';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import useSWR from 'swr'

const cyclingHoursStart = 7 // 07:00
const cyclingHoursDuration = 14 // 07:00 to 20:00, inclusive
const cyclingHours = [...Array(cyclingHoursDuration).keys()].map(hour => hour + cyclingHoursStart)

const fetcher = (url: string) => fetch(url).then(_ => _.json())

export default function CyclingWeather() {
    return (
        <div>
            <h1>Clayton Coyotes Cycling Weather Dashboard</h1>
            <RoutesList />
        </div>
    )
}

function nextSaturday() {
    const saturday = 6;
    var d = new Date();
    d.setDate(d.getDate() + (saturday + 7 - d.getDay()) % 7);
    return d
}

type CityWeather = HourlyCityWeather[]

interface HourlyCityWeather {
    temperature_f: number;
    windSpeed_mph: number;
    rainProbability: number;
    cloud_cover: number;
}

function RoutesList() {
    const [forecastDate, setForecastDate] = useState(nextSaturday())
    let courses: CourseDescriptionData[] = fetchCourses('./src/contents.json');
    let listItems = courses.map(course => <CourseDescription course={course} date={forecastDate}/>)
    return <ul>{listItems}</ul>;
}

function CourseDescription({course, date}) {
    return <li key={Md5.hashStr(course.name)}><div>
        <div>{course.name} [<a href={course.garmin_connect_link}>link</a>]</div>
        <div>Distance: {course.distance_mi} miles</div>
        <div>Accent: {course.accent_ft} feet</div>
        <div><WeatherForecast cities={course.cities} date={date} /></div>
    </div></li>;
}

function WeatherForecast({cities, date}) {
    return <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>City</TableCell>
            {cyclingHours.map(hour => <TableCell>{hour}:00</TableCell>)}
          </TableRow>
        </TableHead>
        <TableBody>
            {cities.map(city => <CityWeatherForecast city={city} date={date} />)}
        </TableBody>
        </Table>
        </TableContainer>
}

function CityWeatherForecast({city, date}) {
    let cityLatLonApi = prepareCityApiCall(city)
    const { data, error, isLoading } = useSWR(cityLatLonApi, fetcher)

    if (isLoading) {
        return <div></div>
    }
    let total_results = data.total_results
    if (error || total_results == 0) {
        return <TableRow>
            <TableCell>{city} -- BROKEN</TableCell>
        </TableRow>    
    }
    let latLon = data.results[0]
    return <TableRow>
        <TableCell>{city}</TableCell>
        <TableCell>{latLon.latitude} {latLon.longitude}</TableCell>
        {/*{cityWeather.map(hourlyWeather => <HourlyCityWeatherForecast weather={hourlyWeather} />)}*/}
    </TableRow>
}


function useWeather(city: string, forecastDate: Date): CityWeather {    
    let date: string = forecastDate.toLocaleDateString('en-CA') // To be compatible with open-meteo API
    function cacheKey(city: string, date: string): string {
        return JSON.stringify({
            "city": city,
            "date": date,
        })
    }

    const [weather, setWeather] = useState(null);
    const [weatherCache, setWeatherCache] = useState({});

    console.log(cacheKey(city, date));

    let cityApi = prepareCityApi(city) 
    const { data } = useSWR(() => cityApi, fetcher)
    //let latlon = useCity(city)
    //let weatherApi = `https://api.open-meteo.com/v1/forecast?latitude=${latlon.latitude}&longitude=${latlon.longitude}&hourly=apparent_temperature,precipitation_probability,cloud_cover,wind_speed_10m&temperature_unit=fahrenheit&wind_speed_unit=mph&timezone=America%2FLos_Angeles&start_date=${date}&end_date=${date}`
    //console.log(weatherApi);
    

    // useEffect(() => {
    //     let key = cacheKey(city, date)
    //     console.log("in effect")
    //     if (weatherCache[key]) {
    //         setWeather(weatherCache[key])
    //         console.log("hit cache");
    //     } else {
    //         let latlon = useCity(city)
    //         console.log(latlon)
    //         // https://api.open-meteo.com/v1/forecast?latitude=37.941&longitude=-121.9358&hourly=apparent_temperature,precipitation_probability,cloud_cover,wind_speed_10m&temperature_unit=fahrenheit&wind_speed_unit=mph&timezone=America%2FLos_Angeles&start_date=2024-08-11&end_date=2024-08-11
    //         let weatherApi = `https://api.open-meteo.com/v1/forecast?latitude=${latlon.latitude}&longitude=${latlon.longitude}&hourly=apparent_temperature,precipitation_probability,cloud_cover,wind_speed_10m&temperature_unit=fahrenheit&wind_speed_unit=mph&timezone=America%2FLos_Angeles&start_date=${date}&end_date=${date}`
    //         console.log(weatherApi);
    //         fetch(weatherApi)
    //             .then(response => response.json())
    //             .then(json => {
    //                 console.log(json);
    //                 let apparent_temperature = json.hourly.apparent_temperature;
    //                 let wind_speed_10m = json.hourly.wind_speed_10m
    //                 let precipitation_probability = json.hourly.precipitation_probability
    //                 let cloud_cover = json.hourly.cloud_cover
    //                 let weather = cyclingHours.map(hour => {
    //                     let hourlyCityWeather: HourlyCityWeather = {
    //                         temperature_f: apparent_temperature[hour],
    //                         windSpeed_mph: wind_speed_10m[hour],
    //                         rainProbability: precipitation_probability[hour],
    //                         cloud_cover: cloud_cover[hour]
    //                     }
    //                     return hourlyCityWeather
    //                 })
    //                 setWeather(weather);
    //                 setWeatherCache(prevCache => ({ ...prevCache, [key]: weather }));
    //             })
    //             .catch(error => console.error(error));
    //     }
    // }, [city]);

    return null;
}
