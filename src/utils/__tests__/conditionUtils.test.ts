import { ConditionedRule } from '../../types';
import { evaluateCondition } from '../conditionUtils';

describe('evaluateCondition', () => {
    // Test for equal condition
    describe('equal condition', () => {
        it('should return true when field value equals condition value', () => {
            const condition = { when: 'field1', equal: 'value1' } as ConditionedRule<any>;
            const formValues = { field1: 'value1' };
            expect(evaluateCondition(condition, formValues)).toBe(true);
        });

        it('should return false when field value does not equal condition value', () => {
            const condition = { when: 'field1', equal: 'value1' } as ConditionedRule<any>;
            const formValues = { field1: 'value2' };
            expect(evaluateCondition(condition, formValues)).toBe(false);
        });

        it('should handle nested field paths', () => {
            const condition = { when: 'nested.field1', equal: 'value1' } as ConditionedRule<any>;
            const formValues = { nested: { field1: 'value1' } };
            expect(evaluateCondition(condition, formValues)).toBe(true);
        });
    });

    // Test for notEqual condition
    describe('notEqual condition', () => {
        it('should return true when field value does not equal condition value', () => {
            const condition = { when: 'field1', notEqual: 'value1' } as ConditionedRule<any>;
            const formValues = { field1: 'value2' };
            expect(evaluateCondition(condition, formValues)).toBe(true);
        });

        it('should return false when field value equals condition value', () => {
            const condition = { when: 'field1', notEqual: 'value1' } as ConditionedRule<any>;
            const formValues = { field1: 'value1' };
            expect(evaluateCondition(condition, formValues)).toBe(false);
        });
    });

    // Test for lessThan condition
    describe('lessThan condition', () => {
        it('should return true when field value is less than condition value', () => {
            const condition = { when: 'field1', lessThan: 10 } as ConditionedRule<any>;
            const formValues = { field1: 5 };
            expect(evaluateCondition(condition, formValues)).toBe(true);
        });

        it('should return false when field value is equal to condition value', () => {
            const condition = { when: 'field1', lessThan: 10 } as ConditionedRule<any>;
            const formValues = { field1: 10 };
            expect(evaluateCondition(condition, formValues)).toBe(false);
        });

        it('should return false when field value is greater than condition value', () => {
            const condition = { when: 'field1', lessThan: 10 } as ConditionedRule<any>;
            const formValues = { field1: 15 };
            expect(evaluateCondition(condition, formValues)).toBe(false);
        });
    });

    // Test for lessThanOrEqual condition
    describe('lessThanOrEqual condition', () => {
        it('should return true when field value is less than condition value', () => {
            const condition = { when: 'field1', lessThanOrEqual: 10 } as ConditionedRule<any>;
            const formValues = { field1: 5 };
            expect(evaluateCondition(condition, formValues)).toBe(true);
        });

        it('should return true when field value is equal to condition value', () => {
            const condition = { when: 'field1', lessThanOrEqual: 10 } as ConditionedRule<any>;
            const formValues = { field1: 10 };
            expect(evaluateCondition(condition, formValues)).toBe(true);
        });

        it('should return false when field value is greater than condition value', () => {
            const condition = { when: 'field1', lessThanOrEqual: 10 } as ConditionedRule<any>;
            const formValues = { field1: 15 };
            expect(evaluateCondition(condition, formValues)).toBe(false);
        });
    });

    // Test for greaterThan condition
    describe('greaterThan condition', () => {
        it('should return true when field value is greater than condition value', () => {
            const condition = { when: 'field1', greaterThan: 10 } as ConditionedRule<any>;
            const formValues = { field1: 15 };
            expect(evaluateCondition(condition, formValues)).toBe(true);
        });

        it('should return false when field value is equal to condition value', () => {
            const condition = { when: 'field1', greaterThan: 10 } as ConditionedRule<any>;
            const formValues = { field1: 10 };
            expect(evaluateCondition(condition, formValues)).toBe(false);
        });

        it('should return false when field value is less than condition value', () => {
            const condition = { when: 'field1', greaterThan: 10 } as ConditionedRule<any>;
            const formValues = { field1: 5 };
            expect(evaluateCondition(condition, formValues)).toBe(false);
        });
    });

    // Test for greaterThanOrEqual condition
    describe('greaterThanOrEqual condition', () => {
        it('should return true when field value is greater than condition value', () => {
            const condition = { when: 'field1', greaterThanOrEqual: 10 } as ConditionedRule<any>;
            const formValues = { field1: 15 };
            expect(evaluateCondition(condition, formValues)).toBe(true);
        });

        it('should return true when field value is equal to condition value', () => {
            const condition = { when: 'field1', greaterThanOrEqual: 10 } as ConditionedRule<any>;
            const formValues = { field1: 10 };
            expect(evaluateCondition(condition, formValues)).toBe(true);
        });

        it('should return false when field value is less than condition value', () => {
            const condition = { when: 'field1', greaterThanOrEqual: 10 } as ConditionedRule<any>;
            const formValues = { field1: 5 };
            expect(evaluateCondition(condition, formValues)).toBe(false);
        });
    });

    // Test for invalid condition
    describe('invalid condition', () => {
        it('should throw an error when condition type is invalid', () => {
            const condition = { when: 'field1' } as any;
            expect(() => evaluateCondition(condition, {})).toThrow('Invalid condition type');
        });
    });
});
