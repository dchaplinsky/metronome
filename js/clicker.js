$(function() {
    soundManager.setup({

        // where to find the SWF files, if needed
        url: '/swf',

        onready: function() {
            metronome.init(120, 4, 4);
        },

        ontimeout: function() {
        }
    });

    $(window).blur(function(){
        metronome.stop();
    }).focus(function(){
        metronome.start();
    });

    $("#lower-options li a").click(function() {
        var val = parseInt($(this).text());
        $("#lower-parent").text(val);
        metronome.lower = val;
        metronome.start(true);
    });

    $("#upper-options li a").click(function() {
        var val = parseInt($(this).text());
        $("#upper-parent").text(val);
        metronome.upper = val;
        metronome.start(true);
    });

});

var metronome = {
    init: function(bpm, upper, lower) {
        this.cnt = 0;
        this.loaded = 0;

        this.bpm = bpm;
        this.upper = upper;
        this.lower = lower;
        this.playing = false;
        this.initialized = true;

        this.audio1 = soundManager.createSound({
            multiShot: false,
            url: 'media/beat1.wav',
            autoLoad: true,
            onload: $.proxy(this.load, this)
        });

        this.audio2 = soundManager.createSound({
            multiShot: false,
            url: 'media/beat2.wav',
            autoLoad: true,
            onload: $.proxy(this.load, this)
        });
    },

    load: function() {
        this.loaded += 1;
        if (this.loaded == 2) {
            this.start();
        }
    },

    _click: function() {
        if (this.cnt % this.upper == 0) {
            this.audio1.play();
        } else {
            this.audio2.play();
        }
        this.cnt += 1;
    },

    start: function(force) {
        if (this.playing && !force)
            return;

        if (!this.initialized)
            return;

        this.playing = true;
        window.clearInterval(this.tick);

        var self = this;
        this.tick = window.setInterval(
            $.proxy(this._click, this),
            60 / this.bpm * 1000 / this.lower * 4);
    },

    stop: function() {
        this.cnt = 0;
        this.playing = false;
        this.audio1.stop();
        this.audio2.stop();
        window.clearInterval(this.tick);
    }
}