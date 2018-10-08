(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Scripts/common/LoadAtlas.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'e6954PqwupDA68Ay/f/GhDn', 'LoadAtlas', __filename);
// Scripts/common/LoadAtlas.js

"use strict";

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
    }
};

module.exports = LoadAtlas;

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
        //# sourceMappingURL=LoadAtlas.js.map
        