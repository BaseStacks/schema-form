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

    test('works correctly when getDefaultMessages is not defined', () => {
        // Setup context without getDefaultMessages
        (useGlobalContext as jest.Mock).mockReturnValue({});

        const schema = { type: 'string', required: true } as FieldSchemaType<any>;
        
        // Mock validation rules without default messages
        const mockRulesWithoutMessages = {
            required: true,
            min: { value: 3 },
            max: { value: 10 }
        };
        (getValidationRules as jest.Mock).mockReturnValueOnce(mockRulesWithoutMessages);
        
        const { result } = renderHook(() => useFieldRules(schema));
        
        expect(getValidationStats).toHaveBeenCalledWith(schema);
        expect(getValidationRules).toHaveBeenCalledWith(schema, undefined);
        expect(result.current).toEqual(mockRulesWithoutMessages);
    });

    test('works correctly when getDefaultMessages returns undefined', () => {
        // Setup context with getDefaultMessages that returns undefined
        (useGlobalContext as jest.Mock).mockReturnValue({
            getDefaultMessages: jest.fn(() => undefined)
        });

        const schema = { type: 'string', required: true } as FieldSchemaType<any>;
        
        // Mock validation rules without default messages
        const mockRulesWithoutMessages = {
            required: true,
            min: { value: 3 },
            max: { value: 10 }
        };
        (getValidationRules as jest.Mock).mockReturnValueOnce(mockRulesWithoutMessages);
        
        const { result } = renderHook(() => useFieldRules(schema));
        
        expect(getValidationStats).toHaveBeenCalledWith(schema);
        expect(getValidationRules).toHaveBeenCalledWith(schema, undefined);
        expect(result.current).toEqual(mockRulesWithoutMessages);
    });

    test('returns default stats object when validationStats is undefined', () => {
        // Mock getValidationStats to return undefined
        (getValidationStats as jest.Mock).mockReturnValueOnce(undefined);

        const schema = { type: 'string' } as FieldSchemaType<any>;
        
        const { result } = renderHook(() => useFieldRules(schema));
        
        expect(getValidationStats).toHaveBeenCalledWith(schema);
        expect(getValidationRules).not.toHaveBeenCalled();
        expect(result.current).toEqual({ stats: {} });
    });

    test('works correctly with valid schema and default messages', () => {
        const mockDefaultMessages = { 
            required: 'This field is required',
            min: 'Value too short',
            max: 'Value too long'
        };
        
        const mockGetDefaultMessages = jest.fn(() => mockDefaultMessages);
        (useGlobalContext as jest.Mock).mockReturnValue({
            getDefaultMessages: mockGetDefaultMessages
        });

        const schema = { 
            type: 'string', 
            required: true,
            minLength: 3,
            maxLength: 10 
        } as FieldSchemaType<any>;
        
        const mockValidationStats = {
            required: true,
            min: 3,
            max: 10
        };
        (getValidationStats as jest.Mock).mockReturnValueOnce(mockValidationStats);

        const mockRules = {
            required: { value: true, message: 'This field is required' },
            min: { value: 3, message: 'Value too short' },
            max: { value: 10, message: 'Value too long' }
        };
        (getValidationRules as jest.Mock).mockReturnValueOnce(mockRules);
        
        const { result } = renderHook(() => useFieldRules(schema));
        
        expect(getValidationStats).toHaveBeenCalledWith(schema);
        expect(mockGetDefaultMessages).toHaveBeenCalledWith(mockValidationStats, schema);
        expect(getValidationRules).toHaveBeenCalledWith(schema, mockDefaultMessages);
        expect(result.current).toEqual(mockRules);
    });
});
