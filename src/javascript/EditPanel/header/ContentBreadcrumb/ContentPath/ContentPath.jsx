import React from 'react';
import PropTypes from 'prop-types';
import {Breadcrumb, Separator} from '@jahia/moonstone';

import CompositePathEntry from './CompositePathEntry';
import SimplePathEntry from './SimplePathEntry';

const renderItems = (items, onItemClick) => {
    if (items.length > 3) {
        const [first, last, others] = [items[0], items[items.length - 1], items.slice(1, items.length - 1)];
        return [
            <SimplePathEntry key={first.uuid} item={first} onItemClick={onItemClick}/>,
            <CompositePathEntry key={`${first.uuid}-${last.uuid}`} items={others} onItemClick={onItemClick}/>,
            <SimplePathEntry key={last.uuid} item={last} onItemClick={onItemClick}/>
        ];
    }

    return items.map(item => <SimplePathEntry key={item.uuid} item={item} onItemClick={onItemClick}/>);
};

const ContentPath = ({items, onItemClick}) => {
    return (items.length > 0) &&
        <>
            <Breadcrumb>
                {renderItems(items, onItemClick)}
            </Breadcrumb>
            <Separator variant="vertical"/>
        </>;
};

ContentPath.propTypes = {
    items: PropTypes.arrayOf(PropTypes.object).isRequired,
    onItemClick: PropTypes.func
};

ContentPath.defaultProps = {
    onItemClick: () => {}
};

export default ContentPath;
