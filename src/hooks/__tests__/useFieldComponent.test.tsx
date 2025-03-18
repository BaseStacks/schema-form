import { renderHook } from '@testing-library/react';
import { useFieldComponent } from '../useFieldComponent';
import { useGlobalContext } from '../useGlobalContext';

// Mock the useGlobalContext hook
jest.mock('../useGlobalContext');

describe('useFieldComponent', () => {
    const mockTextComponent = () => <div>Text Field</div>;
    const mockNumberComponent = () => <div>Number Field</div>;

    beforeEach(() => {
        // Setup the mock implementation
        (useGlobalContext as jest.Mock).mockReturnValue({
            components: {
                fields: {
                    'text': mockTextComponent,
                    'number': mockNumberComponent
                }
            }
        });
    });

    it('should return the correct field component for text type', () => {
        const { result } = renderHook(() => useFieldComponent('text'));
        expect(result.current).toBe(mockTextComponent);
    });

    it('should return the correct field component for number type', () => {
        const { result } = renderHook(() => useFieldComponent('number'));
        expect(result.current).toBe(mockNumberComponent);
    });

    it('should return undefined for unknown field types', () => {
        const { result } = renderHook(() => useFieldComponent('unknown'));
        expect(result.current).toBeUndefined();
    });
});
