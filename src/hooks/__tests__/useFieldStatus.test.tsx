import { renderHook } from '@testing-library/react';
import { useFieldStatus } from '../useFieldStatus';
import { BaseFieldSchema } from '../../types';
import * as conditionUtils from '../../utils/conditionUtils';

// Mock the condition utils
jest.mock('../../utils/conditionUtils');
const mockedEvaluateCondition = conditionUtils.evaluateCondition as jest.Mock;

describe('useFieldStatus', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return field as not visible when visible condition evaluates to false', () => {
        // Arrange
        mockedEvaluateCondition.mockReturnValueOnce(false);
        const field: BaseFieldSchema = {
            visible: () => false
        };
        const formValues = {};

        // Act
        const { result } = renderHook(() => useFieldStatus(field, formValues));

        // Assert
        expect(result.current).toEqual({
            isVisible: false,
            isReadOnly: false,
            isDisabled: false
        });
        expect(mockedEvaluateCondition).toHaveBeenCalledTimes(1);
        expect(mockedEvaluateCondition).toHaveBeenCalledWith(field.visible, formValues);
    });

    it('should return field as visible, with readOnly and disabled evaluated when visible', () => {
        // Arrange
        mockedEvaluateCondition
            .mockReturnValueOnce(true)  // visible condition
            .mockReturnValueOnce(true)  // readOnly condition
            .mockReturnValueOnce(false); // disabled condition

        const field: BaseFieldSchema = {
            visible: () => true,
            readOnly: () => true,
            disabled: () => false
        };
        const formValues = {};

        // Act
        const { result } = renderHook(() => useFieldStatus(field, formValues));

        // Assert
        expect(result.current).toEqual({
            isVisible: true,
            isReadOnly: true,
            isDisabled: false
        });
        expect(mockedEvaluateCondition).toHaveBeenCalledTimes(3);
    });

    it('should handle undefined readOnly and disabled properties', () => {
        // Arrange
        mockedEvaluateCondition.mockReturnValueOnce(true); // visible condition

        const field: BaseFieldSchema = {
            visible: true
        };
        const formValues = {};

        // Act
        const { result } = renderHook(() => useFieldStatus(field, formValues));

        // Assert
        expect(result.current).toEqual({
            isVisible: true,
            isReadOnly: false,
            isDisabled: false
        });
        expect(mockedEvaluateCondition).toHaveBeenCalledTimes(1);
    });
});
