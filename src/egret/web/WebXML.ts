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

namespace egret.web
{
    /**
     * @private
     * XML Node base class.
     */
    export class XMLNode
    {
        /**
         * @private
         */
        public constructor(nodeType:number, parent:XML) {
            this.nodeType = nodeType;
            this.parent = parent;
        }

        /**
         * @private
         * Node type:
         * * 1 - XML.
         * * 2 - XMLAttribute.
         * * 3 - XMLText.
         */
        public nodeType:number;

        /**
         * @private
         * The parent node to which the node belongs.
         */
        public parent:XML;
    }

    /**
     * @private
     * XML Node object.
     */
    export class XML extends XMLNode
    {
        /**
         * @private
         */
        public constructor(localName:string, parent:XML, prefix:string, namespace:string, name:string) {
            super(1, parent);
            this.localName = localName;
            this.prefix = prefix;
            this.namespace = namespace;
            this.name = name;
        }

        /**
         * @private
         * List of attributes on the current node.
         */
        public attributes:{[key:string]:string} = {};

        /**
         * @private
         * List of children of current node.
         */
        public children:XMLNode[] = [];

        /**
         * @private
         * The full name of the node.
         * For example, the name of the node <s Button/> is: s:Button
         */
        public name:string;

        /**
         * @private
         * The namespace prefix of the node.
         * For example, the prefix of node <s:Button/> is: s
         */
        public prefix:string;

        /**
         * @private
         * The local name of the node.
         * For example, the localName of the node <s:Button/> is: Button
         */
        public localName:string;

        /**
         * @private
         * The namespace address of the node.
         * For example, the namespace of the node <s:Skin xmlns: s="http://ns.egret.com/eui"/> is: http://ns.egret.com/eui
         */
        public namespace:string;
    }

    /**
     * @private
     * XML Text node.
     */
    export class XMLText extends XMLNode
    {
        /**
         * @private
         */
        public  constructor(text:string, parent:XML) {
            super(3, parent);
            this.text = text;
        }

        /**
         * @private
         * Text content.
         */
        public text:string;
    }

    let parser = new DOMParser();

    /**
     * @private
     * Parse the string as an XML object.
     * @param text The string to be parsed.
     */
    function parse(text:string):XML {
        let xmlDoc = parser.parseFromString(text, "text/xml");
        let length = xmlDoc.childNodes.length;
        for (let i = 0; i < length; i++) {
            let node = xmlDoc.childNodes[i];
            if (node.nodeType == 1) {
                return parseNode(node, null);
            }
        }
        
        return null;
    }

    /**
     * @private
     * Resolve a node.
     */
    function parseNode(node:Node, parent:XML):XML {
        if(node["localName"]=="parsererror"){
            throw new Error(node.textContent);
        }

        let xml = new XML(node["localName"], parent, node["prefix"], node.namespaceURI, node.nodeName);
        let nodeAttributes = node["attributes"];
        let attributes = xml.attributes;
        let length = nodeAttributes.length;
        for (let i = 0; i < length; i++) {
            let attributeNode = nodeAttributes[i];
            let name = attributeNode.name;
            if (name.indexOf("xmlns:") == 0) {
                continue;
            }
            attributes[name] = attributeNode.value;
            xml["$" + name] = attributeNode.value;
        }
        
        let childNodes = node.childNodes;
        length = childNodes.length;
        let children = xml.children;
        for (let i = 0; i < length; i++) {
            let childNode = childNodes[i];
            let nodeType = childNode.nodeType;
            let childXML:any = null;
            if (nodeType == 1) {
                childXML = parseNode(childNode, xml);
            }
            else if (nodeType == 3) {
                let text = childNode.textContent.trim();
                if (text) {
                    childXML = new XMLText(text, xml);
                }
            }
            if (childXML) {
                children.push(childXML);
            }
        }
        return xml;
    }

    egret.XML = {parse: parse};
}