import React, { useState } from "react";
import AikstelesForma from "./AikstelesForma";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  FlatList,
} from "react-native";

interface Sklypas {
  id: number;
  pavadinimas: string;
  plotas: string;
}

interface SklypoFormaProps {
  visible: boolean;
  onClose: () => void;
  miskoId: number | null;
}

export default function SklypoForma({
  visible,
  onClose,
  miskoId,
}: SklypoFormaProps) {
  const [isAikstelesFormaVisible, setIsAikstelesFormaVisible] = useState(false);
  const [selectedSklypoId, setSelectedSklypoId] = useState<number | null>(null);
  const [sklypai, setSklypai] = useState<Sklypas[]>([
    { id: 1, pavadinimas: "Sklypas 1", plotas: "2.5" },
    { id: 2, pavadinimas: "Sklypas 2", plotas: "3.2" },
  ]);

  const handleEdit = (sklypoId: number) => {
    setSelectedSklypoId(sklypoId);
    setIsAikstelesFormaVisible(true);
  };

  const renderSklypas = ({ item }: { item: Sklypas }) => (
    <View style={styles.sklypoKorta}>
      <View style={styles.sklypoInfo}>
        <Text style={styles.sklypoPavadinimas}>{item.pavadinimas}</Text>
        <Text style={styles.plotas}>Plotas: {item.plotas} ha</Text>
      </View>
      <TouchableOpacity
        style={styles.editButton}
        onPress={() => handleEdit(item.id)}
      >
        <Text style={styles.editButtonText}>Redaguoti</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Miško sklypai</Text>

          <FlatList
            data={sklypai}
            renderItem={renderSklypas}
            keyExtractor={(item) => item.id.toString()}
            style={styles.sklypoList}
          />

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.buttonText}>Grįžti</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.submitButton}>
              <Text style={styles.buttonText}>Pridėti sklypą</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <AikstelesForma
        visible={isAikstelesFormaVisible}
        onClose={() => setIsAikstelesFormaVisible(false)}
        sklypoId={selectedSklypoId}
      />
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
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    fontFamily: "SpaceMono",
  },
  sklypoList: {
    marginBottom: 20,
  },
  sklypoKorta: {
    backgroundColor: "#f5f5f5",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sklypoInfo: {
    flex: 1,
  },
  sklypoPavadinimas: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    fontFamily: "SpaceMono",
  },
  plotas: {
    fontSize: 14,
    color: "#666",
    fontFamily: "SpaceMono",
  },
  editButton: {
    backgroundColor: "#4CAF50",
    padding: 8,
    borderRadius: 5,
  },
  editButtonText: {
    color: "white",
    fontSize: 14,
    fontFamily: "SpaceMono",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
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
});
