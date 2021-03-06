let ThirdAPI = require('../common/ThirdAPI')
var loadAtlas = require("LoadAtlas")

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
            type: cc.Label,
        },
        // 成就描述标签
        titleDescription: {
            default: null,
            type: cc.Label,
        },
        // 成就奖励标签
        titleGet: {
            default: null,
            type: cc.Label,
        },
        // 成就日期标签
        titleDate: {
            default: null,
            type: cc.Label,
        },
        // 钻石分数标签
        labelPropScore: {
            default: null,
            type: cc.Label,
        },
        // 钻石分数图标
        iconPropScore: {
            default: null,
            type: cc.Node,
        },
        goldNum: 0,
        showGold: 0,
    },

    // LIFE-CYCLE CALLBACKS:

    // start () {},

    onLoad() {
        // 注册按钮
        this.buttonClose.on('click', this.onClose, this);
        this.buttonFlaunt.on('click', this.onFlaunt, this);

        this.reset();
    },

    // 初始化商店
    initData: function (titleName, titleDescription, titleGet, titleDate) {
        this.labelPropScore.string = Global.wxGold;

        this.titleName.string = titleName;
        this.titleDescription.string = titleDescription;
        this.titleGet.string = '获得' + titleGet;
        this.titleDate.string = '达成日期：' + titleDate;
    },

    // 设置分数
    addPropScore: function (n) {
        //console.log('钻石增加', Global.wxGold, n);
        this.showGold = Global.wxGold;
        Global.wxGold += n;
        //this.labelPropScore.string = Global.wxGold;
        Global.game.saveScore();

        //this.reset();
        this.goldNum = Global.wxGold;
        this.schedule(this.updateLabel, 0.18);

        this.iconPropScore.runAction(
            cc.sequence(cc.scaleTo(0.5, 1.2), cc.scaleTo(0.5, 1.0), cc.scaleTo(0.5, 1.2), cc.scaleTo(0.5, 1.0)));
    },

    // 按钮回调：关闭
    onClose: function () {
        Global.game.playSound('btn', 0.1);
        //console.log("关闭成就查看");

        if (this.node.parent) {
            this.node.parent.removeChild(this.node);
        }
    },

    // 按钮回调：炫耀
    onFlaunt: function () {
        Global.game.playSound('btn', 0.1);
        //console.log("成就炫耀");
        Global.game.playSound('btn', 0.1);
        if (typeof FBInstant !== 'undefined') {
            ThirdAPI.shareGame(this.getImgBase64());
        } else {
            ThirdAPI.shareGame('randomImg', null, null, '003');
        }

        return;
        if (typeof FBInstant === 'undefined') return;
        FBInstant.shareAsync({
            intent: 'SHARE',
            image: this.getImgBase64(),
            text: 'Protect Tetris2048！',
            data: {
                myReplayData: '...'
            },
        }).then(() => {
            // continue with the game.
        });
    },

    updateLabel(dt) {
        if (this.showGold >= this.goldNum) {
            this.unschedule(this.updateLabel);
            return;
        }

        this.showGold += 1;
        this.labelPropScore.string = this.showGold;
    },

    reset: function () {
        this.goldNum = 0;
        this.showGold = -1;
    },

    // 截屏返回 iamge base6，用于 Share
    getImgBase64: function () {
        let target = cc.find('Canvas');
        let width = parseInt(target.width),
            height = parseInt(target.height);
        let renderTexture = new cc.RenderTexture(width, height);
        renderTexture.begin();
        target._sgNode.visit();
        renderTexture.end();
        //
        let canvas = document.createElement('canvas');
        let ctx = canvas.getContext('2d');
        canvas.width = width;
        canvas.height = height;
        if (cc._renderType === cc.game.RENDER_TYPE_CANVAS) {
            let texture = renderTexture.getSprite().getTexture();
            let image = texture.getHtmlElementObj();
            ctx.drawImage(image, 0, 0);
        } else if (cc._renderType === cc.game.RENDER_TYPE_WEBGL) {
            let buffer = gl.createFramebuffer();
            gl.bindFramebuffer(gl.FRAMEBUFFER, buffer);
            let texture = renderTexture.getSprite().getTexture()._glID;
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
            let data = new Uint8Array(width * height * 4);
            gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, data);
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            let rowBytes = width * 4;
            for (let row = 0; row < height; row++) {
                let srow = height - 1 - row;
                let data2 = new Uint8ClampedArray(data.buffer, srow * width * 4, rowBytes);
                let imageData = new ImageData(data2, width, 1);
                ctx.putImageData(imageData, 0, row);
            }
        }
        cc.log('to share');
        return canvas.toDataURL('image/png');
    },
});