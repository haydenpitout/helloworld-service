const schema = {
  type: 'object',
  properties: {
    body: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
        },
        description: {
          type: 'string',
        },
      },
      required: ['title', 'description'],
    },
  },
  required: ['body'],
};

export default schema;
