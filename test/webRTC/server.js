const bodyParser = require('body-parser');
const express = require('express');
const { EventEmitter } = require('events');
const broadcaster = new EventEmitter();

const WebRtcConnectionManager = require('./connections/webrtcconnectionmanager');

const app = express();

app.use(bodyParser.json());

app.all("*", function(req,res,next){
    //设置允许跨域的域名，*代表允许任意域名跨域
    res.header("Access-Control-Allow-Origin","*");
    //允许的header类型
    res.header("Access-Control-Allow-Headers","content-type");
    //跨域允许的请求方式 
    res.header("Access-Control-Allow-Methods","DELETE,PUT,POST,GET,OPTIONS");
    if (req.method.toLowerCase() == 'options')
        res.send(200);  // 让options尝试请求快速结束
    else
        next();
});


app.use(express.static('./public'));


const connectionManagerServer = WebRtcConnectionManager.create({ beforeOffer: beforeOfferServer });
const connectionManagerView = WebRtcConnectionManager.create({ beforeOffer: beforeOfferView });


app.post(`/connections/:env`, async (req, res) => { // view, inite
    const { env } = req.params;
    try {
        let connection = null;
        if (env === 'view') {
            connection = await connectionManagerView.createConnection();
        } else if (env === 'inite') {
            connection = await connectionManagerServer.createConnection();
        }
        res.send(connection);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
});

app.delete(`/connections/:env/:id`, async (req, res) => { // view, inite
    const { id, env } = req.params;
    let connection = null;
    if (env === 'view') {
        connection = await connectionManagerView.getConnection(id);
    } else if (env === 'inite') {
        connection = await connectionManagerServer.getConnection(id);
    }
    if (!connection) {
        res.sendStatus(404);
        return;
    }

    connection.close();
    res.send(connection);
});

app.post(`/connections/:env/:id/remote-description`, async (req, res) => { // view, inite
    const { id, env } = req.params;
    let connection = null;
    if (env === 'view') {
        connection = await connectionManagerView.getConnection(id);
    } else if (env === 'inite') {
        connection = await connectionManagerServer.getConnection(id);
    }
    if (!connection) {
        res.sendStatus(404);
        return;
    }
    try {
        await connection.applyAnswer(req.body);
        res.send(connection.toJSON().remoteDescription);
    } catch (error) {
        res.sendStatus(400);
    }
});


function beforeOfferServer(peerConnection) {
    const audioTrack = broadcaster.audioTrack = peerConnection.addTransceiver('audio').receiver.track;
    const videoTrack = broadcaster.videoTrack = peerConnection.addTransceiver('video').receiver.track;

    broadcaster.emit('newBroadcast', {
        audioTrack,
        videoTrack
    });

    const { close } = peerConnection;
    peerConnection.close = function() {
        audioTrack.stop()
        videoTrack.stop()
        return close.apply(this, arguments);
    };
}

function beforeOfferView(peerConnection) {
    const audioTransceiver = peerConnection.addTransceiver('audio');
    const videoTransceiver = peerConnection.addTransceiver('video');

    function onNewBroadcast({ audioTrack, videoTrack }) {
        audioTransceiver.sender.replaceTrack(audioTrack),
            videoTransceiver.sender.replaceTrack(videoTrack)
    }

    broadcaster.on('newBroadcast', onNewBroadcast)

    if (broadcaster.audioTrack && broadcaster.videoTrack) {
        onNewBroadcast(broadcaster);
    }

    const { close } = peerConnection;
    peerConnection.close = function() {
        broadcaster.removeListener('newBroadcast', onNewBroadcast);
        return close.apply(this, arguments);
    }
}


const server = app.listen(3001, () => {
    const address = server.address();
    console.log(`http://localhost:${address.port}\n`);

    server.once('close', () => {
        connectionManagerServer.forEach(connectionManager => connectionManager.close());
        connectionManagerView.forEach(connectionManager => connectionManager.close());
    });
});