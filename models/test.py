import joblib

model = joblib.load("lightgbm_model.pkl")
feature_list = joblib.load("feature_list.pkl")

print("Model and features loaded successfully")