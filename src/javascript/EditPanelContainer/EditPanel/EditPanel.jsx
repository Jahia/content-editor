import React from 'react';
import {MainLayout, TwoColumnsContent} from '@jahia/layouts';
import {buttonRenderer, DisplayActions} from '@jahia/react-material';
import {Typography} from '@jahia/ds-mui-theme';
import * as PropTypes from 'prop-types';
import FormBuilder from './FormBuilder';
import {connect} from 'formik';
import {compose} from 'react-apollo';
import {withStyles} from '@material-ui/core';
import {translate} from 'react-i18next';

let styles = () => ({
    root: {
        minHeight: 0
    },
    left: {
        overflow: 'auto'
    }
});

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
        const {t, fields, title, path, siteInfo, classes, nodeData} = this.props;

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
                <TwoColumnsContent classes={{root: classes.root, left: classes.left, right: classes.right}}
                                   rightCol={<></>}
                >
                    <FormBuilder fields={fields} siteInfo={siteInfo}/>
                </TwoColumnsContent>
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
    fields: PropTypes.array.isRequired,
    formik: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
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
    withStyles(styles)
)(EditPanel);
