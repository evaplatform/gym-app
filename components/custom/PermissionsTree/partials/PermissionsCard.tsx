import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import Text from "@/components/custom/Text";
import { Ionicons } from "@expo/vector-icons";
import PermissionPill from "./PermissionPill";
import useCustomStyle from "@/hooks/useCustomStyle";

// Obtém a largura da tela para cálculos responsivos
const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface PermissionCardProps {
  title: string;
  isPermitted: boolean;
  onTogglePermission: (value: boolean) => void;
  hasChildren: boolean;
  children?: React.ReactNode;
  depth?: number;
  maxDepth?: number; // Define a profundidade máxima antes de mudar o layout
}

const PermissionCard = ({
  title,
  isPermitted,
  onTogglePermission,
  hasChildren,
  children,
  depth = 0,
  maxDepth = 3, // Valor padrão para profundidade máxima
}: PermissionCardProps) => {
  const { colors } = useCustomStyle();
  const [isExpanded, setIsExpanded] = useState(false);
  const isDeep = depth >= maxDepth;

  const customStyles = {
    card: {
      backgroundColor: colors.background,
      shadowColor: colors.shadow,
      borderColor: colors.gray500,
      borderWidth: 1,
    },
    deepNestedCard: {
      borderColor: colors.gray500,
      backgroundColor: colors.backgroundSecondary,
    },
    childrenContainer: {
      borderLeftColor: colors.gray500,
    },
    deepChildrenContainer: {
      backgroundColor: colors.backgroundSecondary,
      borderLeftColor: colors.gray500,
    },
  };

  const toggleExpand = () => {
    if (isPermitted && hasChildren) {
      setIsExpanded(!isExpanded);
    }
  };

  const handleTogglePermission = (value: boolean) => {
    onTogglePermission(value);
  };

  // Determina o estilo do card com base na profundidade
  const getCardStyle = () => {
    if (depth === 0) return styles.rootCard;
    if (isDeep) return [styles.deepNestedCard, customStyles.deepNestedCard];
    return styles.childCard;
  };

  return (
    <View style={[styles.card, customStyles.card, getCardStyle()]}>
      {/* Para cards profundos, usamos um layout vertical */}
      <View style={isDeep ? styles.deepCardHeader : styles.cardHeader}>
        <TouchableOpacity
          style={styles.titleContainer}
          onPress={toggleExpand}
          disabled={!isPermitted || !hasChildren}
          activeOpacity={0.7}
        >
          <Text style={[styles.cardTitle, isDeep && styles.smallerTitle]}>
            {title}
          </Text>

          {hasChildren && isPermitted && (
            <Ionicons
              name={isExpanded ? "chevron-up" : "chevron-down"}
              size={isDeep ? 20 : 24}
              color={colors.gray500}
              style={styles.expandIcon}
            />
          )}
        </TouchableOpacity>

        {/* Para cards profundos, colocamos o pill abaixo do título */}
        {isDeep && <View style={styles.pillSpacer} />}

        <PermissionPill
          isPermitted={isPermitted}
          onToggle={handleTogglePermission}
          compact={isDeep}
        />
      </View>

      {isExpanded && isPermitted && hasChildren && (
        <View
          style={[
            styles.childrenContainer,
            customStyles.childrenContainer,
            isDeep && [
              styles.deepChildrenContainer,
              customStyles.deepChildrenContainer,
            ],
          ]}
        >
          {React.Children.map(children, (child) => {
            if (React.isValidElement(child)) {
              return React.cloneElement(child, {
                depth: depth + 1,
                maxDepth,
                ...(child.props as object),
              } as any);
            }
            return child;
          })}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: { 
    borderRadius: 10,
    paddingHorizontal: 5,
    paddingVertical: 15,
    marginVertical: 8,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
     overflow: 'visible'
  },
  rootCard: {
    marginHorizontal: 0,
    marginLeft: 2
  },
  childCard: {
    marginHorizontal: 0,
    marginLeft: 2
  },
  deepNestedCard: {
    padding: 10,
    marginVertical: 5,
    borderWidth: 1,
    shadowOpacity: 0.05,
    elevation: 1,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "nowrap",
  },
  deepCardHeader: {
    // Para níveis profundos, usamos layout vertical para melhor visualização
    flexDirection: "column",
    alignItems: "stretch",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
  },
  smallerTitle: {
    fontSize: 14,
  },
  pillSpacer: {
    height: 8, // Espaço entre o título e o pill em layout vertical
  },
  expandIcon: {
    marginLeft: 10,
  },
  childrenContainer: {
    marginTop: 15,
    paddingLeft: 15,
    borderLeftWidth: 1,
  },
  deepChildrenContainer: {
    marginTop: 10,
    paddingLeft: 10,
    borderRadius: 6,
  },
});

export default PermissionCard;
