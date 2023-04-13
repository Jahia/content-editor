import React from 'react';
import PropTypes from 'prop-types';
import {FieldPropTypes} from '~/ContentEditor.proptypes';
import {useQuery} from '@apollo/react-hooks';
import {GetCategories} from './category.gql-queries';
import {useTranslation} from 'react-i18next';
import {adaptToCategoryTree} from './category.adapter';
import {LoaderOverlay} from '~/DesignSystem/LoaderOverlay';
import {Dropdown} from '@jahia/moonstone';

export const Category = ({field, value, id, editorContext, onChange, onBlur}) => {
    const {t} = useTranslation('content-editor');
    const {data, error, loading} = useQuery(GetCategories, {
        variables: {
            path: '/sites/systemsite/categories',
            language: editorContext.lang
        }
    });

    const handleClear = () => {
        if (field.multiple) {
            onChange([]);
        } else {
            onChange(null);
        }
    };

    const handleChange = (_, selectedValue) => {
        if (field.multiple) {
            const prev = value || [];
            onChange(prev.indexOf(selectedValue.value) > -1 ? prev.filter(i => i !== selectedValue.value) : [...prev, selectedValue.value]);
        } else {
            onChange(selectedValue.value);
        }
    };

    if (error) {
        const message = t(
            'content-editor:label.contentEditor.error.queryingContent',
            {details: `/sites/systemsite/categories in ${editorContext.lang}`}
        );
        return <>{message}</>;
    }

    if (loading) {
        return <LoaderOverlay/>;
    }

    const tree = adaptToCategoryTree({
        nodes: data.jcr.result.descendants.nodes,
        parent: data.jcr.result,
        selectedValues: value,
        locale: editorContext.lang
    });

    const singleValue = !field.multiple ? value : undefined;
    const multipleValue = field.multiple ? (value || []) : undefined;

    return (
        <Dropdown
            hasSearch
            id={id}
            className="flexFluid"
            treeData={tree}
            variant="outlined"
            size="medium"
            value={singleValue}
            values={multipleValue}
            isDisabled={field.readOnly}
            onClear={handleClear}
            onChange={handleChange}
            onBlur={onBlur}
        />
    );
};

Category.propTypes = {
    field: FieldPropTypes.isRequired,
    id: PropTypes.string.isRequired,
    value: PropTypes.arrayOf(PropTypes.string),
    editorContext: PropTypes.shape({
        lang: PropTypes.string.isRequired
    }).isRequired,
    onChange: PropTypes.func.isRequired,
    onBlur: PropTypes.func.isRequired
};
