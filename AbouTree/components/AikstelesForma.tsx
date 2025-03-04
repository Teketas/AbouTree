import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  FlatList,
} from "react-native";

interface Medis {
  id: number;
  rusis: string;
  kiekis: number;
  aukstis: number;
  amzius: number;
}

interface AikstelesFormaProps {
  visible: boolean;
  onClose: () => void;
  sklypoId: number | null;
}

export default function AikstelesForma({
  visible,
  onClose,
  sklypoId,
}: AikstelesFormaProps) {
  const [medziai, setMedziai] = React.useState<Medis[]>([
    { id: 1, rusis: "Beržas", kiekis: 4, aukstis: 25, amzius: 45 },
    { id: 2, rusis: "Pušis", kiekis: 1, aukstis: 28, amzius: 50 },
    { id: 3, rusis: "Drebulė", kiekis: 2, aukstis: 22, amzius: 35 },
  ]);

  const renderMedis = ({ item }: { item: Medis }) => (
    <View style={styles.medisKorta}>
      <Text style={styles.medisRusis}>{item.rusis}</Text>
      <View style={styles.medisInfo}>
        <Text style={styles.infoText}>Kiekis: {item.kiekis}</Text>
        <Text style={styles.infoText}>H: {item.aukstis}m</Text>
        <Text style={styles.infoText}>Vid. amžius: {item.amzius}m.</Text>
      </View>
      <TouchableOpacity style={styles.editButton}>
        <Text style={styles.editButtonText}>Redaguoti</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Aikštelės medžiai</Text>

          <FlatList
            data={medziai}
            renderItem={renderMedis}
            keyExtractor={(item) => item.id.toString()}
            style={styles.medisList}
          />

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.buttonText}>Grįžti</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.submitButton}>
              <Text style={styles.buttonText}>Pridėti medį</Text>
            </TouchableOpacity>
          </View>
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
  medisList: {
    marginBottom: 20,
  },
  medisKorta: {
    backgroundColor: "#f5f5f5",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  medisRusis: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    fontFamily: "SpaceMono",
  },
  medisInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: "#666",
    fontFamily: "SpaceMono",
  },
  editButton: {
    backgroundColor: "#4CAF50",
    padding: 8,
    borderRadius: 5,
    alignSelf: "flex-end",
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
