(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Scripts/sdk_readygo/lib/code.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '6c46c/ZlwpLK7ys7clP80Ps', 'code', __filename);
// Scripts/sdk_readygo/lib/code.js

"use strict";

module.exports = { normal: { code: 0, msg: "" }, sessionError: { code: -1001, msg: "会话ID错误" }, paySuccess: { code: 10401, msg: "支付成功" }, paySuccessDelay: { code: 10400, msg: "支付成功，到账可能延迟" }, orderCancel: { code: 10402, msg: "订单被取消" }, payUnEnd: { code: 10411, msg: "支付轮询还没结束" }, unSupportPay: { code: 10406, msg: "当前暂不支持充值" }, requestFail: { code: -10110, msg: '网络超时,请求失败' }, paramError: { code: -10111, msg: '参数不正确' }, payError: { code: 10407, msg: '米大师支付失败' }, midasPayCancel: { code: 10408, msg: '用户取消了米大师支付' }, midasPayError: { code: 30110, msg: "米大师支付：扣除游戏币失败" }, illegalOrderError: { code: 30114, msg: "非法订单号" }, getGameConfigError: { code: 30115, msg: "获取游戏配置失败" }, unknowError: { code: 100000, msg: '未知错误' } };

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
        //# sourceMappingURL=code.js.map
        