import { Controller, Injectable } from '@nestjs/common';
import { OnEvent } from '../../../lib/adapters/eventemitter2.adapter';

@Controller()
export class EventsControllerConsumer {
  public eventPayload = {};

  @OnEvent('test.*')
  onTestEvent(payload: Record<string, any>) {
    this.eventPayload = payload;
  }
}
