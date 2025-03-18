import { FieldValues } from 'react-hook-form';
import { ConditionedRule } from '../types';

export function evaluateCondition<T extends FieldValues = FieldValues>(
    condition: ConditionedRule<T> | undefined,
    formValues: T
): boolean {
    if (condition === undefined) return true;
    if (condition === true) return true;
    if (condition === false) return false;

    // If condition is a function, call it directly with form values
    if (typeof condition === 'function') {
        return condition(formValues);
    }

    throw new Error('Invalid condition type');
}
