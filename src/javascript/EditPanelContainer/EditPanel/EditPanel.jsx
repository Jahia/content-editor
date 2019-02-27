import React from 'react';
import {FullWidthLayout} from '@jahia/layouts';
import {buttonRenderer, DisplayActions} from '@jahia/react-material';
import * as PropTypes from 'prop-types';
import FormBuilder from './FormBuilder';
import MainLayout from '@jahia/layouts/page/MainLayout';
import {connect} from 'formik';

class EditPanel extends React.Component {
    constructor(props) {
        super(props);

        this.handleBeforeUnloadEvent = this.handleBeforeUnloadEvent.bind(this);
    }

    componentDidMount() {
        // Prevent close browser's tab when there is unsaved content
        window.addEventListener('beforeunload', this.handleBeforeUnloadEvent);
    }

    componentWillUnmount() {
        window.removeEventListener('beforeunload', this.handleBeforeUnloadEvent);
    }

    handleBeforeUnloadEvent(ev) {
        if (this.props.formik.dirty) {
            ev.preventDefault();
            ev.returnValue = '';
        }
    }

    render() {
        const {t, fields, title} = this.props;

        return (
            <MainLayout topBarProps={{
                title: t('content-editor:label.contentEditor.edit.title'),
                contextModifiers: title,
                actions: <DisplayActions target="editHeaderActions"
                                         context={{}}
                                         render={buttonRenderer({
                                             variant: 'contained',
                                             color: 'primary',
                                             size: 'small'
                                         }, true)}/>
            }}
            >
                <FullWidthLayout>
                    <FormBuilder fields={fields}/>
                </FullWidthLayout>
            </MainLayout>
        );
    }
}

EditPanel.defaultProps = {
    title: ''
};

EditPanel.propTypes = {
    title: PropTypes.string,
    t: PropTypes.func.isRequired,
    fields: PropTypes.array.isRequired,
    formik: PropTypes.object.isRequired
};

export default connect(EditPanel);
