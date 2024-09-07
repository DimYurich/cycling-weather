import { useLatLon } from './useLatLon';
import { render, screen, act, waitFor } from '@testing-library/react'
import { FunctionComponent } from 'react'; // importing FunctionComponent
import '@testing-library/jest-dom'
import { SWRConfig } from 'swr'
import 'isomorphic-fetch'

type fetcherFunc = (_: string) => Promise<Response>
const mockFetcherFunc = (response: string) : fetcherFunc => (_: string) => Promise.resolve(new Response(response)).then(_ => _.json())

describe('mockFetcher', () => {
    it('resolves to whatever is provided', async () => {
        let expected = {"test":"test"}
        const mockFetcher = mockFetcherFunc(JSON.stringify(expected))
        let actual = null
        await mockFetcher('_').then(r => actual = r)
        expect(actual).toStrictEqual(expected)
    })
})

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

    const realFetcher = (url: string) => fetch(url).then(_ => _.json())
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
        fetcher: mockFetcherFunc('{total_count=1, results=[{latitude=37.9410, longitude=121.9358}]}'),
        cityName: 'Clayton, CA',
        expectedTestDataId: 'data'
    },{
        testName: 'fails when no cities are resolved',
        fetcher: mockFetcherFunc('{total_count=0, results=[]}'),
        cityName: 'Carmel-by-the-sea, CA',
        expectedTestDataId: 'error'
    }]

    tests.forEach((test) => it(test.testName, async () => {
        runTest(test.cityName, test.fetcher)
        verifyOutput(test.expectedTestDataId)
    }))
})
