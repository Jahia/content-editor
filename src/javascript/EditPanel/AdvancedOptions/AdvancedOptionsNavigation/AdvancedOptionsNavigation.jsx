import React from 'react';
import classes from './AdvancedOptionsNavigation.scss';
import {DisplayActions} from '@jahia/ui-extender';
import {useContentEditorContext} from '~/ContentEditor.context';
import {ListItem} from '@jahia/moonstone';

export const AdvancedOptionsNavigation = () => {
    const {mode, nodeData, siteInfo, formik} = useContentEditorContext();
    return (
        <div className={classes.container}>
            <DisplayActions context={{nodeData, siteInfo, formik, mode}}
                            target="AdvancedOptionsActions"
                            render={({context}) => {
                                // TODO BACKLOG-12653 handle edit actions, add an action for the technical information tab
                                return <ListItem label={context.buttonLabel} onClick={e => context.onClick(context, e)}/>;
                            }}
            />
        </div>
    );
};

export default AdvancedOptionsNavigation;
