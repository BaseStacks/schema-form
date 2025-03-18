import { renderHook } from '@testing-library/react';
import { useFieldContext } from '../useFieldContext';
import { useSchemaForm } from '../useSchemaForm';
import { BaseFieldSchema, SchemaFormContextType } from '../../types';

// Mock dependencies
jest.mock('../useSchemaForm', () => ({
    useSchemaForm: jest.fn(),
}));

describe('useFieldContext', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (useSchemaForm as jest.Mock).mockReturnValue({
            renderContext: { theme: 'light', locale: 'en' },
        } as SchemaFormContextType);
    });

    it('should merge form context with field context', () => {
        // Arrange
        const mockField: BaseFieldSchema = {
            renderContext: { readOnly: true, disabled: false },
        };

        // Act
        const { result } = renderHook(() => useFieldContext(mockField as any));

        // Assert
        expect(result.current).toEqual({
            theme: 'light',
            locale: 'en',
            readOnly: true,
            disabled: false,
        });
    });

    it('should prioritize field context over form context', () => {
        // Arrange
        const mockField: BaseFieldSchema = {
            renderContext: { theme: 'dark', customProp: 'value' },
        };

        // Act
        const { result } = renderHook(() => useFieldContext(mockField as any));

        // Assert
        expect(result.current).toEqual({
            theme: 'dark', // Field's theme overrides form's theme
            locale: 'en',
            customProp: 'value',
        });
    });
});
