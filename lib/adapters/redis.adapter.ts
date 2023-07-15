import { Redis, type RedisOptions } from 'ioredis';
import { Adapter } from '../interfaces/adapter.interface';
import { OnEventType } from '../interfaces/event.interface';
import { extendArrayMetadata } from '@nestjs/common/utils/extend-metadata.util';
import { EVENT_LISTENER_METADATA } from '../constants';
import { OnEventMetadata } from '../interfaces/metadata.interface';

export class RedisAdapter implements Adapter {
  private publisher: Redis;
  private subscriber: Redis;
  private readonly listeners: {
    event: OnEventType;
    listener: (message: any) => void;
  }[] = [];

  constructor(private readonly options: RedisOptions) {
    this.publisher = new Redis(options);
    this.subscriber = new Redis(options);
  }

  async close(): Promise<void> {
    if (this.publisher.status !== 'end') await this.publisher.quit();
    if (this.subscriber.status !== 'end') await this.subscriber.quit();
  }

  async emit(event: OnEventType, ...messages: any[]) {
    for (const message of messages) {
      await this.publisher.publish(event.toString(), JSON.stringify(message));
    }
  }

  async ready() {
    if (
      this.publisher.status !== 'ready' &&
      this.publisher.status !== 'connecting'
    ) {
      await this.publisher.connect();
    }

    if (
      this.subscriber.status !== 'ready' &&
      this.subscriber.status !== 'connecting'
    ) {
      await this.subscriber.connect();
    }

    await this.subscriber.subscribe(
      ...new Set(this.listeners.map(l => l.event.toString())),
    );

    this.subscriber.on('message', (channel, message) => {
      const listeners = this.listeners.filter(
        l => l.event.toString() === channel,
      );

      for (const listener of listeners) {
        listener.listener(JSON.parse(message));
      }
    });
  }

  removeAllListeners(): void {
    this.subscriber.removeAllListeners();
    this.publisher.removeAllListeners();
  }

  getRegisterListenerMethod(): (
    event: OnEventType,
    listener: (message: any) => void,
  ) => void {
    return (event: OnEventType, listener: (message: any) => void) => {
      const events = Array.isArray(event) ? event : [event];

      for (const e of events) {
        this.listeners.push({ event: e, listener });
      }
    };
  }
}

/**
 * Event listener decorator.
 * Subscribes to events based on the specified name(s).
 *
 * @param event event to subscribe to
 */
export const OnEvent = (event: OnEventType): MethodDecorator => {
  const decoratorFactory = (target: object, key?: any, descriptor?: any) => {
    extendArrayMetadata(
      EVENT_LISTENER_METADATA,
      [{ event } as OnEventMetadata],
      descriptor.value,
    );
    return descriptor;
  };
  decoratorFactory.KEY = EVENT_LISTENER_METADATA;
  return decoratorFactory;
};
