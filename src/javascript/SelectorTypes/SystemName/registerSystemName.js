import {SystemName} from './SystemName';
import {registerSystemNameOnChange} from './SystemName.onChange';

export const registerSystemName = ceRegistry => {
    ceRegistry.add('selectorType', 'SystemName', {dataType: ['String'], cmp: SystemName, supportMultiple: false});
    registerSystemNameOnChange(ceRegistry);
};
