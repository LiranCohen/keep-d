import { Web5 } from '@web5/api';
import { ReactNode, createContext, useEffect, useState } from 'react';
import { profile } from '../protocols/profile/profile';

export type Profile = {
  avatar?: {
    dataFormat: string,
    uri: string
  },
};

export type Identity = {
  did: string;
  web5: Web5;
  profile?: Profile;
};

const connectOptions = {
  // techPreview: {
  //   dwnEndpoints: ["http://localhost:3000/"],
  // },
};

export const Web5Context = createContext<{ identity?: Identity; }>({ });

export const Web5Provider = ({ children }: { children: ReactNode }) => {
  const [identity, setIdentity] = useState<Identity>();

  useEffect(() => {

    const init = async (identity?: Identity): Promise<void> =>  {
      if (identity == undefined) {
        const { did, web5 } = await Web5.connect(connectOptions);
        console.log('did', did);
        const profile = await setUpProfile(web5);
        setIdentity({ did, web5, profile });
      }
    }
  
    const setUpProfile = async (web5: Web5): Promise<Profile | undefined> => {
      // query profile protocol to make sure it exists
      const profileProtocol = await web5.dwn.protocols.query({
        message: { filter: { protocol: profile.uri } }
      });
  
      if (profileProtocol.protocols.length === 0) {
        const install = window.confirm('Install Profile Protocol?');
        if (!install) {
          return;
        }

        const { status } = await web5.dwn.protocols.configure({
          message: { definition: profile.definition }
        });
        if (status.code !== 202) {
          throw new Error(`(${status.code}) - ${status.detail}`);
        }
      }
  
      //query the profile information
      const avatarRecord = await web5.dwn.records.read({
        message: { filter: {
          protocol     : profile.uri,
          protocolPath : 'avatar'
        }}
      });
  
      if (avatarRecord.status.code !== 200) {
        return {};
      }
  
      try {
        const avatarImage = await avatarRecord.record.data.blob();
        const avatarURI = URL.createObjectURL(avatarImage);
    
        return {
          avatar : {
            dataFormat : avatarRecord.record.dataFormat,
            uri        : avatarURI,
          },
        };
      } catch(error) {
        console.log('profile error', error);
      }
    }

    init(identity);
  }, [ identity ])

  return (
    <Web5Context.Provider value={{ identity }}>
      {children}
    </Web5Context.Provider>
  );
};