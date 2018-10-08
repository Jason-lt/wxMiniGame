(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Scripts/AudioManager.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '0ef16tO8OpLzbhI+c+jRtPz', 'AudioManager', __filename);
// Scripts/AudioManager.js

"use strict";

/*
    音效管理
 */

wxGame.AudioManager = {
    loadNode: function loadNode() {
        var that = this;
        if (!that.audioNode) {
            cc.loader.loadRes('prefab/audioNode', function (err, prefab) {
                var preFabNode = cc.instantiate(prefab);
                that.audioNode = preFabNode;
                cc.game.addPersistRootNode(preFabNode);
                that.isPlayMusic = true;
            });
        }
    },

    playEffect: function playEffect(eName, volume) {
        if (!this.isPlayMusic || !this.audioNode) {
            return;
        }
        var com = this.audioNode.getComponent("audioNode");
        com.playEffect(eName, volume);
    }

    // playMusic:function(mName,volume){
    //     if (!this.isPlayMusic || !this.audioNode) {
    //         return;
    //     }
    //
    //     if (this.bgMusic && this.bgMusic > -1) {
    //         cc.audioEngine.resume(this.bgMusic);
    //     }
    //
    //     var that = this;
    //     cc.loader.loadRes("audio/" + mName, cc.AudioClip, function (err, clip) {
    //         that.bgMusic = cc.audioEngine.play(clip, false, volume || 0.2);
    //         cc.audioEngine.setLoop(that.bgMusic, true);
    //         cc.audioEngine.setVolume(that.bgMusic, volume || 0.2); // 0.2
    //         // var volume = cc.audioEngine.getVolume(that.bgMusic);
    //     });
    // },
    //
    // stopMusic:function(){
    //     if (this.bgMusic > -1) {
    //         cc.audioEngine.pause(this.bgMusic);
    //     }
    // },
};

//与audioNode 控件属性名一样
wxGame.AudioManager.AudioType = {
    bomb: "bombAudio",
    btnEffect: "btnAudio",
    leave: "leaveAudio",
    merge: "mergeAudio",
    powerful: "powerfulAudio",
    select: "selectAudio"
};

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
        //# sourceMappingURL=AudioManager.js.map
        