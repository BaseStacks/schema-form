import { renderHook } from '@testing-library/react';
import { useFieldContext } from '../useFieldContext';
import React from 'react';
import { FieldValues } from 'react-hook-form';
import { RenderContext, SchemaFieldContextType } from '../../types';

jest.mock('react', () => ({
    ...jest.requireActual('react'),
    useContext: jest.fn(),
}));

describe('useFieldContext', () => {
    test('should return context when used within SchemaFieldContext.Provider', () => {
        // Mock context value
        const mockContextValue: SchemaFieldContextType<RenderContext, FieldValues> = {
            name: 'test',
            schema: { type: 'string' },
            form: {} as any,
            rules: { stats: {} },
            error: undefined,
            renderContext: {} as any,
        };

        // Mock useContext to return the mock context value
        (React.useContext as jest.Mock).mockReturnValueOnce(mockContextValue);

        // Render the hook with the provider wrapper
        const { result } = renderHook(() => useFieldContext());

        // Expect the hook to return the context value
        expect(result.current).toBe(mockContextValue);
    });

    test('should throw error when used outside SchemaFieldContext.Provider', () => {
        // Render the hook without a provider wrapper
        expect(() => {
            renderHook(() => useFieldContext());
        }).toThrow();
    });
});
