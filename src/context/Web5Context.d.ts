import { Web5 } from '@web5/api';
import { ReactNode } from 'react';
export type Profile = {
    avatar: {
        dataFormat: string;
        uri: string;
    };
};
export type Identity = {
    did: string;
    web5: Web5;
    profile?: Profile;
};
export declare const Web5Context: import("react").Context<{
    identity?: Identity | undefined;
}>;
export declare const Web5Provider: ({ children }: {
    children: ReactNode;
}) => import("react/jsx-runtime").JSX.Element;
