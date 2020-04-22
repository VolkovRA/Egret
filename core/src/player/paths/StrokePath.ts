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

/// <reference path="Path2D.ts" />

namespace egret.sys
{
    /**
     * @private
     * Line path.
     * 
     * Note: When the line width (lineWidth) is 1 or 3 pixels, special processing is required, and the bottom
     * right corner is offset by 0.5 pixels to display clear and sharp lines.
     */
    export class StrokePath extends Path2D
    {
        public constructor() {
            super();
            this.type = PathType.Stroke;
        }

        /**
         * Line width.
         * 
         * Note: 1 pixel and 3 pixels should be specially treated when drawing, and the overall offset is 0.5
         * pixels to the lower right corner to display clear and sharp lines.
         */
        public lineWidth: number;

        /**
         * Line color.
         */
        public lineColor: number;

        /**
         * Line transparency.
         */
        public lineAlpha: number;

        /**
         * End point style, "none": no end point, "round": round head end point, "square": square head end point.
         */
        public caps: string;

        /**
         * Connection point style, "bevel": bevel connection, "miter": sharp corner connection, "round": round corner connection.
         */
        public joints: CanvasLineJoin;

        /**
         * The number used to represent the limit value of the shear miter.
         */
        public miterLimit: number;

        /**
         * A number describing the length of alternating line segments and spacing (coordinate space units).
         */
        public lineDash: number[];
    }
}