import {javaDateFormatToJSDF} from './date.util';

describe('date util', () => {
    it('should return null when send null', () => {
        expect(javaDateFormatToJSDF(null)).toBe(null);
    });

    it('should return javscript date format', () => {
        expect(javaDateFormatToJSDF('yyyy-MM-dd HH:mm')).toBe('YYYY-MM-DD HH:mm');
    });
});
