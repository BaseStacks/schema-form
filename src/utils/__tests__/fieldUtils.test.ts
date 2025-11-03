import { getValidationProps, getValidationStats, getValidationRules, resolveSchemaPath, processValidationRule } from '../fieldUtils';
import { RegisterOptions } from 'react-hook-form';
import { DefaultMessages } from '../../types';

describe('fieldUtils', () => {
    describe('getValidationProps', () => {
        it('should extract validation properties from a field object', () => {
            const field = {
                required: true,
                minLength: 5,
                maxLength: 10,
                pattern: /[a-z]+/,
                someOtherProp: 'value'
            } as RegisterOptions<any>;

            const result = getValidationProps(field);

            expect(result).toEqual({
                required: true,
                minLength: 5,
                maxLength: 10,
                pattern: /[a-z]+/
            });
        });

        it('should return undefined if no validation properties exist', () => {
            const field = {
                someOtherProp: 'value'
            };

            const result = getValidationProps(field as any);

            expect(result).toBeUndefined();
        });
    });

    describe('getValidationStats', () => {
        it('should transform validation properties into validation stats with simple values', () => {
            const field: RegisterOptions<any> = {
                required: true,
                minLength: 5,
                maxLength: 10
            };

            const result = getValidationStats(field);

            expect(result).toEqual({
                required: true,
                minLength: 5,
                maxLength: 10
            });
        });

        it('should transform validation properties into validation stats with object values', () => {
            const field = {
                required: { value: true, message: 'This field is required' },
                minLength: { value: 5, message: 'Minimum length is 5' }
            };

            const result = getValidationStats(field);

            expect(result).toEqual({
                required: true,
                minLength: 5
            });
        });

        it('should return undefined if no validation properties exist', () => {
            const field = {
                someOtherProp: 'value'
            } as RegisterOptions<any>;

            const result = getValidationStats(field);

            expect(result).toBeUndefined();
        });

        it('extracts required validation rule correctly', () => {
            const rules = { required: 'This field is required' };
            const stats = getValidationStats(rules);

            expect(stats).toHaveProperty('required', 'This field is required');
        });

        it('extracts min validation rule correctly', () => {
            const rules = { min: 5 };
            const stats = getValidationStats(rules);

            expect(stats).toHaveProperty('min', 5);
        });

        it('extracts max validation rule correctly', () => {
            const rules = { max: 100 };
            const stats = getValidationStats(rules);

            expect(stats).toHaveProperty('max', 100);
        });

        it('extracts minLength validation rule correctly', () => {
            const rules = { minLength: 3 };
            const stats = getValidationStats(rules);

            expect(stats).toHaveProperty('minLength', 3);
        });

        it('extracts maxLength validation rule correctly', () => {
            const rules = { maxLength: 50 };
            const stats = getValidationStats(rules);

            expect(stats).toHaveProperty('maxLength', 50);
        });

        it('extracts pattern validation rule correctly', () => {
            const pattern = /^[A-Z]+$/;
            const rules = { pattern };
            const stats = getValidationStats(rules);

            expect(stats).toHaveProperty('pattern', pattern);
        });

        it('handles multiple validation rules correctly', () => {
            const pattern = /^\d+$/;
            const rules = {
                required: true,
                min: 1,
                max: 100,
                minLength: 1,
                maxLength: 10,
                pattern
            };

            const stats = getValidationStats(rules);

            expect(stats).toEqual({
                required: true,
                min: 1,
                max: 100,
                minLength: 1,
                maxLength: 10,
                pattern
            });
        });

        it('returns empty object for undefined rules', () => {
            const stats = getValidationStats(undefined!);
            expect(stats).toEqual(undefined);
        });

        it('returns empty object for empty rules', () => {
            const stats = getValidationStats({});
            expect(stats).toEqual(undefined);
        });
    });

    describe('resolveSchemaPath', () => {
        it('should resolve a simple path with no arrays', () => {
            expect(resolveSchemaPath(['user', 'name'])).toEqual('user.properties.name');
        });

        it('should resolve a path with an array item', () => {
            expect(resolveSchemaPath(['users[0]'])).toEqual('users.items');
        });

        it('should resolve a complex path with multiple parts and arrays', () => {
            expect(resolveSchemaPath(['user', 'addresses[0]', 'street'])).toEqual('user.properties.addresses.items.properties.street');
        });

        it('should handle multiple array notations correctly', () => {
            expect(resolveSchemaPath(['users[0]', 'friends[0]', 'name'])).toEqual('users.items.properties.friends.items.properties.name');
        });

        it('should work with a single property', () => {
            expect(resolveSchemaPath(['name'])).toEqual('name');
        });

    });

    describe('processValidationRule', () => {
        it('should return null for null or undefined rules', () => {
            expect(processValidationRule('required', null)).toBe(null);
            expect(processValidationRule('minLength', undefined)).toBe(null);
        });

        it('should return rule as is for validate key', () => {
            const validateFn = () => true;
            expect(processValidationRule('validate', validateFn)).toBe(validateFn);
        });

        it('should handle required as string', () => {
            expect(processValidationRule('required', 'Field is required')).toBe('Field is required');
        });

        it('should handle required as boolean with default message', () => {
            const defaultMessages = { required: 'This field is required' };
            expect(processValidationRule('required', true, defaultMessages)).toBe('This field is required');
        });

        it('should handle required as boolean without default message', () => {
            expect(processValidationRule('required', true)).toBe(true);
        });

        it('should handle required as false', () => {
            expect(processValidationRule('required', false)).toBe(false);
        });

        it('should return object rules as is', () => {
            const rule = { value: 5, message: 'Custom message' };
            expect(processValidationRule('minLength', rule)).toBe(rule);
        });

        it('should transform primitive rules with default messages', () => {
            const defaultMessages = { minLength: 'Min length error' };
            expect(processValidationRule('minLength', 5, defaultMessages)).toEqual({
                value: 5,
                message: 'Min length error'
            });
        });

        it('should transform primitive rules without default messages', () => {
            expect(processValidationRule('minLength', 5)).toEqual(5);
        });
    });

    describe('getValidationRules', () => {
        it('should return object with empty stats when no validation properties exist', () => {
            const field = {
                someOtherProp: 'value'
            };

            const result = getValidationRules(field as any);

            expect(result).toEqual({ stats: {} });
        });

        it('should process validation rules with primitive values', () => {
            const field = {
                required: true,
                minLength: 5,
                maxLength: 10
            };

            const result = getValidationRules(field);

            expect(result).toEqual({
                required: true,
                minLength: 5,
                maxLength: 10,
                stats: {
                    required: true,
                    minLength: 5,
                    maxLength: 10
                }
            });
        });

        it('should process validation rules with object values', () => {
            const field = {
                minLength: { value: 5, message: 'Min length is 5' }
            };

            const result = getValidationRules(field);

            expect(result).toEqual({
                minLength: { value: 5, message: 'Min length is 5' },
                stats: {
                    minLength: 5
                }
            });
        });

        it('should apply default messages when provided', () => {
            const field = {
                required: true,
                minLength: 5
            };

            const defaultMessages: DefaultMessages = {
                required: 'Field is required',
                minLength: 'Min length is not met'
            };

            const result = getValidationRules(field, defaultMessages);

            expect(result).toEqual({
                required: 'Field is required',
                minLength: { value: 5, message: 'Min length is not met' },
                stats: {
                    required: true,
                    minLength: 5
                }
            });
        });

        it('should handle RegExp pattern correctly', () => {
            const pattern = /^[A-Z]+$/;
            const field = {
                pattern
            };

            const result = getValidationRules(field);

            expect(result).toEqual({
                pattern: pattern,
                stats: { pattern }
            });
        });

        it('should handle validate function correctly', () => {
            const validateFn = () => true;
            const field = {
                validate: validateFn
            };

            const result = getValidationRules(field);

            expect(result).toEqual({
                validate: validateFn,
                stats: { validate: validateFn }
            });
        });
    });
});
