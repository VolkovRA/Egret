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

namespace egret.sys
{
    /**
     * @private
     * Shared rendering buffer for collision detection.
     */
    export let customHitTestBuffer:sys.RenderBuffer;

    /**
     * @private
     * Shared rendering buffer for canvas collision detection.
     */
    export let canvasHitTestBuffer:sys.RenderBuffer;

    /**
     * @private
     * Render buffer.
     */
    export interface RenderBuffer
    {
        /**
         * 呈The canvas of the final drawing result.
         * @readOnly
         */
        surface:any;

        /**
         * Rendering context.
         * @readOnly
         */
        context:any;

        /**
         * The width of the rendering buffer, in pixels.
         * @readOnly
         */
        width: number;

        /**
         * The height of the rendering buffer, in pixels.
         * @readOnly
         */
        height: number;

        /**
         * Change the size of the rendering buffer and clear the buffer.
         * @param width Changed width.
         * @param height Changed height.
         * @param useMaxSize If true is passed, the changed size is compared with the existing size, and the larger size is retained.
         */
        resize(width:number,height:number,useMaxSize?:boolean):void;

        /**
         * Get the pixels of the specified area.
         */
        getPixels(x:number,y:number,width?:number,height?:number):number[];

        /**
         * Converted to base64 string, if the picture (or contained picture) cross domain, then return null.
         * @param type Conversion type, such as: "image/png", "image/jpeg".
         */
        toDataURL(type?: string, ...args: any[]): string;

        /**
         * Clear the buffer data.
         */
        clear():void;

        /**
         * Destroy the rendering buffer.
         */
        destroy():void;
    }

    /**
     * @private
     */
    export let RenderBuffer:
    {
        /**
         * Create a RenderTarget.
         * Note: If there is insufficient memory or the buffer creation fails, an error exception will be thrown.
         * @param width The initial width of the rendering buffer.
         * @param height The initial height of the rendering buffer.
         * @param root Is a stage buffer.
         */
        new(width?:number, height?:number, root?:boolean):RenderBuffer;
    };

    /**
     * @private
     */
    export let CanvasRenderBuffer:
    {
        /**
         * Create a CanvasRenderBuffer.
         * Note: If there is insufficient memory or the buffer creation fails, an error exception will be thrown.
         * @param width The initial width of the rendering buffer.
         * @param height The initial height of the rendering buffer.
         */
        new(width?:number, height?:number):RenderBuffer;
    };
}