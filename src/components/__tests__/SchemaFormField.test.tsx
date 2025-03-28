import { render, screen } from '@testing-library/react';
import { SchemaFormField } from '../SchemaFormField';
import { useFieldSchema } from '../../hooks/useFieldSchema';
import { useFieldStatus } from '../../hooks/useFieldStatus';
import { useSchemaForm } from '../../hooks/useSchemaForm';
import { useFieldComponent } from '../../hooks/useFieldComponent';
import { useFieldRules } from '../../hooks/useFieldRules';
import { SchemaFieldContext } from '../../contexts';
import { PropsWithChildren } from 'react';

// Mock the hooks
jest.mock('../../hooks/useFieldSchema');
jest.mock('../../hooks/useFieldStatus');
jest.mock('../../hooks/useSchemaForm');
jest.mock('../../hooks/useFieldComponent');
jest.mock('../../hooks/useFieldRules');

// Mock the context
jest.mock('../../contexts', () => ({
    SchemaFieldContext: {
        Provider: jest.fn(({ children }: PropsWithChildren) => {
            return children;
        })
    }
}));

describe('SchemaFormField', () => {
    const mockForm = {
        getValues: jest.fn().mockReturnValue({}),
        formState: { errors: {} },
        control: {}
    };

    beforeEach(() => {
        jest.clearAllMocks();

        (useSchemaForm as jest.Mock).mockReturnValue({
            form: mockForm,
            renderContext: {}
        });

        (useFieldStatus as jest.Mock).mockReturnValue({ isVisible: true });

        (useFieldRules as jest.Mock).mockReturnValue({});
    });

    it('renders the correct field component for a given type', () => {
        const mockTextComponent = jest.fn(() => <div data-testid="text-field">Text Field</div>);

        const mockSchema = {
            type: 'text',
            title: 'Test Field'
        };

        (useFieldSchema as jest.Mock).mockReturnValue(mockSchema);
        (useFieldComponent as jest.Mock).mockReturnValue(mockTextComponent);

        render(<SchemaFormField name="testField" />);

        expect(screen.getByTestId('text-field')).toBeInTheDocument();
        expect(mockTextComponent).toHaveBeenCalled();

        // Verify context is correctly set
        expect(SchemaFieldContext.Provider).toHaveBeenCalledWith(
            expect.objectContaining({
                value: expect.objectContaining({
                    form: mockForm,
                    name: 'testField',
                    schema: mockSchema,
                    error: undefined,
                    renderContext: expect.any(Object),
                    rules: expect.any(Object)
                })
            }),
            undefined
        );
    });

    it('renders nothing when field is not visible', () => {
        (useFieldSchema as jest.Mock).mockReturnValue({
            type: 'text',
            title: 'Test Field'
        });

        (useFieldStatus as jest.Mock).mockReturnValue({ isVisible: false });

        const { container } = render(<SchemaFormField name="testField" />);

        expect(container).toBeEmptyDOMElement();
    });

    it('passes custom component through context', () => {
        const CustomComponent = jest.fn(() => <div data-testid="custom-field">Custom Field</div>);

        const mockSchema = {
            type: 'custom',
            Component: CustomComponent
        };

        (useFieldSchema as jest.Mock).mockReturnValue(mockSchema);
        (useFieldComponent as jest.Mock).mockReturnValue(CustomComponent);

        render(<SchemaFormField name="customField" />);

        expect(screen.getByTestId('custom-field')).toBeInTheDocument();
        expect(CustomComponent).toHaveBeenCalled();

        // Verify context is correctly set
        expect(SchemaFieldContext.Provider).toHaveBeenCalledWith(
            expect.objectContaining({
                value: expect.objectContaining({
                    form: mockForm,
                    name: 'customField',
                    schema: mockSchema,
                }),
            }),
            undefined
        );
    });

    it('merges render contexts correctly', () => {
        const mockTextComponent = jest.fn(() => <div>Text Field</div>);
        const schemaRenderContext = { theme: 'dark' };
        const fieldRenderContext = { size: 'large' };
        const formRenderContext = { variant: 'outlined' };

        (useSchemaForm as jest.Mock).mockReturnValue({
            form: mockForm,
            renderContext: formRenderContext
        });

        const mockSchema = {
            type: 'text',
            title: 'Test Field',
            renderContext: schemaRenderContext
        };

        (useFieldSchema as jest.Mock).mockReturnValue(mockSchema);
        (useFieldComponent as jest.Mock).mockReturnValue(mockTextComponent);

        render(<SchemaFormField name="testField" renderContext={fieldRenderContext} />);

        expect(mockTextComponent).toHaveBeenCalled();

        // Verify the merged render context
        expect(SchemaFieldContext.Provider).toHaveBeenCalledWith(
            expect.objectContaining({
                value: expect.objectContaining({
                    renderContext: expect.objectContaining({
                        theme: 'dark',
                        size: 'large',
                        variant: 'outlined'
                    })
                })
            }),
            undefined
        );
    });

    it('includes field error in context when available', () => {
        const mockTextComponent = jest.fn(() => <div>Text Field</div>);
        const mockError = { type: 'required', message: 'This field is required' };

        const mockFormWithError = {
            ...mockForm,
            formState: { errors: { testField: mockError } }
        };

        (useSchemaForm as jest.Mock).mockReturnValue({
            form: mockFormWithError,
            renderContext: {}
        });

        const mockSchema = {
            type: 'text',
            title: 'Test Field'
        };

        (useFieldSchema as jest.Mock).mockReturnValue(mockSchema);
        (useFieldComponent as jest.Mock).mockReturnValue(mockTextComponent);

        render(<SchemaFormField name="testField" />);

        expect(mockTextComponent).toHaveBeenCalled();

        // Verify error is passed in context
        expect(SchemaFieldContext.Provider).toHaveBeenCalledWith(
            expect.objectContaining({
                value: expect.objectContaining({
                    error: mockError
                })
            }),
            undefined
        );
    });
});
