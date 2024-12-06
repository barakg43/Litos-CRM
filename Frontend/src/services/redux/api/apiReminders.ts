import { httpClient } from "../../axios";

export async function getAllReminders() {
  const { data } = await httpClient.get("/renews");
  return data;
}
