import { createStore, applyMiddleware } from "redux";
import createSagaMiddleware from 'redux-saga'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { Provider } from "react-redux";
import allSagas from './sagas/index';
import CoinDetails from './pages/coin-details';
import Main from './Main';
import { reducer } from './reducers/index';
import { composeWithDevTools } from 'redux-devtools-extension';
import Coins from "./pages/coins";
import MarketAnalysis from './pages/market-analysis/index';
import MarketWatch from './pages/market-watch/index';
import Preferences from './pages/preferences/index';

// create the saga middleware
const sagaMiddleware = createSagaMiddleware();

// create a redux store with our reducer above and middleware
let store = createStore(
  reducer,
  composeWithDevTools(applyMiddleware(sagaMiddleware))
);

// run the saga
sagaMiddleware.run(allSagas);

export default function App() {
  return (
    <Provider store={store}>
      <Router>
        <Main>
          <Switch>
            <Route exact path="/">
              <Redirect to="/coins" />
            </Route>
            <Route exact path="/coins">
              <Coins />
            </Route>
            <Route path="/market-analysis">
              <MarketAnalysis />
            </Route>
            <Route path="/coins/:coinSymbol">
              <CoinDetails />
            </Route>
            <Route path="/market-watch">
              <MarketWatch />
            </Route>
            <Route path="/preferences">
              <Preferences />
            </Route>
          </Switch>
        </Main>
      </Router>
    </Provider>
  );
}