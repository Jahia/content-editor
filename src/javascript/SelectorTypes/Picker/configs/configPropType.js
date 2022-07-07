import PropTypes from 'prop-types';

export const configPropType = PropTypes.shape({
    pickerInput: {
        emptyLabel: PropTypes.string.isRequired,
        notFoundLabel: PropTypes.string.isRequired,
        emptyIcon: PropTypes.node.isRequired,
        usePickerInputData: PropTypes.func
    },
    pickerDialog: PropTypes.shape({
        view: PropTypes.string.isRequired,
        dialogTitle: PropTypes.string.isRequired,
        searchPlaceholder: PropTypes.string.isRequired,
        itemSelectionAdapter: PropTypes.func,
        displayTree: PropTypes.bool
    }).isRequired,
    listTypesTable: PropTypes.arrayOf(PropTypes.string),
    selectableTypesTable: PropTypes.arrayOf(PropTypes.string),
    showOnlyNodesWithTemplates: PropTypes.bool,
    searchSelectorType: PropTypes.string
});
