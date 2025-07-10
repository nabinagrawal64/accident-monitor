
# 🚨 Smart Delivery Accident Response System — LogiGuardians

LogiGuardians is an intelligent accident detection and response platform designed to monitor delivery drivers in real-time using a webcam and ML-powered accident prediction. It automatically detects accidents, captures location data, and sends alerts to authorities via email.


## 🚀 Features

- 🎥 Real-time accident detection via webcam
- 📍 Geolocation tracking using browser API
- 🧠 Deep Learning model (ResNet18) to detect accidents
- 🛡️ JWT-based Authentication (Login/Signup)
- 👤 Editable user profile with avatar upload
- 📨 Automatic email alerts with accident details
- 🌐 RESTful API with FastAPI backend

---

## 🛠️ Tech Stack

| Frontend       | Backend          | ML Model            |
|----------------|------------------|----------------------|
| React + Tailwind CSS | FastAPI (Python) | ResNet18 (PyTorch) |
| React Webcam   | SQLite            | Custom classifier   |
| Geolocation API | JWT Auth          | OpenCV for frame capture |

---

## 🔧 Setup Instructions

### 1. Clone the Repo

```bash
git clone https://github.com/nabinagrawal64/accident-monitor.git
````

### 2. Backend (FastAPI + ML)

```bash
cd backend
python -m venv venv
source venv/bin/activate      # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```


Run the FastAPI server:

```bash
uvicorn main:app --reload --port 8000
```

---

### 3. Frontend (React)

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## ✅ User Flow

1. User logs in or signs up
2. App requests camera + location permission
3. Webcam stream is analyzed using ML model
4. If an accident is detected:

   * Geolocation is fetched
   * Report is sent to backend
   * Email is triggered automatically to authorities
5. User profile (name, driver ID, vehicle ID, avatar) can be edited

---

## 📦 Folder Structure

```
.
├── frontend/         # React + Tailwind App
├── backend/          # FastAPI server + ML model + DB
└── README.md
```

---

## 📄 API Overview

| Method | Endpoint         | Description                  |
| ------ | ---------------- | ---------------------------- |
| POST   | /signup          | User registration            |
| POST   | /login           | User login                   |
| PATCH  | /profile         | Update profile info & avatar |
| POST   | /predict         | ML model prediction on frame |
| POST   | /report-accident | Log & notify accident        |
| POST   | /stop-webcam     | Stop backend webcam stream   |

---

## 🧪 ML Model (ResNet18)

The PyTorch model was trained to distinguish accident frames from normal driving using transfer learning on ResNet18. Prediction is done frame-by-frame via webcam stream and analyzed with a confidence threshold.

---

## ✉️ Email Integration

Uses Gmail SMTP (or any provider). Set up in `send_email.py`. Be sure to enable "Less secure apps" or use an **App Password** for Gmail.

---

## 🔐 Environment Variables

Create a `.env` file in `backend/`:

```env
EMAIL_HOST_USER=youremail@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
SECRET_KEY=your_jwt_secret
```


## 🤝 Contributors

* **Nabin Agrawal** — Fullstack Developer 
* **Aman Singh** — ML Integration

