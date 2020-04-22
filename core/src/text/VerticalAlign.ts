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
     * The VerticalAlign class defines the possible values for the vertical alignment.
     * @see egret.TextField#verticalAlign
     * @version Egret 2.4
     * @platform Web,Native
     */
    export class VerticalAlign
    {
        /**
         * Vertically align content to the top of the container.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        public static TOP:string = "top";

        /**
         * Vertically align content to the bottom of the container.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static BOTTOM:string = "bottom";

        /**
         * Vertically align content in the middle of the container.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static MIDDLE:string = "middle";

        /**
         * Vertical alignment with both edges.
         * Note: TextFiled does not support this alignment method."
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static JUSTIFY:string = "justify";

        /**
         * Align the content of the child items, relative to the container.
         * This operation will adjust uniformly the size of all the child items to be the Content Height of the container.
         * The Content Height of the container is the size of the max. child item.
         * If the size of all child items are less than the height of the container, they will be adjusted to the height of the container.
         * 
         * Note: TextFiled does not support this alignment method.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static CONTENT_JUSTIFY:string = "contentJustify";
    }
}