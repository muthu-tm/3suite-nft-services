/**
 * general request exception module
 */
import Exception from './Exception.js';

export default class ClientException extends Exception {
  constructor(message) {
    super();
    this.constructor = ClientException;
    this.name = this.constructor.name;
    this.message = (message) || 'The server cannot or will not process the request due to something that is perceived to be a client error !';
  }
}
