import { OnEventType } from './event.interface';

export interface OnEventMetadata<O = any> {
  /**
   * Event (name or pattern) to subscribe to.
   */
  event: OnEventType;

  options?: O;
}
