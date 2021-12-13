import React from 'react';
import PropTypes from 'prop-types';
import {FieldPropTypes} from '~/FormDefinitions/FormData.proptypes';
import {Dropdown} from '@jahia/moonstone';
import {useTranslation} from 'react-i18next';
import {DisplayAction} from '@jahia/ui-extender';
import {getButtonRenderer} from '../../../utils/getButtonRenderer';
import {connect} from 'formik';

const ButtonRenderer = getButtonRenderer({labelStyle: 'none', defaultButtonProps: {variant: 'ghost'}});

export const SingleSelectCmp = ({field, value, formik, id, inputContext, onChange}) => {
    const {t} = useTranslation('content-editor');
    inputContext.actionContext = {
        onChange
    };

    const readOnly = field.readOnly || field.valueConstraints.length === 0;
    const label = field.valueConstraints.find(item => item.value.string === value)?.displayValue || '';
    const dropdownData = field.valueConstraints.length > 0 ?
        field.valueConstraints.map(item => {
            const image = item.properties?.find(property => property.name === 'image')?.value;
            return {
                label: item.displayValue,
                value: item.value.string,
                image: image && <img src={image} alt={item.displayValue}/>,
                attributes: {
                    'data-value': item.value.string
                }
            };
        }) : [{label: '', value: ''}];

    // Reset value if constraints doesnt contains the actual value.
    if (value && field.valueConstraints.find(v => v.value.string === value) === undefined) {
        onChange(null);
    }

    return (
        <div className="flexFluid flexRow alignCenter">
            <Dropdown
                className="flexFluid"
                name={field.name}
                id={'select-' + id}
                imageSize="small"
                data-sel-content-editor-select-readonly={readOnly}
                isDisabled={readOnly}
                maxWidth="100%"
                variant="outlined"
                size="medium"
                data={dropdownData}
                label={label}
                value={value}
                hasSearch={dropdownData && dropdownData.length >= 5}
                searchEmptyText={t('label.contentEditor.global.noResult')}
                onChange={(evt, item) => {
                    if (item.value !== value) {
                        onChange(item.value);
                    }
                }}
            />
            {inputContext.displayActions && (
                <DisplayAction actionKey="content-editor/field/Choicelist"
                               formik={formik}
                               field={field}
                               inputContext={inputContext}
                               render={ButtonRenderer}
                />
            )}
        </div>
    );
};

SingleSelectCmp.defaultProps = {
    value: null
};

SingleSelectCmp.propTypes = {
    id: PropTypes.string.isRequired,
    formik: PropTypes.object.isRequired,
    value: PropTypes.string,
    field: FieldPropTypes.isRequired,
    inputContext: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired
};

export const SingleSelect = connect(SingleSelectCmp);
SingleSelect.displayName = 'SingleSelect';

export default SingleSelect;
