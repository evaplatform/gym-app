import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import MapView, { Polyline, PROVIDER_GOOGLE, Marker } from "react-native-maps";
import { hexToRgba } from "@/shared/utils/hexToRgba";
import useCustomStyle from "@/hooks/useCustomStyle";
import Text from "@/components/custom/Text";
import { IExerciseHistory } from "@/shared/models/IExerciseHistory";

interface RouteHistoryMapProps {
  historyItem: IExerciseHistory;
}

export default function RouteHistoryMap({ historyItem }: RouteHistoryMapProps) {
  const mapRef = useRef<MapView>(null);
  const { colors } = useCustomStyle();
  const [isMapReady, setIsMapReady] = useState(false);

  const routePoints = historyItem.routePoints || [];
  const hasRoute = routePoints.length > 0;

  useEffect(() => {
    if (isMapReady && hasRoute && mapRef.current) {
      // Ajusta a câmera para mostrar toda a rota
      const coordinates = routePoints.map((point) => ({
        latitude: point.latitude,
        longitude: point.longitude,
      }));

      mapRef.current.fitToCoordinates(coordinates, {
        edgePadding: {
          top: 50,
          right: 50,
          bottom: 50,
          left: 50,
        },
        animated: true,
      });
    }
  }, [isMapReady, hasRoute, routePoints]);

  if (!hasRoute) {
    return (
      <View style={styles.emptyContainer}>
        
        <Text style={styles.emptyText}>
          
          Nenhum percurso registrado para este exercício
        </Text>
      </View>
    );
  }

  const startPoint = routePoints[0];
  const endPoint = routePoints[routePoints.length - 1];

  return (
    <View style={styles.container}>
      
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        showsUserLocation={false}
        followsUserLocation={false}
        showsCompass={true}
        showsScale={true}
        showsPointsOfInterest={false}
        showsTraffic={false}
        rotateEnabled={false}
        pitchEnabled={false}
        zoomEnabled={true}
        scrollEnabled={true}
        showsBuildings={false}
        onMapReady={() => setIsMapReady(true)}
        toolbarEnabled={false}
        moveOnMarkerPress={false}
      >
        
        {/* Linha do percurso */}
        <Polyline
          coordinates={routePoints.map((point) => ({
            latitude: point.latitude,
            longitude: point.longitude,
          }))}
          strokeWidth={4}
          strokeColor={hexToRgba(colors.tint, 0.8)}
          lineCap="round"
          lineJoin="round"
        />
        {/* Marcador de início */}
        <Marker
          coordinate={{
            latitude: startPoint.latitude,
            longitude: startPoint.longitude,
          }}
          title="Início"
          pinColor={colors.notification.success}
        />
        {/* Marcador de fim */}
        <Marker
          coordinate={{
            latitude: endPoint.latitude,
            longitude: endPoint.longitude,
          }}
          title="Fim"
          pinColor={colors.notification.danger}
        />
      </MapView>
      {!isMapReady && (
        <View style={styles.loadingContainer}>
          
          <ActivityIndicator size="large" color={colors.tint} />
          <Text style={[styles.loadingText, { color: colors.text }]}>
            
            Carregando mapa...
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 400,
    borderRadius: 10,
    overflow: "hidden",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  emptyContainer: {
    width: "100%",
    height: 400,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
  },
  emptyText: {
    fontSize: 16,
    textAlign: "center",
    padding: 20,
  },
  loadingContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
  },
});
