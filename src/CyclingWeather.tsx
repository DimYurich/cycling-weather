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
import { useWeather } from "./useWeather";

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
    const { data, error, isLoading } = useWeather(city, date, fetcher)

    if (isLoading || !data || error) {
        return <div></div>
    }
    return <TableRow>
        <TableCell>{city}</TableCell>
        {data.map(hourlyWeather => <HourlyCityWeatherForecast weather={hourlyWeather} />)}
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