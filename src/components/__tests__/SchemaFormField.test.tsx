import { render, screen } from '@testing-library/react';
import { SchemaFormField } from '../SchemaFormField';
import { useFieldSchema } from '../../hooks/useFieldSchema';
import { useFieldStatus } from '../../hooks/useFieldStatus';
import { useSchemaForm } from '../../hooks/useSchemaForm';
import { useFieldComponent } from '../../hooks/useFieldComponent';

// Mock the hooks
jest.mock('../../hooks/useFieldSchema');
jest.mock('../../hooks/useFieldStatus');
jest.mock('../../hooks/useSchemaForm');
jest.mock('../../hooks/useFieldComponent');

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
    });
  
    it('renders the correct field component for a given type', () => {
        const mockTextComponent = jest.fn(() => <div data-testid="text-field">Text Field</div>);
    
        (useFieldSchema as jest.Mock).mockReturnValue({
            type: 'text',
            title: 'Test Field'
        });
    
        (useFieldComponent as jest.Mock).mockReturnValue(mockTextComponent);
    
        render(<SchemaFormField name="testField" />);
    
        expect(screen.getByTestId('text-field')).toBeInTheDocument();
        expect(mockTextComponent).toHaveBeenCalledWith(
            expect.objectContaining({
                name: 'testField',
                schema: expect.objectContaining({ type: 'text' }),
                form: mockForm
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
  
    it('renders custom field component for custom schema', () => {
        const CustomComponent = jest.fn(() => <div data-testid="custom-field">Custom Field</div>);
    
        (useFieldSchema as jest.Mock).mockReturnValue({
            Component: CustomComponent
        });
    
        render(<SchemaFormField name="customField" />);
    
        expect(screen.getByTestId('custom-field')).toBeInTheDocument();
        expect(CustomComponent).toHaveBeenCalledWith(
            expect.objectContaining({
                name: 'customField',
                form: mockForm
            }),
            undefined
        );
    });
  
    it('throws error when field type has no corresponding component', () => {
        (useFieldSchema as jest.Mock).mockReturnValue({
            type: 'nonexistent',
            title: 'Test Field'
        });
    
        (useFieldComponent as jest.Mock).mockReturnValue(null);
    
        // Suppress console error for cleaner test output
        const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});
    
        expect(() => {
            render(<SchemaFormField name="testField" />);
        }).toThrow('No field component found for type: nonexistent');
    
        consoleErrorMock.mockRestore();
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
    
        (useFieldSchema as jest.Mock).mockReturnValue({
            type: 'text',
            title: 'Test Field',
            renderContext: schemaRenderContext
        });
    
        (useFieldComponent as jest.Mock).mockReturnValue(mockTextComponent);
    
        render(<SchemaFormField name="testField" renderContext={fieldRenderContext} />);
    
        expect(mockTextComponent).toHaveBeenCalledWith(
            expect.objectContaining({
                renderContext: expect.objectContaining({
                    theme: 'dark',
                    size: 'large',
                    variant: 'outlined'
                })
            }),
            undefined
        );
    });
});
