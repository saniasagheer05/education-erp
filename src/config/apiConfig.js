// We route Android through "localhost" too, via an adb reverse tunnel
// (adb reverse tcp:5000 tcp:5000) rather than the 10.0.2.2 SLIRP alias.
// The 10.0.2.2 alias is routed by the emulator's virtual network layer
// and can be unreliable for app-level fetch() on some AVD images/API
// levels even when the system browser reaches it fine (different code
// path). adb reverse creates a literal port tunnel over the same
// ADB/USB debug bridge the emulator already uses, which is far more
// consistent for local backend development.
//
// Before testing on the Android emulator, run this once per emulator
// session (it resets on emulator restart):
//   adb reverse tcp:5000 tcp:5000
//
// If you're testing on a PHYSICAL device via Expo Go instead, adb
// reverse won't apply — set HOST to your machine's LAN IP instead,
// e.g. "192.168.1.10", with your phone on the same Wi-Fi network.
const HOST = "localhost";

export const API_BASE_URL = `http://${HOST}:5000/api`;
