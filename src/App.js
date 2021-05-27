import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import Coin from './pages/coin';
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