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

interface Sklypas {
  id: number;
  pavadinimas: string;
  plotas: string;
  kubatura: string;
  skalsumas: string;
  rusineSudetis: string;
  aiksteliuSkaicius: number;
}

export default function TaksavimasScreen() {
  const [miskai, setMiskai] = useState<Miskas[]>([]);
  const [sklypai, setSklypai] = useState<Sklypas[]>([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingMiskas, setEditingMiskas] = useState<Miskas | null>(null);
  const [isSklypoFormaVisible, setIsSklypoFormaVisible] = useState(false);
  const [selectedMiskoId, setSelectedMiskoId] = useState<number | null>(null);

  // MIŠKO API
  const getMiskai = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        console.log("Nėra token");
        return;
      }
      const decoded: any = jwtDecode(token);
      const userId = decoded.userId;

      const response = await apiClient.get(`/miskas/user/${userId}`);
      setMiskai(response.data.data);
    } catch (error) {
      console.error("Klaida:", error);
      Alert.alert("Klaida", "Nepavyko gauti miškų sąrašo");
    }
  };

  const createMiskas = async (formData: { pavadinimas: string }) => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      const response = await apiClient.post(
        "/miskas/sukurti-miskas",
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMiskai([...miskai, response.data.data]);
      Alert.alert("Sėkmė", "Miškas sėkmingai pridėtas");
    } catch (error) {
      Alert.alert("Klaida", "Nepavyko pridėti miško");
    }
  };

  const updateMiskas = async (
    id: number,
    formData: { pavadinimas: string }
  ) => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      await apiClient.put(`/miskas/atnaujinti-miska/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMiskai(
        miskai.map((m) =>
          m.id === id ? { ...m, pavadinimas: formData.pavadinimas } : m
        )
      );
      Alert.alert("Sėkmė", "Miškas sėkmingai atnaujintas");
    } catch (error) {
      Alert.alert("Klaida", "Nepavyko atnaujinti miško");
    }
  };

  const deleteMiskas = async (id: number) => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      await apiClient.delete(`/miskas/istrinti-miska/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMiskai(miskai.filter((m) => m.id !== id));
      Alert.alert("Sėkmė", "Miškas sėkmingai ištrintas");
    } catch (error) {
      Alert.alert("Klaida", "Nepavyko ištrinti miško");
    }
  };

  // SKLYPO API
  const getSklypai = async (miskoId: number) => {
    try {
      const token = await AsyncStorage.getItem("userToken");

      // Patikriname ar token'as yra
      if (!token) {
        console.log("No token found");
        return;
      }

      console.log("Using token:", token);

      const response = await apiClient.get(`/api/sklypai/miskas/${miskoId}`, {
        headers: {
          Authorization: `Bearer ${token}`, // įsitikiname, kad tarpas po 'Bearer' yra
          "Content-Type": "application/json",
        },
      });

      const sklypoData = response.data.data || [];
      setSklypai(sklypoData);
    } catch (error: any) {
      console.error("Error with token:", error.response?.data);
      if (error.response?.status === 403) {
        // Jei token'as negalioja, galime nukreipti vartotoją į prisijungimo puslapį
        Alert.alert("Sesija pasibaigė", "Prašome prisijungti iš naujo");
        // Čia galite pridėti logiką grįžimui į login ekraną
      } else {
        setSklypai([]);
      }
    }
  };

  const createSklypas = async (data: {
    plotas: string;
    kubatura: string;
    skalsumas: string;
    rusineSudetis: string;
    aiksteliuSkaicius: number;
    miskoId: number;
  }) => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      const response = await apiClient.post(
        "/api/sukurti-sklypa",
        {
          ...data,
          kubatura: data.kubatura || "0",
          skalsumas: data.skalsumas || "0",
          rusineSudetis: data.rusineSudetis || "0",
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSklypai([...sklypai, response.data.data]);
      Alert.alert("Sėkmė", "Sklypas sėkmingai pridėtas");
    } catch (error) {
      Alert.alert("Klaida", "Nepavyko pridėti sklypo");
    }
  };

  const updateSklypas = async (
    id: number,
    data: { pavadinimas: string; plotas: string }
  ) => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      const response = await apiClient.put(`/atnaujinti-sklypa/${id}`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSklypai(
        sklypai.map((sklypas) =>
          sklypas.id === id ? { ...sklypas, ...data } : sklypas
        )
      );
      Alert.alert("Sėkmė", "Sklypas sėkmingai atnaujintas");
    } catch (error) {
      Alert.alert("Klaida", "Nepavyko atnaujinti sklypo");
    }
  };

  const deleteSklypas = async (id: number) => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      await apiClient.delete(`/istrinti-sklypa/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSklypai(sklypai.filter((sklypas) => sklypas.id !== id));
      Alert.alert("Sėkmė", "Sklypas sėkmingai ištrintas");
    } catch (error) {
      Alert.alert("Klaida", "Nepavyko ištrinti sklypo");
    }
  };

  // Event handlers
  useEffect(() => {
    getMiskai();
  }, []);

  const handleMiskasClick = (miskoId: number) => {
    setSelectedMiskoId(miskoId);
    getSklypai(miskoId);
    setIsSklypoFormaVisible(true);
  };

  const handleFormSubmit = async (formData: { pavadinimas: string }) => {
    if (editingMiskas) {
      await updateMiskas(editingMiskas.id, formData);
    } else {
      await createMiskas(formData);
    }
    setIsFormVisible(false);
    setEditingMiskas(null);
  };

  const handleDeleteMiskas = (id: number) => {
    Alert.alert("Patvirtinimas", "Ar tikrai norite ištrinti šį mišką?", [
      { text: "Atšaukti", style: "cancel" },
      {
        text: "Ištrinti",
        onPress: () => deleteMiskas(id),
        style: "destructive",
      },
    ]);
  };

  const handleEdit = (miskas: Miskas) => {
    setEditingMiskas(miskas);
    setIsFormVisible(true);
  };

  const handleAdd = () => {
    setEditingMiskas(null);
    setIsFormVisible(true);
  };

  const renderMiskas = ({ item }: { item: Miskas }) => (
    <View style={styles.miskoKorta}>
      <TouchableOpacity onPress={() => handleMiskasClick(item.id)}>
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
      </TouchableOpacity>
    </View>
  );

  const handleCalculateKubatura = async (
    id: number,
    data: {
      mediuAukstis: number;
      mediuSkersmuo: number;
      mediuKiekis: number;
    }
  ) => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      const response = await apiClient.post(`/sklypas/${id}/kubatura`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      Alert.alert("Sėkmė", "Kubatūra sėkmingai apskaičiuota");
      return response.data;
    } catch (error) {
      console.error("Klaida skaičiuojant kubatūrą:", error);
      Alert.alert("Klaida", "Nepavyko apskaičiuoti kubatūros");
    }
  };

  const handleCalculateSkalsumas = async (
    id: number,
    data: {
      faktinisSkalsumas: number;
      normalusSkalsumas: number;
    }
  ) => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      const response = await apiClient.post(`/sklypas/${id}/skalsumas`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      Alert.alert("Sėkmė", "Skalsumas sėkmingai apskaičiuotas");
      return response.data;
    } catch (error) {
      console.error("Klaida skaičiuojant skalsumą:", error);
      Alert.alert("Klaida", "Nepavyko apskaičiuoti skalsumo");
    }
  };

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
        sklypai={sklypai}
        onCreateSklypas={createSklypas}
        onUpdateSklypas={updateSklypas}
        onDeleteSklypas={deleteSklypas}
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
