import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import SelectionTable from './SelectionTable';
import styles from './Selection.scss';
import {useTranslation} from 'react-i18next';
import {SelectionButton} from './SelectionButton';
import clsx from 'clsx';
import {configPropType} from '../../../configs/configPropType';

const SelectionTableContainer = ({selection, expanded, pickerConfig}) => {
    const [isExpanded, setExpanded] = expanded;
    const {t} = useTranslation('content-editor');

    useEffect(() => {
        if (!selection.length && isExpanded) {
            setExpanded(false); // Close when there are no selection
        }
    }, [selection, isExpanded, setExpanded]);

    const classProps = clsx(
        styles.tableContainer,
        [isExpanded ? `${styles.expanded} moonstone-collapsible_content_expanded` : 'moonstone-collapsible_content_collapsed']
    );

    return (
        <div className={classProps} aria-expanded={isExpanded} data-cm-role="selection-table-container">
            <SelectionButton
                data-sel-role={`${selection.length}-item-selected`}
                label={t('content-editor:label.contentEditor.selection.itemsSelected', {count: selection.length})}
                expanded={expanded}
            />
            <div className={clsx(styles.selectionTable, {[styles.hidden]: !isExpanded})}>
                {selection?.length && <SelectionTable selection={selection} pickerConfig={pickerConfig}/>}
            </div>
        </div>
    );
};

SelectionTableContainer.propTypes = {
    selection: PropTypes.array.isRequired,
    expanded: PropTypes.array.isRequired,
    pickerConfig: configPropType.isRequired
};

export default SelectionTableContainer;
