import React from 'react';
import {getIcon} from '@jahia/icons';
import {Layers} from '@jahia/moonstone';

function getNodeTypeIcon(typeName) {
    const Icon = getIcon(typeName) || Layers;
    return <Icon/>;
}

export {getNodeTypeIcon};
