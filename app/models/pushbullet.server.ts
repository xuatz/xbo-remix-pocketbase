import axios from 'axios';

export type Push = {
  active: boolean;
  iden: string;
  created: number;
  modified: number;
  type: 'link' | string;
  dismissed: boolean;
  guid: string;
  direction: 'self' | string;
  sender_iden: string;
  sender_email: string;
  sender_email_normalized: string;
  sender_name: string;
  receiver_iden: string;
  receiver_email: string;
  receiver_email_normalized: string;
  source_device_iden: string;
  awake_app_guids: string[];
  title: string;
  url: string;
};

const PB_API = axios.create({
  baseURL: 'https://api.pushbullet.com/v2/',
});

export type GET_PUSHES_RESULT = { pushes: Push[]; cursor?: string };

export type GET_PUSHES_PARAMS = {
  access_token: string;
  active?: boolean;
  cursor?: GET_PUSHES_RESULT['cursor'];
  created_after?: string;
  modified_after?: string;
};

export const getPushes = async ({
  access_token,
  active = true,
  cursor,
  created_after,
  modified_after,
}: GET_PUSHES_PARAMS): Promise<GET_PUSHES_RESULT> => {
  try {
    const { data } = await PB_API.get<GET_PUSHES_RESULT>('/pushes', {
      headers: {
        'Access-Token': access_token,
      },
      params: {
        active,
        cursor,
        created_after,
        modified_after,
        limit: 20, // pb actually dont care about this lol.
      },
    });
    return data;
  } catch {
    return {
      pushes: [],
    };
  }
};
