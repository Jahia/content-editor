import React, {useState} from 'react';
import {useContentEditorSectionContext} from '~/ContentEditorSection/ContentEditorSection.context';
import {FieldContainer} from '~/EditPanel/EditPanelContent/FormBuilder/Section/FieldSet/Field';
import PropTypes from 'prop-types';
import {compose} from '~/utils';
import {connect} from 'formik';
import {Button} from '@jahia/moonstone';
import {useTranslation} from 'react-i18next';
import {adaptSectionToDisplayableRows} from './AutomaticOrdering.utils';
import {getDisplayedRows} from './AutomaticOrdering.utils';

export const AutomaticOrderingCmp = ({formik: {values}}) => {
    const {t} = useTranslation();
    const {sections} = useContentEditorSectionContext();
    const rows = adaptSectionToDisplayableRows(sections);
    const [displayedRows, setDisplayedRows] = useState(getDisplayedRows(rows, values));

    const add = () => {
        for (let i = 0; i < rows.length; i++) {
            if (!displayedRows.includes(i)) {
                setDisplayedRows([...displayedRows, i]);
                return;
            }
        }
    };

    return (
        <>
            {rows.filter((row, index) => displayedRows.includes(index)).map(row => {
                return (
                    <div key={row.propField.name}>
                        <FieldContainer field={row.propField}/>
                        <FieldContainer field={row.directionField}/>
                    </div>
                );
            })}

            <Button
                data-sel-role="add-automatic-ordering-field"
                color="accent"
                size="big"
                variant="outlined"
                label={t('content-editor:label.contentEditor.edit.fields.actions.add')}
                disabled={displayedRows.length === rows.length}
                onClick={add}
            />
        </>
    );
};

AutomaticOrderingCmp.propTypes = {
    formik: PropTypes.object.isRequired
};

export const AutomaticOrdering = compose(
    connect
)(AutomaticOrderingCmp);
AutomaticOrdering.displayName = 'AutomaticOrdering';
