import { render, screen } from '@testing-library/react';
import { JsonFormField } from '../JsonFormField';
import { useFieldStatus } from '../../hooks/useFieldStatus';
import { useFieldSchema } from '../../hooks/useFieldSchema';
import { useSchemaForm } from '../../hooks/useSchemaForm';
import { ArrayFieldWrapper } from '../wrappers/ArrayFieldWrapper';
import { ObjectFieldWrapper } from '../wrappers/ObjectFieldWrapper';
import { GenericFieldWrapper } from '../wrappers/GenericFieldWrapper';
import { CustomFieldWrapper } from '../wrappers/CustomFieldWrapper';
import { ArrayFieldSchema, GenericFieldSchema, ObjectFieldSchema, CustomFieldSchema } from '../../types';

// Mock dependencies
jest.mock('react-hook-form');
jest.mock('../../hooks/useFieldStatus', () => ({
    useFieldStatus: jest.fn(),
}));
jest.mock('../../hooks/useFieldSchema', () => ({
    useFieldSchema: jest.fn(),
}));
jest.mock('../../hooks/useSchemaForm', () => ({
    useSchemaForm: jest.fn(),
}));
jest.mock('../wrappers/ArrayFieldWrapper', () => ({
    ArrayFieldWrapper: jest.fn(() => <div data-testid="array-wrapper" />),
}));
jest.mock('../wrappers/ObjectFieldWrapper', () => ({
    ObjectFieldWrapper: jest.fn(() => <div data-testid="object-wrapper" />),
}));
jest.mock('../wrappers/GenericFieldWrapper', () => ({
    GenericFieldWrapper: jest.fn(() => <div data-testid="generic-wrapper" />),
}));
jest.mock('../wrappers/CustomFieldWrapper', () => ({
    CustomFieldWrapper: jest.fn(() => <div data-testid="custom-wrapper" />),
}));

describe('JsonFormField', () => {
    const arrayField: ArrayFieldSchema = {
        type: 'array',
        items: { type: 'object', properties: {} },
    };

    const objectField: ObjectFieldSchema = {
        type: 'object',
        properties: {},
    };

    const genericField: GenericFieldSchema = { type: 'string' };

    const customField: CustomFieldSchema = {
        Component: () => <div />
    };

    const mockForm = {
        getValues: jest.fn().mockReturnValue({}),
        formState: { errors: {} },
        register: jest.fn(),
        control: {},
    };

    const mockSchemaForm = {
        form: mockForm,
        context: { theme: 'light' },
    };

    beforeEach(() => {
        jest.clearAllMocks();
        (useFieldStatus as jest.Mock).mockReturnValue({ isVisible: true, isReadOnly: false, isDisabled: false });
        (useSchemaForm as jest.Mock).mockReturnValue(mockSchemaForm);
    });

    test('should render null when field is not visible', () => {
        (useFieldSchema as jest.Mock).mockReturnValue(genericField);
        (useFieldStatus as jest.Mock).mockReturnValue({ isVisible: false });

        const { container } = render(
            <JsonFormField name="test" />
        );

        expect(container).toBeEmptyDOMElement();
    });

    test('should render ArrayFieldWrapper for array field type', () => {
        (useFieldSchema as jest.Mock).mockReturnValue(arrayField);

        render(
            <JsonFormField name="testArray" />
        );

        expect(screen.getByTestId('array-wrapper')).toBeInTheDocument();
        expect(ArrayFieldWrapper).toHaveBeenCalledWith(
            expect.objectContaining({
                name: 'testArray',
                field: arrayField,
            }),
            undefined
        );
    });

    test('should render ObjectFieldWrapper for object field type', () => {
        (useFieldSchema as jest.Mock).mockReturnValue(objectField);

        render(
            <JsonFormField name="testObject" />
        );

        expect(screen.getByTestId('object-wrapper')).toBeInTheDocument();
        expect(ObjectFieldWrapper).toHaveBeenCalledWith(
            expect.objectContaining({
                name: 'testObject',
                field: objectField,
            }),
            undefined
        );
    });

    test('should render GenericFieldWrapper for generic field types', () => {
        (useFieldSchema as jest.Mock).mockReturnValue(genericField);

        render(
            <JsonFormField name="testString" />
        );

        expect(screen.getByTestId('generic-wrapper')).toBeInTheDocument();
        expect(GenericFieldWrapper).toHaveBeenCalledWith(
            expect.objectContaining({
                name: 'testString',
                field: genericField,
            }),
            undefined
        );
    });

    test('should render CustomFieldWrapper when field has no type', () => {
        (useFieldSchema as jest.Mock).mockReturnValue(customField);

        render(
            <JsonFormField name="testCustom" />
        );

        expect(screen.getByTestId('custom-wrapper')).toBeInTheDocument();
        expect(CustomFieldWrapper).toHaveBeenCalledWith(
            expect.objectContaining({
                name: 'testCustom',
                field: customField,
            }),
            undefined
        );
    });

    test('should pass readOnly prop based on fieldStatus', () => {
        (useFieldSchema as jest.Mock).mockReturnValue(genericField);
        (useFieldStatus as jest.Mock).mockReturnValue({ isVisible: true, isReadOnly: true, isDisabled: false });

        render(
            <JsonFormField name="testString" />
        );

        expect(GenericFieldWrapper).toHaveBeenCalledWith(
            expect.objectContaining({
                readOnly: true,
                disabled: false,
            }),
            undefined
        );
    });

    test('should merge context from different sources', () => {
        (useFieldSchema as jest.Mock).mockReturnValue({
            ...genericField,
            context: { fieldTheme: 'dark' },
        });

        const customContext = { customTheme: 'blue' };

        render(
            <JsonFormField name="testString" context={customContext} />
        );

        expect(GenericFieldWrapper).toHaveBeenCalledWith(
            expect.objectContaining({
                context: expect.objectContaining({
                    theme: 'light',
                    fieldTheme: 'dark',
                    customTheme: 'blue',
                }),
            }),
            undefined
        );
    });
});
