/**
 * Unified UI for Rubik's Cube - Works on Web, Mobile Portrait, Mobile Landscape
 * Fullscreen WebView with Tap-to-Menu overlay
 */

import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, StyleSheet,
  Platform, Dimensions, TouchableWithoutFeedback, Switch
} from 'react-native';
import Slider from '@react-native-community/slider';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

/**
 * Tap Zones (bottom corners) - Opens menu
 * Tap zones are always active when menu is closed
 * Indicators only show temporarily (controlled by showIndicators)
 */
export function TapZones({ onTapLeft, onTapRight, showIndicators = false, visible = true }) {
  const insets = useSafeAreaInsets();

  // Calculate bottom position: base (20px) + safe area inset
  const bottomPosition = Platform.OS !== 'web' ? 20 + insets.bottom : 20;

  // Log when showIndicators changes
  React.useEffect(() => {
    console.log('👁️ TapZones: showIndicators =', showIndicators, 'bottomPosition =', bottomPosition);
  }, [showIndicators]);

  // Don't render tap zones when not visible (e.g., when menu is open)
  if (!visible) return null;

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
  isPortrait = true,
  // Toggle states
  tumbleLevel = 0, // 0-4
  isWireframe = false,
  isGold = false,
  showAxes = false,
  isShowNumbers = false,
  isNormals = false,
  showRotationInfos = false,
  isMirrorCube = false,
  cameraLock = false,
  isViewRight = true,
  isViewBack = false,
  isViewUnder = false,
  // Stereo states
  stereoMode = 'off',
  eyeSeparation = 8.0, // in cm
  cubeDepth = 0.0, // in meters
  // setState functions (like PaDIPS)
  setTumbleLevel,
  setIsWireframe,
  setIsGold,
  setShowAxes,
  setIsShowNumbers,
  setIsNormals,
  setShowRotationInfos,
  setCameraLock,
  setStereoMode,
  setEyeSeparation,
  setCubeDepth,
}) {
  const insets = useSafeAreaInsets();
  const { width, height } = Dimensions.get('window');
  const isPortraitLocal = height > width;


  if (!visible) return null;

  const bgColor = isDarkMode ? '#1a1a1a' : '#ffffff';
  const textColor = isDarkMode ? '#e0e0e0' : '#333';

  // Web Stereo-Mode: Nur obere Hälfte nutzen
  const isWebStereo = Platform.OS === 'web' && (stereoMode === 'topbottom' || stereoMode === 'sidebyside');

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
        },
        isWebStereo && styles.menuPanelWebStereo,
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
                  style={[
                    styles.controlButton,
                    { backgroundColor: isMirrorCube ? '#4CAF50' : '#3d81f6' }
                  ]}
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
                <TouchableOpacity
                  style={styles.controlButton}
                  onPress={() => sendToWebView && sendToWebView('resetMain')}
                >
                  <Text style={styles.buttonText}>🔄 Reset</Text>
                </TouchableOpacity>
                {Platform.OS === 'web' && (
                  <TouchableOpacity
                    style={styles.controlButton}
                    onPress={() => {
                      // Request fullscreen on the document element
                      const elem = document.documentElement;
                      if (!document.fullscreenElement) {
                        // Enter fullscreen
                        if (elem.requestFullscreen) {
                          elem.requestFullscreen();
                        } else if (elem.webkitRequestFullscreen) { // Safari
                          elem.webkitRequestFullscreen();
                        } else if (elem.mozRequestFullScreen) { // Firefox
                          elem.mozRequestFullScreen();
                        } else if (elem.msRequestFullscreen) { // IE/Edge
                          elem.msRequestFullscreen();
                        }
                        console.log('🖥️ Entering fullscreen');
                      } else {
                        // Exit fullscreen
                        if (document.exitFullscreen) {
                          document.exitFullscreen();
                        } else if (document.webkitExitFullscreen) { // Safari
                          document.webkitExitFullscreen();
                        } else if (document.mozCancelFullScreen) { // Firefox
                          document.mozCancelFullScreen();
                        } else if (document.msExitFullscreen) { // IE/Edge
                          document.msExitFullscreen();
                        }
                        console.log('🖥️ Exiting fullscreen');
                      }
                    }}
                  >
                    <Text style={styles.buttonText}>⛶</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* Divider */}
            <View style={[styles.divider, { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }]} />

            {/* View Section */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: textColor }]}>
                👁️ View
              </Text>

              {/* Tumble Slider - Full width on its own row */}
              <View style={styles.toggleGroup}>
                <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 2, minHeight: 32, paddingHorizontal: 4 }}>
                  <Text style={[styles.toggleLabel, { color: textColor, width: '35%', flexShrink: 0 }]}>Tumble</Text>
                  <View style={{ width: '65%', paddingLeft: 8 }}>
                    <Slider
                      style={{ width: '100%', height: 40 }}
                      minimumValue={0}
                      maximumValue={4}
                      step={1}
                      value={tumbleLevel}
                      onValueChange={(val) => {
                        setTumbleLevel(val);
                        sendToWebView && sendToWebView('setTumbleLevel', val);
                      }}
                      minimumTrackTintColor="#4CAF50"
                      maximumTrackTintColor="#ccc"
                      thumbTintColor="#4CAF50"
                    />
                  </View>
                </View>
              </View>

              {/* Turn Letters and Camera Lock - in one row on Web/Landscape, stacked in portrait */}
              <View style={[
                styles.toggleGroup,
                (Platform.OS === 'web' || !isPortrait) ? { flexDirection: 'row', justifyContent: 'space-between' } : {}
              ]}>
                <View style={[
                  styles.toggleItem,
                  (Platform.OS === 'web' || !isPortrait) ? { flex: 1, marginRight: 4 } : {}
                ]}>
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
                <View style={[
                  styles.toggleItem,
                  (Platform.OS === 'web' || !isPortrait) ? { flex: 1, marginLeft: 4 } : {}
                ]}>
                  <Text style={[styles.toggleLabel, { color: textColor }]}>Camera Lock</Text>
                  <Switch
                    value={cameraLock}
                    onValueChange={(val) => {
                      setCameraLock(val);
                      sendToWebView && sendToWebView('setCameraLock', val);
                    }}
                    trackColor={{ false: '#ccc', true: '#4CAF50' }}
                    thumbColor={cameraLock ? '#fff' : '#f4f3f4'}
                  />
                </View>
              </View>

              {/* Gold Mirror - only visible when in mirror mode */}
              {isMirrorCube && (
                <View style={styles.toggleGroup}>
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
                </View>
              )}

              {/* Turn - Whole cube rotation */}
              <View style={{ marginTop: 6 }}>
                <View style={[styles.buttonRow, { justifyContent: 'flex-start' }]}>
                  <Text style={[styles.subLabel, { color: textColor, marginTop: 0, marginBottom: 0, marginRight: 8 }]}>Turn</Text>
                  <TouchableOpacity
                    style={styles.smallButton}
                    onPress={() => sendToWebView && sendToWebView('rotateByButton', 'x')}
                  >
                    <Text style={styles.arrowButtonText}>↑</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.smallButton}
                    onPress={() => sendToWebView && sendToWebView('rotateByButton', 'X')}
                  >
                    <Text style={styles.arrowButtonText}>↓</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.smallButton}
                    onPress={() => sendToWebView && sendToWebView('rotateByButton', 'y')}
                  >
                    <Text style={styles.arrowButtonText}>←</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.smallButton}
                    onPress={() => sendToWebView && sendToWebView('rotateByButton', 'Y')}
                  >
                    <Text style={styles.arrowButtonText}>→</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Look - Quick view for solving (now with toggle states) */}
              <View style={{ marginTop: 6 }}>
                <View style={[styles.buttonRow, { justifyContent: 'flex-start' }]}>
                  <Text style={[styles.subLabel, { color: textColor, marginTop: 0, marginBottom: 0, marginRight: 8 }]}>Look</Text>
                  <TouchableOpacity
                    style={[
                      styles.smallButton,
                      { backgroundColor: isViewRight ? '#3d81f6' : '#4CAF50' }
                    ]}
                    onPress={() => sendToWebView && sendToWebView('toggleViewRight')}
                  >
                    <Text style={styles.smallButtonText}>L/R</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.smallButton,
                      { backgroundColor: isViewBack ? '#4CAF50' : '#3d81f6' }
                    ]}
                    onPress={() => sendToWebView && sendToWebView('toggleViewBack')}
                  >
                    <Text style={styles.smallButtonText}>Back</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.smallButton,
                      { backgroundColor: isViewUnder ? '#4CAF50' : '#3d81f6' }
                    ]}
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
              {/* Row 1: Wireframe and Axes (or stacked in portrait) */}
              <View style={[
                styles.toggleGroup,
                (Platform.OS === 'web' || !isPortrait) ? { flexDirection: 'row', justifyContent: 'space-between' } : {}
              ]}>
                <View style={[
                  styles.toggleItem,
                  (Platform.OS === 'web' || !isPortrait) ? { flex: 1, marginRight: 4 } : {}
                ]}>
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
                <View style={[
                  styles.toggleItem,
                  (Platform.OS === 'web' || !isPortrait) ? { flex: 1, marginLeft: 4 } : {}
                ]}>
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
              </View>

              {/* Row 2: Numbers and Normals (or stacked in portrait) */}
              <View style={[
                styles.toggleGroup,
                (Platform.OS === 'web' || !isPortrait) ? { flexDirection: 'row', justifyContent: 'space-between' } : {}
              ]}>
                <View style={[
                  styles.toggleItem,
                  (Platform.OS === 'web' || !isPortrait) ? { flex: 1, marginRight: 4 } : {}
                ]}>
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
                <View style={[
                  styles.toggleItem,
                  (Platform.OS === 'web' || !isPortrait) ? { flex: 1, marginLeft: 4 } : {}
                ]}>
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

            {/* Divider */}
            <View style={[styles.divider, { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }]} />

            {/* Stereo Section - Collapsible */}
            <CollapsibleSection title="🕶️ 3D Stereo" defaultOpen={false} isDarkMode={isDarkMode}>
              {/* Stereo Mode Toggle */}
              <View style={styles.toggleGroup}>
                <View style={styles.toggleItem}>
                  <Text style={[styles.toggleLabel, { color: textColor }]}>Stereo Mode [3]</Text>
                  <Switch
                    value={stereoMode !== 'off'}
                    onValueChange={(val) => {
                      if (!val) {
                        setStereoMode('off');
                        sendToWebView && sendToWebView('setStereoMode', 'off');
                      } else {
                        // Choose mode based on platform and orientation
                        let mode;
                        if (Platform.OS === 'web') {
                          mode = 'topbottom';
                        } else if (isPortraitLocal) {
                          mode = 'anaglyph';
                        } else {
                          mode = 'sidebyside';
                        }
                        setStereoMode(mode);
                        sendToWebView && sendToWebView('setStereoMode', mode);
                      }
                    }}
                    trackColor={{ false: '#ccc', true: '#E91E63' }}
                    thumbColor={stereoMode !== 'off' ? '#fff' : '#f4f3f4'}
                  />
                </View>
              </View>

              {/* Stereo Parameters - Only visible when stereo is active */}
              {stereoMode !== 'off' && (
                <>
                  {/* Eye Separation Slider */}
                  <View style={styles.sliderGroup}>
                    <View style={styles.sliderHeader}>
                      <Text style={[styles.toggleLabel, { color: textColor, flex: 1 }]}>
                        Eye Separation
                      </Text>
                      <Text style={[styles.sliderValue, { color: textColor }]}>
                        {eyeSeparation.toFixed(1)} cm
                      </Text>
                    </View>
                    <Slider
                      style={styles.slider}
                      minimumValue={5}
                      maximumValue={15}
                      step={0.2}
                      value={eyeSeparation}
                      onValueChange={(val) => {
                        setEyeSeparation(val);
                        sendToWebView && sendToWebView('setEyeSeparation', val / 100); // cm to m
                      }}
                      minimumTrackTintColor="#E91E63"
                      maximumTrackTintColor="#ddd"
                    />
                  </View>

                  {/* Cube Depth Slider */}
                  <View style={styles.sliderGroup}>
                    <View style={styles.sliderHeader}>
                      <Text style={[styles.toggleLabel, { color: textColor, flex: 1 }]}>
                        Cube Depth
                      </Text>
                      <Text style={[styles.sliderValue, { color: textColor }]}>
                        {cubeDepth.toFixed(1)} m
                      </Text>
                    </View>
                    <Slider
                      style={styles.slider}
                      minimumValue={-2}
                      maximumValue={2}
                      step={0.1}
                      value={cubeDepth}
                      onValueChange={(val) => {
                        setCubeDepth(val);
                        sendToWebView && sendToWebView('setCubeDepth', val);
                      }}
                      minimumTrackTintColor="#E91E63"
                      maximumTrackTintColor="#ddd"
                    />
                  </View>

                  {/* Stereo Mode Info */}
                  <View style={styles.infoBox}>
                    <Text style={[styles.infoText, { color: textColor }]}>
                      {stereoMode === 'anaglyph' && '🎨 Red-Blue Anaglyph (3D glasses)'}
                      {stereoMode === 'topbottom' && '📺 Top-Bottom (for projectors)'}
                      {stereoMode === 'sidebyside' && '🥽 Side-by-Side (VR Cardboard)'}
                    </Text>
                  </View>
                </>
              )}
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
  },
  menuPanelWebStereo: {
    // Web Stereo-Mode: Nur obere Hälfte
    maxHeight: '50%',
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
    marginTop: 0,
  },
  toggleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 2,
    paddingHorizontal: 4,
    minHeight: 32,
  },
  toggleLabel: {
    fontSize: 13,
    flex: 1,
  },
  sliderValue: {
    fontSize: 11,
    textAlign: 'center',
    marginTop: -8,
  },

  // Small Buttons (for view controls)
  smallButton: {
    backgroundColor: '#3d81f6',
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
  arrowButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },

  // Stereo Controls
  sliderGroup: {
    marginTop: 6,
    marginBottom: 6,
    paddingHorizontal: 4,
  },
  sliderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  slider: {
    width: '100%',
    height: 30,
  },
  infoBox: {
    backgroundColor: 'rgba(233, 30, 99, 0.1)',
    borderRadius: 6,
    padding: 8,
    marginTop: 6,
  },
  infoText: {
    fontSize: 11,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

