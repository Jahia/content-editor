import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import {FieldPropTypes} from '~/FormDefinitions/FormData.proptypes';
import {DropdownTreeSelect} from '~/DesignSystem/DropdownTreeSelect';
import {useQuery} from '@apollo/react-hooks';
import {GetCategories} from './category.gql-queries';
import {ProgressOverlay} from '@jahia/react-material';
import {useTranslation} from 'react-i18next';
import {adaptToCategoryTree} from './category.adapter';

const Category = ({field, value, id, editorContext, onChange, onInit}) => {
    const {t} = useTranslation();
    const {data, error, loading} = useQuery(GetCategories, {
        variables: {
            path: '/sites/systemsite/categories',
            language: editorContext.lang
        }
    });

    const _getCategory = uuid => data.jcr.result.descendants.nodes.find(category => category.uuid === uuid);

    const generateValuesFromUuid = categories => {
        return categories ? categories.map(uuid => _getCategory(uuid)) : undefined;
    };

    const handleChange = (_, selectedValues) => {
        const newValues = selectedValues.map(v => v.value);
        onChange(newValues, generateValuesFromUuid, generateValuesFromUuid);
    };

    useEffect(() => {
        if (data) {
            onInit(generateValuesFromUuid(value));
        }
    }, [value, data]);

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
            readOnly={field.readOnly}
            onChange={handleChange}
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
    onInit: PropTypes.func.isRequired
};

export default Category;
