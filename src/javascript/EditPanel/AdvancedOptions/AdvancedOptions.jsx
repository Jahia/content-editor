import React, {useState} from 'react';
import {registry} from '@jahia/ui-extender';
import {LayoutModule} from '@jahia/moonstone';
import AdvancedOptionsNavigation from './AdvancedOptionsNavigation/AdvancedOptionsNavigation';
import {useContentEditorConfigContext} from '~/ContentEditor.context';
import classes from './AdvancedOptions.scss';
import {registerAdvancedOptionsActions} from './AdvancedOptions.actions';
import {Details} from '~/EditPanel/EditPanelContent/PreviewContainer/Details';
import {useTranslation} from 'react-i18next';

export const AdvancedOptions = () => {
    const {t} = useTranslation();
    const {nodeData, siteInfo, formik} = useContentEditorConfigContext();
    registerAdvancedOptionsActions(registry, t);

    const [activeOption, setActiveOption] = useState('technicalInformation');
    const SelectedTabComponents = {
        technicalInformation: Details
    };
    const SelectedTabComponent = SelectedTabComponents[activeOption];
    return (
        <>
            <div className={classes.container}>
                <LayoutModule
                    navigation={<AdvancedOptionsNavigation nodeData={nodeData}
                                                           siteInfo={siteInfo}
                                                           formik={formik}
                                                           setActiveOption={setActiveOption}/>}
                    content={<SelectedTabComponent/>}
                />
            </div>
        </>
    );
};

export default AdvancedOptions;
