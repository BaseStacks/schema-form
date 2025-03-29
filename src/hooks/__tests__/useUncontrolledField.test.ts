import { renderHook } from '@testing-library/react';
import { useUncontrolledField } from '../useUncontrolledField';
import { useFieldContext } from '../useFieldContext';

// Mock dependencies
jest.mock('../useFieldContext');
jest.mock('react-hook-form', () => ({
    ...jest.requireActual('react-hook-form'),
    useFormState: jest.fn().mockReturnValue({
        errors: {},
    })
}));

describe('useUncontrolledField', () => {
    // Setup mock data and functions
    const mockRegister = jest.fn().mockReturnValue({
        onChange: jest.fn(),
        onBlur: jest.fn(),
        name: 'testField',
        ref: jest.fn(),
    });

    const mockForm = {
        register: mockRegister
    };

    const mockSchema = {
        title: 'Test Title',
        description: 'Test Description',
        placeholder: 'Test Placeholder',
        pattern: /test/,
    };

    const mockRules = {
        stats: {
            required: true,
            min: 10,
            max: 100,
            minLength: 5,
            maxLength: 20,
            pattern: /test/
        }
    };

    const mockRenderContext = { theme: 'light' };

    beforeEach(() => {
        jest.clearAllMocks();
        (useFieldContext as jest.Mock).mockReturnValue({
            form: mockForm,
            schema: mockSchema,
            name: 'testField',
            rules: mockRules,
            renderContext: mockRenderContext
        });
    });

    it('should return the correct field result and properties', () => {
        const { result } = renderHook(() => useUncontrolledField());

        expect(mockForm.register).toHaveBeenCalledWith('testField', expect.objectContaining({
            ...mockSchema,
            ...mockRules
        }));

        expect(result.current).toEqual({
            field: {
                onChange: expect.any(Function),
                onBlur: expect.any(Function),
                name: 'testField',
                ref: expect.any(Function),
            },
            schema: expect.objectContaining(mockSchema),
            name: 'testField',
            title: 'Test Title',
            description: 'Test Description',
            placeholder: 'Test Placeholder',
            renderContext: mockRenderContext,
            required: true,
            min: 10,
            max: 100,
            minLength: 5,
            maxLength: 20,
            pattern: /test/
        });
    });

    it('should merge baseSchema with context schema', () => {
        const baseSchema = {
            required: false
        };

        renderHook(() => useUncontrolledField(baseSchema));

        expect(mockForm.register).toHaveBeenCalledWith('testField', expect.objectContaining({
            ...baseSchema,
            ...mockSchema,
            ...mockRules
        }));
    });

    it('should prioritize context schema over baseSchema', () => {
        const baseSchema = {
            pattern: /newPattern/,
        };

        renderHook(() => useUncontrolledField(baseSchema));

        expect(mockForm.register).toHaveBeenCalledWith('testField', expect.objectContaining({
            title: 'Test Title',
            description: 'Test Description',
            pattern: /test/,
        }));
    });
});
