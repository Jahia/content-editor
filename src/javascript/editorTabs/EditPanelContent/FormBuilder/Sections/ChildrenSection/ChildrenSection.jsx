import React from 'react';
import PropTypes from 'prop-types';
import {Toggle} from '@jahia/design-system-kit';
import {ChildrenSectionPropTypes} from '~/FormDefinitions/FormData.proptypes';
import {ManualOrdering} from './ManualOrdering';
import {useTranslation} from 'react-i18next';
import {AutomaticOrdering} from './AutomaticOrdering';
import {Constants} from '~/ContentEditor.constants';
import {Chip, Language, Typography} from '@jahia/moonstone';
import {getAutomaticOrderingFieldSet} from './AutomaticOrdering/AutomaticOrdering.utils';
import {useContentEditorSectionContext} from '~/ContentEditorSection/ContentEditorSection.context';
import FieldSetsDisplay from '~/editorTabs/EditPanelContent/FormBuilder/FieldSet/FieldSetsDisplay/FieldSetsDisplay';
import {orderingSectionFieldSetMap} from '../../FormBuilder.fieldSetHelp';
import {useFormikContext} from 'formik';
import fieldSetStyles from '../../FieldSet/FieldSet.scss';
import styles from './ChildrenSection.scss';
import clsx from 'clsx';

export const ChildrenSection = ({section, canManuallyOrder, canAutomaticallyOrder}) => {
    const {values, handleChange} = useFormikContext();
    const {t} = useTranslation('content-editor');
    const {sections} = useContentEditorSectionContext();

    const isAutomaticOrder = canAutomaticallyOrder && values[Constants.ordering.automaticOrdering.mixin];
    const automaticOrderingFieldSet = canAutomaticallyOrder && getAutomaticOrderingFieldSet(sections);

    return (
        <>
            <article>
                <div className={fieldSetStyles.fieldsetTitleContainer}>
                    <div className="flexRow alignCenter">
                        <Typography component="label"
                                    className={fieldSetStyles.fieldSetTitle}
                                    variant="subheading"
                        >
                            {t('content-editor:label.contentEditor.section.listAndOrdering.ordering')}
                        </Typography>
                        <Chip label={t('content-editor:label.contentEditor.edit.sharedLanguages')}
                              className={styles.badge}
                              icon={<Language/>}
                              color="default"
                        />
                    </div>
                </div>

                {(canAutomaticallyOrder && automaticOrderingFieldSet) && (
                    <>
                        <div className="flexRow alignCenter">
                            <Toggle
                                classes={{
                                    switchBase: fieldSetStyles.toggle,
                                    disabledSwitchBase: fieldSetStyles.toggle,
                                    readOnlySwitchBase: fieldSetStyles.toggle,
                                    focusedSwitchBase: fieldSetStyles.toggle
                                }}
                                data-sel-role-automatic-ordering={Constants.ordering.automaticOrdering.mixin}
                                id={Constants.ordering.automaticOrdering.mixin}
                                checked={isAutomaticOrder}
                                readOnly={automaticOrderingFieldSet.readOnly}
                                onChange={handleChange}
                            />
                            <Typography component="label"
                                        htmlFor={Constants.ordering.automaticOrdering.mixin}
                                        className={fieldSetStyles.fieldSetTitle}
                            >
                                {t('content-editor:label.contentEditor.section.listAndOrdering.automatic')}
                            </Typography>
                        </div>
                        <Typography component="label"
                                    variant="caption"
                                    className={clsx(fieldSetStyles.fieldSetDescription, fieldSetStyles.staticFieldSetDescription)}
                        >
                            {t('content-editor:label.contentEditor.section.listAndOrdering.description')}
                        </Typography>
                    </>
                )}
                {!isAutomaticOrder && canManuallyOrder && <ManualOrdering/>}
                {isAutomaticOrder && <AutomaticOrdering/>}
            </article>
            <FieldSetsDisplay fieldSets={section.fieldSets} fieldSetMapFcn={orderingSectionFieldSetMap}/>
        </>
    );
};

ChildrenSection.propTypes = {
    section: ChildrenSectionPropTypes.isRequired,
    canManuallyOrder: PropTypes.bool.isRequired,
    canAutomaticallyOrder: PropTypes.bool.isRequired
};

ChildrenSection.displayName = 'ChildrenSection';
