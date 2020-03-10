import React from 'react';
import classes from './AdvancedOptionsNavigation.scss';
import {DisplayActions} from '@jahia/ui-extender';
import {useContentEditorContext} from '~/ContentEditor.context';
import {ListItem} from '@jahia/moonstone';
import PropTypes from 'prop-types';

export const AdvancedOptionsNavigation = ({setActiveOption}) => {
    const {mode, nodeData, siteInfo, formik} = useContentEditorContext();
    return (
        <div className={classes.container}>
            <DisplayActions context={{nodeData, siteInfo, formik, mode, setActiveOption}}
                            target="AdvancedOptionsActions"
                            render={({context}) => {
                                return <ListItem label={context.buttonLabel} onClick={e => context.onClick(context, e)}/>;
                            }}
            />
        </div>
    );
};

AdvancedOptionsNavigation.propTypes = {
    setActiveOption: PropTypes.func.isRequired
};
export default AdvancedOptionsNavigation;
