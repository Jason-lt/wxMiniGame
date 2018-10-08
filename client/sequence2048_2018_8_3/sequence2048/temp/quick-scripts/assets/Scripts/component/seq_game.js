(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Scripts/component/seq_game.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '1b91cnRx8FAMbpMtpRqct+L', 'seq_game', __filename);
// Scripts/component/seq_game.js

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
        scoreNode: cc.Node,
        gridNode: cc.Node,
        bottomNode: cc.Node,
        itemPrefab: cc.Prefab,
        gridPrefab: cc.Prefab
    },

    onLoad: function onLoad() {
        if (wxGame.GlobalFuncs.isEmptyObject(wxGame.saveGameInfo)) {
            wxGame.GlobalFuncs.greenHandUI();
        }
    },

    onClickPauseBtn: function onClickPauseBtn() {
        wxGame.wxBannerAd.destroyBannerAd();
        wxGame.GlobalFuncs.showPauseUI();
    }

    // update (dt) {},
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
        //# sourceMappingURL=seq_game.js.map
        