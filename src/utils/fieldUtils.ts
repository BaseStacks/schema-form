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

export const processValidationRule = (key: string, rule: any, defaultMessages?: DefaultMessages) => {
    if (rule === null || rule === undefined) {
        return null;
    }

    if (key === 'validate') {
        return rule;
    }

    if (key === 'required') {
        if(typeof rule === 'string') {
            return rule;
        }
        if(rule === true) {
            return defaultMessages?.required ?? true;
        }

        return false;
    }

    if (typeof rule === 'object') {
        return rule;
    }

    return {
        value: rule,
        message: defaultMessages?.[key as keyof DefaultMessages]
    };
};

export const getValidationRules = (field: FieldSchemaType<any, any>, defaultMessages?: DefaultMessages) => {
    const validationRules: Record<string, any> = {};
    const validationProps = getValidationProps(field);

    if (!validationProps) {
        return { stats: {} } as ValidationRules;
    }

    Object.entries(validationProps).forEach(([key, rule]) => {
        const processedRule = processValidationRule(key, rule, defaultMessages);
        if (processedRule !== null) {
            validationRules[key] = processedRule;
        }
    });

    const stats = getValidationStats(field);

    return {
        ...validationRules,
        stats,
    } as ValidationRules;
};

// Pure function to resolve field path that can be tested independently
export const resolveSchemaPath = (pathParts: string[]): string => {
    const pathItems: string[] = [];

    pathParts.forEach((pathPart) => {
        const isArrayItem = pathPart.endsWith(']');
        const arrayName = isArrayItem ? pathPart.split('[')[0] : pathPart;
        const parentPrefix = pathItems.length > 0 ? 'properties.' : '';

        const name = isArrayItem
            ? `${parentPrefix}${arrayName}.items`
            : `${parentPrefix}${pathPart}`;

        pathItems.push(name);
    });

    return pathItems.join('.');
};
