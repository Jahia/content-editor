import {validateForm} from './validation.utils';

describe('validation utils', () => {
    describe('validateForm', () => {
        let formik;
        let renderComponent;
        beforeEach(() => {
            renderComponent = jest.fn();
            formik = {
                errors: {
                    field1: 'required',
                    field2: 'required'
                },
                setTouched: jest.fn(() => Promise.resolve())
            };
        });

        it('should return true when there is no errors', async () => {
            formik.errors = {};
            expect(await validateForm(formik, renderComponent)).toBe(true);
        });

        it('should return false when there is errors', async () => {
            expect(await validateForm(formik, renderComponent)).toBe(false);
        });

        it('should set fields in error to touched', async () => {
            await validateForm(formik, renderComponent);

            expect(formik.setTouched).toHaveBeenCalledWith({
                field1: true,
                field2: true
            });
        });

        it('should display a modal when field have erros', async () => {
            await validateForm(formik, renderComponent);
            expect(renderComponent).toHaveBeenCalled();
        });

        it('should not display a modal when field have no erros', async () => {
            formik.errors = {};
            await validateForm(formik, renderComponent);
            expect(renderComponent).not.toHaveBeenCalled();
        });
    });
});
