import { put, takeEvery } from 'redux-saga/effects'
import axios from 'axios';
import { MARKETS } from './../constants/index';

function* fetchMarketMetaDetails() {
    try {
        const { data: markedDetailsData } = yield axios.get(
            "https://coinanalysis-api.netlify.app/.netlify/functions/market_details"
        );
        const marketDetails = markedDetailsData
            ?.filter((c) => MARKETS.includes(c.base_currency_short_name))
        const allCoins = marketDetails
            .map((a) => ({
                label: `${a?.target_currency_name} (${a?.target_currency_short_name})`,
                value: a?.coindcx_name,
            }));
        yield put({ type: "MARKET_META_DETAILS_FETCH_SUCCESS", marketDetails, allCoins });
    } catch (e) {
        // yield put({ type: "USER_FETCH_FAILED", message: e.message });
    }
}

function* setSelectedCoin({ payload }) {
    yield put({ type: "SET_SELECTED_COINN", coinSymbol: payload.coinSymbol, coinPair: payload?.coinPair });
}

function* allSagas() {
    yield takeEvery("MARKET_META_DETAILS_REQUEST", fetchMarketMetaDetails);
    yield takeEvery("SET_SELECTED_COIN", setSelectedCoin);
}

export default allSagas;
