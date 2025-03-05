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
import apiClient from "../axiosConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Medis {
  id: number;
  amzius: number;
  aukstis: number;
  rusis_id: number;
}

interface MedzioFormaProps {
  visible: boolean;
  onClose: () => void;
  rusisId: number | null;
  medziai: Medis[];
  onCreateMedis: (
    rusisId: number,
    data: { amzius: number; aukstis: number }
  ) => Promise<void>;
  onDeleteMedis: (medisId: number) => Promise<void>;
  onGetMedziai: (rusisId: number) => Promise<void>;
}

export default function MedzioForma({
  visible,
  onClose,
  rusisId,
  medziai,
  onCreateMedis,
  onDeleteMedis,
  onGetMedziai,
}: MedzioFormaProps) {
  const [formData, setFormData] = useState({
    amzius: "",
    aukstis: "",
  });

  useEffect(() => {
    if (visible && rusisId) {
      onGetMedziai(rusisId);
    }
  }, [visible, rusisId]);

  const handleCreateMedis = async () => {
    if (!rusisId || !formData.amzius || !formData.aukstis) {
      Alert.alert("Klaida", "Įveskite medžio amžių ir aukštį");
      return;
    }

    await onCreateMedis(rusisId, {
      amzius: Number(formData.amzius),
      aukstis: Number(formData.aukstis),
    });
    setFormData({ amzius: "", aukstis: "" });
  };

  const renderMedis = ({ item }: { item: Medis }) => (
    <View style={styles.medisKorta}>
      <View style={styles.medisInfo}>
        <Text style={styles.medisId}>Medis #{item.id}</Text>
        <Text style={styles.infoText}>Amžius: {item.amzius} m.</Text>
        <Text style={styles.infoText}>Aukštis: {item.aukstis} m</Text>
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => onDeleteMedis(item.id)}
      >
        <Text style={styles.buttonText}>Ištrinti</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Rūšies medžiai</Text>

          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="Amžius (metais)"
              value={formData.amzius}
              onChangeText={(text) =>
                setFormData({ ...formData, amzius: text })
              }
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Aukštis (metrais)"
              value={formData.aukstis}
              onChangeText={(text) =>
                setFormData({ ...formData, aukstis: text })
              }
              keyboardType="numeric"
            />
            <TouchableOpacity
              style={styles.pridetiButton}
              onPress={handleCreateMedis}
            >
              <Text style={styles.buttonText}>Pridėti medį</Text>
            </TouchableOpacity>
          </View>

          {medziai.length === 0 ? (
            <Text style={styles.emptyText}>Nėra pridėtų medžių</Text>
          ) : (
            <FlatList
              data={medziai}
              renderItem={renderMedis}
              keyExtractor={(item) => item.id.toString()}
              style={styles.medziaiList}
            />
          )}

          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.buttonText}>Grįžti</Text>
          </TouchableOpacity>
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
  medisKorta: {
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
  medisInfo: {
    flex: 1,
  },
  medisId: {
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
  medziaiList: {
    marginBottom: 20,
  },
  cancelButton: {
    backgroundColor: "#FF6B6B",
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
  },
});
