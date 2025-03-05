import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  FlatList,
  TextInput,
  Alert,
} from "react-native";
import MedzioForma from "./MedzioForma";
import apiClient from "../axiosConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

interface RusiesFormaProps {
  visible: boolean;
  onClose: () => void;
  aiksteleId: number | null;
  rusys: Rusis[];
  onGetRusys: (aiksteleId: number) => Promise<void>;
  onCreateRusis: (aiksteleId: number, pavadinimas: string) => Promise<void>;
  onDeleteRusis: (rusisId: number) => Promise<void>;
  medziai: Medis[];
  onGetMedziai: (rusisId: number) => Promise<void>;
  onCreateMedis: (
    rusisId: number,
    data: { amzius: number; aukstis: number }
  ) => Promise<void>;
  onDeleteMedis: (medisId: number) => Promise<void>;
}

export default function RusiesForma({
  visible,
  onClose,
  aiksteleId,
  rusys,
  onGetRusys,
  onCreateRusis,
  onDeleteRusis,
  medziai,
  onGetMedziai,
  onCreateMedis,
  onDeleteMedis,
}: RusiesFormaProps) {
  const [selectedRusisId, setSelectedRusisId] = useState<number | null>(null);
  const [isMedzioFormaVisible, setIsMedzioFormaVisible] = useState(false);
  const [formData, setFormData] = useState({
    pavadinimas: "",
  });

  const getRusys = async () => {
    if (!aiksteleId) return;

    try {
      const token = await AsyncStorage.getItem("userToken");
      const response = await apiClient.get(
        `/rusis/rusys/aikstele/${aiksteleId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      onGetRusys(aiksteleId);
    } catch (error) {
      console.error("Klaida gaunant rūšis:", error);
      Alert.alert("Klaida", "Nepavyko gauti rūšių sąrašo");
    }
  };

  const createRusis = async () => {
    if (!aiksteleId || !formData.pavadinimas.trim()) {
      Alert.alert("Klaida", "Įveskite rūšies pavadinimą");
      return;
    }

    try {
      const token = await AsyncStorage.getItem("userToken");
      const response = await apiClient.post(
        "/rusis/sukurti-rusi",
        {
          pavadinimas: formData.pavadinimas,
          medziu_sk: 0,
          avg_amzius: 0,
          avg_aukstis: 0,
          aikstele_id: aiksteleId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      onCreateRusis(aiksteleId, formData.pavadinimas);
      setFormData({ pavadinimas: "" });
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
      onDeleteRusis(rusisId);
      Alert.alert("Sėkmė", "Rūšis sėkmingai ištrinta");
    } catch (error) {
      console.error("Klaida trinant rūšį:", error);
      Alert.alert("Klaida", "Nepavyko ištrinti rūšies");
    }
  };

  const handleRusisPress = (rusisId: number) => {
    setSelectedRusisId(rusisId);
    setIsMedzioFormaVisible(true);
  };

  useEffect(() => {
    if (visible && aiksteleId) {
      getRusys();
    }
  }, [visible, aiksteleId]);

  useEffect(() => {
    if (isMedzioFormaVisible && selectedRusisId) {
      onGetMedziai(selectedRusisId);
    }
  }, [isMedzioFormaVisible, selectedRusisId]);

  const renderRusis = ({ item }: { item: Rusis }) => (
    <TouchableOpacity
      style={styles.rusisKorta}
      onPress={() => handleRusisPress(item.id)}
    >
      <View style={styles.rusisInfo}>
        <Text style={styles.rusisPavadinimas}>{item.pavadinimas}</Text>
        <Text style={styles.infoText}>Medžių skaičius: {item.medziu_sk}</Text>
        <Text style={styles.infoText}>
          Vid. amžius: {item.avg_amzius ? item.avg_amzius.toFixed(1) : 0} m.
        </Text>
        <Text style={styles.infoText}>
          Vid. aukštis: {item.avg_aukstis ? item.avg_aukstis.toFixed(1) : 0} m
        </Text>
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={(e) => {
          e.stopPropagation();
          deleteRusis(item.id);
        }}
      >
        <Text style={styles.buttonText}>Ištrinti</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Aikštelės rūšys</Text>

          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="Rūšies pavadinimas"
              value={formData.pavadinimas}
              onChangeText={(text) =>
                setFormData({ ...formData, pavadinimas: text })
              }
            />
            <TouchableOpacity
              style={styles.pridetiButton}
              onPress={createRusis}
            >
              <Text style={styles.buttonText}>Pridėti naują rūšį</Text>
            </TouchableOpacity>
          </View>

          {rusys.length === 0 ? (
            <Text style={styles.emptyText}>Nėra pridėtų rūšių</Text>
          ) : (
            <FlatList
              data={rusys}
              renderItem={renderRusis}
              keyExtractor={(item) => item.id.toString()}
              style={styles.rusysList}
            />
          )}

          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.buttonText}>Grįžti</Text>
          </TouchableOpacity>

          <MedzioForma
            visible={isMedzioFormaVisible}
            onClose={() => {
              setIsMedzioFormaVisible(false);
              if (aiksteleId) {
                onGetRusys(aiksteleId);
              }
            }}
            rusisId={selectedRusisId}
            medziai={medziai}
            onCreateMedis={async (rusisId, data) => {
              await onCreateMedis(rusisId, data);
              if (aiksteleId) {
                onGetRusys(aiksteleId);
              }
            }}
            onDeleteMedis={async (medisId) => {
              await onDeleteMedis(medisId);
              if (aiksteleId) {
                onGetRusys(aiksteleId);
              }
            }}
            onGetMedziai={onGetMedziai}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    maxHeight: "80%",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#2f2f2f",
    fontFamily: "SpaceMono",
  },
  form: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    fontFamily: "SpaceMono",
  },
  rusisKorta: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  rusisInfo: {
    flex: 1,
  },
  rusisPavadinimas: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2f2f2f",
    fontFamily: "SpaceMono",
    marginBottom: 5,
  },
  infoText: {
    fontSize: 14,
    color: "#666",
    fontFamily: "SpaceMono",
  },
  pridetiButton: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 8,
    marginVertical: 10,
  },
  deleteButton: {
    backgroundColor: "#FF6B6B",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    fontFamily: "SpaceMono",
  },
  emptyText: {
    textAlign: "center",
    marginVertical: 20,
    fontSize: 16,
    color: "#666",
    fontFamily: "SpaceMono",
  },
  rusysList: {
    marginBottom: 20,
  },
  cancelButton: {
    backgroundColor: "#FF6B6B",
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
  },
});
