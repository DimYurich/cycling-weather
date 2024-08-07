import { readFileSync } from 'fs';
import { memo, useState, useEffect } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const cyclingHoursStart = 7 // 07:00
const cyclingHoursDuration = 14 // 07:00 to 20:00, inclusive
const cyclingHours = [...Array(cyclingHoursDuration).keys()].map(hour => hour + cyclingHoursStart)

export default function CyclingWeather() {
    return (
        <div>
            <h1>Clayton Coyotes Cycling Weather Dashboard</h1>
            <RoutesList/>
        </div>
    )
}

function nextSaturday() {
    const saturday = 6;
    var d = new Date();
    d.setDate(d.getDate() + (saturday + 7 - d.getDay()) % 7);
    return d
}

interface CourseDescriptionData {
    name: string;
    garmin_connect_link: string;
    distance_mi: number;
    accent_ft: number;
    cities: string[];
}

type CityWeather = HourlyCityWeather[]

interface HourlyCityWeather {
    temperature_f: number;
    windSpeed_mph: number;
    rainProbability: number;
    clouds: string;
}

interface LatLon {
    latitude: number;
    longitude: number;
}

function RoutesList(date: Date) {
    const [forecastDate, setForecastDate] = useState(nextSaturday())
    let rawData = readFileSync('./src/contents.json', 'utf-8')
    let courses: CourseDescriptionData[] = JSON.parse(rawData);
    return <List>{courses.map(course => <CourseDescription course={course} date={forecastDate}/>)}</List>;
}


function CourseDescription({course, date}) {
    return <ListItem><div>
        <div>{course.name} [<a href={course.garmin_connect_link}>link</a>]</div>
        <div>Distance: {course.distance_mi} miles</div>
        <div>Accent: {course.accent_ft} feet</div>
        <div><WeatherForecast cities={course.cities} date={date} /></div>
    </div></ListItem>;
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
    {/*let cityWeather = useWeather(city, date)*/}
    let hourlyWeather: HourlyCityWeather = {
        temperature_f: 85,
        windSpeed_mph: 2,
        rainProbability: 0,
        clouds: "Clear skies"
    }
    let cityWeather = cyclingHours.map(_ => hourlyWeather)
    
    return <TableRow>
        <TableCell>{city}</TableCell>
        {cityWeather.map(hourlyWeather => <HourlyCityWeatherForecast weather={hourlyWeather} />)}
    </TableRow>
}

function HourlyCityWeatherForecast({weather}) {
    return <TableCell>
         <div>Temp: {weather.temperature_f} F</div>
         <div>Wind: {weather.windSpeed_mph} mph</div>
         <div>Rain: {weather.rainProbability} %</div>
         <div>{weather.clouds}</div>
    </TableCell>
}

function useWeather(city: string, forecastDate: Date): CityWeather {    
    function cacheKey(city: string, date: Date): string {
        return JSON.stringify({
            "city": city,
            "date": date,
        })
    }

    const [weather, setWeather] = useState(null);
    const [weatherCache, setWeatherCache] = useState({});

    useEffect(() => {
        let key = cacheKey(city, forecastDate)
        if (weatherCache[key]) {
            setWeather(weatherCache[key])
        } else {
            let latlon = useCity(city)
{/*}
            let weatherApi = 
            fetch(weatherApi)
                .then(response => response.json())
                .then(json => {
                    let weather = json
                    setWeather(weather);
                    setWeatherCache(prevCache => ({ ...prevCache, [key]: weather }));
                })
                .catch(error => console.error(error));
            */}
            }
    }, [city, forecastDate]);
    return weather;
}


function useCity(city: string): LatLon {
    const [latLon, setLatLon] = useState(null);
    const [latLonCache, setLatLonCache] = useState({});
    
    useEffect(() => {
        if (latLonCache[city]) {
            setLatLon(latLonCache[city])
        } else {
            var parts = city.split(", ")
            var geoApiUrl = `https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/geonames-postal-code/records?select=latitude%2C%20longitude&limit=1&refine=country_code%3A%22US%22&refine=admin_code1%3A%22${parts[1]}%22&refine=place_name%3A%22${parts[0]}%22`
        
            fetch(geoApiUrl)
                .then(response => response.json())
                .then(json => {
                    let latLon = json.results[0]
                    setLatLon(latLon);
                    setLatLonCache(prevCache => ({ ...prevCache, [city]: latLon }));
                })
                .catch(error => console.error(error));
        }
    }, [city]);
    return latLon;
}
