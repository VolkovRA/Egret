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

/// <reference path="../display/DisplayObject.ts" />

namespace egret
{
    /**
     * The Bitmap class represents display objects that represent bitmap images.
     * The Bitmap() constructor allows you to create a Bitmap object that contains a reference to a BitmapData object.
     * After you create a Bitmap object, use the addChild() or addChildAt() method of the parent DisplayObjectContainer
     * instance to place the bitmap on the display list.A Bitmap object can share its texture reference among several
     * Bitmap objects, independent of translation or rotation properties. Because you can create multiple Bitmap objects
     * that reference the same texture object, multiple display objects can use the same complex texture object
     * without incurring the memory overhead of a texture object for each display object instance.
     *
     * @see egret.Texture
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/display/Bitmap.ts
     */
    export class Bitmap extends DisplayObject
    {
        /**
         * Initializes a Bitmap object to refer to the specified Texture object.
         * @param value The Texture object being referenced.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public constructor(value?: Texture) {
            super();

            this.$renderNode = new sys.NormalBitmapNode();
            this.$setTexture(value);

            if (value)
                (<sys.NormalBitmapNode>this.$renderNode).rotated = value.$rotated;
        }

        protected $texture: Texture = null;
        public $bitmapData: BitmapData = null;
        protected $bitmapX: number = 0;
        protected $bitmapY: number = 0;
        protected $bitmapWidth: number = 0;
        protected $bitmapHeight: number = 0;
        protected $offsetX: number = 0;
        protected $offsetY: number = 0;
        protected $textureWidth: number = 0;
        protected $textureHeight: number = 0;
        protected $sourceWidth: number = 0;
        protected $sourceHeight: number = 0;
        protected $smoothing: boolean = Bitmap.defaultSmoothing;
        protected $explicitBitmapWidth: number = NaN;
        protected $explicitBitmapHeight: number = NaN;

        protected createNativeDisplayObject(): void {
            this.$nativeDisplayObject = new egret_native.NativeDisplayObject(egret_native.NativeObjectType.BITMAP);
        }

        /**
         * @private
         * Add display objects to the stage.
         */
        $onAddToStage(stage: Stage, nestLevel: number): void {
            super.$onAddToStage(stage, nestLevel);

            let texture = this.$texture;
            if (texture && texture.$bitmapData) {
                BitmapData.$addDisplayObject(this, texture.$bitmapData);
            }
        }

        /**
         * @private
         * Remove the display object from the stage.
         */
        $onRemoveFromStage(): void {
            super.$onRemoveFromStage();

            let texture = this.$texture;
            if (texture) {
                BitmapData.$removeDisplayObject(this, texture.$bitmapData);
            }
        }

        /**
         * The Texture object being referenced.
         * If you pass the constructor of type BitmapData or last set for bitmapData, this value returns null.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        public get texture(): Texture {
            return this.$texture;
        }

        public set texture(value: Texture) {
            let self = this;
            self.$setTexture(value);
            if (value && self.$renderNode) {
                (<sys.BitmapNode>self.$renderNode).rotated = value.$rotated;
            }
        }

        /**
         * @private
         */
        $setTexture(value: Texture): boolean {
            let self = this;
            let oldTexture = self.$texture;
            if (value == oldTexture) {
                return false;
            }
            self.$texture = value;
            if (value) {
                self.$refreshImageData();
            }
            else {
                if (oldTexture) {
                    BitmapData.$removeDisplayObject(self, oldTexture.$bitmapData);
                }
                self.setImageData(null, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
                self.$renderDirty = true;
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
                if (egret.nativeRender) {
                    this.setBitmapDataToWasm(null);
                }
                return true;
            }

            if (self.$stage) {
                if (oldTexture && oldTexture.$bitmapData) {
                    let oldHashCode: number = oldTexture.$bitmapData.hashCode;
                    let newHashCode: number = value.$bitmapData ? value.$bitmapData.hashCode : -1;
                    if (oldHashCode == newHashCode) {
                        self.$renderDirty = true;
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
                        return true;
                    }
                    BitmapData.$removeDisplayObject(self, oldTexture.$bitmapData);
                }
                BitmapData.$addDisplayObject(self, value.$bitmapData);
            }

            self.$renderDirty = true;
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
            return true;
        }

        $setBitmapData(value): void {
            this.$setTexture(value);
        }

        /**
         * @private
         */
        protected setBitmapDataToWasm(data?: Texture): void {
            this.$nativeDisplayObject.setTexture(data);
        }

        /**
         * @private
         */
        public $refreshImageData(): void {
            let texture: Texture = this.$texture;
            if (texture) {
                if (egret.nativeRender) {
                    this.setBitmapDataToWasm(texture);
                }
                this.setImageData(texture.$bitmapData,
                    texture.$bitmapX, texture.$bitmapY,
                    texture.$bitmapWidth, texture.$bitmapHeight,
                    texture.$offsetX, texture.$offsetY,
                    texture.$getTextureWidth(), texture.$getTextureHeight(),
                    texture.$sourceWidth, texture.$sourceHeight);
            }
            else {
                if (egret.nativeRender) {
                    this.setBitmapDataToWasm(null);
                }
            }
        }

        /**
         * @private
         */
        private setImageData(bitmapData: BitmapData, bitmapX: number, bitmapY: number, bitmapWidth: number, bitmapHeight: number,
            offsetX: number, offsetY: number, textureWidth: number, textureHeight: number, sourceWidth: number, sourceHeight: number): void {
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
        }

        /**
         * @private
         */
        $scale9Grid: egret.Rectangle = null;

        /**
         * Represent a Rectangle Area that the 9 scale area of Image.
         * Notice: This property is valid only when *fillMode* is *BitmapFillMode.SCALE*.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public get scale9Grid(): egret.Rectangle {
            return this.$scale9Grid;
        }

        public set scale9Grid(value: egret.Rectangle) {
            this.$setScale9Grid(value);
        }

        protected $setScale9Grid(value: egret.Rectangle): void {
            let self = this;
            self.$scale9Grid = value;
            self.$renderDirty = true;
            if (egret.nativeRender) {
                if (value) {
                    self.$nativeDisplayObject.setScale9Grid(value.x, value.y, value.width, value.height);
                } else {
                    self.$nativeDisplayObject.setScale9Grid(0, 0, -1, -1);
                }
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
        $fillMode: string = "scale";

        /**
         * Determines how the bitmap fills in the dimensions.
         * * When set to *BitmapFillMode.REPEAT*, the bitmap repeats to fill the region.
         * * When set to *BitmapFillMode.SCALE*, the bitmap stretches to fill the region.
         * @default BitmapFillMode.SCALE
         * @version Egret 2.4
         * @platform Web
         */
        public get fillMode(): string {
            return this.$fillMode;
        }

        public set fillMode(value: string) {
            this.$setFillMode(value);
        }

        $setFillMode(value: string): boolean {
            const self = this;
            if (value == self.$fillMode) {
                return false;
            }
            self.$fillMode = value;

            if (egret.nativeRender) {
                self.$nativeDisplayObject.setBitmapFillMode(self.$fillMode);
            }
            else {
                self.$renderDirty = true;
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

        /**
         * The default value of whether or not is smoothed when scaled.
         * When object such as Bitmap is created,smoothing property will be set to this value.
         * @default true
         * @version Egret 3.0
         * @platform Web
         */
        public static defaultSmoothing: boolean = true;

        /**
         * Whether or not the bitmap is smoothed when scaled.
         * @version Egret 2.4
         * @platform Web
         */
        public get smoothing(): boolean {
            return this.$smoothing;
        }

        public set smoothing(value: boolean) {
            let self = this;
            if (value == this.$smoothing) {
                return;
            }
            this.$smoothing = value;
            (<sys.BitmapNode>this.$renderNode).smoothing = value;
            if (!egret.nativeRender) {
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
         * @param value
         */
        $setWidth(value: number): boolean {
            let self = this;
            if (value < 0 || value == self.$explicitBitmapWidth) {
                return false;
            }
            self.$explicitBitmapWidth = value;
            self.$renderDirty = true;
            if (egret.nativeRender) {
                self.$nativeDisplayObject.setWidth(value);
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

        /**
         * @private
         * @param value
         */
        $setHeight(value: number): boolean {
            let self = this;
            if (value < 0 || value == self.$explicitBitmapHeight) {
                return false;
            }
            self.$explicitBitmapHeight = value;
            self.$renderDirty = true;
            if (egret.nativeRender) {
                self.$nativeDisplayObject.setHeight(value);
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

        /**
         * @private
         * Get display width.
         */
        $getWidth(): number {
            return isNaN(this.$explicitBitmapWidth) ? this.$getContentBounds().width : this.$explicitBitmapWidth;
        }

        /**
         * @private
         * Get display height.
         */
        $getHeight(): number {
            return isNaN(this.$explicitBitmapHeight) ? this.$getContentBounds().height : this.$explicitBitmapHeight;
        }

        /**
         * @private
         */
        $measureContentBounds(bounds: Rectangle): void {
            if (this.$bitmapData) {
                let w: number = !isNaN(this.$explicitBitmapWidth) ? this.$explicitBitmapWidth : this.$textureWidth;
                let h: number = !isNaN(this.$explicitBitmapHeight) ? this.$explicitBitmapHeight : this.$textureHeight;
                bounds.setTo(0, 0, w, h);
            }
            else {
                let w = !isNaN(this.$explicitBitmapWidth) ? this.$explicitBitmapWidth : 0;
                let h = !isNaN(this.$explicitBitmapHeight) ? this.$explicitBitmapHeight : 0;

                bounds.setTo(0, 0, w, h);
            }
        }

        /**
         * @private
         */
        $updateRenderNode(): void {
            if (this.$texture) {
                let destW: number = !isNaN(this.$explicitBitmapWidth) ? this.$explicitBitmapWidth : this.$textureWidth;
                let destH: number = !isNaN(this.$explicitBitmapHeight) ? this.$explicitBitmapHeight : this.$textureHeight;

                let scale9Grid = this.scale9Grid || this.$texture["scale9Grid"];
                if (scale9Grid) {
                    if (this.$renderNode instanceof sys.NormalBitmapNode) {
                        this.$renderNode = new sys.BitmapNode();
                    }
                    sys.BitmapNode.$updateTextureDataWithScale9Grid(<sys.NormalBitmapNode>this.$renderNode, this.$bitmapData, scale9Grid,
                        this.$bitmapX, this.$bitmapY, this.$bitmapWidth, this.$bitmapHeight,
                        this.$offsetX, this.$offsetY, this.$textureWidth, this.$textureHeight,
                        destW, destH, this.$sourceWidth, this.$sourceHeight, this.$smoothing);
                }
                else {
                    if (this.fillMode == egret.BitmapFillMode.REPEAT && this.$renderNode instanceof sys.NormalBitmapNode) {
                        this.$renderNode = new sys.BitmapNode();
                    }
                    sys.BitmapNode.$updateTextureData(<sys.NormalBitmapNode>this.$renderNode, this.$bitmapData,
                        this.$bitmapX, this.$bitmapY, this.$bitmapWidth, this.$bitmapHeight,
                        this.$offsetX, this.$offsetY, this.$textureWidth, this.$textureHeight,
                        destW, destH, this.$sourceWidth, this.$sourceHeight, this.$fillMode, this.$smoothing);
                }
            }
        }

        private _pixelHitTest: boolean = false;

        /**
         * Specifies whether this object use precise hit testing by checking the alpha value of each pixel.
         * If pixelHitTest is set to true,the transparent area of the bitmap will be touched through.
         * 
         * Note: If the image is loaded from cross origin,that we can't access to the pixel data,so it might cause
         * the pixelHitTest property invalid.
         * @default false
         * @version Egret 2.4
         * @platform Web,Native
         */
        public get pixelHitTest(): boolean {
            return this._pixelHitTest;
        }

        public set pixelHitTest(value: boolean) {
            this._pixelHitTest = !!value;
        }

        $hitTest(stageX: number, stageY: number): DisplayObject {
            let target = super.$hitTest(stageX, stageY);
            if (target && this._pixelHitTest) {
                let boo = this.hitTestPoint(stageX, stageY, true);
                if (!boo) {
                    target = null;
                }
            }
            return target;
        }
    }
}
