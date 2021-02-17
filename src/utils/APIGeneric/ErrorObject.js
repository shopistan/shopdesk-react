import { get } from 'lodash-es';

export default class ErrorObject {
  constructor(error) {
    return {
      fail: true,
      error,
      message: get(error, 'details') || get(error, 'response.statusText') || get(error, 'message'),
      statusCode: get(error, 'response.status'),
    };
  }
}
