import {fillCKEditorPicker, getPickerValue} from './RichText.utils';

jest.mock('@jahia/ui-extender', () => {
    return {
        registry: {
            get: jest.fn(() => {
                return {
                    key: 'editorial',
                    treeConfigs: [{thisIsANode: 'treeConfig'}],
                    displayTree: true
                };
            }),
            add: jest.fn()
        }
    };
});

describe('RichText utils', () => {
    describe('getPickerValue', () => {
        let dialog;

        beforeEach(() => {
            dialog = {
                getContentElement: jest.fn()
            };
        });

        it('should an empty currentValue when input is empty', () => {
            const currentValue = getPickerValue(dialog);
            expect(currentValue).toBe('');
        });

        it('should remove the content prefix form the url', () => {
            dialog.getContentElement.mockImplementation(() => {
                return {
                    getValue: () => '/cms/{mode}/{lang}/richTextEdition/toot/al/regal.html'
                };
            });
            const currentValue = getPickerValue(dialog);
            expect(currentValue).toBe('/richTextEdition/toot/al/regal');
        });

        it('should remove the file prefix form the url', () => {
            dialog.getContentElement.mockImplementation(() => {
                return {
                    getValue: () => '/files/{workspace}/richTextEdition/toot/al/regal.html'
                };
            });
            const currentValue = getPickerValue(dialog);
            expect(currentValue).toBe('/richTextEdition/toot/al/regal.html');
        });

        it('should take urlTxt when url is null', () => {
            dialog.getContentElement.mockImplementation((_, id) => {
                if (id !== 'txtUrl') {
                    return;
                }

                return {
                    getValue: () => '/files/{workspace}/richTextEdition/toot/al/regal.html'
                };
            });
            const currentValue = getPickerValue(dialog);
            expect(currentValue).toBe('/richTextEdition/toot/al/regal.html');
        });
    });

    describe('fillCKEditorPicker', () => {
        let dialog;
        let contentPicker;
        let setUrl;

        beforeEach(() => {
            dialog = {
                getName: jest.fn(() => 'image'),
                getContentElement: jest.fn(() => {
                    return {
                        setValue: jest.fn(),
                        getValue: jest.fn()
                    };
                })
            };
            contentPicker = true;
            setUrl = jest.fn();
        });

        it('should fill url with contentPrefix and suffix', () => {
            fillCKEditorPicker(setUrl, dialog, contentPicker, {path: '/yoloo'});
            expect(setUrl).toHaveBeenCalledWith(
                '/cms/{mode}/{lang}/yoloo.html',
                {}
            );
        });

        it('should fill url with filePrefix', () => {
            contentPicker = false;
            fillCKEditorPicker(setUrl, dialog, contentPicker, {path: '/yoloo'});
            expect(setUrl).toHaveBeenCalledWith(
                '/files/{workspace}/yoloo',
                {}
            );
        });

        it('should fill advTitle', () => {
            const setValueOfAdvTitle = jest.fn();
            dialog.getContentElement = jest.fn((_, id) => {
                if (id === 'advTitle') {
                    return {
                        setValue: setValueOfAdvTitle
                    };
                }

                return {
                    setValue: jest.fn(),
                    getValue: jest.fn()
                };
            });

            fillCKEditorPicker(setUrl, dialog, contentPicker, {path: '/yoloo', name: 'success'});
            expect(setValueOfAdvTitle).toHaveBeenCalledWith('success');
        });

        it('should fill txtAlt', () => {
            const setValueOfAdvTitle = jest.fn();
            dialog.getContentElement = jest.fn((_, id) => {
                if (id === 'url') {
                    return;
                }

                if (id === 'txtAlt') {
                    return {
                        setValue: setValueOfAdvTitle
                    };
                }

                return {
                    setValue: jest.fn(),
                    getValue: jest.fn()
                };
            });

            fillCKEditorPicker(setUrl, dialog, contentPicker, {path: '/yoloo', name: 'success'});
            expect(setValueOfAdvTitle).toHaveBeenCalledWith('success');
        });
    });
});
