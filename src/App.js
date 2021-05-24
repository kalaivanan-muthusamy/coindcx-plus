import { useEffect } from 'react';
import axios from 'axios';
import crypto from 'crypto'

const baseurl = "https://api.coindcx.com"
const timeStamp = Math.floor(Date.now());

function App() {

  useEffect(() => {
    getUserDetails();
  }, [])

  async function getUserDetails() {
    console.log(timeStamp);
    let body = {
      "timestamp": timeStamp
    }
    const payload = new Buffer(JSON.stringify(body)).toString();
    const signature = crypto.createHmac('sha256', process.env.REACT_APP_COINDCX_SECRET).update(payload).digest('hex')
    const options = {
      url: baseurl + "/exchange/v1/funding/fetch_orders",
      headers: {
        'X-AUTH-APIKEY': process.env.REACT_APP_COINDCX_KEY,
        'X-AUTH-SIGNATURE': signature
      },
      json: true,
      body: body
    }
    const res = await axios(options);
  }


  return (
    <div>

    </div>
  );
}

export default App;
