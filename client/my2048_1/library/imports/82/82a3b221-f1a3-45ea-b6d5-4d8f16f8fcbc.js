"use strict";
cc._RF.push(module, '82a3bIh8aNF6rbVTY8W+Py8', 'UITitleInfo');
// Scripts/ui/UITitleInfo.js

'use strict';

var ThirdAPI = require('../common/ThirdAPI');
var loadAtlas = require("LoadAtlas");

cc.Class({
    extends: cc.Component,

    properties: {
        // buttonFlaunt 节点，炫耀
        buttonFlaunt: {
            default: null,
            type: cc.Node
        },
        // buttonClose 节点，关闭
        buttonClose: {
            default: null,
            type: cc.Node
        },
        // 成就名标签
        titleName: {
            default: null,
            type: cc.Label
        },
        // 成就描述标签
        titleDescription: {
            default: null,
            type: cc.Label
        },
        // 成就奖励标签
        titleGet: {
            default: null,
            type: cc.Label
        },
        // 成就日期标签
        titleDate: {
            default: null,
            type: cc.Label
        },
        // 星星分数标签
        labelPropScore: {
            default: null,
            type: cc.Label
        },
        // 星星分数图标
        iconPropScore: {
            default: null,
            type: cc.Node
        },
        goldNum: 0,
        showGold: 0
    },

    // LIFE-CYCLE CALLBACKS:

    // start () {},

    onLoad: function onLoad() {
        // 注册按钮
        this.buttonClose.on('click', this.onClose, this);
        this.buttonFlaunt.on('click', this.onFlaunt, this);

        this.reset();
    },


    // 初始化商店
    initData: function initData(titleName, titleDescription, titleGet, titleDate) {
        this.labelPropScore.string = Global.wxGold;

        this.titleName.string = titleName;
        this.titleDescription.string = titleDescription;
        this.titleGet.string = '获得' + titleGet;
        this.titleDate.string = '达成日期：' + titleDate;
    },

    // 设置分数
    addPropScore: function addPropScore(n) {
        //console.log('星星增加', Global.wxGold, n);
        this.showGold = Global.wxGold;
        Global.wxGold += n;
        //this.labelPropScore.string = Global.wxGold;
        Global.game.saveScore();

        //this.reset();
        this.goldNum = Global.wxGold;
        this.schedule(this.updateLabel, 0.18);

        this.iconPropScore.runAction(cc.sequence(cc.scaleTo(0.5, 1.2), cc.scaleTo(0.5, 1.0), cc.scaleTo(0.5, 1.2), cc.scaleTo(0.5, 1.0)));
    },

    // 按钮回调：关闭
    onClose: function onClose() {
        Global.game.playSound('btn', 0.1);
        //console.log("关闭成就查看");

        if (this.node.parent) {
            this.node.parent.removeChild(this.node);
        }
    },

    // 按钮回调：炫耀
    onFlaunt: function onFlaunt() {
        Global.game.playSound('btn', 0.1);
        //console.log("成就炫耀");
        Global.game.playSound('btn', 0.1);
        if (typeof FBInstant !== 'undefined') {
            ThirdAPI.shareGame(this.getImgBase64());
        } else {
            ThirdAPI.shareGame('randomImg', null, null, '244');
        }

        return;
        if (typeof FBInstant === 'undefined') return;
        FBInstant.shareAsync({
            intent: 'SHARE',
            image: this.getImgBase64(),
            text: 'Protect Tetris2048！',
            data: {
                myReplayData: '...'
            }
        }).then(function () {
            // continue with the game.
        });
    },

    updateLabel: function updateLabel(dt) {
        if (this.showGold >= this.goldNum) {
            this.unschedule(this.updateLabel);
            return;
        }

        this.showGold += 1;
        this.labelPropScore.string = this.showGold;
    },


    reset: function reset() {
        this.goldNum = 0;
        this.showGold = -1;
    },

    // 截屏返回 iamge base6，用于 Share
    getImgBase64: function getImgBase64() {
        var target = cc.find('Canvas');
        var width = parseInt(target.width),
            height = parseInt(target.height);
        var renderTexture = new cc.RenderTexture(width, height);
        renderTexture.begin();
        target._sgNode.visit();
        renderTexture.end();
        //
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        canvas.width = width;
        canvas.height = height;
        if (cc._renderType === cc.game.RENDER_TYPE_CANVAS) {
            var texture = renderTexture.getSprite().getTexture();
            var image = texture.getHtmlElementObj();
            ctx.drawImage(image, 0, 0);
        } else if (cc._renderType === cc.game.RENDER_TYPE_WEBGL) {
            var buffer = gl.createFramebuffer();
            gl.bindFramebuffer(gl.FRAMEBUFFER, buffer);
            var _texture = renderTexture.getSprite().getTexture()._glID;
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, _texture, 0);
            var data = new Uint8Array(width * height * 4);
            gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, data);
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            var rowBytes = width * 4;
            for (var row = 0; row < height; row++) {
                var srow = height - 1 - row;
                var data2 = new Uint8ClampedArray(data.buffer, srow * width * 4, rowBytes);
                var imageData = new ImageData(data2, width, 1);
                ctx.putImageData(imageData, 0, row);
            }
        }
        cc.log('to share');
        return canvas.toDataURL('image/png');
    }
});

cc._RF.pop();