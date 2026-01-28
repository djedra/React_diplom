import { all, put, takeEvery } from "redux-saga/effects"
import { ADD_TO_CART, REMOVE_FROM_CART } from "../reducers/cartReducer"

// Our worker Saga: will perform the async increment task
export function* addToCart() {
    yield put({ type: "ADD_TO_LOCAL_STORAGE" })
}

// Our watcher Saga: spawn a new incrementAsync task on each INCREMENT_ASYNC
export function* watchAddToCart() {
    yield takeEvery(ADD_TO_CART, addToCart)
}

// Our worker Saga: will perform the async increment task
export function* removeFromCart() {
    yield put({ type: "REMOVE_FROM_LOCAL_STORAGE" })
}

// Our watcher Saga: spawn a new incrementAsync task on each INCREMENT_ASYNC
export function* watchRemoveFromCart() {
    yield takeEvery(REMOVE_FROM_CART, removeFromCart)
}

// notice how we now only export the rootSaga
// single entry point to start all Sagas at once
export default function* rootSaga() {
    yield all([
        watchAddToCart(),
        watchRemoveFromCart()
    ])
}