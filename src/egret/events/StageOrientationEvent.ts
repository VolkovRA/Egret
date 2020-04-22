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
	export interface Stage{
		addEventListener<Z>(type: "orientationChange"
			, listener: (this: Z, e: StageOrientationEvent) => void, thisObject: Z, useCapture?: boolean, priority?: number);
		addEventListener(type: string, listener: Function, thisObject: any, useCapture?: boolean, priority?: number);
    }
    
	/**
	 * When the direction of the stage of change, Stage object dispatches StageOrientationEvent object.
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/events/StageOrientationEvent.ts
	 */
    export class StageOrientationEvent extends Event
    {
		/**
         * After screen rotation distribute events.
         * @version Egret 2.4
         * @platform Web,Native
		 */
        public static ORIENTATION_CHANGE = "orientationChange";

		/**
         * Creating contains specific information related to the event and the stage direction of StageOrientationEvent object.
         * @param type Event types:StageOrientationEvent.ORIENTATION_CHANGE.
         * @param bubbles It indicates whether the Event object participates in the bubbling stage of the event flow.
         * @param cancelable It indicates whether the Event object can be canceled.
         * @version Egret 2.4
         * @platform Web,Native
		 */
        public constructor(type:string, bubbles:boolean=false, cancelable:boolean=false){
            super(type,bubbles,cancelable);
        }

        /**
         * Distribute a screen rotation event.
         * @param target {egret.IEventDispatcher} Dispatch event target.
         * @param type {egret.IEventDispatcher} Dispatch event type.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static dispatchStageOrientationEvent(target:IEventDispatcher, type:string):boolean {
            let event:IOErrorEvent = Event.create(StageOrientationEvent, type);
            let result = target.dispatchEvent(event);
            Event.release(event);
            return result;
        }
    }
}