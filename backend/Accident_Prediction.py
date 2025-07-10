# Updated Real-Time Webcam Predictor for accident_classifier_resnet18.pth
import os
import cv2
import torch
import torch.nn as nn
from torchvision import transforms, models
from PIL import Image

# Constants
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")
MODEL_PATH = r"C:\Users\nabin\OneDrive\Desktop\spartkathon\backend\accident_classifier_resnet18.pth"
CONFIDENCE_THRESHOLD = 0.5
QUIT_SIGNAL_FILE = "quit_webcam.txt"  # 🛑 Quit flag path

# Load trained model directly
def load_model():
    model = models.resnet18(weights=None)
    num_ftrs = model.fc.in_features
    model.fc = nn.Sequential(
        nn.Linear(num_ftrs, 256),
        nn.LeakyReLU(),
        nn.Dropout(0.3),
        nn.Linear(256, 2)
    )
    model.load_state_dict(torch.load(MODEL_PATH, map_location=DEVICE))
    model.to(DEVICE)
    model.eval()
    return model

# Preprocessing pipeline
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
])

# Predict function
def predict_frame(model, frame):
    img = Image.fromarray(frame).convert("RGB")
    tensor = transform(img).unsqueeze(0).to(DEVICE)
    with torch.no_grad():
        output = model(tensor)
        probs = torch.softmax(output, dim=1)[0]
        return probs[1].item()  # Probability of accident

# Main webcam function
def run_webcam():
    model = load_model()
    cap = cv2.VideoCapture(0)
    print("📷 Starting webcam. Press 'q' to quit.")

    while True:
        # 🛑 External stop condition
        if os.path.exists(QUIT_SIGNAL_FILE):
            print("🛑 Quit signal received (via file). Stopping webcam...")
            break

        ret, frame = cap.read()
        if not ret:
            break

        confidence = predict_frame(model, frame)
        is_accident = confidence > CONFIDENCE_THRESHOLD
        result = 1 if is_accident else 0
        print(result)  # Output to bash: 1 for accident, 0 for normal

        label = f"🚨 Accident ({confidence:.2f})" if is_accident else f"✅ Normal ({confidence:.2f})"
        color = (0, 0, 255) if is_accident else (0, 255, 0)

        cv2.putText(frame, label, (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, color, 2)
        cv2.imshow("Real-Time Accident Detector", frame)

        if cv2.waitKey(1) & 0xFF == ord("q"):
            print("🧍 Quit key pressed.")
            break

    cap.release()
    cv2.destroyAllWindows()
    if os.path.exists(QUIT_SIGNAL_FILE):
        os.remove(QUIT_SIGNAL_FILE)

if __name__ == "__main__":
    run_webcam()
