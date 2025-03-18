import { renderHook } from '@testing-library/react';
import { SchemaFormContext } from '../../contexts';
import { useSchemaForm } from '../useSchemaForm';
import { SchemaFormContextType } from '../../types';

describe('useSchemaForm', () => {
    it('should throw error when used outside SchemaFormContext', () => {
        // Act & Assert
        expect(() => {
            renderHook(() => useSchemaForm());
        }).toThrow();
    });

    it('should return context when inside SchemaFormContext', () => {
        // Arrange
        const mockContext: SchemaFormContextType = {
            fields: { testField: { type: 'text' } },
            form: { setValue: jest.fn() } as any,
            renderContext: { theme: 'light' },
        };

        const wrapper = ({ children }) => (
            <SchemaFormContext.Provider value={mockContext}>
                {children}
            </SchemaFormContext.Provider>
        );

        // Act
        const { result } = renderHook(() => useSchemaForm(), { wrapper });

        // Assert
        expect(result.current).toEqual(mockContext);
    });
});
