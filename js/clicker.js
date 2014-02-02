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
        if (metronome.status == "play")
            metronome.start();
    });

    $("#control-button").click(function() {
        var el = $(this);
        if (el.hasClass("disabled"))
            return;

        metronome.turn();
        el.find("span")
            .toggleClass("glyphicon-pause", metronome.status == "play")
            .toggleClass("glyphicon-play", metronome.status == "pause");
    });

    $("#lower-options li a").click(function() {
        var val = parseInt($(this).text());
        $("#lower-parent").text(val);
        metronome.lower = val;

        if (metronome.status == "play")
            metronome.start(true);
    });

    $("#upper-options li a").click(function() {
        var val = parseInt($(this).text());
        $("#upper-parent").text(val);
        metronome.upper = val;

        if (metronome.status == "play")
            metronome.start(true);
    });

});

var metronome = {
    init: function(bpm, upper, lower) {
        this._cnt = 0;
        this._loaded = 0;
        this.status = "pause";

        this.bpm = bpm;
        this.upper = upper;
        this.lower = lower;
        this._playing = false;
        this._initialized = true;

        this._audio1 = soundManager.createSound({
            multiShot: false,
            url: 'media/beat1.wav',
            autoLoad: true,
            onload: $.proxy(this.load, this)
        });

        this._audio2 = soundManager.createSound({
            multiShot: false,
            url: 'media/beat2.wav',
            autoLoad: true,
            onload: $.proxy(this.load, this)
        });
    },

    load: function() {
        this._loaded += 1;
        if (this._loaded == 2) {
            $("#control-button").removeClass("disabled");
        }
    },

    turn: function() {
        if (this.status == "pause") {
            this.status = "play";
            this.start();
        } else {
            this.status = "pause";
            this.stop();
        }
    },

    _click: function() {
        if (this._cnt >= this.upper)
            this._cnt = 0;

        if (this._cnt == 0) {
            this._audio1.play();
        } else {
            this._audio2.play();
        }
        this._cnt += 1;
    },

    start: function(force) {
        if (this.playing && !force)
            return;

        if (!this._initialized)
            return;

        this._playing = true;
        window.clearInterval(this.tick);

        var self = this;
        this.tick = window.setInterval(
            $.proxy(this._click, this),
            60 / this.bpm * 1000 / this.lower * 4);
    },

    stop: function() {
        this._cnt = 0;
        this._playing = false;
        this._audio1.stop();
        this._audio2.stop();
        window.clearInterval(this.tick);
    }
}