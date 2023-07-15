import { Module } from '@nestjs/common';
import { EventEmitterModule } from '../../../lib';
import { RedisAdapter } from '../../../lib/adapters/redis.adapter';
import { EventsControllerConsumer } from './events-controller.consumer';
import { EventsProviderAliasedConsumer } from './events-provider-aliased.consumer';
import { EventsProviderConsumer } from './events-provider.consumer';
import { EventsProviderRequestScopedConsumer } from './events-provider.request-scoped.consumer';
import { EventsProducer } from './events.producer';
import { TestProvider } from './test-provider';

@Module({
  imports: [
    EventEmitterModule.forRoot({
      adapter: new RedisAdapter({}),
    }),
  ],
  controllers: [EventsControllerConsumer],
  providers: [
    EventsProviderConsumer,
    EventsProducer,
    TestProvider,
    EventsProviderRequestScopedConsumer,
    EventsProviderAliasedConsumer,
    {
      provide: 'AnAliasedConsumer',
      useExisting: EventsProviderAliasedConsumer,
    },
  ],
})
export class AppModule {}
