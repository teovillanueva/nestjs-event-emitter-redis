import { Injectable } from '@nestjs/common';
import { OnEvent } from '../../../lib/adapters/redis.adapter';

@Injectable()
export class EventsProviderConsumer {
  public eventPayload = {};
  public stackedEventCalls = 0;

  @OnEvent('test')
  onTestEvent(payload: Record<string, any>) {
    this.eventPayload = payload;
  }

  @OnEvent('stacked1')
  @OnEvent('stacked2')
  onStackedEvent(_data: any, channel: any) {
    this.stackedEventCalls++;
  }
}
