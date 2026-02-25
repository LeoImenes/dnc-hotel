export const REDIS_HOTELS_KEY = (page: number, limit: number) =>
  `hotels:page:${page}:limit:${limit}`;

export const REDIS_REMOVE_HOTELS_KEY = `hotels:page:*`;