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
  plotas: number;
  kubatura: number;
  skalsumas: number;
  rusine_sudetis: number;
  aiksteliu_skaicius: number;
  miskas_id: number;
}

interface SklypoFormaProps {
  visible: boolean;
  onClose: () => void;
  miskoId: number | null;
  sklypai: Sklypas[];
  onCreateSklypas: (data: {
    id?: number;
    plotas: string;
    kubatura: string;
    skalsumas: string;
    rusine_sudetis: string;
    aiksteliu_skaicius: number;
    miskoId: number;
  }) => Promise<void>;
  onDeleteSklypas: (id: number) => Promise<void>;
  onUpdateSklypas: (id: number, data: {
    plotas: string;
    kubatura: string;
    skalsumas: string;
    rusine_sudetis: string;
  }) => Promise<void>;
}

export default function SklypoForma({
  visible,
  onClose,
  miskoId,
  sklypai,
  onCreateSklypas,
  onDeleteSklypas,
  onUpdateSklypas,
}: SklypoFormaProps) {
  const [formData, setFormData] = useState({
    plotas: "",
    kubatura: "",
    skalsumas: "",
    rusine_sudetis: "",
  });

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingSklypas, setEditingSklypas] = useState<Sklypas | null>(null);

  // Resets form
  const resetForm = () => {
    setFormData({ plotas: "", kubatura: "", skalsumas: "", rusine_sudetis: "" });
    setEditingSklypas(null);
    setIsModalVisible(false);
  };

  // Handles adding or updating a Sklypas
  const handleSaveSklypas = async () => {
    if (!formData.plotas || !miskoId) {
      Alert.alert("Klaida", "Užpildykite visus laukus.");
      return;
    }

    if (editingSklypas) {
      // Update existing Sklypas
      await onUpdateSklypas(editingSklypas.id, formData);
      Alert.alert("Sėkmė", "Sklypas atnaujintas");
    } else {
      // Create new Sklypas
      await onCreateSklypas({
        ...formData,
        miskoId: miskoId,
        aiksteliu_skaicius: 0,
      });
      Alert.alert("Sėkmė", "Naujas sklypas pridėtas");
    }

    resetForm();
  };

  // Handles deleting a Sklypas
  const handleDeleteSklypas = (id: number) => {
    Alert.alert("Patvirtinimas", "Ar tikrai norite ištrinti šį sklypą?", [
      { text: "Atšaukti", style: "cancel" },
      { text: "Ištrinti", onPress: () => onDeleteSklypas(id), style: "destructive" },
    ]);
  };

  // Handles editing a Sklypas
  const handleEditSklypas = (sklypas: Sklypas) => {
    setEditingSklypas(sklypas);
    setFormData({
      plotas: sklypas.plotas.toString(),
      kubatura: sklypas.kubatura.toString(),
      skalsumas: sklypas.skalsumas.toString(),
      rusine_sudetis: sklypas.rusine_sudetis.toString(),
    });
    setIsModalVisible(true);
  };

  // Renders a Sklypas item
  const renderSklypas = ({ item }: { item: Sklypas }) => (
    <View style={styles.sklypoKorta}>
      <View style={styles.sklypoHeader}>
        <Text style={styles.sklypoId}>Sklypas #{item.id}</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={() => handleEditSklypas(item)} style={styles.iconButton}>
            <Ionicons name="pencil" size={20} color="#4CAF50" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleDeleteSklypas(item.id)} style={styles.iconButton}>
            <Ionicons name="trash" size={20} color="#FF0000" />
          </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.plotas}>Plotas: {item.plotas} ha</Text>
      <Text style={styles.plotas}>Kubatūra: {item.kubatura} m³</Text>
      <Text style={styles.plotas}>Skalsumas: {item.skalsumas}</Text>
      <Text style={styles.plotas}>Rūšinė sudėtis: {item.rusine_sudetis}</Text>
    </View>
  );

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.container}>
        <Text style={styles.title}>Sklypo informacija</Text>

        <TouchableOpacity style={styles.pridetiButton} onPress={() => setIsModalVisible(true)}>
          <Text style={styles.buttonText}>Pridėti naują sklypą</Text>
        </TouchableOpacity>

        {sklypai.length === 0 ? (
          <Text style={styles.emptyText}>Nėra pridėtų sklypų</Text>
        ) : (
          <FlatList data={sklypai} renderItem={renderSklypas} keyExtractor={(item) => item.id.toString()} />
        )}

        <Modal visible={isModalVisible} animationType="slide">
          <View style={styles.container}>
            <Text style={styles.title}>{editingSklypas ? "Redaguoti sklypą" : "Naujas sklypas"}</Text>

            <TextInput
              style={styles.input}
              placeholder="Plotas (ha)"
              value={formData.plotas}
              onChangeText={(text) => setFormData({ ...formData, plotas: text })}
              keyboardType="numeric"
            />

            <TextInput
              style={styles.input}
              placeholder="Kubatūra (m³)"
              value={formData.kubatura}
              onChangeText={(text) => setFormData({ ...formData, kubatura: text })}
              keyboardType="numeric"
            />

            <TextInput
              style={styles.input}
              placeholder="Skalsumas"
              value={formData.skalsumas}
              onChangeText={(text) => setFormData({ ...formData, skalsumas: text })}
              keyboardType="numeric"
            />

            <TextInput
              style={styles.input}
              placeholder="Rūšinė sudėtis"
              value={formData.rusine_sudetis}
              onChangeText={(text) => setFormData({ ...formData, rusine_sudetis: text })}
            />

            <TouchableOpacity style={styles.submitButton} onPress={handleSaveSklypas}>
              <Text style={styles.buttonText}>{editingSklypas ? "Atnaujinti" : "Pridėti"}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelButton} onPress={resetForm}>
              <Text style={styles.buttonText}>Uždaryti</Text>
            </TouchableOpacity>
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
    backgroundColor: "#FF6B6B",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    width: "30%",
    alignSelf: "center",
    marginTop: 10,
  },
  submitButton: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 14,
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
  pridetiAiksteleButton: {
    backgroundColor: "#2196F3",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 10,
  },
});
