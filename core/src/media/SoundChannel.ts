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

/// <reference path="../events/IEventDispatcher.ts" />

namespace egret
{
    /**
     * The SoundChannel class controls a sound in an application.
     * Every sound is assigned to a sound channel, and the application can have multiple sound channels that are mixed together.
     * The SoundChannel class contains a stop() method, properties for set the volume of the channel.
     *
     * @event egret.Event.SOUND_COMPLETE Dispatch when a sound has finished playing at last time.
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/media/Sound.ts
     */
    export interface SoundChannel extends IEventDispatcher
    {
        /**
         * The volume, ranging from 0 (silent) to 1 (full volume).
         * @version Egret 2.4
         * @platform Web,Native
         */
        volume: number;

        /**
         * When the sound is playing, the position property indicates in seconds the current point that is being played in the sound file.
         * @version Egret 2.4
         * @platform Web,Native
         * @readOnly
         */
        position: number;

        /**
         * Stops the sound playing in the channel.
         * @version Egret 2.4
         * @platform Web,Native
         */
        stop(): void;
    }
}