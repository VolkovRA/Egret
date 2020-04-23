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
    let groupCount:number = 0;

    /**
     * @private
     * Display list depth sort.
     */
    function breadthOrderCompare(a:egret.DisplayObject, b:egret.DisplayObject):number {
        let aParent = a.parent;
        let bParent = b.parent;

        if (!aParent || !bParent)
            return 0;

        let aNestLevel = a.$nestLevel;
        let bNestLevel = b.$nestLevel;

        let aIndex = 0;
        let bIndex = 0;

        if (aParent == bParent) {
            aIndex = aParent.getChildIndex(a);
            bIndex = bParent.getChildIndex(b);
        }

        if (aNestLevel > bNestLevel || aIndex > bIndex)
            return 1;
        if (aNestLevel < bNestLevel || bIndex > aIndex)
            return -1;
        if (a == b)
            return 0;
        return breadthOrderCompare(aParent, bParent);
    }

    /**
     * The RadioButtonGroup component defines a group of RadioButton components
     * that act as a single mutually exclusive component; therefore, a user can
     * select only one RadioButton component at a time.
     * @event egret.Event.CHANGE Dispatched when the value of the selected RadioButton component in
     * this group changes.
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @includeExample extension/eui/components/RadioButtonGroupExample.ts
     */
    export class RadioButtonGroup extends egret.EventDispatcher
    {
        /**
         * Constructor.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public constructor() {
            super();
            this.$name = "_radioButtonGroup" + groupCount++;
        }

        /**
         * @private
         * Group name.
         */
        $name:string = null;

        /**
         * @private
         * List of radio buttons.
         */
        private radioButtons:RadioButton[] = [];

        /**
         * Returns the RadioButton component at the specified index.
         * @param index The 0-based index of the RadioButton in the RadioButtonGroup.
         * @return The specified RadioButton component if index is between 0 and *numRadioButtons* - 1.
         * Returns *null* if the index is invalid.
         * @see eui.RadioButtonGroup#numRadioButtons
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public getRadioButtonAt(index:number):RadioButton {
            return this.radioButtons[index];
        }

        /**
         * @private
         */
        $enabled:boolean = true;

        /**
         * Determines whether selection is allowed.
         * Note that the value returned only reflects the value that was explicitly set on the
         * *RadioButtonGroup* and does not reflect any values explicitly set on the individual RadioButtons.
         * @default true
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public get enabled():boolean {
            return this.$enabled;
        }

        public set enabled(value:boolean) {
            value = !!value;
            if (this.$enabled === value)
                return;
            this.$enabled = value;
            let buttons = this.radioButtons;
            let length = buttons.length;
            for (let i = 0; i < length; i++)
                buttons[i].invalidateState();
        }

        /**
         * The number of RadioButtons that belong to this RadioButtonGroup.
         * @default 0
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public get numRadioButtons():number {
            return this.radioButtons.length;
        }

        /**
         * @private
         */
        private _selectedValue:any = null;

        /**
         * The *value* property of the selected RadioButton component in the group:
         * * If it has been set, otherwise, the *label* property of the selected RadioButton.
         * * If no RadioButton is selected, this property is *null*.
         * * If you set *selectedValue*, selects the first RadioButton component whose *value* or *label* property matches this value.
         * @default null
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public get selectedValue():any {
            if (this.selection) {
                return this.selection.value != null ?
                    this.selection.value :
                    this.selection.label;
            }
            return null;
        }

        public set selectedValue(value:any) {
            this._selectedValue = value;
            if (value == null) {
                this.$setSelection(null, false);
                return;
            }
            let n = this.numRadioButtons;
            for (let i = 0; i < n; i++) {
                let radioButton = this.radioButtons[i];
                if (radioButton.value == value ||
                    radioButton.label == value) {
                    this.changeSelection(i, false);
                    this._selectedValue = null;
                    PropertyEvent.dispatchPropertyEvent(this,PropertyEvent.PROPERTY_CHANGE,"selectedValue");
                    break;
                }
            }
        }

        /**
         * @private
         */
        private _selection:RadioButton = null;

        /**
         * Contains a reference to the currently selected RadioButton component in the group.
         * This property is valid only when the target RadioButton is displayed on the display list.
         * @default null
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public get selection():RadioButton {
            return this._selection;
        }

        public set selection(value:RadioButton) {
            if (this._selection == value)
                return;
            this.$setSelection(value, false);
        }

        /**
         * @private
         * Add radio buttons to the group.
         */
        $addInstance(instance:RadioButton):void {
            instance.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.removedHandler, this);
            let buttons = this.radioButtons;
            buttons.push(instance);
            buttons.sort(breadthOrderCompare);
            let length = buttons.length;
            for (let i = 0; i < length; i++) {
                buttons[i].$indexNumber = i;
            }
            if (this._selectedValue)
                this.selectedValue = this._selectedValue;
            if (instance.selected == true)
                this.selection = instance;

            instance.$radioButtonGroup = this;
            instance.invalidateState();
        }

        /**
         * @private
         * Remove radio button from group.
         */
        $removeInstance(instance:RadioButton, addListener?:boolean):void {
            if (instance) {
                let foundInstance = false;
                let buttons = this.radioButtons;
                let length = buttons.length;
                for (let i = 0; i < length; i++) {
                    let rb = buttons[i];
                    if (foundInstance) {
                        rb.$indexNumber = rb.$indexNumber - 1;
                    }
                    else if (rb == instance) {
                        if (addListener)
                            instance.addEventListener(egret.Event.ADDED_TO_STAGE, this.addedHandler, this);
                        if (instance == this._selection)
                            this._selection = null;
                        instance.$radioButtonGroup = null;
                        instance.invalidateState();
                        this.radioButtons.splice(i, 1);
                        foundInstance = true;
                        i--;
                        length--;
                    }
                }
            }
        }

        /**
         * @private
         * Set the selected radio button.
         */
        $setSelection(value:RadioButton, fireChange?:boolean):boolean {
            if (this._selection == value)
                return false;

            if (!value) {
                if (this._selection) {
                    this._selection.selected = false;
                    this._selection = null;
                    if (fireChange)
                        this.dispatchEventWith(egret.Event.CHANGE);
                }
            }
            else {
                let n = this.numRadioButtons;
                for (let i = 0; i < n; i++) {
                    if (value == this.getRadioButtonAt(i)) {
                        this.changeSelection(i, fireChange);
                        break;
                    }
                }
            }
            PropertyEvent.dispatchPropertyEvent(this,PropertyEvent.PROPERTY_CHANGE,"selectedValue");
            return true;
        }

        /**
         * @private
         * Change the selected item.
         */
        private changeSelection(index:number, fireChange?:boolean):void {
            let rb = this.getRadioButtonAt(index);
            if (rb && rb != this._selection) {

                if (this._selection)
                    this._selection.selected = false;
                this._selection = rb;
                this._selection.selected = true;
                if (fireChange)
                    this.dispatchEventWith(egret.Event.CHANGE);
            }
        }

        /**
         * @private
         * Add radio button to display list.
         */
        private addedHandler(event:egret.Event):void {
            let rb:RadioButton = event.target;
            if (rb == event.currentTarget) {
                rb.removeEventListener(egret.Event.ADDED_TO_STAGE, this.addedHandler, this);
                this.$addInstance(rb);
            }
        }

        /**
         * @private
         * Radio button removed from display list.
         */
        private removedHandler(event:egret.Event):void {
            let rb:RadioButton = event.target;
            if (rb == event.currentTarget) {
                rb.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this.removedHandler, this);
                this.$removeInstance(rb, true);
            }
        }
    }
    
    registerBindable(RadioButtonGroup.prototype,"selectedValue");
}