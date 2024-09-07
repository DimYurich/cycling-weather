import { SWRResponse }  from 'swr'
import useSWR from 'swr'

export interface LatLon {
    latitude: number;
    longitude: number;
}

const prepareCityApiCall = (city: string): string => {
    let parts = city.split(", ")
    return `https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/geonames-postal-code/records?`+
              `select=latitude%2C%20longitude&limit=1&refine=country_code%3A%22US%22`+
              `&refine=admin_code1%3A%22${parts[1]}%22&refine=place_name%3A%22${parts[0]}%22`
}

const identity = (r: any) => r

export const useLatLon = (city: string, fetcher: (_: string) => Promise<any>): SWRResponse<LatLon, Error, boolean> => {
    const url = prepareCityApiCall(city)
    const { data, error, isLoading } = useSWR(url, fetcher)

    if (isLoading || error) {
        return { data: undefined, error: error, isLoading: isLoading, mutate: identity, isValidating: false }
    } else if (data.total_count == 0) {
        return { data: undefined, error: Error("No cities resolved by name of " + city), isLoading: false, mutate: identity, isValidating: false }
    } else if (data.total_count > 1) {
        return { data: undefined, error: Error("Multiple cities resolved by name of " + city), isLoading: false, mutate: identity, isValidating: false }
    } else if (data.results != undefined) {
        const result: LatLon = data.results[0]
        return { data: result, error: error, isLoading: isLoading, mutate: identity, isValidating: false }
    }
    return { data: undefined, error: Error("Should not happen"), isLoading: false, mutate: identity, isValidating: false }
}