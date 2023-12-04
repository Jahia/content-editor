
export const formatInitialSelectedItem = value => {
    if (!value) {
        return [{}];
    }

    if (typeof value === 'string') {
        return [{path: value}];
    }

    if (Array.isArray(value)) {
        return value.map(item => {
            if (typeof item === 'string') {
                return {path: value};
            }

            return item;
        });
    }
};

export const getInitialOption = ({pickerConfigsEnabled, valuePath}) => {
    const defaultPickerConfig = pickerConfigsEnabled.find(({module}) => module === 'default');
    let ret;
    if (!valuePath) {
        return defaultPickerConfig;
    }

    try {
        const contentURL = new URL(valuePath);
        ret = pickerConfigsEnabled.find(({keyUrlPath}) => contentURL.hostname.includes(keyUrlPath));
    } catch {
        return defaultPickerConfig;
    }

    return ret || defaultPickerConfig;
};
