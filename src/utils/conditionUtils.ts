import { FieldValues, get } from 'react-hook-form';
import { ConditionedRule } from '../types';

export function evaluateCondition<TFormValue extends FieldValues = FieldValues>(
    condition: ConditionedRule<TFormValue>,
    formValues: Partial<TFormValue>,
): boolean {
    const depsField = condition.when;
    const depsValue = get(formValues, depsField);

    if ('equal' in condition) {
        return depsValue === condition.equal;
    }

    if ('notEqual' in condition) {
        return depsValue !== condition.notEqual;
    }

    if ('lessThan' in condition) {
        return depsValue < condition.lessThan;
    }

    if ('lessThanOrEqual' in condition) {
        return depsValue <= condition.lessThanOrEqual;
    }

    if ('greaterThan' in condition) {
        return depsValue > condition.greaterThan;
    }

    if ('greaterThanOrEqual' in condition) {
        return depsValue >= condition.greaterThanOrEqual;
    }

    throw new Error('Invalid condition type');
}
