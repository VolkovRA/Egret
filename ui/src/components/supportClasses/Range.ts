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
     */
    export const enum RangeKeys
    {
        maximum,
        maxChanged,
        minimum,
        minChanged,
        value,
        changedValue,
        valueChanged,
        snapInterval,
        snapIntervalChanged,
        explicitSnapInterval
    }
}

namespace eui
{
    /**
     * The Range class holds a value and an allowed range for that value, defined by
     * *minimum* and *maximum* properties.
     *
     * The *value* property is always constrained to be between the current *minimum*
     * and *maximum*, and the *minimum*, and *maximum* are always constrained to be in
     * the proper numerical order, such that *(minimum <= value <= maximum)* is *true*.
     *
     * If the value of the *snapInterval* property is not 0, then the *value* property
     * is also constrained to be a multiple of *snapInterval*.
     *
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @includeExample extension/eui/components/supportClasses/RangeExample.ts
     */
    export class Range extends Component
    {
        /**
         * Constructor.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public constructor() {
            super();
            this.$Range = {
                0: 100,         // maximum
                1: false,       // maxChanged
                2: 0,           // minimum
                3: false,       // minChanged
                4: 0,           // value
                5: 0,           // changedValue
                6: false,       // valueChanged
                7: 1,           // snapInterval
                8: false,       // snapIntervalChanged
                9: false,       // explicitSnapInterval
            };
        }

        /**
         * @private
         */
        $Range:Object;

        /**
         * The maximum valid *value*.
         *
         * Changes to the value property are constrained
         * by *commitProperties()* to be less than or equal to
         * maximum with the *nearestValidValue()* method.
         * @default 100
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public get maximum():number {
            return this.$Range[sys.RangeKeys.maximum];
        }

        public set maximum(value:number) {
            value = +value || 0;
            let values = this.$Range;
            if (value === values[sys.RangeKeys.maximum])
                return;
            values[sys.RangeKeys.maximum] = value;
            values[sys.RangeKeys.maxChanged] = true;
            this.invalidateProperties();
            this.invalidateDisplayList();
        }

        /**
         * The minimum valid *value*.
         *
         * Changes to the value property are constrained by *commitProperties()* to be
         * greater than or equal to minimum with the *nearestValidValue()* method.
         *
         * @default 0
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public get minimum():number {
            return this.$Range[sys.RangeKeys.minimum];
        }

        public set minimum(value:number) {
            value = +value || 0;
            let values = this.$Range;
            if (value === values[sys.RangeKeys.minimum])
                return;
            values[sys.RangeKeys.minimum] = value;
            values[sys.RangeKeys.minChanged] = true;
            this.invalidateProperties();
            this.invalidateDisplayList();
        }

        /**
         * The current value for this range.
         *
         * Changes to the value property are constrained by *commitProperties()* to be greater
         * than or equal to the *minimum* property, less than or equal to the *maximum* property,
         * and a multiple of *snapInterval* with the *nearestValidValue()* method.
         * @default 0
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public get value():number {
            let values = this.$Range;
            return values[sys.RangeKeys.valueChanged] ?
                values[sys.RangeKeys.changedValue] : values[sys.RangeKeys.value];
        }

        public set value(newValue:number) {
            newValue = +newValue || 0;
            this.$setValue(newValue);
        }

        /**
         * @private
         * @param newValue 
         */
        $setValue(newValue:number):boolean {
            if (newValue === this.value)
                return false;
            let values = this.$Range;
            values[sys.RangeKeys.changedValue] = newValue;
            values[sys.RangeKeys.valueChanged] = true;
            this.invalidateProperties();

            return true;
        }

        /**
         * The snapInterval property controls the valid values of the *value* property.
         *
         * If nonzero, valid values are the sum of the *minimum* and integer multiples
         * of this property, for all sums that are less than or equal to the *maximum*.
         *
         * For example, if *minimum* is 10, *maximum* is 20, and this property is 3, then the
         * valid values of this Range are 10, 13, 16, 19, and 20.
         *
         * If the value of this property is zero, then valid values are only constrained
         * to be between minimum and maximum inclusive.
         * @default 1
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public get snapInterval():number {
            return this.$Range[sys.RangeKeys.snapInterval];
        }

        public set snapInterval(value:number) {
            let values = this.$Range;
            values[sys.RangeKeys.explicitSnapInterval] = true;
            value = +value || 0;
            if (value === values[sys.RangeKeys.snapInterval])
                return;
            if (isNaN(value)) {
                values[sys.RangeKeys.snapInterval] = 1;
                values[sys.RangeKeys.explicitSnapInterval] = false;
            }
            else {
                values[sys.RangeKeys.snapInterval] = value;
            }

            values[sys.RangeKeys.snapIntervalChanged] = true;

            this.invalidateProperties();
        }

        /**
         * Processes the properties set on the component.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        protected commitProperties():void {
            super.commitProperties();
            let values = this.$Range;
            if (values[sys.RangeKeys.minimum] > values[sys.RangeKeys.maximum]) {

                if (!values[sys.RangeKeys.maxChanged])
                    values[sys.RangeKeys.minimum] = values[sys.RangeKeys.maximum];
                else
                    values[sys.RangeKeys.maximum] = values[sys.RangeKeys.minimum];
            }

            if (values[sys.RangeKeys.valueChanged] || values[sys.RangeKeys.maxChanged] ||
                values[sys.RangeKeys.minChanged] || values[sys.RangeKeys.snapIntervalChanged]) {
                let currentValue = values[sys.RangeKeys.valueChanged] ?
                    values[sys.RangeKeys.changedValue] : values[sys.RangeKeys.value];
                values[sys.RangeKeys.valueChanged] = false;
                values[sys.RangeKeys.maxChanged] = false;
                values[sys.RangeKeys.minChanged] = false;
                values[sys.RangeKeys.snapIntervalChanged] = false;
                this.setValue(this.nearestValidValue(currentValue, values[sys.RangeKeys.snapInterval]));
            }
        }

        /**
         * @private
         * Fix size to the nearest integer multiple of snapInterval.
         */
        private nearestValidSize(size:number):number {
            let interval:number = this.snapInterval;
            if (interval == 0)
                return size;

            let validSize:number = Math.round(size / interval) * interval;
            return (Math.abs(validSize) < interval) ? interval : validSize;
        }

        /**
         * Returns the sum of the minimum with an integer multiple of *interval* that's
         * closest to *value*, unless *value* is closer to the maximum limit,
         * in which case the maximum is returned.
         *
         * If *interval* is equal to 0, the value is clipped to the minimum and maximum limits.
         *
         * The valid values for a range are defined by the sum of the *minimum* property
         * with multiples of the *interval* and also defined to be less than or equal to the
         * *maximum* property.
         * The maximum need not be a multiple of *snapInterval*.
         *
         * For example, if *minimum* is equal to 1, *maximum* is equal to 6,
         * and *snapInterval* is equal to 2, the valid
         * values for the Range are 1, 3, 5, 6.
         *
         * Similarly, if *minimum* is equal to 2, *maximum* is equal to 9, and *snapInterval*
         * is equal to 1.5, the valid values for the Range are 2, 3.5, 5, 6.5, 8, and 9.
         * @param value The input value.
         * @param interval The value of snapInterval or an integer multiple of snapInterval.
         * @return The valid value that's closest to the input.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        protected nearestValidValue(value:number, interval:number):number {
            let values = this.$Range;
            if (interval == 0)
                return Math.max(values[sys.RangeKeys.minimum], Math.min(values[sys.RangeKeys.maximum], value));

            let maxValue = values[sys.RangeKeys.maximum] - values[sys.RangeKeys.minimum];
            let scale = 1;

            value -= values[sys.RangeKeys.minimum];
            if (interval != Math.round(interval)) {
                let parts = ((1 + interval).toString()).split(".");
                scale = Math.pow(10, parts[1].length);
                maxValue *= scale;
                value = Math.round(value * scale);
                interval = Math.round(interval * scale);
            }

            let lower = Math.max(0, Math.floor(value / interval) * interval);
            let upper = Math.min(maxValue, Math.floor((value + interval) / interval) * interval);
            let validValue = ((value - lower) >= ((upper - lower) / 2)) ? upper : lower;

            return (validValue / scale) + values[sys.RangeKeys.minimum];
        }

        /**
         * Sets the current value for the *value* property.
         *
         * This method assumes that the caller has already used the *nearestValidValue()*
         * method to constrain the value parameter.
         *
         * @param value The new value of the *value* property.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        protected setValue(value:number):void {
            let values = this.$Range;
            if (values[sys.RangeKeys.value] === value)
            return;
            if (values[sys.RangeKeys.maximum] > values[sys.RangeKeys.minimum])
                values[sys.RangeKeys.value] = Math.min(values[sys.RangeKeys.maximum],
                    Math.max(values[sys.RangeKeys.minimum], value));
            else
                values[sys.RangeKeys.value] = value;
            values[sys.RangeKeys.valueChanged] = false;
            this.invalidateDisplayList();
            PropertyEvent.dispatchPropertyEvent(this,PropertyEvent.PROPERTY_CHANGE,"value");
        }

        /**
         * Draws the object and/or sizes and positions its children.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        protected updateDisplayList(w:number, h:number):void {
            super.updateDisplayList(w, h);
            this.updateSkinDisplayList();
        }

        /**
         * Update size and visible of skin parts.
         * Subclasses override this method to update skin parts display based on *minimum*,
         * *maximum* and *value* properties.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        protected updateSkinDisplayList():void {
        }
    }

    registerBindable(Range.prototype,"value");
}