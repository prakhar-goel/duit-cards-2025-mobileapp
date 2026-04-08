import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

type Contact = {
  id: string;
  name: string;
  role: string;
  company: string;
  email: string;
  phone: string;
  tags: string[];
  notes: string;
  interactions: string[];
  lastSeen: string;
  favorite: boolean;
};

type Reminder = {
  id: string;
  title: string;
  person: string;
  dueIn: string;
  urgency: "High" | "Medium" | "Low";
  completed: boolean;
};

const CONTACTS: Contact[] = [
  {
    id: "1",
    name: "Aisha Rahman",
    role: "Product Lead",
    company: "Flow Labs",
    email: "aisha@flowlabs.com",
    phone: "+62 812 1033 1190",
    tags: ["Product", "Potential Partner"],
    notes: "Interested in co-hosting a design workshop next month.",
    interactions: ["Met at Jakarta Design Week", "Sent proposal deck"],
    lastSeen: "2 days ago",
    favorite: true,
  },
  {
    id: "2",
    name: "Daniel Kurnia",
    role: "Engineering Manager",
    company: "ByteForge",
    email: "daniel@byteforge.ai",
    phone: "+62 811 9832 021",
    tags: ["Tech", "Hiring"],
    notes: "Looking for frontend collaboration and referrals.",
    interactions: ["Call on Monday", "Shared hiring document"],
    lastSeen: "5 days ago",
    favorite: false,
  },
  {
    id: "3",
    name: "Mira Santoso",
    role: "Founder",
    company: "Sora Studio",
    email: "mira@sorastudio.id",
    phone: "+62 822 7003 992",
    tags: ["Investor", "Design"],
    notes: "Warm intro needed to growth consultant.",
    interactions: ["Coffee chat", "Follow up pending"],
    lastSeen: "Yesterday",
    favorite: true,
  },
];

const INITIAL_REMINDERS: Reminder[] = [
  {
    id: "r1",
    title: "Send partnership draft",
    person: "Aisha Rahman",
    dueIn: "Today",
    urgency: "High",
    completed: false,
  },
  {
    id: "r2",
    title: "Schedule check-in call",
    person: "Mira Santoso",
    dueIn: "Tomorrow",
    urgency: "Medium",
    completed: false,
  },
  {
    id: "r3",
    title: "Congratulate on product launch",
    person: "Daniel Kurnia",
    dueIn: "In 3 days",
    urgency: "Low",
    completed: false,
  },
];

type HomeStackParamList = {
  Home: undefined;
  ContactDetail: { contactId: string };
};

type TabsParamList = {
  Dashboard: undefined;
  AddCard: undefined;
  Reminders: undefined;
  MyCard: undefined;
};

const HomeStack = createNativeStackNavigator<HomeStackParamList>();
const Tabs = createBottomTabNavigator<TabsParamList>();

const appTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "#F5F7FB",
    card: "#FFFFFF",
    text: "#111827",
    primary: "#3563E9",
    border: "#E5E9F2",
  },
};

function chipColor(urgency: Reminder["urgency"]) {
  if (urgency === "High") return "#FFE6E6";
  if (urgency === "Medium") return "#FFF6DD";
  return "#E6F5EC";
}

function DashboardScreen({
  contacts,
  onOpenContact,
}: {
  contacts: Contact[];
  onOpenContact: (id: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"Recent" | "Favorites" | "Tags">("Recent");

  const visibleContacts = useMemo(() => {
    let list = contacts.filter(
      (c) =>
        c.name.toLowerCase().includes(query.toLowerCase()) ||
        c.company.toLowerCase().includes(query.toLowerCase())
    );
    if (filter === "Favorites") list = list.filter((c) => c.favorite);
    if (filter === "Tags") list = list.filter((c) => c.tags.length > 0);
    return list;
  }, [contacts, filter, query]);

  return (
    <SafeAreaView style={styles.screen} edges={["left", "right"]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.page}>
        <Text style={styles.title}>Duit Cards</Text>
        <Text style={styles.subtitle}>Your relationship dashboard</Text>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search contacts"
          placeholderTextColor="#8A93A6"
          style={styles.search}
        />
        <View style={styles.filtersRow}>
          {(["Recent", "Favorites", "Tags"] as const).map((item) => (
            <Pressable
              key={item}
              onPress={() => setFilter(item)}
              style={[styles.filterChip, filter === item && styles.filterChipActive]}
            >
              <Text style={[styles.filterText, filter === item && styles.filterTextActive]}>
                {item}
              </Text>
            </Pressable>
          ))}
        </View>
        {visibleContacts.map((contact) => (
          <Pressable key={contact.id} style={styles.card} onPress={() => onOpenContact(contact.id)}>
            <View>
              <Text style={styles.cardName}>{contact.name}</Text>
              <Text style={styles.cardMeta}>
                {contact.role} - {contact.company}
              </Text>
              <Text style={styles.cardSeen}>Last interaction: {contact.lastSeen}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </Pressable>
        ))}
      </ScrollView>
      <Pressable style={styles.fab}>
        <Ionicons name="add" size={26} color="#fff" />
      </Pressable>
    </SafeAreaView>
  );
}

function AddCardScreen() {
  return (
    <SafeAreaView style={styles.screen} edges={["left", "right"]}>
      <ScrollView contentContainerStyle={styles.page}>
        <Text style={styles.title}>Add Card</Text>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Scan Card</Text>
          <View style={styles.scanMock}>
            <Ionicons name="scan-outline" size={36} color="#3563E9" />
            <Text style={styles.scanText}>Camera scanner preview (mock)</Text>
          </View>
        </View>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Manual Entry</Text>
          {["Name", "Role", "Company", "Email", "Phone"].map((field) => (
            <TextInput key={field} placeholder={field} placeholderTextColor="#8A93A6" style={styles.input} />
          ))}
          <Pressable style={styles.secondaryBtn}>
            <Text style={styles.secondaryBtnText}>Upload Photo</Text>
          </Pressable>
          <Pressable style={styles.primaryBtn}>
            <Text style={styles.primaryBtnText}>Save Card</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function ContactDetailScreen({ contact }: { contact: Contact }) {
  return (
    <SafeAreaView style={styles.screen} edges={["left", "right"]}>
      <ScrollView contentContainerStyle={styles.page}>
        <View style={styles.profileCard}>
          <Text style={styles.cardName}>{contact.name}</Text>
          <Text style={styles.cardMeta}>
            {contact.role} - {contact.company}
          </Text>
          <Text style={styles.contactDetail}>{contact.email}</Text>
          <Text style={styles.contactDetail}>{contact.phone}</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Notes</Text>
          <Text style={styles.bodyText}>{contact.notes}</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Tags</Text>
          <View style={styles.tagsWrap}>
            {contact.tags.map((tag) => (
              <View key={tag} style={styles.tagPill}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        </View>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Interaction History</Text>
          {contact.interactions.map((item) => (
            <Text key={item} style={styles.bodyText}>
              - {item}
            </Text>
          ))}
        </View>
        <Pressable style={styles.primaryBtn}>
          <Text style={styles.primaryBtnText}>Remind me</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

function RemindersScreen() {
  const [items, setItems] = useState(INITIAL_REMINDERS);
  const ordered = [...items].sort((a, b) => {
    const rank = { High: 0, Medium: 1, Low: 2 };
    return rank[a.urgency] - rank[b.urgency];
  });

  return (
    <SafeAreaView style={styles.screen} edges={["left", "right"]}>
      <View style={styles.page}>
        <Text style={styles.title}>Reminders</Text>
        <FlatList
          data={ordered}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 140 }}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.reminderHeader}>
                <Text style={styles.sectionTitle}>{item.title}</Text>
                <View style={[styles.urgency, { backgroundColor: chipColor(item.urgency) }]}>
                  <Text style={styles.urgencyText}>{item.urgency}</Text>
                </View>
              </View>
              <Text style={styles.bodyText}>{item.person}</Text>
              <Text style={styles.cardSeen}>Due: {item.dueIn}</Text>
              <View style={styles.actions}>
                <Pressable style={styles.secondaryBtn}>
                  <Text style={styles.secondaryBtnText}>Snooze</Text>
                </Pressable>
                <Pressable
                  style={styles.primaryBtnSmall}
                  onPress={() => setItems((curr) => curr.filter((r) => r.id !== item.id))}
                >
                  <Text style={styles.primaryBtnText}>Complete</Text>
                </Pressable>
              </View>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

function MyCardScreen() {
  return (
    <SafeAreaView style={styles.screen} edges={["left", "right"]}>
      <View style={styles.page}>
        <Text style={styles.title}>My Card</Text>
        <View style={styles.profileCard}>
          <Text style={styles.cardName}>Prakhar Goel</Text>
          <Text style={styles.cardMeta}>Full-Stack Engineer & Product Designer</Text>
          <Text style={styles.contactDetail}>prakhar@duitcards.app</Text>
          <Text style={styles.contactDetail}>+62 812 0000 1234</Text>
          <Text style={styles.contactDetail}>duitcards.app/prakhar</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Share</Text>
          <View style={styles.qrMock}>
            <Ionicons name="qr-code-outline" size={84} color="#111827" />
          </View>
          <View style={styles.actions}>
            <Pressable style={styles.secondaryBtn}>
              <Text style={styles.secondaryBtnText}>Share Link</Text>
            </Pressable>
            <Pressable style={styles.primaryBtnSmall}>
              <Text style={styles.primaryBtnText}>Show QR</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

function DashboardStack({ contacts }: { contacts: Contact[] }) {
  return (
    <HomeStack.Navigator
      screenOptions={{
        headerShadowVisible: false,
        headerStyle: { backgroundColor: "#F5F7FB" },
        headerTitleStyle: { fontWeight: "700", color: "#111827" },
      }}
    >
      <HomeStack.Screen name="Home" options={{ headerShown: false }}>
        {({ navigation }) => (
          <DashboardScreen contacts={contacts} onOpenContact={(id) => navigation.navigate("ContactDetail", { contactId: id })} />
        )}
      </HomeStack.Screen>
      <HomeStack.Screen
        name="ContactDetail"
        options={{ title: "Contact Detail" }}
      >
        {({ route }) => {
          const contact = contacts.find((c) => c.id === route.params.contactId) ?? contacts[0];
          return <ContactDetailScreen contact={contact} />;
        }}
      </HomeStack.Screen>
    </HomeStack.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer theme={appTheme}>
        <StatusBar style="dark" />
        <Tabs.Navigator
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarActiveTintColor: "#3563E9",
            tabBarInactiveTintColor: "#97A1B3",
            tabBarStyle: {
              height: 78,
              paddingBottom: 8,
              paddingTop: 8,
              borderTopColor: "#E5E9F2",
              backgroundColor: "#FFFFFF",
            },
            tabBarIcon: ({ color, size }) => {
              const icons: Record<keyof TabsParamList, keyof typeof Ionicons.glyphMap> = {
                Dashboard: "grid-outline",
                AddCard: "add-circle-outline",
                Reminders: "notifications-outline",
                MyCard: "person-circle-outline",
              };
              return <Ionicons name={icons[route.name as keyof TabsParamList]} size={size} color={color} />;
            },
          })}
        >
          <Tabs.Screen name="Dashboard" options={{ title: "Home" }}>
            {() => <DashboardStack contacts={CONTACTS} />}
          </Tabs.Screen>
          <Tabs.Screen name="AddCard" component={AddCardScreen} options={{ title: "Add" }} />
          <Tabs.Screen name="Reminders" component={RemindersScreen} />
          <Tabs.Screen name="MyCard" component={MyCardScreen} options={{ title: "My Card" }} />
        </Tabs.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F5F7FB" },
  page: { paddingHorizontal: 20, paddingTop: 12, gap: 14 },
  title: { fontSize: 30, fontWeight: "800", color: "#111827" },
  subtitle: { fontSize: 15, color: "#6B7280", marginTop: -4, marginBottom: 4 },
  search: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#E5E9F2",
    fontSize: 15,
  },
  filtersRow: { flexDirection: "row", gap: 10, marginBottom: 4 },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "#EDF1F8",
  },
  filterChipActive: { backgroundColor: "#DDE7FF" },
  filterText: { color: "#64748B", fontWeight: "600" },
  filterTextActive: { color: "#2D4EB7" },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E5E9F2",
    shadowColor: "#0F172A",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 7 },
    shadowRadius: 16,
    elevation: 2,
  },
  profileCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: "#E5E9F2",
  },
  cardName: { fontSize: 20, fontWeight: "700", color: "#0F172A" },
  cardMeta: { marginTop: 4, fontSize: 14, color: "#64748B" },
  cardSeen: { marginTop: 8, color: "#94A3B8", fontSize: 13 },
  sectionTitle: { fontSize: 16, fontWeight: "700", color: "#111827", marginBottom: 8 },
  input: {
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E9F2",
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 10,
  },
  scanMock: {
    borderWidth: 2,
    borderColor: "#C6D6FF",
    borderStyle: "dashed",
    borderRadius: 14,
    paddingVertical: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F8FAFF",
  },
  scanText: { marginTop: 8, color: "#5171D2", fontWeight: "500" },
  primaryBtn: {
    marginTop: 8,
    backgroundColor: "#3563E9",
    borderRadius: 12,
    alignItems: "center",
    paddingVertical: 13,
  },
  primaryBtnSmall: {
    flex: 1,
    backgroundColor: "#3563E9",
    borderRadius: 12,
    alignItems: "center",
    paddingVertical: 12,
  },
  primaryBtnText: { color: "#FFFFFF", fontWeight: "700" },
  secondaryBtn: {
    flex: 1,
    borderColor: "#C7D3F1",
    borderWidth: 1,
    borderRadius: 12,
    alignItems: "center",
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
  },
  secondaryBtnText: { color: "#3558B9", fontWeight: "700" },
  contactDetail: { marginTop: 6, color: "#4B5563", fontSize: 14 },
  bodyText: { color: "#4B5563", lineHeight: 20, marginBottom: 4 },
  tagsWrap: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  tagPill: { backgroundColor: "#EEF3FF", borderRadius: 999, paddingHorizontal: 12, paddingVertical: 7 },
  tagText: { color: "#3558B9", fontWeight: "600", fontSize: 12 },
  reminderHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 8 },
  urgency: { borderRadius: 999, paddingHorizontal: 10, paddingVertical: 5 },
  urgencyText: { fontWeight: "700", color: "#334155", fontSize: 12 },
  actions: { flexDirection: "row", gap: 10, marginTop: 14 },
  qrMock: {
    height: 180,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E9F2",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F8FAFC",
    marginBottom: 10,
  },
  fab: {
    position: "absolute",
    right: 22,
    bottom: 32,
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: "#3563E9",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#1F3B8A",
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 20,
    elevation: 4,
  },
});
