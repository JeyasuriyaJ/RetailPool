import joblib
features = joblib.load('feature_list.pkl')
with open('features_out.txt', 'w') as f:
    for feat in features:
        f.write(f"{feat}\n")
print(f"Wrote {len(features)} features to features_out.txt")
