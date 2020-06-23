import {buildPickerContext, fillCKEditorPicker} from './RichText.utils';

jest.mock('~/SelectorTypes/Picker/Picker.utils', () => {
    return {
        getNodeTreeConfigs: () => ({thisIsANode: 'treeConfig'})
    };
});

describe('RichText utils', () => {
    describe('buildPickerContext', () => {
        let t;
        let picker;
        let editorContext;

        beforeEach(() => {
            t = jest.fn();
            picker = {
                dialog: {
                    getContentElement: jest.fn()
                }
            };
            editorContext = {
                siteInfo: {
                    displayName: 'digitall'
                }
            };
        });

        it('should always displayTree', () => {
            const {pickerConfig} = buildPickerContext(picker, editorContext, t);
            expect(pickerConfig.displayTree).toBe(true);
        });

        it('should return the nodeTreeConfigs', () => {
            const {nodeTreeConfigs} = buildPickerContext(picker, editorContext, t);
            expect(nodeTreeConfigs).toEqual({thisIsANode: 'treeConfig'});
        });

        it('should an empty currentValue when input is empty', () => {
            const {currentValue} = buildPickerContext(picker, editorContext, t);
            expect(currentValue).toBe('');
        });

        it('should remove the content prefix form the url', () => {
            picker.dialog.getContentElement.mockImplementation(() => {
                return {
                    getValue: () => '/cms/{mode}/{lang}/richTextEdition/toot/al/regal.html'
                };
            });
            const {currentValue} = buildPickerContext(picker, editorContext, t);
            expect(currentValue).toBe('/richTextEdition/toot/al/regal');
        });

        it('should remove the file prefix form the url', () => {
            picker.dialog.getContentElement.mockImplementation(() => {
                return {
                    getValue: () => '/files/{workspace}/richTextEdition/toot/al/regal.html'
                };
            });
            const {currentValue} = buildPickerContext(picker, editorContext, t);
            expect(currentValue).toBe('/richTextEdition/toot/al/regal.html');
        });

        it('should take urlTxt when url is null', () => {
            picker.dialog.getContentElement.mockImplementation((_, id) => {
                if (id !== 'txtUrl') {
                    return;
                }

                return {
                    getValue: () => '/files/{workspace}/richTextEdition/toot/al/regal.html'
                };
            });
            const {currentValue} = buildPickerContext(picker, editorContext, t);
            expect(currentValue).toBe('/richTextEdition/toot/al/regal.html');
        });
    });

    describe('fillCKEditorPicker', () => {
        let picker;

        beforeEach(() => {
            picker = {
                dialog: {
                    getContentElement: jest.fn(() => {
                        return {
                            setValue: jest.fn(),
                            getValue: jest.fn()
                        };
                    })
                },
                contentPicker: true,
                setUrl: jest.fn()
            };
        });

        it('should fill url with contentPrefix and suffix', () => {
            fillCKEditorPicker(picker, {path: '/yoloo'});
            expect(picker.setUrl).toHaveBeenCalledWith(
                '/cms/{mode}/{lang}/yoloo.html',
                {}
            );
        });

        it('should fill url with filePrefix', () => {
            picker.contentPicker = false;
            fillCKEditorPicker(picker, {path: '/yoloo'});
            expect(picker.setUrl).toHaveBeenCalledWith(
                '/files/{workspace}/yoloo',
                {}
            );
        });

        it('should fill advTitle', () => {
            const setValueOfAdvTitle = jest.fn();
            picker.dialog.getContentElement = jest.fn((_, id) => {
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

            fillCKEditorPicker(picker, {path: '/yoloo', name: 'success'});
            expect(setValueOfAdvTitle).toHaveBeenCalledWith('success');
        });

        it('should fill txtAlt', () => {
            const setValueOfAdvTitle = jest.fn();
            picker.dialog.getContentElement = jest.fn((_, id) => {
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

            fillCKEditorPicker(picker, {path: '/yoloo', name: 'success'});
            expect(setValueOfAdvTitle).toHaveBeenCalledWith('success');
        });
    });
});
