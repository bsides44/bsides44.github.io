let title = document.getElementById("overlay-header");
let weeksButtons = document.getElementById("weeks-buttons");
let weeksArray = document.getElementsByClassName("weeks-button");

function checkSupportedState() {
    navigator.xr.isSessionSupported("immersive-ar").then(supported => {
        if (supported) {
        } else {
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
    }
}

function onButtonClicked(button) {
    console.log('button clicked', button.target.id)
}

initXR();