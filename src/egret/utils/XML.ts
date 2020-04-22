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
     * The XMLNode class is the base class for all xml node.
     * @version Egret 2.4
     * @platform Web,Native
     */
    export interface XMLNode
    {
        /**
         * A integer representing the type of the node:
         * * 1 - XML.
         * * 2 - XMLAttribute.
         * * 3 - XMLText.
         * @version Egret 2.4
         * @platform Web,Native
         */
        nodeType:number;

        /**
         * The parent node of this xml node.
         * @version Egret 2.4
         * @platform Web,Native
         */
        parent: XML;
    }

    /**
     * The XML class contains properties for working with XML objects.
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/utils/XML.ts
     */
    export interface XML extends XMLNode
    {
        /**
         * The attributes of this xml node.
         * @version Egret 2.4
         * @platform Web,Native
         */
        attributes:any;

        /**
         * The children of the xml node.
         * @version Egret 2.4
         * @platform Web,Native
         */
        children:XMLNode[];

        /**
         * The full name of this xml node.
         * For example, the name of <s:Button/> is "s:Button".
         * @version Egret 2.4
         * @platform Web,Native
         */
        name:string;

        /**
         * The namesapce prefix of this xml node.
         * For example, the prefix of <s:Button/> is "s".
         * @version Egret 2.4
         * @platform Web,Native
         */
        prefix: string;

        /**
         * The local name of this xml node.
         * For example, the local name of <s:Button/> is "Button".
         * @version Egret 2.4
         * @platform Web,Native
         */
        localName:string;

        /**
         * The namesapce uri of this xml node.
         * For example, the namespace uri of <s:Skin xmlns:s="http://ns.egret.com/eui"/> is "http://ns.egret.com/eui".
         * @version Egret 2.4
         * @platform Web,Native
         */
        namespace: string;
    }

    /**
     * The XMLText class represents a string node in the XML.
     * @version Egret 2.4
     * @platform Web,Native
     */
    export interface XMLText extends XMLNode
    {
        /**
         * The text content.
         * @version Egret 2.4
         * @platform Web,Native
         */
        text:string;
    }

    /**
     * The XML class contains properties for working with XML objects.
     * @version Egret 2.4
     * @platform Web,Native
     */
    export let XML:
    {
        /**
         * Parses a text to XML instance.
         * @param text The text to be parsed.
         */
        parse(text:string):XML;
    };
}