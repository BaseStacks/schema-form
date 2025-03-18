import { render, screen } from '@testing-library/react';
import { useContext } from 'react';
import { JsonFormProvider } from '../JsonFormProvider';
import { JsonFormGlobalContext } from '../../contexts';

describe('JsonFormProvider', () => {
    test('provides context values to children', () => {
        // Create a test consumer component
        const TestConsumer = () => {
            const context = useContext(JsonFormGlobalContext);
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
            <JsonFormProvider {...testValues}>
                <TestConsumer />
            </JsonFormProvider>
        );

        const consumer = screen.getByTestId('test-consumer');
        expect(consumer).toHaveTextContent(JSON.stringify(testValues));
    });
});
