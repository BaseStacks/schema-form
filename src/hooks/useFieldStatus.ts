import { FieldValues } from 'react-hook-form';
import { BaseFieldSchema } from '../types';
import { evaluateCondition } from '../utils/conditionUtils';

export type FieldStatus = {
    readonly isVisible: boolean;
};

export const useFieldStatus = <TFormValue extends FieldValues>(field: BaseFieldSchema, formValues: TFormValue): FieldStatus => {
    // First check if field should be visible
    const isVisible = evaluateCondition(field.visible, formValues);

    // If not visible, return default state
    if (!isVisible) {
        return {
            isVisible: false
        };
    }

    return {
        isVisible: true
    };
};
