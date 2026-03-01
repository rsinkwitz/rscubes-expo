/**
 * Unified UI for Rubik's Cube - Works on Web, Mobile Portrait, Mobile Landscape
 * Fullscreen WebView with Tap-to-Menu overlay
 */

import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, StyleSheet,
  Platform, Dimensions, TouchableWithoutFeedback, Switch
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

/**
 * Tap Zones (bottom corners) - Opens menu
 */
export function TapZones({ onTapLeft, onTapRight, showIndicators = false }) {
  const insets = useSafeAreaInsets();

  // Calculate bottom position: base (20px) + safe area inset
  const bottomPosition = Platform.OS !== 'web' ? 20 + insets.bottom : 20;

  // Log when showIndicators changes
  React.useEffect(() => {
    console.log('👁️ TapZones: showIndicators =', showIndicators, 'bottomPosition =', bottomPosition);
  }, [showIndicators]);

  return (
    <>
      {/* Left tap zone */}
      <TouchableOpacity
        style={{
          position: 'absolute',
          left: 20,
          bottom: bottomPosition,
          width: 80,
          height: 80,
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 10000,
        }}
        onPress={onTapLeft}
        activeOpacity={0.7}
      >
        {showIndicators && (
          <View style={styles.tapIndicator}>
            <Text style={styles.tapIndicatorText}>👆 Tap for menu</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Right tap zone */}
      <TouchableOpacity
        style={{
          position: 'absolute',
          right: 20,
          bottom: bottomPosition,
          width: 80,
          height: 80,
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 10000,
        }}
        onPress={onTapRight}
        activeOpacity={0.7}
      >
        {showIndicators && (
          <View style={styles.tapIndicator}>
            <Text style={styles.tapIndicatorText}>👆 Tap for menu</Text>
          </View>
        )}
      </TouchableOpacity>
    </>
  );
}

/**
 * Collapsible Section Component
 */
function CollapsibleSection({ title, defaultOpen = false, children, isDarkMode = false }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const textColor = isDarkMode ? '#e0e0e0' : '#333';
  const borderColor = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';

  return (
    <View style={[styles.section, { borderTopColor: borderColor, borderTopWidth: 0 }]}>
      <TouchableOpacity
        style={styles.sectionHeader}
        onPress={() => setIsOpen(!isOpen)}
        activeOpacity={0.7}
      >
        <Text style={[styles.sectionTitle, { color: textColor }]}>
          {isOpen ? '▼' : '▶'} {title}
        </Text>
      </TouchableOpacity>
      {isOpen && (
        <View style={styles.sectionContent}>
          {children}
        </View>
      )}
    </View>
  );
}

/**
 * Menu Overlay - Fullscreen with close button
 * Portrait: Overlay on top of WebView
 * Landscape: Side panel (left 50% of screen)
 */
export function UnifiedMenuOverlay({
  visible,
  onClose,
  isDarkMode = false,
  sendToWebView,
  // Toggle states
  tumble = false,
  isWireframe = false,
  isGold = false,
  showAxes = false,
  isShowNumbers = false,
  isNormals = false,
  showRotationInfos = false,
  isMirrorCube = false,
  // setState functions (like PaDIPS)
  setTumble,
  setIsWireframe,
  setIsGold,
  setShowAxes,
  setIsShowNumbers,
  setIsNormals,
  setShowRotationInfos,
}) {
  const insets = useSafeAreaInsets();
  const { width, height } = Dimensions.get('window');
  const isPortrait = height > width;


  if (!visible) return null;

  const bgColor = isDarkMode ? '#1a1a1a' : '#ffffff';
  const textColor = isDarkMode ? '#e0e0e0' : '#333';

  // Menu width - wider on Web for more buttons, same % on Mobile
  const menuWidth = Platform.OS === 'web' ? 320 : '70%';
  const maxMenuWidth = 380;

  // Menu content - shared between Web and Mobile
  const menuContentJSX = (
    <View style={styles.overlay} pointerEvents="box-none">

      {/* Menu Panel - Fixed width sidebar */}
      <View style={[
        styles.menuPanel,
        {
          width: menuWidth,
          maxWidth: maxMenuWidth,
          backgroundColor: bgColor,
          paddingTop: insets.top,
          paddingBottom: insets.bottom + 20, // Mehr Platz unten für Mobile Portrait
          paddingLeft: Platform.OS === 'web' ? (insets.left + 10) : (insets.left + 4), // Weniger Left-Padding auf Mobile
          paddingRight: insets.right + 10,
          pointerEvents: 'auto', // Menu Panel fängt Touch-Events
        }
      ]}>
        <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1 }}>
          {/* Menu Content with Header inside */}
          <ScrollView
            style={styles.menuContent}
            contentContainerStyle={{ paddingBottom: 20 }} // Extra Padding am Ende des Scroll-Inhalts
          >
            {/* Header with Close Button - now scrollable */}
            <View style={styles.menuHeader}>
              <Text style={[styles.menuTitle, { color: textColor }]}>
                🧊 RS Cubes
              </Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={onClose}
              >
                <Text style={styles.closeButtonText}>✖</Text>
              </TouchableOpacity>
            </View>

            {/* Cube Controls - Two rows of buttons */}
            <View style={styles.controlSection}>
              <Text style={[styles.sectionTitle, { color: textColor }]}>
                🎮 Cube Controls
              </Text>

              {/* Row 1: Shape morphing + Mirror */}
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={styles.controlButton}
                  onPress={() => sendToWebView && sendToWebView('morph', 0)}
                >
                  <Text style={styles.buttonText}>3×3</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.controlButton}
                  onPress={() => sendToWebView && sendToWebView('morph', 1)}
                >
                  <Text style={styles.buttonText}>2×2</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.controlButton}
                  onPress={() => sendToWebView && sendToWebView('morph', 3)}
                >
                  <Text style={styles.buttonText}>Pyra</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.controlButton}
                  onPress={() => sendToWebView && sendToWebView('mirror')}
                >
                  <Text style={styles.buttonText}>🪞 Mirror</Text>
                </TouchableOpacity>
              </View>

              {/* Row 2: Actions */}
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={styles.controlButton}
                  onPress={() => sendToWebView && sendToWebView('undo')}
                >
                  <Text style={styles.buttonText}>↶ Undo</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.controlButton}
                  onPress={() => sendToWebView && sendToWebView('redo')}
                >
                  <Text style={styles.buttonText}>↷ Redo</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.controlButton}
                  onPress={() => sendToWebView && sendToWebView('shuffle', 10)}
                >
                  <Text style={styles.buttonText}>🎲 Shuffle</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Divider */}
            <View style={[styles.divider, { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }]} />

            {/* View Section */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: textColor }]}>
                👁️ View
              </Text>

              {/* View Toggles */}
              <View style={styles.toggleGroup}>
                <View style={styles.toggleItem}>
                  <Text style={[styles.toggleLabel, { color: textColor }]}>Tumble</Text>
                  <Switch
                    value={tumble}
                    onValueChange={(val) => {
                      setTumble(val);
                      sendToWebView && sendToWebView('setTumble', val);
                    }}
                    trackColor={{ false: '#ccc', true: '#4CAF50' }}
                    thumbColor={tumble ? '#fff' : '#f4f3f4'}
                  />
                </View>
                <View style={styles.toggleItem}>
                  <Text style={[styles.toggleLabel, { color: textColor }]}>Turn Letters</Text>
                  <Switch
                    value={showRotationInfos}
                    onValueChange={(val) => {
                      setShowRotationInfos(val);
                      sendToWebView && sendToWebView('setTurnLetters', val);
                    }}
                    trackColor={{ false: '#ccc', true: '#4CAF50' }}
                    thumbColor={showRotationInfos ? '#fff' : '#f4f3f4'}
                  />
                </View>
                {/* Gold Mirror - only visible when in mirror mode */}
                {isMirrorCube && (
                  <View style={styles.toggleItem}>
                    <Text style={[styles.toggleLabel, { color: textColor }]}>Gold Mirror</Text>
                    <Switch
                      value={isGold}
                      onValueChange={(val) => {
                        setIsGold(val);
                        sendToWebView && sendToWebView('setGold', val);
                      }}
                      trackColor={{ false: '#ccc', true: '#4CAF50' }}
                      thumbColor={isGold ? '#fff' : '#f4f3f4'}
                    />
                  </View>
                )}
              </View>

              {/* Quick View - for solving (peek at other sides) */}
              <View style={{ marginTop: 6 }}>
                <Text style={[styles.subLabel, { color: textColor }]}>Quick View (while solving)</Text>
                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    style={styles.smallButton}
                    onPress={() => sendToWebView && sendToWebView('rotateByButton', 'y')}
                  >
                    <Text style={styles.smallButtonText}>Y+</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.smallButton}
                    onPress={() => sendToWebView && sendToWebView('rotateByButton', 'Y')}
                  >
                    <Text style={styles.smallButtonText}>Y-</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.smallButton}
                    onPress={() => sendToWebView && sendToWebView('toggleViewRight')}
                  >
                    <Text style={styles.smallButtonText}>L/R</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.smallButton}
                    onPress={() => sendToWebView && sendToWebView('toggleViewBack')}
                  >
                    <Text style={styles.smallButtonText}>Back</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.smallButton}
                    onPress={() => sendToWebView && sendToWebView('toggleViewUnder')}
                  >
                    <Text style={styles.smallButtonText}>Under</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.smallButton}
                    onPress={() => sendToWebView && sendToWebView('resetView')}
                  >
                    <Text style={styles.smallButtonText}>Reset</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Color Presets */}
              <View style={{ marginTop: 6 }}>
                <Text style={[styles.subLabel, { color: textColor }]}>Color Presets</Text>
                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    style={styles.smallButton}
                    onPress={() => sendToWebView && sendToWebView('setPyraColors')}
                  >
                    <Text style={styles.smallButtonText}>Pyra</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.smallButton}
                    onPress={() => sendToWebView && sendToWebView('setDefaultColors')}
                  >
                    <Text style={styles.smallButtonText}>Cube</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Divider */}
            <View style={[styles.divider, { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }]} />

            {/* Debug Section - Collapsible */}
            <CollapsibleSection title="🔧 Debug" defaultOpen={false} isDarkMode={isDarkMode}>
              <View style={styles.toggleGroup}>
                <View style={styles.toggleItem}>
                  <Text style={[styles.toggleLabel, { color: textColor }]}>Wireframe</Text>
                  <Switch
                    value={isWireframe}
                    onValueChange={(val) => {
                      setIsWireframe(val);
                      sendToWebView && sendToWebView('setWireframe', val);
                    }}
                    trackColor={{ false: '#ccc', true: '#4CAF50' }}
                    thumbColor={isWireframe ? '#fff' : '#f4f3f4'}
                  />
                </View>
                <View style={styles.toggleItem}>
                  <Text style={[styles.toggleLabel, { color: textColor }]}>Axes</Text>
                  <Switch
                    value={showAxes}
                    onValueChange={(val) => {
                      setShowAxes(val);
                      sendToWebView && sendToWebView('setAxes', val);
                    }}
                    trackColor={{ false: '#ccc', true: '#4CAF50' }}
                    thumbColor={showAxes ? '#fff' : '#f4f3f4'}
                  />
                </View>
                <View style={styles.toggleItem}>
                  <Text style={[styles.toggleLabel, { color: textColor }]}>Numbers</Text>
                  <Switch
                    value={isShowNumbers}
                    onValueChange={(val) => {
                      setIsShowNumbers(val);
                      sendToWebView && sendToWebView('setNumbers', val);
                    }}
                    trackColor={{ false: '#ccc', true: '#4CAF50' }}
                    thumbColor={isShowNumbers ? '#fff' : '#f4f3f4'}
                  />
                </View>
                <View style={styles.toggleItem}>
                  <Text style={[styles.toggleLabel, { color: textColor }]}>Normals</Text>
                  <Switch
                    value={isNormals}
                    onValueChange={(val) => {
                      setIsNormals(val);
                      sendToWebView && sendToWebView('setNormals', val);
                    }}
                    trackColor={{ false: '#ccc', true: '#4CAF50' }}
                    thumbColor={isNormals ? '#fff' : '#f4f3f4'}
                  />
                </View>
              </View>
            </CollapsibleSection>
          </ScrollView>

          {/* Footer - nur auf Web */}
          {Platform.OS === 'web' && (
            <View style={styles.menuFooter}>
              <Text style={[styles.footerText, { color: textColor }]}>
                [F1] for help • [F10] to close menu
              </Text>
            </View>
          )}
        </SafeAreaView>
      </View>
    </View>
  );

  // Render directly (no Modal) to allow touch events to pass through to WebView
  // pointerEvents: 'box-none' on overlay allows touches outside menu to reach WebView
  return menuContentJSX;
}


const styles = StyleSheet.create({
  // Tap Zones
  tapIndicator: {
    backgroundColor: 'rgba(61, 129, 246, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  tapIndicatorText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  // Menu Overlay
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    flexDirection: 'row',
    zIndex: 9999,
    pointerEvents: 'box-none', // Allow clicks to pass through to WebView
  },
  menuPanel: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderTopRightRadius: Platform.OS !== 'web' ? 12 : 0,
    borderBottomRightRadius: Platform.OS !== 'web' ? 12 : 0,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingTop: 2,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: '#f44336',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  menuContent: {
    flex: 1,
    padding: 6,
  },
  section: {
    marginBottom: 4,
    borderTopWidth: 0,
    paddingTop: 4,
  },
  sectionHeader: {
    paddingVertical: 4,
  },
  sectionContent: {
    paddingLeft: 8,
    paddingTop: 4,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  subLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
    marginBottom: 4,
    opacity: 0.8,
  },
  dummyText: {
    fontSize: 14,
    marginBottom: 4,
    paddingLeft: 10,
  },
  menuFooter: {
    paddingHorizontal: 10,
    paddingTop: 8,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 11,
    fontStyle: 'italic',
  },

  // Control Section
  controlSection: {
    marginTop: 0,
    marginBottom: 4,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 3,
    flexWrap: 'wrap',
  },
  controlButton: {
    backgroundColor: '#3d81f6',
    paddingHorizontal: 6,
    paddingVertical: 7,
    borderRadius: 6,
    marginHorizontal: 2,
    marginVertical: 2,
    minWidth: 48,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 13,
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    marginVertical: 6,
  },

  // Toggle Group
  toggleGroup: {
    marginTop: 2,
  },
  toggleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 1,
    paddingHorizontal: 4,
    minHeight: 32,
  },
  toggleLabel: {
    fontSize: 13,
    flex: 1,
  },

  // Small Buttons (for view controls)
  smallButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 6,
    paddingVertical: 6,
    borderRadius: 4,
    marginHorizontal: 1,
    marginVertical: 2,
    minWidth: 42,
    alignItems: 'center',
  },
  smallButtonText: {
    color: 'white',
    fontSize: 11,
    fontWeight: 'bold',
  },
});

