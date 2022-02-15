import React, {useState} from 'react';
import {LayoutModule} from '@jahia/moonstone';
import AdvancedOptionsNavigation from './AdvancedOptionsNavigation/AdvancedOptionsNavigation';
import classes from './AdvancedOptions.scss';
import {TechnicalInformation} from './TechnicalInformation/TechnicalInformation';

export const AdvancedOptions = () => {
    const [activeOption, setActiveOption] = useState('technicalInformation');

    const SelectedTabComponents = {
        technicalInformation: TechnicalInformation
    };
    const SelectedTabComponent = SelectedTabComponents[activeOption];
    return (
        <>
            <div className={classes.container}>
                <LayoutModule
                    navigation={<AdvancedOptionsNavigation activeOption={activeOption}
                                                           setActiveOption={setActiveOption}/>}
                    content={<SelectedTabComponent/>}
                    component="div"
                />
            </div>
        </>
    );
};

export default AdvancedOptions;
