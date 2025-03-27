import { renderHook } from '@testing-library/react';
import { useFieldStatus } from './useFieldStatus';
import { evaluateCondition } from '../utils/conditionUtils';
import { BaseFieldSchema } from '../types';

// Mock the evaluateCondition utility function
jest.mock('../utils/conditionUtils', () => ({
    evaluateCondition: jest.fn(),
}));

const mockedEvaluateCondition = evaluateCondition as jest.MockedFunction<typeof evaluateCondition>;

describe('useFieldStatus', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return isVisible: true when condition evaluates to true', () => {
        // Setup
        const field: BaseFieldSchema = { visible: true };
        const formValues = { someValue: 'test' };
        mockedEvaluateCondition.mockReturnValue(true);

        // Execute
        const { result } = renderHook(() => useFieldStatus(field, formValues));

        // Assert
        expect(mockedEvaluateCondition).toHaveBeenCalledWith(true, formValues);
        expect(result.current).toEqual({ isVisible: true });
    });

    it('should return isVisible: false when condition evaluates to false', () => {
        // Setup
        const field: BaseFieldSchema = { visible: false };
        const formValues = { someValue: 'test' };
        mockedEvaluateCondition.mockReturnValue(false);

        // Execute
        const { result } = renderHook(() => useFieldStatus(field, formValues));

        // Assert
        expect(mockedEvaluateCondition).toHaveBeenCalledWith(false, formValues);
        expect(result.current).toEqual({ isVisible: false });
    });
});
