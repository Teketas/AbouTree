import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  FlatList,
} from "react-native";
import RusiesForma from "./RusiesForma";

interface Rusis {
  id: number;
  pavadinimas: string;
  medziu_sk: number;
  avg_amzius: number;
  avg_aukstis: number;
  aikstele_id: number;
}

interface Medis {
  id: number;
  amzius: number;
  aukstis: number;
  rusis_id: number;
}

interface Aikstele {
  id: number;
  sklypas_id: number;
}

interface AikstelesFormaProps {
  visible: boolean;
  onClose: () => void;
  sklypoId: number | null;
  aiksteles: Aikstele[];
  onCreateAikstele: (sklypoId: number) => Promise<void>;
  onDeleteAikstele: (aiksteleId: number) => Promise<void>;
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

export default function AikstelesForma({
  visible,
  onClose,
  sklypoId,
  aiksteles = [],
  onCreateAikstele,
  onDeleteAikstele,
  rusys,
  onGetRusys,
  onCreateRusis,
  onDeleteRusis,
  medziai,
  onGetMedziai,
  onCreateMedis,
  onDeleteMedis,
}: AikstelesFormaProps) {
  const [selectedAiksteleId, setSelectedAiksteleId] = useState<number | null>(
    null
  );
  const [isMedzioFormaVisible, setIsMedzioFormaVisible] = useState(false);
  const [isRusiesFormaVisible, setIsRusiesFormaVisible] = useState(false);

  const handleAikstelePress = (aiksteleId: number) => {
    setSelectedAiksteleId(aiksteleId);
    onGetRusys(aiksteleId);
    setIsRusiesFormaVisible(true);
  };

  const renderAikstele = ({ item }: { item: Aikstele }) => (
    <TouchableOpacity
      style={styles.aiksteleKorta}
      onPress={() => handleAikstelePress(item.id)}
    >
      <Text style={styles.aiksteleId}>Aikštelė #{item.id}</Text>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={(e) => {
          e.stopPropagation();
          onDeleteAikstele(item.id);
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
          <Text style={styles.title}>Sklypo aikštelės</Text>

          <TouchableOpacity
            style={styles.pridetiButton}
            onPress={() => sklypoId && onCreateAikstele(sklypoId)}
          >
            <Text style={styles.buttonText}>Pridėti naują aikštelę</Text>
          </TouchableOpacity>

          {Array.isArray(aiksteles) && aiksteles.length === 0 ? (
            <Text style={styles.emptyText}>Nėra pridėtų aikštelių</Text>
          ) : (
            <FlatList
              data={aiksteles}
              renderItem={renderAikstele}
              keyExtractor={(item) => item.id.toString()}
              style={styles.aikstelesList}
            />
          )}

          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.buttonText}>Grįžti</Text>
          </TouchableOpacity>

          {isRusiesFormaVisible && (
            <RusiesForma
              visible={isRusiesFormaVisible}
              onClose={() => setIsRusiesFormaVisible(false)}
              aiksteleId={selectedAiksteleId}
              rusys={rusys}
              onGetRusys={onGetRusys}
              onCreateRusis={onCreateRusis}
              onDeleteRusis={onDeleteRusis}
              medziai={medziai}
              onGetMedziai={onGetMedziai}
              onCreateMedis={onCreateMedis}
              onDeleteMedis={onDeleteMedis}
            />
          )}
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
  aiksteleKorta: {
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
  aiksteleId: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2f2f2f",
    fontFamily: "SpaceMono",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 10,
  },
  pridetiButton: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  editButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
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
  aikstelesList: {
    marginBottom: 20,
  },
  cancelButton: {
    backgroundColor: "#FF6B6B",
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
