"use strict";
cc._RF.push(module, '0131ek9+YdCY7cDr+bbqAsq', 'chooseNum');
// Scripts/ui/chooseNum.js

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
        gridControllerScript: null
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start: function start() {
        this.gridControllerScript = Global.gridController.getComponent("gridController");
    },


    choose2: function choose2() {
        this.gridControllerScript.randomScore = 2;
        this.gridControllerScript.createItem2();
        this.gridControllerScript.hideChooseNum();
    },
    choose4: function choose4() {
        this.gridControllerScript.randomScore = 4;
        this.gridControllerScript.createItem2();
        this.gridControllerScript.hideChooseNum();
    },
    choose8: function choose8() {
        this.gridControllerScript.randomScore = 8;
        this.gridControllerScript.createItem2();
        this.gridControllerScript.hideChooseNum();
    },
    choose16: function choose16() {
        this.gridControllerScript.randomScore = 16;
        this.gridControllerScript.createItem2();
        this.gridControllerScript.hideChooseNum();
    },
    choose32: function choose32() {
        this.gridControllerScript.randomScore = 32;
        this.gridControllerScript.createItem2();
        this.gridControllerScript.hideChooseNum();
    },
    choose64: function choose64() {
        this.gridControllerScript.randomScore = 64;
        this.gridControllerScript.createItem2();
        this.gridControllerScript.hideChooseNum();
    },

    close: function close() {
        this.gridControllerScript.createItem2();
        this.gridControllerScript.hideChooseNum();
    }
});

cc._RF.pop();