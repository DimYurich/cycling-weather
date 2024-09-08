import { useLatLon } from './useLatLon';
import { render, screen, act, waitFor } from '@testing-library/react'
import { FunctionComponent } from 'react';
import '@testing-library/jest-dom'
import { SWRConfig } from 'swr'
import 'isomorphic-fetch'
import { fetchCourses } from './CourseDescriptionData' 
import { realFetcher, mockFetcherFor, fetcherFunc } from './testutils';

type TestComponentProps = {
    city: string,
    fetcher: fetcherFunc
}

const TestComponent: FunctionComponent<TestComponentProps> = ({ city, fetcher }: TestComponentProps) => {
    let { data, error, isLoading } = useLatLon(city, fetcher)
    if (isLoading) {
        return (<div data-testid="loading">Loading</div>);
    } else if (error) {
        return (<div data-testid="error">Error: {error.message}</div>);
    } else {
        return (<div data-testid="data">Data: {JSON.stringify(data)}</div>);
    }
}

const runTest = (city: string, fetcher: fetcherFunc) => 
    act(() => {
        render(
            <SWRConfig value={{ provider: () => new Map() }}>
                <TestComponent city={city} fetcher={fetcher}/>
            </SWRConfig>
        )    
    })

const verifyOutput = async (dataTestId: string) => {
    await waitFor(() => screen.getByTestId(dataTestId))
    expect(screen.getByTestId(dataTestId)).toBeInTheDocument()
}

describe('useLatLon component test', () => {
    type testDesc = {
        testName: string,
        fetcher: fetcherFunc,
        cityName: string,
        expectedTestDataId: string
    }

    const tests: testDesc[] = [{
        testName: 'renders properly with real data',
        fetcher: realFetcher,
        cityName: 'Clayton, CA',
        expectedTestDataId: 'data'
    },{
        testName: 'renders proper failure with truly absent data',
        fetcher: realFetcher,
        cityName: 'Carmel-by-the-sea, CA',
        expectedTestDataId: 'error'
    },{
        testName: 'renders properly with mockFetcher',
        fetcher: mockFetcherFor('{total_count=1, results=[{latitude=37.9410, longitude=121.9358}]}'),
        cityName: 'Clayton, CA',
        expectedTestDataId: 'data'
    },{
        testName: 'fails when no cities are resolved',
        fetcher: mockFetcherFor('{total_count=0, results=[]}'),
        cityName: 'Carmel-by-the-sea, CA',
        expectedTestDataId: 'error'
    }]

    tests.forEach((test) => it(test.testName, async () => {
        runTest(test.cityName, test.fetcher)
        verifyOutput(test.expectedTestDataId)
    }))
})

describe('cities in routes test', () => {
    const rawData = fetchCourses('./src/contents.json');
    const cities = new Set<string>()
    rawData.forEach(course => course.cities.forEach(city => cities.add(city)))
    
    cities.forEach(city => {
        it('Testing ' + city, async () => {
            runTest(city, realFetcher)
            verifyOutput('data')
        })    
    })
})