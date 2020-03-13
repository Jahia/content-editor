import React from 'react';
import classes from './AdvancedOptionsNavigation.scss';
import {DisplayActions} from '@jahia/ui-extender';
import {useContentEditorContext} from '~/ContentEditor.context';
import {MenuItem} from '@jahia/moonstone';
import PropTypes from 'prop-types';

export const AdvancedOptionsNavigation = ({formik, activeOption, setActiveOption}) => {
    const {mode, nodeData, siteInfo} = useContentEditorContext();
    return (
        <div className={classes.container}>
            <ul>
                <DisplayActions context={{nodeData, siteInfo, mode, formik, activeOption, setActiveOption}}
                                target="AdvancedOptionsActions"
                                render={({context}) => {
                                    return (
                                        <MenuItem
                                            isUpperCase
                                            isSelected={activeOption === context.value}
                                            label={context.buttonLabel}
                                            onClick={e => context.onClick(context, e)}
                                        />
);
                                }}
                />
            </ul>
        </div>
    );
};

AdvancedOptionsNavigation.propTypes = {
    formik: PropTypes.object.isRequired,
    activeOption: PropTypes.string.isRequired,
    setActiveOption: PropTypes.func.isRequired
};
export default AdvancedOptionsNavigation;
