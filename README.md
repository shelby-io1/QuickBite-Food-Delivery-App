# QuickBite Food Delivery App

A modern React Native (Expo) food delivery application with Firebase integration, API-powered food browsing, local favorites, and order management.

## Features

- **Firebase Authentication** – Register, login, logout with email & password
- **Firebase Firestore** – Place, view, and delete food orders in real-time
- **AsyncStorage** – Save/remove/clear favorite foods locally
- **API Integration** – TheMealDB for meals, DummyJSON for restaurant data
- **Black & Gold Theme** – Premium dark mode design
- **Bottom Tab Navigation** – Dashboard, Food, Restaurants, Orders, Favorites
- **Splash Screen** – Animated intro
- **Profile Editing** – Update display name via modal

## Tech Stack

- React Native (Expo SDK 54)
- React Navigation v6
- Firebase Auth + Firestore
- AsyncStorage
- TheMealDB API + DummyJSON API

## Setup

1. `npm install`
2. Update `src/services/firebase.js` with your Firebase config
3. `npx expo start`

## Screens

| Screen | Purpose |
|--------|---------|
| Splash | Animated logo |
| Welcome | Landing page |
| Login/Signup | Auth with validation |
| Dashboard | Profile, quick actions, logout, edit profile |
| Browse Food | Meal search, favorites toggle, detail view |
| Food Detail | Recipe, ingredients, order placement |
| Restaurants | Curated restaurant cards with addresses & hours |
| Orders | Real-time CRUD via Firestore |
| Favorites | Persisted local favorites |
