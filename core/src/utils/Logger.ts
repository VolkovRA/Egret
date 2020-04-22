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
     * Logger is an entrance for the log processing namespace of the engine.
     * @version Egret 2.4
     * @platform Web,Native
     */
    export class Logger
    {
        /**
         * Open all.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static ALL:string = "all";

        /**
         * Level: DEBUG.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static DEBUG:string = "debug";

        /**
         * Level: INFO.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static INFO:string = "info";

        /**
         * Level: WARN.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static WARN:string = "warn";

        /**
         * Level: ERROR.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static ERROR:string = "error";

        /**
         * Close all.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static OFF:string = "off";

        /**
         * Set the current need to open the log level.
         * Grade level are:
         * 
         * ALL <DEBUG <INFO <WARN <ERROR <OFF
         * 
         * This feature is only in DEBUG mode to take effect.
         * * Logger.ALL - All levels of log can be printed out.
         * * Logger.DEBUG - Print debug, info, log, warn, error.
         * * Logger.INFO - Print info, log, warn, error.
         * * Logger.WARN - Can print warn, error.
         * * Logger.ERROR - You can print error.
         * * Logger.OFF - All closed.
         * @param logLevel LogType from this level to start printing.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static set logLevel(logType:string) {
        }
    }
}