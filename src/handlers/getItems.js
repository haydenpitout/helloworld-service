import AWS from 'aws-sdk';
import createError from 'http-errors';
import validator from '@middy/validator';
import commonMiddleware from '../lib/commonMiddleware';
import getItemsSchema from '../lib/schemas/getItemsSchema';

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function getItems(event, context) {
  const { status } = event.queryStringParameters;
  let items;

  const params = {
    TableName: process.env.ITEMS_TABLE_NAME,
    IndexName: 'statusAndEndDate',
    KeyConditionExpression: '#status = :status',
    ExpressionAttributeValues: {
      ':status': status,
    },
    ExpressionAttributeNames: {
      '#status': 'status',
    },
  };

  try {
    const result = await dynamodb.query(params).promise();

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

export const handler = commonMiddleware(getItems).use(
  validator({
    inputSchema: getItemsSchema,
    ajvOptions: { useDefault: true, strict: false },
  })
);
