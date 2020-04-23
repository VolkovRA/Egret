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
     * The List control displays a vertical or horizontal list of items.
     * The user can select one or more items from the list, depending
     * on the value of the *allowMultipleSelection* property.
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @includeExample extension/eui/components/ListExample.ts
     */
    export class List extends ListBase
    {
        /**
         * whether are allowed to multiple selection.
         * If *true* tap an unselected item will be selected, and tap the item again will cancel selection.
         * @default false
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public allowMultipleSelection:boolean = false;

        /**
         * @private
         */
        private _selectedIndices:number[] = [];

        /**
         * @private
         */
        private _proposedSelectedIndices:number[];

        /**
         * An Array of numbers representing the indices of the currently selected item or items.
         * @default []
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public get selectedIndices():number[] {
            if (this._proposedSelectedIndices)
                return this._proposedSelectedIndices;
            return this._selectedIndices;
        }

        public set selectedIndices(value:number[]) {
            this.setSelectedIndices(value, false);
        }

        /**
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public get selectedIndex():number {
            if (this._proposedSelectedIndices) {
                if (this._proposedSelectedIndices.length > 0)
                    return this._proposedSelectedIndices[0];
                return -1;
            }
            return this.$getSelectedIndex();
        }

        public set selectedIndex(value:number) {
            this.setSelectedIndex(value);
        }

        /**
         * An Array representing the currently selected data items.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public get selectedItems():any[] {
            let result:any[] = [];
            let list = this.selectedIndices;
            if (list) {
                let count = list.length;
                for (let i = 0; i < count; i++) {
                    result[i] = this.$dataProvider.getItemAt(list[i]);
                }
            }
            return result;
        }

        public set selectedItems(value:any[]) {
            let indices:number[] = [];

            if (value) {
                let count = value.length;

                for (let i = 0; i < count; i++) {
                    let index:number = this.$dataProvider.getItemIndex(value[i]);
                    if (index != -1) {
                        indices.splice(0, 0, index);
                    }
                    if (index == -1) {
                        indices = [];
                        break;
                    }
                }
            }
            this.setSelectedIndices(indices, false);
        }

        /**
         * Specify whether the selectedIndices changed programmatically or due to user interaction.
         * @param value An array of numbers representing the indices of the selected.
         * @param dispatchChangeEvent Whether dispatched a change event.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        protected setSelectedIndices(value:number[], dispatchChangeEvent?:boolean):void {
            let values = this.$ListBase;
            if (dispatchChangeEvent)
                values[sys.ListBaseKeys.dispatchChangeAfterSelection] =
                    (values[sys.ListBaseKeys.dispatchChangeAfterSelection] || dispatchChangeEvent);

            if (value)
                this._proposedSelectedIndices = value;
            else
                this._proposedSelectedIndices = [];
            this.invalidateProperties();
        }

        /**
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        protected commitProperties():void {
            super.commitProperties();
            if (this._proposedSelectedIndices) {
                this.commitSelection();
            }
        }

        /**
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        protected commitSelection(dispatchChangedEvents:boolean = true):boolean {
            let values = this.$ListBase;
            let oldSelectedIndex = values[sys.ListBaseKeys.selectedIndex];
            if (this._proposedSelectedIndices) {
                this._proposedSelectedIndices = this._proposedSelectedIndices.filter(this.isValidIndex);

                if (!this.allowMultipleSelection && this._proposedSelectedIndices.length > 0) {
                    let temp:number[] = [];
                    temp.push(this._proposedSelectedIndices[0]);
                    this._proposedSelectedIndices = temp;
                }
                if (this._proposedSelectedIndices.length > 0) {
                    values[sys.ListBaseKeys.proposedSelectedIndex] = this._proposedSelectedIndices[0];
                }
                else {
                    values[sys.ListBaseKeys.proposedSelectedIndex] = -1;
                }
            }

            let retVal = super.commitSelection(false);

            if (!retVal) {
                this._proposedSelectedIndices = null;
                return false;
            }

            let selectedIndex = this.$getSelectedIndex();
            if (selectedIndex > ListBase.NO_SELECTION) {
                if (this._proposedSelectedIndices) {
                    if (this._proposedSelectedIndices.indexOf(selectedIndex) == -1)
                        this._proposedSelectedIndices.push(selectedIndex);
                }
                else {
                    this._proposedSelectedIndices = [selectedIndex];
                }
            }

            if (this._proposedSelectedIndices) {
                if (this._proposedSelectedIndices.indexOf(oldSelectedIndex) != -1)
                    this.itemSelected(oldSelectedIndex, true);
                this.commitMultipleSelection();
            }

            if (dispatchChangedEvents && retVal) {
                if (values[sys.ListBaseKeys.dispatchChangeAfterSelection]) {
                    this.dispatchEventWith(egret.Event.CHANGE)
                    values[sys.ListBaseKeys.dispatchChangeAfterSelection] = false;
                }
                PropertyEvent.dispatchPropertyEvent(this,PropertyEvent.PROPERTY_CHANGE,"selectedIndex");
                PropertyEvent.dispatchPropertyEvent(this,PropertyEvent.PROPERTY_CHANGE,"selectedItem");
            }

            return retVal;
        }

        /**
         * @private
         * Is it a valid index.
         */
        private isValidIndex = (item:number, index:number, v:number[]):boolean => {
            return this.$dataProvider && (item >= 0) && (item < this.$dataProvider.length) && item % 1 == 0;
        }

        /**
         * Given a new selection interval, figure out which items are newly added/removed from the
         * selection interval and update selection properties and view accordingly.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        protected commitMultipleSelection():void {
            let removedItems:number[] = [];
            let addedItems:number[] = [];
            let i:number;
            let count:number;

            let selectedIndices = this._selectedIndices;
            let proposedSelectedIndices = this._proposedSelectedIndices;
            if (selectedIndices.length > 0 && proposedSelectedIndices.length > 0) {
                count = proposedSelectedIndices.length;
                for (i = 0; i < count; i++) {
                    if (selectedIndices.indexOf(proposedSelectedIndices[i]) == -1)
                        addedItems.push(proposedSelectedIndices[i]);
                }
                count = selectedIndices.length;
                for (i = 0; i < count; i++) {
                    if (proposedSelectedIndices.indexOf(selectedIndices[i]) == -1)
                        removedItems.push(selectedIndices[i]);
                }
            }
            else if (selectedIndices.length > 0) {
                removedItems = selectedIndices;
            }
            else if (proposedSelectedIndices.length > 0) {
                addedItems = proposedSelectedIndices;
            }

            this._selectedIndices = proposedSelectedIndices;

            if (removedItems.length > 0) {
                count = removedItems.length;
                for (i = 0; i < count; i++) {
                    this.itemSelected(removedItems[i], false);
                }
            }

            if (addedItems.length > 0) {
                count = addedItems.length;
                for (i = 0; i < count; i++) {
                    this.itemSelected(addedItems[i], true);
                }
            }

            this._proposedSelectedIndices = null;
        }

        /**
         * @private
         * @param index 
         * @returns 
         */
        $isItemIndexSelected(index:number):boolean {
            if (this.allowMultipleSelection)
                return this._selectedIndices.indexOf(index) != -1;
            return super.$isItemIndexSelected(index);
        }

        /**
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public dataProviderRefreshed():void {
            if (this.allowMultipleSelection) {
                return;
            }
            super.dataProviderRefreshed();
        }

        /**
         * @private
         * Calculate the current list of selected items.
         */
        private calculateSelectedIndices(index:number):number[] {
            let interval:number[] = [];
            let selectedIndices = this._selectedIndices;
            let length = selectedIndices.length;
            if (length > 0) {
                if (length == 1 && (selectedIndices[0] == index)) {
                    if (!this.$ListBase[sys.ListBaseKeys.requireSelection]) {
                        return interval;
                    }
                    interval.splice(0, 0, selectedIndices[0]);
                    return interval;
                }
                else {
                    let found = false;
                    for (let i = 0; i < length; i++) {
                        if (selectedIndices[i] == index) {
                            found = true;
                        }
                        else if (selectedIndices[i] != index) {
                            interval.splice(0, 0, selectedIndices[i]);
                        }
                    }
                    if (!found) {
                        interval.splice(0, 0, index);
                    }
                    return interval;
                }
            }
            else {
                interval.splice(0, 0, index);
                return interval;
            }
        }

        /**
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        protected onRendererTouchEnd(event:egret.TouchEvent):void {
            if (this.allowMultipleSelection) {
                let itemRenderer = <IItemRenderer> (event.currentTarget);
                let touchDownItemRenderer = this.$ListBase[sys.ListBaseKeys.touchDownItemRenderer];
                if (itemRenderer != touchDownItemRenderer)
                    return;
                this.setSelectedIndices(this.calculateSelectedIndices(itemRenderer.itemIndex), true);
                ItemTapEvent.dispatchItemTapEvent(this, ItemTapEvent.ITEM_TAP, itemRenderer);
            }
            else {
                super.onRendererTouchEnd(event);
            }
        }
    }
}