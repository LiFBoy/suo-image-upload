import { Tracker } from 'nbugs-mobile-v2-utils';
import { name } from '../../../package.json';

function createLogger() {
  function onEffect(effect, saga, model, actionType) {
    return function*(...args) {
      const { type, ...restParams } = args[0];

      const start = +new Date();

      yield effect(...args);

      const end = +new Date();

      yield Tracker.logger({
        eventType: 'component-effect',
        component_name: name,
        effect_name: actionType,
        effect_params: JSON.stringify(restParams),
        effect_time: end - start,
      });
    };
  }

  return {
    onEffect,
  };
}

export default createLogger;
