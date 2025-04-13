import { getISOString, logger, schemaValidator } from '@shared';

import { httpsRequest } from '@adapters/secondary/https-request';
import { CreateOrderPayload } from '@dto/create-order';
import { Order } from '@dto/order';
import { schema } from '@schemas/order';
import { v4 as uuid } from 'uuid';

export async function createOrderUseCase(
  order: CreateOrderPayload,
): Promise<Order> {
  const createdDate = getISOString();

  const createdOrder: Order = {
    id: uuid(),
    created: createdDate,
    updated: createdDate,
    ...order,
  };

  schemaValidator(schema, order);

  // Note - we would normally use a database to store the order at this point

  const response = await httpsRequest(
    'https://checkip.amazonaws.com', // This response will show our public IP
    '/',
    'GET',
    {},
  );

  logger.info(
    `Order ${createdOrder.id} created from dedicated IP: ${JSON.stringify(response)}`,
  );

  return createdOrder;
}
