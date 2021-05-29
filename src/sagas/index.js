import { put, takeEvery } from 'redux-saga/effects'
import axios from 'axios';

function* fetchMarketDetails() {
    try {
        const { data: markedDetailsData } = yield axios.get(
            "https://coinanalysis-api.netlify.app/.netlify/functions/market_details"
        );
        const marketDetails = markedDetailsData
            ?.filter((c) => c.base_currency_short_name === "INR")
        const allCoins = marketDetails
            .map((a) => ({
                label: `${a?.target_currency_name} (${a?.target_currency_short_name})`,
                value: a?.target_currency_short_name,
            }));
        yield put({ type: "MARKET_DETAILS_FETCH_SUCCESS", marketDetails, allCoins });
    } catch (e) {
        yield put({ type: "USER_FETCH_FAILED", message: e.message });
    }
}

function* setSelectedCoin({ payload }) {
    yield put({ type: "SET_SELECTED_COINN", coinSymbol: payload.coinSymbol, coinPair: `I-${payload?.coinSymbol}_INR` });
}

function* allSagas() {
    yield takeEvery("MARKET_DETAILS_REQUEST", fetchMarketDetails);
    yield takeEvery("SET_SELECTED_COIN", setSelectedCoin);
}

export default allSagas;
