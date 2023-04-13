import {useTranslation} from 'react-i18next';
import {MultipleInput} from '~/DesignSystem/MultipleInput';
import React from 'react';
import PropTypes from 'prop-types';
import {adaptSelection} from './Tag.utils';
import {FieldPropTypes} from '~/ContentEditor.proptypes';
import {useApolloClient} from '@apollo/react-hooks';
import {getSuggestionsTagsQuery} from './Tag.gql-queries';
import {useContentEditorContext} from '~/contexts/ContentEditor';

export const Tag = ({field, value, id, onChange, onBlur}) => {
    const {t} = useTranslation('content-editor');
    const client = useApolloClient();
    const {site} = useContentEditorContext();

    const selectorOption = field.selectorOptions && field.selectorOptions.find(option => option.name === 'separator');
    const separator = selectorOption ? selectorOption.value : ',';

    const adaptOptions = options => (
        options.map(data => ({
            value: data,
            label: data
        }))
    );

    const suggestTags = async inputValue => {
        let variables = {
            prefix: inputValue,
            limit: '100',
            startPath: '/sites/' + site
        };

        const val = await client.query({query: getSuggestionsTagsQuery, variables: variables, fetchPolicy: 'network-only'});

        if (val.data && val.data.tag && val.data.tag.suggest) {
            return val.data.tag.suggest.map(element => {
                return {value: element.name, label: element.name};
            });
        }

        return [];
    };

    return (
        <MultipleInput
            creatable
            async
            name={id}
            id={id}
            options={field.data && field.data.values && adaptOptions(field.data.values)}
            value={value && adaptOptions(value)}
            readOnly={field.readOnly}
            placeholder={t('content-editor:label.contentEditor.edit.tagPlaceholder')}
            formatCreateLabel={value => t('content-editor:label.contentEditor.edit.createTagPlaceholder', {tagName: value})}
            loadOptions={suggestTags}
            onChange={selection => {
                const newSelection = selection && selection.map(data => data.value);
                const adaptedSelection = adaptSelection(newSelection, separator);
                onChange(adaptedSelection);
            }}
            onBlur={onBlur}
        />
    );
};

Tag.propTypes = {
    id: PropTypes.string.isRequired,
    value: PropTypes.arrayOf(PropTypes.string),
    field: FieldPropTypes.isRequired,
    onChange: PropTypes.func.isRequired,
    onBlur: PropTypes.func.isRequired
};
