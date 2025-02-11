import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  FlatList,
} from "react-native";
import { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import apiClient from "../../axiosConfig";
import TaksavimoForma from "../../components/TaksavimoForma";
import SklypoForma from "../../components/SklypoForma";
import AikstelesForma from "../../components/AikstelesForma";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";

interface Miskas {
  id: number;
  pavadinimas: string;
  galiutine_kubatura: string;
  skalsumas: string;
}

export default function TaksavimasScreen() {
  const [miskai, setMiskai] = useState<Miskas[]>([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingMiskas, setEditingMiskas] = useState<Miskas | null>(null);
  const [isSklypoFormaVisible, setIsSklypoFormaVisible] = useState(false);
  const [selectedMiskoId, setSelectedMiskoId] = useState<number | null>(null);

  // Gauti visus miškus
  useEffect(() => {
    const fetchMiskai = async () => {
      try {
        // Gauname token'ą
        const token = await AsyncStorage.getItem("userToken");
        if (!token) {
          console.log("Nėra token");
          return;
        }

        // Ištraukiame userId iš token'o
        const decoded: any = jwtDecode(token);
        const userId = decoded.userId;

        console.log("Bandoma gauti miškus userID:", userId);
        const response = await apiClient.get(`/miskas/user/${userId}`);
        console.log("Gauti miškai:", response.data);
        setMiskai(response.data.data); // Pridėjau .data nes backend grąžina { success: true, data: [...] }
      } catch (error) {
        console.error("Klaida:", error);
        Alert.alert("Klaida", "Nepavyko gauti miškų sąrašo");
      }
    };
    fetchMiskai();
  }, []);

  const handleEdit = (miskas: Miskas) => {
    setEditingMiskas(miskas);
    setIsFormVisible(true);
  };

  const handleAdd = () => {
    setEditingMiskas(null);
    setIsFormVisible(true);
  };

  const handleFormSubmit = async (formData: { pavadinimas: string }) => {
    try {
      if (editingMiskas) {
        // Redagavimas
        await apiClient.put(
          `/miskas/atnaujinti-miska/${editingMiskas.id}`,
          formData
        );
        setMiskai(
          miskai.map((m) =>
            m.id === editingMiskas.id
              ? { ...m, pavadinimas: formData.pavadinimas }
              : m
          )
        );
        Alert.alert("Sėkmė", "Miškas sėkmingai atnaujintas");
      } else {
        // Pridėjimas
        const token = await AsyncStorage.getItem("userToken");
        const response = await apiClient.post(
          "/miskas/sukurti-miskas",
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setMiskai([...miskai, response.data.data]); // Pridėjau .data nes backend grąžina { success: true, data: [...] }
        Alert.alert("Sėkmė", "Miškas sėkmingai pridėtas");
      }
      setIsFormVisible(false);
    } catch (error) {
      console.error("Klaida:", error);
      Alert.alert("Klaida", "Nepavyko išsaugoti duomenų");
    }
  };

  const handleDeleteMiskas = (id: number) => {
    Alert.alert(
      "Patvirtinimas",
      "Ar tikrai norite ištrinti šį mišką?",
      [
        {
          text: "Atšaukti",
          style: "cancel",
        },
        {
          text: "Ištrinti",
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem("userToken");
              await apiClient.delete(`/miskas/istrinti-miska/${id}`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });
              setMiskai(miskai.filter((m) => m.id !== id));
              Alert.alert("Sėkmė", "Miškas sėkmingai ištrintas");
            } catch (error) {
              console.error("Klaida ištrinant mišką:", error);
              Alert.alert("Klaida", "Nepavyko ištrinti miško");
            }
          },
          style: "destructive",
        },
      ],
      { cancelable: true }
    );
  };

  const renderMiskas = ({ item }: { item: Miskas }) => (
    <View style={styles.miskoKorta}>
      <View style={styles.miskoHeader}>
        <Text style={styles.miskoPavadinimas}>{item.pavadinimas}</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={() => handleEdit(item)}
            style={styles.iconButton}
          >
            <Ionicons name="pencil" size={20} color="#4CAF50" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleDeleteMiskas(item.id)}
            style={styles.iconButton}
          >
            <Ionicons name="trash" size={20} color="#FF0000" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={miskai}
        renderItem={renderMiskas}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={
          <Text style={styles.title}>Ištaksuoti miškai</Text>
        }
      />

      <TouchableOpacity style={styles.pridetiButton} onPress={handleAdd}>
        <Text style={styles.buttonText}>Pridėti mišką</Text>
      </TouchableOpacity>

      <TaksavimoForma
        visible={isFormVisible}
        onClose={() => setIsFormVisible(false)}
        onSubmit={handleFormSubmit}
        initialData={editingMiskas}
      />

      <SklypoForma
        visible={isSklypoFormaVisible}
        onClose={() => setIsSklypoFormaVisible(false)}
        miskoId={selectedMiskoId}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 20,
    textAlign: "center",
    color: "#333",
    fontFamily: "SpaceMono",
  },
  miskoKorta: {
    backgroundColor: "white",
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  miskoHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 10,
  },
  iconButton: {
    padding: 5,
  },
  miskoPavadinimas: {
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: "SpaceMono",
    color: "#2f2f2f",
    flex: 1,
  },
  miskoInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  infoText: {
    fontSize: 14,
    color: "#666",
    fontFamily: "SpaceMono",
  },
  pridetiButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 15,
    borderRadius: 10,
    margin: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: "SpaceMono",
  },
});
