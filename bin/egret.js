var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var egret;
(function (egret) {
    function registerClass(classDefinition, className, interfaceNames) {
        var prototype = classDefinition.prototype;
        Object.defineProperty(prototype, '__class__', {
            value: className,
            enumerable: false,
            writable: true
        });
        var types = [className];
        if (interfaceNames) {
            types = types.concat(interfaceNames);
        }
        var superTypes = prototype.__types__;
        if (prototype.__types__) {
            var length_1 = superTypes.length;
            for (var i = 0; i < length_1; i++) {
                var name_1 = superTypes[i];
                if (types.indexOf(name_1) == -1) {
                    types.push(name_1);
                }
            }
        }
        Object.defineProperty(prototype, '__types__', {
            value: types,
            enumerable: false,
            writable: true
        });
    }
    egret.registerClass = registerClass;
})(egret || (egret = {}));
if (typeof global == 'undefined') {
    var global = window;
}
if (typeof __global == 'undefined') {
    var __global = global;
}
var egret;
(function (egret) {
    egret.$hashCount = 1;
    var HashObject = (function () {
        function HashObject() {
            this.$hashCode = egret.$hashCount++;
        }
        Object.defineProperty(HashObject.prototype, "hashCode", {
            get: function () {
                return this.$hashCode;
            },
            enumerable: true,
            configurable: true
        });
        return HashObject;
    }());
    egret.HashObject = HashObject;
})(egret || (egret = {}));
var egret;
(function (egret) {
    var ONCE_EVENT_LIST = [];
    var EventDispatcher = (function (_super) {
        __extends(EventDispatcher, _super);
        function EventDispatcher(target) {
            if (target === void 0) { target = null; }
            var _this = _super.call(this) || this;
            _this.$EventDispatcher = {
                0: target ? target : _this,
                1: {},
                2: {},
                3: 0
            };
            return _this;
        }
        EventDispatcher.prototype.$getEventMap = function (useCapture) {
            var values = this.$EventDispatcher;
            var eventMap = useCapture ? values[2] : values[1];
            return eventMap;
        };
        EventDispatcher.prototype.addEventListener = function (type, listener, thisObject, useCapture, priority) {
            this.$addListener(type, listener, thisObject, useCapture, priority);
        };
        EventDispatcher.prototype.once = function (type, listener, thisObject, useCapture, priority) {
            this.$addListener(type, listener, thisObject, useCapture, priority, true);
        };
        EventDispatcher.prototype.$addListener = function (type, listener, thisObject, useCapture, priority, dispatchOnce) {
            var values = this.$EventDispatcher;
            var eventMap = useCapture ? values[2] : values[1];
            var list = eventMap[type];
            if (!list) {
                list = eventMap[type] = [];
            }
            else if (values[3] !== 0) {
                eventMap[type] = list = list.concat();
            }
            this.$insertEventBin(list, type, listener, thisObject, useCapture, priority, dispatchOnce);
        };
        EventDispatcher.prototype.$insertEventBin = function (list, type, listener, thisObject, useCapture, priority, dispatchOnce) {
            priority = +priority | 0;
            var insertIndex = -1;
            var length = list.length;
            for (var i = 0; i < length; i++) {
                var bin = list[i];
                if (bin.listener == listener && bin.thisObject == thisObject && bin.target == this) {
                    return false;
                }
                if (insertIndex == -1 && bin.priority < priority) {
                    insertIndex = i;
                }
            }
            var eventBin = {
                type: type, listener: listener, thisObject: thisObject, priority: priority,
                target: this, useCapture: useCapture, dispatchOnce: !!dispatchOnce
            };
            if (insertIndex !== -1) {
                list.splice(insertIndex, 0, eventBin);
            }
            else {
                list.push(eventBin);
            }
            return true;
        };
        EventDispatcher.prototype.removeEventListener = function (type, listener, thisObject, useCapture) {
            var values = this.$EventDispatcher;
            var eventMap = useCapture ? values[2] : values[1];
            var list = eventMap[type];
            if (!list) {
                return;
            }
            if (values[3] !== 0) {
                eventMap[type] = list = list.concat();
            }
            this.$removeEventBin(list, listener, thisObject);
            if (list.length == 0) {
                eventMap[type] = null;
            }
        };
        EventDispatcher.prototype.$removeEventBin = function (list, listener, thisObject) {
            var length = list.length;
            for (var i = 0; i < length; i++) {
                var bin = list[i];
                if (bin.listener == listener && bin.thisObject == thisObject && bin.target == this) {
                    list.splice(i, 1);
                    return true;
                }
            }
            return false;
        };
        EventDispatcher.prototype.hasEventListener = function (type) {
            var values = this.$EventDispatcher;
            return !!(values[1][type] || values[2][type]);
        };
        EventDispatcher.prototype.willTrigger = function (type) {
            return this.hasEventListener(type);
        };
        EventDispatcher.prototype.dispatchEvent = function (event) {
            event.$currentTarget = this.$EventDispatcher[0];
            event.$setTarget(event.$currentTarget);
            return this.$notifyListener(event, false);
        };
        EventDispatcher.prototype.$notifyListener = function (event, capturePhase) {
            var values = this.$EventDispatcher;
            var eventMap = capturePhase ? values[2] : values[1];
            var list = eventMap[event.$type];
            if (!list) {
                return true;
            }
            var length = list.length;
            if (length == 0) {
                return true;
            }
            var onceList = ONCE_EVENT_LIST;
            values[3]++;
            for (var i = 0; i < length; i++) {
                var eventBin = list[i];
                eventBin.listener.call(eventBin.thisObject, event);
                if (eventBin.dispatchOnce) {
                    onceList.push(eventBin);
                }
                if (event.$isPropagationImmediateStopped) {
                    break;
                }
            }
            values[3]--;
            while (onceList.length) {
                var eventBin = onceList.pop();
                eventBin.target.removeEventListener(eventBin.type, eventBin.listener, eventBin.thisObject, eventBin.useCapture);
            }
            return !event.$isDefaultPrevented;
        };
        EventDispatcher.prototype.dispatchEventWith = function (type, bubbles, data, cancelable) {
            if (bubbles || this.hasEventListener(type)) {
                var event_1 = egret.Event.create(egret.Event, type, bubbles, cancelable);
                event_1.data = data;
                var result = this.dispatchEvent(event_1);
                egret.Event.release(event_1);
                return result;
            }
            return true;
        };
        return EventDispatcher;
    }(egret.HashObject));
    egret.EventDispatcher = EventDispatcher;
})(egret || (egret = {}));
var egret;
(function (egret) {
    ;
    function clampRotation(value) {
        value %= 360;
        if (value > 180) {
            value -= 360;
        }
        else if (value < -180) {
            value += 360;
        }
        return value;
    }
    var DisplayObject = (function (_super) {
        __extends(DisplayObject, _super);
        function DisplayObject() {
            var _this = _super.call(this) || this;
            _this.$children = null;
            _this.$name = "";
            _this.$parent = null;
            _this.$stage = null;
            _this.$nestLevel = 0;
            _this.$useTranslate = false;
            _this.$matrix = new egret.Matrix();
            _this.$matrixDirty = false;
            _this.$x = 0;
            _this.$y = 0;
            _this.$scaleX = 1;
            _this.$scaleY = 1;
            _this.$rotation = 0;
            _this.$skewX = 0;
            _this.$skewXdeg = 0;
            _this.$skewY = 0;
            _this.$skewYdeg = 0;
            _this.$explicitWidth = NaN;
            _this.$explicitHeight = NaN;
            _this.$anchorOffsetX = 0;
            _this.$anchorOffsetY = 0;
            _this.$visible = true;
            _this.$displayList = null;
            _this.$cacheAsBitmap = false;
            _this.$cacheDirty = false;
            _this.$alpha = 1;
            _this.$touchEnabled = DisplayObject.defaultTouchEnabled;
            _this.$scrollRect = null;
            _this.$blendMode = 0;
            _this.$maskedObject = null;
            _this.$mask = null;
            _this.$maskRect = null;
            _this.$parentDisplayList = null;
            _this.$renderNode = null;
            _this.$renderDirty = false;
            _this.$renderMode = null;
            _this._tint = 0;
            _this.$tintRGB = 0;
            _this.$sortDirty = false;
            _this._zIndex = 0;
            _this.$lastSortedIndex = 0;
            _this.sortableChildren = false;
            if (egret.nativeRender) {
                _this.createNativeDisplayObject();
            }
            _this.tint = 0xFFFFFF;
            return _this;
        }
        DisplayObject.prototype.createNativeDisplayObject = function () {
            this.$nativeDisplayObject = new egret_native.NativeDisplayObject(0);
        };
        Object.defineProperty(DisplayObject.prototype, "name", {
            get: function () {
                return this.$name;
            },
            set: function (value) {
                this.$name = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DisplayObject.prototype, "parent", {
            get: function () {
                return this.$parent;
            },
            enumerable: true,
            configurable: true
        });
        DisplayObject.prototype.$setParent = function (parent) {
            this.$parent = parent;
        };
        DisplayObject.prototype.$onAddToStage = function (stage, nestLevel) {
            var self = this;
            self.$stage = stage;
            self.$nestLevel = nestLevel;
            self.$hasAddToStage = true;
            egret.Sprite.$EVENT_ADD_TO_STAGE_LIST.push(self);
        };
        DisplayObject.prototype.$onRemoveFromStage = function () {
            var self = this;
            self.$nestLevel = 0;
            egret.Sprite.$EVENT_REMOVE_FROM_STAGE_LIST.push(self);
        };
        DisplayObject.prototype.$updateUseTransform = function () {
            var self = this;
            if (self.$scaleX == 1 && self.$scaleY == 1 && self.$skewX == 0 && self.$skewY == 0) {
                self.$useTranslate = false;
            }
            else {
                self.$useTranslate = true;
            }
        };
        Object.defineProperty(DisplayObject.prototype, "stage", {
            get: function () {
                return this.$stage;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DisplayObject.prototype, "matrix", {
            get: function () {
                return this.$getMatrix().clone();
            },
            set: function (value) {
                this.$setMatrix(value);
            },
            enumerable: true,
            configurable: true
        });
        DisplayObject.prototype.$getMatrix = function () {
            var self = this;
            if (self.$matrixDirty) {
                self.$matrixDirty = false;
                self.$matrix.$updateScaleAndRotation(self.$scaleX, self.$scaleY, self.$skewX, self.$skewY);
            }
            self.$matrix.tx = self.$x;
            self.$matrix.ty = self.$y;
            return self.$matrix;
        };
        DisplayObject.prototype.$setMatrix = function (matrix, needUpdateProperties) {
            if (needUpdateProperties === void 0) { needUpdateProperties = true; }
            var self = this;
            var m = self.$matrix;
            m.a = matrix.a;
            m.b = matrix.b;
            m.c = matrix.c;
            m.d = matrix.d;
            self.$x = matrix.tx;
            self.$y = matrix.ty;
            self.$matrixDirty = false;
            if (m.a == 1 && m.b == 0 && m.c == 0 && m.d == 1) {
                self.$useTranslate = false;
            }
            else {
                self.$useTranslate = true;
            }
            if (needUpdateProperties) {
                self.$scaleX = m.$getScaleX();
                self.$scaleY = m.$getScaleY();
                self.$skewX = matrix.$getSkewX();
                self.$skewY = matrix.$getSkewY();
                self.$skewXdeg = clampRotation(self.$skewX * 180 / Math.PI);
                self.$skewYdeg = clampRotation(self.$skewY * 180 / Math.PI);
                self.$rotation = clampRotation(self.$skewY * 180 / Math.PI);
            }
            if (egret.nativeRender) {
                self.$nativeDisplayObject.setMatrix(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
            }
        };
        DisplayObject.prototype.$getConcatenatedMatrix = function () {
            var self = this;
            var matrix = self.$concatenatedMatrix;
            if (!matrix) {
                matrix = self.$concatenatedMatrix = new egret.Matrix();
            }
            if (self.$parent) {
                self.$parent.$getConcatenatedMatrix().$preMultiplyInto(self.$getMatrix(), matrix);
            }
            else {
                matrix.copyFrom(self.$getMatrix());
            }
            var offsetX = self.$anchorOffsetX;
            var offsetY = self.$anchorOffsetY;
            var rect = self.$scrollRect;
            if (rect) {
                matrix.$preMultiplyInto(egret.$TempMatrix.setTo(1, 0, 0, 1, -rect.x - offsetX, -rect.y - offsetY), matrix);
            }
            else if (offsetX != 0 || offsetY != 0) {
                matrix.$preMultiplyInto(egret.$TempMatrix.setTo(1, 0, 0, 1, -offsetX, -offsetY), matrix);
            }
            return self.$concatenatedMatrix;
        };
        DisplayObject.prototype.$getInvertedConcatenatedMatrix = function () {
            var self = this;
            if (!self.$invertedConcatenatedMatrix) {
                self.$invertedConcatenatedMatrix = new egret.Matrix();
            }
            self.$getConcatenatedMatrix().$invertInto(self.$invertedConcatenatedMatrix);
            return self.$invertedConcatenatedMatrix;
        };
        Object.defineProperty(DisplayObject.prototype, "x", {
            get: function () {
                return this.$getX();
            },
            set: function (value) {
                this.$setX(value);
            },
            enumerable: true,
            configurable: true
        });
        DisplayObject.prototype.$getX = function () {
            return this.$x;
        };
        DisplayObject.prototype.$setX = function (value) {
            var self = this;
            if (self.$x == value) {
                return false;
            }
            self.$x = value;
            if (egret.nativeRender) {
                self.$nativeDisplayObject.setX(value);
            }
            else {
                var p = self.$parent;
                if (p && !p.$cacheDirty) {
                    p.$cacheDirty = true;
                    p.$cacheDirtyUp();
                }
                var maskedObject = self.$maskedObject;
                if (maskedObject && !maskedObject.$cacheDirty) {
                    maskedObject.$cacheDirty = true;
                    maskedObject.$cacheDirtyUp();
                }
            }
            return true;
        };
        Object.defineProperty(DisplayObject.prototype, "y", {
            get: function () {
                return this.$getY();
            },
            set: function (value) {
                this.$setY(value);
            },
            enumerable: true,
            configurable: true
        });
        DisplayObject.prototype.$getY = function () {
            return this.$y;
        };
        DisplayObject.prototype.$setY = function (value) {
            var self = this;
            if (self.$y == value) {
                return false;
            }
            self.$y = value;
            if (egret.nativeRender) {
                self.$nativeDisplayObject.setY(value);
            }
            else {
                var p = self.$parent;
                if (p && !p.$cacheDirty) {
                    p.$cacheDirty = true;
                    p.$cacheDirtyUp();
                }
                var maskedObject = self.$maskedObject;
                if (maskedObject && !maskedObject.$cacheDirty) {
                    maskedObject.$cacheDirty = true;
                    maskedObject.$cacheDirtyUp();
                }
            }
            return true;
        };
        Object.defineProperty(DisplayObject.prototype, "scaleX", {
            get: function () {
                return this.$getScaleX();
            },
            set: function (value) {
                this.$setScaleX(value);
            },
            enumerable: true,
            configurable: true
        });
        DisplayObject.prototype.$getScaleX = function () {
            return this.$scaleX;
        };
        DisplayObject.prototype.$setScaleX = function (value) {
            var self = this;
            if (self.$scaleX == value) {
                return;
            }
            self.$scaleX = value;
            self.$matrixDirty = true;
            self.$updateUseTransform();
            if (egret.nativeRender) {
                self.$nativeDisplayObject.setScaleX(value);
            }
            else {
                var p = self.$parent;
                if (p && !p.$cacheDirty) {
                    p.$cacheDirty = true;
                    p.$cacheDirtyUp();
                }
                var maskedObject = self.$maskedObject;
                if (maskedObject && !maskedObject.$cacheDirty) {
                    maskedObject.$cacheDirty = true;
                    maskedObject.$cacheDirtyUp();
                }
            }
        };
        Object.defineProperty(DisplayObject.prototype, "scaleY", {
            get: function () {
                return this.$getScaleY();
            },
            set: function (value) {
                this.$setScaleY(value);
            },
            enumerable: true,
            configurable: true
        });
        DisplayObject.prototype.$getScaleY = function () {
            return this.$scaleY;
        };
        DisplayObject.prototype.$setScaleY = function (value) {
            var self = this;
            if (self.$scaleY == value) {
                return;
            }
            self.$scaleY = value;
            self.$matrixDirty = true;
            self.$updateUseTransform();
            if (egret.nativeRender) {
                self.$nativeDisplayObject.setScaleY(value);
            }
            else {
                var p = self.$parent;
                if (p && !p.$cacheDirty) {
                    p.$cacheDirty = true;
                    p.$cacheDirtyUp();
                }
                var maskedObject = self.$maskedObject;
                if (maskedObject && !maskedObject.$cacheDirty) {
                    maskedObject.$cacheDirty = true;
                    maskedObject.$cacheDirtyUp();
                }
            }
        };
        Object.defineProperty(DisplayObject.prototype, "rotation", {
            get: function () {
                return this.$getRotation();
            },
            set: function (value) {
                this.$setRotation(value);
            },
            enumerable: true,
            configurable: true
        });
        DisplayObject.prototype.$getRotation = function () {
            return this.$rotation;
        };
        DisplayObject.prototype.$setRotation = function (value) {
            value = clampRotation(value);
            var self = this;
            if (value == self.$rotation) {
                return;
            }
            var delta = value - self.$rotation;
            var angle = delta / 180 * Math.PI;
            self.$skewX += angle;
            self.$skewY += angle;
            self.$rotation = value;
            self.$matrixDirty = true;
            self.$updateUseTransform();
            if (egret.nativeRender) {
                self.$nativeDisplayObject.setRotation(value);
            }
            else {
                var p = self.$parent;
                if (p && !p.$cacheDirty) {
                    p.$cacheDirty = true;
                    p.$cacheDirtyUp();
                }
                var maskedObject = self.$maskedObject;
                if (maskedObject && !maskedObject.$cacheDirty) {
                    maskedObject.$cacheDirty = true;
                    maskedObject.$cacheDirtyUp();
                }
            }
        };
        Object.defineProperty(DisplayObject.prototype, "skewX", {
            get: function () {
                return this.$skewXdeg;
            },
            set: function (value) {
                this.$setSkewX(value);
            },
            enumerable: true,
            configurable: true
        });
        DisplayObject.prototype.$setSkewX = function (value) {
            var self = this;
            if (value == self.$skewXdeg) {
                return;
            }
            self.$skewXdeg = value;
            value = clampRotation(value);
            value = value / 180 * Math.PI;
            self.$skewX = value;
            self.$matrixDirty = true;
            self.$updateUseTransform();
            if (egret.nativeRender) {
                self.$nativeDisplayObject.setSkewX(self.$skewXdeg);
            }
            else {
                var p = self.$parent;
                if (p && !p.$cacheDirty) {
                    p.$cacheDirty = true;
                    p.$cacheDirtyUp();
                }
                var maskedObject = self.$maskedObject;
                if (maskedObject && !maskedObject.$cacheDirty) {
                    maskedObject.$cacheDirty = true;
                    maskedObject.$cacheDirtyUp();
                }
            }
        };
        Object.defineProperty(DisplayObject.prototype, "skewY", {
            get: function () {
                return this.$skewYdeg;
            },
            set: function (value) {
                this.$setSkewY(value);
            },
            enumerable: true,
            configurable: true
        });
        DisplayObject.prototype.$setSkewY = function (value) {
            var self = this;
            if (value == self.$skewYdeg) {
                return;
            }
            self.$skewYdeg = value;
            value = clampRotation(value);
            value = (value + self.$rotation) / 180 * Math.PI;
            self.$skewY = value;
            self.$matrixDirty = true;
            self.$updateUseTransform();
            if (egret.nativeRender) {
                self.$nativeDisplayObject.setSkewY(self.$skewYdeg);
            }
            else {
                var p = self.$parent;
                if (p && !p.$cacheDirty) {
                    p.$cacheDirty = true;
                    p.$cacheDirtyUp();
                }
                var maskedObject = self.$maskedObject;
                if (maskedObject && !maskedObject.$cacheDirty) {
                    maskedObject.$cacheDirty = true;
                    maskedObject.$cacheDirtyUp();
                }
            }
        };
        Object.defineProperty(DisplayObject.prototype, "width", {
            get: function () {
                return this.$getWidth();
            },
            set: function (value) {
                this.$setWidth(value);
            },
            enumerable: true,
            configurable: true
        });
        DisplayObject.prototype.$getWidth = function () {
            var self = this;
            return isNaN(self.$explicitWidth) ? self.$getOriginalBounds().width : self.$explicitWidth;
        };
        DisplayObject.prototype.$setWidth = function (value) {
            value = isNaN(value) ? NaN : value;
            if (this.$explicitWidth == value) {
                return;
            }
            this.$explicitWidth = value;
        };
        Object.defineProperty(DisplayObject.prototype, "height", {
            get: function () {
                return this.$getHeight();
            },
            set: function (value) {
                this.$setHeight(value);
            },
            enumerable: true,
            configurable: true
        });
        DisplayObject.prototype.$getHeight = function () {
            var self = this;
            return isNaN(self.$explicitHeight) ? self.$getOriginalBounds().height : self.$explicitHeight;
        };
        DisplayObject.prototype.$setHeight = function (value) {
            value = isNaN(value) ? NaN : value;
            if (this.$explicitHeight == value) {
                return;
            }
            this.$explicitHeight = value;
        };
        Object.defineProperty(DisplayObject.prototype, "measuredWidth", {
            get: function () {
                return this.$getOriginalBounds().width;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DisplayObject.prototype, "measuredHeight", {
            get: function () {
                return this.$getOriginalBounds().height;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DisplayObject.prototype, "anchorOffsetX", {
            get: function () {
                return this.$anchorOffsetX;
            },
            set: function (value) {
                this.$setAnchorOffsetX(value);
            },
            enumerable: true,
            configurable: true
        });
        DisplayObject.prototype.$setAnchorOffsetX = function (value) {
            var self = this;
            if (self.$anchorOffsetX == value) {
                return;
            }
            self.$anchorOffsetX = value;
            if (egret.nativeRender) {
                self.$nativeDisplayObject.setAnchorOffsetX(value);
            }
            else {
                var p = self.$parent;
                if (p && !p.$cacheDirty) {
                    p.$cacheDirty = true;
                    p.$cacheDirtyUp();
                }
                var maskedObject = self.$maskedObject;
                if (maskedObject && !maskedObject.$cacheDirty) {
                    maskedObject.$cacheDirty = true;
                    maskedObject.$cacheDirtyUp();
                }
            }
        };
        Object.defineProperty(DisplayObject.prototype, "anchorOffsetY", {
            get: function () {
                return this.$anchorOffsetY;
            },
            set: function (value) {
                this.$setAnchorOffsetY(value);
            },
            enumerable: true,
            configurable: true
        });
        DisplayObject.prototype.$setAnchorOffsetY = function (value) {
            var self = this;
            if (self.$anchorOffsetY == value) {
                return;
            }
            self.$anchorOffsetY = value;
            if (egret.nativeRender) {
                self.$nativeDisplayObject.setAnchorOffsetY(value);
            }
            else {
                var p = self.$parent;
                if (p && !p.$cacheDirty) {
                    p.$cacheDirty = true;
                    p.$cacheDirtyUp();
                }
                var maskedObject = self.$maskedObject;
                if (maskedObject && !maskedObject.$cacheDirty) {
                    maskedObject.$cacheDirty = true;
                    maskedObject.$cacheDirtyUp();
                }
            }
        };
        Object.defineProperty(DisplayObject.prototype, "visible", {
            get: function () {
                return this.$visible;
            },
            set: function (value) {
                this.$setVisible(value);
            },
            enumerable: true,
            configurable: true
        });
        DisplayObject.prototype.$setVisible = function (value) {
            var self = this;
            if (self.$visible == value) {
                return;
            }
            self.$visible = value;
            if (egret.nativeRender) {
                self.$nativeDisplayObject.setVisible(value);
            }
            else {
                self.$updateRenderMode();
                var p = self.$parent;
                if (p && !p.$cacheDirty) {
                    p.$cacheDirty = true;
                    p.$cacheDirtyUp();
                }
                var maskedObject = self.$maskedObject;
                if (maskedObject && !maskedObject.$cacheDirty) {
                    maskedObject.$cacheDirty = true;
                    maskedObject.$cacheDirtyUp();
                }
            }
        };
        Object.defineProperty(DisplayObject.prototype, "cacheAsBitmap", {
            get: function () {
                return this.$cacheAsBitmap;
            },
            set: function (value) {
                var self = this;
                self.$cacheAsBitmap = value;
                if (egret.nativeRender) {
                    self.$nativeDisplayObject.setCacheAsBitmap(value);
                }
                else {
                    self.$setHasDisplayList(value);
                }
            },
            enumerable: true,
            configurable: true
        });
        DisplayObject.prototype.$setHasDisplayList = function (value) {
            var self = this;
            var hasDisplayList = !!self.$displayList;
            if (hasDisplayList == value) {
                return;
            }
            if (value) {
                var displayList = egret.sys.DisplayList.create(self);
                if (displayList) {
                    self.$displayList = displayList;
                    self.$cacheDirty = true;
                }
            }
            else {
                self.$displayList = null;
            }
        };
        DisplayObject.prototype.$cacheDirtyUp = function () {
            var p = this.$parent;
            if (p && !p.$cacheDirty) {
                p.$cacheDirty = true;
                p.$cacheDirtyUp();
            }
        };
        Object.defineProperty(DisplayObject.prototype, "alpha", {
            get: function () {
                return this.$alpha;
            },
            set: function (value) {
                this.$setAlpha(value);
            },
            enumerable: true,
            configurable: true
        });
        DisplayObject.prototype.$setAlpha = function (value) {
            var self = this;
            if (self.$alpha == value) {
                return;
            }
            self.$alpha = value;
            if (egret.nativeRender) {
                self.$nativeDisplayObject.setAlpha(value);
            }
            else {
                self.$updateRenderMode();
                var p = self.$parent;
                if (p && !p.$cacheDirty) {
                    p.$cacheDirty = true;
                    p.$cacheDirtyUp();
                }
                var maskedObject = self.$maskedObject;
                if (maskedObject && !maskedObject.$cacheDirty) {
                    maskedObject.$cacheDirty = true;
                    maskedObject.$cacheDirtyUp();
                }
            }
        };
        Object.defineProperty(DisplayObject.prototype, "touchEnabled", {
            get: function () {
                return this.$getTouchEnabled();
            },
            set: function (value) {
                this.$setTouchEnabled(value);
            },
            enumerable: true,
            configurable: true
        });
        DisplayObject.prototype.$getTouchEnabled = function () {
            return this.$touchEnabled;
        };
        DisplayObject.prototype.$setTouchEnabled = function (value) {
            this.$touchEnabled = !!value;
        };
        Object.defineProperty(DisplayObject.prototype, "scrollRect", {
            get: function () {
                return this.$scrollRect;
            },
            set: function (value) {
                this.$setScrollRect(value);
            },
            enumerable: true,
            configurable: true
        });
        DisplayObject.prototype.$setScrollRect = function (value) {
            var self = this;
            if (!value && !self.$scrollRect) {
                self.$updateRenderMode();
                return;
            }
            if (value) {
                if (!self.$scrollRect) {
                    self.$scrollRect = new egret.Rectangle();
                }
                self.$scrollRect.copyFrom(value);
                if (egret.nativeRender) {
                    self.$nativeDisplayObject.setScrollRect(value.x, value.y, value.width, value.height);
                }
            }
            else {
                self.$scrollRect = null;
                if (egret.nativeRender) {
                    self.$nativeDisplayObject.setScrollRect(0, 0, 0, 0);
                }
            }
            if (!egret.nativeRender) {
                self.$updateRenderMode();
                var p = self.$parent;
                if (p && !p.$cacheDirty) {
                    p.$cacheDirty = true;
                    p.$cacheDirtyUp();
                }
                var maskedObject = self.$maskedObject;
                if (maskedObject && !maskedObject.$cacheDirty) {
                    maskedObject.$cacheDirty = true;
                    maskedObject.$cacheDirtyUp();
                }
            }
        };
        Object.defineProperty(DisplayObject.prototype, "blendMode", {
            get: function () {
                return egret.sys.numberToBlendMode(this.$blendMode);
            },
            set: function (value) {
                var self = this;
                var mode = egret.sys.blendModeToNumber(value);
                if (self.$blendMode == mode) {
                    return;
                }
                self.$blendMode = mode;
                if (egret.nativeRender) {
                    self.$nativeDisplayObject.setBlendMode(mode);
                }
                else {
                    self.$updateRenderMode();
                    var p = self.$parent;
                    if (p && !p.$cacheDirty) {
                        p.$cacheDirty = true;
                        p.$cacheDirtyUp();
                    }
                    var maskedObject = self.$maskedObject;
                    if (maskedObject && !maskedObject.$cacheDirty) {
                        maskedObject.$cacheDirty = true;
                        maskedObject.$cacheDirtyUp();
                    }
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DisplayObject.prototype, "mask", {
            get: function () {
                var self = this;
                return self.$mask ? self.$mask : self.$maskRect;
            },
            set: function (value) {
                var self = this;
                if (value === self) {
                    return;
                }
                if (value) {
                    if (value instanceof DisplayObject) {
                        if (value == self.$mask) {
                            return;
                        }
                        if (value.$maskedObject) {
                            value.$maskedObject.mask = null;
                        }
                        value.$maskedObject = self;
                        self.$mask = value;
                        if (!egret.nativeRender) {
                            value.$updateRenderMode();
                        }
                        if (self.$maskRect) {
                            if (egret.nativeRender) {
                                self.$nativeDisplayObject.setMaskRect(0, 0, 0, 0);
                            }
                            self.$maskRect = null;
                        }
                        if (egret.nativeRender) {
                            self.$nativeDisplayObject.setMask(value.$nativeDisplayObject.id);
                        }
                    }
                    else {
                        if (!self.$maskRect) {
                            self.$maskRect = new egret.Rectangle();
                        }
                        self.$maskRect.copyFrom(value);
                        if (egret.nativeRender) {
                            self.$nativeDisplayObject.setMaskRect(value.x, value.y, value.width, value.height);
                        }
                        if (self.$mask) {
                            self.$mask.$maskedObject = null;
                            if (!egret.nativeRender) {
                                self.$mask.$updateRenderMode();
                            }
                        }
                        if (self.mask) {
                            if (egret.nativeRender) {
                                self.$nativeDisplayObject.setMask(-1);
                            }
                            self.$mask = null;
                        }
                    }
                }
                else {
                    if (self.$mask) {
                        self.$mask.$maskedObject = null;
                        if (!egret.nativeRender) {
                            self.$mask.$updateRenderMode();
                        }
                    }
                    if (self.mask) {
                        if (egret.nativeRender) {
                            self.$nativeDisplayObject.setMask(-1);
                        }
                        self.$mask = null;
                    }
                    if (self.$maskRect) {
                        if (egret.nativeRender) {
                            self.$nativeDisplayObject.setMaskRect(0, 0, 0, 0);
                        }
                        self.$maskRect = null;
                    }
                }
                if (!egret.nativeRender) {
                    self.$updateRenderMode();
                }
            },
            enumerable: true,
            configurable: true
        });
        DisplayObject.prototype.$setMaskRect = function (value) {
            var self = this;
            if (!value && !self.$maskRect) {
                return;
            }
            if (value) {
                if (!self.$maskRect) {
                    self.$maskRect = new egret.Rectangle();
                }
                self.$maskRect.copyFrom(value);
            }
            else {
                self.$maskRect = null;
            }
        };
        Object.defineProperty(DisplayObject.prototype, "filters", {
            get: function () {
                return this.$filters;
            },
            set: function (value) {
                var self = this;
                var filters = self.$filters;
                if (!filters && !value) {
                    self.$filters = value;
                    if (egret.nativeRender) {
                        self.$nativeDisplayObject.setFilters(null);
                    }
                    else {
                        self.$updateRenderMode();
                        var p = self.$parent;
                        if (p && !p.$cacheDirty) {
                            p.$cacheDirty = true;
                            p.$cacheDirtyUp();
                        }
                        var maskedObject = self.$maskedObject;
                        if (maskedObject && !maskedObject.$cacheDirty) {
                            maskedObject.$cacheDirty = true;
                            maskedObject.$cacheDirtyUp();
                        }
                    }
                    return;
                }
                if (value && value.length) {
                    value = value.concat();
                    self.$filters = value;
                    if (egret.nativeRender) {
                        self.$nativeDisplayObject.setFilters(value);
                    }
                }
                else {
                    self.$filters = value;
                    if (egret.nativeRender) {
                        self.$nativeDisplayObject.setFilters(null);
                    }
                }
                if (!egret.nativeRender) {
                    self.$updateRenderMode();
                    var p = self.$parent;
                    if (p && !p.$cacheDirty) {
                        p.$cacheDirty = true;
                        p.$cacheDirtyUp();
                    }
                    var maskedObject = self.$maskedObject;
                    if (maskedObject && !maskedObject.$cacheDirty) {
                        maskedObject.$cacheDirty = true;
                        maskedObject.$cacheDirtyUp();
                    }
                }
            },
            enumerable: true,
            configurable: true
        });
        DisplayObject.prototype.getTransformedBounds = function (targetCoordinateSpace, resultRect) {
            targetCoordinateSpace = targetCoordinateSpace || this;
            return this.$getTransformedBounds(targetCoordinateSpace, resultRect);
        };
        DisplayObject.prototype.getBounds = function (resultRect, calculateAnchor) {
            if (calculateAnchor === void 0) { calculateAnchor = true; }
            var self = this;
            resultRect = self.$getTransformedBounds(self, resultRect);
            if (calculateAnchor) {
                if (self.$anchorOffsetX != 0) {
                    resultRect.x -= self.$anchorOffsetX;
                }
                if (self.$anchorOffsetY != 0) {
                    resultRect.y -= self.$anchorOffsetY;
                }
            }
            return resultRect;
        };
        DisplayObject.prototype.$getTransformedBounds = function (targetCoordinateSpace, resultRect) {
            var self = this;
            var bounds = self.$getOriginalBounds();
            if (!resultRect) {
                resultRect = new egret.Rectangle();
            }
            resultRect.copyFrom(bounds);
            if (targetCoordinateSpace == self) {
                return resultRect;
            }
            var m;
            if (targetCoordinateSpace) {
                m = egret.$TempMatrix;
                var invertedTargetMatrix = targetCoordinateSpace.$getInvertedConcatenatedMatrix();
                invertedTargetMatrix.$preMultiplyInto(self.$getConcatenatedMatrix(), m);
            }
            else {
                m = self.$getConcatenatedMatrix();
            }
            m.$transformBounds(resultRect);
            return resultRect;
        };
        DisplayObject.prototype.globalToLocal = function (stageX, stageY, resultPoint) {
            if (stageX === void 0) { stageX = 0; }
            if (stageY === void 0) { stageY = 0; }
            if (egret.nativeRender) {
                egret_native.updateNativeRender();
                var result = egret_native.nrGlobalToLocal(this.$nativeDisplayObject.id, stageX, stageY);
                var arr = result.split(",");
                var x = parseFloat(arr[0]);
                var y = parseFloat(arr[1]);
                if (resultPoint) {
                    resultPoint.setTo(x, y);
                }
                else {
                    resultPoint = new egret.Point(x, y);
                }
                return resultPoint;
            }
            else {
                var m = this.$getInvertedConcatenatedMatrix();
                return m.transformPoint(stageX, stageY, resultPoint);
            }
        };
        DisplayObject.prototype.localToGlobal = function (localX, localY, resultPoint) {
            if (localX === void 0) { localX = 0; }
            if (localY === void 0) { localY = 0; }
            if (egret.nativeRender) {
                egret_native.updateNativeRender();
                var result = egret_native.nrLocalToGlobal(this.$nativeDisplayObject.id, localX, localY);
                var arr = result.split(",");
                var x = parseFloat(arr[0]);
                var y = parseFloat(arr[1]);
                if (resultPoint) {
                    resultPoint.setTo(x, y);
                }
                else {
                    resultPoint = new egret.Point(x, y);
                }
                return resultPoint;
            }
            else {
                var m = this.$getConcatenatedMatrix();
                return m.transformPoint(localX, localY, resultPoint);
            }
        };
        DisplayObject.prototype.$getOriginalBounds = function () {
            var self = this;
            var bounds = self.$getContentBounds();
            self.$measureChildBounds(bounds);
            var offset = self.$measureFiltersOffset(false);
            if (offset) {
                bounds.x += offset.minX;
                bounds.y += offset.minY;
                bounds.width += -offset.minX + offset.maxX;
                bounds.height += -offset.minY + offset.maxY;
            }
            return bounds;
        };
        DisplayObject.prototype.$measureChildBounds = function (bounds) {
        };
        DisplayObject.prototype.$getContentBounds = function () {
            var bounds = egret.$TempRectangle;
            bounds.setEmpty();
            this.$measureContentBounds(bounds);
            return bounds;
        };
        DisplayObject.prototype.$measureContentBounds = function (bounds) {
        };
        DisplayObject.prototype.$getRenderNode = function () {
            var self = this;
            var node = self.$renderNode;
            if (!node) {
                return null;
            }
            if (self.$renderDirty) {
                node.cleanBeforeRender();
                self.$updateRenderNode();
                self.$renderDirty = false;
                node = self.$renderNode;
            }
            return node;
        };
        DisplayObject.prototype.$updateRenderMode = function () {
            var self = this;
            if (!self.$visible || self.$alpha <= 0 || self.$maskedObject) {
                self.$renderMode = 1;
            }
            else if (self.filters && self.filters.length > 0) {
                self.$renderMode = 2;
            }
            else if (self.$blendMode !== 0 || (self.$mask && self.$mask.$stage)) {
                self.$renderMode = 3;
            }
            else if (self.$scrollRect || self.$maskRect) {
                self.$renderMode = 4;
            }
            else {
                self.$renderMode = null;
            }
        };
        DisplayObject.prototype.$measureFiltersOffset = function (fromParent) {
            var display = this;
            var minX = 0;
            var minY = 0;
            var maxX = 0;
            var maxY = 0;
            while (display) {
                var filters = display.$filters;
                if (filters && filters.length) {
                    var length_2 = filters.length;
                    for (var i = 0; i < length_2; i++) {
                        var filter = filters[i];
                        if (filter.type == "blur") {
                            var offsetX = filter.blurX;
                            var offsetY = filter.blurY;
                            minX -= offsetX;
                            minY -= offsetY;
                            maxX += offsetX;
                            maxY += offsetY;
                        }
                        else if (filter.type == "glow") {
                            var offsetX = filter.blurX;
                            var offsetY = filter.blurY;
                            minX -= offsetX;
                            minY -= offsetY;
                            maxX += offsetX;
                            maxY += offsetY;
                            var distance = filter.distance || 0;
                            var angle = filter.angle || 0;
                            var distanceX = 0;
                            var distanceY = 0;
                            if (distance != 0) {
                                distanceX = distance * egret.NumberUtils.cos(angle);
                                if (distanceX > 0) {
                                    distanceX = Math.ceil(distanceX);
                                }
                                else {
                                    distanceX = Math.floor(distanceX);
                                }
                                distanceY = distance * egret.NumberUtils.sin(angle);
                                if (distanceY > 0) {
                                    distanceY = Math.ceil(distanceY);
                                }
                                else {
                                    distanceY = Math.floor(distanceY);
                                }
                                minX += distanceX;
                                maxX += distanceX;
                                minY += distanceY;
                                maxY += distanceY;
                            }
                        }
                        else if (filter.type == "custom") {
                            var padding = filter.padding;
                            minX -= padding;
                            minY -= padding;
                            maxX += padding;
                            maxY += padding;
                        }
                    }
                }
                if (fromParent) {
                    display = display.$parent;
                }
                else {
                    display = null;
                }
            }
            minX = Math.min(minX, 0);
            minY = Math.min(minY, 0);
            maxX = Math.max(maxX, 0);
            maxY = Math.max(maxY, 0);
            return { minX: minX, minY: minY, maxX: maxX, maxY: maxY };
        };
        DisplayObject.prototype.$getConcatenatedMatrixAt = function (root, matrix) {
            var invertMatrix = root.$getInvertedConcatenatedMatrix();
            if ((invertMatrix.a === 0 || invertMatrix.d === 0) && (invertMatrix.b === 0 || invertMatrix.c === 0)) {
                var target = this;
                var rootLevel = root.$nestLevel;
                matrix.identity();
                while (target.$nestLevel > rootLevel) {
                    var rect = target.$scrollRect;
                    if (rect) {
                        matrix.concat(egret.$TempMatrix.setTo(1, 0, 0, 1, -rect.x, -rect.y));
                    }
                    matrix.concat(target.$getMatrix());
                    target = target.$parent;
                }
            }
            else {
                invertMatrix.$preMultiplyInto(matrix, matrix);
            }
        };
        DisplayObject.prototype.$updateRenderNode = function () {
        };
        DisplayObject.prototype.$hitTest = function (stageX, stageY) {
            var self = this;
            if ((!egret.nativeRender && !self.$renderNode) || !self.$visible || self.$scaleX == 0 || self.$scaleY == 0) {
                return null;
            }
            var m = self.$getInvertedConcatenatedMatrix();
            if (m.a == 0 && m.b == 0 && m.c == 0 && m.d == 0) {
                return null;
            }
            var bounds = self.$getContentBounds();
            var localX = m.a * stageX + m.c * stageY + m.tx;
            var localY = m.b * stageX + m.d * stageY + m.ty;
            if (bounds.contains(localX, localY)) {
                if (!self.$children) {
                    var rect = self.$scrollRect ? self.$scrollRect : self.$maskRect;
                    if (rect && !rect.contains(localX, localY)) {
                        return null;
                    }
                    if (self.$mask && !self.$mask.$hitTest(stageX, stageY)) {
                        return null;
                    }
                }
                return self;
            }
            return null;
        };
        DisplayObject.prototype.hitTestPoint = function (x, y, shapeFlag) {
            var self = this;
            if (!shapeFlag) {
                if (self.$scaleX == 0 || self.$scaleY == 0) {
                    return false;
                }
                var m = self.$getInvertedConcatenatedMatrix();
                var bounds = self.getBounds(null, false);
                var localX = m.a * x + m.c * y + m.tx;
                var localY = m.b * x + m.d * y + m.ty;
                if (bounds.contains(localX, localY)) {
                    var rect = self.$scrollRect ? self.$scrollRect : self.$maskRect;
                    if (rect && !rect.contains(localX, localY)) {
                        return false;
                    }
                    return true;
                }
                return false;
            }
            else {
                var m = self.$getInvertedConcatenatedMatrix();
                var localX = m.a * x + m.c * y + m.tx;
                var localY = m.b * x + m.d * y + m.ty;
                var data = void 0;
                if (egret.nativeRender) {
                    var buffer = egret.sys.customHitTestBuffer;
                    buffer.resize(3, 3);
                    egret_native.forHitTest = true;
                    egret_native.activateBuffer(buffer);
                    egret_native.updateNativeRender();
                    egret_native.nrRenderDisplayObject2(self.$nativeDisplayObject.id, 1 - localX, 1 - localY, true);
                    try {
                        data = new Uint8Array(4);
                        egret_native.nrGetPixels(1, 1, 1, 1, data);
                    }
                    catch (e) {
                        throw new Error(egret.sys.tr(1039));
                    }
                    egret_native.activateBuffer(null);
                    egret_native.forHitTest = false;
                    if (data[3] === 0) {
                        return false;
                    }
                    return true;
                }
                else {
                    var displayList = self.$displayList;
                    if (displayList) {
                        var buffer = displayList.renderBuffer;
                        try {
                            data = buffer.getPixels(localX - displayList.offsetX, localY - displayList.offsetY);
                        }
                        catch (e) {
                            throw new Error(egret.sys.tr(1039));
                        }
                    }
                    else {
                        var buffer = egret.sys.customHitTestBuffer;
                        buffer.resize(3, 3);
                        var matrix = egret.Matrix.create();
                        matrix.identity();
                        matrix.translate(1 - localX, 1 - localY);
                        egret.sys.systemRenderer.render(this, buffer, matrix, true);
                        egret.Matrix.release(matrix);
                        try {
                            data = buffer.getPixels(1, 1);
                        }
                        catch (e) {
                            throw new Error(egret.sys.tr(1039));
                        }
                    }
                    if (data[3] === 0) {
                        return false;
                    }
                    return true;
                }
            }
        };
        DisplayObject.prototype.$addListener = function (type, listener, thisObject, useCapture, priority, dispatchOnce) {
            _super.prototype.$addListener.call(this, type, listener, thisObject, useCapture, priority, dispatchOnce);
            var isEnterFrame = (type == egret.Event.ENTER_FRAME);
            if (isEnterFrame || type == egret.Event.RENDER) {
                var list = isEnterFrame ? DisplayObject.$enterFrameCallBackList : DisplayObject.$renderCallBackList;
                if (list.indexOf(this) == -1) {
                    list.push(this);
                }
            }
        };
        DisplayObject.prototype.removeEventListener = function (type, listener, thisObject, useCapture) {
            _super.prototype.removeEventListener.call(this, type, listener, thisObject, useCapture);
            var isEnterFrame = (type == egret.Event.ENTER_FRAME);
            if ((isEnterFrame || type == egret.Event.RENDER) && !this.hasEventListener(type)) {
                var list = isEnterFrame ? DisplayObject.$enterFrameCallBackList : DisplayObject.$renderCallBackList;
                var index = list.indexOf(this);
                if (index !== -1) {
                    list.splice(index, 1);
                }
            }
        };
        DisplayObject.prototype.dispatchEvent = function (event) {
            if (!event.$bubbles) {
                return _super.prototype.dispatchEvent.call(this, event);
            }
            var list = this.$getPropagationList(this);
            var targetIndex = list.length * 0.5;
            event.$setTarget(this);
            this.$dispatchPropagationEvent(event, list, targetIndex);
            return !event.$isDefaultPrevented;
        };
        DisplayObject.prototype.$getPropagationList = function (target) {
            var list = [];
            while (target) {
                list.push(target);
                target = target.$parent;
            }
            var captureList = list.concat();
            captureList.reverse();
            list = captureList.concat(list);
            return list;
        };
        DisplayObject.prototype.$dispatchPropagationEvent = function (event, list, targetIndex) {
            var length = list.length;
            var captureIndex = targetIndex - 1;
            for (var i = 0; i < length; i++) {
                var currentTarget = list[i];
                event.$currentTarget = currentTarget;
                if (i < captureIndex)
                    event.$eventPhase = 1;
                else if (i == targetIndex || i == captureIndex)
                    event.$eventPhase = 2;
                else
                    event.$eventPhase = 3;
                currentTarget.$notifyListener(event, i < targetIndex);
                if (event.$isPropagationStopped || event.$isPropagationImmediateStopped) {
                    return;
                }
            }
        };
        DisplayObject.prototype.willTrigger = function (type) {
            var parent = this;
            while (parent) {
                if (parent.hasEventListener(type))
                    return true;
                parent = parent.$parent;
            }
            return false;
        };
        Object.defineProperty(DisplayObject.prototype, "tint", {
            get: function () {
                return this._tint;
            },
            set: function (value) {
                this._tint = value;
                this.$tintRGB = (value >> 16) + (value & 0xff00) + ((value & 0xff) << 16);
            },
            enumerable: true,
            configurable: true
        });
        DisplayObject.prototype.sortChildren = function () {
            this.$sortDirty = false;
        };
        Object.defineProperty(DisplayObject.prototype, "zIndex", {
            get: function () {
                return this._zIndex;
            },
            set: function (value) {
                this._zIndex = value;
                if (this.parent) {
                    this.parent.$sortDirty = true;
                }
            },
            enumerable: true,
            configurable: true
        });
        DisplayObject.defaultTouchEnabled = false;
        DisplayObject.$enterFrameCallBackList = [];
        DisplayObject.$renderCallBackList = [];
        return DisplayObject;
    }(egret.EventDispatcher));
    egret.DisplayObject = DisplayObject;
})(egret || (egret = {}));
var egret;
(function (egret) {
    var Bitmap = (function (_super) {
        __extends(Bitmap, _super);
        function Bitmap(value) {
            var _this = _super.call(this) || this;
            _this.$texture = null;
            _this.$bitmapData = null;
            _this.$bitmapX = 0;
            _this.$bitmapY = 0;
            _this.$bitmapWidth = 0;
            _this.$bitmapHeight = 0;
            _this.$offsetX = 0;
            _this.$offsetY = 0;
            _this.$textureWidth = 0;
            _this.$textureHeight = 0;
            _this.$sourceWidth = 0;
            _this.$sourceHeight = 0;
            _this.$smoothing = Bitmap.defaultSmoothing;
            _this.$explicitBitmapWidth = NaN;
            _this.$explicitBitmapHeight = NaN;
            _this.$scale9Grid = null;
            _this.$fillMode = "scale";
            _this._pixelHitTest = false;
            _this.$renderNode = new egret.sys.NormalBitmapNode();
            _this.$setTexture(value);
            if (value)
                _this.$renderNode.rotated = value.$rotated;
            return _this;
        }
        Bitmap.prototype.createNativeDisplayObject = function () {
            this.$nativeDisplayObject = new egret_native.NativeDisplayObject(1);
        };
        Bitmap.prototype.$onAddToStage = function (stage, nestLevel) {
            _super.prototype.$onAddToStage.call(this, stage, nestLevel);
            var texture = this.$texture;
            if (texture && texture.$bitmapData) {
                egret.BitmapData.$addDisplayObject(this, texture.$bitmapData);
            }
        };
        Bitmap.prototype.$onRemoveFromStage = function () {
            _super.prototype.$onRemoveFromStage.call(this);
            var texture = this.$texture;
            if (texture) {
                egret.BitmapData.$removeDisplayObject(this, texture.$bitmapData);
            }
        };
        Object.defineProperty(Bitmap.prototype, "texture", {
            get: function () {
                return this.$texture;
            },
            set: function (value) {
                var self = this;
                self.$setTexture(value);
                if (value && self.$renderNode) {
                    self.$renderNode.rotated = value.$rotated;
                }
            },
            enumerable: true,
            configurable: true
        });
        Bitmap.prototype.$setTexture = function (value) {
            var self = this;
            var oldTexture = self.$texture;
            if (value == oldTexture) {
                return false;
            }
            self.$texture = value;
            if (value) {
                self.$refreshImageData();
            }
            else {
                if (oldTexture) {
                    egret.BitmapData.$removeDisplayObject(self, oldTexture.$bitmapData);
                }
                self.setImageData(null, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
                self.$renderDirty = true;
                var p_1 = self.$parent;
                if (p_1 && !p_1.$cacheDirty) {
                    p_1.$cacheDirty = true;
                    p_1.$cacheDirtyUp();
                }
                var maskedObject_1 = self.$maskedObject;
                if (maskedObject_1 && !maskedObject_1.$cacheDirty) {
                    maskedObject_1.$cacheDirty = true;
                    maskedObject_1.$cacheDirtyUp();
                }
                if (egret.nativeRender) {
                    this.setBitmapDataToWasm(null);
                }
                return true;
            }
            if (self.$stage) {
                if (oldTexture && oldTexture.$bitmapData) {
                    var oldHashCode = oldTexture.$bitmapData.hashCode;
                    var newHashCode = value.$bitmapData ? value.$bitmapData.hashCode : -1;
                    if (oldHashCode == newHashCode) {
                        self.$renderDirty = true;
                        var p_2 = self.$parent;
                        if (p_2 && !p_2.$cacheDirty) {
                            p_2.$cacheDirty = true;
                            p_2.$cacheDirtyUp();
                        }
                        var maskedObject_2 = self.$maskedObject;
                        if (maskedObject_2 && !maskedObject_2.$cacheDirty) {
                            maskedObject_2.$cacheDirty = true;
                            maskedObject_2.$cacheDirtyUp();
                        }
                        return true;
                    }
                    egret.BitmapData.$removeDisplayObject(self, oldTexture.$bitmapData);
                }
                egret.BitmapData.$addDisplayObject(self, value.$bitmapData);
            }
            self.$renderDirty = true;
            var p = self.$parent;
            if (p && !p.$cacheDirty) {
                p.$cacheDirty = true;
                p.$cacheDirtyUp();
            }
            var maskedObject = self.$maskedObject;
            if (maskedObject && !maskedObject.$cacheDirty) {
                maskedObject.$cacheDirty = true;
                maskedObject.$cacheDirtyUp();
            }
            return true;
        };
        Bitmap.prototype.$setBitmapData = function (value) {
            this.$setTexture(value);
        };
        Bitmap.prototype.setBitmapDataToWasm = function (data) {
            this.$nativeDisplayObject.setTexture(data);
        };
        Bitmap.prototype.$refreshImageData = function () {
            var texture = this.$texture;
            if (texture) {
                if (egret.nativeRender) {
                    this.setBitmapDataToWasm(texture);
                }
                this.setImageData(texture.$bitmapData, texture.$bitmapX, texture.$bitmapY, texture.$bitmapWidth, texture.$bitmapHeight, texture.$offsetX, texture.$offsetY, texture.$getTextureWidth(), texture.$getTextureHeight(), texture.$sourceWidth, texture.$sourceHeight);
            }
            else {
                if (egret.nativeRender) {
                    this.setBitmapDataToWasm(null);
                }
            }
        };
        Bitmap.prototype.setImageData = function (bitmapData, bitmapX, bitmapY, bitmapWidth, bitmapHeight, offsetX, offsetY, textureWidth, textureHeight, sourceWidth, sourceHeight) {
            this.$bitmapData = bitmapData;
            this.$bitmapX = bitmapX;
            this.$bitmapY = bitmapY;
            this.$bitmapWidth = bitmapWidth;
            this.$bitmapHeight = bitmapHeight;
            this.$offsetX = offsetX;
            this.$offsetY = offsetY;
            this.$textureWidth = textureWidth;
            this.$textureHeight = textureHeight;
            this.$sourceWidth = sourceWidth;
            this.$sourceHeight = sourceHeight;
        };
        Object.defineProperty(Bitmap.prototype, "scale9Grid", {
            get: function () {
                return this.$scale9Grid;
            },
            set: function (value) {
                this.$setScale9Grid(value);
            },
            enumerable: true,
            configurable: true
        });
        Bitmap.prototype.$setScale9Grid = function (value) {
            var self = this;
            self.$scale9Grid = value;
            self.$renderDirty = true;
            if (egret.nativeRender) {
                if (value) {
                    self.$nativeDisplayObject.setScale9Grid(value.x, value.y, value.width, value.height);
                }
                else {
                    self.$nativeDisplayObject.setScale9Grid(0, 0, -1, -1);
                }
            }
            else {
                var p = self.$parent;
                if (p && !p.$cacheDirty) {
                    p.$cacheDirty = true;
                    p.$cacheDirtyUp();
                }
                var maskedObject = self.$maskedObject;
                if (maskedObject && !maskedObject.$cacheDirty) {
                    maskedObject.$cacheDirty = true;
                    maskedObject.$cacheDirtyUp();
                }
            }
        };
        Object.defineProperty(Bitmap.prototype, "fillMode", {
            get: function () {
                return this.$fillMode;
            },
            set: function (value) {
                this.$setFillMode(value);
            },
            enumerable: true,
            configurable: true
        });
        Bitmap.prototype.$setFillMode = function (value) {
            var self = this;
            if (value == self.$fillMode) {
                return false;
            }
            self.$fillMode = value;
            if (egret.nativeRender) {
                self.$nativeDisplayObject.setBitmapFillMode(self.$fillMode);
            }
            else {
                self.$renderDirty = true;
                var p = self.$parent;
                if (p && !p.$cacheDirty) {
                    p.$cacheDirty = true;
                    p.$cacheDirtyUp();
                }
                var maskedObject = self.$maskedObject;
                if (maskedObject && !maskedObject.$cacheDirty) {
                    maskedObject.$cacheDirty = true;
                    maskedObject.$cacheDirtyUp();
                }
            }
            return true;
        };
        Object.defineProperty(Bitmap.prototype, "smoothing", {
            get: function () {
                return this.$smoothing;
            },
            set: function (value) {
                var self = this;
                if (value == this.$smoothing) {
                    return;
                }
                this.$smoothing = value;
                this.$renderNode.smoothing = value;
                if (!egret.nativeRender) {
                    var p = self.$parent;
                    if (p && !p.$cacheDirty) {
                        p.$cacheDirty = true;
                        p.$cacheDirtyUp();
                    }
                    var maskedObject = self.$maskedObject;
                    if (maskedObject && !maskedObject.$cacheDirty) {
                        maskedObject.$cacheDirty = true;
                        maskedObject.$cacheDirtyUp();
                    }
                }
            },
            enumerable: true,
            configurable: true
        });
        Bitmap.prototype.$setWidth = function (value) {
            var self = this;
            if (value < 0 || value == self.$explicitBitmapWidth) {
                return false;
            }
            self.$explicitBitmapWidth = value;
            self.$renderDirty = true;
            if (egret.nativeRender) {
                self.$nativeDisplayObject.setWidth(value);
            }
            else {
                var p = self.$parent;
                if (p && !p.$cacheDirty) {
                    p.$cacheDirty = true;
                    p.$cacheDirtyUp();
                }
                var maskedObject = self.$maskedObject;
                if (maskedObject && !maskedObject.$cacheDirty) {
                    maskedObject.$cacheDirty = true;
                    maskedObject.$cacheDirtyUp();
                }
            }
            return true;
        };
        Bitmap.prototype.$setHeight = function (value) {
            var self = this;
            if (value < 0 || value == self.$explicitBitmapHeight) {
                return false;
            }
            self.$explicitBitmapHeight = value;
            self.$renderDirty = true;
            if (egret.nativeRender) {
                self.$nativeDisplayObject.setHeight(value);
            }
            else {
                var p = self.$parent;
                if (p && !p.$cacheDirty) {
                    p.$cacheDirty = true;
                    p.$cacheDirtyUp();
                }
                var maskedObject = self.$maskedObject;
                if (maskedObject && !maskedObject.$cacheDirty) {
                    maskedObject.$cacheDirty = true;
                    maskedObject.$cacheDirtyUp();
                }
            }
            return true;
        };
        Bitmap.prototype.$getWidth = function () {
            return isNaN(this.$explicitBitmapWidth) ? this.$getContentBounds().width : this.$explicitBitmapWidth;
        };
        Bitmap.prototype.$getHeight = function () {
            return isNaN(this.$explicitBitmapHeight) ? this.$getContentBounds().height : this.$explicitBitmapHeight;
        };
        Bitmap.prototype.$measureContentBounds = function (bounds) {
            if (this.$bitmapData) {
                var w = !isNaN(this.$explicitBitmapWidth) ? this.$explicitBitmapWidth : this.$textureWidth;
                var h = !isNaN(this.$explicitBitmapHeight) ? this.$explicitBitmapHeight : this.$textureHeight;
                bounds.setTo(0, 0, w, h);
            }
            else {
                var w = !isNaN(this.$explicitBitmapWidth) ? this.$explicitBitmapWidth : 0;
                var h = !isNaN(this.$explicitBitmapHeight) ? this.$explicitBitmapHeight : 0;
                bounds.setTo(0, 0, w, h);
            }
        };
        Bitmap.prototype.$updateRenderNode = function () {
            if (this.$texture) {
                var destW = !isNaN(this.$explicitBitmapWidth) ? this.$explicitBitmapWidth : this.$textureWidth;
                var destH = !isNaN(this.$explicitBitmapHeight) ? this.$explicitBitmapHeight : this.$textureHeight;
                var scale9Grid = this.scale9Grid || this.$texture["scale9Grid"];
                if (scale9Grid) {
                    if (this.$renderNode instanceof egret.sys.NormalBitmapNode) {
                        this.$renderNode = new egret.sys.BitmapNode();
                    }
                    egret.sys.BitmapNode.$updateTextureDataWithScale9Grid(this.$renderNode, this.$bitmapData, scale9Grid, this.$bitmapX, this.$bitmapY, this.$bitmapWidth, this.$bitmapHeight, this.$offsetX, this.$offsetY, this.$textureWidth, this.$textureHeight, destW, destH, this.$sourceWidth, this.$sourceHeight, this.$smoothing);
                }
                else {
                    if (this.fillMode == egret.BitmapFillMode.REPEAT && this.$renderNode instanceof egret.sys.NormalBitmapNode) {
                        this.$renderNode = new egret.sys.BitmapNode();
                    }
                    egret.sys.BitmapNode.$updateTextureData(this.$renderNode, this.$bitmapData, this.$bitmapX, this.$bitmapY, this.$bitmapWidth, this.$bitmapHeight, this.$offsetX, this.$offsetY, this.$textureWidth, this.$textureHeight, destW, destH, this.$sourceWidth, this.$sourceHeight, this.$fillMode, this.$smoothing);
                }
            }
        };
        Object.defineProperty(Bitmap.prototype, "pixelHitTest", {
            get: function () {
                return this._pixelHitTest;
            },
            set: function (value) {
                this._pixelHitTest = !!value;
            },
            enumerable: true,
            configurable: true
        });
        Bitmap.prototype.$hitTest = function (stageX, stageY) {
            var target = _super.prototype.$hitTest.call(this, stageX, stageY);
            if (target && this._pixelHitTest) {
                var boo = this.hitTestPoint(stageX, stageY, true);
                if (!boo) {
                    target = null;
                }
            }
            return target;
        };
        Bitmap.defaultSmoothing = true;
        return Bitmap;
    }(egret.DisplayObject));
    egret.Bitmap = Bitmap;
})(egret || (egret = {}));
var egret;
(function (egret) {
    function createMap() {
        var obj = Object.create(null);
        obj.__v8__ = undefined;
        delete obj.__v8__;
        return obj;
    }
    egret.createMap = createMap;
})(egret || (egret = {}));
var egret;
(function (egret) {
    var CompressedTextureData = (function () {
        function CompressedTextureData() {
        }
        return CompressedTextureData;
    }());
    egret.CompressedTextureData = CompressedTextureData;
    egret.etc_alpha_mask = 'etc_alpha_mask';
    egret.engine_default_empty_texture = 'engine_default_empty_texture';
    egret.is_compressed_texture = 'is_compressed_texture';
    egret.glContext = 'glContext';
    egret.UNPACK_PREMULTIPLY_ALPHA_WEBGL = 'UNPACK_PREMULTIPLY_ALPHA_WEBGL';
    var BitmapData = (function (_super) {
        __extends(BitmapData, _super);
        function BitmapData(source) {
            var _this = _super.call(this) || this;
            _this.format = "image";
            _this.$deleteSource = true;
            _this.compressedTextureData = [];
            _this.debugCompressedTextureURL = '';
            _this.etcAlphaMask = null;
            if (egret.nativeRender) {
                var nativeBitmapData = new egret_native.NativeBitmapData();
                nativeBitmapData.$init();
                _this.$nativeBitmapData = nativeBitmapData;
            }
            _this.source = source;
            _this.source = source;
            if (_this.source) {
                _this.width = +source.width;
                _this.height = +source.height;
            }
            else {
            }
            return _this;
        }
        Object.defineProperty(BitmapData.prototype, "source", {
            get: function () {
                return this.$source;
            },
            set: function (value) {
                this.$source = value;
                if (egret.nativeRender) {
                    egret_native.NativeDisplayObject.setSourceToNativeBitmapData(this.$nativeBitmapData, value);
                }
            },
            enumerable: true,
            configurable: true
        });
        BitmapData.create = function (type, data, callback) {
            var base64 = "";
            if (type === "arraybuffer") {
                base64 = egret.Base64Util.encode(data);
            }
            else {
                base64 = data;
            }
            var imageType = "image/png";
            if (base64.charAt(0) === '/') {
                imageType = "image/jpeg";
            }
            else if (base64.charAt(0) === 'R') {
                imageType = "image/gif";
            }
            else if (base64.charAt(0) === 'i') {
                imageType = "image/png";
            }
            var img = new Image();
            img.src = "data:" + imageType + ";base64," + base64;
            img.crossOrigin = '*';
            var bitmapData = new BitmapData(img);
            img.onload = function () {
                img.onload = undefined;
                bitmapData.source = img;
                bitmapData.height = img.height;
                bitmapData.width = img.width;
                if (callback) {
                    callback(bitmapData);
                }
            };
            return bitmapData;
        };
        BitmapData.prototype.$dispose = function () {
            if (egret.Capabilities.renderMode == "webgl" && this.webGLTexture) {
                egret.WebGLUtils.deleteWebGLTexture(this.webGLTexture);
                this.webGLTexture = null;
            }
            if (this.source && this.source.dispose) {
                this.source.dispose();
            }
            if (this.source && this.source.src) {
                this.source.src = "";
            }
            this.source = null;
            this.clearCompressedTextureData();
            this.debugCompressedTextureURL = '';
            this.etcAlphaMask = null;
            if (egret.nativeRender) {
                egret_native.NativeDisplayObject.disposeNativeBitmapData(this.$nativeBitmapData);
            }
            BitmapData.$dispose(this);
        };
        BitmapData.$addDisplayObject = function (displayObject, bitmapData) {
            if (!bitmapData) {
                return;
            }
            var hashCode = bitmapData.hashCode;
            if (!hashCode) {
                return;
            }
            if (!BitmapData._displayList[hashCode]) {
                BitmapData._displayList[hashCode] = [displayObject];
                return;
            }
            var tempList = BitmapData._displayList[hashCode];
            if (tempList.indexOf(displayObject) < 0) {
                tempList.push(displayObject);
            }
        };
        BitmapData.$removeDisplayObject = function (displayObject, bitmapData) {
            if (!bitmapData) {
                return;
            }
            var hashCode = bitmapData.hashCode;
            if (!hashCode) {
                return;
            }
            if (!BitmapData._displayList[hashCode]) {
                return;
            }
            var tempList = BitmapData._displayList[hashCode];
            var index = tempList.indexOf(displayObject);
            if (index >= 0) {
                tempList.splice(index, 1);
            }
        };
        BitmapData.$invalidate = function (bitmapData) {
            if (!bitmapData) {
                return;
            }
            var hashCode = bitmapData.hashCode;
            if (!hashCode) {
                return;
            }
            if (!BitmapData._displayList[hashCode]) {
                return;
            }
            var tempList = BitmapData._displayList[hashCode];
            for (var i = 0; i < tempList.length; i++) {
                if (tempList[i] instanceof egret.Bitmap) {
                    tempList[i].$refreshImageData();
                }
                var bitmap = tempList[i];
                bitmap.$renderDirty = true;
                var p = bitmap.$parent;
                if (p && !p.$cacheDirty) {
                    p.$cacheDirty = true;
                    p.$cacheDirtyUp();
                }
                var maskedObject = bitmap.$maskedObject;
                if (maskedObject && !maskedObject.$cacheDirty) {
                    maskedObject.$cacheDirty = true;
                    maskedObject.$cacheDirtyUp();
                }
            }
        };
        BitmapData.$dispose = function (bitmapData) {
            if (!bitmapData) {
                return;
            }
            var hashCode = bitmapData.hashCode;
            if (!hashCode) {
                return;
            }
            if (!BitmapData._displayList[hashCode]) {
                return;
            }
            var tempList = BitmapData._displayList[hashCode];
            for (var _i = 0, tempList_1 = tempList; _i < tempList_1.length; _i++) {
                var node = tempList_1[_i];
                if (node instanceof egret.Bitmap) {
                    node.$bitmapData = null;
                }
                node.$renderDirty = true;
                var p = node.$parent;
                if (p && !p.$cacheDirty) {
                    p.$cacheDirty = true;
                    p.$cacheDirtyUp();
                }
                var maskedObject = node.$maskedObject;
                if (maskedObject && !maskedObject.$cacheDirty) {
                    maskedObject.$cacheDirty = true;
                    maskedObject.$cacheDirtyUp();
                }
            }
            delete BitmapData._displayList[hashCode];
        };
        BitmapData.prototype._getCompressedTextureData = function (level, face) {
            var levelData = this.compressedTextureData[level];
            return levelData ? levelData[face] : null;
        };
        BitmapData.prototype.getCompressed2dTextureData = function () {
            return this._getCompressedTextureData(0, 0);
        };
        BitmapData.prototype.hasCompressed2d = function () {
            return !!this.getCompressed2dTextureData();
        };
        BitmapData.prototype.clearCompressedTextureData = function () {
            this.compressedTextureData.length = 0;
        };
        BitmapData._displayList = egret.createMap();
        return BitmapData;
    }(egret.HashObject));
    egret.BitmapData = BitmapData;
})(egret || (egret = {}));
var egret;
(function (egret) {
    egret.BitmapFillMode = {
        REPEAT: "repeat",
        SCALE: "scale",
        CLIP: "clip"
    };
})(egret || (egret = {}));
var egret;
(function (egret) {
    var BlendMode = (function () {
        function BlendMode() {
        }
        BlendMode.NORMAL = "normal";
        BlendMode.ADD = "add";
        BlendMode.ERASE = "erase";
        return BlendMode;
    }());
    egret.BlendMode = BlendMode;
})(egret || (egret = {}));
(function (egret) {
    var sys;
    (function (sys) {
        var blendModeString = ["normal", "add", "erase"];
        var blendModeNumber = {};
        var length = blendModeString.length;
        for (var i = 0; i < length; i++) {
            var str = blendModeString[i];
            blendModeNumber[str] = i;
        }
        function blendModeToNumber(blendMode) {
            var num = blendModeNumber[blendMode];
            return num === undefined ? 0 : num;
        }
        sys.blendModeToNumber = blendModeToNumber;
        function numberToBlendMode(blendMode) {
            var str = blendModeString[blendMode];
            return str === undefined ? "normal" : str;
        }
        sys.numberToBlendMode = numberToBlendMode;
    })(sys = egret.sys || (egret.sys = {}));
})(egret || (egret = {}));
var egret;
(function (egret) {
    egret.CapsStyle = {
        NONE: "none",
        ROUND: "round",
        SQUARE: "square"
    };
})(egret || (egret = {}));
var egret;
(function (egret) {
    var DisplayObjectContainer = (function (_super) {
        __extends(DisplayObjectContainer, _super);
        function DisplayObjectContainer() {
            var _this = _super.call(this) || this;
            _this.$touchChildren = true;
            _this.$children = [];
            return _this;
        }
        Object.defineProperty(DisplayObjectContainer.prototype, "numChildren", {
            get: function () {
                return this.$children.length;
            },
            enumerable: true,
            configurable: true
        });
        DisplayObjectContainer.prototype.setChildrenSortMode = function (value) {
            if (egret.nativeRender && this.$nativeDisplayObject.setChildrenSortMode) {
                this.$nativeDisplayObject.setChildrenSortMode(value);
            }
        };
        DisplayObjectContainer.prototype.addChild = function (child) {
            var index = this.$children.length;
            if (child.$parent == this)
                index--;
            return this.$doAddChild(child, index);
        };
        DisplayObjectContainer.prototype.addChildAt = function (child, index) {
            index = +index | 0;
            if (index < 0 || index >= this.$children.length) {
                index = this.$children.length;
                if (child.$parent == this) {
                    index--;
                }
            }
            return this.$doAddChild(child, index);
        };
        DisplayObjectContainer.prototype.$doAddChild = function (child, index, notifyListeners) {
            if (notifyListeners === void 0) { notifyListeners = true; }
            var self = this;
            var host = child.$parent;
            if (host == self) {
                self.doSetChildIndex(child, index);
                return child;
            }
            if (host) {
                host.removeChild(child);
            }
            self.$children.splice(index, 0, child);
            child.$setParent(self);
            if (egret.nativeRender) {
                self.$nativeDisplayObject.addChildAt(child.$nativeDisplayObject.id, index);
            }
            var stage = self.$stage;
            if (stage) {
                child.$onAddToStage(stage, self.$nestLevel + 1);
            }
            if (notifyListeners) {
                child.dispatchEventWith(egret.Event.ADDED, true);
            }
            if (stage) {
                var list = DisplayObjectContainer.$EVENT_ADD_TO_STAGE_LIST;
                while (list.length) {
                    var childAddToStage = list.shift();
                    if (childAddToStage.$stage && notifyListeners) {
                        childAddToStage.dispatchEventWith(egret.Event.ADDED_TO_STAGE);
                    }
                }
            }
            if (!egret.nativeRender) {
                if (child.$maskedObject) {
                    child.$maskedObject.$updateRenderMode();
                }
                if (!self.$cacheDirty) {
                    self.$cacheDirty = true;
                    var p = self.$parent;
                    if (p && !p.$cacheDirty) {
                        p.$cacheDirty = true;
                        p.$cacheDirtyUp();
                    }
                    var maskedObject = self.$maskedObject;
                    if (maskedObject && !maskedObject.$cacheDirty) {
                        maskedObject.$cacheDirty = true;
                        maskedObject.$cacheDirtyUp();
                    }
                }
            }
            this.$childAdded(child, index);
            return child;
        };
        DisplayObjectContainer.prototype.contains = function (child) {
            while (child) {
                if (child == this) {
                    return true;
                }
                child = child.$parent;
            }
            return false;
        };
        DisplayObjectContainer.prototype.getChildAt = function (index) {
            index = +index | 0;
            if (index >= 0 && index < this.$children.length) {
                return this.$children[index];
            }
            return null;
        };
        DisplayObjectContainer.prototype.getChildIndex = function (child) {
            return this.$children.indexOf(child);
        };
        DisplayObjectContainer.prototype.getChildByName = function (name) {
            var children = this.$children;
            var length = children.length;
            var displayObject;
            for (var i = 0; i < length; i++) {
                displayObject = children[i];
                if (displayObject.name == name) {
                    return displayObject;
                }
            }
            return null;
        };
        DisplayObjectContainer.prototype.removeChild = function (child) {
            var index = this.$children.indexOf(child);
            if (index >= 0) {
                return this.$doRemoveChild(index);
            }
            return null;
        };
        DisplayObjectContainer.prototype.removeChildAt = function (index) {
            index = +index | 0;
            if (index >= 0 && index < this.$children.length) {
                return this.$doRemoveChild(index);
            }
            return null;
        };
        DisplayObjectContainer.prototype.$doRemoveChild = function (index, notifyListeners) {
            if (notifyListeners === void 0) { notifyListeners = true; }
            index = +index | 0;
            var self = this;
            var children = this.$children;
            var child = children[index];
            this.$childRemoved(child, index);
            if (notifyListeners) {
                child.dispatchEventWith(egret.Event.REMOVED, true);
            }
            if (this.$stage) {
                child.$onRemoveFromStage();
                var list = DisplayObjectContainer.$EVENT_REMOVE_FROM_STAGE_LIST;
                while (list.length > 0) {
                    var childAddToStage = list.shift();
                    if (notifyListeners && childAddToStage.$hasAddToStage) {
                        childAddToStage.$hasAddToStage = false;
                        childAddToStage.dispatchEventWith(egret.Event.REMOVED_FROM_STAGE);
                    }
                    childAddToStage.$hasAddToStage = false;
                    childAddToStage.$stage = null;
                }
            }
            var displayList = this.$displayList || this.$parentDisplayList;
            child.$setParent(null);
            var indexNow = children.indexOf(child);
            if (indexNow != -1) {
                children.splice(indexNow, 1);
            }
            if (egret.nativeRender) {
                self.$nativeDisplayObject.removeChild(child.$nativeDisplayObject.id);
            }
            else {
                if (child.$maskedObject) {
                    child.$maskedObject.$updateRenderMode();
                }
                if (!self.$cacheDirty) {
                    self.$cacheDirty = true;
                    var p = self.$parent;
                    if (p && !p.$cacheDirty) {
                        p.$cacheDirty = true;
                        p.$cacheDirtyUp();
                    }
                    var maskedObject = self.$maskedObject;
                    if (maskedObject && !maskedObject.$cacheDirty) {
                        maskedObject.$cacheDirty = true;
                        maskedObject.$cacheDirtyUp();
                    }
                }
            }
            return child;
        };
        DisplayObjectContainer.prototype.setChildIndex = function (child, index) {
            index = +index | 0;
            if (index < 0 || index >= this.$children.length) {
                index = this.$children.length - 1;
            }
            this.doSetChildIndex(child, index);
        };
        DisplayObjectContainer.prototype.doSetChildIndex = function (child, index) {
            var self = this;
            var lastIndex = this.$children.indexOf(child);
            if (lastIndex == index) {
                return;
            }
            this.$childRemoved(child, lastIndex);
            this.$children.splice(lastIndex, 1);
            this.$children.splice(index, 0, child);
            this.$childAdded(child, index);
            if (egret.nativeRender) {
                this.$nativeDisplayObject.removeChild(child.$nativeDisplayObject.id);
                this.$nativeDisplayObject.addChildAt(child.$nativeDisplayObject.id, index);
            }
            else {
                if (!self.$cacheDirty) {
                    self.$cacheDirty = true;
                    var p = self.$parent;
                    if (p && !p.$cacheDirty) {
                        p.$cacheDirty = true;
                        p.$cacheDirtyUp();
                    }
                    var maskedObject = self.$maskedObject;
                    if (maskedObject && !maskedObject.$cacheDirty) {
                        maskedObject.$cacheDirty = true;
                        maskedObject.$cacheDirtyUp();
                    }
                }
            }
        };
        DisplayObjectContainer.prototype.swapChildrenAt = function (index1, index2) {
            index1 = +index1 | 0;
            index2 = +index2 | 0;
            if (index1 >= 0 && index1 < this.$children.length && index2 >= 0 && index2 < this.$children.length) {
                this.doSwapChildrenAt(index1, index2);
            }
        };
        DisplayObjectContainer.prototype.swapChildren = function (child1, child2) {
            var index1 = this.$children.indexOf(child1);
            var index2 = this.$children.indexOf(child2);
            if (index1 == -1 || index2 == -1) {
            }
            else {
                this.doSwapChildrenAt(index1, index2);
            }
        };
        DisplayObjectContainer.prototype.doSwapChildrenAt = function (index1, index2) {
            var self = this;
            if (index1 > index2) {
                var temp = index2;
                index2 = index1;
                index1 = temp;
            }
            else if (index1 == index2) {
                return;
            }
            var list = this.$children;
            var child1 = list[index1];
            var child2 = list[index2];
            this.$childRemoved(child1, index1);
            this.$childRemoved(child2, index2);
            list[index1] = child2;
            list[index2] = child1;
            this.$childAdded(child2, index1);
            this.$childAdded(child1, index2);
            if (egret.nativeRender) {
                this.$nativeDisplayObject.swapChild(index1, index2);
            }
            else {
                if (!self.$cacheDirty) {
                    self.$cacheDirty = true;
                    var p = self.$parent;
                    if (p && !p.$cacheDirty) {
                        p.$cacheDirty = true;
                        p.$cacheDirtyUp();
                    }
                    var maskedObject = self.$maskedObject;
                    if (maskedObject && !maskedObject.$cacheDirty) {
                        maskedObject.$cacheDirty = true;
                        maskedObject.$cacheDirtyUp();
                    }
                }
            }
        };
        DisplayObjectContainer.prototype.removeChildren = function () {
            var children = this.$children;
            for (var i = children.length - 1; i >= 0; i--) {
                this.$doRemoveChild(i);
            }
        };
        DisplayObjectContainer.prototype.$childAdded = function (child, index) {
        };
        DisplayObjectContainer.prototype.$childRemoved = function (child, index) {
        };
        DisplayObjectContainer.prototype.$onAddToStage = function (stage, nestLevel) {
            _super.prototype.$onAddToStage.call(this, stage, nestLevel);
            var children = this.$children;
            var length = children.length;
            nestLevel++;
            for (var i = 0; i < length; i++) {
                var child = this.$children[i];
                child.$onAddToStage(stage, nestLevel);
                if (child.$maskedObject) {
                    child.$maskedObject.$updateRenderMode();
                }
            }
        };
        DisplayObjectContainer.prototype.$onRemoveFromStage = function () {
            _super.prototype.$onRemoveFromStage.call(this);
            var children = this.$children;
            var length = children.length;
            for (var i = 0; i < length; i++) {
                var child = children[i];
                child.$onRemoveFromStage();
            }
        };
        DisplayObjectContainer.prototype.$measureChildBounds = function (bounds) {
            var children = this.$children;
            var length = children.length;
            if (length == 0) {
                return;
            }
            var xMin = 0, xMax = 0, yMin = 0, yMax = 0;
            var found = false;
            for (var i = -1; i < length; i++) {
                var childBounds = void 0;
                if (i == -1) {
                    childBounds = bounds;
                }
                else {
                    children[i].getBounds(egret.$TempRectangle);
                    children[i].$getMatrix().$transformBounds(egret.$TempRectangle);
                    childBounds = egret.$TempRectangle;
                }
                if (childBounds.isEmpty()) {
                    continue;
                }
                if (found) {
                    xMin = Math.min(xMin, childBounds.x);
                    xMax = Math.max(xMax, childBounds.x + childBounds.width);
                    yMin = Math.min(yMin, childBounds.y);
                    yMax = Math.max(yMax, childBounds.y + childBounds.height);
                }
                else {
                    found = true;
                    xMin = childBounds.x;
                    xMax = xMin + childBounds.width;
                    yMin = childBounds.y;
                    yMax = yMin + childBounds.height;
                }
            }
            bounds.setTo(xMin, yMin, xMax - xMin, yMax - yMin);
        };
        Object.defineProperty(DisplayObjectContainer.prototype, "touchChildren", {
            get: function () {
                return this.$getTouchChildren();
            },
            set: function (value) {
                this.$setTouchChildren(!!value);
            },
            enumerable: true,
            configurable: true
        });
        DisplayObjectContainer.prototype.$getTouchChildren = function () {
            return this.$touchChildren;
        };
        DisplayObjectContainer.prototype.$setTouchChildren = function (value) {
            if (this.$touchChildren == value) {
                return false;
            }
            this.$touchChildren = value;
            return true;
        };
        DisplayObjectContainer.prototype.$hitTest = function (stageX, stageY) {
            if (!this.$visible) {
                return null;
            }
            var m = this.$getInvertedConcatenatedMatrix();
            var localX = m.a * stageX + m.c * stageY + m.tx;
            var localY = m.b * stageX + m.d * stageY + m.ty;
            var rect = this.$scrollRect ? this.$scrollRect : this.$maskRect;
            if (rect && !rect.contains(localX, localY)) {
                return null;
            }
            if (this.$mask && !this.$mask.$hitTest(stageX, stageY)) {
                return null;
            }
            var children = this.$children;
            var found = false;
            var target = null;
            for (var i = children.length - 1; i >= 0; i--) {
                var child = children[i];
                if (child.$maskedObject) {
                    continue;
                }
                target = child.$hitTest(stageX, stageY);
                if (target) {
                    found = true;
                    if (target.$touchEnabled) {
                        break;
                    }
                    else {
                        target = null;
                    }
                }
            }
            if (target) {
                if (this.$touchChildren) {
                    return target;
                }
                return this;
            }
            if (found) {
                return this;
            }
            return _super.prototype.$hitTest.call(this, stageX, stageY);
        };
        DisplayObjectContainer.prototype._sortChildrenFunc = function (a, b) {
            if (a.zIndex === b.zIndex) {
                return a.$lastSortedIndex - b.$lastSortedIndex;
            }
            return a.zIndex - b.zIndex;
        };
        DisplayObjectContainer.prototype.sortChildren = function () {
            _super.prototype.sortChildren.call(this);
            this.$sortDirty = false;
            var sortRequired = false;
            var children = this.$children;
            var child = null;
            for (var i = 0, j = children.length; i < j; ++i) {
                child = children[i];
                child.$lastSortedIndex = i;
                if (!sortRequired && child.zIndex !== 0) {
                    sortRequired = true;
                }
            }
            if (sortRequired && children.length > 1) {
                children.sort(this._sortChildrenFunc);
            }
        };
        DisplayObjectContainer.$EVENT_ADD_TO_STAGE_LIST = [];
        DisplayObjectContainer.$EVENT_REMOVE_FROM_STAGE_LIST = [];
        return DisplayObjectContainer;
    }(egret.DisplayObject));
    egret.DisplayObjectContainer = DisplayObjectContainer;
})(egret || (egret = {}));
var egret;
(function (egret) {
    var GradientType = (function () {
        function GradientType() {
        }
        GradientType.LINEAR = "linear";
        GradientType.RADIAL = "radial";
        return GradientType;
    }());
    egret.GradientType = GradientType;
})(egret || (egret = {}));
var egret;
(function (egret) {
    function clampAngle(value) {
        value %= Math.PI * 2;
        if (value < 0) {
            value += Math.PI * 2;
        }
        return value;
    }
    function createBezierPoints(pointsData, pointsAmount) {
        var points = [];
        for (var i = 0; i < pointsAmount; i++) {
            var point = getBezierPointByFactor(pointsData, i / pointsAmount);
            if (point)
                points.push(point);
        }
        return points;
    }
    function getBezierPointByFactor(pointsData, t) {
        var i = 0;
        var x = 0, y = 0;
        var len = pointsData.length;
        if (len / 2 == 3) {
            var x0 = pointsData[i++];
            var y0 = pointsData[i++];
            var x1 = pointsData[i++];
            var y1 = pointsData[i++];
            var x2 = pointsData[i++];
            var y2 = pointsData[i++];
            x = getCurvePoint(x0, x1, x2, t);
            y = getCurvePoint(y0, y1, y2, t);
        }
        else if (len / 2 == 4) {
            var x0 = pointsData[i++];
            var y0 = pointsData[i++];
            var x1 = pointsData[i++];
            var y1 = pointsData[i++];
            var x2 = pointsData[i++];
            var y2 = pointsData[i++];
            var x3 = pointsData[i++];
            var y3 = pointsData[i++];
            x = getCubicCurvePoint(x0, x1, x2, x3, t);
            y = getCubicCurvePoint(y0, y1, y2, y3, t);
        }
        return egret.Point.create(x, y);
    }
    function getCurvePoint(value0, value1, value2, factor) {
        var result = Math.pow((1 - factor), 2) * value0 + 2 * factor * (1 - factor) * value1 + Math.pow(factor, 2) * value2;
        return result;
    }
    function getCubicCurvePoint(value0, value1, value2, value3, factor) {
        var result = Math.pow((1 - factor), 3) * value0 + 3 * factor * Math.pow((1 - factor), 2) * value1 + 3 * (1 - factor) * Math.pow(factor, 2) * value2 + Math.pow(factor, 3) * value3;
        return result;
    }
    var Graphics = (function (_super) {
        __extends(Graphics, _super);
        function Graphics() {
            var _this = _super.call(this) || this;
            _this.lastX = 0;
            _this.lastY = 0;
            _this.fillPath = null;
            _this.strokePath = null;
            _this.topLeftStrokeWidth = 0;
            _this.bottomRightStrokeWidth = 0;
            _this.minX = Infinity;
            _this.minY = Infinity;
            _this.maxX = -Infinity;
            _this.maxY = -Infinity;
            _this.includeLastPosition = true;
            _this.$renderNode = new egret.sys.GraphicsNode();
            return _this;
        }
        Graphics.prototype.$setTarget = function (target) {
            if (this.$targetDisplay) {
                this.$targetDisplay.$renderNode = null;
            }
            target.$renderNode = this.$renderNode;
            this.$targetDisplay = target;
            this.$targetIsSprite = target instanceof egret.Sprite;
        };
        Graphics.prototype.setStrokeWidth = function (width) {
            switch (width) {
                case 1:
                    this.topLeftStrokeWidth = 0;
                    this.bottomRightStrokeWidth = 1;
                    break;
                case 3:
                    this.topLeftStrokeWidth = 1;
                    this.bottomRightStrokeWidth = 2;
                    break;
                default:
                    var half = Math.ceil(width * 0.5) | 0;
                    this.topLeftStrokeWidth = half;
                    this.bottomRightStrokeWidth = half;
                    break;
            }
        };
        Graphics.prototype.beginFill = function (color, alpha) {
            if (alpha === void 0) { alpha = 1; }
            color = +color || 0;
            alpha = +alpha || 0;
            if (egret.nativeRender) {
                this.$targetDisplay.$nativeDisplayObject.setBeginFill(color, alpha);
            }
            this.fillPath = this.$renderNode.beginFill(color, alpha, this.strokePath);
            if (this.$renderNode.drawData.length > 1) {
                this.fillPath.moveTo(this.lastX, this.lastY);
            }
        };
        Graphics.prototype.beginGradientFill = function (type, colors, alphas, ratios, matrix) {
            if (matrix === void 0) { matrix = null; }
            if (egret.nativeRender) {
                this.$targetDisplay.$nativeDisplayObject.setBeginGradientFill(type, colors, alphas, ratios, matrix);
            }
            this.fillPath = this.$renderNode.beginGradientFill(type, colors, alphas, ratios, matrix, this.strokePath);
            if (this.$renderNode.drawData.length > 1) {
                this.fillPath.moveTo(this.lastX, this.lastY);
            }
        };
        Graphics.prototype.endFill = function () {
            if (egret.nativeRender) {
                this.$targetDisplay.$nativeDisplayObject.setEndFill();
            }
            this.fillPath = null;
        };
        Graphics.prototype.lineStyle = function (thickness, color, alpha, pixelHinting, scaleMode, caps, joints, miterLimit, lineDash) {
            if (thickness === void 0) { thickness = NaN; }
            if (color === void 0) { color = 0; }
            if (alpha === void 0) { alpha = 1.0; }
            if (pixelHinting === void 0) { pixelHinting = false; }
            if (scaleMode === void 0) { scaleMode = "normal"; }
            if (caps === void 0) { caps = null; }
            if (joints === void 0) { joints = null; }
            if (miterLimit === void 0) { miterLimit = 3; }
            thickness = +thickness || 0;
            color = +color || 0;
            alpha = +alpha || 0;
            miterLimit = +miterLimit || 0;
            if (egret.nativeRender) {
                this.$targetDisplay.$nativeDisplayObject.setLineStyle(thickness, color, alpha, pixelHinting, scaleMode, caps, joints, miterLimit);
            }
            if (thickness <= 0) {
                this.strokePath = null;
                this.setStrokeWidth(0);
            }
            else {
                this.setStrokeWidth(thickness);
                this.strokePath = this.$renderNode.lineStyle(thickness, color, alpha, caps, joints, miterLimit, lineDash);
                if (this.$renderNode.drawData.length > 1) {
                    this.strokePath.moveTo(this.lastX, this.lastY);
                }
            }
        };
        Graphics.prototype.drawRect = function (x, y, width, height) {
            x = +x || 0;
            y = +y || 0;
            width = +width || 0;
            height = +height || 0;
            if (egret.nativeRender) {
                this.$targetDisplay.$nativeDisplayObject.setDrawRect(x, y, width, height);
            }
            var fillPath = this.fillPath;
            var strokePath = this.strokePath;
            fillPath && fillPath.drawRect(x, y, width, height);
            strokePath && strokePath.drawRect(x, y, width, height);
            this.extendBoundsByPoint(x + width, y + height);
            this.updatePosition(x, y);
            this.dirty();
        };
        Graphics.prototype.drawRoundRect = function (x, y, width, height, ellipseWidth, ellipseHeight) {
            x = +x || 0;
            y = +y || 0;
            width = +width || 0;
            height = +height || 0;
            ellipseWidth = +ellipseWidth || 0;
            ellipseHeight = +ellipseHeight || 0;
            if (egret.nativeRender) {
                this.$targetDisplay.$nativeDisplayObject.setDrawRoundRect(x, y, width, height, ellipseWidth, ellipseHeight);
            }
            var fillPath = this.fillPath;
            var strokePath = this.strokePath;
            fillPath && fillPath.drawRoundRect(x, y, width, height, ellipseWidth, ellipseHeight);
            strokePath && strokePath.drawRoundRect(x, y, width, height, ellipseWidth, ellipseHeight);
            var radiusX = (ellipseWidth * 0.5) | 0;
            var radiusY = ellipseHeight ? (ellipseHeight * 0.5) | 0 : radiusX;
            var right = x + width;
            var bottom = y + height;
            var ybw = bottom - radiusY;
            this.extendBoundsByPoint(x, y);
            this.extendBoundsByPoint(right, bottom);
            this.updatePosition(right, ybw);
            this.dirty();
        };
        Graphics.prototype.drawCircle = function (x, y, radius) {
            x = +x || 0;
            y = +y || 0;
            radius = +radius || 0;
            if (egret.nativeRender) {
                this.$targetDisplay.$nativeDisplayObject.setDrawCircle(x, y, radius);
            }
            var fillPath = this.fillPath;
            var strokePath = this.strokePath;
            fillPath && fillPath.drawCircle(x, y, radius);
            strokePath && strokePath.drawCircle(x, y, radius);
            this.extendBoundsByPoint(x - radius - 1, y - radius - 1);
            this.extendBoundsByPoint(x + radius + 2, y + radius + 2);
            this.updatePosition(x + radius, y);
            this.dirty();
        };
        Graphics.prototype.drawEllipse = function (x, y, width, height) {
            x = +x || 0;
            y = +y || 0;
            width = +width || 0;
            height = +height || 0;
            if (egret.nativeRender) {
                this.$targetDisplay.$nativeDisplayObject.setDrawEllipse(x, y, width, height);
            }
            var fillPath = this.fillPath;
            var strokePath = this.strokePath;
            fillPath && fillPath.drawEllipse(x, y, width, height);
            strokePath && strokePath.drawEllipse(x, y, width, height);
            this.extendBoundsByPoint(x - 1, y - 1);
            this.extendBoundsByPoint(x + width + 2, y + height + 2);
            this.updatePosition(x + width, y + height * 0.5);
            this.dirty();
        };
        Graphics.prototype.moveTo = function (x, y) {
            x = +x || 0;
            y = +y || 0;
            if (egret.nativeRender) {
                this.$targetDisplay.$nativeDisplayObject.setMoveTo(x, y);
            }
            var fillPath = this.fillPath;
            var strokePath = this.strokePath;
            fillPath && fillPath.moveTo(x, y);
            strokePath && strokePath.moveTo(x, y);
            this.includeLastPosition = false;
            this.lastX = x;
            this.lastY = y;
            this.dirty();
        };
        Graphics.prototype.lineTo = function (x, y) {
            x = +x || 0;
            y = +y || 0;
            if (egret.nativeRender) {
                this.$targetDisplay.$nativeDisplayObject.setLineTo(x, y);
            }
            var fillPath = this.fillPath;
            var strokePath = this.strokePath;
            fillPath && fillPath.lineTo(x, y);
            strokePath && strokePath.lineTo(x, y);
            this.updatePosition(x, y);
            this.dirty();
        };
        Graphics.prototype.curveTo = function (controlX, controlY, anchorX, anchorY) {
            controlX = +controlX || 0;
            controlY = +controlY || 0;
            anchorX = +anchorX || 0;
            anchorY = +anchorY || 0;
            if (egret.nativeRender) {
                this.$targetDisplay.$nativeDisplayObject.setCurveTo(controlX, controlY, anchorX, anchorY);
            }
            var fillPath = this.fillPath;
            var strokePath = this.strokePath;
            fillPath && fillPath.curveTo(controlX, controlY, anchorX, anchorY);
            strokePath && strokePath.curveTo(controlX, controlY, anchorX, anchorY);
            var lastX = this.lastX || 0;
            var lastY = this.lastY || 0;
            var bezierPoints = createBezierPoints([lastX, lastY, controlX, controlY, anchorX, anchorY], 50);
            for (var i = 0; i < bezierPoints.length; i++) {
                var point = bezierPoints[i];
                this.extendBoundsByPoint(point.x, point.y);
                egret.Point.release(point);
            }
            this.extendBoundsByPoint(anchorX, anchorY);
            this.updatePosition(anchorX, anchorY);
            this.dirty();
        };
        Graphics.prototype.cubicCurveTo = function (controlX1, controlY1, controlX2, controlY2, anchorX, anchorY) {
            controlX1 = +controlX1 || 0;
            controlY1 = +controlY1 || 0;
            controlX2 = +controlX2 || 0;
            controlY2 = +controlY2 || 0;
            anchorX = +anchorX || 0;
            anchorY = +anchorY || 0;
            if (egret.nativeRender) {
                this.$targetDisplay.$nativeDisplayObject.setCubicCurveTo(controlX1, controlY1, controlX2, controlY2, anchorX, anchorY);
            }
            var fillPath = this.fillPath;
            var strokePath = this.strokePath;
            fillPath && fillPath.cubicCurveTo(controlX1, controlY1, controlX2, controlY2, anchorX, anchorY);
            strokePath && strokePath.cubicCurveTo(controlX1, controlY1, controlX2, controlY2, anchorX, anchorY);
            var lastX = this.lastX || 0;
            var lastY = this.lastY || 0;
            var bezierPoints = createBezierPoints([lastX, lastY, controlX1, controlY1, controlX2, controlY2, anchorX, anchorY], 50);
            for (var i = 0; i < bezierPoints.length; i++) {
                var point = bezierPoints[i];
                this.extendBoundsByPoint(point.x, point.y);
                egret.Point.release(point);
            }
            this.extendBoundsByPoint(anchorX, anchorY);
            this.updatePosition(anchorX, anchorY);
            this.dirty();
        };
        Graphics.prototype.drawArc = function (x, y, radius, startAngle, endAngle, anticlockwise) {
            if (radius < 0 || startAngle === endAngle) {
                return;
            }
            x = +x || 0;
            y = +y || 0;
            radius = +radius || 0;
            startAngle = +startAngle || 0;
            endAngle = +endAngle || 0;
            anticlockwise = !!anticlockwise;
            startAngle = clampAngle(startAngle);
            endAngle = clampAngle(endAngle);
            if (egret.nativeRender) {
                this.$targetDisplay.$nativeDisplayObject.setDrawArc(x, y, radius, startAngle, endAngle, anticlockwise);
            }
            var fillPath = this.fillPath;
            var strokePath = this.strokePath;
            if (fillPath) {
                fillPath.$lastX = this.lastX;
                fillPath.$lastY = this.lastY;
                fillPath.drawArc(x, y, radius, startAngle, endAngle, anticlockwise);
            }
            if (strokePath) {
                strokePath.$lastX = this.lastX;
                strokePath.$lastY = this.lastY;
                strokePath.drawArc(x, y, radius, startAngle, endAngle, anticlockwise);
            }
            if (anticlockwise) {
                this.arcBounds(x, y, radius, endAngle, startAngle);
            }
            else {
                this.arcBounds(x, y, radius, startAngle, endAngle);
            }
            var endX = x + Math.cos(endAngle) * radius;
            var endY = y + Math.sin(endAngle) * radius;
            this.updatePosition(endX, endY);
            this.dirty();
        };
        Graphics.prototype.dirty = function () {
            var self = this;
            self.$renderNode.dirtyRender = true;
            if (!egret.nativeRender) {
                var target = self.$targetDisplay;
                target.$cacheDirty = true;
                var p = target.$parent;
                if (p && !p.$cacheDirty) {
                    p.$cacheDirty = true;
                    p.$cacheDirtyUp();
                }
                var maskedObject = target.$maskedObject;
                if (maskedObject && !maskedObject.$cacheDirty) {
                    maskedObject.$cacheDirty = true;
                    maskedObject.$cacheDirtyUp();
                }
            }
        };
        Graphics.prototype.arcBounds = function (x, y, radius, startAngle, endAngle) {
            var PI = Math.PI;
            if (Math.abs(startAngle - endAngle) < 0.01) {
                this.extendBoundsByPoint(x - radius, y - radius);
                this.extendBoundsByPoint(x + radius, y + radius);
                return;
            }
            if (startAngle > endAngle) {
                endAngle += PI * 2;
            }
            var startX = Math.cos(startAngle) * radius;
            var endX = Math.cos(endAngle) * radius;
            var xMin = Math.min(startX, endX);
            var xMax = Math.max(startX, endX);
            var startY = Math.sin(startAngle) * radius;
            var endY = Math.sin(endAngle) * radius;
            var yMin = Math.min(startY, endY);
            var yMax = Math.max(startY, endY);
            var startRange = startAngle / (PI * 0.5);
            var endRange = endAngle / (PI * 0.5);
            for (var i = Math.ceil(startRange); i <= endRange; i++) {
                switch (i % 4) {
                    case 0:
                        xMax = radius;
                        break;
                    case 1:
                        yMax = radius;
                        break;
                    case 2:
                        xMin = -radius;
                        break;
                    case 3:
                        yMin = -radius;
                        break;
                }
            }
            xMin = Math.floor(xMin);
            yMin = Math.floor(yMin);
            xMax = Math.ceil(xMax);
            yMax = Math.ceil(yMax);
            this.extendBoundsByPoint(xMin + x, yMin + y);
            this.extendBoundsByPoint(xMax + x, yMax + y);
        };
        Graphics.prototype.clear = function () {
            if (egret.nativeRender) {
                this.$targetDisplay.$nativeDisplayObject.setGraphicsClear();
            }
            this.$renderNode.clear();
            this.updatePosition(0, 0);
            this.minX = Infinity;
            this.minY = Infinity;
            this.maxX = -Infinity;
            this.maxY = -Infinity;
            this.dirty();
        };
        Graphics.prototype.extendBoundsByPoint = function (x, y) {
            this.extendBoundsByX(x);
            this.extendBoundsByY(y);
        };
        Graphics.prototype.extendBoundsByX = function (x) {
            this.minX = Math.min(this.minX, x - this.topLeftStrokeWidth);
            this.maxX = Math.max(this.maxX, x + this.bottomRightStrokeWidth);
            this.updateNodeBounds();
        };
        Graphics.prototype.extendBoundsByY = function (y) {
            this.minY = Math.min(this.minY, y - this.topLeftStrokeWidth);
            this.maxY = Math.max(this.maxY, y + this.bottomRightStrokeWidth);
            this.updateNodeBounds();
        };
        Graphics.prototype.updateNodeBounds = function () {
            var node = this.$renderNode;
            node.x = this.minX;
            node.y = this.minY;
            node.width = Math.ceil(this.maxX - this.minX);
            node.height = Math.ceil(this.maxY - this.minY);
        };
        Graphics.prototype.updatePosition = function (x, y) {
            if (!this.includeLastPosition) {
                this.extendBoundsByPoint(this.lastX, this.lastY);
                this.includeLastPosition = true;
            }
            this.lastX = x;
            this.lastY = y;
            this.extendBoundsByPoint(x, y);
        };
        Graphics.prototype.$measureContentBounds = function (bounds) {
            if (this.minX === Infinity) {
                bounds.setEmpty();
            }
            else {
                bounds.setTo(this.minX, this.minY, this.maxX - this.minX, this.maxY - this.minY);
            }
        };
        Graphics.prototype.$hitTest = function (stageX, stageY) {
            var target = this.$targetDisplay;
            var m = target.$getInvertedConcatenatedMatrix();
            var localX = m.a * stageX + m.c * stageY + m.tx;
            var localY = m.b * stageX + m.d * stageY + m.ty;
            var buffer = egret.sys.canvasHitTestBuffer;
            buffer.resize(3, 3);
            var node = this.$renderNode;
            var matrix = egret.Matrix.create();
            matrix.identity();
            matrix.translate(1 - localX, 1 - localY);
            egret.sys.canvasRenderer.drawNodeToBuffer(node, buffer, matrix, true);
            egret.Matrix.release(matrix);
            try {
                var data = buffer.getPixels(1, 1);
                if (data[3] === 0) {
                    return null;
                }
            }
            catch (e) {
                throw new Error(egret.sys.tr(1039));
            }
            return target;
        };
        Graphics.prototype.$onRemoveFromStage = function () {
            if (this.$renderNode) {
                this.$renderNode.clean();
            }
            if (egret.nativeRender) {
                egret_native.NativeDisplayObject.disposeGraphicData(this);
            }
        };
        return Graphics;
    }(egret.HashObject));
    egret.Graphics = Graphics;
})(egret || (egret = {}));
var egret;
(function (egret) {
    egret.JointStyle = {
        BEVEL: "bevel",
        MITER: "miter",
        ROUND: "round"
    };
})(egret || (egret = {}));
var egret;
(function (egret) {
    var KTXContainer = (function () {
        function KTXContainer(arrayBuffer, facesExpected, threeDExpected, textureArrayExpected) {
            this.arrayBuffer = arrayBuffer;
            this.isInvalid = false;
            var identifier = new Uint8Array(this.arrayBuffer, 0, 12);
            if (identifier[0] !== 0xAB || identifier[1] !== 0x4B || identifier[2] !== 0x54 || identifier[3] !== 0x58 || identifier[4] !== 0x20 || identifier[5] !== 0x31 ||
                identifier[6] !== 0x31 || identifier[7] !== 0xBB || identifier[8] !== 0x0D || identifier[9] !== 0x0A || identifier[10] !== 0x1A || identifier[11] !== 0x0A) {
                this.isInvalid = true;
                console.error("texture missing KTX identifier");
                return;
            }
            var dataSize = Uint32Array.BYTES_PER_ELEMENT;
            var headerDataView = new DataView(this.arrayBuffer, 12, 13 * dataSize);
            var endianness = headerDataView.getUint32(0, true);
            var littleEndian = endianness === 0x04030201;
            this.glType = headerDataView.getUint32(1 * dataSize, littleEndian);
            this.glTypeSize = headerDataView.getUint32(2 * dataSize, littleEndian);
            this.glFormat = headerDataView.getUint32(3 * dataSize, littleEndian);
            this.glInternalFormat = headerDataView.getUint32(4 * dataSize, littleEndian);
            this.glBaseInternalFormat = headerDataView.getUint32(5 * dataSize, littleEndian);
            this.pixelWidth = headerDataView.getUint32(6 * dataSize, littleEndian);
            this.pixelHeight = headerDataView.getUint32(7 * dataSize, littleEndian);
            this.pixelDepth = headerDataView.getUint32(8 * dataSize, littleEndian);
            this.numberOfArrayElements = headerDataView.getUint32(9 * dataSize, littleEndian);
            this.numberOfFaces = headerDataView.getUint32(10 * dataSize, littleEndian);
            this.numberOfMipmapLevels = headerDataView.getUint32(11 * dataSize, littleEndian);
            this.bytesOfKeyValueData = headerDataView.getUint32(12 * dataSize, littleEndian);
            if (this.glType !== 0) {
                console.error("only compressed formats currently supported");
                return;
            }
            else {
                this.numberOfMipmapLevels = Math.max(1, this.numberOfMipmapLevels);
            }
            if (this.pixelHeight === 0 || this.pixelDepth !== 0) {
                console.error("only 2D textures currently supported");
                return;
            }
            if (this.numberOfArrayElements !== 0) {
                console.error("texture arrays not currently supported");
                return;
            }
            if (this.numberOfFaces !== facesExpected) {
                console.error("number of faces expected" + facesExpected + ", but found " + this.numberOfFaces);
                return;
            }
            this.loadType = KTXContainer.COMPRESSED_2D;
        }
        KTXContainer.prototype.uploadLevels = function (bitmapData, loadMipmaps) {
            if (this.loadType === KTXContainer.COMPRESSED_2D) {
                this._upload2DCompressedLevels(bitmapData, loadMipmaps);
            }
        };
        KTXContainer.prototype._upload2DCompressedLevels = function (bitmapData, loadMipmaps) {
            bitmapData.clearCompressedTextureData();
            var compressedTextureData = bitmapData.compressedTextureData;
            var dataOffset = KTXContainer.HEADER_LEN + this.bytesOfKeyValueData;
            var width = this.pixelWidth;
            var height = this.pixelHeight;
            var mipmapCount = loadMipmaps ? this.numberOfMipmapLevels : 1;
            for (var level = 0; level < mipmapCount; level++) {
                var imageSize = new Int32Array(this.arrayBuffer, dataOffset, 1)[0];
                dataOffset += 4;
                var levelData = [];
                for (var face = 0; face < this.numberOfFaces; face++) {
                    var byteArray = new Uint8Array(this.arrayBuffer, dataOffset, imageSize);
                    var compressedData = new egret.CompressedTextureData;
                    compressedData.glInternalFormat = this.glInternalFormat;
                    compressedData.width = width;
                    compressedData.height = height;
                    compressedData.byteArray = byteArray;
                    compressedData.face = face;
                    compressedData.level = level;
                    levelData.push(compressedData);
                    dataOffset += imageSize;
                    dataOffset += 3 - ((imageSize + 3) % 4);
                }
                compressedTextureData.push(levelData);
                width = Math.max(1.0, width * 0.5);
                height = Math.max(1.0, height * 0.5);
            }
            var compressed2d = bitmapData.getCompressed2dTextureData();
            if (compressed2d) {
                bitmapData.width = compressed2d.width;
                bitmapData.height = compressed2d.height;
            }
        };
        KTXContainer.HEADER_LEN = 12 + (13 * 4);
        KTXContainer.COMPRESSED_2D = 0;
        KTXContainer.COMPRESSED_3D = 1;
        KTXContainer.TEX_2D = 2;
        KTXContainer.TEX_3D = 3;
        return KTXContainer;
    }());
    egret.KTXContainer = KTXContainer;
})(egret || (egret = {}));
var egret;
(function (egret) {
    var Mesh = (function (_super) {
        __extends(Mesh, _super);
        function Mesh(value) {
            var _this = _super.call(this, value) || this;
            _this._verticesDirty = true;
            _this._bounds = new egret.Rectangle();
            _this.$renderNode = new egret.sys.MeshNode();
            return _this;
        }
        Mesh.prototype.createNativeDisplayObject = function () {
            this.$nativeDisplayObject = new egret_native.NativeDisplayObject(12);
        };
        Mesh.prototype.setBitmapDataToWasm = function (data) {
            this.$nativeDisplayObject.setBitmapDataToMesh(data);
        };
        Mesh.prototype.$updateRenderNode = function () {
            var image = this.$bitmapData;
            if (!image) {
                return;
            }
            var scale = egret.$TextureScaleFactor;
            var node = this.$renderNode;
            node.smoothing = this.$smoothing;
            node.image = image;
            node.imageWidth = this.$sourceWidth;
            node.imageHeight = this.$sourceHeight;
            var destW = !isNaN(this.$explicitBitmapWidth) ? this.$explicitBitmapWidth : this.$textureWidth;
            var destH = !isNaN(this.$explicitBitmapHeight) ? this.$explicitBitmapHeight : this.$textureHeight;
            var tsX = destW / this.$textureWidth;
            var tsY = destH / this.$textureHeight;
            var bitmapWidth = this.$bitmapWidth;
            var bitmapHeight = this.$bitmapHeight;
            node.drawMesh(this.$bitmapX, this.$bitmapY, bitmapWidth, bitmapHeight, this.$offsetX * tsX, this.$offsetY * tsY, tsX * bitmapWidth, tsY * bitmapHeight);
        };
        Mesh.prototype.$updateVertices = function () {
            var self = this;
            self._verticesDirty = true;
            self.$renderDirty = true;
            if (egret.nativeRender) {
                var renderNode = (this.$renderNode);
                this.$nativeDisplayObject.setDataToMesh(renderNode.vertices, renderNode.indices, renderNode.uvs);
            }
            else {
                var p = self.$parent;
                if (p && !p.$cacheDirty) {
                    p.$cacheDirty = true;
                    p.$cacheDirtyUp();
                }
                var maskedObject = self.$maskedObject;
                if (maskedObject && !maskedObject.$cacheDirty) {
                    maskedObject.$cacheDirty = true;
                    maskedObject.$cacheDirtyUp();
                }
            }
        };
        Mesh.prototype.$measureContentBounds = function (bounds) {
            if (this._verticesDirty) {
                this._verticesDirty = false;
                var node = this.$renderNode;
                var vertices = node.vertices;
                if (vertices.length) {
                    this._bounds.setTo(Number.MAX_VALUE, Number.MAX_VALUE, -Number.MAX_VALUE, -Number.MAX_VALUE);
                    for (var i = 0, l = vertices.length; i < l; i += 2) {
                        var x = vertices[i];
                        var y = vertices[i + 1];
                        if (this._bounds.x > x)
                            this._bounds.x = x;
                        if (this._bounds.width < x)
                            this._bounds.width = x;
                        if (this._bounds.y > y)
                            this._bounds.y = y;
                        if (this._bounds.height < y)
                            this._bounds.height = y;
                    }
                    this._bounds.width -= this._bounds.x;
                    this._bounds.height -= this._bounds.y;
                }
                else {
                    this._bounds.setTo(0, 0, 0, 0);
                }
                node.bounds.copyFrom(this._bounds);
            }
            bounds.copyFrom(this._bounds);
        };
        return Mesh;
    }(egret.Bitmap));
    egret.Mesh = Mesh;
})(egret || (egret = {}));
var egret;
(function (egret) {
    egret.OrientationMode = {
        AUTO: "auto",
        PORTRAIT: "portrait",
        LANDSCAPE: "landscape",
        LANDSCAPE_FLIPPED: "landscapeFlipped"
    };
})(egret || (egret = {}));
var egret;
(function (egret) {
    egret.$TextureScaleFactor = 1;
    var Texture = (function (_super) {
        __extends(Texture, _super);
        function Texture() {
            var _this = _super.call(this) || this;
            _this.disposeBitmapData = true;
            _this.$bitmapX = 0;
            _this.$bitmapY = 0;
            _this.$bitmapWidth = 0;
            _this.$bitmapHeight = 0;
            _this.$offsetX = 0;
            _this.$offsetY = 0;
            _this.$textureWidth = 0;
            _this.$textureHeight = 0;
            _this.$sourceWidth = 0;
            _this.$sourceHeight = 0;
            _this.$bitmapData = null;
            _this.$ktxData = null;
            _this.$rotated = false;
            return _this;
        }
        Object.defineProperty(Texture.prototype, "textureWidth", {
            get: function () {
                return this.$getTextureWidth();
            },
            enumerable: true,
            configurable: true
        });
        Texture.prototype.$getTextureWidth = function () {
            return this.$textureWidth;
        };
        Object.defineProperty(Texture.prototype, "textureHeight", {
            get: function () {
                return this.$getTextureHeight();
            },
            enumerable: true,
            configurable: true
        });
        Texture.prototype.$getTextureHeight = function () {
            return this.$textureHeight;
        };
        Texture.prototype.$getScaleBitmapWidth = function () {
            return this.$bitmapWidth * egret.$TextureScaleFactor;
        };
        Texture.prototype.$getScaleBitmapHeight = function () {
            return this.$bitmapHeight * egret.$TextureScaleFactor;
        };
        Object.defineProperty(Texture.prototype, "bitmapData", {
            get: function () {
                return this.$bitmapData;
            },
            set: function (value) {
                this.$ktxData = null;
                this._setBitmapData(value);
            },
            enumerable: true,
            configurable: true
        });
        Texture.prototype._setBitmapData = function (value) {
            this.$bitmapData = value;
            var scale = egret.$TextureScaleFactor;
            var w = value.width * scale;
            var h = value.height * scale;
            this.$initData(0, 0, w, h, 0, 0, w, h, value.width, value.height);
        };
        Object.defineProperty(Texture.prototype, "ktxData", {
            get: function () {
                return this.$ktxData;
            },
            set: function (data) {
                this._setKtxData(data);
            },
            enumerable: true,
            configurable: true
        });
        Texture.prototype._setKtxData = function (value) {
            if (!value) {
                egret.error('ktx data is null');
                return;
            }
            if (value == this.$ktxData) {
                return;
            }
            var ktx = new egret.KTXContainer(value, 1);
            if (ktx.isInvalid) {
                egret.error('ktx data is invalid');
                return;
            }
            this.$ktxData = value;
            var bitmapData = new egret.BitmapData(value);
            bitmapData.format = 'ktx';
            ktx.uploadLevels(bitmapData, false);
            this._setBitmapData(bitmapData);
        };
        Texture.prototype.$initData = function (bitmapX, bitmapY, bitmapWidth, bitmapHeight, offsetX, offsetY, textureWidth, textureHeight, sourceWidth, sourceHeight, rotated) {
            if (rotated === void 0) { rotated = false; }
            var scale = egret.$TextureScaleFactor;
            this.$bitmapX = bitmapX / scale;
            this.$bitmapY = bitmapY / scale;
            this.$bitmapWidth = bitmapWidth / scale;
            this.$bitmapHeight = bitmapHeight / scale;
            this.$offsetX = offsetX;
            this.$offsetY = offsetY;
            this.$textureWidth = textureWidth;
            this.$textureHeight = textureHeight;
            this.$sourceWidth = sourceWidth;
            this.$sourceHeight = sourceHeight;
            this.$rotated = rotated;
            egret.BitmapData.$invalidate(this.$bitmapData);
        };
        Texture.prototype.getPixel32 = function (x, y) {
            throw new Error();
        };
        Texture.prototype.getPixels = function (x, y, width, height) {
            if (width === void 0) { width = 1; }
            if (height === void 0) { height = 1; }
            throw new Error();
        };
        Texture.prototype.toDataURL = function (type, rect, encoderOptions) {
            throw new Error();
        };
        Texture.prototype.saveToFile = function (type, filePath, rect) {
            throw new Error();
        };
        Texture.prototype.dispose = function () {
            if (this.$bitmapData) {
                if (this.disposeBitmapData) {
                    this.$bitmapData.$dispose();
                }
                this.$bitmapData = null;
            }
        };
        return Texture;
    }(egret.HashObject));
    egret.Texture = Texture;
})(egret || (egret = {}));
var egret;
(function (egret) {
    var RenderTexture = (function (_super) {
        __extends(RenderTexture, _super);
        function RenderTexture() {
            var _this = _super.call(this) || this;
            _this.$renderBuffer = new egret.sys.RenderBuffer();
            var bitmapData = new egret.BitmapData(_this.$renderBuffer.surface);
            bitmapData.$deleteSource = false;
            _this._setBitmapData(bitmapData);
            return _this;
        }
        RenderTexture.prototype.drawToTexture = function (displayObject, clipBounds, scale) {
            if (scale === void 0) { scale = 1; }
            if (clipBounds && (clipBounds.width == 0 || clipBounds.height == 0)) {
                return false;
            }
            var bounds = clipBounds || displayObject.$getOriginalBounds();
            if (bounds.width == 0 || bounds.height == 0) {
                return false;
            }
            scale /= egret.$TextureScaleFactor;
            var width = (bounds.x + bounds.width) * scale;
            var height = (bounds.y + bounds.height) * scale;
            if (clipBounds) {
                width = bounds.width * scale;
                height = bounds.height * scale;
            }
            var renderBuffer = this.$renderBuffer;
            if (!renderBuffer) {
                return false;
            }
            renderBuffer.resize(width, height);
            this.$bitmapData.width = width;
            this.$bitmapData.height = height;
            if (egret.nativeRender) {
                egret_native.activateBuffer(this.$renderBuffer);
                var useClip = false;
                var clipX = 0;
                var clipY = 0;
                var clipW = 0;
                var clipH = 0;
                if (clipBounds) {
                    useClip = true;
                    clipX = clipBounds.x;
                    clipY = clipBounds.y;
                    clipW = clipBounds.width;
                    clipH = clipBounds.height;
                }
                egret_native.updateNativeRender();
                egret_native.nrRenderDisplayObject(displayObject.$nativeDisplayObject.id, scale, useClip, clipX, clipY, clipW, clipH);
                egret_native.activateBuffer(null);
            }
            else {
                var matrix = egret.Matrix.create();
                matrix.identity();
                matrix.scale(scale, scale);
                if (clipBounds) {
                    matrix.translate(-clipBounds.x, -clipBounds.y);
                }
                egret.sys.systemRenderer.render(displayObject, renderBuffer, matrix, true);
                egret.Matrix.release(matrix);
            }
            this.$initData(0, 0, width, height, 0, 0, width, height, width, height);
            return true;
        };
        RenderTexture.prototype.getPixel32 = function (x, y) {
            var data;
            if (this.$renderBuffer) {
                var scale = egret.$TextureScaleFactor;
                x = Math.round(x / scale);
                y = Math.round(y / scale);
                data = this.$renderBuffer.getPixels(x, y, 1, 1);
            }
            return data;
        };
        RenderTexture.prototype.dispose = function () {
            _super.prototype.dispose.call(this);
            this.$renderBuffer = null;
        };
        return RenderTexture;
    }(egret.Texture));
    egret.RenderTexture = RenderTexture;
})(egret || (egret = {}));
var egret;
(function (egret) {
    var Shape = (function (_super) {
        __extends(Shape, _super);
        function Shape() {
            var _this = _super.call(this) || this;
            _this.$graphics = new egret.Graphics();
            _this.$graphics.$setTarget(_this);
            return _this;
        }
        Shape.prototype.createNativeDisplayObject = function () {
            this.$nativeDisplayObject = new egret_native.NativeDisplayObject(8);
        };
        Object.defineProperty(Shape.prototype, "graphics", {
            get: function () {
                return this.$graphics;
            },
            enumerable: true,
            configurable: true
        });
        Shape.prototype.$measureContentBounds = function (bounds) {
            this.$graphics.$measureContentBounds(bounds);
        };
        Shape.prototype.$hitTest = function (stageX, stageY) {
            var target = _super.prototype.$hitTest.call(this, stageX, stageY);
            if (target == this) {
                target = this.$graphics.$hitTest(stageX, stageY);
            }
            return target;
        };
        Shape.prototype.$onRemoveFromStage = function () {
            _super.prototype.$onRemoveFromStage.call(this);
            if (this.$graphics) {
                this.$graphics.$onRemoveFromStage();
            }
        };
        return Shape;
    }(egret.DisplayObject));
    egret.Shape = Shape;
})(egret || (egret = {}));
var egret;
(function (egret) {
    var Sprite = (function (_super) {
        __extends(Sprite, _super);
        function Sprite() {
            var _this = _super.call(this) || this;
            _this.$graphics = new egret.Graphics();
            _this.$graphics.$setTarget(_this);
            return _this;
        }
        Sprite.prototype.createNativeDisplayObject = function () {
            this.$nativeDisplayObject = new egret_native.NativeDisplayObject(9);
        };
        Object.defineProperty(Sprite.prototype, "graphics", {
            get: function () {
                return this.$graphics;
            },
            enumerable: true,
            configurable: true
        });
        Sprite.prototype.$hitTest = function (stageX, stageY) {
            if (!this.$visible) {
                return null;
            }
            var m = this.$getInvertedConcatenatedMatrix();
            var localX = m.a * stageX + m.c * stageY + m.tx;
            var localY = m.b * stageX + m.d * stageY + m.ty;
            var rect = this.$scrollRect ? this.$scrollRect : this.$maskRect;
            if (rect && !rect.contains(localX, localY)) {
                return null;
            }
            if (this.$mask && !this.$mask.$hitTest(stageX, stageY)) {
                return null;
            }
            var children = this.$children;
            var found = false;
            var target = null;
            for (var i = children.length - 1; i >= 0; i--) {
                var child = children[i];
                if (child.$maskedObject) {
                    continue;
                }
                target = child.$hitTest(stageX, stageY);
                if (target) {
                    found = true;
                    if (target.$touchEnabled) {
                        break;
                    }
                    else {
                        target = null;
                    }
                }
            }
            if (target) {
                if (this.$touchChildren) {
                    return target;
                }
                return this;
            }
            if (found) {
                return this;
            }
            target = egret.DisplayObject.prototype.$hitTest.call(this, stageX, stageY);
            if (target) {
                target = this.$graphics.$hitTest(stageX, stageY);
            }
            return target;
        };
        Sprite.prototype.$measureContentBounds = function (bounds) {
            this.$graphics.$measureContentBounds(bounds);
        };
        Sprite.prototype.$onRemoveFromStage = function () {
            _super.prototype.$onRemoveFromStage.call(this);
            if (this.$graphics) {
                this.$graphics.$onRemoveFromStage();
            }
        };
        return Sprite;
    }(egret.DisplayObjectContainer));
    egret.Sprite = Sprite;
})(egret || (egret = {}));
var egret;
(function (egret) {
    var SpriteSheet = (function (_super) {
        __extends(SpriteSheet, _super);
        function SpriteSheet(texture) {
            var _this = _super.call(this) || this;
            _this._bitmapX = 0;
            _this._bitmapY = 0;
            _this._textureMap = egret.createMap();
            _this.$texture = texture;
            _this._bitmapX = texture.$bitmapX - texture.$offsetX;
            _this._bitmapY = texture.$bitmapY - texture.$offsetY;
            return _this;
        }
        SpriteSheet.prototype.getTexture = function (name) {
            return this._textureMap[name];
        };
        SpriteSheet.prototype.createTexture = function (name, bitmapX, bitmapY, bitmapWidth, bitmapHeight, offsetX, offsetY, textureWidth, textureHeight) {
            if (offsetX === void 0) { offsetX = 0; }
            if (offsetY === void 0) { offsetY = 0; }
            if (textureWidth === void 0) {
                textureWidth = offsetX + bitmapWidth;
            }
            if (textureHeight === void 0) {
                textureHeight = offsetY + bitmapHeight;
            }
            var texture = new egret.Texture();
            texture.disposeBitmapData = false;
            texture.$bitmapData = this.$texture.$bitmapData;
            texture.$initData(this._bitmapX + bitmapX, this._bitmapY + bitmapY, bitmapWidth, bitmapHeight, offsetX, offsetY, textureWidth, textureHeight, this.$texture.$sourceWidth, this.$texture.$sourceHeight);
            this._textureMap[name] = texture;
            return texture;
        };
        SpriteSheet.prototype.dispose = function () {
            if (this.$texture) {
                this.$texture.dispose();
            }
        };
        return SpriteSheet;
    }(egret.HashObject));
    egret.SpriteSheet = SpriteSheet;
})(egret || (egret = {}));
var egret;
(function (egret) {
    var Stage = (function (_super) {
        __extends(Stage, _super);
        function Stage() {
            var _this = _super.call(this) || this;
            _this.$stageWidth = 0;
            _this.$stageHeight = 0;
            _this.$scaleMode = egret.StageScaleMode.SHOW_ALL;
            _this.$orientation = egret.OrientationMode.AUTO;
            _this.$maxTouches = 99;
            _this.$drawToSurfaceAutoClear = function () {
                if (this.$displayList) {
                    this.$displayList.drawToSurface();
                }
            };
            _this.$drawToSurface = function () {
                if (this.$displayList) {
                    this.$displayList.$stageRenderToSurface();
                }
            };
            _this.$resize = function (width, height) {
                this.$stageWidth = width;
                this.$stageHeight = height;
                this.$displayList.renderBuffer.resize(width, height);
                this.dispatchEventWith(egret.Event.RESIZE);
            };
            _this.$stage = _this;
            _this.$nestLevel = 1;
            return _this;
        }
        Stage.prototype.createNativeDisplayObject = function () {
            this.$nativeDisplayObject = new egret_native.NativeDisplayObject(13);
        };
        Object.defineProperty(Stage.prototype, "frameRate", {
            get: function () {
                return egret.ticker.$frameRate;
            },
            set: function (value) {
                egret.ticker.$setFrameRate(value);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Stage.prototype, "stageWidth", {
            get: function () {
                return this.$stageWidth;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Stage.prototype, "stageHeight", {
            get: function () {
                return this.$stageHeight;
            },
            enumerable: true,
            configurable: true
        });
        Stage.prototype.invalidate = function () {
            egret.sys.$invalidateRenderFlag = true;
        };
        Stage.prototype.registerImplementation = function (interfaceName, instance) {
            egret.registerImplementation(interfaceName, instance);
        };
        Stage.prototype.getImplementation = function (interfaceName) {
            return egret.getImplementation(interfaceName);
        };
        Object.defineProperty(Stage.prototype, "scaleMode", {
            get: function () {
                return this.$scaleMode;
            },
            set: function (value) {
                if (this.$scaleMode == value) {
                    return;
                }
                this.$scaleMode = value;
                this.$screen.updateScreenSize();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Stage.prototype, "orientation", {
            get: function () {
                return this.$orientation;
            },
            set: function (value) {
                if (this.$orientation == value) {
                    return;
                }
                this.$orientation = value;
                this.$screen.updateScreenSize();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Stage.prototype, "textureScaleFactor", {
            get: function () {
                return egret.$TextureScaleFactor;
            },
            set: function (value) {
                egret.$TextureScaleFactor = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Stage.prototype, "maxTouches", {
            get: function () {
                return this.$maxTouches;
            },
            set: function (value) {
                if (this.$maxTouches == value) {
                    return;
                }
                this.$maxTouches = value;
                this.$screen.updateMaxTouches();
            },
            enumerable: true,
            configurable: true
        });
        Stage.prototype.setContentSize = function (width, height) {
            this.$screen.setContentSize(width, height);
        };
        return Stage;
    }(egret.DisplayObjectContainer));
    egret.Stage = Stage;
})(egret || (egret = {}));
var egret;
(function (egret) {
    egret.ChildrenSortMode = {
        DEFAULT: "default",
        INCREASE_Y: "increaseY",
        DECREASE_Y: "decreaseY"
    };
})(egret || (egret = {}));
var egret;
(function (egret) {
    var Event = (function (_super) {
        __extends(Event, _super);
        function Event(type, bubbles, cancelable, data) {
            var _this = _super.call(this) || this;
            _this.$eventPhase = 2;
            _this.$currentTarget = null;
            _this.$target = null;
            _this.$isDefaultPrevented = false;
            _this.$isPropagationStopped = false;
            _this.$isPropagationImmediateStopped = false;
            _this.$type = type;
            _this.$bubbles = !!bubbles;
            _this.$cancelable = !!cancelable;
            _this.data = data;
            return _this;
        }
        Object.defineProperty(Event.prototype, "type", {
            get: function () {
                return this.$type;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Event.prototype, "bubbles", {
            get: function () {
                return this.$bubbles;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Event.prototype, "cancelable", {
            get: function () {
                return this.$cancelable;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Event.prototype, "eventPhase", {
            get: function () {
                return this.$eventPhase;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Event.prototype, "currentTarget", {
            get: function () {
                return this.$currentTarget;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Event.prototype, "target", {
            get: function () {
                return this.$target;
            },
            enumerable: true,
            configurable: true
        });
        Event.prototype.$setTarget = function (target) {
            this.$target = target;
            return true;
        };
        Event.prototype.isDefaultPrevented = function () {
            return this.$isDefaultPrevented;
        };
        Event.prototype.preventDefault = function () {
            if (this.$cancelable)
                this.$isDefaultPrevented = true;
        };
        Event.prototype.stopPropagation = function () {
            if (this.$bubbles)
                this.$isPropagationStopped = true;
        };
        Event.prototype.stopImmediatePropagation = function () {
            if (this.$bubbles)
                this.$isPropagationImmediateStopped = true;
        };
        Event.prototype.clean = function () {
            this.data = this.$currentTarget = null;
            this.$setTarget(null);
        };
        Event.dispatchEvent = function (target, type, bubbles, data) {
            if (bubbles === void 0) { bubbles = false; }
            var event = Event.create(Event, type, bubbles);
            var props = Event._getPropertyData(Event);
            if (data != undefined) {
                props.data = data;
            }
            var result = target.dispatchEvent(event);
            Event.release(event);
            return result;
        };
        Event._getPropertyData = function (EventClass) {
            var props = EventClass._props;
            if (!props)
                props = EventClass._props = {};
            return props;
        };
        Event.create = function (EventClass, type, bubbles, cancelable) {
            var eventPool;
            var hasEventPool = EventClass.hasOwnProperty("eventPool");
            if (hasEventPool) {
                eventPool = EventClass.eventPool;
            }
            if (!eventPool) {
                eventPool = EventClass.eventPool = [];
            }
            if (eventPool.length) {
                var event_2 = eventPool.pop();
                event_2.$type = type;
                event_2.$bubbles = !!bubbles;
                event_2.$cancelable = !!cancelable;
                event_2.$isDefaultPrevented = false;
                event_2.$isPropagationStopped = false;
                event_2.$isPropagationImmediateStopped = false;
                event_2.$eventPhase = 2;
                return event_2;
            }
            return new EventClass(type, bubbles, cancelable);
        };
        Event.release = function (event) {
            event.clean();
            var EventClass = Object.getPrototypeOf(event).constructor;
            EventClass.eventPool.push(event);
        };
        Event.ADDED_TO_STAGE = "addedToStage";
        Event.REMOVED_FROM_STAGE = "removedFromStage";
        Event.ADDED = "added";
        Event.REMOVED = "removed";
        Event.ENTER_FRAME = "enterFrame";
        Event.RENDER = "render";
        Event.RESIZE = "resize";
        Event.CHANGE = "change";
        Event.CHANGING = "changing";
        Event.COMPLETE = "complete";
        Event.LOOP_COMPLETE = "loopComplete";
        Event.FOCUS_IN = "focusIn";
        Event.FOCUS_OUT = "focusOut";
        Event.ENDED = "ended";
        Event.ACTIVATE = "activate";
        Event.DEACTIVATE = "deactivate";
        Event.CLOSE = "close";
        Event.CONNECT = "connect";
        Event.LEAVE_STAGE = "leaveStage";
        Event.SOUND_COMPLETE = "soundComplete";
        return Event;
    }(egret.HashObject));
    egret.Event = Event;
})(egret || (egret = {}));
var egret;
(function (egret) {
    var FocusEvent = (function (_super) {
        __extends(FocusEvent, _super);
        function FocusEvent(type, bubbles, cancelable) {
            if (bubbles === void 0) { bubbles = false; }
            if (cancelable === void 0) { cancelable = false; }
            return _super.call(this, type, bubbles, cancelable) || this;
        }
        FocusEvent.FOCUS_IN = "focusIn";
        FocusEvent.FOCUS_OUT = "focusOut";
        return FocusEvent;
    }(egret.Event));
    egret.FocusEvent = FocusEvent;
})(egret || (egret = {}));
var egret;
(function (egret) {
    var GeolocationEvent = (function (_super) {
        __extends(GeolocationEvent, _super);
        function GeolocationEvent() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        GeolocationEvent.PERMISSION_DENIED = "permissionDenied";
        GeolocationEvent.UNAVAILABLE = "unavailable";
        return GeolocationEvent;
    }(egret.Event));
    egret.GeolocationEvent = GeolocationEvent;
})(egret || (egret = {}));
var egret;
(function (egret) {
    var HTTPStatusEvent = (function (_super) {
        __extends(HTTPStatusEvent, _super);
        function HTTPStatusEvent(type, bubbles, cancelable) {
            if (bubbles === void 0) { bubbles = false; }
            if (cancelable === void 0) { cancelable = false; }
            var _this = _super.call(this, type, bubbles, cancelable) || this;
            _this._status = 0;
            return _this;
        }
        Object.defineProperty(HTTPStatusEvent.prototype, "status", {
            get: function () {
                return this._status;
            },
            enumerable: true,
            configurable: true
        });
        HTTPStatusEvent.dispatchHTTPStatusEvent = function (target, status) {
            var event = egret.Event.create(HTTPStatusEvent, HTTPStatusEvent.HTTP_STATUS);
            event._status = status;
            var result = target.dispatchEvent(event);
            egret.Event.release(event);
            return result;
        };
        HTTPStatusEvent.HTTP_STATUS = "httpStatus";
        return HTTPStatusEvent;
    }(egret.Event));
    egret.HTTPStatusEvent = HTTPStatusEvent;
})(egret || (egret = {}));
var egret;
(function (egret) {
    var IOErrorEvent = (function (_super) {
        __extends(IOErrorEvent, _super);
        function IOErrorEvent(type, bubbles, cancelable) {
            if (bubbles === void 0) { bubbles = false; }
            if (cancelable === void 0) { cancelable = false; }
            return _super.call(this, type, bubbles, cancelable) || this;
        }
        IOErrorEvent.dispatchIOErrorEvent = function (target) {
            var event = egret.Event.create(IOErrorEvent, IOErrorEvent.IO_ERROR);
            var result = target.dispatchEvent(event);
            egret.Event.release(event);
            return result;
        };
        IOErrorEvent.IO_ERROR = "ioError";
        return IOErrorEvent;
    }(egret.Event));
    egret.IOErrorEvent = IOErrorEvent;
})(egret || (egret = {}));
var egret;
(function (egret) {
    var MotionEvent = (function (_super) {
        __extends(MotionEvent, _super);
        function MotionEvent() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return MotionEvent;
    }(egret.Event));
    egret.MotionEvent = MotionEvent;
})(egret || (egret = {}));
var egret;
(function (egret) {
    var OrientationEvent = (function (_super) {
        __extends(OrientationEvent, _super);
        function OrientationEvent() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return OrientationEvent;
    }(egret.Event));
    egret.OrientationEvent = OrientationEvent;
})(egret || (egret = {}));
var egret;
(function (egret) {
    var ProgressEvent = (function (_super) {
        __extends(ProgressEvent, _super);
        function ProgressEvent(type, bubbles, cancelable, bytesLoaded, bytesTotal) {
            if (bubbles === void 0) { bubbles = false; }
            if (cancelable === void 0) { cancelable = false; }
            if (bytesLoaded === void 0) { bytesLoaded = 0; }
            if (bytesTotal === void 0) { bytesTotal = 0; }
            var _this = _super.call(this, type, bubbles, cancelable) || this;
            _this.bytesLoaded = 0;
            _this.bytesTotal = 0;
            _this.bytesLoaded = bytesLoaded;
            _this.bytesTotal = bytesTotal;
            return _this;
        }
        ProgressEvent.dispatchProgressEvent = function (target, type, bytesLoaded, bytesTotal) {
            if (bytesLoaded === void 0) { bytesLoaded = 0; }
            if (bytesTotal === void 0) { bytesTotal = 0; }
            var event = egret.Event.create(ProgressEvent, type);
            event.bytesLoaded = bytesLoaded;
            event.bytesTotal = bytesTotal;
            var result = target.dispatchEvent(event);
            egret.Event.release(event);
            return result;
        };
        ProgressEvent.PROGRESS = "progress";
        ProgressEvent.SOCKET_DATA = "socketData";
        return ProgressEvent;
    }(egret.Event));
    egret.ProgressEvent = ProgressEvent;
})(egret || (egret = {}));
var egret;
(function (egret) {
    var StageOrientationEvent = (function (_super) {
        __extends(StageOrientationEvent, _super);
        function StageOrientationEvent(type, bubbles, cancelable) {
            if (bubbles === void 0) { bubbles = false; }
            if (cancelable === void 0) { cancelable = false; }
            return _super.call(this, type, bubbles, cancelable) || this;
        }
        StageOrientationEvent.dispatchStageOrientationEvent = function (target, type) {
            var event = egret.Event.create(StageOrientationEvent, type);
            var result = target.dispatchEvent(event);
            egret.Event.release(event);
            return result;
        };
        StageOrientationEvent.ORIENTATION_CHANGE = "orientationChange";
        return StageOrientationEvent;
    }(egret.Event));
    egret.StageOrientationEvent = StageOrientationEvent;
})(egret || (egret = {}));
var egret;
(function (egret) {
    var TextEvent = (function (_super) {
        __extends(TextEvent, _super);
        function TextEvent(type, bubbles, cancelable, text) {
            if (bubbles === void 0) { bubbles = false; }
            if (cancelable === void 0) { cancelable = false; }
            if (text === void 0) { text = ""; }
            var _this = _super.call(this, type, bubbles, cancelable) || this;
            _this.text = text;
            return _this;
        }
        TextEvent.dispatchTextEvent = function (target, type, text) {
            var event = egret.Event.create(TextEvent, type);
            event.text = text;
            var result = target.dispatchEvent(event);
            egret.Event.release(event);
            return result;
        };
        TextEvent.LINK = "link";
        return TextEvent;
    }(egret.Event));
    egret.TextEvent = TextEvent;
})(egret || (egret = {}));
var egret;
(function (egret) {
    var TimerEvent = (function (_super) {
        __extends(TimerEvent, _super);
        function TimerEvent(type, bubbles, cancelable) {
            return _super.call(this, type, bubbles, cancelable) || this;
        }
        TimerEvent.prototype.updateAfterEvent = function () {
            egret.sys.$requestRenderingFlag = true;
        };
        TimerEvent.dispatchTimerEvent = function (target, type, bubbles, cancelable) {
            var event = egret.Event.create(TimerEvent, type, bubbles, cancelable);
            var result = target.dispatchEvent(event);
            egret.Event.release(event);
            return result;
        };
        TimerEvent.TIMER = "timer";
        TimerEvent.TIMER_COMPLETE = "timerComplete";
        return TimerEvent;
    }(egret.Event));
    egret.TimerEvent = TimerEvent;
})(egret || (egret = {}));
var egret;
(function (egret) {
    var pointPool = [];
    var DEG_TO_RAD = Math.PI / 180;
    var Point = (function (_super) {
        __extends(Point, _super);
        function Point(x, y) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            var _this = _super.call(this) || this;
            _this.x = x;
            _this.y = y;
            return _this;
        }
        Point.release = function (point) {
            if (!point) {
                return;
            }
            pointPool.push(point);
        };
        Point.create = function (x, y) {
            var point = pointPool.pop();
            if (!point) {
                point = new Point();
            }
            return point.setTo(x, y);
        };
        Object.defineProperty(Point.prototype, "length", {
            get: function () {
                return Math.sqrt(this.x * this.x + this.y * this.y);
            },
            enumerable: true,
            configurable: true
        });
        Point.prototype.setTo = function (x, y) {
            this.x = x;
            this.y = y;
            return this;
        };
        Point.prototype.clone = function () {
            return new Point(this.x, this.y);
        };
        Point.prototype.equals = function (toCompare) {
            return this.x == toCompare.x && this.y == toCompare.y;
        };
        Point.distance = function (p1, p2) {
            return Math.sqrt((p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y));
        };
        Point.prototype.copyFrom = function (sourcePoint) {
            this.x = sourcePoint.x;
            this.y = sourcePoint.y;
        };
        Point.prototype.add = function (v) {
            return new Point(this.x + v.x, this.y + v.y);
        };
        Point.interpolate = function (pt1, pt2, f) {
            var f1 = 1 - f;
            return new Point(pt1.x * f + pt2.x * f1, pt1.y * f + pt2.y * f1);
        };
        Point.prototype.normalize = function (thickness) {
            if (this.x != 0 || this.y != 0) {
                var relativeThickness = thickness / this.length;
                this.x *= relativeThickness;
                this.y *= relativeThickness;
            }
        };
        Point.prototype.offset = function (dx, dy) {
            this.x += dx;
            this.y += dy;
        };
        Point.polar = function (len, angle) {
            return new Point(len * egret.NumberUtils.cos(angle / DEG_TO_RAD), len * egret.NumberUtils.sin(angle / DEG_TO_RAD));
        };
        Point.prototype.subtract = function (v) {
            return new Point(this.x - v.x, this.y - v.y);
        };
        Point.prototype.toString = function () {
            return "(x=" + this.x + ", y=" + this.y + ")";
        };
        return Point;
    }(egret.HashObject));
    egret.Point = Point;
    egret.$TempPoint = new Point();
})(egret || (egret = {}));
var egret;
(function (egret) {
    var localPoint = new egret.Point();
    var TouchEvent = (function (_super) {
        __extends(TouchEvent, _super);
        function TouchEvent(type, bubbles, cancelable, stageX, stageY, touchPointID) {
            var _this = _super.call(this, type, bubbles, cancelable) || this;
            _this.targetChanged = true;
            _this.touchDown = false;
            _this.$initTo(stageX, stageY, touchPointID);
            return _this;
        }
        TouchEvent.prototype.$initTo = function (stageX, stageY, touchPointID) {
            this.touchPointID = +touchPointID || 0;
            this.$stageX = +stageX || 0;
            this.$stageY = +stageY || 0;
        };
        Object.defineProperty(TouchEvent.prototype, "stageX", {
            get: function () {
                return this.$stageX;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TouchEvent.prototype, "stageY", {
            get: function () {
                return this.$stageY;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TouchEvent.prototype, "localX", {
            get: function () {
                if (this.targetChanged) {
                    this.getLocalXY();
                }
                return this._localX;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TouchEvent.prototype, "localY", {
            get: function () {
                if (this.targetChanged) {
                    this.getLocalXY();
                }
                return this._localY;
            },
            enumerable: true,
            configurable: true
        });
        TouchEvent.prototype.getLocalXY = function () {
            this.targetChanged = false;
            var m = this.$target.$getInvertedConcatenatedMatrix();
            m.transformPoint(this.$stageX, this.$stageY, localPoint);
            this._localX = localPoint.x;
            this._localY = localPoint.y;
        };
        TouchEvent.prototype.$setTarget = function (target) {
            this.$target = target;
            this.targetChanged = !!target;
            return true;
        };
        TouchEvent.prototype.updateAfterEvent = function () {
            egret.sys.$requestRenderingFlag = true;
        };
        TouchEvent.dispatchTouchEvent = function (target, type, bubbles, cancelable, stageX, stageY, touchPointID, touchDown) {
            if (touchDown === void 0) { touchDown = false; }
            if (!bubbles && !target.hasEventListener(type)) {
                return true;
            }
            var event = egret.Event.create(TouchEvent, type, bubbles, cancelable);
            event.$initTo(stageX, stageY, touchPointID);
            event.touchDown = touchDown;
            var result = target.dispatchEvent(event);
            egret.Event.release(event);
            return result;
        };
        TouchEvent.TOUCH_MOVE = "touchMove";
        TouchEvent.TOUCH_BEGIN = "touchBegin";
        TouchEvent.TOUCH_END = "touchEnd";
        TouchEvent.TOUCH_CANCEL = "touchCancel";
        TouchEvent.TOUCH_TAP = "touchTap";
        TouchEvent.TOUCH_RELEASE_OUTSIDE = "touchReleaseOutside";
        return TouchEvent;
    }(egret.Event));
    egret.TouchEvent = TouchEvent;
})(egret || (egret = {}));
var egret;
(function (egret) {
})(egret || (egret = {}));
var egret;
(function (egret) {
    var web;
    (function (web) {
        var WebExternalInterface = (function () {
            function WebExternalInterface() {
            }
            WebExternalInterface.call = function (functionName, value) {
            };
            WebExternalInterface.addCallback = function (functionName, listener) {
            };
            return WebExternalInterface;
        }());
        web.WebExternalInterface = WebExternalInterface;
        var ua = navigator.userAgent.toLowerCase();
        if (ua.indexOf("egretnative") < 0) {
            egret.ExternalInterface = WebExternalInterface;
        }
    })(web = egret.web || (egret.web = {}));
})(egret || (egret = {}));
(function (egret) {
    var web;
    (function (web) {
        var callBackDic = {};
        var NativeExternalInterface = (function () {
            function NativeExternalInterface() {
            }
            NativeExternalInterface.call = function (functionName, value) {
                var data = {};
                data.functionName = functionName;
                data.value = value;
                egret_native.sendInfoToPlugin(JSON.stringify(data));
            };
            NativeExternalInterface.addCallback = function (functionName, listener) {
                callBackDic[functionName] = listener;
            };
            return NativeExternalInterface;
        }());
        web.NativeExternalInterface = NativeExternalInterface;
        function onReceivedPluginInfo(info) {
            var data = JSON.parse(info);
            var functionName = data.functionName;
            var listener = callBackDic[functionName];
            if (listener) {
                var value = data.value;
                listener.call(null, value);
            }
            else {
                egret.warn(1050, functionName);
            }
        }
        var ua = navigator.userAgent.toLowerCase();
        if (ua.indexOf("egretnative") >= 0) {
            egret.ExternalInterface = NativeExternalInterface;
            egret_native.receivedPluginInfo = onReceivedPluginInfo;
        }
    })(web = egret.web || (egret.web = {}));
})(egret || (egret = {}));
(function (egret) {
    var web;
    (function (web) {
        var callBackDic = {};
        var WebViewExternalInterface = (function () {
            function WebViewExternalInterface() {
            }
            WebViewExternalInterface.call = function (functionName, value) {
                __global.ExternalInterface.call(functionName, value);
            };
            WebViewExternalInterface.addCallback = function (functionName, listener) {
                callBackDic[functionName] = listener;
            };
            WebViewExternalInterface.invokeCallback = function (functionName, value) {
                var listener = callBackDic[functionName];
                if (listener) {
                    listener.call(null, value);
                }
                else {
                    egret.warn(1050, functionName);
                }
            };
            return WebViewExternalInterface;
        }());
        web.WebViewExternalInterface = WebViewExternalInterface;
        var ua = navigator.userAgent.toLowerCase();
        if (ua.indexOf("egretwebview") >= 0) {
            egret.ExternalInterface = WebViewExternalInterface;
        }
    })(web = egret.web || (egret.web = {}));
})(egret || (egret = {}));
var egret;
(function (egret) {
    var Filter = (function (_super) {
        __extends(Filter, _super);
        function Filter() {
            var _this = _super.call(this) || this;
            _this.type = null;
            _this.$id = null;
            _this.paddingTop = 0;
            _this.paddingBottom = 0;
            _this.paddingLeft = 0;
            _this.paddingRight = 0;
            _this.$uniforms = {};
            if (egret.nativeRender) {
                egret_native.NativeDisplayObject.createFilter(_this);
            }
            return _this;
        }
        Filter.prototype.$toJson = function () {
            return '';
        };
        Filter.prototype.updatePadding = function () {
        };
        Filter.prototype.onPropertyChange = function () {
            var self = this;
            self.updatePadding();
            if (egret.nativeRender) {
                egret_native.NativeDisplayObject.setFilterPadding(self.$id, self.paddingTop, self.paddingBottom, self.paddingLeft, self.paddingRight);
                egret_native.NativeDisplayObject.setDataToFilter(self);
            }
        };
        return Filter;
    }(egret.HashObject));
    egret.Filter = Filter;
})(egret || (egret = {}));
var egret;
(function (egret) {
    var BlurFilter = (function (_super) {
        __extends(BlurFilter, _super);
        function BlurFilter(blurX, blurY, quality) {
            if (blurX === void 0) { blurX = 4; }
            if (blurY === void 0) { blurY = 4; }
            if (quality === void 0) { quality = 1; }
            var _this = _super.call(this) || this;
            var self = _this;
            self.type = "blur";
            self.$blurX = blurX;
            self.$blurY = blurY;
            self.$quality = quality;
            self.blurXFilter = new BlurXFilter(blurX);
            self.blurYFilter = new BlurYFilter(blurY);
            self.onPropertyChange();
            return _this;
        }
        Object.defineProperty(BlurFilter.prototype, "blurX", {
            get: function () {
                return this.$blurX;
            },
            set: function (value) {
                var self = this;
                if (self.$blurX == value) {
                    return;
                }
                self.$blurX = value;
                self.blurXFilter.blurX = value;
                self.onPropertyChange();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BlurFilter.prototype, "blurY", {
            get: function () {
                return this.$blurY;
            },
            set: function (value) {
                var self = this;
                if (self.$blurY == value) {
                    return;
                }
                self.$blurY = value;
                self.blurYFilter.blurY = value;
                self.onPropertyChange();
            },
            enumerable: true,
            configurable: true
        });
        BlurFilter.prototype.$toJson = function () {
            return '{"blurX": ' + this.$blurX + ', "blurY": ' + this.$blurY + ', "quality": 1}';
        };
        BlurFilter.prototype.updatePadding = function () {
            var self = this;
            self.paddingLeft = self.blurX;
            self.paddingRight = self.blurX;
            self.paddingTop = self.blurY;
            self.paddingBottom = self.blurY;
        };
        BlurFilter.prototype.onPropertyChange = function () {
            var self = this;
            self.updatePadding();
            if (egret.nativeRender) {
                egret_native.NativeDisplayObject.setFilterPadding(self.blurXFilter.$id, 0, 0, self.paddingLeft, self.paddingRight);
                egret_native.NativeDisplayObject.setFilterPadding(self.blurYFilter.$id, self.paddingTop, self.paddingBottom, 0, 0);
                egret_native.NativeDisplayObject.setDataToFilter(self);
            }
        };
        return BlurFilter;
    }(egret.Filter));
    egret.BlurFilter = BlurFilter;
    var BlurXFilter = (function (_super) {
        __extends(BlurXFilter, _super);
        function BlurXFilter(blurX) {
            if (blurX === void 0) { blurX = 4; }
            var _this = _super.call(this) || this;
            if (egret.nativeRender) {
                _this.type = "blur";
            }
            else {
                _this.type = "blurX";
            }
            _this.$uniforms.blur = { x: blurX, y: 0 };
            _this.onPropertyChange();
            return _this;
        }
        Object.defineProperty(BlurXFilter.prototype, "blurX", {
            get: function () {
                return this.$uniforms.blur.x;
            },
            set: function (value) {
                this.$uniforms.blur.x = value;
            },
            enumerable: true,
            configurable: true
        });
        return BlurXFilter;
    }(egret.Filter));
    var BlurYFilter = (function (_super) {
        __extends(BlurYFilter, _super);
        function BlurYFilter(blurY) {
            if (blurY === void 0) { blurY = 4; }
            var _this = _super.call(this) || this;
            if (egret.nativeRender) {
                _this.type = "blur";
            }
            else {
                _this.type = "blurY";
            }
            _this.$uniforms.blur = { x: 0, y: blurY };
            _this.onPropertyChange();
            return _this;
        }
        Object.defineProperty(BlurYFilter.prototype, "blurY", {
            get: function () {
                return this.$uniforms.blur.y;
            },
            set: function (value) {
                this.$uniforms.blur.y = value;
            },
            enumerable: true,
            configurable: true
        });
        return BlurYFilter;
    }(egret.Filter));
})(egret || (egret = {}));
var egret;
(function (egret) {
    var ColorMatrixFilter = (function (_super) {
        __extends(ColorMatrixFilter, _super);
        function ColorMatrixFilter(matrix) {
            if (matrix === void 0) { matrix = null; }
            var _this = _super.call(this) || this;
            _this.$matrix = [];
            _this.matrix2 = [];
            _this.type = "colorTransform";
            _this.$uniforms.matrix = [
                1, 0, 0, 0,
                0, 1, 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 1
            ];
            _this.$uniforms.colorAdd = { x: 0, y: 0, z: 0, w: 0 };
            _this.setMatrix(matrix);
            _this.onPropertyChange();
            return _this;
        }
        Object.defineProperty(ColorMatrixFilter.prototype, "matrix", {
            get: function () {
                for (var i = 0; i < 20; i++) {
                    this.matrix2[i] = this.$matrix[i];
                }
                return this.matrix2;
            },
            set: function (value) {
                this.setMatrix(value);
            },
            enumerable: true,
            configurable: true
        });
        ColorMatrixFilter.prototype.setMatrix = function (value) {
            if (value) {
                for (var i = 0; i < 20; i++) {
                    this.$matrix[i] = value[i];
                }
            }
            else {
                for (var i = 0; i < 20; i++) {
                    this.$matrix[i] = (i == 0 || i == 6 || i == 12 || i == 18) ? 1 : 0;
                }
            }
            var $matrix = this.$matrix;
            var matrix = this.$uniforms.matrix;
            var colorAdd = this.$uniforms.colorAdd;
            for (var i = 0, j = 0; i < $matrix.length; i++) {
                if (i === 4) {
                    colorAdd.x = $matrix[i] / 255;
                }
                else if (i === 9) {
                    colorAdd.y = $matrix[i] / 255;
                }
                else if (i === 14) {
                    colorAdd.z = $matrix[i] / 255;
                }
                else if (i === 19) {
                    colorAdd.w = $matrix[i] / 255;
                }
                else {
                    matrix[j] = $matrix[i];
                    j++;
                }
            }
            this.onPropertyChange();
        };
        ColorMatrixFilter.prototype.$toJson = function () {
            return '{"matrix": [' + this.$matrix.toString() + ']}';
        };
        return ColorMatrixFilter;
    }(egret.Filter));
    egret.ColorMatrixFilter = ColorMatrixFilter;
})(egret || (egret = {}));
var egret;
(function (egret) {
    var SOURCE_KEY_MAP = {};
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    var uuid = new Array(36);
    var rnd = 0, r;
    var generateUUID = function () {
        for (var i = 0; i < 36; i++) {
            if (i === 8 || i === 13 || i === 18 || i === 23) {
                uuid[i] = '-';
            }
            else if (i === 14) {
                uuid[i] = '4';
            }
            else {
                if (rnd <= 0x02)
                    rnd = 0x2000000 + (Math.random() * 0x1000000) | 0;
                r = rnd & 0xf;
                rnd = rnd >> 4;
                uuid[i] = chars[(i === 19) ? (r & 0x3) | 0x8 : r];
            }
        }
        return uuid.join('');
    };
    var CustomFilter = (function (_super) {
        __extends(CustomFilter, _super);
        function CustomFilter(vertexSrc, fragmentSrc, uniforms) {
            if (uniforms === void 0) { uniforms = {}; }
            var _this = _super.call(this) || this;
            _this.$padding = 0;
            _this.$vertexSrc = vertexSrc;
            _this.$fragmentSrc = fragmentSrc;
            var tempKey = vertexSrc + fragmentSrc;
            if (!SOURCE_KEY_MAP[tempKey]) {
                SOURCE_KEY_MAP[tempKey] = generateUUID();
            }
            _this.$shaderKey = SOURCE_KEY_MAP[tempKey];
            _this.$uniforms = uniforms;
            _this.type = "custom";
            return _this;
        }
        Object.defineProperty(CustomFilter.prototype, "padding", {
            get: function () {
                return this.$padding;
            },
            set: function (value) {
                var self = this;
                if (self.$padding == value) {
                    return;
                }
                self.$padding = value;
                self.onPropertyChange();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CustomFilter.prototype, "uniforms", {
            get: function () {
                return this.$uniforms;
            },
            enumerable: true,
            configurable: true
        });
        CustomFilter.prototype.onPropertyChange = function () {
            if (egret.nativeRender) {
                var self_1 = this;
                egret_native.NativeDisplayObject.setFilterPadding(self_1.$id, self_1.$padding, self_1.$padding, self_1.$padding, self_1.$padding);
                egret_native.NativeDisplayObject.setDataToFilter(self_1);
            }
        };
        return CustomFilter;
    }(egret.Filter));
    egret.CustomFilter = CustomFilter;
})(egret || (egret = {}));
var egret;
(function (egret) {
    var GlowFilter = (function (_super) {
        __extends(GlowFilter, _super);
        function GlowFilter(color, alpha, blurX, blurY, strength, quality, inner, knockout) {
            if (color === void 0) { color = 0xFF0000; }
            if (alpha === void 0) { alpha = 1.0; }
            if (blurX === void 0) { blurX = 6.0; }
            if (blurY === void 0) { blurY = 6.0; }
            if (strength === void 0) { strength = 2; }
            if (quality === void 0) { quality = 1; }
            if (inner === void 0) { inner = false; }
            if (knockout === void 0) { knockout = false; }
            var _this = _super.call(this) || this;
            var self = _this;
            self.type = "glow";
            self.$color = color;
            self.$blue = color & 0x0000FF;
            self.$green = (color & 0x00ff00) >> 8;
            self.$red = color >> 16;
            self.$alpha = alpha;
            self.$blurX = blurX;
            self.$blurY = blurY;
            self.$strength = strength;
            self.$quality = quality;
            self.$inner = inner;
            self.$knockout = knockout;
            self.$uniforms.color = { x: _this.$red / 255, y: _this.$green / 255, z: _this.$blue / 255, w: 1 };
            self.$uniforms.alpha = alpha;
            self.$uniforms.blurX = blurX;
            self.$uniforms.blurY = blurY;
            self.$uniforms.strength = strength;
            self.$uniforms.inner = inner ? 1 : 0;
            self.$uniforms.knockout = knockout ? 0 : 1;
            self.$uniforms.dist = 0;
            self.$uniforms.angle = 0;
            self.$uniforms.hideObject = 0;
            self.onPropertyChange();
            return _this;
        }
        Object.defineProperty(GlowFilter.prototype, "color", {
            get: function () {
                return this.$color;
            },
            set: function (value) {
                if (this.$color == value) {
                    return;
                }
                this.$color = value;
                this.$blue = value & 0x0000FF;
                this.$green = (value & 0x00ff00) >> 8;
                this.$red = value >> 16;
                this.$uniforms.color.x = this.$red / 255;
                this.$uniforms.color.y = this.$green / 255;
                this.$uniforms.color.z = this.$blue / 255;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GlowFilter.prototype, "alpha", {
            get: function () {
                return this.$alpha;
            },
            set: function (value) {
                if (this.$alpha == value) {
                    return;
                }
                this.$alpha = value;
                this.$uniforms.alpha = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GlowFilter.prototype, "blurX", {
            get: function () {
                return this.$blurX;
            },
            set: function (value) {
                var self = this;
                if (self.$blurX == value) {
                    return;
                }
                self.$blurX = value;
                self.$uniforms.blurX = value;
                self.onPropertyChange();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GlowFilter.prototype, "blurY", {
            get: function () {
                return this.$blurY;
            },
            set: function (value) {
                var self = this;
                if (self.$blurY == value) {
                    return;
                }
                self.$blurY = value;
                self.$uniforms.blurY = value;
                self.onPropertyChange();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GlowFilter.prototype, "strength", {
            get: function () {
                return this.$strength;
            },
            set: function (value) {
                if (this.$strength == value) {
                    return;
                }
                this.$strength = value;
                this.$uniforms.strength = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GlowFilter.prototype, "quality", {
            get: function () {
                return this.$quality;
            },
            set: function (value) {
                if (this.$quality == value) {
                    return;
                }
                this.$quality = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GlowFilter.prototype, "inner", {
            get: function () {
                return this.$inner;
            },
            set: function (value) {
                if (this.$inner == value) {
                    return;
                }
                this.$inner = value;
                this.$uniforms.inner = value ? 1 : 0;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GlowFilter.prototype, "knockout", {
            get: function () {
                return this.$knockout;
            },
            set: function (value) {
                if (this.$knockout == value) {
                    return;
                }
                this.$knockout = value;
                this.$uniforms.knockout = value ? 0 : 1;
            },
            enumerable: true,
            configurable: true
        });
        GlowFilter.prototype.$toJson = function () {
            return '{"color": ' + this.$color + ', "red": ' + this.$red + ', "green": ' + this.$green + ', "blue": ' + this.$blue + ', "alpha": ' + this.$alpha + ', "blurX": ' + this.$blurX + ', "blurY": ' + this.blurY + ', "strength": ' + this.$strength + ', "quality": ' + this.$quality + ', "inner": ' + this.$inner + ', "knockout": ' + this.$knockout + '}';
        };
        GlowFilter.prototype.updatePadding = function () {
            var self = this;
            self.paddingLeft = self.blurX;
            self.paddingRight = self.blurX;
            self.paddingTop = self.blurY;
            self.paddingBottom = self.blurY;
        };
        return GlowFilter;
    }(egret.Filter));
    egret.GlowFilter = GlowFilter;
})(egret || (egret = {}));
var egret;
(function (egret) {
    var DropShadowFilter = (function (_super) {
        __extends(DropShadowFilter, _super);
        function DropShadowFilter(distance, angle, color, alpha, blurX, blurY, strength, quality, inner, knockout, hideObject) {
            if (distance === void 0) { distance = 4.0; }
            if (angle === void 0) { angle = 45; }
            if (color === void 0) { color = 0; }
            if (alpha === void 0) { alpha = 1.0; }
            if (blurX === void 0) { blurX = 4.0; }
            if (blurY === void 0) { blurY = 4.0; }
            if (strength === void 0) { strength = 1.0; }
            if (quality === void 0) { quality = 1; }
            if (inner === void 0) { inner = false; }
            if (knockout === void 0) { knockout = false; }
            if (hideObject === void 0) { hideObject = false; }
            var _this = _super.call(this, color, alpha, blurX, blurY, strength, quality, inner, knockout) || this;
            var self = _this;
            self.$distance = distance;
            self.$angle = angle;
            self.$hideObject = hideObject;
            self.$uniforms.dist = distance;
            self.$uniforms.angle = angle / 180 * Math.PI;
            self.$uniforms.hideObject = hideObject ? 1 : 0;
            self.onPropertyChange();
            return _this;
        }
        Object.defineProperty(DropShadowFilter.prototype, "distance", {
            get: function () {
                return this.$distance;
            },
            set: function (value) {
                var self = this;
                if (self.$distance == value) {
                    return;
                }
                self.$distance = value;
                self.$uniforms.dist = value;
                self.onPropertyChange();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DropShadowFilter.prototype, "angle", {
            get: function () {
                return this.$angle;
            },
            set: function (value) {
                var self = this;
                if (self.$angle == value) {
                    return;
                }
                self.$angle = value;
                self.$uniforms.angle = value / 180 * Math.PI;
                self.onPropertyChange();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DropShadowFilter.prototype, "hideObject", {
            get: function () {
                return this.$hideObject;
            },
            set: function (value) {
                if (this.$hideObject == value) {
                    return;
                }
                this.$hideObject = value;
                this.$uniforms.hideObject = value ? 1 : 0;
            },
            enumerable: true,
            configurable: true
        });
        DropShadowFilter.prototype.$toJson = function () {
            return '{"distance": ' + this.$distance + ', "angle": ' + this.$angle + ', "color": ' + this.$color + ', "red": ' + this.$red + ', "green": ' + this.$green + ', "blue": ' + this.$blue + ', "alpha": ' + this.$alpha + ', "blurX": ' + this.$blurX + ', "blurY": ' + this.blurY + ', "strength": ' + this.$strength + ', "quality": ' + this.$quality + ', "inner": ' + this.$inner + ', "knockout": ' + this.$knockout + ', "hideObject": ' + this.$hideObject + '}';
        };
        DropShadowFilter.prototype.updatePadding = function () {
            var self = this;
            self.paddingLeft = self.blurX;
            self.paddingRight = self.blurX;
            self.paddingTop = self.blurY;
            self.paddingBottom = self.blurY;
            var distance = self.distance || 0;
            var angle = self.angle || 0;
            var distanceX = 0;
            var distanceY = 0;
            if (distance != 0) {
                distanceX = distance * egret.NumberUtils.cos(angle);
                if (distanceX > 0) {
                    distanceX = Math.ceil(distanceX);
                }
                else {
                    distanceX = Math.floor(distanceX);
                }
                distanceY = distance * egret.NumberUtils.sin(angle);
                if (distanceY > 0) {
                    distanceY = Math.ceil(distanceY);
                }
                else {
                    distanceY = Math.floor(distanceY);
                }
                self.paddingLeft += distanceX;
                self.paddingRight += distanceX;
                self.paddingTop += distanceY;
                self.paddingBottom += distanceY;
            }
        };
        return DropShadowFilter;
    }(egret.GlowFilter));
    egret.DropShadowFilter = DropShadowFilter;
})(egret || (egret = {}));
var egret;
(function (egret) {
    var PI = Math.PI;
    var TwoPI = PI * 2;
    var DEG_TO_RAD = PI / 180;
    var matrixPool = [];
    var Matrix = (function (_super) {
        __extends(Matrix, _super);
        function Matrix(a, b, c, d, tx, ty) {
            if (a === void 0) { a = 1; }
            if (b === void 0) { b = 0; }
            if (c === void 0) { c = 0; }
            if (d === void 0) { d = 1; }
            if (tx === void 0) { tx = 0; }
            if (ty === void 0) { ty = 0; }
            var _this = _super.call(this) || this;
            _this.a = a;
            _this.b = b;
            _this.c = c;
            _this.d = d;
            _this.tx = tx;
            _this.ty = ty;
            return _this;
        }
        Matrix.release = function (matrix) {
            if (!matrix) {
                return;
            }
            matrixPool.push(matrix);
        };
        Matrix.create = function () {
            var matrix = matrixPool.pop();
            if (!matrix) {
                matrix = new Matrix();
            }
            return matrix;
        };
        Matrix.prototype.clone = function () {
            return new Matrix(this.a, this.b, this.c, this.d, this.tx, this.ty);
        };
        Matrix.prototype.concat = function (other) {
            var a = this.a * other.a;
            var b = 0.0;
            var c = 0.0;
            var d = this.d * other.d;
            var tx = this.tx * other.a + other.tx;
            var ty = this.ty * other.d + other.ty;
            if (this.b !== 0.0 || this.c !== 0.0 || other.b !== 0.0 || other.c !== 0.0) {
                a += this.b * other.c;
                d += this.c * other.b;
                b += this.a * other.b + this.b * other.d;
                c += this.c * other.a + this.d * other.c;
                tx += this.ty * other.c;
                ty += this.tx * other.b;
            }
            this.a = a;
            this.b = b;
            this.c = c;
            this.d = d;
            this.tx = tx;
            this.ty = ty;
        };
        Matrix.prototype.copyFrom = function (other) {
            this.a = other.a;
            this.b = other.b;
            this.c = other.c;
            this.d = other.d;
            this.tx = other.tx;
            this.ty = other.ty;
            return this;
        };
        Matrix.prototype.identity = function () {
            this.a = this.d = 1;
            this.b = this.c = this.tx = this.ty = 0;
        };
        Matrix.prototype.invert = function () {
            this.$invertInto(this);
        };
        Matrix.prototype.$invertInto = function (target) {
            var a = this.a;
            var b = this.b;
            var c = this.c;
            var d = this.d;
            var tx = this.tx;
            var ty = this.ty;
            if (b == 0 && c == 0) {
                target.b = target.c = 0;
                if (a == 0 || d == 0) {
                    target.a = target.d = target.tx = target.ty = 0;
                }
                else {
                    a = target.a = 1 / a;
                    d = target.d = 1 / d;
                    target.tx = -a * tx;
                    target.ty = -d * ty;
                }
                return;
            }
            var determinant = a * d - b * c;
            if (determinant == 0) {
                target.identity();
                return;
            }
            determinant = 1 / determinant;
            var k = target.a = d * determinant;
            b = target.b = -b * determinant;
            c = target.c = -c * determinant;
            d = target.d = a * determinant;
            target.tx = -(k * tx + c * ty);
            target.ty = -(b * tx + d * ty);
        };
        Matrix.prototype.rotate = function (angle) {
            angle = +angle;
            if (angle !== 0) {
                angle = angle / DEG_TO_RAD;
                var u = egret.NumberUtils.cos(angle);
                var v = egret.NumberUtils.sin(angle);
                var ta = this.a;
                var tb = this.b;
                var tc = this.c;
                var td = this.d;
                var ttx = this.tx;
                var tty = this.ty;
                this.a = ta * u - tb * v;
                this.b = ta * v + tb * u;
                this.c = tc * u - td * v;
                this.d = tc * v + td * u;
                this.tx = ttx * u - tty * v;
                this.ty = ttx * v + tty * u;
            }
        };
        Matrix.prototype.scale = function (sx, sy) {
            if (sx !== 1) {
                this.a *= sx;
                this.c *= sx;
                this.tx *= sx;
            }
            if (sy !== 1) {
                this.b *= sy;
                this.d *= sy;
                this.ty *= sy;
            }
        };
        Matrix.prototype.setTo = function (a, b, c, d, tx, ty) {
            this.a = a;
            this.b = b;
            this.c = c;
            this.d = d;
            this.tx = tx;
            this.ty = ty;
            return this;
        };
        Matrix.prototype.transformPoint = function (pointX, pointY, resultPoint) {
            var x = this.a * pointX + this.c * pointY + this.tx;
            var y = this.b * pointX + this.d * pointY + this.ty;
            if (resultPoint) {
                resultPoint.setTo(x, y);
                return resultPoint;
            }
            return new egret.Point(x, y);
        };
        Matrix.prototype.translate = function (dx, dy) {
            this.tx += dx;
            this.ty += dy;
        };
        Matrix.prototype.equals = function (other) {
            return this.a == other.a && this.b == other.b &&
                this.c == other.c && this.d == other.d &&
                this.tx == other.tx && this.ty == other.ty;
        };
        Matrix.prototype.prepend = function (a, b, c, d, tx, ty) {
            var tx1 = this.tx;
            if (a != 1 || b != 0 || c != 0 || d != 1) {
                var a1 = this.a;
                var c1 = this.c;
                this.a = a1 * a + this.b * c;
                this.b = a1 * b + this.b * d;
                this.c = c1 * a + this.d * c;
                this.d = c1 * b + this.d * d;
            }
            this.tx = tx1 * a + this.ty * c + tx;
            this.ty = tx1 * b + this.ty * d + ty;
            return this;
        };
        Matrix.prototype.append = function (a, b, c, d, tx, ty) {
            var a1 = this.a;
            var b1 = this.b;
            var c1 = this.c;
            var d1 = this.d;
            if (a != 1 || b != 0 || c != 0 || d != 1) {
                this.a = a * a1 + b * c1;
                this.b = a * b1 + b * d1;
                this.c = c * a1 + d * c1;
                this.d = c * b1 + d * d1;
            }
            this.tx = tx * a1 + ty * c1 + this.tx;
            this.ty = tx * b1 + ty * d1 + this.ty;
            return this;
        };
        Matrix.prototype.deltaTransformPoint = function (point) {
            var self = this;
            var x = self.a * point.x + self.c * point.y;
            var y = self.b * point.x + self.d * point.y;
            return new egret.Point(x, y);
        };
        Matrix.prototype.toString = function () {
            return "(a=" + this.a + ", b=" + this.b + ", c=" + this.c + ", d=" + this.d + ", tx=" + this.tx + ", ty=" + this.ty + ")";
        };
        Matrix.prototype.createBox = function (scaleX, scaleY, rotation, tx, ty) {
            if (rotation === void 0) { rotation = 0; }
            if (tx === void 0) { tx = 0; }
            if (ty === void 0) { ty = 0; }
            var self = this;
            if (rotation !== 0) {
                rotation = rotation / DEG_TO_RAD;
                var u = egret.NumberUtils.cos(rotation);
                var v = egret.NumberUtils.sin(rotation);
                self.a = u * scaleX;
                self.b = v * scaleY;
                self.c = -v * scaleX;
                self.d = u * scaleY;
            }
            else {
                self.a = scaleX;
                self.b = 0;
                self.c = 0;
                self.d = scaleY;
            }
            self.tx = tx;
            self.ty = ty;
        };
        Matrix.prototype.createGradientBox = function (width, height, rotation, tx, ty) {
            if (rotation === void 0) { rotation = 0; }
            if (tx === void 0) { tx = 0; }
            if (ty === void 0) { ty = 0; }
            this.createBox(width / 1638.4, height / 1638.4, rotation, tx + width / 2, ty + height / 2);
        };
        Matrix.prototype.$transformBounds = function (bounds) {
            var a = this.a;
            var b = this.b;
            var c = this.c;
            var d = this.d;
            var tx = this.tx;
            var ty = this.ty;
            var x = bounds.x;
            var y = bounds.y;
            var xMax = x + bounds.width;
            var yMax = y + bounds.height;
            var x0 = a * x + c * y + tx;
            var y0 = b * x + d * y + ty;
            var x1 = a * xMax + c * y + tx;
            var y1 = b * xMax + d * y + ty;
            var x2 = a * xMax + c * yMax + tx;
            var y2 = b * xMax + d * yMax + ty;
            var x3 = a * x + c * yMax + tx;
            var y3 = b * x + d * yMax + ty;
            var tmp = 0;
            if (x0 > x1) {
                tmp = x0;
                x0 = x1;
                x1 = tmp;
            }
            if (x2 > x3) {
                tmp = x2;
                x2 = x3;
                x3 = tmp;
            }
            bounds.x = Math.floor(x0 < x2 ? x0 : x2);
            bounds.width = Math.ceil((x1 > x3 ? x1 : x3) - bounds.x);
            if (y0 > y1) {
                tmp = y0;
                y0 = y1;
                y1 = tmp;
            }
            if (y2 > y3) {
                tmp = y2;
                y2 = y3;
                y3 = tmp;
            }
            bounds.y = Math.floor(y0 < y2 ? y0 : y2);
            bounds.height = Math.ceil((y1 > y3 ? y1 : y3) - bounds.y);
        };
        Matrix.prototype.getDeterminant = function () {
            return this.a * this.d - this.b * this.c;
        };
        Matrix.prototype.$getScaleX = function () {
            var m = this;
            if (m.b == 0) {
                return m.a;
            }
            var result = Math.sqrt(m.a * m.a + m.b * m.b);
            return this.getDeterminant() < 0 ? -result : result;
        };
        Matrix.prototype.$getScaleY = function () {
            var m = this;
            if (m.c == 0) {
                return m.d;
            }
            var result = Math.sqrt(m.c * m.c + m.d * m.d);
            return this.getDeterminant() < 0 ? -result : result;
        };
        Matrix.prototype.$getSkewX = function () {
            if (this.d < 0) {
                return Math.atan2(this.d, this.c) + (PI / 2);
            }
            else {
                return Math.atan2(this.d, this.c) - (PI / 2);
            }
        };
        Matrix.prototype.$getSkewY = function () {
            if (this.a < 0) {
                return Math.atan2(this.b, this.a) - PI;
            }
            else {
                return Math.atan2(this.b, this.a);
            }
        };
        Matrix.prototype.$updateScaleAndRotation = function (scaleX, scaleY, skewX, skewY) {
            if ((skewX == 0 || skewX == TwoPI) && (skewY == 0 || skewY == TwoPI)) {
                this.a = scaleX;
                this.b = this.c = 0;
                this.d = scaleY;
                return;
            }
            skewX = skewX / DEG_TO_RAD;
            skewY = skewY / DEG_TO_RAD;
            var u = egret.NumberUtils.cos(skewX);
            var v = egret.NumberUtils.sin(skewX);
            if (skewX == skewY) {
                this.a = u * scaleX;
                this.b = v * scaleX;
            }
            else {
                this.a = egret.NumberUtils.cos(skewY) * scaleX;
                this.b = egret.NumberUtils.sin(skewY) * scaleX;
            }
            this.c = -v * scaleY;
            this.d = u * scaleY;
        };
        Matrix.prototype.$preMultiplyInto = function (other, target) {
            var a = other.a * this.a;
            var b = 0.0;
            var c = 0.0;
            var d = other.d * this.d;
            var tx = other.tx * this.a + this.tx;
            var ty = other.ty * this.d + this.ty;
            if (other.b !== 0.0 || other.c !== 0.0 || this.b !== 0.0 || this.c !== 0.0) {
                a += other.b * this.c;
                d += other.c * this.b;
                b += other.a * this.b + other.b * this.d;
                c += other.c * this.a + other.d * this.c;
                tx += other.ty * this.c;
                ty += other.tx * this.b;
            }
            target.a = a;
            target.b = b;
            target.c = c;
            target.d = d;
            target.tx = tx;
            target.ty = ty;
        };
        return Matrix;
    }(egret.HashObject));
    egret.Matrix = Matrix;
    egret.$TempMatrix = new Matrix();
})(egret || (egret = {}));
var egret;
(function (egret) {
    var rectanglePool = [];
    var Rectangle = (function (_super) {
        __extends(Rectangle, _super);
        function Rectangle(x, y, width, height) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            if (width === void 0) { width = 0; }
            if (height === void 0) { height = 0; }
            var _this = _super.call(this) || this;
            _this.x = x;
            _this.y = y;
            _this.width = width;
            _this.height = height;
            return _this;
        }
        Rectangle.release = function (rect) {
            if (!rect) {
                return;
            }
            rectanglePool.push(rect);
        };
        Rectangle.create = function () {
            var rect = rectanglePool.pop();
            if (!rect) {
                rect = new Rectangle();
            }
            return rect;
        };
        Object.defineProperty(Rectangle.prototype, "right", {
            get: function () {
                return this.x + this.width;
            },
            set: function (value) {
                this.width = value - this.x;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Rectangle.prototype, "bottom", {
            get: function () {
                return this.y + this.height;
            },
            set: function (value) {
                this.height = value - this.y;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Rectangle.prototype, "left", {
            get: function () {
                return this.x;
            },
            set: function (value) {
                this.width += this.x - value;
                this.x = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Rectangle.prototype, "top", {
            get: function () {
                return this.y;
            },
            set: function (value) {
                this.height += this.y - value;
                this.y = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Rectangle.prototype, "topLeft", {
            get: function () {
                return new egret.Point(this.left, this.top);
            },
            set: function (value) {
                this.top = value.y;
                this.left = value.x;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Rectangle.prototype, "bottomRight", {
            get: function () {
                return new egret.Point(this.right, this.bottom);
            },
            set: function (value) {
                this.bottom = value.y;
                this.right = value.x;
            },
            enumerable: true,
            configurable: true
        });
        Rectangle.prototype.copyFrom = function (sourceRect) {
            this.x = sourceRect.x;
            this.y = sourceRect.y;
            this.width = sourceRect.width;
            this.height = sourceRect.height;
            return this;
        };
        Rectangle.prototype.setTo = function (x, y, width, height) {
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            return this;
        };
        Rectangle.prototype.contains = function (x, y) {
            return this.x <= x &&
                this.x + this.width >= x &&
                this.y <= y &&
                this.y + this.height >= y;
        };
        Rectangle.prototype.intersection = function (toIntersect) {
            return this.clone().$intersectInPlace(toIntersect);
        };
        Rectangle.prototype.inflate = function (dx, dy) {
            this.x -= dx;
            this.width += 2 * dx;
            this.y -= dy;
            this.height += 2 * dy;
        };
        Rectangle.prototype.$intersectInPlace = function (clipRect) {
            var x0 = this.x;
            var y0 = this.y;
            var x1 = clipRect.x;
            var y1 = clipRect.y;
            var l = Math.max(x0, x1);
            var r = Math.min(x0 + this.width, x1 + clipRect.width);
            if (l <= r) {
                var t = Math.max(y0, y1);
                var b = Math.min(y0 + this.height, y1 + clipRect.height);
                if (t <= b) {
                    this.setTo(l, t, r - l, b - t);
                    return this;
                }
            }
            this.setEmpty();
            return this;
        };
        Rectangle.prototype.intersects = function (toIntersect) {
            return Math.max(this.x, toIntersect.x) <= Math.min(this.right, toIntersect.right)
                && Math.max(this.y, toIntersect.y) <= Math.min(this.bottom, toIntersect.bottom);
        };
        Rectangle.prototype.isEmpty = function () {
            return this.width <= 0 || this.height <= 0;
        };
        Rectangle.prototype.setEmpty = function () {
            this.x = 0;
            this.y = 0;
            this.width = 0;
            this.height = 0;
        };
        Rectangle.prototype.clone = function () {
            return new Rectangle(this.x, this.y, this.width, this.height);
        };
        Rectangle.prototype.containsPoint = function (point) {
            if (this.x <= point.x
                && this.x + this.width >= point.x
                && this.y <= point.y
                && this.y + this.height >= point.y) {
                return true;
            }
            return false;
        };
        Rectangle.prototype.containsRect = function (rect) {
            var r1 = rect.x + rect.width;
            var b1 = rect.y + rect.height;
            var r2 = this.x + this.width;
            var b2 = this.y + this.height;
            return (rect.x >= this.x) && (rect.x < r2) && (rect.y >= this.y) && (rect.y < b2) && (r1 > this.x) && (r1 <= r2) && (b1 > this.y) && (b1 <= b2);
        };
        Rectangle.prototype.equals = function (toCompare) {
            if (this === toCompare) {
                return true;
            }
            return this.x === toCompare.x && this.y === toCompare.y
                && this.width === toCompare.width && this.height === toCompare.height;
        };
        Rectangle.prototype.inflatePoint = function (point) {
            this.inflate(point.x, point.y);
        };
        Rectangle.prototype.offset = function (dx, dy) {
            this.x += dx;
            this.y += dy;
        };
        Rectangle.prototype.offsetPoint = function (point) {
            this.offset(point.x, point.y);
        };
        Rectangle.prototype.toString = function () {
            return "(x=" + this.x + ", y=" + this.y + ", width=" + this.width + ", height=" + this.height + ")";
        };
        Rectangle.prototype.union = function (toUnion) {
            var result = this.clone();
            if (toUnion.isEmpty()) {
                return result;
            }
            if (result.isEmpty()) {
                result.copyFrom(toUnion);
                return result;
            }
            var l = Math.min(result.x, toUnion.x);
            var t = Math.min(result.y, toUnion.y);
            result.setTo(l, t, Math.max(result.right, toUnion.right) - l, Math.max(result.bottom, toUnion.bottom) - t);
            return result;
        };
        Rectangle.prototype.$getBaseWidth = function (angle) {
            var u = Math.abs(Math.cos(angle));
            var v = Math.abs(Math.sin(angle));
            return u * this.width + v * this.height;
        };
        Rectangle.prototype.$getBaseHeight = function (angle) {
            var u = Math.abs(Math.cos(angle));
            var v = Math.abs(Math.sin(angle));
            return v * this.width + u * this.height;
        };
        return Rectangle;
    }(egret.HashObject));
    egret.Rectangle = Rectangle;
    egret.$TempRectangle = new Rectangle();
})(egret || (egret = {}));
var egret;
(function (egret) {
    egret.$locale_strings = egret.$locale_strings || {};
    egret.$language = "en_US";
})(egret || (egret = {}));
(function (egret) {
    var sys;
    (function (sys) {
        function tr(code) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            var text = egret.$locale_strings[egret.$language][code];
            if (!text) {
                return "{" + code + "}";
            }
            var length = args.length;
            for (var i = 0; i < length; i++) {
                text = text.replace("{" + i + "}", args[i]);
            }
            return text;
        }
        sys.tr = tr;
    })(sys = egret.sys || (egret.sys = {}));
})(egret || (egret = {}));
var egret;
(function (egret) {
    egret.$locale_strings = egret.$locale_strings || {};
    egret.$locale_strings["en_US"] = egret.$locale_strings["en_US"] || {};
    var locale_strings = egret.$locale_strings["en_US"];
    locale_strings[1001] = "Could not find Egret entry class: {0}。";
    locale_strings[1002] = "Egret entry class '{0}' must inherit from egret.DisplayObject.";
    locale_strings[1003] = "Parameter {0} must be non-null.";
    locale_strings[1004] = "An object cannot be added as a child to one of it's children (or children's children, etc.).";
    locale_strings[1005] = "An object cannot be added as a child of itself.";
    locale_strings[1006] = "The supplied DisplayObject must be a child of the caller.";
    locale_strings[1007] = "An index specified for a parameter was out of range.";
    locale_strings[1008] = "Instantiate singleton error，singleton class {0} can not create multiple instances.";
    locale_strings[1009] = "the Class {0} cannot use the property \"{1}\"";
    locale_strings[1010] = "the property \"{1}\" of the Class \"{0}\" is readonly";
    locale_strings[1011] = "Stream Error. URL: {0}";
    locale_strings[1012] = "The type of parameter {0} must be Class.";
    locale_strings[1013] = "Variable assignment is NaN, please see the code!";
    locale_strings[1014] = "the constant \"{1}\" of the Class \"{0}\" is read-only";
    locale_strings[1015] = "xml not found!";
    locale_strings[1016] = "{0}has been obsoleted";
    locale_strings[1017] = "The format of JSON file is incorrect: {0}\ndata: {1}";
    locale_strings[1018] = "the scale9Grid is not correct";
    locale_strings[1019] = "Network ab:{0}";
    locale_strings[1020] = "Cannot initialize Shader";
    locale_strings[1021] = "Current browser does not support webgl";
    locale_strings[1022] = "{0} ArgumentError";
    locale_strings[1023] = "This method is not available in the ScrollView!";
    locale_strings[1025] = "end of the file";
    locale_strings[1026] = "! EncodingError The code point {0} could not be encoded.";
    locale_strings[1027] = "DecodingError";
    locale_strings[1028] = ". called injection is not configured rule: {0}, please specify configuration during its initial years of injection rule, and then call the corresponding single case.";
    locale_strings[1029] = "Function.prototype.bind - what is trying to be bound is not callable";
    locale_strings[1033] = "Photos can not be used across domains toDataURL to convert base64";
    locale_strings[1034] = "Music file decoding failed: \"{0}\", please use the standard conversion tool reconversion under mp3.";
    locale_strings[1035] = "Native does not support this feature!";
    locale_strings[1036] = "Sound has stopped, please recall Sound.play () to play the sound!";
    locale_strings[1037] = "Non-load the correct blob!";
    locale_strings[1038] = "XML format error!";
    locale_strings[1039] = "Cross domains pictures can not get pixel information!";
    locale_strings[1040] = "hitTestPoint can not detect crossOrigin images! Please check if the display object has crossOrigin elements.";
    locale_strings[1041] = "{0} is deprecated, please use {1} replace";
    locale_strings[1042] = "The parameters passed in the region needs is an integer in drawToTexture method. Otherwise, some browsers will draw abnormal.";
    locale_strings[1043] = "Compile errors in {0}, the attribute name: {1}, the attribute value: {2}.";
    locale_strings[1044] = "The current version of the Runtime does not support video playback, please use the latest version";
    locale_strings[1045] = "The resource url is not found";
    locale_strings[1046] = "BitmapText no corresponding characters: {0}, please check the configuration file";
    locale_strings[1047] = "egret.localStorage.setItem save failed,key={0}&value={1}";
    locale_strings[1048] = "Video loading failed";
    locale_strings[1049] = "In the absence of sound is not allowed to play after loading";
    locale_strings[1050] = "ExternalInterface calls the method without js registration: {0}";
    locale_strings[1051] = "runtime only support webgl render mode";
    locale_strings[1052] = "network request timeout{0}";
    locale_strings[3000] = "Theme configuration file failed to load: {0}";
    locale_strings[3001] = "Cannot find the skin name which is configured in Theme: {0}";
    locale_strings[3002] = "Index:\"{0}\" is out of the collection element index range";
    locale_strings[3003] = "Cannot be available in this component. If this component is container, please continue to use";
    locale_strings[3004] = "addChild(){0}addElement() replace";
    locale_strings[3005] = "addChildAt(){0}addElementAt() replace";
    locale_strings[3006] = "removeChild(){0}removeElement() replace";
    locale_strings[3007] = "removeChildAt(){0}removeElementAt() replace";
    locale_strings[3008] = "setChildIndex(){0}setElementIndex() replace";
    locale_strings[3009] = "swapChildren(){0}swapElements() replace";
    locale_strings[3010] = "swapChildrenAt(){0}swapElementsAt() replace";
    locale_strings[3011] = "Index:\"{0}\" is out of the visual element index range";
    locale_strings[3012] = "This method is not available in Scroller component!";
    locale_strings[3013] = "UIStage is GUI root container, and only one such instant is in the display list！";
    locale_strings[3014] = "set fullscreen error";
    locale_strings[3100] = "Current browser does not support WebSocket";
    locale_strings[3101] = "Please connect Socket firstly";
    locale_strings[3102] = "Please set the type of binary type";
    locale_strings[3200] = "getResByUrl must be called after loadConfig";
    locale_strings[4000] = "An Bone cannot be added as a child to itself or one of its children (or children's children, etc.)";
    locale_strings[4001] = "Abstract class can not be instantiated!";
    locale_strings[4002] = "Unnamed data!";
    locale_strings[4003] = "Nonsupport version!";
    locale_strings[4500] = "The platform does not support {0} adapter mode and has been automatically replaced with {1} mode, please modify your code adapter logic";
})(egret || (egret = {}));
var egret;
(function (egret) {
    var localStorage;
    (function (localStorage) {
    })(localStorage = egret.localStorage || (egret.localStorage = {}));
})(egret || (egret = {}));
var egret;
(function (egret) {
    var localStorage;
    (function (localStorage) {
        var web;
        (function (web) {
            function getItem(key) {
                return window.localStorage.getItem(key);
            }
            function setItem(key, value) {
                try {
                    window.localStorage.setItem(key, value);
                    return true;
                }
                catch (e) {
                    egret.warn(1047, key, value);
                    return false;
                }
            }
            function removeItem(key) {
                window.localStorage.removeItem(key);
            }
            function clear() {
                window.localStorage.clear();
            }
            localStorage.getItem = getItem;
            localStorage.setItem = setItem;
            localStorage.removeItem = removeItem;
            localStorage.clear = clear;
        })(web = localStorage.web || (localStorage.web = {}));
    })(localStorage = egret.localStorage || (egret.localStorage = {}));
})(egret || (egret = {}));
var egret;
(function (egret) {
    var sys;
    (function (sys) {
        var usingChannel = [];
        function $pushSoundChannel(channel) {
            if (usingChannel.indexOf(channel) < 0) {
                usingChannel.push(channel);
            }
        }
        sys.$pushSoundChannel = $pushSoundChannel;
        function $popSoundChannel(channel) {
            var index = usingChannel.indexOf(channel);
            if (index >= 0) {
                usingChannel.splice(index, 1);
                return true;
            }
            return false;
        }
        sys.$popSoundChannel = $popSoundChannel;
    })(sys = egret.sys || (egret.sys = {}));
})(egret || (egret = {}));
(function (egret) {
})(egret || (egret = {}));
var egret;
(function (egret) {
})(egret || (egret = {}));
var egret;
(function (egret) {
    var web;
    (function (web) {
        var HtmlSound = (function (_super) {
            __extends(HtmlSound, _super);
            function HtmlSound() {
                var _this = _super.call(this) || this;
                _this.loaded = false;
                return _this;
            }
            Object.defineProperty(HtmlSound.prototype, "length", {
                get: function () {
                    if (this.originAudio) {
                        return this.originAudio.duration;
                    }
                    throw new Error("sound not loaded!");
                },
                enumerable: true,
                configurable: true
            });
            HtmlSound.prototype.load = function (url) {
                var self = this;
                this.url = url;
                var audio = new Audio(url);
                audio.addEventListener("canplaythrough", onAudioLoaded);
                audio.addEventListener("error", onAudioError);
                var ua = navigator.userAgent.toLowerCase();
                if (ua.indexOf("firefox") >= 0) {
                    audio.autoplay = !0;
                    audio.muted = true;
                }
                var ie = ua.indexOf("edge") >= 0 || ua.indexOf("trident") >= 0;
                if (ie) {
                    document.body.appendChild(audio);
                }
                audio.load();
                this.originAudio = audio;
                if (HtmlSound.clearAudios[this.url]) {
                    delete HtmlSound.clearAudios[this.url];
                }
                function onAudioLoaded() {
                    HtmlSound.$recycle(self.url, audio);
                    removeListeners();
                    if (ua.indexOf("firefox") >= 0) {
                        audio.pause();
                        audio.muted = false;
                    }
                    if (ie) {
                        document.body.appendChild(audio);
                    }
                    self.loaded = true;
                    self.dispatchEventWith(egret.Event.COMPLETE);
                }
                function onAudioError() {
                    removeListeners();
                    self.dispatchEventWith(egret.IOErrorEvent.IO_ERROR);
                }
                function removeListeners() {
                    audio.removeEventListener("canplaythrough", onAudioLoaded);
                    audio.removeEventListener("error", onAudioError);
                    if (ie) {
                        document.body.removeChild(audio);
                    }
                }
            };
            HtmlSound.prototype.play = function (startTime, loops) {
                startTime = +startTime || 0;
                loops = +loops || 0;
                var audio = HtmlSound.$pop(this.url);
                if (audio == null) {
                    audio = this.originAudio.cloneNode();
                }
                else {
                }
                audio.autoplay = true;
                var channel = new web.HtmlSoundChannel(audio);
                channel.$url = this.url;
                channel.$loops = loops;
                channel.$startTime = startTime;
                channel.$play();
                egret.sys.$pushSoundChannel(channel);
                return channel;
            };
            HtmlSound.prototype.close = function () {
                if (this.loaded && this.originAudio) {
                    this.originAudio.src = "";
                }
                if (this.originAudio)
                    this.originAudio = null;
                HtmlSound.$clear(this.url);
                this.loaded = false;
            };
            HtmlSound.$clear = function (url) {
                HtmlSound.clearAudios[url] = true;
                var array = HtmlSound.audios[url];
                if (array) {
                    array.length = 0;
                }
            };
            HtmlSound.$pop = function (url) {
                var array = HtmlSound.audios[url];
                if (array && array.length > 0) {
                    return array.pop();
                }
                return null;
            };
            HtmlSound.$recycle = function (url, audio) {
                if (HtmlSound.clearAudios[url]) {
                    return;
                }
                var array = HtmlSound.audios[url];
                if (HtmlSound.audios[url] == null) {
                    array = HtmlSound.audios[url] = [];
                }
                array.push(audio);
            };
            HtmlSound.MUSIC = "music";
            HtmlSound.EFFECT = "effect";
            HtmlSound.audios = {};
            HtmlSound.clearAudios = {};
            return HtmlSound;
        }(egret.EventDispatcher));
        web.HtmlSound = HtmlSound;
    })(web = egret.web || (egret.web = {}));
})(egret || (egret = {}));
var egret;
(function (egret) {
    var web;
    (function (web) {
        var HtmlSoundChannel = (function (_super) {
            __extends(HtmlSoundChannel, _super);
            function HtmlSoundChannel(audio) {
                var _this = _super.call(this) || this;
                _this.$startTime = 0;
                _this.audio = null;
                _this.isStopped = false;
                _this.canPlay = function () {
                    _this.audio.removeEventListener("canplay", _this.canPlay);
                    try {
                        _this.audio.currentTime = _this.$startTime;
                    }
                    catch (e) {
                    }
                    finally {
                        _this.audio.play();
                    }
                };
                _this.onPlayEnd = function () {
                    if (_this.$loops == 1) {
                        _this.stop();
                        _this.dispatchEventWith(egret.Event.SOUND_COMPLETE);
                        return;
                    }
                    if (_this.$loops > 0) {
                        _this.$loops--;
                    }
                    _this.$play();
                };
                _this._volume = 1;
                audio.addEventListener("ended", _this.onPlayEnd);
                _this.audio = audio;
                return _this;
            }
            HtmlSoundChannel.prototype.$play = function () {
                if (this.isStopped) {
                    egret.error(1036);
                    return;
                }
                try {
                    this.audio.volume = this._volume;
                    this.audio.currentTime = this.$startTime;
                }
                catch (e) {
                    this.audio.addEventListener("canplay", this.canPlay);
                    return;
                }
                this.audio.play();
            };
            HtmlSoundChannel.prototype.stop = function () {
                if (!this.audio)
                    return;
                if (!this.isStopped) {
                    egret.sys.$popSoundChannel(this);
                }
                this.isStopped = true;
                var audio = this.audio;
                audio.removeEventListener("ended", this.onPlayEnd);
                audio.removeEventListener("canplay", this.canPlay);
                audio.volume = 0;
                this._volume = 0;
                this.audio = null;
                var url = this.$url;
                window.setTimeout(function () {
                    audio.pause();
                    web.HtmlSound.$recycle(url, audio);
                }, 200);
            };
            Object.defineProperty(HtmlSoundChannel.prototype, "volume", {
                get: function () {
                    return this._volume;
                },
                set: function (value) {
                    if (this.isStopped) {
                        egret.error(1036);
                        return;
                    }
                    this._volume = value;
                    if (!this.audio)
                        return;
                    this.audio.volume = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(HtmlSoundChannel.prototype, "position", {
                get: function () {
                    if (!this.audio)
                        return 0;
                    return this.audio.currentTime;
                },
                enumerable: true,
                configurable: true
            });
            return HtmlSoundChannel;
        }(egret.EventDispatcher));
        web.HtmlSoundChannel = HtmlSoundChannel;
    })(web = egret.web || (egret.web = {}));
})(egret || (egret = {}));
var egret;
(function (egret) {
    var web;
    (function (web) {
        var WebAudioDecode = (function () {
            function WebAudioDecode() {
            }
            WebAudioDecode.decodeAudios = function () {
                if (WebAudioDecode.decodeArr.length <= 0) {
                    return;
                }
                if (WebAudioDecode.isDecoding) {
                    return;
                }
                WebAudioDecode.isDecoding = true;
                var decodeInfo = WebAudioDecode.decodeArr.shift();
                WebAudioDecode.ctx.decodeAudioData(decodeInfo["buffer"], function (audioBuffer) {
                    decodeInfo["self"].audioBuffer = audioBuffer;
                    if (decodeInfo["success"]) {
                        decodeInfo["success"]();
                    }
                    WebAudioDecode.isDecoding = false;
                    WebAudioDecode.decodeAudios();
                }, function () {
                    egret.log('sound decode error');
                    if (decodeInfo["fail"]) {
                        decodeInfo["fail"]();
                    }
                    WebAudioDecode.isDecoding = false;
                    WebAudioDecode.decodeAudios();
                });
            };
            WebAudioDecode.decodeArr = [];
            WebAudioDecode.isDecoding = false;
            return WebAudioDecode;
        }());
        web.WebAudioDecode = WebAudioDecode;
        var WebAudioSound = (function (_super) {
            __extends(WebAudioSound, _super);
            function WebAudioSound() {
                var _this = _super.call(this) || this;
                _this.loaded = false;
                return _this;
            }
            Object.defineProperty(WebAudioSound.prototype, "length", {
                get: function () {
                    if (this.audioBuffer) {
                        return this.audioBuffer.duration;
                    }
                    throw new Error("sound not loaded!");
                },
                enumerable: true,
                configurable: true
            });
            WebAudioSound.prototype.load = function (url) {
                var self = this;
                this.url = url;
                var request = new XMLHttpRequest();
                request.open("GET", url, true);
                request.responseType = "arraybuffer";
                request.addEventListener("load", function () {
                    var ioError = (request.status >= 400);
                    if (ioError) {
                        self.dispatchEventWith(egret.IOErrorEvent.IO_ERROR);
                    }
                    else {
                        WebAudioDecode.decodeArr.push({
                            "buffer": request.response,
                            "success": onAudioLoaded,
                            "fail": onAudioError,
                            "self": self,
                            "url": self.url
                        });
                        WebAudioDecode.decodeAudios();
                    }
                });
                request.addEventListener("error", function () {
                    self.dispatchEventWith(egret.IOErrorEvent.IO_ERROR);
                });
                request.send();
                function onAudioLoaded() {
                    self.loaded = true;
                    self.dispatchEventWith(egret.Event.COMPLETE);
                }
                function onAudioError() {
                    self.dispatchEventWith(egret.IOErrorEvent.IO_ERROR);
                }
            };
            WebAudioSound.prototype.play = function (startTime, loops) {
                startTime = +startTime || 0;
                loops = +loops || 0;
                var channel = new web.WebAudioSoundChannel();
                channel.$url = this.url;
                channel.$loops = loops;
                channel.$audioBuffer = this.audioBuffer;
                channel.$startTime = startTime;
                channel.$play();
                egret.sys.$pushSoundChannel(channel);
                return channel;
            };
            WebAudioSound.prototype.close = function () {
            };
            WebAudioSound.MUSIC = "music";
            WebAudioSound.EFFECT = "effect";
            return WebAudioSound;
        }(egret.EventDispatcher));
        web.WebAudioSound = WebAudioSound;
    })(web = egret.web || (egret.web = {}));
})(egret || (egret = {}));
var egret;
(function (egret) {
    var web;
    (function (web) {
        var WebAudioSoundChannel = (function (_super) {
            __extends(WebAudioSoundChannel, _super);
            function WebAudioSoundChannel() {
                var _this = _super.call(this) || this;
                _this.$startTime = 0;
                _this.bufferSource = null;
                _this.context = web.WebAudioDecode.ctx;
                _this.isStopped = false;
                _this._currentTime = 0;
                _this._volume = 1;
                _this.onPlayEnd = function () {
                    if (_this.$loops == 1) {
                        _this.stop();
                        _this.dispatchEventWith(egret.Event.SOUND_COMPLETE);
                        return;
                    }
                    if (_this.$loops > 0) {
                        _this.$loops--;
                    }
                    _this.$play();
                };
                _this._startTime = 0;
                if (_this.context["createGain"]) {
                    _this.gain = _this.context["createGain"]();
                }
                else {
                    _this.gain = _this.context["createGainNode"]();
                }
                return _this;
            }
            WebAudioSoundChannel.prototype.$play = function () {
                if (this.isStopped) {
                    egret.error(1036);
                    return;
                }
                if (this.bufferSource) {
                    this.bufferSource.onended = null;
                    this.bufferSource = null;
                }
                var context = this.context;
                var gain = this.gain;
                var bufferSource = context.createBufferSource();
                this.bufferSource = bufferSource;
                bufferSource.buffer = this.$audioBuffer;
                bufferSource.connect(gain);
                gain.connect(context.destination);
                bufferSource.onended = this.onPlayEnd;
                this._startTime = Date.now();
                this.gain.gain.value = this._volume;
                bufferSource.start(0, this.$startTime);
                this._currentTime = 0;
            };
            WebAudioSoundChannel.prototype.stop = function () {
                if (this.bufferSource) {
                    var sourceNode = this.bufferSource;
                    if (sourceNode.stop) {
                        sourceNode.stop(0);
                    }
                    else {
                        sourceNode.noteOff(0);
                    }
                    sourceNode.onended = null;
                    sourceNode.disconnect();
                    this.bufferSource = null;
                    this.$audioBuffer = null;
                }
                if (!this.isStopped) {
                    egret.sys.$popSoundChannel(this);
                }
                this.isStopped = true;
            };
            Object.defineProperty(WebAudioSoundChannel.prototype, "volume", {
                get: function () {
                    return this._volume;
                },
                set: function (value) {
                    if (this.isStopped) {
                        egret.error(1036);
                        return;
                    }
                    this._volume = value;
                    this.gain.gain.value = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(WebAudioSoundChannel.prototype, "position", {
                get: function () {
                    if (this.bufferSource) {
                        return (Date.now() - this._startTime) / 1000 + this.$startTime;
                    }
                    return 0;
                },
                enumerable: true,
                configurable: true
            });
            return WebAudioSoundChannel;
        }(egret.EventDispatcher));
        web.WebAudioSoundChannel = WebAudioSoundChannel;
    })(web = egret.web || (egret.web = {}));
})(egret || (egret = {}));
var egret;
(function (egret) {
    var sys;
    (function (sys) {
        var RenderNode = (function () {
            function RenderNode() {
                this.type = 0;
                this.drawData = [];
                this.renderCount = 0;
            }
            RenderNode.prototype.cleanBeforeRender = function () {
                this.drawData.length = 0;
                this.renderCount = 0;
            };
            RenderNode.prototype.$getRenderCount = function () {
                return this.renderCount;
            };
            return RenderNode;
        }());
        sys.RenderNode = RenderNode;
    })(sys = egret.sys || (egret.sys = {}));
})(egret || (egret = {}));
var egret;
(function (egret) {
    var sys;
    (function (sys) {
        var NormalBitmapNode = (function (_super) {
            __extends(NormalBitmapNode, _super);
            function NormalBitmapNode() {
                var _this = _super.call(this) || this;
                _this.image = null;
                _this.smoothing = true;
                _this.rotated = false;
                _this.type = 6;
                return _this;
            }
            NormalBitmapNode.prototype.drawImage = function (sourceX, sourceY, sourceW, sourceH, drawX, drawY, drawW, drawH) {
                var self = this;
                self.sourceX = sourceX;
                self.sourceY = sourceY;
                self.sourceW = sourceW;
                self.sourceH = sourceH;
                self.drawX = drawX;
                self.drawY = drawY;
                self.drawW = drawW;
                self.drawH = drawH;
                self.renderCount = 1;
            };
            NormalBitmapNode.prototype.cleanBeforeRender = function () {
                _super.prototype.cleanBeforeRender.call(this);
                this.image = null;
            };
            return NormalBitmapNode;
        }(sys.RenderNode));
        sys.NormalBitmapNode = NormalBitmapNode;
    })(sys = egret.sys || (egret.sys = {}));
})(egret || (egret = {}));
var egret;
(function (egret) {
    var sys;
    (function (sys) {
        var BitmapNode = (function (_super) {
            __extends(BitmapNode, _super);
            function BitmapNode() {
                var _this = _super.call(this) || this;
                _this.image = null;
                _this.smoothing = true;
                _this.blendMode = null;
                _this.alpha = NaN;
                _this.filter = null;
                _this.rotated = false;
                _this.type = 1;
                return _this;
            }
            BitmapNode.prototype.drawImage = function (sourceX, sourceY, sourceW, sourceH, drawX, drawY, drawW, drawH) {
                this.drawData.push(sourceX, sourceY, sourceW, sourceH, drawX, drawY, drawW, drawH);
                this.renderCount++;
            };
            BitmapNode.prototype.cleanBeforeRender = function () {
                _super.prototype.cleanBeforeRender.call(this);
                this.image = null;
                this.matrix = null;
                this.blendMode = null;
                this.alpha = NaN;
                this.filter = null;
            };
            BitmapNode.$updateTextureData = function (node, image, bitmapX, bitmapY, bitmapWidth, bitmapHeight, offsetX, offsetY, textureWidth, textureHeight, destW, destH, sourceWidth, sourceHeight, fillMode, smoothing) {
                if (!image) {
                    return;
                }
                var scale = egret.$TextureScaleFactor;
                node.smoothing = smoothing;
                node.image = image;
                node.imageWidth = sourceWidth;
                node.imageHeight = sourceHeight;
                if (fillMode == egret.BitmapFillMode.SCALE) {
                    var tsX = destW / textureWidth * scale;
                    var tsY = destH / textureHeight * scale;
                    node.drawImage(bitmapX, bitmapY, bitmapWidth, bitmapHeight, tsX * offsetX, tsY * offsetY, tsX * bitmapWidth, tsY * bitmapHeight);
                }
                else if (fillMode == egret.BitmapFillMode.CLIP) {
                    var displayW = Math.min(textureWidth, destW);
                    var displayH = Math.min(textureHeight, destH);
                    var scaledBitmapW = bitmapWidth * scale;
                    var scaledBitmapH = bitmapHeight * scale;
                    BitmapNode.drawClipImage(node, scale, bitmapX, bitmapY, scaledBitmapW, scaledBitmapH, offsetX, offsetY, displayW, displayH);
                }
                else {
                    var scaledBitmapW = bitmapWidth * scale;
                    var scaledBitmapH = bitmapHeight * scale;
                    for (var startX = 0; startX < destW; startX += textureWidth) {
                        for (var startY = 0; startY < destH; startY += textureHeight) {
                            var displayW = Math.min(destW - startX, textureWidth);
                            var displayH = Math.min(destH - startY, textureHeight);
                            BitmapNode.drawClipImage(node, scale, bitmapX, bitmapY, scaledBitmapW, scaledBitmapH, offsetX, offsetY, displayW, displayH, startX, startY);
                        }
                    }
                }
            };
            BitmapNode.$updateTextureDataWithScale9Grid = function (node, image, scale9Grid, bitmapX, bitmapY, bitmapWidth, bitmapHeight, offsetX, offsetY, textureWidth, textureHeight, destW, destH, sourceWidth, sourceHeight, smoothing) {
                node.smoothing = smoothing;
                node.image = image;
                node.imageWidth = sourceWidth;
                node.imageHeight = sourceHeight;
                var imageWidth = bitmapWidth;
                var imageHeight = bitmapHeight;
                destW = destW - (textureWidth - bitmapWidth * egret.$TextureScaleFactor);
                destH = destH - (textureHeight - bitmapHeight * egret.$TextureScaleFactor);
                var targetW0 = scale9Grid.x - offsetX;
                var targetH0 = scale9Grid.y - offsetY;
                var sourceW0 = targetW0 / egret.$TextureScaleFactor;
                var sourceH0 = targetH0 / egret.$TextureScaleFactor;
                var sourceW1 = scale9Grid.width / egret.$TextureScaleFactor;
                var sourceH1 = scale9Grid.height / egret.$TextureScaleFactor;
                if (sourceH1 == 0) {
                    sourceH1 = 1;
                    if (sourceH0 >= imageHeight) {
                        sourceH0--;
                    }
                }
                if (sourceW1 == 0) {
                    sourceW1 = 1;
                    if (sourceW0 >= imageWidth) {
                        sourceW0--;
                    }
                }
                var sourceX0 = bitmapX;
                var sourceX1 = sourceX0 + sourceW0;
                var sourceX2 = sourceX1 + sourceW1;
                var sourceW2 = imageWidth - sourceW0 - sourceW1;
                var sourceY0 = bitmapY;
                var sourceY1 = sourceY0 + sourceH0;
                var sourceY2 = sourceY1 + sourceH1;
                var sourceH2 = imageHeight - sourceH0 - sourceH1;
                var targetW2 = sourceW2 * egret.$TextureScaleFactor;
                var targetH2 = sourceH2 * egret.$TextureScaleFactor;
                if ((sourceW0 + sourceW2) * egret.$TextureScaleFactor > destW || (sourceH0 + sourceH2) * egret.$TextureScaleFactor > destH) {
                    node.drawImage(bitmapX, bitmapY, bitmapWidth, bitmapHeight, offsetX, offsetY, destW, destH);
                    return;
                }
                var targetX0 = offsetX;
                var targetX1 = targetX0 + targetW0;
                var targetX2 = targetX0 + (destW - targetW2);
                var targetW1 = destW - targetW0 - targetW2;
                var targetY0 = offsetY;
                var targetY1 = targetY0 + targetH0;
                var targetY2 = targetY0 + destH - targetH2;
                var targetH1 = destH - targetH0 - targetH2;
                if (sourceH0 > 0) {
                    if (sourceW0 > 0)
                        node.drawImage(sourceX0, sourceY0, sourceW0, sourceH0, targetX0, targetY0, targetW0, targetH0);
                    if (sourceW1 > 0)
                        node.drawImage(sourceX1, sourceY0, sourceW1, sourceH0, targetX1, targetY0, targetW1, targetH0);
                    if (sourceW2 > 0)
                        node.drawImage(sourceX2, sourceY0, sourceW2, sourceH0, targetX2, targetY0, targetW2, targetH0);
                }
                if (sourceH1 > 0) {
                    if (sourceW0 > 0)
                        node.drawImage(sourceX0, sourceY1, sourceW0, sourceH1, targetX0, targetY1, targetW0, targetH1);
                    if (sourceW1 > 0)
                        node.drawImage(sourceX1, sourceY1, sourceW1, sourceH1, targetX1, targetY1, targetW1, targetH1);
                    if (sourceW2 > 0)
                        node.drawImage(sourceX2, sourceY1, sourceW2, sourceH1, targetX2, targetY1, targetW2, targetH1);
                }
                if (sourceH2 > 0) {
                    if (sourceW0 > 0)
                        node.drawImage(sourceX0, sourceY2, sourceW0, sourceH2, targetX0, targetY2, targetW0, targetH2);
                    if (sourceW1 > 0)
                        node.drawImage(sourceX1, sourceY2, sourceW1, sourceH2, targetX1, targetY2, targetW1, targetH2);
                    if (sourceW2 > 0)
                        node.drawImage(sourceX2, sourceY2, sourceW2, sourceH2, targetX2, targetY2, targetW2, targetH2);
                }
            };
            BitmapNode.drawClipImage = function (node, scale, bitmapX, bitmapY, scaledBitmapW, scaledBitmapH, offsetX, offsetY, destW, destH, startX, startY) {
                if (startX === void 0) { startX = 0; }
                if (startY === void 0) { startY = 0; }
                var offset = offsetX + scaledBitmapW - destW;
                if (offset > 0) {
                    scaledBitmapW -= offset;
                }
                offset = offsetY + scaledBitmapH - destH;
                if (offset > 0) {
                    scaledBitmapH -= offset;
                }
                node.drawImage(bitmapX, bitmapY, scaledBitmapW / scale, scaledBitmapH / scale, startX + offsetX, startY + offsetY, scaledBitmapW, scaledBitmapH);
            };
            return BitmapNode;
        }(sys.RenderNode));
        sys.BitmapNode = BitmapNode;
    })(sys = egret.sys || (egret.sys = {}));
})(egret || (egret = {}));
var egret;
(function (egret) {
    var RuntimeType;
    (function (RuntimeType) {
        RuntimeType.WEB = "web";
        RuntimeType.NATIVE = "native";
        RuntimeType.RUNTIME2 = "runtime2";
        RuntimeType.MYGAME = "mygame";
        RuntimeType.WXGAME = "wxgame";
        RuntimeType.BAIDUGAME = "baidugame";
        RuntimeType.QGAME = "qgame";
        RuntimeType.OPPOGAME = "oppogame";
        RuntimeType.QQGAME = "qqgame";
        RuntimeType.VIVOGAME = "vivogame";
    })(RuntimeType = egret.RuntimeType || (egret.RuntimeType = {}));
    var Capabilities = (function () {
        function Capabilities() {
        }
        Capabilities.language = "zh-CN";
        Capabilities.os = "Unknown";
        Capabilities.runtimeType = egret.RuntimeType.WEB;
        Capabilities.engineVersion = "5.2.33";
        Capabilities.renderMode = "Unknown";
        Capabilities.boundingClientWidth = 0;
        Capabilities.boundingClientHeight = 0;
        return Capabilities;
    }());
    egret.Capabilities = Capabilities;
})(egret || (egret = {}));
var egret;
(function (egret) {
    var web;
    (function (web) {
        var WebVideo = (function (_super) {
            __extends(WebVideo, _super);
            function WebVideo(url, cache) {
                if (cache === void 0) { cache = true; }
                var _this = _super.call(this) || this;
                _this.loaded = false;
                _this.closed = false;
                _this.heightSet = NaN;
                _this.widthSet = NaN;
                _this.waiting = false;
                _this.userPause = false;
                _this.userPlay = false;
                _this.isPlayed = false;
                _this.screenChanged = function (e) {
                    var isfullscreen = document.fullscreenEnabled || document["webkitIsFullScreen"];
                    if (!isfullscreen) {
                        _this.checkFullScreen(false);
                        if (!egret.Capabilities.isMobile) {
                            _this._fullscreen = isfullscreen;
                        }
                    }
                };
                _this._fullscreen = true;
                _this.onVideoLoaded = function () {
                    _this.video.removeEventListener("canplay", _this.onVideoLoaded);
                    var video = _this.video;
                    _this.loaded = true;
                    if (_this.posterData) {
                        _this.posterData.width = _this.getPlayWidth();
                        _this.posterData.height = _this.getPlayHeight();
                    }
                    video.width = video.videoWidth;
                    video.height = video.videoHeight;
                    window.setTimeout(function () {
                        _this.dispatchEventWith(egret.Event.COMPLETE);
                    }, 200);
                };
                _this.$renderNode = new egret.sys.BitmapNode();
                _this.src = url;
                _this.once(egret.Event.ADDED_TO_STAGE, _this.loadPoster, _this);
                if (url) {
                    _this.load();
                }
                return _this;
            }
            WebVideo.prototype.createNativeDisplayObject = function () {
                this.$nativeDisplayObject = new egret_native.NativeDisplayObject(1);
            };
            WebVideo.prototype.load = function (url, cache) {
                var _this = this;
                if (cache === void 0) { cache = true; }
                url = url || this.src;
                this.src = url;
                if (this.video && this.video.src == url) {
                    return;
                }
                var video;
                if (!this.video || egret.Capabilities.isMobile) {
                    video = document.createElement("video");
                    this.video = video;
                    video.controls = null;
                }
                else {
                    video = this.video;
                }
                video.src = url;
                video.setAttribute("autoplay", "autoplay");
                video.setAttribute("webkit-playsinline", "true");
                video.addEventListener("canplay", this.onVideoLoaded);
                video.addEventListener("error", function () { return _this.onVideoError(); });
                video.addEventListener("ended", function () { return _this.onVideoEnded(); });
                var firstPause = false;
                video.addEventListener("canplay", function () {
                    _this.waiting = false;
                    if (!firstPause) {
                        firstPause = true;
                        video.pause();
                    }
                    else {
                        if (_this.userPause) {
                            _this.pause();
                        }
                        else if (_this.userPlay) {
                            _this.play();
                        }
                    }
                });
                video.addEventListener("waiting", function () {
                    _this.waiting = true;
                });
                video.load();
                this.videoPlay();
                video.style.position = "absolute";
                video.style.top = "0px";
                video.style.zIndex = "-88888";
                video.style.left = "0px";
                video.height = 1;
                video.width = 1;
            };
            WebVideo.prototype.play = function (startTime, loop) {
                var _this = this;
                if (loop === void 0) { loop = false; }
                if (this.loaded == false) {
                    this.load(this.src);
                    this.once(egret.Event.COMPLETE, function (e) { return _this.play(startTime, loop); }, this);
                    return;
                }
                this.isPlayed = true;
                var video = this.video;
                if (startTime != undefined) {
                    video.currentTime = +startTime || 0;
                }
                video.loop = !!loop;
                if (egret.Capabilities.isMobile) {
                    video.style.zIndex = "-88888";
                }
                else {
                    video.style.zIndex = "9999";
                }
                video.style.position = "absolute";
                video.style.top = "0px";
                video.style.left = "0px";
                video.height = video.videoHeight;
                video.width = video.videoWidth;
                if (egret.Capabilities.os != "Windows PC" && egret.Capabilities.os != "Mac OS") {
                    window.setTimeout(function () {
                        video.width = 0;
                    }, 1000);
                }
                this.checkFullScreen(this._fullscreen);
            };
            WebVideo.prototype.videoPlay = function () {
                this.userPause = false;
                if (this.waiting) {
                    this.userPlay = true;
                    return;
                }
                this.userPlay = false;
                this.video.play();
            };
            WebVideo.prototype.checkFullScreen = function (playFullScreen) {
                var video = this.video;
                if (playFullScreen) {
                    if (video.parentElement == null) {
                        video.removeAttribute("webkit-playsinline");
                        document.body.appendChild(video);
                    }
                    egret.stopTick(this.markDirty, this);
                    this.goFullscreen();
                }
                else {
                    if (video.parentElement != null) {
                        video.parentElement.removeChild(video);
                    }
                    video.setAttribute("webkit-playsinline", "true");
                    this.setFullScreenMonitor(false);
                    egret.startTick(this.markDirty, this);
                    if (egret.Capabilities.isMobile) {
                        this.video.currentTime = 0;
                        this.onVideoEnded();
                        return;
                    }
                }
                this.videoPlay();
            };
            WebVideo.prototype.goFullscreen = function () {
                var video = this.video;
                var fullscreenType;
                fullscreenType = egret.web.getPrefixStyleName('requestFullscreen', video);
                if (!video[fullscreenType]) {
                    fullscreenType = egret.web.getPrefixStyleName('requestFullScreen', video);
                    if (!video[fullscreenType]) {
                        return true;
                    }
                }
                video.removeAttribute("webkit-playsinline");
                video[fullscreenType]();
                this.setFullScreenMonitor(true);
                return true;
            };
            WebVideo.prototype.setFullScreenMonitor = function (use) {
                var video = this.video;
                if (use) {
                    video.addEventListener("mozfullscreenchange", this.screenChanged);
                    video.addEventListener("webkitfullscreenchange", this.screenChanged);
                    video.addEventListener("mozfullscreenerror", this.screenError);
                    video.addEventListener("webkitfullscreenerror", this.screenError);
                }
                else {
                    video.removeEventListener("mozfullscreenchange", this.screenChanged);
                    video.removeEventListener("webkitfullscreenchange", this.screenChanged);
                    video.removeEventListener("mozfullscreenerror", this.screenError);
                    video.removeEventListener("webkitfullscreenerror", this.screenError);
                }
            };
            WebVideo.prototype.screenError = function () {
                egret.error(3014);
            };
            WebVideo.prototype.exitFullscreen = function () {
                if (document['exitFullscreen']) {
                    document['exitFullscreen']();
                }
                else if (document['msExitFullscreen']) {
                    document['msExitFullscreen']();
                }
                else if (document['mozCancelFullScreen']) {
                    document['mozCancelFullScreen']();
                }
                else if (document['oCancelFullScreen']) {
                    document['oCancelFullScreen']();
                }
                else if (document['webkitExitFullscreen']) {
                    document['webkitExitFullscreen']();
                }
                else {
                }
            };
            WebVideo.prototype.onVideoEnded = function () {
                this.pause();
                this.isPlayed = false;
                this.dispatchEventWith(egret.Event.ENDED);
            };
            WebVideo.prototype.onVideoError = function () {
                this.dispatchEventWith(egret.IOErrorEvent.IO_ERROR);
            };
            WebVideo.prototype.close = function () {
                var _this = this;
                this.closed = true;
                this.video.removeEventListener("canplay", this.onVideoLoaded);
                this.video.removeEventListener("error", function () { return _this.onVideoError(); });
                this.video.removeEventListener("ended", function () { return _this.onVideoEnded(); });
                this.pause();
                if (this.loaded == false && this.video)
                    this.video.src = "";
                if (this.video && this.video.parentElement) {
                    this.video.parentElement.removeChild(this.video);
                    this.video = null;
                }
                this.loaded = false;
            };
            WebVideo.prototype.pause = function () {
                this.userPlay = false;
                if (this.waiting) {
                    this.userPause = true;
                    return;
                }
                this.userPause = false;
                this.video.pause();
                egret.stopTick(this.markDirty, this);
            };
            Object.defineProperty(WebVideo.prototype, "volume", {
                get: function () {
                    if (!this.video)
                        return 1;
                    return this.video.volume;
                },
                set: function (value) {
                    if (!this.video)
                        return;
                    this.video.volume = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(WebVideo.prototype, "position", {
                get: function () {
                    if (!this.video)
                        return 0;
                    return this.video.currentTime;
                },
                set: function (value) {
                    if (!this.video)
                        return;
                    this.video.currentTime = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(WebVideo.prototype, "fullscreen", {
                get: function () {
                    return this._fullscreen;
                },
                set: function (value) {
                    if (egret.Capabilities.isMobile) {
                        return;
                    }
                    this._fullscreen = !!value;
                    if (this.video && this.video.paused == false) {
                        this.checkFullScreen(this._fullscreen);
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(WebVideo.prototype, "bitmapData", {
                get: function () {
                    if (!this.video || !this.loaded)
                        return null;
                    if (!this._bitmapData) {
                        this.video.width = this.video.videoWidth;
                        this.video.height = this.video.videoHeight;
                        this._bitmapData = new egret.BitmapData(this.video);
                        this._bitmapData.$deleteSource = false;
                    }
                    return this._bitmapData;
                },
                enumerable: true,
                configurable: true
            });
            WebVideo.prototype.loadPoster = function () {
                var _this = this;
                var poster = this.poster;
                if (!poster)
                    return;
                var imageLoader = new egret.ImageLoader();
                imageLoader.once(egret.Event.COMPLETE, function (e) {
                    var posterData = imageLoader.data;
                    _this.posterData = imageLoader.data;
                    _this.$renderDirty = true;
                    _this.posterData.width = _this.getPlayWidth();
                    _this.posterData.height = _this.getPlayHeight();
                    if (egret.nativeRender) {
                        var texture = new egret.Texture();
                        texture._setBitmapData(_this.posterData);
                        _this.$nativeDisplayObject.setTexture(texture);
                    }
                }, this);
                imageLoader.load(poster);
            };
            WebVideo.prototype.$measureContentBounds = function (bounds) {
                var bitmapData = this.bitmapData;
                var posterData = this.posterData;
                if (bitmapData) {
                    bounds.setTo(0, 0, this.getPlayWidth(), this.getPlayHeight());
                }
                else if (posterData) {
                    bounds.setTo(0, 0, this.getPlayWidth(), this.getPlayHeight());
                }
                else {
                    bounds.setEmpty();
                }
            };
            WebVideo.prototype.getPlayWidth = function () {
                if (!isNaN(this.widthSet)) {
                    return this.widthSet;
                }
                if (this.bitmapData) {
                    return this.bitmapData.width;
                }
                if (this.posterData) {
                    return this.posterData.width;
                }
                return NaN;
            };
            WebVideo.prototype.getPlayHeight = function () {
                if (!isNaN(this.heightSet)) {
                    return this.heightSet;
                }
                if (this.bitmapData) {
                    return this.bitmapData.height;
                }
                if (this.posterData) {
                    return this.posterData.height;
                }
                return NaN;
            };
            WebVideo.prototype.$updateRenderNode = function () {
                var node = this.$renderNode;
                var bitmapData = this.bitmapData;
                var posterData = this.posterData;
                var width = this.getPlayWidth();
                var height = this.getPlayHeight();
                if ((!this.isPlayed || egret.Capabilities.isMobile) && posterData) {
                    node.image = posterData;
                    node.imageWidth = width;
                    node.imageHeight = height;
                    node.drawImage(0, 0, posterData.width, posterData.height, 0, 0, width, height);
                }
                else if (this.isPlayed && bitmapData) {
                    node.image = bitmapData;
                    node.imageWidth = bitmapData.width;
                    node.imageHeight = bitmapData.height;
                    egret.WebGLUtils.deleteWebGLTexture(bitmapData.webGLTexture);
                    bitmapData.webGLTexture = null;
                    node.drawImage(0, 0, bitmapData.width, bitmapData.height, 0, 0, width, height);
                }
            };
            WebVideo.prototype.markDirty = function () {
                this.$renderDirty = true;
                return true;
            };
            WebVideo.prototype.$setHeight = function (value) {
                this.heightSet = value;
                if (this.paused) {
                    var self_2 = this;
                    this.$renderDirty = true;
                    window.setTimeout(function () {
                        self_2.$renderDirty = false;
                    }, 200);
                }
                _super.prototype.$setHeight.call(this, value);
            };
            WebVideo.prototype.$setWidth = function (value) {
                this.widthSet = value;
                if (this.paused) {
                    var self_3 = this;
                    this.$renderDirty = true;
                    window.setTimeout(function () {
                        self_3.$renderDirty = false;
                    }, 200);
                }
                _super.prototype.$setWidth.call(this, value);
            };
            Object.defineProperty(WebVideo.prototype, "paused", {
                get: function () {
                    if (this.video) {
                        return this.video.paused;
                    }
                    return true;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(WebVideo.prototype, "length", {
                get: function () {
                    if (this.video) {
                        return this.video.duration;
                    }
                    throw new Error("Video not loaded!");
                },
                enumerable: true,
                configurable: true
            });
            return WebVideo;
        }(egret.DisplayObject));
        web.WebVideo = WebVideo;
        egret.Video = WebVideo;
    })(web = egret.web || (egret.web = {}));
})(egret || (egret = {}));
var egret;
(function (egret) {
    var HttpMethod;
    (function (HttpMethod) {
        HttpMethod.GET = "GET";
        HttpMethod.POST = "POST";
    })(HttpMethod = egret.HttpMethod || (egret.HttpMethod = {}));
})(egret || (egret = {}));
var egret;
(function (egret) {
})(egret || (egret = {}));
var egret;
(function (egret) {
    var HttpResponseType = (function () {
        function HttpResponseType() {
        }
        HttpResponseType.TEXT = "text";
        HttpResponseType.ARRAY_BUFFER = "arraybuffer";
        return HttpResponseType;
    }());
    egret.HttpResponseType = HttpResponseType;
})(egret || (egret = {}));
var egret;
(function (egret) {
})(egret || (egret = {}));
var egret;
(function (egret) {
    var web;
    (function (web) {
        var WebHttpRequest = (function (_super) {
            __extends(WebHttpRequest, _super);
            function WebHttpRequest() {
                var _this = _super.call(this) || this;
                _this.timeout = 0;
                _this._url = "";
                _this._method = "";
                return _this;
            }
            Object.defineProperty(WebHttpRequest.prototype, "response", {
                get: function () {
                    if (!this._xhr) {
                        return null;
                    }
                    if (this._xhr.response != undefined) {
                        return this._xhr.response;
                    }
                    if (this._responseType == "text") {
                        return this._xhr.responseText;
                    }
                    if (this._responseType == "arraybuffer" && /msie 9.0/i.test(navigator.userAgent)) {
                        var w = window;
                        return w.convertResponseBodyToText(this._xhr["responseBody"]);
                    }
                    if (this._responseType == "document") {
                        return this._xhr.responseXML;
                    }
                    return null;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(WebHttpRequest.prototype, "responseType", {
                get: function () {
                    return this._responseType;
                },
                set: function (value) {
                    this._responseType = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(WebHttpRequest.prototype, "withCredentials", {
                get: function () {
                    return this._withCredentials;
                },
                set: function (value) {
                    this._withCredentials = value;
                },
                enumerable: true,
                configurable: true
            });
            WebHttpRequest.prototype.getXHR = function () {
                if (window["XMLHttpRequest"]) {
                    return new window["XMLHttpRequest"]();
                }
                else {
                    return new ActiveXObject("MSXML2.XMLHTTP");
                }
            };
            WebHttpRequest.prototype.open = function (url, method) {
                if (method === void 0) { method = "GET"; }
                this._url = url;
                this._method = method;
                if (this._xhr) {
                    this._xhr.abort();
                    this._xhr = null;
                }
                var xhr = this.getXHR();
                if (window["XMLHttpRequest"]) {
                    xhr.addEventListener("load", this.onload.bind(this));
                    xhr.addEventListener("error", this.onerror.bind(this));
                }
                else {
                    xhr.onreadystatechange = this.onReadyStateChange.bind(this);
                }
                xhr.onprogress = this.updateProgress.bind(this);
                xhr.ontimeout = this.onTimeout.bind(this);
                xhr.open(this._method, this._url, true);
                this._xhr = xhr;
            };
            WebHttpRequest.prototype.send = function (data) {
                if (this._responseType != null) {
                    this._xhr.responseType = this._responseType;
                }
                if (this._withCredentials != null) {
                    this._xhr.withCredentials = this._withCredentials;
                }
                if (this.headerObj) {
                    for (var key in this.headerObj) {
                        this._xhr.setRequestHeader(key, this.headerObj[key]);
                    }
                }
                this._xhr.timeout = this.timeout;
                this._xhr.send(data);
            };
            WebHttpRequest.prototype.abort = function () {
                if (this._xhr) {
                    this._xhr.abort();
                }
            };
            WebHttpRequest.prototype.getAllResponseHeaders = function () {
                if (!this._xhr) {
                    return null;
                }
                var result = this._xhr.getAllResponseHeaders();
                return result ? result : "";
            };
            WebHttpRequest.prototype.setRequestHeader = function (header, value) {
                if (!this.headerObj) {
                    this.headerObj = {};
                }
                this.headerObj[header] = value;
            };
            WebHttpRequest.prototype.getResponseHeader = function (header) {
                if (!this._xhr) {
                    return null;
                }
                var result = this._xhr.getResponseHeader(header);
                return result ? result : "";
            };
            WebHttpRequest.prototype.onTimeout = function () {
                this.dispatchEventWith(egret.IOErrorEvent.IO_ERROR);
            };
            WebHttpRequest.prototype.onReadyStateChange = function () {
                var xhr = this._xhr;
                if (xhr.readyState == 4) {
                    var ioError_1 = (xhr.status >= 400 || xhr.status == 0);
                    var url = this._url;
                    var self_4 = this;
                    window.setTimeout(function () {
                        if (ioError_1) {
                            self_4.dispatchEventWith(egret.IOErrorEvent.IO_ERROR);
                        }
                        else {
                            self_4.dispatchEventWith(egret.Event.COMPLETE);
                        }
                    }, 0);
                }
            };
            WebHttpRequest.prototype.updateProgress = function (event) {
                if (event.lengthComputable) {
                    egret.ProgressEvent.dispatchProgressEvent(this, egret.ProgressEvent.PROGRESS, event.loaded, event.total);
                }
            };
            WebHttpRequest.prototype.onload = function () {
                var self = this;
                var xhr = this._xhr;
                var url = this._url;
                var ioError = (xhr.status >= 400);
                window.setTimeout(function () {
                    if (ioError) {
                        self.dispatchEventWith(egret.IOErrorEvent.IO_ERROR);
                    }
                    else {
                        self.dispatchEventWith(egret.Event.COMPLETE);
                    }
                }, 0);
            };
            WebHttpRequest.prototype.onerror = function () {
                var url = this._url;
                var self = this;
                window.setTimeout(function () {
                    self.dispatchEventWith(egret.IOErrorEvent.IO_ERROR);
                }, 0);
            };
            return WebHttpRequest;
        }(egret.EventDispatcher));
        web.WebHttpRequest = WebHttpRequest;
        egret.HttpRequest = WebHttpRequest;
    })(web = egret.web || (egret.web = {}));
})(egret || (egret = {}));
var egret;
(function (egret) {
    var web;
    (function (web) {
        var winURL = window["URL"] || window["webkitURL"];
        var WebImageLoader = (function (_super) {
            __extends(WebImageLoader, _super);
            function WebImageLoader() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.data = null;
                _this._crossOrigin = null;
                _this._hasCrossOriginSet = false;
                _this.currentImage = null;
                _this.request = null;
                return _this;
            }
            Object.defineProperty(WebImageLoader.prototype, "crossOrigin", {
                get: function () {
                    return this._crossOrigin;
                },
                set: function (value) {
                    this._hasCrossOriginSet = true;
                    this._crossOrigin = value;
                },
                enumerable: true,
                configurable: true
            });
            WebImageLoader.prototype.load = function (url) {
                if (web.Html5Capatibility._canUseBlob
                    && url.indexOf("wxLocalResource:") != 0
                    && url.indexOf("data:") != 0
                    && url.indexOf("http:") != 0
                    && url.indexOf("https:") != 0) {
                    var request = this.request;
                    if (!request) {
                        request = this.request = new egret.web.WebHttpRequest();
                        request.addEventListener(egret.Event.COMPLETE, this.onBlobLoaded, this);
                        request.addEventListener(egret.IOErrorEvent.IO_ERROR, this.onBlobError, this);
                        request.responseType = "blob";
                    }
                    request.open(url);
                    request.send();
                }
                else {
                    this.loadImage(url);
                }
            };
            WebImageLoader.prototype.onBlobLoaded = function (event) {
                var blob = this.request.response;
                this.request = undefined;
                this.loadImage(winURL.createObjectURL(blob));
            };
            WebImageLoader.prototype.onBlobError = function (event) {
                this.dispatchIOError(this.currentURL);
                this.request = undefined;
            };
            WebImageLoader.prototype.loadImage = function (src) {
                var image = new Image();
                this.data = null;
                this.currentImage = image;
                if (this._hasCrossOriginSet) {
                    if (this._crossOrigin) {
                        image.crossOrigin = this._crossOrigin;
                    }
                }
                else {
                    if (WebImageLoader.crossOrigin) {
                        image.crossOrigin = WebImageLoader.crossOrigin;
                    }
                }
                image.onload = this.onImageComplete.bind(this);
                image.onerror = this.onLoadError.bind(this);
                image.src = src;
            };
            WebImageLoader.prototype.onImageComplete = function (event) {
                var image = this.getImage(event);
                if (!image) {
                    return;
                }
                this.data = new egret.BitmapData(image);
                var self = this;
                window.setTimeout(function () {
                    self.dispatchEventWith(egret.Event.COMPLETE);
                }, 0);
            };
            WebImageLoader.prototype.onLoadError = function (event) {
                var image = this.getImage(event);
                if (!image) {
                    return;
                }
                this.dispatchIOError(image.src);
            };
            WebImageLoader.prototype.dispatchIOError = function (url) {
                var self = this;
                window.setTimeout(function () {
                    self.dispatchEventWith(egret.IOErrorEvent.IO_ERROR);
                }, 0);
            };
            WebImageLoader.prototype.getImage = function (event) {
                var image = event.target;
                var url = image.src;
                if (url.indexOf("blob:") == 0) {
                    try {
                        winURL.revokeObjectURL(image.src);
                    }
                    catch (e) {
                        egret.warn(1037);
                    }
                }
                image.onerror = null;
                image.onload = null;
                if (this.currentImage !== image) {
                    return null;
                }
                this.currentImage = null;
                return image;
            };
            WebImageLoader.crossOrigin = null;
            return WebImageLoader;
        }(egret.EventDispatcher));
        web.WebImageLoader = WebImageLoader;
        egret.ImageLoader = WebImageLoader;
    })(web = egret.web || (egret.web = {}));
})(egret || (egret = {}));
var egret;
(function (egret) {
    var sys;
    (function (sys) {
    })(sys = egret.sys || (egret.sys = {}));
})(egret || (egret = {}));
var egret;
(function (egret) {
    var sys;
    (function (sys) {
        var displayListPool = [];
        var blendModes = ["source-over", "lighter", "destination-out"];
        var defaultCompositeOp = "source-over";
        var DisplayList = (function (_super) {
            __extends(DisplayList, _super);
            function DisplayList(root) {
                var _this = _super.call(this) || this;
                _this.isStage = false;
                _this.$renderNode = new sys.BitmapNode();
                _this.renderBuffer = null;
                _this.offsetX = 0;
                _this.offsetY = 0;
                _this.offsetMatrix = new egret.Matrix();
                _this.$canvasScaleX = 1;
                _this.$canvasScaleY = 1;
                _this.$stageRenderToSurface = function () {
                    sys.systemRenderer.render(this.root, this.renderBuffer, this.offsetMatrix);
                };
                _this.root = root;
                _this.isStage = (root instanceof egret.Stage);
                return _this;
            }
            DisplayList.create = function (target) {
                var displayList = new egret.sys.DisplayList(target);
                try {
                    var buffer = new sys.RenderBuffer();
                    displayList.renderBuffer = buffer;
                }
                catch (e) {
                    return null;
                }
                displayList.root = target;
                return displayList;
            };
            DisplayList.prototype.$getRenderNode = function () {
                return this.$renderNode;
            };
            DisplayList.prototype.setClipRect = function (width, height) {
                width *= DisplayList.$canvasScaleX;
                height *= DisplayList.$canvasScaleY;
                this.renderBuffer.resize(width, height);
            };
            DisplayList.prototype.drawToSurface = function () {
                var drawCalls = 0;
                this.$canvasScaleX = this.offsetMatrix.a = DisplayList.$canvasScaleX;
                this.$canvasScaleY = this.offsetMatrix.d = DisplayList.$canvasScaleY;
                if (!this.isStage) {
                    this.changeSurfaceSize();
                }
                var buffer = this.renderBuffer;
                buffer.clear();
                drawCalls = sys.systemRenderer.render(this.root, buffer, this.offsetMatrix);
                if (!this.isStage) {
                    var surface = buffer.surface;
                    var renderNode = this.$renderNode;
                    renderNode.drawData.length = 0;
                    var width = surface.width;
                    var height = surface.height;
                    if (!this.bitmapData) {
                        this.bitmapData = new egret.BitmapData(surface);
                    }
                    else {
                        this.bitmapData.source = surface;
                        this.bitmapData.width = width;
                        this.bitmapData.height = height;
                    }
                    renderNode.image = this.bitmapData;
                    renderNode.imageWidth = width;
                    renderNode.imageHeight = height;
                    renderNode.drawImage(0, 0, width, height, -this.offsetX, -this.offsetY, width / this.$canvasScaleX, height / this.$canvasScaleY);
                }
                return drawCalls;
            };
            DisplayList.prototype.changeSurfaceSize = function () {
                var root = this.root;
                var oldOffsetX = this.offsetX;
                var oldOffsetY = this.offsetY;
                var bounds = this.root.$getOriginalBounds();
                var scaleX = this.$canvasScaleX;
                var scaleY = this.$canvasScaleY;
                this.offsetX = -bounds.x;
                this.offsetY = -bounds.y;
                this.offsetMatrix.setTo(this.offsetMatrix.a, 0, 0, this.offsetMatrix.d, this.offsetX, this.offsetY);
                var buffer = this.renderBuffer;
                var width = Math.max(257, bounds.width * scaleX);
                var height = Math.max(257, bounds.height * scaleY);
                if (this.offsetX == oldOffsetX &&
                    this.offsetY == oldOffsetY &&
                    buffer.surface.width == width &&
                    buffer.surface.height == height) {
                    return;
                }
                buffer.resize(width, height);
            };
            DisplayList.$setCanvasScale = function (x, y) {
                DisplayList.$canvasScaleX = x;
                DisplayList.$canvasScaleY = y;
                if (egret.nativeRender) {
                    egret_native.nrSetCanvasScaleFactor(DisplayList.$canvasScaleFactor, x, y);
                }
            };
            DisplayList.$canvasScaleFactor = 1;
            DisplayList.$canvasScaleX = 1;
            DisplayList.$canvasScaleY = 1;
            return DisplayList;
        }(egret.HashObject));
        sys.DisplayList = DisplayList;
    })(sys = egret.sys || (egret.sys = {}));
})(egret || (egret = {}));
var egret;
(function (egret) {
    var StageScaleMode = (function () {
        function StageScaleMode() {
        }
        StageScaleMode.NO_SCALE = "noScale";
        StageScaleMode.SHOW_ALL = "showAll";
        StageScaleMode.NO_BORDER = "noBorder";
        StageScaleMode.EXACT_FIT = "exactFit";
        StageScaleMode.FIXED_WIDTH = "fixedWidth";
        StageScaleMode.FIXED_HEIGHT = "fixedHeight";
        StageScaleMode.FIXED_NARROW = "fixedNarrow";
        StageScaleMode.FIXED_WIDE = "fixedWide";
        return StageScaleMode;
    }());
    egret.StageScaleMode = StageScaleMode;
})(egret || (egret = {}));
var egret;
(function (egret) {
    var sys;
    (function (sys) {
        var DefaultScreenAdapter = (function (_super) {
            __extends(DefaultScreenAdapter, _super);
            function DefaultScreenAdapter() {
                return _super.call(this) || this;
            }
            DefaultScreenAdapter.prototype.calculateStageSize = function (scaleMode, screenWidth, screenHeight, contentWidth, contentHeight) {
                var displayWidth = screenWidth;
                var displayHeight = screenHeight;
                var stageWidth = contentWidth;
                var stageHeight = contentHeight;
                var scaleX = (screenWidth / stageWidth) || 0;
                var scaleY = (screenHeight / stageHeight) || 0;
                switch (scaleMode) {
                    case egret.StageScaleMode.EXACT_FIT:
                        break;
                    case egret.StageScaleMode.FIXED_HEIGHT:
                        stageWidth = Math.round(screenWidth / scaleY);
                        break;
                    case egret.StageScaleMode.FIXED_WIDTH:
                        stageHeight = Math.round(screenHeight / scaleX);
                        break;
                    case egret.StageScaleMode.NO_BORDER:
                        if (scaleX > scaleY) {
                            displayHeight = Math.round(stageHeight * scaleX);
                        }
                        else {
                            displayWidth = Math.round(stageWidth * scaleY);
                        }
                        break;
                    case egret.StageScaleMode.SHOW_ALL:
                        if (scaleX > scaleY) {
                            displayWidth = Math.round(stageWidth * scaleY);
                        }
                        else {
                            displayHeight = Math.round(stageHeight * scaleX);
                        }
                        break;
                    case egret.StageScaleMode.FIXED_NARROW:
                        if (scaleX > scaleY) {
                            stageWidth = Math.round(screenWidth / scaleY);
                        }
                        else {
                            stageHeight = Math.round(screenHeight / scaleX);
                        }
                        break;
                    case egret.StageScaleMode.FIXED_WIDE:
                        if (scaleX > scaleY) {
                            stageHeight = Math.round(screenHeight / scaleX);
                        }
                        else {
                            stageWidth = Math.round(screenWidth / scaleY);
                        }
                        break;
                    default:
                        stageWidth = screenWidth;
                        stageHeight = screenHeight;
                        break;
                }
                if (egret.Capabilities.runtimeType != egret.RuntimeType.WXGAME) {
                    if (stageWidth % 2 != 0) {
                        stageWidth += 1;
                    }
                    if (stageHeight % 2 != 0) {
                        stageHeight += 1;
                    }
                    if (displayWidth % 2 != 0) {
                        displayWidth += 1;
                    }
                    if (displayHeight % 2 != 0) {
                        displayHeight += 1;
                    }
                }
                return {
                    stageWidth: stageWidth,
                    stageHeight: stageHeight,
                    displayWidth: displayWidth,
                    displayHeight: displayHeight
                };
            };
            return DefaultScreenAdapter;
        }(egret.HashObject));
        sys.DefaultScreenAdapter = DefaultScreenAdapter;
    })(sys = egret.sys || (egret.sys = {}));
})(egret || (egret = {}));
var egret;
(function (egret) {
})(egret || (egret = {}));
var egret;
(function (egret) {
})(egret || (egret = {}));
var egret;
(function (egret) {
    var sys;
    (function (sys) {
        var MeshNode = (function (_super) {
            __extends(MeshNode, _super);
            function MeshNode() {
                var _this = _super.call(this) || this;
                _this.image = null;
                _this.smoothing = true;
                _this.bounds = new egret.Rectangle();
                _this.blendMode = null;
                _this.alpha = NaN;
                _this.filter = null;
                _this.rotated = false;
                _this.type = 5;
                _this.vertices = [];
                _this.uvs = [];
                _this.indices = [];
                return _this;
            }
            MeshNode.prototype.drawMesh = function (sourceX, sourceY, sourceW, sourceH, drawX, drawY, drawW, drawH) {
                this.drawData.push(sourceX, sourceY, sourceW, sourceH, drawX, drawY, drawW, drawH);
                this.renderCount++;
            };
            MeshNode.prototype.cleanBeforeRender = function () {
                _super.prototype.cleanBeforeRender.call(this);
                this.image = null;
                this.matrix = null;
            };
            return MeshNode;
        }(sys.RenderNode));
        sys.MeshNode = MeshNode;
    })(sys = egret.sys || (egret.sys = {}));
})(egret || (egret = {}));
var egret;
(function (egret) {
    var sys;
    (function (sys) {
        var GroupNode = (function (_super) {
            __extends(GroupNode, _super);
            function GroupNode() {
                var _this = _super.call(this) || this;
                _this.type = 4;
                return _this;
            }
            GroupNode.prototype.addNode = function (node) {
                this.drawData.push(node);
            };
            GroupNode.prototype.cleanBeforeRender = function () {
                var data = this.drawData;
                for (var i = data.length - 1; i >= 0; i--) {
                    data[i].cleanBeforeRender();
                }
            };
            GroupNode.prototype.$getRenderCount = function () {
                var result = 0;
                var data = this.drawData;
                for (var i = data.length - 1; i >= 0; i--) {
                    result += data[i].$getRenderCount();
                }
                return result;
            };
            return GroupNode;
        }(sys.RenderNode));
        sys.GroupNode = GroupNode;
    })(sys = egret.sys || (egret.sys = {}));
})(egret || (egret = {}));
var egret;
(function (egret) {
    var sys;
    (function (sys) {
        var Path2D = (function () {
            function Path2D() {
                this.type = 0;
                this.$commands = [];
                this.$data = [];
                this.commandPosition = 0;
                this.dataPosition = 0;
                this.$lastX = 0;
                this.$lastY = 0;
            }
            Path2D.prototype.moveTo = function (x, y) {
                this.$commands[this.commandPosition++] = 1;
                var pos = this.dataPosition;
                this.$data[pos++] = x;
                this.$data[pos++] = y;
                this.dataPosition = pos;
            };
            Path2D.prototype.lineTo = function (x, y) {
                this.$commands[this.commandPosition++] = 2;
                var pos = this.dataPosition;
                this.$data[pos++] = x;
                this.$data[pos++] = y;
                this.dataPosition = pos;
            };
            Path2D.prototype.curveTo = function (controlX, controlY, anchorX, anchorY) {
                this.$commands[this.commandPosition++] = 3;
                var pos = this.dataPosition;
                this.$data[pos++] = controlX;
                this.$data[pos++] = controlY;
                this.$data[pos++] = anchorX;
                this.$data[pos++] = anchorY;
                this.dataPosition = pos;
            };
            Path2D.prototype.cubicCurveTo = function (controlX1, controlY1, controlX2, controlY2, anchorX, anchorY) {
                this.$commands[this.commandPosition++] = 4;
                var pos = this.dataPosition;
                this.$data[pos++] = controlX1;
                this.$data[pos++] = controlY1;
                this.$data[pos++] = controlX2;
                this.$data[pos++] = controlY2;
                this.$data[pos++] = anchorX;
                this.$data[pos++] = anchorY;
                this.dataPosition = pos;
            };
            Path2D.prototype.drawRect = function (x, y, width, height) {
                var x2 = x + width;
                var y2 = y + height;
                this.moveTo(x, y);
                this.lineTo(x2, y);
                this.lineTo(x2, y2);
                this.lineTo(x, y2);
                this.lineTo(x, y);
            };
            Path2D.prototype.drawRoundRect = function (x, y, width, height, ellipseWidth, ellipseHeight) {
                var radiusX = (ellipseWidth * 0.5) | 0;
                var radiusY = ellipseHeight ? (ellipseHeight * 0.5) | 0 : radiusX;
                if (!radiusX || !radiusY) {
                    this.drawRect(x, y, width, height);
                    return;
                }
                var hw = width * 0.5;
                var hh = height * 0.5;
                if (radiusX > hw) {
                    radiusX = hw;
                }
                if (radiusY > hh) {
                    radiusY = hh;
                }
                if (hw === radiusX && hh === radiusY) {
                    if (radiusX === radiusY) {
                        this.drawCircle(x + radiusX, y + radiusY, radiusX);
                    }
                    else {
                        this.drawEllipse(x, y, radiusX * 2, radiusY * 2);
                    }
                    return;
                }
                var right = x + width;
                var bottom = y + height;
                var xlw = x + radiusX;
                var xrw = right - radiusX;
                var ytw = y + radiusY;
                var ybw = bottom - radiusY;
                this.moveTo(right, ybw);
                this.curveTo(right, bottom, xrw, bottom);
                this.lineTo(xlw, bottom);
                this.curveTo(x, bottom, x, ybw);
                this.lineTo(x, ytw);
                this.curveTo(x, y, xlw, y);
                this.lineTo(xrw, y);
                this.curveTo(right, y, right, ytw);
                this.lineTo(right, ybw);
            };
            Path2D.prototype.drawCircle = function (x, y, radius) {
                this.arcToBezier(x, y, radius, radius, 0, Math.PI * 2);
            };
            Path2D.prototype.drawEllipse = function (x, y, width, height) {
                var radiusX = width * 0.5;
                var radiusY = height * 0.5;
                x += radiusX;
                y += radiusY;
                this.arcToBezier(x, y, radiusX, radiusY, 0, Math.PI * 2);
            };
            Path2D.prototype.drawArc = function (x, y, radius, startAngle, endAngle, anticlockwise) {
                if (anticlockwise) {
                    if (endAngle >= startAngle) {
                        endAngle -= Math.PI * 2;
                    }
                }
                else {
                    if (endAngle <= startAngle) {
                        endAngle += Math.PI * 2;
                    }
                }
                this.arcToBezier(x, y, radius, radius, startAngle, endAngle, anticlockwise);
            };
            Path2D.prototype.arcToBezier = function (x, y, radiusX, radiusY, startAngle, endAngle, anticlockwise) {
                var halfPI = Math.PI * 0.5;
                var start = startAngle;
                var end = start;
                if (anticlockwise) {
                    end += -halfPI - (start % halfPI);
                    if (end < endAngle) {
                        end = endAngle;
                    }
                }
                else {
                    end += halfPI - (start % halfPI);
                    if (end > endAngle) {
                        end = endAngle;
                    }
                }
                var currentX = x + Math.cos(start) * radiusX;
                var currentY = y + Math.sin(start) * radiusY;
                if (this.$lastX != currentX || this.$lastY != currentY) {
                    this.moveTo(currentX, currentY);
                }
                var u = Math.cos(start);
                var v = Math.sin(start);
                for (var i = 0; i < 4; i++) {
                    var addAngle = end - start;
                    var a = 4 * Math.tan(addAngle / 4) / 3;
                    var x1 = currentX - v * a * radiusX;
                    var y1 = currentY + u * a * radiusY;
                    u = Math.cos(end);
                    v = Math.sin(end);
                    currentX = x + u * radiusX;
                    currentY = y + v * radiusY;
                    var x2 = currentX + v * a * radiusX;
                    var y2 = currentY - u * a * radiusY;
                    this.cubicCurveTo(x1, y1, x2, y2, currentX, currentY);
                    if (end === endAngle) {
                        break;
                    }
                    start = end;
                    if (anticlockwise) {
                        end = start - halfPI;
                        if (end < endAngle) {
                            end = endAngle;
                        }
                    }
                    else {
                        end = start + halfPI;
                        if (end > endAngle) {
                            end = endAngle;
                        }
                    }
                }
            };
            return Path2D;
        }());
        sys.Path2D = Path2D;
    })(sys = egret.sys || (egret.sys = {}));
})(egret || (egret = {}));
var egret;
(function (egret) {
    var sys;
    (function (sys) {
        var StrokePath = (function (_super) {
            __extends(StrokePath, _super);
            function StrokePath() {
                var _this = _super.call(this) || this;
                _this.type = 3;
                return _this;
            }
            return StrokePath;
        }(sys.Path2D));
        sys.StrokePath = StrokePath;
    })(sys = egret.sys || (egret.sys = {}));
})(egret || (egret = {}));
var egret;
(function (egret) {
    var WebGLUtils = (function () {
        function WebGLUtils() {
        }
        WebGLUtils.compileProgram = function (gl, vertexSrc, fragmentSrc) {
            var fragmentShader = WebGLUtils.compileFragmentShader(gl, fragmentSrc);
            var vertexShader = WebGLUtils.compileVertexShader(gl, vertexSrc);
            var shaderProgram = gl.createProgram();
            gl.attachShader(shaderProgram, vertexShader);
            gl.attachShader(shaderProgram, fragmentShader);
            gl.linkProgram(shaderProgram);
            if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
                egret.warn(1020);
            }
            return shaderProgram;
        };
        WebGLUtils.compileFragmentShader = function (gl, shaderSrc) {
            return WebGLUtils._compileShader(gl, shaderSrc, gl.FRAGMENT_SHADER);
        };
        WebGLUtils.compileVertexShader = function (gl, shaderSrc) {
            return WebGLUtils._compileShader(gl, shaderSrc, gl.VERTEX_SHADER);
        };
        WebGLUtils._compileShader = function (gl, shaderSrc, shaderType) {
            var shader = gl.createShader(shaderType);
            gl.shaderSource(shader, shaderSrc);
            gl.compileShader(shader);
            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                return null;
            }
            return shader;
        };
        WebGLUtils.checkCanUseWebGL = function () {
            if (WebGLUtils.canUseWebGL == undefined) {
                try {
                    var canvas = document.createElement("canvas");
                    WebGLUtils.canUseWebGL = !!window["WebGLRenderingContext"]
                        && !!(canvas.getContext("webgl") || canvas.getContext("experimental-webgl"));
                }
                catch (e) {
                    WebGLUtils.canUseWebGL = false;
                }
            }
            return WebGLUtils.canUseWebGL;
        };
        WebGLUtils.deleteWebGLTexture = function (webglTexture) {
            if (!webglTexture) {
                return;
            }
            if (webglTexture[egret.engine_default_empty_texture]) {
                return;
            }
            var gl = webglTexture[egret.glContext];
            if (gl) {
                gl.deleteTexture(webglTexture);
            }
            else {
            }
        };
        WebGLUtils.premultiplyTint = function (tint, alpha) {
            if (alpha === 1.0) {
                return (alpha * 255 << 24) + tint;
            }
            if (alpha === 0.0) {
                return 0;
            }
            var R = ((tint >> 16) & 0xFF);
            var G = ((tint >> 8) & 0xFF);
            var B = (tint & 0xFF);
            R = ((R * alpha) + 0.5) | 0;
            G = ((G * alpha) + 0.5) | 0;
            B = ((B * alpha) + 0.5) | 0;
            return (alpha * 255 << 24) + (R << 16) + (G << 8) + B;
        };
        return WebGLUtils;
    }());
    egret.WebGLUtils = WebGLUtils;
})(egret || (egret = {}));
var egret;
(function (egret) {
    var sys;
    (function (sys) {
        var CAPS_STYLES = ["none", "round", "square"];
        var JOINT_STYLES = ["bevel", "miter", "round"];
        var GraphicsNode = (function (_super) {
            __extends(GraphicsNode, _super);
            function GraphicsNode() {
                var _this = _super.call(this) || this;
                _this.dirtyRender = true;
                _this.type = 3;
                return _this;
            }
            GraphicsNode.prototype.beginFill = function (color, alpha, beforePath) {
                if (alpha === void 0) { alpha = 1; }
                var path = new sys.FillPath();
                path.fillColor = color;
                path.fillAlpha = alpha;
                if (beforePath) {
                    var index = this.drawData.lastIndexOf(beforePath);
                    this.drawData.splice(index, 0, path);
                }
                else {
                    this.drawData.push(path);
                }
                this.renderCount++;
                return path;
            };
            GraphicsNode.prototype.beginGradientFill = function (type, colors, alphas, ratios, matrix, beforePath) {
                var m = new egret.Matrix();
                if (matrix) {
                    m.a = matrix.a * 819.2;
                    m.b = matrix.b * 819.2;
                    m.c = matrix.c * 819.2;
                    m.d = matrix.d * 819.2;
                    m.tx = matrix.tx;
                    m.ty = matrix.ty;
                }
                else {
                    m.a = 100;
                    m.d = 100;
                }
                var path = new sys.GradientFillPath();
                path.gradientType = type;
                path.colors = colors;
                path.alphas = alphas;
                path.ratios = ratios;
                path.matrix = m;
                if (beforePath) {
                    var index = this.drawData.lastIndexOf(beforePath);
                    this.drawData.splice(index, 0, path);
                }
                else {
                    this.drawData.push(path);
                }
                this.renderCount++;
                return path;
            };
            GraphicsNode.prototype.lineStyle = function (thickness, color, alpha, caps, joints, miterLimit, lineDash) {
                if (alpha === void 0) { alpha = 1; }
                if (miterLimit === void 0) { miterLimit = 3; }
                if (lineDash === void 0) { lineDash = []; }
                if (CAPS_STYLES.indexOf(caps) == -1) {
                    caps = "round";
                }
                if (JOINT_STYLES.indexOf(joints) == -1) {
                    joints = "round";
                }
                var path = new sys.StrokePath();
                path.lineWidth = thickness;
                path.lineColor = color;
                path.lineAlpha = alpha;
                path.caps = caps || egret.CapsStyle.ROUND;
                path.joints = joints;
                path.miterLimit = miterLimit;
                path.lineDash = lineDash;
                this.drawData.push(path);
                this.renderCount++;
                return path;
            };
            GraphicsNode.prototype.clear = function () {
                this.drawData.length = 0;
                this.dirtyRender = true;
                this.renderCount = 0;
            };
            GraphicsNode.prototype.cleanBeforeRender = function () {
            };
            GraphicsNode.prototype.clean = function () {
                if (this.$texture) {
                    egret.WebGLUtils.deleteWebGLTexture(this.$texture);
                    this.$texture = null;
                    this.dirtyRender = true;
                }
            };
            return GraphicsNode;
        }(sys.RenderNode));
        sys.GraphicsNode = GraphicsNode;
    })(sys = egret.sys || (egret.sys = {}));
})(egret || (egret = {}));
var egret;
(function (egret) {
    var sys;
    (function (sys) {
        var TextNode = (function (_super) {
            __extends(TextNode, _super);
            function TextNode() {
                var _this = _super.call(this) || this;
                _this.textColor = 0xFFFFFF;
                _this.strokeColor = 0x000000;
                _this.size = 30;
                _this.stroke = 0;
                _this.bold = false;
                _this.italic = false;
                _this.fontFamily = "Arial";
                _this.dirtyRender = true;
                _this.type = 2;
                return _this;
            }
            TextNode.prototype.drawText = function (x, y, text, format) {
                this.drawData.push(x, y, text, format);
                this.renderCount++;
                this.dirtyRender = true;
            };
            TextNode.prototype.clean = function () {
                if (this.$texture) {
                    egret.WebGLUtils.deleteWebGLTexture(this.$texture);
                    this.$texture = null;
                    this.dirtyRender = true;
                }
            };
            TextNode.prototype.cleanBeforeRender = function () {
                _super.prototype.cleanBeforeRender.call(this);
                this.dirtyRender = true;
            };
            return TextNode;
        }(sys.RenderNode));
        sys.TextNode = TextNode;
    })(sys = egret.sys || (egret.sys = {}));
})(egret || (egret = {}));
var egret;
(function (egret) {
    var blendModes = ["source-over", "lighter", "destination-out"];
    var defaultCompositeOp = "source-over";
    var BLACK_COLOR = "#000000";
    var CAPS_STYLES = { none: 'butt', square: 'square', round: 'round' };
    var renderBufferPool = [];
    var renderBufferPool_Filters = [];
    var CanvasRenderer = (function () {
        function CanvasRenderer() {
            this.nestLevel = 0;
            this.renderingMask = false;
        }
        CanvasRenderer.prototype.render = function (displayObject, buffer, matrix, forRenderTexture) {
            this.nestLevel++;
            var context = buffer.context;
            var root = forRenderTexture ? displayObject : null;
            context.transform(matrix.a, matrix.b, matrix.c, matrix.d, 0, 0);
            var drawCall = this.drawDisplayObject(displayObject, context, matrix.tx, matrix.ty, true);
            var invert = egret.Matrix.create();
            matrix.$invertInto(invert);
            context.transform(invert.a, invert.b, invert.c, invert.d, 0, 0);
            egret.Matrix.release(invert);
            this.nestLevel--;
            if (this.nestLevel === 0) {
                if (renderBufferPool.length > 6) {
                    renderBufferPool.length = 6;
                }
                var length_3 = renderBufferPool.length;
                for (var i = 0; i < length_3; i++) {
                    renderBufferPool[i].resize(0, 0);
                }
            }
            return drawCall;
        };
        CanvasRenderer.prototype.drawDisplayObject = function (displayObject, context, offsetX, offsetY, isStage) {
            var drawCalls = 0;
            var node;
            var displayList = displayObject.$displayList;
            if (displayList && !isStage) {
                if (displayObject.$cacheDirty || displayObject.$renderDirty ||
                    displayList.$canvasScaleX != egret.sys.DisplayList.$canvasScaleX ||
                    displayList.$canvasScaleY != egret.sys.DisplayList.$canvasScaleY) {
                    drawCalls += displayList.drawToSurface();
                }
                node = displayList.$renderNode;
            }
            else {
                if (displayObject.$renderDirty) {
                    node = displayObject.$getRenderNode();
                }
                else {
                    node = displayObject.$renderNode;
                }
            }
            displayObject.$cacheDirty = false;
            if (node) {
                drawCalls++;
                context.$offsetX = offsetX;
                context.$offsetY = offsetY;
                switch (node.type) {
                    case 1:
                        this.renderBitmap(node, context);
                        break;
                    case 2:
                        this.renderText(node, context);
                        break;
                    case 3:
                        this.renderGraphics(node, context);
                        break;
                    case 4:
                        this.renderGroup(node, context);
                        break;
                    case 5:
                        this.renderMesh(node, context);
                        break;
                    case 6:
                        this.renderNormalBitmap(node, context);
                        break;
                }
                context.$offsetX = 0;
                context.$offsetY = 0;
            }
            if (displayList && !isStage) {
                return drawCalls;
            }
            var children = displayObject.$children;
            if (children) {
                var length_4 = children.length;
                for (var i = 0; i < length_4; i++) {
                    var child = children[i];
                    var offsetX2 = void 0;
                    var offsetY2 = void 0;
                    if (child.$useTranslate) {
                        var m = child.$getMatrix();
                        offsetX2 = offsetX + child.$x;
                        offsetY2 = offsetY + child.$y;
                        context.save();
                        context.transform(m.a, m.b, m.c, m.d, offsetX2, offsetY2);
                        offsetX2 = -child.$anchorOffsetX;
                        offsetY2 = -child.$anchorOffsetY;
                    }
                    else {
                        offsetX2 = offsetX + child.$x - child.$anchorOffsetX;
                        offsetY2 = offsetY + child.$y - child.$anchorOffsetY;
                    }
                    var tempAlpha = void 0;
                    if (child.$alpha != 1) {
                        tempAlpha = context.globalAlpha;
                        context.globalAlpha *= child.$alpha;
                    }
                    switch (child.$renderMode) {
                        case 1:
                            break;
                        case 2:
                            drawCalls += this.drawWithFilter(child, context, offsetX2, offsetY2);
                            break;
                        case 3:
                            drawCalls += this.drawWithClip(child, context, offsetX2, offsetY2);
                            break;
                        case 4:
                            drawCalls += this.drawWithScrollRect(child, context, offsetX2, offsetY2);
                            break;
                        default:
                            drawCalls += this.drawDisplayObject(child, context, offsetX2, offsetY2);
                            break;
                    }
                    if (child.$useTranslate) {
                        context.restore();
                    }
                    else if (tempAlpha) {
                        context.globalAlpha = tempAlpha;
                    }
                }
            }
            return drawCalls;
        };
        CanvasRenderer.prototype.drawWithFilter = function (displayObject, context, offsetX, offsetY) {
            if (displayObject.$children && displayObject.$children.length == 0 && (!displayObject.$renderNode || displayObject.$renderNode.$getRenderCount() == 0)) {
                return 0;
            }
            var drawCalls = 0;
            var filters = displayObject.$filters;
            var filtersLen = filters.length;
            var hasBlendMode = (displayObject.$blendMode !== 0);
            var compositeOp;
            if (hasBlendMode) {
                compositeOp = blendModes[displayObject.$blendMode];
                if (!compositeOp) {
                    compositeOp = defaultCompositeOp;
                }
            }
            var displayBounds = displayObject.$getOriginalBounds();
            var displayBoundsX = displayBounds.x;
            var displayBoundsY = displayBounds.y;
            var displayBoundsWidth = displayBounds.width;
            var displayBoundsHeight = displayBounds.height;
            if (displayBoundsWidth <= 0 || displayBoundsHeight <= 0) {
                return drawCalls;
            }
            var displayBuffer = this.createRenderBuffer(displayBoundsWidth - displayBoundsX, displayBoundsHeight - displayBoundsY, true);
            var displayContext = displayBuffer.context;
            if (displayObject.$mask) {
                drawCalls += this.drawWithClip(displayObject, displayContext, -displayBoundsX, -displayBoundsY);
            }
            else if (displayObject.$scrollRect || displayObject.$maskRect) {
                drawCalls += this.drawWithScrollRect(displayObject, displayContext, -displayBoundsX, -displayBoundsY);
            }
            else {
                drawCalls += this.drawDisplayObject(displayObject, displayContext, -displayBoundsX, -displayBoundsY);
            }
            if (drawCalls > 0) {
                if (hasBlendMode) {
                    context.globalCompositeOperation = compositeOp;
                }
                drawCalls++;
                var imageData = displayContext.getImageData(0, 0, displayBuffer.surface.width, displayBuffer.surface.height);
                for (var i = 0; i < filtersLen; i++) {
                    var filter = filters[i];
                    if (filter.type == "colorTransform") {
                        colorFilter(imageData.data, displayBuffer.surface.width, displayBuffer.surface.height, filter.$matrix);
                    }
                    else if (filter.type == "blur") {
                        blurFilter(imageData.data, displayBuffer.surface.width, displayBuffer.surface.height, filter.$blurX, filter.$blurY);
                    }
                    else if (filter.type == "glow") {
                        var r = filter.$red;
                        var g = filter.$green;
                        var b = filter.$blue;
                        var a = filter.$alpha;
                        if (filter.$inner || filter.$knockout || filter.$hideObject) {
                            dropShadowFilter2(imageData.data, displayBuffer.surface.width, displayBuffer.surface.height, [r / 255, g / 255, b / 255, a], filter.$blurX, filter.$blurY, filter.$angle ? (filter.$angle / 180 * Math.PI) : 0, filter.$distance || 0, filter.$strength, filter.$inner ? 1 : 0, filter.$knockout ? 0 : 1, filter.$hideObject ? 1 : 0);
                        }
                        else {
                            dropShadowFilter(imageData.data, displayBuffer.surface.width, displayBuffer.surface.height, [r / 255, g / 255, b / 255, a], filter.$blurX, filter.$blurY, filter.$angle ? (filter.$angle / 180 * Math.PI) : 0, filter.$distance || 0, filter.$strength);
                        }
                    }
                    else if (filter.type == "custom") {
                    }
                }
                displayContext.putImageData(imageData, 0, 0);
                context.drawImage(displayBuffer.surface, offsetX + displayBoundsX, offsetY + displayBoundsY);
                if (hasBlendMode) {
                    context.globalCompositeOperation = defaultCompositeOp;
                }
            }
            renderBufferPool_Filters.push(displayBuffer);
            return drawCalls;
        };
        CanvasRenderer.prototype.drawWithClip = function (displayObject, context, offsetX, offsetY) {
            var drawCalls = 0;
            var hasBlendMode = (displayObject.$blendMode !== 0);
            var compositeOp;
            if (hasBlendMode) {
                compositeOp = blendModes[displayObject.$blendMode];
                if (!compositeOp) {
                    compositeOp = defaultCompositeOp;
                }
            }
            var scrollRect = displayObject.$scrollRect ? displayObject.$scrollRect : displayObject.$maskRect;
            var mask = displayObject.$mask;
            if (mask) {
                var maskRenderMatrix = mask.$getMatrix();
                if ((maskRenderMatrix.a == 0 && maskRenderMatrix.b == 0) || (maskRenderMatrix.c == 0 && maskRenderMatrix.d == 0)) {
                    return drawCalls;
                }
            }
            if (!mask && (!displayObject.$children || displayObject.$children.length == 0)) {
                if (scrollRect) {
                    context.save();
                    context.beginPath();
                    context.rect(scrollRect.x + offsetX, scrollRect.y + offsetY, scrollRect.width, scrollRect.height);
                    context.clip();
                }
                if (hasBlendMode) {
                    context.globalCompositeOperation = compositeOp;
                }
                drawCalls += this.drawDisplayObject(displayObject, context, offsetX, offsetY);
                if (hasBlendMode) {
                    context.globalCompositeOperation = defaultCompositeOp;
                }
                if (scrollRect) {
                    context.restore();
                }
                return drawCalls;
            }
            if (mask) {
                var maskRenderNode = mask.$getRenderNode();
                if ((!mask.$children || mask.$children.length == 0) &&
                    maskRenderNode && maskRenderNode.type == 3 &&
                    maskRenderNode.drawData.length == 1 &&
                    maskRenderNode.drawData[0].type == 1 &&
                    maskRenderNode.drawData[0].fillAlpha == 1) {
                    this.renderingMask = true;
                    context.save();
                    var maskMatrix = egret.Matrix.create();
                    maskMatrix.copyFrom(mask.$getConcatenatedMatrix());
                    mask.$getConcatenatedMatrixAt(displayObject, maskMatrix);
                    maskMatrix.prepend(1, 0, 0, 1, offsetX, offsetY);
                    context.transform(maskMatrix.a, maskMatrix.b, maskMatrix.c, maskMatrix.d, maskMatrix.tx, maskMatrix.ty);
                    var calls = this.drawDisplayObject(mask, context, 0, 0);
                    this.renderingMask = false;
                    maskMatrix.$invertInto(maskMatrix);
                    context.transform(maskMatrix.a, maskMatrix.b, maskMatrix.c, maskMatrix.d, maskMatrix.tx, maskMatrix.ty);
                    egret.Matrix.release(maskMatrix);
                    if (scrollRect) {
                        context.beginPath();
                        context.rect(scrollRect.x + offsetX, scrollRect.y + offsetY, scrollRect.width, scrollRect.height);
                        context.clip();
                    }
                    calls += this.drawDisplayObject(displayObject, context, offsetX, offsetY);
                    context.restore();
                    return calls;
                }
            }
            var displayBounds = displayObject.$getOriginalBounds();
            var displayBoundsX = displayBounds.x;
            var displayBoundsY = displayBounds.y;
            var displayBoundsWidth = displayBounds.width;
            var displayBoundsHeight = displayBounds.height;
            if (displayBoundsWidth <= 0 || displayBoundsHeight <= 0) {
                return drawCalls;
            }
            var displayBuffer = this.createRenderBuffer(displayBoundsWidth, displayBoundsHeight);
            var displayContext = displayBuffer.context;
            if (!displayContext) {
                drawCalls += this.drawDisplayObject(displayObject, context, offsetX, offsetY);
                return drawCalls;
            }
            drawCalls += this.drawDisplayObject(displayObject, displayContext, -displayBoundsX, -displayBoundsY);
            if (mask) {
                var maskRenderNode = mask.$getRenderNode();
                var maskMatrix = egret.Matrix.create();
                maskMatrix.copyFrom(mask.$getConcatenatedMatrix());
                mask.$getConcatenatedMatrixAt(displayObject, maskMatrix);
                maskMatrix.translate(-displayBoundsX, -displayBoundsY);
                if (maskRenderNode && maskRenderNode.$getRenderCount() == 1 || mask.$displayList) {
                    displayContext.globalCompositeOperation = "destination-in";
                    displayContext.save();
                    displayContext.setTransform(maskMatrix.a, maskMatrix.b, maskMatrix.c, maskMatrix.d, maskMatrix.tx, maskMatrix.ty);
                    drawCalls += this.drawDisplayObject(mask, displayContext, 0, 0);
                    displayContext.restore();
                }
                else {
                    var maskBuffer = this.createRenderBuffer(displayBoundsWidth, displayBoundsHeight);
                    var maskContext = maskBuffer.context;
                    maskContext.setTransform(maskMatrix.a, maskMatrix.b, maskMatrix.c, maskMatrix.d, maskMatrix.tx, maskMatrix.ty);
                    drawCalls += this.drawDisplayObject(mask, maskContext, 0, 0);
                    displayContext.globalCompositeOperation = "destination-in";
                    displayContext.drawImage(maskBuffer.surface, 0, 0);
                    renderBufferPool.push(maskBuffer);
                }
                egret.Matrix.release(maskMatrix);
            }
            if (drawCalls > 0) {
                drawCalls++;
                if (hasBlendMode) {
                    context.globalCompositeOperation = compositeOp;
                }
                if (scrollRect) {
                    context.save();
                    context.beginPath();
                    context.rect(scrollRect.x + offsetX, scrollRect.y + offsetY, scrollRect.width, scrollRect.height);
                    context.clip();
                }
                context.drawImage(displayBuffer.surface, offsetX + displayBoundsX, offsetY + displayBoundsY);
                if (scrollRect) {
                    context.restore();
                }
                if (hasBlendMode) {
                    context.globalCompositeOperation = defaultCompositeOp;
                }
            }
            renderBufferPool.push(displayBuffer);
            return drawCalls;
        };
        CanvasRenderer.prototype.drawWithScrollRect = function (displayObject, context, offsetX, offsetY) {
            var drawCalls = 0;
            var scrollRect = displayObject.$scrollRect ? displayObject.$scrollRect : displayObject.$maskRect;
            if (scrollRect.isEmpty()) {
                return drawCalls;
            }
            if (displayObject.$scrollRect) {
                offsetX -= scrollRect.x;
                offsetY -= scrollRect.y;
            }
            context.save();
            context.beginPath();
            context.rect(scrollRect.x + offsetX, scrollRect.y + offsetY, scrollRect.width, scrollRect.height);
            context.clip();
            drawCalls += this.drawDisplayObject(displayObject, context, offsetX, offsetY);
            context.restore();
            return drawCalls;
        };
        CanvasRenderer.prototype.drawNodeToBuffer = function (node, buffer, matrix, forHitTest) {
            var context = buffer.context;
            context.setTransform(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
            this.renderNode(node, context, forHitTest);
        };
        CanvasRenderer.prototype.drawDisplayToBuffer = function (displayObject, buffer, matrix) {
            var context = buffer.context;
            if (matrix) {
                context.setTransform(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
            }
            var node;
            if (displayObject.$renderDirty) {
                node = displayObject.$getRenderNode();
            }
            else {
                node = displayObject.$renderNode;
            }
            var drawCalls = 0;
            if (node) {
                drawCalls++;
                switch (node.type) {
                    case 1:
                        this.renderBitmap(node, context);
                        break;
                    case 2:
                        this.renderText(node, context);
                        break;
                    case 3:
                        this.renderGraphics(node, context);
                        break;
                    case 4:
                        this.renderGroup(node, context);
                        break;
                    case 5:
                        this.renderMesh(node, context);
                        break;
                    case 6:
                        this.renderNormalBitmap(node, context);
                        break;
                }
            }
            var children = displayObject.$children;
            if (children) {
                var length_5 = children.length;
                for (var i = 0; i < length_5; i++) {
                    var child = children[i];
                    switch (child.$renderMode) {
                        case 1:
                            break;
                        case 2:
                            drawCalls += this.drawWithFilter(child, context, 0, 0);
                            break;
                        case 3:
                            drawCalls += this.drawWithClip(child, context, 0, 0);
                            break;
                        case 4:
                            drawCalls += this.drawWithScrollRect(child, context, 0, 0);
                            break;
                        default:
                            drawCalls += this.drawDisplayObject(child, context, 0, 0);
                            break;
                    }
                }
            }
            return drawCalls;
        };
        CanvasRenderer.prototype.renderNode = function (node, context, forHitTest) {
            var drawCalls = 0;
            switch (node.type) {
                case 1:
                    drawCalls = this.renderBitmap(node, context);
                    break;
                case 2:
                    drawCalls = 1;
                    this.renderText(node, context);
                    break;
                case 3:
                    drawCalls = this.renderGraphics(node, context, forHitTest);
                    break;
                case 4:
                    drawCalls = this.renderGroup(node, context);
                    break;
                case 5:
                    drawCalls = this.renderMesh(node, context);
                    break;
                case 6:
                    drawCalls += this.renderNormalBitmap(node, context);
                    break;
            }
            return drawCalls;
        };
        CanvasRenderer.prototype.renderNormalBitmap = function (node, context) {
            var image = node.image;
            if (!image || !image.source) {
                return 0;
            }
            if (context.$imageSmoothingEnabled != node.smoothing) {
                context.imageSmoothingEnabled = node.smoothing;
                context.$imageSmoothingEnabled = node.smoothing;
            }
            if (node.rotated) {
                var sourceX = node.sourceX;
                var sourceY = node.sourceY;
                var sourceHeight = node.sourceW;
                var sourceWidth = node.sourceH;
                var offsetX = node.drawX;
                var offsetY = node.drawY;
                var destHeight = node.drawW;
                var destWidth = node.drawH;
                context.save();
                context.transform(0, -1, 1, 0, 0, destWidth);
                context.drawImage(image.source, sourceX, sourceY, sourceWidth, sourceHeight, offsetX + context.$offsetX, offsetY + context.$offsetY, destWidth, destHeight);
                context.restore();
            }
            else {
                context.drawImage(image.source, node.sourceX, node.sourceY, node.sourceW, node.sourceH, node.drawX + context.$offsetX, node.drawY + context.$offsetY, node.drawW, node.drawH);
            }
            return 1;
        };
        CanvasRenderer.prototype.renderBitmap = function (node, context) {
            var image = node.image;
            if (!image || !image.source) {
                return 0;
            }
            if (context.$imageSmoothingEnabled != node.smoothing) {
                context.imageSmoothingEnabled = node.smoothing;
                context.$imageSmoothingEnabled = node.smoothing;
            }
            var data = node.drawData;
            var length = data.length;
            var pos = 0;
            var m = node.matrix;
            var blendMode = node.blendMode;
            var alpha = node.alpha;
            var saved = false;
            var offsetX;
            var offsetY;
            if (m) {
                context.save();
                saved = true;
                if (context.$offsetX != 0 || context.$offsetY != 0) {
                    context.translate(context.$offsetX, context.$offsetY);
                    offsetX = context.$offsetX;
                    offsetY = context.$offsetY;
                    context.$offsetX = context.$offsetY = 0;
                }
                context.transform(m.a, m.b, m.c, m.d, m.tx, m.ty);
            }
            if (blendMode) {
                context.globalCompositeOperation = blendModes[blendMode];
            }
            var originAlpha;
            if (alpha == alpha) {
                originAlpha = context.globalAlpha;
                context.globalAlpha *= alpha;
            }
            var drawCalls = 0;
            var filter = node.filter;
            if (filter && length == 8) {
                var sourceX = data[0];
                var sourceY = data[1];
                var sourceWidth = data[2];
                var sourceHeight = data[3];
                var offsetX_1 = data[4];
                var offsetY_1 = data[5];
                var destWidth = data[6];
                var destHeight = data[7];
                if (node.rotated) {
                    sourceWidth = data[3];
                    sourceHeight = data[2];
                    destWidth = data[7];
                    destHeight = data[6];
                }
                var displayBuffer = this.createRenderBuffer(destWidth, destHeight);
                var displayContext = displayBuffer.context;
                drawCalls++;
                if (node.rotated) {
                    context.transform(0, -1, 1, 0, 0, destWidth);
                }
                displayContext.drawImage(image.source, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, destWidth, destHeight);
                drawCalls++;
                var imageData = displayContext.getImageData(0, 0, destWidth, destHeight);
                colorFilter(imageData.data, destWidth, destHeight, filter.$matrix);
                displayContext.putImageData(imageData, 0, 0);
                context.drawImage(displayBuffer.surface, 0, 0, destWidth, destHeight, offsetX_1 + context.$offsetX, offsetY_1 + context.$offsetY, destWidth, destHeight);
                renderBufferPool.push(displayBuffer);
            }
            else {
                while (pos < length) {
                    drawCalls++;
                    if (node.rotated) {
                        var sourceX = data[pos++];
                        var sourceY = data[pos++];
                        var sourceHeight = data[pos++];
                        var sourceWidth = data[pos++];
                        var offsetX_2 = data[pos++];
                        var offsetY_2 = data[pos++];
                        var destHeight = data[pos++];
                        var destWidth = data[pos++];
                        context.save();
                        context.transform(0, -1, 1, 0, 0, destWidth);
                        context.drawImage(image.source, sourceX, sourceY, sourceWidth, sourceHeight, offsetX_2 + context.$offsetX, offsetY_2 + context.$offsetY, destWidth, destHeight);
                        context.restore();
                    }
                    else {
                        context.drawImage(image.source, data[pos++], data[pos++], data[pos++], data[pos++], data[pos++] + context.$offsetX, data[pos++] + context.$offsetY, data[pos++], data[pos++]);
                    }
                }
            }
            if (saved) {
                context.restore();
            }
            else {
                if (blendMode) {
                    context.globalCompositeOperation = defaultCompositeOp;
                }
                if (alpha == alpha) {
                    context.globalAlpha = originAlpha;
                }
            }
            if (offsetX) {
                context.$offsetX = offsetX;
            }
            if (offsetY) {
                context.$offsetY = offsetY;
            }
            return drawCalls;
        };
        CanvasRenderer.prototype.renderMesh = function (node, context) {
            var image = node.image;
            var data = node.drawData;
            var dataLength = data.length;
            var pos = 0;
            var m = node.matrix;
            var blendMode = node.blendMode;
            var alpha = node.alpha;
            var savedMatrix;
            var offsetX;
            var offsetY;
            var saved = false;
            var drawCalls = 0;
            if (context.$imageSmoothingEnabled != node.smoothing) {
                context.imageSmoothingEnabled = node.smoothing;
                context.$imageSmoothingEnabled = node.smoothing;
            }
            if (m) {
                context.save();
                saved = true;
                if (context.$offsetX != 0 || context.$offsetY != 0) {
                    context.translate(context.$offsetX, context.$offsetY);
                    offsetX = context.$offsetX;
                    offsetY = context.$offsetY;
                    context.$offsetX = context.$offsetY = 0;
                }
                context.transform(m.a, m.b, m.c, m.d, m.tx, m.ty);
            }
            if (blendMode) {
                context.globalCompositeOperation = blendModes[blendMode];
            }
            var originAlpha;
            if (alpha == alpha) {
                originAlpha = context.globalAlpha;
                context.globalAlpha *= alpha;
            }
            while (pos < dataLength) {
                drawCalls += this.drawMesh(image, data[pos++], data[pos++], data[pos++], data[pos++], data[pos++], data[pos++], data[pos++], data[pos++], node.uvs, node.vertices, node.indices, node.bounds, node.rotated, context);
            }
            if (blendMode) {
                context.globalCompositeOperation = defaultCompositeOp;
            }
            if (alpha == alpha) {
                context.globalAlpha = originAlpha;
            }
            if (offsetX) {
                context.$offsetX = offsetX;
            }
            if (offsetY) {
                context.$offsetY = offsetY;
            }
            if (saved) {
                context.restore();
            }
            return drawCalls;
        };
        CanvasRenderer.prototype.drawMesh = function (image, sourceX, sourceY, sourceWidth, sourceHeight, offsetX, offsetY, destWidth, destHeight, meshUVs, meshVertices, meshIndices, bounds, rotated, context) {
            if (!context || !image) {
                return;
            }
            var drawCalls = 0;
            var u0 = NaN, u1 = NaN, u2 = NaN, v0 = NaN, v1 = NaN, v2 = NaN;
            var a = 1, b = 0, c = 0, d = 1, tx = 0, ty = 0;
            var _sourceWidth = sourceWidth;
            var _sourceHeight = sourceHeight;
            var _destWidth = destWidth;
            var _destHeight = destHeight;
            if (rotated) {
                _sourceWidth = sourceHeight;
                _sourceHeight = sourceWidth;
                _destWidth = destHeight;
                _destHeight = destWidth;
            }
            var indicesLen = meshIndices.length;
            var index1, index2, index3;
            var x0, y0, x1, y1, x2, y2;
            for (var i = 0; i < indicesLen; i += 3) {
                index1 = meshIndices[i] * 2, index2 = meshIndices[i + 1] * 2, index3 = meshIndices[i + 2] * 2;
                u0 = meshUVs[index1] * sourceWidth;
                v0 = meshUVs[index1 + 1] * sourceHeight;
                u1 = meshUVs[index2] * sourceWidth;
                v1 = meshUVs[index2 + 1] * sourceHeight;
                u2 = meshUVs[index3] * sourceWidth;
                v2 = meshUVs[index3 + 1] * sourceHeight;
                x0 = meshVertices[index1];
                y0 = meshVertices[index1 + 1];
                x1 = meshVertices[index2];
                y1 = meshVertices[index2 + 1];
                x2 = meshVertices[index3];
                y2 = meshVertices[index3 + 1];
                context.save();
                context.beginPath();
                context.moveTo(x0, y0);
                context.lineTo(x1, y1);
                context.lineTo(x2, y2);
                context.closePath();
                context.clip();
                var ratio = 1 / ((u0 * v1) + (v0 * u2) + (u1 * v2) - (v1 * u2) - (v0 * u1) - (u0 * v2));
                a = (x0 * v1) + (v0 * x2) + (x1 * v2) - (v1 * x2) - (v0 * x1) - (x0 * v2);
                b = (y0 * v1) + (v0 * y2) + (y1 * v2) - (v1 * y2) - (v0 * y1) - (y0 * v2);
                c = (u0 * x1) + (x0 * u2) + (u1 * x2) - (x1 * u2) - (x0 * u1) - (u0 * x2);
                d = (u0 * y1) + (y0 * u2) + (u1 * y2) - (y1 * u2) - (y0 * u1) - (u0 * y2);
                tx = (u0 * v1 * x2) + (v0 * x1 * u2) + (x0 * u1 * v2) - (x0 * v1 * u2) - (v0 * u1 * x2) - (u0 * x1 * v2);
                ty = (u0 * v1 * y2) + (v0 * y1 * u2) + (y0 * u1 * v2) - (y0 * v1 * u2) - (v0 * u1 * y2) - (u0 * y1 * v2);
                context.transform(a * ratio, b * ratio, c * ratio, d * ratio, tx * ratio, ty * ratio);
                if (rotated) {
                    context.transform(0, -1, 1, 0, 0, _destWidth);
                }
                context.drawImage(image.source, sourceX, sourceY, _sourceWidth, _sourceHeight, offsetX + context.$offsetX, offsetY + context.$offsetY, _destWidth, _destHeight);
                context.restore();
                drawCalls++;
            }
            return drawCalls;
        };
        CanvasRenderer.prototype.renderText = function (node, context) {
            context.textAlign = "left";
            context.textBaseline = "middle";
            context.lineJoin = "round";
            var drawData = node.drawData;
            var length = drawData.length;
            var pos = 0;
            while (pos < length) {
                var x = drawData[pos++];
                var y = drawData[pos++];
                var text = drawData[pos++];
                var format = drawData[pos++];
                context.font = getFontString(node, format);
                var textColor = format.textColor == null ? node.textColor : format.textColor;
                var strokeColor = format.strokeColor == null ? node.strokeColor : format.strokeColor;
                var stroke = format.stroke == null ? node.stroke : format.stroke;
                context.fillStyle = egret.toColorString(textColor);
                context.strokeStyle = egret.toColorString(strokeColor);
                if (stroke) {
                    context.lineWidth = stroke * 2;
                    context.strokeText(text, x + context.$offsetX, y + context.$offsetY);
                }
                context.fillText(text, x + context.$offsetX, y + context.$offsetY);
            }
        };
        CanvasRenderer.prototype.renderGraphics = function (node, context, forHitTest) {
            var drawData = node.drawData;
            var length = drawData.length;
            forHitTest = !!forHitTest;
            for (var i = 0; i < length; i++) {
                var path = drawData[i];
                switch (path.type) {
                    case 1:
                        var fillPath = path;
                        context.fillStyle = forHitTest ? BLACK_COLOR : getRGBAString(fillPath.fillColor, fillPath.fillAlpha);
                        this.renderPath(path, context);
                        if (this.renderingMask) {
                            context.clip();
                        }
                        else {
                            context.fill();
                        }
                        break;
                    case 2:
                        var g = path;
                        context.fillStyle = forHitTest ? BLACK_COLOR : getGradient(context, g.gradientType, g.colors, g.alphas, g.ratios, g.matrix);
                        context.save();
                        var m = g.matrix;
                        this.renderPath(path, context);
                        context.transform(m.a, m.b, m.c, m.d, m.tx, m.ty);
                        context.fill();
                        context.restore();
                        break;
                    case 3:
                        var strokeFill = path;
                        var lineWidth = strokeFill.lineWidth;
                        context.lineWidth = lineWidth;
                        context.strokeStyle = forHitTest ? BLACK_COLOR : getRGBAString(strokeFill.lineColor, strokeFill.lineAlpha);
                        context.lineCap = CAPS_STYLES[strokeFill.caps];
                        context.lineJoin = strokeFill.joints;
                        context.miterLimit = strokeFill.miterLimit;
                        if (context.setLineDash) {
                            context.setLineDash(strokeFill.lineDash);
                        }
                        var isSpecialCaseWidth = lineWidth === 1 || lineWidth === 3;
                        if (isSpecialCaseWidth) {
                            context.translate(0.5, 0.5);
                        }
                        this.renderPath(path, context);
                        context.stroke();
                        if (isSpecialCaseWidth) {
                            context.translate(-0.5, -0.5);
                        }
                        break;
                }
            }
            return length == 0 ? 0 : 1;
        };
        CanvasRenderer.prototype.renderPath = function (path, context) {
            context.beginPath();
            var data = path.$data;
            var commands = path.$commands;
            var commandCount = commands.length;
            var pos = 0;
            for (var commandIndex = 0; commandIndex < commandCount; commandIndex++) {
                var command = commands[commandIndex];
                switch (command) {
                    case 4:
                        context.bezierCurveTo(data[pos++] + context.$offsetX, data[pos++] + context.$offsetY, data[pos++] + context.$offsetX, data[pos++] + context.$offsetY, data[pos++] + context.$offsetX, data[pos++] + context.$offsetY);
                        break;
                    case 3:
                        context.quadraticCurveTo(data[pos++] + context.$offsetX, data[pos++] + context.$offsetY, data[pos++] + context.$offsetX, data[pos++] + context.$offsetY);
                        break;
                    case 2:
                        context.lineTo(data[pos++] + context.$offsetX, data[pos++] + context.$offsetY);
                        break;
                    case 1:
                        context.moveTo(data[pos++] + context.$offsetX, data[pos++] + context.$offsetY);
                        break;
                }
            }
        };
        CanvasRenderer.prototype.renderGroup = function (groupNode, context) {
            var m = groupNode.matrix;
            var saved = false;
            var offsetX;
            var offsetY;
            if (m) {
                context.save();
                saved = true;
                if (context.$offsetX != 0 || context.$offsetY != 0) {
                    context.translate(context.$offsetX, context.$offsetY);
                    offsetX = context.$offsetX;
                    offsetY = context.$offsetY;
                    context.$offsetX = context.$offsetY = 0;
                }
                context.transform(m.a, m.b, m.c, m.d, m.tx, m.ty);
            }
            var drawCalls = 0;
            var children = groupNode.drawData;
            var length = children.length;
            for (var i = 0; i < length; i++) {
                var node = children[i];
                drawCalls += this.renderNode(node, context);
            }
            if (saved) {
                context.restore();
            }
            if (offsetX) {
                context.$offsetX = offsetX;
            }
            if (offsetY) {
                context.$offsetY = offsetY;
            }
            return drawCalls;
        };
        CanvasRenderer.prototype.createRenderBuffer = function (width, height, useForFilters) {
            var buffer = useForFilters ? renderBufferPool_Filters.pop() : renderBufferPool.pop();
            if (buffer) {
                buffer.resize(width, height, true);
            }
            else {
                buffer = new egret.sys.CanvasRenderBuffer(width, height);
            }
            return buffer;
        };
        return CanvasRenderer;
    }());
    egret.CanvasRenderer = CanvasRenderer;
    function getFontString(node, format) {
        var italic = format.italic == null ? node.italic : format.italic;
        var bold = format.bold == null ? node.bold : format.bold;
        var size = format.size == null ? node.size : format.size;
        var fontFamily = format.fontFamily || node.fontFamily;
        var font = italic ? "italic " : "normal ";
        font += bold ? "bold " : "normal ";
        font += size + "px " + fontFamily;
        return font;
    }
    egret.getFontString = getFontString;
    function getRGBAString(color, alpha) {
        var red = color >> 16;
        var green = (color >> 8) & 0xFF;
        var blue = color & 0xFF;
        return "rgba(" + red + "," + green + "," + blue + "," + alpha + ")";
    }
    egret.getRGBAString = getRGBAString;
    function getGradient(context, type, colors, alphas, ratios, matrix) {
        var gradient;
        if (type == egret.GradientType.LINEAR) {
            gradient = context.createLinearGradient(-1, 0, 1, 0);
        }
        else {
            gradient = context.createRadialGradient(0, 0, 0, 0, 0, 1);
        }
        var l = colors.length;
        for (var i = 0; i < l; i++) {
            gradient.addColorStop(ratios[i] / 255, getRGBAString(colors[i], alphas[i]));
        }
        return gradient;
    }
    var use8Clamp = false;
    try {
        use8Clamp = (typeof Uint8ClampedArray !== undefined);
    }
    catch (e) { }
    function setArray(a, b, index) {
        if (index === void 0) { index = 0; }
        for (var i = 0, l = b.length; i < l; i++) {
            a[i + index] = b[i];
        }
    }
    function colorFilter(buffer, w, h, matrix) {
        var r0 = matrix[0], r1 = matrix[1], r2 = matrix[2], r3 = matrix[3], r4 = matrix[4];
        var g0 = matrix[5], g1 = matrix[6], g2 = matrix[7], g3 = matrix[8], g4 = matrix[9];
        var b0 = matrix[10], b1 = matrix[11], b2 = matrix[12], b3 = matrix[13], b4 = matrix[14];
        var a0 = matrix[15], a1 = matrix[16], a2 = matrix[17], a3 = matrix[18], a4 = matrix[19];
        for (var p = 0, e = w * h * 4; p < e; p += 4) {
            var r = buffer[p + 0];
            var g = buffer[p + 1];
            var b = buffer[p + 2];
            var a = buffer[p + 3];
            buffer[p + 0] = r0 * r + r1 * g + r2 * b + r3 * a + r4;
            buffer[p + 1] = g0 * r + g1 * g + g2 * b + g3 * a + g4;
            buffer[p + 2] = b0 * r + b1 * g + b2 * b + b3 * a + b4;
            buffer[p + 3] = a0 * r + a1 * g + a2 * b + a3 * a + a4;
        }
    }
    function blurFilter(buffer, w, h, blurX, blurY) {
        blurFilterH(buffer, w, h, blurX);
        blurFilterV(buffer, w, h, blurY);
    }
    function blurFilterH(buffer, w, h, blurX) {
        var lineBuffer;
        if (use8Clamp) {
            lineBuffer = new Uint8ClampedArray(w * 4);
        }
        else {
            lineBuffer = new Array(w * 4);
        }
        var lineSize = w * 4;
        var windowLength = (blurX * 2) + 1;
        var windowSize = windowLength * 4;
        for (var y = 0; y < h; y++) {
            var pLineStart = y * lineSize;
            var rs = 0, gs = 0, bs = 0, _as = 0, alpha = 0, alpha2 = 0;
            for (var ptr = -blurX * 4, end = blurX * 4 + 4; ptr < end; ptr += 4) {
                var key = pLineStart + ptr;
                if (key < pLineStart || key >= pLineStart + lineSize) {
                    continue;
                }
                alpha = buffer[key + 3];
                rs += buffer[key + 0] * alpha;
                gs += buffer[key + 1] * alpha;
                bs += buffer[key + 2] * alpha;
                _as += alpha;
            }
            for (var ptr = pLineStart, end = pLineStart + lineSize, linePtr = 0, lastPtr = ptr - blurX * 4, nextPtr = ptr + (blurX + 1) * 4; ptr < end; ptr += 4, linePtr += 4, nextPtr += 4, lastPtr += 4) {
                if (_as === 0) {
                    lineBuffer[linePtr + 0] = 0;
                    lineBuffer[linePtr + 1] = 0;
                    lineBuffer[linePtr + 2] = 0;
                    lineBuffer[linePtr + 3] = 0;
                }
                else {
                    lineBuffer[linePtr + 0] = rs / _as;
                    lineBuffer[linePtr + 1] = gs / _as;
                    lineBuffer[linePtr + 2] = bs / _as;
                    lineBuffer[linePtr + 3] = _as / windowLength;
                }
                alpha = buffer[nextPtr + 3];
                alpha2 = buffer[lastPtr + 3];
                if (alpha || alpha == 0) {
                    if (alpha2 || alpha2 == 0) {
                        rs += buffer[nextPtr + 0] * alpha - buffer[lastPtr + 0] * alpha2;
                        gs += buffer[nextPtr + 1] * alpha - buffer[lastPtr + 1] * alpha2;
                        bs += buffer[nextPtr + 2] * alpha - buffer[lastPtr + 2] * alpha2;
                        _as += alpha - alpha2;
                    }
                    else {
                        rs += buffer[nextPtr + 0] * alpha;
                        gs += buffer[nextPtr + 1] * alpha;
                        bs += buffer[nextPtr + 2] * alpha;
                        _as += alpha;
                    }
                }
                else {
                    if (alpha2 || alpha2 == 0) {
                        rs += -buffer[lastPtr + 0] * alpha2;
                        gs += -buffer[lastPtr + 1] * alpha2;
                        bs += -buffer[lastPtr + 2] * alpha2;
                        _as += -alpha2;
                    }
                    else {
                    }
                }
            }
            if (use8Clamp) {
                buffer.set(lineBuffer, pLineStart);
            }
            else {
                setArray(buffer, lineBuffer, pLineStart);
            }
        }
    }
    function blurFilterV(buffer, w, h, blurY) {
        var columnBuffer;
        if (use8Clamp) {
            columnBuffer = new Uint8ClampedArray(h * 4);
        }
        else {
            columnBuffer = new Array(h * 4);
        }
        var stride = w * 4;
        var windowLength = (blurY * 2) + 1;
        for (var x = 0; x < w; x++) {
            var pColumnStart = x * 4;
            var rs = 0, gs = 0, bs = 0, _as = 0, alpha = 0, alpha2 = 0;
            for (var ptr = -blurY * stride, end = blurY * stride + stride; ptr < end; ptr += stride) {
                var key = pColumnStart + ptr;
                if (key < pColumnStart || key >= pColumnStart + h * stride) {
                    continue;
                }
                alpha = buffer[key + 3];
                rs += buffer[key + 0] * alpha;
                gs += buffer[key + 1] * alpha;
                bs += buffer[key + 2] * alpha;
                _as += alpha;
            }
            for (var ptr = pColumnStart, end = pColumnStart + h * stride, columnPtr = 0, lastPtr = pColumnStart - blurY * stride, nextPtr = pColumnStart + ((blurY + 1) * stride); ptr < end; ptr += stride, columnPtr += 4, nextPtr += stride, lastPtr += stride) {
                if (_as === 0) {
                    columnBuffer[columnPtr + 0] = 0;
                    columnBuffer[columnPtr + 1] = 0;
                    columnBuffer[columnPtr + 2] = 0;
                    columnBuffer[columnPtr + 3] = 0;
                }
                else {
                    columnBuffer[columnPtr + 0] = rs / _as;
                    columnBuffer[columnPtr + 1] = gs / _as;
                    columnBuffer[columnPtr + 2] = bs / _as;
                    columnBuffer[columnPtr + 3] = _as / windowLength;
                }
                alpha = buffer[nextPtr + 3];
                alpha2 = buffer[lastPtr + 3];
                if (alpha || alpha == 0) {
                    if (alpha2 || alpha2 == 0) {
                        rs += buffer[nextPtr + 0] * alpha - buffer[lastPtr + 0] * alpha2;
                        gs += buffer[nextPtr + 1] * alpha - buffer[lastPtr + 1] * alpha2;
                        bs += buffer[nextPtr + 2] * alpha - buffer[lastPtr + 2] * alpha2;
                        _as += alpha - alpha2;
                    }
                    else {
                        rs += buffer[nextPtr + 0] * alpha;
                        gs += buffer[nextPtr + 1] * alpha;
                        bs += buffer[nextPtr + 2] * alpha;
                        _as += alpha;
                    }
                }
                else {
                    if (alpha2 || alpha2 == 0) {
                        rs += -buffer[lastPtr + 0] * alpha2;
                        gs += -buffer[lastPtr + 1] * alpha2;
                        bs += -buffer[lastPtr + 2] * alpha2;
                        _as += -alpha2;
                    }
                    else {
                    }
                }
            }
            for (var i = x * 4, end = i + h * stride, j = 0; i < end; i += stride, j += 4) {
                buffer[i + 0] = columnBuffer[j + 0];
                buffer[i + 1] = columnBuffer[j + 1];
                buffer[i + 2] = columnBuffer[j + 2];
                buffer[i + 3] = columnBuffer[j + 3];
            }
        }
    }
    function dropShadowFilter(buffer, w, h, color, blurX, blurY, angle, distance, strength) {
        var tmp = alphaFilter(buffer, color);
        panFilter(tmp, w, h, angle, distance);
        blurFilter(tmp, w, h, blurX, blurY);
        scaleAlphaChannel(tmp, strength);
        compositeSourceOver(tmp, buffer);
        buffer.set(tmp);
        if (use8Clamp) {
            buffer.set(tmp);
        }
        else {
            setArray(buffer, tmp);
        }
    }
    function alphaFilter(buffer, color) {
        if (!color) {
            color = [0, 0, 0, 0];
        }
        var plane;
        if (use8Clamp) {
            plane = new Uint8ClampedArray(buffer);
        }
        else {
            plane = new Array(buffer.length);
            setArray(plane, buffer);
        }
        var colorR = color[0];
        var colorG = color[1];
        var colorB = color[2];
        var colorA = color[3];
        for (var ptr = 0, end = plane.length; ptr < end; ptr += 4) {
            var alpha = plane[ptr + 3];
            plane[ptr + 0] = colorR * alpha;
            plane[ptr + 1] = colorG * alpha;
            plane[ptr + 2] = colorB * alpha;
            plane[ptr + 3] = colorA * alpha;
        }
        return plane;
    }
    function panFilter(buffer, w, h, angle, distance) {
        var dy = (Math.sin(angle) * distance) | 0;
        var dx = (Math.cos(angle) * distance) | 0;
        var oldBuffer, newBuffer;
        if (use8Clamp) {
            oldBuffer = new Int32Array(buffer.buffer);
            newBuffer = new Int32Array(oldBuffer.length);
            for (var oy = 0; oy < h; oy++) {
                var ny = oy + dy;
                if (ny < 0 || ny > h) {
                    continue;
                }
                for (var ox = 0; ox < w; ox++) {
                    var nx = ox + dx;
                    if (nx < 0 || nx > w) {
                        continue;
                    }
                    newBuffer[ny * w + nx] = oldBuffer[oy * w + ox];
                }
            }
            oldBuffer.set(newBuffer);
        }
        else {
            oldBuffer = buffer;
            newBuffer = new Array(oldBuffer.length);
            for (var oy = 0; oy < h; oy++) {
                var ny = oy + dy;
                if (ny < 0 || ny > h) {
                    continue;
                }
                for (var ox = 0; ox < w; ox++) {
                    var nx = ox + dx;
                    if (nx < 0 || nx > w) {
                        continue;
                    }
                    newBuffer[(ny * w + nx) * 4 + 0] = oldBuffer[(oy * w + ox) * 4 + 0];
                    newBuffer[(ny * w + nx) * 4 + 1] = oldBuffer[(oy * w + ox) * 4 + 1];
                    newBuffer[(ny * w + nx) * 4 + 2] = oldBuffer[(oy * w + ox) * 4 + 2];
                    newBuffer[(ny * w + nx) * 4 + 3] = oldBuffer[(oy * w + ox) * 4 + 3];
                }
            }
            setArray(oldBuffer, newBuffer);
        }
    }
    function scaleAlphaChannel(buffer, value) {
        for (var ptr = 0, end = buffer.length; ptr < end; ptr += 4) {
            buffer[ptr + 3] *= value;
        }
    }
    function compositeSourceOver(dst, src) {
        for (var ptr = 0, end = dst.length; ptr < end; ptr += 4) {
            var Dr = dst[ptr + 0];
            var Dg = dst[ptr + 1];
            var Db = dst[ptr + 2];
            var Da = dst[ptr + 3] / 255;
            var Sr = src[ptr + 0];
            var Sg = src[ptr + 1];
            var Sb = src[ptr + 2];
            var Sa = src[ptr + 3] / 255;
            dst[ptr + 0] = Sr + Dr * (1 - Sa);
            dst[ptr + 1] = Sg + Dg * (1 - Sa);
            dst[ptr + 2] = Sb + Db * (1 - Sa);
            dst[ptr + 3] = (Sa + Da * (1 - Sa)) * 255;
        }
    }
    function getPixelKey(w, x, y) {
        return y * w * 4 + x * 4;
    }
    function mix(v1, v2, rate) {
        return v1 * (1 - rate) + v2 * rate;
    }
    function dropShadowFilter2(buffer, w, h, color, blurX, blurY, angle, distance, strength, inner, knockout, hideObject) {
        var plane;
        if (use8Clamp) {
            plane = new Uint8ClampedArray(buffer.length);
        }
        else {
            plane = new Array(buffer.length);
        }
        var alpha = color[3];
        var curDistanceX = 0;
        var curDistanceY = 0;
        var offsetX = distance * Math.cos(angle);
        var offsetY = distance * Math.sin(angle);
        var linearSamplingTimes = 7.0;
        var circleSamplingTimes = 12.0;
        var PI = 3.14159265358979323846264;
        var cosAngle;
        var sinAngle;
        var stepX = blurX / linearSamplingTimes;
        var stepY = blurY / linearSamplingTimes;
        for (var u = 0; u < w; u++) {
            for (var v = 0; v < h; v++) {
                var offset = 0;
                var key = v * w * 4 + u * 4;
                var totalAlpha = 0;
                var maxTotalAlpha = 0;
                var _r = buffer[key + 0] / 255;
                var _g = buffer[key + 1] / 255;
                var _b = buffer[key + 2] / 255;
                var _a = buffer[key + 3] / 255;
                for (var a = 0; a <= PI * 2; a += PI * 2 / circleSamplingTimes) {
                    cosAngle = Math.cos(a + offset);
                    sinAngle = Math.sin(a + offset);
                    for (var i = 0; i < linearSamplingTimes; i++) {
                        curDistanceX = i * stepX * cosAngle;
                        curDistanceY = i * stepY * sinAngle;
                        var _u = Math.round(u + curDistanceX - offsetX);
                        var _v = Math.round(v + curDistanceY - offsetY);
                        var __a = 0;
                        if (_u >= w || _u < 0 || _v < 0 || _v >= h) {
                            __a = 0;
                        }
                        else {
                            var _key = _v * w * 4 + _u * 4;
                            __a = buffer[_key + 3] / 255;
                        }
                        totalAlpha += (linearSamplingTimes - i) * __a;
                        maxTotalAlpha += (linearSamplingTimes - i);
                    }
                }
                _a = Math.max(_a, 0.0001);
                var outerGlowAlpha = (totalAlpha / maxTotalAlpha) * strength * alpha * (1. - inner) * Math.max(Math.min(hideObject, knockout), 1. - _a);
                var innerGlowAlpha = ((maxTotalAlpha - totalAlpha) / maxTotalAlpha) * strength * alpha * inner * _a;
                _a = Math.max(_a * knockout * (1 - hideObject), 0.0001);
                var rate1 = innerGlowAlpha / (innerGlowAlpha + _a);
                var r1 = mix(_r, color[0], rate1);
                var g1 = mix(_g, color[1], rate1);
                var b1 = mix(_b, color[2], rate1);
                var rate2 = outerGlowAlpha / (innerGlowAlpha + _a + outerGlowAlpha);
                var r2 = mix(r1, color[0], rate2);
                var g2 = mix(g1, color[1], rate2);
                var b2 = mix(b1, color[2], rate2);
                var resultAlpha = Math.min(_a + outerGlowAlpha + innerGlowAlpha, 1);
                plane[key + 0] = r2 * 255;
                plane[key + 1] = g2 * 255;
                plane[key + 2] = b2 * 255;
                plane[key + 3] = resultAlpha * 255;
            }
        }
        if (use8Clamp) {
            buffer.set(plane);
        }
        else {
            setArray(buffer, plane);
        }
    }
})(egret || (egret = {}));
var egret;
(function (egret) {
    var sys;
    (function (sys) {
        function mainCanvas(width, height) {
            console.error("empty sys.mainCanvas = " + width + ", " + height);
            return null;
        }
        sys.mainCanvas = mainCanvas;
        function createCanvas(width, height) {
            console.error("empty sys.createCanvas = " + width + ", " + height);
            return null;
        }
        sys.createCanvas = createCanvas;
        function resizeContext(renderContext, width, height, useMaxSize) {
            console.error("empty sys.resizeContext = " + renderContext + ", " + width + ", " + height + ", " + useMaxSize);
        }
        sys.resizeContext = resizeContext;
        function getContextWebGL(surface) {
            console.error("empty sys.getContextWebGL = " + surface);
            return null;
        }
        sys.getContextWebGL = getContextWebGL;
        function getContext2d(surface) {
            console.error("empty sys.getContext2d = " + surface);
            return null;
        }
        sys.getContext2d = getContext2d;
        function createTexture(renderContext, bitmapData) {
            console.error("empty sys.createTexture = " + bitmapData);
            return null;
        }
        sys.createTexture = createTexture;
        function _createTexture(renderContext, width, height, data) {
            console.error("empty sys._createTexture = " + width + ", " + height + ", " + data);
            return null;
        }
        sys._createTexture = _createTexture;
        function drawTextureElements(renderContext, data, offset) {
            console.error("empty sys.drawTextureElements = " + renderContext + ", " + data + ", " + offset);
            return 0;
        }
        sys.drawTextureElements = drawTextureElements;
        function measureTextWith(context, text) {
            console.error("empty sys.measureTextWith = " + context + ", " + text);
            return 0;
        }
        sys.measureTextWith = measureTextWith;
        function createCanvasRenderBufferSurface(defaultFunc, width, height, root) {
            console.error("empty sys.createCanvasRenderBufferSurface = " + width + ", " + height);
            return null;
        }
        sys.createCanvasRenderBufferSurface = createCanvasRenderBufferSurface;
        function resizeCanvasRenderBuffer(renderContext, width, height, useMaxSize) {
            console.error("empty sys.resizeContext = " + renderContext + ", " + width + ", " + height + ", " + useMaxSize);
        }
        sys.resizeCanvasRenderBuffer = resizeCanvasRenderBuffer;
    })(sys = egret.sys || (egret.sys = {}));
})(egret || (egret = {}));
var egret;
(function (egret) {
    var HorizontalAlign = (function () {
        function HorizontalAlign() {
        }
        HorizontalAlign.LEFT = "left";
        HorizontalAlign.RIGHT = "right";
        HorizontalAlign.CENTER = "center";
        HorizontalAlign.JUSTIFY = "justify";
        HorizontalAlign.CONTENT_JUSTIFY = "contentJustify";
        return HorizontalAlign;
    }());
    egret.HorizontalAlign = HorizontalAlign;
})(egret || (egret = {}));
var egret;
(function (egret) {
    var VerticalAlign = (function () {
        function VerticalAlign() {
        }
        VerticalAlign.TOP = "top";
        VerticalAlign.BOTTOM = "bottom";
        VerticalAlign.MIDDLE = "middle";
        VerticalAlign.JUSTIFY = "justify";
        VerticalAlign.CONTENT_JUSTIFY = "contentJustify";
        return VerticalAlign;
    }());
    egret.VerticalAlign = VerticalAlign;
})(egret || (egret = {}));
var egret;
(function (egret) {
    var TextFieldUtils = (function () {
        function TextFieldUtils() {
        }
        TextFieldUtils.$getStartLine = function (textfield) {
            var values = textfield.$TextField;
            var textHeight = TextFieldUtils.$getTextHeight(textfield);
            var startLine = 0;
            var textFieldHeight = values[4];
            if (!isNaN(textFieldHeight)) {
                if (textHeight < textFieldHeight) {
                }
                else if (textHeight > textFieldHeight) {
                    startLine = Math.max(values[28] - 1, 0);
                    startLine = Math.min(values[29] - 1, startLine);
                }
                if (!values[30]) {
                    startLine = Math.max(values[28] - 1, 0);
                    if (values[29] > 0) {
                        startLine = Math.min(values[29] - 1, startLine);
                    }
                }
            }
            return startLine;
        };
        TextFieldUtils.$getHalign = function (textfield) {
            var lineArr = textfield.$getLinesArr2();
            var halign = 0;
            if (textfield.$TextField[9] == egret.HorizontalAlign.CENTER) {
                halign = 0.5;
            }
            else if (textfield.$TextField[9] == egret.HorizontalAlign.RIGHT) {
                halign = 1;
            }
            if (textfield.$TextField[24] == egret.TextFieldType.INPUT && !textfield.$TextField[30] && lineArr.length > 1) {
                halign = 0;
            }
            return halign;
        };
        TextFieldUtils.$getTextHeight = function (textfield) {
            var textHeight = (egret.TextFieldType.INPUT == textfield.$TextField[24]
                && !textfield.$TextField[30]) ? textfield.$TextField[0] : (textfield.$TextField[6] + (textfield.$TextField[29] - 1) * textfield.$TextField[1]);
            return textHeight;
        };
        TextFieldUtils.$getValign = function (textfield) {
            var textHeight = TextFieldUtils.$getTextHeight(textfield);
            var textFieldHeight = textfield.$TextField[4];
            if (!isNaN(textFieldHeight)) {
                if (textHeight < textFieldHeight) {
                    var valign = 0;
                    if (textfield.$TextField[10] == egret.VerticalAlign.MIDDLE)
                        valign = 0.5;
                    else if (textfield.$TextField[10] == egret.VerticalAlign.BOTTOM)
                        valign = 1;
                    return valign;
                }
            }
            return 0;
        };
        TextFieldUtils.$getTextElement = function (textfield, x, y) {
            var hitTextEle = TextFieldUtils.$getHit(textfield, x, y);
            var lineArr = textfield.$getLinesArr2();
            if (hitTextEle && lineArr[hitTextEle.lineIndex] && lineArr[hitTextEle.lineIndex].elements[hitTextEle.textElementIndex]) {
                return lineArr[hitTextEle.lineIndex].elements[hitTextEle.textElementIndex];
            }
            return null;
        };
        TextFieldUtils.$getHit = function (textfield, x, y) {
            var lineArr = textfield.$getLinesArr2();
            if (textfield.$TextField[3] == 0) {
                return null;
            }
            var line = 0;
            var textHeight = TextFieldUtils.$getTextHeight(textfield);
            var startY = 0;
            var textFieldHeight = textfield.$TextField[4];
            if (!isNaN(textFieldHeight) && textFieldHeight > textHeight) {
                var valign = TextFieldUtils.$getValign(textfield);
                startY = valign * (textFieldHeight - textHeight);
                if (startY != 0) {
                    y -= startY;
                }
            }
            var startLine = TextFieldUtils.$getStartLine(textfield);
            var lineH = 0;
            for (var i = startLine; i < lineArr.length; i++) {
                var lineEle = lineArr[i];
                if (lineH + lineEle.height >= y) {
                    if (lineH < y) {
                        line = i + 1;
                    }
                    break;
                }
                else {
                    lineH += lineEle.height;
                }
                if (lineH + textfield.$TextField[1] > y) {
                    return null;
                }
                lineH += textfield.$TextField[1];
            }
            if (line == 0) {
                return null;
            }
            var lineElement = lineArr[line - 1];
            var textFieldWidth = textfield.$TextField[3];
            if (isNaN(textFieldWidth)) {
                textFieldWidth = textfield.textWidth;
            }
            var halign = TextFieldUtils.$getHalign(textfield);
            x -= halign * (textFieldWidth - lineElement.width);
            var lineW = 0;
            for (var i = 0; i < lineElement.elements.length; i++) {
                var iwTE = lineElement.elements[i];
                if (lineW + iwTE.width <= x) {
                    lineW += iwTE.width;
                }
                else if (lineW < x) {
                    return { "lineIndex": line - 1, "textElementIndex": i };
                }
            }
            return null;
        };
        TextFieldUtils.$getScrollNum = function (textfield) {
            var scrollNum = 1;
            if (textfield.$TextField[30]) {
                var height = textfield.height;
                var size = textfield.size;
                var lineSpacing = textfield.lineSpacing;
                scrollNum = Math.floor(height / (size + lineSpacing));
                var leftH = height - (size + lineSpacing) * scrollNum;
                if (leftH > size / 2) {
                    scrollNum++;
                }
            }
            return scrollNum;
        };
        return TextFieldUtils;
    }());
    egret.TextFieldUtils = TextFieldUtils;
})(egret || (egret = {}));
var egret;
(function (egret) {
    var TextFieldType = (function () {
        function TextFieldType() {
        }
        TextFieldType.DYNAMIC = "dynamic";
        TextFieldType.INPUT = "input";
        return TextFieldType;
    }());
    egret.TextFieldType = TextFieldType;
})(egret || (egret = {}));
var egret;
(function (egret) {
    var SplitRegex = new RegExp("(?=[\\u00BF-\\u1FFF\\u2C00-\\uD7FF]|\\b|\\s)(?![。，！、》…）)}”】\\.\\,\\!\\?\\]\\:])");
    function measureTextWidth(text, values, style) {
        style = style || {};
        var italic = style.italic == null ? values[16] : style.italic;
        var bold = style.bold == null ? values[15] : style.bold;
        var size = style.size == null ? values[0] : style.size;
        var fontFamily = style.fontFamily || values[8] || TextField.default_fontFamily;
        return egret.sys.measureText(text, fontFamily, size, bold, italic);
    }
    var TextField = (function (_super) {
        __extends(TextField, _super);
        function TextField() {
            var _this = _super.call(this) || this;
            _this.$inputEnabled = false;
            _this.inputUtils = null;
            _this.$graphicsNode = null;
            _this.isFlow = false;
            _this.textArr = [];
            _this.linesArr = [];
            _this.$isTyping = false;
            var textNode = new egret.sys.TextNode();
            textNode.fontFamily = TextField.default_fontFamily;
            _this.textNode = textNode;
            _this.$renderNode = textNode;
            _this.$TextField = {
                0: TextField.default_size,
                1: 0,
                2: TextField.default_textColor,
                3: NaN,
                4: NaN,
                5: 0,
                6: 0,
                7: 0,
                8: TextField.default_fontFamily,
                9: "left",
                10: "top",
                11: "#ffffff",
                12: "",
                13: "",
                14: [],
                15: false,
                16: false,
                17: true,
                18: false,
                19: false,
                20: false,
                21: 0,
                22: 0,
                23: 0,
                24: egret.TextFieldType.DYNAMIC,
                25: 0x000000,
                26: "#000000",
                27: 0,
                28: -1,
                29: 0,
                30: false,
                31: false,
                32: 0x000000,
                33: false,
                34: 0xffffff,
                35: null,
                36: null,
                37: egret.TextFieldInputType.TEXT,
                38: false
            };
            return _this;
        }
        TextField.prototype.createNativeDisplayObject = function () {
            this.$nativeDisplayObject = new egret_native.NativeDisplayObject(7);
        };
        TextField.prototype.isInput = function () {
            return this.$TextField[24] == egret.TextFieldType.INPUT;
        };
        TextField.prototype.$setTouchEnabled = function (value) {
            _super.prototype.$setTouchEnabled.call(this, value);
            if (this.isInput()) {
                this.$inputEnabled = true;
            }
        };
        Object.defineProperty(TextField.prototype, "fontFamily", {
            get: function () {
                return this.$TextField[8];
            },
            set: function (value) {
                this.$setFontFamily(value);
            },
            enumerable: true,
            configurable: true
        });
        TextField.prototype.$setFontFamily = function (value) {
            var values = this.$TextField;
            if (values[8] == value) {
                return false;
            }
            values[8] = value;
            this.invalidateFontString();
            if (egret.nativeRender) {
                this.$nativeDisplayObject.setFontFamily(value);
            }
            return true;
        };
        Object.defineProperty(TextField.prototype, "size", {
            get: function () {
                return this.$TextField[0];
            },
            set: function (value) {
                this.$setSize(value);
            },
            enumerable: true,
            configurable: true
        });
        TextField.prototype.$setSize = function (value) {
            var values = this.$TextField;
            if (values[0] == value) {
                return false;
            }
            values[0] = value;
            this.invalidateFontString();
            if (egret.nativeRender) {
                this.$nativeDisplayObject.setFontSize(value);
            }
            return true;
        };
        Object.defineProperty(TextField.prototype, "bold", {
            get: function () {
                return this.$TextField[15];
            },
            set: function (value) {
                this.$setBold(value);
            },
            enumerable: true,
            configurable: true
        });
        TextField.prototype.$setBold = function (value) {
            var values = this.$TextField;
            if (value == values[15]) {
                return false;
            }
            values[15] = value;
            this.invalidateFontString();
            if (egret.nativeRender) {
                this.$nativeDisplayObject.setBold(value);
            }
            return true;
        };
        Object.defineProperty(TextField.prototype, "italic", {
            get: function () {
                return this.$TextField[16];
            },
            set: function (value) {
                this.$setItalic(value);
            },
            enumerable: true,
            configurable: true
        });
        TextField.prototype.$setItalic = function (value) {
            var values = this.$TextField;
            if (value == values[16]) {
                return false;
            }
            values[16] = value;
            this.invalidateFontString();
            if (egret.nativeRender) {
                this.$nativeDisplayObject.setItalic(value);
            }
            return true;
        };
        TextField.prototype.invalidateFontString = function () {
            this.$TextField[17] = true;
            this.$invalidateTextField();
        };
        Object.defineProperty(TextField.prototype, "textAlign", {
            get: function () {
                return this.$TextField[9];
            },
            set: function (value) {
                this.$setTextAlign(value);
            },
            enumerable: true,
            configurable: true
        });
        TextField.prototype.$setTextAlign = function (value) {
            var values = this.$TextField;
            if (values[9] == value) {
                return false;
            }
            values[9] = value;
            this.$invalidateTextField();
            if (egret.nativeRender) {
                this.$nativeDisplayObject.setTextAlign(value);
            }
            return true;
        };
        Object.defineProperty(TextField.prototype, "verticalAlign", {
            get: function () {
                return this.$TextField[10];
            },
            set: function (value) {
                this.$setVerticalAlign(value);
            },
            enumerable: true,
            configurable: true
        });
        TextField.prototype.$setVerticalAlign = function (value) {
            var values = this.$TextField;
            if (values[10] == value) {
                return false;
            }
            values[10] = value;
            this.$invalidateTextField();
            if (egret.nativeRender) {
                this.$nativeDisplayObject.setVerticalAlign(value);
            }
            return true;
        };
        Object.defineProperty(TextField.prototype, "lineSpacing", {
            get: function () {
                return this.$TextField[1];
            },
            set: function (value) {
                this.$setLineSpacing(value);
            },
            enumerable: true,
            configurable: true
        });
        TextField.prototype.$setLineSpacing = function (value) {
            var values = this.$TextField;
            if (values[1] == value) {
                return false;
            }
            values[1] = value;
            this.$invalidateTextField();
            if (egret.nativeRender) {
                this.$nativeDisplayObject.setLineSpacing(value);
            }
            return true;
        };
        Object.defineProperty(TextField.prototype, "textColor", {
            get: function () {
                return this.$TextField[2];
            },
            set: function (value) {
                this.$setTextColor(value);
            },
            enumerable: true,
            configurable: true
        });
        TextField.prototype.$setTextColor = function (value) {
            var values = this.$TextField;
            if (values[2] == value) {
                return false;
            }
            values[2] = value;
            if (this.inputUtils) {
                this.inputUtils._setColor(this.$TextField[2]);
            }
            this.$invalidateTextField();
            if (egret.nativeRender) {
                this.$nativeDisplayObject.setTextColor(value);
            }
            return true;
        };
        Object.defineProperty(TextField.prototype, "wordWrap", {
            get: function () {
                return this.$TextField[19];
            },
            set: function (value) {
                this.$setWordWrap(value);
            },
            enumerable: true,
            configurable: true
        });
        TextField.prototype.$setWordWrap = function (value) {
            var values = this.$TextField;
            if (value == values[19]) {
                return;
            }
            if (values[20]) {
                return;
            }
            values[19] = value;
            this.$invalidateTextField();
            if (egret.nativeRender) {
                this.$nativeDisplayObject.setWordWrap(value);
            }
        };
        Object.defineProperty(TextField.prototype, "type", {
            get: function () {
                return this.$TextField[24];
            },
            set: function (value) {
                this.$setType(value);
            },
            enumerable: true,
            configurable: true
        });
        TextField.prototype.$setType = function (value) {
            var values = this.$TextField;
            if (values[24] != value) {
                values[24] = value;
                if (egret.nativeRender) {
                    this.$nativeDisplayObject.setType(value);
                }
                if (value == egret.TextFieldType.INPUT) {
                    if (isNaN(values[3])) {
                        this.$setWidth(100);
                    }
                    if (isNaN(values[4])) {
                        this.$setHeight(30);
                    }
                    this.$setTouchEnabled(true);
                    if (this.inputUtils == null) {
                        this.inputUtils = new egret.InputController();
                    }
                    this.inputUtils.init(this);
                    this.$invalidateTextField();
                    if (this.$stage) {
                        this.inputUtils._addStageText();
                    }
                }
                else {
                    if (this.inputUtils) {
                        this.inputUtils._removeStageText();
                        this.inputUtils = null;
                    }
                    this.$setTouchEnabled(false);
                }
                return true;
            }
            return false;
        };
        Object.defineProperty(TextField.prototype, "inputType", {
            get: function () {
                return this.$TextField[37];
            },
            set: function (value) {
                if (this.$TextField[37] == value) {
                    return;
                }
                this.$TextField[37] = value;
                if (egret.nativeRender) {
                    this.$nativeDisplayObject.setInputType(value);
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextField.prototype, "text", {
            get: function () {
                return this.$getText();
            },
            set: function (value) {
                this.$setText(value);
            },
            enumerable: true,
            configurable: true
        });
        TextField.prototype.$getText = function () {
            if (this.$TextField[24] == egret.TextFieldType.INPUT) {
                return this.inputUtils._getText();
            }
            return this.$TextField[13];
        };
        TextField.prototype.$setBaseText = function (value) {
            if (value == null) {
                value = "";
            }
            else {
                value = value.toString();
            }
            this.isFlow = false;
            var values = this.$TextField;
            if (values[13] != value) {
                this.$invalidateTextField();
                values[13] = value;
                var text = "";
                if (values[20]) {
                    text = this.changeToPassText(value);
                }
                else {
                    text = value;
                }
                if (egret.nativeRender) {
                    this.$nativeDisplayObject.setText(text);
                }
                this.setMiddleStyle([{ text: text }]);
                return true;
            }
            return false;
        };
        TextField.prototype.$setText = function (value) {
            if (value == null) {
                value = "";
            }
            var result = this.$setBaseText(value);
            if (this.inputUtils) {
                this.inputUtils._setText(this.$TextField[13]);
            }
            return result;
        };
        Object.defineProperty(TextField.prototype, "displayAsPassword", {
            get: function () {
                return this.$TextField[20];
            },
            set: function (value) {
                this.$setDisplayAsPassword(value);
            },
            enumerable: true,
            configurable: true
        });
        TextField.prototype.$setDisplayAsPassword = function (value) {
            var values = this.$TextField;
            if (values[20] != value) {
                values[20] = value;
                this.$invalidateTextField();
                var text = "";
                if (value) {
                    text = this.changeToPassText(values[13]);
                }
                else {
                    text = values[13];
                }
                if (egret.nativeRender) {
                    this.$nativeDisplayObject.setText(text);
                }
                this.setMiddleStyle([{ text: text }]);
                return true;
            }
            return false;
        };
        Object.defineProperty(TextField.prototype, "strokeColor", {
            get: function () {
                return this.$TextField[25];
            },
            set: function (value) {
                this.$setStrokeColor(value);
            },
            enumerable: true,
            configurable: true
        });
        TextField.prototype.$setStrokeColor = function (value) {
            var values = this.$TextField;
            if (values[25] != value) {
                this.$invalidateTextField();
                values[25] = value;
                if (egret.nativeRender) {
                    this.$nativeDisplayObject.setStrokeColor(value);
                }
                values[26] = egret.toColorString(value);
                return true;
            }
            return false;
        };
        Object.defineProperty(TextField.prototype, "stroke", {
            get: function () {
                return this.$TextField[27];
            },
            set: function (value) {
                this.$setStroke(value);
            },
            enumerable: true,
            configurable: true
        });
        TextField.prototype.$setStroke = function (value) {
            if (this.$TextField[27] != value) {
                this.$invalidateTextField();
                this.$TextField[27] = value;
                if (egret.nativeRender) {
                    this.$nativeDisplayObject.setStroke(value);
                }
                return true;
            }
            return false;
        };
        Object.defineProperty(TextField.prototype, "maxChars", {
            get: function () {
                return this.$TextField[21];
            },
            set: function (value) {
                this.$setMaxChars(value);
            },
            enumerable: true,
            configurable: true
        });
        TextField.prototype.$setMaxChars = function (value) {
            if (this.$TextField[21] != value) {
                this.$TextField[21] = value;
                if (egret.nativeRender) {
                    this.$nativeDisplayObject.setMaxChars(value);
                }
                return true;
            }
            return false;
        };
        Object.defineProperty(TextField.prototype, "scrollV", {
            get: function () {
                return Math.min(Math.max(this.$TextField[28], 1), this.maxScrollV);
            },
            set: function (value) {
                value = Math.max(value, 1);
                if (value == this.$TextField[28]) {
                    return;
                }
                this.$TextField[28] = value;
                if (egret.nativeRender) {
                    this.$nativeDisplayObject.setScrollV(value);
                }
                this.$invalidateTextField();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextField.prototype, "maxScrollV", {
            get: function () {
                this.$getLinesArr();
                return Math.max(this.$TextField[29] - egret.TextFieldUtils.$getScrollNum(this) + 1, 1);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextField.prototype, "selectionBeginIndex", {
            get: function () {
                return 0;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextField.prototype, "selectionEndIndex", {
            get: function () {
                return 0;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextField.prototype, "caretIndex", {
            get: function () {
                return 0;
            },
            enumerable: true,
            configurable: true
        });
        TextField.prototype.$setSelection = function (beginIndex, endIndex) {
            return false;
        };
        TextField.prototype.$getLineHeight = function () {
            return this.$TextField[1] + this.$TextField[0];
        };
        Object.defineProperty(TextField.prototype, "numLines", {
            get: function () {
                this.$getLinesArr();
                return this.$TextField[29];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextField.prototype, "multiline", {
            get: function () {
                return this.$TextField[30];
            },
            set: function (value) {
                this.$setMultiline(value);
            },
            enumerable: true,
            configurable: true
        });
        TextField.prototype.$setMultiline = function (value) {
            if (this.$TextField[30] == value) {
                return false;
            }
            this.$TextField[30] = value;
            this.$invalidateTextField();
            if (egret.nativeRender) {
                this.$nativeDisplayObject.setMultiline(value);
            }
            return true;
        };
        Object.defineProperty(TextField.prototype, "restrict", {
            get: function () {
                var values = this.$TextField;
                var str = null;
                if (values[35] != null) {
                    str = values[35];
                }
                if (values[36] != null) {
                    if (str == null) {
                        str = "";
                    }
                    str += "^" + values[36];
                }
                return str;
            },
            set: function (value) {
                var values = this.$TextField;
                if (value == null) {
                    values[35] = null;
                    values[36] = null;
                }
                else {
                    var index = -1;
                    while (index < value.length) {
                        index = value.indexOf("^", index);
                        if (index == 0) {
                            break;
                        }
                        else if (index > 0) {
                            if (value.charAt(index - 1) != "\\") {
                                break;
                            }
                            index++;
                        }
                        else {
                            break;
                        }
                    }
                    if (index == 0) {
                        values[35] = null;
                        values[36] = value.substring(index + 1);
                    }
                    else if (index > 0) {
                        values[35] = value.substring(0, index);
                        values[36] = value.substring(index + 1);
                    }
                    else {
                        values[35] = value;
                        values[36] = null;
                    }
                }
            },
            enumerable: true,
            configurable: true
        });
        TextField.prototype.$setWidth = function (value) {
            if (egret.nativeRender) {
                this.$nativeDisplayObject.setTextFieldWidth(value);
            }
            var values = this.$TextField;
            if (isNaN(value)) {
                if (isNaN(values[3])) {
                    return false;
                }
                values[3] = NaN;
            }
            else {
                if (values[3] == value) {
                    return false;
                }
                values[3] = value;
            }
            value = +value;
            if (value < 0) {
                return false;
            }
            this.$invalidateTextField();
            return true;
        };
        TextField.prototype.$setHeight = function (value) {
            if (egret.nativeRender) {
                this.$nativeDisplayObject.setTextFieldHeight(value);
            }
            var values = this.$TextField;
            if (isNaN(value)) {
                if (isNaN(values[4])) {
                    return false;
                }
                values[4] = NaN;
            }
            else {
                if (values[4] == value) {
                    return false;
                }
                values[4] = value;
            }
            value = +value;
            if (value < 0) {
                return false;
            }
            this.$invalidateTextField();
            return true;
        };
        TextField.prototype.$getWidth = function () {
            var values = this.$TextField;
            return isNaN(values[3]) ? this.$getContentBounds().width : values[3];
        };
        TextField.prototype.$getHeight = function () {
            var values = this.$TextField;
            return isNaN(values[4]) ? this.$getContentBounds().height : values[4];
        };
        Object.defineProperty(TextField.prototype, "border", {
            get: function () {
                return this.$TextField[31];
            },
            set: function (value) {
                this.$setBorder(value);
            },
            enumerable: true,
            configurable: true
        });
        TextField.prototype.$setBorder = function (value) {
            value = !!value;
            if (this.$TextField[31] == value) {
                return;
            }
            this.$TextField[31] = value;
            this.$invalidateTextField();
            if (egret.nativeRender) {
                this.$nativeDisplayObject.setBorder(value);
            }
        };
        Object.defineProperty(TextField.prototype, "borderColor", {
            get: function () {
                return this.$TextField[32];
            },
            set: function (value) {
                this.$setBorderColor(value);
            },
            enumerable: true,
            configurable: true
        });
        TextField.prototype.$setBorderColor = function (value) {
            value = +value || 0;
            if (this.$TextField[32] == value) {
                return;
            }
            this.$TextField[32] = value;
            this.$invalidateTextField();
            if (egret.nativeRender) {
                this.$nativeDisplayObject.setBorderColor(value);
            }
        };
        Object.defineProperty(TextField.prototype, "background", {
            get: function () {
                return this.$TextField[33];
            },
            set: function (value) {
                this.$setBackground(value);
            },
            enumerable: true,
            configurable: true
        });
        TextField.prototype.$setBackground = function (value) {
            if (this.$TextField[33] == value) {
                return;
            }
            this.$TextField[33] = value;
            this.$invalidateTextField();
            if (egret.nativeRender) {
                this.$nativeDisplayObject.setBackground(value);
            }
        };
        Object.defineProperty(TextField.prototype, "backgroundColor", {
            get: function () {
                return this.$TextField[34];
            },
            set: function (value) {
                this.$setBackgroundColor(value);
            },
            enumerable: true,
            configurable: true
        });
        TextField.prototype.$setBackgroundColor = function (value) {
            if (this.$TextField[34] == value) {
                return;
            }
            this.$TextField[34] = value;
            this.$invalidateTextField();
            if (egret.nativeRender) {
                this.$nativeDisplayObject.setBackgroundColor(value);
            }
        };
        TextField.prototype.fillBackground = function (lines) {
            var graphics = this.$graphicsNode;
            if (graphics) {
                graphics.clear();
            }
            var values = this.$TextField;
            if (values[33] || values[31] || (lines && lines.length > 0)) {
                if (!graphics) {
                    graphics = this.$graphicsNode = new egret.sys.GraphicsNode();
                    if (!egret.nativeRender) {
                        var groupNode = new egret.sys.GroupNode();
                        groupNode.addNode(graphics);
                        groupNode.addNode(this.textNode);
                        this.$renderNode = groupNode;
                    }
                    else {
                        this.$renderNode = this.textNode;
                    }
                }
                var fillPath = void 0;
                var strokePath = void 0;
                if (values[33]) {
                    fillPath = graphics.beginFill(values[34]);
                    fillPath.drawRect(0, 0, this.$getWidth(), this.$getHeight());
                }
                if (values[31]) {
                    strokePath = graphics.lineStyle(1, values[32]);
                    strokePath.drawRect(0, 0, this.$getWidth() - 1, this.$getHeight() - 1);
                }
                if (lines && lines.length > 0) {
                    var textColor = values[2];
                    var lastColor = -1;
                    var length_6 = lines.length;
                    for (var i = 0; i < length_6; i += 4) {
                        var x = lines[i];
                        var y = lines[i + 1];
                        var w = lines[i + 2];
                        var color = lines[i + 3] || textColor;
                        if (lastColor < 0 || lastColor != color) {
                            lastColor = color;
                            strokePath = graphics.lineStyle(2, color, 1, egret.CapsStyle.NONE);
                        }
                        strokePath.moveTo(x, y);
                        strokePath.lineTo(x + w, y);
                    }
                }
            }
            if (graphics) {
                var bounds = this.$getRenderBounds();
                graphics.x = bounds.x;
                graphics.y = bounds.y;
                graphics.width = bounds.width;
                graphics.height = bounds.height;
                egret.Rectangle.release(bounds);
            }
        };
        TextField.prototype.setFocus = function () {
            if (this.type == egret.TextFieldType.INPUT && this.$stage) {
                this.inputUtils.$onFocus();
            }
        };
        TextField.prototype.$onRemoveFromStage = function () {
            _super.prototype.$onRemoveFromStage.call(this);
            this.removeEvent();
            if (this.$TextField[24] == egret.TextFieldType.INPUT) {
                this.inputUtils._removeStageText();
            }
            if (this.textNode) {
                this.textNode.clean();
                if (egret.nativeRender) {
                    egret_native.NativeDisplayObject.disposeTextData(this);
                }
            }
        };
        TextField.prototype.$onAddToStage = function (stage, nestLevel) {
            _super.prototype.$onAddToStage.call(this, stage, nestLevel);
            this.addEvent();
            if (this.$TextField[24] == egret.TextFieldType.INPUT) {
                this.inputUtils._addStageText();
            }
        };
        TextField.prototype.$invalidateTextField = function () {
            var self = this;
            self.$renderDirty = true;
            self.$TextField[18] = true;
            self.$TextField[38] = true;
            if (egret.nativeRender) {
            }
            else {
                var p = self.$parent;
                if (p && !p.$cacheDirty) {
                    p.$cacheDirty = true;
                    p.$cacheDirtyUp();
                }
                var maskedObject = self.$maskedObject;
                if (maskedObject && !maskedObject.$cacheDirty) {
                    maskedObject.$cacheDirty = true;
                    maskedObject.$cacheDirtyUp();
                }
            }
        };
        TextField.prototype.$getRenderBounds = function () {
            var bounds = this.$getContentBounds();
            var tmpBounds = egret.Rectangle.create();
            tmpBounds.copyFrom(bounds);
            if (this.$TextField[31]) {
                tmpBounds.width += 2;
                tmpBounds.height += 2;
            }
            var _strokeDouble = this.$TextField[27] * 2;
            if (_strokeDouble > 0) {
                tmpBounds.width += _strokeDouble * 2;
                tmpBounds.height += _strokeDouble * 2;
            }
            tmpBounds.x -= _strokeDouble + 2;
            tmpBounds.y -= _strokeDouble + 2;
            tmpBounds.width = Math.ceil(tmpBounds.width) + 4;
            tmpBounds.height = Math.ceil(tmpBounds.height) + 4;
            return tmpBounds;
        };
        TextField.prototype.$measureContentBounds = function (bounds) {
            this.$getLinesArr();
            var w = 0;
            var h = 0;
            if (egret.nativeRender) {
                w = egret_native.nrGetTextFieldWidth(this.$nativeDisplayObject.id);
                h = egret_native.nrGetTextFieldHeight(this.$nativeDisplayObject.id);
            }
            else {
                w = !isNaN(this.$TextField[3]) ? this.$TextField[3] : this.$TextField[5];
                h = !isNaN(this.$TextField[4]) ? this.$TextField[4] : egret.TextFieldUtils.$getTextHeight(this);
            }
            bounds.setTo(0, 0, w, h);
        };
        TextField.prototype.$updateRenderNode = function () {
            if (this.$TextField[24] == egret.TextFieldType.INPUT) {
                this.inputUtils._updateProperties();
                if (this.$isTyping) {
                    this.fillBackground();
                    return;
                }
            }
            else if (this.$TextField[3] == 0) {
                var graphics = this.$graphicsNode;
                if (graphics) {
                    graphics.clear();
                }
                return;
            }
            var underLines = this.drawText();
            this.fillBackground(underLines);
            var bounds = this.$getRenderBounds();
            var node = this.textNode;
            node.x = bounds.x;
            node.y = bounds.y;
            node.width = Math.ceil(bounds.width);
            node.height = Math.ceil(bounds.height);
            egret.Rectangle.release(bounds);
        };
        Object.defineProperty(TextField.prototype, "textFlow", {
            get: function () {
                return this.textArr;
            },
            set: function (textArr) {
                this.isFlow = true;
                var text = "";
                if (textArr == null)
                    textArr = [];
                for (var i = 0; i < textArr.length; i++) {
                    var element = textArr[i];
                    text += element.text;
                }
                if (this.$TextField[20]) {
                    this.$setBaseText(text);
                }
                else {
                    this.$TextField[13] = text;
                    this.setMiddleStyle(textArr);
                    if (egret.nativeRender) {
                        this.$nativeDisplayObject.setTextFlow(textArr);
                    }
                }
            },
            enumerable: true,
            configurable: true
        });
        TextField.prototype.changeToPassText = function (text) {
            if (this.$TextField[20]) {
                var passText = "";
                for (var i = 0, num = text.length; i < num; i++) {
                    switch (text.charAt(i)) {
                        case '\n':
                            passText += "\n";
                            break;
                        case '\r':
                            break;
                        default:
                            passText += '*';
                    }
                }
                return passText;
            }
            return text;
        };
        TextField.prototype.setMiddleStyle = function (textArr) {
            this.$TextField[18] = true;
            this.$TextField[38] = true;
            this.textArr = textArr;
            this.$invalidateTextField();
        };
        Object.defineProperty(TextField.prototype, "textWidth", {
            get: function () {
                this.$getLinesArr();
                if (egret.nativeRender) {
                    return egret_native.nrGetTextWidth(this.$nativeDisplayObject.id);
                }
                return this.$TextField[5];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextField.prototype, "textHeight", {
            get: function () {
                this.$getLinesArr();
                if (egret.nativeRender) {
                    return egret_native.nrGetTextHeight(this.$nativeDisplayObject.id);
                }
                return egret.TextFieldUtils.$getTextHeight(this);
            },
            enumerable: true,
            configurable: true
        });
        TextField.prototype.appendText = function (text) {
            this.appendElement({ text: text });
        };
        TextField.prototype.appendElement = function (element) {
            var text = this.$TextField[13] + element.text;
            if (egret.nativeRender) {
                this.textArr.push(element);
                this.$TextField[13] = text;
                this.$TextField[18] = true;
                this.$TextField[38] = true;
                this.$nativeDisplayObject.setTextFlow(this.textArr);
                return;
            }
            if (this.$TextField[20]) {
                this.$setBaseText(text);
            }
            else {
                this.$TextField[13] = text;
                this.textArr.push(element);
                this.setMiddleStyle(this.textArr);
            }
        };
        TextField.prototype.$getLinesArr = function () {
            var values = this.$TextField;
            if (egret.nativeRender && values[38]) {
                egret_native.updateNativeRender();
                values[38] = false;
                return;
            }
            else {
                return this.$getLinesArr2();
            }
        };
        TextField.prototype.$getLinesArr2 = function () {
            var values = this.$TextField;
            if (!values[18]) {
                return this.linesArr;
            }
            values[18] = false;
            var text2Arr = this.textArr;
            this.linesArr.length = 0;
            values[6] = 0;
            values[5] = 0;
            var textFieldWidth = values[3];
            if (!isNaN(textFieldWidth) && textFieldWidth == 0) {
                values[29] = 0;
                return [{ width: 0, height: 0, charNum: 0, elements: [], hasNextLine: false }];
            }
            var linesArr = this.linesArr;
            var lineW = 0;
            var lineCharNum = 0;
            var lineH = 0;
            var lineCount = 0;
            var lineElement;
            for (var i = 0, text2ArrLength = text2Arr.length; i < text2ArrLength; i++) {
                var element = text2Arr[i];
                if (!element.text) {
                    if (lineElement) {
                        lineElement.width = lineW;
                        lineElement.height = lineH;
                        lineElement.charNum = lineCharNum;
                        values[5] = Math.max(values[5], lineW);
                        values[6] += lineH;
                    }
                    continue;
                }
                element.style = element.style || {};
                var text = element.text.toString();
                var textArr = text.split(/(?:\r\n|\r|\n)/);
                for (var j = 0, textArrLength = textArr.length; j < textArrLength; j++) {
                    if (linesArr[lineCount] == null) {
                        lineElement = { width: 0, height: 0, elements: [], charNum: 0, hasNextLine: false };
                        linesArr[lineCount] = lineElement;
                        lineW = 0;
                        lineH = 0;
                        lineCharNum = 0;
                    }
                    if (values[24] == egret.TextFieldType.INPUT) {
                        lineH = values[0];
                    }
                    else {
                        lineH = Math.max(lineH, element.style.size || values[0]);
                    }
                    var isNextLine = true;
                    if (textArr[j] == "") {
                        if (j == textArrLength - 1) {
                            isNextLine = false;
                        }
                    }
                    else {
                        var w = measureTextWidth(textArr[j], values, element.style);
                        if (isNaN(textFieldWidth)) {
                            lineW += w;
                            lineCharNum += textArr[j].length;
                            lineElement.elements.push({
                                width: w,
                                text: textArr[j],
                                style: element.style
                            });
                            if (j == textArrLength - 1) {
                                isNextLine = false;
                            }
                        }
                        else {
                            if (lineW + w <= textFieldWidth) {
                                lineElement.elements.push({
                                    width: w,
                                    text: textArr[j],
                                    style: element.style
                                });
                                lineW += w;
                                lineCharNum += textArr[j].length;
                                if (j == textArrLength - 1) {
                                    isNextLine = false;
                                }
                            }
                            else {
                                var k = 0;
                                var ww = 0;
                                var word = textArr[j];
                                var words = void 0;
                                if (values[19]) {
                                    words = word.split(SplitRegex);
                                }
                                else {
                                    words = word.match(/./g);
                                }
                                var wl = words.length;
                                var charNum = 0;
                                for (; k < wl; k++) {
                                    var codeLen = words[k].length;
                                    var has4BytesUnicode = false;
                                    if (codeLen == 1 && k < wl - 1) {
                                        var charCodeHigh = words[k].charCodeAt(0);
                                        var charCodeLow = words[k + 1].charCodeAt(0);
                                        if (charCodeHigh >= 0xD800 && charCodeHigh <= 0xDBFF && (charCodeLow & 0xFC00) == 0xDC00) {
                                            var realWord = words[k] + words[k + 1];
                                            codeLen = 2;
                                            has4BytesUnicode = true;
                                            w = measureTextWidth(realWord, values, element.style);
                                        }
                                        else {
                                            w = measureTextWidth(words[k], values, element.style);
                                        }
                                    }
                                    else {
                                        w = measureTextWidth(words[k], values, element.style);
                                    }
                                    if (lineW != 0 && lineW + w > textFieldWidth && lineW + k != 0) {
                                        break;
                                    }
                                    if (ww + w > textFieldWidth) {
                                        var words2 = words[k].match(/./g);
                                        for (var k2 = 0, wl2 = words2.length; k2 < wl2; k2++) {
                                            var codeLen = words2[k2].length;
                                            var has4BytesUnicode2 = false;
                                            if (codeLen == 1 && k2 < wl2 - 1) {
                                                var charCodeHigh = words2[k2].charCodeAt(0);
                                                var charCodeLow = words2[k2 + 1].charCodeAt(0);
                                                if (charCodeHigh >= 0xD800 && charCodeHigh <= 0xDBFF && (charCodeLow & 0xFC00) == 0xDC00) {
                                                    var realWord = words2[k2] + words2[k2 + 1];
                                                    codeLen = 2;
                                                    has4BytesUnicode2 = true;
                                                    w = measureTextWidth(realWord, values, element.style);
                                                }
                                                else {
                                                    w = measureTextWidth(words2[k2], values, element.style);
                                                }
                                            }
                                            else {
                                                w = measureTextWidth(words2[k2], values, element.style);
                                            }
                                            if (k2 > 0 && lineW + w > textFieldWidth) {
                                                break;
                                            }
                                            charNum += codeLen;
                                            ww += w;
                                            lineW += w;
                                            lineCharNum += charNum;
                                            if (has4BytesUnicode2) {
                                                k2++;
                                            }
                                        }
                                    }
                                    else {
                                        charNum += codeLen;
                                        ww += w;
                                        lineW += w;
                                        lineCharNum += charNum;
                                    }
                                    if (has4BytesUnicode) {
                                        k++;
                                    }
                                }
                                if (k > 0) {
                                    lineElement.elements.push({
                                        width: ww,
                                        text: word.substring(0, charNum),
                                        style: element.style
                                    });
                                    var leftWord = word.substring(charNum);
                                    var m = void 0;
                                    var lwleng = leftWord.length;
                                    for (m = 0; m < lwleng; m++) {
                                        if (leftWord.charAt(m) != " ") {
                                            break;
                                        }
                                    }
                                    textArr[j] = leftWord.substring(m);
                                }
                                if (textArr[j] != "") {
                                    j--;
                                    isNextLine = false;
                                }
                            }
                        }
                    }
                    if (isNextLine) {
                        lineCharNum++;
                        lineElement.hasNextLine = true;
                    }
                    if (j < textArr.length - 1) {
                        lineElement.width = lineW;
                        lineElement.height = lineH;
                        lineElement.charNum = lineCharNum;
                        values[5] = Math.max(values[5], lineW);
                        values[6] += lineH;
                        lineCount++;
                    }
                }
                if (i == text2Arr.length - 1 && lineElement) {
                    lineElement.width = lineW;
                    lineElement.height = lineH;
                    lineElement.charNum = lineCharNum;
                    values[5] = Math.max(values[5], lineW);
                    values[6] += lineH;
                }
            }
            values[29] = linesArr.length;
            return linesArr;
        };
        TextField.prototype.$setIsTyping = function (value) {
            this.$isTyping = value;
            this.$invalidateTextField();
            if (egret.nativeRender) {
                this.$nativeDisplayObject.setIsTyping(value);
            }
        };
        TextField.prototype.drawText = function () {
            var node = this.textNode;
            var values = this.$TextField;
            node.bold = values[15];
            node.fontFamily = values[8] || TextField.default_fontFamily;
            node.italic = values[16];
            node.size = values[0];
            node.stroke = values[27];
            node.strokeColor = values[25];
            node.textColor = values[2];
            var lines = this.$getLinesArr();
            if (values[5] == 0) {
                return [];
            }
            var maxWidth = !isNaN(values[3]) ? values[3] : values[5];
            var textHeight = egret.TextFieldUtils.$getTextHeight(this);
            var drawY = 0;
            var startLine = egret.TextFieldUtils.$getStartLine(this);
            var textFieldHeight = values[4];
            if (!isNaN(textFieldHeight) && textFieldHeight > textHeight) {
                var vAlign = egret.TextFieldUtils.$getValign(this);
                drawY += vAlign * (textFieldHeight - textHeight);
            }
            drawY = Math.round(drawY);
            var hAlign = egret.TextFieldUtils.$getHalign(this);
            var drawX = 0;
            var underLineData = [];
            for (var i = startLine, numLinesLength = values[29]; i < numLinesLength; i++) {
                var line = lines[i];
                var h = line.height;
                drawY += h / 2;
                if (i != startLine) {
                    if (values[24] == egret.TextFieldType.INPUT && !values[30]) {
                        break;
                    }
                    if (!isNaN(textFieldHeight) && drawY > textFieldHeight) {
                        break;
                    }
                }
                drawX = Math.round((maxWidth - line.width) * hAlign);
                for (var j = 0, elementsLength = line.elements.length; j < elementsLength; j++) {
                    var element = line.elements[j];
                    var size = element.style.size || values[0];
                    node.drawText(drawX, drawY + (h - size) / 2, element.text, element.style);
                    if (element.style.underline) {
                        underLineData.push(drawX, drawY + (h) / 2, element.width, element.style.textColor);
                    }
                    drawX += element.width;
                }
                drawY += h / 2 + values[1];
            }
            return underLineData;
        };
        TextField.prototype.addEvent = function () {
            this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTapHandler, this);
        };
        TextField.prototype.removeEvent = function () {
            this.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTapHandler, this);
        };
        TextField.prototype.onTapHandler = function (e) {
            if (this.$TextField[24] == egret.TextFieldType.INPUT) {
                return;
            }
            var ele = egret.TextFieldUtils.$getTextElement(this, e.localX, e.localY);
            if (ele == null) {
                return;
            }
            var style = ele.style;
            if (style && style.href) {
                if (style.href.match(/^event:/)) {
                    var type = style.href.match(/^event:/)[0];
                    egret.TextEvent.dispatchTextEvent(this, egret.TextEvent.LINK, style.href.substring(type.length));
                }
                else {
                    open(style.href, style.target || "_blank");
                }
            }
        };
        TextField.default_fontFamily = "Arial";
        TextField.default_size = 30;
        TextField.default_textColor = 0xffffff;
        return TextField;
    }(egret.DisplayObject));
    egret.TextField = TextField;
})(egret || (egret = {}));
var egret;
(function (egret) {
    egret.fontMapping = {};
})(egret || (egret = {}));
var egret;
(function (egret) {
    var web;
    (function (web) {
        var WebGLRenderTarget = (function (_super) {
            __extends(WebGLRenderTarget, _super);
            function WebGLRenderTarget(gl, width, height) {
                var _this = _super.call(this) || this;
                _this.clearColor = [0, 0, 0, 0];
                _this.useFrameBuffer = true;
                _this.gl = gl;
                _this._resize(width, height);
                return _this;
            }
            WebGLRenderTarget.prototype._resize = function (width, height) {
                width = width || 1;
                height = height || 1;
                if (width < 1) {
                    width = 1;
                }
                if (height < 1) {
                    height = 1;
                }
                this.width = width;
                this.height = height;
            };
            WebGLRenderTarget.prototype.resize = function (width, height) {
                this._resize(width, height);
                var gl = this.gl;
                if (this.frameBuffer) {
                    gl.bindTexture(gl.TEXTURE_2D, this.texture);
                    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.width, this.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
                }
                if (this.stencilBuffer) {
                    gl.deleteRenderbuffer(this.stencilBuffer);
                    this.stencilBuffer = null;
                }
            };
            WebGLRenderTarget.prototype.activate = function () {
                var gl = this.gl;
                gl.bindFramebuffer(gl.FRAMEBUFFER, this.getFrameBuffer());
            };
            WebGLRenderTarget.prototype.getFrameBuffer = function () {
                if (!this.useFrameBuffer) {
                    return null;
                }
                return this.frameBuffer;
            };
            WebGLRenderTarget.prototype.initFrameBuffer = function () {
                if (!this.frameBuffer) {
                    var gl = this.gl;
                    this.texture = this.createTexture();
                    this.frameBuffer = gl.createFramebuffer();
                    gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer);
                    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texture, 0);
                }
            };
            WebGLRenderTarget.prototype.createTexture = function () {
                var webglrendercontext = web.WebGLRenderContext.getInstance(0, 0);
                return egret.sys._createTexture(webglrendercontext, this.width, this.height, null);
            };
            WebGLRenderTarget.prototype.clear = function (bind) {
                var gl = this.gl;
                if (bind) {
                    this.activate();
                }
                gl.colorMask(true, true, true, true);
                gl.clearColor(this.clearColor[0], this.clearColor[1], this.clearColor[2], this.clearColor[3]);
                gl.clear(gl.COLOR_BUFFER_BIT);
            };
            WebGLRenderTarget.prototype.enabledStencil = function () {
                if (!this.frameBuffer || this.stencilBuffer) {
                    return;
                }
                var gl = this.gl;
                gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer);
                this.stencilBuffer = gl.createRenderbuffer();
                gl.bindRenderbuffer(gl.RENDERBUFFER, this.stencilBuffer);
                gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_STENCIL, this.width, this.height);
                gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_STENCIL_ATTACHMENT, gl.RENDERBUFFER, this.stencilBuffer);
            };
            WebGLRenderTarget.prototype.dispose = function () {
                egret.WebGLUtils.deleteWebGLTexture(this.texture);
            };
            return WebGLRenderTarget;
        }(egret.HashObject));
        web.WebGLRenderTarget = WebGLRenderTarget;
    })(web = egret.web || (egret.web = {}));
})(egret || (egret = {}));
var egret;
(function (egret) {
    var web;
    (function (web) {
        var WebGLRenderBuffer = (function (_super) {
            __extends(WebGLRenderBuffer, _super);
            function WebGLRenderBuffer(width, height, root) {
                var _this = _super.call(this) || this;
                _this.currentTexture = null;
                _this.globalAlpha = 1;
                _this.globalTintColor = 0xFFFFFF;
                _this.stencilState = false;
                _this.$stencilList = [];
                _this.stencilHandleCount = 0;
                _this.$scissorState = false;
                _this.scissorRect = new egret.Rectangle();
                _this.$hasScissor = false;
                _this.$drawCalls = 0;
                _this.$computeDrawCall = false;
                _this.globalMatrix = new egret.Matrix();
                _this.savedGlobalMatrix = new egret.Matrix();
                _this.$offsetX = 0;
                _this.$offsetY = 0;
                _this.context = web.WebGLRenderContext.getInstance(width, height);
                if (egret.nativeRender) {
                    if (root) {
                        _this.surface = _this.context.surface;
                    }
                    else {
                        _this.surface = new egret_native.NativeRenderSurface(_this, width, height, root);
                    }
                    _this.rootRenderTarget = null;
                    return _this;
                }
                _this.rootRenderTarget = new web.WebGLRenderTarget(_this.context.context, 3, 3);
                if (width && height) {
                    _this.resize(width, height);
                }
                _this.root = root;
                if (_this.root) {
                    _this.context.pushBuffer(_this);
                    _this.surface = _this.context.surface;
                    _this.$computeDrawCall = true;
                }
                else {
                    var lastBuffer = _this.context.activatedBuffer;
                    if (lastBuffer) {
                        lastBuffer.rootRenderTarget.activate();
                    }
                    _this.rootRenderTarget.initFrameBuffer();
                    _this.surface = _this.rootRenderTarget;
                }
                return _this;
            }
            WebGLRenderBuffer.prototype.enableStencil = function () {
                if (!this.stencilState) {
                    this.context.enableStencilTest();
                    this.stencilState = true;
                }
            };
            WebGLRenderBuffer.prototype.disableStencil = function () {
                if (this.stencilState) {
                    this.context.disableStencilTest();
                    this.stencilState = false;
                }
            };
            WebGLRenderBuffer.prototype.restoreStencil = function () {
                if (this.stencilState) {
                    this.context.enableStencilTest();
                }
                else {
                    this.context.disableStencilTest();
                }
            };
            WebGLRenderBuffer.prototype.enableScissor = function (x, y, width, height) {
                if (!this.$scissorState) {
                    this.$scissorState = true;
                    this.scissorRect.setTo(x, y, width, height);
                    this.context.enableScissorTest(this.scissorRect);
                }
            };
            WebGLRenderBuffer.prototype.disableScissor = function () {
                if (this.$scissorState) {
                    this.$scissorState = false;
                    this.scissorRect.setEmpty();
                    this.context.disableScissorTest();
                }
            };
            WebGLRenderBuffer.prototype.restoreScissor = function () {
                if (this.$scissorState) {
                    this.context.enableScissorTest(this.scissorRect);
                }
                else {
                    this.context.disableScissorTest();
                }
            };
            Object.defineProperty(WebGLRenderBuffer.prototype, "width", {
                get: function () {
                    if (egret.nativeRender) {
                        return this.surface.width;
                    }
                    else {
                        return this.rootRenderTarget.width;
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(WebGLRenderBuffer.prototype, "height", {
                get: function () {
                    if (egret.nativeRender) {
                        return this.surface.height;
                    }
                    else {
                        return this.rootRenderTarget.height;
                    }
                },
                enumerable: true,
                configurable: true
            });
            WebGLRenderBuffer.prototype.resize = function (width, height, useMaxSize) {
                width = width || 1;
                height = height || 1;
                if (egret.nativeRender) {
                    this.surface.resize(width, height);
                    return;
                }
                this.context.pushBuffer(this);
                if (width != this.rootRenderTarget.width || height != this.rootRenderTarget.height) {
                    this.context.drawCmdManager.pushResize(this, width, height);
                    this.rootRenderTarget.width = width;
                    this.rootRenderTarget.height = height;
                }
                if (this.root) {
                    this.context.resize(width, height, useMaxSize);
                }
                this.context.clear();
                this.context.popBuffer();
            };
            WebGLRenderBuffer.prototype.getPixels = function (x, y, width, height) {
                if (width === void 0) { width = 1; }
                if (height === void 0) { height = 1; }
                var pixels = new Uint8Array(4 * width * height);
                if (egret.nativeRender) {
                    egret_native.activateBuffer(this);
                    egret_native.nrGetPixels(x, y, width, height, pixels);
                    egret_native.activateBuffer(null);
                }
                else {
                    var useFrameBuffer = this.rootRenderTarget.useFrameBuffer;
                    this.rootRenderTarget.useFrameBuffer = true;
                    this.rootRenderTarget.activate();
                    this.context.getPixels(x, y, width, height, pixels);
                    this.rootRenderTarget.useFrameBuffer = useFrameBuffer;
                    this.rootRenderTarget.activate();
                }
                var result = new Uint8Array(4 * width * height);
                for (var i = 0; i < height; i++) {
                    for (var j = 0; j < width; j++) {
                        var index1 = (width * (height - i - 1) + j) * 4;
                        var index2 = (width * i + j) * 4;
                        var a = pixels[index2 + 3];
                        result[index1] = Math.round(pixels[index2] / a * 255);
                        result[index1 + 1] = Math.round(pixels[index2 + 1] / a * 255);
                        result[index1 + 2] = Math.round(pixels[index2 + 2] / a * 255);
                        result[index1 + 3] = pixels[index2 + 3];
                    }
                }
                return result;
            };
            WebGLRenderBuffer.prototype.toDataURL = function (type, encoderOptions) {
                return this.context.surface.toDataURL(type, encoderOptions);
            };
            WebGLRenderBuffer.prototype.destroy = function () {
                this.context.destroy();
            };
            WebGLRenderBuffer.prototype.onRenderFinish = function () {
                this.$drawCalls = 0;
            };
            WebGLRenderBuffer.prototype.drawFrameBufferToSurface = function (sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight, clear) {
                if (clear === void 0) { clear = false; }
                this.rootRenderTarget.useFrameBuffer = false;
                this.rootRenderTarget.activate();
                this.context.disableStencilTest();
                this.context.disableScissorTest();
                this.setTransform(1, 0, 0, 1, 0, 0);
                this.globalAlpha = 1;
                this.context.setGlobalCompositeOperation("source-over");
                clear && this.context.clear();
                this.context.drawImage(this.rootRenderTarget, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight, sourceWidth, sourceHeight, false);
                this.context.$drawWebGL();
                this.rootRenderTarget.useFrameBuffer = true;
                this.rootRenderTarget.activate();
                this.restoreStencil();
                this.restoreScissor();
            };
            WebGLRenderBuffer.prototype.drawSurfaceToFrameBuffer = function (sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight, clear) {
                if (clear === void 0) { clear = false; }
                this.rootRenderTarget.useFrameBuffer = true;
                this.rootRenderTarget.activate();
                this.context.disableStencilTest();
                this.context.disableScissorTest();
                this.setTransform(1, 0, 0, 1, 0, 0);
                this.globalAlpha = 1;
                this.context.setGlobalCompositeOperation("source-over");
                clear && this.context.clear();
                this.context.drawImage(this.context.surface, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight, sourceWidth, sourceHeight, false);
                this.context.$drawWebGL();
                this.rootRenderTarget.useFrameBuffer = false;
                this.rootRenderTarget.activate();
                this.restoreStencil();
                this.restoreScissor();
            };
            WebGLRenderBuffer.prototype.clear = function () {
                this.context.pushBuffer(this);
                this.context.clear();
                this.context.popBuffer();
            };
            WebGLRenderBuffer.prototype.setTransform = function (a, b, c, d, tx, ty) {
                var matrix = this.globalMatrix;
                matrix.a = a;
                matrix.b = b;
                matrix.c = c;
                matrix.d = d;
                matrix.tx = tx;
                matrix.ty = ty;
            };
            WebGLRenderBuffer.prototype.transform = function (a, b, c, d, tx, ty) {
                var matrix = this.globalMatrix;
                var a1 = matrix.a;
                var b1 = matrix.b;
                var c1 = matrix.c;
                var d1 = matrix.d;
                if (a != 1 || b != 0 || c != 0 || d != 1) {
                    matrix.a = a * a1 + b * c1;
                    matrix.b = a * b1 + b * d1;
                    matrix.c = c * a1 + d * c1;
                    matrix.d = c * b1 + d * d1;
                }
                matrix.tx = tx * a1 + ty * c1 + matrix.tx;
                matrix.ty = tx * b1 + ty * d1 + matrix.ty;
            };
            WebGLRenderBuffer.prototype.useOffset = function () {
                var self = this;
                if (self.$offsetX != 0 || self.$offsetY != 0) {
                    self.globalMatrix.append(1, 0, 0, 1, self.$offsetX, self.$offsetY);
                    self.$offsetX = self.$offsetY = 0;
                }
            };
            WebGLRenderBuffer.prototype.saveTransform = function () {
                var matrix = this.globalMatrix;
                var sMatrix = this.savedGlobalMatrix;
                sMatrix.a = matrix.a;
                sMatrix.b = matrix.b;
                sMatrix.c = matrix.c;
                sMatrix.d = matrix.d;
                sMatrix.tx = matrix.tx;
                sMatrix.ty = matrix.ty;
            };
            WebGLRenderBuffer.prototype.restoreTransform = function () {
                var matrix = this.globalMatrix;
                var sMatrix = this.savedGlobalMatrix;
                matrix.a = sMatrix.a;
                matrix.b = sMatrix.b;
                matrix.c = sMatrix.c;
                matrix.d = sMatrix.d;
                matrix.tx = sMatrix.tx;
                matrix.ty = sMatrix.ty;
            };
            WebGLRenderBuffer.create = function (width, height) {
                var buffer = renderBufferPool.pop();
                if (buffer) {
                    buffer.resize(width, height);
                    var matrix = buffer.globalMatrix;
                    matrix.a = 1;
                    matrix.b = 0;
                    matrix.c = 0;
                    matrix.d = 1;
                    matrix.tx = 0;
                    matrix.ty = 0;
                    buffer.globalAlpha = 1;
                    buffer.$offsetX = 0;
                    buffer.$offsetY = 0;
                }
                else {
                    buffer = new WebGLRenderBuffer(width, height);
                    buffer.$computeDrawCall = false;
                }
                return buffer;
            };
            WebGLRenderBuffer.release = function (buffer) {
                renderBufferPool.push(buffer);
            };
            WebGLRenderBuffer.autoClear = true;
            return WebGLRenderBuffer;
        }(egret.HashObject));
        web.WebGLRenderBuffer = WebGLRenderBuffer;
        var renderBufferPool = [];
    })(web = egret.web || (egret.web = {}));
})(egret || (egret = {}));
var egret;
(function (egret) {
    var web;
    (function (web) {
        function loadShader(gl, type, source) {
            var shader = gl.createShader(type);
            gl.shaderSource(shader, source);
            gl.compileShader(shader);
            var compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
            if (!compiled) {
                console.log("Shader not compiled!");
                console.log(gl.getShaderInfoLog(shader));
            }
            return shader;
        }
        function createWebGLProgram(gl, vertexShader, fragmentShader) {
            var program = gl.createProgram();
            gl.attachShader(program, vertexShader);
            gl.attachShader(program, fragmentShader);
            gl.linkProgram(program);
            return program;
        }
        function extractAttributes(gl, program) {
            var attributes = {};
            var totalAttributes = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);
            for (var i = 0; i < totalAttributes; i++) {
                var attribData = gl.getActiveAttrib(program, i);
                var name_2 = attribData.name;
                var attribute = new web.EgretWebGLAttribute(gl, program, attribData);
                attributes[name_2] = attribute;
            }
            return attributes;
        }
        function extractUniforms(gl, program) {
            var uniforms = {};
            var totalUniforms = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
            for (var i = 0; i < totalUniforms; i++) {
                var uniformData = gl.getActiveUniform(program, i);
                var name_3 = uniformData.name;
                var uniform = new web.EgretWebGLUniform(gl, program, uniformData);
                uniforms[name_3] = uniform;
            }
            return uniforms;
        }
        var EgretWebGLProgram = (function () {
            function EgretWebGLProgram(gl, vertSource, fragSource) {
                this.vshaderSource = vertSource;
                this.fshaderSource = fragSource;
                this.vertexShader = loadShader(gl, gl.VERTEX_SHADER, this.vshaderSource);
                this.fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, this.fshaderSource);
                this.id = createWebGLProgram(gl, this.vertexShader, this.fragmentShader);
                this.uniforms = extractUniforms(gl, this.id);
                this.attributes = extractAttributes(gl, this.id);
            }
            EgretWebGLProgram.getProgram = function (gl, vertSource, fragSource, key) {
                if (!this.programCache[key]) {
                    this.programCache[key] = new EgretWebGLProgram(gl, vertSource, fragSource);
                }
                return this.programCache[key];
            };
            EgretWebGLProgram.deleteProgram = function (gl, vertSource, fragSource, key) {
            };
            EgretWebGLProgram.programCache = {};
            return EgretWebGLProgram;
        }());
        web.EgretWebGLProgram = EgretWebGLProgram;
    })(web = egret.web || (egret.web = {}));
})(egret || (egret = {}));
var egret;
(function (egret) {
    var web;
    (function (web) {
        var EgretShaderLib = (function () {
            function EgretShaderLib() {
            }
            EgretShaderLib.blur_frag = "precision mediump float;\r\nuniform vec2 blur;\r\nuniform sampler2D uSampler;\r\nvarying vec2 vTextureCoord;\r\nuniform vec2 uTextureSize;\r\nvoid main()\r\n{\r\n    const int sampleRadius = 5;\r\n    const int samples = sampleRadius * 2 + 1;\r\n    vec2 blurUv = blur / uTextureSize;\r\n    vec4 color = vec4(0, 0, 0, 0);\r\n    vec2 uv = vec2(0.0, 0.0);\r\n    blurUv /= float(sampleRadius);\r\n\r\n    for (int i = -sampleRadius; i <= sampleRadius; i++) {\r\n        uv.x = vTextureCoord.x + float(i) * blurUv.x;\r\n        uv.y = vTextureCoord.y + float(i) * blurUv.y;\r\n        color += texture2D(uSampler, uv);\r\n    }\r\n\r\n    color /= float(samples);\r\n    gl_FragColor = color;\r\n}";
            EgretShaderLib.colorTransform_frag = "precision mediump float;\r\nvarying vec2 vTextureCoord;\r\nvarying vec4 vColor;\r\nuniform mat4 matrix;\r\nuniform vec4 colorAdd;\r\nuniform sampler2D uSampler;\r\n\r\nvoid main(void) {\r\n    vec4 texColor = texture2D(uSampler, vTextureCoord);\r\n    if(texColor.a > 0.) {\r\n        // Offset pre-multiplied alpha channel\r\n        texColor = vec4(texColor.rgb / texColor.a, texColor.a);\r\n    }\r\n    vec4 locColor = clamp(texColor * matrix + colorAdd, 0., 1.);\r\n    gl_FragColor = vColor * vec4(locColor.rgb * locColor.a, locColor.a);\r\n}";
            EgretShaderLib.default_vert = "attribute vec2 aVertexPosition;\r\nattribute vec2 aTextureCoord;\r\nattribute vec4 aColor;\r\n\r\nuniform vec2 projectionVector;\r\n// uniform vec2 offsetVector;\r\n\r\nvarying vec2 vTextureCoord;\r\nvarying vec4 vColor;\r\n\r\nconst vec2 center = vec2(-1.0, 1.0);\r\n\r\nvoid main(void) {\r\n   gl_Position = vec4( (aVertexPosition / projectionVector) + center , 0.0, 1.0);\r\n   vTextureCoord = aTextureCoord;\r\n   vColor = aColor;\r\n}";
            EgretShaderLib.glow_frag = "precision highp float;\r\nvarying vec2 vTextureCoord;\r\n\r\nuniform sampler2D uSampler;\r\n\r\nuniform float dist;\r\nuniform float angle;\r\nuniform vec4 color;\r\nuniform float alpha;\r\nuniform float blurX;\r\nuniform float blurY;\r\n// uniform vec4 quality;\r\nuniform float strength;\r\nuniform float inner;\r\nuniform float knockout;\r\nuniform float hideObject;\r\n\r\nuniform vec2 uTextureSize;\r\n\r\nfloat random(vec2 scale)\r\n{\r\n    return fract(sin(dot(gl_FragCoord.xy, scale)) * 43758.5453);\r\n}\r\n\r\nvoid main(void) {\r\n    vec2 px = vec2(1.0 / uTextureSize.x, 1.0 / uTextureSize.y);\r\n    // TODO 自动调节采样次数？\r\n    const float linearSamplingTimes = 7.0;\r\n    const float circleSamplingTimes = 12.0;\r\n    vec4 ownColor = texture2D(uSampler, vTextureCoord);\r\n    vec4 curColor;\r\n    float totalAlpha = 0.0;\r\n    float maxTotalAlpha = 0.0;\r\n    float curDistanceX = 0.0;\r\n    float curDistanceY = 0.0;\r\n    float offsetX = dist * cos(angle) * px.x;\r\n    float offsetY = dist * sin(angle) * px.y;\r\n\r\n    const float PI = 3.14159265358979323846264;\r\n    float cosAngle;\r\n    float sinAngle;\r\n    float offset = PI * 2.0 / circleSamplingTimes * random(vec2(12.9898, 78.233));\r\n    float stepX = blurX * px.x / linearSamplingTimes;\r\n    float stepY = blurY * px.y / linearSamplingTimes;\r\n    for (float a = 0.0; a <= PI * 2.0; a += PI * 2.0 / circleSamplingTimes) {\r\n        cosAngle = cos(a + offset);\r\n        sinAngle = sin(a + offset);\r\n        for (float i = 1.0; i <= linearSamplingTimes; i++) {\r\n            curDistanceX = i * stepX * cosAngle;\r\n            curDistanceY = i * stepY * sinAngle;\r\n            if (vTextureCoord.x + curDistanceX - offsetX >= 0.0 && vTextureCoord.y + curDistanceY + offsetY <= 1.0){\r\n                curColor = texture2D(uSampler, vec2(vTextureCoord.x + curDistanceX - offsetX, vTextureCoord.y + curDistanceY + offsetY));\r\n                totalAlpha += (linearSamplingTimes - i) * curColor.a;\r\n            }\r\n            maxTotalAlpha += (linearSamplingTimes - i);\r\n        }\r\n    }\r\n\r\n    ownColor.a = max(ownColor.a, 0.0001);\r\n    ownColor.rgb = ownColor.rgb / ownColor.a;\r\n\r\n    float outerGlowAlpha = (totalAlpha / maxTotalAlpha) * strength * alpha * (1. - inner) * max(min(hideObject, knockout), 1. - ownColor.a);\r\n    float innerGlowAlpha = ((maxTotalAlpha - totalAlpha) / maxTotalAlpha) * strength * alpha * inner * ownColor.a;\r\n\r\n    ownColor.a = max(ownColor.a * knockout * (1. - hideObject), 0.0001);\r\n    vec3 mix1 = mix(ownColor.rgb, color.rgb, innerGlowAlpha / (innerGlowAlpha + ownColor.a));\r\n    vec3 mix2 = mix(mix1, color.rgb, outerGlowAlpha / (innerGlowAlpha + ownColor.a + outerGlowAlpha));\r\n    float resultAlpha = min(ownColor.a + outerGlowAlpha + innerGlowAlpha, 1.);\r\n    gl_FragColor = vec4(mix2 * resultAlpha, resultAlpha);\r\n}";
            EgretShaderLib.primitive_frag = "precision lowp float;\r\nvarying vec2 vTextureCoord;\r\nvarying vec4 vColor;\r\n\r\nvoid main(void) {\r\n    gl_FragColor = vColor;\r\n}";
            EgretShaderLib.texture_frag = "precision lowp float;\r\nvarying vec2 vTextureCoord;\r\nvarying vec4 vColor;\r\nuniform sampler2D uSampler;\r\n\r\nvoid main(void) {\r\n    gl_FragColor = texture2D(uSampler, vTextureCoord) * vColor;\r\n}";
            EgretShaderLib.texture_etc_alphamask_frag = "precision lowp float;\r\nvarying vec2 vTextureCoord;\r\nvarying vec4 vColor;\r\nuniform sampler2D uSampler;\r\nuniform sampler2D uSamplerAlphaMask;\r\nvoid main(void) {\r\nfloat alpha = texture2D(uSamplerAlphaMask, vTextureCoord).r;\r\nif (alpha < 0.0039) { discard; }\r\nvec4 v4Color = texture2D(uSampler, vTextureCoord);\r\nv4Color.rgb = v4Color.rgb * alpha;\r\nv4Color.a = alpha;\r\ngl_FragColor = v4Color * vColor;\r\n}";
            EgretShaderLib.colorTransform_frag_etc_alphamask_frag = "precision mediump float;\r\nvarying vec2 vTextureCoord;\r\nvarying vec4 vColor;\r\nuniform mat4 matrix;\r\nuniform vec4 colorAdd;\r\nuniform sampler2D uSampler;\r\nuniform sampler2D uSamplerAlphaMask;\r\n\r\nvoid main(void){\r\nfloat alpha = texture2D(uSamplerAlphaMask, vTextureCoord).r;\r\nif (alpha < 0.0039) { discard; }\r\nvec4 texColor = texture2D(uSampler, vTextureCoord);\r\nif(texColor.a > 0.0) {\r\n // Offset pre-multiplied alpha channel\r\ntexColor = vec4(texColor.rgb / texColor.a, texColor.a);\r\n}\r\nvec4 v4Color = clamp(texColor * matrix + colorAdd, 0.0, 1.0);\r\nv4Color.rgb = v4Color.rgb * alpha;\r\nv4Color.a = alpha;\r\ngl_FragColor = v4Color * vColor;\r\n}";
            return EgretShaderLib;
        }());
        web.EgretShaderLib = EgretShaderLib;
    })(web = egret.web || (egret.web = {}));
})(egret || (egret = {}));
;
var egret;
(function (egret) {
    var web;
    (function (web) {
        var debugLogCompressedTextureNotSupported = {};
        var WebGLRenderContext = (function () {
            function WebGLRenderContext(width, height, context) {
                this._defaultEmptyTexture = null;
                this.glID = null;
                this.projectionX = NaN;
                this.projectionY = NaN;
                this.contextLost = false;
                this._supportedCompressedTextureInfo = [];
                this.$scissorState = false;
                this.vertSize = 5;
                this.$beforeRender = function () {
                    var gl = this.context;
                    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
                    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
                    gl.disable(gl.DEPTH_TEST);
                    gl.disable(gl.CULL_FACE);
                    gl.enable(gl.BLEND);
                    gl.disable(gl.STENCIL_TEST);
                    gl.colorMask(true, true, true, true);
                    this.setBlendMode("source-over");
                    gl.activeTexture(gl.TEXTURE0);
                    this.currentProgram = null;
                };
                this.surface = egret.sys.mainCanvas(width, height);
                if (egret.nativeRender) {
                    return;
                }
                this.initWebGL(context);
                this.getSupportedCompressedTexture();
                this.$bufferStack = [];
                var gl = this.context;
                this.vertexBuffer = gl.createBuffer();
                this.indexBuffer = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
                this.drawCmdManager = new web.WebGLDrawCmdManager();
                this.vao = new web.WebGLVertexArrayObject();
                this.setGlobalCompositeOperation("source-over");
            }
            WebGLRenderContext.getInstance = function (width, height, context) {
                if (this.instance) {
                    return this.instance;
                }
                this.instance = new WebGLRenderContext(width, height, context);
                return this.instance;
            };
            WebGLRenderContext.prototype.pushBuffer = function (buffer) {
                this.$bufferStack.push(buffer);
                if (buffer != this.currentBuffer) {
                    if (this.currentBuffer) {
                    }
                    this.drawCmdManager.pushActivateBuffer(buffer);
                }
                this.currentBuffer = buffer;
            };
            WebGLRenderContext.prototype.popBuffer = function () {
                if (this.$bufferStack.length <= 1) {
                    return;
                }
                var buffer = this.$bufferStack.pop();
                var lastBuffer = this.$bufferStack[this.$bufferStack.length - 1];
                if (buffer != lastBuffer) {
                    this.drawCmdManager.pushActivateBuffer(lastBuffer);
                }
                this.currentBuffer = lastBuffer;
            };
            WebGLRenderContext.prototype.activateBuffer = function (buffer, width, height) {
                buffer.rootRenderTarget.activate();
                if (!this.bindIndices) {
                    this.uploadIndicesArray(this.vao.getIndices());
                }
                buffer.restoreStencil();
                buffer.restoreScissor();
                this.onResize(width, height);
            };
            WebGLRenderContext.prototype.uploadVerticesArray = function (array) {
                var gl = this.context;
                gl.bufferData(gl.ARRAY_BUFFER, array, gl.STREAM_DRAW);
            };
            WebGLRenderContext.prototype.uploadIndicesArray = function (array) {
                var gl = this.context;
                gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, array, gl.STATIC_DRAW);
                this.bindIndices = true;
            };
            WebGLRenderContext.prototype.destroy = function () {
                this.surface.width = this.surface.height = 0;
            };
            WebGLRenderContext.prototype.onResize = function (width, height) {
                width = width || this.surface.width;
                height = height || this.surface.height;
                this.projectionX = width / 2;
                this.projectionY = -height / 2;
                if (this.context) {
                    this.context.viewport(0, 0, width, height);
                }
            };
            WebGLRenderContext.prototype.resize = function (width, height, useMaxSize) {
                egret.sys.resizeContext(this, width, height, useMaxSize);
            };
            WebGLRenderContext.prototype._buildSupportedCompressedTextureInfo = function (extensions) {
                var returnValue = [];
                for (var _i = 0, extensions_1 = extensions; _i < extensions_1.length; _i++) {
                    var extension = extensions_1[_i];
                    if (!extension) {
                        continue;
                    }
                    var info = {
                        extensionName: extension.name,
                        supportedFormats: []
                    };
                    for (var key in extension) {
                        info.supportedFormats.push([key, extension[key]]);
                    }
                    returnValue.push(info);
                }
                return returnValue;
            };
            WebGLRenderContext.prototype.initWebGL = function (context) {
                this.onResize();
                this.surface.addEventListener("webglcontextlost", this.handleContextLost.bind(this), false);
                this.surface.addEventListener("webglcontextrestored", this.handleContextRestored.bind(this), false);
                context ? this.setContext(context) : this.getWebGLContext();
                var gl = this.context;
                this.$maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
            };
            WebGLRenderContext.prototype.getSupportedCompressedTexture = function () {
                var gl = this.context ? this.context : egret.sys.getContextWebGL(this.surface);
                this.pvrtc = gl.getExtension('WEBGL_compressed_texture_pvrtc') || gl.getExtension('WEBKIT_WEBGL_compressed_texture_pvrtc');
                if (this.pvrtc) {
                    this.pvrtc.name = 'WEBGL_compressed_texture_pvrtc';
                }
                this.etc1 = gl.getExtension('WEBGL_compressed_texture_etc1') || gl.getExtension('WEBKIT_WEBGL_compressed_texture_etc1');
                if (this.etc1) {
                    this.etc1.name = 'WEBGL_compressed_texture_etc1';
                }
                egret.Capabilities.supportedCompressedTexture = egret.Capabilities.supportedCompressedTexture || {};
                egret.Capabilities.supportedCompressedTexture.pvrtc = !!this.pvrtc;
                egret.Capabilities.supportedCompressedTexture.etc1 = !!this.etc1;
                this._supportedCompressedTextureInfo = this._buildSupportedCompressedTextureInfo([this.etc1, this.pvrtc]);
            };
            WebGLRenderContext.prototype.handleContextLost = function () {
                this.contextLost = true;
            };
            WebGLRenderContext.prototype.handleContextRestored = function () {
                this.initWebGL();
                this.contextLost = false;
            };
            WebGLRenderContext.prototype.getWebGLContext = function () {
                var gl = egret.sys.getContextWebGL(this.surface);
                this.setContext(gl);
                return gl;
            };
            WebGLRenderContext.prototype.setContext = function (gl) {
                this.context = gl;
                gl.id = WebGLRenderContext.glContextId++;
                this.glID = gl.id;
                gl.disable(gl.DEPTH_TEST);
                gl.disable(gl.CULL_FACE);
                gl.enable(gl.BLEND);
                gl.colorMask(true, true, true, true);
                gl.activeTexture(gl.TEXTURE0);
            };
            WebGLRenderContext.prototype.enableStencilTest = function () {
                var gl = this.context;
                gl.enable(gl.STENCIL_TEST);
            };
            WebGLRenderContext.prototype.disableStencilTest = function () {
                var gl = this.context;
                gl.disable(gl.STENCIL_TEST);
            };
            WebGLRenderContext.prototype.enableScissorTest = function (rect) {
                var gl = this.context;
                gl.enable(gl.SCISSOR_TEST);
                gl.scissor(rect.x, rect.y, rect.width, rect.height);
            };
            WebGLRenderContext.prototype.disableScissorTest = function () {
                var gl = this.context;
                gl.disable(gl.SCISSOR_TEST);
            };
            WebGLRenderContext.prototype.getPixels = function (x, y, width, height, pixels) {
                var gl = this.context;
                gl.readPixels(x, y, width, height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
            };
            WebGLRenderContext.prototype.createTexture = function (bitmapData) {
                return egret.sys.createTexture(this, bitmapData);
            };
            WebGLRenderContext.prototype.checkCompressedTextureInternalFormat = function (supportedCompressedTextureInfo, internalFormat) {
                for (var i = 0, length_7 = supportedCompressedTextureInfo.length; i < length_7; ++i) {
                    var ss = supportedCompressedTextureInfo[i];
                    var supportedFormats = ss.supportedFormats;
                    for (var j = 0, length_8 = supportedFormats.length; j < length_8; ++j) {
                        if (supportedFormats[j][1] === internalFormat) {
                            return true;
                        }
                    }
                }
                return false;
            };
            WebGLRenderContext.prototype.$debugLogCompressedTextureNotSupported = function (supportedCompressedTextureInfo, internalFormat) {
                if (!debugLogCompressedTextureNotSupported[internalFormat]) {
                    debugLogCompressedTextureNotSupported[internalFormat] = true;
                    egret.log('internalFormat = ' + internalFormat + ':' + ('0x' + internalFormat.toString(16)) + ', the current hardware does not support the corresponding compression format.');
                    for (var i = 0, length_9 = supportedCompressedTextureInfo.length; i < length_9; ++i) {
                        var ss = supportedCompressedTextureInfo[i];
                        if (ss.supportedFormats.length > 0) {
                            egret.log('support = ' + ss.extensionName);
                            for (var j = 0, length_10 = ss.supportedFormats.length; j < length_10; ++j) {
                                var tp = ss.supportedFormats[j];
                                egret.log(tp[0] + ' : ' + tp[1] + ' : ' + ('0x' + tp[1].toString(16)));
                            }
                        }
                    }
                }
            };
            WebGLRenderContext.prototype.createCompressedTexture = function (data, width, height, levels, internalFormat) {
                var checkSupported = this.checkCompressedTextureInternalFormat(this._supportedCompressedTextureInfo, internalFormat);
                if (!checkSupported) {
                    this.$debugLogCompressedTextureNotSupported(this._supportedCompressedTextureInfo, internalFormat);
                    return this.defaultEmptyTexture;
                }
                var gl = this.context;
                var texture = gl.createTexture();
                if (!texture) {
                    this.contextLost = true;
                    return;
                }
                texture[egret.glContext] = gl;
                texture[egret.is_compressed_texture] = true;
                gl.bindTexture(gl.TEXTURE_2D, texture);
                gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 1);
                texture[egret.UNPACK_PREMULTIPLY_ALPHA_WEBGL] = true;
                gl.compressedTexImage2D(gl.TEXTURE_2D, levels, internalFormat, width, height, 0, data);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                gl.bindTexture(gl.TEXTURE_2D, null);
                return texture;
            };
            WebGLRenderContext.prototype.updateTexture = function (texture, bitmapData) {
                var gl = this.context;
                gl.bindTexture(gl.TEXTURE_2D, texture);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, bitmapData);
            };
            Object.defineProperty(WebGLRenderContext.prototype, "defaultEmptyTexture", {
                get: function () {
                    if (!this._defaultEmptyTexture) {
                        var size = 16;
                        var canvas = egret.sys.createCanvas(size, size);
                        var context = egret.sys.getContext2d(canvas);
                        context.fillStyle = 'white';
                        context.fillRect(0, 0, size, size);
                        this._defaultEmptyTexture = this.createTexture(canvas);
                        this._defaultEmptyTexture[egret.engine_default_empty_texture] = true;
                    }
                    return this._defaultEmptyTexture;
                },
                enumerable: true,
                configurable: true
            });
            WebGLRenderContext.prototype.getWebGLTexture = function (bitmapData) {
                if (!bitmapData.webGLTexture) {
                    if (bitmapData.format == "image" && !bitmapData.hasCompressed2d()) {
                        bitmapData.webGLTexture = this.createTexture(bitmapData.source);
                    }
                    else if (bitmapData.hasCompressed2d()) {
                        var compressedData = bitmapData.getCompressed2dTextureData();
                        bitmapData.webGLTexture = this.createCompressedTexture(compressedData.byteArray, compressedData.width, compressedData.height, compressedData.level, compressedData.glInternalFormat);
                        var etcAlphaMask = bitmapData.etcAlphaMask;
                        if (etcAlphaMask) {
                            var maskTexture = this.getWebGLTexture(etcAlphaMask);
                            if (maskTexture) {
                                bitmapData.webGLTexture[egret.etc_alpha_mask] = maskTexture;
                            }
                        }
                    }
                    if (bitmapData.$deleteSource && bitmapData.webGLTexture) {
                        if (bitmapData.source) {
                            bitmapData.source.src = '';
                            bitmapData.source = null;
                        }
                        bitmapData.clearCompressedTextureData();
                    }
                    if (bitmapData.webGLTexture) {
                        bitmapData.webGLTexture["smoothing"] = true;
                    }
                }
                return bitmapData.webGLTexture;
            };
            WebGLRenderContext.prototype.clearRect = function (x, y, width, height) {
                if (x != 0 || y != 0 || width != this.surface.width || height != this.surface.height) {
                    var buffer = this.currentBuffer;
                    if (buffer.$hasScissor) {
                        this.setGlobalCompositeOperation("destination-out");
                        this.drawRect(x, y, width, height);
                        this.setGlobalCompositeOperation("source-over");
                    }
                    else {
                        var m = buffer.globalMatrix;
                        if (m.b == 0 && m.c == 0) {
                            x = x * m.a + m.tx;
                            y = y * m.d + m.ty;
                            width = width * m.a;
                            height = height * m.d;
                            this.enableScissor(x, -y - height + buffer.height, width, height);
                            this.clear();
                            this.disableScissor();
                        }
                        else {
                            this.setGlobalCompositeOperation("destination-out");
                            this.drawRect(x, y, width, height);
                            this.setGlobalCompositeOperation("source-over");
                        }
                    }
                }
                else {
                    this.clear();
                }
            };
            WebGLRenderContext.prototype.setGlobalCompositeOperation = function (value) {
                this.drawCmdManager.pushSetBlend(value);
            };
            WebGLRenderContext.prototype.drawImage = function (image, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight, imageSourceWidth, imageSourceHeight, rotated, smoothing) {
                var buffer = this.currentBuffer;
                if (this.contextLost || !image || !buffer) {
                    return;
                }
                var texture;
                var offsetX;
                var offsetY;
                if (image["texture"] || (image.source && image.source["texture"])) {
                    texture = image["texture"] || image.source["texture"];
                    buffer.saveTransform();
                    offsetX = buffer.$offsetX;
                    offsetY = buffer.$offsetY;
                    buffer.useOffset();
                    buffer.transform(1, 0, 0, -1, 0, destHeight + destY * 2);
                }
                else if (!image.source && !image.webGLTexture) {
                    return;
                }
                else {
                    texture = this.getWebGLTexture(image);
                }
                if (!texture) {
                    return;
                }
                this.drawTexture(texture, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight, imageSourceWidth, imageSourceHeight, undefined, undefined, undefined, undefined, rotated, smoothing);
                if (image.source && image.source["texture"]) {
                    buffer.$offsetX = offsetX;
                    buffer.$offsetY = offsetY;
                    buffer.restoreTransform();
                }
            };
            WebGLRenderContext.prototype.drawMesh = function (image, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight, imageSourceWidth, imageSourceHeight, meshUVs, meshVertices, meshIndices, bounds, rotated, smoothing) {
                var buffer = this.currentBuffer;
                if (this.contextLost || !image || !buffer) {
                    return;
                }
                var texture;
                var offsetX;
                var offsetY;
                if (image["texture"] || (image.source && image.source["texture"])) {
                    texture = image["texture"] || image.source["texture"];
                    buffer.saveTransform();
                    offsetX = buffer.$offsetX;
                    offsetY = buffer.$offsetY;
                    buffer.useOffset();
                    buffer.transform(1, 0, 0, -1, 0, destHeight + destY * 2);
                }
                else if (!image.source && !image.webGLTexture) {
                    return;
                }
                else {
                    texture = this.getWebGLTexture(image);
                }
                if (!texture) {
                    return;
                }
                this.drawTexture(texture, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight, imageSourceWidth, imageSourceHeight, meshUVs, meshVertices, meshIndices, bounds, rotated, smoothing);
                if (image["texture"] || (image.source && image.source["texture"])) {
                    buffer.$offsetX = offsetX;
                    buffer.$offsetY = offsetY;
                    buffer.restoreTransform();
                }
            };
            WebGLRenderContext.prototype.drawTexture = function (texture, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight, textureWidth, textureHeight, meshUVs, meshVertices, meshIndices, bounds, rotated, smoothing) {
                var buffer = this.currentBuffer;
                if (this.contextLost || !texture || !buffer) {
                    return;
                }
                if (meshVertices && meshIndices) {
                    if (this.vao.reachMaxSize(meshVertices.length / 2, meshIndices.length)) {
                        this.$drawWebGL();
                    }
                }
                else {
                    if (this.vao.reachMaxSize()) {
                        this.$drawWebGL();
                    }
                }
                if (smoothing != undefined && texture["smoothing"] != smoothing) {
                    this.drawCmdManager.pushChangeSmoothing(texture, smoothing);
                }
                if (meshUVs) {
                    this.vao.changeToMeshIndices();
                }
                var count = meshIndices ? meshIndices.length / 3 : 2;
                this.drawCmdManager.pushDrawTexture(texture, count, this.$filter, textureWidth, textureHeight);
                buffer.currentTexture = texture;
                this.vao.cacheArrays(buffer, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight, textureWidth, textureHeight, meshUVs, meshVertices, meshIndices, rotated);
            };
            WebGLRenderContext.prototype.drawRect = function (x, y, width, height) {
                var buffer = this.currentBuffer;
                if (this.contextLost || !buffer) {
                    return;
                }
                if (this.vao.reachMaxSize()) {
                    this.$drawWebGL();
                }
                this.drawCmdManager.pushDrawRect();
                buffer.currentTexture = null;
                this.vao.cacheArrays(buffer, 0, 0, width, height, x, y, width, height, width, height);
            };
            WebGLRenderContext.prototype.pushMask = function (x, y, width, height) {
                var buffer = this.currentBuffer;
                if (this.contextLost || !buffer) {
                    return;
                }
                buffer.$stencilList.push({ x: x, y: y, width: width, height: height });
                if (this.vao.reachMaxSize()) {
                    this.$drawWebGL();
                }
                this.drawCmdManager.pushPushMask();
                buffer.currentTexture = null;
                this.vao.cacheArrays(buffer, 0, 0, width, height, x, y, width, height, width, height);
            };
            WebGLRenderContext.prototype.popMask = function () {
                var buffer = this.currentBuffer;
                if (this.contextLost || !buffer) {
                    return;
                }
                var mask = buffer.$stencilList.pop();
                if (this.vao.reachMaxSize()) {
                    this.$drawWebGL();
                }
                this.drawCmdManager.pushPopMask();
                buffer.currentTexture = null;
                this.vao.cacheArrays(buffer, 0, 0, mask.width, mask.height, mask.x, mask.y, mask.width, mask.height, mask.width, mask.height);
            };
            WebGLRenderContext.prototype.clear = function () {
                this.drawCmdManager.pushClearColor();
            };
            WebGLRenderContext.prototype.enableScissor = function (x, y, width, height) {
                var buffer = this.currentBuffer;
                this.drawCmdManager.pushEnableScissor(x, y, width, height);
                buffer.$hasScissor = true;
            };
            WebGLRenderContext.prototype.disableScissor = function () {
                var buffer = this.currentBuffer;
                this.drawCmdManager.pushDisableScissor();
                buffer.$hasScissor = false;
            };
            WebGLRenderContext.prototype.$drawWebGL = function () {
                if (this.drawCmdManager.drawDataLen == 0 || this.contextLost) {
                    return;
                }
                this.uploadVerticesArray(this.vao.getVertices());
                if (this.vao.isMesh()) {
                    this.uploadIndicesArray(this.vao.getMeshIndices());
                }
                var length = this.drawCmdManager.drawDataLen;
                var offset = 0;
                for (var i = 0; i < length; i++) {
                    var data = this.drawCmdManager.drawData[i];
                    offset = this.drawData(data, offset);
                    if (data.type == 7) {
                        this.activatedBuffer = data.buffer;
                    }
                    if (data.type == 0 || data.type == 1 || data.type == 2 || data.type == 3) {
                        if (this.activatedBuffer && this.activatedBuffer.$computeDrawCall) {
                            this.activatedBuffer.$drawCalls++;
                        }
                    }
                }
                if (this.vao.isMesh()) {
                    this.uploadIndicesArray(this.vao.getIndices());
                }
                this.drawCmdManager.clear();
                this.vao.clear();
            };
            WebGLRenderContext.prototype.drawData = function (data, offset) {
                if (!data) {
                    return;
                }
                var gl = this.context;
                var program;
                var filter = data.filter;
                switch (data.type) {
                    case 0:
                        if (filter) {
                            if (filter.type === "custom") {
                                program = web.EgretWebGLProgram.getProgram(gl, filter.$vertexSrc, filter.$fragmentSrc, filter.$shaderKey);
                            }
                            else if (filter.type === "colorTransform") {
                                if (data.texture[egret.etc_alpha_mask]) {
                                    gl.activeTexture(gl.TEXTURE1);
                                    gl.bindTexture(gl.TEXTURE_2D, data.texture[egret.etc_alpha_mask]);
                                    program = web.EgretWebGLProgram.getProgram(gl, web.EgretShaderLib.default_vert, web.EgretShaderLib.colorTransform_frag_etc_alphamask_frag, "colorTransform_frag_etc_alphamask_frag");
                                }
                                else {
                                    program = web.EgretWebGLProgram.getProgram(gl, web.EgretShaderLib.default_vert, web.EgretShaderLib.colorTransform_frag, "colorTransform");
                                }
                            }
                            else if (filter.type === "blurX") {
                                program = web.EgretWebGLProgram.getProgram(gl, web.EgretShaderLib.default_vert, web.EgretShaderLib.blur_frag, "blur");
                            }
                            else if (filter.type === "blurY") {
                                program = web.EgretWebGLProgram.getProgram(gl, web.EgretShaderLib.default_vert, web.EgretShaderLib.blur_frag, "blur");
                            }
                            else if (filter.type === "glow") {
                                program = web.EgretWebGLProgram.getProgram(gl, web.EgretShaderLib.default_vert, web.EgretShaderLib.glow_frag, "glow");
                            }
                        }
                        else {
                            if (data.texture[egret.etc_alpha_mask]) {
                                program = web.EgretWebGLProgram.getProgram(gl, web.EgretShaderLib.default_vert, web.EgretShaderLib.texture_etc_alphamask_frag, egret.etc_alpha_mask);
                                gl.activeTexture(gl.TEXTURE1);
                                gl.bindTexture(gl.TEXTURE_2D, data.texture[egret.etc_alpha_mask]);
                            }
                            else {
                                program = web.EgretWebGLProgram.getProgram(gl, web.EgretShaderLib.default_vert, web.EgretShaderLib.texture_frag, "texture");
                            }
                        }
                        this.activeProgram(gl, program);
                        this.syncUniforms(program, filter, data.textureWidth, data.textureHeight);
                        offset += this.drawTextureElements(data, offset);
                        break;
                    case 1:
                        program = web.EgretWebGLProgram.getProgram(gl, web.EgretShaderLib.default_vert, web.EgretShaderLib.primitive_frag, "primitive");
                        this.activeProgram(gl, program);
                        this.syncUniforms(program, filter, data.textureWidth, data.textureHeight);
                        offset += this.drawRectElements(data, offset);
                        break;
                    case 2:
                        program = web.EgretWebGLProgram.getProgram(gl, web.EgretShaderLib.default_vert, web.EgretShaderLib.primitive_frag, "primitive");
                        this.activeProgram(gl, program);
                        this.syncUniforms(program, filter, data.textureWidth, data.textureHeight);
                        offset += this.drawPushMaskElements(data, offset);
                        break;
                    case 3:
                        program = web.EgretWebGLProgram.getProgram(gl, web.EgretShaderLib.default_vert, web.EgretShaderLib.primitive_frag, "primitive");
                        this.activeProgram(gl, program);
                        this.syncUniforms(program, filter, data.textureWidth, data.textureHeight);
                        offset += this.drawPopMaskElements(data, offset);
                        break;
                    case 4:
                        this.setBlendMode(data.value);
                        break;
                    case 5:
                        data.buffer.rootRenderTarget.resize(data.width, data.height);
                        this.onResize(data.width, data.height);
                        break;
                    case 6:
                        if (this.activatedBuffer) {
                            var target = this.activatedBuffer.rootRenderTarget;
                            if (target.width != 0 || target.height != 0) {
                                target.clear(true);
                            }
                        }
                        break;
                    case 7:
                        this.activateBuffer(data.buffer, data.width, data.height);
                        break;
                    case 8:
                        var buffer = this.activatedBuffer;
                        if (buffer) {
                            if (buffer.rootRenderTarget) {
                                buffer.rootRenderTarget.enabledStencil();
                            }
                            buffer.enableScissor(data.x, data.y, data.width, data.height);
                        }
                        break;
                    case 9:
                        buffer = this.activatedBuffer;
                        if (buffer) {
                            buffer.disableScissor();
                        }
                        break;
                    case 10:
                        gl.bindTexture(gl.TEXTURE_2D, data.texture);
                        if (data.smoothing) {
                            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                        }
                        else {
                            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
                            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
                        }
                        break;
                    default:
                        break;
                }
                return offset;
            };
            WebGLRenderContext.prototype.activeProgram = function (gl, program) {
                if (program != this.currentProgram) {
                    gl.useProgram(program.id);
                    var attribute = program.attributes;
                    for (var key in attribute) {
                        if (key === "aVertexPosition") {
                            gl.vertexAttribPointer(attribute["aVertexPosition"].location, 2, gl.FLOAT, false, 5 * 4, 0);
                            gl.enableVertexAttribArray(attribute["aVertexPosition"].location);
                        }
                        else if (key === "aTextureCoord") {
                            gl.vertexAttribPointer(attribute["aTextureCoord"].location, 2, gl.FLOAT, false, 5 * 4, 2 * 4);
                            gl.enableVertexAttribArray(attribute["aTextureCoord"].location);
                        }
                        else if (key === "aColor") {
                            gl.vertexAttribPointer(attribute["aColor"].location, 4, gl.UNSIGNED_BYTE, true, 5 * 4, 4 * 4);
                            gl.enableVertexAttribArray(attribute["aColor"].location);
                        }
                    }
                    this.currentProgram = program;
                }
            };
            WebGLRenderContext.prototype.syncUniforms = function (program, filter, textureWidth, textureHeight) {
                var uniforms = program.uniforms;
                var isCustomFilter = filter && filter.type === "custom";
                for (var key in uniforms) {
                    if (key === "projectionVector") {
                        uniforms[key].setValue({ x: this.projectionX, y: this.projectionY });
                    }
                    else if (key === "uTextureSize") {
                        uniforms[key].setValue({ x: textureWidth, y: textureHeight });
                    }
                    else if (key === "uSampler") {
                        uniforms[key].setValue(0);
                    }
                    else if (key === "uSamplerAlphaMask") {
                        uniforms[key].setValue(1);
                    }
                    else {
                        var value = filter.$uniforms[key];
                        if (value !== undefined) {
                            uniforms[key].setValue(value);
                        }
                        else {
                        }
                    }
                }
            };
            WebGLRenderContext.prototype.drawTextureElements = function (data, offset) {
                return egret.sys.drawTextureElements(this, data, offset);
            };
            WebGLRenderContext.prototype.drawRectElements = function (data, offset) {
                var gl = this.context;
                var size = data.count * 3;
                gl.drawElements(gl.TRIANGLES, size, gl.UNSIGNED_SHORT, offset * 2);
                return size;
            };
            WebGLRenderContext.prototype.drawPushMaskElements = function (data, offset) {
                var gl = this.context;
                var size = data.count * 3;
                var buffer = this.activatedBuffer;
                if (buffer) {
                    if (buffer.rootRenderTarget) {
                        buffer.rootRenderTarget.enabledStencil();
                    }
                    if (buffer.stencilHandleCount == 0) {
                        buffer.enableStencil();
                        gl.clear(gl.STENCIL_BUFFER_BIT);
                    }
                    var level = buffer.stencilHandleCount;
                    buffer.stencilHandleCount++;
                    gl.colorMask(false, false, false, false);
                    gl.stencilFunc(gl.EQUAL, level, 0xFF);
                    gl.stencilOp(gl.KEEP, gl.KEEP, gl.INCR);
                    gl.drawElements(gl.TRIANGLES, size, gl.UNSIGNED_SHORT, offset * 2);
                    gl.stencilFunc(gl.EQUAL, level + 1, 0xFF);
                    gl.colorMask(true, true, true, true);
                    gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);
                }
                return size;
            };
            WebGLRenderContext.prototype.drawPopMaskElements = function (data, offset) {
                var gl = this.context;
                var size = data.count * 3;
                var buffer = this.activatedBuffer;
                if (buffer) {
                    buffer.stencilHandleCount--;
                    if (buffer.stencilHandleCount == 0) {
                        buffer.disableStencil();
                    }
                    else {
                        var level = buffer.stencilHandleCount;
                        gl.colorMask(false, false, false, false);
                        gl.stencilFunc(gl.EQUAL, level + 1, 0xFF);
                        gl.stencilOp(gl.KEEP, gl.KEEP, gl.DECR);
                        gl.drawElements(gl.TRIANGLES, size, gl.UNSIGNED_SHORT, offset * 2);
                        gl.stencilFunc(gl.EQUAL, level, 0xFF);
                        gl.colorMask(true, true, true, true);
                        gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);
                    }
                }
                return size;
            };
            WebGLRenderContext.prototype.setBlendMode = function (value) {
                var gl = this.context;
                var blendModeWebGL = WebGLRenderContext.blendModesForGL[value];
                if (blendModeWebGL) {
                    gl.blendFunc(blendModeWebGL[0], blendModeWebGL[1]);
                }
            };
            WebGLRenderContext.prototype.drawTargetWidthFilters = function (filters, input) {
                var originInput = input, filtersLen = filters.length, output;
                if (filtersLen > 1) {
                    for (var i = 0; i < filtersLen - 1; i++) {
                        var filter_1 = filters[i];
                        var width = input.rootRenderTarget.width;
                        var height = input.rootRenderTarget.height;
                        output = web.WebGLRenderBuffer.create(width, height);
                        output.setTransform(1, 0, 0, 1, 0, 0);
                        output.globalAlpha = 1;
                        this.drawToRenderTarget(filter_1, input, output);
                        if (input != originInput) {
                            web.WebGLRenderBuffer.release(input);
                        }
                        input = output;
                    }
                }
                var filter = filters[filtersLen - 1];
                this.drawToRenderTarget(filter, input, this.currentBuffer);
                if (input != originInput) {
                    web.WebGLRenderBuffer.release(input);
                }
            };
            WebGLRenderContext.prototype.drawToRenderTarget = function (filter, input, output) {
                if (this.contextLost) {
                    return;
                }
                if (this.vao.reachMaxSize()) {
                    this.$drawWebGL();
                }
                this.pushBuffer(output);
                var originInput = input, temp, width = input.rootRenderTarget.width, height = input.rootRenderTarget.height;
                if (filter.type == "blur") {
                    var blurXFilter = filter.blurXFilter;
                    var blurYFilter = filter.blurYFilter;
                    if (blurXFilter.blurX != 0 && blurYFilter.blurY != 0) {
                        temp = web.WebGLRenderBuffer.create(width, height);
                        temp.setTransform(1, 0, 0, 1, 0, 0);
                        temp.globalAlpha = 1;
                        this.drawToRenderTarget(filter.blurXFilter, input, temp);
                        if (input != originInput) {
                            web.WebGLRenderBuffer.release(input);
                        }
                        input = temp;
                        filter = blurYFilter;
                    }
                    else {
                        filter = blurXFilter.blurX === 0 ? blurYFilter : blurXFilter;
                    }
                }
                output.saveTransform();
                output.transform(1, 0, 0, -1, 0, height);
                output.currentTexture = input.rootRenderTarget.texture;
                this.vao.cacheArrays(output, 0, 0, width, height, 0, 0, width, height, width, height);
                output.restoreTransform();
                this.drawCmdManager.pushDrawTexture(input.rootRenderTarget.texture, 2, filter, width, height);
                if (input != originInput) {
                    web.WebGLRenderBuffer.release(input);
                }
                this.popBuffer();
            };
            WebGLRenderContext.initBlendMode = function () {
                WebGLRenderContext.blendModesForGL = {};
                WebGLRenderContext.blendModesForGL["source-over"] = [1, 771];
                WebGLRenderContext.blendModesForGL["lighter"] = [1, 1];
                WebGLRenderContext.blendModesForGL["lighter-in"] = [770, 771];
                WebGLRenderContext.blendModesForGL["destination-out"] = [0, 771];
                WebGLRenderContext.blendModesForGL["destination-in"] = [0, 770];
            };
            WebGLRenderContext.glContextId = 0;
            WebGLRenderContext.blendModesForGL = null;
            return WebGLRenderContext;
        }());
        web.WebGLRenderContext = WebGLRenderContext;
        WebGLRenderContext.initBlendMode();
        egret.sys.WebGLRenderContext = WebGLRenderContext;
    })(web = egret.web || (egret.web = {}));
})(egret || (egret = {}));
var egret;
(function (egret) {
    var sys;
    (function (sys) {
        var Player = (function (_super) {
            __extends(Player, _super);
            function Player(buffer, stage, entryClassName) {
                var _this = _super.call(this) || this;
                _this.isPlaying = false;
                _this.entryClassName = entryClassName;
                _this.stage = stage;
                _this.screenDisplayList = _this.createDisplayList(stage, buffer);
                _this.showFPS = false;
                _this.showLog = false;
                _this.stageDisplayList = null;
                if (egret.nativeRender) {
                    egret_native.rootWebGLBuffer = buffer;
                }
                return _this;
            }
            Player.prototype.createDisplayList = function (stage, buffer) {
                var displayList = new sys.DisplayList(stage);
                displayList.renderBuffer = buffer;
                stage.$displayList = displayList;
                return displayList;
            };
            Player.prototype.start = function () {
                if (this.isPlaying || !this.stage) {
                    return;
                }
                sys.$TempStage = sys.$TempStage || this.stage;
                this.isPlaying = true;
                if (!this.root) {
                    this.initialize();
                }
                egret.ticker.$addPlayer(this);
            };
            Player.prototype.initialize = function () {
                var rootClass;
                if (this.entryClassName) {
                    rootClass = egret.getDefinitionByName(this.entryClassName);
                }
                if (rootClass) {
                    var rootContainer = new rootClass();
                    this.root = rootContainer;
                    if (rootContainer instanceof egret.DisplayObject) {
                        this.stage.addChild(rootContainer);
                    }
                }
            };
            Player.prototype.stop = function () {
                this.pause();
                this.stage = null;
            };
            Player.prototype.pause = function () {
                if (!this.isPlaying) {
                    return;
                }
                this.isPlaying = false;
                egret.ticker.$removePlayer(this);
            };
            Player.prototype.$render = function (triggerByFrame, costTicker) {
                if (egret.nativeRender) {
                    egret_native.updateNativeRender();
                    egret_native.nrRender();
                    return;
                }
                var stage = this.stage;
                var t1 = egret.getTimer();
                var drawCalls = stage.$displayList.drawToSurface();
                var t2 = egret.getTimer();
                if (triggerByFrame && this.showFPS) {
                    fpsDisplay.update(drawCalls, t2 - t1, costTicker);
                }
            };
            Player.prototype.updateStageSize = function (stageWidth, stageHeight) {
                var stage = this.stage;
                stage.$stageWidth = stageWidth;
                stage.$stageHeight = stageHeight;
                if (egret.nativeRender) {
                    egret_native.nrResize(stageWidth, stageHeight);
                }
                else {
                    this.screenDisplayList.setClipRect(stageWidth, stageHeight);
                    if (this.stageDisplayList) {
                        this.stageDisplayList.setClipRect(stageWidth, stageHeight);
                    }
                }
                stage.dispatchEventWith(egret.Event.RESIZE);
            };
            Player.prototype.displayFPS = function (showFPS, showLog, logFilter, styles) {
                showLog = !!showLog;
                if (showLog) {
                    egret.log = function () {
                        var length = arguments.length;
                        var info = "";
                        for (var i = 0; i < length; i++) {
                            info += arguments[i] + " ";
                        }
                        sys.$logToFPS(info);
                        console.log.apply(console, toArray(arguments));
                    };
                    egret.warn = function () {
                        var length = arguments.length;
                        var info = "";
                        for (var i = 0; i < length; i++) {
                            info += arguments[i] + " ";
                        }
                        sys.$warnToFPS(info);
                        console.warn.apply(console, toArray(arguments));
                    };
                    egret.error = function () {
                        var length = arguments.length;
                        var info = "";
                        for (var i = 0; i < length; i++) {
                            info += arguments[i] + " ";
                        }
                        sys.$errorToFPS(info);
                        console.error.apply(console, toArray(arguments));
                    };
                }
                this.showFPS = !!showFPS;
                this.showLog = showLog;
                if (!fpsDisplay) {
                    fpsDisplay = new FPS(this.stage, showFPS, showLog, logFilter, styles);
                    var logLength = logLines.length;
                    for (var i = 0; i < logLength; i++) {
                        fpsDisplay.updateInfo(logLines[i]);
                    }
                    logLines = null;
                    var warnLength = warnLines.length;
                    for (var i = 0; i < warnLength; i++) {
                        fpsDisplay.updateWarn(warnLines[i]);
                    }
                    warnLines = null;
                    var errorLength = errorLines.length;
                    for (var i = 0; i < errorLength; i++) {
                        fpsDisplay.updateError(errorLines[i]);
                    }
                    errorLines = null;
                }
            };
            return Player;
        }(egret.HashObject));
        sys.Player = Player;
        var logLines = [];
        var warnLines = [];
        var errorLines = [];
        var fpsDisplay;
        sys.$logToFPS = function (info) {
            if (!fpsDisplay) {
                logLines.push(info);
                return;
            }
            fpsDisplay.updateInfo(info);
        };
        sys.$warnToFPS = function (info) {
            if (!fpsDisplay) {
                warnLines.push(info);
                return;
            }
            fpsDisplay.updateWarn(info);
        };
        sys.$errorToFPS = function (info) {
            if (!fpsDisplay) {
                errorLines.push(info);
                return;
            }
            fpsDisplay.updateError(info);
        };
        var FPSImpl = (function () {
            function FPSImpl(stage, showFPS, showLog, logFilter, styles) {
                this.showFPS = showFPS;
                this.showLog = showLog;
                this.logFilter = logFilter;
                this.styles = styles;
                this.infoLines = [];
                this.totalTime = 0;
                this.totalTick = 0;
                this.lastTime = 0;
                this.drawCalls = 0;
                this.costRender = 0;
                this.costTicker = 0;
                this.infoLines = [];
                this.totalTime = 0;
                this.totalTick = 0;
                this.lastTime = 0;
                this.drawCalls = 0;
                this.costRender = 0;
                this.costTicker = 0;
                this._stage = stage;
                this.showFPS = showFPS;
                this.showLog = showLog;
                this.logFilter = logFilter;
                this.styles = styles;
                this.fpsDisplay = new egret.FPSDisplay(stage, showFPS, showLog, logFilter, styles);
                var logFilterRegExp;
                try {
                    logFilterRegExp = logFilter ? new RegExp(logFilter) : null;
                }
                catch (e) {
                    egret.log(e);
                }
                this.filter = function (message) {
                    if (logFilterRegExp)
                        return logFilterRegExp.test(message);
                    return !logFilter || message.indexOf(logFilter) == 0;
                };
            }
            FPSImpl.prototype.update = function (drawCalls, costRender, costTicker) {
                var current = egret.getTimer();
                this.totalTime += current - this.lastTime;
                this.lastTime = current;
                this.totalTick++;
                this.drawCalls += drawCalls;
                this.costRender += costRender;
                this.costTicker += costTicker;
                if (this.totalTime >= 1000) {
                    var lastFPS = Math.min(Math.ceil(this.totalTick * 1000 / this.totalTime), egret.ticker.$frameRate);
                    var lastDrawCalls = Math.round(this.drawCalls / this.totalTick);
                    var lastCostRender = Math.round(this.costRender / this.totalTick);
                    var lastCostTicker = Math.round(this.costTicker / this.totalTick);
                    this.fpsDisplay.update({
                        fps: lastFPS,
                        draw: lastDrawCalls,
                        costTicker: lastCostTicker,
                        costRender: lastCostRender
                    });
                    this.totalTick = 0;
                    this.totalTime = this.totalTime % 1000;
                    this.drawCalls = 0;
                    this.costRender = 0;
                    this.costTicker = 0;
                }
            };
            FPSImpl.prototype.updateInfo = function (info) {
                if (!info) {
                    return;
                }
                if (!this.showLog) {
                    return;
                }
                if (!this.filter(info)) {
                    return;
                }
                this.fpsDisplay.updateInfo(info);
            };
            FPSImpl.prototype.updateWarn = function (info) {
                if (!info) {
                    return;
                }
                if (!this.showLog) {
                    return;
                }
                if (!this.filter(info)) {
                    return;
                }
                if (this.fpsDisplay.updateWarn) {
                    this.fpsDisplay.updateWarn(info);
                }
                else {
                    this.fpsDisplay.updateInfo("[Warning]" + info);
                }
            };
            FPSImpl.prototype.updateError = function (info) {
                if (!info) {
                    return;
                }
                if (!this.showLog) {
                    return;
                }
                if (!this.filter(info)) {
                    return;
                }
                if (this.fpsDisplay.updateError) {
                    this.fpsDisplay.updateError(info);
                }
                else {
                    this.fpsDisplay.updateInfo("[Error]" + info);
                }
            };
            return FPSImpl;
        }());
        __global.FPS = FPSImpl;
        function toArray(argument) {
            var args = [];
            for (var i = 0; i < argument.length; i++) {
                args.push(argument[i]);
            }
            return args;
        }
        egret.warn = function () {
            console.warn.apply(console, toArray(arguments));
        };
        egret.error = function () {
            console.error.apply(console, toArray(arguments));
        };
        egret.assert = function () {
            console.assert.apply(console, toArray(arguments));
        };
        egret.log = function () {
            console.log.apply(console, toArray(arguments));
        };
    })(sys = egret.sys || (egret.sys = {}));
})(egret || (egret = {}));
(function (egret) {
    egret.nativeRender = __global.nativeRender;
    if (egret.nativeRender) {
        var nrABIVersion = egret_native.nrABIVersion;
        var nrMinEgretVersion = egret_native.nrMinEgretVersion;
        var requiredNrABIVersion = 5;
        if (nrABIVersion < requiredNrABIVersion) {
            egret.nativeRender = false;
            var msg = "You need to upgrade the micro-end version to 0.1.14 to enable native rendering acceleration";
            egret.sys.$warnToFPS(msg);
            egret.warn(msg);
        }
        else if (nrABIVersion > requiredNrABIVersion) {
            egret.nativeRender = false;
            var msg = "You need to upgrade the engine version to " + nrMinEgretVersion + " for enable native rendering acceleration";
            egret.sys.$warnToFPS(msg);
            egret.warn(msg);
        }
    }
})(egret || (egret = {}));
var egret;
(function (egret) {
    var sys;
    (function (sys) {
        sys.$START_TIME = 0;
        sys.$invalidateRenderFlag = false;
        sys.$requestRenderingFlag = false;
        var SystemTicker = (function () {
            function SystemTicker() {
                var _this = this;
                this.playerList = [];
                this.callBackList = [];
                this.thisObjectList = [];
                this.$frameRate = 30;
                this.lastTimeStamp = 0;
                this.costEnterFrame = 0;
                this.isPaused = false;
                this.$beforeRender = function () {
                    var callBackList = _this.callBackList;
                    var thisObjectList = _this.thisObjectList;
                    var length = callBackList.length;
                    var timeStamp = egret.getTimer();
                    var contexts = egret.lifecycle.contexts;
                    for (var _i = 0, contexts_1 = contexts; _i < contexts_1.length; _i++) {
                        var c = contexts_1[_i];
                        if (c.onUpdate) {
                            c.onUpdate();
                        }
                    }
                    if (_this.isPaused) {
                        _this.lastTimeStamp = timeStamp;
                        return;
                    }
                    _this.callLaterAsyncs();
                    for (var i = 0; i < length; i++) {
                        callBackList[i].call(thisObjectList[i], timeStamp);
                    }
                    _this.callLaters();
                    if (sys.$invalidateRenderFlag) {
                        _this.broadcastRender();
                        sys.$invalidateRenderFlag = false;
                    }
                };
                this.$afterRender = function () {
                    _this.broadcastEnterFrame();
                };
                sys.$START_TIME = Date.now();
                this.frameDeltaTime = 1000 / this.$frameRate;
                this.lastCount = this.frameInterval = Math.round(60000 / this.$frameRate);
            }
            SystemTicker.prototype.$addPlayer = function (player) {
                if (this.playerList.indexOf(player) != -1) {
                    return;
                }
                this.playerList = this.playerList.concat();
                this.playerList.push(player);
            };
            SystemTicker.prototype.$removePlayer = function (player) {
                var index = this.playerList.indexOf(player);
                if (index !== -1) {
                    this.playerList = this.playerList.concat();
                    this.playerList.splice(index, 1);
                }
            };
            SystemTicker.prototype.$startTick = function (callBack, thisObject) {
                var index = this.getTickIndex(callBack, thisObject);
                if (index != -1) {
                    return;
                }
                this.concatTick();
                this.callBackList.push(callBack);
                this.thisObjectList.push(thisObject);
            };
            SystemTicker.prototype.$stopTick = function (callBack, thisObject) {
                var index = this.getTickIndex(callBack, thisObject);
                if (index == -1) {
                    return;
                }
                this.concatTick();
                this.callBackList.splice(index, 1);
                this.thisObjectList.splice(index, 1);
            };
            SystemTicker.prototype.getTickIndex = function (callBack, thisObject) {
                var callBackList = this.callBackList;
                var thisObjectList = this.thisObjectList;
                for (var i = callBackList.length - 1; i >= 0; i--) {
                    if (callBackList[i] == callBack &&
                        thisObjectList[i] == thisObject) {
                        return i;
                    }
                }
                return -1;
            };
            SystemTicker.prototype.concatTick = function () {
                this.callBackList = this.callBackList.concat();
                this.thisObjectList = this.thisObjectList.concat();
            };
            SystemTicker.prototype.$setFrameRate = function (value) {
                if (value <= 0) {
                    return false;
                }
                if (this.$frameRate == value) {
                    return false;
                }
                this.$frameRate = value;
                if (value > 60) {
                    value = 60;
                }
                this.frameDeltaTime = 1000 / value;
                this.lastCount = this.frameInterval = Math.round(60000 / value);
                return true;
            };
            SystemTicker.prototype.pause = function () {
                this.isPaused = true;
            };
            SystemTicker.prototype.resume = function () {
                this.isPaused = false;
            };
            SystemTicker.prototype.update = function (forceUpdate) {
                var t1 = egret.getTimer();
                var callBackList = this.callBackList;
                var thisObjectList = this.thisObjectList;
                var length = callBackList.length;
                var requestRenderingFlag = sys.$requestRenderingFlag;
                var timeStamp = egret.getTimer();
                var contexts = egret.lifecycle.contexts;
                for (var _i = 0, contexts_2 = contexts; _i < contexts_2.length; _i++) {
                    var c = contexts_2[_i];
                    if (c.onUpdate) {
                        c.onUpdate();
                    }
                }
                if (this.isPaused) {
                    this.lastTimeStamp = timeStamp;
                    return;
                }
                this.callLaterAsyncs();
                for (var i = 0; i < length; i++) {
                    if (callBackList[i].call(thisObjectList[i], timeStamp)) {
                        requestRenderingFlag = true;
                    }
                }
                var t2 = egret.getTimer();
                var deltaTime = timeStamp - this.lastTimeStamp;
                this.lastTimeStamp = timeStamp;
                if (deltaTime >= this.frameDeltaTime || forceUpdate) {
                    this.lastCount = this.frameInterval;
                }
                else {
                    this.lastCount -= 1000;
                    if (this.lastCount > 0) {
                        if (requestRenderingFlag) {
                            this.render(false, this.costEnterFrame + t2 - t1);
                        }
                        return;
                    }
                    this.lastCount += this.frameInterval;
                }
                this.render(true, this.costEnterFrame + t2 - t1);
                var t3 = egret.getTimer();
                this.broadcastEnterFrame();
                var t4 = egret.getTimer();
                this.costEnterFrame = t4 - t3;
            };
            SystemTicker.prototype.render = function (triggerByFrame, costTicker) {
                var playerList = this.playerList;
                var length = playerList.length;
                if (length == 0) {
                    return;
                }
                this.callLaters();
                if (sys.$invalidateRenderFlag) {
                    this.broadcastRender();
                    sys.$invalidateRenderFlag = false;
                }
                for (var i = 0; i < length; i++) {
                    playerList[i].$render(triggerByFrame, costTicker);
                }
                sys.$requestRenderingFlag = false;
            };
            SystemTicker.prototype.broadcastEnterFrame = function () {
                var list = egret.DisplayObject.$enterFrameCallBackList;
                var length = list.length;
                if (length == 0) {
                    return;
                }
                list = list.concat();
                for (var i = 0; i < length; i++) {
                    list[i].dispatchEventWith(egret.Event.ENTER_FRAME);
                }
            };
            SystemTicker.prototype.broadcastRender = function () {
                var list = egret.DisplayObject.$renderCallBackList;
                var length = list.length;
                if (length == 0) {
                    return;
                }
                list = list.concat();
                for (var i = 0; i < length; i++) {
                    list[i].dispatchEventWith(egret.Event.RENDER);
                }
            };
            SystemTicker.prototype.callLaters = function () {
                var functionList;
                var thisList;
                var argsList;
                if (egret.$callLaterFunctionList.length > 0) {
                    functionList = egret.$callLaterFunctionList;
                    egret.$callLaterFunctionList = [];
                    thisList = egret.$callLaterThisList;
                    egret.$callLaterThisList = [];
                    argsList = egret.$callLaterArgsList;
                    egret.$callLaterArgsList = [];
                }
                if (functionList) {
                    var length_11 = functionList.length;
                    for (var i = 0; i < length_11; i++) {
                        var func = functionList[i];
                        if (func != null) {
                            func.apply(thisList[i], argsList[i]);
                        }
                    }
                }
            };
            SystemTicker.prototype.callLaterAsyncs = function () {
                if (egret.$callAsyncFunctionList.length > 0) {
                    var locCallAsyncFunctionList = egret.$callAsyncFunctionList;
                    var locCallAsyncThisList = egret.$callAsyncThisList;
                    var locCallAsyncArgsList = egret.$callAsyncArgsList;
                    egret.$callAsyncFunctionList = [];
                    egret.$callAsyncThisList = [];
                    egret.$callAsyncArgsList = [];
                    for (var i = 0; i < locCallAsyncFunctionList.length; i++) {
                        var func = locCallAsyncFunctionList[i];
                        if (func != null) {
                            func.apply(locCallAsyncThisList[i], locCallAsyncArgsList[i]);
                        }
                    }
                }
            };
            return SystemTicker;
        }());
        sys.SystemTicker = SystemTicker;
    })(sys = egret.sys || (egret.sys = {}));
})(egret || (egret = {}));
(function (egret) {
    var lifecycle;
    (function (lifecycle) {
        lifecycle.contexts = [];
        var isActivate = true;
        var LifecycleContext = (function () {
            function LifecycleContext() {
            }
            LifecycleContext.prototype.pause = function () {
                if (isActivate) {
                    isActivate = false;
                    lifecycle.stage.dispatchEvent(new egret.Event(egret.Event.DEACTIVATE));
                    if (lifecycle.onPause) {
                        lifecycle.onPause();
                    }
                }
            };
            LifecycleContext.prototype.resume = function () {
                if (!isActivate) {
                    isActivate = true;
                    lifecycle.stage.dispatchEvent(new egret.Event(egret.Event.ACTIVATE));
                    if (lifecycle.onResume) {
                        lifecycle.onResume();
                    }
                }
            };
            return LifecycleContext;
        }());
        lifecycle.LifecycleContext = LifecycleContext;
        function addLifecycleListener(plugin) {
            var context = new LifecycleContext();
            lifecycle.contexts.push(context);
            plugin(context);
        }
        lifecycle.addLifecycleListener = addLifecycleListener;
    })(lifecycle = egret.lifecycle || (egret.lifecycle = {}));
    egret.ticker = new egret.sys.SystemTicker();
})(egret || (egret = {}));
var egret;
(function (egret) {
    var sys;
    (function (sys) {
        var TouchHandler = (function (_super) {
            __extends(TouchHandler, _super);
            function TouchHandler(stage) {
                var _this = _super.call(this) || this;
                _this.maxTouches = 0;
                _this.useTouchesCount = 0;
                _this.touchDownTarget = {};
                _this.lastTouchX = -1;
                _this.lastTouchY = -1;
                _this.$updateMaxTouches = function (value) {
                    this.maxTouches = value;
                };
                _this.stage = stage;
                return _this;
            }
            TouchHandler.prototype.$initMaxTouches = function () {
                this.maxTouches = this.stage.$maxTouches;
            };
            TouchHandler.prototype.onTouchBegin = function (x, y, touchPointID) {
                if (this.useTouchesCount >= this.maxTouches) {
                    return;
                }
                this.lastTouchX = x;
                this.lastTouchY = y;
                var target = this.findTarget(x, y);
                if (this.touchDownTarget[touchPointID] == null) {
                    this.touchDownTarget[touchPointID] = target;
                    this.useTouchesCount++;
                }
                egret.TouchEvent.dispatchTouchEvent(target, egret.TouchEvent.TOUCH_BEGIN, true, true, x, y, touchPointID, true);
                return target !== this.stage;
            };
            TouchHandler.prototype.onTouchMove = function (x, y, touchPointID) {
                if (this.touchDownTarget[touchPointID] == null) {
                    return;
                }
                if (this.lastTouchX == x && this.lastTouchY == y) {
                    return;
                }
                this.lastTouchX = x;
                this.lastTouchY = y;
                var target = this.findTarget(x, y);
                egret.TouchEvent.dispatchTouchEvent(target, egret.TouchEvent.TOUCH_MOVE, true, true, x, y, touchPointID, true);
                return target !== this.stage;
            };
            TouchHandler.prototype.onTouchEnd = function (x, y, touchPointID) {
                if (this.touchDownTarget[touchPointID] == null) {
                    return;
                }
                var target = this.findTarget(x, y);
                var oldTarget = this.touchDownTarget[touchPointID];
                delete this.touchDownTarget[touchPointID];
                this.useTouchesCount--;
                egret.TouchEvent.dispatchTouchEvent(target, egret.TouchEvent.TOUCH_END, true, true, x, y, touchPointID, false);
                if (oldTarget == target) {
                    egret.TouchEvent.dispatchTouchEvent(target, egret.TouchEvent.TOUCH_TAP, true, true, x, y, touchPointID, false);
                }
                else {
                    egret.TouchEvent.dispatchTouchEvent(oldTarget, egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, true, true, x, y, touchPointID, false);
                }
                return target !== this.stage;
            };
            TouchHandler.prototype.findTarget = function (stageX, stageY) {
                var target = this.stage.$hitTest(stageX, stageY);
                if (!target) {
                    target = this.stage;
                }
                return target;
            };
            return TouchHandler;
        }(egret.HashObject));
        sys.TouchHandler = TouchHandler;
    })(sys = egret.sys || (egret.sys = {}));
})(egret || (egret = {}));
var egret;
(function (egret) {
    var sys;
    (function (sys) {
        var FillPath = (function (_super) {
            __extends(FillPath, _super);
            function FillPath() {
                var _this = _super.call(this) || this;
                _this.type = 1;
                return _this;
            }
            return FillPath;
        }(sys.Path2D));
        sys.FillPath = FillPath;
    })(sys = egret.sys || (egret.sys = {}));
})(egret || (egret = {}));
var egret;
(function (egret) {
    var sys;
    (function (sys) {
        var GradientFillPath = (function (_super) {
            __extends(GradientFillPath, _super);
            function GradientFillPath() {
                var _this = _super.call(this) || this;
                _this.type = 2;
                return _this;
            }
            return GradientFillPath;
        }(sys.Path2D));
        sys.GradientFillPath = GradientFillPath;
    })(sys = egret.sys || (egret.sys = {}));
})(egret || (egret = {}));
var egret;
(function (egret) {
    egret.DeviceOrientation = null;
})(egret || (egret = {}));
var egret;
(function (egret) {
})(egret || (egret = {}));
var egret;
(function (egret) {
})(egret || (egret = {}));
var egret;
(function (egret) {
    var web;
    (function (web) {
        var WebDeviceOrientation = (function (_super) {
            __extends(WebDeviceOrientation, _super);
            function WebDeviceOrientation() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.onChange = function (e) {
                    var event = new egret.OrientationEvent(egret.Event.CHANGE);
                    event.beta = e.beta;
                    event.gamma = e.gamma;
                    event.alpha = e.alpha;
                    _this.dispatchEvent(event);
                };
                return _this;
            }
            WebDeviceOrientation.prototype.start = function () {
                window.addEventListener("deviceorientation", this.onChange);
            };
            WebDeviceOrientation.prototype.stop = function () {
                window.removeEventListener("deviceorientation", this.onChange);
            };
            return WebDeviceOrientation;
        }(egret.EventDispatcher));
        web.WebDeviceOrientation = WebDeviceOrientation;
    })(web = egret.web || (egret.web = {}));
})(egret || (egret = {}));
egret.DeviceOrientation = egret.web.WebDeviceOrientation;
var egret;
(function (egret) {
    var web;
    (function (web) {
        var WebGeolocation = (function (_super) {
            __extends(WebGeolocation, _super);
            function WebGeolocation(option) {
                var _this = _super.call(this) || this;
                _this.onUpdate = function (position) {
                    var event = new egret.GeolocationEvent(egret.Event.CHANGE);
                    var coords = position.coords;
                    event.altitude = coords.altitude;
                    event.heading = coords.heading;
                    event.accuracy = coords.accuracy;
                    event.latitude = coords.latitude;
                    event.longitude = coords.longitude;
                    event.speed = coords.speed;
                    event.altitudeAccuracy = coords.altitudeAccuracy;
                    _this.dispatchEvent(event);
                };
                _this.onError = function (error) {
                    var errorType = egret.GeolocationEvent.UNAVAILABLE;
                    if (error.code == error.PERMISSION_DENIED)
                        errorType = egret.GeolocationEvent.PERMISSION_DENIED;
                    var event = new egret.GeolocationEvent(egret.IOErrorEvent.IO_ERROR);
                    event.errorType = errorType;
                    event.errorMessage = error.message;
                    _this.dispatchEvent(event);
                };
                _this.geolocation = navigator.geolocation;
                return _this;
            }
            WebGeolocation.prototype.start = function () {
                var geo = this.geolocation;
                if (geo)
                    this.watchId = geo.watchPosition(this.onUpdate, this.onError);
                else
                    this.onError({
                        code: 2,
                        message: egret.sys.tr(3004),
                        PERMISSION_DENIED: 1,
                        POSITION_UNAVAILABLE: 2
                    });
            };
            WebGeolocation.prototype.stop = function () {
                var geo = this.geolocation;
                geo.clearWatch(this.watchId);
            };
            return WebGeolocation;
        }(egret.EventDispatcher));
        web.WebGeolocation = WebGeolocation;
    })(web = egret.web || (egret.web = {}));
})(egret || (egret = {}));
var egret;
(function (egret) {
    var web;
    (function (web) {
        var WebMotion = (function (_super) {
            __extends(WebMotion, _super);
            function WebMotion() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.onChange = function (e) {
                    var event = new egret.MotionEvent(egret.Event.CHANGE);
                    var acceleration = {
                        x: e.acceleration.x,
                        y: e.acceleration.y,
                        z: e.acceleration.z
                    };
                    var accelerationIncludingGravity = {
                        x: e.accelerationIncludingGravity.x,
                        y: e.accelerationIncludingGravity.y,
                        z: e.accelerationIncludingGravity.z
                    };
                    var rotation = {
                        alpha: e.rotationRate.alpha,
                        beta: e.rotationRate.beta,
                        gamma: e.rotationRate.gamma
                    };
                    event.acceleration = acceleration;
                    event.accelerationIncludingGravity = accelerationIncludingGravity;
                    event.rotationRate = rotation;
                    _this.dispatchEvent(event);
                };
                return _this;
            }
            WebMotion.prototype.start = function () {
                window.addEventListener("devicemotion", this.onChange);
            };
            WebMotion.prototype.stop = function () {
                window.removeEventListener("devicemotion", this.onChange);
            };
            return WebMotion;
        }(egret.EventDispatcher));
        web.WebMotion = WebMotion;
    })(web = egret.web || (egret.web = {}));
})(egret || (egret = {}));
var egret;
(function (egret) {
    var implMap = {};
    function registerImplementation(interfaceName, instance) {
        implMap[interfaceName] = instance;
    }
    egret.registerImplementation = registerImplementation;
    function getImplementation(interfaceName) {
        return implMap[interfaceName];
    }
    egret.getImplementation = getImplementation;
})(egret || (egret = {}));
var egret;
(function (egret) {
    var BitmapFont = (function (_super) {
        __extends(BitmapFont, _super);
        function BitmapFont(texture, config) {
            var _this = _super.call(this, texture) || this;
            _this.firstCharHeight = 0;
            if (typeof (config) == "string") {
                _this.charList = _this.parseConfig(config);
            }
            else if (config && config.hasOwnProperty("frames")) {
                _this.charList = config.frames;
            }
            else {
                _this.charList = {};
            }
            return _this;
        }
        BitmapFont.prototype.getTexture = function (name) {
            var texture = this._textureMap[name];
            if (!texture) {
                var c = this.charList[name];
                if (!c) {
                    return null;
                }
                texture = this.createTexture(name, c.x, c.y, c.w, c.h, c.offX, c.offY, c.sourceW, c.sourceH);
                this._textureMap[name] = texture;
            }
            return texture;
        };
        BitmapFont.prototype.getConfig = function (name, key) {
            if (!this.charList[name]) {
                return 0;
            }
            return this.charList[name][key];
        };
        BitmapFont.prototype._getFirstCharHeight = function () {
            if (this.firstCharHeight == 0) {
                for (var str in this.charList) {
                    var c = this.charList[str];
                    if (c) {
                        var sourceH = c.sourceH;
                        if (sourceH === undefined) {
                            var h = c.h;
                            if (h === undefined) {
                                h = 0;
                            }
                            var offY = c.offY;
                            if (offY === undefined) {
                                offY = 0;
                            }
                            sourceH = h + offY;
                        }
                        if (sourceH <= 0) {
                            continue;
                        }
                        this.firstCharHeight = sourceH;
                        break;
                    }
                }
            }
            return this.firstCharHeight;
        };
        BitmapFont.prototype.parseConfig = function (fntText) {
            fntText = fntText.split("\r\n").join("\n");
            var lines = fntText.split("\n");
            var charsCount = this.getConfigByKey(lines[3], "count");
            var chars = {};
            for (var i = 4; i < 4 + charsCount; i++) {
                var charText = lines[i];
                var letter = String.fromCharCode(this.getConfigByKey(charText, "id"));
                var c = {};
                chars[letter] = c;
                c["x"] = this.getConfigByKey(charText, "x");
                c["y"] = this.getConfigByKey(charText, "y");
                c["w"] = this.getConfigByKey(charText, "width");
                c["h"] = this.getConfigByKey(charText, "height");
                c["offX"] = this.getConfigByKey(charText, "xoffset");
                c["offY"] = this.getConfigByKey(charText, "yoffset");
                c["xadvance"] = this.getConfigByKey(charText, "xadvance");
            }
            return chars;
        };
        BitmapFont.prototype.getConfigByKey = function (configText, key) {
            var itemConfigTextList = configText.split(" ");
            for (var i = 0, length_12 = itemConfigTextList.length; i < length_12; i++) {
                var itemConfigText = itemConfigTextList[i];
                if (key == itemConfigText.substring(0, key.length)) {
                    var value = itemConfigText.substring(key.length + 1);
                    return parseInt(value);
                }
            }
            return 0;
        };
        return BitmapFont;
    }(egret.SpriteSheet));
    egret.BitmapFont = BitmapFont;
})(egret || (egret = {}));
var egret;
(function (egret) {
    var BitmapText = (function (_super) {
        __extends(BitmapText, _super);
        function BitmapText() {
            var _this = _super.call(this) || this;
            _this.$smoothing = egret.Bitmap.defaultSmoothing;
            _this.$text = "";
            _this.$textFieldWidth = NaN;
            _this.$textLinesChanged = false;
            _this.$textFieldHeight = NaN;
            _this.$font = null;
            _this.$fontStringChanged = false;
            _this.$lineSpacing = 0;
            _this.$letterSpacing = 0;
            _this.$textAlign = egret.HorizontalAlign.LEFT;
            _this.$verticalAlign = egret.VerticalAlign.TOP;
            _this.$textWidth = NaN;
            _this.$textHeight = NaN;
            _this.$textOffsetX = 0;
            _this.$textOffsetY = 0;
            _this.$textStartX = 0;
            _this.$textStartY = 0;
            _this.textLines = [];
            _this.$lineHeights = [];
            if (!egret.nativeRender) {
                _this.$renderNode = new egret.sys.BitmapNode();
            }
            return _this;
        }
        BitmapText.prototype.createNativeDisplayObject = function () {
            this.$nativeDisplayObject = new egret_native.NativeDisplayObject(11);
        };
        Object.defineProperty(BitmapText.prototype, "smoothing", {
            get: function () {
                return this.$smoothing;
            },
            set: function (value) {
                var self = this;
                if (value == self.$smoothing) {
                    return;
                }
                self.$smoothing = value;
                if (!egret.nativeRender) {
                    var p = self.$parent;
                    if (p && !p.$cacheDirty) {
                        p.$cacheDirty = true;
                        p.$cacheDirtyUp();
                    }
                    var maskedObject = self.$maskedObject;
                    if (maskedObject && !maskedObject.$cacheDirty) {
                        maskedObject.$cacheDirty = true;
                        maskedObject.$cacheDirtyUp();
                    }
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BitmapText.prototype, "text", {
            get: function () {
                return this.$text;
            },
            set: function (value) {
                this.$setText(value);
            },
            enumerable: true,
            configurable: true
        });
        BitmapText.prototype.$setText = function (value) {
            if (value == null) {
                value = "";
            }
            else {
                value = String(value);
            }
            var self = this;
            if (value == self.$text)
                return false;
            self.$text = value;
            self.$invalidateContentBounds();
            return true;
        };
        BitmapText.prototype.$getWidth = function () {
            var self = this;
            var w = self.$textFieldWidth;
            return isNaN(w) ? self.$getContentBounds().width : w;
        };
        BitmapText.prototype.$setWidth = function (value) {
            var self = this;
            if (value < 0 || value == self.$textFieldWidth) {
                return false;
            }
            self.$textFieldWidth = value;
            self.$invalidateContentBounds();
            return true;
        };
        BitmapText.prototype.$invalidateContentBounds = function () {
            this.$renderDirty = true;
            this.$textLinesChanged = true;
            this.$updateRenderNode();
        };
        BitmapText.prototype.$getHeight = function () {
            var self = this;
            var h = self.$textFieldHeight;
            return isNaN(h) ? self.$getContentBounds().height : h;
        };
        BitmapText.prototype.$setHeight = function (value) {
            var self = this;
            if (value < 0 || value == self.$textFieldHeight) {
                return false;
            }
            self.$textFieldHeight = value;
            self.$invalidateContentBounds();
            return true;
        };
        Object.defineProperty(BitmapText.prototype, "font", {
            get: function () {
                return this.$font;
            },
            set: function (value) {
                this.$setFont(value);
            },
            enumerable: true,
            configurable: true
        });
        BitmapText.prototype.$setFont = function (value) {
            var self = this;
            if (self.$font == value) {
                return false;
            }
            self.$font = value;
            self.$fontStringChanged = true;
            this.$invalidateContentBounds();
            return true;
        };
        Object.defineProperty(BitmapText.prototype, "lineSpacing", {
            get: function () {
                return this.$lineSpacing;
            },
            set: function (value) {
                this.$setLineSpacing(value);
            },
            enumerable: true,
            configurable: true
        });
        BitmapText.prototype.$setLineSpacing = function (value) {
            var self = this;
            if (self.$lineSpacing == value)
                return false;
            self.$lineSpacing = value;
            self.$invalidateContentBounds();
            return true;
        };
        Object.defineProperty(BitmapText.prototype, "letterSpacing", {
            get: function () {
                return this.$letterSpacing;
            },
            set: function (value) {
                this.$setLetterSpacing(value);
            },
            enumerable: true,
            configurable: true
        });
        BitmapText.prototype.$setLetterSpacing = function (value) {
            var self = this;
            if (self.$letterSpacing == value) {
                return false;
            }
            self.$letterSpacing = value;
            self.$invalidateContentBounds();
            return true;
        };
        Object.defineProperty(BitmapText.prototype, "textAlign", {
            get: function () {
                return this.$textAlign;
            },
            set: function (value) {
                this.$setTextAlign(value);
            },
            enumerable: true,
            configurable: true
        });
        BitmapText.prototype.$setTextAlign = function (value) {
            var self = this;
            if (self.$textAlign == value) {
                return false;
            }
            self.$textAlign = value;
            self.$invalidateContentBounds();
            return true;
        };
        Object.defineProperty(BitmapText.prototype, "verticalAlign", {
            get: function () {
                return this.$verticalAlign;
            },
            set: function (value) {
                this.$setVerticalAlign(value);
            },
            enumerable: true,
            configurable: true
        });
        BitmapText.prototype.$setVerticalAlign = function (value) {
            var self = this;
            if (self.$verticalAlign == value) {
                return false;
            }
            self.$verticalAlign = value;
            self.$invalidateContentBounds();
            return true;
        };
        BitmapText.prototype.$updateRenderNode = function () {
            var self = this;
            var textLines = this.$getTextLines();
            var length = textLines.length;
            if (length == 0) {
                if (egret.nativeRender && self.$font) {
                    self.$nativeDisplayObject.setDataToBitmapNode(self.$nativeDisplayObject.id, self.$font.$texture, []);
                    self.$nativeDisplayObject.setWidth(0);
                    self.$nativeDisplayObject.setHeight(0);
                }
                return;
            }
            var drawArr = [];
            var textLinesWidth = this.$textLinesWidth;
            var bitmapFont = self.$font;
            var node;
            if (!egret.nativeRender) {
                node = this.$renderNode;
                if (bitmapFont.$texture) {
                    node.image = bitmapFont.$texture.$bitmapData;
                }
                node.smoothing = self.$smoothing;
            }
            var emptyHeight = bitmapFont._getFirstCharHeight();
            var emptyWidth = Math.ceil(emptyHeight * BitmapText.EMPTY_FACTOR);
            var hasSetHeight = !isNaN(self.$textFieldHeight);
            var textWidth = self.$textWidth;
            var textFieldWidth = self.$textFieldWidth;
            var textFieldHeight = self.$textFieldHeight;
            var align = self.$textAlign;
            var yPos = this.$textOffsetY + this.$textStartY;
            var lineHeights = this.$lineHeights;
            for (var i = 0; i < length; i++) {
                var lineHeight = lineHeights[i];
                if (hasSetHeight && i > 0 && yPos + lineHeight > textFieldHeight) {
                    break;
                }
                var line = textLines[i];
                var len = line.length;
                var xPos = this.$textOffsetX;
                if (align != egret.HorizontalAlign.LEFT) {
                    var countWidth = textFieldWidth > textWidth ? textFieldWidth : textWidth;
                    if (align == egret.HorizontalAlign.RIGHT) {
                        xPos += countWidth - textLinesWidth[i];
                    }
                    else if (align == egret.HorizontalAlign.CENTER) {
                        xPos += Math.floor((countWidth - textLinesWidth[i]) / 2);
                    }
                }
                for (var j = 0; j < len; j++) {
                    var character = line.charAt(j);
                    var texture = bitmapFont.getTexture(character);
                    if (!texture) {
                        if (character == " ") {
                            xPos += emptyWidth;
                        }
                        else {
                            egret.warn(1046, character);
                        }
                        continue;
                    }
                    var bitmapWidth = texture.$bitmapWidth;
                    var bitmapHeight = texture.$bitmapHeight;
                    if (egret.nativeRender) {
                        drawArr.push(texture.$bitmapX, texture.$bitmapY, bitmapWidth, bitmapHeight, xPos + texture.$offsetX, yPos + texture.$offsetY, texture.$getScaleBitmapWidth(), texture.$getScaleBitmapHeight(), texture.$sourceWidth, texture.$sourceHeight);
                    }
                    else {
                        node.imageWidth = texture.$sourceWidth;
                        node.imageHeight = texture.$sourceHeight;
                        node.drawImage(texture.$bitmapX, texture.$bitmapY, bitmapWidth, bitmapHeight, xPos + texture.$offsetX, yPos + texture.$offsetY, texture.$getScaleBitmapWidth(), texture.$getScaleBitmapHeight());
                    }
                    xPos += (bitmapFont.getConfig(character, "xadvance") || texture.$getTextureWidth()) + self.$letterSpacing;
                }
                yPos += lineHeight + self.$lineSpacing;
            }
            if (egret.nativeRender) {
                self.$nativeDisplayObject.setDataToBitmapNode(self.$nativeDisplayObject.id, bitmapFont.$texture, drawArr);
                var bounds = self.$getContentBounds();
                self.$nativeDisplayObject.setWidth(bounds.width);
                self.$nativeDisplayObject.setHeight(bounds.height);
            }
        };
        BitmapText.prototype.$measureContentBounds = function (bounds) {
            var lines = this.$getTextLines();
            if (lines.length == 0) {
                bounds.setEmpty();
            }
            else {
                bounds.setTo(this.$textOffsetX + this.$textStartX, this.$textOffsetY + this.$textStartY, this.$textWidth - this.$textOffsetX, this.$textHeight - this.$textOffsetY);
            }
        };
        Object.defineProperty(BitmapText.prototype, "textWidth", {
            get: function () {
                this.$getTextLines();
                return this.$textWidth;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BitmapText.prototype, "textHeight", {
            get: function () {
                this.$getTextLines();
                return this.$textHeight;
            },
            enumerable: true,
            configurable: true
        });
        BitmapText.prototype.$getTextLines = function () {
            var self = this;
            if (!self.$textLinesChanged) {
                return self.textLines;
            }
            var textLines = [];
            self.textLines = textLines;
            var textLinesWidth = [];
            self.$textLinesWidth = textLinesWidth;
            self.$textLinesChanged = false;
            var lineHeights = [];
            self.$lineHeights = lineHeights;
            if (!self.$text || !self.$font) {
                self.$textWidth = 0;
                self.$textHeight = 0;
                return textLines;
            }
            var lineSpacing = self.$lineSpacing;
            var letterSpacing = self.$letterSpacing;
            var textWidth = 0;
            var textHeight = 0;
            var textOffsetX = 0;
            var textOffsetY = 0;
            var hasWidthSet = !isNaN(self.$textFieldWidth);
            var textFieldWidth = self.$textFieldWidth;
            var textFieldHeight = self.$textFieldHeight;
            var bitmapFont = self.$font;
            var emptyHeight = bitmapFont._getFirstCharHeight();
            var emptyWidth = Math.ceil(emptyHeight * BitmapText.EMPTY_FACTOR);
            var text = self.$text;
            var textArr = text.split(/(?:\r\n|\r|\n)/);
            var length = textArr.length;
            var isFirstLine = true;
            var isFirstChar;
            var isLastChar;
            var lineHeight;
            var xPos;
            for (var i = 0; i < length; i++) {
                var line = textArr[i];
                var len = line.length;
                lineHeight = 0;
                xPos = 0;
                isFirstChar = true;
                isLastChar = false;
                for (var j = 0; j < len; j++) {
                    if (!isFirstChar) {
                        xPos += letterSpacing;
                    }
                    var character = line.charAt(j);
                    var texureWidth = void 0;
                    var textureHeight = void 0;
                    var offsetX = 0;
                    var offsetY = 0;
                    var texture = bitmapFont.getTexture(character);
                    if (!texture) {
                        if (character == " ") {
                            texureWidth = emptyWidth;
                            textureHeight = emptyHeight;
                        }
                        else {
                            egret.warn(1046, character);
                            if (isFirstChar) {
                                isFirstChar = false;
                            }
                            continue;
                        }
                    }
                    else {
                        texureWidth = texture.$getTextureWidth();
                        textureHeight = texture.$getTextureHeight();
                        offsetX = texture.$offsetX;
                        offsetY = texture.$offsetY;
                    }
                    if (isFirstChar) {
                        isFirstChar = false;
                    }
                    if (isFirstLine) {
                        isFirstLine = false;
                    }
                    if (hasWidthSet && j > 0 && xPos + texureWidth > textFieldWidth) {
                        if (!setLineData(line.substring(0, j)))
                            break;
                        line = line.substring(j);
                        len = line.length;
                        j = 0;
                        if (j == len - 1) {
                            xPos = texureWidth;
                        }
                        else {
                            xPos = bitmapFont.getConfig(character, "xadvance") || texureWidth;
                        }
                        lineHeight = textureHeight;
                        continue;
                    }
                    if (j == len - 1) {
                        xPos += texureWidth;
                    }
                    else {
                        xPos += bitmapFont.getConfig(character, "xadvance") || texureWidth;
                    }
                    lineHeight = Math.max(textureHeight, lineHeight);
                }
                if (textFieldHeight && i > 0 && textHeight > textFieldHeight) {
                    break;
                }
                isLastChar = true;
                if (!setLineData(line))
                    break;
            }
            function setLineData(str) {
                if (textFieldHeight && textLines.length > 0 && textHeight > textFieldHeight) {
                    return false;
                }
                textHeight += lineHeight + lineSpacing;
                if (!isFirstChar && !isLastChar) {
                    xPos -= letterSpacing;
                }
                textLines.push(str);
                lineHeights.push(lineHeight);
                textLinesWidth.push(xPos);
                textWidth = Math.max(xPos, textWidth);
                return true;
            }
            textHeight -= lineSpacing;
            self.$textWidth = textWidth;
            self.$textHeight = textHeight;
            this.$textOffsetX = textOffsetX;
            this.$textOffsetY = textOffsetY;
            this.$textStartX = 0;
            this.$textStartY = 0;
            var alignType;
            if (textFieldWidth > textWidth) {
                alignType = self.$textAlign;
                if (alignType == egret.HorizontalAlign.RIGHT) {
                    this.$textStartX = textFieldWidth - textWidth;
                }
                else if (alignType == egret.HorizontalAlign.CENTER) {
                    this.$textStartX = Math.floor((textFieldWidth - textWidth) / 2);
                }
            }
            if (textFieldHeight > textHeight) {
                alignType = self.$verticalAlign;
                if (alignType == egret.VerticalAlign.BOTTOM) {
                    this.$textStartY = textFieldHeight - textHeight;
                }
                else if (alignType == egret.VerticalAlign.MIDDLE) {
                    this.$textStartY = Math.floor((textFieldHeight - textHeight) / 2);
                }
            }
            return textLines;
        };
        BitmapText.EMPTY_FACTOR = 0.33;
        return BitmapText;
    }(egret.DisplayObject));
    egret.BitmapText = BitmapText;
})(egret || (egret = {}));
var egret;
(function (egret) {
    var HtmlTextParser = (function () {
        function HtmlTextParser() {
            this.replaceArr = [];
            this.resutlArr = [];
            this.initReplaceArr();
        }
        HtmlTextParser.prototype.initReplaceArr = function () {
            this.replaceArr = [];
            this.replaceArr.push([/&lt;/g, "<"]);
            this.replaceArr.push([/&gt;/g, ">"]);
            this.replaceArr.push([/&amp;/g, "&"]);
            this.replaceArr.push([/&quot;/g, "\""]);
            this.replaceArr.push([/&apos;/g, "\'"]);
        };
        HtmlTextParser.prototype.replaceSpecial = function (value) {
            for (var i = 0; i < this.replaceArr.length; i++) {
                var k = this.replaceArr[i][0];
                var v = this.replaceArr[i][1];
                value = value.replace(k, v);
            }
            return value;
        };
        HtmlTextParser.prototype.parse = function (htmltext) {
            this.stackArray = [];
            this.resutlArr = [];
            var firstIdx = 0;
            var length = htmltext.length;
            while (firstIdx < length) {
                var starIdx = htmltext.indexOf("<", firstIdx);
                if (starIdx < 0) {
                    this.addToResultArr(htmltext.substring(firstIdx));
                    firstIdx = length;
                }
                else {
                    this.addToResultArr(htmltext.substring(firstIdx, starIdx));
                    var fontEnd = htmltext.indexOf(">", starIdx);
                    if (fontEnd == -1) {
                        egret.error(1038);
                        fontEnd = starIdx;
                    }
                    else if (htmltext.charAt(starIdx + 1) == "\/") {
                        this.stackArray.pop();
                    }
                    else {
                        this.addToArray(htmltext.substring(starIdx + 1, fontEnd));
                    }
                    firstIdx = fontEnd + 1;
                }
            }
            return this.resutlArr;
        };
        HtmlTextParser.prototype.parser = function (htmltext) {
            return this.parse(htmltext);
        };
        HtmlTextParser.prototype.addToResultArr = function (value) {
            if (value == "") {
                return;
            }
            value = this.replaceSpecial(value);
            if (this.stackArray.length > 0) {
                this.resutlArr.push({ text: value, style: this.stackArray[this.stackArray.length - 1] });
            }
            else {
                this.resutlArr.push({ text: value });
            }
        };
        HtmlTextParser.prototype.changeStringToObject = function (str) {
            str = str.trim();
            var info = {};
            var header = [];
            if (str.charAt(0) == "i" || str.charAt(0) == "b" || str.charAt(0) == "u") {
                this.addProperty(info, str, "true");
            }
            else if (header = str.match(/^(font|a)\s/)) {
                str = str.substring(header[0].length).trim();
                var next = 0;
                var titles = void 0;
                while (titles = str.match(this.getHeadReg())) {
                    var title = titles[0];
                    var value = "";
                    str = str.substring(title.length).trim();
                    if (str.charAt(0) == "\"") {
                        next = str.indexOf("\"", 1);
                        value = str.substring(1, next);
                        next += 1;
                    }
                    else if (str.charAt(0) == "\'") {
                        next = str.indexOf("\'", 1);
                        value = str.substring(1, next);
                        next += 1;
                    }
                    else {
                        value = str.match(/(\S)+/)[0];
                        next = value.length;
                    }
                    this.addProperty(info, title.substring(0, title.length - 1).trim(), value.trim());
                    str = str.substring(next).trim();
                }
            }
            return info;
        };
        HtmlTextParser.prototype.getHeadReg = function () {
            return /^(color|textcolor|strokecolor|stroke|b|bold|i|italic|u|size|fontfamily|href|target)(\s)*=/;
        };
        HtmlTextParser.prototype.addProperty = function (info, head, value) {
            switch (head.toLowerCase()) {
                case "color":
                case "textcolor":
                    value = value.replace(/#/, "0x");
                    info.textColor = parseInt(value);
                    break;
                case "strokecolor":
                    value = value.replace(/#/, "0x");
                    info.strokeColor = parseInt(value);
                    break;
                case "stroke":
                    info.stroke = parseInt(value);
                    break;
                case "b":
                case "bold":
                    info.bold = value == "true";
                    break;
                case "u":
                    info.underline = value == "true";
                    break;
                case "i":
                case "italic":
                    info.italic = value == "true";
                    break;
                case "size":
                    info.size = parseInt(value);
                    break;
                case "fontfamily":
                    info.fontFamily = value;
                    break;
                case "href":
                    info.href = this.replaceSpecial(value);
                    break;
                case "target":
                    info.target = this.replaceSpecial(value);
                    break;
            }
        };
        HtmlTextParser.prototype.addToArray = function (infoStr) {
            var info = this.changeStringToObject(infoStr);
            if (this.stackArray.length == 0) {
                this.stackArray.push(info);
            }
            else {
                var lastInfo = this.stackArray[this.stackArray.length - 1];
                for (var key in lastInfo) {
                    if (info[key] == null) {
                        info[key] = lastInfo[key];
                    }
                }
                this.stackArray.push(info);
            }
        };
        return HtmlTextParser;
    }());
    egret.HtmlTextParser = HtmlTextParser;
})(egret || (egret = {}));
var egret;
(function (egret) {
})(egret || (egret = {}));
var egret;
(function (egret) {
    var InputController = (function (_super) {
        __extends(InputController, _super);
        function InputController() {
            var _this = _super.call(this) || this;
            _this.stageTextAdded = false;
            _this._text = null;
            _this._isFocus = false;
            return _this;
        }
        InputController.prototype.init = function (text) {
            this._text = text;
            this.stageText = new egret.StageText();
            this.stageText.$setTextField(this._text);
        };
        InputController.prototype._addStageText = function () {
            if (this.stageTextAdded) {
                return;
            }
            if (!this._text.$inputEnabled) {
                this._text.$touchEnabled = true;
            }
            this.tempStage = this._text.stage;
            this.stageText.$addToStage();
            this.stageText.addEventListener("updateText", this.updateTextHandler, this);
            this._text.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onMouseDownHandler, this);
            this._text.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onMouseMoveHandler, this);
            this.stageText.addEventListener("blur", this.blurHandler, this);
            this.stageText.addEventListener("focus", this.focusHandler, this);
            this.stageTextAdded = true;
        };
        InputController.prototype._removeStageText = function () {
            if (!this.stageTextAdded) {
                return;
            }
            if (!this._text.$inputEnabled) {
                this._text.$touchEnabled = false;
            }
            this.stageText.$removeFromStage();
            this.stageText.removeEventListener("updateText", this.updateTextHandler, this);
            this._text.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onMouseDownHandler, this);
            this._text.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onMouseMoveHandler, this);
            this.tempStage.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onStageDownHandler, this);
            this.stageText.removeEventListener("blur", this.blurHandler, this);
            this.stageText.removeEventListener("focus", this.focusHandler, this);
            this.stageTextAdded = false;
        };
        InputController.prototype._getText = function () {
            return this.stageText.$getText();
        };
        InputController.prototype._setText = function (value) {
            this.stageText.$setText(value);
        };
        InputController.prototype._setColor = function (value) {
            this.stageText.$setColor(value);
        };
        InputController.prototype.focusHandler = function (event) {
            if (!this._isFocus) {
                this._isFocus = true;
                if (!event["showing"]) {
                    this._text.$setIsTyping(true);
                }
                this._text.dispatchEvent(new egret.FocusEvent(egret.FocusEvent.FOCUS_IN, true));
            }
        };
        InputController.prototype.blurHandler = function (event) {
            if (this._isFocus) {
                this._isFocus = false;
                this.tempStage.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onStageDownHandler, this);
                this._text.$setIsTyping(false);
                this.stageText.$onBlur();
                this._text.dispatchEvent(new egret.FocusEvent(egret.FocusEvent.FOCUS_OUT, true));
            }
        };
        InputController.prototype.onMouseDownHandler = function (event) {
            this.$onFocus();
        };
        InputController.prototype.onMouseMoveHandler = function (event) {
            this.stageText.$hide();
        };
        InputController.prototype.$onFocus = function () {
            var _this = this;
            var self = this;
            if (!this._text.visible) {
                return;
            }
            if (this._isFocus) {
                return;
            }
            this.tempStage.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onStageDownHandler, this);
            egret.callLater(function () {
                _this.tempStage.addEventListener(egret.TouchEvent.TOUCH_BEGIN, _this.onStageDownHandler, _this);
            }, this);
            if (egret.nativeRender) {
                this.stageText.$setText(this._text.$TextField[13]);
            }
            this.stageText.$show();
        };
        InputController.prototype.onStageDownHandler = function (event) {
            if (event.$target != this._text) {
                this.stageText.$hide();
            }
        };
        InputController.prototype.updateTextHandler = function (event) {
            var values = this._text.$TextField;
            var textValue = this.stageText.$getText();
            var isChanged = false;
            var reg;
            var result;
            if (values[35] != null) {
                reg = new RegExp("[" + values[35] + "]", "g");
                result = textValue.match(reg);
                if (result) {
                    textValue = result.join("");
                }
                else {
                    textValue = "";
                }
                isChanged = true;
            }
            if (values[36] != null) {
                reg = new RegExp("[^" + values[36] + "]", "g");
                result = textValue.match(reg);
                if (result) {
                    textValue = result.join("");
                }
                else {
                    textValue = "";
                }
                isChanged = true;
            }
            if (isChanged && this.stageText.$getText() != textValue) {
                this.stageText.$setText(textValue);
            }
            this.resetText();
            this._text.dispatchEvent(new egret.Event(egret.Event.CHANGE, true));
        };
        InputController.prototype.resetText = function () {
            this._text.$setBaseText(this.stageText.$getText());
        };
        InputController.prototype._hideInput = function () {
            this.stageText.$removeFromStage();
        };
        InputController.prototype.updateInput = function () {
            if (!this._text.$visible && this.stageText) {
                this._hideInput();
            }
        };
        InputController.prototype._updateProperties = function () {
            if (this._isFocus) {
                this.stageText.$resetStageText();
                this.updateInput();
                return;
            }
            this.stageText.$setText(this._text.$TextField[13]);
            this.stageText.$resetStageText();
            this.updateInput();
        };
        return InputController;
    }(egret.HashObject));
    egret.InputController = InputController;
})(egret || (egret = {}));
var egret;
(function (egret) {
    var TextFieldInputType = (function () {
        function TextFieldInputType() {
        }
        TextFieldInputType.TEXT = "text";
        TextFieldInputType.TEL = "tel";
        TextFieldInputType.PASSWORD = "password";
        return TextFieldInputType;
    }());
    egret.TextFieldInputType = TextFieldInputType;
})(egret || (egret = {}));
var egret;
(function (egret) {
    var sys;
    (function (sys) {
    })(sys = egret.sys || (egret.sys = {}));
})(egret || (egret = {}));
var egret;
(function (egret) {
    var web;
    (function (web) {
        var HTML5StageText = (function (_super) {
            __extends(HTML5StageText, _super);
            function HTML5StageText() {
                var _this = _super.call(this) || this;
                _this._isNeedShow = false;
                _this.inputElement = null;
                _this.inputDiv = null;
                _this._gscaleX = 0;
                _this._gscaleY = 0;
                _this.textValue = "";
                _this.colorValue = 0xffffff;
                _this._styleInfoes = {};
                return _this;
            }
            HTML5StageText.prototype.$setTextField = function (textfield) {
                this.$textfield = textfield;
                return true;
            };
            HTML5StageText.prototype.$addToStage = function () {
                this.htmlInput = egret.web.$getTextAdapter(this.$textfield);
            };
            HTML5StageText.prototype._initElement = function () {
                var point = this.$textfield.localToGlobal(0, 0);
                var x = point.x;
                var y = point.y;
                var scaleX = this.htmlInput.$scaleX;
                var scaleY = this.htmlInput.$scaleY;
                this.inputDiv.style.left = x * scaleX + "px";
                this.inputDiv.style.top = y * scaleY + "px";
                if (this.$textfield.multiline && this.$textfield.height > this.$textfield.size) {
                    this.inputDiv.style.top = (y) * scaleY + "px";
                    this.inputElement.style.top = (-this.$textfield.lineSpacing / 2) * scaleY + "px";
                }
                else {
                    this.inputDiv.style.top = y * scaleY + "px";
                    this.inputElement.style.top = 0 + "px";
                }
                var node = this.$textfield;
                var cX = 1;
                var cY = 1;
                var rotation = 0;
                while (node.parent) {
                    cX *= node.scaleX;
                    cY *= node.scaleY;
                    rotation += node.rotation;
                    node = node.parent;
                }
                var transformKey = egret.web.getPrefixStyleName("transform");
                this.inputDiv.style[transformKey] = "rotate(" + rotation + "deg)";
                this._gscaleX = scaleX * cX;
                this._gscaleY = scaleY * cY;
            };
            HTML5StageText.prototype.$show = function () {
                if (!this.htmlInput.isCurrentStageText(this)) {
                    this.inputElement = this.htmlInput.getInputElement(this);
                    if (!this.$textfield.multiline) {
                        this.inputElement.type = this.$textfield.inputType;
                    }
                    else {
                        this.inputElement.type = "text";
                    }
                    this.inputDiv = this.htmlInput._inputDIV;
                }
                else {
                    this.inputElement.onblur = null;
                }
                this.htmlInput._needShow = true;
                this._isNeedShow = true;
                this._initElement();
            };
            HTML5StageText.prototype.onBlurHandler = function () {
                this.htmlInput.clearInputElement();
                window.scrollTo(0, 0);
            };
            HTML5StageText.prototype.onFocusHandler = function () {
                var self = this;
                window.setTimeout(function () {
                    if (self.inputElement) {
                        self.inputElement.scrollIntoView();
                    }
                }, 200);
            };
            HTML5StageText.prototype.executeShow = function () {
                var self = this;
                this.inputElement.value = this.$getText();
                if (this.inputElement.onblur == null) {
                    this.inputElement.onblur = this.onBlurHandler.bind(this);
                }
                if (this.inputElement.onfocus == null) {
                    this.inputElement.onfocus = this.onFocusHandler.bind(this);
                }
                this.$resetStageText();
                if (this.$textfield.maxChars > 0) {
                    this.inputElement.setAttribute("maxlength", this.$textfield.maxChars + "");
                }
                else {
                    this.inputElement.removeAttribute("maxlength");
                }
                this.inputElement.selectionStart = this.inputElement.value.length;
                this.inputElement.selectionEnd = this.inputElement.value.length;
                this.inputElement.focus();
            };
            HTML5StageText.prototype.$hide = function () {
                if (this.htmlInput) {
                    this.htmlInput.disconnectStageText(this);
                }
            };
            HTML5StageText.prototype.$getText = function () {
                if (!this.textValue) {
                    this.textValue = "";
                }
                return this.textValue;
            };
            HTML5StageText.prototype.$setText = function (value) {
                this.textValue = value;
                this.resetText();
                return true;
            };
            HTML5StageText.prototype.resetText = function () {
                if (this.inputElement) {
                    this.inputElement.value = this.textValue;
                }
            };
            HTML5StageText.prototype.$setColor = function (value) {
                this.colorValue = value;
                this.resetColor();
                return true;
            };
            HTML5StageText.prototype.resetColor = function () {
                if (this.inputElement) {
                    this.setElementStyle("color", egret.toColorString(this.colorValue));
                }
            };
            HTML5StageText.prototype.$onBlur = function () {
            };
            HTML5StageText.prototype._onInput = function () {
                var self = this;
                window.setTimeout(function () {
                    if (self.inputElement && self.inputElement.selectionStart == self.inputElement.selectionEnd) {
                        self.textValue = self.inputElement.value;
                        egret.Event.dispatchEvent(self, "updateText", false);
                    }
                }, 0);
            };
            HTML5StageText.prototype.setAreaHeight = function () {
                var textfield = this.$textfield;
                if (textfield.multiline) {
                    var textheight = egret.TextFieldUtils.$getTextHeight(textfield);
                    if (textfield.height <= textfield.size) {
                        this.setElementStyle("height", (textfield.size) * this._gscaleY + "px");
                        this.setElementStyle("padding", "0px");
                        this.setElementStyle("lineHeight", (textfield.size) * this._gscaleY + "px");
                    }
                    else if (textfield.height < textheight) {
                        this.setElementStyle("height", (textfield.height) * this._gscaleY + "px");
                        this.setElementStyle("padding", "0px");
                        this.setElementStyle("lineHeight", (textfield.size + textfield.lineSpacing) * this._gscaleY + "px");
                    }
                    else {
                        this.setElementStyle("height", (textheight + textfield.lineSpacing) * this._gscaleY + "px");
                        var rap = (textfield.height - textheight) * this._gscaleY;
                        var valign = egret.TextFieldUtils.$getValign(textfield);
                        var top_1 = rap * valign;
                        var bottom = rap - top_1;
                        this.setElementStyle("padding", top_1 + "px 0px " + bottom + "px 0px");
                        this.setElementStyle("lineHeight", (textfield.size + textfield.lineSpacing) * this._gscaleY + "px");
                    }
                }
            };
            HTML5StageText.prototype._onClickHandler = function (e) {
                if (this._isNeedShow) {
                    e.stopImmediatePropagation();
                    this._isNeedShow = false;
                    this.executeShow();
                    this.dispatchEvent(new egret.Event("focus"));
                }
            };
            HTML5StageText.prototype._onDisconnect = function () {
                this.inputElement = null;
                this.dispatchEvent(new egret.Event("blur"));
            };
            HTML5StageText.prototype.setElementStyle = function (style, value) {
                if (this.inputElement) {
                    if (this._styleInfoes[style] != value) {
                        this.inputElement.style[style] = value;
                    }
                }
            };
            HTML5StageText.prototype.$removeFromStage = function () {
                if (this.inputElement) {
                    this.htmlInput.disconnectStageText(this);
                }
            };
            HTML5StageText.prototype.$resetStageText = function () {
                if (this.inputElement) {
                    var textfield = this.$textfield;
                    this.setElementStyle("fontFamily", textfield.fontFamily);
                    this.setElementStyle("fontStyle", textfield.italic ? "italic" : "normal");
                    this.setElementStyle("fontWeight", textfield.bold ? "bold" : "normal");
                    this.setElementStyle("textAlign", textfield.textAlign);
                    this.setElementStyle("fontSize", textfield.size * this._gscaleY + "px");
                    this.setElementStyle("color", egret.toColorString(textfield.textColor));
                    var tw = void 0;
                    if (textfield.stage) {
                        tw = textfield.localToGlobal(0, 0).x;
                        tw = Math.min(textfield.width, textfield.stage.stageWidth - tw);
                    }
                    else {
                        tw = textfield.width;
                    }
                    this.setElementStyle("width", tw * this._gscaleX + "px");
                    this.setElementStyle("verticalAlign", textfield.verticalAlign);
                    if (textfield.multiline) {
                        this.setAreaHeight();
                    }
                    else {
                        this.setElementStyle("lineHeight", (textfield.size) * this._gscaleY + "px");
                        if (textfield.height < textfield.size) {
                            this.setElementStyle("height", (textfield.size) * this._gscaleY + "px");
                            var bottom = (textfield.size / 2) * this._gscaleY;
                            this.setElementStyle("padding", "0px 0px " + bottom + "px 0px");
                        }
                        else {
                            this.setElementStyle("height", (textfield.size) * this._gscaleY + "px");
                            var rap = (textfield.height - textfield.size) * this._gscaleY;
                            var valign = egret.TextFieldUtils.$getValign(textfield);
                            var top_2 = rap * valign;
                            var bottom = rap - top_2;
                            if (bottom < textfield.size / 2 * this._gscaleY) {
                                bottom = textfield.size / 2 * this._gscaleY;
                            }
                            this.setElementStyle("padding", top_2 + "px 0px " + bottom + "px 0px");
                        }
                    }
                    this.inputDiv.style.clip = "rect(0px " + (textfield.width * this._gscaleX) + "px " + (textfield.height * this._gscaleY) + "px 0px)";
                    this.inputDiv.style.height = textfield.height * this._gscaleY + "px";
                    this.inputDiv.style.width = tw * this._gscaleX + "px";
                }
            };
            return HTML5StageText;
        }(egret.EventDispatcher));
        web.HTML5StageText = HTML5StageText;
        egret.StageText = HTML5StageText;
    })(web = egret.web || (egret.web = {}));
})(egret || (egret = {}));
(function (egret) {
    var web;
    (function (web) {
        var HTMLInput = (function () {
            function HTMLInput() {
                this._needShow = false;
                this.$scaleX = 1;
                this.$scaleY = 1;
            }
            HTMLInput.prototype.isInputOn = function () {
                return this._stageText != null;
            };
            HTMLInput.prototype.isCurrentStageText = function (stageText) {
                return this._stageText == stageText;
            };
            HTMLInput.prototype.initValue = function (dom) {
                dom.style.position = "absolute";
                dom.style.left = "0px";
                dom.style.top = "0px";
                dom.style.border = "none";
                dom.style.padding = "0";
                dom.ontouchmove = function (e) {
                    e.preventDefault();
                };
            };
            HTMLInput.prototype.$updateSize = function () {
                if (!this.canvas) {
                    return;
                }
                this.$scaleX = egret.sys.DisplayList.$canvasScaleX;
                this.$scaleY = egret.sys.DisplayList.$canvasScaleY;
                this.StageDelegateDiv.style.left = this.canvas.style.left;
                this.StageDelegateDiv.style.top = this.canvas.style.top;
                var transformKey = egret.web.getPrefixStyleName("transform");
                this.StageDelegateDiv.style[transformKey] = this.canvas.style[transformKey];
                this.StageDelegateDiv.style[egret.web.getPrefixStyleName("transformOrigin")] = "0% 0% 0px";
            };
            HTMLInput.prototype._initStageDelegateDiv = function (container, canvas) {
                this.canvas = canvas;
                var self = this;
                var stageDelegateDiv;
                if (!stageDelegateDiv) {
                    stageDelegateDiv = document.createElement("div");
                    this.StageDelegateDiv = stageDelegateDiv;
                    stageDelegateDiv.id = "StageDelegateDiv";
                    container.appendChild(stageDelegateDiv);
                    self.initValue(stageDelegateDiv);
                    self._inputDIV = document.createElement("div");
                    self.initValue(self._inputDIV);
                    self._inputDIV.style.width = "0px";
                    self._inputDIV.style.height = "0px";
                    self._inputDIV.style.left = 0 + "px";
                    self._inputDIV.style.top = "-100px";
                    self._inputDIV.style[egret.web.getPrefixStyleName("transformOrigin")] = "0% 0% 0px";
                    stageDelegateDiv.appendChild(self._inputDIV);
                    this.canvas.addEventListener("click", function (e) {
                        if (self._needShow) {
                            self._needShow = false;
                            self._stageText._onClickHandler(e);
                            self.show();
                        }
                        else {
                            if (self._inputElement) {
                                self.clearInputElement();
                                self._inputElement.blur();
                                self._inputElement = null;
                            }
                        }
                    });
                    self.initInputElement(true);
                    self.initInputElement(false);
                }
            };
            HTMLInput.prototype.initInputElement = function (multiline) {
                var self = this;
                var inputElement;
                if (multiline) {
                    inputElement = document.createElement("textarea");
                    inputElement.style["resize"] = "none";
                    self._multiElement = inputElement;
                    inputElement.id = "egretTextarea";
                }
                else {
                    inputElement = document.createElement("input");
                    self._simpleElement = inputElement;
                    inputElement.id = "egretInput";
                }
                inputElement.type = "text";
                self._inputDIV.appendChild(inputElement);
                inputElement.setAttribute("tabindex", "-1");
                inputElement.style.width = "1px";
                inputElement.style.height = "12px";
                self.initValue(inputElement);
                inputElement.style.outline = "thin";
                inputElement.style.background = "none";
                inputElement.style.overflow = "hidden";
                inputElement.style.wordBreak = "break-all";
                inputElement.style.opacity = "0";
                inputElement.oninput = function () {
                    if (self._stageText) {
                        self._stageText._onInput();
                    }
                };
            };
            HTMLInput.prototype.show = function () {
                var self = this;
                var inputElement = self._inputElement;
                egret.$callAsync(function () {
                    inputElement.style.opacity = "1";
                }, self);
            };
            HTMLInput.prototype.disconnectStageText = function (stageText) {
                if (this._stageText == null || this._stageText == stageText) {
                    if (this._inputElement) {
                        this._inputElement.blur();
                    }
                    this.clearInputElement();
                }
                this._needShow = false;
            };
            HTMLInput.prototype.clearInputElement = function () {
                var self = this;
                if (self._inputElement) {
                    self._inputElement.value = "";
                    self._inputElement.onblur = null;
                    self._inputElement.onfocus = null;
                    self._inputElement.style.width = "1px";
                    self._inputElement.style.height = "12px";
                    self._inputElement.style.left = "0px";
                    self._inputElement.style.top = "0px";
                    self._inputElement.style.opacity = "0";
                    var otherElement = void 0;
                    if (self._simpleElement == self._inputElement) {
                        otherElement = self._multiElement;
                    }
                    else {
                        otherElement = self._simpleElement;
                    }
                    otherElement.style.display = "block";
                    self._inputDIV.style.left = 0 + "px";
                    self._inputDIV.style.top = "-100px";
                    self._inputDIV.style.height = 0 + "px";
                    self._inputDIV.style.width = 0 + "px";
                    self._inputElement.blur();
                }
                if (self._stageText) {
                    self._stageText._onDisconnect();
                    self._stageText = null;
                    this.canvas['userTyping'] = false;
                }
            };
            HTMLInput.prototype.getInputElement = function (stageText) {
                var self = this;
                self.clearInputElement();
                self._stageText = stageText;
                this.canvas['userTyping'] = true;
                if (self._stageText.$textfield.multiline) {
                    self._inputElement = self._multiElement;
                }
                else {
                    self._inputElement = self._simpleElement;
                }
                var otherElement;
                if (self._simpleElement == self._inputElement) {
                    otherElement = self._multiElement;
                }
                else {
                    otherElement = self._simpleElement;
                }
                otherElement.style.display = "none";
                return self._inputElement;
            };
            return HTMLInput;
        }());
        web.HTMLInput = HTMLInput;
    })(web = egret.web || (egret.web = {}));
})(egret || (egret = {}));
(function (egret) {
    var web;
    (function (web) {
        var stageToTextLayerMap = {};
        var stageToCanvasMap = {};
        var stageToContainerMap = {};
        function $getTextAdapter(textfield) {
            var stageHash = textfield.stage ? textfield.stage.$hashCode : 0;
            var adapter = stageToTextLayerMap[stageHash];
            var canvas = stageToCanvasMap[stageHash];
            var container = stageToContainerMap[stageHash];
            if (canvas && container) {
                delete stageToCanvasMap[stageHash];
                delete stageToContainerMap[stageHash];
            }
            return adapter;
        }
        web.$getTextAdapter = $getTextAdapter;
        function $cacheTextAdapter(adapter, stage, container, canvas) {
            adapter._initStageDelegateDiv(container, canvas);
            stageToTextLayerMap[stage.$hashCode] = adapter;
            stageToCanvasMap[stage.$hashCode] = canvas;
            stageToContainerMap[stage.$hashCode] = container;
        }
        web.$cacheTextAdapter = $cacheTextAdapter;
    })(web = egret.web || (egret.web = {}));
})(egret || (egret = {}));
var egret;
(function (egret) {
    var web;
    (function (web) {
        var context = null;
        var fontCache = {};
        function measureText(text, fontFamily, fontSize, bold, italic) {
            if (!context) {
                createContext();
            }
            var font = "";
            if (italic)
                font += "italic ";
            if (bold)
                font += "bold ";
            font += (fontSize || 12) + "px ";
            font += (fontFamily || "Arial");
            context.font = font;
            return egret.sys.measureTextWith(context, text);
        }
        function createContext() {
            context = egret.sys.canvasHitTestBuffer.context;
            context.textAlign = "left";
            context.textBaseline = "middle";
        }
        egret.sys.measureText = measureText;
    })(web = egret.web || (egret.web = {}));
})(egret || (egret = {}));
var egret;
(function (egret) {
    var Base64Util = (function () {
        function Base64Util() {
        }
        Base64Util.encode = function (arraybuffer) {
            var bytes = new Uint8Array(arraybuffer);
            var len = bytes.length;
            var base64 = '';
            for (var i = 0; i < len; i += 3) {
                base64 += chars[bytes[i] >> 2];
                base64 += chars[((bytes[i] & 3) << 4) | (bytes[i + 1] >> 4)];
                base64 += chars[((bytes[i + 1] & 15) << 2) | (bytes[i + 2] >> 6)];
                base64 += chars[bytes[i + 2] & 63];
            }
            if ((len % 3) === 2) {
                base64 = base64.substring(0, base64.length - 1) + '=';
            }
            else if (len % 3 === 1) {
                base64 = base64.substring(0, base64.length - 2) + '==';
            }
            return base64;
        };
        Base64Util.decode = function (base64) {
            var bufferLength = base64.length * 0.75;
            var len = base64.length;
            var p = 0;
            var encoded1 = 0;
            var encoded2 = 0;
            var encoded3 = 0;
            var encoded4 = 0;
            if (base64[base64.length - 1] === '=') {
                bufferLength--;
                if (base64[base64.length - 2] === '=') {
                    bufferLength--;
                }
            }
            var arraybuffer = new ArrayBuffer(bufferLength), bytes = new Uint8Array(arraybuffer);
            for (var i = 0; i < len; i += 4) {
                encoded1 = lookup[base64.charCodeAt(i)];
                encoded2 = lookup[base64.charCodeAt(i + 1)];
                encoded3 = lookup[base64.charCodeAt(i + 2)];
                encoded4 = lookup[base64.charCodeAt(i + 3)];
                bytes[p++] = (encoded1 << 2) | (encoded2 >> 4);
                bytes[p++] = ((encoded2 & 15) << 4) | (encoded3 >> 2);
                bytes[p++] = ((encoded3 & 3) << 6) | (encoded4 & 63);
            }
            return arraybuffer;
        };
        return Base64Util;
    }());
    egret.Base64Util = Base64Util;
})(egret || (egret = {}));
var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
var lookup = new Uint8Array(256);
for (var i = 0; i < chars.length; i++) {
    lookup[chars.charCodeAt(i)] = i;
}
var egret;
(function (egret) {
    var Endian = (function () {
        function Endian() {
        }
        Endian.LITTLE_ENDIAN = "littleEndian";
        Endian.BIG_ENDIAN = "bigEndian";
        return Endian;
    }());
    egret.Endian = Endian;
    var ByteArray = (function () {
        function ByteArray(buffer, bufferExtSize) {
            if (bufferExtSize === void 0) { bufferExtSize = 0; }
            this.bufferExtSize = 0;
            this.EOF_byte = -1;
            this.EOF_code_point = -1;
            if (bufferExtSize < 0) {
                bufferExtSize = 0;
            }
            this.bufferExtSize = bufferExtSize;
            var bytes, wpos = 0;
            if (buffer) {
                var uint8 = void 0;
                if (buffer instanceof Uint8Array) {
                    uint8 = buffer;
                    wpos = buffer.length;
                }
                else {
                    wpos = buffer.byteLength;
                    uint8 = new Uint8Array(buffer);
                }
                if (bufferExtSize == 0) {
                    bytes = new Uint8Array(wpos);
                }
                else {
                    var multi = (wpos / bufferExtSize | 0) + 1;
                    bytes = new Uint8Array(multi * bufferExtSize);
                }
                bytes.set(uint8);
            }
            else {
                bytes = new Uint8Array(bufferExtSize);
            }
            this.write_position = wpos;
            this._position = 0;
            this._bytes = bytes;
            this.data = new DataView(bytes.buffer);
            this.endian = Endian.BIG_ENDIAN;
        }
        Object.defineProperty(ByteArray.prototype, "endian", {
            get: function () {
                return this.$endian == 0 ? Endian.LITTLE_ENDIAN : Endian.BIG_ENDIAN;
            },
            set: function (value) {
                this.$endian = value == Endian.LITTLE_ENDIAN ? 0 : 1;
            },
            enumerable: true,
            configurable: true
        });
        ByteArray.prototype.setArrayBuffer = function (buffer) {
        };
        Object.defineProperty(ByteArray.prototype, "readAvailable", {
            get: function () {
                return this.write_position - this._position;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ByteArray.prototype, "buffer", {
            get: function () {
                return this.data.buffer.slice(0, this.write_position);
            },
            set: function (value) {
                var wpos = value.byteLength;
                var uint8 = new Uint8Array(value);
                var bufferExtSize = this.bufferExtSize;
                var bytes;
                if (bufferExtSize == 0) {
                    bytes = new Uint8Array(wpos);
                }
                else {
                    var multi = (wpos / bufferExtSize | 0) + 1;
                    bytes = new Uint8Array(multi * bufferExtSize);
                }
                bytes.set(uint8);
                this.write_position = wpos;
                this._bytes = bytes;
                this.data = new DataView(bytes.buffer);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ByteArray.prototype, "rawBuffer", {
            get: function () {
                return this.data.buffer;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ByteArray.prototype, "bytes", {
            get: function () {
                return this._bytes;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ByteArray.prototype, "dataView", {
            get: function () {
                return this.data;
            },
            set: function (value) {
                this.buffer = value.buffer;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ByteArray.prototype, "bufferOffset", {
            get: function () {
                return this.data.byteOffset;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ByteArray.prototype, "position", {
            get: function () {
                return this._position;
            },
            set: function (value) {
                this._position = value;
                if (value > this.write_position) {
                    this.write_position = value;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ByteArray.prototype, "length", {
            get: function () {
                return this.write_position;
            },
            set: function (value) {
                this.write_position = value;
                if (this.data.byteLength > value) {
                    this._position = value;
                }
                this._validateBuffer(value);
            },
            enumerable: true,
            configurable: true
        });
        ByteArray.prototype._validateBuffer = function (value) {
            if (this.data.byteLength < value) {
                var be = this.bufferExtSize;
                var tmp = void 0;
                if (be == 0) {
                    tmp = new Uint8Array(value);
                }
                else {
                    var nLen = ((value / be >> 0) + 1) * be;
                    tmp = new Uint8Array(nLen);
                }
                tmp.set(this._bytes);
                this._bytes = tmp;
                this.data = new DataView(tmp.buffer);
            }
        };
        Object.defineProperty(ByteArray.prototype, "bytesAvailable", {
            get: function () {
                return this.data.byteLength - this._position;
            },
            enumerable: true,
            configurable: true
        });
        ByteArray.prototype.clear = function () {
            var buffer = new ArrayBuffer(this.bufferExtSize);
            this.data = new DataView(buffer);
            this._bytes = new Uint8Array(buffer);
            this._position = 0;
            this.write_position = 0;
        };
        ByteArray.prototype.readBoolean = function () {
            if (this.validate(1))
                return !!this._bytes[this.position++];
        };
        ByteArray.prototype.readByte = function () {
            if (this.validate(1))
                return this.data.getInt8(this.position++);
        };
        ByteArray.prototype.readBytes = function (bytes, offset, length) {
            if (offset === void 0) { offset = 0; }
            if (length === void 0) { length = 0; }
            if (!bytes) {
                return;
            }
            var pos = this._position;
            var available = this.write_position - pos;
            if (available < 0) {
                egret.error(1025);
                return;
            }
            if (length == 0) {
                length = available;
            }
            else if (length > available) {
                egret.error(1025);
                return;
            }
            var position = bytes._position;
            bytes._position = 0;
            bytes.validateBuffer(offset + length);
            bytes._position = position;
            bytes._bytes.set(this._bytes.subarray(pos, pos + length), offset);
            this.position += length;
        };
        ByteArray.prototype.readDouble = function () {
            if (this.validate(8)) {
                var value = this.data.getFloat64(this._position, this.$endian == 0);
                this.position += 8;
                return value;
            }
        };
        ByteArray.prototype.readFloat = function () {
            if (this.validate(4)) {
                var value = this.data.getFloat32(this._position, this.$endian == 0);
                this.position += 4;
                return value;
            }
        };
        ByteArray.prototype.readInt = function () {
            if (this.validate(4)) {
                var value = this.data.getInt32(this._position, this.$endian == 0);
                this.position += 4;
                return value;
            }
        };
        ByteArray.prototype.readShort = function () {
            if (this.validate(2)) {
                var value = this.data.getInt16(this._position, this.$endian == 0);
                this.position += 2;
                return value;
            }
        };
        ByteArray.prototype.readUnsignedByte = function () {
            if (this.validate(1))
                return this._bytes[this.position++];
        };
        ByteArray.prototype.readUnsignedInt = function () {
            if (this.validate(4)) {
                var value = this.data.getUint32(this._position, this.$endian == 0);
                this.position += 4;
                return value;
            }
        };
        ByteArray.prototype.readUnsignedShort = function () {
            if (this.validate(2)) {
                var value = this.data.getUint16(this._position, this.$endian == 0);
                this.position += 2;
                return value;
            }
        };
        ByteArray.prototype.readUTF = function () {
            var length = this.readUnsignedShort();
            if (length > 0) {
                return this.readUTFBytes(length);
            }
            else {
                return "";
            }
        };
        ByteArray.prototype.readUTFBytes = function (length) {
            if (!this.validate(length)) {
                return;
            }
            var data = this.data;
            var bytes = new Uint8Array(data.buffer, data.byteOffset + this._position, length);
            this.position += length;
            return this.decodeUTF8(bytes);
        };
        ByteArray.prototype.writeBoolean = function (value) {
            this.validateBuffer(1);
            this._bytes[this.position++] = +value;
        };
        ByteArray.prototype.writeByte = function (value) {
            this.validateBuffer(1);
            this._bytes[this.position++] = value & 0xff;
        };
        ByteArray.prototype.writeBytes = function (bytes, offset, length) {
            if (offset === void 0) { offset = 0; }
            if (length === void 0) { length = 0; }
            var writeLength;
            if (offset < 0) {
                return;
            }
            if (length < 0) {
                return;
            }
            else if (length == 0) {
                writeLength = bytes.length - offset;
            }
            else {
                writeLength = Math.min(bytes.length - offset, length);
            }
            if (writeLength > 0) {
                this.validateBuffer(writeLength);
                this._bytes.set(bytes._bytes.subarray(offset, offset + writeLength), this._position);
                this.position = this._position + writeLength;
            }
        };
        ByteArray.prototype.writeDouble = function (value) {
            this.validateBuffer(8);
            this.data.setFloat64(this._position, value, this.$endian == 0);
            this.position += 8;
        };
        ByteArray.prototype.writeFloat = function (value) {
            this.validateBuffer(4);
            this.data.setFloat32(this._position, value, this.$endian == 0);
            this.position += 4;
        };
        ByteArray.prototype.writeInt = function (value) {
            this.validateBuffer(4);
            this.data.setInt32(this._position, value, this.$endian == 0);
            this.position += 4;
        };
        ByteArray.prototype.writeShort = function (value) {
            this.validateBuffer(2);
            this.data.setInt16(this._position, value, this.$endian == 0);
            this.position += 2;
        };
        ByteArray.prototype.writeUnsignedInt = function (value) {
            this.validateBuffer(4);
            this.data.setUint32(this._position, value, this.$endian == 0);
            this.position += 4;
        };
        ByteArray.prototype.writeUnsignedShort = function (value) {
            this.validateBuffer(2);
            this.data.setUint16(this._position, value, this.$endian == 0);
            this.position += 2;
        };
        ByteArray.prototype.writeUTF = function (value) {
            var utf8bytes = this.encodeUTF8(value);
            var length = utf8bytes.length;
            this.validateBuffer(2 + length);
            this.data.setUint16(this._position, length, this.$endian == 0);
            this.position += 2;
            this._writeUint8Array(utf8bytes, false);
        };
        ByteArray.prototype.writeUTFBytes = function (value) {
            this._writeUint8Array(this.encodeUTF8(value));
        };
        ByteArray.prototype.toString = function () {
            return "[ByteArray] length:" + this.length + ", bytesAvailable:" + this.bytesAvailable;
        };
        ByteArray.prototype._writeUint8Array = function (bytes, validateBuffer) {
            if (validateBuffer === void 0) { validateBuffer = true; }
            var pos = this._position;
            var npos = pos + bytes.length;
            if (validateBuffer) {
                this.validateBuffer(npos);
            }
            this.bytes.set(bytes, pos);
            this.position = npos;
        };
        ByteArray.prototype.validate = function (len) {
            var bl = this._bytes.length;
            if (bl > 0 && this._position + len <= bl) {
                return true;
            }
            else {
                egret.error(1025);
            }
        };
        ByteArray.prototype.validateBuffer = function (len) {
            this.write_position = len > this.write_position ? len : this.write_position;
            len += this._position;
            this._validateBuffer(len);
        };
        ByteArray.prototype.encodeUTF8 = function (str) {
            var pos = 0;
            var codePoints = this.stringToCodePoints(str);
            var outputBytes = [];
            while (codePoints.length > pos) {
                var code_point = codePoints[pos++];
                if (this.inRange(code_point, 0xD800, 0xDFFF)) {
                    this.encoderError(code_point);
                }
                else if (this.inRange(code_point, 0x0000, 0x007f)) {
                    outputBytes.push(code_point);
                }
                else {
                    var count = void 0, offset = void 0;
                    if (this.inRange(code_point, 0x0080, 0x07FF)) {
                        count = 1;
                        offset = 0xC0;
                    }
                    else if (this.inRange(code_point, 0x0800, 0xFFFF)) {
                        count = 2;
                        offset = 0xE0;
                    }
                    else if (this.inRange(code_point, 0x10000, 0x10FFFF)) {
                        count = 3;
                        offset = 0xF0;
                    }
                    outputBytes.push(this.div(code_point, Math.pow(64, count)) + offset);
                    while (count > 0) {
                        var temp = this.div(code_point, Math.pow(64, count - 1));
                        outputBytes.push(0x80 + (temp % 64));
                        count -= 1;
                    }
                }
            }
            return new Uint8Array(outputBytes);
        };
        ByteArray.prototype.decodeUTF8 = function (data) {
            var fatal = false;
            var pos = 0;
            var result = "";
            var code_point;
            var utf8_code_point = 0;
            var utf8_bytes_needed = 0;
            var utf8_bytes_seen = 0;
            var utf8_lower_boundary = 0;
            while (data.length > pos) {
                var _byte = data[pos++];
                if (_byte == this.EOF_byte) {
                    if (utf8_bytes_needed != 0) {
                        code_point = this.decoderError(fatal);
                    }
                    else {
                        code_point = this.EOF_code_point;
                    }
                }
                else {
                    if (utf8_bytes_needed == 0) {
                        if (this.inRange(_byte, 0x00, 0x7F)) {
                            code_point = _byte;
                        }
                        else {
                            if (this.inRange(_byte, 0xC2, 0xDF)) {
                                utf8_bytes_needed = 1;
                                utf8_lower_boundary = 0x80;
                                utf8_code_point = _byte - 0xC0;
                            }
                            else if (this.inRange(_byte, 0xE0, 0xEF)) {
                                utf8_bytes_needed = 2;
                                utf8_lower_boundary = 0x800;
                                utf8_code_point = _byte - 0xE0;
                            }
                            else if (this.inRange(_byte, 0xF0, 0xF4)) {
                                utf8_bytes_needed = 3;
                                utf8_lower_boundary = 0x10000;
                                utf8_code_point = _byte - 0xF0;
                            }
                            else {
                                this.decoderError(fatal);
                            }
                            utf8_code_point = utf8_code_point * Math.pow(64, utf8_bytes_needed);
                            code_point = null;
                        }
                    }
                    else if (!this.inRange(_byte, 0x80, 0xBF)) {
                        utf8_code_point = 0;
                        utf8_bytes_needed = 0;
                        utf8_bytes_seen = 0;
                        utf8_lower_boundary = 0;
                        pos--;
                        code_point = this.decoderError(fatal, _byte);
                    }
                    else {
                        utf8_bytes_seen += 1;
                        utf8_code_point = utf8_code_point + (_byte - 0x80) * Math.pow(64, utf8_bytes_needed - utf8_bytes_seen);
                        if (utf8_bytes_seen !== utf8_bytes_needed) {
                            code_point = null;
                        }
                        else {
                            var cp = utf8_code_point;
                            var lower_boundary = utf8_lower_boundary;
                            utf8_code_point = 0;
                            utf8_bytes_needed = 0;
                            utf8_bytes_seen = 0;
                            utf8_lower_boundary = 0;
                            if (this.inRange(cp, lower_boundary, 0x10FFFF) && !this.inRange(cp, 0xD800, 0xDFFF)) {
                                code_point = cp;
                            }
                            else {
                                code_point = this.decoderError(fatal, _byte);
                            }
                        }
                    }
                }
                if (code_point !== null && code_point !== this.EOF_code_point) {
                    if (code_point <= 0xFFFF) {
                        if (code_point > 0)
                            result += String.fromCharCode(code_point);
                    }
                    else {
                        code_point -= 0x10000;
                        result += String.fromCharCode(0xD800 + ((code_point >> 10) & 0x3ff));
                        result += String.fromCharCode(0xDC00 + (code_point & 0x3ff));
                    }
                }
            }
            return result;
        };
        ByteArray.prototype.encoderError = function (code_point) {
            egret.error(1026, code_point);
        };
        ByteArray.prototype.decoderError = function (fatal, opt_code_point) {
            if (fatal) {
                egret.error(1027);
            }
            return opt_code_point || 0xFFFD;
        };
        ByteArray.prototype.inRange = function (a, min, max) {
            return min <= a && a <= max;
        };
        ByteArray.prototype.div = function (n, d) {
            return Math.floor(n / d);
        };
        ByteArray.prototype.stringToCodePoints = function (string) {
            var cps = [];
            var i = 0, n = string.length;
            while (i < string.length) {
                var c = string.charCodeAt(i);
                if (!this.inRange(c, 0xD800, 0xDFFF)) {
                    cps.push(c);
                }
                else if (this.inRange(c, 0xDC00, 0xDFFF)) {
                    cps.push(0xFFFD);
                }
                else {
                    if (i == n - 1) {
                        cps.push(0xFFFD);
                    }
                    else {
                        var d = string.charCodeAt(i + 1);
                        if (this.inRange(d, 0xDC00, 0xDFFF)) {
                            var a = c & 0x3FF;
                            var b = d & 0x3FF;
                            i += 1;
                            cps.push(0x10000 + (a << 10) + b);
                        }
                        else {
                            cps.push(0xFFFD);
                        }
                    }
                }
                i += 1;
            }
            return cps;
        };
        return ByteArray;
    }());
    egret.ByteArray = ByteArray;
})(egret || (egret = {}));
var egret;
(function (egret) {
    var Logger = (function () {
        function Logger() {
        }
        Object.defineProperty(Logger, "logLevel", {
            set: function (logType) {
            },
            enumerable: true,
            configurable: true
        });
        Logger.ALL = "all";
        Logger.DEBUG = "debug";
        Logger.INFO = "info";
        Logger.WARN = "warn";
        Logger.ERROR = "error";
        Logger.OFF = "off";
        return Logger;
    }());
    egret.Logger = Logger;
})(egret || (egret = {}));
var egret;
(function (egret) {
    var NumberUtils = (function () {
        function NumberUtils() {
        }
        NumberUtils.isNumber = function (value) {
            return typeof (value) === "number" && !isNaN(value);
        };
        NumberUtils.sin = function (value) {
            var valueFloor = Math.floor(value);
            var valueCeil = valueFloor + 1;
            var resultFloor = NumberUtils.sinInt(valueFloor);
            if (valueFloor == value) {
                return resultFloor;
            }
            var resultCeil = NumberUtils.sinInt(valueCeil);
            return (value - valueFloor) * resultCeil + (valueCeil - value) * resultFloor;
        };
        NumberUtils.sinInt = function (value) {
            value = value % 360;
            if (value < 0) {
                value += 360;
            }
            return egret_sin_map[value];
        };
        NumberUtils.cos = function (value) {
            var valueFloor = Math.floor(value);
            var valueCeil = valueFloor + 1;
            var resultFloor = NumberUtils.cosInt(valueFloor);
            if (valueFloor == value) {
                return resultFloor;
            }
            var resultCeil = NumberUtils.cosInt(valueCeil);
            return (value - valueFloor) * resultCeil + (valueCeil - value) * resultFloor;
        };
        NumberUtils.cosInt = function (value) {
            value = value % 360;
            if (value < 0) {
                value += 360;
            }
            return egret_cos_map[value];
        };
        NumberUtils.convertStringToHashCode = function (str) {
            if (str.length === 0) {
                return 0;
            }
            var hash = 0;
            for (var i = 0, length_13 = str.length; i < length_13; ++i) {
                var chr = str.charCodeAt(i);
                hash = ((hash << 5) - hash) + chr;
                hash |= 0;
            }
            return hash;
        };
        return NumberUtils;
    }());
    egret.NumberUtils = NumberUtils;
})(egret || (egret = {}));
var egret_sin_map = {};
var egret_cos_map = {};
var DEG_TO_RAD = Math.PI / 180;
for (var NumberUtils_i = 0; NumberUtils_i < 360; NumberUtils_i++) {
    egret_sin_map[NumberUtils_i] = Math.sin(NumberUtils_i * DEG_TO_RAD);
    egret_cos_map[NumberUtils_i] = Math.cos(NumberUtils_i * DEG_TO_RAD);
}
egret_sin_map[90] = 1;
egret_cos_map[90] = 0;
egret_sin_map[180] = 0;
egret_cos_map[180] = -1;
egret_sin_map[270] = -1;
egret_cos_map[270] = 0;
if (!Function.prototype.bind) {
    Function.prototype.bind = function (oThis) {
        if (typeof this !== "function") {
            egret.error(1029);
        }
        var aArgs = Array.prototype.slice.call(arguments, 1), fToBind = this, fNOP = function () {
        }, fBound = function () {
            return fToBind.apply(this instanceof fNOP && oThis
                ? this
                : oThis, aArgs.concat(Array.prototype.slice.call(arguments)));
        };
        fNOP.prototype = this.prototype;
        fBound.prototype = new fNOP();
        return fBound;
    };
}
var egret;
(function (egret) {
    var Timer = (function (_super) {
        __extends(Timer, _super);
        function Timer(delay, repeatCount) {
            if (repeatCount === void 0) { repeatCount = 0; }
            var _this = _super.call(this) || this;
            _this._delay = 0;
            _this._currentCount = 0;
            _this._running = false;
            _this.updateInterval = 1000;
            _this.lastCount = 1000;
            _this.lastTimeStamp = 0;
            _this.delay = delay;
            _this.repeatCount = +repeatCount | 0;
            return _this;
        }
        Object.defineProperty(Timer.prototype, "delay", {
            get: function () {
                return this._delay;
            },
            set: function (value) {
                if (value < 1) {
                    value = 1;
                }
                if (this._delay == value) {
                    return;
                }
                this._delay = value;
                this.lastCount = this.updateInterval = Math.round(60 * value);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Timer.prototype, "currentCount", {
            get: function () {
                return this._currentCount;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Timer.prototype, "running", {
            get: function () {
                return this._running;
            },
            enumerable: true,
            configurable: true
        });
        Timer.prototype.reset = function () {
            this.stop();
            this._currentCount = 0;
        };
        Timer.prototype.start = function () {
            if (this._running)
                return;
            this.lastCount = this.updateInterval;
            this.lastTimeStamp = egret.getTimer();
            egret.ticker.$startTick(this.$update, this);
            this._running = true;
        };
        Timer.prototype.stop = function () {
            if (!this._running)
                return;
            egret.stopTick(this.$update, this);
            this._running = false;
        };
        Timer.prototype.$update = function (timeStamp) {
            var deltaTime = timeStamp - this.lastTimeStamp;
            if (deltaTime >= this._delay) {
                this.lastCount = this.updateInterval;
            }
            else {
                this.lastCount -= 1000;
                if (this.lastCount > 0) {
                    return false;
                }
                this.lastCount += this.updateInterval;
            }
            this.lastTimeStamp = timeStamp;
            this._currentCount++;
            var complete = (this.repeatCount > 0 && this._currentCount >= this.repeatCount);
            if (this.repeatCount == 0 || this._currentCount <= this.repeatCount) {
                egret.TimerEvent.dispatchTimerEvent(this, egret.TimerEvent.TIMER);
            }
            if (complete) {
                this.stop();
                egret.TimerEvent.dispatchTimerEvent(this, egret.TimerEvent.TIMER_COMPLETE);
            }
            return false;
        };
        return Timer;
    }(egret.EventDispatcher));
    egret.Timer = Timer;
})(egret || (egret = {}));
var egret;
(function (egret) {
})(egret || (egret = {}));
var egret;
(function (egret) {
    egret.$callLaterFunctionList = [];
    egret.$callLaterThisList = [];
    egret.$callLaterArgsList = [];
    function callLater(method, thisObject) {
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        egret.$callLaterFunctionList.push(method);
        egret.$callLaterThisList.push(thisObject);
        egret.$callLaterArgsList.push(args);
    }
    egret.callLater = callLater;
    egret.$callAsyncFunctionList = [];
    egret.$callAsyncThisList = [];
    egret.$callAsyncArgsList = [];
    function $callAsync(method, thisObject) {
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        egret.$callAsyncFunctionList.push(method);
        egret.$callAsyncThisList.push(thisObject);
        egret.$callAsyncArgsList.push(args);
    }
    egret.$callAsync = $callAsync;
})(egret || (egret = {}));
var egret;
(function (egret) {
    function superSetter(currentClass, thisObj, type) {
        var values = [];
        for (var _i = 3; _i < arguments.length; _i++) {
            values[_i - 3] = arguments[_i];
        }
        var cla = currentClass.prototype;
        var seters;
        if (!currentClass.hasOwnProperty("__sets__")) {
            Object.defineProperty(currentClass, "__sets__", { "value": {} });
        }
        seters = currentClass["__sets__"];
        var setF = seters[type];
        if (setF) {
            return setF.apply(thisObj, values);
        }
        var d = Object.getPrototypeOf(cla);
        if (d == null) {
            return;
        }
        while (!d.hasOwnProperty(type)) {
            d = Object.getPrototypeOf(d);
            if (d == null) {
                return;
            }
        }
        setF = Object.getOwnPropertyDescriptor(d, type).set;
        seters[type] = setF;
        setF.apply(thisObj, values);
    }
    egret.superSetter = superSetter;
    function superGetter(currentClass, thisObj, type) {
        var cla = currentClass.prototype;
        var geters;
        if (!currentClass.hasOwnProperty("__gets__")) {
            Object.defineProperty(currentClass, "__gets__", { "value": {} });
        }
        geters = currentClass["__gets__"];
        var getF = geters[type];
        if (getF) {
            return getF.call(thisObj);
        }
        var d = Object.getPrototypeOf(cla);
        if (d == null) {
            return;
        }
        while (!d.hasOwnProperty(type)) {
            d = Object.getPrototypeOf(d);
            if (d == null) {
                return;
            }
        }
        getF = Object.getOwnPropertyDescriptor(d, type).get;
        geters[type] = getF;
        return getF.call(thisObj);
    }
    egret.superGetter = superGetter;
})(egret || (egret = {}));
var egret;
(function (egret) {
    var getDefinitionByNameCache = {};
    function getDefinitionByName(name) {
        if (!name)
            return null;
        var definition = getDefinitionByNameCache[name];
        if (definition) {
            return definition;
        }
        var paths = name.split(".");
        var length = paths.length;
        definition = global;
        for (var i = 0; i < length; i++) {
            var path = paths[i];
            definition = definition[path];
            if (!definition) {
                return null;
            }
        }
        getDefinitionByNameCache[name] = definition;
        return definition;
    }
    egret.getDefinitionByName = getDefinitionByName;
})(egret || (egret = {}));
var egret;
(function (egret) {
})(egret || (egret = {}));
var egret;
(function (egret) {
    function getQualifiedClassName(value) {
        var type = typeof value;
        if (!value || (type != "object" && !value.prototype)) {
            return type;
        }
        var prototype = value.prototype ? value.prototype : Object.getPrototypeOf(value);
        if (prototype.hasOwnProperty("__class__")) {
            return prototype["__class__"];
        }
        var constructorString = prototype.constructor.toString().trim();
        var index = constructorString.indexOf("(");
        var className = constructorString.substring(9, index);
        Object.defineProperty(prototype, "__class__", {
            value: className,
            enumerable: false,
            writable: true
        });
        return className;
    }
    egret.getQualifiedClassName = getQualifiedClassName;
})(egret || (egret = {}));
var egret;
(function (egret) {
    function getQualifiedSuperclassName(value) {
        if (!value || (typeof value != "object" && !value.prototype)) {
            return null;
        }
        var prototype = value.prototype ? value.prototype : Object.getPrototypeOf(value);
        var superProto = Object.getPrototypeOf(prototype);
        if (!superProto) {
            return null;
        }
        var superClass = egret.getQualifiedClassName(superProto.constructor);
        if (!superClass) {
            return null;
        }
        return superClass;
    }
    egret.getQualifiedSuperclassName = getQualifiedSuperclassName;
})(egret || (egret = {}));
var egret;
(function (egret) {
    function getTimer() {
        return Date.now() - egret.sys.$START_TIME;
    }
    egret.getTimer = getTimer;
})(egret || (egret = {}));
var egret;
(function (egret) {
    function hasDefinition(name) {
        var definition = egret.getDefinitionByName(name);
        return definition ? true : false;
    }
    egret.hasDefinition = hasDefinition;
})(egret || (egret = {}));
var egret;
(function (egret) {
    function is(instance, typeName) {
        if (!instance || typeof instance != "object") {
            return false;
        }
        var prototype = Object.getPrototypeOf(instance);
        var types = prototype ? prototype.__types__ : null;
        if (!types) {
            return false;
        }
        return (types.indexOf(typeName) !== -1);
    }
    egret.is = is;
})(egret || (egret = {}));
var egret;
(function (egret) {
    function startTick(callBack, thisObject) {
        egret.ticker.$startTick(callBack, thisObject);
    }
    egret.startTick = startTick;
})(egret || (egret = {}));
var egret;
(function (egret) {
    function stopTick(callBack, thisObject) {
        egret.ticker.$stopTick(callBack, thisObject);
    }
    egret.stopTick = stopTick;
})(egret || (egret = {}));
var egret;
(function (egret) {
    function toColorString(value) {
        if (value < 0)
            value = 0;
        if (value > 16777215)
            value = 16777215;
        var color = value.toString(16).toUpperCase();
        while (color.length > 6) {
            color = color.slice(1, color.length);
        }
        while (color.length < 6) {
            color = "0" + color;
        }
        return "#" + color;
    }
    egret.toColorString = toColorString;
})(egret || (egret = {}));
var egret;
(function (egret) {
    var web;
    (function (web) {
        function updateAllScreens() {
            if (!isRunning) {
                return;
            }
            var containerList = document.querySelectorAll(".egret-player");
            var length = containerList.length;
            for (var i = 0; i < length; i++) {
                var container = containerList[i];
                var player = container["egret-player"];
                player.updateScreenSize();
            }
        }
        var isRunning = false;
        function runEgret(options) {
            if (isRunning) {
                return;
            }
            isRunning = true;
            if (!options) {
                options = {};
            }
            var ua = navigator.userAgent.toLowerCase();
            if (ua.indexOf("egretnative") >= 0 && ua.indexOf("egretwebview") == -1) {
                egret.Capabilities["runtimeType" + ""] = egret.RuntimeType.RUNTIME2;
            }
            if (ua.indexOf("egretnative") >= 0 && egret.nativeRender) {
                egret_native.addModuleCallback(function () {
                    web.Html5Capatibility.$init();
                    if (options.renderMode == "webgl") {
                        var antialias = options.antialias;
                        web.WebGLRenderContext.antialias = !!antialias;
                    }
                    egret.sys.CanvasRenderBuffer = web.CanvasRenderBuffer;
                    setRenderMode(options.renderMode);
                    egret_native.nrSetRenderMode(2);
                    var canvasScaleFactor;
                    if (options.canvasScaleFactor) {
                        canvasScaleFactor = options.canvasScaleFactor;
                    }
                    else if (options.calculateCanvasScaleFactor) {
                        canvasScaleFactor = options.calculateCanvasScaleFactor(egret.sys.canvasHitTestBuffer.context);
                    }
                    else {
                        canvasScaleFactor = window.devicePixelRatio;
                    }
                    egret.sys.DisplayList.$canvasScaleFactor = canvasScaleFactor;
                    var ticker = egret.ticker;
                    startTicker(ticker);
                    if (options.screenAdapter) {
                        egret.sys.screenAdapter = options.screenAdapter;
                    }
                    else if (!egret.sys.screenAdapter) {
                        egret.sys.screenAdapter = new egret.sys.DefaultScreenAdapter();
                    }
                    var list = document.querySelectorAll(".egret-player");
                    var length = list.length;
                    for (var i = 0; i < length; i++) {
                        var container = list[i];
                        var player = new web.WebPlayer(container, options);
                        container["egret-player"] = player;
                    }
                    web.WebGLRenderContext.getInstance().getSupportedCompressedTexture();
                    window.addEventListener("resize", function () {
                        if (isNaN(resizeTimer)) {
                            resizeTimer = window.setTimeout(doResize, 300);
                        }
                    });
                }, null);
                egret_native.initNativeRender();
            }
            else {
                web.Html5Capatibility._audioType = options.audioType;
                web.Html5Capatibility.$init();
                var renderMode = options.renderMode;
                if (renderMode == "webgl") {
                    var antialias = options.antialias;
                    web.WebGLRenderContext.antialias = !!antialias;
                }
                egret.sys.CanvasRenderBuffer = web.CanvasRenderBuffer;
                if (ua.indexOf("egretnative") >= 0 && renderMode != "webgl") {
                    egret.warn(1051);
                    renderMode = "webgl";
                }
                setRenderMode(renderMode);
                var canvasScaleFactor = void 0;
                if (options.canvasScaleFactor) {
                    canvasScaleFactor = options.canvasScaleFactor;
                }
                else if (options.calculateCanvasScaleFactor) {
                    canvasScaleFactor = options.calculateCanvasScaleFactor(egret.sys.canvasHitTestBuffer.context);
                }
                else {
                    var context = egret.sys.canvasHitTestBuffer.context;
                    var backingStore = context.backingStorePixelRatio ||
                        context.webkitBackingStorePixelRatio ||
                        context.mozBackingStorePixelRatio ||
                        context.msBackingStorePixelRatio ||
                        context.oBackingStorePixelRatio ||
                        context.backingStorePixelRatio || 1;
                    canvasScaleFactor = (window.devicePixelRatio || 1) / backingStore;
                }
                egret.sys.DisplayList.$canvasScaleFactor = canvasScaleFactor;
                var ticker_1 = egret.ticker;
                startTicker(ticker_1);
                if (options.screenAdapter) {
                    egret.sys.screenAdapter = options.screenAdapter;
                }
                else if (!egret.sys.screenAdapter) {
                    egret.sys.screenAdapter = new egret.sys.DefaultScreenAdapter();
                }
                var list = document.querySelectorAll(".egret-player");
                var length_14 = list.length;
                for (var i = 0; i < length_14; i++) {
                    var container = list[i];
                    var player = new web.WebPlayer(container, options);
                    container["egret-player"] = player;
                }
                window.addEventListener("resize", function () {
                    if (isNaN(resizeTimer)) {
                        resizeTimer = window.setTimeout(doResize, 300);
                    }
                });
            }
        }
        function setRenderMode(renderMode) {
            if (renderMode == "webgl" && egret.WebGLUtils.checkCanUseWebGL()) {
                egret.sys.RenderBuffer = web.WebGLRenderBuffer;
                egret.sys.systemRenderer = new web.WebGLRenderer();
                egret.sys.canvasRenderer = new egret.CanvasRenderer();
                egret.sys.customHitTestBuffer = new web.WebGLRenderBuffer(3, 3);
                egret.sys.canvasHitTestBuffer = new web.CanvasRenderBuffer(3, 3);
                egret.Capabilities["renderMode" + ""] = "webgl";
            }
            else {
                egret.sys.RenderBuffer = web.CanvasRenderBuffer;
                egret.sys.systemRenderer = new egret.CanvasRenderer();
                egret.sys.canvasRenderer = egret.sys.systemRenderer;
                egret.sys.customHitTestBuffer = new web.CanvasRenderBuffer(3, 3);
                egret.sys.canvasHitTestBuffer = egret.sys.customHitTestBuffer;
                egret.Capabilities["renderMode" + ""] = "canvas";
            }
        }
        egret.sys.setRenderMode = setRenderMode;
        function startTicker(ticker) {
            var requestAnimationFrame = window["requestAnimationFrame"] ||
                window["webkitRequestAnimationFrame"] ||
                window["mozRequestAnimationFrame"] ||
                window["oRequestAnimationFrame"] ||
                window["msRequestAnimationFrame"];
            if (!requestAnimationFrame) {
                requestAnimationFrame = function (callback) {
                    return window.setTimeout(callback, 1000 / 60);
                };
            }
            requestAnimationFrame(onTick);
            function onTick() {
                requestAnimationFrame(onTick);
                ticker.update();
            }
        }
        window["isNaN"] = function (value) {
            value = +value;
            return value !== value;
        };
        egret.runEgret = runEgret;
        egret.updateAllScreens = updateAllScreens;
        var resizeTimer = NaN;
        function doResize() {
            resizeTimer = NaN;
            egret.updateAllScreens();
        }
    })(web = egret.web || (egret.web = {}));
})(egret || (egret = {}));
var egret;
(function (egret) {
    var web;
    (function (web) {
        var AudioType = (function () {
            function AudioType() {
            }
            AudioType.WEB_AUDIO = 2;
            AudioType.HTML5_AUDIO = 3;
            return AudioType;
        }());
        web.AudioType = AudioType;
        var Html5Capatibility = (function (_super) {
            __extends(Html5Capatibility, _super);
            function Html5Capatibility() {
                return _super.call(this) || this;
            }
            Html5Capatibility.$init = function () {
                var ua = navigator.userAgent.toLowerCase();
                Html5Capatibility.ua = ua;
                Html5Capatibility._canUseBlob = false;
                var canUseWebAudio = window["AudioContext"] || window["webkitAudioContext"] || window["mozAudioContext"];
                var isIos = ua.indexOf("iphone") >= 0 || ua.indexOf("ipad") >= 0 || ua.indexOf("ipod") >= 0;
                if (canUseWebAudio) {
                    try {
                        web.WebAudioDecode.ctx = new (window["AudioContext"] || window["webkitAudioContext"] || window["mozAudioContext"])();
                    }
                    catch (e) {
                        canUseWebAudio = false;
                    }
                }
                var audioType = Html5Capatibility._audioType;
                var checkAudioType;
                if ((audioType == AudioType.WEB_AUDIO && canUseWebAudio) || audioType == AudioType.HTML5_AUDIO) {
                    checkAudioType = false;
                    Html5Capatibility.setAudioType(audioType);
                }
                else if (!isIos && ua.indexOf("safari") >= 0 && ua.indexOf("chrome") === -1) {
                    checkAudioType = false;
                    Html5Capatibility.setAudioType(AudioType.WEB_AUDIO);
                }
                else {
                    checkAudioType = true;
                    Html5Capatibility.setAudioType(AudioType.HTML5_AUDIO);
                }
                if (ua.indexOf("android") >= 0) {
                    if (checkAudioType && canUseWebAudio) {
                        Html5Capatibility.setAudioType(AudioType.WEB_AUDIO);
                    }
                }
                else if (isIos) {
                    if (Html5Capatibility.getIOSVersion() >= 7) {
                        Html5Capatibility._canUseBlob = true;
                        if (checkAudioType && canUseWebAudio) {
                            Html5Capatibility.setAudioType(AudioType.WEB_AUDIO);
                        }
                    }
                }
                var winURL = window["URL"] || window["webkitURL"];
                if (!winURL) {
                    Html5Capatibility._canUseBlob = false;
                }
                if (ua.indexOf("egretnative") >= 0) {
                    Html5Capatibility.setAudioType(AudioType.HTML5_AUDIO);
                    Html5Capatibility._canUseBlob = true;
                }
                egret.Sound = Html5Capatibility._AudioClass;
            };
            Html5Capatibility.setAudioType = function (type) {
                Html5Capatibility._audioType = type;
                switch (type) {
                    case AudioType.WEB_AUDIO:
                        Html5Capatibility._AudioClass = egret.web.WebAudioSound;
                        break;
                    case AudioType.HTML5_AUDIO:
                        Html5Capatibility._AudioClass = egret.web.HtmlSound;
                        break;
                }
            };
            Html5Capatibility.getIOSVersion = function () {
                var matches = Html5Capatibility.ua.toLowerCase().match(/cpu [^\d]*\d.*like mac os x/);
                if (!matches || matches.length == 0) {
                    return 0;
                }
                var value = matches[0];
                return parseInt(value.match(/\d+(_\d)*/)[0]) || 0;
            };
            Html5Capatibility._canUseBlob = false;
            Html5Capatibility._audioType = 0;
            Html5Capatibility.ua = "";
            return Html5Capatibility;
        }(egret.HashObject));
        web.Html5Capatibility = Html5Capatibility;
        var currentPrefix = null;
        function getPrefixStyleName(name, element) {
            var header = "";
            if (element != null) {
                header = getPrefix(name, element);
            }
            else {
                if (currentPrefix == null) {
                    var tempStyle = document.createElement('div').style;
                    currentPrefix = getPrefix("transform", tempStyle);
                }
                header = currentPrefix;
            }
            if (header == "") {
                return name;
            }
            return header + name.charAt(0).toUpperCase() + name.substring(1, name.length);
        }
        web.getPrefixStyleName = getPrefixStyleName;
        function getPrefix(name, element) {
            if (name in element) {
                return "";
            }
            name = name.charAt(0).toUpperCase() + name.substring(1, name.length);
            var transArr = ["webkit", "ms", "Moz", "O"];
            for (var i = 0; i < transArr.length; i++) {
                var tempStyle = transArr[i] + name;
                if (tempStyle in element) {
                    return transArr[i];
                }
            }
            return "";
        }
        web.getPrefix = getPrefix;
    })(web = egret.web || (egret.web = {}));
})(egret || (egret = {}));
var egret;
(function (egret) {
    var web;
    (function (web) {
        var WebCapability = (function () {
            function WebCapability() {
            }
            WebCapability.detect = function () {
                var capabilities = egret.Capabilities;
                var ua = navigator.userAgent.toLowerCase();
                capabilities["isMobile" + ""] = (ua.indexOf('mobile') != -1 || ua.indexOf('android') != -1);
                if (capabilities.isMobile) {
                    if (ua.indexOf("windows") < 0 && (ua.indexOf("iphone") != -1 || ua.indexOf("ipad") != -1 || ua.indexOf("ipod") != -1)) {
                        capabilities["os" + ""] = "iOS";
                    }
                    else if (ua.indexOf("android") != -1 && ua.indexOf("linux") != -1) {
                        capabilities["os" + ""] = "Android";
                    }
                    else if (ua.indexOf("windows") != -1) {
                        capabilities["os" + ""] = "Windows Phone";
                    }
                }
                else {
                    if (ua.indexOf("windows nt") != -1) {
                        capabilities["os" + ""] = "Windows PC";
                    }
                    else if (navigator.platform == "MacIntel" && navigator.maxTouchPoints > 1) {
                        capabilities["os" + ""] = "iOS";
                        capabilities["isMobile" + ""] = true;
                    }
                    else if (ua.indexOf("mac os") != -1) {
                        capabilities["os" + ""] = "Mac OS";
                    }
                }
                var language = (navigator.language || navigator["browserLanguage"]).toLowerCase();
                var strings = language.split("-");
                if (strings.length > 1) {
                    strings[1] = strings[1].toUpperCase();
                }
                capabilities["language" + ""] = strings.join("-");
                WebCapability.injectUIntFixOnIE9();
            };
            WebCapability.injectUIntFixOnIE9 = function () {
                if (/msie 9.0/i.test(navigator.userAgent) && !/opera/i.test(navigator.userAgent)) {
                    var IEBinaryToArray_ByteStr_Script = "<!-- IEBinaryToArray_ByteStr -->\r\n" +
                        "<script type='text/vbscript' language='VBScript'>\r\n" +
                        "Function IEBinaryToArray_ByteStr(Binary)\r\n" +
                        "   IEBinaryToArray_ByteStr = CStr(Binary)\r\n" +
                        "End Function\r\n" +
                        "Function IEBinaryToArray_ByteStr_Last(Binary)\r\n" +
                        "   Dim lastIndex\r\n" +
                        "   lastIndex = LenB(Binary)\r\n" +
                        "   if lastIndex mod 2 Then\r\n" +
                        "       IEBinaryToArray_ByteStr_Last = Chr( AscB( MidB( Binary, lastIndex, 1 ) ) )\r\n" +
                        "   Else\r\n" +
                        "       IEBinaryToArray_ByteStr_Last = " + '""' + "\r\n" +
                        "   End If\r\n" +
                        "End Function\r\n" + "<\/script>\r\n" +
                        "<!-- convertResponseBodyToText -->\r\n" +
                        "<script>\r\n" +
                        "let convertResponseBodyToText = function (binary) {\r\n" +
                        "   let byteMapping = {};\r\n" +
                        "   for ( let i = 0; i < 256; i++ ) {\r\n" +
                        "       for ( let j = 0; j < 256; j++ ) {\r\n" +
                        "           byteMapping[ String.fromCharCode( i + j * 256 ) ] =\r\n" +
                        "           String.fromCharCode(i) + String.fromCharCode(j);\r\n" +
                        "       }\r\n" +
                        "   }\r\n" +
                        "   let rawBytes = IEBinaryToArray_ByteStr(binary);\r\n" +
                        "   let lastChr = IEBinaryToArray_ByteStr_Last(binary);\r\n" +
                        "   return rawBytes.replace(/[\\s\\S]/g," +
                        "                           function( match ) { return byteMapping[match]; }) + lastChr;\r\n" +
                        "};\r\n" +
                        "<\/script>\r\n";
                    document.write(IEBinaryToArray_ByteStr_Script);
                }
            };
            return WebCapability;
        }());
        web.WebCapability = WebCapability;
        WebCapability.detect();
    })(web = egret.web || (egret.web = {}));
})(egret || (egret = {}));
var egret;
(function (egret) {
    var web;
    (function (web) {
        var WebFps = (function () {
            function WebFps(stage, showFPS, showLog, logFilter, styles) {
                this.showPanle = true;
                this.fpsHeight = 0;
                this.WIDTH = 101;
                this.HEIGHT = 20;
                this.bgCanvasColor = "#18304b";
                this.fpsFrontColor = "#18fefe";
                this.WIDTH_COST = 50;
                this.cost1Color = "#18fefe";
                this.cost3Color = "#ff0000";
                this.arrFps = [];
                this.arrCost = [];
                this.arrLog = [];
                if (showFPS || showLog) {
                    if (egret.Capabilities.renderMode == 'canvas') {
                        this.renderMode = "Canvas";
                    }
                    else {
                        this.renderMode = "WebGL";
                    }
                    this.panelX = styles["x"] === undefined ? 0 : parseInt(styles['x']);
                    this.panelY = styles["y"] === undefined ? 0 : parseInt(styles['y']);
                    this.fontColor = styles["textColor"] === undefined ? '#ffffff' : styles['textColor'].replace("0x", "#");
                    this.fontSize = styles["size"] === undefined ? 12 : parseInt(styles['size']);
                    if (egret.Capabilities.isMobile) {
                        this.fontSize -= 2;
                    }
                    var all = document.createElement('div');
                    all.style.position = 'absolute';
                    all.style.background = "rgba(0,0,0," + styles['bgAlpha'] + ")";
                    all.style.left = this.panelX + 'px';
                    all.style.top = this.panelY + 'px';
                    all.style.pointerEvents = 'none';
                    all.id = 'egret-fps-panel';
                    document.body.appendChild(all);
                    var container = document.createElement('div');
                    container.style.color = this.fontColor;
                    container.style.fontSize = this.fontSize + 'px';
                    container.style.lineHeight = this.fontSize + 'px';
                    container.style.margin = '4px 4px 4px 4px';
                    this.container = container;
                    all.appendChild(container);
                    if (showFPS)
                        this.addFps();
                    if (showLog)
                        this.addLog();
                }
            }
            WebFps.prototype.addFps = function () {
                var div = document.createElement('div');
                div.style.display = 'inline-block';
                this.containerFps = div;
                this.container.appendChild(div);
                var fps = document.createElement('div');
                fps.style.paddingBottom = '2px';
                this.fps = fps;
                this.containerFps.appendChild(fps);
                fps.innerHTML = "0 FPS " + this.renderMode + "<br/>min0 max0 avg0";
                var canvas = document.createElement('canvas');
                this.containerFps.appendChild(canvas);
                canvas.width = this.WIDTH;
                canvas.height = this.HEIGHT;
                this.canvasFps = canvas;
                var context = canvas.getContext('2d');
                this.contextFps = context;
                context.fillStyle = this.bgCanvasColor;
                context.fillRect(0, 0, this.WIDTH, this.HEIGHT);
                var divDatas = document.createElement('div');
                this.divDatas = divDatas;
                this.containerFps.appendChild(divDatas);
                var left = document.createElement('div');
                left.style['float'] = 'left';
                left.innerHTML = "Draw<br/>Cost";
                divDatas.appendChild(left);
                var right = document.createElement('div');
                right.style.paddingLeft = left.offsetWidth + 20 + "px";
                divDatas.appendChild(right);
                var draw = document.createElement('div');
                this.divDraw = draw;
                draw.innerHTML = "0<br/>";
                right.appendChild(draw);
                var cost = document.createElement('div');
                this.divCost = cost;
                cost.innerHTML = "<font  style=\"color:" + this.cost1Color + "\">0<font/> <font  style=\"color:" + this.cost3Color + "\">0<font/>";
                right.appendChild(cost);
                canvas = document.createElement('canvas');
                this.canvasCost = canvas;
                this.containerFps.appendChild(canvas);
                canvas.width = this.WIDTH;
                canvas.height = this.HEIGHT;
                context = canvas.getContext('2d');
                this.contextCost = context;
                context.fillStyle = this.bgCanvasColor;
                context.fillRect(0, 0, this.WIDTH, this.HEIGHT);
                context.fillStyle = "#000000";
                context.fillRect(this.WIDTH_COST, 0, 1, this.HEIGHT);
                this.fpsHeight = this.container.offsetHeight;
            };
            WebFps.prototype.addLog = function () {
                var log = document.createElement('div');
                log.style.maxWidth = document.body.clientWidth - 8 - this.panelX + 'px';
                log.style.wordWrap = "break-word";
                this.log = log;
                this.container.appendChild(log);
            };
            WebFps.prototype.update = function (datas, showLastData) {
                if (showLastData === void 0) { showLastData = false; }
                var numFps;
                var numCostTicker;
                var numCostRender;
                if (!showLastData) {
                    numFps = datas.fps;
                    numCostTicker = datas.costTicker;
                    numCostRender = datas.costRender;
                    this.lastNumDraw = datas.draw;
                    this.arrFps.push(numFps);
                    this.arrCost.push([numCostTicker, numCostRender]);
                }
                else {
                    numFps = this.arrFps[this.arrFps.length - 1];
                    numCostTicker = this.arrCost[this.arrCost.length - 1][0];
                    numCostRender = this.arrCost[this.arrCost.length - 1][1];
                }
                var fpsTotal = 0;
                var lenFps = this.arrFps.length;
                if (lenFps > 101) {
                    lenFps = 101;
                    this.arrFps.shift();
                    this.arrCost.shift();
                }
                var fpsMin = this.arrFps[0];
                var fpsMax = this.arrFps[0];
                for (var i = 0; i < lenFps; i++) {
                    var num = this.arrFps[i];
                    fpsTotal += num;
                    if (num < fpsMin)
                        fpsMin = num;
                    else if (num > fpsMax)
                        fpsMax = num;
                }
                var WIDTH = this.WIDTH;
                var HEIGHT = this.HEIGHT;
                var context = this.contextFps;
                context.drawImage(this.canvasFps, 1, 0, WIDTH - 1, HEIGHT, 0, 0, WIDTH - 1, HEIGHT);
                context.fillStyle = this.bgCanvasColor;
                context.fillRect(WIDTH - 1, 0, 1, HEIGHT);
                var lastHeight = Math.floor(numFps / 60 * 20);
                if (lastHeight < 1)
                    lastHeight = 1;
                context.fillStyle = this.fpsFrontColor;
                context.fillRect(WIDTH - 1, 20 - lastHeight, 1, lastHeight);
                var WIDTH_COST = this.WIDTH_COST;
                context = this.contextCost;
                context.drawImage(this.canvasCost, 1, 0, WIDTH_COST - 1, HEIGHT, 0, 0, WIDTH_COST - 1, HEIGHT);
                context.drawImage(this.canvasCost, WIDTH_COST + 2, 0, WIDTH_COST - 1, HEIGHT, WIDTH_COST + 1, 0, WIDTH_COST - 1, HEIGHT);
                var c1Height = Math.floor(numCostTicker / 2);
                if (c1Height < 1)
                    c1Height = 1;
                else if (c1Height > 20)
                    c1Height = 20;
                var c2Height = Math.floor(numCostRender / 2);
                if (c2Height < 1)
                    c2Height = 1;
                else if (c2Height > 20)
                    c2Height = 20;
                context.fillStyle = this.bgCanvasColor;
                context.fillRect(WIDTH_COST - 1, 0, 1, HEIGHT);
                context.fillRect(WIDTH_COST * 2, 0, 1, HEIGHT);
                context.fillRect(WIDTH_COST * 3 + 1, 0, 1, HEIGHT);
                context.fillStyle = this.cost1Color;
                context.fillRect(WIDTH_COST - 1, 20 - c1Height, 1, c1Height);
                context.fillStyle = this.cost3Color;
                context.fillRect(WIDTH_COST * 2, 20 - c2Height, 1, c2Height);
                var fpsAvg = Math.floor(fpsTotal / lenFps);
                var fpsOutput = numFps + " FPS " + this.renderMode;
                if (this.showPanle) {
                    fpsOutput += "<br/>min" + fpsMin + " max" + fpsMax + " avg" + fpsAvg;
                    this.divDraw.innerHTML = this.lastNumDraw + "<br/>";
                    this.divCost.innerHTML = "<font  style=\"color:#18fefe\">" + numCostTicker + "<font/> <font  style=\"color:#ff0000\">" + numCostRender + "<font/>";
                }
                this.fps.innerHTML = fpsOutput;
            };
            ;
            WebFps.prototype.updateInfo = function (info) {
                this.arrLog.push(info);
                this.updateLogLayout();
            };
            WebFps.prototype.updateWarn = function (info) {
                this.arrLog.push("[Warning]" + info);
                this.updateLogLayout();
            };
            WebFps.prototype.updateError = function (info) {
                this.arrLog.push("[Error]" + info);
                this.updateLogLayout();
            };
            WebFps.prototype.updateLogLayout = function () {
                this.log.innerHTML = this.arrLog.join('<br/>');
                while (document.body.clientHeight < (this.log.offsetHeight + this.fpsHeight + this.panelY + this.fontSize * 2)) {
                    this.arrLog.shift();
                    this.log.innerHTML = this.arrLog.join('<br/>');
                }
            };
            return WebFps;
        }());
        web.WebFps = WebFps;
        egret.FPSDisplay = WebFps;
    })(web = egret.web || (egret.web = {}));
})(egret || (egret = {}));
var egret;
(function (egret) {
    var web;
    (function (web) {
        function getOption(key) {
            if (window.location) {
                var search = location.search;
                if (search == "") {
                    return "";
                }
                search = search.slice(1);
                var searchArr = search.split("&");
                var length_15 = searchArr.length;
                for (var i = 0; i < length_15; i++) {
                    var str = searchArr[i];
                    var arr = str.split("=");
                    if (arr[0] == key) {
                        return arr[1];
                    }
                }
            }
            return "";
        }
        web.getOption = getOption;
        egret.getOption = getOption;
    })(web = egret.web || (egret.web = {}));
})(egret || (egret = {}));
var egret;
(function (egret) {
    var web;
    (function (web) {
        web.WebLifeCycleHandler = function (context) {
            var handleVisibilityChange = function () {
                if (!document[hidden]) {
                    context.resume();
                }
                else {
                    context.pause();
                }
            };
            window.addEventListener("focus", context.resume, false);
            window.addEventListener("blur", context.pause, false);
            var hidden, visibilityChange;
            if (typeof document.hidden !== "undefined") {
                hidden = "hidden";
                visibilityChange = "visibilitychange";
            }
            else if (typeof document["mozHidden"] !== "undefined") {
                hidden = "mozHidden";
                visibilityChange = "mozvisibilitychange";
            }
            else if (typeof document["msHidden"] !== "undefined") {
                hidden = "msHidden";
                visibilityChange = "msvisibilitychange";
            }
            else if (typeof document["webkitHidden"] !== "undefined") {
                hidden = "webkitHidden";
                visibilityChange = "webkitvisibilitychange";
            }
            else if (typeof document["oHidden"] !== "undefined") {
                hidden = "oHidden";
                visibilityChange = "ovisibilitychange";
            }
            if ("onpageshow" in window && "onpagehide" in window) {
                window.addEventListener("pageshow", context.resume, false);
                window.addEventListener("pagehide", context.pause, false);
            }
            if (hidden && visibilityChange) {
                document.addEventListener(visibilityChange, handleVisibilityChange, false);
            }
            var ua = navigator.userAgent;
            var isWX = /micromessenger/gi.test(ua);
            var isQQBrowser = /mqq/ig.test(ua);
            var isQQ = /mobile.*qq/gi.test(ua);
            if (isQQ || isWX) {
                isQQBrowser = false;
            }
            if (isQQBrowser) {
                var browser = window["browser"] || {};
                browser.execWebFn = browser.execWebFn || {};
                browser.execWebFn.postX5GamePlayerMessage = function (event) {
                    var eventType = event.type;
                    if (eventType == "app_enter_background") {
                        context.pause();
                    }
                    else if (eventType == "app_enter_foreground") {
                        context.resume();
                    }
                };
                window["browser"] = browser;
            }
        };
    })(web = egret.web || (egret.web = {}));
})(egret || (egret = {}));
var egret;
(function (egret) {
    var web;
    (function (web) {
        var WebPlayer = (function (_super) {
            __extends(WebPlayer, _super);
            function WebPlayer(container, options) {
                var _this = _super.call(this) || this;
                _this.init(container, options);
                _this.initOrientation();
                return _this;
            }
            WebPlayer.prototype.init = function (container, options) {
                console.log("Egret Engine Version:", egret.Capabilities.engineVersion);
                var option = this.readOption(container, options);
                var stage = new egret.Stage();
                stage.$screen = this;
                stage.$scaleMode = option.scaleMode;
                stage.$orientation = option.orientation;
                stage.$maxTouches = option.maxTouches;
                stage.frameRate = option.frameRate;
                stage.textureScaleFactor = option.textureScaleFactor;
                var buffer = new egret.sys.RenderBuffer(undefined, undefined, true);
                var canvas = buffer.surface;
                this.attachCanvas(container, canvas);
                var webTouch = new web.WebTouchHandler(stage, canvas);
                var player = new egret.sys.Player(buffer, stage, option.entryClassName);
                egret.lifecycle.stage = stage;
                egret.lifecycle.addLifecycleListener(web.WebLifeCycleHandler);
                var webInput = new web.HTMLInput();
                if (option.showFPS || option.showLog) {
                    if (!egret.nativeRender) {
                        player.displayFPS(option.showFPS, option.showLog, option.logFilter, option.fpsStyles);
                    }
                }
                this.playerOption = option;
                this.container = container;
                this.canvas = canvas;
                this.stage = stage;
                this.player = player;
                this.webTouchHandler = webTouch;
                this.webInput = webInput;
                egret.web.$cacheTextAdapter(webInput, stage, container, canvas);
                this.updateScreenSize();
                this.updateMaxTouches();
                player.start();
            };
            WebPlayer.prototype.initOrientation = function () {
                var self = this;
                window.addEventListener("orientationchange", function () {
                    window.setTimeout(function () {
                        egret.StageOrientationEvent.dispatchStageOrientationEvent(self.stage, egret.StageOrientationEvent.ORIENTATION_CHANGE);
                    }, 350);
                });
            };
            WebPlayer.prototype.readOption = function (container, options) {
                var option = {};
                option.entryClassName = container.getAttribute("data-entry-class");
                option.scaleMode = container.getAttribute("data-scale-mode") || egret.StageScaleMode.NO_SCALE;
                option.frameRate = +container.getAttribute("data-frame-rate") || 30;
                option.contentWidth = +container.getAttribute("data-content-width") || 480;
                option.contentHeight = +container.getAttribute("data-content-height") || 800;
                option.orientation = container.getAttribute("data-orientation") || egret.OrientationMode.AUTO;
                option.maxTouches = +container.getAttribute("data-multi-fingered") || 2;
                option.textureScaleFactor = +container.getAttribute("texture-scale-factor") || 1;
                option.showFPS = container.getAttribute("data-show-fps") == "true";
                var styleStr = container.getAttribute("data-show-fps-style") || "";
                var stylesArr = styleStr.split(",");
                var styles = {};
                for (var i = 0; i < stylesArr.length; i++) {
                    var tempStyleArr = stylesArr[i].split(":");
                    styles[tempStyleArr[0]] = tempStyleArr[1];
                }
                option.fpsStyles = styles;
                option.showLog = container.getAttribute("data-show-log") == "true";
                option.logFilter = container.getAttribute("data-log-filter");
                return option;
            };
            WebPlayer.prototype.attachCanvas = function (container, canvas) {
                var style = canvas.style;
                style.cursor = "inherit";
                style.position = "absolute";
                style.top = "0";
                style.bottom = "0";
                style.left = "0";
                style.right = "0";
                container.appendChild(canvas);
                style = container.style;
                style.overflow = "hidden";
                style.position = "absolute";
            };
            WebPlayer.prototype.updateScreenSize = function () {
                var canvas = this.canvas;
                if (canvas['userTyping'])
                    return;
                var option = this.playerOption;
                var screenRect = this.container.getBoundingClientRect();
                var top = 0;
                var boundingClientWidth = screenRect.width;
                var boundingClientHeight = screenRect.height;
                if (boundingClientWidth == 0 || boundingClientHeight == 0) {
                    return;
                }
                if (screenRect.top < 0) {
                    boundingClientHeight += screenRect.top;
                    top = -screenRect.top;
                }
                var shouldRotate = false;
                var orientation = this.stage.$orientation;
                if (orientation != egret.OrientationMode.AUTO) {
                    shouldRotate = orientation != egret.OrientationMode.PORTRAIT && boundingClientHeight > boundingClientWidth
                        || orientation == egret.OrientationMode.PORTRAIT && boundingClientWidth > boundingClientHeight;
                }
                var screenWidth = shouldRotate ? boundingClientHeight : boundingClientWidth;
                var screenHeight = shouldRotate ? boundingClientWidth : boundingClientHeight;
                egret.Capabilities["boundingClientWidth" + ""] = screenWidth;
                egret.Capabilities["boundingClientHeight" + ""] = screenHeight;
                var stageSize = egret.sys.screenAdapter.calculateStageSize(this.stage.$scaleMode, screenWidth, screenHeight, option.contentWidth, option.contentHeight);
                var stageWidth = stageSize.stageWidth;
                var stageHeight = stageSize.stageHeight;
                var displayWidth = stageSize.displayWidth;
                var displayHeight = stageSize.displayHeight;
                canvas.style[egret.web.getPrefixStyleName("transformOrigin")] = "0% 0% 0px";
                if (canvas.width != stageWidth) {
                    canvas.width = stageWidth;
                }
                if (canvas.height != stageHeight) {
                    canvas.height = stageHeight;
                }
                var rotation = 0;
                if (shouldRotate) {
                    if (orientation == egret.OrientationMode.LANDSCAPE) {
                        rotation = 90;
                        canvas.style.top = top + (boundingClientHeight - displayWidth) / 2 + "px";
                        canvas.style.left = (boundingClientWidth + displayHeight) / 2 + "px";
                    }
                    else {
                        rotation = -90;
                        canvas.style.top = top + (boundingClientHeight + displayWidth) / 2 + "px";
                        canvas.style.left = (boundingClientWidth - displayHeight) / 2 + "px";
                    }
                }
                else {
                    canvas.style.top = top + (boundingClientHeight - displayHeight) / 2 + "px";
                    canvas.style.left = (boundingClientWidth - displayWidth) / 2 + "px";
                }
                var scalex = displayWidth / stageWidth, scaley = displayHeight / stageHeight;
                var canvasScaleX = scalex * egret.sys.DisplayList.$canvasScaleFactor;
                var canvasScaleY = scaley * egret.sys.DisplayList.$canvasScaleFactor;
                if (egret.Capabilities.renderMode == "canvas") {
                    canvasScaleX = Math.ceil(canvasScaleX);
                    canvasScaleY = Math.ceil(canvasScaleY);
                }
                var m = egret.Matrix.create();
                m.identity();
                m.scale(scalex / canvasScaleX, scaley / canvasScaleY);
                m.rotate(rotation * Math.PI / 180);
                var transform = "matrix(" + m.a + "," + m.b + "," + m.c + "," + m.d + "," + m.tx + "," + m.ty + ")";
                egret.Matrix.release(m);
                canvas.style[egret.web.getPrefixStyleName("transform")] = transform;
                egret.sys.DisplayList.$setCanvasScale(canvasScaleX, canvasScaleY);
                this.webTouchHandler.updateScaleMode(scalex, scaley, rotation);
                this.webInput.$updateSize();
                this.player.updateStageSize(stageWidth, stageHeight);
                if (egret.nativeRender) {
                    canvas.width = stageWidth * canvasScaleX;
                    canvas.height = stageHeight * canvasScaleY;
                }
            };
            WebPlayer.prototype.setContentSize = function (width, height) {
                var option = this.playerOption;
                option.contentWidth = width;
                option.contentHeight = height;
                this.updateScreenSize();
            };
            WebPlayer.prototype.updateMaxTouches = function () {
                this.webTouchHandler.$updateMaxTouches();
            };
            return WebPlayer;
        }(egret.HashObject));
        web.WebPlayer = WebPlayer;
    })(web = egret.web || (egret.web = {}));
})(egret || (egret = {}));
var egret;
(function (egret) {
    var web;
    (function (web) {
        function mainCanvas(width, height) {
            return createCanvas(width, height);
        }
        egret.sys.mainCanvas = mainCanvas;
        function createCanvas(width, height) {
            var canvas = document.createElement("canvas");
            if (!isNaN(width) && !isNaN(height)) {
                canvas.width = width;
                canvas.height = height;
            }
            return canvas;
        }
        egret.sys.createCanvas = createCanvas;
        function resizeContext(renderContext, width, height, useMaxSize) {
            if (!renderContext) {
                return;
            }
            var webglrendercontext = renderContext;
            var surface = webglrendercontext.surface;
            if (useMaxSize) {
                if (surface.width < width) {
                    surface.width = width;
                }
                if (surface.height < height) {
                    surface.height = height;
                }
            }
            else {
                if (surface.width !== width) {
                    surface.width = width;
                }
                if (surface.height !== height) {
                    surface.height = height;
                }
            }
            webglrendercontext.onResize();
        }
        web.resizeContext = resizeContext;
        egret.sys.resizeContext = resizeContext;
        function getContextWebGL(surface) {
            var options = {
                antialias: web.WebGLRenderContext.antialias,
                stencil: true
            };
            var gl = null;
            var names = ["webgl", "experimental-webgl"];
            for (var i = 0; i < names.length; ++i) {
                try {
                    gl = surface.getContext(names[i], options);
                }
                catch (e) {
                }
                if (gl) {
                    break;
                }
            }
            if (!gl) {
                egret.error(1021);
            }
            return gl;
        }
        egret.sys.getContextWebGL = getContextWebGL;
        function getContext2d(surface) {
            return surface ? surface.getContext('2d') : null;
        }
        web.getContext2d = getContext2d;
        egret.sys.getContext2d = getContext2d;
        function createTexture(renderContext, bitmapData) {
            var webglrendercontext = renderContext;
            var gl = webglrendercontext.context;
            var texture = gl.createTexture();
            if (!texture) {
                webglrendercontext.contextLost = true;
                return;
            }
            texture[egret.glContext] = gl;
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 1);
            texture[egret.UNPACK_PREMULTIPLY_ALPHA_WEBGL] = true;
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, bitmapData);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            return texture;
        }
        egret.sys.createTexture = createTexture;
        function _createTexture(renderContext, width, height, data) {
            var webglrendercontext = renderContext;
            var gl = webglrendercontext.context;
            var texture = gl.createTexture();
            if (!texture) {
                webglrendercontext.contextLost = true;
                return null;
            }
            texture[egret.glContext] = gl;
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 1);
            texture[egret.UNPACK_PREMULTIPLY_ALPHA_WEBGL] = true;
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, data);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            return texture;
        }
        egret.sys._createTexture = _createTexture;
        function drawTextureElements(renderContext, data, offset) {
            var webglrendercontext = renderContext;
            var gl = webglrendercontext.context;
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, data.texture);
            var size = data.count * 3;
            gl.drawElements(gl.TRIANGLES, size, gl.UNSIGNED_SHORT, offset * 2);
            return size;
        }
        egret.sys.drawTextureElements = drawTextureElements;
        function measureTextWith(context, text) {
            return context.measureText(text).width;
        }
        egret.sys.measureTextWith = measureTextWith;
        function createCanvasRenderBufferSurface(defaultFunc, width, height, root) {
            return defaultFunc(width, height);
        }
        egret.sys.createCanvasRenderBufferSurface = createCanvasRenderBufferSurface;
        function resizeCanvasRenderBuffer(renderContext, width, height, useMaxSize) {
            var canvasRenderBuffer = renderContext;
            var surface = canvasRenderBuffer.surface;
            if (useMaxSize) {
                var change = false;
                if (surface.width < width) {
                    surface.width = width;
                    change = true;
                }
                if (surface.height < height) {
                    surface.height = height;
                    change = true;
                }
                if (!change) {
                    canvasRenderBuffer.context.globalCompositeOperation = "source-over";
                    canvasRenderBuffer.context.setTransform(1, 0, 0, 1, 0, 0);
                    canvasRenderBuffer.context.globalAlpha = 1;
                }
            }
            else {
                if (surface.width != width) {
                    surface.width = width;
                }
                if (surface.height != height) {
                    surface.height = height;
                }
            }
            canvasRenderBuffer.clear();
        }
        egret.sys.resizeCanvasRenderBuffer = resizeCanvasRenderBuffer;
        egret.Geolocation = egret.web.WebGeolocation;
        egret.Motion = egret.web.WebMotion;
    })(web = egret.web || (egret.web = {}));
})(egret || (egret = {}));
var egret;
(function (egret) {
    var web;
    (function (web) {
        var sharedCanvas;
        var sharedContext;
        function convertImageToCanvas(texture, rect) {
            if (!sharedCanvas) {
                sharedCanvas = egret.sys.createCanvas();
                sharedContext = sharedCanvas.getContext("2d");
            }
            var w = texture.$getTextureWidth();
            var h = texture.$getTextureHeight();
            if (rect == null) {
                rect = egret.$TempRectangle;
                rect.x = 0;
                rect.y = 0;
                rect.width = w;
                rect.height = h;
            }
            rect.x = Math.min(rect.x, w - 1);
            rect.y = Math.min(rect.y, h - 1);
            rect.width = Math.min(rect.width, w - rect.x);
            rect.height = Math.min(rect.height, h - rect.y);
            var iWidth = rect.width;
            var iHeight = rect.height;
            var surface = sharedCanvas;
            surface["style"]["width"] = iWidth + "px";
            surface["style"]["height"] = iHeight + "px";
            sharedCanvas.width = iWidth;
            sharedCanvas.height = iHeight;
            if (egret.Capabilities.renderMode == "webgl") {
                var renderTexture = void 0;
                if (!texture.$renderBuffer) {
                    renderTexture = new egret.RenderTexture();
                    renderTexture.drawToTexture(new egret.Bitmap(texture));
                }
                else {
                    renderTexture = texture;
                }
                var pixels = renderTexture.$renderBuffer.getPixels(rect.x, rect.y, iWidth, iHeight);
                var imageData = new ImageData(iWidth, iHeight);
                for (var i = 0; i < pixels.length; i++) {
                    imageData.data[i] = pixels[i];
                }
                sharedContext.putImageData(imageData, 0, 0);
                if (!texture.$renderBuffer) {
                    renderTexture.dispose();
                }
                return surface;
            }
            else {
                var bitmapData = texture;
                var offsetX = Math.round(bitmapData.$offsetX);
                var offsetY = Math.round(bitmapData.$offsetY);
                var bitmapWidth = bitmapData.$bitmapWidth;
                var bitmapHeight = bitmapData.$bitmapHeight;
                sharedContext.drawImage(bitmapData.$bitmapData.source, bitmapData.$bitmapX + rect.x / egret.$TextureScaleFactor, bitmapData.$bitmapY + rect.y / egret.$TextureScaleFactor, bitmapWidth * rect.width / w, bitmapHeight * rect.height / h, offsetX, offsetY, rect.width, rect.height);
                return surface;
            }
        }
        function toDataURL(type, rect, encoderOptions) {
            try {
                var surface = convertImageToCanvas(this, rect);
                var result = surface.toDataURL(type, encoderOptions);
                return result;
            }
            catch (e) {
                egret.error(1033);
            }
            return null;
        }
        function eliFoTevas(type, filePath, rect, encoderOptions) {
            var base64 = toDataURL.call(this, type, rect, encoderOptions);
            if (base64 == null) {
                return;
            }
            var href = base64.replace(/^data:image[^;]*/, "data:image/octet-stream");
            var aLink = document.createElement('a');
            aLink['download'] = filePath;
            aLink.href = href;
            var evt = document.createEvent('MouseEvents');
            evt.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
            aLink.dispatchEvent(evt);
        }
        function getPixel32(x, y) {
            egret.warn(1041, "getPixel32", "getPixels");
            return this.getPixels(x, y);
        }
        function getPixels(x, y, width, height) {
            if (width === void 0) { width = 1; }
            if (height === void 0) { height = 1; }
            if (egret.Capabilities.renderMode == "webgl") {
                var renderTexture = void 0;
                if (!this.$renderBuffer) {
                    renderTexture = new egret.RenderTexture();
                    renderTexture.drawToTexture(new egret.Bitmap(this));
                }
                else {
                    renderTexture = this;
                }
                var pixels = renderTexture.$renderBuffer.getPixels(x, y, width, height);
                return pixels;
            }
            try {
                var surface = convertImageToCanvas(this);
                var result = sharedContext.getImageData(x, y, width, height).data;
                return result;
            }
            catch (e) {
                egret.error(1039);
            }
        }
        egret.Texture.prototype.toDataURL = toDataURL;
        egret.Texture.prototype.saveToFile = eliFoTevas;
        egret.Texture.prototype.getPixel32 = getPixel32;
        egret.Texture.prototype.getPixels = getPixels;
    })(web = egret.web || (egret.web = {}));
})(egret || (egret = {}));
var egret;
(function (egret) {
    var web;
    (function (web) {
        var WebTouchHandler = (function (_super) {
            __extends(WebTouchHandler, _super);
            function WebTouchHandler(stage, canvas) {
                var _this = _super.call(this) || this;
                _this.onTouchBegin = function (event) {
                    var location = _this.getLocation(event);
                    _this.touch.onTouchBegin(location.x, location.y, event.identifier);
                };
                _this.onMouseMove = function (event) {
                    if (event.buttons == 0) {
                        _this.onTouchEnd(event);
                    }
                    else {
                        _this.onTouchMove(event);
                    }
                };
                _this.onTouchMove = function (event) {
                    var location = _this.getLocation(event);
                    _this.touch.onTouchMove(location.x, location.y, event.identifier);
                };
                _this.onTouchEnd = function (event) {
                    var location = _this.getLocation(event);
                    _this.touch.onTouchEnd(location.x, location.y, event.identifier);
                };
                _this.scaleX = 1;
                _this.scaleY = 1;
                _this.rotation = 0;
                _this.canvas = canvas;
                _this.touch = new egret.sys.TouchHandler(stage);
                _this.addListeners();
                return _this;
            }
            WebTouchHandler.prototype.addListeners = function () {
                var _this = this;
                if (window.navigator.msPointerEnabled) {
                    this.canvas.addEventListener("MSPointerDown", function (event) {
                        event.identifier = event.pointerId;
                        _this.onTouchBegin(event);
                        _this.prevent(event);
                    }, false);
                    this.canvas.addEventListener("MSPointerMove", function (event) {
                        event.identifier = event.pointerId;
                        _this.onTouchMove(event);
                        _this.prevent(event);
                    }, false);
                    this.canvas.addEventListener("MSPointerUp", function (event) {
                        event.identifier = event.pointerId;
                        _this.onTouchEnd(event);
                        _this.prevent(event);
                    }, false);
                }
                else {
                    if (!egret.Capabilities.isMobile) {
                        this.addMouseListener();
                    }
                    this.addTouchListener();
                }
            };
            WebTouchHandler.prototype.addMouseListener = function () {
                this.canvas.addEventListener("mousedown", this.onTouchBegin);
                this.canvas.addEventListener("mousemove", this.onMouseMove);
                this.canvas.addEventListener("mouseup", this.onTouchEnd);
            };
            WebTouchHandler.prototype.addTouchListener = function () {
                var _this = this;
                this.canvas.addEventListener("touchstart", function (event) {
                    var l = event.changedTouches.length;
                    for (var i = 0; i < l; i++) {
                        _this.onTouchBegin(event.changedTouches[i]);
                    }
                    _this.prevent(event);
                }, false);
                this.canvas.addEventListener("touchmove", function (event) {
                    var l = event.changedTouches.length;
                    for (var i = 0; i < l; i++) {
                        _this.onTouchMove(event.changedTouches[i]);
                    }
                    _this.prevent(event);
                }, false);
                this.canvas.addEventListener("touchend", function (event) {
                    var l = event.changedTouches.length;
                    for (var i = 0; i < l; i++) {
                        _this.onTouchEnd(event.changedTouches[i]);
                    }
                    _this.prevent(event);
                }, false);
                this.canvas.addEventListener("touchcancel", function (event) {
                    var l = event.changedTouches.length;
                    for (var i = 0; i < l; i++) {
                        _this.onTouchEnd(event.changedTouches[i]);
                    }
                    _this.prevent(event);
                }, false);
            };
            WebTouchHandler.prototype.prevent = function (event) {
                event.stopPropagation();
                if (event["isScroll"] != true && !this.canvas['userTyping']) {
                    event.preventDefault();
                }
            };
            WebTouchHandler.prototype.getLocation = function (event) {
                event.identifier = +event.identifier || 0;
                var doc = document.documentElement;
                var box = this.canvas.getBoundingClientRect();
                var left = box.left + window.pageXOffset - doc.clientLeft;
                var top = box.top + window.pageYOffset - doc.clientTop;
                var x = event.pageX - left, newx = x;
                var y = event.pageY - top, newy = y;
                if (this.rotation == 90) {
                    newx = y;
                    newy = box.width - x;
                }
                else if (this.rotation == -90) {
                    newx = box.height - y;
                    newy = x;
                }
                newx = newx / this.scaleX;
                newy = newy / this.scaleY;
                return egret.$TempPoint.setTo(Math.round(newx), Math.round(newy));
            };
            WebTouchHandler.prototype.updateScaleMode = function (scaleX, scaleY, rotation) {
                this.scaleX = scaleX;
                this.scaleY = scaleY;
                this.rotation = rotation;
            };
            WebTouchHandler.prototype.$updateMaxTouches = function () {
                this.touch.$initMaxTouches();
            };
            return WebTouchHandler;
        }(egret.HashObject));
        web.WebTouchHandler = WebTouchHandler;
    })(web = egret.web || (egret.web = {}));
})(egret || (egret = {}));
var egret;
(function (egret) {
    var web;
    (function (web) {
        var XMLNode = (function () {
            function XMLNode(nodeType, parent) {
                this.nodeType = nodeType;
                this.parent = parent;
            }
            return XMLNode;
        }());
        web.XMLNode = XMLNode;
        var XML = (function (_super) {
            __extends(XML, _super);
            function XML(localName, parent, prefix, namespace, name) {
                var _this = _super.call(this, 1, parent) || this;
                _this.attributes = {};
                _this.children = [];
                _this.localName = localName;
                _this.prefix = prefix;
                _this.namespace = namespace;
                _this.name = name;
                return _this;
            }
            return XML;
        }(XMLNode));
        web.XML = XML;
        var XMLText = (function (_super) {
            __extends(XMLText, _super);
            function XMLText(text, parent) {
                var _this = _super.call(this, 3, parent) || this;
                _this.text = text;
                return _this;
            }
            return XMLText;
        }(XMLNode));
        web.XMLText = XMLText;
        var parser = new DOMParser();
        function parse(text) {
            var xmlDoc = parser.parseFromString(text, "text/xml");
            var length = xmlDoc.childNodes.length;
            for (var i = 0; i < length; i++) {
                var node = xmlDoc.childNodes[i];
                if (node.nodeType == 1) {
                    return parseNode(node, null);
                }
            }
            return null;
        }
        function parseNode(node, parent) {
            if (node["localName"] == "parsererror") {
                throw new Error(node.textContent);
            }
            var xml = new XML(node["localName"], parent, node["prefix"], node.namespaceURI, node.nodeName);
            var nodeAttributes = node["attributes"];
            var attributes = xml.attributes;
            var length = nodeAttributes.length;
            for (var i = 0; i < length; i++) {
                var attributeNode = nodeAttributes[i];
                var name_4 = attributeNode.name;
                if (name_4.indexOf("xmlns:") == 0) {
                    continue;
                }
                attributes[name_4] = attributeNode.value;
                xml["$" + name_4] = attributeNode.value;
            }
            var childNodes = node.childNodes;
            length = childNodes.length;
            var children = xml.children;
            for (var i = 0; i < length; i++) {
                var childNode = childNodes[i];
                var nodeType = childNode.nodeType;
                var childXML = null;
                if (nodeType == 1) {
                    childXML = parseNode(childNode, xml);
                }
                else if (nodeType == 3) {
                    var text = childNode.textContent.trim();
                    if (text) {
                        childXML = new XMLText(text, xml);
                    }
                }
                if (childXML) {
                    children.push(childXML);
                }
            }
            return xml;
        }
        egret.XML = { parse: parse };
    })(web = egret.web || (egret.web = {}));
})(egret || (egret = {}));
var egret;
(function (egret) {
    var web;
    (function (web) {
        function __createCanvas__(width, height) {
            var canvas = egret.sys.createCanvas(width, height);
            var context = canvas.getContext("2d");
            if (context["imageSmoothingEnabled"] === undefined) {
                var keys = ["webkitImageSmoothingEnabled", "mozImageSmoothingEnabled", "msImageSmoothingEnabled"];
                var key_1;
                for (var i = keys.length - 1; i >= 0; i--) {
                    key_1 = keys[i];
                    if (context[key_1] !== void 0) {
                        break;
                    }
                }
                try {
                    Object.defineProperty(context, "imageSmoothingEnabled", {
                        get: function () {
                            return this[key_1];
                        },
                        set: function (value) {
                            this[key_1] = value;
                        }
                    });
                }
                catch (e) {
                    context["imageSmoothingEnabled"] = context[key_1];
                }
            }
            return canvas;
        }
        var sharedCanvas;
        var CanvasRenderBuffer = (function () {
            function CanvasRenderBuffer(width, height, root) {
                this.surface = egret.sys.createCanvasRenderBufferSurface(__createCanvas__, width, height, root);
                this.context = this.surface.getContext("2d");
                if (this.context) {
                    this.context.$offsetX = 0;
                    this.context.$offsetY = 0;
                }
                this.resize(width, height);
            }
            Object.defineProperty(CanvasRenderBuffer.prototype, "width", {
                get: function () {
                    return this.surface.width;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CanvasRenderBuffer.prototype, "height", {
                get: function () {
                    return this.surface.height;
                },
                enumerable: true,
                configurable: true
            });
            CanvasRenderBuffer.prototype.resize = function (width, height, useMaxSize) {
                egret.sys.resizeCanvasRenderBuffer(this, width, height, useMaxSize);
            };
            CanvasRenderBuffer.prototype.getPixels = function (x, y, width, height) {
                if (width === void 0) { width = 1; }
                if (height === void 0) { height = 1; }
                return this.context.getImageData(x, y, width, height).data;
            };
            CanvasRenderBuffer.prototype.toDataURL = function (type, encoderOptions) {
                return this.surface.toDataURL(type, encoderOptions);
            };
            CanvasRenderBuffer.prototype.clear = function () {
                this.context.setTransform(1, 0, 0, 1, 0, 0);
                this.context.clearRect(0, 0, this.surface.width, this.surface.height);
            };
            CanvasRenderBuffer.prototype.destroy = function () {
                this.surface.width = this.surface.height = 0;
            };
            return CanvasRenderBuffer;
        }());
        web.CanvasRenderBuffer = CanvasRenderBuffer;
    })(web = egret.web || (egret.web = {}));
})(egret || (egret = {}));
var egret;
(function (egret) {
    var web;
    (function (web) {
        var EgretWebGLAttribute = (function () {
            function EgretWebGLAttribute(gl, program, attributeData) {
                this.gl = gl;
                this.name = attributeData.name;
                this.type = attributeData.type;
                this.size = attributeData.size;
                this.location = gl.getAttribLocation(program, this.name);
                this.count = 0;
                this.initCount(gl);
                this.format = gl.FLOAT;
                this.initFormat(gl);
            }
            EgretWebGLAttribute.prototype.initCount = function (gl) {
                var type = this.type;
                switch (type) {
                    case 5126:
                    case 5120:
                    case 5121:
                    case 5123:
                        this.count = 1;
                        break;
                    case 35664:
                        this.count = 2;
                        break;
                    case 35665:
                        this.count = 3;
                        break;
                    case 35666:
                        this.count = 4;
                        break;
                }
            };
            EgretWebGLAttribute.prototype.initFormat = function (gl) {
                var type = this.type;
                switch (type) {
                    case 5126:
                    case 35664:
                    case 35665:
                    case 35666:
                        this.format = gl.FLOAT;
                        break;
                    case 5121:
                        this.format = gl.UNSIGNED_BYTE;
                        break;
                    case 5123:
                        this.format = gl.UNSIGNED_SHORT;
                        break;
                    case 5120:
                        this.format = gl.BYTE;
                        break;
                }
            };
            return EgretWebGLAttribute;
        }());
        web.EgretWebGLAttribute = EgretWebGLAttribute;
    })(web = egret.web || (egret.web = {}));
})(egret || (egret = {}));
var egret;
(function (egret) {
    var web;
    (function (web) {
        var EgretWebGLUniform = (function () {
            function EgretWebGLUniform(gl, program, uniformData) {
                this.gl = gl;
                this.name = uniformData.name;
                this.type = uniformData.type;
                this.size = uniformData.size;
                this.location = gl.getUniformLocation(program, this.name);
                this.setDefaultValue();
                this.generateSetValue();
                this.generateUpload();
            }
            EgretWebGLUniform.prototype.setDefaultValue = function () {
                var type = this.type;
                switch (type) {
                    case 5126:
                    case 35678:
                    case 35680:
                    case 35670:
                    case 5124:
                        this.value = 0;
                        break;
                    case 35664:
                    case 35671:
                    case 35667:
                        this.value = [0, 0];
                        break;
                    case 35665:
                    case 35672:
                    case 35668:
                        this.value = [0, 0, 0];
                        break;
                    case 35666:
                    case 35673:
                    case 35669:
                        this.value = [0, 0, 0, 0];
                        break;
                    case 35674:
                        this.value = new Float32Array([
                            1, 0,
                            0, 1
                        ]);
                        break;
                    case 35675:
                        this.value = new Float32Array([
                            1, 0, 0,
                            0, 1, 0,
                            0, 0, 1
                        ]);
                        break;
                    case 35676:
                        this.value = new Float32Array([
                            1, 0, 0, 0,
                            0, 1, 0, 0,
                            0, 0, 1, 0,
                            0, 0, 0, 1
                        ]);
                        break;
                }
            };
            EgretWebGLUniform.prototype.generateSetValue = function () {
                var type = this.type;
                switch (type) {
                    case 5126:
                    case 35678:
                    case 35680:
                    case 35670:
                    case 5124:
                        this.setValue = function (value) {
                            var notEqual = this.value !== value;
                            this.value = value;
                            notEqual && this.upload();
                        };
                        break;
                    case 35664:
                    case 35671:
                    case 35667:
                        this.setValue = function (value) {
                            var notEqual = this.value[0] !== value.x || this.value[1] !== value.y;
                            this.value[0] = value.x;
                            this.value[1] = value.y;
                            notEqual && this.upload();
                        };
                        break;
                    case 35665:
                    case 35672:
                    case 35668:
                        this.setValue = function (value) {
                            this.value[0] = value.x;
                            this.value[1] = value.y;
                            this.value[2] = value.z;
                            this.upload();
                        };
                        break;
                    case 35666:
                    case 35673:
                    case 35669:
                        this.setValue = function (value) {
                            this.value[0] = value.x;
                            this.value[1] = value.y;
                            this.value[2] = value.z;
                            this.value[3] = value.w;
                            this.upload();
                        };
                        break;
                    case 35674:
                    case 35675:
                    case 35676:
                        this.setValue = function (value) {
                            this.value.set(value);
                            this.upload();
                        };
                        break;
                }
            };
            EgretWebGLUniform.prototype.generateUpload = function () {
                var gl = this.gl;
                var type = this.type;
                var location = this.location;
                switch (type) {
                    case 5126:
                        this.upload = function () {
                            var value = this.value;
                            gl.uniform1f(location, value);
                        };
                        break;
                    case 35664:
                        this.upload = function () {
                            var value = this.value;
                            gl.uniform2f(location, value[0], value[1]);
                        };
                        break;
                    case 35665:
                        this.upload = function () {
                            var value = this.value;
                            gl.uniform3f(location, value[0], value[1], value[2]);
                        };
                        break;
                    case 35666:
                        this.upload = function () {
                            var value = this.value;
                            gl.uniform4f(location, value[0], value[1], value[2], value[3]);
                        };
                        break;
                    case 35678:
                    case 35680:
                    case 35670:
                    case 5124:
                        this.upload = function () {
                            var value = this.value;
                            gl.uniform1i(location, value);
                        };
                        break;
                    case 35671:
                    case 35667:
                        this.upload = function () {
                            var value = this.value;
                            gl.uniform2i(location, value[0], value[1]);
                        };
                        break;
                    case 35672:
                    case 35668:
                        this.upload = function () {
                            var value = this.value;
                            gl.uniform3i(location, value[0], value[1], value[2]);
                        };
                        break;
                    case 35673:
                    case 35669:
                        this.upload = function () {
                            var value = this.value;
                            gl.uniform4i(location, value[0], value[1], value[2], value[3]);
                        };
                        break;
                    case 35674:
                        this.upload = function () {
                            var value = this.value;
                            gl.uniformMatrix2fv(location, false, value);
                        };
                        break;
                    case 35675:
                        this.upload = function () {
                            var value = this.value;
                            gl.uniformMatrix3fv(location, false, value);
                        };
                        break;
                    case 35676:
                        this.upload = function () {
                            var value = this.value;
                            gl.uniformMatrix4fv(location, false, value);
                        };
                        break;
                }
            };
            return EgretWebGLUniform;
        }());
        web.EgretWebGLUniform = EgretWebGLUniform;
    })(web = egret.web || (egret.web = {}));
})(egret || (egret = {}));
var egret;
(function (egret) {
    var web;
    (function (web) {
        var TextBlock = (function (_super) {
            __extends(TextBlock, _super);
            function TextBlock(width, height, measureWidth, measureHeight, canvasWidthOffset, canvasHeightOffset, stroke2, border) {
                var _this = _super.call(this) || this;
                _this._width = 0;
                _this._height = 0;
                _this._border = 0;
                _this.line = null;
                _this.x = 0;
                _this.y = 0;
                _this.u = 0;
                _this.v = 0;
                _this.tag = '';
                _this.measureWidth = 0;
                _this.measureHeight = 0;
                _this.canvasWidthOffset = 0;
                _this.canvasHeightOffset = 0;
                _this.stroke2 = 0;
                _this._width = width;
                _this._height = height;
                _this._border = border;
                _this.measureWidth = measureWidth;
                _this.measureHeight = measureHeight;
                _this.canvasWidthOffset = canvasWidthOffset;
                _this.canvasHeightOffset = canvasHeightOffset;
                _this.stroke2 = stroke2;
                return _this;
            }
            Object.defineProperty(TextBlock.prototype, "border", {
                get: function () {
                    return this._border;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(TextBlock.prototype, "width", {
                get: function () {
                    return this._width + this.border * 2;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(TextBlock.prototype, "height", {
                get: function () {
                    return this._height + this.border * 2;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(TextBlock.prototype, "contentWidth", {
                get: function () {
                    return this._width;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(TextBlock.prototype, "contentHeight", {
                get: function () {
                    return this._height;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(TextBlock.prototype, "page", {
                get: function () {
                    return this.line ? this.line.page : null;
                },
                enumerable: true,
                configurable: true
            });
            TextBlock.prototype.updateUV = function () {
                var line = this.line;
                if (!line) {
                    return false;
                }
                this.u = line.x + this.x + this.border * 1;
                this.v = line.y + this.y + this.border * 1;
                return true;
            };
            Object.defineProperty(TextBlock.prototype, "subImageOffsetX", {
                get: function () {
                    var line = this.line;
                    if (!line) {
                        return 0;
                    }
                    return line.x + this.x + this.border;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(TextBlock.prototype, "subImageOffsetY", {
                get: function () {
                    var line = this.line;
                    if (!line) {
                        return 0;
                    }
                    return line.y + this.y + this.border;
                },
                enumerable: true,
                configurable: true
            });
            return TextBlock;
        }(egret.HashObject));
        web.TextBlock = TextBlock;
        var Line = (function (_super) {
            __extends(Line, _super);
            function Line(maxWidth) {
                var _this = _super.call(this) || this;
                _this.page = null;
                _this.textBlocks = [];
                _this.dynamicMaxHeight = 0;
                _this.maxWidth = 0;
                _this.x = 0;
                _this.y = 0;
                _this.maxWidth = maxWidth;
                return _this;
            }
            Line.prototype.isCapacityOf = function (textBlock) {
                if (!textBlock) {
                    return false;
                }
                var posx = 0;
                var posy = 0;
                var lastTxtBlock = this.lastTextBlock();
                if (lastTxtBlock) {
                    posx = lastTxtBlock.x + lastTxtBlock.width;
                    posy = lastTxtBlock.y;
                }
                if (posx + textBlock.width > this.maxWidth) {
                    return false;
                }
                if (this.dynamicMaxHeight > 0) {
                    if (textBlock.height > this.dynamicMaxHeight || (textBlock.height / this.dynamicMaxHeight < 0.5)) {
                        return false;
                    }
                }
                return true;
            };
            Line.prototype.lastTextBlock = function () {
                var textBlocks = this.textBlocks;
                if (textBlocks.length > 0) {
                    return textBlocks[textBlocks.length - 1];
                }
                return null;
            };
            Line.prototype.addTextBlock = function (textBlock, needCheck) {
                if (!textBlock) {
                    return false;
                }
                if (needCheck) {
                    if (!this.isCapacityOf(textBlock)) {
                        return false;
                    }
                }
                var posx = 0;
                var posy = 0;
                var lastTxtBlock = this.lastTextBlock();
                if (lastTxtBlock) {
                    posx = lastTxtBlock.x + lastTxtBlock.width;
                    posy = lastTxtBlock.y;
                }
                textBlock.x = posx;
                textBlock.y = posy;
                textBlock.line = this;
                this.textBlocks.push(textBlock);
                this.dynamicMaxHeight = Math.max(this.dynamicMaxHeight, textBlock.height);
                return true;
            };
            return Line;
        }(egret.HashObject));
        web.Line = Line;
        var Page = (function (_super) {
            __extends(Page, _super);
            function Page(pageWidth, pageHeight) {
                var _this = _super.call(this) || this;
                _this.lines = [];
                _this.pageWidth = 0;
                _this.pageHeight = 0;
                _this.webGLTexture = null;
                _this.pageWidth = pageWidth;
                _this.pageHeight = pageHeight;
                return _this;
            }
            Page.prototype.addLine = function (line) {
                if (!line) {
                    return false;
                }
                var posx = 0;
                var posy = 0;
                var lines = this.lines;
                if (lines.length > 0) {
                    var lastLine = lines[lines.length - 1];
                    posx = lastLine.x;
                    posy = lastLine.y + lastLine.dynamicMaxHeight;
                }
                if (line.maxWidth > this.pageWidth) {
                    console.error('line.maxWidth = ' + line.maxWidth + ', ' + 'this.pageWidth = ' + this.pageWidth);
                    return false;
                }
                if (posy + line.dynamicMaxHeight > this.pageHeight) {
                    return false;
                }
                line.x = posx;
                line.y = posy;
                line.page = this;
                this.lines.push(line);
                return true;
            };
            return Page;
        }(egret.HashObject));
        web.Page = Page;
        var Book = (function (_super) {
            __extends(Book, _super);
            function Book(maxSize, border) {
                var _this = _super.call(this) || this;
                _this._pages = [];
                _this._sortLines = [];
                _this._maxSize = 1024;
                _this._border = 1;
                _this._maxSize = maxSize;
                _this._border = border;
                return _this;
            }
            Book.prototype.addTextBlock = function (textBlock) {
                var result = this._addTextBlock(textBlock);
                if (!result) {
                    return false;
                }
                textBlock.updateUV();
                var exist = false;
                var cast = result;
                var _sortLines = this._sortLines;
                for (var _i = 0, _sortLines_1 = _sortLines; _i < _sortLines_1.length; _i++) {
                    var line = _sortLines_1[_i];
                    if (line === cast[1]) {
                        exist = true;
                        break;
                    }
                }
                if (!exist) {
                    _sortLines.push(cast[1]);
                }
                this.sort();
                return true;
            };
            Book.prototype._addTextBlock = function (textBlock) {
                if (!textBlock) {
                    return null;
                }
                if (textBlock.width > this._maxSize || textBlock.height > this._maxSize) {
                    return null;
                }
                var _sortLines = this._sortLines;
                for (var i = 0, length_16 = _sortLines.length; i < length_16; ++i) {
                    var line = _sortLines[i];
                    if (!line.isCapacityOf(textBlock)) {
                        continue;
                    }
                    if (line.addTextBlock(textBlock, false)) {
                        return [line.page, line];
                    }
                }
                var newLine = new Line(this._maxSize);
                if (!newLine.addTextBlock(textBlock, true)) {
                    console.error('_addTextBlock !newLine.addTextBlock(textBlock, true)');
                    return null;
                }
                var _pages = this._pages;
                for (var i = 0, length_17 = _pages.length; i < length_17; ++i) {
                    var page = _pages[i];
                    if (page.addLine(newLine)) {
                        return [page, newLine];
                    }
                }
                var newPage = this.createPage(this._maxSize, this._maxSize);
                if (!newPage.addLine(newLine)) {
                    console.error('_addText newPage.addLine failed');
                    return null;
                }
                return [newPage, newLine];
            };
            Book.prototype.createPage = function (pageWidth, pageHeight) {
                var newPage = new Page(pageWidth, pageHeight);
                this._pages.push(newPage);
                return newPage;
            };
            Book.prototype.sort = function () {
                if (this._sortLines.length <= 1) {
                    return;
                }
                var sortFunc = function (a, b) {
                    return (a.dynamicMaxHeight < b.dynamicMaxHeight) ? -1 : 1;
                };
                this._sortLines = this._sortLines.sort(sortFunc);
            };
            Book.prototype.createTextBlock = function (tag, width, height, measureWidth, measureHeight, canvasWidthOffset, canvasHeightOffset, stroke2) {
                var txtBlock = new TextBlock(width, height, measureWidth, measureHeight, canvasWidthOffset, canvasHeightOffset, stroke2, this._border);
                if (!this.addTextBlock(txtBlock)) {
                    return null;
                }
                txtBlock.tag = tag;
                return txtBlock;
            };
            return Book;
        }(egret.HashObject));
        web.Book = Book;
    })(web = egret.web || (egret.web = {}));
})(egret || (egret = {}));
var egret;
(function (egret) {
    var web;
    (function (web) {
        web.textAtlasRenderEnable = false;
        web.__textAtlasRender__ = null;
        web.property_drawLabel = 'DrawLabel';
        var textAtlasDebug = false;
        var DrawLabel = (function (_super) {
            __extends(DrawLabel, _super);
            function DrawLabel() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.anchorX = 0;
                _this.anchorY = 0;
                _this.textBlocks = [];
                return _this;
            }
            DrawLabel.prototype.clear = function () {
                this.anchorX = 0;
                this.anchorY = 0;
                this.textBlocks.length = 0;
            };
            DrawLabel.create = function () {
                var pool = DrawLabel.pool;
                if (pool.length === 0) {
                    pool.push(new DrawLabel);
                }
                return pool.pop();
            };
            DrawLabel.back = function (drawLabel, checkRepeat) {
                if (!drawLabel) {
                    return;
                }
                var pool = DrawLabel.pool;
                if (checkRepeat && pool.indexOf(drawLabel) >= 0) {
                    console.error('DrawLabel.back repeat');
                    return;
                }
                drawLabel.clear();
                pool.push(drawLabel);
            };
            DrawLabel.pool = [];
            return DrawLabel;
        }(egret.HashObject));
        web.DrawLabel = DrawLabel;
        var StyleInfo = (function (_super) {
            __extends(StyleInfo, _super);
            function StyleInfo(textNode, format) {
                var _this = _super.call(this) || this;
                _this.format = null;
                var saveTextColorForDebug = 0;
                if (textAtlasDebug) {
                    saveTextColorForDebug = textNode.textColor;
                    textNode.textColor = 0xff0000;
                }
                _this.textColor = textNode.textColor;
                _this.strokeColor = textNode.strokeColor;
                _this.size = textNode.size;
                _this.stroke = textNode.stroke;
                _this.bold = textNode.bold;
                _this.italic = textNode.italic;
                _this.fontFamily = textNode.fontFamily;
                _this.format = format;
                _this.font = egret.getFontString(textNode, _this.format);
                var textColor = (!format.textColor ? textNode.textColor : format.textColor);
                var strokeColor = (!format.strokeColor ? textNode.strokeColor : format.strokeColor);
                var stroke = (!format.stroke ? textNode.stroke : format.stroke);
                var size = (!format.size ? textNode.size : format.size);
                _this.description = '' + _this.font + '-' + size;
                _this.description += '-' + egret.toColorString(textColor);
                _this.description += '-' + egret.toColorString(strokeColor);
                if (stroke) {
                    _this.description += '-' + stroke * 2;
                }
                if (textAtlasDebug) {
                    textNode.textColor = saveTextColorForDebug;
                }
                return _this;
            }
            return StyleInfo;
        }(egret.HashObject));
        var CharImageRender = (function (_super) {
            __extends(CharImageRender, _super);
            function CharImageRender() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.char = '';
                _this.styleInfo = null;
                _this.hashCodeString = '';
                _this.charWithStyleHashCode = 0;
                _this.measureWidth = 0;
                _this.measureHeight = 0;
                _this.canvasWidthOffset = 0;
                _this.canvasHeightOffset = 0;
                _this.stroke2 = 0;
                return _this;
            }
            CharImageRender.prototype.reset = function (char, styleKey) {
                this.char = char;
                this.styleInfo = styleKey;
                this.hashCodeString = char + ':' + styleKey.description;
                this.charWithStyleHashCode = egret.NumberUtils.convertStringToHashCode(this.hashCodeString);
                this.canvasWidthOffset = 0;
                this.canvasHeightOffset = 0;
                this.stroke2 = 0;
                return this;
            };
            CharImageRender.prototype.measureAndDraw = function (targetCanvas) {
                var canvas = targetCanvas;
                if (!canvas) {
                    return;
                }
                var text = this.char;
                var format = this.styleInfo.format;
                var textColor = (!format.textColor ? this.styleInfo.textColor : format.textColor);
                var strokeColor = (!format.strokeColor ? this.styleInfo.strokeColor : format.strokeColor);
                var stroke = (!format.stroke ? this.styleInfo.stroke : format.stroke);
                var size = (!format.size ? this.styleInfo.size : format.size);
                this.measureWidth = this.measure(text, this.styleInfo, size);
                this.measureHeight = size;
                var canvasWidth = this.measureWidth;
                var canvasHeight = this.measureHeight;
                var _strokeDouble = stroke * 2;
                if (_strokeDouble > 0) {
                    canvasWidth += _strokeDouble * 2;
                    canvasHeight += _strokeDouble * 2;
                }
                this.stroke2 = _strokeDouble;
                canvas.width = canvasWidth = Math.ceil(canvasWidth) + 2 * 2;
                canvas.height = canvasHeight = Math.ceil(canvasHeight) + 2 * 2;
                this.canvasWidthOffset = (canvas.width - this.measureWidth) / 2;
                this.canvasHeightOffset = (canvas.height - this.measureHeight) / 2;
                var numberOfPrecision = 3;
                var precision = Math.pow(10, numberOfPrecision);
                this.canvasWidthOffset = Math.floor(this.canvasWidthOffset * precision) / precision;
                this.canvasHeightOffset = Math.floor(this.canvasHeightOffset * precision) / precision;
                var context = egret.sys.getContext2d(canvas);
                context.save();
                context.textAlign = 'center';
                context.textBaseline = 'middle';
                context.lineJoin = 'round';
                context.font = this.styleInfo.font;
                context.fillStyle = egret.toColorString(textColor);
                context.strokeStyle = egret.toColorString(strokeColor);
                context.clearRect(0, 0, canvas.width, canvas.height);
                if (stroke) {
                    context.lineWidth = stroke * 2;
                    context.strokeText(text, canvas.width / 2, canvas.height / 2);
                }
                context.fillText(text, canvas.width / 2, canvas.height / 2);
                context.restore();
            };
            CharImageRender.prototype.measure = function (text, styleKey, textFlowSize) {
                var isChinese = CharImageRender.chineseCharactersRegExp.test(text);
                if (isChinese) {
                    if (CharImageRender.chineseCharacterMeasureFastMap[styleKey.font]) {
                        return CharImageRender.chineseCharacterMeasureFastMap[styleKey.font];
                    }
                }
                var measureTextWidth = egret.sys.measureText(text, styleKey.fontFamily, textFlowSize || styleKey.size, styleKey.bold, styleKey.italic);
                if (isChinese) {
                    CharImageRender.chineseCharacterMeasureFastMap[styleKey.font] = measureTextWidth;
                }
                return measureTextWidth;
            };
            CharImageRender.chineseCharactersRegExp = new RegExp("^[\u4E00-\u9FA5]$");
            CharImageRender.chineseCharacterMeasureFastMap = {};
            return CharImageRender;
        }(egret.HashObject));
        var TextAtlasRender = (function (_super) {
            __extends(TextAtlasRender, _super);
            function TextAtlasRender(webglRenderContext, maxSize, border) {
                var _this = _super.call(this) || this;
                _this.book = null;
                _this.charImageRender = new CharImageRender;
                _this.textBlockMap = {};
                _this._canvas = null;
                _this.textAtlasTextureCache = [];
                _this.webglRenderContext = null;
                _this.webglRenderContext = webglRenderContext;
                _this.book = new web.Book(maxSize, border);
                return _this;
            }
            TextAtlasRender.analysisTextNodeAndFlushDrawLabel = function (textNode) {
                if (!textNode) {
                    return;
                }
                if (!web.__textAtlasRender__) {
                    var webglcontext = egret.web.WebGLRenderContext.getInstance(0, 0);
                    web.__textAtlasRender__ = new TextAtlasRender(webglcontext, textAtlasDebug ? 512 : 512, textAtlasDebug ? 12 : 1);
                }
                textNode[web.property_drawLabel] = textNode[web.property_drawLabel] || [];
                var drawLabels = textNode[web.property_drawLabel];
                for (var _i = 0, drawLabels_1 = drawLabels; _i < drawLabels_1.length; _i++) {
                    var drawLabel = drawLabels_1[_i];
                    DrawLabel.back(drawLabel, false);
                }
                drawLabels.length = 0;
                var offset = 4;
                var drawData = textNode.drawData;
                var anchorX = 0;
                var anchorY = 0;
                var labelString = '';
                var labelFormat = {};
                var resultAsRenderTextBlocks = [];
                for (var i = 0, length_18 = drawData.length; i < length_18; i += offset) {
                    anchorX = drawData[i + 0];
                    anchorY = drawData[i + 1];
                    labelString = drawData[i + 2];
                    labelFormat = drawData[i + 3] || {};
                    resultAsRenderTextBlocks.length = 0;
                    web.__textAtlasRender__.convertLabelStringToTextAtlas(labelString, new StyleInfo(textNode, labelFormat), resultAsRenderTextBlocks);
                    var drawLabel = DrawLabel.create();
                    drawLabel.anchorX = anchorX;
                    drawLabel.anchorY = anchorY;
                    drawLabel.textBlocks = [].concat(resultAsRenderTextBlocks);
                    drawLabels.push(drawLabel);
                }
            };
            TextAtlasRender.prototype.convertLabelStringToTextAtlas = function (labelstring, styleKey, resultAsRenderTextBlocks) {
                var canvas = this.canvas;
                var charImageRender = this.charImageRender;
                var textBlockMap = this.textBlockMap;
                for (var _i = 0, labelstring_1 = labelstring; _i < labelstring_1.length; _i++) {
                    var char = labelstring_1[_i];
                    charImageRender.reset(char, styleKey);
                    if (textBlockMap[charImageRender.charWithStyleHashCode]) {
                        resultAsRenderTextBlocks.push(textBlockMap[charImageRender.charWithStyleHashCode]);
                        continue;
                    }
                    charImageRender.measureAndDraw(canvas);
                    var txtBlock = this.book.createTextBlock(char, canvas.width, canvas.height, charImageRender.measureWidth, charImageRender.measureHeight, charImageRender.canvasWidthOffset, charImageRender.canvasHeightOffset, charImageRender.stroke2);
                    if (!txtBlock) {
                        continue;
                    }
                    resultAsRenderTextBlocks.push(txtBlock);
                    textBlockMap[charImageRender.charWithStyleHashCode] = txtBlock;
                    var page = txtBlock.page;
                    if (!page.webGLTexture) {
                        page.webGLTexture = this.createTextTextureAtlas(page.pageWidth, page.pageHeight, textAtlasDebug);
                    }
                    var gl = this.webglRenderContext.context;
                    page.webGLTexture[egret.glContext] = gl;
                    gl.bindTexture(gl.TEXTURE_2D, page.webGLTexture);
                    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
                    page.webGLTexture[egret.UNPACK_PREMULTIPLY_ALPHA_WEBGL] = true;
                    gl.texSubImage2D(gl.TEXTURE_2D, 0, txtBlock.subImageOffsetX, txtBlock.subImageOffsetY, gl.RGBA, gl.UNSIGNED_BYTE, canvas);
                    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
                }
            };
            TextAtlasRender.prototype.createTextTextureAtlas = function (width, height, debug) {
                var texture = null;
                if (debug) {
                    var canvas = egret.sys.createCanvas(width, width);
                    var context = egret.sys.getContext2d(canvas);
                    context.fillStyle = 'black';
                    context.fillRect(0, 0, width, width);
                    texture = egret.sys.createTexture(this.webglRenderContext, canvas);
                }
                else {
                    texture = egret.sys._createTexture(this.webglRenderContext, width, height, null);
                }
                if (texture) {
                    this.textAtlasTextureCache.push(texture);
                }
                return texture;
            };
            Object.defineProperty(TextAtlasRender.prototype, "canvas", {
                get: function () {
                    if (!this._canvas) {
                        this._canvas = egret.sys.createCanvas(24, 24);
                    }
                    return this._canvas;
                },
                enumerable: true,
                configurable: true
            });
            return TextAtlasRender;
        }(egret.HashObject));
        web.TextAtlasRender = TextAtlasRender;
    })(web = egret.web || (egret.web = {}));
})(egret || (egret = {}));
var egret;
(function (egret) {
    var web;
    (function (web) {
        var WebGLDrawCmdManager = (function () {
            function WebGLDrawCmdManager() {
                this.drawData = [];
                this.drawDataLen = 0;
            }
            WebGLDrawCmdManager.prototype.pushDrawRect = function () {
                if (this.drawDataLen == 0 || this.drawData[this.drawDataLen - 1].type != 1) {
                    var data = this.drawData[this.drawDataLen] || {};
                    data.type = 1;
                    data.count = 0;
                    this.drawData[this.drawDataLen] = data;
                    this.drawDataLen++;
                }
                this.drawData[this.drawDataLen - 1].count += 2;
            };
            WebGLDrawCmdManager.prototype.pushDrawTexture = function (texture, count, filter, textureWidth, textureHeight) {
                if (count === void 0) { count = 2; }
                if (filter) {
                    var data = this.drawData[this.drawDataLen] || {};
                    data.type = 0;
                    data.texture = texture;
                    data.filter = filter;
                    data.count = count;
                    data.textureWidth = textureWidth;
                    data.textureHeight = textureHeight;
                    this.drawData[this.drawDataLen] = data;
                    this.drawDataLen++;
                }
                else {
                    if (this.drawDataLen == 0 || this.drawData[this.drawDataLen - 1].type != 0 || texture != this.drawData[this.drawDataLen - 1].texture || this.drawData[this.drawDataLen - 1].filter) {
                        var data = this.drawData[this.drawDataLen] || {};
                        data.type = 0;
                        data.texture = texture;
                        data.count = 0;
                        this.drawData[this.drawDataLen] = data;
                        this.drawDataLen++;
                    }
                    this.drawData[this.drawDataLen - 1].count += count;
                }
            };
            WebGLDrawCmdManager.prototype.pushChangeSmoothing = function (texture, smoothing) {
                texture["smoothing"] = smoothing;
                var data = this.drawData[this.drawDataLen] || {};
                data.type = 10;
                data.texture = texture;
                data.smoothing = smoothing;
                this.drawData[this.drawDataLen] = data;
                this.drawDataLen++;
            };
            WebGLDrawCmdManager.prototype.pushPushMask = function (count) {
                if (count === void 0) { count = 1; }
                var data = this.drawData[this.drawDataLen] || {};
                data.type = 2;
                data.count = count * 2;
                this.drawData[this.drawDataLen] = data;
                this.drawDataLen++;
            };
            WebGLDrawCmdManager.prototype.pushPopMask = function (count) {
                if (count === void 0) { count = 1; }
                var data = this.drawData[this.drawDataLen] || {};
                data.type = 3;
                data.count = count * 2;
                this.drawData[this.drawDataLen] = data;
                this.drawDataLen++;
            };
            WebGLDrawCmdManager.prototype.pushSetBlend = function (value) {
                var len = this.drawDataLen;
                var drawState = false;
                for (var i = len - 1; i >= 0; i--) {
                    var data = this.drawData[i];
                    if (data) {
                        if (data.type == 0 || data.type == 1) {
                            drawState = true;
                        }
                        if (!drawState && data.type == 4) {
                            this.drawData.splice(i, 1);
                            this.drawDataLen--;
                            continue;
                        }
                        if (data.type == 4) {
                            if (data.value == value) {
                                return;
                            }
                            else {
                                break;
                            }
                        }
                    }
                }
                var _data = this.drawData[this.drawDataLen] || {};
                _data.type = 4;
                _data.value = value;
                this.drawData[this.drawDataLen] = _data;
                this.drawDataLen++;
            };
            WebGLDrawCmdManager.prototype.pushResize = function (buffer, width, height) {
                var data = this.drawData[this.drawDataLen] || {};
                data.type = 5;
                data.buffer = buffer;
                data.width = width;
                data.height = height;
                this.drawData[this.drawDataLen] = data;
                this.drawDataLen++;
            };
            WebGLDrawCmdManager.prototype.pushClearColor = function () {
                var data = this.drawData[this.drawDataLen] || {};
                data.type = 6;
                this.drawData[this.drawDataLen] = data;
                this.drawDataLen++;
            };
            WebGLDrawCmdManager.prototype.pushActivateBuffer = function (buffer) {
                var len = this.drawDataLen;
                var drawState = false;
                for (var i = len - 1; i >= 0; i--) {
                    var data = this.drawData[i];
                    if (data) {
                        if (data.type != 4 && data.type != 7) {
                            drawState = true;
                        }
                        if (!drawState && data.type == 7) {
                            this.drawData.splice(i, 1);
                            this.drawDataLen--;
                            continue;
                        }
                    }
                }
                var _data = this.drawData[this.drawDataLen] || {};
                _data.type = 7;
                _data.buffer = buffer;
                _data.width = buffer.rootRenderTarget.width;
                _data.height = buffer.rootRenderTarget.height;
                this.drawData[this.drawDataLen] = _data;
                this.drawDataLen++;
            };
            WebGLDrawCmdManager.prototype.pushEnableScissor = function (x, y, width, height) {
                var data = this.drawData[this.drawDataLen] || {};
                data.type = 8;
                data.x = x;
                data.y = y;
                data.width = width;
                data.height = height;
                this.drawData[this.drawDataLen] = data;
                this.drawDataLen++;
            };
            WebGLDrawCmdManager.prototype.pushDisableScissor = function () {
                var data = this.drawData[this.drawDataLen] || {};
                data.type = 9;
                this.drawData[this.drawDataLen] = data;
                this.drawDataLen++;
            };
            WebGLDrawCmdManager.prototype.clear = function () {
                for (var i = 0; i < this.drawDataLen; i++) {
                    var data = this.drawData[i];
                    data.type = 0;
                    data.count = 0;
                    data.texture = null;
                    data.filter = null;
                    data.value = "";
                    data.buffer = null;
                    data.width = 0;
                    data.height = 0;
                    data.textureWidth = 0;
                    data.textureHeight = 0;
                    data.smoothing = false;
                    data.x = 0;
                    data.y = 0;
                }
                this.drawDataLen = 0;
            };
            return WebGLDrawCmdManager;
        }());
        web.WebGLDrawCmdManager = WebGLDrawCmdManager;
    })(web = egret.web || (egret.web = {}));
})(egret || (egret = {}));
var egret;
(function (egret) {
    var web;
    (function (web) {
        var blendModes = ["source-over", "lighter", "destination-out"];
        var defaultCompositeOp = "source-over";
        var BLACK_COLOR = "#000000";
        var CAPS_STYLES = { none: 'butt', square: 'square', round: 'round' };
        var renderBufferPool = [];
        var WebGLRenderer = (function () {
            function WebGLRenderer() {
                this.wxiOS10 = false;
                this.nestLevel = 0;
            }
            WebGLRenderer.prototype.render = function (displayObject, buffer, matrix, forRenderTexture) {
                this.nestLevel++;
                var webglBuffer = buffer;
                var webglBufferContext = webglBuffer.context;
                var root = forRenderTexture ? displayObject : null;
                webglBufferContext.pushBuffer(webglBuffer);
                webglBuffer.transform(matrix.a, matrix.b, matrix.c, matrix.d, 0, 0);
                this.drawDisplayObject(displayObject, webglBuffer, matrix.tx, matrix.ty, true);
                webglBufferContext.$drawWebGL();
                var drawCall = webglBuffer.$drawCalls;
                webglBuffer.onRenderFinish();
                webglBufferContext.popBuffer();
                var invert = egret.Matrix.create();
                matrix.$invertInto(invert);
                webglBuffer.transform(invert.a, invert.b, invert.c, invert.d, 0, 0);
                egret.Matrix.release(invert);
                this.nestLevel--;
                if (this.nestLevel === 0) {
                    if (renderBufferPool.length > 6) {
                        renderBufferPool.length = 6;
                    }
                    var length_19 = renderBufferPool.length;
                    for (var i = 0; i < length_19; i++) {
                        renderBufferPool[i].resize(0, 0);
                    }
                }
                return drawCall;
            };
            WebGLRenderer.prototype.drawDisplayObject = function (displayObject, buffer, offsetX, offsetY, isStage) {
                var drawCalls = 0;
                var node;
                var displayList = displayObject.$displayList;
                if (displayList && !isStage) {
                    if (displayObject.$cacheDirty || displayObject.$renderDirty ||
                        displayList.$canvasScaleX != egret.sys.DisplayList.$canvasScaleX ||
                        displayList.$canvasScaleY != egret.sys.DisplayList.$canvasScaleY) {
                        drawCalls += displayList.drawToSurface();
                    }
                    node = displayList.$renderNode;
                }
                else {
                    if (displayObject.$renderDirty) {
                        node = displayObject.$getRenderNode();
                    }
                    else {
                        node = displayObject.$renderNode;
                    }
                }
                displayObject.$cacheDirty = false;
                if (node) {
                    drawCalls++;
                    buffer.$offsetX = offsetX;
                    buffer.$offsetY = offsetY;
                    switch (node.type) {
                        case 1:
                            this.renderBitmap(node, buffer);
                            break;
                        case 2:
                            this.renderText(node, buffer);
                            break;
                        case 3:
                            this.renderGraphics(node, buffer);
                            break;
                        case 4:
                            this.renderGroup(node, buffer);
                            break;
                        case 5:
                            this.renderMesh(node, buffer);
                            break;
                        case 6:
                            this.renderNormalBitmap(node, buffer);
                            break;
                    }
                    buffer.$offsetX = 0;
                    buffer.$offsetY = 0;
                }
                if (displayList && !isStage) {
                    return drawCalls;
                }
                var children = displayObject.$children;
                if (children) {
                    if (displayObject.sortableChildren && displayObject.$sortDirty) {
                        displayObject.sortChildren();
                    }
                    var length_20 = children.length;
                    for (var i = 0; i < length_20; i++) {
                        var child = children[i];
                        var offsetX2 = void 0;
                        var offsetY2 = void 0;
                        var tempAlpha = void 0;
                        var tempTintColor = void 0;
                        if (child.$alpha != 1) {
                            tempAlpha = buffer.globalAlpha;
                            buffer.globalAlpha *= child.$alpha;
                        }
                        if (child.tint !== 0xFFFFFF) {
                            tempTintColor = buffer.globalTintColor;
                            buffer.globalTintColor = child.$tintRGB;
                        }
                        var savedMatrix = void 0;
                        if (child.$useTranslate) {
                            var m = child.$getMatrix();
                            offsetX2 = offsetX + child.$x;
                            offsetY2 = offsetY + child.$y;
                            var m2 = buffer.globalMatrix;
                            savedMatrix = egret.Matrix.create();
                            savedMatrix.a = m2.a;
                            savedMatrix.b = m2.b;
                            savedMatrix.c = m2.c;
                            savedMatrix.d = m2.d;
                            savedMatrix.tx = m2.tx;
                            savedMatrix.ty = m2.ty;
                            buffer.transform(m.a, m.b, m.c, m.d, offsetX2, offsetY2);
                            offsetX2 = -child.$anchorOffsetX;
                            offsetY2 = -child.$anchorOffsetY;
                        }
                        else {
                            offsetX2 = offsetX + child.$x - child.$anchorOffsetX;
                            offsetY2 = offsetY + child.$y - child.$anchorOffsetY;
                        }
                        switch (child.$renderMode) {
                            case 1:
                                break;
                            case 2:
                                drawCalls += this.drawWithFilter(child, buffer, offsetX2, offsetY2);
                                break;
                            case 3:
                                drawCalls += this.drawWithClip(child, buffer, offsetX2, offsetY2);
                                break;
                            case 4:
                                drawCalls += this.drawWithScrollRect(child, buffer, offsetX2, offsetY2);
                                break;
                            default:
                                drawCalls += this.drawDisplayObject(child, buffer, offsetX2, offsetY2);
                                break;
                        }
                        if (tempAlpha) {
                            buffer.globalAlpha = tempAlpha;
                        }
                        if (tempTintColor) {
                            buffer.globalTintColor = tempTintColor;
                        }
                        if (savedMatrix) {
                            var m = buffer.globalMatrix;
                            m.a = savedMatrix.a;
                            m.b = savedMatrix.b;
                            m.c = savedMatrix.c;
                            m.d = savedMatrix.d;
                            m.tx = savedMatrix.tx;
                            m.ty = savedMatrix.ty;
                            egret.Matrix.release(savedMatrix);
                        }
                    }
                }
                return drawCalls;
            };
            WebGLRenderer.prototype.drawWithFilter = function (displayObject, buffer, offsetX, offsetY) {
                var drawCalls = 0;
                if (displayObject.$children && displayObject.$children.length == 0 && (!displayObject.$renderNode || displayObject.$renderNode.$getRenderCount() == 0)) {
                    return drawCalls;
                }
                var filters = displayObject.$filters;
                var hasBlendMode = (displayObject.$blendMode !== 0);
                var compositeOp;
                if (hasBlendMode) {
                    compositeOp = blendModes[displayObject.$blendMode];
                    if (!compositeOp) {
                        compositeOp = defaultCompositeOp;
                    }
                }
                var displayBounds = displayObject.$getOriginalBounds();
                var displayBoundsX = displayBounds.x;
                var displayBoundsY = displayBounds.y;
                var displayBoundsWidth = displayBounds.width;
                var displayBoundsHeight = displayBounds.height;
                if (displayBoundsWidth <= 0 || displayBoundsHeight <= 0) {
                    return drawCalls;
                }
                if (!displayObject.mask && filters.length == 1 && (filters[0].type == "colorTransform" || (filters[0].type === "custom" && filters[0].padding === 0))) {
                    var childrenDrawCount = this.getRenderCount(displayObject);
                    if (!displayObject.$children || childrenDrawCount == 1) {
                        if (hasBlendMode) {
                            buffer.context.setGlobalCompositeOperation(compositeOp);
                        }
                        buffer.context.$filter = filters[0];
                        if (displayObject.$mask) {
                            drawCalls += this.drawWithClip(displayObject, buffer, offsetX, offsetY);
                        }
                        else if (displayObject.$scrollRect || displayObject.$maskRect) {
                            drawCalls += this.drawWithScrollRect(displayObject, buffer, offsetX, offsetY);
                        }
                        else {
                            drawCalls += this.drawDisplayObject(displayObject, buffer, offsetX, offsetY);
                        }
                        buffer.context.$filter = null;
                        if (hasBlendMode) {
                            buffer.context.setGlobalCompositeOperation(defaultCompositeOp);
                        }
                        return drawCalls;
                    }
                }
                var displayBuffer = this.createRenderBuffer(displayBoundsWidth, displayBoundsHeight);
                displayBuffer.context.pushBuffer(displayBuffer);
                if (displayObject.$mask) {
                    drawCalls += this.drawWithClip(displayObject, displayBuffer, -displayBoundsX, -displayBoundsY);
                }
                else if (displayObject.$scrollRect || displayObject.$maskRect) {
                    drawCalls += this.drawWithScrollRect(displayObject, displayBuffer, -displayBoundsX, -displayBoundsY);
                }
                else {
                    drawCalls += this.drawDisplayObject(displayObject, displayBuffer, -displayBoundsX, -displayBoundsY);
                }
                displayBuffer.context.popBuffer();
                if (drawCalls > 0) {
                    if (hasBlendMode) {
                        buffer.context.setGlobalCompositeOperation(compositeOp);
                    }
                    drawCalls++;
                    buffer.$offsetX = offsetX + displayBoundsX;
                    buffer.$offsetY = offsetY + displayBoundsY;
                    var savedMatrix = egret.Matrix.create();
                    var curMatrix = buffer.globalMatrix;
                    savedMatrix.a = curMatrix.a;
                    savedMatrix.b = curMatrix.b;
                    savedMatrix.c = curMatrix.c;
                    savedMatrix.d = curMatrix.d;
                    savedMatrix.tx = curMatrix.tx;
                    savedMatrix.ty = curMatrix.ty;
                    buffer.useOffset();
                    buffer.context.drawTargetWidthFilters(filters, displayBuffer);
                    curMatrix.a = savedMatrix.a;
                    curMatrix.b = savedMatrix.b;
                    curMatrix.c = savedMatrix.c;
                    curMatrix.d = savedMatrix.d;
                    curMatrix.tx = savedMatrix.tx;
                    curMatrix.ty = savedMatrix.ty;
                    egret.Matrix.release(savedMatrix);
                    if (hasBlendMode) {
                        buffer.context.setGlobalCompositeOperation(defaultCompositeOp);
                    }
                }
                renderBufferPool.push(displayBuffer);
                return drawCalls;
            };
            WebGLRenderer.prototype.getRenderCount = function (displayObject) {
                var drawCount = 0;
                var node = displayObject.$getRenderNode();
                if (node) {
                    drawCount += node.$getRenderCount();
                }
                if (displayObject.$children) {
                    for (var _i = 0, _a = displayObject.$children; _i < _a.length; _i++) {
                        var child = _a[_i];
                        var filters = child.$filters;
                        if (filters && filters.length > 0) {
                            return 2;
                        }
                        else if (child.$children) {
                            drawCount += this.getRenderCount(child);
                        }
                        else {
                            var node_1 = child.$getRenderNode();
                            if (node_1) {
                                drawCount += node_1.$getRenderCount();
                            }
                        }
                    }
                }
                return drawCount;
            };
            WebGLRenderer.prototype.drawWithClip = function (displayObject, buffer, offsetX, offsetY) {
                var drawCalls = 0;
                var hasBlendMode = (displayObject.$blendMode !== 0);
                var compositeOp;
                if (hasBlendMode) {
                    compositeOp = blendModes[displayObject.$blendMode];
                    if (!compositeOp) {
                        compositeOp = defaultCompositeOp;
                    }
                }
                var scrollRect = displayObject.$scrollRect ? displayObject.$scrollRect : displayObject.$maskRect;
                var mask = displayObject.$mask;
                if (mask) {
                    var maskRenderMatrix = mask.$getMatrix();
                    if ((maskRenderMatrix.a == 0 && maskRenderMatrix.b == 0) || (maskRenderMatrix.c == 0 && maskRenderMatrix.d == 0)) {
                        return drawCalls;
                    }
                }
                if (!mask && (!displayObject.$children || displayObject.$children.length == 0)) {
                    if (scrollRect) {
                        buffer.context.pushMask(scrollRect.x + offsetX, scrollRect.y + offsetY, scrollRect.width, scrollRect.height);
                    }
                    if (hasBlendMode) {
                        buffer.context.setGlobalCompositeOperation(compositeOp);
                    }
                    drawCalls += this.drawDisplayObject(displayObject, buffer, offsetX, offsetY);
                    if (hasBlendMode) {
                        buffer.context.setGlobalCompositeOperation(defaultCompositeOp);
                    }
                    if (scrollRect) {
                        buffer.context.popMask();
                    }
                    return drawCalls;
                }
                else {
                    var displayBounds = displayObject.$getOriginalBounds();
                    var displayBoundsX = displayBounds.x;
                    var displayBoundsY = displayBounds.y;
                    var displayBoundsWidth = displayBounds.width;
                    var displayBoundsHeight = displayBounds.height;
                    if (displayBoundsWidth <= 0 || displayBoundsHeight <= 0) {
                        return drawCalls;
                    }
                    var displayBuffer = this.createRenderBuffer(displayBoundsWidth, displayBoundsHeight);
                    displayBuffer.context.pushBuffer(displayBuffer);
                    drawCalls += this.drawDisplayObject(displayObject, displayBuffer, -displayBoundsX, -displayBoundsY);
                    if (mask) {
                        var maskBuffer = this.createRenderBuffer(displayBoundsWidth, displayBoundsHeight);
                        maskBuffer.context.pushBuffer(maskBuffer);
                        var maskMatrix = egret.Matrix.create();
                        maskMatrix.copyFrom(mask.$getConcatenatedMatrix());
                        mask.$getConcatenatedMatrixAt(displayObject, maskMatrix);
                        maskMatrix.translate(-displayBoundsX, -displayBoundsY);
                        maskBuffer.setTransform(maskMatrix.a, maskMatrix.b, maskMatrix.c, maskMatrix.d, maskMatrix.tx, maskMatrix.ty);
                        egret.Matrix.release(maskMatrix);
                        drawCalls += this.drawDisplayObject(mask, maskBuffer, 0, 0);
                        maskBuffer.context.popBuffer();
                        displayBuffer.context.setGlobalCompositeOperation("destination-in");
                        displayBuffer.setTransform(1, 0, 0, -1, 0, maskBuffer.height);
                        var maskBufferWidth = maskBuffer.rootRenderTarget.width;
                        var maskBufferHeight = maskBuffer.rootRenderTarget.height;
                        displayBuffer.context.drawTexture(maskBuffer.rootRenderTarget.texture, 0, 0, maskBufferWidth, maskBufferHeight, 0, 0, maskBufferWidth, maskBufferHeight, maskBufferWidth, maskBufferHeight);
                        displayBuffer.setTransform(1, 0, 0, 1, 0, 0);
                        displayBuffer.context.setGlobalCompositeOperation("source-over");
                        maskBuffer.setTransform(1, 0, 0, 1, 0, 0);
                        renderBufferPool.push(maskBuffer);
                    }
                    displayBuffer.context.setGlobalCompositeOperation(defaultCompositeOp);
                    displayBuffer.context.popBuffer();
                    if (drawCalls > 0) {
                        drawCalls++;
                        if (hasBlendMode) {
                            buffer.context.setGlobalCompositeOperation(compositeOp);
                        }
                        if (scrollRect) {
                            buffer.context.pushMask(scrollRect.x + offsetX, scrollRect.y + offsetY, scrollRect.width, scrollRect.height);
                        }
                        var savedMatrix = egret.Matrix.create();
                        var curMatrix = buffer.globalMatrix;
                        savedMatrix.a = curMatrix.a;
                        savedMatrix.b = curMatrix.b;
                        savedMatrix.c = curMatrix.c;
                        savedMatrix.d = curMatrix.d;
                        savedMatrix.tx = curMatrix.tx;
                        savedMatrix.ty = curMatrix.ty;
                        curMatrix.append(1, 0, 0, -1, offsetX + displayBoundsX, offsetY + displayBoundsY + displayBuffer.height);
                        var displayBufferWidth = displayBuffer.rootRenderTarget.width;
                        var displayBufferHeight = displayBuffer.rootRenderTarget.height;
                        buffer.context.drawTexture(displayBuffer.rootRenderTarget.texture, 0, 0, displayBufferWidth, displayBufferHeight, 0, 0, displayBufferWidth, displayBufferHeight, displayBufferWidth, displayBufferHeight);
                        if (scrollRect) {
                            displayBuffer.context.popMask();
                        }
                        if (hasBlendMode) {
                            buffer.context.setGlobalCompositeOperation(defaultCompositeOp);
                        }
                        var matrix = buffer.globalMatrix;
                        matrix.a = savedMatrix.a;
                        matrix.b = savedMatrix.b;
                        matrix.c = savedMatrix.c;
                        matrix.d = savedMatrix.d;
                        matrix.tx = savedMatrix.tx;
                        matrix.ty = savedMatrix.ty;
                        egret.Matrix.release(savedMatrix);
                    }
                    renderBufferPool.push(displayBuffer);
                    return drawCalls;
                }
            };
            WebGLRenderer.prototype.drawWithScrollRect = function (displayObject, buffer, offsetX, offsetY) {
                var drawCalls = 0;
                var scrollRect = displayObject.$scrollRect ? displayObject.$scrollRect : displayObject.$maskRect;
                if (scrollRect.isEmpty()) {
                    return drawCalls;
                }
                if (displayObject.$scrollRect) {
                    offsetX -= scrollRect.x;
                    offsetY -= scrollRect.y;
                }
                var m = buffer.globalMatrix;
                var context = buffer.context;
                var scissor = false;
                if (buffer.$hasScissor || m.b != 0 || m.c != 0) {
                    buffer.context.pushMask(scrollRect.x + offsetX, scrollRect.y + offsetY, scrollRect.width, scrollRect.height);
                }
                else {
                    var a = m.a;
                    var d = m.d;
                    var tx = m.tx;
                    var ty = m.ty;
                    var x = scrollRect.x + offsetX;
                    var y = scrollRect.y + offsetY;
                    var xMax = x + scrollRect.width;
                    var yMax = y + scrollRect.height;
                    var minX = void 0, minY = void 0, maxX = void 0, maxY = void 0;
                    if (a == 1.0 && d == 1.0) {
                        minX = x + tx;
                        minY = y + ty;
                        maxX = xMax + tx;
                        maxY = yMax + ty;
                    }
                    else {
                        var x0 = a * x + tx;
                        var y0 = d * y + ty;
                        var x1 = a * xMax + tx;
                        var y1 = d * y + ty;
                        var x2 = a * xMax + tx;
                        var y2 = d * yMax + ty;
                        var x3 = a * x + tx;
                        var y3 = d * yMax + ty;
                        var tmp = 0;
                        if (x0 > x1) {
                            tmp = x0;
                            x0 = x1;
                            x1 = tmp;
                        }
                        if (x2 > x3) {
                            tmp = x2;
                            x2 = x3;
                            x3 = tmp;
                        }
                        minX = (x0 < x2 ? x0 : x2);
                        maxX = (x1 > x3 ? x1 : x3);
                        if (y0 > y1) {
                            tmp = y0;
                            y0 = y1;
                            y1 = tmp;
                        }
                        if (y2 > y3) {
                            tmp = y2;
                            y2 = y3;
                            y3 = tmp;
                        }
                        minY = (y0 < y2 ? y0 : y2);
                        maxY = (y1 > y3 ? y1 : y3);
                    }
                    context.enableScissor(minX, -maxY + buffer.height, maxX - minX, maxY - minY);
                    scissor = true;
                }
                drawCalls += this.drawDisplayObject(displayObject, buffer, offsetX, offsetY);
                if (scissor) {
                    context.disableScissor();
                }
                else {
                    context.popMask();
                }
                return drawCalls;
            };
            WebGLRenderer.prototype.drawNodeToBuffer = function (node, buffer, matrix, forHitTest) {
                var webglBuffer = buffer;
                webglBuffer.context.pushBuffer(webglBuffer);
                webglBuffer.setTransform(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
                this.renderNode(node, buffer, 0, 0, forHitTest);
                webglBuffer.context.$drawWebGL();
                webglBuffer.onRenderFinish();
                webglBuffer.context.popBuffer();
            };
            WebGLRenderer.prototype.drawDisplayToBuffer = function (displayObject, buffer, matrix) {
                buffer.context.pushBuffer(buffer);
                if (matrix) {
                    buffer.setTransform(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
                }
                var node;
                if (displayObject.$renderDirty) {
                    node = displayObject.$getRenderNode();
                }
                else {
                    node = displayObject.$renderNode;
                }
                var drawCalls = 0;
                if (node) {
                    drawCalls++;
                    switch (node.type) {
                        case 1:
                            this.renderBitmap(node, buffer);
                            break;
                        case 2:
                            this.renderText(node, buffer);
                            break;
                        case 3:
                            this.renderGraphics(node, buffer);
                            break;
                        case 4:
                            this.renderGroup(node, buffer);
                            break;
                        case 5:
                            this.renderMesh(node, buffer);
                            break;
                        case 6:
                            this.renderNormalBitmap(node, buffer);
                            break;
                    }
                }
                var children = displayObject.$children;
                if (children) {
                    var length_21 = children.length;
                    for (var i = 0; i < length_21; i++) {
                        var child = children[i];
                        switch (child.$renderMode) {
                            case 1:
                                break;
                            case 2:
                                drawCalls += this.drawWithFilter(child, buffer, 0, 0);
                                break;
                            case 3:
                                drawCalls += this.drawWithClip(child, buffer, 0, 0);
                                break;
                            case 4:
                                drawCalls += this.drawWithScrollRect(child, buffer, 0, 0);
                                break;
                            default:
                                drawCalls += this.drawDisplayObject(child, buffer, 0, 0);
                                break;
                        }
                    }
                }
                buffer.context.$drawWebGL();
                buffer.onRenderFinish();
                buffer.context.popBuffer();
                return drawCalls;
            };
            WebGLRenderer.prototype.renderNode = function (node, buffer, offsetX, offsetY, forHitTest) {
                buffer.$offsetX = offsetX;
                buffer.$offsetY = offsetY;
                switch (node.type) {
                    case 1:
                        this.renderBitmap(node, buffer);
                        break;
                    case 2:
                        this.renderText(node, buffer);
                        break;
                    case 3:
                        this.renderGraphics(node, buffer, forHitTest);
                        break;
                    case 4:
                        this.renderGroup(node, buffer);
                        break;
                    case 5:
                        this.renderMesh(node, buffer);
                        break;
                    case 6:
                        this.renderNormalBitmap(node, buffer);
                        break;
                }
            };
            WebGLRenderer.prototype.renderNormalBitmap = function (node, buffer) {
                var image = node.image;
                if (!image) {
                    return;
                }
                buffer.context.drawImage(image, node.sourceX, node.sourceY, node.sourceW, node.sourceH, node.drawX, node.drawY, node.drawW, node.drawH, node.imageWidth, node.imageHeight, node.rotated, node.smoothing);
            };
            WebGLRenderer.prototype.renderBitmap = function (node, buffer) {
                var image = node.image;
                if (!image) {
                    return;
                }
                var data = node.drawData;
                var length = data.length;
                var pos = 0;
                var m = node.matrix;
                var blendMode = node.blendMode;
                var alpha = node.alpha;
                var savedMatrix;
                var offsetX;
                var offsetY;
                if (m) {
                    savedMatrix = egret.Matrix.create();
                    var curMatrix = buffer.globalMatrix;
                    savedMatrix.a = curMatrix.a;
                    savedMatrix.b = curMatrix.b;
                    savedMatrix.c = curMatrix.c;
                    savedMatrix.d = curMatrix.d;
                    savedMatrix.tx = curMatrix.tx;
                    savedMatrix.ty = curMatrix.ty;
                    offsetX = buffer.$offsetX;
                    offsetY = buffer.$offsetY;
                    buffer.useOffset();
                    buffer.transform(m.a, m.b, m.c, m.d, m.tx, m.ty);
                }
                if (blendMode) {
                    buffer.context.setGlobalCompositeOperation(blendModes[blendMode]);
                }
                var originAlpha;
                if (alpha == alpha) {
                    originAlpha = buffer.globalAlpha;
                    buffer.globalAlpha *= alpha;
                }
                if (node.filter) {
                    buffer.context.$filter = node.filter;
                    while (pos < length) {
                        buffer.context.drawImage(image, data[pos++], data[pos++], data[pos++], data[pos++], data[pos++], data[pos++], data[pos++], data[pos++], node.imageWidth, node.imageHeight, node.rotated, node.smoothing);
                    }
                    buffer.context.$filter = null;
                }
                else {
                    while (pos < length) {
                        buffer.context.drawImage(image, data[pos++], data[pos++], data[pos++], data[pos++], data[pos++], data[pos++], data[pos++], data[pos++], node.imageWidth, node.imageHeight, node.rotated, node.smoothing);
                    }
                }
                if (blendMode) {
                    buffer.context.setGlobalCompositeOperation(defaultCompositeOp);
                }
                if (alpha == alpha) {
                    buffer.globalAlpha = originAlpha;
                }
                if (m) {
                    var matrix = buffer.globalMatrix;
                    matrix.a = savedMatrix.a;
                    matrix.b = savedMatrix.b;
                    matrix.c = savedMatrix.c;
                    matrix.d = savedMatrix.d;
                    matrix.tx = savedMatrix.tx;
                    matrix.ty = savedMatrix.ty;
                    buffer.$offsetX = offsetX;
                    buffer.$offsetY = offsetY;
                    egret.Matrix.release(savedMatrix);
                }
            };
            WebGLRenderer.prototype.renderMesh = function (node, buffer) {
                var image = node.image;
                var data = node.drawData;
                var length = data.length;
                var pos = 0;
                var m = node.matrix;
                var blendMode = node.blendMode;
                var alpha = node.alpha;
                var savedMatrix;
                var offsetX;
                var offsetY;
                if (m) {
                    savedMatrix = egret.Matrix.create();
                    var curMatrix = buffer.globalMatrix;
                    savedMatrix.a = curMatrix.a;
                    savedMatrix.b = curMatrix.b;
                    savedMatrix.c = curMatrix.c;
                    savedMatrix.d = curMatrix.d;
                    savedMatrix.tx = curMatrix.tx;
                    savedMatrix.ty = curMatrix.ty;
                    offsetX = buffer.$offsetX;
                    offsetY = buffer.$offsetY;
                    buffer.useOffset();
                    buffer.transform(m.a, m.b, m.c, m.d, m.tx, m.ty);
                }
                if (blendMode) {
                    buffer.context.setGlobalCompositeOperation(blendModes[blendMode]);
                }
                var originAlpha;
                if (alpha == alpha) {
                    originAlpha = buffer.globalAlpha;
                    buffer.globalAlpha *= alpha;
                }
                if (node.filter) {
                    buffer.context.$filter = node.filter;
                    while (pos < length) {
                        buffer.context.drawMesh(image, data[pos++], data[pos++], data[pos++], data[pos++], data[pos++], data[pos++], data[pos++], data[pos++], node.imageWidth, node.imageHeight, node.uvs, node.vertices, node.indices, node.bounds, node.rotated, node.smoothing);
                    }
                    buffer.context.$filter = null;
                }
                else {
                    while (pos < length) {
                        buffer.context.drawMesh(image, data[pos++], data[pos++], data[pos++], data[pos++], data[pos++], data[pos++], data[pos++], data[pos++], node.imageWidth, node.imageHeight, node.uvs, node.vertices, node.indices, node.bounds, node.rotated, node.smoothing);
                    }
                }
                if (blendMode) {
                    buffer.context.setGlobalCompositeOperation(defaultCompositeOp);
                }
                if (alpha == alpha) {
                    buffer.globalAlpha = originAlpha;
                }
                if (m) {
                    var matrix = buffer.globalMatrix;
                    matrix.a = savedMatrix.a;
                    matrix.b = savedMatrix.b;
                    matrix.c = savedMatrix.c;
                    matrix.d = savedMatrix.d;
                    matrix.tx = savedMatrix.tx;
                    matrix.ty = savedMatrix.ty;
                    buffer.$offsetX = offsetX;
                    buffer.$offsetY = offsetY;
                    egret.Matrix.release(savedMatrix);
                }
            };
            WebGLRenderer.prototype.___renderText____ = function (node, buffer) {
                var width = node.width - node.x;
                var height = node.height - node.y;
                if (width <= 0 || height <= 0 || !width || !height || node.drawData.length === 0) {
                    return;
                }
                var canvasScaleX = egret.sys.DisplayList.$canvasScaleX;
                var canvasScaleY = egret.sys.DisplayList.$canvasScaleY;
                var maxTextureSize = buffer.context.$maxTextureSize;
                if (width * canvasScaleX > maxTextureSize) {
                    canvasScaleX *= maxTextureSize / (width * canvasScaleX);
                }
                if (height * canvasScaleY > maxTextureSize) {
                    canvasScaleY *= maxTextureSize / (height * canvasScaleY);
                }
                width *= canvasScaleX;
                height *= canvasScaleY;
                var x = node.x * canvasScaleX;
                var y = node.y * canvasScaleY;
                if (node.$canvasScaleX !== canvasScaleX || node.$canvasScaleY !== canvasScaleY) {
                    node.$canvasScaleX = canvasScaleX;
                    node.$canvasScaleY = canvasScaleY;
                    node.dirtyRender = true;
                }
                if (x || y) {
                    buffer.transform(1, 0, 0, 1, x / canvasScaleX, y / canvasScaleY);
                }
                if (node.dirtyRender) {
                    web.TextAtlasRender.analysisTextNodeAndFlushDrawLabel(node);
                }
                var drawCommands = node[web.property_drawLabel];
                if (drawCommands && drawCommands.length > 0) {
                    var saveOffsetX = buffer.$offsetX;
                    var saveOffsetY = buffer.$offsetY;
                    var cmd = null;
                    var anchorX = 0;
                    var anchorY = 0;
                    var textBlocks = null;
                    var tb = null;
                    var page = null;
                    for (var i = 0, length_22 = drawCommands.length; i < length_22; ++i) {
                        cmd = drawCommands[i];
                        anchorX = cmd.anchorX;
                        anchorY = cmd.anchorY;
                        textBlocks = cmd.textBlocks;
                        buffer.$offsetX = saveOffsetX + anchorX;
                        for (var j = 0, length1 = textBlocks.length; j < length1; ++j) {
                            tb = textBlocks[j];
                            if (j > 0) {
                                buffer.$offsetX -= tb.canvasWidthOffset;
                            }
                            buffer.$offsetY = saveOffsetY + anchorY - (tb.measureHeight + (tb.stroke2 ? tb.canvasHeightOffset : 0)) / 2;
                            page = tb.line.page;
                            buffer.context.drawTexture(page.webGLTexture, tb.u, tb.v, tb.contentWidth, tb.contentHeight, 0, 0, tb.contentWidth, tb.contentHeight, page.pageWidth, page.pageHeight);
                            buffer.$offsetX += (tb.contentWidth - tb.canvasWidthOffset);
                        }
                    }
                    buffer.$offsetX = saveOffsetX;
                    buffer.$offsetY = saveOffsetY;
                }
                if (x || y) {
                    buffer.transform(1, 0, 0, 1, -x / canvasScaleX, -y / canvasScaleY);
                }
                node.dirtyRender = false;
            };
            WebGLRenderer.prototype.renderText = function (node, buffer) {
                if (web.textAtlasRenderEnable) {
                    this.___renderText____(node, buffer);
                    return;
                }
                var width = node.width - node.x;
                var height = node.height - node.y;
                if (width <= 0 || height <= 0 || !width || !height || node.drawData.length == 0) {
                    return;
                }
                var canvasScaleX = egret.sys.DisplayList.$canvasScaleX;
                var canvasScaleY = egret.sys.DisplayList.$canvasScaleY;
                var maxTextureSize = buffer.context.$maxTextureSize;
                if (width * canvasScaleX > maxTextureSize) {
                    canvasScaleX *= maxTextureSize / (width * canvasScaleX);
                }
                if (height * canvasScaleY > maxTextureSize) {
                    canvasScaleY *= maxTextureSize / (height * canvasScaleY);
                }
                width *= canvasScaleX;
                height *= canvasScaleY;
                var x = node.x * canvasScaleX;
                var y = node.y * canvasScaleY;
                if (node.$canvasScaleX != canvasScaleX || node.$canvasScaleY != canvasScaleY) {
                    node.$canvasScaleX = canvasScaleX;
                    node.$canvasScaleY = canvasScaleY;
                    node.dirtyRender = true;
                }
                if (this.wxiOS10) {
                    if (!this.canvasRenderer) {
                        this.canvasRenderer = new egret.CanvasRenderer();
                    }
                    if (node.dirtyRender) {
                        this.canvasRenderBuffer = new web.CanvasRenderBuffer(width, height);
                    }
                }
                else {
                    if (!this.canvasRenderBuffer || !this.canvasRenderBuffer.context) {
                        this.canvasRenderer = new egret.CanvasRenderer();
                        this.canvasRenderBuffer = new web.CanvasRenderBuffer(width, height);
                    }
                    else if (node.dirtyRender) {
                        this.canvasRenderBuffer.resize(width, height);
                    }
                }
                if (!this.canvasRenderBuffer.context) {
                    return;
                }
                if (canvasScaleX != 1 || canvasScaleY != 1) {
                    this.canvasRenderBuffer.context.setTransform(canvasScaleX, 0, 0, canvasScaleY, 0, 0);
                }
                if (x || y) {
                    if (node.dirtyRender) {
                        this.canvasRenderBuffer.context.setTransform(canvasScaleX, 0, 0, canvasScaleY, -x, -y);
                    }
                    buffer.transform(1, 0, 0, 1, x / canvasScaleX, y / canvasScaleY);
                }
                else if (canvasScaleX != 1 || canvasScaleY != 1) {
                    this.canvasRenderBuffer.context.setTransform(canvasScaleX, 0, 0, canvasScaleY, 0, 0);
                }
                if (node.dirtyRender) {
                    var surface = this.canvasRenderBuffer.surface;
                    this.canvasRenderer.renderText(node, this.canvasRenderBuffer.context);
                    if (this.wxiOS10) {
                        surface["isCanvas"] = true;
                        node.$texture = surface;
                    }
                    else {
                        var texture = node.$texture;
                        if (!texture) {
                            texture = buffer.context.createTexture(surface);
                            node.$texture = texture;
                        }
                        else {
                            buffer.context.updateTexture(texture, surface);
                        }
                    }
                    node.$textureWidth = surface.width;
                    node.$textureHeight = surface.height;
                }
                var textureWidth = node.$textureWidth;
                var textureHeight = node.$textureHeight;
                buffer.context.drawTexture(node.$texture, 0, 0, textureWidth, textureHeight, 0, 0, textureWidth / canvasScaleX, textureHeight / canvasScaleY, textureWidth, textureHeight);
                if (x || y) {
                    if (node.dirtyRender) {
                        this.canvasRenderBuffer.context.setTransform(canvasScaleX, 0, 0, canvasScaleY, 0, 0);
                    }
                    buffer.transform(1, 0, 0, 1, -x / canvasScaleX, -y / canvasScaleY);
                }
                node.dirtyRender = false;
            };
            WebGLRenderer.prototype.renderGraphics = function (node, buffer, forHitTest) {
                var width = node.width;
                var height = node.height;
                if (width <= 0 || height <= 0 || !width || !height || node.drawData.length == 0) {
                    return;
                }
                var canvasScaleX = egret.sys.DisplayList.$canvasScaleX;
                var canvasScaleY = egret.sys.DisplayList.$canvasScaleY;
                if (width * canvasScaleX < 1 || height * canvasScaleY < 1) {
                    canvasScaleX = canvasScaleY = 1;
                }
                if (node.$canvasScaleX != canvasScaleX || node.$canvasScaleY != canvasScaleY) {
                    node.$canvasScaleX = canvasScaleX;
                    node.$canvasScaleY = canvasScaleY;
                    node.dirtyRender = true;
                }
                width = width * canvasScaleX;
                height = height * canvasScaleY;
                var width2 = Math.ceil(width);
                var height2 = Math.ceil(height);
                canvasScaleX *= width2 / width;
                canvasScaleY *= height2 / height;
                width = width2;
                height = height2;
                if (this.wxiOS10) {
                    if (!this.canvasRenderer) {
                        this.canvasRenderer = new egret.CanvasRenderer();
                    }
                    if (node.dirtyRender) {
                        this.canvasRenderBuffer = new web.CanvasRenderBuffer(width, height);
                    }
                }
                else {
                    if (!this.canvasRenderBuffer || !this.canvasRenderBuffer.context) {
                        this.canvasRenderer = new egret.CanvasRenderer();
                        this.canvasRenderBuffer = new web.CanvasRenderBuffer(width, height);
                    }
                    else if (node.dirtyRender) {
                        this.canvasRenderBuffer.resize(width, height);
                    }
                }
                if (!this.canvasRenderBuffer.context) {
                    return;
                }
                if (canvasScaleX != 1 || canvasScaleY != 1) {
                    this.canvasRenderBuffer.context.setTransform(canvasScaleX, 0, 0, canvasScaleY, 0, 0);
                }
                if (node.x || node.y) {
                    if (node.dirtyRender || forHitTest) {
                        this.canvasRenderBuffer.context.translate(-node.x, -node.y);
                    }
                    buffer.transform(1, 0, 0, 1, node.x, node.y);
                }
                var surface = this.canvasRenderBuffer.surface;
                if (forHitTest) {
                    this.canvasRenderer.renderGraphics(node, this.canvasRenderBuffer.context, true);
                    var texture = void 0;
                    if (this.wxiOS10) {
                        surface["isCanvas"] = true;
                        texture = surface;
                    }
                    else {
                        egret.WebGLUtils.deleteWebGLTexture(surface);
                        texture = buffer.context.getWebGLTexture(surface);
                    }
                    buffer.context.drawTexture(texture, 0, 0, width, height, 0, 0, width, height, surface.width, surface.height);
                }
                else {
                    if (node.dirtyRender) {
                        this.canvasRenderer.renderGraphics(node, this.canvasRenderBuffer.context);
                        if (this.wxiOS10) {
                            surface["isCanvas"] = true;
                            node.$texture = surface;
                        }
                        else {
                            var texture = node.$texture;
                            if (!texture) {
                                texture = buffer.context.createTexture(surface);
                                node.$texture = texture;
                            }
                            else {
                                buffer.context.updateTexture(texture, surface);
                            }
                        }
                        node.$textureWidth = surface.width;
                        node.$textureHeight = surface.height;
                    }
                    var textureWidth = node.$textureWidth;
                    var textureHeight = node.$textureHeight;
                    buffer.context.drawTexture(node.$texture, 0, 0, textureWidth, textureHeight, 0, 0, textureWidth / canvasScaleX, textureHeight / canvasScaleY, textureWidth, textureHeight);
                }
                if (node.x || node.y) {
                    if (node.dirtyRender || forHitTest) {
                        this.canvasRenderBuffer.context.translate(node.x, node.y);
                    }
                    buffer.transform(1, 0, 0, 1, -node.x, -node.y);
                }
                if (!forHitTest) {
                    node.dirtyRender = false;
                }
            };
            WebGLRenderer.prototype.renderGroup = function (groupNode, buffer) {
                var m = groupNode.matrix;
                var savedMatrix;
                var offsetX;
                var offsetY;
                if (m) {
                    savedMatrix = egret.Matrix.create();
                    var curMatrix = buffer.globalMatrix;
                    savedMatrix.a = curMatrix.a;
                    savedMatrix.b = curMatrix.b;
                    savedMatrix.c = curMatrix.c;
                    savedMatrix.d = curMatrix.d;
                    savedMatrix.tx = curMatrix.tx;
                    savedMatrix.ty = curMatrix.ty;
                    offsetX = buffer.$offsetX;
                    offsetY = buffer.$offsetY;
                    buffer.useOffset();
                    buffer.transform(m.a, m.b, m.c, m.d, m.tx, m.ty);
                }
                var children = groupNode.drawData;
                var length = children.length;
                for (var i = 0; i < length; i++) {
                    var node = children[i];
                    this.renderNode(node, buffer, buffer.$offsetX, buffer.$offsetY);
                }
                if (m) {
                    var matrix = buffer.globalMatrix;
                    matrix.a = savedMatrix.a;
                    matrix.b = savedMatrix.b;
                    matrix.c = savedMatrix.c;
                    matrix.d = savedMatrix.d;
                    matrix.tx = savedMatrix.tx;
                    matrix.ty = savedMatrix.ty;
                    buffer.$offsetX = offsetX;
                    buffer.$offsetY = offsetY;
                    egret.Matrix.release(savedMatrix);
                }
            };
            WebGLRenderer.prototype.createRenderBuffer = function (width, height) {
                var buffer = renderBufferPool.pop();
                if (buffer) {
                    buffer.resize(width, height);
                }
                else {
                    buffer = new web.WebGLRenderBuffer(width, height);
                    buffer.$computeDrawCall = false;
                }
                return buffer;
            };
            return WebGLRenderer;
        }());
        web.WebGLRenderer = WebGLRenderer;
    })(web = egret.web || (egret.web = {}));
})(egret || (egret = {}));
var egret;
(function (egret) {
    var web;
    (function (web) {
        var WebGLVertexArrayObject = (function () {
            function WebGLVertexArrayObject() {
                this.vertSize = 5;
                this.vertByteSize = this.vertSize * 4;
                this.maxQuadsCount = 2048;
                this.maxVertexCount = this.maxQuadsCount * 4;
                this.maxIndicesCount = this.maxQuadsCount * 6;
                this.vertices = null;
                this.indices = null;
                this.indicesForMesh = null;
                this.vertexIndex = 0;
                this.indexIndex = 0;
                this.hasMesh = false;
                this._vertices = null;
                this._verticesFloat32View = null;
                this._verticesUint32View = null;
                var numVerts = this.maxVertexCount * this.vertSize;
                this.vertices = new Float32Array(numVerts);
                this._vertices = new ArrayBuffer(this.maxVertexCount * this.vertByteSize);
                this._verticesFloat32View = new Float32Array(this._vertices);
                this._verticesUint32View = new Uint32Array(this._vertices);
                this.vertices = this._verticesFloat32View;
                var maxIndicesCount = this.maxIndicesCount;
                this.indices = new Uint16Array(maxIndicesCount);
                this.indicesForMesh = new Uint16Array(maxIndicesCount);
                for (var i = 0, j = 0; i < maxIndicesCount; i += 6, j += 4) {
                    this.indices[i + 0] = j + 0;
                    this.indices[i + 1] = j + 1;
                    this.indices[i + 2] = j + 2;
                    this.indices[i + 3] = j + 0;
                    this.indices[i + 4] = j + 2;
                    this.indices[i + 5] = j + 3;
                }
            }
            WebGLVertexArrayObject.prototype.reachMaxSize = function (vertexCount, indexCount) {
                if (vertexCount === void 0) { vertexCount = 4; }
                if (indexCount === void 0) { indexCount = 6; }
                return this.vertexIndex > this.maxVertexCount - vertexCount || this.indexIndex > this.maxIndicesCount - indexCount;
            };
            WebGLVertexArrayObject.prototype.getVertices = function () {
                var view = this.vertices.subarray(0, this.vertexIndex * this.vertSize);
                return view;
            };
            WebGLVertexArrayObject.prototype.getIndices = function () {
                return this.indices;
            };
            WebGLVertexArrayObject.prototype.getMeshIndices = function () {
                return this.indicesForMesh;
            };
            WebGLVertexArrayObject.prototype.changeToMeshIndices = function () {
                if (!this.hasMesh) {
                    for (var i = 0, l = this.indexIndex; i < l; ++i) {
                        this.indicesForMesh[i] = this.indices[i];
                    }
                    this.hasMesh = true;
                }
            };
            WebGLVertexArrayObject.prototype.isMesh = function () {
                return this.hasMesh;
            };
            WebGLVertexArrayObject.prototype.cacheArrays = function (buffer, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight, textureSourceWidth, textureSourceHeight, meshUVs, meshVertices, meshIndices, rotated) {
                var alpha = buffer.globalAlpha;
                alpha = Math.min(alpha, 1.0);
                var globalTintColor = buffer.globalTintColor || 0xFFFFFF;
                var currentTexture = buffer.currentTexture;
                alpha = ((alpha < 1.0 && currentTexture && currentTexture[egret.UNPACK_PREMULTIPLY_ALPHA_WEBGL]) ?
                    egret.WebGLUtils.premultiplyTint(globalTintColor, alpha)
                    : globalTintColor + (alpha * 255 << 24));
                var locWorldTransform = buffer.globalMatrix;
                var a = locWorldTransform.a;
                var b = locWorldTransform.b;
                var c = locWorldTransform.c;
                var d = locWorldTransform.d;
                var tx = locWorldTransform.tx;
                var ty = locWorldTransform.ty;
                var offsetX = buffer.$offsetX;
                var offsetY = buffer.$offsetY;
                if (offsetX != 0 || offsetY != 0) {
                    tx = offsetX * a + offsetY * c + tx;
                    ty = offsetX * b + offsetY * d + ty;
                }
                if (!meshVertices) {
                    if (destX != 0 || destY != 0) {
                        tx = destX * a + destY * c + tx;
                        ty = destX * b + destY * d + ty;
                    }
                    var a1 = destWidth / sourceWidth;
                    if (a1 != 1) {
                        a = a1 * a;
                        b = a1 * b;
                    }
                    var d1 = destHeight / sourceHeight;
                    if (d1 != 1) {
                        c = d1 * c;
                        d = d1 * d;
                    }
                }
                if (meshVertices) {
                    var vertices = this.vertices;
                    var verticesUint32View = this._verticesUint32View;
                    var index = this.vertexIndex * this.vertSize;
                    var i = 0, iD = 0, l = 0;
                    var u = 0, v = 0, x = 0, y = 0;
                    for (i = 0, l = meshUVs.length; i < l; i += 2) {
                        iD = index + i * 5 / 2;
                        x = meshVertices[i];
                        y = meshVertices[i + 1];
                        u = meshUVs[i];
                        v = meshUVs[i + 1];
                        vertices[iD + 0] = a * x + c * y + tx;
                        vertices[iD + 1] = b * x + d * y + ty;
                        if (rotated) {
                            vertices[iD + 2] = (sourceX + (1.0 - v) * sourceHeight) / textureSourceWidth;
                            vertices[iD + 3] = (sourceY + u * sourceWidth) / textureSourceHeight;
                        }
                        else {
                            vertices[iD + 2] = (sourceX + u * sourceWidth) / textureSourceWidth;
                            vertices[iD + 3] = (sourceY + v * sourceHeight) / textureSourceHeight;
                        }
                        verticesUint32View[iD + 4] = alpha;
                    }
                    if (this.hasMesh) {
                        for (var i_1 = 0, l_1 = meshIndices.length; i_1 < l_1; ++i_1) {
                            this.indicesForMesh[this.indexIndex + i_1] = meshIndices[i_1] + this.vertexIndex;
                        }
                    }
                    this.vertexIndex += meshUVs.length / 2;
                    this.indexIndex += meshIndices.length;
                }
                else {
                    var width = textureSourceWidth;
                    var height = textureSourceHeight;
                    var w = sourceWidth;
                    var h = sourceHeight;
                    sourceX = sourceX / width;
                    sourceY = sourceY / height;
                    var vertices = this.vertices;
                    var verticesUint32View = this._verticesUint32View;
                    var index = this.vertexIndex * this.vertSize;
                    if (rotated) {
                        var temp = sourceWidth;
                        sourceWidth = sourceHeight / width;
                        sourceHeight = temp / height;
                        vertices[index++] = tx;
                        vertices[index++] = ty;
                        vertices[index++] = sourceWidth + sourceX;
                        vertices[index++] = sourceY;
                        verticesUint32View[index++] = alpha;
                        vertices[index++] = a * w + tx;
                        vertices[index++] = b * w + ty;
                        vertices[index++] = sourceWidth + sourceX;
                        vertices[index++] = sourceHeight + sourceY;
                        verticesUint32View[index++] = alpha;
                        vertices[index++] = a * w + c * h + tx;
                        vertices[index++] = d * h + b * w + ty;
                        vertices[index++] = sourceX;
                        vertices[index++] = sourceHeight + sourceY;
                        verticesUint32View[index++] = alpha;
                        vertices[index++] = c * h + tx;
                        vertices[index++] = d * h + ty;
                        vertices[index++] = sourceX;
                        vertices[index++] = sourceY;
                        verticesUint32View[index++] = alpha;
                    }
                    else {
                        sourceWidth = sourceWidth / width;
                        sourceHeight = sourceHeight / height;
                        vertices[index++] = tx;
                        vertices[index++] = ty;
                        vertices[index++] = sourceX;
                        vertices[index++] = sourceY;
                        verticesUint32View[index++] = alpha;
                        vertices[index++] = a * w + tx;
                        vertices[index++] = b * w + ty;
                        vertices[index++] = sourceWidth + sourceX;
                        vertices[index++] = sourceY;
                        verticesUint32View[index++] = alpha;
                        vertices[index++] = a * w + c * h + tx;
                        vertices[index++] = d * h + b * w + ty;
                        vertices[index++] = sourceWidth + sourceX;
                        vertices[index++] = sourceHeight + sourceY;
                        verticesUint32View[index++] = alpha;
                        vertices[index++] = c * h + tx;
                        vertices[index++] = d * h + ty;
                        vertices[index++] = sourceX;
                        vertices[index++] = sourceHeight + sourceY;
                        verticesUint32View[index++] = alpha;
                    }
                    if (this.hasMesh) {
                        var indicesForMesh = this.indicesForMesh;
                        indicesForMesh[this.indexIndex + 0] = 0 + this.vertexIndex;
                        indicesForMesh[this.indexIndex + 1] = 1 + this.vertexIndex;
                        indicesForMesh[this.indexIndex + 2] = 2 + this.vertexIndex;
                        indicesForMesh[this.indexIndex + 3] = 0 + this.vertexIndex;
                        indicesForMesh[this.indexIndex + 4] = 2 + this.vertexIndex;
                        indicesForMesh[this.indexIndex + 5] = 3 + this.vertexIndex;
                    }
                    this.vertexIndex += 4;
                    this.indexIndex += 6;
                }
            };
            WebGLVertexArrayObject.prototype.clear = function () {
                this.hasMesh = false;
                this.vertexIndex = 0;
                this.indexIndex = 0;
            };
            return WebGLVertexArrayObject;
        }());
        web.WebGLVertexArrayObject = WebGLVertexArrayObject;
    })(web = egret.web || (egret.web = {}));
})(egret || (egret = {}));
