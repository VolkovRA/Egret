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
    let STATE = "eui.State";
    let ADD_ITEMS = "eui.AddItems";
    let SET_PROPERTY = "eui.SetProperty";
    let SET_STATEPROPERTY = "eui.SetStateProperty";
    let BINDING_PROPERTIES = "eui.Binding.$bindProperties";

    /**
     * @private
     * Code generation tool base class.
     */
    export class CodeBase
    {
        /**
         * @private
         * @returns
         */
        public toCode():string {
            return "";
        }

        /**
         * @private
         */
        public indent:number = 0;

        /**
         * @private
         * Get indented string.
         */
        public getIndent(indent?:number):string {
            if (indent === void 0)
                indent = this.indent;
            let str = "";
            for (let i = 0; i < indent; i++) {
                str += "	";
            }
            return str;
        }
    }

    /**
     * @private
     */
    export class EXClass extends CodeBase
    {
        /**
         * @private
         * Constructor code block.
         */
        public constructCode:EXCodeBlock;

        /**
         * @private
         * Class name, excluding module name.
         */
        public className:string = "";

        /**
         * @private
         * Parent class name, including full module name.
         */
        public superClass:string = "";

        /**
         * @private
         * Internal block.
         */
        private innerClassBlock:EXClass[] = [];

        /**
         * @private
         * Add an inner class.
         */
        public addInnerClass(clazz:EXClass):void {
            if (this.innerClassBlock.indexOf(clazz) == -1) {
                this.innerClassBlock.push(clazz);
            }
        }

        /**
         * @private
         * Variable definition block.
         */
        private variableBlock:EXVariable[] = [];

        /**
         * @private
         * Add variables.
         */
        public addVariable(variableItem:EXVariable):void {
            if (this.variableBlock.indexOf(variableItem) == -1) {
                this.variableBlock.push(variableItem);
            }
        }

        /**
         * @private
         * Get variable definition based on variable name.
         */
        public getVariableByName(name:string):EXVariable {
            let list = this.variableBlock;
            let length = list.length;
            for (let i = 0; i < length; i++) {
                let item = list[i];
                if (item.name == name) {
                    return item;
                }
            }
            return null;
        }

        /**
         * @private
         * Function definition block.
         */
        private functionBlock:EXFunction[] = [];

        /**
         * @private
         * Add function.
         */
        public addFunction(functionItem:EXFunction):void {
            if (this.functionBlock.indexOf(functionItem) == -1) {
                this.functionBlock.push(functionItem);
            }
        }

        /**
         * @private
         * Return function definition block based on function name.
         */
        public getFuncByName(name:string):EXFunction {
            let list = this.functionBlock;
            let length = list.length;
            for (let i = 0; i < length; i++) {
                let item = list[i];
                if (item.name == name) {
                    return item;
                }
            }
            return null;
        }

        /**
         * @private
         * @returns
         */
        public toCode():string {
            let indent = this.indent;
            let indentStr = this.getIndent(indent);
            let indent1Str = this.getIndent(indent + 1);
            let indent2Str = this.getIndent(indent + 2);

            // Print class start block
            let returnStr = indentStr + "(function (";
            if (this.superClass) {
                returnStr += "_super) {\n" + indent1Str + "__extends(" + this.className + ", _super);\n";
            }
            else {
                returnStr += ") {\n";
            }

            // Print a list of internal classes
            let innerClasses = this.innerClassBlock;
            let length = innerClasses.length;
            for (let i = 0; i < length; i++) {
                let clazz = innerClasses[i];
                clazz.indent = indent + 1;
                returnStr += indent1Str + "var " + clazz.className + " = " + clazz.toCode() + "\n\n";
            }

            returnStr += indent1Str + "function " + this.className + "() {\n";
            if (this.superClass) {
                returnStr += indent2Str + "_super.call(this);\n";
            }

            // Print variable list
            let variables = this.variableBlock;
            length = variables.length;
            for (let i = 0; i < length; i++) {
                let variable = variables[i];
                if (variable.defaultValue) {
                    returnStr += indent2Str + variable.toCode() + "\n";
                }
            }

            // Print constructor
            if (this.constructCode) {
                let codes = this.constructCode.toCode().split("\n");
                length = codes.length;
                for (let i = 0; i < length; i++) {
                    let code = codes[i];
                    returnStr += indent2Str + code + "\n";
                }
            }
            returnStr += indent1Str + "}\n";
            returnStr += indent1Str + "var _proto = " + this.className + ".prototype;\n\n";

            // Print function list
            let functions = this.functionBlock;
            length = functions.length;
            for (let i = 0; i < length; i++) {
                let functionItem = functions[i];
                functionItem.indent = indent + 1;
                returnStr += functionItem.toCode() + "\n";
            }

            // Print end of class
            returnStr += indent1Str + "return " + this.className + ";\n" + indentStr;
            if (this.superClass) {
                returnStr += "})(" + this.superClass + ");";
            }
            else {
                returnStr += "})();";
            }
            return returnStr;
        }
    }

    /**
     * @private
     */
    export class EXCodeBlock extends CodeBase
    {
        /**
         * @private
         * Add variable declaration statement.
         * @param name Variable name.
         * @param value Variable initial value.
         */
        public addVar(name:string, value?:string):void {
            let valueStr = value ? " = " + value : "";
            this.addCodeLine("var " + name + valueStr + ";");
        }

        /**
         * @private
         * Add assignment statement.
         * @param target Target to be assigned.
         * @param value Value.
         * @param prop The attribute of the target (accessed with "."), If not filled, it is assigned to the target.
         */
        public addAssignment(target:string, value:string, prop?:string):void {
            let propStr = prop ? "." + prop : "";
            this.addCodeLine(target + propStr + " = " + value + ";");
        }

        /**
         * @private
         * Add return value statement.
         */
        public addReturn(data:string):void {
            this.addCodeLine("return " + data + ";");
        }

        /**
         * @private
         * Add a blank line.
         */
        public addEmptyLine():void {
            this.addCodeLine("");
        }

        /**
         * @private
         * Start adding if statement blocks, and automatically call startBlock();
         */
        public startIf(expression:string):void {
            this.addCodeLine("if(" + expression + ")");
            this.startBlock();
        }

        /**
         * @private
         * Start the else statement block and automatically call startBlock();
         */
        public startElse():void {
            this.addCodeLine("else");
            this.startBlock();
        }

        /**
         * @private
         * Tart else if statement block, automatically call startBlock();
         */
        public startElseIf(expression:string):void {
            this.addCodeLine("else if(" + expression + ")");
            this.startBlock();
        }

        /**
         * @private
         * Add a left brace to start a new statement block.
         */
        public startBlock():void {
            this.addCodeLine("{");
            this.indent++;
        }

        /**
         * @private
         * Add a closing brace to end the current statement block.
         */
        public endBlock():void {
            this.indent--;
            this.addCodeLine("}");
        }

        /**
         * @private
         * Add execution function statement block.
         * @param functionName The name of the function to be executed.
         * @param args Function parameter list.
         */
        public doFunction(functionName:string, args:string[]):void {
            let argsStr = args.join(",");
            this.addCodeLine(functionName + "(" + argsStr + ")");
        }

        /**
         * @private
         */
        private lines:string[] = [];

        /**
         * @private
         * Add a line of code.
         */
        public addCodeLine(code:string):void {
            this.lines.push(this.getIndent() + code);
        }

        /**
         * @private
         * Add a line of code to the specified line.
         */
        public addCodeLineAt(code:string, index:number):void {
            this.lines.splice(index, 0, this.getIndent() + code);
        }

        /**
         * @private
         * Whether there is a line of code.
         */
        public containsCodeLine(code:string):boolean {
            return this.lines.indexOf(code) != -1;
        }

        /**
         * @private
         * Append another block of code at the end.
         */
        public concat(cb:EXCodeBlock):void {
            this.lines = this.lines.concat(cb.lines);
        }

        /**
         * @private
         * @returns
         */
        public toCode():string {
            return this.lines.join("\n");
        }
    }

    /**
     * @private
     */
    export class EXFunction extends CodeBase
    {
        /**
         * @private
         * Code block.
         */
        public codeBlock:EXCodeBlock = null;

        /**
         * @private
         */
        public isGet:boolean = false;

        /**
         * @private
         * Function name.
         */
        public name:string = "";

        /**
         * @private
         * @returns
         */
        public toCode():string {
            let indentStr:string = this.getIndent();
            let indent1Str:string = this.getIndent(this.indent + 1);
            let codeIndent:string;
            let returnStr = indentStr;
            if (this.isGet) {
                codeIndent = this.getIndent(this.indent + 2);
                returnStr += 'Object.defineProperty(_proto, "skinParts", {\n';
                returnStr += indent1Str + "get: function () {\n";
            }
            else {
                codeIndent = indent1Str;
                returnStr += "_proto." + this.name + " = function () {\n";
            }

            if (this.codeBlock) {
                let lines = this.codeBlock.toCode().split("\n");
                let length = lines.length;
                for (let i = 0; i < length; i++) {
                    let line = lines[i];
                    returnStr += codeIndent + line + "\n";
                }
            }
            if (this.isGet) {
                returnStr += indent1Str + "},\n" + indent1Str + "enumerable: true,\n" +
                    indent1Str + "configurable: true\n" + indentStr + "});";
            }
            else {
                returnStr += indentStr + "};";
            }

            return returnStr;
        }
    }

    /**
     * @private
     */
    export class EXVariable extends CodeBase
    {
        /**
         * @private
         */
        public constructor(name:string, defaultValue?:string) {
            super();
            this.indent = 2;
            this.name = name;
            this.defaultValue = defaultValue;
        }

        /**
         * @private
         * Variable name.
         */
        public name:string;

        /**
         * @private
         * Defaults.
         */
        public defaultValue:string;

        /**
         * @private
         * @returns
         */
        public toCode():string {
            if (!this.defaultValue) {
                return "";
            }
            return "this." + this.name + " = " + this.defaultValue + ";";
        }
    }

    /**
     * @private
     */
    export class EXState extends CodeBase
    {
        /**
         * @private
         */
        public constructor(name:string, stateGroups?:any[]) {
            super();
            this.name = name;
            if (stateGroups)
                this.stateGroups = stateGroups;
        }

        /**
         * @private
         * View state name.
         */
        public name:string = "";

        /**
         * @private
         */
        public stateGroups:any[] = [];

        /**
         * @private
         */
        public addItems:any[] = [];

        /**
         * @private
         */
        public setProperty:any[] = [];

        /**
         * @private
         * Add an overlay.
         */
        public addOverride(item:CodeBase):void {
            if (item instanceof EXAddItems)
                this.addItems.push(item);
            else
                this.setProperty.push(item);
        }

        /**
         * @private
         * @returns
         */
        public toCode():string {
            let indentStr:string = this.getIndent(1);
            let returnStr:string = "new " + STATE + " (\"" + this.name + "\",\n" + indentStr + "[\n";
            let index:number = 0;
            let isFirst:boolean = true;
            let overrides:any[] = this.addItems.concat(this.setProperty);
            while (index < overrides.length) {
                if (isFirst)
                    isFirst = false;
                else
                    returnStr += ",\n";
                let item:CodeBase = overrides[index];
                let codes:any[] = item.toCode().split("\n");
                let length:number = codes.length;
                for (let i:number = 0; i < length; i++) {
                    let code:string = codes[i];
                    codes[i] = indentStr + indentStr + code;
                }
                returnStr += codes.join("\n");
                index++;
            }
            returnStr += "\n" + indentStr + "])";
            return returnStr;
        }
    }

    /**
     * @private
     */
    export class EXAddItems extends CodeBase
    {
        /**
         * @private
         */
        public constructor(target:string, property:string, position:number, relativeTo:string) {
            super();
            this.target = target;
            this.property = property;
            this.position = position;
            this.relativeTo = relativeTo;
        }

        /**
         * @private
         * The instance to be added.
         */
        public target:string;

        /**
         * @private
         * The attribute to add to.
         */
        public property:string;

        /**
         * @private
         * Added location.
         */
        public position:number;

        /**
         * @private
         * Relative display element.
         */
        public relativeTo:string;

        /**
         * @private
         * @returns
         */
        public toCode():string {
            let returnStr:string = "new " + ADD_ITEMS + "(\"" + this.target + "\",\"" + this.property + "\"," + this.position + ",\"" + this.relativeTo + "\")";
            return returnStr;
        }
    }

    /**
     * @private
     */
    export class EXSetProperty extends CodeBase
    {
        /**
         * @private
         */
        public constructor(target:string, name:string, value:string) {
            super();
            this.target = target;
            this.name = name;
            this.value = value;
        }

        /**
         * @private
         * The property name to be modified.
         */
        public name:string;

        /**
         * @private
         * Target instance name.
         */
        public target:string;

        /**
         * @private
         * Attribute value.
         */
        public value:string;

        /**
         * @private
         * @returns
         */
        public toCode():string {
            return "new " + SET_PROPERTY + "(\"" + this.target + "\",\"" + this.name + "\"," + this.value + ")";
        }
    }

    /**
     * @private
     */
    export class EXSetStateProperty extends CodeBase
    {
        /**
         * @private
         */
        public constructor(target:string, property:string, templates:string[], chainIndex:number[]) {
            super();
            if (target) {
                target = "this." + target;
            } else {
                target = "this";
            }
            this.target = target;
            this.property = property;
            this.templates = templates;
            this.chainIndex = chainIndex;
        }

        /**
         * @private
         * Target instance name.
         */
        public target:string;

        /**
         * @private
         * Target attribute name.
         */
        public property:string;

        /**
         * @private
         * List of bound templates.
         */
        public templates:string[];

        /**
         * @private
         * ChainIndex is a list of indexes, and each index points to a value in templates, which represents the attribute chain.
         */
        public chainIndex:number[];

        /**
         * @private
         * @returns
         */
        public toCode():string {
            let expression = this.templates.join(",");
            let chain = this.chainIndex.join(",");
            return "new " + SET_STATEPROPERTY + "(this, [" + expression + "]," + "[" + chain + "]," +
                this.target + ",\"" + this.property + "\")";
        }
    }

    /**
     * @private
     */
    export class EXBinding extends CodeBase
    {
        /**
         * @private
         */
        public constructor(target:string, property:string, templates:string[], chainIndex:number[]) {
            super();
            this.target = target;
            this.property = property;
            this.templates = templates;
            this.chainIndex = chainIndex;
        }

        /**
         * @private
         * Target instance name.
         */
        public target:string;

        /**
         * @private
         * Target attribute name.
         */
        public property:string;

        /**
         * @private
         * List of bound templates.
         */
        public templates:string[];

        /**
         * @private
         * ChainIndex is a list of indexes, and each index points to a value in templates, which represents the attribute chain.
         */
        public chainIndex:number[];

        /**
         * @private
         * @returns
         */
        public toCode():string {
            let expression = this.templates.join(",");
            let chain = this.chainIndex.join(",");
            return BINDING_PROPERTIES + "(this, [" + expression + "]," + "[" + chain + "]," +
                this.target + ",\"" + this.property + "\")";
        }
    }
}