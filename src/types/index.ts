export interface IPosition {
  x: number;
  y: number;
}

export interface ISize {
  width: number;
  height: number;
}

export interface INote {
  id: string;
  position: IPosition;
  size: ISize;
  content: string;
  color: string;
  zIndex: number;
}

export interface IDragState {
  isDragging: boolean;
  offset: IPosition;
}

export interface IAPIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
