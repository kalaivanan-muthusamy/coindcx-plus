import { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Coin from './Coin';
import Main from './Main';

export default function App() {
  return (
    <Main>
      <Router>
        <Switch>
          <Route path="/coin/:coinSymbol">
            <Coin />
          </Route>
        </Switch>
      </Router>
    </Main>
  );
}