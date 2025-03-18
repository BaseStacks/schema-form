import React from 'react';
import { render, screen } from '@testing-library/react';
import { CustomFieldWrapper } from '../CustomFieldWrapper';
import { useFieldRegister } from '../../../hooks/useFieldRegister';
import { UseFormReturn } from 'react-hook-form';
import { CustomFieldSchema } from '../../../types';

// Mock the hook
jest.mock('../../../hooks/useFieldRegister', () => ({
    useFieldRegister: jest.fn(),
}));

describe('CustomFieldWrapper', () => {
    // Mock custom component
    const MockCustomComponent = jest.fn(() => <div data-testid="custom-component" />);

    const mockRegisterReturn = {
        onBlur: jest.fn(),
        onChange: jest.fn(),
        ref: jest.fn(),
    };

    beforeEach(() => {
        (useFieldRegister as jest.Mock).mockReturnValue(mockRegisterReturn);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders the custom component with correct props', () => {
        // Arrange
        const mockForm = {} as UseFormReturn<any>;
        const mockField: CustomFieldSchema = {
            Component: MockCustomComponent,
            title: 'Custom Field',
            description: 'This is a custom field',
            placeholder: 'Enter value',
            options: [{ label: 'Option 1', value: '1' }],
        };
        const mockError = { type: 'required', message: 'This field is required' };
        const mockContext = { theme: 'light' };

        // Act
        render(
            <CustomFieldWrapper
                form={mockForm}
                name="customField"
                field={mockField}
                readOnly={true}
                disabled={true}
                error={mockError}
                context={mockContext}
            />
        );

        // Assert
        expect(useFieldRegister).toHaveBeenCalledWith(mockForm, 'customField', mockField);

        const component = screen.getByTestId('custom-component');
        expect(component).toBeInTheDocument();

        expect(MockCustomComponent).toHaveBeenCalledWith(
            expect.objectContaining({
                title: 'Custom Field',
                description: 'This is a custom field',
                placeholder: 'Enter value',
                options: [{ label: 'Option 1', value: '1' }],
            }),
            undefined
        );
    });

    it('passes field registration handlers to custom component', () => {
        // Arrange
        const mockForm = {} as UseFormReturn<any>;
        const mockField: CustomFieldSchema = {
            Component: MockCustomComponent,
        };

        // Act
        render(
            <CustomFieldWrapper
                form={mockForm}
                name="customField"
                field={mockField}
            />
        );

        // Assert
        expect(MockCustomComponent).toHaveBeenCalledWith(
            expect.objectContaining({
                ref: mockRegisterReturn.ref,
                name: 'customField',
                onBlur: mockRegisterReturn.onBlur,
                onChange: mockRegisterReturn.onChange,
            }),
            undefined
        );
    });
});
