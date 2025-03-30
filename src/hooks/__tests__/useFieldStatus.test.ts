import { renderHook } from '@testing-library/react';
import { useFieldStatus } from '../useFieldStatus';
import { useWatch } from 'react-hook-form';
import { evaluateCondition } from '../../utils/conditionUtils';
import { ConditionedRule } from '../../types';

// Mock dependencies
jest.mock('react-hook-form', () => ({
    useWatch: jest.fn(),
}));

jest.mock('../../utils/conditionUtils', () => ({
    evaluateCondition: jest.fn(),
}));

describe('useFieldStatus', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should watch the correct field dependency', () => {
        const mockCondition: ConditionedRule<any> = {
            when: 'testField',
            equal: 'testValue',
        };

        (useWatch as jest.Mock).mockReturnValue(['mockValue']);
        (evaluateCondition as jest.Mock).mockReturnValue(true);

        renderHook(() => useFieldStatus(mockCondition));

        expect(useWatch).toHaveBeenCalledWith({
            name: ['testField'],
        });
    });

    it('should transform watched values correctly for condition evaluation', () => {
        const mockCondition: ConditionedRule<any> = {
            when: 'testField',
            equal: 'testValue',
        };

        (useWatch as jest.Mock).mockReturnValue(['mockValue']);
        (evaluateCondition as jest.Mock).mockReturnValue(true);

        renderHook(() => useFieldStatus(mockCondition));

        expect(evaluateCondition).toHaveBeenCalledWith(mockCondition, {
            testField: 'mockValue',
        });
    });

    it('should return isVisible: true when condition evaluates to true', () => {
        const mockCondition: ConditionedRule<any> = {
            when: 'testField',
            equal: 'testValue',
        };

        (useWatch as jest.Mock).mockReturnValue(['mockValue']);
        (evaluateCondition as jest.Mock).mockReturnValue(true);

        const { result } = renderHook(() => useFieldStatus(mockCondition));

        expect(result.current.isVisible).toBe(true);
    });

    it('should return isVisible: false when condition evaluates to false', () => {
        const mockCondition: ConditionedRule<any> = {
            when: 'testField',
            equal: 'testValue',
        };

        (useWatch as jest.Mock).mockReturnValue(['mockValue']);
        (evaluateCondition as jest.Mock).mockReturnValue(false);

        const { result } = renderHook(() => useFieldStatus(mockCondition));

        expect(result.current.isVisible).toBe(false);
    });
});
