AFRAME.registerComponent('selecttext', {
    init: function () {
        let el = this.el;
        this.doSomething = function () {
            console.log('clicked')
        };
        this.el.addEventListener('click', this.doSomething);
    },
    remove: function () {
        this.el.removeEventListener('click', this.doSomething);
    }
})