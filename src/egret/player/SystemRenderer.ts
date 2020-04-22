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

/// <reference path="RenderBuffer.ts" />
/// <reference path="nodes/RenderNode.ts" />
/// <reference path="rendering/CanvasRenderer.ts" />
/// <reference path="../display/DisplayObject.ts" />
/// <reference path="../geom/Matrix.ts" />

namespace egret.sys
{
    /**
     * @private
     */
    export let systemRenderer: SystemRenderer;

    /**
     * @private
     * Used for collision detection drawing.
     */
    export let canvasRenderer: SystemRenderer;

    /**
     * @private
     * Display renderer interface.
     */
    export interface SystemRenderer
    {
        /**
         * Render a display object.
         * @param displayObject The display object to be rendered.
         * @param buffer Rendering buffer.
         * @param matrix The matrix to be superimposed.
         * @param forRenderTexture The drawing target is the RenderTexture logo.
         * @returns DrawCall the number of times to trigger drawing.
         */
        render(displayObject: DisplayObject, buffer: RenderBuffer, matrix: Matrix, forRenderTexture?: boolean): number;
        
        /**
         * Draw a RenderNode object to the rendering buffer.
         * @param node The node to be drawn.
         * @param buffer Rendering buffer.
         * @param matrix The matrix to be superimposed.
         * @param forHitTest Drawing result is used for collision detection. If true, when rendering GraphicsNode,
         * the transparency style setting will be ignored and all will be drawn as opaque.
         */
        drawNodeToBuffer(node: sys.RenderNode, buffer: RenderBuffer, matrix: Matrix, forHitTest?: boolean): void;
    }

    /**
     * 
     */
    export interface RenderContext {

    }

    /**
     * Create a canvas.
     */
    export function mainCanvas(width?: number, height?: number): HTMLCanvasElement {
        console.error(`empty sys.mainCanvas = ${width}, ${height}`);
        return null;
    }

    export function createCanvas(width?: number, height?: number): HTMLCanvasElement {
        console.error(`empty sys.createCanvas = ${width}, ${height}`);
        return null;
    }

    /**
     * Reset the size of the main canvas.
     */
    export function resizeContext(renderContext: RenderContext, width: number, height: number, useMaxSize?: boolean): void {
        console.error(`empty sys.resizeContext = ${renderContext}, ${width}, ${height}, ${useMaxSize}`);
    }

    /**
     * Get the system's rendering runtime.
     */
    export function getContextWebGL(surface: HTMLCanvasElement): WebGLRenderingContext {
        console.error(`empty sys.getContextWebGL = ${surface}`);
        return null;
    }

    export function getContext2d(surface: HTMLCanvasElement): CanvasRenderingContext2D {
        console.error(`empty sys.getContext2d = ${surface}`);
        return null;
    }

    /**
     * Create textures only with bitmapData.
     */
    export function createTexture(renderContext: RenderContext, bitmapData: BitmapData | HTMLCanvasElement): WebGLTexture {
        console.error(`empty sys.createTexture = ${bitmapData}`);
        return null;
    }

    /**
     * Create texture by width, height, data.
     */
    export function _createTexture(renderContext: RenderContext, width: number, height: number, data: any): WebGLTexture {
        console.error(`empty sys._createTexture = ${width}, ${height}, ${data}`);
        return null;
    }

    /**
     * Painting texture.
     */
    export function drawTextureElements(renderContext: RenderContext, data: any, offset: number): number {
        console.error(`empty sys.drawTextureElements = ${renderContext}, ${data}, ${offset}`);
        return 0;
    }

    /**
     * Measure the width of text.
     * @param context 
     * @param text 
     */
    export function measureTextWith(context: CanvasRenderingContext2D, text: string): number {
        console.error(`empty sys.measureTextWith = ${context}, ${text}`);
        return 0;
    }

    /**
     * Create a canvas for CanvasRenderBuffer.
     * @param defaultFunc 
     * @param width 
     * @param height 
     * @param root 
     */
    export function createCanvasRenderBufferSurface(defaultFunc: (width?: number, height?: number) => HTMLCanvasElement, width?: number, height?: number, root?: boolean): HTMLCanvasElement {
        console.error(`empty sys.createCanvasRenderBufferSurface = ${width}, ${height}`);
        return null;
    }

    /**
     * Change the size of the rendering buffer and clear the buffer.
     * @param renderContext 
     * @param width 
     * @param height 
     * @param useMaxSize 
     */
    export function resizeCanvasRenderBuffer(renderContext: RenderContext, width: number, height: number, useMaxSize?: boolean): void {
        console.error(`empty sys.resizeContext = ${renderContext}, ${width}, ${height}, ${useMaxSize}`);
    }
}