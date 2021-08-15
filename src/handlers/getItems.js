import AWS from 'aws-sdk';
import commonMiddleware from '../lib/commonMiddleware';
import createError from 'http-errors';

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function getItems(event, context) {
  let items;

  try {
    const result = await dynamodb
      .scan({ TableName: process.env.ITEMS_TABLE_NAME })
      .promise();

    items = result.Items;
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ items }),
  };
}

export const handler = commonMiddleware(getItems);
