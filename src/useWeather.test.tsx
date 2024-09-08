import { LatLon } from "./useLatLon";
import { FunctionComponent } from 'react';
import { useWeather } from "./useWeather";
import { render, screen, act, waitFor } from '@testing-library/react'
import { realFetcher, fetcherFunc } from './testutils';
import 'isomorphic-fetch'
import '@testing-library/jest-dom'

type TestComponentProps = {
    latlon: LatLon,
    fetcher: fetcherFunc
}

const TestComponent: FunctionComponent<TestComponentProps> = ({ latlon, fetcher }: TestComponentProps) => {
    const date = new Date()
    date.setDate(date.getDate() + 1)
    let { data, error, isLoading } = useWeather(latlon, date, fetcher)
    if (isLoading) {
        return (<div data-testid="loading">Loading</div>);
    } else if (error) {
        return (<div data-testid="error">Error: {error.message}</div>);
    } else {
        return (<div data-testid="data">Data: {JSON.stringify(data)}</div>);
    }
}


describe('weather fetching by latlon', () => {
    it('works with real API and coordinates', async () => {
        act(() => {
            render(
                <TestComponent latlon={{latitude: 37.9410, longitude: 121.9358}} fetcher={realFetcher}/>
            )    
        })
        await waitFor(() => screen.getByTestId('data'))
        expect(screen.getByTestId('data')).toBeInTheDocument()
    })
})    