import { fetchCourses, CourseDescriptionData } from "./CourseDescriptionData"
import { FunctionComponent, useState } from 'react';
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
import { useWeather, HourlyCityWeather } from './useWeather';
import { cyclingHours } from './cyclingHours'
import { useLatLon } from "./useLatLon";

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

function RoutesList() {
    const [forecastDate, setForecastDate] = useState(nextSaturday())
    const courses: CourseDescriptionData[] = fetchCourses(fetcher);
    if (!courses) {
        return <div></div>
    }
    const listItems = courses.map((course: CourseDescriptionData) => <CourseDescription course={course} date={forecastDate}/>)
    return <ul>{listItems}</ul>;
}

type CourseDescriptionProps = {
    course: CourseDescriptionData
    date: Date
}
const CourseDescription: FunctionComponent<CourseDescriptionProps> = ({course, date}: CourseDescriptionProps) => {
    return (<li key={Md5.hashStr(course.name)}><div>
        <div>{course.name} [<a href={course.garmin_connect_link}>link</a>]</div>
        <div>Distance: {course.distance_mi} miles</div>
        <div>Accent: {course.accent_ft} feet</div>
        <div><WeatherForecast cities={course.cities} date={date} /></div>
    </div></li>);
}

type WeatherForecastProps = {
    cities: string[]
    date: Date
}
const WeatherForecast: FunctionComponent<WeatherForecastProps> = ({ cities, date }: WeatherForecastProps) => {
    return <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>City</TableCell>
            {cyclingHours.map((hour: number) => <TableCell>{hour}:00</TableCell>)}
          </TableRow>
        </TableHead>
        <TableBody>
            {cities.map(city => <CityWeatherForecast city={city} date={date} />)}
        </TableBody>
        </Table>
    </TableContainer>
}

type CityWeatherForecastProps = {
    city: string
    date: Date
}
const CityWeatherForecast: FunctionComponent<CityWeatherForecastProps> = ({ city, date }: CityWeatherForecastProps) => {
    const { data: latlon } = useLatLon(city, fetcher)
    console.log('City = [' + city + '], latlon = [' + JSON.stringify(latlon) + ']')
    const { data, error, isLoading } = useWeather(latlon, date, fetcher)
    if (isLoading || !data || error) {
        return <TableRow></TableRow>
    }
    return <TableRow>
        <TableCell>{city}</TableCell>
        {data.map(hourlyWeather => <HourlyCityWeatherForecast weather={hourlyWeather} />)}
    </TableRow>
}

type HourlyCityWeatherForecastProps = {
    weather: HourlyCityWeather
}
const HourlyCityWeatherForecast: FunctionComponent<HourlyCityWeatherForecastProps> = ({ weather }: HourlyCityWeatherForecastProps) => {
    return <TableCell>
         <div>Temp: {weather.temperature_f} F</div>
         <div>Wind: {weather.windSpeed_mph} mph</div>
         <div>Rain: {weather.rainProbability} %</div>
         <div>{weather.cloud_cover}</div>
    </TableCell>
}