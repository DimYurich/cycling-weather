export type fetcherFunc = (_: string) => Promise<Response>
export const mockFetcherFor = (response: string) : fetcherFunc => (_: string) => Promise.resolve(new Response(response)).then(_ => _.json())
export const realFetcher = (url: string) => fetch(url).then(_ => _.json())
