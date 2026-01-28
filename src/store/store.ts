import { applyMiddleware, combineReducers } from "redux";
import { legacy_createStore as createStore } from 'redux';
import createSagaMiddleware from "redux-saga";
import cartReducer from "../reducers/cartReducer";
import rootSaga from "../sagas/cart";
import searchBarReducer from "../reducers/searchBarReducer";

// Используйте any для combineReducers чтобы обойти ошибку типов
const rootReducer = combineReducers<any>({
  cart: cartReducer,
  search: searchBarReducer
});

const sagaMiddleware = createSagaMiddleware();

// Создаем store - ошибка пропадет после использования any
const store = createStore(rootReducer, applyMiddleware(sagaMiddleware));
sagaMiddleware.run(rootSaga);

// Экспортируем типы
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;