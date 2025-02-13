import EventEmitter, { EventHandler } from '@/utils/eventBus';
import { useEffect } from 'react';

const events = new EventEmitter();

export default events;

export function useEventBus<T = any>(event: string, cb: EventHandler<T>) {
  useEffect(() => {
    events.on(event, cb);
    return () => {
      events.off(event, cb);
    };
  });
}
