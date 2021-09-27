import { put, takeEvery } from 'redux-saga/effects'
import { serviceCall } from '../utils/api-call';

function* fetchMarketMetaDetails() {
    try {
        const { data: markedDetailsData } = yield serviceCall('GET', 'markets');
        const marketDetails = markedDetailsData;
        const allCoins = marketDetails
            .map((a) => ({
                label: `${a?.target_currency_name} (${a?.target_currency_short_name})`,
                value: a?.pair,
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
