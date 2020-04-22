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
/// <reference path="../paths/StrokePath.ts" />
/// <reference path="../../web/rendering/webgl/WebGLUtils.ts" />

namespace egret.sys
{
    let CAPS_STYLES = ["none", "round", "square"];
    let JOINT_STYLES = ["bevel", "miter", "round"];

    /**
     * @private
     * Vector render node.
     */
    export class GraphicsNode extends RenderNode
    {
        public constructor() {
            super();
            this.type = RenderNodeType.GraphicsNode;
        }

        /**
         * Specify a simple single color fill, which will be used in subsequent calls to other Graphics methods (such as lineTo () or drawCircle ()) when drawing.
         * @param color Fill color.
         * @param alpha Filled alpha value.
         * @param beforePath Insert to draw before the specified path command, usually inserted before the line path currently being drawn to ensure that the line is always above the fill.
         */
        public beginFill(color:number, alpha:number = 1, beforePath?:Path2D):Path2D {
            let path = new sys.FillPath();
            path.fillColor = color;
            path.fillAlpha = alpha;
            if (beforePath) {
                let index = this.drawData.lastIndexOf(beforePath);
                this.drawData.splice(index, 0, path);
            }
            else {
                this.drawData.push(path);
            }
            this.renderCount++;
            return path;
        }

        /**
         * Specify a simple single color fill, which will be used in subsequent calls to other Graphics methods (such as lineTo () or drawCircle ()) when drawing.
         * Calling the clear () method will clear the fill.
         * @param type Is used to specify which GradientType class value to use: GradientType.LINEAR or GradientType.RADIAL.
         * @param colors An array of RGB hexadecimal color values ​​used in the gradient (for example, red is 0xFF0000, blue is 0x0000FF, etc.). For each color, specify the corresponding values ​​in the alphas and ratios parameters.
         * @param alphas Colors The array of alpha values ​​for the corresponding colors in the array.
         * @param ratios An array of color distribution ratios. Valid values ​​are 0 to 255.
         * @param matrix A conversion matrix defined by the egret.Matrix class. The egret.Matrix class includes the createGradientBox () method, through which you can easily set the matrix for use with the beginGradientFill () method.
         * @param beforePath Insert to draw before the specified path command, usually inserted before the line path currently being drawn to ensure that the line is always above the fill.
         */
        public beginGradientFill(type:string, colors:number[], alphas:number[], ratios:number[],
                                 matrix?:egret.Matrix, beforePath?:Path2D):Path2D {
            let m = new egret.Matrix();
            if (matrix) {
                m.a = matrix.a * 819.2;
                m.b = matrix.b * 819.2;
                m.c = matrix.c * 819.2;
                m.d = matrix.d * 819.2;
                m.tx = matrix.tx;
                m.ty = matrix.ty;
            }
            else {
                // Defaults
                m.a = 100;
                m.d = 100;
            }
            let path = new sys.GradientFillPath();
            path.gradientType = type;
            path.colors = colors;
            path.alphas = alphas;
            path.ratios = ratios;
            path.matrix = m;
            if (beforePath) {
                let index = this.drawData.lastIndexOf(beforePath);
                this.drawData.splice(index, 0, path);
            }
            else {
                this.drawData.push(path);
            }
            this.renderCount++;
            return path;
        }

        /**
         * Specify a line style for subsequent calls to Graphics methods such as lineTo () or drawCircle ().
         * @param thickness An integer indicating the thickness of the line in points, valid values ​​are 0 to 255. If no number is specified, or this parameter is not defined, no line is drawn. If the value passed is less than 0, the default value is 0. A value of 0 indicates extremely thin thickness; the maximum thickness is 255. If the value passed is greater than 255, the default value is 255.
         * @param color The hexadecimal color value of the line (for example, red is 0xFF0000, blue is 0x0000FF, etc.). If no value is specified, the default value is 0x000000 (black). Optional.
         * @param alpha Is the number of the alpha value of the line color; valid values ​​are 0 to 1. If no value is specified, the default value is 1 (solid color). If the value is less than 0, the default value is 0. If the value is greater than 1, the default value is 1.
         * @param caps Is used to specify the value of the CapsStyle class at the end of the line. Default value: CapsStyle.ROUND
         * @param joints Specifies the type of joint appearance used for corners. Default value: JointStyle.ROUND
         * @param miterLimit The number used to represent the limit value of shear miter.
         */
        public lineStyle(thickness?:number, color?:number, alpha:number = 1, caps?:string,
                         joints?:CanvasLineJoin, miterLimit:number = 3, lineDash:number[] = []):StrokePath {
            if (CAPS_STYLES.indexOf(caps) == -1) {
                caps = "round";
            }
            if (JOINT_STYLES.indexOf(joints) == -1) {
                joints = "round";
            }
            let path = new StrokePath();
            path.lineWidth = thickness;
            path.lineColor = color;
            path.lineAlpha = alpha;
            path.caps = caps || CapsStyle.ROUND;
            path.joints = joints;
            path.miterLimit = miterLimit;
            path.lineDash = lineDash;
            this.drawData.push(path);
            this.renderCount++;
            return path;
        }

        /**
         * Clear all cached drawing data.
         */
        public clear():void {
            this.drawData.length = 0;
            this.dirtyRender = true;
            this.renderCount = 0;
        }

        /**
         * Override the parent class method, do not automatically clear the cached drawing data, instead manually call the clear () method to clear.
         */
        public cleanBeforeRender():void {

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
         * Dirty rendering tags.
         * Temporarily call the lineStyle, beginFill, beginGradientFill tags, which should actually be marked in Path2D when drawing.
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
    }
}