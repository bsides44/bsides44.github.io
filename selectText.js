AFRAME.registerComponent('selecttext', {

    init: function () {
        console.log('rolling')
        const myMarker = document.querySelector("#weeks-text");
        const aEntity = document.querySelector("#fetus-model");

        myMarker.addEventListener('click', function (ev, target) {
            console.log('ev', ev)
            console.log('clicked')
            // if we click myMarker, double the model size
            const intersectedElement = ev && ev.detail && ev.detail.intersection && ev.detail.intersection.object;
            if (intersectedElement) {
                const scale = aEntity.getAttribute('scale');
                Object.keys(scale).forEach((key) => scale[key] = scale[key] + 1);
                aEntity.setAttribute('scale', scale);
            }
        });
    }
});