import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {Typography} from '@jahia/moonstone';
import {useTranslation} from 'react-i18next';
import css from './Selection.scss';
import {SelectionButton} from '~/SelectorTypes/Picker/PickerDialog/RightPanel/PickerSelection/SelectionButton';
import {useFieldContext} from '~/contexts/FieldContext';
import {NodeIcon} from '@jahia/jcontent';

const SelectionCaption = ({selection, expanded}) => {
    const {t} = useTranslation('content-editor');
    const field = useFieldContext();
    const isExpanded = expanded[0];
    return (
        <div className="flexCol flexFluid alignStart" data-cm-role="selection-caption">
            {selection.length === 0 && (
                <Typography className={css.caption} data-sel-role="no-item-selected">
                    {t('content-editor:label.contentEditor.picker.rightPanel.actionsCaption')}
                </Typography>)}

            {/* Single selection caption */}
            {selection.length > 0 && !field.multiple && (
                <>
                    <div className={clsx('flexRow_nowrap', 'alignCenter', css.text)} data-sel-role="item-selected">
                        <NodeIcon node={selection[0]}/>
                        <Typography isNowrap variant="body">{selection[0].displayName}</Typography>
                    </div>
                    <Typography variant="caption">{selection[0].path}</Typography>
                </>)}

            {/* Multiple selection caption */}
            {selection.length > 0 && field.multiple && (
                <SelectionButton
                    data-sel-role={`${selection.length}-item-selected`}
                    className={clsx({[css.hidden]: isExpanded})}
                    label={t('content-editor:label.contentEditor.selection.itemsSelected', {count: selection.length})}
                    expanded={expanded}
                />)}
        </div>
    );
};

SelectionCaption.propTypes = {
    selection: PropTypes.array.isRequired,
    expanded: PropTypes.arrayOf(PropTypes.shape({
        isExpanded: PropTypes.bool.isRequired,
        setExpanded: PropTypes.func.isRequired
    }))
};

export default SelectionCaption;

