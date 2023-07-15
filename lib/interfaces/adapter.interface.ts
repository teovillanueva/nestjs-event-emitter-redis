import { OnEventType } from './event.interface';
import { ListenerFn } from './listener.interface';

export interface EventEmitter {
  emit(event: OnEventType, ...args: any[]): void | Promise<void>;
}

export interface Adapter<OnEventOptions = any> extends EventEmitter {
  getRegisterListenerMethod(
    options?: OnEventOptions,
  ): (
    event: OnEventType,
    listener: ListenerFn,
    options?: OnEventOptions,
  ) => void;
  removeAllListeners(): void;
  ready(): void | Promise<void>;
  close(): void | Promise<void>;
}
