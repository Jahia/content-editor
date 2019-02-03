import React from 'react';
import {FullWidthLayout} from '@jahia/layouts';
import {buttonRenderer, DisplayActions} from '@jahia/react-material';
import * as PropTypes from 'prop-types';
import FormBuilder from './FormBuilder';

export const EditPanel = ({t, fields, title}) => (
    <FullWidthLayout topBarProps={{
            title: t('content-editor:label.contentEditor.edit.title'),
            contextModifiers: title,
            actions:
    <>
        <DisplayActions target="editHeaderActions"
                        context={{}}
                        render={buttonRenderer({
                                        variant: 'contained',
                                        color: 'primary',
                                        size: 'small'
                                    }, true)}/>
    </>
        }}
    >
        <FormBuilder fields={fields}/>
    </FullWidthLayout>
);
export default EditPanel;

EditPanel.defaultProps = {
    title: ''
};

EditPanel.propTypes = {
    title: PropTypes.string,
    t: PropTypes.func.isRequired,
    fields: PropTypes.array.isRequired
};
