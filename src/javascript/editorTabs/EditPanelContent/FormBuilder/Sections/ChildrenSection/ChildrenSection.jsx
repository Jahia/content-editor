import React from 'react';
import PropTypes from 'prop-types';
import {Toggle} from '@jahia/design-system-kit';
import {SectionPropTypes} from '~/ContentEditor.proptypes';
import {ManualOrdering} from './ManualOrdering';
import {useTranslation} from 'react-i18next';
import {AutomaticOrdering} from './AutomaticOrdering';
import {Constants} from '~/ContentEditor.constants';
import {Chip, Collapsible, Language, Typography} from '@jahia/moonstone';
import {FieldSet} from '../../FieldSet';
import {useFormikContext} from 'formik';
import fieldSetStyles from '../../FieldSet/FieldSet.scss';
import styles from './ChildrenSection.scss';
import clsx from 'clsx';

export const ChildrenSection = ({section, isExpanded, onClick}) => {
    const {values, handleChange} = useFormikContext();
    const {t} = useTranslation('content-editor');

    const orderingFieldSet = section.fieldSets.find(fs => fs.name === 'jmix:orderedList');
    const automaticallyOrderField = orderingFieldSet?.fields?.find(f => f.name === 'jmix:orderedList_firstField');
    const manuallyOrderField = orderingFieldSet?.fields?.find(f => f.name === 'jmix:orderedList_ce:manualOrdering');
    const isAutomaticOrder = automaticallyOrderField && values[Constants.ordering.automaticOrdering.mixin];
    const hasChildrenToReorder = values['Children::Order'] && values['Children::Order'].length > 0;
    const childrenFieldSets = section.fieldSets.filter(fieldSet => fieldSet.name !== 'jmix:orderedList');

    if ((!manuallyOrderField || !hasChildrenToReorder) && !automaticallyOrderField && childrenFieldSets.length === 0) {
        return false;
    }

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

                {automaticallyOrderField && (
                    <div className="flexRow_nowrap">
                        <Toggle
                            classes={{
                                root: fieldSetStyles.toggle
                            }}
                            data-sel-role-automatic-ordering={Constants.ordering.automaticOrdering.mixin}
                            id={Constants.ordering.automaticOrdering.mixin}
                            checked={isAutomaticOrder}
                            readOnly={orderingFieldSet.readOnly || automaticallyOrderField.readOnly}
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
                {!isAutomaticOrder && manuallyOrderField && <ManualOrdering/>}
                {isAutomaticOrder && automaticallyOrderField && <AutomaticOrdering orderingFieldSet={orderingFieldSet}/>}
            </article>
            { childrenFieldSets?.map(fs => <FieldSet key={fs.name} fieldset={fs}/>) }
        </Collapsible>
    );
};

ChildrenSection.propTypes = {
    section: SectionPropTypes.isRequired,
    isExpanded: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired
};

