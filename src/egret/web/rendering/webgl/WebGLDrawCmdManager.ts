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

/// <reference path="../../../filters/Filter.ts" />

namespace egret.web 
{
    /**
     * @private
     * Draw type, all drawing operations will be cached in drawData, each drawData is a drawable object.
     * The $ renderWebGL method calls different drawing methods according to the type of drawable object.
     */
    export const enum DRAWABLE_TYPE
    {
        TEXTURE,
        RECT,
        PUSH_MASK,
        POP_MASK,
        BLEND,
        RESIZE_TARGET,
        CLEAR_COLOR,
        ACT_BUFFER,
        ENABLE_SCISSOR,
        DISABLE_SCISSOR,
        SMOOTHING
    }

    export interface IDrawData
    {
        type: number,
        count: number,
        texture: WebGLTexture,
        filter : Filter,
        // uv: any,
        value: string,
        buffer: WebGLRenderBuffer,
        width: number,
        height: number,
        textureWidth: number,
        textureHeight: number,
        smoothing: boolean,
        x: number,
        y: number,
    }

    /**
     * @private
     * Drawing instruction manager.
     * Used to maintain drawData array.
     */
    export class WebGLDrawCmdManager
    {
        /**
         * Array used to cache drawing commands.
         */
        public readonly drawData: IDrawData[] = [];

        public drawDataLen = 0;

        public constructor() {

        }

        /**
         * Press in the draw rectangle command.
         */
        public pushDrawRect():void {
            if(this.drawDataLen == 0 || this.drawData[this.drawDataLen - 1].type != DRAWABLE_TYPE.RECT) {
                let data = this.drawData[this.drawDataLen] || <IDrawData>{};
                data.type = DRAWABLE_TYPE.RECT;
                data.count = 0;
                this.drawData[this.drawDataLen] = data;
                this.drawDataLen++;
            }
            this.drawData[this.drawDataLen - 1].count += 2;
        }

        /**
         * Push in the draw texture command.
         */
        public pushDrawTexture(texture:any, count:number = 2, filter?:any, textureWidth?:number, textureHeight?:number):void {
            if(filter) {
                // If there is a filter, it will not be drawn together.
                let data = this.drawData[this.drawDataLen] || <IDrawData>{};
                data.type = DRAWABLE_TYPE.TEXTURE;
                data.texture = texture;
                data.filter = filter;
                data.count = count;
                data.textureWidth = textureWidth;
                data.textureHeight = textureHeight;
                this.drawData[this.drawDataLen] = data;
                this.drawDataLen++;
            }
            else {
                if (this.drawDataLen == 0 || this.drawData[this.drawDataLen - 1].type != DRAWABLE_TYPE.TEXTURE || texture != this.drawData[this.drawDataLen - 1].texture || this.drawData[this.drawDataLen - 1].filter) {
                    let data = this.drawData[this.drawDataLen] || <IDrawData>{};
                    data.type = DRAWABLE_TYPE.TEXTURE;
                    data.texture = texture;
                    data.count = 0;
                    this.drawData[this.drawDataLen] = data;
                    this.drawDataLen++;
                }
                this.drawData[this.drawDataLen - 1].count += count;

            }
        }

        public pushChangeSmoothing(texture:WebGLTexture, smoothing:boolean):void {
            texture["smoothing"] = smoothing;
            let data = this.drawData[this.drawDataLen] || <IDrawData>{};
            data.type = DRAWABLE_TYPE.SMOOTHING;
            data.texture = texture;
            data.smoothing = smoothing;
            this.drawData[this.drawDataLen] = data;
            this.drawDataLen++;
        }

        /**
         * Push the pushMask instruction.
         */
        public pushPushMask(count:number = 1):void {
            let data = this.drawData[this.drawDataLen] || <IDrawData>{};
            data.type = DRAWABLE_TYPE.PUSH_MASK;
            data.count = count * 2;
            this.drawData[this.drawDataLen] = data;
            this.drawDataLen++;
        }

        /**
         * Push the popMask instruction.
         */
        public pushPopMask(count:number = 1):void {
            let data = this.drawData[this.drawDataLen] || <IDrawData>{};
            data.type = DRAWABLE_TYPE.POP_MASK;
            data.count = count * 2;
            this.drawData[this.drawDataLen] = data;
            this.drawDataLen++;
        }

        /**
         * Press the color mixing instruction.
         */
        public pushSetBlend(value:string):void {
            let len = this.drawDataLen;
            // Have you traversed to an effective drawing operation.
            let drawState = false;
            for (let i = len - 1; i >= 0; i--) {
                let data = this.drawData[i];

                if (data){
                    if(data.type == DRAWABLE_TYPE.TEXTURE || data.type == DRAWABLE_TYPE.RECT) {
                        drawState = true;
                    }

                    // If there is no valid drawing with the last blend operation, the last operation is invalid.
                    if (!drawState && data.type == DRAWABLE_TYPE.BLEND) {
                        this.drawData.splice(i, 1);
                        this.drawDataLen--;
                        continue;
                    }

                    // If repeated with the last blend operation, this operation is invalid.
                    if (data.type == DRAWABLE_TYPE.BLEND) {
                        if (data.value == value) {
                            return;
                        }
                        else {
                            break;
                        }
                    }
                }
            }

            let _data = this.drawData[this.drawDataLen] || <IDrawData>{};
            _data.type = DRAWABLE_TYPE.BLEND;
            _data.value = value;
            this.drawData[this.drawDataLen] = _data;
            this.drawDataLen++;
        }

        /**
         * Press the resize render target command.
         */
        public pushResize(buffer:WebGLRenderBuffer, width:number, height:number) {
            let data = this.drawData[this.drawDataLen] || <IDrawData>{};
            data.type = DRAWABLE_TYPE.RESIZE_TARGET;
            data.buffer = buffer;
            data.width = width;
            data.height = height;
            this.drawData[this.drawDataLen] = data;
            this.drawDataLen++;
        }

        /**
         * Press the clear color command.
         */
        public pushClearColor() {
            let data = this.drawData[this.drawDataLen] || <IDrawData>{};
            data.type = DRAWABLE_TYPE.CLEAR_COLOR;
            this.drawData[this.drawDataLen] = data;
            this.drawDataLen++;
        }

        /**
         * Push the activate buffer command.
         */
        public pushActivateBuffer(buffer:WebGLRenderBuffer) {
            let len = this.drawDataLen;
            // Have you traversed to an effective drawing operation.
            let drawState = false;
            for(let i = len - 1; i >= 0; i--) {
                let data = this.drawData[i];

                if(data){
                    if(data.type != DRAWABLE_TYPE.BLEND && data.type != DRAWABLE_TYPE.ACT_BUFFER) {
                        drawState = true;
                    }

                    // If there is no valid drawing with the last buffer operation, the last operation is invalid.
                    if(!drawState && data.type == DRAWABLE_TYPE.ACT_BUFFER) {
                        this.drawData.splice(i, 1);
                        this.drawDataLen--;
                        continue;
                    }

                    // If it is repeated with the last buffer operation, this operation is invalid.
                    // if(data.type == DRAWABLE_TYPE.ACT_BUFFER) {
                    //     if(data.buffer == buffer) {
                    //         return;
                    //     } else {
                    //         break;
                    //     }
                    // }
                }
            }

            let _data = this.drawData[this.drawDataLen] || <IDrawData>{};
            _data.type = DRAWABLE_TYPE.ACT_BUFFER;
            _data.buffer = buffer;
            _data.width = buffer.rootRenderTarget.width;
            _data.height = buffer.rootRenderTarget.height;
            this.drawData[this.drawDataLen] = _data;
            this.drawDataLen++;
        }

        /**
         * Press the enabel scissor command.
         */
        public pushEnableScissor(x:number, y:number, width:number, height:number) {
            let data = this.drawData[this.drawDataLen] || <IDrawData>{};
            data.type = DRAWABLE_TYPE.ENABLE_SCISSOR;
            data.x = x;
            data.y = y;
            data.width = width;
            data.height = height;
            this.drawData[this.drawDataLen] = data;
            this.drawDataLen++;
        }

        /**
         * Press the disable scissor command.
         */
        public pushDisableScissor() {
            let data = this.drawData[this.drawDataLen] || <IDrawData>{};
            data.type = DRAWABLE_TYPE.DISABLE_SCISSOR;
            this.drawData[this.drawDataLen] = data;
            this.drawDataLen++;
        }

        /**
         * Clear command array.
         */
        public clear():void {
            for(let i = 0; i < this.drawDataLen; i++) {
                let data = this.drawData[i];
                data.type = 0;
                data.count = 0;
                data.texture = null;
                data.filter = null;
                //data.uv = null;
                data.value = "";
                data.buffer = null;
                data.width = 0;
                data.height = 0;
                data.textureWidth = 0;
                data.textureHeight = 0;
                data.smoothing = false;
                data.x = 0;
                data.y = 0;
            }
            this.drawDataLen = 0;
        }
    }
}