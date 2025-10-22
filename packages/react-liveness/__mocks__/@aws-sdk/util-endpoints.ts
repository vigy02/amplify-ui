/**
 * Mock for @aws-sdk/util-endpoints to fix EndpointCache constructor issue
 * in SDK v3.914.0+
 */

const actual = jest.requireActual('@aws-sdk/util-endpoints');

export class EndpointCache {
    private cache = new Map();

    get(key: string) {
        return this.cache.get(key);
    }

    set(key: string, value: any) {
        this.cache.set(key, value);
    }

    delete(key: string) {
        return this.cache.delete(key);
    }

    clear() {
        this.cache.clear();
    }
}

// Export everything else from the actual module
export * from '@aws-sdk/util-endpoints';
