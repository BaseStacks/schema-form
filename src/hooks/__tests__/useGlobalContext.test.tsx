import { PropsWithChildren, ReactNode } from 'react';
import { renderHook } from '@testing-library/react';
import { useGlobalContext } from '../useGlobalContext';
import { JsonFormGlobalContext } from '../../contexts';
import { JsonFormGlobalContextType } from '../../types';

describe('useGlobalContext', () => {
    const mockContextValue: JsonFormGlobalContextType = {
        components: {
            Form: ({ children }: PropsWithChildren) => <div>{children}</div>,
            fields: {
                string: () => <div>Text Field</div>,
            },
        }
    };

    it('should return context value when used inside JsonFormGlobalContext', () => {
        const Wrapper = ({ children }: { children: ReactNode; }) => (
            <JsonFormGlobalContext.Provider value={mockContextValue}>
                {children}
            </JsonFormGlobalContext.Provider>
        );

        const { result } = renderHook(() => useGlobalContext(), { wrapper: Wrapper });
        expect(result.current).toEqual(mockContextValue);
    });

    it('should throw error when used outside JsonFormGlobalContext', () => {
        expect(() => {
            renderHook(() => useGlobalContext());
        }).toThrow();
    });
});
