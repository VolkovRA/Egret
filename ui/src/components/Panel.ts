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
     * The Panel class defines a container that includes a title bar,
     * a closeButton, a moveArea, and a content area for its children.
     * @event eui.UIEvent.CLOSING Dispatched when the close button is taped
     * you can use *event.preventDefault()* to prevent close.
     * @defaultProperty elementsContent
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @includeExample extension/eui/components/PanelExample.ts
     */
    export class Panel extends Component
    {
        /**
         * Constructor.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public constructor() {
            super();
            this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onWindowTouchBegin, this, false, 100);
        }

        /**
         * @private
         * Front window when pressed on the form.
         */
        private onWindowTouchBegin(event:egret.TouchEvent):void {
            this.$parent.addChild(this);
        }

        /**
         * Write-only property, this property is Usually invoked in resolving an EXML for adding multiple children quickly.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public set elementsContent(value:egret.DisplayObject[]) {
            if (value) {
                let length = value.length;
                for (let i = 0; i < length; i++) {
                    this.addChild(value[i]);
                }
            }
        }

        /**
         * The skin part that defines the appearance of the close button.
         * When taped, the close button dispatches a *closing* event.
         * @skinPart
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public closeButton:Button = null;

        /**
         * The area where the user must drag to move the window.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public moveArea:egret.DisplayObject = null;

        /**
         * The skin part that defines the appearance of the title text in the container.
         * @skinPart
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public titleDisplay:IDisplayText = null;

        /**
         * @private
         */
        private _title:string = "";

        /**
         * Title or caption displayed in the title bar.
         * @default ""
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public get title():string {
            return this._title;
        }

        public set title(value:string) {
            this._title = value;
            if (this.titleDisplay)
                this.titleDisplay.text = this.title;
        }

        /**
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        protected partAdded(partName:string, instance:any):void {
            super.partAdded(partName, instance);
            if (instance == this.titleDisplay) {
                this.titleDisplay.text = this._title;
            }
            else if (instance == this.moveArea) {
                this.moveArea.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegin, this);
            }
            else if (instance == this.closeButton) {
                this.closeButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onCloseButtonClick, this);
            }
        }

        /**
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        protected partRemoved(partName:string, instance:any):void {
            super.partRemoved(partName, instance);
            if (instance == this.moveArea) {
                this.moveArea.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegin, this);
            }
            else if (instance == this.closeButton) {
                this.closeButton.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onCloseButtonClick, this);
            }
        }

        /**
         * Dispatch the "closing" event when the closeButton is clicked.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        protected onCloseButtonClick(event:egret.TouchEvent):void {
            if (UIEvent.dispatchUIEvent(this, UIEvent.CLOSING, true, true)) {
                this.close();
            }
        }

        /**
         * Close the panel and remove from the parent container.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public close():void {
            if (!this.$parent) {
                return;
            }
            this.$parent.removeChild(this);
        }

        /**
         * @private
         * Offset when touch is pressed.
         */
        private offsetPointX:number = 0;

        /**
         * @private
         */
        private offsetPointY:number = 0;

        /**
         * Called when the user starts dragging a Panel.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        protected onTouchBegin(event:egret.TouchEvent):void {
            this.$includeInLayout = false;
            this.offsetPointX = this.x - event.$stageX;
            this.offsetPointY = this.y - event.$stageY;
            this.$stage.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMove, this);
            this.$stage.addEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEnd, this);
        }

        /**
         * Called when the user drags a Panel.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        protected onTouchMove(event:egret.TouchEvent):void {
            this.x = event.$stageX + this.offsetPointX;
            this.y = event.$stageY + this.offsetPointY;
        }

        /**
         * Called when the user releases the Panel.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        protected onTouchEnd(event:egret.TouchEvent):void {
            let stage = event.$currentTarget;
            stage.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMove, this);
            stage.removeEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEnd, this);
        }
    }

    registerProperty(Panel, "elementsContent", "Array", true);
}