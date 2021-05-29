import { createStore, applyMiddleware, compose } from "redux";
import createSagaMiddleware from 'redux-saga'
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import { Provider } from "react-redux";
import allSagas from './sagas/index';
import Coin from './pages/coin';
import Main from './Main';
import { reducer } from './reducers/index';
import { composeWithDevTools } from 'redux-devtools-extension';

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
            <Route path="/coins/:coinSymbol">
              <Coin />
            </Route>
          </Switch>
        </Main>
      </Router>
    </Provider>
  );
}