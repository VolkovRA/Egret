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

/// <reference path="Event.ts" />

namespace egret
{
    // export interface TextField{
    //     addEventListener<Z>(type: "link"
    //         , listener: (this: Z, e: TextEvent) => void, thisObject: Z, useCapture?: boolean, priority?: number);
    //     addEventListener(type: string, listener: Function, thisObject: any, useCapture?: boolean, priority?: number);
    // }

    /**
     * When a user clicks a hyperlink rich text object dispatches TextEvent object.
     * Text Event Type: TextEvent.LINK.
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/events/TextEvent.ts
     */
    export class TextEvent extends Event
    {
        /**
         * TextEvent create an object that contains information about text events.
         * @param type Type of event, you can access the TextEvent.type.
         * @param bubbles Determines whether the Event object participates in the bubbling stage of the event flow. The default value is false.
         * @param cancelable Determine whether the Event object can be canceled. The default value is false.
         * @param text One or more characters of text entered by the user. Event listeners can access this information through the text property.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public constructor(type:string, bubbles:boolean = false, cancelable:boolean = false, text:string = "") {
            super(type, bubbles, cancelable);

            this.text = text;
        }

        /**
         * It defines the value of the type property of a link event object.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static LINK = "link";

        /**
         * In TextEvent.LINK event, event corresponding string.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        public text:string;

        /**
         * EventDispatcher object using the specified event object thrown TextEvent.
         * The objects will be thrown in the object cache pool for the next round robin.
         * @param type The type of the event, accessible as Event.type.
         * @param bubbles Determines whether the Event object participates in the bubbling stage of the event flow. The default value is false.
         * @param text Text TextEvent object assignment.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static dispatchTextEvent(target:IEventDispatcher, type:string, text:string):boolean {
            let event:TextEvent = Event.create(TextEvent, type);
            event.text = text;
            let result = target.dispatchEvent(event);
            Event.release(event);
            return result;
        }
    }
}