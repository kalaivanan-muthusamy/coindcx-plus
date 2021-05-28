// reducer with initial state
const initialState = {
    marketDetails: [],
    allCoins: [],
    selectedCoin: null,
    marketDetailsLoading: false,
};

export function reducer(state = initialState, action) {
    console.log({ action })
    switch (action.type) {
        case 'MARKET_DETAILS_REQUEST':
            return { ...state, marketDetailsLoading: true };
        case 'MARKET_DETAILS_FETCH_SUCCESS':
            return { ...state, marketDetails: action.marketDetails, allCoins: action.allCoins, marketDetailsLoading: false };
        case 'SET_SELECTED_COINN':
            return { ...state, selectedCoin: action.coinSymbol }
        default:
            return state;   
    }
}