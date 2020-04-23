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
     * The eui.CollectionEvent class represents an event that is dispatched when the associated collection changes.
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @includeExample extension/eui/events/CollectionEventExample.ts
     */
    export class CollectionEvent extends egret.Event
    {
        /**
         * Dispatched when a collection has changed.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public static COLLECTION_CHANGE = "collectionChange";

        /**
         * Constructor.
         * @param type The event type; indicates the action that triggered the event.
         * @param bubbles Specifies whether the event can bubble up the display list hierarchy.
         * @param cancelable Specifies whether the behavior associated with the event can be prevented.
         * @param kind Indicates the kind of event that occured. The parameter value can be one of the values
         * in the CollectionEventKind class, or *null*, which indicates that the kind is unknown.
         * @param location When the *kind* is
         * * *CollectionEventKind.ADD*
         * * *CollectionEventKind.REMOVE*
         * * *CollectionEventKind.REPLACE*
         * * *CollectionEventKind.UPDATE*
         * 
         * This value indicates at what location the item(s) specified in the *items property* can be found
         * within the target collection.
         * @param oldLocation This value indicates the old location within the target collection
         * of the item(s) specified in the *items* property.
         * @param items Array of objects with information about the items affected by the event.
         * @param oldItems When the *kine* is *CollectionEventKind.REPLACE* the value represents
         * a list of items before replaced.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public constructor(type:string, bubbles?:boolean, cancelable?:boolean,
                           kind?:string, location?:number, oldLocation?:number,
                           items?:any[], oldItems?:any[]) {
            super(type, bubbles, cancelable);
            this.$initTo(kind, location, oldLocation, items, oldItems);
        }

        /**
         * @private
         * @param kind 
         * @param location 
         * @param oldLocation 
         * @param items 
         * @param oldItems 
         */
        $initTo(kind?:string, location?:number, oldLocation?:number, items?:any[], oldItems?:any[]):void {
            this.kind = kind;
            this.location = +location | 0;
            this.oldLocation = +oldLocation | 0;
            this.items = items || [];
            this.oldItems = oldItems || [];
        }

        /**
         * Indicates the kind of event that occured.
         * The parameter value can be one of the values in the CollectionEventKind class, or *null*,
         * which indicates that the kind is unknown.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        public kind:string;

        /**
         * Array of objects with information about the items. Affected by the event.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public items:any[];

        /**
         * When the *kine* is *CollectionEventKind.REPLACE* the value represents a list of items before replaced.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public oldItems:any[];

        /**
         * When the *kind* is:
         * * *CollectionEventKind.ADD*
         * * *CollectionEventKind.REMOVE*
         * * *CollectionEventKind.REPLACE*
         * * *CollectionEventKind.UPDATE*
         * 
         * This value indicates at what location the item(s) specified in the *items property* can be found
         * within the target collection.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public location:number;
        
        /**
         * This value indicates the old location within the target collection of the item(s) specified in the *items* property.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public oldLocation:number;

        /**
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        protected clean():void {
            super.clean();
            this.items = this.oldItems = null;
        }

        /**
         * Dispatch an event with specified EventDispatcher.
         * The dispatched event will be cached in the object pool, for the next cycle of reuse.
         * @param target The target of event dispatcher.
         * @param eventType The event type; indicates the action that triggered the event.
         * @param kind Indicates the kind of event that occured.
         * The parameter value can be one of the values in the CollectionEventKind class, or *null*,
         * which indicates that the kind is unknown.
         * @param location When the *kind* is:
         * * *CollectionEventKind.ADD*
         * * *CollectionEventKind.REMOVE*
         * * *CollectionEventKind.REPLACE*
         * * *CollectionEventKind.UPDATE*
         * 
         * This value indicates at what location the item(s) specified in the *items property* can be found
         * within the target collection.
         * @param oldLocation This value indicates the old location within the target collection
         * of the item(s) specified in the *items* property.
         * @param items Array of objects with information about the items affected by the event.
         * @param oldItems When the *kine* is *CollectionEventKind.REPLACE* the value represents
         * a list of items before replaced.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public static dispatchCollectionEvent(target:egret.IEventDispatcher, eventType:string, kind?:string, location?:number,
                                          oldLocation?:number, items?:any[], oldItems?:any[]):boolean {
            if (!target.hasEventListener(eventType)) {
                return true;
            }
            let event = egret.Event.create(CollectionEvent, eventType);
            event.$initTo(kind, location, oldLocation, items, oldItems);
            let result = target.dispatchEvent(event);
            egret.Event.release(event);
            return result;
        }
    }
}