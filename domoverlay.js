let title = document.getElementById("overlay-title");
let weeksButtons = document.getElementById("weeks-buttons");
let weeksArray = document.getElementsByClassName("weeks-button");
let demoImg = document.getElementById("demo-img");
let backToBtn = document.getElementById("backToButtons")
let closeBoxBtn = document.getElementById("closeTextBox")
let overlay = document.getElementById("overlay-text")
let closeAR = document.getElementById("close")
let weekSelector = ""

function checkSupportedState() {
    navigator.xr.isSessionSupported("immersive-ar").then(supported => {
        if (!supported) {
            title.innerHTML = "AR not found";
            weeksButtons.style.visibility = "hidden"
        }

    });
}

function initXR() {
    if (!window.isSecureContext) {
        let message = "WebXR unavailable due to insecure context";
        document.getElementById("warning-zone").innerText = message;
    }

    if (navigator.xr) {
        Array.from(weeksArray).forEach((element) => {
            element.addEventListener("click", onButtonClicked)
        });
        navigator.xr.addEventListener("devicechange", checkSupportedState);
        checkSupportedState();
        backToBtn.addEventListener("click", backToButtons)
        closeBoxBtn.addEventListener("click", closeTextBox)

    }
}

function onButtonClicked(button) {
    // change text in textbox
    title.innerHTML = "Draw a heart on your belly, OR click the heart below and open it on your phone. Then move the heart into your camera feed below, so you can see it on screen.";
    backToBtn.style.display = "block"
    closeBoxBtn.style.display = "block"
    weeksButtons.style.visibility = "hidden"
    demoImg.style.display = "block"

    // make chosen asset visible by id
    weekSelector = button.target.id + "weeks"
    document.getElementById(weekSelector).object3D.visible = true
}

function backToButtons() {
    title.innerHTML = "How many weeks?";
    weeksButtons.style.visibility = "visible"
    demoImg.style.display = "none"
    backToBtn.style.display = "none"
    closeBoxBtn.style.display = "none"
}

function closeTextBox() {
    overlay.style.display = "none"
    closeAR.style.display = "block"
}

initXR();