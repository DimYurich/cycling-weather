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

export const useLatLon = (city: string, fetcher: (_: string) => Promise<any>): SWRResponse<LatLon, Error, boolean> => {
    const url = prepareCityApiCall(city)
    const response = useSWR(url, fetcher)

    if (response.isLoading || response.error) {
        return response
    } else if (response.data.total_count == 0) {
        return { data: response.data, error: Error("No cities resolved by name of " + city), isLoading: response.isLoading, mutate: response.mutate, isValidating: response.isValidating }
    } else if (response.data.total_count > 1) {
        return { data: response.data, error: Error("Multiple cities resolved by name of " + city), isLoading: response.isLoading, mutate: response.mutate, isValidating: response.isValidating }
    } else if (response.data.results != undefined) {
        const result: LatLon = response.data.results[0]
        return { data: result, error: response.error, isLoading: response.isLoading, mutate: response.mutate, isValidating: response.isValidating }
    }
    return { data: response.data, error: Error("Should not happen"), isLoading: response.isLoading, mutate: response.mutate, isValidating: response.isValidating }
}