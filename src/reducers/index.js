// reducer with initial state
import { NAV_STYLE_BELOW_HEADER, THEME_TYPE_SEMI_DARK } from './../constants/theme-settings';

const initialState = {
    marketMetaDetails: [],
    allCoins: [],
    selectedCoin: null,
    marketMetaDetailsLoading: false,
    coinsCurrentPrice: {},
    coinsPriceChanges: {},
    uiSettings: {
        navCollapsed: true,
        navStyle: NAV_STYLE_BELOW_HEADER,
        themeType: THEME_TYPE_SEMI_DARK,
        screenWidth: 1367,
    }
};

export function reducer(state = initialState, action) {
    switch (action.type) {
        case 'MARKET_META_DETAILS_REQUEST':
            return { ...state, marketMetaDetailsLoading: true };
        case 'MARKET_META_DETAILS_FETCH_SUCCESS':
            return { ...state, marketMetaDetails: action.marketDetails, allCoins: action.allCoins, marketMetaDetailsLoading: false };
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
        case 'SET_COINS_CURRENT_PRICE':
            return {
                ...state,
                coinsCurrentPrice: action.payload.coinsCurrentPrice
            }
        case 'UPDATE_COINS_PRICE_CHANGE':
            return {
                ...state,
                coinsPriceChanges: action.payload.priceChanges
            }
        default:
            return state;
    }
}