import { Icon, type IconName } from "@/components/ui/Icon";
import { useState } from "react";
import { Pressable, RefreshControl, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { errorMessage } from "@/api/client";
import FloorMap, { TABLE_LOOK } from "@/components/FloorMap";
import { C } from "@/constants/theme";
import { useLiveFloor } from "@/hooks/queries";
import { feedback } from "@/lib/feedback";
import { clock, titleCase } from "@/lib/format";
import type { LiveTable, TableLiveStatus } from "@/types";

function Count({ status, value }: { status: TableLiveStatus; value: number }) {
  const look = TABLE_LOOK[status];
  return (
    <View style={{ flex: 1, backgroundColor: C.card, borderRadius: 16, borderWidth: 1, borderColor: C.cardBorder, padding: 12 }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
        <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: status === "free" ? look.stroke : look.stroke }} />
        <Text style={{ fontSize: 12, fontWeight: "700", color: C.inkMuted, textTransform: "uppercase", letterSpacing: 0.6 }}>{look.label}</Text>
      </View>
      <Text style={{ fontSize: 23.5, fontWeight: "800", color: C.ink, marginTop: 4, fontVariant: ["tabular-nums"] }}>{value}</Text>
    </View>
  );
}

/** What is known about one table right now. */
function TableCard({ table, floorName }: { table: LiveTable; floorName: string }) {
  const look = TABLE_LOOK[table.live.status] ?? TABLE_LOOK.free;
  const { status, guests, detail, since, until } = table.live;

  let line = "Nobody is booked here right now.";
  if (status === "reserved") {
    line = `${detail ? `Reserved for ${titleCase(detail)}` : "Reserved"}${since ? ` from ${clock(since)}` : ""}${until ? ` to ${clock(until)}` : ""}.`;
  } else if (status === "occupied") {
    line = `${detail ? titleCase(detail) : "Guests are seated"}${since ? ` · since ${clock(since)}` : ""}${until ? ` · booked until ${clock(until)}` : ""}.`;
  }

  return (
    <View testID="table-card" style={{ backgroundColor: C.card, borderRadius: 18, borderWidth: 1, borderColor: C.cardBorder, padding: 16, marginTop: 14 }}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 11, fontWeight: "700", color: C.inkMuted, letterSpacing: 1.2 }}>TABLE</Text>
          <Text style={{ fontSize: 27, fontWeight: "800", color: C.ink, letterSpacing: -0.5 }}>{table.name}</Text>
        </View>
        <View style={{ paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, borderWidth: 1.5, borderStyle: "dashed", borderColor: look.stroke, backgroundColor: status === "occupied" ? C.accentPale : look.fill }}>
          <Text style={{ fontSize: 11, fontWeight: "700", letterSpacing: 0.8, textTransform: "uppercase", color: status === "occupied" ? C.accentDeep : look.text }}>{look.label}</Text>
        </View>
      </View>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 10 }}>
        {[
          { icon: "layers-outline" as const, text: floorName },
          { icon: "people-outline" as const, text: guests > 0 ? `${guests} of ${table.seats} seats` : `${table.seats} seats` },
        ].map((chip) => (
          <View key={chip.text} style={{ flexDirection: "row", alignItems: "center", gap: 5, backgroundColor: C.paper, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10 }}>
            <Icon name={chip.icon} size={13} color={C.inkMuted} />
            <Text style={{ fontSize: 11.5, fontWeight: "600", color: C.inkMuted }}>{chip.text}</Text>
          </View>
        ))}
      </View>
      <Text style={{ fontSize: 12.5, color: C.ink, marginTop: 12, lineHeight: 20 }}>{line}</Text>
    </View>
  );
}

/** The restaurant's tables as they stand right now, floor by floor. */
export default function FloorScreen() {
  const insets = useSafeAreaInsets();
  const { data, isLoading, isError, error, refetch, isRefetching } = useLiveFloor();
  const [floorId, setFloorId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const tables = data?.tables ?? [];
  const named = data?.floors ?? [];
  const floors = [
    ...named,
    ...[...new Set(tables.map((t) => t.floorId))].filter((id) => id && !named.some((f) => f.id === id)).map((id) => ({ id, name: `Floor ${id}` })),
  ].filter((floor) => tables.some((t) => t.floorId === floor.id));
  const active = floors.find((f) => f.id === floorId) ?? floors[0];
  const floorTables = active ? tables.filter((t) => t.floorId === active.id) : [];
  const selected = floorTables.find((t) => t.id === selectedId) ?? null;

  return (
    <View style={{ flex: 1, backgroundColor: C.paper }}>
      <View style={{ backgroundColor: C.accent, paddingTop: insets.top + 12, paddingHorizontal: 20, paddingBottom: 16, borderBottomLeftRadius: 28, borderBottomRightRadius: 28 }}>
        <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: 12, fontWeight: "700", letterSpacing: 1.4, textTransform: "uppercase" }}>Live</Text>
        <Text style={{ color: C.white, fontSize: 21.5, fontWeight: "900", letterSpacing: -0.4 }}>Floor</Text>
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={isRefetching && !isLoading} onRefresh={() => refetch()} tintColor={C.accent} colors={[C.accent]} />}
      >
        {isLoading ? (
          <View style={{ gap: 12 }}>
            <View style={{ height: 76, borderRadius: 16, backgroundColor: C.skeleton }} />
            <View style={{ height: 280, borderRadius: 20, backgroundColor: C.skeleton }} />
          </View>
        ) : isError && !data ? (
          <View style={{ alignItems: "center", paddingTop: 60, paddingHorizontal: 24 }}>
            <Icon name="cloud-offline" size={40} color={C.inkMuted} />
            <Text style={{ fontSize: 16, fontWeight: "700", color: C.ink, marginTop: 12 }}>Could not load the floor</Text>
            <Text style={{ fontSize: 12.5, color: C.inkMuted, textAlign: "center", marginTop: 6 }}>{errorMessage(error)}</Text>
            <Pressable accessibilityRole="button" onPress={() => refetch()} style={{ marginTop: 20, backgroundColor: C.accent, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12 }}>
              <Text style={{ color: C.white, fontSize: 13.5, fontWeight: "700" }}>Try again</Text>
            </Pressable>
          </View>
        ) : !active ? (
          <View style={{ alignItems: "center", paddingTop: 60, paddingHorizontal: 24 }}>
            <Icon name="grid-outline" size={40} color={C.inkMuted} />
            <Text style={{ fontSize: 16, fontWeight: "700", color: C.ink, marginTop: 12 }}>No floor plan yet</Text>
            <Text style={{ fontSize: 12.5, color: C.inkMuted, textAlign: "center", marginTop: 6, lineHeight: 20 }}>
              Your manager can draw the tables in the Swiftab dashboard. They will appear here straight away.
            </Text>
          </View>
        ) : (
          <>
            <View style={{ flexDirection: "row", gap: 10, marginBottom: 14 }}>
              <Count status="free" value={data?.counts.free ?? 0} />
              <Count status="reserved" value={data?.counts.reserved ?? 0} />
              <Count status="occupied" value={data?.counts.occupied ?? 0} />
            </View>

            {floors.length > 1 && (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingBottom: 12 }}>
                {floors.map((floor) => {
                  const on = floor.id === active.id;
                  const busy = tables.filter((t) => t.floorId === floor.id && t.live.status !== "free").length;
                  return (
                    <Pressable
                      key={floor.id}
                      accessibilityRole="tab"
                      accessibilityState={{ selected: on }}
                      onPress={() => {
                        feedback.tap();
                        setFloorId(floor.id);
                        setSelectedId(null);
                      }}
                      style={{ height: 38, paddingHorizontal: 14, borderRadius: 19, justifyContent: "center", backgroundColor: on ? C.accent : C.card, borderWidth: 1, borderColor: on ? C.accent : C.cardBorder }}
                    >
                      <Text style={{ fontSize: 11.5, fontWeight: "700", color: on ? C.white : C.ink }}>
                        {floor.name}
                        {busy ? ` · ${busy} busy` : ""}
                      </Text>
                    </Pressable>
                  );
                })}
              </ScrollView>
            )}

            <FloorMap tables={floorTables} selectedId={selectedId} onSelect={(table) => setSelectedId(table.id === selectedId ? null : table.id)} />

            {selected ? (
              <TableCard table={selected} floorName={active.name} />
            ) : (
              <Text style={{ fontSize: 11.5, color: C.inkMuted, textAlign: "center", marginTop: 16 }}>Tap a table to see who is there.</Text>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}
