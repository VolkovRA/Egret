declare namespace egret {
    function registerClass(classDefinition: any, className: string, interfaceNames?: string[]): void;
}
declare var global: any;
declare var __global: any;
declare namespace egret {
    type Nullable<T> = T | null;
    interface IHashObject {
        hashCode: number;
    }
    let $hashCount: number;
    class HashObject implements IHashObject {
        constructor();
        $hashCode: number;
        get hashCode(): number;
    }
}
declare namespace egret {
    interface IEventDispatcher extends HashObject {
        addEventListener(type: string, listener: Function, thisObject: any, useCapture?: boolean, priority?: number): void;
        once(type: string, listener: Function, thisObject: any, useCapture?: boolean, priority?: number): void;
        removeEventListener(type: string, listener: Function, thisObject: any, useCapture?: boolean): void;
        hasEventListener(type: string): boolean;
        dispatchEvent(event: Event): boolean;
        willTrigger(type: string): boolean;
    }
}
declare namespace egret {
    class EventDispatcher extends HashObject implements IEventDispatcher {
        constructor(target?: IEventDispatcher);
        $EventDispatcher: Object;
        $getEventMap(useCapture?: boolean): any;
        addEventListener(type: string, listener: Function, thisObject: any, useCapture?: boolean, priority?: number): void;
        once(type: string, listener: Function, thisObject: any, useCapture?: boolean, priority?: number): void;
        $addListener(type: string, listener: Function, thisObject: any, useCapture?: boolean, priority?: number, dispatchOnce?: boolean): void;
        $insertEventBin(list: any[], type: string, listener: Function, thisObject: any, useCapture?: boolean, priority?: number, dispatchOnce?: boolean): boolean;
        removeEventListener(type: string, listener: Function, thisObject: any, useCapture?: boolean): void;
        $removeEventBin(list: any[], listener: Function, thisObject: any): boolean;
        hasEventListener(type: string): boolean;
        willTrigger(type: string): boolean;
        dispatchEvent(event: Event): boolean;
        $notifyListener(event: Event, capturePhase: boolean): boolean;
        dispatchEventWith(type: string, bubbles?: boolean, data?: any, cancelable?: boolean): boolean;
    }
}
declare namespace egret.sys {
    interface EventBin {
        type: string;
        listener: Function;
        thisObject: any;
        priority: number;
        target: IEventDispatcher;
        useCapture: boolean;
        dispatchOnce: boolean;
    }
}
declare namespace egret {
    const enum RenderMode {
        NONE = 1,
        FILTER = 2,
        CLIP = 3,
        SCROLLRECT = 4
    }
    class DisplayObject extends EventDispatcher {
        constructor();
        $nativeDisplayObject: egret_native.NativeDisplayObject;
        protected createNativeDisplayObject(): void;
        $hasAddToStage: boolean;
        $children: DisplayObject[];
        private $name;
        get name(): string;
        set name(value: string);
        $parent: DisplayObjectContainer;
        get parent(): DisplayObjectContainer;
        $setParent(parent: DisplayObjectContainer): void;
        $onAddToStage(stage: Stage, nestLevel: number): void;
        $onRemoveFromStage(): void;
        $stage: Stage;
        $nestLevel: number;
        $useTranslate: boolean;
        protected $updateUseTransform(): void;
        get stage(): Stage;
        get matrix(): Matrix;
        private $matrix;
        private $matrixDirty;
        $getMatrix(): Matrix;
        set matrix(value: Matrix);
        $setMatrix(matrix: Matrix, needUpdateProperties?: boolean): void;
        private $concatenatedMatrix;
        $getConcatenatedMatrix(): Matrix;
        private $invertedConcatenatedMatrix;
        $getInvertedConcatenatedMatrix(): Matrix;
        $x: number;
        get x(): number;
        $getX(): number;
        set x(value: number);
        $setX(value: number): boolean;
        $y: number;
        get y(): number;
        $getY(): number;
        set y(value: number);
        $setY(value: number): boolean;
        private $scaleX;
        get scaleX(): number;
        set scaleX(value: number);
        $getScaleX(): number;
        $setScaleX(value: number): void;
        private $scaleY;
        get scaleY(): number;
        set scaleY(value: number);
        $getScaleY(): number;
        $setScaleY(value: number): void;
        private $rotation;
        get rotation(): number;
        $getRotation(): number;
        set rotation(value: number);
        $setRotation(value: number): void;
        private $skewX;
        private $skewXdeg;
        get skewX(): number;
        set skewX(value: number);
        $setSkewX(value: number): void;
        private $skewY;
        private $skewYdeg;
        get skewY(): number;
        set skewY(value: number);
        $setSkewY(value: number): void;
        get width(): number;
        $getWidth(): number;
        $explicitWidth: number;
        set width(value: number);
        $setWidth(value: number): void;
        get height(): number;
        $explicitHeight: number;
        $getHeight(): number;
        set height(value: number);
        $setHeight(value: number): void;
        get measuredWidth(): number;
        get measuredHeight(): number;
        $anchorOffsetX: number;
        get anchorOffsetX(): number;
        set anchorOffsetX(value: number);
        $setAnchorOffsetX(value: number): void;
        $anchorOffsetY: number;
        get anchorOffsetY(): number;
        set anchorOffsetY(value: number);
        $setAnchorOffsetY(value: number): void;
        $visible: boolean;
        get visible(): boolean;
        set visible(value: boolean);
        $setVisible(value: boolean): void;
        $displayList: egret.sys.DisplayList;
        private $cacheAsBitmap;
        get cacheAsBitmap(): boolean;
        set cacheAsBitmap(value: boolean);
        $setHasDisplayList(value: boolean): void;
        $cacheDirty: boolean;
        $cacheDirtyUp(): void;
        $alpha: number;
        get alpha(): number;
        set alpha(value: number);
        $setAlpha(value: number): void;
        static defaultTouchEnabled: boolean;
        $touchEnabled: boolean;
        get touchEnabled(): boolean;
        set touchEnabled(value: boolean);
        $getTouchEnabled(): boolean;
        $setTouchEnabled(value: boolean): void;
        $scrollRect: Rectangle;
        get scrollRect(): Rectangle;
        set scrollRect(value: Rectangle);
        private $setScrollRect;
        $blendMode: number;
        get blendMode(): string;
        set blendMode(value: string);
        $maskedObject: DisplayObject;
        $mask: DisplayObject;
        $maskRect: Rectangle;
        get mask(): DisplayObject | Rectangle;
        set mask(value: DisplayObject | Rectangle);
        private $setMaskRect;
        $filters: Array<Filter | CustomFilter>;
        get filters(): Array<Filter | CustomFilter>;
        set filters(value: Array<Filter | CustomFilter>);
        getTransformedBounds(targetCoordinateSpace: DisplayObject, resultRect?: Rectangle): Rectangle;
        getBounds(resultRect?: Rectangle, calculateAnchor?: boolean): egret.Rectangle;
        $getTransformedBounds(targetCoordinateSpace: DisplayObject, resultRect?: Rectangle): Rectangle;
        globalToLocal(stageX?: number, stageY?: number, resultPoint?: Point): Point;
        localToGlobal(localX?: number, localY?: number, resultPoint?: Point): Point;
        $getOriginalBounds(): Rectangle;
        $measureChildBounds(bounds: Rectangle): void;
        $getContentBounds(): Rectangle;
        $measureContentBounds(bounds: Rectangle): void;
        $parentDisplayList: egret.sys.DisplayList;
        $renderNode: sys.RenderNode;
        $renderDirty: boolean;
        $getRenderNode(): sys.RenderNode;
        $updateRenderMode(): void;
        $renderMode: RenderMode;
        private $measureFiltersOffset;
        $getConcatenatedMatrixAt(root: DisplayObject, matrix: Matrix): void;
        $updateRenderNode(): void;
        $hitTest(stageX: number, stageY: number): DisplayObject;
        hitTestPoint(x: number, y: number, shapeFlag?: boolean): boolean;
        static $enterFrameCallBackList: DisplayObject[];
        static $renderCallBackList: DisplayObject[];
        $addListener(type: string, listener: Function, thisObject: any, useCapture?: boolean, priority?: number, dispatchOnce?: boolean): void;
        removeEventListener(type: string, listener: Function, thisObject: any, useCapture?: boolean): void;
        dispatchEvent(event: Event): boolean;
        $getPropagationList(target: DisplayObject): DisplayObject[];
        $dispatchPropagationEvent(event: Event, list: DisplayObject[], targetIndex: number): void;
        willTrigger(type: string): boolean;
        private _tint;
        $tintRGB: number;
        get tint(): number;
        set tint(value: number);
        $sortDirty: boolean;
        sortChildren(): void;
        private _zIndex;
        get zIndex(): number;
        set zIndex(value: number);
        $lastSortedIndex: number;
        sortableChildren: boolean;
    }
}
declare namespace egret {
    class Bitmap extends DisplayObject {
        constructor(value?: Texture);
        protected $texture: Texture;
        $bitmapData: BitmapData;
        protected $bitmapX: number;
        protected $bitmapY: number;
        protected $bitmapWidth: number;
        protected $bitmapHeight: number;
        protected $offsetX: number;
        protected $offsetY: number;
        protected $textureWidth: number;
        protected $textureHeight: number;
        protected $sourceWidth: number;
        protected $sourceHeight: number;
        protected $smoothing: boolean;
        protected $explicitBitmapWidth: number;
        protected $explicitBitmapHeight: number;
        protected createNativeDisplayObject(): void;
        $onAddToStage(stage: Stage, nestLevel: number): void;
        $onRemoveFromStage(): void;
        get texture(): Texture;
        set texture(value: Texture);
        $setTexture(value: Texture): boolean;
        $setBitmapData(value: any): void;
        protected setBitmapDataToWasm(data?: Texture): void;
        $refreshImageData(): void;
        private setImageData;
        $scale9Grid: egret.Rectangle;
        get scale9Grid(): egret.Rectangle;
        set scale9Grid(value: egret.Rectangle);
        protected $setScale9Grid(value: egret.Rectangle): void;
        $fillMode: string;
        get fillMode(): string;
        set fillMode(value: string);
        $setFillMode(value: string): boolean;
        static defaultSmoothing: boolean;
        get smoothing(): boolean;
        set smoothing(value: boolean);
        $setWidth(value: number): boolean;
        $setHeight(value: number): boolean;
        $getWidth(): number;
        $getHeight(): number;
        $measureContentBounds(bounds: Rectangle): void;
        $updateRenderNode(): void;
        private _pixelHitTest;
        get pixelHitTest(): boolean;
        set pixelHitTest(value: boolean);
        $hitTest(stageX: number, stageY: number): DisplayObject;
    }
}
declare namespace egret {
    interface MapLike<T> {
        [key: string]: T;
        [key: number]: T;
    }
    function createMap<T>(): MapLike<T>;
}
declare namespace egret {
    class CompressedTextureData {
        glInternalFormat: number;
        width: number;
        height: number;
        byteArray: Uint8Array;
        face: number;
        level: number;
    }
    const etc_alpha_mask = "etc_alpha_mask";
    const engine_default_empty_texture = "engine_default_empty_texture";
    const is_compressed_texture = "is_compressed_texture";
    const glContext = "glContext";
    const UNPACK_PREMULTIPLY_ALPHA_WEBGL = "UNPACK_PREMULTIPLY_ALPHA_WEBGL";
    class BitmapData extends HashObject {
        width: number;
        height: number;
        $source: any;
        webGLTexture: any;
        format: string;
        $deleteSource: boolean;
        $nativeBitmapData: egret_native.NativeBitmapData;
        readonly compressedTextureData: Array<Array<CompressedTextureData>>;
        debugCompressedTextureURL: string;
        etcAlphaMask: Nullable<BitmapData>;
        constructor(source: any);
        get source(): any;
        set source(value: any);
        static create(type: "arraybuffer", data: ArrayBuffer, callback?: (bitmapData: BitmapData) => void): BitmapData;
        static create(type: "base64", data: string, callback?: (bitmapData: BitmapData) => void): BitmapData;
        $dispose(): void;
        private static _displayList;
        static $addDisplayObject(displayObject: DisplayObject, bitmapData: BitmapData): void;
        static $removeDisplayObject(displayObject: DisplayObject, bitmapData: BitmapData): void;
        static $invalidate(bitmapData: BitmapData): void;
        static $dispose(bitmapData: BitmapData): void;
        private _getCompressedTextureData;
        getCompressed2dTextureData(): CompressedTextureData;
        hasCompressed2d(): boolean;
        clearCompressedTextureData(): void;
    }
}
declare namespace egret {
    const BitmapFillMode: {
        REPEAT: string;
        SCALE: string;
        CLIP: string;
    };
}
declare namespace egret {
    class BlendMode {
        static NORMAL: string;
        static ADD: string;
        static ERASE: string;
    }
}
declare namespace egret.sys {
    function blendModeToNumber(blendMode: string): number;
    function numberToBlendMode(blendMode: number): string;
}
declare namespace egret {
    const CapsStyle: {
        NONE: string;
        ROUND: string;
        SQUARE: string;
    };
}
declare namespace egret {
    class DisplayObjectContainer extends DisplayObject {
        static $EVENT_ADD_TO_STAGE_LIST: DisplayObject[];
        static $EVENT_REMOVE_FROM_STAGE_LIST: DisplayObject[];
        constructor();
        get numChildren(): number;
        setChildrenSortMode(value: string): void;
        addChild(child: DisplayObject): DisplayObject;
        addChildAt(child: DisplayObject, index: number): DisplayObject;
        $doAddChild(child: DisplayObject, index: number, notifyListeners?: boolean): DisplayObject;
        contains(child: DisplayObject): boolean;
        getChildAt(index: number): DisplayObject;
        getChildIndex(child: egret.DisplayObject): number;
        getChildByName(name: string): DisplayObject;
        removeChild(child: DisplayObject): DisplayObject;
        removeChildAt(index: number): DisplayObject;
        $doRemoveChild(index: number, notifyListeners?: boolean): DisplayObject;
        setChildIndex(child: DisplayObject, index: number): void;
        private doSetChildIndex;
        swapChildrenAt(index1: number, index2: number): void;
        swapChildren(child1: DisplayObject, child2: DisplayObject): void;
        private doSwapChildrenAt;
        removeChildren(): void;
        $childAdded(child: DisplayObject, index: number): void;
        $childRemoved(child: DisplayObject, index: number): void;
        $onAddToStage(stage: Stage, nestLevel: number): void;
        $onRemoveFromStage(): void;
        $measureChildBounds(bounds: Rectangle): void;
        $touchChildren: boolean;
        get touchChildren(): boolean;
        $getTouchChildren(): boolean;
        set touchChildren(value: boolean);
        $setTouchChildren(value: boolean): boolean;
        $hitTest(stageX: number, stageY: number): DisplayObject;
        private _sortChildrenFunc;
        sortChildren(): void;
    }
}
declare namespace egret {
    class GradientType {
        static LINEAR: string;
        static RADIAL: string;
    }
}
declare namespace egret {
    class Graphics extends HashObject {
        constructor();
        $renderNode: sys.GraphicsNode;
        $targetDisplay: DisplayObject;
        $targetIsSprite: boolean;
        $setTarget(target: DisplayObject): void;
        private lastX;
        private lastY;
        private fillPath;
        private strokePath;
        private topLeftStrokeWidth;
        private bottomRightStrokeWidth;
        private setStrokeWidth;
        beginFill(color: number, alpha?: number): void;
        beginGradientFill(type: string, colors: number[], alphas: number[], ratios: number[], matrix?: egret.Matrix): void;
        endFill(): void;
        lineStyle(thickness?: number, color?: number, alpha?: number, pixelHinting?: boolean, scaleMode?: string, caps?: string, joints?: CanvasLineJoin, miterLimit?: number, lineDash?: number[]): void;
        drawRect(x: number, y: number, width: number, height: number): void;
        drawRoundRect(x: number, y: number, width: number, height: number, ellipseWidth: number, ellipseHeight?: number): void;
        drawCircle(x: number, y: number, radius: number): void;
        drawEllipse(x: number, y: number, width: number, height: number): void;
        moveTo(x: number, y: number): void;
        lineTo(x: number, y: number): void;
        curveTo(controlX: number, controlY: number, anchorX: number, anchorY: number): void;
        cubicCurveTo(controlX1: number, controlY1: number, controlX2: number, controlY2: number, anchorX: number, anchorY: number): void;
        drawArc(x: number, y: number, radius: number, startAngle: number, endAngle: number, anticlockwise?: boolean): void;
        private dirty;
        private arcBounds;
        clear(): void;
        private minX;
        private minY;
        private maxX;
        private maxY;
        private extendBoundsByPoint;
        private extendBoundsByX;
        private extendBoundsByY;
        private updateNodeBounds;
        private includeLastPosition;
        private updatePosition;
        $measureContentBounds(bounds: Rectangle): void;
        $hitTest(stageX: number, stageY: number): DisplayObject;
        $onRemoveFromStage(): void;
    }
}
declare namespace egret {
    const JointStyle: {
        BEVEL: string;
        MITER: string;
        ROUND: string;
    };
}
declare namespace egret {
    class KTXContainer {
        arrayBuffer: any;
        private static readonly HEADER_LEN;
        private static readonly COMPRESSED_2D;
        private static readonly COMPRESSED_3D;
        private static readonly TEX_2D;
        private static readonly TEX_3D;
        glType: number;
        glTypeSize: number;
        glFormat: number;
        glInternalFormat: number;
        glBaseInternalFormat: number;
        pixelWidth: number;
        pixelHeight: number;
        pixelDepth: number;
        numberOfArrayElements: number;
        numberOfFaces: number;
        numberOfMipmapLevels: number;
        bytesOfKeyValueData: number;
        loadType: number;
        isInvalid: boolean;
        constructor(arrayBuffer: any, facesExpected: number, threeDExpected?: boolean, textureArrayExpected?: boolean);
        uploadLevels(bitmapData: egret.BitmapData, loadMipmaps: boolean): void;
        private _upload2DCompressedLevels;
    }
}
declare namespace egret {
    class Mesh extends Bitmap {
        constructor(value?: Texture);
        protected createNativeDisplayObject(): void;
        protected setBitmapDataToWasm(data?: Texture): void;
        $updateRenderNode(): void;
        private _verticesDirty;
        private _bounds;
        $updateVertices(): void;
        $measureContentBounds(bounds: Rectangle): void;
    }
}
declare namespace egret {
    const OrientationMode: {
        AUTO: string;
        PORTRAIT: string;
        LANDSCAPE: string;
        LANDSCAPE_FLIPPED: string;
    };
}
declare namespace egret {
    let $TextureScaleFactor: number;
    class Texture extends HashObject {
        constructor();
        disposeBitmapData: boolean;
        $bitmapX: number;
        $bitmapY: number;
        $bitmapWidth: number;
        $bitmapHeight: number;
        $offsetX: number;
        $offsetY: number;
        private $textureWidth;
        get textureWidth(): number;
        $getTextureWidth(): number;
        private $textureHeight;
        get textureHeight(): number;
        $getTextureHeight(): number;
        $getScaleBitmapWidth(): number;
        $getScaleBitmapHeight(): number;
        $sourceWidth: number;
        $sourceHeight: number;
        $bitmapData: BitmapData;
        $ktxData: ArrayBuffer;
        $rotated: boolean;
        get bitmapData(): BitmapData;
        set bitmapData(value: BitmapData);
        _setBitmapData(value: BitmapData): void;
        get ktxData(): ArrayBuffer;
        set ktxData(data: ArrayBuffer);
        _setKtxData(value: ArrayBuffer): void;
        $initData(bitmapX: number, bitmapY: number, bitmapWidth: number, bitmapHeight: number, offsetX: number, offsetY: number, textureWidth: number, textureHeight: number, sourceWidth: number, sourceHeight: number, rotated?: boolean): void;
        getPixel32(x: number, y: number): number[];
        getPixels(x: number, y: number, width?: number, height?: number): number[];
        toDataURL(type: string, rect?: egret.Rectangle, encoderOptions?: any): string;
        saveToFile(type: string, filePath: string, rect?: egret.Rectangle): void;
        dispose(): void;
    }
}
declare namespace egret {
    class RenderTexture extends egret.Texture {
        constructor();
        $renderBuffer: sys.RenderBuffer;
        drawToTexture(displayObject: egret.DisplayObject, clipBounds?: Rectangle, scale?: number): boolean;
        getPixel32(x: number, y: number): number[];
        dispose(): void;
    }
}
declare namespace egret {
    class Shape extends DisplayObject {
        constructor();
        protected createNativeDisplayObject(): void;
        $graphics: Graphics;
        get graphics(): Graphics;
        $measureContentBounds(bounds: Rectangle): void;
        $hitTest(stageX: number, stageY: number): DisplayObject;
        $onRemoveFromStage(): void;
    }
}
declare namespace egret {
    class Sprite extends DisplayObjectContainer {
        constructor();
        protected createNativeDisplayObject(): void;
        $graphics: Graphics;
        get graphics(): Graphics;
        $hitTest(stageX: number, stageY: number): DisplayObject;
        $measureContentBounds(bounds: Rectangle): void;
        $onRemoveFromStage(): void;
    }
}
declare namespace egret {
    class SpriteSheet extends HashObject {
        constructor(texture: Texture);
        private _bitmapX;
        private _bitmapY;
        $texture: Texture;
        _textureMap: MapLike<Texture>;
        getTexture(name: string): Texture;
        createTexture(name: string, bitmapX: number, bitmapY: number, bitmapWidth: number, bitmapHeight: number, offsetX?: number, offsetY?: number, textureWidth?: number, textureHeight?: number): Texture;
        dispose(): void;
    }
}
declare namespace egret {
    class Stage extends DisplayObjectContainer {
        constructor();
        protected createNativeDisplayObject(): void;
        get frameRate(): number;
        set frameRate(value: number);
        $stageWidth: number;
        get stageWidth(): number;
        $stageHeight: number;
        get stageHeight(): number;
        invalidate(): void;
        registerImplementation(interfaceName: string, instance: any): void;
        getImplementation(interfaceName: string): any;
        $screen: egret.sys.Screen;
        $scaleMode: string;
        get scaleMode(): string;
        set scaleMode(value: string);
        $orientation: string;
        set orientation(value: string);
        get orientation(): string;
        get textureScaleFactor(): number;
        set textureScaleFactor(value: number);
        $maxTouches: number;
        get maxTouches(): number;
        set maxTouches(value: number);
        setContentSize(width: number, height: number): void;
        $drawToSurfaceAutoClear: () => void;
        $drawToSurface: () => void;
        $resize: (width: any, height: any) => void;
    }
}
declare namespace egret {
    const ChildrenSortMode: {
        DEFAULT: string;
        INCREASE_Y: string;
        DECREASE_Y: string;
    };
}
declare namespace egret {
    class Event extends HashObject {
        static ADDED_TO_STAGE: string;
        static REMOVED_FROM_STAGE: string;
        static ADDED: string;
        static REMOVED: string;
        static ENTER_FRAME: string;
        static RENDER: string;
        static RESIZE: string;
        static CHANGE: string;
        static CHANGING: string;
        static COMPLETE: string;
        static LOOP_COMPLETE: string;
        static FOCUS_IN: string;
        static FOCUS_OUT: string;
        static ENDED: string;
        static ACTIVATE: string;
        static DEACTIVATE: string;
        static CLOSE: string;
        static CONNECT: string;
        static LEAVE_STAGE: string;
        static SOUND_COMPLETE: string;
        constructor(type: string, bubbles?: boolean, cancelable?: boolean, data?: any);
        data: any;
        $type: string;
        get type(): string;
        $bubbles: boolean;
        get bubbles(): boolean;
        $cancelable: boolean;
        get cancelable(): boolean;
        $eventPhase: number;
        get eventPhase(): number;
        $currentTarget: any;
        get currentTarget(): any;
        $target: any;
        get target(): any;
        $setTarget(target: any): boolean;
        $isDefaultPrevented: boolean;
        isDefaultPrevented(): boolean;
        preventDefault(): void;
        $isPropagationStopped: boolean;
        stopPropagation(): void;
        $isPropagationImmediateStopped: boolean;
        stopImmediatePropagation(): void;
        protected clean(): void;
        static dispatchEvent(target: IEventDispatcher, type: string, bubbles?: boolean, data?: any): boolean;
        static _getPropertyData(EventClass: any): any;
        static create<T extends Event>(EventClass: {
            new (type: string, bubbles?: boolean, cancelable?: boolean): T;
            eventPool?: Event[];
        }, type: string, bubbles?: boolean, cancelable?: boolean): T;
        static release(event: Event): void;
    }
}
declare namespace egret {
    const enum EventPhase {
        CAPTURING_PHASE = 1,
        AT_TARGET = 2,
        BUBBLING_PHASE = 3
    }
}
declare namespace egret {
    class FocusEvent extends egret.Event {
        static FOCUS_IN: string;
        static FOCUS_OUT: string;
        constructor(type: string, bubbles?: boolean, cancelable?: boolean);
    }
}
declare namespace egret {
    interface Geolocation {
        addEventListener<Z>(type: "ioError", listener: (this: Z, e: GeolocationEvent) => void, thisObject: Z, useCapture?: boolean, priority?: number): any;
        addEventListener(type: string, listener: Function, thisObject: any, useCapture?: boolean, priority?: number): any;
    }
    class GeolocationEvent extends Event {
        static PERMISSION_DENIED: string;
        static UNAVAILABLE: string;
        longitude: number;
        latitude: number;
        speed: number;
        heading: number;
        altitude: number;
        accuracy: number;
        altitudeAccuracy: number;
        errorType: string;
        errorMessage: string;
    }
}
declare namespace egret {
    class HTTPStatusEvent extends Event {
        static HTTP_STATUS: string;
        constructor(type: string, bubbles?: boolean, cancelable?: boolean);
        private _status;
        get status(): number;
        static dispatchHTTPStatusEvent(target: IEventDispatcher, status: number): boolean;
    }
}
declare namespace egret {
    interface HttpRequest {
        addEventListener<Z>(type: "ioError", listener: (this: Z, e: IOErrorEvent) => void, thisObject: Z, useCapture?: boolean, priority?: number): any;
        addEventListener(type: string, listener: Function, thisObject: any, useCapture?: boolean, priority?: number): any;
    }
    class IOErrorEvent extends Event {
        static IO_ERROR: string;
        constructor(type: string, bubbles?: boolean, cancelable?: boolean);
        static dispatchIOErrorEvent(target: IEventDispatcher): boolean;
    }
}
declare namespace egret {
    class MotionEvent extends Event {
        acceleration: DeviceAcceleration;
        accelerationIncludingGravity: DeviceAcceleration;
        rotationRate: DeviceRotationRate;
    }
}
declare namespace egret {
    class OrientationEvent extends Event {
        alpha: number;
        beta: number;
        gamma: number;
    }
}
declare namespace egret {
    interface HttpRequest {
        addEventListener<Z>(type: "progress", listener: (this: Z, e: ProgressEvent) => void, thisObject: Z, useCapture?: boolean, priority?: number): any;
        addEventListener(type: string, listener: Function, thisObject: any, useCapture?: boolean, priority?: number): any;
    }
    class ProgressEvent extends egret.Event {
        static PROGRESS: string;
        static SOCKET_DATA: string;
        bytesLoaded: number;
        bytesTotal: number;
        constructor(type: string, bubbles?: boolean, cancelable?: boolean, bytesLoaded?: number, bytesTotal?: number);
        static dispatchProgressEvent(target: IEventDispatcher, type: string, bytesLoaded?: number, bytesTotal?: number): boolean;
    }
}
declare namespace egret {
    interface Stage {
        addEventListener<Z>(type: "orientationChange", listener: (this: Z, e: StageOrientationEvent) => void, thisObject: Z, useCapture?: boolean, priority?: number): any;
        addEventListener(type: string, listener: Function, thisObject: any, useCapture?: boolean, priority?: number): any;
    }
    class StageOrientationEvent extends Event {
        static ORIENTATION_CHANGE: string;
        constructor(type: string, bubbles?: boolean, cancelable?: boolean);
        static dispatchStageOrientationEvent(target: IEventDispatcher, type: string): boolean;
    }
}
declare namespace egret {
    class TextEvent extends Event {
        constructor(type: string, bubbles?: boolean, cancelable?: boolean, text?: string);
        static LINK: string;
        text: string;
        static dispatchTextEvent(target: IEventDispatcher, type: string, text: string): boolean;
    }
}
declare namespace egret {
    interface Timer {
        addEventListener<Z>(type: "timer" | "timerComplete", listener: (this: Z, e: TimerEvent) => void, thisObject: Z, useCapture?: boolean, priority?: number): any;
        addEventListener(type: string, listener: Function, thisObject: any, useCapture?: boolean, priority?: number): any;
    }
    class TimerEvent extends Event {
        static TIMER: string;
        static TIMER_COMPLETE: string;
        constructor(type: string, bubbles?: boolean, cancelable?: boolean);
        updateAfterEvent(): void;
        static dispatchTimerEvent(target: IEventDispatcher, type: string, bubbles?: boolean, cancelable?: boolean): boolean;
    }
}
declare namespace egret {
    class Point extends HashObject {
        static release(point: Point): void;
        static create(x: number, y: number): Point;
        constructor(x?: number, y?: number);
        x: number;
        y: number;
        get length(): number;
        setTo(x: number, y: number): Point;
        clone(): Point;
        equals(toCompare: Point): boolean;
        static distance(p1: Point, p2: Point): number;
        copyFrom(sourcePoint: Point): void;
        add(v: Point): Point;
        static interpolate(pt1: Point, pt2: Point, f: number): Point;
        normalize(thickness: number): void;
        offset(dx: number, dy: number): void;
        static polar(len: number, angle: number): Point;
        subtract(v: Point): Point;
        toString(): string;
    }
    let $TempPoint: Point;
}
declare namespace egret {
    interface DisplayObject {
        addEventListener<Z>(type: "touchMove" | "touchBegin" | "touchEnd" | "touchCancel" | "touchTap" | "touchReleaseOutside" | "touchRollOut" | "touchRollOver", listener: (this: Z, e: TouchEvent) => void, thisObject: Z, useCapture?: boolean, priority?: number): any;
        addEventListener(type: string, listener: Function, thisObject: any, useCapture?: boolean, priority?: number): any;
    }
    class TouchEvent extends Event {
        static TOUCH_MOVE: string;
        static TOUCH_BEGIN: string;
        static TOUCH_END: string;
        static TOUCH_CANCEL: string;
        static TOUCH_TAP: string;
        static TOUCH_RELEASE_OUTSIDE: string;
        constructor(type: string, bubbles?: boolean, cancelable?: boolean, stageX?: number, stageY?: number, touchPointID?: number);
        $initTo(stageX: number, stageY: number, touchPointID: number): void;
        $stageX: number;
        get stageX(): number;
        $stageY: number;
        get stageY(): number;
        private _localX;
        get localX(): number;
        private _localY;
        get localY(): number;
        private targetChanged;
        private getLocalXY;
        $setTarget(target: any): boolean;
        touchPointID: number;
        updateAfterEvent(): void;
        touchDown: boolean;
        static dispatchTouchEvent(target: IEventDispatcher, type: string, bubbles?: boolean, cancelable?: boolean, stageX?: number, stageY?: number, touchPointID?: number, touchDown?: boolean): boolean;
    }
}
declare namespace egret {
    interface ExternalInterface {
    }
    let ExternalInterface: {
        call(functionName: string, value: string): void;
        addCallback(functionName: string, listener: (value: string) => void): void;
    };
}
declare namespace egret.web {
    class WebExternalInterface implements ExternalInterface {
        static call(functionName: string, value: string): void;
        static addCallback(functionName: string, listener: (value: any) => void): void;
    }
}
declare namespace egret.web {
    class NativeExternalInterface implements ExternalInterface {
        static call(functionName: string, value: string): void;
        static addCallback(functionName: string, listener: (value: any) => void): void;
    }
}
declare namespace egret.web {
    class WebViewExternalInterface implements ExternalInterface {
        static call(functionName: string, value: string): void;
        static addCallback(functionName: string, listener: (value: any) => void): void;
        static invokeCallback(functionName: string, value: string): void;
    }
}
declare namespace egret {
    const enum BitmapFilterQuality {
        LOW = 1,
        MEDIUM = 2,
        HIGH = 3
    }
}
declare namespace egret {
    class Filter extends HashObject {
        type: string;
        $id: number;
        $uniforms: any;
        protected paddingTop: number;
        protected paddingBottom: number;
        protected paddingLeft: number;
        protected paddingRight: number;
        $obj: any;
        constructor();
        $toJson(): string;
        protected updatePadding(): void;
        onPropertyChange(): void;
    }
}
declare namespace egret {
    class BlurFilter extends Filter {
        constructor(blurX?: number, blurY?: number, quality?: number);
        blurXFilter: IBlurXFilter;
        blurYFilter: IBlurYFilter;
        $quality: number;
        get blurX(): number;
        set blurX(value: number);
        $blurX: number;
        get blurY(): number;
        set blurY(value: number);
        $blurY: number;
        $toJson(): string;
        protected updatePadding(): void;
        onPropertyChange(): void;
    }
    interface IBlurXFilter extends Filter {
        type: string;
        $uniforms: any;
        blurX: number;
    }
    interface IBlurYFilter extends Filter {
        type: string;
        $uniforms: any;
        blurY: number;
    }
}
declare namespace egret {
    class ColorMatrixFilter extends Filter {
        $matrix: number[];
        private matrix2;
        constructor(matrix?: number[]);
        get matrix(): number[];
        set matrix(value: number[]);
        private setMatrix;
        $toJson(): string;
    }
}
declare namespace egret {
    class CustomFilter extends Filter {
        $vertexSrc: string;
        $fragmentSrc: string;
        $shaderKey: string;
        type: string;
        private $padding;
        get padding(): number;
        set padding(value: number);
        get uniforms(): any;
        constructor(vertexSrc: string, fragmentSrc: string, uniforms?: any);
        onPropertyChange(): void;
    }
}
declare namespace egret {
    class GlowFilter extends Filter {
        $red: number;
        $green: number;
        $blue: number;
        constructor(color?: number, alpha?: number, blurX?: number, blurY?: number, strength?: number, quality?: number, inner?: boolean, knockout?: boolean);
        $color: number;
        get color(): number;
        set color(value: number);
        $alpha: number;
        get alpha(): number;
        set alpha(value: number);
        $blurX: number;
        get blurX(): number;
        set blurX(value: number);
        $blurY: number;
        get blurY(): number;
        set blurY(value: number);
        $strength: number;
        get strength(): number;
        set strength(value: number);
        $quality: number;
        get quality(): number;
        set quality(value: number);
        $inner: boolean;
        get inner(): boolean;
        set inner(value: boolean);
        $knockout: boolean;
        get knockout(): boolean;
        set knockout(value: boolean);
        $toJson(): string;
        protected updatePadding(): void;
    }
}
declare namespace egret {
    class DropShadowFilter extends GlowFilter {
        constructor(distance?: number, angle?: number, color?: number, alpha?: number, blurX?: number, blurY?: number, strength?: number, quality?: number, inner?: boolean, knockout?: boolean, hideObject?: boolean);
        $distance: number;
        get distance(): number;
        set distance(value: number);
        $angle: number;
        get angle(): number;
        set angle(value: number);
        $hideObject: boolean;
        get hideObject(): boolean;
        set hideObject(value: boolean);
        $toJson(): string;
        protected updatePadding(): void;
    }
}
declare namespace egret {
    class Matrix extends HashObject {
        static release(matrix: Matrix): void;
        static create(): Matrix;
        constructor(a?: number, b?: number, c?: number, d?: number, tx?: number, ty?: number);
        a: number;
        b: number;
        c: number;
        d: number;
        tx: number;
        ty: number;
        clone(): Matrix;
        concat(other: Matrix): void;
        copyFrom(other: Matrix): Matrix;
        identity(): void;
        invert(): void;
        $invertInto(target: Matrix): void;
        rotate(angle: number): void;
        scale(sx: number, sy: number): void;
        setTo(a: number, b: number, c: number, d: number, tx: number, ty: number): Matrix;
        transformPoint(pointX: number, pointY: number, resultPoint?: Point): Point;
        translate(dx: number, dy: number): void;
        equals(other: Matrix): boolean;
        prepend(a: number, b: number, c: number, d: number, tx: number, ty: number): Matrix;
        append(a: number, b: number, c: number, d: number, tx: number, ty: number): Matrix;
        deltaTransformPoint(point: Point): Point;
        toString(): string;
        createBox(scaleX: number, scaleY: number, rotation?: number, tx?: number, ty?: number): void;
        createGradientBox(width: number, height: number, rotation?: number, tx?: number, ty?: number): void;
        $transformBounds(bounds: Rectangle): void;
        private getDeterminant;
        $getScaleX(): number;
        $getScaleY(): number;
        $getSkewX(): number;
        $getSkewY(): number;
        $updateScaleAndRotation(scaleX: number, scaleY: number, skewX: number, skewY: number): void;
        $preMultiplyInto(other: Matrix, target: Matrix): void;
    }
    let $TempMatrix: Matrix;
}
declare namespace egret {
    class Rectangle extends HashObject {
        static release(rect: Rectangle): void;
        static create(): Rectangle;
        constructor(x?: number, y?: number, width?: number, height?: number);
        x: number;
        y: number;
        width: number;
        height: number;
        get right(): number;
        set right(value: number);
        get bottom(): number;
        set bottom(value: number);
        get left(): number;
        set left(value: number);
        get top(): number;
        set top(value: number);
        get topLeft(): Point;
        set topLeft(value: Point);
        get bottomRight(): Point;
        set bottomRight(value: Point);
        copyFrom(sourceRect: Rectangle): Rectangle;
        setTo(x: number, y: number, width: number, height: number): Rectangle;
        contains(x: number, y: number): boolean;
        intersection(toIntersect: Rectangle): Rectangle;
        inflate(dx: number, dy: number): void;
        $intersectInPlace(clipRect: Rectangle): Rectangle;
        intersects(toIntersect: Rectangle): boolean;
        isEmpty(): boolean;
        setEmpty(): void;
        clone(): Rectangle;
        containsPoint(point: Point): boolean;
        containsRect(rect: egret.Rectangle): boolean;
        equals(toCompare: Rectangle): boolean;
        inflatePoint(point: Point): void;
        offset(dx: number, dy: number): void;
        offsetPoint(point: Point): void;
        toString(): string;
        union(toUnion: Rectangle): Rectangle;
        $getBaseWidth(angle: number): number;
        $getBaseHeight(angle: number): number;
    }
    let $TempRectangle: Rectangle;
}
declare namespace egret {
    let $locale_strings: any;
    let $language: string;
}
declare namespace egret.sys {
    function tr(code: number, ...args: any[]): string;
}
declare namespace egret {
}
declare namespace egret.localStorage {
    let getItem: (key: string) => string;
    let setItem: (key: string, value: string) => boolean;
    let removeItem: (key: string) => void;
    let clear: () => void;
}
declare namespace egret.localStorage.web {
}
declare namespace egret {
    interface SoundChannel extends IEventDispatcher {
        volume: number;
        position: number;
        stop(): void;
    }
}
declare namespace egret.sys {
    function $pushSoundChannel(channel: SoundChannel): void;
    function $popSoundChannel(channel: SoundChannel): boolean;
}
declare namespace egret {
    interface Sound extends EventDispatcher {
        load(url: string): void;
        play(startTime?: number, loops?: number): SoundChannel;
        close(): void;
        type: string;
        length: number;
    }
    let Sound: {
        new (): Sound;
        MUSIC: string;
        EFFECT: string;
    };
}
declare namespace egret {
    interface Video extends DisplayObject {
        load(url: string, cache?: boolean): void;
        play(startTime?: number, loop?: boolean): any;
        close(): void;
        src: string;
        poster: string;
        fullscreen: boolean;
        volume: number;
        position: number;
        pause(): void;
        bitmapData?: BitmapData;
        paused: boolean;
        length: number;
    }
    let Video: {
        new (url?: string, cache?: boolean): Video;
    };
}
declare namespace egret.web {
    class HtmlSound extends egret.EventDispatcher implements egret.Sound {
        static MUSIC: string;
        static EFFECT: string;
        type: string;
        private url;
        private originAudio;
        private loaded;
        constructor();
        get length(): number;
        load(url: string): void;
        play(startTime?: number, loops?: number): SoundChannel;
        close(): void;
        private static audios;
        private static clearAudios;
        static $clear(url: string): void;
        static $pop(url: string): HTMLAudioElement;
        static $recycle(url: string, audio: HTMLAudioElement): void;
    }
}
declare namespace egret.web {
    class HtmlSoundChannel extends egret.EventDispatcher implements egret.SoundChannel {
        $url: string;
        $loops: number;
        $startTime: number;
        private audio;
        private isStopped;
        constructor(audio: HTMLAudioElement);
        private canPlay;
        $play(): void;
        private onPlayEnd;
        stop(): void;
        private _volume;
        get volume(): number;
        set volume(value: number);
        get position(): number;
    }
}
interface AudioBufferSourceNodeEgret {
    buffer: any;
    context: any;
    onended: Function;
    stop(when?: number): void;
    noteOff(when?: number): void;
    addEventListener(type: string, listener: Function, useCapture?: boolean): any;
    removeEventListener(type: string, listener: Function, useCapture?: boolean): any;
    disconnect(): any;
}
declare namespace egret.web {
    class WebAudioDecode {
        static ctx: any;
        static decodeArr: any[];
        private static isDecoding;
        static decodeAudios(): void;
    }
    class WebAudioSound extends egret.EventDispatcher implements egret.Sound {
        static MUSIC: string;
        static EFFECT: string;
        type: string;
        private url;
        private loaded;
        constructor();
        private audioBuffer;
        get length(): number;
        load(url: string): void;
        play(startTime?: number, loops?: number): SoundChannel;
        close(): void;
    }
}
declare namespace egret.web {
    class WebAudioSoundChannel extends egret.EventDispatcher implements egret.SoundChannel {
        $url: string;
        $loops: number;
        $startTime: number;
        $audioBuffer: AudioBuffer;
        private gain;
        private bufferSource;
        private context;
        private isStopped;
        constructor();
        private _currentTime;
        private _volume;
        $play(): void;
        stop(): void;
        private onPlayEnd;
        get volume(): number;
        set volume(value: number);
        private _startTime;
        get position(): number;
    }
}
declare namespace egret.sys {
    const enum RenderNodeType {
        BitmapNode = 1,
        TextNode = 2,
        GraphicsNode = 3,
        GroupNode = 4,
        MeshNode = 5,
        NormalBitmapNode = 6
    }
    class RenderNode {
        type: number;
        drawData: any[];
        protected renderCount: number;
        cleanBeforeRender(): void;
        $getRenderCount(): number;
    }
}
declare namespace egret.sys {
    class NormalBitmapNode extends RenderNode {
        constructor();
        image: BitmapData;
        smoothing: boolean;
        imageWidth: number;
        imageHeight: number;
        rotated: boolean;
        sourceX: number;
        sourceY: number;
        sourceW: number;
        sourceH: number;
        drawX: number;
        drawY: number;
        drawW: number;
        drawH: number;
        drawImage(sourceX: number, sourceY: number, sourceW: number, sourceH: number, drawX: number, drawY: number, drawW: number, drawH: number): void;
        cleanBeforeRender(): void;
    }
}
declare namespace egret.sys {
    class BitmapNode extends RenderNode {
        constructor();
        image: BitmapData;
        smoothing: boolean;
        matrix: egret.Matrix;
        imageWidth: number;
        imageHeight: number;
        blendMode: number;
        alpha: number;
        filter: ColorMatrixFilter;
        rotated: boolean;
        drawImage(sourceX: number, sourceY: number, sourceW: number, sourceH: number, drawX: number, drawY: number, drawW: number, drawH: number): void;
        cleanBeforeRender(): void;
        static $updateTextureData(node: sys.NormalBitmapNode, image: BitmapData, bitmapX: number, bitmapY: number, bitmapWidth: number, bitmapHeight: number, offsetX: number, offsetY: number, textureWidth: number, textureHeight: number, destW: number, destH: number, sourceWidth: number, sourceHeight: number, fillMode: string, smoothing: boolean): void;
        static $updateTextureDataWithScale9Grid(node: sys.NormalBitmapNode, image: BitmapData, scale9Grid: egret.Rectangle, bitmapX: number, bitmapY: number, bitmapWidth: number, bitmapHeight: number, offsetX: number, offsetY: number, textureWidth: number, textureHeight: number, destW: number, destH: number, sourceWidth: number, sourceHeight: number, smoothing: boolean): void;
        private static drawClipImage;
    }
}
declare namespace egret {
    namespace RuntimeType {
        const WEB = "web";
        const NATIVE = "native";
        const RUNTIME2 = "runtime2";
        const MYGAME = "mygame";
        const WXGAME = "wxgame";
        const BAIDUGAME = "baidugame";
        const QGAME = "qgame";
        const OPPOGAME = "oppogame";
        const QQGAME = "qqgame";
        const VIVOGAME = "vivogame";
    }
    interface SupportedCompressedTexture {
        pvrtc: boolean;
        etc1: boolean;
    }
    class Capabilities {
        static readonly language: string;
        static readonly isMobile: boolean;
        static readonly os: string;
        static readonly runtimeType: string;
        static readonly engineVersion: string;
        static readonly renderMode: string;
        static readonly boundingClientWidth: number;
        static readonly boundingClientHeight: number;
        static supportedCompressedTexture: SupportedCompressedTexture;
    }
}
declare namespace egret.web {
    class WebVideo extends egret.DisplayObject implements egret.Video {
        src: string;
        poster: string;
        private posterData;
        private video;
        private loaded;
        private closed;
        private heightSet;
        private widthSet;
        private waiting;
        private userPause;
        private userPlay;
        constructor(url?: string, cache?: boolean);
        protected createNativeDisplayObject(): void;
        load(url?: string, cache?: boolean): void;
        private isPlayed;
        play(startTime?: number, loop?: boolean): void;
        private videoPlay;
        private checkFullScreen;
        private goFullscreen;
        private setFullScreenMonitor;
        private screenError;
        private screenChanged;
        private exitFullscreen;
        private onVideoEnded;
        private onVideoError;
        close(): void;
        pause(): void;
        get volume(): number;
        set volume(value: number);
        get position(): number;
        set position(value: number);
        private _fullscreen;
        get fullscreen(): boolean;
        set fullscreen(value: boolean);
        private _bitmapData;
        get bitmapData(): BitmapData;
        private loadPoster;
        private onVideoLoaded;
        $measureContentBounds(bounds: Rectangle): void;
        private getPlayWidth;
        private getPlayHeight;
        $updateRenderNode(): void;
        private markDirty;
        $setHeight(value: number): void;
        $setWidth(value: number): void;
        get paused(): boolean;
        get length(): number;
    }
}
declare namespace egret {
    namespace HttpMethod {
        const GET = "GET";
        const POST = "POST";
    }
}
declare namespace egret {
    interface HttpRequest extends EventDispatcher {
        response: any;
        responseType: string;
        timeout: number;
        withCredentials: boolean;
        open(url: string, method?: string): void;
        send(data?: any): void;
        abort(): void;
        getAllResponseHeaders(): string;
        setRequestHeader(header: string, value: string): void;
        getResponseHeader(header: string): string;
    }
    let HttpRequest: {
        new (): HttpRequest;
    };
}
declare namespace egret {
    class HttpResponseType {
        static TEXT: string;
        static ARRAY_BUFFER: string;
    }
}
declare namespace egret {
    interface ImageLoader extends EventDispatcher {
        data: BitmapData;
        crossOrigin: string;
        load(url: string): void;
    }
    let ImageLoader: {
        new (): ImageLoader;
        crossOrigin: string;
    };
}
declare namespace egret.web {
    class WebHttpRequest extends EventDispatcher implements HttpRequest {
        constructor();
        private _xhr;
        timeout: number;
        get response(): any;
        private _responseType;
        get responseType(): "" | "arraybuffer" | "blob" | "document" | "json" | "text";
        set responseType(value: "" | "arraybuffer" | "blob" | "document" | "json" | "text");
        private _withCredentials;
        get withCredentials(): boolean;
        set withCredentials(value: boolean);
        private _url;
        private _method;
        private getXHR;
        open(url: string, method?: string): void;
        send(data?: any): void;
        abort(): void;
        getAllResponseHeaders(): string;
        private headerObj;
        setRequestHeader(header: string, value: string): void;
        getResponseHeader(header: string): string;
        private onTimeout;
        private onReadyStateChange;
        private updateProgress;
        private onload;
        private onerror;
    }
}
declare namespace egret.web {
    class WebImageLoader extends EventDispatcher implements ImageLoader {
        data: BitmapData;
        private _crossOrigin;
        private _hasCrossOriginSet;
        set crossOrigin(value: string);
        get crossOrigin(): string;
        static crossOrigin: string;
        private currentImage;
        private currentURL;
        private request;
        load(url: string): void;
        private onBlobLoaded;
        private onBlobError;
        private loadImage;
        private onImageComplete;
        private onLoadError;
        private dispatchIOError;
        private getImage;
    }
}
declare namespace egret.sys {
    let customHitTestBuffer: sys.RenderBuffer;
    let canvasHitTestBuffer: sys.RenderBuffer;
    interface RenderBuffer {
        surface: any;
        context: any;
        width: number;
        height: number;
        resize(width: number, height: number, useMaxSize?: boolean): void;
        getPixels(x: number, y: number, width?: number, height?: number): number[];
        toDataURL(type?: string, ...args: any[]): string;
        clear(): void;
        destroy(): void;
    }
    let RenderBuffer: {
        new (width?: number, height?: number, root?: boolean): RenderBuffer;
    };
    let CanvasRenderBuffer: {
        new (width?: number, height?: number): RenderBuffer;
    };
}
declare namespace egret.sys {
    class DisplayList extends HashObject {
        static create(target: DisplayObject): DisplayList;
        constructor(root: DisplayObject);
        private isStage;
        $renderNode: RenderNode;
        $getRenderNode(): sys.RenderNode;
        renderBuffer: RenderBuffer;
        offsetX: number;
        offsetY: number;
        private offsetMatrix;
        root: DisplayObject;
        setClipRect(width: number, height: number): void;
        $canvasScaleX: number;
        $canvasScaleY: number;
        drawToSurface(): number;
        private bitmapData;
        changeSurfaceSize(): void;
        static $canvasScaleFactor: number;
        static $canvasScaleX: number;
        static $canvasScaleY: number;
        static $setCanvasScale(x: number, y: number): void;
        $stageRenderToSurface: () => void;
    }
}
declare namespace egret {
    class StageScaleMode {
        static NO_SCALE: string;
        static SHOW_ALL: string;
        static NO_BORDER: string;
        static EXACT_FIT: string;
        static FIXED_WIDTH: string;
        static FIXED_HEIGHT: string;
        static FIXED_NARROW: string;
        static FIXED_WIDE: string;
    }
}
declare namespace egret.sys {
    interface IScreenAdapter {
        calculateStageSize(scaleMode: string, screenWidth: number, screenHeight: number, contentWidth: number, contentHeight: number): StageDisplaySize;
    }
    interface StageDisplaySize {
        stageWidth: number;
        stageHeight: number;
        displayWidth: number;
        displayHeight: number;
    }
    let screenAdapter: IScreenAdapter;
    class DefaultScreenAdapter extends HashObject implements IScreenAdapter {
        constructor();
        calculateStageSize(scaleMode: string, screenWidth: number, screenHeight: number, contentWidth: number, contentHeight: number): StageDisplaySize;
    }
}
declare namespace egret {
    type runEgretOptions = {
        renderMode?: string;
        audioType?: number;
        screenAdapter?: sys.IScreenAdapter;
        antialias?: boolean;
        canvasScaleFactor?: number;
        calculateCanvasScaleFactor?: (context: CanvasRenderingContext2D) => number;
        entryClassName?: string;
        scaleMode?: string;
        frameRate?: number;
        contentWidth?: number;
        contentHeight?: number;
        orientation?: string;
        maxTouches?: number;
        showFPS?: boolean;
        showLog?: boolean;
        fpsStyles?: string;
    };
    function runEgret(options?: runEgretOptions): void;
    function updateAllScreens(): void;
}
declare namespace egret {
    interface FPSDisplay {
        update(datas: FPSData): void;
        updateInfo(info: string): void;
        updateWarn(info: string): void;
        updateError(info: string): void;
    }
    let FPSDisplay: {
        new (stage: Stage, showFPS: boolean, showLog: boolean, logFilter: string, styles: Object): FPSDisplay;
    };
}
interface FPSData extends Object {
    fps: number;
    draw: number;
    costTicker: number;
    costRender: number;
}
declare namespace egret.sys {
    class MeshNode extends RenderNode {
        constructor();
        image: BitmapData;
        smoothing: boolean;
        imageWidth: number;
        imageHeight: number;
        matrix: egret.Matrix;
        uvs: number[];
        vertices: number[];
        indices: number[];
        bounds: Rectangle;
        blendMode: number;
        alpha: number;
        filter: ColorMatrixFilter;
        rotated: boolean;
        drawMesh(sourceX: number, sourceY: number, sourceW: number, sourceH: number, drawX: number, drawY: number, drawW: number, drawH: number): void;
        cleanBeforeRender(): void;
    }
}
declare namespace egret.sys {
    class GroupNode extends RenderNode {
        matrix: egret.Matrix;
        constructor();
        addNode(node: RenderNode): void;
        cleanBeforeRender(): void;
        $getRenderCount(): number;
    }
}
declare namespace egret.sys {
    const enum PathType {
        Fill = 1,
        GradientFill = 2,
        Stroke = 3
    }
    const enum PathCommand {
        MoveTo = 1,
        LineTo = 2,
        CurveTo = 3,
        CubicCurveTo = 4
    }
    class Path2D {
        type: number;
        $commands: number[];
        $data: number | number[][];
        protected commandPosition: number;
        protected dataPosition: number;
        $lastX: number;
        $lastY: number;
        moveTo(x: number, y: number): void;
        lineTo(x: number, y: number): void;
        curveTo(controlX: number, controlY: number, anchorX: number, anchorY: number): void;
        cubicCurveTo(controlX1: number, controlY1: number, controlX2: number, controlY2: number, anchorX: number, anchorY: number): void;
        drawRect(x: number, y: number, width: number, height: number): void;
        drawRoundRect(x: number, y: number, width: number, height: number, ellipseWidth: number, ellipseHeight?: number): void;
        drawCircle(x: number, y: number, radius: number): void;
        drawEllipse(x: number, y: number, width: number, height: number): void;
        drawArc(x: number, y: number, radius: number, startAngle: number, endAngle: number, anticlockwise: boolean): void;
        private arcToBezier;
    }
}
declare namespace egret.sys {
    class StrokePath extends Path2D {
        constructor();
        lineWidth: number;
        lineColor: number;
        lineAlpha: number;
        caps: string;
        joints: CanvasLineJoin;
        miterLimit: number;
        lineDash: number[];
    }
}
declare namespace egret {
    class WebGLUtils {
        static compileProgram(gl: WebGLRenderingContext, vertexSrc: string, fragmentSrc: string): WebGLProgram;
        static compileFragmentShader(gl: WebGLRenderingContext, shaderSrc: string): WebGLShader;
        static compileVertexShader(gl: WebGLRenderingContext, shaderSrc: string): WebGLShader;
        private static _compileShader;
        private static canUseWebGL;
        static checkCanUseWebGL(): boolean;
        static deleteWebGLTexture(webglTexture: WebGLTexture): void;
        static premultiplyTint(tint: number, alpha: number): number;
    }
}
declare namespace egret.sys {
    class GraphicsNode extends RenderNode {
        constructor();
        beginFill(color: number, alpha?: number, beforePath?: Path2D): Path2D;
        beginGradientFill(type: string, colors: number[], alphas: number[], ratios: number[], matrix?: egret.Matrix, beforePath?: Path2D): Path2D;
        lineStyle(thickness?: number, color?: number, alpha?: number, caps?: string, joints?: CanvasLineJoin, miterLimit?: number, lineDash?: number[]): StrokePath;
        clear(): void;
        cleanBeforeRender(): void;
        x: number;
        y: number;
        width: number;
        height: number;
        dirtyRender: boolean;
        $texture: WebGLTexture;
        $textureWidth: number;
        $textureHeight: number;
        $canvasScaleX: number;
        $canvasScaleY: number;
        clean(): void;
    }
}
declare namespace egret.sys {
    interface TextFormat {
        textColor?: number;
        strokeColor?: number;
        size?: number;
        stroke?: number;
        bold?: boolean;
        italic?: boolean;
        fontFamily?: string;
    }
}
declare namespace egret.sys {
    class TextNode extends RenderNode {
        constructor();
        textColor: number;
        strokeColor: number;
        size: number;
        stroke: number;
        bold: boolean;
        italic: boolean;
        fontFamily: string;
        drawText(x: number, y: number, text: string, format: TextFormat): void;
        x: number;
        y: number;
        width: number;
        height: number;
        dirtyRender: boolean;
        $texture: WebGLTexture;
        $textureWidth: number;
        $textureHeight: number;
        $canvasScaleX: number;
        $canvasScaleY: number;
        clean(): void;
        cleanBeforeRender(): void;
    }
}
interface CanvasRenderingContext2D {
    imageSmoothingEnabled: boolean;
    $imageSmoothingEnabled: boolean;
    $offsetX: number;
    $offsetY: number;
}
declare namespace egret {
    class CanvasRenderer {
        private nestLevel;
        render(displayObject: DisplayObject, buffer: sys.RenderBuffer, matrix: Matrix, forRenderTexture?: boolean): number;
        private drawDisplayObject;
        private drawWithFilter;
        private drawWithClip;
        private drawWithScrollRect;
        drawNodeToBuffer(node: sys.RenderNode, buffer: sys.RenderBuffer, matrix: Matrix, forHitTest?: boolean): void;
        drawDisplayToBuffer(displayObject: DisplayObject, buffer: sys.RenderBuffer, matrix: Matrix): number;
        private renderNode;
        private renderNormalBitmap;
        private renderBitmap;
        private renderMesh;
        private drawMesh;
        renderText(node: sys.TextNode, context: CanvasRenderingContext2D): void;
        private renderingMask;
        renderGraphics(node: sys.GraphicsNode, context: CanvasRenderingContext2D, forHitTest?: boolean): number;
        private renderPath;
        private renderGroup;
        private createRenderBuffer;
    }
    function getFontString(node: sys.TextNode, format: sys.TextFormat): string;
    function getRGBAString(color: number, alpha: number): string;
}
declare namespace egret.sys {
    let systemRenderer: SystemRenderer;
    let canvasRenderer: SystemRenderer;
    interface SystemRenderer {
        render(displayObject: DisplayObject, buffer: RenderBuffer, matrix: Matrix, forRenderTexture?: boolean): number;
        drawNodeToBuffer(node: sys.RenderNode, buffer: RenderBuffer, matrix: Matrix, forHitTest?: boolean): void;
    }
    interface RenderContext {
    }
    function mainCanvas(width?: number, height?: number): HTMLCanvasElement;
    function createCanvas(width?: number, height?: number): HTMLCanvasElement;
    function resizeContext(renderContext: RenderContext, width: number, height: number, useMaxSize?: boolean): void;
    function getContextWebGL(surface: HTMLCanvasElement): WebGLRenderingContext;
    function getContext2d(surface: HTMLCanvasElement): CanvasRenderingContext2D;
    function createTexture(renderContext: RenderContext, bitmapData: BitmapData | HTMLCanvasElement): WebGLTexture;
    function _createTexture(renderContext: RenderContext, width: number, height: number, data: any): WebGLTexture;
    function drawTextureElements(renderContext: RenderContext, data: any, offset: number): number;
    function measureTextWith(context: CanvasRenderingContext2D, text: string): number;
    function createCanvasRenderBufferSurface(defaultFunc: (width?: number, height?: number) => HTMLCanvasElement, width?: number, height?: number, root?: boolean): HTMLCanvasElement;
    function resizeCanvasRenderBuffer(renderContext: RenderContext, width: number, height: number, useMaxSize?: boolean): void;
}
declare namespace egret {
    interface IHitTextElement {
        lineIndex: number;
        textElementIndex: number;
    }
    interface ITextStyle {
        textColor?: number;
        strokeColor?: number;
        size?: number;
        stroke?: number;
        bold?: boolean;
        italic?: boolean;
        fontFamily?: string;
        href?: string;
        target?: string;
        underline?: boolean;
    }
    interface ITextElement {
        text: string;
        style?: ITextStyle;
    }
    interface IWTextElement extends ITextElement {
        width: number;
    }
    interface ILineElement {
        width: number;
        height: number;
        charNum: number;
        hasNextLine: boolean;
        elements: Array<IWTextElement>;
    }
}
declare namespace egret {
    class HorizontalAlign {
        static LEFT: string;
        static RIGHT: string;
        static CENTER: string;
        static JUSTIFY: string;
        static CONTENT_JUSTIFY: string;
    }
}
declare namespace egret {
    class VerticalAlign {
        static TOP: string;
        static BOTTOM: string;
        static MIDDLE: string;
        static JUSTIFY: string;
        static CONTENT_JUSTIFY: string;
    }
}
declare namespace egret {
    class TextFieldUtils {
        static $getStartLine(textfield: egret.TextField): number;
        static $getHalign(textfield: egret.TextField): number;
        static $getTextHeight(textfield: egret.TextField): number;
        static $getValign(textfield: egret.TextField): number;
        static $getTextElement(textfield: egret.TextField, x: number, y: number): ITextElement;
        static $getHit(textfield: egret.TextField, x: number, y: number): IHitTextElement;
        static $getScrollNum(textfield: egret.TextField): number;
    }
}
declare namespace egret {
    class TextFieldType {
        static DYNAMIC: string;
        static INPUT: string;
    }
}
declare namespace egret.sys {
    const enum TextKeys {
        fontSize = 0,
        lineSpacing = 1,
        textColor = 2,
        textFieldWidth = 3,
        textFieldHeight = 4,
        textWidth = 5,
        textHeight = 6,
        textDrawWidth = 7,
        fontFamily = 8,
        textAlign = 9,
        verticalAlign = 10,
        textColorString = 11,
        fontString = 12,
        text = 13,
        measuredWidths = 14,
        bold = 15,
        italic = 16,
        fontStringChanged = 17,
        textLinesChanged = 18,
        wordWrap = 19,
        displayAsPassword = 20,
        maxChars = 21,
        selectionActivePosition = 22,
        selectionAnchorPosition = 23,
        type = 24,
        strokeColor = 25,
        strokeColorString = 26,
        stroke = 27,
        scrollV = 28,
        numLines = 29,
        multiline = 30,
        border = 31,
        borderColor = 32,
        background = 33,
        backgroundColor = 34,
        restrictAnd = 35,
        restrictNot = 36,
        inputType = 37,
        textLinesChangedForNativeRender = 38
    }
}
declare namespace egret {
    class TextField extends DisplayObject {
        static default_fontFamily: string;
        static default_size: number;
        static default_textColor: number;
        constructor();
        protected createNativeDisplayObject(): void;
        $TextField: Object;
        private isInput;
        $inputEnabled: boolean;
        $setTouchEnabled(value: boolean): void;
        get fontFamily(): string;
        set fontFamily(value: string);
        $setFontFamily(value: string): boolean;
        get size(): number;
        set size(value: number);
        $setSize(value: number): boolean;
        get bold(): boolean;
        set bold(value: boolean);
        $setBold(value: boolean): boolean;
        get italic(): boolean;
        set italic(value: boolean);
        $setItalic(value: boolean): boolean;
        private invalidateFontString;
        get textAlign(): string;
        set textAlign(value: string);
        $setTextAlign(value: string): boolean;
        get verticalAlign(): string;
        set verticalAlign(value: string);
        $setVerticalAlign(value: string): boolean;
        get lineSpacing(): number;
        set lineSpacing(value: number);
        $setLineSpacing(value: number): boolean;
        get textColor(): number;
        set textColor(value: number);
        $setTextColor(value: number): boolean;
        get wordWrap(): boolean;
        set wordWrap(value: boolean);
        $setWordWrap(value: boolean): void;
        protected inputUtils: InputController;
        set type(value: string);
        $setType(value: string): boolean;
        get type(): string;
        set inputType(value: string);
        get inputType(): string;
        get text(): string;
        $getText(): string;
        set text(value: string);
        $setBaseText(value: string): boolean;
        $setText(value: string): boolean;
        get displayAsPassword(): boolean;
        set displayAsPassword(value: boolean);
        $setDisplayAsPassword(value: boolean): boolean;
        get strokeColor(): number;
        set strokeColor(value: number);
        $setStrokeColor(value: number): boolean;
        get stroke(): number;
        set stroke(value: number);
        $setStroke(value: number): boolean;
        get maxChars(): number;
        set maxChars(value: number);
        $setMaxChars(value: number): boolean;
        set scrollV(value: number);
        get scrollV(): number;
        get maxScrollV(): number;
        get selectionBeginIndex(): number;
        get selectionEndIndex(): number;
        get caretIndex(): number;
        $setSelection(beginIndex: number, endIndex: number): boolean;
        $getLineHeight(): number;
        get numLines(): number;
        set multiline(value: boolean);
        $setMultiline(value: boolean): boolean;
        get multiline(): boolean;
        set restrict(value: string);
        get restrict(): string;
        $setWidth(value: number): boolean;
        $setHeight(value: number): boolean;
        $getWidth(): number;
        $getHeight(): number;
        private textNode;
        $graphicsNode: sys.GraphicsNode;
        set border(value: boolean);
        $setBorder(value: boolean): void;
        get border(): boolean;
        set borderColor(value: number);
        $setBorderColor(value: number): void;
        get borderColor(): number;
        set background(value: boolean);
        $setBackground(value: boolean): void;
        get background(): boolean;
        set backgroundColor(value: number);
        $setBackgroundColor(value: number): void;
        get backgroundColor(): number;
        private fillBackground;
        setFocus(): void;
        $onRemoveFromStage(): void;
        $onAddToStage(stage: Stage, nestLevel: number): void;
        $invalidateTextField(): void;
        $getRenderBounds(): Rectangle;
        $measureContentBounds(bounds: Rectangle): void;
        $updateRenderNode(): void;
        private isFlow;
        set textFlow(textArr: Array<egret.ITextElement>);
        get textFlow(): Array<egret.ITextElement>;
        private changeToPassText;
        private textArr;
        private setMiddleStyle;
        get textWidth(): number;
        get textHeight(): number;
        appendText(text: string): void;
        appendElement(element: egret.ITextElement): void;
        private linesArr;
        $getLinesArr(): Array<egret.ILineElement>;
        $getLinesArr2(): Array<egret.ILineElement>;
        $isTyping: boolean;
        $setIsTyping(value: boolean): void;
        private drawText;
        private addEvent;
        private removeEvent;
        private onTapHandler;
    }
    interface TextField {
        addEventListener<Z>(type: "link", listener: (this: Z, e: TextEvent) => void, thisObject: Z, useCapture?: boolean, priority?: number): any;
        addEventListener<Z>(type: "focusIn" | "focusOut", listener: (this: Z, e: FocusEvent) => void, thisObject: Z, useCapture?: boolean, priority?: number): any;
        addEventListener(type: string, listener: Function, thisObject: any, useCapture?: boolean, priority?: number): any;
    }
}
declare namespace egret {
    let fontMapping: {};
}
declare namespace egret_native {
    function readUpdateFileSync(filePath: any): any;
    function readResourceFileSync(filePath: any): any;
    function sendInfoToPlugin(info: string): void;
    function receivedPluginInfo(info: string): void;
    function nrInit(): void;
    function nrDownloadBuffers(callback: (displayCmdBuffer: Float32Array) => void): void;
    function nrSetRenderMode(mode: number): void;
    function nrRenderDisplayObject(id: number, scale: number, useClip: boolean, clipX: number, clipY: number, clipW: number, clipH: number): void;
    function nrRenderDisplayObject2(id: number, offsetX: number, offsetY: number, forHitTest: boolean): void;
    function nrLocalToGlobal(id: number, localX: number, localY: number): string;
    function nrGlobalToLocal(id: number, globalX: number, globalY: number): string;
    function nrGetTextFieldWidth(id: number): number;
    function nrGetTextFieldHeight(id: number): number;
    function nrGetTextWidth(id: number): number;
    function nrGetTextHeight(id: number): number;
    function nrResize(width: number, height: number): void;
    function nrSetCanvasScaleFactor(factor: number, scalex: number, scaley: number): void;
    function nrUpdate(): void;
    function nrRender(): void;
    function nrSendTextFieldData(textFieldId: number, strData: string): void;
    function nrUpdateCallbackList(dt: number): void;
    function nrActiveBuffer(id: number, width: number, height: number): void;
    function nrGetPixels(x: number, y: number, width: number, height: number, pixels: Uint8Array): void;
    function nrGetCustomImageId(type: number): number;
    function nrSetCustomImageData(customImageId: number, pvrtcData: any, width: any, height: any, mipmapsCount: any, format: any): void;
    class NrNode {
        constructor(id: number, type: number);
    }
}
declare namespace egret_native {
    let rootWebGLBuffer: egret.sys.RenderBuffer;
    let forHitTest: boolean;
    let addModuleCallback: (callback: Function, thisObj: any) => void;
    let initNativeRender: () => void;
    let updateNativeRender: () => void;
    let activateBuffer: (buffer: egret.sys.RenderBuffer) => void;
    let getJsCustomFilterVertexSrc: (key: any) => any;
    let getJsCustomFilterFragSrc: (key: any) => any;
    let getJsCustomFilterUniforms: (key: any) => any;
    let nrABIVersion: number;
    let nrMinEgretVersion: string;
}
declare namespace egret_native {
    class NativeRenderSurface {
        width: number;
        height: number;
        constructor(currRenderBuffer: any, w?: number, h?: number, root?: boolean);
        resize(w: number, h: number): void;
    }
    class NativeBitmapData {
        $init(): any;
        $id: any;
    }
    class NativeDisplayObject {
        id: number;
        constructor(type: number);
        setChildrenSortMode(mode: string): void;
        addChildAt(childId: number, index: number): void;
        removeChild(childId: number): void;
        swapChild(index1: number, index2: number): void;
        setX(value: number): void;
        setY(value: number): void;
        setRotation(value: number): void;
        setScaleX(value: number): void;
        setScaleY(value: number): void;
        setSkewX(value: number): void;
        setSkewY(value: number): void;
        setAlpha(value: number): void;
        setAnchorOffsetX(value: number): void;
        setAnchorOffsetY(value: number): void;
        setVisible(value: boolean): void;
        setBlendMode(value: number): void;
        setMaskRect(x: number, y: number, w: number, h: number): void;
        setScrollRect(x: number, y: number, w: number, h: number): void;
        setFilters(filters: Array<egret.Filter>): void;
        static createFilter(filter: egret.Filter): void;
        static setFilterPadding(filterId: number, paddingTop: number, paddingBottom: number, paddingLeft: number, paddingRight: number): void;
        setMask(value: number): void;
        static setSourceToNativeBitmapData(nativeBitmapData: egret_native.NativeBitmapData, source: any): any;
        setTexture(texture: egret.Texture): void;
        setBitmapDataToMesh(texture: egret.Texture): void;
        setBitmapDataToParticle(texture: egret.Texture): void;
        setWidth(value: number): void;
        setHeight(value: number): void;
        setCacheAsBitmap(value: boolean): void;
        setBitmapFillMode(fillMode: string): void;
        setScale9Grid(x: number, y: number, w: number, h: number): void;
        setMatrix(a: number, b: number, c: number, d: number, tx: number, ty: number): void;
        setIsTyping(value: boolean): void;
        setDataToBitmapNode(id: number, texture: egret.Texture, arr: number[]): void;
        setDataToMesh(vertexArr: number[], indiceArr: number[], uvArr: number[]): void;
        static setDataToFilter(currFilter: egret.Filter): void;
        static disposeNativeBitmapData(nativeBitmapData: egret_native.NativeBitmapData): void;
        static disposeTextData(node: egret.TextField): void;
        static disposeGraphicData(graphic: egret.Graphics): void;
        setFontSize(value: number): void;
        setLineSpacing(value: number): void;
        setTextColor(value: number): void;
        setTextFieldWidth(value: number): void;
        setTextFieldHeight(value: number): void;
        setFontFamily(value: string): void;
        setTextFlow(textArr: Array<egret.ITextElement>): void;
        setTextAlign(value: string): void;
        setVerticalAlign(value: string): void;
        setText(value: string): void;
        setBold(value: boolean): void;
        setItalic(value: boolean): void;
        setWordWrap(value: boolean): void;
        setMaxChars(value: number): void;
        setType(value: string): void;
        setStrokeColor(value: number): void;
        setStroke(value: number): void;
        setScrollV(value: number): void;
        setMultiline(value: boolean): void;
        setBorder(value: boolean): void;
        setBorderColor(value: number): void;
        setBackground(value: boolean): void;
        setBackgroundColor(value: number): void;
        setInputType(value: string): void;
        setBeginFill(color: number, alpha?: number): void;
        setBeginGradientFill(type: string, colors: number[], alphas: number[], ratios: number[], matrix: egret.Matrix): void;
        setEndFill(): void;
        setLineStyle(thickness?: number, color?: number, alpha?: number, pixelHinting?: boolean, scaleMode?: string, caps?: string, joints?: string, miterLimit?: number, lineDash?: number[]): void;
        setDrawRect(x: number, y: number, width: number, height: number): void;
        setDrawRoundRect(x: number, y: number, width: number, height: number, ellipseWidth: number, ellipseHeight?: number): void;
        setDrawCircle(x: number, y: number, radius: number): void;
        setDrawEllipse(x: number, y: number, width: number, height: number): void;
        setMoveTo(x: number, y: number): void;
        setLineTo(x: number, y: number): void;
        setCurveTo(controlX: number, controlY: number, anchorX: number, anchorY: number): void;
        setCubicCurveTo(controlX1: number, controlY1: number, controlX2: number, controlY2: number, anchorX: number, anchorY: number): void;
        setDrawArc(x: number, y: number, radius: number, startAngle: number, endAngle: number, anticlockwise?: boolean): void;
        setGraphicsClear(): void;
    }
}
declare namespace egret_native {
    const enum NativeObjectType {
        CONTAINER = 0,
        BITMAP = 1,
        BITMAP_DATA = 2,
        FILTER = 6,
        TEXT = 7,
        GRAPHICS = 8,
        SPRITE = 9,
        PARTICLE_SYSTEM = 10,
        BITMAP_TEXT = 11,
        MESH = 12,
        STAGE = 13
    }
}
declare namespace egret.web {
    class WebGLRenderTarget extends HashObject {
        private gl;
        texture: WebGLTexture;
        private frameBuffer;
        private stencilBuffer;
        width: number;
        height: number;
        clearColor: number[];
        useFrameBuffer: boolean;
        constructor(gl: WebGLRenderingContext, width: number, height: number);
        private _resize;
        resize(width: number, height: number): void;
        activate(): void;
        private getFrameBuffer;
        initFrameBuffer(): void;
        private createTexture;
        clear(bind?: boolean): void;
        enabledStencil(): void;
        dispose(): void;
    }
}
declare namespace egret.web {
    class WebGLRenderBuffer extends HashObject implements sys.RenderBuffer {
        static autoClear: boolean;
        context: WebGLRenderContext;
        surface: any;
        rootRenderTarget: WebGLRenderTarget;
        private root;
        currentTexture: WebGLTexture;
        constructor(width?: number, height?: number, root?: boolean);
        globalAlpha: number;
        globalTintColor: number;
        private stencilState;
        $stencilList: {
            x: number;
            y: number;
            width: number;
            height: number;
        }[];
        stencilHandleCount: number;
        enableStencil(): void;
        disableStencil(): void;
        restoreStencil(): void;
        $scissorState: boolean;
        private scissorRect;
        $hasScissor: boolean;
        enableScissor(x: number, y: number, width: number, height: number): void;
        disableScissor(): void;
        restoreScissor(): void;
        get width(): number;
        get height(): number;
        resize(width: number, height: number, useMaxSize?: boolean): void;
        getPixels(x: number, y: number, width?: number, height?: number): number[];
        toDataURL(type?: string, encoderOptions?: number): string;
        destroy(): void;
        onRenderFinish(): void;
        private drawFrameBufferToSurface;
        private drawSurfaceToFrameBuffer;
        clear(): void;
        $drawCalls: number;
        $computeDrawCall: boolean;
        globalMatrix: Matrix;
        savedGlobalMatrix: Matrix;
        $offsetX: number;
        $offsetY: number;
        setTransform(a: number, b: number, c: number, d: number, tx: number, ty: number): void;
        transform(a: number, b: number, c: number, d: number, tx: number, ty: number): void;
        useOffset(): void;
        saveTransform(): void;
        restoreTransform(): void;
        static create(width: number, height: number): WebGLRenderBuffer;
        static release(buffer: WebGLRenderBuffer): void;
    }
}
declare namespace egret.web {
    type ProgramCache = {
        [index: string]: EgretWebGLProgram;
    };
    type Uniforms = {
        [index: string]: EgretWebGLUniform;
    };
    type Attributes = {
        [index: string]: EgretWebGLAttribute;
    };
    class EgretWebGLProgram {
        private static programCache;
        static getProgram(gl: WebGLRenderingContext, vertSource: string, fragSource: string, key: string): EgretWebGLProgram;
        static deleteProgram(gl: WebGLRenderingContext, vertSource: string, fragSource: string, key: string): void;
        private vshaderSource;
        private fshaderSource;
        private vertexShader;
        private fragmentShader;
        id: WebGLProgram;
        attributes: Attributes;
        uniforms: Uniforms;
        private constructor();
    }
}
declare namespace egret.web {
    class EgretShaderLib {
        static readonly blur_frag: string;
        static readonly colorTransform_frag: string;
        static readonly default_vert: string;
        static readonly glow_frag: string;
        static readonly primitive_frag: string;
        static readonly texture_frag: string;
        static readonly texture_etc_alphamask_frag: string;
        static readonly colorTransform_frag_etc_alphamask_frag: string;
    }
}
declare namespace egret.web {
    class WebGLRenderContext implements egret.sys.RenderContext {
        static antialias: boolean;
        _defaultEmptyTexture: WebGLTexture;
        context: WebGLRenderingContext;
        surface: HTMLCanvasElement;
        private static instance;
        static getInstance(width?: number, height?: number, context?: WebGLRenderingContext): WebGLRenderContext;
        $maxTextureSize: number;
        private vao;
        drawCmdManager: WebGLDrawCmdManager;
        $bufferStack: WebGLRenderBuffer[];
        private currentBuffer;
        pushBuffer(buffer: WebGLRenderBuffer): void;
        popBuffer(): void;
        private bindIndices;
        private activateBuffer;
        private uploadVerticesArray;
        private uploadIndicesArray;
        private vertexBuffer;
        private indexBuffer;
        constructor(width?: number, height?: number, context?: WebGLRenderingContext);
        destroy(): void;
        onResize(width?: number, height?: number): void;
        resize(width: number, height: number, useMaxSize?: boolean): void;
        static glContextId: number;
        glID: number;
        projectionX: number;
        projectionY: number;
        contextLost: boolean;
        private _supportedCompressedTextureInfo;
        pvrtc: any;
        etc1: any;
        private _buildSupportedCompressedTextureInfo;
        private initWebGL;
        getSupportedCompressedTexture(): void;
        private handleContextLost;
        private handleContextRestored;
        private getWebGLContext;
        private setContext;
        enableStencilTest(): void;
        disableStencilTest(): void;
        enableScissorTest(rect: egret.Rectangle): void;
        disableScissorTest(): void;
        getPixels(x: any, y: any, width: any, height: any, pixels: any): void;
        createTexture(bitmapData: BitmapData | HTMLCanvasElement): WebGLTexture;
        private checkCompressedTextureInternalFormat;
        private $debugLogCompressedTextureNotSupported;
        private createCompressedTexture;
        updateTexture(texture: WebGLTexture, bitmapData: BitmapData): void;
        get defaultEmptyTexture(): WebGLTexture;
        getWebGLTexture(bitmapData: BitmapData): WebGLTexture;
        clearRect(x: number, y: number, width: number, height: number): void;
        setGlobalCompositeOperation(value: string): void;
        drawImage(image: BitmapData, sourceX: number, sourceY: number, sourceWidth: number, sourceHeight: number, destX: number, destY: number, destWidth: number, destHeight: number, imageSourceWidth: number, imageSourceHeight: number, rotated: boolean, smoothing?: boolean): void;
        drawMesh(image: BitmapData, sourceX: number, sourceY: number, sourceWidth: number, sourceHeight: number, destX: number, destY: number, destWidth: number, destHeight: number, imageSourceWidth: number, imageSourceHeight: number, meshUVs: number[], meshVertices: number[], meshIndices: number[], bounds: Rectangle, rotated: boolean, smoothing: boolean): void;
        drawTexture(texture: WebGLTexture, sourceX: number, sourceY: number, sourceWidth: number, sourceHeight: number, destX: number, destY: number, destWidth: number, destHeight: number, textureWidth: number, textureHeight: number, meshUVs?: number[], meshVertices?: number[], meshIndices?: number[], bounds?: Rectangle, rotated?: boolean, smoothing?: boolean): void;
        drawRect(x: number, y: number, width: number, height: number): void;
        pushMask(x: number, y: number, width: number, height: number): void;
        popMask(): void;
        clear(): void;
        $scissorState: boolean;
        enableScissor(x: number, y: number, width: number, height: number): void;
        disableScissor(): void;
        activatedBuffer: WebGLRenderBuffer;
        $drawWebGL(): void;
        private drawData;
        currentProgram: EgretWebGLProgram;
        private activeProgram;
        private syncUniforms;
        private drawTextureElements;
        private drawRectElements;
        private drawPushMaskElements;
        private drawPopMaskElements;
        private vertSize;
        private setBlendMode;
        $filter: ColorMatrixFilter;
        drawTargetWidthFilters(filters: Filter[], input: WebGLRenderBuffer): void;
        private drawToRenderTarget;
        static blendModesForGL: any;
        static initBlendMode(): void;
        $beforeRender: () => void;
    }
}
declare namespace egret.sys {
    let $TempStage: egret.Stage;
    class Player extends HashObject {
        constructor(buffer: RenderBuffer, stage: Stage, entryClassName: string);
        private createDisplayList;
        private screenDisplayList;
        private entryClassName;
        stage: Stage;
        private root;
        private isPlaying;
        start(): void;
        private initialize;
        stop(): void;
        pause(): void;
        $render(triggerByFrame: boolean, costTicker: number): void;
        updateStageSize(stageWidth: number, stageHeight: number): void;
        displayFPS(showFPS: boolean, showLog: boolean, logFilter: string, styles: Object): void;
        private showFPS;
        private showLog;
        private stageDisplayList;
    }
    let $logToFPS: (info: string) => void;
    let $warnToFPS: (info: string) => void;
    let $errorToFPS: (info: string) => void;
    let setRenderMode: (renderMode: string) => void;
    let WebGLRenderContext: {
        new (width?: number, height?: number, context?: WebGLRenderingContext): RenderContext;
    };
}
declare module egret {
    var nativeRender: boolean;
}
interface PlayerOption {
    entryClassName?: string;
    frameRate?: number;
    scaleMode?: string;
    contentWidth?: number;
    contentHeight?: number;
    orientation?: string;
    showFPS?: boolean;
    fpsStyles?: Object;
    showLog?: boolean;
    logFilter?: string;
    maxTouches?: number;
    textureScaleFactor?: number;
}
declare namespace egret.sys {
    interface Screen {
        updateScreenSize(): any;
        updateMaxTouches(): any;
        setContentSize(width: number, height: number): any;
    }
}
declare namespace egret.sys {
    let $START_TIME: number;
    let $invalidateRenderFlag: boolean;
    let $requestRenderingFlag: boolean;
    class SystemTicker {
        constructor();
        private playerList;
        $addPlayer(player: Player): void;
        $removePlayer(player: Player): void;
        private callBackList;
        private thisObjectList;
        $startTick(callBack: (timeStamp: number) => boolean, thisObject: any): void;
        $stopTick(callBack: (timeStamp: number) => boolean, thisObject: any): void;
        private getTickIndex;
        private concatTick;
        $frameRate: number;
        private frameInterval;
        private frameDeltaTime;
        private lastTimeStamp;
        $setFrameRate(value: number): boolean;
        private lastCount;
        private costEnterFrame;
        private isPaused;
        pause(): void;
        resume(): void;
        update(forceUpdate?: boolean): void;
        private render;
        private broadcastEnterFrame;
        private broadcastRender;
        private callLaters;
        private callLaterAsyncs;
        $beforeRender: () => void;
        $afterRender: () => void;
    }
}
declare module egret {
    namespace lifecycle {
        type LifecyclePlugin = (context: LifecycleContext) => void;
        let stage: egret.Stage;
        let contexts: LifecycleContext[];
        class LifecycleContext {
            pause(): void;
            resume(): void;
            onUpdate?: () => void;
        }
        let onResume: () => void;
        let onPause: () => void;
        function addLifecycleListener(plugin: LifecyclePlugin): void;
    }
    let ticker: sys.SystemTicker;
}
declare let egret_stages: egret.Stage[];
declare namespace egret.sys {
    class TouchHandler extends HashObject {
        private maxTouches;
        private useTouchesCount;
        constructor(stage: Stage);
        $initMaxTouches(): void;
        private stage;
        private touchDownTarget;
        onTouchBegin(x: number, y: number, touchPointID: number): boolean;
        private lastTouchX;
        private lastTouchY;
        onTouchMove(x: number, y: number, touchPointID: number): boolean;
        onTouchEnd(x: number, y: number, touchPointID: number): boolean;
        private findTarget;
        $updateMaxTouches: (value: any) => void;
    }
}
declare namespace egret.sys {
    class FillPath extends Path2D {
        constructor();
        fillColor: number;
        fillAlpha: number;
    }
}
declare namespace egret.sys {
    class GradientFillPath extends Path2D {
        constructor();
        gradientType: string;
        colors: number[];
        alphas: number[];
        ratios: number[];
        matrix: Matrix;
    }
}
declare namespace egret {
    interface DeviceOrientation extends EventDispatcher {
        start(): void;
        stop(): void;
    }
    let DeviceOrientation: {
        new (): DeviceOrientation;
    };
}
declare namespace egret {
    interface Geolocation extends EventDispatcher {
        start(): void;
        stop(): void;
    }
    let Geolocation: {
        new (): Geolocation;
    };
}
declare namespace egret {
    let Motion: {
        new (): Motion;
    };
    interface Motion extends EventDispatcher {
        start(): void;
        stop(): void;
    }
    interface DeviceRotationRate {
        alpha: number;
        beta: number;
        gamma: number;
    }
    interface DeviceAcceleration {
        x: number;
        y: number;
        z: number;
    }
}
declare namespace egret.web {
    class WebDeviceOrientation extends EventDispatcher implements DeviceOrientation {
        start(): void;
        stop(): void;
        protected onChange: (e: DeviceOrientationEvent) => void;
    }
}
interface BrowerGeolocation extends Geolocation {
}
declare namespace egret.web {
    class WebGeolocation extends EventDispatcher implements Geolocation {
        private geolocation;
        private watchId;
        constructor(option?: PositionOptions);
        start(): void;
        stop(): void;
        private onUpdate;
        private onError;
    }
}
declare namespace egret.web {
    class WebMotion extends EventDispatcher implements Motion {
        start(): void;
        stop(): void;
        protected onChange: (e: DeviceMotionEvent) => void;
    }
}
declare namespace egret {
    function assert(assertion?: boolean, message?: string, ...optionalParams: any[]): void;
    function warn(message?: any, ...optionalParams: any[]): void;
    function error(message?: any, ...optionalParams: any[]): void;
    function log(message?: any, ...optionalParams: any[]): void;
}
declare namespace egret {
    function registerImplementation(interfaceName: string, instance: any): void;
    function getImplementation(interfaceName: string): any;
}
declare namespace egret {
    class BitmapFont extends SpriteSheet {
        constructor(texture: Texture, config: any);
        private charList;
        getTexture(name: string): Texture;
        getConfig(name: string, key: string): number;
        private firstCharHeight;
        _getFirstCharHeight(): number;
        private parseConfig;
        private getConfigByKey;
    }
}
declare namespace egret {
    class BitmapText extends DisplayObject {
        constructor();
        protected createNativeDisplayObject(): void;
        private $smoothing;
        get smoothing(): boolean;
        set smoothing(value: boolean);
        private $text;
        get text(): string;
        set text(value: string);
        $setText(value: string): boolean;
        protected $textFieldWidth: number;
        $getWidth(): number;
        $setWidth(value: number): boolean;
        private $textLinesChanged;
        $invalidateContentBounds(): void;
        protected $textFieldHeight: number;
        $getHeight(): number;
        $setHeight(value: number): boolean;
        protected $font: BitmapFont;
        protected $fontStringChanged: boolean;
        get font(): Object;
        set font(value: Object);
        $setFont(value: any): boolean;
        private $lineSpacing;
        get lineSpacing(): number;
        set lineSpacing(value: number);
        $setLineSpacing(value: number): boolean;
        private $letterSpacing;
        get letterSpacing(): number;
        set letterSpacing(value: number);
        $setLetterSpacing(value: number): boolean;
        private $textAlign;
        get textAlign(): string;
        set textAlign(value: string);
        $setTextAlign(value: string): boolean;
        private $verticalAlign;
        get verticalAlign(): string;
        set verticalAlign(value: string);
        $setVerticalAlign(value: string): boolean;
        static EMPTY_FACTOR: number;
        $updateRenderNode(): void;
        $measureContentBounds(bounds: Rectangle): void;
        private $textWidth;
        get textWidth(): number;
        private $textHeight;
        get textHeight(): number;
        private $textOffsetX;
        private $textOffsetY;
        private $textStartX;
        private $textStartY;
        private textLines;
        private $textLinesWidth;
        $lineHeights: number[];
        $getTextLines(): string[];
    }
}
declare namespace egret {
    class HtmlTextParser {
        constructor();
        private replaceArr;
        private initReplaceArr;
        private replaceSpecial;
        private resutlArr;
        parse(htmltext: string): egret.ITextElement[];
        parser(htmltext: string): Array<egret.ITextElement>;
        private addToResultArr;
        private changeStringToObject;
        private getHeadReg;
        private addProperty;
        private stackArray;
        private addToArray;
    }
}
declare namespace egret {
    interface StageText extends EventDispatcher {
        $textfield: egret.TextField;
        $setTextField(textfield: egret.TextField): boolean;
        $resetStageText(): void;
        $getText(): string;
        $setText(value: string): boolean;
        $setColor(value: number): boolean;
        $show(): void;
        $hide(): void;
        $addToStage(): void;
        $removeFromStage(): void;
        $onBlur(): void;
    }
    let StageText: {
        new (): StageText;
    };
}
declare namespace egret {
    class InputController extends HashObject {
        stageText: egret.StageText;
        private stageTextAdded;
        private _text;
        private _isFocus;
        constructor();
        init(text: TextField): void;
        _addStageText(): void;
        _removeStageText(): void;
        _getText(): string;
        _setText(value: string): void;
        _setColor(value: number): void;
        private focusHandler;
        private blurHandler;
        private tempStage;
        private onMouseDownHandler;
        private onMouseMoveHandler;
        $onFocus(): void;
        private onStageDownHandler;
        private updateTextHandler;
        private resetText;
        _hideInput(): void;
        private updateInput;
        _updateProperties(): void;
    }
}
declare namespace egret {
    class TextFieldInputType {
        static TEXT: string;
        static TEL: string;
        static PASSWORD: string;
    }
}
declare namespace egret.sys {
    let measureText: (text: string, fontFamily: string, fontSize: number, bold: boolean, italic: boolean) => number;
}
declare namespace egret.web {
    class HTML5StageText extends EventDispatcher implements StageText {
        private htmlInput;
        constructor();
        $textfield: egret.TextField;
        $setTextField(textfield: egret.TextField): boolean;
        private _isNeedShow;
        private inputElement;
        private inputDiv;
        private _gscaleX;
        private _gscaleY;
        $addToStage(): void;
        private _initElement;
        $show(): void;
        private onBlurHandler;
        private onFocusHandler;
        private executeShow;
        $hide(): void;
        private textValue;
        $getText(): string;
        $setText(value: string): boolean;
        private resetText;
        private colorValue;
        $setColor(value: number): boolean;
        private resetColor;
        $onBlur(): void;
        _onInput(): void;
        private setAreaHeight;
        _onClickHandler(e: any): void;
        _onDisconnect(): void;
        private _styleInfoes;
        private setElementStyle;
        $removeFromStage(): void;
        $resetStageText(): void;
    }
}
declare namespace egret.web {
    class HTMLInput {
        private _stageText;
        private _simpleElement;
        private _multiElement;
        private _inputElement;
        _inputDIV: any;
        isInputOn(): boolean;
        isCurrentStageText(stageText: any): boolean;
        private initValue;
        _needShow: boolean;
        $scaleX: number;
        $scaleY: number;
        $updateSize(): void;
        private StageDelegateDiv;
        private canvas;
        _initStageDelegateDiv(container: any, canvas: any): any;
        private initInputElement;
        show(): void;
        disconnectStageText(stageText: any): void;
        clearInputElement(): void;
        getInputElement(stageText: any): HTMLInputElement | HTMLTextAreaElement;
    }
}
declare namespace egret.web {
    function $getTextAdapter(textfield: TextField): HTMLInput;
    function $cacheTextAdapter(adapter: HTMLInput, stage: any, container: HTMLDivElement, canvas: any): void;
}
declare namespace egret.web {
}
declare namespace egret {
    class Base64Util {
        static encode(arraybuffer: ArrayBuffer): string;
        static decode(base64: string): ArrayBuffer;
    }
}
declare let chars: string;
declare let lookup: Uint8Array;
declare namespace egret {
    class Endian {
        static LITTLE_ENDIAN: string;
        static BIG_ENDIAN: string;
    }
    const enum EndianConst {
        LITTLE_ENDIAN = 0,
        BIG_ENDIAN = 1
    }
    class ByteArray {
        protected bufferExtSize: number;
        protected data: DataView;
        protected _bytes: Uint8Array;
        protected _position: number;
        protected write_position: number;
        get endian(): string;
        set endian(value: string);
        protected $endian: EndianConst;
        constructor(buffer?: ArrayBuffer | Uint8Array, bufferExtSize?: number);
        setArrayBuffer(buffer: ArrayBuffer): void;
        get readAvailable(): number;
        get buffer(): ArrayBuffer;
        get rawBuffer(): ArrayBuffer;
        set buffer(value: ArrayBuffer);
        get bytes(): Uint8Array;
        get dataView(): DataView;
        set dataView(value: DataView);
        get bufferOffset(): number;
        get position(): number;
        set position(value: number);
        get length(): number;
        set length(value: number);
        protected _validateBuffer(value: number): void;
        get bytesAvailable(): number;
        clear(): void;
        readBoolean(): boolean;
        readByte(): number;
        readBytes(bytes: ByteArray, offset?: number, length?: number): void;
        readDouble(): number;
        readFloat(): number;
        readInt(): number;
        readShort(): number;
        readUnsignedByte(): number;
        readUnsignedInt(): number;
        readUnsignedShort(): number;
        readUTF(): string;
        readUTFBytes(length: number): string;
        writeBoolean(value: boolean): void;
        writeByte(value: number): void;
        writeBytes(bytes: ByteArray, offset?: number, length?: number): void;
        writeDouble(value: number): void;
        writeFloat(value: number): void;
        writeInt(value: number): void;
        writeShort(value: number): void;
        writeUnsignedInt(value: number): void;
        writeUnsignedShort(value: number): void;
        writeUTF(value: string): void;
        writeUTFBytes(value: string): void;
        toString(): string;
        _writeUint8Array(bytes: Uint8Array | ArrayLike<number>, validateBuffer?: boolean): void;
        validate(len: number): boolean;
        protected validateBuffer(len: number): void;
        private encodeUTF8;
        private decodeUTF8;
        private encoderError;
        private decoderError;
        private EOF_byte;
        private EOF_code_point;
        private inRange;
        private div;
        private stringToCodePoints;
    }
}
declare namespace egret {
    class Logger {
        static ALL: string;
        static DEBUG: string;
        static INFO: string;
        static WARN: string;
        static ERROR: string;
        static OFF: string;
        static set logLevel(logType: string);
    }
}
declare namespace egret {
    class NumberUtils {
        static isNumber(value: any): boolean;
        static sin(value: number): number;
        private static sinInt;
        static cos(value: number): number;
        private static cosInt;
        static convertStringToHashCode(str: string): number;
    }
}
declare let egret_sin_map: {};
declare let egret_cos_map: {};
declare let DEG_TO_RAD: number;
declare namespace egret {
    class Timer extends EventDispatcher {
        constructor(delay: number, repeatCount?: number);
        private _delay;
        get delay(): number;
        set delay(value: number);
        repeatCount: number;
        private _currentCount;
        get currentCount(): number;
        private _running;
        get running(): boolean;
        reset(): void;
        start(): void;
        stop(): void;
        private updateInterval;
        private lastCount;
        private lastTimeStamp;
        $update(timeStamp: number): boolean;
    }
}
declare namespace egret {
    interface XMLNode {
        nodeType: number;
        parent: XML;
    }
    interface XML extends XMLNode {
        attributes: any;
        children: XMLNode[];
        name: string;
        prefix: string;
        localName: string;
        namespace: string;
    }
    interface XMLText extends XMLNode {
        text: string;
    }
    let XML: {
        parse(text: string): XML;
    };
}
declare namespace egret {
    let $callLaterFunctionList: any[];
    let $callLaterThisList: any[];
    let $callLaterArgsList: any[];
    function callLater(method: Function, thisObject: any, ...args: any[]): void;
    let $callAsyncFunctionList: any[];
    let $callAsyncThisList: any[];
    let $callAsyncArgsList: any[];
    function $callAsync(method: Function, thisObject: any, ...args: any[]): void;
}
declare namespace egret {
    function superSetter(currentClass: any, thisObj: any, type: string, ...values: any[]): any;
    function superGetter(currentClass: any, thisObj: any, type: string): any;
}
declare namespace egret {
    function getDefinitionByName(name: string): any;
}
declare namespace egret {
    let getOption: (key: string) => string;
}
declare namespace egret {
    function getQualifiedClassName(value: any): string;
}
declare namespace egret {
    function getQualifiedSuperclassName(value: any): string;
}
declare namespace egret {
    function getTimer(): number;
}
declare namespace egret {
    function hasDefinition(name: string): boolean;
}
declare namespace egret {
    function is(instance: any, typeName: string): boolean;
}
declare namespace egret {
    function startTick(callBack: (timeStamp: number) => boolean, thisObject: any): void;
}
declare namespace egret {
    function stopTick(callBack: (timeStamp: number) => boolean, thisObject: any): void;
}
declare namespace egret {
    function toColorString(value: number): string;
}
declare namespace egret.web {
}
declare namespace egret.web {
    class AudioType {
        static WEB_AUDIO: number;
        static HTML5_AUDIO: number;
    }
    class Html5Capatibility extends HashObject {
        static _canUseBlob: boolean;
        static _audioType: number;
        static _AudioClass: any;
        constructor();
        private static ua;
        static $init(): void;
        private static setAudioType;
        private static getIOSVersion;
    }
    function getPrefixStyleName(name: string, element?: any): string;
    function getPrefix(name: string, element: any): string;
}
declare namespace egret.web {
    class WebCapability {
        static detect(): void;
        static injectUIntFixOnIE9(): void;
    }
}
declare namespace egret.web {
    class WebFps implements egret.FPSDisplay {
        private panelX;
        private panelY;
        private fontColor;
        private fontSize;
        private container;
        private fps;
        private log;
        private showPanle;
        private renderMode;
        constructor(stage: Stage, showFPS: boolean, showLog: boolean, logFilter: string, styles: Object);
        private containerFps;
        private fpsHeight;
        private divDatas;
        private divDraw;
        private divCost;
        private contextFps;
        private canvasFps;
        private WIDTH;
        private HEIGHT;
        private bgCanvasColor;
        private fpsFrontColor;
        private contextCost;
        private canvasCost;
        private WIDTH_COST;
        private cost1Color;
        private cost3Color;
        private addFps;
        private addLog;
        private arrFps;
        private arrCost;
        private lastNumDraw;
        update(datas: FPSData, showLastData?: boolean): void;
        private arrLog;
        updateInfo(info: string): void;
        updateWarn(info: string): void;
        updateError(info: string): void;
        private updateLogLayout;
    }
}
declare namespace egret.web {
    function getOption(key: string): string;
}
declare namespace egret.web {
    let WebLifeCycleHandler: egret.lifecycle.LifecyclePlugin;
}
declare namespace egret.web {
    class WebPlayer extends egret.HashObject implements egret.sys.Screen {
        constructor(container: HTMLDivElement, options: runEgretOptions);
        private init;
        private initOrientation;
        private readOption;
        private attachCanvas;
        private playerOption;
        private canvas;
        private container;
        stage: Stage;
        private webTouchHandler;
        private player;
        private webInput;
        updateScreenSize(): void;
        setContentSize(width: number, height: number): void;
        updateMaxTouches(): void;
    }
}
declare namespace egret.web {
    const enum WEBGL_ATTRIBUTE_TYPE {
        FLOAT_VEC2 = 35664,
        FLOAT_VEC3 = 35665,
        FLOAT_VEC4 = 35666,
        FLOAT = 5126,
        BYTE = 5120,
        UNSIGNED_BYTE = 5121,
        UNSIGNED_SHORT = 5123
    }
    const enum WEBGL_UNIFORM_TYPE {
        FLOAT_VEC2 = 35664,
        FLOAT_VEC3 = 35665,
        FLOAT_VEC4 = 35666,
        INT_VEC2 = 35667,
        INT_VEC3 = 35668,
        INT_VEC4 = 35669,
        BOOL = 35670,
        BOOL_VEC2 = 35671,
        BOOL_VEC3 = 35672,
        BOOL_VEC4 = 35673,
        FLOAT_MAT2 = 35674,
        FLOAT_MAT3 = 35675,
        FLOAT_MAT4 = 35676,
        SAMPLER_2D = 35678,
        SAMPLER_CUBE = 35680,
        BYTE = 5120,
        UNSIGNED_BYTE = 5121,
        SHORT = 5122,
        UNSIGNED_SHORT = 5123,
        INT = 5124,
        UNSIGNED_INT = 5125,
        FLOAT = 5126
    }
    function resizeContext(renderContext: egret.sys.RenderContext, width: number, height: number, useMaxSize?: boolean): void;
    function getContext2d(surface: HTMLCanvasElement): CanvasRenderingContext2D;
}
declare namespace egret.web {
}
declare namespace egret.web {
    class WebTouchHandler extends HashObject {
        constructor(stage: egret.Stage, canvas: HTMLCanvasElement);
        private canvas;
        private touch;
        private addListeners;
        private addMouseListener;
        private addTouchListener;
        private prevent;
        private onTouchBegin;
        private onMouseMove;
        private onTouchMove;
        private onTouchEnd;
        private getLocation;
        private scaleX;
        private scaleY;
        private rotation;
        updateScaleMode(scaleX: number, scaleY: number, rotation: number): void;
        $updateMaxTouches(): void;
    }
}
declare namespace egret.web {
    class XMLNode {
        constructor(nodeType: number, parent: XML);
        nodeType: number;
        parent: XML;
    }
    class XML extends XMLNode {
        constructor(localName: string, parent: XML, prefix: string, namespace: string, name: string);
        attributes: {
            [key: string]: string;
        };
        children: XMLNode[];
        name: string;
        prefix: string;
        localName: string;
        namespace: string;
    }
    class XMLText extends XMLNode {
        constructor(text: string, parent: XML);
        text: string;
    }
}
declare namespace egret.web {
    class CanvasRenderBuffer implements sys.RenderBuffer {
        constructor(width?: number, height?: number, root?: boolean);
        context: CanvasRenderingContext2D;
        surface: HTMLCanvasElement;
        get width(): number;
        get height(): number;
        resize(width: number, height: number, useMaxSize?: boolean): void;
        getPixels(x: number, y: number, width?: number, height?: number): number[];
        toDataURL(type?: string, encoderOptions?: number): string;
        clear(): void;
        destroy(): void;
    }
}
declare namespace egret.web {
    class EgretWebGLAttribute {
        private gl;
        private name;
        private type;
        private size;
        location: number;
        constructor(gl: WebGLRenderingContext, program: WebGLProgram, attributeData: any);
        count: number;
        private initCount;
        format: number;
        private initFormat;
    }
}
declare namespace egret.web {
    class EgretWebGLUniform {
        private gl;
        private name;
        type: WEBGL_UNIFORM_TYPE;
        private size;
        private location;
        constructor(gl: WebGLRenderingContext, program: WebGLProgram, uniformData: any);
        value: any;
        private setDefaultValue;
        setValue: Function;
        private generateSetValue;
        upload: Function;
        private generateUpload;
    }
}
declare namespace egret.web {
    class TextBlock extends HashObject {
        private readonly _width;
        private readonly _height;
        private readonly _border;
        line: Line;
        x: number;
        y: number;
        u: number;
        v: number;
        tag: string;
        readonly measureWidth: number;
        readonly measureHeight: number;
        readonly canvasWidthOffset: number;
        readonly canvasHeightOffset: number;
        readonly stroke2: number;
        constructor(width: number, height: number, measureWidth: number, measureHeight: number, canvasWidthOffset: number, canvasHeightOffset: number, stroke2: number, border: number);
        get border(): number;
        get width(): number;
        get height(): number;
        get contentWidth(): number;
        get contentHeight(): number;
        get page(): Page;
        updateUV(): boolean;
        get subImageOffsetX(): number;
        get subImageOffsetY(): number;
    }
    class Line extends HashObject {
        page: Page;
        private readonly textBlocks;
        dynamicMaxHeight: number;
        readonly maxWidth: number;
        x: number;
        y: number;
        constructor(maxWidth: number);
        isCapacityOf(textBlock: TextBlock): boolean;
        private lastTextBlock;
        addTextBlock(textBlock: TextBlock, needCheck: boolean): boolean;
    }
    class Page extends HashObject {
        readonly lines: Line[];
        readonly pageWidth: number;
        readonly pageHeight: number;
        webGLTexture: WebGLTexture;
        constructor(pageWidth: number, pageHeight: number);
        addLine(line: Line): boolean;
    }
    class Book extends HashObject {
        private readonly _pages;
        private _sortLines;
        private readonly _maxSize;
        private readonly _border;
        constructor(maxSize: number, border: number);
        addTextBlock(textBlock: TextBlock): boolean;
        private _addTextBlock;
        private createPage;
        private sort;
        createTextBlock(tag: string, width: number, height: number, measureWidth: number, measureHeight: number, canvasWidthOffset: number, canvasHeightOffset: number, stroke2: number): TextBlock;
    }
}
declare namespace egret.web {
    const textAtlasRenderEnable: boolean;
    let __textAtlasRender__: TextAtlasRender;
    const property_drawLabel: string;
    class DrawLabel extends HashObject {
        private static pool;
        anchorX: number;
        anchorY: number;
        textBlocks: TextBlock[];
        private clear;
        static create(): DrawLabel;
        static back(drawLabel: DrawLabel, checkRepeat: boolean): void;
    }
    class TextAtlasRender extends HashObject {
        private readonly book;
        private readonly charImageRender;
        private readonly textBlockMap;
        private _canvas;
        private readonly textAtlasTextureCache;
        private readonly webglRenderContext;
        constructor(webglRenderContext: WebGLRenderContext, maxSize: number, border: number);
        static analysisTextNodeAndFlushDrawLabel(textNode: sys.TextNode): void;
        private convertLabelStringToTextAtlas;
        private createTextTextureAtlas;
        private get canvas();
    }
}
declare namespace egret.web {
    const enum DRAWABLE_TYPE {
        TEXTURE = 0,
        RECT = 1,
        PUSH_MASK = 2,
        POP_MASK = 3,
        BLEND = 4,
        RESIZE_TARGET = 5,
        CLEAR_COLOR = 6,
        ACT_BUFFER = 7,
        ENABLE_SCISSOR = 8,
        DISABLE_SCISSOR = 9,
        SMOOTHING = 10
    }
    interface IDrawData {
        type: number;
        count: number;
        texture: WebGLTexture;
        filter: Filter;
        value: string;
        buffer: WebGLRenderBuffer;
        width: number;
        height: number;
        textureWidth: number;
        textureHeight: number;
        smoothing: boolean;
        x: number;
        y: number;
    }
    class WebGLDrawCmdManager {
        readonly drawData: IDrawData[];
        drawDataLen: number;
        constructor();
        pushDrawRect(): void;
        pushDrawTexture(texture: any, count?: number, filter?: any, textureWidth?: number, textureHeight?: number): void;
        pushChangeSmoothing(texture: WebGLTexture, smoothing: boolean): void;
        pushPushMask(count?: number): void;
        pushPopMask(count?: number): void;
        pushSetBlend(value: string): void;
        pushResize(buffer: WebGLRenderBuffer, width: number, height: number): void;
        pushClearColor(): void;
        pushActivateBuffer(buffer: WebGLRenderBuffer): void;
        pushEnableScissor(x: number, y: number, width: number, height: number): void;
        pushDisableScissor(): void;
        clear(): void;
    }
}
declare namespace egret.web {
    class WebGLRenderer implements sys.SystemRenderer {
        constructor();
        wxiOS10: boolean;
        private nestLevel;
        render(displayObject: DisplayObject, buffer: sys.RenderBuffer, matrix: Matrix, forRenderTexture?: boolean): number;
        private drawDisplayObject;
        private drawWithFilter;
        private getRenderCount;
        private drawWithClip;
        private drawWithScrollRect;
        drawNodeToBuffer(node: sys.RenderNode, buffer: WebGLRenderBuffer, matrix: Matrix, forHitTest?: boolean): void;
        drawDisplayToBuffer(displayObject: DisplayObject, buffer: WebGLRenderBuffer, matrix: Matrix): number;
        private renderNode;
        private renderNormalBitmap;
        private renderBitmap;
        private renderMesh;
        private canvasRenderer;
        private canvasRenderBuffer;
        private ___renderText____;
        private renderText;
        private renderGraphics;
        private renderGroup;
        private createRenderBuffer;
    }
}
declare namespace egret.web {
    class WebGLVertexArrayObject {
        private readonly vertSize;
        private readonly vertByteSize;
        private readonly maxQuadsCount;
        private readonly maxVertexCount;
        private readonly maxIndicesCount;
        private vertices;
        private indices;
        private indicesForMesh;
        private vertexIndex;
        private indexIndex;
        private hasMesh;
        private _vertices;
        private _verticesFloat32View;
        private _verticesUint32View;
        constructor();
        reachMaxSize(vertexCount?: number, indexCount?: number): boolean;
        getVertices(): any;
        getIndices(): any;
        getMeshIndices(): any;
        changeToMeshIndices(): void;
        isMesh(): boolean;
        cacheArrays(buffer: WebGLRenderBuffer, sourceX: number, sourceY: number, sourceWidth: number, sourceHeight: number, destX: number, destY: number, destWidth: number, destHeight: number, textureSourceWidth: number, textureSourceHeight: number, meshUVs?: number[], meshVertices?: number[], meshIndices?: number[], rotated?: boolean): void;
        clear(): void;
    }
}
