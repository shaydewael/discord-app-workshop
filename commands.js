const FORTUNE_COMMAND = {
  type: 1,
  name: 'fortune',
  description: 'Ask a question to have your fortune read',
  options: [
    {
      type: 3,
      name: 'question',
      description: 'The question you want answered',
      required: false,
      min_length: 1
    }
  ]
};

export const ALL_COMMANDS = [FORTUNE_COMMAND];