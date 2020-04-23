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
     * @private
     */
    export const enum Keys
    {
        clickOffsetX,
        clickOffsetY,
        moveStageX,
        moveStageY,
        touchDownTarget,
        animation,
        slideDuration,
        pendingValue,
        slideToValue,
        liveDragging
    }

    /**
     * The SliderBase class lets users select a value by moving a slider thumb between
     * the end points of the slider track.
     * The current value of the slider is determined by the relative location of the
     * thumb between the end points of the slider,
     * corresponding to the slider's minimum and maximum values.
     * The SliderBase class is a base class for HSlider and VSlider.
     *
     * @event eui.UIEvent.CHANGE_START Dispatched when the scroll position is going to change.
     * @event eui.UIEvent.CHANGE_END Dispatched when the scroll position changed complete.
     * @event egret.Event.CHANGE Dispatched when the scroll position is changing.
     *
     * @see eui.HSlider
     * @see eui.VSlider
     *
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     */
    export class SliderBase extends Range
    {
        /**
         * Constructor.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public constructor() {
            super();
            this.$SliderBase = {
                0: 0,        // clickOffsetX,
                1: 0,        // clickOffsetY,
                2: 0,        // moveStageX,
                3: 0,        // moveStageY,
                4: null,     // touchDownTarget
                5: null,     // animation,
                6: 300,      // slideDuration,
                7: 0,        // pendingValue
                8: 0,        // slideToValue,
                9: true,     // liveDragging
            };
            this.maximum = 10;
            this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegin, this);
        }

        /**
         * @private
         */
        $SliderBase:Object;

        /**
         * [SkinPart] Highlight of track.
         * @skinPart
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public trackHighlight:egret.DisplayObject = null;

        /**
         * [SkinPart] Thumb display object.
         * @skinPart
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public thumb:eui.UIComponent = null;

        /**
         * [SkinPart] Track display object.
         * @skinPart
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public track:eui.UIComponent = null;

        /**
         * Duration in milliseconds for the sliding animation when you tap on the track to move a thumb.
         * @default 300
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public get slideDuration():number {
            return this.$SliderBase[Keys.slideDuration];
        }

        public set slideDuration(value:number) {
            this.$SliderBase[Keys.slideDuration] = +value || 0;
        }

        /**
         * Converts a track-relative x, y pixel location into a value between
         * the minimum and maximum, inclusive.
         * @param x The x coordinate of the location relative to the track's origin.
         * @param y The y coordinate of the location relative to the track's origin.
         * @return A value between the minimum and maximum, inclusive.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        protected pointToValue(x:number, y:number):number {
            return this.minimum;
        }

        /**
         * Specifies whether live dragging is enabled for the slider.
         * If true, sets the value and values properties and dispatches the change event
         * continuously as the user moves the thumb.
         * @default true
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public get liveDragging():boolean {
            return this.$SliderBase[Keys.liveDragging];
        }

        public set liveDragging(value:boolean) {
            this.$SliderBase[Keys.liveDragging] = !!value;
        }

        /**
         * The value the slider will have when the touch is end.
         * This property is updated when the slider thumb moves, even if *liveDragging* is false.
         * If the *liveDragging* style is false, then the slider's value is only set when the touch is end.
         * @default 0
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public get pendingValue():number {
            return this.$SliderBase[Keys.pendingValue];
        }

        public set pendingValue(value:number) {
            value = +value || 0;
            let values = this.$SliderBase;
            if (value === values[Keys.pendingValue])
                return;
            values[Keys.pendingValue] = value;
            this.invalidateDisplayList();
        }

        /**
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        protected setValue(value:number):void {
            this.$SliderBase[Keys.pendingValue] = value;
            super.setValue(value);
        }

        /**
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        protected partAdded(partName:string, instance:any):void {
            super.partAdded(partName, instance);

            if (instance == this.thumb) {
                this.thumb.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onThumbTouchBegin, this);
                this.thumb.addEventListener(egret.Event.RESIZE, this.onTrackOrThumbResize, this);
            }
            else if (instance == this.track) {
                this.track.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTrackTouchBegin, this);
                this.track.addEventListener(egret.Event.RESIZE, this.onTrackOrThumbResize, this);
            }
            else if (instance === this.trackHighlight) {
                this.trackHighlight.touchEnabled = false;
                if (egret.is(this.trackHighlight, "egret.DisplayObjectContainer")) {
                    (<egret.DisplayObjectContainer> this.trackHighlight).touchChildren = false;
                }
            }
        }

        /**
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        protected partRemoved(partName:string, instance:any):void {
            super.partRemoved(partName, instance);

            if (instance == this.thumb) {
                this.thumb.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onThumbTouchBegin, this);
                this.thumb.removeEventListener(egret.Event.RESIZE, this.onTrackOrThumbResize, this);
            }
            else if (instance == this.track) {
                this.track.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTrackTouchBegin, this);
                this.track.removeEventListener(egret.Event.RESIZE, this.onTrackOrThumbResize, this);
            }
        }

        /**
         * @private
         * Slider or track size change event.
         */
        private onTrackOrThumbResize(event:egret.Event):void {
            this.updateSkinDisplayList();
        }

        /**
         * Handle touch-begin events on the scroll thumb.
         * Records the touch begin point in clickOffset.
         * @param The *egret.TouchEvent* object.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        protected onThumbTouchBegin(event:egret.TouchEvent):void {
            let values = this.$SliderBase;
            if (values[Keys.animation] && values[Keys.animation].isPlaying)
                this.stopAnimation();

            let stage = this.$stage;
            stage.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onStageTouchMove, this);
            stage.addEventListener(egret.TouchEvent.TOUCH_END, this.onStageTouchEnd, this);

            let clickOffset = this.thumb.globalToLocal(event.stageX, event.stageY, egret.$TempPoint);

            values[Keys.clickOffsetX] = clickOffset.x;
            values[Keys.clickOffsetY] = clickOffset.y;
            UIEvent.dispatchUIEvent(this, UIEvent.CHANGE_START);
        }

        /**
         * @private
         * Touch mobile events on stage.
         */
        private onStageTouchMove(event:egret.TouchEvent):void {
            let values = this.$SliderBase;
            values[Keys.moveStageX] = event.$stageX;
            values[Keys.moveStageY] = event.$stageY;
            let track = this.track;
            if (!track)
                return;
            let p = track.globalToLocal(values[Keys.moveStageX], values[Keys.moveStageY], egret.$TempPoint);
            let newValue = this.pointToValue(p.x - values[Keys.clickOffsetX], p.y - values[Keys.clickOffsetY]);
            newValue = this.nearestValidValue(newValue, this.snapInterval);
            this.updateWhenTouchMove(newValue);
            event.updateAfterEvent();
        }

        /**
         * Capture touch-move events anywhere on or off the stage.
         * @param newValue New value.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        protected updateWhenTouchMove(newValue:number):void {
            if (newValue != this.$SliderBase[Keys.pendingValue]) {
                if (this.liveDragging) {
                    this.setValue(newValue);
                    this.dispatchEventWith(egret.Event.CHANGE);
                }
                else {
                    this.pendingValue = newValue;
                }
            }
        }

        /**
         * Handle touch-end events anywhere on or off the stage.
         * @param The *egret.Event* Object.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        protected onStageTouchEnd(event:egret.Event):void {
            let stage:egret.Stage = event.$currentTarget;
            stage.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.onStageTouchMove, this);
            stage.removeEventListener(egret.TouchEvent.TOUCH_END, this.onStageTouchEnd, this);
            UIEvent.dispatchUIEvent(this, UIEvent.CHANGE_END);
            let values = this.$SliderBase;
            if (!this.liveDragging && this.value != values[Keys.pendingValue]) {
                this.setValue(values[Keys.pendingValue]);
                this.dispatchEventWith(egret.Event.CHANGE);
            }
        }

        /**
         * @private
         * When pressed on a component, record the pressed child display object.
         */
        private onTouchBegin(event:egret.TouchEvent):void {
            this.$stage.addEventListener(egret.TouchEvent.TOUCH_END, this.stageTouchEndHandler, this);
            this.$SliderBase[Keys.touchDownTarget] = <egret.DisplayObject> (event.$target);
        }

        /**
         * @private
         * At the end, if it does not pop up on touchDownTarget, but when it pops up on another
         * child display object, an additional touch click event is thrown.
         */
        private stageTouchEndHandler(event:egret.TouchEvent):void {
            let target:egret.DisplayObject = event.$target;
            let values = this.$SliderBase;
            event.$currentTarget.removeEventListener(egret.TouchEvent.TOUCH_END, this.stageTouchEndHandler, this);
            if (values[Keys.touchDownTarget] != target && this.contains(<egret.DisplayObject> (target))) {
                egret.TouchEvent.dispatchTouchEvent(this, egret.TouchEvent.TOUCH_TAP, true, true,
                    event.$stageX, event.$stageY, event.touchPointID);
            }
            values[Keys.touchDownTarget] = null;
        }

        /**
         * @private
         * Animation playback update value.
         */
        $animationUpdateHandler(animation:sys.Animation):void {
            this.pendingValue = animation.currentValue;
        }

        /**
         * @private
         * The animation is finished.
         */
        private animationEndHandler(animation:sys.Animation):void {
            this.setValue(this.$SliderBase[Keys.slideToValue]);
            this.dispatchEventWith(egret.Event.CHANGE);
            UIEvent.dispatchUIEvent(this, UIEvent.CHANGE_END);
        }

        /**
         * @private
         * Stop the animation.
         */
        private stopAnimation():void {
            this.$SliderBase[Keys.animation].stop();
            this.setValue(this.nearestValidValue(this.pendingValue, this.snapInterval));
            this.dispatchEventWith(egret.Event.CHANGE);
            UIEvent.dispatchUIEvent(this, UIEvent.CHANGE_END);
        }

        /**
         * Handle touch-begin events for the slider track.
         * We calculate the value based on the new position and then move the thumb to the
         * correct location as well as commit the value.
         * @param The *egret.TouchEvent* Object.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        protected onTrackTouchBegin(event:egret.TouchEvent):void {
            let thumbW = this.thumb ? this.thumb.width : 0;
            let thumbH = this.thumb ? this.thumb.height : 0;
            let offsetX = event.$stageX - (thumbW / 2);
            let offsetY = event.$stageY - (thumbH / 2);
            let p = this.track.globalToLocal(offsetX, offsetY, egret.$TempPoint);

            let rangeValues = this.$Range
            let newValue = this.pointToValue(p.x, p.y);
            newValue = this.nearestValidValue(newValue, rangeValues[sys.RangeKeys.snapInterval]);

            let values = this.$SliderBase;
            if (newValue != values[Keys.pendingValue]) {
                if (values[Keys.slideDuration] != 0) {
                    if (!values[Keys.animation]) {
                        values[Keys.animation] = new sys.Animation(this.$animationUpdateHandler, this);
                        values[Keys.animation].endFunction = this.animationEndHandler;
                    }
                    let animation = values[Keys.animation];
                    if (animation.isPlaying)
                        this.stopAnimation();
                    values[Keys.slideToValue] = newValue;
                    animation.duration = values[Keys.slideDuration] *
                        (Math.abs(values[Keys.pendingValue] - values[Keys.slideToValue]) / (rangeValues[sys.RangeKeys.maximum] - rangeValues[sys.RangeKeys.minimum]));
                    animation.from = values[Keys.pendingValue];
                    animation.to = values[Keys.slideToValue];
                    UIEvent.dispatchUIEvent(this, UIEvent.CHANGE_START);
                    animation.play();
                }
                else {
                    this.setValue(newValue);
                    this.dispatchEventWith(egret.Event.CHANGE);
                }
            }
        }
    }
}