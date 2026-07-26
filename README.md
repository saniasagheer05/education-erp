# SVCE ERP — Academic Management (React Native / Expo)

A React Native recreation of the "EduCorp ERP" academic management UI, rebranded
for **Sri Venkateshwara College of Engineering**.

## What's included

- **Dashboard** — summary stats and department breakdown
- **Student Registry** — searchable/filterable list of students (mobile card list style)
- **Add Student** — registration form with **Library ID only** (USN field intentionally
  omitted — USN is assigned later in the admission workflow, per requirements)
- **Import Students** — bulk upload / validate / import flow
- **Export Student Data** — filters, export format selection, and a sample record preview
- **Search Student**, **Transfer Student**, **Settings**, **Student Profile detail**

## Navigation structure

- Root: Drawer Navigator (hamburger menu — mirrors the desktop sidebar from the
  reference screenshots: Dashboard, Import Students, Student Registry, Search Student,
  Transfer Student, Export Student Data, Settings)
- Nested inside the drawer's default route: Bottom Tab Navigator (Home, Students,
  Search, Tasks, Settings) — mirrors the mobile bottom nav shown in the reference
  mobile screenshot
- Students tab contains its own stack: Student Registry list → Add Student → Student
  Profile detail

## Getting started

```bash
npm install
npx expo start
```

Then:
- Press `i` to open in iOS simulator (macOS only)
- Press `a` to open in Android emulator
- Or scan the QR code with the **Expo Go** app on your phone

## Project structure

```
App.js
src/
  theme/
    colors.js          # color palette matched to reference screenshots
    typography.js
  data/
    mockStudents.js     # mock data used to populate lists/tables
  components/
    Header.js
    SidebarDrawerContent.js
    StudentCard.js
    StatusBadge.js
  screens/
    DashboardScreen.js
    StudentRegistryScreen.js
    AddStudentScreen.js       # Library ID only, no USN field
    ImportStudentsScreen.js
    ExportStudentDataScreen.js
    SearchStudentScreen.js
    TransferStudentScreen.js
    TasksScreen.js
    SettingsScreen.js
    StudentDetailScreen.js
  navigation/
    RootNavigator.js       # Drawer
    BottomTabs.js           # Bottom tabs
    StudentRegistryStack.js # Stack nested in the Students tab
```

## Notes on the Add Student form

Per requirements, the **USN field has been removed** from the Register/Add Student
screen. Only **Library ID** is collected at registration time; USN is expected to be
assigned and linked later in the admission pipeline. The notice banner on the form has
been updated to reflect this instead of the original "USN and Library ID must be
unique" copy.

All data in this app is mocked locally (`src/data/mockStudents.js`) — there is no
backend wired up. Replace the mock data / add API calls where indicated to connect to
a real service.
