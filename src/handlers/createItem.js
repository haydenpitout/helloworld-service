import { v4 as uuid } from 'uuid';
import AWS from 'aws-sdk';
import commonMiddleware from '../lib/commonMiddleware';
import createError from 'http-errors';

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function createItem(event, context) {
  const { title, description } = event.body;
  const now = new Date();

  const item = {
    id: uuid(),
    title,
    description,
    status: 'OPEN',
    highestBid: {
      amount: 0,
    },
    createdAt: now.toISOString(),
  };

  try {
    await dynamodb
      .put({
        TableName: process.env.ITEMS_TABLE_NAME,
        Item: item,
      })
      .promise();
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }

  return {
    statusCode: 201,
    body: JSON.stringify({ item }),
  };
}

export const handler = commonMiddleware(createItem);
