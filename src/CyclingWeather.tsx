import { readFileSync } from 'fs';

// const courses: CourseDescriptionData[] = [
//     {name: "route1"}, {name: "route1"}, {name: "route1"}
// ] 

const CyclingWeather = () => {
    return (
        <div>
            <h1>Clayton Coyotes Cycling Weather Dashboard</h1>
            <RoutesList />
        </div>
    )
}

interface CourseDescriptionData {
    name: string;
    garmin_connect_link: string;
    distance_mi: number;
    accent_ft: number;
    cities: string[];
}

function RoutesList() {
    const file = readFileSync('./src/contents.json', 'utf-8');
    let courses: CourseDescriptionData[] = JSON.parse(file);

    return <ul>{courses.map(course => CourseDescription(course))}</ul>;
}

function CourseDescription(course: CourseDescriptionData) {
    weatherData = course.cities.map(city => cityWeather(city))

    return <li><div>
        <div>{course.name} [<a href={course.garmin_connect_link}>link</a>]</div>
        <div>Distance: {course.distance_mi} miles</div>
        <div>Accent: {course.accent_ft} feet</div>
        <div>{weatherData}</div>
    </div></li>;
}

function cityWeather(city: string) {
    // TODO: obtain next Sat, Sun, and federal holidays
    // TODO: filter out temperature, wind, rain, clouds
    return <div>weather lorem ipsum</div>
}

export { CyclingWeather };
