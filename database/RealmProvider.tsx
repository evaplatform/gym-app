// src/database/RealmProvider.tsx
import React from "react";
import { RealmProvider as RealmProviderBase } from "@realm/react";
import { schemas } from "./schemas";
import { ActivityIndicator, View } from "react-native";
import { migrationFunction, realmConfig } from "./migrations";

export const RealmProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <RealmProviderBase
      schema={schemas}
      schemaVersion={realmConfig.schemaVersion}
      migrationOptions={{ resolveEmbeddedConstraints: true }}
      onMigration={migrationFunction}
      fallback={
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" />
        </View>
      }
    >
      {children}
    </RealmProviderBase>
  );
};
