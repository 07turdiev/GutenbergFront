import $api from '../http/index';

export interface SocialMediaData {
  id: number;
  documentId: string;
  facebook_havolasi: string | null;
  instagram_havolasi: string | null;
  telegram_havolasi: string | null;
  youtube_havolasi: string | null;
  twitter_havolasi: string | null;
  Google_havolasi: string | null;
  Viber_havolasi: string | null;
  Whatsapp_havolasi: string | null;
  Telegram_bot: string | null;
  Telegram_kanal: string | null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface SocialMediaResponse {
  data: SocialMediaData;
}

export const getSocialMediaLinks = async (): Promise<SocialMediaData | null> => {
  try {
    const response = await $api.get<SocialMediaResponse>('/api/ijtimoiy-tarmoqlar');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching social media links:', error);
    return null;
  }
};
