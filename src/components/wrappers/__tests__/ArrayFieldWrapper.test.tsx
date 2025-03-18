import { render, screen } from '@testing-library/react';
import { ArrayFieldWrapper } from '../ArrayFieldWrapper';
import { useFieldComponent } from '../../../hooks/useFieldComponent';
import { useFieldArray, UseFormReturn } from 'react-hook-form';
import { ArrayFieldSchema } from '../../../types';
import { SchemaFormFieldProps } from '../../SchemaFormField';

// Mock the hooks
jest.mock('../../../hooks/useFieldComponent', () => ({
    useFieldComponent: jest.fn(),
}));

jest.mock('react-hook-form', () => ({
    ...jest.requireActual('react-hook-form'),
    useFieldArray: jest.fn(),
}));

describe('ArrayFieldWrapper', () => {
    // Mock implementation setup
    const MockArrayComponent = ({
        renderItem,
        canAddItem,
        canRemoveItem,
        ...props
    }: any) => (
        <div data-testid="array-field" data-can-add={canAddItem} data-can-remove={canRemoveItem}>
            <div data-testid="array-props">{JSON.stringify(props)}</div>
            <div data-testid="array-items">
                {[0, 1, 2].map((index) => (
                    <div key={index} data-testid={`item-${index}`}>
                        {renderItem(index)}
                    </div>
                ))}
            </div>
        </div>
    );

    const mockFieldArray = {
        fields: [{ id: '1' }, { id: '2' }, { id: '3' }],
        append: jest.fn(),
        remove: jest.fn(),
        move: jest.fn(),
    };

    beforeEach(() => {
        (useFieldComponent as jest.Mock).mockReturnValue(MockArrayComponent);
        (useFieldArray as jest.Mock).mockReturnValue(mockFieldArray);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders the array field component with items', () => {
        // Arrange
        const mockForm = {
            control: {},
        } as unknown as UseFormReturn<any>;

        const mockField: ArrayFieldSchema = {
            type: 'array',
            title: 'Items',
            description: 'List of items',
            minLength: 1,
            maxLength: 5,
            required: true,
            items: {
                type: 'object',
                properties: {
                    name: { type: 'string', title: 'Name' },
                },
            }
        };

        const mockRenderChild = jest.fn(({ name }) => <div>Item: {name}</div>);

        // Act
        render(
            <ArrayFieldWrapper
                form={mockForm}
                name="items"
                field={mockField}
                renderChild={mockRenderChild}
            />
        );

        // Assert
        expect(useFieldComponent).toHaveBeenCalledWith('array');
        expect(useFieldArray).toHaveBeenCalledWith({
            control: mockForm.control,
            name: 'items',
            rules: {
                minLength: 1,
                maxLength: 5,
                required: true,
                validate: undefined,
            },
        });

        expect(screen.getByTestId('array-field')).toBeInTheDocument();
        expect(mockRenderChild).toHaveBeenCalledTimes(3);
        expect(mockRenderChild).toHaveBeenCalledWith(
            expect.objectContaining({ name: 'items[0]' })
        );
    });

    it('correctly determines canAddItem and canRemoveItem based on constraints', () => {
        // Arrange
        const mockForm = {
            control: {},
        } as unknown as UseFormReturn<any>;

        // Test case 1: Under max limit, over min limit
        const mockField1: ArrayFieldSchema = {
            type: 'array',
            minLength: 1,
            maxLength: 5,
            readOnly: false,
            items: {
                type: 'object',
                properties: {
                    name: { type: 'string', title: 'Name' },
                },
            }
        };

        // Act & Assert
        const { rerender } = render(
            <ArrayFieldWrapper
                form={mockForm}
                name="items"
                field={mockField1}
                renderChild={jest.fn()}
            />
        );

        expect(screen.getByTestId('array-field')).toHaveAttribute('data-can-add', 'true');
        expect(screen.getByTestId('array-field')).toHaveAttribute('data-can-remove', 'true');

        // Test case 2: At max limit
        const mockField2: ArrayFieldSchema = {
            type: 'array',
            minLength: 1,
            maxLength: 3, // Fields length is 3
            readOnly: false,
            items: {
                type: 'object',
                properties: {
                    name: { type: 'string', title: 'Name' },
                },
            }
        };

        rerender(
            <ArrayFieldWrapper
                form={mockForm}
                name="items"
                field={mockField2}
                renderChild={jest.fn()}
            />
        );

        expect(screen.getByTestId('array-field')).toHaveAttribute('data-can-add', 'false');
        expect(screen.getByTestId('array-field')).toHaveAttribute('data-can-remove', 'true');

        // Test case 3: At min limit
        (useFieldArray as jest.Mock).mockReturnValue({
            ...mockFieldArray,
            fields: [{ id: '1' }], // Only one item
        });

        const mockField3: ArrayFieldSchema = {
            type: 'array',
            minLength: 1, // Fields length is now 1
            maxLength: 5,
            readOnly: false,
            items: {
                type: 'object',
                properties: {
                    name: { type: 'string', title: 'Name' },
                },
            }
        };

        rerender(
            <ArrayFieldWrapper
                form={mockForm}
                name="items"
                field={mockField3}
                renderChild={jest.fn()}
            />
        );

        expect(screen.getByTestId('array-field')).toHaveAttribute('data-can-add', 'true');
        expect(screen.getByTestId('array-field')).toHaveAttribute('data-can-remove', 'false');
    });

    it('passes context to renderItem', () => {
        // Arrange
        const mockForm = {
            control: {},
        } as unknown as UseFormReturn<any>;

        const mockField = {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    name: { type: 'string', title: 'Name' },
                },
            }
        } as ArrayFieldSchema;
        const mockContext = { theme: 'dark' };
        const mockRenderChild = jest.fn(() => <div>Child Item</div>);

        // Act
        render(
            <ArrayFieldWrapper
                form={mockForm}
                name="items"
                field={mockField}
                renderContext={mockContext}
                renderChild={mockRenderChild}
            />
        );

        // Assert
        expect(mockRenderChild).toHaveBeenCalledWith(
            expect.objectContaining({
                name: 'items[0]',
                renderContext: mockContext
            } as SchemaFormFieldProps)
        );
    });
});
