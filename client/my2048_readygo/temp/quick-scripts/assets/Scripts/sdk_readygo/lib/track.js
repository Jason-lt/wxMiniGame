(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Scripts/sdk_readygo/lib/track.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'aa416MdQRZG1p0WYRcNK7XT', 'track', __filename);
// Scripts/sdk_readygo/lib/track.js

"use strict";
function _interopRequireDefault(e) {
  return e && e.__esModule ? e : { default: e };
}function _classCallCheck(e, t) {
  if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
}function savelog(e) {
  if (isOpenUserLog) {
    var t = 0;!function a() {
      wx.request({ url: "https://h5game-log.kuaiyugo.com/dataAnalysis/saveUserBehaviorLogV2", data: e, method: "POST", header: { "content-type": "application/json" }, success: function success(t) {
          console.log(e);
        }, fail: function fail(n) {
          if (t < 2) return t++, e.retryTimes = t, void a();console.log(n, "数据上报日志失败");
        } });
    }();
  }
}function _filterObj(e) {
  for (var t in e) {
    "number" != typeof e[t] && ("" != e[t] && null != e[t] && void 0 != e[t] && "{}" != JSON.stringify(e[t]) || delete e[t]);
  }return e;
}Object.defineProperty(exports, "__esModule", { value: !0 });var _createClass = function () {
  function e(e, t) {
    for (var a = 0; a < t.length; a++) {
      var n = t[a];n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n);
    }
  }return function (t, a, n) {
    return a && e(t.prototype, a), n && e(t, n), t;
  };
}(),
    _config = require("./config"),
    _config2 = _interopRequireDefault(_config),
    _trackTable = require("./trackTable"),
    _trackTable2 = _interopRequireDefault(_trackTable),
    sdkVersion = "1.1.0",
    getUserLocation = !1,
    isOpenUserLog = !0,
    locationInfo = {};getUserLocation && wx.getLocation({ success: function success(e) {
    locationInfo = e;
  } }), exports.default = new (function () {
  function e() {
    _classCallCheck(this, e), this.trackTable = _trackTable2.default;
  }return _createClass(e, [{ key: "getExtraParamKey", value: function value(e) {
      try {
        var t = "";return this.trackTable.forEach(function (a, n) {
          var o = Object.keys(a);e == a.type && (t = o[1]);
        }), t;
      } catch (e) {
        console.log(e);
      }
    } }, { key: "trackLog", value: function value(e, t) {
      try {
        savelog({ userLog: this.getObject(e, t) });
      } catch (e) {
        console.log(e);
      }
    } }, { key: "gameHttp", value: function value(e, t, a) {
      try {
        return "GET" == a && (e = this.stringify(e, t)), new Promise(function (n, o) {
          var r = wx.getStorageSync("sessionId") || "";wx.request({ url: e, data: t, method: a, header: { "content-type": "application/json", "session-id": r }, success: function success(e) {
              var t = e.data.code;e.data.data.code && (t = e.data.data.code), 0 == t ? n(e.data) : o(e.data);
            }, fail: function fail(e) {
              o(e);
            } });
        });
      } catch (e) {
        console.log(e);
      }
    } }, { key: "getObject", value: function value(e, t) {
      try {
        var a = wx.getSystemInfoSync(),
            n = {};if (n.v = sdkVersion, n.ext = { ak: _config2.default.appKey, ccode: wx.getStorageSync("channelCode") || "", sid: wx.getStorageSync("sid") || "", type: e, uid: wx.getStorageSync("uid"), scene: wx.getStorageSync("scene") || "" }, n.device = a, getUserLocation && (n.location = locationInfo), void 0 !== t) {
          var o = this.getExtraParamKey(e);"extraParam" != o && "" != o && (n.ext[o] = t);
        }return n.ext = _filterObj(n.ext), n;
      } catch (e) {
        console.log(e);
      }
    } }]), e;
}())();

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
        //# sourceMappingURL=track.js.map
        