import { mockFetcherFor } from './testutils';
import 'isomorphic-fetch'

describe('mockFetcher', () => {
    it('resolves to whatever is provided', async () => {
        let expected = {"test":"test"}
        const mockFetcher = mockFetcherFor(JSON.stringify(expected))
        let actual = null
        await mockFetcher('_').then(r => actual = r)
        expect(actual).toStrictEqual(expected)
    })
})
