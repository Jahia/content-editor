import React from 'react';
import PropTypes from 'prop-types';

export const TabBar = ({context, render: Render, ...props}) => {
    return (
        <>
            {context.isDisplayable(context) &&
                <Render
                    {...props}
                    {...(context.displayActionProps || {})}
                    context={{
                        ...context,
                        onClick: () => {
                                    context.setActiveTab(context.value);
                                }
                    }}/>}
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

