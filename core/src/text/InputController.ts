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

/// <reference path="StageText.ts" />
/// <reference path="TextField.ts" />
/// <reference path="../utils/HashObject.ts" />
/// <reference path="../events/TouchEvent.ts" />
/// <reference path="../events/FocusEvent.ts" />

namespace egret
{
    /**
     * @private
     * @version Egret 2.4
     * @platform Web,Native
     */
    export class InputController extends HashObject
    {
        /**
         * @private
         */
        public stageText: egret.StageText;

        /**
         * @private
         */
        private stageTextAdded: boolean = false;

        /**
         * @private
         */
        private _text: TextField = null;

        /**
         * @private
         */
        private _isFocus: boolean = false;

        /**
         * @version Egret 2.4
         * @platform Web,Native
         */
        public constructor() {
            super();
        }

        /**
         * 
         * @param text 
         * @version Egret 2.4
         * @platform Web,Native
         */
        public init(text: TextField): void {
            this._text = text;
            this.stageText = new egret.StageText();
            this.stageText.$setTextField(this._text);
        }
        
        /**
         * @private
         * 
         */
        public _addStageText(): void {
            if (this.stageTextAdded) {
                return;
            }
            if (!this._text.$inputEnabled) {
                this._text.$touchEnabled = true;
            }

            this.tempStage = this._text.stage;

            this.stageText.$addToStage();

            this.stageText.addEventListener("updateText", this.updateTextHandler, this);
            this._text.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onMouseDownHandler, this);
            this._text.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onMouseMoveHandler, this);

            this.stageText.addEventListener("blur", this.blurHandler, this);
            this.stageText.addEventListener("focus", this.focusHandler, this);

            this.stageTextAdded = true;
        }

        /**
         * @private
         */
        public _removeStageText(): void {
            if (!this.stageTextAdded) {
                return;
            }
            if (!this._text.$inputEnabled) {
                this._text.$touchEnabled = false;
            }

            this.stageText.$removeFromStage();

            this.stageText.removeEventListener("updateText", this.updateTextHandler, this);
            this._text.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onMouseDownHandler, this);
            this._text.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onMouseMoveHandler, this);
            this.tempStage.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onStageDownHandler, this);

            this.stageText.removeEventListener("blur", this.blurHandler, this);
            this.stageText.removeEventListener("focus", this.focusHandler, this);

            this.stageTextAdded = false;
        }

        /**
         * @private
         * @returns 
         */
        public _getText(): string {
            return this.stageText.$getText();
        }

        /**
         * @private
         * @param value 
         */
        public _setText(value: string) {
            this.stageText.$setText(value);
        }
        /**
         * @private
         */
        public _setColor(value: number) {
            this.stageText.$setColor(value);
        }

        /**
         * @private
         * @param event 
         */
        private focusHandler(event: Event): void {
            // The vertical line is no longer displayed, and the input box is displayed at the beginning.
            if (!this._isFocus) {
                this._isFocus = true;
                if (!event["showing"]) {
                    this._text.$setIsTyping(true);
                }

                this._text.dispatchEvent(new egret.FocusEvent(egret.FocusEvent.FOCUS_IN, true));
            }
        }

        /**
         * @private
         * @param event 
         */
        private blurHandler(event: Event): void {
            if (this._isFocus) {
                // The vertical line is no longer displayed, and the input box is displayed at the beginning.
                this._isFocus = false;
                this.tempStage.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onStageDownHandler, this);

                this._text.$setIsTyping(false);
                // Called after losing focus.
                this.stageText.$onBlur();

                this._text.dispatchEvent(new egret.FocusEvent(egret.FocusEvent.FOCUS_OUT, true));
            }
        }
        
        private tempStage: egret.Stage;

        // Click on the text
        private onMouseDownHandler(event: TouchEvent) {
            this.$onFocus();
        }

        private onMouseMoveHandler(event: TouchEvent) {
            this.stageText.$hide();
        }

        $onFocus(): void {
            let self = this;
            if (!this._text.visible) {
                return;
            }

            if (this._isFocus) {
                return;
            }

            this.tempStage.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onStageDownHandler, this);
            egret.callLater(() => {
                this.tempStage.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onStageDownHandler, this);
            }, this);

            if (egret.nativeRender) {
                this.stageText.$setText(this._text.$TextField[egret.sys.TextKeys.text]);
            }

            // Force update of input box position.
            this.stageText.$show();
        }

        // Unclicked text.
        private onStageDownHandler(event: TouchEvent) {
            if (event.$target != this._text) {
                this.stageText.$hide();
            }
        }
        
        /**
         * @private
         * @param event 
         */
        private updateTextHandler(event: Event): void {
            let values = this._text.$TextField;
            let textValue = this.stageText.$getText();
            let isChanged: boolean = false;
            let reg: RegExp;
            let result: string[];
            if (values[sys.TextKeys.restrictAnd] != null) { // Inner match.
                reg = new RegExp("[" + values[sys.TextKeys.restrictAnd] + "]", "g");
                result = textValue.match(reg);
                if (result) {
                    textValue = result.join("");
                }
                else {
                    textValue = "";
                }
                isChanged = true;
            }
            if (values[sys.TextKeys.restrictNot] != null) { // Outer match.
                reg = new RegExp("[^" + values[sys.TextKeys.restrictNot] + "]", "g");
                result = textValue.match(reg);
                if (result) {
                    textValue = result.join("");
                }
                else {
                    textValue = "";
                }
                isChanged = true;
            }

            if (isChanged && this.stageText.$getText() != textValue) {
                this.stageText.$setText(textValue);
            }
            this.resetText();

            // Throw change event.
            this._text.dispatchEvent(new egret.Event(egret.Event.CHANGE, true));
        }

        /**
         * @private
         */
        private resetText(): void {
            this._text.$setBaseText(this.stageText.$getText());
        }

        /**
         * @private
         */
        public _hideInput(): void {
            this.stageText.$removeFromStage();
        }

        /**
         * @private
         */
        private updateInput(): void {//
            if (!this._text.$visible && this.stageText) {
                this._hideInput();
            }
        }

        /**
         * @private
         */
        public _updateProperties(): void {
            if (this._isFocus) {
                // Overall modification.
                this.stageText.$resetStageText();
                this.updateInput();
                return;
            }

            this.stageText.$setText(this._text.$TextField[egret.sys.TextKeys.text]);

            // Overall modification.
            this.stageText.$resetStageText();

            this.updateInput();
        }
    }
}