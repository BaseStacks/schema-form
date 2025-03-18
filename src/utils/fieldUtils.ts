import { RegisterOptions } from 'react-hook-form';
import { DefaultMessages, ValidationStats } from '../types';

export const getValidationProps = (field: RegisterOptions<any>) => {
    const validationProps = Object.keys(field).filter(key => ['required', 'minLength', 'maxLength', 'pattern', 'format', 'minimum', 'maximum', 'multipleOf'].includes(key));
    if (!validationProps.length) return undefined;
    return validationProps.reduce((acc, key) => {
        acc[key] = field[key];
        return acc;
    }, {} as Record<string, any>);
};

export const getValidationStats = (field: RegisterOptions<any>): ValidationStats | undefined => {
    const validationProps = getValidationProps(field);

    if (!validationProps) return undefined;

    const validationStats: ValidationStats = {};

    for (const [key, validationSchema] of Object.entries(validationProps)) {
        if (typeof validationSchema === 'object') {
            validationStats[key] = validationSchema.value;
        }
        else {
            validationStats[key] = validationSchema;
        }
    }

    return {
        ...validationStats
    };
};


export const getValidationOptions = (field: RegisterOptions<any>, defaultMessages: DefaultMessages) => {
    const validationOptions = {};

    const validationProps = getValidationProps(field);
    for (const [key, value] of Object.entries(validationProps ?? {})) {
        if (typeof value == 'object') {
            validationOptions[key] = value;
        }
        else if (value !== null || value !== undefined) {
            validationOptions[key] = {
                value,
                message: defaultMessages[key]
            };
        }
    }
    return validationOptions;
};
