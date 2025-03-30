import { FieldPath, FieldValues, useWatch } from 'react-hook-form';
import { ConditionedRule } from '../types';
import { evaluateCondition } from '../utils/conditionUtils';

export type FieldStatus = {
    readonly isVisible: boolean;
};

export const useFieldStatus = <TFormValue extends FieldValues>(condition: ConditionedRule<TFormValue>): FieldStatus => {
    const depsKeys: FieldPath<TFormValue>[] = [condition.when];

    const formValues = useWatch({
        name: depsKeys,
    });

    const depsValues = depsKeys.reduce((acc, key, index) => {
        acc[key] = formValues[index];
        return acc;
    }, {} as TFormValue);

    const isVisible = evaluateCondition(condition, depsValues);

    return {
        isVisible
    };
};
