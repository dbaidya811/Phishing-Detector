import pandas as pd
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.ensemble import RandomForestClassifier
from sklearn.pipeline import Pipeline
from sklearn.metrics import classification_report
from joblib import dump

# Load the dataset
df = pd.read_csv('phishing_dataset.csv')

# --- Data Cleaning ---
# Drop rows with missing values
df.dropna(subset=['text', 'label'], inplace=True)
# Clean label column: remove whitespace and convert to lower case
df['label'] = df['label'].str.strip().str.lower()
# Keep only rows with valid labels ('phishing' or 'safe')
df = df[df['label'].isin(['phishing', 'safe'])]

# Display class distribution to confirm
print("Class distribution after cleaning:")
print(df['label'].value_counts())


# Prepare the data
X = df['text']
y = df['label']

# Split the data into training and testing sets
# Using stratified sampling for better distribution
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, random_state=42, stratify=y)

# Create a pipeline with a vectorizer and a more advanced classifier
pipeline = Pipeline([
    ('vectorizer', TfidfVectorizer(stop_words='english', ngram_range=(1, 2))),
    ('classifier', RandomForestClassifier(random_state=42))
])

# Hyperparameter grid
param_grid = {
    'classifier__n_estimators': [100, 200],
    'classifier__max_depth': [None, 10, 20],
    'classifier__min_samples_split': [2, 5],
}

# Grid Search with 5-fold cross-validation
print("\nRunning Grid Search for best hyperparameters...")
grid_search = GridSearchCV(pipeline, param_grid, cv=5, n_jobs=-1, verbose=2)
grid_search.fit(X_train, y_train)

print(f"\nBest parameters: {grid_search.best_params_}")

# Evaluate on test set
y_pred = grid_search.predict(X_test)
print("\nClassification Report on Test Set:")
print(classification_report(y_test, y_pred))

# Save the best model
dump(grid_search.best_estimator_, 'phishing_model.joblib')
print("\nTuned model trained and saved successfully!") 