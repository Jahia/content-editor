import React from 'react';
import classes from './AdvancedOptionsNavigation.scss';
import {DisplayActions, registry} from '@jahia/ui-extender';
import {MenuItem} from '@jahia/moonstone';
import PropTypes from 'prop-types';
import {useRegisterEngineTabActions} from '~/Edit/engineTabs/useRegisterEngineTabActions';
import {registerAdvancedOptionsActions} from '~/EditPanel/AdvancedOptions/AdvancedOptions.actions';
import {useTranslation} from 'react-i18next';
import {LoaderOverlay} from '~/DesignSystem/LoaderOverlay';

const DEPRECATED_GWT_ACTIONS = ['content', 'layout', 'metadata', 'categories', 'options', 'seo'];

const Renderer = ({activeOption, setActiveOption, buttonLabel, onClick, tabs}) => {
    const tab = tabs ? tabs[0] : 'technicalInformation';

    return (
        <MenuItem
            isSelected={activeOption === tab}
            label={buttonLabel}
            onClick={e => {
                if (DEPRECATED_GWT_ACTIONS.includes(tab)) {
                    setActiveOption(tab);
                    return;
                }

                onClick(e);
            }}
        />
    );
};

Renderer.propTypes = {
    activeOption: PropTypes.string,
    buttonLabel: PropTypes.string,
    onClick: PropTypes.func,
    setActiveOption: PropTypes.func,
    tabs: PropTypes.array
};

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
        return <LoaderOverlay/>;
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
                                render={Renderer}
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
