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

/// <reference path="../display/DisplayObjectContainer.ts" />

namespace egret
{
    /**
     * The Stage class represents the main drawing area.The Stage object is not globally accessible.
     * You need to access it through the stage property of a DisplayObject instance.
     * The Stage class has several ancestor classes — Sprite, DisplayObject, and EventDispatcher — from which it inherits
     * properties and methods. Many of these properties and methods are inapplicable to Stage objects.
     * @event egret.Event.RESIZE Dispatched when the stageWidth or stageHeight property of the Stage object is changed.
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/display/Stage.ts
     */
    export class Stage extends DisplayObjectContainer
    {
        /**
         * @private
         * Stage is not allowed to instantiate itself.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public constructor() {
            super();
            this.$stage = this;
            this.$nestLevel = 1;
        }

        protected createNativeDisplayObject(): void {
            this.$nativeDisplayObject = new egret_native.NativeDisplayObject(egret_native.NativeObjectType.STAGE);
        }

        /**
         * Gets and sets the frame rate of the stage. The frame rate is defined as frames per second.
         * Valid range for the frame rate is from 0.01 to 1000 frames per second.
         * Note: setting the frameRate property of one Stage object changes the frame rate for all Stage objects
         * @default 30
         * @version Egret 2.4
         * @platform Web,Native
         */
        public get frameRate(): number {
            return ticker.$frameRate;
        }

        public set frameRate(value: number) {
            ticker.$setFrameRate(value);
        }

        /**
         * @private
         */
        $stageWidth: number = 0;

        /**
         * Indicates the width of the stage, in pixels.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public get stageWidth(): number {
            return this.$stageWidth;
        }

        /**
         * @private
         */
        $stageHeight: number = 0;

        /**
         * Indicates the height of the stage, in pixels.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        public get stageHeight(): number {
            return this.$stageHeight;
        }

        /**
         * After you call the invalidate() method, when the display list is next rendered, the Egret runtime sends a render
         * event to each display object that has registered to listen for the render event. You must call the invalidate()
         * method each time you want the Egret runtime to send render events.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public invalidate(): void {
            sys.$invalidateRenderFlag = true;
        }

        /**
         * @deprecated
         */
        public registerImplementation(interfaceName: string, instance: any): void {
            egret.registerImplementation(interfaceName, instance);
        }

        /**
         * @deprecated
         */
        public getImplementation(interfaceName: string): any {
            return egret.getImplementation(interfaceName);
        }

        /**
         * @private
         * Device screen reference.
         */
        $screen: egret.sys.Screen;

        $scaleMode: string = egret.StageScaleMode.SHOW_ALL;

        /**
         * A StageScaleMode class that specifies which scale mode to use.
         * The following are valid values:
         * * StageScaleMode.EXACT_FIT - The entire application be visible in the specified area without trying to preserve the original aspect ratio. Distortion can occur, the application may be stretched or compressed.
         * * StageScaleMode.SHOW_ALL - The entire application is visible in the specified area without distortion while maintaining the application of the original aspect ratio. Applications may display border.
         * * StageScaleMode.NO_SCALE - The size of the entire application is fixed, so that even if the size of the player window changes, it remains unchanged. If the player window is smaller than the content, it may do some trimming.
         * * StageScaleMode.NO_BORDER - Keep the original aspect ratio scaling application content, after scaling a narrow direction of application content to fill the viewport players on both sides in the other direction may exceed the viewport and the player is cut.
         * * StageScaleMode.FIXED_WIDTH - Keep the original aspect ratio scaling application content, after scaling application content in the horizontal and vertical directions to fill the viewport player, but only to keep the contents of the original application constant width, height may change.
         * * StageScaleMode.FIXED_HEIGHT - Keep the original aspect ratio scaling application content, after scaling application content in the horizontal and vertical directions to fill the viewport player, but only to keep the contents of the original application constant height, width may change.
         * @default egret.StageScaleMode.SHOW_ALL
         */
        public get scaleMode(): string {
            return this.$scaleMode;
        }

        public set scaleMode(value: string) {
            if (this.$scaleMode == value) {
                return;
            }
            this.$scaleMode = value;
            this.$screen.updateScreenSize();
        }

        $orientation: string = egret.OrientationMode.AUTO;
        public set orientation(value: string) {
            if (this.$orientation == value) {
                return;
            }
            this.$orientation = value;
            this.$screen.updateScreenSize();
        }

        /**
         * Horizontal and vertical screen display screen, can only be set under the current Native in the configuration file.
         * A egret.OrientationMode class that specifies which display mode to use.
         * The following are valid values:
         * * egret.OrientationMode.AUTO - Always follow the direction of application display screen, always guaranteed by the look down.
         * * egret.OrientationMode.PORTRAIT - Applications remain portrait mode, namely horizontal screen look, the screen from left to right.
         * * egret.OrientationMode.LANDSCAPE - Applications remain horizontal screen mode, namely vertical screen, the screen from right to left.
         * * egret.OrientationMode.LANDSCAPE_FLIPPED - Applications remain horizontal screen mode, namely vertical screen, the screen from left to right.
         * @platform Web
         * @version 2.4
         */
        public get orientation(): string {
            return this.$orientation;
        }

        /**
         * Draw texture zoom ratio.
         * @default 1
         */
        public get textureScaleFactor(): number {
            return egret.$TextureScaleFactor;
        }

        public set textureScaleFactor(value: number) {
            egret.$TextureScaleFactor = value;
        }

        $maxTouches: number = 99;

        /**
         * Set the number of screens can simultaneously touch.
         * Above this amount will not be triggered in response.
         * @default 99
         */
        public get maxTouches(): number {
            return this.$maxTouches;
        }

        public set maxTouches(value: number) {
            if (this.$maxTouches == value) {
                return;
            }
            
            this.$maxTouches = value;
            this.$screen.updateMaxTouches();
        }

        /**
         * Set resolution size.
         * @param width Width.
         * @param height Height.
         * @version Egret 2.5.5
         * @platform Web,Native
         */
        public setContentSize(width: number, height: number): void {
            this.$screen.setContentSize(width, height);
        }

        //for 3D&2D
        /**
         * @private
         */
        public $drawToSurfaceAutoClear = function () {
            if (this.$displayList) {
                this.$displayList.drawToSurface();
            }
        };

        //for 3D&2D
        /**
         * @private
         */
        public $drawToSurface = function () {
            if (this.$displayList) {
                this.$displayList.$stageRenderToSurface();
            }
        };

        //for 3D&2D
        /**
         * @private
         */
        public $resize = function (width, height) {
            this.$stageWidth = width;
            this.$stageHeight = height;
            this.$displayList.renderBuffer.resize(width, height);
            this.dispatchEventWith(egret.Event.RESIZE);
        };
    }

    if (DEBUG) {
        egret.$markCannotUse(Stage, "alpha", 1);
        egret.$markCannotUse(Stage, "visible", true);
        egret.$markCannotUse(Stage, "x", 0);
        egret.$markCannotUse(Stage, "y", 0);
        egret.$markCannotUse(Stage, "scaleX", 1);
        egret.$markCannotUse(Stage, "scaleY", 1);
        egret.$markCannotUse(Stage, "rotation", 0);
        egret.$markCannotUse(Stage, "cacheAsBitmap", false);
        egret.$markCannotUse(Stage, "scrollRect", null);
        egret.$markCannotUse(Stage, "filters", null);
        egret.$markCannotUse(Stage, "blendMode", null);
        egret.$markCannotUse(Stage, "touchEnabled", true);
        egret.$markCannotUse(Stage, "matrix", null);
    }
}