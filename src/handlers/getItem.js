import AWS from 'aws-sdk';
import middy from '@middy/core';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import httpEventNormalizer from '@middy/http-event-normalizer';
import httpErrorHandler from '@middy/http-error-handler';
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

export const handler = middy(getItem)
  .use(httpJsonBodyParser())
  .use(httpEventNormalizer())
  .use(httpErrorHandler());
