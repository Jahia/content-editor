import React from 'react';
import PropTypes from 'prop-types';
import {Badge, Loader} from '@jahia/moonstone';

export const ContentTableCellBadgeRenderer = ({tableCellData}) => {
    if (tableCellData === undefined) {
        return (
            <div className="flexRow_center alignCenter">
                <Loader size="small"/>
            </div>
        );
    }

    return tableCellData !== 0 && (
        <div className="flexRow_center alignCenter">
            <Badge label={tableCellData} data-cm-role="sub-contents-count"/>
        </div>
    );
};

ContentTableCellBadgeRenderer.defaultProps = {
    tableCellData: undefined
};

ContentTableCellBadgeRenderer.propTypes = {
    tableCellData: PropTypes.number
};

ContentTableCellBadgeRenderer.displayName = 'ContentTableCellBadgeRenderer';
export default ContentTableCellBadgeRenderer;
