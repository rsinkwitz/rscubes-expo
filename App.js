import React from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";

export default function App() {
  // Ersetze die URL durch die deiner three.js-Webanwendung
  const webAppUrl = "https://rsinkwitz.github.io/cubes/3x3/index.html";

  return (
    <SafeAreaView style={styles.container}>
      <WebView
        source={{ uri: webAppUrl }}
        style={styles.webview}
        originWhitelist={["*"]}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        allowsInlineMediaPlayback={true}
        mediaPlaybackRequiresUserAction={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
});
