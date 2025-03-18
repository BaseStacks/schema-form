import { renderHook } from '@testing-library/react';
import { useFieldRegister } from '../useFieldRegister';
import { useGlobalContext } from '../useGlobalContext';
import { getValidationOptions, getValidationStats } from '../../utils/fieldUtils';

// Mock dependencies
jest.mock('../useGlobalContext', () => ({
    useGlobalContext: jest.fn(),
}));

jest.mock('../../utils/fieldUtils', () => ({
    getValidationOptions: jest.fn(),
    getValidationStats: jest.fn(),
}));

describe('useFieldRegister', () => {
    const mockForm = {
        register: jest.fn().mockReturnValue({ name: 'testField', onChange: jest.fn() }),
    };

    const mockField = {
        required: true,
        minLength: 5,
        maxLength: 10,
    };

    beforeEach(() => {
        jest.clearAllMocks();
        (useGlobalContext as jest.Mock).mockReturnValue({
            getDefaultMessages: jest.fn().mockReturnValue({
                required: 'This field is required',
                minLength: 'Minimum length is 5',
                maxLength: 'Maximum length is 10',
            }),
        });

        (getValidationStats as jest.Mock).mockReturnValue({
            required: true,
            minLength: true,
            maxLength: true
        });

        (getValidationOptions as jest.Mock).mockReturnValue({
            required: { value: true, message: 'This field is required' },
            minLength: { value: 5, message: 'Minimum length is 5' },
            maxLength: { value: 10, message: 'Maximum length is 10' },
        });
    });

    it('should register field with validation options', () => {
        // Act
        const { result } = renderHook(() =>
            useFieldRegister(mockForm as any, 'testField', mockField)
        );

        // Assert
        expect(mockForm.register).toHaveBeenCalledWith('testField', {
            ...mockField,
            required: { value: true, message: 'This field is required' },
            minLength: { value: 5, message: 'Minimum length is 5' },
            maxLength: { value: 10, message: 'Maximum length is 10' }
        });

        expect(getValidationOptions).toHaveBeenCalledWith(mockField, {
            required: 'This field is required',
            minLength: 'Minimum length is 5',
            maxLength: 'Maximum length is 10',
        });

        expect(result.current).toEqual({ name: 'testField', onChange: expect.any(Function) });
    });

    it('should handle undefined validation stats', () => {
        // Mock getValidationStats to return undefined
        (getValidationStats as jest.Mock).mockReturnValue(undefined);

        const mockGetDefaultMessages = jest.fn();
        (useGlobalContext as jest.Mock).mockReturnValue({
            getDefaultMessages: mockGetDefaultMessages
        });

        const nonValidatedField = {};

        // Act
        renderHook(() =>
            useFieldRegister(mockForm as any, 'testField', nonValidatedField)
        );

        // Assert
        expect(getValidationStats).toHaveBeenCalledWith(nonValidatedField);
        expect(mockForm.register).toHaveBeenCalledWith('testField', {});
    });
});
