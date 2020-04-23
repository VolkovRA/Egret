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

namespace eui.sys
{
    /**
     * @private
     * Failure Verification Manager.
     */
    export class Validator extends egret.EventDispatcher
    {
        /**
         * @private
         * Create a Validator object.
         */
        public constructor() {
            super();
        }

        /**
         * @private
         */
        private targetLevel:number = Number.POSITIVE_INFINITY;

        /**
         * @private
         */
        private invalidatePropertiesFlag:boolean = false;

        /**
         * @private
         */
        private invalidateClientPropertiesFlag:boolean = false;

        /**
         * @private
         */
        private invalidatePropertiesQueue:DepthQueue = new DepthQueue();

        /**
         * @private
         * Mark component component invalid.
         */
        public invalidateProperties(client:UIComponent):void {
            if (!this.invalidatePropertiesFlag) {
                this.invalidatePropertiesFlag = true;
                if (!this.listenersAttached)
                    this.attachListeners();
            }
            if (this.targetLevel <= client.$nestLevel)
                this.invalidateClientPropertiesFlag = true;
            this.invalidatePropertiesQueue.insert(client);
        }

        /**
         * @private
         * Verify invalid attributes.
         */
        private validateProperties():void {
            let queue = this.invalidatePropertiesQueue;
            let client:UIComponent = queue.shift();
            while (client) {
                if (client.$stage) {
                    client.validateProperties();
                }
                client = queue.shift();
            }
            if (queue.isEmpty())
                this.invalidatePropertiesFlag = false;
        }

        /**
         * @private
         */
        private invalidateSizeFlag:boolean = false;

        /**
         * @private
         */
        private invalidateClientSizeFlag:boolean = false;

        /**
         * @private
         */
        private invalidateSizeQueue:DepthQueue = new DepthQueue();

        /**
         * @private
         * The mark needs to be re-measured.
         */
        public invalidateSize(client:UIComponent):void {
            if (!this.invalidateSizeFlag) {
                this.invalidateSizeFlag = true;
                if (!this.listenersAttached)
                    this.attachListeners();
            }
            if (this.targetLevel <= client.$nestLevel)
                this.invalidateClientSizeFlag = true;
            this.invalidateSizeQueue.insert(client);
        }

        /**
         * @private
         * Measure size.
         */
        private validateSize():void {
            let queue = this.invalidateSizeQueue;
            let client:UIComponent = queue.pop();
            while (client) {
                if (client.$stage) {
                    client.validateSize();
                }
                client = queue.pop();
            }
            if (queue.isEmpty())
                this.invalidateSizeFlag = false;
        }

        /**
         * @private
         */
        private invalidateDisplayListFlag:boolean = false;

        /**
         * @private
         */
        private invalidateDisplayListQueue:DepthQueue = new DepthQueue();

        /**
         * @private
         * Tag needs to be re-layed.
         */
        public invalidateDisplayList(client:UIComponent):void {
            if (!this.invalidateDisplayListFlag) {
                this.invalidateDisplayListFlag = true;
                if (!this.listenersAttached)
                    this.attachListeners();
            }
            this.invalidateDisplayListQueue.insert(client);
        }

        /**
         * @private
         * Arrange again.
         */
        private validateDisplayList():void {
            let queue = this.invalidateDisplayListQueue;
            let client:UIComponent = queue.shift();
            while (client) {
                if (client.$stage) {
                    client.validateDisplayList();
                }
                client = queue.shift();
            }
            if (queue.isEmpty())
                this.invalidateDisplayListFlag = false;
        }

        /**
         * @private
         */
        private eventDisplay:egret.Bitmap = new egret.Bitmap();

        /**
         * @private
         * Whether event monitoring has been added.
         */
        private listenersAttached:boolean = false;

        /**
         * @private
         * Add event listener.
         */
        private attachListeners():void {
            this.eventDisplay.addEventListener(egret.Event.ENTER_FRAME, this.doPhasedInstantiationCallBack, this);
            this.eventDisplay.addEventListener(egret.Event.RENDER, this.doPhasedInstantiationCallBack, this);
            egret.sys.$invalidateRenderFlag = true;
            this.listenersAttached = true;
        }

        /**
         * @private
         * Perform attribute application.
         */
        private doPhasedInstantiationCallBack(event?:egret.Event):void {
            this.eventDisplay.removeEventListener(egret.Event.ENTER_FRAME, this.doPhasedInstantiationCallBack, this);
            this.eventDisplay.removeEventListener(egret.Event.RENDER, this.doPhasedInstantiationCallBack, this);
            this.doPhasedInstantiation();
        }

        /**
         * @private
         */
        private doPhasedInstantiation():void {
            if (this.invalidatePropertiesFlag) {
                this.validateProperties();
            }
            if (this.invalidateSizeFlag) {
                this.validateSize();
            }

            if (this.invalidateDisplayListFlag) {
                this.validateDisplayList();
            }

            if (this.invalidatePropertiesFlag ||
                this.invalidateSizeFlag ||
                this.invalidateDisplayListFlag) {
                this.attachListeners();
            }
            else {
                this.listenersAttached = false;
            }
        }

        /**
         * @private
         * Make elements greater than or equal to the specified component level apply attributes immediately.
         * @param target The component to which the attribute is applied immediately.
         */
        public validateClient(target:UIComponent):void {

            let obj:UIComponent;
            let done = false;
            let oldTargetLevel = this.targetLevel;

            if (this.targetLevel === Number.POSITIVE_INFINITY)
                this.targetLevel = target.$nestLevel;

            let propertiesQueue = this.invalidatePropertiesQueue;
            let sizeQueue = this.invalidateSizeQueue;
            let displayListQueue = this.invalidateDisplayListQueue;
            while (!done) {
                done = true;

                obj = propertiesQueue.removeSmallestChild(target);
                while (obj) {
                    if (obj.$stage) {
                        obj.validateProperties();
                    }
                    obj = propertiesQueue.removeSmallestChild(target);
                }

                if (propertiesQueue.isEmpty()) {
                    this.invalidatePropertiesFlag = false;
                }
                this.invalidateClientPropertiesFlag = false;

                obj = sizeQueue.removeLargestChild(target);
                while (obj) {
                    if (obj.$stage) {
                        obj.validateSize();
                    }
                    if (this.invalidateClientPropertiesFlag) {
                        obj = <UIComponent> (propertiesQueue.removeSmallestChild(target));
                        if (obj) {
                            propertiesQueue.insert(obj);
                            done = false;
                            break;
                        }
                    }

                    obj = sizeQueue.removeLargestChild(target);
                }

                if (sizeQueue.isEmpty()) {
                    this.invalidateSizeFlag = false;
                }
                this.invalidateClientPropertiesFlag = false;
                this.invalidateClientSizeFlag = false;

                obj = displayListQueue.removeSmallestChild(target);
                while (obj) {
                    if (obj.$stage) {
                        obj.validateDisplayList();
                    }
                    if (this.invalidateClientPropertiesFlag) {
                        obj = propertiesQueue.removeSmallestChild(target);
                        if (obj) {
                            propertiesQueue.insert(obj);
                            done = false;
                            break;
                        }
                    }

                    if (this.invalidateClientSizeFlag) {
                        obj =sizeQueue.removeLargestChild(target);
                        if (obj) {
                            sizeQueue.insert(obj);
                            done = false;
                            break;
                        }
                    }

                    obj = displayListQueue.removeSmallestChild(target);
                }


                if (displayListQueue.isEmpty()) {
                    this.invalidateDisplayListFlag = false;
                }
            }

            if (oldTargetLevel === Number.POSITIVE_INFINITY) {
                this.targetLevel = Number.POSITIVE_INFINITY;
            }
        }
    }

    /**
     * @private
     * Display list nesting depth sort queue.
     */
    class DepthQueue
    {
        /**
         * Deep queue.
         */
        private depthBins:{[key:number]:DepthBin} = {};

        /**
         * Minimum depth.
         */
        private minDepth:number = 0;

        /**
         * Maximum depth.
         */
        private maxDepth:number = -1;

        /**
         * Insert an element.
         */
        public insert(client:UIComponent):void {
            let depth = client.$nestLevel;
            if (this.maxDepth < this.minDepth) {
                this.minDepth = this.maxDepth = depth;
            }
            else {
                if (depth < this.minDepth)
                    this.minDepth = depth;
                if (depth > this.maxDepth)
                    this.maxDepth = depth;
            }

            let bin = this.depthBins[depth];

            if (!bin) {
                bin = this.depthBins[depth] = new DepthBin();
            }
            bin.insert(client);
        }

        /**
         * Pops an object with the greatest depth from the end of the queue.
         */
        public pop():UIComponent {
            let client:UIComponent;

            let minDepth = this.minDepth;
            if (minDepth <= this.maxDepth) {
                let bin = this.depthBins[this.maxDepth];
                while (!bin || bin.length === 0) {
                    this.maxDepth--;
                    if (this.maxDepth < minDepth)
                        return null;
                    bin = this.depthBins[this.maxDepth];
                }

                client = bin.pop();

                while (!bin || bin.length == 0) {
                    this.maxDepth--;
                    if (this.maxDepth < minDepth)
                        break;
                    bin = this.depthBins[this.maxDepth];
                }

            }

            return client;
        }

        /**
         * Pop an object with the smallest depth from the head of the queue.
         */
        public shift():UIComponent {
            let client:UIComponent;

            let maxDepth = this.maxDepth;
            if (this.minDepth <= maxDepth) {
                let bin = this.depthBins[this.minDepth];
                while (!bin || bin.length === 0) {
                    this.minDepth++;
                    if (this.minDepth > maxDepth)
                        return null;

                    bin = this.depthBins[this.minDepth];
                }

                client = bin.pop();

                while (!bin || bin.length == 0) {
                    this.minDepth++;
                    if (this.minDepth > maxDepth)
                        break;
                    bin = this.depthBins[this.minDepth];
                }
            }

            return client;
        }

        /**
         * Remove the largest element from the level greater than or equal to the specified component level.
         */
        public removeLargestChild(client:UIComponent):UIComponent {
            let hashCode = client.$hashCode;
            let nestLevel = client.$nestLevel;
            let max = this.maxDepth;
            let min = nestLevel;

            while (min <= max) {
                let bin = this.depthBins[max];
                if (bin && bin.length > 0) {
                    if (max === nestLevel) {
                        if (bin.map[hashCode]) {
                            bin.remove(client);
                            return client;
                        }
                    }
                    else if(egret.is(client,"egret.DisplayObjectContainer")){

                        let items = bin.items;
                        let length = bin.length;
                        for (let i = 0; i < length; i++) {
                            let value = items[i];
                            if ((<egret.DisplayObjectContainer><any> client).contains(value)) {
                                bin.remove(value);
                                return value;
                            }
                        }
                    }
                    else{
                        break;
                    }
                    max--;
                }
                else {
                    if (max == this.maxDepth){
                        this.maxDepth--;
                    }
                    max--;
                    if (max < min)
                        break;
                }
            }

            return null;
        }

        /**
         * Remove the smallest element from the elements greater than or equal to the specified component level.
         */
        public removeSmallestChild(client:UIComponent):UIComponent {
            let nestLevel = client.$nestLevel;
            let min = nestLevel;
            let max = this.maxDepth;
            let hashCode = client.$hashCode;
            while (min <= max) {
                let bin = this.depthBins[min];
                if (bin && bin.length > 0) {
                    if (min === nestLevel) {
                        if (bin.map[hashCode]) {
                            bin.remove(client);
                            return client;
                        }
                    }
                    else if(egret.is(client,"egret.DisplayObjectContainer")){
                        let items = bin.items;
                        let length = bin.length;
                        for (let i = 0; i < length; i++) {
                            let value = items[i];
                            if ((<egret.DisplayObjectContainer><any> client).contains(value)) {
                                bin.remove(value);
                                return value;
                            }
                        }
                    }
                    else{
                        break;
                    }

                    min++;
                }
                else {
                    if (min == this.minDepth)
                        this.minDepth++;
                    min++;
                    if (min > max)
                        break;
                }
            }

            return null;
        }

        /**
         * Whether the queue is empty.
         */
        public isEmpty():boolean {
            return this.minDepth > this.maxDepth;
        }
    }

    /**
     * @private
     * List item.
     */
    class DepthBin {
        public map:{[key:number]:boolean} = {};
        public items:UIComponent[] = [];
        public length:number = 0;

        public insert(client:UIComponent):void {
            let hashCode = client.$hashCode;
            if (this.map[hashCode]) {
                return;
            }
            this.map[hashCode] = true;
            this.length++;
            this.items.push(client);
        }

        public pop():UIComponent {
            let client = this.items.pop(); // Using pop will have higher performance than shift, avoiding the overall reset of the index.
            if (client) {
                this.length--;
                if(this.length===0){
                    this.map = {}; // Clear all keys to prevent memory leaks.
                }
                else{
                    this.map[client.$hashCode] = false;
                }
            }
            return client;
        }

        public remove(client:UIComponent):void {
            let index = this.items.indexOf(client);
            if (index >= 0) {
                this.items.splice(index, 1);
                this.length--;
                if(this.length===0){
                    this.map = {}; // Clear all keys to prevent memory leaks.
                }
                else{
                    this.map[client.$hashCode] = false;
                }
            }
        }
    }
}