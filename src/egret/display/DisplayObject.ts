//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////

/// <reference path="../events/EventDispatcher.ts" />

namespace egret
{
    /**
     * @private
     */
    export const enum RenderMode
    {
        NONE = 1,
        FILTER = 2,
        CLIP = 3,
        SCROLLRECT = 4
    };

    /**
     * @private
     * Format the rotation angle value.
     */
    function clampRotation(value): number {
        value %= 360;
        if (value > 180) {
            value -= 360;
        } else if (value < -180) {
            value += 360;
        }
        return value;
    }

    /**
     * The DisplayObject class is the base class for all objects that can be placed on the display list.
     * The display list manages all objects displayed in the runtime. Use the DisplayObjectContainer class to arrange the display
     * objects in the display list. DisplayObjectContainer objects can have child display objects, while other display objects,
     * such as Shape and TextField objects, are "leaf" nodes that have only parents and siblings, no children.
     * The DisplayObject class supports basic functionality like the x and y position of an object, as well as more advanced
     * properties of the object such as its transformation matrix.
     * The DisplayObject class contains several broadcast events.Normally, the target of any particular event is a specific
     * DisplayObject instance. For example, the target of an added event is the specific DisplayObject instance that was added
     * to the display list. Having a single target restricts the placement of event listeners to that target and in some cases
     * the target's ancestors on the display list. With broadcast events, however, the target is not a specific DisplayObject
     * instance, but rather all DisplayObject instances, including those that are not on the display list. This means that you
     * can add a listener to any DisplayObject instance to listen for broadcast events.
     *
     * @event egret.Event.ADDED Dispatched when a display object is added to the display list.
     * @event egret.Event.ADDED_TO_STAGE Dispatched when a display object is added to the on stage display list, either directly or through the addition of a sub tree in which the display object is contained.
     * @event egret.Event.REMOVED Dispatched when a display object is about to be removed from the display list.
     * @event egret.Event.REMOVED_FROM_STAGE Dispatched when a display object is about to be removed from the display list, either directly or through the removal of a sub tree in which the display object is contained.
     * @event egret.Event.ENTER_FRAME [broadcast event] Dispatched when the playhead is entering a new frame.
     * @event egret.Event.RENDER [broadcast event] Dispatched when the display list is about to be updated and rendered.
     * @event egret.TouchEvent.TOUCH_MOVE Dispatched when the user touches the device, and is continuously dispatched until the point of contact is removed.
     * @event egret.TouchEvent.TOUCH_BEGIN Dispatched when the user first contacts a touch-enabled device (such as touches a finger to a mobile phone or tablet with a touch screen).
     * @event egret.TouchEvent.TOUCH_END Dispatched when the user removes contact with a touch-enabled device (such as lifts a finger off a mobile phone or tablet with a touch screen).
     * @event egret.TouchEvent.TOUCH_TAP Dispatched when the user lifts the point of contact over the same DisplayObject instance on which the contact was initiated on a touch-enabled device (such as presses and releases a finger from a single point over a display object on a mobile phone or tablet with a touch screen).
     * @event egret.TouchEvent.TOUCH_RELEASE_OUTSIDE Dispatched when the user lifts the point of contact over the different DisplayObject instance on which the contact was initiated on a touch-enabled device (such as presses and releases a finger from a single point over a display object on a mobile phone or tablet with a touch screen).
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/display/DisplayObject.ts
     */
    export class DisplayObject extends EventDispatcher
    {
        /**
         * Initializes a DisplayObject object.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public constructor() {
            super();

            if (egret.nativeRender) {
                this.createNativeDisplayObject();
            }

            // The default is pure white.
            this.tint = 0xFFFFFF;
        }

        $nativeDisplayObject: egret_native.NativeDisplayObject;

        protected createNativeDisplayObject(): void {
            this.$nativeDisplayObject = new egret_native.NativeDisplayObject(egret_native.NativeObjectType.CONTAINER);
        }

        /**
         * @private
         * Whether to add to the stage to prevent repeated sending of removed_from_stage message.
         */
        $hasAddToStage: boolean;

        /**
         * @private
         * Classes that can contain children store the child list in this attribute.
         */
        $children: DisplayObject[] = null;

        private $name: string = "";

        /**
         * Indicates the instance name of the DisplayObject.
         * The object can be identified in the child list of its parent display object container by calling the getChildByName()
         * method of the display object container.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public get name(): string {
            return this.$name;
        }

        public set name(value: string) {
            this.$name = value;
        }

        /**
         * @private
         */
        $parent: DisplayObjectContainer = null;

        /**
         * Indicates the DisplayObjectContainer object that contains this display object.
         * Use the parent property to specify a relative path to display objects that are above the
         * current display object in the display list hierarchy.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public get parent(): DisplayObjectContainer {
            return this.$parent;
        }

        /**
         * @private
         * Set parent display object.
         */
        $setParent(parent: DisplayObjectContainer): void {
            this.$parent = parent;
        }

        /**
         * @private
         * Add display objects to the stage.
         */
        $onAddToStage(stage: Stage, nestLevel: number): void {
            let self = this;
            self.$stage = stage;
            self.$nestLevel = nestLevel;
            self.$hasAddToStage = true;
            Sprite.$EVENT_ADD_TO_STAGE_LIST.push(self);
        }

        /**
         * @private
         * Remove the display object from the stage.
         */
        $onRemoveFromStage(): void {
            let self = this;
            self.$nestLevel = 0;
            Sprite.$EVENT_REMOVE_FROM_STAGE_LIST.push(self);
        }

        /**
         * @private
         */
        $stage: Stage = null;

        /**
         * @private
         * The nesting depth of this object in the display list, stage is 1, its children are 2, children of children are 3, and so on.
         * This property value is 0 when the object is not in the display list.
         */
        $nestLevel: number = 0;

        $useTranslate: boolean = false;

        protected $updateUseTransform(): void {
            let self = this;
            if (self.$scaleX == 1 && self.$scaleY == 1 && self.$skewX == 0 && self.$skewY == 0) {
                self.$useTranslate = false;
            }
            else {
                self.$useTranslate = true;
            }
        }

        /**
         * The Stage of the display object. you can create and load multiple display objects into the display list, and
         * the stage property of each display object refers to the same Stage object.
         * If a display object is not added to the display list, its stage property is set to null.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public get stage(): Stage {
            return this.$stage;
        }

        /**
         * A Matrix object containing values that alter the scaling, rotation, and translation of the display object.
         * Note: to change the value of a display object's matrix, you must make a copy of the entire matrix object, then copy
         * the new object into the matrix property of the display object.
         * 
         * The following code increases the tx value of a display object's matrix:
         * @example 
         *     let myMatrix:Matrix = myDisplayObject.matrix;
         *     myMatrix.tx += 10;
         *     myDisplayObject.matrix = myMatrix;
         * @version Egret 2.4
         * @platform Web,Native
         */
        public get matrix(): Matrix {
            return this.$getMatrix().clone();
        }

        private $matrix: egret.Matrix = new egret.Matrix();

        private $matrixDirty: boolean = false;

        /**
         * @private
         * Get matrix.
         */
        $getMatrix(): Matrix {
            let self = this;
            if (self.$matrixDirty) {
                self.$matrixDirty = false;
                self.$matrix.$updateScaleAndRotation(self.$scaleX, self.$scaleY, self.$skewX, self.$skewY);
            }
            self.$matrix.tx = self.$x;
            self.$matrix.ty = self.$y;
            return self.$matrix;
        }

        public set matrix(value: Matrix) {
            this.$setMatrix(value);
        }

        /**
         * @private
         * Set matrix.
         */
        $setMatrix(matrix: Matrix, needUpdateProperties: boolean = true): void {
            let self = this;
            let m = self.$matrix;
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
        }

        private $concatenatedMatrix: egret.Matrix;

        /**
         * @private
         * Get the connection matrix of this display object and all its parent objects.
         */
        $getConcatenatedMatrix(): Matrix {
            let self = this;
            let matrix = self.$concatenatedMatrix;
            if (!matrix) {
                matrix = self.$concatenatedMatrix = new egret.Matrix();
            }
            if (self.$parent) {
                self.$parent.$getConcatenatedMatrix().$preMultiplyInto(self.$getMatrix(),
                    matrix);
            } else {
                matrix.copyFrom(self.$getMatrix());
            }

            let offsetX = self.$anchorOffsetX;
            let offsetY = self.$anchorOffsetY;
            let rect = self.$scrollRect;
            if (rect) {
                matrix.$preMultiplyInto($TempMatrix.setTo(1, 0, 0, 1, -rect.x - offsetX, -rect.y - offsetY), matrix);
            }
            else if (offsetX != 0 || offsetY != 0) {
                matrix.$preMultiplyInto($TempMatrix.setTo(1, 0, 0, 1, -offsetX, -offsetY), matrix);
            }
            return self.$concatenatedMatrix;
        }

        private $invertedConcatenatedMatrix: egret.Matrix;

        /**
         * @private
         * Get link matrix.
         */
        $getInvertedConcatenatedMatrix(): Matrix {
            let self = this;
            if (!self.$invertedConcatenatedMatrix) {
                self.$invertedConcatenatedMatrix = new egret.Matrix();
            }
            self.$getConcatenatedMatrix().$invertInto(self.$invertedConcatenatedMatrix);
            return self.$invertedConcatenatedMatrix;
        }

        $x: number = 0;

        /**
         * Indicates the x coordinate of the DisplayObject instance relative to the local coordinates of the parent
         * DisplayObjectContainer.
         * If the object is inside a DisplayObjectContainer that has transformations, it is in
         * the local coordinate system of the enclosing DisplayObjectContainer. Thus, for a DisplayObjectContainer
         * rotated 90° counterclockwise, the DisplayObjectContainer's children inherit a coordinate system that is
         * rotated 90° counterclockwise. The object's coordinates refer to the registration point position.
         * @default 0
         * @version Egret 2.4
         * @platform Web,Native
         */
        public get x(): number {
            return this.$getX();
        }

        /**
         * @private
         * Get x coordinate.
         */
        $getX(): number {
            return this.$x;
        }

        public set x(value: number) {
            this.$setX(value);
        }

        /**
         * @private
         * Set x coordinate.
         */
        $setX(value: number): boolean {
            let self = this;
            if (self.$x == value) {
                return false;
            }
            self.$x = value;
            if (egret.nativeRender) {
                self.$nativeDisplayObject.setX(value);
            }
            else {
                let p = self.$parent;
                if (p && !p.$cacheDirty) {
                    p.$cacheDirty = true;
                    p.$cacheDirtyUp();
                }
                let maskedObject = self.$maskedObject;
                if (maskedObject && !maskedObject.$cacheDirty) {
                    maskedObject.$cacheDirty = true;
                    maskedObject.$cacheDirtyUp();
                }
            }
            return true;
        }

        $y: number = 0;

        /**
         * Indicates the y coordinate of the DisplayObject instance relative to the local coordinates of the parent
         * DisplayObjectContainer.
         * If the object is inside a DisplayObjectContainer that has transformations, it is in
         * the local coordinate system of the enclosing DisplayObjectContainer. Thus, for a DisplayObjectContainer rotated
         * 90° counterclockwise, the DisplayObjectContainer's children inherit a coordinate system that is rotated 90°
         * counterclockwise. The object's coordinates refer to the registration point position.
         * @default 0
         * @version Egret 2.4
         * @platform Web,Native
         */
        public get y(): number {
            return this.$getY();
        }

        /**
         * @private
         * Get y coordinate.
         */
        $getY(): number {
            return this.$y;
        }

        public set y(value: number) {
            this.$setY(value);
        }

        /**
         * @private
         * Set y coordinate.
         */
        $setY(value: number): boolean {
            let self = this;
            if (self.$y == value) {
                return false;
            }
            self.$y = value;
            if (egret.nativeRender) {
                self.$nativeDisplayObject.setY(value);
            }
            else {
                let p = self.$parent;
                if (p && !p.$cacheDirty) {
                    p.$cacheDirty = true;
                    p.$cacheDirtyUp();
                }
                let maskedObject = self.$maskedObject;
                if (maskedObject && !maskedObject.$cacheDirty) {
                    maskedObject.$cacheDirty = true;
                    maskedObject.$cacheDirtyUp();
                }
            }
            return true;
        }

        private $scaleX: number = 1;

        /**
         * Indicates the horizontal scale (percentage) of the object as applied from the registration point.
         * The default 1.0 equals 100% scale.
         * @default 1
         * @version Egret 2.4
         * @platform Web,Native
         */
        public get scaleX(): number {
            return this.$getScaleX();
        }

        public set scaleX(value: number) {
            this.$setScaleX(value);
        }

        /**
         * @private
         * @returns
         */
        $getScaleX(): number {
            return this.$scaleX;
        }

        /**
         * @private
         * Set horizontal zoom value.
         */
        $setScaleX(value: number): void {
            let self = this;
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
                let p = self.$parent;
                if (p && !p.$cacheDirty) {
                    p.$cacheDirty = true;
                    p.$cacheDirtyUp();
                }
                let maskedObject = self.$maskedObject;
                if (maskedObject && !maskedObject.$cacheDirty) {
                    maskedObject.$cacheDirty = true;
                    maskedObject.$cacheDirtyUp();
                }
            }
        }

        private $scaleY: number = 1;

        /**
         * Indicates the vertical scale (percentage) of an object as applied from the registration point of the object.
         * 1.0 is 100% scale.
         * @default 1
         * @version Egret 2.4
         * @platform Web,Native
         */
        public get scaleY(): number {
            return this.$getScaleY();
        }

        public set scaleY(value: number) {
            this.$setScaleY(value);
        }

        /**
         * @private
         * @returns
         */
        $getScaleY(): number {
            return this.$scaleY;
        }

        /**
         * @private
         * Set vertical zoom value.
         */
        $setScaleY(value: number): void {
            let self = this;
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
                let p = self.$parent;
                if (p && !p.$cacheDirty) {
                    p.$cacheDirty = true;
                    p.$cacheDirtyUp();
                }
                let maskedObject = self.$maskedObject;
                if (maskedObject && !maskedObject.$cacheDirty) {
                    maskedObject.$cacheDirty = true;
                    maskedObject.$cacheDirtyUp();
                }
            }
        }

        private $rotation: number = 0;

        /**
         * Indicates the rotation of the DisplayObject instance, in degrees, from its original orientation. Values from
         * 0 to 180 represent clockwise rotation; values from 0 to -180 represent counterclockwise rotation. Values outside
         * this range are added to or subtracted from 360 to obtain a value within the range. For example, the statement
         * myDisplayObject.rotation = 450 is the same as myDisplayObject.rotation = 90.
         * @default 0
         * @version Egret 2.4
         * @platform Web,Native
         */
        public get rotation(): number {
            return this.$getRotation();
        }

        /**
         * @private
         */
        $getRotation(): number {
            return this.$rotation;
        }

        public set rotation(value: number) {
            this.$setRotation(value);
        }

        $setRotation(value: number): void {
            value = clampRotation(value);
            let self = this;
            if (value == self.$rotation) {
                return;
            }
            let delta = value - self.$rotation;
            let angle = delta / 180 * Math.PI;
            self.$skewX += angle;
            self.$skewY += angle;
            self.$rotation = value;
            self.$matrixDirty = true;

            self.$updateUseTransform();
            if (egret.nativeRender) {
                self.$nativeDisplayObject.setRotation(value);
            }
            else {
                let p = self.$parent;
                if (p && !p.$cacheDirty) {
                    p.$cacheDirty = true;
                    p.$cacheDirtyUp();
                }
                let maskedObject = self.$maskedObject;
                if (maskedObject && !maskedObject.$cacheDirty) {
                    maskedObject.$cacheDirty = true;
                    maskedObject.$cacheDirtyUp();
                }
            }
        }

        private $skewX: number = 0;
        private $skewXdeg: number = 0;

        /**
         * Indicates the x-direction bevel of DisplayObject.
         * @member {number} egret.DisplayObject#skewX
         * @default 0
         * @version Egret 2.4
         * @platform Web,Native
         */
        public get skewX(): number {
            return this.$skewXdeg;
        }

        public set skewX(value: number) {
            this.$setSkewX(value);
        }

        /**
         * @private
         * @param value
         */
        $setSkewX(value: number): void {
            let self = this;
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
                let p = self.$parent;
                if (p && !p.$cacheDirty) {
                    p.$cacheDirty = true;
                    p.$cacheDirtyUp();
                }
                let maskedObject = self.$maskedObject;
                if (maskedObject && !maskedObject.$cacheDirty) {
                    maskedObject.$cacheDirty = true;
                    maskedObject.$cacheDirtyUp();
                }
            }
        }

        private $skewY: number = 0;
        private $skewYdeg: number = 0;

        /**
         * Represents the DisplayObject in the y direction.
         * @member {number} egret.DisplayObject#skewY
         * @default 0
         * @version Egret 2.4
         * @platform Web,Native
         */
        public get skewY(): number {
            return this.$skewYdeg;
        }

        public set skewY(value: number) {
            this.$setSkewY(value);
        }

        /**
         * @private
         * @param value
         */
        $setSkewY(value: number): void {
            let self = this;
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
                let p = self.$parent;
                if (p && !p.$cacheDirty) {
                    p.$cacheDirty = true;
                    p.$cacheDirtyUp();
                }
                let maskedObject = self.$maskedObject;
                if (maskedObject && !maskedObject.$cacheDirty) {
                    maskedObject.$cacheDirty = true;
                    maskedObject.$cacheDirtyUp();
                }
            }
        }

        /**
         * Indicates the width of the display object, in pixels.
         * The width is calculated based on the bounds of the content
         * of the display object.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public get width(): number {
            return this.$getWidth();
        }

        /**
         * @private
         * Get display width.
         */
        $getWidth(): number {
            let self = this;
            return isNaN(self.$explicitWidth) ? self.$getOriginalBounds().width : self.$explicitWidth;
        }

        $explicitWidth: number = NaN;

        public set width(value: number) {
            this.$setWidth(value);
        }

        /**
         * @private
         * Set display width.
         */
        $setWidth(value: number): void {
            value = isNaN(value) ? NaN : value;
            if (this.$explicitWidth == value) {
                return;
            }
            this.$explicitWidth = value;
        }

        /**
         * Indicates the height of the display object, in pixels.
         * The height is calculated based on the bounds of the
         * content of the display object.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public get height(): number {
            return this.$getHeight();
        }

        $explicitHeight: number = NaN;

        /**
         * @private
         * Get display height.
         */
        $getHeight(): number {
            let self = this;
            return isNaN(self.$explicitHeight) ? self.$getOriginalBounds().height : self.$explicitHeight;
        }

        public set height(value: number) {
            this.$setHeight(value);
        }

        /**
         * @private
         * Set display height.
         */
        $setHeight(value: number): void {
            value = isNaN(value) ? NaN : value;
            if (this.$explicitHeight == value) {
                return;
            }
            this.$explicitHeight = value;
        }


        /**
         * Measuring width.
         * @returns {number}
         * @member {egret.Rectangle} egret.DisplayObject#measuredWidth
         * @version Egret 2.4
         * @platform Web,Native
         */
        public get measuredWidth(): number {
            return this.$getOriginalBounds().width;
        }

        /**
         * Measuring height.
         * @returns {number}
         * @member {egret.Rectangle} egret.DisplayObject#measuredWidth
         * @version Egret 2.4
         * @platform Web,Native
         */
        public get measuredHeight(): number {
            return this.$getOriginalBounds().height;
        }

        $anchorOffsetX: number = 0;

        /**
         * X Pepresents the object of which is the anchor.
         * @default 0
         * @version Egret 2.4
         * @platform Web,Native
         */
        public get anchorOffsetX(): number {
            return this.$anchorOffsetX;
        }

        public set anchorOffsetX(value: number) {
            this.$setAnchorOffsetX(value);
        }

        /**
         * @private
         * @param value
         * @returns
         */
        $setAnchorOffsetX(value: number): void {
            let self = this;
            if (self.$anchorOffsetX == value) {
                return;
            }
            self.$anchorOffsetX = value;
            if (egret.nativeRender) {
                self.$nativeDisplayObject.setAnchorOffsetX(value);
            }
            else {
                let p = self.$parent;
                if (p && !p.$cacheDirty) {
                    p.$cacheDirty = true;
                    p.$cacheDirtyUp();
                }
                let maskedObject = self.$maskedObject;
                if (maskedObject && !maskedObject.$cacheDirty) {
                    maskedObject.$cacheDirty = true;
                    maskedObject.$cacheDirtyUp();
                }
            }
        }

        $anchorOffsetY: number = 0;

        /**
         * Y Pepresents the object of which is the anchor.
         * @default 0
         * @version Egret 2.4
         * @platform Web,Native
         */
        public get anchorOffsetY(): number {
            return this.$anchorOffsetY;
        }

        public set anchorOffsetY(value: number) {
            this.$setAnchorOffsetY(value);
        }

        /**
         * @private
         * @param value
         * @returns
         */
        $setAnchorOffsetY(value: number): void {
            let self = this;
            if (self.$anchorOffsetY == value) {
                return;
            }
            self.$anchorOffsetY = value;
            if (egret.nativeRender) {
                self.$nativeDisplayObject.setAnchorOffsetY(value);
            }
            else {
                let p = self.$parent;
                if (p && !p.$cacheDirty) {
                    p.$cacheDirty = true;
                    p.$cacheDirtyUp();
                }
                let maskedObject = self.$maskedObject;
                if (maskedObject && !maskedObject.$cacheDirty) {
                    maskedObject.$cacheDirty = true;
                    maskedObject.$cacheDirtyUp();
                }
            }
        }

        /**
         * @private
         */
        $visible: boolean = true;

        /**
         * Whether or not the display object is visible.
         * Display objects that are not visible are disabled. For example, if visible=false for an DisplayObject
         * instance, it cannot receive touch or other user input.
         * @default true
         * @version Egret 2.4
         * @platform Web,Native
         */
        public get visible(): boolean {
            return this.$visible;
        }

        public set visible(value: boolean) {
            this.$setVisible(value);
        }

        $setVisible(value: boolean): void {
            let self = this;
            if (self.$visible == value) {
                return;
            }
            self.$visible = value;
            if (egret.nativeRender) {
                self.$nativeDisplayObject.setVisible(value);
            }
            else {
                self.$updateRenderMode();
                let p = self.$parent;
                if (p && !p.$cacheDirty) {
                    p.$cacheDirty = true;
                    p.$cacheDirtyUp();
                }
                let maskedObject = self.$maskedObject;
                if (maskedObject && !maskedObject.$cacheDirty) {
                    maskedObject.$cacheDirty = true;
                    maskedObject.$cacheDirtyUp();
                }
            }
        }

        /**
         * @private
         * The cache bitmap node created by cacheAsBitmap.
         */
        $displayList: egret.sys.DisplayList = null;

        private $cacheAsBitmap: boolean = false;

        /**
         * If set to true, Egret runtime caches an internal bitmap representation of the display object. This caching can
         * increase performance for display objects that contain complex vector content. After you set the cacheAsBitmap
         * property to true, the rendering does not change, however the display object performs pixel snapping automatically.
         * The execution speed can be significantly faster depending on the complexity of the content.The cacheAsBitmap
         * property is best used with display objects that have mostly static content and that do not scale and rotate frequently.
         * Note: The display object will not create the bitmap caching when the memory exceeds the upper limit,even if you set it to true.
         * @default false
         * @version Egret 2.4
         * @platform Web,Native
         */
        public get cacheAsBitmap(): boolean {
            return this.$cacheAsBitmap;
        }

        public set cacheAsBitmap(value: boolean) {
            let self = this;
            self.$cacheAsBitmap = value;
            if (egret.nativeRender) {
                self.$nativeDisplayObject.setCacheAsBitmap(value);
            }
            else {
                self.$setHasDisplayList(value);
            }
        }

        public $setHasDisplayList(value: boolean): void {
            let self = this;
            let hasDisplayList = !!self.$displayList;
            if (hasDisplayList == value) {
                return;
            }
            if (value) {
                let displayList = sys.DisplayList.create(self);
                if (displayList) {
                    self.$displayList = displayList;
                    self.$cacheDirty = true;
                }
            }
            else {
                self.$displayList = null;
            }
        }

        $cacheDirty: boolean = false;

        $cacheDirtyUp(): void {
            let p = this.$parent;
            if (p && !p.$cacheDirty) {
                p.$cacheDirty = true;
                p.$cacheDirtyUp();
            }
        }

        /**
         * @private
         */
        $alpha: number = 1;

        /**
         * Indicates the alpha transparency value of the object specified.
         * Valid values are 0 (fully transparent) to 1 (fully opaque).
         * The default value is 1. Display objects with alpha set to 0 are active, even though they are invisible.
         * @default 1
         * @version Egret 2.4
         * @platform Web,Native
         */
        public get alpha(): number {
            return this.$alpha;
        }

        public set alpha(value: number) {
            this.$setAlpha(value);
        }

        /**
         * @private
         * @param value
         */
        $setAlpha(value: number): void {
            let self = this;
            if (self.$alpha == value) {
                return;
            }
            self.$alpha = value;

            if (egret.nativeRender) {
                self.$nativeDisplayObject.setAlpha(value);
            }
            else {
                self.$updateRenderMode();
                let p = self.$parent;
                if (p && !p.$cacheDirty) {
                    p.$cacheDirty = true;
                    p.$cacheDirtyUp();
                }
                let maskedObject = self.$maskedObject;
                if (maskedObject && !maskedObject.$cacheDirty) {
                    maskedObject.$cacheDirty = true;
                    maskedObject.$cacheDirtyUp();
                }
            }
        }

        /**
         * @private
         * The default touchEnabled property of DisplayObject.
         * @default false
         * @version Egret 2.5
         * @platform Web,Native
         */
        static defaultTouchEnabled: boolean = false;

        $touchEnabled: boolean = DisplayObject.defaultTouchEnabled;

        /**
         * Specifies whether this object receives touch or other user input. The default value is false, which means that
         * by default any DisplayObject instance that is on the display list cannot receive touch events. If touchEnabled is
         * set to false, the instance does not receive any touch events (or other user input events). Any children of
         * this instance on the display list are not affected. To change the touchEnabled behavior for all children of
         * an object on the display list, use DisplayObjectContainer.touchChildren.
         * @see egret.DisplayObjectContainer#touchChildren
         * @default false
         * @version Egret 2.4
         * @platform Web,Native
         */
        public get touchEnabled(): boolean {
            return this.$getTouchEnabled();
        }

        public set touchEnabled(value: boolean) {
            this.$setTouchEnabled(value);
        }

        /**
         * @private
         */
        $getTouchEnabled(): boolean {
            return this.$touchEnabled;
        }

        /**
         * @private
         */
        $setTouchEnabled(value: boolean): void {
            this.$touchEnabled = !!value;
        }

        /**
         * @private
         */
        $scrollRect: Rectangle = null;

        /**
         * The scroll rectangle bounds of the display object. The display object is cropped to the size defined by the rectangle,
         * and it scrolls within the rectangle when you change the x and y properties of the scrollRect object. A scrolled display
         * object always scrolls in whole pixel increments.You can scroll an object left and right by setting the x property of
         * the scrollRect Rectangle object. You can scroll an object up and down by setting the y property of the scrollRect
         * Rectangle object. If the display object is rotated 90° and you scroll it left and right, the display object actually
         * scrolls up and down.
         *
         * Note: to change the value of a display object's scrollRect, you must make a copy of the entire scrollRect object, then copy
         * the new object into the scrollRect property of the display object.
         * 
         * The following code increases the x value of a display object's scrollRect:
         * @example 
         *     let myRectangle:Rectangle = myDisplayObject.scrollRect;
         *     myRectangle.x += 10;
         *     myDisplayObject.scrollRect = myRectangle;
         * @version Egret 2.4
         * @platform Web,Native
         */
        public get scrollRect(): Rectangle {
            return this.$scrollRect;
        }

        public set scrollRect(value: Rectangle) {
            this.$setScrollRect(value);
        }

        /**
         * @private
         * @param value
         */
        private $setScrollRect(value: Rectangle): void {
            let self = this;
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
                let p = self.$parent;
                if (p && !p.$cacheDirty) {
                    p.$cacheDirty = true;
                    p.$cacheDirtyUp();
                }
                let maskedObject = self.$maskedObject;
                if (maskedObject && !maskedObject.$cacheDirty) {
                    maskedObject.$cacheDirty = true;
                    maskedObject.$cacheDirtyUp();
                }
            }
        }

        /**
         * @private
         */
        $blendMode: number = 0;

        /**
         * A value from the BlendMode class that specifies which blend mode to use. Determine how a source image (new one)
         * is drawn on the target image (old one).
         * If you attempt to set this property to an invalid value, Egret runtime set the value to BlendMode.NORMAL.
         * @default egret.BlendMode.NORMAL
         * @see egret.BlendMode
         * @version Egret 2.4
         * @platform Web,Native
         */
        public get blendMode(): string {
            return sys.numberToBlendMode(this.$blendMode);
        }

        public set blendMode(value: string) {
            let self = this;
            let mode = sys.blendModeToNumber(value);
            if (self.$blendMode == mode) {
                return;
            }
            self.$blendMode = mode;

            if (egret.nativeRender) {
                self.$nativeDisplayObject.setBlendMode(mode);
            }
            else {
                self.$updateRenderMode();
                let p = self.$parent;
                if (p && !p.$cacheDirty) {
                    p.$cacheDirty = true;
                    p.$cacheDirtyUp();
                }
                let maskedObject = self.$maskedObject;
                if (maskedObject && !maskedObject.$cacheDirty) {
                    maskedObject.$cacheDirty = true;
                    maskedObject.$cacheDirtyUp();
                }
            }
        }

        /**
         * @private
         * Masked object.
         */
        $maskedObject: DisplayObject = null;

        /**
         * @private
         */
        $mask: DisplayObject = null;

        /**
         * @private
         */
        $maskRect: Rectangle = null;

        /**
         * The calling display object is masked by the specified mask object. To ensure that masking works when the Stage
         * is scaled, the mask display object must be in an active part of the display list. The mask object itself is not drawn.
         * Set mask to null to remove the mask. To be able to scale a mask object, it must be on the display list. To be
         * able to drag a mask object , it must be on the display list.
         * Note: A single mask object cannot be used to mask more than one calling display object. When the mask is assigned
         * to a second display object, it is removed as the mask of the first object, and that object's mask property becomes null.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public get mask(): DisplayObject | Rectangle {
            let self = this;
            return self.$mask ? self.$mask : self.$maskRect;
        }

        public set mask(value: DisplayObject | Rectangle) {
            let self = this;
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
        }

        private $setMaskRect(value: Rectangle): void {
            let self = this;
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
        }

        public $filters: Array<Filter | CustomFilter>;

        /**
         * An indexed array that contains each filter object currently associated with the display object.
         * @version Egret 3.1.0
         * @platform Web
         */
        public get filters(): Array<Filter | CustomFilter> {
            return this.$filters;
        }

        public set filters(value: Array<Filter | CustomFilter>) {
            let self = this;
            let filters: Filter[] = self.$filters;
            if (!filters && !value) {
                self.$filters = value;
                if (egret.nativeRender) {
                    self.$nativeDisplayObject.setFilters(null);
                }
                else {
                    self.$updateRenderMode();
                    let p = self.$parent;
                    if (p && !p.$cacheDirty) {
                        p.$cacheDirty = true;
                        p.$cacheDirtyUp();
                    }
                    let maskedObject = self.$maskedObject;
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
                let p = self.$parent;
                if (p && !p.$cacheDirty) {
                    p.$cacheDirty = true;
                    p.$cacheDirtyUp();
                }
                let maskedObject = self.$maskedObject;
                if (maskedObject && !maskedObject.$cacheDirty) {
                    maskedObject.$cacheDirty = true;
                    maskedObject.$cacheDirtyUp();
                }
            }
        }

        /**
         * Returns a rectangle that defines the area of the display object relative to the coordinate system of the targetCoordinateSpace object.
         * @param targetCoordinateSpace The display object that defines the coordinate system to use.
         * @param resultRect A reusable instance of Rectangle for saving the results. Passing this parameter can reduce the number of reallocate objects
         *, which allows you to get better code execution performance..
         * @returns The rectangle that defines the area of the display object relative to the targetCoordinateSpace object's coordinate system.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public getTransformedBounds(targetCoordinateSpace: DisplayObject, resultRect?: Rectangle): Rectangle {
            targetCoordinateSpace = targetCoordinateSpace || this;
            return this.$getTransformedBounds(targetCoordinateSpace, resultRect);
        }

        /**
         * Obtain measurement boundary of display object
         * @param resultRect {Rectangle} Optional. It is used to import Rectangle object for saving results, preventing duplicate object creation.
         * @param calculateAnchor {boolean} Optional. It is used to determine whether to calculate anchor point.
         * @returns {Rectangle}
         * @version Egret 2.4
         * @platform Web,Native
         */
        public getBounds(resultRect?: Rectangle, calculateAnchor: boolean = true): egret.Rectangle {
            let self = this;
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
        }

        /**
         * @private
         */
        $getTransformedBounds(targetCoordinateSpace: DisplayObject, resultRect?: Rectangle): Rectangle {
            let self = this;
            let bounds = self.$getOriginalBounds();
            if (!resultRect) {
                resultRect = new Rectangle();
            }
            resultRect.copyFrom(bounds);
            if (targetCoordinateSpace == self) {
                return resultRect;
            }
            let m: Matrix;
            if (targetCoordinateSpace) {
                m = $TempMatrix;
                let invertedTargetMatrix = targetCoordinateSpace.$getInvertedConcatenatedMatrix();
                invertedTargetMatrix.$preMultiplyInto(self.$getConcatenatedMatrix(), m);
            } else {
                m = self.$getConcatenatedMatrix();
            }
            m.$transformBounds(resultRect);
            return resultRect;
        }

        /**
         * Converts the point object from the Stage (global) coordinates to the display object's (local) coordinates.
         * @param stageX the x value in the global coordinates
         * @param stageY the y value in the global coordinates
         * @param resultPoint A reusable instance of Point for saving the results. Passing this parameter can reduce the
         * number of reallocate objects, which allows you to get better code execution performance.
         * @returns A Point object with coordinates relative to the display object.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public globalToLocal(stageX: number = 0, stageY: number = 0, resultPoint?: Point): Point {
            if (egret.nativeRender) {
                egret_native.updateNativeRender();
                let result = egret_native.nrGlobalToLocal(this.$nativeDisplayObject.id, stageX, stageY);
                let arr = result.split(",");
                let x = parseFloat(arr[0]);
                let y = parseFloat(arr[1]);
                if (resultPoint) {
                    resultPoint.setTo(x, y);
                }
                else {
                    resultPoint = new Point(x, y);
                }
                return resultPoint;
            }
            else {
                let m = this.$getInvertedConcatenatedMatrix();
                return m.transformPoint(stageX, stageY, resultPoint);
            }
        }

        /**
         * Converts the point object from the display object's (local) coordinates to the Stage (global) coordinates.
         * @param localX the x value in the local coordinates
         * @param localY the x value in the local coordinates
         * @param resultPoint A reusable instance of Point for saving the results. Passing this parameter can reduce the
         * number of reallocate objects, which allows you to get better code execution performance.
         * @returns  A Point object with coordinates relative to the Stage.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public localToGlobal(localX: number = 0, localY: number = 0, resultPoint?: Point): Point {
            if (egret.nativeRender) {
                egret_native.updateNativeRender();
                let result = egret_native.nrLocalToGlobal(this.$nativeDisplayObject.id, localX, localY);
                let arr = result.split(",");
                let x = parseFloat(arr[0]);
                let y = parseFloat(arr[1]);
                if (resultPoint) {
                    resultPoint.setTo(x, y);
                }
                else {
                    resultPoint = new Point(x, y);
                }
                return resultPoint;
            }
            else {
                let m = this.$getConcatenatedMatrix();
                return m.transformPoint(localX, localY, resultPoint);
            }
        }

        /**
         * @private
         * Obtain the set of rectangular areas occupied by the display object, usually including the measurement
         * area drawn by itself, and in the case of a container, the area occupied by all children.
         */
        $getOriginalBounds(): Rectangle {
            let self = this;
            let bounds: Rectangle = self.$getContentBounds();
            self.$measureChildBounds(bounds);
            let offset = self.$measureFiltersOffset(false);
            if (offset) {
                bounds.x += offset.minX;
                bounds.y += offset.minY;
                bounds.width += -offset.minX + offset.maxX;
                bounds.height += -offset.minY + offset.maxY;
            }
            return bounds;
        }

        /**
         * @private
         * Measure the rectangular area occupied by the child.
         * @param bounds The measurement result is stored in this rectangular object.
         */
        $measureChildBounds(bounds: Rectangle): void {

        }

        /**
         * @private
         */
        $getContentBounds(): Rectangle {
            let bounds: egret.Rectangle = $TempRectangle;
            bounds.setEmpty();
            this.$measureContentBounds(bounds);
            return bounds;
        }

        /**
         * @private
         * Measure the rectangular area occupied by itself.
         * Note: This measurement does not include the area occupied by the subitems.
         * @param bounds The measurement result is stored in this rectangular object.
         */
        $measureContentBounds(bounds: Rectangle): void {
        }

        /**
         * @private
         */
        $parentDisplayList: egret.sys.DisplayList = null;

        /**
         * @private
         * Render node, if it is not empty, it means that it has something to draw to the screen.
         */
        $renderNode: sys.RenderNode = null;

        $renderDirty: boolean = false;

        /**
         * @private
         * Get render node.
         */
        $getRenderNode(): sys.RenderNode {
            let self = this;
            let node = self.$renderNode;
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
        }

        public $updateRenderMode(): void {
            let self = this;
            if (!self.$visible || self.$alpha <= 0 || self.$maskedObject) {
                self.$renderMode = RenderMode.NONE;
            }
            else if (self.filters && self.filters.length > 0) {
                self.$renderMode = RenderMode.FILTER;
            }
            else if (self.$blendMode !== 0 || (self.$mask && self.$mask.$stage)) {
                self.$renderMode = RenderMode.CLIP;
            }
            else if (self.$scrollRect || self.$maskRect) {
                self.$renderMode = RenderMode.SCROLLRECT;
            }
            else {
                self.$renderMode = null;
            }
        }

        $renderMode: RenderMode = null;

        /**
         * @private
         */
        private $measureFiltersOffset(fromParent: boolean): any {
            let display: DisplayObject = this;
            let minX: number = 0;
            let minY: number = 0;
            let maxX: number = 0;
            let maxY: number = 0;
            while (display) {
                let filters = display.$filters;
                if (filters && filters.length) {
                    let length = filters.length;
                    for (let i: number = 0; i < length; i++) {
                        let filter: Filter = filters[i];
                        // Todo Cache this data
                        if (filter.type == "blur") {
                            let offsetX = (<BlurFilter>filter).blurX;
                            let offsetY = (<BlurFilter>filter).blurY;
                            minX -= offsetX;
                            minY -= offsetY;
                            maxX += offsetX;
                            maxY += offsetY;
                        }
                        else if (filter.type == "glow") {
                            let offsetX = (<GlowFilter>filter).blurX;
                            let offsetY = (<GlowFilter>filter).blurY;
                            minX -= offsetX;
                            minY -= offsetY;
                            maxX += offsetX;
                            maxY += offsetY;
                            let distance: number = (<DropShadowFilter>filter).distance || 0;
                            let angle: number = (<DropShadowFilter>filter).angle || 0;
                            let distanceX = 0;
                            let distanceY = 0;
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
                        } else if (filter.type == "custom") {
                            let padding = (<CustomFilter>filter).padding;
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
            return { minX, minY, maxX, maxY };
        }

        /**
         * @private
         * Get the connection matrix relative to the specified root node.
         * @param root Root node display object
         * @param matrix The complete connection matrix of the target display object relative to the stage.
         */
        $getConcatenatedMatrixAt(root: DisplayObject, matrix: Matrix): void {
            let invertMatrix = root.$getInvertedConcatenatedMatrix();
            if ((invertMatrix.a === 0 || invertMatrix.d === 0) && (invertMatrix.b === 0 || invertMatrix.c === 0)) {// Scaling value is 0, inverse matrix is invalid.
                let target: DisplayObject = this;
                let rootLevel = root.$nestLevel;
                matrix.identity();
                while (target.$nestLevel > rootLevel) {
                    let rect = target.$scrollRect;
                    if (rect) {
                        matrix.concat($TempMatrix.setTo(1, 0, 0, 1, -rect.x, -rect.y));
                    }
                    matrix.concat(target.$getMatrix());
                    target = target.$parent;
                }
            }
            else {
                invertMatrix.$preMultiplyInto(matrix, matrix);
            }
        }

        /**
         * @private
         * Update renderNode.
         */
        $updateRenderNode(): void {

        }

        /**
         * @private
         */
        $hitTest(stageX: number, stageY: number): DisplayObject {
            let self = this;
            if ((!egret.nativeRender && !self.$renderNode) || !self.$visible || self.$scaleX == 0 || self.$scaleY == 0) {
                return null;
            }
            let m = self.$getInvertedConcatenatedMatrix();
            if (m.a == 0 && m.b == 0 && m.c == 0 && m.d == 0) {// Prevent parent class from affecting child class.
                return null;
            }
            let bounds = self.$getContentBounds();
            let localX = m.a * stageX + m.c * stageY + m.tx;
            let localY = m.b * stageX + m.d * stageY + m.ty;
            if (bounds.contains(localX, localY)) {
                if (!self.$children) {// The container has checked scrollRect and mask to avoid repeated collisions with the mask.

                    let rect = self.$scrollRect ? self.$scrollRect : self.$maskRect;
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
        }

        /**
         * Calculate the display object to determine whether it overlaps or crosses with the points specified by the x and y parameters. The x and y parameters specify the points in the coordinates of the stage, rather than the points in the display object container that contains display objects (except the situation where the display object container is a stage).
         * Note: Don't use accurate pixel collision detection on a large number of objects. Otherwise, this will cause serious performance deterioration.
         * @param x {number}  x coordinate of the object to be tested.
         * @param y {number}  y coordinate of the object to be tested.
         * @param shapeFlag {boolean} Whether to check the actual pixel of object (true) or check that of border (false).Write realized.
         * @returns {boolean} If display object overlaps or crosses with the specified point, it is true; otherwise, it is false.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public hitTestPoint(x: number, y: number, shapeFlag?: boolean): boolean {
            let self = this;
            if (!shapeFlag) {
                if (self.$scaleX == 0 || self.$scaleY == 0) {
                    return false;
                }
                let m = self.$getInvertedConcatenatedMatrix();
                let bounds = self.getBounds(null, false);
                let localX = m.a * x + m.c * y + m.tx;
                let localY = m.b * x + m.d * y + m.ty;
                if (bounds.contains(localX, localY)) {
                    // The case of setting the mask is not considered here.
                    let rect = self.$scrollRect ? self.$scrollRect : self.$maskRect;
                    if (rect && !rect.contains(localX, localY)) {
                        return false;
                    }
                    return true;
                }
                return false;
            }
            else {
                let m = self.$getInvertedConcatenatedMatrix();
                let localX = m.a * x + m.c * y + m.tx;
                let localY = m.b * x + m.d * y + m.ty;
                let data: number[] | Uint8Array;
                if (egret.nativeRender) {
                    let buffer = sys.customHitTestBuffer;
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
                        throw new Error(sys.tr(1039));
                    }
                    egret_native.activateBuffer(null);
                    egret_native.forHitTest = false;
                    if (data[3] === 0) {
                        return false;
                    }
                    return true;
                }
                else {
                    let displayList = self.$displayList;
                    if (displayList) {
                        let buffer = displayList.renderBuffer;
                        try {
                            data = buffer.getPixels(localX - displayList.offsetX, localY - displayList.offsetY);
                        }
                        catch (e) {
                            throw new Error(sys.tr(1039));
                        }
                    }
                    else {
                        let buffer = sys.customHitTestBuffer;
                        buffer.resize(3, 3);
                        let matrix = Matrix.create();
                        matrix.identity();
                        matrix.translate(1 - localX, 1 - localY);
                        sys.systemRenderer.render(this, buffer, matrix, true);
                        Matrix.release(matrix);

                        try {
                            data = buffer.getPixels(1, 1);
                        }
                        catch (e) {
                            throw new Error(sys.tr(1039));
                        }
                    }
                    if (data[3] === 0) {
                        return false;
                    }
                    return true;
                }
            }
        }

        /**
         * @private
         */
        static $enterFrameCallBackList: DisplayObject[] = [];

        /**
         * @private
         */
        static $renderCallBackList: DisplayObject[] = [];

        /**
         * @private
         */
        $addListener(type: string, listener: Function, thisObject: any, useCapture?: boolean, priority?: number, dispatchOnce?: boolean): void {
            super.$addListener(type, listener, thisObject, useCapture, priority, dispatchOnce);
            let isEnterFrame = (type == Event.ENTER_FRAME);
            if (isEnterFrame || type == Event.RENDER) {
                let list = isEnterFrame ? DisplayObject.$enterFrameCallBackList : DisplayObject.$renderCallBackList;
                if (list.indexOf(this) == -1) {
                    list.push(this);
                }
            }
        }

        /**
         * @inheritDoc
         * @version Egret 2.4
         * @platform Web,Native
         */
        public removeEventListener(type: string, listener: Function, thisObject: any, useCapture?: boolean): void {
            super.removeEventListener(type, listener, thisObject, useCapture);
            let isEnterFrame: boolean = (type == Event.ENTER_FRAME);
            if ((isEnterFrame || type == Event.RENDER) && !this.hasEventListener(type)) {
                let list = isEnterFrame ? DisplayObject.$enterFrameCallBackList : DisplayObject.$renderCallBackList;
                let index = list.indexOf(this);
                if (index !== -1) {
                    list.splice(index, 1);
                }
            }
        }

        /**
         * @inheritDoc
         * @version Egret 2.4
         * @platform Web,Native
         */
        public dispatchEvent(event: Event): boolean {
            if (!event.$bubbles) {
                return super.dispatchEvent(event);
            }

            let list = this.$getPropagationList(this);
            let targetIndex = list.length * 0.5;
            event.$setTarget(this);
            this.$dispatchPropagationEvent(event, list, targetIndex);
            return !event.$isDefaultPrevented;
        }

        /**
         * @private
         * Get a list of event streams. Note: The event flow of the Egret framework is not consistent with the Flash implementation.
         *
         * The event flow has three stages: capture, target, bubbling.
         * The default event monitoring in Flash will monitor the target and bubbling stage if useCapture is not enabled. If you start capture, you will only be able to listen to events that are not captured when the target is included.
         * You can write a simple test in Flash: instantiate a non-container display object, such as TextField. Monitor mouse events when useCapture is true and false respectively.
         * After clicking, only the callback function with useCapture as false will output information. It also brings a problem "Flash's capture stage cannot listen to the innermost object itself, only the parent list is valid."
         *
         * The event flow in HTML sets useCapture to true to be able to listen to the target phase, that is, the target phase will be triggered twice, once during the capture and bubbling process. This can be avoided
         * The aforementioned problem of monitor capture cannot monitor the target itself.
         *
         * Egret finally adopted the event flow method that the target node in HTML triggered twice.
         */
        $getPropagationList(target: DisplayObject): DisplayObject[] {
            let list: DisplayObject[] = [];
            while (target) {
                list.push(target);
                target = target.$parent;
            }
            let captureList = list.concat();
            captureList.reverse();// Using the reverse () method once is more efficient than calling unshift () multiple times.
            list = captureList.concat(list);
            return list;
        }

        /**
         * @private
         */
        $dispatchPropagationEvent(event: Event, list: DisplayObject[], targetIndex: number): void {
            let length = list.length;
            let captureIndex = targetIndex - 1;
            for (let i = 0; i < length; i++) {
                let currentTarget = list[i];
                event.$currentTarget = currentTarget;
                if (i < captureIndex)
                    event.$eventPhase = EventPhase.CAPTURING_PHASE;
                else if (i == targetIndex || i == captureIndex)
                    event.$eventPhase = EventPhase.AT_TARGET;
                else
                    event.$eventPhase = EventPhase.BUBBLING_PHASE;
                currentTarget.$notifyListener(event, i < targetIndex);
                if (event.$isPropagationStopped || event.$isPropagationImmediateStopped) {
                    return;
                }
            }
        }

        /**
         * @inheritDoc
         * @version Egret 2.4
         * @platform Web,Native
         */
        public willTrigger(type: string): boolean {
            let parent: DisplayObject = this;
            while (parent) {
                if (parent.hasEventListener(type))
                    return true;
                parent = parent.$parent;
            }
            return false;
        }

        /**
         * Inspired by pixi.js    
         */
        private _tint: number = 0;

        /**
         * @private
         */
        $tintRGB: number = 0;

        /**
         * Set a tint color for the current object.
         * @version Egret 5.2.24
         * @platform Web,Native
         */
        public get tint(): number {
            return this._tint;
        }

        public set tint(value) {
            this._tint = value;
            this.$tintRGB = (value >> 16) + (value & 0xff00) + ((value & 0xff) << 16);
        }

        /**
         * @private
         * Inspired by pixi.js
         */
        $sortDirty: boolean = false;
        public sortChildren(): void {
            this.$sortDirty = false;
        }

        /**
         * @private
         */
        private _zIndex: number = 0;

        /**
         * The z-order (front-to-back order) of the object.
         * @version Egret 5.2.24
         * @platform Web,Native
         * @language en_US
         */
        public get zIndex(): number {
            return this._zIndex;
        }

        public set zIndex(value: number) {
            this._zIndex = value;
            if (this.parent) {
                this.parent.$sortDirty = true;
            }
        }

        /**
         * @private
         */
        $lastSortedIndex: number = 0;

        /**
         * Allow objects to use zIndex sorting.
         * @version Egret 5.2.24
         * @platform Web,Native
         */
        public sortableChildren: boolean = false;
    }
}