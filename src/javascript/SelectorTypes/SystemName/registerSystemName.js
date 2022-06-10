import {SystemName} from './SystemName';
import {registerSystemNameOnChange} from '~/SelectorTypes/SystemName/SystemName.onChange';

export const registerSystemName = ceRegistry => {
    ceRegistry.add('selectorType', 'SystemName', {cmp: SystemName, supportMultiple: false});
    registerSystemNameOnChange(ceRegistry);
};
