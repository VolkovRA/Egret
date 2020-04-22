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

/// <reference path="../../../geom/Rectangle.ts" />
/// <reference path="../../../geom/Matrix.ts" />
/// <reference path="../../../display/BitmapData.ts" />
/// <reference path="../../../utils/HashObject.ts" />
/// <reference path="../../../player/RenderBuffer.ts" />
/// <reference path="../../../system/NativeContext.ts" />
/// <reference path="../../../web/rendering/webgl/WebGLRenderTarget.ts" />

namespace egret.web
{
    /**
     * @private
     * WebGL rendering cache.
     */
    export class WebGLRenderBuffer extends HashObject implements sys.RenderBuffer
    {
        public static autoClear: boolean = true;

        /**
         * Rendering context.
         */
        public context: WebGLRenderContext;

        /**
         * If it is stage cache, it is canvas.
         * If it is an ordinary cache, it is renderTarget.
         */
        public surface: any;

        /**
         * Root render target.
         * The root rendering target, used to perform the main rendering.
         */
        public rootRenderTarget: WebGLRenderTarget;

        /**
         * Whether it is a stage buffer.
         */
        private root: boolean;

        //
        public currentTexture: WebGLTexture = null;

        public constructor(width?: number, height?: number, root?: boolean) {
            super();

            // Get webglRenderContext.
            this.context = WebGLRenderContext.getInstance(width, height);

            if (egret.nativeRender) {
                if(root) {
                    this.surface = this.context.surface;
                }
                else {
                    this.surface = new egret_native.NativeRenderSurface(this, width, height, root);
                }
                this.rootRenderTarget = null;
                return;
            }

            // Render target corresponding to buffer
            this.rootRenderTarget = new WebGLRenderTarget(this.context.context, 3, 3);
            if (width && height) {
                this.resize(width, height);
            }

            // If it is the first buffer added, it means the stage buffer
            this.root = root;

            // If it is a renderBuffer used for stage rendering, the renderTarget is added to the renderContext by default, and it is the first
            if (this.root) {
                this.context.pushBuffer(this);
                // canvas
                this.surface = this.context.surface;
                this.$computeDrawCall = true;
            }
            else {
                // Due to the frameBuffer binding caused by creating renderTarget, reset the binding here
                let lastBuffer = this.context.activatedBuffer;
                if (lastBuffer) {
                    lastBuffer.rootRenderTarget.activate();
                }
                this.rootRenderTarget.initFrameBuffer();
                this.surface = this.rootRenderTarget;
            }
        }

        public globalAlpha: number = 1;
        public globalTintColor: number = 0xFFFFFF;
        /**
         * Stencil state.
         * Template switch status.
         */
        private stencilState: boolean = false;
        public $stencilList: { x: number, y: number, width: number, height: number }[] = [];
        public stencilHandleCount: number = 0;

        public enableStencil(): void {
            if (!this.stencilState) {
                this.context.enableStencilTest();
                this.stencilState = true;
            }
        }

        public disableStencil(): void {
            if (this.stencilState) {
                this.context.disableStencilTest();
                this.stencilState = false;
            }
        }

        public restoreStencil(): void {
            if (this.stencilState) {
                this.context.enableStencilTest();
            } else {
                this.context.disableStencilTest();
            }
        }

        /**
         * Scissor state.
         * Scissor switch status.
         */
        public $scissorState: boolean = false;
        private scissorRect: Rectangle = new egret.Rectangle();
        public $hasScissor: boolean = false;

        public enableScissor(x: number, y: number, width: number, height: number): void {
            if (!this.$scissorState) {
                this.$scissorState = true;
                this.scissorRect.setTo(x, y, width, height);
                this.context.enableScissorTest(this.scissorRect);
            }
        }

        public disableScissor(): void {
            if (this.$scissorState) {
                this.$scissorState = false;
                this.scissorRect.setEmpty();
                this.context.disableScissorTest();
            }
        }

        public restoreScissor(): void {
            if (this.$scissorState) {
                this.context.enableScissorTest(this.scissorRect);
            } else {
                this.context.disableScissorTest();
            }
        }

        /**
         * The width of the rendering buffer, in pixels.
         * @readOnly
         */
        public get width(): number {
            if (egret.nativeRender) {
                return this.surface.width;
            }
            else {
                return this.rootRenderTarget.width;
            }
        }

        /**
         * The height of the rendering buffer, in pixels.
         * @readOnly
         */
        public get height(): number {
            if (egret.nativeRender) {
                return this.surface.height;
            }
            else {
                return this.rootRenderTarget.height;
            }
        }

        /**
         * Change the size of the rendering buffer and clear the buffer.
         * @param width The changed width.
         * @param height Changed height.
         * @param useMaxSize If true is passed, the changed size is compared with the existing size, and the larger size is retained.
         */
        public resize(width: number, height: number, useMaxSize?: boolean): void {
            width = width || 1;
            height = height || 1;
            if (egret.nativeRender) {
                this.surface.resize(width, height);
                return;
            }
            this.context.pushBuffer(this);
            // Render target size reset
            if (width != this.rootRenderTarget.width || height != this.rootRenderTarget.height) {
                this.context.drawCmdManager.pushResize(this, width, height);
                // Change width and height simultaneously
                this.rootRenderTarget.width = width;
                this.rootRenderTarget.height = height;
            }
            // If it is the stage's rendering buffer, execute resize, otherwise the surface size will not change accordingly
            if (this.root) {
                this.context.resize(width, height, useMaxSize);
            }
            this.context.clear();
            this.context.popBuffer();
        }

        /**
         * Get the pixels of the specified area.
         */
        public getPixels(x: number, y: number, width: number = 1, height: number = 1): number[] {
            let pixels = new Uint8Array(4 * width * height);

            if (egret.nativeRender) {
                egret_native.activateBuffer(this);
                egret_native.nrGetPixels(x, y, width, height, pixels);
                egret_native.activateBuffer(null);
            }
            else {
                let useFrameBuffer = this.rootRenderTarget.useFrameBuffer;
                this.rootRenderTarget.useFrameBuffer = true;
                this.rootRenderTarget.activate();

                this.context.getPixels(x, y, width, height, pixels);

                this.rootRenderTarget.useFrameBuffer = useFrameBuffer;
                this.rootRenderTarget.activate();
            }
            // Image reversal.
            let result = new Uint8Array(4 * width * height);
            for (let i = 0; i < height; i++) {
                for (let j = 0; j < width; j++) {
                    let index1 = (width * (height - i - 1) + j) * 4;
                    let index2 = (width * i + j) * 4;
                    let a = pixels[index2 + 3];
                    result[index1] = Math.round(pixels[index2] / a * 255);
                    result[index1 + 1] = Math.round(pixels[index2 + 1] / a * 255);
                    result[index1 + 2] = Math.round(pixels[index2 + 2] / a * 255);
                    result[index1 + 3] = pixels[index2 + 3];
                }
            }

            return <number[]><any>result;
        }

        /**
         * Converted to base64 string, if the picture (or contained picture) cross domain, then return null.
         * @param type Conversion type, such as: "image/png", "image/jpeg".
         */
        public toDataURL(type?: string, encoderOptions?: number): string {
            return this.context.surface.toDataURL(type, encoderOptions);
        }

        /**
         * Destroy the drawing object.
         */
        public destroy(): void {
            this.context.destroy();
        }

        public onRenderFinish(): void {
            this.$drawCalls = 0;
        }

        /**
         * Swap the image in frameBuffer to surface.
         * @param width
         * @param height
         */
        private drawFrameBufferToSurface(sourceX: number,
            sourceY: number, sourceWidth: number, sourceHeight: number, destX: number, destY: number, destWidth: number, destHeight: number, clear: boolean = false): void {
            this.rootRenderTarget.useFrameBuffer = false;
            this.rootRenderTarget.activate();

            this.context.disableStencilTest(); // Switch frameBuffer Note to disable STENCIL_TEST
            this.context.disableScissorTest();

            this.setTransform(1, 0, 0, 1, 0, 0);
            this.globalAlpha = 1;
            this.context.setGlobalCompositeOperation("source-over");
            clear && this.context.clear();
            this.context.drawImage(<BitmapData><any>this.rootRenderTarget, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight, sourceWidth, sourceHeight, false);
            this.context.$drawWebGL();

            this.rootRenderTarget.useFrameBuffer = true;
            this.rootRenderTarget.activate();

            this.restoreStencil();
            this.restoreScissor();
        }

        /**
         * Exchange surface image to frameBuffer.
         * @param width
         * @param height
         */
        private drawSurfaceToFrameBuffer(sourceX: number,
            sourceY: number, sourceWidth: number, sourceHeight: number, destX: number, destY: number, destWidth: number, destHeight: number, clear: boolean = false): void {
            this.rootRenderTarget.useFrameBuffer = true;
            this.rootRenderTarget.activate();

            this.context.disableStencilTest(); // Switch frameBuffer Note to disable STENCIL_TEST
            this.context.disableScissorTest();

            this.setTransform(1, 0, 0, 1, 0, 0);
            this.globalAlpha = 1;
            this.context.setGlobalCompositeOperation("source-over");
            clear && this.context.clear();
            this.context.drawImage(<BitmapData><any>this.context.surface, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight, sourceWidth, sourceHeight, false);
            this.context.$drawWebGL();

            this.rootRenderTarget.useFrameBuffer = false;
            this.rootRenderTarget.activate();

            this.restoreStencil();
            this.restoreScissor();
        }

        /**
         * Clear the buffer data.
         */
        public clear(): void {
            this.context.pushBuffer(this);
            this.context.clear();
            this.context.popBuffer();
        }

        public $drawCalls: number = 0;
        public $computeDrawCall: boolean = false;

        public globalMatrix: Matrix = new Matrix();
        public savedGlobalMatrix: Matrix = new Matrix();

        public $offsetX: number = 0;
        public $offsetY: number = 0;

        public setTransform(a: number, b: number, c: number, d: number, tx: number, ty: number): void {
            // this.globalMatrix.setTo(a, b, c, d, tx, ty);
            let matrix = this.globalMatrix;
            matrix.a = a;
            matrix.b = b;
            matrix.c = c;
            matrix.d = d;
            matrix.tx = tx;
            matrix.ty = ty;
        }

        public transform(a: number, b: number, c: number, d: number, tx: number, ty: number): void {
            let matrix = this.globalMatrix;
            let a1 = matrix.a;
            let b1 = matrix.b;
            let c1 = matrix.c;
            let d1 = matrix.d;
            if (a != 1 || b != 0 || c != 0 || d != 1) {
                matrix.a = a * a1 + b * c1;
                matrix.b = a * b1 + b * d1;
                matrix.c = c * a1 + d * c1;
                matrix.d = c * b1 + d * d1;
            }
            matrix.tx = tx * a1 + ty * c1 + matrix.tx;
            matrix.ty = tx * b1 + ty * d1 + matrix.ty;
        }

        public useOffset(): void {
            let self = this;
            if (self.$offsetX != 0 || self.$offsetY != 0) {
                self.globalMatrix.append(1, 0, 0, 1, self.$offsetX, self.$offsetY);
                self.$offsetX = self.$offsetY = 0;
            }
        }

        public saveTransform(): void {
            let matrix = this.globalMatrix;
            let sMatrix = this.savedGlobalMatrix;
            sMatrix.a = matrix.a;
            sMatrix.b = matrix.b;
            sMatrix.c = matrix.c;
            sMatrix.d = matrix.d;
            sMatrix.tx = matrix.tx;
            sMatrix.ty = matrix.ty;
        }

        public restoreTransform(): void {
            let matrix = this.globalMatrix;
            let sMatrix = this.savedGlobalMatrix;
            matrix.a = sMatrix.a;
            matrix.b = sMatrix.b;
            matrix.c = sMatrix.c;
            matrix.d = sMatrix.d;
            matrix.tx = sMatrix.tx;
            matrix.ty = sMatrix.ty;
        }

        /**
         * Create a buffer instance.
         */
        public static create(width: number, height: number): WebGLRenderBuffer {
            let buffer = renderBufferPool.pop();
            // width = Math.min(width, 1024);
            // height = Math.min(height, 1024);
            if (buffer) {
                buffer.resize(width, height);
                var matrix = buffer.globalMatrix;
                matrix.a = 1;
                matrix.b = 0;
                matrix.c = 0;
                matrix.d = 1;
                matrix.tx = 0;
                matrix.ty = 0;
                buffer.globalAlpha = 1;
                buffer.$offsetX = 0;
                buffer.$offsetY = 0;
            }
            else {
                buffer = new WebGLRenderBuffer(width, height);
                buffer.$computeDrawCall = false;
            }
            return buffer;
        }

        /**
         * Recycle a buffer instance.
         */
        public static release(buffer: WebGLRenderBuffer): void {
            renderBufferPool.push(buffer);
        }
    }

    let renderBufferPool: WebGLRenderBuffer[] = []; // Render buffer object pool
}