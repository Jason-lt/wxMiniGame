(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Scripts/component/addGuide.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '2fd3dikQt9AJp/EodQAB/Gf', 'addGuide', __filename);
// Scripts/component/addGuide.js

'use strict';

//添加小程序
ctr.addGuide = {
    sp: null,
    hand: null,
    //引导节点
    guideNode: null,
    //添加到小程序的图url
    spUrl: 'textures/add',
    //添加到小程序的手url
    handurl: 'textures/hand',
    hasInit: false,
    nodeHeight: 0,
    isFromMyApp: false,

    //初始化
    init: function init() {
        this.hasInit = true;
        var self = this;
        self.guideNode = new cc.Node('guideNode');

        self.sp = new cc.Node('sp');
        self.sp.addComponent(cc.Sprite);

        self.hand = new cc.Node('hand');
        self.hand.addComponent(cc.Sprite);

        self.guideNode.addChild(self.sp);
        self.guideNode.addChild(self.hand);

        cc.loader.loadRes(self.spUrl, cc.SpriteFrame, function (err, spriteFrame) {
            var _sprite = self.sp.getComponent(cc.Sprite);
            _sprite.spriteFrame = spriteFrame;
            self.loadComplete();
        });

        cc.loader.loadRes(self.handurl, cc.SpriteFrame, function (err, spriteFrame) {
            var _sprite = self.hand.getComponent(cc.Sprite);
            _sprite.spriteFrame = spriteFrame;
            self.loadComplete();
        });
    },

    setIsFromMyApp: function setIsFromMyApp(vSceneId) {
        if (tywx.showScene == '1104') {
            this.isFromMyApp = true;
        }
    },

    loadComplete: function loadComplete() {
        var sprite1 = this.sp.getComponent(cc.Sprite).spriteFrame;
        var sprite2 = this.hand.getComponent(cc.Sprite).spriteFrame;

        if (sprite1 && sprite2) {
            this.nodeHeight = Math.max(sprite1.getRect().height, sprite2.getRect().height);
            this.hand.position = cc.p(-sprite2.getRect().width / 2, 0);
            this.sp.position = cc.p(-sprite2.getRect().width - sprite1.getRect().width / 2 - 18, 0);
            this.showEffect();
        }
    },

    showEffect: function showEffect() {
        var sprite1 = this.sp.getComponent(cc.Sprite).spriteFrame;
        var sprite2 = this.hand.getComponent(cc.Sprite).spriteFrame;
        if (sprite1 && sprite2) {
            this.hand.stopAllActions();
            var _act1 = cc.moveTo(0.8, cc.p(-sprite2.getRect().width / 2 + 8, 0));
            var _act2 = cc.moveTo(0.8, cc.p(-sprite2.getRect().width / 2 - 8, 0));
            var rep = cc.repeatForever(cc.sequence(_act1, _act2));
            this.hand.runAction(rep);
        }
    },

    //显示引导
    show: function show() {
        if (typeof wx === 'undefined') {
            return;
        }
        this.setIsFromMyApp();

        if (this.isFromMyApp) {
            return;
        }
        if (!this.hasInit) {
            this.init();
        }
        if (this.guideNode.parent) {
            this.guideNode.parent.removeChild(this.guideNode);
        }
        this.guideNode.active = true;
        var vSysInfo = wx.getSystemInfoSync();
        var pos = this.caculateHandNodePosition();
        this.guideNode.position = cc.p(pos[1], pos[0]);
        //Global.ui.node.addChild(that.guideNode);
        cc.game.addPersistRootNode(this.guideNode);

        this.showEffect();
    },

    //隐藏引导
    hide: function hide() {
        if (this.guideNode) {
            this.guideNode.active = false;
        }
    },

    caculateHandNodePosition: function caculateHandNodePosition() {
        if (typeof wx === 'undefined') {
            return;
        }
        var vSysInfo = wx.getSystemInfoSync();

        var size = cc.director.getWinSize();
        var isFitIphoneX = vSysInfo.model && vSysInfo.model.toLowerCase().replace(/\s+/g, "").indexOf("iphonex", 0) != -1;
        var dy = cc.winSize.width - cc.winSize.width / vSysInfo.windowWidth * 100 - 10;
        var dx = size.height - size.height / vSysInfo.windowHeight * 25;
        if (isFitIphoneX) {
            dx = size.height - size.height / vSysInfo.windowHeight * 60;
        }
        return [dx, dy];
    }

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
        //# sourceMappingURL=addGuide.js.map
        