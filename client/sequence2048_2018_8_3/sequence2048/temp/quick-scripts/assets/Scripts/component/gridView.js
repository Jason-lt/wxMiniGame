(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Scripts/component/gridView.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'cc588csIj9C2o/X4Qw/5zxU', 'gridView', __filename);
// Scripts/component/gridView.js

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
        coltSprite: cc.Node,
        item: null,
        kuang: cc.Node
    },

    onLoad: function onLoad() {
        var gridInfo = wxGame.Global.gridInfo;
        this.node.setContentSize(gridInfo.width, gridInfo.height);
        wxGame.NotificationCenter.listen(wxGame.EventType.HIDE_GRID_KUANG, this.ShowKunag, this);
        wxGame.NotificationCenter.listen(wxGame.EventType.GAME_OVER_RESET, this.resetData, this);
    },

    hideColtSprite: function hideColtSprite(isShow) {
        this.coltSprite.active = isShow || false;
    },

    ShowKunag: function ShowKunag(isSHow, isOne) {
        if (this.kuang) {
            if (this.item) {
                // this.kuang.active = false;
                this.hideColtSprite(false);
                this.kuang.active = isSHow;
                if (!isSHow) {
                    this.item.setIsGridSelect(false);
                }
            } else {
                this.kuang.active = isSHow;
            }
        }
    },

    ShowLastKuang: function ShowLastKuang(isSHow) {
        this.kuang.active = isSHow;
    },

    getRootNode: function getRootNode() {
        return this.node;
    },

    setIndex: function setIndex(hIndex, vIndex, par) {
        this.hIndex = hIndex;
        this.vIndex = vIndex;
        this.parent = par;
    },

    resetData: function resetData() {}

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
        //# sourceMappingURL=gridView.js.map
        