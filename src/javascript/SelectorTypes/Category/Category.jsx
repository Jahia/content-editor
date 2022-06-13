import React from 'react';
import PropTypes from 'prop-types';
import {FieldPropTypes} from '~/ContentEditor.proptypes';
import {DropdownTreeSelect} from '~/DesignSystem/DropdownTreeSelect';
import {useQuery} from '@apollo/react-hooks';
import {GetCategories} from './category.gql-queries';
import {useTranslation} from 'react-i18next';
import {adaptToCategoryTree} from './category.adapter';
import {LoaderOverlay} from '~/DesignSystem/LoaderOverlay';

export const Category = ({field, value, id, editorContext, onChange, onBlur}) => {
    const {t} = useTranslation('content-editor');
    const {data, error, loading} = useQuery(GetCategories, {
        variables: {
            path: '/sites/systemsite/categories',
            language: editorContext.lang
        }
    });

    const handleChange = (_, selectedValues) => {
        const newValues = selectedValues.map(v => v.value);
        if (field.multiple) {
            onChange(newValues);
        } else {
            onChange(newValues[0]);
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

    return (
        <DropdownTreeSelect
            clearSearchOnChange
            keepTreeOnSearch
            id={id}
            noMatchesLabel={t('content-editor:label.contentEditor.edit.fields.category.noMatches')}
            aria-labelledby={`${field.name}-label`}
            data={tree}
            mode={field.multiple ? 'multiSelect' : 'radioSelect'}
            readOnly={field.readOnly}
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
