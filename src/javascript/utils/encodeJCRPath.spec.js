import {encodeJCRPath} from '~/utils';

describe('encodeJCRPath', () => {
    it('should encode jcr path', () => {
        [
            {
                input: '/aa/bb#bb/cc',
                result: '/aa/bb%23bb/cc'
            },
            {
                input: '/aa/bb/cc',
                result: '/aa/bb/cc'
            },
            {
                input: '/;,%2F?:@&=+$/-_.!~*\'()/#/ABC abc 123',
                result: '/%3B%2C%252F%3F%3A%40%26%3D%2B%24/-_.!~*\'()/%23/ABC%20abc%20123'
            }
        ].forEach(test => expect(encodeJCRPath(test.input)).toEqual(test.result));
    });
});
