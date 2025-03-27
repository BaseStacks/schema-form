import { render, screen } from '@testing-library/react';
import { withRegister } from '../withRegister';
import { useFieldRules } from '../../../hooks/useFieldRules';
import { getValidationStats } from '../../../utils/fieldUtils';

// Mock dependencies
jest.mock('../../../hooks/useFieldRules', () => ({
    useFieldRules: jest.fn().mockReturnValue({ required: true })
}));

jest.mock('../../../utils/fieldUtils', () => ({
    getValidationStats: jest.fn().mockReturnValue({ required: true, min: 5 })
}));

// Create a test component
const TestComponent = (props: any) => (
    <div data-testid="test-component">
        <div data-testid="name">{props.name}</div>
        <div data-testid="title">{props.title}</div>
        <div data-testid="required">{props.required ? 'required' : 'optional'}</div>
        <div data-testid="min">{props.min}</div>
        <div data-testid="render-context">{props.renderContext?.testValue}</div>
    </div>
);

describe('withRegister HOC', () => {
    const mockRegister = jest.fn().mockReturnValue({ ref: 'mockRef' });
    const mockForm = {
        register: mockRegister
    };
  
    beforeEach(() => {
        jest.clearAllMocks();
    });
  
    test('renders the component with correct props', () => {
        const WrappedComponent = withRegister(TestComponent);
        render(
            <WrappedComponent
                form={mockForm as any}
                name="testField"
                schema={{
                    title: 'Test Field',
                }}
                error={undefined}
                renderContext={{}}
            />
        );
    
        expect(screen.getByTestId('name')).toHaveTextContent('testField');
        expect(screen.getByTestId('title')).toHaveTextContent('Test Field');
        expect(screen.getByTestId('required')).toHaveTextContent('required');
        expect(mockRegister).toHaveBeenCalledWith('testField', expect.any(Object));
    });
  
    test('combines base schema with provided schema', () => {
        const baseSchema = { minLength: 3 };
        const WrappedComponent = withRegister(TestComponent, undefined, baseSchema);
        render(
            <WrappedComponent
                form={mockForm as any}
                name="testField"
                schema={{
                    maxLength: 10,
                }}
                error={undefined}
                renderContext={{}}
            />
        );
    
        // Check if useFieldRules is called with combined schema
        expect(useFieldRules).toHaveBeenCalledWith(
            expect.objectContaining({
                minLength: 3,
                maxLength: 10
            })
        );
    });
  
    test('merges render contexts correctly', () => {
        const baseRenderContext = { testValue: 'base' };
        const WrappedComponent = withRegister(TestComponent, baseRenderContext);
        render(
            <WrappedComponent
                form={mockForm as any}
                name="testField"
                schema={{}}
                error={undefined}
                renderContext={{ testValue: 'override' }}
            />
        );
    
        expect(screen.getByTestId('render-context')).toHaveTextContent('override');
    });
  
    test('passes validation stats to component', () => {
        const WrappedComponent = withRegister(TestComponent);
        render(
            <WrappedComponent
                form={mockForm as any}
                name="testField"
                schema={{}}
                error={undefined}
                renderContext={{}}
            />
        );
    
        expect(screen.getByTestId('min')).toHaveTextContent('5');
        expect(getValidationStats).toHaveBeenCalled();
    });
  
    test('passes error to component', () => {
        const TestWithError = (props: any) => (
            <div data-testid="error">{props.error?.message || 'no error'}</div>
        );
    
        const WrappedComponent = withRegister(TestWithError);
        render(
            <WrappedComponent
                form={mockForm as any}
                name="testField"
                schema={{}}
                error={{ message: 'Test error' } as any}
                renderContext={{}}
            />
        );
    
        expect(screen.getByTestId('error')).toHaveTextContent('Test error');
    });
});
