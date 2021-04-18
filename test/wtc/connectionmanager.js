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

    // 创建一个 连接id
    function createId() {
      do {
        const id = generateId();
        // 如果不存在这个id 则直接返回这个id
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

    // 创建一个连接
    this.createConnection = () => {
      const id = createId();
      // 创建一个webRTC连接
      const connection = new Connection(id);

      // 1. 添加关闭连接函数
      function closedListener() {
        deleteConnection(connection);
      }
      // 添加连接与对应连接关闭的映射
      closedListeners.set(connection, closedListener);
      connection.once('closed', closedListener);

      // 2. 添加对应连接id 与连接之间的映射
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
