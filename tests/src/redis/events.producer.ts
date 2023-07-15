import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import {
  TEST_EVENT_MULTIPLE_PAYLOAD,
  TEST_EVENT_PAYLOAD,
  TEST_EVENT_STRING_PAYLOAD,
} from './constants';
import { EventEmitter, InjectEmitter } from '../../../lib';

@Injectable()
export class EventsProducer implements OnApplicationBootstrap {
  constructor(
    @InjectEmitter()
    private readonly eventEmitter: EventEmitter,
  ) {}

  async onApplicationBootstrap() {
    await this.eventEmitter.emit('test', TEST_EVENT_PAYLOAD);
    await this.eventEmitter.emit('multiple', TEST_EVENT_MULTIPLE_PAYLOAD);
    await this.eventEmitter.emit('string', TEST_EVENT_STRING_PAYLOAD);
    await this.eventEmitter.emit('stacked1', TEST_EVENT_PAYLOAD);
    await this.eventEmitter.emit('stacked2', TEST_EVENT_PAYLOAD);
  }
}
