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

/// <reference path="../display/DisplayObject.ts" />

namespace egret
{
    /**
     * The DisplayObjectContainer class is a basic display list building block: a display list node that can contain children.
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/display/DisplayObjectContainer.ts
     */
    export class DisplayObjectContainer extends DisplayObject
    {
        /**
         * @private
         */
        static $EVENT_ADD_TO_STAGE_LIST: DisplayObject[] = [];

        /**
         * @private
         */
        static $EVENT_REMOVE_FROM_STAGE_LIST: DisplayObject[] = [];

        /**
         * Creates a new DisplayObjectContainer instance.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public constructor() {
            super();
            this.$children = [];
        }

        /**
         * Returns the number of children of this object.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public get numChildren(): number {
            return this.$children.length;
        }

        /**
         * Set children sort mode.
         * @param value {string} The sort mode
         * @see egret.ChildrenSortMode
         * @version Egret 5.2.19
         * @platform Native
         */
        public setChildrenSortMode(value: string): void {
            if (egret.nativeRender && this.$nativeDisplayObject.setChildrenSortMode) {
                this.$nativeDisplayObject.setChildrenSortMode(value);
            }
        }

        /**
         * Adds a child DisplayObject instance to this DisplayObjectContainer instance. The child is added to the front
         * (top) of all other children in this DisplayObjectContainer instance. (To add a child to a specific index position,
         * use the addChildAt() method.)If you add a child object that already has a different display object container
         * as a parent, the object is removed from the child list of the other display object container.
         * @param child The DisplayObject instance to add as a child of this DisplayObjectContainer instance.
         * @returns In child The DisplayObject instance that you pass in the child parameter.
         * @see #addChildAt()
         * @version Egret 2.4
         * @platform Web,Native
         */
        public addChild(child: DisplayObject): DisplayObject {
            let index: number = this.$children.length;

            if (child.$parent == this)
                index--;
            
            return this.$doAddChild(child, index);
        }

        /**
         * Adds a child DisplayObject instance to this DisplayObjectContainer instance. The child is added at the index position
         * specified. An index of 0 represents the back (bottom) of the display list for this DisplayObjectContainer object.
         * If you add a child object that already has a different display object container as a parent, the object is removed
         * from the child list of the other display object container.
         * @param child The DisplayObject instance to add as a child of this DisplayObjectContainer instance.
         * @param index The index position to which the child is added. If you specify a currently occupied index position,
         * the child object that exists at that position and all higher positions are moved up one position in the child list.
         * @returns The DisplayObject instance that you pass in the child parameter.
         * @see #addChild()
         * @version Egret 2.4
         * @platform Web,Native
         */
        public addChildAt(child: DisplayObject, index: number): DisplayObject {
            index = +index | 0;
            if (index < 0 || index >= this.$children.length) {
                index = this.$children.length;
                if (child.$parent == this) {
                    index--;
                }
            }
            return this.$doAddChild(child, index);
        }

        /**
         * @private
         */
        $doAddChild(child: DisplayObject, index: number, notifyListeners: boolean = true): DisplayObject {
            let self = this;
            let host: DisplayObjectContainer = child.$parent;
            if (host == self) {
                self.doSetChildIndex(child, index);
                return child;
            }

            if (host) {
                host.removeChild(child);
            }

            self.$children.splice(index, 0, child);
            child.$setParent(self);
            if (egret.nativeRender) {
                self.$nativeDisplayObject.addChildAt(child.$nativeDisplayObject.id, index);
            }

            let stage: Stage = self.$stage;
            if (stage) {// The current container is on stage.
                child.$onAddToStage(stage, self.$nestLevel + 1);
            }
            if (notifyListeners) {
                child.dispatchEventWith(Event.ADDED, true);
            }
            if (stage) {
                let list = DisplayObjectContainer.$EVENT_ADD_TO_STAGE_LIST;
                while (list.length) {
                    let childAddToStage = list.shift();
                    if (childAddToStage.$stage && notifyListeners) {
                        childAddToStage.dispatchEventWith(Event.ADDED_TO_STAGE);
                    }
                }
            }
            if (!egret.nativeRender) {
                if (child.$maskedObject) {
                    child.$maskedObject.$updateRenderMode();
                }
                if (!self.$cacheDirty) {
                    self.$cacheDirty = true;
                    let p = self.$parent;
                    if (p && !p.$cacheDirty) {
                        p.$cacheDirty = true;
                        p.$cacheDirtyUp();
                    }
                    let maskedObject = self.$maskedObject;
                    if (maskedObject && !maskedObject.$cacheDirty) {
                        maskedObject.$cacheDirty = true;
                        maskedObject.$cacheDirtyUp();
                    }
                }
            }

            this.$childAdded(child, index);
            return child;
        }

        /**
         * Determines whether the specified display object is a child of the DisplayObjectContainer instance or the instance
         * itself. The search includes the entire display list including this DisplayObjectContainer instance. Grandchildren,
         * great-grandchildren, and so on each return true.
         * @param child The child object to test.
         * @returns true if the child object is a child of the DisplayObjectContainer or the container itself; otherwise false.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public contains(child: DisplayObject): boolean {
            while (child) {
                if (child == this) {
                    return true;
                }
                child = child.$parent;
            }
            return false;
        }

        /**
         * Returns the child display object instance that exists at the specified index.
         * @param index The index position of the child object.
         * @returns The child display object at the specified index position.
         * @see #getChildByName()
         * @version Egret 2.4
         * @platform Web,Native
         */
        public getChildAt(index: number): DisplayObject {
            index = +index | 0;
            if (index >= 0 && index < this.$children.length) {
                return this.$children[index];
            }

            return null;
        }

        /**
         * Returns the index position of a child DisplayObject instance.
         * @param child The DisplayObject instance to identify.
         * @returns The index position of the child display object to identify.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public getChildIndex(child: egret.DisplayObject): number {
            return this.$children.indexOf(child);
        }

        /**
         * Returns the child display object that exists with the specified name. If more that one child display object has
         * the specified name, the method returns the first object in the child list.The getChildAt() method is faster than
         * the getChildByName() method. The getChildAt() method accesses a child from a cached array, whereas the getChildByName()
         * method has to traverse a linked list to access a child.
         * @param name The name of the child to return.
         * @returns The child display object with the specified name.
         * @see #getChildAt()
         * @see egret.DisplayObject#name
         * @version Egret 2.4
         * @platform Web,Native
         */
        public getChildByName(name: string): DisplayObject {
            let children = this.$children;
            let length = children.length;
            let displayObject: DisplayObject;
            for (let i = 0; i < length; i++) {
                displayObject = children[i];
                if (displayObject.name == name) {
                    return displayObject;
                }
            }
            return null;
        }

        /**
         * Removes the specified child DisplayObject instance from the child list of the DisplayObjectContainer instance.
         * The parent property of the removed child is set to null , and the object is garbage collected if no other references
         * to the child exist. The index positions of any display objects above the child in the DisplayObjectContainer are
         * decreased by 1.
         * @param child The DisplayObject instance to remove.
         * @returns The DisplayObject instance that you pass in the child parameter.
         * @see #removeChildAt()
         * @version Egret 2.4
         * @platform Web,Native
         */
        public removeChild(child: DisplayObject): DisplayObject {
            let index = this.$children.indexOf(child);
            if (index >= 0) {
                return this.$doRemoveChild(index);
            }

            return null;
        }

        /**
         * Removes a child DisplayObject from the specified index position in the child list of the DisplayObjectContainer.
         * The parent property of the removed child is set to null, and the object is garbage collected if no other references
         * to the child exist. The index positions of any display objects above the child in the DisplayObjectContainer are decreased by 1.
         * @param index The child index of the DisplayObject to remove.
         * @returns The DisplayObject instance that was removed.
         * @see #removeChild()
         * @version Egret 2.4
         * @platform Web,Native
         */
        public removeChildAt(index: number): DisplayObject {
            index = +index | 0;
            if (index >= 0 && index < this.$children.length) {
                return this.$doRemoveChild(index);
            }

            return null;
        }

        /**
         * @private
         */
        $doRemoveChild(index: number, notifyListeners: boolean = true): DisplayObject {
            index = +index | 0;
            let self = this;
            let children = this.$children;
            let child: DisplayObject = children[index];
            this.$childRemoved(child, index);
            if (notifyListeners) {
                child.dispatchEventWith(Event.REMOVED, true);
            }
            if (this.$stage) { // On stage
                child.$onRemoveFromStage();
                let list = DisplayObjectContainer.$EVENT_REMOVE_FROM_STAGE_LIST
                while (list.length > 0) {
                    let childAddToStage = list.shift();
                    if (notifyListeners && childAddToStage.$hasAddToStage) {
                        childAddToStage.$hasAddToStage = false;
                        childAddToStage.dispatchEventWith(Event.REMOVED_FROM_STAGE);
                    }
                    childAddToStage.$hasAddToStage = false;
                    childAddToStage.$stage = null;
                }
            }
            let displayList = this.$displayList || this.$parentDisplayList;
            child.$setParent(null);
            let indexNow = children.indexOf(child);
            if (indexNow != -1) {
                children.splice(indexNow, 1);
            }
            if (egret.nativeRender) {
                self.$nativeDisplayObject.removeChild(child.$nativeDisplayObject.id);
            }
            else {
                if (child.$maskedObject) {
                    child.$maskedObject.$updateRenderMode();
                }
                if (!self.$cacheDirty) {
                    self.$cacheDirty = true;
                    let p = self.$parent;
                    if (p && !p.$cacheDirty) {
                        p.$cacheDirty = true;
                        p.$cacheDirtyUp();
                    }
                    let maskedObject = self.$maskedObject;
                    if (maskedObject && !maskedObject.$cacheDirty) {
                        maskedObject.$cacheDirty = true;
                        maskedObject.$cacheDirtyUp();
                    }
                }
            }
            return child;
        }

        /**
         * Changes the position of an existing child in the display object container. This affects the layering of child objects.
         * @param child The child DisplayObject instance for which you want to change the index number.
         * @param index The resulting index number for the child display object.
         * @see #addChildAt()
         * @see #getChildAt()
         * @version Egret 2.4
         * @platform Web,Native
         */
        public setChildIndex(child: DisplayObject, index: number): void {
            index = +index | 0;
            if (index < 0 || index >= this.$children.length) {
                index = this.$children.length - 1;
            }
            this.doSetChildIndex(child, index);
        }

        /**
         * @private
         */
        private doSetChildIndex(child: DisplayObject, index: number): void {
            let self = this;
            let lastIndex = this.$children.indexOf(child);
            if (lastIndex == index) {
                return;
            }
            this.$childRemoved(child, lastIndex);
            // Remove from original location.
            this.$children.splice(lastIndex, 1);
            // Put in a new location.
            this.$children.splice(index, 0, child);
            this.$childAdded(child, index);
            if (egret.nativeRender) {
                this.$nativeDisplayObject.removeChild(child.$nativeDisplayObject.id);
                this.$nativeDisplayObject.addChildAt(child.$nativeDisplayObject.id, index);
            }
            else {
                if (!self.$cacheDirty) {
                    self.$cacheDirty = true;
                    let p = self.$parent;
                    if (p && !p.$cacheDirty) {
                        p.$cacheDirty = true;
                        p.$cacheDirtyUp();
                    }
                    let maskedObject = self.$maskedObject;
                    if (maskedObject && !maskedObject.$cacheDirty) {
                        maskedObject.$cacheDirty = true;
                        maskedObject.$cacheDirtyUp();
                    }
                }
            }
        }

        /**
         * Swaps the z-order (front-to-back order) of the child objects at the two specified index positions in the child list.
         * All other child objects in the display object container remain in the same index positions.
         * @param index1 The index position of the first child object.
         * @param index2 The index position of the second child object.
         * @see #swapChildren()
         * @version Egret 2.4
         * @platform Web,Native
         */
        public swapChildrenAt(index1: number, index2: number): void {
            index1 = +index1 | 0;
            index2 = +index2 | 0;
            if (index1 >= 0 && index1 < this.$children.length && index2 >= 0 && index2 < this.$children.length) {
                this.doSwapChildrenAt(index1, index2);
            }
        }

        /**
         * Swaps the z-order (front-to-back order) of the two specified child objects.
         * All other child objects in the display object container remain in the same index positions.
         * @param child1 The first child object.
         * @param child2 The second child object.
         * @see #swapChildrenAt()
         * @version Egret 2.4
         * @platform Web,Native
         */
        public swapChildren(child1: DisplayObject, child2: DisplayObject): void {
            let index1 = this.$children.indexOf(child1);
            let index2 = this.$children.indexOf(child2);
            if (index1 == -1 || index2 == -1) {
                
            }
            else {
                this.doSwapChildrenAt(index1, index2);
            }
        }

        /**
         * @private
         */
        private doSwapChildrenAt(index1: number, index2: number): void {
            let self = this;
            if (index1 > index2) {
                let temp = index2;
                index2 = index1;
                index1 = temp;
            }
            else if (index1 == index2) {
                return;
            }
            let list: Array<DisplayObject> = this.$children;
            let child1: DisplayObject = list[index1];
            let child2: DisplayObject = list[index2];
            this.$childRemoved(child1, index1);
            this.$childRemoved(child2, index2);
            list[index1] = child2;
            list[index2] = child1;
            this.$childAdded(child2, index1);
            this.$childAdded(child1, index2);
            if (egret.nativeRender) {
                this.$nativeDisplayObject.swapChild(index1, index2);
            }
            else {
                if (!self.$cacheDirty) {
                    self.$cacheDirty = true;
                    let p = self.$parent;
                    if (p && !p.$cacheDirty) {
                        p.$cacheDirty = true;
                        p.$cacheDirtyUp();
                    }
                    let maskedObject = self.$maskedObject;
                    if (maskedObject && !maskedObject.$cacheDirty) {
                        maskedObject.$cacheDirty = true;
                        maskedObject.$cacheDirtyUp();
                    }
                }
            }
        }

        /**
         * Removes all child DisplayObject instances from the child list of the DisplayObjectContainer instance. The parent
         * property of the removed children is set to null , and the objects are garbage collected if no other references to the children exist.
         * @see #removeChild()
         * @see #removeChildAt()
         * @version Egret 2.4
         * @platform Web,Native
         */
        public removeChildren(): void {
            let children = this.$children;
            for (let i: number = children.length - 1; i >= 0; i--) {
                this.$doRemoveChild(i);
            }
        }

        /**
         * @private
         * A child is added to the container.
         * This method will be called not only when the addChild () operation is operated, but also when setChildIndex () or swapChildren is operated.
         * When the child index changes, the $ childRemoved () method will be triggered first, and then the $ childAdded () method will be triggered.
         */
        $childAdded(child: DisplayObject, index: number): void {

        }

        /**
         * @private
         * A child is removed from the container.
         * This method will be called not only when removeChild () is operated, but also when setChildIndex () or swapChildren is operated.
         * When the child index changes, the $ childRemoved () method will be triggered first, and then the $ childAdded () method will be triggered.
         */
        $childRemoved(child: DisplayObject, index: number): void {

        }

        /**
         * @private
         */
        $onAddToStage(stage: Stage, nestLevel: number): void {
            super.$onAddToStage(stage, nestLevel);
            let children = this.$children;
            let length = children.length;
            nestLevel++;
            for (let i = 0; i < length; i++) {
                let child: DisplayObject = this.$children[i];
                child.$onAddToStage(stage, nestLevel);
                if (child.$maskedObject) {
                    child.$maskedObject.$updateRenderMode();
                }
            }
        }

        /**
         * @private
         */
        $onRemoveFromStage(): void {
            super.$onRemoveFromStage();
            let children = this.$children;
            let length = children.length;
            for (let i = 0; i < length; i++) {
                let child: DisplayObject = children[i];
                child.$onRemoveFromStage();
            }
        }

        /**
         * @private
         */
        $measureChildBounds(bounds: Rectangle): void {
            let children = this.$children;
            let length = children.length;
            if (length == 0) {
                return;
            }
            let xMin = 0, xMax = 0, yMin = 0, yMax = 0;
            let found: boolean = false;
            for (let i = -1; i < length; i++) {
                let childBounds;
                if (i == -1) {
                    childBounds = bounds;
                }
                else {
                    children[i].getBounds($TempRectangle);
                    children[i].$getMatrix().$transformBounds($TempRectangle);
                    childBounds = $TempRectangle;
                }
                if (childBounds.isEmpty()) {
                    continue;
                }
                if (found) {
                    xMin = Math.min(xMin, childBounds.x)
                    xMax = Math.max(xMax, childBounds.x + childBounds.width);
                    yMin = Math.min(yMin, childBounds.y);
                    yMax = Math.max(yMax, childBounds.y + childBounds.height);
                }
                else {
                    found = true;
                    xMin = childBounds.x;
                    xMax = xMin + childBounds.width;
                    yMin = childBounds.y;
                    yMax = yMin + childBounds.height;
                }
            }
            bounds.setTo(xMin, yMin, xMax - xMin, yMax - yMin);
        }

        $touchChildren: boolean = true;

        /**
         * Determines whether or not the children of the object are touch, or user input device, enabled. If an object is
         * enabled, a user can interact with it by using a touch or user input device.
         * @default true
         * @version Egret 2.4
         * @platform Web,Native
         */
        public get touchChildren(): boolean {
            return this.$getTouchChildren();
        }

        /**
         * @private
         * @returns
         */
        $getTouchChildren(): boolean {
            return this.$touchChildren;
        }

        public set touchChildren(value: boolean) {
            this.$setTouchChildren(!!value);
        }

        /**
         * @private
         */
        $setTouchChildren(value: boolean): boolean {
            if (this.$touchChildren == value) {
                return false;
            }
            this.$touchChildren = value;
            return true;
        }

        /**
         * @private
         */
        $hitTest(stageX: number, stageY: number): DisplayObject {
            if (!this.$visible) {
                return null;
            }
            let m = this.$getInvertedConcatenatedMatrix();
            let localX = m.a * stageX + m.c * stageY + m.tx;
            let localY = m.b * stageX + m.d * stageY + m.ty;

            let rect = this.$scrollRect ? this.$scrollRect : this.$maskRect;
            if (rect && !rect.contains(localX, localY)) {
                return null;
            }

            if (this.$mask && !this.$mask.$hitTest(stageX, stageY)) {
                return null
            }
            const children = this.$children;
            let found = false;
            let target: DisplayObject = null;
            for (let i = children.length - 1; i >= 0; i--) {
                const child = children[i];
                if (child.$maskedObject) {
                    continue;
                }
                target = child.$hitTest(stageX, stageY);
                if (target) {
                    found = true;
                    if (target.$touchEnabled) {
                        break;
                    }
                    else {
                        target = null;
                    }
                }
            }
            if (target) {
                if (this.$touchChildren) {
                    return target;
                }
                return this;
            }
            if (found) {
                return this;
            }
            return super.$hitTest(stageX, stageY);
        }
        private _sortChildrenFunc(a: DisplayObject, b: DisplayObject): number {
            if (a.zIndex === b.zIndex) {
                return a.$lastSortedIndex - b.$lastSortedIndex;
            }
            return a.zIndex - b.zIndex;
        }
        public sortChildren(): void {
            // Turn off dirty marks.
            super.sortChildren();
            this.$sortDirty = false;
            // Ready to reorder.
            let sortRequired = false;
            const children = this.$children;
            let child: DisplayObject = null;
            for (let i = 0, j = children.length; i < j; ++i) {
                child = children[i];
                child.$lastSortedIndex = i;
                if (!sortRequired && child.zIndex !== 0) {
                    sortRequired = true;
                }
            }
            if (sortRequired && children.length > 1) {
                // Start row.
                children.sort(this._sortChildrenFunc);
            }
        }
    }
}