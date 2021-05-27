import { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import axios from 'axios';

axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
axios.defaults.headers.post['Content-Type'] ='application/json;charset=utf-8';

function App() {

  useEffect(() => {
    getHistoryDetails();
  }, [])

  async function getHistoryDetails() {
    try {
      const res = await axios.get('https://api.coinmarketcap.com/data-api/v3/cryptocurrency/historical?id=1959&convertId=2796&timeStart=1616803200&timeEnd=1622073600');
      console.log({ res })
    } catch (err) {
      console.error(err)
    }
  }


  return (
    <div>

    </div>
  );
}

export default App;
