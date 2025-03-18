import { renderHook } from '@testing-library/react';
import { JsonFormContext } from '../../contexts';
import { useSchemaForm } from '../useSchemaForm';
import { JsonFormContextType } from '../../types';

describe('useSchemaForm', () => {
    it('should throw error when used outside JsonFormContext', () => {
        // Act & Assert
        expect(() => {
            renderHook(() => useSchemaForm());
        }).toThrow();
    });

    it('should return context when inside JsonFormContext', () => {
        // Arrange
        const mockContext: JsonFormContextType = {
            fields: { testField: { type: 'text' } },
            form: { setValue: jest.fn() } as any,
            context: { theme: 'light' },
        };

        const wrapper = ({ children }) => (
            <JsonFormContext.Provider value={mockContext}>
                {children}
            </JsonFormContext.Provider>
        );

        // Act
        const { result } = renderHook(() => useSchemaForm(), { wrapper });

        // Assert
        expect(result.current).toEqual(mockContext);
    });
});
