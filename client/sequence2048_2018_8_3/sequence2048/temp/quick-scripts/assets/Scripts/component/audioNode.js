(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Scripts/component/audioNode.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '28944Jkjb9MSJr1xtP1craw', 'audioNode', __filename);
// Scripts/component/audioNode.js

"use strict";

// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        //背景音乐
        backgroundAudio: {
            url: cc.AudioClip,
            default: null
        },

        //
        bombAudio: {
            url: cc.AudioClip,
            default: null
        },

        mergeAudio: {
            url: cc.AudioClip,
            default: null
        },
        leaveAudio: {
            url: cc.AudioClip,
            default: null
        },
        powerfulAudio: {
            url: cc.AudioClip,
            default: null
        },
        selectAudio: {
            url: cc.AudioClip,
            default: null
        },
        btnAudio: {
            url: cc.AudioClip,
            default: null
        }
    },

    onLoad: function onLoad() {
        // bomb:"bomb",
        //     btnEffect:"btn",
        //     leave:"leave",
        //     merge:"merge",
        //     powerful:"powerful",
        //     select:"select",
    },

    playEffect: function playEffect(eName, volume) {

        // var audioSource = this.node.getComponent(cc.AudioSource);
        // audioSource.clip = this[eName];
        // audioSource.volume = volume;
        // audioSource.rewind();
        this[eName + "eff"] = cc.audioEngine.playEffect(this[eName], false, volume);
        var self = this;
        if (self[eName + "eff"] > 0) {
            cc.audioEngine.setFinishCallback(self[eName + "eff"], function () {
                self.playAudioEnd(self[eName + "eff"]);
            });
        }
    },

    playAudioEnd: function playAudioEnd(audioIng) {
        cc.audioEngine.uncache(audioIng);
    }
});

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
        //# sourceMappingURL=audioNode.js.map
        