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

/// <reference path="../events/EventDispatcher.ts" />
/// <reference path="../events/TimerEvent.ts" />

namespace egret
{
	/**
     * The Timer class is the interface to timers, which let you run code on a specified time sequence.
     * Use the start() method to start a timer. Add an event listener for the timer event to set up code
     * to be run on the timer interval.
     * 
     * You can create Timer objects to run once or repeat at specified intervals to execute code on a schedule.
     * Depending on the framerate or the runtime environment (available memory and other factors), the
     * runtime may dispatchEvent events at slightly offset intervals.
     * @see egret.TimerEvent
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/utils/Timer.ts
     */
    export class Timer extends EventDispatcher
    {
        /**
         * Constructs a new Timer object with the specified delay and repeatCount states.
         * @param delay The delay between timer events, in milliseconds. A delay lower than 20 milliseconds is not recommended.
         * Timer frequency is limited to 60 frames per second, meaning a delay lower than 16.6 milliseconds causes runtime problems.
         * @param repeatCount Specifies the number of repetitions. If zero, the timer repeats indefinitely.If nonzero,
         * the timer runs the specified number of times and then stops.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public constructor(delay: number, repeatCount: number = 0) {
            super();
            this.delay = delay;
            this.repeatCount = +repeatCount | 0;
        }

        /**
         * @private
         */
        private _delay: number = 0;

		/**
         * The delay between timer events, in milliseconds.
         * A delay lower than 20 milliseconds is not recommended.
         * 
         * Note: Timer frequency is limited to 60 frames per second, meaning a delay
         * lower than 16.6 milliseconds causes runtime problems.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public get delay(): number {
            return this._delay;
        }

        public set delay(value: number) {
            if (value < 1) {
                value = 1;
            }
            if (this._delay == value) {
                return;
            }
            this._delay = value;
            this.lastCount = this.updateInterval = Math.round(60 * value);
        }

		/**
         * The total number of times the timer is set to run.
         * * If the repeat count is set to 0, the timer continues indefinitely, until the stop() method is invoked or the program stops.
         * * If the repeat count is nonzero, the timer runs the specified number of times.
         * * If repeatCount is set to a total that is the same or less then currentCount the timer stops and will not fire again.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public repeatCount: number;

        /**
         * @private
         */
        private _currentCount: number = 0;

		/**
         * The total number of times the timer has fired since it started at zero.
         * If the timer has been reset, only the fires since the reset are counted.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public get currentCount(): number {
            return this._currentCount;
        }

        /**
         * @private
         */
        private _running: boolean = false;

		/**
         * The timer's current state, true if the timer is running, otherwise false.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public get running(): boolean {
            return this._running;
        }

		/**
         * Stops the timer, if it is running, and sets the currentCount property back to 0, like the reset button of a stopwatch.
         * Then, when start() is called, the timer instance runs for the specified number of repetitions, as set by the repeatCount value.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public reset(): void {
            this.stop();
            this._currentCount = 0;
        }

		/**
         * Starts the timer, if it is not already running.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public start() {
            if (this._running)
                return;
            
            this.lastCount = this.updateInterval;
            this.lastTimeStamp = getTimer();
            ticker.$startTick(this.$update, this);
            this._running = true;
        }

		/**
         * Stops the timer. When start() is called after stop(), the timer instance runs for the remaining number of
         * repetitions, as set by the repeatCount property.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public stop() {
            if (!this._running)
                return;
            stopTick(this.$update, this);
            this._running = false;
        }

        /**
         * @private
         */
        private updateInterval: number = 1000;

        /**
         * @private
         */
        private lastCount: number = 1000;

        /**
         * @private
         */
        private lastTimeStamp: number = 0;

        /**
         * @private
         * Ticker refreshes this method at 60 FPS.
         */
        $update(timeStamp: number): boolean {
            let deltaTime = timeStamp - this.lastTimeStamp;
            if (deltaTime >= this._delay) {
                this.lastCount = this.updateInterval;
            }
            else {
                this.lastCount -= 1000;
                if (this.lastCount > 0) {
                    return false;
                }
                this.lastCount += this.updateInterval;
            }

            this.lastTimeStamp = timeStamp;
            this._currentCount++;
            let complete = (this.repeatCount > 0 && this._currentCount >= this.repeatCount);
            if (this.repeatCount == 0 || this._currentCount <= this.repeatCount) {
                egret.TimerEvent.dispatchTimerEvent(this, egret.TimerEvent.TIMER);
            }
            if (complete) {
                this.stop();
                TimerEvent.dispatchTimerEvent(this, TimerEvent.TIMER_COMPLETE);
            }

            return false;
        }
    }
}