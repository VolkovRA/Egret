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

/// <reference path="../utils/registerProperty.ts" />
/// <reference path="../utils/registerBindable.ts" />

namespace eui
{
    /**
     * The ArrayCollection class is a wrapper class that exposes an *any[]* as a collection that can be
     * accessed and manipulated using the methods and properties of the *ICollection* interfaces.
     * ArrayCollection can notify the view to update item when data source changed.
     *
     * @event eui.CollectionEvent.COLLECTION_CHANGE Dispatched when the ArrayCollection has been updated in some way.
     *
     * @defaultProperty source
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @includeExample extension/eui/collections/ArrayCollectionExample.ts
     */
    export class ArrayCollection extends egret.EventDispatcher implements ICollection
    {
        /**
         * Constructor.
         * Creates a new ArrayCollection using the specified source array.
         * If no array is specified an empty array will be used.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public constructor(source?:any[]) {
            super();
            if (source) {
                this._source = source;
            }
            else {
                this._source = [];
            }
        }

        /**
         * @private
         */
        private _source:any[];

        /**
         * The source of data in the ArrayCollection.
         * The ArrayCollection object does not represent any changes that you make directly to the source array.
         * Always use the ICollection methods to view the collection.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public get source():any[] {
            return this._source;
        }

        public set source(value:any[]) {
            if (!value)
                value = [];
            this._source = value;
            this.dispatchCoEvent(CollectionEventKind.RESET);
        }

        /**
         * Applies the sort and filter to the view.
         * The ArrayCollection does not detect source data changes automatically, so you must call the *refresh()*
         * method to update the view after changing the source data.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public refresh():void {
            this.dispatchCoEvent(CollectionEventKind.REFRESH);
        }

        //--------------------------------------------------------------------------
        //
        // ICollection interface implementation method
        //
        //--------------------------------------------------------------------------

        /**
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public get length():number {
            return this._source.length;
        }

        /**
         * Adds the specified item to the end of the list.
         * Equivalent to *addItemAt(item, length)*.
         * @param item The item to add.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public addItem(item:any):void {
            this._source.push(item);
            this.dispatchCoEvent(CollectionEventKind.ADD, this._source.length - 1, -1, [item]);
        }

        /**
         * Adds the item at the specified index.
         * The index of any item greater than the index of the added item is increased by one.
         * If the the specified index is less than zero or greater than the length of the list, a Error which code is 1007 is thrown.
         * @param item The item to place at the index.
         * @param index The index at which to place the item.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public addItemAt(item:any, index:number):void {
            if (index < 0 || index > this._source.length) {
                DEBUG && egret.$error(1007);
            }
            this._source.splice(index, 0, item);
            this.dispatchCoEvent(CollectionEventKind.ADD, index, -1, [item]);
        }

        /**
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public getItemAt(index:number):any {
            return this._source[index];
        }

        /**
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public getItemIndex(item:any):number {
            let length:number = this._source.length;
            for (let i:number = 0; i < length; i++) {
                if (this._source[i] === item) {
                    return i;
                }
            }
            return -1;
        }

        /**
         * Notifies the view that an item has been updated.
         * @param item The item within the view that was updated.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 通知视图，某个项目的属性已更新。
         * @param item 视图中需要被更新的项。
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        public itemUpdated(item:any):void {
            let index:number = this.getItemIndex(item);
            if (index != -1) {
                this.dispatchCoEvent(CollectionEventKind.UPDATE, index, -1, [item]);
            }
        }

        /**
         * Removes all items from the list.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 删除列表中的所有项目。
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        public removeAll():void {
            let items:any[] = this._source.concat();
            this._source = [];
            this.dispatchCoEvent(CollectionEventKind.REMOVE, 0, -1, items);
        }

        /**
         * Removes the item at the specified index and returns it.
         * Any items that were after this index are now one index earlier.
         * @param index The index from which to remove the item.
         * @return The item that was removed.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 删除指定索引处的项目并返回该项目。原先位于此索引之后的所有项目的索引现在都向前移动一个位置。
         * @param index 要被移除的项的索引。
         * @return 被移除的项。
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        public removeItemAt(index:number):any {
            if (index < 0 || index >= this._source.length) {
                DEBUG && egret.$error(1007);
                return;
            }
            let item:any = this._source.splice(index, 1)[0];
            this.dispatchCoEvent(CollectionEventKind.REMOVE, index, -1, [item]);
            return item;
        }

        /**
         * Replaces the item at the specified index.
         * @param item The new item to be placed at the specified index.
         * @param index The index at which to place the item.
         * @return The item that was replaced, or *null* if none.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public replaceItemAt(item:any, index:number):any {
            if (index < 0 || index >= this._source.length) {
                DEBUG && egret.$error(1007);
                return;
            }
            let oldItem:any = this._source.splice(index, 1, item)[0];
            this.dispatchCoEvent(CollectionEventKind.REPLACE, index, -1, [item], [oldItem]);
            return oldItem;
        }

        /**
         * Replaces all items with a new source data, this method can not reset the scroller position of view.
         * @param newSource new source data.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public replaceAll(newSource:any[]):void {
            if (!newSource)
                newSource = [];
            let newLength = newSource.length;
            let oldLength = this._source.length;
            for (let i = newLength; i < oldLength; i++) {
                this.removeItemAt(newLength);
            }
            for (let i = 0; i < newLength; i++) {
                if (i >= oldLength)
                    this.addItemAt(newSource[i], i);
                else
                    this.replaceItemAt(newSource[i], i);
            }
            this._source = newSource;
        }

        /**
         * @private
         * Throw event
         */
        private dispatchCoEvent(kind:string, location?:number, oldLocation?:number, items?:any[], oldItems?:any[]):void {

            CollectionEvent.dispatchCollectionEvent(this, CollectionEvent.COLLECTION_CHANGE, kind, location, oldLocation, items, oldItems);
        }
    }

    registerProperty(ArrayCollection,"source","Array",true);
}