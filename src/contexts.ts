import React from 'react';
import { JsonFormContextType, JsonFormGlobalContextType } from './types';

export const JsonFormGlobalContext = React.createContext<JsonFormGlobalContextType>(null!);

export const JsonFormContext = React.createContext<JsonFormContextType<any>>(null!);
