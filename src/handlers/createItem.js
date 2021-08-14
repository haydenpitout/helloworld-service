import { v4 as uuid } from 'uuid';
import AWS from 'aws-sdk';

const dynamodb = new AWS.DynamoDB.DocumentClient();

export const handler = async (event, context) => {
  const { title, description } = JSON.parse(event.body);
  const now = new Date();

  const item = {
    id: uuid(),
    title,
    description,
    status: 'OPEN',
    createdAt: now.toISOString(),
  };

  await dynamodb.put({
    TableName: 'ItemsTable',
    Item: item,
  }).promise();

  return {
    statusCode: 201,
    body: JSON.stringify({ item }),
  };
};
