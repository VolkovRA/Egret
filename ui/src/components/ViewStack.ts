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
     * An ViewStack navigator container consists of a collection of child
     * containers stacked on top of each other, where only one child
     * at a time is visible.
     * 
     * When a different child container is selected, it seems to replace
     * the old one because it appears in the same location.
     * However, the old child container still exists; it is just invisible.
     *
     * @event eui.CollectionEvent.COLLECTION_CHANGE Dispatched when the ICollection has been updated in some way.
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @includeExample extension/eui/components/ViewStackExample.ts
     */
    export class ViewStack extends Group implements ICollection
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
         * The layout object for this container.
         * This object is responsible for the measurement and layout of the visual elements in the container.
         * @default eui.BasicLayout
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public get layout():LayoutBase {
            return this.$layout;
        }

        /**
         * @private
         */
        private _selectedChild:egret.DisplayObject = null;
        
        /**
         * A reference to the currently visible child container.
         * The default is a reference to the first child.
         * If there are no children, this property is *null*.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public get selectedChild():egret.DisplayObject {
            let index = this.selectedIndex;
            if (index >= 0 && index < this.numChildren)
                return this.getChildAt(index);
            
            return null;
        }

        public set selectedChild(value:egret.DisplayObject) {
            let index = this.getChildIndex(value);
            if (index >= 0 && index < this.numChildren)
                this.setSelectedIndex(index);
        }

        /**
         * @private
         * Cache selected item index before attribute submission.
         */
        private proposedSelectedIndex:number = ListBase.NO_PROPOSED_SELECTION;

        /**
         * @private
         */
        public _selectedIndex:number = -1;

        /**
         * The zero-based index of the currently visible child container.
         * Child indexes are in the range: 0, 1, 2, ..., n - 1,
         * where *n* is the number of children.
         * The default value is 0, corresponding to the first child.
         * If there are no children, the value of this property is *-1*.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public get selectedIndex():number {
            return this.proposedSelectedIndex != ListBase.NO_PROPOSED_SELECTION ? this.proposedSelectedIndex : this._selectedIndex;
        }

        public set selectedIndex(value:number) {
            value = +value|0;
            this.setSelectedIndex(value);
        }

        /**
         * @private
         * Set selected item index.
         */
        private setSelectedIndex(value:number):void {
            if (value == this.selectedIndex) {
                return;
            }
            this.proposedSelectedIndex = value;
            this.invalidateProperties();
            PropertyEvent.dispatchPropertyEvent(this,PropertyEvent.PROPERTY_CHANGE,"selectedIndex");
        }

        /**
         * @private
         * A child is added to the container.
         * This method will be called not only when the addChild () operation is operated, but also when
         * setChildIndex() or swapChildren is operated.
         * When the child index changes, the $ childRemoved () method will be triggered first, and then the
         * $childAdded() method will be triggered.
         */
        $childAdded(child:egret.DisplayObject, index:number):void {
            super.$childAdded(child, index);
            this.showOrHide(child, false);
            let selectedIndex = this.selectedIndex;
            if (selectedIndex == -1) {
                this.setSelectedIndex(index);
            }
            else if (index <= this.selectedIndex && this.$stage) {
                this.setSelectedIndex(selectedIndex + 1);
            }
            CollectionEvent.dispatchCollectionEvent(this, CollectionEvent.COLLECTION_CHANGE,
                CollectionEventKind.ADD, index, -1, [child.name]);
        }

        /**
         * @private
         * A child is removed from the container.
         * This method will be called back not only when removeChild () is operated, but also when
         * setChildIndex () or swapChildren is operated.
         * When the child index changes, the $ childRemoved () method will be triggered first,
         * and then the $ childAdded () method will be triggered.
         */
        $childRemoved(child:egret.DisplayObject, index:number):void {
            super.$childRemoved(child, index);
            this.showOrHide(child, true);
            let selectedIndex = this.selectedIndex;
            if (index == selectedIndex) {
                if (this.numChildren > 0) {
                    if (index == 0) {
                        this.proposedSelectedIndex = 0;
                        this.invalidateProperties();
                    }
                    else
                        this.setSelectedIndex(0);
                }
                else
                    this.setSelectedIndex(-1);
            }
            else if (index < selectedIndex) {
                this.setSelectedIndex(selectedIndex - 1);
            }
            CollectionEvent.dispatchCollectionEvent(this, CollectionEvent.COLLECTION_CHANGE,
                CollectionEventKind.REMOVE, index, -1, [child.name]);
        }

        /**
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        protected commitProperties():void {
            super.commitProperties();
            if (this.proposedSelectedIndex != ListBase.NO_PROPOSED_SELECTION) {
                this.commitSelection(this.proposedSelectedIndex);
                this.proposedSelectedIndex = ListBase.NO_PROPOSED_SELECTION;
            }
        }

        /**
         * @private
         * @param newIndex 
         */
        private commitSelection(newIndex:number):void {
            if (newIndex >= 0 && newIndex < this.numChildren) {
                this._selectedIndex = newIndex;
                if (this._selectedChild) {
                    this.showOrHide(this._selectedChild, false);
                }
                this._selectedChild = this.getElementAt(this._selectedIndex);
                this.showOrHide(this._selectedChild, true);
            }
            else {
                this._selectedChild = null;
                this._selectedIndex = -1;
            }
            this.invalidateSize();
            this.invalidateDisplayList();
        }

        /**
         * @private
         * @param child 
         * @param visible 
         */
        private showOrHide(child:egret.DisplayObject, visible:boolean):void {
            if (egret.is(child, "eui.UIComponent")) {
                (<eui.UIComponent><any>child).includeInLayout = visible;
            }
            child.visible = visible;
        }

        /**
         * Number of children.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public get length():number {
            return this.$children.length;
        }

        /**
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public getItemAt(index:number):any {
            let element:egret.DisplayObject = this.$children[index];
            return element ? element.name : "";
        }

        /**
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public getItemIndex(item:any):number {
            let list = this.$children;
            let length = list.length;
            for (let i = 0; i < length; i++) {
                if (list[i].name == item) {
                    return i;
                }
            }
            return -1;
        }
    }

    registerBindable(ViewStack.prototype,"selectedIndex");
}