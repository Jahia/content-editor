import React, {useState} from 'react';
import {registry} from '@jahia/ui-extender';
import {LayoutModule} from '@jahia/moonstone';
import AdvancedOptionsNavigation from './AdvancedOptionsNavigation/AdvancedOptionsNavigation';
import classes from './AdvancedOptions.scss';
import {registerAdvancedOptionsActions} from './AdvancedOptions.actions';
import {TechnicalInformation} from './TechnicalInformation/TechnicalInformation';
import {useTranslation} from 'react-i18next';
import PropTypes from 'prop-types';

export const AdvancedOptions = ({formik}) => {
    const {t} = useTranslation();
    registerAdvancedOptionsActions(registry, t);

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
                />
            </div>
        </>
    );
};

AdvancedOptions.propTypes = {
    formik: PropTypes.object.isRequired
};
export default AdvancedOptions;
