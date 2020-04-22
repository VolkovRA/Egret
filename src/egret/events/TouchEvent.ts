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

/// <reference path="../geom/Point.ts" />
/// <reference path="Event.ts" />

namespace egret
{
    export interface DisplayObject
    {
        addEventListener<Z>(type:   "touchMove"   |
                                    "touchBegin"  |
                                    "touchEnd"    |
                                    "touchCancel" |
                                    "touchTap"    |
                                    "touchReleaseOutside" |
                                    "touchRollOut"|
                                    "touchRollOver"
                                   , listener: (this: Z, e: TouchEvent) => void, thisObject: Z, useCapture?: boolean, priority?: number);
        addEventListener(type: string, listener: Function, thisObject: any, useCapture?: boolean, priority?: number);
    }

    let localPoint: Point = new Point();

    /**
     * The TouchEvent class lets you handle events on devices that detect user contact with the device (such as a finger on a touch screen).
     * When a user interacts with a device such as a mobile phone or tablet with a touch screen, the
     * user typically touches the screen with his or her fingers or a pointing device. You can develop applications that
     * respond to basic touch events (such as a single finger tap) with the TouchEvent class. Create event listeners using
     * the event types defined in this class.
     * 
     * Note: When objects are nested on the display list, touch events target the deepest possible nested object that is
     * visible in the display list. This object is called the target node. To have a target node's ancestor (an object
     * containing the target node in the display list) receive notification of a touch event, use EventDispatcher.addEventListener()
     * on the ancestor node with the type parameter set to the specific touch event you want to detect.
     *
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/events/TouchEvent.ts
     */
    export class TouchEvent extends Event
    {
        /**
         * Dispatched when the user touches the device, and is continuously dispatched until the point of contact is removed.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static TOUCH_MOVE = "touchMove";

        /**
         * Dispatched when the user first contacts a touch-enabled device (such as touches a finger to a mobile phone or tablet with a touch screen).
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static TOUCH_BEGIN = "touchBegin";

        /**
         * Dispatched when the user removes contact with a touch-enabled device (such as lifts a finger off a mobile phone
         * or tablet with a touch screen).
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static TOUCH_END = "touchEnd";
        
        /**
         * Dispatched when an event of some kind occurred that canceled the touch.
         * Such as the eui.Scroller will dispatch 'TOUCH_CANCEL' when it start move, the 'TOUCH_END' and 'TOUCH_TAP' will not be triggered.
         * @version Egret 3.0.1
         * @platform Web,Native
         */
        public static TOUCH_CANCEL = "touchCancel";

        /**
         * Dispatched when the user lifts the point of contact over the same DisplayObject instance on which the contact
         * was initiated on a touch-enabled device.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static TOUCH_TAP = "touchTap";

        /**
         * Dispatched when the user lifts the point of contact over the different DisplayObject instance on which the contact
         * was initiated on a touch-enabled device (such as presses and releases a finger from a single point over a display
         * object on a mobile phone or tablet with a touch screen).
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static TOUCH_RELEASE_OUTSIDE = "touchReleaseOutside";

        /**
         * Creates an Event object that contains information about touch events.
         * @param type The type of the event, accessible as Event.type.
         * @param bubbles Determines whether the Event object participates in the bubbling stage of the event flow. The default value is false.
         * @param cancelable Determines whether the Event object can be canceled. The default values is false.
         * @param stageX The horizontal coordinate at which the event occurred in global Stage coordinates.
         * @param stageY The vertical coordinate at which the event occurred in global Stage coordinates.
         * @param touchPointID A unique identification number assigned to the touch point.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public constructor(type: string, bubbles?: boolean, cancelable?: boolean, stageX?: number,
            stageY?: number, touchPointID?: number) {
            super(type, bubbles, cancelable);
            this.$initTo(stageX, stageY, touchPointID);
        }

        /**
         * @private
         */
        $initTo(stageX: number, stageY: number, touchPointID: number): void {
            this.touchPointID = +touchPointID || 0;
            this.$stageX = +stageX || 0;
            this.$stageY = +stageY || 0;
        }

        /**
         * @private
         */
        $stageX: number;

        /**
         * The horizontal coordinate at which the event occurred in global Stage coordinates.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public get stageX(): number {
            return this.$stageX;
        }

        /**
         * @private
         */
        $stageY: number;

        /**
         * The vertical coordinate at which the event occurred in global Stage coordinates.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public get stageY(): number {
            return this.$stageY;
        }

        private _localX: number;

        /**
         * The horizontal coordinate at which the event occurred relative to the display object.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public get localX(): number {
            if (this.targetChanged) {
                this.getLocalXY();
            }
            return this._localX;
        }

        private _localY: number;

        /**
         * The vertical coordinate at which the event occurred relative to the display object.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public get localY(): number {
            if (this.targetChanged) {
                this.getLocalXY();
            }
            return this._localY;
        }

        private targetChanged: boolean = true;

        /**
         * @private
         */
        private getLocalXY(): void {
            this.targetChanged = false;
            let m = (<DisplayObject>this.$target).$getInvertedConcatenatedMatrix();
            m.transformPoint(this.$stageX, this.$stageY, localPoint);
            this._localX = localPoint.x;
            this._localY = localPoint.y;
        }

        $setTarget(target: any): boolean {
            this.$target = target;
            this.targetChanged = !!target;
            return true;
        }

        /**
         * A unique identification number assigned to the touch point.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public touchPointID: number;

        /**
         * Instructs Egret runtime to render after processing of this event completes, if the display list has been modified.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public updateAfterEvent(): void {
            sys.$requestRenderingFlag = true;
        }

        /**
         * Whether the touch is pressed (true) or not pressed (false).
         * @version Egret 2.4
         * @platform Web,Native
         */
        public touchDown: boolean = false;

        /**
         * Uses a specified target to dispatchEvent an event. Using this method can reduce the number of
         * reallocate event objects, which allows you to get better code execution performance.
         * @param target The event target.
         * @param type The type of the event, accessible as Event.type.
         * @param bubbles Determines whether the Event object participates in the bubbling stage of the event flow. The default value is false.
         * @param cancelable Determines whether the Event object can be canceled. The default values is false.
         * @param stageX The horizontal coordinate at which the event occurred in global Stage coordinates.
         * @param stageY The vertical coordinate at which the event occurred in global Stage coordinates.
         * @param touchPointID A unique identification number (as an int) assigned to the touch point.
         *
         * @see egret.Event.create()
         * @see egret.Event.release()
         *
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static dispatchTouchEvent(target: IEventDispatcher, type: string, bubbles?: boolean, cancelable?: boolean,
            stageX?: number, stageY?: number, touchPointID?: number, touchDown: boolean = false): boolean {
            if (!bubbles && !target.hasEventListener(type)) {
                return true;
            }
            let event: TouchEvent = Event.create(TouchEvent, type, bubbles, cancelable);
            event.$initTo(stageX, stageY, touchPointID);
            event.touchDown = touchDown;
            let result = target.dispatchEvent(event);
            Event.release(event);
            return result;
        }
    }
}