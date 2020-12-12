/*
 * @Author: your name
 * @Date: 2020-12-11 19:47:10
 * @LastEditTime: 2020-12-11 21:05:21
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \webRTC\connections\connectionmanager.js
 */
'use strict';

const {v4: uuidv4} = require('uuid');

const DefaultConnection = require('./connection');

class ConnectionManager {
  constructor(options = {}) {
    options = {
      Connection: DefaultConnection,
      generateId: uuidv4,
      ...options
    };

    const {
      Connection,
      generateId
    } = options;

    const connections = new Map();
    const closedListeners = new Map();

    function createId() {
      do {
        const id = generateId();
        if (!connections.has(id)) {
          return id;
        }
      // eslint-disable-next-line
      } while (true);
    }

    function deleteConnection(connection) {
      // 1. Remove "closed" listener.
      const closedListener = closedListeners.get(connection);
      closedListeners.delete(connection);
      connection.removeListener('closed', closedListener);

      // 2. Remove the Connection from the Map.
      connections.delete(connection.id);
    }

    this.createConnection = () => {
      const id = createId();
      const connection = new Connection(id);

      // 1. Add the "closed" listener.
      function closedListener() { deleteConnection(connection); }
      closedListeners.set(connection, closedListener);
      connection.once('closed', closedListener);

      // 2. Add the Connection to the Map.
      connections.set(connection.id, connection);
      return connection;
    };

    this.getConnection = id => {
      return connections.get(id) || null;
    };

    this.getConnections = () => {
      return [...connections.values()];
    };
  }

  toJSON() {
    return this.getConnections().map(connection => connection.toJSON());
  }
}

module.exports = ConnectionManager;
