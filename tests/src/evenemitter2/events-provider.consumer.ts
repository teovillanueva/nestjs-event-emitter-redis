import { Injectable } from '@nestjs/common';
import { OnEvent } from '../../../lib/adapters/eventemitter2.adapter';

@Injectable()
export class EventsProviderConsumer {
  public eventPayload = {};
  public stackedEventCalls = 0;

  @OnEvent('test.*')
  onTestEvent(payload: Record<string, any>) {
    this.eventPayload = payload;
  }

  @OnEvent('stacked1.*')
  @OnEvent('stacked2.*')
  onStackedEvent() {
    this.stackedEventCalls++;
  }
}
