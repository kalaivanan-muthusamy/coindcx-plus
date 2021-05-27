import io from 'socket.io-client';
import { useEffect } from 'react';

const socketEndpoint = "wss://stream.coindcx.com/";

function OrderBook({ coinDetails }) {

    useEffect(() => {

        const socket = io(socketEndpoint, {
            transports: ['websocket'],
            allowEIO3: true
        });
        console.log({ socket })

        //Join Channel
        socket.emit('join', {
            'channelName': "I-TRX_INR",
        });

        //Listen update on channelName
        socket.on('depth-update', (response) => {
            console.log(response.data);
        });

        return () => {
            // leave a channel
            socket.emit('leave', {
                'channelName': 'I-TRX_INR'
            });
        }
    }, [])


    return (
        <h4>Order Book</h4>
    )

}

export default OrderBook