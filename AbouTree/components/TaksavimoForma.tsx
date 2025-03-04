import React from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Modal,
  TouchableOpacity,
} from "react-native";

interface TaksavimoFormaProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: any;
}

export default function TaksavimoForma({
  visible,
  onClose,
  onSubmit,
  initialData = null,
}: TaksavimoFormaProps) {
  const [formData, setFormData] = React.useState({
    pavadinimas: initialData?.pavadinimas || "",
  });

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>
            {initialData ? "Redaguoti mišką" : "Pridėti mišką"}
          </Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Pavadinimas</Text>
            <TextInput
              style={styles.input}
              value={formData.pavadinimas}
              onChangeText={(text) =>
                setFormData({ ...formData, pavadinimas: text })
              }
              placeholder="Įveskite miško pavadinimą"
            />
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.buttonText}>Atšaukti</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.submitButton}
              onPress={() => onSubmit(formData)}
            >
              <Text style={styles.buttonText}>Išsaugoti</Text>
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
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: "#666",
    fontFamily: "SpaceMono",
  },
  input: {
    backgroundColor: "#f5f5f5",
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    fontFamily: "SpaceMono",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
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
