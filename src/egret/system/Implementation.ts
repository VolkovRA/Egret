namespace egret
{
    /**
     * @private
     */
    let implMap: any = {};

    /**
     * Adds an interface-name-to-implementation-class mapping to the registry.
     * @param interfaceName The interface name to register. For example："eui.IAssetAdapter", "eui.Theme".
     * @param instance The instance to register.
     * @version Egret 3.2.1
     * @platform Web,Native
     */
    export function registerImplementation(interfaceName: string, instance: any): void {
        implMap[interfaceName] = instance;
    }

    /**
     * Returns the singleton instance of the implementation class that was registered for the specified interface.
     * This method is usually called by egret framework.
     * @param interfaceName The interface name to identify. For example："eui.IAssetAdapter", "eui.Theme".
     * @returns The singleton instance of the implementation class.
     * @version Egret 3.2.1
     * @platform Web,Native
     */
    export function getImplementation(interfaceName: string): any {
        return implMap[interfaceName];
    }
}