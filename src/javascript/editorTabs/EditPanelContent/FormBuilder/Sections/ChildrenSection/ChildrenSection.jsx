import React from 'react';
import PropTypes from 'prop-types';
import {Toggle} from '@jahia/design-system-kit';
import {SectionPropTypes} from '~/ContentEditor.proptypes';
import {ManualOrdering} from './ManualOrdering';
import {useTranslation} from 'react-i18next';
import {AutomaticOrdering} from './AutomaticOrdering';
import {Constants} from '~/ContentEditor.constants';
import {Chip, Collapsible, Language, Typography} from '@jahia/moonstone';
import {getAutomaticOrderingFieldSet} from './AutomaticOrdering/AutomaticOrdering.utils';
import {useContentEditorSectionContext} from '~/contexts';
import {FieldSetsDisplay} from '../../FieldSet';
import {useFormikContext} from 'formik';
import fieldSetStyles from '../../FieldSet/FieldSet.scss';
import styles from './ChildrenSection.scss';
import clsx from 'clsx';
import {ListSizeLimitFieldSet} from './ListSizeLimitFieldSet';

const orderingSectionFieldSetMap = fieldSet => {
    if (fieldSet.name === 'jmix:listSizeLimit') {
        fieldSet.comp = ListSizeLimitFieldSet;
        fieldSet.description = 'content-editor:label.contentEditor.section.listSizeLimit.description';
        fieldSet.nodeCheck = {
            options: {
                requiredPermission: [Constants.permissions.setContentLimitsOnAreas]
            }
        };
        fieldSet.visibilityFunction = (fs, resp) => resp.node && resp.node[Constants.permissions.setContentLimitsOnAreas];
        return fieldSet;
    }
};

export const ChildrenSection = ({mode, section, nodeData, isExpanded, onClick}) => {
    const {values, handleChange} = useFormikContext();
    const {t} = useTranslation('content-editor');
    const {sections} = useContentEditorSectionContext();

    console.log(section.name);
    console.log(section.displayName);

    const canAutomaticallyOrder = values && values[Constants.ordering.automaticOrdering.mixin] !== undefined;
    const canManuallyOrder = nodeData.primaryNodeType.hasOrderableChildNodes;
    const isAutomaticOrder = canAutomaticallyOrder && values[Constants.ordering.automaticOrdering.mixin];
    const automaticOrderingFieldSet = canAutomaticallyOrder && getAutomaticOrderingFieldSet(sections);

    if (mode === Constants.routes.baseEditRoute && !nodeData.isSite) {
        const sec = {
            isOrderingSection: true,
            displayName: t('content-editor:label.contentEditor.section.listAndOrdering.title'),
            fieldSets: section.fieldSets.filter(f => f.name !== 'jmix:orderedList')
        };

        return (
            <Collapsible data-sel-content-editor-fields-group={sec.displayName}
                         label={sec.displayName}
                         isExpanded={isExpanded}
                         onClick={onClick}
            >
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
                <FieldSetsDisplay fieldSets={section.fieldSets.filter(fieldSet => fieldSet.name === 'jmix:listSizeLimit').map(orderingSectionFieldSetMap)}/>
            </Collapsible>
        );
    }

    return false;
};

ChildrenSection.propTypes = {
    mode: PropTypes.string.isRequired,
    nodeData: PropTypes.object.isRequired,
    section: SectionPropTypes.isRequired,
    isExpanded: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired
};

