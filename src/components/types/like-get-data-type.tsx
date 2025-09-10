export type LikeApiResponse = {
  success: boolean;
  data: {
    content_id: number;
    liked: boolean;
    likes_count: number;
  };
};
