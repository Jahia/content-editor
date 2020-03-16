import React, {useState} from 'react';
import {LayoutModule} from '@jahia/moonstone';
import AdvancedOptionsNavigation from './AdvancedOptionsNavigation/AdvancedOptionsNavigation';
import classes from './AdvancedOptions.scss';
import {TechnicalInformation} from './TechnicalInformation/TechnicalInformation';
import PropTypes from 'prop-types';

export const AdvancedOptions = ({formik}) => {
    const [activeOption, setActiveOption] = useState('technicalInformation');

    const SelectedTabComponents = {
        technicalInformation: TechnicalInformation
    };
    const SelectedTabComponent = SelectedTabComponents[activeOption];
    return (
        <>
            <div className={classes.container}>
                <LayoutModule
                    navigation={<AdvancedOptionsNavigation formik={formik}
                                                           activeOption={activeOption}
                                                           setActiveOption={setActiveOption}/>}
                    content={<SelectedTabComponent/>}
                    component="div"
                />
            </div>
        </>
    );
};

AdvancedOptions.propTypes = {
    formik: PropTypes.object.isRequired
};
export default AdvancedOptions;
