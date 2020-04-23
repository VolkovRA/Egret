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
     * @param fraction 
     * @returns 
     */
    function sineInOut(fraction:number):number {
        return -0.5 * (Math.cos(Math.PI * fraction) - 1)
    }

    /**
     * @private
     * Numerical easing tools.
     */
    export class Animation
    {
        /**
         * @private
         */
        public constructor(updateFunction:(animation:Animation)=>void, thisObject:any) {
            this.updateFunction = updateFunction;
            this.thisObject = thisObject;
        }

        /**
         * @private
         * The easing behavior of this animation. Set to null means no easing, the default value is sineInOut.
         */
        public easerFunction:(fraction:number)=>number = sineInOut;

        /**
         * @private
         */
        private thisObject:any;

        /**
         * @private
         * Whether the animation is being played, excluding the stages of delayed waiting and pause.
         */
        public isPlaying:boolean = false;

        /**
         * @private
         * Animation duration, in milliseconds, default value 500.
         */
        public duration:number = 500;

        /**
         * @private
         * The value corresponding to the current time from the animation.
         */
        public currentValue:number = 0;

        /**
         * @private
         * Starting value.
         */
        public from:number = 0;

        /**
         * @private
         * End point value.
         */
        public to:number = 0;

        /**
         * @private
         * Animation start time.
         */
        private startTime:number = 0;

        /**
         * @private
         * Callback function at the end of animation playback.
         */
        public endFunction:(animation:Animation) => void = null;

        /**
         * @private
         * Callback function when the animation is updated.
         */
        public updateFunction:Function;

        /**
         * @private
         * Start playing the animation in the forward direction.
         * Whenever it is called, it will start from the zero time again.
         * If a delay is set, it will first wait.
         */
        public play():void {
            this.stop();
            this.start();
        }

        /**
         * @private
         * Start the animation.
         */
        private start():void {
            this.isPlaying = false;
            this.currentValue = 0;
            this.startTime = egret.getTimer();
            this.doInterval(this.startTime);
            egret.startTick(this.doInterval,this);
        }

        /**
         * @private
         * Stop the animation.
         */
        public stop():void {
            this.isPlaying = false;
            this.startTime = 0;
            egret.stopTick(this.doInterval,this);
        }

        /**
         * @private
         * Calculate the current value and return whether the animation ends.
         */
        private doInterval(currentTime:number):boolean {
            let runningTime = currentTime - this.startTime;
            if (!this.isPlaying) {
                this.isPlaying = true;
            }
            let duration = this.duration;
            let fraction = duration == 0 ? 1 : Math.min(runningTime, duration) / duration;
            if (this.easerFunction){
                fraction = this.easerFunction(fraction);
            }
            this.currentValue = this.from + (this.to - this.from) * fraction;
            if (this.updateFunction)
                this.updateFunction.call(this.thisObject, this);
            let isEnded = runningTime >= duration;
            if (isEnded) {
                this.stop();
            }
            if (isEnded && this.endFunction) {
                this.endFunction.call(this.thisObject, this);
            }
            return true;
        }
    }
}