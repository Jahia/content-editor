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

export const ChildrenSection = ({mode, section, nodeData, isExpanded, onClick}) => {
    const {values, handleChange} = useFormikContext();
    const {t} = useTranslation('content-editor');
    const {sections} = useContentEditorSectionContext();

    const orderingSectionFieldSetMap = fieldSet => {
        if (fieldSet.name === 'jmix:listSizeLimit') {
            fieldSet.description = t('content-editor:label.contentEditor.section.listSizeLimit.description');
            fieldSet.nodeCheck = {
                options: {
                    requiredPermission: [Constants.permissions.setContentLimitsOnAreas]
                }
            };
            fieldSet.visibilityFunction = (fs, resp) => resp.node && resp.node[Constants.permissions.setContentLimitsOnAreas];
            return fieldSet;
        }
    };

    const canAutomaticallyOrder = values && values[Constants.ordering.automaticOrdering.mixin] !== undefined;
    const canManuallyOrder = nodeData.primaryNodeType.hasOrderableChildNodes;
    const isAutomaticOrder = canAutomaticallyOrder && values[Constants.ordering.automaticOrdering.mixin];
    const automaticOrderingFieldSet = canAutomaticallyOrder && getAutomaticOrderingFieldSet(sections);
    const hasChildrenToReorder = values['Children::Order'].length > 0;
    const childrenFieldSets = section.fieldSets.filter(fieldSet => fieldSet.name === 'jmix:listSizeLimit').map(orderingSectionFieldSetMap);

    if ((!canManuallyOrder || !hasChildrenToReorder) && !canAutomaticallyOrder && childrenFieldSets.length === 0) {
        return false;
    }

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
                <article className={fieldSetStyles.fieldSetOpen}>
                    <div className={fieldSetStyles.fieldSetTitleContainer}>
                        <div className="flexRow_nowrap">
                            <Typography component="label"
                                        className={fieldSetStyles.fieldSetTitle}
                                        variant="subheading"
                                        weight="bold"
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
                        <div className="flexRow_nowrap">
                            <Toggle
                                classes={{
                                    root: fieldSetStyles.toggle
                                }}
                                data-sel-role-automatic-ordering={Constants.ordering.automaticOrdering.mixin}
                                id={Constants.ordering.automaticOrdering.mixin}
                                checked={isAutomaticOrder}
                                readOnly={automaticOrderingFieldSet.readOnly}
                                onChange={handleChange}
                            />
                            <div className="flexCol">
                                <Typography component="label"
                                            htmlFor={Constants.ordering.automaticOrdering.mixin}
                                            className={fieldSetStyles.fieldSetTitle}
                                            variant="subheading"
                                            weight="bold"
                                >
                                    {t('content-editor:label.contentEditor.section.listAndOrdering.automatic')}
                                </Typography>
                                <Typography component="label"
                                            variant="caption"
                                            className={clsx(fieldSetStyles.fieldSetDescription, fieldSetStyles.staticFieldSetDescription)}
                                >
                                    {t('content-editor:label.contentEditor.section.listAndOrdering.description')}
                                </Typography>
                            </div>
                        </div>
                    )}
                    {!isAutomaticOrder && canManuallyOrder && <ManualOrdering/>}
                    {isAutomaticOrder && canAutomaticallyOrder && <AutomaticOrdering/>}
                </article>
                <FieldSetsDisplay fieldSets={childrenFieldSets}/>
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

