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
import io from 'socket.io-client';

// create the saga middleware
const sagaMiddleware = createSagaMiddleware();

// create a redux store with our reducer above and middleware
let store = createStore(
  reducer,
  composeWithDevTools(applyMiddleware(sagaMiddleware))
);

// run the saga
sagaMiddleware.run(allSagas);
const socket = io("wss://stream.coindcx.com", { transports: ['websocket']});

//Join Channel
socket.emit('join', {
  'channelName': "I-XRP_INR",
});

//Listen update on channelName
socket.on('depth-update', (response) => {
  console.log(response.data);
});

// leave a channel
socket.emit('leave', {
  'channelName': 'B-XRP_ETH'
});

socket.on("connect", () => {
  console.log(socket.id);
});

socket.on("disconnect", () => {
  console.log(socket.id); // undefined
});

socket.on("connect_error", (err) => {
  console.log(err);
});

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