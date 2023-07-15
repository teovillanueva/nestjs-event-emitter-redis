import { Inject } from '@nestjs/common';
import { ADAPTER_KEY } from '../constants';

export const InjectEmitter = () => Inject(ADAPTER_KEY);
