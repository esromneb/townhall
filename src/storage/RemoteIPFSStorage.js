import ipfsAPI from 'ipfs-api';
import {Buffer} from 'buffer';

class RemoteIPFSStorage {
  constructor(connectionOptions) {
    this.connectionOptions = connectionOptions;
    this.connection = ipfsAPI(connectionOptions);
    this.messagesList = [];
  }

  createMessage(message) {
    let messageBuffer = new Buffer(JSON.stringify(message));
    let ipfsPromise = this.connection.add(messageBuffer);

    return ipfsPromise.then(result => {
      this.messagesList.push(message);
      return result[0].hash;
    });
  }

  findMessage(hash) {
    let ipfsPromise = this.connection.cat(hash);

    return ipfsPromise.then(result => {
      return JSON.parse(result.toString());
    });
  }

  pin(hash) {
    return this.connection.pin.add(hash).then(result => {
      return result && result.length > 0;
    })
  }

  messages() {
    return this.messagesList;
  }
}

export default RemoteIPFSStorage;