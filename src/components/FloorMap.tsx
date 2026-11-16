import { Ionicons } from "@react-native-vector-icons/ionicons";
import { useMemo, useState } from "react";
import { LayoutChangeEvent, Pressable, ScrollView, Text, View } from "react-native";

import { C } from "@/constants/theme";
import { feedback } from "@/lib/feedback";
import { floorBounds, seatPositions } from "@/lib/floor";
import type { LiveTable, TableLiveStatus } from "@/types";

export const TABLE_LOOK: Record<TableLiveStatus, { label: string; fill: string; stroke: string; chair: string; text: string }> = {
  free: { label: "Free", fill: C.card, stroke: C.accent, chair: "#9CCFC9", text: C.ink },
  reserved: { label: "Reserved", fill: C.amberPale, stroke: C.amber, chair: "#E4B98A", text: C.amber },
  occupied: { label: "Occupied", fill: C.accent, stroke: C.accentDeep, chair: C.accentDeep, text: C.white },
};

/** Zoom steps: the whole floor first, then closer. */
const ZOOMS = [1, 1.6, 2.4];

/**
 * One floor as the restaurant drew it in the dashboard: every table at its
 * position, size and angle, one chair per seat, coloured by what is
 * happening at it right now.
 */
export default function FloorMap({
  tables,
  selectedId,
  onSelect,
}: {
  tables: LiveTable[];
  selectedId: string | null;
  onSelect: (table: LiveTable) => void;
}) {
  const [frame, setFrame] = useState(0);
  const [zoom, setZoom] = useState(0);
  const bounds = useMemo(() => floorBounds(tables), [tables]);

  const scale = frame > 0 ? Math.min(0.95, frame / bounds.width) * ZOOMS[zoom] : 0;
  const width = Math.max(frame, bounds.width * scale);
  const height = bounds.height * scale;
  const offsetX = (width - bounds.width * scale) / 2;

  return (
    <View>
      <View
        onLayout={(event: LayoutChangeEvent) => setFrame(event.nativeEvent.layout.width)}
        style={{ borderRadius: 20, backgroundColor: "#EFE4CC", borderWidth: 1, borderColor: C.cardBorder, overflow: "hidden" }}
      >
        {frame > 0 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} bounces={false}>
            <ScrollView nestedScrollEnabled showsVerticalScrollIndicator={false} bounces={false} style={{ maxHeight: 420 }}>
              <View style={{ width, height }}>
                {tables.map((table) => {
                  const look = TABLE_LOOK[table.live.status] ?? TABLE_LOOK.free;
                  const w = table.size.width * scale;
                  const h = table.size.height * scale;
                  const rotation = table.rotation ?? 0;
                  const selected = table.id === selectedId;
                  const fontSize = Math.max(9, Math.min(13, Math.min(w, h) * 0.34));
                  return (
                    <Pressable
                      key={table.id}
                      testID={`floor-table-${table.name}`}
                      accessibilityRole="button"
                      accessibilityLabel={`Table ${table.name}, ${look.label}, ${table.seats} seats`}
                      onPress={() => {
                        feedback.tap();
                        onSelect(table);
                      }}
                      style={{
                        position: "absolute",
                        left: offsetX + (table.position.x - bounds.x) * scale,
                        top: (table.position.y - bounds.y) * scale,
                        width: w,
                        height: h,
                        transform: [{ rotate: `${rotation}deg` }],
                      }}
                    >
                      {seatPositions(table).map((seat, index) => (
                        <View
                          key={index}
                          style={{
                            position: "absolute",
                            left: (seat.x - 12) * scale,
                            top: (seat.y - 7) * scale,
                            width: 24 * scale,
                            height: 14 * scale,
                            borderRadius: 6 * scale,
                            backgroundColor: look.chair,
                            transform: [{ rotate: `${seat.rotation}deg` }],
                          }}
                        />
                      ))}
                      <View
                        style={{
                          flex: 1,
                          borderRadius: table.shape === "round" ? w / 2 : 12 * scale,
                          backgroundColor: look.fill,
                          borderWidth: selected ? 3 : 1.5,
                          borderColor: selected ? C.ink : look.stroke,
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {/* The name stays upright however the table is turned. */}
                        <Text
                          numberOfLines={1}
                          style={{ fontSize, fontWeight: "800", color: look.text, transform: [{ rotate: `${-rotation}deg` }] }}
                        >
                          {table.name}
                        </Text>
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            </ScrollView>
          </ScrollView>
        )}
      </View>

      <View style={{ flexDirection: "row", alignItems: "center", marginTop: 10 }}>
        <View style={{ flex: 1, flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
          {(Object.keys(TABLE_LOOK) as TableLiveStatus[]).map((status) => (
            <View key={status} style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
              <View
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: 4,
                  backgroundColor: TABLE_LOOK[status].fill,
                  borderWidth: 1.5,
                  borderColor: TABLE_LOOK[status].stroke,
                }}
              />
              <Text style={{ fontSize: 12, fontWeight: "600", color: C.inkMuted }}>{TABLE_LOOK[status].label}</Text>
            </View>
          ))}
        </View>
        <View style={{ flexDirection: "row", gap: 8 }}>
          {(
            [
              { icon: "remove", label: "Zoom out", step: -1 },
              { icon: "add", label: "Zoom in", step: 1 },
            ] as const
          ).map((button) => (
            <Pressable
              key={button.label}
              accessibilityRole="button"
              accessibilityLabel={button.label}
              hitSlop={6}
              onPress={() => setZoom((z) => Math.min(ZOOMS.length - 1, Math.max(0, z + button.step)))}
              style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: C.card, borderWidth: 1, borderColor: C.cardBorder, alignItems: "center", justifyContent: "center" }}
            >
              <Ionicons name={button.icon} size={16} color={C.ink} />
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  );
}
