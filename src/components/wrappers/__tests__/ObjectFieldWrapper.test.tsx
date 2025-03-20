import { render, screen } from '@testing-library/react';
import { ObjectFieldWrapper } from '../ObjectFieldWrapper';
import { useFieldComponent } from '../../../hooks/useFieldComponent';
import { FieldWithObjectProps, ObjectFieldSchema } from '../../../types';
import { UseFormReturn } from 'react-hook-form';
import { SchemaFormFieldProps } from '../../SchemaFormField';

// Mock dependencies
jest.mock('../../../hooks/useFieldComponent', () => ({
    useFieldComponent: jest.fn(),
}));

describe('ObjectFieldWrapper', () => {
    const mockForm = {
        control: {},
        register: jest.fn(),
    } as any as UseFormReturn<any>;

    const mockField: ObjectFieldSchema = {
        type: 'object',
        title: 'Person',
        properties: {
            firstName: { type: 'string', title: 'First Name' },
            lastName: { type: 'string', title: 'Last Name' },
        },
    };

    const MockObjectComponent = jest.fn(({ schema: field, children }: FieldWithObjectProps) => (
        <div data-testid="object-component">
            <div data-testid="object-title">{field.title}</div>
            <div data-testid="object-children">{children}</div>
        </div>
    ));

    const mockRenderChild = jest.fn(({ name }) => (
        <div key={name} data-testid={`child-field-${name}`}>{name}</div>
    ));

    beforeEach(() => {
        jest.clearAllMocks();
        (useFieldComponent as jest.Mock).mockReturnValue(MockObjectComponent);
    });

    test('renders the object component with correct props', () => {
        render(
            <ObjectFieldWrapper
                form={mockForm}
                name="person"
                field={mockField}
                renderChild={mockRenderChild}
            />
        );

        expect(useFieldComponent).toHaveBeenCalledWith('object');
        expect(MockObjectComponent).toHaveBeenCalledWith(
            expect.objectContaining({
                schema: mockField,
                name: 'person'
            } as FieldWithObjectProps),
            undefined
        );
        expect(screen.getByTestId('object-component')).toBeInTheDocument();
        expect(screen.getByTestId('object-title')).toHaveTextContent('Person');
    });

    test('renders child fields using renderChild function', () => {
        render(
            <ObjectFieldWrapper
                form={mockForm as any}
                name="person"
                field={mockField}
                renderChild={mockRenderChild}
            />
        );

        expect(mockRenderChild).toHaveBeenCalledTimes(2);
        expect(screen.getByTestId('child-field-person.firstName')).toBeInTheDocument();
        expect(screen.getByTestId('child-field-person.lastName')).toBeInTheDocument();
    });

    test('passes render context to field component and child renderer', () => {
        const renderContext = { variant: 'outlined', size: 'small' };

        render(
            <ObjectFieldWrapper
                form={mockForm as any}
                name="person"
                field={mockField}
                renderContext={renderContext}
                renderChild={mockRenderChild}
            />
        );

        // Check that the component received the context
        expect(MockObjectComponent).toHaveBeenCalledWith(
            expect.objectContaining({
                renderContext: renderContext,
            }),
            undefined
        );

        // Check that each child field received the render context
        expect(mockRenderChild).toHaveBeenNthCalledWith(
            1,
            expect.objectContaining({
                name: 'person.firstName',
                renderContext: renderContext
            })
        );

        expect(mockRenderChild).toHaveBeenNthCalledWith(
            2,
            expect.objectContaining({
                name: 'person.lastName',
                renderContext: renderContext
            })
        );
    });

    it('renders the field component with properties', () => {
        // Arrange
        const mockForm = {} as UseFormReturn<any>;
        const mockField = {
            type: 'object',
            properties: {
                name: { type: 'string' },
                age: { type: 'number' },
            },
        } as ObjectFieldSchema;
        const mockRenderChild = jest.fn(({ name }: SchemaFormFieldProps) => <div key={name}>Child Field</div>);

        // Act
        render(
            <ObjectFieldWrapper
                form={mockForm}
                name="person"
                field={mockField}
                renderChild={mockRenderChild}
            />
        );

        // Assert
        expect(useFieldComponent).toHaveBeenCalledWith('object');
        expect(screen.getByTestId('object-component')).toBeInTheDocument();
        expect(mockRenderChild).toHaveBeenCalledTimes(2);
        expect(mockRenderChild.mock.calls).toEqual([
            [expect.objectContaining({ name: 'person.name' })],
            [expect.objectContaining({ name: 'person.age' })],
        ]
        );
    });

    it('passes context to children', () => {
        // Arrange
        const mockForm = {} as UseFormReturn<any>;
        const mockField = {
            type: 'object',
            properties: {
                name: { type: 'string' },
            },
        } as ObjectFieldSchema;
        const mockContext = { theme: 'dark' };
        const mockRenderChild = jest.fn(({ name }: SchemaFormFieldProps) => <div key={name}>Child Field</div>);

        // Act
        render(
            <ObjectFieldWrapper
                form={mockForm}
                name="person"
                field={mockField}
                renderContext={mockContext}
                renderChild={mockRenderChild}
            />
        );

        // Assert
        expect(mockRenderChild).toHaveBeenCalledWith(
            expect.objectContaining({
                name: 'person.name',
                renderContext: mockContext
            } as SchemaFormFieldProps)
        );
    });
});
