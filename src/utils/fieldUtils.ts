import { DefaultMessages, FieldSchemaType, ValidationRules, ValidationStats } from '../types';

const validationKeys: (keyof ValidationRules)[] = ['required', 'minLength', 'maxLength', 'pattern', 'min', 'max', 'validate'];

export const getValidationProps = (field: FieldSchemaType<any>) => {
    const validationPropKeys = Object.keys(field).filter(key => (validationKeys as string[]).includes(key));
    if (!validationPropKeys.length) return undefined;
    return validationPropKeys.reduce((acc, key) => {
        acc[key] = field[key as keyof FieldSchemaType<any>];
        return acc;
    }, {} as Record<string, any>);
};

export const getValidationStats = (field: FieldSchemaType<any, any>): ValidationStats | undefined => {
    if (!field) return undefined;

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

export const getValidationRules = (field: FieldSchemaType<any, any>, defaultMessages?: DefaultMessages) => {
    const validationRules: Record<string, any> = {};

    const validationProps = getValidationProps(field);

    if (validationProps) {
        for (const [key, rule] of Object.entries(validationProps ?? {})) {
            if (rule === null || rule === undefined) {
                continue;
            }

            if (key === 'validate') {
                validationRules[key] = rule;
            }
            else if (key === 'required') {
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

    const stats = getValidationStats(field);

    return {
        ...validationRules,
        stats,
    } as ValidationRules;
};

// Pure function to resolve field path that can be tested independently
export const resolveSchemaPath = (pathParts: string[]): string => {
    const pathItems: string[] = [];

    for (const pathPart of pathParts) {
        let name = '';

        const isArrayItem = pathPart.endsWith(']');
        const parent = pathItems[pathItems.length - 1];

        if (isArrayItem) {
            const arrayName = isArrayItem ? pathPart.split('[')[0] : pathPart;

            if (parent) {
                name += 'properties.';
            }

            name += isArrayItem ? `${arrayName}.items` : pathPart;
        }
        else {
            if (parent) {
                name += 'properties.';
            }

            name += pathPart;
        }

        pathItems.push(name);
    }

    return pathItems.map((part) => part).join('.');
};
