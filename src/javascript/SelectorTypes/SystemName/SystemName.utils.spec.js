
import {limitSystemNameIfNecessary} from './SystemName.utils';
import {Constants} from '~/ContentEditor.constants';

describe('SystemName utils', () => {
    let field;
    beforeEach(() => {
        field = {
            name: Constants.systemName.name,
            displayName: Constants.systemName.name,
            readOnly: false,
            selectorType: 'SystemName',
            requiredType: 'STRING',
            selectorOptions: [{name: 'maxLength', value: 32}]
        };
    });

    it('should be limited to 32 characters when have selector options', () => {
        const systemNameValue = limitSystemNameIfNecessary('1234567890123456789012345678901234567890', field);
        expect(systemNameValue).toBe('12345678901234567890123456789012');
    });

    it('should not be limited when have no maxlength selector option', () => {
        field.selectorOptions = [];
        const systemNameValue = limitSystemNameIfNecessary('1234567890123456789012345678901234567890', field);

        expect(systemNameValue).toBe('1234567890123456789012345678901234567890');
    });
});
