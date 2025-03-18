import { evaluateCondition } from '../conditionUtils';
import { ConditionedRule } from '../../types';

describe('conditionUtils', () => {
    describe('evaluateCondition function', () => {
        const formValues = {
            name: 'John',
            age: 30,
            roles: ['admin', 'user'],
            active: true,
            postal: '12345'
        };

        it('should return true when condition is undefined', () => {
            expect(evaluateCondition(undefined, formValues)).toBe(true);
        });

        it('should return true/false when condition is a boolean', () => {
            expect(evaluateCondition(true, formValues)).toBe(true);
            expect(evaluateCondition(false, formValues)).toBe(false);
        });

        it('should evaluate function conditions', () => {
            const trueCondition: ConditionedRule = (values) => values.age > 25;
            const falseCondition: ConditionedRule = (values) => values.age < 25;

            expect(evaluateCondition(trueCondition, formValues)).toBe(true);
            expect(evaluateCondition(falseCondition, formValues)).toBe(false);
        });

        it('should throw error when condition is invalid', () => {
            expect(() => evaluateCondition('invalid' as any, formValues)).toThrow();
        });
    });
});
