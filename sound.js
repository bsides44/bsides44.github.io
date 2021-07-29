// Source code licensed under Apache License 2.0. 
// Copyright © 2019 William Ngan. (https://github.com/williamngan/pts)

window.demoDescription = "Digital heartbeats. Using pts.js, remixed from William Ngan.";
(function () {

    Pts.quickStart("#pt", "#e2e6ef");

    var sound;
    var bins = 256;
    var ctrls, radius;
    var colors = ["#f06", "#62e", "#fff", "#fe3", "#0c9"];
    var bufferLoaded = false;
    var hitButton = true
    // Better streaming but bad on mobile
    // Sound.load("/assets/sound2.mp4").then(s => {
    //     sound = s.analyze(bins);
    // }).catch(e => console.error(e));

    // Better on mobile but no streaming
    // See this example: http://ptsjs.org/demo/edit/?name=sound.freqDomain
    Sound.loadAsBuffer("/assets/sound2.mp3").then(s => {
        sound = s;
        bufferLoaded = true;
    }).catch(e => console.error(e));
    // Need this because AudioBuffer can only play once
    function toggle() {
        if (!!hitButton) {
            hitButton = false
            if (!sound.playing) {
                sound.createBuffer().analyze(bins); // recreate buffer again
                sound.start();
                setInterval(() => {
                    hitButton = true
                }, 1000);
                return
            }
            if (sound.playing || !bufferLoaded) {
                sound.stop();
                setInterval(() => {
                    hitButton = true
                }, 1000);
                return
            }
        }
    }

    // Draw play button
    function playButton() {
        if (!bufferLoaded) {
            form.fillOnly("#9ab").text([20, 30], "Loading...");
            return;
        }
        if (!sound || !sound.playing) {
            form.fillOnly("#f06").rect([[0, 0], [50, 50]]);
            form.fillOnly('#fff').polygon(Triangle.fromCenter([25, 25], 10).rotate2D(Const.half_pi, [25, 25]));
        } else {
            form.fillOnly("rgba(0,0,0,.2)").rect([[0, 0], [50, 50]]);
            form.fillOnly("#fff").rect([[18, 18], [32, 32]]);
        }
    }

    function getCtrlPoints(time) {
        let r = radius + radius * (Num.cycle(time % 1000 / 1000) * 0.2);
        let temp = ctrls.clone();

        for (let i = 0, len = temp.length; i < len; i++) {
            let d = ctrls[i].$subtract(space.pointer);

            if (d.magnitudeSq() < r * r) { // push out if inside threshold 
                temp[i].to(space.pointer.$add(d.unit().$multiply(r)));
            } else if (!ctrls[i].equals(temp[i], 0.1)) { // pull in if outside threshold
                temp[i].to(Geom.interpolate(temp[i], ctrls[i], 0.02));
            }
        }

        // close the bspline curve with 3 extra points
        temp.push(temp.p1, temp.p2, temp.p3);
        return temp;
    }

    function randomNumber(min, max) {
        return Math.floor(Math.random() * (max - min) + min)
    }

    // animation
    space.add({

        start: (bound) => {
            radius = space.size.minValue().value / 5;
            // size of circle 5, origin of points randomised
            ctrls = Create.radialPts(space.center, radius, 5, randomNumber(1, 360));
        },

        animate: (time, ftime) => {

            if (sound && sound.playable) {
                // get b-spline curve and draw face shape
                let anchors = getCtrlPoints(time);
                let curve = Curve.bspline(anchors, 4);
                let center = anchors.centroid();
                form.fillOnly("#E11414").polygon(curve);

                // initiate spikes array, evenly distributed spikes around the face
                let spikes = [];
                for (let i = 0; i < bins; i++) {
                    spikes.push(curve.interpolate(i / bins));
                }

                // calculate spike shapes based on freqs
                let freqs = sound.freqDomainTo([bins, 1]);

                // heartbeat is only hitting freqs[0-11]. Map these over the whole circle.
                let activeFreqsArray = freqs.slice(0, 11)

                freqs.map(item => {
                    for (let i = 0; i < 10; i++) {
                        item.y = activeFreqsArray[i].y
                    }
                })

                let tris = [];
                let tindex = 0;
                let f_acc = 0;

                // The spike at the particular frequency is pushed out
                let temp;
                for (let i = 0, len = freqs.length; i < len; i++) {
                    let prev = spikes[(i === 0) ? spikes.length - 1 : i - 1];
                    let dp = spikes[i].$subtract(prev);
                    f_acc += freqs[i].y;

                    //this blocks spikes from working on mobile
                    // if (dp.magnitudeSq() < 2) continue;

                    if (tindex === 0) {
                        temp = [spikes[i]];
                    } else if (tindex === 1) {
                        let pp = Geom.perpendicular(dp);
                        // length of responsive spike
                        temp.push(spikes[i].$add(pp[1].$unit().multiply(freqs[i].y * radius + 100)));
                    } else if (tindex === 2) {
                        temp.push(spikes[i]);
                        tris.push(temp);
                    }

                    tindex = (i + 1) % 3;
                }

                // draw spikes
                let f_scale = f_acc / bins;
                for (let i = 0, len = tris.length; i < len; i++) {
                    //spikes
                    form.fillOnly("#E11414").polygon(tris[i]);
                    //circles on end of spikes 
                    form.fillOnly("#E11414").point(tris[i][1], freqs[i].y * 10, "circle")
                }

                // draw "lips" based on time domain data
                // let tdata = sound.timeDomainTo([radius, 10], [center.x - radius / 2, 0]).map((t, i) =>
                //     new Group([t.x, center.y - t.y * Num.cycle(i / bins) * (0.5 + 1.5 * f_scale)],
                //         [t.x, center.y + t.y * Num.cycle(i / bins) * (0.5 + 10 * f_scale) + 30])
                // );

                // for (let i = 0, len = tdata.length; i < len; i++) {
                //     let t2 = [tdata[i].interpolate(0.25 + 0.2 * f_scale), tdata[i].interpolate(0.5 + 0.3 * f_scale)];
                //     form.strokeOnly("#30f").line(tdata[i]);
                //     form.strokeOnly("#f06", 2).line(t2);
                // }


                // moving dot
                // size of bulb
                let bulb = center.clone().toAngle(-Const.quarter_pi - Const.half_pi, radius / 15, true);
                // position of dot
                form.fillOnly("").ellipse(bulb, [70 + 70 * f_scale, 70 + 70 * f_scale], 0 - 1 * f_scale);
                // response to pointer: -50 is the radius the dot can move
                let movingDot = bulb.clone().toAngle(bulb.$subtract(space.pointer).angle(), -50, true);
                // colour/ size of dot
                form.fill("#fff").points([movingDot], 10 + 2, "circle");

                // draw eyes        
                // let eyeRight = center.clone().toAngle(-Const.quarter_pi - 0.2, radius / 2, true);
                // let eyeLeft = center.clone().toAngle(-Const.quarter_pi - Const.half_pi + 0.2, radius / 2, true);
                // form.fillOnly("#fff").ellipse(eyeLeft, [8 + 10 * f_scale, 10 + 8 * f_scale], 0 - 1 * f_scale);
                // form.fillOnly("#fff").ellipse(eyeRight, [8 + 10 * f_scale, 10 + 8 * f_scale], 0 + 1 * f_scale);

                // let eyeBallRight = eyeRight.clone().toAngle(eyeRight.$subtract(space.pointer).angle(), -5, true);
                // let eyeBallLeft = eyeLeft.clone().toAngle(eyeLeft.$subtract(space.pointer).angle(), -5, true);
                // form.fill("#123").points([eyeBallLeft, eyeBallRight], 2 + 10 * f_scale, "circle");
            }

            playButton();
        },

        action: (type, x, y) => {
            if (type === "up" && Geom.withinBound([x, y], [0, 0], [50, 50])) {
                toggle();
            }
        }

    });

    space.bindMouse().bindTouch().play();

})();