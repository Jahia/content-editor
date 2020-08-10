export const selectAllAction = {
    init: context => {
        if (!context.field.multiple ||
            context.field.readOnly ||
            !context.field.valueConstraints ||
            context.field.valueConstraints.length === 0
        ) {
            context.isVisible = false;
            return;
        }

        const values = context.formik.values[context.field.name] || [];
        const possibleValues = context.field.valueConstraints.map(valueConstraint => valueConstraint.value.string);
        context.enabled = !possibleValues.every(i => values.includes(i));
        context.key = 'selectAllActionChoiceList';
    },
    onClick: context => {
        if (!context.enabled) {
            return;
        }

        const possibleValues = context.field.valueConstraints.map(valueConstraint => valueConstraint.value.string);
        context.formik.setFieldValue(
            context.field.name,
            possibleValues,
            true
        );
        context.formik.setFieldTouched(context.field.name, [true]);
        if (context.onChange) {
            context.onChange(possibleValues);
        }
    }
};
