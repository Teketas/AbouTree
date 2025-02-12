import React, { useState } from "react";
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
import { Ionicons } from "@expo/vector-icons";

interface Sklypas {
  id: number;
  plotas: string;
  kubatura: string;
  skalsumas: string;
  rusineSudetis: string;
  aiksteliuSkaicius: number;
}

interface SklypoFormaProps {
  visible: boolean;
  onClose: () => void;
  miskoId: number | null;
  sklypai: Sklypas[];
  onCreateSklypas: (data: {
    plotas: string;
    kubatura: string;
    skalsumas: string;
    rusineSudetis: string;
    aiksteliuSkaicius: number;
    miskoId: number;
  }) => Promise<void>;
  onUpdateSklypas: (
    id: number,
    data: { pavadinimas: string; plotas: string }
  ) => Promise<void>;
  onDeleteSklypas: (id: number) => Promise<void>;
}

export default function SklypoForma({
  visible,
  onClose,
  miskoId,
  sklypai,
  onCreateSklypas,
  onUpdateSklypas,
  onDeleteSklypas,
}: SklypoFormaProps) {
  const [newSklypoData, setNewSklypoData] = useState({
    plotas: "",
    kubatura: "",
    skalsumas: "",
    rusineSudetis: "",
    aiksteliuSkaicius: 0,
  });
  const [isNewSklypoFormaVisible, setIsNewSklypoFormaVisible] = useState(false);

  const handleAddSklypas = async () => {
    if (!newSklypoData.plotas || !miskoId) {
      Alert.alert("Klaida", "Užpildykite bent plotą");
      return;
    }

    await onCreateSklypas({
      ...newSklypoData,
      miskoId: miskoId,
    });

    setNewSklypoData({
      plotas: "",
      kubatura: "",
      skalsumas: "",
      rusineSudetis: "",
      aiksteliuSkaicius: 0,
    });
    setIsNewSklypoFormaVisible(false);
  };

  const handleDeleteSklypas = (id: number) => {
    Alert.alert("Patvirtinimas", "Ar tikrai norite ištrinti šį sklypą?", [
      { text: "Atšaukti", style: "cancel" },
      {
        text: "Ištrinti",
        onPress: () => onDeleteSklypas(id),
        style: "destructive",
      },
    ]);
  };

  const renderSklypas = ({ item }: { item: Sklypas }) => (
    <View style={styles.sklypoKorta}>
      <View style={styles.sklypoHeader}>
        <Text style={styles.sklypoId}>Sklypas #{item.id}</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={() => handleDeleteSklypas(item.id)}
            style={styles.iconButton}
          >
            <Ionicons name="trash" size={20} color="#FF0000" />
          </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.plotas}>Plotas: {item.plotas} ha</Text>
      <Text style={styles.plotas}>
        Kubatūra: {item.kubatura || "Neskaičiuota"} m³
      </Text>
      <Text style={styles.plotas}>
        Skalsumas: {item.skalsumas || "Neskaičiuotas"}
      </Text>
      <Text style={styles.plotas}>
        Rūšinė sudėtis: {item.rusineSudetis || "Neskaičiuota"}
      </Text>
      <Text style={styles.plotas}>
        Aikštelių skaičius: {item.aiksteliuSkaicius}
      </Text>
    </View>
  );

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.container}>
        <Text style={styles.title}>Sklypo informacija</Text>

        <TouchableOpacity
          style={styles.pridetiButton}
          onPress={() => setIsNewSklypoFormaVisible(true)}
        >
          <Text style={styles.buttonText}>Pridėti naują sklypą</Text>
        </TouchableOpacity>

        {sklypai.length === 0 ? (
          <Text style={styles.emptyText}>Nėra pridėtų sklypų</Text>
        ) : (
          <FlatList
            data={sklypai}
            renderItem={renderSklypas}
            keyExtractor={(item) => item.id.toString()}
            style={styles.sklypoList}
          />
        )}

        <Modal visible={isNewSklypoFormaVisible} animationType="slide">
          <View style={styles.container}>
            <Text style={styles.title}>Naujas sklypas</Text>
            <TextInput
              style={styles.input}
              placeholder="Plotas (ha)"
              value={newSklypoData.plotas}
              onChangeText={(text) =>
                setNewSklypoData((prev) => ({ ...prev, plotas: text }))
              }
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Aikštelių skaičius"
              value={newSklypoData.aiksteliuSkaicius.toString()}
              onChangeText={(text) =>
                setNewSklypoData((prev) => ({
                  ...prev,
                  aiksteliuSkaicius: parseInt(text) || 0,
                }))
              }
              keyboardType="numeric"
            />
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setIsNewSklypoFormaVisible(false)}
              >
                <Text style={styles.buttonText}>Atšaukti</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleAddSklypas}
              >
                <Text style={styles.buttonText}>Pridėti</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
          <Text style={styles.buttonText}>Uždaryti</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    fontFamily: "SpaceMono",
  },
  sklypoList: {
    flex: 1,
    marginVertical: 10,
  },
  sklypoKorta: {
    backgroundColor: "#f5f5f5",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  sklypoHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sklypoId: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    fontFamily: "SpaceMono",
    color: "#4CAF50",
  },
  plotas: {
    fontSize: 14,
    color: "#666",
    fontFamily: "SpaceMono",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    fontFamily: "SpaceMono",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    marginTop: 10,
  },
  pridetiButton: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#ff6b6b",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  submitButton: {
    flex: 1,
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "SpaceMono",
  },
  iconButton: {
    padding: 5,
  },
  emptyText: {
    textAlign: "center",
    marginVertical: 20,
    fontSize: 16,
    color: "#666",
    fontFamily: "SpaceMono",
  },
});
