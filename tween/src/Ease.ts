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

namespace egret
{
    /**
     * Easing function set.
     * Different easing functions are used to make an animation proceed according to the corresponding equation.
     * @see http://edn.egret.com/cn/index.php/article/index/id/53 Easing effect Demo.
     * @version Egret 2.4
     * @platform Web,Native
     */
    export class Ease
    {
        /**
         * Cannot create object.
         * @version Egret 2.4
         * @platform Web,Native
         */
        constructor() {
            egret.error(1014);
        }

        //////////////////////
        //   CONSTRUCTORS   //
        //////////////////////

        /**
         * Create: Linear.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static get(amount: number): EaseFunc {
            if (amount < -1)
                amount = -1;
            else if (amount > 1)
                amount = 1;

            return function (t: number) {
                if (amount == 0)
                    return t;
                if (amount < 0)
                    return t * (t * -amount + 1 + amount);

                return t * ((2 - t) * amount + (1 - amount));
            }
        }

        /**
         * Create: Pow in.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static getPowIn(pow: number): EaseFunc {
            return function (t: number) {
                return Math.pow(t, pow);
            }
        }

        /**
         * Create: Pow out.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static getPowOut(pow: number): EaseFunc {
            return function (t: number) {
                return 1 - Math.pow(1 - t, pow);
            }
        }

        /**
         * Create: Pow in out.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static getPowInOut(pow: number): EaseFunc {
            return function (t: number) {
                if ((t *= 2) < 1)
                    return 0.5 * Math.pow(t, pow);
                else
                    return 1 - 0.5 * Math.abs(Math.pow(2 - t, pow));
            }
        }

        /**
         * Create: Back in.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static getBackIn(amount: number): EaseFunc {
            return function (t: number) {
                return t * t * ((amount + 1) * t - amount);
            }
        }

        /**
         * Create: Back out.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static getBackOut(amount: number): EaseFunc {
            return function (t) {
                return (--t * t * ((amount + 1) * t + amount) + 1);
            }
        }

        /**
         * Create: Back in out.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static getBackInOut(amount: number): EaseFunc {
            amount *= 1.525;
            return function (t: number) {
                if ((t *= 2) < 1)
                    return 0.5 * (t * t * ((amount + 1) * t - amount));
                else
                    return 0.5 * ((t -= 2) * t * ((amount + 1) * t + amount) + 2);
            }
        }

        /**
         * Create: Elastic in.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static getElasticIn(amplitude: number, period: number): EaseFunc {
            let pi2 = Math.PI * 2;
            return function (t: number) {
                if (t == 0 || t == 1)
                    return t;
                
                let s = period / pi2 * Math.asin(1 / amplitude);
                return -(amplitude * Math.pow(2, 10 * (t -= 1)) * Math.sin((t - s) * pi2 / period));
            }
        }

        /**
         * Create: Elastic out.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static getElasticOut(amplitude: number, period: number): EaseFunc {
            let pi2 = Math.PI * 2;
            return function (t: number) {
                if (t == 0 || t == 1)
                    return t;
                
                let s = period / pi2 * Math.asin(1 / amplitude);
                return (amplitude * Math.pow(2, -10 * t) * Math.sin((t - s) * pi2 / period) + 1);
            }
        }

        /**
         * Create: Elastic in out.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static getElasticInOut(amplitude: number, period: number): EaseFunc {
            let pi2 = Math.PI * 2;
            return function (t: number) {
                let s = period / pi2 * Math.asin(1 / amplitude);
               
                if ((t *= 2) < 1)
                    return -0.5 * (amplitude * Math.pow(2, 10 * (t -= 1)) * Math.sin((t - s) * pi2 / period));
                else
                    return amplitude * Math.pow(2, -10 * (t -= 1)) * Math.sin((t - s) * pi2 / period) * 0.5 + 1;
            }
        }

        ////////////////
        //   EASING   //
        ////////////////

        /**
         * Ease: Back in.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static backIn:EaseFunc = Ease.getBackIn(1.7);

        /**
         * Ease: Back out.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static backOut:EaseFunc = Ease.getBackOut(1.7);

        /**
         * Ease: Back in out.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static backInOut:EaseFunc = Ease.getBackInOut(1.7);

        /**
         * Ease: Circ in.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static circIn:EaseFunc = function(t:number) {
            return -(Math.sqrt(1 - t * t) - 1);
        }

        /**
         * Ease: Circ out.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static circOut:EaseFunc = function(t: number) {
            return Math.sqrt(1 - (--t) * t);
        }

        /**
         * Ease: Circ in out.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static circInOut:EaseFunc = function(t: number) {
            if ((t *= 2) < 1)
                return -0.5 * (Math.sqrt(1 - t * t) - 1);
            else
                return 0.5 * (Math.sqrt(1 - (t -= 2) * t) + 1);
        }

        /**
         * Ease: ounce in.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static bounceIn:EaseFunc = function(t: number) {
            return 1 - Ease.bounceOut(1 - t);
        }

        /**
         * Ease: Bounce out.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static bounceOut:EaseFunc = function(t: number) {
            if (t < 1 / 2.75)           return (7.5625 * t * t);
            else if (t < 2 / 2.75)      return (7.5625 * (t -= 1.5 / 2.75) * t + 0.75);
            else if (t < 2.5 / 2.75)    return (7.5625 * (t -= 2.25 / 2.75) * t + 0.9375);
            else                        return (7.5625 * (t -= 2.625 / 2.75) * t + 0.984375);
        }

        /**
         * Ease: Bounce in out.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static bounceInOut:EaseFunc = function(t: number) {
            if (t < 0.5)
                return Ease.bounceIn(t * 2) * .5;
            else
                return Ease.bounceOut(t * 2 - 1) * 0.5 + 0.5;
        }

        /**
         * Ease: Elastic in.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static elasticIn:EaseFunc = Ease.getElasticIn(1, 0.3);

        /**
         * Ease: Elastic out.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static elasticOut:EaseFunc = Ease.getElasticOut(1, 0.3);

        /**
         * Ease: Elastic in out.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static elasticInOut:EaseFunc = Ease.getElasticInOut(1, 0.3 * 1.5);

        /**
         * Ease: Quad in.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static quadIn:EaseFunc = Ease.getPowIn(2);

        /**
         * Ease: Quad out.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static quadOut:EaseFunc = Ease.getPowOut(2);

        /**
         * Ease: Quad in out.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static quadInOut:EaseFunc = Ease.getPowInOut(2);

        /**
         * Ease: Cubic in.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static cubicIn:EaseFunc = Ease.getPowIn(3);

        /**
         * Ease: Cubic out.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static cubicOut:EaseFunc = Ease.getPowOut(3);

        /**
         * Ease: Cubic in out.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static cubicInOut:EaseFunc = Ease.getPowInOut(3);

        /**
         * Ease: Quart in.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static quartIn:EaseFunc = Ease.getPowIn(4);

        /**
         * Ease: Quart out.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static quartOut:EaseFunc = Ease.getPowOut(4);

        /**
         * Ease: Quart in out.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static quartInOut:EaseFunc = Ease.getPowInOut(4);

        /**
         * Ease: Quint in.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static quintIn:EaseFunc = Ease.getPowIn(5);

        /**
         * Ease: Quint out.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static quintOut:EaseFunc = Ease.getPowOut(5);

        /**
         * Ease: Quint in out.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static quintInOut:EaseFunc = Ease.getPowInOut(5);

        /**
         * Ease: Sine in.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static sineIn:EaseFunc = function(t: number) {
            return 1 - Math.cos(t * Math.PI / 2);
        }

        /**
         * Ease: Sine out.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static sineOut:EaseFunc = function(t: number) {
            return Math.sin(t * Math.PI / 2);
        }

        /**
         * Ease: Sine in out.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static sineInOut:EaseFunc = function(t: number) {
            return -0.5 * (Math.cos(Math.PI * t) - 1)
        }
    }
}