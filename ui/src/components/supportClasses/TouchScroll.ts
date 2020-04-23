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
     * The maximum number of historical speeds that need to be recorded.
     */
    let MAX_VELOCITY_COUNT = 4;

    /**
     * @private
     * A weighted list of recorded historical speeds.
     */
    let VELOCITY_WEIGHTS:number[] = [1, 1.33, 1.66, 2];

    /**
     * @private
     * The weight of the current speed.
     */
    let CURRENT_VELOCITY_WEIGHT = 2.33;

    /**
     * @private
     * The smallest change speed solves the floating point precision problem.
     */
    let MINIMUM_VELOCITY = 0.02;

    /**
     * @private
     * The friction coefficient to be applied when the container is automatically rolling.
     */
    let FRICTION = 0.998;

    /**
     * @private
     * The coefficient of friction to be applied additionally when the container is automatically
     * scrolling and the scrolling position exceeds the range of the container.
     */
    let EXTRA_FRICTION = 0.95;

    /**
     * @private
     * Natural logarithm of friction coefficient.
     */
    let FRICTION_LOG = Math.log(FRICTION);

    /**
     * @private
     * @param ratio
     * @returns
     */
    function easeOut(ratio:number):number {
        let invRatio:number = ratio - 1.0;
        return invRatio * invRatio * invRatio + 1;
    }

    /**
     * @private
     * A tool class for the scrolling drag operation of the container.
     * It calculates the value that should be scrolled to and the easing time after the
     * scrolling is continued for a period of time. To use this tool class, you need to
     * create a ScrollThrown instance and call the start () method when scrolling occurs,
     * and then call update () to update the current stage coordinates during touch movement.
     * A timer will be started internally to calculate the speed value based on the current
     * position and cache the last 4 values. When the scrolling is stopped, the finish ()
     * method is called again, the displacement will be stopped immediately and the final
     * result will be stored in the Thrown.scrollTo and Thrown.duration properties.
     */
    export class TouchScroll
    {
        /**
         * @private
         * Create a TouchScroll instance.
         * @param updateFunction Scroll position update callback function.
         */
        public constructor(updateFunction:(scrollPos:number)=>void, endFunction:()=>void, target:egret.IEventDispatcher) {
            if (DEBUG && !updateFunction) {
                egret.$error(1003, "updateFunction");
            }
            this.updateFunction = updateFunction;
            this.endFunction = endFunction;
            this.target = target;
            this.animation = new sys.Animation(this.onScrollingUpdate, this);
            this.animation.endFunction = this.finishScrolling;
            this.animation.easerFunction = easeOut;
        }

        /**
         * @private
         * Adjustable series of current container rolling outside.
         */
        $scrollFactor = 1.0;

        /**
         * @private
         */
        private target:egret.IEventDispatcher;

        /**
         * @private
         */
        private updateFunction:(scrollPos:number)=>void;

        /**
         * @private
         */
        private endFunction:()=>void;

        /**
         * @private
         */
        private previousTime:number = 0;

        /**
         * @private
         */
        private velocity:number = 0;

        /**
         * @private
         */
        private previousVelocity:number[] = [];

        /**
         * @private
         */
        private currentPosition:number = 0;

        /**
         * @private
         */
        private previousPosition:number = 0;

        /**
         * @private
         */
        private currentScrollPos:number = 0;

        /**
         * @private
         */
        private maxScrollPos:number = 0;

        /**
         * @private
         * Offset when touch is pressed.
         */
        private offsetPoint:number = 0;

        /**
         * @private
         * Animation instance that continues to scroll when you stop touching.
         */
        private animation:sys.Animation;

        public $bounces:boolean = true;

        /**
         * @private
         * The sign of the slow motion animation is playing.
         */
        public isPlaying():boolean {
            return this.animation.isPlaying;
        }

        /**
         * @private
         * If you are performing a jog scroll, stop the jog.
         */
        public stop():void {
            this.animation.stop();
            egret.stopTick(this.onTick, this);
            this.started = false;
        }

        private started:boolean = true;

        /**
         * @private
         * True means that the start method has been called.
         */
        public isStarted():boolean {
            return this.started;
        }

        /**
         * @private
         * Start recording displacement changes.
         * Note: When finished using, you must call the finish () method to end the recording,
         * otherwise the object cannot be recycled.
         * @param touchPoint The starting touch position, in pixels, usually stageX or stageY.
         */
        public start(touchPoint:number):void {
            this.started = true;
            this.velocity = 0;
            this.previousVelocity.length = 0;
            this.previousTime = egret.getTimer();
            this.previousPosition = this.currentPosition = touchPoint;
            this.offsetPoint = touchPoint;
            egret.startTick(this.onTick, this);
        }

        /**
         * @private
         * Update the current location.
         * @param touchPoint The current touch position, in pixels, usually stageX or stageY.
         */
        public update(touchPoint:number, maxScrollValue:number, scrollValue):void {
            maxScrollValue = Math.max(maxScrollValue, 0);
            this.currentPosition = touchPoint;
            this.maxScrollPos = maxScrollValue;
            let disMove = this.offsetPoint - touchPoint;
            let scrollPos = disMove + scrollValue;
            this.offsetPoint = touchPoint;
            if (scrollPos < 0) {
                if (!this.$bounces) {
                    scrollPos = 0;
                }
                else {
                    scrollPos -= disMove * 0.5;
                }
            }
            if (scrollPos > maxScrollValue) {
                if (!this.$bounces) {
                    scrollPos = maxScrollValue;
                }
                else {
                    scrollPos -= disMove * 0.5;
                }
            }
            this.currentScrollPos = scrollPos;
            this.updateFunction.call(this.target, scrollPos);
        }

        /**
         * @private
         * Stop recording displacement changes, and calculate the target value and the time to continue easing.
         * @param currentScrollPos The current scroll value of the container.
         * @param maxScrollPos The maximum value that the container can scroll.
         * When the target value is not between 0 ~ maxValue, greater friction will be applied, which will
         * affect the length of the slow motion time.
         */
        public finish(currentScrollPos:number, maxScrollPos:number):void {
            egret.stopTick(this.onTick, this);
            this.started = false;
            let sum = this.velocity * CURRENT_VELOCITY_WEIGHT;
            let previousVelocityX = this.previousVelocity;
            let length = previousVelocityX.length;
            let totalWeight = CURRENT_VELOCITY_WEIGHT;
            for (let i = 0; i < length; i++) {
                let weight = VELOCITY_WEIGHTS[i];
                sum += previousVelocityX[0] * weight;
                totalWeight += weight;
            }

            let pixelsPerMS = sum / totalWeight;
            let absPixelsPerMS = Math.abs(pixelsPerMS);
            let duration = 0;
            let posTo = 0;
            if (absPixelsPerMS > MINIMUM_VELOCITY) {
                posTo = currentScrollPos + (pixelsPerMS - MINIMUM_VELOCITY) / FRICTION_LOG * 2 * this.$scrollFactor;
                if (posTo < 0 || posTo > maxScrollPos) {
                    posTo = currentScrollPos;
                    while (Math.abs(pixelsPerMS) > MINIMUM_VELOCITY) {
                        posTo -= pixelsPerMS;
                        if (posTo < 0 || posTo > maxScrollPos) {
                            pixelsPerMS *= FRICTION * EXTRA_FRICTION;
                        }
                        else {
                            pixelsPerMS *= FRICTION;
                        }
                        duration++;
                    }
                }
                else {
                    duration = Math.log(MINIMUM_VELOCITY / absPixelsPerMS) / FRICTION_LOG;
                }
            }
            else {
                posTo = currentScrollPos;
            }
            if (this.target["$getThrowInfo"]) {
                let event:eui.ScrollerThrowEvent = this.target["$getThrowInfo"](currentScrollPos, posTo);
                posTo = event.toPos;
            }
            if (duration > 0) {
                // If the rebound is canceled, ensure that the border will not be exceeded after the animation.
                if (!this.$bounces) {
                    if (posTo < 0) {
                        posTo = 0;
                    }
                    else if (posTo > maxScrollPos) {
                        posTo = maxScrollPos;
                    }
                }
                this.throwTo(posTo, duration);
            }
            else {
                this.finishScrolling();
            }
        }

        /**
         * @private
         * @param timeStamp
         * @returns
         */
        private onTick(timeStamp:number):boolean {
            let timeOffset = timeStamp - this.previousTime;
            if (timeOffset > 10) {
                let previousVelocity = this.previousVelocity;
                if (previousVelocity.length >= MAX_VELOCITY_COUNT) {
                    previousVelocity.shift();
                }
                this.velocity = (this.currentPosition - this.previousPosition) / timeOffset;
                previousVelocity.push(this.velocity);
                this.previousTime = timeStamp;
                this.previousPosition = this.currentPosition;
            }
            return true;
        }

        /**
         * @private
         * @param animation
         */
        private finishScrolling(animation?:Animation):void {
            let hsp = this.currentScrollPos;
            let maxHsp = this.maxScrollPos;
            let hspTo = hsp;
            if (hsp < 0) {
                hspTo = 0;
            }
            if (hsp > maxHsp) {
                hspTo = maxHsp;
            }
            this.throwTo(hspTo, 300);
        }

        /**
         * @private
         * Jog to the horizontal scroll position.
         */
        private throwTo(hspTo:number, duration:number = 500):void {
            let hsp = this.currentScrollPos;
            if (hsp == hspTo) {
                this.endFunction.call(this.target);
                return;
            }
            let animation = this.animation;
            animation.duration = duration;
            animation.from = hsp;
            animation.to = hspTo;
            animation.play();
        }

        /**
         * @private
         * Update horizontal scroll position.
         */
        private onScrollingUpdate(animation:Animation):void {
            this.currentScrollPos = animation.currentValue;
            this.updateFunction.call(this.target, animation.currentValue);
        }
    }
}