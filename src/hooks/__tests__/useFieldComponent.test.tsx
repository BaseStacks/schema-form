import { renderHook } from '@testing-library/react';
import { useFieldComponent } from '../useFieldComponent';
import { useGlobalContext } from '../useGlobalContext';

// Mock the useGlobalContext hook
jest.mock('../useGlobalContext');

describe('useFieldComponent', () => {
    const mockTextComponent = () => <div>Text Field</div>;
    const mockNumberComponent = () => <div>Number Field</div>;
    const mockCustomComponent = () => <div>Custom Field</div>;

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
        const { result } = renderHook(() => useFieldComponent({ type: 'text' }));
        expect(result.current).toBe(mockTextComponent);
    });

    it('should return the correct field component for number type', () => {
        const { result } = renderHook(() => useFieldComponent({ type: 'number' }));
        expect(result.current).toBe(mockNumberComponent);
    });

    it('should throw error for unknown field types', () => {
        expect(() => {
            renderHook(() => useFieldComponent({ type: 'unknown' }));
        }).toThrow('No field component found for type: unknown');
    });

    it('should return custom component when type is not defined but Component is provided', () => {
        const { result } = renderHook(() => 
            useFieldComponent({ Component: mockCustomComponent })
        );
        expect(result.current).toBe(mockCustomComponent);
    });

    it('should handle schema with no type and no Component property', () => {
        const { result } = renderHook(() => 
            useFieldComponent({})
        );
        expect(result.current).toBeUndefined();
    });
});
