import { readFileSync } from 'fs';
import { createRoot } from 'react-dom/client';
import { App } from './App';

const root = createRoot(document.getElementById('app') as HTMLElement);

root.render(<App />);

// Based on https://zubialevich.blogspot.com/2018/09/how-to-build-typescript-github-pages-app.html.
//var possibleEvents = new Set(["input", "onpropertychange", "keyup", "change", "paste"]);

// window.onload = () => {
//     var sampleInput = document.getElementById("sampleInput") as HTMLInputElement;
//     // possibleEvents.forEach((eventName: string) => {
//     //     sampleInput.addEventListener(eventName, (ev: Event) => {
//     //         var inputElement = ev.target as HTMLInputElement;
//     //         var handler = new SampleInputHandler();
//     //         handler.showResult(inputElement);
//     //     })
//     // });

    
//     const file = readFileSync('./src/contents.json', 'utf-8');
//     let courses: CourseDescription[] = JSON.parse(file);

//     //var routes = document.getElementById("routes");
//     //var routeDetails = document.getElementById("routeDetails");
    
//     demo = document.getElementById("demo")

//     courses.forEach ((course: CourseDescription) => {
//         demo.innerHTML = demo.innerHTML + " | " + course.name
        
//         // newRouteDetails = routeDetails?.cloneNode(true)
//         // routeName = newRouteDetails.getElementById("routeName")
//         // routeName.innerHTML = course.name
//         // garminLink = newRouteDetails.getElementById("garminConnectUrl") as HTMLAnchorElement
//         // garminLink.href = course.garmin_connect_link
//         // routeDetails?.after(newRouteDetails)
//     })

//     dynamicList = document.getElementById("dynamicList")
//     original = document.getElementById("original")
//     courses.forEach ((course: CourseDescription) => {
//         clonedNode = original?.cloneNode(true)
//         // clonedNodeInner = clonedNode.getElementById("htmlContainer")
//         // clonedNodeInner.innerHTML = course.name
//         clonedNode?.appendTo(dynamicList)
//     })
// }