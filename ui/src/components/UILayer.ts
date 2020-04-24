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

/// <reference path="Group.ts" />

namespace eui
{
    /**
     * The UILayer class is the subclass of the Group class.
     * It not only has the standard function of the Group class, but also can keep its size the same to
     * the stage size (Stage.stageWidth,Stage.stageHeight). Its size will changes as the stage size changes.
     * like any normal container class,you can create multiple instance of the UILayer class, but it is usually
     * used as the root of the UI display list.
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     */
    export class UILayer extends Group
    {
        /**
         * Constructor.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public constructor(){
            super();
            this.addEventListener(egret.Event.ADDED_TO_STAGE,this.onAddToStage,this);
            this.addEventListener(egret.Event.REMOVED_FROM_STAGE,this.onRemoveFromStage,this);
        }

        /**
         * @private
         * Add to stage.
         */
        private onAddToStage(event?:egret.Event):void{
            this.$stage.addEventListener(egret.Event.RESIZE,this.onResize,this);
            this.onResize();
        }

        /**
         * @private
         * Remove from stage.
         */
        private onRemoveFromStage(event:egret.Event):void{
            this.$stage.removeEventListener(egret.Event.RESIZE,this.onResize,this);
        }

        /**
         * @private
         * Stage size change.
         */
        private onResize(event?:egret.Event):void{
            let stage = this.$stage;
            this.$setWidth(stage.$stageWidth);
            this.$setHeight(stage.$stageHeight);
        }
    }
}