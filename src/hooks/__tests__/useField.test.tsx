import { renderHook } from '@testing-library/react';
import { useField } from '../useField';
import { useFieldContext } from '../useFieldContext';
import { useController } from 'react-hook-form';

// Mock dependencies
jest.mock('../useFieldContext');
jest.mock('react-hook-form', () => ({
    ...jest.requireActual('react-hook-form'),
    useController: jest.fn()
}));

describe('useField', () => {
    beforeEach(() => {
        jest.clearAllMocks();

        // Default mock implementation
        (useFieldContext as jest.Mock).mockReturnValue({
            schema: { foo: 'bar' },
            name: 'testField',
            rules: {
                stats: {
                    required: true,
                    min: 5,
                    max: 10,
                    minLength: 2,
                    maxLength: 8,
                    pattern: /test/
                }
            },
            renderContext: { theme: 'light' },
            error: null
        });

        (useController as jest.Mock).mockReturnValue({
            field: { value: 'test', onChange: jest.fn(), onBlur: jest.fn(), ref: jest.fn() },
            fieldState: { invalid: false, isTouched: false, isDirty: false },
            formState: { isDirty: false, dirtyFields: {}, touchedFields: {}, isSubmitted: false }
        });
    });

    test('should merge baseSchema with context schema', () => {
        const baseSchema = { required: true };

        const { result } = renderHook(() => useField(baseSchema));

        expect(result.current.schema).toEqual({
            foo: 'bar',
            required: true
        });
    });

    test('should call useController with correct parameters', () => {
        (useFieldContext as jest.Mock).mockReturnValue({
            schema: { value: 'defaultValue', shouldUnregister: true },
            name: 'testField',
            rules: { stats: {} },
            renderContext: {},
            error: null
        });

        renderHook(() => useField());

        expect(useController).toHaveBeenCalledWith({
            name: 'testField',
            rules: { stats: {} },
            shouldUnregister: true,
            defaultValue: 'defaultValue'
        });
    });

    test('should extract and return schema properties', () => {
        (useFieldContext as jest.Mock).mockReturnValue({
            schema: {
                title: 'Test Title',
                description: 'Test Description',
                placeholder: 'Test Placeholder'
            },
            name: 'testField',
            rules: { stats: {} },
            renderContext: {},
            error: null
        });

        const { result } = renderHook(() => useField());

        expect(result.current.title).toBe('Test Title');
        expect(result.current.description).toBe('Test Description');
        expect(result.current.placeholder).toBe('Test Placeholder');
    });

    test('should return validation rules', () => {
        const { result } = renderHook(() => useField());

        expect(result.current.required).toBe(true);
        expect(result.current.min).toBe(5);
        expect(result.current.max).toBe(10);
        expect(result.current.minLength).toBe(2);
        expect(result.current.maxLength).toBe(8);
        expect(result.current.pattern).toEqual(/test/);
    });
});
