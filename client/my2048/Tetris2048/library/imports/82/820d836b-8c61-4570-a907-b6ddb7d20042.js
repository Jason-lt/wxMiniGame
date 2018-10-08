"use strict";
cc._RF.push(module, '820d8NrjGFFcKkHtt230gBC', 'gamesdk.min');
// Scripts/common/gamesdk/gamesdk.min.js

"use strict";
function _interopRequireDefault(e) {
  return e && e.__esModule ? e : { default: e };
}function _classCallCheck(e, a) {
  if (!(e instanceof a)) throw new TypeError("Cannot call a class as a function");
}function myLog(e) {
  logStatus && console.log("" + JSON.stringify(e));
}function http(e, a, t) {
  try {
    return new Promise(function (n, r) {
      var o = wx.getStorageSync("sessionId") || "";wx.request({ url: _gamesdkConfig2.default.api + t, data: e, method: a, header: { "content-type": "application/json", "session-id": o }, success: function success(e) {
          n(e.data);
        }, fail: function fail(e) {
          r(e);
        } });
    });
  } catch (e) {
    myLog(e);
  }
}function Checkparam(e) {
  myLog(e);for (var a in e) {
    if (null == e[a] || "" == e[a] || "undefined" == e[a]) return -1;
  }return 1;
}function getErrparamData(e) {
  return myLog(e), { code: -10111, data: "", msg: e };
}function gameLogin(e, a) {
  try {
    wx.login({ success: function success(t) {
        var n = t.code,
            r = { code: n, appId: _gamesdkConfig2.default.appId };if (1 == Checkparam(r)) http(r, "POST", "user/login").then(function (t) {
          0 == t.code ? (wx.setStorageSync("sdkopenid", t.data.openId), t.data.isNeedUpdateUserInfo || (myLog("保存了sessionId" + t.data.sessionId), wx.setStorageSync("sessionId", t.data.sessionId)), e(t)) : a(t);
        }, function (e) {
          a(e);
        });else {
          var o = "前端检查参数不正确" + JSON.stringify(r),
              i = getErrparamData(o);a(i);
        }
      }, fail: function fail(e) {
        a(e);
      } });
  } catch (e) {
    a(e);
  }
}function getPlatForm() {
  try {
    var e = wx.getSystemInfoSync();return myLog({ name: "当前设备", info: e }), 0 == e.system.indexOf("iOS") ? "ios" : 0 == e.system.indexOf("Android") ? "android" : e.system.length > 10 ? e.system.substring(0, 10) : e.system;
  } catch (e) {
    return myLog(e), "error";
  }
}function getCodeImg(e, a, t, n, r, o) {
  try {
    var i = { openId: wx.getStorageSync("sdkopenid"), appId: _gamesdkConfig2.default.appId, coin: e, gameCoin: a, gameCoinName: t, param: n };if (1 == Checkparam(i)) {
      http({ codeBody: JSON.stringify(i) }, "POST", "gamepay/createWXACode").then(function (e) {
        var a = e.data;wx.previewImage({ current: a, urls: [a], success: function success(e) {
            myLog(e), r(e);
          }, fail: function fail(e) {
            o(e);
          } });
      }, function (e) {
        o(e);
      });
    } else {
      var s = "前端检查参数不正确" + JSON.stringify(i),
          c = getErrparamData(s);o(c);
    }
  } catch (e) {
    myLog(e);
  }
}function midasPay(e, a, t) {
  try {
    if (1 == Checkparam(e)) http(e, "POST", "gamepay/addCoinOrder").then(function (e) {
      myLog({ name: "midasPay", res: e }), console.log(e);var n = e.data;orderCode = e.data.orderCode;var r = e.data.buyQuantity;0 == r ? checkOrder(a, t) : wx.requestMidasPayment({ mode: n.mode, env: n.env, offerId: n.offerId, currencyType: n.currencyType, platform: n.platform, buyQuantity: r, zoneId: n.zoneId, success: function success(e) {
          myLog({ name: "成功回调", res: e }), checkOrder(a, t);
        }, fail: function fail(e) {
          myLog("用户取消支付"), cancelPay(a, t);
        } });
    }).catch(function (e) {
      myLog(e);
    });else {
      var n = "前端检查参数不正确" + JSON.stringify(e),
          r = getErrparamData(n);t(r);
    }
  } catch (e) {
    t(e);
  }
}function checkOrder(e, a) {
  try {
    timer = setInterval(function () {
      var t = wx.getStorageSync("sessionId");if (myLog("订单号:" + orderCode + "--appId:" + _gamesdkConfig2.default.appId + "--sessionId:" + t), waitOrderTime > 120) {
        myLog("state=5"), clearInterval(timer);var n = getOrderStatus(10400);e(n);
      }http("", "GET", "gamepay/getCoinOrderStatus?orderCode=" + orderCode + "&appId=" + _gamesdkConfig2.default.appId).then(function (t) {
        myLog({ name: "成功回调", "回调参数": t });var n = t.data;if (0 == t.code) {
          if (1 == n.pay_status) {
            myLog("state=1"), clearInterval(timer);var r = getOrderStatus(10401);e(r);
          } else 0 == n.pay_status && (myLog("state=0"), waitOrderTime += 1);if (2 == n.order_status) {
            myLog("state=2"), clearInterval(timer);var o = getOrderStatus(10402);a(o);
          }
        } else myLog("state=3"), clearInterval(timer), a(t);
      }).catch(function (e) {
        myLog({ name: "错误回调", "回调参数": e }), myLog("state=4"), clearInterval(timer), a(errObj);
      });
    }, 1e3);
  } catch (e) {
    a(e);
  }
}function getOrderStatus(e) {
  try {
    var a = { code: "", data: "", msg: "" };return 10400 == e ? (a.code = e, a.msg = "支付成功，到账可能延迟") : 10401 == e ? (a.code = e, a.msg = "支付成功") : 10402 == e && (a.code = e, a.msg = "订单被取消"), myLog({ name: "订单状态", obj: a }), a;
  } catch (a) {
    var t = { code: "", data: "", msg: "" };return 10400 == e ? (t.code = e, t.msg = "支付成功，到账可能延迟") : 10401 == e ? (t.code = e, t.msg = "支付成功") : 10402 == e && (t.code = e, t.msg = "订单被取消"), myLog({ name: "订单状态", obj: t }), t;
  }
}function cancelPay(e, a) {
  var t = { orderCode: orderCode },
      n = { data: "", code: 10405, msg: "用户点击了取消" };http(t, "POST", "gamepay/cancelCoinOrder").then(function (e) {
    a(n);
  }, function (e) {
    a(n);
  });
}Object.defineProperty(exports, "__esModule", { value: !0 });var _createClass = function () {
  function e(e, a) {
    for (var t = 0; t < a.length; t++) {
      var n = a[t];n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n);
    }
  }return function (a, t, n) {
    return t && e(a.prototype, t), n && e(a, n), a;
  };
}(),
    _gamesdkConfig = require("./gamesdk.config.js"),
    _gamesdkConfig2 = _interopRequireDefault(_gamesdkConfig),
    logStatus = !0,
    timer = null,
    orderCode = "",
    waitOrderTime = 1,
    gameSdk = function () {
  function e() {
    _classCallCheck(this, e);
  }return _createClass(e, null, [{ key: "createUserInfoBtn", value: function value(e, a, t, n, r, o) {
      try {
        var i = this;if (wx.getSystemInfoSync().SDKVersion < "2.0.6") return void wx.getUserInfo({ success: function success(e) {
            var a = { encryptedData: e.encryptedData, iv: e.iv };i.authorize(a, r, o);
          }, fail: function fail(e) {
            o(e);
          } });var s = wx.createUserInfoButton({ type: e, text: a, image: t, style: n });r({ code: 1, data: s, msg: "success" });
      } catch (e) {
        o(e);
      }
    } }, { key: "pay", value: function value(e, a, t, n, r, o) {
      try {
        var i = getPlatForm();http("", "GET", "gamepay/getGamePayType?os=" + i + "&appId=" + _gamesdkConfig2.default.appId).then(function (i) {
          myLog(i);var s = i.data;if ("wxpay" == s) getCodeImg(e, a, t, n, r, o);else if ("midas" == s) {
            myLog("midasPay");var c = { coin: e, gameCoinName: t, gameCoin: a, param: n, payType: "midas", purpose: 2, appId: _gamesdkConfig2.default.appId };midasPay(c, r, o);
          } else "none" == s ? myLog("pay none") : o(i);
        }, function (e) {
          o(e);
        });
      } catch (e) {
        o(e);
      }
    } }, { key: "login", value: function value(e, a) {
      myLog({ name: "logName", time: "00:00" }), gameLogin(e, a);
    } }, { key: "authorize", value: function value(e, a, t) {
      try {
        var n = wx.getStorageSync("sdkopenid"),
            r = { encryptedData: e.encryptedData, iv: e.iv, openId: n, appId: _gamesdkConfig2.default.appId };if (1 == Checkparam(r)) http(r, "POST", "user/update").then(function (e) {
          gameLogin(a, t);
        }, function (e) {
          t(e);
        });else {
          var o = "前端检查参数不正确" + JSON.stringify(r),
              i = getErrparamData(o);t(i);
        }
      } catch (e) {
        t(e);
      }
    } }]), e;
}();exports.default = gameSdk;

cc._RF.pop();