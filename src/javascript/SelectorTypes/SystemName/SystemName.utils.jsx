export const limitSystemNameIfNecessary = (currentValue, field) => {
    const maxLength = field.selectorOptions.find(option => option.name === 'maxLength')?.value;
    return maxLength ? currentValue.substring(0, maxLength) : currentValue;
};
