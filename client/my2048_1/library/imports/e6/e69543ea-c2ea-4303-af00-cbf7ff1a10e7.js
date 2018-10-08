"use strict";
cc._RF.push(module, 'e6954PqwupDA68Ay/f/GhDn', 'LoadAtlas');
// Scripts/common/LoadAtlas.js

'use strict';

var LoadAtlas = {
    spriteAtlas: [],

    //导入一个资源
    loadAtlasRes: function loadAtlasRes(atlasUrl, callBack) {
        if (this.spriteAtlas.indexOf(atlasUrl) > -1) {
            callBack();
            return;
        }
        var self = this;
        cc.loader.loadRes(atlasUrl, cc.SpriteAtlas, function (err, atlas) {
            //图集精灵帧数组
            var resArray = atlas.getSpriteFrames();
            var spriteArrays = [];
            for (var i = 0; i < resArray.length; i++) {
                var spriteFrame = resArray[i];
                spriteArrays[spriteFrame.name] = spriteFrame;
            }
            self.spriteAtlas[atlasUrl] = spriteArrays;
            callBack();
        });
    },

    //根据名称来获取一个精灵帧
    getSpriteFrameFromName: function getSpriteFrameFromName(atlasUrl, spriteName) {
        return this.spriteAtlas[atlasUrl][spriteName];
    },

    //加载prefab资源
    loadPrefab: function loadPrefab(prefabName, callBack) {
        cc.loader.loadRes('prefab/' + prefabName, cc.Prefab, function (err, prefab) {
            if (callBack) {
                callBack(prefab);
            }
        });
    }
};

module.exports = LoadAtlas;

cc._RF.pop();