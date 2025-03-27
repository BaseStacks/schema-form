import { render } from '@testing-library/react';
import { SchemaFormProvider } from '../SchemaFormProvider';
import { SchemaFormGlobalContext } from '../../contexts';

describe('SchemaFormProvider', () => {
    it('renders children correctly', () => {
        const { getByText } = render(
            <SchemaFormProvider
                components={{
                    Form: jest.fn(),
                    fields: {}
                }}
                renderContext={{}}
            >
                <div>Test Child</div>
            </SchemaFormProvider>
        );

        expect(getByText('Test Child')).toBeInTheDocument();
    });

    it('provides the correct context value', () => {
        const mockComponents = {
            Form: jest.fn(),
            fields: {
                text: jest.fn(),
                checkbox: jest.fn()
            }
        };

        const mockRenderContext = { theme: 'dark' };

        let contextValue;

        render(
            <SchemaFormProvider components={mockComponents} renderContext={mockRenderContext}>
                <SchemaFormGlobalContext.Consumer>
                    {value => {
                        contextValue = value;
                        return <div>Test</div>;
                    }}
                </SchemaFormGlobalContext.Consumer>
            </SchemaFormProvider>
        );

        expect(contextValue).toEqual({
            components: mockComponents,
            renderContext: mockRenderContext
        });
    });
});
