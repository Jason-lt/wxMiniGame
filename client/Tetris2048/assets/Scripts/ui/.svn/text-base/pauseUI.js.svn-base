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
        soundOnBtn: {
            default: null,
            type: cc.Node
        },
        soundOffBtn: {
            default: null,
            type: cc.Node
        },
    },

    // LIFE-CYCLE CALLBACKS:
    onLoad: function () {
        this.initAudio();
    },

    initAudio: function () {
        this.soundOnBtn.active = Global.isBGMPlaying;
        this.soundOffBtn.active = !Global.isBGMPlaying;
    },

    // onLoad () {},
    toHome: function () {
        Global.game.playSound('btn', 0.1);
        Global.isPaused = false;
        Global.gridController.getComponent('gridController').onMainScene();
    },

    play: function () {
        Global.game.playSound('btn', 0.1);
        var gridController = Global.gridController.getComponent('gridController');
        if (Global.isPaused) {
            if (gridController.bornGrid) {
                gridController.bornGrid.resumeAllActions();
            }
            gridController.node.resumeAllActions();
            this.node.active = false;
            Global.isPaused = false;
        } else {
            gridController.bornGrid.pauseAllActions();
            gridController.node.pauseAllActions();

            this.node.active = true;
            this.node.setLocalZOrder(1);
        }

        // if (cc.director.isPaused()) {
        //     cc.director.resume();
        //     this.node.active = false;
        // } else {
        //     cc.director.pause();
        //     this.node.active = true;
        //     this.node.setLocalZOrder(10);
        // }
    },

    replay: function () {
        Global.game.playSound('btn', 0.1);
        var gridController = Global.gridController.getComponent('gridController');
        gridController.onRestart();
    },

    //关闭暂停界面
    close: function () {
        this.play();
    },

    switchBGM: function () {
        Global.game.playSound('btn', 0.1);
        Global.startUI.switchBGM();
        this.initAudio();
    },
});