### Notes

* Garmin Connect Course API is only available to business devs; so can't fetch previews or basic course data.
* Make sure that your city names are uniquely resolvable via Geo API:
  * https://public.opendatasoft.com/explore/dataset/geonames-postal-code/table/?refine.country_code=US&refine.admin_name1=California&q=Tiburon
  * See e.g. Belvedere Tiburon and Carmel-by-the-Sea

### TODOs

* Remove jest.setuptests and jest.polyfills files
* Find out proper Weather API calls
  * which weather API to use?
* Make routes data collapsible in UI
* Add a calendar selector
* Use effects throughout, make the app async
* Improve weather representation with icons
* Check https://github.com/tcgoetz/GarminDB for route data
* Bootstrap for styling
~~* Use React & JSX for markup & data glue~~
~~* Upgrade Node to 22 in package.json & Dockerfile~~
~~* Find out how to read a json file~~
~~* Rework docker container to pick up changes dynamically~~