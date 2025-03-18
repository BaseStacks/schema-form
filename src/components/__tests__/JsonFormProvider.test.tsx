import { render, screen } from '@testing-library/react';
import { useContext } from 'react';
import { SchemaFormProvider } from '../SchemaFormProvider';
import { SchemaFormGlobalContext } from '../../contexts';

describe('SchemaFormProvider', () => {
    test('provides context values to children', () => {
        // Create a test consumer component
        const TestConsumer = () => {
            const context = useContext(SchemaFormGlobalContext);
            return <div data-testid="test-consumer">{JSON.stringify(context)}</div>;
        };

        // Test context values
        const testValues = {
            components: {
                Form: () => <div>Test Form</div>,
                fields: {
                    string: () => <div>Test String Field</div>,
                }
            }
        };

        render(
            <SchemaFormProvider {...testValues}>
                <TestConsumer />
            </SchemaFormProvider>
        );

        const consumer = screen.getByTestId('test-consumer');
        expect(consumer).toHaveTextContent(JSON.stringify(testValues));
    });
});
