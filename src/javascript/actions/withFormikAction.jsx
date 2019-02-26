import React from 'react';
import {connect} from 'formik';

let Component = connect(props => props.children(props.formik));

let withFormikAction = {
    init: (context, props) => {
        context.formik = props.formik;
    },

    wrappers: [
        component => <Component>{formik => React.cloneElement(component, {formik})}</Component>
    ]
};

export {withFormikAction};
