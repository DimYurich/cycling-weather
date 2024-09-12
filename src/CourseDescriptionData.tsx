import useSWR from 'swr'

export interface CourseDescriptionData {
    name: string;
    garmin_connect_link: string;
    distance_mi: number;
    accent_ft: number;
    cities: string[];
}

export const fetchCourses = (fetcher: (_: string) => Promise<any>): CourseDescriptionData[] => {
    const {data, error, isLoading } = useSWR('https://raw.githubusercontent.com/DimYurich/cycling-weather/main/src/contents.json', fetcher)
    if (!data || error || isLoading) {
        return []
    }
    return data;
}
