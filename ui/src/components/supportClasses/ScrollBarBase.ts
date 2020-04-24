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

/// <reference path="../Component.ts" />

namespace eui
{
    /**
     * The ScrollBarBase class helps to position the portion of data that is displayed
     * when there is too much data to fit in a display area.
     * The ScrollBarBase class displays a pair of viewport and a thumb.
     * Viewport is a instance that implements IViewport.
     *
     * @see eui.IViewport
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     */
    export class ScrollBarBase extends Component
    {
        /**
         * Constructor.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public constructor() {
            super();
        }

        /**
         * [SkinPart] Thumb display object.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public thumb:eui.UIComponent = null;

        /**
         * @private
         */
        $viewport:IViewport = null;

        /**
         * The viewport controlled by this scrollbar.
         *
         * If a viewport is specified, then changes to its actual size, content size,
         * and scroll position cause the corresponding ScrollBarBase methods to run:
         * * *onViewportResize()*
         * * *onPropertyChanged()*
         *
         * The VScrollBar and HScrollBar classes override these methods to keep their
         * properties in sync with the viewport.
         * @default null
         * @see eui.VScrollBar
         * @see eui.HScrollBar
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public get viewport():IViewport {
            return this.$viewport;
        }

        public set viewport(value:IViewport) {
            if (value == this.$viewport) {
                return;
            }
            let viewport = this.$viewport;
            if (viewport)
            {
                viewport.removeEventListener(eui.PropertyEvent.PROPERTY_CHANGE, this.onPropertyChanged,this);
                viewport.removeEventListener(egret.Event.RESIZE, this.onViewportResize,this);
            }
            this.$viewport = value;
            if (value)
            {
                value.addEventListener(eui.PropertyEvent.PROPERTY_CHANGE, this.onPropertyChanged,this);
                value.addEventListener(egret.Event.RESIZE, this.onViewportResize,this);
            }
            this.invalidateDisplayList();
        }

        /**
         * @private
         * @param event
         */
        private onViewportResize(event?:egret.Event):void{
            this.invalidateDisplayList();
        }

        /**
         * Properties of viewport changed.
         * @param event
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        protected onPropertyChanged(event:eui.PropertyEvent):void{
        }

        /**
         * Whether the scrollbar can be autohide.
         * @version Egret 3.0.2
         * @version eui 1.0
         * @platform Web,Native
         */
        public autoVisibility:boolean = true;
    }
}