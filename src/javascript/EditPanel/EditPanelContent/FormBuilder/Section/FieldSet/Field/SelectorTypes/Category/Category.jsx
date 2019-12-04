import React from 'react';
import * as PropTypes from 'prop-types';
import {FieldPropTypes} from '~/EditPanel/FormDefinitions/FormData.proptypes';
import {FastField} from 'formik';
import {DropdownTreeSelect} from '~/DesignSystem/DropdownTreeSelect';
import {useQuery} from 'react-apollo-hooks';
import {GetCategories} from './category.gql-queries';
import {ProgressOverlay} from '@jahia/react-material';
import {translate} from 'react-i18next';
import {adaptToCategoryTree} from './category.adapter';

const CategoryCmp = ({field, value, id, t}) => {
    const {data, error, loading} = useQuery(GetCategories, {
        variables: {
            path: '/sites/systemsite/categories'
        }
    });

    if (error) {
        const message = t(
            'content-media-manager:label.contentManager.error.queryingContent',
            {details: error.message ? error.message : ''}
        );
        return <>{message}</>;
    }

    if (loading) {
        return <ProgressOverlay/>;
    }

    const tree = adaptToCategoryTree({
        nodes: data.jcr.result.descendants.nodes,
        parent: data.jcr.result,
        selectedValues: value
    });

    return (
        <FastField render={() => {
            const handleChange = (...args) => {
                console.log('Change', args);
            };

            const handleAction = (...args) => {
                console.log('Action', args);
            };

            const handleToggle = (...args) => {
                console.log('Toggle', args);
            };

            return (
                <DropdownTreeSelect
                        id={id}
                        aria-labelledby={`${field.name}-label`}
                        data={tree}
                        readOnly={field.readOnly}
                        onChange={handleChange}
                        onAction={handleAction}
                        onNodeToggle={handleToggle}
                />
);
        }}/>
    );
};

CategoryCmp.propTypes = {
    field: FieldPropTypes.isRequired,
    id: PropTypes.string.isRequired,
    value: PropTypes.bool,
    t: PropTypes.func.isRequired
};

const Category = translate()(CategoryCmp);
export default Category;
