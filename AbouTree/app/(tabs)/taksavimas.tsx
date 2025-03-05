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
  plotas: number;
  kubatura: number;
  skalsumas: number;
  rusine_sudetis: number;
  aiksteliu_skaicius: number;
  miskas_id: number;
}

interface CreateSklypoData {
  plotas: string;
  kubatura: string;
  skalsumas: string;
  rusine_sudetis: string;
  miskoId: number;
}

interface Aikstele {
  id: number;
  sklypas_id: number;
}

interface Medis {
  id: number;
  amzius: number;
  aukstis: number;
  rusis_id: number;
}

interface Rusis {
  id: number;
  pavadinimas: string;
  medziu_sk: number;
  avg_amzius: number;
  avg_aukstis: number;
  aikstele_id: number;
}

export default function TaksavimasScreen() {
  const [miskai, setMiskai] = useState<Miskas[]>([]);
  const [sklypai, setSklypai] = useState<Sklypas[]>([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingMiskas, setEditingMiskas] = useState<Miskas | null>(null);
  const [isSklypoFormaVisible, setIsSklypoFormaVisible] = useState(false);
  const [selectedMiskoId, setSelectedMiskoId] = useState<number | null>(null);
  const [aiksteles, setAiksteles] = useState<Aikstele[]>([]);
  const [selectedSklypoId, setSelectedSklypoId] = useState<number | null>(null);
  const [isAikstelesFormaVisible, setIsAikstelesFormaVisible] = useState(false);
  const [medziai, setMedziai] = useState<Medis[]>([]);
  const [rusys, setRusys] = useState<Rusis[]>([]);

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
      if (!token) {
        console.log("No token found");
        return;
      }

      console.log("Trying to fetch sklypai with miskoId:", miskoId);
      const response = await apiClient.get(
        `/sklypas/sklypai/miskas/${miskoId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Response:", response.data);
      const sklypoData = response.data.data || [];
      setSklypai(sklypoData);
    } catch (error: any) {
      console.error("Full error:", error);
      console.error("Response data:", error.response?.data);
      console.error("Status:", error.response?.status);
      setSklypai([]);
    }
  };

  const createSklypas = async (data: CreateSklypoData) => {
    try {
      const token = await AsyncStorage.getItem("userToken");

      const requestData = {
        plotas: parseFloat(data.plotas),
        kubatura: parseInt(data.kubatura) || 0,
        skalsumas: parseFloat(data.skalsumas) || 0,
        rusine_sudetis: parseFloat(data.rusine_sudetis) || 0,
        aiksteliu_skaicius: 0,
        miskas_id: data.miskoId,
      };

      const response = await apiClient.post(
        "/sklypas/sukurti-sklypa",
        requestData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setSklypai((prev) => [...prev, response.data.data]);
      Alert.alert("Sėkmė", "Sklypas sėkmingai pridėtas");
    } catch (error: any) {
      console.error("Error:", error.response?.data);
      Alert.alert("Klaida", "Nepavyko pridėti sklypo");
    }
  };

  const updateSklypas = async (
    id: number,
    data: {
      plotas: string;
      kubatura: string;
      skalsumas: string;
      rusine_sudetis: string;
    }
  ) => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      await apiClient.put(`/sklypas/atnaujinti-sklypa/${id}`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSklypai(
        sklypai.map((sklypas) =>
          sklypas.id === id
            ? {
                ...sklypas,
                plotas: parseFloat(data.plotas),
                kubatura: parseFloat(data.kubatura),
                skalsumas: parseFloat(data.skalsumas),
                rusine_sudetis: parseFloat(data.rusine_sudetis),
              }
            : sklypas
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
      await apiClient.delete(`/sklypas/istrinti-sklypa/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSklypai(sklypai.filter((sklypas) => sklypas.id !== id));
      Alert.alert("Sėkmė", "Sklypas sėkmingai ištrintas");
    } catch (error) {
      Alert.alert("Klaida", "Nepavyko ištrinti sklypo");
    }
  };

  // AIKŠTELĖS API
  const getAiksteles = async (sklypoId: number) => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        console.log("No token found");
        return;
      }

      const response = await apiClient.get(
        `/aikstele/aiksteles/sklypas/${sklypoId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Aikšteles response:", response.data);
      const aikstelesData = response.data.data || [];
      setAiksteles(aikstelesData);
    } catch (error: any) {
      console.error("Klaida gaunant aikšteles:", error);
      setAiksteles([]);
      Alert.alert("Klaida", "Nepavyko gauti aikštelių sąrašo");
    }
  };

  const createAikstele = async (sklypoId: number) => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      const response = await apiClient.post(
        "/aikstele/sukurti-aikstele",
        { sklypas_id: sklypoId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setAiksteles((prev) => [...prev, response.data.data]);
      Alert.alert("Sėkmė", "Aikštelė sėkmingai pridėta");
    } catch (error: any) {
      console.error("Klaida kuriant aikštelę:", error);
      Alert.alert("Klaida", "Nepavyko pridėti aikštelės");
    }
  };

  const deleteAikstele = async (aiksteleId: number) => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      await apiClient.delete(`/aikstele/trinti-aikstele/${aiksteleId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setAiksteles((prev) =>
        prev.filter((aikstele) => aikstele.id !== aiksteleId)
      );
      Alert.alert("Sėkmė", "Aikštelė sėkmingai ištrinta");
    } catch (error) {
      console.error("Klaida trinant aikštelę:", error);
      Alert.alert("Klaida", "Nepavyko ištrinti aikštelės");
    }
  };
  // taksavimas.tsx
  // Rūšies API
  const getRusys = async (aiksteleId: number) => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      const response = await apiClient.get(
        `/rusis/rusys/aikstele/${aiksteleId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setRusys(response.data.data || []);
    } catch (error) {
      console.error("Klaida gaunant rūšis:", error);
      Alert.alert("Klaida", "Nepavyko gauti rūšių sąrašo");
    }
  };

  const createRusis = async (aiksteleId: number, pavadinimas: string) => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      const response = await apiClient.post(
        "/rusis/sukurti-rusi",
        {
          pavadinimas,
          medziu_sk: 0,
          avg_amzius: 0,
          avg_aukstis: 0,
          aikstele_id: aiksteleId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setRusys([...rusys, response.data.data]);
      Alert.alert("Sėkmė", "Rūšis sėkmingai pridėta");
    } catch (error) {
      console.error("Klaida kuriant rūšį:", error);
      Alert.alert("Klaida", "Nepavyko pridėti rūšies");
    }
  };

  const deleteRusis = async (rusisId: number) => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      await apiClient.delete(`/rusis/trinti-rusi/${rusisId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRusys(rusys.filter((rusis) => rusis.id !== rusisId));
      Alert.alert("Sėkmė", "Rūšis sėkmingai ištrinta");
    } catch (error) {
      console.error("Klaida trinant rūšį:", error);
      Alert.alert("Klaida", "Nepavyko ištrinti rūšies");
    }
  };

  // Medžių API
  const getMedziai = async (rusisId: number) => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      const response = await apiClient.get(`/medis/medziai/rusis/${rusisId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMedziai(response.data.data || []);
    } catch (error) {
      console.error("Klaida gaunant medžius:", error);
      Alert.alert("Klaida", "Nepavyko gauti medžių sąrašo");
    }
  };

  const createMedis = async (
    rusisId: number,
    data: { amzius: number; aukstis: number }
  ) => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      const response = await apiClient.post(
        "/medis/sukurti-medi",
        { ...data, rusis_id: rusisId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMedziai([...medziai, response.data.data]);
      Alert.alert("Sėkmė", "Medis sėkmingai pridėtas");
    } catch (error) {
      console.error("Klaida kuriant medį:", error);
      Alert.alert("Klaida", "Nepavyko pridėti medžio");
    }
  };

  const deleteMedis = async (medisId: number) => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      await apiClient.delete(`/medis/trinti-medi/${medisId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMedziai(medziai.filter((medis) => medis.id !== medisId));
      Alert.alert("Sėkmė", "Medis sėkmingai ištrintas");
    } catch (error) {
      console.error("Klaida trinant medį:", error);
      Alert.alert("Klaida", "Nepavyko ištrinti medžio");
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

  const handleSklypoClick = (sklypoId: number) => {
    setSelectedSklypoId(sklypoId);
    getAiksteles(sklypoId);
    setIsAikstelesFormaVisible(true);
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
        onDeleteSklypas={deleteSklypas}
        onUpdateSklypas={updateSklypas}
        onSklypoClick={handleSklypoClick}
        aiksteles={aiksteles}
        onCreateAikstele={createAikstele}
        onDeleteAikstele={deleteAikstele}
      />

      <AikstelesForma
        visible={isAikstelesFormaVisible}
        onClose={() => setIsAikstelesFormaVisible(false)}
        sklypoId={selectedSklypoId}
        aiksteles={aiksteles}
        onCreateAikstele={createAikstele}
        onDeleteAikstele={deleteAikstele}
        rusys={rusys}
        onGetRusys={getRusys}
        onCreateRusis={createRusis}
        onDeleteRusis={deleteRusis}
        medziai={medziai}
        onGetMedziai={getMedziai}
        onCreateMedis={createMedis}
        onDeleteMedis={deleteMedis}
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
