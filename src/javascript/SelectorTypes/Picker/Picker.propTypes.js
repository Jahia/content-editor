import PropTypes from 'prop-types';

export const ExternalPickerConfigPropsTypes = PropTypes.shape({
    requireModuleInstalledOnSite: PropTypes.string,
    pickerConfigs: PropTypes.arrayOf(PropTypes.string),
    selectableTypes: PropTypes.arrayOf(PropTypes.string),
    keyUrlPath: PropTypes.string,
    pickerInput: PropTypes.shape({
        emptyLabel: PropTypes.string,
        emptyIcon: PropTypes.string
    }),
    pickerDialog: PropTypes.shape({
        cmp: PropTypes.elementType.isRequired,
        label: PropTypes.string.isRequired,
        description: PropTypes.string,
        icon: PropTypes.string
    })
});
