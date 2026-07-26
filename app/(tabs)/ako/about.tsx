import React from "react";
import { View } from "react-native";

import { BackBar } from "../../../components/CalcScaffold";
import { Screen, ScreenTitle } from "../../../components/Screen";
import { Callout, Card, SectionHead, Txt } from "../../../components/ui";
import { t } from "../../../lib/i18n";
import { RATES_VERSION_LABEL } from "../../../lib/rates";
import { useTheme } from "../../../lib/theme/ThemeProvider";

export default function AboutScreen() {
  const th = useTheme();

  return (
    <Screen>
      <BackBar label="Ako" />
      <ScreenTitle eyebrow="Ako" title="About Gabay" subtitle={t("app.tagline")} />

      <Card style={{ gap: th.space.md }}>
        <Txt variant="body">
          Gabay means guide. It does three things: gives you the correct peso figure and shows
          the rule behind it, tells you exactly what to bring to a government office so you do
          not have to go back a second time, and tells you what you are entitled to that
          nobody mentioned.
        </Txt>
        <Txt variant="rule">Statutory schedules: {RATES_VERSION_LABEL}</Txt>
      </Card>

      <View style={{ gap: th.space.md }}>
        <SectionHead title="What it will not do" />
        <Card style={{ gap: th.space.md }}>
          <Item
            title="It will not give legal advice"
            body="Gabay names the statute and explains the entitlement. It does not tell you whether you have a case, predict an outcome, draft a complaint, or characterise anyone's conduct."
          />
          <Item
            title="It will not present a fee as final"
            body="Government fees change by circular and vary by office and purpose, so every fee carries a verify tag. Requirements and step order are stable and are stated plainly."
          />
          <Item
            title="It will not hold a list of recruitment agencies"
            body="A wrong 'licensed' answer could cost someone their placement fee. Verification goes to the official DMW check. Gabay contributes the red flag logic and the process."
          />
          <Item
            title="It will not carry PhilHealth case rate amounts"
            body="There are thousands and they change by circular. A stale case rate is worse than none, so the app explains the benefit types and points you to the hospital's PhilHealth desk."
          />
          <Item
            title="It will not have a chatbot"
            body="The whole premise is that every number is traceable to a rule. A model that can invent a contribution figure destroys exactly that."
          />
        </Card>
      </View>

      <View style={{ gap: th.space.md }}>
        <SectionHead title="Privacy, in plain words" />
        <Callout tone="accent">
          <Txt variant="small">
            This app stores everything on your phone and sends nothing to a server. There is
            no account, no login, no analytics and no tracking. It never asks for your name,
            your email, your number or your salary. Everything you type stays here.
          </Txt>
        </Callout>
      </View>

      <View style={{ gap: th.space.md }}>
        <SectionHead title="Offline by design" />
        <Txt variant="body">
          Every figure, rule, holiday and transaction is compiled into the app. Nothing loads
          from a network, so nothing spins. Mobile data is expensive and coverage is uneven
          outside the cities, and the moment you most need this app is standing in a
          government queue with one bar of signal.
        </Txt>
      </View>
    </Screen>
  );
}

function Item({ title, body }: { title: string; body: string }) {
  const th = useTheme();
  return (
    <View style={{ gap: 2 }}>
      <Txt variant="label">{title}</Txt>
      <Txt variant="small">{body}</Txt>
    </View>
  );
}
