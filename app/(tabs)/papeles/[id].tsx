import { useLocalSearchParams } from "expo-router";
import React from "react";

import { BackBar } from "../../../components/CalcScaffold";
import { Screen } from "../../../components/Screen";
import { TransactionDetail } from "../../../components/TransactionDetail";
import { Card, Txt } from "../../../components/ui";
import { findTransaction, TRANSACTIONS } from "../../../lib/data/transactions";
import { useRecent } from "../../../lib/hooks";

/**
 * Pre-renders one HTML file per transaction for the static web export.
 * Without it the export emits a literal `[id].html` and every deep link 404s.
 */
export async function generateStaticParams(): Promise<Record<string, string>[]> {
  return TRANSACTIONS.map((t) => ({ id: t.id }));
}

export default function TransactionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const transaction = findTransaction(id ?? "");
  useRecent(`/papeles/${id}`, transaction?.name ?? "Papeles", transaction?.agency);

  return (
    <Screen>
      <BackBar label="Papeles" />
      {transaction ? (
        <TransactionDetail transaction={transaction} />
      ) : (
        <Card>
          <Txt variant="body">That transaction is not in the guide.</Txt>
        </Card>
      )}
    </Screen>
  );
}
