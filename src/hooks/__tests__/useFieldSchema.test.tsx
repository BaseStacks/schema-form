import { renderHook } from '@testing-library/react';
import { JsonFormContext } from '../../contexts';
import { useFieldSchema } from '../useFieldSchema';
import { JsonFormContextType } from '../../types';

// Mock object-path
jest.mock('object-path', () => ({
    get: jest.fn((_obj, path) => {
        if (path === 'testField') {
            return { type: 'text', label: 'Test Field' };
        }
        return undefined;
    }),
}));

describe('useFieldSchema', () => {
    it('should throw error when used outside JsonFormContext', () => {
        // Arrange & Act & Assert
        expect(() => {
            renderHook(() => useFieldSchema('testField'));
        }).toThrow();
    });

    it('should return field schema when context is provided', () => {
        const value: JsonFormContextType = {
            fields: { testField: { type: 'text' } },
            context: {},
            form: { setValue: jest.fn() } as any,
        };

        // Arrange
        const wrapper = ({ children }) => (
            <JsonFormContext.Provider value={value}>
                {children}
            </JsonFormContext.Provider>
        );

        // Act
        const { result } = renderHook(() => useFieldSchema('testField'), { wrapper });

        // Assert
        expect(result.current).toEqual({ type: 'text', label: 'Test Field' });
    });
});
