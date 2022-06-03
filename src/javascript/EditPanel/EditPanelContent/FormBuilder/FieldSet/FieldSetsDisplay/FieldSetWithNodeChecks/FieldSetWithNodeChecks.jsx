import React from 'react';
import PropTypes from 'prop-types';
import {FieldSetWithNodeCheckPropTypes} from '~/FormDefinitions/FormData.proptypes';
import {useNodeChecks} from '@jahia/data-helper';
import {useContentEditorContext} from '~/ContentEditor.context';
import {FieldSet} from '~/EditPanel/EditPanelContent/FormBuilder/FieldSet';
import {Loader} from '@jahia/moonstone';

const FieldSetWithNodeChecks = ({fieldset}) => {
    const {path, lang, uilang} = useContentEditorContext();
    const resp = useNodeChecks(
        fieldset.nodeCheck.vars ? fieldset.nodeCheck.vars : {path, language: lang, displayLanguage: uilang},
        fieldset.nodeCheck.options
    );

    if (resp.loading) {
        return <Loader/>;
    }

    const isVisible = fieldset.visibilityFunction(fieldset, resp);

    if (!isVisible) {
        return null;
    }

    let Comp = fieldset.comp ? fieldset.comp : FieldSet;

    return (
        <Comp key={fieldset.name} fieldset={fieldset}/>
    );
};

FieldSetWithNodeChecks.contextTypes = {
    context: PropTypes.shape({
        path: PropTypes.string.isRequired,
        lang: PropTypes.string.isRequired,
        uilang: PropTypes.string.isRequired
    })
};

FieldSetWithNodeChecks.propTypes = {
    fieldset: FieldSetWithNodeCheckPropTypes.isRequired
};

export default FieldSetWithNodeChecks;
