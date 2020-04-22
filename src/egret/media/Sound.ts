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
/// <reference path="SoundChannel.ts" />

namespace egret.sys
{
    let usingChannel:Array<SoundChannel> = [];

    /**
     * @private
     * @param channel
     */
    export function $pushSoundChannel(channel:SoundChannel):void {
        if (usingChannel.indexOf(channel) < 0) {
            usingChannel.push(channel);
        }
    }

    /**
     * @private
     * @param channel
     */
    export function $popSoundChannel(channel:SoundChannel):boolean {
        let index:number = usingChannel.indexOf(channel);
        if (index >= 0) {
            usingChannel.splice(index, 1);
            return true;
        }
        return false;
    }
}

namespace egret
{
    /**
     * The Sound class lets you work with sound in an application.
     * The Sound class lets you create a Sound object, load and play an external audio file into that object.
     * More detailed control of the sound is performed through the SoundChannel
     * @event egret.Event.COMPLETE Dispatch when the audio resource is loaded and ready to play.
     * @event egret.IOErrorEvent.IO_ERROR Dispatch when the audio resource is failed to load.
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/media/Sound.ts
     */
    export interface Sound extends EventDispatcher
    {
        /**
         * Initiates loading of an external audio file from the specified URL.
         * @param url Audio file URL
         * @version Egret 2.4
         * @platform Web,Native
         */
        load(url:string):void;

        /**
         * Generates a new SoundChannel object to play back the sound.
         * @param startTime The initial position in seconds at which playback should start. (default = 0)
         * @param loops Plays, the default value is 0. Greater than 0 to the number of plays, such as 1 to play 1, less than or equal to 0, to loop.
         * @version Egret 2.4
         * @platform Web,Native
         */
        play(startTime?:number, loops?:number):SoundChannel;

        /**
         * Closes the stream, causing any download of data to cease.
         * @version Egret 2.4
         * @platform Web,Native
         */
        close():void;

        /**
         * Type, default is egret.Sound.EFFECT.
         * In the native and runtime environment, while only play a background music, sound length so as not to be too long.
         * @version Egret 2.4
         * @platform Web,Native
         */
        type:string;

        /**
         * Length of the current sound. (in seconds)
         * @version Egret 2.4
         * @platform Web,Native
         * @readOnly
         */
        length:number;
    }

    /**
     * @copy egret.Sound
     */
    export let Sound:
    {
        /**
         * Create Sound object, load an external audio file and play.
         * @param url Audio file URL, Sound will start to load the media if url is not empty.
         * @version Egret 2.4
         * @platform Web,Native
         */
        new():Sound;

        /**
         * Background music.
         * @default "music"
         * @version Egret 2.4
         * @platform Web,Native
         */
        MUSIC:string;

        /**
         * Effect.
         * @default "effect"
         * @version Egret 2.4
         * @platform Web,Native
         */
        EFFECT:string;
    };
}