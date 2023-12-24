import { httpClient } from "./axios";

export async function getAllCustomers() {
  const { data } = await httpClient.get("/reminders");
  return data;
}
