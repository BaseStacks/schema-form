import { render, screen } from '@testing-library/react';
import { withObject } from '../withObject';
import { SchemaFormField } from '../../SchemaFormField';
import { ObjectFieldSchema, RenderContext, WithObjectProps } from '../../../types';

// Mock SchemaFormField component
jest.mock('../../SchemaFormField', () => ({
    SchemaFormField: jest.fn(() => <div data-testid="mocked-schema-form-field" />)
}));

// Mock component to be wrapped by withObject
const MockObjectComponent = ({
    name,
    title,
    description,
    placeholder,
    renderContext,
    children,
}: WithObjectProps<RenderContext, any, any>) => (
    <div data-testid="object-component">
        <div data-testid="name">{name}</div>
        <div data-testid="title">{title}</div>
        <div data-testid="description">{description}</div>
        <div data-testid="placeholder">{placeholder}</div>
        <div data-testid="render-context">{JSON.stringify(renderContext)}</div>
        <div data-testid="children">{children}</div>
    </div>
);

describe('withObject HOC', () => {
    const baseRenderContext: RenderContext = { theme: 'dark' };
    const renderContext: RenderContext = { language: 'en' };

    const mockSchema: ObjectFieldSchema<RenderContext, any, any> = {
        type: 'object',
        title: 'Test Title',
        description: 'Test Description',
        placeholder: 'Test Placeholder',
        properties: {
            field1: { type: 'string' },
            field2: { type: 'number' },
        }
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders wrapped component with correct props', () => {
        const EnhancedComponent = withObject(MockObjectComponent);
        render(<EnhancedComponent form={{} as any} name="testObject" schema={mockSchema} renderContext={renderContext} />);

        expect(screen.getByTestId('object-component')).toBeInTheDocument();
        expect(screen.getByTestId('name')).toHaveTextContent('testObject');
        expect(screen.getByTestId('title')).toHaveTextContent('Test Title');
        expect(screen.getByTestId('description')).toHaveTextContent('Test Description');
        expect(screen.getByTestId('placeholder')).toHaveTextContent('Test Placeholder');
    });

    test('merges baseRenderContext with renderContext', () => {
        const EnhancedComponent = withObject(MockObjectComponent, baseRenderContext);
        render(<EnhancedComponent form={{} as any} name="testObject" schema={mockSchema} renderContext={renderContext} />);

        const contextElement = screen.getByTestId('render-context');
        const renderedContext = JSON.parse(contextElement.textContent || '{}');

        expect(renderedContext).toEqual({ theme: 'dark', language: 'en' });
    });

    test('renders SchemaFormField for each property in schema', () => {
        const EnhancedComponent = withObject(MockObjectComponent);
        render(<EnhancedComponent form={{} as any} name="testObject" schema={mockSchema} renderContext={renderContext} />);

        expect(SchemaFormField).toHaveBeenCalledTimes(2);
        expect(SchemaFormField).toHaveBeenCalledWith(
            expect.objectContaining({
                name: 'testObject.field1',
                renderContext
            }),
            undefined
        );
        expect(SchemaFormField).toHaveBeenCalledWith(
            expect.objectContaining({
                name: 'testObject.field2',
                renderContext
            }),
            undefined
        );
    });

    test('uses empty object as default when baseRenderContext is not provided', () => {
        const EnhancedComponent = withObject(MockObjectComponent);
        render(<EnhancedComponent form={{} as any} name="testObject" schema={mockSchema} renderContext={renderContext} />);

        const contextElement = screen.getByTestId('render-context');
        const renderedContext = JSON.parse(contextElement.textContent || '{}');

        expect(renderedContext).toEqual(renderContext);
    });

    test('handles undefined renderContext', () => {
        const EnhancedComponent = withObject(MockObjectComponent, baseRenderContext);
        render(<EnhancedComponent form={{} as any} name="testObject" schema={mockSchema} renderContext={undefined!} />);

        const contextElement = screen.getByTestId('render-context');
        const renderedContext = JSON.parse(contextElement.textContent || '{}');

        expect(renderedContext).toEqual(baseRenderContext);
    });
});
