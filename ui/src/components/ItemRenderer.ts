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

/// <reference path="Component.ts" />
/// <reference path="../utils/registerBindable.ts" />

namespace eui
{
    /**
     * The ItemRenderer class is the base class for item renderers.
     * @state up Up state.
     * @state down Down state.
     * @state upAndSelected Up state when the button is selected.
     * @state downAndSelected Down state when the button is selected.
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @includeExample extension/eui/components/ItemRendererExample.ts
     */
    export class ItemRenderer extends Component implements IItemRenderer
    {
        /**
         * Constructor.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public constructor() {
            super();
            this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegin, this);
        }

        /**
         * @private
         */
        private _data: any = null;

        /**
         * The data to render or edit.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public get data(): any {
            return this._data;
        }

        public set data(value: any) {
            this._data = value;
            PropertyEvent.dispatchPropertyEvent(this, PropertyEvent.PROPERTY_CHANGE, "data");
            this.dataChanged();
        }

        /**
         * Update the view when the *data* property changes.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        protected dataChanged(): void {

        }

        /**
         * @private
         */
        private _selected: boolean = false;

        /**
         * Contains *true* if the item renderer can show itself as selected.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public get selected(): boolean {
            return this._selected;
        }

        public set selected(value: boolean) {
            if (this._selected == value)
                return;
            
            this._selected = value;
            this.invalidateState();
        }

        /**
         * The index of the item in the data provider of the host component of the item renderer.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public itemIndex: number = -1;

        /**
         * @private
         * Indicates whether the touch point is on the button when TouchEvent.TOUCH_BEGIN is dispatched for the first time.
         */
        private touchCaptured: boolean = false;

        /**
         * Dispatched when an event of some kind occurred that canceled the touch.
         * @version Egret 3.0.1
         * @version eui 1.0
         * @platform Web,Native
         */
        protected onTouchCancle(event: egret.TouchEvent): void {
            this.touchCaptured = false;
            let stage = event.$currentTarget;
            stage.removeEventListener(egret.TouchEvent.TOUCH_CANCEL, this.onTouchCancle, this);
            stage.removeEventListener(egret.TouchEvent.TOUCH_END, this.onStageTouchEnd, this);
            this.invalidateState();
        }

        /**
         * Handles *TouchEvent.TOUCH_BEGIN* events.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        protected onTouchBegin(event: egret.TouchEvent): void {
            if(!this.$stage) {
                return;
            }
            this.$stage.addEventListener(egret.TouchEvent.TOUCH_CANCEL, this.onTouchCancle, this);
            this.$stage.addEventListener(egret.TouchEvent.TOUCH_END, this.onStageTouchEnd, this);
            this.touchCaptured = true;
            this.invalidateState();
            event.updateAfterEvent();
        }

        /**
         * @private
         * Touch up event on stage.
         */
        private onStageTouchEnd(event: egret.Event): void {
            let stage = event.$currentTarget;
            stage.removeEventListener(egret.TouchEvent.TOUCH_CANCEL, this.onTouchCancle, this);
            stage.removeEventListener(egret.TouchEvent.TOUCH_END, this.onStageTouchEnd, this);
            this.touchCaptured = false;
            this.invalidateState();
        }

        /**
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        protected getCurrentState(): string {
            let state = "up";
            if (!this.enabled) {
                state = "disabled";
            }
            if (this.touchCaptured) {
                state = "down";
            }
            if (this._selected) {
                let selectedState = state + "AndSelected";
                let skin = this.skin;
                if (skin && skin.hasState(selectedState)) {
                    return selectedState;
                }
                return state == "disabled" ? "disabled" : "down";
            }
            return state;
        }
    }

    registerBindable(ItemRenderer.prototype, "data");
}