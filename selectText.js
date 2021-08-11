// AFRAME.registerComponent('selecttext', {
//     init: function () {
//         let el = this.el;
//         this.doSomething = function () {
//             console.log('clicked')
//         };
//         this.el.addEventListener('click', this.doSomething);
//     },
//     remove: function () {
//         this.el.removeEventListener('click', this.doSomething);
//     }
// })

AFRAME.registerComponent('selecttext', {

    init: function () {
        console.log('rolling')
        const myMarker = document.querySelector("#heart-marker");
        const aEntity = document.querySelector("#fetus-model");

        // every click, we make our model grow in size :)
        myMarker.addEventListener('click', function (ev, target) {
            console.log('ev', ev)
            console.log('clicked')
            const intersectedElement = ev && ev.detail && ev.detail.intersection && ev.detail.intersection.object;
            if (intersectedElement) {
                const scale = aEntity.getAttribute('scale');
                Object.keys(scale).forEach((key) => scale[key] = scale[key] + 1);
                aEntity.setAttribute('scale', scale);
            }
        });
    }
});