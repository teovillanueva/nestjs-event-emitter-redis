import { Adapter } from '../interfaces';
import EventEmitter2, { ConstructorOptions, OnOptions } from 'eventemitter2';
import { extendArrayMetadata } from '@nestjs/common/utils/extend-metadata.util';
import { EVENT_LISTENER_METADATA } from '../constants';
import { OnEventType } from '../interfaces/event.interface';
import { OnEventMetadata } from '../interfaces/metadata.interface';

export type OnEventOptions = OnOptions & {
  /**
   * If "true", prepends (instead of append) the given listener to the array of listeners.
   *
   * @see https://github.com/EventEmitter2/EventEmitter2#emitterprependlistenerevent-listener-options
   *
   * @default false
   */
  prependListener?: boolean;
};

/**
 * `@OnEvent` decorator metadata
 */
export interface EventEmitterOnEventMetadata
  extends OnEventMetadata<OnEventOptions> {
  /**
   * Subscription options.
   */
  options?: OnEventOptions;
}

export class EventEmitter2Adapter implements Adapter<OnEventOptions> {
  public readonly emitter: EventEmitter2;

  constructor(private readonly options?: ConstructorOptions) {
    this.emitter = new EventEmitter2(options);
  }
  close(): void | Promise<void> {
    return;
  }

  emit(event: OnEventType, ...args: any[]): void {
    this.emitter.emit(event, ...args);
  }

  getRegisterListenerMethod(options?: OnEventOptions) {
    return Boolean(options?.prependListener)
      ? this.emitter.prependListener.bind(this.emitter)
      : this.emitter.on.bind(this.emitter);
  }

  ready() {
    return;
  }

  removeAllListeners(): void {
    this.emitter.removeAllListeners();
  }
}

/**
 * Event listener decorator.
 * Subscribes to events based on the specified name(s).
 *
 * @param event event to subscribe to
 */
export const OnEvent = (
  event: OnEventType,
  options?: OnEventOptions,
): MethodDecorator => {
  const decoratorFactory = (target: object, key?: any, descriptor?: any) => {
    extendArrayMetadata(
      EVENT_LISTENER_METADATA,
      [{ event, options } as OnEventMetadata],
      descriptor.value,
    );
    return descriptor;
  };
  decoratorFactory.KEY = EVENT_LISTENER_METADATA;
  return decoratorFactory;
};
