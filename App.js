import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function App() {
  const [expression, setExpression] = useState("");
  const [result, setResult] = useState("");

  // Khi nhấn nút số hoặc phép toán
  const handlePress = (value) => {
    let v = value;

    // Chuyển X → * 
    if (v === "X") v = "*";

    setExpression(expression + v);
  };

  // Xóa 1 ký tự
  const handleDelete = () => {
    setExpression(expression.slice(0, -1));
    setResult("");
  };

  // Hàm xử lý % theo logic máy tính thật
  const calculatePercentage = (exp) => {
    // TH1: chỉ có 1 số, ví dụ: 50%
    if (!exp.includes("+") && !exp.includes("-") && !exp.includes("*") && !exp.includes("/")) {
      return parseFloat(exp) / 100;
    }

    // TH2: a + b%
    const match = exp.match(/([\d.]+)([\+\-\*\/])([\d.]+)%$/);
    if (match) {
      let a = parseFloat(match[1]);
      let operator = match[2];
      let b = parseFloat(match[3]);

      let percentValue = (a * b) / 100;

      if (operator === "+") return a + percentValue;
      if (operator === "-") return a - percentValue;
      if (operator === "*") return a * (b / 100);
      if (operator === "/") return a / (b / 100);
    }

    return null; // không trùng TH nào
  };

  // Tính kết quả
  const handleAnswer = () => {
    if (expression.trim() === "") return;

    try {
      let exp = expression;

      // Nếu có % → xử lý riêng
      if (exp.includes("%")) {
        const percentResult = calculatePercentage(exp);
        if (percentResult !== null) {
          setResult(percentResult.toString());
          return;
        }
      }

      // Tính toán bình thường
      let res = eval(exp);
      setResult(res.toString());
    } catch (e) {
      setResult("Error");
    }
  };

  return (
    <View style={styles.container}>

      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Calculator</Text>
      </View>

      {/* DISPLAY */}
      <View style={styles.display}>
        <Text style={styles.expression}>{expression}</Text>
        {result !== "" && <Text style={styles.result}>= {result}</Text>}
      </View>

      {/* DELETE + ANSWER */}
      <View style={styles.topButtons}>
        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Text style={styles.topButtonText}>Delete</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.answerButton} onPress={handleAnswer}>
          <Text style={styles.topButtonText}>Answer</Text>
        </TouchableOpacity>
      </View>

      {/* NUMBER GRID */}
      <View style={styles.grid}>
        {[
          "1","2","3","+",
          "4","5","6","-",
          "7","8","9","X",
          ".","0","%","/"
        ].map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.key, isOperator(item) && styles.operatorKey]}
            onPress={() => handlePress(item)}
          >
            <Text style={styles.keyText}>{item}</Text>
          </TouchableOpacity>
        ))}
      </View>

    </View>
  );
}

const isOperator = (val) => ["+", "-", "X", "%", "/"].includes(val);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingTop: 60,
    alignItems: "center",
  },

  header: {
    width: "85%",
    backgroundColor: "#1abc9c",
    padding: 15,
    borderRadius: 3,
  },
  headerText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },

  display: {
    width: "85%",
    minHeight: 80,
    justifyContent: "center",
    alignItems: "flex-end",
    marginTop: 20,
    paddingRight: 10,
  },
  expression: {
    fontSize: 26,
    color: "#333",
  },
  result: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#1abc9c",
  },

  topButtons: {
    width: "85%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
    marginBottom: 15,
  },
  deleteButton: {
    width: "48%",
    backgroundColor: "#54a0ff",
    padding: 15,
    alignItems: "center",
  },
  answerButton: {
    width: "48%",
    backgroundColor: "#54a0ff",
    padding: 15,
    alignItems: "center",
  },
  topButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },

  grid: {
    width: "85%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  key: {
    width: "22%",
    aspectRatio: 1,
    backgroundColor: "#1e6db9",
    marginVertical: 6,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 3,
  },

  operatorKey: {
    backgroundColor: "#88d8c0",
  },

  keyText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "600",
  },
});
