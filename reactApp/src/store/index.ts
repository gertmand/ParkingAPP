import { createStore, combineReducers, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import { siteReducer } from "./reducers/siteReducer";


const rootReducer = combineReducers({
  site: siteReducer
});

export type AppState = ReturnType<typeof rootReducer>;

export default function configureStore() {
  const middlewares: any[] = [];
  const middleWareEnhancer = applyMiddleware(...middlewares);
  
  const store = createStore(
    rootReducer,
    composeWithDevTools(middleWareEnhancer)
  );

  return store;
}