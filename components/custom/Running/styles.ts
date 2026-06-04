import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        flex: 1,
    },
    metricsContainer: {
        position: "absolute",
        top: 10, // Ajustado para ficar abaixo do campo de pesquisa
        left: 0,
        right: 0,
        padding: 15,
        borderRadius: 10,
        margin: 10,
        zIndex: 0,
    },
    metricText: {
        fontSize: 18,
        marginBottom: 5,
        fontWeight: "bold",
    },
    button: {
        position: "absolute",
        alignSelf: "center",
        width: 110,
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 30,
        elevation: 5,
    },
    buttonText: {
        fontSize: 18,
        fontWeight: "bold",
    },
    // Estilos para o triângulo da seta
    arrowContainer: {
        alignItems: "center",
        justifyContent: "center",
        width: 20, // Reduzido
        height: 20, // Reduzido
    },
    arrowHead: {
        width: 0,
        height: 0,
        backgroundColor: "transparent",
        borderStyle: "solid",
        borderLeftWidth: 10, // Reduzido
        borderRightWidth: 10, // Reduzido
        borderBottomWidth: 20, // Reduzido
        borderLeftColor: "transparent",
        borderRightColor: "transparent",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1,
        elevation: 2,
    },
    // Botão de centralizar
    centerButton: {
        position: "absolute",
        bottom: 130,
        right: 20,
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: "center",
        alignItems: "center",
        elevation: 5,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
    },
    centerButtonInner: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
    },
    centerDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
    },
    // Estilos para o campo de pesquisa
    searchContainer: {
        position: "absolute",
        top: 40,
        left: 10,
        right: 10,
        padding: 10,
        borderRadius: 10,
        elevation: 5,

        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        zIndex: 10,
    },
    searchInputContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderRadius: 8,
        borderWidth: 1,
        paddingHorizontal: 10,
        zIndex: 10,
    },
    searchInput: {
        minWidth: "92%",
        height: 40,
        fontSize: 16,
        paddingVertical: 8,
    },
    searchIcon: {
        padding: 5,
        zIndex: 11,
    },
    // Estilos para os resultados da pesquisa
    searchResultsContainer: {
        position: "absolute",
        top: 120, // Ajuste este valor para que fique logo abaixo do searchContainer
        left: 10,
        right: 1,
        borderRadius: 10,
        padding: 10,
        elevation: 5,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        zIndex: 9, // Mantenha o z-index para garantir que fique acima do metricsContainer
    },
    searchResultItem: {
        flexDirection: "row",
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderBottomWidth: 1,
    },
    resultIconContainer: {
        marginRight: 10,
        justifyContent: "center",
    },
    resultTextContainer: {
        flex: 1,
    },
    searchResultText: {
        fontSize: 16,
        fontWeight: "500",
    },
    searchResultSubText: {
        fontSize: 14,
        marginTop: 2,
    },
    searchLoader: {
        padding: 20,
        alignSelf: "center",
    },
    clearRouteButton: {
        marginTop: 8,
        alignSelf: "flex-end",
        paddingVertical: 5,
        paddingHorizontal: 10,
    },
    clearRouteText: {
        fontSize: 14,
        fontWeight: "500",
    },
    // Estilos para a barra de progresso
    progressContainer: {
        position: "absolute",
        bottom: 5,
        left: 10,
        right: 10,
        padding: 8,
        borderRadius: 8,
        elevation: 3,
    },
    progressBar: {
        height: 8,
        borderRadius: 4,
        overflow: "hidden",
    },
    progressFill: {
        height: "100%",
        borderRadius: 4,
    },
    progressText: {
        marginTop: 5,
        textAlign: "center",
        fontSize: 12,
        fontWeight: "600",
    },
    // Estilos para o indicador de carregamento
    loadingContainer: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: "center",
        alignItems: "center",
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        fontWeight: "bold",
    },
    ballHeadContainer: {
        alignItems: "center" as const,
        justifyContent: "center" as const,
        width: 20, // Reduced
        height: 20, // Reduced
    },
    ballHead: {
        height: 14, // Reduced
        width: 14, // Reduced
        borderRadius: 7, // Reduced
        borderWidth: 2,
        elevation: 5,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
    },
});