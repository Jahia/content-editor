import React from 'react';
import {shallow} from '@jahia/test-framework';
import HeaderBadges from './';
import {Constants} from '~/ContentEditor.constants';
import {useFormikContext} from 'formik';
import {useContentEditorContext} from '~/ContentEditor.context';

jest.mock('~/ContentEditor.context');
jest.mock('formik');
describe('Header UpperSection', () => {
    let formik;
    let contentEditorContext;

    beforeEach(() => {
        contentEditorContext = {
            mode: 'create',
            i18nContext: {},
            nodeData: {
                primaryNodeType: {
                    displayName: 'WIP-WOP'
                }
            }
        };
        useContentEditorContext.mockReturnValue(contentEditorContext);
        formik = {
            values: {
                'WIP::Info': {
                    status: Constants.wip.status.DISABLED
                }
            }
        };
        useFormikContext.mockReturnValue(formik);
    });

    it('should u and unsaved info chip displayed when ce in create mode', () => {
        const cmp = shallow(<HeaderBadges/>);
        expect(cmp.find('UnsavedChip').dive().find({'data-sel-role': 'unsaved-info-chip'}).exists()).toBe(true);
    });
});
