export type RequestType = 'order' | 'consultation';

export interface RequestPayload {
  name: string;
  phone: string;
  type: RequestType;
  service?: string;
}

export type RequestModalMode = 'order' | 'consultation';

export interface RequestModalDataInterface {
  mode: RequestModalMode;
  title: string;
  submitLabel: string;
  service?: string;
  services?: string[];
}
