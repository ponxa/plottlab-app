import type { SNSEvent, APIGatewayProxyResultV2 } from 'aws-lambda';

export async function handler(
  event: SNSEvent
): Promise<APIGatewayProxyResultV2> {
  const bodyStr = event.Records[0]?.Sns.Message;
  //   const body = schema.parse(JSON.parse(bodyStr ?? '{}'));

  console.log('Creating order', bodyStr);

  return { statusCode: 200 };
}
