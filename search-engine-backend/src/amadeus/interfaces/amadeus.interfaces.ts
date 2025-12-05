export interface AmadeusError {
  errors: Array<{
    status: number;
    code: number;
    title: string;
    detail: string;
    source?: {
      parameter?: string;
      pointer?: string;
      example?: string;
    };
  }>;
}