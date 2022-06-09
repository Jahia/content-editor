import React, {useState} from 'react';
import {LayoutModule} from '@jahia/moonstone';
import AdvancedOptionsNavigation from './AdvancedOptionsNavigation/AdvancedOptionsNavigation';
import styles from './AdvancedOptions.scss';
import {TechnicalInformation} from './TechnicalInformation/TechnicalInformation';
import {DeprecatedOption} from './DeprecatedOption';
import {VanityUrls} from './VanityUrls';

export const AdvancedOptions = () => {
    const [activeOption, setActiveOption] = useState('technicalInformation');

    const SelectedTabComponents = {
        technicalInformation: TechnicalInformation,
        content: DeprecatedOption,
        metadata: DeprecatedOption,
        layout: DeprecatedOption,
        options: DeprecatedOption,
        categories: DeprecatedOption,
        seo: VanityUrls
    };
    const SelectedTabComponent = SelectedTabComponents[activeOption];
    return (
        <>
            <div className={styles.container}>
                <LayoutModule
                    navigation={<AdvancedOptionsNavigation activeOption={activeOption}
                                                           setActiveOption={setActiveOption}/>}
                    content={<SelectedTabComponent tab={activeOption} actionKey={`contentEditorGWTTabAction_${activeOption}`}/>}
                    component="div"
                />
            </div>
        </>
    );
};

export default AdvancedOptions;
