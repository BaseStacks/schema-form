import { PropsWithChildren } from 'react';
import { memo } from 'react';

import { JsonFormGlobalContext } from '../contexts';
import { JsonFormGlobalContextType } from '../types';

function JsonFormProviderImpl({ children, ...props }: PropsWithChildren<JsonFormGlobalContextType>) {
    return (
        <JsonFormGlobalContext.Provider value={props}>
            {children}
        </JsonFormGlobalContext.Provider>
    );
};

export const JsonFormProvider = memo(JsonFormProviderImpl);
