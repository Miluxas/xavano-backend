export type ListBody = {
  skip?: number;
  take?: number;
  search?: string;
  sort?: any;
  filter?: Record<string, any>;
};
