import { Injectable } from '@nestjs/common';
import { OnEvent } from '../../../lib/adapters/redis.adapter';

@Injectable()
export class EventsProviderAliasedConsumer {
  private _eventPayload = {};

  set eventPayload(value) {
    this._eventPayload = value;
  }

  get eventPayload() {
    return this._eventPayload;
  }

  @OnEvent('test')
  onTestEvent(payload: Record<string, any>) {
    this.eventPayload = payload;
  }
}
