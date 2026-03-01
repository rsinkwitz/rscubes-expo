import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, Platform, ActivityIndicator, View, Text, TouchableOpacity, ScrollView, Dimensions, StatusBar } from "react-native";
import { WebView } from "react-native-webview";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import * as FileSystem from "expo-file-system/legacy";
import { Asset } from "expo-asset";
import { UnifiedMenuOverlay, TapZones } from './UnifiedUI';

export default function App() {
  const [webAppUri, setWebAppUri] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const webViewRef = useRef(null);

  // Wrap everything in SafeAreaProvider
  return (
    <SafeAreaProvider>
      <AppContent
        webAppUri={webAppUri}
        setWebAppUri={setWebAppUri}
        loading={loading}
        setLoading={setLoading}
        error={error}
        setError={setError}
        webViewRef={webViewRef}
      />
    </SafeAreaProvider>
  );
}

function AppContent({ webAppUri, setWebAppUri, loading, setLoading, error, setError, webViewRef }) {

  // UI State - Menu and orientation
  const [showMenu, setShowMenu] = useState(false);
  const [showTapIndicators, setShowTapIndicators] = useState(false);
  const [isPortrait, setIsPortrait] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Toggle States (synced with WebView)
  const [tumble, setTumble] = useState(false);
  const [isWireframe, setIsWireframe] = useState(false);
  const [isGold, setIsGold] = useState(false);
  const [showAxes, setShowAxes] = useState(false);
  const [isShowNumbers, setIsShowNumbers] = useState(false);
  const [isNormals, setIsNormals] = useState(false);
  const [showRotationInfos, setShowRotationInfos] = useState(false);
  const [isMirrorCube, setIsMirrorCube] = useState(false);

  // Refs (must be declared before any useEffect)
  const lastSentRef = useRef({ action: '', params: null, timestamp: 0 });

  useEffect(() => {
    loadWebApp();
  }, []);


  const copyAssetToLocal = async (assetModule, filename) => {
    try {
      const asset = Asset.fromModule(assetModule);
      await asset.downloadAsync();

      const targetPath = `${FileSystem.documentDirectory}webapp/${filename}`;

      // Kopiere die Datei mit der Legacy API
      await FileSystem.copyAsync({
        from: asset.localUri,
        to: targetPath
      });

      return true;
    } catch (err) {
      console.warn(`Could not copy ${filename}:`, err.message);
      return false;
    }
  };

  const loadWebApp = async () => {
    try {
      if (Platform.OS === "web") {
        // Auf Web laden wir die Cube-HTML aus dem public-Ordner
        setWebAppUri("/cube.html");
        setLoading(false);
      } else {
        // Auf Native: Kopiere HTML und JS in ein temporäres Verzeichnis
        const tempDir = `${FileSystem.cacheDirectory}webapp/`;

        // Lösche das alte Verzeichnis, um sicherzustellen, dass wir die neueste Version haben
        const dirInfo = await FileSystem.getInfoAsync(tempDir);
        if (dirInfo.exists) {
          await FileSystem.deleteAsync(tempDir, { idempotent: true });
          console.log("🗑️ Cleared old cache");
        }

        // Erstelle Verzeichnis neu
        await FileSystem.makeDirectoryAsync(tempDir, { intermediates: true });

        // Lade HTML-Asset
        const htmlAsset = Asset.fromModule(require("./assets/webapp/index.html"));
        await htmlAsset.downloadAsync();

        // Kopiere HTML
        await FileSystem.copyAsync({
          from: htmlAsset.localUri,
          to: `${tempDir}index.html`
        });
        console.log("✓ Copied: index.html");

        // Lade JS-Bundle (als .txt um Metro zu umgehen)
        console.log("Loading JS bundle asset...");
        const jsAsset = Asset.fromModule(require("./assets/webapp/renderer.bundle.js.txt"));
        console.log("JS Asset URI:", jsAsset.localUri || "not downloaded yet");
        await jsAsset.downloadAsync();
        console.log("JS Asset downloaded, URI:", jsAsset.localUri);

        // Lese den Inhalt und schreibe als .js
        const jsContent = await FileSystem.readAsStringAsync(jsAsset.localUri);
        const jsSize = jsContent.length;
        console.log("JS Content size:", Math.round(jsSize/1024), "KB");

        await FileSystem.writeAsStringAsync(
          `${tempDir}renderer.bundle.js`,
          jsContent
        );
        console.log("✓ Copied: renderer.bundle.js (" + Math.round(jsSize/1024) + " KB)");

        // Check if new code is in bundle
        if (jsContent.includes('INIT: Cube created')) {
          console.log("✓ NEW code found in bundle!");
        } else {
          console.log("⚠️ OLD code in bundle - need to restart Expo!");
          console.log("Run: npx expo start -c");
        }

        // Kopiere Texturen
        const texturesDir = `${tempDir}textures/`;
        const texturesDirInfo = await FileSystem.getInfoAsync(texturesDir);
        if (!texturesDirInfo.exists) {
          await FileSystem.makeDirectoryAsync(texturesDir, { intermediates: true });
        }

        try {
          const texture2 = Asset.fromModule(require("./assets/webapp/textures/rosendal_plains_2_1k-rot.hdr"));
          await texture2.downloadAsync();
          await FileSystem.copyAsync({
            from: texture2.localUri,
            to: `${texturesDir}rosendal_plains_2_1k-rot.hdr`
          });
          console.log("✓ Copied: rosendal_plains_2_1k-rot.hdr");
        } catch (err) {
          console.warn("Could not copy texture:", err.message);
        }

        const indexPath = `${tempDir}index.html`;
        console.log("Loading webapp from:", indexPath);
        setWebAppUri(indexPath);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error loading web app:", error);
      setError(error.message);
      setLoading(false);
    }
  };

  // Orientation detection (Mobile only)
  const previousOrientationRef = useRef(null);

  useEffect(() => {
    if (Platform.OS === 'web') return;

    const updateOrientation = () => {
      const { width, height } = Dimensions.get('window');
      const newIsPortrait = height > width;
      const wasPortrait = previousOrientationRef.current;

      // Show tap indicators for 3 seconds on orientation change (not on initial load)
      if (wasPortrait !== null && wasPortrait !== newIsPortrait) {
        console.log('📱 Orientation changed:', newIsPortrait ? 'Portrait' : 'Landscape');
        console.log('🔄 Orientation changed, showing tap indicators');
        setShowTapIndicators(true);
      }

      // Update refs and state
      previousOrientationRef.current = newIsPortrait;
      setIsPortrait(newIsPortrait);
    };

    updateOrientation();
    const subscription = Dimensions.addEventListener('change', updateOrientation);

    return () => {
      subscription?.remove();
    };
  }, []);

  // Show tap indicators after WebView is ready (with delay)
  useEffect(() => {
    if (webAppUri) {
      console.log('🎬 WebView ready, showing tap indicators after 2s');
      const timer = setTimeout(() => {
        console.log('👁️ Showing tap indicators');
        setShowTapIndicators(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [webAppUri]);

  // Fade tap indicators after 3 seconds (Web and Mobile)
  useEffect(() => {
    if (showTapIndicators) {
      console.log('⏱️ TapIndicators: Shown, will hide after 3 seconds');
      const timer = setTimeout(() => {
        console.log('⏱️ TapIndicators: 3 seconds elapsed, hiding now');
        setShowTapIndicators(false);
      }, 3000);
      return () => {
        console.log('⏱️ TapIndicators: Timer cleared');
        clearTimeout(timer);
      };
    } else {
      console.log('⏱️ TapIndicators: Hidden');
    }
  }, [showTapIndicators]);

  // Listen for messages from iframe/WebView (Web only - for menu toggle and state updates)
  useEffect(() => {
    if (Platform.OS === 'web') {
      const handleMessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'menuToggleRequest') {
            // Menu toggle requested from WebView (e.g., via keyboard shortcut F10)
            console.log('📱 Menu toggle requested from WebView');
            setShowMenu(prev => !prev);
          } else if (data.type === 'menuCloseRequest') {
            // Menu close requested from WebView (e.g., click on background)
            console.log('🖱️ Menu close requested from WebView');
            setShowMenu(false);
          } else if (data.type === 'stateUpdate') {
            // State update from WebView (toggle states)
            console.log('🔄 State update from WebView:', data);
            if (data.tumble !== undefined) setTumble(data.tumble);
            if (data.isWireframe !== undefined) setIsWireframe(data.isWireframe);
            if (data.isGold !== undefined) setIsGold(data.isGold);
            if (data.showAxes !== undefined) setShowAxes(data.showAxes);
            if (data.isShowNumbers !== undefined) setIsShowNumbers(data.isShowNumbers);
            if (data.isNormals !== undefined) setIsNormals(data.isNormals);
            if (data.showRotationInfos !== undefined) setShowRotationInfos(data.showRotationInfos);
            if (data.isMirrorCube !== undefined) setIsMirrorCube(data.isMirrorCube);
          }
        } catch (e) {
          // Ignore non-JSON messages
        }
      };

      window.addEventListener('message', handleMessage);
      return () => window.removeEventListener('message', handleMessage);
    }
  }, []);

  // Refocus iframe when menu closes (Web only)
  useEffect(() => {
    if (Platform.OS === 'web' && !showMenu && webViewRef.current && webViewRef.current.contentWindow) {
      // Small delay to ensure menu animation is done
      const timer = setTimeout(() => {
        webViewRef.current.contentWindow.focus();
        console.log('🎯 iframe refocused after menu close');
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [showMenu]);

  // Ref to access current showMenu state without recreating handler
  const showMenuRef = useRef(showMenu);
  useEffect(() => {
    showMenuRef.current = showMenu;
  }, [showMenu]);

  // Keyboard handler for Web (forward keys to iframe, handle Escape and F10 locally)
  useEffect(() => {
    if (Platform.OS === "web") {
      const handleKeyDown = (event) => {
        // Don't forward browser dev tools keys
        const devToolsKeys = ['F5', 'F12'];
        const isDevToolsShortcut = (
          devToolsKeys.includes(event.key) ||
          (event.key === 'I' && (event.ctrlKey || event.metaKey) && event.shiftKey) || // Ctrl+Shift+I / Cmd+Shift+I
          (event.key === 'J' && (event.ctrlKey || event.metaKey) && event.shiftKey) || // Ctrl+Shift+J / Cmd+Shift+J
          (event.key === 'C' && (event.ctrlKey || event.metaKey) && event.shiftKey)    // Ctrl+Shift+C / Cmd+Shift+C
        );

        if (isDevToolsShortcut) {
          // Let browser handle dev tools shortcuts
          return;
        }

        // Escape key to close menu (use ref to get current state)
        if (event.key === 'Escape') {
          if (showMenuRef.current) {
            setShowMenu(false);
            event.preventDefault();
            console.log('⌨️ Menu closed via Escape');
            return;
          }
        }

        // F10 key to toggle menu (handle locally AND forward to iframe)
        if (event.key === 'F10') {
          setShowMenu(prev => !prev);
          event.preventDefault();
          console.log('⌨️ Menu toggled via F10 key (parent handler)');
          // Don't return - still forward to iframe for consistency
        }

        // Forward ALL keys to iframe (so cube controls work even when iframe has focus)
        if (webViewRef.current && webViewRef.current.contentWindow) {
          const iframeWindow = webViewRef.current.contentWindow;
          iframeWindow.postMessage(JSON.stringify({
            action: 'keydown',
            params: {
              key: event.key,
              code: event.code,
              ctrlKey: event.ctrlKey,
              shiftKey: event.shiftKey,
              altKey: event.altKey,
              metaKey: event.metaKey
            }
          }), '*');

          // Prevent default for known shortcuts to avoid browser actions (but not dev tools)
          const shortcuts = ['F1', 'F10', 'F11'];
          if (shortcuts.includes(event.key)) {
            event.preventDefault();
          }

          console.log('⌨️ Forwarded key to iframe:', event.key);
        }
      };

      window.addEventListener('keydown', handleKeyDown, true); // Use capture phase
      console.log('⌨️ Keyboard event handler installed (F1/F10 for menu via iframe, Esc to close)');

      return () => {
        window.removeEventListener('keydown', handleKeyDown, true);
        console.log('⌨️ Keyboard event handler removed');
      };
    }
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom', 'left', 'right']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3d81f6" />
          <Text style={styles.loadingText}>Loading Web App...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom', 'left', 'right']}>
        <View style={styles.loadingContainer}>
          <Text style={styles.errorText}>Error: {error}</Text>
          <Text style={styles.errorDetails}>{error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Hilfsfunktion um Aktionen an iframe zu senden (für Web)
  const sendToIframe = (action, params) => {
    if (webViewRef.current && webViewRef.current.contentWindow) {
      const message = JSON.stringify({ action, params });
      webViewRef.current.contentWindow.postMessage(message, '*');
    }
  };

  // Hilfsfunktion um Aktionen an die WebView zu senden (für Mobile)

  const sendToWebView = (action, params) => {
    console.log('🚀 sendToWebView CALLED:', action, params);

    // Guard: Prevent duplicate identical calls within 100ms
    const now = Date.now();
    const lastSent = lastSentRef.current;
    if (lastSent.action === action &&
        JSON.stringify(lastSent.params) === JSON.stringify(params) &&
        now - lastSent.timestamp < 100) {
      console.warn('⚠️ sendToWebView: Duplicate call blocked!', action);
      return;
    }

    // Update guard
    lastSentRef.current = { action, params, timestamp: now };

    if (webViewRef.current) {
      const message = JSON.stringify({ action, params });
      console.log('📤 Sending postMessage to WebView:', message);
      webViewRef.current.postMessage(message);
    } else {
      console.warn('⚠️ webViewRef.current is null!');
    }
  };

  // Auf Web verwenden wir einen iframe statt WebView für bessere Kompatibilität
  if (Platform.OS === "web") {
    return (
      <View style={styles.unifiedContainer}>
        <StatusBar
          barStyle={showMenu ? "light-content" : "dark-content"}
          backgroundColor="transparent"
        />

        {/* iframe - Fullscreen */}
        <View style={styles.webViewContainer}>
          <iframe
            ref={webViewRef}
            src={webAppUri}
            onLoad={() => {
              // Focus iframe after loading so keyboard events work immediately
              if (webViewRef.current && webViewRef.current.contentWindow) {
                webViewRef.current.contentWindow.focus();
                console.log('🎯 iframe focused after load');
              }
            }}
            style={{
              width: "100%",
              height: "100%",
              border: "none",
            }}
            title="Rubik's Cube Simulator"
          />
        </View>

        {/* Tap Zones (bottom corners) */}
        <TapZones
          onTapLeft={() => {
            console.log('👆 Tap Left: Opening menu, hiding indicators');
            setShowMenu(true);
            setShowTapIndicators(false);
          }}
          onTapRight={() => {
            console.log('👆 Tap Right: Opening menu, hiding indicators');
            setShowMenu(true);
            setShowTapIndicators(false);
          }}
          showIndicators={showTapIndicators}
          visible={!showMenu}
        />

        {/* Menu Overlay */}
        <UnifiedMenuOverlay
          visible={showMenu}
          onClose={() => setShowMenu(false)}
          isDarkMode={isDarkMode}
          sendToWebView={sendToIframe}
          tumble={tumble}
          isWireframe={isWireframe}
          isGold={isGold}
          showAxes={showAxes}
          isShowNumbers={isShowNumbers}
          isNormals={isNormals}
          showRotationInfos={showRotationInfos}
          isMirrorCube={isMirrorCube}
          setTumble={setTumble}
          setIsWireframe={setIsWireframe}
          setIsGold={setIsGold}
          setShowAxes={setShowAxes}
          setIsShowNumbers={setIsShowNumbers}
          setIsNormals={setIsNormals}
          setShowRotationInfos={setShowRotationInfos}
        />
      </View>
    );
  }

  return (
    <View style={styles.unifiedContainer}>
      <StatusBar
        hidden={!isPortrait} // Verstecke in Landscape auf Mobile
        translucent={true}
        barStyle={showMenu ? "light-content" : "dark-content"}
        backgroundColor="transparent"
      />

      {/* WebView Container - Adaptive sizing for Landscape + Menu */}
      <View style={[
        styles.webViewContainer,
        Platform.OS !== 'web' && isPortrait && styles.webViewContainerPortrait,
        Platform.OS !== 'web' && !isPortrait && styles.webViewContainerLandscape,
        // In Landscape: WebView auf rechte Hälfte begrenzen wenn Menu offen
        Platform.OS !== 'web' && !isPortrait && showMenu && styles.webViewContainerLandscapeWithMenu,
      ]}>
        <WebView
          ref={webViewRef}
          source={{ uri: webAppUri }}
          style={styles.webview}
          originWhitelist={['*', 'file://', 'http://', 'https://']}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          allowsInlineMediaPlayback={true}
          mediaPlaybackRequiresUserAction={false}
          allowFileAccess={true}
          allowUniversalAccessFromFileURLs={true}
          allowFileAccessFromFileURLs={true}
          mixedContentMode="always"
          onError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            console.error("WebView error: ", nativeEvent);
          }}
          onHttpError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            console.error("WebView HTTP error: ", nativeEvent);
          }}
          onLoadEnd={() => {
            console.log("WebView loaded successfully");
          }}
          onConsoleMessage={(event) => {
            console.log("WebView console:", event.nativeEvent.message);
          }}
          onMessage={(event) => {
            const messageData = event.nativeEvent.data;
            console.log("Message from WebView:", messageData);

            // Parse and handle structured messages (like Web does)
            try {
              const data = JSON.parse(messageData);

              if (data.type === 'menuToggleRequest') {
                console.log('📱 Menu toggle requested from WebView');
                setShowMenu(prev => !prev);
              } else if (data.type === 'menuCloseRequest') {
                console.log('🖱️ Menu close requested from WebView');
                setShowMenu(false);
              } else if (data.type === 'stateUpdate') {
                console.log('🔄 State update from WebView:', data);
                if (data.tumble !== undefined) setTumble(data.tumble);
                if (data.isWireframe !== undefined) setIsWireframe(data.isWireframe);
                if (data.isGold !== undefined) setIsGold(data.isGold);
                if (data.showAxes !== undefined) setShowAxes(data.showAxes);
                if (data.isShowNumbers !== undefined) setIsShowNumbers(data.isShowNumbers);
                if (data.isNormals !== undefined) setIsNormals(data.isNormals);
                if (data.showRotationInfos !== undefined) setShowRotationInfos(data.showRotationInfos);
                if (data.isMirrorCube !== undefined) setIsMirrorCube(data.isMirrorCube);
              }
            } catch (e) {
              // Ignore non-JSON messages (console logs, etc.)
            }
          }}
          injectedJavaScript={`
            // Ensure document and window are available before any script loads
            console.log('=== WebView Init ===');
            console.log('document:', typeof document);
            console.log('window:', typeof window);
            console.log('document.readyState:', document.readyState);


            // Fange alle Fehler ab
            window.onerror = function(message, source, lineno, colno, error) {
              window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'error',
                message: message,
                source: source,
                lineno: lineno,
                colno: colno,
                stack: error ? error.stack : null
              }));
              return false;
            };

            console.log('WebView error handler initialized');
            true;
          `}
        />
      </View>

      {/* Tap Zones (bottom corners) */}
      <TapZones
        onTapLeft={() => {
          console.log('👆 Tap Left: Opening menu, hiding indicators');
          setShowMenu(true);
          setShowTapIndicators(false);
        }}
        onTapRight={() => {
          console.log('👆 Tap Right: Opening menu, hiding indicators');
          setShowMenu(true);
          setShowTapIndicators(false);
        }}
        showIndicators={showTapIndicators}
        visible={!showMenu}
      />

      {/* Menu Overlay */}
      <UnifiedMenuOverlay
        visible={showMenu}
        onClose={() => setShowMenu(false)}
        isDarkMode={isDarkMode}
        sendToWebView={sendToWebView}
        tumble={tumble}
        isWireframe={isWireframe}
        isGold={isGold}
        showAxes={showAxes}
        isShowNumbers={isShowNumbers}
        isNormals={isNormals}
        showRotationInfos={showRotationInfos}
        isMirrorCube={isMirrorCube}
        setTumble={setTumble}
        setIsWireframe={setIsWireframe}
        setIsGold={setIsGold}
        setShowAxes={setShowAxes}
        setIsShowNumbers={setIsShowNumbers}
        setIsNormals={setIsNormals}
        setShowRotationInfos={setShowRotationInfos}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  // Unified Container (fullscreen)
  unifiedContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  // WebView Container (always fullscreen)
  webViewContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: '#000',
  },

  // Mobile Portrait: Vollbild
  webViewContainerPortrait: {
    // Nutzt base container (100% x 100%)
  },

  // Mobile Landscape: Vollbild
  webViewContainerLandscape: {
    // Nutzt base container (100% x 100%)
  },

  // Mobile Landscape mit geöffnetem Menu: WebView auf rechte Hälfte begrenzen
  webViewContainerLandscapeWithMenu: {
    width: '55%', // Menu nimmt ~45% ein, WebView 55%
    marginLeft: '45%', // Platz für Menu links
  },
  // Old container style (for loading/error screens)
  container: {
    flex: 1,
    backgroundColor: Platform.OS === 'ios' ? "#f5f5f5" : "#fff",
  },
  controlsContainer: {
    backgroundColor: "#f5f5f5",
    paddingTop: 8,
    paddingBottom: 8,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 4,
  },
  buttonRowSingle: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
    marginVertical: 4,
  },
  button: {
    backgroundColor: "#3d81f6",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginHorizontal: 4,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  webview: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  errorText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "red",
    textAlign: "center",
    padding: 20,
  },
  errorDetails: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    padding: 10,
  },
});
