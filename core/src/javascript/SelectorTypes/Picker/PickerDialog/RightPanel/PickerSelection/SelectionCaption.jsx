import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {Typography} from '@jahia/moonstone';
import {useTranslation} from 'react-i18next';
import styles from './Selection.scss';
import {SelectionButton} from '~/SelectorTypes/Picker/PickerDialog/RightPanel/PickerSelection/SelectionButton';
import {NodeIcon} from '@jahia/jcontent';
import {configPropType} from '~/SelectorTypes/Picker/configs/configPropType';

const DefaultCaptionComponent = ({selection}) => (
    <>
        <div className={clsx('flexRow_nowrap', 'alignCenter', styles.text)} data-sel-role="item-selected">
            <NodeIcon node={selection}/>
            <Typography isNowrap variant="body">{selection.displayName}</Typography>
        </div>
        <Typography className={styles.gray} variant="caption">{selection.path}</Typography>
    </>
);

DefaultCaptionComponent.propTypes = {
    selection: PropTypes.object.isRequired
};

const SelectionCaption = ({selection, expanded, pickerConfig, isMultiple}) => {
    const {t} = useTranslation('content-editor');
    const isExpanded = expanded[0];
    const CaptionComponent = pickerConfig.pickerCaptionComponent || DefaultCaptionComponent;
    return (
        <div className="flexCol flexFluid alignStart" data-cm-role="selection-caption">
            {selection.length === 0 && (
                <Typography className={styles.caption} data-sel-role="no-item-selected">
                    {t('content-editor:label.contentEditor.picker.rightPanel.actionsCaption')}
                </Typography>)}

            {/* Single selection caption */}
            {selection.length > 0 && !isMultiple && (
                <CaptionComponent selection={selection[0]}/>
            )}
            {/* Multiple selection caption */}
            {selection.length > 0 && isMultiple && (
                <SelectionButton
                    data-sel-role={`${selection.length}-item-selected`}
                    className={clsx({[styles.hidden]: isExpanded})}
                    label={t('content-editor:label.contentEditor.selection.itemsSelected', {count: selection.length})}
                    expanded={expanded}
                />)}
        </div>
    );
};

SelectionCaption.propTypes = {
    selection: PropTypes.array.isRequired,
    pickerConfig: configPropType.isRequired,
    expanded: PropTypes.array.isRequired,
    isMultiple: PropTypes.bool
};

export default SelectionCaption;

