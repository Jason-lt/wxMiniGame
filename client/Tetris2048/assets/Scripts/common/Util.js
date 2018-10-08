var Util = {
    //随机输出数组中的一项
    randomForArray: function (arr) {
        if (!arr || arr.length == 0) {
            return 0;
        }

        return arr[Math.floor(Math.random() * arr.length)];
    },

    //在某一范围内随机
    randomForMinAndMax: function (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    //限制value值的大小
    clampValue: function (value, min, max) {
        if (value < min) {
            return min;
        } else if (value > max) {
            return max;
        } else {
            return value;
        }
    },

    //根据权重随机
    randomForWeight: function (weights) {
        Global.gridRandomScores = [];
        for (var i in weights) {
            var weight = parseInt(weights[i].weight * 10000 / 100);
            for (var j = 0; j < weight; j++) {
                Global.gridRandomScores.push(weights[i].id);
            }
        }
    },

    getPercentString: function (socre) {
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
    getImgBase64: function () {
        let target = cc.find('Canvas');
        let width = parseInt(target.width),
            height = parseInt(target.height);
        let renderTexture = new cc.RenderTexture(width, height);
        renderTexture.begin();
        target._sgNode.visit();
        renderTexture.end();
        //
        let canvas = document.createElement('canvas');
        let ctx = canvas.getContext('2d');
        canvas.width = width;
        canvas.height = height;
        if (cc._renderType === cc.game.RENDER_TYPE_CANVAS) {
            let texture = renderTexture.getSprite().getTexture();
            let image = texture.getHtmlElementObj();
            ctx.drawImage(image, 0, 0);
        } else if (cc._renderType === cc.game.RENDER_TYPE_WEBGL) {
            let buffer = gl.createFramebuffer();
            gl.bindFramebuffer(gl.FRAMEBUFFER, buffer);
            let texture = renderTexture.getSprite().getTexture()._glID;
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
            let data = new Uint8Array(width * height * 4);
            gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, data);
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            let rowBytes = width * 4;
            for (let row = 0; row < height; row++) {
                let srow = height - 1 - row;
                let data2 = new Uint8ClampedArray(data.buffer, srow * width * 4, rowBytes);
                let imageData = new ImageData(data2, width, 1);
                ctx.putImageData(imageData, 0, row);
            }
        }
        cc.log('to share');
        return canvas.toDataURL('image/png');
    },

};

module.exports = Util;