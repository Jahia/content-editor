import React from 'react';
import PropTypes from 'prop-types';
import {useNodeChecks} from '@jahia/data-helper';
import {useContentEditorContext} from '~/ContentEditor.context';

export const TabBar = props => {
    const {setActiveTab, isDisplayable, value, render: Render, loading: Loading} = props;
    const {path} = useContentEditorContext();
    const res = useNodeChecks(
        {path: path},
        {...props}
    );

    if (res.loading) {
        return (Loading && <Loading {...props}/>) || <></>;
    }

    return (
        <>
            {isDisplayable(props) && res.checksResult &&
            <Render
                {...props}
                onClick={() => {
                    setActiveTab(value);
                }}
            />}
        </>
    );
};

TabBar.propTypes = {
    render: PropTypes.func.isRequired,
    activeTab: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    setActiveTab: PropTypes.func.isRequired,
    isDisplayable: PropTypes.func.isRequired,
    loading: PropTypes.func
};

const TabBarAction = {
    component: TabBar
};

export default TabBarAction;

