/* eslint-disable no-undef */
import { API_URL } from "../auth/constants";

export async function getTransactions({ accessToken }) {
  const response = await fetch(`${API_URL}/usuarios/transactions `, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    method: "GET",
  });

  const json = await result.json();

  if (response.ok) {
    const transactions = json.body.data;
    return transactions;
  }

  return;
}

export async function createTransaction({ accessToken, input }) {
  const response = await fetch(`${API_URL}/usuarios/transactions`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "aplication/json",
    },
    method: "POST",
    body: JSON.stringify(input),
  });

  return response;
}
