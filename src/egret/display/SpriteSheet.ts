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
/// <reference path="../utils/DataStructure.ts" />
/// <reference path="../display/Texture.ts" />

namespace egret
{
    /**
     * SpriteSheet is a mosaic of multiple sub-bitmaps, comprising a plurality of Texture objects.
     * Each Texture object shares the set bitmap of SpriteSheet, but it points to its different areas.
     * On WebGL / OpenGL, this operation can significantly improve performance.
     * At the same time, SpriteSheet can carry out material integration easily to reduce the number of HTTP requests.
     * For specification of the SpriteSheet format, see the document https://github.com/egret-labs/egret-core/wiki/Egret-SpriteSheet-Specification
     * @see http://edn.egret.com/cn/docs/page/135 The use of texture packs
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/display/SpriteSheet.ts
     */
    export class SpriteSheet extends HashObject
    {
        /**
         * Create an egret.SpriteSheet object.
         * @param texture {Texture} Texture.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public constructor(texture:Texture) {
            super();
            
            this.$texture = texture;
            this._bitmapX = texture.$bitmapX - texture.$offsetX;
            this._bitmapY = texture.$bitmapY - texture.$offsetY;
        }

        /**
         * @private
         * Represents the starting position x of this SpriteSheet's bitmap area on bitmapData.
         */
        private _bitmapX:number = 0;

        /**
         * @private
         * Represents the starting position y of this SpriteSheet's bitmap area on bitmapData.
         */
        private _bitmapY:number = 0;

        /**
         * @private
         * Shared bitmap data.
         */
        $texture:Texture;

        /**
         * @private
         * Texture cache dictionary.
         */
        public _textureMap = egret.createMap<Texture>();

        /**
         * Obtain a cached Texture object according to the specified texture name.
         * @param name {string} Cache the name of this Texture object.
         * @returns {egret.Texture} The Texture object
         * @version Egret 2.4
         * @platform Web,Native
         */
        public getTexture(name:string):Texture {
            return this._textureMap[name];
        }

        /**
         * Create a new Texture object for the specified area on SpriteSheet and cache it.
         * @param name {string} Cache the name of this Texture object. If the name already exists, the previous Texture object will be overwrited.
         * @param bitmapX {number} Starting coordinate x of texture area on bitmapData.
         * @param bitmapY {number} Starting coordinate y of texture area on bitmapData.
         * @param bitmapWidth {number} Width of texture area on bitmapData.
         * @param bitmapHeight {number} Height of texture area on bitmapData.
         * @param offsetX {number} Starting point x for a non-transparent area of the original bitmap.
         * @param offsetY {number} Starting point y for a non-transparent area of the original bitmap.
         * @param textureWidth {number} Width of the original bitmap. If it is not passed, use the bitmapWidth  value.
         * @param textureHeight {number} Height of the original bitmap. If it is not passed, use the bitmapHeight value.
         * @returns {egret.Texture} The created Texture object.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public createTexture(name:string, bitmapX:number, bitmapY:number, bitmapWidth:number, bitmapHeight:number, offsetX:number = 0, offsetY:number = 0, textureWidth?:number, textureHeight?:number):Texture {
            if (textureWidth === void 0) {
                textureWidth = offsetX + bitmapWidth;
            }
            if (textureHeight === void 0) {
                textureHeight = offsetY + bitmapHeight;
            }
            let texture:Texture = new egret.Texture();
            texture.disposeBitmapData = false;
            texture.$bitmapData = this.$texture.$bitmapData;
            texture.$initData(this._bitmapX + bitmapX, this._bitmapY + bitmapY, bitmapWidth, bitmapHeight, offsetX, offsetY, textureWidth, textureHeight, this.$texture.$sourceWidth, this.$texture.$sourceHeight);

            this._textureMap[name] = texture;
            return texture;
        }

        /**
         * Dispose texture.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public dispose():void {
            if (this.$texture) {
                this.$texture.dispose();
            }
        }
    }
}