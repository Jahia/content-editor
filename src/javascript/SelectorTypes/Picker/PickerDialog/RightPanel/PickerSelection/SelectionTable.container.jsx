import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import SelectionTable from './SelectionTable';
import styles from './Selection.scss';
import {useTranslation} from 'react-i18next';
import {SelectionButton} from './SelectionButton';
import clsx from 'clsx';

const SelectionTableContainer = ({selection, expanded}) => {
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
        <div className={classProps}>
            <SelectionButton
                label={t('content-editor:label.contentEditor.selection.itemsSelected', {count: selection.length})}
                expanded={expanded}
            />
            <div className={clsx(styles.selectionTable, {[styles.hidden]: !isExpanded})}>
                {selection?.length && <SelectionTable selection={selection}/>}
            </div>
        </div>
    );
};

SelectionTableContainer.propTypes = {
    selection: PropTypes.object.isRequired,
    expanded: PropTypes.arrayOf(PropTypes.shape({
        isExpanded: PropTypes.bool.isRequired,
        setExpanded: PropTypes.func.isRequired
    }))
};

export default SelectionTableContainer;
