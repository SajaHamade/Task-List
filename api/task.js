import { ListTablesCommand, DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  UpdateCommand,
  PutCommand,
  DynamoDBDocumentClient,
  ScanCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";
import crypto from "crypto";

const client = new DynamoDBClient({ region: "us-east-1" });
const docClient = DynamoDBDocumentClient.from(client);

export const fetchTasks = async () => {
  const command = new ScanCommand({
    ExpressionAttributeNames: { "#name": "name" },
    ProjectionExpression: "id, #name , completed",
    TableName: "Tasks",
  });

  const response = await docClient.send(command);
  

  return response;
};

export const createTasks = async ({ name, completed }) => {
  const uuid = crypto.randomUUID();
  const command = new PutCommand({
    TableName: "Tasks",
    Item: {
      id: uuid,
      name,
      completed,
    },
  });

  const response = await docClient.send(command);

  return response;
};

export const updateTasks = async ({ id, name, completed }) => {
  const command = new UpdateCommand({
    TableName: "Tasks",
    Key: {
      id,
    },
    ExpressionAttributeNames: {
      //this is because in dynamo name is already like a built in thing (reserved name) so we say that we want to use it as a field not like your built in stuff so now we mean that name is the #name which is not that of the dynamo
      "#name": "name",
    },
    UpdateExpression: "set #name= :n, completed = :c", //now we will assign the values of :n ans :c
    ExpressionAttributeValues: {
      ":n": name,
      ":c": completed,
    },
    ReturnValues: "ALL_NEW", // return the whole update item
  });

  const response = await docClient.send(command);

  return response;
};

export const DeleteTasks = async (id) => {
  const command = new DeleteCommand({
    TableName: "Tasks",
    Key: {
      id,
    },
  });

  const response = await docClient.send(command);

  return response;
};
