import React from 'react';
import {shallow} from '@jahia/test-framework';
import {HeaderBadges} from './HeaderBadges';
import {Constants} from '~/ContentEditor.constants';
import {useFormikContext} from 'formik';
import {useContentEditorContext} from '~/contexts/ContentEditor';

jest.mock('~/contexts/ContentEditor/ContentEditor.context');
jest.mock('formik');
describe('HeaderBadges', () => {
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
            },
            siteInfo: {
                languages: [{name: 'en', displayName: 'english'}]
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

    it('Shows only WIP chip in create mode', () => {
        const cmp = shallow(<HeaderBadges mode={Constants.routes.baseCreateRoute}/>);
        expect(cmp.children().length).toBe(1);
        expect(cmp.find('WipInfoChip').exists()).toBe(true);
    });
});
