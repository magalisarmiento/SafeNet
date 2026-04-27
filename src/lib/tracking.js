import { collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export const trackWorldEntry = async (world) => {
  try {
    await addDoc(collection(db, "sessions"), {
      world,
      event: "enter_world",
      createdAt: new Date(),
    });

    console.log(`Ingreso guardado para ${world}`);
  } catch (error) {
    console.error("Error guardando ingreso al mundo:", error);
  }
};