export const schema = {
  type: 'object',
  required: ['customerId', 'items', 'subtotal', 'total'],
  properties: {
    customerId: { type: 'string' },
    customerName: { type: 'string' },
    customerEmail: { type: 'string', format: 'email' },
    customerPhone: { type: 'string' },
    shippingAddress: {
      type: 'object',
      required: ['line1', 'city', 'postcode', 'country'],
      properties: {
        line1: { type: 'string' },
        line2: { type: 'string' },
        city: { type: 'string' },
        postcode: { type: 'string' },
        country: { type: 'string' },
      },
      additionalProperties: false,
    },
    items: {
      type: 'array',
      minItems: 1,
      items: {
        type: 'object',
        required: ['productId', 'name', 'quantity', 'price', 'currency'],
        properties: {
          productId: { type: 'string' },
          name: { type: 'string' },
          quantity: { type: 'integer', minimum: 1 },
          price: { type: 'number', minimum: 0 },
          currency: { type: 'string' },
        },
        additionalProperties: false,
      },
    },
    subtotal: { type: 'number', minimum: 0 },
    total: { type: 'number', minimum: 0 },
  },
  additionalProperties: false,
};
