var FBGlobal = {
    fbname : 'noname',
    fbphoto : null,
    fbScore: 0,
    crystal: 0,
    debugText: 'FB api loaded',

    getFBScore: function (callback) {
        FBGlobal.debugText = 'called getFBScore() ';
        if (typeof FBInstant === 'undefined') return;

        FBGlobal.fbname = FBInstant.player.getName();
        FBGlobal.fbphoto = FBInstant.player.getPhoto();
        FBGlobal.debugText = 'try get score from fb ';
        FBInstant.player.getDataAsync(['maxscore'])
            .then(data => {
                FBGlobal.fbScore = data['maxscore'] || 0;
                FBGlobal.crystal = data['crystal'] || 0;
                if (callback) {
                    callback(FBGlobal.fbScore, FBGlobal.crystal);
                }
                FBGlobal.debugText = ' get score from fb :' + FBGlobal.fbScore + ' crystal:' + FBGlobal.crystal;
            })
            .catch(error => {
                FBGlobal.debugText = ' getDataAsysnc error\n code:' + error.code + '\n msg: ' + error.message;
            });
        // return FBGlobal.fbScore;
    },

    saveFBScore: function (maxScore,crystal) {
        FBGlobal.debugText = 'called saveFBScore() ';
        if (!maxScore) {

            FBGlobal.debugText = 'params maxScore not exists,return';
            return;
        }
        if (!FBGlobal.fbScore) {
            FBGlobal.debugText = 'FBGlobal.fbScore not exists,return';
            FBGlobal.fbScore = 0;
        } 
        maxScore = parseInt(maxScore)
        FBGlobal.debugText = 'saveFBScore :' + maxScore;
        if (typeof FBInstant === 'undefined') return;

        if (maxScore > FBGlobal.fbScore) {
            FBGlobal.debugText = 'try save score to fb :' + maxScore;
            FBInstant.player.setDataAsync({
                maxscore: maxScore,
                crystal: crystal
            })
                .then(() => {
                    FBGlobal.fbScore = maxScore;
                    FBGlobal.debugText = ' save score to fb player successed';
                })
                .catch(error => {
                    FBGlobal.debugText = ' setDataAsync error\n code:' + error.code + '\n msg: ' + error.message;
                });

            var strNameAndPhoto = FBGlobal.fbname + '_' + FBGlobal.fbphoto;
            //更新排行榜
            FBInstant.getLeaderboardAsync('my_linerank')
                .then(leaderboard => {
                    FBGlobal.debugText = ' save score to fb successed on setScoreAsync';
                    return leaderboard.setScoreAsync(maxScore, strNameAndPhoto);
                })
                .then(entry => {
                    FBGlobal.debugText = ' save score to fb successed get entry';
                })
                .catch(error => {
                    FBGlobal.debugText = ' save score to fb rank error setScoreAsync\n code:' + error.code + '\n msg: ' + error.message;
                });
        } else {

            FBGlobal.debugText = 'not saved ,old highscore is :' + FBGlobal.fbScore;
        }
    },

    getRank: function (callback) {
        FBGlobal.debugText = 'called getRank()';
        if (typeof FBInstant === 'undefined') return;
        var result = null;
        FBGlobal.debugText = 'try get fb rank';
        FBInstant.getLeaderboardAsync('my_linerank')
            .then(leaderboard => {
                FBGlobal.debugText = ' get fb rank leaderboard';
                return leaderboard.getEntriesAsync();
            })
            .then(entries => {
                if (entries) {
                    FBGlobal.debugText = ' get fb rank entries :' + entries.length;
                } else {
                    FBGlobal.debugText = ' no entries ';
                }
                if (callback) {
                    callback(entries);
                }
            })
            .catch(error => {
                FBGlobal.debugText = "getLeaderboardAsync error\n code:" + error.code + '\n msg:' + error.message;
            });
    },

    // 分享功能  intent("INVITE" | "REQUEST" | "CHALLENGE" | "SHARE") 表示分享的意图
    onShareGame: function (img) {
        FBGlobal.debugText = 'called onShareGame()';
        if (!img) {
            return;
        }
        FBGlobal.debugText = 'get screenshot :' + img.length;
        if (typeof FBInstant === 'undefined') return;

        // 分享功能  intent("INVITE" | "REQUEST" | "CHALLENGE" | "SHARE") 表示分享的意图
        // var img = this.getImgBase64(w, h, renderType);
        // FBGlobal.debugText = 'get screenshot :' + img.length;
        FBInstant.shareAsync({
            intent: 'SHARE',
            image: img,
            text: 'Look my score!',
            data: {
                myReplayData: '...'
            },
        }).then(() => {
            // continue with the game.
        })
        .catch(error => {
            FBGlobal.debugText = ' shareAsync error\n code:' + error.code + '\n msg: ' + error.message;
        });
    },

    onChallenge: function (img) {
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
            },
        }).then(() => {
            // continue with the game.
        })
        .catch(error => {
            FBGlobal.debugText = ' challenge shareAsync\n code:' + error.code + '\n msg: ' + error.message;
        });
    },

    


    // 截屏返回 iamge base6，用于 Share
    // 需要传入屏幕宽高和渲染模式
    // 需把该方法复制到cc.component中执行.
    // getImgBase64: function () {
    //     var target = cc.find('Canvas');
    //     this.gameinfo.debuglabel.string = "w,h:" + target.width + ',' + target.height;
    //     var width = parseInt(target.width),
    //         height = parseInt(target.height);
    //     var renderTexture = new cc.RenderTexture(width, height);
    //     renderTexture.begin();
    //     target._sgNode.visit();
    //     renderTexture.end();
    //     //
    //     var canvas = document.createElement('canvas');
    //     var ctx = canvas.getContext('2d');
    //     canvas.width = width;
    //     canvas.height = height;

    //     if (cc._renderType === cc.game.RENDER_TYPE_CANVAS) {
    //         var texture = renderTexture.getSprite().getTexture();
    //         var image = texture.getHtmlElementObj();
    //         ctx.drawImage(image, 0, 0);
    //     } else if (cc._renderType === cc.game.RENDER_TYPE_WEBGL) {
    //         var buffer = gl.createFramebuffer();
    //         gl.bindFramebuffer(gl.FRAMEBUFFER, buffer);
    //         var texture = renderTexture.getSprite().getTexture()._glID;
    //         gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
    //         var data = new Uint8Array(width * height * 4);
    //         gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, data);
    //         gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    //         var rowBytes = width * 4;
    //         for (var row = 0; row < height; row++) {
    //             var srow = height - 1 - row;
    //             var data2 = new Uint8ClampedArray(data.buffer, srow * width * 4, rowBytes);
    //             var imageData = new ImageData(data2, width, 1);
    //             ctx.putImageData(imageData, 0, row);
    //         }
    //     }
    //     // cc.log('to share');
    //     return canvas.toDataURL('image/png');
    // },
}

module.exports = FBGlobal;
