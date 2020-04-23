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
     * The UIEvent class represents the event object passed to the event listener for many UI events.
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @includeExample extension/eui/events/UIEventExample.ts
     */
    export class UIEvent extends egret.Event
    {
        /**
         * Constructor.
         * @param type The event type. Indicates the action that triggered the event.
         * @param bubbles Specifies whether the event can bubble up the display list hierarchy.
         * @param cancelable Specifies whether the behavior associated with the event can be prevented.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public constructor(type:string, bubbles?:boolean, cancelable?:boolean) {
            super(type, bubbles, cancelable);
        }

        /**
         * creation complete of component.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public static CREATION_COMPLETE = "creationComplete";
        
        /**
         * The ending of change.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public static CHANGE_END = "changeEnd";

        /**
         * The beginning of change.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public static CHANGE_START = "changeStart";

        /**
         * Before close the panel.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public static CLOSING = "closing";

        /**
         * The coordinates of the UI components changed in it's parent.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public static MOVE = "move";

        /**
         * Dispatch an event with specified EventDispatcher. The dispatched event will be cached in the object pool,
         * for the next cycle of reuse.
         * @param target The target of event dispatcher.
         * @param eventType The event type; indicates the action that triggered the event.
         * @param bubbles Determines whether the Event object participates in the bubbling stage of the event flow.
         * The default value is false.
         * @param cancelable Determines whether the Event object can be canceled. The default values is false.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public static dispatchUIEvent(target:egret.IEventDispatcher, eventType:string, bubbles?:boolean, cancelable?:boolean):boolean {
            if(!target.hasEventListener(eventType)){
                return true;
            }
            let event = egret.Event.create(UIEvent, eventType, bubbles, cancelable);
            let result = target.dispatchEvent(event);
            egret.Event.release(event);
            return result;
        }
    }
}