(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Scripts/controller/dataScript.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '191c8YcqW9NYql3hC0bgshx', 'dataScript', __filename);
// Scripts/controller/dataScript.js

'use strict';

// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html

cc.Class({
    extends: cc.Component,

    start: function start() {
        Global.dataScript = this.node.getComponent('dataScript');
        this.getScore();
    },


    getScore: function getScore(savestr, saveobj) {
        if (typeof FBInstant === 'undefined') return;

        Global.fbname = FBInstant.player.getName();
        Global.fbphoto = FBInstant.player.getPhoto();
        var sdkversion = FBInstant.getSDKVersion();

        FBInstant.player.getDataAsync(['maxscore', 'starnum']).then(function (data) {
            if (typeof data['maxscore'] !== 'undefined') {
                Global.fbScore = data['maxscore'];
            } else {
                Global.fbScore = 0;
            }

            if (Global.startUI) {
                Global.startUI.updateBestScore();
            }
        });
    },

    saveScore: function saveScore(maxScore) {
        if (typeof FBInstant === 'undefined') return;
        if (maxScore > Global.fbScore) {
            FBInstant.player.setDataAsync({
                maxscore: maxScore
            }).then(function () {
                Global.fbScore = maxscore;
            });

            var strNameAndPhoto = Global.fbname + '_' + Global.fbphoto;
            //更新排行榜
            FBInstant.getLeaderboardAsync('my_allrank').then(function (leaderboard) {
                return leaderboard.setScoreAsync(maxScore, strNameAndPhoto);
            }).then(function (entry) {}).catch(function (error) {
                Global.game.addLogStr(error);
            });
        }
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
        //# sourceMappingURL=dataScript.js.map
        