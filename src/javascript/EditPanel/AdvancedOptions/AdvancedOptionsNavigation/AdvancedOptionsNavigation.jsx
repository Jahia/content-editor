import React from 'react';
import classes from './AdvancedOptionsNavigation.scss';
import {DisplayActions, registry} from '@jahia/ui-extender';
import {MenuItem} from '@jahia/moonstone';
import PropTypes from 'prop-types';
import {useRegisterEngineTabActions} from '~/Edit/engineTabs/useRegisterEngineTabActions';
import {ProgressOverlay} from '@jahia/react-material';
import {registerAdvancedOptionsActions} from '~/EditPanel/AdvancedOptions/AdvancedOptions.actions';
import {useTranslation} from 'react-i18next';

export const AdvancedOptionsNavigation = ({activeOption, setActiveOption}) => {
    const {t} = useTranslation('content-editor');

    // Engines tabs need the node Data to be registered
    const {tabs, loading, error} = useRegisterEngineTabActions();
    registerAdvancedOptionsActions(registry, t);

    if (error) {
        const message = t(
            'content-editor:label.contentEditor.error.queryingContent',
            {details: error.message ? error.message : ''}
        );
        return <>{message}</>;
    }

    if (loading) {
        return <ProgressOverlay/>;
    }

    return (
        <div className={classes.container}>
            <ul>
                <DisplayActions activeOption={activeOption}
                                setActiveOption={setActiveOption}
                                target="AdvancedOptionsActions"
                                filter={action => {
                                    return action.shouldBeDisplayed(tabs, action.key);
                                }}
                                render={({value, buttonLabel, onClick}) => {
                                    return (
                                        <MenuItem
                                            isUpperCase
                                            isSelected={activeOption === value}
                                            label={buttonLabel}
                                            onClick={e => onClick(e)}
                                        />
                                    );
                                }}
                />
            </ul>
        </div>
    );
};

AdvancedOptionsNavigation.propTypes = {
    activeOption: PropTypes.string.isRequired,
    setActiveOption: PropTypes.func.isRequired
};
export default AdvancedOptionsNavigation;
