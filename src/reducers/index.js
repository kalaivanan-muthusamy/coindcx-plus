// reducer with initial state
import { NAV_STYLE_BELOW_HEADER, THEME_TYPE_SEMI_DARK } from './../constants/theme-settings';

const initialState = {
    marketDetails: [],
    allCoins: [],
    selectedCoin: null,
    marketDetailsLoading: false,
    uiSettings: {
        navCollapsed: true,
        navStyle: NAV_STYLE_BELOW_HEADER,
        themeType: THEME_TYPE_SEMI_DARK,
        screenWidth: 1367,
    }
};

export function reducer(state = initialState, action) {
    console.log({ action })
    switch (action.type) {
        case 'MARKET_DETAILS_REQUEST':
            return { ...state, marketDetailsLoading: true };
        case 'MARKET_DETAILS_FETCH_SUCCESS':
            return { ...state, marketDetails: action.marketDetails, allCoins: action.allCoins, marketDetailsLoading: false };
        case 'SET_SELECTED_COINN':
            return { ...state, selectedCoin: action.coinSymbol, coinPair: action.coinPair }
        case 'TOGGLE_COLLAPSED_NAV':
            return {
                ...state,
                uiSettings: {
                    ...state.uiSettings,
                    navCollapsed: action.payload.navCollapsed
                }
            };
        case 'UPDATE_SCREEN_WIDTH':
            return {
                ...state,
                uiSettings: {
                    ...state.uiSettings,
                    screenWidth: action.payload.screenWidth
                }
            };
        default:
            return state;
    }
}