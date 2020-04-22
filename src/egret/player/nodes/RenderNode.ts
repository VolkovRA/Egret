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
     * Render node type.
     */
    export const enum RenderNodeType
    {
        /**
         * Bitmap rendering node.
         */
        BitmapNode = 1,

        /**
         * Text rendering node.
         */
        TextNode,

        /**
         * Vector render node.
         */
        GraphicsNode,

        /**
         * Group Render Node.
         */
        GroupNode,
        
        /**
         * Mesh node.
         */
        MeshNode,

        /**
         * Ordinary bitmap rendering node.
         */
        NormalBitmapNode
    }

    /**
     * @private
     * Render node base class.
     */
    export class RenderNode
    {
        /**
         * Node type:..
         */
        public type:number = 0;
        
        /**
         * Plot data.
         */
        public drawData:any[] = [];

        /**
         * Drawing times.
         */
        protected renderCount:number = 0;
        
        /**
         * Before the $ updateRenderNode () method of the display object is called, it automatically clears its own drawData data.
         */
        public cleanBeforeRender():void{
            this.drawData.length = 0;
            this.renderCount = 0;
        }

        public $getRenderCount():number {
            return this.renderCount;
        }
    }
}