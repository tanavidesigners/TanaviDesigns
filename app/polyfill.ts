// Polyfill WeakRef if running in an environment where globalThis.WeakRef is not exposed
if (typeof globalThis.WeakRef === "undefined") {
  // @ts-ignore
  globalThis.WeakRef = class WeakRef<T extends object> {
    private target: T;
    constructor(target: T) {
      this.target = target;
    }
    deref(): T | undefined {
      return this.target;
    }
  };
}
