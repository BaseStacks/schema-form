import { RegisterOptions } from 'react-hook-form';
import { DefaultMessages, ValidationRules, ValidationStats } from '../types';

const validationKeys: (keyof ValidationRules)[] = ['required', 'minLength', 'maxLength', 'pattern', 'min', 'max'];

export const getValidationProps = (field: RegisterOptions<any>) => {
    const validationProps = Object.keys(field).filter(key => (validationKeys as string[]).includes(key));
    if (!validationProps.length) return undefined;
    return validationProps.reduce((acc, key) => {
        acc[key] = field[key];
        return acc;
    }, {} as ValidationRules);
};

export const getValidationStats = (field: RegisterOptions<any>): ValidationStats | undefined => {
    const validationProps = getValidationProps(field);

    if (!validationProps) return {};

    const validationStats = Object.entries(validationProps).reduce((acc, [key, rule]) => {
        if (rule instanceof RegExp) {
            acc.set(key, rule);
        }
        else if (typeof rule === 'object') {
            acc.set(key, rule.value);
        }
        else if (key === 'required') {
            acc[key] = !!rule;
        }
        else {
            acc[key] = rule;
        }
        return acc;
    }, new Map<string, any>());

    return Object.fromEntries(validationStats) as ValidationStats;
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
