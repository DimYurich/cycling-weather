import { readFileSync } from 'fs';

export interface CourseDescriptionData {
    name: string;
    garmin_connect_link: string;
    distance_mi: number;
    accent_ft: number;
    cities: string[];
}

export const fetchCourses = (filename: string): CourseDescriptionData[] => {
    let rawData = readFileSync(filename, 'utf-8')
    return JSON.parse(rawData);
}
