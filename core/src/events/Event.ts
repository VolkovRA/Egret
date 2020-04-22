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

namespace egret
{
    /**
     * The Event class is used as the base class for the creation of Event objects, which are passed as parameters to event
     * listeners when an event occurs.The properties of the Event class carry basic information about an event, such as
     * the event's type or whether the event's default behavior can be canceled. For many events, such as the events represented
     * by the Event class constants, this basic information is sufficient. Other events, however, may require more detailed
     * information. Events associated with a touch tap, for example, need to include additional information about the
     * location of the touch event. You can pass such additional information to event listeners by extending the Event class,
     * which is what the TouchEvent class does. Egret API defines several Event subclasses for common events that require
     * additional information. Events associated with each of the Event subclasses are described in the documentation for
     * each class.The methods of the Event class can be used in event listener functions to affect the behavior of the event
     * object. Some events have an associated default behavior. Your event listener can cancel this behavior by calling the
     * preventDefault() method. You can also make the current event listener the last one to process an event by calling
     * the stopPropagation() or stopImmediatePropagation() method.
     * @see egret.EventDispatcher
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/events/Event.ts
     * @see http://edn.egret.com/cn/docs/page/798 Cancel touch event.
     */
    export class Event extends HashObject
    {
        /**
         * Dispatched when a display object is added to the on stage display list, either directly or through the addition
         * of a sub tree in which the display object is contained.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static ADDED_TO_STAGE: string = "addedToStage";
        
        /**
         * Dispatched when a display object is about to be removed from the display list, either directly or through the removal
         * of a sub tree in which the display object is contained.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static REMOVED_FROM_STAGE: string = "removedFromStage";
        
        /**
         * Dispatched when a display object is added to the display list.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static ADDED: string = "added";
        
        /**
         * Dispatched when a display object is about to be removed from the display list.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static REMOVED: string = "removed";
        
        /**
         * [broadcast event] Dispatched when the playhead is entering a new frame.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static ENTER_FRAME: string = "enterFrame";
       
        /**
         * Dispatched when the display list is about to be updated and rendered.
         * Note: Every time you want to receive a render event,you must call the stage.invalidate() method.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static RENDER: string = "render";
       
        /**
         * Dispatched when the size of stage or UIComponent is changed.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static RESIZE: string = "resize";

        /**
         * Dispatched when the value or selection of a property is chaned.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static CHANGE: string = "change";

        /**
         * Dispatched when the value or selection of a property is going to change.you can cancel this by calling the
         * preventDefault() method.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static CHANGING: string = "changing";
       
        /**
         * Dispatched when the net request is complete.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static COMPLETE: string = "complete";

        /**
         * Dispatched when loop completed.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static LOOP_COMPLETE: string = "loopComplete";

        /**
         * Dispatched when the TextInput instance gets focus.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static FOCUS_IN: string = "focusIn";
        
        /**
         * Dispatched when the TextInput instance loses focus.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static FOCUS_OUT: string = "focusOut";
        
        /**
         * Dispatched when the playback is ended.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static ENDED: string = "ended";

        /**
         * Game activation.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static ACTIVATE: string = "activate";

        /**
         * Deactivate.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static DEACTIVATE: string = "deactivate";

        /**
         * The Event.CLOSE constant defines the value of the type property of the close event object.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static CLOSE: string = "close";

        /**
         * The Event.CONNECT constant defines the value of the type property of the connect event object.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static CONNECT: string = "connect";


        /**
         * The Event.LEAVE_STAGE constant defines the value of the type property of the leaveStage event object.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static LEAVE_STAGE: string = "leaveStage";

        /**
         * Event.SOUND_COMPLETE constant definition Dispatched after the sound has finished playing.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static SOUND_COMPLETE: string = "soundComplete";

        /**
         * Creates an Event object to pass as a parameter to event listeners.
         * @param type  The type of the event, accessible as Event.type.
         * @param bubbles  Determines whether the Event object participates in the bubbling stage of the event flow. The default value is false.
         * @param cancelable Determines whether the Event object can be canceled. The default values is false.
         * @param data The optional data associated with this event.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public constructor(type: string, bubbles?: boolean, cancelable?: boolean, data?: any) {
            super();
            this.$type = type;
            this.$bubbles = !!bubbles;
            this.$cancelable = !!cancelable;
            this.data = data;
        }

        /**
         * The optional data associated with this event.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public data: any;

        /**
         * @private
         */
        $type: string;

        /**
         * The type of event.
         * The type is case-sensitive.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public get type(): string {
            return this.$type;
        }

        /**
         * @private
         */
        $bubbles: boolean;

        /**
         * Indicates whether an event is a bubbling event.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public get bubbles(): boolean {
            return this.$bubbles;
        }

        /**
         * @private
         */
        $cancelable: boolean;

        /**
         * Indicates whether the behavior associated with the event can be prevented.
         * If the behavior can be canceled, this value is true; otherwise it is false.
         * @see #preventDefault()
         * @version Egret 2.4
         * @platform Web,Native
         */
        public get cancelable(): boolean {
            return this.$cancelable;
        }

        /**
         * @private
         */
        $eventPhase: number = 2;

        /**
         * The current phase in the event flow. This property can contain the following numeric values:
         * 1. The capture phase. *EventPhase.CAPTURING_PHASE*
         * 2. The target phase. *EventPhase.AT_TARGET*
         * 3. The bubbling phase. *EventPhase.BUBBLING_PHASE*
         * @see egret.EventPhase
         * @version Egret 2.4
         * @platform Web,Native
         */
        public get eventPhase(): number {
            return this.$eventPhase;
        }

        /**
         * @private
         */
        $currentTarget: any = null;

        /**
         * The object that is actively processing the Event object with an event listener.
         * For example, if a user clicks an OK button, the current target could be the node containing that button or
         * one of its ancestors that has registered an event listener for that event.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public get currentTarget(): any {
            return this.$currentTarget;
        }

        /**
         * @private
         */
        $target: any = null;

        /**
         * The event target.
         * This property contains the target node. For example, if a user clicks an OK button,
         * the target node is the display list node containing that button.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public get target(): any {
            return this.$target;
        }

        $setTarget(target: any): boolean {
            this.$target = target;
            return true;
        }

        /**
         * @private
         */
        $isDefaultPrevented: boolean = false;

        /**
         * Checks whether the preventDefault() method has been called on the event.
         * If the preventDefault() method has been called, returns true; otherwise, returns false.
         * @returns If preventDefault() has been called, returns true; otherwise, returns false.
         * @see #preventDefault()
         * @version Egret 2.4
         * @platform Web,Native
         */
        public isDefaultPrevented(): boolean {
            return this.$isDefaultPrevented;
        }

        /**
         * Cancels an event's default behavior if that behavior can be canceled.Many events have associated behaviors that
         * are carried out by default. For example, if a user types a character into a text input, the default behavior
         * is that the character is displayed in the text input. Because the TextEvent.TEXT_INPUT event's default behavior
         * can be canceled, you can use the preventDefault() method to prevent the character from appearing.
         * You can use the Event.cancelable property to check whether you can prevent the default behavior associated with
         * a particular event. If the value of Event.cancelable is true, then preventDefault() can be used to cancel the event;
         * otherwise, preventDefault() has no effect.
         * @see #cancelable
         * @see #isDefaultPrevented
         * @version Egret 2.4
         * @platform Web,Native
         */
        public preventDefault(): void {
            if (this.$cancelable)
                this.$isDefaultPrevented = true;
        }

        /**
         * @private
         */
        $isPropagationStopped: boolean = false;

        /**
         * Prevents processing of any event listeners in nodes subsequent to the current node in the event flow. This method
         * does not affect any event listeners in the current node (currentTarget). In contrast, the stopImmediatePropagation()
         * method prevents processing of event listeners in both the current node and subsequent nodes. Additional calls to this
         * method have no effect. This method can be called in any phase of the event flow.
         * 
         * Note: This method does not cancel the behavior associated with this event; see preventDefault() for that functionality.
         * @see #stopImmediatePropagation()
         * @see #preventDefault()
         * @version Egret 2.4
         * @platform Web,Native
         */
        public stopPropagation(): void {
            if (this.$bubbles)
                this.$isPropagationStopped = true;
        }

        /**
         * @private
         */
        $isPropagationImmediateStopped: boolean = false;

        /**
         * Prevents processing of any event listeners in the current node and any subsequent nodes in the event flow.
         * This method takes effect immediately, and it affects event listeners in the current node. In contrast, the
         * stopPropagation() method doesn't take effect until all the event listeners in the current node finish processing.
         * 
         * Note: This method does not cancel the behavior associated with this event; see preventDefault() for that functionality.
         * @see #stopPropagation()
         * @see #preventDefault()
         * @version Egret 2.4
         * @platform Web,Native
         */
        public stopImmediatePropagation(): void {
            if (this.$bubbles)
                this.$isPropagationImmediateStopped = true;
        }

        /**
         * This method will be called automatically when you pass the event object as the parameters to the Event.release() method.
         * If your custom event is designed for reusable,you should override this method to make sure all the references to external
         * objects are cleaned. if not,it may cause memory leaking.
         * @see egret.Event.create()
         * @see egret.Event.release()
         * @version Egret 2.4
         * @platform Web,Native
         */
        protected clean(): void {
            this.data = this.$currentTarget = null;
            this.$setTarget(null);
        }

        /**
         * EventDispatcher object using the specified event object thrown Event.
         * Objects thrown objects will be cached in the pool for the next round robin.
         * @param target The event target.
         * @param type The type of the event. Event listeners can access this information through the inherited type property.
         * @param bubbles Determines whether the Event object bubbles. Event listeners can access this information through the inherited bubbles property.
         * @param data {any} Some data.
         * @method egret.Event.dispatchEvent
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static dispatchEvent(target: IEventDispatcher, type: string, bubbles: boolean = false, data?: any): boolean {
            let event: IOErrorEvent = Event.create(Event, type, bubbles);
            let props: any = Event._getPropertyData(Event);
            if (data != undefined) {
                props.data = data;
            }
            let result = target.dispatchEvent(event);
            Event.release(event);
            return result;
        }

        /**
         * @private
         * @param EventClass
         * @returns
         */
        public static _getPropertyData(EventClass: any): any {
            let props: any = EventClass._props;
            if (!props)
                props = EventClass._props = {};
            return props;
        }

        /**
         * Gets one event instance from the object pool or create a new one.
         * We highly recommend using the Event.create() and Event.release() methods to create and release an event object,
         * it can reduce the number of reallocate objects, which allows you to get better code execution performance.
         * 
         * Note: If you want to use this method to initialize your custom event object, you must make sure the constructor
         * of your custom event is the same as the constructor of egret.Event.
         * @param EventClass Event Class.
         * @param type The type of the event, accessible as Event.type.
         * @param bubbles Determines whether the Event object participates in the bubbling stage of the event flow. The default value is false.
         * @param cancelable Determines whether the Event object can be canceled. The default values is false.
         * @example
         *    let event = Event.create(Event,type, bubbles);
         *    event.data = data;    // Optional, initializes custom data here
         *    this.dispatchEvent(event);
         *    Event.release(event);
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static create<T extends Event>(EventClass: { new(type: string, bubbles?: boolean, cancelable?: boolean): T; eventPool?: Event[] },
            type: string, bubbles?: boolean, cancelable?: boolean): T {
            let eventPool: Event[];
            let hasEventPool = (EventClass as any).hasOwnProperty("eventPool");
            if (hasEventPool) {
                eventPool = EventClass.eventPool;
            }

            if (!eventPool) {
                eventPool = EventClass.eventPool = [];
            }
            if (eventPool.length) {
                let event: T = <T>eventPool.pop();
                event.$type = type;
                event.$bubbles = !!bubbles;
                event.$cancelable = !!cancelable;
                event.$isDefaultPrevented = false;
                event.$isPropagationStopped = false;
                event.$isPropagationImmediateStopped = false;
                event.$eventPhase = EventPhase.AT_TARGET;
                return event;
            }
            return new EventClass(type, bubbles, cancelable);
        }

        /**
         * Releases an event object and cache it into the object pool.
         * We highly recommend using the Event.create() and Event.release() methods to create and release an event object,
         * it can reduce the number of reallocate objects, which allows you to get better code execution performance.
         * 
         * Note: The parameters of this method only accepts an instance created by the Event.create() method. if not, it may throw an error.
         * @example
         *    let event = Event.create(Event,type, bubbles);
         *    event.data = data; //optional,initializes custom data here
         *    this.dispatchEvent(event);
         *    Event.release(event);
         * @see #clean()
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static release(event: Event): void {
            event.clean();
            let EventClass: any = Object.getPrototypeOf(event).constructor;
            EventClass.eventPool.push(event);
        }
    }
}