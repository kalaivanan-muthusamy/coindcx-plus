import axios from 'axios';
import { useEffect } from 'react';

function Coin() {

    const [allCoins, setAllCoins] = useEffect(null)

    useEffect(() => {
        getFullDetails();
    }, [])

    async function getFullDetails() {
        try {
            const res = await axios.get("https://api.coinmarketcap.com/data-api/v3/map/all?cryptoAux=is_active,status&exchangeAux=is_active,status&listing_status=active,untracked")
            setAllCoins(res);
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <h1>n</h1>
    )
}

export default Coin