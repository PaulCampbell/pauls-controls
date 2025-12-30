import { Window } from 'happy-dom';

const windowInstance = new Window();
const { document } = windowInstance;

const defineGlobal = (key, value) => {
  try {
    const existing = Object.getOwnPropertyDescriptor(globalThis, key);
    if (existing && existing.configurable === false) {
      return;
    }

    Object.defineProperty(globalThis, key, {
      value,
      writable: true,
      configurable: true,
    });
  } catch {
    // Ignore failures for non-configurable globals.
  }
};

defineGlobal('window', windowInstance);
defineGlobal('document', document);
defineGlobal('navigator', windowInstance.navigator);
defineGlobal('customElements', windowInstance.customElements);
defineGlobal('HTMLElement', windowInstance.HTMLElement);
defineGlobal('HTMLTemplateElement', windowInstance.HTMLTemplateElement);
defineGlobal('HTMLCanvasElement', windowInstance.HTMLCanvasElement);
defineGlobal('Event', windowInstance.Event);
defineGlobal('CustomEvent', windowInstance.CustomEvent);
defineGlobal('KeyboardEvent', windowInstance.KeyboardEvent);
defineGlobal('MouseEvent', windowInstance.MouseEvent);
defineGlobal('PointerEvent', windowInstance.PointerEvent);

if (!globalThis.requestAnimationFrame) {
  globalThis.requestAnimationFrame = (callback) => setTimeout(() => callback(Date.now()), 16);
}

if (!globalThis.cancelAnimationFrame) {
  globalThis.cancelAnimationFrame = (handle) => clearTimeout(handle);
}
