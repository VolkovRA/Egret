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
/// <reference path="../../geom/Rectangle.ts" />
/// <reference path="../../geom/Matrix.ts" />
/// <reference path="../../filters/ColorMatrixFilter.ts" />

namespace egret.sys
{
    /**
     * @private
     * Mesh rendering node.
     */
    export class MeshNode extends RenderNode
    {
        public constructor(){
            super();
            this.type = RenderNodeType.MeshNode;
            this.vertices = [];
            this.uvs = [];
            this.indices = [];
        }

        /**
         * Bitmap to draw
         */
        public image:BitmapData = null;

        /**
         * Controls whether to smooth the bitmap when zooming.
         */
        public smoothing:boolean = true;

        /**
         * Picture width. WebGL rendering use
         */
        public imageWidth:number;

        /**
         * Picture height. WebGL rendering use
         */
        public imageHeight:number;

        /**
         * Relative offset matrix.
         */
        public matrix:egret.Matrix;

        /**
         * UV coordinates.
         */
        public uvs:number[];

        /**
         * Vertex coordinates.
         */
        public vertices:number[];

        /**
         * Vertex index.
         */
        public indices:number[];

        /**
         * Vertex index.
         */
        public bounds:Rectangle = new Rectangle();

        /**
         * Mixed mode used.
         */
        public blendMode: number = null;

        /**
         * Relative transparency.
         */
        public alpha: number = NaN;

        /**
         * Color transformation filter.
         */
        public filter: ColorMatrixFilter = null;

        /**
         * Flip.
         */
        public rotated: boolean = false;

        /**
         * Draw a bitmap.
         */
        public drawMesh(sourceX:number, sourceY:number, sourceW:number, sourceH:number,
                         drawX:number, drawY:number, drawW:number, drawH:number):void {
            this.drawData.push(sourceX, sourceY, sourceW, sourceH, drawX, drawY, drawW, drawH);
            this.renderCount++;
        }

        /**
         * Before the $ updateRenderNode () method of the display object is called, it automatically clears its own drawData data.
         */
        public cleanBeforeRender():void{
            super.cleanBeforeRender();
            this.image = null;
            this.matrix = null;
        }
    }
}