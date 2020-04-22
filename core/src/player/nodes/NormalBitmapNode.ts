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

/// <reference path="RenderNode.ts" />
/// <reference path="../../display/BitmapData.ts" />

namespace egret.sys
{
    /**
     * @private
     * Bitmap rendering node.
     */
    export class NormalBitmapNode extends RenderNode
    {
        public constructor() {
            super();
            this.type = RenderNodeType.NormalBitmapNode;
        }

        /**
         * Bitmap to draw.
         */
        public image: BitmapData = null;

        /**
         * Controls whether to smooth the bitmap when zooming.
         */
        public smoothing: boolean = true;

        /**
         * Picture width. WebGL rendering use.
         */
        public imageWidth: number;

        /**
         * Picture height. WebGL rendering use.
         */
        public imageHeight: number;

        /**
         * Flip.
         */
        public rotated: boolean = false;

        public sourceX: number;
        public sourceY: number;
        public sourceW: number;
        public sourceH: number;
        public drawX: number;
        public drawY: number;
        public drawW: number;
        public drawH: number;

        /**
         * Draw a bitmap.
         */
        public drawImage(sourceX: number, sourceY: number, sourceW: number, sourceH: number,
            drawX: number, drawY: number, drawW: number, drawH: number): void {
            let self = this;
            self.sourceX = sourceX;
            self.sourceY = sourceY;
            self.sourceW = sourceW;
            self.sourceH = sourceH;
            self.drawX = drawX;
            self.drawY = drawY;
            self.drawW = drawW;
            self.drawH = drawH;
            self.renderCount = 1;
        }

        /**
         * Before the $ updateRenderNode () method of the display object is called, it automatically clears its own drawData data.
         */
        public cleanBeforeRender(): void {
            super.cleanBeforeRender();
            this.image = null;
        }
    }
}