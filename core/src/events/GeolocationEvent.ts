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
    export interface Geolocation{
        addEventListener<Z>(type: "ioError"
            , listener: (this: Z, e: GeolocationEvent) => void, thisObject: Z, useCapture?: boolean, priority?: number);
        addEventListener(type: string, listener: Function, thisObject: any, useCapture?: boolean, priority?: number);
    }

    /**
     * The GeolocationEvent represents the position and altitude of the device on Earth,
     * and show errors occurred while getting the location of the device.
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/sensor/Geolocation.ts
     * @see http://edn.egret.com/cn/docs/page/662 Get location information.
     */
    export class GeolocationEvent extends Event
    {
        /**
         * The acquisition of the location information failed because of app don't have permission.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static PERMISSION_DENIED: string = "permissionDenied";

        /**
         * The acquisition of the location failed because at least one internal source of position returned an internal error.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static UNAVAILABLE: string = "unavailable";

        /**
         * The position's longitude in decimal degrees.
         * @version Egret 2.4
         * @platform Web,Native
         */
        longitude: number;

        /**
         * The position's latitude in decimal degrees.
         * @version Egret 2.4
         * @platform Web,Native
         */
        latitude: number;

        /**
         * The velocity of the device in meters per second.
         * This value can be null.
         * @version Egret 2.4
         * @platform Web,Native
         */
        speed: number;

        /**
         * The direction in which the device is traveling.
         * This value, specified in degrees, indicates how far off from heading due north the device is.
         * 0 degrees represents true true north, and the direction is determined clockwise (which means that east is 90 degrees and west is 270 degrees).
         * If speed is 0, heading is NaN.
         * If the device is unable to provide heading information, this value is null.
         * @version Egret 2.4
         * @platform Web,Native
         */
        heading: number;

        /**
         * The position's altitude in metres, relative to sea level.
         * This value can be null if the implementation cannot provide the data.
         * @version Egret 2.4
         * @platform Web,Native
         */
        altitude: number;

        /**
         * The accuracy of the latitude and longitude properties, expressed in meters.
         * @version Egret 2.4
         * @platform Web,Native
         */
        accuracy: number;

        /**
         * The accuracy of the altitude expressed in meters.
         * This value can be null.
         * @version Egret 2.4
         * @platform Web,Native
         */
        altitudeAccuracy: number;

        /**
         * The type of error occurred while get the location of the device.
         * The value could be:
         * @see egret.GeolocationEvent.PERMISSION_DENIED
         * @see egret.GeolocationEvent.UNAVAILABLE
         * @version Egret 2.4
         * @platform Web,Native
         */
        errorType: string;

        /**
         * The error message occurred while get the location of the device.
         * @version Egret 2.4
         * @platform Web,Native
         */
        errorMessage: string;
    }
}