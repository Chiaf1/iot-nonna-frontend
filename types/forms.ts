// Stato che la action può ritornare al componente
export type FormState = {
  errors?: Record<string, string[]>;
  message?: string;
};
