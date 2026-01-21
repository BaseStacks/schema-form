import { render } from '@testing-library/react';

import { SchemaFormGlobalContext } from '../../contexts';
import { SchemaFormProvider } from '../SchemaFormProvider';

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

        let contextValue: any;

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

        expect(contextValue).toMatchObject({
            components: mockComponents,
            renderContext: mockRenderContext
        });
        expect(contextValue.formMap).toBeInstanceOf(Map);
        expect(typeof contextValue.registerForm).toBe('function');
    });
});
