import expect from 'expect.js';

import StreamFeed from '../../../src/lib/feed';
import stream from '../../../src/getstream';
import { init, beforeEachFn } from '../utils/hooks';

const { errors } = stream;

describe('[UNIT] Stream Client (browser)', function () {
  init.call(this);
  beforeEach(beforeEachFn);

  it("shouldn't allow secret keys", function () {
    // apiKey, apiSecret, appId, options
    function createFn() {
      stream.connect('abcdefgh', '123456789');
    }

    expect(createFn).to.throwException(function (e) {
      expect(e).to.be.a(errors.FeedError);
    });
  });

  it('should store config on the client', function () {
    const client = stream.connect('abcdefgh', null, 1000, { option: true });

    expect(client.apiSecret).to.be(null);
    expect(client.browser).to.be(true);
  });

  it('should store config on the client', function () {
    const client = stream.connect('abcdefgh', null, 1000, {
      version: 'v2.0',
      fayeUrl: 'https://hello.world',
      expireTokens: true,
      location: 'nederland',
    });

    expect(client.version).to.be('v2.0');
    expect(client.expireTokens).to.be(true);
    expect(client.baseUrl).to.be('https://nederland-api.stream-io-api.com/api/');
    expect(client.fayeUrl).to.be('https://hello.world');
  });

  it('#userAgent', function () {
    const useragent = this.client.userAgent();

    expect(useragent).to.be('stream-javascript-client-browser-unknown');
  });

  it('#feed throw (1)', function () {
    const self = this;

    function toThrow() {
      self.client.feed('user', 'jaap');
    }

    expect(toThrow).to.throwException(function (e) {
      expect(e).to.be.a(errors.FeedError);
    });
  });

  it('#feed', function () {
    const feed = this.client.feed('user', 'jaap', '123456789');

    expect(feed).to.be.a(StreamFeed);
  });
});
