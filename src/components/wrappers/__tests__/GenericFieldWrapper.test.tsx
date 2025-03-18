import React from 'react';
import { render, screen } from '@testing-library/react';
import { GenericFieldWrapper } from '../GenericFieldWrapper';
import { useFieldComponent } from '../../../hooks/useFieldComponent';
import { useFieldRegister } from '../../../hooks/useFieldRegister';
import { UseFormReturn } from 'react-hook-form';

// Mock the hooks
jest.mock('../../../hooks/useFieldComponent', () => ({
    useFieldComponent: jest.fn(),
}));

jest.mock('../../../hooks/useFieldRegister', () => ({
    useFieldRegister: jest.fn(),
}));

describe('GenericFieldWrapper', () => {
    // Mock implementation setup
    const MockFieldComponent = React.forwardRef<HTMLInputElement>(() => {
        return (
            <div data-testid="generic-field" />
        );
    });

    const mockRegisterReturn = {
        onBlur: jest.fn(),
        onChange: jest.fn(),
        ref: jest.fn(),
    };

    beforeEach(() => {
        (useFieldComponent as jest.Mock).mockReturnValue(MockFieldComponent);
        (useFieldRegister as jest.Mock).mockReturnValue(mockRegisterReturn);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders the field component with correct props', () => {
        // Arrange
        const mockForm = {} as UseFormReturn<any>;
        const mockField = {
            type: 'text',
            title: 'Username',
            description: 'Enter your username',
            placeholder: 'John Doe',
        };
        const mockError = { type: 'required', message: 'This field is required' };

        // Act
        render(
            <GenericFieldWrapper
                form={mockForm}
                name="username"
                field={mockField}
                error={mockError}
            />
        );

        // Assert
        expect(useFieldComponent).toHaveBeenCalledWith('text');
        expect(useFieldRegister).toHaveBeenCalledWith(mockForm, 'username', mockField);
        expect(screen.getByTestId('generic-field')).toBeInTheDocument();
    });

    it('throws error when field component not found', () => {
        // Arrange
        (useFieldComponent as jest.Mock).mockReturnValue(null);
        const mockForm = {} as UseFormReturn<any>;
        const mockField = { type: 'nonexistent' };
        const consoleError = jest.spyOn(console, 'error').mockImplementation(() => { });

        // Act & Assert
        expect(() =>
            render(<GenericFieldWrapper form={mockForm} name="test" field={mockField} />)
        ).toThrow('Field component not found for type: nonexistent');

        consoleError.mockRestore();
    });
});
