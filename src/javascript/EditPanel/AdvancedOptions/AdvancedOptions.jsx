import React from 'react';
import {LayoutModule} from '@jahia/moonstone';
import AdvancedOptionsNavigation from './AdvancedOptionsNavigation/AdvancedOptionsNavigation';
import {useContentEditorConfigContext} from '~/ContentEditor.context';
import classes from './AdvancedOptions.scss';

export const AdvancedOptions = () => {
    const {nodeData, siteInfo, formik} = useContentEditorConfigContext();

    return (
        <>
            <div className={classes.container}>
                <LayoutModule
                    navigation={<AdvancedOptionsNavigation nodeData={nodeData}
                                                           siteInfo={siteInfo}
                                                           formik={formik}/>}
                    // TODO BACKLOG-12653 handle action to change view
                    content={<>temp</>}
                />
            </div>
        </>
    );
};

export default AdvancedOptions;
