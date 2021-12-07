import dva from 'dva-no-router';
import createLoading, { RESET } from './plugins/dva-loading';
import createLogger from './plugins/nbugs-logger';
import models from '../models';

let app;

const installModels = () => {
  models.forEach(model => {
    app.model(model.default);
  });
};

export const resetModels = () => {
  const namespaces = models.map(model => model.default.namespace);

  namespaces.forEach(namespace => {
    app._store.dispatch({ type: `${namespace}/resetState` });
  });

  app._store.dispatch({ type: `${RESET}` });
};

export default router => {
  app = dva({
    onError: () => {},
  });

  app.use(createLoading());

  // app.use(createLogger());

  installModels(app);

  app.router(() => router);

  const Provider = app.start();
  return {
    Provider,
    app,
  };
};
