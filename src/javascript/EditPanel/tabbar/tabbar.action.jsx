import React from 'react';
import PropTypes from 'prop-types';
import {useNodeChecks} from '@jahia/data-helper';
import {useContentEditorContext} from '~/ContentEditor.context';

export const TabBar = ({context, render: Render, loading: Loading, ...props}) => {
    const {path} = useContentEditorContext();
    const res = useNodeChecks(
        {path: path},
        {...context}
    );

    if (Loading && res.loading) {
        return <Loading context={context}/>;
    }

    return (
        <>
            {context.isDisplayable(context) && res.checksResult &&
            <Render
                {...props}
                {...(context.displayActionProps || {})}
                context={{
                    ...context,
                    onClick: () => {
                        context.setActiveTab(context.value);
                    }
                }}
            />}
        </>
    );
};

TabBar.propTypes = {
    context: PropTypes.object.isRequired,
    render: PropTypes.func.isRequired,
    loading: PropTypes.func
};

const TabBarAction = {
    component: TabBar
};

export default TabBarAction;

