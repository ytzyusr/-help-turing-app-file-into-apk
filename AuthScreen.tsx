// AuthScreen.tsx
import React, { useState, useEffect, useContext } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { UserContext } from "../UserContext";

export default function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { setUserId, setUsername: setCtxUsername } = useContext(UserContext);
  const navigation = useNavigation();

  useEffect(() => {
    // Redirect if already logged in (optional)
    // if (userId) navigation.navigate("Home");
  }, []);

  const handleSubmit = async () => {
    if (username.length < 3 || password.length < 4) {
      Alert.alert("Validation Error", "Username must be 3+ chars and password 4+.");
      return;
    }

    try {
      const endpoint = isLogin ? "/api/login" : "/api/register";
      const res = await fetch(`https://YOUR_SERVER_HERE.com${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed");

      setUserId(data.id);
      setCtxUsername(data.username);
      Alert.alert("Success", isLogin ? "Logged in!" : "Account created!");
      navigation.navigate("Home");
    } catch (err: any) {
      Alert.alert("Error", err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isLogin ? "Welcome Back" : "Create Account"}</Text>
      <Text style={styles.subtitle}>
        Use a shared account to access your memories.
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>
          {isLogin ? "Login" : "Create Account"}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
        <Text style={styles.switch}>
          {isLogin
            ? "Don't have an account? Create one"
            : "Already have an account? Login"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 24, backgroundColor: "#FFF7F0" },
  title: { fontSize: 26, fontWeight: "bold", color: "#5D4037", textAlign: "center", marginBottom: 12 },
  subtitle: { fontSize: 14, textAlign: "center", color: "#7B5E57", marginBottom: 24 },
  input: {
    backgroundColor: "#FFF",
    borderColor: "#FFCCBC",
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  button: {
    backgroundColor: "#FFAB91",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 16,
  },
  buttonText: { color: "#5D4037", fontWeight: "bold" },
  switch: { textAlign: "center", color: "#7B5E57" },
});
