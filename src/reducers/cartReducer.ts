import type { AnyAction } from "redux-saga";
import type { CartData } from "../utils/types";

export const ADD_TO_CART = 'ADD_TO_CART';
export const REMOVE_FROM_CART = 'REMOVE_FROM_CART';

function getTotal(state: CartData[]) {
    let price: number = 0;
    let amount: number = 0;
    for (let i = 0; i < state.length; i++) {
        amount = amount + state[i].amount;
        price = price + state[i].price * state[i].amount;
    }
    return {
        totalPrice: price,
        totalAmount: amount
    }
}

function updateState() {
    const allData: CartData[] = [];
    const currentCart = localStorage.getItem("BosaNogaCart");
    if (currentCart) {
        const r = JSON.parse(currentCart);
        for (let i = 0; i < r.length; i++) {
            allData.push(r[i]);
        }
    }
    const total = getTotal(allData);
    return {
        data: allData,
        totalAmount: total.totalAmount,
        totalPrice: total.totalPrice,
    }
}


const initialState: { data: CartData[], totalAmount: number, totalPrice: number } = updateState();


export function addToCart(item: {
    title: string,
    size: string,
    amount: number,
    price: number,
    id: number,
}) {
    return { type: ADD_TO_CART, payload: { item } };
}

export function removeFromCart(item: {
    title: string,
    size: string,
    amount: number,
    price: number,
    id: number,
}) {
    return { type: REMOVE_FROM_CART, payload: { item } };
}

export default function cartReducer(state = initialState, action : AnyAction) {
    switch (action.type) {
        case ADD_TO_CART: {
            const newItem: CartData = {
                title: action.payload.item.title,
                size: action.payload.item.size,
                amount: action.payload.item.amount,
                price: action.payload.item.price,
                id: action.payload.item.id,
                totalPrice: action.payload.item.price * action.payload.item.amount
            };
            const newCart = state.data.map(item => {
                if (item.size === newItem.size && item.id == newItem.id) {
                    const newAmount = item.amount + newItem.amount;
                    return {
                        ...item,
                        amount: newAmount,
                        totalPrice: item.price * newAmount
                    };
                } else {
                    return item;
                }
            });
            state.totalAmount = state.totalAmount + newItem.amount;
            state.totalPrice = state.totalPrice + newItem.amount * newItem.price;
            if (newCart.find(item => item.id === newItem.id && item.size === newItem.size))
                return { ...state, data: newCart };
            else
                return { ...state, data: [...newCart, newItem] };
        }
        case "ADD_TO_LOCAL_STORAGE": {
            if (state.data.length > 0) {
                const storagedCart = localStorage.getItem("BosaNogaCart");
                if (storagedCart) {
                    localStorage.removeItem("BosaNogaCart");
                }
                localStorage.setItem("BosaNogaCart", JSON.stringify(state.data));
            }
            return { ...state };
        }
        case "REMOVE_FROM_CART":
            {
                const idToRemove = action.payload.item.id;
                const sizeToRemove = action.payload.item.size;
                const otherItems = state.data.find((el) => el.id !== idToRemove || el.size !== sizeToRemove);
                if (otherItems) {
                    state.totalAmount = state.totalAmount - action.payload.item.amount;
                    state.totalPrice = state.totalPrice - action.payload.item.amount * action.payload.item.price;
                }
                else {
                    state.totalAmount = 0;
                    state.totalPrice = 0;
                }
                state.data = state.data.filter((el) => el.id !== idToRemove || el.size !== sizeToRemove);
                return { ...state };
            }
        case "REMOVE_FROM_LOCAL_STORAGE":
            {
                const storagedCart = localStorage.getItem("BosaNogaCart");
                if (storagedCart) {
                    localStorage.removeItem("BosaNogaCart");
                }
                if (state.data.length > 0) {
                    localStorage.setItem("BosaNogaCart", JSON.stringify(state.data));
                }
                return { ...state };
            }
        default:
            return state;
    }
}
