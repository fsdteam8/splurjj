export type Subscriber = {
  id: number;
  email: string;
};

export type MetaPagination = {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
};

export type SubscriberApiResponse = {
  success: boolean;
  data: Subscriber[];
  meta: MetaPagination;
};
