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

/// <reference path="../utils/HashObject.ts" />

namespace egret
{
    export let $TextureScaleFactor: number = 1;

    /**
     * The Texture class encapsulates different image resources on different platforms.
     * In HTML5, resource is an HTMLElement object.
     * In OpenGL / WebGL, resource is a texture ID obtained after the GPU is submitted.
     * The Texture class encapsulates the details implemented on the underlayer. Developers just need to focus on interfaces.
     * @see http://edn.egret.com/cn/docs/page/135 The use of texture packs.
     * @see http://edn.egret.com/cn/docs/page/123 Several ways of access to resources.
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/display/Texture.ts
     */
    export class Texture extends HashObject
    {
        /**
         * Create an egret.Texture object.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public constructor() {
            super();
        }

        /**
         * Whether to destroy the corresponding BitmapData when the texture is destroyed.
         * @version Egret 5.0.8
         * @platform Web,Native
         */
        public disposeBitmapData: boolean = true;

        /**
         * @private
         * Indicates the starting position of x of this texture on bitmapData.
         */
        public $bitmapX: number = 0;

        /**
         * @private
         * Indicates the y starting position of this texture on bitmapData.
         */
        public $bitmapY: number = 0;

        /**
         * @private
         * Represents the width of this texture on bitmapData.
         */
        public $bitmapWidth: number = 0;

        /**
         * @private
         * Indicates the height of this texture on bitmapData.
         */
        public $bitmapHeight: number = 0;

        /**
         * @private
         * Indicates that this texture shows the rendering offset in the x direction afterwards.
         */
        public $offsetX = 0;

        /**
         * @private
         * Indicates that this texture shows the rendering offset in the y direction afterwards.
         */
        public $offsetY = 0;

        /**
         * @private
         * Texture width.
         */
        private $textureWidth: number = 0;

        /**
         * Texture width, read only.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public get textureWidth(): number {
            return this.$getTextureWidth();
        }

        $getTextureWidth(): number {
            return this.$textureWidth;
        }

        /**
         * @private
         * Texture height.
         */
        private $textureHeight: number = 0;

        /**
         * Texture height, read only.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public get textureHeight(): number {
            return this.$getTextureHeight();
        }

        $getTextureHeight(): number {
            return this.$textureHeight;
        }

        $getScaleBitmapWidth(): number {
            return this.$bitmapWidth * $TextureScaleFactor;
        }

        $getScaleBitmapHeight(): number {
            return this.$bitmapHeight * $TextureScaleFactor;
        }

        /**
         * @private
         * Means bitmapData.width.
         */
        public $sourceWidth: number = 0;

        /**
         * @private
         * Means bitmapData.height.
         */
        public $sourceHeight: number = 0;

        /**
         * @private
         */
        public $bitmapData: BitmapData = null;

        /**
         * @private
         */
        public $ktxData: ArrayBuffer = null;

        /**
         * @private
         */
        public $rotated: boolean = false;

        /**
         * The BitmapData object being referenced.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public get bitmapData(): BitmapData {
            return this.$bitmapData;
        }

        public set bitmapData(value: BitmapData) {
            this.$ktxData = null;
            this._setBitmapData(value);
        }
        
        /**
        * Set the BitmapData object.
        * @version Egret 3.2.1
        * @platform Web,Native
        */
        public _setBitmapData(value: BitmapData) {
            this.$bitmapData = value;
            let scale = $TextureScaleFactor;
            let w = value.width * scale;
            let h = value.height * scale;
            this.$initData(0, 0, w, h, 0, 0, w, h, value.width, value.height);
        }

        /**
         * The KTX object being referenced.
         * @version Egret 5.2.21
         * @platform Web,Native
         */
        public get ktxData(): ArrayBuffer {
            return this.$ktxData;
        }

        public set ktxData(data: ArrayBuffer) {
            this._setKtxData(data);
        }
        
       /**
        * Set the KTXData object.
        * @version Egret 3.2.1
        * @platform Web,Native
        */
        public _setKtxData(value: ArrayBuffer) {
            if (!value) {
                egret.error('ktx data is null');
                return;
            }
            if (value == this.$ktxData) {
                return;
            }
            let ktx = new egret.KTXContainer(value, 1);
            if (ktx.isInvalid) {
                egret.error('ktx data is invalid');
                return;
            }
            this.$ktxData = value;
            let bitmapData = new egret.BitmapData(value);
            bitmapData.format = 'ktx';
            ktx.uploadLevels(bitmapData, false);
            this._setBitmapData(bitmapData);
        }

        /**
         * @private
         * Set Texture data.
         * @param bitmapX
         * @param bitmapY
         * @param bitmapWidth
         * @param bitmapHeight
         * @param offsetX
         * @param offsetY
         * @param textureWidth
         * @param textureHeight
         * @param sourceWidth
         * @param sourceHeight
         */
        public $initData(bitmapX: number, bitmapY: number, bitmapWidth: number, bitmapHeight: number, offsetX: number, offsetY: number,
            textureWidth: number, textureHeight: number, sourceWidth: number, sourceHeight: number, rotated: boolean = false): void {
            let scale = $TextureScaleFactor;
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

            //todo
            BitmapData.$invalidate(this.$bitmapData);
        }

        /**
         * @deprecated
         */
        public getPixel32(x: number, y: number): number[] {
            throw new Error();
        }

        /**
         * Obtain the color value for the specified pixel region.
         * @param x  The x coordinate of the pixel region.
         * @param y  The y coordinate of the pixel region.
         * @param width  The width of the pixel region.
         * @param height  The height of the pixel region.
         * @returns  Specifies the color value for the pixel region.
         * @version Egret 3.2.1
         * @platform Web,Native
         */
        public getPixels(x: number, y: number, width: number = 1, height: number = 1): number[] {
            throw new Error();
        }

        /**
         * Convert base64 string, if the picture (or pictures included) cross-border or null.
         * @param type Type conversions, such as "image / png".
         * @param rect The need to convert the area.
         * @param smoothing Whether to convert data to the smoothing process.
         * @returns {any} base64 string.
         * @version Egret 2.4
         */
        public toDataURL(type: string, rect?: egret.Rectangle, encoderOptions?): string {
            throw new Error();
        }

        /**
         * Crop designated area and save it as image.
         * native support only "image / png" and "image / jpeg"; Web browser because of the various implementations are not the same, it is recommended to use only these two kinds.
         * @param type Type conversions, such as "image / png"
         * @param filePath The path name of the image (the home directory for the game's private space, the path can not have "../",Web supports only pass names.)
         * @param rect The need to convert the area.
         * @version Egret 2.4
         * @platform Native
         */
        public saveToFile(type: string, filePath: string, rect?: egret.Rectangle): void {
            throw new Error();
        }

        /**
         * Dispose texture.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public dispose(): void {
            if (this.$bitmapData) {
                if (this.disposeBitmapData) {
                    this.$bitmapData.$dispose();
                }
                
                this.$bitmapData = null;
            }
        }
    }
}