import io from 'socket.io-client';
import { useEffect } from 'react';

const socketEndpoint = "wss://stream.coindcx.com";
const socket = io(socketEndpoint, {
    transports: ['websocket']
});



function OrderBook({ coinDetails }) {

    useEffect(() => {

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



}

export default OrderBook