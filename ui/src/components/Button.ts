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

namespace eui
{
    /**
     * The Button component is a commonly used rectangular button.
     * The Button component looks like it can be pressed.
     * The default skin has a text label and a icon display object.
     *
     * @event egret.TouchEvent.TOUCH_CANCEL Canceled the touch.
     * @state Up Button up state.
     * @state Down Button down state.
     * @state Disabled Button disabled state.
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @includeExample extension/eui/components/ButtonExample.ts
     */
    export class Button extends Component
    {
        /**
         * Constructor.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public constructor() {
            super();
            this.touchChildren = false;
            this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegin, this);
        }

        /**
         * [SkinPart] A skin part that defines the label of the button.
         * @skinPart
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public labelDisplay:IDisplayText = null;

        /**
         * @private
         */
        private _label:string = "";

        /**
         * Text to appear on the Button control.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public get label():string {
            return this._label;
        }

        public set label(value:string) {
            this._label = value;
            if (this.labelDisplay) {
                this.labelDisplay.text = value;
            }
        }

        /**
         * [SkinPart] A skin part that defines an optional icon for the button.
         * @skinPart
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public iconDisplay:Image = null;

        /**
         * @private
         */
        private _icon:string|egret.Texture = null;

        /**
         * Icon to appear on the Button control.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public get icon():string|egret.Texture {
            return this._icon;
        }

        public set icon(value:string|egret.Texture) {
            this._icon = value;
            if (this.iconDisplay) {
                this.iconDisplay.source = value;
            }
        }

        /**
         * @private
         * Indicates whether the touch point is on the button when TouchEvent.TOUCH_BEGIN is dispatched for the first time.
         */
        private touchCaptured:boolean = false;

        /**
         * This method handles the touchCancle events.
         * @param event The *egret.TouchEvent* object.
         * @version Egret 3.0.1
         * @version eui 1.0
         * @platform Web,Native
         */
        protected onTouchCancle(event:egret.TouchEvent):void {
            let stage = event.$currentTarget;
            stage.removeEventListener(egret.TouchEvent.TOUCH_CANCEL, this.onTouchCancle, this);
            stage.removeEventListener(egret.TouchEvent.TOUCH_END, this.onStageTouchEnd, this);
            this.touchCaptured = false;
            this.invalidateState();
        }

        /**
         * This method handles the touch events.
         * @param event The *egret.TouchEvent* object.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        protected onTouchBegin(event:egret.TouchEvent):void {
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
        private onStageTouchEnd(event:egret.Event):void {
            let stage = event.$currentTarget;
            stage.removeEventListener(egret.TouchEvent.TOUCH_CANCEL, this.onTouchCancle, this);
            stage.removeEventListener(egret.TouchEvent.TOUCH_END, this.onStageTouchEnd, this);
            if (this.contains(event.target)){
                this.buttonReleased();
            }
            this.touchCaptured = false;
            this.invalidateState();
        }

        /**
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        protected getCurrentState():string {
            if (!this.enabled)
                return "disabled";

            if (this.touchCaptured)
                return "down";

            return "up";
        }

        /**
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        protected partAdded(partName:string, instance:any):void {
            if (instance === this.labelDisplay) {
                this.labelDisplay.text = this._label;
            }
            else if (instance == this.iconDisplay) {
                this.iconDisplay.source = this._icon;
            }
        }

        /**
         * This method is called when handling a *egret.TouchEvent.TOUCH_END* event when the user touches on the button.
         * It is only called when the button is the target and when *touchCaptured* is *true*.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        protected buttonReleased():void {
        }
    }
}