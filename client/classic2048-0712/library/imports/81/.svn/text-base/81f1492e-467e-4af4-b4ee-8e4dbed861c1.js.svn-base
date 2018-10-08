"use strict";
cc._RF.push(module, '81f14kuRn5K9LTujk2+2GHB', 'rankItem');
// Scripts/ui/rankItem.js

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

    properties: {
        bg: {
            default: null,
            type: cc.Node
        },
        photo: {
            default: null,
            type: cc.Sprite
        },
        fbname: {
            default: null,
            type: cc.Label
        },
        score: {
            default: null,
            type: cc.Label
        },
        level: {
            default: null,
            type: cc.Label
        },
        levelIcon: {
            default: null,
            type: cc.Sprite
        }
    },

    hideAll: function hideAll() {
        // this.bg.node.setLocalZOrder(-1);
        //this.levelIcon.setVisible(false);
        //this.level.string = '';

        this.bg.setCascadeOpacityEnabled(true);
        this.bg.setOpacity(255 * 0.3);
        this.score.string = '';
        this.fbname.string = '';
        this.photo.setVisible(false);
    },

    setScore: function setScore(score) {
        this.score.string = score;
    },

    setNameAndPhoto: function setNameAndPhoto(strnamephoto) {
        var self = this;
        var startIndx = strnamephoto.indexOf('_');
        if (startIndx > 0) {
            var fbname = strnamephoto.substring(0, startIndx);
            var fbphoto = strnamephoto.substring(startIndx + 1);
            this.photo.setVisible(true);

            this.fbname.string = fbname;
            cc.loader.load(fbphoto, function (err, texture) {
                self.photo.spriteFrame = new cc.SpriteFrame(texture);
            });
        }
    },

    setlevel: function setlevel(level) {
        this.level.string = level;
        var LoadAlas = require("LoadAtlas");
        var icon = '';

        if (level > 0 && level <= 3) {
            icon = 'rank_' + level;
        }

        if (icon == '') {
            this.levelIcon.setVisible(false);
        } else {
            this.levelIcon.setVisible(true);
            this.levelIcon.spriteFrame = LoadAlas.getSpriteFrameFromName('textures/gridItem/items', icon);
        }
    }
});

cc._RF.pop();