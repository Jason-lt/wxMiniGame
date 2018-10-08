(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Scripts/common/myUtil.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '907ddwVrcNMFoX1AupADcMj', 'myUtil', __filename);
// Scripts/common/myUtil.js

"use strict";

var myUtil = {
    //随机输出数组中的一项
    randomForArray: function randomForArray(arr) {
        if (!arr || arr.length == 0) {
            return 0;
        }

        return arr[Math.floor(Math.random() * arr.length)];
    },

    randomIndexForArray: function randomIndexForArray(arr) {
        if (!arr || arr.length == 0) {
            return 0;
        }

        return Math.floor(Math.random() * arr.length);
    },

    //在某一范围内随机
    randomForMinAndMax: function randomForMinAndMax(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    //限制value值的大小
    clampValue: function clampValue(value, min, max) {
        if (value < min) {
            return min;
        } else if (value > max) {
            return max;
        } else {
            return value;
        }
    },

    //根据权重随机
    randomForWeight: function randomForWeight(weights) {
        Global.gridRandomScores = [];
        for (var i in weights) {
            var weight = parseInt(weights[i].weight * 10000 / 100);
            for (var j = 0; j < weight; j++) {
                Global.gridRandomScores.push(weights[i].id);
            }
        }
    },

    //根据时间获取一年中的第几天
    getDayForYear: function getDayForYear(unixTime) {
        if (unixTime == 0) {
            return 0;
        }
        var currTime = new Date(unixTime);
        var day = currTime.getDate();
        var month = currTime.getMonth() + 1;
        var year = currTime.getFullYear();
        var sum = 0;
        var leap = 0;
        switch (month) {/*先计算某月以前月份的总天数*/
            case 1:
                sum = 0;
                break;
            case 2:
                sum = 31;
                break;
            case 3:
                sum = 59;
                break;
            case 4:
                sum = 90;
                break;
            case 5:
                sum = 120;
                break;
            case 6:
                sum = 151;
                break;
            case 7:
                sum = 181;
                break;
            case 8:
                sum = 212;
                break;
            case 9:
                sum = 243;
                break;
            case 10:
                sum = 273;
                break;
            case 11:
                sum = 304;
                break;
            case 12:
                sum = 334;
                break;
            default:
                sum = 0;
                break;
        }
        sum += day;
        if (year % 400 == 0 || year % 4 == 0 && year % 100 != 0) {
            /*判断是不是闰年*/
            leap = 1;
        } else {
            leap = 0;
        }
        if (leap == 1 && month > 2) /*如果是闰年且月份大于2,总天数应该加一天*/{
                sum++;
            }
        return sum;
    },


    //倒计时限时
    getShortTimeString: function getShortTimeString(second) {
        var h = Math.floor(second / 3600);
        var s = second % 60;
        var min = Math.floor(second / 60) % 60;
        var secondBody;
        var minuteBody;
        //秒
        if (h == 0 && min == 0 && s == 0) {
            secondBody = "00";
        } else if (s < 10) {
            secondBody = "0" + s;
        } else {
            secondBody = s;
        }

        //分
        if (h == 0 && min == 0) {
            minuteBody = "00:";
        } else if (min < 10) {
            minuteBody = "0" + min + ":";
        } else {
            minuteBody = min + ":";
        }
        return minuteBody + "" + secondBody;
    },

    getPercentString: function getPercentString(socre) {
        var perStr = 0;
        if (socre < 1) {
            perStr = '0%';
        } else if (1 >= socre && socre < 500) {
            perStr = '1%';
        } else if (501 >= socre && socre < 1000) {
            perStr = '3%';
        } else if (1001 >= socre && socre < 10000) {
            perStr = '8%';
        } else if (10001 >= socre && socre < 20000) {
            perStr = '15%';
        } else if (20001 >= socre && socre < 30000) {
            perStr = '30%';
        } else if (30001 >= socre && socre < 40000) {
            perStr = '55%';
        } else if (40001 >= socre && socre < 50000) {
            perStr = '65%';
        } else if (50001 >= socre && socre < 60000) {
            perStr = '75%';
        } else if (60001 >= socre && socre < 70000) {
            perStr = '85%';
        } else if (70001 >= socre && socre < 80000) {
            perStr = '88%';
        } else if (80001 >= socre && socre < 90000) {
            perStr = '90%';
        } else if (90001 >= socre && socre < 100000) {
            perStr = '95%';
        } else {
            perStr = '99%';
        }
        return perStr;
    },

    // 截屏返回 iamge base6，用于 Share
    getImgBase64: function getImgBase64() {
        var target = cc.find('Canvas');
        var width = parseInt(target.width),
            height = parseInt(target.height);
        var renderTexture = new cc.RenderTexture(width, height);
        renderTexture.begin();
        target._sgNode.visit();
        renderTexture.end();
        //
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        canvas.width = width;
        canvas.height = height;
        if (cc._renderType === cc.game.RENDER_TYPE_CANVAS) {
            var texture = renderTexture.getSprite().getTexture();
            var image = texture.getHtmlElementObj();
            ctx.drawImage(image, 0, 0);
        } else if (cc._renderType === cc.game.RENDER_TYPE_WEBGL) {
            var buffer = gl.createFramebuffer();
            gl.bindFramebuffer(gl.FRAMEBUFFER, buffer);
            var _texture = renderTexture.getSprite().getTexture()._glID;
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, _texture, 0);
            var data = new Uint8Array(width * height * 4);
            gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, data);
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            var rowBytes = width * 4;
            for (var row = 0; row < height; row++) {
                var srow = height - 1 - row;
                var data2 = new Uint8ClampedArray(data.buffer, srow * width * 4, rowBytes);
                var imageData = new ImageData(data2, width, 1);
                ctx.putImageData(imageData, 0, row);
            }
        }
        cc.log('to share');
        return canvas.toDataURL('image/png');
    }

};

module.exports = myUtil;

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
        //# sourceMappingURL=myUtil.js.map
        