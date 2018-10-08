(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Scripts/sdk_readygo/lib/coinsdk.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '64d7axgYpdEd44EopJ53qB7', 'coinsdk', __filename);
// Scripts/sdk_readygo/lib/coinsdk.js

"use strict";
function _interopRequireDefault(e) {
  return e && e.__esModule ? e : { default: e };
}function _classCallCheck(e, n) {
  if (!(e instanceof n)) throw new TypeError("Cannot call a class as a function");
}function _wxHttp(e, n, t) {
  return new Promise(function (a, o) {
    var i = wx.getStorageSync("sessionId");console.log(i), wx.request({ url: e, data: n, method: t, header: { "content-type": "application/json", "session-id": i }, success: function success(e) {
        0 == e.data.code ? a(e.data) : o(e);
      }, fail: function fail(e) {
        o(e);
      } });
  });
}Object.defineProperty(exports, "__esModule", { value: !0 });var _createClass = function () {
  function e(e, n) {
    for (var t = 0; t < n.length; t++) {
      var a = n[t];a.enumerable = a.enumerable || !1, a.configurable = !0, "value" in a && (a.writable = !0), Object.defineProperty(e, a.key, a);
    }
  }return function (n, t, a) {
    return t && e(n.prototype, t), a && e(n, a), n;
  };
}(),
    _config = require("./config"),
    _config2 = _interopRequireDefault(_config),
    _dataStatistics = require("./dataStatistics"),
    _dataStatistics2 = _interopRequireDefault(_dataStatistics),
    sdkVersion = "1.1.0",
    coinsdk = function () {
  function e() {
    _classCallCheck(this, e);
  }return _createClass(e, null, [{ key: "updateGold", value: function value(e, n, t, a, o) {
      try {
        var i = { appId: _config2.default.appId, gold: e, goldSource: n, from: t };_wxHttp(_config2.default.api + "user/updateGold", i, "POST").then(function (n) {
          a(n), _dataStatistics2.default.goldCount(e, n.data.gold);
        }, function (e) {
          o(e);
        });
      } catch (e) {
        o(e);
      }
    } }, { key: "getGameGoldBalance", value: function value(e, n) {
      try {
        _wxHttp(_config2.default.api + "user/getGameGoldBalance?appId=" + _config2.default.appId, "", "GET").then(function (n) {
          e(n);
        }, function (e) {
          n(e);
        });
      } catch (e) {
        n(e);
      }
    } }, { key: "addUserOpenidMapping", value: function value(e, n, t, a) {
      var o = this,
          i = "";if (e.query.openid ? i = e.query.openid : e.referrerInfo && e.referrerInfo.extraData && e.referrerInfo.extraData.openid && (i = e.referrerInfo.extraData.openid), "" == i || null == i || void 0 == i) o.checkSynchronized(function (e) {
        e.data.isSynchronized ? o.getGameGoldBalance(function (e) {
          t(e);
        }, function (e) {
          a(e);
        }) : a({ code: 10410, data: "", msg: "没有进行金币关联" });
      }, function (e) {
        a(e);
      }, "gold");else {
        var c = { openId: i, appId: _config2.default.appId, gold: n };_wxHttp(_config2.default.api + "user/addUserOpenidMapping", c, "POST").then(function (e) {
          o.checkSynchronized(function (e) {
            e.data.isSynchronized ? o.getGameGoldBalance(function (e) {
              t(e);
            }, function (e) {
              a(e);
            }) : a({ code: 10410, data: "", msg: "没有进行金币关联" });
          }, function (e) {
            a(e);
          }, "gold");
        }, function (e) {
          console.log("服务器返回错误:"), a(e);
        });
      }
    } }, { key: "checkSynchronized", value: function value(e, n) {
      var t = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : "";try {
        _wxHttp(_config2.default.api + "user/checkSynchronized?checkTarget=" + t, "", "GET").then(function (n) {
          e(n);
        }, function (e) {
          n(e);
        });
      } catch (e) {
        n(e);
      }
    } }, { key: "getGoldExplain", value: function value(e, n) {
      try {
        _wxHttp(_config2.default.api + "user/getGoldExplain", "", "GET").then(function (n) {
          e(n);
        }, function (e) {
          n(e);
        });
      } catch (e) {
        n(e);
      }
    } }]), e;
}();exports.default = coinsdk;

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
        //# sourceMappingURL=coinsdk.js.map
        