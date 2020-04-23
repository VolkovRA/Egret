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
    let UIImpl = sys.UIComponentImpl;
    
    /**
     * Label is an UIComponent that can render one or more lines of text.
     * The text to be displayed is determined by the *text* property.
     * The formatting of the text is specified by the styles，
     * such as *fontFamily* and *size*.
     *
     * Because Label is fast and lightweight, it is especially suitable
     * for use cases that involve rendering many small pieces of non-interactive
     * text, such as item renderers and labels in Button skins.
     *
     * In Label, three character sequences are recognized
     * as explicit line breaks: CR (*"\r"*), LF (*"\n"*),
     * and CR+LF (*"\r\n"*).
     *
     * If you don't specify any kind of width for a Label,
     * then the longest line, as determined by these explicit line breaks,
     * determines the width of the Label.
     *
     * If you do specify some kind of width, then the specified text is
     * word-wrapped at the right edge of the component's bounds.
     * If the text extends below the bottom of the component,
     * it is clipped.
     *
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @includeExample extension/eui/components/LabelExample.ts
     */
    export class Label extends egret.TextField implements UIComponent, IDisplayText
    {
        /**
         * Constructor.
         * @param text The text displayed by this text component.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public constructor(text?:string) {
            super();
            this.initializeUIValues();
            this.text = text;
        }

        /**
         * Whether the attribute in the style is allowed to be assigned. When the attribute is actively assigned, it will not be assigned
         */
        private $styleSetMap =
        {
            "fontFamily": true,
            "size": true,
            "bold": true,
            "italic": true,
            "textAlign": true,
            "verticalAlign": true,
            "lineSpacing": true,
            "textColor": true,
            "wordWrap": true,
            "displayAsPassword": true,
            "strokeColor": true,
            "stroke": true,
            "maxChars": true,
            "multiline": true,
            "border": true,
            "borderColor": true,
            "background": true,
            "backgroundColor": true
        };

        private $revertStyle = {};

        private $style: string = null;

        private $changeFromStyle:boolean = false;

        /**
         * The style of text.
         * @version Egret 3.2.1
         * @platform Web,Native
         */
        public get style(): string {
            return this.$style;
        }

        public set style(value: string) {
            this.$setStyle(value);
        }

        $setStyle(value: string) {
            if (this.$style == value) {
                return;
            }
            this.$style = value;
            let theme: Theme = egret.getImplementation("eui.Theme");
            if (theme) {
                this.$changeFromStyle = true;
                for (let key in this.$revertStyle) {
                    this[key] = this.$revertStyle[key];
                }
                this.$revertStyle = {};
                if (value == null) {
                    this.$changeFromStyle = false;
                    return;
                }
                let styleList = value.split(",");
                for (let i = 0; i < styleList.length; i++) {
                    let config = theme.$getStyleConfig(styleList[i]);
                    if (config) {
                        for (let key in config) {
                            if (this.$styleSetMap[key]) {
                                let revertValue = this[key];
                                this[key] = config[key];
                                this.$revertStyle[key] = revertValue;
                            }
                        }
                    }
                }
                this.$changeFromStyle = false;
            }
        }

        $setFontFamily(value: string): boolean {
            if (!this.$changeFromStyle) {
                delete this.$revertStyle["fontFamily"];
                this.$styleSetMap["fontFamily"] = false;
            }
            return super.$setFontFamily(value);
        }

        $setSize(value: number): boolean {
            if (!this.$changeFromStyle) {
                delete this.$revertStyle["size"];
                this.$styleSetMap["size"] = false;
            }
            return super.$setSize(value);
        }

        $setBold(value: boolean): boolean {
            if (!this.$changeFromStyle) {
                delete this.$revertStyle["bold"];
                this.$styleSetMap["bold"] = false;
            }
            return super.$setBold(value);
        }

        $setItalic(value: boolean): boolean {
            if (!this.$changeFromStyle) {
                delete this.$revertStyle["italic"];
                this.$styleSetMap["italic"] = false;
            }
            return super.$setItalic(value);
        }

        $setTextAlign(value: string): boolean {
            if (!this.$changeFromStyle) {
                delete this.$revertStyle["textAlign"];
                this.$styleSetMap["textAlign"] = false;
            }
            return super.$setTextAlign(value);
        }

        $setVerticalAlign(value: string): boolean {
            if (!this.$changeFromStyle) {
                delete this.$revertStyle["verticalAlign"];
                this.$styleSetMap["verticalAlign"] = false;
            }
            return super.$setVerticalAlign(value);
        }

        $setLineSpacing(value: number): boolean {
            if (!this.$changeFromStyle) {
                delete this.$revertStyle["lineSpacing"];
                this.$styleSetMap["lineSpacing"] = false;
            }
            return super.$setLineSpacing(value);
        }

        $setTextColor(value: number): boolean {
            if (!this.$changeFromStyle) {
                delete this.$revertStyle["textColor"];
                this.$styleSetMap["textColor"] = false;
            }
            return super.$setTextColor(value);
        }

        $setWordWrap(value: boolean): void {
            if (!this.$changeFromStyle) {
                delete this.$revertStyle["wordWrap"];
                this.$styleSetMap["wordWrap"] = false;
            }
            super.$setWordWrap(value);
        }

        $setDisplayAsPassword(value: boolean): boolean {
            if (!this.$changeFromStyle) {
                delete this.$revertStyle["displayAsPassword"];
                this.$styleSetMap["displayAsPassword"] = false;
            }
            return super.$setDisplayAsPassword(value);
        }

        $setStrokeColor(value: number): boolean {
            if (!this.$changeFromStyle) {
                delete this.$revertStyle["strokeColor"];
                this.$styleSetMap["strokeColor"] = false;
            }
            return super.$setStrokeColor(value);
        }

        $setStroke(value: number): boolean {
            if (!this.$changeFromStyle) {
                delete this.$revertStyle["stroke"];
                this.$styleSetMap["stroke"] = false;
            }
            return super.$setStroke(value);
        }

        $setMaxChars(value: number): boolean {
            if (!this.$changeFromStyle) {
                delete this.$revertStyle["maxChars"];
                this.$styleSetMap["maxChars"] = false;
            }
            return super.$setMaxChars(value);
        }

        $setMultiline(value: boolean): boolean {
            if (!this.$changeFromStyle) {
                delete this.$revertStyle["multiline"];
                this.$styleSetMap["multiline"] = false;
            }
            return super.$setMultiline(value);
        }

        $setBorder(value: boolean): void {
            if (!this.$changeFromStyle) {
                delete this.$revertStyle["border"];
                this.$styleSetMap["border"] = false;
            }
            super.$setBorder(value);
        }

        $setBorderColor(value: number): void {
            if (!this.$changeFromStyle) {
                delete this.$revertStyle["borderColor"];
                this.$styleSetMap["borderColor"] = false;
            }
            super.$setBorderColor(value);
        }

        $setBackground(value: boolean): void {
            if (!this.$changeFromStyle) {
                delete this.$revertStyle["background"];
                this.$styleSetMap["background"] = false;
            }
            super.$setBackground(value);
        }

        $setBackgroundColor(value: number): void {
            if (!this.$changeFromStyle) {
                delete this.$revertStyle["backgroundColor"];
                this.$styleSetMap["backgroundColor"] = false;
            }
            super.$setBackgroundColor(value);
        }

        /**
         * @private
         */
        $invalidateTextField():void {
            super.$invalidateTextField();
            this.invalidateSize();
        }

        /**
         * @private
         * @param value
         */
        $setWidth(value:number):boolean {
            let result1:boolean = super.$setWidth(value);
            let result2:boolean = UIImpl.prototype.$setWidth.call(this, value);
            return result1 && result2;
        }

        /**
         * @private
         * @param value
         */
        $setHeight(value:number):boolean {
            let result1:boolean = super.$setHeight(value);
            let result2:boolean = UIImpl.prototype.$setHeight.call(this, value);
            return result1 && result2;
        }

        /**
         * @private
         * @param value
         */
        $setText(value:string):boolean {
            let result:boolean = super.$setText(value);
            PropertyEvent.dispatchPropertyEvent(this, PropertyEvent.PROPERTY_CHANGE, "text");
            return result;
        }

        /**
         * @private
         */
        private _widthConstraint:number = NaN;

        //=======================UIComponent interface implementation===========================
        /**
         * @private
         * Please do not add any initial value to all variables defined by UIComponentImpl, they must be initialized here.
         */
        private initializeUIValues:()=>void;

        /**
         * @copy eui.UIComponent#createChildren
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        protected createChildren():void {
        }

        /**
         * @copy eui.UIComponent#childrenCreated
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        protected childrenCreated():void {
        }

        /**
         * @copy eui.UIComponent#commitProperties
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        protected commitProperties():void {
        }

        /**
         * @copy eui.UIComponent#measure
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        protected measure():void {
            let values = this.$UIComponent;
            let textValues = this.$TextField;
            let oldWidth = textValues[egret.sys.TextKeys.textFieldWidth];
            let availableWidth = NaN;
            if (!isNaN(this._widthConstraint)) {
                availableWidth = this._widthConstraint;
                this._widthConstraint = NaN;
            }
            else if (!isNaN(values[sys.UIKeys.explicitWidth])) {
                availableWidth = values[sys.UIKeys.explicitWidth];
            }
            else if (values[sys.UIKeys.maxWidth] != 100000) {
                availableWidth = values[sys.UIKeys.maxWidth];
            }

            super.$setWidth(availableWidth);
            this.setMeasuredSize(this.textWidth, this.textHeight);
            super.$setWidth(oldWidth);
        }

        /**
         * @copy eui.UIComponent#updateDisplayList
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        protected updateDisplayList(unscaledWidth:number, unscaledHeight:number):void {
            super.$setWidth(unscaledWidth);
            super.$setHeight(unscaledHeight);
        }

        /**
         * @copy eui.UIComponent#invalidateParentLayout
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        protected invalidateParentLayout():void {
        }

        /**
         * @private
         */
        $UIComponent:Object;

        /**
         * @private
         */
        $includeInLayout:boolean;

        /**
         * @copy eui.UIComponent#includeInLayout
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public includeInLayout:boolean;

        /**
         * @copy eui.UIComponent#left
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public left:any;

        /**
         * @copy eui.UIComponent#right
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public right:any;

        /**
         * @copy eui.UIComponent#top
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public top:any;

        /**
         * @copy eui.UIComponent#bottom
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public bottom:any;

        /**
         * @copy eui.UIComponent#horizontalCenter
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public horizontalCenter:any;

        /**
         * @copy eui.UIComponent#verticalCenter
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public verticalCenter:any;

        /**
         * @copy eui.UIComponent#percentWidth
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public percentWidth:number;

        /**
         * @copy eui.UIComponent#percentHeight
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public percentHeight:number;

        /**
         * @copy eui.UIComponent#explicitWidth
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public explicitWidth:number;

        /**
         * @copy eui.UIComponent#explicitHeight
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public explicitHeight:number;

        /**
         * @copy eui.UIComponent#minWidth
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public minWidth:number;

        /**
         * @copy eui.UIComponent#maxWidth
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public maxWidth:number;

        /**
         * @copy eui.UIComponent#minHeight
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public minHeight:number;

        /**
         * @copy eui.UIComponent#maxHeight
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public maxHeight:number;

        /**
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public setMeasuredSize(width:number, height:number):void {
        }

        /**
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public invalidateProperties():void {
        }

        /**
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public validateProperties():void {
        }

        /**
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public invalidateSize():void {
        }

        /**
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public validateSize(recursive?:boolean):void {
        }

        /**
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public invalidateDisplayList():void {
        }

        /**
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public validateDisplayList():void {
        }

        /**
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public validateNow():void {
        }

        /**
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public setLayoutBoundsSize(layoutWidth:number, layoutHeight:number):void {
            UIImpl.prototype.setLayoutBoundsSize.call(this, layoutWidth, layoutHeight);
            if (isNaN(layoutWidth) || layoutWidth === this._widthConstraint || layoutWidth == 0) {
                this._widthConstraint = layoutWidth;
                return;
            }
            this._widthConstraint = layoutWidth;
            let values = this.$UIComponent;
            if (!isNaN(values[sys.UIKeys.explicitHeight])) {
                return;
            }
            if (layoutWidth == values[sys.UIKeys.measuredWidth]) {
                return;
            }
            this.invalidateSize();
        }

        /**
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public setLayoutBoundsPosition(x:number, y:number):void {
        }

        /**
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public getLayoutBounds(bounds:egret.Rectangle):void {
        }

        /**
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public getPreferredBounds(bounds:egret.Rectangle):void {
        }
    }

    sys.implementUIComponent(Label, egret.TextField);
    registerBindable(Label.prototype, "text");
}