import React from 'react';
import PropTypes from 'prop-types';
import {useNodeChecks} from '@jahia/data-helper';
import {useContentEditorContext} from '~/contexts/ContentEditor';

export const TabBar = ({setActiveTab, isDisplayable, value, render: Render, loading: Loading, ...otherProps}) => {
    const {path} = useContentEditorContext();
    const ceCtx = useContentEditorContext();

    const res = useNodeChecks(
        {path: path},
        {...otherProps}
    );

    if (res.loading) {
        return (Loading && <Loading {...otherProps}/>) || <></>;
    }

    return (
        <>
            {isDisplayable({...otherProps, ...ceCtx}) && res.checksResult &&
            <Render
                {...otherProps}
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

export const tabBarAction = {
    component: TabBar
};
