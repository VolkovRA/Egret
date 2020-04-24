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

/// <reference path="../utils/HashObject.ts" />
/// <reference path="IEventDispatcher.ts" />

namespace egret
{
    /**
     * @private
     */
    const enum Keys
    {
        eventTarget,
        eventsMap,
        captureEventsMap,
        notifyLevel
    }

    let ONCE_EVENT_LIST:egret.sys.EventBin[] = [];

    /**
     * The EventDispatcher class is the base class for all classes that dispatchEvent events.
     * The EventDispatcher class implements the IEventDispatcher interface and is the base class for the DisplayObject class.
     * The EventDispatcher class allows any object on the display list to be an event target and as such, to use the methods of
     * the IEventDispatcher interface. Event targets are an important part of the Egret event model. The event target serves as
     * the focal point for how events flow through the display list hierarchy. When an event such as a touch tap, Egret
     * dispatches an event object into the event flow from the root of the display list. The event object then makes its way
     * through the display list until it reaches the event target, at which point it begins its return trip through the display list.
     * 
     * This round-trip journey to the event target is conceptually divided into three phases:
     * 1. The capture phase comprises the journey from the root to the last node before the event target's node.
     * 2. The target phase comprises only the event target node.
     * 3. The bubbling phase comprises any subsequent nodes encountered on the return trip to the root of the display list.
     * 
     * In general, the easiest way for a user-defined class to gain event dispatching capabilities is to extend EventDispatcher.
     * If this is impossible (that is, if the class is already extending another class), you can instead implement the IEventDispatcher
     * interface, create an EventDispatcher member, and write simple hooks to route calls into the aggregated EventDispatcher.
     * @see egret.IEventDispatcher
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/events/EventDispatcher.ts
     * @language en_US
     */
    export class EventDispatcher extends HashObject implements IEventDispatcher
    {
        /**
         * Create an instance of the EventDispatcher class.
         * @param target The target object for events dispatched to the EventDispatcher object. This parameter is used when
         * the EventDispatcher instance is aggregated by a class that implements IEventDispatcher; it is necessary so that the
         * containing object can be the target for events. Do not use this parameter in simple cases in which a class extends EventDispatcher.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public constructor(target:IEventDispatcher = null) {
            super();
            this.$EventDispatcher = {
                0: target ? target : this,
                1: {},
                2: {},
                3: 0
            };
        }

        /**
         * @private
         */
        $EventDispatcher:Object;

        /**
         * @private
         * @param useCapture
         */
        $getEventMap(useCapture?:boolean) {
            let values = this.$EventDispatcher;
            let eventMap:any = useCapture ? values[Keys.captureEventsMap] : values[Keys.eventsMap];
            return eventMap;
        }

        /**
         * @inheritDoc
         * @version Egret 2.4
         * @platform Web,Native
         */
        public addEventListener(type:string, listener:Function, thisObject:any, useCapture?:boolean, priority?:number):void {
            this.$addListener(type, listener, thisObject, useCapture, priority);
        }

        /**
         * @inheritDoc
         * @version Egret 2.4
         * @platform Web,Native
         */
        public once(type:string, listener:Function, thisObject:any, useCapture?:boolean, priority?:number):void {
            this.$addListener(type, listener, thisObject, useCapture, priority, true);
        }

        /**
         * @private
         */
        $addListener(type:string, listener:Function, thisObject:any, useCapture?:boolean, priority?:number, dispatchOnce?:boolean):void {
            if (DEBUG && !listener) {
                $error(1003, "listener");
            }
            let values = this.$EventDispatcher;
            let eventMap:any = useCapture ? values[Keys.captureEventsMap] : values[Keys.eventsMap];
            let list:egret.sys.EventBin[] = eventMap[type];
            if (!list) {
                list = eventMap[type] = [];
            }
            else if (values[Keys.notifyLevel] !== 0) {
                eventMap[type] = list = list.concat();
            }

            this.$insertEventBin(list, type, listener, thisObject, useCapture, priority, dispatchOnce);
        }

        $insertEventBin(list:any[], type:string, listener:Function, thisObject:any, useCapture?:boolean, priority?:number, dispatchOnce?:boolean):boolean {
            priority = +priority | 0;
            let insertIndex = -1;
            let length = list.length;
            for (let i = 0; i < length; i++) {
                let bin = list[i];
                if (bin.listener == listener && bin.thisObject == thisObject && bin.target == this) {
                    return false;
                }
                if (insertIndex == -1 && bin.priority < priority) {
                    insertIndex = i;
                }
            }
            let eventBin:sys.EventBin = {
                type: type, listener: listener, thisObject: thisObject, priority: priority,
                target: this, useCapture: useCapture, dispatchOnce: !!dispatchOnce
            };
            if (insertIndex !== -1) {
                list.splice(insertIndex, 0, eventBin);
            }
            else {
                list.push(eventBin);
            }
            return true;
        }

        /**
         * @inheritDoc
         * @version Egret 2.4
         * @platform Web,Native
         */
        public removeEventListener(type:string, listener:Function, thisObject:any, useCapture?:boolean):void {

            let values = this.$EventDispatcher;
            let eventMap:Object = useCapture ? values[Keys.captureEventsMap] : values[Keys.eventsMap];
            let list:egret.sys.EventBin[] = eventMap[type];
            if (!list) {
                return;
            }
            if (values[Keys.notifyLevel] !== 0) {
                eventMap[type] = list = list.concat();
            }

            this.$removeEventBin(list, listener, thisObject);

            if (list.length == 0) {
                eventMap[type] = null;
            }
        }

        $removeEventBin(list:any[], listener:Function, thisObject:any):boolean {
            let length = list.length;
            for (let i = 0; i < length; i++) {
                let bin = list[i];
                if (bin.listener == listener && bin.thisObject == thisObject && bin.target == this) {
                    list.splice(i, 1);
                    return true;
                }
            }

            return false;
        }

        /**
         * @inheritDoc
         * @version Egret 2.4
         * @platform Web,Native
         */
        public hasEventListener(type:string):boolean {
            let values = this.$EventDispatcher;
            return !!(values[Keys.eventsMap][type] || values[Keys.captureEventsMap][type]);
        }

        /**
         * @inheritDoc
         * @version Egret 2.4
         * @platform Web,Native
         */
        public willTrigger(type:string):boolean {
            return this.hasEventListener(type);
        }


        /**
         * @inheritDoc
         * @version Egret 2.4
         * @platform Web,Native
         */
        public dispatchEvent(event:Event):boolean {
            event.$currentTarget = this.$EventDispatcher[Keys.eventTarget];
            event.$setTarget(event.$currentTarget);
            return this.$notifyListener(event, false);
        }

        /**
         * @private
         */
        $notifyListener(event:Event, capturePhase:boolean):boolean {
            let values = this.$EventDispatcher;
            let eventMap:Object = capturePhase ? values[Keys.captureEventsMap] : values[Keys.eventsMap];
            let list:egret.sys.EventBin[] = eventMap[event.$type];
            if (!list) {
                return true;
            }
            let length = list.length;
            if (length == 0) {
                return true;
            }
            let onceList = ONCE_EVENT_LIST;
            // Make a mark to prevent traversal errors caused by external modification of the original array.
            // I don't call list.concat () directly because dispatch () method is usually called more frequently than on () method.
            values[Keys.notifyLevel]++;
            for (let i = 0; i < length; i++) {
                let eventBin = list[i];
                eventBin.listener.call(eventBin.thisObject, event);
                if (eventBin.dispatchOnce) {
                    onceList.push(eventBin);
                }
                if (event.$isPropagationImmediateStopped) {
                    break;
                }
            }
            values[Keys.notifyLevel]--;
            while (onceList.length) {
                let eventBin = onceList.pop();
                eventBin.target.removeEventListener(eventBin.type, eventBin.listener, eventBin.thisObject, eventBin.useCapture);
            }
            return !event.$isDefaultPrevented;
        }

        /**
         * Distribute a specified event parameters.
         * @param type The type of the event. Event listeners can access this information through the inherited type property.
         * @param bubbles Determines whether the Event object bubbles. Event listeners can access this information through
         * the inherited bubbles property.
         * @param data {any} Some data.
         * @param cancelable Determines whether the Event object can be canceled. The default values is false.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public dispatchEventWith(type:string, bubbles?:boolean, data?:any, cancelable?: boolean):boolean {
            if (bubbles || this.hasEventListener(type)) {
                let event:Event = Event.create(Event, type, bubbles, cancelable);
                event.data = data;
                let result = this.dispatchEvent(event);
                Event.release(event);
                return result;
            }
            return true;
        }
    }

}

namespace egret.sys
{
    /**
     * @private
     * Event information object.
     */
    export interface EventBin
    {
        type:string;

        /**
         * @private
         */
        listener: Function;

        /**
         * @private
         */
        thisObject:any;

        /**
         * @private
         */
        priority:number;

        /**
         * @private
         */
        target:IEventDispatcher;

        /**
         * @private
         */
        useCapture:boolean;
        
        /**
         * @private
         */
        dispatchOnce:boolean;
    }
}