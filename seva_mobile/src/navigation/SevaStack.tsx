import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SevasScreen from "../screens/SevasScreen";
import SevaFormScreen from "../screens/SevaFormScreen";
import SevaRazorpayPaymentScreen from "../screens/SevaRazorpayPaymentScreen";

export type SevaStackParamList = {
  SevasMain: undefined;
  SevaForm: {
    seva: {
      id: string;
      title: string;
      description?: string;
      amountInPaise: number;
    };
  };
  SevaPayment: {
    sevaOrderId: string;
    amountInPaise: number;
    sevaTitle: string;
  };
};

const Stack = createNativeStackNavigator<SevaStackParamList>();

export default function SevaStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="SevasMain"
        component={SevasScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SevaForm"
        component={SevaFormScreen}
        options={{ title: "Seva Form" }}
      />

      <Stack.Screen
        name="SevaPayment"
        component={SevaRazorpayPaymentScreen}
        options={{ title: "Payment" }}
      />
    </Stack.Navigator>
  );
}
