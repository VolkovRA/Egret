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

/// <reference path="ToggleButton.ts" />

namespace eui
{
    /**
     * @private
     * Store RadioButtonGroup list automatically created according to groupName.
     */
    let automaticRadioButtonGroups = {};

    /**
     * The RadioButton component allows the user make a single choice
     * within a set of mutually exclusive choices.
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @includeExample extension/eui/components/RadioButtonExample.ts
     */
    export class RadioButton extends ToggleButton
    {
        /**
         * Constructor.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public constructor() {
            super();
            this.groupName = "radioGroup";
        }

        /**
         * @private
         * Index in RadioButtonGroup.
         */
        $indexNumber:number = 0;

        /**
         * @private
         * RadioButtonGroup.
         */
        $radioButtonGroup:RadioButtonGroup = null;

        /**
         * The RadioButton component is enabled if the RadioButtonGroup is enabled and the RadioButton itself is enabled.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public get enabled():boolean {
            if (!this.$Component[sys.ComponentKeys.enabled]) {
                return false;
            }
            return !this.$radioButtonGroup ||
                this.$radioButtonGroup.$enabled;
        }

        public set enabled(value:boolean) {
            this.$setEnabled(value);
        }

        /**
         * @private
         */
        private _group:RadioButtonGroup = null;

        /**
         * The RadioButtonGroup component to which this RadioButton belongs.
         * If this property is not set, a unique RadioButtonGroup is created automatically based on the groupName property.
         * @see eui.RadioButton#groupName
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public get group():RadioButtonGroup {
            if (!this._group && this._groupName) {
                let g:RadioButtonGroup = automaticRadioButtonGroups[this._groupName];
                if (!g) {
                    g = new RadioButtonGroup();
                    g.$name = this._groupName;
                    automaticRadioButtonGroups[this._groupName] = g;
                }
                this._group = g;
            }
            return this._group;
        }

        public set group(value:RadioButtonGroup) {
            if (this._group == value)
                return;
            if (this.$radioButtonGroup)
                this.$radioButtonGroup.$removeInstance(this, false);
            this._group = value;
            this._groupName = value ? this.group.$name : "radioGroup";
            this.groupChanged = true;

            this.invalidateProperties();
            this.invalidateDisplayList();
        }

        /**
         * @private
         */
        private groupChanged:boolean = false;

        /**
         * @private
         */
        private _groupName:string = "radioGroup";

        /**
         * Specifies the name of the group to which this RadioButton component belongs.
         * @default “radioGroup”
         * @see eui.RadioButton#group
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public get groupName():string {
            return this._groupName;
        }

        public set groupName(value:string) {
            if (!value || value == "")
                return;
            this._groupName = value;
            if (this.$radioButtonGroup)
                this.$radioButtonGroup.$removeInstance(this, false);
            
            this._group = null;
            this.groupChanged = true;
            this.invalidateProperties();
            this.invalidateDisplayList();
        }

        /**
         * @private
         * @param value 
         */
        $setSelected(value:boolean):boolean{
            let result:boolean = super.$setSelected(value);
            this.invalidateDisplayList();

            return result;
        }

        /**
         * @private
         */
        private _value:any = null;

        /**
         * Optional user-defined value that is associated with a RadioButton component.
         * @default null
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public get value():any {
            return this._value;
        }

        public set value(value:any) {
            if (this._value == value)
                return;

            this._value = value;

            if (this.$selected && this.group){
                PropertyEvent.dispatchPropertyEvent(this.group,PropertyEvent.PROPERTY_CHANGE,"selectedValue");
            }
        }

        /**
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        protected commitProperties():void {
            if (this.groupChanged) {
                this.addToGroup();
                this.groupChanged = false;
            }
            super.commitProperties();
        }

        /**
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        protected updateDisplayList(unscaledWidth:number, unscaledHeight:number):void {
            super.updateDisplayList(unscaledWidth, unscaledHeight);
            if (this.group) {
                if (this.$selected)
                    this._group.$setSelection(this, false);
                else if (this.group.selection == this)
                    this._group.$setSelection(null, false);
            }
        }

        /**
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        protected buttonReleased():void {
            if (!this.enabled || this.selected)
                return;
            if (!this.$radioButtonGroup)
                this.addToGroup();
            super.buttonReleased();
            this.group.$setSelection(this, true);
        }

        /**
         * @private
         * Add this radio button to the group.
         */
        private addToGroup():RadioButtonGroup {
            let g:RadioButtonGroup = this.group;
            if (g)
                g.$addInstance(this);
            return g;
        }
    }
}