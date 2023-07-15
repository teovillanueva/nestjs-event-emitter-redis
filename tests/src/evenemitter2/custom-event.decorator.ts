import { SetMetadata } from '@nestjs/common';

import { EVENT_LISTENER_METADATA } from '../../../lib/constants';
import { OnEventMetadata } from '../../../lib';
import { OnEventOptions } from '../../../lib/adapters/eventemitter2.adapter';

export const CustomEvent = (event: string, options?: OnEventOptions) =>
  SetMetadata(EVENT_LISTENER_METADATA, {
    event,
    options,
  } as OnEventMetadata);
