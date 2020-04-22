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

/// <reference path="../../player/SystemRenderer.ts" />

namespace egret.web
{
    /**
     * Create a canvas.
     */
    function __createCanvas__(width?: number, height?: number): HTMLCanvasElement {
        let canvas = egret.sys.createCanvas(width, height);
        let context = canvas.getContext("2d");
        if (context["imageSmoothingEnabled"] === undefined) {
            let keys = ["webkitImageSmoothingEnabled", "mozImageSmoothingEnabled", "msImageSmoothingEnabled"];
            let key: string;
            for (let i = keys.length - 1; i >= 0; i--) {
                key = keys[i];
                if (context[key] !== void 0) {
                    break;
                }
            }
            try {
                Object.defineProperty(context, "imageSmoothingEnabled", {
                    get: function () {
                        return this[key];
                    },
                    set: function (value) {
                        this[key] = value;
                    }
                });
            }
            catch (e) {
                context["imageSmoothingEnabled"] = context[key];
            }
        }
        return canvas;
    }

    let sharedCanvas: HTMLCanvasElement;

    /**
     * @private
     * Canvas2D render buffer.
     */
    export class CanvasRenderBuffer implements sys.RenderBuffer
    {
        public constructor(width?: number, height?: number, root?: boolean) {
            this.surface = egret.sys.createCanvasRenderBufferSurface(__createCanvas__, width, height, root);
            this.context = this.surface.getContext("2d");
            if (this.context) {
                this.context.$offsetX = 0;
                this.context.$offsetY = 0;
            }

            this.resize(width, height)
        }

        /**
         * Rendering context.
         */
        public context: CanvasRenderingContext2D;

        /**
         * Canvas that presents the final drawing result.
         */
        public surface: HTMLCanvasElement;

        /**
         * The width of the rendering buffer, in pixels.
         * @readOnly
         */
        public get width(): number {
            return this.surface.width;
        }

        /**
         * The height of the rendering buffer, in pixels.
         * @readOnly
         */
        public get height(): number {
            return this.surface.height;
        }

        /**
         * Change the size of the rendering buffer and clear the buffer.
         * @param width The changed width.
         * @param height Changed height.
         * @param useMaxSize If true is passed, the changed size is compared with the existing size, and the larger size is retained.
         */
        public resize(width: number, height: number, useMaxSize?: boolean): void {
            egret.sys.resizeCanvasRenderBuffer(this, width, height, useMaxSize);
        }

        /**
         * Get the pixels of the specified area.
         */
        public getPixels(x: number, y: number, width: number = 1, height: number = 1): number[] {
            return <number[]><any>this.context.getImageData(x, y, width, height).data;
        }

        /**
         * Converted to base64 string, if the picture (or contained picture) cross domain, then return null.
         * @param type conversion type, such as: "image/png", "image/jpeg".
         */
        public toDataURL(type?: string, encoderOptions?: number): string {
            return this.surface.toDataURL(type, encoderOptions);
        }

        /**
         * Clear the buffer data.
         */
        public clear(): void {
            this.context.setTransform(1, 0, 0, 1, 0, 0);
            this.context.clearRect(0, 0, this.surface.width, this.surface.height);
        }

        /**
         * Destroy the drawing object.
         */
        public destroy(): void {
            this.surface.width = this.surface.height = 0;
        }
    }
}