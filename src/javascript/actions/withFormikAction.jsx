import React from 'react';
import {connect} from 'formik';

let Component = connect(props => props.children(props.formik));

let withFormikAction = {
    init: (context, props) => {
        context.formik = props.formik;

        window.FORMIK_IS_DIRTY = context.formik.dirty;
    },

    wrappers: [
        component => <Component>{formik => React.cloneElement(component, {formik})}</Component>
    ]
};

export {withFormikAction};
