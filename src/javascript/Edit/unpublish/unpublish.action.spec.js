import unpublishAction from './unpublish.action';

describe('unpublish action', () => {
    describe('onClick', () => {
        let context;
        beforeEach(() => {
            context = {
                formik: {
                    submitForm: jest.fn(() => Promise.resolve()),
                    resetForm: jest.fn(),
                    setFieldValue: jest.fn()
                }
            };
        });

        it('should do nothing when formik is not available', () => {
            const context = {};

            unpublishAction.onClick(context);

            expect(Object.keys(context).length).toBe(0);
        });

        it('should submit form when formik is available', () => {
            unpublishAction.onClick(context);

            expect(context.formik.submitForm).toHaveBeenCalled();
        });
    });

    describe('onInit', () => {
        let context;
        beforeEach(() => {
            context = {
                nodeData: {
                    aggregatedPublicationInfo: {
                        publicationStatus: 'PUBLISHED'
                    },
                    hasPermission: true
                }
            };
        });

        it('should not enable unpublish action when form is not saved', () => {
            const props = {
                formik: {
                    dirty: true
                }
            };

            unpublishAction.init(context, props);

            // As action expect impure function, testing params
            expect(context.enabled).toBe(false);
        });

        it('should enable unpublish action when form is saved and published', () => {
            const props = {
                formik: {
                    dirty: false
                }
            };

            unpublishAction.init(context, props);

            expect(context.enabled).toBe(true);
        });

        it('should not enable unpublish action when node is not published', () => {
            context.nodeData.aggregatedPublicationInfo.publicationStatus = 'MODIFIED';
            const props = {
                formik: {
                    dirty: false
                }
            };

            unpublishAction.init(context, props);

            expect(context.enabled).toBe(false);
        });

        it('should disable unpublish action when you haven\'t the proper permission', () => {
            context.nodeData.hasPermission = false;
            const props = {
                formik: {
                    dirty: false
                }
            };
            unpublishAction.init(context, props);

            expect(context.enabled).toBe(false);
        });
    });
});
