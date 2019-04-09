import publishAction from './publishAction';

describe('publish action', () => {
    describe('onClick', () => {
        let context;
        beforeEach(() => {
            context = {
                formik: {
                    submitForm: jest.fn(() => Promise.resolve()),
                    setFieldValue: jest.fn()
                }
            };
        });

        it('should do nothing when formik is not available', () => {
            const context = {};

            publishAction.onClick(context);

            expect(Object.keys(context).length).toBe(0);
        });

        it('should submit form when formik is available', () => {
            publishAction.onClick(context);

            expect(context.formik.submitForm).toHaveBeenCalled();
        });

        it('should set context submitOperation to appriopriate publish value', () => {
            publishAction.onClick(context);

            expect(context.submitOperation).toBe('PUBLISH');
        });
    });

    describe('onInit', () => {
        let context;
        beforeEach(() => {
            context = {
                nodeData: {
                    aggregatedPublicationInfo: {
                        publicationStatus: 'MODIFIED'
                    }
                }
            };
        });

        it('should not enable submit action when form is not saved', () => {
            const context = {};
            const props = {
                formik: {
                    dirty: true
                }
            };

            publishAction.init(context, props);

            // As action expect impure function, testing params
            expect(context.enabled).toBe(false);
        });

        it('should enable submit action when form is saved', () => {
            const props = {
                formik: {
                    dirty: false
                }
            };

            publishAction.init(context, props);

            expect(context.enabled).toBe(true);
        });

        it('should enable submit action when node is already published', () => {
            context.nodeData.aggregatedPublicationInfo.publicationStatus = 'PUBLISHED';
            const props = {
                formik: {
                    dirty: false
                }
            };

            publishAction.init(context, props);

            expect(context.enabled).toBe(false);
        });

        it('should enable submit action when node is UNPUBLISHABLE', () => {
            context.nodeData.aggregatedPublicationInfo.publicationStatus = 'MANDATORY_LANGUAGE_UNPUBLISHABLE';
            const props = {
                formik: {
                    dirty: false
                }
            };

            publishAction.init(context, props);

            expect(context.enabled).toBe(false);
        });
    });
});
