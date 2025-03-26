import { RegisterOptions } from 'react-hook-form';
import { DefaultMessages, ValidationRules, ValidationStats } from '../types';

const validationKeys: (keyof ValidationRules)[] = ['required', 'minLength', 'maxLength', 'pattern', 'min', 'max'];

export const getValidationProps = (field: RegisterOptions<any>) => {
    const validationPropKeys = Object.keys(field).filter(key => (validationKeys as string[]).includes(key));
    if (!validationPropKeys.length) return undefined;
    return validationPropKeys.reduce((acc, key) => {
        acc[key] = field[key];
        return acc;
    }, {} as ValidationRules);
};

export const getValidationStats = (field: RegisterOptions<any>): ValidationStats | undefined => {
    const validationProps = getValidationProps(field);

    if (!validationProps) return {};

    const validationStats = Object.entries(validationProps).reduce((acc, [key, rule]) => {
        if (rule instanceof RegExp) {
            acc[key] = rule;
        }
        else if (typeof rule === 'object') {
            acc[key] = rule.value;
        }
        else if (key === 'required') {
            acc[key] = !!rule;
        }
        else {
            acc[key] = rule;
        }
        return acc;
    }, {});

    return validationStats;
};

export const getValidationRules = (field: RegisterOptions<any>, defaultMessages?: DefaultMessages) => {
    const validationRules: ValidationRules = {};

    const validationProps = getValidationProps(field);
    for (const [key, value] of Object.entries(validationProps ?? {})) {
        if (typeof value == 'object') {
            validationRules[key] = value;
        }
        else if (value !== null || value !== undefined) {
            validationRules[key] = {
                value,
                message: defaultMessages?.[key]
            };
        }
    }
    return validationRules;
};
