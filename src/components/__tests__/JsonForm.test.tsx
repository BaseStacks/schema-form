import { render, screen, fireEvent } from '@testing-library/react';
import { useForm } from 'react-hook-form';
import { SchemaForm } from '../SchemaForm';
import { useGlobalContext } from '../../hooks/useGlobalContext';
import { FieldSchemas, SchemaFormRenderProps } from '../../types';
import { SchemaFormField } from '../SchemaFormField';

// Mock dependencies
jest.mock('react-hook-form', () => ({
    FormProvider: jest.fn(({ children }) => children),
    useForm: jest.fn(),
    useWatch: jest.fn(),
}));

jest.mock('../../hooks/useGlobalContext', () => ({
    useGlobalContext: jest.fn(),
}));

jest.mock('../SchemaFormField', () => ({
    SchemaFormField: jest.fn(({ name }) => <div data-testid={`field-${name}`}>{name}</div>),
}));

describe('SchemaForm', () => {
    const mockGetValues = jest.fn();
    const mockForm = {
        control: {},
        getValues: mockGetValues,
        handleSubmit: jest.fn(fn => (event: any) => fn(mockGetValues(), event)),
    };

    const mockFields: FieldSchemas<any> = {
        name: { type: 'string' },
        email: { type: 'string', format: 'email' },
    };

    const mockOnSubmit = jest.fn();

    const mockInnerForm = jest.fn(({ children, onSubmit, form }: SchemaFormRenderProps) => (
        <form data-testid="default-form" onSubmit={form.handleSubmit(onSubmit)}>
            {children}
            <button type="submit" data-testid="submit-button">Submit</button>
        </form>
    ));

    const mockComponents = {
        Form: mockInnerForm,
        fields: {
            string: jest.fn(() => <div>String Field</div>),
        }
    };

    beforeEach(() => {
        jest.clearAllMocks();
        (useForm as jest.Mock).mockReturnValue(mockForm);
        (useGlobalContext as jest.Mock).mockReturnValue({
            components: mockComponents,
            validationResolver: 'ajv',
        });
    });

    test('renders fields based on schema', () => {
        render(
            <SchemaForm
                onSubmit={mockOnSubmit}
                fields={mockFields}
            />
        );

        expect(SchemaFormField).toHaveBeenCalledTimes(2);
        expect(screen.getByTestId('field-name')).toBeInTheDocument();
        expect(screen.getByTestId('field-email')).toBeInTheDocument();
    });

    test('uses custom form component when provided via children function', () => {
        render(
            <SchemaForm
                onSubmit={mockOnSubmit}
                fields={mockFields}
            >
                {(props) => <div data-testid="custom-form">Custom Form with {props.children}</div>}
            </SchemaForm>
        );

        expect(screen.getByTestId('custom-form')).toBeInTheDocument();
        expect(mockInnerForm).not.toHaveBeenCalled();
    });

    test('uses default form component when no children function is provided', () => {
        render(
            <SchemaForm
                onSubmit={mockOnSubmit}
                fields={mockFields}
            />
        );

        expect(screen.getByTestId('default-form')).toBeInTheDocument();
        expect(mockInnerForm).toHaveBeenCalled();
    });


    test('merges context from global and user context', () => {
        const globalContext = { theme: 'light' };
        const userContext = { language: 'en' };

        (useGlobalContext as jest.Mock).mockReturnValue({
            components: mockComponents,
            validationResolver: 'ajv',
            renderContext: globalContext,
        });

        render(
            <SchemaForm
                fields={mockFields}
                renderContext={userContext}
            />
        );

        expect(mockInnerForm).toHaveBeenCalledWith(
            expect.objectContaining({
                renderContext: expect.objectContaining({
                    theme: 'light',
                    language: 'en',
                }),
            }),
            undefined
        );
    });

    test('calls onSubmit handler when form is submitted', () => {
        const formData = { name: 'Test', email: 'test@example.com' };
        mockForm.getValues.mockReturnValue(formData);

        render(
            <SchemaForm
                onSubmit={mockOnSubmit}
                fields={mockFields}
            />
        );

        expect(screen.getByTestId('submit-button')).toBeInTheDocument();

        fireEvent.submit(screen.getByTestId('submit-button'));

        expect(mockForm.handleSubmit).toHaveBeenCalled();
        expect(mockOnSubmit).toHaveBeenCalledWith(formData, expect.any(Object));
    });
});
