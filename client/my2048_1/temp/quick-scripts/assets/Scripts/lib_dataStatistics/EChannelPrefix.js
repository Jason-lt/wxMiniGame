(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Scripts/lib_dataStatistics/EChannelPrefix.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '62a43Hv1vhHdqQ1BvyayojQ', 'EChannelPrefix', __filename);
// Scripts/lib_dataStatistics/EChannelPrefix.js

"use strict";

//分享场景值
module.exports = {
    regular: "regular", //常规 右上角。。。菜单的分享
    invitation: "invitation", //页面邀请  页面中的常规邀请按钮 (礼包盒子的邀请好友拿礼包)
    resurrection: "resurrection", //复活（复活时分享）
    result: "result", //分享成绩（在结果页面分享自己的成绩
    activity: "activity", //运营活动（运营活动，每日任务）
    grouprank: "grouprank", //群排行榜 （小游戏群排行榜的转发）
    gift: "gift", //道具（已获得道具）
    groupcontrol: "groupcontrol", //群控（不明）
    wechatmp: "wechatmp", //微信mp(不明)
    oaad: "oaad", //公众号投放（公众号中插入的小程序码 链接形式）
    momentad: "momentad", //朋友圈广告投放（朋友圈广告投放)
    pageshare: "pageshare" //页面分享（底部的圆形按钮）
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
        //# sourceMappingURL=EChannelPrefix.js.map
        