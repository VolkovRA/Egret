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

namespace egret
{
    /**
     * The HttpRequest class downloads data from a URL as text or binary data.
     * It is useful for downloading text files, XML, or other information to be used in a dynamic, data-driven application.
     * A HttpRequest object downloads all of the data from a URL before making it available to code in the applications.
     * It sends out notifications about the progress of the download, which you can monitor through the bytesLoaded and
     * bytesTotal properties, as well as through dispatched events.
     * @event egret.Event.COMPLETE Dispatched when the net request is complete.
     * @event egret.Event.IO_ERROR Dispatched when the net request is failed.
     * @event egret.ProgressEvent.PROGRESS Dispatched when data is received as the download operation progresses.
     * @see egret.HttpMethod
     * @see egret.HttpResponseType
     * @includeExample egret/net/HttpRequestExample.ts
     * @version Egret 2.4
     * @platform Web,Native
     */
    export interface HttpRequest extends EventDispatcher
    {
        /**
         * The data received from the load operation.
         * The format of the data depends on the setting of the responseType property.
         * @readOnly
         * @version Egret 2.4
         * @platform Web,Native
         */
        response: any;

        /**
         * Controls whether the downloaded data is received as text (HttpResponseType.TEXT) or raw binary data (HttpResponseType.ArrayBuffer)<br/>
         * Note:If you attempt to set this property to an invalid value, Egret runtime set the value to HttpResponseType.TEXT.
         * @default egret.HttpResponseType.TEXT
         * @version Egret 2.4
         * @platform Web,Native
         */
        responseType: string;

        /**
         * Can be set to a time in milliseconds.When set to a non-zero value will cause fetching to terminate after the given time has passed.
         * @default egret.HttpResponseType.TEXT
         * @version Egret 5.2.15
         * @platform Web,Native
         */
        timeout:number;

        /**
         * indicates whether or not cross-site Access-Control requests should be made using credentials such as cookies
         * or authorization headers. (This never affects same-site requests.)
         * @default false
         * @version Egret 2.4
         * @platform Web,Native
         */
        withCredentials: boolean;

        /**
         * Initializes a request.<br/>
         * Note: Calling this method for an already active request (one for which open() or openRequest() has already been
         * called) is the equivalent of calling abort().
         * @param url The URL to send the request to.
         * @param method The HTTP method to use, please use the const value in the HttpMethod class.
         * @see egret.HttpMethod
         * @version Egret 2.4
         * @platform Web,Native
         */
        open(url:string, method?:string): void;

        /**
         * Sends the request.
         * @param data The data to send.
         * @version Egret 2.4
         * @platform Web,Native
         */
        send(data?:any): void;

        /**
         * Aborts the request if it has already been sent.
         * @version Egret 2.4
         * @platform Web,Native
         */
        abort(): void;

        /**
         * Returns all the response headers as a string, or null if no response has been received.
         * @version Egret 2.4
         * @platform Web,Native
         */
        getAllResponseHeaders(): string;

        /**
         * Sets the value of an HTTP request header.
         * You must call setRequestHeader() after open().
         * @param header The name of the header whose value is to be set.
         * @param value The value to set as the body of the header.
         * @version Egret 2.4
         * @platform Web,Native
         */
        setRequestHeader(header:string, value:string): void;

        /**
         * Returns the string containing the text of the specified header, or null if either the response has not
         * yet been received or the header doesn't exist in the response.
         * @param header The name of the header whose value is to be get.
         * @version Egret 2.4
         * @platform Web,Native
         */
        getResponseHeader(header:string): string;
    }

    /**
     * Creates a HttpRequest object.
     * @version Egret 2.4
     * @platform Web,Native
     */
    export let HttpRequest:{ new (): HttpRequest };
}