import { render, screen } from '@testing-library/react';
import { withArray } from '../withArray';
import { useFieldArray } from 'react-hook-form';
import { SchemaFormField } from '../../SchemaFormField';
import { getValidationStats } from '../../../utils/fieldUtils';

jest.mock('react', () => {
    const originReact = jest.requireActual('react');
    return {
        ...originReact,
        useContext: jest.fn().mockReturnValue({
            getDefaultMessages: jest.fn().mockReturnValue({ required: 'This field is required' })
        }),
    };
});

// Mock dependencies
jest.mock('react-hook-form', () => ({
    useFieldArray: jest.fn(),
}));

jest.mock('../../SchemaFormField', () => ({
    SchemaFormField: jest.fn(() => <div data-testid="schema-form-field" />),
}));

jest.mock('../../../utils/fieldUtils');

describe('withArray HOC', () => {
    const MockComponent = jest.fn(() => (
        <div data-testid="mock-component" />
    ));

    const WrappedComponent = withArray(MockComponent);

    const defaultProps = {
        schema: { title: 'Test Title', description: 'Test Description', placeholder: 'Test Placeholder' },
        name: 'testArray',
        form: {} as any,
        renderContext: {},
        error: undefined,
    };

    beforeEach(() => {
        jest.clearAllMocks();
        (useFieldArray as jest.Mock).mockReturnValue({
            fields: []
        });
    });

    it('should render the wrapped component', () => {
        render(<WrappedComponent {...defaultProps} />);
        expect(screen.getByTestId('mock-component')).toBeInTheDocument();
    });

    it('should pass the correct props to the wrapped component', () => {
        render(<WrappedComponent {...defaultProps} />);
        expect(MockComponent).toHaveBeenCalledWith(
            expect.objectContaining({
                name: 'testArray',
                title: 'Test Title',
                description: 'Test Description',
                placeholder: 'Test Placeholder',
                canAddItem: true,
                canRemoveItem: true,
                renderItem: expect.any(Function),
                renderContext: {},
                error: undefined,
                required: false,
                minLength: undefined,
                maxLength: undefined,
            }),
            undefined
        );
    });

    it('should calculate canAddItem and canRemoveItem correctly', () => {
        (useFieldArray as jest.Mock).mockReturnValue({
            fields: [{ id: '1' }, { id: '2' }, { id: '3' }]
        });

        const validationStats = { minLength: 2, maxLength: 3 };
        (getValidationStats as jest.Mock).mockReturnValue(validationStats);

        const schemaWithValidation = { ...defaultProps.schema, validationStats };

        render(<WrappedComponent {...defaultProps} schema={schemaWithValidation} />);

        expect(MockComponent).toHaveBeenCalledWith(
            expect.objectContaining({
                canAddItem: false,
                canRemoveItem: true,
            }),
            undefined
        );
    });

    it('should call renderItem with the correct index', () => {
        render(<WrappedComponent {...defaultProps} />);
        const renderItem = (MockComponent.mock.calls[0] as any)[0].renderItem;

        const renderedItem = renderItem(0);
        expect(renderedItem).toEqual(
            <SchemaFormField key="testArray[0]" name="testArray[0]" renderContext={{}} />
        );
    });
});
