import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/evenemitter2/app.module';
import {
  TEST_EVENT_MULTIPLE_PAYLOAD,
  TEST_EVENT_PAYLOAD,
  TEST_EVENT_STRING_PAYLOAD,
} from '../src/evenemitter2/constants';
import { CUSTOM_DECORATOR_EVENT } from '../src/evenemitter2/custom-decorator-test.constants';
import { CustomEventDecoratorConsumer } from '../src/evenemitter2/custom-decorator-test.consumer';
import { EventsControllerConsumer } from '../src/evenemitter2/events-controller.consumer';
import { EventsProviderAliasedConsumer } from '../src/evenemitter2/events-provider-aliased.consumer';
import { EventsProviderPrependConsumer } from '../src/evenemitter2/events-provider-prepend.consumer';
import { EventsProviderConsumer } from '../src/evenemitter2/events-provider.consumer';
import { EventsProviderRequestScopedConsumer } from '../src/evenemitter2/events-provider.request-scoped.consumer';
import { TEST_PROVIDER_TOKEN } from '../src/evenemitter2/test-provider';
import { ADAPTER_KEY } from '../../lib/constants';
import { EventEmitter2Adapter } from '../../lib/adapters/eventemitter2.adapter';
import { EventEmitter } from '../../lib';

describe('EventEmitterModule (eventemitter2) - e2e', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
  });

  it(`should emit a "test-event" event to providers`, async () => {
    const eventsConsumerRef = app.get(EventsProviderConsumer);
    await app.init();

    expect(eventsConsumerRef.eventPayload).toEqual(TEST_EVENT_PAYLOAD);
  });

  it(`should emit a "stacked-event" event to providers`, async () => {
    const eventsConsumerRef = app.get(EventsProviderConsumer);
    await app.init();

    expect(eventsConsumerRef.stackedEventCalls).toEqual(2);
  });

  it(`aliased providers should receive an event only once`, async () => {
    const eventsConsumerRef = app.get(EventsProviderAliasedConsumer);
    const eventSpy = jest.spyOn(eventsConsumerRef, 'eventPayload', 'set');
    await app.init();

    expect(eventSpy).toBeCalledTimes(1);
    eventSpy.mockRestore();
  });

  it(`should emit a "test-event" event to controllers`, async () => {
    const eventsConsumerRef = app.get(EventsControllerConsumer);
    await app.init();

    expect(eventsConsumerRef.eventPayload).toEqual(TEST_EVENT_PAYLOAD);
  });

  it('should be able to specify a consumer be prepended via OnEvent decorator options', async () => {
    const eventsConsumerRef = app.get(EventsProviderPrependConsumer);
    const prependListenerSpy = jest.spyOn(
      (app.get(ADAPTER_KEY) as EventEmitter2Adapter).emitter,
      'prependListener',
    );
    await app.init();

    expect(eventsConsumerRef.eventPayload).toEqual(TEST_EVENT_PAYLOAD);
    expect(prependListenerSpy).toHaveBeenCalled();
  });

  it('should work with null prototype provider value', async () => {
    const moduleWithNullProvider = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(TEST_PROVIDER_TOKEN)
      .useFactory({
        factory: () => {
          const testObject = { a: 13, b: 7 };
          Object.setPrototypeOf(testObject, null);
          return testObject;
        },
      })
      .compile();
    app = moduleWithNullProvider.createNestApplication();
    await expect(app.init()).resolves.not.toThrow();
  });

  it('should be able to emit a request-scoped event with a single payload', async () => {
    await app.init();

    expect(
      EventsProviderRequestScopedConsumer.injectedEventPayload.objectValue,
    ).toEqual(TEST_EVENT_PAYLOAD);
  });

  it('should be able to emit a request-scoped event with a string payload', async () => {
    await app.init();

    expect(
      EventsProviderRequestScopedConsumer.injectedEventPayload.stringValue,
    ).toEqual(TEST_EVENT_STRING_PAYLOAD);
  });

  it('should be able to emit a request-scoped event with multiple payloads', async () => {
    await app.init();

    expect(
      EventsProviderRequestScopedConsumer.injectedEventPayload.arrayValue,
    ).toEqual(TEST_EVENT_MULTIPLE_PAYLOAD);
  });

  it('should work with non array metadata', async () => {
    await app.init();

    const emitter = app.get(ADAPTER_KEY) as EventEmitter;
    const customConsumer = app.get(CustomEventDecoratorConsumer);

    // callback called synchronysly
    emitter.emit(CUSTOM_DECORATOR_EVENT);

    expect(customConsumer.isEmitted).toBeTruthy();
  });

  afterEach(async () => {
    await app.close();
  });
});
