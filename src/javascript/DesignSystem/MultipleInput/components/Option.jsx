import React from 'react';
import {components} from 'react-select';

export const Option = React.forwardRef((props, ref) => {
    return (
        <components.Option {...props} buttonRef={ref}/>
    );
});

Option.displayName = 'Option';
