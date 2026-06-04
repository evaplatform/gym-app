import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  useColorScheme,
} from "react-native";
import { Colors } from "@/shared/constants/Colors";

export type TabsType = {
  title: string;
  content: React.ReactNode;
};

export type TabsProps = {
  tabs: TabsType[];
  displayNoneHiddenTabs?: boolean;
};

function Tabs({ tabs, displayNoneHiddenTabs }: TabsProps) {
  const [activeTab, setActiveTab] = useState(0);
  const colorScheme = useColorScheme();
  const theme = useMemo(() => colorScheme ?? "light", [colorScheme]);

  const customStyle = useMemo(() => {
    return {
      container: {
        backgroundColor: Colors[theme].background,
      },
      tabsContainer: {
        backgroundColor: Colors[theme].gray200,
        shadowColor: Colors[theme].gray400,
      },
      activeTabButton: {
        borderBottomColor: Colors[theme].tint,
      },
      activeTabButtonText: {
        color: Colors[theme].tint,
      },
      tabButtonText: {
        color: Colors[theme].text,
      },
    };
  }, [theme]);

  return (
    <View style={[styles.container, customStyle.container]}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scrollViewStyle}
        contentContainerStyle={[
          styles.tabsContainer,
          customStyle.tabsContainer,
        ]}
      >
        {tabs.map((tab: TabsType, index: number) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.tabButton,
              activeTab === index && customStyle.activeTabButton,
            ]}
            onPress={() => setActiveTab(index)}
          >
            <Text
              style={[
                styles.tabButtonText,
                customStyle.tabButtonText,
                activeTab === index && customStyle.activeTabButtonText,
                activeTab === index && styles.activeTabButtonText,
              ]}
            >
              {tab.title}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Conteúdo da Tab Ativa */}
      {!displayNoneHiddenTabs && (
        <View style={[styles.contentContainer]}>{tabs[activeTab].content}</View>
      )}

      {displayNoneHiddenTabs && (
        <View style={[styles.contentContainer]}>
          {tabs.map((tab: TabsType, index: number) => (
            <View
              key={index}
              style={{ display: activeTab === index ? "flex" : "none" }}
            >
              {tab.content}
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flexGrow: 0,
    width: "100%",
    alignItems: "flex-start",
    gap: 20,
  },
  scrollViewStyle: {
    flexGrow: 0,
    width: "100%",
  },
  tabsContainer: {
    height: 50,
    flexDirection: "row",
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  tabButton: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 3,
    borderBottomColor: "transparent",
  },
  tabButtonText: {
    fontSize: 14,
    fontWeight: "500",
  },
  activeTabButtonText: {
    fontWeight: "bold",
  },
  contentContainer: {
    width: "100%",
    flexShrink: 1,
    paddingHorizontal: 4,
    paddingTop: 6,
  },
});

export default Tabs;
