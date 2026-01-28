import type { Action } from "redux";

// Определяем интерфейсы для типов действий
interface ChangeSearchQueryAction extends Action<"CHANGE_SEARCH_QUERY"> {
    payload: {
        query: string;
    };
}

type ClearSearchQueryAction = Action<"CLEAR_SEARCH_QUERY">

// Объединяем все типы действий
type SearchBarAction = ChangeSearchQueryAction | ClearSearchQueryAction;

export function changeSearchQuery(query: string): ChangeSearchQueryAction {
    return { type: "CHANGE_SEARCH_QUERY", payload: { query } };
}

export function clearSearchQuery(): ClearSearchQueryAction {
    return { type: "CLEAR_SEARCH_QUERY" };
}

const initialState = { query: localStorage.getItem("SearchQuery") || "" };

export default function searchBarReducer(
    state = initialState, 
    action: SearchBarAction
) {
    switch (action.type) {
        case "CHANGE_SEARCH_QUERY":
            localStorage.setItem("SearchQuery", action.payload.query);
            return { query: action.payload.query };
        case "CLEAR_SEARCH_QUERY":
            localStorage.removeItem("SearchQuery");
            return { query: "" };
        default:
            return state;
    }
}
