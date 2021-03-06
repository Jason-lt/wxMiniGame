require = function o(a, s, c) {
function f(t, e) {
if (!s[t]) {
if (!a[t]) {
var i = "function" == typeof require && require;
if (!e && i) return i(t, !0);
if (h) return h(t, !0);
var r = new Error("Cannot find module '" + t + "'");
throw r.code = "MODULE_NOT_FOUND", r;
}
var n = s[t] = {
exports: {}
};
a[t][0].call(n.exports, function(e) {
return f(a[t][1][e] || e);
}, n, n.exports, o, a, s, c);
}
return s[t].exports;
}
for (var h = "function" == typeof require && require, e = 0; e < c.length; e++) f(c[e]);
return f;
}({
1: [ function(e, t, i) {
var r = i;
r.bignum = e("bn.js");
r.define = e("./asn1/api").define;
r.base = e("./asn1/base");
r.constants = e("./asn1/constants");
r.decoders = e("./asn1/decoders");
r.encoders = e("./asn1/encoders");
}, {
"./asn1/api": 2,
"./asn1/base": 4,
"./asn1/constants": 8,
"./asn1/decoders": 10,
"./asn1/encoders": 13,
"bn.js": 16
} ],
2: [ function(e, t, i) {
var r = e("../asn1"), n = e("inherits");
i.define = function(e, t) {
return new o(e, t);
};
function o(e, t) {
this.name = e;
this.body = t;
this.decoders = {};
this.encoders = {};
}
o.prototype._createNamed = function(t) {
var i;
try {
i = e("vm").runInThisContext("(function " + this.name + "(entity) {\n  this._initNamed(entity);\n})");
} catch (e) {
i = function(e) {
this._initNamed(e);
};
}
n(i, t);
i.prototype._initNamed = function(e) {
t.call(this, e);
};
return new i(this);
};
o.prototype._getDecoder = function(e) {
e = e || "der";
this.decoders.hasOwnProperty(e) || (this.decoders[e] = this._createNamed(r.decoders[e]));
return this.decoders[e];
};
o.prototype.decode = function(e, t, i) {
return this._getDecoder(t).decode(e, i);
};
o.prototype._getEncoder = function(e) {
e = e || "der";
this.encoders.hasOwnProperty(e) || (this.encoders[e] = this._createNamed(r.encoders[e]));
return this.encoders[e];
};
o.prototype.encode = function(e, t, i) {
return this._getEncoder(t).encode(e, i);
};
}, {
"../asn1": 1,
inherits: 101,
vm: 156
} ],
3: [ function(e, t, i) {
var r = e("inherits"), n = e("../base").Reporter, o = e("buffer").Buffer;
function a(e, t) {
n.call(this, t);
if (o.isBuffer(e)) {
this.base = e;
this.offset = 0;
this.length = e.length;
} else this.error("Input not Buffer");
}
r(a, n);
(i.DecoderBuffer = a).prototype.save = function() {
return {
offset: this.offset,
reporter: n.prototype.save.call(this)
};
};
a.prototype.restore = function(e) {
var t = new a(this.base);
t.offset = e.offset;
t.length = this.offset;
this.offset = e.offset;
n.prototype.restore.call(this, e.reporter);
return t;
};
a.prototype.isEmpty = function() {
return this.offset === this.length;
};
a.prototype.readUInt8 = function(e) {
return this.offset + 1 <= this.length ? this.base.readUInt8(this.offset++, !0) : this.error(e || "DecoderBuffer overrun");
};
a.prototype.skip = function(e, t) {
if (!(this.offset + e <= this.length)) return this.error(t || "DecoderBuffer overrun");
var i = new a(this.base);
i._reporterState = this._reporterState;
i.offset = this.offset;
i.length = this.offset + e;
this.offset += e;
return i;
};
a.prototype.raw = function(e) {
return this.base.slice(e ? e.offset : this.offset, this.length);
};
function s(e, t) {
if (Array.isArray(e)) {
this.length = 0;
this.value = e.map(function(e) {
e instanceof s || (e = new s(e, t));
this.length += e.length;
return e;
}, this);
} else if ("number" == typeof e) {
if (!(0 <= e && e <= 255)) return t.error("non-byte EncoderBuffer value");
this.value = e;
this.length = 1;
} else if ("string" == typeof e) {
this.value = e;
this.length = o.byteLength(e);
} else {
if (!o.isBuffer(e)) return t.error("Unsupported type: " + typeof e);
this.value = e;
this.length = e.length;
}
}
(i.EncoderBuffer = s).prototype.join = function(t, i) {
t || (t = new o(this.length));
i || (i = 0);
if (0 === this.length) return t;
if (Array.isArray(this.value)) this.value.forEach(function(e) {
e.join(t, i);
i += e.length;
}); else {
"number" == typeof this.value ? t[i] = this.value : "string" == typeof this.value ? t.write(this.value, i) : o.isBuffer(this.value) && this.value.copy(t, i);
i += this.length;
}
return t;
};
}, {
"../base": 4,
buffer: 47,
inherits: 101
} ],
4: [ function(e, t, i) {
var r = i;
r.Reporter = e("./reporter").Reporter;
r.DecoderBuffer = e("./buffer").DecoderBuffer;
r.EncoderBuffer = e("./buffer").EncoderBuffer;
r.Node = e("./node");
}, {
"./buffer": 3,
"./node": 5,
"./reporter": 6
} ],
5: [ function(e, t, i) {
var h = e("../base").Reporter, r = e("../base").EncoderBuffer, u = e("../base").DecoderBuffer, n = e("minimalistic-assert"), o = [ "seq", "seqof", "set", "setof", "objid", "bool", "gentime", "utctime", "null_", "enum", "int", "objDesc", "bitstr", "bmpstr", "charstr", "genstr", "graphstr", "ia5str", "iso646str", "numstr", "octstr", "printstr", "t61str", "unistr", "utf8str", "videostr" ], a = [ "key", "obj", "use", "optional", "explicit", "implicit", "def", "choice", "any", "contains" ].concat(o);
function s(e, t) {
var i = {};
(this._baseState = i).enc = e;
i.parent = t || null;
i.children = null;
i.tag = null;
i.args = null;
i.reverseArgs = null;
i.choice = null;
i.optional = !1;
i.any = !1;
i.obj = !1;
i.use = null;
i.useDecoder = null;
i.key = null;
i.default = null;
i.explicit = null;
i.implicit = null;
i.contains = null;
if (!i.parent) {
i.children = [];
this._wrap();
}
}
t.exports = s;
var c = [ "enc", "parent", "children", "tag", "args", "reverseArgs", "choice", "optional", "any", "obj", "use", "alteredUse", "key", "default", "explicit", "implicit", "contains" ];
s.prototype.clone = function() {
var t = this._baseState, i = {};
c.forEach(function(e) {
i[e] = t[e];
});
var e = new this.constructor(i.parent);
e._baseState = i;
return e;
};
s.prototype._wrap = function() {
var i = this._baseState;
a.forEach(function(t) {
this[t] = function() {
var e = new this.constructor(this);
i.children.push(e);
return e[t].apply(e, arguments);
};
}, this);
};
s.prototype._init = function(e) {
var t = this._baseState;
n(null === t.parent);
e.call(this);
t.children = t.children.filter(function(e) {
return e._baseState.parent === this;
}, this);
n.equal(t.children.length, 1, "Root node can have only one child");
};
s.prototype._useArgs = function(e) {
var t = this._baseState, i = e.filter(function(e) {
return e instanceof this.constructor;
}, this);
e = e.filter(function(e) {
return !(e instanceof this.constructor);
}, this);
if (0 !== i.length) {
n(null === t.children);
(t.children = i).forEach(function(e) {
e._baseState.parent = this;
}, this);
}
if (0 !== e.length) {
n(null === t.args);
t.args = e;
t.reverseArgs = e.map(function(i) {
if ("object" != typeof i || i.constructor !== Object) return i;
var r = {};
Object.keys(i).forEach(function(e) {
e == (0 | e) && (e |= 0);
var t = i[e];
r[t] = e;
});
return r;
});
}
};
[ "_peekTag", "_decodeTag", "_use", "_decodeStr", "_decodeObjid", "_decodeTime", "_decodeNull", "_decodeInt", "_decodeBool", "_decodeList", "_encodeComposite", "_encodeStr", "_encodeObjid", "_encodeTime", "_encodeNull", "_encodeInt", "_encodeBool" ].forEach(function(t) {
s.prototype[t] = function() {
var e = this._baseState;
throw new Error(t + " not implemented for encoding: " + e.enc);
};
});
o.forEach(function(i) {
s.prototype[i] = function() {
var e = this._baseState, t = Array.prototype.slice.call(arguments);
n(null === e.tag);
e.tag = i;
this._useArgs(t);
return this;
};
});
s.prototype.use = function(e) {
n(e);
var t = this._baseState;
n(null === t.use);
t.use = e;
return this;
};
s.prototype.optional = function() {
this._baseState.optional = !0;
return this;
};
s.prototype.def = function(e) {
var t = this._baseState;
n(null === t.default);
t.default = e;
t.optional = !0;
return this;
};
s.prototype.explicit = function(e) {
var t = this._baseState;
n(null === t.explicit && null === t.implicit);
t.explicit = e;
return this;
};
s.prototype.implicit = function(e) {
var t = this._baseState;
n(null === t.explicit && null === t.implicit);
t.implicit = e;
return this;
};
s.prototype.obj = function() {
var e = this._baseState, t = Array.prototype.slice.call(arguments);
e.obj = !0;
0 !== t.length && this._useArgs(t);
return this;
};
s.prototype.key = function(e) {
var t = this._baseState;
n(null === t.key);
t.key = e;
return this;
};
s.prototype.any = function() {
this._baseState.any = !0;
return this;
};
s.prototype.choice = function(t) {
var e = this._baseState;
n(null === e.choice);
e.choice = t;
this._useArgs(Object.keys(t).map(function(e) {
return t[e];
}));
return this;
};
s.prototype.contains = function(e) {
var t = this._baseState;
n(null === t.use);
t.contains = e;
return this;
};
s.prototype._decode = function(t, i) {
var e = this._baseState;
if (null === e.parent) return t.wrapResult(e.children[0]._decode(t, i));
var r, n = e.default, o = !0, a = null;
null !== e.key && (a = t.enterKey(e.key));
if (e.optional) {
var s = null;
null !== e.explicit ? s = e.explicit : null !== e.implicit ? s = e.implicit : null !== e.tag && (s = e.tag);
if (null !== s || e.any) {
o = this._peekTag(t, s, e.any);
if (t.isError(o)) return o;
} else {
var c = t.save();
try {
null === e.choice ? this._decodeGeneric(e.tag, t, i) : this._decodeChoice(t, i);
o = !0;
} catch (e) {
o = !1;
}
t.restore(c);
}
}
e.obj && o && (r = t.enterObject());
if (o) {
if (null !== e.explicit) {
var f = this._decodeTag(t, e.explicit);
if (t.isError(f)) return f;
t = f;
}
var h = t.offset;
if (null === e.use && null === e.choice) {
if (e.any) c = t.save();
var l = this._decodeTag(t, null !== e.implicit ? e.implicit : e.tag, e.any);
if (t.isError(l)) return l;
e.any ? n = t.raw(c) : t = l;
}
i && i.track && null !== e.tag && i.track(t.path(), h, t.length, "tagged");
i && i.track && null !== e.tag && i.track(t.path(), t.offset, t.length, "content");
n = e.any ? n : null === e.choice ? this._decodeGeneric(e.tag, t, i) : this._decodeChoice(t, i);
if (t.isError(n)) return n;
e.any || null !== e.choice || null === e.children || e.children.forEach(function(e) {
e._decode(t, i);
});
if (e.contains && ("octstr" === e.tag || "bitstr" === e.tag)) {
var d = new u(n);
n = this._getUse(e.contains, t._reporterState.obj)._decode(d, i);
}
}
e.obj && o && (n = t.leaveObject(r));
null === e.key || null === n && !0 !== o ? null !== a && t.exitKey(a) : t.leaveKey(a, e.key, n);
return n;
};
s.prototype._decodeGeneric = function(e, t, i) {
var r = this._baseState;
return "seq" === e || "set" === e ? null : "seqof" === e || "setof" === e ? this._decodeList(t, e, r.args[0], i) : /str$/.test(e) ? this._decodeStr(t, e, i) : "objid" === e && r.args ? this._decodeObjid(t, r.args[0], r.args[1], i) : "objid" === e ? this._decodeObjid(t, null, null, i) : "gentime" === e || "utctime" === e ? this._decodeTime(t, e, i) : "null_" === e ? this._decodeNull(t, i) : "bool" === e ? this._decodeBool(t, i) : "objDesc" === e ? this._decodeStr(t, e, i) : "int" === e || "enum" === e ? this._decodeInt(t, r.args && r.args[0], i) : null !== r.use ? this._getUse(r.use, t._reporterState.obj)._decode(t, i) : t.error("unknown tag: " + e);
};
s.prototype._getUse = function(e, t) {
var i = this._baseState;
i.useDecoder = this._use(e, t);
n(null === i.useDecoder._baseState.parent);
i.useDecoder = i.useDecoder._baseState.children[0];
if (i.implicit !== i.useDecoder._baseState.implicit) {
i.useDecoder = i.useDecoder.clone();
i.useDecoder._baseState.implicit = i.implicit;
}
return i.useDecoder;
};
s.prototype._decodeChoice = function(n, o) {
var a = this._baseState, s = null, c = !1;
Object.keys(a.choice).some(function(e) {
var t = n.save(), i = a.choice[e];
try {
var r = i._decode(n, o);
if (n.isError(r)) return !1;
s = {
type: e,
value: r
};
c = !0;
} catch (e) {
n.restore(t);
return !1;
}
return !0;
}, this);
return c ? s : n.error("Choice not matched");
};
s.prototype._createEncoderBuffer = function(e) {
return new r(e, this.reporter);
};
s.prototype._encode = function(e, t, i) {
var r = this._baseState;
if (null === r.default || r.default !== e) {
var n = this._encodeValue(e, t, i);
if (void 0 !== n && !this._skipDefault(n, t, i)) return n;
}
};
s.prototype._encodeValue = function(r, n, e) {
var t = this._baseState;
if (null === t.parent) return t.children[0]._encode(r, n || new h());
var i = null;
this.reporter = n;
if (t.optional && void 0 === r) {
if (null === t.default) return;
r = t.default;
}
var o = null, a = !1;
if (t.any) i = this._createEncoderBuffer(r); else if (t.choice) i = this._encodeChoice(r, n); else if (t.contains) {
o = this._getUse(t.contains, e)._encode(r, n);
a = !0;
} else if (t.children) {
o = t.children.map(function(e) {
if ("null_" === e._baseState.tag) return e._encode(null, n, r);
if (null === e._baseState.key) return n.error("Child should have a key");
var t = n.enterKey(e._baseState.key);
if ("object" != typeof r) return n.error("Child expected, but input is not object");
var i = e._encode(r[e._baseState.key], n, r);
n.leaveKey(t);
return i;
}, this).filter(function(e) {
return e;
});
o = this._createEncoderBuffer(o);
} else if ("seqof" === t.tag || "setof" === t.tag) {
if (!t.args || 1 !== t.args.length) return n.error("Too many args for : " + t.tag);
if (!Array.isArray(r)) return n.error("seqof/setof, but data is not Array");
var s = this.clone();
s._baseState.implicit = null;
o = this._createEncoderBuffer(r.map(function(e) {
var t = this._baseState;
return this._getUse(t.args[0], r)._encode(e, n);
}, s));
} else if (null !== t.use) i = this._getUse(t.use, e)._encode(r, n); else {
o = this._encodePrimitive(t.tag, r);
a = !0;
}
if (!t.any && null === t.choice) {
var c = null !== t.implicit ? t.implicit : t.tag, f = null === t.implicit ? "universal" : "context";
null === c ? null === t.use && n.error("Tag could be omitted only for .use()") : null === t.use && (i = this._encodeComposite(c, a, f, o));
}
null !== t.explicit && (i = this._encodeComposite(t.explicit, !1, "context", i));
return i;
};
s.prototype._encodeChoice = function(e, t) {
var i = this._baseState, r = i.choice[e.type];
r || n(!1, e.type + " not found in " + JSON.stringify(Object.keys(i.choice)));
return r._encode(e.value, t);
};
s.prototype._encodePrimitive = function(e, t) {
var i = this._baseState;
if (/str$/.test(e)) return this._encodeStr(t, e);
if ("objid" === e && i.args) return this._encodeObjid(t, i.reverseArgs[0], i.args[1]);
if ("objid" === e) return this._encodeObjid(t, null, null);
if ("gentime" === e || "utctime" === e) return this._encodeTime(t, e);
if ("null_" === e) return this._encodeNull();
if ("int" === e || "enum" === e) return this._encodeInt(t, i.args && i.reverseArgs[0]);
if ("bool" === e) return this._encodeBool(t);
if ("objDesc" === e) return this._encodeStr(t, e);
throw new Error("Unsupported tag: " + e);
};
s.prototype._isNumstr = function(e) {
return /^[0-9 ]*$/.test(e);
};
s.prototype._isPrintstr = function(e) {
return /^[A-Za-z0-9 '\(\)\+,\-\.\/:=\?]*$/.test(e);
};
}, {
"../base": 4,
"minimalistic-assert": 105
} ],
6: [ function(e, t, i) {
var r = e("inherits");
function n(e) {
this._reporterState = {
obj: null,
path: [],
options: e || {},
errors: []
};
}
(i.Reporter = n).prototype.isError = function(e) {
return e instanceof o;
};
n.prototype.save = function() {
var e = this._reporterState;
return {
obj: e.obj,
pathLen: e.path.length
};
};
n.prototype.restore = function(e) {
var t = this._reporterState;
t.obj = e.obj;
t.path = t.path.slice(0, e.pathLen);
};
n.prototype.enterKey = function(e) {
return this._reporterState.path.push(e);
};
n.prototype.exitKey = function(e) {
var t = this._reporterState;
t.path = t.path.slice(0, e - 1);
};
n.prototype.leaveKey = function(e, t, i) {
var r = this._reporterState;
this.exitKey(e);
null !== r.obj && (r.obj[t] = i);
};
n.prototype.path = function() {
return this._reporterState.path.join("/");
};
n.prototype.enterObject = function() {
var e = this._reporterState, t = e.obj;
e.obj = {};
return t;
};
n.prototype.leaveObject = function(e) {
var t = this._reporterState, i = t.obj;
t.obj = e;
return i;
};
n.prototype.error = function(e) {
var t, i = this._reporterState, r = e instanceof o;
t = r ? e : new o(i.path.map(function(e) {
return "[" + JSON.stringify(e) + "]";
}).join(""), e.message || e, e.stack);
if (!i.options.partial) throw t;
r || i.errors.push(t);
return t;
};
n.prototype.wrapResult = function(e) {
var t = this._reporterState;
return t.options.partial ? {
result: this.isError(e) ? null : e,
errors: t.errors
} : e;
};
function o(e, t) {
this.path = e;
this.rethrow(t);
}
r(o, Error);
o.prototype.rethrow = function(e) {
this.message = e + " at: " + (this.path || "(shallow)");
Error.captureStackTrace && Error.captureStackTrace(this, o);
if (!this.stack) try {
throw new Error(this.message);
} catch (e) {
this.stack = e.stack;
}
return this;
};
}, {
inherits: 101
} ],
7: [ function(e, t, i) {
var r = e("../constants");
i.tagClass = {
0: "universal",
1: "application",
2: "context",
3: "private"
};
i.tagClassByName = r._reverse(i.tagClass);
i.tag = {
0: "end",
1: "bool",
2: "int",
3: "bitstr",
4: "octstr",
5: "null_",
6: "objid",
7: "objDesc",
8: "external",
9: "real",
10: "enum",
11: "embed",
12: "utf8str",
13: "relativeOid",
16: "seq",
17: "set",
18: "numstr",
19: "printstr",
20: "t61str",
21: "videostr",
22: "ia5str",
23: "utctime",
24: "gentime",
25: "graphstr",
26: "iso646str",
27: "genstr",
28: "unistr",
29: "charstr",
30: "bmpstr"
};
i.tagByName = r._reverse(i.tag);
}, {
"../constants": 8
} ],
8: [ function(e, t, i) {
var r = i;
r._reverse = function(i) {
var r = {};
Object.keys(i).forEach(function(e) {
(0 | e) == e && (e |= 0);
var t = i[e];
r[t] = e;
});
return r;
};
r.der = e("./der");
}, {
"./der": 7
} ],
9: [ function(e, t, i) {
var r = e("inherits"), n = e("../../asn1"), o = n.base, a = n.bignum, s = n.constants.der;
function c(e) {
this.enc = "der";
this.name = e.name;
this.entity = e;
this.tree = new f();
this.tree._init(e.body);
}
(t.exports = c).prototype.decode = function(e, t) {
e instanceof o.DecoderBuffer || (e = new o.DecoderBuffer(e, t));
return this.tree._decode(e, t);
};
function f(e) {
o.Node.call(this, "der", e);
}
r(f, o.Node);
f.prototype._peekTag = function(e, t, i) {
if (e.isEmpty()) return !1;
var r = e.save(), n = h(e, 'Failed to peek tag: "' + t + '"');
if (e.isError(n)) return n;
e.restore(r);
return n.tag === t || n.tagStr === t || n.tagStr + "of" === t || i;
};
f.prototype._decodeTag = function(e, t, i) {
var r = h(e, 'Failed to decode tag of "' + t + '"');
if (e.isError(r)) return r;
var n = l(e, r.primitive, 'Failed to get length of "' + t + '"');
if (e.isError(n)) return n;
if (!i && r.tag !== t && r.tagStr !== t && r.tagStr + "of" !== t) return e.error('Failed to match tag: "' + t + '"');
if (r.primitive || null !== n) return e.skip(n, 'Failed to match body of: "' + t + '"');
var o = e.save(), a = this._skipUntilEnd(e, 'Failed to skip indefinite length body: "' + this.tag + '"');
if (e.isError(a)) return a;
n = e.offset - o.offset;
e.restore(o);
return e.skip(n, 'Failed to match body of: "' + t + '"');
};
f.prototype._skipUntilEnd = function(e, t) {
for (;;) {
var i = h(e, t);
if (e.isError(i)) return i;
var r, n = l(e, i.primitive, t);
if (e.isError(n)) return n;
r = i.primitive || null !== n ? e.skip(n) : this._skipUntilEnd(e, t);
if (e.isError(r)) return r;
if ("end" === i.tagStr) break;
}
};
f.prototype._decodeList = function(e, t, i, r) {
for (var n = []; !e.isEmpty(); ) {
var o = this._peekTag(e, "end");
if (e.isError(o)) return o;
var a = i.decode(e, "der", r);
if (e.isError(a) && o) break;
n.push(a);
}
return n;
};
f.prototype._decodeStr = function(e, t) {
if ("bitstr" === t) {
var i = e.readUInt8();
return e.isError(i) ? i : {
unused: i,
data: e.raw()
};
}
if ("bmpstr" === t) {
var r = e.raw();
if (r.length % 2 == 1) return e.error("Decoding of string type: bmpstr length mismatch");
for (var n = "", o = 0; o < r.length / 2; o++) n += String.fromCharCode(r.readUInt16BE(2 * o));
return n;
}
if ("numstr" === t) {
var a = e.raw().toString("ascii");
return this._isNumstr(a) ? a : e.error("Decoding of string type: numstr unsupported characters");
}
if ("octstr" === t) return e.raw();
if ("objDesc" === t) return e.raw();
if ("printstr" === t) {
var s = e.raw().toString("ascii");
return this._isPrintstr(s) ? s : e.error("Decoding of string type: printstr unsupported characters");
}
return /str$/.test(t) ? e.raw().toString() : e.error("Decoding of string type: " + t + " unsupported");
};
f.prototype._decodeObjid = function(e, t, i) {
for (var r, n = [], o = 0; !e.isEmpty(); ) {
var a = e.readUInt8();
o <<= 7;
o |= 127 & a;
if (0 == (128 & a)) {
n.push(o);
o = 0;
}
}
128 & a && n.push(o);
var s = n[0] / 40 | 0, c = n[0] % 40;
r = i ? n : [ s, c ].concat(n.slice(1));
if (t) {
var f = t[r.join(" ")];
void 0 === f && (f = t[r.join(".")]);
void 0 !== f && (r = f);
}
return r;
};
f.prototype._decodeTime = function(e, t) {
var i = e.raw().toString();
if ("gentime" === t) var r = 0 | i.slice(0, 4), n = 0 | i.slice(4, 6), o = 0 | i.slice(6, 8), a = 0 | i.slice(8, 10), s = 0 | i.slice(10, 12), c = 0 | i.slice(12, 14); else {
if ("utctime" !== t) return e.error("Decoding " + t + " time is not supported yet");
r = 0 | i.slice(0, 2), n = 0 | i.slice(2, 4), o = 0 | i.slice(4, 6), a = 0 | i.slice(6, 8), 
s = 0 | i.slice(8, 10), c = 0 | i.slice(10, 12);
r = r < 70 ? 2e3 + r : 1900 + r;
}
return Date.UTC(r, n - 1, o, a, s, c, 0);
};
f.prototype._decodeNull = function(e) {
return null;
};
f.prototype._decodeBool = function(e) {
var t = e.readUInt8();
return e.isError(t) ? t : 0 !== t;
};
f.prototype._decodeInt = function(e, t) {
var i = e.raw(), r = new a(i);
t && (r = t[r.toString(10)] || r);
return r;
};
f.prototype._use = function(e, t) {
"function" == typeof e && (e = e(t));
return e._getDecoder("der").tree;
};
function h(e, t) {
var i = e.readUInt8(t);
if (e.isError(i)) return i;
var r = s.tagClass[i >> 6], n = 0 == (32 & i);
if (31 == (31 & i)) {
var o = i;
i = 0;
for (;128 == (128 & o); ) {
o = e.readUInt8(t);
if (e.isError(o)) return o;
i <<= 7;
i |= 127 & o;
}
} else i &= 31;
return {
cls: r,
primitive: n,
tag: i,
tagStr: s.tag[i]
};
}
function l(e, t, i) {
var r = e.readUInt8(i);
if (e.isError(r)) return r;
if (!t && 128 === r) return null;
if (0 == (128 & r)) return r;
var n = 127 & r;
if (4 < n) return e.error("length octect is too long");
for (var o = r = 0; o < n; o++) {
r <<= 8;
var a = e.readUInt8(i);
if (e.isError(a)) return a;
r |= a;
}
return r;
}
}, {
"../../asn1": 1,
inherits: 101
} ],
10: [ function(e, t, i) {
var r = i;
r.der = e("./der");
r.pem = e("./pem");
}, {
"./der": 9,
"./pem": 11
} ],
11: [ function(e, t, i) {
var r = e("inherits"), l = e("buffer").Buffer, d = e("./der");
function n(e) {
d.call(this, e);
this.enc = "pem";
}
r(n, d);
(t.exports = n).prototype.decode = function(e, t) {
for (var i = e.toString().split(/[\r\n]+/g), r = t.label.toUpperCase(), n = /^-----(BEGIN|END) ([^-]+)-----$/, o = -1, a = -1, s = 0; s < i.length; s++) {
var c = i[s].match(n);
if (null !== c && c[2] === r) {
if (-1 !== o) {
if ("END" !== c[1]) break;
a = s;
break;
}
if ("BEGIN" !== c[1]) break;
o = s;
}
}
if (-1 === o || -1 === a) throw new Error("PEM section not found for: " + r);
var f = i.slice(o + 1, a).join("");
f.replace(/[^a-z0-9\+\/=]+/gi, "");
var h = new l(f, "base64");
return d.prototype.decode.call(this, h, t);
};
}, {
"./der": 9,
buffer: 47,
inherits: 101
} ],
12: [ function(e, t, i) {
var r = e("inherits"), f = e("buffer").Buffer, n = e("../../asn1"), o = n.base, h = n.constants.der;
function a(e) {
this.enc = "der";
this.name = e.name;
this.entity = e;
this.tree = new s();
this.tree._init(e.body);
}
(t.exports = a).prototype.encode = function(e, t) {
return this.tree._encode(e, t).join();
};
function s(e) {
o.Node.call(this, "der", e);
}
r(s, o.Node);
s.prototype._encodeComposite = function(e, t, i, r) {
var n = function(e, t, i, r) {
var n;
"seqof" === e ? e = "seq" : "setof" === e && (e = "set");
if (h.tagByName.hasOwnProperty(e)) n = h.tagByName[e]; else {
if ("number" != typeof e || (0 | e) !== e) return r.error("Unknown tag: " + e);
n = e;
}
if (31 <= n) return r.error("Multi-octet tag encoding unsupported");
t || (n |= 32);
return n |= h.tagClassByName[i || "universal"] << 6;
}(e, t, i, this.reporter);
if (r.length < 128) {
var o;
(o = new f(2))[0] = n;
o[1] = r.length;
return this._createEncoderBuffer([ o, r ]);
}
for (var a = 1, s = r.length; 256 <= s; s >>= 8) a++;
(o = new f(2 + a))[0] = n;
o[1] = 128 | a;
s = 1 + a;
for (var c = r.length; 0 < c; s--, c >>= 8) o[s] = 255 & c;
return this._createEncoderBuffer([ o, r ]);
};
s.prototype._encodeStr = function(e, t) {
if ("bitstr" === t) return this._createEncoderBuffer([ 0 | e.unused, e.data ]);
if ("bmpstr" === t) {
for (var i = new f(2 * e.length), r = 0; r < e.length; r++) i.writeUInt16BE(e.charCodeAt(r), 2 * r);
return this._createEncoderBuffer(i);
}
return "numstr" === t ? this._isNumstr(e) ? this._createEncoderBuffer(e) : this.reporter.error("Encoding of string type: numstr supports only digits and space") : "printstr" === t ? this._isPrintstr(e) ? this._createEncoderBuffer(e) : this.reporter.error("Encoding of string type: printstr supports only latin upper and lower case letters, digits, space, apostrophe, left and rigth parenthesis, plus sign, comma, hyphen, dot, slash, colon, equal sign, question mark") : /str$/.test(t) ? this._createEncoderBuffer(e) : "objDesc" === t ? this._createEncoderBuffer(e) : this.reporter.error("Encoding of string type: " + t + " unsupported");
};
s.prototype._encodeObjid = function(e, t, i) {
if ("string" == typeof e) {
if (!t) return this.reporter.error("string objid given, but no values map found");
if (!t.hasOwnProperty(e)) return this.reporter.error("objid not found in values map");
e = t[e].split(/[\s\.]+/g);
for (var r = 0; r < e.length; r++) e[r] |= 0;
} else if (Array.isArray(e)) {
e = e.slice();
for (r = 0; r < e.length; r++) e[r] |= 0;
}
if (!Array.isArray(e)) return this.reporter.error("objid() should be either array or string, got: " + JSON.stringify(e));
if (!i) {
if (40 <= e[1]) return this.reporter.error("Second objid identifier OOB");
e.splice(0, 2, 40 * e[0] + e[1]);
}
var n = 0;
for (r = 0; r < e.length; r++) {
var o = e[r];
for (n++; 128 <= o; o >>= 7) n++;
}
var a = new f(n), s = a.length - 1;
for (r = e.length - 1; 0 <= r; r--) {
o = e[r];
a[s--] = 127 & o;
for (;0 < (o >>= 7); ) a[s--] = 128 | 127 & o;
}
return this._createEncoderBuffer(a);
};
function c(e) {
return e < 10 ? "0" + e : e;
}
s.prototype._encodeTime = function(e, t) {
var i, r = new Date(e);
"gentime" === t ? i = [ c(r.getFullYear()), c(r.getUTCMonth() + 1), c(r.getUTCDate()), c(r.getUTCHours()), c(r.getUTCMinutes()), c(r.getUTCSeconds()), "Z" ].join("") : "utctime" === t ? i = [ c(r.getFullYear() % 100), c(r.getUTCMonth() + 1), c(r.getUTCDate()), c(r.getUTCHours()), c(r.getUTCMinutes()), c(r.getUTCSeconds()), "Z" ].join("") : this.reporter.error("Encoding " + t + " time is not supported yet");
return this._encodeStr(i, "octstr");
};
s.prototype._encodeNull = function() {
return this._createEncoderBuffer("");
};
s.prototype._encodeInt = function(e, t) {
if ("string" == typeof e) {
if (!t) return this.reporter.error("String int or enum given, but no values map");
if (!t.hasOwnProperty(e)) return this.reporter.error("Values map doesn't contain: " + JSON.stringify(e));
e = t[e];
}
if ("number" != typeof e && !f.isBuffer(e)) {
var i = e.toArray();
!e.sign && 128 & i[0] && i.unshift(0);
e = new f(i);
}
if (f.isBuffer(e)) {
var r = e.length;
0 === e.length && r++;
var n = new f(r);
e.copy(n);
0 === e.length && (n[0] = 0);
return this._createEncoderBuffer(n);
}
if (e < 128) return this._createEncoderBuffer(e);
if (e < 256) return this._createEncoderBuffer([ 0, e ]);
r = 1;
for (var o = e; 256 <= o; o >>= 8) r++;
for (o = (n = new Array(r)).length - 1; 0 <= o; o--) {
n[o] = 255 & e;
e >>= 8;
}
128 & n[0] && n.unshift(0);
return this._createEncoderBuffer(new f(n));
};
s.prototype._encodeBool = function(e) {
return this._createEncoderBuffer(e ? 255 : 0);
};
s.prototype._use = function(e, t) {
"function" == typeof e && (e = e(t));
return e._getEncoder("der").tree;
};
s.prototype._skipDefault = function(e, t, i) {
var r, n = this._baseState;
if (null === n.default) return !1;
var o = e.join();
void 0 === n.defaultBuffer && (n.defaultBuffer = this._encodeValue(n.default, t, i).join());
if (o.length !== n.defaultBuffer.length) return !1;
for (r = 0; r < o.length; r++) if (o[r] !== n.defaultBuffer[r]) return !1;
return !0;
};
}, {
"../../asn1": 1,
buffer: 47,
inherits: 101
} ],
13: [ function(e, t, i) {
var r = i;
r.der = e("./der");
r.pem = e("./pem");
}, {
"./der": 12,
"./pem": 14
} ],
14: [ function(e, t, i) {
var r = e("inherits"), o = e("./der");
function n(e) {
o.call(this, e);
this.enc = "pem";
}
r(n, o);
(t.exports = n).prototype.encode = function(e, t) {
for (var i = o.prototype.encode.call(this, e).toString("base64"), r = [ "-----BEGIN " + t.label + "-----" ], n = 0; n < i.length; n += 64) r.push(i.slice(n, n + 64));
r.push("-----END " + t.label + "-----");
return r.join("\n");
};
}, {
"./der": 12,
inherits: 101
} ],
15: [ function(e, t, i) {
"use strict";
i.byteLength = function(e) {
return 3 * e.length / 4 - l(e);
};
i.toByteArray = function(e) {
var t, i, r, n, o, a = e.length;
n = l(e);
o = new h(3 * a / 4 - n);
i = 0 < n ? a - 4 : a;
var s = 0;
for (t = 0; t < i; t += 4) {
r = f[e.charCodeAt(t)] << 18 | f[e.charCodeAt(t + 1)] << 12 | f[e.charCodeAt(t + 2)] << 6 | f[e.charCodeAt(t + 3)];
o[s++] = r >> 16 & 255;
o[s++] = r >> 8 & 255;
o[s++] = 255 & r;
}
if (2 === n) {
r = f[e.charCodeAt(t)] << 2 | f[e.charCodeAt(t + 1)] >> 4;
o[s++] = 255 & r;
} else if (1 === n) {
r = f[e.charCodeAt(t)] << 10 | f[e.charCodeAt(t + 1)] << 4 | f[e.charCodeAt(t + 2)] >> 2;
o[s++] = r >> 8 & 255;
o[s++] = 255 & r;
}
return o;
};
i.fromByteArray = function(e) {
for (var t, i = e.length, r = i % 3, n = "", o = [], a = 0, s = i - r; a < s; a += 16383) o.push(d(e, a, s < a + 16383 ? s : a + 16383));
if (1 === r) {
t = e[i - 1];
n += c[t >> 2];
n += c[t << 4 & 63];
n += "==";
} else if (2 === r) {
t = (e[i - 2] << 8) + e[i - 1];
n += c[t >> 10];
n += c[t >> 4 & 63];
n += c[t << 2 & 63];
n += "=";
}
o.push(n);
return o.join("");
};
for (var c = [], f = [], h = "undefined" != typeof Uint8Array ? Uint8Array : Array, r = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", n = 0, o = r.length; n < o; ++n) {
c[n] = r[n];
f[r.charCodeAt(n)] = n;
}
f["-".charCodeAt(0)] = 62;
f["_".charCodeAt(0)] = 63;
function l(e) {
var t = e.length;
if (0 < t % 4) throw new Error("Invalid string. Length must be a multiple of 4");
return "=" === e[t - 2] ? 2 : "=" === e[t - 1] ? 1 : 0;
}
function d(e, t, i) {
for (var r, n, o = [], a = t; a < i; a += 3) {
r = (e[a] << 16 & 16711680) + (e[a + 1] << 8 & 65280) + (255 & e[a + 2]);
o.push(c[(n = r) >> 18 & 63] + c[n >> 12 & 63] + c[n >> 6 & 63] + c[63 & n]);
}
return o.join("");
}
}, {} ],
16: [ function(I, e, t) {
(function(e, t) {
"use strict";
function m(e, t) {
if (!e) throw new Error(t || "Assertion failed");
}
function i(e, t) {
e.super_ = t;
var i = function() {};
i.prototype = t.prototype;
e.prototype = new i();
e.prototype.constructor = e;
}
function g(e, t, i) {
if (g.isBN(e)) return e;
this.negative = 0;
this.words = null;
this.length = 0;
if ((this.red = null) !== e) {
if ("le" === t || "be" === t) {
i = t;
t = 10;
}
this._init(e || 0, t || 10, i || "be");
}
}
"object" == typeof e ? e.exports = g : t.BN = g;
(g.BN = g).wordSize = 26;
var r;
try {
r = I("buffer").Buffer;
} catch (e) {}
g.isBN = function(e) {
return e instanceof g || null !== e && "object" == typeof e && e.constructor.wordSize === g.wordSize && Array.isArray(e.words);
};
g.max = function(e, t) {
return 0 < e.cmp(t) ? e : t;
};
g.min = function(e, t) {
return e.cmp(t) < 0 ? e : t;
};
g.prototype._init = function(e, t, i) {
if ("number" == typeof e) return this._initNumber(e, t, i);
if ("object" == typeof e) return this._initArray(e, t, i);
"hex" === t && (t = 16);
m(t === (0 | t) && 2 <= t && t <= 36);
var r = 0;
"-" === (e = e.toString().replace(/\s+/g, ""))[0] && r++;
16 === t ? this._parseHex(e, r) : this._parseBase(e, t, r);
"-" === e[0] && (this.negative = 1);
this.strip();
"le" === i && this._initArray(this.toArray(), t, i);
};
g.prototype._initNumber = function(e, t, i) {
if (e < 0) {
this.negative = 1;
e = -e;
}
if (e < 67108864) {
this.words = [ 67108863 & e ];
this.length = 1;
} else if (e < 4503599627370496) {
this.words = [ 67108863 & e, e / 67108864 & 67108863 ];
this.length = 2;
} else {
m(e < 9007199254740992);
this.words = [ 67108863 & e, e / 67108864 & 67108863, 1 ];
this.length = 3;
}
"le" === i && this._initArray(this.toArray(), t, i);
};
g.prototype._initArray = function(e, t, i) {
m("number" == typeof e.length);
if (e.length <= 0) {
this.words = [ 0 ];
this.length = 1;
return this;
}
this.length = Math.ceil(e.length / 3);
this.words = new Array(this.length);
for (var r = 0; r < this.length; r++) this.words[r] = 0;
var n, o, a = 0;
if ("be" === i) for (r = e.length - 1, n = 0; 0 <= r; r -= 3) {
o = e[r] | e[r - 1] << 8 | e[r - 2] << 16;
this.words[n] |= o << a & 67108863;
this.words[n + 1] = o >>> 26 - a & 67108863;
if (26 <= (a += 24)) {
a -= 26;
n++;
}
} else if ("le" === i) for (n = r = 0; r < e.length; r += 3) {
o = e[r] | e[r + 1] << 8 | e[r + 2] << 16;
this.words[n] |= o << a & 67108863;
this.words[n + 1] = o >>> 26 - a & 67108863;
if (26 <= (a += 24)) {
a -= 26;
n++;
}
}
return this.strip();
};
function a(e, t, i) {
for (var r = 0, n = Math.min(e.length, i), o = t; o < n; o++) {
var a = e.charCodeAt(o) - 48;
r <<= 4;
r |= 49 <= a && a <= 54 ? a - 49 + 10 : 17 <= a && a <= 22 ? a - 17 + 10 : 15 & a;
}
return r;
}
g.prototype._parseHex = function(e, t) {
this.length = Math.ceil((e.length - t) / 6);
this.words = new Array(this.length);
for (var i = 0; i < this.length; i++) this.words[i] = 0;
var r, n, o = 0;
for (i = e.length - 6, r = 0; t <= i; i -= 6) {
n = a(e, i, i + 6);
this.words[r] |= n << o & 67108863;
this.words[r + 1] |= n >>> 26 - o & 4194303;
if (26 <= (o += 24)) {
o -= 26;
r++;
}
}
if (i + 6 !== t) {
n = a(e, t, i + 6);
this.words[r] |= n << o & 67108863;
this.words[r + 1] |= n >>> 26 - o & 4194303;
}
this.strip();
};
function l(e, t, i, r) {
for (var n = 0, o = Math.min(e.length, i), a = t; a < o; a++) {
var s = e.charCodeAt(a) - 48;
n *= r;
n += 49 <= s ? s - 49 + 10 : 17 <= s ? s - 17 + 10 : s;
}
return n;
}
g.prototype._parseBase = function(e, t, i) {
this.words = [ 0 ];
for (var r = 0, n = this.length = 1; n <= 67108863; n *= t) r++;
r--;
n = n / t | 0;
for (var o = e.length - i, a = o % r, s = Math.min(o, o - a) + i, c = 0, f = i; f < s; f += r) {
c = l(e, f, f + r, t);
this.imuln(n);
this.words[0] + c < 67108864 ? this.words[0] += c : this._iaddn(c);
}
if (0 !== a) {
var h = 1;
c = l(e, f, e.length, t);
for (f = 0; f < a; f++) h *= t;
this.imuln(h);
this.words[0] + c < 67108864 ? this.words[0] += c : this._iaddn(c);
}
};
g.prototype.copy = function(e) {
e.words = new Array(this.length);
for (var t = 0; t < this.length; t++) e.words[t] = this.words[t];
e.length = this.length;
e.negative = this.negative;
e.red = this.red;
};
g.prototype.clone = function() {
var e = new g(null);
this.copy(e);
return e;
};
g.prototype._expand = function(e) {
for (;this.length < e; ) this.words[this.length++] = 0;
return this;
};
g.prototype.strip = function() {
for (;1 < this.length && 0 === this.words[this.length - 1]; ) this.length--;
return this._normSign();
};
g.prototype._normSign = function() {
1 === this.length && 0 === this.words[0] && (this.negative = 0);
return this;
};
g.prototype.inspect = function() {
return (this.red ? "<BN-R: " : "<BN: ") + this.toString(16) + ">";
};
var d = [ "", "0", "00", "000", "0000", "00000", "000000", "0000000", "00000000", "000000000", "0000000000", "00000000000", "000000000000", "0000000000000", "00000000000000", "000000000000000", "0000000000000000", "00000000000000000", "000000000000000000", "0000000000000000000", "00000000000000000000", "000000000000000000000", "0000000000000000000000", "00000000000000000000000", "000000000000000000000000", "0000000000000000000000000" ], u = [ 0, 0, 25, 16, 12, 11, 10, 9, 8, 8, 7, 7, 7, 7, 6, 6, 6, 6, 6, 6, 6, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5 ], p = [ 0, 0, 33554432, 43046721, 16777216, 48828125, 60466176, 40353607, 16777216, 43046721, 1e7, 19487171, 35831808, 62748517, 7529536, 11390625, 16777216, 24137569, 34012224, 47045881, 64e6, 4084101, 5153632, 6436343, 7962624, 9765625, 11881376, 14348907, 17210368, 20511149, 243e5, 28629151, 33554432, 39135393, 45435424, 52521875, 60466176 ];
g.prototype.toString = function(e, t) {
t = 0 | t || 1;
var i;
if (16 === (e = e || 10) || "hex" === e) {
i = "";
for (var r = 0, n = 0, o = 0; o < this.length; o++) {
var a = this.words[o], s = (16777215 & (a << r | n)).toString(16);
i = 0 !== (n = a >>> 24 - r & 16777215) || o !== this.length - 1 ? d[6 - s.length] + s + i : s + i;
if (26 <= (r += 2)) {
r -= 26;
o--;
}
}
0 !== n && (i = n.toString(16) + i);
for (;i.length % t != 0; ) i = "0" + i;
0 !== this.negative && (i = "-" + i);
return i;
}
if (e === (0 | e) && 2 <= e && e <= 36) {
var c = u[e], f = p[e];
i = "";
var h = this.clone();
h.negative = 0;
for (;!h.isZero(); ) {
var l = h.modn(f).toString(e);
i = (h = h.idivn(f)).isZero() ? l + i : d[c - l.length] + l + i;
}
this.isZero() && (i = "0" + i);
for (;i.length % t != 0; ) i = "0" + i;
0 !== this.negative && (i = "-" + i);
return i;
}
m(!1, "Base should be between 2 and 36");
};
g.prototype.toNumber = function() {
var e = this.words[0];
2 === this.length ? e += 67108864 * this.words[1] : 3 === this.length && 1 === this.words[2] ? e += 4503599627370496 + 67108864 * this.words[1] : 2 < this.length && m(!1, "Number can only safely store up to 53 bits");
return 0 !== this.negative ? -e : e;
};
g.prototype.toJSON = function() {
return this.toString(16);
};
g.prototype.toBuffer = function(e, t) {
m("undefined" != typeof r);
return this.toArrayLike(r, e, t);
};
g.prototype.toArray = function(e, t) {
return this.toArrayLike(Array, e, t);
};
g.prototype.toArrayLike = function(e, t, i) {
var r = this.byteLength(), n = i || Math.max(1, r);
m(r <= n, "byte array longer than desired length");
m(0 < n, "Requested array length <= 0");
this.strip();
var o, a, s = "le" === t, c = new e(n), f = this.clone();
if (s) {
for (a = 0; !f.isZero(); a++) {
o = f.andln(255);
f.iushrn(8);
c[a] = o;
}
for (;a < n; a++) c[a] = 0;
} else {
for (a = 0; a < n - r; a++) c[a] = 0;
for (a = 0; !f.isZero(); a++) {
o = f.andln(255);
f.iushrn(8);
c[n - a - 1] = o;
}
}
return c;
};
g.prototype._countBits = Math.clz32 ? function(e) {
return 32 - Math.clz32(e);
} : function(e) {
var t = e, i = 0;
if (4096 <= t) {
i += 13;
t >>>= 13;
}
if (64 <= t) {
i += 7;
t >>>= 7;
}
if (8 <= t) {
i += 4;
t >>>= 4;
}
if (2 <= t) {
i += 2;
t >>>= 2;
}
return i + t;
};
g.prototype._zeroBits = function(e) {
if (0 === e) return 26;
var t = e, i = 0;
if (0 == (8191 & t)) {
i += 13;
t >>>= 13;
}
if (0 == (127 & t)) {
i += 7;
t >>>= 7;
}
if (0 == (15 & t)) {
i += 4;
t >>>= 4;
}
if (0 == (3 & t)) {
i += 2;
t >>>= 2;
}
0 == (1 & t) && i++;
return i;
};
g.prototype.bitLength = function() {
var e = this.words[this.length - 1], t = this._countBits(e);
return 26 * (this.length - 1) + t;
};
g.prototype.zeroBits = function() {
if (this.isZero()) return 0;
for (var e = 0, t = 0; t < this.length; t++) {
var i = this._zeroBits(this.words[t]);
e += i;
if (26 !== i) break;
}
return e;
};
g.prototype.byteLength = function() {
return Math.ceil(this.bitLength() / 8);
};
g.prototype.toTwos = function(e) {
return 0 !== this.negative ? this.abs().inotn(e).iaddn(1) : this.clone();
};
g.prototype.fromTwos = function(e) {
return this.testn(e - 1) ? this.notn(e).iaddn(1).ineg() : this.clone();
};
g.prototype.isNeg = function() {
return 0 !== this.negative;
};
g.prototype.neg = function() {
return this.clone().ineg();
};
g.prototype.ineg = function() {
this.isZero() || (this.negative ^= 1);
return this;
};
g.prototype.iuor = function(e) {
for (;this.length < e.length; ) this.words[this.length++] = 0;
for (var t = 0; t < e.length; t++) this.words[t] = this.words[t] | e.words[t];
return this.strip();
};
g.prototype.ior = function(e) {
m(0 == (this.negative | e.negative));
return this.iuor(e);
};
g.prototype.or = function(e) {
return this.length > e.length ? this.clone().ior(e) : e.clone().ior(this);
};
g.prototype.uor = function(e) {
return this.length > e.length ? this.clone().iuor(e) : e.clone().iuor(this);
};
g.prototype.iuand = function(e) {
var t;
t = this.length > e.length ? e : this;
for (var i = 0; i < t.length; i++) this.words[i] = this.words[i] & e.words[i];
this.length = t.length;
return this.strip();
};
g.prototype.iand = function(e) {
m(0 == (this.negative | e.negative));
return this.iuand(e);
};
g.prototype.and = function(e) {
return this.length > e.length ? this.clone().iand(e) : e.clone().iand(this);
};
g.prototype.uand = function(e) {
return this.length > e.length ? this.clone().iuand(e) : e.clone().iuand(this);
};
g.prototype.iuxor = function(e) {
var t, i;
if (this.length > e.length) {
t = this;
i = e;
} else {
t = e;
i = this;
}
for (var r = 0; r < i.length; r++) this.words[r] = t.words[r] ^ i.words[r];
if (this !== t) for (;r < t.length; r++) this.words[r] = t.words[r];
this.length = t.length;
return this.strip();
};
g.prototype.ixor = function(e) {
m(0 == (this.negative | e.negative));
return this.iuxor(e);
};
g.prototype.xor = function(e) {
return this.length > e.length ? this.clone().ixor(e) : e.clone().ixor(this);
};
g.prototype.uxor = function(e) {
return this.length > e.length ? this.clone().iuxor(e) : e.clone().iuxor(this);
};
g.prototype.inotn = function(e) {
m("number" == typeof e && 0 <= e);
var t = 0 | Math.ceil(e / 26), i = e % 26;
this._expand(t);
0 < i && t--;
for (var r = 0; r < t; r++) this.words[r] = 67108863 & ~this.words[r];
0 < i && (this.words[r] = ~this.words[r] & 67108863 >> 26 - i);
return this.strip();
};
g.prototype.notn = function(e) {
return this.clone().inotn(e);
};
g.prototype.setn = function(e, t) {
m("number" == typeof e && 0 <= e);
var i = e / 26 | 0, r = e % 26;
this._expand(i + 1);
this.words[i] = t ? this.words[i] | 1 << r : this.words[i] & ~(1 << r);
return this.strip();
};
g.prototype.iadd = function(e) {
var t, i, r;
if (0 !== this.negative && 0 === e.negative) {
this.negative = 0;
t = this.isub(e);
this.negative ^= 1;
return this._normSign();
}
if (0 === this.negative && 0 !== e.negative) {
e.negative = 0;
t = this.isub(e);
e.negative = 1;
return t._normSign();
}
if (this.length > e.length) {
i = this;
r = e;
} else {
i = e;
r = this;
}
for (var n = 0, o = 0; o < r.length; o++) {
t = (0 | i.words[o]) + (0 | r.words[o]) + n;
this.words[o] = 67108863 & t;
n = t >>> 26;
}
for (;0 !== n && o < i.length; o++) {
t = (0 | i.words[o]) + n;
this.words[o] = 67108863 & t;
n = t >>> 26;
}
this.length = i.length;
if (0 !== n) {
this.words[this.length] = n;
this.length++;
} else if (i !== this) for (;o < i.length; o++) this.words[o] = i.words[o];
return this;
};
g.prototype.add = function(e) {
var t;
if (0 !== e.negative && 0 === this.negative) {
e.negative = 0;
t = this.sub(e);
e.negative ^= 1;
return t;
}
if (0 === e.negative && 0 !== this.negative) {
this.negative = 0;
t = e.sub(this);
this.negative = 1;
return t;
}
return this.length > e.length ? this.clone().iadd(e) : e.clone().iadd(this);
};
g.prototype.isub = function(e) {
if (0 !== e.negative) {
e.negative = 0;
var t = this.iadd(e);
e.negative = 1;
return t._normSign();
}
if (0 !== this.negative) {
this.negative = 0;
this.iadd(e);
this.negative = 1;
return this._normSign();
}
var i, r, n = this.cmp(e);
if (0 === n) {
this.negative = 0;
this.length = 1;
this.words[0] = 0;
return this;
}
if (0 < n) {
i = this;
r = e;
} else {
i = e;
r = this;
}
for (var o = 0, a = 0; a < r.length; a++) {
o = (t = (0 | i.words[a]) - (0 | r.words[a]) + o) >> 26;
this.words[a] = 67108863 & t;
}
for (;0 !== o && a < i.length; a++) {
o = (t = (0 | i.words[a]) + o) >> 26;
this.words[a] = 67108863 & t;
}
if (0 === o && a < i.length && i !== this) for (;a < i.length; a++) this.words[a] = i.words[a];
this.length = Math.max(this.length, a);
i !== this && (this.negative = 1);
return this.strip();
};
g.prototype.sub = function(e) {
return this.clone().isub(e);
};
function n(e, t, i) {
i.negative = t.negative ^ e.negative;
var r = e.length + t.length | 0;
r = (i.length = r) - 1 | 0;
var n = 0 | e.words[0], o = 0 | t.words[0], a = n * o, s = 67108863 & a, c = a / 67108864 | 0;
i.words[0] = s;
for (var f = 1; f < r; f++) {
for (var h = c >>> 26, l = 67108863 & c, d = Math.min(f, t.length - 1), u = Math.max(0, f - e.length + 1); u <= d; u++) {
var p = f - u | 0;
h += (a = (n = 0 | e.words[p]) * (o = 0 | t.words[u]) + l) / 67108864 | 0;
l = 67108863 & a;
}
i.words[f] = 0 | l;
c = 0 | h;
}
0 !== c ? i.words[f] = 0 | c : i.length--;
return i.strip();
}
var o = function(e, t, i) {
var r, n, o, a = e.words, s = t.words, c = i.words, f = 0, h = 0 | a[0], l = 8191 & h, d = h >>> 13, u = 0 | a[1], p = 8191 & u, b = u >>> 13, m = 0 | a[2], g = 8191 & m, y = m >>> 13, v = 0 | a[3], w = 8191 & v, S = v >>> 13, _ = 0 | a[4], I = 8191 & _, x = _ >>> 13, C = 0 | a[5], G = 8191 & C, A = C >>> 13, k = 0 | a[6], T = 8191 & k, E = k >>> 13, M = 0 | a[7], D = 8191 & M, R = M >>> 13, N = 0 | a[8], B = 8191 & N, P = N >>> 13, L = 0 | a[9], U = 8191 & L, O = L >>> 13, F = 0 | s[0], j = 8191 & F, q = F >>> 13, z = 0 | s[1], H = 8191 & z, V = z >>> 13, K = 0 | s[2], W = 8191 & K, Y = K >>> 13, J = 0 | s[3], X = 8191 & J, Z = J >>> 13, Q = 0 | s[4], $ = 8191 & Q, ee = Q >>> 13, te = 0 | s[5], ie = 8191 & te, re = te >>> 13, ne = 0 | s[6], oe = 8191 & ne, ae = ne >>> 13, se = 0 | s[7], ce = 8191 & se, fe = se >>> 13, he = 0 | s[8], le = 8191 & he, de = he >>> 13, ue = 0 | s[9], pe = 8191 & ue, be = ue >>> 13;
i.negative = e.negative ^ t.negative;
i.length = 19;
var me = (f + (r = Math.imul(l, j)) | 0) + ((8191 & (n = (n = Math.imul(l, q)) + Math.imul(d, j) | 0)) << 13) | 0;
f = ((o = Math.imul(d, q)) + (n >>> 13) | 0) + (me >>> 26) | 0;
me &= 67108863;
r = Math.imul(p, j);
n = (n = Math.imul(p, q)) + Math.imul(b, j) | 0;
o = Math.imul(b, q);
var ge = (f + (r = r + Math.imul(l, H) | 0) | 0) + ((8191 & (n = (n = n + Math.imul(l, V) | 0) + Math.imul(d, H) | 0)) << 13) | 0;
f = ((o = o + Math.imul(d, V) | 0) + (n >>> 13) | 0) + (ge >>> 26) | 0;
ge &= 67108863;
r = Math.imul(g, j);
n = (n = Math.imul(g, q)) + Math.imul(y, j) | 0;
o = Math.imul(y, q);
r = r + Math.imul(p, H) | 0;
n = (n = n + Math.imul(p, V) | 0) + Math.imul(b, H) | 0;
o = o + Math.imul(b, V) | 0;
var ye = (f + (r = r + Math.imul(l, W) | 0) | 0) + ((8191 & (n = (n = n + Math.imul(l, Y) | 0) + Math.imul(d, W) | 0)) << 13) | 0;
f = ((o = o + Math.imul(d, Y) | 0) + (n >>> 13) | 0) + (ye >>> 26) | 0;
ye &= 67108863;
r = Math.imul(w, j);
n = (n = Math.imul(w, q)) + Math.imul(S, j) | 0;
o = Math.imul(S, q);
r = r + Math.imul(g, H) | 0;
n = (n = n + Math.imul(g, V) | 0) + Math.imul(y, H) | 0;
o = o + Math.imul(y, V) | 0;
r = r + Math.imul(p, W) | 0;
n = (n = n + Math.imul(p, Y) | 0) + Math.imul(b, W) | 0;
o = o + Math.imul(b, Y) | 0;
var ve = (f + (r = r + Math.imul(l, X) | 0) | 0) + ((8191 & (n = (n = n + Math.imul(l, Z) | 0) + Math.imul(d, X) | 0)) << 13) | 0;
f = ((o = o + Math.imul(d, Z) | 0) + (n >>> 13) | 0) + (ve >>> 26) | 0;
ve &= 67108863;
r = Math.imul(I, j);
n = (n = Math.imul(I, q)) + Math.imul(x, j) | 0;
o = Math.imul(x, q);
r = r + Math.imul(w, H) | 0;
n = (n = n + Math.imul(w, V) | 0) + Math.imul(S, H) | 0;
o = o + Math.imul(S, V) | 0;
r = r + Math.imul(g, W) | 0;
n = (n = n + Math.imul(g, Y) | 0) + Math.imul(y, W) | 0;
o = o + Math.imul(y, Y) | 0;
r = r + Math.imul(p, X) | 0;
n = (n = n + Math.imul(p, Z) | 0) + Math.imul(b, X) | 0;
o = o + Math.imul(b, Z) | 0;
var we = (f + (r = r + Math.imul(l, $) | 0) | 0) + ((8191 & (n = (n = n + Math.imul(l, ee) | 0) + Math.imul(d, $) | 0)) << 13) | 0;
f = ((o = o + Math.imul(d, ee) | 0) + (n >>> 13) | 0) + (we >>> 26) | 0;
we &= 67108863;
r = Math.imul(G, j);
n = (n = Math.imul(G, q)) + Math.imul(A, j) | 0;
o = Math.imul(A, q);
r = r + Math.imul(I, H) | 0;
n = (n = n + Math.imul(I, V) | 0) + Math.imul(x, H) | 0;
o = o + Math.imul(x, V) | 0;
r = r + Math.imul(w, W) | 0;
n = (n = n + Math.imul(w, Y) | 0) + Math.imul(S, W) | 0;
o = o + Math.imul(S, Y) | 0;
r = r + Math.imul(g, X) | 0;
n = (n = n + Math.imul(g, Z) | 0) + Math.imul(y, X) | 0;
o = o + Math.imul(y, Z) | 0;
r = r + Math.imul(p, $) | 0;
n = (n = n + Math.imul(p, ee) | 0) + Math.imul(b, $) | 0;
o = o + Math.imul(b, ee) | 0;
var Se = (f + (r = r + Math.imul(l, ie) | 0) | 0) + ((8191 & (n = (n = n + Math.imul(l, re) | 0) + Math.imul(d, ie) | 0)) << 13) | 0;
f = ((o = o + Math.imul(d, re) | 0) + (n >>> 13) | 0) + (Se >>> 26) | 0;
Se &= 67108863;
r = Math.imul(T, j);
n = (n = Math.imul(T, q)) + Math.imul(E, j) | 0;
o = Math.imul(E, q);
r = r + Math.imul(G, H) | 0;
n = (n = n + Math.imul(G, V) | 0) + Math.imul(A, H) | 0;
o = o + Math.imul(A, V) | 0;
r = r + Math.imul(I, W) | 0;
n = (n = n + Math.imul(I, Y) | 0) + Math.imul(x, W) | 0;
o = o + Math.imul(x, Y) | 0;
r = r + Math.imul(w, X) | 0;
n = (n = n + Math.imul(w, Z) | 0) + Math.imul(S, X) | 0;
o = o + Math.imul(S, Z) | 0;
r = r + Math.imul(g, $) | 0;
n = (n = n + Math.imul(g, ee) | 0) + Math.imul(y, $) | 0;
o = o + Math.imul(y, ee) | 0;
r = r + Math.imul(p, ie) | 0;
n = (n = n + Math.imul(p, re) | 0) + Math.imul(b, ie) | 0;
o = o + Math.imul(b, re) | 0;
var _e = (f + (r = r + Math.imul(l, oe) | 0) | 0) + ((8191 & (n = (n = n + Math.imul(l, ae) | 0) + Math.imul(d, oe) | 0)) << 13) | 0;
f = ((o = o + Math.imul(d, ae) | 0) + (n >>> 13) | 0) + (_e >>> 26) | 0;
_e &= 67108863;
r = Math.imul(D, j);
n = (n = Math.imul(D, q)) + Math.imul(R, j) | 0;
o = Math.imul(R, q);
r = r + Math.imul(T, H) | 0;
n = (n = n + Math.imul(T, V) | 0) + Math.imul(E, H) | 0;
o = o + Math.imul(E, V) | 0;
r = r + Math.imul(G, W) | 0;
n = (n = n + Math.imul(G, Y) | 0) + Math.imul(A, W) | 0;
o = o + Math.imul(A, Y) | 0;
r = r + Math.imul(I, X) | 0;
n = (n = n + Math.imul(I, Z) | 0) + Math.imul(x, X) | 0;
o = o + Math.imul(x, Z) | 0;
r = r + Math.imul(w, $) | 0;
n = (n = n + Math.imul(w, ee) | 0) + Math.imul(S, $) | 0;
o = o + Math.imul(S, ee) | 0;
r = r + Math.imul(g, ie) | 0;
n = (n = n + Math.imul(g, re) | 0) + Math.imul(y, ie) | 0;
o = o + Math.imul(y, re) | 0;
r = r + Math.imul(p, oe) | 0;
n = (n = n + Math.imul(p, ae) | 0) + Math.imul(b, oe) | 0;
o = o + Math.imul(b, ae) | 0;
var Ie = (f + (r = r + Math.imul(l, ce) | 0) | 0) + ((8191 & (n = (n = n + Math.imul(l, fe) | 0) + Math.imul(d, ce) | 0)) << 13) | 0;
f = ((o = o + Math.imul(d, fe) | 0) + (n >>> 13) | 0) + (Ie >>> 26) | 0;
Ie &= 67108863;
r = Math.imul(B, j);
n = (n = Math.imul(B, q)) + Math.imul(P, j) | 0;
o = Math.imul(P, q);
r = r + Math.imul(D, H) | 0;
n = (n = n + Math.imul(D, V) | 0) + Math.imul(R, H) | 0;
o = o + Math.imul(R, V) | 0;
r = r + Math.imul(T, W) | 0;
n = (n = n + Math.imul(T, Y) | 0) + Math.imul(E, W) | 0;
o = o + Math.imul(E, Y) | 0;
r = r + Math.imul(G, X) | 0;
n = (n = n + Math.imul(G, Z) | 0) + Math.imul(A, X) | 0;
o = o + Math.imul(A, Z) | 0;
r = r + Math.imul(I, $) | 0;
n = (n = n + Math.imul(I, ee) | 0) + Math.imul(x, $) | 0;
o = o + Math.imul(x, ee) | 0;
r = r + Math.imul(w, ie) | 0;
n = (n = n + Math.imul(w, re) | 0) + Math.imul(S, ie) | 0;
o = o + Math.imul(S, re) | 0;
r = r + Math.imul(g, oe) | 0;
n = (n = n + Math.imul(g, ae) | 0) + Math.imul(y, oe) | 0;
o = o + Math.imul(y, ae) | 0;
r = r + Math.imul(p, ce) | 0;
n = (n = n + Math.imul(p, fe) | 0) + Math.imul(b, ce) | 0;
o = o + Math.imul(b, fe) | 0;
var xe = (f + (r = r + Math.imul(l, le) | 0) | 0) + ((8191 & (n = (n = n + Math.imul(l, de) | 0) + Math.imul(d, le) | 0)) << 13) | 0;
f = ((o = o + Math.imul(d, de) | 0) + (n >>> 13) | 0) + (xe >>> 26) | 0;
xe &= 67108863;
r = Math.imul(U, j);
n = (n = Math.imul(U, q)) + Math.imul(O, j) | 0;
o = Math.imul(O, q);
r = r + Math.imul(B, H) | 0;
n = (n = n + Math.imul(B, V) | 0) + Math.imul(P, H) | 0;
o = o + Math.imul(P, V) | 0;
r = r + Math.imul(D, W) | 0;
n = (n = n + Math.imul(D, Y) | 0) + Math.imul(R, W) | 0;
o = o + Math.imul(R, Y) | 0;
r = r + Math.imul(T, X) | 0;
n = (n = n + Math.imul(T, Z) | 0) + Math.imul(E, X) | 0;
o = o + Math.imul(E, Z) | 0;
r = r + Math.imul(G, $) | 0;
n = (n = n + Math.imul(G, ee) | 0) + Math.imul(A, $) | 0;
o = o + Math.imul(A, ee) | 0;
r = r + Math.imul(I, ie) | 0;
n = (n = n + Math.imul(I, re) | 0) + Math.imul(x, ie) | 0;
o = o + Math.imul(x, re) | 0;
r = r + Math.imul(w, oe) | 0;
n = (n = n + Math.imul(w, ae) | 0) + Math.imul(S, oe) | 0;
o = o + Math.imul(S, ae) | 0;
r = r + Math.imul(g, ce) | 0;
n = (n = n + Math.imul(g, fe) | 0) + Math.imul(y, ce) | 0;
o = o + Math.imul(y, fe) | 0;
r = r + Math.imul(p, le) | 0;
n = (n = n + Math.imul(p, de) | 0) + Math.imul(b, le) | 0;
o = o + Math.imul(b, de) | 0;
var Ce = (f + (r = r + Math.imul(l, pe) | 0) | 0) + ((8191 & (n = (n = n + Math.imul(l, be) | 0) + Math.imul(d, pe) | 0)) << 13) | 0;
f = ((o = o + Math.imul(d, be) | 0) + (n >>> 13) | 0) + (Ce >>> 26) | 0;
Ce &= 67108863;
r = Math.imul(U, H);
n = (n = Math.imul(U, V)) + Math.imul(O, H) | 0;
o = Math.imul(O, V);
r = r + Math.imul(B, W) | 0;
n = (n = n + Math.imul(B, Y) | 0) + Math.imul(P, W) | 0;
o = o + Math.imul(P, Y) | 0;
r = r + Math.imul(D, X) | 0;
n = (n = n + Math.imul(D, Z) | 0) + Math.imul(R, X) | 0;
o = o + Math.imul(R, Z) | 0;
r = r + Math.imul(T, $) | 0;
n = (n = n + Math.imul(T, ee) | 0) + Math.imul(E, $) | 0;
o = o + Math.imul(E, ee) | 0;
r = r + Math.imul(G, ie) | 0;
n = (n = n + Math.imul(G, re) | 0) + Math.imul(A, ie) | 0;
o = o + Math.imul(A, re) | 0;
r = r + Math.imul(I, oe) | 0;
n = (n = n + Math.imul(I, ae) | 0) + Math.imul(x, oe) | 0;
o = o + Math.imul(x, ae) | 0;
r = r + Math.imul(w, ce) | 0;
n = (n = n + Math.imul(w, fe) | 0) + Math.imul(S, ce) | 0;
o = o + Math.imul(S, fe) | 0;
r = r + Math.imul(g, le) | 0;
n = (n = n + Math.imul(g, de) | 0) + Math.imul(y, le) | 0;
o = o + Math.imul(y, de) | 0;
var Ge = (f + (r = r + Math.imul(p, pe) | 0) | 0) + ((8191 & (n = (n = n + Math.imul(p, be) | 0) + Math.imul(b, pe) | 0)) << 13) | 0;
f = ((o = o + Math.imul(b, be) | 0) + (n >>> 13) | 0) + (Ge >>> 26) | 0;
Ge &= 67108863;
r = Math.imul(U, W);
n = (n = Math.imul(U, Y)) + Math.imul(O, W) | 0;
o = Math.imul(O, Y);
r = r + Math.imul(B, X) | 0;
n = (n = n + Math.imul(B, Z) | 0) + Math.imul(P, X) | 0;
o = o + Math.imul(P, Z) | 0;
r = r + Math.imul(D, $) | 0;
n = (n = n + Math.imul(D, ee) | 0) + Math.imul(R, $) | 0;
o = o + Math.imul(R, ee) | 0;
r = r + Math.imul(T, ie) | 0;
n = (n = n + Math.imul(T, re) | 0) + Math.imul(E, ie) | 0;
o = o + Math.imul(E, re) | 0;
r = r + Math.imul(G, oe) | 0;
n = (n = n + Math.imul(G, ae) | 0) + Math.imul(A, oe) | 0;
o = o + Math.imul(A, ae) | 0;
r = r + Math.imul(I, ce) | 0;
n = (n = n + Math.imul(I, fe) | 0) + Math.imul(x, ce) | 0;
o = o + Math.imul(x, fe) | 0;
r = r + Math.imul(w, le) | 0;
n = (n = n + Math.imul(w, de) | 0) + Math.imul(S, le) | 0;
o = o + Math.imul(S, de) | 0;
var Ae = (f + (r = r + Math.imul(g, pe) | 0) | 0) + ((8191 & (n = (n = n + Math.imul(g, be) | 0) + Math.imul(y, pe) | 0)) << 13) | 0;
f = ((o = o + Math.imul(y, be) | 0) + (n >>> 13) | 0) + (Ae >>> 26) | 0;
Ae &= 67108863;
r = Math.imul(U, X);
n = (n = Math.imul(U, Z)) + Math.imul(O, X) | 0;
o = Math.imul(O, Z);
r = r + Math.imul(B, $) | 0;
n = (n = n + Math.imul(B, ee) | 0) + Math.imul(P, $) | 0;
o = o + Math.imul(P, ee) | 0;
r = r + Math.imul(D, ie) | 0;
n = (n = n + Math.imul(D, re) | 0) + Math.imul(R, ie) | 0;
o = o + Math.imul(R, re) | 0;
r = r + Math.imul(T, oe) | 0;
n = (n = n + Math.imul(T, ae) | 0) + Math.imul(E, oe) | 0;
o = o + Math.imul(E, ae) | 0;
r = r + Math.imul(G, ce) | 0;
n = (n = n + Math.imul(G, fe) | 0) + Math.imul(A, ce) | 0;
o = o + Math.imul(A, fe) | 0;
r = r + Math.imul(I, le) | 0;
n = (n = n + Math.imul(I, de) | 0) + Math.imul(x, le) | 0;
o = o + Math.imul(x, de) | 0;
var ke = (f + (r = r + Math.imul(w, pe) | 0) | 0) + ((8191 & (n = (n = n + Math.imul(w, be) | 0) + Math.imul(S, pe) | 0)) << 13) | 0;
f = ((o = o + Math.imul(S, be) | 0) + (n >>> 13) | 0) + (ke >>> 26) | 0;
ke &= 67108863;
r = Math.imul(U, $);
n = (n = Math.imul(U, ee)) + Math.imul(O, $) | 0;
o = Math.imul(O, ee);
r = r + Math.imul(B, ie) | 0;
n = (n = n + Math.imul(B, re) | 0) + Math.imul(P, ie) | 0;
o = o + Math.imul(P, re) | 0;
r = r + Math.imul(D, oe) | 0;
n = (n = n + Math.imul(D, ae) | 0) + Math.imul(R, oe) | 0;
o = o + Math.imul(R, ae) | 0;
r = r + Math.imul(T, ce) | 0;
n = (n = n + Math.imul(T, fe) | 0) + Math.imul(E, ce) | 0;
o = o + Math.imul(E, fe) | 0;
r = r + Math.imul(G, le) | 0;
n = (n = n + Math.imul(G, de) | 0) + Math.imul(A, le) | 0;
o = o + Math.imul(A, de) | 0;
var Te = (f + (r = r + Math.imul(I, pe) | 0) | 0) + ((8191 & (n = (n = n + Math.imul(I, be) | 0) + Math.imul(x, pe) | 0)) << 13) | 0;
f = ((o = o + Math.imul(x, be) | 0) + (n >>> 13) | 0) + (Te >>> 26) | 0;
Te &= 67108863;
r = Math.imul(U, ie);
n = (n = Math.imul(U, re)) + Math.imul(O, ie) | 0;
o = Math.imul(O, re);
r = r + Math.imul(B, oe) | 0;
n = (n = n + Math.imul(B, ae) | 0) + Math.imul(P, oe) | 0;
o = o + Math.imul(P, ae) | 0;
r = r + Math.imul(D, ce) | 0;
n = (n = n + Math.imul(D, fe) | 0) + Math.imul(R, ce) | 0;
o = o + Math.imul(R, fe) | 0;
r = r + Math.imul(T, le) | 0;
n = (n = n + Math.imul(T, de) | 0) + Math.imul(E, le) | 0;
o = o + Math.imul(E, de) | 0;
var Ee = (f + (r = r + Math.imul(G, pe) | 0) | 0) + ((8191 & (n = (n = n + Math.imul(G, be) | 0) + Math.imul(A, pe) | 0)) << 13) | 0;
f = ((o = o + Math.imul(A, be) | 0) + (n >>> 13) | 0) + (Ee >>> 26) | 0;
Ee &= 67108863;
r = Math.imul(U, oe);
n = (n = Math.imul(U, ae)) + Math.imul(O, oe) | 0;
o = Math.imul(O, ae);
r = r + Math.imul(B, ce) | 0;
n = (n = n + Math.imul(B, fe) | 0) + Math.imul(P, ce) | 0;
o = o + Math.imul(P, fe) | 0;
r = r + Math.imul(D, le) | 0;
n = (n = n + Math.imul(D, de) | 0) + Math.imul(R, le) | 0;
o = o + Math.imul(R, de) | 0;
var Me = (f + (r = r + Math.imul(T, pe) | 0) | 0) + ((8191 & (n = (n = n + Math.imul(T, be) | 0) + Math.imul(E, pe) | 0)) << 13) | 0;
f = ((o = o + Math.imul(E, be) | 0) + (n >>> 13) | 0) + (Me >>> 26) | 0;
Me &= 67108863;
r = Math.imul(U, ce);
n = (n = Math.imul(U, fe)) + Math.imul(O, ce) | 0;
o = Math.imul(O, fe);
r = r + Math.imul(B, le) | 0;
n = (n = n + Math.imul(B, de) | 0) + Math.imul(P, le) | 0;
o = o + Math.imul(P, de) | 0;
var De = (f + (r = r + Math.imul(D, pe) | 0) | 0) + ((8191 & (n = (n = n + Math.imul(D, be) | 0) + Math.imul(R, pe) | 0)) << 13) | 0;
f = ((o = o + Math.imul(R, be) | 0) + (n >>> 13) | 0) + (De >>> 26) | 0;
De &= 67108863;
r = Math.imul(U, le);
n = (n = Math.imul(U, de)) + Math.imul(O, le) | 0;
o = Math.imul(O, de);
var Re = (f + (r = r + Math.imul(B, pe) | 0) | 0) + ((8191 & (n = (n = n + Math.imul(B, be) | 0) + Math.imul(P, pe) | 0)) << 13) | 0;
f = ((o = o + Math.imul(P, be) | 0) + (n >>> 13) | 0) + (Re >>> 26) | 0;
Re &= 67108863;
var Ne = (f + (r = Math.imul(U, pe)) | 0) + ((8191 & (n = (n = Math.imul(U, be)) + Math.imul(O, pe) | 0)) << 13) | 0;
f = ((o = Math.imul(O, be)) + (n >>> 13) | 0) + (Ne >>> 26) | 0;
Ne &= 67108863;
c[0] = me;
c[1] = ge;
c[2] = ye;
c[3] = ve;
c[4] = we;
c[5] = Se;
c[6] = _e;
c[7] = Ie;
c[8] = xe;
c[9] = Ce;
c[10] = Ge;
c[11] = Ae;
c[12] = ke;
c[13] = Te;
c[14] = Ee;
c[15] = Me;
c[16] = De;
c[17] = Re;
c[18] = Ne;
if (0 !== f) {
c[19] = f;
i.length++;
}
return i;
};
Math.imul || (o = n);
function s(e, t, i) {
return new c().mulp(e, t, i);
}
g.prototype.mulTo = function(e, t) {
var i = this.length + e.length;
return 10 === this.length && 10 === e.length ? o(this, e, t) : i < 63 ? n(this, e, t) : i < 1024 ? function(e, t, i) {
i.negative = t.negative ^ e.negative;
i.length = e.length + t.length;
for (var r = 0, n = 0, o = 0; o < i.length - 1; o++) {
var a = n;
n = 0;
for (var s = 67108863 & r, c = Math.min(o, t.length - 1), f = Math.max(0, o - e.length + 1); f <= c; f++) {
var h = o - f, l = (0 | e.words[h]) * (0 | t.words[f]), d = 67108863 & l;
s = 67108863 & (d = d + s | 0);
n += (a = (a = a + (l / 67108864 | 0) | 0) + (d >>> 26) | 0) >>> 26;
a &= 67108863;
}
i.words[o] = s;
r = a;
a = n;
}
0 !== r ? i.words[o] = r : i.length--;
return i.strip();
}(this, e, t) : s(this, e, t);
};
function c(e, t) {
this.x = e;
this.y = t;
}
c.prototype.makeRBT = function(e) {
for (var t = new Array(e), i = g.prototype._countBits(e) - 1, r = 0; r < e; r++) t[r] = this.revBin(r, i, e);
return t;
};
c.prototype.revBin = function(e, t, i) {
if (0 === e || e === i - 1) return e;
for (var r = 0, n = 0; n < t; n++) {
r |= (1 & e) << t - n - 1;
e >>= 1;
}
return r;
};
c.prototype.permute = function(e, t, i, r, n, o) {
for (var a = 0; a < o; a++) {
r[a] = t[e[a]];
n[a] = i[e[a]];
}
};
c.prototype.transform = function(e, t, i, r, n, o) {
this.permute(o, e, t, i, r, n);
for (var a = 1; a < n; a <<= 1) for (var s = a << 1, c = Math.cos(2 * Math.PI / s), f = Math.sin(2 * Math.PI / s), h = 0; h < n; h += s) for (var l = c, d = f, u = 0; u < a; u++) {
var p = i[h + u], b = r[h + u], m = i[h + u + a], g = r[h + u + a], y = l * m - d * g;
g = l * g + d * m;
m = y;
i[h + u] = p + m;
r[h + u] = b + g;
i[h + u + a] = p - m;
r[h + u + a] = b - g;
if (u !== s) {
y = c * l - f * d;
d = c * d + f * l;
l = y;
}
}
};
c.prototype.guessLen13b = function(e, t) {
var i = 1 | Math.max(t, e), r = 1 & i, n = 0;
for (i = i / 2 | 0; i; i >>>= 1) n++;
return 1 << n + 1 + r;
};
c.prototype.conjugate = function(e, t, i) {
if (!(i <= 1)) for (var r = 0; r < i / 2; r++) {
var n = e[r];
e[r] = e[i - r - 1];
e[i - r - 1] = n;
n = t[r];
t[r] = -t[i - r - 1];
t[i - r - 1] = -n;
}
};
c.prototype.normalize13b = function(e, t) {
for (var i = 0, r = 0; r < t / 2; r++) {
var n = 8192 * Math.round(e[2 * r + 1] / t) + Math.round(e[2 * r] / t) + i;
e[r] = 67108863 & n;
i = n < 67108864 ? 0 : n / 67108864 | 0;
}
return e;
};
c.prototype.convert13b = function(e, t, i, r) {
for (var n = 0, o = 0; o < t; o++) {
n += 0 | e[o];
i[2 * o] = 8191 & n;
n >>>= 13;
i[2 * o + 1] = 8191 & n;
n >>>= 13;
}
for (o = 2 * t; o < r; ++o) i[o] = 0;
m(0 === n);
m(0 == (-8192 & n));
};
c.prototype.stub = function(e) {
for (var t = new Array(e), i = 0; i < e; i++) t[i] = 0;
return t;
};
c.prototype.mulp = function(e, t, i) {
var r = 2 * this.guessLen13b(e.length, t.length), n = this.makeRBT(r), o = this.stub(r), a = new Array(r), s = new Array(r), c = new Array(r), f = new Array(r), h = new Array(r), l = new Array(r), d = i.words;
d.length = r;
this.convert13b(e.words, e.length, a, r);
this.convert13b(t.words, t.length, f, r);
this.transform(a, o, s, c, r, n);
this.transform(f, o, h, l, r, n);
for (var u = 0; u < r; u++) {
var p = s[u] * h[u] - c[u] * l[u];
c[u] = s[u] * l[u] + c[u] * h[u];
s[u] = p;
}
this.conjugate(s, c, r);
this.transform(s, c, d, o, r, n);
this.conjugate(d, o, r);
this.normalize13b(d, r);
i.negative = e.negative ^ t.negative;
i.length = e.length + t.length;
return i.strip();
};
g.prototype.mul = function(e) {
var t = new g(null);
t.words = new Array(this.length + e.length);
return this.mulTo(e, t);
};
g.prototype.mulf = function(e) {
var t = new g(null);
t.words = new Array(this.length + e.length);
return s(this, e, t);
};
g.prototype.imul = function(e) {
return this.clone().mulTo(e, this);
};
g.prototype.imuln = function(e) {
m("number" == typeof e);
m(e < 67108864);
for (var t = 0, i = 0; i < this.length; i++) {
var r = (0 | this.words[i]) * e, n = (67108863 & r) + (67108863 & t);
t >>= 26;
t += r / 67108864 | 0;
t += n >>> 26;
this.words[i] = 67108863 & n;
}
if (0 !== t) {
this.words[i] = t;
this.length++;
}
return this;
};
g.prototype.muln = function(e) {
return this.clone().imuln(e);
};
g.prototype.sqr = function() {
return this.mul(this);
};
g.prototype.isqr = function() {
return this.imul(this.clone());
};
g.prototype.pow = function(e) {
var t = function(e) {
for (var t = new Array(e.bitLength()), i = 0; i < t.length; i++) {
var r = i / 26 | 0, n = i % 26;
t[i] = (e.words[r] & 1 << n) >>> n;
}
return t;
}(e);
if (0 === t.length) return new g(1);
for (var i = this, r = 0; r < t.length && 0 === t[r]; r++, i = i.sqr()) ;
if (++r < t.length) for (var n = i.sqr(); r < t.length; r++, n = n.sqr()) 0 !== t[r] && (i = i.mul(n));
return i;
};
g.prototype.iushln = function(e) {
m("number" == typeof e && 0 <= e);
var t, i = e % 26, r = (e - i) / 26, n = 67108863 >>> 26 - i << 26 - i;
if (0 !== i) {
var o = 0;
for (t = 0; t < this.length; t++) {
var a = this.words[t] & n, s = (0 | this.words[t]) - a << i;
this.words[t] = s | o;
o = a >>> 26 - i;
}
if (o) {
this.words[t] = o;
this.length++;
}
}
if (0 !== r) {
for (t = this.length - 1; 0 <= t; t--) this.words[t + r] = this.words[t];
for (t = 0; t < r; t++) this.words[t] = 0;
this.length += r;
}
return this.strip();
};
g.prototype.ishln = function(e) {
m(0 === this.negative);
return this.iushln(e);
};
g.prototype.iushrn = function(e, t, i) {
m("number" == typeof e && 0 <= e);
var r;
r = t ? (t - t % 26) / 26 : 0;
var n = e % 26, o = Math.min((e - n) / 26, this.length), a = 67108863 ^ 67108863 >>> n << n, s = i;
r -= o;
r = Math.max(0, r);
if (s) {
for (var c = 0; c < o; c++) s.words[c] = this.words[c];
s.length = o;
}
if (0 === o) ; else if (this.length > o) {
this.length -= o;
for (c = 0; c < this.length; c++) this.words[c] = this.words[c + o];
} else {
this.words[0] = 0;
this.length = 1;
}
var f = 0;
for (c = this.length - 1; 0 <= c && (0 !== f || r <= c); c--) {
var h = 0 | this.words[c];
this.words[c] = f << 26 - n | h >>> n;
f = h & a;
}
s && 0 !== f && (s.words[s.length++] = f);
if (0 === this.length) {
this.words[0] = 0;
this.length = 1;
}
return this.strip();
};
g.prototype.ishrn = function(e, t, i) {
m(0 === this.negative);
return this.iushrn(e, t, i);
};
g.prototype.shln = function(e) {
return this.clone().ishln(e);
};
g.prototype.ushln = function(e) {
return this.clone().iushln(e);
};
g.prototype.shrn = function(e) {
return this.clone().ishrn(e);
};
g.prototype.ushrn = function(e) {
return this.clone().iushrn(e);
};
g.prototype.testn = function(e) {
m("number" == typeof e && 0 <= e);
var t = e % 26, i = (e - t) / 26, r = 1 << t;
return !(this.length <= i) && !!(this.words[i] & r);
};
g.prototype.imaskn = function(e) {
m("number" == typeof e && 0 <= e);
var t = e % 26, i = (e - t) / 26;
m(0 === this.negative, "imaskn works only with positive numbers");
if (this.length <= i) return this;
0 !== t && i++;
this.length = Math.min(i, this.length);
if (0 !== t) {
var r = 67108863 ^ 67108863 >>> t << t;
this.words[this.length - 1] &= r;
}
return this.strip();
};
g.prototype.maskn = function(e) {
return this.clone().imaskn(e);
};
g.prototype.iaddn = function(e) {
m("number" == typeof e);
m(e < 67108864);
if (e < 0) return this.isubn(-e);
if (0 !== this.negative) {
if (1 === this.length && (0 | this.words[0]) < e) {
this.words[0] = e - (0 | this.words[0]);
this.negative = 0;
return this;
}
this.negative = 0;
this.isubn(e);
this.negative = 1;
return this;
}
return this._iaddn(e);
};
g.prototype._iaddn = function(e) {
this.words[0] += e;
for (var t = 0; t < this.length && 67108864 <= this.words[t]; t++) {
this.words[t] -= 67108864;
t === this.length - 1 ? this.words[t + 1] = 1 : this.words[t + 1]++;
}
this.length = Math.max(this.length, t + 1);
return this;
};
g.prototype.isubn = function(e) {
m("number" == typeof e);
m(e < 67108864);
if (e < 0) return this.iaddn(-e);
if (0 !== this.negative) {
this.negative = 0;
this.iaddn(e);
this.negative = 1;
return this;
}
this.words[0] -= e;
if (1 === this.length && this.words[0] < 0) {
this.words[0] = -this.words[0];
this.negative = 1;
} else for (var t = 0; t < this.length && this.words[t] < 0; t++) {
this.words[t] += 67108864;
this.words[t + 1] -= 1;
}
return this.strip();
};
g.prototype.addn = function(e) {
return this.clone().iaddn(e);
};
g.prototype.subn = function(e) {
return this.clone().isubn(e);
};
g.prototype.iabs = function() {
this.negative = 0;
return this;
};
g.prototype.abs = function() {
return this.clone().iabs();
};
g.prototype._ishlnsubmul = function(e, t, i) {
var r, n, o = e.length + i;
this._expand(o);
var a = 0;
for (r = 0; r < e.length; r++) {
n = (0 | this.words[r + i]) + a;
var s = (0 | e.words[r]) * t;
a = ((n -= 67108863 & s) >> 26) - (s / 67108864 | 0);
this.words[r + i] = 67108863 & n;
}
for (;r < this.length - i; r++) {
a = (n = (0 | this.words[r + i]) + a) >> 26;
this.words[r + i] = 67108863 & n;
}
if (0 === a) return this.strip();
m(-1 === a);
for (r = a = 0; r < this.length; r++) {
a = (n = -(0 | this.words[r]) + a) >> 26;
this.words[r] = 67108863 & n;
}
this.negative = 1;
return this.strip();
};
g.prototype._wordDiv = function(e, t) {
var i = (this.length, e.length), r = this.clone(), n = e, o = 0 | n.words[n.length - 1];
if (0 !== (i = 26 - this._countBits(o))) {
n = n.ushln(i);
r.iushln(i);
o = 0 | n.words[n.length - 1];
}
var a, s = r.length - n.length;
if ("mod" !== t) {
(a = new g(null)).length = s + 1;
a.words = new Array(a.length);
for (var c = 0; c < a.length; c++) a.words[c] = 0;
}
var f = r.clone()._ishlnsubmul(n, 1, s);
if (0 === f.negative) {
r = f;
a && (a.words[s] = 1);
}
for (var h = s - 1; 0 <= h; h--) {
var l = 67108864 * (0 | r.words[n.length + h]) + (0 | r.words[n.length + h - 1]);
l = Math.min(l / o | 0, 67108863);
r._ishlnsubmul(n, l, h);
for (;0 !== r.negative; ) {
l--;
r.negative = 0;
r._ishlnsubmul(n, 1, h);
r.isZero() || (r.negative ^= 1);
}
a && (a.words[h] = l);
}
a && a.strip();
r.strip();
"div" !== t && 0 !== i && r.iushrn(i);
return {
div: a || null,
mod: r
};
};
g.prototype.divmod = function(e, t, i) {
m(!e.isZero());
if (this.isZero()) return {
div: new g(0),
mod: new g(0)
};
var r, n, o;
if (0 !== this.negative && 0 === e.negative) {
o = this.neg().divmod(e, t);
"mod" !== t && (r = o.div.neg());
if ("div" !== t) {
n = o.mod.neg();
i && 0 !== n.negative && n.iadd(e);
}
return {
div: r,
mod: n
};
}
if (0 === this.negative && 0 !== e.negative) {
o = this.divmod(e.neg(), t);
"mod" !== t && (r = o.div.neg());
return {
div: r,
mod: o.mod
};
}
if (0 != (this.negative & e.negative)) {
o = this.neg().divmod(e.neg(), t);
if ("div" !== t) {
n = o.mod.neg();
i && 0 !== n.negative && n.isub(e);
}
return {
div: o.div,
mod: n
};
}
return e.length > this.length || this.cmp(e) < 0 ? {
div: new g(0),
mod: this
} : 1 === e.length ? "div" === t ? {
div: this.divn(e.words[0]),
mod: null
} : "mod" === t ? {
div: null,
mod: new g(this.modn(e.words[0]))
} : {
div: this.divn(e.words[0]),
mod: new g(this.modn(e.words[0]))
} : this._wordDiv(e, t);
};
g.prototype.div = function(e) {
return this.divmod(e, "div", !1).div;
};
g.prototype.mod = function(e) {
return this.divmod(e, "mod", !1).mod;
};
g.prototype.umod = function(e) {
return this.divmod(e, "mod", !0).mod;
};
g.prototype.divRound = function(e) {
var t = this.divmod(e);
if (t.mod.isZero()) return t.div;
var i = 0 !== t.div.negative ? t.mod.isub(e) : t.mod, r = e.ushrn(1), n = e.andln(1), o = i.cmp(r);
return o < 0 || 1 === n && 0 === o ? t.div : 0 !== t.div.negative ? t.div.isubn(1) : t.div.iaddn(1);
};
g.prototype.modn = function(e) {
m(e <= 67108863);
for (var t = (1 << 26) % e, i = 0, r = this.length - 1; 0 <= r; r--) i = (t * i + (0 | this.words[r])) % e;
return i;
};
g.prototype.idivn = function(e) {
m(e <= 67108863);
for (var t = 0, i = this.length - 1; 0 <= i; i--) {
var r = (0 | this.words[i]) + 67108864 * t;
this.words[i] = r / e | 0;
t = r % e;
}
return this.strip();
};
g.prototype.divn = function(e) {
return this.clone().idivn(e);
};
g.prototype.egcd = function(e) {
m(0 === e.negative);
m(!e.isZero());
var t = this, i = e.clone();
t = 0 !== t.negative ? t.umod(e) : t.clone();
for (var r = new g(1), n = new g(0), o = new g(0), a = new g(1), s = 0; t.isEven() && i.isEven(); ) {
t.iushrn(1);
i.iushrn(1);
++s;
}
for (var c = i.clone(), f = t.clone(); !t.isZero(); ) {
for (var h = 0, l = 1; 0 == (t.words[0] & l) && h < 26; ++h, l <<= 1) ;
if (0 < h) {
t.iushrn(h);
for (;0 < h--; ) {
if (r.isOdd() || n.isOdd()) {
r.iadd(c);
n.isub(f);
}
r.iushrn(1);
n.iushrn(1);
}
}
for (var d = 0, u = 1; 0 == (i.words[0] & u) && d < 26; ++d, u <<= 1) ;
if (0 < d) {
i.iushrn(d);
for (;0 < d--; ) {
if (o.isOdd() || a.isOdd()) {
o.iadd(c);
a.isub(f);
}
o.iushrn(1);
a.iushrn(1);
}
}
if (0 <= t.cmp(i)) {
t.isub(i);
r.isub(o);
n.isub(a);
} else {
i.isub(t);
o.isub(r);
a.isub(n);
}
}
return {
a: o,
b: a,
gcd: i.iushln(s)
};
};
g.prototype._invmp = function(e) {
m(0 === e.negative);
m(!e.isZero());
var t = this, i = e.clone();
t = 0 !== t.negative ? t.umod(e) : t.clone();
for (var r, n = new g(1), o = new g(0), a = i.clone(); 0 < t.cmpn(1) && 0 < i.cmpn(1); ) {
for (var s = 0, c = 1; 0 == (t.words[0] & c) && s < 26; ++s, c <<= 1) ;
if (0 < s) {
t.iushrn(s);
for (;0 < s--; ) {
n.isOdd() && n.iadd(a);
n.iushrn(1);
}
}
for (var f = 0, h = 1; 0 == (i.words[0] & h) && f < 26; ++f, h <<= 1) ;
if (0 < f) {
i.iushrn(f);
for (;0 < f--; ) {
o.isOdd() && o.iadd(a);
o.iushrn(1);
}
}
if (0 <= t.cmp(i)) {
t.isub(i);
n.isub(o);
} else {
i.isub(t);
o.isub(n);
}
}
(r = 0 === t.cmpn(1) ? n : o).cmpn(0) < 0 && r.iadd(e);
return r;
};
g.prototype.gcd = function(e) {
if (this.isZero()) return e.abs();
if (e.isZero()) return this.abs();
var t = this.clone(), i = e.clone();
t.negative = 0;
for (var r = i.negative = 0; t.isEven() && i.isEven(); r++) {
t.iushrn(1);
i.iushrn(1);
}
for (;;) {
for (;t.isEven(); ) t.iushrn(1);
for (;i.isEven(); ) i.iushrn(1);
var n = t.cmp(i);
if (n < 0) {
var o = t;
t = i;
i = o;
} else if (0 === n || 0 === i.cmpn(1)) break;
t.isub(i);
}
return i.iushln(r);
};
g.prototype.invm = function(e) {
return this.egcd(e).a.umod(e);
};
g.prototype.isEven = function() {
return 0 == (1 & this.words[0]);
};
g.prototype.isOdd = function() {
return 1 == (1 & this.words[0]);
};
g.prototype.andln = function(e) {
return this.words[0] & e;
};
g.prototype.bincn = function(e) {
m("number" == typeof e);
var t = e % 26, i = (e - t) / 26, r = 1 << t;
if (this.length <= i) {
this._expand(i + 1);
this.words[i] |= r;
return this;
}
for (var n = r, o = i; 0 !== n && o < this.length; o++) {
var a = 0 | this.words[o];
n = (a += n) >>> 26;
a &= 67108863;
this.words[o] = a;
}
if (0 !== n) {
this.words[o] = n;
this.length++;
}
return this;
};
g.prototype.isZero = function() {
return 1 === this.length && 0 === this.words[0];
};
g.prototype.cmpn = function(e) {
var t, i = e < 0;
if (0 !== this.negative && !i) return -1;
if (0 === this.negative && i) return 1;
this.strip();
if (1 < this.length) t = 1; else {
i && (e = -e);
m(e <= 67108863, "Number is too big");
var r = 0 | this.words[0];
t = r === e ? 0 : r < e ? -1 : 1;
}
return 0 !== this.negative ? 0 | -t : t;
};
g.prototype.cmp = function(e) {
if (0 !== this.negative && 0 === e.negative) return -1;
if (0 === this.negative && 0 !== e.negative) return 1;
var t = this.ucmp(e);
return 0 !== this.negative ? 0 | -t : t;
};
g.prototype.ucmp = function(e) {
if (this.length > e.length) return 1;
if (this.length < e.length) return -1;
for (var t = 0, i = this.length - 1; 0 <= i; i--) {
var r = 0 | this.words[i], n = 0 | e.words[i];
if (r !== n) {
r < n ? t = -1 : n < r && (t = 1);
break;
}
}
return t;
};
g.prototype.gtn = function(e) {
return 1 === this.cmpn(e);
};
g.prototype.gt = function(e) {
return 1 === this.cmp(e);
};
g.prototype.gten = function(e) {
return 0 <= this.cmpn(e);
};
g.prototype.gte = function(e) {
return 0 <= this.cmp(e);
};
g.prototype.ltn = function(e) {
return -1 === this.cmpn(e);
};
g.prototype.lt = function(e) {
return -1 === this.cmp(e);
};
g.prototype.lten = function(e) {
return this.cmpn(e) <= 0;
};
g.prototype.lte = function(e) {
return this.cmp(e) <= 0;
};
g.prototype.eqn = function(e) {
return 0 === this.cmpn(e);
};
g.prototype.eq = function(e) {
return 0 === this.cmp(e);
};
g.red = function(e) {
return new S(e);
};
g.prototype.toRed = function(e) {
m(!this.red, "Already a number in reduction context");
m(0 === this.negative, "red works only with positives");
return e.convertTo(this)._forceRed(e);
};
g.prototype.fromRed = function() {
m(this.red, "fromRed works only with numbers in reduction context");
return this.red.convertFrom(this);
};
g.prototype._forceRed = function(e) {
this.red = e;
return this;
};
g.prototype.forceRed = function(e) {
m(!this.red, "Already a number in reduction context");
return this._forceRed(e);
};
g.prototype.redAdd = function(e) {
m(this.red, "redAdd works only with red numbers");
return this.red.add(this, e);
};
g.prototype.redIAdd = function(e) {
m(this.red, "redIAdd works only with red numbers");
return this.red.iadd(this, e);
};
g.prototype.redSub = function(e) {
m(this.red, "redSub works only with red numbers");
return this.red.sub(this, e);
};
g.prototype.redISub = function(e) {
m(this.red, "redISub works only with red numbers");
return this.red.isub(this, e);
};
g.prototype.redShl = function(e) {
m(this.red, "redShl works only with red numbers");
return this.red.shl(this, e);
};
g.prototype.redMul = function(e) {
m(this.red, "redMul works only with red numbers");
this.red._verify2(this, e);
return this.red.mul(this, e);
};
g.prototype.redIMul = function(e) {
m(this.red, "redMul works only with red numbers");
this.red._verify2(this, e);
return this.red.imul(this, e);
};
g.prototype.redSqr = function() {
m(this.red, "redSqr works only with red numbers");
this.red._verify1(this);
return this.red.sqr(this);
};
g.prototype.redISqr = function() {
m(this.red, "redISqr works only with red numbers");
this.red._verify1(this);
return this.red.isqr(this);
};
g.prototype.redSqrt = function() {
m(this.red, "redSqrt works only with red numbers");
this.red._verify1(this);
return this.red.sqrt(this);
};
g.prototype.redInvm = function() {
m(this.red, "redInvm works only with red numbers");
this.red._verify1(this);
return this.red.invm(this);
};
g.prototype.redNeg = function() {
m(this.red, "redNeg works only with red numbers");
this.red._verify1(this);
return this.red.neg(this);
};
g.prototype.redPow = function(e) {
m(this.red && !e.red, "redPow(normalNum)");
this.red._verify1(this);
return this.red.pow(this, e);
};
var f = {
k256: null,
p224: null,
p192: null,
p25519: null
};
function h(e, t) {
this.name = e;
this.p = new g(t, 16);
this.n = this.p.bitLength();
this.k = new g(1).iushln(this.n).isub(this.p);
this.tmp = this._tmp();
}
h.prototype._tmp = function() {
var e = new g(null);
e.words = new Array(Math.ceil(this.n / 13));
return e;
};
h.prototype.ireduce = function(e) {
var t, i = e;
do {
this.split(i, this.tmp);
t = (i = (i = this.imulK(i)).iadd(this.tmp)).bitLength();
} while (t > this.n);
var r = t < this.n ? -1 : i.ucmp(this.p);
if (0 === r) {
i.words[0] = 0;
i.length = 1;
} else 0 < r ? i.isub(this.p) : i.strip();
return i;
};
h.prototype.split = function(e, t) {
e.iushrn(this.n, 0, t);
};
h.prototype.imulK = function(e) {
return e.imul(this.k);
};
function b() {
h.call(this, "k256", "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe fffffc2f");
}
i(b, h);
b.prototype.split = function(e, t) {
for (var i = Math.min(e.length, 9), r = 0; r < i; r++) t.words[r] = e.words[r];
t.length = i;
if (e.length <= 9) {
e.words[0] = 0;
e.length = 1;
} else {
var n = e.words[9];
t.words[t.length++] = 4194303 & n;
for (r = 10; r < e.length; r++) {
var o = 0 | e.words[r];
e.words[r - 10] = (4194303 & o) << 4 | n >>> 22;
n = o;
}
n >>>= 22;
0 === (e.words[r - 10] = n) && 10 < e.length ? e.length -= 10 : e.length -= 9;
}
};
b.prototype.imulK = function(e) {
e.words[e.length] = 0;
e.words[e.length + 1] = 0;
e.length += 2;
for (var t = 0, i = 0; i < e.length; i++) {
var r = 0 | e.words[i];
t += 977 * r;
e.words[i] = 67108863 & t;
t = 64 * r + (t / 67108864 | 0);
}
if (0 === e.words[e.length - 1]) {
e.length--;
0 === e.words[e.length - 1] && e.length--;
}
return e;
};
function y() {
h.call(this, "p224", "ffffffff ffffffff ffffffff ffffffff 00000000 00000000 00000001");
}
i(y, h);
function v() {
h.call(this, "p192", "ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff");
}
i(v, h);
function w() {
h.call(this, "25519", "7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed");
}
i(w, h);
w.prototype.imulK = function(e) {
for (var t = 0, i = 0; i < e.length; i++) {
var r = 19 * (0 | e.words[i]) + t, n = 67108863 & r;
r >>>= 26;
e.words[i] = n;
t = r;
}
0 !== t && (e.words[e.length++] = t);
return e;
};
g._prime = function(e) {
if (f[e]) return f[e];
var t;
if ("k256" === e) t = new b(); else if ("p224" === e) t = new y(); else if ("p192" === e) t = new v(); else {
if ("p25519" !== e) throw new Error("Unknown prime " + e);
t = new w();
}
return f[e] = t;
};
function S(e) {
if ("string" == typeof e) {
var t = g._prime(e);
this.m = t.p;
this.prime = t;
} else {
m(e.gtn(1), "modulus must be greater than 1");
this.m = e;
this.prime = null;
}
}
S.prototype._verify1 = function(e) {
m(0 === e.negative, "red works only with positives");
m(e.red, "red works only with red numbers");
};
S.prototype._verify2 = function(e, t) {
m(0 == (e.negative | t.negative), "red works only with positives");
m(e.red && e.red === t.red, "red works only with red numbers");
};
S.prototype.imod = function(e) {
return this.prime ? this.prime.ireduce(e)._forceRed(this) : e.umod(this.m)._forceRed(this);
};
S.prototype.neg = function(e) {
return e.isZero() ? e.clone() : this.m.sub(e)._forceRed(this);
};
S.prototype.add = function(e, t) {
this._verify2(e, t);
var i = e.add(t);
0 <= i.cmp(this.m) && i.isub(this.m);
return i._forceRed(this);
};
S.prototype.iadd = function(e, t) {
this._verify2(e, t);
var i = e.iadd(t);
0 <= i.cmp(this.m) && i.isub(this.m);
return i;
};
S.prototype.sub = function(e, t) {
this._verify2(e, t);
var i = e.sub(t);
i.cmpn(0) < 0 && i.iadd(this.m);
return i._forceRed(this);
};
S.prototype.isub = function(e, t) {
this._verify2(e, t);
var i = e.isub(t);
i.cmpn(0) < 0 && i.iadd(this.m);
return i;
};
S.prototype.shl = function(e, t) {
this._verify1(e);
return this.imod(e.ushln(t));
};
S.prototype.imul = function(e, t) {
this._verify2(e, t);
return this.imod(e.imul(t));
};
S.prototype.mul = function(e, t) {
this._verify2(e, t);
return this.imod(e.mul(t));
};
S.prototype.isqr = function(e) {
return this.imul(e, e.clone());
};
S.prototype.sqr = function(e) {
return this.mul(e, e);
};
S.prototype.sqrt = function(e) {
if (e.isZero()) return e.clone();
var t = this.m.andln(3);
m(t % 2 == 1);
if (3 === t) {
var i = this.m.add(new g(1)).iushrn(2);
return this.pow(e, i);
}
for (var r = this.m.subn(1), n = 0; !r.isZero() && 0 === r.andln(1); ) {
n++;
r.iushrn(1);
}
m(!r.isZero());
var o = new g(1).toRed(this), a = o.redNeg(), s = this.m.subn(1).iushrn(1), c = this.m.bitLength();
c = new g(2 * c * c).toRed(this);
for (;0 !== this.pow(c, s).cmp(a); ) c.redIAdd(a);
for (var f = this.pow(c, r), h = this.pow(e, r.addn(1).iushrn(1)), l = this.pow(e, r), d = n; 0 !== l.cmp(o); ) {
for (var u = l, p = 0; 0 !== u.cmp(o); p++) u = u.redSqr();
m(p < d);
var b = this.pow(f, new g(1).iushln(d - p - 1));
h = h.redMul(b);
f = b.redSqr();
l = l.redMul(f);
d = p;
}
return h;
};
S.prototype.invm = function(e) {
var t = e._invmp(this.m);
if (0 !== t.negative) {
t.negative = 0;
return this.imod(t).redNeg();
}
return this.imod(t);
};
S.prototype.pow = function(e, t) {
if (t.isZero()) return new g(1).toRed(this);
if (0 === t.cmpn(1)) return e.clone();
var i = new Array(16);
i[0] = new g(1).toRed(this);
i[1] = e;
for (var r = 2; r < i.length; r++) i[r] = this.mul(i[r - 1], e);
var n = i[0], o = 0, a = 0, s = t.bitLength() % 26;
0 === s && (s = 26);
for (r = t.length - 1; 0 <= r; r--) {
for (var c = t.words[r], f = s - 1; 0 <= f; f--) {
var h = c >> f & 1;
n !== i[0] && (n = this.sqr(n));
if (0 !== h || 0 !== o) {
o <<= 1;
o |= h;
if (4 === ++a || 0 === r && 0 === f) {
n = this.mul(n, i[o]);
o = a = 0;
}
} else a = 0;
}
s = 26;
}
return n;
};
S.prototype.convertTo = function(e) {
var t = e.umod(this.m);
return t === e ? t.clone() : t;
};
S.prototype.convertFrom = function(e) {
var t = e.clone();
t.red = null;
return t;
};
g.mont = function(e) {
return new _(e);
};
function _(e) {
S.call(this, e);
this.shift = this.m.bitLength();
this.shift % 26 != 0 && (this.shift += 26 - this.shift % 26);
this.r = new g(1).iushln(this.shift);
this.r2 = this.imod(this.r.sqr());
this.rinv = this.r._invmp(this.m);
this.minv = this.rinv.mul(this.r).isubn(1).div(this.m);
this.minv = this.minv.umod(this.r);
this.minv = this.r.sub(this.minv);
}
i(_, S);
_.prototype.convertTo = function(e) {
return this.imod(e.ushln(this.shift));
};
_.prototype.convertFrom = function(e) {
var t = this.imod(e.mul(this.rinv));
t.red = null;
return t;
};
_.prototype.imul = function(e, t) {
if (e.isZero() || t.isZero()) {
e.words[0] = 0;
e.length = 1;
return e;
}
var i = e.imul(t), r = i.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m), n = i.isub(r).iushrn(this.shift), o = n;
0 <= n.cmp(this.m) ? o = n.isub(this.m) : n.cmpn(0) < 0 && (o = n.iadd(this.m));
return o._forceRed(this);
};
_.prototype.mul = function(e, t) {
if (e.isZero() || t.isZero()) return new g(0)._forceRed(this);
var i = e.mul(t), r = i.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m), n = i.isub(r).iushrn(this.shift), o = n;
0 <= n.cmp(this.m) ? o = n.isub(this.m) : n.cmpn(0) < 0 && (o = n.iadd(this.m));
return o._forceRed(this);
};
_.prototype.invm = function(e) {
return this.imod(e._invmp(this.m).mul(this.r2))._forceRed(this);
};
})("undefined" == typeof e || e, this);
}, {
buffer: 18
} ],
17: [ function(e, t, i) {
var r;
t.exports = function(e) {
r || (r = new n(null));
return r.generate(e);
};
function n(e) {
this.rand = e;
}
(t.exports.Rand = n).prototype.generate = function(e) {
return this._rand(e);
};
n.prototype._rand = function(e) {
if (this.rand.getBytes) return this.rand.getBytes(e);
for (var t = new Uint8Array(e), i = 0; i < t.length; i++) t[i] = this.rand.getByte();
return t;
};
if ("object" == typeof self) self.crypto && self.crypto.getRandomValues ? n.prototype._rand = function(e) {
var t = new Uint8Array(e);
self.crypto.getRandomValues(t);
return t;
} : self.msCrypto && self.msCrypto.getRandomValues ? n.prototype._rand = function(e) {
var t = new Uint8Array(e);
self.msCrypto.getRandomValues(t);
return t;
} : "object" == typeof window && (n.prototype._rand = function() {
throw new Error("Not implemented yet");
}); else try {
var o = e("crypto");
if ("function" != typeof o.randomBytes) throw new Error("Not supported");
n.prototype._rand = function(e) {
return o.randomBytes(e);
};
} catch (e) {}
}, {
crypto: 18
} ],
18: [ function(e, t, i) {}, {} ],
19: [ function(e, t, i) {
var n = e("safe-buffer").Buffer;
function o(e) {
n.isBuffer(e) || (e = n.from(e));
for (var t = e.length / 4 | 0, i = new Array(t), r = 0; r < t; r++) i[r] = e.readUInt32BE(4 * r);
return i;
}
function r(e) {
for (;0 < e.length; e++) e[0] = 0;
}
function a(e, t, i, r, n) {
for (var o, a, s, c, f = i[0], h = i[1], l = i[2], d = i[3], u = e[0] ^ t[0], p = e[1] ^ t[1], b = e[2] ^ t[2], m = e[3] ^ t[3], g = 4, y = 1; y < n; y++) {
o = f[u >>> 24] ^ h[p >>> 16 & 255] ^ l[b >>> 8 & 255] ^ d[255 & m] ^ t[g++];
a = f[p >>> 24] ^ h[b >>> 16 & 255] ^ l[m >>> 8 & 255] ^ d[255 & u] ^ t[g++];
s = f[b >>> 24] ^ h[m >>> 16 & 255] ^ l[u >>> 8 & 255] ^ d[255 & p] ^ t[g++];
c = f[m >>> 24] ^ h[u >>> 16 & 255] ^ l[p >>> 8 & 255] ^ d[255 & b] ^ t[g++];
u = o;
p = a;
b = s;
m = c;
}
o = (r[u >>> 24] << 24 | r[p >>> 16 & 255] << 16 | r[b >>> 8 & 255] << 8 | r[255 & m]) ^ t[g++];
a = (r[p >>> 24] << 24 | r[b >>> 16 & 255] << 16 | r[m >>> 8 & 255] << 8 | r[255 & u]) ^ t[g++];
s = (r[b >>> 24] << 24 | r[m >>> 16 & 255] << 16 | r[u >>> 8 & 255] << 8 | r[255 & p]) ^ t[g++];
c = (r[m >>> 24] << 24 | r[u >>> 16 & 255] << 16 | r[p >>> 8 & 255] << 8 | r[255 & b]) ^ t[g++];
return [ o >>>= 0, a >>>= 0, s >>>= 0, c >>>= 0 ];
}
var l = [ 0, 1, 2, 4, 8, 16, 32, 64, 128, 27, 54 ], d = function() {
for (var e = new Array(256), t = 0; t < 256; t++) e[t] = t < 128 ? t << 1 : t << 1 ^ 283;
for (var i = [], r = [], n = [ [], [], [], [] ], o = [ [], [], [], [] ], a = 0, s = 0, c = 0; c < 256; ++c) {
var f = s ^ s << 1 ^ s << 2 ^ s << 3 ^ s << 4;
f = f >>> 8 ^ 255 & f ^ 99;
var h = e[r[i[a] = f] = a], l = e[h], d = e[l], u = 257 * e[f] ^ 16843008 * f;
n[0][a] = u << 24 | u >>> 8;
n[1][a] = u << 16 | u >>> 16;
n[2][a] = u << 8 | u >>> 24;
n[3][a] = u;
u = 16843009 * d ^ 65537 * l ^ 257 * h ^ 16843008 * a;
o[0][f] = u << 24 | u >>> 8;
o[1][f] = u << 16 | u >>> 16;
o[2][f] = u << 8 | u >>> 24;
o[3][f] = u;
if (0 === a) a = s = 1; else {
a = h ^ e[e[e[d ^ h]]];
s ^= e[e[s]];
}
}
return {
SBOX: i,
INV_SBOX: r,
SUB_MIX: n,
INV_SUB_MIX: o
};
}();
function s(e) {
this._key = o(e);
this._reset();
}
s.blockSize = 16;
s.keySize = 32;
s.prototype.blockSize = s.blockSize;
s.prototype.keySize = s.keySize;
s.prototype._reset = function() {
for (var e = this._key, t = e.length, i = t + 6, r = 4 * (i + 1), n = [], o = 0; o < t; o++) n[o] = e[o];
for (o = t; o < r; o++) {
var a = n[o - 1];
if (o % t == 0) {
a = a << 8 | a >>> 24;
a = d.SBOX[a >>> 24] << 24 | d.SBOX[a >>> 16 & 255] << 16 | d.SBOX[a >>> 8 & 255] << 8 | d.SBOX[255 & a];
a ^= l[o / t | 0] << 24;
} else 6 < t && o % t == 4 && (a = d.SBOX[a >>> 24] << 24 | d.SBOX[a >>> 16 & 255] << 16 | d.SBOX[a >>> 8 & 255] << 8 | d.SBOX[255 & a]);
n[o] = n[o - t] ^ a;
}
for (var s = [], c = 0; c < r; c++) {
var f = r - c, h = n[f - (c % 4 ? 0 : 4)];
s[c] = c < 4 || f <= 4 ? h : d.INV_SUB_MIX[0][d.SBOX[h >>> 24]] ^ d.INV_SUB_MIX[1][d.SBOX[h >>> 16 & 255]] ^ d.INV_SUB_MIX[2][d.SBOX[h >>> 8 & 255]] ^ d.INV_SUB_MIX[3][d.SBOX[255 & h]];
}
this._nRounds = i;
this._keySchedule = n;
this._invKeySchedule = s;
};
s.prototype.encryptBlockRaw = function(e) {
return a(e = o(e), this._keySchedule, d.SUB_MIX, d.SBOX, this._nRounds);
};
s.prototype.encryptBlock = function(e) {
var t = this.encryptBlockRaw(e), i = n.allocUnsafe(16);
i.writeUInt32BE(t[0], 0);
i.writeUInt32BE(t[1], 4);
i.writeUInt32BE(t[2], 8);
i.writeUInt32BE(t[3], 12);
return i;
};
s.prototype.decryptBlock = function(e) {
var t = (e = o(e))[1];
e[1] = e[3];
e[3] = t;
var i = a(e, this._invKeySchedule, d.INV_SUB_MIX, d.INV_SBOX, this._nRounds), r = n.allocUnsafe(16);
r.writeUInt32BE(i[0], 0);
r.writeUInt32BE(i[3], 4);
r.writeUInt32BE(i[2], 8);
r.writeUInt32BE(i[1], 12);
return r;
};
s.prototype.scrub = function() {
r(this._keySchedule);
r(this._invKeySchedule);
r(this._key);
};
t.exports.AES = s;
}, {
"safe-buffer": 144
} ],
20: [ function(e, t, i) {
var a = e("./aes"), f = e("safe-buffer").Buffer, s = e("cipher-base"), r = e("inherits"), h = e("./ghash"), n = e("buffer-xor"), l = e("./incr32");
function o(e, t, i, r) {
s.call(this);
var n = f.alloc(4, 0);
this._cipher = new a.AES(t);
var o = this._cipher.encryptBlock(n);
this._ghash = new h(o);
i = function(e, t, i) {
if (12 === t.length) {
e._finID = f.concat([ t, f.from([ 0, 0, 0, 1 ]) ]);
return f.concat([ t, f.from([ 0, 0, 0, 2 ]) ]);
}
var r = new h(i), n = t.length, o = n % 16;
r.update(t);
if (o) {
o = 16 - o;
r.update(f.alloc(o, 0));
}
r.update(f.alloc(8, 0));
var a = 8 * n, s = f.alloc(8);
s.writeUIntBE(a, 0, 8);
r.update(s);
e._finID = r.state;
var c = f.from(e._finID);
l(c);
return c;
}(this, i, o);
this._prev = f.from(i);
this._cache = f.allocUnsafe(0);
this._secCache = f.allocUnsafe(0);
this._decrypt = r;
this._alen = 0;
this._len = 0;
this._mode = e;
this._authTag = null;
this._called = !1;
}
r(o, s);
o.prototype._update = function(e) {
if (!this._called && this._alen) {
var t = 16 - this._alen % 16;
if (t < 16) {
t = f.alloc(t, 0);
this._ghash.update(t);
}
}
this._called = !0;
var i = this._mode.encrypt(this, e);
this._decrypt ? this._ghash.update(e) : this._ghash.update(i);
this._len += e.length;
return i;
};
o.prototype._final = function() {
if (this._decrypt && !this._authTag) throw new Error("Unsupported state or unable to authenticate data");
var e = n(this._ghash.final(8 * this._alen, 8 * this._len), this._cipher.encryptBlock(this._finID));
if (this._decrypt && function(e, t) {
var i = 0;
e.length !== t.length && i++;
for (var r = Math.min(e.length, t.length), n = 0; n < r; ++n) i += e[n] ^ t[n];
return i;
}(e, this._authTag)) throw new Error("Unsupported state or unable to authenticate data");
this._authTag = e;
this._cipher.scrub();
};
o.prototype.getAuthTag = function() {
if (this._decrypt || !f.isBuffer(this._authTag)) throw new Error("Attempting to get auth tag in unsupported state");
return this._authTag;
};
o.prototype.setAuthTag = function(e) {
if (!this._decrypt) throw new Error("Attempting to set auth tag in unsupported state");
this._authTag = e;
};
o.prototype.setAAD = function(e) {
if (this._called) throw new Error("Attempting to set AAD in unsupported state");
this._ghash.update(e);
this._alen += e.length;
};
t.exports = o;
}, {
"./aes": 19,
"./ghash": 24,
"./incr32": 25,
"buffer-xor": 46,
"cipher-base": 49,
inherits: 101,
"safe-buffer": 144
} ],
21: [ function(e, t, i) {
var r = e("./encrypter"), n = e("./decrypter"), o = e("./modes/list.json");
i.createCipher = i.Cipher = r.createCipher;
i.createCipheriv = i.Cipheriv = r.createCipheriv;
i.createDecipher = i.Decipher = n.createDecipher;
i.createDecipheriv = i.Decipheriv = n.createDecipheriv;
i.listCiphers = i.getCiphers = function() {
return Object.keys(o);
};
}, {
"./decrypter": 22,
"./encrypter": 23,
"./modes/list.json": 33
} ],
22: [ function(e, t, i) {
var n = e("./authCipher"), o = e("safe-buffer").Buffer, a = e("./modes"), s = e("./streamCipher"), r = e("cipher-base"), c = e("./aes"), f = e("evp_bytestokey");
function h(e, t, i) {
r.call(this);
this._cache = new l();
this._last = void 0;
this._cipher = new c.AES(t);
this._prev = o.from(i);
this._mode = e;
this._autopadding = !0;
}
e("inherits")(h, r);
h.prototype._update = function(e) {
this._cache.add(e);
for (var t, i, r = []; t = this._cache.get(this._autopadding); ) {
i = this._mode.decrypt(this, t);
r.push(i);
}
return o.concat(r);
};
h.prototype._final = function() {
var e = this._cache.flush();
if (this._autopadding) return function(e) {
var t = e[15];
if (t < 1 || 16 < t) throw new Error("unable to decrypt data");
var i = -1;
for (;++i < t; ) if (e[i + (16 - t)] !== t) throw new Error("unable to decrypt data");
if (16 === t) return;
return e.slice(0, 16 - t);
}(this._mode.decrypt(this, e));
if (e) throw new Error("data not multiple of block length");
};
h.prototype.setAutoPadding = function(e) {
this._autopadding = !!e;
return this;
};
function l() {
this.cache = o.allocUnsafe(0);
}
l.prototype.add = function(e) {
this.cache = o.concat([ this.cache, e ]);
};
l.prototype.get = function(e) {
var t;
if (e) {
if (16 < this.cache.length) {
t = this.cache.slice(0, 16);
this.cache = this.cache.slice(16);
return t;
}
} else if (16 <= this.cache.length) {
t = this.cache.slice(0, 16);
this.cache = this.cache.slice(16);
return t;
}
return null;
};
l.prototype.flush = function() {
if (this.cache.length) return this.cache;
};
function d(e, t, i) {
var r = a[e.toLowerCase()];
if (!r) throw new TypeError("invalid suite type");
"string" == typeof i && (i = o.from(i));
if ("GCM" !== r.mode && i.length !== r.iv) throw new TypeError("invalid iv length " + i.length);
"string" == typeof t && (t = o.from(t));
if (t.length !== r.key / 8) throw new TypeError("invalid key length " + t.length);
return "stream" === r.type ? new s(r.module, t, i, !0) : "auth" === r.type ? new n(r.module, t, i, !0) : new h(r.module, t, i);
}
i.createDecipher = function(e, t) {
var i = a[e.toLowerCase()];
if (!i) throw new TypeError("invalid suite type");
var r = f(t, !1, i.key, i.iv);
return d(e, r.key, r.iv);
};
i.createDecipheriv = d;
}, {
"./aes": 19,
"./authCipher": 20,
"./modes": 32,
"./streamCipher": 35,
"cipher-base": 49,
evp_bytestokey: 84,
inherits: 101,
"safe-buffer": 144
} ],
23: [ function(e, t, i) {
var n = e("./modes"), o = e("./authCipher"), a = e("safe-buffer").Buffer, s = e("./streamCipher"), r = e("cipher-base"), c = e("./aes"), f = e("evp_bytestokey");
function h(e, t, i) {
r.call(this);
this._cache = new d();
this._cipher = new c.AES(t);
this._prev = a.from(i);
this._mode = e;
this._autopadding = !0;
}
e("inherits")(h, r);
h.prototype._update = function(e) {
this._cache.add(e);
for (var t, i, r = []; t = this._cache.get(); ) {
i = this._mode.encrypt(this, t);
r.push(i);
}
return a.concat(r);
};
var l = a.alloc(16, 16);
h.prototype._final = function() {
var e = this._cache.flush();
if (this._autopadding) {
e = this._mode.encrypt(this, e);
this._cipher.scrub();
return e;
}
if (!e.equals(l)) {
this._cipher.scrub();
throw new Error("data not multiple of block length");
}
};
h.prototype.setAutoPadding = function(e) {
this._autopadding = !!e;
return this;
};
function d() {
this.cache = a.allocUnsafe(0);
}
d.prototype.add = function(e) {
this.cache = a.concat([ this.cache, e ]);
};
d.prototype.get = function() {
if (15 < this.cache.length) {
var e = this.cache.slice(0, 16);
this.cache = this.cache.slice(16);
return e;
}
return null;
};
d.prototype.flush = function() {
for (var e = 16 - this.cache.length, t = a.allocUnsafe(e), i = -1; ++i < e; ) t.writeUInt8(e, i);
return a.concat([ this.cache, t ]);
};
function u(e, t, i) {
var r = n[e.toLowerCase()];
if (!r) throw new TypeError("invalid suite type");
"string" == typeof t && (t = a.from(t));
if (t.length !== r.key / 8) throw new TypeError("invalid key length " + t.length);
"string" == typeof i && (i = a.from(i));
if ("GCM" !== r.mode && i.length !== r.iv) throw new TypeError("invalid iv length " + i.length);
return "stream" === r.type ? new s(r.module, t, i) : "auth" === r.type ? new o(r.module, t, i) : new h(r.module, t, i);
}
i.createCipheriv = u;
i.createCipher = function(e, t) {
var i = n[e.toLowerCase()];
if (!i) throw new TypeError("invalid suite type");
var r = f(t, !1, i.key, i.iv);
return u(e, r.key, r.iv);
};
}, {
"./aes": 19,
"./authCipher": 20,
"./modes": 32,
"./streamCipher": 35,
"cipher-base": 49,
evp_bytestokey: 84,
inherits: 101,
"safe-buffer": 144
} ],
24: [ function(e, t, i) {
var r = e("safe-buffer").Buffer, n = r.alloc(16, 0);
function a(e) {
var t = r.allocUnsafe(16);
t.writeUInt32BE(e[0] >>> 0, 0);
t.writeUInt32BE(e[1] >>> 0, 4);
t.writeUInt32BE(e[2] >>> 0, 8);
t.writeUInt32BE(e[3] >>> 0, 12);
return t;
}
function o(e) {
this.h = e;
this.state = r.alloc(16, 0);
this.cache = r.allocUnsafe(0);
}
o.prototype.ghash = function(e) {
for (var t = -1; ++t < e.length; ) this.state[t] ^= e[t];
this._multiply();
};
o.prototype._multiply = function() {
for (var e, t, i, r = [ (e = this.h).readUInt32BE(0), e.readUInt32BE(4), e.readUInt32BE(8), e.readUInt32BE(12) ], n = [ 0, 0, 0, 0 ], o = -1; ++o < 128; ) {
if (0 != (this.state[~~(o / 8)] & 1 << 7 - o % 8)) {
n[0] ^= r[0];
n[1] ^= r[1];
n[2] ^= r[2];
n[3] ^= r[3];
}
i = 0 != (1 & r[3]);
for (t = 3; 0 < t; t--) r[t] = r[t] >>> 1 | (1 & r[t - 1]) << 31;
r[0] = r[0] >>> 1;
i && (r[0] = r[0] ^ 225 << 24);
}
this.state = a(n);
};
o.prototype.update = function(e) {
this.cache = r.concat([ this.cache, e ]);
for (var t; 16 <= this.cache.length; ) {
t = this.cache.slice(0, 16);
this.cache = this.cache.slice(16);
this.ghash(t);
}
};
o.prototype.final = function(e, t) {
this.cache.length && this.ghash(r.concat([ this.cache, n ], 16));
this.ghash(a([ 0, e, 0, t ]));
return this.state;
};
t.exports = o;
}, {
"safe-buffer": 144
} ],
25: [ function(e, t, i) {
t.exports = function(e) {
for (var t, i = e.length; i--; ) {
if (255 !== (t = e.readUInt8(i))) {
t++;
e.writeUInt8(t, i);
break;
}
e.writeUInt8(0, i);
}
};
}, {} ],
26: [ function(e, t, i) {
var n = e("buffer-xor");
i.encrypt = function(e, t) {
var i = n(t, e._prev);
e._prev = e._cipher.encryptBlock(i);
return e._prev;
};
i.decrypt = function(e, t) {
var i = e._prev;
e._prev = t;
var r = e._cipher.decryptBlock(t);
return n(r, i);
};
}, {
"buffer-xor": 46
} ],
27: [ function(e, t, i) {
var o = e("safe-buffer").Buffer, a = e("buffer-xor");
function s(e, t, i) {
var r = t.length, n = a(t, e._cache);
e._cache = e._cache.slice(r);
e._prev = o.concat([ e._prev, i ? t : n ]);
return n;
}
i.encrypt = function(e, t, i) {
for (var r, n = o.allocUnsafe(0); t.length; ) {
if (0 === e._cache.length) {
e._cache = e._cipher.encryptBlock(e._prev);
e._prev = o.allocUnsafe(0);
}
if (!(e._cache.length <= t.length)) {
n = o.concat([ n, s(e, t, i) ]);
break;
}
r = e._cache.length;
n = o.concat([ n, s(e, t.slice(0, r), i) ]);
t = t.slice(r);
}
return n;
};
}, {
"buffer-xor": 46,
"safe-buffer": 144
} ],
28: [ function(e, t, i) {
var a = e("safe-buffer").Buffer;
function s(e, t, i) {
for (var r, n, o = -1, a = 0; ++o < 8; ) {
r = t & 1 << 7 - o ? 128 : 0;
a += (128 & (n = e._cipher.encryptBlock(e._prev)[0] ^ r)) >> o % 8;
e._prev = c(e._prev, i ? r : n);
}
return a;
}
function c(e, t) {
var i = e.length, r = -1, n = a.allocUnsafe(e.length);
e = a.concat([ e, a.from([ t ]) ]);
for (;++r < i; ) n[r] = e[r] << 1 | e[r + 1] >> 7;
return n;
}
i.encrypt = function(e, t, i) {
for (var r = t.length, n = a.allocUnsafe(r), o = -1; ++o < r; ) n[o] = s(e, t[o], i);
return n;
};
}, {
"safe-buffer": 144
} ],
29: [ function(e, t, i) {
var a = e("safe-buffer").Buffer;
function s(e, t, i) {
var r = e._cipher.encryptBlock(e._prev)[0] ^ t;
e._prev = a.concat([ e._prev.slice(1), a.from([ i ? t : r ]) ]);
return r;
}
i.encrypt = function(e, t, i) {
for (var r = t.length, n = a.allocUnsafe(r), o = -1; ++o < r; ) n[o] = s(e, t[o], i);
return n;
};
}, {
"safe-buffer": 144
} ],
30: [ function(e, t, i) {
var c = e("buffer-xor"), f = e("safe-buffer").Buffer, r = e("../incr32");
function h(e) {
var t = e._cipher.encryptBlockRaw(e._prev);
r(e._prev);
return t;
}
i.encrypt = function(e, t) {
var i = Math.ceil(t.length / 16), r = e._cache.length;
e._cache = f.concat([ e._cache, f.allocUnsafe(16 * i) ]);
for (var n = 0; n < i; n++) {
var o = h(e), a = r + 16 * n;
e._cache.writeUInt32BE(o[0], a + 0);
e._cache.writeUInt32BE(o[1], a + 4);
e._cache.writeUInt32BE(o[2], a + 8);
e._cache.writeUInt32BE(o[3], a + 12);
}
var s = e._cache.slice(0, t.length);
e._cache = e._cache.slice(t.length);
return c(t, s);
};
}, {
"../incr32": 25,
"buffer-xor": 46,
"safe-buffer": 144
} ],
31: [ function(e, t, i) {
i.encrypt = function(e, t) {
return e._cipher.encryptBlock(t);
};
i.decrypt = function(e, t) {
return e._cipher.decryptBlock(t);
};
}, {} ],
32: [ function(e, t, i) {
var r = {
ECB: e("./ecb"),
CBC: e("./cbc"),
CFB: e("./cfb"),
CFB8: e("./cfb8"),
CFB1: e("./cfb1"),
OFB: e("./ofb"),
CTR: e("./ctr"),
GCM: e("./ctr")
}, n = e("./list.json");
for (var o in n) n[o].module = r[n[o].mode];
t.exports = n;
}, {
"./cbc": 26,
"./cfb": 27,
"./cfb1": 28,
"./cfb8": 29,
"./ctr": 30,
"./ecb": 31,
"./list.json": 33,
"./ofb": 34
} ],
33: [ function(e, t, i) {
t.exports = {
"aes-128-ecb": {
cipher: "AES",
key: 128,
iv: 0,
mode: "ECB",
type: "block"
},
"aes-192-ecb": {
cipher: "AES",
key: 192,
iv: 0,
mode: "ECB",
type: "block"
},
"aes-256-ecb": {
cipher: "AES",
key: 256,
iv: 0,
mode: "ECB",
type: "block"
},
"aes-128-cbc": {
cipher: "AES",
key: 128,
iv: 16,
mode: "CBC",
type: "block"
},
"aes-192-cbc": {
cipher: "AES",
key: 192,
iv: 16,
mode: "CBC",
type: "block"
},
"aes-256-cbc": {
cipher: "AES",
key: 256,
iv: 16,
mode: "CBC",
type: "block"
},
aes128: {
cipher: "AES",
key: 128,
iv: 16,
mode: "CBC",
type: "block"
},
aes192: {
cipher: "AES",
key: 192,
iv: 16,
mode: "CBC",
type: "block"
},
aes256: {
cipher: "AES",
key: 256,
iv: 16,
mode: "CBC",
type: "block"
},
"aes-128-cfb": {
cipher: "AES",
key: 128,
iv: 16,
mode: "CFB",
type: "stream"
},
"aes-192-cfb": {
cipher: "AES",
key: 192,
iv: 16,
mode: "CFB",
type: "stream"
},
"aes-256-cfb": {
cipher: "AES",
key: 256,
iv: 16,
mode: "CFB",
type: "stream"
},
"aes-128-cfb8": {
cipher: "AES",
key: 128,
iv: 16,
mode: "CFB8",
type: "stream"
},
"aes-192-cfb8": {
cipher: "AES",
key: 192,
iv: 16,
mode: "CFB8",
type: "stream"
},
"aes-256-cfb8": {
cipher: "AES",
key: 256,
iv: 16,
mode: "CFB8",
type: "stream"
},
"aes-128-cfb1": {
cipher: "AES",
key: 128,
iv: 16,
mode: "CFB1",
type: "stream"
},
"aes-192-cfb1": {
cipher: "AES",
key: 192,
iv: 16,
mode: "CFB1",
type: "stream"
},
"aes-256-cfb1": {
cipher: "AES",
key: 256,
iv: 16,
mode: "CFB1",
type: "stream"
},
"aes-128-ofb": {
cipher: "AES",
key: 128,
iv: 16,
mode: "OFB",
type: "stream"
},
"aes-192-ofb": {
cipher: "AES",
key: 192,
iv: 16,
mode: "OFB",
type: "stream"
},
"aes-256-ofb": {
cipher: "AES",
key: 256,
iv: 16,
mode: "OFB",
type: "stream"
},
"aes-128-ctr": {
cipher: "AES",
key: 128,
iv: 16,
mode: "CTR",
type: "stream"
},
"aes-192-ctr": {
cipher: "AES",
key: 192,
iv: 16,
mode: "CTR",
type: "stream"
},
"aes-256-ctr": {
cipher: "AES",
key: 256,
iv: 16,
mode: "CTR",
type: "stream"
},
"aes-128-gcm": {
cipher: "AES",
key: 128,
iv: 12,
mode: "GCM",
type: "auth"
},
"aes-192-gcm": {
cipher: "AES",
key: 192,
iv: 12,
mode: "GCM",
type: "auth"
},
"aes-256-gcm": {
cipher: "AES",
key: 256,
iv: 12,
mode: "GCM",
type: "auth"
}
};
}, {} ],
34: [ function(e, t, i) {
(function(r) {
var n = e("buffer-xor");
function o(e) {
e._prev = e._cipher.encryptBlock(e._prev);
return e._prev;
}
i.encrypt = function(e, t) {
for (;e._cache.length < t.length; ) e._cache = r.concat([ e._cache, o(e) ]);
var i = e._cache.slice(0, t.length);
e._cache = e._cache.slice(t.length);
return n(t, i);
};
}).call(this, e("buffer").Buffer);
}, {
buffer: 47,
"buffer-xor": 46
} ],
35: [ function(e, t, i) {
var n = e("./aes"), o = e("safe-buffer").Buffer, a = e("cipher-base");
function r(e, t, i, r) {
a.call(this);
this._cipher = new n.AES(t);
this._prev = o.from(i);
this._cache = o.allocUnsafe(0);
this._secCache = o.allocUnsafe(0);
this._decrypt = r;
this._mode = e;
}
e("inherits")(r, a);
r.prototype._update = function(e) {
return this._mode.encrypt(this, e, this._decrypt);
};
r.prototype._final = function() {
this._cipher.scrub();
};
t.exports = r;
}, {
"./aes": 19,
"cipher-base": 49,
inherits: 101,
"safe-buffer": 144
} ],
36: [ function(e, t, i) {
var r = e("browserify-des"), n = e("browserify-aes/browser"), o = e("browserify-aes/modes"), a = e("browserify-des/modes"), s = e("evp_bytestokey");
function c(e, t, i) {
e = e.toLowerCase();
if (o[e]) return n.createCipheriv(e, t, i);
if (a[e]) return new r({
key: t,
iv: i,
mode: e
});
throw new TypeError("invalid suite type");
}
function f(e, t, i) {
e = e.toLowerCase();
if (o[e]) return n.createDecipheriv(e, t, i);
if (a[e]) return new r({
key: t,
iv: i,
mode: e,
decrypt: !0
});
throw new TypeError("invalid suite type");
}
i.createCipher = i.Cipher = function(e, t) {
e = e.toLowerCase();
var i, r;
if (o[e]) {
i = o[e].key;
r = o[e].iv;
} else {
if (!a[e]) throw new TypeError("invalid suite type");
i = 8 * a[e].key;
r = a[e].iv;
}
var n = s(t, !1, i, r);
return c(e, n.key, n.iv);
};
i.createCipheriv = i.Cipheriv = c;
i.createDecipher = i.Decipher = function(e, t) {
e = e.toLowerCase();
var i, r;
if (o[e]) {
i = o[e].key;
r = o[e].iv;
} else {
if (!a[e]) throw new TypeError("invalid suite type");
i = 8 * a[e].key;
r = a[e].iv;
}
var n = s(t, !1, i, r);
return f(e, n.key, n.iv);
};
i.createDecipheriv = i.Decipheriv = f;
i.listCiphers = i.getCiphers = function() {
return Object.keys(a).concat(n.getCiphers());
};
}, {
"browserify-aes/browser": 21,
"browserify-aes/modes": 32,
"browserify-des": 37,
"browserify-des/modes": 38,
evp_bytestokey: 84
} ],
37: [ function(r, n, e) {
(function(a) {
var s = r("cipher-base"), e = r("des.js"), t = r("inherits"), c = {
"des-ede3-cbc": e.CBC.instantiate(e.EDE),
"des-ede3": e.EDE,
"des-ede-cbc": e.CBC.instantiate(e.EDE),
"des-ede": e.EDE,
"des-cbc": e.CBC.instantiate(e.DES),
"des-ecb": e.DES
};
c.des = c["des-cbc"];
c.des3 = c["des-ede3-cbc"];
t(n.exports = i, s);
function i(e) {
s.call(this);
var t, i = e.mode.toLowerCase(), r = c[i];
t = e.decrypt ? "decrypt" : "encrypt";
var n = e.key;
"des-ede" !== i && "des-ede-cbc" !== i || (n = a.concat([ n, n.slice(0, 8) ]));
var o = e.iv;
this._des = r.create({
key: n,
iv: o,
type: t
});
}
i.prototype._update = function(e) {
return new a(this._des.update(e));
};
i.prototype._final = function() {
return new a(this._des.final());
};
}).call(this, r("buffer").Buffer);
}, {
buffer: 47,
"cipher-base": 49,
"des.js": 57,
inherits: 101
} ],
38: [ function(e, t, i) {
i["des-ecb"] = {
key: 8,
iv: 0
};
i["des-cbc"] = i.des = {
key: 8,
iv: 8
};
i["des-ede3-cbc"] = i.des3 = {
key: 24,
iv: 8
};
i["des-ede3"] = {
key: 24,
iv: 0
};
i["des-ede-cbc"] = {
key: 16,
iv: 8
};
i["des-ede"] = {
key: 16,
iv: 0
};
}, {} ],
39: [ function(t, i, e) {
(function(b) {
var m = t("bn.js"), r = t("randombytes");
function e(e, t) {
var i, r, n = {
blinder: (r = g(i = t)).toRed(m.mont(i.modulus)).redPow(new m(i.publicExponent)).fromRed(),
unblinder: r.invm(i.modulus)
}, o = t.modulus.byteLength(), a = (m.mont(t.modulus), new m(e).mul(n.blinder).umod(t.modulus)), s = a.toRed(m.mont(t.prime1)), c = a.toRed(m.mont(t.prime2)), f = t.coefficient, h = t.prime1, l = t.prime2, d = s.redPow(t.exponent1), u = c.redPow(t.exponent2);
d = d.fromRed();
u = u.fromRed();
var p = d.isub(u).imul(f).umod(h);
p.imul(l);
u.iadd(p);
return new b(u.imul(n.unblinder).umod(t.modulus).toArray(!1, o));
}
(i.exports = e).getr = g;
function g(e) {
for (var t = e.modulus.byteLength(), i = new m(r(t)); 0 <= i.cmp(e.modulus) || !i.umod(e.prime1) || !i.umod(e.prime2); ) i = new m(r(t));
return i;
}
}).call(this, t("buffer").Buffer);
}, {
"bn.js": 16,
buffer: 47,
randombytes: 125
} ],
40: [ function(e, t, i) {
t.exports = e("./browser/algorithms.json");
}, {
"./browser/algorithms.json": 41
} ],
41: [ function(e, t, i) {
t.exports = {
sha224WithRSAEncryption: {
sign: "rsa",
hash: "sha224",
id: "302d300d06096086480165030402040500041c"
},
"RSA-SHA224": {
sign: "ecdsa/rsa",
hash: "sha224",
id: "302d300d06096086480165030402040500041c"
},
sha256WithRSAEncryption: {
sign: "rsa",
hash: "sha256",
id: "3031300d060960864801650304020105000420"
},
"RSA-SHA256": {
sign: "ecdsa/rsa",
hash: "sha256",
id: "3031300d060960864801650304020105000420"
},
sha384WithRSAEncryption: {
sign: "rsa",
hash: "sha384",
id: "3041300d060960864801650304020205000430"
},
"RSA-SHA384": {
sign: "ecdsa/rsa",
hash: "sha384",
id: "3041300d060960864801650304020205000430"
},
sha512WithRSAEncryption: {
sign: "rsa",
hash: "sha512",
id: "3051300d060960864801650304020305000440"
},
"RSA-SHA512": {
sign: "ecdsa/rsa",
hash: "sha512",
id: "3051300d060960864801650304020305000440"
},
"RSA-SHA1": {
sign: "rsa",
hash: "sha1",
id: "3021300906052b0e03021a05000414"
},
"ecdsa-with-SHA1": {
sign: "ecdsa",
hash: "sha1",
id: ""
},
sha256: {
sign: "ecdsa",
hash: "sha256",
id: ""
},
sha224: {
sign: "ecdsa",
hash: "sha224",
id: ""
},
sha384: {
sign: "ecdsa",
hash: "sha384",
id: ""
},
sha512: {
sign: "ecdsa",
hash: "sha512",
id: ""
},
"DSA-SHA": {
sign: "dsa",
hash: "sha1",
id: ""
},
"DSA-SHA1": {
sign: "dsa",
hash: "sha1",
id: ""
},
DSA: {
sign: "dsa",
hash: "sha1",
id: ""
},
"DSA-WITH-SHA224": {
sign: "dsa",
hash: "sha224",
id: ""
},
"DSA-SHA224": {
sign: "dsa",
hash: "sha224",
id: ""
},
"DSA-WITH-SHA256": {
sign: "dsa",
hash: "sha256",
id: ""
},
"DSA-SHA256": {
sign: "dsa",
hash: "sha256",
id: ""
},
"DSA-WITH-SHA384": {
sign: "dsa",
hash: "sha384",
id: ""
},
"DSA-SHA384": {
sign: "dsa",
hash: "sha384",
id: ""
},
"DSA-WITH-SHA512": {
sign: "dsa",
hash: "sha512",
id: ""
},
"DSA-SHA512": {
sign: "dsa",
hash: "sha512",
id: ""
},
"DSA-RIPEMD160": {
sign: "dsa",
hash: "rmd160",
id: ""
},
ripemd160WithRSA: {
sign: "rsa",
hash: "rmd160",
id: "3021300906052b2403020105000414"
},
"RSA-RIPEMD160": {
sign: "rsa",
hash: "rmd160",
id: "3021300906052b2403020105000414"
},
md5WithRSAEncryption: {
sign: "rsa",
hash: "md5",
id: "3020300c06082a864886f70d020505000410"
},
"RSA-MD5": {
sign: "rsa",
hash: "md5",
id: "3020300c06082a864886f70d020505000410"
}
};
}, {} ],
42: [ function(e, t, i) {
t.exports = {
"1.3.132.0.10": "secp256k1",
"1.3.132.0.33": "p224",
"1.2.840.10045.3.1.1": "p192",
"1.2.840.10045.3.1.7": "p256",
"1.3.132.0.34": "p384",
"1.3.132.0.35": "p521"
};
}, {} ],
43: [ function(l, d, e) {
(function(n) {
var i = l("create-hash"), r = l("stream"), e = l("inherits"), o = l("./sign"), a = l("./verify"), s = l("./algorithms.json");
Object.keys(s).forEach(function(e) {
s[e].id = new n(s[e].id, "hex");
s[e.toLowerCase()] = s[e];
});
function t(e) {
r.Writable.call(this);
var t = s[e];
if (!t) throw new Error("Unknown message digest");
this._hashType = t.hash;
this._hash = i(t.hash);
this._tag = t.id;
this._signType = t.sign;
}
e(t, r.Writable);
t.prototype._write = function(e, t, i) {
this._hash.update(e);
i();
};
t.prototype.update = function(e, t) {
"string" == typeof e && (e = new n(e, t));
this._hash.update(e);
return this;
};
t.prototype.sign = function(e, t) {
this.end();
var i = this._hash.digest(), r = o(i, e, this._hashType, this._signType, this._tag);
return t ? r.toString(t) : r;
};
function c(e) {
r.Writable.call(this);
var t = s[e];
if (!t) throw new Error("Unknown message digest");
this._hash = i(t.hash);
this._tag = t.id;
this._signType = t.sign;
}
e(c, r.Writable);
c.prototype._write = function(e, t, i) {
this._hash.update(e);
i();
};
c.prototype.update = function(e, t) {
"string" == typeof e && (e = new n(e, t));
this._hash.update(e);
return this;
};
c.prototype.verify = function(e, t, i) {
"string" == typeof t && (t = new n(t, i));
this.end();
var r = this._hash.digest();
return a(t, r, e, this._signType, this._tag);
};
function f(e) {
return new t(e);
}
function h(e) {
return new c(e);
}
d.exports = {
Sign: f,
Verify: h,
createSign: f,
createVerify: h
};
}).call(this, l("buffer").Buffer);
}, {
"./algorithms.json": 41,
"./sign": 44,
"./verify": 45,
buffer: 47,
"create-hash": 52,
inherits: 101,
stream: 153
} ],
44: [ function(e, t, i) {
(function(b) {
var f = e("create-hmac"), h = e("browserify-rsa"), l = e("elliptic").ec, m = e("bn.js"), d = e("parse-asn1"), u = e("./curves.json");
function g(e, t, i, r) {
if ((e = new b(e.toArray())).length < t.byteLength()) {
var n = new b(t.byteLength() - e.length);
n.fill(0);
e = b.concat([ n, e ]);
}
var o = i.length, a = function(e, t) {
e = (e = y(e, t)).mod(t);
var i = new b(e.toArray());
if (i.length < t.byteLength()) {
var r = new b(t.byteLength() - i.length);
r.fill(0);
i = b.concat([ r, i ]);
}
return i;
}(i, t), s = new b(o);
s.fill(1);
var c = new b(o);
c.fill(0);
c = f(r, c).update(s).update(new b([ 0 ])).update(e).update(a).digest();
s = f(r, c).update(s).digest();
return {
k: c = f(r, c).update(s).update(new b([ 1 ])).update(e).update(a).digest(),
v: s = f(r, c).update(s).digest()
};
}
function y(e, t) {
var i = new m(e), r = (e.length << 3) - t.bitLength();
0 < r && i.ishrn(r);
return i;
}
function v(e, t, i) {
var r, n;
do {
r = new b(0);
for (;8 * r.length < e.bitLength(); ) {
t.v = f(i, t.k).update(t.v).digest();
r = b.concat([ r, t.v ]);
}
n = y(r, e);
t.k = f(i, t.k).update(t.v).update(new b([ 0 ])).digest();
t.v = f(i, t.k).update(t.v).digest();
} while (-1 !== n.cmp(e));
return n;
}
t.exports = function(e, t, i, r, n) {
var o = d(t);
if (o.curve) {
if ("ecdsa" !== r && "ecdsa/rsa" !== r) throw new Error("wrong private key type");
return function(e, t) {
var i = u[t.curve.join(".")];
if (!i) throw new Error("unknown curve " + t.curve.join("."));
var r = new l(i).keyFromPrivate(t.privateKey).sign(e);
return new b(r.toDER());
}(e, o);
}
if ("dsa" === o.type) {
if ("dsa" !== r) throw new Error("wrong private key type");
return function(e, t, i) {
for (var r, n, o, a, s = t.params.priv_key, c = t.params.p, f = t.params.q, h = t.params.g, l = new m(0), d = y(e, f).mod(f), u = !1, p = g(s, f, e, i); !1 === u; ) {
r = v(f, p, i);
l = (n = r, o = c, a = f, h.toRed(m.mont(o)).redPow(n).fromRed().mod(a));
if (0 === (u = r.invm(f).imul(d.add(s.mul(l))).mod(f)).cmpn(0)) {
u = !1;
l = new m(0);
}
}
return function(e, t) {
e = e.toArray();
t = t.toArray();
128 & e[0] && (e = [ 0 ].concat(e));
128 & t[0] && (t = [ 0 ].concat(t));
var i = [ 48, e.length + t.length + 4, 2, e.length ];
i = i.concat(e, [ 2, t.length ], t);
return new b(i);
}(l, u);
}(e, o, i);
}
if ("rsa" !== r && "ecdsa/rsa" !== r) throw new Error("wrong private key type");
e = b.concat([ n, e ]);
for (var a = o.modulus.byteLength(), s = [ 0, 1 ]; e.length + s.length + 1 < a; ) s.push(255);
s.push(0);
for (var c = -1; ++c < e.length; ) s.push(e[c]);
return h(s, o);
};
t.exports.getKey = g;
t.exports.makeKey = v;
}).call(this, e("buffer").Buffer);
}, {
"./curves.json": 42,
"bn.js": 16,
"browserify-rsa": 39,
buffer: 47,
"create-hmac": 54,
elliptic: 67,
"parse-asn1": 111
} ],
45: [ function(e, t, i) {
(function(d) {
var u = e("bn.js"), p = e("elliptic").ec, b = e("parse-asn1"), m = e("./curves.json");
function g(e, t) {
if (e.cmpn(0) <= 0) throw new Error("invalid sig");
if (e.cmp(t) >= t) throw new Error("invalid sig");
}
t.exports = function(e, t, i, r, n) {
var o = b(i);
if ("ec" === o.type) {
if ("ecdsa" !== r && "ecdsa/rsa" !== r) throw new Error("wrong public key type");
return function(e, t, i) {
var r = m[i.data.algorithm.curve.join(".")];
if (!r) throw new Error("unknown curve " + i.data.algorithm.curve.join("."));
var n = new p(r), o = i.data.subjectPrivateKey.data;
return n.verify(t, e, o);
}(e, t, o);
}
if ("dsa" === o.type) {
if ("dsa" !== r) throw new Error("wrong public key type");
return function(e, t, i) {
var r = i.data.p, n = i.data.q, o = i.data.g, a = i.data.pub_key, s = b.signature.decode(e, "der"), c = s.s, f = s.r;
g(c, n);
g(f, n);
var h = u.mont(r), l = c.invm(n);
return 0 === o.toRed(h).redPow(new u(t).mul(l).mod(n)).fromRed().mul(a.toRed(h).redPow(f.mul(l).mod(n)).fromRed()).mod(r).mod(n).cmp(f);
}(e, t, o);
}
if ("rsa" !== r && "ecdsa/rsa" !== r) throw new Error("wrong public key type");
t = d.concat([ n, t ]);
for (var a = o.modulus.byteLength(), s = [ 1 ], c = 0; t.length + s.length + 2 < a; ) {
s.push(255);
c++;
}
s.push(0);
for (var f = -1; ++f < t.length; ) s.push(t[f]);
s = new d(s);
var h = u.mont(o.modulus);
e = (e = new u(e).toRed(h)).redPow(new u(o.publicExponent));
e = new d(e.fromRed().toArray());
var l = c < 8 ? 1 : 0;
a = Math.min(e.length, s.length);
e.length !== s.length && (l = 1);
f = -1;
for (;++f < a; ) l |= e[f] ^ s[f];
return 0 === l;
};
}).call(this, e("buffer").Buffer);
}, {
"./curves.json": 42,
"bn.js": 16,
buffer: 47,
elliptic: 67,
"parse-asn1": 111
} ],
46: [ function(e, t, i) {
(function(o) {
t.exports = function(e, t) {
for (var i = Math.min(e.length, t.length), r = new o(i), n = 0; n < i; ++n) r[n] = e[n] ^ t[n];
return r;
};
}).call(this, e("buffer").Buffer);
}, {
buffer: 47
} ],
47: [ function(t, e, U) {
(function(e) {
"use strict";
var r = t("base64-js"), o = t("ieee754"), a = t("isarray");
U.Buffer = l;
U.SlowBuffer = function(e) {
+e != e && (e = 0);
return l.alloc(+e);
};
U.INSPECT_MAX_BYTES = 50;
l.TYPED_ARRAY_SUPPORT = void 0 !== e.TYPED_ARRAY_SUPPORT ? e.TYPED_ARRAY_SUPPORT : function() {
try {
var e = new Uint8Array(1);
e.__proto__ = {
__proto__: Uint8Array.prototype,
foo: function() {
return 42;
}
};
return 42 === e.foo() && "function" == typeof e.subarray && 0 === e.subarray(1, 1).byteLength;
} catch (e) {
return !1;
}
}();
U.kMaxLength = i();
function i() {
return l.TYPED_ARRAY_SUPPORT ? 2147483647 : 1073741823;
}
function s(e, t) {
if (i() < t) throw new RangeError("Invalid typed array length");
if (l.TYPED_ARRAY_SUPPORT) (e = new Uint8Array(t)).__proto__ = l.prototype; else {
null === e && (e = new l(t));
e.length = t;
}
return e;
}
function l(e, t, i) {
if (!(l.TYPED_ARRAY_SUPPORT || this instanceof l)) return new l(e, t, i);
if ("number" == typeof e) {
if ("string" == typeof t) throw new Error("If encoding is specified then the first argument must be a string");
return f(this, e);
}
return n(this, e, t, i);
}
l.poolSize = 8192;
l._augment = function(e) {
e.__proto__ = l.prototype;
return e;
};
function n(e, t, i, r) {
if ("number" == typeof t) throw new TypeError('"value" argument must not be a number');
return "undefined" != typeof ArrayBuffer && t instanceof ArrayBuffer ? function(e, t, i, r) {
t.byteLength;
if (i < 0 || t.byteLength < i) throw new RangeError("'offset' is out of bounds");
if (t.byteLength < i + (r || 0)) throw new RangeError("'length' is out of bounds");
t = void 0 === i && void 0 === r ? new Uint8Array(t) : void 0 === r ? new Uint8Array(t, i) : new Uint8Array(t, i, r);
l.TYPED_ARRAY_SUPPORT ? (e = t).__proto__ = l.prototype : e = h(e, t);
return e;
}(e, t, i, r) : "string" == typeof t ? function(e, t, i) {
"string" == typeof i && "" !== i || (i = "utf8");
if (!l.isEncoding(i)) throw new TypeError('"encoding" must be a valid string encoding');
var r = 0 | u(t, i), n = (e = s(e, r)).write(t, i);
n !== r && (e = e.slice(0, n));
return e;
}(e, t, i) : function(e, t) {
if (l.isBuffer(t)) {
var i = 0 | d(t.length);
if (0 === (e = s(e, i)).length) return e;
t.copy(e, 0, 0, i);
return e;
}
if (t) {
if ("undefined" != typeof ArrayBuffer && t.buffer instanceof ArrayBuffer || "length" in t) return "number" != typeof t.length || (r = t.length) != r ? s(e, 0) : h(e, t);
if ("Buffer" === t.type && a(t.data)) return h(e, t.data);
}
var r;
throw new TypeError("First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.");
}(e, t);
}
l.from = function(e, t, i) {
return n(null, e, t, i);
};
if (l.TYPED_ARRAY_SUPPORT) {
l.prototype.__proto__ = Uint8Array.prototype;
l.__proto__ = Uint8Array;
"undefined" != typeof Symbol && Symbol.species && l[Symbol.species] === l && Object.defineProperty(l, Symbol.species, {
value: null,
configurable: !0
});
}
function c(e) {
if ("number" != typeof e) throw new TypeError('"size" argument must be a number');
if (e < 0) throw new RangeError('"size" argument must not be negative');
}
l.alloc = function(e, t, i) {
return function(e, t, i, r) {
c(t);
return t <= 0 ? s(e, t) : void 0 !== i ? "string" == typeof r ? s(e, t).fill(i, r) : s(e, t).fill(i) : s(e, t);
}(null, e, t, i);
};
function f(e, t) {
c(t);
e = s(e, t < 0 ? 0 : 0 | d(t));
if (!l.TYPED_ARRAY_SUPPORT) for (var i = 0; i < t; ++i) e[i] = 0;
return e;
}
l.allocUnsafe = function(e) {
return f(null, e);
};
l.allocUnsafeSlow = function(e) {
return f(null, e);
};
function h(e, t) {
var i = t.length < 0 ? 0 : 0 | d(t.length);
e = s(e, i);
for (var r = 0; r < i; r += 1) e[r] = 255 & t[r];
return e;
}
function d(e) {
if (e >= i()) throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + i().toString(16) + " bytes");
return 0 | e;
}
l.isBuffer = function(e) {
return !(null == e || !e._isBuffer);
};
l.compare = function(e, t) {
if (!l.isBuffer(e) || !l.isBuffer(t)) throw new TypeError("Arguments must be Buffers");
if (e === t) return 0;
for (var i = e.length, r = t.length, n = 0, o = Math.min(i, r); n < o; ++n) if (e[n] !== t[n]) {
i = e[n];
r = t[n];
break;
}
return i < r ? -1 : r < i ? 1 : 0;
};
l.isEncoding = function(e) {
switch (String(e).toLowerCase()) {
case "hex":
case "utf8":
case "utf-8":
case "ascii":
case "latin1":
case "binary":
case "base64":
case "ucs2":
case "ucs-2":
case "utf16le":
case "utf-16le":
return !0;

default:
return !1;
}
};
l.concat = function(e, t) {
if (!a(e)) throw new TypeError('"list" argument must be an Array of Buffers');
if (0 === e.length) return l.alloc(0);
var i;
if (void 0 === t) for (i = t = 0; i < e.length; ++i) t += e[i].length;
var r = l.allocUnsafe(t), n = 0;
for (i = 0; i < e.length; ++i) {
var o = e[i];
if (!l.isBuffer(o)) throw new TypeError('"list" argument must be an Array of Buffers');
o.copy(r, n);
n += o.length;
}
return r;
};
function u(e, t) {
if (l.isBuffer(e)) return e.length;
if ("undefined" != typeof ArrayBuffer && "function" == typeof ArrayBuffer.isView && (ArrayBuffer.isView(e) || e instanceof ArrayBuffer)) return e.byteLength;
"string" != typeof e && (e = "" + e);
var i = e.length;
if (0 === i) return 0;
for (var r = !1; ;) switch (t) {
case "ascii":
case "latin1":
case "binary":
return i;

case "utf8":
case "utf-8":
case void 0:
return B(e).length;

case "ucs2":
case "ucs-2":
case "utf16le":
case "utf-16le":
return 2 * i;

case "hex":
return i >>> 1;

case "base64":
return P(e).length;

default:
if (r) return B(e).length;
t = ("" + t).toLowerCase();
r = !0;
}
}
l.byteLength = u;
l.prototype._isBuffer = !0;
function p(e, t, i) {
var r = e[t];
e[t] = e[i];
e[i] = r;
}
l.prototype.swap16 = function() {
var e = this.length;
if (e % 2 != 0) throw new RangeError("Buffer size must be a multiple of 16-bits");
for (var t = 0; t < e; t += 2) p(this, t, t + 1);
return this;
};
l.prototype.swap32 = function() {
var e = this.length;
if (e % 4 != 0) throw new RangeError("Buffer size must be a multiple of 32-bits");
for (var t = 0; t < e; t += 4) {
p(this, t, t + 3);
p(this, t + 1, t + 2);
}
return this;
};
l.prototype.swap64 = function() {
var e = this.length;
if (e % 8 != 0) throw new RangeError("Buffer size must be a multiple of 64-bits");
for (var t = 0; t < e; t += 8) {
p(this, t, t + 7);
p(this, t + 1, t + 6);
p(this, t + 2, t + 5);
p(this, t + 3, t + 4);
}
return this;
};
l.prototype.toString = function() {
var e = 0 | this.length;
return 0 === e ? "" : 0 === arguments.length ? w(this, 0, e) : function(e, t, i) {
var r = !1;
(void 0 === t || t < 0) && (t = 0);
if (t > this.length) return "";
(void 0 === i || i > this.length) && (i = this.length);
if (i <= 0) return "";
if ((i >>>= 0) <= (t >>>= 0)) return "";
e || (e = "utf8");
for (;;) switch (e) {
case "hex":
return x(this, t, i);

case "utf8":
case "utf-8":
return w(this, t, i);

case "ascii":
return _(this, t, i);

case "latin1":
case "binary":
return I(this, t, i);

case "base64":
return v(this, t, i);

case "ucs2":
case "ucs-2":
case "utf16le":
case "utf-16le":
return C(this, t, i);

default:
if (r) throw new TypeError("Unknown encoding: " + e);
e = (e + "").toLowerCase();
r = !0;
}
}.apply(this, arguments);
};
l.prototype.equals = function(e) {
if (!l.isBuffer(e)) throw new TypeError("Argument must be a Buffer");
return this === e || 0 === l.compare(this, e);
};
l.prototype.inspect = function() {
var e = "", t = U.INSPECT_MAX_BYTES;
if (0 < this.length) {
e = this.toString("hex", 0, t).match(/.{2}/g).join(" ");
this.length > t && (e += " ... ");
}
return "<Buffer " + e + ">";
};
l.prototype.compare = function(e, t, i, r, n) {
if (!l.isBuffer(e)) throw new TypeError("Argument must be a Buffer");
void 0 === t && (t = 0);
void 0 === i && (i = e ? e.length : 0);
void 0 === r && (r = 0);
void 0 === n && (n = this.length);
if (t < 0 || i > e.length || r < 0 || n > this.length) throw new RangeError("out of range index");
if (n <= r && i <= t) return 0;
if (n <= r) return -1;
if (i <= t) return 1;
if (this === e) return 0;
for (var o = (n >>>= 0) - (r >>>= 0), a = (i >>>= 0) - (t >>>= 0), s = Math.min(o, a), c = this.slice(r, n), f = e.slice(t, i), h = 0; h < s; ++h) if (c[h] !== f[h]) {
o = c[h];
a = f[h];
break;
}
return o < a ? -1 : a < o ? 1 : 0;
};
function b(e, t, i, r, n) {
if (0 === e.length) return -1;
if ("string" == typeof i) {
r = i;
i = 0;
} else 2147483647 < i ? i = 2147483647 : i < -2147483648 && (i = -2147483648);
i = +i;
isNaN(i) && (i = n ? 0 : e.length - 1);
i < 0 && (i = e.length + i);
if (i >= e.length) {
if (n) return -1;
i = e.length - 1;
} else if (i < 0) {
if (!n) return -1;
i = 0;
}
"string" == typeof t && (t = l.from(t, r));
if (l.isBuffer(t)) return 0 === t.length ? -1 : m(e, t, i, r, n);
if ("number" == typeof t) {
t &= 255;
return l.TYPED_ARRAY_SUPPORT && "function" == typeof Uint8Array.prototype.indexOf ? n ? Uint8Array.prototype.indexOf.call(e, t, i) : Uint8Array.prototype.lastIndexOf.call(e, t, i) : m(e, [ t ], i, r, n);
}
throw new TypeError("val must be string, number or Buffer");
}
function m(e, t, i, r, n) {
var o, a = 1, s = e.length, c = t.length;
if (void 0 !== r && ("ucs2" === (r = String(r).toLowerCase()) || "ucs-2" === r || "utf16le" === r || "utf-16le" === r)) {
if (e.length < 2 || t.length < 2) return -1;
s /= a = 2;
c /= 2;
i /= 2;
}
function f(e, t) {
return 1 === a ? e[t] : e.readUInt16BE(t * a);
}
if (n) {
var h = -1;
for (o = i; o < s; o++) if (f(e, o) === f(t, -1 === h ? 0 : o - h)) {
-1 === h && (h = o);
if (o - h + 1 === c) return h * a;
} else {
-1 !== h && (o -= o - h);
h = -1;
}
} else {
s < i + c && (i = s - c);
for (o = i; 0 <= o; o--) {
for (var l = !0, d = 0; d < c; d++) if (f(e, o + d) !== f(t, d)) {
l = !1;
break;
}
if (l) return o;
}
}
return -1;
}
l.prototype.includes = function(e, t, i) {
return -1 !== this.indexOf(e, t, i);
};
l.prototype.indexOf = function(e, t, i) {
return b(this, e, t, i, !0);
};
l.prototype.lastIndexOf = function(e, t, i) {
return b(this, e, t, i, !1);
};
function g(e, t, i, r) {
i = Number(i) || 0;
var n = e.length - i;
r ? n < (r = Number(r)) && (r = n) : r = n;
var o = t.length;
if (o % 2 != 0) throw new TypeError("Invalid hex string");
o / 2 < r && (r = o / 2);
for (var a = 0; a < r; ++a) {
var s = parseInt(t.substr(2 * a, 2), 16);
if (isNaN(s)) return a;
e[i + a] = s;
}
return a;
}
function y(e, t, i, r) {
return L(function(e) {
for (var t = [], i = 0; i < e.length; ++i) t.push(255 & e.charCodeAt(i));
return t;
}(t), e, i, r);
}
l.prototype.write = function(e, t, i, r) {
if (void 0 === t) {
r = "utf8";
i = this.length;
t = 0;
} else if (void 0 === i && "string" == typeof t) {
r = t;
i = this.length;
t = 0;
} else {
if (!isFinite(t)) throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");
t |= 0;
if (isFinite(i)) {
i |= 0;
void 0 === r && (r = "utf8");
} else {
r = i;
i = void 0;
}
}
var n = this.length - t;
(void 0 === i || n < i) && (i = n);
if (0 < e.length && (i < 0 || t < 0) || t > this.length) throw new RangeError("Attempt to write outside buffer bounds");
r || (r = "utf8");
for (var o, a, s, c, f, h, l, d, u, p = !1; ;) switch (r) {
case "hex":
return g(this, e, t, i);

case "utf8":
case "utf-8":
return d = t, u = i, L(B(e, (l = this).length - d), l, d, u);

case "ascii":
return y(this, e, t, i);

case "latin1":
case "binary":
return y(this, e, t, i);

case "base64":
return c = this, f = t, h = i, L(P(e), c, f, h);

case "ucs2":
case "ucs-2":
case "utf16le":
case "utf-16le":
return a = t, s = i, L(function(e, t) {
for (var i, r, n, o = [], a = 0; a < e.length && !((t -= 2) < 0); ++a) {
i = e.charCodeAt(a);
r = i >> 8;
n = i % 256;
o.push(n);
o.push(r);
}
return o;
}(e, (o = this).length - a), o, a, s);

default:
if (p) throw new TypeError("Unknown encoding: " + r);
r = ("" + r).toLowerCase();
p = !0;
}
};
l.prototype.toJSON = function() {
return {
type: "Buffer",
data: Array.prototype.slice.call(this._arr || this, 0)
};
};
function v(e, t, i) {
return 0 === t && i === e.length ? r.fromByteArray(e) : r.fromByteArray(e.slice(t, i));
}
function w(e, t, i) {
i = Math.min(e.length, i);
for (var r = [], n = t; n < i; ) {
var o = e[n], a = null, s = 239 < o ? 4 : 223 < o ? 3 : 191 < o ? 2 : 1;
if (n + s <= i) {
var c, f, h, l;
switch (s) {
case 1:
o < 128 && (a = o);
break;

case 2:
128 == (192 & (c = e[n + 1])) && 127 < (l = (31 & o) << 6 | 63 & c) && (a = l);
break;

case 3:
c = e[n + 1];
f = e[n + 2];
128 == (192 & c) && 128 == (192 & f) && 2047 < (l = (15 & o) << 12 | (63 & c) << 6 | 63 & f) && (l < 55296 || 57343 < l) && (a = l);
break;

case 4:
c = e[n + 1];
f = e[n + 2];
h = e[n + 3];
128 == (192 & c) && 128 == (192 & f) && 128 == (192 & h) && 65535 < (l = (15 & o) << 18 | (63 & c) << 12 | (63 & f) << 6 | 63 & h) && l < 1114112 && (a = l);
}
}
if (null === a) {
a = 65533;
s = 1;
} else if (65535 < a) {
a -= 65536;
r.push(a >>> 10 & 1023 | 55296);
a = 56320 | 1023 & a;
}
r.push(a);
n += s;
}
return function(e) {
var t = e.length;
if (t <= S) return String.fromCharCode.apply(String, e);
var i = "", r = 0;
for (;r < t; ) i += String.fromCharCode.apply(String, e.slice(r, r += S));
return i;
}(r);
}
var S = 4096;
function _(e, t, i) {
var r = "";
i = Math.min(e.length, i);
for (var n = t; n < i; ++n) r += String.fromCharCode(127 & e[n]);
return r;
}
function I(e, t, i) {
var r = "";
i = Math.min(e.length, i);
for (var n = t; n < i; ++n) r += String.fromCharCode(e[n]);
return r;
}
function x(e, t, i) {
var r = e.length;
(!t || t < 0) && (t = 0);
(!i || i < 0 || r < i) && (i = r);
for (var n = "", o = t; o < i; ++o) n += N(e[o]);
return n;
}
function C(e, t, i) {
for (var r = e.slice(t, i), n = "", o = 0; o < r.length; o += 2) n += String.fromCharCode(r[o] + 256 * r[o + 1]);
return n;
}
l.prototype.slice = function(e, t) {
var i, r = this.length;
(e = ~~e) < 0 ? (e += r) < 0 && (e = 0) : r < e && (e = r);
(t = void 0 === t ? r : ~~t) < 0 ? (t += r) < 0 && (t = 0) : r < t && (t = r);
t < e && (t = e);
if (l.TYPED_ARRAY_SUPPORT) (i = this.subarray(e, t)).__proto__ = l.prototype; else {
var n = t - e;
i = new l(n, void 0);
for (var o = 0; o < n; ++o) i[o] = this[o + e];
}
return i;
};
function G(e, t, i) {
if (e % 1 != 0 || e < 0) throw new RangeError("offset is not uint");
if (i < e + t) throw new RangeError("Trying to access beyond buffer length");
}
l.prototype.readUIntLE = function(e, t, i) {
e |= 0;
t |= 0;
i || G(e, t, this.length);
for (var r = this[e], n = 1, o = 0; ++o < t && (n *= 256); ) r += this[e + o] * n;
return r;
};
l.prototype.readUIntBE = function(e, t, i) {
e |= 0;
t |= 0;
i || G(e, t, this.length);
for (var r = this[e + --t], n = 1; 0 < t && (n *= 256); ) r += this[e + --t] * n;
return r;
};
l.prototype.readUInt8 = function(e, t) {
t || G(e, 1, this.length);
return this[e];
};
l.prototype.readUInt16LE = function(e, t) {
t || G(e, 2, this.length);
return this[e] | this[e + 1] << 8;
};
l.prototype.readUInt16BE = function(e, t) {
t || G(e, 2, this.length);
return this[e] << 8 | this[e + 1];
};
l.prototype.readUInt32LE = function(e, t) {
t || G(e, 4, this.length);
return (this[e] | this[e + 1] << 8 | this[e + 2] << 16) + 16777216 * this[e + 3];
};
l.prototype.readUInt32BE = function(e, t) {
t || G(e, 4, this.length);
return 16777216 * this[e] + (this[e + 1] << 16 | this[e + 2] << 8 | this[e + 3]);
};
l.prototype.readIntLE = function(e, t, i) {
e |= 0;
t |= 0;
i || G(e, t, this.length);
for (var r = this[e], n = 1, o = 0; ++o < t && (n *= 256); ) r += this[e + o] * n;
(n *= 128) <= r && (r -= Math.pow(2, 8 * t));
return r;
};
l.prototype.readIntBE = function(e, t, i) {
e |= 0;
t |= 0;
i || G(e, t, this.length);
for (var r = t, n = 1, o = this[e + --r]; 0 < r && (n *= 256); ) o += this[e + --r] * n;
(n *= 128) <= o && (o -= Math.pow(2, 8 * t));
return o;
};
l.prototype.readInt8 = function(e, t) {
t || G(e, 1, this.length);
return 128 & this[e] ? -1 * (255 - this[e] + 1) : this[e];
};
l.prototype.readInt16LE = function(e, t) {
t || G(e, 2, this.length);
var i = this[e] | this[e + 1] << 8;
return 32768 & i ? 4294901760 | i : i;
};
l.prototype.readInt16BE = function(e, t) {
t || G(e, 2, this.length);
var i = this[e + 1] | this[e] << 8;
return 32768 & i ? 4294901760 | i : i;
};
l.prototype.readInt32LE = function(e, t) {
t || G(e, 4, this.length);
return this[e] | this[e + 1] << 8 | this[e + 2] << 16 | this[e + 3] << 24;
};
l.prototype.readInt32BE = function(e, t) {
t || G(e, 4, this.length);
return this[e] << 24 | this[e + 1] << 16 | this[e + 2] << 8 | this[e + 3];
};
l.prototype.readFloatLE = function(e, t) {
t || G(e, 4, this.length);
return o.read(this, e, !0, 23, 4);
};
l.prototype.readFloatBE = function(e, t) {
t || G(e, 4, this.length);
return o.read(this, e, !1, 23, 4);
};
l.prototype.readDoubleLE = function(e, t) {
t || G(e, 8, this.length);
return o.read(this, e, !0, 52, 8);
};
l.prototype.readDoubleBE = function(e, t) {
t || G(e, 8, this.length);
return o.read(this, e, !1, 52, 8);
};
function A(e, t, i, r, n, o) {
if (!l.isBuffer(e)) throw new TypeError('"buffer" argument must be a Buffer instance');
if (n < t || t < o) throw new RangeError('"value" argument is out of bounds');
if (i + r > e.length) throw new RangeError("Index out of range");
}
l.prototype.writeUIntLE = function(e, t, i, r) {
e = +e;
t |= 0;
i |= 0;
if (!r) {
A(this, e, t, i, Math.pow(2, 8 * i) - 1, 0);
}
var n = 1, o = 0;
this[t] = 255 & e;
for (;++o < i && (n *= 256); ) this[t + o] = e / n & 255;
return t + i;
};
l.prototype.writeUIntBE = function(e, t, i, r) {
e = +e;
t |= 0;
i |= 0;
if (!r) {
A(this, e, t, i, Math.pow(2, 8 * i) - 1, 0);
}
var n = i - 1, o = 1;
this[t + n] = 255 & e;
for (;0 <= --n && (o *= 256); ) this[t + n] = e / o & 255;
return t + i;
};
l.prototype.writeUInt8 = function(e, t, i) {
e = +e;
t |= 0;
i || A(this, e, t, 1, 255, 0);
l.TYPED_ARRAY_SUPPORT || (e = Math.floor(e));
this[t] = 255 & e;
return t + 1;
};
function k(e, t, i, r) {
t < 0 && (t = 65535 + t + 1);
for (var n = 0, o = Math.min(e.length - i, 2); n < o; ++n) e[i + n] = (t & 255 << 8 * (r ? n : 1 - n)) >>> 8 * (r ? n : 1 - n);
}
l.prototype.writeUInt16LE = function(e, t, i) {
e = +e;
t |= 0;
i || A(this, e, t, 2, 65535, 0);
if (l.TYPED_ARRAY_SUPPORT) {
this[t] = 255 & e;
this[t + 1] = e >>> 8;
} else k(this, e, t, !0);
return t + 2;
};
l.prototype.writeUInt16BE = function(e, t, i) {
e = +e;
t |= 0;
i || A(this, e, t, 2, 65535, 0);
if (l.TYPED_ARRAY_SUPPORT) {
this[t] = e >>> 8;
this[t + 1] = 255 & e;
} else k(this, e, t, !1);
return t + 2;
};
function T(e, t, i, r) {
t < 0 && (t = 4294967295 + t + 1);
for (var n = 0, o = Math.min(e.length - i, 4); n < o; ++n) e[i + n] = t >>> 8 * (r ? n : 3 - n) & 255;
}
l.prototype.writeUInt32LE = function(e, t, i) {
e = +e;
t |= 0;
i || A(this, e, t, 4, 4294967295, 0);
if (l.TYPED_ARRAY_SUPPORT) {
this[t + 3] = e >>> 24;
this[t + 2] = e >>> 16;
this[t + 1] = e >>> 8;
this[t] = 255 & e;
} else T(this, e, t, !0);
return t + 4;
};
l.prototype.writeUInt32BE = function(e, t, i) {
e = +e;
t |= 0;
i || A(this, e, t, 4, 4294967295, 0);
if (l.TYPED_ARRAY_SUPPORT) {
this[t] = e >>> 24;
this[t + 1] = e >>> 16;
this[t + 2] = e >>> 8;
this[t + 3] = 255 & e;
} else T(this, e, t, !1);
return t + 4;
};
l.prototype.writeIntLE = function(e, t, i, r) {
e = +e;
t |= 0;
if (!r) {
var n = Math.pow(2, 8 * i - 1);
A(this, e, t, i, n - 1, -n);
}
var o = 0, a = 1, s = 0;
this[t] = 255 & e;
for (;++o < i && (a *= 256); ) {
e < 0 && 0 === s && 0 !== this[t + o - 1] && (s = 1);
this[t + o] = (e / a >> 0) - s & 255;
}
return t + i;
};
l.prototype.writeIntBE = function(e, t, i, r) {
e = +e;
t |= 0;
if (!r) {
var n = Math.pow(2, 8 * i - 1);
A(this, e, t, i, n - 1, -n);
}
var o = i - 1, a = 1, s = 0;
this[t + o] = 255 & e;
for (;0 <= --o && (a *= 256); ) {
e < 0 && 0 === s && 0 !== this[t + o + 1] && (s = 1);
this[t + o] = (e / a >> 0) - s & 255;
}
return t + i;
};
l.prototype.writeInt8 = function(e, t, i) {
e = +e;
t |= 0;
i || A(this, e, t, 1, 127, -128);
l.TYPED_ARRAY_SUPPORT || (e = Math.floor(e));
e < 0 && (e = 255 + e + 1);
this[t] = 255 & e;
return t + 1;
};
l.prototype.writeInt16LE = function(e, t, i) {
e = +e;
t |= 0;
i || A(this, e, t, 2, 32767, -32768);
if (l.TYPED_ARRAY_SUPPORT) {
this[t] = 255 & e;
this[t + 1] = e >>> 8;
} else k(this, e, t, !0);
return t + 2;
};
l.prototype.writeInt16BE = function(e, t, i) {
e = +e;
t |= 0;
i || A(this, e, t, 2, 32767, -32768);
if (l.TYPED_ARRAY_SUPPORT) {
this[t] = e >>> 8;
this[t + 1] = 255 & e;
} else k(this, e, t, !1);
return t + 2;
};
l.prototype.writeInt32LE = function(e, t, i) {
e = +e;
t |= 0;
i || A(this, e, t, 4, 2147483647, -2147483648);
if (l.TYPED_ARRAY_SUPPORT) {
this[t] = 255 & e;
this[t + 1] = e >>> 8;
this[t + 2] = e >>> 16;
this[t + 3] = e >>> 24;
} else T(this, e, t, !0);
return t + 4;
};
l.prototype.writeInt32BE = function(e, t, i) {
e = +e;
t |= 0;
i || A(this, e, t, 4, 2147483647, -2147483648);
e < 0 && (e = 4294967295 + e + 1);
if (l.TYPED_ARRAY_SUPPORT) {
this[t] = e >>> 24;
this[t + 1] = e >>> 16;
this[t + 2] = e >>> 8;
this[t + 3] = 255 & e;
} else T(this, e, t, !1);
return t + 4;
};
function E(e, t, i, r, n, o) {
if (i + r > e.length) throw new RangeError("Index out of range");
if (i < 0) throw new RangeError("Index out of range");
}
function M(e, t, i, r, n) {
n || E(e, 0, i, 4);
o.write(e, t, i, r, 23, 4);
return i + 4;
}
l.prototype.writeFloatLE = function(e, t, i) {
return M(this, e, t, !0, i);
};
l.prototype.writeFloatBE = function(e, t, i) {
return M(this, e, t, !1, i);
};
function D(e, t, i, r, n) {
n || E(e, 0, i, 8);
o.write(e, t, i, r, 52, 8);
return i + 8;
}
l.prototype.writeDoubleLE = function(e, t, i) {
return D(this, e, t, !0, i);
};
l.prototype.writeDoubleBE = function(e, t, i) {
return D(this, e, t, !1, i);
};
l.prototype.copy = function(e, t, i, r) {
i || (i = 0);
r || 0 === r || (r = this.length);
t >= e.length && (t = e.length);
t || (t = 0);
0 < r && r < i && (r = i);
if (r === i) return 0;
if (0 === e.length || 0 === this.length) return 0;
if (t < 0) throw new RangeError("targetStart out of bounds");
if (i < 0 || i >= this.length) throw new RangeError("sourceStart out of bounds");
if (r < 0) throw new RangeError("sourceEnd out of bounds");
r > this.length && (r = this.length);
e.length - t < r - i && (r = e.length - t + i);
var n, o = r - i;
if (this === e && i < t && t < r) for (n = o - 1; 0 <= n; --n) e[n + t] = this[n + i]; else if (o < 1e3 || !l.TYPED_ARRAY_SUPPORT) for (n = 0; n < o; ++n) e[n + t] = this[n + i]; else Uint8Array.prototype.set.call(e, this.subarray(i, i + o), t);
return o;
};
l.prototype.fill = function(e, t, i, r) {
if ("string" == typeof e) {
if ("string" == typeof t) {
r = t;
t = 0;
i = this.length;
} else if ("string" == typeof i) {
r = i;
i = this.length;
}
if (1 === e.length) {
var n = e.charCodeAt(0);
n < 256 && (e = n);
}
if (void 0 !== r && "string" != typeof r) throw new TypeError("encoding must be a string");
if ("string" == typeof r && !l.isEncoding(r)) throw new TypeError("Unknown encoding: " + r);
} else "number" == typeof e && (e &= 255);
if (t < 0 || this.length < t || this.length < i) throw new RangeError("Out of range index");
if (i <= t) return this;
t >>>= 0;
i = void 0 === i ? this.length : i >>> 0;
e || (e = 0);
var o;
if ("number" == typeof e) for (o = t; o < i; ++o) this[o] = e; else {
var a = l.isBuffer(e) ? e : B(new l(e, r).toString()), s = a.length;
for (o = 0; o < i - t; ++o) this[o + t] = a[o % s];
}
return this;
};
var R = /[^+\/0-9A-Za-z-_]/g;
function N(e) {
return e < 16 ? "0" + e.toString(16) : e.toString(16);
}
function B(e, t) {
t = t || Infinity;
for (var i, r = e.length, n = null, o = [], a = 0; a < r; ++a) {
if (55295 < (i = e.charCodeAt(a)) && i < 57344) {
if (!n) {
if (56319 < i) {
-1 < (t -= 3) && o.push(239, 191, 189);
continue;
}
if (a + 1 === r) {
-1 < (t -= 3) && o.push(239, 191, 189);
continue;
}
n = i;
continue;
}
if (i < 56320) {
-1 < (t -= 3) && o.push(239, 191, 189);
n = i;
continue;
}
i = 65536 + (n - 55296 << 10 | i - 56320);
} else n && -1 < (t -= 3) && o.push(239, 191, 189);
n = null;
if (i < 128) {
if ((t -= 1) < 0) break;
o.push(i);
} else if (i < 2048) {
if ((t -= 2) < 0) break;
o.push(i >> 6 | 192, 63 & i | 128);
} else if (i < 65536) {
if ((t -= 3) < 0) break;
o.push(i >> 12 | 224, i >> 6 & 63 | 128, 63 & i | 128);
} else {
if (!(i < 1114112)) throw new Error("Invalid code point");
if ((t -= 4) < 0) break;
o.push(i >> 18 | 240, i >> 12 & 63 | 128, i >> 6 & 63 | 128, 63 & i | 128);
}
}
return o;
}
function P(e) {
return r.toByteArray(function(e) {
var t;
if ((e = (t = e, t.trim ? t.trim() : t.replace(/^\s+|\s+$/g, "")).replace(R, "")).length < 2) return "";
for (;e.length % 4 != 0; ) e += "=";
return e;
}(e));
}
function L(e, t, i, r) {
for (var n = 0; n < r && !(n + i >= t.length || n >= e.length); ++n) t[n + i] = e[n];
return n;
}
}).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {});
}, {
"base64-js": 15,
ieee754: 99,
isarray: 48
} ],
48: [ function(e, t, i) {
var r = {}.toString;
t.exports = Array.isArray || function(e) {
return "[object Array]" == r.call(e);
};
}, {} ],
49: [ function(e, t, i) {
var n = e("safe-buffer").Buffer, r = e("stream").Transform, o = e("string_decoder").StringDecoder;
function a(e) {
r.call(this);
this.hashMode = "string" == typeof e;
this.hashMode ? this[e] = this._finalOrDigest : this.final = this._finalOrDigest;
if (this._final) {
this.__final = this._final;
this._final = null;
}
this._decoder = null;
this._encoding = null;
}
e("inherits")(a, r);
a.prototype.update = function(e, t, i) {
"string" == typeof e && (e = n.from(e, t));
var r = this._update(e);
if (this.hashMode) return this;
i && (r = this._toString(r, i));
return r;
};
a.prototype.setAutoPadding = function() {};
a.prototype.getAuthTag = function() {
throw new Error("trying to get auth tag in unsupported state");
};
a.prototype.setAuthTag = function() {
throw new Error("trying to set auth tag in unsupported state");
};
a.prototype.setAAD = function() {
throw new Error("trying to set aad in unsupported state");
};
a.prototype._transform = function(e, t, i) {
var r;
try {
this.hashMode ? this._update(e) : this.push(this._update(e));
} catch (e) {
r = e;
} finally {
i(r);
}
};
a.prototype._flush = function(e) {
var t;
try {
this.push(this.__final());
} catch (e) {
t = e;
}
e(t);
};
a.prototype._finalOrDigest = function(e) {
var t = this.__final() || n.alloc(0);
e && (t = this._toString(t, e, !0));
return t;
};
a.prototype._toString = function(e, t, i) {
if (!this._decoder) {
this._decoder = new o(t);
this._encoding = t;
}
if (this._encoding !== t) throw new Error("can't switch encodings");
var r = this._decoder.write(e);
i && (r += this._decoder.end());
return r;
};
t.exports = a;
}, {
inherits: 101,
"safe-buffer": 144,
stream: 153,
string_decoder: 154
} ],
50: [ function(e, t, i) {
(function(e) {
i.isArray = function(e) {
return Array.isArray ? Array.isArray(e) : "[object Array]" === t(e);
};
i.isBoolean = function(e) {
return "boolean" == typeof e;
};
i.isNull = function(e) {
return null === e;
};
i.isNullOrUndefined = function(e) {
return null == e;
};
i.isNumber = function(e) {
return "number" == typeof e;
};
i.isString = function(e) {
return "string" == typeof e;
};
i.isSymbol = function(e) {
return "symbol" == typeof e;
};
i.isUndefined = function(e) {
return void 0 === e;
};
i.isRegExp = function(e) {
return "[object RegExp]" === t(e);
};
i.isObject = function(e) {
return "object" == typeof e && null !== e;
};
i.isDate = function(e) {
return "[object Date]" === t(e);
};
i.isError = function(e) {
return "[object Error]" === t(e) || e instanceof Error;
};
i.isFunction = function(e) {
return "function" == typeof e;
};
i.isPrimitive = function(e) {
return null === e || "boolean" == typeof e || "number" == typeof e || "string" == typeof e || "symbol" == typeof e || "undefined" == typeof e;
};
i.isBuffer = e.isBuffer;
function t(e) {
return Object.prototype.toString.call(e);
}
}).call(this, {
isBuffer: e("../../is-buffer/index.js")
});
}, {
"../../is-buffer/index.js": 102
} ],
51: [ function(e, s, t) {
(function(o) {
var t = e("elliptic"), r = e("bn.js");
s.exports = function(e) {
return new n(e);
};
var i = {
secp256k1: {
name: "secp256k1",
byteLength: 32
},
secp224r1: {
name: "p224",
byteLength: 28
},
prime256v1: {
name: "p256",
byteLength: 32
},
prime192v1: {
name: "p192",
byteLength: 24
},
ed25519: {
name: "ed25519",
byteLength: 32
},
secp384r1: {
name: "p384",
byteLength: 48
},
secp521r1: {
name: "p521",
byteLength: 66
}
};
i.p224 = i.secp224r1;
i.p256 = i.secp256r1 = i.prime256v1;
i.p192 = i.secp192r1 = i.prime192v1;
i.p384 = i.secp384r1;
i.p521 = i.secp521r1;
function n(e) {
this.curveType = i[e];
this.curveType || (this.curveType = {
name: e
});
this.curve = new t.ec(this.curveType.name);
this.keys = void 0;
}
n.prototype.generateKeys = function(e, t) {
this.keys = this.curve.genKeyPair();
return this.getPublicKey(e, t);
};
n.prototype.computeSecret = function(e, t, i) {
t = t || "utf8";
o.isBuffer(e) || (e = new o(e, t));
return a(this.curve.keyFromPublic(e).getPublic().mul(this.keys.getPrivate()).getX(), i, this.curveType.byteLength);
};
n.prototype.getPublicKey = function(e, t) {
var i = this.keys.getPublic("compressed" === t, !0);
"hybrid" === t && (i[i.length - 1] % 2 ? i[0] = 7 : i[0] = 6);
return a(i, e);
};
n.prototype.getPrivateKey = function(e) {
return a(this.keys.getPrivate(), e);
};
n.prototype.setPublicKey = function(e, t) {
t = t || "utf8";
o.isBuffer(e) || (e = new o(e, t));
this.keys._importPublic(e);
return this;
};
n.prototype.setPrivateKey = function(e, t) {
t = t || "utf8";
o.isBuffer(e) || (e = new o(e, t));
var i = new r(e);
i = i.toString(16);
this.keys._importPrivate(i);
return this;
};
function a(e, t, i) {
Array.isArray(e) || (e = e.toArray());
var r = new o(e);
if (i && r.length < i) {
var n = new o(i - r.length);
n.fill(0);
r = o.concat([ n, r ]);
}
return t ? r.toString(t) : r;
}
}).call(this, e("buffer").Buffer);
}, {
"bn.js": 16,
buffer: 47,
elliptic: 67
} ],
52: [ function(e, t, i) {
"use strict";
var r = e("inherits"), n = e("md5.js"), o = e("ripemd160"), a = e("sha.js"), s = e("cipher-base");
function c(e) {
s.call(this, "digest");
this._hash = e;
}
r(c, s);
c.prototype._update = function(e) {
this._hash.update(e);
};
c.prototype._final = function() {
return this._hash.digest();
};
t.exports = function(e) {
return "md5" === (e = e.toLowerCase()) ? new n() : "rmd160" === e || "ripemd160" === e ? new o() : new c(a(e));
};
}, {
"cipher-base": 49,
inherits: 101,
"md5.js": 103,
ripemd160: 142,
"sha.js": 146
} ],
53: [ function(e, t, i) {
var r = e("md5.js");
t.exports = function(e) {
return new r().update(e).digest();
};
}, {
"md5.js": 103
} ],
54: [ function(e, t, i) {
"use strict";
var r = e("inherits"), n = e("./legacy"), a = e("cipher-base"), s = e("safe-buffer").Buffer, o = e("create-hash/md5"), c = e("ripemd160"), f = e("sha.js"), h = s.alloc(128);
function l(e, t) {
a.call(this, "digest");
"string" == typeof t && (t = s.from(t));
var i = "sha512" === e || "sha384" === e ? 128 : 64;
this._alg = e;
if ((this._key = t).length > i) {
t = ("rmd160" === e ? new c() : f(e)).update(t).digest();
} else t.length < i && (t = s.concat([ t, h ], i));
for (var r = this._ipad = s.allocUnsafe(i), n = this._opad = s.allocUnsafe(i), o = 0; o < i; o++) {
r[o] = 54 ^ t[o];
n[o] = 92 ^ t[o];
}
this._hash = "rmd160" === e ? new c() : f(e);
this._hash.update(r);
}
r(l, a);
l.prototype._update = function(e) {
this._hash.update(e);
};
l.prototype._final = function() {
var e = this._hash.digest();
return ("rmd160" === this._alg ? new c() : f(this._alg)).update(this._opad).update(e).digest();
};
t.exports = function(e, t) {
return "rmd160" === (e = e.toLowerCase()) || "ripemd160" === e ? new l("rmd160", t) : "md5" === e ? new n(o, t) : new l(e, t);
};
}, {
"./legacy": 55,
"cipher-base": 49,
"create-hash/md5": 53,
inherits: 101,
ripemd160: 142,
"safe-buffer": 144,
"sha.js": 146
} ],
55: [ function(e, t, i) {
"use strict";
var r = e("inherits"), o = e("safe-buffer").Buffer, a = e("cipher-base"), s = o.alloc(128), c = 64;
function n(e, t) {
a.call(this, "digest");
"string" == typeof t && (t = o.from(t));
this._alg = e;
(this._key = t).length > c ? t = e(t) : t.length < c && (t = o.concat([ t, s ], c));
for (var i = this._ipad = o.allocUnsafe(c), r = this._opad = o.allocUnsafe(c), n = 0; n < c; n++) {
i[n] = 54 ^ t[n];
r[n] = 92 ^ t[n];
}
this._hash = [ i ];
}
r(n, a);
n.prototype._update = function(e) {
this._hash.push(e);
};
n.prototype._final = function() {
var e = this._alg(o.concat(this._hash));
return this._alg(o.concat([ this._opad, e ]));
};
t.exports = n;
}, {
"cipher-base": 49,
inherits: 101,
"safe-buffer": 144
} ],
56: [ function(e, t, i) {
"use strict";
i.randomBytes = i.rng = i.pseudoRandomBytes = i.prng = e("randombytes");
i.createHash = i.Hash = e("create-hash");
i.createHmac = i.Hmac = e("create-hmac");
var r = e("browserify-sign/algos"), n = Object.keys(r), o = [ "sha1", "sha224", "sha256", "sha384", "sha512", "md5", "rmd160" ].concat(n);
i.getHashes = function() {
return o;
};
var a = e("pbkdf2");
i.pbkdf2 = a.pbkdf2;
i.pbkdf2Sync = a.pbkdf2Sync;
var s = e("browserify-cipher");
i.Cipher = s.Cipher;
i.createCipher = s.createCipher;
i.Cipheriv = s.Cipheriv;
i.createCipheriv = s.createCipheriv;
i.Decipher = s.Decipher;
i.createDecipher = s.createDecipher;
i.Decipheriv = s.Decipheriv;
i.createDecipheriv = s.createDecipheriv;
i.getCiphers = s.getCiphers;
i.listCiphers = s.listCiphers;
var c = e("diffie-hellman");
i.DiffieHellmanGroup = c.DiffieHellmanGroup;
i.createDiffieHellmanGroup = c.createDiffieHellmanGroup;
i.getDiffieHellman = c.getDiffieHellman;
i.createDiffieHellman = c.createDiffieHellman;
i.DiffieHellman = c.DiffieHellman;
var f = e("browserify-sign");
i.createSign = f.createSign;
i.Sign = f.Sign;
i.createVerify = f.createVerify;
i.Verify = f.Verify;
i.createECDH = e("create-ecdh");
var h = e("public-encrypt");
i.publicEncrypt = h.publicEncrypt;
i.privateEncrypt = h.privateEncrypt;
i.publicDecrypt = h.publicDecrypt;
i.privateDecrypt = h.privateDecrypt;
var l = e("randomfill");
i.randomFill = l.randomFill;
i.randomFillSync = l.randomFillSync;
i.createCredentials = function() {
throw new Error([ "sorry, createCredentials is not implemented yet", "we accept pull requests", "https://github.com/crypto-browserify/crypto-browserify" ].join("\n"));
};
i.constants = {
DH_CHECK_P_NOT_SAFE_PRIME: 2,
DH_CHECK_P_NOT_PRIME: 1,
DH_UNABLE_TO_CHECK_GENERATOR: 4,
DH_NOT_SUITABLE_GENERATOR: 8,
NPN_ENABLED: 1,
ALPN_ENABLED: 1,
RSA_PKCS1_PADDING: 1,
RSA_SSLV23_PADDING: 2,
RSA_NO_PADDING: 3,
RSA_PKCS1_OAEP_PADDING: 4,
RSA_X931_PADDING: 5,
RSA_PKCS1_PSS_PADDING: 6,
POINT_CONVERSION_COMPRESSED: 2,
POINT_CONVERSION_UNCOMPRESSED: 4,
POINT_CONVERSION_HYBRID: 6
};
}, {
"browserify-cipher": 36,
"browserify-sign": 43,
"browserify-sign/algos": 40,
"create-ecdh": 51,
"create-hash": 52,
"create-hmac": 54,
"diffie-hellman": 63,
pbkdf2: 112,
"public-encrypt": 119,
randombytes: 125,
randomfill: 126
} ],
57: [ function(e, t, i) {
"use strict";
i.utils = e("./des/utils");
i.Cipher = e("./des/cipher");
i.DES = e("./des/des");
i.CBC = e("./des/cbc");
i.EDE = e("./des/ede");
}, {
"./des/cbc": 58,
"./des/cipher": 59,
"./des/des": 60,
"./des/ede": 61,
"./des/utils": 62
} ],
58: [ function(e, t, i) {
"use strict";
var r = e("minimalistic-assert"), o = e("inherits"), a = {};
function n(e) {
r.equal(e.length, 8, "Invalid IV length");
this.iv = new Array(8);
for (var t = 0; t < this.iv.length; t++) this.iv[t] = e[t];
}
i.instantiate = function(t) {
function i(e) {
t.call(this, e);
this._cbcInit();
}
o(i, t);
for (var e = Object.keys(a), r = 0; r < e.length; r++) {
var n = e[r];
i.prototype[n] = a[n];
}
i.create = function(e) {
return new i(e);
};
return i;
};
a._cbcInit = function() {
var e = new n(this.options.iv);
this._cbcState = e;
};
a._update = function(e, t, i, r) {
var n = this._cbcState, o = this.constructor.super_.prototype, a = n.iv;
if ("encrypt" === this.type) {
for (var s = 0; s < this.blockSize; s++) a[s] ^= e[t + s];
o._update.call(this, a, 0, i, r);
for (s = 0; s < this.blockSize; s++) a[s] = i[r + s];
} else {
o._update.call(this, e, t, i, r);
for (s = 0; s < this.blockSize; s++) i[r + s] ^= a[s];
for (s = 0; s < this.blockSize; s++) a[s] = e[t + s];
}
};
}, {
inherits: 101,
"minimalistic-assert": 105
} ],
59: [ function(e, t, i) {
"use strict";
var r = e("minimalistic-assert");
function n(e) {
this.options = e;
this.type = this.options.type;
this.blockSize = 8;
this._init();
this.buffer = new Array(this.blockSize);
this.bufferOff = 0;
}
(t.exports = n).prototype._init = function() {};
n.prototype.update = function(e) {
return 0 === e.length ? [] : "decrypt" === this.type ? this._updateDecrypt(e) : this._updateEncrypt(e);
};
n.prototype._buffer = function(e, t) {
for (var i = Math.min(this.buffer.length - this.bufferOff, e.length - t), r = 0; r < i; r++) this.buffer[this.bufferOff + r] = e[t + r];
this.bufferOff += i;
return i;
};
n.prototype._flushBuffer = function(e, t) {
this._update(this.buffer, 0, e, t);
this.bufferOff = 0;
return this.blockSize;
};
n.prototype._updateEncrypt = function(e) {
var t = 0, i = 0, r = (this.bufferOff + e.length) / this.blockSize | 0, n = new Array(r * this.blockSize);
if (0 !== this.bufferOff) {
t += this._buffer(e, t);
this.bufferOff === this.buffer.length && (i += this._flushBuffer(n, i));
}
for (var o = e.length - (e.length - t) % this.blockSize; t < o; t += this.blockSize) {
this._update(e, t, n, i);
i += this.blockSize;
}
for (;t < e.length; t++, this.bufferOff++) this.buffer[this.bufferOff] = e[t];
return n;
};
n.prototype._updateDecrypt = function(e) {
for (var t = 0, i = 0, r = Math.ceil((this.bufferOff + e.length) / this.blockSize) - 1, n = new Array(r * this.blockSize); 0 < r; r--) {
t += this._buffer(e, t);
i += this._flushBuffer(n, i);
}
t += this._buffer(e, t);
return n;
};
n.prototype.final = function(e) {
var t, i;
e && (t = this.update(e));
i = "encrypt" === this.type ? this._finalEncrypt() : this._finalDecrypt();
return t ? t.concat(i) : i;
};
n.prototype._pad = function(e, t) {
if (0 === t) return !1;
for (;t < e.length; ) e[t++] = 0;
return !0;
};
n.prototype._finalEncrypt = function() {
if (!this._pad(this.buffer, this.bufferOff)) return [];
var e = new Array(this.blockSize);
this._update(this.buffer, 0, e, 0);
return e;
};
n.prototype._unpad = function(e) {
return e;
};
n.prototype._finalDecrypt = function() {
r.equal(this.bufferOff, this.blockSize, "Not enough data to decrypt");
var e = new Array(this.blockSize);
this._flushBuffer(e, 0);
return this._unpad(e);
};
}, {
"minimalistic-assert": 105
} ],
60: [ function(e, t, i) {
"use strict";
var a = e("minimalistic-assert"), r = e("inherits"), n = e("../des"), d = n.utils, o = n.Cipher;
function s() {
this.tmp = new Array(2);
this.keys = null;
}
function c(e) {
o.call(this, e);
var t = new s();
this._desState = t;
this.deriveKeys(t, e.key);
}
r(c, o);
(t.exports = c).create = function(e) {
return new c(e);
};
var f = [ 1, 1, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1 ];
c.prototype.deriveKeys = function(e, t) {
e.keys = new Array(32);
a.equal(t.length, this.blockSize, "Invalid key length");
var i = d.readUInt32BE(t, 0), r = d.readUInt32BE(t, 4);
d.pc1(i, r, e.tmp, 0);
i = e.tmp[0];
r = e.tmp[1];
for (var n = 0; n < e.keys.length; n += 2) {
var o = f[n >>> 1];
i = d.r28shl(i, o);
r = d.r28shl(r, o);
d.pc2(i, r, e.keys, n);
}
};
c.prototype._update = function(e, t, i, r) {
var n = this._desState, o = d.readUInt32BE(e, t), a = d.readUInt32BE(e, t + 4);
d.ip(o, a, n.tmp, 0);
o = n.tmp[0];
a = n.tmp[1];
"encrypt" === this.type ? this._encrypt(n, o, a, n.tmp, 0) : this._decrypt(n, o, a, n.tmp, 0);
o = n.tmp[0];
a = n.tmp[1];
d.writeUInt32BE(i, o, r);
d.writeUInt32BE(i, a, r + 4);
};
c.prototype._pad = function(e, t) {
for (var i = e.length - t, r = t; r < e.length; r++) e[r] = i;
return !0;
};
c.prototype._unpad = function(e) {
for (var t = e[e.length - 1], i = e.length - t; i < e.length; i++) a.equal(e[i], t);
return e.slice(0, e.length - t);
};
c.prototype._encrypt = function(e, t, i, r, n) {
for (var o = t, a = i, s = 0; s < e.keys.length; s += 2) {
var c = e.keys[s], f = e.keys[s + 1];
d.expand(a, e.tmp, 0);
c ^= e.tmp[0];
f ^= e.tmp[1];
var h = d.substitute(c, f), l = a;
a = (o ^ d.permute(h)) >>> 0;
o = l;
}
d.rip(a, o, r, n);
};
c.prototype._decrypt = function(e, t, i, r, n) {
for (var o = i, a = t, s = e.keys.length - 2; 0 <= s; s -= 2) {
var c = e.keys[s], f = e.keys[s + 1];
d.expand(o, e.tmp, 0);
c ^= e.tmp[0];
f ^= e.tmp[1];
var h = d.substitute(c, f), l = o;
o = (a ^ d.permute(h)) >>> 0;
a = l;
}
d.rip(o, a, r, n);
};
}, {
"../des": 57,
inherits: 101,
"minimalistic-assert": 105
} ],
61: [ function(e, t, i) {
"use strict";
var o = e("minimalistic-assert"), r = e("inherits"), n = e("../des"), a = n.Cipher, s = n.DES;
function c(e, t) {
o.equal(t.length, 24, "Invalid key length");
var i = t.slice(0, 8), r = t.slice(8, 16), n = t.slice(16, 24);
this.ciphers = "encrypt" === e ? [ s.create({
type: "encrypt",
key: i
}), s.create({
type: "decrypt",
key: r
}), s.create({
type: "encrypt",
key: n
}) ] : [ s.create({
type: "decrypt",
key: n
}), s.create({
type: "encrypt",
key: r
}), s.create({
type: "decrypt",
key: i
}) ];
}
function f(e) {
a.call(this, e);
var t = new c(this.type, this.options.key);
this._edeState = t;
}
r(f, a);
(t.exports = f).create = function(e) {
return new f(e);
};
f.prototype._update = function(e, t, i, r) {
var n = this._edeState;
n.ciphers[0]._update(e, t, i, r);
n.ciphers[1]._update(i, r, i, r);
n.ciphers[2]._update(i, r, i, r);
};
f.prototype._pad = s.prototype._pad;
f.prototype._unpad = s.prototype._unpad;
}, {
"../des": 57,
inherits: 101,
"minimalistic-assert": 105
} ],
62: [ function(e, t, i) {
"use strict";
i.readUInt32BE = function(e, t) {
return (e[0 + t] << 24 | e[1 + t] << 16 | e[2 + t] << 8 | e[3 + t]) >>> 0;
};
i.writeUInt32BE = function(e, t, i) {
e[0 + i] = t >>> 24;
e[1 + i] = t >>> 16 & 255;
e[2 + i] = t >>> 8 & 255;
e[3 + i] = 255 & t;
};
i.ip = function(e, t, i, r) {
for (var n = 0, o = 0, a = 6; 0 <= a; a -= 2) {
for (var s = 0; s <= 24; s += 8) {
n <<= 1;
n |= t >>> s + a & 1;
}
for (s = 0; s <= 24; s += 8) {
n <<= 1;
n |= e >>> s + a & 1;
}
}
for (a = 6; 0 <= a; a -= 2) {
for (s = 1; s <= 25; s += 8) {
o <<= 1;
o |= t >>> s + a & 1;
}
for (s = 1; s <= 25; s += 8) {
o <<= 1;
o |= e >>> s + a & 1;
}
}
i[r + 0] = n >>> 0;
i[r + 1] = o >>> 0;
};
i.rip = function(e, t, i, r) {
for (var n = 0, o = 0, a = 0; a < 4; a++) for (var s = 24; 0 <= s; s -= 8) {
n <<= 1;
n |= t >>> s + a & 1;
n <<= 1;
n |= e >>> s + a & 1;
}
for (a = 4; a < 8; a++) for (s = 24; 0 <= s; s -= 8) {
o <<= 1;
o |= t >>> s + a & 1;
o <<= 1;
o |= e >>> s + a & 1;
}
i[r + 0] = n >>> 0;
i[r + 1] = o >>> 0;
};
i.pc1 = function(e, t, i, r) {
for (var n = 0, o = 0, a = 7; 5 <= a; a--) {
for (var s = 0; s <= 24; s += 8) {
n <<= 1;
n |= t >> s + a & 1;
}
for (s = 0; s <= 24; s += 8) {
n <<= 1;
n |= e >> s + a & 1;
}
}
for (s = 0; s <= 24; s += 8) {
n <<= 1;
n |= t >> s + a & 1;
}
for (a = 1; a <= 3; a++) {
for (s = 0; s <= 24; s += 8) {
o <<= 1;
o |= t >> s + a & 1;
}
for (s = 0; s <= 24; s += 8) {
o <<= 1;
o |= e >> s + a & 1;
}
}
for (s = 0; s <= 24; s += 8) {
o <<= 1;
o |= e >> s + a & 1;
}
i[r + 0] = n >>> 0;
i[r + 1] = o >>> 0;
};
i.r28shl = function(e, t) {
return e << t & 268435455 | e >>> 28 - t;
};
var c = [ 14, 11, 17, 4, 27, 23, 25, 0, 13, 22, 7, 18, 5, 9, 16, 24, 2, 20, 12, 21, 1, 8, 15, 26, 15, 4, 25, 19, 9, 1, 26, 16, 5, 11, 23, 8, 12, 7, 17, 0, 22, 3, 10, 14, 6, 20, 27, 24 ];
i.pc2 = function(e, t, i, r) {
for (var n = 0, o = 0, a = c.length >>> 1, s = 0; s < a; s++) {
n <<= 1;
n |= e >>> c[s] & 1;
}
for (s = a; s < c.length; s++) {
o <<= 1;
o |= t >>> c[s] & 1;
}
i[r + 0] = n >>> 0;
i[r + 1] = o >>> 0;
};
i.expand = function(e, t, i) {
var r = 0, n = 0;
r = (1 & e) << 5 | e >>> 27;
for (var o = 23; 15 <= o; o -= 4) {
r <<= 6;
r |= e >>> o & 63;
}
for (o = 11; 3 <= o; o -= 4) {
n |= e >>> o & 63;
n <<= 6;
}
n |= (31 & e) << 1 | e >>> 31;
t[i + 0] = r >>> 0;
t[i + 1] = n >>> 0;
};
var n = [ 14, 0, 4, 15, 13, 7, 1, 4, 2, 14, 15, 2, 11, 13, 8, 1, 3, 10, 10, 6, 6, 12, 12, 11, 5, 9, 9, 5, 0, 3, 7, 8, 4, 15, 1, 12, 14, 8, 8, 2, 13, 4, 6, 9, 2, 1, 11, 7, 15, 5, 12, 11, 9, 3, 7, 14, 3, 10, 10, 0, 5, 6, 0, 13, 15, 3, 1, 13, 8, 4, 14, 7, 6, 15, 11, 2, 3, 8, 4, 14, 9, 12, 7, 0, 2, 1, 13, 10, 12, 6, 0, 9, 5, 11, 10, 5, 0, 13, 14, 8, 7, 10, 11, 1, 10, 3, 4, 15, 13, 4, 1, 2, 5, 11, 8, 6, 12, 7, 6, 12, 9, 0, 3, 5, 2, 14, 15, 9, 10, 13, 0, 7, 9, 0, 14, 9, 6, 3, 3, 4, 15, 6, 5, 10, 1, 2, 13, 8, 12, 5, 7, 14, 11, 12, 4, 11, 2, 15, 8, 1, 13, 1, 6, 10, 4, 13, 9, 0, 8, 6, 15, 9, 3, 8, 0, 7, 11, 4, 1, 15, 2, 14, 12, 3, 5, 11, 10, 5, 14, 2, 7, 12, 7, 13, 13, 8, 14, 11, 3, 5, 0, 6, 6, 15, 9, 0, 10, 3, 1, 4, 2, 7, 8, 2, 5, 12, 11, 1, 12, 10, 4, 14, 15, 9, 10, 3, 6, 15, 9, 0, 0, 6, 12, 10, 11, 1, 7, 13, 13, 8, 15, 9, 1, 4, 3, 5, 14, 11, 5, 12, 2, 7, 8, 2, 4, 14, 2, 14, 12, 11, 4, 2, 1, 12, 7, 4, 10, 7, 11, 13, 6, 1, 8, 5, 5, 0, 3, 15, 15, 10, 13, 3, 0, 9, 14, 8, 9, 6, 4, 11, 2, 8, 1, 12, 11, 7, 10, 1, 13, 14, 7, 2, 8, 13, 15, 6, 9, 15, 12, 0, 5, 9, 6, 10, 3, 4, 0, 5, 14, 3, 12, 10, 1, 15, 10, 4, 15, 2, 9, 7, 2, 12, 6, 9, 8, 5, 0, 6, 13, 1, 3, 13, 4, 14, 14, 0, 7, 11, 5, 3, 11, 8, 9, 4, 14, 3, 15, 2, 5, 12, 2, 9, 8, 5, 12, 15, 3, 10, 7, 11, 0, 14, 4, 1, 10, 7, 1, 6, 13, 0, 11, 8, 6, 13, 4, 13, 11, 0, 2, 11, 14, 7, 15, 4, 0, 9, 8, 1, 13, 10, 3, 14, 12, 3, 9, 5, 7, 12, 5, 2, 10, 15, 6, 8, 1, 6, 1, 6, 4, 11, 11, 13, 13, 8, 12, 1, 3, 4, 7, 10, 14, 7, 10, 9, 15, 5, 6, 0, 8, 15, 0, 14, 5, 2, 9, 3, 2, 12, 13, 1, 2, 15, 8, 13, 4, 8, 6, 10, 15, 3, 11, 7, 1, 4, 10, 12, 9, 5, 3, 6, 14, 11, 5, 0, 0, 14, 12, 9, 7, 2, 7, 2, 11, 1, 4, 14, 1, 7, 9, 4, 12, 10, 14, 8, 2, 13, 0, 15, 6, 12, 10, 9, 13, 0, 15, 3, 3, 5, 5, 6, 8, 11 ];
i.substitute = function(e, t) {
for (var i = 0, r = 0; r < 4; r++) {
i <<= 4;
i |= n[64 * r + (e >>> 18 - 6 * r & 63)];
}
for (r = 0; r < 4; r++) {
i <<= 4;
i |= n[256 + 64 * r + (t >>> 18 - 6 * r & 63)];
}
return i >>> 0;
};
var r = [ 16, 25, 12, 11, 3, 20, 4, 15, 31, 17, 9, 6, 27, 14, 1, 22, 30, 24, 8, 18, 0, 5, 29, 23, 13, 19, 2, 26, 10, 21, 28, 7 ];
i.permute = function(e) {
for (var t = 0, i = 0; i < r.length; i++) {
t <<= 1;
t |= e >>> r[i] & 1;
}
return t >>> 0;
};
i.padSplit = function(e, t, i) {
for (var r = e.toString(2); r.length < t; ) r = "0" + r;
for (var n = [], o = 0; o < t; o += i) n.push(r.slice(o, o + i));
return n.join(" ");
};
}, {} ],
63: [ function(e, t, i) {
(function(o) {
var a = e("./lib/generatePrime"), r = e("./lib/primes.json"), s = e("./lib/dh");
var c = {
binary: !0,
hex: !0,
base64: !0
};
i.DiffieHellmanGroup = i.createDiffieHellmanGroup = i.getDiffieHellman = function(e) {
var t = new o(r[e].prime, "hex"), i = new o(r[e].gen, "hex");
return new s(t, i);
};
i.createDiffieHellman = i.DiffieHellman = function e(t, i, r, n) {
if (o.isBuffer(i) || void 0 === c[i]) return e(t, "binary", i, r);
i = i || "binary";
n = n || "binary";
r = r || new o([ 2 ]);
o.isBuffer(r) || (r = new o(r, n));
if ("number" == typeof t) return new s(a(t, r), r, !0);
o.isBuffer(t) || (t = new o(t, i));
return new s(t, r, !0);
};
}).call(this, e("buffer").Buffer);
}, {
"./lib/dh": 64,
"./lib/generatePrime": 65,
"./lib/primes.json": 66,
buffer: 47
} ],
64: [ function(b, m, e) {
(function(o) {
var a = b("bn.js"), s = new (b("miller-rabin"))(), c = new a(24), f = new a(11), h = new a(10), l = new a(3), d = new a(7), u = b("./generatePrime"), e = b("randombytes");
m.exports = t;
function r(e, t) {
t = t || "utf8";
o.isBuffer(e) || (e = new o(e, t));
this._pub = new a(e);
return this;
}
function n(e, t) {
t = t || "utf8";
o.isBuffer(e) || (e = new o(e, t));
this._priv = new a(e);
return this;
}
var p = {};
function t(e, t, i) {
this.setGenerator(t);
this.__prime = new a(e);
this._prime = a.mont(this.__prime);
this._primeLen = e.length;
this._pub = void 0;
this._priv = void 0;
this._primeCode = void 0;
if (i) {
this.setPublicKey = r;
this.setPrivateKey = n;
} else this._primeCode = 8;
}
Object.defineProperty(t.prototype, "verifyError", {
enumerable: !0,
get: function() {
"number" != typeof this._primeCode && (this._primeCode = function(e, t) {
var i = t.toString("hex"), r = [ i, e.toString(16) ].join("_");
if (r in p) return p[r];
var n, o = 0;
if (e.isEven() || !u.simpleSieve || !u.fermatTest(e) || !s.test(e)) {
o += 1;
o += "02" === i || "05" === i ? 8 : 4;
return p[r] = o;
}
s.test(e.shrn(1)) || (o += 2);
switch (i) {
case "02":
e.mod(c).cmp(f) && (o += 8);
break;

case "05":
(n = e.mod(h)).cmp(l) && n.cmp(d) && (o += 8);
break;

default:
o += 4;
}
return p[r] = o;
}(this.__prime, this.__gen));
return this._primeCode;
}
});
t.prototype.generateKeys = function() {
this._priv || (this._priv = new a(e(this._primeLen)));
this._pub = this._gen.toRed(this._prime).redPow(this._priv).fromRed();
return this.getPublicKey();
};
t.prototype.computeSecret = function(e) {
var t = (e = (e = new a(e)).toRed(this._prime)).redPow(this._priv).fromRed(), i = new o(t.toArray()), r = this.getPrime();
if (i.length < r.length) {
var n = new o(r.length - i.length);
n.fill(0);
i = o.concat([ n, i ]);
}
return i;
};
t.prototype.getPublicKey = function(e) {
return i(this._pub, e);
};
t.prototype.getPrivateKey = function(e) {
return i(this._priv, e);
};
t.prototype.getPrime = function(e) {
return i(this.__prime, e);
};
t.prototype.getGenerator = function(e) {
return i(this._gen, e);
};
t.prototype.setGenerator = function(e, t) {
t = t || "utf8";
o.isBuffer(e) || (e = new o(e, t));
this.__gen = e;
this._gen = new a(e);
return this;
};
function i(e, t) {
var i = new o(e.toArray());
return t ? i.toString(t) : i;
}
}).call(this, b("buffer").Buffer);
}, {
"./generatePrime": 65,
"bn.js": 16,
buffer: 47,
"miller-rabin": 104,
randombytes: 125
} ],
65: [ function(e, t, i) {
var n = e("randombytes");
(t.exports = r).simpleSieve = m;
r.fermatTest = g;
var o = e("bn.js"), a = new o(24), s = new (e("miller-rabin"))(), c = new o(1), f = new o(2), h = new o(5), l = (new o(16), 
new o(8), new o(10)), d = new o(3), u = (new o(7), new o(11)), p = new o(4), b = (new o(12), 
null);
function m(e) {
for (var t = function() {
if (null !== b) return b;
var e = [];
e[0] = 2;
for (var t = 1, i = 3; i < 1048576; i += 2) {
for (var r = Math.ceil(Math.sqrt(i)), n = 0; n < t && e[n] <= r && i % e[n] != 0; n++) ;
t !== n && e[n] <= r || (e[t++] = i);
}
return b = e;
}(), i = 0; i < t.length; i++) if (0 === e.modn(t[i])) return 0 === e.cmpn(t[i]);
return !0;
}
function g(e) {
var t = o.mont(e);
return 0 === f.toRed(t).redPow(e.subn(1)).fromRed().cmpn(1);
}
function r(e, t) {
if (e < 16) return new o(2 === t || 5 === t ? [ 140, 123 ] : [ 140, 39 ]);
t = new o(t);
for (var i, r; ;) {
i = new o(n(Math.ceil(e / 8)));
for (;i.bitLength() > e; ) i.ishrn(1);
i.isEven() && i.iadd(c);
i.testn(1) || i.iadd(f);
if (t.cmp(f)) {
if (!t.cmp(h)) for (;i.mod(l).cmp(d); ) i.iadd(p);
} else for (;i.mod(a).cmp(u); ) i.iadd(p);
if (m(r = i.shrn(1)) && m(i) && g(r) && g(i) && s.test(r) && s.test(i)) return i;
}
}
}, {
"bn.js": 16,
"miller-rabin": 104,
randombytes: 125
} ],
66: [ function(e, t, i) {
t.exports = {
modp1: {
gen: "02",
prime: "ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a63a3620ffffffffffffffff"
},
modp2: {
gen: "02",
prime: "ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a637ed6b0bff5cb6f406b7edee386bfb5a899fa5ae9f24117c4b1fe649286651ece65381ffffffffffffffff"
},
modp5: {
gen: "02",
prime: "ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a637ed6b0bff5cb6f406b7edee386bfb5a899fa5ae9f24117c4b1fe649286651ece45b3dc2007cb8a163bf0598da48361c55d39a69163fa8fd24cf5f83655d23dca3ad961c62f356208552bb9ed529077096966d670c354e4abc9804f1746c08ca237327ffffffffffffffff"
},
modp14: {
gen: "02",
prime: "ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a637ed6b0bff5cb6f406b7edee386bfb5a899fa5ae9f24117c4b1fe649286651ece45b3dc2007cb8a163bf0598da48361c55d39a69163fa8fd24cf5f83655d23dca3ad961c62f356208552bb9ed529077096966d670c354e4abc9804f1746c08ca18217c32905e462e36ce3be39e772c180e86039b2783a2ec07a28fb5c55df06f4c52c9de2bcbf6955817183995497cea956ae515d2261898fa051015728e5a8aacaa68ffffffffffffffff"
},
modp15: {
gen: "02",
prime: "ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a637ed6b0bff5cb6f406b7edee386bfb5a899fa5ae9f24117c4b1fe649286651ece45b3dc2007cb8a163bf0598da48361c55d39a69163fa8fd24cf5f83655d23dca3ad961c62f356208552bb9ed529077096966d670c354e4abc9804f1746c08ca18217c32905e462e36ce3be39e772c180e86039b2783a2ec07a28fb5c55df06f4c52c9de2bcbf6955817183995497cea956ae515d2261898fa051015728e5a8aaac42dad33170d04507a33a85521abdf1cba64ecfb850458dbef0a8aea71575d060c7db3970f85a6e1e4c7abf5ae8cdb0933d71e8c94e04a25619dcee3d2261ad2ee6bf12ffa06d98a0864d87602733ec86a64521f2b18177b200cbbe117577a615d6c770988c0bad946e208e24fa074e5ab3143db5bfce0fd108e4b82d120a93ad2caffffffffffffffff"
},
modp16: {
gen: "02",
prime: "ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a637ed6b0bff5cb6f406b7edee386bfb5a899fa5ae9f24117c4b1fe649286651ece45b3dc2007cb8a163bf0598da48361c55d39a69163fa8fd24cf5f83655d23dca3ad961c62f356208552bb9ed529077096966d670c354e4abc9804f1746c08ca18217c32905e462e36ce3be39e772c180e86039b2783a2ec07a28fb5c55df06f4c52c9de2bcbf6955817183995497cea956ae515d2261898fa051015728e5a8aaac42dad33170d04507a33a85521abdf1cba64ecfb850458dbef0a8aea71575d060c7db3970f85a6e1e4c7abf5ae8cdb0933d71e8c94e04a25619dcee3d2261ad2ee6bf12ffa06d98a0864d87602733ec86a64521f2b18177b200cbbe117577a615d6c770988c0bad946e208e24fa074e5ab3143db5bfce0fd108e4b82d120a92108011a723c12a787e6d788719a10bdba5b2699c327186af4e23c1a946834b6150bda2583e9ca2ad44ce8dbbbc2db04de8ef92e8efc141fbecaa6287c59474e6bc05d99b2964fa090c3a2233ba186515be7ed1f612970cee2d7afb81bdd762170481cd0069127d5b05aa993b4ea988d8fddc186ffb7dc90a6c08f4df435c934063199ffffffffffffffff"
},
modp17: {
gen: "02",
prime: "ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a637ed6b0bff5cb6f406b7edee386bfb5a899fa5ae9f24117c4b1fe649286651ece45b3dc2007cb8a163bf0598da48361c55d39a69163fa8fd24cf5f83655d23dca3ad961c62f356208552bb9ed529077096966d670c354e4abc9804f1746c08ca18217c32905e462e36ce3be39e772c180e86039b2783a2ec07a28fb5c55df06f4c52c9de2bcbf6955817183995497cea956ae515d2261898fa051015728e5a8aaac42dad33170d04507a33a85521abdf1cba64ecfb850458dbef0a8aea71575d060c7db3970f85a6e1e4c7abf5ae8cdb0933d71e8c94e04a25619dcee3d2261ad2ee6bf12ffa06d98a0864d87602733ec86a64521f2b18177b200cbbe117577a615d6c770988c0bad946e208e24fa074e5ab3143db5bfce0fd108e4b82d120a92108011a723c12a787e6d788719a10bdba5b2699c327186af4e23c1a946834b6150bda2583e9ca2ad44ce8dbbbc2db04de8ef92e8efc141fbecaa6287c59474e6bc05d99b2964fa090c3a2233ba186515be7ed1f612970cee2d7afb81bdd762170481cd0069127d5b05aa993b4ea988d8fddc186ffb7dc90a6c08f4df435c93402849236c3fab4d27c7026c1d4dcb2602646dec9751e763dba37bdf8ff9406ad9e530ee5db382f413001aeb06a53ed9027d831179727b0865a8918da3edbebcf9b14ed44ce6cbaced4bb1bdb7f1447e6cc254b332051512bd7af426fb8f401378cd2bf5983ca01c64b92ecf032ea15d1721d03f482d7ce6e74fef6d55e702f46980c82b5a84031900b1c9e59e7c97fbec7e8f323a97a7e36cc88be0f1d45b7ff585ac54bd407b22b4154aacc8f6d7ebf48e1d814cc5ed20f8037e0a79715eef29be32806a1d58bb7c5da76f550aa3d8a1fbff0eb19ccb1a313d55cda56c9ec2ef29632387fe8d76e3c0468043e8f663f4860ee12bf2d5b0b7474d6e694f91e6dcc4024ffffffffffffffff"
},
modp18: {
gen: "02",
prime: "ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a637ed6b0bff5cb6f406b7edee386bfb5a899fa5ae9f24117c4b1fe649286651ece45b3dc2007cb8a163bf0598da48361c55d39a69163fa8fd24cf5f83655d23dca3ad961c62f356208552bb9ed529077096966d670c354e4abc9804f1746c08ca18217c32905e462e36ce3be39e772c180e86039b2783a2ec07a28fb5c55df06f4c52c9de2bcbf6955817183995497cea956ae515d2261898fa051015728e5a8aaac42dad33170d04507a33a85521abdf1cba64ecfb850458dbef0a8aea71575d060c7db3970f85a6e1e4c7abf5ae8cdb0933d71e8c94e04a25619dcee3d2261ad2ee6bf12ffa06d98a0864d87602733ec86a64521f2b18177b200cbbe117577a615d6c770988c0bad946e208e24fa074e5ab3143db5bfce0fd108e4b82d120a92108011a723c12a787e6d788719a10bdba5b2699c327186af4e23c1a946834b6150bda2583e9ca2ad44ce8dbbbc2db04de8ef92e8efc141fbecaa6287c59474e6bc05d99b2964fa090c3a2233ba186515be7ed1f612970cee2d7afb81bdd762170481cd0069127d5b05aa993b4ea988d8fddc186ffb7dc90a6c08f4df435c93402849236c3fab4d27c7026c1d4dcb2602646dec9751e763dba37bdf8ff9406ad9e530ee5db382f413001aeb06a53ed9027d831179727b0865a8918da3edbebcf9b14ed44ce6cbaced4bb1bdb7f1447e6cc254b332051512bd7af426fb8f401378cd2bf5983ca01c64b92ecf032ea15d1721d03f482d7ce6e74fef6d55e702f46980c82b5a84031900b1c9e59e7c97fbec7e8f323a97a7e36cc88be0f1d45b7ff585ac54bd407b22b4154aacc8f6d7ebf48e1d814cc5ed20f8037e0a79715eef29be32806a1d58bb7c5da76f550aa3d8a1fbff0eb19ccb1a313d55cda56c9ec2ef29632387fe8d76e3c0468043e8f663f4860ee12bf2d5b0b7474d6e694f91e6dbe115974a3926f12fee5e438777cb6a932df8cd8bec4d073b931ba3bc832b68d9dd300741fa7bf8afc47ed2576f6936ba424663aab639c5ae4f5683423b4742bf1c978238f16cbe39d652de3fdb8befc848ad922222e04a4037c0713eb57a81a23f0c73473fc646cea306b4bcbc8862f8385ddfa9d4b7fa2c087e879683303ed5bdd3a062b3cf5b3a278a66d2a13f83f44f82ddf310ee074ab6a364597e899a0255dc164f31cc50846851df9ab48195ded7ea1b1d510bd7ee74d73faf36bc31ecfa268359046f4eb879f924009438b481c6cd7889a002ed5ee382bc9190da6fc026e479558e4475677e9aa9e3050e2765694dfc81f56e880b96e7160c980dd98edd3dfffffffffffffffff"
}
};
}, {} ],
67: [ function(e, t, i) {
"use strict";
var r = i;
r.version = e("../package.json").version;
r.utils = e("./elliptic/utils");
r.rand = e("brorand");
r.curve = e("./elliptic/curve");
r.curves = e("./elliptic/curves");
r.ec = e("./elliptic/ec");
r.eddsa = e("./elliptic/eddsa");
}, {
"../package.json": 82,
"./elliptic/curve": 70,
"./elliptic/curves": 73,
"./elliptic/ec": 74,
"./elliptic/eddsa": 77,
"./elliptic/utils": 81,
brorand: 17
} ],
68: [ function(e, t, i) {
"use strict";
var r = e("bn.js"), n = e("../../elliptic").utils, C = n.getNAF, G = n.getJSF, l = n.assert;
function o(e, t) {
this.type = e;
this.p = new r(t.p, 16);
this.red = t.prime ? r.red(t.prime) : r.mont(this.p);
this.zero = new r(0).toRed(this.red);
this.one = new r(1).toRed(this.red);
this.two = new r(2).toRed(this.red);
this.n = t.n && new r(t.n, 16);
this.g = t.g && this.pointFromJSON(t.g, t.gRed);
this._wnafT1 = new Array(4);
this._wnafT2 = new Array(4);
this._wnafT3 = new Array(4);
this._wnafT4 = new Array(4);
var i = this.n && this.p.div(this.n);
if (!i || 0 < i.cmpn(100)) this.redN = null; else {
this._maxwellTrick = !0;
this.redN = this.n.toRed(this.red);
}
}
(t.exports = o).prototype.point = function() {
throw new Error("Not implemented");
};
o.prototype.validate = function() {
throw new Error("Not implemented");
};
o.prototype._fixedNafMul = function(e, t) {
l(e.precomputed);
var i = e._getDoubles(), r = C(t, 1), n = (1 << i.step + 1) - (i.step % 2 == 0 ? 2 : 1);
n /= 3;
for (var o = [], a = 0; a < r.length; a += i.step) {
var s = 0;
for (t = a + i.step - 1; a <= t; t--) s = (s << 1) + r[t];
o.push(s);
}
for (var c = this.jpoint(null, null, null), f = this.jpoint(null, null, null), h = n; 0 < h; h--) {
for (a = 0; a < o.length; a++) {
(s = o[a]) === h ? f = f.mixedAdd(i.points[a]) : s === -h && (f = f.mixedAdd(i.points[a].neg()));
}
c = c.add(f);
}
return c.toP();
};
o.prototype._wnafMul = function(e, t) {
var i = 4, r = e._getNAFPoints(i);
i = r.wnd;
for (var n = r.points, o = C(t, i), a = this.jpoint(null, null, null), s = o.length - 1; 0 <= s; s--) {
for (t = 0; 0 <= s && 0 === o[s]; s--) t++;
0 <= s && t++;
a = a.dblp(t);
if (s < 0) break;
var c = o[s];
l(0 !== c);
a = "affine" === e.type ? 0 < c ? a.mixedAdd(n[c - 1 >> 1]) : a.mixedAdd(n[-c - 1 >> 1].neg()) : 0 < c ? a.add(n[c - 1 >> 1]) : a.add(n[-c - 1 >> 1].neg());
}
return "affine" === e.type ? a.toP() : a;
};
o.prototype._wnafMulAdd = function(e, t, i, r, n) {
for (var o = this._wnafT1, a = this._wnafT2, s = this._wnafT3, c = 0, f = 0; f < r; f++) {
var h = (I = t[f])._getNAFPoints(e);
o[f] = h.wnd;
a[f] = h.points;
}
for (f = r - 1; 1 <= f; f -= 2) {
var l = f - 1, d = f;
if (1 === o[l] && 1 === o[d]) {
var u = [ t[l], null, null, t[d] ];
if (0 === t[l].y.cmp(t[d].y)) {
u[1] = t[l].add(t[d]);
u[2] = t[l].toJ().mixedAdd(t[d].neg());
} else if (0 === t[l].y.cmp(t[d].y.redNeg())) {
u[1] = t[l].toJ().mixedAdd(t[d]);
u[2] = t[l].add(t[d].neg());
} else {
u[1] = t[l].toJ().mixedAdd(t[d]);
u[2] = t[l].toJ().mixedAdd(t[d].neg());
}
var p = [ -3, -1, -5, -7, 0, 7, 5, 1, 3 ], b = G(i[l], i[d]);
c = Math.max(b[0].length, c);
s[l] = new Array(c);
s[d] = new Array(c);
for (var m = 0; m < c; m++) {
var g = 0 | b[0][m], y = 0 | b[1][m];
s[l][m] = p[3 * (g + 1) + (y + 1)];
s[d][m] = 0;
a[l] = u;
}
} else {
s[l] = C(i[l], o[l]);
s[d] = C(i[d], o[d]);
c = Math.max(s[l].length, c);
c = Math.max(s[d].length, c);
}
}
var v = this.jpoint(null, null, null), w = this._wnafT4;
for (f = c; 0 <= f; f--) {
for (var S = 0; 0 <= f; ) {
var _ = !0;
for (m = 0; m < r; m++) {
w[m] = 0 | s[m][f];
0 !== w[m] && (_ = !1);
}
if (!_) break;
S++;
f--;
}
0 <= f && S++;
v = v.dblp(S);
if (f < 0) break;
for (m = 0; m < r; m++) {
var I, x = w[m];
if (0 !== x) {
0 < x ? I = a[m][x - 1 >> 1] : x < 0 && (I = a[m][-x - 1 >> 1].neg());
v = "affine" === I.type ? v.mixedAdd(I) : v.add(I);
}
}
}
for (f = 0; f < r; f++) a[f] = null;
return n ? v : v.toP();
};
function a(e, t) {
this.curve = e;
this.type = t;
this.precomputed = null;
}
(o.BasePoint = a).prototype.eq = function() {
throw new Error("Not implemented");
};
a.prototype.validate = function() {
return this.curve.validate(this);
};
o.prototype.decodePoint = function(e, t) {
e = n.toArray(e, t);
var i = this.p.byteLength();
if ((4 === e[0] || 6 === e[0] || 7 === e[0]) && e.length - 1 == 2 * i) {
6 === e[0] ? l(e[e.length - 1] % 2 == 0) : 7 === e[0] && l(e[e.length - 1] % 2 == 1);
return this.point(e.slice(1, 1 + i), e.slice(1 + i, 1 + 2 * i));
}
if ((2 === e[0] || 3 === e[0]) && e.length - 1 === i) return this.pointFromX(e.slice(1, 1 + i), 3 === e[0]);
throw new Error("Unknown point format");
};
a.prototype.encodeCompressed = function(e) {
return this.encode(e, !0);
};
a.prototype._encode = function(e) {
var t = this.curve.p.byteLength(), i = this.getX().toArray("be", t);
return e ? [ this.getY().isEven() ? 2 : 3 ].concat(i) : [ 4 ].concat(i, this.getY().toArray("be", t));
};
a.prototype.encode = function(e, t) {
return n.encode(this._encode(t), e);
};
a.prototype.precompute = function(e) {
if (this.precomputed) return this;
var t = {
doubles: null,
naf: null,
beta: null
};
t.naf = this._getNAFPoints(8);
t.doubles = this._getDoubles(4, e);
t.beta = this._getBeta();
this.precomputed = t;
return this;
};
a.prototype._hasDoubles = function(e) {
if (!this.precomputed) return !1;
var t = this.precomputed.doubles;
return !!t && t.points.length >= Math.ceil((e.bitLength() + 1) / t.step);
};
a.prototype._getDoubles = function(e, t) {
if (this.precomputed && this.precomputed.doubles) return this.precomputed.doubles;
for (var i = [ this ], r = this, n = 0; n < t; n += e) {
for (var o = 0; o < e; o++) r = r.dbl();
i.push(r);
}
return {
step: e,
points: i
};
};
a.prototype._getNAFPoints = function(e) {
if (this.precomputed && this.precomputed.naf) return this.precomputed.naf;
for (var t = [ this ], i = (1 << e) - 1, r = 1 === i ? null : this.dbl(), n = 1; n < i; n++) t[n] = t[n - 1].add(r);
return {
wnd: e,
points: t
};
};
a.prototype._getBeta = function() {
return null;
};
a.prototype.dblp = function(e) {
for (var t = this, i = 0; i < e; i++) t = t.dbl();
return t;
};
}, {
"../../elliptic": 67,
"bn.js": 16
} ],
69: [ function(e, t, i) {
"use strict";
var r = e("../curve"), n = e("../../elliptic"), c = e("bn.js"), o = e("inherits"), a = r.base, s = n.utils.assert;
function f(e) {
this.twisted = 1 != (0 | e.a);
this.mOneA = this.twisted && -1 == (0 | e.a);
this.extended = this.mOneA;
a.call(this, "edwards", e);
this.a = new c(e.a, 16).umod(this.red.m);
this.a = this.a.toRed(this.red);
this.c = new c(e.c, 16).toRed(this.red);
this.c2 = this.c.redSqr();
this.d = new c(e.d, 16).toRed(this.red);
this.dd = this.d.redAdd(this.d);
s(!this.twisted || 0 === this.c.fromRed().cmpn(1));
this.oneC = 1 == (0 | e.c);
}
o(f, a);
(t.exports = f).prototype._mulA = function(e) {
return this.mOneA ? e.redNeg() : this.a.redMul(e);
};
f.prototype._mulC = function(e) {
return this.oneC ? e : this.c.redMul(e);
};
f.prototype.jpoint = function(e, t, i, r) {
return this.point(e, t, i, r);
};
f.prototype.pointFromX = function(e, t) {
(e = new c(e, 16)).red || (e = e.toRed(this.red));
var i = e.redSqr(), r = this.c2.redSub(this.a.redMul(i)), n = this.one.redSub(this.c2.redMul(this.d).redMul(i)), o = r.redMul(n.redInvm()), a = o.redSqrt();
if (0 !== a.redSqr().redSub(o).cmp(this.zero)) throw new Error("invalid point");
var s = a.fromRed().isOdd();
(t && !s || !t && s) && (a = a.redNeg());
return this.point(e, a);
};
f.prototype.pointFromY = function(e, t) {
(e = new c(e, 16)).red || (e = e.toRed(this.red));
var i = e.redSqr(), r = i.redSub(this.one), n = i.redMul(this.d).redAdd(this.one), o = r.redMul(n.redInvm());
if (0 === o.cmp(this.zero)) {
if (t) throw new Error("invalid point");
return this.point(this.zero, e);
}
var a = o.redSqrt();
if (0 !== a.redSqr().redSub(o).cmp(this.zero)) throw new Error("invalid point");
a.isOdd() !== t && (a = a.redNeg());
return this.point(a, e);
};
f.prototype.validate = function(e) {
if (e.isInfinity()) return !0;
e.normalize();
var t = e.x.redSqr(), i = e.y.redSqr(), r = t.redMul(this.a).redAdd(i), n = this.c2.redMul(this.one.redAdd(this.d.redMul(t).redMul(i)));
return 0 === r.cmp(n);
};
function h(e, t, i, r, n) {
a.BasePoint.call(this, e, "projective");
if (null === t && null === i && null === r) {
this.x = this.curve.zero;
this.y = this.curve.one;
this.z = this.curve.one;
this.t = this.curve.zero;
this.zOne = !0;
} else {
this.x = new c(t, 16);
this.y = new c(i, 16);
this.z = r ? new c(r, 16) : this.curve.one;
this.t = n && new c(n, 16);
this.x.red || (this.x = this.x.toRed(this.curve.red));
this.y.red || (this.y = this.y.toRed(this.curve.red));
this.z.red || (this.z = this.z.toRed(this.curve.red));
this.t && !this.t.red && (this.t = this.t.toRed(this.curve.red));
this.zOne = this.z === this.curve.one;
if (this.curve.extended && !this.t) {
this.t = this.x.redMul(this.y);
this.zOne || (this.t = this.t.redMul(this.z.redInvm()));
}
}
}
o(h, a.BasePoint);
f.prototype.pointFromJSON = function(e) {
return h.fromJSON(this, e);
};
f.prototype.point = function(e, t, i, r) {
return new h(this, e, t, i, r);
};
h.fromJSON = function(e, t) {
return new h(e, t[0], t[1], t[2]);
};
h.prototype.inspect = function() {
return this.isInfinity() ? "<EC Point Infinity>" : "<EC Point x: " + this.x.fromRed().toString(16, 2) + " y: " + this.y.fromRed().toString(16, 2) + " z: " + this.z.fromRed().toString(16, 2) + ">";
};
h.prototype.isInfinity = function() {
return 0 === this.x.cmpn(0) && 0 === this.y.cmp(this.z);
};
h.prototype._extDbl = function() {
var e = this.x.redSqr(), t = this.y.redSqr(), i = this.z.redSqr();
i = i.redIAdd(i);
var r = this.curve._mulA(e), n = this.x.redAdd(this.y).redSqr().redISub(e).redISub(t), o = r.redAdd(t), a = o.redSub(i), s = r.redSub(t), c = n.redMul(a), f = o.redMul(s), h = n.redMul(s), l = a.redMul(o);
return this.curve.point(c, f, l, h);
};
h.prototype._projDbl = function() {
var e, t, i, r = this.x.redAdd(this.y).redSqr(), n = this.x.redSqr(), o = this.y.redSqr();
if (this.curve.twisted) {
var a = (f = this.curve._mulA(n)).redAdd(o);
if (this.zOne) {
e = r.redSub(n).redSub(o).redMul(a.redSub(this.curve.two));
t = a.redMul(f.redSub(o));
i = a.redSqr().redSub(a).redSub(a);
} else {
var s = this.z.redSqr(), c = a.redSub(s).redISub(s);
e = r.redSub(n).redISub(o).redMul(c);
t = a.redMul(f.redSub(o));
i = a.redMul(c);
}
} else {
var f = n.redAdd(o);
s = this.curve._mulC(this.c.redMul(this.z)).redSqr(), c = f.redSub(s).redSub(s);
e = this.curve._mulC(r.redISub(f)).redMul(c);
t = this.curve._mulC(f).redMul(n.redISub(o));
i = f.redMul(c);
}
return this.curve.point(e, t, i);
};
h.prototype.dbl = function() {
return this.isInfinity() ? this : this.curve.extended ? this._extDbl() : this._projDbl();
};
h.prototype._extAdd = function(e) {
var t = this.y.redSub(this.x).redMul(e.y.redSub(e.x)), i = this.y.redAdd(this.x).redMul(e.y.redAdd(e.x)), r = this.t.redMul(this.curve.dd).redMul(e.t), n = this.z.redMul(e.z.redAdd(e.z)), o = i.redSub(t), a = n.redSub(r), s = n.redAdd(r), c = i.redAdd(t), f = o.redMul(a), h = s.redMul(c), l = o.redMul(c), d = a.redMul(s);
return this.curve.point(f, h, d, l);
};
h.prototype._projAdd = function(e) {
var t, i, r = this.z.redMul(e.z), n = r.redSqr(), o = this.x.redMul(e.x), a = this.y.redMul(e.y), s = this.curve.d.redMul(o).redMul(a), c = n.redSub(s), f = n.redAdd(s), h = this.x.redAdd(this.y).redMul(e.x.redAdd(e.y)).redISub(o).redISub(a), l = r.redMul(c).redMul(h);
if (this.curve.twisted) {
t = r.redMul(f).redMul(a.redSub(this.curve._mulA(o)));
i = c.redMul(f);
} else {
t = r.redMul(f).redMul(a.redSub(o));
i = this.curve._mulC(c).redMul(f);
}
return this.curve.point(l, t, i);
};
h.prototype.add = function(e) {
return this.isInfinity() ? e : e.isInfinity() ? this : this.curve.extended ? this._extAdd(e) : this._projAdd(e);
};
h.prototype.mul = function(e) {
return this._hasDoubles(e) ? this.curve._fixedNafMul(this, e) : this.curve._wnafMul(this, e);
};
h.prototype.mulAdd = function(e, t, i) {
return this.curve._wnafMulAdd(1, [ this, t ], [ e, i ], 2, !1);
};
h.prototype.jmulAdd = function(e, t, i) {
return this.curve._wnafMulAdd(1, [ this, t ], [ e, i ], 2, !0);
};
h.prototype.normalize = function() {
if (this.zOne) return this;
var e = this.z.redInvm();
this.x = this.x.redMul(e);
this.y = this.y.redMul(e);
this.t && (this.t = this.t.redMul(e));
this.z = this.curve.one;
this.zOne = !0;
return this;
};
h.prototype.neg = function() {
return this.curve.point(this.x.redNeg(), this.y, this.z, this.t && this.t.redNeg());
};
h.prototype.getX = function() {
this.normalize();
return this.x.fromRed();
};
h.prototype.getY = function() {
this.normalize();
return this.y.fromRed();
};
h.prototype.eq = function(e) {
return this === e || 0 === this.getX().cmp(e.getX()) && 0 === this.getY().cmp(e.getY());
};
h.prototype.eqXToP = function(e) {
var t = e.toRed(this.curve.red).redMul(this.z);
if (0 === this.x.cmp(t)) return !0;
for (var i = e.clone(), r = this.curve.redN.redMul(this.z); ;) {
i.iadd(this.curve.n);
if (0 <= i.cmp(this.curve.p)) return !1;
t.redIAdd(r);
if (0 === this.x.cmp(t)) return !0;
}
return !1;
};
h.prototype.toP = h.prototype.normalize;
h.prototype.mixedAdd = h.prototype.add;
}, {
"../../elliptic": 67,
"../curve": 70,
"bn.js": 16,
inherits: 101
} ],
70: [ function(e, t, i) {
"use strict";
var r = i;
r.base = e("./base");
r.short = e("./short");
r.mont = e("./mont");
r.edwards = e("./edwards");
}, {
"./base": 68,
"./edwards": 69,
"./mont": 71,
"./short": 72
} ],
71: [ function(e, t, i) {
"use strict";
var r = e("../curve"), n = e("bn.js"), o = e("inherits"), a = r.base, s = e("../../elliptic").utils;
function c(e) {
a.call(this, "mont", e);
this.a = new n(e.a, 16).toRed(this.red);
this.b = new n(e.b, 16).toRed(this.red);
this.i4 = new n(4).toRed(this.red).redInvm();
this.two = new n(2).toRed(this.red);
this.a24 = this.i4.redMul(this.a.redAdd(this.two));
}
o(c, a);
(t.exports = c).prototype.validate = function(e) {
var t = e.normalize().x, i = t.redSqr(), r = i.redMul(t).redAdd(i.redMul(this.a)).redAdd(t);
return 0 === r.redSqrt().redSqr().cmp(r);
};
function f(e, t, i) {
a.BasePoint.call(this, e, "projective");
if (null === t && null === i) {
this.x = this.curve.one;
this.z = this.curve.zero;
} else {
this.x = new n(t, 16);
this.z = new n(i, 16);
this.x.red || (this.x = this.x.toRed(this.curve.red));
this.z.red || (this.z = this.z.toRed(this.curve.red));
}
}
o(f, a.BasePoint);
c.prototype.decodePoint = function(e, t) {
return this.point(s.toArray(e, t), 1);
};
c.prototype.point = function(e, t) {
return new f(this, e, t);
};
c.prototype.pointFromJSON = function(e) {
return f.fromJSON(this, e);
};
f.prototype.precompute = function() {};
f.prototype._encode = function() {
return this.getX().toArray("be", this.curve.p.byteLength());
};
f.fromJSON = function(e, t) {
return new f(e, t[0], t[1] || e.one);
};
f.prototype.inspect = function() {
return this.isInfinity() ? "<EC Point Infinity>" : "<EC Point x: " + this.x.fromRed().toString(16, 2) + " z: " + this.z.fromRed().toString(16, 2) + ">";
};
f.prototype.isInfinity = function() {
return 0 === this.z.cmpn(0);
};
f.prototype.dbl = function() {
var e = this.x.redAdd(this.z).redSqr(), t = this.x.redSub(this.z).redSqr(), i = e.redSub(t), r = e.redMul(t), n = i.redMul(t.redAdd(this.curve.a24.redMul(i)));
return this.curve.point(r, n);
};
f.prototype.add = function() {
throw new Error("Not supported on Montgomery curve");
};
f.prototype.diffAdd = function(e, t) {
var i = this.x.redAdd(this.z), r = this.x.redSub(this.z), n = e.x.redAdd(e.z), o = e.x.redSub(e.z).redMul(i), a = n.redMul(r), s = t.z.redMul(o.redAdd(a).redSqr()), c = t.x.redMul(o.redISub(a).redSqr());
return this.curve.point(s, c);
};
f.prototype.mul = function(e) {
for (var t = e.clone(), i = this, r = this.curve.point(null, null), n = []; 0 !== t.cmpn(0); t.iushrn(1)) n.push(t.andln(1));
for (var o = n.length - 1; 0 <= o; o--) if (0 === n[o]) {
i = i.diffAdd(r, this);
r = r.dbl();
} else {
r = i.diffAdd(r, this);
i = i.dbl();
}
return r;
};
f.prototype.mulAdd = function() {
throw new Error("Not supported on Montgomery curve");
};
f.prototype.jumlAdd = function() {
throw new Error("Not supported on Montgomery curve");
};
f.prototype.eq = function(e) {
return 0 === this.getX().cmp(e.getX());
};
f.prototype.normalize = function() {
this.x = this.x.redMul(this.z.redInvm());
this.z = this.curve.one;
return this;
};
f.prototype.getX = function() {
this.normalize();
return this.x.fromRed();
};
}, {
"../../elliptic": 67,
"../curve": 70,
"bn.js": 16,
inherits: 101
} ],
72: [ function(e, t, i) {
"use strict";
var r = e("../curve"), n = e("../../elliptic"), S = e("bn.js"), o = e("inherits"), a = r.base, s = n.utils.assert;
function c(e) {
a.call(this, "short", e);
this.a = new S(e.a, 16).toRed(this.red);
this.b = new S(e.b, 16).toRed(this.red);
this.tinv = this.two.redInvm();
this.zeroA = 0 === this.a.fromRed().cmpn(0);
this.threeA = 0 === this.a.fromRed().sub(this.p).cmpn(-3);
this.endo = this._getEndomorphism(e);
this._endoWnafT1 = new Array(4);
this._endoWnafT2 = new Array(4);
}
o(c, a);
(t.exports = c).prototype._getEndomorphism = function(e) {
if (this.zeroA && this.g && this.n && 1 === this.p.modn(3)) {
var t, i;
if (e.beta) t = new S(e.beta, 16).toRed(this.red); else {
var r = this._getEndoRoots(this.p);
t = (t = r[0].cmp(r[1]) < 0 ? r[0] : r[1]).toRed(this.red);
}
if (e.lambda) i = new S(e.lambda, 16); else {
var n = this._getEndoRoots(this.n);
if (0 === this.g.mul(n[0]).x.cmp(this.g.x.redMul(t))) i = n[0]; else {
i = n[1];
s(0 === this.g.mul(i).x.cmp(this.g.x.redMul(t)));
}
}
return {
beta: t,
lambda: i,
basis: e.basis ? e.basis.map(function(e) {
return {
a: new S(e.a, 16),
b: new S(e.b, 16)
};
}) : this._getEndoBasis(i)
};
}
};
c.prototype._getEndoRoots = function(e) {
var t = e === this.p ? this.red : S.mont(e), i = new S(2).toRed(t).redInvm(), r = i.redNeg(), n = new S(3).toRed(t).redNeg().redSqrt().redMul(i);
return [ r.redAdd(n).fromRed(), r.redSub(n).fromRed() ];
};
c.prototype._getEndoBasis = function(e) {
for (var t, i, r, n, o, a, s, c, f, h = this.n.ushrn(Math.floor(this.n.bitLength() / 2)), l = e, d = this.n.clone(), u = new S(1), p = new S(0), b = new S(0), m = new S(1), g = 0; 0 !== l.cmpn(0); ) {
var y = d.div(l);
c = d.sub(y.mul(l));
f = b.sub(y.mul(u));
var v = m.sub(y.mul(p));
if (!r && c.cmp(h) < 0) {
t = s.neg();
i = u;
r = c.neg();
n = f;
} else if (r && 2 == ++g) break;
d = l;
l = s = c;
b = u;
u = f;
m = p;
p = v;
}
o = c.neg();
a = f;
var w = r.sqr().add(n.sqr());
if (0 <= o.sqr().add(a.sqr()).cmp(w)) {
o = t;
a = i;
}
if (r.negative) {
r = r.neg();
n = n.neg();
}
if (o.negative) {
o = o.neg();
a = a.neg();
}
return [ {
a: r,
b: n
}, {
a: o,
b: a
} ];
};
c.prototype._endoSplit = function(e) {
var t = this.endo.basis, i = t[0], r = t[1], n = r.b.mul(e).divRound(this.n), o = i.b.neg().mul(e).divRound(this.n), a = n.mul(i.a), s = o.mul(r.a), c = n.mul(i.b), f = o.mul(r.b);
return {
k1: e.sub(a).sub(s),
k2: c.add(f).neg()
};
};
c.prototype.pointFromX = function(e, t) {
(e = new S(e, 16)).red || (e = e.toRed(this.red));
var i = e.redSqr().redMul(e).redIAdd(e.redMul(this.a)).redIAdd(this.b), r = i.redSqrt();
if (0 !== r.redSqr().redSub(i).cmp(this.zero)) throw new Error("invalid point");
var n = r.fromRed().isOdd();
(t && !n || !t && n) && (r = r.redNeg());
return this.point(e, r);
};
c.prototype.validate = function(e) {
if (e.inf) return !0;
var t = e.x, i = e.y, r = this.a.redMul(t), n = t.redSqr().redMul(t).redIAdd(r).redIAdd(this.b);
return 0 === i.redSqr().redISub(n).cmpn(0);
};
c.prototype._endoWnafMulAdd = function(e, t, i) {
for (var r = this._endoWnafT1, n = this._endoWnafT2, o = 0; o < e.length; o++) {
var a = this._endoSplit(t[o]), s = e[o], c = s._getBeta();
if (a.k1.negative) {
a.k1.ineg();
s = s.neg(!0);
}
if (a.k2.negative) {
a.k2.ineg();
c = c.neg(!0);
}
r[2 * o] = s;
r[2 * o + 1] = c;
n[2 * o] = a.k1;
n[2 * o + 1] = a.k2;
}
for (var f = this._wnafMulAdd(1, r, n, 2 * o, i), h = 0; h < 2 * o; h++) {
r[h] = null;
n[h] = null;
}
return f;
};
function f(e, t, i, r) {
a.BasePoint.call(this, e, "affine");
if (null === t && null === i) {
this.x = null;
this.y = null;
this.inf = !0;
} else {
this.x = new S(t, 16);
this.y = new S(i, 16);
if (r) {
this.x.forceRed(this.curve.red);
this.y.forceRed(this.curve.red);
}
this.x.red || (this.x = this.x.toRed(this.curve.red));
this.y.red || (this.y = this.y.toRed(this.curve.red));
this.inf = !1;
}
}
o(f, a.BasePoint);
c.prototype.point = function(e, t, i) {
return new f(this, e, t, i);
};
c.prototype.pointFromJSON = function(e, t) {
return f.fromJSON(this, e, t);
};
f.prototype._getBeta = function() {
if (this.curve.endo) {
var e = this.precomputed;
if (e && e.beta) return e.beta;
var t = this.curve.point(this.x.redMul(this.curve.endo.beta), this.y);
if (e) {
var i = this.curve, r = function(e) {
return i.point(e.x.redMul(i.endo.beta), e.y);
};
(e.beta = t).precomputed = {
beta: null,
naf: e.naf && {
wnd: e.naf.wnd,
points: e.naf.points.map(r)
},
doubles: e.doubles && {
step: e.doubles.step,
points: e.doubles.points.map(r)
}
};
}
return t;
}
};
f.prototype.toJSON = function() {
return this.precomputed ? [ this.x, this.y, this.precomputed && {
doubles: this.precomputed.doubles && {
step: this.precomputed.doubles.step,
points: this.precomputed.doubles.points.slice(1)
},
naf: this.precomputed.naf && {
wnd: this.precomputed.naf.wnd,
points: this.precomputed.naf.points.slice(1)
}
} ] : [ this.x, this.y ];
};
f.fromJSON = function(t, e, i) {
"string" == typeof e && (e = JSON.parse(e));
var r = t.point(e[0], e[1], i);
if (!e[2]) return r;
function n(e) {
return t.point(e[0], e[1], i);
}
var o = e[2];
r.precomputed = {
beta: null,
doubles: o.doubles && {
step: o.doubles.step,
points: [ r ].concat(o.doubles.points.map(n))
},
naf: o.naf && {
wnd: o.naf.wnd,
points: [ r ].concat(o.naf.points.map(n))
}
};
return r;
};
f.prototype.inspect = function() {
return this.isInfinity() ? "<EC Point Infinity>" : "<EC Point x: " + this.x.fromRed().toString(16, 2) + " y: " + this.y.fromRed().toString(16, 2) + ">";
};
f.prototype.isInfinity = function() {
return this.inf;
};
f.prototype.add = function(e) {
if (this.inf) return e;
if (e.inf) return this;
if (this.eq(e)) return this.dbl();
if (this.neg().eq(e)) return this.curve.point(null, null);
if (0 === this.x.cmp(e.x)) return this.curve.point(null, null);
var t = this.y.redSub(e.y);
0 !== t.cmpn(0) && (t = t.redMul(this.x.redSub(e.x).redInvm()));
var i = t.redSqr().redISub(this.x).redISub(e.x), r = t.redMul(this.x.redSub(i)).redISub(this.y);
return this.curve.point(i, r);
};
f.prototype.dbl = function() {
if (this.inf) return this;
var e = this.y.redAdd(this.y);
if (0 === e.cmpn(0)) return this.curve.point(null, null);
var t = this.curve.a, i = this.x.redSqr(), r = e.redInvm(), n = i.redAdd(i).redIAdd(i).redIAdd(t).redMul(r), o = n.redSqr().redISub(this.x.redAdd(this.x)), a = n.redMul(this.x.redSub(o)).redISub(this.y);
return this.curve.point(o, a);
};
f.prototype.getX = function() {
return this.x.fromRed();
};
f.prototype.getY = function() {
return this.y.fromRed();
};
f.prototype.mul = function(e) {
e = new S(e, 16);
return this._hasDoubles(e) ? this.curve._fixedNafMul(this, e) : this.curve.endo ? this.curve._endoWnafMulAdd([ this ], [ e ]) : this.curve._wnafMul(this, e);
};
f.prototype.mulAdd = function(e, t, i) {
var r = [ this, t ], n = [ e, i ];
return this.curve.endo ? this.curve._endoWnafMulAdd(r, n) : this.curve._wnafMulAdd(1, r, n, 2);
};
f.prototype.jmulAdd = function(e, t, i) {
var r = [ this, t ], n = [ e, i ];
return this.curve.endo ? this.curve._endoWnafMulAdd(r, n, !0) : this.curve._wnafMulAdd(1, r, n, 2, !0);
};
f.prototype.eq = function(e) {
return this === e || this.inf === e.inf && (this.inf || 0 === this.x.cmp(e.x) && 0 === this.y.cmp(e.y));
};
f.prototype.neg = function(e) {
if (this.inf) return this;
var t = this.curve.point(this.x, this.y.redNeg());
if (e && this.precomputed) {
var i = this.precomputed, r = function(e) {
return e.neg();
};
t.precomputed = {
naf: i.naf && {
wnd: i.naf.wnd,
points: i.naf.points.map(r)
},
doubles: i.doubles && {
step: i.doubles.step,
points: i.doubles.points.map(r)
}
};
}
return t;
};
f.prototype.toJ = function() {
return this.inf ? this.curve.jpoint(null, null, null) : this.curve.jpoint(this.x, this.y, this.curve.one);
};
function h(e, t, i, r) {
a.BasePoint.call(this, e, "jacobian");
if (null === t && null === i && null === r) {
this.x = this.curve.one;
this.y = this.curve.one;
this.z = new S(0);
} else {
this.x = new S(t, 16);
this.y = new S(i, 16);
this.z = new S(r, 16);
}
this.x.red || (this.x = this.x.toRed(this.curve.red));
this.y.red || (this.y = this.y.toRed(this.curve.red));
this.z.red || (this.z = this.z.toRed(this.curve.red));
this.zOne = this.z === this.curve.one;
}
o(h, a.BasePoint);
c.prototype.jpoint = function(e, t, i) {
return new h(this, e, t, i);
};
h.prototype.toP = function() {
if (this.isInfinity()) return this.curve.point(null, null);
var e = this.z.redInvm(), t = e.redSqr(), i = this.x.redMul(t), r = this.y.redMul(t).redMul(e);
return this.curve.point(i, r);
};
h.prototype.neg = function() {
return this.curve.jpoint(this.x, this.y.redNeg(), this.z);
};
h.prototype.add = function(e) {
if (this.isInfinity()) return e;
if (e.isInfinity()) return this;
var t = e.z.redSqr(), i = this.z.redSqr(), r = this.x.redMul(t), n = e.x.redMul(i), o = this.y.redMul(t.redMul(e.z)), a = e.y.redMul(i.redMul(this.z)), s = r.redSub(n), c = o.redSub(a);
if (0 === s.cmpn(0)) return 0 !== c.cmpn(0) ? this.curve.jpoint(null, null, null) : this.dbl();
var f = s.redSqr(), h = f.redMul(s), l = r.redMul(f), d = c.redSqr().redIAdd(h).redISub(l).redISub(l), u = c.redMul(l.redISub(d)).redISub(o.redMul(h)), p = this.z.redMul(e.z).redMul(s);
return this.curve.jpoint(d, u, p);
};
h.prototype.mixedAdd = function(e) {
if (this.isInfinity()) return e.toJ();
if (e.isInfinity()) return this;
var t = this.z.redSqr(), i = this.x, r = e.x.redMul(t), n = this.y, o = e.y.redMul(t).redMul(this.z), a = i.redSub(r), s = n.redSub(o);
if (0 === a.cmpn(0)) return 0 !== s.cmpn(0) ? this.curve.jpoint(null, null, null) : this.dbl();
var c = a.redSqr(), f = c.redMul(a), h = i.redMul(c), l = s.redSqr().redIAdd(f).redISub(h).redISub(h), d = s.redMul(h.redISub(l)).redISub(n.redMul(f)), u = this.z.redMul(a);
return this.curve.jpoint(l, d, u);
};
h.prototype.dblp = function(e) {
if (0 === e) return this;
if (this.isInfinity()) return this;
if (!e) return this.dbl();
if (this.curve.zeroA || this.curve.threeA) {
for (var t = this, i = 0; i < e; i++) t = t.dbl();
return t;
}
var r = this.curve.a, n = this.curve.tinv, o = this.x, a = this.y, s = this.z, c = s.redSqr().redSqr(), f = a.redAdd(a);
for (i = 0; i < e; i++) {
var h = o.redSqr(), l = f.redSqr(), d = l.redSqr(), u = h.redAdd(h).redIAdd(h).redIAdd(r.redMul(c)), p = o.redMul(l), b = u.redSqr().redISub(p.redAdd(p)), m = p.redISub(b), g = u.redMul(m);
g = g.redIAdd(g).redISub(d);
var y = f.redMul(s);
i + 1 < e && (c = c.redMul(d));
o = b;
s = y;
f = g;
}
return this.curve.jpoint(o, f.redMul(n), s);
};
h.prototype.dbl = function() {
return this.isInfinity() ? this : this.curve.zeroA ? this._zeroDbl() : this.curve.threeA ? this._threeDbl() : this._dbl();
};
h.prototype._zeroDbl = function() {
var e, t, i;
if (this.zOne) {
var r = this.x.redSqr(), n = this.y.redSqr(), o = n.redSqr(), a = this.x.redAdd(n).redSqr().redISub(r).redISub(o);
a = a.redIAdd(a);
var s = r.redAdd(r).redIAdd(r), c = s.redSqr().redISub(a).redISub(a), f = o.redIAdd(o);
f = (f = f.redIAdd(f)).redIAdd(f);
e = c;
t = s.redMul(a.redISub(c)).redISub(f);
i = this.y.redAdd(this.y);
} else {
var h = this.x.redSqr(), l = this.y.redSqr(), d = l.redSqr(), u = this.x.redAdd(l).redSqr().redISub(h).redISub(d);
u = u.redIAdd(u);
var p = h.redAdd(h).redIAdd(h), b = p.redSqr(), m = d.redIAdd(d);
m = (m = m.redIAdd(m)).redIAdd(m);
e = b.redISub(u).redISub(u);
t = p.redMul(u.redISub(e)).redISub(m);
i = (i = this.y.redMul(this.z)).redIAdd(i);
}
return this.curve.jpoint(e, t, i);
};
h.prototype._threeDbl = function() {
var e, t, i;
if (this.zOne) {
var r = this.x.redSqr(), n = this.y.redSqr(), o = n.redSqr(), a = this.x.redAdd(n).redSqr().redISub(r).redISub(o);
a = a.redIAdd(a);
var s = r.redAdd(r).redIAdd(r).redIAdd(this.curve.a), c = s.redSqr().redISub(a).redISub(a);
e = c;
var f = o.redIAdd(o);
f = (f = f.redIAdd(f)).redIAdd(f);
t = s.redMul(a.redISub(c)).redISub(f);
i = this.y.redAdd(this.y);
} else {
var h = this.z.redSqr(), l = this.y.redSqr(), d = this.x.redMul(l), u = this.x.redSub(h).redMul(this.x.redAdd(h));
u = u.redAdd(u).redIAdd(u);
var p = d.redIAdd(d), b = (p = p.redIAdd(p)).redAdd(p);
e = u.redSqr().redISub(b);
i = this.y.redAdd(this.z).redSqr().redISub(l).redISub(h);
var m = l.redSqr();
m = (m = (m = m.redIAdd(m)).redIAdd(m)).redIAdd(m);
t = u.redMul(p.redISub(e)).redISub(m);
}
return this.curve.jpoint(e, t, i);
};
h.prototype._dbl = function() {
var e = this.curve.a, t = this.x, i = this.y, r = this.z, n = r.redSqr().redSqr(), o = t.redSqr(), a = i.redSqr(), s = o.redAdd(o).redIAdd(o).redIAdd(e.redMul(n)), c = t.redAdd(t), f = (c = c.redIAdd(c)).redMul(a), h = s.redSqr().redISub(f.redAdd(f)), l = f.redISub(h), d = a.redSqr();
d = (d = (d = d.redIAdd(d)).redIAdd(d)).redIAdd(d);
var u = s.redMul(l).redISub(d), p = i.redAdd(i).redMul(r);
return this.curve.jpoint(h, u, p);
};
h.prototype.trpl = function() {
if (!this.curve.zeroA) return this.dbl().add(this);
var e = this.x.redSqr(), t = this.y.redSqr(), i = this.z.redSqr(), r = t.redSqr(), n = e.redAdd(e).redIAdd(e), o = n.redSqr(), a = this.x.redAdd(t).redSqr().redISub(e).redISub(r), s = (a = (a = (a = a.redIAdd(a)).redAdd(a).redIAdd(a)).redISub(o)).redSqr(), c = r.redIAdd(r);
c = (c = (c = c.redIAdd(c)).redIAdd(c)).redIAdd(c);
var f = n.redIAdd(a).redSqr().redISub(o).redISub(s).redISub(c), h = t.redMul(f);
h = (h = h.redIAdd(h)).redIAdd(h);
var l = this.x.redMul(s).redISub(h);
l = (l = l.redIAdd(l)).redIAdd(l);
var d = this.y.redMul(f.redMul(c.redISub(f)).redISub(a.redMul(s)));
d = (d = (d = d.redIAdd(d)).redIAdd(d)).redIAdd(d);
var u = this.z.redAdd(a).redSqr().redISub(i).redISub(s);
return this.curve.jpoint(l, d, u);
};
h.prototype.mul = function(e, t) {
e = new S(e, t);
return this.curve._wnafMul(this, e);
};
h.prototype.eq = function(e) {
if ("affine" === e.type) return this.eq(e.toJ());
if (this === e) return !0;
var t = this.z.redSqr(), i = e.z.redSqr();
if (0 !== this.x.redMul(i).redISub(e.x.redMul(t)).cmpn(0)) return !1;
var r = t.redMul(this.z), n = i.redMul(e.z);
return 0 === this.y.redMul(n).redISub(e.y.redMul(r)).cmpn(0);
};
h.prototype.eqXToP = function(e) {
var t = this.z.redSqr(), i = e.toRed(this.curve.red).redMul(t);
if (0 === this.x.cmp(i)) return !0;
for (var r = e.clone(), n = this.curve.redN.redMul(t); ;) {
r.iadd(this.curve.n);
if (0 <= r.cmp(this.curve.p)) return !1;
i.redIAdd(n);
if (0 === this.x.cmp(i)) return !0;
}
return !1;
};
h.prototype.inspect = function() {
return this.isInfinity() ? "<EC JPoint Infinity>" : "<EC JPoint x: " + this.x.toString(16, 2) + " y: " + this.y.toString(16, 2) + " z: " + this.z.toString(16, 2) + ">";
};
h.prototype.isInfinity = function() {
return 0 === this.z.cmpn(0);
};
}, {
"../../elliptic": 67,
"../curve": 70,
"bn.js": 16,
inherits: 101
} ],
73: [ function(e, t, i) {
"use strict";
var r, n = i, o = e("hash.js"), a = e("../elliptic"), s = a.utils.assert;
function c(e) {
"short" === e.type ? this.curve = new a.curve.short(e) : "edwards" === e.type ? this.curve = new a.curve.edwards(e) : this.curve = new a.curve.mont(e);
this.g = this.curve.g;
this.n = this.curve.n;
this.hash = e.hash;
s(this.g.validate(), "Invalid curve");
s(this.g.mul(this.n).isInfinity(), "Invalid curve, G*N != O");
}
n.PresetCurve = c;
function f(t, i) {
Object.defineProperty(n, t, {
configurable: !0,
enumerable: !0,
get: function() {
var e = new c(i);
Object.defineProperty(n, t, {
configurable: !0,
enumerable: !0,
value: e
});
return e;
}
});
}
f("p192", {
type: "short",
prime: "p192",
p: "ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff",
a: "ffffffff ffffffff ffffffff fffffffe ffffffff fffffffc",
b: "64210519 e59c80e7 0fa7e9ab 72243049 feb8deec c146b9b1",
n: "ffffffff ffffffff ffffffff 99def836 146bc9b1 b4d22831",
hash: o.sha256,
gRed: !1,
g: [ "188da80e b03090f6 7cbf20eb 43a18800 f4ff0afd 82ff1012", "07192b95 ffc8da78 631011ed 6b24cdd5 73f977a1 1e794811" ]
});
f("p224", {
type: "short",
prime: "p224",
p: "ffffffff ffffffff ffffffff ffffffff 00000000 00000000 00000001",
a: "ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff fffffffe",
b: "b4050a85 0c04b3ab f5413256 5044b0b7 d7bfd8ba 270b3943 2355ffb4",
n: "ffffffff ffffffff ffffffff ffff16a2 e0b8f03e 13dd2945 5c5c2a3d",
hash: o.sha256,
gRed: !1,
g: [ "b70e0cbd 6bb4bf7f 321390b9 4a03c1d3 56c21122 343280d6 115c1d21", "bd376388 b5f723fb 4c22dfe6 cd4375a0 5a074764 44d58199 85007e34" ]
});
f("p256", {
type: "short",
prime: null,
p: "ffffffff 00000001 00000000 00000000 00000000 ffffffff ffffffff ffffffff",
a: "ffffffff 00000001 00000000 00000000 00000000 ffffffff ffffffff fffffffc",
b: "5ac635d8 aa3a93e7 b3ebbd55 769886bc 651d06b0 cc53b0f6 3bce3c3e 27d2604b",
n: "ffffffff 00000000 ffffffff ffffffff bce6faad a7179e84 f3b9cac2 fc632551",
hash: o.sha256,
gRed: !1,
g: [ "6b17d1f2 e12c4247 f8bce6e5 63a440f2 77037d81 2deb33a0 f4a13945 d898c296", "4fe342e2 fe1a7f9b 8ee7eb4a 7c0f9e16 2bce3357 6b315ece cbb64068 37bf51f5" ]
});
f("p384", {
type: "short",
prime: null,
p: "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe ffffffff 00000000 00000000 ffffffff",
a: "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe ffffffff 00000000 00000000 fffffffc",
b: "b3312fa7 e23ee7e4 988e056b e3f82d19 181d9c6e fe814112 0314088f 5013875a c656398d 8a2ed19d 2a85c8ed d3ec2aef",
n: "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff c7634d81 f4372ddf 581a0db2 48b0a77a ecec196a ccc52973",
hash: o.sha384,
gRed: !1,
g: [ "aa87ca22 be8b0537 8eb1c71e f320ad74 6e1d3b62 8ba79b98 59f741e0 82542a38 5502f25d bf55296c 3a545e38 72760ab7", "3617de4a 96262c6f 5d9e98bf 9292dc29 f8f41dbd 289a147c e9da3113 b5f0b8c0 0a60b1ce 1d7e819d 7a431d7c 90ea0e5f" ]
});
f("p521", {
type: "short",
prime: null,
p: "000001ff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff",
a: "000001ff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffc",
b: "00000051 953eb961 8e1c9a1f 929a21a0 b68540ee a2da725b 99b315f3 b8b48991 8ef109e1 56193951 ec7e937b 1652c0bd 3bb1bf07 3573df88 3d2c34f1 ef451fd4 6b503f00",
n: "000001ff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffa 51868783 bf2f966b 7fcc0148 f709a5d0 3bb5c9b8 899c47ae bb6fb71e 91386409",
hash: o.sha512,
gRed: !1,
g: [ "000000c6 858e06b7 0404e9cd 9e3ecb66 2395b442 9c648139 053fb521 f828af60 6b4d3dba a14b5e77 efe75928 fe1dc127 a2ffa8de 3348b3c1 856a429b f97e7e31 c2e5bd66", "00000118 39296a78 9a3bc004 5c8a5fb4 2c7d1bd9 98f54449 579b4468 17afbd17 273e662c 97ee7299 5ef42640 c550b901 3fad0761 353c7086 a272c240 88be9476 9fd16650" ]
});
f("curve25519", {
type: "mont",
prime: "p25519",
p: "7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed",
a: "76d06",
b: "1",
n: "1000000000000000 0000000000000000 14def9dea2f79cd6 5812631a5cf5d3ed",
hash: o.sha256,
gRed: !1,
g: [ "9" ]
});
f("ed25519", {
type: "edwards",
prime: "p25519",
p: "7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed",
a: "-1",
c: "1",
d: "52036cee2b6ffe73 8cc740797779e898 00700a4d4141d8ab 75eb4dca135978a3",
n: "1000000000000000 0000000000000000 14def9dea2f79cd6 5812631a5cf5d3ed",
hash: o.sha256,
gRed: !1,
g: [ "216936d3cd6e53fec0a4e231fdd6dc5c692cc7609525a7b2c9562d608f25d51a", "6666666666666666666666666666666666666666666666666666666666666658" ]
});
try {
r = e("./precomputed/secp256k1");
} catch (e) {
r = void 0;
}
f("secp256k1", {
type: "short",
prime: "k256",
p: "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe fffffc2f",
a: "0",
b: "7",
n: "ffffffff ffffffff ffffffff fffffffe baaedce6 af48a03b bfd25e8c d0364141",
h: "1",
hash: o.sha256,
beta: "7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee",
lambda: "5363ad4cc05c30e0a5261c028812645a122e22ea20816678df02967c1b23bd72",
basis: [ {
a: "3086d221a7d46bcde86c90e49284eb15",
b: "-e4437ed6010e88286f547fa90abfe4c3"
}, {
a: "114ca50f7a8e2f3f657c1108d9d44cfd8",
b: "3086d221a7d46bcde86c90e49284eb15"
} ],
gRed: !1,
g: [ "79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798", "483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8", r ]
});
}, {
"../elliptic": 67,
"./precomputed/secp256k1": 80,
"hash.js": 86
} ],
74: [ function(e, t, i) {
"use strict";
var m = e("bn.js"), g = e("hmac-drbg"), o = e("../../elliptic"), u = o.utils.assert, r = e("./key"), y = e("./signature");
function n(e) {
if (!(this instanceof n)) return new n(e);
if ("string" == typeof e) {
u(o.curves.hasOwnProperty(e), "Unknown curve " + e);
e = o.curves[e];
}
e instanceof o.curves.PresetCurve && (e = {
curve: e
});
this.curve = e.curve.curve;
this.n = this.curve.n;
this.nh = this.n.ushrn(1);
this.g = this.curve.g;
this.g = e.curve.g;
this.g.precompute(e.curve.n.bitLength() + 1);
this.hash = e.hash || e.curve.hash;
}
(t.exports = n).prototype.keyPair = function(e) {
return new r(this, e);
};
n.prototype.keyFromPrivate = function(e, t) {
return r.fromPrivate(this, e, t);
};
n.prototype.keyFromPublic = function(e, t) {
return r.fromPublic(this, e, t);
};
n.prototype.genKeyPair = function(e) {
e || (e = {});
for (var t = new g({
hash: this.hash,
pers: e.pers,
persEnc: e.persEnc || "utf8",
entropy: e.entropy || o.rand(this.hash.hmacStrength),
entropyEnc: e.entropy && e.entropyEnc || "utf8",
nonce: this.n.toArray()
}), i = this.n.byteLength(), r = this.n.sub(new m(2)); ;) {
var n = new m(t.generate(i));
if (!(0 < n.cmp(r))) {
n.iaddn(1);
return this.keyFromPrivate(n);
}
}
};
n.prototype._truncateToN = function(e, t) {
var i = 8 * e.byteLength() - this.n.bitLength();
0 < i && (e = e.ushrn(i));
return !t && 0 <= e.cmp(this.n) ? e.sub(this.n) : e;
};
n.prototype.sign = function(e, t, i, r) {
if ("object" == typeof i) {
r = i;
i = null;
}
r || (r = {});
t = this.keyFromPrivate(t, i);
e = this._truncateToN(new m(e, 16));
for (var n = this.n.byteLength(), o = t.getPrivate().toArray("be", n), a = e.toArray("be", n), s = new g({
hash: this.hash,
entropy: o,
nonce: a,
pers: r.pers,
persEnc: r.persEnc || "utf8"
}), c = this.n.sub(new m(1)), f = 0; ;f++) {
var h = r.k ? r.k(f) : new m(s.generate(this.n.byteLength()));
if (!((h = this._truncateToN(h, !0)).cmpn(1) <= 0 || 0 <= h.cmp(c))) {
var l = this.g.mul(h);
if (!l.isInfinity()) {
var d = l.getX(), u = d.umod(this.n);
if (0 !== u.cmpn(0)) {
var p = h.invm(this.n).mul(u.mul(t.getPrivate()).iadd(e));
if (0 !== (p = p.umod(this.n)).cmpn(0)) {
var b = (l.getY().isOdd() ? 1 : 0) | (0 !== d.cmp(u) ? 2 : 0);
if (r.canonical && 0 < p.cmp(this.nh)) {
p = this.n.sub(p);
b ^= 1;
}
return new y({
r: u,
s: p,
recoveryParam: b
});
}
}
}
}
}
};
n.prototype.verify = function(e, t, i, r) {
e = this._truncateToN(new m(e, 16));
i = this.keyFromPublic(i, r);
var n = (t = new y(t, "hex")).r, o = t.s;
if (n.cmpn(1) < 0 || 0 <= n.cmp(this.n)) return !1;
if (o.cmpn(1) < 0 || 0 <= o.cmp(this.n)) return !1;
var a = o.invm(this.n), s = a.mul(e).umod(this.n), c = a.mul(n).umod(this.n);
if (!this.curve._maxwellTrick) {
var f;
return !(f = this.g.mulAdd(s, i.getPublic(), c)).isInfinity() && 0 === f.getX().umod(this.n).cmp(n);
}
return !(f = this.g.jmulAdd(s, i.getPublic(), c)).isInfinity() && f.eqXToP(n);
};
n.prototype.recoverPubKey = function(e, t, i, r) {
u((3 & i) === i, "The recovery param is more than two bits");
t = new y(t, r);
var n = this.n, o = new m(e), a = t.r, s = t.s, c = 1 & i, f = i >> 1;
if (0 <= a.cmp(this.curve.p.umod(this.curve.n)) && f) throw new Error("Unable to find sencond key candinate");
a = f ? this.curve.pointFromX(a.add(this.curve.n), c) : this.curve.pointFromX(a, c);
var h = t.r.invm(n), l = n.sub(o).mul(h).umod(n), d = s.mul(h).umod(n);
return this.g.mulAdd(l, a, d);
};
n.prototype.getKeyRecoveryParam = function(e, t, i, r) {
if (null !== (t = new y(t, r)).recoveryParam) return t.recoveryParam;
for (var n = 0; n < 4; n++) {
var o;
try {
o = this.recoverPubKey(e, t, n);
} catch (e) {
continue;
}
if (o.eq(i)) return n;
}
throw new Error("Unable to find valid recovery factor");
};
}, {
"../../elliptic": 67,
"./key": 75,
"./signature": 76,
"bn.js": 16,
"hmac-drbg": 98
} ],
75: [ function(e, t, i) {
"use strict";
var r = e("bn.js"), n = e("../../elliptic").utils.assert;
function o(e, t) {
this.ec = e;
this.priv = null;
this.pub = null;
t.priv && this._importPrivate(t.priv, t.privEnc);
t.pub && this._importPublic(t.pub, t.pubEnc);
}
(t.exports = o).fromPublic = function(e, t, i) {
return t instanceof o ? t : new o(e, {
pub: t,
pubEnc: i
});
};
o.fromPrivate = function(e, t, i) {
return t instanceof o ? t : new o(e, {
priv: t,
privEnc: i
});
};
o.prototype.validate = function() {
var e = this.getPublic();
return e.isInfinity() ? {
result: !1,
reason: "Invalid public key"
} : e.validate() ? e.mul(this.ec.curve.n).isInfinity() ? {
result: !0,
reason: null
} : {
result: !1,
reason: "Public key * N != O"
} : {
result: !1,
reason: "Public key is not a point"
};
};
o.prototype.getPublic = function(e, t) {
if ("string" == typeof e) {
t = e;
e = null;
}
this.pub || (this.pub = this.ec.g.mul(this.priv));
return t ? this.pub.encode(t, e) : this.pub;
};
o.prototype.getPrivate = function(e) {
return "hex" === e ? this.priv.toString(16, 2) : this.priv;
};
o.prototype._importPrivate = function(e, t) {
this.priv = new r(e, t || 16);
this.priv = this.priv.umod(this.ec.curve.n);
};
o.prototype._importPublic = function(e, t) {
if (e.x || e.y) {
"mont" === this.ec.curve.type ? n(e.x, "Need x coordinate") : "short" !== this.ec.curve.type && "edwards" !== this.ec.curve.type || n(e.x && e.y, "Need both x and y coordinate");
this.pub = this.ec.curve.point(e.x, e.y);
} else this.pub = this.ec.curve.decodePoint(e, t);
};
o.prototype.derive = function(e) {
return e.mul(this.priv).getX();
};
o.prototype.sign = function(e, t, i) {
return this.ec.sign(e, this, t, i);
};
o.prototype.verify = function(e, t) {
return this.ec.verify(e, t, this);
};
o.prototype.inspect = function() {
return "<Key priv: " + (this.priv && this.priv.toString(16, 2)) + " pub: " + (this.pub && this.pub.inspect()) + " >";
};
}, {
"../../elliptic": 67,
"bn.js": 16
} ],
76: [ function(e, t, i) {
"use strict";
var s = e("bn.js"), c = e("../../elliptic").utils, r = c.assert;
function n(e, t) {
if (e instanceof n) return e;
if (!this._importDER(e, t)) {
r(e.r && e.s, "Signature without r or s");
this.r = new s(e.r, 16);
this.s = new s(e.s, 16);
void 0 === e.recoveryParam ? this.recoveryParam = null : this.recoveryParam = e.recoveryParam;
}
}
function f() {
this.place = 0;
}
function h(e, t) {
var i = e[t.place++];
if (!(128 & i)) return i;
for (var r = 15 & i, n = 0, o = 0, a = t.place; o < r; o++, a++) {
n <<= 8;
n |= e[a];
}
t.place = a;
return n;
}
function a(e) {
for (var t = 0, i = e.length - 1; !e[t] && !(128 & e[t + 1]) && t < i; ) t++;
return 0 === t ? e : e.slice(t);
}
(t.exports = n).prototype._importDER = function(e, t) {
e = c.toArray(e, t);
var i = new f();
if (48 !== e[i.place++]) return !1;
if (h(e, i) + i.place !== e.length) return !1;
if (2 !== e[i.place++]) return !1;
var r = h(e, i), n = e.slice(i.place, r + i.place);
i.place += r;
if (2 !== e[i.place++]) return !1;
var o = h(e, i);
if (e.length !== o + i.place) return !1;
var a = e.slice(i.place, o + i.place);
0 === n[0] && 128 & n[1] && (n = n.slice(1));
0 === a[0] && 128 & a[1] && (a = a.slice(1));
this.r = new s(n);
this.s = new s(a);
return !(this.recoveryParam = null);
};
function l(e, t) {
if (t < 128) e.push(t); else {
var i = 1 + (Math.log(t) / Math.LN2 >>> 3);
e.push(128 | i);
for (;--i; ) e.push(t >>> (i << 3) & 255);
e.push(t);
}
}
n.prototype.toDER = function(e) {
var t = this.r.toArray(), i = this.s.toArray();
128 & t[0] && (t = [ 0 ].concat(t));
128 & i[0] && (i = [ 0 ].concat(i));
t = a(t);
i = a(i);
for (;!(i[0] || 128 & i[1]); ) i = i.slice(1);
var r = [ 2 ];
l(r, t.length);
(r = r.concat(t)).push(2);
l(r, i.length);
var n = r.concat(i), o = [ 48 ];
l(o, n.length);
o = o.concat(n);
return c.encode(o, e);
};
}, {
"../../elliptic": 67,
"bn.js": 16
} ],
77: [ function(e, t, i) {
"use strict";
var r = e("hash.js"), n = e("../../elliptic"), o = n.utils, a = o.assert, c = o.parseBytes, s = e("./key"), f = e("./signature");
function h(e) {
a("ed25519" === e, "only tested with ed25519 so far");
if (!(this instanceof h)) return new h(e);
e = n.curves[e].curve;
this.curve = e;
this.g = e.g;
this.g.precompute(e.n.bitLength() + 1);
this.pointClass = e.point().constructor;
this.encodingLength = Math.ceil(e.n.bitLength() / 8);
this.hash = r.sha512;
}
(t.exports = h).prototype.sign = function(e, t) {
e = c(e);
var i = this.keyFromSecret(t), r = this.hashInt(i.messagePrefix(), e), n = this.g.mul(r), o = this.encodePoint(n), a = this.hashInt(o, i.pubBytes(), e).mul(i.priv()), s = r.add(a).umod(this.curve.n);
return this.makeSignature({
R: n,
S: s,
Rencoded: o
});
};
h.prototype.verify = function(e, t, i) {
e = c(e);
t = this.makeSignature(t);
var r = this.keyFromPublic(i), n = this.hashInt(t.Rencoded(), r.pubBytes(), e), o = this.g.mul(t.S());
return t.R().add(r.pub().mul(n)).eq(o);
};
h.prototype.hashInt = function() {
for (var e = this.hash(), t = 0; t < arguments.length; t++) e.update(arguments[t]);
return o.intFromLE(e.digest()).umod(this.curve.n);
};
h.prototype.keyFromPublic = function(e) {
return s.fromPublic(this, e);
};
h.prototype.keyFromSecret = function(e) {
return s.fromSecret(this, e);
};
h.prototype.makeSignature = function(e) {
return e instanceof f ? e : new f(this, e);
};
h.prototype.encodePoint = function(e) {
var t = e.getY().toArray("le", this.encodingLength);
t[this.encodingLength - 1] |= e.getX().isOdd() ? 128 : 0;
return t;
};
h.prototype.decodePoint = function(e) {
var t = (e = o.parseBytes(e)).length - 1, i = e.slice(0, t).concat(-129 & e[t]), r = 0 != (128 & e[t]), n = o.intFromLE(i);
return this.curve.pointFromY(n, r);
};
h.prototype.encodeInt = function(e) {
return e.toArray("le", this.encodingLength);
};
h.prototype.decodeInt = function(e) {
return o.intFromLE(e);
};
h.prototype.isPoint = function(e) {
return e instanceof this.pointClass;
};
}, {
"../../elliptic": 67,
"./key": 78,
"./signature": 79,
"hash.js": 86
} ],
78: [ function(e, t, i) {
"use strict";
var r = e("../../elliptic").utils, n = r.assert, o = r.parseBytes, a = r.cachedProperty;
function s(e, t) {
this.eddsa = e;
this._secret = o(t.secret);
e.isPoint(t.pub) ? this._pub = t.pub : this._pubBytes = o(t.pub);
}
s.fromPublic = function(e, t) {
return t instanceof s ? t : new s(e, {
pub: t
});
};
s.fromSecret = function(e, t) {
return t instanceof s ? t : new s(e, {
secret: t
});
};
s.prototype.secret = function() {
return this._secret;
};
a(s, "pubBytes", function() {
return this.eddsa.encodePoint(this.pub());
});
a(s, "pub", function() {
return this._pubBytes ? this.eddsa.decodePoint(this._pubBytes) : this.eddsa.g.mul(this.priv());
});
a(s, "privBytes", function() {
var e = this.eddsa, t = this.hash(), i = e.encodingLength - 1, r = t.slice(0, e.encodingLength);
r[0] &= 248;
r[i] &= 127;
r[i] |= 64;
return r;
});
a(s, "priv", function() {
return this.eddsa.decodeInt(this.privBytes());
});
a(s, "hash", function() {
return this.eddsa.hash().update(this.secret()).digest();
});
a(s, "messagePrefix", function() {
return this.hash().slice(this.eddsa.encodingLength);
});
s.prototype.sign = function(e) {
n(this._secret, "KeyPair can only verify");
return this.eddsa.sign(e, this);
};
s.prototype.verify = function(e, t) {
return this.eddsa.verify(e, t, this);
};
s.prototype.getSecret = function(e) {
n(this._secret, "KeyPair is public only");
return r.encode(this.secret(), e);
};
s.prototype.getPublic = function(e) {
return r.encode(this.pubBytes(), e);
};
t.exports = s;
}, {
"../../elliptic": 67
} ],
79: [ function(e, t, i) {
"use strict";
var r = e("bn.js"), n = e("../../elliptic").utils, o = n.assert, a = n.cachedProperty, s = n.parseBytes;
function c(e, t) {
this.eddsa = e;
"object" != typeof t && (t = s(t));
Array.isArray(t) && (t = {
R: t.slice(0, e.encodingLength),
S: t.slice(e.encodingLength)
});
o(t.R && t.S, "Signature without R or S");
e.isPoint(t.R) && (this._R = t.R);
t.S instanceof r && (this._S = t.S);
this._Rencoded = Array.isArray(t.R) ? t.R : t.Rencoded;
this._Sencoded = Array.isArray(t.S) ? t.S : t.Sencoded;
}
a(c, "S", function() {
return this.eddsa.decodeInt(this.Sencoded());
});
a(c, "R", function() {
return this.eddsa.decodePoint(this.Rencoded());
});
a(c, "Rencoded", function() {
return this.eddsa.encodePoint(this.R());
});
a(c, "Sencoded", function() {
return this.eddsa.encodeInt(this.S());
});
c.prototype.toBytes = function() {
return this.Rencoded().concat(this.Sencoded());
};
c.prototype.toHex = function() {
return n.encode(this.toBytes(), "hex").toUpperCase();
};
t.exports = c;
}, {
"../../elliptic": 67,
"bn.js": 16
} ],
80: [ function(e, t, i) {
t.exports = {
doubles: {
step: 4,
points: [ [ "e60fce93b59e9ec53011aabc21c23e97b2a31369b87a5ae9c44ee89e2a6dec0a", "f7e3507399e595929db99f34f57937101296891e44d23f0be1f32cce69616821" ], [ "8282263212c609d9ea2a6e3e172de238d8c39cabd5ac1ca10646e23fd5f51508", "11f8a8098557dfe45e8256e830b60ace62d613ac2f7b17bed31b6eaff6e26caf" ], [ "175e159f728b865a72f99cc6c6fc846de0b93833fd2222ed73fce5b551e5b739", "d3506e0d9e3c79eba4ef97a51ff71f5eacb5955add24345c6efa6ffee9fed695" ], [ "363d90d447b00c9c99ceac05b6262ee053441c7e55552ffe526bad8f83ff4640", "4e273adfc732221953b445397f3363145b9a89008199ecb62003c7f3bee9de9" ], [ "8b4b5f165df3c2be8c6244b5b745638843e4a781a15bcd1b69f79a55dffdf80c", "4aad0a6f68d308b4b3fbd7813ab0da04f9e336546162ee56b3eff0c65fd4fd36" ], [ "723cbaa6e5db996d6bf771c00bd548c7b700dbffa6c0e77bcb6115925232fcda", "96e867b5595cc498a921137488824d6e2660a0653779494801dc069d9eb39f5f" ], [ "eebfa4d493bebf98ba5feec812c2d3b50947961237a919839a533eca0e7dd7fa", "5d9a8ca3970ef0f269ee7edaf178089d9ae4cdc3a711f712ddfd4fdae1de8999" ], [ "100f44da696e71672791d0a09b7bde459f1215a29b3c03bfefd7835b39a48db0", "cdd9e13192a00b772ec8f3300c090666b7ff4a18ff5195ac0fbd5cd62bc65a09" ], [ "e1031be262c7ed1b1dc9227a4a04c017a77f8d4464f3b3852c8acde6e534fd2d", "9d7061928940405e6bb6a4176597535af292dd419e1ced79a44f18f29456a00d" ], [ "feea6cae46d55b530ac2839f143bd7ec5cf8b266a41d6af52d5e688d9094696d", "e57c6b6c97dce1bab06e4e12bf3ecd5c981c8957cc41442d3155debf18090088" ], [ "da67a91d91049cdcb367be4be6ffca3cfeed657d808583de33fa978bc1ec6cb1", "9bacaa35481642bc41f463f7ec9780e5dec7adc508f740a17e9ea8e27a68be1d" ], [ "53904faa0b334cdda6e000935ef22151ec08d0f7bb11069f57545ccc1a37b7c0", "5bc087d0bc80106d88c9eccac20d3c1c13999981e14434699dcb096b022771c8" ], [ "8e7bcd0bd35983a7719cca7764ca906779b53a043a9b8bcaeff959f43ad86047", "10b7770b2a3da4b3940310420ca9514579e88e2e47fd68b3ea10047e8460372a" ], [ "385eed34c1cdff21e6d0818689b81bde71a7f4f18397e6690a841e1599c43862", "283bebc3e8ea23f56701de19e9ebf4576b304eec2086dc8cc0458fe5542e5453" ], [ "6f9d9b803ecf191637c73a4413dfa180fddf84a5947fbc9c606ed86c3fac3a7", "7c80c68e603059ba69b8e2a30e45c4d47ea4dd2f5c281002d86890603a842160" ], [ "3322d401243c4e2582a2147c104d6ecbf774d163db0f5e5313b7e0e742d0e6bd", "56e70797e9664ef5bfb019bc4ddaf9b72805f63ea2873af624f3a2e96c28b2a0" ], [ "85672c7d2de0b7da2bd1770d89665868741b3f9af7643397721d74d28134ab83", "7c481b9b5b43b2eb6374049bfa62c2e5e77f17fcc5298f44c8e3094f790313a6" ], [ "948bf809b1988a46b06c9f1919413b10f9226c60f668832ffd959af60c82a0a", "53a562856dcb6646dc6b74c5d1c3418c6d4dff08c97cd2bed4cb7f88d8c8e589" ], [ "6260ce7f461801c34f067ce0f02873a8f1b0e44dfc69752accecd819f38fd8e8", "bc2da82b6fa5b571a7f09049776a1ef7ecd292238051c198c1a84e95b2b4ae17" ], [ "e5037de0afc1d8d43d8348414bbf4103043ec8f575bfdc432953cc8d2037fa2d", "4571534baa94d3b5f9f98d09fb990bddbd5f5b03ec481f10e0e5dc841d755bda" ], [ "e06372b0f4a207adf5ea905e8f1771b4e7e8dbd1c6a6c5b725866a0ae4fce725", "7a908974bce18cfe12a27bb2ad5a488cd7484a7787104870b27034f94eee31dd" ], [ "213c7a715cd5d45358d0bbf9dc0ce02204b10bdde2a3f58540ad6908d0559754", "4b6dad0b5ae462507013ad06245ba190bb4850f5f36a7eeddff2c27534b458f2" ], [ "4e7c272a7af4b34e8dbb9352a5419a87e2838c70adc62cddf0cc3a3b08fbd53c", "17749c766c9d0b18e16fd09f6def681b530b9614bff7dd33e0b3941817dcaae6" ], [ "fea74e3dbe778b1b10f238ad61686aa5c76e3db2be43057632427e2840fb27b6", "6e0568db9b0b13297cf674deccb6af93126b596b973f7b77701d3db7f23cb96f" ], [ "76e64113f677cf0e10a2570d599968d31544e179b760432952c02a4417bdde39", "c90ddf8dee4e95cf577066d70681f0d35e2a33d2b56d2032b4b1752d1901ac01" ], [ "c738c56b03b2abe1e8281baa743f8f9a8f7cc643df26cbee3ab150242bcbb891", "893fb578951ad2537f718f2eacbfbbbb82314eef7880cfe917e735d9699a84c3" ], [ "d895626548b65b81e264c7637c972877d1d72e5f3a925014372e9f6588f6c14b", "febfaa38f2bc7eae728ec60818c340eb03428d632bb067e179363ed75d7d991f" ], [ "b8da94032a957518eb0f6433571e8761ceffc73693e84edd49150a564f676e03", "2804dfa44805a1e4d7c99cc9762808b092cc584d95ff3b511488e4e74efdf6e7" ], [ "e80fea14441fb33a7d8adab9475d7fab2019effb5156a792f1a11778e3c0df5d", "eed1de7f638e00771e89768ca3ca94472d155e80af322ea9fcb4291b6ac9ec78" ], [ "a301697bdfcd704313ba48e51d567543f2a182031efd6915ddc07bbcc4e16070", "7370f91cfb67e4f5081809fa25d40f9b1735dbf7c0a11a130c0d1a041e177ea1" ], [ "90ad85b389d6b936463f9d0512678de208cc330b11307fffab7ac63e3fb04ed4", "e507a3620a38261affdcbd9427222b839aefabe1582894d991d4d48cb6ef150" ], [ "8f68b9d2f63b5f339239c1ad981f162ee88c5678723ea3351b7b444c9ec4c0da", "662a9f2dba063986de1d90c2b6be215dbbea2cfe95510bfdf23cbf79501fff82" ], [ "e4f3fb0176af85d65ff99ff9198c36091f48e86503681e3e6686fd5053231e11", "1e63633ad0ef4f1c1661a6d0ea02b7286cc7e74ec951d1c9822c38576feb73bc" ], [ "8c00fa9b18ebf331eb961537a45a4266c7034f2f0d4e1d0716fb6eae20eae29e", "efa47267fea521a1a9dc343a3736c974c2fadafa81e36c54e7d2a4c66702414b" ], [ "e7a26ce69dd4829f3e10cec0a9e98ed3143d084f308b92c0997fddfc60cb3e41", "2a758e300fa7984b471b006a1aafbb18d0a6b2c0420e83e20e8a9421cf2cfd51" ], [ "b6459e0ee3662ec8d23540c223bcbdc571cbcb967d79424f3cf29eb3de6b80ef", "67c876d06f3e06de1dadf16e5661db3c4b3ae6d48e35b2ff30bf0b61a71ba45" ], [ "d68a80c8280bb840793234aa118f06231d6f1fc67e73c5a5deda0f5b496943e8", "db8ba9fff4b586d00c4b1f9177b0e28b5b0e7b8f7845295a294c84266b133120" ], [ "324aed7df65c804252dc0270907a30b09612aeb973449cea4095980fc28d3d5d", "648a365774b61f2ff130c0c35aec1f4f19213b0c7e332843967224af96ab7c84" ], [ "4df9c14919cde61f6d51dfdbe5fee5dceec4143ba8d1ca888e8bd373fd054c96", "35ec51092d8728050974c23a1d85d4b5d506cdc288490192ebac06cad10d5d" ], [ "9c3919a84a474870faed8a9c1cc66021523489054d7f0308cbfc99c8ac1f98cd", "ddb84f0f4a4ddd57584f044bf260e641905326f76c64c8e6be7e5e03d4fc599d" ], [ "6057170b1dd12fdf8de05f281d8e06bb91e1493a8b91d4cc5a21382120a959e5", "9a1af0b26a6a4807add9a2daf71df262465152bc3ee24c65e899be932385a2a8" ], [ "a576df8e23a08411421439a4518da31880cef0fba7d4df12b1a6973eecb94266", "40a6bf20e76640b2c92b97afe58cd82c432e10a7f514d9f3ee8be11ae1b28ec8" ], [ "7778a78c28dec3e30a05fe9629de8c38bb30d1f5cf9a3a208f763889be58ad71", "34626d9ab5a5b22ff7098e12f2ff580087b38411ff24ac563b513fc1fd9f43ac" ], [ "928955ee637a84463729fd30e7afd2ed5f96274e5ad7e5cb09eda9c06d903ac", "c25621003d3f42a827b78a13093a95eeac3d26efa8a8d83fc5180e935bcd091f" ], [ "85d0fef3ec6db109399064f3a0e3b2855645b4a907ad354527aae75163d82751", "1f03648413a38c0be29d496e582cf5663e8751e96877331582c237a24eb1f962" ], [ "ff2b0dce97eece97c1c9b6041798b85dfdfb6d8882da20308f5404824526087e", "493d13fef524ba188af4c4dc54d07936c7b7ed6fb90e2ceb2c951e01f0c29907" ], [ "827fbbe4b1e880ea9ed2b2e6301b212b57f1ee148cd6dd28780e5e2cf856e241", "c60f9c923c727b0b71bef2c67d1d12687ff7a63186903166d605b68baec293ec" ], [ "eaa649f21f51bdbae7be4ae34ce6e5217a58fdce7f47f9aa7f3b58fa2120e2b3", "be3279ed5bbbb03ac69a80f89879aa5a01a6b965f13f7e59d47a5305ba5ad93d" ], [ "e4a42d43c5cf169d9391df6decf42ee541b6d8f0c9a137401e23632dda34d24f", "4d9f92e716d1c73526fc99ccfb8ad34ce886eedfa8d8e4f13a7f7131deba9414" ], [ "1ec80fef360cbdd954160fadab352b6b92b53576a88fea4947173b9d4300bf19", "aeefe93756b5340d2f3a4958a7abbf5e0146e77f6295a07b671cdc1cc107cefd" ], [ "146a778c04670c2f91b00af4680dfa8bce3490717d58ba889ddb5928366642be", "b318e0ec3354028add669827f9d4b2870aaa971d2f7e5ed1d0b297483d83efd0" ], [ "fa50c0f61d22e5f07e3acebb1aa07b128d0012209a28b9776d76a8793180eef9", "6b84c6922397eba9b72cd2872281a68a5e683293a57a213b38cd8d7d3f4f2811" ], [ "da1d61d0ca721a11b1a5bf6b7d88e8421a288ab5d5bba5220e53d32b5f067ec2", "8157f55a7c99306c79c0766161c91e2966a73899d279b48a655fba0f1ad836f1" ], [ "a8e282ff0c9706907215ff98e8fd416615311de0446f1e062a73b0610d064e13", "7f97355b8db81c09abfb7f3c5b2515888b679a3e50dd6bd6cef7c73111f4cc0c" ], [ "174a53b9c9a285872d39e56e6913cab15d59b1fa512508c022f382de8319497c", "ccc9dc37abfc9c1657b4155f2c47f9e6646b3a1d8cb9854383da13ac079afa73" ], [ "959396981943785c3d3e57edf5018cdbe039e730e4918b3d884fdff09475b7ba", "2e7e552888c331dd8ba0386a4b9cd6849c653f64c8709385e9b8abf87524f2fd" ], [ "d2a63a50ae401e56d645a1153b109a8fcca0a43d561fba2dbb51340c9d82b151", "e82d86fb6443fcb7565aee58b2948220a70f750af484ca52d4142174dcf89405" ], [ "64587e2335471eb890ee7896d7cfdc866bacbdbd3839317b3436f9b45617e073", "d99fcdd5bf6902e2ae96dd6447c299a185b90a39133aeab358299e5e9faf6589" ], [ "8481bde0e4e4d885b3a546d3e549de042f0aa6cea250e7fd358d6c86dd45e458", "38ee7b8cba5404dd84a25bf39cecb2ca900a79c42b262e556d64b1b59779057e" ], [ "13464a57a78102aa62b6979ae817f4637ffcfed3c4b1ce30bcd6303f6caf666b", "69be159004614580ef7e433453ccb0ca48f300a81d0942e13f495a907f6ecc27" ], [ "bc4a9df5b713fe2e9aef430bcc1dc97a0cd9ccede2f28588cada3a0d2d83f366", "d3a81ca6e785c06383937adf4b798caa6e8a9fbfa547b16d758d666581f33c1" ], [ "8c28a97bf8298bc0d23d8c749452a32e694b65e30a9472a3954ab30fe5324caa", "40a30463a3305193378fedf31f7cc0eb7ae784f0451cb9459e71dc73cbef9482" ], [ "8ea9666139527a8c1dd94ce4f071fd23c8b350c5a4bb33748c4ba111faccae0", "620efabbc8ee2782e24e7c0cfb95c5d735b783be9cf0f8e955af34a30e62b945" ], [ "dd3625faef5ba06074669716bbd3788d89bdde815959968092f76cc4eb9a9787", "7a188fa3520e30d461da2501045731ca941461982883395937f68d00c644a573" ], [ "f710d79d9eb962297e4f6232b40e8f7feb2bc63814614d692c12de752408221e", "ea98e67232d3b3295d3b535532115ccac8612c721851617526ae47a9c77bfc82" ] ]
},
naf: {
wnd: 7,
points: [ [ "f9308a019258c31049344f85f89d5229b531c845836f99b08601f113bce036f9", "388f7b0f632de8140fe337e62a37f3566500a99934c2231b6cb9fd7584b8e672" ], [ "2f8bde4d1a07209355b4a7250a5c5128e88b84bddc619ab7cba8d569b240efe4", "d8ac222636e5e3d6d4dba9dda6c9c426f788271bab0d6840dca87d3aa6ac62d6" ], [ "5cbdf0646e5db4eaa398f365f2ea7a0e3d419b7e0330e39ce92bddedcac4f9bc", "6aebca40ba255960a3178d6d861a54dba813d0b813fde7b5a5082628087264da" ], [ "acd484e2f0c7f65309ad178a9f559abde09796974c57e714c35f110dfc27ccbe", "cc338921b0a7d9fd64380971763b61e9add888a4375f8e0f05cc262ac64f9c37" ], [ "774ae7f858a9411e5ef4246b70c65aac5649980be5c17891bbec17895da008cb", "d984a032eb6b5e190243dd56d7b7b365372db1e2dff9d6a8301d74c9c953c61b" ], [ "f28773c2d975288bc7d1d205c3748651b075fbc6610e58cddeeddf8f19405aa8", "ab0902e8d880a89758212eb65cdaf473a1a06da521fa91f29b5cb52db03ed81" ], [ "d7924d4f7d43ea965a465ae3095ff41131e5946f3c85f79e44adbcf8e27e080e", "581e2872a86c72a683842ec228cc6defea40af2bd896d3a5c504dc9ff6a26b58" ], [ "defdea4cdb677750a420fee807eacf21eb9898ae79b9768766e4faa04a2d4a34", "4211ab0694635168e997b0ead2a93daeced1f4a04a95c0f6cfb199f69e56eb77" ], [ "2b4ea0a797a443d293ef5cff444f4979f06acfebd7e86d277475656138385b6c", "85e89bc037945d93b343083b5a1c86131a01f60c50269763b570c854e5c09b7a" ], [ "352bbf4a4cdd12564f93fa332ce333301d9ad40271f8107181340aef25be59d5", "321eb4075348f534d59c18259dda3e1f4a1b3b2e71b1039c67bd3d8bcf81998c" ], [ "2fa2104d6b38d11b0230010559879124e42ab8dfeff5ff29dc9cdadd4ecacc3f", "2de1068295dd865b64569335bd5dd80181d70ecfc882648423ba76b532b7d67" ], [ "9248279b09b4d68dab21a9b066edda83263c3d84e09572e269ca0cd7f5453714", "73016f7bf234aade5d1aa71bdea2b1ff3fc0de2a887912ffe54a32ce97cb3402" ], [ "daed4f2be3a8bf278e70132fb0beb7522f570e144bf615c07e996d443dee8729", "a69dce4a7d6c98e8d4a1aca87ef8d7003f83c230f3afa726ab40e52290be1c55" ], [ "c44d12c7065d812e8acf28d7cbb19f9011ecd9e9fdf281b0e6a3b5e87d22e7db", "2119a460ce326cdc76c45926c982fdac0e106e861edf61c5a039063f0e0e6482" ], [ "6a245bf6dc698504c89a20cfded60853152b695336c28063b61c65cbd269e6b4", "e022cf42c2bd4a708b3f5126f16a24ad8b33ba48d0423b6efd5e6348100d8a82" ], [ "1697ffa6fd9de627c077e3d2fe541084ce13300b0bec1146f95ae57f0d0bd6a5", "b9c398f186806f5d27561506e4557433a2cf15009e498ae7adee9d63d01b2396" ], [ "605bdb019981718b986d0f07e834cb0d9deb8360ffb7f61df982345ef27a7479", "2972d2de4f8d20681a78d93ec96fe23c26bfae84fb14db43b01e1e9056b8c49" ], [ "62d14dab4150bf497402fdc45a215e10dcb01c354959b10cfe31c7e9d87ff33d", "80fc06bd8cc5b01098088a1950eed0db01aa132967ab472235f5642483b25eaf" ], [ "80c60ad0040f27dade5b4b06c408e56b2c50e9f56b9b8b425e555c2f86308b6f", "1c38303f1cc5c30f26e66bad7fe72f70a65eed4cbe7024eb1aa01f56430bd57a" ], [ "7a9375ad6167ad54aa74c6348cc54d344cc5dc9487d847049d5eabb0fa03c8fb", "d0e3fa9eca8726909559e0d79269046bdc59ea10c70ce2b02d499ec224dc7f7" ], [ "d528ecd9b696b54c907a9ed045447a79bb408ec39b68df504bb51f459bc3ffc9", "eecf41253136e5f99966f21881fd656ebc4345405c520dbc063465b521409933" ], [ "49370a4b5f43412ea25f514e8ecdad05266115e4a7ecb1387231808f8b45963", "758f3f41afd6ed428b3081b0512fd62a54c3f3afbb5b6764b653052a12949c9a" ], [ "77f230936ee88cbbd73df930d64702ef881d811e0e1498e2f1c13eb1fc345d74", "958ef42a7886b6400a08266e9ba1b37896c95330d97077cbbe8eb3c7671c60d6" ], [ "f2dac991cc4ce4b9ea44887e5c7c0bce58c80074ab9d4dbaeb28531b7739f530", "e0dedc9b3b2f8dad4da1f32dec2531df9eb5fbeb0598e4fd1a117dba703a3c37" ], [ "463b3d9f662621fb1b4be8fbbe2520125a216cdfc9dae3debcba4850c690d45b", "5ed430d78c296c3543114306dd8622d7c622e27c970a1de31cb377b01af7307e" ], [ "f16f804244e46e2a09232d4aff3b59976b98fac14328a2d1a32496b49998f247", "cedabd9b82203f7e13d206fcdf4e33d92a6c53c26e5cce26d6579962c4e31df6" ], [ "caf754272dc84563b0352b7a14311af55d245315ace27c65369e15f7151d41d1", "cb474660ef35f5f2a41b643fa5e460575f4fa9b7962232a5c32f908318a04476" ], [ "2600ca4b282cb986f85d0f1709979d8b44a09c07cb86d7c124497bc86f082120", "4119b88753c15bd6a693b03fcddbb45d5ac6be74ab5f0ef44b0be9475a7e4b40" ], [ "7635ca72d7e8432c338ec53cd12220bc01c48685e24f7dc8c602a7746998e435", "91b649609489d613d1d5e590f78e6d74ecfc061d57048bad9e76f302c5b9c61" ], [ "754e3239f325570cdbbf4a87deee8a66b7f2b33479d468fbc1a50743bf56cc18", "673fb86e5bda30fb3cd0ed304ea49a023ee33d0197a695d0c5d98093c536683" ], [ "e3e6bd1071a1e96aff57859c82d570f0330800661d1c952f9fe2694691d9b9e8", "59c9e0bba394e76f40c0aa58379a3cb6a5a2283993e90c4167002af4920e37f5" ], [ "186b483d056a033826ae73d88f732985c4ccb1f32ba35f4b4cc47fdcf04aa6eb", "3b952d32c67cf77e2e17446e204180ab21fb8090895138b4a4a797f86e80888b" ], [ "df9d70a6b9876ce544c98561f4be4f725442e6d2b737d9c91a8321724ce0963f", "55eb2dafd84d6ccd5f862b785dc39d4ab157222720ef9da217b8c45cf2ba2417" ], [ "5edd5cc23c51e87a497ca815d5dce0f8ab52554f849ed8995de64c5f34ce7143", "efae9c8dbc14130661e8cec030c89ad0c13c66c0d17a2905cdc706ab7399a868" ], [ "290798c2b6476830da12fe02287e9e777aa3fba1c355b17a722d362f84614fba", "e38da76dcd440621988d00bcf79af25d5b29c094db2a23146d003afd41943e7a" ], [ "af3c423a95d9f5b3054754efa150ac39cd29552fe360257362dfdecef4053b45", "f98a3fd831eb2b749a93b0e6f35cfb40c8cd5aa667a15581bc2feded498fd9c6" ], [ "766dbb24d134e745cccaa28c99bf274906bb66b26dcf98df8d2fed50d884249a", "744b1152eacbe5e38dcc887980da38b897584a65fa06cedd2c924f97cbac5996" ], [ "59dbf46f8c94759ba21277c33784f41645f7b44f6c596a58ce92e666191abe3e", "c534ad44175fbc300f4ea6ce648309a042ce739a7919798cd85e216c4a307f6e" ], [ "f13ada95103c4537305e691e74e9a4a8dd647e711a95e73cb62dc6018cfd87b8", "e13817b44ee14de663bf4bc808341f326949e21a6a75c2570778419bdaf5733d" ], [ "7754b4fa0e8aced06d4167a2c59cca4cda1869c06ebadfb6488550015a88522c", "30e93e864e669d82224b967c3020b8fa8d1e4e350b6cbcc537a48b57841163a2" ], [ "948dcadf5990e048aa3874d46abef9d701858f95de8041d2a6828c99e2262519", "e491a42537f6e597d5d28a3224b1bc25df9154efbd2ef1d2cbba2cae5347d57e" ], [ "7962414450c76c1689c7b48f8202ec37fb224cf5ac0bfa1570328a8a3d7c77ab", "100b610ec4ffb4760d5c1fc133ef6f6b12507a051f04ac5760afa5b29db83437" ], [ "3514087834964b54b15b160644d915485a16977225b8847bb0dd085137ec47ca", "ef0afbb2056205448e1652c48e8127fc6039e77c15c2378b7e7d15a0de293311" ], [ "d3cc30ad6b483e4bc79ce2c9dd8bc54993e947eb8df787b442943d3f7b527eaf", "8b378a22d827278d89c5e9be8f9508ae3c2ad46290358630afb34db04eede0a4" ], [ "1624d84780732860ce1c78fcbfefe08b2b29823db913f6493975ba0ff4847610", "68651cf9b6da903e0914448c6cd9d4ca896878f5282be4c8cc06e2a404078575" ], [ "733ce80da955a8a26902c95633e62a985192474b5af207da6df7b4fd5fc61cd4", "f5435a2bd2badf7d485a4d8b8db9fcce3e1ef8e0201e4578c54673bc1dc5ea1d" ], [ "15d9441254945064cf1a1c33bbd3b49f8966c5092171e699ef258dfab81c045c", "d56eb30b69463e7234f5137b73b84177434800bacebfc685fc37bbe9efe4070d" ], [ "a1d0fcf2ec9de675b612136e5ce70d271c21417c9d2b8aaaac138599d0717940", "edd77f50bcb5a3cab2e90737309667f2641462a54070f3d519212d39c197a629" ], [ "e22fbe15c0af8ccc5780c0735f84dbe9a790badee8245c06c7ca37331cb36980", "a855babad5cd60c88b430a69f53a1a7a38289154964799be43d06d77d31da06" ], [ "311091dd9860e8e20ee13473c1155f5f69635e394704eaa74009452246cfa9b3", "66db656f87d1f04fffd1f04788c06830871ec5a64feee685bd80f0b1286d8374" ], [ "34c1fd04d301be89b31c0442d3e6ac24883928b45a9340781867d4232ec2dbdf", "9414685e97b1b5954bd46f730174136d57f1ceeb487443dc5321857ba73abee" ], [ "f219ea5d6b54701c1c14de5b557eb42a8d13f3abbcd08affcc2a5e6b049b8d63", "4cb95957e83d40b0f73af4544cccf6b1f4b08d3c07b27fb8d8c2962a400766d1" ], [ "d7b8740f74a8fbaab1f683db8f45de26543a5490bca627087236912469a0b448", "fa77968128d9c92ee1010f337ad4717eff15db5ed3c049b3411e0315eaa4593b" ], [ "32d31c222f8f6f0ef86f7c98d3a3335ead5bcd32abdd94289fe4d3091aa824bf", "5f3032f5892156e39ccd3d7915b9e1da2e6dac9e6f26e961118d14b8462e1661" ], [ "7461f371914ab32671045a155d9831ea8793d77cd59592c4340f86cbc18347b5", "8ec0ba238b96bec0cbdddcae0aa442542eee1ff50c986ea6b39847b3cc092ff6" ], [ "ee079adb1df1860074356a25aa38206a6d716b2c3e67453d287698bad7b2b2d6", "8dc2412aafe3be5c4c5f37e0ecc5f9f6a446989af04c4e25ebaac479ec1c8c1e" ], [ "16ec93e447ec83f0467b18302ee620f7e65de331874c9dc72bfd8616ba9da6b5", "5e4631150e62fb40d0e8c2a7ca5804a39d58186a50e497139626778e25b0674d" ], [ "eaa5f980c245f6f038978290afa70b6bd8855897f98b6aa485b96065d537bd99", "f65f5d3e292c2e0819a528391c994624d784869d7e6ea67fb18041024edc07dc" ], [ "78c9407544ac132692ee1910a02439958ae04877151342ea96c4b6b35a49f51", "f3e0319169eb9b85d5404795539a5e68fa1fbd583c064d2462b675f194a3ddb4" ], [ "494f4be219a1a77016dcd838431aea0001cdc8ae7a6fc688726578d9702857a5", "42242a969283a5f339ba7f075e36ba2af925ce30d767ed6e55f4b031880d562c" ], [ "a598a8030da6d86c6bc7f2f5144ea549d28211ea58faa70ebf4c1e665c1fe9b5", "204b5d6f84822c307e4b4a7140737aec23fc63b65b35f86a10026dbd2d864e6b" ], [ "c41916365abb2b5d09192f5f2dbeafec208f020f12570a184dbadc3e58595997", "4f14351d0087efa49d245b328984989d5caf9450f34bfc0ed16e96b58fa9913" ], [ "841d6063a586fa475a724604da03bc5b92a2e0d2e0a36acfe4c73a5514742881", "73867f59c0659e81904f9a1c7543698e62562d6744c169ce7a36de01a8d6154" ], [ "5e95bb399a6971d376026947f89bde2f282b33810928be4ded112ac4d70e20d5", "39f23f366809085beebfc71181313775a99c9aed7d8ba38b161384c746012865" ], [ "36e4641a53948fd476c39f8a99fd974e5ec07564b5315d8bf99471bca0ef2f66", "d2424b1b1abe4eb8164227b085c9aa9456ea13493fd563e06fd51cf5694c78fc" ], [ "336581ea7bfbbb290c191a2f507a41cf5643842170e914faeab27c2c579f726", "ead12168595fe1be99252129b6e56b3391f7ab1410cd1e0ef3dcdcabd2fda224" ], [ "8ab89816dadfd6b6a1f2634fcf00ec8403781025ed6890c4849742706bd43ede", "6fdcef09f2f6d0a044e654aef624136f503d459c3e89845858a47a9129cdd24e" ], [ "1e33f1a746c9c5778133344d9299fcaa20b0938e8acff2544bb40284b8c5fb94", "60660257dd11b3aa9c8ed618d24edff2306d320f1d03010e33a7d2057f3b3b6" ], [ "85b7c1dcb3cec1b7ee7f30ded79dd20a0ed1f4cc18cbcfcfa410361fd8f08f31", "3d98a9cdd026dd43f39048f25a8847f4fcafad1895d7a633c6fed3c35e999511" ], [ "29df9fbd8d9e46509275f4b125d6d45d7fbe9a3b878a7af872a2800661ac5f51", "b4c4fe99c775a606e2d8862179139ffda61dc861c019e55cd2876eb2a27d84b" ], [ "a0b1cae06b0a847a3fea6e671aaf8adfdfe58ca2f768105c8082b2e449fce252", "ae434102edde0958ec4b19d917a6a28e6b72da1834aff0e650f049503a296cf2" ], [ "4e8ceafb9b3e9a136dc7ff67e840295b499dfb3b2133e4ba113f2e4c0e121e5", "cf2174118c8b6d7a4b48f6d534ce5c79422c086a63460502b827ce62a326683c" ], [ "d24a44e047e19b6f5afb81c7ca2f69080a5076689a010919f42725c2b789a33b", "6fb8d5591b466f8fc63db50f1c0f1c69013f996887b8244d2cdec417afea8fa3" ], [ "ea01606a7a6c9cdd249fdfcfacb99584001edd28abbab77b5104e98e8e3b35d4", "322af4908c7312b0cfbfe369f7a7b3cdb7d4494bc2823700cfd652188a3ea98d" ], [ "af8addbf2b661c8a6c6328655eb96651252007d8c5ea31be4ad196de8ce2131f", "6749e67c029b85f52a034eafd096836b2520818680e26ac8f3dfbcdb71749700" ], [ "e3ae1974566ca06cc516d47e0fb165a674a3dabcfca15e722f0e3450f45889", "2aeabe7e4531510116217f07bf4d07300de97e4874f81f533420a72eeb0bd6a4" ], [ "591ee355313d99721cf6993ffed1e3e301993ff3ed258802075ea8ced397e246", "b0ea558a113c30bea60fc4775460c7901ff0b053d25ca2bdeee98f1a4be5d196" ], [ "11396d55fda54c49f19aa97318d8da61fa8584e47b084945077cf03255b52984", "998c74a8cd45ac01289d5833a7beb4744ff536b01b257be4c5767bea93ea57a4" ], [ "3c5d2a1ba39c5a1790000738c9e0c40b8dcdfd5468754b6405540157e017aa7a", "b2284279995a34e2f9d4de7396fc18b80f9b8b9fdd270f6661f79ca4c81bd257" ], [ "cc8704b8a60a0defa3a99a7299f2e9c3fbc395afb04ac078425ef8a1793cc030", "bdd46039feed17881d1e0862db347f8cf395b74fc4bcdc4e940b74e3ac1f1b13" ], [ "c533e4f7ea8555aacd9777ac5cad29b97dd4defccc53ee7ea204119b2889b197", "6f0a256bc5efdf429a2fb6242f1a43a2d9b925bb4a4b3a26bb8e0f45eb596096" ], [ "c14f8f2ccb27d6f109f6d08d03cc96a69ba8c34eec07bbcf566d48e33da6593", "c359d6923bb398f7fd4473e16fe1c28475b740dd098075e6c0e8649113dc3a38" ], [ "a6cbc3046bc6a450bac24789fa17115a4c9739ed75f8f21ce441f72e0b90e6ef", "21ae7f4680e889bb130619e2c0f95a360ceb573c70603139862afd617fa9b9f" ], [ "347d6d9a02c48927ebfb86c1359b1caf130a3c0267d11ce6344b39f99d43cc38", "60ea7f61a353524d1c987f6ecec92f086d565ab687870cb12689ff1e31c74448" ], [ "da6545d2181db8d983f7dcb375ef5866d47c67b1bf31c8cf855ef7437b72656a", "49b96715ab6878a79e78f07ce5680c5d6673051b4935bd897fea824b77dc208a" ], [ "c40747cc9d012cb1a13b8148309c6de7ec25d6945d657146b9d5994b8feb1111", "5ca560753be2a12fc6de6caf2cb489565db936156b9514e1bb5e83037e0fa2d4" ], [ "4e42c8ec82c99798ccf3a610be870e78338c7f713348bd34c8203ef4037f3502", "7571d74ee5e0fb92a7a8b33a07783341a5492144cc54bcc40a94473693606437" ], [ "3775ab7089bc6af823aba2e1af70b236d251cadb0c86743287522a1b3b0dedea", "be52d107bcfa09d8bcb9736a828cfa7fac8db17bf7a76a2c42ad961409018cf7" ], [ "cee31cbf7e34ec379d94fb814d3d775ad954595d1314ba8846959e3e82f74e26", "8fd64a14c06b589c26b947ae2bcf6bfa0149ef0be14ed4d80f448a01c43b1c6d" ], [ "b4f9eaea09b6917619f6ea6a4eb5464efddb58fd45b1ebefcdc1a01d08b47986", "39e5c9925b5a54b07433a4f18c61726f8bb131c012ca542eb24a8ac07200682a" ], [ "d4263dfc3d2df923a0179a48966d30ce84e2515afc3dccc1b77907792ebcc60e", "62dfaf07a0f78feb30e30d6295853ce189e127760ad6cf7fae164e122a208d54" ], [ "48457524820fa65a4f8d35eb6930857c0032acc0a4a2de422233eeda897612c4", "25a748ab367979d98733c38a1fa1c2e7dc6cc07db2d60a9ae7a76aaa49bd0f77" ], [ "dfeeef1881101f2cb11644f3a2afdfc2045e19919152923f367a1767c11cceda", "ecfb7056cf1de042f9420bab396793c0c390bde74b4bbdff16a83ae09a9a7517" ], [ "6d7ef6b17543f8373c573f44e1f389835d89bcbc6062ced36c82df83b8fae859", "cd450ec335438986dfefa10c57fea9bcc521a0959b2d80bbf74b190dca712d10" ], [ "e75605d59102a5a2684500d3b991f2e3f3c88b93225547035af25af66e04541f", "f5c54754a8f71ee540b9b48728473e314f729ac5308b06938360990e2bfad125" ], [ "eb98660f4c4dfaa06a2be453d5020bc99a0c2e60abe388457dd43fefb1ed620c", "6cb9a8876d9cb8520609af3add26cd20a0a7cd8a9411131ce85f44100099223e" ], [ "13e87b027d8514d35939f2e6892b19922154596941888336dc3563e3b8dba942", "fef5a3c68059a6dec5d624114bf1e91aac2b9da568d6abeb2570d55646b8adf1" ], [ "ee163026e9fd6fe017c38f06a5be6fc125424b371ce2708e7bf4491691e5764a", "1acb250f255dd61c43d94ccc670d0f58f49ae3fa15b96623e5430da0ad6c62b2" ], [ "b268f5ef9ad51e4d78de3a750c2dc89b1e626d43505867999932e5db33af3d80", "5f310d4b3c99b9ebb19f77d41c1dee018cf0d34fd4191614003e945a1216e423" ], [ "ff07f3118a9df035e9fad85eb6c7bfe42b02f01ca99ceea3bf7ffdba93c4750d", "438136d603e858a3a5c440c38eccbaddc1d2942114e2eddd4740d098ced1f0d8" ], [ "8d8b9855c7c052a34146fd20ffb658bea4b9f69e0d825ebec16e8c3ce2b526a1", "cdb559eedc2d79f926baf44fb84ea4d44bcf50fee51d7ceb30e2e7f463036758" ], [ "52db0b5384dfbf05bfa9d472d7ae26dfe4b851ceca91b1eba54263180da32b63", "c3b997d050ee5d423ebaf66a6db9f57b3180c902875679de924b69d84a7b375" ], [ "e62f9490d3d51da6395efd24e80919cc7d0f29c3f3fa48c6fff543becbd43352", "6d89ad7ba4876b0b22c2ca280c682862f342c8591f1daf5170e07bfd9ccafa7d" ], [ "7f30ea2476b399b4957509c88f77d0191afa2ff5cb7b14fd6d8e7d65aaab1193", "ca5ef7d4b231c94c3b15389a5f6311e9daff7bb67b103e9880ef4bff637acaec" ], [ "5098ff1e1d9f14fb46a210fada6c903fef0fb7b4a1dd1d9ac60a0361800b7a00", "9731141d81fc8f8084d37c6e7542006b3ee1b40d60dfe5362a5b132fd17ddc0" ], [ "32b78c7de9ee512a72895be6b9cbefa6e2f3c4ccce445c96b9f2c81e2778ad58", "ee1849f513df71e32efc3896ee28260c73bb80547ae2275ba497237794c8753c" ], [ "e2cb74fddc8e9fbcd076eef2a7c72b0ce37d50f08269dfc074b581550547a4f7", "d3aa2ed71c9dd2247a62df062736eb0baddea9e36122d2be8641abcb005cc4a4" ], [ "8438447566d4d7bedadc299496ab357426009a35f235cb141be0d99cd10ae3a8", "c4e1020916980a4da5d01ac5e6ad330734ef0d7906631c4f2390426b2edd791f" ], [ "4162d488b89402039b584c6fc6c308870587d9c46f660b878ab65c82c711d67e", "67163e903236289f776f22c25fb8a3afc1732f2b84b4e95dbda47ae5a0852649" ], [ "3fad3fa84caf0f34f0f89bfd2dcf54fc175d767aec3e50684f3ba4a4bf5f683d", "cd1bc7cb6cc407bb2f0ca647c718a730cf71872e7d0d2a53fa20efcdfe61826" ], [ "674f2600a3007a00568c1a7ce05d0816c1fb84bf1370798f1c69532faeb1a86b", "299d21f9413f33b3edf43b257004580b70db57da0b182259e09eecc69e0d38a5" ], [ "d32f4da54ade74abb81b815ad1fb3b263d82d6c692714bcff87d29bd5ee9f08f", "f9429e738b8e53b968e99016c059707782e14f4535359d582fc416910b3eea87" ], [ "30e4e670435385556e593657135845d36fbb6931f72b08cb1ed954f1e3ce3ff6", "462f9bce619898638499350113bbc9b10a878d35da70740dc695a559eb88db7b" ], [ "be2062003c51cc3004682904330e4dee7f3dcd10b01e580bf1971b04d4cad297", "62188bc49d61e5428573d48a74e1c655b1c61090905682a0d5558ed72dccb9bc" ], [ "93144423ace3451ed29e0fb9ac2af211cb6e84a601df5993c419859fff5df04a", "7c10dfb164c3425f5c71a3f9d7992038f1065224f72bb9d1d902a6d13037b47c" ], [ "b015f8044f5fcbdcf21ca26d6c34fb8197829205c7b7d2a7cb66418c157b112c", "ab8c1e086d04e813744a655b2df8d5f83b3cdc6faa3088c1d3aea1454e3a1d5f" ], [ "d5e9e1da649d97d89e4868117a465a3a4f8a18de57a140d36b3f2af341a21b52", "4cb04437f391ed73111a13cc1d4dd0db1693465c2240480d8955e8592f27447a" ], [ "d3ae41047dd7ca065dbf8ed77b992439983005cd72e16d6f996a5316d36966bb", "bd1aeb21ad22ebb22a10f0303417c6d964f8cdd7df0aca614b10dc14d125ac46" ], [ "463e2763d885f958fc66cdd22800f0a487197d0a82e377b49f80af87c897b065", "bfefacdb0e5d0fd7df3a311a94de062b26b80c61fbc97508b79992671ef7ca7f" ], [ "7985fdfd127c0567c6f53ec1bb63ec3158e597c40bfe747c83cddfc910641917", "603c12daf3d9862ef2b25fe1de289aed24ed291e0ec6708703a5bd567f32ed03" ], [ "74a1ad6b5f76e39db2dd249410eac7f99e74c59cb83d2d0ed5ff1543da7703e9", "cc6157ef18c9c63cd6193d83631bbea0093e0968942e8c33d5737fd790e0db08" ], [ "30682a50703375f602d416664ba19b7fc9bab42c72747463a71d0896b22f6da3", "553e04f6b018b4fa6c8f39e7f311d3176290d0e0f19ca73f17714d9977a22ff8" ], [ "9e2158f0d7c0d5f26c3791efefa79597654e7a2b2464f52b1ee6c1347769ef57", "712fcdd1b9053f09003a3481fa7762e9ffd7c8ef35a38509e2fbf2629008373" ], [ "176e26989a43c9cfeba4029c202538c28172e566e3c4fce7322857f3be327d66", "ed8cc9d04b29eb877d270b4878dc43c19aefd31f4eee09ee7b47834c1fa4b1c3" ], [ "75d46efea3771e6e68abb89a13ad747ecf1892393dfc4f1b7004788c50374da8", "9852390a99507679fd0b86fd2b39a868d7efc22151346e1a3ca4726586a6bed8" ], [ "809a20c67d64900ffb698c4c825f6d5f2310fb0451c869345b7319f645605721", "9e994980d9917e22b76b061927fa04143d096ccc54963e6a5ebfa5f3f8e286c1" ], [ "1b38903a43f7f114ed4500b4eac7083fdefece1cf29c63528d563446f972c180", "4036edc931a60ae889353f77fd53de4a2708b26b6f5da72ad3394119daf408f9" ] ]
}
};
}, {} ],
81: [ function(e, t, i) {
"use strict";
var r = i, n = e("bn.js"), o = e("minimalistic-assert"), a = e("minimalistic-crypto-utils");
r.assert = o;
r.toArray = a.toArray;
r.zero2 = a.zero2;
r.toHex = a.toHex;
r.encode = a.encode;
r.getNAF = function(e, t) {
for (var i = [], r = 1 << t + 1, n = e.clone(); 0 <= n.cmpn(1); ) {
var o;
if (n.isOdd()) {
var a = n.andln(r - 1);
o = (r >> 1) - 1 < a ? (r >> 1) - a : a;
n.isubn(o);
} else o = 0;
i.push(o);
for (var s = 0 !== n.cmpn(0) && 0 === n.andln(r - 1) ? t + 1 : 1, c = 1; c < s; c++) i.push(0);
n.iushrn(s);
}
return i;
};
r.getJSF = function(e, t) {
var i = [ [], [] ];
e = e.clone();
t = t.clone();
for (var r = 0, n = 0; 0 < e.cmpn(-r) || 0 < t.cmpn(-n); ) {
var o, a, s = e.andln(3) + r & 3, c = t.andln(3) + n & 3;
3 === s && (s = -1);
3 === c && (c = -1);
o = 0 == (1 & s) ? 0 : 3 != (f = e.andln(7) + r & 7) && 5 !== f || 2 !== c ? s : -s;
i[0].push(o);
if (0 == (1 & c)) a = 0; else {
var f;
a = 3 != (f = t.andln(7) + n & 7) && 5 !== f || 2 !== s ? c : -c;
}
i[1].push(a);
2 * r === o + 1 && (r = 1 - r);
2 * n === a + 1 && (n = 1 - n);
e.iushrn(1);
t.iushrn(1);
}
return i;
};
r.cachedProperty = function(e, t, i) {
var r = "_" + t;
e.prototype[t] = function() {
return void 0 !== this[r] ? this[r] : this[r] = i.call(this);
};
};
r.parseBytes = function(e) {
return "string" == typeof e ? r.toArray(e, "hex") : e;
};
r.intFromLE = function(e) {
return new n(e, "hex", "le");
};
}, {
"bn.js": 16,
"minimalistic-assert": 105,
"minimalistic-crypto-utils": 106
} ],
82: [ function(e, t, i) {
t.exports = {
_args: [ [ {
raw: "elliptic@^6.0.0",
scope: null,
escapedName: "elliptic",
name: "elliptic",
rawSpec: "^6.0.0",
spec: ">=6.0.0 <7.0.0",
type: "range"
}, "/Users/nantas/fireball-x/fireball_1.9-release/dist/CocosCreator.app/Contents/Resources/app/node_modules/browserify-sign" ] ],
_cnpm_publish_time: 1487798867116,
_from: "elliptic@^6.0.0",
_hasShrinkwrap: !1,
_id: "elliptic@6.4.0",
_location: "/elliptic",
_nodeVersion: "7.0.0",
_npmOperationalInternal: {
host: "packages-18-east.internal.npmjs.com",
tmp: "tmp/elliptic-6.4.0.tgz_1487798866428_0.30510620190761983"
},
_npmUser: {
name: "indutny",
email: "fedor@indutny.com"
},
_npmVersion: "3.10.8",
_phantomChildren: {},
_requested: {
raw: "elliptic@^6.0.0",
scope: null,
escapedName: "elliptic",
name: "elliptic",
rawSpec: "^6.0.0",
spec: ">=6.0.0 <7.0.0",
type: "range"
},
_requiredBy: [ "/browserify-sign", "/create-ecdh" ],
_resolved: "http://registry.npm.taobao.org/elliptic/download/elliptic-6.4.0.tgz",
_shasum: "cac9af8762c85836187003c8dfe193e5e2eae5df",
_shrinkwrap: null,
_spec: "elliptic@^6.0.0",
_where: "/Users/nantas/fireball-x/fireball_1.9-release/dist/CocosCreator.app/Contents/Resources/app/node_modules/browserify-sign",
author: {
name: "Fedor Indutny",
email: "fedor@indutny.com"
},
bugs: {
url: "https://github.com/indutny/elliptic/issues"
},
dependencies: {
"bn.js": "^4.4.0",
brorand: "^1.0.1",
"hash.js": "^1.0.0",
"hmac-drbg": "^1.0.0",
inherits: "^2.0.1",
"minimalistic-assert": "^1.0.0",
"minimalistic-crypto-utils": "^1.0.0"
},
description: "EC cryptography",
devDependencies: {
brfs: "^1.4.3",
coveralls: "^2.11.3",
grunt: "^0.4.5",
"grunt-browserify": "^5.0.0",
"grunt-cli": "^1.2.0",
"grunt-contrib-connect": "^1.0.0",
"grunt-contrib-copy": "^1.0.0",
"grunt-contrib-uglify": "^1.0.1",
"grunt-mocha-istanbul": "^3.0.1",
"grunt-saucelabs": "^8.6.2",
istanbul: "^0.4.2",
jscs: "^2.9.0",
jshint: "^2.6.0",
mocha: "^2.1.0"
},
directories: {},
dist: {
shasum: "cac9af8762c85836187003c8dfe193e5e2eae5df",
size: 41164,
noattachment: !1,
tarball: "http://registry.npm.taobao.org/elliptic/download/elliptic-6.4.0.tgz"
},
files: [ "lib" ],
gitHead: "6b0d2b76caae91471649c8e21f0b1d3ba0f96090",
homepage: "https://github.com/indutny/elliptic",
keywords: [ "EC", "Elliptic", "curve", "Cryptography" ],
license: "MIT",
main: "lib/elliptic.js",
maintainers: [ {
name: "indutny",
email: "fedor@indutny.com"
} ],
name: "elliptic",
optionalDependencies: {},
publish_time: 1487798867116,
readme: "# Elliptic [![Build Status](https://secure.travis-ci.org/indutny/elliptic.png)](http://travis-ci.org/indutny/elliptic) [![Coverage Status](https://coveralls.io/repos/indutny/elliptic/badge.svg?branch=master&service=github)](https://coveralls.io/github/indutny/elliptic?branch=master) [![Code Climate](https://codeclimate.com/github/indutny/elliptic/badges/gpa.svg)](https://codeclimate.com/github/indutny/elliptic)\n\n[![Saucelabs Test Status](https://saucelabs.com/browser-matrix/gh-indutny-elliptic.svg)](https://saucelabs.com/u/gh-indutny-elliptic)\n\nFast elliptic-curve cryptography in a plain javascript implementation.\n\nNOTE: Please take a look at http://safecurves.cr.yp.to/ before choosing a curve\nfor your cryptography operations.\n\n## Incentive\n\nECC is much slower than regular RSA cryptography, the JS implementations are\neven more slower.\n\n## Benchmarks\n\n```bash\n$ node benchmarks/index.js\nBenchmarking: sign\nelliptic#sign x 262 ops/sec ±0.51% (177 runs sampled)\neccjs#sign x 55.91 ops/sec ±0.90% (144 runs sampled)\n------------------------\nFastest is elliptic#sign\n========================\nBenchmarking: verify\nelliptic#verify x 113 ops/sec ±0.50% (166 runs sampled)\neccjs#verify x 48.56 ops/sec ±0.36% (125 runs sampled)\n------------------------\nFastest is elliptic#verify\n========================\nBenchmarking: gen\nelliptic#gen x 294 ops/sec ±0.43% (176 runs sampled)\neccjs#gen x 62.25 ops/sec ±0.63% (129 runs sampled)\n------------------------\nFastest is elliptic#gen\n========================\nBenchmarking: ecdh\nelliptic#ecdh x 136 ops/sec ±0.85% (156 runs sampled)\n------------------------\nFastest is elliptic#ecdh\n========================\n```\n\n## API\n\n### ECDSA\n\n```javascript\nvar EC = require('elliptic').ec;\n\n// Create and initialize EC context\n// (better do it once and reuse it)\nvar ec = new EC('secp256k1');\n\n// Generate keys\nvar key = ec.genKeyPair();\n\n// Sign message (must be an array, or it'll be treated as a hex sequence)\nvar msg = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ];\nvar signature = key.sign(msg);\n\n// Export DER encoded signature in Array\nvar derSign = signature.toDER();\n\n// Verify signature\nconsole.log(key.verify(msg, derSign));\n\n// CHECK WITH NO PRIVATE KEY\n\n// Public key as '04 + x + y'\nvar pub = '04bb1fa3...';\n\n// Signature MUST be either:\n// 1) hex-string of DER-encoded signature; or\n// 2) DER-encoded signature as buffer; or\n// 3) object with two hex-string properties (r and s)\n\nvar signature = 'b102ac...'; // case 1\nvar signature = new Buffer('...'); // case 2\nvar signature = { r: 'b1fc...', s: '9c42...' }; // case 3\n\n// Import public key\nvar key = ec.keyFromPublic(pub, 'hex');\n\n// Verify signature\nconsole.log(key.verify(msg, signature));\n```\n\n### EdDSA\n\n```javascript\nvar EdDSA = require('elliptic').eddsa;\n\n// Create and initialize EdDSA context\n// (better do it once and reuse it)\nvar ec = new EdDSA('ed25519');\n\n// Create key pair from secret\nvar key = ec.keyFromSecret('693e3c...'); // hex string, array or Buffer\n\n// Sign message (must be an array, or it'll be treated as a hex sequence)\nvar msg = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ];\nvar signature = key.sign(msg).toHex();\n\n// Verify signature\nconsole.log(key.verify(msg, signature));\n\n// CHECK WITH NO PRIVATE KEY\n\n// Import public key\nvar pub = '0a1af638...';\nvar key = ec.keyFromPublic(pub, 'hex');\n\n// Verify signature\nvar signature = '70bed1...';\nconsole.log(key.verify(msg, signature));\n```\n\n### ECDH\n\n```javascript\nvar EC = require('elliptic').ec;\nvar ec = new EC('curve25519');\n\n// Generate keys\nvar key1 = ec.genKeyPair();\nvar key2 = ec.genKeyPair();\n\nvar shared1 = key1.derive(key2.getPublic());\nvar shared2 = key2.derive(key1.getPublic());\n\nconsole.log('Both shared secrets are BN instances');\nconsole.log(shared1.toString(16));\nconsole.log(shared2.toString(16));\n```\n\nthree and more members:\n```javascript\nvar EC = require('elliptic').ec;\nvar ec = new EC('curve25519');\n\nvar A = ec.genKeyPair();\nvar B = ec.genKeyPair();\nvar C = ec.genKeyPair();\n\nvar AB = A.getPublic().mul(B.getPrivate())\nvar BC = B.getPublic().mul(C.getPrivate())\nvar CA = C.getPublic().mul(A.getPrivate())\n\nvar ABC = AB.mul(C.getPrivate())\nvar BCA = BC.mul(A.getPrivate())\nvar CAB = CA.mul(B.getPrivate())\n\nconsole.log(ABC.getX().toString(16))\nconsole.log(BCA.getX().toString(16))\nconsole.log(CAB.getX().toString(16))\n```\n\nNOTE: `.derive()` returns a [BN][1] instance.\n\n## Supported curves\n\nElliptic.js support following curve types:\n\n* Short Weierstrass\n* Montgomery\n* Edwards\n* Twisted Edwards\n\nFollowing curve 'presets' are embedded into the library:\n\n* `secp256k1`\n* `p192`\n* `p224`\n* `p256`\n* `p384`\n* `p521`\n* `curve25519`\n* `ed25519`\n\nNOTE: That `curve25519` could not be used for ECDSA, use `ed25519` instead.\n\n### Implementation details\n\nECDSA is using deterministic `k` value generation as per [RFC6979][0]. Most of\nthe curve operations are performed on non-affine coordinates (either projective\nor extended), various windowing techniques are used for different cases.\n\nAll operations are performed in reduction context using [bn.js][1], hashing is\nprovided by [hash.js][2]\n\n### Related projects\n\n* [eccrypto][3]: isomorphic implementation of ECDSA, ECDH and ECIES for both\n  browserify and node (uses `elliptic` for browser and [secp256k1-node][4] for\n  node)\n\n#### LICENSE\n\nThis software is licensed under the MIT License.\n\nCopyright Fedor Indutny, 2014.\n\nPermission is hereby granted, free of charge, to any person obtaining a\ncopy of this software and associated documentation files (the\n\"Software\"), to deal in the Software without restriction, including\nwithout limitation the rights to use, copy, modify, merge, publish,\ndistribute, sublicense, and/or sell copies of the Software, and to permit\npersons to whom the Software is furnished to do so, subject to the\nfollowing conditions:\n\nThe above copyright notice and this permission notice shall be included\nin all copies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS\nOR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF\nMERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN\nNO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,\nDAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR\nOTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE\nUSE OR OTHER DEALINGS IN THE SOFTWARE.\n\n[0]: http://tools.ietf.org/html/rfc6979\n[1]: https://github.com/indutny/bn.js\n[2]: https://github.com/indutny/hash.js\n[3]: https://github.com/bitchan/eccrypto\n[4]: https://github.com/wanderer/secp256k1-node\n",
readmeFilename: "README.md",
repository: {
type: "git",
url: "git+ssh://git@github.com/indutny/elliptic.git"
},
scripts: {
jscs: "jscs benchmarks/*.js lib/*.js lib/**/*.js lib/**/**/*.js test/index.js",
jshint: "jscs benchmarks/*.js lib/*.js lib/**/*.js lib/**/**/*.js test/index.js",
lint: "npm run jscs && npm run jshint",
test: "npm run lint && npm run unit",
unit: "istanbul test _mocha --reporter=spec test/index.js",
version: "grunt dist && git add dist/"
},
version: "6.4.0"
};
}, {} ],
83: [ function(e, t, i) {
function r() {
this._events = this._events || {};
this._maxListeners = this._maxListeners || void 0;
}
((t.exports = r).EventEmitter = r).prototype._events = void 0;
r.prototype._maxListeners = void 0;
r.defaultMaxListeners = 10;
r.prototype.setMaxListeners = function(e) {
if (!("number" == typeof e) || e < 0 || isNaN(e)) throw TypeError("n must be a positive number");
this._maxListeners = e;
return this;
};
r.prototype.emit = function(e) {
var t, i, r, n, o, a;
this._events || (this._events = {});
if ("error" === e && (!this._events.error || f(this._events.error) && !this._events.error.length)) {
if ((t = arguments[1]) instanceof Error) throw t;
var s = new Error('Uncaught, unspecified "error" event. (' + t + ")");
s.context = t;
throw s;
}
if (h(i = this._events[e])) return !1;
if (c(i)) switch (arguments.length) {
case 1:
i.call(this);
break;

case 2:
i.call(this, arguments[1]);
break;

case 3:
i.call(this, arguments[1], arguments[2]);
break;

default:
n = Array.prototype.slice.call(arguments, 1);
i.apply(this, n);
} else if (f(i)) {
n = Array.prototype.slice.call(arguments, 1);
r = (a = i.slice()).length;
for (o = 0; o < r; o++) a[o].apply(this, n);
}
return !0;
};
r.prototype.on = r.prototype.addListener = function(e, t) {
var i;
if (!c(t)) throw TypeError("listener must be a function");
this._events || (this._events = {});
this._events.newListener && this.emit("newListener", e, c(t.listener) ? t.listener : t);
this._events[e] ? f(this._events[e]) ? this._events[e].push(t) : this._events[e] = [ this._events[e], t ] : this._events[e] = t;
if (f(this._events[e]) && !this._events[e].warned && (i = h(this._maxListeners) ? r.defaultMaxListeners : this._maxListeners) && 0 < i && this._events[e].length > i) {
this._events[e].warned = !0;
console.error("(node) warning: possible EventEmitter memory leak detected. %d listeners added. Use emitter.setMaxListeners() to increase limit.", this._events[e].length);
"function" == typeof console.trace && console.trace();
}
return this;
};
r.prototype.once = function(e, t) {
if (!c(t)) throw TypeError("listener must be a function");
var i = !1;
function r() {
this.removeListener(e, r);
if (!i) {
i = !0;
t.apply(this, arguments);
}
}
r.listener = t;
this.on(e, r);
return this;
};
r.prototype.removeListener = function(e, t) {
var i, r, n, o;
if (!c(t)) throw TypeError("listener must be a function");
if (!this._events || !this._events[e]) return this;
n = (i = this._events[e]).length;
r = -1;
if (i === t || c(i.listener) && i.listener === t) {
delete this._events[e];
this._events.removeListener && this.emit("removeListener", e, t);
} else if (f(i)) {
for (o = n; 0 < o--; ) if (i[o] === t || i[o].listener && i[o].listener === t) {
r = o;
break;
}
if (r < 0) return this;
if (1 === i.length) {
i.length = 0;
delete this._events[e];
} else i.splice(r, 1);
this._events.removeListener && this.emit("removeListener", e, t);
}
return this;
};
r.prototype.removeAllListeners = function(e) {
var t, i;
if (!this._events) return this;
if (!this._events.removeListener) {
0 === arguments.length ? this._events = {} : this._events[e] && delete this._events[e];
return this;
}
if (0 === arguments.length) {
for (t in this._events) "removeListener" !== t && this.removeAllListeners(t);
this.removeAllListeners("removeListener");
this._events = {};
return this;
}
if (c(i = this._events[e])) this.removeListener(e, i); else if (i) for (;i.length; ) this.removeListener(e, i[i.length - 1]);
delete this._events[e];
return this;
};
r.prototype.listeners = function(e) {
return this._events && this._events[e] ? c(this._events[e]) ? [ this._events[e] ] : this._events[e].slice() : [];
};
r.prototype.listenerCount = function(e) {
if (this._events) {
var t = this._events[e];
if (c(t)) return 1;
if (t) return t.length;
}
return 0;
};
r.listenerCount = function(e, t) {
return e.listenerCount(t);
};
function c(e) {
return "function" == typeof e;
}
function f(e) {
return "object" == typeof e && null !== e;
}
function h(e) {
return void 0 === e;
}
}, {} ],
84: [ function(e, t, i) {
var u = e("safe-buffer").Buffer, p = e("md5.js");
t.exports = function(e, t, i, r) {
u.isBuffer(e) || (e = u.from(e, "binary"));
if (t) {
u.isBuffer(t) || (t = u.from(t, "binary"));
if (8 !== t.length) throw new RangeError("salt should be Buffer with 8 byte length");
}
for (var n = i / 8, o = u.alloc(n), a = u.alloc(r || 0), s = u.alloc(0); 0 < n || 0 < r; ) {
var c = new p();
c.update(s);
c.update(e);
t && c.update(t);
s = c.digest();
var f = 0;
if (0 < n) {
var h = o.length - n;
f = Math.min(n, s.length);
s.copy(o, h, 0, f);
n -= f;
}
if (f < s.length && 0 < r) {
var l = a.length - r, d = Math.min(r, s.length - f);
s.copy(a, l, f, f + d);
r -= d;
}
}
s.fill(0);
return {
key: o,
iv: a
};
};
}, {
"md5.js": 103,
"safe-buffer": 144
} ],
85: [ function(e, t, i) {
"use strict";
var s = e("safe-buffer").Buffer, r = e("stream").Transform;
function n(e) {
r.call(this);
this._block = s.allocUnsafe(e);
this._blockSize = e;
this._blockOffset = 0;
this._length = [ 0, 0, 0, 0 ];
this._finalized = !1;
}
e("inherits")(n, r);
n.prototype._transform = function(e, t, i) {
var r = null;
try {
this.update(e, t);
} catch (e) {
r = e;
}
i(r);
};
n.prototype._flush = function(e) {
var t = null;
try {
this.push(this.digest());
} catch (e) {
t = e;
}
e(t);
};
n.prototype.update = function(e, t) {
(function(e, t) {
if (!s.isBuffer(e) && "string" != typeof e) throw new TypeError(t + " must be a string or a buffer");
})(e, "Data");
if (this._finalized) throw new Error("Digest already called");
s.isBuffer(e) || (e = s.from(e, t));
for (var i = this._block, r = 0; this._blockOffset + e.length - r >= this._blockSize; ) {
for (var n = this._blockOffset; n < this._blockSize; ) i[n++] = e[r++];
this._update();
this._blockOffset = 0;
}
for (;r < e.length; ) i[this._blockOffset++] = e[r++];
for (var o = 0, a = 8 * e.length; 0 < a; ++o) {
this._length[o] += a;
0 < (a = this._length[o] / 4294967296 | 0) && (this._length[o] -= 4294967296 * a);
}
return this;
};
n.prototype._update = function() {
throw new Error("_update is not implemented");
};
n.prototype.digest = function(e) {
if (this._finalized) throw new Error("Digest already called");
this._finalized = !0;
var t = this._digest();
void 0 !== e && (t = t.toString(e));
this._block.fill(0);
for (var i = this._blockOffset = 0; i < 4; ++i) this._length[i] = 0;
return t;
};
n.prototype._digest = function() {
throw new Error("_digest is not implemented");
};
t.exports = n;
}, {
inherits: 101,
"safe-buffer": 144,
stream: 153
} ],
86: [ function(e, t, i) {
var r = i;
r.utils = e("./hash/utils");
r.common = e("./hash/common");
r.sha = e("./hash/sha");
r.ripemd = e("./hash/ripemd");
r.hmac = e("./hash/hmac");
r.sha1 = r.sha.sha1;
r.sha256 = r.sha.sha256;
r.sha224 = r.sha.sha224;
r.sha384 = r.sha.sha384;
r.sha512 = r.sha.sha512;
r.ripemd160 = r.ripemd.ripemd160;
}, {
"./hash/common": 87,
"./hash/hmac": 88,
"./hash/ripemd": 89,
"./hash/sha": 90,
"./hash/utils": 97
} ],
87: [ function(e, t, i) {
"use strict";
var n = e("./utils"), r = e("minimalistic-assert");
function o() {
this.pending = null;
this.pendingTotal = 0;
this.blockSize = this.constructor.blockSize;
this.outSize = this.constructor.outSize;
this.hmacStrength = this.constructor.hmacStrength;
this.padLength = this.constructor.padLength / 8;
this.endian = "big";
this._delta8 = this.blockSize / 8;
this._delta32 = this.blockSize / 32;
}
(i.BlockHash = o).prototype.update = function(e, t) {
e = n.toArray(e, t);
this.pending ? this.pending = this.pending.concat(e) : this.pending = e;
this.pendingTotal += e.length;
if (this.pending.length >= this._delta8) {
var i = (e = this.pending).length % this._delta8;
this.pending = e.slice(e.length - i, e.length);
0 === this.pending.length && (this.pending = null);
e = n.join32(e, 0, e.length - i, this.endian);
for (var r = 0; r < e.length; r += this._delta32) this._update(e, r, r + this._delta32);
}
return this;
};
o.prototype.digest = function(e) {
this.update(this._pad());
r(null === this.pending);
return this._digest(e);
};
o.prototype._pad = function() {
var e = this.pendingTotal, t = this._delta8, i = t - (e + this.padLength) % t, r = new Array(i + this.padLength);
r[0] = 128;
for (var n = 1; n < i; n++) r[n] = 0;
e <<= 3;
if ("big" === this.endian) {
for (var o = 8; o < this.padLength; o++) r[n++] = 0;
r[n++] = 0;
r[n++] = 0;
r[n++] = 0;
r[n++] = 0;
r[n++] = e >>> 24 & 255;
r[n++] = e >>> 16 & 255;
r[n++] = e >>> 8 & 255;
r[n++] = 255 & e;
} else {
r[n++] = 255 & e;
r[n++] = e >>> 8 & 255;
r[n++] = e >>> 16 & 255;
r[n++] = e >>> 24 & 255;
r[n++] = 0;
r[n++] = 0;
r[n++] = 0;
r[n++] = 0;
for (o = 8; o < this.padLength; o++) r[n++] = 0;
}
return r;
};
}, {
"./utils": 97,
"minimalistic-assert": 105
} ],
88: [ function(e, t, i) {
"use strict";
var r = e("./utils"), n = e("minimalistic-assert");
function o(e, t, i) {
if (!(this instanceof o)) return new o(e, t, i);
this.Hash = e;
this.blockSize = e.blockSize / 8;
this.outSize = e.outSize / 8;
this.inner = null;
this.outer = null;
this._init(r.toArray(t, i));
}
(t.exports = o).prototype._init = function(e) {
e.length > this.blockSize && (e = new this.Hash().update(e).digest());
n(e.length <= this.blockSize);
for (var t = e.length; t < this.blockSize; t++) e.push(0);
for (t = 0; t < e.length; t++) e[t] ^= 54;
this.inner = new this.Hash().update(e);
for (t = 0; t < e.length; t++) e[t] ^= 106;
this.outer = new this.Hash().update(e);
};
o.prototype.update = function(e, t) {
this.inner.update(e, t);
return this;
};
o.prototype.digest = function(e) {
this.outer.update(this.inner.digest());
return this.outer.digest(e);
};
}, {
"./utils": 97,
"minimalistic-assert": 105
} ],
89: [ function(e, t, i) {
"use strict";
var r = e("./utils"), n = e("./common"), p = r.rotl32, b = r.sum32, m = r.sum32_3, g = r.sum32_4, o = n.BlockHash;
function a() {
if (!(this instanceof a)) return new a();
o.call(this);
this.h = [ 1732584193, 4023233417, 2562383102, 271733878, 3285377520 ];
this.endian = "little";
}
r.inherits(a, o);
(i.ripemd160 = a).blockSize = 512;
a.outSize = 160;
a.hmacStrength = 192;
a.padLength = 64;
a.prototype._update = function(e, t) {
for (var i = this.h[0], r = this.h[1], n = this.h[2], o = this.h[3], a = this.h[4], s = i, c = r, f = n, h = o, l = a, d = 0; d < 80; d++) {
var u = b(p(g(i, y(d, r, n, o), e[S[d] + t], v(d)), I[d]), a);
i = a;
a = o;
o = p(n, 10);
n = r;
r = u;
u = b(p(g(s, y(79 - d, c, f, h), e[_[d] + t], w(d)), x[d]), l);
s = l;
l = h;
h = p(f, 10);
f = c;
c = u;
}
u = m(this.h[1], n, h);
this.h[1] = m(this.h[2], o, l);
this.h[2] = m(this.h[3], a, s);
this.h[3] = m(this.h[4], i, c);
this.h[4] = m(this.h[0], r, f);
this.h[0] = u;
};
a.prototype._digest = function(e) {
return "hex" === e ? r.toHex32(this.h, "little") : r.split32(this.h, "little");
};
function y(e, t, i, r) {
return e <= 15 ? t ^ i ^ r : e <= 31 ? t & i | ~t & r : e <= 47 ? (t | ~i) ^ r : e <= 63 ? t & r | i & ~r : t ^ (i | ~r);
}
function v(e) {
return e <= 15 ? 0 : e <= 31 ? 1518500249 : e <= 47 ? 1859775393 : e <= 63 ? 2400959708 : 2840853838;
}
function w(e) {
return e <= 15 ? 1352829926 : e <= 31 ? 1548603684 : e <= 47 ? 1836072691 : e <= 63 ? 2053994217 : 0;
}
var S = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8, 3, 10, 14, 4, 9, 15, 8, 1, 2, 7, 0, 6, 13, 11, 5, 12, 1, 9, 11, 10, 0, 8, 12, 4, 13, 3, 7, 15, 14, 5, 6, 2, 4, 0, 5, 9, 7, 12, 2, 10, 14, 1, 3, 8, 11, 6, 15, 13 ], _ = [ 5, 14, 7, 0, 9, 2, 11, 4, 13, 6, 15, 8, 1, 10, 3, 12, 6, 11, 3, 7, 0, 13, 5, 10, 14, 15, 8, 12, 4, 9, 1, 2, 15, 5, 1, 3, 7, 14, 6, 9, 11, 8, 12, 2, 10, 0, 4, 13, 8, 6, 4, 1, 3, 11, 15, 0, 5, 12, 2, 13, 9, 7, 10, 14, 12, 15, 10, 4, 1, 5, 8, 7, 6, 2, 13, 14, 0, 3, 9, 11 ], I = [ 11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8, 7, 6, 8, 13, 11, 9, 7, 15, 7, 12, 15, 9, 11, 7, 13, 12, 11, 13, 6, 7, 14, 9, 13, 15, 14, 8, 13, 6, 5, 12, 7, 5, 11, 12, 14, 15, 14, 15, 9, 8, 9, 14, 5, 6, 8, 6, 5, 12, 9, 15, 5, 11, 6, 8, 13, 12, 5, 12, 13, 14, 11, 8, 5, 6 ], x = [ 8, 9, 9, 11, 13, 15, 15, 5, 7, 7, 8, 11, 14, 14, 12, 6, 9, 13, 15, 7, 12, 8, 9, 11, 7, 7, 12, 7, 6, 15, 13, 11, 9, 7, 15, 11, 8, 6, 6, 14, 12, 13, 5, 14, 13, 13, 7, 5, 15, 5, 8, 11, 14, 14, 6, 14, 6, 9, 12, 9, 12, 5, 15, 8, 8, 5, 12, 9, 12, 5, 14, 6, 8, 13, 6, 5, 15, 13, 11, 11 ];
}, {
"./common": 87,
"./utils": 97
} ],
90: [ function(e, t, i) {
"use strict";
i.sha1 = e("./sha/1");
i.sha224 = e("./sha/224");
i.sha256 = e("./sha/256");
i.sha384 = e("./sha/384");
i.sha512 = e("./sha/512");
}, {
"./sha/1": 91,
"./sha/224": 92,
"./sha/256": 93,
"./sha/384": 94,
"./sha/512": 95
} ],
91: [ function(e, t, i) {
"use strict";
var r = e("../utils"), n = e("../common"), o = e("./common"), l = r.rotl32, d = r.sum32, u = r.sum32_5, p = o.ft_1, a = n.BlockHash, b = [ 1518500249, 1859775393, 2400959708, 3395469782 ];
function s() {
if (!(this instanceof s)) return new s();
a.call(this);
this.h = [ 1732584193, 4023233417, 2562383102, 271733878, 3285377520 ];
this.W = new Array(80);
}
r.inherits(s, a);
(t.exports = s).blockSize = 512;
s.outSize = 160;
s.hmacStrength = 80;
s.padLength = 64;
s.prototype._update = function(e, t) {
for (var i = this.W, r = 0; r < 16; r++) i[r] = e[t + r];
for (;r < i.length; r++) i[r] = l(i[r - 3] ^ i[r - 8] ^ i[r - 14] ^ i[r - 16], 1);
var n = this.h[0], o = this.h[1], a = this.h[2], s = this.h[3], c = this.h[4];
for (r = 0; r < i.length; r++) {
var f = ~~(r / 20), h = u(l(n, 5), p(f, o, a, s), c, i[r], b[f]);
c = s;
s = a;
a = l(o, 30);
o = n;
n = h;
}
this.h[0] = d(this.h[0], n);
this.h[1] = d(this.h[1], o);
this.h[2] = d(this.h[2], a);
this.h[3] = d(this.h[3], s);
this.h[4] = d(this.h[4], c);
};
s.prototype._digest = function(e) {
return "hex" === e ? r.toHex32(this.h, "big") : r.split32(this.h, "big");
};
}, {
"../common": 87,
"../utils": 97,
"./common": 96
} ],
92: [ function(e, t, i) {
"use strict";
var r = e("../utils"), n = e("./256");
function o() {
if (!(this instanceof o)) return new o();
n.call(this);
this.h = [ 3238371032, 914150663, 812702999, 4144912697, 4290775857, 1750603025, 1694076839, 3204075428 ];
}
r.inherits(o, n);
(t.exports = o).blockSize = 512;
o.outSize = 224;
o.hmacStrength = 192;
o.padLength = 64;
o.prototype._digest = function(e) {
return "hex" === e ? r.toHex32(this.h.slice(0, 7), "big") : r.split32(this.h.slice(0, 7), "big");
};
}, {
"../utils": 97,
"./256": 93
} ],
93: [ function(e, t, i) {
"use strict";
var r = e("../utils"), n = e("../common"), o = e("./common"), p = e("minimalistic-assert"), b = r.sum32, m = r.sum32_4, g = r.sum32_5, y = o.ch32, v = o.maj32, w = o.s0_256, S = o.s1_256, _ = o.g0_256, I = o.g1_256, a = n.BlockHash, s = [ 1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993, 2453635748, 2870763221, 3624381080, 310598401, 607225278, 1426881987, 1925078388, 2162078206, 2614888103, 3248222580, 3835390401, 4022224774, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986, 2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711, 113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, 2177026350, 2456956037, 2730485921, 2820302411, 3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344, 430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779, 1955562222, 2024104815, 2227730452, 2361852424, 2428436474, 2756734187, 3204031479, 3329325298 ];
function c() {
if (!(this instanceof c)) return new c();
a.call(this);
this.h = [ 1779033703, 3144134277, 1013904242, 2773480762, 1359893119, 2600822924, 528734635, 1541459225 ];
this.k = s;
this.W = new Array(64);
}
r.inherits(c, a);
(t.exports = c).blockSize = 512;
c.outSize = 256;
c.hmacStrength = 192;
c.padLength = 64;
c.prototype._update = function(e, t) {
for (var i = this.W, r = 0; r < 16; r++) i[r] = e[t + r];
for (;r < i.length; r++) i[r] = m(I(i[r - 2]), i[r - 7], _(i[r - 15]), i[r - 16]);
var n = this.h[0], o = this.h[1], a = this.h[2], s = this.h[3], c = this.h[4], f = this.h[5], h = this.h[6], l = this.h[7];
p(this.k.length === i.length);
for (r = 0; r < i.length; r++) {
var d = g(l, S(c), y(c, f, h), this.k[r], i[r]), u = b(w(n), v(n, o, a));
l = h;
h = f;
f = c;
c = b(s, d);
s = a;
a = o;
o = n;
n = b(d, u);
}
this.h[0] = b(this.h[0], n);
this.h[1] = b(this.h[1], o);
this.h[2] = b(this.h[2], a);
this.h[3] = b(this.h[3], s);
this.h[4] = b(this.h[4], c);
this.h[5] = b(this.h[5], f);
this.h[6] = b(this.h[6], h);
this.h[7] = b(this.h[7], l);
};
c.prototype._digest = function(e) {
return "hex" === e ? r.toHex32(this.h, "big") : r.split32(this.h, "big");
};
}, {
"../common": 87,
"../utils": 97,
"./common": 96,
"minimalistic-assert": 105
} ],
94: [ function(e, t, i) {
"use strict";
var r = e("../utils"), n = e("./512");
function o() {
if (!(this instanceof o)) return new o();
n.call(this);
this.h = [ 3418070365, 3238371032, 1654270250, 914150663, 2438529370, 812702999, 355462360, 4144912697, 1731405415, 4290775857, 2394180231, 1750603025, 3675008525, 1694076839, 1203062813, 3204075428 ];
}
r.inherits(o, n);
(t.exports = o).blockSize = 1024;
o.outSize = 384;
o.hmacStrength = 192;
o.padLength = 128;
o.prototype._digest = function(e) {
return "hex" === e ? r.toHex32(this.h.slice(0, 12), "big") : r.split32(this.h.slice(0, 12), "big");
};
}, {
"../utils": 97,
"./512": 95
} ],
95: [ function(e, t, i) {
"use strict";
var r = e("../utils"), n = e("../common"), N = e("minimalistic-assert"), o = r.rotr64_hi, a = r.rotr64_lo, s = r.shr64_hi, c = r.shr64_lo, B = r.sum64, P = r.sum64_hi, L = r.sum64_lo, d = r.sum64_4_hi, u = r.sum64_4_lo, U = r.sum64_5_hi, O = r.sum64_5_lo, f = n.BlockHash, h = [ 1116352408, 3609767458, 1899447441, 602891725, 3049323471, 3964484399, 3921009573, 2173295548, 961987163, 4081628472, 1508970993, 3053834265, 2453635748, 2937671579, 2870763221, 3664609560, 3624381080, 2734883394, 310598401, 1164996542, 607225278, 1323610764, 1426881987, 3590304994, 1925078388, 4068182383, 2162078206, 991336113, 2614888103, 633803317, 3248222580, 3479774868, 3835390401, 2666613458, 4022224774, 944711139, 264347078, 2341262773, 604807628, 2007800933, 770255983, 1495990901, 1249150122, 1856431235, 1555081692, 3175218132, 1996064986, 2198950837, 2554220882, 3999719339, 2821834349, 766784016, 2952996808, 2566594879, 3210313671, 3203337956, 3336571891, 1034457026, 3584528711, 2466948901, 113926993, 3758326383, 338241895, 168717936, 666307205, 1188179964, 773529912, 1546045734, 1294757372, 1522805485, 1396182291, 2643833823, 1695183700, 2343527390, 1986661051, 1014477480, 2177026350, 1206759142, 2456956037, 344077627, 2730485921, 1290863460, 2820302411, 3158454273, 3259730800, 3505952657, 3345764771, 106217008, 3516065817, 3606008344, 3600352804, 1432725776, 4094571909, 1467031594, 275423344, 851169720, 430227734, 3100823752, 506948616, 1363258195, 659060556, 3750685593, 883997877, 3785050280, 958139571, 3318307427, 1322822218, 3812723403, 1537002063, 2003034995, 1747873779, 3602036899, 1955562222, 1575990012, 2024104815, 1125592928, 2227730452, 2716904306, 2361852424, 442776044, 2428436474, 593698344, 2756734187, 3733110249, 3204031479, 2999351573, 3329325298, 3815920427, 3391569614, 3928383900, 3515267271, 566280711, 3940187606, 3454069534, 4118630271, 4000239992, 116418474, 1914138554, 174292421, 2731055270, 289380356, 3203993006, 460393269, 320620315, 685471733, 587496836, 852142971, 1086792851, 1017036298, 365543100, 1126000580, 2618297676, 1288033470, 3409855158, 1501505948, 4234509866, 1607167915, 987167468, 1816402316, 1246189591 ];
function l() {
if (!(this instanceof l)) return new l();
f.call(this);
this.h = [ 1779033703, 4089235720, 3144134277, 2227873595, 1013904242, 4271175723, 2773480762, 1595750129, 1359893119, 2917565137, 2600822924, 725511199, 528734635, 4215389547, 1541459225, 327033209 ];
this.k = h;
this.W = new Array(160);
}
r.inherits(l, f);
(t.exports = l).blockSize = 1024;
l.outSize = 512;
l.hmacStrength = 192;
l.padLength = 128;
l.prototype._prepareBlock = function(e, t) {
for (var i = this.W, r = 0; r < 32; r++) i[r] = e[t + r];
for (;r < i.length; r += 2) {
var n = m(i[r - 4], i[r - 3]), o = g(i[r - 4], i[r - 3]), a = i[r - 14], s = i[r - 13], c = p(i[r - 30], i[r - 29]), f = b(i[r - 30], i[r - 29]), h = i[r - 32], l = i[r - 31];
i[r] = d(n, o, a, s, c, f, h, l);
i[r + 1] = u(n, o, a, s, c, f, h, l);
}
};
l.prototype._update = function(e, t) {
this._prepareBlock(e, t);
var i = this.W, r = this.h[0], n = this.h[1], o = this.h[2], a = this.h[3], s = this.h[4], c = this.h[5], f = this.h[6], h = this.h[7], l = this.h[8], d = this.h[9], u = this.h[10], p = this.h[11], b = this.h[12], m = this.h[13], g = this.h[14], y = this.h[15];
N(this.k.length === i.length);
for (var v = 0; v < i.length; v += 2) {
var w = g, S = y, _ = K(l, d), I = W(l, d), x = F(l, d, u, p, b), C = j(l, d, u, p, b, m), G = this.k[v], A = this.k[v + 1], k = i[v], T = i[v + 1], E = U(w, S, _, I, x, C, G, A, k, T), M = O(w, S, _, I, x, C, G, A, k, T);
w = H(r, n);
S = V(r, n);
_ = q(r, n, o, a, s);
I = z(r, n, o, a, s, c);
var D = P(w, S, _, I), R = L(w, S, _, I);
g = b;
y = m;
b = u;
m = p;
u = l;
p = d;
l = P(f, h, E, M);
d = L(h, h, E, M);
f = s;
h = c;
s = o;
c = a;
o = r;
a = n;
r = P(E, M, D, R);
n = L(E, M, D, R);
}
B(this.h, 0, r, n);
B(this.h, 2, o, a);
B(this.h, 4, s, c);
B(this.h, 6, f, h);
B(this.h, 8, l, d);
B(this.h, 10, u, p);
B(this.h, 12, b, m);
B(this.h, 14, g, y);
};
l.prototype._digest = function(e) {
return "hex" === e ? r.toHex32(this.h, "big") : r.split32(this.h, "big");
};
function F(e, t, i, r, n) {
var o = e & i ^ ~e & n;
o < 0 && (o += 4294967296);
return o;
}
function j(e, t, i, r, n, o) {
var a = t & r ^ ~t & o;
a < 0 && (a += 4294967296);
return a;
}
function q(e, t, i, r, n) {
var o = e & i ^ e & n ^ i & n;
o < 0 && (o += 4294967296);
return o;
}
function z(e, t, i, r, n, o) {
var a = t & r ^ t & o ^ r & o;
a < 0 && (a += 4294967296);
return a;
}
function H(e, t) {
var i = o(e, t, 28) ^ o(t, e, 2) ^ o(t, e, 7);
i < 0 && (i += 4294967296);
return i;
}
function V(e, t) {
var i = a(e, t, 28) ^ a(t, e, 2) ^ a(t, e, 7);
i < 0 && (i += 4294967296);
return i;
}
function K(e, t) {
var i = o(e, t, 14) ^ o(e, t, 18) ^ o(t, e, 9);
i < 0 && (i += 4294967296);
return i;
}
function W(e, t) {
var i = a(e, t, 14) ^ a(e, t, 18) ^ a(t, e, 9);
i < 0 && (i += 4294967296);
return i;
}
function p(e, t) {
var i = o(e, t, 1) ^ o(e, t, 8) ^ s(e, t, 7);
i < 0 && (i += 4294967296);
return i;
}
function b(e, t) {
var i = a(e, t, 1) ^ a(e, t, 8) ^ c(e, t, 7);
i < 0 && (i += 4294967296);
return i;
}
function m(e, t) {
var i = o(e, t, 19) ^ o(t, e, 29) ^ s(e, t, 6);
i < 0 && (i += 4294967296);
return i;
}
function g(e, t) {
var i = a(e, t, 19) ^ a(t, e, 29) ^ c(e, t, 6);
i < 0 && (i += 4294967296);
return i;
}
}, {
"../common": 87,
"../utils": 97,
"minimalistic-assert": 105
} ],
96: [ function(e, t, i) {
"use strict";
var r = e("../utils").rotr32;
i.ft_1 = function(e, t, i, r) {
return 0 === e ? n(t, i, r) : 1 === e || 3 === e ? a(t, i, r) : 2 === e ? o(t, i, r) : void 0;
};
function n(e, t, i) {
return e & t ^ ~e & i;
}
i.ch32 = n;
function o(e, t, i) {
return e & t ^ e & i ^ t & i;
}
i.maj32 = o;
function a(e, t, i) {
return e ^ t ^ i;
}
i.p32 = a;
i.s0_256 = function(e) {
return r(e, 2) ^ r(e, 13) ^ r(e, 22);
};
i.s1_256 = function(e) {
return r(e, 6) ^ r(e, 11) ^ r(e, 25);
};
i.g0_256 = function(e) {
return r(e, 7) ^ r(e, 18) ^ e >>> 3;
};
i.g1_256 = function(e) {
return r(e, 17) ^ r(e, 19) ^ e >>> 10;
};
}, {
"../utils": 97
} ],
97: [ function(e, t, i) {
"use strict";
var f = e("minimalistic-assert"), r = e("inherits");
i.inherits = r;
i.toArray = function(e, t) {
if (Array.isArray(e)) return e.slice();
if (!e) return [];
var i = [];
if ("string" == typeof e) if (t) {
if ("hex" === t) {
(e = e.replace(/[^a-z0-9]+/gi, "")).length % 2 != 0 && (e = "0" + e);
for (r = 0; r < e.length; r += 2) i.push(parseInt(e[r] + e[r + 1], 16));
}
} else for (var r = 0; r < e.length; r++) {
var n = e.charCodeAt(r), o = n >> 8, a = 255 & n;
o ? i.push(o, a) : i.push(a);
} else for (r = 0; r < e.length; r++) i[r] = 0 | e[r];
return i;
};
i.toHex = function(e) {
for (var t = "", i = 0; i < e.length; i++) t += n(e[i].toString(16));
return t;
};
function o(e) {
return (e >>> 24 | e >>> 8 & 65280 | e << 8 & 16711680 | (255 & e) << 24) >>> 0;
}
i.htonl = o;
i.toHex32 = function(e, t) {
for (var i = "", r = 0; r < e.length; r++) {
var n = e[r];
"little" === t && (n = o(n));
i += a(n.toString(16));
}
return i;
};
function n(e) {
return 1 === e.length ? "0" + e : e;
}
i.zero2 = n;
function a(e) {
return 7 === e.length ? "0" + e : 6 === e.length ? "00" + e : 5 === e.length ? "000" + e : 4 === e.length ? "0000" + e : 3 === e.length ? "00000" + e : 2 === e.length ? "000000" + e : 1 === e.length ? "0000000" + e : e;
}
i.zero8 = a;
i.join32 = function(e, t, i, r) {
var n = i - t;
f(n % 4 == 0);
for (var o = new Array(n / 4), a = 0, s = t; a < o.length; a++, s += 4) {
var c;
c = "big" === r ? e[s] << 24 | e[s + 1] << 16 | e[s + 2] << 8 | e[s + 3] : e[s + 3] << 24 | e[s + 2] << 16 | e[s + 1] << 8 | e[s];
o[a] = c >>> 0;
}
return o;
};
i.split32 = function(e, t) {
for (var i = new Array(4 * e.length), r = 0, n = 0; r < e.length; r++, n += 4) {
var o = e[r];
if ("big" === t) {
i[n] = o >>> 24;
i[n + 1] = o >>> 16 & 255;
i[n + 2] = o >>> 8 & 255;
i[n + 3] = 255 & o;
} else {
i[n + 3] = o >>> 24;
i[n + 2] = o >>> 16 & 255;
i[n + 1] = o >>> 8 & 255;
i[n] = 255 & o;
}
}
return i;
};
i.rotr32 = function(e, t) {
return e >>> t | e << 32 - t;
};
i.rotl32 = function(e, t) {
return e << t | e >>> 32 - t;
};
i.sum32 = function(e, t) {
return e + t >>> 0;
};
i.sum32_3 = function(e, t, i) {
return e + t + i >>> 0;
};
i.sum32_4 = function(e, t, i, r) {
return e + t + i + r >>> 0;
};
i.sum32_5 = function(e, t, i, r, n) {
return e + t + i + r + n >>> 0;
};
i.sum64 = function(e, t, i, r) {
var n = e[t], o = r + e[t + 1] >>> 0, a = (o < r ? 1 : 0) + i + n;
e[t] = a >>> 0;
e[t + 1] = o;
};
i.sum64_hi = function(e, t, i, r) {
return (t + r >>> 0 < t ? 1 : 0) + e + i >>> 0;
};
i.sum64_lo = function(e, t, i, r) {
return t + r >>> 0;
};
i.sum64_4_hi = function(e, t, i, r, n, o, a, s) {
var c = 0, f = t;
c += (f = f + r >>> 0) < t ? 1 : 0;
c += (f = f + o >>> 0) < o ? 1 : 0;
return e + i + n + a + (c += (f = f + s >>> 0) < s ? 1 : 0) >>> 0;
};
i.sum64_4_lo = function(e, t, i, r, n, o, a, s) {
return t + r + o + s >>> 0;
};
i.sum64_5_hi = function(e, t, i, r, n, o, a, s, c, f) {
var h = 0, l = t;
h += (l = l + r >>> 0) < t ? 1 : 0;
h += (l = l + o >>> 0) < o ? 1 : 0;
h += (l = l + s >>> 0) < s ? 1 : 0;
return e + i + n + a + c + (h += (l = l + f >>> 0) < f ? 1 : 0) >>> 0;
};
i.sum64_5_lo = function(e, t, i, r, n, o, a, s, c, f) {
return t + r + o + s + f >>> 0;
};
i.rotr64_hi = function(e, t, i) {
return (t << 32 - i | e >>> i) >>> 0;
};
i.rotr64_lo = function(e, t, i) {
return (e << 32 - i | t >>> i) >>> 0;
};
i.shr64_hi = function(e, t, i) {
return e >>> i;
};
i.shr64_lo = function(e, t, i) {
return (e << 32 - i | t >>> i) >>> 0;
};
}, {
inherits: 101,
"minimalistic-assert": 105
} ],
98: [ function(e, t, i) {
"use strict";
var r = e("hash.js"), a = e("minimalistic-crypto-utils"), n = e("minimalistic-assert");
function o(e) {
if (!(this instanceof o)) return new o(e);
this.hash = e.hash;
this.predResist = !!e.predResist;
this.outLen = this.hash.outSize;
this.minEntropy = e.minEntropy || this.hash.hmacStrength;
this._reseed = null;
this.reseedInterval = null;
this.K = null;
this.V = null;
var t = a.toArray(e.entropy, e.entropyEnc || "hex"), i = a.toArray(e.nonce, e.nonceEnc || "hex"), r = a.toArray(e.pers, e.persEnc || "hex");
n(t.length >= this.minEntropy / 8, "Not enough entropy. Minimum is: " + this.minEntropy + " bits");
this._init(t, i, r);
}
(t.exports = o).prototype._init = function(e, t, i) {
var r = e.concat(t).concat(i);
this.K = new Array(this.outLen / 8);
this.V = new Array(this.outLen / 8);
for (var n = 0; n < this.V.length; n++) {
this.K[n] = 0;
this.V[n] = 1;
}
this._update(r);
this._reseed = 1;
this.reseedInterval = 281474976710656;
};
o.prototype._hmac = function() {
return new r.hmac(this.hash, this.K);
};
o.prototype._update = function(e) {
var t = this._hmac().update(this.V).update([ 0 ]);
e && (t = t.update(e));
this.K = t.digest();
this.V = this._hmac().update(this.V).digest();
if (e) {
this.K = this._hmac().update(this.V).update([ 1 ]).update(e).digest();
this.V = this._hmac().update(this.V).digest();
}
};
o.prototype.reseed = function(e, t, i, r) {
if ("string" != typeof t) {
r = i;
i = t;
t = null;
}
e = a.toArray(e, t);
i = a.toArray(i, r);
n(e.length >= this.minEntropy / 8, "Not enough entropy. Minimum is: " + this.minEntropy + " bits");
this._update(e.concat(i || []));
this._reseed = 1;
};
o.prototype.generate = function(e, t, i, r) {
if (this._reseed > this.reseedInterval) throw new Error("Reseed is required");
if ("string" != typeof t) {
r = i;
i = t;
t = null;
}
if (i) {
i = a.toArray(i, r || "hex");
this._update(i);
}
for (var n = []; n.length < e; ) {
this.V = this._hmac().update(this.V).digest();
n = n.concat(this.V);
}
var o = n.slice(0, e);
this._update(i);
this._reseed++;
return a.encode(o, t);
};
}, {
"hash.js": 86,
"minimalistic-assert": 105,
"minimalistic-crypto-utils": 106
} ],
99: [ function(e, t, i) {
i.read = function(e, t, i, r, n) {
var o, a, s = 8 * n - r - 1, c = (1 << s) - 1, f = c >> 1, h = -7, l = i ? n - 1 : 0, d = i ? -1 : 1, u = e[t + l];
l += d;
o = u & (1 << -h) - 1;
u >>= -h;
h += s;
for (;0 < h; o = 256 * o + e[t + l], l += d, h -= 8) ;
a = o & (1 << -h) - 1;
o >>= -h;
h += r;
for (;0 < h; a = 256 * a + e[t + l], l += d, h -= 8) ;
if (0 === o) o = 1 - f; else {
if (o === c) return a ? NaN : Infinity * (u ? -1 : 1);
a += Math.pow(2, r);
o -= f;
}
return (u ? -1 : 1) * a * Math.pow(2, o - r);
};
i.write = function(e, t, i, r, n, o) {
var a, s, c, f = 8 * o - n - 1, h = (1 << f) - 1, l = h >> 1, d = 23 === n ? Math.pow(2, -24) - Math.pow(2, -77) : 0, u = r ? 0 : o - 1, p = r ? 1 : -1, b = t < 0 || 0 === t && 1 / t < 0 ? 1 : 0;
t = Math.abs(t);
if (isNaN(t) || Infinity === t) {
s = isNaN(t) ? 1 : 0;
a = h;
} else {
a = Math.floor(Math.log(t) / Math.LN2);
if (t * (c = Math.pow(2, -a)) < 1) {
a--;
c *= 2;
}
if (2 <= (t += 1 <= a + l ? d / c : d * Math.pow(2, 1 - l)) * c) {
a++;
c /= 2;
}
if (h <= a + l) {
s = 0;
a = h;
} else if (1 <= a + l) {
s = (t * c - 1) * Math.pow(2, n);
a += l;
} else {
s = t * Math.pow(2, l - 1) * Math.pow(2, n);
a = 0;
}
}
for (;8 <= n; e[i + u] = 255 & s, u += p, s /= 256, n -= 8) ;
a = a << n | s;
f += n;
for (;0 < f; e[i + u] = 255 & a, u += p, a /= 256, f -= 8) ;
e[i + u - p] |= 128 * b;
};
}, {} ],
100: [ function(e, t, i) {
var r = [].indexOf;
t.exports = function(e, t) {
if (r) return e.indexOf(t);
for (var i = 0; i < e.length; ++i) if (e[i] === t) return i;
return -1;
};
}, {} ],
101: [ function(e, t, i) {
"function" == typeof Object.create ? t.exports = function(e, t) {
e.super_ = t;
e.prototype = Object.create(t.prototype, {
constructor: {
value: e,
enumerable: !1,
writable: !0,
configurable: !0
}
});
} : t.exports = function(e, t) {
e.super_ = t;
var i = function() {};
i.prototype = t.prototype;
e.prototype = new i();
e.prototype.constructor = e;
};
}, {} ],
102: [ function(e, t, i) {
t.exports = function(e) {
return null != e && (r(e) || "function" == typeof (t = e).readFloatLE && "function" == typeof t.slice && r(t.slice(0, 0)) || !!e._isBuffer);
var t;
};
function r(e) {
return !!e.constructor && "function" == typeof e.constructor.isBuffer && e.constructor.isBuffer(e);
}
}, {} ],
103: [ function(n, o, e) {
(function(t) {
"use strict";
var e = n("inherits"), i = n("hash-base"), a = new Array(16);
function r() {
i.call(this, 64);
this._a = 1732584193;
this._b = 4023233417;
this._c = 2562383102;
this._d = 271733878;
}
e(r, i);
r.prototype._update = function() {
for (var e = a, t = 0; t < 16; ++t) e[t] = this._block.readInt32LE(4 * t);
var i = this._a, r = this._b, n = this._c, o = this._d;
r = l(r = l(r = l(r = l(r = h(r = h(r = h(r = h(r = f(r = f(r = f(r = f(r = c(r = c(r = c(r = c(r, n = c(n, o = c(o, i = c(i, r, n, o, e[0], 3614090360, 7), r, n, e[1], 3905402710, 12), i, r, e[2], 606105819, 17), o, i, e[3], 3250441966, 22), n = c(n, o = c(o, i = c(i, r, n, o, e[4], 4118548399, 7), r, n, e[5], 1200080426, 12), i, r, e[6], 2821735955, 17), o, i, e[7], 4249261313, 22), n = c(n, o = c(o, i = c(i, r, n, o, e[8], 1770035416, 7), r, n, e[9], 2336552879, 12), i, r, e[10], 4294925233, 17), o, i, e[11], 2304563134, 22), n = c(n, o = c(o, i = c(i, r, n, o, e[12], 1804603682, 7), r, n, e[13], 4254626195, 12), i, r, e[14], 2792965006, 17), o, i, e[15], 1236535329, 22), n = f(n, o = f(o, i = f(i, r, n, o, e[1], 4129170786, 5), r, n, e[6], 3225465664, 9), i, r, e[11], 643717713, 14), o, i, e[0], 3921069994, 20), n = f(n, o = f(o, i = f(i, r, n, o, e[5], 3593408605, 5), r, n, e[10], 38016083, 9), i, r, e[15], 3634488961, 14), o, i, e[4], 3889429448, 20), n = f(n, o = f(o, i = f(i, r, n, o, e[9], 568446438, 5), r, n, e[14], 3275163606, 9), i, r, e[3], 4107603335, 14), o, i, e[8], 1163531501, 20), n = f(n, o = f(o, i = f(i, r, n, o, e[13], 2850285829, 5), r, n, e[2], 4243563512, 9), i, r, e[7], 1735328473, 14), o, i, e[12], 2368359562, 20), n = h(n, o = h(o, i = h(i, r, n, o, e[5], 4294588738, 4), r, n, e[8], 2272392833, 11), i, r, e[11], 1839030562, 16), o, i, e[14], 4259657740, 23), n = h(n, o = h(o, i = h(i, r, n, o, e[1], 2763975236, 4), r, n, e[4], 1272893353, 11), i, r, e[7], 4139469664, 16), o, i, e[10], 3200236656, 23), n = h(n, o = h(o, i = h(i, r, n, o, e[13], 681279174, 4), r, n, e[0], 3936430074, 11), i, r, e[3], 3572445317, 16), o, i, e[6], 76029189, 23), n = h(n, o = h(o, i = h(i, r, n, o, e[9], 3654602809, 4), r, n, e[12], 3873151461, 11), i, r, e[15], 530742520, 16), o, i, e[2], 3299628645, 23), n = l(n, o = l(o, i = l(i, r, n, o, e[0], 4096336452, 6), r, n, e[7], 1126891415, 10), i, r, e[14], 2878612391, 15), o, i, e[5], 4237533241, 21), n = l(n, o = l(o, i = l(i, r, n, o, e[12], 1700485571, 6), r, n, e[3], 2399980690, 10), i, r, e[10], 4293915773, 15), o, i, e[1], 2240044497, 21), n = l(n, o = l(o, i = l(i, r, n, o, e[8], 1873313359, 6), r, n, e[15], 4264355552, 10), i, r, e[6], 2734768916, 15), o, i, e[13], 1309151649, 21), n = l(n, o = l(o, i = l(i, r, n, o, e[4], 4149444226, 6), r, n, e[11], 3174756917, 10), i, r, e[2], 718787259, 15), o, i, e[9], 3951481745, 21);
this._a = this._a + i | 0;
this._b = this._b + r | 0;
this._c = this._c + n | 0;
this._d = this._d + o | 0;
};
r.prototype._digest = function() {
this._block[this._blockOffset++] = 128;
if (56 < this._blockOffset) {
this._block.fill(0, this._blockOffset, 64);
this._update();
this._blockOffset = 0;
}
this._block.fill(0, this._blockOffset, 56);
this._block.writeUInt32LE(this._length[0], 56);
this._block.writeUInt32LE(this._length[1], 60);
this._update();
var e = new t(16);
e.writeInt32LE(this._a, 0);
e.writeInt32LE(this._b, 4);
e.writeInt32LE(this._c, 8);
e.writeInt32LE(this._d, 12);
return e;
};
function s(e, t) {
return e << t | e >>> 32 - t;
}
function c(e, t, i, r, n, o, a) {
return s(e + (t & i | ~t & r) + n + o | 0, a) + t | 0;
}
function f(e, t, i, r, n, o, a) {
return s(e + (t & r | i & ~r) + n + o | 0, a) + t | 0;
}
function h(e, t, i, r, n, o, a) {
return s(e + (t ^ i ^ r) + n + o | 0, a) + t | 0;
}
function l(e, t, i, r, n, o, a) {
return s(e + (i ^ (t | ~r)) + n + o | 0, a) + t | 0;
}
o.exports = r;
}).call(this, n("buffer").Buffer);
}, {
buffer: 47,
"hash-base": 85,
inherits: 101
} ],
104: [ function(e, t, i) {
var u = e("bn.js"), r = e("brorand");
function n(e) {
this.rand = e || new r.Rand();
}
(t.exports = n).create = function(e) {
return new n(e);
};
n.prototype._randbelow = function(e) {
var t = e.bitLength(), i = Math.ceil(t / 8);
do {
var r = new u(this.rand.generate(i));
} while (0 <= r.cmp(e));
return r;
};
n.prototype._randrange = function(e, t) {
var i = t.sub(e);
return e.add(this._randbelow(i));
};
n.prototype.test = function(e, t, i) {
var r = e.bitLength(), n = u.mont(e), o = new u(1).toRed(n);
t || (t = Math.max(1, r / 48 | 0));
for (var a = e.subn(1), s = 0; !a.testn(s); s++) ;
for (var c = e.shrn(s), f = a.toRed(n); 0 < t; t--) {
var h = this._randrange(new u(2), a);
i && i(h);
var l = h.toRed(n).redPow(c);
if (0 !== l.cmp(o) && 0 !== l.cmp(f)) {
for (var d = 1; d < s; d++) {
if (0 === (l = l.redSqr()).cmp(o)) return !1;
if (0 === l.cmp(f)) break;
}
if (d === s) return !1;
}
}
return !0;
};
n.prototype.getDivisor = function(e, t) {
var i = e.bitLength(), r = u.mont(e), n = new u(1).toRed(r);
t || (t = Math.max(1, i / 48 | 0));
for (var o = e.subn(1), a = 0; !o.testn(a); a++) ;
for (var s = e.shrn(a), c = o.toRed(r); 0 < t; t--) {
var f = this._randrange(new u(2), o), h = e.gcd(f);
if (0 !== h.cmpn(1)) return h;
var l = f.toRed(r).redPow(s);
if (0 !== l.cmp(n) && 0 !== l.cmp(c)) {
for (var d = 1; d < a; d++) {
if (0 === (l = l.redSqr()).cmp(n)) return l.fromRed().subn(1).gcd(e);
if (0 === l.cmp(c)) break;
}
if (d === a) return (l = l.redSqr()).fromRed().subn(1).gcd(e);
}
}
return !1;
};
}, {
"bn.js": 16,
brorand: 17
} ],
105: [ function(e, t, i) {
function r(e, t) {
if (!e) throw new Error(t || "Assertion failed");
}
(t.exports = r).equal = function(e, t, i) {
if (e != t) throw new Error(i || "Assertion failed: " + e + " != " + t);
};
}, {} ],
106: [ function(e, t, i) {
"use strict";
var r = i;
r.toArray = function(e, t) {
if (Array.isArray(e)) return e.slice();
if (!e) return [];
var i = [];
if ("string" != typeof e) {
for (var r = 0; r < e.length; r++) i[r] = 0 | e[r];
return i;
}
if ("hex" === t) {
(e = e.replace(/[^a-z0-9]+/gi, "")).length % 2 != 0 && (e = "0" + e);
for (r = 0; r < e.length; r += 2) i.push(parseInt(e[r] + e[r + 1], 16));
} else for (r = 0; r < e.length; r++) {
var n = e.charCodeAt(r), o = n >> 8, a = 255 & n;
o ? i.push(o, a) : i.push(a);
}
return i;
};
function n(e) {
return 1 === e.length ? "0" + e : e;
}
r.zero2 = n;
function o(e) {
for (var t = "", i = 0; i < e.length; i++) t += n(e[i].toString(16));
return t;
}
r.toHex = o;
r.encode = function(e, t) {
return "hex" === t ? o(e) : e;
};
}, {} ],
107: [ function(e, t, i) {
t.exports = {
"2.16.840.1.101.3.4.1.1": "aes-128-ecb",
"2.16.840.1.101.3.4.1.2": "aes-128-cbc",
"2.16.840.1.101.3.4.1.3": "aes-128-ofb",
"2.16.840.1.101.3.4.1.4": "aes-128-cfb",
"2.16.840.1.101.3.4.1.21": "aes-192-ecb",
"2.16.840.1.101.3.4.1.22": "aes-192-cbc",
"2.16.840.1.101.3.4.1.23": "aes-192-ofb",
"2.16.840.1.101.3.4.1.24": "aes-192-cfb",
"2.16.840.1.101.3.4.1.41": "aes-256-ecb",
"2.16.840.1.101.3.4.1.42": "aes-256-cbc",
"2.16.840.1.101.3.4.1.43": "aes-256-ofb",
"2.16.840.1.101.3.4.1.44": "aes-256-cfb"
};
}, {} ],
108: [ function(e, t, i) {
"use strict";
var r = e("asn1.js");
i.certificate = e("./certificate");
var n = r.define("RSAPrivateKey", function() {
this.seq().obj(this.key("version").int(), this.key("modulus").int(), this.key("publicExponent").int(), this.key("privateExponent").int(), this.key("prime1").int(), this.key("prime2").int(), this.key("exponent1").int(), this.key("exponent2").int(), this.key("coefficient").int());
});
i.RSAPrivateKey = n;
var o = r.define("RSAPublicKey", function() {
this.seq().obj(this.key("modulus").int(), this.key("publicExponent").int());
});
i.RSAPublicKey = o;
var a = r.define("SubjectPublicKeyInfo", function() {
this.seq().obj(this.key("algorithm").use(s), this.key("subjectPublicKey").bitstr());
});
i.PublicKey = a;
var s = r.define("AlgorithmIdentifier", function() {
this.seq().obj(this.key("algorithm").objid(), this.key("none").null_().optional(), this.key("curve").objid().optional(), this.key("params").seq().obj(this.key("p").int(), this.key("q").int(), this.key("g").int()).optional());
}), c = r.define("PrivateKeyInfo", function() {
this.seq().obj(this.key("version").int(), this.key("algorithm").use(s), this.key("subjectPrivateKey").octstr());
});
i.PrivateKey = c;
var f = r.define("EncryptedPrivateKeyInfo", function() {
this.seq().obj(this.key("algorithm").seq().obj(this.key("id").objid(), this.key("decrypt").seq().obj(this.key("kde").seq().obj(this.key("id").objid(), this.key("kdeparams").seq().obj(this.key("salt").octstr(), this.key("iters").int())), this.key("cipher").seq().obj(this.key("algo").objid(), this.key("iv").octstr()))), this.key("subjectPrivateKey").octstr());
});
i.EncryptedPrivateKey = f;
var h = r.define("DSAPrivateKey", function() {
this.seq().obj(this.key("version").int(), this.key("p").int(), this.key("q").int(), this.key("g").int(), this.key("pub_key").int(), this.key("priv_key").int());
});
i.DSAPrivateKey = h;
i.DSAparam = r.define("DSAparam", function() {
this.int();
});
var l = r.define("ECPrivateKey", function() {
this.seq().obj(this.key("version").int(), this.key("privateKey").octstr(), this.key("parameters").optional().explicit(0).use(d), this.key("publicKey").optional().explicit(1).bitstr());
});
i.ECPrivateKey = l;
var d = r.define("ECParameters", function() {
this.choice({
namedCurve: this.objid()
});
});
i.signature = r.define("signature", function() {
this.seq().obj(this.key("r").int(), this.key("s").int());
});
}, {
"./certificate": 109,
"asn1.js": 1
} ],
109: [ function(e, t, i) {
"use strict";
var r = e("asn1.js"), n = r.define("Time", function() {
this.choice({
utcTime: this.utctime(),
generalTime: this.gentime()
});
}), o = r.define("AttributeTypeValue", function() {
this.seq().obj(this.key("type").objid(), this.key("value").any());
}), a = r.define("AlgorithmIdentifier", function() {
this.seq().obj(this.key("algorithm").objid(), this.key("parameters").optional());
}), s = r.define("SubjectPublicKeyInfo", function() {
this.seq().obj(this.key("algorithm").use(a), this.key("subjectPublicKey").bitstr());
}), c = r.define("RelativeDistinguishedName", function() {
this.setof(o);
}), f = r.define("RDNSequence", function() {
this.seqof(c);
}), h = r.define("Name", function() {
this.choice({
rdnSequence: this.use(f)
});
}), l = r.define("Validity", function() {
this.seq().obj(this.key("notBefore").use(n), this.key("notAfter").use(n));
}), d = r.define("Extension", function() {
this.seq().obj(this.key("extnID").objid(), this.key("critical").bool().def(!1), this.key("extnValue").octstr());
}), u = r.define("TBSCertificate", function() {
this.seq().obj(this.key("version").explicit(0).int(), this.key("serialNumber").int(), this.key("signature").use(a), this.key("issuer").use(h), this.key("validity").use(l), this.key("subject").use(h), this.key("subjectPublicKeyInfo").use(s), this.key("issuerUniqueID").implicit(1).bitstr().optional(), this.key("subjectUniqueID").implicit(2).bitstr().optional(), this.key("extensions").explicit(3).seqof(d).optional());
}), p = r.define("X509Certificate", function() {
this.seq().obj(this.key("tbsCertificate").use(u), this.key("signatureAlgorithm").use(a), this.key("signatureValue").bitstr());
});
t.exports = p;
}, {
"asn1.js": 1
} ],
110: [ function(e, t, i) {
(function(d) {
var u = /Proc-Type: 4,ENCRYPTED[\n\r]+DEK-Info: AES-((?:128)|(?:192)|(?:256))-CBC,([0-9A-H]+)[\n\r]+([0-9A-z\n\r\+\/\=]+)[\n\r]+/m, p = /^-----BEGIN ((?:.* KEY)|CERTIFICATE)-----/m, b = /^-----BEGIN ((?:.* KEY)|CERTIFICATE)-----([0-9A-z\n\r\+\/\=]+)-----END \1-----$/m, m = e("evp_bytestokey"), g = e("browserify-aes");
t.exports = function(e, t) {
var i, r = e.toString(), n = r.match(u);
if (n) {
var o = "aes" + n[1], a = new d(n[2], "hex"), s = new d(n[3].replace(/[\r\n]/g, ""), "base64"), c = m(t, a.slice(0, 8), parseInt(n[1], 10)).key, f = [], h = g.createDecipheriv(o, c, a);
f.push(h.update(s));
f.push(h.final());
i = d.concat(f);
} else {
var l = r.match(b);
i = new d(l[2].replace(/[\r\n]/g, ""), "base64");
}
return {
tag: r.match(p)[1],
data: i
};
};
}).call(this, e("buffer").Buffer);
}, {
"browserify-aes": 21,
buffer: 47,
evp_bytestokey: 84
} ],
111: [ function(t, i, e) {
(function(l) {
var s = t("./asn1"), d = t("./aesid.json"), c = t("./fixProc"), u = t("browserify-aes"), p = t("pbkdf2");
function e(e) {
var t;
if ("object" == typeof e && !l.isBuffer(e)) {
t = e.passphrase;
e = e.key;
}
"string" == typeof e && (e = new l(e));
var i, r, n = c(e, t), o = n.tag, a = n.data;
switch (o) {
case "CERTIFICATE":
r = s.certificate.decode(a, "der").tbsCertificate.subjectPublicKeyInfo;

case "PUBLIC KEY":
r || (r = s.PublicKey.decode(a, "der"));
switch (i = r.algorithm.algorithm.join(".")) {
case "1.2.840.113549.1.1.1":
return s.RSAPublicKey.decode(r.subjectPublicKey.data, "der");

case "1.2.840.10045.2.1":
r.subjectPrivateKey = r.subjectPublicKey;
return {
type: "ec",
data: r
};

case "1.2.840.10040.4.1":
r.algorithm.params.pub_key = s.DSAparam.decode(r.subjectPublicKey.data, "der");
return {
type: "dsa",
data: r.algorithm.params
};

default:
throw new Error("unknown key id " + i);
}
throw new Error("unknown key type " + o);

case "ENCRYPTED PRIVATE KEY":
a = function(e, t) {
var i = e.algorithm.decrypt.kde.kdeparams.salt, r = parseInt(e.algorithm.decrypt.kde.kdeparams.iters.toString(), 10), n = d[e.algorithm.decrypt.cipher.algo.join(".")], o = e.algorithm.decrypt.cipher.iv, a = e.subjectPrivateKey, s = parseInt(n.split("-")[1], 10) / 8, c = p.pbkdf2Sync(t, i, r, s), f = u.createDecipheriv(n, c, o), h = [];
h.push(f.update(a));
h.push(f.final());
return l.concat(h);
}(a = s.EncryptedPrivateKey.decode(a, "der"), t);

case "PRIVATE KEY":
switch (i = (r = s.PrivateKey.decode(a, "der")).algorithm.algorithm.join(".")) {
case "1.2.840.113549.1.1.1":
return s.RSAPrivateKey.decode(r.subjectPrivateKey, "der");

case "1.2.840.10045.2.1":
return {
curve: r.algorithm.curve,
privateKey: s.ECPrivateKey.decode(r.subjectPrivateKey, "der").privateKey
};

case "1.2.840.10040.4.1":
r.algorithm.params.priv_key = s.DSAparam.decode(r.subjectPrivateKey, "der");
return {
type: "dsa",
params: r.algorithm.params
};

default:
throw new Error("unknown key id " + i);
}
throw new Error("unknown key type " + o);

case "RSA PUBLIC KEY":
return s.RSAPublicKey.decode(a, "der");

case "RSA PRIVATE KEY":
return s.RSAPrivateKey.decode(a, "der");

case "DSA PRIVATE KEY":
return {
type: "dsa",
params: s.DSAPrivateKey.decode(a, "der")
};

case "EC PRIVATE KEY":
return {
curve: (a = s.ECPrivateKey.decode(a, "der")).parameters.value,
privateKey: a.privateKey
};

default:
throw new Error("unknown key type " + o);
}
}
(i.exports = e).signature = s.signature;
}).call(this, t("buffer").Buffer);
}, {
"./aesid.json": 107,
"./asn1": 108,
"./fixProc": 110,
"browserify-aes": 21,
buffer: 47,
pbkdf2: 112
} ],
112: [ function(e, t, i) {
i.pbkdf2 = e("./lib/async");
i.pbkdf2Sync = e("./lib/sync");
}, {
"./lib/async": 113,
"./lib/sync": 116
} ],
113: [ function(e, t, i) {
(function(f, h) {
var l, d = e("./precondition"), u = e("./default-encoding"), p = e("./sync"), b = e("safe-buffer").Buffer, m = h.crypto && h.crypto.subtle, g = {
sha: "SHA-1",
"sha-1": "SHA-1",
sha1: "SHA-1",
sha256: "SHA-256",
"sha-256": "SHA-256",
sha384: "SHA-384",
"sha-384": "SHA-384",
"sha-512": "SHA-512",
sha512: "SHA-512"
}, y = [];
function v(e, t, i, r, n) {
return m.importKey("raw", e, {
name: "PBKDF2"
}, !1, [ "deriveBits" ]).then(function(e) {
return m.deriveBits({
name: "PBKDF2",
salt: t,
iterations: i,
hash: {
name: n
}
}, e, r << 3);
}).then(function(e) {
return b.from(e);
});
}
t.exports = function(t, i, r, n, o, a) {
b.isBuffer(t) || (t = b.from(t, u));
b.isBuffer(i) || (i = b.from(i, u));
d(r, n);
if ("function" == typeof o) {
a = o;
o = void 0;
}
if ("function" != typeof a) throw new Error("No callback provided to pbkdf2");
var e, s, c = g[(o = o || "sha1").toLowerCase()];
if (!c || "function" != typeof h.Promise) return f.nextTick(function() {
var e;
try {
e = p(t, i, r, n, o);
} catch (e) {
return a(e);
}
a(null, e);
});
e = function(e) {
if (h.process && !h.process.browser) return Promise.resolve(!1);
if (!m || !m.importKey || !m.deriveBits) return Promise.resolve(!1);
if (void 0 !== y[e]) return y[e];
var t = v(l = l || b.alloc(8), l, 10, 128, e).then(function() {
return !0;
}).catch(function() {
return !1;
});
return y[e] = t;
}(c).then(function(e) {
return e ? v(t, i, r, n, c) : p(t, i, r, n, o);
}), s = a, e.then(function(e) {
f.nextTick(function() {
s(null, e);
});
}, function(e) {
f.nextTick(function() {
s(e);
});
});
};
}).call(this, e("_process"), "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {});
}, {
"./default-encoding": 114,
"./precondition": 115,
"./sync": 116,
_process: 118,
"safe-buffer": 144
} ],
114: [ function(e, i, t) {
(function(e) {
var t;
if (e.browser) t = "utf-8"; else {
t = 6 <= parseInt(e.version.split(".")[0].slice(1), 10) ? "utf-8" : "binary";
}
i.exports = t;
}).call(this, e("_process"));
}, {
_process: 118
} ],
115: [ function(e, t, i) {
var r = Math.pow(2, 30) - 1;
t.exports = function(e, t) {
if ("number" != typeof e) throw new TypeError("Iterations not a number");
if (e < 0) throw new TypeError("Bad iterations");
if ("number" != typeof t) throw new TypeError("Key length not a number");
if (t < 0 || r < t || t != t) throw new TypeError("Bad key length");
};
}, {} ],
116: [ function(e, t, i) {
var h = e("create-hash/md5"), l = e("ripemd160"), d = e("sha.js"), m = e("./precondition"), g = e("./default-encoding"), y = e("safe-buffer").Buffer, u = y.alloc(128), v = {
md5: 16,
sha1: 20,
sha224: 28,
sha256: 32,
sha384: 48,
sha512: 64,
rmd160: 20,
ripemd160: 20
};
function w(e, t, i) {
var r, n = "rmd160" === (r = e) || "ripemd160" === r ? l : "md5" === r ? h : function(e) {
return d(r).update(e).digest();
}, o = "sha512" === e || "sha384" === e ? 128 : 64;
t.length > o ? t = n(t) : t.length < o && (t = y.concat([ t, u ], o));
for (var a = y.allocUnsafe(o + v[e]), s = y.allocUnsafe(o + v[e]), c = 0; c < o; c++) {
a[c] = 54 ^ t[c];
s[c] = 92 ^ t[c];
}
var f = y.allocUnsafe(o + i + 4);
a.copy(f, 0, 0, o);
this.ipad1 = f;
this.ipad2 = a;
this.opad = s;
this.alg = e;
this.blocksize = o;
this.hash = n;
this.size = v[e];
}
w.prototype.run = function(e, t) {
e.copy(t, this.blocksize);
this.hash(t).copy(this.opad, this.blocksize);
return this.hash(this.opad);
};
t.exports = function(e, t, i, r, n) {
y.isBuffer(e) || (e = y.from(e, g));
y.isBuffer(t) || (t = y.from(t, g));
m(i, r);
var o = new w(n = n || "sha1", e, t.length), a = y.allocUnsafe(r), s = y.allocUnsafe(t.length + 4);
t.copy(s, 0, 0, t.length);
for (var c = 0, f = v[n], h = Math.ceil(r / f), l = 1; l <= h; l++) {
s.writeUInt32BE(l, t.length);
for (var d = o.run(s, o.ipad1), u = d, p = 1; p < i; p++) {
u = o.run(u, o.ipad2);
for (var b = 0; b < f; b++) d[b] ^= u[b];
}
d.copy(a, c);
c += f;
}
return a;
};
}, {
"./default-encoding": 114,
"./precondition": 115,
"create-hash/md5": 53,
ripemd160: 142,
"safe-buffer": 144,
"sha.js": 146
} ],
117: [ function(e, t, i) {
(function(s) {
"use strict";
!s.version || 0 === s.version.indexOf("v0.") || 0 === s.version.indexOf("v1.") && 0 !== s.version.indexOf("v1.8.") ? t.exports = {
nextTick: function(e, t, i, r) {
if ("function" != typeof e) throw new TypeError('"callback" argument must be a function');
var n, o, a = arguments.length;
switch (a) {
case 0:
case 1:
return s.nextTick(e);

case 2:
return s.nextTick(function() {
e.call(null, t);
});

case 3:
return s.nextTick(function() {
e.call(null, t, i);
});

case 4:
return s.nextTick(function() {
e.call(null, t, i, r);
});

default:
n = new Array(a - 1);
o = 0;
for (;o < n.length; ) n[o++] = arguments[o];
return s.nextTick(function() {
e.apply(null, n);
});
}
}
} : t.exports = s;
}).call(this, e("_process"));
}, {
_process: 118
} ],
118: [ function(e, t, i) {
var r, n, o = t.exports = {};
function a() {
throw new Error("setTimeout has not been defined");
}
function s() {
throw new Error("clearTimeout has not been defined");
}
(function() {
try {
r = "function" == typeof setTimeout ? setTimeout : a;
} catch (e) {
r = a;
}
try {
n = "function" == typeof clearTimeout ? clearTimeout : s;
} catch (e) {
n = s;
}
})();
function c(t) {
if (r === setTimeout) return setTimeout(t, 0);
if ((r === a || !r) && setTimeout) {
r = setTimeout;
return setTimeout(t, 0);
}
try {
return r(t, 0);
} catch (e) {
try {
return r.call(null, t, 0);
} catch (e) {
return r.call(this, t, 0);
}
}
}
var f, h = [], l = !1, d = -1;
function u() {
if (l && f) {
l = !1;
f.length ? h = f.concat(h) : d = -1;
h.length && p();
}
}
function p() {
if (!l) {
var e = c(u);
l = !0;
for (var t = h.length; t; ) {
f = h;
h = [];
for (;++d < t; ) f && f[d].run();
d = -1;
t = h.length;
}
f = null;
l = !1;
(function(t) {
if (n === clearTimeout) return clearTimeout(t);
if ((n === s || !n) && clearTimeout) {
n = clearTimeout;
return clearTimeout(t);
}
try {
n(t);
} catch (e) {
try {
return n.call(null, t);
} catch (e) {
return n.call(this, t);
}
}
})(e);
}
}
o.nextTick = function(e) {
var t = new Array(arguments.length - 1);
if (1 < arguments.length) for (var i = 1; i < arguments.length; i++) t[i - 1] = arguments[i];
h.push(new b(e, t));
1 !== h.length || l || c(p);
};
function b(e, t) {
this.fun = e;
this.array = t;
}
b.prototype.run = function() {
this.fun.apply(null, this.array);
};
o.title = "browser";
o.browser = !0;
o.env = {};
o.argv = [];
o.version = "";
o.versions = {};
function m() {}
o.on = m;
o.addListener = m;
o.once = m;
o.off = m;
o.removeListener = m;
o.removeAllListeners = m;
o.emit = m;
o.prependListener = m;
o.prependOnceListener = m;
o.listeners = function(e) {
return [];
};
o.binding = function(e) {
throw new Error("process.binding is not supported");
};
o.cwd = function() {
return "/";
};
o.chdir = function(e) {
throw new Error("process.chdir is not supported");
};
o.umask = function() {
return 0;
};
}, {} ],
119: [ function(e, t, i) {
i.publicEncrypt = e("./publicEncrypt");
i.privateDecrypt = e("./privateDecrypt");
i.privateEncrypt = function(e, t) {
return i.publicEncrypt(e, t, !0);
};
i.publicDecrypt = function(e, t) {
return i.privateDecrypt(e, t, !0);
};
}, {
"./privateDecrypt": 121,
"./publicEncrypt": 122
} ],
120: [ function(e, t, i) {
(function(o) {
var a = e("create-hash");
t.exports = function(e, t) {
for (var i, r = new o(""), n = 0; r.length < t; ) {
i = s(n++);
r = o.concat([ r, a("sha1").update(e).update(i).digest() ]);
}
return r.slice(0, t);
};
function s(e) {
var t = new o(4);
t.writeUInt32BE(e, 0);
return t;
}
}).call(this, e("buffer").Buffer);
}, {
buffer: 47,
"create-hash": 52
} ],
121: [ function(e, t, i) {
(function(h) {
var c = e("parse-asn1"), l = e("./mgf"), d = e("./xor"), f = e("bn.js"), u = e("browserify-rsa"), p = e("create-hash"), b = e("./withPublic");
t.exports = function(e, t, i) {
var r;
r = e.padding ? e.padding : i ? 1 : 4;
var n, o = c(e), a = o.modulus.byteLength();
if (t.length > a || 0 <= new f(t).cmp(o.modulus)) throw new Error("decryption error");
n = i ? b(new f(t), o) : u(t, o);
var s = new h(a - n.length);
s.fill(0);
n = h.concat([ s, n ], a);
if (4 === r) return function(e, t) {
e.modulus;
var i = e.modulus.byteLength(), r = (t.length, p("sha1").update(new h("")).digest()), n = r.length;
if (0 !== t[0]) throw new Error("decryption error");
var o = t.slice(1, n + 1), a = t.slice(n + 1), s = d(o, l(a, n)), c = d(a, l(s, i - n - 1));
if (function(e, t) {
e = new h(e);
t = new h(t);
var i = 0, r = e.length;
if (e.length !== t.length) {
i++;
r = Math.min(e.length, t.length);
}
var n = -1;
for (;++n < r; ) i += e[n] ^ t[n];
return i;
}(r, c.slice(0, n))) throw new Error("decryption error");
var f = n;
for (;0 === c[f]; ) f++;
if (1 !== c[f++]) throw new Error("decryption error");
return c.slice(f);
}(o, n);
if (1 === r) return function(e, t, i) {
var r = t.slice(0, 2), n = 2, o = 0;
for (;0 !== t[n++]; ) if (n >= t.length) {
o++;
break;
}
var a = t.slice(2, n - 1);
t.slice(n - 1, n);
("0002" !== r.toString("hex") && !i || "0001" !== r.toString("hex") && i) && o++;
a.length < 8 && o++;
if (o) throw new Error("decryption error");
return t.slice(n);
}(0, n, i);
if (3 === r) return n;
throw new Error("unknown padding");
};
}).call(this, e("buffer").Buffer);
}, {
"./mgf": 120,
"./withPublic": 123,
"./xor": 124,
"bn.js": 16,
"browserify-rsa": 39,
buffer: 47,
"create-hash": 52,
"parse-asn1": 111
} ],
122: [ function(e, t, i) {
(function(d) {
var a = e("parse-asn1"), u = e("randombytes"), p = e("create-hash"), b = e("./mgf"), m = e("./xor"), g = e("bn.js"), s = e("./withPublic"), c = e("browserify-rsa");
t.exports = function(e, t, i) {
var r;
r = e.padding ? e.padding : i ? 1 : 4;
var n, o = a(e);
if (4 === r) n = function(e, t) {
var i = e.modulus.byteLength(), r = t.length, n = p("sha1").update(new d("")).digest(), o = n.length, a = 2 * o;
if (i - a - 2 < r) throw new Error("message too long");
var s = new d(i - r - a - 2);
s.fill(0);
var c = i - o - 1, f = u(o), h = m(d.concat([ n, s, new d([ 1 ]), t ], c), b(f, c)), l = m(f, b(h, o));
return new g(d.concat([ new d([ 0 ]), l, h ], i));
}(o, t); else if (1 === r) n = function(e, t, i) {
var r, n = t.length, o = e.modulus.byteLength();
if (o - 11 < n) throw new Error("message too long");
i ? (r = new d(o - n - 3)).fill(255) : r = function(e, t) {
var i, r = new d(e), n = 0, o = u(2 * e), a = 0;
for (;n < e; ) {
if (a === o.length) {
o = u(2 * e);
a = 0;
}
(i = o[a++]) && (r[n++] = i);
}
return r;
}(o - n - 3);
return new g(d.concat([ new d([ 0, i ? 1 : 2 ]), r, new d([ 0 ]), t ], o));
}(o, t, i); else {
if (3 !== r) throw new Error("unknown padding");
if (0 <= (n = new g(t)).cmp(o.modulus)) throw new Error("data too long for modulus");
}
return i ? c(n, o) : s(n, o);
};
}).call(this, e("buffer").Buffer);
}, {
"./mgf": 120,
"./withPublic": 123,
"./xor": 124,
"bn.js": 16,
"browserify-rsa": 39,
buffer: 47,
"create-hash": 52,
"parse-asn1": 111,
randombytes: 125
} ],
123: [ function(e, t, i) {
(function(i) {
var r = e("bn.js");
t.exports = function(e, t) {
return new i(e.toRed(r.mont(t.modulus)).redPow(new r(t.publicExponent)).fromRed().toArray());
};
}).call(this, e("buffer").Buffer);
}, {
"bn.js": 16,
buffer: 47
} ],
124: [ function(e, t, i) {
t.exports = function(e, t) {
for (var i = e.length, r = -1; ++r < i; ) e[r] ^= t[r];
return e;
};
}, {} ],
125: [ function(e, t, i) {
(function(n, o) {
"use strict";
var a = e("safe-buffer").Buffer, s = o.crypto || o.msCrypto;
s && s.getRandomValues ? t.exports = function(e, t) {
if (65536 < e) throw new Error("requested too many random bytes");
var i = new o.Uint8Array(e);
0 < e && s.getRandomValues(i);
var r = a.from(i.buffer);
if ("function" == typeof t) return n.nextTick(function() {
t(null, r);
});
return r;
} : t.exports = function() {
throw new Error("Secure random number generation is not supported by this browser.\nUse Chrome, Firefox or Internet Explorer 11");
};
}).call(this, e("_process"), "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {});
}, {
_process: 118,
"safe-buffer": 144
} ],
126: [ function(i, e, u) {
(function(a, n) {
"use strict";
function e() {
throw new Error("secure random number generation not supported by this browser\nuse chrome, FireFox or Internet Explorer 11");
}
var t = i("safe-buffer"), s = i("randombytes"), o = t.Buffer, r = t.kMaxLength, c = n.crypto || n.msCrypto, f = Math.pow(2, 32) - 1;
function h(e, t) {
if ("number" != typeof e || e != e) throw new TypeError("offset must be a number");
if (f < e || e < 0) throw new TypeError("offset must be a uint32");
if (r < e || t < e) throw new RangeError("offset out of range");
}
function l(e, t, i) {
if ("number" != typeof e || e != e) throw new TypeError("size must be a number");
if (f < e || e < 0) throw new TypeError("size must be a uint32");
if (i < e + t || r < e) throw new RangeError("buffer too small");
}
if (c && c.getRandomValues || !a.browser) {
u.randomFill = function(e, t, i, r) {
if (!(o.isBuffer(e) || e instanceof n.Uint8Array)) throw new TypeError('"buf" argument must be a Buffer or Uint8Array');
if ("function" == typeof t) {
r = t;
t = 0;
i = e.length;
} else if ("function" == typeof i) {
r = i;
i = e.length - t;
} else if ("function" != typeof r) throw new TypeError('"cb" argument must be a function');
h(t, e.length);
l(i, t, e.length);
return d(e, t, i, r);
};
u.randomFillSync = function(e, t, i) {
"undefined" == typeof t && (t = 0);
if (!(o.isBuffer(e) || e instanceof n.Uint8Array)) throw new TypeError('"buf" argument must be a Buffer or Uint8Array');
h(t, e.length);
void 0 === i && (i = e.length - t);
l(i, t, e.length);
return d(e, t, i);
};
} else {
u.randomFill = e;
u.randomFillSync = e;
}
function d(i, r, e, n) {
if (a.browser) {
var t = i.buffer, o = new Uint8Array(t, r, e);
c.getRandomValues(o);
if (n) {
a.nextTick(function() {
n(null, i);
});
return;
}
return i;
}
if (!n) {
s(e).copy(i, r);
return i;
}
s(e, function(e, t) {
if (e) return n(e);
t.copy(i, r);
n(null, i);
});
}
}).call(this, i("_process"), "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {});
}, {
_process: 118,
randombytes: 125,
"safe-buffer": 144
} ],
127: [ function(e, t, i) {
t.exports = e("./lib/_stream_duplex.js");
}, {
"./lib/_stream_duplex.js": 128
} ],
128: [ function(e, t, i) {
"use strict";
var r = e("process-nextick-args"), n = Object.keys || function(e) {
var t = [];
for (var i in e) t.push(i);
return t;
};
t.exports = l;
var o = e("core-util-is");
o.inherits = e("inherits");
var a = e("./_stream_readable"), s = e("./_stream_writable");
o.inherits(l, a);
for (var c = n(s.prototype), f = 0; f < c.length; f++) {
var h = c[f];
l.prototype[h] || (l.prototype[h] = s.prototype[h]);
}
function l(e) {
if (!(this instanceof l)) return new l(e);
a.call(this, e);
s.call(this, e);
e && !1 === e.readable && (this.readable = !1);
e && !1 === e.writable && (this.writable = !1);
this.allowHalfOpen = !0;
e && !1 === e.allowHalfOpen && (this.allowHalfOpen = !1);
this.once("end", d);
}
Object.defineProperty(l.prototype, "writableHighWaterMark", {
enumerable: !1,
get: function() {
return this._writableState.highWaterMark;
}
});
function d() {
this.allowHalfOpen || this._writableState.ended || r.nextTick(u, this);
}
function u(e) {
e.end();
}
Object.defineProperty(l.prototype, "destroyed", {
get: function() {
return void 0 !== this._readableState && void 0 !== this._writableState && (this._readableState.destroyed && this._writableState.destroyed);
},
set: function(e) {
if (void 0 !== this._readableState && void 0 !== this._writableState) {
this._readableState.destroyed = e;
this._writableState.destroyed = e;
}
}
});
l.prototype._destroy = function(e, t) {
this.push(null);
this.end();
r.nextTick(t, e);
};
}, {
"./_stream_readable": 130,
"./_stream_writable": 132,
"core-util-is": 50,
inherits: 101,
"process-nextick-args": 117
} ],
129: [ function(e, t, i) {
"use strict";
t.exports = o;
var r = e("./_stream_transform"), n = e("core-util-is");
n.inherits = e("inherits");
n.inherits(o, r);
function o(e) {
if (!(this instanceof o)) return new o(e);
r.call(this, e);
}
o.prototype._transform = function(e, t, i) {
i(null, e);
};
}, {
"./_stream_transform": 131,
"core-util-is": 50,
inherits: 101
} ],
130: [ function(R, N, e) {
(function(m, e) {
"use strict";
var g = R("process-nextick-args");
N.exports = d;
var a, y = R("isarray");
d.ReadableState = o;
R("events").EventEmitter;
var v = function(e, t) {
return e.listeners(t).length;
}, n = R("./internal/streams/stream"), f = R("safe-buffer").Buffer, h = e.Uint8Array || function() {};
var t = R("core-util-is");
t.inherits = R("inherits");
var i = R("util"), w = void 0;
w = i && i.debuglog ? i.debuglog("stream") : function() {};
var s, c = R("./internal/streams/BufferList"), r = R("./internal/streams/destroy");
t.inherits(d, n);
var l = [ "error", "close", "destroy", "pause", "resume" ];
function o(e, t) {
e = e || {};
var i = t instanceof (a = a || R("./_stream_duplex"));
this.objectMode = !!e.objectMode;
i && (this.objectMode = this.objectMode || !!e.readableObjectMode);
var r = e.highWaterMark, n = e.readableHighWaterMark, o = this.objectMode ? 16 : 16384;
this.highWaterMark = r || 0 === r ? r : i && (n || 0 === n) ? n : o;
this.highWaterMark = Math.floor(this.highWaterMark);
this.buffer = new c();
this.length = 0;
this.pipes = null;
this.pipesCount = 0;
this.flowing = null;
this.ended = !1;
this.endEmitted = !1;
this.reading = !1;
this.sync = !0;
this.needReadable = !1;
this.emittedReadable = !1;
this.readableListening = !1;
this.resumeScheduled = !1;
this.destroyed = !1;
this.defaultEncoding = e.defaultEncoding || "utf8";
this.awaitDrain = 0;
this.readingMore = !1;
this.decoder = null;
this.encoding = null;
if (e.encoding) {
s || (s = R("string_decoder/").StringDecoder);
this.decoder = new s(e.encoding);
this.encoding = e.encoding;
}
}
function d(e) {
a = a || R("./_stream_duplex");
if (!(this instanceof d)) return new d(e);
this._readableState = new o(e, this);
this.readable = !0;
if (e) {
"function" == typeof e.read && (this._read = e.read);
"function" == typeof e.destroy && (this._destroy = e.destroy);
}
n.call(this);
}
Object.defineProperty(d.prototype, "destroyed", {
get: function() {
return void 0 !== this._readableState && this._readableState.destroyed;
},
set: function(e) {
this._readableState && (this._readableState.destroyed = e);
}
});
d.prototype.destroy = r.destroy;
d.prototype._undestroy = r.undestroy;
d.prototype._destroy = function(e, t) {
this.push(null);
t(e);
};
d.prototype.push = function(e, t) {
var i, r = this._readableState;
if (r.objectMode) i = !0; else if ("string" == typeof e) {
if ((t = t || r.defaultEncoding) !== r.encoding) {
e = f.from(e, t);
t = "";
}
i = !0;
}
return u(this, e, t, !1, i);
};
d.prototype.unshift = function(e) {
return u(this, e, null, !0, !1);
};
function u(e, t, i, r, n) {
var o, a, s = e._readableState;
if (null === t) {
s.reading = !1;
(function(e, t) {
if (t.ended) return;
if (t.decoder) {
var i = t.decoder.end();
if (i && i.length) {
t.buffer.push(i);
t.length += t.objectMode ? 1 : i.length;
}
}
t.ended = !0;
_(e);
})(e, s);
} else {
var c;
n || (c = function(e, t) {
var i;
(r = t, f.isBuffer(r) || r instanceof h) || "string" == typeof t || void 0 === t || e.objectMode || (i = new TypeError("Invalid non-string/buffer chunk"));
var r;
return i;
}(s, t));
if (c) e.emit("error", c); else if (s.objectMode || t && 0 < t.length) {
"string" == typeof t || s.objectMode || Object.getPrototypeOf(t) === f.prototype || (t = (o = t, 
f.from(o)));
if (r) s.endEmitted ? e.emit("error", new Error("stream.unshift() after end event")) : p(e, s, t, !0); else if (s.ended) e.emit("error", new Error("stream.push() after EOF")); else {
s.reading = !1;
if (s.decoder && !i) {
t = s.decoder.write(t);
s.objectMode || 0 !== t.length ? p(e, s, t, !1) : x(e, s);
} else p(e, s, t, !1);
}
} else r || (s.reading = !1);
}
return !(a = s).ended && (a.needReadable || a.length < a.highWaterMark || 0 === a.length);
}
function p(e, t, i, r) {
if (t.flowing && 0 === t.length && !t.sync) {
e.emit("data", i);
e.read(0);
} else {
t.length += t.objectMode ? 1 : i.length;
r ? t.buffer.unshift(i) : t.buffer.push(i);
t.needReadable && _(e);
}
x(e, t);
}
d.prototype.isPaused = function() {
return !1 === this._readableState.flowing;
};
d.prototype.setEncoding = function(e) {
s || (s = R("string_decoder/").StringDecoder);
this._readableState.decoder = new s(e);
this._readableState.encoding = e;
return this;
};
var b = 8388608;
function S(e, t) {
if (e <= 0 || 0 === t.length && t.ended) return 0;
if (t.objectMode) return 1;
if (e != e) return t.flowing && t.length ? t.buffer.head.data.length : t.length;
e > t.highWaterMark && (t.highWaterMark = function(e) {
if (b <= e) e = b; else {
e--;
e |= e >>> 1;
e |= e >>> 2;
e |= e >>> 4;
e |= e >>> 8;
e |= e >>> 16;
e++;
}
return e;
}(e));
if (e <= t.length) return e;
if (!t.ended) {
t.needReadable = !0;
return 0;
}
return t.length;
}
d.prototype.read = function(e) {
w("read", e);
e = parseInt(e, 10);
var t = this._readableState, i = e;
0 !== e && (t.emittedReadable = !1);
if (0 === e && t.needReadable && (t.length >= t.highWaterMark || t.ended)) {
w("read: emitReadable", t.length, t.ended);
0 === t.length && t.ended ? E(this) : _(this);
return null;
}
if (0 === (e = S(e, t)) && t.ended) {
0 === t.length && E(this);
return null;
}
var r, n = t.needReadable;
w("need readable", n);
(0 === t.length || t.length - e < t.highWaterMark) && w("length less than watermark", n = !0);
if (t.ended || t.reading) w("reading or ended", n = !1); else if (n) {
w("do read");
t.reading = !0;
t.sync = !0;
0 === t.length && (t.needReadable = !0);
this._read(t.highWaterMark);
t.sync = !1;
t.reading || (e = S(i, t));
}
if (null === (r = 0 < e ? T(e, t) : null)) {
t.needReadable = !0;
e = 0;
} else t.length -= e;
if (0 === t.length) {
t.ended || (t.needReadable = !0);
i !== e && t.ended && E(this);
}
null !== r && this.emit("data", r);
return r;
};
function _(e) {
var t = e._readableState;
t.needReadable = !1;
if (!t.emittedReadable) {
w("emitReadable", t.flowing);
t.emittedReadable = !0;
t.sync ? g.nextTick(I, e) : I(e);
}
}
function I(e) {
w("emit readable");
e.emit("readable");
k(e);
}
function x(e, t) {
if (!t.readingMore) {
t.readingMore = !0;
g.nextTick(C, e, t);
}
}
function C(e, t) {
for (var i = t.length; !t.reading && !t.flowing && !t.ended && t.length < t.highWaterMark; ) {
w("maybeReadMore read 0");
e.read(0);
if (i === t.length) break;
i = t.length;
}
t.readingMore = !1;
}
d.prototype._read = function(e) {
this.emit("error", new Error("_read() is not implemented"));
};
d.prototype.pipe = function(i, e) {
var r = this, n = this._readableState;
switch (n.pipesCount) {
case 0:
n.pipes = i;
break;

case 1:
n.pipes = [ n.pipes, i ];
break;

default:
n.pipes.push(i);
}
n.pipesCount += 1;
w("pipe count=%d opts=%j", n.pipesCount, e);
var t = (!e || !1 !== e.end) && i !== m.stdout && i !== m.stderr ? a : b;
n.endEmitted ? g.nextTick(t) : r.once("end", t);
i.on("unpipe", o);
function o(e, t) {
w("onunpipe");
if (e === r && t && !1 === t.hasUnpiped) {
t.hasUnpiped = !0;
(function() {
w("cleanup");
i.removeListener("close", u);
i.removeListener("finish", p);
i.removeListener("drain", c);
i.removeListener("error", d);
i.removeListener("unpipe", o);
r.removeListener("end", a);
r.removeListener("end", b);
r.removeListener("data", l);
f = !0;
!n.awaitDrain || i._writableState && !i._writableState.needDrain || c();
})();
}
}
function a() {
w("onend");
i.end();
}
var s, c = (s = r, function() {
var e = s._readableState;
w("pipeOnDrain", e.awaitDrain);
e.awaitDrain && e.awaitDrain--;
if (0 === e.awaitDrain && v(s, "data")) {
e.flowing = !0;
k(s);
}
});
i.on("drain", c);
var f = !1;
var h = !1;
r.on("data", l);
function l(e) {
w("ondata");
if ((h = !1) === i.write(e) && !h) {
if ((1 === n.pipesCount && n.pipes === i || 1 < n.pipesCount && -1 !== D(n.pipes, i)) && !f) {
w("false write response, pause", r._readableState.awaitDrain);
r._readableState.awaitDrain++;
h = !0;
}
r.pause();
}
}
function d(e) {
w("onerror", e);
b();
i.removeListener("error", d);
0 === v(i, "error") && i.emit("error", e);
}
(function(e, t, i) {
if ("function" == typeof e.prependListener) return e.prependListener(t, i);
e._events && e._events[t] ? y(e._events[t]) ? e._events[t].unshift(i) : e._events[t] = [ i, e._events[t] ] : e.on(t, i);
})(i, "error", d);
function u() {
i.removeListener("finish", p);
b();
}
i.once("close", u);
function p() {
w("onfinish");
i.removeListener("close", u);
b();
}
i.once("finish", p);
function b() {
w("unpipe");
r.unpipe(i);
}
i.emit("pipe", r);
if (!n.flowing) {
w("pipe resume");
r.resume();
}
return i;
};
d.prototype.unpipe = function(e) {
var t = this._readableState, i = {
hasUnpiped: !1
};
if (0 === t.pipesCount) return this;
if (1 === t.pipesCount) {
if (e && e !== t.pipes) return this;
e || (e = t.pipes);
t.pipes = null;
t.pipesCount = 0;
t.flowing = !1;
e && e.emit("unpipe", this, i);
return this;
}
if (!e) {
var r = t.pipes, n = t.pipesCount;
t.pipes = null;
t.pipesCount = 0;
t.flowing = !1;
for (var o = 0; o < n; o++) r[o].emit("unpipe", this, i);
return this;
}
var a = D(t.pipes, e);
if (-1 === a) return this;
t.pipes.splice(a, 1);
t.pipesCount -= 1;
1 === t.pipesCount && (t.pipes = t.pipes[0]);
e.emit("unpipe", this, i);
return this;
};
d.prototype.addListener = d.prototype.on = function(e, t) {
var i = n.prototype.on.call(this, e, t);
if ("data" === e) !1 !== this._readableState.flowing && this.resume(); else if ("readable" === e) {
var r = this._readableState;
if (!r.endEmitted && !r.readableListening) {
r.readableListening = r.needReadable = !0;
r.emittedReadable = !1;
r.reading ? r.length && _(this) : g.nextTick(G, this);
}
}
return i;
};
function G(e) {
w("readable nexttick read 0");
e.read(0);
}
d.prototype.resume = function() {
var e = this._readableState;
if (!e.flowing) {
w("resume");
e.flowing = !0;
(function(e, t) {
if (!t.resumeScheduled) {
t.resumeScheduled = !0;
g.nextTick(A, e, t);
}
})(this, e);
}
return this;
};
function A(e, t) {
if (!t.reading) {
w("resume read 0");
e.read(0);
}
t.resumeScheduled = !1;
t.awaitDrain = 0;
e.emit("resume");
k(e);
t.flowing && !t.reading && e.read(0);
}
d.prototype.pause = function() {
w("call pause flowing=%j", this._readableState.flowing);
if (!1 !== this._readableState.flowing) {
w("pause");
this._readableState.flowing = !1;
this.emit("pause");
}
return this;
};
function k(e) {
var t = e._readableState;
w("flow", t.flowing);
for (;t.flowing && null !== e.read(); ) ;
}
d.prototype.wrap = function(t) {
var i = this, r = this._readableState, n = !1;
t.on("end", function() {
w("wrapped end");
if (r.decoder && !r.ended) {
var e = r.decoder.end();
e && e.length && i.push(e);
}
i.push(null);
});
t.on("data", function(e) {
w("wrapped data");
r.decoder && (e = r.decoder.write(e));
if ((!r.objectMode || null != e) && (r.objectMode || e && e.length)) {
if (!i.push(e)) {
n = !0;
t.pause();
}
}
});
for (var e in t) void 0 === this[e] && "function" == typeof t[e] && (this[e] = function(e) {
return function() {
return t[e].apply(t, arguments);
};
}(e));
for (var o = 0; o < l.length; o++) t.on(l[o], this.emit.bind(this, l[o]));
this._read = function(e) {
w("wrapped _read", e);
if (n) {
n = !1;
t.resume();
}
};
return this;
};
Object.defineProperty(d.prototype, "readableHighWaterMark", {
enumerable: !1,
get: function() {
return this._readableState.highWaterMark;
}
});
d._fromList = T;
function T(e, t) {
if (0 === t.length) return null;
var i;
if (t.objectMode) i = t.buffer.shift(); else if (!e || e >= t.length) {
i = t.decoder ? t.buffer.join("") : 1 === t.buffer.length ? t.buffer.head.data : t.buffer.concat(t.length);
t.buffer.clear();
} else i = function(e, t, i) {
var r;
if (e < t.head.data.length) {
r = t.head.data.slice(0, e);
t.head.data = t.head.data.slice(e);
} else r = e === t.head.data.length ? t.shift() : i ? function(e, t) {
var i = t.head, r = 1, n = i.data;
e -= n.length;
for (;i = i.next; ) {
var o = i.data, a = e > o.length ? o.length : e;
a === o.length ? n += o : n += o.slice(0, e);
if (0 === (e -= a)) {
if (a === o.length) {
++r;
i.next ? t.head = i.next : t.head = t.tail = null;
} else (t.head = i).data = o.slice(a);
break;
}
++r;
}
t.length -= r;
return n;
}(e, t) : function(e, t) {
var i = f.allocUnsafe(e), r = t.head, n = 1;
r.data.copy(i);
e -= r.data.length;
for (;r = r.next; ) {
var o = r.data, a = e > o.length ? o.length : e;
o.copy(i, i.length - e, 0, a);
if (0 === (e -= a)) {
if (a === o.length) {
++n;
r.next ? t.head = r.next : t.head = t.tail = null;
} else (t.head = r).data = o.slice(a);
break;
}
++n;
}
t.length -= n;
return i;
}(e, t);
return r;
}(e, t.buffer, t.decoder);
return i;
}
function E(e) {
var t = e._readableState;
if (0 < t.length) throw new Error('"endReadable()" called on non-empty stream');
if (!t.endEmitted) {
t.ended = !0;
g.nextTick(M, t, e);
}
}
function M(e, t) {
if (!e.endEmitted && 0 === e.length) {
e.endEmitted = !0;
t.readable = !1;
t.emit("end");
}
}
function D(e, t) {
for (var i = 0, r = e.length; i < r; i++) if (e[i] === t) return i;
return -1;
}
}).call(this, R("_process"), "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {});
}, {
"./_stream_duplex": 128,
"./internal/streams/BufferList": 133,
"./internal/streams/destroy": 134,
"./internal/streams/stream": 135,
_process: 118,
"core-util-is": 50,
events: 83,
inherits: 101,
isarray: 136,
"process-nextick-args": 117,
"safe-buffer": 144,
"string_decoder/": 137,
util: 18
} ],
131: [ function(e, t, i) {
"use strict";
t.exports = o;
var r = e("./_stream_duplex"), n = e("core-util-is");
n.inherits = e("inherits");
n.inherits(o, r);
function o(e) {
if (!(this instanceof o)) return new o(e);
r.call(this, e);
this._transformState = {
afterTransform: function(e, t) {
var i = this._transformState;
i.transforming = !1;
var r = i.writecb;
if (!r) return this.emit("error", new Error("write callback called multiple times"));
i.writechunk = null;
(i.writecb = null) != t && this.push(t);
r(e);
var n = this._readableState;
n.reading = !1;
(n.needReadable || n.length < n.highWaterMark) && this._read(n.highWaterMark);
}.bind(this),
needTransform: !1,
transforming: !1,
writecb: null,
writechunk: null,
writeencoding: null
};
this._readableState.needReadable = !0;
this._readableState.sync = !1;
if (e) {
"function" == typeof e.transform && (this._transform = e.transform);
"function" == typeof e.flush && (this._flush = e.flush);
}
this.on("prefinish", a);
}
function a() {
var i = this;
"function" == typeof this._flush ? this._flush(function(e, t) {
s(i, e, t);
}) : s(this, null, null);
}
o.prototype.push = function(e, t) {
this._transformState.needTransform = !1;
return r.prototype.push.call(this, e, t);
};
o.prototype._transform = function(e, t, i) {
throw new Error("_transform() is not implemented");
};
o.prototype._write = function(e, t, i) {
var r = this._transformState;
r.writecb = i;
r.writechunk = e;
r.writeencoding = t;
if (!r.transforming) {
var n = this._readableState;
(r.needTransform || n.needReadable || n.length < n.highWaterMark) && this._read(n.highWaterMark);
}
};
o.prototype._read = function(e) {
var t = this._transformState;
if (null !== t.writechunk && t.writecb && !t.transforming) {
t.transforming = !0;
this._transform(t.writechunk, t.writeencoding, t.afterTransform);
} else t.needTransform = !0;
};
o.prototype._destroy = function(e, t) {
var i = this;
r.prototype._destroy.call(this, e, function(e) {
t(e);
i.emit("close");
});
};
function s(e, t, i) {
if (t) return e.emit("error", t);
null != i && e.push(i);
if (e._writableState.length) throw new Error("Calling transform done when ws.length != 0");
if (e._transformState.transforming) throw new Error("Calling transform done when still transforming");
return e.push(null);
}
}, {
"./_stream_duplex": 128,
"core-util-is": 50,
inherits: 101
} ],
132: [ function(_, I, e) {
(function(e, t) {
"use strict";
var c = _("process-nextick-args");
I.exports = b;
function l(e) {
var t = this;
this.next = null;
this.entry = null;
this.finish = function() {
(function(e, t, i) {
var r = e.entry;
e.entry = null;
for (;r; ) {
var n = r.callback;
t.pendingcb--;
n(i);
r = r.next;
}
t.corkedRequestsFree ? t.corkedRequestsFree.next = e : t.corkedRequestsFree = e;
})(t, e);
};
}
var s, f = !e.browser && -1 < [ "v0.10", "v0.9." ].indexOf(e.version.slice(0, 5)) ? setImmediate : c.nextTick;
b.WritableState = p;
var i = _("core-util-is");
i.inherits = _("inherits");
var r = {
deprecate: _("util-deprecate")
}, n = _("./internal/streams/stream"), h = _("safe-buffer").Buffer, d = t.Uint8Array || function() {};
var o, a = _("./internal/streams/destroy");
i.inherits(b, n);
function u() {}
function p(e, t) {
s = s || _("./_stream_duplex");
e = e || {};
var i = t instanceof s;
this.objectMode = !!e.objectMode;
i && (this.objectMode = this.objectMode || !!e.writableObjectMode);
var r = e.highWaterMark, n = e.writableHighWaterMark, o = this.objectMode ? 16 : 16384;
this.highWaterMark = r || 0 === r ? r : i && (n || 0 === n) ? n : o;
this.highWaterMark = Math.floor(this.highWaterMark);
this.finalCalled = !1;
this.needDrain = !1;
this.ending = !1;
this.ended = !1;
this.finished = !1;
var a = (this.destroyed = !1) === e.decodeStrings;
this.decodeStrings = !a;
this.defaultEncoding = e.defaultEncoding || "utf8";
this.length = 0;
this.writing = !1;
this.corked = 0;
this.sync = !0;
this.bufferProcessing = !1;
this.onwrite = function(e) {
(function(e, t) {
var i = e._writableState, r = i.sync, n = i.writecb;
(function(e) {
e.writing = !1;
e.writecb = null;
e.length -= e.writelen;
e.writelen = 0;
})(i);
if (t) (function(e, t, i, r, n) {
--t.pendingcb;
if (i) {
c.nextTick(n, r);
c.nextTick(S, e, t);
e._writableState.errorEmitted = !0;
e.emit("error", r);
} else {
n(r);
e._writableState.errorEmitted = !0;
e.emit("error", r);
S(e, t);
}
})(e, i, r, t, n); else {
var o = v(i);
o || i.corked || i.bufferProcessing || !i.bufferedRequest || y(e, i);
r ? f(g, e, i, o, n) : g(e, i, o, n);
}
})(t, e);
};
this.writecb = null;
this.writelen = 0;
this.bufferedRequest = null;
this.lastBufferedRequest = null;
this.pendingcb = 0;
this.prefinished = !1;
this.errorEmitted = !1;
this.bufferedRequestCount = 0;
this.corkedRequestsFree = new l(this);
}
p.prototype.getBuffer = function() {
for (var e = this.bufferedRequest, t = []; e; ) {
t.push(e);
e = e.next;
}
return t;
};
(function() {
try {
Object.defineProperty(p.prototype, "buffer", {
get: r.deprecate(function() {
return this.getBuffer();
}, "_writableState.buffer is deprecated. Use _writableState.getBuffer instead.", "DEP0003")
});
} catch (e) {}
})();
if ("function" == typeof Symbol && Symbol.hasInstance && "function" == typeof Function.prototype[Symbol.hasInstance]) {
o = Function.prototype[Symbol.hasInstance];
Object.defineProperty(b, Symbol.hasInstance, {
value: function(e) {
return !!o.call(this, e) || this === b && (e && e._writableState instanceof p);
}
});
} else o = function(e) {
return e instanceof this;
};
function b(e) {
s = s || _("./_stream_duplex");
if (!(o.call(b, this) || this instanceof s)) return new b(e);
this._writableState = new p(e, this);
this.writable = !0;
if (e) {
"function" == typeof e.write && (this._write = e.write);
"function" == typeof e.writev && (this._writev = e.writev);
"function" == typeof e.destroy && (this._destroy = e.destroy);
"function" == typeof e.final && (this._final = e.final);
}
n.call(this);
}
b.prototype.pipe = function() {
this.emit("error", new Error("Cannot pipe, not readable"));
};
b.prototype.write = function(e, t, i) {
var r, n, o = this._writableState, a = !1, s = !o.objectMode && (r = e, h.isBuffer(r) || r instanceof d);
s && !h.isBuffer(e) && (e = (n = e, h.from(n)));
if ("function" == typeof t) {
i = t;
t = null;
}
s ? t = "buffer" : t || (t = o.defaultEncoding);
"function" != typeof i && (i = u);
if (o.ended) (function(e, t) {
var i = new Error("write after end");
e.emit("error", i);
c.nextTick(t, i);
})(this, i); else if (s || function(e, t, i, r) {
var n = !0, o = !1;
null === i ? o = new TypeError("May not write null values to stream") : "string" == typeof i || void 0 === i || t.objectMode || (o = new TypeError("Invalid non-string/buffer chunk"));
if (o) {
e.emit("error", o);
c.nextTick(r, o);
n = !1;
}
return n;
}(this, o, e, i)) {
o.pendingcb++;
a = function(e, t, i, r, n, o) {
if (!i) {
var a = function(e, t, i) {
e.objectMode || !1 === e.decodeStrings || "string" != typeof t || (t = h.from(t, i));
return t;
}(t, r, n);
if (r !== a) {
i = !0;
n = "buffer";
r = a;
}
}
var s = t.objectMode ? 1 : r.length;
t.length += s;
var c = t.length < t.highWaterMark;
c || (t.needDrain = !0);
if (t.writing || t.corked) {
var f = t.lastBufferedRequest;
t.lastBufferedRequest = {
chunk: r,
encoding: n,
isBuf: i,
callback: o,
next: null
};
f ? f.next = t.lastBufferedRequest : t.bufferedRequest = t.lastBufferedRequest;
t.bufferedRequestCount += 1;
} else m(e, t, !1, s, r, n, o);
return c;
}(this, o, s, e, t, i);
}
return a;
};
b.prototype.cork = function() {
this._writableState.corked++;
};
b.prototype.uncork = function() {
var e = this._writableState;
if (e.corked) {
e.corked--;
e.writing || e.corked || e.finished || e.bufferProcessing || !e.bufferedRequest || y(this, e);
}
};
b.prototype.setDefaultEncoding = function(e) {
"string" == typeof e && (e = e.toLowerCase());
if (!(-1 < [ "hex", "utf8", "utf-8", "ascii", "binary", "base64", "ucs2", "ucs-2", "utf16le", "utf-16le", "raw" ].indexOf((e + "").toLowerCase()))) throw new TypeError("Unknown encoding: " + e);
this._writableState.defaultEncoding = e;
return this;
};
Object.defineProperty(b.prototype, "writableHighWaterMark", {
enumerable: !1,
get: function() {
return this._writableState.highWaterMark;
}
});
function m(e, t, i, r, n, o, a) {
t.writelen = r;
t.writecb = a;
t.writing = !0;
t.sync = !0;
i ? e._writev(n, t.onwrite) : e._write(n, o, t.onwrite);
t.sync = !1;
}
function g(e, t, i, r) {
i || function(e, t) {
if (0 === t.length && t.needDrain) {
t.needDrain = !1;
e.emit("drain");
}
}(e, t);
t.pendingcb--;
r();
S(e, t);
}
function y(e, t) {
t.bufferProcessing = !0;
var i = t.bufferedRequest;
if (e._writev && i && i.next) {
var r = t.bufferedRequestCount, n = new Array(r), o = t.corkedRequestsFree;
o.entry = i;
for (var a = 0, s = !0; i; ) {
(n[a] = i).isBuf || (s = !1);
i = i.next;
a += 1;
}
n.allBuffers = s;
m(e, t, !0, t.length, n, "", o.finish);
t.pendingcb++;
t.lastBufferedRequest = null;
if (o.next) {
t.corkedRequestsFree = o.next;
o.next = null;
} else t.corkedRequestsFree = new l(t);
t.bufferedRequestCount = 0;
} else {
for (;i; ) {
var c = i.chunk, f = i.encoding, h = i.callback;
m(e, t, !1, t.objectMode ? 1 : c.length, c, f, h);
i = i.next;
t.bufferedRequestCount--;
if (t.writing) break;
}
null === i && (t.lastBufferedRequest = null);
}
t.bufferedRequest = i;
t.bufferProcessing = !1;
}
b.prototype._write = function(e, t, i) {
i(new Error("_write() is not implemented"));
};
b.prototype._writev = null;
b.prototype.end = function(e, t, i) {
var r = this._writableState;
if ("function" == typeof e) {
i = e;
t = e = null;
} else if ("function" == typeof t) {
i = t;
t = null;
}
null != e && this.write(e, t);
if (r.corked) {
r.corked = 1;
this.uncork();
}
r.ending || r.finished || function(e, t, i) {
t.ending = !0;
S(e, t);
i && (t.finished ? c.nextTick(i) : e.once("finish", i));
t.ended = !0;
e.writable = !1;
}(this, r, i);
};
function v(e) {
return e.ending && 0 === e.length && null === e.bufferedRequest && !e.finished && !e.writing;
}
function w(t, i) {
t._final(function(e) {
i.pendingcb--;
e && t.emit("error", e);
i.prefinished = !0;
t.emit("prefinish");
S(t, i);
});
}
function S(e, t) {
var i = v(t);
if (i) {
(function(e, t) {
if (!t.prefinished && !t.finalCalled) if ("function" == typeof e._final) {
t.pendingcb++;
t.finalCalled = !0;
c.nextTick(w, e, t);
} else {
t.prefinished = !0;
e.emit("prefinish");
}
})(e, t);
if (0 === t.pendingcb) {
t.finished = !0;
e.emit("finish");
}
}
return i;
}
Object.defineProperty(b.prototype, "destroyed", {
get: function() {
return void 0 !== this._writableState && this._writableState.destroyed;
},
set: function(e) {
this._writableState && (this._writableState.destroyed = e);
}
});
b.prototype.destroy = a.destroy;
b.prototype._undestroy = a.undestroy;
b.prototype._destroy = function(e, t) {
this.end();
t(e);
};
}).call(this, _("_process"), "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {});
}, {
"./_stream_duplex": 128,
"./internal/streams/destroy": 134,
"./internal/streams/stream": 135,
_process: 118,
"core-util-is": 50,
inherits: 101,
"process-nextick-args": 117,
"safe-buffer": 144,
"util-deprecate": 155
} ],
133: [ function(e, t, i) {
"use strict";
var s = e("safe-buffer").Buffer, r = e("util");
t.exports = function() {
function e() {
(function(e, t) {
if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
})(this, e);
this.head = null;
this.tail = null;
this.length = 0;
}
e.prototype.push = function(e) {
var t = {
data: e,
next: null
};
0 < this.length ? this.tail.next = t : this.head = t;
this.tail = t;
++this.length;
};
e.prototype.unshift = function(e) {
var t = {
data: e,
next: this.head
};
0 === this.length && (this.tail = t);
this.head = t;
++this.length;
};
e.prototype.shift = function() {
if (0 !== this.length) {
var e = this.head.data;
1 === this.length ? this.head = this.tail = null : this.head = this.head.next;
--this.length;
return e;
}
};
e.prototype.clear = function() {
this.head = this.tail = null;
this.length = 0;
};
e.prototype.join = function(e) {
if (0 === this.length) return "";
for (var t = this.head, i = "" + t.data; t = t.next; ) i += e + t.data;
return i;
};
e.prototype.concat = function(e) {
if (0 === this.length) return s.alloc(0);
if (1 === this.length) return this.head.data;
for (var t, i, r, n = s.allocUnsafe(e >>> 0), o = this.head, a = 0; o; ) {
t = o.data, i = n, r = a, t.copy(i, r);
a += o.data.length;
o = o.next;
}
return n;
};
return e;
}();
r && r.inspect && r.inspect.custom && (t.exports.prototype[r.inspect.custom] = function() {
var e = r.inspect({
length: this.length
});
return this.constructor.name + " " + e;
});
}, {
"safe-buffer": 144,
util: 18
} ],
134: [ function(e, t, i) {
"use strict";
var o = e("process-nextick-args");
function a(e, t) {
e.emit("error", t);
}
t.exports = {
destroy: function(e, t) {
var i = this, r = this._readableState && this._readableState.destroyed, n = this._writableState && this._writableState.destroyed;
if (r || n) {
t ? t(e) : !e || this._writableState && this._writableState.errorEmitted || o.nextTick(a, this, e);
return this;
}
this._readableState && (this._readableState.destroyed = !0);
this._writableState && (this._writableState.destroyed = !0);
this._destroy(e || null, function(e) {
if (!t && e) {
o.nextTick(a, i, e);
i._writableState && (i._writableState.errorEmitted = !0);
} else t && t(e);
});
return this;
},
undestroy: function() {
if (this._readableState) {
this._readableState.destroyed = !1;
this._readableState.reading = !1;
this._readableState.ended = !1;
this._readableState.endEmitted = !1;
}
if (this._writableState) {
this._writableState.destroyed = !1;
this._writableState.ended = !1;
this._writableState.ending = !1;
this._writableState.finished = !1;
this._writableState.errorEmitted = !1;
}
}
};
}, {
"process-nextick-args": 117
} ],
135: [ function(e, t, i) {
t.exports = e("events").EventEmitter;
}, {
events: 83
} ],
136: [ function(e, t, i) {
arguments[4][48][0].apply(i, arguments);
}, {
dup: 48
} ],
137: [ function(e, t, i) {
"use strict";
var r = e("safe-buffer").Buffer, n = r.isEncoding || function(e) {
switch ((e = "" + e) && e.toLowerCase()) {
case "hex":
case "utf8":
case "utf-8":
case "ascii":
case "binary":
case "base64":
case "ucs2":
case "ucs-2":
case "utf16le":
case "utf-16le":
case "raw":
return !0;

default:
return !1;
}
};
function o(e) {
this.encoding = function(e) {
var t = function(e) {
if (!e) return "utf8";
for (var t; ;) switch (e) {
case "utf8":
case "utf-8":
return "utf8";

case "ucs2":
case "ucs-2":
case "utf16le":
case "utf-16le":
return "utf16le";

case "latin1":
case "binary":
return "latin1";

case "base64":
case "ascii":
case "hex":
return e;

default:
if (t) return;
e = ("" + e).toLowerCase();
t = !0;
}
}(e);
if ("string" != typeof t && (r.isEncoding === n || !n(e))) throw new Error("Unknown encoding: " + e);
return t || e;
}(e);
var t;
switch (this.encoding) {
case "utf16le":
this.text = c;
this.end = f;
t = 4;
break;

case "utf8":
this.fillLast = s;
t = 4;
break;

case "base64":
this.text = h;
this.end = l;
t = 3;
break;

default:
this.write = d;
this.end = u;
return;
}
this.lastNeed = 0;
this.lastTotal = 0;
this.lastChar = r.allocUnsafe(t);
}
(i.StringDecoder = o).prototype.write = function(e) {
if (0 === e.length) return "";
var t, i;
if (this.lastNeed) {
if (void 0 === (t = this.fillLast(e))) return "";
i = this.lastNeed;
this.lastNeed = 0;
} else i = 0;
return i < e.length ? t ? t + this.text(e, i) : this.text(e, i) : t || "";
};
o.prototype.end = function(e) {
var t = e && e.length ? this.write(e) : "";
return this.lastNeed ? t + "�" : t;
};
o.prototype.text = function(e, t) {
var i = function(e, t, i) {
var r = t.length - 1;
if (r < i) return 0;
var n = a(t[r]);
if (0 <= n) {
0 < n && (e.lastNeed = n - 1);
return n;
}
if (--r < i || -2 === n) return 0;
if (0 <= (n = a(t[r]))) {
0 < n && (e.lastNeed = n - 2);
return n;
}
if (--r < i || -2 === n) return 0;
if (0 <= (n = a(t[r]))) {
0 < n && (2 === n ? n = 0 : e.lastNeed = n - 3);
return n;
}
return 0;
}(this, e, t);
if (!this.lastNeed) return e.toString("utf8", t);
this.lastTotal = i;
var r = e.length - (i - this.lastNeed);
e.copy(this.lastChar, 0, r);
return e.toString("utf8", t, r);
};
o.prototype.fillLast = function(e) {
if (this.lastNeed <= e.length) {
e.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, this.lastNeed);
return this.lastChar.toString(this.encoding, 0, this.lastTotal);
}
e.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, e.length);
this.lastNeed -= e.length;
};
function a(e) {
return e <= 127 ? 0 : e >> 5 == 6 ? 2 : e >> 4 == 14 ? 3 : e >> 3 == 30 ? 4 : e >> 6 == 2 ? -1 : -2;
}
function s(e) {
var t = this.lastTotal - this.lastNeed, i = function(e, t, i) {
if (128 != (192 & t[0])) {
e.lastNeed = 0;
return "�";
}
if (1 < e.lastNeed && 1 < t.length) {
if (128 != (192 & t[1])) {
e.lastNeed = 1;
return "�";
}
if (2 < e.lastNeed && 2 < t.length && 128 != (192 & t[2])) {
e.lastNeed = 2;
return "�";
}
}
}(this, e);
if (void 0 !== i) return i;
if (this.lastNeed <= e.length) {
e.copy(this.lastChar, t, 0, this.lastNeed);
return this.lastChar.toString(this.encoding, 0, this.lastTotal);
}
e.copy(this.lastChar, t, 0, e.length);
this.lastNeed -= e.length;
}
function c(e, t) {
if ((e.length - t) % 2 == 0) {
var i = e.toString("utf16le", t);
if (i) {
var r = i.charCodeAt(i.length - 1);
if (55296 <= r && r <= 56319) {
this.lastNeed = 2;
this.lastTotal = 4;
this.lastChar[0] = e[e.length - 2];
this.lastChar[1] = e[e.length - 1];
return i.slice(0, -1);
}
}
return i;
}
this.lastNeed = 1;
this.lastTotal = 2;
this.lastChar[0] = e[e.length - 1];
return e.toString("utf16le", t, e.length - 1);
}
function f(e) {
var t = e && e.length ? this.write(e) : "";
if (this.lastNeed) {
var i = this.lastTotal - this.lastNeed;
return t + this.lastChar.toString("utf16le", 0, i);
}
return t;
}
function h(e, t) {
var i = (e.length - t) % 3;
if (0 === i) return e.toString("base64", t);
this.lastNeed = 3 - i;
this.lastTotal = 3;
if (1 === i) this.lastChar[0] = e[e.length - 1]; else {
this.lastChar[0] = e[e.length - 2];
this.lastChar[1] = e[e.length - 1];
}
return e.toString("base64", t, e.length - i);
}
function l(e) {
var t = e && e.length ? this.write(e) : "";
return this.lastNeed ? t + this.lastChar.toString("base64", 0, 3 - this.lastNeed) : t;
}
function d(e) {
return e.toString(this.encoding);
}
function u(e) {
return e && e.length ? this.write(e) : "";
}
}, {
"safe-buffer": 144
} ],
138: [ function(e, t, i) {
t.exports = e("./readable").PassThrough;
}, {
"./readable": 139
} ],
139: [ function(e, t, i) {
(((i = t.exports = e("./lib/_stream_readable.js")).Stream = i).Readable = i).Writable = e("./lib/_stream_writable.js");
i.Duplex = e("./lib/_stream_duplex.js");
i.Transform = e("./lib/_stream_transform.js");
i.PassThrough = e("./lib/_stream_passthrough.js");
}, {
"./lib/_stream_duplex.js": 128,
"./lib/_stream_passthrough.js": 129,
"./lib/_stream_readable.js": 130,
"./lib/_stream_transform.js": 131,
"./lib/_stream_writable.js": 132
} ],
140: [ function(e, t, i) {
t.exports = e("./readable").Transform;
}, {
"./readable": 139
} ],
141: [ function(e, t, i) {
t.exports = e("./lib/_stream_writable.js");
}, {
"./lib/_stream_writable.js": 132
} ],
142: [ function(n, o, e) {
(function(t) {
"use strict";
var e = n("inherits"), i = n("hash-base");
function r() {
i.call(this, 64);
this._a = 1732584193;
this._b = 4023233417;
this._c = 2562383102;
this._d = 271733878;
this._e = 3285377520;
}
e(r, i);
r.prototype._update = function() {
for (var e = new Array(16), t = 0; t < 16; ++t) e[t] = this._block.readInt32LE(4 * t);
var i = this._a, r = this._b, n = this._c, o = this._d, a = this._e;
a = p(a, i = p(i, r, n, o, a, e[0], 0, 11), r, n = u(n, 10), o, e[1], 0, 14);
r = p(r = u(r, 10), n = p(n, o = p(o, a, i, r, n, e[2], 0, 15), a, i = u(i, 10), r, e[3], 0, 12), o, a = u(a, 10), i, e[4], 0, 5);
o = p(o = u(o, 10), a = p(a, i = p(i, r, n, o, a, e[5], 0, 8), r, n = u(n, 10), o, e[6], 0, 7), i, r = u(r, 10), n, e[7], 0, 9);
i = p(i = u(i, 10), r = p(r, n = p(n, o, a, i, r, e[8], 0, 11), o, a = u(a, 10), i, e[9], 0, 13), n, o = u(o, 10), a, e[10], 0, 14);
n = p(n = u(n, 10), o = p(o, a = p(a, i, r, n, o, e[11], 0, 15), i, r = u(r, 10), n, e[12], 0, 6), a, i = u(i, 10), r, e[13], 0, 7);
a = b(a = u(a, 10), i = p(i, r = p(r, n, o, a, i, e[14], 0, 9), n, o = u(o, 10), a, e[15], 0, 8), r, n = u(n, 10), o, e[7], 1518500249, 7);
r = b(r = u(r, 10), n = b(n, o = b(o, a, i, r, n, e[4], 1518500249, 6), a, i = u(i, 10), r, e[13], 1518500249, 8), o, a = u(a, 10), i, e[1], 1518500249, 13);
o = b(o = u(o, 10), a = b(a, i = b(i, r, n, o, a, e[10], 1518500249, 11), r, n = u(n, 10), o, e[6], 1518500249, 9), i, r = u(r, 10), n, e[15], 1518500249, 7);
i = b(i = u(i, 10), r = b(r, n = b(n, o, a, i, r, e[3], 1518500249, 15), o, a = u(a, 10), i, e[12], 1518500249, 7), n, o = u(o, 10), a, e[0], 1518500249, 12);
n = b(n = u(n, 10), o = b(o, a = b(a, i, r, n, o, e[9], 1518500249, 15), i, r = u(r, 10), n, e[5], 1518500249, 9), a, i = u(i, 10), r, e[2], 1518500249, 11);
a = b(a = u(a, 10), i = b(i, r = b(r, n, o, a, i, e[14], 1518500249, 7), n, o = u(o, 10), a, e[11], 1518500249, 13), r, n = u(n, 10), o, e[8], 1518500249, 12);
r = m(r = u(r, 10), n = m(n, o = m(o, a, i, r, n, e[3], 1859775393, 11), a, i = u(i, 10), r, e[10], 1859775393, 13), o, a = u(a, 10), i, e[14], 1859775393, 6);
o = m(o = u(o, 10), a = m(a, i = m(i, r, n, o, a, e[4], 1859775393, 7), r, n = u(n, 10), o, e[9], 1859775393, 14), i, r = u(r, 10), n, e[15], 1859775393, 9);
i = m(i = u(i, 10), r = m(r, n = m(n, o, a, i, r, e[8], 1859775393, 13), o, a = u(a, 10), i, e[1], 1859775393, 15), n, o = u(o, 10), a, e[2], 1859775393, 14);
n = m(n = u(n, 10), o = m(o, a = m(a, i, r, n, o, e[7], 1859775393, 8), i, r = u(r, 10), n, e[0], 1859775393, 13), a, i = u(i, 10), r, e[6], 1859775393, 6);
a = m(a = u(a, 10), i = m(i, r = m(r, n, o, a, i, e[13], 1859775393, 5), n, o = u(o, 10), a, e[11], 1859775393, 12), r, n = u(n, 10), o, e[5], 1859775393, 7);
r = g(r = u(r, 10), n = g(n, o = m(o, a, i, r, n, e[12], 1859775393, 5), a, i = u(i, 10), r, e[1], 2400959708, 11), o, a = u(a, 10), i, e[9], 2400959708, 12);
o = g(o = u(o, 10), a = g(a, i = g(i, r, n, o, a, e[11], 2400959708, 14), r, n = u(n, 10), o, e[10], 2400959708, 15), i, r = u(r, 10), n, e[0], 2400959708, 14);
i = g(i = u(i, 10), r = g(r, n = g(n, o, a, i, r, e[8], 2400959708, 15), o, a = u(a, 10), i, e[12], 2400959708, 9), n, o = u(o, 10), a, e[4], 2400959708, 8);
n = g(n = u(n, 10), o = g(o, a = g(a, i, r, n, o, e[13], 2400959708, 9), i, r = u(r, 10), n, e[3], 2400959708, 14), a, i = u(i, 10), r, e[7], 2400959708, 5);
a = g(a = u(a, 10), i = g(i, r = g(r, n, o, a, i, e[15], 2400959708, 6), n, o = u(o, 10), a, e[14], 2400959708, 8), r, n = u(n, 10), o, e[5], 2400959708, 6);
r = y(r = u(r, 10), n = g(n, o = g(o, a, i, r, n, e[6], 2400959708, 5), a, i = u(i, 10), r, e[2], 2400959708, 12), o, a = u(a, 10), i, e[4], 2840853838, 9);
o = y(o = u(o, 10), a = y(a, i = y(i, r, n, o, a, e[0], 2840853838, 15), r, n = u(n, 10), o, e[5], 2840853838, 5), i, r = u(r, 10), n, e[9], 2840853838, 11);
i = y(i = u(i, 10), r = y(r, n = y(n, o, a, i, r, e[7], 2840853838, 6), o, a = u(a, 10), i, e[12], 2840853838, 8), n, o = u(o, 10), a, e[2], 2840853838, 13);
n = y(n = u(n, 10), o = y(o, a = y(a, i, r, n, o, e[10], 2840853838, 12), i, r = u(r, 10), n, e[14], 2840853838, 5), a, i = u(i, 10), r, e[1], 2840853838, 12);
a = y(a = u(a, 10), i = y(i, r = y(r, n, o, a, i, e[3], 2840853838, 13), n, o = u(o, 10), a, e[8], 2840853838, 14), r, n = u(n, 10), o, e[11], 2840853838, 11);
r = y(r = u(r, 10), n = y(n, o = y(o, a, i, r, n, e[6], 2840853838, 8), a, i = u(i, 10), r, e[15], 2840853838, 5), o, a = u(a, 10), i, e[13], 2840853838, 6);
o = u(o, 10);
var s = this._a, c = this._b, f = this._c, h = this._d, l = this._e;
l = y(l, s = y(s, c, f, h, l, e[5], 1352829926, 8), c, f = u(f, 10), h, e[14], 1352829926, 9);
c = y(c = u(c, 10), f = y(f, h = y(h, l, s, c, f, e[7], 1352829926, 9), l, s = u(s, 10), c, e[0], 1352829926, 11), h, l = u(l, 10), s, e[9], 1352829926, 13);
h = y(h = u(h, 10), l = y(l, s = y(s, c, f, h, l, e[2], 1352829926, 15), c, f = u(f, 10), h, e[11], 1352829926, 15), s, c = u(c, 10), f, e[4], 1352829926, 5);
s = y(s = u(s, 10), c = y(c, f = y(f, h, l, s, c, e[13], 1352829926, 7), h, l = u(l, 10), s, e[6], 1352829926, 7), f, h = u(h, 10), l, e[15], 1352829926, 8);
f = y(f = u(f, 10), h = y(h, l = y(l, s, c, f, h, e[8], 1352829926, 11), s, c = u(c, 10), f, e[1], 1352829926, 14), l, s = u(s, 10), c, e[10], 1352829926, 14);
l = g(l = u(l, 10), s = y(s, c = y(c, f, h, l, s, e[3], 1352829926, 12), f, h = u(h, 10), l, e[12], 1352829926, 6), c, f = u(f, 10), h, e[6], 1548603684, 9);
c = g(c = u(c, 10), f = g(f, h = g(h, l, s, c, f, e[11], 1548603684, 13), l, s = u(s, 10), c, e[3], 1548603684, 15), h, l = u(l, 10), s, e[7], 1548603684, 7);
h = g(h = u(h, 10), l = g(l, s = g(s, c, f, h, l, e[0], 1548603684, 12), c, f = u(f, 10), h, e[13], 1548603684, 8), s, c = u(c, 10), f, e[5], 1548603684, 9);
s = g(s = u(s, 10), c = g(c, f = g(f, h, l, s, c, e[10], 1548603684, 11), h, l = u(l, 10), s, e[14], 1548603684, 7), f, h = u(h, 10), l, e[15], 1548603684, 7);
f = g(f = u(f, 10), h = g(h, l = g(l, s, c, f, h, e[8], 1548603684, 12), s, c = u(c, 10), f, e[12], 1548603684, 7), l, s = u(s, 10), c, e[4], 1548603684, 6);
l = g(l = u(l, 10), s = g(s, c = g(c, f, h, l, s, e[9], 1548603684, 15), f, h = u(h, 10), l, e[1], 1548603684, 13), c, f = u(f, 10), h, e[2], 1548603684, 11);
c = m(c = u(c, 10), f = m(f, h = m(h, l, s, c, f, e[15], 1836072691, 9), l, s = u(s, 10), c, e[5], 1836072691, 7), h, l = u(l, 10), s, e[1], 1836072691, 15);
h = m(h = u(h, 10), l = m(l, s = m(s, c, f, h, l, e[3], 1836072691, 11), c, f = u(f, 10), h, e[7], 1836072691, 8), s, c = u(c, 10), f, e[14], 1836072691, 6);
s = m(s = u(s, 10), c = m(c, f = m(f, h, l, s, c, e[6], 1836072691, 6), h, l = u(l, 10), s, e[9], 1836072691, 14), f, h = u(h, 10), l, e[11], 1836072691, 12);
f = m(f = u(f, 10), h = m(h, l = m(l, s, c, f, h, e[8], 1836072691, 13), s, c = u(c, 10), f, e[12], 1836072691, 5), l, s = u(s, 10), c, e[2], 1836072691, 14);
l = m(l = u(l, 10), s = m(s, c = m(c, f, h, l, s, e[10], 1836072691, 13), f, h = u(h, 10), l, e[0], 1836072691, 13), c, f = u(f, 10), h, e[4], 1836072691, 7);
c = b(c = u(c, 10), f = b(f, h = m(h, l, s, c, f, e[13], 1836072691, 5), l, s = u(s, 10), c, e[8], 2053994217, 15), h, l = u(l, 10), s, e[6], 2053994217, 5);
h = b(h = u(h, 10), l = b(l, s = b(s, c, f, h, l, e[4], 2053994217, 8), c, f = u(f, 10), h, e[1], 2053994217, 11), s, c = u(c, 10), f, e[3], 2053994217, 14);
s = b(s = u(s, 10), c = b(c, f = b(f, h, l, s, c, e[11], 2053994217, 14), h, l = u(l, 10), s, e[15], 2053994217, 6), f, h = u(h, 10), l, e[0], 2053994217, 14);
f = b(f = u(f, 10), h = b(h, l = b(l, s, c, f, h, e[5], 2053994217, 6), s, c = u(c, 10), f, e[12], 2053994217, 9), l, s = u(s, 10), c, e[2], 2053994217, 12);
l = b(l = u(l, 10), s = b(s, c = b(c, f, h, l, s, e[13], 2053994217, 9), f, h = u(h, 10), l, e[9], 2053994217, 12), c, f = u(f, 10), h, e[7], 2053994217, 5);
c = p(c = u(c, 10), f = b(f, h = b(h, l, s, c, f, e[10], 2053994217, 15), l, s = u(s, 10), c, e[14], 2053994217, 8), h, l = u(l, 10), s, e[12], 0, 8);
h = p(h = u(h, 10), l = p(l, s = p(s, c, f, h, l, e[15], 0, 5), c, f = u(f, 10), h, e[10], 0, 12), s, c = u(c, 10), f, e[4], 0, 9);
s = p(s = u(s, 10), c = p(c, f = p(f, h, l, s, c, e[1], 0, 12), h, l = u(l, 10), s, e[5], 0, 5), f, h = u(h, 10), l, e[8], 0, 14);
f = p(f = u(f, 10), h = p(h, l = p(l, s, c, f, h, e[7], 0, 6), s, c = u(c, 10), f, e[6], 0, 8), l, s = u(s, 10), c, e[2], 0, 13);
l = p(l = u(l, 10), s = p(s, c = p(c, f, h, l, s, e[13], 0, 6), f, h = u(h, 10), l, e[14], 0, 5), c, f = u(f, 10), h, e[0], 0, 15);
c = p(c = u(c, 10), f = p(f, h = p(h, l, s, c, f, e[3], 0, 13), l, s = u(s, 10), c, e[9], 0, 11), h, l = u(l, 10), s, e[11], 0, 11);
h = u(h, 10);
var d = this._b + n + h | 0;
this._b = this._c + o + l | 0;
this._c = this._d + a + s | 0;
this._d = this._e + i + c | 0;
this._e = this._a + r + f | 0;
this._a = d;
};
r.prototype._digest = function() {
this._block[this._blockOffset++] = 128;
if (56 < this._blockOffset) {
this._block.fill(0, this._blockOffset, 64);
this._update();
this._blockOffset = 0;
}
this._block.fill(0, this._blockOffset, 56);
this._block.writeUInt32LE(this._length[0], 56);
this._block.writeUInt32LE(this._length[1], 60);
this._update();
var e = new t(20);
e.writeInt32LE(this._a, 0);
e.writeInt32LE(this._b, 4);
e.writeInt32LE(this._c, 8);
e.writeInt32LE(this._d, 12);
e.writeInt32LE(this._e, 16);
return e;
};
function u(e, t) {
return e << t | e >>> 32 - t;
}
function p(e, t, i, r, n, o, a, s) {
return u(e + (t ^ i ^ r) + o + a | 0, s) + n | 0;
}
function b(e, t, i, r, n, o, a, s) {
return u(e + (t & i | ~t & r) + o + a | 0, s) + n | 0;
}
function m(e, t, i, r, n, o, a, s) {
return u(e + ((t | ~i) ^ r) + o + a | 0, s) + n | 0;
}
function g(e, t, i, r, n, o, a, s) {
return u(e + (t & r | i & ~r) + o + a | 0, s) + n | 0;
}
function y(e, t, i, r, n, o, a, s) {
return u(e + (t ^ (i | ~r)) + o + a | 0, s) + n | 0;
}
o.exports = r;
}).call(this, n("buffer").Buffer);
}, {
buffer: 47,
"hash-base": 143,
inherits: 101
} ],
143: [ function(i, r, e) {
(function(s) {
"use strict";
var t = i("stream").Transform;
function e(e) {
t.call(this);
this._block = new s(e);
this._blockSize = e;
this._blockOffset = 0;
this._length = [ 0, 0, 0, 0 ];
this._finalized = !1;
}
i("inherits")(e, t);
e.prototype._transform = function(e, t, i) {
var r = null;
try {
"buffer" !== t && (e = new s(e, t));
this.update(e);
} catch (e) {
r = e;
}
i(r);
};
e.prototype._flush = function(e) {
var t = null;
try {
this.push(this._digest());
} catch (e) {
t = e;
}
e(t);
};
e.prototype.update = function(e, t) {
if (!s.isBuffer(e) && "string" != typeof e) throw new TypeError("Data must be a string or a buffer");
if (this._finalized) throw new Error("Digest already called");
s.isBuffer(e) || (e = new s(e, t || "binary"));
for (var i = this._block, r = 0; this._blockOffset + e.length - r >= this._blockSize; ) {
for (var n = this._blockOffset; n < this._blockSize; ) i[n++] = e[r++];
this._update();
this._blockOffset = 0;
}
for (;r < e.length; ) i[this._blockOffset++] = e[r++];
for (var o = 0, a = 8 * e.length; 0 < a; ++o) {
this._length[o] += a;
0 < (a = this._length[o] / 4294967296 | 0) && (this._length[o] -= 4294967296 * a);
}
return this;
};
e.prototype._update = function(e) {
throw new Error("_update is not implemented");
};
e.prototype.digest = function(e) {
if (this._finalized) throw new Error("Digest already called");
this._finalized = !0;
var t = this._digest();
void 0 !== e && (t = t.toString(e));
return t;
};
e.prototype._digest = function() {
throw new Error("_digest is not implemented");
};
r.exports = e;
}).call(this, i("buffer").Buffer);
}, {
buffer: 47,
inherits: 101,
stream: 153
} ],
144: [ function(e, t, i) {
var r = e("buffer"), n = r.Buffer;
function o(e, t) {
for (var i in e) t[i] = e[i];
}
if (n.from && n.alloc && n.allocUnsafe && n.allocUnsafeSlow) t.exports = r; else {
o(r, i);
i.Buffer = a;
}
function a(e, t, i) {
return n(e, t, i);
}
o(n, a);
a.from = function(e, t, i) {
if ("number" == typeof e) throw new TypeError("Argument must not be a number");
return n(e, t, i);
};
a.alloc = function(e, t, i) {
if ("number" != typeof e) throw new TypeError("Argument must be a number");
var r = n(e);
void 0 !== t ? "string" == typeof i ? r.fill(t, i) : r.fill(t) : r.fill(0);
return r;
};
a.allocUnsafe = function(e) {
if ("number" != typeof e) throw new TypeError("Argument must be a number");
return n(e);
};
a.allocUnsafeSlow = function(e) {
if ("number" != typeof e) throw new TypeError("Argument must be a number");
return r.SlowBuffer(e);
};
}, {
buffer: 47
} ],
145: [ function(e, t, i) {
var h = e("safe-buffer").Buffer;
function r(e, t) {
this._block = h.alloc(e);
this._finalSize = t;
this._blockSize = e;
this._len = 0;
}
r.prototype.update = function(e, t) {
if ("string" == typeof e) {
t = t || "utf8";
e = h.from(e, t);
}
for (var i = this._block, r = this._blockSize, n = e.length, o = this._len, a = 0; a < n; ) {
for (var s = o % r, c = Math.min(n - a, r - s), f = 0; f < c; f++) i[s + f] = e[a + f];
a += c;
(o += c) % r == 0 && this._update(i);
}
this._len += n;
return this;
};
r.prototype.digest = function(e) {
var t = this._len % this._blockSize;
this._block[t] = 128;
this._block.fill(0, t + 1);
if (t >= this._finalSize) {
this._update(this._block);
this._block.fill(0);
}
var i = 8 * this._len;
if (i <= 4294967295) this._block.writeUInt32BE(i, this._blockSize - 4); else {
var r = (4294967295 & i) >>> 0, n = (i - r) / 4294967296;
this._block.writeUInt32BE(n, this._blockSize - 8);
this._block.writeUInt32BE(r, this._blockSize - 4);
}
this._update(this._block);
var o = this._hash();
return e ? o.toString(e) : o;
};
r.prototype._update = function() {
throw new Error("_update must be implemented by subclass");
};
t.exports = r;
}, {
"safe-buffer": 144
} ],
146: [ function(e, t, i) {
(i = t.exports = function(e) {
e = e.toLowerCase();
var t = i[e];
if (!t) throw new Error(e + " is not supported (we accept pull requests)");
return new t();
}).sha = e("./sha");
i.sha1 = e("./sha1");
i.sha224 = e("./sha224");
i.sha256 = e("./sha256");
i.sha384 = e("./sha384");
i.sha512 = e("./sha512");
}, {
"./sha": 147,
"./sha1": 148,
"./sha224": 149,
"./sha256": 150,
"./sha384": 151,
"./sha512": 152
} ],
147: [ function(e, t, i) {
var r = e("inherits"), n = e("./hash"), o = e("safe-buffer").Buffer, g = [ 1518500249, 1859775393, -1894007588, -899497514 ], a = new Array(80);
function s() {
this.init();
this._w = a;
n.call(this, 64, 56);
}
r(s, n);
s.prototype.init = function() {
this._a = 1732584193;
this._b = 4023233417;
this._c = 2562383102;
this._d = 271733878;
this._e = 3285377520;
return this;
};
s.prototype._update = function(e) {
for (var t, i, r, n, o, a, s = this._w, c = 0 | this._a, f = 0 | this._b, h = 0 | this._c, l = 0 | this._d, d = 0 | this._e, u = 0; u < 16; ++u) s[u] = e.readInt32BE(4 * u);
for (;u < 80; ++u) s[u] = s[u - 3] ^ s[u - 8] ^ s[u - 14] ^ s[u - 16];
for (var p = 0; p < 80; ++p) {
var b = ~~(p / 20), m = ((a = c) << 5 | a >>> 27) + (r = f, n = h, o = l, 0 === (i = b) ? r & n | ~r & o : 2 === i ? r & n | r & o | n & o : r ^ n ^ o) + d + s[p] + g[b] | 0;
d = l;
l = h;
h = (t = f) << 30 | t >>> 2;
f = c;
c = m;
}
this._a = c + this._a | 0;
this._b = f + this._b | 0;
this._c = h + this._c | 0;
this._d = l + this._d | 0;
this._e = d + this._e | 0;
};
s.prototype._hash = function() {
var e = o.allocUnsafe(20);
e.writeInt32BE(0 | this._a, 0);
e.writeInt32BE(0 | this._b, 4);
e.writeInt32BE(0 | this._c, 8);
e.writeInt32BE(0 | this._d, 12);
e.writeInt32BE(0 | this._e, 16);
return e;
};
t.exports = s;
}, {
"./hash": 145,
inherits: 101,
"safe-buffer": 144
} ],
148: [ function(e, t, i) {
var r = e("inherits"), n = e("./hash"), o = e("safe-buffer").Buffer, y = [ 1518500249, 1859775393, -1894007588, -899497514 ], a = new Array(80);
function s() {
this.init();
this._w = a;
n.call(this, 64, 56);
}
r(s, n);
s.prototype.init = function() {
this._a = 1732584193;
this._b = 4023233417;
this._c = 2562383102;
this._d = 271733878;
this._e = 3285377520;
return this;
};
s.prototype._update = function(e) {
for (var t, i, r, n, o, a, s, c = this._w, f = 0 | this._a, h = 0 | this._b, l = 0 | this._c, d = 0 | this._d, u = 0 | this._e, p = 0; p < 16; ++p) c[p] = e.readInt32BE(4 * p);
for (;p < 80; ++p) c[p] = (t = c[p - 3] ^ c[p - 8] ^ c[p - 14] ^ c[p - 16]) << 1 | t >>> 31;
for (var b = 0; b < 80; ++b) {
var m = ~~(b / 20), g = ((s = f) << 5 | s >>> 27) + (n = h, o = l, a = d, 0 === (r = m) ? n & o | ~n & a : 2 === r ? n & o | n & a | o & a : n ^ o ^ a) + u + c[b] + y[m] | 0;
u = d;
d = l;
l = (i = h) << 30 | i >>> 2;
h = f;
f = g;
}
this._a = f + this._a | 0;
this._b = h + this._b | 0;
this._c = l + this._c | 0;
this._d = d + this._d | 0;
this._e = u + this._e | 0;
};
s.prototype._hash = function() {
var e = o.allocUnsafe(20);
e.writeInt32BE(0 | this._a, 0);
e.writeInt32BE(0 | this._b, 4);
e.writeInt32BE(0 | this._c, 8);
e.writeInt32BE(0 | this._d, 12);
e.writeInt32BE(0 | this._e, 16);
return e;
};
t.exports = s;
}, {
"./hash": 145,
inherits: 101,
"safe-buffer": 144
} ],
149: [ function(e, t, i) {
var r = e("inherits"), n = e("./sha256"), o = e("./hash"), a = e("safe-buffer").Buffer, s = new Array(64);
function c() {
this.init();
this._w = s;
o.call(this, 64, 56);
}
r(c, n);
c.prototype.init = function() {
this._a = 3238371032;
this._b = 914150663;
this._c = 812702999;
this._d = 4144912697;
this._e = 4290775857;
this._f = 1750603025;
this._g = 1694076839;
this._h = 3204075428;
return this;
};
c.prototype._hash = function() {
var e = a.allocUnsafe(28);
e.writeInt32BE(this._a, 0);
e.writeInt32BE(this._b, 4);
e.writeInt32BE(this._c, 8);
e.writeInt32BE(this._d, 12);
e.writeInt32BE(this._e, 16);
e.writeInt32BE(this._f, 20);
e.writeInt32BE(this._g, 24);
return e;
};
t.exports = c;
}, {
"./hash": 145,
"./sha256": 150,
inherits: 101,
"safe-buffer": 144
} ],
150: [ function(e, t, i) {
var r = e("inherits"), n = e("./hash"), o = e("safe-buffer").Buffer, S = [ 1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993, 2453635748, 2870763221, 3624381080, 310598401, 607225278, 1426881987, 1925078388, 2162078206, 2614888103, 3248222580, 3835390401, 4022224774, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986, 2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711, 113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, 2177026350, 2456956037, 2730485921, 2820302411, 3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344, 430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779, 1955562222, 2024104815, 2227730452, 2361852424, 2428436474, 2756734187, 3204031479, 3329325298 ], a = new Array(64);
function s() {
this.init();
this._w = a;
n.call(this, 64, 56);
}
r(s, n);
s.prototype.init = function() {
this._a = 1779033703;
this._b = 3144134277;
this._c = 1013904242;
this._d = 2773480762;
this._e = 1359893119;
this._f = 2600822924;
this._g = 528734635;
this._h = 1541459225;
return this;
};
s.prototype._update = function(e) {
for (var t, i, r, n, o, a, s, c = this._w, f = 0 | this._a, h = 0 | this._b, l = 0 | this._c, d = 0 | this._d, u = 0 | this._e, p = 0 | this._f, b = 0 | this._g, m = 0 | this._h, g = 0; g < 16; ++g) c[g] = e.readInt32BE(4 * g);
for (;g < 64; ++g) c[g] = (((i = c[g - 2]) >>> 17 | i << 15) ^ (i >>> 19 | i << 13) ^ i >>> 10) + c[g - 7] + (((t = c[g - 15]) >>> 7 | t << 25) ^ (t >>> 18 | t << 14) ^ t >>> 3) + c[g - 16] | 0;
for (var y = 0; y < 64; ++y) {
var v = m + (((s = u) >>> 6 | s << 26) ^ (s >>> 11 | s << 21) ^ (s >>> 25 | s << 7)) + ((a = b) ^ u & (p ^ a)) + S[y] + c[y] | 0, w = (((o = f) >>> 2 | o << 30) ^ (o >>> 13 | o << 19) ^ (o >>> 22 | o << 10)) + ((r = f) & (n = h) | l & (r | n)) | 0;
m = b;
b = p;
p = u;
u = d + v | 0;
d = l;
l = h;
h = f;
f = v + w | 0;
}
this._a = f + this._a | 0;
this._b = h + this._b | 0;
this._c = l + this._c | 0;
this._d = d + this._d | 0;
this._e = u + this._e | 0;
this._f = p + this._f | 0;
this._g = b + this._g | 0;
this._h = m + this._h | 0;
};
s.prototype._hash = function() {
var e = o.allocUnsafe(32);
e.writeInt32BE(this._a, 0);
e.writeInt32BE(this._b, 4);
e.writeInt32BE(this._c, 8);
e.writeInt32BE(this._d, 12);
e.writeInt32BE(this._e, 16);
e.writeInt32BE(this._f, 20);
e.writeInt32BE(this._g, 24);
e.writeInt32BE(this._h, 28);
return e;
};
t.exports = s;
}, {
"./hash": 145,
inherits: 101,
"safe-buffer": 144
} ],
151: [ function(e, t, i) {
var r = e("inherits"), n = e("./sha512"), o = e("./hash"), a = e("safe-buffer").Buffer, s = new Array(160);
function c() {
this.init();
this._w = s;
o.call(this, 128, 112);
}
r(c, n);
c.prototype.init = function() {
this._ah = 3418070365;
this._bh = 1654270250;
this._ch = 2438529370;
this._dh = 355462360;
this._eh = 1731405415;
this._fh = 2394180231;
this._gh = 3675008525;
this._hh = 1203062813;
this._al = 3238371032;
this._bl = 914150663;
this._cl = 812702999;
this._dl = 4144912697;
this._el = 4290775857;
this._fl = 1750603025;
this._gl = 1694076839;
this._hl = 3204075428;
return this;
};
c.prototype._hash = function() {
var r = a.allocUnsafe(48);
function e(e, t, i) {
r.writeInt32BE(e, i);
r.writeInt32BE(t, i + 4);
}
e(this._ah, this._al, 0);
e(this._bh, this._bl, 8);
e(this._ch, this._cl, 16);
e(this._dh, this._dl, 24);
e(this._eh, this._el, 32);
e(this._fh, this._fl, 40);
return r;
};
t.exports = c;
}, {
"./hash": 145,
"./sha512": 152,
inherits: 101,
"safe-buffer": 144
} ],
152: [ function(e, t, i) {
var r = e("inherits"), n = e("./hash"), o = e("safe-buffer").Buffer, ee = [ 1116352408, 3609767458, 1899447441, 602891725, 3049323471, 3964484399, 3921009573, 2173295548, 961987163, 4081628472, 1508970993, 3053834265, 2453635748, 2937671579, 2870763221, 3664609560, 3624381080, 2734883394, 310598401, 1164996542, 607225278, 1323610764, 1426881987, 3590304994, 1925078388, 4068182383, 2162078206, 991336113, 2614888103, 633803317, 3248222580, 3479774868, 3835390401, 2666613458, 4022224774, 944711139, 264347078, 2341262773, 604807628, 2007800933, 770255983, 1495990901, 1249150122, 1856431235, 1555081692, 3175218132, 1996064986, 2198950837, 2554220882, 3999719339, 2821834349, 766784016, 2952996808, 2566594879, 3210313671, 3203337956, 3336571891, 1034457026, 3584528711, 2466948901, 113926993, 3758326383, 338241895, 168717936, 666307205, 1188179964, 773529912, 1546045734, 1294757372, 1522805485, 1396182291, 2643833823, 1695183700, 2343527390, 1986661051, 1014477480, 2177026350, 1206759142, 2456956037, 344077627, 2730485921, 1290863460, 2820302411, 3158454273, 3259730800, 3505952657, 3345764771, 106217008, 3516065817, 3606008344, 3600352804, 1432725776, 4094571909, 1467031594, 275423344, 851169720, 430227734, 3100823752, 506948616, 1363258195, 659060556, 3750685593, 883997877, 3785050280, 958139571, 3318307427, 1322822218, 3812723403, 1537002063, 2003034995, 1747873779, 3602036899, 1955562222, 1575990012, 2024104815, 1125592928, 2227730452, 2716904306, 2361852424, 442776044, 2428436474, 593698344, 2756734187, 3733110249, 3204031479, 2999351573, 3329325298, 3815920427, 3391569614, 3928383900, 3515267271, 566280711, 3940187606, 3454069534, 4118630271, 4000239992, 116418474, 1914138554, 174292421, 2731055270, 289380356, 3203993006, 460393269, 320620315, 685471733, 587496836, 852142971, 1086792851, 1017036298, 365543100, 1126000580, 2618297676, 1288033470, 3409855158, 1501505948, 4234509866, 1607167915, 987167468, 1816402316, 1246189591 ], a = new Array(160);
function s() {
this.init();
this._w = a;
n.call(this, 128, 112);
}
r(s, n);
s.prototype.init = function() {
this._ah = 1779033703;
this._bh = 3144134277;
this._ch = 1013904242;
this._dh = 2773480762;
this._eh = 1359893119;
this._fh = 2600822924;
this._gh = 528734635;
this._hh = 1541459225;
this._al = 4089235720;
this._bl = 2227873595;
this._cl = 4271175723;
this._dl = 1595750129;
this._el = 2917565137;
this._fl = 725511199;
this._gl = 4215389547;
this._hl = 327033209;
return this;
};
function te(e, t, i) {
return i ^ e & (t ^ i);
}
function ie(e, t, i) {
return e & t | i & (e | t);
}
function re(e, t) {
return (e >>> 28 | t << 4) ^ (t >>> 2 | e << 30) ^ (t >>> 7 | e << 25);
}
function ne(e, t) {
return (e >>> 14 | t << 18) ^ (e >>> 18 | t << 14) ^ (t >>> 9 | e << 23);
}
function oe(e, t) {
return e >>> 0 < t >>> 0 ? 1 : 0;
}
s.prototype._update = function(e) {
for (var t, i, r, n, o, a, s, c, f = this._w, h = 0 | this._ah, l = 0 | this._bh, d = 0 | this._ch, u = 0 | this._dh, p = 0 | this._eh, b = 0 | this._fh, m = 0 | this._gh, g = 0 | this._hh, y = 0 | this._al, v = 0 | this._bl, w = 0 | this._cl, S = 0 | this._dl, _ = 0 | this._el, I = 0 | this._fl, x = 0 | this._gl, C = 0 | this._hl, G = 0; G < 32; G += 2) {
f[G] = e.readInt32BE(4 * G);
f[G + 1] = e.readInt32BE(4 * G + 4);
}
for (;G < 160; G += 2) {
var A = f[G - 30], k = f[G - 30 + 1], T = ((s = A) >>> 1 | (c = k) << 31) ^ (s >>> 8 | c << 24) ^ s >>> 7, E = ((o = k) >>> 1 | (a = A) << 31) ^ (o >>> 8 | a << 24) ^ (o >>> 7 | a << 25);
A = f[G - 4];
k = f[G - 4 + 1];
var M = ((r = A) >>> 19 | (n = k) << 13) ^ (n >>> 29 | r << 3) ^ r >>> 6, D = ((t = k) >>> 19 | (i = A) << 13) ^ (i >>> 29 | t << 3) ^ (t >>> 6 | i << 26), R = f[G - 14], N = f[G - 14 + 1], B = f[G - 32], P = f[G - 32 + 1], L = E + N | 0, U = T + R + oe(L, E) | 0;
U = (U = U + M + oe(L = L + D | 0, D) | 0) + B + oe(L = L + P | 0, P) | 0;
f[G] = U;
f[G + 1] = L;
}
for (var O = 0; O < 160; O += 2) {
U = f[O];
L = f[O + 1];
var F = ie(h, l, d), j = ie(y, v, w), q = re(h, y), z = re(y, h), H = ne(p, _), V = ne(_, p), K = ee[O], W = ee[O + 1], Y = te(p, b, m), J = te(_, I, x), X = C + V | 0, Z = g + H + oe(X, C) | 0;
Z = (Z = (Z = Z + Y + oe(X = X + J | 0, J) | 0) + K + oe(X = X + W | 0, W) | 0) + U + oe(X = X + L | 0, L) | 0;
var Q = z + j | 0, $ = q + F + oe(Q, z) | 0;
g = m;
C = x;
m = b;
x = I;
b = p;
I = _;
p = u + Z + oe(_ = S + X | 0, S) | 0;
u = d;
S = w;
d = l;
w = v;
l = h;
v = y;
h = Z + $ + oe(y = X + Q | 0, X) | 0;
}
this._al = this._al + y | 0;
this._bl = this._bl + v | 0;
this._cl = this._cl + w | 0;
this._dl = this._dl + S | 0;
this._el = this._el + _ | 0;
this._fl = this._fl + I | 0;
this._gl = this._gl + x | 0;
this._hl = this._hl + C | 0;
this._ah = this._ah + h + oe(this._al, y) | 0;
this._bh = this._bh + l + oe(this._bl, v) | 0;
this._ch = this._ch + d + oe(this._cl, w) | 0;
this._dh = this._dh + u + oe(this._dl, S) | 0;
this._eh = this._eh + p + oe(this._el, _) | 0;
this._fh = this._fh + b + oe(this._fl, I) | 0;
this._gh = this._gh + m + oe(this._gl, x) | 0;
this._hh = this._hh + g + oe(this._hl, C) | 0;
};
s.prototype._hash = function() {
var r = o.allocUnsafe(64);
function e(e, t, i) {
r.writeInt32BE(e, i);
r.writeInt32BE(t, i + 4);
}
e(this._ah, this._al, 0);
e(this._bh, this._bl, 8);
e(this._ch, this._cl, 16);
e(this._dh, this._dl, 24);
e(this._eh, this._el, 32);
e(this._fh, this._fl, 40);
e(this._gh, this._gl, 48);
e(this._hh, this._hl, 56);
return r;
};
t.exports = s;
}, {
"./hash": 145,
inherits: 101,
"safe-buffer": 144
} ],
153: [ function(e, t, i) {
t.exports = r;
var h = e("events").EventEmitter;
e("inherits")(r, h);
r.Readable = e("readable-stream/readable.js");
r.Writable = e("readable-stream/writable.js");
r.Duplex = e("readable-stream/duplex.js");
r.Transform = e("readable-stream/transform.js");
r.PassThrough = e("readable-stream/passthrough.js");
function r() {
h.call(this);
}
(r.Stream = r).prototype.pipe = function(t, e) {
var i = this;
function r(e) {
t.writable && !1 === t.write(e) && i.pause && i.pause();
}
i.on("data", r);
function n() {
i.readable && i.resume && i.resume();
}
t.on("drain", n);
if (!(t._isStdio || e && !1 === e.end)) {
i.on("end", a);
i.on("close", s);
}
var o = !1;
function a() {
if (!o) {
o = !0;
t.end();
}
}
function s() {
if (!o) {
o = !0;
"function" == typeof t.destroy && t.destroy();
}
}
function c(e) {
f();
if (0 === h.listenerCount(this, "error")) throw e;
}
i.on("error", c);
t.on("error", c);
function f() {
i.removeListener("data", r);
t.removeListener("drain", n);
i.removeListener("end", a);
i.removeListener("close", s);
i.removeListener("error", c);
t.removeListener("error", c);
i.removeListener("end", f);
i.removeListener("close", f);
t.removeListener("close", f);
}
i.on("end", f);
i.on("close", f);
t.on("close", f);
t.emit("pipe", i);
return t;
};
}, {
events: 83,
inherits: 101,
"readable-stream/duplex.js": 127,
"readable-stream/passthrough.js": 138,
"readable-stream/readable.js": 139,
"readable-stream/transform.js": 140,
"readable-stream/writable.js": 141
} ],
154: [ function(e, t, i) {
var r = e("buffer").Buffer, n = r.isEncoding || function(e) {
switch (e && e.toLowerCase()) {
case "hex":
case "utf8":
case "utf-8":
case "ascii":
case "binary":
case "base64":
case "ucs2":
case "ucs-2":
case "utf16le":
case "utf-16le":
case "raw":
return !0;

default:
return !1;
}
};
var o = i.StringDecoder = function(e) {
this.encoding = (e || "utf8").toLowerCase().replace(/[-_]/, "");
(function(e) {
if (e && !n(e)) throw new Error("Unknown encoding: " + e);
})(e);
switch (this.encoding) {
case "utf8":
this.surrogateSize = 3;
break;

case "ucs2":
case "utf16le":
this.surrogateSize = 2;
this.detectIncompleteChar = s;
break;

case "base64":
this.surrogateSize = 3;
this.detectIncompleteChar = c;
break;

default:
this.write = a;
return;
}
this.charBuffer = new r(6);
this.charReceived = 0;
this.charLength = 0;
};
o.prototype.write = function(e) {
for (var t = ""; this.charLength; ) {
var i = e.length >= this.charLength - this.charReceived ? this.charLength - this.charReceived : e.length;
e.copy(this.charBuffer, this.charReceived, 0, i);
this.charReceived += i;
if (this.charReceived < this.charLength) return "";
e = e.slice(i, e.length);
if (!(55296 <= (n = (t = this.charBuffer.slice(0, this.charLength).toString(this.encoding)).charCodeAt(t.length - 1)) && n <= 56319)) {
this.charReceived = this.charLength = 0;
if (0 === e.length) return t;
break;
}
this.charLength += this.surrogateSize;
t = "";
}
this.detectIncompleteChar(e);
var r = e.length;
if (this.charLength) {
e.copy(this.charBuffer, 0, e.length - this.charReceived, r);
r -= this.charReceived;
}
var n;
r = (t += e.toString(this.encoding, 0, r)).length - 1;
if (55296 <= (n = t.charCodeAt(r)) && n <= 56319) {
var o = this.surrogateSize;
this.charLength += o;
this.charReceived += o;
this.charBuffer.copy(this.charBuffer, o, 0, o);
e.copy(this.charBuffer, 0, 0, o);
return t.substring(0, r);
}
return t;
};
o.prototype.detectIncompleteChar = function(e) {
for (var t = 3 <= e.length ? 3 : e.length; 0 < t; t--) {
var i = e[e.length - t];
if (1 == t && i >> 5 == 6) {
this.charLength = 2;
break;
}
if (t <= 2 && i >> 4 == 14) {
this.charLength = 3;
break;
}
if (t <= 3 && i >> 3 == 30) {
this.charLength = 4;
break;
}
}
this.charReceived = t;
};
o.prototype.end = function(e) {
var t = "";
e && e.length && (t = this.write(e));
if (this.charReceived) {
var i = this.charReceived, r = this.charBuffer, n = this.encoding;
t += r.slice(0, i).toString(n);
}
return t;
};
function a(e) {
return e.toString(this.encoding);
}
function s(e) {
this.charReceived = e.length % 2;
this.charLength = this.charReceived ? 2 : 0;
}
function c(e) {
this.charReceived = e.length % 3;
this.charLength = this.charReceived ? 3 : 0;
}
}, {
buffer: 47
} ],
155: [ function(e, t, i) {
(function(i) {
t.exports = function(e, t) {
if (r("noDeprecation")) return e;
var i = !1;
return function() {
if (!i) {
if (r("throwDeprecation")) throw new Error(t);
r("traceDeprecation") ? console.trace(t) : console.warn(t);
i = !0;
}
return e.apply(this, arguments);
};
};
function r(e) {
try {
if (!i.localStorage) return !1;
} catch (e) {
return !1;
}
var t = i.localStorage[e];
return null != t && "true" === String(t).toLowerCase();
}
}).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {});
}, {} ],
156: [ function(require, module, exports) {
var indexOf = require("indexof"), Object_keys = function(e) {
if (Object.keys) return Object.keys(e);
var t = [];
for (var i in e) t.push(i);
return t;
}, forEach = function(e, t) {
if (e.forEach) return e.forEach(t);
for (var i = 0; i < e.length; i++) t(e[i], i, e);
}, defineProp = function() {
try {
Object.defineProperty({}, "_", {});
return function(e, t, i) {
Object.defineProperty(e, t, {
writable: !0,
enumerable: !1,
configurable: !0,
value: i
});
};
} catch (e) {
return function(e, t, i) {
e[t] = i;
};
}
}(), globals = [ "Array", "Boolean", "Date", "Error", "EvalError", "Function", "Infinity", "JSON", "Math", "NaN", "Number", "Object", "RangeError", "ReferenceError", "RegExp", "String", "SyntaxError", "TypeError", "URIError", "decodeURI", "decodeURIComponent", "encodeURI", "encodeURIComponent", "escape", "eval", "isFinite", "isNaN", "parseFloat", "parseInt", "undefined", "unescape" ];
function Context() {}
Context.prototype = {};
var Script = exports.Script = function(e) {
if (!(this instanceof Script)) return new Script(e);
this.code = e;
};
Script.prototype.runInContext = function(t) {
if (!(t instanceof Context)) throw new TypeError("needs a 'context' argument.");
var e = document.createElement("iframe");
e.style || (e.style = {});
e.style.display = "none";
document.body.appendChild(e);
var i = e.contentWindow, r = i.eval, n = i.execScript;
if (!r && n) {
n.call(i, "null");
r = i.eval;
}
forEach(Object_keys(t), function(e) {
i[e] = t[e];
});
forEach(globals, function(e) {
t[e] && (i[e] = t[e]);
});
var o = Object_keys(i), a = r.call(i, this.code);
forEach(Object_keys(i), function(e) {
(e in t || -1 === indexOf(o, e)) && (t[e] = i[e]);
});
forEach(globals, function(e) {
e in t || defineProp(t, e, i[e]);
});
document.body.removeChild(e);
return a;
};
Script.prototype.runInThisContext = function() {
return eval(this.code);
};
Script.prototype.runInNewContext = function(t) {
var i = Script.createContext(t), e = this.runInContext(i);
forEach(Object_keys(i), function(e) {
t[e] = i[e];
});
return e;
};
forEach(Object_keys(Script.prototype), function(i) {
exports[i] = Script[i] = function(e) {
var t = Script(e);
return t[i].apply(t, [].slice.call(arguments, 1));
};
});
exports.createScript = function(e) {
return exports.Script(e);
};
exports.createContext = Script.createContext = function(t) {
var i = new Context();
"object" == typeof t && forEach(Object_keys(t), function(e) {
i[e] = t[e];
});
return i;
};
}, {
indexof: 100
} ],
Bilog: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "057de109nBGZ49LJHh7q7qv", "Bilog");
tywx.clickStatEventType = {
clickStatEventTypeUserFrom: 99990001,
clickStatEventTypeWxLoginStart: 67890005,
clickStatEventTypeWxLoginSuccess: 67890006,
clickStatEventTypeWxLoginFailed: 678900007,
clickStatEventTypeAuthorizationStart: 67890008,
clickStatEventTypeAuthorizationSuccess: 67890009,
clickStatEventTypeAuthorizationFailed: 67890010,
clickStatEventTypeLoginSDKStart: 67890011,
clickStatEventTypeLoginSDKSuccess: 67890012,
clickStatEventTypeLoginSDKFailed: 67890013,
clickStatEventTypeTCP_Start: 67890014,
clickStatEventTypeTCP_Success: 67890015,
clickStatEventTypeTCP_Failed: 67890016
};
tywx.BiLog = {
uploadLogTimely: function(e) {
if (tywx.StateInfo.networkConnected) {
if (e) {
var t = {
url: tywx.SystemInfo.errorLogServer + "?cloudname=" + tywx.SystemInfo.cloudId + "." + tywx.SystemInfo.intClientId,
header: [ "Content-Type:text/plain" ],
postData: e,
callback: null
};
tywx.HttpUtil.httpPost(t, "POST");
}
} else tywx.LOGD("tywx.BiLog", "net error!");
},
getSystemInfo: function() {
this.cloud_id = tywx.SystemInfo.cloudId;
this.rec_type = "1";
this.rec_id = "0";
this.receive_time = "0";
this.user_id = tywx.UserInfo.userId || "0";
this.game_id = tywx.SystemInfo.gameId;
this.client_id = tywx.SystemInfo.clientId;
this.device_id = tywx.Util.getLocalUUID();
this.ip_addr = "#IP";
this.nettype = "0";
this.phone_maker = "0";
this.phone_model = tywx.UserInfo.model;
this.phone_carrier = "0";
this.reserved = "0";
},
uploadClickStatLogTimely: function(e) {
if (null != e && "" != e) var t = {
url: tywx.SystemInfo.biLogServer,
headers: [ "Content-Type:text/plain" ],
postData: e,
obj: this,
tag: null,
callback: null
};
tywx.HttpUtil.httpPost(t, "POST");
},
clickStat: function(e, t) {
if (!tywx.StateInfo.debugMode) {
var i = [];
if ((t = t || []).length < 10) for (var r = 0; r < 9; r++) r < t.length ? i.push(t[r]) : i.push(0); else i = t;
console.log("clickStat: function (eventId, paramsList");
tywx.LOGD("BI打点", "eventid= " + e + " 描述 = " + JSON.stringify(i));
var n = this.assemblelog(e, i);
this.uploadClickStatLogTimely(n + "\n");
}
},
assemblelog: function(e, t) {
var i = new Date().getTime();
if (6e4 < i - this._timetag) {
this._timetag = i;
this.nettype = 0;
}
var r = t.join("\t");
this.getSystemInfo();
var n = this.cloud_id + "\t" + this.rec_type + "\t" + i + "\t" + this.rec_id + "\t" + this.receive_time + "\t" + e + "\t" + this.user_id + "\t" + this.game_id + "\t" + this.client_id + "\t" + this.device_id + "\t" + this.ip_addr + "\t" + this.nettype + "\t" + this.phone_maker + "\t" + this.phone_model + "\t" + this.phone_carrier + "\t" + r + "\t" + this.reserved;
return this.trimTab0(n);
},
trimTab0: function(e) {
return null == e || null == e ? "" : e.replace(/(\t0)*$/, "");
}
};
cc._RF.pop();
}, {} ],
EncodeDecode: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "9a284cCH7VDhIjF0ejejVP0", "EncodeDecode");
tywx.EncodeDecode = {
base64Encode: function(e) {
for (var t, i, r, n, o, a, s, c = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", f = "", h = 0, l = (e = tywx.EncodeDecode.utf8Encode(e)).length; h < l; ) {
n = (t = e.charCodeAt(h++)) >> 2;
o = (3 & t) << 4 | (i = e.charCodeAt(h++)) >> 4;
a = (15 & i) << 2 | (r = e.charCodeAt(h++)) >> 6;
s = 63 & r;
isNaN(i) ? a = s = 64 : isNaN(r) && (s = 64);
f = f + c.charAt(n) + c.charAt(o) + c.charAt(a) + c.charAt(s);
}
return f;
},
base64Decode: function(e) {
for (var t, i, r, n, o, a, s = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", c = 0, f = (e = e.replace(/[^A-Za-z0-9\+\/\=]/g, "")).length, h = []; c < f; ) {
t = s.indexOf(e.charAt(c++)) << 2 | (n = s.indexOf(e.charAt(c++))) >> 4;
i = (15 & n) << 4 | (o = s.indexOf(e.charAt(c++))) >> 2;
r = (3 & o) << 6 | (a = s.indexOf(e.charAt(c++)));
h.push(t);
64 != o && h.push(i);
64 != a && h.push(r);
}
return h;
},
utf8Encode: function(e) {
for (var t = "", i = 0, r = (e = e.replace(/\r\n/g, "\n")).length; i < r; i++) {
var n = e.charCodeAt(i);
if (n < 128) t += String.fromCharCode(n); else if (127 < n && n < 2048) {
t += String.fromCharCode(n >> 6 | 192);
t += String.fromCharCode(63 & n | 128);
} else {
t += String.fromCharCode(n >> 12 | 224);
t += String.fromCharCode(n >> 6 & 63 | 128);
t += String.fromCharCode(63 & n | 128);
}
}
return t;
},
utf8Decode: function(e) {
for (var t, i = "", r = 0, n = t = 0, o = e.length; r < o; ) if ((n = e[r]) < 128) {
i += String.fromCharCode(n);
r++;
} else if (191 < n && n < 224) {
t = e[r + 1];
i += String.fromCharCode((31 & n) << 6 | 63 & t);
r += 2;
} else {
t = e[r + 1];
c3 = e[r + 2];
i += String.fromCharCode((15 & n) << 12 | (63 & t) << 6 | 63 & c3);
r += 3;
}
return i;
}
};
cc._RF.pop();
}, {} ],
EventType: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "6c306kh8utCYbh8lIpgzds1", "EventType");
tywx.EventType = {
TCP_ERROR: "tcp_error",
TCP_CLOSE: "tcp_close",
TCP_OPENED: "tcp_opened",
TCP_RECONNECT: "tcp_reconnect",
TCP_RECEIVE: "tcp_receive",
SDK_LOGIN_SUCCESS: "sdk_login_success",
SDK_LOGIN_FAIL: "sdk_login_fail",
WEIXIN_LOGIN_SUCCESS: "weixin_login_success",
WEIXIN_LOGIN_FAIL: "weixin_login_fail",
SEND_HEART_BEAT: "SEND_HEART_BEAT",
GAME_SHOW: "GAME_SHOW",
GAME_HIDE: "GAME_HIDE",
START_AUTHORIZATION_FAILED: "START_AUTHORIZATION_FAILED"
};
cc._RF.pop();
}, {} ],
Game: [ function(o, e, t) {
"use strict";
cc._RF.push(e, "41a6d+zz9JLm6SvBYPugiIf", "Game");
var r = o("./common/ThirdAPI");
cc.Class({
extends: cc.Component,
properties: {
girdRoot: {
default: null,
type: cc.Prefab
},
bg: {
default: null,
type: cc.Sprite
},
btnSound: {
default: null,
type: cc.Prefab
},
battleRootPrefab: {
default: null,
type: cc.Prefab
},
uiRootPrefab: {
default: null,
type: cc.Prefab
},
rankPrefab: {
default: null,
type: cc.Prefab
},
storePrefab: {
default: null,
type: cc.Prefab
},
revivePrefab: {
default: null,
type: cc.Prefab
},
titlePrefab: {
default: null,
type: cc.Prefab
},
titleInfoPrefab: {
default: null,
type: cc.Prefab
},
tipsNode: {
default: null,
type: cc.Node
}
},
onLoad: function() {
cc._renderType, cc.game.RENDER_TYPE_CANVAS;
var e = this.getComponent("httpUtils");
e.httpGets("https://sanxqn.nalrer.cn/tysanxiao/new2048/linkImages/linkImages_1.json", function(e) {
if (-1 === e) console.log("请检查网络！"); else {
console.log("从CDN获取内敛图数据");
var t = JSON.parse(e);
console.log(t);
Global.linkImages = t.linkImages;
console.log(Global.linkImages);
}
});
e.httpGets("https://sanxqn.nalrer.cn/tysanxiao/new2048/shareImages/shareInfo_1.json", function(e) {
if (-1 === e) console.log("请检查网络！"); else {
console.log("从CDN获取分享图数据");
var t = JSON.parse(e);
console.log(t);
Global.cdnShareImages = t.shareImages;
Global.cdnTexts = t.shareTexts;
console.log(Global.cdnShareImages);
}
});
this.tipsNode.active = !1;
this.initGameinfo();
var t = this;
Global.LoadAtlas = o("LoadAtlas");
Global.LoadAtlas.loadAtlasRes("textures/gridItem/skins", function() {});
Global.LoadAtlas.loadAtlasRes("textures/gridItem/items", function() {
t.startGame();
});
Global.game = this.getComponent("Game");
var i = "http://sanxqn.nalrer.cn/tysanxiao/new2048/linkImages/2048_Img_1.png", r = i.lastIndexOf("/");
console.log(r);
var n = i.slice(r + 1);
console.log(n);
},
clearGameInfo: function() {
r.clearFriendGenStoneInfo();
},
initGameinfo: function() {
var e = new Date(Date.now());
Global.gameinfo = r.loadFriendGenStoneInfo();
if (!Global.gameinfo) {
Global.gameinfo = {
shareTimes: 0,
shareTotalTimes: 0,
shareDate: e.toDateString(),
shareTime: 0,
shareData1: {
shareDate: e.toDateString(),
arrOpenGId: []
},
shareData2: {
shareDate: e.toDateString(),
arrOpenGId: []
},
shareData3: {
shareDate: e.toDateString(),
arrOpenGId: []
}
};
r.saveFriendGenStoneInfo(Global.gameinfo);
}
if (Global.gameinfo.shareDate != e.toDateString()) {
Global.gameinfo.shareTimes = 0;
Global.gameinfo.shareTotalTimes = 0;
Global.gameinfo.shareTime = 0;
Global.gameinfo.shareDate = e.toDateString();
r.saveFriendGenStoneInfo(Global.gameinfo);
}
if (!Global.gameinfo.shareData1 || Global.gameinfo.shareData1.shareDate != e.toDateString()) {
Global.gameinfo.shareData1 = {
shareDate: e.toDateString(),
arrOpenGId: []
};
r.saveFriendGenStoneInfo(Global.gameinfo);
}
if (!Global.gameinfo.shareData2 || Global.gameinfo.shareData2.shareDate != e.toDateString()) {
Global.gameinfo.shareData2 = {
shareDate: e.toDateString(),
arrOpenGId: []
};
r.saveFriendGenStoneInfo(Global.gameinfo);
}
if (!Global.gameinfo.shareData3 || Global.gameinfo.shareData3.shareDate != e.toDateString()) {
Global.gameinfo.shareData3 = {
shareDate: e.toDateString(),
arrOpenGId: []
};
r.saveFriendGenStoneInfo(Global.gameinfo);
}
},
startGame: function() {
Global.uiScript || (Global.uiScript = cc.instantiate(this.uiRootPrefab).getComponent("uiRoot"));
Global.uiScript.node.parent && Global.uiScript.node.parent.removeChild(Global.uiScript.node);
Global.uiScript.showStartUI();
this.node.addChild(Global.uiScript.node);
this.initStoreData();
this.initTitleData();
this.initUIData();
},
showShareUI: function() {
Global.uiScript || (Global.uiScript = cc.instantiate(this.uiRootPrefab).getComponent("uiRoot"));
Global.uiScript.node.parent && Global.uiScript.node.parent.removeChild(Global.uiScript.node);
this.node.addChild(Global.uiScript.node);
Global.uiScript.showShareUI();
},
showRank: function() {
Global.rankui || (Global.rankui = cc.instantiate(this.rankPrefab).getComponent("rankUI"));
Global.rankui.node.parent && Global.rankui.node.parent.removeChild(Global.rankui.node);
this.node.addChild(Global.rankui.node);
Global.rankui.initData();
},
showStore: function() {
Global.storeUI || (Global.storeUI = cc.instantiate(this.storePrefab).getComponent("UIStore"));
Global.storeUI.node.parent && Global.storeUI.node.parent.removeChild(Global.storeUI.node);
this.node.addChild(Global.storeUI.node);
Global.storeUI.initData();
},
showRevive: function() {
Global.reviveUI || (Global.reviveUI = cc.instantiate(this.revivePrefab).getComponent("reviveUI"));
Global.reviveUI.node.parent && Global.reviveUI.node.parent.removeChild(Global.reviveUI.node);
this.node.addChild(Global.reviveUI.node);
Global.reviveUI.initData();
},
showTitle: function() {
Global.titleUI || (Global.titleUI = cc.instantiate(this.titlePrefab).getComponent("UITitle"));
Global.titleUI.node.parent && Global.titleUI.node.parent.removeChild(Global.titleUI.node);
this.node.addChild(Global.titleUI.node);
Global.titleUI.initData();
},
showTitleInfo: function() {
Global.titleInfoUI || (Global.titleInfoUI = cc.instantiate(this.titleInfoPrefab).getComponent("UITitleInfo"));
Global.titleInfoUI.node.parent && Global.titleInfoUI.node.parent.removeChild(Global.titleInfoUI.node);
this.node.addChild(Global.titleInfoUI.node);
Global.titleInfoUI.initData();
},
initUIData: function() {
this.showStore();
Global.storeUI && Global.storeUI.onClose();
this.showTitle();
Global.titleUI && Global.titleUI.onClose();
},
initStoreData: function() {
Global.storeData = r.loadInfo("skinstore");
null == Global.storeData && (Global.storeData = []);
Global.skinIndex = r.loadCurrentSkin();
},
initTitleData: function() {
null == Global.titleData && (Global.titleData = []);
null == Global.titleDateData && (Global.titleDateData = []);
null == Global.titleUnlockData && (Global.titleUnlockData = []);
Global.shareData = r.loadShareData();
var e = new Date(Date.now());
if (Global.shareData) {
if (Global.shareData.shareDate != e.toDateString()) {
Global.shareData = {
shareTimes: 0,
shareDate: e.toDateString()
};
r.saveShareData(Global.shareData.shareTimes, Global.shareData.shareDate);
}
} else {
var t = new Date(Date.now());
Global.shareData = {
shareTimes: 0,
shareDate: t.toDateString()
};
r.saveShareData(Global.shareData.shareTimes, Global.shareData.shareDate);
}
},
saveScore: function() {
if ("undefined" != typeof wx) {
var e = r.loadLocalScore(), i = parseInt(e.maxscore);
parseInt(e.gold);
r.loadScore(function(e, t) {
i = parseInt(e);
t = parseInt(t);
});
r.saveScore(i, Global.wxGold);
}
},
showDialogText: function(e, t) {
var i = this;
if (Global.cdnGameConfig.totalSwith) console.log("开关已打开，不显示文字提示"); else {
this.tipsNode.active = !0;
this.tipsNode.setLocalZOrder(10);
this.tipsNode.stopAllActions();
this.tipsNode.getChildByName("label").getComponent(cc.Label).string = e;
this.tipsNode.getChildByName("sprite").width = cc.find("Canvas").width;
setTimeout(function() {
i.tipsNode.active = !1;
}, 2e3);
}
},
playSound: function(e, n) {
if (Global.isBGMPlaying) {
var o = this;
cc.loader.loadRes("audio/" + e, cc.AudioClip, function(e, t) {
var i = cc.instantiate(o.btnSound);
o.node.addChild(i);
var r = i.getComponent(cc.AudioSource);
r.clip = t;
r.volume = n;
r.play();
});
}
},
restart: function() {
this.enterScene();
},
enterScene: function() {
Global.gridController || (Global.gridController = cc.instantiate(this.girdRoot));
Global.gridController.parent && Global.gridController.parent.removeChild(Global.gridController);
this.node.addChild(Global.gridController);
Global.gridController.getComponent("gridController").initGridData();
}
});
cc._RF.pop();
}, {
"./common/ThirdAPI": "ThirdApi",
LoadAtlas: "LoadAtlas"
} ],
GlobalInit: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "d60a4qJ+JRMhbuRZF5NMHVS", "GlobalInit");
tywx.StateInfo = {
debugMode: !1,
networkConnected: !0,
networkType: "none",
isOnForeground: !0
};
tywx.SystemInfo = {
clientId: "H5_2.0_weixin.weixin.0-hall301.weixin.sxnew2048",
intClientId: 23142,
cloudId: 30,
version: 2,
webSocketUrl: "ws://192.168.10.88/",
loginUrl: "https://xyxsx.nalrer.cn/",
deviceId: "wechatGame",
wxAppId: "wxbb777fbea1e15f52",
appId: 10894,
gameId: 301,
cdnPath: "https://richqn.nalrer.cn/dizhu/",
remotePackPath: "remote_res/res.zip",
biLogServer: "https://cbi.touch4.me/api/bilog5/text",
errorLogServer: "https://clienterr.touch4.me/api/bilog5/clientlog"
};
tywx.UserInfo = {
userId: 0,
userName: "TuWechatGame",
userPic: "",
authorCode: "",
systemType: 0,
wechatType: "6.6.1",
model: "未知设备",
system: "iOS 10.0.1",
loc: "",
scene_id: "",
scene_param: "",
invite_id: 0,
wxgame_session_key: ""
};
tywx.LOGD = function(e, t) {
if (tywx.debugNode) {
var i = (e = e || "tywx") + " : " + t;
console.log(i);
}
};
tywx.LOGE = function(e, t) {
if (tywx.debugNode) {
var i = (e = e || "tywx") + " : " + t;
console.error(i);
}
};
tywx.IsWechatPlatform = function() {
try {
wx;
wx.showShareMenu();
return !0;
} catch (e) {
return !1;
}
};
cc._RF.pop();
}, {} ],
Global: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "706f3NfOLBHb7CfrXxA4ezP", "Global");
window.Global = {
cdnGameConfig: {
totalSwith: !1,
startScoreSwith: !0,
startScoreLimit: 1e3,
reviveScoreSwith: !0,
reviveScoreLimit: 1e3,
shareScoreSwith: !0,
shareScoreLimit: 1e3
},
hNum: 5,
vNum: 8,
itemSize: 100,
soonItemSize: 70,
itemSplit: 0,
screenWidth: 960,
screenHeight: 640,
paddingButtom: -100,
gridNumSize: 24,
bornXgridNum: 2,
weightScores: [ {
id: 2,
weight: 11 / 60
}, {
id: 4,
weight: 11 / 60
}, {
id: 8,
weight: 11 / 60
}, {
id: 16,
weight: 11 / 60
}, {
id: 32,
weight: 11 / 60
}, {
id: 64,
weight: 5 / 60
} ],
weightScores2: [ {
id: 2,
weight: 16 / 70
}, {
id: 4,
weight: 15 / 70
}, {
id: 8,
weight: 12 / 70
}, {
id: 16,
weight: 12 / 70
}, {
id: 32,
weight: 5 / 70
}, {
id: 64,
weight: 5 / 70
}, {
id: 128,
weight: 5 / 70
} ],
gridRandomScores: [ 2, 4, 8, 16, 32, 64 ],
gridRandomScores2: [],
joinRandomScores: [],
gridDownSpeed: 1700,
gridQuickDownSpeed: 5e3,
gridCombineDownSpeed: 600,
moveThreshold: 125,
moveDownThreshold: 150,
gridMaxScore: 1024,
combineTime: 2e3,
gridDownDelayTime: 1,
cdnShareImages: null,
cdnTexts: null,
shareImages: [ "weixin_fenxiang-3.jpg", "weixin_fenxiang-4.jpg", "weixin_fenxiang-5.jpg" ],
shareTexts: [ "这游戏玩不到2万分的自己退群吧", "方块界最好玩的2048，2048界最好玩的俄罗斯方块", "朋友圈智商最高的一群人，已经悄悄玩起了这个", "本以为，这波我必不会死，结果……", "欧美玩家已经玩疯了！国内终于开放了，点击查看", "来自战斗民族的游戏!", "8090的回忆，俄罗斯方块重磅回归", "玩这个坐过了3站，但是合成了3个2048这波不亏！", "我已凑齐7个2048，来一起召唤神龙吧！", "智慧与美貌并存，俄罗斯与2048双飞。", "白富美都去约会了，剩下矮穷矬的我还在这里玩这个！", "加班这辈子不可能加班，只能玩这个勉强维持生活酱紫" ],
canFlyNums: [ 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096 ],
canFlyGolds: [ 1024, 2048, 4096 ],
addGold: {
1024: 1,
2048: 1,
4096: 2
},
flyNumPools: [],
costGold: 15,
LoadAtlas: null,
isBGMPlaying: !0,
isPaused: !1,
game: null,
gridController: null,
startUI: null,
shareUI: null,
battleRootScript: null,
uiScript: null,
dataScript: null,
rankui: null,
storeUI: null,
reviveUI: null,
titleUI: null,
titleInfoUI: null,
linkImages: null,
shareReward: 10,
reviveTimes: 0,
reviveTotalTimes: 1,
reviveTodayTimes: 10,
reviveShareTimes: 0,
clearVNum: 3,
combineTimes: 0,
testEnabled: !1,
canTest: !1,
accessTime: 48e4,
addTimes: 2,
wxScore: 0,
wxGold: 0,
tipsPos: null,
gameinfo: {
shareTimes: 0,
shareTotalTimes: 0,
shareDate: 0,
shareTime: 0,
shareData1: {
shareDate: 0,
arrOpenGId: []
},
shareData2: {
shareDate: 0,
arrOpenGId: []
},
shareData3: {
shareDate: 0,
arrOpenGId: []
}
},
randomGemStone: [ 1, 2, 3, 4, 5 ],
getForTotalTimes: 5,
dailyTotalTimes: 3,
intervalTime: 9e5,
fbname: "",
fbphoto: "",
fbScore: 0,
skinIndex: 0,
storeData: null,
titleData: null,
titleDateData: null,
titleUnlockData: null,
shareData: null,
titleMaxScore: 0,
waitToDown: .5,
forJoin: .2
};
cc._RF.pop();
}, {} ],
HttpUtil: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "27c804uvO5DjI1YiZ1RHN3G", "HttpUtil");
tywx.HttpUtil = {
httpPost: function(t, e) {
tywx.IsWechatPlatform() && wx.request({
url: t.url,
data: t.postData,
header: t.header,
method: e,
dataType: "json",
success: function(e) {
console.log(e);
200 == e.statusCode ? e.data && e.data.hasOwnProperty("/api/bilog5/clientlog") && "ok" == e.data["/api/bilog5/clientlog"] && tywx.LOGD("ty.HttpUtil.httpPost", "post success! ") : tywx.LOGD("ty.HttpUtil.httpPost", "statusCode:" + e.statusCode);
},
fail: function(e) {
console.log(e);
tywx.LOGD("ty.HttpUtil.httpPost", "post error! " + t.url);
}
});
}
};
cc._RF.pop();
}, {} ],
LanguageData: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "61de062n4dJ7ZM9/Xdumozn", "LanguageData");
var r = e("polyglot.min"), n = null;
window.i18n || (window.i18n = {
languages: {},
curLang: ""
});
0;
function o(e) {
return window.i18n.languages[e];
}
function a(e) {
e && (n ? n.replace(e) : n = new r({
phrases: e,
allowMissing: !0
}));
}
t.exports = {
init: function(e) {
if (e !== window.i18n.curLang) {
var t = o(e) || {};
window.i18n.curLang = e;
a(t);
this.inst = n;
}
},
t: function(e, t) {
if (n) return n.t(e, t);
},
inst: n,
updateSceneRenderers: function() {
for (var e = cc.director.getScene().children, t = [], i = 0; i < e.length; ++i) {
var r = e[i].getComponentsInChildren("LocalizedLabel");
Array.prototype.push.apply(t, r);
}
for (var n = 0; n < t.length; ++n) {
t[n].updateLabel();
}
for (var o = [], a = 0; a < e.length; ++a) {
var s = e[a].getComponentsInChildren("LocalizedSprite");
Array.prototype.push.apply(o, s);
}
for (var c = 0; c < o.length; ++c) {
o[c].updateSprite(window.i18n.curLang);
}
}
};
cc._RF.pop();
}, {
"polyglot.min": "polyglot.min"
} ],
LinkImages: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "b2084Uv/U9J6ILP8+QAi1EV", "LinkImages");
var r = {
previewImage: function(e) {
"undefined" != typeof wx && wx.previewImage({
urls: [ e ],
success: function(e) {
console.log("preview success", e);
},
fail: function(e) {
console.log("preview fail", e);
}
});
}
};
t.exports = r;
cc._RF.pop();
}, {} ],
LoadAtlas: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "e6954PqwupDA68Ay/f/GhDn", "LoadAtlas");
var r = {
spriteAtlas: [],
loadAtlasRes: function(a, s) {
if (-1 < this.spriteAtlas.indexOf(a)) s(); else {
var c = this;
cc.loader.loadRes(a, cc.SpriteAtlas, function(e, t) {
for (var i = t.getSpriteFrames(), r = [], n = 0; n < i.length; n++) {
var o = i[n];
r[o.name] = o;
}
c.spriteAtlas[a] = r;
s();
});
}
},
getSpriteFrameFromName: function(e, t) {
return this.spriteAtlas[e][t];
}
};
t.exports = r;
cc._RF.pop();
}, {} ],
LocalizedLabel: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "744dcs4DCdNprNhG0xwq6FK", "LocalizedLabel");
var r = e("LanguageData");
cc.Class({
extends: cc.Component,
editor: {
executeInEditMode: !0,
menu: "i18n/LocalizedLabel"
},
properties: {
dataID: {
get: function() {
return this._dataID;
},
set: function(e) {
if (this._dataID !== e) {
this._dataID = e;
this.updateLabel();
}
}
},
_dataID: ""
},
onLoad: function() {
0;
r.inst || r.init();
this.fetchRender();
},
fetchRender: function() {
var e = this.getComponent(cc.Label);
if (e) {
this.label = e;
this.updateLabel();
} else ;
},
updateLabel: function() {
if (this.label) {
r.t(this.dataID) && (this.label.string = r.t(this.dataID));
} else cc.error("Failed to update localized label, label component is invalid!");
}
});
cc._RF.pop();
}, {
LanguageData: "LanguageData"
} ],
LocalizedSprite: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "f34ac2GGiVOBbG6XlfvgYP4", "LocalizedSprite");
var r = e("SpriteFrameSet");
cc.Class({
extends: cc.Component,
editor: {
executeInEditMode: !0,
inspector: "packages://i18n/inspector/localized-sprite.js",
menu: "i18n/LocalizedSprite"
},
properties: {
spriteFrameSet: {
default: [],
type: r
}
},
onLoad: function() {
this.fetchRender();
},
fetchRender: function() {
var e = this.getComponent(cc.Sprite);
if (e) {
this.sprite = e;
this.updateSprite(window.i18n.curLang);
} else ;
},
getSpriteFrameByLang: function(e) {
for (var t = 0; t < this.spriteFrameSet.length; ++t) if (this.spriteFrameSet[t].language === e) return this.spriteFrameSet[t].spriteFrame;
},
updateSprite: function(e) {
if (this.sprite) {
var t = this.getSpriteFrameByLang(e);
!t && this.spriteFrameSet[0] && (t = this.spriteFrameSet[0].spriteFrame);
this.sprite.spriteFrame = t;
} else cc.error("Failed to update localized sprite, sprite component is invalid!");
}
});
cc._RF.pop();
}, {
SpriteFrameSet: "SpriteFrameSet"
} ],
NotificationCenter: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "3fd1bjkdHlBJ5PzjTr6t5gi", "NotificationCenter");
console.log("NotificationCenter loaded");
tywx.NotificationCenter = {
events: {},
listen: function(e, t, i) {
this.events[e] = this.events[e] || [];
this.events[e].push({
scope: i || this,
handler: t
});
},
ignore: function(e, t, i) {
i = i || this;
var r = this.events[e];
r && (this.events[e] = r.filter(function(e) {
return e.scope != i || e.handler != t;
}));
},
ignoreScope: function(t) {
for (var i in this.events) {
var e = this.events[i];
e && (this.events[i] = e.filter(function(e) {
if (e.scope != t) return !0;
tywx.LOGD("tywx.NotificationCenter", "ty.NotificationCenter : remove listener by Scope: " + i);
return !1;
}));
}
},
trigger: function(e, t) {
var i = this.events[e];
if (i) for (var r, n = 0; n < i.length; n++) (r = i[n]).handler.call(r.scope, t);
}
};
cc._RF.pop();
}, {} ],
ShareInterface: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "d8bb4jMhZVIZaNSaBbQ32Bq", "ShareInterface");
tywx.ShareInterface = {
shareWithPic: function(e, t, i, r, n, o, a, s) {
tywx.IsWechatPlatform() && wx.shareAppMessage({
title: i,
imageUrl: r,
query: n,
success: function(e) {},
fail: function() {
s && s();
},
complete: function() {}
});
}
};
tywx.onShareAppMessageInit = function() {
tywx.IsWechatPlatform() && wx.onShareAppMessage(function(e) {});
};
tywx.onShareAppMessageInit();
cc._RF.pop();
}, {} ],
SpriteFrameSet: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "97019Q80jpE2Yfz4zbuCZBq", "SpriteFrameSet");
var r = cc.Class({
name: "SpriteFrameSet",
properties: {
language: "",
spriteFrame: cc.SpriteFrame
}
});
t.exports = r;
cc._RF.pop();
}, {} ],
StoreItem: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "a4c47PqE5hCjIciwhmBcxrv", "StoreItem");
var r = e("../common/ThirdAPI"), n = e("LoadAtlas");
cc.Class({
extends: cc.Component,
properties: {
bg: {
default: null,
type: cc.Sprite
},
front: {
default: null,
type: cc.Sprite
},
photo: {
default: null,
type: cc.Sprite
},
buttonBuy: {
default: null,
type: cc.Node
},
buttonState1: {
default: null,
type: cc.Node
},
buttonState2: {
default: null,
type: cc.Node
},
buttonState3: {
default: null,
type: cc.Node
},
labelname: {
default: null,
type: cc.Label
},
price: 0,
index: 0,
waretype: 1,
isHave: !1,
isCurrent: !1
},
hideAll: function() {
this.photo.setVisible(!1);
this.bg.setVisible(!1);
},
setPhoto: function(e) {
this.photo.spriteFrame = e;
},
setButtonState: function(e) {
this.buttonState1.active = !1;
this.buttonState2.active = !1;
this.buttonState3.active = !1;
1 == e ? this.buttonState1.active = !0 : 2 == e ? this.buttonState2.active = !0 : 3 == e && (this.buttonState3.active = !0);
},
updateState: function() {
this.isHave || (this.price, Global.wxGold);
},
setPrice: function(e) {
this.buttonState1.getChildByName("text").getComponent(cc.Label).string = e;
this.price = e;
Global.wxGold;
},
setCurrent: function(e) {
if (null != Global.storeUI && this.isHave) {
this.isCurrent = e;
this.setButtonState(e ? 3 : 2);
if (this.isCurrent && 1 == this.waretype) {
Global.storeUI.getComponent("UIStore").setCurrentItem(this.node);
Global.skinIndex = this.index;
r.saveCurrentSkin(Global.skinIndex);
}
}
},
setWareType: function(e) {
this.waretype = e;
this.photo.node.setContentSize(50, 50);
},
setIsHave: function() {
this.isHave = !0;
this.bg.spriteFrame = n.getSpriteFrameFromName("textures/gridItem/items", "skin-bg1");
this.front.spriteFrame = n.getSpriteFrameFromName("textures/gridItem/items", "skin-front1");
this.setButtonState(2);
},
setName: function(e) {
this.labelname.string = e;
},
start: function() {
this.buttonBuy.on("click", this.onButtonBy, this);
},
onButtonBy: function() {
Global.game.playSound("btn", .1);
if (this.isHave) this.isCurrent || this.setCurrent(!0); else {
if (!(this.price <= Global.wxGold)) {
Global.storeUI.getComponent("UIStore").showTipbox("您的钻石数量不够！");
return;
}
Global.storeUI.getComponent("UIStore").showTipbox("购买成功！");
for (var e = !(this.isHave = !0), t = 0; t < Global.storeData.length; t++) this.index + 100 * this.waretype == Global.storeData[t] && (e = !0);
if (!e) {
Global.storeData.push(this.index + 100 * this.waretype);
r.saveInfo("skinstore", Global.storeData);
}
Global.wxGold -= this.price;
Global.storeUI.getComponent("UIStore").propScore.string = Global.wxGold;
Global.game.saveScore();
Global.storeUI.getComponent("UIStore").updateStoreItemsState();
this.bg.spriteFrame = n.getSpriteFrameFromName("textures/gridItem/items", "skin-bg1");
this.front.spriteFrame = n.getSpriteFrameFromName("textures/gridItem/items", "skin-front1");
this.setButtonState(2);
Global.titleUI && Global.titleUI.updateItemsState(2);
}
}
});
cc._RF.pop();
}, {
"../common/ThirdAPI": "ThirdApi",
LoadAtlas: "LoadAtlas"
} ],
TCPClient: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "64920I1Dz5NLJbAWh+nq3yO", "TCPClient");
tywx.TCPClient = {
TAG: "TCP client",
CONNECT_STATUS_OK: 1,
CONNECT_STATUS_OPENING: 2,
CONNECT_STATUS_CLOSING: 3,
CONNECT_STATUS_FAIL: 0,
connectStatus: 0,
isTimerInited: !1,
tickCount: 0,
filterCmds: [ "heart_beat" ],
timerSchedule: function() {
tywx.TCPClient.tickCount = (tywx.TCPClient.tickCount + 1) % 3;
2 == tywx.TCPClient.tickCount && tywx.TCPClient.connectStatus == tywx.TCPClient.CONNECT_STATUS_OK && tywx.NotificationCenter.trigger(tywx.EventType.SEND_HEART_BEAT);
tywx.TCPClient.reconnet();
},
startCheckTimer: function() {
tywx.TCPClient.isTimerInited = !0;
tywx.Timer.setTimer(cc.director, this.timerSchedule, 1);
},
stopCheckTimer: function() {
tywx.TCPClient.isTimerInited = !1;
tywx.Timer.cancelTimer(cc.director, this.timerSchedule);
},
connect: function(e) {
if (tywx.TCPClient.connectStatus != tywx.TCPClient.CONNECT_STATUS_OPENING && tywx.TCPClient.connectStatus != tywx.TCPClient.CONNECT_STATUS_OK) {
tywx.TCPClient.connectStatus = tywx.TCPClient.CONNECT_STATUS_OPENING;
tywx.IsWechatPlatform() && this.doWechatConnect();
}
},
doWechatConnect: function() {
if (tywx.IsWechatPlatform()) {
wx.connectSocket({
url: url
});
wx.onSocketOpen(function(e) {
tywx.LOGD(tywx.TCPClient.TAG, "TCP webSocket opened...");
tywx.TCPClient.connectStatus = tywx.TCPClient.CONNECT_STATUS_OK;
tywx.NotificationCenter.trigger(tywx.EventType.TCP_OPENED);
tywx.TCPClient.isTimerInited || tywx.TCPClient.startCheckTimer();
});
wx.onSocketError(function(e) {
tywx.LOGD(tywx.TCPClient.TAG, "TCP webSocket error...");
tywx.TCPClient.connectStatus = tywx.TCPClient.CONNECT_STATUS_FAIL;
tywx.NotificationCenter.trigger(tywx.EventType.TCP_ERROR);
});
wx.onSocketClose(function(e) {
tywx.LOGD(tywx.TCPClient.TAG, "WebSocket 已关闭！");
tywx.TCPClient.connectStatus = tywx.TCPClient.CONNECT_STATUS_FAIL;
tywx.NotificationCenter.trigger(tywx.EventType.TCP_CLOSE);
});
wx.onSocketMessage(function(e) {
if (tywx.StateInfo.isOnForeground) {
var t = tywx.TCPClient.decodeMessage(e.data);
if (null != t && "0000" != t) {
var i = "[Receive TCP Msg]: " + unescape(t.replace(/\\u/gi, "%u")), r = t.substr(0, t.length - 0);
if (null != r && 0 < r.length) {
var n = JSON.parse(r);
-1 == tywx.TCPClient.filterCmds.indexOf(n.cmd) && tywx.LOGD(tywx.TCPClient.TAG, i);
tywx.NotificationCenter(tywx.EventType.TCP_RECEIVE, n);
}
}
}
});
}
},
decodeMessage: function(e) {
if ("undefined" != typeof ArrayBuffer && e instanceof ArrayBuffer) {
for (var t = new Uint8Array(e), i = "", r = 0, n = t.length; r < n; r++) {
i += String.fromCharCode(t[r]);
}
return i;
}
var o = (e = tywx.EncodeDecode.base64Decode(e)).slice(0, 4);
for (r = 0, n = (e = e.slice(4)).length; r < n; r++) {
var a = e[r];
a ^= o[r % 4];
e[r] = a;
}
return tywx.EncodeDecode.utf8Decode(e);
},
reconnet: function() {
if (tywx.StateInfo.isOnForeground && tywx.TCPClient.connectStatus == tywx.TCPClient.CONNECT_STATUS_FAIL) {
tywx.NotificationCenter.trigger(tywx.EventType.TCP_RECONNECT);
tywx.TCPClient.connect(tywx.SystemInfo.webSocketUrl);
}
},
sendMsg: function(e) {
if (tywx.TCPClient.connectStatus == tywx.TCPClient.CONNECT_STATUS_OK) {
var t = JSON.stringify(e);
-1 == tywx.TCPClient.filterCmds.indexOf(e.cmd) && tywx.LOGD(tywx.TCPClient.TAG, "TCP sendMsg:" + t);
tywx.IsWechatPlatform() && wx.sendSocketMessage({
data: t,
success: function(e) {
tywx.LOGD(tywx.TCPClient.TAG, "TCP sendMsg success:" + JSON.stringify(arguments));
},
fail: function(e) {
if (e && "sendSocketMessage:fail taskID not exist" === e.errMsg) {
wx.closeSocket();
tywx.TCPClient.connectStatus = tywx.TCPClient.CONNECT_STATUS_FAIL;
}
tywx.LOGD(tywx.TCPClient.TAG, "TCP sendMsg fail:" + JSON.stringify(arguments));
},
complete: function(e) {}
});
}
},
close: function() {
tywx.TCPClient.connectStatus = tywx.TCPClient.CONNECT_STATUS_CLOSING;
tywx.IsWechatPlatform() && wx.closeSocket();
tywx.TCPClient.stopCheckTimer();
tywx.LOGD(tywx.TCPClient.TAG, "TCP close..............");
}
};
cc._RF.pop();
}, {} ],
ThirdApi: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "1b608fyKURJppjdi3lNiRrN", "ThirdApi");
var n = e("./fbAPI"), o = e("./wxAPI"), u = "undefined" != typeof wx ? 1 : "undefined" != typeof FBInstant ? 2 : 0;
1 === u && o.initOnEnter();
var p = {
getRank: function(e, t) {
console.log("ThirdAPI getRank", e, t);
if (1 === u) {
if ("Friend" === t) return o.getFriendRank(e);
if ("Group" === t) return o.getGroupRank(e);
} else if (2 === u) return n.getRank(e);
},
shakeShort: function(e) {
1 === u ? o.shakeShort(e) : 2 === u && console.log("FB 平台未实现震动");
},
shakeLong: function(e) {
1 === u ? o.shakeLong(e) : 2 === u && console.log("FB 平台未实现震动");
},
showGameClub: function(e) {
1 === u && o.showGameClub(e);
},
saveScore: function(e, t) {
console.log("ThirdAPI saveScore", e, t);
1 === u ? o.saveScore(e, t) : 2 === u && n.saveFBScore(e, t);
try {
var i = '{ "maxscore": ' + e + ',\n "gold": ' + t + " }";
console.log("try save local score", i);
cc.sys.localStorage.setItem("triline-data", i);
} catch (e) {
console.error(e);
}
},
loadScore: function(e) {
if (1 === u) {
var t = this.loadLocalScore();
e && e(t.maxscore, t.gold);
} else if (2 === u) return n.getFBScore(e);
},
loadLocalScore: function() {
var e = {
maxscore: 0,
gold: 0
};
try {
var t = cc.sys.localStorage.getItem("triline-data");
console.log("storage data : " + t);
var i = JSON.parse(t);
i && (e.maxscore = parseInt(i.maxscore));
i.gold && (e.gold = parseInt(i.gold));
} catch (e) {
console.error(e);
}
return e;
},
saveReviveData: function(e) {
try {
var t = cc.sys.localStorage.getItem("2048-revive-data"), i = JSON.parse(t);
if (i) if (i.date && i.date != new Date().toDateString()) {
console.log("重新保存数据：" + new Date().toDateString(), Global.reviveTodayTimes);
this.clearReviveData();
i = {
date: new Date().toDateString(),
shareTimes: Global.reviveTodayTimes
};
} else {
console.log("更新保存数据" + e);
i = {
date: new Date().toDateString(),
shareTimes: e
};
} else i = {
date: new Date().toDateString(),
shareTimes: Global.reviveTodayTimes
};
var r = JSON.stringify(i);
console.log("try save local revive", r);
cc.sys.localStorage.setItem("2048-revive-data", r);
} catch (e) {
console.error(e);
}
},
loadReviveData: function() {
try {
var e = cc.sys.localStorage.getItem("2048-revive-data");
console.log("revive storage data : " + e);
var t = JSON.parse(e);
if (t) return t.date && t.date == new Date().toDateString() ? parseInt(t.shareTimes) : Global.reviveTodayTimes;
} catch (e) {
console.error(e);
}
return Global.reviveTodayTimes;
},
clearReviveData: function() {
try {
cc.sys.localStorage.removeItem("triline-revive-data");
} catch (e) {
console.error(e);
}
},
saveShareData: function(e, t) {
try {
var i = {
shareDate: t,
shareTimes: e
}, r = JSON.stringify(i);
cc.sys.localStorage.setItem("2048-share-data", r);
} catch (e) {
console.error(e);
}
},
loadShareData: function() {
var e = {
shareTimes: 0,
shareDate: ""
};
try {
var t = cc.sys.localStorage.getItem("2048-share-data");
if (t) {
var i = JSON.parse(t);
if (i) {
i.shareDate && (e.shareDate = i.shareDate);
i.shareTimes && (e.shareTimes = i.shareTimes);
}
}
} catch (e) {
console.error(e);
}
return e;
},
clearShareData: function() {
try {
cc.sys.localStorage.removeItem("2048-share-data");
} catch (e) {
console.error(e);
}
},
clearRankData: function() {
console.log("ThirdAPI ready clearRankData");
if (1 === u) {
var e = p.loadLocalScore(), i = parseInt(e.maxscore), t = parseInt(e.gold);
p.loadScore(function(e, t) {
i = parseInt(e);
t = parseInt(t);
console.log("clearRankData on ThirdAPI loadScore", i + " :: " + t);
});
try {
var r = new Date().getTime(), n = cc.sys.localStorage.getItem("2048-rank-data");
if (n) {
var o = JSON.parse(n), a = parseInt(o.clearTime);
if (0 == a) {
console.log("清除排行的时间为0");
cc.sys.localStorage.setItem("2048-rank-data", JSON.stringify({
clearTime: parseInt(r)
}));
p.saveScore(0, t);
} else {
var s = new Date(a), c = 0 == s.getDay() ? 7 : s.getDay(), f = 3600 * s.getHours() + 60 * s.getMinutes() + s.getSeconds(), h = a / 1e3 - 86400 * parseInt(c - 1) - f, l = a / 1e3 + 86400 * (7 - c) + (86400 - f - 1), d = new Date().getTime();
if (!(parseInt(1e3 * h) <= d && d <= parseInt(1e3 * l))) {
console.log("新的一周可以清空排行榜数据");
cc.sys.localStorage.setItem("2048-rank-data", JSON.stringify({
clearTime: parseInt(r)
}));
p.saveScore(0, t);
}
}
} else {
cc.sys.localStorage.setItem("2048-rank-data", JSON.stringify({
clearTime: parseInt(r)
}));
p.saveScore(0, t);
}
} catch (e) {
console.error(e);
}
}
},
clearInfo: function(e) {
try {
cc.sys.localStorage.removeItem("triline-data" + e);
} catch (e) {}
return [];
},
saveInfo: function(e, t) {
try {
for (var i = "[", r = 0; r < t.length; r++) {
0 < r && (i += ",");
i += '{"index":"' + t[r] + '"}';
}
i += "]";
cc.sys.localStorage.setItem("triline-data" + e, i);
} catch (e) {}
},
loadInfo: function(e) {
var t = [];
try {
var i = cc.sys.localStorage.getItem("triline-data" + e), r = JSON.parse(i);
if (r) for (var n = 0; n < r.length; n++) t.push(r[n].index);
} catch (e) {}
return t;
},
clearCurrentSkin: function() {
try {
cc.sys.localStorage.removeItem("triline-currentskin-data");
} catch (e) {}
return [];
},
saveCurrentSkin: function(e) {
try {
var t = '{ "currentSkin": ' + e + " }";
cc.sys.localStorage.setItem("triline-currentskin-data", t);
} catch (e) {}
},
loadCurrentSkin: function() {
var e = 0;
try {
var t = cc.sys.localStorage.getItem("triline-currentskin-data"), i = JSON.parse(t);
i && (e = parseInt(i.currentSkin));
} catch (e) {}
return e;
},
shareGame: function(e, t, i, r) {
if (1 === u) {
t ? console.log("wx has callback") : console.log("wx has no callback");
o.shareGame(e, t, i, r);
} else 2 === u && n.onShareGame(e, t);
},
saveFriendGenStoneInfo: function(e) {
console.log("ThirdAPI saveInfo");
try {
var t = JSON.stringify(e);
console.log("try save local data", t);
cc.sys.localStorage.setItem("new2048-claimData", t);
} catch (e) {
console.error(e);
}
},
loadFriendGenStoneInfo: function() {
console.log("ThirdAPI loadInfo");
try {
var e = cc.sys.localStorage.getItem("new2048-claimData");
console.log("storage data : " + e);
var t = JSON.parse(e);
if (t) return t;
} catch (e) {}
return null;
},
clearFriendGenStoneInfo: function() {
try {
cc.sys.localStorage.removeItem("new2048-claimData");
} catch (e) {
console.error(e);
}
},
getShareUserInfo: function() {
if (1 === u) return o.getShareUserInfo();
},
exitGame: function() {
if (1 === u) return o.exit();
},
getSystemInfo: function() {
if (1 === u) return o.getSystemInfo();
}
};
t.exports = p;
cc._RF.pop();
}, {
"./fbAPI": "fbAPI",
"./wxAPI": "wxAPI"
} ],
Timer: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "31641vy56hK8bS4bRlCjr1C", "Timer");
tywx.Timer = {
setTimer: function(e, t, i, r, n) {
e && e._TAG && tywx.LOGD("tywx.Timer", "----------in setTimer----------" + (e._TAG ? e._TAG : ""));
var o = cc.director.getScheduler();
null != r || cc.macro.REPEAT_FOREVER;
o.schedule(t, e, i, r, n, !1);
},
cancelTimer: function(e, t) {
e && e._TAG && tywx.LOGD("tywx.Timer", "----------in cancelTimer ---------" + (e._TAG ? e._TAG : ""));
cc.director.getScheduler().unschedule(t, e);
},
isScheduledTimer: function(e, t) {
e && e._TAG && tywx.LOGD("tywx.Timer", "----------in isScheduledTimer ---------" + (e._TAG ? e._TAG : ""));
return cc.director.getScheduler().isScheduled(t, e);
}
};
cc._RF.pop();
}, {} ],
TitleItem: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "cfabfmBprhLTLjGCybJs1Ft", "TitleItem");
var r = e("../common/ThirdAPI");
cc.Class({
extends: cc.Component,
properties: {
bg: {
default: null,
type: cc.Sprite
},
title: {
default: null,
type: cc.Label
},
description: {
default: null,
type: cc.Label
},
button: {
default: null,
type: cc.Node
},
price: 0,
reward: 0,
date: "",
titleType: 1,
index: 0,
isHave: !1
},
onLoad: function() {
this.button.on("click", this.onButton, this);
this.isHave = !1;
this.button.getComponent(cc.Button).interactable = !1;
this.button.getChildByName("price").getComponent(cc.Label).string = "未达成";
},
setTitle: function(e) {
this.title.string = e;
},
setDescription: function(e) {
this.description.string = e;
},
updateState: function(e) {
if (this.isHave) return !1;
if (e != this.titleType) return !1;
if (1 == this.titleType) {
if (this.price <= Global.titleMaxScore) {
this.button.getComponent(cc.Button).interactable = !0;
this.button.getChildByName("price").getComponent(cc.Label).string = "领取";
return !0;
}
this.button.getComponent(cc.Button).interactable = !1;
return !(this.button.getChildByName("price").getComponent(cc.Label).string = "未达成");
}
if (2 == this.titleType) {
if (this.price <= Global.storeData.length) {
this.button.getComponent(cc.Button).interactable = !0;
this.button.getChildByName("price").getComponent(cc.Label).string = "领取";
return !0;
}
this.button.getComponent(cc.Button).interactable = !1;
return !(this.button.getChildByName("price").getComponent(cc.Label).string = "未达成");
}
if (3 == this.titleType) {
if (this.price <= Global.titleData.length) {
this.button.getComponent(cc.Button).interactable = !0;
this.button.getChildByName("price").getComponent(cc.Label).string = "领取";
return !0;
}
this.button.getComponent(cc.Button).interactable = !1;
return !(this.button.getChildByName("price").getComponent(cc.Label).string = "未达成");
}
},
setUnlock: function() {
if (!this.isHave) {
this.button.getComponent(cc.Button).interactable = !0;
this.button.getChildByName("price").getComponent(cc.Label).string = "领取";
}
},
setTitleType: function(e) {
this.titleType = e;
},
setPrice: function(e) {
this.price = e;
},
setReward: function(e) {
this.reward = e;
},
setDate: function(e) {
this.date = e;
},
setIsHave: function() {
this.isHave = !0;
this.button.getComponent(cc.Button).interactable = !0;
this.button.getChildByName("price").getComponent(cc.Label).string = "查看";
},
onButton: function() {
Global.game.playSound("btn", .1);
if (this.isHave) {
Global.game.showTitleInfo();
Global.titleInfoUI && Global.titleInfoUI.initData(this.title.string, this.description.string, this.reward + "个钻石", this.date);
} else {
for (var e = !(this.isHave = !0), t = 0; t < Global.titleData.length; t++) if (this.index == Global.titleData[t]) {
e = !0;
break;
}
if (!e) {
Global.titleData.push(this.index);
r.saveInfo("title", Global.titleData);
var i = new Date(Date.now());
this.date = i.getFullYear() + "-" + (i.getMonth() + 1) + "-" + i.getDate();
Global.titleDateData.push(this.date);
r.saveInfo("title-date", Global.titleDateData);
Global.titleUI.updateLabelComplete();
}
this.button.getChildByName("price").getComponent(cc.Label).string = "查看";
Global.titleUI && Global.titleUI.updateItemsState(3);
Global.game.showTitleInfo();
if (Global.titleInfoUI) {
Global.titleInfoUI.initData(this.title.string, this.description.string, this.reward + "个钻石", this.date);
Global.titleInfoUI.addPropScore(this.reward);
}
}
}
});
cc._RF.pop();
}, {
"../common/ThirdAPI": "ThirdApi"
} ],
TuyooSDK: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "e4bc1KHy2xCDY2xDmeKJ3rD", "TuyooSDK");
console.log("TuyooSDK loaded");
tywx.TuyooSDK = {
SESSION_KEY: "TU_SESSION_STORAGE",
login: function() {
if (tywx.IsWechatPlatform()) {
tywx.TuyooSDK.getSystemInfo();
tywx.TuyooSDK.wechatLogin();
}
},
wechatLogin: function() {
tywx.IsWechatPlatform() && wx.login({
success: function(e) {
tywx.LOGD(null, "wx login success, params:" + JSON.stringify(e));
if (e.code) {
var t = e.code;
tywx.TuyooSDK.loginTuyooWithCode(t, {});
tywx.NotificationCenter.trigger(tywx.EventType.WEIXIN_LOGIN_SUCCESS);
}
},
fail: function(e) {
tywx.LOGD(null, "wx login fail, params:" + JSON.stringify(e));
tywx.NotificationCenter.trigger(tywx.EventType.WEIXIN_LOGIN_FAIL);
},
complete: function(e) {}
});
},
loginTuyooWith3rdSession: function() {
tywx.IsWechatPlatform() && wx.getStorage({
key: tywx.TuyooSDK.SESSION_KEY,
success: function(e) {
e.data ? wx.request({
url: tywx.SystemInfo.loginUrl + "open/v3/user/processSnsIdNew",
data: {
snsId: e.data,
deviceName: "wechatGame",
clientId: tywx.SystemInfo.clientId,
appId: tywx.SystemInfo.appId
},
success: function(e) {
tywx.LOGD(null, "tuyoo login success, params:" + JSON.stringify(e));
},
fail: function(e) {
tywx.LOGD(null, "tuyoo login fail, params:" + JSON.stringify(e));
},
complete: function(e) {}
}) : tywx.TuyooSDK.wechatLogin();
},
fail: function(e) {
tywx.TuyooSDK.wechatLogin();
},
complete: function(e) {}
});
},
loginTuyooWithCode: function(e, t) {
if (tywx.IsWechatPlatform()) {
wx.showShareMenu({
withShareTicket: !0
});
var i = t.gender || 0, r = tywx.Util.getLocalUUID();
tywx.LOGD("local_uuid:", r);
var n = tywx.SystemInfo.loginUrl, o = {
appId: tywx.SystemInfo.appId,
wxAppId: tywx.SystemInfo.wxAppId,
clientId: tywx.SystemInfo.clientId,
snsId: "wxapp:" + e,
uuid: r,
gender: i,
scene_id: tywx.UserInfo.scene_id || "",
scene_param: tywx.UserInfo.scene_param || "",
invite_id: tywx.UserInfo.invite_id || 0
};
t && t.nickName && (o.nikeName = t.nickName);
t && t.avatarUrl && (o.avatarUrl = t.avatarUrl);
wx.request({
url: n + "open/v6/user/LoginBySnsIdNoVerify",
header: {
"content-type": "application/x-www-form-urlencoded"
},
data: o,
method: "POST",
success: function(e) {
console.log("success 11");
tywx.LOGD(null, "tuyoo login success, params:" + JSON.stringify(e));
var t = e.data;
console.log("tuyoo login success...", t);
if (t.error && 1 == t.error.code) console.log("tuyoo login fail..."); else {
var i = t.result;
tywx.UserInfo.userId = i.userId;
tywx.UserInfo.userName = i.userName;
tywx.UserInfo.userPic = i.purl;
tywx.UserInfo.authorCode = i.authorCode;
tywx.UserInfo.wxgame_session_key = i.wxgame_session_key;
tywx.LOGD(null, "userId:" + tywx.UserInfo.userId + " userName:" + tywx.UserInfo.userName + " userPic:" + tywx.UserInfo.userPic);
var r = i.token;
tywx.LOGD(null, "token:" + r);
wx.setStorage({
key: tywx.TuyooSDK.SESSION_KEY,
data: r
});
tywx.TuyooSDK.initWebSocketUrl(i);
tywx.NotificationCenter.trigger(tywx.EventType.SDK_LOGIN_SUCCESS);
}
},
fail: function(e) {
console.log("fail 11");
tywx.LOGD(null, "tuyoo login fail, params:" + JSON.stringify(e));
tywx.NotificationCenter.trigger(tywx.EventType.SDK_LOGIN_FAIL);
},
complete: function(e) {}
});
}
},
initWebSocketUrl: function(e) {
if (e && e.tcpsrv) {
var t, i = e.tcpsrv.ip, r = e.tcpsrv.wsport || e.tcpsrv.port;
t = -1 < tywx.SystemInfo.loginUrl.indexOf("170") || -1 < tywx.SystemInfo.loginUrl.indexOf("https://") ? "wss://" + i + "/" : "ws://" + i + ":" + r.toString() + "/";
tywx.LOGD(null, "webSocketUrl:" + t);
tywx.SystemInfo.webSocketUrl = t;
}
},
getSystemInfo: function() {
tywx.IsWechatPlatform() && wx.getSystemInfo({
success: function(e) {
var t = 0 <= e.model.indexOf("iPhone"), i = e.windowHeight, r = 0;
r = t ? 812 == i ? 2 : 736 == i ? 4 : 1 : 3;
tywx.UserInfo.systemType = r;
tywx.UserInfo.wechatType = e.version;
tywx.UserInfo.model = e.model;
tywx.UserInfo.system = e.system;
},
fail: function() {},
complete: function() {}
});
},
createOrder: function(e, t, i, r) {
var n = {};
n.prodId = e;
n.prodPrice = t;
n.chargeType = "wxapp.iap";
n.gameId = tywx.SystemInfo.gameId;
n.prodName = i;
n.prodCount = r;
n.appInfo = {};
tywx.TuyooSDK.rechargeOrder(n);
},
orderCallFunc: function(e, t, i) {
if (tywx.IsWechatPlatform()) {
var r = tywx.Util.getLocalUUID();
wx.request({
url: e,
header: {
"content-type": "application/x-www-form-urlencoded"
},
data: {
userId: tywx.UserInfo.userId,
appId: tywx.SystemInfo.appId,
wxAppId: tywx.SystemInfo.wxAppId,
clientId: tywx.SystemInfo.clientId,
imei: "null",
uuid: r,
platformOrderId: t
},
method: "POST",
success: function(e) {},
fail: function(e) {
tywx.LOGE(null, "file = [Recharge] fun = [OrderCallFun] 充值失败 params = " + JSON.stringify(e));
},
complete: function(e) {}
});
}
},
rechargeOrder: function(e) {
if (tywx.IsWechatPlatform()) {
var t = tywx.Util.getLocalUUID(), i = tywx.SystemInfo.loginUrl;
wx.request({
url: i + "open/v4/pay/order",
header: {
"content-type": "application/x-www-form-urlencoded"
},
data: {
userId: tywx.UserInfo.userId,
appId: tywx.SystemInfo.appId,
wxAppId: tywx.SystemInfo.wxAppId,
clientId: tywx.SystemInfo.clientId,
imei: "null",
uuid: t,
prodId: e.prodId,
prodName: e.prodName,
prodCount: e.prodCount || 1,
prodPrice: e.prodPrice,
chargeType: e.chargeType,
gameId: e.gameId,
appInfo: e.appInfo,
mustcharge: e.mustcharge || 1
},
method: "POST",
success: function(e) {
tywx.LOGE(null, "tuyoo rechargeOrder success, params:" + JSON.stringify(e));
var t = e.data.result;
if (0 == t.code) {
var i = t.chargeInfo, r = i.chargeData, n = r.notifyUrl, o = r.platformOrderId;
tywx.LOGE(null, "tuyoo rechargeOrder success 创建订单成功, chargeData.mustcharge =" + r.mustcharge);
r && 1 == r.mustcharge ? wx.requestMidasPayment({
mode: r.mode,
env: r.env,
offerId: r.offerId,
buyQuantity: 10 * i.chargeTotal,
platform: r.platform,
currencyType: "CNY",
zoneId: r.zoneId,
success: function(e) {
tywx.TuyooSDK.orderCallFunc(n, o, i.chargeCoin);
},
fail: function(e) {
tywx.LOGE(null, "米大师支付 fail params = " + JSON.stringify(e));
}
}) : r && 0 == r.mustcharge && tywx.TuyooSDK.orderCallFunc(n, o, i.chargeCoin);
} else 1 == t.code || t.code;
},
fail: function(e) {},
complete: function(e) {}
});
}
}
};
tywx.WechatInterfaceInit = function() {
if (tywx.IsWechatPlatform()) {
console.log("wx.onShow");
wx.onShow(function(e) {
var t = e.scene, i = e.query;
console.log(e);
tywx.UserInfo.scene_id = t;
tywx.UserInfo.scene_param = i.from || "";
tywx.UserInfo.invite_id = i.inviteCode || 0;
tywx.LOGE("", "+++++++++++++++++onShow+++++++++++++++++" + JSON.stringify(e));
tywx.StateInfo.isOnForeground = !0;
tywx.NotificationCenter.trigger(tywx.EventType.GAME_SHOW);
console.log("start tywx.WechatInterfaceInit");
if (i && i.sourceCode) {
console.log("start tywx.WechatInterfaceInit 1");
tywx.BiLog.clickStat(tywx.clickStatEventType.clickStatEventTypeUserFrom, [ t, i.inviteCode, i.sourceCode, i.imageType ]);
} else {
console.log("start tywx.WechatInterfaceInit 2");
tywx.BiLog.clickStat(tywx.clickStatEventType.clickStatEventTypeUserFrom, [ t, i.from ]);
}
tywx.TuyooSDK.login();
});
wx.onHide(function() {
tywx.UserInfo.scene_id = 0;
tywx.StateInfo.isOnForeground = !1;
new Date().getTime();
tywx.NotificationCenter.trigger(tywx.EventType.GAME_HIDE);
tywx.LOGE("", "+++++++++++++++++onHide+++++++++++++++++");
tywx.TCPClient.close();
});
var e = function(e) {
e.hasOwnProperty("isConnected") ? tywx.StateInfo.networkConnected = e.isConnected : e.hasOwnProperty("errMsg") ? tywx.StateInfo.networkConnected = "getNetworkType:ok" == e.errMsg : tywx.StateInfo.networkConnected = "none" != e.networkType;
tywx.StateInfo.networkType = e.networkType;
};
wx.getNetworkType({
success: e
});
wx.onNetworkStatusChange(e);
wx.onError(function(e) {
var t = new Date(), i = "userId:" + tywx.UserInfo.userId + "time:" + t.toDateString() + " " + t.toTimeString() + ";" + e.message;
tywx.BiLog.uploadLogTimely(i);
});
}
};
tywx.WechatInterfaceInit();
cc._RF.pop();
}, {} ],
UIStore: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "cac97Boj5tAWr2WGIayXR8o", "UIStore");
e("../common/ThirdAPI");
var r = e("LoadAtlas");
cc.Class({
extends: cc.Component,
properties: {
content: {
default: null,
type: cc.Node
},
buttonClose: {
default: null,
type: cc.Node
},
storeitemPrefab: {
default: null,
type: cc.Prefab
},
tipbox: {
default: null,
type: cc.Node
},
propScore: {
default: null,
type: cc.Label
},
arrItems: [],
itemWidth: 260,
itemHeight: 260
},
start: function() {
this.buttonClose.on("click", this.onClose, this);
this.initStore();
},
showTipbox: function(e) {
this.tipbox.active = !0;
this.tipbox.getChildByName("text").getComponent(cc.Label).string = e;
},
onTipButton: function() {
this.tipbox.active = !1;
},
initData: function() {
this.propScore.string = Global.wxGold;
this.updateStoreItemsState();
},
initStore: function() {
this.initStoreList();
this.arrItems[0].getComponent("StoreItem").setIsHave();
console.log("已购商品列表", Global.storeData);
for (var e = 0; e < Global.storeData.length; e++) {
var t = Global.storeData[e], i = Math.floor(t / 100), r = t % 100;
console.log("已购商品 type:" + i + "index:" + r);
1 == i && this.arrItems[r].getComponent("StoreItem").setIsHave();
}
this.arrItems[Global.skinIndex].getComponent("StoreItem").setCurrent(!0);
},
initStoreList: function() {
var e = [];
e.push({
type: 1,
name: "数字",
photo: r.getSpriteFrameFromName("textures/gridItem/items", "skin1"),
price: 0
});
e.push({
type: 1,
name: "富豪",
photo: r.getSpriteFrameFromName("textures/gridItem/items", "skin2"),
price: 300
});
e.push({
type: 1,
name: "甄嬛传",
photo: r.getSpriteFrameFromName("textures/gridItem/items", "skin3"),
price: 400
});
e.push({
type: 1,
name: "脑残版",
photo: r.getSpriteFrameFromName("textures/gridItem/items", "skin4"),
price: 600
});
e.push({
type: 1,
name: "扑克版",
photo: r.getSpriteFrameFromName("textures/gridItem/skins", "skin5"),
price: 800
});
e.push({
type: 1,
name: "复仇版",
photo: r.getSpriteFrameFromName("textures/gridItem/items", "skin5"),
price: 1e3
});
for (var t = 0; t < e.length; t++) {
var i = cc.instantiate(this.storeitemPrefab);
i.getComponent("StoreItem").setPhoto(e[t].photo);
i.getComponent("StoreItem").setWareType(e[t].type);
i.getComponent("StoreItem").setPrice(e[t].price);
i.getComponent("StoreItem").setName(e[t].name);
this.setStoreItemPos(i, t);
i.getComponent("StoreItem").index = t;
i.getComponent("StoreItem").setCurrent(t == Global.skinIndex);
this.content.addChild(i);
this.arrItems.push(i);
}
this.content.height = Math.ceil(e.length / 2) * this.itemHeight;
},
updateStoreItemsState: function() {
for (var e = this.arrItems, t = 0; t < e.length; t++) e[t].getComponent("StoreItem").updateState();
},
setCurrentItem: function(e) {
for (var t = 0; t < this.arrItems.length; t++) {
var i = this.arrItems[t];
i != e && i.getComponent("StoreItem").setCurrent(!1);
}
},
setStoreItemPos: function(e, t) {
t % 2 == 0 ? e.setPosition(cc.p(-this.itemWidth / 2, -(Math.floor(t / 2) + .5) * this.itemHeight)) : e.setPosition(cc.p(this.itemWidth / 2, -(Math.floor(t / 2) + .5) * this.itemHeight));
},
onClose: function() {
Global.game.playSound("btn", .1);
this.node.parent && this.node.parent.removeChild(this.node);
}
});
cc._RF.pop();
}, {
"../common/ThirdAPI": "ThirdApi",
LoadAtlas: "LoadAtlas"
} ],
UITitleInfo: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "82a3bIh8aNF6rbVTY8W+Py8", "UITitleInfo");
var r = e("../common/ThirdAPI");
e("LoadAtlas");
cc.Class({
extends: cc.Component,
properties: {
buttonFlaunt: {
default: null,
type: cc.Node
},
buttonClose: {
default: null,
type: cc.Node
},
titleName: {
default: null,
type: cc.Label
},
titleDescription: {
default: null,
type: cc.Label
},
titleGet: {
default: null,
type: cc.Label
},
titleDate: {
default: null,
type: cc.Label
},
labelPropScore: {
default: null,
type: cc.Label
},
iconPropScore: {
default: null,
type: cc.Node
},
goldNum: 0,
showGold: 0
},
onLoad: function() {
this.buttonClose.on("click", this.onClose, this);
this.buttonFlaunt.on("click", this.onFlaunt, this);
this.reset();
},
initData: function(e, t, i, r) {
this.labelPropScore.string = Global.wxGold;
this.titleName.string = e;
this.titleDescription.string = t;
this.titleGet.string = "获得" + i;
this.titleDate.string = "达成日期：" + r;
},
addPropScore: function(e) {
this.showGold = Global.wxGold;
Global.wxGold += e;
Global.game.saveScore();
this.goldNum = Global.wxGold;
this.schedule(this.updateLabel, .18);
this.iconPropScore.runAction(cc.sequence(cc.scaleTo(.5, 1.2), cc.scaleTo(.5, 1), cc.scaleTo(.5, 1.2), cc.scaleTo(.5, 1)));
},
onClose: function() {
Global.game.playSound("btn", .1);
this.node.parent && this.node.parent.removeChild(this.node);
},
onFlaunt: function() {
Global.game.playSound("btn", .1);
Global.game.playSound("btn", .1);
"undefined" != typeof FBInstant ? r.shareGame(this.getImgBase64()) : r.shareGame("randomImg", null, null, "003");
},
updateLabel: function(e) {
if (this.showGold >= this.goldNum) this.unschedule(this.updateLabel); else {
this.showGold += 1;
this.labelPropScore.string = this.showGold;
}
},
reset: function() {
this.goldNum = 0;
this.showGold = -1;
},
getImgBase64: function() {
var e = cc.find("Canvas"), t = parseInt(e.width), i = parseInt(e.height), r = new cc.RenderTexture(t, i);
r.begin();
e._sgNode.visit();
r.end();
var n = document.createElement("canvas"), o = n.getContext("2d");
n.width = t;
n.height = i;
if (cc._renderType === cc.game.RENDER_TYPE_CANVAS) {
var a = r.getSprite().getTexture().getHtmlElementObj();
o.drawImage(a, 0, 0);
} else if (cc._renderType === cc.game.RENDER_TYPE_WEBGL) {
var s = gl.createFramebuffer();
gl.bindFramebuffer(gl.FRAMEBUFFER, s);
var c = r.getSprite().getTexture()._glID;
gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, c, 0);
var f = new Uint8Array(t * i * 4);
gl.readPixels(0, 0, t, i, gl.RGBA, gl.UNSIGNED_BYTE, f);
gl.bindFramebuffer(gl.FRAMEBUFFER, null);
for (var h = 4 * t, l = 0; l < i; l++) {
var d = i - 1 - l, u = new Uint8ClampedArray(f.buffer, d * t * 4, h), p = new ImageData(u, t, 1);
o.putImageData(p, 0, l);
}
}
cc.log("to share");
return n.toDataURL("image/png");
}
});
cc._RF.pop();
}, {
"../common/ThirdAPI": "ThirdApi",
LoadAtlas: "LoadAtlas"
} ],
UITitle: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "9a2e31K6eJJqZ0x+7kyGj7s", "UITitle");
var a = e("../common/ThirdAPI");
e("LoadAtlas");
cc.Class({
extends: cc.Component,
properties: {
content: {
default: null,
type: cc.Node
},
buttonClose: {
default: null,
type: cc.Node
},
titleitemPrefab: {
default: null,
type: cc.Prefab
},
labelComplete: {
default: null,
type: cc.Label
},
arrItems: [],
itemHeight: 100
},
onLoad: function() {
this.buttonClose.on("click", this.onClose, this);
this.initStoreList();
},
initData: function() {
this.initStore();
},
initStore: function() {
for (var e = 0; e < Global.titleUnlockData.length; e++) {
var t = Global.titleUnlockData[e];
this.arrItems[t].getComponent("TitleItem").setUnlock();
}
Global.titleUnlockData.length > Global.titleData.length && Global.uiScript.startUI.getComponent("startUI").showRedDot(!0);
for (var i = 0; i < Global.titleData.length; i++) {
t = Global.titleData[i];
this.arrItems[t].getComponent("TitleItem").setIsHave();
this.arrItems[t].getComponent("TitleItem").setDate(Global.titleDateData[i]);
}
this.updateLabelComplete();
},
initStoreList: function() {
var e = [];
e.push({
type: 1,
name: "分数小白",
description: "单局得分达到",
price: 2e3,
reward: 2
});
e.push({
type: 1,
name: "分数菜鸟",
description: "单局得分达到",
price: 5e3,
reward: 4
});
e.push({
type: 1,
name: "分数达人",
description: "单局得分达到",
price: 8e3,
reward: 8
});
e.push({
type: 1,
name: "分数高手",
description: "单局得分达到",
price: 1e4,
reward: 16
});
e.push({
type: 1,
name: "分数大师",
description: "单局得分达到",
price: 15e3,
reward: 32
});
e.push({
type: 1,
name: "分数王者",
description: "单局得分达到",
price: 2e4,
reward: 64
});
e.push({
type: 2,
name: "皮肤小白",
description: "皮肤解锁达到",
price: 1,
reward: 1
});
e.push({
type: 2,
name: "皮肤菜鸟",
description: "皮肤解锁达到",
price: 3,
reward: 5
});
e.push({
type: 2,
name: "皮肤达人",
description: "皮肤解锁达到",
price: 8,
reward: 8
});
e.push({
type: 2,
name: "皮肤高手",
description: "皮肤解锁达到",
price: 10,
reward: 10
});
e.push({
type: 2,
name: "皮肤大师",
description: "皮肤解锁达到",
price: 15,
reward: 18
});
e.push({
type: 2,
name: "皮肤王者",
description: "皮肤解锁达到",
price: 20,
reward: 20
});
e.push({
type: 3,
name: "成就小白",
description: "成就解锁达到",
price: 1,
reward: 5
});
e.push({
type: 3,
name: "成就达人",
description: "成就解锁达到",
price: 5,
reward: 10
});
e.push({
type: 3,
name: "成就王者",
description: "成就解锁达到",
price: 15,
reward: 20
});
for (var t = 0; t < e.length; t++) {
var i = cc.instantiate(this.titleitemPrefab);
i.getComponent("TitleItem").setTitle(e[t].name);
i.getComponent("TitleItem").setTitleType(e[t].type);
i.getComponent("TitleItem").setDescription(e[t].description + e[t].price);
i.getComponent("TitleItem").setPrice(e[t].price);
i.getComponent("TitleItem").setReward(e[t].reward);
i.getComponent("TitleItem").index = t;
i.setPosition(0, -1 * (t + .5) * this.itemHeight);
this.content.addChild(i);
this.arrItems.push(i);
}
this.content.height = e.length * this.itemHeight;
},
updateLabelComplete: function() {
this.labelComplete.string = "完成数量" + Global.titleData.length + "/" + this.arrItems.length;
},
updateItemsState: function(e) {
for (var t = this.arrItems, i = 0, r = 0; r < t.length; r++) if (t[r].getComponent("TitleItem").updateState(e)) {
i++;
for (var n = !1, o = 0; o < Global.titleUnlockData.length; o++) if (r == Global.titleUnlockData[o]) {
n = !0;
break;
}
if (!n) {
Global.titleUnlockData.push(r);
a.saveInfo("title-unlock", Global.titleUnlockData);
}
}
0 < i ? Global.uiScript.startUI.getComponent("startUI").showRedDot(!0) : Global.uiScript.startUI.getComponent("startUI").showRedDot(!1);
},
onClose: function() {
Global.game.playSound("btn", .1);
this.node.parent && this.node.parent.removeChild(this.node);
}
});
cc._RF.pop();
}, {
"../common/ThirdAPI": "ThirdApi",
LoadAtlas: "LoadAtlas"
} ],
Util: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "641846o4KVCK5oWC2G3TGjc", "Util");
tywx.Util = {
createUUID: function() {
for (var e = [], t = "0123456789abcdef", i = 0; i < 36; i++) e[i] = t.substr(Math.floor(16 * Math.random()), 1);
e[14] = "4";
e[19] = t.substr(3 & e[19] | 8, 1);
e[8] = e[13] = e[18] = e[23] = "";
return e.join("");
},
getLocalUUID: function() {
var e = tywx.Util.getItemFromLocalStorage("LOCAL_UUID_KEY", "");
if (!e) {
e = tywx.Util.createUUID();
tywx.Util.setItemToLocalStorage("LOCAL_UUID_KEY", e);
}
return e;
},
getItemFromLocalStorage: function(e, t) {
if (!cc.sys.localStorage.getItem) return def_value;
var i = cc.sys.localStorage.getItem(e);
return i ? String(i) : t;
},
setItemToLocalStorage: function(e, t) {
try {
cc.sys.localStorage.setItem(e, t + "");
} catch (e) {
tywx.LOGE("tywx.Util", "setItemToLocalStorage fail");
}
}
};
cc._RF.pop();
}, {} ],
battleRoot: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "481f1mhoLRAd5RWbtwlzHVf", "battleRoot");
cc.Class({
extends: cc.Component,
properties: {
battle: {
default: null,
type: cc.Node
},
bg: {
default: null,
type: cc.Sprite
}
},
enterBattle: function() {}
});
cc._RF.pop();
}, {} ],
chooseNum: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "0131ek9+YdCY7cDr+bbqAsq", "chooseNum");
cc.Class({
extends: cc.Component,
properties: {
gridControllerScript: null
},
start: function() {
this.gridControllerScript = Global.gridController.getComponent("gridController");
},
choose2: function() {
this.gridControllerScript.randomScore = 2;
this.gridControllerScript.createItem2();
this.gridControllerScript.hideChooseNum();
},
choose4: function() {
this.gridControllerScript.randomScore = 4;
this.gridControllerScript.createItem2();
this.gridControllerScript.hideChooseNum();
},
choose8: function() {
this.gridControllerScript.randomScore = 8;
this.gridControllerScript.createItem2();
this.gridControllerScript.hideChooseNum();
},
choose16: function() {
this.gridControllerScript.randomScore = 16;
this.gridControllerScript.createItem2();
this.gridControllerScript.hideChooseNum();
},
choose32: function() {
this.gridControllerScript.randomScore = 32;
this.gridControllerScript.createItem2();
this.gridControllerScript.hideChooseNum();
},
choose64: function() {
this.gridControllerScript.randomScore = 64;
this.gridControllerScript.createItem2();
this.gridControllerScript.hideChooseNum();
},
close: function() {
this.gridControllerScript.createItem2();
this.gridControllerScript.hideChooseNum();
}
});
cc._RF.pop();
}, {} ],
dataScript: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "191c8YcqW9NYql3hC0bgshx", "dataScript");
cc.Class({
extends: cc.Component,
start: function() {
Global.dataScript = this.node.getComponent("dataScript");
this.getScore();
},
getScore: function(e, t) {
if ("undefined" != typeof FBInstant) {
Global.fbname = FBInstant.player.getName();
Global.fbphoto = FBInstant.player.getPhoto();
FBInstant.getSDKVersion();
FBInstant.player.getDataAsync([ "maxscore", "starnum" ]).then(function(e) {
"undefined" != typeof e.maxscore ? Global.fbScore = e.maxscore : Global.fbScore = 0;
Global.startUI && Global.startUI.updateBestScore();
});
}
},
saveScore: function(t) {
if ("undefined" != typeof FBInstant && t > Global.fbScore) {
FBInstant.player.setDataAsync({
maxscore: t
}).then(function() {
Global.fbScore = maxscore;
});
var i = Global.fbname + "_" + Global.fbphoto;
FBInstant.getLeaderboardAsync("my_allrank").then(function(e) {
return e.setScoreAsync(t, i);
}).then(function(e) {}).catch(function(e) {
Global.game.addLogStr(e);
});
}
}
});
cc._RF.pop();
}, {} ],
fbAPI: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "60e89uyP71OPbI1HG8KK8DV", "fbAPI");
var r = {
fbname: "noname",
fbphoto: null,
fbScore: 0,
crystal: 0,
debugText: "FB api loaded",
getFBScore: function(t) {
r.debugText = "called getFBScore() ";
if ("undefined" != typeof FBInstant) {
r.fbname = FBInstant.player.getName();
r.fbphoto = FBInstant.player.getPhoto();
r.debugText = "try get score from fb ";
FBInstant.player.getDataAsync([ "maxscore" ]).then(function(e) {
r.fbScore = e.maxscore || 0;
r.crystal = e.crystal || 0;
t && t(r.fbScore, r.crystal);
r.debugText = " get score from fb :" + r.fbScore + " crystal:" + r.crystal;
}).catch(function(e) {
r.debugText = " getDataAsysnc error\n code:" + e.code + "\n msg: " + e.message;
});
}
},
saveFBScore: function(t, e) {
r.debugText = "called saveFBScore() ";
if (t) {
if (!r.fbScore) {
r.debugText = "FBGlobal.fbScore not exists,return";
r.fbScore = 0;
}
t = parseInt(t);
r.debugText = "saveFBScore :" + t;
if ("undefined" != typeof FBInstant) if (t > r.fbScore) {
r.debugText = "try save score to fb :" + t;
FBInstant.player.setDataAsync({
maxscore: t,
crystal: e
}).then(function() {
r.fbScore = t;
r.debugText = " save score to fb player successed";
}).catch(function(e) {
r.debugText = " setDataAsync error\n code:" + e.code + "\n msg: " + e.message;
});
var i = r.fbname + "_" + r.fbphoto;
FBInstant.getLeaderboardAsync("my_linerank").then(function(e) {
r.debugText = " save score to fb successed on setScoreAsync";
return e.setScoreAsync(t, i);
}).then(function(e) {
r.debugText = " save score to fb successed get entry";
}).catch(function(e) {
r.debugText = " save score to fb rank error setScoreAsync\n code:" + e.code + "\n msg: " + e.message;
});
} else r.debugText = "not saved ,old highscore is :" + r.fbScore;
} else r.debugText = "params maxScore not exists,return";
},
getRank: function(t) {
r.debugText = "called getRank()";
if ("undefined" != typeof FBInstant) {
r.debugText = "try get fb rank";
FBInstant.getLeaderboardAsync("my_linerank").then(function(e) {
r.debugText = " get fb rank leaderboard";
return e.getEntriesAsync();
}).then(function(e) {
r.debugText = e ? " get fb rank entries :" + e.length : " no entries ";
t && t(e);
}).catch(function(e) {
r.debugText = "getLeaderboardAsync error\n code:" + e.code + "\n msg:" + e.message;
});
}
},
onShareGame: function(e) {
r.debugText = "called onShareGame()";
if (e) {
r.debugText = "get screenshot :" + e.length;
"undefined" != typeof FBInstant && FBInstant.shareAsync({
intent: "SHARE",
image: e,
text: "Look my score!",
data: {
myReplayData: "..."
}
}).then(function() {}).catch(function(e) {
r.debugText = " shareAsync error\n code:" + e.code + "\n msg: " + e.message;
});
}
},
onChallenge: function(e) {
r.debugText = "called onChallenge()";
if (e) {
r.debugText = "get screenshot :" + e.length;
"undefined" != typeof FBInstant && FBInstant.shareAsync({
intent: "INVITE",
image: e,
text: "I just challenged Watermelon ,Join me!",
data: {
myReplayData: "..."
}
}).then(function() {}).catch(function(e) {
r.debugText = " challenge shareAsync\n code:" + e.code + "\n msg: " + e.message;
});
}
}
};
t.exports = r;
cc._RF.pop();
}, {} ],
flyGold: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "3e754b7ty1Lnr0FUnSfrDyx", "flyGold");
cc.Class({
extends: cc.Component,
properties: {
num: 0,
Sprite: {
default: null,
type: cc.Sprite
}
},
start: function() {},
toPosition: function(e, t) {
this.num = t;
this.node.stopAllActions();
var i = cc.callFunc(this.finished, this), r = cc.spawn(cc.moveTo(.5, cc.p(e.x, e.y)), cc.rotateBy(.5, 0)), n = cc.scaleTo(.3, 2, 2), o = cc.callFunc(this.updateGold, this), a = cc.sequence(r, n, o, i);
this.node.runAction(a);
this.node.setLocalZOrder(10);
},
finished: function() {
this.node.stopAllActions();
this.node.parent.removeChild(this.node);
this.node.destroy();
Global.gridController.getComponent("gridController").updateGold(this.num);
}
});
cc._RF.pop();
}, {} ],
flyNum: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "13c8bLoIxNJd6hxiaJl5vN4", "flyNum");
cc.Class({
extends: cc.Component,
properties: {
num: 0,
numlabel: {
default: null,
type: cc.Label
}
},
start: function() {},
toPosition: function(e) {
this.node.getPosition();
this.node.stopAllActions();
this.node.setScale(.5, .5);
var t = cc.scaleTo(.3, 1, 1);
this.node.runAction(t);
var i = cc.callFunc(this.finished, this), r = cc.moveTo(.5, cc.p(this.node.getPosition().x, this.node.getPosition().y + 150)), n = cc.sequence(r, i);
this.node.runAction(n);
this.node.setLocalZOrder(1e4);
},
setNum: function(e) {
this.num = e;
var t = "";
1 < Global.combineTimes && (t = "x" + Global.combineTimes);
this.numlabel.string = e + "" + t;
},
finished: function() {
this.node.stopAllActions();
this.node.parent.removeChild(this.node);
this.node.destroy();
}
});
cc._RF.pop();
}, {} ],
getGemStone: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "95e7etjvnFMRpbdKhlci8VP", "getGemStone");
cc.Class({
extends: cc.Component,
properties: {
canGetReward: !0
},
onLoad: function() {
this.canGetReward = !0;
},
onBtnClick: function() {
console.log("this.canGetReward:", this.canGetReward);
if (this.canGetReward) {
this.canGetReward = !1;
console.log("canFly");
console.log(Global.startUI.goldNode.getPosition());
var e = Global.startUI.goldNode.getPosition();
this.toPosition([ e.x, e.y ]);
} else console.log("onBtnClick");
},
toPosition: function(e) {
console.log("getStone toPosition");
this.node.stopAllActions();
var t = cc.callFunc(this.finished, this), i = cc.spawn(cc.moveTo(.5, cc.p(e[0], e[1])), cc.rotateBy(.5, 0)), r = cc.scaleTo(.3, 2, 2), n = cc.sequence(i, r, t);
this.node.runAction(n);
this.node.setLocalZOrder(1);
},
finished: function() {
this.node.stopAllActions();
this.node.parent.removeChild(this.node);
this.node.destroy();
Global.startUI.updateGold(1);
}
});
cc._RF.pop();
}, {} ],
gridController: [ function(a, e, t) {
"use strict";
cc._RF.push(e, "1ba5537UdpN/4pRkFoExyPm", "gridController");
var s = a("../common/ThirdAPI");
cc.Class({
extends: cc.Component,
properties: {
handLine1: {
default: null,
type: cc.Node
},
handLine2: {
default: null,
type: cc.Node
},
gridPrefab: {
default: null,
type: cc.Prefab
},
pauseNode: {
default: null,
type: cc.Node
},
chooseNode: {
default: null,
type: cc.Node
},
test_btnNode: {
default: null,
type: cc.Node
},
itemPrefab: {
default: null,
type: cc.Prefab
},
randomScore: 0,
soonGridNum: {
default: null,
type: cc.Prefab
},
soonGridInstance: null,
startX: 0,
startY: 0,
allGrids: [],
bornGrid: null,
startTouchPosition: null,
deleteGrids: [],
joinGrids: [],
targetGrid: {
default: null,
type: cc.Node
},
line: {
default: null,
type: cc.Sprite
},
goldNode: {
default: null,
type: cc.Node
},
prop: {
default: null,
type: cc.Node
},
nodesGroup: {
default: null,
type: cc.Node
},
fitOffsetY: 0,
propClearTime: 0,
score: {
default: null,
type: cc.Node
},
downGrids: [],
scoreScript: null,
isClickBomming: !1,
clickGridNum: 0,
createItemIndex: 0,
moveItemIndex: 0,
startTime: 0,
addTimes: 0
},
initGridData: function() {
var e = cc.winSize.width / cc.winSize.height <= .56;
this.fitOffsetY = 0;
if (e) {
this.fitOffsetY = 40;
this.nodesGroup.setPosition(0, -this.fitOffsetY);
this.nodesGroup.getComponent(cc.Widget).top = this.fitOffsetY;
}
var t = Global.hNum * Global.itemSize + (Global.hNum - 1) * Global.itemSplit, i = Global.vNum * Global.itemSize + (Global.vNum - 1) * Global.itemSplit;
this.startX = -Global.screenWidth / 2 + (Global.screenWidth - t) / 2 + Global.itemSize / 2;
this.startY = -Global.screenHeight / 2 + Global.paddingButtom + i - Global.itemSize + 30 - this.fitOffsetY;
this.scoreScript = this.score.getComponent("score");
this.setHandWidthAndHeight();
this.reset();
this.createAllGrid();
this.setTouchControl();
this.process();
this.updateGold();
this.setLine(t, i);
this.pauseNode.active = !1;
this.chooseNode.active = !1;
this.test_btnNode.active = Global.canTest;
if (Global.canTest) {
this.test_btnNode.getChildByName("Label").getComponent(cc.Label).string = "测试 " + (Global.testEnabled ? "开" : "关");
}
},
setHandWidthAndHeight: function() {
var e = cc.find("Canvas");
this.handLine1.width = .5 * e.width;
this.handLine2.width = .5 * e.width;
},
setLine: function(e, t) {
this.line.node.width = e + 20;
this.line.node.height = t + 20;
var i = t / 2 - this.startY - Global.itemSize / 2;
this.line.node.setPosition(cc.p(0, -i));
},
process: function() {
this.down();
this.checkGridJoin();
},
down: function() {
this.isDown = !1;
this.downGrids = [];
for (var e = 0; e < Global.hNum; e++) for (var t = 0; t < Global.vNum; t++) this.resetItemAction(e, t, !1) && (this.isDown = !0);
this.bornGrid && 0 < this.bornGrid.getComponent("itemView").curState && (this.isDown = !0);
},
checkGridJoin: function() {
for (var e = this, t = 0, i = 0; i < this.downGrids.length; i++) {
0 < this.downGrids[i].curState && t++;
}
null != this.bornGrid && 0 < this.bornGrid.getComponent("itemView").curState && t++;
null != this.bornGrid && 0 != this.bornGrid.getComponent("itemView").curState || 0 != t ? this.node.runAction(cc.sequence(cc.delayTime(.5), cc.callFunc(function() {
e.checkGridJoin();
}))) : this.gridJoin();
},
gridJoin: function() {
var e = this;
if (0 < e.clickGridNum) {
e.process();
e.clickGridNum = 0;
} else {
e.clearAllJoin();
for (var t = !1, i = 0; i < Global.hNum; i++) for (var r = 0; r < Global.vNum; r++) {
var n = e.allGrids[i][r].getComponent("gridView");
(!e.findDownNum() || e.findDownNum() && n.isDown) && n.startBianli() && (t = !0);
}
if (t) {
Global.combineTimes++;
console.log("要开始合并啦,combineTimes:" + Global.combineTimes);
this.checkJoin();
} else {
if (null != e.allGrids[Global.bornXgridNum][0].getComponent("gridView").item && !e.isDown) {
var o = this;
o.node.runAction(cc.sequence(cc.delayTime(.5), cc.callFunc(function() {
o.gameOver();
})));
return;
}
if (e.isDown) e.process(); else {
Global.combineTimes = 0;
e.bornGrid = null;
e.createItem();
}
}
}
},
checkJoin: function() {
var r = this;
r.node.runAction(cc.sequence(cc.delayTime(.1), cc.callFunc(function() {
for (var e = !1, t = 0; t < Global.hNum; t++) for (var i = 0; i < Global.vNum; i++) {
if (r.allGrids[t][i].getComponent("gridView").actionJoin) {
e = !0;
break;
}
}
e ? r.checkJoin() : r.joinComplete();
})));
},
joinComplete: function() {
null != this.allGrids[Global.bornXgridNum][0].getComponent("gridView").item && (this.isDown = !0);
this.gridJoin();
},
findDownNum: function() {
for (var e = 0; e < Global.hNum; e++) for (var t = 0; t < Global.vNum; t++) {
if (this.allGrids[e][t].getComponent("gridView").isDown) return !0;
}
return !1;
},
clearAllJoin: function() {
for (var e = 0; e < Global.hNum; e++) for (var t = 0; t < Global.vNum; t++) {
this.allGrids[e][t].getComponent("gridView").isJoin = !1;
}
},
createItem: function() {
var e = a("myUtil");
0 == this.randomScore && (this.randomScore = e.randomForArray(Global.gridRandomScores));
Global.testEnabled ? this.showChooseNum() : this.createItem2();
},
createItem2: function() {
var e = cc.instantiate(this.itemPrefab);
e.setPosition(cc.p(this.allGrids[Global.bornXgridNum][0].getPosition().x, this.allGrids[Global.bornXgridNum][0].getPosition().y + Global.itemSize));
e.getComponent("itemView").initData(this.randomScore, !1);
this.node.addChild(e);
this.bornGrid = e;
var t = Global.gridDownSpeed, i = this.getStopPosition(Global.bornXgridNum, 0), r = this.allGrids[Global.bornXgridNum][i];
this.bornGrid.getComponent("itemView").targetGrid = r;
e.getComponent("itemView").startDownForBorn(t);
this.setSoonGrid();
this.process();
this.createItemIndex++;
},
setSoonGrid: function() {
var e = a("myUtil"), t = Global.gridRandomScores.concat(Global.joinRandomScores);
this.randomScore = e.randomForArray(t);
if (!this.soonGridInstance || this.soonGridInstance && !this.soonGridInstance.parent) {
this.soonGridInstance = cc.instantiate(this.soonGridNum);
this.node.addChild(this.soonGridInstance);
}
this.soonGridInstance.setPosition(0, 420 - this.fitOffsetY);
this.soonGridInstance.getComponent("itemView").initData(this.randomScore, !0);
},
testEnabled: function() {
Global.testEnabled = !Global.testEnabled;
var e = this.node.getChildByName("test_btn");
if (e) {
e.getChildByName("Label").getComponent(cc.Label).string = "测试 " + (Global.testEnabled ? "开" : "关");
}
},
closeListen: function() {
this.node.off(cc.Node.EventType.TOUCH_START, this.nodeStart, this);
this.node.off(cc.Node.EventType.TOUCH_MOVE, this.nodeMove, this);
},
createAllGrid: function() {
for (var e = 0; e < Global.hNum; e++) for (var t = 0; t < Global.vNum; t++) {
var i = {
hIndex: e,
vIndex: t
};
this.allGrids[e] || (this.allGrids[e] = []);
this.allGrids[e][t] = this.createGrid(i);
}
},
createGrid: function(e) {
var t = e.hIndex, i = e.vIndex, r = this.startX + t * Global.itemSize + t * Global.itemSplit, n = this.startY - i * Global.itemSize - i * Global.itemSplit, o = cc.instantiate(this.gridPrefab);
o.setPosition(cc.p(r, n));
o.setLocalZOrder(2e4);
var a = o.getComponent("gridView");
a.node.setPosition(r, n);
a.setIndex(t, i, this);
this.node.addChild(o);
return o;
},
itemClick: function(e) {
if (this.isClickBomming && !(1 <= this.clickGridNum)) {
var t = e.getUserData();
this.clickGrid = t;
this.prop.stopAllActions();
var i = cc.scaleTo(.1, 1, 1);
this.prop.runAction(i);
this.clickGrid.getComponent("gridView").item.getComponent("itemView").clearItemToRemove();
this.clickGrid.getComponent("gridView").item = null;
for (var r = this.clickGrid.getComponent("gridView").hIndex, n = this.clickGrid.getComponent("gridView").vIndex - 1; 0 < n; n--) this.resetItemAction(r, n, !0);
this.clickGridNum++;
this.isClickBomming = !1;
Global.wxGold -= Global.costGold;
if ("undefined" != typeof wx) {
var o = s.loadLocalScore(), a = parseInt(o.maxscore);
parseInt(o.gold);
s.loadScore(function(e, t) {
a = parseInt(e);
t = parseInt(t);
console.log("gridController on ThirdAPI loadScore", a, parseInt(t), Global.wxGold);
});
s.saveScore(a, Global.wxGold);
}
this.goldNode.getChildByName("label").getComponent(cc.Label).string = Global.wxGold;
}
},
clickProp: function() {
if (Global.wxGold < Global.costGold) console.log("my costGold is " + Global.costGold); else if (this.isClickBomming) this.resetProp(); else {
var e = cc.scaleBy(.4, 1.1, 1.1), t = cc.scaleBy(.4, 1 / 1.1, 1 / 1.1), i = cc.repeat(cc.sequence(e, t), 99999);
this.prop.stopAllActions();
this.prop.runAction(i);
this.isClickBomming = !0;
this.clickGridNum = 0;
}
},
resetProp: function() {
this.isClickBomming = !1;
this.prop.stopAllActions();
var e = cc.scaleTo(.1, 1, 1);
this.prop.runAction(e);
},
getStopPosition: function(e, t) {
for (var i = 0, r = Global.vNum - 1; 0 <= r; r--) {
var n = this.allGrids[e][r].getComponent("gridView");
n && null == n.item && n.vIndex > t && i++;
}
return i;
},
setTouchControl: function() {
if (this.node.parent) {
this.node.on(cc.Node.EventType.TOUCH_START, this.nodeStart, this);
this.node.on(cc.Node.EventType.TOUCH_MOVE, this.nodeMove, this);
}
},
nodeStart: function(e) {
this.startTouchPosition = e.getLocation();
this.moveItemIndex = this.createItemIndex;
this.moveStartX = Math.ceil(Math.abs((this.bornGrid.x - this.startX) / Global.itemSize));
},
nodeMove: function(e) {
if (this.moveItemIndex == this.createItemIndex) {
var t = this;
if (this.bornGrid && this.bornGrid.getComponent("itemView").canMove && !cc.game.isPaused() && !this.isClickBomming) {
var i = e.getLocation(), r = i.x - t.startTouchPosition.x, n = i.y - t.startTouchPosition.y, o = Math.round(r / Global.moveThreshold), a = Math.abs(n) > Global.moveDownThreshold, s = t.canMoveGrid(this.moveStartX + o);
if (a) {
var c = i.y <= t.startTouchPosition.y;
if (s = t.canMoveQuickDown(c)) {
this.bornGrid.x = s.getPosition().x;
var f = t.getStopPosition(s.getComponent("gridView").hIndex, s.getComponent("gridView").vIndex), h = t.allGrids[s.getComponent("gridView").hIndex][s.getComponent("gridView").vIndex + f];
t.allGrids[s.getComponent("gridView").hIndex][s.getComponent("gridView").vIndex].getComponent("gridView").isDown = !1;
h.getComponent("gridView").isDown = !0;
this.bornGrid.getComponent("itemView").targetGrid = h;
cc.log("quick down:" + f);
2 != this.bornGrid.getComponent("itemView").curState && 1 != this.bornGrid.getComponent("itemView").curState || (t.maxDownTime = this.bornGrid.getComponent("itemView").startQuickDownForBorn(Global.gridQuickDownSpeed));
t.node.stopAllActions();
t.checkGridJoin();
}
} else if (s) {
this.bornGrid.x = s.getPosition().x;
cc.log("change bornGridx:" + this.bornGrid.x);
f = t.getStopPosition(s.getComponent("gridView").hIndex, s.getComponent("gridView").vIndex), 
h = t.allGrids[s.getComponent("gridView").hIndex][s.getComponent("gridView").vIndex + f];
t.allGrids[s.getComponent("gridView").hIndex][s.getComponent("gridView").vIndex].getComponent("gridView").isDown = !1;
h.getComponent("gridView").isDown = !0;
this.bornGrid.getComponent("itemView").targetGrid = h;
this.bornGrid.getComponent("itemView").changeStateToWaitDown(Global.gridDownSpeed);
t.node.stopAllActions();
t.checkGridJoin();
}
}
}
},
canMoveGrid: function(e) {
var t = Math.ceil(Math.abs((this.bornGrid.x - this.startX) / Global.itemSize)), i = Math.ceil(Math.abs((this.bornGrid.y - this.startY) / Global.itemSize));
if (e == t) return null;
if (e < 0 || e >= Global.hNum) return null;
var r = e + 1, n = t - 1;
if (t < e) {
r = t + 1;
n = e - 1;
}
for (;r <= n; ) {
var o;
if (!(o = this.allGrids[r][i]) || null != o.getComponent("gridView").item) return null;
r++;
}
return (o = this.allGrids[e][i]) && null == o.getComponent("gridView").item ? o : null;
},
canMoveQuickDown: function(e) {
var t = Math.ceil(Math.abs((this.bornGrid.x - this.startX) / Global.itemSize)), i = Math.ceil(Math.abs((this.bornGrid.y - this.startY) / Global.itemSize));
if (!e) return null;
if (i >= Global.vNum - 1) return null;
var r = this.allGrids[t][i + 1];
return r && null == r.getComponent("gridView").item ? r : null;
},
resetItemAction: function(e, t, i) {
var r, n = this.allGrids[e][t].getComponent("gridView");
if (null == n.item) return !1;
if (0 == (r = i ? 1 : this.getStopPosition(e, t))) return !1;
var o = this.allGrids[e][t + r];
o.getComponent("gridView").isDown = !0;
var a = n.item.getComponent("itemView");
a.targetGrid = o;
var s = this.isDown || 0 < Global.combineTimes ? Global.gridCombineDownSpeed : Global.gridDownSpeed;
console.log("速度：" + s, Global.combineTimes);
a.startDownForBorn(s);
n.item = null;
n.gridNum = 0;
this.downGrids.push(a);
return !0;
},
onPauseOrResume: function() {
Global.game.playSound("btn", .1);
if (Global.isPaused) {
this.bornGrid && this.bornGrid.resumeAllActions();
this.node.resumeAllActions();
this.pauseNode.active = !1;
} else {
this.isClickBomming && this.resetProp();
this.bornGrid && this.bornGrid.pauseAllActions();
this.node.pauseAllActions();
Global.isPaused = !0;
this.pauseNode.active = !0;
this.pauseNode.setLocalZOrder(10);
}
},
showChooseNum: function() {
Global.game.playSound("btn", .1);
this.chooseNode.active = !0;
this.chooseNode.setLocalZOrder(1);
this.bornGrid && this.bornGrid.pauseAllActions();
this.node.pauseAllActions();
},
hideChooseNum: function() {
Global.game.playSound("btn", .1);
this.chooseNode.active = !1;
this.bornGrid && this.bornGrid.resumeAllActions();
this.node.resumeAllActions();
},
onRestart: function() {
Global.game.playSound("btn", .1);
this.closeListen();
this.reset();
this.bornGrid && this.bornGrid.parent && this.bornGrid.parent.removeChild(this.bornGrid);
Global.game.restart();
},
onMainScene: function() {
Global.game.playSound("btn", .1);
this.closeListen();
this.reset();
this.bornGrid && this.bornGrid.parent && this.bornGrid.parent.removeChild(this.bornGrid);
Global.game.startGame();
cc.game.isPaused() && cc.game.resume();
},
onShareGame: function() {
Global.game.playSound("btn", .1);
"undefined" != typeof FBInstant ? s.shareGame(this.getImgBase64(), null) : s.shareGame("screenshotForDown", null, null, "003");
},
updateGold: function(e) {
this.goldNode.getChildByName("label").getComponent(cc.Label).string = Global.wxGold;
if (void 0 !== Global.addGold[e]) {
if (!(parseInt(Global.addGold[e]) <= 0)) {
Global.wxGold += parseInt(Global.addGold[e]);
console.log("1 :" + Global.addGold[e] + "goldNum :" + e);
if ("undefined" != typeof wx) {
var t = s.loadLocalScore(), i = parseInt(t.maxscore);
parseInt(t.gold);
s.loadScore(function(e, t) {
i = parseInt(e);
t = parseInt(t);
console.log("gridController on ThirdAPI loadScore", i, parseInt(t), Global.wxGold);
});
s.saveScore(i, Global.wxGold);
}
this.goldNode.getChildByName("label").getComponent(cc.Label).string = Global.wxGold;
}
} else cc.log("update gold ");
},
gameOver: function() {
this.node.stopAllActions();
this.closeListen();
Global.reviveShareTimes = s.loadReviveData();
if (Global.reviveTimes < Global.reviveTotalTimes && 0 < Global.reviveShareTimes) {
Global.game.showRevive();
Global.reviveUI.setScore(this.scoreScript.scoreNum);
} else {
Global.game.showShareUI();
Global.shareUI.updateMaxLabel(this.scoreScript.scoreNum);
}
},
clearGridForRevive: function() {
this.node.stopAllActions();
for (var e = 0; e < Global.hNum; e++) for (var t = 0; t < Global.vNum; t++) {
if ((o = this.allGrids[e][t].getComponent("gridView")) && null != o.item) {
o.node.stopAllActions();
o.item.getComponent("itemView").node.stopAllActions();
}
}
for (var i = 0, r = 0; r < Global.hNum; r++) for (var n = 0; n < Global.clearVNum; n++) {
var o;
if ((o = this.allGrids[r][n].getComponent("gridView")) && null != o.item) {
var a = o.item.getComponent("itemView").toRevive();
i < a && (i = a);
o.gridNum = 0;
o.item = null;
}
}
this.clearAllJoin();
for (var s = 0; s < Global.flyNumPools.length; s++) {
var c = Global.flyNumPools[s];
c && c.parent && c.getComponent("flynum").finished();
}
console.log("clear time:" + i);
var f = this;
f.node.runAction(cc.sequence(cc.delayTime(i + .1), cc.callFunc(function() {
if (f.bornGrid) {
f.bornGrid.stopAllActions();
f.bornGrid.parent && f.bornGrid.parent.removeChild(f.bornGrid);
}
f.bornGrid = null;
f.setTouchControl();
f.process();
})));
},
update: function() {
if (new Date().getTime() > this.startTime + Global.accessTime && this.addTimes < Global.addTimes) {
this.addTimes++;
this.startTime = new Date().getTime();
Global.gridDownSpeed *= 1.2;
Global.gridDownSpeed = parseInt(100 * Global.gridDownSpeed) / 100;
Global.waitToDown *= .8;
Global.waitToDown = parseInt(100 * Global.waitToDown) / 100;
console.log("加速", Global.gridDownSpeed, Global.waitToDown);
}
},
reset: function() {
this.node.stopAllActions();
this.startTime = new Date().getTime();
this.addTimes = 0;
Global.reviveTimes = 0;
Global.combineTimes = 0;
Global.testEnabled = !1;
this.randomScore = 0;
Global.joinRandomScores = [];
Global.isPaused = !1;
this.isClickBomming = !1;
this.propClearTime = 0;
this.clickGridNum = 0;
this.createItemIndex = 0;
for (var e = this.moveItemIndex = 0; e < Global.flyNumPools.length; e++) {
var t = Global.flyNumPools[e];
t && t.parent && t.getComponent("flynum").finished();
}
if (this.bornGrid) {
this.bornGrid.stopAllActions();
this.bornGrid.parent && this.bornGrid.parent.removeChild(this.bornGrid);
}
if (0 < this.allGrids.length) {
for (var i = 0; i < Global.hNum; i++) for (var r = 0; r < Global.vNum; r++) {
var n = this.allGrids[i][r], o = n.getComponent("gridView");
n.stopAllActions();
o && null != o.item && o.item.getComponent("itemView").toRemove();
n.parent && n.parent.removeChild(n);
}
this.clearAllJoin();
}
this.allGrids = [];
this.scoreScript.reset();
this.bornGrid = null;
this.soonGridInstance && this.soonGridInstance.parent && this.soonGridInstance.parent.removeChild(this.soonGridInstance);
a("myUtil").randomForWeight(Global.weightScores);
}
});
cc._RF.pop();
}, {
"../common/ThirdAPI": "ThirdApi",
myUtil: "myUtil"
} ],
gridView: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "2512d9CR5dPU5PDcD210m/E", "gridView");
cc.Class({
extends: cc.Component,
properties: {
combineAudio: {
url: cc.AudioClip,
default: null
},
numPrefab: {
default: null,
type: cc.Prefab
},
goldPrefab: {
default: null,
type: cc.Prefab
},
combineID: 0,
allGrids: null,
hIndex: 0,
vIndex: 0,
item: null,
gridNum: 0,
targetGrid: {
default: null,
type: cc.Node
},
isDown: !1,
moveIndex: 0,
sameScoreNum: 0,
deleteGrids: [],
isJoin: !1,
actionJoin: !1,
joinItems: []
},
setIndex: function(e, t, i) {
this.hIndex = e;
this.vIndex = t;
},
startBianli: function() {
this.joinItems = [];
var e = Global.gridController.getComponent("gridController");
this.allGrids = e.allGrids;
this.deleteGrids = [];
this.bianliForGrid();
this.startJoin();
this.isDown = !1;
return 0 < this.joinItems.length;
},
changeScore: function() {
var e = this, t = Global.gridController.getComponent("gridController");
e.isDown = !1;
if (0 < e.deleteGrids.length) {
1 == e.deleteGrids.length ? e.gridNum *= 2 : 2 == e.deleteGrids.length ? e.gridNum *= 4 : 3 == e.deleteGrids.length && (e.gridNum *= 8);
console.log("连击之前的分数：" + e.gridNum);
var i = 0;
if (0 < Global.combineTimes) {
3 < Global.combineTimes && (Global.combineTimes = 3);
i = (Global.combineTimes - 1) * e.gridNum;
console.log("连击加的分数：" + i);
}
console.log("连击之后的分数：" + (e.gridNum + i));
4096 < e.gridNum && (e.gridNum = 4096);
console.log("deleteGrids:" + e.deleteGrids.length);
console.log("addScore", e.gridNum);
t.scoreScript.addScore(e.gridNum + i);
console.log("addScore end,self.item:", e.item);
if (e.item) {
var r = e.item.getComponent("itemView");
r.bornNum = e.gridNum;
console.log("updateNum");
r.updateNum();
console.log("updateColor");
r.updateColor();
console.log("playFlyNum");
e.playFlyNum();
console.log("playFlyGold");
e.playFlyGold();
console.log("updateGold");
}
}
},
playFlyNum: function() {
if (!(Global.canFlyNums.indexOf(parseInt(this.gridNum)) <= -1)) {
this.numInstance = cc.instantiate(this.numPrefab);
this.numInstance.getComponent("flyNum").setNum(this.gridNum);
this.numInstance.setPosition(cc.p(this.node.getPosition().x, this.node.getPosition().y));
this.node.parent.addChild(this.numInstance);
this.numInstance.getComponent("flyNum").toPosition(-300);
}
},
playFlyGold: function() {
if (!(Global.canFlyGolds.indexOf(parseInt(this.gridNum)) <= -1)) {
this.goldInstance = cc.instantiate(this.goldPrefab);
this.goldInstance.setPosition(cc.p(this.node.getPosition().x, this.node.getPosition().y));
this.node.parent.addChild(this.goldInstance);
var e = Global.gridController.getComponent("gridController");
this.goldInstance.getComponent("flyGold").toPosition(e.goldNode.getPosition(), this.gridNum);
}
},
bianliForGrid: function() {
var e = this.node.getComponent("gridView"), t = e.hIndex, i = e.vIndex;
this.hasSameScore(t - 1, i);
this.hasSameScore(t + 1, i);
this.hasSameScore(t, i - 1);
this.hasSameScore(t, i + 1);
},
hasSameScore: function(e, t) {
if (!(e < 0 || e >= Global.hNum || t < 0 || t >= Global.vNum || e == this.hIndex && t == this.vIndex)) {
var i = this.allGrids[e][t];
if (!(-1 < this.deleteGrids.indexOf(i))) {
var r = i.getComponent("gridView");
if (!(i && null == r.item || r.gridNum > Global.gridMaxScore || r.isJoin)) {
var n = this.node.getComponent("gridView");
if (r.gridNum == n.gridNum) {
this.deleteGrids.push(i);
r.isDown = !1;
this.bianliForGrid(i);
r.isJoin = !0;
}
}
}
}
},
startJoin: function() {
if (this.deleteGrids.length <= 0) return 0;
this.joinItems = [];
for (var e = 0; e < this.deleteGrids.length; e++) {
var t = this.deleteGrids[e].getComponent("gridView"), i = t.item;
this.joinItems.push(t.item);
i.toJoin(this.node.getPosition());
console.log("删除item：" + t.gridNum, t.hIndex, t.vIndex);
t.item = null;
t.resetData();
}
this.actionJoin = !0;
this.check();
},
check: function() {
var e = this;
this.node.runAction(cc.sequence(cc.delayTime(.01), cc.callFunc(function() {
e.checkJoinComplete();
})));
},
checkJoinComplete: function() {
for (var e = !0, t = 0; t < this.joinItems.length; t++) {
if (0 < this.joinItems[t].curState) {
e = !1;
break;
}
}
if (e) {
this.changeScore();
this.actionJoin = !1;
this.playCombineAudio();
} else this.check();
},
playCombineAudio: function() {
cc.log("play audio");
if (Global.isBGMPlaying && null != this.combineAudio) {
this.combineID = cc.audioEngine.play(this.combineAudio, !1, 1);
var e = this;
0 < e.combineID && cc.audioEngine.setFinishCallback(e.combineID, function() {
e.playAudioEnd();
});
}
},
playAudioStart: function() {
0 != this.combineID && cc.audioEngine.resume(this.combineID);
},
playAudioEnd: function() {
cc.audioEngine.uncache(this.combineID);
},
resetData: function() {
this.gridNum = 0;
}
});
cc._RF.pop();
}, {} ],
httpUtils: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "3fa7e1gsoxN0pCi+r9YBk8P", "httpUtils");
cc.Class({
extends: cc.Component,
properties: {},
statics: {
instance: null
},
onLoad: function() {},
httpGets: function(e, t) {
var i = cc.loader.getXMLHttpRequest();
i.onreadystatechange = function() {
if (4 === i.readyState && 200 <= i.status && i.status < 300) {
var e = i.responseText;
t(e);
}
};
i.open("GET", e, !0);
cc.sys.isNative && i.setRequestHeader("Accept-Encoding", "gzip,deflate");
i.timeout = 5e3;
i.send();
},
httpPost: function(e, t, i) {
var r = cc.loader.getXMLHttpRequest();
r.onreadystatechange = function() {
cc.log("xhr.readyState=" + r.readyState + "  xhr.status=" + r.status);
if (4 === r.readyState && 200 <= r.status && r.status < 300) {
var e = r.responseText;
i(e);
} else i(-1);
};
r.open("POST", e, !0);
cc.sys.isNative && r.setRequestHeader("Accept-Encoding", "gzip,deflate");
r.timeout = 5e3;
r.send(t);
}
});
cc._RF.pop();
}, {} ],
itemSound: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "27471v/VpNJYrYVSq/9nJTi", "itemSound");
cc.Class({
extends: cc.Component,
properties: {
sound: {
default: null,
type: cc.AudioSource
}
},
start: function() {
var e = this;
this.node.runAction(cc.sequence(cc.delayTime(2), cc.callFunc(function() {
e.destoryThis();
})));
},
destoryThis: function() {
this.destroy();
this.node.parent.removeChild(this);
}
});
cc._RF.pop();
}, {} ],
itemView: [ function(a, e, t) {
"use strict";
cc._RF.push(e, "01c44mKWW1NGoVqCg7+8euj", "itemView");
cc.Class({
extends: cc.Component,
properties: {
itemSprite: {
default: null,
type: cc.Sprite
},
itemNum: {
default: null,
type: cc.Prefab
},
downAudio: {
url: cc.AudioClip,
default: null
},
num1: {
default: null,
type: cc.Sprite
},
num2: {
default: null,
type: cc.Sprite
},
num3: {
default: null,
type: cc.Sprite
},
num4: {
default: null,
type: cc.Sprite
},
numPrefab: {
default: null,
type: cc.Prefab
},
goldPrefab: {
default: null,
type: cc.Prefab
},
isSoonItem: !1,
bornNum: 0,
targetGrid: null,
numInstance: null,
goldInstance: null,
curState: 0,
canMove: !0
},
initData: function(e, t) {
this.isSoonItem = t;
this.bornNum = e;
this.setSpriteFrame();
},
setSpriteFrame: function() {
this.updateColor();
this.updateNum();
},
changeStateToWaitDown: function(e) {
cc.log(this.curState);
if (1 != this.curState) if (3 != this.curState) {
if (!(3 < this.curState) && Global.gridController.getComponent("gridController").bornGrid == this.node && 0 < this.curState) {
this.curState = 1;
this.node.stopAllActions();
this.forjoinaction = null;
var t = this;
this.node.runAction(cc.sequence(cc.delayTime(Global.waitToDown), cc.callFunc(function() {
t.startDownForBorn(e);
})));
}
} else this.startDownForBorn(e);
},
canDown: function() {
for (var e = this.node.getPosition(), t = this.targetGrid.getPosition(), i = e.y, r = cc.pDistance(e, t), n = Math.floor(r / Global.itemSize), o = this.targetGrid.getComponent("gridView").hIndex, a = this.targetGrid.getComponent("gridView").vIndex, s = n <= 1 ? 0 : n, c = Global.gridController.getComponent("gridController").allGrids, f = a - s; f <= a; f++) {
if (i > c[o][f].getPosition().y) return !0;
}
return !1;
},
startDownForBorn: function(e) {
this.curState = 2;
for (var t = this.node.getPosition(), i = this.targetGrid.getPosition(), r = cc.pDistance(t, i), n = Math.floor(r / Global.itemSize), o = cc.callFunc(this.callBackForJoin, this), a = this.targetGrid.getComponent("gridView").hIndex, s = this.targetGrid.getComponent("gridView").vIndex, c = t.y, f = [], h = 0, l = n <= 1 ? 0 : n, d = Global.gridController.getComponent("gridController").allGrids, u = s - l; u <= s; u++) if (-1 != u) {
if (0 < f.length) {
var p = cc.delayTime(Global.gridDownDelayTime);
f.push(p);
h += Global.gridDownDelayTime;
}
var b = d[a][u], m = Math.abs(c - b.getPosition().y) / e;
if (0 != m) {
c += b.getPosition().y - c;
h += m;
var g = cc.moveTo(m, b.getPosition());
f.push(g);
}
}
f.push(o);
cc.log(this.curState);
if (f.length <= 1) {
console.log("处理异常");
if (null == this.forjoinaction) {
this.curState = 4;
this.node.runAction(o);
}
return 0;
}
console.log("actions.length = 0");
if (null != this.forjoinaction) {
console.log("this.forjoinaction != null" + f.length);
this.node.stopAction(this.forjoinaction);
this.forjoinaction = null;
}
var y = cc.sequence(f);
this.node.runAction(y);
return h;
},
startQuickDownForBorn: function(e) {
this.curState = 5;
this.node.stopAllActions();
var t = this.node.getPosition(), i = this.targetGrid.getPosition(), r = cc.pDistance(t, i) / e, n = cc.moveTo(r, i), o = cc.callFunc(this.callBackForJoin, this), a = cc.sequence(n, o);
this.node.runAction(a);
return r;
},
toRemove: function() {
this.node.stopAllActions();
this.node.parent && this.node.parent.removeChild(this.node);
this.node.targetOff(this);
this.curState = 0;
},
toRevive: function() {
this.node.stopAllActions();
var e = cc.callFunc(this.toRemove, this), t = cc.blink(1, 2), i = cc.sequence(t, e);
this.node.runAction(i);
return t.getDuration() + .01;
},
clearItemToRemove: function() {
this.node.stopAllActions();
var e = cc.callFunc(this.toRemove, this), t = cc.spawn(cc.rotateBy(.5, 360, 360), cc.sequence(cc.scaleTo(.5, .5), cc.scaleTo(.5, 0)));
this.node.runAction(cc.sequence(t, e));
return 500;
},
updateNum: function() {
if (0 == Global.skinIndex) {
var e = parseInt(this.bornNum / 1e3), t = parseInt(this.bornNum / 100 % 10), i = parseInt(this.bornNum % 100 / 10), r = parseInt(this.bornNum % 10);
0 < e && this.getSpriteNum(this.num1, e);
(0 < t || 0 < e) && this.getSpriteNum(this.num2, t);
(0 < i || 0 < e || 0 < t) && this.getSpriteNum(this.num3, i);
(0 < r || 0 < e || 0 < t || 0 < i) && this.getSpriteNum(this.num4, r);
0 == e && this.num1.setVisible(!1);
0 == e && 0 == t && this.num2.setVisible(!1);
0 == e && 0 == t && 0 == i && this.num3.setVisible(!1);
if (0 < this.bornNum && this.bornNum < 9) this.num4.node.x = 0; else if (10 <= this.bornNum && this.bornNum < 99) {
var n = this.num3.node.width + this.num4.node.width;
this.num3.node.x = -n / 2 + this.num3.node.width / 2;
this.num4.node.x = this.num3.node.x + this.num3.node.width / 2 + this.num4.node.width / 2;
} else if (100 <= this.bornNum && this.bornNum < 999) {
n = this.num2.node.width + this.num3.node.width + this.num4.node.width;
this.num2.node.x = -n / 2 + this.num2.node.width / 2;
this.num3.node.x = this.num2.node.x + this.num2.node.width / 2 + this.num3.node.width / 2;
this.num4.node.x = this.num3.node.x + this.num3.node.width / 2 + this.num4.node.width / 2;
} else if (1e3 <= this.bornNum && this.bornNum < 9999) {
n = this.num1.node.width + this.num2.node.width + this.num3.node.width + this.num4.node.width;
this.num1.node.x = -n / 2 + this.num1.node.width / 2 + 6;
this.num2.node.x = this.num1.node.x + this.num1.node.width / 2 + this.num2.node.width / 2 - 3;
this.num3.node.x = this.num2.node.x + this.num2.node.width / 2 + this.num3.node.width / 2 - 3;
this.num4.node.x = this.num3.node.x + this.num3.node.width / 2 + this.num4.node.width / 2 - 3;
}
} else {
console.log("皮肤", Global.skinIndex, this.bornNum, "skin" + (Global.skinIndex + 1) + "_" + this.bornNum);
var o = a("LoadAtlas");
this.num4.spriteFrame = o.getSpriteFrameFromName("textures/gridItem/skins", "skin" + (Global.skinIndex + 1) + "_" + this.bornNum);
this.num4.node.scaleX = this.isSoonItem ? .7 : 1;
this.num4.node.scaleY = this.isSoonItem ? .7 : 1;
}
},
getSpriteNum: function(e, t) {
var i = a("LoadAtlas").getSpriteFrameFromName("textures/gridItem/items", t);
e.spriteFrame = i;
e.node.width = i.getRect().width;
e.node.height = i.getRect().height;
e.node.scaleX = 999 < this.bornNum || this.isSoonItem ? .8 : 1;
e.node.scaleY = 999 < this.bornNum || this.isSoonItem ? .8 : 1;
e.setVisible(!0);
},
updateColor: function() {
var i = this;
a("LoadAtlas").loadAtlasRes("textures/gridItem/items", function() {
var e = a("LoadAtlas");
i.itemSprite.spriteFrame = e.getSpriteFrameFromName("textures/gridItem/items", "color1_" + i.bornNum);
var t = Global.soonItemSize;
99 < i.bornNum ? t = 90 : 999 < i.bornNum && (t = Global.itemSize);
i.itemSprite.node.width = i.isSoonItem ? t : Global.itemSize;
i.itemSprite.node.height = i.isSoonItem ? t : Global.itemSize;
});
},
callBackForJoin: function() {
this.curState < 3 && (this.curState = 3);
var e = this, t = Global.forJoin;
this.canMove || (t /= 3);
this.forjoinaction = cc.sequence(cc.delayTime(t), cc.callFunc(function() {
e.forJoin();
}));
this.node.runAction(this.forjoinaction);
},
toJoin: function(e) {
this.curState = 4;
var t = cc.callFunc(this.toRemove, this), i = cc.pDistance(this.node.getPosition(), e) / Global.combineTime, r = cc.moveTo(i, e), n = cc.delayTime(.1), o = cc.sequence(n, r, t);
this.node.runAction(o);
},
forJoin: function() {
console.log("forJoin");
if (this.canDown()) this.startDownForBorn(Global.gridDownSpeed); else {
this.node.stopAllActions();
var e = (i = Global.gridController.getComponent("gridController")).downGrids.indexOf(this.getComponent("itemView"));
0 <= e && i.downGrids.splice(e, 1);
var t = this.targetGrid.getComponent("gridView");
(t.item = this).node.setPosition(cc.p(t.node.getPosition()));
cc.log("下落停止 item callBackForJoin ：" + t.hIndex + " :: " + t.vIndex + "node pos X" + this.node.x + "  node pos Y" + this.node.y);
t.gridNum = this.bornNum;
var i = Global.gridController.getComponent("gridController");
this.node.on("itemclick", i.itemClick, i);
this.node.on(cc.Node.EventType.TOUCH_START, this.touchStart, this);
this.playDownAudio();
this.canMove = !1;
this.curState = 0;
}
},
touchStart: function() {
cc.log("itemclick");
var e = new cc.Event.EventCustom("itemclick", !0);
e.setUserData(this.targetGrid);
this.node.dispatchEvent(e);
},
playDownAudio: function() {
cc.log("play down audio");
if (Global.isBGMPlaying && null != this.downAudio) {
this.combineID = cc.audioEngine.play(this.downAudio, !1, 1);
var e = this;
0 < e.combineID && cc.audioEngine.setFinishCallback(e.combineID, function() {
e.playAudioEnd();
});
}
},
playAudioStart: function() {
0 != this.combineID && cc.audioEngine.resume(this.combineID);
},
playAudioEnd: function() {
cc.audioEngine.uncache(this.combineID);
}
});
cc._RF.pop();
}, {
LoadAtlas: "LoadAtlas"
} ],
myUtil: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "907ddwVrcNMFoX1AupADcMj", "myUtil");
var r = {
randomForArray: function(e) {
return e && 0 != e.length ? e[Math.floor(Math.random() * e.length)] : 0;
},
randomForMinAndMax: function(e, t) {
return Math.floor(Math.random() * (t - e + 1)) + e;
},
clampValue: function(e, t, i) {
return e < t ? t : i < e ? i : e;
},
randomForWeight: function(e) {
Global.gridRandomScores = [];
for (var t in e) for (var i = parseInt(1e4 * e[t].weight / 100), r = 0; r < i; r++) Global.gridRandomScores.push(e[t].id);
},
getPercentString: function(e) {
return e < 1 ? "0%" : e <= 1 && e < 500 ? "1%" : e <= 501 && e < 1e3 ? "3%" : e <= 1001 && e < 1e4 ? "8%" : e <= 10001 && e < 2e4 ? "15%" : e <= 20001 && e < 3e4 ? "30%" : e <= 30001 && e < 4e4 ? "55%" : e <= 40001 && e < 5e4 ? "65%" : e <= 50001 && e < 6e4 ? "75%" : e <= 60001 && e < 7e4 ? "85%" : e <= 70001 && e < 8e4 ? "88%" : e <= 80001 && e < 9e4 ? "90%" : e <= 90001 && e < 1e5 ? "95%" : "99%";
},
getImgBase64: function() {
var e = cc.find("Canvas"), t = parseInt(e.width), i = parseInt(e.height), r = new cc.RenderTexture(t, i);
r.begin();
e._sgNode.visit();
r.end();
var n = document.createElement("canvas"), o = n.getContext("2d");
n.width = t;
n.height = i;
if (cc._renderType === cc.game.RENDER_TYPE_CANVAS) {
var a = r.getSprite().getTexture().getHtmlElementObj();
o.drawImage(a, 0, 0);
} else if (cc._renderType === cc.game.RENDER_TYPE_WEBGL) {
var s = gl.createFramebuffer();
gl.bindFramebuffer(gl.FRAMEBUFFER, s);
var c = r.getSprite().getTexture()._glID;
gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, c, 0);
var f = new Uint8Array(t * i * 4);
gl.readPixels(0, 0, t, i, gl.RGBA, gl.UNSIGNED_BYTE, f);
gl.bindFramebuffer(gl.FRAMEBUFFER, null);
for (var h = 4 * t, l = 0; l < i; l++) {
var d = i - 1 - l, u = new Uint8ClampedArray(f.buffer, d * t * 4, h), p = new ImageData(u, t, 1);
o.putImageData(p, 0, l);
}
}
cc.log("to share");
return n.toDataURL("image/png");
}
};
t.exports = r;
cc._RF.pop();
}, {} ],
pauseUI: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "96eabSGlhpIBpRDsG7NBH5N", "pauseUI");
cc.Class({
extends: cc.Component,
properties: {
soundOnBtn: {
default: null,
type: cc.Node
},
soundOffBtn: {
default: null,
type: cc.Node
}
},
onLoad: function() {
this.initAudio();
},
initAudio: function() {
this.soundOnBtn.active = Global.isBGMPlaying;
this.soundOffBtn.active = !Global.isBGMPlaying;
},
toHome: function() {
Global.game.playSound("btn", .1);
Global.isPaused = !1;
Global.gridController.getComponent("gridController").onMainScene();
},
play: function() {
Global.game.playSound("btn", .1);
var e = Global.gridController.getComponent("gridController");
if (Global.isPaused) {
e.bornGrid && e.bornGrid.resumeAllActions();
e.node.resumeAllActions();
this.node.active = !1;
Global.isPaused = !1;
} else {
e.bornGrid.pauseAllActions();
e.node.pauseAllActions();
this.node.active = !0;
this.node.setLocalZOrder(1);
}
},
replay: function() {
Global.game.playSound("btn", .1);
Global.gridController.getComponent("gridController").onRestart();
},
close: function() {
this.play();
},
switchBGM: function() {
Global.game.playSound("btn", .1);
Global.startUI.switchBGM();
this.initAudio();
}
});
cc._RF.pop();
}, {} ],
"polyglot.min": [ function(e, t, i) {
"use strict";
cc._RF.push(t, "e26fd9yy65A4q3/JkpVnFYg", "polyglot.min");
var r, n, o = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
return typeof e;
} : function(e) {
return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
};
r = void 0, n = function(t) {
function e(e) {
e = e || {}, this.phrases = {}, this.extend(e.phrases || {}), this.currentLocale = e.locale || "en", 
this.allowMissing = !!e.allowMissing, this.warn = e.warn || i;
}
function n(e, t, i) {
var r, n, o, a, s, c, f;
return null != i && e ? (o = (n = e.split(h))[(a = t, s = i, l[(c = a, f = function(e) {
var t, i, r, n = {};
for (t in e) if (e.hasOwnProperty(t)) {
i = e[t];
for (r in i) n[i[r]] = t;
}
return n;
}(d), f[c] || f.en)](s))] || n[0], r = o.replace(/^\s+|\s+$/g, "")) : r = e, r;
}
function i(e) {
t.console && t.console.warn && t.console.warn("WARNING: " + e);
}
e.VERSION = "0.4.3", e.prototype.locale = function(e) {
return e && (this.currentLocale = e), this.currentLocale;
}, e.prototype.extend = function(e, t) {
var i;
for (var r in e) e.hasOwnProperty(r) && (i = e[r], t && (r = t + "." + r), "object" == ("undefined" == typeof i ? "undefined" : o(i)) ? this.extend(i, r) : this.phrases[r] = i);
}, e.prototype.clear = function() {
this.phrases = {};
}, e.prototype.replace = function(e) {
this.clear(), this.extend(e);
}, e.prototype.t = function(e, t) {
var i, r;
return "number" == typeof (t = null == t ? {} : t) && (t = {
smart_count: t
}), "string" == typeof this.phrases[e] ? i = this.phrases[e] : "string" == typeof t._ ? i = t._ : this.allowMissing ? i = e : (this.warn('Missing translation for key: "' + e + '"'), 
r = e), "string" == typeof i && (t = function(e) {
var t = {};
for (var i in e) t[i] = e[i];
return t;
}(t), r = function(e, t) {
for (var i in t) "_" !== i && t.hasOwnProperty(i) && (e = e.replace(new RegExp("%\\{" + i + "\\}", "g"), t[i]));
return e;
}(r = n(i, this.currentLocale, t.smart_count), t)), r;
}, e.prototype.has = function(e) {
return e in this.phrases;
};
var h = "||||", l = {
chinese: function(e) {
return 0;
},
german: function(e) {
return 1 !== e ? 1 : 0;
},
french: function(e) {
return 1 < e ? 1 : 0;
},
russian: function(e) {
return e % 10 == 1 && e % 100 != 11 ? 0 : 2 <= e % 10 && e % 10 <= 4 && (e % 100 < 10 || 20 <= e % 100) ? 1 : 2;
},
czech: function(e) {
return 1 === e ? 0 : 2 <= e && e <= 4 ? 1 : 2;
},
polish: function(e) {
return 1 === e ? 0 : 2 <= e % 10 && e % 10 <= 4 && (e % 100 < 10 || 20 <= e % 100) ? 1 : 2;
},
icelandic: function(e) {
return e % 10 != 1 || e % 100 == 11 ? 1 : 0;
}
}, d = {
chinese: [ "fa", "id", "ja", "ko", "lo", "ms", "th", "tr", "zh" ],
german: [ "da", "de", "en", "es", "fi", "el", "he", "hu", "it", "nl", "no", "pt", "sv" ],
french: [ "fr", "tl", "pt-br" ],
russian: [ "hr", "ru" ],
czech: [ "cs" ],
polish: [ "pl" ],
icelandic: [ "is" ]
};
return e;
}, "function" == typeof define && define.amd ? define([], function() {
return n(r);
}) : "object" == ("undefined" == typeof i ? "undefined" : o(i)) ? t.exports = n(r) : r.Polyglot = n(r);
cc._RF.pop();
}, {} ],
rankItem: [ function(r, e, t) {
"use strict";
cc._RF.push(e, "81f14kuRn5K9LTujk2+2GHB", "rankItem");
cc.Class({
extends: cc.Component,
properties: {
bg: {
default: null,
type: cc.Node
},
photo: {
default: null,
type: cc.Sprite
},
fbname: {
default: null,
type: cc.Label
},
score: {
default: null,
type: cc.Label
},
level: {
default: null,
type: cc.Label
},
levelIcon: {
default: null,
type: cc.Sprite
}
},
hideAll: function() {
this.bg.setCascadeOpacityEnabled(!0);
this.bg.setOpacity(76.5);
this.score.string = "";
this.fbname.string = "";
this.photo.setVisible(!1);
},
setScore: function(e) {
this.score.string = e;
},
setNameAndPhoto: function(e) {
var i = this, t = e.indexOf("_");
if (0 < t) {
var r = e.substring(0, t), n = e.substring(t + 1);
this.photo.setVisible(!0);
this.fbname.string = r;
cc.loader.load(n, function(e, t) {
i.photo.spriteFrame = new cc.SpriteFrame(t);
});
}
},
setlevel: function(e) {
this.level.string = e;
var t = r("LoadAtlas"), i = "";
0 < e && e <= 3 && (i = "rank_" + e);
if ("" == i) this.levelIcon.setVisible(!1); else {
this.levelIcon.setVisible(!0);
this.levelIcon.spriteFrame = t.getSpriteFrameFromName("textures/gridItem/items", i);
}
}
});
cc._RF.pop();
}, {
LoadAtlas: "LoadAtlas"
} ],
rankUI: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "7c4f6Im+E9CPLgq3LIDqUzw", "rankUI");
var a = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
return typeof e;
} : function(e) {
return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
}, s = e("../common/ThirdAPI");
cc.Class({
extends: cc.Component,
properties: {
top1: {
default: null,
type: cc.Node
},
top2: {
default: null,
type: cc.Node
},
rankPrefab: {
default: null,
type: cc.Prefab
},
innerview: {
default: null,
type: cc.Node
},
scrollView: {
default: null,
type: cc.Node
},
content: {
default: null,
type: cc.Node
},
btn_group: {
default: null,
type: cc.Node
},
myrankNode: {
default: null,
type: cc.Node
},
myrankBg: {
default: null,
type: cc.Sprite
},
myrankSpr: {
default: null,
type: cc.Sprite
},
entries: null,
itemHeight: 30,
arrItems: []
},
start: function() {},
onLoad: function() {
this.setHandWidthAndHeight();
},
setHandWidthAndHeight: function() {
var e = cc.find("Canvas");
this.top1.width = .5 * e.width;
this.top2.width = .5 * e.width;
},
onBtnGroupClick: function() {
if (1 == this.showType) {
this.showType = 2;
this.lbl_btn_group.string = "查看好友排行";
this.getGroupRank();
} else {
this.showType = 1;
this.lbl_btn_group.string = "查看群排行";
this.getFriendRank();
}
},
initData: function() {
this.scrollView.getComponent(cc.ScrollView).scrollToTop(0);
var e = cc.instantiate(this.rankPrefab).height + 5;
this.content.height = 20 * e;
console.log("content width:" + this.content.width);
this.content.getChildByName("sprite").height = 20 * e;
if (0 == this.arrItems.length) for (var t = 0; t < 20; t++) {
var i = cc.instantiate(this.rankPrefab);
i.setLocalZOrder(-1);
i.setPosition(cc.p(0, -.5 * e - t * e));
this.arrItems[t] = i;
this.content.addChild(i);
}
for (var r = 0; r < this.arrItems.length; r++) {
var n = this.arrItems[r];
n.getComponent("rankItem").setlevel(r + 1);
n.getComponent("rankItem").hideAll();
}
if ("undefined" != typeof wx) {
for (var o = 0; o < this.arrItems.length; o++) {
this.arrItems[o].getComponent("rankItem").level.node.active = !1;
}
this.initGetGroupRank();
} else "undefined" != typeof FBInstant && this.getRank();
},
getFriendRank: function() {
var t = this;
console.log("getFriendRank");
var e = this.content.getChildByName("sprite"), i = e.width, r = e.height, n = this.innerview.x - .5 * i, o = this.innerview.y - .5 * r;
this.drawRect = {
x: n,
y: o,
width: i,
height: r
};
console.log("draw rect:", this.drawRect, "this.content.width :" + this.content.width, "this.innerview.width" + this.innerview.width + "sprite.width :" + e.width);
s.getRank({
rect: this.drawRect,
callback: function(e) {
"object" === ("undefined" == typeof e ? "undefined" : a(e)) ? t.updateContent(e) : "string" == typeof e && (t.updateWxRank = 100);
}
}, "Friend");
},
initGetGroupRank: function() {
var t = this;
console.log("getGroupRank");
var e = this.content.getChildByName("sprite"), i = e.width, r = e.height, n = this.innerview.x - .5 * i, o = this.innerview.y - .5 * r;
this.drawRect = {
x: n,
y: o,
width: i,
height: r
};
console.log("draw rect:", this.drawRect);
this.cleanRank();
s.getRank({
rect: this.drawRect,
callback: function(e) {
console.log("getGroupRank,oncallback", e);
if ("object" === ("undefined" == typeof e ? "undefined" : a(e))) t.updateContent(e); else if ("string" == typeof e) if ("success" == e) {
t.cleanRank();
t.updateWxRank = 1;
} else if ("failed" == e) {
t.closeThis();
Global.game.showDialogText("分享失败，必须分享到微信群", {
x: 0,
y: 20
});
console.log("查看排行榜，分享到群失败");
} else {
t.cleanRank();
t.updateWxRank = 1;
}
}
}, "Group");
},
getGroupRank: function() {
var t = this;
console.log("getGroupRank");
var e = this.content.getChildByName("sprite"), i = e.width, r = e.height, n = this.innerview.x - .5 * i, o = this.innerview.y - .5 * r;
this.drawRect = {
x: n,
y: o,
width: i,
height: r
};
console.log("draw rect:", this.drawRect);
s.getRank({
rect: this.drawRect,
callback: function(e) {
console.log("getGroupRank,oncallback", e);
if ("object" === ("undefined" == typeof e ? "undefined" : a(e))) t.updateContent(e); else if ("string" == typeof e) if ("success" == e) {
t.cleanRank();
t.updateWxRank = 1;
} else if ("failed" == e) ; else {
t.cleanRank();
t.updateWxRank = 1;
}
}
}, "Group");
},
getRank: function() {
if ("undefined" != typeof FBInstant) {
var t = this;
FBInstant.getLeaderboardAsync("my_allrank").then(function(e) {
return e.getEntriesAsync();
}).then(function(e) {
t.updateContent(e);
t.getMyRank();
}).catch(function(e) {});
}
},
updateContent: function(e) {
if (e) {
this.entries = e;
for (var t = 0; t < this.entries.length; t++) {
var i = this.arrItems[t];
if (i) {
var r = this.entries[t];
i.getComponent("rankItem").setScore(r.getScore());
i.getComponent("rankItem").setlevel(r.getRank());
i.getComponent("rankItem").setNameAndPhoto(r.getExtraData());
}
}
} else for (var n = 0; n < this.arrItems.length; n++) {
var o = this.arrItems[n];
o && (o.active = fasle);
}
},
updateMyContent: function(e) {
if (!(parseInt(e.getRank()) <= 10)) {
var t = this.entries.length;
10 == t && (t = 9);
var i = this.arrItems[t];
i.getComponent("rankItem").setScore(e.getScore());
i.getComponent("rankItem").setlevel(e.getRank());
i.getComponent("rankItem").setNameAndPhoto(e.getExtraData());
}
},
cleanRank: function() {
this.content.getChildByName("sprite").getComponent(cc.Sprite).spriteFrame = null;
},
closeThis: function() {
this.node.parent && this.node.parent.removeChild(this.node);
},
update: function(e) {
if (this.updateWxRank && 100 < this.updateWxRank) {
console.log("redraw wx rank");
this.updateWxRank = 1;
var t = wx.getOpenDataContext().canvas, i = new cc.Texture2D();
i.initWithElement(t);
i.handleLoadedTexture();
var r = new cc.SpriteFrame(i);
console.log("texture.width :" + i.width, i.height + " :: " + this.content.width);
var n = this.content.getChildByName("sprite");
n.getComponent(cc.Sprite).type = cc.Sprite.Type.TILED;
n.width = i.width;
n.height = i.height - 90;
n.getComponent(cc.Sprite).spriteFrame = r;
this.myrankSpr.spriteFrame = r;
this.myrankSpr.node.height = i.height;
} else this.updateWxRank++;
}
});
cc._RF.pop();
}, {
"../common/ThirdAPI": "ThirdApi"
} ],
reviveUI: [ function(t, e, i) {
"use strict";
cc._RF.push(e, "02f0eykHTVElayNfHnNwExV", "reviveUI");
var r = t("../common/ThirdAPI");
cc.Class({
extends: cc.Component,
properties: {
sLabel: {
default: null,
type: cc.Label
},
lbl_countdown: {
default: null,
type: cc.Label
},
tip: {
default: null,
type: cc.Label
},
shareLabel: {
default: null,
type: cc.Label
},
shareNotRevive: {
default: null,
type: cc.Node
},
scoreNum: 0
},
start: function() {},
initData: function() {
this.startContinueConutDown();
this.setShareLabel();
this.tip.node.active = !1;
this.shareNotRevive.active = !1;
},
setShareLabel: function() {
if ("undefined" != typeof wx) if (Global.cdnGameConfig.totalSwith) this.shareLabel.string = "分享也不能复活"; else if (Global.cdnGameConfig.reviveScoreSwith) {
console.log("判断分数：", Global.cdnGameConfig.reviveScoreLimit, Global.wxScore);
if (Global.wxScore > Global.cdnGameConfig.reviveScoreLimit) {
console.log("是否可以复活");
this.shareLabel.string = "分享到群继续玩";
} else this.shareLabel.string = "分享也不能复活";
} else {
console.log("分享开关已经关闭", Global.cdnGameConfig.reviveScoreSwith);
this.shareLabel.string = "分享到群继续玩";
} else "undefined" != typeof FBInstant ? this.shareLabel.string = "share game" : this.shareLabel.string = "分享复活";
},
startContinueConutDown: function() {
var e = this, t = 10;
this.lbl_countdown.string = t;
this.pauseInterval = !1;
this.countDownInterval = setInterval(function() {
if (!e.pauseInterval) if (0 <= --t) e.lbl_countdown.string = t; else {
e.giveUpShare();
clearInterval(e.countDownInterval);
}
}, 1e3);
},
setScore: function(e) {
this.scoreNum = e;
"undefined" != typeof wx ? this.sLabel.string = "当前分数：" + this.scoreNum : "undefined" != typeof FBInstant ? this.sLabel.string = "current score:" + this.scoreNum : this.sLabel.string = "当前分数:" + this.scoreNum;
},
shareGame: function() {
Global.game.playSound("btn", .1);
this.tip.node.active = !1;
this.pauseInterval = !0;
if ("undefined" != typeof FBInstant) {
var e = t("myUtil");
r.shareGame(e.getImgBase64(), this.onShareSuccess.bind(this));
} else if ("undefined" != typeof wx) {
console.log("----------------复活分享-----------------");
r.shareGame("randomImg", this.onShareSuccess.bind(this), this.onShareFailed.bind(this), "004");
} else {
console.log("----------------直接复活-----------------");
this.onShareSuccess();
}
},
onShareSuccess: function(e) {
if (Global.cdnGameConfig.totalSwith) {
this.giveUpShare();
clearInterval(this.countDownInterval);
console.log("功能开关已打开1");
} else {
if (Global.cdnGameConfig.reviveScoreSwith) {
console.log("判断分数：", Global.cdnGameConfig.reviveScoreLimit, Global.wxScore);
if (!(Global.wxScore > Global.cdnGameConfig.reviveScoreLimit)) {
this.giveUpShare();
clearInterval(this.countDownInterval);
console.log("revive复活界面--分数开关已打开2");
return;
}
}
if (-1 == Global.gameinfo.shareData2.arrOpenGId.indexOf(e)) {
console.log("该群未分享过", e);
Global.gameinfo.shareData2.arrOpenGId.push(e);
r.saveFriendGenStoneInfo(Global.gameinfo);
if (e) {
this.node.parent && this.node.parent.removeChild(this.node);
this.pauseInterval = !1;
clearInterval(this.countDownInterval);
Global.reviveShareTimes--;
-1 < Global.reviveShareTimes && r.saveReviveData(Global.reviveShareTimes);
Global.reviveTimes++;
Global.gridController.getComponent("gridController").clearGridForRevive();
} else {
Global.game.showDialogText("分享失败，必须分享到微信群", {
x: 0,
y: -120
});
this.pauseInterval = !1;
console.log("分享失败，必须分享到不同微信群");
}
} else {
console.log("该群今日已经分享过", e);
this.pauseInterval = !1;
Global.game.showDialogText("该群今日已经分享过无法复活");
}
}
},
onShareFailed: function() {
this.pauseInterval = !1;
Global.game.showDialogText("分享失败，必须分享到微信群");
},
giveUpShare: function() {
Global.game.playSound("btn", .1);
this.node.parent && this.node.parent.removeChild(this.node);
this.pauseInterval = !1;
clearInterval(this.countDownInterval);
Global.game.showShareUI();
Global.shareUI.updateMaxLabel(this.scoreNum);
}
});
cc._RF.pop();
}, {
"../common/ThirdAPI": "ThirdApi",
myUtil: "myUtil"
} ],
score: [ function(t, e, i) {
"use strict";
cc._RF.push(e, "125abOQvTlEBpdqjY3ndlF5", "score");
var r = t("../common/ThirdAPI");
cc.Class({
extends: cc.Component,
properties: {
curLabel: {
default: null,
type: cc.Label
},
scoreNum: 0,
showScore: 0
},
start: function() {
this.reset();
},
addScore: function(e) {
this.scoreNum += e;
if (this.scoreNum > Global.wxScore) {
console.log("from socre.js add score:", Global.wxScore, Global.wxGold);
Global.wxScore = this.scoreNum;
r.saveScore(Global.wxScore, Global.wxGold);
}
if (1e4 < this.scoreNum) {
t("myUtil").randomForWeight(Global.weightScores2);
}
},
update: function(e) {
if (!(this.showScore >= this.scoreNum)) {
this.scoreNum > this.showScore + 100 ? this.showScore += 20 : this.scoreNum > this.showScore + 20 ? this.showScore += 10 : this.showScore += 1;
this.curLabel.string = this.showScore;
}
},
reset: function() {
this.scoreNum = 0;
this.showScore = -1;
}
});
cc._RF.pop();
}, {
"../common/ThirdAPI": "ThirdApi",
myUtil: "myUtil"
} ],
shareUI: [ function(o, e, t) {
"use strict";
cc._RF.push(e, "ab6408y4ihGvpo29uPO2m4E", "shareUI");
var a = o("../common/ThirdAPI");
cc.Class({
extends: cc.Component,
properties: {
bg: {
default: null,
type: cc.Node
},
line1: {
default: null,
type: cc.Node
},
line2: {
default: null,
type: cc.Node
},
currScore: {
default: null,
type: cc.Label
},
score: {
default: null,
type: cc.Label
},
personPer: {
default: null,
type: cc.Label
},
btn_label: {
default: null,
type: cc.Label
},
node_gold: {
default: null,
type: cc.Node
},
fly_node: {
default: null,
type: cc.Node
},
lbl_gold: {
default: null,
type: cc.Label
},
lbl_fly: {
default: null,
type: cc.Label
},
soundOnBtn: {
default: null,
type: cc.Node
},
soundOffBtn: {
default: null,
type: cc.Node
},
backgroundAudio: {
url: cc.AudioClip,
default: null
},
tipbox: {
default: null,
type: cc.Node
},
buttonstate0: {
default: null,
type: cc.Node
},
buttonstate1: {
default: null,
type: cc.Node
},
hasShardReward: !0,
isStart: !1
},
start: function() {
Global.shareUI = this.getComponent("shareUI");
this.setBackground();
this.isStart = !0;
},
initData: function() {
this.hasShardReward = !0;
this.showEffect();
this.setBackground();
if (Global.cdnGameConfig.totalSwith) {
this.buttonstate0.active = !1;
this.buttonstate1.active = !0;
} else if (Global.cdnGameConfig.shareScoreSwith) {
console.log("判断分数：", Global.cdnGameConfig.shareScoreLimit, Global.wxScore);
var e = Global.wxScore > Global.cdnGameConfig.shareScoreLimit;
console.log("分享界面按钮判断--canShow:", e);
if (e) {
this.buttonstate0.active = !!(this.hasShardReward && Global.shareData.shareTimes < 5);
this.buttonstate1.active = !(this.hasShardReward && Global.shareData.shareTimes < 5);
} else {
this.buttonstate0.active = !1;
this.buttonstate1.active = !0;
}
} else {
this.buttonstate0.active = !!(this.hasShardReward && Global.shareData.shareTimes < 5);
this.buttonstate1.active = !(this.hasShardReward && Global.shareData.shareTimes < 5);
}
},
showTipbox: function() {
this.tipbox.active = !0;
},
onTipButton: function() {
this.tipbox.active = !1;
},
setBackground: function() {
var e = cc.find("Canvas");
this.bg.width = e.width;
this.line1.width = e.width;
this.line2.width = e.width;
console.log("width:", this.bg.width, this.line1.width, this.line2.width);
},
switchBGM: function() {
Global.startUI.switchBGM();
},
showEffect: function() {
this.node_gold.active = !1;
this.fly_node.active = !1;
this.node.setPosition(cc.p(-640, 0));
var e = cc.moveTo(.6, cc.p(0, 0));
this.node.runAction(e);
},
updateMaxLabel: function(e) {
this.currScore.string = e;
var t = o("myUtil");
this.personPer.string = t.getPercentString(e);
this.score.string = "历史最高分：" + e;
if ("undefined" != typeof wx) {
var i = a.loadLocalScore(), r = parseInt(i.maxscore), n = parseInt(i.gold);
a.loadScore(function(e, t) {
r = parseInt(e);
t = parseInt(t);
console.log("on ThirdAPI loadScore", r, parseInt(t));
});
if (r < e) {
a.saveScore(e, n);
this.score.string = "历史最高分：" + e;
} else this.score.string = "历史最高分：" + r;
} else if ("undefined" != typeof FBInstant) if (e > Global.fbScore) {
this.score.string = e;
Global.dataScript.saveScore(e);
} else this.score.string = Global.fbScore;
Global.titleMaxScore = e;
Global.titleUI && Global.titleUI.updateItemsState(1);
},
play: function() {
Global.game.playSound("btn", .1);
Global.game.enterScene();
},
gotoHome: function() {
Global.game.playSound("btn", .1);
Global.game.startGame();
},
showRankUI: function() {
Global.game.playSound("btn", .1);
Global.game.showRank();
},
onShareGame: function() {
Global.game.playSound("btn", .1);
"undefined" != typeof FBInstant ? a.shareGame(this.getImgBase64(), this.onShareSuccess.bind(this)) : a.shareGame("screenshot", this.onShareSuccess.bind(this), this.onShareFail.bind(this), "003");
},
onChallenge: function() {
Global.game.playSound("btn", .1);
var e = this.getImgBase64();
"undefined" != typeof FBInstant && FBInstant.shareAsync({
intent: "INVITE",
image: e,
text: "I just challenged Tetris2048,Join me!",
data: {
myReplayData: "..."
}
}).then(function() {});
},
onShareSuccess: function(e) {
if (Global.cdnGameConfig.totalSwith) {
this.buttonstate0.active = !1;
this.buttonstate1.active = !0;
} else {
if (Global.cdnGameConfig.shareScoreSwith) {
console.log("分享成功之后判断分数：", Global.cdnGameConfig.shareScoreLimit, Global.wxScore);
if (!(Global.wxScore > Global.cdnGameConfig.shareScoreLimit)) {
console.log("分享成功不能领取奖励");
this.buttonstate0.active = !1;
this.buttonstate1.active = !0;
return;
}
}
if (5 <= Global.shareData.shareTimes) {
this.buttonstate0.active = !1;
this.buttonstate1.active = !0;
} else if (this.hasShardReward) {
if (-1 != Global.gameinfo.shareData3.arrOpenGId.indexOf(e)) {
console.log("该群今日已经分享过", e);
Global.game.showDialogText("该群今日已经分享过无法获得奖励");
return;
}
console.log("该群未分享过", e);
Global.gameinfo.shareData3.arrOpenGId.push(e);
a.saveFriendGenStoneInfo(Global.gameinfo);
if (!e) {
Global.game.showDialogText("分享失败，必须分享到微信群", {
x: 0,
y: -200
});
console.log("shareUI 分享的不是群");
return;
}
console.log("分享获得钻石,开始播放动画");
Global.shareData.shareTimes++;
a.saveShareData(Global.shareData.shareTimes, Global.shareData.shareDate);
Global.wxGold += parseInt(Global.shareReward);
if ("undefined" != typeof wx) {
var t = a.loadLocalScore(), i = parseInt(t.maxscore);
parseInt(t.gold);
a.loadScore(function(e, t) {
i = parseInt(e);
t = parseInt(t);
console.log("shareUI on ThirdAPI loadScore", i, parseInt(t), Global.wxGold);
});
a.saveScore(i, Global.wxGold);
}
this.hasShardReward = !1;
this.playGetGoldEffect();
}
}
},
onShareFail: function() {
console.log("向好友索取失败");
Global.game.showDialogText("分享失败，必须分享到微信群");
},
playGetGoldEffect: function() {
var e = this;
this.buttonstate0.active = !1;
this.buttonstate1.active = !0;
this.hasShardReward = !1;
this.fly_node.active = !0;
this.lbl_fly.string = "+" + Global.shareReward;
var t = this.fly_node.getComponent(cc.Animation);
t.play();
this.node_gold.active = !0;
this.lbl_gold.string = Global.wxGold - parseInt(Global.shareReward);
this.node_gold.runAction(cc.fadeIn(.5));
t.on("stop", function() {
e.node_gold.runAction(cc.sequence(cc.scaleTo(.2, 1.2), cc.callFunc(function() {
e.lbl_gold.string = Global.wxGold;
e.fly_node.active = !1;
}), cc.scaleTo(.2, 1), cc.fadeOut(1)));
});
},
getImgBase64: function() {
var e = cc.find("Canvas"), t = parseInt(e.width), i = parseInt(e.height), r = new cc.RenderTexture(t, i);
r.begin();
e._sgNode.visit();
r.end();
var n = document.createElement("canvas"), o = n.getContext("2d");
n.width = t;
n.height = i;
if (cc._renderType === cc.game.RENDER_TYPE_CANVAS) {
var a = r.getSprite().getTexture().getHtmlElementObj();
o.drawImage(a, 0, 0);
} else if (cc._renderType === cc.game.RENDER_TYPE_WEBGL) {
var s = gl.createFramebuffer();
gl.bindFramebuffer(gl.FRAMEBUFFER, s);
var c = r.getSprite().getTexture()._glID;
gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, c, 0);
var f = new Uint8Array(t * i * 4);
gl.readPixels(0, 0, t, i, gl.RGBA, gl.UNSIGNED_BYTE, f);
gl.bindFramebuffer(gl.FRAMEBUFFER, null);
for (var h = 4 * t, l = 0; l < i; l++) {
var d = i - 1 - l, u = new Uint8ClampedArray(f.buffer, d * t * 4, h), p = new ImageData(u, t, 1);
o.putImageData(p, 0, l);
}
}
cc.log("to share");
return n.toDataURL("image/png");
}
});
cc._RF.pop();
}, {
"../common/ThirdAPI": "ThirdApi",
myUtil: "myUtil"
} ],
startUI: [ function(s, e, t) {
"use strict";
cc._RF.push(e, "bca9aXCN59LNZb12NxU6UO1", "startUI");
var r = s("../common/ThirdAPI");
cc.Class({
extends: cc.Component,
properties: {
score: {
default: null,
type: cc.Label
},
icon: {
default: null,
type: cc.Sprite
},
bg: {
default: null,
type: cc.Sprite
},
soundOnBtn: {
default: null,
type: cc.Node
},
soundOffBtn: {
default: null,
type: cc.Node
},
gemStone: {
default: null,
type: cc.Prefab
},
friendBtn: {
default: null,
type: cc.Node
},
goldNode: {
default: null,
type: cc.Node
},
spriteMoreGame: {
default: null,
type: cc.Sprite
},
backgroundAudio: {
url: cc.AudioClip,
default: null
},
currentBGM: -1,
reddot: {
default: null,
type: cc.Node
}
},
start: function() {
this.init();
this.initAudio();
},
init: function() {
this.updateBestScore();
this.icon.spriteFrame.getTexture().setAliasTexParameters();
this.bg.spriteFrame.getTexture().setAliasTexParameters();
this.soundOnBtn.active = Global.isBGMPlaying;
this.soundOffBtn.active = !Global.isBGMPlaying;
var e = new Date().getTime() - Global.gameinfo.shareTime;
console.log("索取次数判断：", Global.gameinfo.shareTotalTimes, Global.dailyTotalTimes, e);
if (Global.cdnGameConfig.totalSwith) this.friendBtn.active = !1; else if (Global.cdnGameConfig.startScoreSwith) {
console.log("判断分数：", Global.cdnGameConfig.startScoreLimit, Global.wxScore);
var t = Global.wxScore > Global.cdnGameConfig.startScoreLimit;
console.log("首页索取按钮判断--canShow:", t, Global.gameinfo.shareTotalTimes, e);
this.friendBtn.active = !!(t && Global.gameinfo.shareTotalTimes < Global.dailyTotalTimes && e > Global.intervalTime);
} else {
console.log("设置好友索取按钮状态");
this.friendBtn.active = Global.gameinfo.shareTotalTimes < Global.dailyTotalTimes && e > Global.intervalTime;
}
this.updateGold(0);
this.moreGameRunAction();
},
moreGameRunAction: function() {
this.spriteMoreGame.node.runAction(cc.repeatForever(cc.sequence(cc.rotateBy(.1, 10), cc.rotateBy(.2, -20), cc.rotateBy(.2, 20), cc.rotateBy(.2, -20), cc.rotateBy(.1, 10), cc.delayTime(2))));
},
initAudio: function() {
this.currentBGM = cc.audioEngine.play(this.backgroundAudio, !1, .2);
cc.audioEngine.setLoop(this.currentBGM, !0);
cc.audioEngine.setVolume(this.currentBGM, .2);
var e = cc.audioEngine.getVolume(this.currentBGM);
console.log("currentBGM volume is " + e);
Global.isBGMPlaying = !0;
},
showRedDot: function(e) {},
updateGold: function(e) {
this.goldNode.getChildByName("label").getComponent(cc.Label).string = Global.wxGold;
Global.wxGold += parseInt(e);
console.log("1 :" + e, Global.wxGold);
if ("undefined" != typeof wx) {
var t = r.loadLocalScore(), i = parseInt(t.maxscore);
parseInt(t.gold);
r.loadScore(function(e, t) {
i = parseInt(e);
t = parseInt(t);
console.log("gridController on ThirdAPI loadScore", i, parseInt(t), Global.wxGold);
});
r.saveScore(i, Global.wxGold);
}
this.goldNode.getChildByName("label").getComponent(cc.Label).string = Global.wxGold;
},
updateBestScore: function() {
if ("undefined" != typeof wx) {
var e = r.loadLocalScore();
Global.wxScore = parseInt(e.maxscore);
Global.wxGold = parseInt(e.gold);
r.loadScore(function(e, t) {
Global.wxScore = parseInt(e);
Global.wxGold = parseInt(t);
console.log("on ThirdAPI loadScore", Global.wxScore + " :: " + Global.wxGold);
});
this.score.string = "最高分:" + Global.wxScore;
} else "undefined" != typeof FBInstant && (this.score.string = "High score:" + Global.fbScore);
},
onShareGame: function() {
Global.game.playSound("btn", .1);
if ("undefined" != typeof FBInstant) r.shareGame(this.getImgBase64(), this.onShareSuccess.bind(this)); else if ("undefined" != typeof wx) r.shareGame("randomImg", this.onShareSuccess.bind(this), this.onShareFail.bind(this), "003"); else {
Global.game.showDialogText("索取失败，必须分享到不同微信群", {
x: 0,
y: 20
});
this.onShareSuccess();
}
},
onShareSuccess: function(e) {
if ("undefined" == typeof wx || e) if (-1 == Global.gameinfo.shareData1.arrOpenGId.indexOf(e)) {
console.log("该群未分享过", e);
Global.gameinfo.shareData1.arrOpenGId.push(e);
r.saveFriendGenStoneInfo(Global.gameinfo);
console.log("startUI onshareSuccess:", Global.gameinfo.shareDate, new Date().toDateString());
if (Global.gameinfo.shareDate != new Date().toDateString()) {
var t = new Date(Date.now());
Global.gameinfo.shareTimes = 0;
Global.gameinfo.shareTotalTimes = 0;
Global.gameinfo.shareTime = 0;
Global.gameinfo.shareDate = t.toDateString();
Global.gameinfo.shareData1 = {
shareDate: t.toDateString(),
arrOpenGId: []
};
Global.gameinfo.shareData2 = {
shareDate: t.toDateString(),
arrOpenGId: []
};
Global.gameinfo.shareData3 = {
shareDate: t.toDateString(),
arrOpenGId: []
};
r.loadFriendGenStoneInfo(Global.gameinfo);
}
Global.gameinfo.shareTimes++;
if (Global.gameinfo.shareTimes >= Global.getForTotalTimes) {
console.log("次数已满", Global.gameinfo.shareTimes);
Global.gameinfo.shareTimes = 0;
Global.gameinfo.shareTotalTimes++;
Global.gameinfo.shareTime = new Date().getTime();
}
r.saveFriendGenStoneInfo(Global.gameinfo);
var i = new Date().getTime() - Global.gameinfo.shareTime;
console.log("分享成功的时间：", new Date().getTime(), Global.gameinfo.shareTime, i);
this.friendBtn.active = Global.gameinfo.shareTotalTimes < Global.dailyTotalTimes && i > Global.intervalTime;
this.createGemstone();
} else {
console.log("该群今日已经分享过", e);
Global.game.showDialogText("该群今日已经分享过无法获得奖励");
} else {
Global.game.showDialogText("索取失败，必须分享到不同微信群", {
x: 0,
y: 20
});
console.log("索取失败，必须分享到不同微信群");
}
},
onShareFail: function() {
console.log("向好友索取失败");
Global.game.showDialogText("索取失败，必须分享到不同微信群");
},
createGemstone: function() {
for (var e = s("myUtil"), t = e.randomForArray(Global.randomGemStone), i = 0; i < t; i++) {
var r = cc.instantiate(this.gemStone), n = e.randomForMinAndMax(-Global.screenHeight / 2 + 100, Global.screenHeight / 2 - 100), o = e.randomForMinAndMax(-Global.screenWidth / 2 + 100, Global.screenWidth / 2 - 100);
console.log("gemStone pos:", n, o);
r.setPosition(cc.p(0, Global.screenHeight / 2 + 50));
var a = cc.moveTo(2, cc.p(n, o)).easing(cc.easeElasticOut(1));
this.node.addChild(r);
r.runAction(a);
}
},
play: function() {
Global.game.playSound("btn", .1);
Global.game.enterScene();
},
showRankUI: function() {
Global.game.playSound("btn", .1);
Global.game.showRank();
},
onShowStore: function() {
Global.game.playSound("btn", .1);
Global.game.showStore();
},
onChallenge: function() {
Global.game.playSound("btn", .1);
Global.shareUI.onChallenge();
},
switchBGM: function() {
Global.game.playSound("btn", .1);
if (Global.isBGMPlaying) {
this.pauseBGM();
this.soundOnBtn.active = !1;
this.soundOffBtn.active = !0;
} else {
this.playBGM();
this.soundOnBtn.active = !0;
this.soundOffBtn.active = !1;
}
Global.isBGMPlaying = !Global.isBGMPlaying;
},
playBGM: function() {
-1 < this.currentBGM && cc.audioEngine.resume(this.currentBGM);
},
pauseBGM: function() {
-1 < this.currentBGM && cc.audioEngine.pause(this.currentBGM);
},
onMoreGame: function() {
Global.game.playSound("btn", .1);
var e = s("LinkImages");
if (Global.linkImages && 0 < Global.linkImages.length) {
console.log("link image : ", Global.linkImages, Global.linkImages.length);
for (var t; ;) {
var i = Math.floor(cc.random0To1() * Global.linkImages.length);
console.log("link image index : ", i);
if (-1 == (t = Global.linkImages[i]).indexOf("2048")) break;
}
console.log("httpStr:", t);
e.previewImage(t);
}
}
});
cc._RF.pop();
}, {
"../common/ThirdAPI": "ThirdApi",
LinkImages: "LinkImages",
myUtil: "myUtil"
} ],
uiRoot: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "84c41LsrfFPsriorNv8+hdx", "uiRoot");
cc.Class({
extends: cc.Component,
properties: {
startUI: {
default: null,
type: cc.Node
},
shareUI: {
default: null,
type: cc.Node
}
},
start: function() {
Global.startUI = this.startUI.getComponent("startUI");
Global.shareUI = this.shareUI.getComponent("shareUI");
},
showStartUI: function() {
this.startUI.active = !0;
this.shareUI.active = !1;
Global.startUI && Global.startUI.init();
},
showShareUI: function() {
this.startUI.active = !1;
this.shareUI.active = !0;
null == Global.shareUI && (Global.shareUI = this.shareUI.getComponent("shareUI"));
Global.shareUI.initData();
}
});
cc._RF.pop();
}, {} ],
wxAPI: [ function(c, e, t) {
(function(a) {
"use strict";
cc._RF.push(e, "7f6f0qagh5LFbhN7qubIwcf", "wxAPI");
var s = {
initOnEnter: function() {
console.log("get launch options");
var e = this.getLaunchOptionsSync();
console.log("launch options", e);
this.shareTicket = e.shareTicket;
this.scene = e.scene;
this.query = e.query;
this.isSticky = e.isSticky;
this.queryString = "";
this.setShareTicketEnabled(!0);
this.showShareMenu();
this.registShare();
this.registOnShow();
this.registOnError();
this.userInfo = {
nickName: "不愿透露姓名的老王",
maxscore: 0,
gold: 0,
iv: "",
signature: "",
gender: 1,
avatarUrl: "res/raw-assets/resources/textures/gridItem/rank_1.png"
};
},
showGameClub: function(e) {
if (this.GameClubButton) if (e) {
console.log("显示游戏圈按钮");
this.GameClubButton.show();
} else {
console.log("隐藏游戏圈按钮");
this.GameClubButton.hide();
}
},
registOnShow: function() {
wx.onShow(function(e) {
console.log("wx onShow", e);
e.shareTicket && (s.shareTicket = e.shareTicket);
});
},
registOnError: function() {
wx.onError(function(e) {
console.log("wx error:" + e.message + "\nstack:\n" + e.stack);
});
},
getAuth: function(e) {
wx.getUserInfo({
success: function(e) {
console.log(e);
s.userInfo = e.userInfo;
s.setUserCloudStorage({
KVDataList: [ {
key: "name",
value: e.userInfo.nickName
}, {
key: "gender",
value: e.userInfo.gender + ""
}, {
key: "avatarUrl",
value: e.userInfo.avatarUrl
}, {
key: "iv",
value: e.iv
}, {
key: "signature",
value: e.signature
} ],
success: function() {
console.log("set User Cloud Storage success");
}
});
},
fail: function(e) {
if (-1 < e.errMsg.indexOf("auth deny") || -1 < e.errMsg.indexOf("auth denied")) {
console.log(e);
s.userInfo = {
nickName: "不愿透露姓名的老王",
maxscore: 0,
gold: 0,
iv: "",
signature: "",
gender: 1,
avatarUrl: "res/raw-assets/resources/textures/gridItem/rank_1.png"
};
console.log("set UserInfo default");
}
},
complete: function() {
e && e();
}
});
},
registShare: function() {
var i = this, r = c("myUtil");
this.onShareAppMessage(function() {
var e, t;
if (Global.cdnShareImages && 0 < Global.cdnShareImages.length) {
e = r.randomForArray(Global.cdnShareImages);
console.log("从cdn请求分享图：", e);
} else {
e = "res/raw-assets/resources/textures/gridItem/" + r.randomForArray(Global.shareImages);
console.log("从本地请求分享图：", e);
}
if (Global.cdnTexts && 0 < Global.cdnTexts.length) {
t = r.randomForArray(Global.cdnTexts);
console.log("从cdn请求分享文字：", t);
} else {
t = r.randomForArray(Global.shareTexts);
console.log("从本地读取分享文字：", t);
}
i.setQueryInfo("001", e);
console.log("用户点击了右上按钮并分享,query:", s.queryString);
return {
title: t,
imageUrl: e,
query: s.queryString
};
});
},
shareGame: function(e, o, a, t) {
var i, r, n = c("myUtil");
if ("screenshot" == e) {
i = s.getShareScreenShot();
this.setQueryInfo(t, "screenshot");
} else if ("screenshotForDown" == e) {
i = s.getShareScreenShotForDown();
this.setQueryInfo(t, "screenshot");
} else {
if (Global.cdnShareImages && 0 < Global.cdnShareImages.length) {
i = n.randomForArray(Global.cdnShareImages);
console.log("从cdn请求分享图：", i);
} else {
i = "res/raw-assets/resources/textures/gridItem/" + n.randomForArray(Global.shareImages);
console.log("从本地请求分享图：", i);
}
this.setQueryInfo(t, i);
}
if (Global.cdnTexts && 0 < Global.cdnTexts.length) {
r = n.randomForArray(Global.cdnTexts);
console.log("从cdn请求分享文字：", r);
} else {
r = n.randomForArray(Global.shareTexts);
console.log("从本地读取分享文字：", r);
}
console.log("用户点击分享,query:", s.queryString);
s.shareAppMessage({
title: r,
imageUrl: i,
query: s.queryString,
success: function(e) {
console.log("wx分享成功", e);
if (e.shareTickets) {
s.shareTicketEnabled = !0;
s.shareTicket = e.shareTickets[0];
wx.getShareInfo({
shareTicket: e.shareTickets[0],
success: function(e) {
console.log("获取分享信息成功", e);
if (e) {
var t = e.iv, i = e.encryptedData;
console.log("解析分享信息", tywx.UserInfo.wxgame_session_key, t, i);
var r = s.decrypt(tywx.UserInfo.wxgame_session_key, t, i);
console.log(r);
if (r) {
var n = "";
(r = JSON.parse(r)).openGId && (n = r.openGId);
console.log("分享群ID:", n);
null != o && o(n, s.shareTicket);
} else a && a();
}
},
fail: function() {
console.log("获取分享信息失败");
a && a();
},
complete: function() {}
});
} else {
console.log("wx分享到群失败", a);
a && a();
}
},
fail: function() {
console.log("wx分享失败", a);
a && a();
}
});
},
decrypt: function(e, t, i) {
var r = c("crypto");
i = new a(i, "base64");
t = new a(t, "base64");
e = new a(e, "base64");
var n = r.createDecipheriv("aes-128-cbc", e, t), o = n.update(i, "binary", "utf8");
return o += n.final("utf8");
},
login: function(e) {
wx.login(e);
},
setMaxScore: function(e, t) {
s.queryString = "nickName=" + s.userInfo.nickName + "&maxscore=" + e + "&gold=" + t + "&gender=" + s.userInfo.gender + "&avatarUrl=" + s.userInfo.avatarUrl;
console.log("wx setMaxScore, query:", s.queryString);
},
getLaunchOptionsSync: function() {
return wx.getLaunchOptionsSync();
},
setShareTicketEnabled: function(e) {
wx.updateShareMenu({
withShareTicket: e,
success: function() {
s.shareTicketEnabled = e;
}
});
},
getShareInfo: function(e) {
return wx.getShareInfo(e);
},
getShareUserInfo: function() {
return this.query;
},
showShareMenu: function() {
console.log("显示右上菜单的转发按钮");
wx.showShareMenu();
},
hideShareMenu: function() {
console.log("隐藏右上菜单的转发按钮");
wx.hideShareMenu();
},
onShareAppMessage: function(e) {
console.log("注册点击转发按钮事件");
wx.onShareAppMessage(e);
},
shareAppMessage: function(e) {
console.log("转发:", e);
wx.shareAppMessage(e);
},
getShareScreenShot: function() {
return canvas.toTempFilePathSync({
x: 0,
y: .5 * canvas.height - .8 * .8 * canvas.width,
width: canvas.width,
height: .8 * canvas.width,
destWidth: 500,
destHeight: 400
});
},
getShareScreenShotForDown: function() {
return canvas.toTempFilePathSync({
x: 0,
y: .5 * canvas.height + 0 * canvas.width,
width: canvas.width,
height: .8 * canvas.width,
destWidth: 500,
destHeight: 400
});
},
getScreenShot: function() {
return canvas.toTempFilePathSync({});
},
getFriendRank: function(e) {
var t = wx.getOpenDataContext(), i = {
type: "getFriendRank",
width: e.rect.width,
height: e.rect.height
};
s.shareTicketEnabled && (i.shareTicket = s.shareTicket);
console.log(i);
t.postMessage(i);
e.callback && e.callback("wx");
},
getGroupRank: function(n) {
var o = this, e = c("myUtil").randomForArray(Global.shareImages);
this.shareGame("res/raw-assets/resources/textures/gridItem/" + e, function(e, t) {
console.log("on get group rank pre share", t);
if (t) {
var i = wx.getOpenDataContext(), r = {
type: "getGroupRank",
width: n.rect.width,
height: n.rect.height,
shareTicket: t
};
console.log(r);
i.postMessage(r);
if (n.callback) {
n.callback(t);
o.shareTicket = void 0;
}
} else n.callback && n.callback("failed");
}, function() {
n.callback && n.callback("failed");
}, "002");
},
setQueryInfo: function(e, t) {
s.queryString = "nickName=" + s.userInfo.nickName + "&inviteCode=" + tywx.UserInfo.userId + "&sourceCode=" + 1e4 * tywx.SystemInfo.gameId + e + "&imageType=" + t;
console.log(s.queryString);
},
setUserCloudStorage: function(e) {
console.log("setUserCloudStorage:", e);
wx.setUserCloudStorage(e);
},
saveScore: function(e, t, i) {
if ("undefined" != typeof wx) {
var r = {
KVDataList: [ {
key: "maxscore",
value: e + ""
}, {
key: "gold",
value: t + ""
} ],
success: i
};
console.log("wx saveScore:", r);
this.setUserCloudStorage(r);
this.setMaxScore(e, t);
}
},
loadScore: function(e) {},
shakeShort: function(e) {
wx.vibrateShort(e);
},
shakeLong: function(e) {
wx.vibrateLong(e);
},
exit: function() {
wx.exitMiniProgram({
success: function(e) {
console.log("exit game:", e);
}
});
},
getSystemInfo: function() {
return wx.getSystemInfoSync();
}
};
e.exports = s;
cc._RF.pop();
}).call(this, c("buffer").Buffer);
}, {
buffer: 47,
crypto: 56,
myUtil: "myUtil"
} ]
}, {}, [ "LanguageData", "LocalizedLabel", "LocalizedSprite", "SpriteFrameSet", "polyglot.min", "Bilog", "EncodeDecode", "EventType", "GlobalInit", "HttpUtil", "NotificationCenter", "ShareInterface", "TCPClient", "Timer", "TuyooSDK", "Util", "Game", "Global", "LinkImages", "LoadAtlas", "ThirdApi", "fbAPI", "httpUtils", "myUtil", "wxAPI", "dataScript", "gridController", "StoreItem", "TitleItem", "UIStore", "UITitle", "UITitleInfo", "battleRoot", "chooseNum", "itemSound", "pauseUI", "rankItem", "rankUI", "reviveUI", "shareUI", "startUI", "uiRoot", "flyGold", "flyNum", "getGemStone", "gridView", "itemView", "score" ]);