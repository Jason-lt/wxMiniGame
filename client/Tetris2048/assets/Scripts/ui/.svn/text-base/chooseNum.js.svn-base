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
        gridControllerScript: null,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        this.gridControllerScript = Global.gridController.getComponent("gridController");
    },

    choose2: function () {
        this.gridControllerScript.randomScore = 2;
        this.gridControllerScript.createItem2();
        this.gridControllerScript.hideChooseNum();
    },
    choose4: function () {
        this.gridControllerScript.randomScore = 4;
        this.gridControllerScript.createItem2();
        this.gridControllerScript.hideChooseNum();
    },
    choose8: function () {
        this.gridControllerScript.randomScore = 8;
        this.gridControllerScript.createItem2();
        this.gridControllerScript.hideChooseNum();
    },
    choose16: function () {
        this.gridControllerScript.randomScore = 16;
        this.gridControllerScript.createItem2();
        this.gridControllerScript.hideChooseNum();
    },
    choose32: function () {
        this.gridControllerScript.randomScore = 32;
        this.gridControllerScript.createItem2();
        this.gridControllerScript.hideChooseNum();
    },
    choose64: function () {
        this.gridControllerScript.randomScore = 64;
        this.gridControllerScript.createItem2();
        this.gridControllerScript.hideChooseNum();
    },

    close: function () {
        this.gridControllerScript.createItem2();
        this.gridControllerScript.hideChooseNum();
    },
});