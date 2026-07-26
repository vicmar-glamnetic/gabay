import React from "react";

import { BackBar } from "../../../components/CalcScaffold";
import { Screen, ScreenTitle } from "../../../components/Screen";
import { Callout, Card, ListRow } from "../../../components/ui";

export default function LanguageScreen() {
  return (
    <Screen>
      <BackBar label="Ako" />
      <ScreenTitle eyebrow="Ako" title="Language" />

      <Card padded={false}>
        <ListRow title="English" subtitle="Currently the only language" last />
      </Card>

      <Callout tone="neutral" title="Taglish is coming as a full switch">
        The people checking a payslip are rank and file, not HR, so a Taglish version matters.
        It will be a complete language switch rather than a partial one — half-translated
        copy reads as sloppy rather than local, so it ships when all of it is ready.
      </Callout>
    </Screen>
  );
}
