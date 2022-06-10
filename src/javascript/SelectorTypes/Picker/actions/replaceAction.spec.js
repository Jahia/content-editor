import {ReplaceActionComponent} from './replaceAction';
import React from 'react';
import {shallow} from '@jahia/test-framework';

const button = () => <button type="button"/>;

describe('replaceAction', () => {
    it('should open modal when clicking on it', () => {
        const open = jest.fn();
        const context = {
            field: {
                readOnly: false
            },
            inputContext: {
                actionContext: {
                    open
                }
            }
        };

        const cmp = shallow(<ReplaceActionComponent {...context} render={button}/>);
        cmp.simulate('click');

        expect(open).toHaveBeenCalledWith(true);
    });

    it('should enabled the action if field is not readonly', () => {
        const context = {
            field: {
                readOnly: false
            }
        };
        const cmp = shallow(<ReplaceActionComponent {...context} render={button}/>);

        expect(cmp.props().enabled).toBe(true);
    });

    it('should not enabled the action if field is readonly', () => {
        const context = {
            field: {
                readOnly: true
            }
        };
        const cmp = shallow(<ReplaceActionComponent {...context} render={button}/>);

        expect(cmp.props().enabled).toBe(false);
    });
});
