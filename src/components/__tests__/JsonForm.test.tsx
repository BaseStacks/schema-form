import { render, screen, fireEvent } from '@testing-library/react';
import { useForm } from 'react-hook-form';
import { JsonForm } from '../JsonForm';
import { useGlobalContext } from '../../hooks/useGlobalContext';
import { createResolver } from '../../utils/resolverUtils';
import { FieldSchemas, JsonFormInnerProps } from '../../types';
import { JsonFormField } from '../JsonFormField';

// Mock dependencies
jest.mock('react-hook-form', () => ({
    FormProvider: jest.fn(({ children }) => children),
    useForm: jest.fn(),
    useWatch: jest.fn(),
}));

jest.mock('../../hooks/useGlobalContext', () => ({
    useGlobalContext: jest.fn(),
}));

jest.mock('../../utils/resolverUtils', () => ({
    createResolver: jest.fn(),
}));

jest.mock('../JsonFormField', () => ({
    JsonFormField: jest.fn(({ name }) => <div data-testid={`field-${name}`}>{name}</div>),
}));

jest.mock('deepmerge', () => ({
    __esModule: true,
    default: jest.fn((a, b) => ({ ...a, ...b })),
}));

describe('JsonForm', () => {
    const mockGetValues = jest.fn();
    const mockForm = {
        control: {},
        getValues: mockGetValues,
        handleSubmit: jest.fn(fn => (event) => fn(mockGetValues(), event)),
    };

    const mockFields: FieldSchemas<any> = {
        name: { type: 'string' },
        email: { type: 'string', format: 'email' },
    };

    const mockOnSubmit = jest.fn();

    const mockResolver = jest.fn();

    const mockInnerForm = jest.fn(({ children, onSubmit, form }: JsonFormInnerProps) => (
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
        (createResolver as jest.Mock).mockReturnValue(mockResolver);
    });

    test('renders fields based on schema', () => {
        render(
            <JsonForm
                onSubmit={mockOnSubmit}
                fields={mockFields}
            />
        );

        expect(JsonFormField).toHaveBeenCalledTimes(2);
        expect(screen.getByTestId('field-name')).toBeInTheDocument();
        expect(screen.getByTestId('field-email')).toBeInTheDocument();
    });

    test('uses custom form component when provided via children function', () => {
        render(
            <JsonForm
                onSubmit={mockOnSubmit}
                fields={mockFields}
            >
                {(props) => <div data-testid="custom-form">Custom Form with {props.children}</div>}
            </JsonForm>
        );

        expect(screen.getByTestId('custom-form')).toBeInTheDocument();
        expect(mockInnerForm).not.toHaveBeenCalled();
    });

    test('uses default form component when no children function is provided', () => {
        render(
            <JsonForm
                onSubmit={mockOnSubmit}
                fields={mockFields}
            />
        );

        expect(screen.getByTestId('default-form')).toBeInTheDocument();
        expect(mockInnerForm).toHaveBeenCalled();
    });

    test('creates resolver when not provided', () => {
        render(
            <JsonForm
                fields={mockFields}
                onSubmit={mockOnSubmit}
                schema={{ type: 'object' }}
            />
        );

        expect(createResolver).toHaveBeenCalledWith(
            expect.objectContaining({
                resolverType: 'ajv',
                schema: { type: 'object' },
            })
        );
    });

    test('uses provided resolver when available', () => {
        const customResolver = jest.fn();

        render(
            <JsonForm
                onSubmit={mockOnSubmit}
                fields={mockFields}
                schema={{}}
                resolver={customResolver}
            />
        );

        expect(useForm).toHaveBeenCalledWith(expect.objectContaining({
            resolver: customResolver,
        }));
        expect(createResolver).not.toHaveBeenCalled();
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
            <JsonForm
                fields={mockFields}
                context={userContext}
            />
        );

        expect(mockInnerForm).toHaveBeenCalledWith(
            expect.objectContaining({
                context: expect.objectContaining({
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
            <JsonForm
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
