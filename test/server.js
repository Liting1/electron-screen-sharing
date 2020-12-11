const bodyParser = require('body-parser');
const express = require('express');
const { EventEmitter } = require('events');
const broadcaster = new EventEmitter();

const WebRtcConnectionManager = require('./connections/webrtcconnectionmanager');

const app = express();

app.use(bodyParser.json());


const options = require(serverPath);

const connectionManagerServer = WebRtcConnectionManager.create({beforeOffer:beforeOfferServer});
const connectionManagerView = WebRtcConnectionManager.create({beforeOffer:beforeOfferView});


app.post(`/connections/:env`, async (req, res) => { // view, inite
	const { env } = req.params;
    try {
    	const connection = null;
    	if(env === 'view'){
      		connection = await connectionManagerView.createConnection();
    	} else if(env === 'inite'){
      		connection = await connectionManagerServer.createConnection();
    	}
    	res.send(connection);
    } catch (error) {
    	console.error(error);
    	res.sendStatus(500);
    }
});

app.delete(`/connections/:env/:id`, (req, res) => { // view, inite
    const { id, env } = req.params;
    const connection = null;
	if(env === 'view'){
  		connection = await connectionManagerView.getConnection(id);
	} else if(env === 'inite'){
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
    const connection = null;
	if(env === 'view'){
  		connection = await connectionManagerView.getConnection(id);
	} else if(env === 'inite'){
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
    return close();
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
		return close();
	}
}


const server = app.listen(6000, () => {
    const address = server.address();
    console.log(`http://localhost:${address.port}\n`);

    server.once('close', () => {
        connectionManagers.forEach(connectionManager => connectionManager.close());
    });
});