import AWS from 'aws-sdk';
import commonMiddleware from '../lib/commonMiddleware';
import createError from 'http-errors';

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function getItem(event, context) {
  let item;
  const { id } = event.pathParameters;

  try {
    const result = await dynamodb
      .get({
        TableName: process.env.ITEMS_TABLE_NAME,
        Key: { id },
      })
      .promise();

    item = result.Item;
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }

  if (!item) {
    throw new createError.NotFound(`Item with ID "${id}" not found!`);
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ item }),
  };
}

export const handler = commonMiddleware(getItem);
