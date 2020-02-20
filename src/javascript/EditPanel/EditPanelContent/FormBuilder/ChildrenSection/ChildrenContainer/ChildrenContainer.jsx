import React from 'react';
import PropTypes from 'prop-types';
import {Grid, withStyles} from '@material-ui/core';
import {Typography} from '@jahia/design-system-kit';
import {useContentEditorContext} from '~/ContentEditor.context';
import {useTranslation} from 'react-i18next';
import {Picker as PickerInput} from '~/DesignSystem/Picker';
import {InsertDriveFile} from '@material-ui/icons';
import {encodeJCRPath} from '~/EditPanel/EditPanel.utils';

let styles = theme => {
    const common = {
        flexGrow: 1,
        transform: 'none!important',
        position: 'relative',
        marginBottom: theme.spacing.unit
    };
    return {
        formControl: {
            ...theme.typography.zeta,
            ...common,
            padding: '8px 0',
            paddingLeft: '8px',
            marginLeft: '20px ',
            borderLeft: '4px solid transparent'
        },
        fieldsetContainer: {},
        fieldSetTitle: {
            width: 'auto',
            textTransform: 'uppercase',
            padding: `${theme.spacing.unit * 2}px 0`
        },
        fieldsetTitleContainer: {
            borderTop: `1px solid ${theme.palette.ui.omega}`,
            display: 'flex',
            flexDirection: 'row',
            margin: `0 ${theme.spacing.unit * 6}px 0 ${theme.spacing.unit * 4}px`
        },
        emptySpace: {
            display: 'block',
            width: 48
        },
        input: {
            flexGrow: 5,
            padding: '8px 0'
        },
        pickerGrid: {
            flexGrow: 1
        },
        emptySpaceGrid: {
            flexGrow: 0
        }
    };
};

const ChildrenContainerCmp = ({classes}) => {
    const context = useContentEditorContext();
    const {t} = useTranslation();
    return (
        <article className={classes.fieldsetContainer}>
            <div className={classes.fieldsetTitleContainer}>
                <Typography component="label" htmlFor={t('content-editor:label.contentEditor.section.listAndOrdering.ordering')} className={classes.fieldSetTitle} color="alpha" variant="zeta">
                    {t('content-editor:label.contentEditor.section.listAndOrdering.ordering')}
                </Typography>
            </div>

            <div className={classes.formControl}>
                <Grid container
                      wrap="nowrap"
                      direction="column"
                      justify="space-between"
                      alignItems="stretch"
                >
                    {context.nodeData.children.nodes.map(child => {
                        return (
                            <Grid key={`${child.name}-grid`} item className={classes.input}>
                                <Grid container
                                      wrap="nowrap"
                                      direction="row"
                                      alignItems="center"
                                >
                                    <Grid item className={classes.pickerGrid}>
                                        <PickerInput
                                                key={child.name}
                                                emptyLabel={t('content-editor:label.contentEditor.edit.fields.imagePicker.addImage')}
                                                emptyIcon={<InsertDriveFile/>}
                                                labelledBy={`${child.name}-label`}
                                                fieldData={{name: child.name, info: child.primaryNodeType.displayName, url: encodeJCRPath(`${child.primaryNodeType.icon}.png`)}}
                                                onClick={() => {}}/>
                                    </Grid>
                                    <Grid item className={classes.emptySpaceGrid}>
                                        <span key={`${child.name}-span`} className={classes.emptySpace}/>
                                    </Grid>
                                </Grid>
                            </Grid>
                        );
                    })}
                </Grid>
            </div>
        </article>
    );
};

ChildrenContainerCmp.propTypes = {
    classes: PropTypes.object.isRequired
};

export const ChildrenContainer = withStyles(styles)(ChildrenContainerCmp);
ChildrenContainer.displayName = 'ChildrenContainer';
