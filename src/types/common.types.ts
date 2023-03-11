export interface IError extends Error {
  status: number;
}

interface IIndex {
  [index: string]: any;
}

export type IRequest = IIndex;
