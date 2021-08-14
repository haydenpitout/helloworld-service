export const handler = async (event, context) => {
  const { title, description } = JSON.parse(event.body);
  const now = new Date();

  const item = {
    title,
    description,
    status: 'OPEN',
    createdAt: now.toISOString(),
  };

  return {
    statusCode: 201,
    body: JSON.stringify({ item }),
  };
};
