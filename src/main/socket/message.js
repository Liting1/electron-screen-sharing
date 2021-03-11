const { EventEmitter } = require('events');
const broadcaster = new EventEmitter();
const WebRtcConnectionManager = require('./connections/webrtcconnectionmanager');


class Message {
    constructor() {
        // {
        //     user: 101, // 101 表示分享屏幕 102 表示观看屏幕
        //     msgCode: 101, // 消息类型 101 获取连接ID
        //     data: {},
        //     code: 200,
        //     message: 'success'
        // }
        this.connectionManagerServer = WebRtcConnectionManager.create({
            beforeOffer: this.beforeOfferServer
        });
        this.connectionManagerView = WebRtcConnectionManager.create({
            beforeOffer: this.beforeOfferView
        });

    }
    send(ws, data) {
        ws.send(JSON.stringify(data));

    }
    async getID(ws, user) {
        const data = {
            user,
            msgCode: 101,
            data: null,
            message: 'success',
            code: 200
        }
        try {
            const connection = user === 101
                ? await this.connectionManagerServer.createConnection()
                : await this.connectionManagerView.createConnection();
          this.send(ws, {
                ...data,
                data: connection
            });
        } catch (e) {
            this.send(ws, {
                ...data,
                message: e,
                code: 500
            });
        }
    }
    async remoteDescription(ws, user, { id, ...desc }) {
        const data = {
            user,
            msgCode: 102,
            data: null,
            message: 'connection is undefined',
            code: 404
        };
        const connection = user === 101
            ? await this.connectionManagerServer.getConnection(id)
            : await this.connectionManagerView.getConnection(id);

        if (!connection) return this.send(ws, data);

        try {
            await connection.applyAnswer(desc);
            this.send(ws, {
                ...data,
                data: connection.toJSON().remoteDescription,
                message: 'success',
                code: 200
            });
        } catch (error) {
            this.send(ws, {
                ...data,
                code: 400,
                message: error
            });
        }
    }
    // 删除ID
    async deleteID(ws, user, { id }) {
        const data = {
            user,
            msgCode: 103,
            data: null,
            message: 'connection is undefined',
            code: 404
        };
        const connection = user === 101
            ? await this.connectionManagerServer.getConnection(id)
            : await this.connectionManagerView.getConnection(id)

        if (!connection) return this.send(ws, data);

        connection.close();
        this.send(ws, {
            ...data,
            data: connection,
            message: 'success',
            code: 200
        });
    }
    beforeOfferServer(peerConnection) {
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
    beforeOfferView(peerConnection) {
        const audioTransceiver = peerConnection.addTransceiver('audio');
        const videoTransceiver = peerConnection.addTransceiver('video');

        function onNewBroadcast({ audioTrack, videoTrack }) {
            audioTransceiver.sender.replaceTrack(audioTrack);
            videoTransceiver.sender.replaceTrack(videoTrack);
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

}
module.exports = Message;
