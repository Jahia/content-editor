import React, {useRef} from 'react';
import {TableRow} from '@jahia/moonstone';
import clsx from 'clsx';
import {ContextualMenu} from '@jahia/ui-extender';
import PropTypes from 'prop-types';
import {useFileDrop, useNodeDrop} from '@jahia/jcontent';
import styles from '~/SelectorTypes/Picker/PickerDialog/RightPanel/ContentLayout/ContentTable/ContentTable.scss';

export const Row = ({
    isStructured,
    row,
    tableConfig,
    field,
    previousModeTableConfig,
    handleOnDoubleClick,
    handleOnClick
}) => {
    const rowProps = row.getRowProps();
    const selectionProps = row.getToggleRowSelectedProps();
    const node = row.original;
    const className = node.isSelectable ? styles.selectableRow : styles.doubleClickableRow;

    const contextualMenu = useRef();

    const ref = useRef(null);
    const {isCanDrop} = useNodeDrop({dropTarget: node, ref});
    const {isCanDrop: isCanDropFile} = useFileDrop({uploadType: node.primaryNodeType.name === 'jnt:folder' && 'upload', uploadPath: node.path, ref});

    row.ref = ref;

    const openContextualMenu = event => {
        contextualMenu.current(event);
    };

    return (
        <TableRow {...rowProps}
                  data-cm-role="table-content-list-row"
                  data-sel-name={node.name}
                  className={clsx({
                      [className]: !selectionProps.checked,
                      'moonstone-drop_row': (isCanDrop || isCanDropFile),
                      [styles.disabled]: isStructured && !node.isSelectable
                  })}
                  isHighlighted={selectionProps.checked && !field.multiple}
                  onClick={e => handleOnClick(e, row)}
                  onContextMenu={event => {
                      if (tableConfig.contextualMenu) {
                          event.stopPropagation();
                          openContextualMenu(event);
                      }
                  }}
                  onDoubleClick={e => handleOnDoubleClick(e, row)}
        >
            {previousModeTableConfig.contextualMenu && <ContextualMenu
                setOpenRef={contextualMenu}
                actionKey={previousModeTableConfig.contextualMenu}
                path={node.path}
            />}
            {row.cells.map(cell => <React.Fragment key={cell.column.id}>{cell.render('Cell')}</React.Fragment>)}
        </TableRow>
    );
};

Row.propTypes = {
    isStructured: PropTypes.bool,
    row: PropTypes.object.isRequired,
    previousModeTableConfig: PropTypes.object,
    field: PropTypes.object,
    tableConfig: PropTypes.object,
    doubleClickNavigation: PropTypes.func,
    handleOnClick: PropTypes.func,
    handleOnDoubleClick: PropTypes.func
};
