import { FieldValues } from 'react-hook-form';
import { BaseFieldSchema } from '../types';
import { evaluateCondition } from '../utils/conditionUtils';

export type FieldStatus = {
    isVisible: boolean;
    isReadOnly: boolean;
    isDisabled: boolean;
};

export const useFieldStatus = <TFormValue extends FieldValues>(field: BaseFieldSchema, formValues: TFormValue): FieldStatus => {
    // First check if field should be visible
    const isVisible = evaluateCondition(field.visible, formValues);

    // If not visible, return default state
    if (!isVisible) {
        return {
            isVisible: false,
            isReadOnly: false,
            isDisabled: false
        };
    }

    // Only evaluate other conditions if field is visible
    const isReadOnly = field.readOnly ? evaluateCondition(field.readOnly, formValues) : false;
    const isDisabled = field.disabled ? evaluateCondition(field.disabled, formValues) : false;

    return {
        isVisible: true,
        isReadOnly,
        isDisabled
    };
};
