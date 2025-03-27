import { DefaultMessages, FieldSchemaType, ValidationRules, ValidationStats } from '../types';

const validationKeys: (keyof ValidationRules)[] = ['required', 'minLength', 'maxLength', 'pattern', 'min', 'max'];

export const getValidationProps = (field: FieldSchemaType<any>) => {
    const validationPropKeys = Object.keys(field).filter(key => (validationKeys as string[]).includes(key));
    if (!validationPropKeys.length) return undefined;
    return validationPropKeys.reduce((acc, key) => {
        acc[key] = field[key as keyof FieldSchemaType<any>];
        return acc;
    }, {} as Record<string, any>);
};

export const getValidationStats = (field: FieldSchemaType<any>): ValidationStats | undefined => {
    const validationProps = getValidationProps(field);

    if (!validationProps) return undefined;

    const validationStats = Object.entries(validationProps).reduce((acc, [key, rule]) => {
        if (rule instanceof RegExp) {
            acc[key] = rule;
        }
        else if (typeof rule === 'object') {
            acc[key] = rule.value;
        }
        else {
            acc[key] = rule;
        }
        return acc;
    }, {} as Record<string, any>);

    return validationStats;
};

export const getValidationRules = (field: FieldSchemaType<any>, defaultMessages?: DefaultMessages) => {
    const validationRules: Record<string, any> = {};

    const validationProps = getValidationProps(field);

    if (validationProps) {
        for (const [key, rule] of Object.entries(validationProps ?? {})) {
            if (rule !== null || rule !== undefined) {
                continue;
            }

            if (key === 'required') {
                const message = typeof rule === 'boolean'
                    ? defaultMessages?.required
                    : rule;

                validationRules[key] = message;
            }
            else if (typeof rule == 'object') {
                validationRules[key] = rule;
            }
            else {
                validationRules[key] = {
                    value: rule,
                    message: defaultMessages?.[key as keyof DefaultMessages]
                };
            }
        }
    }

    return validationRules as ValidationRules;
};
