import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers/rootReducer.js';

const configureStore = initialState => {
    const middlewares = [thunk];
    const middlewareEnhancer = applyMiddleware(...middlewares);

    const enhancers = [middlewareEnhancer];
    const composeEnhancers =
        (process.env.NODE_ENV !== 'production' &&
            typeof window !== 'undefined' &&
            window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
        compose;
    const composedEnhancers = composeEnhancers(...enhancers);

    const store = createStore(rootReducer, initialState, composedEnhancers);

    if (process.env.NODE_ENV !== 'production' && module.hot) {
        module.hot.accept('./reducers/rootReducer', () =>
            store.replaceReducer(rootReducer)
        );
    }

    return store;
};

export default configureStore;
