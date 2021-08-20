import AWS from 'aws-sdk';
import createError from 'http-errors';
import { getItemById } from './getItem';
import validator from '@middy/validator';
import commonMiddleware from '../lib/commonMiddleware';
import placeBidSchema from '../lib/schemas/placeBidSchema';

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function placeBid(event, context) {
  const { id } = event.pathParameters;
  const { amount } = event.body;

  const item = await getItemById(id);

  if (item.status !== 'OPEN') {
    throw new createError.Forbidden(`You cannot bid on closed auctions!`);
  }

  if (amount <= item.highestBid.amount) {
    throw new createError.Forbidden(
      `Your bid must be higher than ${item.highestBid.amount}!`
    );
  }

  const params = {
    TableName: process.env.ITEMS_TABLE_NAME,
    Key: { id },
    UpdateExpression: 'set highestBid.amount = :amount',
    ExpressionAttributeValues: {
      ':amount': amount,
    },
    ReturnValues: 'ALL_NEW',
  };

  let updatedItem;

  try {
    const result = await dynamodb.update(params).promise();
    updatedItem = result.Attributes;
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ updatedItem }),
  };
}

export const handler = commonMiddleware(placeBid).use(
  validator({ inputSchema: placeBidSchema })
);
