// Based on https://zubialevich.blogspot.com/2018/09/how-to-build-typescript-github-pages-app.html.
var possibleEvents = new Set(["input", "onpropertychange", "keyup", "change", "paste"]);

window.onload = () => {
    var sampleInput = document.getElementById("sampleInput") as HTMLInputElement;
    possibleEvents.forEach((eventName: string) => {
        sampleInput.addEventListener(eventName, (ev: Event) => {
            var inputElement = ev.target as HTMLInputElement;
            var handler = new SampleInputHandler();
            handler.showResult(inputElement);
        })
    });
};

class SampleInputHandler {
    public showResult(inputElement: HTMLInputElement) {
        var valueStr = inputElement.value;
        var sampleOutput = document.getElementById("sampleOutput");
        sampleOutput.innerHTML = valueStr;
    }
}