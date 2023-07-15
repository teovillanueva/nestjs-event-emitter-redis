import { DynamicModule, Module } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';
import { EventSubscribersLoader } from './event-subscribers.loader';
import { EventsMetadataAccessor } from './events-metadata.accessor';
import { EventEmitterModuleOptions } from './interfaces';
import { ADAPTER_KEY } from './constants';

@Module({})
export class EventEmitterModule {
  static forRoot(options: EventEmitterModuleOptions): DynamicModule {
    return {
      global: options?.global ?? true,
      module: EventEmitterModule,
      imports: [DiscoveryModule],
      providers: [
        EventSubscribersLoader,
        EventsMetadataAccessor,
        {
          provide: ADAPTER_KEY,
          useValue: options.adapter,
        },
      ],
      exports: [ADAPTER_KEY],
    };
  }
}
