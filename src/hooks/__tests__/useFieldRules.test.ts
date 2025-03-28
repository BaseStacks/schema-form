import { renderHook } from '@testing-library/react';
import { useFieldRules } from '../useFieldRules';
import { useGlobalContext } from '../useGlobalContext';
import { getValidationRules, getValidationStats } from '../../utils/fieldUtils';
import { FieldSchemaType } from '../../types';

// Mock dependencies
jest.mock('../useGlobalContext');
jest.mock('../../utils/fieldUtils');

describe('useFieldRules', () => {
    beforeEach(() => {
        // Mock implementations
        (useGlobalContext as jest.Mock).mockReturnValue({
            getDefaultMessages: jest.fn(() => ({}))
        });
        
        (getValidationStats as jest.Mock).mockReturnValue({
            required: true,
            min: 3,
            max: 10
        });
        
        (getValidationRules as jest.Mock).mockReturnValue({
            required: true,
            min: { value: 3, message: 'Min 3' },
            max: { value: 10, message: 'Max 10' }
        });
    });
    
    afterEach(() => {
        jest.clearAllMocks();
    });
    
    test('returns validation rules from schema', () => {
        const schema = { type: 'string', required: true } as FieldSchemaType<any>;
        
        const { result } = renderHook(() => useFieldRules(schema));
        
        expect(getValidationStats).toHaveBeenCalledWith(schema);
        expect(getValidationRules).toHaveBeenCalled();
        expect(result.current).toEqual({
            required: true,
            min: { value: 3, message: 'Min 3' },
            max: { value: 10, message: 'Max 10' }
        });
    });
    
    test('returns empty object when validationStats is falsy', () => {
        (getValidationStats as jest.Mock).mockReturnValue(null);
        const schema = { type: 'string' } as FieldSchemaType<any>;
        
        const { result } = renderHook(() => useFieldRules(schema));
        
        expect(result.current).toEqual({});
    });
    
    test('uses default messages from context', () => {
        const mockMessages = { required: 'Field is required' };
        (useGlobalContext as jest.Mock).mockReturnValue({
            getDefaultMessages: jest.fn(() => mockMessages)
        });
        
        const schema = { type: 'string', required: true } as FieldSchemaType<any>;
        
        renderHook(() => useFieldRules(schema));
        
        expect(getValidationRules).toHaveBeenCalledWith(schema, mockMessages);
    });
    
    test('memoizes rules when dependencies have not changed', () => {
        const schema = { type: 'string', required: true } as FieldSchemaType<any>;
        
        const { rerender, result } = renderHook(() => useFieldRules(schema));
        const initialRules = result.current;
        
        jest.clearAllMocks();
        rerender();
        
        expect(getValidationStats).not.toHaveBeenCalled();
        expect(getValidationRules).not.toHaveBeenCalled();
        expect(result.current).toBe(initialRules);
    });
    
    test('recalculates rules when schema changes', () => {
        const schema1 = { type: 'string', required: true } as FieldSchemaType<any>;
        const schema2 = { type: 'number', min: 5 } as FieldSchemaType<any>;
        
        // Setup mock returns for second schema
        const mockRulesForSchema2 = {
            required: false,
            min: { value: 5, message: 'Min 5' }
        };
        (getValidationRules as jest.Mock).mockReturnValueOnce(mockRulesForSchema2);
        
        const { rerender, result } = renderHook(
            ({ schema }) => useFieldRules(schema), 
            { initialProps: { schema: schema1 } }
        );
        
        const initialRules = result.current;
        jest.clearAllMocks();
        rerender({ schema: schema2 });
        
        expect(getValidationStats).toHaveBeenCalledWith(schema2);
        expect(getValidationRules).toHaveBeenCalled();
        expect(result.current).not.toBe(initialRules);
        expect(result.current).toEqual(mockRulesForSchema2);
    });
    
    test('recalculates rules when context messages change', () => {
        const schema = { type: 'string', required: true } as FieldSchemaType<any>;
        const initialMessages = { required: 'Field is required' };
        const newMessages = { required: 'This field must be filled' };
        
        // Setup initial context
        (useGlobalContext as jest.Mock).mockReturnValue({
            getDefaultMessages: jest.fn(() => initialMessages)
        });
        
        const { result, rerender } = renderHook(() => useFieldRules(schema));
        const initialRules = result.current;
        
        // Change the context messages
        jest.clearAllMocks();
        (useGlobalContext as jest.Mock).mockReturnValue({
            getDefaultMessages: jest.fn(() => newMessages)
        });
        
        // Mock new rules that would be generated with new messages
        const newRules = {
            required: true,
            min: { value: 3, message: 'Min 3' },
            max: { value: 10, message: 'This field must be filled' }
        };
        (getValidationRules as jest.Mock).mockReturnValueOnce(newRules);
        
        rerender();
        
        expect(getValidationStats).toHaveBeenCalledWith(schema);
        expect(getValidationRules).toHaveBeenCalledWith(schema, newMessages);
        expect(result.current).not.toBe(initialRules);
        expect(result.current).toEqual(newRules);
    });
});
