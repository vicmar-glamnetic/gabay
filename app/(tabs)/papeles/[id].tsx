import { useLocalSearchParams } from "expo-router";
import React from "react";

import { BackBar } from "../../../components/CalcScaffold";
import { Screen } from "../../../components/Screen";
import { TransactionDetail } from "../../../components/TransactionDetail";
import { Card, Txt } from "../../../components/ui";
import { findTransaction } from "../../../lib/data/transactions";
import { useRecent } from "../../../lib/hooks";

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
