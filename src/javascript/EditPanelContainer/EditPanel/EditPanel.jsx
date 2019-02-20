import React from 'react';
import {FullWidthLayout} from '@jahia/layouts';
import {buttonRenderer, DisplayActions} from '@jahia/react-material';
import * as PropTypes from 'prop-types';
import FormBuilder from './FormBuilder';
import MainLayout from '@jahia/layouts/page/MainLayout';

export const EditPanel = ({t, fields, title}) => (
    <MainLayout topBarProps={{
        title: t('content-editor:label.contentEditor.edit.title'),
        contextModifiers: title,
        actions:
    <>
        <DisplayActions target="editHeaderActions"
                        context={{}}
                        render={buttonRenderer({
                                    ref: c => {
                                        if (c && c.props['data-sel-role'] === 'backButton') {
                                            window.addEventListener('beforeunload', ev => {
                                                ev.preventDefault();
                                                ev.returnValue = '';
                                            });
                                        }
                                    },
                                    variant: 'contained',
                                    color: 'primary',
                                    size: 'small'
                                }, true)}/>
    </>
    }}
    >
        <FullWidthLayout>
            <FormBuilder fields={fields}/>
        </FullWidthLayout>
    </MainLayout>
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
