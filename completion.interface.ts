export interface Completion {
  choices: Choice[];
}

export interface Choice {
  text: string;
  index: number;
  logprobs: any;
  finish_reason: string;
}
