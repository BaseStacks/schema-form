import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { SchemaForm } from '../SchemaForm';
import { useGlobalContext } from '../../hooks/useGlobalContext';
import { SchemaFormField } from '../SchemaFormField';
import { useForm, UseFormProps, useWatch } from 'react-hook-form';
import { SchemaFormRenderProps } from '../../types';

// Mock dependencies
jest.mock('../../hooks/useGlobalContext');
jest.mock('../SchemaFormField');
jest.mock('react-hook-form', () => ({
    ...jest.requireActual('react-hook-form'),
    useForm: jest.fn(),
    FormProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    useWatch: jest.fn()
}));

describe('SchemaForm', () => {
    const mockFields = {
        name: { type: 'text', title: 'Name' },
        email: { type: 'text', title: 'Email' }
    };

    const mockForm = {
        handleSubmit: jest.fn(callback => (data: any) => callback(data)),
        control: {},
        formState: { errors: {} },
        getValues: jest.fn()
    };

    const mockFormComponent = jest.fn(({ children, onSubmit, form }: SchemaFormRenderProps) => (
        <form data-testid="mock-form" onSubmit={form.handleSubmit(onSubmit)}>
            {children}
            <button type="submit" data-testid="submit-button">Submit</button>
        </form>
    ));

    beforeEach(() => {
        jest.clearAllMocks();

        (useGlobalContext as jest.Mock).mockReturnValue({
            components: {
                Form: mockFormComponent,
                fields: {}
            },
            renderContext: { theme: 'light' }
        });

        (useForm as jest.Mock).mockReturnValue(mockForm);
        (SchemaFormField as jest.Mock).mockImplementation(({ name }) => (
            <div data-testid={`field-${name}`}>{name} Field</div>
        ));

        (useWatch as jest.Mock).mockReturnValue({});
    });

    it('renders form with fields correctly', () => {
        render(<SchemaForm fields={mockFields} />);

        expect(screen.getByTestId('mock-form')).toBeInTheDocument();
        expect(screen.getByTestId('field-name')).toBeInTheDocument();
        expect(screen.getByTestId('field-email')).toBeInTheDocument();

        expect(SchemaFormField).toHaveBeenCalledTimes(2);
        expect(SchemaFormField).toHaveBeenNthCalledWith(1, expect.objectContaining({ name: 'name' }), undefined);
        expect(SchemaFormField).toHaveBeenNthCalledWith(2, expect.objectContaining({ name: 'email' }), undefined);
    });

    it('calls onSubmit when form is submitted', () => {
        const mockOnSubmit = jest.fn();
        const mockData = { name: 'John', email: 'john@example.com' };

        render(<SchemaForm fields={mockFields} onSubmit={mockOnSubmit} />);

        const submitButton = screen.getByTestId('submit-button');
        fireEvent.submit(submitButton);

        expect(mockForm.handleSubmit).toHaveBeenCalled();

        // Call the submit handler directly to test
        const submitHandler = mockForm.handleSubmit.mock.calls[0][0];
        submitHandler(mockData);

        expect(mockOnSubmit).toHaveBeenCalledWith(mockData, undefined);
    });

    it('merges global and form render contexts', () => {
        const formRenderContext = { size: 'large' };

        render(<SchemaForm fields={mockFields} renderContext={formRenderContext} />);

        expect(mockFormComponent).toHaveBeenCalledWith(
            expect.objectContaining({
                renderContext: expect.objectContaining({
                    theme: 'light',
                    size: 'large'
                })
            }),
            undefined
        );
    });

    it('renders with custom children function', () => {
        const customRender = jest.fn(({ children }) => (
            <div data-testid="custom-form">
                <div data-testid="form-fields">{children}</div>
            </div>
        ));

        render(<SchemaForm fields={mockFields}>{customRender}</SchemaForm>);

        expect(screen.getByTestId('custom-form')).toBeInTheDocument();
        expect(screen.getByTestId('form-fields')).toBeInTheDocument();
        expect(customRender).toHaveBeenCalledWith(
            expect.objectContaining({
                form: mockForm,
                fields: mockFields,
                children: expect.anything()
            })
        );
    });

    it('initializes form with provided form props', () => {
        const formProps = {
            mode: 'onChange',
            defaultValues: { name: 'John' }
        } as UseFormProps<any>;

        render(<SchemaForm fields={mockFields} {...formProps} />);

        expect(useForm).toHaveBeenCalledWith(
            expect.objectContaining({
                mode: 'onChange',
                defaultValues: { name: 'John' }
            })
        );
    });
});
