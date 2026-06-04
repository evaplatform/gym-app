import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    pageContainer: {},
    container: {
        borderRadius: 12,
        padding: 16,
        margin: 16,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
        overflow: "hidden",
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 16,
        textAlign: "center",
    },
    propertiesContainer: {
        flexDirection: "row",
        marginBottom: 16,
    },
    propertyButton: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        marginRight: 8,
        borderRadius: 20,
    },
    selectedPropertyButton: {},
    propertyButtonText: {
        fontSize: 12,
    },
    selectedPropertyText: {
        fontWeight: "bold",
    },
    chartContainer: {
        alignItems: "center",
        marginTop: 8,
        paddingLeft: 0,
        marginLeft: 0,
    },
    chartScrollContainer: {
        alignItems: "center",
    },
    emptyContainer: {
        height: 220,
        justifyContent: "center",
        alignItems: "center",
    },
    emptyText: {
        fontSize: 16,
    },
    controlsContainer: {
        width: "100%",
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "space-around",
    },
    zoomControlContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
    },
    zoomButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: "center",
        alignItems: "center",
        marginHorizontal: 10,
    },
    zoomText: {
        fontSize: 14,
        fontWeight: "bold",
        marginHorizontal: 8,
    },
    chartWrapper: {},
});
