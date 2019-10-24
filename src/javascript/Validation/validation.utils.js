import React from 'react';
import {SaveErrorModal} from './SaveModal/SaveErrorModal';

const setErrorFieldTouched = (errorsFields, setTouched) => {
    const fieldsTouched = Object.keys(errorsFields).reduce((touched, field) => {
        return {
            ...touched,
            [field]: true
        };
    }, {});
    setTouched(fieldsTouched);
};

export const validateForm = ({setTouched, errors}, renderComponent) => {
    // SetEach values touched to display errors if there is so.
    // If no error, form will be reset after submition
    setErrorFieldTouched(errors, setTouched);

    // If form has errors
    const nbOfErrors = Object.keys(errors).length;
    if (nbOfErrors > 0) {
        const handler = renderComponent(
            <SaveErrorModal open
                            nbOfErrors={nbOfErrors}
                            onClose={() => {
                                handler.setProps({open: false});
                            }
            }/>
        );
        return false;
    }

    return true;
};
