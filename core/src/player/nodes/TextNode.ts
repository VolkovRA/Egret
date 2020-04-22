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

/// <reference path="TextFormat.ts" />
/// <reference path="RenderNode.ts" />

namespace egret.sys {

    /**
     * @private
     * Text rendering node.
     */
    export class TextNode extends RenderNode
    {
        public constructor() {
            super();
            this.type = RenderNodeType.TextNode;
        }

        /**
         * Color value.
         */
        public textColor:number = 0xFFFFFF;

        /**
         * Stroke color value.
         */
        public strokeColor:number = 0x000000;

        /**
         * Font size.
         */
        public size:number = 30;

        /**
         * Stroke size.
         */
        public stroke:number = 0;

        /**
         * Whether to bold.
         */
        public bold:boolean = false;

        /**
         * Whether to tilt.
         */
        public italic:boolean = false;

        /**
         * Font name.
         */
        public fontFamily:string = "Arial";

        /**
         * Draw a line of text.
         */
        public drawText(x:number, y:number, text:string, format:TextFormat):void {
            this.drawData.push(x, y, text, format);
            this.renderCount++;
            this.dirtyRender = true;
        }

        // forWebGL
        /**
         * Draw x offset.
         */
        public x:number;

        /**
         * Plot y offset.
         */
        public y:number;

        /**
         * Draw width.
         */
        public width:number;

        /**
         * Drawing height.
         */
        public height:number;

        /**
         * Dirty render tag.
         */
        public dirtyRender:boolean = true;
        public $texture:WebGLTexture;
        public $textureWidth:number;
        public $textureHeight:number;
        public $canvasScaleX:number;
        public $canvasScaleY:number;

        /**
         * Clear non-drawn cached data.
         */
        public clean():void {
            if(this.$texture) {
                WebGLUtils.deleteWebGLTexture(this.$texture);
                this.$texture = null;
                this.dirtyRender = true;
            }
        }

        /**
         * Before the $ updateRenderNode () method of the display object is called, it automatically clears its own drawData data.
         */
        public cleanBeforeRender():void{
            super.cleanBeforeRender();
            this.dirtyRender = true;
        }
    }
}