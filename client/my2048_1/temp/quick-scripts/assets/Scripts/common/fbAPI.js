(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Scripts/common/fbAPI.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '60e89uyP71OPbI1HG8KK8DV', 'fbAPI', __filename);
// Scripts/common/fbAPI.js

'use strict';

var FBGlobal = {
    fbname: 'noname',
    fbphoto: null,
    fbScore: 0,
    crystal: 0,
    debugText: 'FB api loaded',

    getFBScore: function getFBScore(callback) {
        FBGlobal.debugText = 'called getFBScore() ';
        if (typeof FBInstant === 'undefined') return;

        FBGlobal.fbname = FBInstant.player.getName();
        FBGlobal.fbphoto = FBInstant.player.getPhoto();
        FBGlobal.debugText = 'try get score from fb ';
        FBInstant.player.getDataAsync(['maxscore']).then(function (data) {
            FBGlobal.fbScore = data['maxscore'] || 0;
            FBGlobal.crystal = data['crystal'] || 0;
            if (callback) {
                callback(FBGlobal.fbScore, FBGlobal.crystal);
            }
            FBGlobal.debugText = ' get score from fb :' + FBGlobal.fbScore + ' crystal:' + FBGlobal.crystal;
        }).catch(function (error) {
            FBGlobal.debugText = ' getDataAsysnc error\n code:' + error.code + '\n msg: ' + error.message;
        });
        // return FBGlobal.fbScore;
    },

    saveFBScore: function saveFBScore(maxScore, crystal) {
        FBGlobal.debugText = 'called saveFBScore() ';
        if (!maxScore) {

            FBGlobal.debugText = 'params maxScore not exists,return';
            return;
        }
        if (!FBGlobal.fbScore) {
            FBGlobal.debugText = 'FBGlobal.fbScore not exists,return';
            FBGlobal.fbScore = 0;
        }
        maxScore = parseInt(maxScore);
        FBGlobal.debugText = 'saveFBScore :' + maxScore;
        if (typeof FBInstant === 'undefined') return;

        if (maxScore > FBGlobal.fbScore) {
            FBGlobal.debugText = 'try save score to fb :' + maxScore;
            FBInstant.player.setDataAsync({
                maxscore: maxScore,
                crystal: crystal
            }).then(function () {
                FBGlobal.fbScore = maxScore;
                FBGlobal.debugText = ' save score to fb player successed';
            }).catch(function (error) {
                FBGlobal.debugText = ' setDataAsync error\n code:' + error.code + '\n msg: ' + error.message;
            });

            var strNameAndPhoto = FBGlobal.fbname + '_' + FBGlobal.fbphoto;
            //更新排行榜
            FBInstant.getLeaderboardAsync('my_linerank').then(function (leaderboard) {
                FBGlobal.debugText = ' save score to fb successed on setScoreAsync';
                return leaderboard.setScoreAsync(maxScore, strNameAndPhoto);
            }).then(function (entry) {
                FBGlobal.debugText = ' save score to fb successed get entry';
            }).catch(function (error) {
                FBGlobal.debugText = ' save score to fb rank error setScoreAsync\n code:' + error.code + '\n msg: ' + error.message;
            });
        } else {

            FBGlobal.debugText = 'not saved ,old highscore is :' + FBGlobal.fbScore;
        }
    },

    getRank: function getRank(callback) {
        FBGlobal.debugText = 'called getRank()';
        if (typeof FBInstant === 'undefined') return;
        var result = null;
        FBGlobal.debugText = 'try get fb rank';
        FBInstant.getLeaderboardAsync('my_linerank').then(function (leaderboard) {
            FBGlobal.debugText = ' get fb rank leaderboard';
            return leaderboard.getEntriesAsync();
        }).then(function (entries) {
            if (entries) {
                FBGlobal.debugText = ' get fb rank entries :' + entries.length;
            } else {
                FBGlobal.debugText = ' no entries ';
            }
            if (callback) {
                callback(entries);
            }
        }).catch(function (error) {
            FBGlobal.debugText = "getLeaderboardAsync error\n code:" + error.code + '\n msg:' + error.message;
        });
    },

    // 分享功能  intent("INVITE" | "REQUEST" | "CHALLENGE" | "SHARE") 表示分享的意图
    onShareGame: function onShareGame(img) {
        FBGlobal.debugText = 'called onShareGame()';
        if (!img) {
            return;
        }
        FBGlobal.debugText = 'get screenshot :' + img.length;
        if (typeof FBInstant === 'undefined') return;

        // 分享功能  intent("INVITE" | "REQUEST" | "CHALLENGE" | "SHARE") 表示分享的意图
        // let img = this.getImgBase64(w, h, renderType);
        // FBGlobal.debugText = 'get screenshot :' + img.length;
        FBInstant.shareAsync({
            intent: 'SHARE',
            image: img,
            text: 'Look my score!',
            data: {
                myReplayData: '...'
            }
        }).then(function () {
            // continue with the game.
        }).catch(function (error) {
            FBGlobal.debugText = ' shareAsync error\n code:' + error.code + '\n msg: ' + error.message;
        });
    },

    onChallenge: function onChallenge(img) {
        FBGlobal.debugText = 'called onChallenge()';
        if (!img) {
            return;
        }
        FBGlobal.debugText = 'get screenshot :' + img.length;
        if (typeof FBInstant === 'undefined') return;
        FBInstant.shareAsync({
            intent: 'INVITE',
            image: img,
            text: 'I just challenged Watermelon ,Join me!',
            data: {
                myReplayData: '...'
            }
        }).then(function () {
            // continue with the game.
        }).catch(function (error) {
            FBGlobal.debugText = ' challenge shareAsync\n code:' + error.code + '\n msg: ' + error.message;
        });
    }

    // 截屏返回 iamge base6，用于 Share
    // 需要传入屏幕宽高和渲染模式
    // 需把该方法复制到cc.component中执行.
    // getImgBase64: function () {
    //     let target = cc.find('Canvas');
    //     this.gameinfo.debuglabel.string = "w,h:" + target.width + ',' + target.height;
    //     let width = parseInt(target.width),
    //         height = parseInt(target.height);
    //     let renderTexture = new cc.RenderTexture(width, height);
    //     renderTexture.begin();
    //     target._sgNode.visit();
    //     renderTexture.end();
    //     //
    //     let canvas = document.createElement('canvas');
    //     let ctx = canvas.getContext('2d');
    //     canvas.width = width;
    //     canvas.height = height;

    //     if (cc._renderType === cc.game.RENDER_TYPE_CANVAS) {
    //         let texture = renderTexture.getSprite().getTexture();
    //         let image = texture.getHtmlElementObj();
    //         ctx.drawImage(image, 0, 0);
    //     } else if (cc._renderType === cc.game.RENDER_TYPE_WEBGL) {
    //         let buffer = gl.createFramebuffer();
    //         gl.bindFramebuffer(gl.FRAMEBUFFER, buffer);
    //         let texture = renderTexture.getSprite().getTexture()._glID;
    //         gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
    //         let data = new Uint8Array(width * height * 4);
    //         gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, data);
    //         gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    //         let rowBytes = width * 4;
    //         for (let row = 0; row < height; row++) {
    //             let srow = height - 1 - row;
    //             let data2 = new Uint8ClampedArray(data.buffer, srow * width * 4, rowBytes);
    //             let imageData = new ImageData(data2, width, 1);
    //             ctx.putImageData(imageData, 0, row);
    //         }
    //     }
    //     // cc.log('to share');
    //     return canvas.toDataURL('image/png');
    // },
};

module.exports = FBGlobal;

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
        //# sourceMappingURL=fbAPI.js.map
        