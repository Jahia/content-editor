import React from 'react';
import * as PropTypes from 'prop-types';
import {FieldPropTypes} from '~/EditPanel/FormDefinitions/FormData.proptypes';
import {FastField} from 'formik';
import {DropdownTreeSelect} from '~/DesignSystem/DropdownTreeSelect';

const data = [
    {
        label: 'VP Accounting',
        checked: true,
        children: [
            {
                label: 'iWay',
                children: [
                    {label: 'Universidad de Especialidades del Espíritu Santo'},
                    {label: 'Marmara University'},
                    {label: 'Baghdad College of Pharmacy'}
                ]
            },
            {
                label: 'KDB',
                children: [
                    {label: 'Latvian University of Agriculture'},
                    {label: 'Dublin Institute of Technology'}
                ]
            },
            {
                label: 'Justice',
                children: [
                    {label: 'Baylor University'},
                    {label: 'Massachusetts College of Art'},
                    {label: 'Universidad Técnica Latinoamericana'},
                    {label: 'Saint Louis College'},
                    {label: 'Scott Christian University'}
                ]
            },
            {
                label: 'Utilization Review',
                children: [
                    {label: 'University of Minnesota - Twin Cities Campus'},
                    {label: 'Moldova State Agricultural University'},
                    {label: 'Andrews University'},
                    {label: 'Usmanu Danfodiyo University Sokoto'}
                ]
            },
            {
                label: 'Norton Utilities',
                children: [
                    {label: 'Universidad Autónoma del Caribe'},
                    {label: 'National University of Uzbekistan'},
                    {label: 'Ladoke Akintola University of Technology'},
                    {label: 'Kohat University of Science and Technology  (KUST)'},
                    {label: 'Hvanneyri Agricultural University'}
                ]
            }
        ]
    }
];

// eslint-disable-next-line
const Category = ({field, value, id}) => {
    return (
        <FastField render={() => {
            const handleChange = (...args) => {
                console.log('Change', args);
            };

            const handleAction = (...args) => {
                console.log('Action', args);
            };

            const handleToggle = (...args) => {
                console.log('Toggle', args);
            };

            return (
                <DropdownTreeSelect
                        id={id}
                        aria-labelledby={`${field.name}-label`}
                        data={data}
                        readOnly={field.readOnly}
                        onChange={handleChange}
                        onAction={handleAction}
                        onNodeToggle={handleToggle}
                />
);
        }}/>
    );
};

Category.propTypes = {
    field: FieldPropTypes.isRequired,
    id: PropTypes.string.isRequired,
    value: PropTypes.bool
};

export default Category;
