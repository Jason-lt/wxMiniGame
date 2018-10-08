(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Scripts/common/audioManager.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '27cdc0xxpFA/oT2Q8XQVVLX', 'audioManager', __filename);
// Scripts/common/audioManager.js

'use strict';

var _audioManager = {

    resource: {},
    bgm: {},

    init: function init() {},
    regist: function regist(name, audioSource) {
        if (this.resource[name]) {
            console.log('音频资源已存在: ', name);
        }
        this.resource[name] = audioSource;
    },
    registBGM: function registBGM(name, audioClip) {
        if (this.bgm[name]) {
            console.log('BGM音频资源已存在: ', name);
        }
        this.bgm[name] = audioClip;
    },
    unregist: function unregist(name) {
        if (this.resource[name]) {
            this.resource[name] = null;
        } else {
            console.log('音频资源不存在: ', name);
            return;
        }
    },
    unregistAll: function unregistAll() {
        this.resource = {};
    },
    play: function play(name) {
        // 微信上不能改变音量,所以只能先这么处理;
        if (this.isMute) {
            return;
        }
        if (this.resource[name]) {
            this.resource[name].play();
        } else {
            console.log('音频资源不存在: ', name);
            return;
        }
    },
    stop: function stop(name) {
        if (this.resource[name]) {
            this.resource[name].play();
        } else {
            console.log('音频资源不存在: ', name);
            return;
        }
    },
    pause: function pause(name) {
        if (this.resource[name]) {
            this.resource[name].pause();
        } else {
            console.log('音频资源不存在: ', name);
            return;
        }
    },
    resume: function resume(name) {
        // 微信上不能改变音量,所以只能先这么处理;
        if (this.isMute) {
            return;
        }
        if (this.resource[name]) {
            this.resource[name].resume();
        } else {
            console.log('音频资源不存在: ', name);
            return;
        }
    },
    mute: function mute(isMute) {
        this.isMute = isMute;
        for (var key in this.resource) {
            if (this.resource.hasOwnProperty(key)) {
                this.resource[key].mute = isMute;
            }
        }
        if (isMute) {
            cc.audioEngine.setVolume(0);
            this.pauseAll();
        } else {
            cc.audioEngine.setVolume(1);
            this.resumeAll();
        }
    },
    stopAll: function stopAll() {
        for (var key in this.resource) {
            if (this.resource.hasOwnProperty(key)) {
                this.resource[key].stop();
            }
        }
    },
    pauseAll: function pauseAll() {
        for (var key in this.resource) {
            if (this.resource.hasOwnProperty(key)) {
                this.resource[key].pause();
            }
        }
    },
    resumeAll: function resumeAll() {
        // 微信上不能改变音量,所以只能先这么处理;
        if (this.isMute) {
            return;
        }
        for (var key in this.resource) {
            if (this.resource.hasOwnProperty(key)) {
                this.resource[key].resume();
            }
        }
    },
    playBGM: function playBGM(name, isLoop, finishCallback) {
        console.log('playBGM', name, isLoop);
        if (this.isMute) {
            return;
        }
        if (this.bgm[name]) {
            var self = this;
            this.loadRemoteSource(this.bgm[name], function (audio) {
                console.log('current play bgm', name, audio);
                self.currentBGM = cc.audioEngine.play(audio, isLoop, 1);
                console.log('current bgm id', self.currentBGM);
                if (!isLoop) {
                    cc.audioEngine.setFinishCallback(self.currentBGM, function () {
                        self.currentBGM = null;
                        if (finishCallback) {
                            finishCallback();
                        }
                    });
                }
            });
        }
    },
    stopBGM: function stopBGM() {
        if (typeof this.currentBGM == 'number') {
            cc.audioEngine.stop(this.currentBGM);
        }
    },
    loopBGM: function loopBGM() {
        var list = [];
        for (var key in this.bgm) {
            if (this.bgm.hasOwnProperty(key)) {
                var name = this.bgm[key];
                list.push(key);
            }
        }
        console.log('play loop bgm', list);
        var self = this;

        var _loopfunc = null;
        _loopfunc = function loopfunc() {
            self.loopBGMid = Math.floor(Math.random() * list.length);
            self.playBGM(list[self.loopBGMid], false, _loopfunc);
            console.log('now playing :', list[self.loopBGMid]);
        };
        this.loopBGMid = Math.floor(Math.random() * list.length);
        console.log('now playing :', list[self.loopBGMid]);
        this.playBGM(list[self.loopBGMid], false, _loopfunc);
    },
    loadRemoteSource: function loadRemoteSource(url, callback, failedCallback) {
        cc.loader.load(url, function (err, audio) {
            if (err) {
                console.log('load error', err);
                if (failedCallback) {
                    failedCallback();
                }
                return;
            }
            if (callback) {
                callback(audio);
            }
        });
    },
    pauseBGM: function pauseBGM() {
        console.log('pause bgm', this.currentBGM);
        if (typeof this.currentBGM == 'number') {
            cc.audioEngine.pause(this.currentBGM);
        }
    },
    resumeBGM: function resumeBGM() {
        console.log('resume bgm', this.currentBGM);
        if (typeof this.currentBGM == 'number') {
            cc.audioEngine.resume(this.currentBGM);
        }
    }
};

module.exports = _audioManager;

cc._RF.pop();
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=audioManager.js.map
        