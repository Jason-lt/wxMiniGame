"use strict";
cc._RF.push(module, '09ff2APQNxDqJd1kcisd36p', 'GrayEffect');
// Scripts/common/GrayEffect.ts

Object.defineProperty(exports, "__esModule", { value: true });
var GrayFrag_1 = require("./GrayFrag");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var GrayEffect = /** @class */ (function (_super) {
    __extends(GrayEffect, _super);
    function GrayEffect() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.isAllChildrenUse = false;
        return _this;
    }
    GrayEffect.prototype.onLoad = function () {
        this.grayShader();
    };
    // 变灰shader
    GrayEffect.prototype.grayShader = function () {
        this.program = new cc.GLProgram();
        if (cc.sys.isNative) {
            this.program.initWithString(GrayFrag_1.default.default_vert, GrayFrag_1.default.gray_frag);
            this.program.link();
            this.program.updateUniforms();
        }
        else {
            this.program.initWithVertexShaderByteArray(GrayFrag_1.default.default_vert, GrayFrag_1.default.gray_frag);
            this.program.addAttribute(cc.macro.ATTRIBUTE_NAME_POSITION, cc.macro.VERTEX_ATTRIB_POSITION);
            this.program.addAttribute(cc.macro.ATTRIBUTE_NAME_COLOR, cc.macro.VERTEX_ATTRIB_COLOR);
            this.program.addAttribute(cc.macro.ATTRIBUTE_NAME_TEX_COORD, cc.macro.VERTEX_ATTRIB_TEX_COORDS);
            this.program.link();
            this.program.updateUniforms();
        }
        if (this.isAllChildrenUse) {
            this.setProgram(this.node._sgNode, this.program);
        }
        else {
            this.setProgram(this.node.getComponent(cc.Sprite)._sgNode, this.program);
        }
    };
    GrayEffect.prototype.setProgram = function (node, program) {
        if (cc.sys.isNative) {
            var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(program);
            node.setGLProgramState(glProgram_state);
        }
        else {
            node.setShaderProgram(program);
        }
        var children = node.children;
        if (!children)
            return;
        for (var i = 0; i < children.length; i++) {
            this.setProgram(children[i], program);
        }
    };
    // 恢复默认shader
    GrayEffect.prototype.resetProgram = function (node) {
        node.getComponent(cc.Sprite)._sgNode.setState(0);
        var children = node.children;
        if (!children)
            return;
        for (var i = 0; i < children.length; i++) {
            this.resetProgram(children[i]);
        }
    };
    GrayEffect.prototype.resetShader = function () {
        if (this.isAllChildrenUse) {
            this.resetProgram(this.node);
        }
        else {
            this.node.getComponent(cc.Sprite)._sgNode.setState(0);
        }
    };
    __decorate([
        property
    ], GrayEffect.prototype, "isAllChildrenUse", void 0);
    GrayEffect = __decorate([
        ccclass
    ], GrayEffect);
    return GrayEffect;
}(cc.Component));
exports.default = GrayEffect;

cc._RF.pop();