import { getValidationProps, getValidationStats, getValidationOptions } from '../fieldUtils';
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

            const result = getValidationOptions(field, defaultMessages);

            expect(result).toEqual({
                required: { value: true, message: 'This field is required' },
                minLength: { value: 5, message: 'Minimum length not met' },
                maxLength: { value: 10, message: 'Maximum length exceeded' }
            });
        });

        it('should keep validation properties that are already objects', () => {
            const customMessage = 'Please enter a valid pattern';
            const pattern = /[a-z]+/;

            const field: RegisterOptions<any> = {
                required: { value: true, message: 'Required field' },
                pattern: { value: pattern, message: customMessage }
            };

            const defaultMessages: DefaultMessages = {
                required: 'This field is required',
                pattern: 'Invalid pattern'
            };

            const result = getValidationOptions(field, defaultMessages);

            expect(result).toEqual({
                required: { value: true, message: 'Required field' },
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

            const result = getValidationOptions(field, defaultMessages);

            expect(result).toEqual({});
        });
    });
});
