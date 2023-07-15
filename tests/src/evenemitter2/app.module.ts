import { Module } from '@nestjs/common';
import { EventEmitterModule } from '../../../lib';
import { EventEmitter2Adapter } from '../../../lib/adapters/eventemitter2.adapter';
import { CustomEventDecoratorConsumer } from './custom-decorator-test.consumer';
import { EventsControllerConsumer } from './events-controller.consumer';
import { EventsProviderAliasedConsumer } from './events-provider-aliased.consumer';
import { EventsProviderPrependConsumer } from './events-provider-prepend.consumer';
import { EventsProviderConsumer } from './events-provider.consumer';
import { EventsProviderRequestScopedConsumer } from './events-provider.request-scoped.consumer';
import { EventsProducer } from './events.producer';
import { TestProvider } from './test-provider';

@Module({
  imports: [
    EventEmitterModule.forRoot({
      adapter: new EventEmitter2Adapter({
        wildcard: true,
      }),
    }),
  ],
  controllers: [EventsControllerConsumer],
  providers: [
    EventsProviderConsumer,
    EventsProviderPrependConsumer,
    EventsProducer,
    TestProvider,
    EventsProviderRequestScopedConsumer,
    EventsProviderAliasedConsumer,
    {
      provide: 'AnAliasedConsumer',
      useExisting: EventsProviderAliasedConsumer,
    },
    CustomEventDecoratorConsumer,
  ],
})
export class AppModule {}
