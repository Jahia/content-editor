import React from 'react';
import {MainLayout} from '@jahia/layouts';
import {buttonRenderer, DisplayActions} from '@jahia/react-material';
import {Typography} from '@jahia/ds-mui-theme';
import PropTypes from 'prop-types';
import EditPanelContent from './EditPanelContent/EditPanelContent';
import {connect} from 'formik';
import {compose} from 'react-apollo';
import {translate} from 'react-i18next';

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
        const {t, fields, title, path, siteInfo, nodeData, language} = this.props;

        return (
            <MainLayout topBarProps={{
                path: path,
                title: title,
                contextModifiers: <Typography variant="omega" color="invert">{t('content-editor:label.contentEditor.edit.title')}</Typography>,
                actions: <DisplayActions context={{nodeData}}
                                         target="editHeaderActions"
                                         render={({context}) => {
                                             const variant = context.actionKey === 'unpublishAction' ? 'secondary' : 'primary';
                                             const Button = buttonRenderer({variant}, true);
                                             return <Button context={context}/>;
                                         }}
                />
            }}
            >
                <EditPanelContent path={path}
                                  siteInfo={siteInfo}
                                  fields={fields}
                                  language={language}/>
            </MainLayout>
        );
    }
}

EditPanel.defaultProps = {
    title: '',
    path: ''
};

EditPanel.propTypes = {
    title: PropTypes.string,
    path: PropTypes.string,
    t: PropTypes.func.isRequired,
    language: PropTypes.string.isRequired,
    fields: PropTypes.array.isRequired,
    formik: PropTypes.object.isRequired,
    siteInfo: PropTypes.object.isRequired,
    nodeData: PropTypes.shape({
        aggregatedPublicationInfo: PropTypes.shape({
            publicationStatus: PropTypes.string.isRequired
        }).isRequired
    }).isRequired
};

export default compose(
    translate(),
    connect,
)(EditPanel);
