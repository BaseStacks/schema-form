import { renderHook } from '@testing-library/react';
import { SchemaFormContext } from '../../contexts';
import { useFieldSchema } from '../useFieldSchema';
import { SchemaFormContextType } from '../../types';

describe('useFieldSchema', () => {
    it('should throw error when used outside SchemaFormContext', () => {
        // Arrange & Act & Assert
        expect(() => {
            renderHook(() => useFieldSchema('testField'));
        }).toThrow();
    });

    it('should return field schema when context is provided', () => {
        const value: SchemaFormContextType = {
            fields: { testField: { type: 'text' } },
            renderContext: {},
            form: { setValue: jest.fn() } as any,
        };

        // Arrange
        const wrapper = ({ children }) => (
            <SchemaFormContext.Provider value={value}>
                {children}
            </SchemaFormContext.Provider>
        );

        // Act
        const { result } = renderHook(() => useFieldSchema('testField'), { wrapper });

        // Assert
        expect(result.current).toEqual({ type: 'text' });
    });
});
