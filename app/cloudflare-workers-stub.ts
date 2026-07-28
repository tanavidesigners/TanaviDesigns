export class WorkerEntrypoint {}
export class DurableObject {}
export class WorkflowEntrypoint {}

export const env = new Proxy({}, {
  get(_target, prop) {
    return (globalThis as any)[prop] || (process as any).env?.[prop];
  }
});
