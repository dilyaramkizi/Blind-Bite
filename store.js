import { createStore, combineReducers, applyMiddleware } from "redux";
import { thunk } from 'redux-thunk';

import ordersReducer from './reducers/orderReducer';
import authReducer from "./reducers/authReducer";

const rootReducer = combineReducers({
  auth: authReducer,
  orders: ordersReducer,
});

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;
