import { getValidationProps, getValidationStats, getValidationRules } from '../fieldUtils';
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

        test('extracts required validation rule correctly', () => {
            const rules = { required: 'This field is required' };
            const stats = getValidationStats(rules);
            
            expect(stats).toHaveProperty('required', 'This field is required');
        });
    
        test('extracts min validation rule correctly', () => {
            const rules = { min: 5 };
            const stats = getValidationStats(rules);
            
            expect(stats).toHaveProperty('min', 5);
        });
    
        test('extracts max validation rule correctly', () => {
            const rules = { max: 100 };
            const stats = getValidationStats(rules);
            
            expect(stats).toHaveProperty('max', 100);
        });
    
        test('extracts minLength validation rule correctly', () => {
            const rules = { minLength: 3 };
            const stats = getValidationStats(rules);
            
            expect(stats).toHaveProperty('minLength', 3);
        });
    
        test('extracts maxLength validation rule correctly', () => {
            const rules = { maxLength: 50 };
            const stats = getValidationStats(rules);
            
            expect(stats).toHaveProperty('maxLength', 50);
        });
    
        test('extracts pattern validation rule correctly', () => {
            const pattern = /^[A-Z]+$/;
            const rules = { pattern };
            const stats = getValidationStats(rules);
            
            expect(stats).toHaveProperty('pattern', pattern);
        });
    
        test('handles multiple validation rules correctly', () => {
            const pattern = /^[0-9]+$/;
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
    
        test('returns empty object for undefined rules', () => {
            const stats = getValidationStats(undefined!);
            expect(stats).toEqual(undefined);
        });
    
        test('returns empty object for empty rules', () => {
            const stats = getValidationStats({});
            expect(stats).toEqual(undefined);
        });
    });

    describe('getValidationOptions', () => {
        it('should transform primitive validation properties into objects with default messages', () => {
            const field: RegisterOptions<any> = {
                required: true,
                minLength: 5,
                maxLength: 10
            };

            const defaultMessages: DefaultMessages = {
                required: 'This field is required',
                minLength: 'Minimum length not met',
                maxLength: 'Maximum length exceeded'
            };

            const result = getValidationRules(field, defaultMessages);

            expect(result).toEqual({
                required: 'This field is required',
                minLength: { value: 5, message: 'Minimum length not met' },
                maxLength: { value: 10, message: 'Maximum length exceeded' }
            });
        });

        it('should keep validation properties that are already objects', () => {
            const customMessage = 'Please enter a valid pattern';
            const pattern = /[a-z]+/;

            const field: RegisterOptions<any> = {
                required: 'Required field',
                pattern: { value: pattern, message: customMessage }
            };

            const defaultMessages: DefaultMessages = {
                required: 'This field is required',
                pattern: 'Invalid pattern'
            };

            const result = getValidationRules(field, defaultMessages);

            expect(result).toEqual({
                required: 'Required field',
                pattern: { value: pattern, message: customMessage }
            });
        });

        it('should return an empty object if no validation properties exist', () => {
            const field = {
                someOtherProp: 'value'
            } as RegisterOptions<any>;

            const defaultMessages: DefaultMessages = {
                required: 'This field is required'
            };

            const result = getValidationRules(field, defaultMessages);

            expect(result).toEqual({});
        });
    });
});
